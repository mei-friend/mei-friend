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

// order of the leading child elements of staffGrp, staffDef and scoreDef (MEI 5.1):
// new elements are inserted after the elements listed before them, and before
// any other element (e.g., staffGrp: grpSym*, label/labelAbbr*, instrDef*, staffGrp/staffDef+;
// staffDef: label/labelAbbr*, clef/keySig/meterSig/mensur/instrDef/layerDef* (any order), ambitus?;
// scoreDef: chordTable?, symbolTable*, keySig?, meterSig?, pgHead*, ..., staffGrp?)
const defChildOrder = {
  staffGrp: ['grpSym', 'label', 'labelAbbr'],
  staffDef: ['label', 'labelAbbr', 'clef', 'clefGrp', 'keySig', 'meterSig', 'meterSigGrp', 'mensur', 'proport'],
  scoreDef: ['chordTable', 'symbolTable', 'keySig', 'meterSig', 'meterSigGrp'],
};

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
 * Groups of attributes that can be converted selectively (options.groups):
 *   accid: note@accid; accidGes: note@accid.ges (both as attributes of an accid element);
 *   artic: note|chord@artic, @artic.ges; syl: note|chord@syl;
 *   fermata: @fermata; tie: @tie; slur: @slur; gliss: note@gliss;
 *   definitions: clef, key, meter and mensuration attributes on staffDef/scoreDef;
 *   labels: staffGrp@symbol and (MEI < 5) staffDef|staffGrp@label, @label.abbr
 */
export const conversionGroups = ['accid', 'accidGes', 'artic', 'syl', 'fermata', 'tie', 'slur', 'gliss', 'definitions', 'labels'];

/**
 * Converts all attributes in xmlDoc that have an element equivalent into
 * elements. Modifies xmlDoc in place.
 * @param {Document} xmlDoc
 * @param {Object} options
 * @param {Function} options.generateId function(nodeName) returning a new xml:id
 * @param {string} options.indent indentation unit (e.g., '  ' or '\t')
 * @param {Iterable<string>} options.groups groups of attributes to be converted (see
 *   conversionGroups), all groups if omitted
 * @param {Function} options.scope function(Element) returning whether an element is within
 *   the scope of the conversion (e.g., the editor selection); all elements if omitted.
 *   An attribute is converted if the element carrying it is within the scope; ties,
 *   slurs and glissandi if their start or end element is.
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
  const groups = new Set(options.groups || conversionGroups);
  const inScope = options.scope || (() => true);
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

  if (groups.has('definitions')) convertDefinitions();
  if (groups.has('labels')) convertLabels();
  if (groups.has('accid') || groups.has('accidGes')) convertAccid();
  if (groups.has('artic')) convertArtic();
  if (groups.has('syl')) convertSyl();
  if (groups.has('fermata')) convertFermata();
  if (groups.has('tie')) {
    convertPairedAttribute({ attribute: 'tie', element: 'tie', samePitch: true, chordInheritance: true });
  }
  if (groups.has('gliss')) {
    convertPairedAttribute({ attribute: 'gliss', element: 'gliss', samePitch: false, chordInheritance: false });
  }
  if (groups.has('slur')) convertSlur();

  return { counts, changes, warnings, changedElements };

  // ##########################################################################
  // staffGrp, staffDef, scoreDef
  // ##########################################################################

  function convertDefinitions() {
    for (const conv of defConversions) {
      for (const parent of music.querySelectorAll(conv.parents.join(','))) {
        if (!inScope(parent)) continue;
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

  } // convertDefinitions()

  function convertLabels() {
    // staffGrp@symbol -> grpSym
    for (const staffGrp of music.querySelectorAll('staffGrp[symbol]')) {
      if (!inScope(staffGrp)) continue;
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
      if (!inScope(parent)) continue;
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
  } // convertLabels()

  // inserts a child element into staffGrp/staffDef/scoreDef in canonical order
  function insertDefChild(parent, el) {
    const order = defChildOrder[parent.localName] || [];
    const rank = order.indexOf(el.localName);
    const before = Array.from(parent.children).find((c) => {
      const r = order.indexOf(c.localName);
      return r < 0 || r > rank;
    });
    insertIndented(parent, el, before || null);
  } // insertDefChild()

  // ##########################################################################
  // accid, artic, syl
  // ##########################################################################

  // note@accid (group accid) and note@accid.ges (group accidGes) as attributes of an accid element
  function convertAccid() {
    const names = accidAttributes(groups);
    for (const note of music.querySelectorAll('note[accid], note[accid\\.ges]')) {
      if (!inScope(note)) continue;
      const attrs = names.filter((a) => note.hasAttribute(a));
      if (attrs.length === 0) continue;
      const accids = directChildren(note, 'accid');
      if (inEditorialMarkup(note, 'accid')) {
        warn(note, attrs.map((a) => '@' + a).join(', ') + ' not converted, accid element within editorial markup exists');
        continue;
      }
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
      if (!inScope(el)) continue;
      if (inEditorialMarkup(el, 'artic')) {
        warn(el, '@artic not converted, artic element within editorial markup exists');
        continue;
      }
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
      if (!inScope(el)) continue;
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
      if (!inScope(el)) continue;
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
    // ties/glissandi already encoded as control elements: an existing element accounts
    // for the start value of its start note and, only then, for the end value of its end
    // note (an element starting elsewhere does not consume the end value of another pair)
    const noteById = new Map();
    notes.forEach((n) => n.hasAttribute('xml:id') && noteById.set(n.getAttribute('xml:id'), n));
    for (const ctrl of music.querySelectorAll(element + '[startid]')) {
      const start = noteById.get(ctrl.getAttribute('startid').replace(/^#/, ''));
      const f = start && flags.get(start);
      if (!f || !f.start || f.startDone) continue;
      const end = noteById.get((ctrl.getAttribute('endid') || '').replace(/^#/, ''));
      if (!inScope(start) && !(end && inScope(end))) continue;
      f.startDone = true;
      record(element, [f.source], [ctrl]);
      const fe = end && flags.get(end);
      if (fe && fe.end && !fe.endDone) fe.endDone = true;
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
      if (!match || (!inScope(note) && !inScope(match))) continue;
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
      if (inScope(chord)) warn(chord, '@' + attribute + '="' + chord.getAttribute(attribute) + '" not converted, no matching notes found');
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
        if (inScope(note)) {
          warn(note, '@' + attribute + '="' + value + '" not converted, no matching ' + (start ? 'end' : 'start') + ' found');
        }
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
        if (!found || (!inScope(el) && !inScope(found.cand))) continue;
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
        if (inScope(el)) warn(el, '@slur="' + value + '" not converted, no matching start/end found');
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

  // whether host contains an element (of its own, not of a chord note) within editorial
  // markup, e.g. <supplied><accid/></supplied>; a direct child next to it would duplicate it
  function inEditorialMarkup(host, name) {
    return Array.from(host.querySelectorAll(name)).some(
      (e) => e.parentElement !== host && e.parentElement.closest('note, chord') === host
    );
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

// ############################################################################
// elements to attributes
// ############################################################################

// element attributes and their counterparts on staffDef/scoreDef, per MEI version
const defAttributes = {
  clef: {
    4: { shape: 'clef.shape', line: 'clef.line', dis: 'clef.dis', 'dis.place': 'clef.dis.place', color: 'clef.color', visible: 'clef.visible' },
    5: { shape: 'clef.shape', line: 'clef.line', dis: 'clef.dis', 'dis.place': 'clef.dis.place', color: 'clef.color', visible: 'clef.visible' },
  },
  keySig: {
    4: { sig: 'key.sig', pname: 'key.pname', accid: 'key.accid', mode: 'key.mode', visible: 'keysig.show', 'sig.showchange': 'keysig.showchange' },
    5: { sig: 'keysig', pname: 'key.pname', accid: 'key.accid', mode: 'key.mode', visible: 'keysig.visible', cancelaccid: 'keysig.cancelaccid' },
  },
  meterSig: {
    4: { count: 'meter.count', unit: 'meter.unit', sym: 'meter.sym', form: 'meter.form' },
    5: { count: 'meter.count', unit: 'meter.unit', sym: 'meter.sym', form: 'meter.form', visible: 'meter.visible' },
  },
  mensur: {
    4: { sign: 'mensur.sign', dot: 'mensur.dot', slash: 'mensur.slash', orient: 'mensur.orient', color: 'mensur.color', form: 'mensur.form', loc: 'mensur.loc' },
    5: { sign: 'mensur.sign', dot: 'mensur.dot', slash: 'mensur.slash', orient: 'mensur.orient', color: 'mensur.color', form: 'mensur.form', loc: 'mensur.loc' },
  },
};
const defParents = { clef: ['staffDef'], keySig: ['staffDef', 'scoreDef'], meterSig: ['staffDef', 'scoreDef'], mensur: ['staffDef'] };

// positional attributes of control events that are redundant once expressed on the start/end element
const controlEventAttributes = ['startid', 'endid', 'staff', 'layer', 'tstamp', 'tstamp2'];

/**
 * Converts elements in xmlDoc that can be expressed as attributes into these
 * attributes (the reverse of convertAttributesToElements()), such as
 *   <accid> in note -> note@accid/@accid.ges, <tie startid endid> -> @tie="i"/"t".
 * Elements are only converted when no information is lost: elements with
 * attributes or content that the attribute cannot express (e.g., accid@func,
 * slur@curvedir, syl@wordpos), elements referenced by xml:id from elsewhere,
 * control events without @startid/@endid (e.g., only @tstamp) and elements
 * within editorial markup are kept and reported as warnings.
 * Modifies xmlDoc in place.
 * @param {Document} xmlDoc
 * @param {Object} options
 * @param {Iterable<string>} options.groups groups of elements to be converted (see
 *   conversionGroups), all groups if omitted
 * @param {Function} options.scope function(Element) returning whether an element is within
 *   the scope of the conversion (e.g., the editor selection); all elements if omitted.
 *   An element is converted if it, or an element receiving its attribute, is within the scope.
 * @returns {{counts: Object<string, number>, changes: Array<Object>, warnings: Array<Object>, changedElements: Array<Element>}}
 *   counts: number of removed elements per element name;
 *   changes: one entry per conversion, {name, removed: [{element, text, partial}], targets: [{element, attributes}]},
 *     (partial: only some attributes moved, the element remains)
 *     with the removed elements and the elements that received attributes;
 *   warnings: elements that could not be converted, [{element, message}];
 *   changedElements: always empty (no new xml:ids)
 */
export function convertElementsToAttributes(xmlDoc, options = {}) {
  const groups = new Set(options.groups || conversionGroups);
  const inScope = options.scope || (() => true);
  const counts = {};
  const changes = [];
  const warnings = [];
  const music = xmlDoc.querySelector('music') || xmlDoc.documentElement;
  if (!music) return { counts, changes, warnings, changedElements: [] };
  const meiVersion = parseInt(xmlDoc.querySelector('mei')?.getAttribute('meiversion') || '', 10);
  const version = meiVersion < 5 ? 4 : 5;

  // elements by xml:id, and xml:ids referenced anywhere (by '#id' pointers)
  const byId = new Map();
  const referenced = new Set();
  for (const el of xmlDoc.getElementsByTagName('*')) {
    const id = el.getAttribute('xml:id');
    if (id) byId.set(id, el);
    for (const a of el.attributes) {
      if (!a.value.includes('#')) continue;
      for (const token of a.value.split(/\s+/)) {
        const i = token.indexOf('#');
        if (i >= 0) referenced.add(token.slice(i + 1));
      }
    }
  }

  if (groups.has('definitions')) definitionsToAttributes();
  if (groups.has('labels')) labelsToAttributes();
  if (groups.has('accid') || groups.has('accidGes')) accidToAttributes();
  if (groups.has('artic')) articToAttributes();
  if (groups.has('syl')) sylToAttributes();
  if (groups.has('fermata')) fermataToAttributes();
  if (groups.has('tie')) pairedToAttributes('tie', ['note', 'chord']);
  if (groups.has('gliss')) pairedToAttributes('gliss', ['note']);
  if (groups.has('slur')) slursToAttributes();

  return { counts, changes, warnings, changedElements: [] };

  // ##########################################################################
  // staffGrp, staffDef, scoreDef
  // ##########################################################################

  function definitionsToAttributes() {
    for (const name of Object.keys(defAttributes)) {
      const mapping = defAttributes[name][version];
      for (const parent of music.querySelectorAll(defParents[name].join(','))) {
        const children = directChildren(parent, name);
        if (children.length === 0 || (!inScope(parent) && !children.some(inScope))) continue;
        if (children.length > 1) {
          warn(parent, 'several ' + name + ' elements, not converted');
          continue;
        }
        const el = children[0];
        if (!convertible(el, Object.keys(mapping))) continue;
        const attrs = {};
        for (const a of el.attributes) if (a.name !== 'xml:id') attrs[mapping[a.name]] = a.value;
        if (Object.keys(attrs).length === 0) continue; // empty element, nothing to express
        if (!noConflicts(parent, attrs, el)) continue;
        apply(name, el, [[parent, attrs]]);
      }
    }
  } // definitionsToAttributes()

  function labelsToAttributes() {
    for (const staffGrp of music.querySelectorAll('staffGrp')) {
      const grpSyms = directChildren(staffGrp, 'grpSym');
      if (grpSyms.length === 0 || (!inScope(staffGrp) && !grpSyms.some(inScope))) continue;
      if (grpSyms.length > 1) {
        warn(staffGrp, 'several grpSym elements, not converted');
        continue;
      }
      const el = grpSyms[0];
      if (!convertible(el, ['symbol'])) continue;
      const attrs = { symbol: el.getAttribute('symbol') };
      if (noConflicts(staffGrp, attrs, el)) apply('grpSym', el, [[staffGrp, attrs]]);
    }
    // display labels as attributes only up to MEI 4 (MEI 4 has no @label.abbr)
    if (version >= 5) return;
    for (const parent of music.querySelectorAll('staffDef, staffGrp')) {
      const labels = directChildren(parent, 'label');
      if (!inScope(parent) && !labels.some(inScope)) continue;
      if (labels.length !== 1) {
        if (labels.length > 1) warn(parent, 'several label elements, not converted');
        continue;
      }
      const el = labels[0];
      if (!convertible(el, [], true)) continue;
      const attrs = { label: el.textContent.trim() };
      if (noConflicts(parent, attrs, el)) apply('label', el, [[parent, attrs]]);
    }
  } // labelsToAttributes()

  // ##########################################################################
  // accid, artic, syl
  // ##########################################################################

  function accidToAttributes() {
    for (const note of music.querySelectorAll('note')) {
      const accids = directChildren(note, 'accid');
      if (accids.length === 0 || (!inScope(note) && !accids.some(inScope))) continue;
      if (accids.length > 1) {
        warn(note, 'several accid elements, not converted');
        continue;
      }
      const el = accids[0];
      // attributes of the selected groups (accid: @accid, accidGes: @accid.ges); if the
      // accid element keeps another attribute, only these move and the element remains
      const names = accidAttributes(groups).filter((a) => el.hasAttribute(a));
      if (names.length === 0) continue;
      const partial = ['accid', 'accid.ges'].some((a) => el.hasAttribute(a) && !names.includes(a));
      if (!convertible(el, ['accid', 'accid.ges'], false, false, partial)) continue;
      const attrs = {};
      for (const a of names) attrs[a] = el.getAttribute(a);
      if (noConflicts(note, attrs, el)) apply('accid', el, [[note, attrs]], partial ? names : null);
    }
  } // accidToAttributes()

  function articToAttributes() {
    for (const host of music.querySelectorAll('note, chord')) {
      const hostInScope = inScope(host);
      const artics = directChildren(host, 'artic').filter((el) => {
        if (!hostInScope && !inScope(el)) return false;
        if (!el.hasAttribute('artic') && !el.hasAttribute('artic.ges')) {
          warn(el, 'no @artic or @artic.ges, not converted');
          return false;
        }
        return convertible(el, ['artic', 'artic.ges']);
      });
      if (artics.length === 0) continue;
      const values = { artic: tokens(host.getAttribute('artic')), 'artic.ges': tokens(host.getAttribute('artic.ges')) };
      for (const el of artics) {
        for (const a of ['artic', 'artic.ges']) {
          for (const v of tokens(el.getAttribute(a))) if (!values[a].includes(v)) values[a].push(v);
        }
      }
      const attrs = {};
      for (const a of ['artic', 'artic.ges']) if (values[a].length > 0) attrs[a] = values[a].join(' ');
      apply('artic', artics, [[host, attrs]]);
    }
  } // articToAttributes()

  function sylToAttributes() {
    for (const host of music.querySelectorAll('note, chord')) {
      const verses = directChildren(host, 'verse');
      const syls = directChildren(host, 'syl');
      if (verses.length + syls.length === 0) continue;
      if (!inScope(host) && !verses.concat(syls).some(inScope)) continue;
      if (verses.length + syls.length > 1) {
        warn(host, 'several verse/syl elements, not converted');
        continue;
      }
      let removed;
      let syl;
      if (verses.length === 1) {
        const verse = verses[0];
        if (verse.hasAttribute('n') && verse.getAttribute('n') !== '1') {
          warn(verse, 'verse n="' + verse.getAttribute('n') + '" cannot be expressed by @syl');
          continue;
        }
        if (!convertible(verse, ['n'], false, true)) continue;
        const children = Array.from(verse.children);
        if (children.length !== 1 || children[0].localName !== 'syl') {
          warn(verse, 'verse with content other than one syl element, not converted');
          continue;
        }
        removed = verse;
        syl = children[0];
      } else {
        removed = syls[0];
        syl = syls[0];
      }
      if (syl.hasAttribute('con') || syl.hasAttribute('wordpos')) {
        warn(syl, '@con/@wordpos (syllable connection) cannot be expressed by @syl');
        continue;
      }
      if (!convertible(syl, [], true)) continue;
      const attrs = { syl: syl.textContent.trim() };
      if (noConflicts(host, attrs, removed)) apply('syl', removed, [[host, attrs]]);
    }
  } // sylToAttributes()

  // ##########################################################################
  // control events: fermata, tie, gliss, slur
  // ##########################################################################

  function fermataToAttributes() {
    for (const el of music.querySelectorAll('fermata')) {
      if (!controlEventInScope(el)) continue;
      const target = controlEventTarget(el, 'startid', fermataElements);
      if (!target) continue;
      // @form="norm" is the default form and can be dropped; other forms cannot be expressed
      if (el.hasAttribute('form') && el.getAttribute('form') !== 'norm') {
        warn(el, '@form="' + el.getAttribute('form') + '" cannot be expressed by @fermata');
        continue;
      }
      if (!convertible(el, controlEventAttributes.concat(['place', 'form']))) continue;
      const place = el.getAttribute('place') || 'above';
      if (!['above', 'below'].includes(place)) {
        warn(el, '@place="' + place + '" cannot be expressed by @fermata');
        continue;
      }
      const attrs = { fermata: place };
      if (noConflicts(target, attrs, el)) apply('fermata', el, [[target, attrs]]);
    }
  } // fermataToAttributes()

  // tie and gliss: start element receives 'i', end element 't' (or 'm' when combined)
  function pairedToAttributes(name, allowedTargets) {
    const measureIndex = new Map();
    music.querySelectorAll('measure').forEach((m, i) => measureIndex.set(m, i));
    for (const el of music.querySelectorAll(name)) {
      if (!controlEventInScope(el)) continue;
      const start = controlEventTarget(el, 'startid', allowedTargets);
      const end = start && controlEventTarget(el, 'endid', allowedTargets);
      if (!end || !convertible(el, controlEventAttributes)) continue;
      if (start === end) {
        warn(el, 'start and end element are identical, not converted');
        continue;
      }
      if (name === 'tie' && !tieMatchable(el, start, end, measureIndex)) continue;
      const startValue = combineFlag(start.getAttribute(name), 'i');
      const endValue = combineFlag(end.getAttribute(name), 't');
      if (!startValue || !endValue) {
        warn(el, (startValue ? end : start).localName + ' already carries this @' + name + ' value, not converted');
        continue;
      }
      apply(name, el, [
        [start, { [name]: startValue }],
        [end, { [name]: endValue }],
      ]);
    }
  } // pairedToAttributes()

  /**
   * Slurs receive numbers (1-6) such that slurs overlapping in document order
   * have different numbers; numbers used by existing @slur attributes are avoided.
   */
  function slursToAttributes() {
    const index = new Map();
    music.querySelectorAll('note, chord').forEach((el, i) => index.set(el, i));
    const reserved = new Set();
    music.querySelectorAll('[slur]').forEach((el) =>
      tokens(el.getAttribute('slur')).forEach((t) => reserved.add(t.replace(/^[imt]/, '')))
    );
    const slurs = [];
    for (const el of music.querySelectorAll('slur')) {
      if (!controlEventInScope(el)) continue;
      const start = controlEventTarget(el, 'startid', ['note', 'chord']);
      const end = start && controlEventTarget(el, 'endid', ['note', 'chord']);
      if (!end || !convertible(el, controlEventAttributes)) continue;
      if (index.get(start) >= index.get(end)) {
        warn(el, 'end element does not follow start element, not converted');
        continue;
      }
      slurs.push({ el, start, end, from: index.get(start), to: index.get(end) });
    }
    slurs.sort((a, b) => a.from - b.from);
    const assigned = [];
    for (const s of slurs) {
      let n = 0;
      for (let k = 1; k <= 6 && !n; k++) {
        const overlapping = assigned.some((a) => a.n === k && a.from < s.to && s.from < a.to);
        if (!reserved.has(String(k)) && !overlapping) n = k;
      }
      if (!n) {
        warn(s.el, 'no free slur number (1-6) for overlapping slurs, not converted');
        continue;
      }
      s.n = n;
      assigned.push(s);
      const addToken = (el, token) => tokens(el.getAttribute('slur')).concat([token]).join(' ');
      apply('slur', s.el, [
        [s.start, { slur: addToken(s.start, 'i' + n) }],
        [s.end, { slur: addToken(s.end, 't' + n) }],
      ]);
    }
  } // slursToAttributes()

  // ##########################################################################
  // helpers
  // ##########################################################################

  /**
   * Checks whether el can be removed without loss: only allowed attributes
   * (and xml:id), no content (or only text, if textAllowed; only child elements,
   * if childrenAllowed), not referenced by xml:id, and not inside editorial markup.
   */
  function convertible(el, allowed, textAllowed = false, childrenAllowed = false, elementRemains = false) {
    const extra = Array.from(el.attributes)
      .map((a) => a.name)
      .filter((a) => a !== 'xml:id' && !allowed.includes(a));
    if (extra.length > 0) {
      warn(el, extra.map((a) => '@' + a).join(', ') + ' cannot be expressed as attribute');
      return false;
    }
    const hasText = Array.from(el.childNodes).some((c) => c.nodeType === Node.TEXT_NODE && c.nodeValue.trim());
    if ((el.children.length > 0 && !childrenAllowed) || (hasText && !textAllowed)) {
      warn(el, 'element content cannot be expressed as attribute');
      return false;
    }
    const id = el.getAttribute('xml:id');
    if (id && referenced.has(id) && !elementRemains) {
      warn(el, 'xml:id is referenced from elsewhere, not converted');
      return false;
    }
    return true;
  } // convertible()

  // whether a control event, or its start or end element, is within the scope
  function controlEventInScope(el) {
    if (inScope(el)) return true;
    return ['startid', 'endid'].some((attr) => {
      const target = byId.get((el.getAttribute(attr) || '').trim().replace(/^#/, ''));
      return target ? inScope(target) : false;
    });
  } // controlEventInScope()

  // element pointed to by a single-valued @startid/@endid of a control event in a measure
  function controlEventTarget(el, attr, allowedTargets) {
    if (el.parentElement?.localName !== 'measure') {
      warn(el, 'not a direct child of measure (e.g., within editorial markup), not converted');
      return null;
    }
    const value = (el.getAttribute(attr) || '').trim();
    if (!value) {
      warn(el, 'no @' + attr + ' (e.g., only @tstamp), not converted');
      return null;
    }
    const target = value.startsWith('#') ? byId.get(value.slice(1)) : null;
    if (!target || !allowedTargets.includes(target.localName)) {
      warn(el, '@' + attr + '="' + value + '" does not point to a ' + allowedTargets.join('/') + ' in this file');
      return null;
    }
    return target;
  } // controlEventTarget()

  /**
   * @tie="i"/"t" are only matched (by Verovio, and by convertAttributesToElements())
   * between notes of the same pitch in the same staff, within the same or the next
   * measure. Ties between notes of different pitch (invalid, but drawn by Verovio),
   * across staves or spanning more measures remain elements.
   */
  function tieMatchable(el, start, end, measureIndex) {
    const startPitch = pitchesOf(start);
    const endPitch = pitchesOf(end);
    if (!startPitch || startPitch !== endPitch) {
      warn(
        el,
        'start and end notes differ in pitch (' +
          (startPitch || '?') +
          ' / ' +
          (endPitch || '?') +
          '), @tie would not be matched, not converted'
      );
      return false;
    }
    const staffOf = (e) => e.closest('staff')?.getAttribute('n') || '';
    if (staffOf(start) !== staffOf(end)) {
      warn(el, 'start and end notes are in different staves, @tie would not be matched, not converted');
      return false;
    }
    const distance = measureIndex.get(end.closest('measure')) - measureIndex.get(start.closest('measure'));
    if (!(distance >= 0 && distance <= 1)) {
      warn(el, 'end note is not in the same or the next measure, @tie would not be matched, not converted');
      return false;
    }
    return true;
  } // tieMatchable()

  // adds flag 'i' or 't' to an existing i/m/t value; returns '' if already present
  function combineFlag(value, flag) {
    const t = tokens(value);
    const hasStart = t.includes('i') || t.includes('m');
    const hasEnd = t.includes('t') || t.includes('m');
    if ((flag === 'i' && hasStart) || (flag === 't' && hasEnd)) return '';
    const start = hasStart || flag === 'i';
    const end = hasEnd || flag === 't';
    return start && end ? 'm' : start ? 'i' : 't';
  } // combineFlag()

  // checks that target does not already carry attributes with different values
  function noConflicts(target, attrs, el) {
    for (const [a, value] of Object.entries(attrs)) {
      if (target.hasAttribute(a) && target.getAttribute(a) !== value) {
        warn(el, target.localName + ' already has @' + a + '="' + target.getAttribute(a) + '", not converted');
        return false;
      }
    }
    return true;
  } // noConflicts()

  /**
   * Sets attributes on targets, removes element(s) and records the change
   * @param {string} name
   * @param {Element|Array<Element>} elements to be removed
   * @param {Array<[Element, Object]>} targets elements and attributes to be set
   * @param {Array<string>|null} removeAttributes if given, only these attributes are
   *   removed from the elements, which remain (recorded with partial: true)
   */
  function apply(name, elements, targets, removeAttributes = null) {
    elements = Array.isArray(elements) ? elements : [elements];
    for (const [target, attrs] of targets) {
      for (const [a, value] of Object.entries(attrs)) target.setAttribute(a, value);
    }
    const partial = !!removeAttributes;
    const removed = elements.map((el) => ({ element: el, text: '<' + el.localName + '>', partial }));
    if (partial) elements.forEach((el) => removeAttributes.forEach((a) => el.removeAttribute(a)));
    else elements.forEach((el) => removeIndented(el));
    counts[name] = (counts[name] || 0) + elements.length;
    changes.push({
      name,
      removed,
      targets: targets.map(([target, attrs]) => ({
        element: target,
        attributes: Object.entries(attrs)
          .map(([a, value]) => '@' + a + '="' + value + '"')
          .join(' '),
      })),
    });
  } // apply()

  function warn(element, message) {
    warnings.push({ element, message });
  }
} // convertElementsToAttributes()

// pitch of a note (written pitch preferred, e.g. 'c5'), or null if none
function pitchOf(note) {
  const pname = note.getAttribute('pname') || note.getAttribute('pname.ges');
  const oct = note.getAttribute('oct') || note.getAttribute('oct.ges');
  if (pname && oct) return pname + oct;
  const course = note.getAttribute('tab.course');
  if (course) return 'tab' + course + '.' + (note.getAttribute('tab.fret') || '');
  return null;
} // pitchOf()

// pitch(es) of a note or chord as sorted string (e.g. 'e4 g4'), or null if a pitch is missing
function pitchesOf(el) {
  const notes = el.localName === 'chord' ? Array.from(el.querySelectorAll('note')) : [el];
  const pitches = notes.map(pitchOf);
  if (pitches.length === 0 || pitches.includes(null)) return null;
  return [...new Set(pitches)].sort().join(' ');
} // pitchesOf()

// attribute names of the accid groups selected: accid -> @accid, accidGes -> @accid.ges
function accidAttributes(groups) {
  return [groups.has('accid') ? 'accid' : '', groups.has('accidGes') ? 'accid.ges' : ''].filter((a) => a);
}

function tokens(str) {
  return (str || '').trim().split(/\s+/).filter((t) => t);
}

function directChildren(el, name) {
  return Array.from(el.children).filter((c) => c.localName === name);
}

/**
 * Removes el together with the whitespace before it; a parent left with
 * whitespace only becomes empty (serialized as self-closing tag)
 */
function removeIndented(el) {
  const parent = el.parentNode;
  const prev = el.previousSibling;
  if (prev && prev.nodeType === Node.TEXT_NODE && /^\s*$/.test(prev.nodeValue)) prev.remove();
  el.remove();
  if (parent && Array.from(parent.childNodes).every((c) => c.nodeType === Node.TEXT_NODE && /^\s*$/.test(c.nodeValue))) {
    while (parent.firstChild) parent.firstChild.remove();
  }
} // removeIndented()
