# 建立範本驅動表單

{@a template-driven}

本教學將示範如何建立範本驅動表單，其控制元素綁定到資料屬性，並透過輸入驗證來維護資料完整性與樣式，進而改善使用者體驗。

範本驅動表單使用[雙向資料綁定](guide/architecture-components#資料繫結 "Intro to 2-way data binding")，在範本發生變更時更新元件中的資料模型，反之亦然。

<div class="alert is-helpful">

Angular 支援互動式表單的兩種設計方法。你可以使用 Angular 的[範本語法與指令](guide/glossary#範本template "Definition of template terms")撰寫範本，搭配本教學說明的表單專用指令與技巧來建立表單，也可以使用反應式（或模型驅動）方法來建立表單。

範本驅動表單適合小型或簡單的表單，而反應式表單更具擴充性，適合複雜的表單。若要比較這兩種方法，請見[表單簡介](guide/forms-overview "Overview of Angular forms.")。

</div>

你幾乎可以使用 Angular 範本建立任何種類的表單&mdash;登入表單、聯絡表單，以及幾乎任何業務表單。你可以自由安排控制項的版面，並將它們綁定到物件模型中的資料。你可以指定驗證規則並顯示驗證錯誤、依條件啟用或停用特定控制項、觸發內建的視覺回饋，還有更多功能。

本教學會向你展示如何從頭開始建立一個表單，並以類似 [Tour of Heroes 教學](tutorial "Tour of Heroes")中的簡化範例表單說明相關技巧。

<div class="alert is-helpful">

  執行或下載範例應用程式：<live-example></live-example>。

</div>

## 學習目標

本教學將教你如何完成以下事項：

* 使用元件與範本建立 Angular 表單。
* 使用 `ngModel` 建立雙向資料綁定，以讀取與寫入輸入控制項的值。
* 使用追蹤控制項狀態的特殊 CSS 類別提供視覺回饋。
* 向使用者顯示驗證錯誤，並根據表單狀態啟用或停用表單控制項。
* 使用[範本參照變數](guide/template-reference-variables)在 HTML 元素之間共用資訊。

## 先決條件

在進一步了解範本驅動表單之前，你應該對下列內容有基本的了解。

* [TypeScript](https://www.typescriptlang.org/ "The TypeScript language")與 HTML5 程式設計。
* Angular 應用程式設計基礎，如 [Angular 概念](guide/architecture "Introduction to Angular concepts.")所述。
* [Angular 範本語法](guide/template-syntax "Template syntax guide")的基礎。
* [表單簡介](guide/forms-overview "Overview of Angular forms.")中所介紹的表單設計概念。

{@a intro}

## 建立範本驅動表單

範本驅動表單依賴 `FormsModule` 中定義的指令。

* `NgModel` 指令協調附加表單元素的值變更與資料模型的變更，讓你能以輸入驗證與錯誤處理來回應使用者輸入。

* `NgForm` 指令建立頂層 `FormGroup` 執行個體，並將它綁定到 `<form>` 元素，以追蹤彙總的表單值與驗證狀態。只要你匯入 `FormsModule`，這個指令預設就會在所有 `<form>` 標籤上啟用。你不需要加入特殊的選擇器。

* `NgModelGroup` 指令建立 `FormGroup` 執行個體，並將它綁定到 DOM 元素。

### 範例應用程式

本指南中的範例表單供*英雄就業仲介所*用來維護英雄的個人資訊。每位英雄都需要一份工作。這個表單能協助仲介所為合適的英雄配對合適的危機。

<div class="lightbox">
  <img src="generated/images/guide/forms/hero-form-1.png" alt="乾淨的表單">
</div>

這個表單突顯了一些讓它更容易使用的設計特色。例如，兩個必填欄位的左側有一條綠色橫條，讓它們容易辨認。這些欄位有初始值，因此表單是有效的，且 **Submit** 按鈕已啟用。

在使用這個表單的過程中，你將學會如何加入驗證邏輯、如何使用標準 CSS 自訂呈現方式，以及如何處理錯誤情況以確保輸入有效。例如，如果使用者刪除了英雄姓名，表單就會變成無效。應用程式會偵測到狀態的改變，並以引人注目的樣式顯示驗證錯誤。此外，**Submit** 按鈕會被停用，且輸入控制項左側的「required」橫條會從綠色變為紅色。

<div class="lightbox">
  <img src="generated/images/guide/forms/hero-form-2.png" alt="無效，名稱為必填">
</div>

### 步驟概覽

在本教學中，你將依照以下步驟，把範例表單綁定到資料並處理使用者輸入。

1. 建立基本表單。
   * 定義範例資料模型。
   * 加入必要的基礎設施，例如 `FormsModule`。
2. 使用 `ngModel` 指令與雙向資料綁定語法，將表單控制項綁定到資料屬性。
   * 檢視 `ngModel` 如何使用 CSS 類別回報控制項狀態。
   * 為控制項命名，讓 `ngModel` 可以存取它們。
3. 使用 `ngModel` 追蹤輸入有效性與控制項狀態。
   * 加入自訂 CSS，針對狀態提供視覺回饋。
   * 顯示與隱藏驗證錯誤訊息。
4. 回應原生 HTML 按鈕的點擊事件，將資料加入模型。
5. 使用表單的 [`ngSubmit`](api/forms/NgForm#properties) 輸出屬性處理表單提交。
   * 在表單有效之前停用 **Submit** 按鈕。
   * 提交後，將完成的表單換成頁面上的其他內容。

{@a step1}

## 建立表單

你可以根據此處提供的程式碼重新建立範例應用程式，也可以檢視或下載 <live-example></live-example>。

1. 提供的範例應用程式建立了 `Hero` 類別，其中定義了表單所反映的資料模型。

   <code-example path="forms/src/app/hero.ts" header="src/app/hero.ts"></code-example>

2. 表單的版面與詳細內容定義在 `HeroFormComponent` 類別中。

   <code-example path="forms/src/app/hero-form/hero-form.component.ts" header="src/app/hero-form/hero-form.component.ts (v1)" region="v1"></code-example>

   元件的 `selector` 值為 "app-hero-form"，表示你可以使用 `<app-hero-form>` 標籤，將這個表單放入父範本中。

3. 下列程式碼會建立一個新的英雄執行個體，讓初始表單可以顯示一位範例英雄。

   <code-example path="forms/src/app/hero-form/hero-form.component.ts" region="SkyDog"></code-example>

   這個示範對 `model` 與 `powers` 使用假資料。在真實應用程式中，你會注入資料服務來取得與儲存真實資料，或將這些屬性公開為輸入與輸出。

4. 應用程式啟用表單功能，並註冊所建立的表單元件。

   <code-example path="forms/src/app/app.module.ts" header="src/app/app.module.ts"></code-example>

5. 表單顯示在根元件範本所定義的應用程式版面中。

   <code-example path="forms/src/app/app.component.html" header="src/app/app.component.html"></code-example>

   初始範本定義了一個表單的版面配置，包含兩個表單群組與一個提交按鈕。表單群組對應 Hero 資料模型的兩個屬性：name 與 alterEgo。每個群組都有一個標籤與一個供使用者輸入的方框。

   * **Name** `<input>` 控制元素具有 HTML5 的 `required` 屬性。
   * **Alter Ego** `<input>` 控制元素則沒有，因為 `alterEgo` 是選擇性的。

   **Submit** 按鈕上有一些用於樣式的類別。在這個階段，表單版面完全是純 HTML5，沒有任何綁定或指令。

6. 範例表單使用 [Twitter Bootstrap](https://getbootstrap.com/css/) 的一些樣式類別：`container`、`form-group`、`form-control` 與 `btn`。若要使用這些樣式，應用程式的樣式表會匯入該程式庫。

   <code-example path="forms/src/styles.1.css" header="src/styles.css"></code-example>

7. 這個表單會讓英雄應徵者從仲介所核准的固定超能力清單中選擇一項超能力。預先定義的 `powers` 清單是資料模型的一部分，由 `HeroFormComponent` 內部維護。Angular 的 [NgForOf 指令](api/common/NgForOf "API reference")會迭代資料值，以填入 `<select>` 元素。

   <code-example path="forms/src/app/hero-form/hero-form.component.html" header="src/app/hero-form/hero-form.component.html (powers)" region="powers"></code-example>

如果你現在執行應用程式，你會在選取控制項中看到技能清單。輸入元素尚未綁定到資料值或事件，因此它們仍然是空白的，而且沒有任何行為。

<div class="lightbox">
  <img src="generated/images/guide/forms/hero-form-3.png" alt="無繫結的早期表單">
</div>

{@a ngModel}

## 將輸入控制項綁定到資料屬性

下一步是使用雙向資料綁定，將輸入控制項綁定到 `Hero` 中對應的屬性，讓它們在使用者輸入時更新資料模型，也能在資料發生程式化變更時更新顯示。

`FormsModule` 中宣告的 `ngModel` 指令，讓你可以將範本驅動表單中的控制項綁定到資料模型中的屬性。當你使用雙向資料綁定語法 `[(ngModel)]` 加入這個指令時，Angular 可以追蹤控制項的值與使用者互動，並讓檢視與模型保持同步。

1. 編輯範本檔案 `hero-form.component.html`。

2. 找到 **Name** 標籤旁的 `<input>` 標籤。

3. 加入 `ngModel` 指令，使用雙向資料綁定語法 `[(ngModel)]="..."`。

<code-example path="forms/src/app/hero-form/hero-form.component.html" header="src/app/hero-form/hero-form.component.html (excerpt)" region="ngModelName-1"></code-example>

<div class="alert is-helpful">

這個範例在每個輸入標籤後面都有一個暫時的診斷插值 `{{model.name}}`，用來顯示對應屬性的目前資料值。這個註記提醒你，在觀察完雙向資料綁定的運作後，要移除診斷行。

</div>

{@a ngForm}

### 存取整體表單狀態

當你在元件中匯入 `FormsModule` 時，Angular 會自動在範本的 `<form>` 標籤上建立並附加一個 [NgForm](api/forms/NgForm "API reference for NgForm") 指令（因為 `NgForm` 的選擇器 `form` 與 `<form>` 元素相符）。

若要存取 `NgForm` 與整體表單狀態，請宣告一個[範本參照變數](guide/template-reference-variables)。

1. 編輯範本檔案 `hero-form.component.html`。

2. 使用範本參照變數 `#heroForm` 更新 `<form>` 標籤，並如下設定它的值。

   <code-example path="forms/src/app/hero-form/hero-form.component.html" header="src/app/hero-form/hero-form.component.html (excerpt)" region="template-variable"></code-example>

   `heroForm` 範本變數現在是控管整個表單的 `NgForm` 指令執行個體的參照。

3. 執行應用程式。

4. 開始在 **Name** 輸入框中輸入。

  當你新增與刪除字元時，你可以看到它們在資料模型中出現與消失。例如：

   <div class="lightbox">
     <img src="generated/images/guide/forms/ng-model-in-action.png" alt="ngModel 實際運作">
   </div>

  顯示插值值的診斷行證明了值確實從輸入框流向模型，再流回來。

### 為控制元素命名

當你在元素上使用 `[(ngModel)]` 時，你必須為該元素定義 `name` 屬性。Angular 會使用指定的名稱，向附加在父 `<form>` 元素上的 `NgForm` 指令註冊該元素。

範例為 `<input>` 元素加入了 `name` 屬性，並將它設為 "name"，這對英雄的姓名來說很合理。任何唯一值都可以，但使用具描述性的名稱會更有幫助。

1. 為 **Alter Ego** 與 **Hero Power** 加入類似的 `[(ngModel)]` 綁定與 `name` 屬性。

2. 現在你可以移除顯示插值值的診斷訊息。

3. 若要確認雙向資料綁定對整個英雄模型都有效，請在元件範本頂端加入一個新的文字綁定，使用 [`json` 管道](api/common/JsonPipe)（它會將資料序列化為字串）。

完成這些修改後，表單範本應該如下所示：

<code-example path="forms/src/app/hero-form/hero-form.component.html" header="src/app/hero-form/hero-form.component.html (excerpt)" region="ngModel-2"></code-example>

* 請注意每個 `<input>` 元素都有一個 `id` 屬性。`<label>` 元素的 `for` 屬性會使用它，將標籤與其輸入控制項對應起來。這是[標準的 HTML 功能](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/label)。

* 每個 `<input>` 元素也都有必要的 `name` 屬性，Angular 會使用它向表單註冊控制項。

如果你現在執行應用程式並變更每個英雄模型的屬性，表單可能會顯示如下：

<div class="lightbox">
  <img src="generated/images/guide/forms/ng-model-in-action-2.png" alt="ngModel 實際運作">
</div>

表單頂部附近的診斷資訊確認你所有的變更都已反映在模型中。

4. 觀察完效果後，你可以刪除 `{{ model | json }}` 文字綁定。

## 追蹤控制項狀態

控制項上的 `NgModel` 指令會追蹤該控制項的狀態。它會告訴你使用者是否觸碰過控制項、值是否已變更，或值是否已變成無效。Angular 會在控制項元素上設定特殊的 CSS 類別來反映狀態，如下表所示。

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

此外，Angular 也會在提交時將 `ng-submitted` 類別套用到 `<form>` 元素。這個類別*不會*套用到內部的控制項。

你可以使用這些 CSS 類別，根據控制項的狀態定義其樣式。

### 觀察控制項狀態

若要查看框架如何加入與移除這些類別，請開啟瀏覽器的開發人員工具，檢查代表英雄姓名的 `<input>` 元素。

1. 使用瀏覽器的開發人員工具，找到對應到 **Name** 輸入框的 `<input>` 元素。你可以看到該元素除了 "form-control" 之外，還有多個 CSS 類別。

2. 當你第一次開啟它時，這些類別表示它有一個有效的值、該值自初始化或重設後尚未變更，且控制項自初始化或重設後尚未被造訪。

   ```
   <input ... class="form-control ng-untouched ng-pristine ng-valid" ...>
   ```

3. 在 **Name** `<input>` 方框上執行以下操作，並觀察哪些類別出現。
   * 只看不要碰。這些類別表示它是未碰觸、未變更且有效的。
   * 點按姓名方框內部，然後點按方框外部。控制項現在已被造訪，元素具有 `ng-touched` 類別，而不是 `ng-untouched` 類別。
   * 在姓名末尾加上斜線。它現在是已碰觸且已變更的。
   * 清除姓名。這會使值無效，因此 `ng-invalid` 類別會取代 `ng-valid` 類別。

### 為狀態建立視覺回饋

`ng-valid`/`ng-invalid` 這一對特別值得注意，因為當值無效時，你會想要送出強烈的視覺訊號。你也會想要標示必填欄位。

你可以同時標示必填欄位與無效資料，方法是在輸入框左側加上一個彩色長條：

<div class="lightbox">
  <img src="generated/images/guide/forms/validity-required-indicator.png" alt="無效的表單">
</div>

若要以這種方式變更外觀，請執行以下步驟。

1. 為 `ng-*` CSS 類別加入定義。

2. 將這些類別定義加入新的 `forms.css` 檔案。

3. 將新檔案加入專案，作為 `index.html` 的同層檔案：

   <code-example path="forms/src/assets/forms.css" header="src/assets/forms.css"></code-example>

4. 在 `index.html` 檔案中，更新 `<head>` 標籤以包含新的樣式表。

   <code-example path="forms/src/index.html" header="src/index.html (styles)" region="styles"></code-example>

### 顯示與隱藏驗證錯誤訊息

**Name** 輸入框是必填的，清除它會讓長條變成紅色。這表示有地方出錯了，但使用者不知道哪裡出錯，也不知道該怎麼做。你可以透過檢查並回應控制項的狀態，提供有幫助的訊息。

當使用者刪除姓名時，表單應如下所示：

<div class="lightbox">
  <img src="generated/images/guide/forms/name-required-error.png" alt="名稱為必填">
</div>

**Hero Power** 選取方框也是必填的，但它不需要這種錯誤處理，因為選取方框本身已將選項限制在有效值內。

若要在適當時機定義並顯示錯誤訊息，請執行以下步驟。

1. 擴充 `<input>` 標籤，加入一個範本參照變數，你可以用它在範本內存取輸入框的 Angular 控制項。在這個範例中，該變數是 `#name="ngModel"`。

   <div class="alert is-helpful">

     範本參照變數（`#name`）被設為 `"ngModel"`，因為那是 [`NgModel.exportAs`](api/core/Directive#exportAs) 屬性的值。這個屬性會告訴 Angular 如何將參照變數連結到指令。

   </div>

2. 加入一個包含適當錯誤訊息的 `<div>`。
3. 將 `name` 控制項的屬性綁定到訊息 `<div>` 元素的 `hidden` 屬性，以顯示或隱藏錯誤訊息。

   <code-example path="forms/src/app/hero-form/hero-form.component.html" header="src/app/hero-form/hero-form.component.html (hidden-error-msg)" region="hidden-error-msg"></code-example>

4. 如下列範例所示，為 _name_ 輸入框加入一個條件式錯誤訊息。

   <code-example path="forms/src/app/hero-form/hero-form.component.html" header="src/app/hero-form/hero-form.component.html (excerpt)" region="name-with-error-msg"></code-example>

<div class="callout is-helpful">

<header>說明「pristine」狀態</header>

在這個範例中，當控制項有效或處於 *pristine* 狀態時，你會隱藏訊息。Pristine 表示使用者自該值顯示在此表單中以來尚未變更它。如果你忽略 `pristine` 狀態，就只會在值有效時才隱藏訊息。如果你帶著一位新的空白英雄或一位無效的英雄進入這個元件，在你做任何事之前，就會立即看到錯誤訊息。

你可能希望訊息只在使用者做出無效變更時才顯示。在控制項處於 `pristine` 狀態時隱藏訊息，就能達到這個目標。當你在下一步為表單加入新的英雄時，你會看到這個選擇的重要性。

</div>

## 新增英雄

這個練習示範如何回應原生 HTML 按鈕的點擊事件，將資料加入模型。若要讓表單使用者新增一位英雄，你會加入一個 **New Hero** 按鈕來回應點擊事件。

1. 在範本中，將一個 "New Hero" `<button>` 元素放在表單底部。
2. 在元件檔案中，將建立英雄的方法加入英雄資料模型。

   <code-example path="forms/src/app/hero-form/hero-form.component.ts" region="new-hero" header="src/app/hero-form/hero-form.component.ts (New Hero method)"></code-example>

3. 將按鈕的點擊事件綁定到建立英雄的方法 `newHero()`。

   <code-example path="forms/src/app/hero-form/hero-form.component.html" region="new-hero-button-no-reset" header="src/app/hero-form/hero-form.component.html (New Hero button)"></code-example>

4. 再次執行應用程式，並點按 **New Hero** 按鈕。

   表單會被清除，輸入框左側的 *required* 長條是紅色的，表示 `name` 與 `power` 屬性無效。請注意錯誤訊息是隱藏的。這是因為表單處於 pristine 狀態；你還沒有變更任何東西。

5. 輸入姓名，再次點按 **New Hero**。

   現在應用程式會顯示 _Name is required_ 錯誤訊息，因為輸入框不再是 pristine 狀態。表單記得你在點按 **New Hero** 之前輸入過姓名。

6. 若要還原表單控制項的 pristine 狀態，請在呼叫 `newHero()` 方法後，呼叫表單的 `reset()` 方法，以命令式方式清除所有旗標。

   <code-example path="forms/src/app/hero-form/hero-form.component.html" region="new-hero-button-form-reset" header="src/app/hero-form/hero-form.component.html (Reset the form)"></code-example>

   現在點按 **New Hero** 會同時重設表單與其控制項旗標。

<div class="alert is-helpful">

若要進一步了解如何使用事件綁定監聽 DOM 事件並更新對應的元件屬性，請見 [User Input](guide/user-input) 指南。

</div>

## 使用 _ngSubmit_ 提交表單

使用者應該能在填寫完這個表單後提交它。表單底部的 **Submit** 按鈕本身沒有任何作用，但它確實會因為其類型（`type="submit"`）而觸發表單提交事件。若要回應這個事件，請執行下列步驟。

1. 將表單的 [`ngSubmit`](api/forms/NgForm#properties) 事件屬性綁定到 hero-form 元件的 `onSubmit()` 方法。

   <code-example path="forms/src/app/hero-form/hero-form.component.html" header="src/app/hero-form/hero-form.component.html (ngSubmit)" region="ngSubmit"></code-example>

2. 使用範本參照變數 `#heroForm` 來存取包含 **Submit** 按鈕的表單，並建立一個事件綁定。你將把表示表單整體有效性的表單屬性，綁定到 **Submit** 按鈕的 `disabled` 屬性。

   <code-example path="forms/src/app/hero-form/hero-form.component.html" header="src/app/hero-form/hero-form.component.html (submit-button)" region="submit-button"></code-example>

3. 現在執行應用程式。請注意，按鈕已啟用&mdash;雖然它目前還沒有任何實際作用。

4. 刪除 **Name** 的值。這違反了「required」規則，因此會顯示錯誤訊息&mdash;而且請注意，它也會停用 **Submit** 按鈕。


   你不需要明確地將按鈕的啟用狀態與表單的有效性連接起來。當你在增強後的表單元素上定義範本參照變數，然後在按鈕控制項中參照該變數時，`FormsModule` 會自動完成這件事。

### 回應表單提交

若要顯示對表單提交的回應，你可以隱藏資料輸入區域，並在它的位置顯示其他內容。

1. 將整個表單包裝在一個 `<div>` 中，並將其 `hidden` 屬性綁定到 `HeroFormComponent.submitted` 屬性。

   <code-example path="forms/src/app/hero-form/hero-form.component.html" header="src/app/hero-form/hero-form.component.html (excerpt)" region="edit-div"></code-example>

   * 主表單從一開始就是可見的，因為 `submitted` 屬性在你提交表單之前都是 false，如 `HeroFormComponent` 的這個片段所示：

      <code-example path="forms/src/app/hero-form/hero-form.component.ts" header="src/app/hero-form/hero-form.component.ts (submitted)" region="submitted"></code-example>

   * 當你點按 **Submit** 按鈕時，`submitted` 旗標會變為 true，且表單會消失。

2. 若要在表單處於已提交狀態時顯示其他內容，請在新的 `<div>` 包裝器下方加入下列 HTML。

   <code-example path="forms/src/app/hero-form/hero-form.component.html" header="src/app/hero-form/hero-form.component.html (excerpt)" region="submitted"></code-example>

   這個 `<div>` 會顯示一個使用插值綁定的唯讀英雄，只在元件處於已提交狀態時出現。

   替代顯示內容包含一個 *Edit* 按鈕，其點擊事件綁定到一個會清除 `submitted` 旗標的運算式。

3. 點按 *Edit* 按鈕，將顯示切換回可編輯的表單。

## 小結

本頁討論的 Angular 表單利用以下框架功能，為資料修改、驗證等提供支援。

* Angular HTML 表單範本。
* 具有 `@Component` 裝飾器的表單元件類別。
* 透過綁定到 `NgForm.ngSubmit` 事件屬性來處理表單提交。
* 例如 `#heroForm` 與 `#name` 等範本參照變數。
* 用於雙向資料綁定的 `[(ngModel)]` 語法。
* 使用 `name` 屬性進行驗證與表單元素變更追蹤。
* 輸入控制項上參照變數的 `valid` 屬性，用來檢查控制項是否有效，並顯示或隱藏錯誤訊息。
* 透過綁定到 `NgForm` 的有效性，控制 **Submit** 按鈕的啟用狀態。
* 自訂 CSS 類別，為使用者提供關於無效控制項的視覺回饋。

以下是應用程式最終版本的程式碼：

<code-tabs>

  <code-pane header="hero-form/hero-form.component.ts" path="forms/src/app/hero-form/hero-form.component.ts" region="final">

  </code-pane>

  <code-pane header="hero-form/hero-form.component.html" path="forms/src/app/hero-form/hero-form.component.html" region="final">

  </code-pane>

  <code-pane header="hero.ts" path="forms/src/app/hero.ts">

  </code-pane>

  <code-pane header="app.module.ts" path="forms/src/app/app.module.ts">

  </code-pane>

  <code-pane header="app.component.html" path="forms/src/app/app.component.html">

  </code-pane>

  <code-pane header="app.component.ts" path="forms/src/app/app.component.ts">

  </code-pane>

  <code-pane header="main.ts" path="forms/src/main.ts">

  </code-pane>

  <code-pane header="forms.css" path="forms/src/assets/forms.css">

  </code-pane>

</code-tabs>
