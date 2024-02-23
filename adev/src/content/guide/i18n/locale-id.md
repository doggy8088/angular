# 透過 ID 參照地區設定

Angular 使用 Unicode *語言環境識別碼*（Unicode 語言環境 ID）來查找正確的語言環境資料，以便將文字字串國際化。

<docs-callout title="Unicode 地區程式碼">

* 地區 ID 符合 [Unicode 通用地區資料儲存庫 (CLDR) 核心規格][UnicodeCldrDevelopmentCoreSpecification]。
    有關地區 ID 的更多資訊，請參閱 [Unicode 語言和地區識別碼][UnicodeCldrDevelopmentCoreSpecificationLocaleIDs]。

* CLDR 和 Angular 使用 [BCP 47 標籤][RfcEditorInfoBcp47] 作為地區 ID 的基礎

</docs-callout>

區域程式碼識別語言、國家和用於進一步變體或細分的選用程式碼。
區域程式碼包括語言識別碼、連字符 (`-`) 字元和區域程式碼擴充。

<docs-code language="html">
{language_id}-{locale_extension}
</docs-code>

HELPFUL: 為了精確翻譯您的 Angular 專案，您必須決定您要針對哪些語言和地區進行國際化。

許多國家使用相同的語言，但用法不同。
差異包括文法、標點符號、貨幣格式、小數、日期等。

對於本指南中的範例，請使用下列語言和地區設定。

| 語言 | 地區                   | Unicode 地區 ID |
|:---      |:---                      |:---               |
| 英文  | 加拿大                   | `en-CA`           |
| 英文  | 美利堅合眾國 | `en-US`           |
| 法文   | 加拿大                   | `fr-CA`           |
| 法文   | 法國                   | `fr-FR`           |

[Angular 儲存庫][GithubAngularAngularTreeMasterPackagesCommonLocales] 包含常見的地區設定。

<docs-callout>
有關語言程式碼清單，請參閱 [ISO 639-2](https://www.loc.gov/standards/iso639-2)。
</docs-callout>

## 設定來源區域 ID

使用 Angular CLI 來設定您正在撰寫元件範本和程式碼的原始語言。

預設情況下，Angular 使用 `en-US` 作為專案的來源地區設定。

若要變更專案的原始區域設定以進行建置，請完成下列動作。

1. 開啟 [`angular.json`][AioGuideWorkspaceConfig] 工作區建置設定檔。
1. 變更 `sourceLocale` 欄位中的來源地區。

## 接下來

<docs-pill-row>
  <docs-pill href="guide/i18n/format-data-locale" title="根據地區設定格式化資料"/>
</docs-pill-row>

{{ 無法處理文件最後的 LinkReferenceDefinitionGroup 部分，需手動更新！ }}
