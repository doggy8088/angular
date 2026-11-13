# 匯入地區設定資料的全域變體

若你以 `--localize` 選項執行 [`ng build`][AioCliBuild] 指令，[Angular CLI][AioCliMain] 會自動包含地區設定資料。

<!--todo: replace with code-example -->

<code-example language="sh">

ng build --localize

</code-example>

npm 上的 `@angular/common` 套件包含地區設定資料檔案。
地區設定資料的全域變體位於 [`@angular/common/locales/global`][GithubAngularAngularTreeMasterPackagesCommonLocalesGlobal]。

## 法文的 `import` 範例

以下範例匯入法文（`fr`）的全域變體。

<code-example path="i18n/doc-files/app.module.ts" header="src/app/app.module.ts" region="global-locale"></code-example>

<!-- links -->

[AioCliMain]: cli "CLI Overview and Command Reference | Angular"
[AioCliBuild]: cli/build "ng build | CLI | Angular"

<!-- external links -->

[GithubAngularAngularTreeMasterPackagesCommonLocales]: https://github.com/angular/angular/tree/master/packages/common/locales "angular/packages/common/locales | angular/angular | GitHub"
[GithubAngularAngularTreeMasterPackagesCommonLocalesGlobal]: https://github.com/angular/angular/tree/master/packages/common/locales/global "angular/packages/common/locales/global | angular/angular | GitHub"

<!-- end links -->

@reviewed 2021-10-13
