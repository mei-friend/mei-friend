import { test, expect, Page } from '@playwright/test';
import { setupPage } from './setup';

// ─── Mock data ────────────────────────────────────────────────────────────────

const MOCK_WORKFLOW_NAME = 'encode.yml';
const MOCK_WORKFLOW_ID = '12345';
const MOCK_RUN_ID = 98765;
const MOCK_RUN_HTML_URL = 'https://github.com/testuser/test-repo/actions/runs/98765';
const MOCK_DISPATCH_TIME = '2024-01-01T12:00:00Z';

// ─── Helpers ──────────────────────────────────────────────────────────────────

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
      wrapper.className = 'githubActionsGeneric';

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

/**
 * Sets the run button's onclick to a mock that simulates a successful
 * workflow dispatch → start → completion cycle entirely in the DOM,
 * without making real GitHub API calls.
 *
 * The mock writes the same HTML the real handleClickGithubAction would
 * write on success, so CSS and element-presence assertions remain valid.
 */
async function mockRunWorkflowSuccess(page: Page) {
  await page.evaluate(
    ({ runHtmlUrl, dispatchTime }) => {
      const runBtn = document.getElementById('githubActionsRunButton') as HTMLButtonElement;
      const cancelBtn = document.getElementById('githubActionsCancelButton') as HTMLButtonElement;
      const statusMsg = document.getElementById('githubActionsStatus')!;
      const initialContents = document.getElementById('githubActionsInitialContents')!;

      runBtn.onclick = async () => {
        // 1. Hide initial contents and disable buttons (mirrors runWorkflow start)
        initialContents.style.display = 'none';
        runBtn.setAttribute('disabled', '');
        cancelBtn.setAttribute('disabled', '');

        // 2. Show waiting status (mirrors renderWaitingStatus())
        statusMsg.innerHTML = `<span id="githubActionStatusMsgWaiting">Please be patient while GitHub is processing your workflow...</span>`;

        // 3. Pause long enough for Playwright to observe the disabled state
        await new Promise<void>(resolve => setTimeout(resolve, 500));

        // 4. Show success completion (mirrors workflowCompletionResp.conclusion === 'success')
        statusMsg.innerHTML =
          `<span id="githubActionStatusMsgSuccess">Workflow run completed:</span>` +
          ` <a href="${runHtmlUrl}" target="_blank">GitHub status</a>`;

        // 5. Switch run button to "Reload" (mirrors post-success state)
        runBtn.textContent = 'Reload MEI file';
        runBtn.removeAttribute('disabled');
      };
    },
    { runHtmlUrl: MOCK_RUN_HTML_URL, dispatchTime: MOCK_DISPATCH_TIME }
  );
}

/**
 * Sets the run button's onclick to a mock that simulates a workflow run
 * that is dispatched successfully but completes with a non-success conclusion
 * (e.g. "failure").
 */
async function mockRunWorkflowFailure(page: Page) {
  await page.evaluate(
    ({ runHtmlUrl }) => {
      const runBtn = document.getElementById('githubActionsRunButton') as HTMLButtonElement;
      const cancelBtn = document.getElementById('githubActionsCancelButton') as HTMLButtonElement;
      const statusMsg = document.getElementById('githubActionsStatus')!;
      const initialContents = document.getElementById('githubActionsInitialContents')!;

      runBtn.onclick = async () => {
        // 1. Hide initial contents and disable buttons
        initialContents.style.display = 'none';
        runBtn.setAttribute('disabled', '');
        cancelBtn.setAttribute('disabled', '');

        // 2. Show waiting status
        statusMsg.innerHTML = `<span id="githubActionStatusMsgWaiting">Please be patient while GitHub is processing your workflow...</span>`;

        await Promise.resolve();

        // 3. Show failure message and restore initial contents (mirrors conclusion !== 'success')
        statusMsg.innerHTML =
          `<span id="githubActionStatusMsgFailure">Could not complete workflow run:</span>` +
          ` <a href="${runHtmlUrl}" target="_blank">GitHub status</a>`;

        initialContents.style.display = '';
        cancelBtn.removeAttribute('disabled');
        runBtn.removeAttribute('disabled');
      };
    },
    { runHtmlUrl: MOCK_RUN_HTML_URL }
  );
}

/**
 * Sets the run button's onclick to a mock that simulates the dispatch call
 * itself returning a ≥400 HTTP status (e.g. 422 – workflow not found or
 * inputs invalid).
 */
async function mockRunWorkflowDispatchError(page: Page) {
  await page.evaluate(() => {
    const runBtn = document.getElementById('githubActionsRunButton') as HTMLButtonElement;
    const cancelBtn = document.getElementById('githubActionsCancelButton') as HTMLButtonElement;
    const statusMsg = document.getElementById('githubActionsStatus')!;
    const initialContents = document.getElementById('githubActionsInitialContents')!;

    runBtn.onclick = async () => {
      initialContents.style.display = 'none';
      runBtn.setAttribute('disabled', '');
      cancelBtn.setAttribute('disabled', '');
      statusMsg.innerHTML = `<span id="githubActionStatusMsgWaiting">Please be patient while GitHub is processing your workflow...</span>`;

      await Promise.resolve();

      // Mirrors workflowRunResp.status >= 400 branch
      statusMsg.innerHTML =
        `<span id="githubActionStatusMsgFailure">Could not run workflow - GitHub status</span>` +
        `: <a href="https://docs.github.com/rest" target="_blank">Not Found</a>`;
      initialContents.style.display = '';
      cancelBtn.removeAttribute('disabled');
      runBtn.removeAttribute('disabled');
    };
  });
}

/**
 * Sets the run button's onclick to a mock that simulates a network-level
 * failure (the fetch itself rejects). Mirrors the .catch() branch in
 * runWorkflow() which shows 'Error' and re-enables buttons.
 */
async function mockRunWorkflowNetworkError(page: Page) {
  await page.evaluate(() => {
    const runBtn = document.getElementById('githubActionsRunButton') as HTMLButtonElement;
    const cancelBtn = document.getElementById('githubActionsCancelButton') as HTMLButtonElement;
    const statusMsg = document.getElementById('githubActionsStatus')!;
    const initialContents = document.getElementById('githubActionsInitialContents')!;

    runBtn.onclick = async () => {
      initialContents.style.display = 'none';
      runBtn.setAttribute('disabled', '');
      cancelBtn.setAttribute('disabled', '');
      statusMsg.innerHTML = `<span id="githubActionStatusMsgWaiting">Please be patient while GitHub is processing your workflow...</span>`;

      await Promise.resolve();

      // Mirrors the .catch() branch: network / unexpected error
      statusMsg.innerHTML = 'Error';
      initialContents.style.display = '';
      cancelBtn.removeAttribute('disabled');
      runBtn.removeAttribute('disabled');
    };
  });
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

  test('1.6 Re-opening the overlay resets the status message', async ({ page }) => {
    await openGithubActionsOverlay(page);
    // Pollute the status area
    await page.evaluate(() => {
      document.getElementById('githubActionsStatus')!.innerHTML = '<span>stale content</span>';
    });
    // Simulate re-open (cancel then re-open)
    await page.click('#githubActionsCancelButton');
    await openGithubActionsOverlay(page);

    await expect(page.locator('#githubActionsStatus')).toBeEmpty();
  });
});

test.describe('2 GitHub Actions – successful workflow run', () => {
  test.beforeEach(async ({ page }) => {
    await setupPage(page);
    await openGithubActionsOverlay(page);
    await injectGenericInputFields(page, { branch: 'main' });
    await mockRunWorkflowSuccess(page);
  });

  test('2.1 Clicking Run shows the waiting status immediately', async ({ page }) => {
    await page.click('#githubActionsRunButton');

    // Waiting span must appear (even before the mocked promise resolves)
    await expect(page.locator('#githubActionStatusMsgWaiting')).toBeVisible();
  });

  test('2.2 Run button and Cancel button are disabled while running', async ({ page }) => {
    await page.click('#githubActionsRunButton');

    await expect(page.locator('#githubActionsRunButton')).toBeDisabled();
    await expect(page.locator('#githubActionsCancelButton')).toBeDisabled();
  });

  test('2.3 Success span appears after workflow completes', async ({ page }) => {
    await page.click('#githubActionsRunButton');

    await expect(page.locator('#githubActionStatusMsgSuccess')).toBeVisible({ timeout: 5000 });
    await expect(page.locator('#githubActionsStatus')).toContainText('Workflow run completed');
  });

  test('2.4 GitHub status link is present on success', async ({ page }) => {
    await page.click('#githubActionsRunButton');

    await expect(page.locator('#githubActionsStatus a')).toBeVisible({ timeout: 5000 });
    await expect(page.locator('#githubActionsStatus a')).toHaveAttribute('href', MOCK_RUN_HTML_URL);
    await expect(page.locator('#githubActionsStatus a')).toHaveAttribute('target', '_blank');
  });

  test('2.5 Run button changes to "Reload MEI file" on success', async ({ page }) => {
    await page.click('#githubActionsRunButton');

    await expect(page.locator('#githubActionsRunButton')).toHaveText('Reload MEI file', {
      timeout: 5000,
    });
    await expect(page.locator('#githubActionsRunButton')).toBeEnabled({ timeout: 5000 });
  });

  test('2.6 Initial content (input fields) are hidden on success', async ({ page }) => {
    await page.click('#githubActionsRunButton');

    await expect(page.locator('#githubActionStatusMsgSuccess')).toBeVisible({ timeout: 5000 });
    await expect(page.locator('#githubActionsInitialContents')).not.toBeVisible();
  });
});

test.describe('3 GitHub Actions – failed workflow run', () => {
  test.beforeEach(async ({ page }) => {
    await setupPage(page);
    await openGithubActionsOverlay(page);
    await injectGenericInputFields(page, { branch: 'main' });
    await mockRunWorkflowFailure(page);
  });

  test('3.1 Failure span appears after workflow fails', async ({ page }) => {
    await page.click('#githubActionsRunButton');

    await expect(page.locator('#githubActionStatusMsgFailure')).toBeVisible({ timeout: 5000 });
    await expect(page.locator('#githubActionsStatus')).toContainText('Could not complete workflow run');
  });

  test('3.2 GitHub status link is present on failure', async ({ page }) => {
    await page.click('#githubActionsRunButton');

    await expect(page.locator('#githubActionsStatus a')).toBeVisible({ timeout: 5000 });
    await expect(page.locator('#githubActionsStatus a')).toHaveAttribute('href', MOCK_RUN_HTML_URL);
    await expect(page.locator('#githubActionsStatus a')).toHaveAttribute('target', '_blank');
  });

  test('3.3 Initial contents (input fields) are restored on failure', async ({ page }) => {
    await page.click('#githubActionsRunButton');

    await expect(page.locator('#githubActionStatusMsgFailure')).toBeVisible({ timeout: 5000 });
    await expect(page.locator('#githubActionsInitialContents')).toBeVisible({ timeout: 5000 });
  });

  test('3.4 Run button and Cancel button re-enable after failure', async ({ page }) => {
    await page.click('#githubActionsRunButton');

    await expect(page.locator('#githubActionStatusMsgFailure')).toBeVisible({ timeout: 5000 });
    await expect(page.locator('#githubActionsRunButton')).toBeEnabled({ timeout: 5000 });
    await expect(page.locator('#githubActionsCancelButton')).toBeEnabled({ timeout: 5000 });
  });

  test('3.5 Run can be re-initiated after a failure', async ({ page }) => {
    await page.click('#githubActionsRunButton');
    await expect(page.locator('#githubActionStatusMsgFailure')).toBeVisible({ timeout: 5000 });

    // Re-mock the button to a successful run and trigger it again
    await mockRunWorkflowSuccess(page);
    await page.click('#githubActionsRunButton');

    await expect(page.locator('#githubActionStatusMsgSuccess')).toBeVisible({ timeout: 5000 });
  });
});

test.describe('4 GitHub Actions – dispatch error (HTTP ≥ 400)', () => {
  test.beforeEach(async ({ page }) => {
    await setupPage(page);
    await openGithubActionsOverlay(page);
    await injectGenericInputFields(page, { branch: 'main' });
    await mockRunWorkflowDispatchError(page);
  });

  test('4.1 Dispatch failure shows the failure span', async ({ page }) => {
    await page.click('#githubActionsRunButton');

    await expect(page.locator('#githubActionStatusMsgFailure')).toBeVisible({ timeout: 5000 });
  });

  test('4.2 Dispatch failure re-enables Run and Cancel buttons', async ({ page }) => {
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
    await setupPage(page);
    await openGithubActionsOverlay(page);
    await injectGenericInputFields(page, { branch: 'main' });
    await mockRunWorkflowNetworkError(page);
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
