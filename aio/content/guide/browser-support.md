# 瀏覽器支援

Angular 支援大多數的最新瀏覽器。
這包括以下特定版本：

| 瀏覽器 | 支援的版本 |
|:---     |:---                |
| Chrome  | 最新版                                      |
| Firefox | 最新版與延伸支援版本（ESR）               |
| Edge    | 最近 2 個主要版本                         |
| Safari  | 最近 2 個主要版本                         |
| iOS     | 最近 2 個主要版本                         |
| Android | 最近 2 個主要版本                         |

<div class="alert is-helpful">

Angular 的持續整合流程會針對每一份 pull request，使用 [Sauce Labs](https://saucelabs.com) 在所有這些瀏覽器上執行框架的單元測試。

</div>

## Polyfill

Angular 建立在 Web 平台的最新標準之上。
要支援如此廣泛的瀏覽器是很有挑戰性的，因為它們並不支援現代瀏覽器的所有功能。
你可以為必須支援的瀏覽器載入 polyfill 指令稿（「polyfills」）來彌補這一點。
如何將 polyfill 加入你的專案，請參閱下方說明。

<div class="alert is-important">

建議的 polyfill 是能執行完整 Angular 應用程式的那些。
你可能需要額外的 polyfill，才能支援此清單未涵蓋的功能。

<div class="alert is-helpful">

**注意：**<br />
Polyfill 無法神奇地把老舊、緩慢的瀏覽器變成現代、快速的瀏覽器。

</div>

</div>

## 在 CLI 專案中啟用 polyfill

[Angular CLI](cli) 提供對 polyfill 的支援。
如果你不是使用 CLI 來建立你的專案，請參閱[非 CLI 使用者的 polyfill 說明](#non-cli)。

當你使用 `ng new` 指令建立專案時，專案資料夾中會建立一個 `src/polyfills.ts` 設定檔。
這個檔案以 JavaScript `import` 陳述式的形式，納入了必需的以及許多可選的 polyfill。

*   必需 polyfill 的 npm 套件\(例如 `zone.js`\)會在你用 `ng new` 建立專案時自動為你安裝，其對應的 `import` 陳述式在 `src/polyfills.ts` 設定檔中已啟用
*   如果你需要*可選的* polyfill，你必須安裝它的 npm 套件，然後在 `src/polyfills.ts` 設定檔中取消註解或建立對應的 import 陳述式


<a id="non-cli"></a>

## 非 CLI 使用者的 polyfill

如果你不是使用 CLI，請將你的 polyfill 指令稿直接加入主機網頁（`index.html`）。

例如：

<code-example header="src/index.html" language="html">

&lt;!-- pre-zone polyfills --&gt;
&lt;script src="node_modules/core-js/client/shim.min.js"&gt;&lt;/script&gt;
&lt;script>
  /**
   &ast; you can configure some zone flags which can disable zone interception for some
   &ast; asynchronous activities to improve startup performance - use these options only
   &ast; if you know what you are doing as it could result in hard to trace down bugs.
   */
  // &lowbar;&lowbar;Zone_disable_requestAnimationFrame = true; // disable patch requestAnimationFrame
  // &lowbar;&lowbar;Zone_disable_on_property = true; // disable patch onProperty such as onclick
  // &lowbar;&lowbar;zone_symbol__UNPATCHED_EVENTS = ['scroll', 'mousemove']; // disable patch specified eventNames
  /*
   &ast; in Edge developer tools, the addEventListener will also be wrapped by zone.js
   &ast; with the following flag, it will bypass `zone.js` patch for Edge.
   */
  // &lowbar;&lowbar;Zone_enable_cross_context_check = true;
&lt;/script&gt;
&lt;!-- zone.js required by Angular --&gt;
&lt;script src="node_modules/zone.js/bundles/zone.umd.js"&gt;&lt;/script&gt;
&lt;!-- application polyfills --&gt;

</code-example>

<!-- links -->

<!-- external links -->

<!-- end links -->

@reviewed 2022-02-28
