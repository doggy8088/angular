# 以自訂 ID 管理標記的文字

Angular 擷取工具會針對下列每種情況，產生一個含有翻譯單元條目的檔案。

- 元件範本中的每個 `i18n` 屬性
- 元件程式碼中的每個 [`$localize`][ApiLocalizeInitLocalize] 標記訊息字串

如[意義如何控制文字擷取與合併][GuideI18nCommonPrepareHowMeaningsControlTextExtractionAndMerges]所述，Angular 會為每個翻譯單元指派唯一的 ID。

下列範例顯示具有唯一 ID 的翻譯單元。

<docs-code header="messages.fr.xlf" path="adev/src/content/examples/i18n/doc-files/messages.fr.xlf" region="generated-id"/>

當你變更可翻譯的文字時，擷取工具會為該翻譯單元產生新的 ID。
在大多數情況下，來源文字變更時，翻譯也需要跟著變更。
因此，使用新的 ID 能讓文字變更與翻譯保持同步。

不過，有些翻譯系統要求 ID 採用特定的形式或語法。
為了滿足這項要求，請使用自訂 ID 來標記文字。
大多數開發者不需要使用自訂 ID。
若你想用獨特的語法傳達額外的中繼資料，請使用自訂 ID。
額外的中繼資料可以包括文字出現的函式庫、元件，或應用程式中的區域。

若要在 `i18n` 屬性或 [`$localize`][ApiLocalizeInitLocalize] 標記訊息字串中指定自訂 ID，請使用 `@@` 前綴。
下列範例在標題元素中定義了 `introductionHeader` 自訂 ID。

<docs-code header="app.component.html" path="adev/src/content/examples/i18n/doc-files/app.component.html" region="i18n-attribute-solo-id"/>

下列範例為變數定義了 `introductionHeader` 自訂 ID。

```ts
variableText1 = $localize`:@@introductionHeader:Hello i18n!`;
```

指定自訂 ID 後，擷取工具會產生一個帶有該自訂 ID 的翻譯單元。

<docs-code header="messages.fr.xlf" path="adev/src/content/examples/i18n/doc-files/messages.fr.xlf" region="custom-id"/>

若你變更文字，擷取工具不會變更 ID。
如此一來，你就不必多花一個步驟去更新翻譯。
使用自訂 ID 的缺點是：若你變更文字，你的翻譯可能與變更後的來源文字不同步。

## 搭配說明使用自訂 ID

將自訂 ID 與說明、意義搭配使用，能進一步協助譯者。

下列範例先包含一段說明，接著是自訂 ID。

<docs-code header="app.component.html" path="adev/src/content/examples/i18n/doc-files/app.component.html" region="i18n-attribute-id"/>

下列範例為變數定義了 `introductionHeader` 自訂 ID 與說明。

```ts
variableText2 = $localize`:An introduction header for this sample@@introductionHeader:Hello i18n!`;
```

下列範例加入了意義。

<docs-code header="app.component.html" path="adev/src/content/examples/i18n/doc-files/app.component.html" region="i18n-attribute-meaning-and-id"/>

下列範例為變數定義了 `introductionHeader` 自訂 ID。

```ts
variableText3 = $localize`:site header|An introduction header for this sample@@introductionHeader:Hello i18n!`;
```

### 定義唯一的自訂 ID

請務必定義唯一的自訂 ID。
若你對兩個不同的文字元素使用相同 ID，擷取工具只會擷取第一個，而 Angular 會用該翻譯取代兩個原始文字元素。

例如，在下列程式碼片段中，兩個不同的文字元素定義了相同的 `myId` 自訂 ID。

<docs-code header="app.component.html" path="adev/src/content/examples/i18n/doc-files/app.component.html" region="i18n-duplicate-custom-id"/>

下列顯示法文翻譯。

<docs-code header="src/locale/messages.fr.xlf" path="adev/src/content/examples/i18n/doc-files/messages.fr.xlf" region="i18n-duplicate-custom-id"/>

兩個元素現在都使用相同的翻譯 \(`Bonjour`\)，因為兩者定義了相同的自訂 ID。

<docs-code path="adev/src/content/examples/i18n/doc-files/rendered-output.html"/>

[ApiLocalizeInitLocalize]: api/localize/init/$localize '$localize | init - localize - API | Angular'
[GuideI18nCommonPrepareHowMeaningsControlTextExtractionAndMerges]: guide/i18n/prepare#h1-example '意義如何控制文字擷取與合併 - 準備元件以供翻譯 | Angular'
