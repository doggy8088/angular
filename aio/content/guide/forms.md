# 表單

表單是商業應用程式的主力。
你使用表單來登入、提交求助請求、下訂單、預訂航班、
安排會議，以及執行無數其他的資料輸入任務。

在開發表單時，重要的是建立一個資料輸入體驗，
有效率且有效地引導使用者完成工作流程。

開發表單需要設計技巧（不在本頁的範圍內），以及框架對
*雙向資料繫結、變更追蹤、驗證與錯誤處理*的支援，
這些你將在本頁中學到。

本頁向你展示如何從頭建立一個簡單的表單。在這個過程中，你將學到如何：

* 以元件與範本建立 Angular 表單。
* 使用 `ngModel` 建立雙向資料繫結，以讀取與寫入輸入控制項的值。
* 追蹤表單控制項的狀態變更與有效性。
* 使用追蹤控制項狀態的特殊 CSS 類別提供視覺回饋。
* 向使用者顯示驗證錯誤，並啟用／停用表單控制項。
* 使用範本參照變數在 HTML 元素之間共享資訊。

你可以在 Stackblitz 中執行 <live-example></live-example>，並從那裡下載程式碼。

{@a template-driven}

## 範本驅動表單

你可以使用 Angular [範本語法](guide/template-syntax)撰寫範本，
搭配本頁所述的表單專屬指令與技巧來建立表單。

<div class="alert is-helpful">

  你也可以使用反應式（或模型驅動）做法來建立表單。
  然而，本頁著重於範本驅動表單。

</div>

你幾乎可以用 Angular 範本建立任何表單&mdash;登入表單、聯絡表單，以及幾乎任何商業表單。
你可以有創意地排列表單控制項、將它們繫結到資料、指定驗證規則並顯示驗證錯誤、
有條件地啟用或停用特定控制項、觸發內建的視覺回饋，等等。

Angular 處理了許多重複、樣板式的任務，讓這個過程變得容易，
否則你就得自己費力處理這些事。

你將學到如何建立一個像這樣的範本驅動表單：

<figure>
  <img src="generated/images/guide/forms/hero-form-1.png" alt="乾淨的表單">
</figure>

*Hero Employment Agency* 使用這個表單來維護英雄的個人資訊。
每個英雄都需要一份工作。為合適的英雄媒合合適的危機，是這家公司的使命。

這個表單的三個欄位中有兩個是必填的。必填欄位左側有一個綠色條，讓它們容易辨識。

如果你刪除英雄名稱，表單會以引人注目的樣式顯示驗證錯誤：

<figure>
  <img src="generated/images/guide/forms/hero-form-2.png" alt="無效，名稱必填">
</figure>

請注意，*Submit* 按鈕被停用了，輸入控制項左側的「必填」條從綠色變成紅色。

<div class="alert is-helpful">

  你可以用標準 CSS 自訂「必填」條的顏色與位置。

</div>

你將以小步驟建立這個表單：

1. 建立 `Hero` 模型類別。
1. 建立控制表單的元件。
1. 建立具有初始表單佈局的範本。
1. 使用 `ngModel` 雙向資料繫結語法，將資料屬性繫結到每個表單控制項。
1. 為每個表單輸入控制項加入 `name` 屬性。
1. 加入自訂 CSS 以提供視覺回饋。
1. 顯示與隱藏驗證錯誤訊息。
1. 以 *ngSubmit* 處理表單提交。
1. 在表單有效之前停用表單的 *Submit* 按鈕。

## 設定

建立一個名為 <code>angular-forms</code> 的新專案：

<code-example language="sh" class="code-shell">

  ng new angular-forms

</code-example>

## 建立 Hero 模型類別

當使用者輸入表單資料時，你將擷取他們的變更並更新模型的實例。
在你知道模型長什麼樣子之前，你無法佈局表單。

模型可以簡單到只是一個「屬性袋」，存放關於某個對應用程式重要的事物的事實。
這很能描述 `Hero` 類別，它有三個必填欄位（`id`、`name`、`power`）
與一個選填欄位（`alterEgo`）。

使用 Angular CLI，產生一個名為 `Hero` 的新類別：

<code-example language="sh" class="code-shell">

  ng generate class Hero

</code-example>

其內容如下：

<code-example path="forms/src/app/hero.ts" title="src/app/hero.ts">

</code-example>

這是一個需求很少、沒有行為的貧血模型。非常適合這個示範。

TypeScript 編譯器會為每個 `public` 建構子參數產生一個公開欄位，
並在你建立英雄時自動將參數的值指派給該欄位。

`alterEgo` 是選填的，所以建構子允許你省略它；請注意 `alterEgo?` 中的問號（?）。

你可以像這樣建立一個新英雄：

<code-example path="forms/src/app/hero-form/hero-form.component.ts" linenums="false" region="SkyDog">

</code-example>

## 建立表單元件

Angular 表單有兩個部分：以 HTML 為基礎的 _範本_，以及一個元件 _類別_，
以程式方式處理資料與使用者互動。
從類別開始，因為它簡要地說明了英雄編輯器能做什麼。

使用 Angular CLI，產生一個名為 `HeroForm` 的新元件：

<code-example language="sh" class="code-shell">

  ng generate component HeroForm

</code-example>

其內容如下：

<code-example path="forms/src/app/hero-form/hero-form.component.ts" linenums="false" title="src/app/hero-form/hero-form.component.ts (v1)" region="v1">

</code-example>

這個元件沒有什麼特別之處，沒有任何表單專屬的東西，
沒有什麼能將它與你先前寫過的任何元件區分開來。

理解這個元件只需要先前頁面所涵蓋的 Angular 概念。

* 這段程式碼匯入了 Angular 核心程式庫，以及你剛建立的 `Hero` 模型。
* `@Component` 的 selector 值 "app-hero-form" 表示你可以將這個表單以 `<app-hero-form>` 標籤放入父範本中。
* `templateUrl` 屬性指向範本 HTML 的獨立檔案。
* 你為 `model` 與 `powers` 定義了虛擬資料，正適合示範之用。

將來，你可以注入資料服務來取得與儲存真實資料，
或者將這些屬性公開為輸入與輸出
（見[範本語法](guide/template-syntax)頁面上的[輸入與輸出屬性](guide/template-syntax#inputs-outputs)），以便繫結到
父元件。這目前不用擔心，而這些未來的變更不會影響表單。

* 你加入了一個 `diagnostic` 屬性，回傳模型的 JSON 表示法。
它能幫助你在開發期間看清自己在做什麼；你給自己留了一個清理備註，稍後要將它丟棄。

## 修訂 *app.module.ts*

`app.module.ts` 定義應用程式的根模組。在其中，你標識將在應用程式中使用的外部模組，
並宣告屬於這個模組的元件，例如 `HeroFormComponent`。

因為範本驅動表單位於它們自己的模組中，你必須先將 `FormsModule` 加入應用程式模組的
`imports` 陣列，才能使用表單。

以以下內容更新它：

<code-example path="forms/src/app/app.module.ts" title="src/app/app.module.ts">

</code-example>

<div class="alert is-helpful">

  有兩個變更：

  1. 你匯入 `FormsModule`。

  1. 你將 `FormsModule` 加入 `@NgModule` 裝飾器中定義的 `imports` 清單。這讓應用程式
  能存取所有範本驅動表單功能，包括 `ngModel`。

</div>

<div class="alert is-important">

  如果某個元件、指令或管道屬於 `imports` 陣列中的某個模組，​_不要_​在 `declarations` 陣列中重新宣告它。
  如果它是由你撰寫、且應該屬於這個模組，​_就_​要在 `declarations` 陣列中宣告它。

</div>

## 修訂 *app.component.html*

`AppComponent` 是應用程式的根元件。它將承載新的 `HeroFormComponent`。

將其範本的內容取代為下列內容：

<code-example path="forms/src/app/app.component.html" title="src/app/app.component.html">

</code-example>

<div class="alert is-helpful">

  只有兩個變更。
  這個 `template` 只是由元件的 `selector` 屬性所標識的新元素標籤。
  這會在應用程式元件載入時顯示英雄表單。
  別忘了也要從類別主體中移除 `name` 欄位。

</div>

## 建立初始 HTML 表單範本

以下列內容更新範本檔案：

<code-example path="forms/src/app/hero-form/hero-form.component.html" region="start" title="src/app/hero-form/hero-form.component.html">

</code-example>

這裡的語言就是 HTML5。你呈現 `Hero` 的兩個欄位 `name` 與 `alterEgo`，
並在輸入框中開放它們讓使用者輸入。

*Name* `<input>` 控制項有 HTML5 的 `required` 屬性；
*Alter Ego* `<input>` 控制項則沒有，因為 `alterEgo` 是選填的。

你在底部加入了一個 *Submit* 按鈕，上面有一些類別用於樣式。

*你還沒有用到 Angular*。沒有繫結，也沒有額外的指令，只有佈局。

<div class="alert is-helpful">

  在範本驅動表單中，如果你已匯入 `FormsModule`，你不需要對 `<form>` 標籤做任何事，
  就能使用 `FormsModule`。繼續看下去，了解這是怎麼運作的。

</div>

`container`、`form-group`、`form-control` 與 `btn` 類別
來自 [Twitter Bootstrap](http://getbootstrap.com/css/)。這些類別純粹是裝飾性的。
Bootstrap 為表單增添了一點樣式。

<div class="callout is-important">

  <header>

  Angular 不使用 `container`、`form-group`、`form-control` 與 `btn` 類別，也
  不使用任何外部程式庫的樣式。Angular 應用程式可以使用任何 CSS 程式庫，或完全不使用。

</div>

若要加入樣式表，打開 `styles.css` 並在頂部加入下列匯入行：

<code-example path="forms/src/styles.1.css" linenums="false" title="src/styles.css">

</code-example>

## 以 _*ngFor_ 加入超能力

英雄必須從一份固定的、經機構核准的超能力清單中選擇一項超能力。
你會在內部維護這份清單（在 `HeroFormComponent` 中）。

你將為表單加入一個 `select`，
並使用 `ngFor` 將選項繫結到 `powers` 清單，
這個技巧先前在[顯示資料](guide/displaying-data)頁面中見過。

將下列 HTML 加入 *Alter Ego* 群組的*正下方*：

<code-example path="forms/src/app/hero-form/hero-form.component.html" linenums="false" title="src/app/hero-form/hero-form.component.html (powers)" region="powers">

</code-example>

這段程式碼為清單中的每項超能力重複 `<option>` 標籤。
`pow` 範本輸入變數在每次迭代中是不同的超能力；
你使用插值語法顯示它的名稱。

{@a ngModel}

## 以 _ngModel_ 進行雙向資料繫結

現在執行應用程式會令人失望。

<figure>
  <img src="generated/images/guide/forms/hero-form-3.png" alt="尚無繫結的早期表單">
</figure>

你沒有看到英雄資料，因為你還沒有繫結到 `Hero`。
你從先前的頁面中知道該怎麼做。
[顯示資料](guide/displaying-data)教授屬性繫結。
[使用者輸入](guide/user-input)展示如何以
事件繫結監聽 DOM 事件，以及如何以顯示的值更新元件屬性。

現在你需要同時顯示、監聽與抽取。

你可以使用你已知的技巧，但
你將改用新的 `[(ngModel)]` 語法，它
讓將表單繫結到模型變得容易。

找到 *Name* 的 `<input>` 標籤，並像這樣更新它：

<code-example path="forms/src/app/hero-form/hero-form.component.html" linenums="false" title="src/app/hero-form/hero-form.component.html (excerpt)" region="ngModelName-1">

</code-example>

<div class="alert is-helpful">

  你在輸入標籤之後加入了一個診斷用的插值，
  這樣你就能看清自己在做什麼。
  你給自己留了一個備註，做完後要將它丟棄。

</div>

注意這個繫結語法：`[(ngModel)]="..."`。

你需要再多加一樣東西來顯示資料。宣告
一個表單的範本變數。以
`#heroForm="ngForm"` 更新 `<form>` 標籤，如下所示：

<code-example path="forms/src/app/hero-form/hero-form.component.html" linenums="false" title="src/app/hero-form/hero-form.component.html (excerpt)" region="template-variable">

</code-example>

變數 `heroForm` 現在是對 `NgForm` 指令的參照，該指令掌管整個表單。

<div class="alert is-helpful">

  {@a ngForm}

  ### _NgForm_ 指令

  什麼 `NgForm` 指令？
  你並沒有加入 [NgForm](api/forms/NgForm) 指令。

  是 Angular 加的。Angular 自動建立 `NgForm` 指令，並將它附加到 `<form>` 標籤上。

  `NgForm` 指令為 `form` 元素補充了額外的功能。
  它持有你為帶有 `ngModel` 指令
  與 `name` 屬性的元素所建立的控制項，並監控它們的屬性，包括它們的有效性。
  它也有自己的 `valid` 屬性，只有在*每個包含的
  控制項*都有效時才為 true。

</div>

如果你現在執行應用程式，並開始在 *Name* 輸入框中輸入，
加入與刪除字元，你會看到它們在
插值文字中出現與消失。
在某個時刻，它可能看起來像這樣：

<figure>
  <img src="generated/images/guide/forms/ng-model-in-action.png" alt="ngModel 運作中">
</figure>

這個診斷證明了值確實從輸入框流向模型，又
流了回來。

<div class="alert is-helpful">

  這就是*雙向資料繫結*。
  如需更多資訊，請參閱
  [範本語法](guide/template-syntax)頁面上的
  [以 NgModel 進行雙向繫結](guide/template-syntax#ngModel)。

</div>

請注意，你也為 `<input>` 標籤加入了 `name` 屬性，並將它設為 "name"，
這對英雄的名稱來說很合理。任何唯一值都可以，但使用描述性的名稱有幫助。
當將 `[(ngModel)]` 與表單搭配使用時，定義 `name` 屬性是必要的。

<div class="alert is-helpful">

  在內部，Angular 建立 `FormControl` 實例，並
  將它們註冊到 Angular 附加在 `<form>` 標籤上的 `NgForm` 指令。
  每個 `FormControl` 都以你指派給 `name` 屬性的名稱註冊。
  詳見上一節[NgForm 指令](guide/forms#ngForm)。

</div>

為 *Alter Ego* 與 *Hero Power* 加入類似的 `[(ngModel)]` 繫結與 `name` 屬性。
你將丟棄輸入框的繫結訊息，
並加入一個新的繫結（在頂部）到元件的 `diagnostic` 屬性。
然後你就能確認雙向資料繫結*對整個英雄模型*都有效。

修訂後，表單的核心應該看起來像這樣：

<code-example path="forms/src/app/hero-form/hero-form.component.html" linenums="false" title="src/app/hero-form/hero-form.component.html (excerpt)" region="ngModel-2">

</code-example>

<div class="alert is-helpful">

  * 每個輸入元素都有一個 `id` 屬性，供 `label` 元素的 `for` 屬性使用，
  將標籤與其輸入控制項對應起來。
  * 每個輸入元素都有一個 `name` 屬性，這是 Angular 表單用來向表單註冊控制項所要求的。

</div>

如果你現在執行應用程式，並變更每個英雄模型屬性，表單可能顯示如下：

<figure>
  <img src="generated/images/guide/forms/ng-model-in-action-2.png" alt="ngModel 運作中">
</figure>

表單頂部附近的診斷
確認了你的所有變更都反映在模型中。

*刪除*頂部的 `{{diagnostic}}` 繫結，因為它已經完成了它的使命。

## 以 _ngModel_ 追蹤控制項狀態與有效性

在表單中使用 `ngModel`，你得到的不只是雙向資料繫結。它還會告訴
你使用者是否觸碰了控制項、值是否改變，或值是否變得無效。

*NgModel* 指令不只追蹤狀態；它還以反映狀態的特殊 Angular CSS 類別更新控制項。
你可以利用這些類別名稱來改變控制項的外觀。

<table>

  <tr>

    <th>

      狀態
    </th>

    <th>

      為 true 時的類別
    </th>

    <th>

      為 false 時的類別
    </th>

  </tr>

  <tr>

    <td>

      控制項已被造訪。
    </td>

    <td>

      <code>ng-touched</code>
    </td>

    <td>

      <code>ng-untouched</code>
    </td>

  </tr>

  <tr>

    <td>

      控制項的值已變更。
    </td>

    <td>

      <code>ng-dirty</code>
    </td>

    <td>

      <code>ng-pristine</code>
    </td>

  </tr>

  <tr>

    <td>

      控制項的值有效。
    </td>

    <td>

      <code>ng-valid</code>
    </td>

    <td>

      <code>ng-invalid</code>
    </td>

  </tr>

</table>

暫時為 _Name_ `<input>` 標籤加入一個名為 `spy` 的[範本參照變數](guide/template-syntax#ref-vars)，
並用它來顯示輸入的 CSS 類別。

<code-example path="forms/src/app/hero-form/hero-form.component.html" linenums="false" title="src/app/hero-form/hero-form.component.html (excerpt)" region="ngModelName-2">

</code-example>

現在執行應用程式，看看 _Name_ 輸入框。
請*精確地*照下列步驟做：

1. 只看不要碰。
1. 點擊名稱框內部，然後點擊它外面。
1. 在名稱末尾加入斜線。
1. 清除名稱。

動作與效果如下：

<figure>
  <img src="generated/images/guide/forms/control-state-transitions-anim.gif" alt="控制項狀態轉換">
</figure>

你應該會看到下列轉換與類別名稱：

<figure>
  <img src="generated/images/guide/forms/ng-control-class-changes.png" alt="控制項狀態轉換">
</figure>

`ng-valid`/`ng-invalid` 這一對是最有趣的，因為你想在值無效時發出
強烈的視覺訊號。你也想標記必填欄位。
若要建立這樣的視覺回饋，請為 `ng-*` CSS 類別加入定義。

*刪除* `#spy` 範本參照變數與 `TODO`，因為它們已經完成了使命。

## 加入自訂 CSS 以提供視覺回饋

你可以用輸入框左側的彩色條，同時標記必填欄位與無效資料：

<figure>
  <img src="generated/images/guide/forms/validity-required-indicator.png" alt="無效的表單">
</figure>

你可以將這些類別定義加入一個新的 `forms.css` 檔案來達到這個效果，
該檔案加入專案中，作為 `index.html` 的同層檔案：

<code-example path="forms/src/assets/forms.css" title="src/assets/forms.css">

</code-example>

更新 `index.html` 的 `<head>`，以包含這個樣式表：

<code-example path="forms/src/index.html" linenums="false" title="src/index.html (styles)" region="styles">

</code-example>

## 顯示與隱藏驗證錯誤訊息

你可以改進這個表單。_Name_ 輸入框是必填的，清除它會讓條變成紅色。
這表示有地方不對，但使用者不知道*哪裡*不對或該怎麼做。
利用控制項的狀態來顯示一個有幫助的訊息。

當使用者刪除名稱時，表單應該看起來像這樣：

<figure>
  <img src="generated/images/guide/forms/name-required-error.png" alt="名稱必填">
</figure>

若要達到這個效果，請以下列內容擴充 `<input>` 標籤：

* 一個[範本參照變數](guide/template-syntax#ref-vars)。
* 附近 `<div>` 中的「*必填*」訊息，你只在控制項無效時顯示它。

這是加入 _name_ 輸入框的錯誤訊息範例：

<code-example path="forms/src/app/hero-form/hero-form.component.html" linenums="false" title="src/app/hero-form/hero-form.component.html (excerpt)" region="name-with-error-msg">

</code-example>

你需要一個範本參照變數，以便從範本內部存取輸入框的 Angular 控制項。
在這裡，你建立了一個名為 `name` 的變數，並賦予它 "ngModel" 這個值。

<div class="alert is-helpful">

  為什麼是 "ngModel"？
  指令的 [exportAs](api/core/Directive) 屬性
  告訴 Angular 如何將參照變數連結到指令。
  你將 `name` 設為 `ngModel`，因為 `ngModel` 指令的 `exportAs` 屬性恰好是 "ngModel"。

</div>

你透過將 `name`
控制項的屬性繫結到訊息 `<div>` 元素的 `hidden` 屬性，來控制名稱錯誤訊息的可見性。

<code-example path="forms/src/app/hero-form/hero-form.component.html" linenums="false" title="src/app/hero-form/hero-form.component.html (hidden-error-msg)" region="hidden-error-msg">

</code-example>

在這個範例中，你在控制項有效或處於 pristine 狀態時隱藏訊息；
「pristine」表示使用者自它在此表單中顯示以來尚未變更該值。

這種使用者體驗是開發者的選擇。有些開發者希望訊息一直顯示。
如果你忽略 `pristine` 狀態，你只會在值有效時隱藏訊息。
如果你帶著一個新的（空白）英雄或一個無效的英雄來到這個元件，
你會立即看到錯誤訊息，在你做任何事之前。

有些開發者希望訊息只在使用者做出無效變更時顯示。
在控制項處於 "pristine" 狀態時隱藏訊息，就是為了達成這個目標。
當你為表單加入新英雄時，你會看到這個選擇的意義。

英雄的 *Alter Ego* 是選填的，所以你可以不管它。

英雄的 *Power* 選擇是必填的。
如果你想的話，你可以為 `<select>` 加入同樣的錯誤處理，
但這不是絕對必要，因為選擇框已經將
超能力限制在有效值之內了。

現在你將為這個表單加入一位新英雄。
在表單底部放置一個 *New Hero* 按鈕，並將它的 click 事件繫結到 `newHero` 元件方法。

<code-example path="forms/src/app/hero-form/hero-form.component.html" region="new-hero-button-no-reset" title="src/app/hero-form/hero-form.component.html (New Hero button)">

</code-example>

<code-example path="forms/src/app/hero-form/hero-form.component.ts" region="new-hero" title="src/app/hero-form/hero-form.component.ts (New Hero method)" linenums="false">

</code-example>

再次執行應用程式，點擊 *New Hero* 按鈕，表單會被清除。
輸入框左側的*必填*條是紅色的，表示 `name` 與 `power` 屬性無效。
這可以理解，因為這些是必填欄位。
錯誤訊息被隱藏了，因為表單處於 pristine 狀態；你還沒有變更任何東西。

輸入一個名稱，再次點擊 *New Hero*。
應用程式顯示了 _Name is required_ 錯誤訊息。
當你建立一個新的（空白）英雄時，你不想要錯誤訊息。
為什麼現在會有一個？

在瀏覽器工具中檢查元素會發現，*name* 輸入框*不再是 pristine*。
表單記得你在點擊 *New Hero* 之前輸入過名稱。
取代英雄物件*並沒有恢復*表單控制項的 pristine 狀態。

你必須以命令式方式清除所有的旗標，你可以
在呼叫 `newHero()` 方法之後呼叫表單的 `reset()` 方法來做到這一點。

<code-example path="forms/src/app/hero-form/hero-form.component.html" region="new-hero-button-form-reset" title="src/app/hero-form/hero-form.component.html (Reset the form)">

</code-example>

現在點擊 "New Hero" 會同時重置表單及其控制項旗標。

## 以 _ngSubmit_ 提交表單

使用者在填寫完之後應該能夠提交這個表單。
表單底部的 *Submit* 按鈕
本身什麼也不做，但它會
因為它的類型（`type="submit"`）而觸發表單提交。

「表單提交」目前沒有用處。
為了讓它有用，將表單的 `ngSubmit` 事件屬性
繫結到英雄表單元件的 `onSubmit()` 方法：

<code-example path="forms/src/app/hero-form/hero-form.component.html" linenums="false" title="src/app/hero-form/hero-form.component.html (ngSubmit)" region="ngSubmit">

</code-example>

你先前已經定義了一個範本參照變數
`#heroForm`，並將它以值 "ngForm" 初始化。
現在，使用那個變數搭配 Submit 按鈕來存取表單。

你將透過
`heroForm` 變數，將表單的整體有效性繫結到按鈕的 `disabled` 屬性，
使用事件繫結。程式碼如下：

<code-example path="forms/src/app/hero-form/hero-form.component.html" linenums="false" title="src/app/hero-form/hero-form.component.html (submit-button)" region="submit-button">

</code-example>

如果你現在執行應用程式，你會發現按鈕已啟用&mdash;雖然
它還沒有做任何有用的事。

現在如果你刪除名稱，你就違反了「必填」規則，這
會在錯誤訊息中被適當地記錄下來。
*Submit* 按鈕也會被停用。

沒有印象深刻？ 想一想。如果沒有 Angular 的幫助，
你必須做什麼才能將按鈕的啟用／停用狀態與表單的有效性連接起來？

對你來說，它就這麼簡單：

1. 在（增強的）表單元素上定義一個範本參照變數。
2. 在許多行之外的按鈕中參照那個變數。

## 切換兩個表單區域（額外挑戰）

目前提交表單並不是非常戲劇化。

<div class="alert is-helpful">

  對示範來說，這是個不意外的觀察。老實說，
  把它搞得花俏並不會讓你學到任何新的表單知識。
  但這是一個練習你剛學到的
  繫結技巧的機會。
  如果你不感興趣，請跳到本頁的結論。

</div>

為了製造更引人注目的視覺效果，
隱藏資料輸入區域並顯示其他東西。

將表單包在一個 `<div>` 中，並將
它的 `hidden` 屬性繫結到 `HeroFormComponent.submitted` 屬性。

<code-example path="forms/src/app/hero-form/hero-form.component.html" linenums="false" title="src/app/hero-form/hero-form.component.html (excerpt)" region="edit-div">

</code-example>

主表單從一開始就可見，因為
`submitted` 屬性為 false，直到你提交表單，
正如 `HeroFormComponent` 的這個片段所顯示的：

<code-example path="forms/src/app/hero-form/hero-form.component.ts" linenums="false" title="src/app/hero-form/hero-form.component.ts (submitted)" region="submitted">

</code-example>

當你點擊 *Submit* 按鈕時，`submitted` 旗標變為 true，表單如計劃般
消失。

現在應用程式需要在表單處於已提交狀態時顯示其他東西。
將下列 HTML 加入你剛寫的 `<div>` 包裹元素下方：

<code-example path="forms/src/app/hero-form/hero-form.component.html" linenums="false" title="src/app/hero-form/hero-form.component.html (excerpt)" region="submitted">

</code-example>

英雄再次出現，以唯讀方式搭配插值繫結顯示。
這個 `<div>` 只在元件處於已提交狀態時出現。

這段 HTML 包含一個 *Edit* 按鈕，它的 click 事件繫結到一個清除 `submitted` 旗標的運算式。

當你點擊 *Edit* 按鈕時，這個區塊消失，可編輯的表單重新出現。

## 總結

本頁討論的 Angular 表單利用了下列
框架功能，為資料修改、驗證等提供支援：

* Angular HTML 表單範本。
* 一個帶有 `@Component` 裝飾器的表單元件類別。
* 透過繫結到 `NgForm.ngSubmit` 事件屬性來處理表單提交。
* 範本參照變數，例如 `#heroForm` 與 `#name`。
* 用於雙向資料繫結的 `[(ngModel)]` 語法。
* 將 `name` 屬性用於驗證與表單元素變更追蹤。
* 輸入控制項上參照變數的 `valid` 屬性，用來檢查控制項是否有效並顯示／隱藏錯誤訊息。
* 透過繫結到 `NgForm` 的有效性，控制 *Submit* 按鈕的啟用狀態。
* 自訂 CSS 類別，向使用者提供關於無效控制項的視覺回饋。

這是應用程式最終版本的程式碼：

<code-tabs>

  <code-pane title="hero-form/hero-form.component.ts" path="forms/src/app/hero-form/hero-form.component.ts" region="final">

  </code-pane>

  <code-pane title="hero-form/hero-form.component.html" path="forms/src/app/hero-form/hero-form.component.html" region="final">

  </code-pane>

  <code-pane title="hero.ts" path="forms/src/app/hero.ts">

  </code-pane>

  <code-pane title="app.module.ts" path="forms/src/app/app.module.ts">

  </code-pane>

  <code-pane title="app.component.html" path="forms/src/app/app.component.html">

  </code-pane>

  <code-pane title="app.component.ts" path="forms/src/app/app.component.ts">

  </code-pane>

  <code-pane title="main.ts" path="forms/src/main.ts">

  </code-pane>

  <code-pane title="forms.css" path="forms/src/assets/forms.css">

  </code-pane>

</code-tabs>
