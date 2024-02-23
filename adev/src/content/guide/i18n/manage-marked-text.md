# 使用自訂 ID 管理標記文字

Angular 萃取器會為下列各個執行個體產生一個具翻譯單位的檔案。

* 組件範本中的每個 `i18n` 屬性
* 組件程式碼中的每個 [`$localize`][AioApiLocalizeInitLocalize] 標記訊息字串

如 [含義如何控制文字擷取和合併][AioGuideI18nCommonPrepareHowMeaningsControlTextExtractionAndMerges] 中所述，Angular 會為每個翻譯單元指定一個唯一的 ID。

以下範例顯示具有唯一 ID 的翻譯單位。

<docs-code header="messages.fr.xlf.html" path="adev/src/content/examples/i18n/doc-files/messages.fr.xlf.html" visibleRegion="generated-id"/>

當您變更可翻譯文字時，提取器會為該翻譯單位產生新的 ID。
在多數情況下，原始文字的變更也需要變更翻譯。
因此，使用新的 ID 可讓文字變更與翻譯保持同步。

然而，有些翻譯系統需要特定形式或語法作為 ID。
為了滿足該需求，請使用自訂 ID 來標記文字。
大多數開發人員不需要使用自訂 ID。
如果您想使用獨特的語法傳達額外的元資料，請使用自訂 ID。
額外的元資料可能包括文字出現的程式庫、元件或應用程式區域。

若要在 `i18n` 屬性或 [`$localize`][AioApiLocalizeInitLocalize] 標記訊息字串中指定自訂 ID，請使用 `@@` 前綴。
以下範例在標題元素中定義 `introductionHeader` 自訂 ID。

<docs-code header="app/app.component.html" path="adev/src/content/examples/i18n/doc-files/app.component.html" visibleRegion="i18n-attribute-solo-id"/>

以下範例為變數定義 `introductionHeader` 自訂 ID。

<!--todo: 替換成程式碼範例 -->

<docs-code language="typescript">

variableText1 = &dollar;localize `:&commat;&commat;introductionHeader:Hello i18n!`;

</docs-code>

當您指定自訂 ID 時，提取器會產生具有自訂 ID 的翻譯單元。

<docs-code header="messages.fr.xlf.html" path="adev/src/content/examples/i18n/doc-files/messages.fr.xlf.html" visibleRegion="custom-id"/>

如果你更改文字，則擷取器不會變更 ID。
因此，你不必執行額外步驟來更新翻譯。
使用自訂 ID 的缺點是，如果你更改文字，則翻譯可能會與新變更的原始文字不同步。

## 使用具有說明的客製化 ID

使用自定義 ID 搭配說明和意義，進一步協助翻譯人員。

以下範例包含說明，後面接著自訂 ID。

<docs-code header="app/app.component.html" path="adev/src/content/examples/i18n/doc-files/app.component.html" visibleRegion="i18n-attribute-id"/>

以下範例定義變數的 `introductionHeader` 自訂 ID 和說明。

<!--todo: 替換成程式碼範例 -->

<docs-code language="typescript">

variableText2 = &dollar;localize `:An introduction header for this sample&commat;&commat;introductionHeader:Hello i18n!`;

</docs-code>

以下範例新增一個意義。

<docs-code header="app/app.component.html" path="adev/src/content/examples/i18n/doc-files/app.component.html" visibleRegion="i18n-attribute-meaning-and-id"/>

以下範例為變數定義 `introductionHeader` 自訂 ID。

<!--todo: 替換成程式碼範例 -->

<docs-code language="typescript">

variableText3 = &dollar;localize `:site header|An introduction header for this sample&commat;&commat;introductionHeader:Hello i18n!`;

</docs-code>

### 定義唯一的自訂 ID

務必定義獨特的自定義 ID。
如果您對兩個不同的文字元素使用相同的 ID，則萃取工具只會萃取第一個元素，而 Angular 會使用翻譯取代兩個原始文字元素。

例如，在以下程式碼片段中，相同的 `myId` 自訂 ID 被定義給兩個不同的文字元素。

<docs-code header="app/app.component.html" path="adev/src/content/examples/i18n/doc-files/app.component.html" visibleRegion="i18n-duplicate-custom-id"/>

以下顯示法語翻譯。

<docs-code header="src/locale/messages.fr.xlf" path="adev/src/content/examples/i18n/doc-files/messages.fr.xlf.html" visibleRegion="i18n-duplicate-custom-id"/>

由於兩個元素都定義了相同的自訂 ID，因此現在兩個元素都使用相同的翻譯 \(`Bonjour`\)。

<docs-code path="adev/src/content/examples/i18n/doc-files/rendered-output.html"/>

{{ 無法處理文件最後的 LinkReferenceDefinitionGroup 部分，需手動更新！ }}
