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
      11, 10, 9（不支援「相容性檢視」模式）
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
      X (10.0), Pie (9.0), Oreo (8.0), Nougat (7.0)
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

在 Angular CLI 8 版及更高版本中，應用程式使用*差異載入*（differential loading）建置，這是一種 CLI 會建置兩個獨立 bundle 作為已部署應用程式一部分的策略。

* 第一個 bundle 包含現代 ES2015 語法，利用現代瀏覽器的內建支援，附帶較少的 polyfill，bundle 尺寸也較小。

* 第二個 bundle 包含舊 ES5 語法的程式碼，以及所有必需的 polyfill。這會產生較大的 bundle 尺寸，但能支援較舊的瀏覽器。

這種策略讓你可以繼續建置支援多種瀏覽器的 Web 應用程式，但只載入瀏覽器所需的必要程式碼。
關於其運作方式的更多資訊，請參閱[部署指南](guide/deployment)中的 [Differential Loading](guide/deployment#differential-loading)。

## 在 CLI 專案中啟用 polyfills

[Angular CLI](cli) 提供對 polyfills 的支援。
如果你不是使用 CLI 來建立你的專案，請參閱[非 CLI 使用者的 polyfill 說明](#non-cli)。

當你使用 `ng new` 指令建立專案時，專案資料夾中會建立一個 `src/polyfills.ts` 設定檔。
這個檔案以 JavaScript `import` 陳述式的形式，納入了必需的以及許多可選的 polyfill。

* [_必需_ polyfills](#polyfill-libs)（例如 `zone.js`）的 npm 套件會在你用 `ng new` 建立專案時自動為你安裝，其對應的 `import` 陳述式在 `src/polyfills.ts` 設定檔中已啟用。

* 如果你需要*可選的* polyfill，你必須安裝它的 npm 套件，然後在 `src/polyfills.ts` 設定檔中取消註解或建立對應的 import 陳述式。

例如，如果你需要可選的 [web animations polyfill](http://caniuse.com/#feat=web-animation)，你可以用 `npm` 透過下列指令（或 `yarn` 的等效指令）安裝它：

<code-example language="sh" class="code-shell">
  # install the optional web animations polyfill
  npm install --save web-animations-js
</code-example>

接著，你可以在 `src/polyfills.ts` 檔案中加入 import 陳述式。
對於許多 polyfill，你可以直接取消註解檔案中對應的 `import` 陳述式，如下列範例所示。

<code-example header="src/polyfills.ts">
  /**
  * Required to support Web Animations `@angular/platform-browser/animations`.
  * Needed for: All but Chrome, Firefox and Opera. http://caniuse.com/#feat=web-animation
  **/
  import 'web-animations-js';  // Run `npm install --save web-animations-js`.
</code-example>

如果你想要的 polyfill 還不在 `polyfills.ts` 檔案中，請手動加入 `import` 陳述式。

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
      Chrome, Firefox, Edge, <br>
      Safari, Android, IE 10+
    </td>

    <td>

      [ES2015](guide/browser-support#core-es6)

    </td>

  </tr>

  <tr style="vertical-align: top">

    <td>
      IE 9
    </td>

    <td>

      ES2015<br>[classList](guide/browser-support#classlist)

    </td>

  </tr>

</table>

### 需要 polyfill 的可選瀏覽器功能

Angular 的某些功能可能需要額外的 polyfill。

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

      [AnimationBuilder](api/animations/AnimationBuilder).
      （標準動畫支援不需要 polyfill。）

    </td>

    <td>

      [Web Animations](guide/browser-support#web-animations)

    </td>

<td>
      <p>如果使用 AnimationBuilder，可為 IE/Edge 與 Safari 啟用 scrubbing
      支援。（Chrome 與 Firefox 原生支援此功能）。</p>
    </td>

  </tr>

  <tr style="vertical-align: top">

    <td>

       在 SVG 元素上的 [NgClass](api/common/NgClass)
    </td>

    <td>

      [classList](guide/browser-support#classlist)

    </td>

    <td>
      IE 10, IE 11
    </td>

  </tr>

  <tr style="vertical-align: top">

    <td>

      [Http](guide/http) 在傳送與接收二進位資料時
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

  <tr style="vertical-align: top">

    <td>

[Router](guide/router) 在使用
      [以 hash 為基礎的路由](guide/router#location-strategy)時

    <td>

      [ES7/array](guide/browser-support#core-es7-array)

    </td>

    <td>
      IE 11
    </td>

  </tr>

</table>

### 建議的 polyfills

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

      <a id='core-es7-array' href="https://github.com/zloirock/core-js/tree/v2/fn/array">ES7/array</a>

    </td>

    <td>
      MIT
    </td>

    <td>
      0.1KB
    </td>

  </tr>

  <tr>

    <td>

      <a id='core-es6' href="https://github.com/zloirock/core-js">ES2015</a>

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

如果你不是使用 CLI，請將你的 polyfill 指令稿直接加入主機網頁（`index.html`）。

例如：

<code-example header="src/index.html" language="html">
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
    // __zone_symbol__UNPATCHED_EVENTS = ['scroll', 'mousemove']; // disable patch specified eventNames

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
