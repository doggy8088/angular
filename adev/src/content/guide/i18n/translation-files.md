# 使用翻譯檔案

在你將元件準備好進行翻譯之後，可以使用 [`extract-i18n`][CliExtractI18n] [Angular CLI][CliMain] 指令，將元件中標記的文字擷取到一個來源語言（source language）檔案中。

標記的文字包括以 `i18n` 標記的文字、以 `i18n-`*attribute* 標記的屬性，以及如[為翻譯準備元件][GuideI18nCommonPrepare]所述以 `$localize` 標記的文字。

請完成下列步驟，為你的專案建立並更新翻譯檔案。

1. [擷取來源語言檔案][GuideI18nCommonTranslationFilesExtractTheSourceLanguageFile]。
    1. 選擇性地變更位置、格式與名稱。
1. 將來源語言檔案複製一份，為每種語言[建立一個翻譯檔案][GuideI18nCommonTranslationFilesCreateATranslationFileForEachLanguage]。
1. [翻譯每個翻譯檔案][GuideI18nCommonTranslationFilesTranslateEachTranslationFile]。
1. 分別翻譯複數形式與替代運算式。
    1. [翻譯複數形式][GuideI18nCommonTranslationFilesTranslatePlurals]。
    1. [翻譯替代運算式][GuideI18nCommonTranslationFilesTranslateAlternateExpressions]。
    1. [翻譯巢狀運算式][GuideI18nCommonTranslationFilesTranslateNestedExpressions]。

## 擷取來源語言檔案 {#extract-the-source-language-file}

若要擷取來源語言檔案，請完成下列動作。

1. 開啟終端機視窗。
1. 切換到你專案的根目錄。
1. 執行下列 CLI 指令。

    <docs-code path="adev/src/content/examples/i18n/doc-files/commands.sh" visibleRegion="extract-i18n-default"/>

`extract-i18n` 指令會在你專案的根目錄中，建立一個名為 `messages.xlf` 的來源語言檔案。
有關 XML Localization Interchange File Format（XLIFF，version 1.2）的更多資訊，請參閱 [XLIFF][WikipediaWikiXliff]。

使用下列 [`extract-i18n`][CliExtractI18n] 指令選項，可以變更來源語言檔案的位置、格式與檔案名稱。

| 指令選項  | 說明                              |
|:---             |:---     |
| `--format`      | 設定輸出檔案的格式    |
| `--out-file`    | 設定輸出檔案的名稱      |
| `--output-path` | 設定輸出目錄的路徑 |

### 變更來源語言檔案的位置

若要在 `src/locale` 目錄中建立檔案，請將輸出路徑指定為選項。

#### `extract-i18n --output-path` 範例

下列範例將輸出路徑指定為選項。

<docs-code path="adev/src/content/examples/i18n/doc-files/commands.sh" visibleRegion="extract-i18n-output-path"/>

### 變更來源語言檔案的格式 {#change-the-source-language-file-format}

`extract-i18n` 指令可以建立下列翻譯格式的檔案。

| 翻譯格式 | 說明                                                                                                          | 副檔名    |
|:---                |:---                                                                                                              |:---            |
| ARB                | [Application Resource Bundle][GithubGoogleAppResourceBundleWikiApplicationresourcebundlespecification]           | `.arb`            |
| JSON               | [JavaScript Object Notation][JsonMain]                                                                           | `.json`           |
| XLIFF 1.2          | [XML Localization Interchange File Format, version 1.2][OasisOpenDocsXliffXliffCoreXliffCoreHtml]                | `.xlf`            |
| XLIFF 2            | [XML Localization Interchange File Format, version 2][OasisOpenDocsXliffXliffCoreV20Cos01XliffCoreV20Cose01Html] | `.xlf`            |
| XMB                | [XML Message Bundle][UnicodeCldrDevelopmentDevelopmentProcessDesignProposalsXmb]                                 | `.xmb` \(`.xtb`\) |

使用 `--format` 指令選項明確指定翻譯格式。

HELPFUL: XMB 格式會產生 `.xmb` 來源語言檔案，但翻譯檔案使用的是 `.xtb`。

#### `extract-i18n --format` 範例

下列範例示範了幾種翻譯格式。

<docs-code path="adev/src/content/examples/i18n/doc-files/commands.sh" visibleRegion="extract-i18n-formats"/>

### 變更來源語言檔案的名稱

若要變更擷取工具產生的來源語言檔案名稱，請使用 `--out-file` 指令選項。

#### `extract-i18n --out-file` 範例

下列範例示範如何為輸出檔案命名。

<docs-code path="adev/src/content/examples/i18n/doc-files/commands.sh" visibleRegion="extract-i18n-out-file"/>

## 為每種語言建立一個翻譯檔案 {#create-a-translation-file-for-each-language}

若要為某個地區設定（locale）或語言建立翻譯檔案，請完成下列動作。

1. [擷取來源語言檔案][GuideI18nCommonTranslationFilesExtractTheSourceLanguageFile]。
1. 複製一份來源語言檔案，為每種語言建立一個翻譯檔案。
1. 重新命名翻譯檔案，加上地區設定。

    <docs-code language="file">

    messages.xlf --> messages.{locale}.xlf

    </docs-code>

1. 在你專案的根目錄建立一個名為 `locale` 的新目錄。

    <docs-code language="file">

    src/locale

    </docs-code>

1. 將翻譯檔案移到新目錄中。
1. 將翻譯檔案送交你的譯者。
1. 對你想加入應用程式的每種語言，重複上述步驟。

### 法文的 `extract-i18n` 範例

例如，若要建立法文翻譯檔案，請完成下列動作。

1. 執行 `extract-i18n` 指令。
1. 複製一份 `messages.xlf` 來源語言檔案。
1. 將複本重新命名為 `messages.fr.xlf`，作為法文（`fr`）翻譯。
1. 將 `fr` 翻譯檔案移到 `src/locale` 目錄。
1. 將 `fr` 翻譯檔案送交譯者。

## 翻譯每個翻譯檔案 {#translate-each-translation-file}

除非你精通該語言，而且有時間編輯翻譯，否則你很可能會完成下列步驟。

1. 將每個翻譯檔案送交譯者。
1. 譯者使用 XLIFF 檔案編輯器完成下列動作。
    1. 建立翻譯。
    1. 編輯翻譯。

### 法文翻譯流程範例

為了示範流程，請檢視[範例 Angular 國際化應用程式][GuideI18nExample]中的 `messages.fr.xlf` 檔案。[範例 Angular 國際化應用程式][GuideI18nExample]包含一份法文翻譯，讓你無需特殊的 XLIFF 編輯器或法文知識就能編輯。

下列動作說明法文的翻譯流程。

1. 開啟 `messages.fr.xlf`，找出第一個 `<trans-unit>` 元素。
    這是一個翻譯單元（translation unit），也稱為文字節點（text node），代表先前以 `i18n` 屬性標記的 `<h1>` 問候標籤的翻譯。

    <docs-code header="src/locale/messages.fr.xlf (<trans-unit>)" path="adev/src/content/examples/i18n/doc-files/messages.fr.xlf.html" visibleRegion="translated-hello-before"/>

    `id="introductionHeader"` 是一個[自訂 ID][GuideI18nOptionalManageMarkedText]，但不含來源 HTML 中要求的 `@@` 前綴。

1. 複製文字節點中的 `<source>... </source>` 元素，將它重新命名為 `target`，然後把內容換成法文文字。

    <docs-code header="src/locale/messages.fr.xlf (<trans-unit>, after translation)" path="adev/src/content/examples/i18n/doc-files/messages.fr.xlf.html" visibleRegion="translated-hello"/>

    在較複雜的翻譯中，[說明與含義元素][GuideI18nCommonPrepareAddHelpfulDescriptionsAndMeanings]中的資訊與上下文，能協助你選擇正確的翻譯用詞。

1. 翻譯其他文字節點。
    下列範例顯示翻譯的方式。

    <docs-code header="src/locale/messages.fr.xlf (<trans-unit>)" path="adev/src/content/examples/i18n/doc-files/messages.fr.xlf.html" visibleRegion="translated-other-nodes"/>

IMPORTANT: 不要變更翻譯單元的 ID。
每個 `id` 屬性都是由 Angular 產生的，取決於元件文字的內容與指定的含義。

如果你變更了文字或含義，`id` 屬性就會改變。
有關管理文字更新與 ID 的更多資訊，請參閱[自訂 ID][GuideI18nOptionalManageMarkedText]。

## 翻譯複數形式 {#translate-plurals}

依每種語言的需要，新增或移除複數形式（plural cases）。

HELPFUL: 有關語言的複數規則，請參閱 [CLDR plural rules][GithubUnicodeOrgCldrStagingChartsLatestSupplementalLanguagePluralRulesHtml]。

### `minute` `plural` 範例

若要翻譯 `plural`，請翻譯 ICU 格式的比對值。

* `just now`
* `one minute ago`
* `<x id="INTERPOLATION" equiv-text="{{minutes}}"/> minutes ago`

下列範例顯示翻譯的方式。

<docs-code header="src/locale/messages.fr.xlf (<trans-unit>)" path="adev/src/content/examples/i18n/doc-files/messages.fr.xlf.html" visibleRegion="translated-plural"/>

## 翻譯替代運算式 {#translate-alternate-expressions}

Angular 也會將替代的 `select` ICU 運算式擷取為個別的翻譯單元。

### `gender` `select` 範例

下列範例顯示元件範本中的一個 `select` ICU 運算式。

<docs-code header="src/app/app.component.html" path="adev/src/content/examples/i18n/src/app/app.component.html" visibleRegion="i18n-select"/>

在此範例中，Angular 將運算式擷取為兩個翻譯單元。
第一個包含 `select` 子句之外的文字，並為 `select` 使用一個佔位符（`<x id="ICU">`）：

<docs-code header="src/locale/messages.fr.xlf (<trans-unit>)" path="adev/src/content/examples/i18n/doc-files/messages.fr.xlf.html" visibleRegion="translate-select-1"/>

IMPORTANT: 翻譯文字時，必要時可以移動佔位符，但不要將它移除。
如果你移除了佔位符，ICU 運算式就會從你翻譯後的應用程式中被移除。

下列範例顯示第二個翻譯單元，其中包含 `select` 子句。

<docs-code header="src/locale/messages.fr.xlf (<trans-unit>)" path="adev/src/content/examples/i18n/doc-files/messages.fr.xlf.html" visibleRegion="translate-select-2"/>

下列範例顯示翻譯完成後的兩個翻譯單元。

<docs-code header="src/locale/messages.fr.xlf (<trans-unit>)" path="adev/src/content/examples/i18n/doc-files/messages.fr.xlf.html" visibleRegion="translated-select"/>

## 翻譯巢狀運算式 {#translate-nested-expressions}

Angular 處理巢狀運算式的方式，與處理替代運算式相同。
Angular 會將運算式擷取為兩個翻譯單元。

### 巢狀 `plural` 範例

下列範例顯示第一個翻譯單元，其中包含巢狀運算式之外的文字。

<docs-code header="src/locale/messages.fr.xlf (<trans-unit>)" path="adev/src/content/examples/i18n/doc-files/messages.fr.xlf.html" visibleRegion="translate-nested-1"/>

下列範例顯示第二個翻譯單元，其中包含完整的巢狀運算式。

<docs-code header="src/locale/messages.fr.xlf (<trans-unit>)" path="adev/src/content/examples/i18n/doc-files/messages.fr.xlf.html" visibleRegion="translate-nested-2"/>

下列範例顯示翻譯後的兩個翻譯單元。

<docs-code header="src/locale/messages.fr.xlf (<trans-unit>)" path="adev/src/content/examples/i18n/doc-files/messages.fr.xlf.html" visibleRegion="translate-nested"/>

## 下一步

<docs-pill-row>
  <docs-pill href="guide/i18n/merge" title="將翻譯合併到應用程式中"/>
</docs-pill-row>


[CliMain]: cli "CLI Overview and Command Reference | Angular"
[CliExtractI18n]: cli/extract-i18n "ng extract-i18n | CLI | Angular"

[GuideI18nCommonPrepare]: guide/i18n/prepare "Prepare component for translation | Angular"
[GuideI18nCommonPrepareAddHelpfulDescriptionsAndMeanings]: guide/i18n/prepare#add-helpful-descriptions-and-meanings "Add helpful descriptions and meanings - Prepare component for translation | Angular"

[GuideI18nCommonTranslationFilesCreateATranslationFileForEachLanguage]: guide/i18n/translation-files#create-a-translation-file-for-each-language "Create a translation file for each language - Work with translation files | Angular"
[GuideI18nCommonTranslationFilesExtractTheSourceLanguageFile]: guide/i18n/translation-files#extract-the-source-language-file "Extract the source language file - Work with translation files | Angular"
[GuideI18nCommonTranslationFilesTranslateAlternateExpressions]: guide/i18n/translation-files#translate-alternate-expressions "Translate alternate expressions - Work with translation files | Angular"
[GuideI18nCommonTranslationFilesTranslateEachTranslationFile]: guide/i18n/translation-files#translate-each-translation-file "Translate each translation file - Work with translation files | Angular"
[GuideI18nCommonTranslationFilesTranslateNestedExpressions]: guide/i18n/translation-files#translate-nested-expressions "Translate nested expressions - Work with translation files | Angular"
[GuideI18nCommonTranslationFilesTranslatePlurals]: guide/i18n/translation-files#translate-plurals "Translate plurals - Work with translation files | Angular"

[GuideI18nExample]: guide/i18n/example "Example Angular Internationalization application | Angular"

[GuideI18nOptionalManageMarkedText]: guide/i18n/manage-marked-text "Manage marked text with custom IDs | Angular"

[GithubGoogleAppResourceBundleWikiApplicationresourcebundlespecification]: https://github.com/google/app-resource-bundle/wiki/ApplicationResourceBundleSpecification "ApplicationResourceBundleSpecification | google/app-resource-bundle | GitHub"

[GithubUnicodeOrgCldrStagingChartsLatestSupplementalLanguagePluralRulesHtml]: https://cldr.unicode.org/index/cldr-spec/plural-rules "Language Plural Rules - CLDR Charts | Unicode | GitHub"

[JsonMain]: https://www.json.org "Introducing JSON | JSON"

[OasisOpenDocsXliffXliffCoreXliffCoreHtml]: http://docs.oasis-open.org/xliff/xliff-core/xliff-core.html "XLIFF Version 1.2 Specification | Oasis Open Docs"
[OasisOpenDocsXliffXliffCoreV20Cos01XliffCoreV20Cose01Html]: http://docs.oasis-open.org/xliff/xliff-core/v2.0/cos01/xliff-core-v2.0-cos01.html "XLIFF Version 2.0 | Oasis Open Docs"

[UnicodeCldrDevelopmentDevelopmentProcessDesignProposalsXmb]: http://cldr.unicode.org/development/development-process/design-proposals/xmb "XMB | CLDR - Unicode Common Locale Data Repository | Unicode"

[WikipediaWikiXliff]: https://en.wikipedia.org/wiki/XLIFF "XLIFF | Wikipedia"
