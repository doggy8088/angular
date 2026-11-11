# 新增 localize 套件

若要運用 Angular 的在地化功能，請使用 [Angular CLI][CliMain] 將 `@angular/localize` 套件新增至你的專案。

若要新增 `@angular/localize` 套件，請使用下列指令，更新專案中的 `package.json` 與 TypeScript 設定檔。

<docs-code path="adev/src/content/examples/i18n/doc-files/commands.sh" visibleRegion="add-localize"/>

它會在 TypeScript 設定檔中加入 `types: ["@angular/localize"]`，同時在 `main.ts` 檔案頂部加入 `@angular/localize` 型別定義的參照。

HELPFUL: 關於 `package.json` 與 `tsconfig.json` 檔案的更多資訊，請見[工作區 npm 相依性][GuideNpmPackages]與 [TypeScript 設定][GuideTsConfig]。

若未安裝 `@angular/localize`，而你嘗試建置專案的在地化版本（例如在範本中使用 `i18n` 屬性時），[Angular CLI][CliMain] 會產生錯誤，錯誤訊息中會包含為專案啟用 i18n 的步驟。

## 選項

| 選項               | 說明                                                                                                                                                                          | 值型別     | 預設值        |
| :----------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :--------- | :------------ |
| `--project`        | 專案名稱。                                                                                                                                                                    | `string`   |
| `--use-at-runtime` | 設定後，`$localize` 即可在執行時使用。此外，`@angular/localize` 會被加入 `package.json` 的 `dependencies` 區段，而不是預設的 `devDependencies`。                              | `boolean`  | `false`       |

更多可用選項，請見 [Angular CLI][CliMain] 中的 `ng add`。

## 下一步

<docs-pill-row>
  <docs-pill href="guide/i18n/locale-id" title="以 ID 參照地區設定"/>
</docs-pill-row>

[CliMain]: cli 'CLI 總覽與指令參考 | Angular'
[GuideNpmPackages]: reference/configs/npm-packages '工作區 npm 相依性 | Angular'
[GuideTsConfig]: https://www.typescriptlang.org/docs/handbook/tsconfig-json.html 'TypeScript Configuration'
