/**
 * Extra - Extra functionalities for Yaex
 *
 *
 * @depends: Yaex.js | Core, Selector, Data, Event, Extra
 * @version 0.10
 * @license Dual licensed under the MIT and GPL licenses.
 */

+ ('Yaex', function ($) {
	'use strict';

	// $.Extend({
	// 	Logo: {
	// 		Colored: 'data:image/png;base64,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',
	// 		Greyscal: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAqLwAAKi8BUJQ8zgAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAABX+SURBVHic7Z15tBTVmcB/1d0vEpQn4hI9GkUNMKPGXcRdwS1ROS7oGGOiM2MkLsEs9nQsSiuVFFc77ZyM5gQjZjQL8UyIM5O4ZHHBiEQEGYNkZBSNC4liZhQJuBBed93549561Gt6qe6uqq5+z985fd5SXXWr6vvu+i3XkFIy3CiWxI7ARP2ZAOwDjAXGAP36p/87wAZgo/74v68HXgJeAFYDqwt5863kniIZjF5XgGJJjAVOAKYBk1FC3yGm4t5GKcMy4BHgsULeXB9TWYnQcwpQLIltgONRAp8KHApku3Q7FeBpYCFKIRYV8uZfu3QvbdETClAsCQMl9IuBGajmPI2sB+4B5qOUIfUvN9UKUCyJ/VFCvwjYs8u30yprgLuB+YW8+Wy3b6YeqVSAYklMA2YDJ3X7XiLiUWBOIW8+0u0bqSY1CqCb+TNRgj+yy7cTF0uBOcD9aekeUqEAxZKYAVwPHNjte0mIlcA3Cnnznm7fSFcVoFgSk4C5qNH8SGQhcGUhbz7frRvoigIUS+LDgAVcC3wo8RtIF5uBmwG3kDffT7rwxBWgWBJnAbcC4xMtOP28Aswq5M37kiw0MQUolsQo4Bbg8kQK7F3mAdcU8uamJApLRAGKJTERWAAcFHthw4NngAsKeXN13AVl4i6gWBIXAsv5QPitcBCwXL+7WImtBSiWRA7V118RSwEjh9tQY4NyHBePRQGKJTEa1eSfEfnFRyYPoLqE96K+cOQKUCyJccD9wFGRXvgDlgBnFvLmuigvGqkCFEtiD+DXwH6RXXQY4b/r4Ds3DGPIzyasAk4r5M0/RXVPkSmAHuk/RO9Z7WLD8zw8zwOGCr0WhmGQyWTIZJqOy9cAp0Q1Q4hEAXTN/y0fCB8p5RDBA6+jpnUv689L+vMGsAuwKzAF+Edgz0wmQzbb1L9lDXBMFC1Bxwqg+/zHGeHNfqVSCQr9XeBe4PvAQ5ZpN33JrnAywO3AZdlsNkxLsAo4rtMxQUcKoEf7DzOCB3ye51GpVAAkqiL8EPiJZdrvtHotVzhZ4CnDMA7J5XJhTlkCnNzJ7KBtBdDz/J8xQqd6UkoqlYrfty8HrrZMe2mn13WFczPwlb6+vrCnPACc3e46QScrgbcyQoVfqVQol8tIKd8EPg9MjkL4mheg+aAxwBkoWbRFWwqglyhH3Aqf53kMDAzgeV4F+C4wwTLt28P08S3wEQg9LfS5ot1l45YVQE/35rVTWCtICeVy2a9pcRfXlEql4vf1/wUcYZn2FZZpxxETML7N8+Zp2bRESwqgTboLUFE1seF5knJ5ACnlBinlQGB03RXK5bI/wr8LOMYy7d/FWNzUFmu/zxhggZZRaEINNQPcQsxWvcB06nHgf4Hz2nwhHSOlpFwug/La+ZJl2nPjLM8VzhRgrxBTwHochJLRzLAnhC5Je/LE6syha9oAYAN3ooXfwQtpG8/zfOGvBabGLXzNpUCnz3u5llUoQk0DtQ/fKmJ049J9fRn4FLAYeB7ob2E6FBmBVuhJ4FzLtNfGXaYrnAnAs5lMpi/ESmAzXgH2C+NjGFbVLGIUvp5PS+Aqy7TvAb4J9EfwItq6Fy387wHHJyF8TQnoi6i1G4+SWVOatgDadXslMXnvBl74bMu0he4HnzCMjJHLJasAgXv5F8u0v9TudVzhjAJOBz4BfAz4qD70E+AHlmm/WPX9E4DfhLQDhGUzcGAzl/Mwg8C5xCT8gNHkFsu0hf73t4BuCv/b7QjfFY4BnA38PSrOYVv/mD+IlVJagOkK5wtVY4qbgSiFD0pmc1FR1HVp2ALoiJ2fRnlXPmqePwDwFDDFMm3PFc6RwJMhjSGRERD+XMu0r2rlXFc4fajB21eASbDFtGsYxpAFnarl4+st03Zd4XwG+GGMz3x+owikugqgY/VWEFO4lh70vQ8capn2cwCucOYDn05y4BcQ/nct0w69uukKZwxwFTAL2K0Fe35wcetW4BzDMD4a0vjTDiuBg+vFIjYq9UxiEr7nef4LuCEg/J2AGV2q+XeEFb4rnN2AL6OmxP2tCN4nl8v5Zc+CyJv+ag5EybJmwEkjBZgdx934zSDKgeSfA4dmAtskpQCB8ccPLNNuur7hCudjgInKVbCNYRhks9lW1+wHCTb5CSx0zaaOAtTsAnR8/sNx3InW/PeAAy3T/gMMOkO8bBjGnjE2hYMEVvh+j1rXr5vWxRVOP/A1VHP/Ib+2d2t1sgNOrpWfoN7bjq32B0bafwgcmo52h0oC3QK9D1xYT/haKWcCDrBzDwveZzYqj9EQtnrjOi1LLJk59It/G7ix6tDV0PESaOh70K3etZZpr6r1Hb0WsQKYaxjGzrlcrqPmPiWcpGU7hFotwMVxlC6l9F/8zZZp/8X/vyucScDUJIQfaIHuq7W2r+fy1wFfA6Mvm21tcNcDXIx6vkGGPJ2e+l0UR8m69q9FLfQEuRowknjR5XIF4HXDMC6tPuYKZ1eUW/ucTCbT19eXG27CB7hIy3iQ6ic8nhhcuwO1X1imPWig0Eumn02ib1U1XwLGzNnX3TDEk9YVzl4ov75p2Ww27mlZN9kTJeNBqhUgluZf1/6XUG5UQU5Dz6XjplLxAFZa5g33B//vCmdH4EFg91xuWNb6aobIePBpdQbOGVGXFqj9t1imXe25ejbEP/jbUvu36n5AJXacmMvlen2QF5YZWtbA0BbgeGLIwKkHXRtR7lSD6AHXJ5N46foeXkdl8Azewz7AiT0+vWuVsQS6gaACNLQatYt++Xdbpr2x6tAxwC5x1/5AC/SdGi3QcVXfGSkMyjr49iNP1RZw5vx2jcPnQFLNP+8YhlHLpevHQElKuaFcLjMwMEC5XK4O8xqODMrakFL6KdffJOKs2wMDZUAuskz7hOpjrnBWG4YxIe6lX215e9Ay7dPqfccVzraolPMnoprHQwFtkjQGzbrqk8jafdxUgJ0KeXO9//ZPIGLhBwZet1Ufc4Xzt8AEw0hm8QflX1gXy7TfBX6hP7jCGQ0cC5wI8kgp5celZOfgOUOVwug1pciiZP5zXwEi7//1i/8L8O81Dp8LkMnE+9IC/fpzrZxnmfZ7qKnhg/7/XOHsDhyGah0OllIeKKUcDww+RFAZemA6OY2AAkyO+uq6D/2lZdoDNQ5P95vWhPifTi9gmfZrwGuosG9g0FJ4GHAIcIiU8hAp5SQgV6lUAgqRiV3Z22AybLEFtBxS1IhAzfuP6mOucD4CHJ7ECwncR02jT6dYpr0BlQr+Uf9/uvs4HDhCSjlZSnkqeGMrFUiZRXEiQE5vsBTpHju69r+LShZVzceBTBIvQSvAACrCKBF097FIf3yfwdOBCzzPO8vzvO1Togg7FEtixxwR134YVICHg+v+AfaGZEbSuow+1M5hsWfdrIXuAu8D7tNdxlc9z5vled62KVh9nJghvub/Z3W+Mh4SVQBQ/XTXsUx7g2XaJipWYEUKIp8nZlC1IzICD7SozlfGR1leIwIKUHcNoBtYpv0GcArwojaUdYsJGdSmipGhFeBNy7RfqvOVvZJs9vR07BJXOBckVmgILNN+E7izyy3APhkiNgDpB3q6wVf2TFIBAq5cd7jC+URiBYfjt0A3l53H5og42YNWgKdqHdNZsHaLsrwwZLNZyuVyP/ALVzgrUKFYD1um/eek76WKPujq0vKYHFv2z+2YQHO2rM5XxgK5pB/YMAz6+vp0SjfvYJDzAVzh/BVlJn4NeBXltOInc3wReD3i/D/VbB/jtcPQH2kLEFCAV+p85W2gIqXsis+VP/8OpG/dRkr2Brm3lPLYGqdscoXzR9QU8kngCWCpth1EQbd3QB0TeRegqbnwogNA1wM7xlBmaBqt0/u+AVqZR0kpJ0gpJ7AlJV7ZFc4qVCv3JLDYMu12d/2KrPVtk1i6AAn8X4OvvSWl7KoCNKKeZc9XCs+TOSm9A1Exd5cBuMJZh3IqXYpqJZYEXd8bsL1fZpfoj8NktcEy7UaT29W96H3jW/hyuSx9fX34wSJ6SXcccCpq88tfAutc4Zwc4rLdbgHIABsivmaz3HkPQEuZMFOJrxDZbJZcLkeVY8v3LdMOE1vZ7UHghgzKYTNKtmty/OfgpwQaHgQinkElcL465Kn9AXeCbrAxDgXYQQdW1kQnXVqq/fR7Hj+dnJRyALgBOK6OEawW/V22DG/MEWEXoAczGWAnGptg8yAXVSoVo1ejcPSaAtrt7ffAJW1kEN0l8htrjVi6ANAJj+thmfZiYEEgU0hP4Df1AwMDusmXS4G/Aw5uVfjaceSALpuDN+ZoPmgLTeBhwmj2l4Fjy+Xy7imwi9dly/RvUFnLKPt+yTLtJR1c+lNElxewXdZnUMueUXNosy9Ypv06yj99bQrs4kPwa7qfrbxSqUgp5VOoFDETLNM+txPhu8LZHhAp8CZ+KYfeoCAK/AeSUp6CynzZEMu0V7vCmQY8WC6X94g4UWJoatRyUL7zT6D8Gn+qnUI7xhXOOFQLsksKxj8vGDd9c85RqAeNhEAOoHGNcu8EcYWzHeACV6Kbxbh85oJLvVUhYR5b1vwXA/dapt1oRbNlXOHsDfwKmJh0LsQ6HJ0jYl85LbTRqMCDBxt/W6E3WPqiK5y7gK95nne653mjwCCTaS/4onqTxkB2EJ93UJs/LEHZ5RfHtAEEAK5wDkfV/F1TNOZZ7YeGrSNCz+CBgQGAWy3Tvqad87Xz5AWogdIRVBmshr48Az0VazSOkChzr79WvxhYYZl2IosRrnDOB+4EY7tcLjW5ht4u5M1xvgI8CRwZ1ZXL5QpSehuBfTttRnUY+b6ogeVBwF4ohdgu8HMT8GdUCpo39M+1KFv/68DasN1RlLjCmYwaCx1vGEb1cnG3WVrIm1P8O1pGhAqQzWYol70xqNRkX+zkWtoh40X9WRDB7cWOTip5I3AeYKSkv69mGWwJD98qf1wnBGLjZrrC2SPKa6cZVzg7u8L5DioSaUYmkzH6+vrSKHzQMvdbgMdQ057I5iXa82YU8HXgH6K6bhpxhbMvKqnkTKBfzWKypKOrr0kFJfMtqWKLJbEMNeCKrpQtiRY+a5n2j6K8drfRIV/no5xCTgQMw8iQzXY95CsMTxXy5pDgUICFRKwA2WzWn2vPc4WzOsLdNbuGzm0wE/g0sJM/VU1BrF8rLPR/CSrAI0Ah6pKy2Rzl8sAo4D9d4RwR1YpakrjC+TBwIaq2Hw2pi/RtlcExX1ABFqEMQ5F6qhqGyo9fLpd3Axa6wjnXMu1noywjDnQY+1koZ9CptLk3QApZTyBsb0i6+GJJ3IF2dIyaQIr291A7bd/V5JTE0at101GbPR2KniX1eG2v5nuFvPk5/4/qlYn5xKQA/kJIpVIZLaW8U++UdbVeBu4K2gZxOmpHjVPRUUv19vwZJgzJlVitAIuANcSQLxiGKAGe510CTHeFczvwLcu0E0nioBdppqOa9mPRO6L5Au/x5r0Za6iK2t5qx5BiSdwIfDXuO6naQWsT8CNUOtlIxwc6BdzRKIF/Eh0OH0zmNAxreT1uKuTNIeniaynA/sB/J3VHvpUuYKlbi9LShagAztAOKzrr9yHAwSi7wQGo8PcMDPumPQwHFPLmkApWb8+ghcS0a0g9gvb5KrPtBmAd8Fbg8y7KejkOFWY2Tn9GbzltS1LHEdC0h+HRQt7cKhtsPfPUHBJWgGCtDCwgIaXsB/p1Tj786LNgDfZ/b9dvwK8Ew7xlmFPrn402jozURJw2GuUD7nRLuBSytJA3p9Q60MhAPYdAUsQ0Ue3S1UrKVuXPXwE18LwHFdT5FGoXsSOAw6SU55TL5Z1TasZth5q1HxorwP2obUdj2T20Xapq7kbgeSnl7gzO4esbZALCXw58xt+1NMDvAFzhWMDtlUrlHM/z0ubI0SorqZ2vEeji5tGtUlVz56ByED/nZ/DQmz6dCAhg72q/u8BK5I9R1smm7mCucArATT3eErS3ebRPsSQeIYa9BFohILzlKOHVzf2r5/0l4PO5XM7wlUDHHrwKHNDK6qMrnEeAqSly5GyFhYW82TAReBi1vhLYHM39tIeu+a8AJzUSPqjU75ZpXwnc5kfsBkb6l7Wx9Hwp8G4PbiCxGSW7hjRVgELefB6VVasr6NVCCXyuReH9k5Ty5cC6wpshY/aHYJn2H4FlaYpcCsnNWnYNCduxudRP/BQrWnj3tio8ncjJDET7rOjgNp7uMQV4BSWzpoRSgELefB+Y1cENdcriNs/7TUABVnZQ/jPQU1lNZmmZNSX00LaQN+8D5rV9S20Q6HeXt3O+zsm7Vv/ZSYLKXaFn9gqap2UVilbnNtega0PCvNrBub4L2iEdXOPwDs5NkmdQMgpNSwpQyJubUCFbcSSV2IpAjTuonfN1VNEkPYefoCNz27nG4UlscNUhG4ELtIxC0/JTFfLmauDyVs9rh4ACtFsD/wYYo126stTev7AZ1wL7pHDPn2ou17JpibbUupA3/40a28HFgVaCMxolnmrAef41dCtwkQ7UDIUrnP2Br/eAOfk2LZOW6eSpZqFz/sWJfvEHA9c1+eoQtP/+bF9wvoUP+FdXOE39HnWix18Bo1JuC3iADmZoTZeCG1EsidHAw8BRbV8kBNoAtBmVgq1eJvJBtLPno2Ac3tc3VHgBY9IDqMyeK4OZTV3hTAS+AFxpGEYm5WbhJcDJhbz5XrsX6EgBAIolMQ54HNivows1QW9DuxkVa3hjPWOOrrl3AOPrrd8r20IFnVdgE8oF7n3UYLMfGMwCmmJWAccV8ua6Ti7SsQIAFEtiD1SWjVi8iX0CtXcFqgYvR0199kINFI8FphuGYYSpuf4iUbVHUA94Bq0BjinkzT91eqFIFACgWBITgYeIWQl8B9J6990DNbdT1gCntDPir0VkCgCDLcGvibk78BlB/nw+q4DToqj5PpEqAAyOCe4n5oHhCGQJcGanfX41kU9u9Q2eTAJTxBHEA6jRfqTChxgUAEBPS84mocWiYc5twNmdTPUaEXkXUE2xJC5EWRHj2JtoOLMRtbzb1gpfWGJXABicISygTaPOCOQZlGEn9g2vE1ng1g8yhYT9CXqUecCUJIQPCbUAQYolcRZwKwluIt0jvILy5AntzBEFiZu49APuh/Lf76q3cUrYjHoX+yUtfOhCCxCkWBKTgLl0Oe6giywErgzjvRsXXVUAHx2BdD0pC0OLkZXANxpF7CRFKhQAoFgSBipXz2yGb1TyUlRY2/2FvJmKF58aBQhSLIlpKEVINEdBjDwKzCnkzUhzMkdBKhXAR6eruRi4iJitjDGwBrgbmF+dliVNpFoBfHT3cDxKGWbQ/W3X67EelXNgPrAoLc18I3pCAYIUS2IblDJMQ80eDiXCLOctUgGeRo3mH0EJPfGNKTqh5xSgmmJJjEXtTzQNmAxMJMLtb6p4G7XH0jKUwB8r5M3Y9hlKgp5XgFoUS2JHlCJMROUF3AfVbYxB+fyNCfwOKhPZRv3xf1+P2lPxBZTQVxfy5lvJPUUy/D8+DIz4oyY2WQAAAABJRU5ErkJggg=='
	// 	}
	// });

	//---

	// Map object to object
	$.MapObjectToObject = function (obj, callback) {
		var result = {};

		$.each(obj, function (key, value) {
			result[key] = callback.call(obj, key, value);
		});

		return result;
	};

	//---

	// Storage Module
	// Private data
	var isLocalStorage = typeof window.localStorage !== 'undefined';

	// Private functions
	function WriteToLocalStorage(name, value) {
		var key;

		if ($.isString(name) && $.isString(value)) {
			localStorage[name] = value;
			return true;
		// } else if ($.isObject(name) && typeof value === 'undefined') {
		} else if ($.isObject(name) && $.isUndefined(value)) {
			for (key in name) {
				if (name.hasOwnProperty(key)) {
					localStorage[key] = name[key];
				}
			}

			return true;
		}

		return false;
	}

	function ReadFromLocalStorage(name) {
		return localStorage[name];
	}

	function DeleteFromLocalStorage(name) {
		return delete localStorage[name];
	}

	function WriteCookie(name, value) {
		var date;
		var expire;
		var key;

		date = new Date();
		date.setTime(date.getTime() + 31536000000);

		expire = '; expires=' + date.toGMTString();

		if ($.isString(name) && $.isString(value)) {
			document.cookie = name + '=' + value + expire + '; path=/';
			return true;
		// } else if (typeof n === 'object' && typeof v === 'undefined') {
		} else if ($.isObject(name) && $.isUndefined(value)) {
			for (key in name) {
				if (name.hasOwnProperty(key)) {
					document.cookie = key + '=' + name[key] + expire + '; path=/';
				}
			}

			return true;
		}

		return false;
	}

	function ReadCookie(name) {
		var newName;
		var cookieArray;
		var x;
		var cookie;

		newName = name + '=';
		cookieArray = document.cookie.split(';');

		for (x = 0; x < cookieArray.length; x++) {
			cookie = cookieArray[x];

			while (cookie.charAt(0) === ' ') {
				cookie = cookie.substring(1, cookie.length);
			}

			if (cookie.indexOf(newName) === 0) {
				return cookie.substring(newName.length, cookie.length);
			}
		}

		return null;
	}

	function DeleteCookie(name) {
		return WriteCookie(name, '', -1);
	}

	/**
	 * Public API
	 * $.Storage.Set('name', 'value')
	 * $.Storage.Set({'name1':'value1', 'name2':'value2', etc})
	 * $.Storage.Get('name')
	 * $.Storage.Remove('name')
	 */
	$.Extend({
		Storage: {
			Set: isLocalStorage ? WriteToLocalStorage : WriteCookie,
			Get: isLocalStorage ? ReadFromLocalStorage : ReadCookie,
			Remove: isLocalStorage ? DeleteFromLocalStorage : DeleteCookie
		}
	});

	//---

	// Local storage Implementation 
	$.map(['localStorage', 'sessionStorage'], function (method) {
		var defaults = {
			cookiePrefix: 'fallback:' + method + ':',
			cookieOptions: {
				path: '/',
				domain: document.domain,
				expires: ('localStorage' === method) ? {
					expires: 365
				} : undefined
			}
		};

		try {
			$.Support[method] = method in window && window[method] !== null;
		} catch (e) {
			$.Support[method] = false;
		}

		$[method] = function (key, value) {
			var options = $.Extend({}, defaults, $[method].options);

			this.getItem = function (key) {
				var returns = function (key) {
					return JSON.parse($.Support[method] ? window[method].getItem(key) : $.cookie(options.cookiePrefix + key));
				};
				if (typeof key === 'string') return returns(key);

				var arr = [],
					i = key.length;
				while (i--) arr[i] = returns(key[i]);
				return arr;
			};

			this.setItem = function (key, value) {
				value = JSON.stringify(value);
				return $.Support[method] ? window[method].setItem(key, value) : $.cookie(options.cookiePrefix + key, value, options.cookieOptions);
			};

			this.removeItem = function (key) {
				return $.Support[method] ? window[method].removeItem(key) : $.cookie(options.cookiePrefix + key, null, $.Extend(options.cookieOptions, {
					expires: -1
				}));
			};

			this.clear = function () {
				if ($.Support[method]) {
					return window[method].clear();
				} else {
					var reg = new RegExp('^' + options.cookiePrefix, ''),
						opts = $.Extend(options.cookieOptions, {
							expires: -1
						});

					if (document.cookie && document.cookie !== '') {
						$.map(document.cookie.split(';'), function (cookie) {
							if (reg.test(cookie = $.trim(cookie))) {
								$.cookie(cookie.substr(0, cookie.indexOf('=')), null, opts);
							}
						});
					}
				}
			};

			if (typeof key !== 'undefined') {
				return typeof value !== 'undefined' ? (value === null ? this.removeItem(key) : this.setItem(key, value)) : this.getItem(key);
			}

			return this;
		};

		$[method].options = defaults;
	});

	//---

	// Yaex Timers
	$.fn.extend({
		everyTime: function (interval, label, fn, times, belay) {
			//console.log(this);
			return this.each(function () {
				$.timer.add(this, interval, label, fn, times, belay);
			});
		},
		oneTime: function (interval, label, fn) {
			return this.each(function () {
				$.timer.add(this, interval, label, fn, 1);
			});
		},
		stopTime: function (label, fn) {
			return this.each(function () {
				$.timer.remove(this, label, fn);
			});
		}
	});

	$.Extend({
		timer: {
			GUID: 1,
			global: {},
			regex: /^([0-9]+)\s*(.*s)?$/,
			powers: {
				// Yeah this is major overkill...
				'ms': 1,
				'cs': 10,
				'ds': 100,
				's': 1000,
				'das': 10000,
				'hs': 100000,
				'ks': 1000000
			},
			timeParse: function (value) {
				if (value === undefined || value === null) {
					return null;
				}
				var result = this.regex.exec($.trim(value.toString()));
				if (result[2]) {
					var num = parseInt(result[1], 10);
					var mult = this.powers[result[2]] || 1;
					return num * mult;
				} else {
					return value;
				}
			},
			add: function (element, interval, label, fn, times, belay) {
				var counter = 0;

				if ($.isFunction(label)) {
					if (!times) {
						times = fn;
					}
					fn = label;
					label = interval;
				}

				interval = $.timer.timeParse(interval);

				if (typeof interval !== 'number' ||
					isNaN(interval) ||
					interval <= 0) {
					return;
				}
				if (times && times.constructor !== Number) {
					belay = !! times;
					times = 0;
				}

				times = times || 0;
				belay = belay || false;

				if (!element.$timers) {
					element.$timers = {};
				}
				if (!element.$timers[label]) {
					element.$timers[label] = {};
				}
				fn.$timerID = fn.$timerID || this.GUID++;

				var handler = function () {
					if (belay && handler.inProgress) {
						return;
					}
					handler.inProgress = true;
					if ((++counter > times && times !== 0) ||
						fn.call(element, counter) === false) {
						$.timer.remove(element, label, fn);
					}
					handler.inProgress = false;
				};

				handler.$timerID = fn.$timerID;

				if (!element.$timers[label][fn.$timerID]) {
					element.$timers[label][fn.$timerID] = window.setInterval(handler, interval);
				}

				if (!this.global[label]) {
					this.global[label] = [];
				}
				this.global[label].push(element);

			},
			remove: function (element, label, fn) {
				var timers = element.$timers,
					ret;

				if (timers) {

					if (!label) {
						for (var lab in timers) {
							if (timers.hasOwnProperty(lab)) {
								this.remove(element, lab, fn);
							}
						}
					} else if (timers[label]) {
						if (fn) {
							if (fn.$timerID) {
								window.clearInterval(timers[label][fn.$timerID]);
								delete timers[label][fn.$timerID];
							}
						} else {
							for (var _fn in timers[label]) {
								if (timers[label].hasOwnProperty(_fn)) {
									window.clearInterval(timers[label][_fn]);
									delete timers[label][_fn];
								}
							}
						}

						for (ret in timers[label]) {
							if (timers[label].hasOwnProperty(ret)) {
								break;
							}
						}
						if (!ret) {
							ret = null;
							delete timers[label];
						}
					}

					for (ret in timers) {
						if (timers.hasOwnProperty(ret)) {
							break;
						}
					}
					if (!ret) {
						element.$timers = null;
					}
				}
			}
		}
	});

	//---

	$.Extend({
		queue: function (elem, type, data) {
			var queue;

			if (elem) {
				type = (type || 'fx') + 'queue';
				queue = $.data_priv.get(elem, type);

				// Speed up dequeue by getting out quickly if this is just a lookup
				if (data) {
					if (!queue || $.isArray(data)) {
						queue = $.data_priv.access(elem, type, $.makeArray(data));
					} else {
						queue.push(data);
					}
				}
				return queue || [];
			}
		},

		dequeue: function (elem, type) {
			type = type || 'fx';

			var queue = $.queue(elem, type),
				startLength = queue.length,
				fn = queue.shift(),
				hooks = $._queueHooks(elem, type),
				next = function () {
					$.dequeue(elem, type);
				};

			// If the fx queue is dequeued, always remove the progress sentinel
			if (fn === 'inprogress') {
				fn = queue.shift();
				startLength--;
			}

			if (fn) {

				// Add a progress sentinel to prevent the fx queue from being
				// automatically dequeued
				if (type === 'fx') {
					queue.unshift('inprogress');
				}

				// clear up the last queue stop function
				delete hooks.stop;
				fn.call(elem, next, hooks);
			}

			if (!startLength && hooks) {
				hooks.empty.fire();
			}
		},

		// not intended for public consumption - generates a queueHooks object, or returns the current one
		_queueHooks: function (elem, type) {
			var key = type + 'queueHooks';
			return $.data_priv.get(elem, key) || $.data_priv.access(elem, key, {
				empty: $.Callbacks('once memory').add(function () {
					$.data_priv.remove(elem, [type + 'queue', key]);
				})
			});
		}
	});

	//---

	$.fn.extend({
		queue: function (type, data) {
			var setter = 2;

			if (typeof type !== 'string') {
				data = type;
				type = 'fx';
				setter--;
			}

			if (arguments.length < setter) {
				return $.queue(this[0], type);
			}

			return data === undefined ?
				this :
				this.each(function () {
					var queue = $.queue(this, type, data);

					// ensure a hooks for this queue
					$._queueHooks(this, type);

					if (type === 'fx' && queue[0] !== 'inprogress') {
						$.dequeue(this, type);
					}
				});
		},
		dequeue: function (type) {
			return this.each(function () {
				$.dequeue(this, type);
			});
		},
		// Based off of the plugin by Clint Helfers, with permission.
		// http://blindsignals.com/index.php/2009/07/jquery-delay/
		delay: function (time, type) {
			time = $.fx ? $.fx.speeds[time] || time : time;
			type = type || 'fx';

			return this.queue(type, function (next, hooks) {
				var timeout = setTimeout(next, time);
				hooks.stop = function () {
					clearTimeout(timeout);
				};
			});
		},
		clearQueue: function (type) {
			return this.queue(type || 'fx', []);
		},
		// Get a promise resolved when queues of a certain type
		// are emptied (fx is the type by default)
		promise: function (type, obj) {
			var tmp,
				count = 1,
				defer = $.Deferred(),
				elements = this,
				i = this.length,
				resolve = function () {
					if (!(--count)) {
						defer.resolveWith(elements, [elements]);
					}
				};

			if (typeof type !== 'string') {
				obj = type;
				type = undefined;
			}
			type = type || 'fx';

			while (i--) {
				tmp = data_priv.get(elements[i], type + 'queueHooks');
				if (tmp && tmp.empty) {
					count++;
					tmp.empty.add(resolve);
				}
			}
			resolve();
			return defer.promise(obj);
		}
	});

	//---

	$.fn.appear = function (fn, options) {
		var settings = $.Extend({
			//arbitrary data to pass to fn
			data: undefined,

			//call fn only on the first appear?
			one: true
		}, options);

		return this.each(function () {
			var t = $(this);

			//whether the element is currently visible
			t.appeared = false;

			if (!fn) {

				//trigger the custom event
				t.trigger('appear', settings.data);
				return;
			}

			var w = $(window);

			//fires the appear event when appropriate
			var check = function () {

				//is the element hidden?
				if (!t.is(':visible')) {

					//it became hidden
					t.appeared = false;
					return;
				}

				//is the element inside the visible window?
				var a = window.scrollX;
				var b = window.scrollY;
				var o = t.offset();
				var x = o.left;
				var y = o.top;

				if (y + t.height() >= b &&
					y <= b + w.height() &&
					x + t.width() >= a &&
					x <= a + w.width()) {

					//trigger the custom event
					if (!t.appeared) t.trigger('appear', settings.data);
				} else {

					//it scrolled out of view
					t.appeared = false;
				}
			};

			//create a modified fn with some additional logic
			var modifiedFn = function () {

				//mark the element as visible
				t.appeared = true;

				//is this supposed to happen only once?
				if (settings.one) {

					//remove the check
					w.unbind('scroll', check);
					var i = $.inArray(check, $.fn.appear.checks);
					if (i >= 0) $.fn.appear.checks.splice(i, 1);
				}

				//trigger the original fn
				fn.apply(this, arguments);
			};

			//bind the modified fn to the element
			if (settings.one) t.one('appear', modifiedFn);
			else t.bind('appear', modifiedFn);

			//check whenever the window scrolls
			w.scroll(check);

			//check whenever the dom changes
			$.fn.appear.checks.push(check);

			//check now
			(check)();
		});
	};

	// Keep a queue of appearance checks
	$.Extend($.fn.appear, {

		checks: [],
		timeout: null,

		//process the queue
		checkAll: function () {
			var length = $.fn.appear.checks.length;
			if (length > 0)
				while (length--)($.fn.appear.checks[length])();
		},

		//check the queue asynchronously
		run: function () {
			if ($.fn.appear.timeout) clearTimeout($.fn.appear.timeout);
			$.fn.appear.timeout = setTimeout($.fn.appear.checkAll, 20);
		}
	});

	// Run checks when these methods are called
	$.each(['append', 'prepend', 'after', 'before',
		'attr', 'removeAttr', 'addClass', 'removeClass',
		'toggleClass', 'remove', 'css', 'show', 'hide'
	], function (i, n) {
		var old = $.fn[n];

		if (old) {
			$.fn[n] = function () {
				var r = old.apply(this, arguments);

				$.fn.appear.run();

				return r;
			}
		}
	});

	//---

	$.fn.swipe = function (options) {
		if (!this) return false;
		var touchable = 'ontouchstart' in window,
			START = 'start',
			MOVE = 'move',
			END = 'end',
			CANCEL = 'cancel',
			LEFT = 'left',
			RIGHT = 'right',
			UP = 'up',
			DOWN = 'down',
			phase = START;

		return this.each(function () {
			var self = this,
				$self = $(this),
				start = {
					x: 0,
					y: 0
				},
				end = {
					x: 0,
					y: 0
				},
				delta = {
					x: 0,
					y: 0
				},
				distance = {
					x: 0,
					y: 0
				},
				direction = undefined,
				touches = 0;

			function validate(event) {
				var evt = touchable ? event.touches[0] : event;
				distance.x = evt.pageX - start.x;
				distance.y = evt.pageY - start.y;
				delta.x = evt.pageX - end.x;
				delta.y = evt.pageY - end.y;
				end.x = evt.pageX;
				end.y = evt.pageY;

				var angle = Math.round(Math.atan2(end.y - start.y, start.x - end.x) * 180 / Math.PI);
				if (angle < 0) angle = 360 - Math.abs(angle);
				if ((angle <= 360) && (angle >= 315) || (angle <= 45) && (angle >= 0)) {
					direction = LEFT;
				} else if ((angle <= 225) && (angle >= 135)) {
					direction = RIGHT;
				} else if ((angle < 135) && (angle > 45)) {
					direction = DOWN;
				} else {
					direction = UP;
				}
			}

			function swipeStart(event) {
				var evt = touchable ? event.touches[0] : event;
				if (touchable) touches = event.touches.length;
				phase = START;
				start.x = evt.pageX;
				start.y = evt.pageY;
				validate(event);

				self.addEventListener((touchable) ? 'touchmove' : 'mousemove', swipeMove, false);
				self.addEventListener((touchable) ? 'touchend' : 'mouseup', swipeEnd, false);

				if (options.status) options.status.call($self, event, phase, direction, distance);
			}

			function swipeMove(event) {
				if (phase === END) return;
				phase = MOVE;
				validate(event);
				//todo implement page scrolling
				if (direction === LEFT || direction === RIGHT)
					event.preventDefault();
				if (options.status) options.status.call($self, event, phase, direction, distance);
			}

			function swipeEnd(event) {
				phase = END;
				if (options.status) options.status.call($self, event, phase, direction, distance);
			}

			function swipeCancel(event) {
				phase = CANCEL;
				if (options.status) options.status.call($self, event, phase);
				start = {
					x: 0,
					y: 0
				}, end = {
					x: 0,
					y: 0
				}, delta = {
					x: 0,
					y: 0
				}, distance = {
					x: 0,
					y: 0
				}, direction = undefined, touches = 0;
			}

			self.addEventListener((touchable) ? 'touchstart' : 'mousedown', swipeStart, false);
			self.addEventListener('touchcancel', swipeCancel, false);
		});
	};

	//---

	$.fn.visible = function (visibility) {
		// return this.each(function (index, item) {
		return this.each(function () {
			var yEl = $(this);
			yEl.css('visibility', visibility ? '' : 'hidden');
		});
	};

	//---

	$.fn.resizeText = function (value) {
		// return this.each(function (index, item) {
		return this.each(function () {
			var yEl = $(this);

			var current = yEl.html();

			//don't bother if the text we're setting is the same as the current contents
			if (value == current) return;

			//set the content so we get something for the height
			yEl.html('&nbsp;');

			//remove any previous font-size from style attribute
			yEl.css('font-size', '');

			var w = yEl.width();
			var h = yEl.height();

			var fontStr = yEl.css('font-size');
			var fontNumStr = fontStr.replace(/[a-z ]/gi, '');
			var fontSize = parseFloat(fontNumStr);

			var fontSuffix = fontStr.split(fontNumStr).join('');

			// console.log(['w', w, 'h', h, 'fontStr', fontStr, 'fontNumStr', fontNumStr, 'fontSize', fontSize, 'fontSuffix', fontSuffix].join(':'));

			yEl.html(value);

			do {
				yEl.css('font-size', fontSize + fontSuffix);
				fontSize -= .5;
			} while ((yEl.width() > w || yEl.height() > h) && fontSize > 0);
		});
	};

	//---

	// $.Extend($.fn, {
	$.Extend({
		Extra: {
			/*
			 * @method
			 * @id Extra.isEmpty
			 * @alias Yaex.fn.Extra.isEmpty
			 * @memberOf Yaex.fn.Extra
			 * @param {Object} Object to test
			 * @return boolean
			 */
			isEmpty: function (val) {
				var empty = [null, '', 0, false, undefined],
					isEmpty = false;
				if (Array.isArray(val) && val.length === 0) {
					isEmpty = true;
				} else if (Yaex.fn.Extra.isFunction(val) && Yaex.fn.Extra.isFunctionEmpty(val)) {
					isEmpty = true;
				} else if (Yaex.fn.Extra.isObject(val) && Yaex.fn.Extra.isObjectEmpty(val)) {
					isEmpty = true;
				} else if (Yaex.fn.Extra.type(val) === 'number' && isNaN(val)) {
					isEmpty = (val === Number.NEGATIVE_INFINITY || val === Number.POSITIVE_INFINITY) ? false : true;
				} else {
					for (var i = empty.length; i > 0; i--) {
						if (empty[i - 1] === val) {
							isEmpty = true;
							break;
						}
					}
				}
				return isEmpty;
			},

			/*
			 * @method
			 * @id Extra.isFunctionEmpty
			 * @alias Yaex.fn.Extra.isFunctionEmpty
			 * @memberOf Yaex.fn.Extra
			 * @param {Object} obj to test
			 * @return boolean
			 */
			isFunctionEmpty: function (obj) {
				// only get RegExs when needed
				var arr = Yaex.fn.Extra.getGetFunctionBodyRegEx().exec(obj);
				if (arr && arr.length > 1 && arr[1] !== undefined) {
					var body = arr[1].replace(Yaex.fn.Extra.getRemoveCodeCommentsRegEx(), '');
					if (body && Yaex.fn.Extra.getContainsWordCharRegEx().test(body)) {
						return false;
					}
				}
				return true;
			},

			/*
			 * @method
			 * @id Extra.isFunction
			 * @alias Yaex.fn.Extra.isFunction
			 * @memberOf Yaex.fn.Extra
			 * @param {Object} obj to test
			 * @return boolean
			 */
			isFunction: function (obj) {
				if (Yaex.fn.Extra.type(obj) === 'function') {
					return true;
				}
				return false;
			},

			/*
			 * @method
			 * @id Extra.isObjectEmpty
			 * @alias Yaex.fn.Extra.isObjectEmpty
			 * @memberOf Yaex.fn.Extra
			 * @param {Object} obj to test
			 * @return boolean
			 */
			isObjectEmpty: function (obj) {
				for (var name in obj) {
					if (obj.hasOwnProperty(name)) {
						return false;
					}
				}
				return true;
			},

			/*
			 * @method
			 * @id Extra.isObject
			 * @alias Yaex.fn.Extra.isObject
			 * @memberOf Yaex.fn.Extra
			 * @param {Object} obj to test if it's a basic simple object,
			 * @return boolean
			 */
			isObject: function (obj) {
				var key;
				if (!obj || typeof obj !== 'object' || obj.getElementById || obj.getComputedStyle) {
					return false;
				}
				if (obj.constructor) {
					return true;
				}
				for (key in obj) {}
				return key === undefined || Yaex.fn.Extra.hasOwnProperty.call(obj, key) || false;
			},

			/*
			 * @method
			 * @id Extra.isArray
			 * @alias Yaex.fn.Extra.isArray
			 * @memberOf Yaex.fn.Extra
			 * @param {Object} obj to test
			 * @return boolean
			 */
			isArray: function (obj) {
				return Array.isArray(obj);
			},

			/*
			 * @method
			 * @id Extra.isNull
			 * @alias Yaex.fn.Extra.isNull
			 * @memberOf Yaex.fn.Extra
			 * @param {Object} obj to test
			 * @return boolean
			 */
			isNull: function (obj) {
				return Yaex.fn.Extra.type(obj) === Yaex.fn.Extra.type(null);
			},

			/*
			 * @method
			 * @id Extra.isUndefined
			 * @alias Yaex.fn.Extra.isUndefined
			 * @memberOf Yaex.fn.Extra
			 * @param {Object} obj to test
			 * @return boolean
			 */
			isUndefined: function (obj) {
				return Yaex.fn.Extra.type(obj) === Yaex.fn.Extra.type();
			},

			/*
			 * @method
			 * @id Extra.type
			 * @alias Yaex.fn.Extra.type
			 * @memberOf Yaex.fn.Extra
			 * @param {Object} obj to test, add null to usual object types
			 * @return string
			 */
			type: function (obj) {
				var t;
				if (obj == null) {
					t = String(obj);
					/*} else if (({})[ Yaex.fn.Extra.toString.call(obj) ]){
					t = Yaex.fn.Extra.toString.call(obj)*/
				} else {
					t = typeof obj;
				}
				return t;
			},

			/*
			 * @method
			 * @id Extra.getContainsWordCharRegEx
			 * @alias Yaex.fn.Extra.getContainsWordCharRegEx
			 * @memberOf Yaex.fn.Extra
			 * @return RegEx
			 */
			getContainsWordCharRegEx: function () {
				if (!Yaex.fn.Extra.reContainsWordChar) {
					Yaex.fn.Extra.reContainsWordChar = new RegExp('\\S+', 'g');
				}
				return Yaex.fn.Extra.reContainsWordChar;
			},

			/*
			 * @method
			 * @id Extra.getGetFunctionBodyRegEx
			 * @alias Yaex.fn.Extra.getGetFunctionBodyRegEx
			 * @memberOf Yaex.fn.Extra
			 * @return RegEx
			 */
			getGetFunctionBodyRegEx: function () {
				if (!Yaex.fn.Extra.reGetFunctionBody) {
					Yaex.fn.Extra.reGetFunctionBody = new RegExp('{((.|\\s)*)}', 'm');
				}
				return Yaex.fn.Extra.reGetFunctionBody;
			},

			/*
			 * @method
			 * @id Extra.getRemoveCodeCommentsRegEx
			 * @alias Yaex.fn.Extra.getRemoveCodeCommentsRegEx
			 * @memberOf Yaex.fn.Extra
			 * @return RegEx
			 */
			getRemoveCodeCommentsRegEx: function () {
				if (!Yaex.fn.Extra.reRemoveCodeComments) {
					Yaex.fn.Extra.reRemoveCodeComments = new RegExp("(\\/\\*[\\w\\'\\s\\r\\n\\*]*\\*\\/)|(\\/\\/[\\w\\s\\']*)", 'g');
				}
				return Yaex.fn.Extra.reRemoveCodeComments;
			},

			hasOwnProperty: ({}).hasOwnProperty,
			toString: ({}).toString,
			reContainsWordChar: null,
			reGetFunctionBody: null,
			reRemoveCodeComments: null
		}
	});

	//---

	/** 
	 * If no touch events are available map touch events to corresponding mouse events.
	 **/
	// try {
	// 	document.createEvent('TouchEvent');
	// } catch (e) {
	// 	var _fakeCallbacks = {}, // Store the faked callbacks so that they can be unbound
	// 		eventmap = {
	// 			'touchstart': 'mousedown',
	// 			'touchend': 'mouseup',
	// 			'touchmove': 'mousemove'
	// 		};

	// 	function touch2mouse(type, callback, context) {
	// 		if ((typeof type) == 'object') {
	// 			// Assume we have been called with an event object.
	// 			// Do not map the event.
	// 			// TODO: Should this still try and map the event.
	// 			return [type]
	// 		}

	// 		// remove the extra part after the .
	// 		var p = type.match(/([^.]*)(\..*|$)/),
	// 			// orig = p[0],
	// 			type = p[1],
	// 			extra = p[2],
	// 			mappedevent = eventmap[type];

	// 		result = [(mappedevent || type) + extra]
	// 		if (arguments.length > 1) {
	// 			if (mappedevent) {
	// 				callback = fakeTouches(type, callback, context);
	// 			}

	// 			result.push(callback);
	// 		}


	// 		return result;
	// 	}

	// 	function fakeTouches(type, callback, context) {
	// 		// wrap the callback with a function that adds a fake 
	// 		// touches property to the event.

	// 		return _fakeCallbacks[callback] = function (event) {
	// 			if (event.button) {
	// 				return false;
	// 			}
	// 			event.touches = [{
	// 				length: 1, // 1 mouse (finger)
	// 				clientX: event.clientX,
	// 				clientY: event.clienty,
	// 				pageX: event.pageX,
	// 				pageY: event.pageY,
	// 				screenX: event.screenX,
	// 				screenY: event.screenY,
	// 				target: event.target
	// 			}]

	// 			event.touchtype = type;

	// 			return callback.apply(context, [event]);
	// 		}
	// 	}

	// 	var _bind = $.fn.bind;

	// 	$.fn.bind = function (event, callback) {
	// 		return _bind.apply(this, touch2mouse(event, callback, this));
	// 	};

	// 	var _unbind = $.fn.unbind;

	// 	$.fn.unbind = function (event, callback) {
	// 		if (!event) {
	// 			_unbind.apply(this);
	// 			return;
	// 		}
	// 		var result = _unbind.apply(this, touch2mouse(event).concat([_fakeCallbacks[callback] || callback]));
	// 		delete(_fakeCallbacks[callback]);
	// 		return result;
	// 	};

	// 	var _one = $.fn.one;

	// 	$.fn.one = function (event, callback) {
	// 		return _one.apply(this, touch2mouse(event, callback, this));
	// 	};

	// 	var _delegate = $.fn.delegate;

	// 	$.fn.delegate = function (selector, event, callback) {
	// 		return _delegate.apply(this, [selector].concat(touch2mouse(event, callback, this)));
	// 	};

	// 	var _undelegate = $.fn.undelegate;

	// 	$.fn.undelegate = function (selector, event, callback) {
	// 		var result = _undelegate.apply(this, [selector].concat(touch2mouse(event), [_fakeCallbacks[callback] || callback]));
	// 		delete(_fakeCallbacks[callback]);
	// 		return result;
	// 	};

	// 	var _live = $.fn.live;

	// 	$.fn.live = function (event, callback) {
	// 		return _live.apply(this, touch2mouse(event, callback, this));
	// 	};

	// 	var _die = $.fn.die;

	// 	$.fn.die = function (event, callback) {
	// 		var result = _die.apply(this, touch2mouse(event).concat([_fakeCallbacks[callback] || callback]));
	// 		delete(_fakeCallbacks[callback]);
	// 		return result;
	// 	};

	// 	var _trigger = $.fn.trigger;

	// 	$.fn.trigger = function (event, data) {
	// 		return _trigger.apply(this, touch2mouse(event).concat([data]));
	// 	};

	// 	var _triggerHandler = $.fn.triggerHandler;

	// 	$.fn.triggerHandler = function (event, data) {
	// 		return _triggerHandler.apply(this, touch2mouse(event).concat([data]));
	// 	};
	// };

	//---

	window.cordova = document.URL.indexOf('http://') === -1 && document.URL.indexOf('https://') === -1;

	if (window.cordova === false) {
		$(function () {
			$(document).trigger('deviceready');
		});
	}

	//---

})(Yaex)
