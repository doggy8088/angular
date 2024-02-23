# 加入 localize 套件

若要利用 Angular 的在地化功能，請使用 [Angular CLI][AioCliMain] 將 `@angular/localize` 套件新增至專案。

如要新增 `@angular/localize` 套件，請使用下列指令更新專案中的 `package.json` 與 TypeScript 組態檔案。

<docs-code path="adev/src/content/examples/i18n/doc-files/commands.sh" visibleRegion="add-localize"/>

它在 TypeScript 組態檔中加入 `types: ["@angular/localize"]`，並在 `main.ts` 檔案的頂端加入 `@angular/localize` 的類型定義參考。

HELPFUL: 有關 `package.json` 和 `tsconfig.json` 檔案的更多資訊，請參閱 [Workspace npm 相依性][AioGuideNpmPackages] 和 [TypeScript 設定][AioGuideTsConfig]。

如果未安裝 `@angular/localize`，而您嘗試建置專案的在地化版本（例如，在範本中使用 `i18n` 屬性的同時），[Angular CLI][AioCliMain] 會產生錯誤，其中包含您可採取的步驟來為專案啟用 i18n。

## 選項

| 選項           | 說明 | 值類型 | 預設值
|:---              |:---    |:------     |:------
| `--project`      | 專案名稱 | `string` |
| `--use-at-runtime` | 如果設定，則 `$localize` 可以於執行期間使用。另外，`@angular/localize` 會包含在 `package.json` 的 `dependencies` 區段，而不是預設的 `devDependencies`。  | `boolean` | `false`

有關更多可用選項，請參閱 [Angular CLI][AioCliMain] 中的 `ng add`。

## 接下來

<docs-pill-row>
  <docs-pill href="api/localize" title="@angular/localize API"/>
  <docs-pill href="guide/i18n/locale-id" title="依 ID 參照區域設定"/>
</docs-pill-row>

{{ 無法處理文件最後的 LinkReferenceDefinitionGroup 部分，需手動更新！ }}
