# 瀏覽器支援

Angular 支援大多數的最新瀏覽器。這包括以下特定版本：

<table>

  <tr>

    <th>
      Chrome
    </th>

    <th>
      Firefox
    </th>

    <th>
      Edge
    </th>

    <th>
      IE
    </th>

    <th>
      Safari
    </th>

    <th>
      iOS
    </th>

    <th>
      Android
    </th>

    <th>
      IE Mobile
    </th>

  </tr>

  <tr>

    <td>
      最新版
    </td>

    <td>
      最新版
    </td>

    <td>
      14
    </td>

    <td>
      11
    </td>

    <td>
      10
    </td>

    <td>
      10
    </td>

    <td>
      Nougat (7.0)<br>Marshmallow (6.0)
    </td>

    <td>
      11
    </td>

  </tr>

  <tr>

    <td>

    </td>

    <td>

    </td>

    <td>
      13
    </td>

    <td>
      10
    </td>

    <td>
      9
    </td>

    <td>
      9
    </td>

    <td>
      Lollipop<br>(5.0, 5.1)
    </td>

    <td>

    </td>

  </tr>

  <tr>

    <td>

    </td>

    <td>

    </td>

    <td>

    </td>

    <td>
      9
    </td>

    <td>
      8
    </td>

    <td>
      8
    </td>

    <td>
      KitKat<br>(4.4)
    </td>

    <td>

    </td>

  </tr>

  <tr>

    <td>

    </td>

    <td>

    </td>

    <td>

    </td>

    <td>

    </td>

    <td>
      7
    </td>

    <td>
      7
    </td>

    <td>
      Jelly Bean<br>(4.1, 4.2, 4.3)
    </td>

    <td>

    </td>

  </tr>

</table>

<div class="l-sub-section">

Angular 的持續整合流程會針對每一份 pull request，在所有這些瀏覽器上執行框架的單元測試，
使用 <a href="https://saucelabs.com/">SauceLabs</a> 與
<a href="https://www.browserstack.com">Browserstack</a>。

</div>

## Polyfills #
Angular 建立在 Web 平台的最新標準之上。
要支援如此廣泛的瀏覽器是很有挑戰性的，因為它們並不支援現代瀏覽器的所有功能。

你可以透過在主機網頁（`index.html`）上載入 polyfill 指令稿（「polyfills」）來彌補這一點，
這些指令稿會以 JavaScript 實作缺少的功能。

<code-example path="quickstart/src/index.html" region="polyfills" title="quickstart/src/index.html" linenums="false">

</code-example>

特定瀏覽器可能至少需要一個 polyfill 才能執行_任何_ Angular 應用程式。
你可能需要額外的 polyfill 來支援特定功能。

下表可以幫助你根據目標瀏覽器與所使用的功能，決定要載入哪些 polyfill。

<div class="alert is-important">

建議的 polyfill 是能執行完整 Angular 應用程式的那些。
你可能需要額外的 polyfill，才能支援此清單未涵蓋的功能。
請注意，polyfill 無法神奇地把老舊、緩慢的瀏覽器變成現代、快速的瀏覽器。

</div>

### 必需的 polyfills ##
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
      無
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

### 需要 polyfill 的可選瀏覽器功能 ##
Angular 的某些功能可能需要額外的 polyfill。

例如，動畫程式庫依賴標準的 web animation API，而該 API 目前僅在 Chrome 與 Firefox 中提供。你會需要一個 polyfill，才能在其他瀏覽器中使用動畫。

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

      [動畫](guide/animations)
    </td>

    <td>

      [Web Animations](guide/browser-support#web-animations)
    </td>

    <td>
      Chrome 與 Firefox 以外的所有瀏覽器<br>IE9 不支援
    </td>

  </tr>

  <tr style="vertical-align: top">

    <td>

    [Date](api/common/DatePipe), [currency](api/common/CurrencyPipe), [decimal](api/common/DecimalPipe) 與 [percent](api/common/PercentPipe) 管道
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

       [NgClass](api/common/NgClass) 在 SVG 元素上
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

      [Http](guide/http) 傳送與接收二進位資料時
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
