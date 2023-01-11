import {
    cm,
    v
} from './main.js'

export let midiTimeout; // javascript timeout between last edit and MIDI re-render
export const midiDelay = 400; // in ms, delay between last edit and MIDI re-render
export let mp = document.getElementById("midi-player"); // midi player
let timemap;

export function seekMidiPlaybackToSelectionOrPage() { 
  // on load, seek to first currently selected element (or first note on page)
  console.log("seekMidiPlaybackToSelectionOrPage", v.findFirstNoteInSelection(), document.querySelector(".note"))
  let seekToNote = v.findFirstNoteInSelection() || document.querySelector(".note");
  if (seekToNote) {
    v.getTimeForElement(seekToNote.id, true); // will trigger a seekMidiPlaybackTo
  }
  else {
    console.warn("Can't find a note to seek MIDI playback to");
  }
}

export function seekMidiPlaybackToTime(t) {
  // seek MIDI playback to time (in seconds)
  if(mp) { 
    if(mp.playing) {
      mp.stop();
      mp.currentTime = t;
      mp.start();
    } else { 
      mp.currentTime = t;
    }
  } 
}

export function highlightNotesAtMidiPlaybackTime(e) {
  const t = e.detail.note.startTime;
  // clear previous
  const relevantTimemapElements = timemap
    // ignore times later than the requested target 
    .filter((tm) => t >= tm.tstamp / 1000);
  // find closest time to target
  // Verovio returns a sorted timemap, so just choose the last one 


  let closestTimemapTime = relevantTimemapElements[relevantTimemapElements.length - 1];
  const currentlyHighlightedNotes = document.querySelectorAll(".currently-playing");
  const firstNoteOnPage = document.querySelector(".note");
  currentlyHighlightedNotes.forEach(note => {
    // go backwards through all relevant timemap elements
    // look for highlighted notes to close
    // if we reach the onset of the first note on page, give up.
    let toClose;
    let ix = relevantTimemapElements.length - 1;
    while(ix >= 0) { 
      if("off" in relevantTimemapElements[ix] && relevantTimemapElements[ix].off.includes(note.id)) { 
        toClose = note.id;
        break;
      }
      if("on" in relevantTimemapElements[ix] && relevantTimemapElements[ix].on.includes(firstNoteOnPage.id)) { 
        break;
      }
      ix--;
    }
    /*
    const toClose = relevantTimemapElements.find((timemapElement) => {
      return "off" in timemapElement && timemapElement.off.includes(note.id);
    });*/
    if(toClose) { 
      note.classList.remove("currently-playing");
      note.querySelectorAll(".currently-playing").forEach(g => g.classList.remove("currently-playing"));
    }
  })

  if (closestTimemapTime && "on" in closestTimemapTime) {
    closestTimemapTime["on"].forEach(id => {
      let el = document.getElementById(id);
      if (el) {
        el.classList.add("currently-playing");
        el.querySelectorAll("g").forEach(g => g.classList.add("currently-playing"))
      } else if (document.getElementById("pageFollowMidiPlayback").checked) {
        v.getPageWithElement(id).then(flipToPage => {
          if (flipToPage) {
            v.updatePage(cm, flipToPage, '', true, false); // disable midi seek after page-flip
          }
        }) 
      } else { 
        console.warn("Expected to highlight currently playing note, but couldn't find it:", id);
      }
    })
  }
}

export function startMidiTimeout(rerender = false) {
  // clear a possible pre-existing timeout
  window.clearTimeout(midiTimeout);
  if(rerender) { 
    // fully rerender MIDI and timemap, then trigger a seek
    midiTimeout = window.setTimeout(() => requestMidiFromVrvWorker(null, true), midiDelay);
  } else {
    // only trigger a seek
    midiTimeout = window.setTimeout(() => seekMidiPlaybackToSelectionOrPage(), midiDelay);
  }
}

export function setTimemap(tm) { 
    timemap = tm;
}

export function getTimemap() { 
    return timemap;
}