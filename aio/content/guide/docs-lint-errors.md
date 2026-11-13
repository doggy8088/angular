# 解決文件檢查工具訊息

本主題說明解決文件檢查工具產生的常見訊息的不同方式。

## 文件檢查工具訊息的結構

以下為文件檢查工具產生的一則訊息範例。

<div class="lightbox">

<img alt="Lint 訊息範例" src="generated/images/guide/docs-lint-errors/sample-lint-error.png">

</div>

文件檢查工具訊息包含下列元素。從最上面一行開始依序說明：

<!-- vale Angular.Angular_Spelling = NO -->
<!-- vale Angular.Google_Spacing = NO -->
<!-- vale Angular.Google_We = NO -->

*   嚴重程度。下列其中一個圖示表示訊息的嚴重程度：

    *   **錯誤**（圓圈中的紅色 `x`）錯誤必須在檔案合併前修正。

        <div class="lightbox">

        <img alt="文件風格錯誤圖示" src="generated/images/guide/docs-lint-errors/lint-error-icon.png">

        </div>

    *   **警告**（三角形中的黃色驚嘆號）警告應在檔案合併前修正。

        <div class="lightbox">

        <img alt="文件風格警告圖示" src="generated/images/guide/docs-lint-errors/lint-warn-icon.png">

        </div>

    *   **資訊**（圓圈中的藍色小寫 `i`）資訊訊息應在檔案合併前修正。

        <div class="lightbox">

        <img alt="文件風格資訊圖示" src="generated/images/guide/docs-lint-errors/lint-info-icon.png">

        </div>

*   風格規則訊息。本範例中的風格規則訊息為：

    <code-example language="none" hideCopy>

    Did you really mean 'sdfdsfsdfdfssd'? It wasn't found in our dictionary.

    </code-example>

*   風格參照。有些參照會連結至說明該規則的風格指南主題。本範例中的風格參照為：

    <code-example language="none" hideCopy>

    Vale(Angular.Angular_Spelling)

    </code-example>

*   文件中問題文字的位置，以原始碼行與欄位盡可能精確標示。有些訊息可能沒有觸發訊息的文字的確切位置。本範例中的位置為：

    <code-example language="none" hideCopy>

    [Ln 8, Col 1]

    </code-example>

*   產生此訊息的風格測試定義檔案，並連結至該檔案。本範例中的風格測試定義為：

    <code-example language="none" hideCopy>

    Angular_Spelling.yml[Ln 1, Col 1]: View rule

    </code-example>

<!-- vale Angular.Google_We = YES -->
<!-- vale Angular.Google_Spacing = YES -->
<!-- vale Angular.Angular_Spelling = YES -->

## 改善文件的策略

這些訣竅能協助你改善文件並消除文件檢查工具訊息。

### 參閱風格指南

檢查工具會依據這些風格指南中的風格進行測試。大多數風格測試都包含連結，可前往這些文件中的相關章節取得更多資訊。

*   [Angular 文件風格指南][AioGuideDocsStyleGuide]
*   [Google 開發者文件風格指南][GoogleDevelopersStyle]

<div class="alert is-helpful">

風格指南中提到的風格並非每一項都有測試。
風格指南與風格測試都可能會改變。

</div>

### 拆分長句

一般來說，較短的句子比長句更容易閱讀。當你試圖一次表達太多內容時，就會出現長句。長句以及括號、分號或被標示為 `too-wordy` 的用詞，通常都需要重新思考並改寫。

考慮重組長句，將其中個別的想法拆成不同的句子或項目符號。

### 使用清單與表格

含有逗號分隔清單的句子，若以項目符號清單或表格呈現可能會更清楚。

考慮將句子中以逗號分隔的項目清單改為項目符號清單，讓這些清單項目更容易閱讀。

### 使用更常見的用詞

較短且較常見的用詞一般比長詞更容易閱讀。這並不表示你要刻意遷就讀者。技術文件仍應精確。Angular 文件由世界各地許多人閱讀，應使用最多人能理解的語言。

如果你認為某個特定術語雖然被標示為不常見，但仍有必要使用，請試著附上該術語的簡短說明。另外，也請試著在其首次出現處補充一些背景脈絡。

將術語連結至其他章節或主題也是一種選擇，但使用前請先考慮這對讀者造成的干擾。如果你迫使讀者為了一個定義前往另一個頁面，他們可能會失去對目前主題與主要目標的專注。

### 使用更少的文字

如果你能刪掉一個詞而不失去句子的意思，那就刪掉它。

刪減文字常見的適用處，是含有兩個或三個以上項目的範例清單。在將這些項目放入項目符號清單之前，請考慮是否只要其中一項就能傳達想要的意思。另一種選擇是以一個能描述清單中所有元素的單一術語來取代整份項目清單。

## 關於特定文件檢查工具訊息的更多說明

大多數文件檢查工具訊息都不言自明，並附有補充文件的連結。有些訊息指出文件可能需要多加思考的部分。下列類型的訊息經常出現在應該重新思考並改寫的文字範圍中，以改善文字並消除訊息。

### 某個詞被標示為 `too-wordy` 或應以其他詞取代

一般來說，技術文件應使用簡單且一致的詞彙，才能讓廣大的讀者理解。觸發此訊息的用詞，通常都有更簡單的方式來表達相同的意思。

<!-- vale Angular.Google_Spacing = NO -->
<!-- vale Angular.Google_Headings = NO -->
<!-- vale Angular.Google_Ellipses = NO -->
<!-- vale Angular.WriteGood_TooWordy = NO -->

<!-- markdownlint-disable-file MD026 -->

#### Angular.WriteGood_TooWordy - 看看你是否能改寫這個句子……

<!-- vale Angular.WriteGood_TooWordy = YES -->
<!-- vale Angular.Google_Ellipses = YES -->
<!-- vale Angular.Google_Headings = YES -->
<!-- vale Angular.Google_Spacing = YES -->

此風格測試找出的用詞通常可以替換為更簡單的詞。如果無法替換，含有這些詞的句子應修改為更簡單的語言，並避免使用訊息中指出的詞。

下表列出此類訊息偵測到的一些常見用詞，以及可嘗試用來取代的更簡單用詞。

<!-- vale Angular.WriteGood_TooWordy = NO -->

| `Too-wordy` 用詞 | 較簡單的替代詞 |
|:-- |:-- |
| `accelerate` | `speed up` |
| `accomplish` | `perform` or `finish` |
| `acquire` | `get` |
| `additional` | `more` |
| `adjustment` | `change` |
| `advantageous` | `beneficial` |
| `consequently` | `as a result` |
| `designate` | `assign` |
| `equivalent` | `the same` |
| `exclusively` | `only` |
| `for the most part` | `generally` |
| `have a tendency to` | `tend to` |
| `in addition` | `furthermore` |
| `modify` | `change` or `update` |
| `monitor` | `observe` |
| `necessitate` | `require` |
| `one particular` | `one` |
| `point in time` | `moment` |
| `portion` | `part` |
| `similar to` | `like` |
| `validate` | `verify` |
| `whether or not` | `whether` |

<!-- vale Angular.WriteGood_TooWordy = YES -->

<!-- vale Angular.Google_Headings = NO -->

#### `WordList` 訊息

<!-- vale Angular.Google_Headings = YES -->

這些風格測試針對偵測到的用詞所發出的訊息，通常會建議更好的替代詞。雖然你使用的詞可能可以理解，但它最可能因為下列其中一個原因而觸發此訊息：

*   建議的用詞在螢幕閱讀器情境下效果較好
*   你使用的詞可能會引起讀者的不快
*   建議的詞更簡單、更短，或讓更多人更容易理解
*   你使用的詞還有其他可能的寫法。建議的詞是為了保持一致而應在文件中使用的寫法。

<!-- vale Angular.Angular_Spelling = NO -->

### `Proselint` 訊息

Proselint 風格測試會檢查屬於行話或可能冒犯某些人的用詞。

<!-- vale Angular.Angular_Spelling = YES -->

請改寫文字，以更具包容性的語言取代行話或冒犯性語言。

### `Starting a sentence` 訊息

有些詞，例如 *so* 和 *there is/are*，在句首並非必要。以此訊息指出的詞開頭的句子，通常可以改寫去掉這些開頭，讓句子更短、更簡單、更清楚。

### 陳腔濫調

陳腔濫調應以更直白的文字取代。

陳腔濫調會讓不懂英文的人難以理解文件。當陳腔濫調由 Google 翻譯等線上工具翻譯時，可能會產生令人困惑的結果。

## 如果其他方法都不行

風格規則一般會引導你寫出更清楚的內容，但有時你可能需要打破規則。如果你認為文字的最佳選擇與檢查工具相衝突，請將該文字標示為檢查例外。

文件檢查工具只檢查以文字形式呈現的內容，不測試以程式碼格式標示的文字。誤報的常見來源之一，是未以程式碼格式標示的程式碼參照。

如果你使用這些例外，請將排除在分析之外的文字量限制在最少的行數。

必要時，你可以將這些例外套用至你的內容。

1.  **一般例外**

一般例外可讓你將指定的文字排除在所有檢查測試之外。

若要套用一般例外，請以本範例所示的 HTML `comment` 元素包住你不希望檢查工具測試的文字。

    <code-example format="html" language="html">

    &lt;!-- vale off --&gt;

    Text the linter does not check for any style problem.

    &lt;!-- vale on --&gt;

    </code-example>

請務必在每個註解前後各留一個空行。

1.  **風格例外**

風格例外可讓你將文字排除在個別風格測試之外。

若要套用風格例外，請以這些 HTML `comment` 元素包住你不希望檢查工具測試的文字。在這些註解之間，檢查工具會忽略註解中的風格測試，但仍會測試其他所有正在使用的風格。

    <code-example format="html" language="html">

    &lt;!-- vale Style.Rule = NO --&gt;
    &lt;!-- vale Style.Rule = YES --&gt;

    </code-example>

請將註解中的 `Style.Rule` 替換為 IDE 中顯示的問題訊息裡的風格規則參照。例如，假設你收到這則問題訊息，而你想使用它指出有問題的詞。

    <code-example format="html" language="html">

    Did you really mean 'inlines'?  It was not found in our dictionary. Vale(Angular.Angular_Spelling) [Ln 24, Col 59]
    Angular_Spelling.yml[Ln 1, Col 1]: View rule

    </code-example>

此訊息的 `Style.Rule` 是括號內的文字，在本例中為 `Angular.Angular_Spelling`。若要關閉該風格測試，請使用本範例所示的註解。

    <code-example format="html" language="html">

    &lt;!-- vale Angular.Angular_Spelling = NO --&gt;

    'inlines' does not display a problem because this text is not spell-checked.
    Remember that the linter does not check any spelling in this block of text.
    The linter continues to test all other style rules.

    &lt;!-- vale Angular.Angular_Spelling = YES --&gt;

    </code-example>

<!-- links -->

[AioGuideDocsStyleGuide]: https://angular.io/guide/docs-style-guide "Angular 文件風格指南 | Angular"

<!-- external links -->

[GoogleDevelopersStyle]: https://developers.google.com/style "關於本指南 | Google 開發者文件風格指南 | Google Developers"

<!-- end links -->

@reviewed 2022-10-12
