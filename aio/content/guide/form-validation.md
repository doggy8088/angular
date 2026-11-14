# 表單驗證

驗證使用者輸入的正確性與完整性，可以提升整體資料品質。

本頁說明如何使用反應式表單與範本驅動表單，在 UI 中驗證使用者輸入並顯示實用的驗證訊息。本頁假設你對這兩個表單模組已有一些基本認識。

<div class="l-sub-section">

如果你是表單新手，請先閱讀[表單](guide/forms)與[反應式表單](guide/reactive-forms)指南。

</div>

## 範本驅動驗證

若要為範本驅動表單加上驗證，你要加入的驗證屬性與[原生 HTML 表單驗證](https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/HTML5/Constraint_validation)所用的相同。Angular 使用指令，將這些屬性與框架中的驗證器函式對應起來。

每當表單控制項的值變更時，Angular 就會執行驗證，並產生一份驗證錯誤清單（使狀態成為 INVALID），或是 null（使狀態成為 VALID）。

接著，你可以把 `ngModel` 匯出為範本區域變數，藉此檢視控制項的狀態。下列範例將 `NgModel` 匯出為名為 `name` 的變數：

<code-example path="form-validation/src/app/template/hero-form-template.component.html" region="name-with-error-msg" title="template/hero-form-template.component.html (name)" linenums="false">

</code-example>

請注意下列事項：

* `<input>` 元素帶有 HTML 驗證屬性：`required` 與 `minlength`。它也帶有一個自訂驗證器指令 `forbiddenName`。詳情請見[自訂驗證器](guide/form-validation#自訂驗證器)一節。

* `#name="ngModel"` 將 `NgModel` 匯出為名為 `name` 的區域變數。`NgModel` 鏡像了其底層 `FormControl` 實例的許多屬性，因此你可以在範本中使用它來檢查 `valid`、`dirty` 等控制項狀態。控制項屬性的完整清單請見 [AbstractControl](api/forms/AbstractControl) API 參考文件。

   * `<div>` 元素上的 `*ngIf` 會顯示一組巢狀訊息 `divs`，但只有在 `name` 無效，且控制項處於 `dirty` 或 `touched` 狀態時才會顯示。

   * 每個巢狀 `<div>` 都可以針對某一種可能的驗證錯誤呈現自訂訊息。這裡有 `required`、`minlength` 與 `forbiddenName` 的訊息。

<div class="l-sub-section">

#### 為什麼要檢查 _dirty_ 與 _touched_？

你可能不希望應用程式在使用者有機會編輯表單之前就顯示錯誤。對 `dirty` 與 `touched` 的檢查可以防止錯誤顯示，直到使用者做了兩件事之一：變更值，使控制項變成 dirty；或是讓表單控制項元素失去焦點（blur），使控制項被設為 touched。

</div>

## 反應式表單驗證

在反應式表單中，真相來源是元件類別。你不是透過範本中的屬性加入驗證器，而是直接把驗證器函式加入元件類別中的表單控制項模型。接著，每當控制項的值變更時，Angular 就會呼叫這些函式。

### 驗證器函式

驗證器函式有兩種類型：同步驗證器與非同步驗證器。

* **同步驗證器**：接受一個控制項實例，並立即回傳一組驗證錯誤或 `null` 的函式。在實例化 `FormControl` 時，你可以將這些函式作為第二個引數傳入。

* **非同步驗證器**：非同步函式，接受一個控制項實例，並回傳一個 Promise 或 Observable，稍後發出（emit）一組驗證錯誤或 `null`。在實例化 `FormControl` 時，將這些函式作為第三個引數傳入。

注意：基於效能考量，Angular 只有在所有同步驗證器都通過時，才會執行非同步驗證器。每個驗證器都必須先完成，錯誤才會被設定。

### 內建驗證器

你可以選擇[撰寫自己的驗證器函式](guide/form-validation#自訂驗證器)，也可以使用 Angular 的一些內建驗證器。

範本驅動表單中可作為屬性使用的同一批內建驗證器，例如 `required` 與 `minlength`，全都可以作為 `Validators` 類別的函式來使用。內建驗證器的完整清單請見 [Validators](api/forms/Validators) API 參考文件。

若要把英雄表單改成反應式表單，可以使用同一批內建驗證器&mdash;這次改以函式形式使用。如下所示：

{@a reactive-component-class}

<code-example path="form-validation/src/app/reactive/hero-form-reactive.component.ts" region="form-group" title="reactive/hero-form-reactive.component.ts (validator functions)" linenums="false">
</code-example>

請注意：

* 名稱控制項設定了兩個內建驗證器&mdash;`Validators.required` 與 `Validators.minLength(4)`&mdash;以及一個自訂驗證器 `forbiddenNameValidator`。詳情請見本指南的[自訂驗證器](guide/form-validation#自訂驗證器)一節。
* 由於這些驗證器都是同步驗證器，因此將它們作為第二個引數傳入。
* 將函式以陣列形式傳入，即可支援多個驗證器。
* 此範例加入了幾個 getter 方法。在反應式表單中，你隨時可以透過父群組上的 `get` 方法存取任何表單控制項，但有時將 getter 定義成範本用的捷徑是很實用的。

如果你再看一次 name 輸入欄位的範本，它與範本驅動的範例相當相似。

<code-example path="form-validation/src/app/reactive/hero-form-reactive.component.html" region="name-with-error-msg" title="reactive/hero-form-reactive.component.html (name with error msg)" linenums="false">
</code-example>

重點整理：

 * 表單不再匯出任何指令，而是改用元件類別中定義的 `name` getter。
 * `required` 屬性仍然保留。雖然基於驗證目的它並非必要，但出於 CSS 樣式或無障礙的理由，你可能想把它保留在範本中。

## 自訂驗證器

內建驗證器不見得總是符合你應用程式的確切使用情境，因此有時你會想要建立自訂驗證器。

請看本指南先前[範例](guide/form-validation#reactive-component-class)中的 `forbiddenNameValidator` 函式。該函式的定義如下所示：

<code-example path="form-validation/src/app/shared/forbidden-name.directive.ts" region="custom-validator" title="shared/forbidden-name.directive.ts (forbiddenNameValidator)" linenums="false">
</code-example>

這個函式其實是一個工廠函式，它接受一個正規表示式，用來偵測_特定_的禁止名稱，並回傳一個驗證器函式。

在這個範例中，禁止名稱是 "bob"，因此驗證器會拒絕任何包含 "bob" 的英雄姓名。在其他地方，它也可以拒絕 "alice"，或任何符合所設定正規表示式的名稱。

`forbiddenNameValidator` 工廠函式會回傳設定好的驗證器函式。該函式接受一個 Angular 控制項物件，並回傳 null（若控制項的值有效）_或_一個驗證錯誤物件。驗證錯誤物件通常有一個屬性，其名稱就是驗證鍵 `'forbiddenName'`，其值則是一個任意的字典，你可以把這些值插入錯誤訊息中，例如 `{name}`。

自訂非同步驗證器與同步驗證器相似，但它們必須改為回傳一個 Promise 或 Observable，稍後發出 null 或一個驗證錯誤物件。若為 Observable，該 Observable 必須完成，屆時表單會使用最後發出的值來進行驗證。

### 加入反應式表單

在反應式表單中，加入自訂驗證器相當簡單。你只要將函式直接傳給 `FormControl` 即可。

<code-example path="form-validation/src/app/reactive/hero-form-reactive.component.ts" region="custom-validator" title="reactive/hero-form-reactive.component.ts (validator functions)" linenums="false">
</code-example>

### 加入範本驅動表單

在範本驅動表單中，你無法直接存取 `FormControl` 實例，因此不能像反應式表單那樣將驗證器傳入。相反地，你需要在範本中加入一個指令。

對應的 `ForbiddenValidatorDirective` 便是 `forbiddenNameValidator` 的包裝。

Angular 之所以能辨識這個指令在驗證流程中的角色，是因為該指令向 `NG_VALIDATORS` provider 註冊了自己，這個 provider 帶有一組可擴充的驗證器集合。

<code-example path="form-validation/src/app/shared/forbidden-name.directive.ts" region="directive-providers" title="shared/forbidden-name.directive.ts (providers)" linenums="false">
</code-example>

接著，指令類別實作了 `Validator` 介面，使它能輕鬆與 Angular 表單整合。以下是指令的其餘部分，幫助你了解這一切如何組合起來：

<code-example path="form-validation/src/app/shared/forbidden-name.directive.ts" region="directive" title="shared/forbidden-name.directive.ts (directive)">
</code-example>

`ForbiddenValidatorDirective` 準備好之後，你只要將它的選取器 `appForbiddenName` 加入任何 input 元素，即可啟用它。例如：

<code-example path="form-validation/src/app/template/hero-form-template.component.html" region="name-input" title="template/hero-form-template.component.html (forbidden-name-input)" linenums="false">

</code-example>

<div class="l-sub-section">

你可能已經注意到，自訂驗證指令是用 `useExisting` 而不是 `useClass` 來實例化的。註冊的驗證器必須是 `ForbiddenValidatorDirective` 的_這個_實例&mdash;也就是表單中的那個實例，其 `forbiddenName` 屬性繫結到 “bob”。如果你把 `useExisting` 換成 `useClass`，你註冊的就會是一個全新的類別實例，一個沒有 `forbiddenName` 的實例。

</div>

## 控制項狀態 CSS 類別

如同 AngularJS，Angular 會自動將許多控制項屬性鏡像到表單控制項元素上，作為 CSS 類別。你可以使用這些類別，依據表單的狀態為表單控制項元素設定樣式。目前支援下列類別：

* `.ng-valid`
* `.ng-invalid`
* `.ng-pending`
* `.ng-pristine`
* `.ng-dirty`
* `.ng-untouched`
* `.ng-touched`

英雄表單使用 `.ng-valid` 與 `.ng-invalid` 類別，來設定每個表單控制項邊框的顏色。

<code-example path="form-validation/src/assets/forms.css" title="forms.css (status classes)">

</code-example>

**你可以執行 <live-example></live-example> 來查看完整的反應式與範本驅動範例程式碼。**
