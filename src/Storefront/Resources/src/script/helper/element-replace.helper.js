import Iterator from 'src/script/helper/iterator.helper';
import DomAccess from 'src/script/helper/dom-access.helper';

class ElementReplaceHelperSingleton {

    constructor() {
        this._domParser = new DOMParser();
    }

    /**
     * replace all elements from the target
     *
     * @param {string|HTMLElement} markup
     * @param {array|string} selectors
     *
     * @private
     */
    replaceFromMarkup(markup, selectors, strict = true) {
        let src = markup;
        if (typeof src === 'string') {
            src = this._createMarkupFromString(src);
        }

        if (typeof selectors === 'string') {
            selectors = [selectors];
        }

        this._replaceSelectors(src, selectors, strict);
    }

    /**
     * replaces the target with the src elements
     *
     * @param {NodeList|HTMLElement|string} src
     * @param {NodeList|HTMLElement|string} target
     * @param {boolean} strict
     *
     * @returns {boolean}
     */
    replaceElement(src, target, strict = true) {
        if (typeof src === 'string') {
            src = DomAccess.querySelectorAll(document, src, strict);
        }

        if (typeof target === 'string') {
            target = DomAccess.querySelectorAll(document, target, strict);
        }

        if (src instanceof NodeList) {
            Iterator.iterate(src, (srcEl, index) => {
                target[index].innerHTML = srcEl.innerHTML;
            });
            return true;
        }

        if (target instanceof NodeList) {
            Iterator.iterate(target, (targetEl) => {
                targetEl.innerHTML = src.innerHTML;
            });
            return true;
        }

        if (!target || !src || !src.innerHTML) {
            return false;
        }

        target.innerHTML = src.innerHTML;
        return true;
    }

    /**
     * replaces all found selectors in the document
     * with the ones in the source
     *
     * @param {HTMLElement} src
     * @param {Array} selectors
     * @param {boolean} strict
     *
     * @private
     */
    _replaceSelectors(src, selectors, strict) {
        Iterator.iterate(selectors, (selector) => {
            const srcElements = DomAccess.querySelectorAll(src, selector, strict);
            const targetElements = DomAccess.querySelectorAll(document, selector, strict);

            this.replaceElement(srcElements, targetElements, strict);
        });
    }

    /**
     * returns a dom element parsed from the passed string
     *
     * @param {string} string
     *
     * @returns {HTMLElement}
     *
     * @private
     */
    _createMarkupFromString(string) {
        return this._domParser.parseFromString(string, 'text/html');
    }
}

/**
 * Create the ElementReplaceHelper instance.
 * @type {Readonly<ElementReplaceHelperSingleton>}
 */
export const ElementReplaceHelperInstance = Object.freeze(new ElementReplaceHelperSingleton());

export default class ElementReplaceHelper {

    /**
     * replace all elements from the target
     *
     * @param {string|HTMLElement} markup
     * @param {array|string} selectors
     * @param {boolean} strict
     *
     */
    static replaceFromMarkup(markup, selectors, strict = true) {
        ElementReplaceHelperInstance.replaceFromMarkup(markup, selectors, strict);
    }

    /**
     * replaces the target with the src elements
     *
     * @param {NodeList|HTMLElement|string} src
     * @param {NodeList|HTMLElement|string} target
     * @param {boolean} strict
     *
     * @returns {boolean}
     */
    static replaceElement(src, target, strict = true) {
        return ElementReplaceHelperInstance.replaceElement(src, target, strict);
    }
}