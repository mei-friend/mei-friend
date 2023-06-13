/**
 * The RNGLoader class for parsing and storing an RNG Schema.
 * (author: Laurent Pugin)
 */
export class RNGLoader {
  constructor() {
    this.rngns = 'http://relaxng.org/ns/structure/1.0';
    this.tags = {};
  }

  clearRelaxNGSchema() {
    this.tags = {};
  }

  setRelaxNGSchema(data) {
    const parser = new window.DOMParser();
    const doc = parser.parseFromString(data, 'text/xml');

    ('use strict');
    this.tags = {};
    const funcThis = this;
    let definitions = this.collectDefinitions(doc),
      elements = {};
    Object.keys(definitions).map(function (key) {
      definitions[key].map(function (define) {
        funcThis.findElements(definitions, define, elements);
      });
    });
    elements['!top'] = this.findAllTopLevelElements(definitions, [], doc);
    this.tags = this.sortObject(elements);
  }

  //////////////////////////////////////////////////////////////////////////////
  // schemainfoCreator
  //////////////////////////////////////////////////////////////////////////////

  /**
   * Collect all <define/> elements.
   */
  collectDefinitions(doc) {
    'use strict';
    let /**@type{!Object<!string,!Array.<!Element>>}*/
      definitions = {},
      defs = doc.getElementsByTagNameNS(this.rngns, 'define'),
      i,
      name,
      def,
      array;
    for (i = 0; i < defs.length; i += 1) {
      def = defs.item(i);
      name = def.getAttribute('name');
      array = definitions[name] = definitions[name] || [];
      array.push(def);
    }
    return definitions;
  }

  /**
   * Continue recursion in the definition elements for the given reference.
   */
  followReference(defs, stack, ref, handler) {
    'use strict';
    let name = ref.getAttribute('name').trim();
    if (stack.indexOf(name) === -1) {
      // avoid infinite loop
      stack.push(name);
      defs[name].map(handler);
      stack.pop();
    }
  }

  /**
   * Recurse into the child elements. Follow references.
   */
  recurseRng(defs, stack, rng, handler) {
    'use strict';
    let child;
    if (this.isRng(rng, 'ref')) {
      this.followReference(defs, stack, rng, function (e) {
        handler(e);
      });
    } else {
      child = rng.firstElementChild;
      while (child) {
        handler(child);
        child = child.nextElementSibling;
      }
    }
  }

  /**
   * Collect the text from all the <value/> elements.
   */
  getAttributeValues(defs, stack, rng, values) {
    'use strict';
    let text;
    if (this.isRng(rng, 'value')) {
      text = rng.textContent.trim();
      if (values.indexOf(text) === -1) {
        values.push(text);
      }
    } else {
      const funcThis = this;
      this.recurseRng(defs, stack, rng, function (e) {
        funcThis.getAttributeValues(defs, stack, e, values);
      });
    }
  }

  /**
   * Get the possible names for an element or attribute.
   */
  getNamesRecurse(e, names) {
    'use strict';
    let child;
    if (this.isRng(e, 'name')) {
      names.push(e.textContent);
    } else if (this.isRng(e, 'choice')) {
      child = e.firstElementChild;
      while (child) {
        this.getNamesRecurse(child, names);
        child = child.nextElementSibling;
      }
    }
  }

  /**
   * Get the possible names for an element or attribute.
   */
  getNames(e) {
    'use strict';
    if (e.hasAttribute('name')) {
      return [e.getAttribute('name')];
    }
    let names = [],
      child = e.firstElementChild;
    while (child) {
      this.getNamesRecurse(child, names);
      child = child.nextElementSibling;
    }
    return names;
  }

  /**
   * Find the allowed child elements and attributes for an element.
   */
  defineElement(defs, stack, rng, def) {
    'use strict';
    let names,
      values = [];
    if (this.isRng(rng, 'element')) {
      names = this.getNames(rng);
      names.map(function (name) {
        if (def.children.indexOf(name) === -1) {
          def.children.push(name);
        }
      });
    } else if (this.isRng(rng, 'attribute')) {
      this.getAttributeValues(defs, stack, rng, values);
      names = this.getNames(rng);
      if (values.length === 0) {
        values = null;
      }
      names.map(function (name) {
        if (def.attrs[name]) {
          def.attrs[name] = def.attrs[name].concat(values);
        } else {
          def.attrs[name] = values;
        }
      });
    } else if (this.isRng(rng, 'text')) {
      def.text = true;
    } else {
      const funcThis = this;
      this.recurseRng(defs, stack, rng, function (e) {
        funcThis.defineElement(defs, stack, e, def);
      });
    }
  }

  sortObject(unordered) {
    'use strict';
    let ordered = {},
      keys = Object.keys(unordered);
    keys.sort();
    keys.map(function copy(key) {
      ordered[key] = unordered[key];
    });
    return ordered;
  }

  sortAttributeValues(attrs) {
    'use strict';
    let keys = Object.keys(attrs);
    keys.map(function (key) {
      let a = attrs[key];
      if (a) {
        a.sort();
      }
    });
  }

  findElements(defs, rng, elements) {
    'use strict';
    let child, names, element;
    if (this.isRng(rng, 'element')) {
      element = {
        attrs: {},
        children: [],
      };
      child = rng.firstElementChild;
      while (child) {
        this.defineElement(defs, [], child, element);
        child = child.nextElementSibling;
      }
      element.children.sort();
      element.attrs = this.sortObject(element.attrs);
      this.sortAttributeValues(element.attrs);
      names = this.getNames(rng);
      names.map(function (name) {
        elements[name] = element;
      });
    } else {
      child = rng.firstElementChild;
      while (child) {
        this.findElements(defs, child, elements);
        child = child.nextElementSibling;
      }
    }
  }

  findTopLevelElements(defs, stack, rng, top) {
    'use strict';
    if (rng.localName === 'element') {
      if (rng.hasAttribute('name')) {
        top.push(rng.getAttribute('name'));
      }
    } else {
      const funcThis = this;
      this.recurseRng(defs, stack, rng, function (e) {
        funcThis.findTopLevelElements(defs, stack, e, top);
      });
    }
  }

  findAllTopLevelElements(defs, stack, doc) {
    'use strict';
    let top = [],
      starts = doc.getElementsByTagNameNS(this.rngns, 'start'),
      e,
      i;
    for (i = 0; i < starts.length; i += 1) {
      e = /**@type{!Element}*/ (starts.item(i));
      this.findTopLevelElements(defs, stack, e, top);
    }
    return top;
  }

  isRng(e, name) {
    'use strict';
    return e.namespaceURI === this.rngns && e.localName === name;
  }
}
