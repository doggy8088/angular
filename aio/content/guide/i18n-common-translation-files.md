# 使用翻譯檔案

在你將元件準備好進行翻譯之後，可以使用 [`extract-i18n`][AioCliExtractI18n] [Angular CLI][AioCliMain] 指令，將元件中標記的文字擷取到一個來源語言（source language）檔案中。

標記的文字包括以 `i18n` 標記的文字、以 `i18n-`*attribute* 標記的屬性，以及如[為翻譯準備元件][AioGuideI18nCommonPrepare]所述以 `$localize` 標記的文字。

請完成下列步驟，為你的專案建立並更新翻譯檔案。

1.  [擷取來源語言檔案][AioGuideI18nCommonTranslationFilesExtractTheSourceLanguageFile]。
    1.  選擇性地變更位置、格式與名稱。
1.  將來源語言檔案複製一份，為每種語言[建立一個翻譯檔案][AioGuideI18nCommonTranslationFilesCreateATranslationFileForEachLanguage]。
1.  [翻譯每個翻譯檔案][AioGuideI18nCommonTranslationFilesTranslateEachTranslationFile]。
1.  分別翻譯複數形式與替代運算式。
    1.  [翻譯複數形式][AioGuideI18nCommonTranslationFilesTranslatePlurals]。
    1.  [翻譯替代運算式][AioGuideI18nCommonTranslationFilesTranslateAlternateExpressions]。
    1.  [翻譯巢狀運算式][AioGuideI18nCommonTranslationFilesTranslateNestedExpressions]。

## 擷取來源語言檔案

若要擷取來源語言檔案，請完成下列動作。

1.  開啟終端機視窗。
1.  切換到你專案的根目錄。
1.  執行下列 CLI 指令。

    <code-example path="i18n/doc-files/commands.sh" region="extract-i18n-default"></code-example>

`extract-i18n` 指令會在你專案的根目錄中，建立一個名為 `messages.xlf` 的來源語言檔案。 有關 XML Localization Interchange File Format（XLIFF，version 1.2）的更多資訊，請參閱 [XLIFF][WikipediaWikiXliff]。

使用下列 [`extract-i18n`][AioCliExtractI18n] 指令選項，可以變更來源語言檔案的位置、格式與檔案名稱。

| 指令選項 | 說明 |
|:---             |:---     |
| `--format` | 設定輸出檔案的格式 |
| `--out-file` | 設定輸出檔案的名稱 |
| `--output-path` | 設定輸出目錄的路徑 |

### 變更來源語言檔案的位置

若要在 `src/locale` 目錄中建立檔案，請將輸出路徑指定為選項。

#### `extract-i18n --output-path` 範例

下列範例將輸出路徑指定為選項。

<code-example path="i18n/doc-files/commands.sh" region="extract-i18n-output-path"></code-example>

### 變更來源語言檔案的格式

`extract-i18n` 指令可以建立下列翻譯格式的檔案。

| 翻譯格式 | 說明 | 副檔名 |
|:---                |:---                                                                                                              |:---            |
| ARB | [Application Resource Bundle][GithubGoogleAppResourceBundleWikiApplicationresourcebundlespecification] | `.arb` |
| JSON | [JavaScript Object Notation][JsonMain] | `.json` |
| XLIFF 1.2 | [XML Localization Interchange File Format, version 1.2][OasisOpenDocsXliffXliffCoreXliffCoreHtml] | `.xlf` |
| XLIFF 2 | [XML Localization Interchange File Format, version 2][OasisOpenDocsXliffXliffCoreV20Cos01XliffCoreV20Cose01Html] | `.xlf` |
| XMB | [XML Message Bundle][UnicodeCldrDevelopmentDevelopmentProcessDesignProposalsXmb] | `.xmb` \(`.xtb`\) |

使用 `--format` 指令選項明確指定翻譯格式。

<div class="alert is-helpful">

XMB 格式會產生 `.xmb` 來源語言檔案，但使用 `.xtb` 翻譯檔案。

</div>

#### `extract-i18n --format` 範例

下列範例示範了幾種翻譯格式。

<code-example path="i18n/doc-files/commands.sh" region="extract-i18n-formats"></code-example>

### 變更來源語言檔案的名稱

若要變更擷取工具產生的來源語言檔案名稱，請使用 `--out-file` 指令選項。

#### `extract-i18n --out-file` 範例

下列範例示範如何為輸出檔案命名。

<code-example path="i18n/doc-files/commands.sh" region="extract-i18n-out-file"></code-example>

## 為每種語言建立一個翻譯檔案

若要為某個地區設定（locale）或語言建立翻譯檔案，請完成下列動作。

1.  [擷取來源語言檔案][AioGuideI18nCommonTranslationFilesExtractTheSourceLanguageFile]。
1.  複製一份來源語言檔案，為每種語言建立一個翻譯檔案。
1.  重新命名翻譯檔案，加上地區設定。

    <code-example language="file">

    messages.xlf --&gt; messages.{locale}.xlf

    </code-example>

1.  在你專案的根目錄建立一個名為 `locale` 的新目錄。

    <code-example language="file">

    src/locale

    </code-example>

1.  將翻譯檔案移到新目錄中。
1.  將翻譯檔案送交你的譯者。
1.  對你想加入應用程式的每種語言，重複上述步驟。

### 法文的 `extract-i18n` 範例

例如，若要建立法文翻譯檔案，請完成下列動作。

1.  執行 `extract-i18n` 指令。
1.  複製一份 `messages.xlf` 來源語言檔案。
1.  將複本重新命名為 `messages.fr.xlf`，作為法文（`fr`）翻譯。
1.  將 `fr` 翻譯檔案移到 `src/locale` 目錄。
1.  將 `fr` 翻譯檔案送交譯者。

## 翻譯每個翻譯檔案

除非你精通該語言，而且有時間編輯翻譯，否則你很可能會完成下列步驟。

1.  將每個翻譯檔案送交譯者。
1.  譯者使用 XLIFF 檔案編輯器完成下列動作。
    1.  建立翻譯。
    1.  編輯翻譯。

### 法文翻譯流程範例

為了示範流程，請檢視[範例 Angular 國際化應用程式][AioGuideI18nExample]中的 `messages.fr.xlf` 檔案。[範例 Angular 國際化應用程式][AioGuideI18nExample]包含一份法文翻譯，讓你無需特殊的 XLIFF 編輯器或法文知識就能編輯。

下列動作說明法文的翻譯流程。

1.  開啟 `messages.fr.xlf`，找出第一個 `<trans-unit>` 元素。 這是一個翻譯單元（translation unit），也稱為文字節點（text node），代表先前以 `i18n` 屬性標記的 `<h1>` 問候標籤的翻譯。

    <code-example header="src/locale/messages.fr.xlf (&lt;trans-unit&gt;)" path="i18n/doc-files/messages.fr.xlf.html" region="translated-hello-before"></code-example>

`id="introductionHeader"` 是一個[自訂 ID][AioGuideI18nOptionalManageMarkedText]，但不含來源 HTML 中要求的 `@@` 前綴。

1.  複製文字節點中的 `<source>... </source>` 元素，將它重新命名為 `target`，然後把內容換成法文文字。

    <code-example header="src/locale/messages.fr.xlf (&lt;trans-unit&gt;, after translation)" path="i18n/doc-files/messages.fr.xlf.html" region="translated-hello"></code-example>

在較複雜的翻譯中，[說明與含義元素][AioGuideI18nCommonPrepareAddHelpfulDescriptionsAndMeanings]中的資訊與上下文，能協助你選擇正確的翻譯用詞。

1.  翻譯其他文字節點。 下列範例顯示翻譯的方式。

    <code-example header="src/locale/messages.fr.xlf (&lt;trans-unit&gt;)" path="i18n/doc-files/messages.fr.xlf.html" region="translated-other-nodes"></code-example>

    <div class="alert is-important">

    請勿變更翻譯單元的 ID。
    每個 `id` 屬性都是由 Angular 產生的，並取決於元件文字的內容與指定的意義。
    如果你變更文字或意義，`id` 屬性就會改變。
    若要進一步了解如何管理文字更新與 ID，請見[自訂 ID][AioGuideI18nOptionalManageMarkedText]。

    </div>

## 翻譯複數形式

依每種語言的需要，新增或移除複數形式（plural cases）。

<div class="alert is-helpful">

語言複數規則請見 [CLDR 複數規則][GithubUnicodeOrgCldrStagingChartsLatestSupplementalLanguagePluralRulesHtml]。

</div>

### `minute` `plural` 範例

若要翻譯 `plural`，請翻譯 ICU 格式的比對值。

*   `just now`
*   `one minute ago`
*   `<x id="INTERPOLATION" equiv-text="{{minutes}}"/> minutes ago`

下列範例顯示翻譯的方式。

<code-example header="src/locale/messages.fr.xlf (&lt;trans-unit&gt;)" path="i18n/doc-files/messages.fr.xlf.html" region="translated-plural"></code-example>

## 翻譯替代運算式

Angular 也會將替代的 `select` ICU 運算式擷取為個別的翻譯單元。

### `gender` `select` 範例

下列範例顯示元件範本中的一個 `select` ICU 運算式。

<code-example header="src/app/app.component.html" path="i18n/src/app/app.component.html" region="i18n-select"></code-example>

在此範例中，Angular 將運算式擷取為兩個翻譯單元。 第一個包含 `select` 子句之外的文字，並為 `select` 使用一個佔位符（`<x id="ICU">`）：

<code-example header="src/locale/messages.fr.xlf (&lt;trans-unit&gt;)" path="i18n/doc-files/messages.fr.xlf.html" region="translate-select-1"></code-example>

<div class="alert is-important">

翻譯文字時，如有必要請移動預留位置，但不要移除它。
如果你移除了預留位置，ICU 運算式就會從你翻譯後的應用程式中被移除。

</div>

下列範例顯示第二個翻譯單元，其中包含 `select` 子句。

<code-example header="src/locale/messages.fr.xlf (&lt;trans-unit&gt;)" path="i18n/doc-files/messages.fr.xlf.html" region="translate-select-2"></code-example>

下列範例顯示翻譯完成後的兩個翻譯單元。

<code-example header="src/locale/messages.fr.xlf (&lt;trans-unit&gt;)" path="i18n/doc-files/messages.fr.xlf.html" region="translated-select"></code-example>

## 翻譯巢狀運算式

Angular 處理巢狀運算式的方式，與處理替代運算式相同。 Angular 會將運算式擷取為兩個翻譯單元。

### 巢狀 `plural` 範例

下列範例顯示第一個翻譯單元，其中包含巢狀運算式之外的文字。

<code-example header="src/locale/messages.fr.xlf (&lt;trans-unit&gt;)" path="i18n/doc-files/messages.fr.xlf.html" region="translate-nested-1"></code-example>

下列範例顯示第二個翻譯單元，其中包含完整的巢狀運算式。

<code-example header="src/locale/messages.fr.xlf (&lt;trans-unit&gt;)" path="i18n/doc-files/messages.fr.xlf.html" region="translate-nested-2"></code-example>

下列範例顯示翻譯後的兩個翻譯單元。

<code-example header="src/locale/messages.fr.xlf (&lt;trans-unit&gt;)" path="i18n/doc-files/messages.fr.xlf.html" region="translate-nested"></code-example>

## 後續步驟

*   [將翻譯合併到應用程式中][AioGuideI18nCommonMerge]

<!-- links -->

[AioCliMain]: cli "CLI Overview and Command Reference | Angular"
[AioCliExtractI18n]: cli/extract-i18n "ng extract-i18n | CLI | Angular"

[AioGuideGlossaryCommandLineInterfaceCli]: guide/glossary#命令列介面command-line-interfacecli "命令列介面（CLI）- 詞彙表 | Angular"

[AioGuideI18nCommonMerge]: guide/i18n-common-merge "將翻譯合併到應用程式中 | Angular"

[AioGuideI18nCommonPrepare]: guide/i18n-common-prepare "準備元件以供翻譯 | Angular"
[AioGuideI18nCommonPrepareAddHelpfulDescriptionsAndMeanings]: guide/i18n-common-prepare#加入有幫助的說明與意義 "加入有幫助的說明與意義 - 準備元件以供翻譯 | Angular"

[AioGuideI18nCommonTranslationFilesCreateATranslationFileForEachLanguage]: guide/i18n-common-translation-files#為每種語言建立一個翻譯檔案 "為每種語言建立一個翻譯檔案 - 使用翻譯檔案 | Angular"
[AioGuideI18nCommonTranslationFilesExtractTheSourceLanguageFile]: guide/i18n-common-translation-files#擷取來源語言檔案 "擷取來源語言檔案 - 使用翻譯檔案 | Angular"
[AioGuideI18nCommonTranslationFilesTranslateAlternateExpressions]: guide/i18n-common-translation-files#翻譯替代運算式 "翻譯替代運算式 - 使用翻譯檔案 | Angular"
[AioGuideI18nCommonTranslationFilesTranslateEachTranslationFile]: guide/i18n-common-translation-files#翻譯每個翻譯檔案 "翻譯每個翻譯檔案 - 使用翻譯檔案 | Angular"
[AioGuideI18nCommonTranslationFilesTranslateNestedExpressions]: guide/i18n-common-translation-files#翻譯巢狀運算式 "翻譯巢狀運算式 - 使用翻譯檔案 | Angular"
[AioGuideI18nCommonTranslationFilesTranslatePlurals]: guide/i18n-common-translation-files#翻譯複數形式 "翻譯複數形式 - 使用翻譯檔案 | Angular"

[AioGuideI18nExample]: guide/i18n-example "Angular 國際化範例應用程式 | Angular"

[AioGuideI18nOptionalManageMarkedText]: guide/i18n-optional-manage-marked-text "使用自訂 ID 管理已標記文字 | Angular"

[AioGuideWorkspaceConfig]: guide/workspace-config "Angular 工作區設定 | Angular"

<!-- external links -->

[GithubGoogleAppResourceBundleWikiApplicationresourcebundlespecification]: https://github.com/google/app-resource-bundle/wiki/ApplicationResourceBundleSpecification "ApplicationResourceBundleSpecification | google/app-resource-bundle | GitHub"

[GithubUnicodeOrgCldrStagingChartsLatestSupplementalLanguagePluralRulesHtml]: https://unicode-org.github.io/cldr-staging/charts/latest/supplemental/language_plural_rules.html "語言複數規則 - CLDR 圖表 | Unicode | GitHub"

[JsonMain]: https://www.json.org "Introducing JSON | JSON"

[OasisOpenDocsXliffXliffCoreXliffCoreHtml]: http://docs.oasis-open.org/xliff/xliff-core/xliff-core.html "XLIFF Version 1.2 Specification | Oasis Open Docs"
[OasisOpenDocsXliffXliffCoreV20Cos01XliffCoreV20Cose01Html]: http://docs.oasis-open.org/xliff/xliff-core/v2.0/cos01/xliff-core-v2.0-cos01.html "XLIFF Version 2.0 | Oasis Open Docs"

[UnicodeCldrDevelopmentDevelopmentProcessDesignProposalsXmb]: http://cldr.unicode.org/development/development-process/design-proposals/xmb "XMB | CLDR - Unicode Common Locale Data Repository | Unicode"

[WikipediaWikiXliff]: https://en.wikipedia.org/wiki/XLIFF "XLIFF | Wikipedia"

<!-- end links -->

@reviewed 2022-02-28
