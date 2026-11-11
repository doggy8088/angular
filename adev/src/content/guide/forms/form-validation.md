# 驗證表單輸入

驗證使用者輸入的正確性與完整性，可以提升整體資料品質。
本頁說明如何從 UI 驗證使用者輸入，並顯示實用的驗證訊息，內容涵蓋反應式表單與範本驅動表單。

## 在範本驅動表單中驗證輸入 {#validating-input-in-template-driven-forms}

若要為範本驅動表單加上驗證，你要加入的驗證屬性與[原生 HTML 表單驗證](https://developer.mozilla.org/docs/Web/Guide/HTML/HTML5/Constraint_validation)所用的相同。
Angular 使用指令，將這些屬性與框架中的驗證器函式對應起來。

每當表單控制項的值變更時，Angular 就會執行驗證，並產生一份驗證錯誤清單（使狀態成為 `INVALID`），或是 null（使狀態成為 VALID）。

接著，你可以把 `ngModel` 匯出為範本區域變數，藉此檢視控制項的狀態。
下列範例將 `NgModel` 匯出為名為 `name` 的變數：

<docs-code header="template/actor-form-template.component.html (name)" path="adev/src/content/examples/form-validation/src/app/template/actor-form-template.component.html" visibleRegion="name-with-error-msg"/>

請注意範例所示範的下列特點。

* `<input>` 元素帶有 HTML 驗證屬性：`required` 與 `minlength`。
    它也帶有一個自訂驗證器指令 `forbiddenName`。
    詳情請見[自訂驗證器](#defining-custom-validators)一節。

* `#name="ngModel"` 將 `NgModel` 匯出為名為 `name` 的區域變數。
    `NgModel` 鏡像了其底層 `FormControl` 實例的許多屬性，因此你可以在範本中使用它來檢查 `valid`、`dirty` 等控制項狀態。
    控制項屬性的完整清單請見 [AbstractControl](api/forms/AbstractControl) API 參考文件。

  * 最外層的 `@if` 只有在 `name` 無效，且控制項處於 `dirty` 或 `touched` 狀態時，才會顯示一組巢狀訊息。

  * 每個巢狀 `@if` 都可以針對某一種可能的驗證錯誤呈現自訂訊息。
        這裡有 `required`、`minlength` 與 `forbiddenName` 的訊息。

HELPFUL: 為了避免驗證器在使用者還來不及編輯表單前就顯示錯誤，你應該檢查控制項是否處於 `dirty` 或 `touched` 狀態。

* 當使用者變更受監看欄位的值時，該控制項會被標記為「dirty」
* 當使用者讓表單控制項元素失焦時，該控制項會被標記為「touched」

## 在反應式表單中驗證輸入 {#validating-input-in-reactive-forms}

在反應式表單中，真相來源是元件類別。
你不是透過範本中的屬性加入驗證器，而是直接把驗證器函式加入元件類別中的表單控制項模型。
接著，每當控制項的值變更時，Angular 就會呼叫這些函式。

### 驗證器函式

驗證器函式可以是同步的，也可以是非同步的。

| 驗證器類型     | 說明                                                                                                                                                                                                                 |
| :--------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 同步驗證器  | 同步函式，接受一個控制項實例，並立即回傳一組驗證錯誤或 `null`。在實例化 `FormControl` 時，將這些函式作為第二個引數傳入。                       |
| 非同步驗證器 | 非同步函式，接受一個控制項實例，並回傳一個 Promise 或 Observable，稍後發出（emit）一組驗證錯誤或 `null`。在實例化 `FormControl` 時，將這些函式作為第三個引數傳入。 |

基於效能考量，Angular 只有在所有同步驗證器都通過時，才會執行非同步驗證器。
每個驗證器都必須先完成，錯誤才會被設定。

### 內建驗證器函式

你可以選擇[撰寫自己的驗證器函式](#defining-custom-validators)，也可以使用 Angular 的一些內建驗證器。

範本驅動表單中可作為屬性使用的同一批內建驗證器，例如 `required` 與 `minlength`，全都可以作為 `Validators` 類別的函式來使用。
內建驗證器的完整清單請見 [Validators](api/forms/Validators) API 參考文件。

若要把演員表單改成反應式表單，可以使用同一批內建驗證器——這次改以函式形式使用，如下列範例所示。

<docs-code header="reactive/actor-form-reactive.component.ts (validator functions)" path="adev/src/content/examples/form-validation/src/app/reactive/actor-form-reactive.component.1.ts" visibleRegion="form-group"/>

在這個範例中，`name` 控制項設定了兩個內建驗證器——`Validators.required` 與 `Validators.minLength(4)`——以及一個自訂驗證器 `forbiddenNameValidator`。

這些驗證器全都是同步的，所以作為第二個引數傳入。
請注意，你可以把多個驗證器函式組成陣列傳入，藉此支援多個驗證器。

這個範例也加入了幾個 getter 方法。
在反應式表單中，你隨時都可以透過父群組的 `get` 方法存取任何表單控制項，但有時把 getter 定義成範本用的簡寫會更方便。

如果你再看一次 `name` 輸入欄位的範本，它與範本驅動的範例相當相似。

<docs-code header="reactive/actor-form-reactive.component.html (name with error msg)" path="adev/src/content/examples/form-validation/src/app/reactive/actor-form-reactive.component.html" visibleRegion="name-with-error-msg"/>

這個表單與範本驅動版本的不同之處，在於它不再匯出任何指令，而是使用元件類別中定義的 `name` getter。

請注意，範本中仍然保留了 `required` 屬性。雖然它對驗證而言並非必要，但為了無障礙的目的，應該將它保留。

## 定義自訂驗證器 {#defining-custom-validators}

內建驗證器不見得總是符合你應用程式的確切使用情境，因此有時你需要建立自訂驗證器。

以前面範例中的 `forbiddenNameValidator` 函式為例。
這個函式的定義如下所示。

<docs-code header="shared/forbidden-name.directive.ts (forbiddenNameValidator)" path="adev/src/content/examples/form-validation/src/app/shared/forbidden-name.directive.ts" visibleRegion="custom-validator"/>

這個函式是一個工廠函式，它接受一個正規表示式，用來偵測*特定*的禁止名稱，並回傳一個驗證器函式。

在這個範例中，禁止名稱是 "bob"，因此驗證器會拒絕任何包含 "bob" 的演員姓名。
在其他地方，它也可以拒絕 "alice"，或任何符合所設定正規表示式的名稱。

`forbiddenNameValidator` 工廠函式會回傳設定好的驗證器函式。
該函式接受一個 Angular 控制項物件，並回傳 null（若控制項的值有效）*或*一個驗證錯誤物件。
驗證錯誤物件通常有一個屬性，其名稱就是驗證鍵 `'forbiddenName'`，其值則是一個任意的字典，你可以把這些值插入錯誤訊息中，例如 `{name}`。

自訂非同步驗證器與同步驗證器相似，但它們必須改為回傳一個 Promise 或 observable，稍後發出 null 或驗證錯誤物件。
若是 observable，該 observable 必須完成，屆時表單會使用最後發出的值來進行驗證。

### 將自訂驗證器加入反應式表單

在反應式表單中，將函式直接傳給 `FormControl`，即可加入自訂驗證器。

<docs-code header="reactive/actor-form-reactive.component.ts (validator functions)" path="adev/src/content/examples/form-validation/src/app/reactive/actor-form-reactive.component.1.ts" visibleRegion="custom-validator"/>

### 將自訂驗證器加入範本驅動表單

在範本驅動表單中，要在範本中加入一個指令，由該指令包裝驗證器函式。
例如，對應的 `ForbiddenValidatorDirective` 就是 `forbiddenNameValidator` 的包裝。

Angular 之所以能辨識這個指令在驗證流程中的角色，是因為該指令向 `NG_VALIDATORS` provider 註冊了自己，如下列範例所示。
`NG_VALIDATORS` 是一個預先定義的 provider，帶有一組可擴充的驗證器集合。

<docs-code header="shared/forbidden-name.directive.ts (providers)" path="adev/src/content/examples/form-validation/src/app/shared/forbidden-name.directive.ts" visibleRegion="directive-providers"/>

接著，指令類別實作了 `Validator` 介面，使它能輕鬆與 Angular 表單整合。
以下是指令的其餘部分，幫助你了解這一切如何組合起來。

<docs-code header="shared/forbidden-name.directive.ts (directive)" path="adev/src/content/examples/form-validation/src/app/shared/forbidden-name.directive.ts" visibleRegion="directive"/>

`ForbiddenValidatorDirective` 準備好之後，你可以把它的 selector `appForbiddenName` 加入任何 input 元素來啟用它。
例如：

<docs-code header="template/actor-form-template.component.html (forbidden-name-input)" path="adev/src/content/examples/form-validation/src/app/template/actor-form-template.component.html" visibleRegion="name-input"/>

HELPFUL: 請注意，自訂驗證指令是用 `useExisting` 而不是 `useClass` 來實例化的。
註冊的驗證器必須是 `ForbiddenValidatorDirective` 的*這個*實例——也就是表單中那個實例，其 `forbiddenName` 屬性繫結到 "bob"。

如果你把 `useExisting` 換成 `useClass`，註冊的就會是一個新的類別實例，而它並沒有 `forbiddenName`。

## 控制項狀態 CSS 類別 {#control-status-css-classes}

Angular 會自動將許多控制項屬性鏡像到表單控制項元素上，作為 CSS 類別。
你可以使用這些類別，依據表單的狀態為表單控制項元素設定樣式。
目前支援下列類別。

* `.ng-valid`
* `.ng-invalid`
* `.ng-pending`
* `.ng-pristine`
* `.ng-dirty`
* `.ng-untouched`
* `.ng-touched`
* `.ng-submitted`（僅限最外層的 form 元素）

在下列範例中，演員表單使用 `.ng-valid` 與 `.ng-invalid` 類別，來設定每個表單控制項邊框的顏色。

<docs-code header="forms.css (status classes)" path="adev/src/content/examples/form-validation/src/assets/forms.css"/>

## 跨欄位驗證

跨欄位驗證器是一種[自訂驗證器](#defining-custom-validators "Read about custom validators")，它會比較表單中不同欄位的值，並依其組合接受或拒絕這些值。
例如，你可能有一個表單提供互不相容的選項，讓使用者可以選 A 或 B，但不能兩者都選。
某些欄位值也可能相依於其他欄位；使用者可能只有在同時選擇 A 時，才被允許選擇 B。

下列跨欄位驗證範例示範如何做到下列事項：

* 依據兩個同層控制項的值，驗證反應式或範本驅動的表單輸入，
* 在使用者與表單互動且驗證失敗後，顯示具描述性的錯誤訊息。

這些範例使用跨欄位驗證，透過填寫演員表單，確保演員不會在自己的角色上重複使用相同姓名。
驗證器的做法是檢查演員的姓名與角色是否相符。

### 將跨欄位驗證加入反應式表單

這個表單的結構如下：

<docs-code language="javascript">

const actorForm = new FormGroup({
  'name': new FormControl(),
  'role': new FormControl(),
  'skill': new FormControl()
});

</docs-code>

請注意，`name` 與 `role` 是同層控制項。
若要在單一自訂驗證器中同時評估這兩個控制項，你必須在它們共同的祖先控制項中執行驗證：也就是 `FormGroup`。
你向 `FormGroup` 查詢它的子控制項，以便比較它們的值。

若要為 `FormGroup` 加入驗證器，請在建立時把新的驗證器作為第二個引數傳入。

<docs-code language="javascript">

const actorForm = new FormGroup({
  'name': new FormControl(),
  'role': new FormControl(),
  'skill': new FormControl()
}, { validators: unambiguousRoleValidator });

</docs-code>

驗證器的程式碼如下。

<docs-code header="shared/unambiguous-role.directive.ts" path="adev/src/content/examples/form-validation/src/app/shared/unambiguous-role.directive.ts" visibleRegion="cross-validation-validator"/>

`unambiguousRoleValidator` 驗證器實作了 `ValidatorFn` 介面。
它接受一個 Angular 控制項物件作為引數，若表單有效則回傳 null，否則回傳 `ValidationErrors`。

這個驗證器透過呼叫 `FormGroup` 的 [get](api/forms/AbstractControl#get) 方法取得子控制項，然後比較 `name` 與 `role` 控制項的值。

如果兩個值不相符，表示角色並不含糊，兩者都有效，驗證器回傳 null。
如果兩者相符，表示演員的角色含糊不清，驗證器必須回傳一個錯誤物件，把表單標記為無效。

為了提供更好的使用者體驗，當表單無效時，範本會顯示適當的錯誤訊息。

<docs-code header="reactive/actor-form-template.component.html" path="adev/src/content/examples/form-validation/src/app/reactive/actor-form-reactive.component.html" visibleRegion="cross-validation-error-message"/>

這個 `@if` 會在 `FormGroup` 帶有 `unambiguousRoleValidator` 驗證器回傳的跨欄位驗證錯誤時顯示該錯誤，但前提是使用者已完成[與表單的互動](#control-status-css-classes)。

### 將跨欄位驗證加入範本驅動表單

對於範本驅動表單，你必須建立一個指令來包裝驗證器函式。
你使用 [`NG_VALIDATORS` token](/api/forms/NG_VALIDATORS) 把該指令提供為驗證器，如下列範例所示。

<docs-code header="shared/unambiguous-role.directive.ts" path="adev/src/content/examples/form-validation/src/app/shared/unambiguous-role.directive.ts" visibleRegion="cross-validation-directive"/>

你必須把這個新指令加入 HTML 範本。
由於驗證器必須在表單的最高層級註冊，下列範本把指令放在 `form` 標籤上。

<docs-code header="template/actor-form-template.component.html" path="adev/src/content/examples/form-validation/src/app/template/actor-form-template.component.html" visibleRegion="cross-validation-register-validator"/>

為了提供更好的使用者體驗，當表單無效時，會出現適當的錯誤訊息。

<docs-code header="template/actor-form-template.component.html" path="adev/src/content/examples/form-validation/src/app/template/actor-form-template.component.html" visibleRegion="cross-validation-error-message"/>

這一點在範本驅動表單與反應式表單中都相同。

## 建立非同步驗證器 {#creating-asynchronous-validators}

非同步驗證器實作了 `AsyncValidatorFn` 與 `AsyncValidator` 介面。
它們與同步的對應物非常相似，只有下列差異。

* `validate()` 函式必須回傳 Promise 或 observable，
* 回傳的 observable 必須是有限的，也就是它必須在某個時間點完成。
    若要把無限 observable 轉成有限的，可以透過 `first`、`last`、`take` 或 `takeUntil` 等過濾運算子來串接（pipe）observable。

非同步驗證在同步驗證之後進行，而且只有在同步驗證成功時才會執行。
這道檢查讓表單得以避免潛在成本高昂的非同步驗證流程（例如 HTTP 請求），前提是較基本的驗證方法已經發現無效的輸入。

非同步驗證開始後，表單控制項會進入 `pending` 狀態。
你可以檢視控制項的 `pending` 屬性，並用它來提供有關進行中驗證操作的視覺回饋。

一個常見的 UI 模式是在執行非同步驗證時顯示一個 spinner。
下列範例示範如何在範本驅動表單中做到這一點。

<docs-code language="html">

<input [(ngModel)]="name" #model="ngModel" appSomeAsyncValidator>
<app-spinner *ngIf="model.pending"></app-spinner>

</docs-code>

### 實作自訂非同步驗證器 {#implementing-a-custom-async-validator}

在下列範例中，一個非同步驗證器確保演員被安排到尚未被佔用的角色。
新演員不斷來試鏡，舊演員不斷退休，因此可用角色的清單無法事先取得。
若要驗證潛在的角色輸入，驗證器必須啟動一個非同步操作，去查詢目前所有已選角演員的中央資料庫。

下列程式碼建立了驗證器類別 `UniqueRoleValidator`，它實作了 `AsyncValidator` 介面。

<docs-code path="adev/src/content/examples/form-validation/src/app/shared/role.directive.ts" visibleRegion="async-validator"/>

`actorsService` 屬性以 `ActorsService` token 的實例初始化，該 token 定義了下列介面。

<docs-code language="typescript">
interface ActorsService {
  isRoleTaken: (role: string) => Observable<boolean>;
}
</docs-code>

在真實世界的應用程式中，`ActorsService` 會負責向演員資料庫發出 HTTP 請求，檢查角色是否可用。
從驗證器的角度來看，服務的實際實作並不重要，因此範例可以直接針對 `ActorsService` 介面來撰寫程式。

驗證開始時，`UnambiguousRoleValidator` 會以目前的控制項值，委派給 `ActorsService` 的 `isRoleTaken()` 方法。
此時控制項會被標記為 `pending`，並維持這個狀態，直到 `validate()` 方法回傳的 observable 鏈完成為止。

`isRoleTaken()` 方法會發出一個 HTTP 請求，檢查角色是否可用，並回傳 `Observable<boolean>` 作為結果。
`validate()` 方法透過 `map` 運算子串接回應，並將它轉換成驗證結果。

接著，這個方法就像任何驗證器一樣，若表單有效就回傳 `null`，若無效就回傳 `ValidationErrors`。
這個驗證器使用 `catchError` 運算子處理任何潛在錯誤。
在這個案例中，驗證器把 `isRoleTaken()` 的錯誤視為驗證成功，因為驗證請求失敗並不一定表示角色無效。
你可以改以不同方式處理錯誤，改為回傳 `ValidationError` 物件。

一段時間過去後，observable 鏈完成，非同步驗證也隨之結束。
`pending` 旗標被設為 `false`，表單的有效性也隨之更新。

### 將非同步驗證器加入反應式表單

若要在反應式表單中使用非同步驗證器，先把驗證器注入到元件類別的一個屬性中。

<docs-code path="adev/src/content/examples/form-validation/src/app/reactive/actor-form-reactive.component.2.ts" visibleRegion="async-validator-inject"/>

接著，把驗證器函式直接傳給 `FormControl` 來套用它。

在下列範例中，`UnambiguousRoleValidator` 的 `validate` 函式被套用到 `roleControl`，做法是把它傳給控制項的 `asyncValidators` 選項，並把它繫結到注入到 `ActorFormReactiveComponent` 的 `UnambiguousRoleValidator` 實例。
`asyncValidators` 的值可以是單一非同步驗證器函式，也可以是函式陣列。
若要進一步了解 `FormControl` 選項，請見 [AbstractControlOptions](api/forms/AbstractControlOptions) API 參考文件。

<docs-code path="adev/src/content/examples/form-validation/src/app/reactive/actor-form-reactive.component.2.ts" visibleRegion="async-validator-usage"/>

### 將非同步驗證器加入範本驅動表單

若要在範本驅動表單中使用非同步驗證器，請建立一個新指令，並在它上面註冊 `NG_ASYNC_VALIDATORS` provider。

在下面的範例中，該指令注入了包含實際驗證邏輯的 `UniqueRoleValidator` 類別，並在 `validate` 函式中呼叫它；這個函式會在 Angular 認為應該進行驗證時被觸發。

<docs-code path="adev/src/content/examples/form-validation/src/app/shared/role.directive.ts" visibleRegion="async-validator-directive"/>

接著，如同同步驗證器一樣，把指令的 selector 加入某個 input 來啟用它。

<docs-code header="template/actor-form-template.component.html (unique-unambiguous-role-input)" path="adev/src/content/examples/form-validation/src/app/template/actor-form-template.component.html" visibleRegion="role-input"/>

### 優化非同步驗證器的效能

預設情況下，所有驗證器都會在每次表單值變更後執行。
使用同步驗證器時，這通常不會對應用程式效能造成明顯影響。
然而，非同步驗證器通常會執行某種 HTTP 請求來驗證控制項。
每次按鍵都發出 HTTP 請求，可能會對後端 API 造成負擔，能避免就應該避免。

你可以把 `updateOn` 屬性從 `change`（預設）改為 `submit` 或 `blur`，藉此延後更新表單的有效性狀態。

在範本驅動表單中，請在範本中設定這個屬性。

<docs-code language="html">
<input [(ngModel)]="name" [ngModelOptions]="{updateOn: 'blur'}">
</docs-code>

在反應式表單中，請在 `FormControl` 實例中設定這個屬性。

<docs-code language="typescript">
new FormControl('', {updateOn: 'blur'});
</docs-code>

## 與原生 HTML 表單驗證的互動

預設情況下，Angular 會在最外層的 `<form>` 上加上 `novalidate` 屬性來停用[原生 HTML 表單驗證](https://developer.mozilla.org/docs/Web/Guide/HTML/Constraint_validation)，並使用指令將這些屬性與框架中的驗證器函式對應起來。
如果你想把原生驗證與以 Angular 為基礎的驗證**結合**使用，可以用 `ngNativeValidate` 指令重新啟用原生驗證。
詳情請見 [API 文件](api/forms/NgForm#native-dom-validation-ui)。
