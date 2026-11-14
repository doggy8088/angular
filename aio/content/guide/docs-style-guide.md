# Angular 文件風格指南

<!-- formerly Authors Style Guide -->

本風格指南適用於所有為 Angular 文件（本站）做出貢獻的人。
所有作者都應遵循這些準則。
偏離準則必須獲得文件編輯的核准。

這裡描述的準則有兩個目的：

* 為 Angular 文件使用者確保高品質、一致的體驗。

* 簡化貢獻作者的寫作流程。
本指南幫助你決定語氣、語調與風格。
它也幫助你快速找到正確的標記。

<div class="alert is-helpful">

本指南是一份*活文件*；它會隨著時間而改變。
我們在可行的範圍內努力保持一致，但你可能會發現我們的文件有些部分不符合本風格指南。
有疑問時，**請遵循本指南，而不是模仿現有的文件。**

</div>

## 這些準則的範圍

我們要求所有貢獻作者遵守三個方面的風格：

* **寫作風格：** 用詞、文法、大小寫與標點符號。
遵守 Angular 的寫作準則可確保一致的「語調」，幫助確保資訊的正確性，並方便世界各地不同背景的讀者使用。

* **標記風格：** 如何包含圖片、表格、警告框與程式碼片段。
Angular 文件以 Markdown 撰寫，並有本站專用的自訂擴充。正確的標記可確保一致的外觀與感覺，並且對文件正確建置與運作至關重要。

* **Angular 程式碼風格：** 範例應用程式與程式碼片段的程式碼風格。
我們鼓勵使用程式碼範例來示範如何套用所討論的概念與功能。
Angular 有一個自訂框架，讓作者能直接從範例應用程式中包含程式碼片段，這些範例會在文件建置過程中自動測試。
若要貢獻範例程式碼，你必須了解 Angular 本身，以及 Angular 文件範例的自訂框架。

對於每個風格方面，下表說明了在哪裡可以找到主要準則，以及本 Angular 文件風格指南提供什麼。

風格                     | 準則
------------------------ | -------------------------------
**寫作風格**             | 主要：[Google Developer Documentation Style Guide](https://developers.google.com/style/)<br />本指南：指定 Angular 文件的任何特殊考量。
**標記風格**             | 主要：本指南<br />本指南：指定指南與教學的標記準則，這些主要以 Markdown 撰寫。
**Angular 程式碼風格**   | 主要：[Angular 風格指南](guide/styleguide "Angular Application Code Style Guide")。<br />本指南：如何在指南與教學中建立、儲存與包含程式碼範例。

<div class="alert is-helpful">

注意：Angular API 與 CLI 參照文件是從原始碼及／或相關原始檔產生的，它們可能有其他標記風格，以及其他包含程式碼範例的方式。

</div>

## 文件產生與工具

若要變更文件頁面與範例程式碼，請複製 [Angular github 儲存庫](https://github.com/angular/angular "Angular repo")，並前往 `aio/` 資料夾。

[aio/README.md](https://github.com/angular/angular/blob/master/aio/README.md "AIO ReadMe")說明如何安裝與使用工具來編輯與測試你的變更。

以下是給指南頁面作者的幾個必要指令。

1. `yarn setup` &mdash; 安裝套件；建置文件、stackblitz 與 zip。

1. `yarn docs-watch --watch-only` &mdash; 監看已儲存的內容變更並重新整理瀏覽器。（可選的）`--watch-only` 旗標會跳過初始的文件重建。

1. `yarn start`  &mdash;  啟動文件檢視器應用程式，讓你在瀏覽器中看到本機變更。

1.  http://localhost:4200/  &mdash;  瀏覽到在本機執行的應用程式。

你可以用 `yarn serve-and-sync` 將 `yarn docs-watch` 與 `yarn start` 合併為一個指令。

## 指南頁面

 除了少數幾個之外，所有指南頁面都是副檔名為 `.md` 的 [markdown](https://daringfireball.net/projects/markdown/syntax "markdown") 檔案。

每個指南頁面檔案都儲存在 `content/guide` 目錄中。雖然[側邊導覽](#導覽)面板顯示為階層結構，但該目錄是扁平的，沒有子資料夾。
扁平資料夾的做法讓我們可以調整表面上的導覽結構，而不需移動頁面檔案或重新導向舊的頁面 URL。

文件產生過程會取用 `content/guide` 目錄中的 markdown 檔案，並在 `src/generated/docs/guide` 目錄中產生 JSON 檔案，該目錄也是扁平的。那些 JSON 檔案包含文件中繼資料與 HTML 內容的組合。

讀者透過頁面 URL 請求頁面。文件檢視器取得對應的 JSON 檔案、解譯它，並將它渲染為完整成形的 HTML 頁面。

頁面 URL 對映 `content` 檔案結構。指南頁面的 URL 形式為 `guide/{page-name}`。本「作者風格指南」頁面位於 `content/guide/docs-style-guide.md`，其 URL 為 `guide/docs-style-guide`。

<div class="alert is-helpful">

_教學_頁面與指南頁面完全相同。唯一的區別是它們位於 `content/tutorial` 而不是 `content/guide`，且 URL 形式為 `tutorial/{page-name}`。

_API_ 頁面是從 Angular 原始碼產生到 `src/generated/docs/api` 目錄中。
文件檢視器會將以 `api/` 開頭的 URL 轉換為對該目錄中文件 JSON 檔案的請求。本風格指南不討論 API 頁面的建立或維護。

_行銷_頁面與指南頁面相似。它們位於 `content/marketing` 目錄中。雖然它們可以是 markdown 檔案，但它們也可以是靜態 HTML 頁面，或是以 JSON 資料渲染的動態 HTML 頁面。

只有少數人被授權撰寫行銷頁面。本風格指南不討論行銷頁面的建立或維護。

</div>

## Markdown 與 HTML

雖然文件指南頁面最終渲染為 HTML，但幾乎所有頁面都是以 [markdown](https://daringfireball.net/projects/markdown/syntax "markdown") 撰寫的。

Markdown 比 HTML 更容易閱讀與編輯。許多編輯器（包括 Visual Studio Code）可以在你輸入時渲染 markdown。

有時候你必須離開 markdown，將文件的一部分以 HTML 撰寫。Markdown 允許你在同一文件中混合 HTML 與 markdown。

標準的 markdown 處理器不允許你在 HTML 標籤_之內_放 markdown。但 Angular 文件的 markdown 處理器**支援在 HTML 內使用 markdown**，只要你遵循一條規則：

<div class="alert is-critical">

**務必**在每個開頭與結尾 HTML 標籤之後加一個_空白行_。

</div>

```html
<div class="alert is-critical">

  **Always** follow every opening and closing HTML tag with _a blank line_.

</div>
```

<div class="alert is-helpful">

  在_結尾 HTML_ 標籤之前也加上一個空白行是慣例，但不是必須的。

</div>

## 標題

每個指南文件都必須有一個標題。

標題應該出現在實體頁面的頂部。
以 markdown 的 `#` 字元開始標題。或者，你可以寫等效的 `<h1>`。

```html
  # Authors Style Guide
```

**每個文件只能有一個標題（`<h1>`）！**

標題文字應該使用「標題大小寫」，也就是以大寫字母作為第一個單詞與所有_主要_單詞的開頭。像 "in"、"of" 與 "the" 這樣的_次要_單詞使用小寫字母。

```html
  # The Meat of the Matter
```

**標題後面務必至少留一個空行。**

## 章節

典型的文件被劃分為若干章節。

所有章節標題文字都應該使用「句子大小寫」，也就是第一個單詞大寫，所有其他單詞小寫。

**章節標題之後務必至少加一個空白行。**

<h2 class="no-toc">

Main section heading
</h2>
通常有一個或多個主要章節，可以進一步劃分為次要章節。

以 markdown 的 `##` 字元開始主要章節標題。或者，你可以寫等效的 `<h2>` HTML 標籤。

主要章節標題之後應該加一個空白行，然後是該標題的內容。

```html
  ## Sections

  A typical document is divided into sections.
```

<h3 class="no-toc">

Secondary section heading
</h3>

次要章節標題與主要標題相關，並且在文字上_落在_該主要標題的範圍之內。

以 markdown 的 `###` 字元開始次要標題。或者，你可以寫等效的 `<h3>` HTML 標籤。

次要標題之後應該加一個空白行，然後是該標題的內容。

```html
  ### Secondary section heading

  A secondary section ...
```

#### 其他章節標題

試著將標題深度降至最低，最好只有兩層。但如果有意義，像這樣更多的標題也是允許的。

**N.B.**： [目錄](#目錄)產生器只考慮主要（`<h2>`）與次要（`<h3>`）標題。

```html
  #### Additional section headings

  Try to minimize ...
```

## 目錄

大多數頁面顯示目錄 (TOC)。當視口寬時，TOC 出現在右側面板中。當視口窄時，TOC 出現在頁面頂部附近一個可展開／可摺疊的區域中。

你不應該自己手動建立目錄。目錄是從頁面的主要與次要章節標題自動產生的。

若要將標題排除在目錄之外，請將標題建立為帶有 'no-toc' 類別的 `<h2>` 或 `<h3>` 元素。你無法用 markdown 做到這一點。

```html
<h3 class="no-toc">
This heading is not displayed in the TOC
</h3>
```

你可以用帶有 `no-toc` 類別的 `<h1>` 標籤撰寫標題，來關閉_整個_頁面的目錄產生功能。

```html
<h1 class="no-toc">
A guide without a TOC
</h1>
```

## 導覽

螢幕頂部、左側與底部的導覽連結是從 JSON 設定檔 `content/navigation.json` 產生的。

變更 `navigation.json` 檔案的權限僅限於少數核心團隊成員。
但對於新的指南頁面，你應該在稱為「側邊導覽」的左側導覽面板中建議一個導覽標題與位置。

在 `navigation.json` 中尋找 `SideNav` 節點。`SideNav` 節點是一個導覽節點陣列。每個節點要麼是單一文件的_項目_節點，要麼是帶有子節點的_標頭_節點。

找到你的頁面所屬的標頭。
例如，描述 Angular 功能的指南頁面很可能是 `Fundamentals` 標頭的子節點。

```html
{
  "title": "Fundamentals",
  "tooltip": "The fundamentals of Angular",
  "children": [ ... ]
}
```

_標頭_節點的子節點可以是_項目_節點或另一個_標頭_節點。如果你的指南頁面屬於某個子標頭之下，請在 JSON 中找到該子標頭。

在適當的_標頭_節點下，為你的指南頁面加入一個_項目_節點。它大概長得像這樣。

```html
{
  "url": "guide/architecture",
  "title": "Architecture",
  "tooltip": "The basic building blocks of Angular applications."
}
```

導覽節點具有下列屬性：

* `url` - 指南頁面的 URL（_僅項目節點_）。

* `title` - 在側邊導覽中顯示的文字。

* `tooltip` - 當讀者將滑鼠懸停在導覽連結上時出現的文字。

* `children` - 子節點陣列（_僅標頭節點_）。

* `hidden` - 如果這是一個不應該顯示在導覽面板中的指南頁面，則定義並設為 true。這很少需要，它是一種讓頁面不顯示在導覽中、但仍可供應該知道它的讀者使用的方法。本「作者風格指南」就是一個隱藏頁面。

<div class="alert is-critical">

不要建立同時是_標頭_又是_項目_的節點。也就是說，不要指定_標頭_節點的 `url` 屬性。

</div>

<div class="alert is-critical">

目前的準則允許三層導覽結構，包含兩個標頭層級。不要加入第三個標頭層級。

</div>

## 程式碼片段

指南中富含可運作的 Angular 程式碼範例。範例程式碼可以是在終端機視窗中輸入的指令、TypeScript 或 HTML 的片段，或整個程式碼檔案。

不論來源為何，文件檢視器都將它們渲染為「程式碼片段」，或單獨使用 [_code-example_](#code-example "code-example") 元件，或作為分頁集合使用 [_code-tabs_](#code-tabs "code-tabs") 元件。

{@a code-example}

### 程式碼範例

你可以使用 markdown 反引號語法顯示簡單的行內程式碼片段。
我們一般偏好使用 Angular 文件的 _code-example_ 元件（以 `<code-example>` 標籤表示）來顯示程式碼片段。

<h3 class="no-toc">Inline code-snippets</h3>

你應該盡可能[從可運作的範例程式碼](#from-code-samples)取得程式碼片段。
但有些時候，行內片段是更好的選擇。

對於終端機的輸入與輸出，請將內容放在 `<code-example>` 標籤之間，將 CSS 類別設為 `code-shell`，並將 language 屬性設為 `sh`，如本範例所示。

<code-example language="sh" class="code-shell">
  npm start
</code-example>

```html
<code-example language="sh" class="code-shell">
  npm start
</code-example>
```

像這樣行內手寫的片段是_不可_測試的，因此本質上不可靠。
這個範例屬於預先核准的行內片段小集合之一，其中包括指令殼層中的使用者輸入，或某個過程的_輸出_。

**不要撰寫行內程式碼片段**，除非你有充分的理由並獲得編輯的許可。
在所有其他情況下，程式碼片段都應該從經過測試的程式碼範例自動產生。

{@a from-code-samples}

<h3 class="no-toc">Code snippets and code samples</h3>

文件的設計目標之一是，指南頁面的程式碼片段應該是真實、可運作程式碼的範例。

我們透過顯示直接源自獨立程式碼範例的程式碼片段來實現這一目標，這些範例是專門為這些指南頁面撰寫的。

指南頁面的作者對支援該頁面的程式碼範例負責。
作者還必須為範例撰寫端到端測試。

程式碼範例位於 `angular/angular` 儲存庫的 `content/examples` 目錄的子資料夾中。範例資料夾名稱應該與它所支援的指南頁面相同。

<div class="alert is-helpful">

指南頁面可能沒有自己的範例程式碼。
它可能參照的是屬於其他頁面的範例。

</div>

Angular CI 過程會為每個 Angular PR 執行所有端到端測試。Angular 在範例的每個新版本以及 Angular 本身的每個新版本之後重新測試範例。

在可能的情況下，指南頁面上的每段程式碼都應該源自程式碼範例檔案。你可以透過設定 `<code-example>` 屬性，告訴 Angular 文件引擎要顯示哪個程式碼檔案（或程式碼檔案的片段）。

#### 來自檔案的程式碼片段

_本_「作者文件風格指南」有自己的範例應用程式，位於 `content/examples/docs-style-guide` 資料夾中。

以下 _code-example_ 顯示範例的 `app.module.ts`。

<code-example path="docs-style-guide/src/app/app.module.ts" header="src/app/app.module.ts"></code-example>

以下是產生那段冗長片段的簡短標記：

```html
<code-example
  path="docs-style-guide/src/app/app.module.ts"
  header="src/app/app.module.ts">
</code-example>
```

你透過將 `path` 屬性設為範例資料夾在 `content/examples` _之內_的位置，標識了片段的原始檔案。
在本範例中，該路徑是 `docs-style-guide/src/app/app.module.ts`。

你加入了一個標頭來告訴讀者在哪裡找到檔案，方法是設定 `header` 屬性。
按照慣例，你將 `header` 屬性設為檔案在範例根資料夾中的位置。

<div class="alert is-helpful">

除非另有說明，本頁中的所有程式碼片段都源自位於 `content/examples/docs-style-guide` 目錄中的範例原始碼。

</div>

<div class="alert is-important">

如果路徑中標識的檔案不存在，文件工具會報告錯誤，**如果檔案被 _git_ 忽略，也會報告錯誤**。

大多數 `.js` 檔案都被 _git_ 忽略。
如果你想在專案中包含一個被忽略的程式碼檔案並在指南中顯示它，你必須_取消忽略_它。

取消忽略檔案的慣用方法是像這樣更新 `content/examples/.gitignore`：

<code-example header="content/examples/.gitignore">
  # my-guide
  !my-guide/src/something.js
  !my-guide/more-javascript*.js
</code-example>

</div>

#### code-example 屬性

你可以透過設定 _code-example_ 的一個或多個屬性來控制其輸出：

* `path` - `content/examples` 資料夾中檔案的路徑。

* `header` - 程式碼清單的標頭。

* `region` - 顯示具有該區域名稱的原始檔案片段；區域由原始檔案中的 _docregion_ 標記標識，如[下文](#region "Displaying a code fragment")所說明。

* `linenums` - 值可以是 `true`、`false` 或 `number`。未指定時，當程式碼超過 10 行時會自動顯示行號。很少使用的 `number` 選項從給定值開始編排行號。`linenums=4` 將起始行號設為 4。

* `class` - 程式碼片段可以使用 CSS 類別 `no-box`、`code-shell` 與 `avoid` 來設定樣式。

* `hideCopy` - 隱藏複製按鈕

* `language` - 原始碼語言，例如 `javascript`、`html`、`css`、`typescript`、`json` 或 `sh`。這個屬性僅適用於行內範例。

{@a region}

#### 顯示程式碼片段

你常常想聚焦於範例程式碼檔案中的一段程式碼。在本範例中，你聚焦於 `AppModule` 類別及其 `NgModule` 中繼資料。

<code-example
  path="docs-style-guide/src/app/app.module.ts"
  region="class">
</code-example>

首先，你用一個命名的 _docregion_ 將該片段在原始檔案中包圍起來，如[下文](#source-code-markup)所述。
然後你在 `<code-example>` 的 `region` 屬性中參照那個 _docregion_，像這樣

```html
<code-example
  path="docs-style-guide/src/app/app.module.ts"
  region="class">
</code-example>
```

幾點觀察：

1. `region` 值 `"class"` 是原始檔案中 `#docregion` 的名稱。透過查看 `content/examples/docs-style-guide/src/app/app.module.ts` 確認這一點

1. 當片段的來源很明顯時，省略 `header` 是可以的。我們剛才說這是 `app.module.ts` 檔案的一個片段，該檔案剛在上面完整顯示，並帶有標頭。
沒有必要重複標頭。

1. 行號消失了。依預設，當程式碼少於 10 行時，文件檢視器會省略行號；超過之後才會加上行號。你可以透過設定 `linenums` 屬性，明確開啟或關閉行號。

#### 壞程式碼範例

有時候你想顯示壞程式碼或壞設計的範例。

你應該小心。讀者不一定仔細閱讀，他們很可能會將你的壞程式碼範例複製並貼到自己的應用程式中。所以不要經常顯示壞程式碼。

當你這樣做時，請將 `class` 設為 `avoid`。程式碼片段會以鮮紅色邊框呈現，以吸引讀者的注意。

以下是在 [_Angular Style Guide_](guide/styleguide#style-05-03 "Style 05-03: components as elements") 中一個 "avoid" 範例的標記。

```html
<code-example
  path="styleguide/src/05-03/app/heroes/shared/hero-button/hero-button.component.avoid.ts"
  region="example"
  header="app/heroes/hero-button/hero-button.component.ts">
</code-example>
```

<code-example path="styleguide/src/05-03/app/heroes/shared/hero-button/hero-button.component.avoid.ts" region="example" header="app/heroes/hero-button/hero-button.component.ts">
</code-example>

{@a code-tabs}

### 程式碼分頁

程式碼分頁顯示程式碼的方式與_程式碼範例_非常相似。額外的優點是它們可以在分頁介面中顯示多個程式碼範例。每個分頁使用 _code pane_ 顯示。

#### Code-tabs 屬性

* `linenums`：值可以是 `true`、`false` 或表示起始行號的數字。如果未指定，僅當頁籤窗格的程式碼超過 10 行時才啟用行號。

#### Code-pane 屬性

* `path` - content/examples 資料夾中的檔案
* `header` - 在分頁的標頭中顯示
* `linenums` - 覆寫此特定窗格在 `code-tabs` 層級的 `linenums` 屬性。值可以是 `true`、`false` 或表示起始行號的數字。如果未指定，僅當程式碼行數超過 10 行時才啟用行號。

下一個範例顯示多個程式碼分頁，每個都有自己的標頭。
它示範了在 `<code-tabs>` 與 `<code-pane>` 兩個層級上對行號顯示的控制。

<code-tabs linenums="false">
  <code-pane
    header="app.component.html"
    path="docs-style-guide/src/app/app.component.html">
  </code-pane>
  <code-pane
    header="app.component.ts"
    path="docs-style-guide/src/app/app.component.ts"
    linenums="true">
  </code-pane>
  <code-pane
    header="app.component.css (heroes)"
    path="docs-style-guide/src/app/app.component.css"
    region="heroes">
  </code-pane>
  <code-pane
    header="package.json (scripts)"
    path="docs-style-guide/package.1.json">
  </code-pane>
</code-tabs>

以下是該範例的標記。

請注意 `<code-tabs>` 中的 `linenums` 屬性如何明確地為所有窗格停用編號。
第二個窗格中的 `linenums` 屬性僅為_它自己_恢復行號。

```html
<code-tabs linenums="false">
  <code-pane
    header="app.component.html"
    path="docs-style-guide/src/app/app.component.html">
  </code-pane>
  <code-pane
    header="app.component.ts"
    path="docs-style-guide/src/app/app.component.ts"
    linenums="true">
  </code-pane>
  <code-pane
    header="app.component.css (heroes)"
    path="docs-style-guide/src/app/app.component.css"
    region="heroes">
  </code-pane>
  <code-pane
    header="package.json (scripts)"
    path="docs-style-guide/package.1.json">
  </code-pane>
</code-tabs>
```

{@a source-code-markup}

## 原始碼標記

在範例原始碼檔案能被 `<code-example>` 與 `<code-tabs>` 元件顯示之前，你必須為其加入特殊的程式碼片段標記。

<div class="alert is-helpful">

本頁的範例原始碼位於 `context/examples/docs-style-guide`，包含本節所述每個程式碼片段標記的範例。

</div>

程式碼片段標記總是以註解的形式出現。以下是 TypeScript 或 JavaScript 檔案的預設 _docregion_ 標記：

```
// #docregion
... some code ...
// #enddocregion
```

不同的檔案類型有不同的註解語法，請相應調整。

```html
<!-- #docregion -->
... some HTML ...
<!-- #enddocregion -->
```

```
/* #docregion */
... some CSS ...
/* #enddocregion */
```

文件產生過程會在文件檢視器中顯示這些註解之前將它們清除。
它也會從 stackblitz 與範例程式碼下載中移除它們。

<div class="alert is-important">

JSON 檔案不支援程式碼片段標記，因為 JSON 檔案禁止註解。
詳情與變通方法請參閱[下文](#json-檔案)。

</div>

#### _#docregion_

_#docregion_ 是最重要的一種程式碼片段標記。

`<code-example>` 與 `<code-tabs>` 元件不會顯示沒有 _#docregion_ 的原始碼檔案。

_#docregion_ 註解開啟一個程式碼片段區域。
該註解_之後_的每一行程式碼都屬於該區域，_直到_程式碼片段處理器遇到檔案結尾或結尾的 _#enddocregion_。

<div class="alert is-helpful">

`src/main.ts` 是一個簡單的範例，其檔案頂部有單一的 _#docregion_。

<code-example
  path="docs-style-guide/src/main.ts"
  header="src/main.ts"></code-example>

</div>

#### Named _#docregions_

You'll often display multiple snippets from different fragments within the same file.
You distinguish among them by giving each fragment its own _#docregion name_ as follows.

```
// #docregion region-name
... some code ...
// #enddocregion region-name
```

Remember to refer to this region by name in the `region` attribute of the `<code-example>` or `<code-pane>` as you did in an example above like this:

```html
<code-example
  path="docs-style-guide/src/app/app.module.ts"
  region="class"></code-example>
```

The _#docregion_ with no name is the _default region_. Do _not_ set the `region` attribute when referring to the default _#docregion_.

#### Nested _#docregions_

You can nest _#docregions_ within _#docregions_
```
// #docregion
... some code ...
// #docregion inner-region
... more code ...
// #enddocregion inner-region
... yet more code ...
/// #enddocregion
```
<div class="alert is-helpful">

The `src/app/app.module.ts` file has a good example of a nested region.

</div>

#### Combining fragments

You can combine several fragments from the same file into a single code snippet by defining
multiple _#docregions_ with the _same region name_.

Examine the `src/app/app.component.ts` file which defines two nested _#docregions_.

The inner, `class-skeleton` region appears twice, once to capture the code that opens the class definition and once to capture the code that closes the class definition.

<code-example linenums="false">
// #docplaster
...
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

以下是並列顯示的兩個對應程式碼片段。

<code-tabs>
  <code-pane
    header="app.component.ts (class)"
    path="docs-style-guide/src/app/app.component.ts"
    region="class">
  </code-pane>
  <code-pane
    header="app.component.ts (class-skeleton)"
    path="docs-style-guide/src/app/app.component.ts"
    region="class-skeleton">
  </code-pane>
</code-tabs>

幾點觀察：

* 頂部的 `#docplaster` 是另一種程式碼片段標記。它告訴處理器如何將片段連接成單一片段。

  在本範例中，我們告訴處理器將片段直接連接起來，中間不加任何東西——不加任何「plaster」。大多數範例檔案都定義這個_空 plaster_。

  如果我們忽略加入 `#docplaster`，處理器會在片段之間插入_預設_ plaster——一個省略號註解。試著自己移除 `#docplaster` 註解以查看效果。

* 一個 `#docregion` 註解提及了**_兩個_**區域名稱，`#enddocregion` 註解也是如此。這是在同一行程式碼上開始（或停止）多個區域的便捷方式。你可以將這些註解放在不同的行上，許多作者更喜歡這樣做。

#### JSON 檔案

JSON 檔案不支援程式碼片段標記，因為 JSON 檔案禁止註解。

你可以透過在 `src` 屬性中參照整個 JSON 檔案來顯示它。
但你不能顯示 JSON 片段，因為你無法將 `#docregion` 標籤加入檔案。

如果 JSON 檔案太大，你可以將感興趣的節點複製到 markdown 反引號中。

不幸的是，這樣很容易誤建無效的 JSON。慣用的方法是建立一個包含你想顯示之片段的 JSON 部分檔案。

你無法測試這個部分檔案，也永遠不會在應用程式中使用它。但至少你的 IDE 可以確認它的語法正確。

以下範例將 `package.json` 中的某些指令碼節錄到名為 `package.1.json` 的部分檔案中。

<code-example
  path="docs-style-guide/package.1.json"
  header="package.json (selected scripts)"></code-example>

```html
<code-example
  path="docs-style-guide/package.1.json"
  header="package.json (selected scripts)"></code-example>
```

#### Partial file naming

Many guides tell a story. In that story, the app evolves incrementally, often with simplistic or incomplete code along the way.

To tell that story in code, you'll often need to create partial files or intermediate versions of the final source code file with fragments of code that don't appear in the final app.

Such partial and intermediate files need their own names.
Follow the doc sample naming convention. Add a number before the file extension as illustrated here:

```html
package.1.json
app.component.1.ts
app.component.2.ts
```

You'll find many such files among the samples in the Angular documentation.

Remember to exclude these files from stackblitz by listing them in the `stackblitz.json` as illustrated here.

<code-example
  path="docs-style-guide/stackblitz.json"
  header="stackblitz.json"></code-example>

{@a live-examples}
## Live examples

By adding `<live-example>` to the page you generate links that run sample code in the Stackblitz live coding environment and download that code to the reader's file system.

Live examples (AKA "stackblitz") are defined by one or more `stackblitz.json` files in the root of a code sample folder. Each sample folder usually has a single unnamed definition file, the default `stackblitz.json`.

<div class="alert is-helpful">

You can create additional, named definition files in the form `name.stackblitz.json`. See `content/examples/testing` for examples.

The schema for a `stackblitz.json` hasn't been documented yet but looking at the `stackblitz.json` files in the example folders should tell you most of what you need to know.

</div>

Adding `<live-example></live-example>` to the page generates the two default links.

<live-example></live-example>

1. a link to the Stackblitz defined by the default `stackblitz.json` file located in the code sample folder with the same name as the guide page.

2. a link that downloads that sample.

Clicking the first link opens the code sample on StackBlitz in a new browser tab.

You can change the appearance and behavior of the live example with attributes and classes.


<h3 class="no-toc">Custom label and tooltip</h3>

Give the live example anchor a custom label and tooltip by setting the `title` attribute.

<live-example title="Live Example with title"></live-example>

```html
<live-example title="Live Example with title"></live-example>
```

You can achieve the same effect by putting the label between the `<live-example>` tags:

<live-example>Live example with content label</live-example>

```html
<live-example>Live example with content label</live-example>
```

<h3 class="no-toc">Live example from another guide</h3>

To link to a Stackblitz in a folder whose name is not the same as the current guide page, set the `name` attribute to the name of that folder.

<live-example name="router">Live Example from the Router guide</live-example>

```html
<live-example name="router">Live Example from the Router guide</live-example>
```

<h3 class="no-toc">Live Example for named Stackblitz</h3>

To link to a Stackblitz defined by a named `stackblitz.json` file, set the `stackblitz` attribute. The following example links to the Stackblitz defined by `second.stackblitz.json` in the current guide's directory.

<live-example stackblitz="second"></live-example>

```html
<live-example stackblitz="second"></live-example>
```

<h3 class="no-toc">Live Example without download</h3>

To skip the download link, add the `noDownload` attribute.

<live-example noDownload>Just the Stackblitz</live-example>

```html
<live-example noDownload>Just the Stackblitz</live-example>
```

<h3 class="no-toc">Live Example with download-only</h3>

To skip the live Stackblitz link and only link to the download, add the `downloadOnly` attribute.

<live-example downloadOnly>Download only</live-example>

```html
<live-example downloadOnly>Download only</live-example>
```

<h3 class="no-toc">Embedded live example</h3>

By default, a live example link opens a Stackblitz in a separate browser tab.
You can embed the Stackblitz within the guide page itself by adding the `embedded` attribute.

For performance reasons, the Stackblitz does not start right away. The reader sees an image instead. Clicking the image starts the sometimes-slow process of launching the embedded Stackblitz within an iframe on the page.

Here's an embedded live example for this guide.

```html
<live-example embedded></live-example>
```

<live-example embedded></live-example>

{@a anchors}

## Anchors

Every section header tag is also an anchor point. Another guide page could add a link to this section by writing:

<div class="alert is-helpful">

See the ["Anchors"](guide/docs-style-guide#anchors "Style Guide - Anchors") section for details.

</div>

```html
<div class="alert is-helpful">

See the ["Anchors"](guide/docs-style-guide#anchors "Style Guide - Anchors") section for details.

</div>
```

When navigating within the page, you can omit the page URL when specifying the link that [scrolls up](#anchors "Anchors") to the beginning of this section.

```html
... the link that [scrolls up](#anchors "Anchors") to ...
```

{@a ugly-anchors}

#### Ugly, long section header anchors

It is often a good idea to *lock-in* a good anchor name.

Sometimes the section header text makes for an unattractive anchor. [This one](#ugly-long-section-header-anchors) is pretty bad.

```html
[This one](#ugly-long-section-header-anchors) is pretty bad.
```

The greater danger is that **a future rewording of the header text would break** a link to this section.

For these reasons, it is often wise to add a custom anchor explicitly, just above the heading or
text to which it applies, using the special `{@a name}` syntax like this.

<code-example  language="html">
  &#123;@a ugly-anchors&#125;

  #### Ugly, long section header anchors
</code-example>

現在像之前一樣[連結到該自訂錨點名稱](#ugly-anchors)。

```html
Now [link to that custom anchor name](#ugly-anchors) as you did before.
```

<div class="alert is-helpful">

或者，你可以使用 HTML `<a>` 標籤。

如果你這樣做，請務必設定 `id` 屬性——而不是 `name` 屬性！文件產生器不會將 `name` 轉換為正確的連結 URL。

```html
<a id="anchors"></a>

## Anchors
```

</div>

## 警示與提示框

警示與提示框呈現警告、額外細節或對其他頁面的參照。它們也可以用來提供評論，_豐富_讀者對所呈現內容的理解。

警示或提示框_絕不能_包含對該理解至關重要的任何內容。不要將關鍵指令或教學步驟放在子章節中。

### 警示

警示吸引對簡短重要要點的注意。警示不應該用於多行內容（改用[提示框](#提示框 "callouts")）。

<div class="alert is-helpful">

  你將在[下面的小節](guide/docs-style-guide#live-examples "Live examples")中了解即時範例的風格。

</div>

  請注意，開頭與結尾 `<div>` 標籤之後都必須至少有一個空白行。在結尾 `</div>` 之前加一個空白行是慣例，但不是必須的。

```html
<div class="alert is-helpful">

You'll learn about styles for live examples in the [section below](guide/docs-style-guide#live-examples "Live examples").

</div>
```

有三種不同的_緊急程度_用來根據內容的嚴重性或重要性為警示設定樣式。

<div class="alert is-critical">

一個關鍵的提示。

</div>

<div class="alert is-important">

一個重要的提示。

</div>

<div class="alert is-helpful">

一個有幫助的資訊提示。

</div>

以下是這些警示的標記。

```html
<div class="alert is-critical">

A critical alert.

</div>

<div class="alert is-important">

An important alert.

</div>

<div class="alert is-helpful">

A helpful, informational alert.

</div>
```

### 提示框

提示框和警示一樣，都是為了吸引對重要要點的注意。當你想要一個引人注目的標頭與多行內容時，使用提示框。

如果你有超過兩個段落，請考慮建立新頁面或將其納入主要內容。

提示框使用與警示相同的_緊急程度_。

<div class="callout is-critical">

  <header>一個關鍵的重點</header>

**Pitchfork hoodie semiotics**, roof party pop-up _paleo_ messenger messenger bag cred Carles tousled Truffaut yr. Semiotics viral freegan VHS, Shoreditch disrupt McSweeney's. Intelligentsia kale chips Vice four dollar toast, Schlitz crucifix

</div>

<div class="callout is-important">

  <header>一個重要的重點</header>

**Pitchfork hoodie semiotics**, roof party pop-up _paleo_ messenger bag cred Carles tousled Truffaut yr. Semiotics viral freegan VHS, Shoreditch disrupt McSweeney's. Intelligentsia kale chips Vice four dollar toast, Schlitz crucifix

</div>

<div class="callout is-helpful">

  <header>一個有幫助或資訊性的重點</header>

**Pitchfork hoodie semiotics**, roof party pop-up _paleo_ messenger bag cred Carles tousled Truffaut yr. Semiotics viral freegan VHS, Shoreditch disrupt McSweeney's. Intelligentsia kale chips Vice four dollar toast, Schlitz crucifix

</div>

以下是最先的這些提示框的標記。

```html
<div class="callout is-critical">
<header>A critical point</header>

**Pitchfork hoodie semiotics**, roof party pop-up _paleo_ messenger bag cred Carles tousled Truffaut yr. Semiotics viral freegan VHS, Shoreditch disrupt McSweeney's. Intelligentsia kale chips Vice four dollar toast, Schlitz crucifix

</div>
```

請注意：
* 提示框標頭文字會被強制全部大寫
* 提示框主體可以用 markdown 撰寫
* `</header>` 標籤與 markdown 內容之間以一個空白行分隔

提示框是為了吸引使用者的注意。它們不適合隨意的旁白。請謹慎使用它們。

## 樹狀結構

樹可以表示階層式資料。

<div class='filetree'>

  <div class='file'>

    sample-dir
  </div>

  <div class='children'>

    <div class='file'>

      src
    </div>

    <div class='children'>

      <div class='file'>

        app
      </div>

      <div class='children'>

        <div class='file'>

          app.component.ts
        </div>

        <div class='file'>

          app.module.ts
        </div>

      </div>

      <div class='file'>

        styles.css
      </div>

      <div class='file'>

        tsconfig.json
      </div>

    </div>

    <div class='file'>

      node_modules ...
    </div>

    <div class='file'>

      package.json
    </div>

  </div>

</div>

以下是此檔案樹狀結構的標記。

```html
<div class='filetree'>
    <div class='file'>
        sample-dir
    </div>
    <div class='children'>
        <div class='file'>
          src
        </div>
        <div class='children'>
            <div class='file'>
              app
            </div>
            <div class='children'>
                <div class='file'>
                  app.component.ts
                </div>
                <div class='file'>
                  app.module.ts
                </div>
            </div>
            <div class='file'>
              styles.css
            </div>
            <div class='file'>
              tsconfig.json
            </div>
        </div>
        <div class='file'>
          node_modules ...
        </div>
        <div class='file'>
          package.json
        </div>
    </div>
</div>
```

## 表格

使用 HTML 表格來呈現表格資料。

<style>

  td, th {vertical-align: top}
</style>

<table>

  <tr>

    <th>Framework</th>
    <th>Task</th>
    <th>Speed</th>
  </tr>
  <tr>
    <td><code>AngularJS</code></td>
    <td>Routing</td>
    <td>Fast</td>
  </tr>
  <tr>
    <td><code>Angular v2</code></td>
    <td>Routing</td>

    <!-- can use markdown too; remember blank lines -->

    <td>

      *Faster*

    </td>

  </tr>

  <tr>

    <td><code>Angular v4</code></td>
    <td>Routing</td>
    <td>

      **Fastest :)**

    </td>

  </tr>

</table>

以下是此表格的標記。

```html
<style>
  td, th {vertical-align: top}
</style>

<table>
  <tr>
    <th>Framework</th>
    <th>Task</th>
    <th>Speed</th>
  </tr>
  <tr>
    <td><code>AngularJS</code></td>
    <td>Routing</td>
    <td>Fast</td>
  </tr>
  <tr>
    <td><code>Angular v2</code></td>
    <td>Routing</td>
    <!-- can use markdown too; remember blank lines -->
    <td>

      *Faster*

    </td>
  </tr>
  <tr>
    <td><code>Angular v4</code></td>
    <td>Routing</td>
    <td>

      **Fastest :)**

    </td>
  </tr>
</table>
```

## 圖片

<h3 class="no-toc">Image location</h3>

將圖片儲存在 `content/images` 目錄中，放在與指南頁面 URL 相同的資料夾中。
本「作者風格指南」頁面的圖片屬於 `content/images/guide/docs-style-guide` 資料夾。

Angular 文件產生會將這些圖片資料夾複製到_執行時期_位置 `generated/images`。
將圖片的 `src` 屬性設為以_該_目錄開頭。

以下是屬於本頁的「flying hero」圖片的 `src` 屬性。

```
src="generated/images/guide/docs-style-guide/flying-hero.png"
```

<h3 class="no-toc">Use the HTML <i>&lt;img&gt;</i> tag</h3>

**不要使用 markdown 圖片語法 \!\[\.\.\.\]\(\.\.\.\).**

圖片應該在 `<img>` 標籤中指定。

  為了無障礙，請務必設定 `alt` 屬性，並提供圖片的有意義描述。

你應該將 `<img>` 標籤巢狀放在 `<figure>` 標籤內，該標籤會將圖片置於帶有陰影的框架中設定樣式。你需要編輯的許可才能跳過 `<figure>` 標籤。

以下是一個符合規定的範例

<figure>
  <img src="generated/images/guide/docs-style-guide/flying-hero.png" alt="flying hero">
</figure>

```html
<figure>
  <img src="generated/images/guide/docs-style-guide/flying-hero.png"
       alt="flying hero">
</figure>
```

_請注意，HTML 圖片元素沒有結尾標籤。_

<h3 class="no-toc">Image dimensions</h3>

文件產生器會從檔案讀取圖片尺寸，並自動將 width 與 height 屬性加入 `img` 標籤。如果你想控制圖片的大小，請提供你自己的 width 與 height 屬性。

以下是以更合理比例呈現的「flying hero」。

<figure>
 <img src="generated/images/guide/docs-style-guide/flying-hero.png" alt="flying Angular hero" width="200">
</figure>

```html

<figure>
 <img src="generated/images/guide/docs-style-guide/flying-hero.png"
   alt="flying Angular hero"
   width="200">
</figure>
```

寬圖片可能會造成問題。大多數瀏覽器會試著重新縮放圖片，但在某些視口中，寬圖片可能會溢出文件。

**不要設定大於 700px 的寬度**。如果你希望顯示更大的圖片，請提供一個指向實際圖片的連結，讓使用者可以點擊以分開查看全尺寸圖片，如「Ahead-of-time Compilation」指南中 `source-map-explorer` 輸出的這個範例所示：

<a href="generated/images/guide/docs-style-guide/toh-pt6-bundle.png" title="Click to view larger image">
  <figure>
    <img src="generated/images/guide/docs-style-guide/toh-pt6-bundle-700w.png" alt="toh-pt6-bundle" width="300px">
  </figure>
</a>

<h3 class="no-toc">Image compression</h3>

大型圖片檔案載入緩慢，會損害使用者體驗。務必壓縮圖片。
考慮使用像 [tinypng](https://tinypng.com/ "tinypng") 這樣的圖片壓縮網站。

<h3 class="no-toc">Floating images</h3>

你可以分別套用 class="left" 或 class="right" 屬性，將圖片浮動到文字的左側或右側。

<img src="generated/images/guide/docs-style-guide/flying-hero.png"
   alt="flying Angular hero"
   width="200"
   class="left">

這段文字會環繞在浮動的「flying hero」圖片右側。

標題與 code-example 會自動清除浮動圖片。如果你需要強制某段文字清除浮動圖片，請在文字應中斷處加入 `<br class="clear">`。

<br class="clear">

上述範例的標記是：

```html
<img src="generated/images/guide/docs-style-guide/flying-hero.png"
   alt="flying Angular hero"
   width="200"
   class="left">

This text wraps around to the right of the floating "flying hero" image.

Headings and code-examples automatically clear a floating image. If you need to force a piece of text to clear a floating image, add `<br class="clear">` where the text should break.

<br class="clear">
```

請注意，你一般不會將浮動圖片包裝在 `<figure>` 元素中。

#### 在子章節內浮動

如果你在警示、提示框或子章節內有浮動圖片，最好將 `clear-fix` 類別套用到 `div` 上，以確保圖片不會溢出其容器。例如：

<div class="alert is-helpful clear-fix">

  <img src="generated/images/guide/docs-style-guide/flying-hero.png"
    alt="flying Angular hero"
    width="100"
    class="right">

  A subsection with **markdown** formatted text.

</div>

```html
<div class="alert is-helpful clear-fix">

  <img src="generated/images/guide/docs-style-guide/flying-hero.png"
    alt="flying Angular hero"
    width="100"
    class="right">

  A subsection with **markdown** formatted text.

</div>
```
