# 新增 localize 套件

若要運用 Angular 的在地化功能，請使用 [Angular CLI][AioCliMain] 將 `@angular/localize` 套件新增至你的專案。

若要新增 `@angular/localize` 套件，請使用下列指令，更新專案中的 `package.json` 與 `polyfills.ts` 檔案。

<code-example path="i18n/doc-files/commands.sh" region="add-localize" language="sh"></code-example>

<div class="alert is-helpful">

若要進一步了解 `package.json` 與 `polyfill.ts` 檔案，請見[工作區 npm 相依性][AioGuideNpmPackages]。

</div>

若未安裝 `@angular/localize`，而你嘗試建置專案的在地化版本，[Angular CLI][AioCliMain] 會產生錯誤。

<!--todo: add example error -->

## 後續步驟

*   [依 ID 參照地區設定][AioGuideI18nCommonLocaleId]

<!-- links -->

[AioCliMain]: cli "CLI Overview and Command Reference | Angular"

[AioGuideI18nCommonLocaleId]: guide/i18n-common-locale-id "依 ID 參照地區設定 | Angular"

[AioGuideNpmPackages]: guide/npm-packages "工作區 npm 相依性 | Angular"

<!-- external links -->

<!-- end links -->

@reviewed 2021-10-07
