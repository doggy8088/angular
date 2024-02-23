# 使用翻譯檔案

在您為翻譯準備好元件後，請使用 [`extract-i18n`][AioCliExtractI18n] [Angular CLI][AioCliMain] 指令將元件中標記的文字萃取到 *原始語言* 檔案。

已標記文字包括以 `i18n` 標記的文字、以 `i18n-`*屬性* 標記的屬性，以及以 `$localize` 標記的文字，如 [為翻譯準備元件][AioGuideI18nCommonPrepare] 中所述。

請完成以下步驟，為您的專案建立和更新翻譯檔案。

1. [提取原始語言檔案][AioGuideI18nCommonTranslationFilesExtractTheSourceLanguageFile]。
    1. 選擇性地變更位置、格式和名稱。
1. 將原始語言檔案複製到 [為每種語言建立翻譯檔案][AioGuideI18nCommonTranslationFilesCreateATranslationFileForEachLanguage]。
1. [翻譯每個翻譯檔案][AioGuideI18nCommonTranslationFilesTranslateEachTranslationFile]。
1. 分別翻譯複數和替代表達式。
    1. [翻譯複數][AioGuideI18nCommonTranslationFilesTranslatePlurals]。
    1. [翻譯替代表達式][AioGuideI18nCommonTranslationFilesTranslateAlternateExpressions]。
    1. [翻譯巢狀表達式][AioGuideI18nCommonTranslationFilesTranslateNestedExpressions]。

## 提取原始語言檔案

如要提取原始語言檔案，請完成下列動作。

1. 開啟終端機視窗。
1. 變更至專案的根目錄。
1. 執行以下 CLI 指令。

    <docs-code path="adev/src/content/examples/i18n/doc-files/commands.sh" visibleRegion="extract-i18n-default"/>

`extract-i18n` 指令會在專案的根目錄建立一個名為 `messages.xlf` 的原始語言檔案。
如需有關 XML 本地化交換檔案格式 (XLIFF，1.2 版) 的更多資訊，請參閱 [XLIFF][WikipediaWikiXliff]。

使用下列 [`extract-i18n`][AioCliExtractI18n] 命令選項來變更原始語言檔案位置、格式和檔名。

| 命令選項  | 細節 |
|:---             |:---     |
| `--format`      | 設定輸出檔案的格式    |
| `--out-file`     | 設定輸出檔案的名稱      |
| `--output-path` | 設定輸出目錄的路徑 |

### 變更來源語言檔案位置

要建立一個檔案在 `src/locale` 目錄中，請把輸出路徑指定為選項。

#### `extract-i18n --output-path` 範例

以下範例將輸出路徑指定為選項。

<docs-code path="adev/src/content/examples/i18n/doc-files/commands.sh" visibleRegion="extract-i18n-output-path"/>

### 更改原始語言檔案格式

`extract-i18n` 指令會建立下列翻譯格式的檔案。

| 翻譯格式 | 詳細資訊                                                                                                                   | 檔案副檔名 |
|:---                |:---                                                                                                                       |:---            |
| ARB                | [應用程式資源組合][GithubGoogleAppResourceBundleWikiApplicationresourcebundlespecification]                                           | `.arb`            |
| JSON               | [JavaScript 物件表示法][JsonMain]                                                                                              | `.json`           |
| XLIFF 1.2          | [XML 本地化交換檔案格式，版本 1.2][OasisOpenDocsXliffXliffCoreXliffCoreHtml]                                                    | `.xlf`            |
| XLIFF 2            | [XML 本地化交換檔案格式，版本 2][OasisOpenDocsXliffXliffCoreV20Cos01XliffCoreV20Cose01Html]                                | `.xlf`            |
| XMB                | [XML 訊息組合][UnicodeCldrDevelopmentDevelopmentProcessDesignProposalsXmb]                                                               | `.xmb` \(`.xtb`\) |

請使用 `--format` 指令選項明確指定翻譯格式。

HELPFUL: XMB 格式會產生 `.xmb` 原始語言檔案，但使用`.xtb` 翻譯檔案。

#### `extract-i18n --format` 範例

以下範例展示了幾種翻譯格式。

<docs-code path="adev/src/content/examples/i18n/doc-files/commands.sh" visibleRegion="extract-i18n-formats"/>

### 變更來源語言檔案名稱

若要變更由萃取工具產生的原始語言檔案名稱，請使用「--out-file」指令選項。

#### `extract-i18n --out-file` 範例

以下範例說明如何命名輸出檔案。

<docs-code path="adev/src/content/examples/i18n/doc-files/commands.sh" visibleRegion="extract-i18n-out-file"/>

## 為每種語言建立一個翻譯檔案

若要建立某個地區或語言的翻譯檔案，請完成下列動作。

1. [萃取原始語言檔案][AioGuideI18nCommonTranslationFilesExtractTheSourceLanguageFile]。
1. 複製一份原始語言檔案，為每種語言建立一個「翻譯」檔案。
1. 將「翻譯」檔案重新命名，加入地區設定。

    <docs-code language="file">

    messages.xlf --&gt; messages.{locale}.xlf

    </docs-code>

1. 在專案根目錄建立一個名為「locale」的新目錄。

    <docs-code language="file">

    src/locale

    </docs-code>

1. 將「翻譯」檔案移至新目錄。
1. 將「翻譯」檔案傳送給您的翻譯人員。
1. 對您想新增至應用程式的每種語言重複以上步驟。

### `extract-i18n` 法文範例

例如，若要建立法文翻譯檔案，請完成下列動作。

1. 執行 `extract-i18n` 指令。
1. 複製 `messages.xlf` 原始語言檔案。
1. 將複製的檔案重新命名為 `messages.fr.xlf` 作為法文 \(`fr`\) 翻譯。
1. 將 `fr` 翻譯檔案移至 `src/locale` 目錄。
1. 將 `fr` 翻譯檔案傳送給翻譯者。

## 翻譯每個翻譯檔案

除非您精通該語言並有時間編輯翻譯，否則您可能會完成以下步驟。

1. 將每個翻譯檔案傳送給一位翻譯人員。
1. 翻譯人員使用 XLIFF 檔案編輯器完成下列動作。
    1. 建立翻譯。
    1. 編輯翻譯。

### 法語翻譯範例

若要示範此流程，請檢閱 [範例 Angular 國際化應用程式][AioGuideI18nExample] 中的 `messages.fr.xlf` 檔案。[範例 Angular 國際化應用程式][AioGuideI18nExample] 包含法文翻譯，您可以使用它來進行編輯，而不需要特殊的 XLIFF 編輯器或法文知識。

以下動作描述法文的翻譯過程。

1. 開啟 `messages.fr.xlf` 並找到第一個 `<trans-unit>` 元素。
    這是一個 *翻譯單元*，也稱為 *文字節點*，代表先前已使用 `i18n` 屬性標記的 `<h1>` 問候標籤的翻譯。

    <docs-code header="src/locale/messages.fr.xlf (&lt;trans-unit&gt;)" path="adev/src/content/examples/i18n/doc-files/messages.fr.xlf.html" visibleRegion="translated-hello-before"/>

    `id="introductionHeader"` 是 [自訂 ID][AioGuideI18nOptionalManageMarkedText]，但沒有原始 HTML 中所需的 `@@` 前綴。

1. 在文字節點中複製 `<source>... </source>` 元素，將其重新命名為 `target`，然後將內容替換為法文文字。

    <docs-code header="src/locale/messages.fr.xlf (&lt;trans-unit&gt;, after translation)" path="adev/src/content/examples/i18n/doc-files/messages.fr.xlf.html" visibleRegion="translated-hello"/>

    在較複雜的翻譯中，[說明和意義元素][AioGuideI18nCommonPrepareAddHelpfulDescriptionsAndMeanings] 中的資訊和脈絡可協助您選擇正確的翻譯字詞。

1. 翻譯其他文字節點。
    以下範例顯示翻譯的方式。

    <docs-code header="src/locale/messages.fr.xlf (&lt;trans-unit&gt;)" path="adev/src/content/examples/i18n/doc-files/messages.fr.xlf.html" visibleRegion="translated-other-nodes"/>

重要提示：請勿變更翻譯單元的 ID。
每個 `id` 屬性均由 Angular 產生，且取決於元件文字的內容與指派的意義。

如果變更文字或意義，則 `id` 屬性會變更。
如需詳細瞭解如何管理文字更新及 ID，請參閱 [自訂 ID][AioGuideI18nOptionalManageMarkedText]。

## 翻譯複數型

增加或移除複數形式視各語言的需要。

HELPFUL: 有關語言複數規則，請參閱 [CLDR 複數規則][GithubUnicodeOrgCldrStagingChartsLatestSupplementalLanguagePluralRulesHtml]。

### `minute` `plural` 範例

要翻譯「複數」，請翻譯 ICU 格式的匹配值。

* `剛剛`
* `一分鐘前`
* `<x id="INTERPOLATION" equiv-text="{{minutes}}"/> 分鐘前`

以下範例顯示翻譯方式。

<docs-code header="src/locale/messages.fr.xlf (&lt;trans-unit&gt;)" path="adev/src/content/examples/i18n/doc-files/messages.fr.xlf.html" visibleRegion="translated-plural"/>

## 翻譯替代表達式

Angular 亦會將其他 `select` ICU 表達式萃取為個別的翻譯單元。

### `gender` `select` 範例

以下範例在元件範本中顯示 `select` ICU 表達式。

<docs-code header="src/app/app.component.html" path="adev/src/content/examples/i18n/src/app/app.component.html" visibleRegion="i18n-select"/>

在此範例中，Angular 會將表達式萃取成兩個翻譯單位。
第一個包含 `select` 子句以外的文字，並使用 `select` 的預留位置 \(`<x id="ICU">`\) ：

<docs-code header="src/locale/messages.fr.xlf (&lt;trans-unit&gt;)" path="adev/src/content/examples/i18n/doc-files/messages.fr.xlf.html" visibleRegion="translate-select-1"/>

重要：翻譯文字時，請在必要時移動預留位置，但不要移除它。
如果您移除預留位置，您的翻譯應用程式就會移除 ICU 表達式。

以下範例顯示包含 `select` 子句的第二個轉換單元。

<docs-code header="src/locale/messages.fr.xlf (&lt;trans-unit&gt;)" path="adev/src/content/examples/i18n/doc-files/messages.fr.xlf.html" visibleRegion="translate-select-2"/>

以下範例在翻譯完成後同時顯示兩個翻譯單元。

<docs-code header="src/locale/messages.fr.xlf (&lt;trans-unit&gt;)" path="adev/src/content/examples/i18n/doc-files/messages.fr.xlf.html" visibleRegion="translated-select"/>

## 翻譯巢狀表達式

Angular 將巢狀表達式視為替代表達式一樣處理。
Angular 將表達式萃取為兩個翻譯單位。

### 嵌套 `plural` 範例

以下範例顯示包含巢狀表達式外部文字的第一個轉譯單元。

<docs-code header="src/locale/messages.fr.xlf (&lt;trans-unit&gt;)" path="adev/src/content/examples/i18n/doc-files/messages.fr.xlf.html" visibleRegion="translate-nested-1"/>

以下範例顯示包含完整巢狀運算式的第二個翻譯單元。

<docs-code header="src/locale/messages.fr.xlf (&lt;trans-unit&gt;)" path="adev/src/content/examples/i18n/doc-files/messages.fr.xlf.html" visibleRegion="translate-nested-2"/>

以下範例在翻譯後會顯示兩個翻譯單元。

<docs-code header="src/locale/messages.fr.xlf (&lt;trans-unit&gt;)" path="adev/src/content/examples/i18n/doc-files/messages.fr.xlf.html" visibleRegion="translate-nested"/>

## 接下來

<docs-pill-row>
  <docs-pill href="guide/i18n/merge" title="將翻譯內容合併到應用程式中"/>
</docs-pill-row>

{{ 無法處理文件最後的 LinkReferenceDefinitionGroup 部分，需手動更新！ }}
