# 手動設定執行階段地區設定

<!--todo: The Angular CLI sets the locale ID token as part of the translation. -->

<!--todo: To override the provider for the locale ID token. -->

Angular 的初始安裝已包含美國英文 \(`en-US`\) 的地區設定資料。
[Angular CLI][AioCliMain] 會在你以 [`ng build`][AioCliBuild] 指令搭配 `--localize` 選項時，自動包含地區設定資料並設定 `LOCALE_ID` 的值。

若要手動將應用程式的執行階段地區設定設為自動值以外的值，請完成以下動作。

1.  在 [`@angular/common/locales/`][UnpkgBrowseAngularCommonLocales] 目錄中，搜尋語言-地區設定組合的 Unicode 地區設定 ID。
1.  設定 [`LOCALE_ID`][AioApiCoreLocaleId] token。

以下範例將 `LOCALE_ID` 的值設為法文的 `fr`。

<code-example header="src/app/app.module.ts" path="i18n/doc-files/app.module.ts" region="locale-id"></code-example>

<!-- links -->

[AioApiCoreLocaleId]: api/core/LOCALE_ID "LOCALE_ID | Core - API | Angular"

[AioCliMain]: cli "CLI Overview and Command Reference | Angular"
[AioCliBuild]: cli/build "ng build | CLI | Angular"

<!-- external links -->

[UnpkgBrowseAngularCommonLocales]: https://unpkg.com/browse/@angular/common/locales/ "@angular/common/locales/ | Unpkg"

<!-- end links -->

@reviewed 2022-02-28
