<img src="media/yaexlogo-01.png">

# Yaex
# Yet another simple Javascript library

Yaex is a JavaScript library for modern browsers with a
simply jQuery/Zepto compatible API. If you use jQuery or Zepto, you already know how to use Yaex.

Yaex is licensed under the terms of the MIT License.

## Building

To use, install Node, then run the following commands in the project root:

~~~ sh
$ npm install -g jake
$ npm install
~~~

Then run the following command to build Yaex:

~~~ sh
$ jake build[1,custom]
~~~

For a custom build, open build/build.html in the browser and follow the instructions.

The resulting files are:

1. `dist/yaex.js`
2. `dist/yaex-src.js`

## Yaex modules

Yaex modules are individual files in the "src/" directory.

<table>
<thead><tr>
  <th>module</th> <th>default</th> <th>description</th>
</tr></thead>
<tbody>
  <tr>
    <th><a href="src/Core.js#files">Core.js</a></th>
    <td>✔</td>
    <td>Core module; contains most methods</td>
  </tr>
  <tr>
    <th><a href="src/Event.js#files">Event.js</a></th>
    <td>✔</td>
    <td>Event handling via <code>on()</code> &amp; <code>off()</code></td>
  </tr>
  <tr>
    <th><a href="src/Detect.js#files">Detect.js</a></th>
    <td>✔</td>
    <td>Provides <code>$.OS</code> and <code>$.Browser</code> information</td>
  </tr>
  <tr>
    <th><a href="src/FX.js#files">FX.js</a></th>
    <td>✔</td>
    <td>The <code>animate()</code> method</td>
  </tr>
  <tr>
    <th><a href="src/FX.Methods.js#files">FX.Methods.js</a></th>
    <td>✔</td>
    <td>
      Animated <code>show</code>, <code>hide</code>, <code>toggle</code>,
      and <code>fade*()</code> methods.
    </td>
  </tr>
  <tr>
    <th><a href="src/Ajax.js#files">Ajax.js</a></th>
    <td>✔</td>
    <td>XMLHttpRequest and JSONP functionality</td>
  </tr>
  <tr>
    <th><a href="src/Form.js#files">Form.js</a></th>
    <td>✔</td>
    <td>Serialize &amp; submit web forms</td>
  </tr>
  <tr>
    <th><a href="src/Assets.js#files">Assets.js</a></th>
    <td></td>
    <td>
      Experimental support for cleaning up iOS memory after removing
      image elements from the DOM.
    </td>
  </tr>
  <tr>
    <th><a href="src/Data.js#files">Data.js</a></th>
    <td></td>
    <td>
      A full-blown <code>data()</code> method, capable of storing arbitrary
      objects in memory.
    </td>
  </tr>
  <tr>
    <th><a href="src/Deferred.js#files">Deferred.js</a></th>
    <td></td>
    <td>
      Provides <code>$.Deferred</code> promises API.
      Depends on the "callbacks" module.
    </td>
  </tr>
  <tr>
    <th><a href="src/Callbacks.js#files">Callbacks.js</a></th>
    <td></td>
    <td>
      Provides <code>$.Callbacks</code> for use in "deferred" module.
    </td>
  </tr>
  <tr>
    <th><a href="src/Selector.js#files">Selector.js</a></th>
    <td></td>
    <td>
      Experimental <a href="http://api.jquery.com/category/selectors/jquery-selector-extensions/">jQuery
      CSS extensions</a> support for functionality such as <code>$('div:first')</code> and
      <code>el.is(':visible')</code>.
    </td>
  </tr>
  <tr>
    <th><a href="src/Touch.js#files">Touch.js</a></th>
    <td></td>
    <td>
      Fires tap– and swipe–related events on touch devices. This works with both
      `touch` (iOS, Android) and `pointer` events (Windows Phone).
    </td>
  </tr>
  <tr>
    <th><a href="src/Gesture.js#files">Gesture.js</a></th>
    <td></td>
    <td>Fires pinch gesture events on touch devices</td>
  </tr>
  <tr>
    <th><a href="src/Stack.js#files">Stack.js</a></th>
    <td></td>
    <td>Provides <code>andSelf</code> &amp; <code>end()</code> chaining methods</td>
  </tr>
  <tr>
    <th><a href="src/IOS.js#files">IOS.js</a></th>
    <td></td>
    <td>
      String.prototype.trim and Array.prototype.reduce methods
      (if they are missing) for compatibility with iOS 3.x.
    </td>
  </tr>
  <tr>
    <th><a href="src/IE.js#files">IE.js</a></th>
    <td></td>
    <td>
      Experimental support for Internet Explorer 10+ on desktop and Windows Phone 8.
      (Some tests are failing. Help us fix this!)
    </td>
  </tr>
</tbody>
</table>