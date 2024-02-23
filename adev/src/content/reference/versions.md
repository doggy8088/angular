# 版本相容性

以下表格說明每個版本的 Angular 所需的 Node.js、TypeScript 和 RxJS 版本。

## 積極支援的版本

下表涵蓋 [Angular 版本，可獲得主動支援](reference/releases#actively-supported-versions)。

| Angular            | Node.js                              | TypeScript     | RxJS               |
| ------------------ | ------------------------------------ | -------------- | ------------------ |
| 17.1.0             | ^18.13.0 \|\| ^20.9.0                | >=5.2.0 <5.4.0 | ^6.5.3 \|\| ^7.4.0 |
| 17.0.x             | ^18.13.0 \|\| ^20.9.0                | >=5.2.0 <5.3.0 | ^6.5.3 \|\| ^7.4.0 |
| 16.1.x \|\| 16.2.x | ^16.14.0 \|\| ^18.10.0               | >=4.9.3 <5.2.0 | ^6.5.3 \|\| ^7.4.0 |
| 16.0.x             | ^16.14.0 \|\| ^18.10.0               | >=4.9.3 <5.1.0 | ^6.5.3 \|\| ^7.4.0 |
| 15.1.x \|\| 15.2.x | ^14.20.0 \|\| ^16.13.0 \|\| ^18.10.0 | >=4.8.2 <5.0.0 | ^6.5.3 \|\| ^7.4.0 |
| 15.0.x             | ^14.20.0 \|\| ^16.13.0 \|\| ^18.10.0 | ~4.8.2         | ^6.5.3 \|\| ^7.4.0 |

## 不支援的 Angular 版本

此表格包含不再提供長期支援 (LTS) 的 Angular 版本。此資訊在每個版本停止提供 LTS 時為正確資訊，且不提供任何進一步保證。將在此處列出以供參考。

| Angular            | Node.js                              | TypeScript     | RxJS               |
| ------------------ | ------------------------------------ | -------------- | ------------------ |
| 14.2.x \|\| 14.3.x | ^14.15.0 \|\| ^16.10.0               | >=4.6.2 <4.9.0 | ^6.5.3 \|\| ^7.4.0 |
| 14.0.x \|\| 14.1.x | ^14.15.0 \|\| ^16.10.0               | >=4.6.2 <4.8.0 | ^6.5.3 \|\| ^7.4.0 |
| 13.3.x             | ^12.20.0 \|\| ^14.15.0 \|\| ^16.10.0 | >=4.4.3 <4.7.0 | ^6.5.3 \|\| ^7.4.0 |
| 13.1.x \|\| 13.2.x | ^12.20.0 \|\| ^14.15.0 \|\| ^16.10.0 | >=4.4.3 <4.6.0 | ^6.5.3 \|\| ^7.4.0 |
| 13.0.x             | ^12.20.0 \|\| ^14.15.0 \|\| ^16.10.0 | ~4.4.3         | ^6.5.3 \|\| ^7.4.0 |
| 12.2.x             | ^12.14.0 \|\| ^14.15.0               | >=4.2.3 <4.4.0 | ^6.5.3 \|\| ^7.0.0 |
| 12.1.x             | ^12.14.0 \|\| ^14.15.0               | >=4.2.3 <4.4.0 | ^6.5.3             |
| 12.0.x             | ^12.14.0 \|\| ^14.15.0               | ~4.2.3         | ^6.5.3             |
| 11.2.x             | ^10.13.0 \|\| ^12.11.0               | >=4.0.0 <4.2.0 | ^6.5.3             |
| 11.1.x             | ^10.13.0 \|\| ^12.11.0               | >=4.0.0 <4.2.0 | ^6.5.3             |
| 11.0.x             | ^10.13.0 \|\| ^12.11.0               | ~4.0.0         | ^6.5.3             |
| 10.2.x             | ^10.13.0 \|\| ^12.11.0               | >=3.9.0 <4.1.0 | ^6.5.3             |
| 10.1.x             | ^10.13.0 \|\| ^12.11.0               | >=3.9.0 <4.1.0 | ^6.5.3             |
| 10.0.x             | ^10.13.0 \|\| ^12.11.0               | ~3.9.0         | ^6.5.3             |
| 9.1.x              | ^10.13.0 \|\| ^12.11.0               | >=3.6.0 <3.9.0 | ^6.5.3             |
| 9.0.x              | ^10.13.0 \|\| ^12.11.0               | >=3.6.0 <3.8.0 | ^6.5.3             |

### v9 之前

在 Angular v9 之前，Angular 和 Angular CLI 版本並不同步。

| Angular                     | Angular CLI                 | Node.js             | TypeScript     | RxJS   |
| --------------------------- | --------------------------- | ------------------- | -------------- | ------ |
| 8.2.x                       | 8.2.x \|\| 8.3.x            | ^10.9.0             | >=3.4.2 <3.6.0 | ^6.4.0 |
| 8.0.x \|\| 8.1.x            | 8.0.x \|\| 8.1.x            | ^10.9.0             | ~3.4.2         | ^6.4.0 |
| 7.2.x                       | 7.2.x \|\| 7.3.x            | ^8.9.0 \|\| ^10.9.0 | >=3.1.3 <3.3.0 | ^6.0.0 |
| 7.0.x \|\| 7.1.x            | 7.0.x \|\| 7.1.x            | ^8.9.0 \|\| ^10.9.0 | ~3.1.3         | ^6.0.0 |
| 6.1.x                       | 6.1.x \|\| 6.2.x            | ^8.9.0              | >=2.7.2 <3.0.0 | ^6.0.0 |
| 6.0.x                       | 6.0.x                       | ^8.9.0              | ~2.7.2         | ^6.0.0 |
| 5.2.x                       | 1.6.x \|\| 1.7.x            | ^6.9.0 \|\| ^8.9.0  | >=2.4.2 <2.7.0 | ^5.5.0 |
| 5.0.x \|\| 5.1.x            | 1.5.x                       | ^6.9.0 \|\| ^8.9.0  | ~2.4.2         | ^5.5.0 |
| 4.2.x \|\| 4.3.x \|\| 4.4.x | 1.4.x                       | ^6.9.0 \|\| ^8.9.0  | >=2.1.6 <2.5.0 | ^5.0.1 |
| 4.2.x \|\| 4.3.x \|\| 4.4.x | 1.3.x                       | ^6.9.0              | >=2.1.6 <2.5.0 | ^5.0.1 |
| 4.0.x \|\| 4.1.x            | 1.0.x \|\| 1.1.x \|\| 1.2.x | ^6.9.0              | >=2.1.6 <2.4.0 | ^5.0.1 |
| 2.x                         | -                           | ^6.9.0              | >=1.8.0 <2.2.0 | ^5.0.1 |

## 瀏覽器支援

Angular 支援大多數最新的瀏覽器。
其中包含以下特定版本：

| 瀏覽器 | 支援版本                                      |
| :------ | :-------------------------------------------- |
| Chrome  | 最近兩個版本                                  |
| Firefox | 最新版本和延伸支援版本 \(ESR\)             |
| Edge    | 最近兩個主要版本                               |
| Safari  | 最近兩個主要版本                               |
| iOS     | 最近兩個主要版本                               |
| Android | 最近兩個主要版本                               |

HELPFUL: Angular 的持續整合程序會在所有這些瀏覽器上針對每個拉取請求執行架構的單元測試，並使用 [Sauce Labs](https://saucelabs.com)。

## Polyfills

Angular 建構於網路平台的最新標準上。
鎖定如此廣泛的瀏覽器種類是個挑戰，因為它們並不支援現代瀏覽器的所有功能。
您可以透過載入您必須支援的瀏覽器的 polyfill 腳本（「polyfills」）來彌補。
請參閱下方關於如何將 polyfills 納入專案的說明。

重要事項：建議的 polyfill 是用來執行完整的 Angular 應用程式。
您可能需要額外的 polyfill 來支援此清單中未涵蓋的功能。

HELPFUL: Polyfills 無法神奇地將舊的、慢的瀏覽器變成新的、快的瀏覽器。

## 使用 CLI 專案啟用 polyfill

[Angular CLI](tools/cli) 提供對 polyfill 的支援。
如果您沒有使用 CLI 來建立專案，請參閱 [非 CLI 使用者的 Polyfill 說明](#polyfills-for-non-cli-users)。

[瀏覽器和測試建構器](tools/cli/cli-builder) 的 `polyfills` 選項可以是檔案的完整路徑 \(範例：`src/polyfills.ts`\) 或相對於目前的工作區或模組指定符 \(範例：`zone.js`\)。

如果您建立 TypeScript 檔案，請務必將其包含在 `tsconfig` 檔案的 `files` 屬性中。

<docs-code language="json">
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    ...
  },
  "files": [
    "src/main.ts",
    "src/polyfills.ts"
  ]
  ...
}
</docs-code>

## 非 CLI 使用者的 Polyfill

如果您沒有使用 CLI，請將您的 polyfill 腳本直接新增到主機網頁 \(`index.html`\) 中。

例如：

<docs-code header="src/index.html" language="html">
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
</docs-code>

