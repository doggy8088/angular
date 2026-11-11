# 以 ID 參照地區設定

Angular 使用 Unicode _地區設定識別碼_ \(Unicode locale ID\) 來尋找正確的地區設定資料，以便對文字字串進行國際化。

<docs-callout title="Unicode 地區設定 ID">

- 地區設定 ID 符合 [Unicode Common Locale Data Repository (CLDR) core specification][UnicodeCldrDevelopmentCoreSpecification]。
  關於地區設定 ID 的更多資訊，請見 [Unicode Language and Locale Identifiers][UnicodeCldrDevelopmentCoreSpecificationLocaleIDs]。

- CLDR 與 Angular 以 [BCP 47 tags][RfcEditorInfoBcp47] 作為地區設定 ID 的基礎

</docs-callout>

地區設定 ID 指定了語言、國家，以及用於進一步變體或細分的選用代碼。
地區設定 ID 由語言識別碼、一個連字號 \(`-`\) 字元與地區設定擴充部分組成。

<docs-code language="html">
{language_id}-{locale_extension}
</docs-code>

HELPFUL: 若要正確翻譯你的 Angular 專案，你必須決定國際化要鎖定的語言與地區設定。

許多國家使用相同語言，但用法有所不同。
這些差異包括文法、標點符號，以及貨幣、小數、日期的格式等等。

本指南的範例使用下列語言與地區設定。

| 語言 | 地區設定             | Unicode locale ID |
| :--- | :------------------- | :---------------- |
| 英文 | 加拿大               | `en-CA`           |
| 英文 | 美國                 | `en-US`           |
| 法文 | 加拿大               | `fr-CA`           |
| 法文 | 法國                 | `fr-FR`           |

[Angular 儲存庫][GithubAngularAngularTreeMasterPackagesCommonLocales] 包含常見的地區設定。

<docs-callout>
語言代碼清單請見 [ISO 639-2](https://www.loc.gov/standards/iso639-2)。
</docs-callout>

## 設定來源地區設定 ID

使用 Angular CLI 設定你撰寫元件範本與程式碼所用的來源語言。

預設情況下，Angular 使用 `en-US` 作為專案的來源地區設定。

若要為建置變更專案的來源地區設定，請完成下列動作。

1. 開啟 [`angular.json`][GuideWorkspaceConfig] 工作區建置設定檔。
2. 在 `i18n` 區段中新增或修改 `sourceLocale` 欄位：

```json
{
  "projects": {
    "your-project": {
      "i18n": {
        "sourceLocale": "ca"  // Use your desired locale code
      }
    }
  }
}
```

## 下一步

<docs-pill-row>
  <docs-pill href="guide/i18n/format-data-locale" title="依地區設定格式化資料"/>
</docs-pill-row>

[GuideWorkspaceConfig]: reference/configs/workspace-config 'Angular 工作區設定 | Angular'
[GithubAngularAngularTreeMasterPackagesCommonLocales]: https://github.com/angular/angular/tree/main/packages/common/locales 'angular/packages/common/locales | angular/angular | GitHub'
[RfcEditorInfoBcp47]: https://www.rfc-editor.org/info/bcp47 'BCP 47 | RFC Editor'
[UnicodeCldrDevelopmentCoreSpecification]: https://cldr.unicode.org/index/cldr-spec 'Core Specification | Unicode CLDR Project'
[UnicodeCldrDevelopmentCoreSpecificationLocaleID]: https://cldr.unicode.org/index/cldr-spec/picking-the-right-language-code 'Unicode Language and Locale Identifiers - Core Specification | Unicode CLDR Project'
