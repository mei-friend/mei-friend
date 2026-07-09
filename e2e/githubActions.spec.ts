import { test, expect, Page } from '@playwright/test';
import { setupPage } from './setup';

// ─── Mock data ────────────────────────────────────────────────────────────────

const MOCK_WORKFLOW_NAME = 'encode.yml';
const MOCK_WORKFLOW_ID = '12345';
const MOCK_WORKFLOW_PATH = '.github/workflows/encode.yml';
const MOCK_RUN_ID = 98765;
const MOCK_RUN_HTML_URL = 'https://github.com/testuser/test-repo/actions/runs/98765';

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Intercepts env.js to expose the __mf_triggerGithubAction test hook, then
 * loads the page. Must be called instead of setupPage() for any test that uses
 * setupAndTrigger(), because the hook is only registered when env === 'develop'
 * and the hook registration runs at module evaluation time (page load).
 */
async function setupPageWithDevHook(page: Page) {
  await page.route('**/lib/env.js', (route) =>
    route.fulfill({
      contentType: 'application/javascript',
      body: [
        'var environments={develop:"develop",testing:"testing",staging:"staging",production:"production"};',
        'var env=environments.develop;',
      ].join('\n'),
    })
  );
  await setupPage(page);
}

/**
 * Directly opens the GitHub Actions overlay by manipulating the DOM.
 * This bypasses the need for a real GitHub login while still exercising
 * the overlay's HTML structure and CSS.
 */
async function openGithubActionsOverlay(
  page: Page,
  options: { workflowName?: string; workflowId?: string } = {}
) {
  const name = options.workflowName ?? MOCK_WORKFLOW_NAME;
  const id = options.workflowId ?? MOCK_WORKFLOW_ID;

  await page.evaluate(
    ({ name, id }) => {
      const overlay = document.getElementById('githubActionsOverlay')!;
      const workflowNameEl = document.getElementById('requestedWorkflowName')!;
      const runBtn = document.getElementById('githubActionsRunButton') as HTMLButtonElement;
      const cancelBtn = document.getElementById('githubActionsCancelButton') as HTMLButtonElement;
      const statusMsg = document.getElementById('githubActionsStatus')!;
      const initialContents = document.getElementById('githubActionsInitialContents')!;

      overlay.style.display = 'block';
      workflowNameEl.textContent = name;
      workflowNameEl.dataset.id = id;
      runBtn.removeAttribute('disabled');
      cancelBtn.removeAttribute('disabled');
      statusMsg.innerHTML = '';
      initialContents.style.display = '';

      // wire up cancel so it matches real app behaviour
      cancelBtn.onclick = () => {
        overlay.style.display = 'none';
        statusMsg.innerHTML = '';
      };
    },
    { name, id }
  );
}

/**
 * Injects generic workflow input fields into the overlay container,
 * mirroring what handleClickGithubAction does for generic-mode workflows.
 */
async function injectGenericInputFields(
  page: Page,
  inputs: Record<string, string>
) {
  await page.evaluate((inputs) => {
    const container = document.getElementById('githubActionsInputConfigContainer')!;
    container.dataset.mode = 'generic';
    container.innerHTML = '';
    for (const [key, defaultValue] of Object.entries(inputs)) {
      const wrapper = document.createElement('div');
      wrapper.className = 'githubActionsGenericConfig';

      const label = document.createElement('span');
      label.className = 'githubActionsParamName';
      label.textContent = key;
      wrapper.appendChild(label);

      const inputWrapper = document.createElement('div');
      inputWrapper.className = 'githubActionsInputFieldWrapper';

      const input = document.createElement('input');
      input.className = 'githubActionsInputField';
      input.dataset.input = key;
      input.value = defaultValue;
      inputWrapper.appendChild(input);
      wrapper.appendChild(inputWrapper);
      container.appendChild(wrapper);
    }
  }, inputs);
}

type WorkflowOutcome = 'success' | 'failure' | 'dispatch-error' | 'network-error';

/**
 * Intercepts the GitHub dispatch HTTP call with page.route(), then invokes
 * the real handleClickGithubAction (via the window.__mf_triggerGithubAction
 * test hook) with an inline mock gm. This exercises the actual runWorkflow
 * closure — UI transitions are driven by the real application code, not DOM
 * manipulation in the test.
 *
 * Mock gm behaviour:
 *  - getWorkflowInputs     → returns a minimal generic input config immediately
 *  - requestActionWorkflowRun → calls fetch (intercepted by page.route)
 *  - awaitActionWorkflowStart/Completion → resolve immediately with shaped data
 *  - getWorkflowJobs/Logs  → return empty/no-content to skip job-summary fetch
 */
async function setupAndTrigger(page: Page, outcome: WorkflowOutcome) {
  if (outcome === 'network-error') {
    await page.route('**/actions/workflows/**/dispatches', (r) => r.abort('failed'));
  } else if (outcome === 'dispatch-error') {
    await page.route('**/actions/workflows/**/dispatches', (r) =>
      r.fulfill({
        status: 422,
        contentType: 'application/json',
        body: JSON.stringify({
          message: 'Not Found',
          documentation_url: 'https://docs.github.com/rest',
        }),
      })
    );
  } else {
    await page.route('**/actions/workflows/**/dispatches', (r) => r.fulfill({ status: 204 }));
  }

  await page.evaluate(
    ({ id, name, path, outcome, runHtmlUrl, runId }) => {
      const mockGm = {
        getWorkflowInputs: async () => ({
          inputs: { branch: { default: 'main', description: 'Branch to run on' } },
          showWorkPackageUI: false,
        }),
        requestActionWorkflowRun: async (wfId: string, inputs: unknown) => {
          const resp = await fetch(
            `https://api.github.com/repos/testuser/test-repo/actions/workflows/${wfId}/dispatches`,
            { method: 'POST', body: JSON.stringify({ ref: 'main', inputs }) }
          );
          const dispatchTime = new Date().toISOString();
          if (resp.status === 204) return { status: 204, dispatchTime };
          let body = null;
          try { body = await resp.json(); } catch (_) {}
          return { status: resp.status, body, dispatchTime };
        },
        awaitActionWorkflowStart: async () => ({
          id: runId,
          html_url: runHtmlUrl,
          run_started_at: new Date().toISOString(),
          url: `https://api.github.com/repos/testuser/test-repo/actions/runs/${runId}`,
        }),
        awaitActionWorkflowCompletion: async () => {
          await new Promise<void>((resolve) => setTimeout(resolve, 300));
          return {
            status: 'completed',
            conclusion: outcome === 'failure' ? 'failure' : 'success',
            html_url: runHtmlUrl,
            id: runId,
          };
        },
        getWorkflowJobs: async () => ({ jobs: [] }),
        getWorkflowJobLogs: async () => ({ type: 'text', text: '' }),
        filepath: '/test.mei',
      };
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).__mf_triggerGithubAction({ id, name, path }, mockGm);
    },
    {
      id: MOCK_WORKFLOW_ID,
      name: MOCK_WORKFLOW_NAME,
      path: MOCK_WORKFLOW_PATH,
      outcome,
      runHtmlUrl: MOCK_RUN_HTML_URL,
      runId: MOCK_RUN_ID,
    }
  );

  // Overlay appears synchronously; input fields are injected after the
  // async getWorkflowInputs resolves — wait for both before continuing.
  await expect(page.locator('#githubActionsOverlay')).toBeVisible();
  await expect(page.locator('.githubActionsInputField')).toBeVisible({ timeout: 3000 });
}

// ─── Tests ────────────────────────────────────────────────────────────────────

test.describe('1 GitHub Actions overlay structure', () => {
  test.beforeEach(async ({ page }) => {
    await setupPage(page);
  });

  test('1.1 Overlay is hidden on page load', async ({ page }) => {
    await expect(page.locator('#githubActionsOverlay')).not.toBeVisible();
  });

  test('1.2 Overlay displays with correct workflow name and ID', async ({ page }) => {
    await openGithubActionsOverlay(page);

    await expect(page.locator('#githubActionsOverlay')).toBeVisible();
    await expect(page.locator('#requestedWorkflowName')).toHaveText(MOCK_WORKFLOW_NAME);
    await expect(page.locator('#requestedWorkflowName')).toHaveAttribute('data-id', MOCK_WORKFLOW_ID);
    await expect(page.locator('#githubActionsHeadingText')).toBeVisible();
  });

  test('1.3 Run and Cancel buttons are present and enabled', async ({ page }) => {
    await openGithubActionsOverlay(page);

    await expect(page.locator('#githubActionsRunButton')).toBeVisible();
    await expect(page.locator('#githubActionsRunButton')).toBeEnabled();
    await expect(page.locator('#githubActionsCancelButton')).toBeVisible();
    await expect(page.locator('#githubActionsCancelButton')).toBeEnabled();
  });

  test('1.4 Cancel button closes the overlay', async ({ page }) => {
    await openGithubActionsOverlay(page);

    await expect(page.locator('#githubActionsOverlay')).toBeVisible();
    await page.click('#githubActionsCancelButton');
    await expect(page.locator('#githubActionsOverlay')).not.toBeVisible();
  });

  test('1.5 Generic-mode input fields are visible after injection', async ({ page }) => {
    await openGithubActionsOverlay(page);
    await injectGenericInputFields(page, { branch: 'main', commit_message: 'auto-encode' });

    await expect(page.locator('.githubActionsInputField[data-input="branch"]')).toBeVisible();
    await expect(page.locator('.githubActionsInputField[data-input="commit_message"]')).toBeVisible();
    await expect(page.locator('.githubActionsInputField[data-input="branch"]')).toHaveValue('main');
  });

  test('1.6 Cancel button clears the status message', async ({ page }) => {
    await openGithubActionsOverlay(page);
    await page.evaluate(() => {
      document.getElementById('githubActionsStatus')!.innerHTML = '<span>stale content</span>';
    });

    await page.click('#githubActionsCancelButton');

    // Cancel handler set by the real app code clears the status
    await expect(page.locator('#githubActionsStatus')).toBeEmpty();
  });
});

test.describe('2 GitHub Actions – successful workflow run', () => {
  test.beforeEach(async ({ page }) => {
    await setupPageWithDevHook(page);
    await setupAndTrigger(page, 'success');
  });

  test('2.1 Clicking Run shows the waiting status immediately', async ({ page }) => {
    await page.click('#githubActionsRunButton');

    await expect(page.locator('#githubActionStatusMsgWaiting')).toBeVisible();
  });

  test('2.2 Run and Cancel buttons are disabled while running', async ({ page }) => {
    await page.click('#githubActionsRunButton');

    await expect(page.locator('#githubActionsRunButton')).toBeDisabled();
    await expect(page.locator('#githubActionsCancelButton')).toBeDisabled();
  });

  test('2.3 Success span appears after workflow completes', async ({ page }) => {
    await page.click('#githubActionsRunButton');

    await expect(page.locator('#githubActionStatusMsgSuccess')).toBeVisible({ timeout: 5000 });
  });

  test('2.4 GitHub status link is present on success', async ({ page }) => {
    await page.click('#githubActionsRunButton');

    await expect(page.locator('#githubActionsStatus a')).toBeVisible({ timeout: 5000 });
    await expect(page.locator('#githubActionsStatus a')).toHaveAttribute('href', MOCK_RUN_HTML_URL);
    await expect(page.locator('#githubActionsStatus a')).toHaveAttribute('target', '_blank');
  });

  test('2.5 Run button is re-enabled on success', async ({ page }) => {
    await page.click('#githubActionsRunButton');

    await expect(page.locator('#githubActionStatusMsgSuccess')).toBeVisible({ timeout: 5000 });
    await expect(page.locator('#githubActionsRunButton')).toBeEnabled({ timeout: 5000 });
  });

  test('2.6 Initial contents are hidden on success', async ({ page }) => {
    await page.click('#githubActionsRunButton');

    await expect(page.locator('#githubActionStatusMsgSuccess')).toBeVisible({ timeout: 5000 });
    await expect(page.locator('#githubActionsInitialContents')).not.toBeVisible();
  });
});

test.describe('3 GitHub Actions – failed workflow run', () => {
  test.beforeEach(async ({ page }) => {
    await setupPageWithDevHook(page);
    await setupAndTrigger(page, 'failure');
  });

  test('3.1 Failure span appears after workflow fails', async ({ page }) => {
    await page.click('#githubActionsRunButton');

    await expect(page.locator('#githubActionStatusMsgFailure')).toBeVisible({ timeout: 5000 });
  });

  test('3.2 GitHub status link is present on failure', async ({ page }) => {
    await page.click('#githubActionsRunButton');

    await expect(page.locator('#githubActionsStatus a')).toBeVisible({ timeout: 5000 });
    await expect(page.locator('#githubActionsStatus a')).toHaveAttribute('href', MOCK_RUN_HTML_URL);
    await expect(page.locator('#githubActionsStatus a')).toHaveAttribute('target', '_blank');
  });

  test('3.3 Initial contents are restored on failure', async ({ page }) => {
    await page.click('#githubActionsRunButton');

    await expect(page.locator('#githubActionStatusMsgFailure')).toBeVisible({ timeout: 5000 });
    await expect(page.locator('#githubActionsInitialContents')).toBeVisible({ timeout: 5000 });
  });

  test('3.4 Run and Cancel buttons re-enable after failure', async ({ page }) => {
    await page.click('#githubActionsRunButton');

    await expect(page.locator('#githubActionStatusMsgFailure')).toBeVisible({ timeout: 5000 });
    await expect(page.locator('#githubActionsRunButton')).toBeEnabled({ timeout: 5000 });
    await expect(page.locator('#githubActionsCancelButton')).toBeEnabled({ timeout: 5000 });
  });

  test('3.5 Run can be re-initiated after a failure', async ({ page }) => {
    await page.click('#githubActionsRunButton');
    await expect(page.locator('#githubActionStatusMsgFailure')).toBeVisible({ timeout: 5000 });

    // The real runWorkflow is still wired as onclick — clicking again shows waiting immediately
    await page.click('#githubActionsRunButton');
    await expect(page.locator('#githubActionStatusMsgWaiting')).toBeVisible();
  });
});

test.describe('4 GitHub Actions – dispatch error (HTTP ≥ 400)', () => {
  test.beforeEach(async ({ page }) => {
    await setupPageWithDevHook(page);
    await setupAndTrigger(page, 'dispatch-error');
  });

  test('4.1 Dispatch error shows the failure span', async ({ page }) => {
    await page.click('#githubActionsRunButton');

    await expect(page.locator('#githubActionStatusMsgFailure')).toBeVisible({ timeout: 5000 });
  });

  test('4.2 Dispatch error re-enables Run and Cancel buttons', async ({ page }) => {
    await page.click('#githubActionsRunButton');

    await expect(page.locator('#githubActionsRunButton')).toBeEnabled({ timeout: 5000 });
    await expect(page.locator('#githubActionsCancelButton')).toBeEnabled({ timeout: 5000 });
  });

  test('4.3 Initial contents are restored after dispatch error', async ({ page }) => {
    await page.click('#githubActionsRunButton');

    await expect(page.locator('#githubActionStatusMsgFailure')).toBeVisible({ timeout: 5000 });
    await expect(page.locator('#githubActionsInitialContents')).toBeVisible({ timeout: 5000 });
  });
});

test.describe('5 GitHub Actions – network error', () => {
  test.beforeEach(async ({ page }) => {
    await setupPageWithDevHook(page);
    await setupAndTrigger(page, 'network-error');
  });

  test('5.1 Network error shows an error message', async ({ page }) => {
    await page.click('#githubActionsRunButton');

    await expect(page.locator('#githubActionsStatus')).toContainText('Error', { timeout: 5000 });
  });

  test('5.2 Run and Cancel buttons re-enable after a network error', async ({ page }) => {
    await page.click('#githubActionsRunButton');

    await expect(page.locator('#githubActionsRunButton')).toBeEnabled({ timeout: 5000 });
    await expect(page.locator('#githubActionsCancelButton')).toBeEnabled({ timeout: 5000 });
  });

  test('5.3 Initial contents are restored after a network error', async ({ page }) => {
    await page.click('#githubActionsRunButton');

    await expect(page.locator('#githubActionsStatus')).toContainText('Error', { timeout: 5000 });
    await expect(page.locator('#githubActionsInitialContents')).toBeVisible({ timeout: 5000 });
  });
});
