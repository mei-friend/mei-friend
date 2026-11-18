/**
 * Converts MEI attributes into the equivalent MEI elements that express the
 * same content ("Convert attributes to elements"), such as
 *   note@accid / @accid.ges          -> <accid accid accid.ges/> child
 *   note|chord@artic / @artic.ges    -> <artic/> children (one per value)
 *   note|chord@syl                   -> <verse n="1"><syl>...</syl></verse> child
 *   note|chord|rest|...@fermata      -> <fermata startid place/> in measure
 *   note|chord@tie (i|m|t)           -> <tie startid endid/> in measure
 *   note|chord@slur (i1|m1|t1 ...)   -> <slur startid endid/> in measure
 *   note@gliss (i|m|t)               -> <gliss startid endid/> in measure
 *   staffDef@clef.*                  -> <clef/> child
 *   staffDef|scoreDef@key.* /@keysig -> <keySig/> child
 *   staffDef|scoreDef@meter.*        -> <meterSig/> child
 *   staffDef@mensur.*                -> <mensur/> child
 *   staffGrp@symbol                  -> <grpSym/> child
 *   staffDef|staffGrp@label (MEI <5) -> <label/> child (and @label.abbr -> <labelAbbr/>)
 *
 * The module works on an XML DOM only and has no dependencies on the
 * rest of mei-friend, so that it can be tested in isolation.
 */

const meiNameSpace = 'http://www.music-encoding.org/ns/mei';
const xmlNameSpace = 'http://www.w3.org/XML/1998/namespace';

// canonical order of (prefatory) child elements in staffGrp, staffDef and scoreDef
const defChildOrder = [
  'label',
  'labelAbbr',
  'grpSym',
  'clef',
  'clefGrp',
  'keySig',
  'meterSig',
  'meterSigGrp',
  'mensur',
  'proport',
];

// staffDef/scoreDef attributes and their counterparts on the corresponding element;
// an element is only created when at least one of the required attributes is present
const defConversions = [
  {
    element: 'clef',
    parents: ['staffDef'],
    required: ['clef.shape'],
    attributes: {
      'clef.shape': 'shape',
      'clef.line': 'line',
      'clef.dis': 'dis',
      'clef.dis.place': 'dis.place',
      'clef.color': 'color',
      'clef.visible': 'visible',
    },
  },
  {
    element: 'keySig',
    parents: ['staffDef', 'scoreDef'],
    required: ['key.sig', 'keysig', 'key.pname'],
    attributes: {
      'key.sig': 'sig', // MEI 3/4
      keysig: 'sig', // MEI 5
      'key.sig.mixed': 'sig.mixed', // MEI 3
      'key.pname': 'pname',
      'key.accid': 'accid',
      'key.mode': 'mode',
      'key.sig.show': 'visible', // MEI 3
      'keysig.show': 'visible', // MEI 4
      'keysig.visible': 'visible', // MEI 5
      'key.sig.showchange': 'sig.showchange', // MEI 3
      'keysig.showchange': 'sig.showchange', // MEI 4
      'keysig.cancelaccid': 'cancelaccid', // MEI 5
    },
  },
  {
    element: 'meterSig',
    parents: ['staffDef', 'scoreDef'],
    required: ['meter.count', 'meter.sym'],
    attributes: {
      'meter.count': 'count',
      'meter.unit': 'unit',
      'meter.sym': 'sym',
      'meter.form': 'form', // MEI 4/5
      'meter.rend': 'form', // MEI 3
      'meter.visible': 'visible', // MEI 5
    },
  },
  {
    element: 'mensur',
    parents: ['staffDef'],
    required: ['mensur.sign'],
    attributes: {
      'mensur.sign': 'sign',
      'mensur.dot': 'dot',
      'mensur.slash': 'slash',
      'mensur.orient': 'orient',
      'mensur.color': 'color',
      'mensur.form': 'form',
      'mensur.loc': 'loc',
    },
  },
];

// elements that may carry @fermata (att.fermataPresent)
const fermataElements = ['note', 'chord', 'rest', 'mRest', 'space', 'mSpace'];

// lyrics-like children, before which accid/artic children are inserted
const lyricsElements = ['verse', 'syl', 'refrain'];

/**
 * Converts all attributes in xmlDoc that have an element equivalent into
 * elements. Modifies xmlDoc in place.
 * @param {Document} xmlDoc
 * @param {Object} options
 * @param {Function} options.generateId function(nodeName) returning a new xml:id
 * @param {string} options.indent indentation unit (e.g., '  ' or '\t')
 * @returns {{counts: Object<string, number>, changes: Array<Object>, warnings: Array<Object>, changedElements: Array<Element>}}
 *   counts: number of conversions per created element name;
 *   changes: one entry per conversion, {name, sources: [{element, attributes}], targets: [Element]},
 *     with the elements that carried the attributes (and a textual representation of
 *     these attributes) and the created (or already existing) elements;
 *   warnings: attributes that could not be converted, [{element, message}];
 *   changedElements: elements that received a new xml:id
 */
export function convertAttributesToElements(xmlDoc, options = {}) {
  const generateId = options.generateId || ((name) => name + '-' + Math.random().toString(36).slice(2, 10));
  const indentUnit = options.indent ?? '  ';
  const counts = {};
  const changes = [];
  const warnings = [];
  const changedElements = []; // elements that received a new xml:id

  const music = xmlDoc.querySelector('music') || xmlDoc.documentElement;
  if (!music) return { counts, changes, warnings, changedElements };

  const existingIds = new Set();
  xmlDoc.querySelectorAll('[*|id]').forEach((el) => existingIds.add(el.getAttribute('xml:id')));

  // existing control elements, keyed by 'name|#startid|#endid' and 'name|#startid'
  const existingControlEvents = new Map();
  for (const el of music.querySelectorAll('tie, slur, gliss, fermata')) {
    const startid = el.getAttribute('startid');
    if (!startid) continue;
    const key = el.localName + '|' + startid;
    if (!existingControlEvents.has(key)) existingControlEvents.set(key, el);
    existingControlEvents.set(key + '|' + (el.getAttribute('endid') || ''), el);
  }

  const meiVersion = parseInt(xmlDoc.querySelector('mei')?.getAttribute('meiversion') || '', 10);

  convertDefinitions();
  convertAccid();
  convertArtic();
  convertSyl();
  convertFermata();
  convertPairedAttribute({ attribute: 'tie', element: 'tie', samePitch: true, chordInheritance: true });
  convertPairedAttribute({ attribute: 'gliss', element: 'gliss', samePitch: false, chordInheritance: false });
  convertSlur();

  return { counts, changes, warnings, changedElements };

  // ##########################################################################
  // staffGrp, staffDef, scoreDef
  // ##########################################################################

  function convertDefinitions() {
    for (const conv of defConversions) {
      for (const parent of music.querySelectorAll(conv.parents.join(','))) {
        const attrs = Object.keys(conv.attributes).filter((a) => parent.hasAttribute(a));
        if (attrs.length === 0) continue;
        if (!conv.required.some((a) => parent.hasAttribute(a))) {
          warn(parent, attrs.map((a) => '@' + a).join(', ') + ' without ' + conv.required.map((a) => '@' + a).join('/'));
          continue;
        }
        if (directChildren(parent, conv.element).length > 0) {
          warn(parent, attrs.map((a) => '@' + a).join(', ') + ' not converted, ' + conv.element + ' element exists');
          continue;
        }
        const el = createElement(conv.element, parent.hasAttribute('xml:id'));
        const source = { element: parent, attributes: attrText(parent, attrs) };
        for (const a of attrs) {
          el.setAttribute(conv.attributes[a], parent.getAttribute(a));
          parent.removeAttribute(a);
        }
        insertDefChild(parent, el);
        record(conv.element, [source], [el]);
      }
    }

    // staffGrp@symbol -> grpSym
    for (const staffGrp of music.querySelectorAll('staffGrp[symbol]')) {
      const symbol = staffGrp.getAttribute('symbol');
      if (symbol === 'none') continue; // no grpSym equivalent
      if (directChildren(staffGrp, 'grpSym').some((g) => !g.hasAttribute('startid'))) {
        warn(staffGrp, '@symbol not converted, grpSym element exists');
        continue;
      }
      const grpSym = createElement('grpSym', staffGrp.hasAttribute('xml:id'));
      grpSym.setAttribute('symbol', symbol);
      const source = { element: staffGrp, attributes: attrText(staffGrp, ['symbol']) };
      staffGrp.removeAttribute('symbol');
      insertDefChild(staffGrp, grpSym);
      record('grpSym', [source], [grpSym]);
    }

    // @label/@label.abbr are display labels only up to MEI 4 (in MEI 5, @label is a
    // generic tool-tip label without element equivalent)
    const labelElements = meiVersion < 5 ? music.querySelectorAll('staffDef, staffGrp') : [];
    for (const parent of labelElements) {
      for (const [attr, elName] of [
        ['label', 'label'],
        ['label.abbr', 'labelAbbr'],
      ]) {
        if (!parent.hasAttribute(attr)) continue;
        if (directChildren(parent, elName).length > 0) {
          warn(parent, '@' + attr + ' not converted, ' + elName + ' element exists');
          continue;
        }
        const el = createElement(elName, parent.hasAttribute('xml:id'));
        el.textContent = parent.getAttribute(attr);
        const source = { element: parent, attributes: attrText(parent, [attr]) };
        parent.removeAttribute(attr);
        insertDefChild(parent, el);
        record(elName, [source], [el]);
      }
    }
  } // convertDefinitions()

  // inserts a child element into staffGrp/staffDef/scoreDef in canonical order
  function insertDefChild(parent, el) {
    const rank = defChildOrder.indexOf(el.localName);
    const before = Array.from(parent.children).find((c) => {
      const r = defChildOrder.indexOf(c.localName);
      return r < 0 || r > rank;
    });
    insertIndented(parent, el, before || null);
  } // insertDefChild()

  // ##########################################################################
  // accid, artic, syl
  // ##########################################################################

  function convertAccid() {
    for (const note of music.querySelectorAll('note[accid], note[accid\\.ges]')) {
      const attrs = ['accid', 'accid.ges'].filter((a) => note.hasAttribute(a));
      const accids = directChildren(note, 'accid');
      if (accids.length > 1) {
        warn(note, attrs.map((a) => '@' + a).join(', ') + ' not converted, several accid elements exist');
        continue;
      }
      if (accids.length === 1) {
        // merge into existing accid element, if not contradicting
        const accid = accids[0];
        const merged = [];
        for (const a of attrs) {
          const value = note.getAttribute(a);
          if (!accid.hasAttribute(a) || accid.getAttribute(a) === value) {
            merged.push(attrText(note, [a]));
            accid.setAttribute(a, value);
            note.removeAttribute(a);
          } else {
            warn(note, '@' + a + '="' + value + '" contradicts existing accid element');
          }
        }
        if (merged.length > 0) record('accid', [{ element: note, attributes: merged.join(' ') }], [accid]);
        continue;
      }
      const accid = createElement('accid', note.hasAttribute('xml:id'));
      const source = { element: note, attributes: attrText(note, attrs) };
      for (const a of attrs) {
        accid.setAttribute(a, note.getAttribute(a));
        note.removeAttribute(a);
      }
      insertIndented(note, accid, firstChild(note, lyricsElements));
      record('accid', [source], [accid]);
    }
  } // convertAccid()

  function convertArtic() {
    for (const el of music.querySelectorAll('note[artic], chord[artic], note[artic\\.ges], chord[artic\\.ges]')) {
      const artics = tokens(el.getAttribute('artic'));
      const articGes = tokens(el.getAttribute('artic.ges'));
      // pair written and gestural values by position if lists have equal length
      const pairs = [];
      if (articGes.length > 0 && artics.length === articGes.length) {
        artics.forEach((a, i) => pairs.push({ artic: a, 'artic.ges': articGes[i] }));
      } else {
        artics.forEach((a) => pairs.push({ artic: a }));
        articGes.forEach((a) => pairs.push({ 'artic.ges': a }));
      }
      const existing = directChildren(el, 'artic');
      const before = firstChild(el, lyricsElements);
      const targets = [];
      for (const pair of pairs) {
        // avoid duplicating an already existing artic element
        const duplicate = existing.find((e) => Object.keys(pair).every((a) => e.getAttribute(a) === pair[a]));
        if (duplicate) {
          targets.push(duplicate);
          continue;
        }
        const artic = createElement('artic', el.hasAttribute('xml:id'));
        for (const a in pair) artic.setAttribute(a, pair[a]);
        insertIndented(el, artic, before);
        targets.push(artic);
      }
      const source = { element: el, attributes: attrText(el, ['artic', 'artic.ges']) };
      el.removeAttribute('artic');
      el.removeAttribute('artic.ges');
      record('artic', [source], targets);
    }
  } // convertArtic()

  function convertSyl() {
    for (const el of music.querySelectorAll('note[syl], chord[syl]')) {
      if (directChildren(el, 'verse').length > 0 || directChildren(el, 'syl').length > 0) {
        warn(el, '@syl not converted, verse/syl element exists');
        continue;
      }
      const hasId = el.hasAttribute('xml:id');
      const verse = createElement('verse', hasId);
      verse.setAttribute('n', '1');
      insertIndented(el, verse, null);
      const syl = createElement('syl', hasId);
      syl.textContent = el.getAttribute('syl');
      insertIndented(verse, syl, null);
      const source = { element: el, attributes: attrText(el, ['syl']) };
      el.removeAttribute('syl');
      record('syl', [source], [verse]);
    }
  } // convertSyl()

  // ##########################################################################
  // control events: fermata, tie, gliss, slur
  // ##########################################################################

  function convertFermata() {
    const selector = fermataElements.map((e) => e + '[fermata]').join(',');
    for (const el of music.querySelectorAll(selector)) {
      const measure = el.closest('measure');
      if (!measure) {
        warn(el, '@fermata not converted, no measure found');
        continue;
      }
      const startid = '#' + ensureId(el);
      let fermata = existingControlEvents.get('fermata|' + startid);
      if (!fermata) {
        fermata = createElement('fermata', true);
        const staff = staffN(el);
        if (staff) fermata.setAttribute('staff', staff);
        fermata.setAttribute('startid', startid);
        const place = el.getAttribute('fermata');
        if (place) fermata.setAttribute('place', place);
        insertIndented(measure, fermata, null);
      }
      const source = { element: el, attributes: attrText(el, ['fermata']) };
      el.removeAttribute('fermata');
      record('fermata', [source], [fermata]);
    }
  } // convertFermata()

  /**
   * Converts @tie/@gliss with values i (initial), m (medial), t (terminal) into
   * control elements with @startid/@endid. The end note is searched in the same
   * staff (preferably in the same layer) within the same or the following measure.
   * Unresolved values remain as attributes on the notes.
   */
  function convertPairedAttribute({ attribute, element, samePitch, chordInheritance }) {
    const measureIndex = new Map();
    music.querySelectorAll('measure').forEach((m, i) => measureIndex.set(m, i));

    // collect notes with start/end flags, in document order
    const flags = new Map();
    const chords = new Set(); // chords carrying the attribute
    for (const note of music.querySelectorAll('note')) {
      let values = tokens(note.getAttribute(attribute));
      const chord = chordInheritance ? note.closest('chord') : null;
      if (chord && chord.hasAttribute(attribute)) {
        values = values.concat(tokens(chord.getAttribute(attribute)));
        chords.add(chord);
      }
      if (values.length === 0) continue;
      const start = values.includes('i') || values.includes('m');
      const end = values.includes('t') || values.includes('m');
      // attribute of the note, or of the chord the note inherits it from (shown as 'chord@tie="i"')
      const holder = note.hasAttribute(attribute) || !chord ? note : chord;
      const text = attrText(holder, [attribute]);
      const source = { element: note, attributes: holder === note ? text : 'chord' + text };
      flags.set(note, { start, end, startDone: false, endDone: false, source });
    }
    if (flags.size === 0) return;

    const notes = Array.from(flags.keys());
    // starts and ends already encoded as control elements
    const existingEnds = new Set();
    music.querySelectorAll(element + '[endid]').forEach((c) => existingEnds.add(c.getAttribute('endid')));
    for (const note of notes) {
      if (!note.hasAttribute('xml:id')) continue;
      const f = flags.get(note);
      const ref = '#' + note.getAttribute('xml:id');
      if (f.start && existingControlEvents.has(element + '|' + ref)) {
        f.startDone = true;
        record(element, [f.source], [existingControlEvents.get(element + '|' + ref)]);
      }
      if (f.end && existingEnds.has(ref)) f.endDone = true;
    }

    for (let i = 0; i < notes.length; i++) {
      const note = notes[i];
      const f = flags.get(note);
      if (!f.start || f.startDone) continue;
      const measure = note.closest('measure');
      if (!measure) continue; // reported below as unresolved
      const pitch = samePitch ? pitchOf(note) : '';
      if (pitch === null) continue;
      const staff = staffN(note);
      const layer = layerN(note);
      const chord = note.closest('chord');
      let match = null;
      let fallback = null; // end note in another layer of the same staff
      for (let j = i + 1; j < notes.length; j++) {
        const cand = notes[j];
        const candMeasure = cand.closest('measure');
        if (!candMeasure || measureIndex.get(candMeasure) - measureIndex.get(measure) > 1) break;
        const cf = flags.get(cand);
        if (!cf.end || cf.endDone) continue;
        if (chord && cand.closest('chord') === chord) continue;
        if (staffN(cand) !== staff) continue;
        if (samePitch && pitchOf(cand) !== pitch) continue;
        if (layerN(cand) === layer) {
          match = cand;
          break;
        }
        if (!fallback) fallback = cand;
      }
      match = match || fallback;
      if (!match) continue;
      const ctrl = createElement(element, true);
      if (staff) ctrl.setAttribute('staff', staff);
      ctrl.setAttribute('startid', '#' + ensureId(note));
      ctrl.setAttribute('endid', '#' + ensureId(match));
      insertIndented(measure, ctrl, null);
      f.startDone = true;
      flags.get(match).endDone = true;
      record(element, [f.source, flags.get(match).source], [ctrl]);
    }

    // chords without any resolved note keep their attribute (and their notes stay untouched)
    for (const chord of chords) {
      const chordNotes = notes.filter((n) => n.closest('chord') === chord);
      if (chordNotes.some((n) => flags.get(n).startDone || flags.get(n).endDone)) continue;
      chords.delete(chord);
      chordNotes.forEach((n) => flags.delete(n));
      warn(chord, '@' + attribute + '="' + chord.getAttribute(attribute) + '" not converted, no matching notes found');
    }

    // rewrite attributes: keep only unresolved values (chord values are moved to its notes)
    for (const note of notes) {
      const f = flags.get(note);
      if (!f) continue;
      const start = f.start && !f.startDone;
      const end = f.end && !f.endDone;
      const value = start && end ? 'm' : start ? 'i' : end ? 't' : '';
      if (value) {
        note.setAttribute(attribute, value);
        warn(note, '@' + attribute + '="' + value + '" not converted, no matching ' + (start ? 'end' : 'start') + ' found');
      } else {
        note.removeAttribute(attribute);
      }
    }
    chords.forEach((chord) => chord.removeAttribute(attribute));
  } // convertPairedAttribute()

  /**
   * Converts @slur values (e.g., "i1", "m1", "t1") into slur elements. The
   * terminal value with the same number is searched for in the same staff and
   * layer, then in the same staff, and finally anywhere.
   */
  function convertSlur() {
    const elements = Array.from(music.querySelectorAll('note[slur], chord[slur]'));
    if (elements.length === 0) return;
    const parsed = new Map(); // element -> array of {type, n, done}
    for (const el of elements) {
      parsed.set(
        el,
        tokens(el.getAttribute('slur')).map((t) => {
          const m = t.match(/^([imt])(\d*)$/);
          return m ? { type: m[1], n: m[2], done: false } : { type: '', n: t, done: false, invalid: true };
        })
      );
    }
    const slurs = []; // converted slurs: {n, startIndex, endIndex}

    for (let i = 0; i < elements.length; i++) {
      const el = elements[i];
      for (const tok of parsed.get(el)) {
        if (tok.type !== 'i' || tok.done) continue;
        const measure = el.closest('measure');
        if (!measure) continue;
        const staff = staffN(el);
        const layer = layerN(el);
        let sameLayer = null;
        let sameStaff = null;
        let anywhere = null;
        for (let j = i + 1; j < elements.length && !sameLayer; j++) {
          const cand = elements[j];
          const candToks = parsed.get(cand);
          const t = candToks.find((c) => c.type === 't' && c.n === tok.n && !c.done);
          const inSameStaff = staffN(cand) === staff;
          const inSameLayer = inSameStaff && layerN(cand) === layer;
          if (!t) {
            // a new start with the same number in the same layer: slur not terminated
            if (inSameLayer && candToks.some((c) => c.type === 'i' && c.n === tok.n)) break;
            continue;
          }
          const candidate = { cand, t, j };
          if (inSameLayer) sameLayer = candidate;
          else if (inSameStaff) sameStaff = sameStaff || candidate;
          else anywhere = anywhere || candidate;
        }
        const found = sameLayer || sameStaff || anywhere;
        if (!found) continue;
        const startid = '#' + ensureId(el);
        const endid = '#' + ensureId(found.cand);
        let slur = existingControlEvents.get('slur|' + startid + '|' + endid);
        if (!slur) {
          slur = createElement('slur', true);
          const staves = [...new Set([staff, staffN(found.cand)].filter((s) => s))];
          if (staves.length > 0) slur.setAttribute('staff', staves.sort().join(' '));
          slur.setAttribute('startid', startid);
          slur.setAttribute('endid', endid);
          insertIndented(measure, slur, null);
        }
        tok.done = true;
        found.t.done = true;
        slurs.push({ n: tok.n, startIndex: i, endIndex: found.j });
        record(
          'slur',
          [
            { element: el, attributes: '@slur="' + tok.type + tok.n + '"' },
            { element: found.cand, attributes: '@slur="' + found.t.type + found.t.n + '"' },
          ],
          [slur]
        );
      }
    }

    // medial values within converted slurs are redundant
    elements.forEach((el, i) => {
      for (const tok of parsed.get(el)) {
        if (tok.type === 'm' && slurs.some((s) => s.n === tok.n && s.startIndex < i && i < s.endIndex)) tok.done = true;
      }
    });

    // rewrite @slur with unresolved values
    for (const el of elements) {
      const remaining = parsed.get(el).filter((t) => !t.done);
      if (remaining.length > 0) {
        const value = remaining.map((t) => t.type + t.n).join(' ');
        el.setAttribute('slur', value);
        warn(el, '@slur="' + value + '" not converted, no matching start/end found');
      } else {
        el.removeAttribute('slur');
      }
    }
  } // convertSlur()

  // ##########################################################################
  // helpers
  // ##########################################################################

  // records a conversion of the attributes of sources into the elements targets
  function record(name, sources, targets) {
    counts[name] = (counts[name] || 0) + 1;
    changes.push({ name, sources, targets });
  }

  function warn(element, message) {
    warnings.push({ element, message });
  }

  // textual representation of attributes of el, e.g. '@accid="s" @accid.ges="s"'
  function attrText(el, names) {
    return names
      .filter((n) => el.hasAttribute(n))
      .map((n) => '@' + n + '="' + el.getAttribute(n) + '"')
      .join(' ');
  }

  function tokens(str) {
    return (str || '').trim().split(/\s+/).filter((t) => t);
  }

  function directChildren(el, name) {
    return Array.from(el.children).filter((c) => c.localName === name);
  }

  function firstChild(el, names) {
    return Array.from(el.children).find((c) => names.includes(c.localName)) || null;
  }

  function staffN(el) {
    return el.closest('staff')?.getAttribute('n') || '';
  }

  function layerN(el) {
    return el.closest('layer')?.getAttribute('n') || '';
  }

  // pitch of a note as string (written pitch preferred), or null if none
  function pitchOf(note) {
    const pname = note.getAttribute('pname') || note.getAttribute('pname.ges');
    const oct = note.getAttribute('oct') || note.getAttribute('oct.ges');
    if (pname && oct) return pname + oct;
    const course = note.getAttribute('tab.course');
    if (course) return 'tab' + course + '.' + (note.getAttribute('tab.fret') || '');
    return null;
  }

  function newId(nodeName) {
    let id;
    do {
      id = generateId(nodeName);
    } while (existingIds.has(id));
    existingIds.add(id);
    return id;
  }

  // returns xml:id of el, adds a new one if missing
  function ensureId(el) {
    let id = el.getAttribute('xml:id');
    if (!id) {
      id = newId(el.localName);
      el.setAttributeNS(xmlNameSpace, 'xml:id', id);
      changedElements.push(el);
    }
    return id;
  }

  function createElement(name, withId = true) {
    const el = xmlDoc.createElementNS(meiNameSpace, name);
    if (withId) el.setAttributeNS(xmlNameSpace, 'xml:id', newId(name));
    return el;
  }

  // indentation of el, taken from the whitespace text node preceding it
  function indentOf(el) {
    const prev = el.previousSibling;
    if (prev && prev.nodeType === Node.TEXT_NODE && /^\s*$/.test(prev.nodeValue)) {
      const ix = prev.nodeValue.lastIndexOf('\n');
      return ix >= 0 ? prev.nodeValue.slice(ix + 1) : '';
    }
    return '';
  }

  /**
   * Inserts child into parent before element `before` (or at the end of parent,
   * if null), adding whitespace to keep the indentation of the encoding.
   */
  function insertIndented(parent, child, before = null) {
    const doc = parent.ownerDocument;
    if (before) {
      const indent = indentOf(before);
      parent.insertBefore(child, before);
      parent.insertBefore(doc.createTextNode('\n' + indent), before);
      return;
    }
    const parentIndent = indentOf(parent);
    const last = parent.lastChild;
    if (!last) {
      parent.appendChild(doc.createTextNode('\n' + parentIndent + indentUnit));
      parent.appendChild(child);
      parent.appendChild(doc.createTextNode('\n' + parentIndent));
    } else if (last.nodeType === Node.TEXT_NODE && /^\s*$/.test(last.nodeValue) && last.nodeValue.includes('\n')) {
      // whitespace before closing tag: insert after the last child element
      parent.insertBefore(doc.createTextNode('\n' + parentIndent + indentUnit), last);
      parent.insertBefore(child, last);
    } else {
      parent.appendChild(child);
    }
  } // insertIndented()
} // convertAttributesToElements()
