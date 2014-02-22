/**
 * Selector - Cross browser selector implementation using Yaex's API
 *
 *
 * @depends: Yaex.js | Core
 * @version 0.10
 * @license Dual licensed under the MIT and GPL licenses.
 */

+ ('Yaex', function ($) {
	'use strict';

	var Yaex = $.Yaex;
	var oldQsa = $.Yaex.QSA;
	var oldMatches = $.Yaex.Matches;

	var filterRE = new RegExp('(.*):(\\w+)(?:\\(([^)]+)\\))?$\\s*');
	var childRE = /^\s*>/;
	var classTag = 'YAEX' + (+new Date());

	//
	// Complex selectors are not supported:
	//   li:has(label:contains("foo")) + li:has(label:contains("bar"))
	//   ul.inner:first > li
	var filters = $.Expr[':'] = {
		visible: function () {
			if (visible(this)) return this;
		},
		hidden: function () {
			if (!visible(this)) return this;
		},
		selected: function () {
			if (this.selected) return this;
		},
		checked: function () {
			if (this.checked) return this;
		},
		parent: function () {
			return this.parentNode;
		},
		first: function (idx) {
			if (idx === 0) return this;
		},
		last: function (idx, nodes) {
			if (idx === nodes.length - 1) return this;
		},
		eq: function (idx, _, value) {
			if (idx === value) return this;
		},
		contains: function (idx, _, text) {
			if ($(this).text().indexOf(text) > -1) return this;
		},
		has: function (idx, _, sel) {
			if ($.Yaex.QSA(this, sel).length) return this;
		}
	};

	function visible(elem) {
		elem = $(elem);
		return !!(elem.width() || elem.height()) && elem.css('display') !== 'none';
	}

	function process(sel, fn) {
		// Quote the hash in `a[href^=#]` expression
		sel = sel.replace(/=#\]/g, '="#"]');

		var filter;
		var arg;
		var match = filterRE.exec(sel);

		if (match && match[2] in filters) {
			filter = filters[match[2]];
			arg = match[3];
			sel = match[1];
			if (arg) {
				var num = Number(arg);
				if (isNaN(num)) arg = arg.replace(/^["']|["']$/g, '');
				else arg = num;
			}
		}

		return fn(sel, filter, arg);
	}

	Yaex.QSA = function (node, selector) {
		return process(selector, function (sel, filter, arg) {
			try {
				var taggedParent;

				if (!sel && filter) {
					sel = '*';
				} else if (childRE.test(sel)) {
					// support "> *" child queries by tagging the parent node with a
					// unique class and prepending that classname onto the selector
					taggedParent = $(node).addClass(classTag);
					sel = '.' + classTag + ' ' + sel;
				}

				var nodes = oldQsa(node, sel);
			} catch (e) {
				// console.error('error performing selector: %o', selector);
				$.Error('Error performing selector: %o', selector);
				throw e;
			} finally {
				if (taggedParent) {
					taggedParent.removeClass(classTag);
				}
			}
			return !filter ? nodes :
				$.Unique($.Map(nodes, function (n, i) {
					return filter.call(n, i, nodes, arg);
				}));
		});
	};

	Yaex.Matches = function (node, selector) {
		return process(selector, function (sel, filter, arg) {
			return (!sel || oldMatches(node, sel)) && (!filter || filter.call(node, null, arg) === node);
		});
	};
})(Yaex)
