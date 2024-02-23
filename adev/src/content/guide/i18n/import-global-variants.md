# 匯入 locale 資料的全球變體

如果您使用 `--localize` 選項執行 [`ng build`][AioCliBuild] 指令，[Angular CLI][AioCliMain] 會自動包含地區資料。

<!--todo: 用 docs-code 取代 -->

<docs-code language="shell">

ng build --localize

</docs-code>

HELPFUL: Angular 的初始安裝已包含美國英語的區域資料 (`en-US`)。
當您在 [`ng build`][AioCliBuild] 命令中使用 `--localize` 選項時，[Angular CLI][AioCliMain] 會自動包含區域資料並設定 `LOCALE_ID` 值。

npm 上的 `@angular/common` 套件包含地區資料檔案。
地區資料的全球變體可在 `@angular/common/locales/global` 中取得。

## `import` 法語範例

例如，您可以在啟動應用的 `main.ts` 中匯入法文 \(`fr`\) 的全域變數。

<docs-code header="src/main.ts (import locale)" path="adev/src/content/examples/i18n/src/main.ts" visibleRegion="global-locale"/>

說明：在 `NgModules` 應用程式中，您會在 `app.module` 中匯入它。

{{ 無法處理文件最後的 LinkReferenceDefinitionGroup 部分，需手動更新！ }}
