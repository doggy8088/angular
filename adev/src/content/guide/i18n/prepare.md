# 準備元件以供翻譯

若要準備你的專案以供翻譯，請完成下列動作。

- 使用 `i18n` 屬性標記元件範本中的文字
- 使用 `i18n-` 屬性標記元件範本中的屬性文字字串
- 使用 `$localize` 標記訊息字串標記元件程式碼中的文字字串

## 標記元件範本中的文字 {#mark-text-in-component-template}

在元件範本中，i18n 中繼資料就是 `i18n` 屬性的值。

<docs-code language="html">
<element i18n="{i18n_metadata}">{string_to_translate}</element>
</docs-code>

使用 `i18n` 屬性，在元件範本中標記要翻譯的靜態文字訊息。
將它放在每個包含要翻譯的固定文字的元素標籤上。

HELPFUL: `i18n` 屬性是 Angular 工具與編譯器能辨識的自訂屬性。

### `i18n` 範例

下列 `<h1>` 標籤顯示一句簡單的英文問候語「Hello i18n!」。

<docs-code header="src/app/app.component.html" path="adev/src/content/examples/i18n/doc-files/app.component.html" visibleRegion="greeting"/>

若要標記這句問候語以供翻譯，請將 `i18n` 屬性加入 `<h1>` 標籤。

<docs-code header="src/app/app.component.html" path="adev/src/content/examples/i18n/doc-files/app.component.html" visibleRegion="i18n-attribute"/>

### 搭配條件陳述式使用 `i18n`

下列 `<div>` 標籤會依切換狀態，將翻譯後的文字顯示為 `div` 內容與 `aria-label` 的一部分

<docs-code-multifile>
    <docs-code header="src/app/app.component.html" path="adev/src/content/examples/i18n/src/app/app.component.html"  visibleRegion="i18n-conditional"/>
    <docs-code header="src/app/app.component.ts" path="adev/src/content/examples/i18n/src/app/app.component.ts" visibleLines="[[14,21],[33,37]]"/>
</docs-code-multifile>

### 翻譯沒有 HTML 元素的行內文字

使用 `<ng-container>` 元素，為特定文字關聯翻譯行為，同時不改變文字的顯示方式。

HELPFUL: 每個 HTML 元素都會建立一個新的 DOM 元素。
若要避免建立新的 DOM 元素，請將文字包在 `<ng-container>` 元素中。
下列範例顯示 `<ng-container>` 元素被轉換為不顯示的 HTML 註解。

<docs-code path="adev/src/content/examples/i18n/src/app/app.component.html" visibleRegion="i18n-ng-container"/>

## 標記元素屬性以供翻譯

在元件範本中，i18n 中繼資料就是 `i18n-{attribute_name}` 屬性的值。

<docs-code language="html">
<element i18n-{attribute_name}="{i18n_metadata}" {attribute_name}="{attribute_value}" />
</docs-code>

HTML 元素的屬性包含一些文字，應該與元件範本中其餘顯示的文字一起翻譯。

將 `i18n-{attribute_name}` 用在任何元素的任何屬性上，並將 `{attribute_name}` 換成該屬性的名稱。
使用下列語法指派意義、說明與自訂 ID。

<!--todo: replace with docs-code -->

<docs-code language="html">
i18n-{attribute_name}="{meaning}|{description}@@{id}"
</docs-code>

### `i18n-title` 範例

若要翻譯圖片的標題，請看這個範例。
下列範例顯示一張帶有 `title` 屬性的圖片。

<docs-code header="src/app/app.component.html" path="adev/src/content/examples/i18n/doc-files/app.component.html" visibleRegion="i18n-title"/>

若要標記 title 屬性以供翻譯，請完成下列動作。

1. 加入 `i18n-title` 屬性

   下列範例顯示如何加入 `i18n-title`，標記 `img` 標籤上的 `title` 屬性。

   <docs-code header="src/app/app.component.html" path="adev/src/content/examples/i18n/src/app/app.component.html" visibleRegion="i18n-title-translate"/>

## 標記元件程式碼中的文字

在元件程式碼中，翻譯來源文字與中繼資料被反引號 \(<code>&#96;</code>\) 字元包圍。

使用 [`$localize`][ApiLocalizeInitLocalize] 標記訊息字串，標記程式碼中要翻譯的字串。

<!--todo: replace with docs-code -->

<docs-code language="typescript">
$localize`string_to_translate`;
</docs-code>

i18n 中繼資料被冒號 \(`:`\) 字元包圍，並位於翻譯來源文字之前。

<!--todo: replace with docs-code -->

<docs-code language="typescript">
$localize`:{i18n_metadata}:string_to_translate`
</docs-code>

### 包含插值文字

在 [`$localize`][ApiLocalizeInitLocalize] 標記訊息字串中包含[插值](guide/templates/binding#render-dynamic-text-with-text-interpolation)。

<!--todo: replace with docs-code -->

<docs-code language="typescript">
$localize`string_to_translate ${variable_name}`;
</docs-code>

### 在程式碼中為插值預留位置命名

<docs-code language="typescript">
$localize`string_to_translate ${variable_name}:placeholder_name:`;
</docs-code>

### 翻譯的條件語法

<docs-code language="typescript">
return this.show ? $localize`Show Tabs` : $localize`Hide tabs`;
</docs-code>

## 供翻譯使用的 i18n 中繼資料

<!--todo: replace with docs-code -->

<docs-code language="html">
{meaning}|{description}@@{custom_id}
</docs-code>

下列參數提供上下文與額外資訊，減少譯者的混淆。

| 中繼資料參數 | 詳情                                                  |
| :----------------- | :-------------------------------------------------------------------- |
| 自訂 ID      | 提供自訂識別碼                                        |
| 說明         | 提供額外資訊或上下文                                  |
| 意義         | 提供文字在特定上下文中的意義或意圖                    |

關於自訂 ID 的更多資訊，請見[以自訂 ID 管理標記的文字][GuideI18nOptionalManageMarkedText]。

### 加入有幫助的說明與意義 {#add-helpful-descriptions-and-meanings}

若要正確翻譯文字訊息，請為譯者提供額外資訊或上下文。

將文字訊息的_說明_作為 `i18n` 屬性或 [`$localize`][ApiLocalizeInitLocalize] 標記訊息字串的值加入。

下列範例顯示 `i18n` 屬性的值。

<docs-code header="src/app/app.component.html" path="adev/src/content/examples/i18n/doc-files/app.component.html" visibleRegion="i18n-attribute-desc"/>

下列範例顯示帶有說明的 [`$localize`][ApiLocalizeInitLocalize] 標記訊息字串的值。

<!--todo: replace with docs-code -->

<docs-code language="typescript">

$localize`:An introduction header for this sample:Hello i18n!`;

</docs-code>

譯者也可能需要知道文字訊息在這個特定應用程式上下文中的意義或意圖，才能將它以與其他相同意義文字一致的方式翻譯。
讓 `i18n` 屬性值以_意義_開頭，並以 `|` 字元將它與_說明_分隔：`{meaning}|{description}`。

#### `h1` 範例 {#h1-example}

例如，你可能想指定 `<h1>` 標籤是網站標題，需要以相同方式翻譯，不論它是用作標題，還是在另一段文字中被參照。

下列範例顯示如何指定 `<h1>` 標籤必須翻譯為標題，或在其他地方被參照。

<docs-code header="src/app/app.component.html" path="adev/src/content/examples/i18n/doc-files/app.component.html" visibleRegion="i18n-attribute-meaning"/>

結果是任何標記了 `site header` 的文字，都會因為_意義_相同而被完全一致地翻譯。

下列程式碼範例顯示帶有意義與說明的 [`$localize`][ApiLocalizeInitLocalize] 標記訊息字串的值。

<!--todo: replace with docs-code -->

<docs-code language="typescript">

$localize`:site header|An introduction header for this sample:Hello i18n!`;

</docs-code>

<docs-callout title="意義如何控制文字擷取與合併">

Angular 擷取工具會為範本中的每個 `i18n` 屬性產生一個翻譯單元條目。
Angular 擷取工具會依據_意義_與_說明_，為每個翻譯單元指派唯一的 ID。

HELPFUL: 關於 Angular 擷取工具的更多資訊，請見[使用翻譯檔案](guide/i18n/translation-files)。

相同的文字元素若_意義_不同，會以不同的 ID 被擷取。
例如，若「right」這個詞在兩個不同位置使用下列兩種定義，它會被翻譯成不同結果，並以不同的翻譯條目合併回應用程式。

- `correct`，如「you are right」中的意思
- `direction`，如「turn right」中的意思

若相同文字元素符合下列條件，它們只會被擷取一次，並使用相同的 ID。

- 意義或定義相同
- 說明不同

那一筆翻譯條目會在相同文字元素出現的所有位置合併回應用程式。

</docs-callout>

## ICU 運算式

ICU 運算式能協助你在元件範本中標記符合條件的替代文字。
ICU 運算式包含一個元件屬性、一個 ICU 子句，以及被左大括號 \(`{`\) 與右大括號 \(`}`\) 字元包圍的 case 陳述式。

<!--todo: replace with docs-code -->

<docs-code language="html">

{ component_property, icu_clause, case_statements }

</docs-code>

元件屬性定義了變數。
ICU 子句定義了條件文字的型別。

| ICU 子句                                                             | 詳情                                        |
| :------------------------------------------------------------------- | :------------------------------------------------------------------ |
| [`plural`][GuideI18nCommonPrepareMarkPlurals]                        | 標記複數數量的使用                                                          |
| [`select`][GuideI18nCommonPrepareMarkAlternatesAndNestedExpressions] | 依你定義的字串值標記替代文字的選項 |

若要簡化翻譯，請將 International Components for Unicode 子句（ICU 子句）與正規運算式搭配使用。

HELPFUL: ICU 子句遵循 [CLDR 複數規則][UnicodeCldrIndexCldrSpecPluralRules] 中指定的 [ICU Message Format][GithubUnicodeOrgIcuUserguideFormatParseMessages]。

### 標記複數 {#mark-plurals}

不同語言有不同的複數規則，增加了翻譯的難度。
由於其他地區設定表達基數的方式不同，你可能需要設定與英文不一致的複數類別。
使用 `plural` 子句，標記逐字翻譯可能失去意義的運算式。

<!--todo: replace with docs-code -->

<docs-code language="html">

{ component_property, plural, pluralization_categories }

</docs-code>

在複數類別之後，輸入被左大括號 \(`{`\) 與右大括號 \(`}`\) 字元包圍的預設文字 \(英文\)。

<!--todo: replace with docs-code -->

<docs-code language="html">

pluralization_category { }

</docs-code>

下列複數類別可用於英文，並可能依地區設定而有所不同。

| 複數類別               | 詳情               | 範例                       |
| :--------------------- | :------------------------- | :------------------------- |
| `zero`                 | 數量為零           | `=0 { }` <br /> `zero { }` |
| `one`                  | 數量為 1              | `=1 { }` <br /> `one { }`  |
| `two`                  | 數量為 2              | `=2 { }` <br /> `two { }`  |
| `few`                  | 數量為 2 或更多      | `few { }`                  |
| `many`                 | 數量為很大的數 | `many { }`                 |
| `other`                | 預設數量       | `other { }`                |

若沒有任何複數類別相符，Angular 會使用 `other`，作為類別缺失時的標準備援。

<!--todo: replace with docs-code -->

<docs-code language="html">

other { default_quantity }

</docs-code>

HELPFUL: 關於複數類別的更多資訊，請見 [CLDR - Unicode Common Locale Data Repository][UnicodeCldrMain] 中的 [Choosing plural category names][UnicodeCldrIndexCldrSpecPluralRulesTocChoosingPluralCategoryNames]。

<docs-callout header='背景：有些地區設定不支援部分複數類別'>

許多地區設定不支援部分複數類別。
預設地區設定 \(`en-US`\) 使用的 `plural()` 函式非常簡單，不支援 `few` 複數類別。
另一個 `plural()` 函式同樣簡單的地區設定是 `es`。
下列程式碼範例顯示 [en-US 的 `plural()`][GithubAngularAngularBlobEcffc3557fe1bff9718c01277498e877ca44588dPackagesCoreSrcI18nLocaleEnTsL14L18] 函式。

<docs-code path="adev/src/content/examples/i18n/doc-files/locale_plural_function.ts" class="no-box" hideCopy/>

`plural()` 函式只會傳回 1 \(`one`\) 或 5 \(`other`\)。
`few` 類別永遠不會相符。

</docs-callout>

#### `minutes` 範例

若你想以英文顯示下列片語，其中 `x` 是一個數字。

<!--todo: replace output docs-code with screen capture image --->

<docs-code language="html">

updated x minutes ago

</docs-code>

而且你也想依 `x` 的基數顯示下列片語。

<!--todo: replace output docs-code with screen capture image --->

<docs-code language="html">

updated just now

</docs-code>

<!--todo: replace output docs-code with screen capture image --->

<docs-code language="html">

updated one minute ago

</docs-code>

使用 HTML 標記與[插值](guide/templates/binding#render-dynamic-text-with-text-interpolation)。
下列程式碼範例顯示如何使用 `plural` 子句，在 `<span>` 元素中表達前述三種情況。

<docs-code header="src/app/app.component.html" path="adev/src/content/examples/i18n/src/app/app.component.html" visibleRegion="i18n-plural"/>

請檢視上一個程式碼範例中的下列細節。

| 參數                              | 詳情                                                                                                                  |
| :-------------------------------- | :-------------------------------------------------------------------------------------------------------------------- |
| `minutes`                         | 第一個參數指定元件屬性為 `minutes`，並決定分鐘數。                                                                    |
| `plural`                          | 第二個參數指定 ICU 子句為 `plural`。                                                                                  |
| `=0 {just now}`                   | 分鐘數為零時，複數類別是 `=0`，值是 `just now`。                                                                      |
| `=1 {one minute}`                 | 分鐘數為一分鐘時，複數類別是 `=1`，值是 `one minute`。                                                                |
| `other {{{minutes}} minutes ago}` | 對任何未相符的基數，預設複數類別是 `other`，值是 `{{minutes}} minutes ago`。                                          |

`{{minutes}}` 是一種[插值](guide/templates/binding#render-dynamic-text-with-text-interpolation)。

### 標記替代項與巢狀運算式 {#mark-alternates-and-nested-expressions}

`select` 子句依你定義的字串值，標記替代文字的選項。

<!--todo: replace with docs-code -->

<docs-code language="html">

{ component_property, select, selection_categories }

</docs-code>

翻譯所有的替代項，依變數的值顯示替代文字。

在選取類別之後，輸入被左大括號 \(`{`\) 與右大括號 \(`}`\) 字元包圍的文字 \(英文\)。

<!--todo: replace with docs-code -->

<docs-code language="html">

selection_category { text }

</docs-code>

不同地區設定有不同的文法結構，增加了翻譯的難度。
使用 HTML 標記。
若沒有任何選取類別相符，Angular 會使用 `other`，作為類別缺失時的標準備援。

<!--todo: replace with docs-code -->

<docs-code language="html">

other { default_value }

</docs-code>

#### `gender` 範例

若你想以英文顯示下列片語。

<!--todo: replace output docs-code with screen capture image --->

<docs-code language="html">

The author is other

</docs-code>

而且你也想依元件的 `gender` 屬性顯示下列片語。

<!--todo: replace output docs-code with screen capture image --->

<docs-code language="html">

The author is female

</docs-code>

<!--todo: replace output docs-code with screen capture image --->

<docs-code language="html">

The author is male

</docs-code>

下列程式碼範例顯示如何繫結元件的 `gender` 屬性，並使用 `select` 子句在 `<span>` 元素中表達前述三種情況。

`gender` 屬性將輸出繫結至下列每個字串值。

| 值     | 英文值        |
| :----- | :------------ |
| female | `female`      |
| male   | `male`        |
| other  | `other`       |

`select` 子句將這些值對應到適當的翻譯。
下列程式碼範例顯示 `gender` 屬性搭配 select 子句的使用方式。

<docs-code header="src/app/app.component.html" path="adev/src/content/examples/i18n/src/app/app.component.html" visibleRegion="i18n-select"/>

#### `gender` 與 `minutes` 範例

將不同的子句組合在一起，例如 `plural` 與 `select` 子句。
下列程式碼範例顯示以 `gender` 與 `minutes` 範例為基礎的巢狀子句。

<docs-code header="src/app/app.component.html" path="adev/src/content/examples/i18n/src/app/app.component.html" visibleRegion="i18n-nested"/>

## 下一步

<docs-pill-row>
  <docs-pill href="guide/i18n/translation-files" title="使用翻譯檔案"/>
</docs-pill-row>


[ApiLocalizeInitLocalize]: api/localize/init/$localize '$localize | init - localize - API  | Angular'
[GuideI18nCommonPrepareMarkAlternatesAndNestedExpressions]: guide/i18n/prepare#mark-alternates-and-nested-expressions '標記替代項與巢狀運算式 - 準備元件以供翻譯 | Angular'
[GuideI18nCommonPrepareMarkPlurals]: guide/i18n/prepare#mark-plurals '標記複數 - 準備元件以供翻譯 | Angular'
[GuideI18nOptionalManageMarkedText]: guide/i18n/manage-marked-text '以自訂 ID 管理標記的文字 | Angular'
[GithubAngularAngularBlobEcffc3557fe1bff9718c01277498e877ca44588dPackagesCoreSrcI18nLocaleEnTsL14L18]: https://github.com/angular/angular/blob/ecffc3557fe1bff9718c01277498e877ca44588d/packages/core/src/i18n/locale_en.ts#L14-L18 'Line 14 to 18 - angular/packages/core/src/i18n/locale_en.ts | angular/angular | GitHub'
[GithubUnicodeOrgIcuUserguideFormatParseMessages]: https://unicode-org.github.io/icu/userguide/format_parse/messages 'ICU Message Format - ICU Documentation | Unicode | GitHub'
[UnicodeCldrMain]: https://cldr.unicode.org 'Unicode CLDR Project'
[UnicodeCldrIndexCldrSpecPluralRules]: http://cldr.unicode.org/index/cldr-spec/plural-rules 'Plural Rules | CLDR - Unicode Common Locale Data Repository | Unicode'
[UnicodeCldrIndexCldrSpecPluralRulesTocChoosingPluralCategoryNames]: http://cldr.unicode.org/index/cldr-spec/plural-rules#TOC-Choosing-Plural-Category-Names 'Choosing Plural Category Names - Plural Rules | CLDR - Unicode Common Locale Data Repository | Unicode'
