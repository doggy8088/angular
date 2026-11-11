# 匯入地區設定資料的全域變體

若你以 `--localize` 選項執行 [`ng build`][CliBuild] 指令，[Angular CLI][CliMain] 會自動包含地區設定資料。

<!--todo: replace with docs-code -->

<docs-code language="shell">

ng build --localize

</docs-code>

HELPFUL: Angular 初始安裝時已包含美式英文 \(`en-US`\) 的地區設定資料。
當你搭配 [`ng build`][CliBuild] 指令使用 `--localize` 選項時，[Angular CLI][CliMain] 會自動包含地區設定資料並設定 `LOCALE_ID` 的值。

npm 上的 `@angular/common` 套件包含地區設定資料檔案。
地區設定資料的全域變體位於 `@angular/common/locales/global`。

## 法文的 `import` 範例

例如，你可以在啟動應用程式的 `main.ts` 中，匯入法文 \(`fr`\) 的全域變體。

<docs-code header="src/main.ts (import locale)" path="adev/src/content/examples/i18n/src/main.ts" visibleRegion="global-locale"/>

HELPFUL: 在 `NgModules` 應用程式中，你要在 `app.module` 中匯入它。

[CliMain]: cli 'CLI 總覽與指令參考 | Angular'
[CliBuild]: cli/build 'ng build | CLI | Angular'
