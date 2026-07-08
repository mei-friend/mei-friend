// CodeMirror completion-trigger helpers and hint-system customisations.
// Imported by main.js; the IIFE at the bottom runs as a side effect on import.

export function completeAfter(cm, pred) {
  if (!pred || pred())
    setTimeout(function () {
      if (!cm.state.completionActive)
        cm.showHint({
          completeSingle: false,
        });
    }, 100);
  return CodeMirror.Pass;
}

export function completeIfAfterLt(cm) {
  return completeAfter(cm, function () {
    var cur = cm.getCursor();
    return cm.getRange(CodeMirror.Pos(cur.line, cur.ch - 1), cur) === '<';
  });
}

export function completeIfInTag(cm) {
  return completeAfter(cm, function () {
    var tok = cm.getTokenAt(cm.getCursor());
    if (tok.type === 'string' && (!/['"]/.test(tok.string.charAt(tok.string.length - 1)) || tok.string.length === 1))
      return false;
    var inner = CodeMirror.innerMode(cm.getMode(), tok.state).state;
    return inner.tagName;
  });
}

// Wrap the xml hint helper so that picking an attribute name from the popup
// automatically inserts =" and immediately re-triggers completion for the
// allowed attribute values (if the schema defines any).
(function wrapXmlHintsForAttributeValues() {
  var orig = CodeMirror.helpers && CodeMirror.helpers.hint && CodeMirror.helpers.hint.xml;
  if (!orig) return;
  CodeMirror.registerHelper('hint', 'xml', function (cm, options) {
    var result = orig(cm, options);
    if (!result) return result;
    result.list = result.list.map(function (item) {
      var text = typeof item === 'string' ? item : item.text;
      // Leave element names (<foo), attribute values ("bar"), and items that
      // already carry a custom hint function unchanged.
      if (!text || text[0] === '<' || text[0] === '"' || text[0] === "'" ||
          (typeof item === 'object' && typeof item.hint === 'function')) return item;
      // Attribute name: insert name + =" then offer value completion.
      return {
        text: text,
        displayText: (typeof item === 'object' && item.displayText) ? item.displayText : text,
        hint: function (cm, data, completion) {
          cm.replaceRange(completion.text + '="', data.from, data.to);
          setTimeout(function () {
            if (!cm.state.completionActive) cm.showHint({ completeSingle: false });
          }, 0);
        },
      };
    });
    return result;
  });
})();
