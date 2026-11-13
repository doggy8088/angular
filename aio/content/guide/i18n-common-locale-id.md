# 以 ID 參照地區設定

Angular 使用 Unicode *地區設定識別碼* \(Unicode locale ID\) 來尋找正確的地區設定資料，以便對文字字串進行國際化。

<div class="callout is-helpful">

<header>Unicode 地區設定 ID</header>

*   地區設定 ID 符合 [Unicode Common Locale Data Repository (CLDR) core specification][UnicodeCldrDevelopmentCoreSpecification]。
    關於地區設定 ID 的更多資訊，請見 [Unicode Language and Locale Identifiers][UnicodeCldrDevelopmentCoreSpecificationHVgyyng33o798]。

*   CLDR 與 Angular 以 [BCP 47 tags][RfcEditorInfoBcp47] 作為地區設定 ID 的基礎

</div>

地區設定 ID 指定了語言、國家，以及用於進一步變體或細分的選用代碼。
地區設定 ID 由語言識別碼、一個連字號 \(`-`\) 字元與地區設定擴充部分組成。

<code-example>

{language_id}-{locale_extension}

</code-example>

<div class="alert is-helpful">

若要正確翻譯你的 Angular 專案，你必須決定國際化要鎖定的語言與地區設定。

許多國家使用相同的語言，但用法不同。
差異包括文法、標點符號、貨幣格式、十進位數字、日期等等。

</div>

在本指南的範例中，請使用以下語言與地區設定。

| 語言 | 地區設定             | Unicode locale ID |
|:---      |:---                      |:---               |
| 英文 | 加拿大               | `en-CA`           |
| 英文 | 美國                 | `en-US`           |
| 法文 | 加拿大               | `fr-CA`           |
| 法文 | 法國                 | `fr-FR`           |

[Angular 儲存庫][GithubAngularAngularTreeMasterPackagesCommonLocales] 包含常見的地區設定。

<div class="callout is-helpful">

語言代碼清單請見 [ISO 639-2][LocStandardsIso6392]。

</div>

## 設定來源地區設定 ID

使用 Angular CLI 設定你撰寫元件範本與程式碼時使用的來源語言。

依預設，Angular 使用 `en-US` 作為專案的來源地區設定。

若要變更建置時專案的來源地區設定，請完成以下動作。

1.  開啟 [`angular.json`][AioGuideWorkspaceConfig] 工作區建置設定檔。
1.  變更 `sourceLocale` 欄位中的來源地區設定。

## 接下來

*   [依據地區設定格式化資料][AioGuideI18nCommonFormatDataLocale]

<!-- links -->

[AioGuideI18nCommonFormatDataLocale]: guide/i18n-common-format-data-locale "Format data based on locale | Angular"
[AioGuideI18nCommonMerge]: guide/i18n-common-merge "Merge translations into the application | Angular"

[AioGuideWorkspaceConfig]: guide/workspace-config "Angular workspace configuration | Angular"

<!-- external links -->

[GithubAngularAngularTreeMasterPackagesCommonLocales]: https://github.com/angular/angular/tree/main/packages/common/locales "angular/packages/common/locales | angular/angular | GitHub"

[LocStandardsIso6392]: https://www.loc.gov/standards/iso639-2 "ISO 639-2 Registration Authority | Library of Congress"

[RfcEditorInfoBcp47]: https://www.rfc-editor.org/info/bcp47 "BCP 47 | RFC Editor"

[UnicodeCldrDevelopmentCoreSpecification]: https://cldr.unicode.org/development/core-specification "Core Specification | Unicode CLDR Project"
[UnicodeCldrDevelopmentCoreSpecificationHVgyyng33o798]: https://cldr.unicode.org/development/core-specification#h.vgyyng33o798 "Unicode Language and Locale Identifiers - Core Specification | Unicode CLDR Project"

<!-- end links -->

@reviewed 2021-10-28
