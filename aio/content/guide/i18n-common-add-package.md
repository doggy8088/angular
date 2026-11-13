# 新增 localize 套件

若要運用 Angular 的在地化功能，請使用 [Angular CLI][AioCliMain] 將 `@angular/localize` 套件新增至你的專案。

若要新增 `@angular/localize` 套件，請使用下列指令，更新專案中的 `package.json` 與 TypeScript 設定檔。

<code-example path="i18n/doc-files/commands.sh" region="add-localize"></code-example>

它會在 TypeScript 設定檔中加入 `types: ["@angular/localize"]`，同時在 `main.ts` 檔案頂部加入 `@angular/localize` 型別定義的參照。

<div class="alert is-helpful">

若要進一步了解 `package.json` 與 `tsconfig.json` 檔案，請見[工作區 npm 相依性][AioGuideNpmPackages]與 [TypeScript 設定][AioGuideTsConfig]。

</div>

若未安裝 `@angular/localize`，而你嘗試建置專案的在地化版本（例如在範本中使用 `i18n` 屬性時），[Angular CLI][AioCliMain] 會產生錯誤，錯誤訊息中會包含為專案啟用 i18n 的步驟。

## 選項

| 選項 | 說明 | 值型別 | 預設值 |
|:---              |:---    |:------     |:------
| `--project` | 專案名稱。 | `string` |
| `--use-at-runtime` | 設定後，`$localize` 即可在執行時使用。此外，`@angular/localize` 會被加入 `package.json` 的 `dependencies` 區段，而不是預設的 `devDependencies`。 | `boolean` | `false` |

更多可用選項，請見 [Angular CLI][AioCliMain] 中的 [ng add][AioCliAdd]。
## 後續步驟

*   [@angular/localize API][AioApiLocalize]
*   [依 ID 參照地區設定][AioGuideI18nCommonLocaleId]

<!-- links -->

[AioCliMain]: cli "CLI Overview and Command Reference | Angular"

[AioGuideI18nCommonLocaleId]: guide/i18n-common-locale-id "依 ID 參照地區設定 | Angular"

[AioGuideNpmPackages]: guide/npm-packages "工作區 npm 相依性 | Angular"

[AioGuideTsConfig]: guide/typescript-configuration "TypeScript 設定 | Angular"

[AioCliAdd]: cli/add "ng add | CLI | Angular"

[AioApiLocalize]: api/localize "$localize | @angular/localize - API | Angular"

<!-- external links -->

<!-- end links -->

@reviewed 2023-03-10
