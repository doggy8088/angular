# 準備元件以進行翻譯

為翻譯專案做準備，請完成以下動作。

* 使用 `i18n` 屬性來標記元件範本中的文字
* 使用 `i18n-` 屬性來標記元件範本中的屬性文字字串
* 使用 `$localize` 標記訊息字串來標記元件程式碼中的文字字串

## 標記元件範本中的文字

在元件範本中，i18n 元數據是 `i18n` 屬性的值。

<docs-code language="html">
&lt;element i18n="{i18n_metadata}"&gt;{string_to_translate}&lt;/element&gt;
</docs-code>

使用 `i18n` 屬性來標記元件範本中要翻譯的靜態文字訊息。
將它放在包含要翻譯的固定文字的每個元素標籤上。

HELPFUL: `i18n` 屬性是 Angular 工具和編譯器識別的客製屬性。

### `i18n` 範例

以下 `<h1>` 標籤顯示簡單的英文問候語，「Hello i18n!」

<docs-code header="src/app/app.component.html" path="adev/src/content/examples/i18n/doc-files/app.component.html" visibleRegion="greeting"/>

要標記要翻譯的問候語，請將 `i18n` 屬性新增到 `<h1>` 標籤。

<docs-code header="src/app/app.component.html" path="adev/src/content/examples/i18n/doc-files/app.component.html" visibleRegion="i18n-attribute"/>

### 在沒有 HTML 元素的情況下翻譯內嵌文字

使用 `<ng-container>` 元素來將翻譯行為與特定文字關聯，而不改變文字的顯示方式。

HELPFUL：每個 HTML 元素都會建立一個新的 DOM 元素。
若要避免建立新的 DOM 元素，請將文字包在 `<ng-container>` 元素內。
以下範例顯示 `<ng-container>` 元素轉換成未顯示的 HTML 註解。

<docs-code path="adev/src/content/examples/i18n/src/app/app.component.html" visibleRegion="i18n-ng-container"/>

## 標記元素屬性以利翻譯

在元件範本中，`i18n-{attribute_name}` 屬性的值是 i18n 元資料。

<docs-code language="html">
&lt;element i18n-{attribute_name}="{i18n_metadata}" {attribute_name}="{attribute_value}" /&gt;
</docs-code>

HTML 元素的屬性包含應與元件範本中顯示文字的其他部分一起翻譯的文字。

使用任何元素的任何屬性中的 `i18n-{attribute_name}` 並將 `{attribute_name}` 替換為屬性的名稱。
使用下列語法來指定意義、說明和自訂 ID。

<!--todo: 用 docs-code 取代 -->

<docs-code language="html">
i18n-{attribute_name}="{meaning}|{description}&commat;&commat;{id}"
</docs-code>

### `i18n-title` 範例

若要翻譯圖片的標題，請檢閱此範例。
以下範例顯示具有 `title` 屬性的圖片。

<docs-code header="src/app/app.component.html" path="adev/src/content/examples/i18n/doc-files/app.component.html" visibleRegion="i18n-title"/>

若要標記標題屬性以進行翻譯，請完成下列動作。

1. 新增 `i18n-title` 屬性

    以下範例顯示如何透過新增 `i18n-title` 來標示 `img` 標籤上的 `title` 屬性。

    <docs-code header="src/app/app.component.html" path="adev/src/content/examples/i18n/src/app/app.component.html" visibleRegion="i18n-title-translate"/>

## 在元件程式碼中標記文字

在元件程式碼中，翻譯的原始文字和元資料以反引號 \(&#96;\) 字元包圍。

使用 [`$localize`][AioApiLocalizeInitLocalize] 標記訊息字串，以將程式碼中的字串標記為翻譯。

<!--todo: 用 docs-code 取代 -->

<docs-code language="typescript">
&dollar;localize `string_to_translate`;
</docs-code>

i18n 的元數據以冒號 \(`:`\) 字元包圍，並置於翻譯原始文字之前。

<!--todo: 用 docs-code 取代 -->

<docs-code language="typescript">
&dollar;localize `:{i18n_metadata}:string_to_translate`
</docs-code>

### 包含內插文字

在 [`$localize`][AioApiLocalizeInitLocalize] 標記訊息字串中包含 [插補](guide/templates/interpolation)。

<!--todo: 用 docs-code 取代 -->

<docs-code language="typescript">
&dollar;localize `string_to_translate &dollar;{variable_name}`;
</docs-code>

### 命名插值預留位置

<docs-code language="typescript">
&dollar;localize `string_to_translate &dollar;{variable_name}:placeholder_name:`;
</docs-code>

## 翻譯的 i18n 元數據

<!--todo: 用 docs-code 取代 -->

<docs-code language="html">
{meaning}|{description}&commat;&commat;{custom_id}
</docs-code>

以下參數提供背景和額外資訊，以減少翻譯人員的混淆。

| 元數據參數 | 詳細資訊                                                                   |
|:---                |:---                                                                   |
| 自訂 ID          | 提供自訂識別碼                                                           |
| 說明              | 提供額外資訊或內容                                                       |
| 意義              | 提供特定內容中的文字含義或意圖                                       |

如需有關自訂 ID 的更多資訊，請參閱 [使用自訂 ID 管理標記文字][AioGuideI18nOptionalManageMarkedText]。

### 新增有用的描述及意義

要準確翻譯簡訊，請提供額外的資訊或背景給翻譯者。

將文字訊息的「說明」加入 `i18n` 屬性的值或 [`$localize`][AioApiLocalizeInitLocalize] 標記的訊息字串。

以下範例顯示 `i18n` 屬性的值。

<docs-code header="src/app/app.component.html" path="adev/src/content/examples/i18n/doc-files/app.component.html" visibleRegion="i18n-attribute-desc"/>

以下範例顯示標記訊息字串 [`$localize`][AioApiLocalizeInitLocalize] 的值，並附有說明。

<!--todo: 用 docs-code 取代 -->

<docs-code language="typescript">

&dollar;localize `:An introduction header for this sample:Hello i18n!`;

</docs-code>

翻譯人員可能還需要知道此特定應用程式語境中文字訊息的含義或目的，才能將其翻譯成與具有相同含義的其他文字相同的方式。
以 *含義* 開頭的 `i18n` 屬性值，並使用 `|` 字元將其與 *描述* 分隔：`{含義}|{描述}`。

#### `h1` 範例

例如，您可能想要指定 `<h1>` 標記是一個網站標題，您需要以相同的方式翻譯它，無論它用作標題還是參考於文本的另一部分。

以下範例顯示如何指定 `<h1>` 標籤必須翻譯為標題或在其他地方參照。

<docs-code header="src/app/app.component.html" path="adev/src/content/examples/i18n/doc-files/app.component.html" visibleRegion="i18n-attribute-meaning"/>

結果是任何標記為 `site header` 的文字，因為 *意義* 的翻譯方式完全相同。

以下程式碼範例顯示 [`$localize`][AioApiLocalizeInitLocalize] 標記訊息字串的值，並附有意義和說明。

<!--todo: 用 docs-code 取代 -->

<docs-code language="typescript">

&dollar;localize `:site header|An introduction header for this sample:Hello i18n!`;

</docs-code>

<docs-callout title="意義如何控制文字擷取及合併">

Angular 提取工具會為範本中的每個 `i18n` 屬性產生一個翻譯單元項目。
Angular 提取工具會根據 *意義* 和 *說明* 為每個翻譯單元指定一個唯一 ID。

HELPFUL: 有關 Angular 萃取工具的更多資訊，請參閱 [使用翻譯檔案](guide/i18n/translation-files)。

具有不同 *含義* 的相同文字元素會以不同的 ID 提取出來。
例如，如果文字「right」在兩個不同位置使用以下兩個定義，則文字會以不同的方式翻譯，然後以不同的翻譯項目合併回應用程式中。

* `correct` 如同「你說得對」
* `direction` 如同「向右轉」

如果相同的文字元素符合下列條件，則僅擷取一次文字元素並使用相同的 ID。

* 相同的意義或定義
* 不同的描述

那一個翻譯條目會合併回應用程式，無論相同的文字元素出現在哪裡。

</docs-callout>

## ICU 表達式

ICU 表達式可協助您在元件範本中標記交替文字，以符合條件。
ICU 表達式包含元件屬性、ICU 子句，以及用開大括弧 \(`{`\) 和閉大括弧 \(`}`\) 字元圍起來的案例陳述。

<!--todo: 用 docs-code 取代 -->

<docs-code language="html">

{ component_property, icu_clause, case_statements }

</docs-code>

元件屬性定義變數
ICU 子句定義條件文字的類型。

| ICU 子句                                                              | 詳細資訊                                                           |
|:---                                                                     |:---                                                               |
| [`plural`][AioGuideI18nCommonPrepareMarkPlurals]                        | 標記使用複數數字                                                   |
| [`select`][AioGuideI18nCommonPrepareMarkAlternatesAndNestedExpressions] | 標記基於定義的字串值選擇替代文字                               |

為了簡化翻譯，請將具有正規表達式的國際元件統一碼子句（ICU 子句）用於

HELPFUL: ICU 條款遵守 [CLDR 複數形式規則][UnicodeCldrIndexCldrSpecPluralRules] 中指定的 [ICU 訊息格式][GithubUnicodeOrgIcuUserguideFormatParseMessages]。

### 標記複數

不同的語言有不同的複數規則，這增加了翻譯的難度。
由於其他地區以不同的方式表達基數，你可能需要設定與英文不一致的複數類別。
使用 `plural` 子句來標記可能無法逐字翻譯成有意義的表達式。

<!--todo: 用 docs-code 取代 -->

<docs-code language="html">

{ component_property, plural, pluralization_categories }

</docs-code>

在複數類別之後，輸入預設文字\(英文\)，並以左大括號 \(`{`\) 和右大括號 \(`}`\) 字元括住。

<!--todo: 用 docs-code 取代 -->

<docs-code language="html">

pluralization_category { }

</docs-code>

以下複數形式類別適用於英文，並可能根據語言環境而有所變更。

| 複數型別 | 詳細資料 | 範例 |
|:--- |:--- |:--- |
| `zero` | 數量為零 | `=0 { }` <br /> `zero { }` |
| `one` | 數量為 1 | `=1 { }` <br /> `one { }` |
| `two` | 數量為 2 | `=2 { }` <br /> `two { }` |
| `few` | 數量為 2 或更多 | `few { }` |
| `many` | 數量為大量 | `many { }` |
| `other` | 預設數量 | `other { }` |

如果沒有任何複數形式類別符合，Angular 會使用 `other` 來符合遺漏類別的標準後設。

<!--todo: 用 docs-code 取代 -->

<docs-code language="html">

other { default_quantity }

</docs-code>

HELPFUL: 有關複數類別的更多資訊，請參閱 [UnicodeCldrIndexCldrSpecPluralRulesTocChoosingPluralCategoryNames][CLDR - Unicode Common Locale Data Repository][UnicodeCldrMain] 中的 [選擇複數類別名稱]。

<docs-callout header='背景：有些地區可能不支援某些複數化類別'>

許多地區設定不支援部分複數型態類別。
預設地區設定 \(`en-US`\) 使用非常簡單的 `plural()` 函式，而不支援 `few` 複數型態類別。
另一個具有簡單 `plural()` 函式的地區設定是 `es`。
以下程式碼範例顯示 [en-US `plural()`][GithubAngularAngularBlobEcffc3557fe1bff9718c01277498e877ca44588dPackagesCoreSrcI18nLocaleEnTsL14L18] 函式。

<docs-code path="adev/src/content/examples/i18n/doc-files/locale_plural_function.ts" class="no-box" hideCopy/>

`plural()` 函式僅回傳 1（`one`）或 5（`other`）。
`few` 類別從不匹配。

</docs-callout>

#### `minutes` 範例

如果您想顯示以下句子，其中 `x` 是數字。

<!--todo: replace output docs-code with screen capture image --->

<docs-code language="html">

updated x minutes ago

</docs-code>

而且您還想根據 `x` 的基數顯示以下短語。

<!--todo: replace output docs-code with screen capture image --->

<docs-code language="html">

updated just now

</docs-code>

<!--todo: replace output docs-code with screen capture image --->

<docs-code language="html">

updated one minute ago

</docs-code>

使用 HTML 標記和 [內插法](guide/templates/interpolation)。
以下程式碼範例顯示如何使用 `plural` 子句在 `<span>` 元素中表達前三個情況。

<docs-code header="src/app/app.component.html" path="adev/src/content/examples/i18n/src/app/app.component.html" visibleRegion="i18n-plural"/>

檢閱先前程式範例中的以下詳細資料。

| 參數                        | 詳細資料 |
|:---                               |:---    |
| `minutes`                         | 第一個參數指定元件屬性為 `minutes`，並決定分鐘數。               |
| `plural`                          | 第二個參數指定 ICU 子句為 `plural`。                                                            |
| `=0 {just now}`                   | 對於零分鐘，複數形式類別為 `=0`。值為 `just now`。                                        |
| `=1 {one minute}`                 | 對於一分鐘，複數形式類別為 `=1`。值為 `one minute`。                                        |
| `other {{{minutes}} minutes ago}` | 對於任何不匹配的基數，預設複數形式類別為 `other`。值為 `{{minutes}} minutes ago`。 |

`{{minutes}}` 是 [插入法](guide/templates/interpolation)。

### 標記替換和巢狀表達式

`select` 子句根據您定義的字串值標記替代文字的選項。

<!--todo: 用 docs-code 取代 -->

<docs-code language="html">

{ component_property, select, selection_categories }

</docs-code>

Translate all of the alternates to display alternate text based on the value of a variable.

翻譯所有替換文字以根據變數值顯示替換文字。

在選取類別後，輸入以開括號 \(`{`\) 和閉括號 \(`}`\) 字元包圍的文字 \(英文\)。

<!--todo: 用 docs-code 取代 -->

<docs-code language="html">

selection_category { text }

</docs-code>

不同的地區具有不同的語法結構，這增加了翻譯的難度。
使用 HTML 標記。
如果沒有任何選項類別相符，Angular 會使用 `other` 來比對缺少類別的標準後備。

<!--todo: 用 docs-code 取代 -->

<docs-code language="html">

other { default_value }

</docs-code>

#### `gender` 範例

如果您想以英文顯示以下詞組。

<!--todo: replace output docs-code with screen capture image --->

<docs-code language="html">

The author is other

</docs-code>

並且你還想要根據元件的 `gender` 屬性來顯示以下短語。

<!--todo: replace output docs-code with screen capture image --->

<docs-code language="html">

The author is female

</docs-code>

<!--todo: replace output docs-code with screen capture image --->

<docs-code language="html">

The author is male

</docs-code>

以下程式碼範例顯示如何繫結元件的 `gender` 屬性，並使用 `select` 子句在 `<span>` 元素中表達前述三種情況。

`gender` 屬性會將輸出繫結到下列字串值。

| 值  | 英文值 |
|:---    |:---           |
| 女性 | `female`      |
| 男性   | `male`        |
| 其他  | `other`       |

`select` 子句將值映射到適當的翻譯。
以下程式碼範例顯示與 `select` 子句一起使用的 `gender` 屬性。

<docs-code header="src/app/app.component.html" path="adev/src/content/examples/i18n/src/app/app.component.html" visibleRegion="i18n-select"/>

#### `gender` 和 `minutes` 範例

結合不同的子句，例如 `plural` 子句和 `select` 子句。
以下程式碼範例顯示基於 `gender` 和 `minutes` 範例的巢狀子句。

<docs-code header="src/app/app.component.html" path="adev/src/content/examples/i18n/src/app/app.component.html" visibleRegion="i18n-nested"/>

## 接下來

<docs-pill-row>
  <docs-pill href="guide/i18n/translation-files" title="使用翻譯檔案"/>
</docs-pill-row>

{{ 無法處理文件最後的 LinkReferenceDefinitionGroup 部分，需手動更新！ }}
