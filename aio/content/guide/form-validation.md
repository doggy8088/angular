# 表單驗證

驗證使用者輸入的正確性與完整性，可以提升整體資料品質。

本頁說明如何使用反應式表單與範本驅動表單，在 UI 中驗證使用者輸入並顯示實用的驗證訊息。本頁假設你對這兩個表單模組已有一些基本認識。

<div class="alert is-helpful">

如果你是表單新手，請先閱讀[表單](guide/forms)與[反應式表單](guide/reactive-forms)指南。

</div>

## 範本驅動驗證

若要為範本驅動表單加上驗證，你要加入的驗證屬性與[原生 HTML 表單驗證](https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/HTML5/Constraint_validation)所用的相同。Angular 使用指令，將這些屬性與框架中的驗證器函式對應起來。

每當表單控制項的值變更時，Angular 就會執行驗證，並產生一份驗證錯誤清單（使狀態成為 INVALID），或是 null（使狀態成為 VALID）。

接著，你可以把 `ngModel` 匯出為範本區域變數，藉此檢視控制項的狀態。下列範例將 `NgModel` 匯出為名為 `name` 的變數：

<code-example path="form-validation/src/app/template/hero-form-template.component.html" region="name-with-error-msg" header="template/hero-form-template.component.html (name)"></code-example>

請注意下列事項：

* `<input>` 元素帶有 HTML 驗證屬性：`required` 與 `minlength`。它也帶有一個自訂驗證器指令 `forbiddenName`。詳情請見[自訂驗證器](guide/form-validation#自訂驗證器)一節。

* `#name="ngModel"` 將 `NgModel` 匯出為名為 `name` 的區域變數。`NgModel` 鏡像了其底層 `FormControl` 實例的許多屬性，因此你可以在範本中使用它來檢查 `valid`、`dirty` 等控制項狀態。控制項屬性的完整清單請見 [AbstractControl](api/forms/AbstractControl) API 參考文件。

   * `<div>` 元素上的 `*ngIf` 會顯示一組巢狀訊息 `divs`，但只有在 `name` 無效，且控制項處於 `dirty` 或 `touched` 狀態時才會顯示。

   * 每個巢狀 `<div>` 都可以針對某一種可能的驗證錯誤呈現自訂訊息。這裡有 `required`、`minlength` 與 `forbiddenName` 的訊息。

<div class="alert is-helpful">

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

<code-example path="form-validation/src/app/reactive/hero-form-reactive.component.1.ts" region="form-group" header="reactive/hero-form-reactive.component.ts (validator functions)"></code-example>

請注意：

* 名稱控制項設定了兩個內建驗證器&mdash;`Validators.required` 與 `Validators.minLength(4)`&mdash;以及一個自訂驗證器 `forbiddenNameValidator`。詳情請見本指南的[自訂驗證器](guide/form-validation#自訂驗證器)一節。
* 由於這些驗證器都是同步驗證器，因此將它們作為第二個引數傳入。
* 將函式以陣列形式傳入，即可支援多個驗證器。
* 此範例加入了幾個 getter 方法。在反應式表單中，你隨時可以透過父群組上的 `get` 方法存取任何表單控制項，但有時將 getter 定義成範本用的捷徑是很實用的。

如果你再看一次 name 輸入欄位的範本，它與範本驅動的範例相當相似。

<code-example path="form-validation/src/app/reactive/hero-form-reactive.component.html" region="name-with-error-msg" header="reactive/hero-form-reactive.component.html (name with error msg)"></code-example>

重點整理：

 * 表單不再匯出任何指令，而是改用元件類別中定義的 `name` getter。
 * `required` 屬性仍然保留。雖然基於驗證目的它並非必要，但出於 CSS 樣式或無障礙的理由，你可能想把它保留在範本中。

## 自訂驗證器

內建驗證器不見得總是符合你應用程式的確切使用情境，因此有時你會想要建立自訂驗證器。

請看本指南先前[範例](guide/form-validation#reactive-component-class)中的 `forbiddenNameValidator` 函式。該函式的定義如下所示：

<code-example path="form-validation/src/app/shared/forbidden-name.directive.ts" region="custom-validator" header="shared/forbidden-name.directive.ts (forbiddenNameValidator)"></code-example>

這個函式其實是一個工廠函式，它接受一個正規表示式，用來偵測_特定_的禁止名稱，並回傳一個驗證器函式。

在這個範例中，禁止名稱是 "bob"，因此驗證器會拒絕任何包含 "bob" 的英雄姓名。在其他地方，它也可以拒絕 "alice"，或任何符合所設定正規表示式的名稱。

`forbiddenNameValidator` 工廠函式會回傳設定好的驗證器函式。該函式接受一個 Angular 控制項物件，並回傳 null（若控制項的值有效）_或_一個驗證錯誤物件。驗證錯誤物件通常有一個屬性，其名稱就是驗證鍵 `'forbiddenName'`，其值則是一個任意的字典，你可以把這些值插入錯誤訊息中，例如 `{name}`。

自訂非同步驗證器與同步驗證器相似，但它們必須改為回傳一個 Promise 或 Observable，稍後發出 null 或一個驗證錯誤物件。若為 Observable，該 Observable 必須完成，屆時表單會使用最後發出的值來進行驗證。

### 加入反應式表單

在反應式表單中，加入自訂驗證器相當簡單。你只要將函式直接傳給 `FormControl` 即可。

<code-example path="form-validation/src/app/reactive/hero-form-reactive.component.1.ts" region="custom-validator" header="reactive/hero-form-reactive.component.ts (validator functions)"></code-example>

### 加入範本驅動表單

在範本驅動表單中，你無法直接存取 `FormControl` 實例，因此不能像反應式表單那樣將驗證器傳入。相反地，你需要在範本中加入一個指令。

對應的 `ForbiddenValidatorDirective` 便是 `forbiddenNameValidator` 的包裝。

Angular 之所以能辨識這個指令在驗證流程中的角色，是因為該指令向 `NG_VALIDATORS` provider 註冊了自己，這個 provider 帶有一組可擴充的驗證器集合。

<code-example path="form-validation/src/app/shared/forbidden-name.directive.ts" region="directive-providers" header="shared/forbidden-name.directive.ts (providers)"></code-example>

接著，指令類別實作了 `Validator` 介面，使它能輕鬆與 Angular 表單整合。以下是指令的其餘部分，幫助你了解這一切如何組合起來：

<code-example path="form-validation/src/app/shared/forbidden-name.directive.ts" region="directive" header="shared/forbidden-name.directive.ts (directive)">
</code-example>

`ForbiddenValidatorDirective` 準備好之後，你只要將它的選取器 `appForbiddenName` 加入任何 input 元素，即可啟用它。例如：

<code-example path="form-validation/src/app/template/hero-form-template.component.html" region="name-input" header="template/hero-form-template.component.html (forbidden-name-input)"></code-example>

<div class="alert is-helpful">

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

<code-example path="form-validation/src/assets/forms.css" header="forms.css (status classes)">

</code-example>

## 跨欄位驗證

本節示範如何執行跨欄位驗證，並假設你對建立自訂驗證器已有一些基本知識。

<div class="alert is-helpful">

如果你以前沒有建立過自訂驗證器，請先閱讀[自訂驗證器一節](guide/form-validation#自訂驗證器)。

</div>

在下列章節中，我們將填寫英雄表單，確保我們的英雄不會洩漏他們的真實身分。做法是驗證英雄的名字與化名不相符。

### 加入反應式表單

這個表單的結構如下：

```javascript
const heroForm = new FormGroup({
  'name': new FormControl(),
  'alterEgo': new FormControl(),
  'power': new FormControl()
});
```

請注意，name 與 alterEgo 是同層級的控制項。若要在單一自訂驗證器中同時評估這兩個控制項，我們應該在一個共同的祖先控制項 `FormGroup` 中執行驗證。這樣一來，我們就可以查詢 `FormGroup` 取得子控制項，進而比較它們的值。

若要為 `FormGroup` 加入驗證器，請在建立時把新的驗證器作為第二個引數傳入。

```javascript
const heroForm = new FormGroup({
  'name': new FormControl(),
  'alterEgo': new FormControl(),
  'power': new FormControl()
}, { validators: identityRevealedValidator });
```

驗證器的程式碼如下：

<code-example path="form-validation/src/app/shared/identity-revealed.directive.ts" region="cross-validation-validator" header="shared/identity-revealed.directive.ts"></code-example>

identity 驗證器實作了 `ValidatorFn` 介面。它接受一個 Angular 控制項物件作為引數，若表單有效則回傳 null，否則回傳 `ValidationErrors`。

首先，我們呼叫 `FormGroup` 的 [get](api/forms/AbstractControl#get) 方法來取得子控制項。接著，我們只需比較 `name` 與 `alterEgo` 控制項的值。

如果這些值不相符，英雄的身分就能保密，我們可以安全地回傳 null。否則，英雄的身分就會洩漏，我們必須回傳一個錯誤物件，將表單標記為無效。

接著，為了提供更好的使用者體驗，我們會在表單無效時顯示適當的錯誤訊息。

<code-example path="form-validation/src/app/reactive/hero-form-reactive.component.html" region="cross-validation-error-message" header="reactive/hero-form-template.component.html"></code-example>

請注意，我們會檢查：
- `FormGroup` 是否具有 `identityRevealed` 驗證器回傳的跨欄位驗證錯誤，
- 使用者是否尚未[與表單互動](guide/form-validation#為什麼要檢查-dirty-與-touched？)。

### 加入範本驅動表單

首先，我們必須建立一個指令來包裝驗證器函式。我們使用 `NG_VALIDATORS` token 將其作為驗證器提供。如果你不確定原因，或尚未完全理解這個語法，請重新閱讀先前的[章節](guide/form-validation#加入範本驅動表單)。

<code-example path="form-validation/src/app/shared/identity-revealed.directive.ts" region="cross-validation-directive" header="shared/identity-revealed.directive.ts"></code-example>

接著，我們必須將指令加入 html 範本。由於驗證器必須在表單的最高層級註冊，因此我們將指令放在 `form` 標籤上。

<code-example path="form-validation/src/app/template/hero-form-template.component.html" region="cross-validation-register-validator" header="template/hero-form-template.component.html"></code-example>

為了提供更好的使用者體驗，當表單無效時，會出現適當的錯誤訊息。

<code-example path="form-validation/src/app/template/hero-form-template.component.html" region="cross-validation-error-message" header="template/hero-form-template.component.html"></code-example>

請注意，我們會檢查：
- 表單是否具有 `identityRevealed` 驗證器回傳的跨欄位驗證錯誤，
- 使用者是否尚未[與表單互動](guide/form-validation#為什麼要檢查-dirty-與-touched？)。

這就完成了跨欄位驗證範例。我們成功做到：
- 根據兩個同層級控制項的值驗證表單，
- 在使用者與表單互動且驗證失敗後，顯示具描述性的錯誤訊息。

## 非同步驗證

本節示範如何建立非同步驗證器，並假設你對建立[自訂驗證器](guide/form-validation#自訂驗證器)已有一些基本知識。

### 基礎知識

如同同步驗證器具有 `ValidatorFn` 與 `Validator` 介面，非同步驗證器也有其對應介面：`AsyncValidatorFn` 與 `AsyncValidator`。

它們非常相似，唯一的差異是：

* 它們必須回傳一個 Promise 或 Observable，
* 回傳的 observable 必須是有限的，意即它必須在某個時間點完成。若要將無限的 observable 轉換為有限的，可讓 observable 經過 `first`、`last`、`take` 或 `takeUntil` 等篩選運算子進行 pipe。

重要的是，非同步驗證會在同步驗證之後進行，且僅在同步驗證成功時才執行。這項檢查能讓表單避免潛在成本高昂的非同步驗證流程（例如 HTTP 請求），如果較基本的驗證方法失敗的話。

非同步驗證開始後，表單控制項會進入 `pending` 狀態。你可以檢視控制項的 `pending` 屬性，並用它來針對進行中的驗證提供視覺回饋。

一種常見的 UI 模式，是在執行非同步驗證時顯示載入指示器（spinner）。以下範例示範如何使用範本驅動表單達成這一點：

```html
<input [(ngModel)]="name" #model="ngModel" appSomeAsyncValidator>
<app-spinner *ngIf="model.pending"></app-spinner>
```

### 實作自訂非同步驗證器

在下一節中，我們將以非同步方式執行驗證，確保我們的英雄挑選的化名尚未被其他人使用。新英雄不斷加入，舊英雄也不斷退役。這意味著我們無法預先知道可用化名的清單。

為了驗證潛在的化名，我們需要查詢所有目前在役英雄的中央資料庫。這個過程是非同步的，因此我們需要一個專用的驗證器。

讓我們先建立驗證器類別。

<code-example path="form-validation/src/app/shared/alter-ego.directive.ts" region="async-validator"></code-example>

如你所見，`UniqueAlterEgoValidator` 類別實作了 `AsyncValidator` 介面。在建構函式中，我們注入 `HeroesService`，其介面如下：

```typescript
interface HeroesService {
  isAlterEgoTaken: (alterEgo: string) => Observable<boolean>;
}
```

在真實世界的應用程式中，`HeroesService` 負責向英雄資料庫發出 HTTP 請求，以檢查化名是否可用。從驗證器的角度來看，服務的實際實作並不重要，因此我們可以直接針對 `HeroesService` 介面撰寫程式。

驗證開始時，`UniqueAlterEgoValidator` 會以目前的控制項值，委派給 `HeroesService` 的 `isAlterEgoTaken()` 方法。此時控制項會被標記為 `pending`，並維持這個狀態，直到 `validate()` 方法回傳的 observable 鏈完成為止。

`isAlterEgoTaken()` 方法會發出 HTTP 請求來檢查化名是否可用，並回傳 `Observable<boolean>` 作為結果。我們讓回應經過 `map` 運算子進行 pipe，並將其轉換成驗證結果。一如既往地，若表單有效，我們會回傳 `null`；若表單無效，則回傳 `ValidationErrors`。我們務必使用 `catchError` 運算子處理任何潛在的錯誤。

這裡我們決定將 `isAlterEgoTaken()` 的錯誤視為驗證成功，因為驗證請求失敗並不一定代表化名無效。你也可以用不同的方式處理錯誤，改為回傳 `ValidationError` 物件。

經過一段時間後，observable 鏈即完成，非同步驗證也結束。`pending` 旗標會被設為 `false`，表單的有效性也會更新。

### 效能注意事項

預設情況下，所有驗證器會在每次表單值變更後執行。對於同步驗證器，這不太可能對應用程式效能造成明顯影響。然而，非同步驗證器通常會執行某種 HTTP 請求來驗證控制項。在每次按鍵時都發出 HTTP 請求，可能會對後端 API 造成負擔，因此應盡可能避免。

我們可以將 `updateOn` 屬性從 `change`（預設值）變更為 `submit` 或 `blur`，以延遲更新表單的有效性。

使用範本驅動表單時：

```html
<input [(ngModel)]="name" [ngModelOptions]="{updateOn: 'blur'}">
```

使用反應式表單時：

```typescript
new FormControl('', {updateOn: 'blur'});
```

**你可以執行 <live-example></live-example> 來查看完整的反應式與範本驅動範例程式碼。**