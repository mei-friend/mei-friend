import { cm, v, requestMidiFromVrvWorker } from './main.js';

export let midiTimeout; // javascript timeout between last edit and MIDI re-render
export const midiDelay = 400; // in ms, delay between last edit and MIDI re-render
export let mp = document.getElementById('midi-player'); // midi player
let timemap;

export function seekMidiPlaybackToSelectionOrPage() {
  // on load, seek to first currently selected element (or first note on page)
  console.log('seekMidiPlaybackToSelectionOrPage', v.findFirstNoteInSelection(), document.querySelector('.note'));
  let seekToNote = v.findFirstNoteInSelection() || document.querySelector('.note');
  if (seekToNote) {
    v.getTimeForElement(seekToNote.id, true); // will trigger a seekMidiPlaybackTo
  } else {
    console.warn("Can't find a note to seek MIDI playback to");
  }
}

export function seekMidiPlaybackToTime(t) {
  // seek MIDI playback to time (in seconds)
  if (mp) {
    if (mp.playing) {
      mp.stop();
      mp.currentTime = t;
      mp.start();
    } else {
      mp.currentTime = t;
    }
  }

  // close all highlighted notes
  unHighlightNotes();
} // seekMidiPlaybackToTime()

export function highlightNotesAtMidiPlaybackTime(e) {
  const t = e.detail.note.startTime;
  // clear previous
  const relevantTimemapElements = timemap
    // ignore times later than the requested target
    .filter((tm) => t >= tm.tstamp / 1000);

  const currentlyHighlightedNotes = Array.from(document.querySelectorAll('g.note.currently-playing'));
  const firstNoteOnPage = document.querySelector('.note');

  // needs 339 ms at last two systems of Op.120
  if (false) {
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
    // 129 ms
    let ix = relevantTimemapElements.length - 1;
    while (ix >= 0) {
      if ('off' in relevantTimemapElements[ix]) {
        let i = currentlyHighlightedNotes.length - 1;
        while (i >= 0) {
          if (relevantTimemapElements[ix].off.includes(currentlyHighlightedNotes[i].id)) {
            closeNote(currentlyHighlightedNotes[i]);
            currentlyHighlightedNotes.splice(i, 1);
          }
          i--;
        }
        if (i < 0) break;
      }
      if ('on' in relevantTimemapElements[ix] && relevantTimemapElements[ix].on.includes(firstNoteOnPage.id)) {
        break;
      }
      ix--;
    }

    function closeNote(note) {
      note.classList.remove('currently-playing');
      note.querySelectorAll('.currently-playing').forEach((g) => g.classList.remove('currently-playing'));
    }
  }

  // find closest time to target
  let closestTimemapTime = relevantTimemapElements[relevantTimemapElements.length - 1];
  if (closestTimemapTime && 'on' in closestTimemapTime) {
    closestTimemapTime['on'].forEach((id) => {
      let el = document.getElementById(id);
      if (el) {
        el.classList.add('currently-playing');
        el.querySelectorAll('g').forEach((g) => g.classList.add('currently-playing'));
      } else if (document.getElementById('pageFollowMidiPlayback').checked) {
        v.getPageWithElement(id).then((flipToPage) => {
          if (flipToPage) {
            v.updatePage(cm, flipToPage, '', true, false); // disable midi seek after page-flip
          }
        });
      } else {
        console.warn("Expected to highlight currently playing note, but couldn't find it:", id);
      }
    });
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
}

export function getTimemap() {
  return timemap;
}

// close/unhighlight all midi-highlighted notes
function unHighlightNotes() {
  document.querySelectorAll('.currently-playing').forEach((g) => g.classList.remove('currently-playing'));
}
