# 建立一個模板驅動表單

本教學課程將向您展示如何建立範本驅動表單。表單中的控制元素會繫結至具有輸入驗證的資料屬性。輸入驗證有助於維護資料完整性及樣式，以改善使用者體驗。

以範本為基礎的表單使用 [雙向資料繫結](guide/templates/two-way-binding) 來更新元件中的資料模型，因為範本中的變更和反之亦然。

<docs-callout helpful title="範本 vs. 反應式表單">
Angular 支援兩種互動式表單的設計方法。範本驅動的表單讓您在 Angular 範本中使用特定於表單的指令。反應式表單提供以模型為主的表單建構方法。

模板驅動的表單非常適合小型或簡單的表單，而反應式表單更具可擴展性，適合複雜的表單。如需比較這兩種方法，請參閱 [選擇方法](guide/forms#choosing-an-approach)
</docs-callout>

你可以使用 Angular 範本建立幾乎任何類型的表單，例如登入表單、連絡表單，以及幾乎任何業務表單。
你可以有創意地配置控制項，並將它們繫結到物件模型中的資料。
你可以指定驗證規則和顯示驗證錯誤，有條件地允許輸入特定控制項、觸發內建的視覺回饋，以及更多。

## 目標

此教學課程教您如何執行下列操作：

* 使用元件和範本來建立 Angular 表單
* 使用 `ngModel` 建立雙向資料繫結，以讀取和寫入輸入控制值
* 使用追蹤控制項狀態的特殊 CSS 類別提供視覺回饋
* 向使用者顯示驗證錯誤，並根據表單狀態有條件地允許輸入表單控制項
* 使用 [範本參考變數](guide/templates/reference-variables) 在 HTML 元素之間共享資訊

## 建立範本驅動的表單

模板驅動表單依賴在 `FormsModule` 中定義的指令。

| 指令     | 詳細 |
|:---            |:---     |
| `NgModel`      | 協調附加的表單元素中的值變更和資料模型中的變更，允許您以輸入驗證和錯誤處理來回應使用者輸入。                                                                                                           |
| `NgForm`       | 建立頂層 `FormGroup` 實例並將其繫結至 `<form>` 元素以追蹤聚集的表單值和驗證狀態。只要您匯入 `FormsModule`，此指令就會在所有 `<form>` 標籤上自動啟用。您不需要加入特殊選擇器。 |
| `NgModelGroup` | 建立並繫結 `FormGroup` 實例至 DOM 元素。                                                                                                                                                                                                                      |

### 步驟概述

在本教學課程中，您可以使用下列步驟將範例表單繫結至資料並處理使用者輸入。

1. 建立基本表單。
    * 定義範例資料模型
    * 包括必要的基礎設施，例如 `FormsModule`
1. 使用 `ngModel` 指令和雙向資料繫結語法將表單控制項繫結至資料屬性。
    * 檢查 `ngModel` 如何使用 CSS 類別報告控制狀態
    * 命名控制項以使 `ngModel` 可以存取
1. 使用 `ngModel` 追蹤輸入有效性和控制狀態。
    * 加入自訂 CSS 以提供關於狀態的可視化回饋
    * 顯示和隱藏驗證錯誤訊息
1. 透過新增至模型資料來回應原生 HTML 按鈕點擊事件。
1. 使用表單的 [`ngSubmit`](api/forms/NgForm#properties) 輸出屬性來處理表單提交。
    * 在表單有效之前停用 **提交** 按鈕
    * 提交後，將完成的表單換成頁面上的不同內容

## 建立表格

<!-- TODO: 連結至預覽 -->

<!-- <docs-code live/> -->

1. 提供的範例應用程式建立 `Actor` 類別，其中定義反映在表單中的資料模型。

    <docs-code header="src/app/actor.ts" language="typescript" path="adev/src/content/examples/forms/src/app/actor.ts"/>

1. 表單配置和詳細資訊定義在 `ActorFormComponent` 類別中。

    <docs-code header="src/app/actor-form/actor-form.component.ts (v1)" path="adev/src/content/examples/forms/src/app/actor-form/actor-form.component.ts" visibleRegion="v1"/>

    元件的「app-actor-form」`selector` 值表示您可以使用 `<app-actor-form>` 標籤將此表單放入父範本中。

1. 下列程式碼建立新的演員實例，以便初始表單可以顯示範例演員。

    <docs-code language="typescript" path="adev/src/content/examples/forms/src/app/actor-form/actor-form.component.ts" language="typescript" visibleRegion="Marilyn"/>

    此範例使用 `model` 和 `skills` 的虛擬資料。
    在真實的應用程式中，您會注入資料服務來取得並儲存真實資料，或將這些屬性公開為輸入和輸出。

1. 應用程式啟用表單功能並註冊建立的表單元件。

    <docs-code header="src/app/app.module.ts" language="typescript" path="adev/src/content/examples/forms/src/app/app.module.ts"/>

1. 表單顯示在由根元件範本定義的應用程式配置中。

    <docs-code header="src/app/app.component.html" language="html" path="adev/src/content/examples/forms/src/app/app.component.html"/>

    初始範本定義具有兩個表單群組和一個提交按鈕的表單配置。
    表單群組對應於 Actor 資料模型的兩個屬性：姓名和工作室。
    每個群組都有標籤和使用者輸入方塊。

    * **姓名** `<input>` 控制元素具有 HTML5 `required` 屬性
    * **工作室** `<input>` 控制元素沒有，因為 `studio` 是選填的

    **提交**按鈕有一些樣式類別。
    在這個階段，表單配置都是純粹的 HTML5，沒有任何繫結或指令。

1. 範例表單使用 [Twitter Bootstrap](https://getbootstrap.com/css) 的一些樣式類別：`container`、`form-group`、`form-control` 和 `btn`。
    若要使用這些樣式，應用程式的樣式表會匯入程式庫。

    <docs-code header="src/styles.css" path="adev/src/content/examples/forms/src/styles.1.css"/>

1. 表單要求演員的技能必須從 `ActorFormComponent` 內部維護的預定義 `skills` 清單中選取。
    Angular [NgForOf 指令](api/common/NgForOf "API 參考") 會叠代資料值以填入 `<select>` 元素。

    <docs-code header="src/app/actor-form/actor-form.component.html (skills)" path="adev/src/content/examples/forms/src/app/actor-form/actor-form.component.html" visibleRegion="skills"/>

如果您現在執行應用程式，您會在選擇控制項中看到技能清單。
輸入元素尚未繫結至資料值或事件，因此它們仍然空白且沒有行為。

## 將輸入控制項繫結至資料屬性

下一步是將輸入控制項與對應的 `Actor` 屬性繫結，以雙向資料繫結的方式，讓它們對使用者輸入做出回應，更新資料模型，並對資料的程式化變更做出回應，更新顯示。

在 `FormsModule` 中宣告的 `ngModel` 指令，讓您能將範本驅動表單中的控制項繫結到資料模型中的屬性。
當您使用雙向資料繫結語法 `[(ngModel)]` 包含該指令時，Angular 能追蹤控制項的值和使用者互動，並使檢視與模型保持同步。

1. 編輯範本檔案 `actor-form.component.html`。
1. 找到 **名稱** 標籤旁邊的 `<input>` 標籤。
1. 加入 `ngModel` 指令，使用雙向資料繫結語法 `[(ngModel)]="..."`。

<docs-code header="src/app/actor-form/actor-form.component.html (excerpt)" path="adev/src/content/examples/forms/src/app/actor-form/actor-form.component.html" visibleRegion="ngModelName-1"/>

有用的資訊：此範例在每個輸入標籤之後都有暫時的診斷內插，`{{model.name}}`，以顯示對應屬性的目前資料值。當您完成觀察雙向資料繫結的運作後，請記得移除診斷行。

### 存取整體表單狀態

當你在你的元件中匯入 `FormsModule` 時，Angular 會自動建立並將 [NgForm](api/forms/NgForm) 指令附加至範本中的 `<form>` 標籤（因為 `NgForm` 具有與 `<form>` 元素匹配的選取器 `form`）。

要存取 `NgForm` 和整體表單狀態，請宣告一個 [範本參考變數](guide/templates/reference-variables)。

1. 編輯範本檔案 `actor-form.component.html`。
1. 使用範本參考變數 `#actorForm` 更新 `<form>` 標籤，並將其值設定如下。

    <docs-code header="src/app/actor-form/actor-form.component.html (摘錄)" path="adev/src/content/examples/forms/src/app/actor-form/actor-form.component.html" visibleRegion="template-variable"/>

    `actorForm` 範本變數現在是 `NgForm` 指令實例的參考，該實例管理整個表單。

1. 執行應用程式。
1. 開始在 **名稱** 輸入方塊中輸入文字。

    當您新增和刪除字元時，您會看到它們出現在資料模型中，並從資料模型中消失。

顯示插入值的診斷線證明值真的從輸入框流向模型，然後再流回。

### 命名控制元素

當您在元素上使用 `[(ngModel)]` 時，您必須為該元素定義一個 `name` 屬性。
Angular 使用指定的 name 將元素註冊到附加至父 `<form>` 元素的 `NgForm` 指令。

範例為 `<input>` 元素新增 `name` 屬性，並將其設定為「name」，這對於演員姓名來說很有意義。
任何唯一值都可以，但使用描述性名稱會很有幫助。

1. 將類似的 `[(ngModel)]` 繫結和 `name` 屬性新增至 **Studio** 和 **Skill**。
1. 現在您可以移除顯示內插值診斷訊息。
1. 若要確認雙向資料繫結適用於整個 actor 模型，請在元件範本的頂端新增一個使用 [`json`](api/common/JsonPipe) 管道的文字繫結，將資料序列化為字串。

在這些修訂之後，表單範本看起來應如下所示：

<docs-code header="src/app/actor-form/actor-form.component.html (excerpt)" path="adev/src/content/examples/forms/src/app/actor-form/actor-form.component.html" visibleRegion="ngModel-2"/>

您會注意到：

* 每個 `<input>` 元素都有 `id` 屬性。
    `<label>` 元素的 `for` 屬性會使用它來將標籤與其輸入控制項配對。
    這是一個 [標準 HTML 功能](https://developer.mozilla.org/docs/Web/HTML/Element/label)。

* 每個 `<input>` 元素還具有 Angular 用來向表單註冊控制項的必要 `name` 屬性。

當你觀察到效果後，你可以刪除 `{{ model | json }}` 文字繫結。

## 追蹤表單狀態

Angular 在提交表單後會將 `ng-submitted` 類別套用至 `form` 元素。此類別可於提交表單後用來變更表單的樣式。

## 追蹤控制狀態

在控制項中加入 `NgModel` 指令會將描述其狀態的類別名稱加入控制項。
這些類別可用於根據控制項的狀態來變更其樣式。

以下表格說明 Angular 依照控制項狀態套用的類別名稱。

| 狀態                           | 如果為真則為類別 | 如果為假則為類別 |
|:---                              |:---           |:---            |
| 控制項已被訪問。    | `ng-touched`  | `ng-untouched` |
| 控制項的值已變更。 | `ng-dirty`    | `ng-pristine`  |
| 控制項的值有效。    | `ng-valid`    | `ng-invalid`   |

Angular 也會在提交後將 `ng-submitted` 類別套用至 `form` 元素，
但不會套用至 `form` 元素內的控制項。

您可以使用這些 CSS 類別根據控制項的狀態來定義其樣式。

### 觀察控制狀態

若要查看框架如何新增和移除類別，請開啟瀏覽器的開發人員工具並檢查代表演員名稱的 `<input>` 元素。

1. 使用瀏覽器的開發人員工具，找到對應於 **名稱** 輸入方塊的 `<input>` 元素。
    您可以看到該元素除了「form-control」之外，還有多個 CSS 類別。

1. 當您第一次開啟它時，這些類別表示它具有有效值，自初始化或重置以來該值尚未變更，並且自初始化或重置以來尚未訪問過該控件。

    <docs-code language="html">

    <input class="form-control ng-untouched ng-pristine ng-valid">;

    </docs-code>

1. 對 **名稱** `<input>` 方塊執行下列動作，並觀察出現哪些類別。
    * 檢視但不觸碰。
        這些類別表示它是未觸碰、原始且有效的。

    * 按一下名稱方塊內部，然後按一下其外部。
        現在已訪問過該控件，且元素具有 `ng-touched` 類別，而不是 `ng-untouched` 類別。

    * 在名稱的結尾新增斜線。
        現在已觸碰且不乾不淨。

    * 刪除名稱。
        這會使值無效，因此 `ng-invalid` 類別取代了 `ng-valid` 類別。

### 為狀態建立視覺回饋

`ng-valid`/`ng-invalid` 組合特別有趣，因為當值無效時，您想要傳送強烈的視覺訊號。
您也想要標記必填欄位。

您可以在輸入框左側以彩色條同時標記必填欄位和無效資料。

若要以這種方式變更外觀，請執行下列步驟。

1. 為 `ng-*` CSS 類別新增定義。
1. 將這些類別定義新增到新的 `forms.css` 檔案。
1. 將新檔案新增到專案中，與 `index.html` 同層：

<docs-code header="src/assets/forms.css" language="css" path="adev/src/content/examples/forms/src/assets/forms.css"/>

1. 在 `index.html` 檔案中，更新 `<head>` 標籤以包含新的樣式表。

<docs-code header="src/index.html (styles)" path="adev/src/content/examples/forms/src/index.html" visibleRegion="styles"/>

### 顯示和隱藏驗證錯誤訊息

**名字** 輸入框是必需的，清除它會使欄位變紅。
這表示有些地方有問題，但使用者不知道哪裡有問題或該如何解決。
您可以透過檢查控制項的狀態並做出回應來提供說明訊息。

**技能**選取方塊也是必要的，但它不需要這種錯誤處理，因為選取方塊已將選取限制為有效值。

要定義和顯示錯誤訊息，請執行下列步驟。

<docs-workflow>
<docs-step title="將輸入的當地參照新增至輸入">
使用範本參照變數來擴充 `input` 標籤，以便在範本內存取輸入方塊的 Angular 控制項。在範例中，變數為 `#name="ngModel"`。

範本參考變數 (`#name`) 設為 `"ngModel"`，這是因為這是 [`NgModel.exportAs`](api/core/Directive#exportAs) 屬性的值。此屬性會告訴 Angular 如何將參考變數連結至指令。
</docs-step>

<docs-step title="新增錯誤訊息">
新增包含合適錯誤訊息的 `<div>`。
</docs-step>

<docs-step title="讓錯誤訊息有條件">
透過繫結 `name` 控制項的內容到訊息 `<div>` 元素的 `hidden` 內容，顯示或隱藏錯誤訊息。
</docs-step>

<docs-code header="src/app/actor-form/actor-form.component.html (hidden-error-msg)" path="adev/src/content/examples/forms/src/app/actor-form/actor-form.component.html" visibleRegion="hidden-error-msg"/>

<docs-step title="在名稱中新增條件錯誤訊息">
在 `name` 輸入方塊中新增條件錯誤訊息，如下所示。

<docs-code header="src/app/actor-form/actor-form.component.html (excerpt)" path="adev/src/content/examples/forms/src/app/actor-form/actor-form.component.html" visibleRegion="name-with-error-msg"/>
</docs-step>
</docs-workflow>

<docs-callout title='Illustrating the "pristine" state'>

In this example, you hide the message when the control is either valid or *pristine*.
Pristine means the user hasn't changed the value since it was displayed in this form.
If you ignore the `pristine` state, you would hide the message only when the value is valid.
If you arrive in this component with a new, blank actor or an invalid actor, you'll see the error message immediately, before you've done anything.

You might want the message to display only when the user makes an invalid change.
Hiding the message while the control is in the `pristine` state achieves that goal.
You'll see the significance of this choice when you add a new actor to the form in the next step.

</docs-callout>

## Add a new actor

This exercise shows how you can respond to a native HTML button-click event by adding to the model data.
To let form users add a new actor, you will add a **New Actor** button that responds to a click event.

1. In the template, place a "New Actor" `<button>` element at the bottom of the form.
1. In the component file, add the actor-creation method to the actor data model.

    <docs-code header="src/app/actor-form/actor-form.component.ts (New Actor method)" path="adev/src/content/examples/forms/src/app/actor-form/actor-form.component.ts" visibleRegion="new-actor"/>

1. Bind the button's click event to a actor-creation method, `newActor()`.

    <docs-code header="src/app/actor-form/actor-form.component.html (New Actor button)" path="adev/src/content/examples/forms/src/app/actor-form/actor-form.component.html" visibleRegion="new-actor-button-no-reset"/>

1. Run the application again and click the **New Actor** button.

    The form clears, and the *required* bars to the left of the input box are red, indicating invalid `name` and `skill` properties.
    Notice that the error messages are hidden.
    This is because the form is pristine; you haven't changed anything yet.

1. Enter a name and click **New Actor** again.

    Now the application displays a `Name is required` error message, because the input box is no longer pristine.
    The form remembers that you entered a name before clicking **New Actor**.

1. To restore the pristine state of the form controls, clear all of the flags imperatively by calling the form's `reset()` method after calling the `newActor()` method.

    <docs-code header="src/app/actor-form/actor-form.component.html (Reset the form)" path="adev/src/content/examples/forms/src/app/actor-form/actor-form.component.html" visibleRegion="new-actor-button-form-reset"/>

    Now clicking **New Actor** resets both the form and its control flags.


## Submit the form with `ngSubmit`

The user should be able to submit this form after filling it in.
The **Submit** button at the bottom of the form does nothing on its own, but it does trigger a form-submit event because of its type (`type="submit"`).

To respond to this event, take the following steps.

<docs-workflow>

<docs-step title="Listen to ngOnSubmit">
Bind the form's [`ngSubmit`](api/forms/NgForm#properties) event property to the actor-form component's `onSubmit()` method.

<docs-code header="src/app/actor-form/actor-form.component.html (ngSubmit)" path="adev/src/content/examples/forms/src/app/actor-form/actor-form.component.html" visibleRegion="ngSubmit"/>
</docs-step>

<docs-step title="Bind the disabled property">
Use the template reference variable, `#actorForm` to access the form that contains the **Submit** button and create an event binding.

You will bind the form property that indicates its overall validity to the **Submit** button's `disabled` property.

<docs-code header="src/app/actor-form/actor-form.component.html (submit-button)" path="adev/src/content/examples/forms/src/app/actor-form/actor-form.component.html" visibleRegion="submit-button"/>
</docs-step>

<docs-step title="Run the application">
Notice that the button is enabled &mdash;although it doesn't do anything useful yet.
</docs-step>

<docs-step title="Delete the Name value">
This violates the "required" rule, so it displays the error message &mdash;and notice that it also disables the **Submit** button.

You didn't have to explicitly wire the button's enabled state to the form's validity.
The `FormsModule` did this automatically when you defined a template reference variable on the enhanced form element, then referred to that variable in the button control.
</docs-step>
</docs-workflow>

### Respond to form submission

To show a response to form submission, you can hide the data entry area and display something else in its place.

<docs-workflow>
<docs-step title="Wrap the form">
Wrap the entire form in a `<div>` and bind its `hidden` property to the `ActorFormComponent.submitted` property.

<docs-code header="src/app/actor-form/actor-form.component.html (excerpt)" path="adev/src/content/examples/forms/src/app/actor-form/actor-form.component.html" visibleRegion="edit-div"/>

The main form is visible from the start because the `submitted` property is false until you submit the form, as this fragment from the `ActorFormComponent` shows:

<docs-code header="src/app/actor-form/actor-form.component.ts (submitted)" path="adev/src/content/examples/forms/src/app/actor-form/actor-form.component.ts" visibleRegion="submitted"/>

When you click the **Submit** button, the `submitted` flag becomes true and the form disappears.
</docs-step>

<docs-step title="Add the submitted state">
To show something else while the form is in the submitted state, add the following HTML below the new `<div>` wrapper.

<docs-code header="src/app/actor-form/actor-form.component.html (excerpt)" path="adev/src/content/examples/forms/src/app/actor-form/actor-form.component.html" visibleRegion="submitted"/>

This `<div>`, which shows a read-only actor with interpolation bindings, appears only while the component is in the submitted state.

The alternative display includes an *Edit* button whose click event is bound to an expression that clears the `submitted` flag.
</docs-step>

<docs-step title="Test the Edit button">
Click the *Edit* button to switch the display back to the editable form.
</docs-step>
</docs-workflow>

## Summary

The Angular form discussed in this page takes advantage of the following
framework features to provide support for data modification, validation, and more.

* An Angular HTML form template
* A form component class with a `@Component` decorator
* Handling form submission by binding to the `NgForm.ngSubmit` event property
* Template-reference variables such as `#actorForm` and `#name`
* `[(ngModel)]` syntax for two-way data binding
* The use of `name` attributes for validation and form-element change tracking
* The reference variable's `valid` property on input controls indicates whether a control is valid or should show error messages
* Controlling the **Submit** button's enabled state by binding to `NgForm` validity
* Custom CSS classes that provide visual feedback to users about controls that are not valid


Here's the code for the final version of the application:

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

