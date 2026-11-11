# 建立範本驅動表單

本教學將示範如何建立範本驅動表單。表單中的控制元素綁定到具有輸入驗證的資料屬性。輸入驗證有助於維護資料完整性與樣式，進而改善使用者體驗。

範本驅動表單使用[雙向資料綁定](guide/templates/two-way-binding)，在範本發生變更時更新元件中的資料模型，反之亦然。

<docs-callout helpful title="範本驅動表單 vs 反應式表單">
Angular 支援兩種互動式表單的設計方式。範本驅動表單讓你在 Angular 範本中使用表單專用的指令；反應式表單則提供以模型驅動的方式來建立表單。

範本驅動表單非常適合小型或簡單的表單，反應式表單則更具擴展性，適合複雜的表單。如需比較這兩種方式，請參閱[選擇方式](guide/forms#choosing-an-approach)
</docs-callout>

你幾乎可以使用 Angular 範本建立任何種類的表單——登入表單、聯絡表單，以及幾乎任何業務表單。
你可以自由安排控制項的版面，並將它們綁定到物件模型中的資料。
你可以指定驗證規則並顯示驗證錯誤、依條件允許特定控制項輸入、觸發內建的視覺回饋，還有更多功能。

## 學習目標

本教學將教你如何完成以下事項：

* 使用元件與範本建立 Angular 表單
* 使用 `ngModel` 建立雙向資料綁定，以讀取與寫入輸入控制項的值
* 使用追蹤控制項狀態的特殊 CSS 類別提供視覺回饋
* 向使用者顯示驗證錯誤，並根據表單狀態依條件允許表單控制項輸入
* 使用[範本參照變數](guide/templates/reference-variables)在 HTML 元素之間共用資訊

## 建立範本驅動表單

範本驅動表單依賴 `FormsModule` 中定義的指令。

| 指令           | 詳細說明                                                                                                                                                                                                                                                                        |
|:---            |:---     |
| `NgModel`      | 協調附加表單元素的值變更與資料模型的變更，讓你能以輸入驗證與錯誤處理來回應使用者輸入。                                                                                                                                                                                          |
| `NgForm`       | 建立頂層 `FormGroup` 執行個體，並將它綁定到 `<form>` 元素，以追蹤彙總的表單值與驗證狀態。只要你匯入 `FormsModule`，這個指令預設就會在所有 `<form>` 標籤上啟用。你不需要加入特殊的選擇器。                                                                                  |
| `NgModelGroup` | 建立 `FormGroup` 執行個體，並將它綁定到 DOM 元素。                                                                                                                                                                                                                              |

### 步驟概覽

在本教學中，你將依照以下步驟，把範例表單綁定到資料並處理使用者輸入。

1. 建立基本表單。
    * 定義範例資料模型
    * 加入必要的基礎設施，例如 `FormsModule`
1. 使用 `ngModel` 指令與雙向資料綁定語法，將表單控制項綁定到資料屬性。
    * 檢視 `ngModel` 如何使用 CSS 類別回報控制項狀態
    * 為控制項命名，讓 `ngModel` 可以存取它們
1. 使用 `ngModel` 追蹤輸入有效性與控制項狀態。
    * 加入自訂 CSS，針對狀態提供視覺回饋
    * 顯示與隱藏驗證錯誤訊息
1. 回應原生 HTML 按鈕的點擊事件，將資料加入模型。
1. 使用表單的 [`ngSubmit`](api/forms/NgForm#properties) 輸出屬性處理表單提交。
    * 在表單有效之前停用 **Submit** 按鈕
    * 提交後，將完成的表單換成頁面上的其他內容

## 建立表單

<!-- TODO: link to preview -->
<!-- <docs-code live/> -->

1. 提供的範例應用程式建立了 `Actor` 類別，其中定義了表單所反映的資料模型。

    <docs-code header="src/app/actor.ts" language="typescript" path="adev/src/content/examples/forms/src/app/actor.ts"/>

1. 表單的版面與詳細內容定義在 `ActorFormComponent` 類別中。

    <docs-code header="src/app/actor-form/actor-form.component.ts (v1)" path="adev/src/content/examples/forms/src/app/actor-form/actor-form.component.ts" visibleRegion="v1"/>

    元件的 `selector` 值為 "app-actor-form"，表示你可以使用 `<app-actor-form>` 標籤，將這個表單放入父範本中。

1. 以下程式碼建立了一個新的演員執行個體，讓初始表單可以顯示一位範例演員。

    <docs-code language="typescript" path="adev/src/content/examples/forms/src/app/actor-form/actor-form.component.ts" language="typescript" visibleRegion="Marilyn"/>

    這個示範對 `model` 與 `skills` 使用假資料。
    在真實應用程式中，你會注入資料服務來取得與儲存真實資料，或將這些屬性公開為輸入與輸出。

1. 應用程式啟用表單功能，並註冊所建立的表單元件。

    <docs-code header="src/app/app.module.ts" language="typescript" path="adev/src/content/examples/forms/src/app/app.module.ts"/>

1. 表單顯示在根元件範本所定義的應用程式版面中。

    <docs-code header="src/app/app.component.html" language="html" path="adev/src/content/examples/forms/src/app/app.component.html"/>

    初始範本定義了一個表單的版面，其中包含兩個表單群組與一個提交按鈕。
    這兩個表單群組對應到 Actor 資料模型的兩個屬性：name 與 studio。
    每個群組都有一個標籤，以及一個供使用者輸入的方框。

    * **Name** `<input>` 控制元素具有 HTML5 的 `required` 屬性
    * **Studio** `<input>` 控制元素則沒有，因為 `studio` 是選擇性的

    **Submit** 按鈕上有一些用於樣式的類別。
   在這個階段，表單版面完全是純 HTML5，沒有任何綁定或指令。

1. 範例表單使用 [Twitter Bootstrap](https://getbootstrap.com/css) 的一些樣式類別：`container`、`form-group`、`form-control` 與 `btn`。
    若要使用這些樣式，應用程式的樣式表會匯入該程式庫。

    <docs-code header="src/styles.css" path="adev/src/content/examples/forms/src/styles.1.css"/>

1. 表單要求演員的技能必須從 `ActorFormComponent` 內部維護的預先定義 `skills` 清單中選擇。
   Angular 的 [NgForOf 指令](api/common/NgForOf "API reference") 會逐一走訪資料值，填入 `<select>` 元素。

    <docs-code header="src/app/actor-form/actor-form.component.html (skills)" path="adev/src/content/examples/forms/src/app/actor-form/actor-form.component.html" visibleRegion="skills"/>

如果你現在執行應用程式，你會在選取控制項中看到技能清單。
輸入元素尚未綁定到資料值或事件，因此它們仍然是空白的，而且沒有任何行為。

## 將輸入控制項綁定到資料屬性

下一步是使用雙向資料綁定，將輸入控制項綁定到 `Actor` 中對應的屬性，讓它們在使用者輸入時更新資料模型，也能在資料發生程式化變更時更新顯示。

`FormsModule` 中宣告的 `ngModel` 指令，讓你可以將範本驅動表單中的控制項綁定到資料模型中的屬性。
當你使用雙向資料綁定語法 `[(ngModel)]` 加入這個指令時，Angular 可以追蹤控制項的值與使用者互動，並讓檢視與模型保持同步。

1. 編輯範本檔案 `actor-form.component.html`。
1. 找到 **Name** 標籤旁的 `<input>` 標籤。
1. 加入 `ngModel` 指令，使用雙向資料綁定語法 `[(ngModel)]="..."`。

<docs-code header="src/app/actor-form/actor-form.component.html (excerpt)" path="adev/src/content/examples/forms/src/app/actor-form/actor-form.component.html" visibleRegion="ngModelName-1"/>

HELPFUL: 這個範例在每個輸入標籤後都有一個暫時的診斷插值 `{{model.name}}`，用來顯示對應屬性的目前資料值。註解提醒你，在觀察完雙向資料綁定的運作後，要移除這些診斷行。

### 存取整體表單狀態

當你在元件中匯入 `FormsModule` 時，Angular 會自動在範本的 `<form>` 標籤上建立並附加一個 [NgForm](api/forms/NgForm) 指令（因為 `NgForm` 的選擇器 `form` 與 `<form>` 元素相符）。

若要存取 `NgForm` 與整體表單狀態，請宣告一個[範本參照變數](guide/templates/reference-variables)。

1. 編輯範本檔案 `actor-form.component.html`。
1. 使用範本參照變數 `#actorForm` 更新 `<form>` 標籤，並如下設定它的值。

    <docs-code header="src/app/actor-form/actor-form.component.html (excerpt)" path="adev/src/content/examples/forms/src/app/actor-form/actor-form.component.html" visibleRegion="template-variable"/>

    `actorForm` 範本變數現在是控管整個表單的 `NgForm` 指令執行個體的參照。

1. 執行應用程式。
1. 開始在 **Name** 輸入框中輸入。

    當你新增與刪除字元時，你可以看到它們在資料模型中出現與消失。

  顯示插值值的診斷行證明了值確實從輸入框流向模型，再流回來。

### 為控制元素命名

當你在元素上使用 `[(ngModel)]` 時，你必須為該元素定義 `name` 屬性。
Angular 會使用指定的名稱，向附加在父 `<form>` 元素上的 `NgForm` 指令註冊該元素。

範例為 `<input>` 元素加入了 `name` 屬性，並將它設為 "name"，這對演員的姓名來說很合理。
任何唯一值都可以，但使用具描述性的名稱會更有幫助。

1. 為 **Studio** 與 **Skill** 加入類似的 `[(ngModel)]` 綁定與 `name` 屬性。
1. 現在你可以移除顯示插值值的診斷訊息。
1. 若要確認雙向資料綁定對整個演員模型都有效，請在元件範本頂端加入一個新的文字綁定，使用 [`json`](api/common/JsonPipe) 管道將資料序列化為字串。

完成這些修改後，表單範本應該如下所示：

<docs-code header="src/app/actor-form/actor-form.component.html (excerpt)" path="adev/src/content/examples/forms/src/app/actor-form/actor-form.component.html" visibleRegion="ngModel-2"/>

你會注意到：

* 每個 `<input>` 元素都有一個 `id` 屬性。
    `<label>` 元素的 `for` 屬性會使用它，將標籤與其輸入控制項對應起來。
    這是[標準的 HTML 功能](https://developer.mozilla.org/docs/Web/HTML/Element/label)。

* 每個 `<input>` 元素也都有必要的 `name` 屬性，Angular 會使用它向表單註冊控制項。

觀察完效果後，你可以刪除 `{{ model | json }}` 文字綁定。

## 追蹤表單狀態

Angular 會在表單提交後，將 `ng-submitted` 類別套用到 `form` 元素。這個類別可以用來在表單提交後變更表單的樣式。

## 追蹤控制項狀態 {#track-control-states}

將 `NgModel` 指令加入控制項，會為控制項加入描述其狀態的類別名稱。
這些類別可以用來根據控制項的狀態變更其樣式。

下表說明 Angular 根據控制項狀態套用的類別名稱。

| 狀態                     | 為 true 時的類別 | 為 false 時的類別 |
|:---                              |:---           |:---            |
| 控制項已被造訪。         | `ng-touched`     | `ng-untouched`    |
| 控制項的值已變更。       | `ng-dirty`       | `ng-pristine`     |
| 控制項的值有效。         | `ng-valid`       | `ng-invalid`      |

Angular 也會在提交時將 `ng-submitted` 類別套用到 `form` 元素，
但不會套用到 `form` 元素內的控制項。

你可以使用這些 CSS 類別，根據控制項的狀態定義其樣式。

### 觀察控制項狀態

若要查看框架如何加入與移除這些類別，請開啟瀏覽器的開發人員工具，檢查代表演員姓名的 `<input>` 元素。

1. 使用瀏覽器的開發人員工具，找到對應到 **Name** 輸入框的 `<input>` 元素。
    你可以看到該元素除了 "form-control" 之外，還有多個 CSS 類別。

1. 當你第一次開啟它時，這些類別表示它有一個有效的值、該值自初始化或重設後尚未變更，且控制項自初始化或重設後尚未被造訪。

    <docs-code language="html">

    <input class="form-control ng-untouched ng-pristine ng-valid">;

    </docs-code>

1. 在 **Name** `<input>` 方框上執行以下操作，並觀察哪些類別出現。
    * 只看不要碰。
        這些類別表示它是未碰觸、未變更且有效的。

    * 點按姓名方框內部，然後點按方框外部。
        控制項現在已被造訪，元素具有 `ng-touched` 類別，而不是 `ng-untouched` 類別。

    * 在姓名末尾加上斜線。
        它現在是已碰觸且已變更的。

    * 清除姓名。
        這會使值無效，因此 `ng-invalid` 類別會取代 `ng-valid` 類別。

### 為狀態建立視覺回饋

`ng-valid`/`ng-invalid` 這一對特別值得注意，因為當值無效時，你會想要送出強烈的視覺訊號。
你也會想要標示必填欄位。

你可以同時標示必填欄位與無效資料，方法是在輸入框左側加上一個彩色長條。

若要以這種方式變更外觀，請執行以下步驟。

1. 為 `ng-*` CSS 類別加入定義。
1. 將這些類別定義加入新的 `forms.css` 檔案。
1. 將新檔案加入專案，作為 `index.html` 的同層檔案：

<docs-code header="src/assets/forms.css" language="css" path="adev/src/content/examples/forms/src/assets/forms.css"/>

1. 在 `index.html` 檔案中，更新 `<head>` 標籤以包含新的樣式表。

<docs-code header="src/index.html (styles)" path="adev/src/content/examples/forms/src/index.html" visibleRegion="styles"/>

### 顯示與隱藏驗證錯誤訊息

**Name** 輸入框是必填的，清除它會讓長條變成紅色。
這表示有地方出錯了，但使用者不知道哪裡出錯，也不知道該怎麼做。
你可以透過檢查並回應控制項的狀態，提供有幫助的訊息。

**Skill** 選取方框也是必填的，但它不需要這種錯誤處理，因為選取方框本身已將選項限制在有效值內。

若要在適當時機定義並顯示錯誤訊息，請執行以下步驟。

<docs-workflow>
<docs-step title="為輸入框加入本地參照">
使用範本參照變數擴充 `input` 標籤，讓你可以從範本內存取輸入框的 Angular 控制項。在範例中，變數是 `#name="ngModel"`。

範本參照變數（`#name`）被設為 `"ngModel"`，因為那是 [`NgModel.exportAs`](api/core/Directive#exportAs) 屬性的值。這個屬性告訴 Angular 如何將參照變數連結到指令。
</docs-step>

<docs-step title="加入錯誤訊息">
加入一個包含適當錯誤訊息的 `<div>`。
</docs-step>

<docs-step title="讓錯誤訊息有條件地顯示">
將 `name` 控制項的屬性綁定到訊息 `<div>` 元素的 `hidden` 屬性，以顯示或隱藏錯誤訊息。
</docs-step>

<docs-code header="src/app/actor-form/actor-form.component.html (hidden-error-msg)" path="adev/src/content/examples/forms/src/app/actor-form/actor-form.component.html" visibleRegion="hidden-error-msg"/>

<docs-step title="為 name 加入條件式錯誤訊息">
如下列範例所示，為 `name` 輸入框加入條件式錯誤訊息。

<docs-code header="src/app/actor-form/actor-form.component.html (excerpt)" path="adev/src/content/examples/forms/src/app/actor-form/actor-form.component.html" visibleRegion="name-with-error-msg"/>
</docs-step>
</docs-workflow>

<docs-callout title='說明「pristine」狀態'>

在這個範例中，當控制項有效或處於 _pristine_ 狀態時，你會隱藏訊息。
Pristine 表示使用者自它在此表單中顯示以來，尚未變更該值。
如果你忽略 `pristine` 狀態，你只會在值有效時隱藏訊息。
如果你帶著一位新的空白演員或無效的演員來到這個元件，你會立刻看到錯誤訊息，在你做任何事之前就出現。

你可能希望訊息只在使用者做出無效變更時才顯示。
在控制項處於 `pristine` 狀態時隱藏訊息，就能達到這個目標。
當你在下一步驟中將新演員加入表單時，你會看到這個選擇的重要性。

</docs-callout>

## 新增一位演員

這個練習示範如何回應原生 HTML 按鈕的點擊事件，將資料加入模型。
若要讓表單使用者新增一位演員，你會加入一個 **New Actor** 按鈕來回應點擊事件。

1. 在範本中，將一個 "New Actor" `<button>` 元素放在表單底部。
1. 在元件檔案中，將建立演員的方法加入演員資料模型。

    <docs-code header="src/app/actor-form/actor-form.component.ts (New Actor method)" path="adev/src/content/examples/forms/src/app/actor-form/actor-form.component.ts" visibleRegion="new-actor"/>

1. 將按鈕的點擊事件綁定到建立演員的方法 `newActor()`。

    <docs-code header="src/app/actor-form/actor-form.component.html (New Actor button)" path="adev/src/content/examples/forms/src/app/actor-form/actor-form.component.html" visibleRegion="new-actor-button-no-reset"/>

1. 再次執行應用程式，並點按 **New Actor** 按鈕。

   表單會被清除，輸入框左側的 _required_ 長條是紅色的，表示 `name` 與 `skill` 屬性無效。
    請注意錯誤訊息是隱藏的。
    這是因為表單處於 pristine 狀態；你還沒有變更任何東西。

1. 輸入姓名，再次點按 **New Actor**。

    現在應用程式會顯示 `Name is required` 錯誤訊息，因為輸入框不再是 pristine 狀態。
    表單記得你在點按 **New Actor** 之前輸入過姓名。

1. 若要還原表單控制項的 pristine 狀態，請在呼叫 `newActor()` 方法後，呼叫表單的 `reset()` 方法，以命令式方式清除所有旗標。

    <docs-code header="src/app/actor-form/actor-form.component.html (Reset the form)" path="adev/src/content/examples/forms/src/app/actor-form/actor-form.component.html" visibleRegion="new-actor-button-form-reset"/>

    現在點按 **New Actor** 會同時重設表單與其控制項旗標。

## 使用 `ngSubmit` 提交表單

使用者應該能在填寫完這個表單後提交它。
表單底部的 **Submit** 按鈕本身沒有任何作用，但它確實會因為其類型（`type="submit"`）而觸發表單提交事件。

若要回應這個事件，請執行以下步驟。

<docs-workflow>

<docs-step title="監聽 ngOnSubmit">
將表單的 [`ngSubmit`](api/forms/NgForm#properties) 事件屬性綁定到演員表單元件的 `onSubmit()` 方法。

<docs-code header="src/app/actor-form/actor-form.component.html (ngSubmit)" path="adev/src/content/examples/forms/src/app/actor-form/actor-form.component.html" visibleRegion="ngSubmit"/>
</docs-step>

<docs-step title="綁定 disabled 屬性">
使用範本參照變數 `#actorForm` 存取包含 **Submit** 按鈕的表單，並建立事件綁定。

你會將表示表單整體有效性的表單屬性，綁定到 **Submit** 按鈕的 `disabled` 屬性。

<docs-code header="src/app/actor-form/actor-form.component.html (submit-button)" path="adev/src/content/examples/forms/src/app/actor-form/actor-form.component.html" visibleRegion="submit-button"/>
</docs-step>

<docs-step title="執行應用程式">
請注意按鈕已啟用——雖然它還沒有做任何有用的事。
</docs-step>

<docs-step title="刪除 Name 的值">
這違反了 "required" 規則，因此它會顯示錯誤訊息——同時請注意，它也會停用 **Submit** 按鈕。

你不必明確地將按鈕的啟用狀態連接到表單的有效性。
當你在增強的表單元素上定義範本參照變數，然後在按鈕控制項中參照該變數時，`FormsModule` 已自動完成這件事。
</docs-step>
</docs-workflow>

### 回應表單提交

若要顯示對表單提交的回應，你可以隱藏資料輸入區域，並在它的位置顯示其他內容。

<docs-workflow>
<docs-step title="包裝表單">
將整個表單包裝在一個 `<div>` 中，並將它的 `hidden` 屬性綁定到 `ActorFormComponent.submitted` 屬性。

<docs-code header="src/app/actor-form/actor-form.component.html (excerpt)" path="adev/src/content/examples/forms/src/app/actor-form/actor-form.component.html" visibleRegion="edit-div"/>

主表單從一開始就可見，因為 `submitted` 屬性在你提交表單之前都是 false，如 `ActorFormComponent` 的這個片段所示：

<docs-code header="src/app/actor-form/actor-form.component.ts (submitted)" path="adev/src/content/examples/forms/src/app/actor-form/actor-form.component.ts" visibleRegion="submitted"/>

當你點按 **Submit** 按鈕時，`submitted` 旗標會變為 true，表單就會消失。
</docs-step>

<docs-step title="加入已提交狀態">
若要在表單處於已提交狀態時顯示其他內容，請在新的 `<div>` 包裝器下方加入以下 HTML。

<docs-code header="src/app/actor-form/actor-form.component.html (excerpt)" path="adev/src/content/examples/forms/src/app/actor-form/actor-form.component.html" visibleRegion="submitted"/>

這個 `<div>` 顯示一個具有插值綁定的唯讀演員，只在元件處於已提交狀態時才出現。

替代顯示內容包含一個 _Edit_ 按鈕，其點擊事件綁定到一個會清除 `submitted` 旗標的運算式。
</docs-step>

<docs-step title="測試 Edit 按鈕">
點按 *Edit* 按鈕，將顯示切換回可編輯的表單。
</docs-step>
</docs-workflow>

## 摘要

本頁討論的 Angular 表單利用以下框架功能，為資料修改、驗證等提供支援。

* Angular HTML 表單範本
* 具有 `@Component` 裝飾器的表單元件類別
* 透過綁定到 `NgForm.ngSubmit` 事件屬性來處理表單提交
* 例如 `#actorForm` 與 `#name` 等範本參照變數
* 用於雙向資料綁定的 `[(ngModel)]` 語法
* 使用 `name` 屬性進行驗證與表單元素變更追蹤
* 輸入控制項上參照變數的 `valid` 屬性，表示控制項是否有效，或是否應顯示錯誤訊息
* 透過綁定到 `NgForm` 的有效性，控制 **Submit** 按鈕的啟用狀態
* 自訂 CSS 類別，為使用者提供關於無效控制項的視覺回饋

以下是應用程式最終版本的程式碼：

<docs-code-multifile>
    <docs-code header="actor-form/actor-form.component.ts" path="adev/src/content/examples/forms/src/app/actor-form/actor-form.component.ts" visibleRegion="final"/>
    <docs-code header="actor-form/actor-form.component.html" path="adev/src/content/examples/forms/src/app/actor-form/actor-form.component.html" visibleRegion="final"/>
    <docs-code header="actor.ts" path="adev/src/content/examples/forms/src/app/actor.ts"/>
    <docs-code header="app.module.ts" path="adev/src/content/examples/forms/src/app/app.module.ts"/>
    <docs-code header="app.component.html" path="adev/src/content/examples/forms/src/app/app.component.html"/>
    <docs-code header="app.component.ts" path="adev/src/content/examples/forms/src/app/app.component.ts"/>
    <docs-code header="main.ts" path="adev/src/content/examples/forms/src/main.ts"/>
    <docs-code header="forms.css" path="adev/src/content/examples/forms/src/assets/forms.css"/>
</docs-code-multifile>
