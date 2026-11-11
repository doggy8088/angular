# 匯入地區設定資料的全域變體

若你以 `--localize` 選項執行 [`ng build`][AioCliBuild] 指令，[Angular CLI][AioCliMain] 會自動包含地區設定資料。

<!--todo: replace with code-example -->

<code-example format="shell" language="shell">

ng build --localize

</code-example>

npm 上的 `@angular/common` 套件包含地區設定資料檔案。
地區設定資料的全域變體位於 [`@angular/common/locales/global`][UnpkgBrowseAngularCommonLocalesGlobal]。

## 法文的 `import` 範例

以下範例匯入法文 \(`fr`\) 的全域變體。

<code-example header="src/app/app.module.ts" path="i18n/doc-files/app.module.ts" region="global-locale"></code-example>

<!-- links -->

[AioCliMain]: cli "CLI Overview and Command Reference | Angular"
[AioCliBuild]: cli/build "ng build | CLI | Angular"

<!-- external links -->

[UnpkgBrowseAngularCommonLocalesGlobal]: https://unpkg.com/browse/@angular/common/locales/global "@angular/common/locales/global | Unpkg"

<!-- end links -->

@reviewed 2022-02-28
