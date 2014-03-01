/**
 * DOM.Selector - Cross browser selector implementation using Yaex.DOM's API
 *
 *
 * @depends: Yaex.js | Core, DOM
 * @version 0.10
 * @license Dual licensed under the MIT and GPL licenses.
 */

//---

+ ('Yaex', function () {
	
	'use strict';

	var YaexDOM = Yaex.DOM;
	var oldQSA = Yaex.DOM.YaexDOM.QSA;
	var oldMatches = Yaex.DOM.YaexDOM.Matches;

	var filterReplacement = new RegExp('(.*):(\\w+)(?:\\(([^)]+)\\))?$\\s*');
	var childReplacement = /^\s*>/;
	var classTag = 'YAEX' + Yaex.Now;

	//---

	function Visible(element) {
		elem = Yaex.DOM(element);
		return !!(element.width() || element.height()) && element.css('display') !== 'none';
	}

	// Complex selectors are not supported:
	//   li:has(label:contains("foo")) + li:has(label:contains("bar"))
	//   ul.inner:first > li
	var Filters = Yaex.DOM.Expr[':'] = {
		visible: function () {
			if (Visible(this)) {
				return this;
			}
		},
		hidden: function () {
			if (Visible(this)) {
				return this;
			}
		},
		selected: function () {
			if (Visible(this)) {
				return this;
			}
		},
		checked: function () {
			if (Visible(this)) {
				return this;
			}
		},
		parent: function () {
			return this.parentNode;
		},
		first: function (index) {
			if (index === 0) {
				return this;
			}
		},
		last: function (index, nodes) {
			if (index === nodes.length - 1) {
				return this;
			}
		},
		eq: function (index, _, value) {
			if (index === value) {
				return this;
			}
		},
		contains: function (index, _, text) {
			if (Yaex.DOM(this).text().indexOf(text) > -1) {
				return this;
			}
		},
		has: function (index, _, selector) {
			if (YaexDOM.YaexDOM.QSA(this, selector).length) {
				return this;
			}
		}
	};

	function Process(selector, callback) {
		// Quote the hash in `a[href^=#]` expression
		selector = selector.replace(/=#\]/g, '="#"]');

		var filter;
		var argument;
		var match = filterReplacement.exec(selector);

		if (match && match[2] in Filters) {
			filter = Filters[match[2]];
			argument = match[3];
			selector = match[1];

			if (argument) {
				var num = Number(argument);

				if (isNaN(num)) {
					argument = argument.replace(/^["']|["']$/g, '');
				} else {
					argument = num;
				}
			}
		}

		return callback(selector, filter, argument);
	}

	Yaex.DOM.YaexDOM.QSA = function (node, selector) {
		return Process(selector, function (_selector, filter, argument) {
			try {
				var taggedParent;

				if (!_selector && filter) {
					_selector = '*';
				} else if (childReplacement.test(_selector)) {
					// support "> *" child queries by tagging the parent node with a
					// unique class and prepending that classname onto the selector
					taggedParent = Yaex.DOM(node).addClass(classTag);
					_selector = '.' + classTag + ' ' + _selector;
				}

				var nodes = oldQSA(node, _selector);
			} catch (e) {
				// console.error('error performing selector: %o', selector);
				Yaex.Error('Error performing selector: ' + selector);
				throw e;
			} finally {
				if (taggedParent) {
					taggedParent.removeClass(classTag);
				}
			}
			return !filter ? nodes :
				Yaex.Global.Unique(Yaex.DOM.Map(nodes, function (n, i) {
					return filter.call(n, i, nodes, argument);
				}));
		});
	};

	Yaex.DOM.YaexDOM.Matches = function (node, selector) {
		return Process(selector, function (_selector, filter, argument) {
			return (!_selector || oldMatches(node, _selector)) && (!filter || filter.call(node, null, argument) === node);
		});
	};

	//---
	
})(Yaex.DOM);

//---

