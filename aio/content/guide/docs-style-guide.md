# Angular 文件風格指南

本風格指南涵蓋撰寫 [angular.io 上的 Angular 文件](docs) 的標準。這些標準確保寫作風格、Markdown 慣例與程式碼片段的一致性。

## 先備知識

在為 Angular 文件做出貢獻之前，熟悉下列內容會很有幫助：

| 主題 | 詳細說明 |
|:---                  |:---     |
| `git` | 入門介紹請參閱 GitHub 的 [Git Handbook](https://guides.github.com/introduction/git-handbook) |
| GitHub | 入門介紹請參閱 GitHub 的 [Hello World](https://guides.github.com/activities/hello-world) |
| Markdown | 請參閱 GitHub 的 [Mastering Markdown](https://guides.github.com/features/mastering-markdown) |
| Angular 程式碼風格 | 請參閱 [Angular 風格指南](guide/styleguide "Angular Application Code Style Guide") |
| Google 寫作風格 | [Google 開發者文件風格指南](https://developers.google.com/style)是一份全面的資源，本 Angular 文件風格指南即以其為基礎 |

## Angular 文件的種類

Angular 文件的類別包括：

| Angular 文件類別 | 詳細說明 |
|:---                              |:---     |
| [指南](docs) | [angular.io 文件區](docs)中的大部分內容。指南會逐步帶領讀者完成工作以示範概念，且經常附有可實際運作的範例，包括 [入門](start)、[英雄之旅](tutorial)，以及關於 [表單](guide/forms-overview)、[依賴注入](guide/dependency-injection)與 [HttpClient](guide/http) 的頁面。社群貢獻者與 Angular 團隊成員以 [Markdown](https://daringfireball.net/projects/markdown/syntax "Markdown") 維護這些文件。 |
| [API 文件](api) | [Angular 應用程式介面（Application Programming Interface，簡稱 API）](api) 的參考文件。這些文件比指南更簡潔，可作為 Angular 功能的參考資料，對於已熟悉 Angular 概念的人特別有幫助。[angular.io](https://angular.io) 基礎架構會根據貢獻者編輯的原始碼與註解產生這些文件。 |
| [CLI 文件](cli) | [angular.io](https://angular.io) 基礎架構會根據 CLI 原始碼產生這些文件。 |

## Markdown 與 HTML

雖然 Angular 指南是 [Markdown](https://daringfireball.net/projects/markdown/syntax "Markdown") 檔案，但指南中有些章節會使用 HTML。

<div class="alert is-helpful">

若要在 Angular 指南中啟用 HTML，**務必**在每個開頭與結尾 HTML 標籤之後都留一個空行。

</div>

請注意下列範例中，開頭的 `<div>` 之後必須有一個空行：

<code-example format="html" language="html">

&lt;div class="alert is-helpful"&gt;

&ast;&ast;Always&ast;&ast; follow every opening and closing HTML tag with &ast;a blank line&ast;.

&lt;/div&gt;

</code-example>

在結尾的 HTML 標籤之前也留一個空行是慣例，但並非必要。

## 標題

每份指南文件都必須有標題，且標題應出現在頁面頂端。

標題以 Markdown 井號字元（`#`）開頭，瀏覽器會將其呈現為 `<h1>`。

<code-example format="html" language="html">

&num; Angular documentation style guide

</code-example>

| 標題指引 | 詳細說明 |
|:---                                                  |:---     |
| 一份文件只能有一個 `<h1>` | 標題文字應使用*句首大寫*，也就是只有第一個詞大寫，其他詞皆為小寫。像「Angular」這類一律大寫的技術術語例外。<code-example format="html" language="html"> &num; Deprecation policy in Angular </code-example> |
| 標題後面務必至少留一個空行 | 左側導覽中對應的文字使用*標題大小寫*，也就是第一個詞與所有主要詞都以大寫字母開頭。次要詞如「in」、「of」與「the」則使用小寫字母。你也可以縮短導覽標題以配合欄位寬度。 |

## 章節

一般文件都有章節。

所有章節標題皆使用*句首大寫*，也就是只有第一個詞大寫，其他詞皆為小寫。

**章節標題後面務必至少留一個空行。**

### 主要章節標題

通常有一或多個主要章節，而主要章節又可以再細分為次要章節。

主要章節標題以 Markdown `##` 字元開頭，瀏覽器會將其呈現為 `<h2>`。

主要章節標題後面接一個空行，再接該標題的內容，如下列範例所示：

<code-example format="html" language="html">

&num;&num; Main section heading

Content after a blank line.

</code-example>

### 次要章節標題

次要章節標題與主要標題相關，在文字上屬於該主要標題的範圍之內。

次要標題以 Markdown `###` 字元開頭，瀏覽器會將其呈現為 `<h3>`。

次要標題後面接一個空行，再接該標題的內容，如下列範例所示：

<code-example format="html" language="html">

&num;&num;&num; Secondary section heading

Content after a blank line.

</code-example>

### 其他章節標題

雖然你可以使用其他章節標題，但[目錄（TOC）](#目錄)產生器只會在頁面右側的目錄中顯示 `<h2>` 與 `<h3>` 標題。

<code-example format="html" language="html">

&num;&num;&num;&num; The TOC won't display this

Content after a blank line.

</code-example>

## 目錄

大多數頁面都會顯示目錄（TOC）。視窗較寬時，目錄出現在右側面板；視窗較窄時，目錄出現在頁面頂端附近的可摺疊區域。

你不需要手動建立自己的目錄，因為目錄產生器會根據頁面的 `<h2>` 與 `<h3>` 標題自動產生目錄。

若要將某個標題排除在目錄之外，請以帶有 'no-toc' 類別的 `<h2>` 或 `<h3>` 元素建立該標題。

<code-example format="html" language="html">

&lt;h3 class="no-toc"&gt;

This heading is not displayed in the TOC

&lt;/h3&gt;

</code-example>

你可以將標題寫成帶有 `no-toc` 類別的 `<h1>` 標籤，以關閉整頁的目錄產生功能。

<code-example format="html" language="html">

&lt;h1 class="no-toc"&gt;

A guide without a TOC

&lt;/h1&gt;

</code-example>

## 導覽

若要產生畫面頂端、左側與底部的導覽連結，請使用 JSON 設定檔 `content/navigation.json`。

<div class="alert is-helpful">

如果你有會導致導覽變更的想法，請先[提出問題](https://github.com/angular/angular/issues/new/choose)，讓 Angular 團隊與社群討論這項變更。

</div>

對於新的指南頁面，請編輯 `navigation.json` 中的 `SideNav` 節點。`SideNav` 節點是導覽節點的陣列，每個節點是單一文件的項目節點，或是帶有子節點的標頭節點。

找到你的頁面所屬的標頭。例如，描述 Angular 功能的指南頁面很可能是 `Fundamentals` 標頭的子節點。

<code-example format="json" language="json">

{
  "title": "Fundamentals",
  "tooltip": "The fundamentals of Angular",
  "children": [ &hellip; ]
}

</code-example>

標頭節點的子節點可以是項目節點或另一個標頭節點。如果你的指南頁面屬於某個子標頭，請在 JSON 中找到該子標頭。

如下列範例所示，將你的指南頁面的項目節點新增為適當標頭節點的子節點：

<code-example format="json" language="json">

{
  "url": "guide/docs-style-guide",
  "title": "Doc authors style guide",
  "tooltip": "Style guide for documentation authors.",
},

</code-example>

導覽節點具有下列屬性：

| 屬性 | 詳細說明 |
|:---        |:---     |
| `url` | 指南頁面的 URL，僅限項目節點。 |
| `title` | 側邊導覽中顯示的文字。 |
| `tooltip` | 讀者將滑鼠懸停在導覽連結上時出現的文字。 |
| `children` | 子節點的陣列，僅限標頭節點。 |
| `hidden` | 若此指南頁面不應顯示在導覽面板中，請定義並設為 `true`。 |

<div class="alert is-critical">

請勿透過指定標頭節點的 `url` 屬性，建立一個同時是標頭與項目節點的節點。

</div>

## 程式碼片段

[Angular.io](docs) 有一個自訂框架，可讓作者直接從可實際運作的範例應用程式納入程式碼片段，這些範例會在文件建置時自動接受測試。

除了可實際運作的程式碼片段之外，範例程式碼還可以包含終端機指令、TypeScript 或 HTML 片段，或整個程式碼檔案。

無論來源為何，文件檢視器都會將它們呈現為程式碼片段，可以是使用 [code-example](#code-example "code-example") 元件的個別片段，或是使用 [code-tabs](#程式碼分頁 "code-tabs") 元件的分頁集合。

<a id="code-example"></a>

### 何時使用程式碼字型

你可以使用 Markdown 反引號語法顯示最小的內嵌程式碼片段。當在句子中提及程式碼或檔案名稱時，請在術語兩側各使用一個反引號。以下是一些範例：

*   在 `app.component.ts` 中新增一個 `logger()` 方法。
*   `name` 屬性為 `Sally`。
*   將元件類別名稱加入 `declarations` 陣列。

Markdown 如下：

<code-example format="markdown" language="markdown">

&ast;   In the `app.component.ts`, add a `logger()` method.
&ast;   The &lt;code class="no-auto-link"&gt;item&lt;/code&gt; property is `true`.
&ast;   Add the component class name to the `declarations` array.

</code-example>

### 程式碼片段中的自動連結

在某些情況下，當你在術語前後加上反引號時，它可能會自動連結至 API 文件。如果你不希望該術語成為連結，請使用下列語法：

<code-example format="html" language="html">

The &lt;code class="no-auto-link"&gt;item&lt;/code&gt; property is &grave;true&grave;.

</code-example>

### 寫死的片段

理想情況下，你應該[從可實際運作的範例程式碼](#from-code-samples)取得程式碼片段，不過有時確實需要內嵌片段。

對於終端機輸入與輸出，請將內容放在 `<code-example>` 標籤之間，並將 language 屬性設為 `sh`，如本範例所示：

<code-example format="shell" language="shell">

npm start

</code-example>

<code-example format="html" language="html">

&lt;code-example language="shell"&gt;

npm start

&lt;/code-example&gt;

</code-example>

像這樣的內嵌寫死片段無法測試，因此本質上不可靠。本範例屬於少數預先核准的內嵌片段，包含命令殼層中的使用者輸入或某個處理程序的輸出。

在所有其他情況下，程式碼片段應由經過測試的程式碼範例自動產生。

對於假設性範例，例如 JSON 檔案中設定選項的說明，請使用帶有 `header` 屬性的 `<code-example>` 標籤來標示脈絡。

<a id="from-code-samples"></a>

### 可編譯的範例應用程式

Angular 文件的設計目標之一，是讓指南頁面的程式碼片段都是可實際運作的程式碼範例。

作者會直接從專為這些指南頁面撰寫的可實際運作範例應用程式中顯示程式碼片段，以達成此目標。

範例應用程式位於 `angular/angular` 儲存庫的 `content/examples` 目錄下的子資料夾中。範例資料夾的名稱通常與其支援的指南頁面相同。

<div class="alert is-helpful">

指南頁面可能沒有自己的範例程式碼。
它可能參照的是屬於其他頁面的範例。

</div>

Angular CI 流程會為每個 Angular PR 執行所有端對端測試。在每個範例的新版本與每個 Angular 的新版本之後，Angular 都會重新測試這些範例。

在可能的情況下，指南頁面上的每段程式碼都應衍生自程式碼範例檔案。你可以設定 `<code-example>` 屬性，告訴 Angular 文件引擎要顯示哪個程式碼檔案——或程式碼檔案的片段——。

<a id="display-whole-file"></a>

### 顯示整個程式碼檔案

你目前正在閱讀的這份 Angular 文件風格指南有自己的範例應用程式，位於 `content/examples/docs-style-guide` 資料夾。

下列 `<code-example>` 會顯示範例的 `app.module.ts`：

<code-example header="src/app/app.module.ts" path="docs-style-guide/src/app/app.module.ts"></code-example>

下列標記會產生該片段：

<code-example format="html" language="html">

&lt;code-example path="docs-style-guide/src/app/app.module.ts" header="src/app/app.module.ts"&gt;&lt;/code-example&gt;

</code-example>

`path` 屬性會指出片段的來源檔案，位於 `content/examples` 內的範例應用程式資料夾。在本範例中，該路徑為 `docs-style-guide/src/app/app.module.ts`。

標頭會告訴讀者在哪裡可以找到該檔案。依照慣例，請將 `header` 屬性設為該檔案在範例應用程式根資料夾內的位置。

除非另有註明，本頁的所有程式碼片段皆來自位於 `content/examples/docs-style-guide` 目錄的範例原始碼。

<div class="alert is-important">

如果 path 指出的檔案不存在，或是位於 [`.git-ignore` 檔案](https://github.com/angular/angular/blob/main/aio/content/examples/.gitignore)中，文件工具會回報錯誤。
大部分 `.js` 檔案都在 `.git-ignore` 中。

若要把被忽略的程式碼檔案包含在你的專案中並顯示在指南裡，請將它從 `.git-ignore` 移除。
如下更新 `content/examples/.gitignore`：

<code-example header="content/examples/.gitignore">

&num; my-guide
!my-guide/src/something.js
!my-guide/more-javascript*.js

</code-example>

</div>

<a id="region"></a>

### 顯示程式碼檔案的一部分

若要納入範例程式碼檔案中的一段程式碼片段，而非整個檔案，請使用 `<code-example>` 的 `region` 屬性。下列範例聚焦於 `AppModule` 類別及其 `@NgModule()` 詮釋資料：

<code-example header="src/app/app.module.ts"
  path="docs-style-guide/src/app/app.module.ts"

  region="class"></code-example>

若要呈現上述範例，Markdown 檔案中的 HTML 如下：

<code-example format="html" language="html">

&lt;code-example
  path="docs-style-guide/src/app/app.module.ts"
  header="src/app/app.module.ts"
  region="class"&gt;&lt;/code-example&gt;

</code-example>

`path` 指向該檔案，如同呈現[整個檔案](guide/docs-style-guide#display-whole-file)的範例一樣。`region` 屬性指定原始檔案中由開頭的 `#docregion` 與結尾的 `#enddocregion` 所界定的部分。

你可以在下方的原始檔案中看到名為 `class` 的 `#docregion`。請注意 `content/examples/docs-style-guide/src/app/app.module.ts` 中名稱為 `class` 的 `#docregion` 與 `#enddocregion` 註解行。

<code-example header="src/app/app.module.ts">

import { NgModule }      from '&commat;angular/core';
import { BrowserModule } from '&commat;angular/platform-browser';
import { FormsModule }   from '&commat;angular/forms';

import { AppComponent }  from './app.component';

// #docregion class
&commat;NgModule({
  imports:      [ BrowserModule, FormsModule ],
  declarations: [ AppComponent ],
  bootstrap:    [ AppComponent ]
})
export class AppModule { }
// #enddocregion class

</code-example>

開頭與結尾的 `#docregion` 行會將其間的任何程式碼行指定為包含在程式碼片段中。這就是為什麼 `class` `#docregion` 之外的 import 陳述式不在程式碼片段中的原因。

如需進一步瞭解如何準備供指南使用的範例應用程式檔案，請參閱[原始碼標記](#source-code-markup)。

### 程式碼片段選項

使用下列屬性指定 `<code-example>` 的輸出：

| 屬性 | 說明 |
|:---        |:---     |
| `path` | `content/examples` 資料夾中檔案的路徑。 |
| `header` | 程式碼清單的標頭，也就是程式碼片段的標題，可以包含路徑與額外資訊，例如該片段是否為節錄。 |
| `region` | 顯示具有該區域名稱的原始檔案片段；區域由原始檔案中的 `#docregion` 標記識別。請參閱[顯示程式碼片段](#region "Displaying a code snippet")。 |
| `linenums` | 值可以是 `true`、`false` 或 `number`。預設值為 `false`，表示瀏覽器不顯示行號。`number` 選項會從給定的值開始編排行號。例如，`linenums=4` 會將起始行號設為 4。 |
| `class` | 程式碼片段可以使用 `no-box` 與 `avoid` 這兩個 CSS 類別設定樣式。 |
| `hideCopy` | 隱藏複製按鈕。 |
| `language` | 原始碼語言，例如 `javascript`、`html`、`css`、`typescript`、`json` 或 `shell`。此屬性僅適用於寫死的範例。 |

### 顯示不佳的程式碼

有時你會想展示不夠理想的程式碼或設計範例，例如 [Angular 風格指南](guide/styleguide)中的 **avoid** 範例。由於讀者可能會將劣質程式碼的範例複製貼上到自己的應用程式中，請盡量減少使用這類程式碼。

在需要不可接受的範例時，你可以將 `class` 設為 `avoid`，或在來源檔案的檔案名稱中加入 `avoid` 一詞。將 `avoid` 一詞放入檔案名稱或路徑中，文件產生器會自動將 `avoid` 類別加入 `<code-example>`。這兩種選項都會以亮紅色框住程式碼片段，以吸引讀者的注意。

以下是 [Angular 風格指南](guide/styleguide#style-05-03 "Style 05-03: components as elements")中一個在路徑名稱中使用 `avoid` 一詞的「avoid」範例的標記：

<code-example format="html" language="html">

&lt;code-example
  header="app/heroes/hero-button/hero-button.component.ts"
  path="styleguide/src/05-03/app/heroes/shared/hero-button/hero-button.component.avoid.ts"
  region="example"&gt;&lt;/code-example&gt;

</code-example>

檔案名稱中含有「avoid」一詞，會使瀏覽器以紅色標頭與邊框呈現程式碼片段：

<code-example header="app/heroes/hero-button/hero-button.component.ts" path="styleguide/src/05-03/app/heroes/shared/hero-button/hero-button.component.avoid.ts" region="example"></code-example>

或者，HTML 也可以如下列所示包含 `avoid` 類別：

<code-example format="html" language="html">

&lt;code-example
   class="avoid"
   header="docs-style-guide/src/app/not-great.component.ts"
   path="docs-style-guide/src/app/not-great.component.ts"
  region="not-great"&gt;&lt;/code-example&gt;

</code-example>

明確套用 `avoid` 類別會產生相同的結果：紅色標頭與紅色邊框：

<code-example header="docs-style-guide/src/app/not-great.component.ts" path="docs-style-guide/src/app/not-great.component.ts" region="not-great" class="avoid"></code-example>

<a id="code-tabs"></a>

### 程式碼分頁

程式碼分頁顯示程式碼的方式與 `code-examples` 十分相似，額外的優點是可以在分頁介面中顯示多個程式碼範例。每個分頁都使用 `code-pane` 顯示程式碼。

#### `code-tabs` 屬性

*   `linenums`：值可以是 `true`、`false`，或表示起始行號的數字。
預設值為 `false`。

#### `code-pane` 屬性

| 屬性 | 說明 |
|:---        |:---     |
| `path` | `content/examples` 資料夾中的檔案 |
| `header` | 分頁標頭中顯示的內容 |
| `linenums` | 覆寫此特定窗格在 `code-tabs` 層級的 `linenums` 屬性。值可以是 `true`、`false`，或表示起始行號的數字。預設值為 `false`。 |

下列範例顯示多個程式碼分頁，每個分頁都有自己的標頭。它示範了在 `<code-tabs>` 與 `<code-pane>` 中顯示行號。

<code-tabs linenums="true">

  <code-pane
    header="app.component.html"
    path="docs-style-guide/src/app/app.component.html"></code-pane>
  <code-pane
    header="app.component.ts"
    path="docs-style-guide/src/app/app.component.ts"
    linenums="false"></code-pane>
  <code-pane
    header="app.component.css (heroes)"
    path="docs-style-guide/src/app/app.component.css"
    region="heroes"></code-pane>
    <code-pane header="hero-search/hero-search.component.html" path="toh-pt6/src/app/hero-search/hero-search.component.html"></code-pane>

</code-tabs>

在 `<code-tabs>` 上將 `linenums` 屬性設為 `true`，會明確為所有窗格啟用編號。然而，在第二個 `<code-pane>` 中將 `linenums` 屬性設為 `false`，則只會停用該窗格本身的行號。

<code-example format="html" language="html">

&lt;code-tabs linenums="true"&gt;
  &lt;code-pane
    header="app.component.html"
    path="docs-style-guide/src/app/app.component.html"&gt;
  &lt;/code-pane&gt;
  &lt;code-pane
    header="app.component.ts"
    path="docs-style-guide/src/app/app.component.ts"
    linenums="false"&gt;
  &lt;/code-pane&gt;
  &lt;code-pane
    header="app.component.css (heroes)"
    path="docs-style-guide/src/app/app.component.css"
    region="heroes"&gt;
  &lt;/code-pane&gt;
  &lt;code-pane
    header="package.json (scripts)"
    path="docs-style-guide/package.1.json"&gt;
  &lt;/code-pane&gt;
&lt;/code-tabs&gt;

</code-example>

<a id="source-code-markup"></a>

## 為程式碼片段準備原始碼

若要顯示 `<code-example>` 與 `<code-tabs>` 片段，請在範例原始碼檔案中加入程式碼片段標記。

<div class="alert is-helpful">

本頁的範例原始碼位於 `content/examples/docs-style-guide`，其中包含本節所述的每種程式碼片段標記的範例。

</div>

程式碼片段標記一律採用註解的形式。TypeScript 或 JavaScript 檔案的預設 `#docregion` 標記如下：

<code-example format="typescript" language="typescript">

// #docregion
&hellip; some TypeScript or JavaScript code &hellip;
// #enddocregion

</code-example>

<code-example format="html" language="html">

&lt;!-- #docregion --&gt;
&hellip; some HTML &hellip;
&lt;!-- #enddocregion --&gt;

</code-example>

<code-example format="css" language="css">

/* #docregion */
&hellip; some CSS &hellip;
/* #enddocregion */

</code-example>

文件產生流程會在文件檢視器、StackBlitz 與範例程式碼下載中顯示這些註解之前將其清除。

<div class="alert is-important">

由於 JSON 不允許使用註解，程式碼片段標記在 JSON 檔案中無法運作。
如需更多資訊，請參閱 [JSON 檔案](#json-檔案)一節。

</div>

### `#docregion`

在原始檔案中使用 `#docregion` 來標示供 `<code-example>` 或 `<code-tabs>` 元件使用的程式碼。

`#docregion` 註解會開始一個程式碼片段區域。該註解之後的每一行程式碼都屬於此區域，直到程式碼片段處理器遇到檔案結尾或結尾的 `#enddocregion` 為止。

下列 `src/main.ts` 是一個在檔案頂端只有一個 `#docregion` 的檔案範例。

<code-example header="src/main.ts" path="docs-style-guide/src/main.ts"></code-example>

因此，整個檔案都在 `<code-example>` 中。

### 為 `#docregion` 命名

若要顯示同一檔案中不同片段的多個片段，請如下列所示為每個片段指定自己的 `#docregion` 名稱，其中 `your-region-name` 是以連字號連接的小寫字串：

<code-example format="typescript" language="typescript">

// #docregion your-region-name
&hellip; some code &hellip;
// #enddocregion your-region-name

</code-example>

請如下列所示，在 `<code-example>` 或 `<code-pane>` 的 `region` 屬性中以名稱參照此區域：

<code-example format="html" language="html">

&lt;code-example
  path="your-example-app/src/app/your-file.ts"
  region="your-region-name"&gt;&lt;/code-example&gt;

</code-example>

由於沒有名稱的 `#docregion` 是預設區域，因此在參照預設的 `#docregion` 時，你不需要設定 `region` 屬性。

### 巢狀 `#docregion`

如下列巢狀 `inner-region` 範例所示，將一個 `#docregion` 放在另一個 `#docregion` 之中：

<code-example format="typescript" language="typescript">

// #docregion
&hellip; some code &hellip;
// #docregion inner-region
&hellip; more code &hellip;
// #enddocregion inner-region
&hellip; yet more code &hellip;
/// #enddocregion

</code-example>

### 合併程式碼片段

透過定義多個具有相同區域名稱的 `#docregion` 區段，將同一檔案中的數個片段合併為單一程式碼片段。下列範例定義了兩個巢狀的 `#docregion` 區段。

內部區域 `class-skeleton` 出現了兩次——一次用來擷取開啟類別定義的程式碼，第二次用來擷取關閉類別定義的程式碼。

<code-example format="typescript" header="src/app/app.component.ts" language="typescript">

// #docplaster
&hellip;
// #docregion class, class-skeleton
export class AppComponent {
// #enddocregion class-skeleton
  title = 'Authors Style Guide Sample';
  heroes = HEROES;
  selectedHero: Hero;

  onSelect(hero: Hero): void {
    this.selectedHero = hero;
  }
// #docregion class-skeleton
}
// #enddocregion class, class-skeleton

</code-example>

`#docplaster` 標記會告訴處理器要使用什麼文字字串——也就是「plaster」——來將每個片段連接成單一片段。請將「plaster」文字放在同一行。例如，`#docplaster ---` 會使用 `---` 作為「plaster」文字。在前一個檔案的情況下，「plaster」文字是空的，因此每個片段之間不會有任何內容。

如果沒有 `#docplaster`，處理器會在片段之間插入預設的 plaster——也就是省略號註解——。

以下是兩個對應的程式碼片段，可並排比較。

<code-tabs>
    <code-pane header="app.component.ts (class #docregion)" path="docs-style-guide/src/app/app.component.ts" region="class"></code-pane>
    <code-pane header="app.component.ts (class-skeleton #docregion)" path="docs-style-guide/src/app/app.component.ts" region="class-skeleton"></code-pane>
</code-tabs>

上述範例也示範了一個 `#docregion` 或 `#enddocregion` 註解可以指定兩個區域名稱，這是在同一行程式碼上開始或停止多個區域的便利方式。或者，你也可以如下列範例所示，將這些註解放在不同的行上：

<code-example header="src/app/app.component.ts">

// #docplaster
&hellip;
// #docregion class
// #docregion class-skeleton
export class AppComponent {
// #enddocregion class-skeleton
  title = 'Authors Style Guide Sample';
  heroes = HEROES;
  selectedHero: Hero;

  onSelect(hero: Hero): void {
    this.selectedHero = hero;
  }
// #docregion class-skeleton
}
// #enddocregion class
// #enddocregion class-skeleton

</code-example>

### JSON 檔案

`<code-example>` 元件無法顯示 JSON 檔案的一部分，因為 JSON 禁止使用註解。不過，你可以透過在 `<code-example>` 的 `src` 屬性中參照整個 JSON 檔案來顯示它。

對於大型 JSON 檔案，你可以將感興趣的節點複製到 Markdown 反引號中，但由於這樣很容易不小心產生無效的 JSON，請考慮建立一個含有你想顯示的片段的 JSON 部分檔案。

你無法測試部分檔案，也無法在應用程式中使用它，但至少你的編輯器可以確認它在語法上正確。你也可以將部分檔案存放在原始檔案旁邊，這樣作者比較可能記得保持兩者同步。

以下範例將 `package.json` 中的某些指令碼節錄到名為 `package.1.json` 的部分檔案中。

<code-example header="package.json (selected scripts)" path="docs-style-guide/package.1.json"></code-example>

<code-example format="html" language="html">

&lt;code-example header="package.json (selected scripts)" path="docs-style-guide/package.1.json"&gt;&lt;/code-example&gt;

</code-example>

在某些情況下，使用完整檔案的名稱比使用部分檔案的名稱更合適。在本例中，完整檔案是 `package.json`，部分檔案是 `package.1.json`。由於焦點一般在完整檔案而非部分檔案上，使用讀者編輯的檔案名稱（在本例中為 `package.json`）可以明確指出要在哪個檔案中工作。

### 部分檔案命名

指南的逐步性質需要重構，這表示有些程式碼片段會在一份指南中逐步演變。

請使用部分檔案來展示最終原始碼的中間版本，其中包含不會出現在最終應用程式中的程式碼片段。範例命名慣例是在副檔名之前加上數字，如下所示：

<code-example format="html" language="html">

package.1.json
app.component.1.ts
app.component.2.ts

</code-example>

請記得將這些檔案列在 `stackblitz.json` 中，以將其排除在 StackBlitz 之外，如此處所示：

<code-example header="stackblitz.json" path="docs-style-guide/stackblitz.json"></code-example>

### 原始碼樣式

原始碼應盡可能遵循 [Angular 風格指南](guide/styleguide)。

#### 十六進位

十六進位應盡可能使用簡寫，且只使用小寫字母。

<a id="live-examples"></a>

## 即時範例

在頁面中加入 `<live-example></live-example>` 會產生兩個預設連結：
<live-example></live-example>.

第一個是連往 StackBlitz 範例的連結，由預設的 `stackblitz.json` 檔案定義。你可以在 `content/examples/example-app` 目錄中找到 `stackblitz.json` 檔案，其中 `example-app` 是你為指南使用的範例應用程式資料夾。

預設情況下，文件產生器會使用指南的名稱作為範例的名稱。因此，如果你正在處理 `router.md`，並在文件中使用 `<live-example></live-example>`，文件產生器會尋找 `content/examples/router`。點選此連結會在新的瀏覽器分頁中開啟 StackBlitz 上的程式碼範例。

第二個連結會下載範例應用程式。

請在程式碼範例資料夾的根目錄中使用一或多個 `stackblitz.json` 檔案來定義即時範例。每個範例資料夾通常只有一個未命名的定義檔案，也就是預設的 `stackblitz.json`。

### 具名 StackBlitz 的即時範例

你可以建立形式為 `name.stackblitz.json` 的其他具名定義檔案。[測試](guide/testing)指南（`aio/content/guide/testing.md`）參照具名 StackBlitz 檔案的方式如下：

<code-example format="html" language="html">

&lt;live-example stackblitz="specs"&gt;Tests&lt;/live-example&gt;

</code-example>

`stackblitz` 屬性值 `specs` 參照的是 `examples/testing/specs.stackblitz.json` 檔案。如果你省略 `stackblitz` 屬性，預設值會是 `examples/testing/stackblitz.json`。

### 自訂標籤與工具提示

使用屬性與類別來變更即時範例的外觀與行為。下列範例透過設定 `title` 屬性，為即時範例錨點提供自訂標籤與工具提示：

<code-example format="html" language="html">

&lt;live-example title="Live Example with title"&gt;&lt;/live-example&gt;

</code-example>

瀏覽器會呈現如下內容：

<live-example title="Live Example with title"></live-example>

你也可以將標籤放在 `<live-example>` 標籤之間來達到相同的效果：

<code-example format="html" language="html">

&lt;live-example&gt;Live example with content label&lt;/live-example&gt;

</code-example>

瀏覽器會呈現如下內容：

<live-example>Live example with content label</live-example>

### 來自其他指南的即時範例

若要連結到名稱與目前指南頁面不同的資料夾中的範例，請將 `name` 屬性設為該資料夾的名稱。

例如，若要在本風格指南中納入 [Router](guide/router) 指南的範例，請將 `name` 屬性設為 `router`，也就是該範例所在資料夾的名稱。

<code-example format="html" language="html">

&lt;live-example name="router"&gt;Live example from the Router guide&lt;/live-example&gt;

</code-example>

<live-example name="router">Live example from the Router guide</live-example>

### 不含下載的即時範例

若要省略下載連結，請加入 `noDownload` 屬性。

<code-example format="html" language="html">

&lt;live-example noDownload&gt;Just the StackBlitz&lt;/live-example&gt;

</code-example>

瀏覽器會呈現如下內容：

<live-example noDownload>Just the StackBlitz</live-example>

### 僅含下載的即時範例

若要省略即時 StackBlitz 連結、只連結至下載，請加入 `downloadOnly` 屬性。

<code-example format="html" language="html">

&lt;live-example downloadOnly&gt;Download only&lt;/live-example&gt;

</code-example>

瀏覽器會呈現如下內容：

<live-example downloadOnly>Download only</live-example>

### 內嵌即時範例

預設情況下，即時範例連結會在另一個瀏覽器分頁中開啟 StackBlitz 範例。你可以加入 `embedded` 屬性，將 StackBlitz 範例內嵌在指南頁面中。

基於效能考量，StackBlitz 不會立即啟動。相反地，`<live-example>` 元件會呈現一張圖片。點選圖片會開始在 `<iframe>` 內啟動內嵌 StackBlitz 的程序。

以下是本指南的內嵌 `<live-example>`：

<code-example format="html" language="html">

&lt;live-example embedded&gt;&lt;/live-example&gt;

</code-example>

瀏覽器會呈現下列 `<iframe>` 與一個含有下載範例連結的 `<p>`：

<live-example embedded></live-example>

<a id="anchors"></a>

## 錨點

每個章節標題也都是一個錨點。另一個指南頁面可以如下列所示加入連往本「錨點」章節的連結：

<code-example format="html" language="html">

&lt;div class="alert is-helpful"&gt;

See the &lsqb;"Anchors"&rsqb;(guide/docs-style-guide#anchors "Style Guide &mdash;Anchors") section for details.

&lt;/div&gt;

</code-example>

瀏覽器會呈現如下內容：

<div class="alert is-helpful">

詳細資訊請參閱[「錨點」](guide/docs-style-guide#錨點 "風格指南 &mdash;錨點")一節。

</div>

請注意，上述範例包含「Style Guide &mdash;Anchors」這個標題。請在錨點上使用標題來建立工具提示並改善使用者體驗。

在頁面內導覽時，你可以在指定[捲動至](#錨點 "Anchors")本節開頭的連結時省略頁面 URL，如下所示：

<code-example format="html" language="html">

&hellip; the link that &lsqb;scrolls up&rsqb;(#anchors "Anchors") to &hellip;

</code-example>

<a id="section-anchors"></a>

### 章節標題錨點

雖然文件產生器會根據標題文字自動為標題建立錨點，但標題可能會變更，這可能會破壞連往該章節的任何連結。

為了減少連結損壞的情況，請在標題或適用文字的正上方，使用特殊的 `
<a id="name"></a>
` 語法明確加入自訂錨點，如下所示：

<code-example  language="html">

<a id="section-anchors"></a>

&num;&num;&num;&num; Section header anchors

</code-example>

然後像這樣參照該錨點：

<code-example format="html" language="html">

This is a &lsqb;link to that custom anchor name&rsqb;(#section-anchors).

</code-example>

瀏覽器會呈現如下內容：

這是[連往該自訂錨點名稱的連結](#section-anchors)。

編輯檔案時，請勿移除任何錨點。如果你變更文件結構，可以在同一份文件內移動現有的錨點而不會破壞連結。你也可以加入更多文字更適當的錨點。

<div class="alert is-helpful">

或者，你也可以使用 HTML `<a>` 標籤。
使用 `<a>` 元素時，請設定 `id` 屬性——而非 `name` 屬性，因為文件產生器不會將 `name` 轉換為正確的連結 URL。
例如：

<code-example format="html" language="html">

&lt;a id="anchors"&gt;&lt;/a&gt;

&num;&num; 錨點

</code-example>

</div>

## 提示與引言框

提示與引言框會呈現警告、額外細節或相關主題的參照。

提示或引言框不應包含理解主要內容所必需的任何資訊。指示或教學步驟應放在指南的主要內文，而非子章節中。

### 警示

提示用來引起讀者注意簡短而重要的要點。對於多行內容，請參閱[引言框](#提示框 "callouts")。

<div class="alert is-helpful">

如需更多資訊，請參閱[即時範例](guide/docs-style-guide#即時範例 "即時範例")一節。

</div>

<div class="alert is-helpful">

**注意**：<br />
在開頭與結尾的 `<div>` 標籤之後都必須至少留一個空行。
在結尾的 `</div>` 之前留一個空行是慣例，但並非必要。

</div>

<code-example format="html" language="html">

&lt;div class="alert is-helpful"&gt;

See the &lsqb;live examples&rsqb;(guide/docs-style-guide#live-examples "Live examples") section for more information.

&lt;/div&gt;

</code-example>

提示有三種不同的樣式層級，依內容的重要性而定。

請使用下列 `alert` 類別，並搭配適當的 `is-helpful`、`is-important` 或 `is-critical` CSS 類別，如下所示：

<code-example format="html" language="html">

&lt;div class="alert is-helpful"&gt;

A helpful, informational alert.

&lt;/div&gt;

</code-example>

<code-example format="html" language="html">

&lt;div class="alert is-important"&gt;

An important alert.

&lt;/div&gt;

</code-example>

<code-example format="html" language="html">

&lt;div class="alert is-critical"&gt;

A critical alert.

&lt;/div&gt;

</code-example>

瀏覽器會呈現如下內容：

<div class="alert is-helpful">

一個有幫助的資訊提示。

</div>

<div class="alert is-important">

一個重要的提示。

</div>

<div class="alert is-critical">

一個關鍵的提示。

</div>

### 提示框

引言框與提示一樣，會強調重要的要點。當你需要標頭與多行內容時，請使用引言框。

如果你有超過兩個段落，請考慮建立新頁面或將其納入主要內容。

引言框使用與提示相同的樣式層級。

請將 CSS 類別 `callout` 與適當的 `is-helpful`、`is-important` 或 `is-critical` 類別搭配使用。下列範例使用 `is-helpful` 類別：

<code-example format="html" language="html">

&lt;div class="callout is-helpful"&gt;

&lt;header&gt;A helpful or informational point&lt;/header&gt;

&ast;&ast;A helpful note&ast;&ast;.
Use a helpful callout for information requiring explanation.
Callouts are typically multi-line notes.
They can also contain code snippets.

&lt;/div&gt;

</code-example>

瀏覽器會將三種樣式呈現如下：

<div class="callout is-helpful">

<header>一個有幫助或資訊性的重點</header>

**有幫助的提示**。
請使用有幫助的引言框來提供需要說明的資訊。
引言框通常是多行的附註。
它們也可以包含程式碼片段。

</div>

<div class="callout is-important">

<header>一個重要的重點</header>

**重要的提示**。
請使用重要的引言框來提供需要說明的重大資訊。
引言框通常是多行的附註。
它們也可以包含程式碼片段。

</div>

<div class="callout is-critical">

<header>一個關鍵的重點</header>

**關鍵的提示**。
請使用關鍵的引言框來提供需要說明的迫切資訊。
引言框通常是多行的附註。
它們也可以包含程式碼片段。

</div>

使用引言框時，請考慮下列幾點：

*   引言框標頭文字樣式為大寫
*   標頭不會呈現在目錄中
*   你可以使用 Markdown 撰寫引言框內文
*   一個空行將 `<header>` 標籤與 Markdown 內容分隔開來
*   請避免使用 `<h2>`、`<h3>`、`<h4>`、`<h5>` 或 `<h6>`，因為引言框的 CSS 會為 `<header>` 元素設定樣式

請節制使用引言框，以吸引使用者的注意。

## 樹狀結構

請使用樹狀結構來表示階層式資料，例如目錄結構。

<div class="filetree">
  <div class="file">
    sample-dir
  </div>
  <div class="children">
    <div class="file">
      src
    </div>
    <div class="children">
      <div class="file">
        app
      </div>
      <div class="children">
        <div class="file">
          app.component.ts
        </div>
        <div class="file">
          app.module.ts
        </div>
      </div>
      <div class="file">
        styles.css
      </div>
      <div class="file">
        tsconfig.json
      </div>
    </div>
    <div class="file">
      node_modules &hellip;
    </div>
    <div class="file">
      package.json
    </div>
  </div>
</div>

以下是此檔案樹狀結構的標記。

<code-example format="html" language="html">

&lt;div class="filetree"&gt;
    &lt;div class="file"&gt;
        sample-dir
    &lt;/div&gt;
    &lt;div class="children"&gt;
        &lt;div class="file"&gt;
          src
        &lt;/div&gt;
        &lt;div class="children"&gt;
            &lt;div class="file"&gt;
              app
            &lt;/div&gt;
            &lt;div class="children"&gt;
                &lt;div class="file"&gt;
                  app.component.ts
                &lt;/div&gt;
                &lt;div class="file"&gt;
                  app.module.ts
                &lt;/div&gt;
            &lt;/div&gt;
            &lt;div class="file"&gt;
              styles.css
            &lt;/div&gt;
            &lt;div class="file"&gt;
              tsconfig.json
            &lt;/div&gt;
        &lt;/div&gt;
        &lt;div class="file"&gt;
          node_modules &hellip;
        &lt;/div&gt;
        &lt;div class="file"&gt;
          package.json
        &lt;/div&gt;
    &lt;/div&gt;
&lt;/div&gt;

</code-example>

## 圖片

請將圖片存放在 `content/images/guide` 目錄中與指南頁面**同名**的資料夾。由於 Angular 文件產生程序會將這些圖片複製到 `generated/images/guide/your-guide-directory`，請將圖片的 `src` 屬性設為 `generated/images/guide/your-guide-directory` 的執行階段位置。

例如，本「Angular 文件風格指南」的圖片位於 `content/images/guide/docs-style-guide` 資料夾，但 `src` 屬性指定的是 `generated` 位置。

以下是屬於本指南的「flying hero」圖片的 `src` 屬性：

<code-example format="html" language="html">

src="generated/images/guide/docs-style-guide/flying-hero.png"

</code-example>

<div class="callout is-important">

<header>使用 HTML <code>&lt;img&gt;</code> 標籤</header>

請使用 `<img>` 標籤指定圖片。
**請勿使用 Markdown 圖片語法 `![... ](... )`。**

為了無障礙，請務必設定 `alt` 屬性，並提供圖片的有意義描述。

請將 `<img>` 標籤巢狀放在 `<div class="lightbox">` 標籤內，該標籤會依文件標準為圖片設定樣式。

<code-example format="html" language="html">

&lt;div class="lightbox"&gt;

&lt;img alt="flying hero" src="generated/images/guide/docs-style-guide/flying-hero.png"&gt;

&lt;/div&gt;

</code-example>

<div class="alert is-helpful">

**注意**：<br />
HTML `<img>` 元素沒有結尾標籤。

</div>

瀏覽器會呈現以下內容：
<div class="lightbox">

<img alt="飛行的英雄" src="generated/images/guide/docs-style-guide/flying-hero.png">

</div>

</div>

### 圖片說明與圖說

說明文字會出現在圖片下方，作為圖片的簡潔完整摘要。除非你使用編號圖（如圖 1、圖 2 等），否則說明文字為選用。如果你在頁面中使用編號圖，請遵循 Google 開發者文件風格指南中的 [圖說](https://developers.google.com/style/images#figure-captions) 規範。

### 圖片尺寸

文件產生器會從圖片檔案讀取圖片尺寸，並自動為 `<img>` 標籤加上 `width` 與 `height` 屬性。

若要控制圖片大小，請自行提供 `width` 與 `height` 屬性。

以下是寬度為 200px 的「flying hero」標記：

<code-example format="html" language="html">

&lt;div class="lightbox"&gt;

&lt;img alt="flying Angular hero"
     src="generated/images/guide/docs-style-guide/flying-hero.png"
     width="200"&gt;

&lt;/div&gt;

</code-example>

瀏覽器會呈現以下內容：

<div class="lightbox">

<img alt="flying Angular hero"
     src="generated/images/guide/docs-style-guide/flying-hero.png"
     width="200">

</div>

### 寬圖片

為避免圖片超出檢視區，**請使用寬度小於 700px 的圖片**。若要顯示較大的圖片，請提供實際圖片的連結，讓使用者可以點選連結另外查看完整尺寸的圖片，例如「Ahead-of-time Compilation」指南中 `source-map-explorer` 輸出的這個範例：

<a href="generated/images/guide/docs-style-guide/toh-pt6-bundle.png" title="Click to view larger image">

<div class="lightbox">

<img alt="Tour of Heroes 第 6 部分的套件" src="generated/images/guide/docs-style-guide/toh-pt6-bundle-700w.png" width="300px">

</div>

</a>

以下是建立圖片連結的 HTML：

<code-example format="html" language="html">

&lt;a href="generated/images/guide/docs-style-guide/toh-pt6-bundle.png" title="Click to view larger image"&gt;

&lt;div class="lightbox"&gt;

&lt;img alt="toh-pt6-bundle" src="generated/images/guide/docs-style-guide/toh-pt6-bundle-700w.png" width="300px"&gt;

&lt;/div&gt;

&lt;/a&gt;

</code-example>

### 圖片壓縮

為加快載入速度，請一律壓縮圖片。可以考慮使用圖片壓縮網站，例如 [tinypng](https://tinypng.com/ "tinypng")。

### 浮動圖片

你可以分別套用 `class="left"` 或 `class="right"` 屬性，讓圖片浮動在文字的左側或右側。例如：

<code-example format="html" language="html">

&lt;img alt="flying Angular hero"
     class="left"
     src="generated/images/guide/docs-style-guide/flying-hero.png"
     width="200"&gt;

This text wraps around to the right of the floating "flying hero" image.

Headings and code-examples automatically clear a floated image.
If you need to force a piece of text to clear a floating image, add &grave;&lt;br class="clear"&gt;&grave; where the text should break.

&lt;br class="clear"&gt;

</code-example>

瀏覽器會呈現以下內容：

<img alt="flying Angular hero"
     class="left"
     src="generated/images/guide/docs-style-guide/flying-hero.png"
     width="200">

這段文字會環繞在浮動的「flying hero」圖片右側。

標題與 `<code-example>` 元件會自動清除浮動圖片。若要明確清除浮動圖片，請在文字應該斷行的位置加入 `<br class="clear">`。

<br class="clear">

一般來說，請勿將浮動圖片包在 `<figure>` 元素內。

### 小節內的浮動

如果你的浮動圖片位於提示框、標註或小節內，請為 `<div>` 套用 `clear-fix` 類別，以確保圖片不會超出其容器。例如：

<code-example format="html" language="html">

&lt;div class="alert is-helpful clear-fix"&gt;

&lt;img alt="flying Angular hero"
     src="generated/images/guide/docs-style-guide/flying-hero.png"
     class="right"
     width="100"&gt;

A subsection with **Markdown** formatted text.

&lt;/div&gt;

</code-example>

瀏覽器會呈現以下內容：

<div class="alert is-helpful clear-fix">

<img alt="flying Angular hero"
     class="right"
     src="generated/images/guide/docs-style-guide/flying-hero.png"
     width="100">

一個含有 **Markdown** 格式文字的子章節。

</div>

## 文件風格協助

如需特定語言與文法用法、字詞清單、風格、語氣與格式建議，請參閱 [Google Developer Documentation Style Guide](https://developers.google.com/style)。

如果你有本風格指南未解答的問題，或想討論文件風格，請參閱 [Angular repo](https://github.com/angular/angular) 並 [提交文件問題](https://github.com/angular/angular/issues/new/choose)。

<!-- links -->

<!-- external links -->

<!-- end links -->

@reviewed 2022-02-28
