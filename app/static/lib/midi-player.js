import { cm, v, requestMidiFromVrvWorker } from './main.js';

export let midiTimeout; // javascript timeout between last edit and MIDI re-render
export const midiDelay = 400; // in ms, delay between last edit and MIDI re-render
export let mp = document.getElementById('midi-player'); // midi player
let timemap;
let timemapIdx = 0;
let lastOnsetIdx = 0; // index in timemap of last onset
let lastReportedTime = 0; // time (s) of last reported note fired (used to check slider shifts)

export function seekMidiPlaybackToSelectionOrPage() {
  // on load, seek to first currently selected element (or first note on page)
  let seekToNote = v.findFirstNoteInSelection() || document.querySelector('.note');
  if (seekToNote) {
    v.getTimeForElement(seekToNote.id, true); // will trigger a seekMidiPlaybackTo
  } else {
    console.warn("Can't find a note to seek MIDI playback to");
  }
  timemapIdx = 0;
}

export function seekMidiPlaybackToTime(t) {
  // seek MIDI playback to time (in milliseconds)
  if (mp) {
    if (mp.playing) {
      mp.stop();
      mp.currentTime = t / 1000;
      mp.start();
    } else {
      mp.currentTime = t / 1000;
    }
  }
  timemapIdx = 0;
  // close all highlighted notes
  unHighlightAllElements();
} // seekMidiPlaybackToTime()

export function highlightNotesAtMidiPlaybackTime(e) {
  let highlightCheckbox = document.getElementById('highlightCurrentlySoundingNotes');
  let pageFollowCheckbox = document.getElementById('pageFollowMidiPlayback');
  if (highlightCheckbox.checked || pageFollowCheckbox.checked) {
    const t = e.detail.note.startTime * 1000; // convert to milliseconds
    const currentlyHighlightedNotes = Array.from(document.querySelectorAll('g.note.currently-playing'));
    const firstNoteOnPage = document.querySelector('.note');
    let closestTimemapTime;

    // needs 339 ms at last two systems of Op.120
    if (false) {
      // clear previous
      const relevantTimemapElements = timemap
        // ignore times later than the requested target
        .filter((tm) => Math.round(t) >= Math.round(tm.tstamp));
      closestTimemapTime = relevantTimemapElements[relevantTimemapElements.length - 1];

      currentlyHighlightedNotes.forEach((note) => {
        // go backwards through all relevant timemap elements
        // look for highlighted notes to close
        // if we reach the onset of the first note on page, give up.
        let toClose;
        let ix = relevantTimemapElements.length - 1;
        while (ix >= 0) {
          if ('off' in relevantTimemapElements[ix] && relevantTimemapElements[ix].off.includes(note.id)) {
            toClose = note.id;
            break;
          }
          if ('on' in relevantTimemapElements[ix] && relevantTimemapElements[ix].on.includes(firstNoteOnPage.id)) {
            break;
          }
          ix--;
        }
        // unhighlight note and all its children
        if (toClose) {
          note.classList.remove('currently-playing');
          note.querySelectorAll('.currently-playing').forEach((g) => g.classList.remove('currently-playing'));
        }
      });
    } else {
      // increment to current element in timemap
      if (t < lastReportedTime) {
        timemapIdx = 0;
      }
      lastReportedTime = t;
      // let oldIdx = timemapIdx;
      while (Math.round(timemap[timemapIdx].tstamp) < Math.round(t) && timemapIdx < timemap.length) {
        timemapIdx++;
      }
      // console.log('t: ' + t + '; tstamp: ' + timemap[timemapIdx].tstamp);
      closestTimemapTime = timemap[timemapIdx];
      // console.log('timemap index (old/new): ' + oldIdx + '/' + timemapIdx);

      // 129 ms; with timemapIdx reduced to 66 ms with Op. 120 last two pages
      // go back from current timemapIdx to 'close' highlighted notes
      let ix = timemapIdx;
      while (ix >= 0) {
        if ('off' in timemap[ix]) {
          let i = currentlyHighlightedNotes.length - 1;
          while (i >= 0) {
            if (timemap[ix].off.includes(currentlyHighlightedNotes[i].id)) {
              unhighlightNote(currentlyHighlightedNotes[i]);
              currentlyHighlightedNotes.splice(i, 1); // remove unhighlighted notes
            }
            i--;
          }
          if (currentlyHighlightedNotes.length <= 0) {
            break;
          }
        }
        if ('on' in timemap[ix] && timemap[ix].on.includes(firstNoteOnPage.id)) {
          break;
        }
        ix--;
      }

      // at last onset, program the closing of events in the future
      if (timemapIdx === lastOnsetIdx) {
        let j = timemapIdx;
        while (j++ < timemap.length - 1) {
          if ('off' in timemap[j]) {
            timemap[j].off.forEach((id) => {
              let note = document.getElementById(id);
              setTimeout(() => unhighlightNote(note), timemap[j].tstamp - t, note);
            });
          }
          // last item in timemap, stop player
          if (j === timemap.length - 1) {
            setTimeout(() => mp.stop(), timemap[j].tstamp - t, mp);
          }
        }
      }

      function unhighlightNote(note) {
        note.classList.remove('currently-playing');
        note.querySelectorAll('.currently-playing').forEach((g) => g.classList.remove('currently-playing'));
      }
    }

    if (closestTimemapTime && 'on' in closestTimemapTime) {
      closestTimemapTime['on'].forEach((id) => {
        let el = document.getElementById(id);
        if (el && highlightCheckbox.checked) {
          el.classList.add('currently-playing');
          el.querySelectorAll('g').forEach((g) => g.classList.add('currently-playing'));
        } else if (pageFollowCheckbox.checked) {
          v.getPageWithElement(id)
            .then((flipToPage) => {
              if (flipToPage) {
                v.updatePage(cm, flipToPage, '', true, false); // disable midi seek after page-flip
              }
            })
            .catch((e) => {
              console.warn("Expected to highlight currently playing note, but couldn't find it:", id, e);
            });
        }
      });
    }
  }
} // highlightNotesAtMidiPlaybackTime()

export function startMidiTimeout(rerender = false) {
  // clear a possible pre-existing timeout
  window.clearTimeout(midiTimeout);
  if (rerender) {
    // fully rerender MIDI and timemap, then trigger a seek
    midiTimeout = window.setTimeout(() => requestMidiFromVrvWorker(null, true), midiDelay);
  } else {
    // only trigger a seek
    midiTimeout = window.setTimeout(() => seekMidiPlaybackToSelectionOrPage(), midiDelay);
  }
} // startMidiTimeout()

export function setTimemap(tm) {
  timemap = tm;
  determineLastOnsetIdx();
}

export function getTimemap() {
  return timemap;
}

// close/unhighlight all midi-highlighted notes/graphical elements
function unHighlightAllElements() {
  document.querySelectorAll('.currently-playing').forEach((g) => g.classList.remove('currently-playing'));
}

// find index of last onset array in timemap
function determineLastOnsetIdx() {
  let i = timemap.length;
  while (i-- >= 0) {
    if ('on' in timemap[i]) {
      lastOnsetIdx = i;
      break;
    }
  }
}
