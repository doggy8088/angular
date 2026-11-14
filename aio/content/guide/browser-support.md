# 瀏覽器支援

Angular 支援大多數的最新瀏覽器。這包括以下特定版本：

<table>

  <tr>

<th>
      瀏覽器
</th>

<th>
      支援的版本
</th>

  </tr>

  <tr>

    <td>
      Chrome
    </td>

    <td>
      最新版
    </td>
  </tr>

  <tr>

    <td>
      Firefox
    </td>

    <td>
      最新版
    </td>
  </tr>

  <tr>

    <td>
      Edge
    </td>

    <td>
      最近 2 個主要版本
    </td>
  </tr>
  <tr> 
    <td>
      IE
    </td>
    <td>
      11<br>10<br>9
    </td>
  </tr>
 <tr>
   <tr> 
    <td>
      IE Mobile
    </td>
    <td>
      11
    </td>
  </tr>
 <tr>
    <td>
      Safari
    </td>

    <td>
      最近 2 個主要版本
    </td>
  </tr>
  <tr>
    <td>
      iOS
    </td>

    <td>
      最近 2 個主要版本
    </td>
  </tr>
  <tr>
    <td>
      Android
    </td>

    <td>
      Nougat (7.0)<br>Marshmallow (6.0)<br>Lollipop (5.0, 5.1)<br>KitKat (4.4)
    </td>
  </tr> 

</table>

<div class="alert is-helpful">

Angular 的持續整合流程會針對每一份 pull request，在所有這些瀏覽器上執行框架的單元測試，
使用 <a href="https://saucelabs.com/">SauceLabs</a> 與
<a href="https://www.browserstack.com">Browserstack</a>。

</div>

## Polyfills

Angular 建立在 Web 平台的最新標準之上。
要支援如此廣泛的瀏覽器是很有挑戰性的，因為它們並不支援現代瀏覽器的所有功能。

你可以為必須支援的瀏覽器載入 polyfill 指令稿（「polyfills」）來彌補這一點。
[下表](#polyfill-libs)列出了你可能需要的大部分 polyfill。

<div class="alert is-important">

建議的 polyfill 是能執行完整 Angular 應用程式的那些。
你可能需要額外的 polyfill，才能支援此清單未涵蓋的功能。
請注意，polyfill 無法神奇地把老舊、緩慢的瀏覽器變成現代、快速的瀏覽器。

</div>

## 啟用 polyfills

[Angular CLI](https://github.com/angular/angular-cli/wiki) 使用者可透過 CLI 隨專案建立的 `src/polyfills.ts` 檔案
來啟用 polyfills。

這個檔案以 JavaScript `import` 陳述式的形式，納入必需的以及許多可選的 polyfill。

_必需的_ polyfill 的 npm 套件（例如 `zone.js`），在你建立專案時已經自動為你安裝，其對應的 `import` 陳述式也已就緒。你可能不會去動這些。

但如果你需要可選的 polyfill，你就必須安裝它的 npm 套件。
例如，[如果你需要 web animations polyfill](http://caniuse.com/#feat=web-animation)，你可以用下列指令透過 `npm` 安裝它（或使用 `yarn` 的等效指令）：

<code-example language="sh" class="code-shell">
  # note that the web-animations-js polyfill is only here as an example
  # it isn't a strict requirement of Angular anymore (more below)
  npm install --save web-animations-js
</code-example>

接著開啟 `polyfills.ts` 檔案，並取消對應 `import` 陳述式的註解，如下例所示：

<code-example title="src/polyfills.ts">
  /**
  * Required to support Web Animations `@angular/platform-browser/animations`.
  * Needed for: All but Chrome, Firefox and Opera. http://caniuse.com/#feat=web-animation
  **/
  import 'web-animations-js';  // Run `npm install --save web-animations-js`.
</code-example>

如果你在 `polyfills.ts` 中找不到想要的 polyfill，
請依照相同的模式自行加入：

1. 安裝 npm 套件
1. 在 `polyfills.ts` 中 `import` 該檔案

<div class="alert is-helpful">

非 CLI 使用者請參閱[下方](#non-cli)的說明。
</div>

{@a polyfill-libs}

### 必需的 polyfills
這些是每個支援的瀏覽器上執行 Angular 應用程式所需的 polyfill：

<table>

  <tr style="vertical-align: top">

    <th>
      瀏覽器（桌面與行動）
    </th>

    <th>
      所需的 Polyfill
    </th>

  </tr>

  <tr style="vertical-align: top">

    <td>
      Chrome, Firefox, Edge, Safari 9+
    </td>

    <td>

      [ES7/reflect](guide/browser-support#core-es7-reflect)（僅限 JIT）

    </td>

  </tr>

  <tr style="vertical-align: top">

    <td>
      Safari 7 & 8, IE10 & 11, Android 4.1+
    </td>

    <td>

      [ES6](guide/browser-support#core-es6)

    </td>

  </tr>

  <tr style="vertical-align: top">

    <td>
      IE9
    </td>

    <td>

      [ES6<br>classList](guide/browser-support#classlist)

    </td>

  </tr>

</table>

### 需要 polyfill 的可選瀏覽器功能

Angular 的某些功能可能需要額外的 polyfill。

例如，動畫程式庫依賴標準的 web animation API，而該 API 目前僅在 Chrome 與 Firefox 中提供。
（請注意，Angular 中 web-animations-js 的依賴僅在使用 `AnimationBuilder` 時才需要。）

以下是可能需要額外 polyfill 的功能：

<table>

  <tr style="vertical-align: top">

    <th>
      功能
    </th>

    <th>
      Polyfill
    </th>

    <th style="width: 50%">
       瀏覽器（桌面與行動）
    </th>

  </tr>

  <tr style="vertical-align: top">

    <td>

      [JIT 編譯](guide/aot-compiler)。

      需要用來反射中繼資料。
    </td>

    <td>

      [ES7/reflect](guide/browser-support#core-es7-reflect)

    </td>

    <td>
      所有目前的瀏覽器。預設啟用。
      如果總是使用 AOT 且只用 Angular 裝飾器，可以移除。
    </td>

  </tr>

  <tr style="vertical-align: top">

    <td>

      [動畫](guide/animations)
      <br>僅限在應用程式中使用 `Animation Builder` 時--標準
      動畫支援在 Angular 中不需要任何 polyfill（自 NG6 起）。

    </td>

    <td>

      [Web Animations](guide/browser-support#web-animations)

    </td>

    <td>
      <p>如果使用 AnimationBuilder，這個 polyfill 將為 IE/Edge 與 Safari 啟用 scrubbing
      支援（Chrome 與 Firefox 原生支援此功能）。</p>
    </td>

  </tr>

  <tr style="vertical-align: top">

    <td>

    如果你使用下列已棄用的 i18n 管道：

     [date](api/common/DeprecatedDatePipe), 

     [currency](api/common/DeprecatedCurrencyPipe),

     [decimal](api/common/DeprecatedDecimalPipe), 

     [percent](api/common/DeprecatedPercentPipe)

    </td>

    <td>

      [Intl API](guide/browser-support#intl)

    </td>

    <td>
      Chrome、Firefox、Edge、IE11 與 Safari 10 除外的所有瀏覽器
    </td>

  </tr>

  <tr style="vertical-align: top">

    <td>

       [NgClass](api/common/NgClass) 

       在 SVG 元素上
    </td>

    <td>

      [classList](guide/browser-support#classlist)

    </td>

    <td>
      IE10, IE11
    </td>

  </tr>

  <tr style="vertical-align: top">

    <td>

      [Http](guide/http) 

      傳送與接收二進位資料時
    </td>

    <td>

      [Typed&nbsp;Array](guide/browser-support#typedarray)<br>

      [Blob](guide/browser-support#blob)<br>

      [FormData](guide/browser-support#formdata)

    </td>

    <td>
      IE 9
    </td>

  </tr>

</table>

### 建議的 polyfills ##
下列 polyfill 用於測試框架本身。它們是應用程式很好的起點。

<table>

  <tr>

    <th>
      Polyfill
    </th>

    <th>
      授權
    </th>

    <th>
      大小*
    </th>

  </tr>

  <tr>

    <td>

      <a id='core-es7-reflect' href="https://github.com/zloirock/core-js/blob/master/es7/reflect.js">ES7/reflect</a>

    </td>

    <td>
      MIT
    </td>

    <td>
      0.5KB
    </td>

  </tr>

  <tr>

    <td>

      <a id='core-es6' href="https://github.com/zloirock/core-js">ES6</a>

    </td>

    <td>
      MIT
    </td>

    <td>
      27.4KB
    </td>

  </tr>

  <tr>

    <td>

      <a id='classlist' href="https://github.com/eligrey/classList.js">classList</a>

    </td>

    <td>
      公共領域
    </td>

    <td>
      1KB
    </td>

  </tr>

  <tr>

    <td>

      <a id='intl' href="https://github.com/andyearnshaw/Intl.js">Intl</a>

    </td>

    <td>
      MIT / Unicode 授權
    </td>

    <td>
      13.5KB
    </td>

  </tr>

  <tr>

    <td>

       <a id='web-animations' href="https://github.com/web-animations/web-animations-js">Web Animations</a>

    </td>

    <td>
      Apache
    </td>

    <td>
      14.8KB
    </td>

  </tr>

  <tr>

    <td>

      <a id='typedarray' href="https://github.com/inexorabletash/polyfill/blob/master/typedarray.js">Typed Array</a>

    </td>

    <td>
      MIT
    </td>

    <td>
      4KB
    </td>

  </tr>

  <tr>

    <td>

       <a id='blob' href="https://github.com/eligrey/Blob.js">Blob</a>

    </td>

    <td>
      MIT
    </td>

    <td>
      1.3KB
    </td>

  </tr>

  <tr>

    <td>

       <a id='formdata' href="https://github.com/francois2metz/html5-formdata">FormData</a>

    </td>

    <td>
      MIT
    </td>

    <td>
      0.4KB
    </td>

  </tr>

</table>

\* 數字為經縮小與 gzip 壓縮後的程式碼，
使用 <a href="http://closure-compiler.appspot.com/home">closure compiler</a> 計算。

{@a non-cli}
## 非 CLI 使用者的 polyfills

如果你不是使用 CLI，你應該將 polyfill 指令稿直接加入主機網頁（`index.html`），例如像這樣。

<code-example title="src/index.html">
  &lt;!-- pre-zone polyfills -->
  &lt;script src="node_modules/core-js/client/shim.min.js">&lt;/script>
  &lt;script src="node_modules/web-animations-js/web-animations.min.js">&lt;/script>
  &lt;script>
    /**
     * you can configure some zone flags which can disable zone interception for some
     * asynchronous activities to improve startup performance - use these options only
     * if you know what you are doing as it could result in hard to trace down bugs..
     */
    // __Zone_disable_requestAnimationFrame = true; // disable patch requestAnimationFrame
    // __Zone_disable_on_property = true; // disable patch onProperty such as onclick
    // __zone_symbol__BLACK_LISTED_EVENTS = ['scroll', 'mousemove']; // disable patch specified eventNames

    /*
     * in IE/Edge developer tools, the addEventListener will also be wrapped by zone.js
     * with the following flag, it will bypass `zone.js` patch for IE/Edge
     */
    // __Zone_enable_cross_context_check = true;
  &lt;/script>
  &lt;!-- zone.js required by Angular -->
  &lt;script src="node_modules/zone.js/dist/zone.js">&lt;/script>

  &lt;!-- application polyfills -->
</code-example>
