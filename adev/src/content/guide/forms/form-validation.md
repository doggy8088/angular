# 表單輸入驗證

您可以透過驗證使用者輸入的準確性和完整性來改善整體資料品質。
此頁面顯示如何驗證來自 UI 的使用者輸入，並在反應式和範本驅動的表單中顯示有用的驗證訊息。

## 在模板驅動的表單中驗證輸入

若要將驗證新增至範本驅動的表單，請新增與 [原生 HTML 表單驗證](https://developer.mozilla.org/docs/Web/Guide/HTML/HTML5/Constraint_validation) 相同的驗證屬性。
Angular 使用指令將這些屬性與架構中的驗證器函式相符。

每次表單控制項的值變更時，Angular 會執行驗證並產生驗證錯誤清單，清單會導致 `INVALID` 狀態，或產生 null，導致 VALID 狀態。

然後，您可以通過將 `ngModel` 導出到本地範本變數來檢查控制項的狀態。
以下範例將 `NgModel` 導出到稱為 `name` 的變數：

<docs-code header="template/actor-form-template.component.html (name)" path="adev/src/content/examples/form-validation/src/app/template/actor-form-template.component.html" visibleRegion="name-with-error-msg"/>

請注意範例說明的下列功能。

* `<input>` 元素包含 HTML 驗證屬性：`required` 和 `minlength`。
    它還包含自訂驗證指令 `forbiddenName`。
    如需更多資訊，請參閱 [自訂驗證器](#defining-custom-validators) 部分。

* `#name="ngModel"` 將 `NgModel` 匯出至名為 `name` 的當地變數。
    `NgModel` 模擬其底層 `FormControl` 實例的許多屬性，因此您可以在範本中使用此屬性來檢查控制狀態，例如 `valid` 和 `dirty`。
    如需控制屬性的完整清單，請參閱 [AbstractControl](api/forms/AbstractControl) API 參考。

  * `<div>` 元素上的 `*ngIf` 會揭露一組巢狀訊息 `div`，但前提是 `name` 無效且控制項為 `dirty` 或 `touched`。

  * 每個巢狀 `<div>` 可以針對其中一個可能的驗證錯誤提供自訂訊息。
    有針對 `required`、`minlength` 和 `forbiddenName` 的訊息。

HELPFUL: 為了防止驗證器在使用者有機會編輯表單之前顯示錯誤，您應該在控制項中檢查「dirty」或「touched」狀態。

* 當使用者更改被監控欄位的值時，該控制項被標記為「已修改」
* 當使用者使表單控制元件失去焦點時，該控制項被標記為「已觸發」

## 在反應式表單中驗證輸入

在反應式表單中，真實來源是元件類別。
您不是透過範本中的屬性來新增驗證器，而是將驗證器函數直接新增到元件類別中的表單控制模型。
然後，每當控制項的值變更時，Angular 會呼叫這些函數。

### 驗證器函數

驗證器函數可以同步或非同步。

| 校驗器類型 | 詳細資料 |
|:--- |:--- |
| 同步驗證器 | 同步函數，會取得控制項實例並立即傳回一組驗證錯誤或 `null`。在實例化 `FormControl` 時，將這些函數作為第二個參數傳入。 |
| 非同步驗證器 | 非同步函數，會取得控制項實例並傳回 Promise 或 Observable，稍後會發出一組驗證錯誤或 `null`。在實例化 `FormControl` 時，將這些函數作為第三個參數傳入。 |

基於效能原因，Angular 僅在所有同步驗證器通過時才執行非同步驗證器。
每個驗證器都必須完成後，才會設定錯誤。

### 內建驗證函數

您可以選擇 [撰寫您自己的驗證程式函式](#defining-custom-validators)，也可以使用一些 Angular 的內建驗證程式。

與範本驅動表單中的屬性相同的內建驗證器，例如 `required` 和 `minlength`，都可做為 `Validators` 類別的函數加以使用。
如需內建驗證器的完整清單，請參閱 [Validators](api/forms/Validators) API 參考。

若要將演員表單更新為反應式表單，請使用一些內建驗證器 &mdash; 這次以函數形式，如下面的範例。

<docs-code header="reactive/actor-form-reactive.component.ts (validator functions)" path="adev/src/content/examples/form-validation/src/app/reactive/actor-form-reactive.component.1.ts" visibleRegion="form-group"/>

在此範例中，`name` 控制項設定了兩個內建驗證器 &mdash;`Validators.required` 和 `Validators.minLength(4)`&mdash; 和一個自訂驗證器 `forbiddenNameValidator`。

所有這些驗證器都是同步的，因此它們作為第二個參數傳遞。
請注意，您可以通過將函數作為陣列傳遞來支援多個驗證器。

此範例也加入了幾個 getter 方法。
在一個反應式表單中，您可以隨時透過其父群組的 `get` 方法存取任何表單控制項，但有時將 getter 定義為範本的簡寫會很有用。

如果您再看看 `name` 輸入的範本，它與範本驅動的範例相當類似。

<docs-code header="reactive/actor-form-reactive.component.html (name with error msg)" path="adev/src/content/examples/form-validation/src/app/reactive/actor-form-reactive.component.html" visibleRegion="name-with-error-msg"/>

此表單與範本驅動版本不同之處在於它不再匯出任何指令。反之，它使用在元件類別中定義的 `name` getter。

請注意，範本中仍然存在 `required` 屬性。儘管它對於驗證來說不是必需的，但應保留它以確保無障礙性。

## 定義自訂驗證器

內建的驗證器並不總能符合您的應用程式的確切用例，因此您有時需要建立自訂驗證器。

考慮前一個範例中的 `forbiddenNameValidator` 函數。
以下是該函數的定義範例。

<docs-code header="shared/forbidden-name.directive.ts (forbiddenNameValidator)" path="adev/src/content/examples/form-validation/src/app/shared/forbidden-name.directive.ts" visibleRegion="custom-validator"/>

該函數是一個工廠，用於採用正規表達式來檢測一個*特定*的禁止名稱並返回一個驗證器函數。

在此範例中，禁止使用的名稱是「bob」，因此驗證器會拒絕任何包含「bob」的演出者名稱。
在其他地方，它可能會拒絕「alice」或任何符合設定正規表達式名稱。

`forbiddenNameValidator` 工廠回傳已設定的驗證函數。
該函數採用 Angular 控制物件，並回傳 *null*（如果控制值有效）*或* 驗證錯誤物件。
驗證錯誤物件通常會有一個屬性，其名稱為驗證金鑰，`'forbiddenName'`，其值是您可以插入錯誤訊息的任意值字典，`{name}`。

自訂非同步驗證器類似於同步驗證器，但它們必須返回一個 Promise 或稍後發出 null 或驗證錯誤物件的可觀察物。
如果使用可觀察物，則可觀察物必須完成，此時表單使用最後發出的值來進行驗證。

### 在反應式表單中新增自訂驗證器

在反應式表格中，直接將函式傳遞給 `FormControl` 來新增自訂驗證器。

<docs-code header="reactive/actor-form-reactive.component.ts (validator functions)" path="adev/src/content/examples/form-validation/src/app/reactive/actor-form-reactive.component.1.ts" visibleRegion="custom-validator"/>

### 在範本驅動的表單中新增自訂驗證器

在範本驅動的表單中，將指令新增至範本，其中指令會包裝驗證器函式。
例如，對應的 `ForbiddenValidatorDirective` 會作為 `forbiddenNameValidator` 的包裝器。

`Angular` 辨識指令在驗證程序中的角色，因為指令透過 `NG_VALIDATORS` 提供者註冊本身，如下例所示。
`NG_VALIDATORS` 是預先定義的提供者，具備可延伸的驗證器集合。

<docs-code header="shared/forbidden-name.directive.ts (providers)" path="adev/src/content/examples/form-validation/src/app/shared/forbidden-name.directive.ts" visibleRegion="directive-providers"/>

指令類別接著實作 `Validator` 介面，以便它可以輕易與 Angular 表單整合。
以下是指令的其餘部分，幫助你了解它如何組合在一起。

<docs-code header="shared/forbidden-name.directive.ts (directive)" path="adev/src/content/examples/form-validation/src/app/shared/forbidden-name.directive.ts" visibleRegion="directive"/>

當 `ForbiddenValidatorDirective` 準備好後，您可以將其選擇器 `appForbiddenName` 新增到任何輸入元素以啟用它。
例如：

<docs-code header="template/actor-form-template.component.html (forbidden-name-input)" path="adev/src/content/examples/form-validation/src/app/template/actor-form-template.component.html" visibleRegion="name-input"/>

實用提示：注意自訂驗證指令會以 `useExisting` 而不是 `useClass` 來實例化。
註冊的驗證器必須是 `ForbiddenValidatorDirective` 的 *此實例* &mdash; 表單中的實例，其 `forbiddenName` 屬性繫結到「bob」。

如果你要以 `useClass` 取代 `useExisting`，那麼你會註冊一個新的類別實例，一個沒有 `forbiddenName` 的實例。

## 控制狀態的 CSS 類別

Angular 自動將多個控制項屬性鏡射到表單控制項元素上，作為 CSS 類別。
使用這些類別可以根據表單的狀態來設定表單控制項元素的樣式。
目前支援下列類別。

* `.ng-valid`
* `.ng-invalid`
* `.ng-pending`
* `.ng-pristine`
* `.ng-dirty`
* `.ng-untouched`
* `.ng-touched`
* `.ng-submitted` \(僅限於包覆的表單元素\)

在以下範例中，actor 表單使用 `.ng-valid` 和 `.ng-invalid` 類別來設定每個表單控制項邊框的顏色。

<docs-code header="forms.css (status classes)" path="adev/src/content/examples/form-validation/src/assets/forms.css"/>

## 跨欄位驗證

跨欄位驗證器是一種 [自訂驗證器](#defining-custom-validators "閱讀關於自訂驗證器")，用於比較表單中不同欄位的數值，並一起接受或拒絕它們。
舉例來說，您可能有一個表單提供相互不兼容的選項，因此使用者可以選擇 A 或 B，但不能同時選擇。
有些欄位的值也可能取決於其他欄位；只有在選擇 A 時，使用者才被允許選擇 B。

以下交叉驗證範例顯示如何執行下列操作：

* 驗證反應式或基於範本的表單輸入，判斷依據為兩個同層控制項的值，
* 使用者與表單互動後，若驗證失敗，則顯示描述性錯誤訊息。

範例使用交叉驗證，以確保演員在填寫演員表格時，不會在自己的角色中重複使用同一個名字。
驗證器會檢查演員姓名和角色不匹配來達成這個目的。

### 在反應式表單中加入交叉驗證

表單的結構如下：

<docs-code language="javascript">

const actorForm = new FormGroup({
  'name': new FormControl(),
  'role': new FormControl(),
  'skill': new FormControl()
});

</docs-code>

請注意，`name` 和 `role` 是兄弟控制項。
若要針對單一自訂驗證器評估這兩個控制項，您必須在共同的祖先控制項 (`FormGroup`) 中執行驗證。
您查詢 `FormGroup` 的子控制項，以便比較它們的值。

若要將驗證器新增至 `FormGroup`，請在建立時將新的驗證器作為第二個參數傳入。

<docs-code language="javascript">

const actorForm = new FormGroup({
  'name': new FormControl(),
  'role': new FormControl(),
  'skill': new FormControl()
}, { validators: unambiguousRoleValidator });

</docs-code>

校驗器程式碼如下。

<docs-code header="shared/unambiguous-role.directive.ts" path="adev/src/content/examples/form-validation/src/app/shared/unambiguous-role.directive.ts" visibleRegion="cross-validation-validator"/>

`unambiguousRoleValidator` 驗證器實作 `ValidatorFn` 介面。
它將 Angular 控制項物件作為參數，並在表單有效時傳回 `null`，否則傳回 `ValidationErrors`。

驗證器呼叫 `FormGroup` 的 [get](api/forms/AbstractControl#get) 方法來擷取子控制項，然後比較 `name` 和 `role` 控制項的值。

如果值不匹配，則角色是明確的，兩者皆有效，驗證工具將傳回 null。
如果值匹配，則該行為者的角色是模糊的，驗證工具必須傳回錯誤物件來標記表單為無效。

為了提供更好的使用者體驗，當表單無效時，範本會顯示適當的錯誤訊息。

<docs-code header="reactive/actor-form-template.component.html" path="adev/src/content/examples/form-validation/src/app/reactive/actor-form-reactive.component.html" visibleRegion="cross-validation-error-message"/>

這個 `*ngIf` 顯示由 `unambiguousRoleValidator` 驗證器傳回的交叉驗證錯誤的錯誤，但前提是使用者已完成 [與表單互動](#control-status-css-classes)。

### 在模板驅動表單中加入交叉驗證

對於以範本驅動的表單，您必須建立指令來包裝驗證函式。
您提供該指令作為驗證器，使用 [`NG_VALIDATORS` 權杖](/api/forms/NG_VALIDATORS)，如下例所示。

<docs-code header="shared/unambiguous-role.directive.ts" path="adev/src/content/examples/form-validation/src/app/shared/unambiguous-role.directive.ts" visibleRegion="cross-validation-directive"/>

您必須將新指令新增至 HTML 範本。
由於驗證器必須在表單中以最高層級註冊，因此以下範本將指令置於 `form` 標籤。

<docs-code header="template/actor-form-template.component.html" path="adev/src/content/examples/form-validation/src/app/template/actor-form-template.component.html" visibleRegion="cross-validation-register-validator"/>

為了提供更好的使用者體驗，當表單無效時，會出現適當的錯誤訊息。

<docs-code header="template/actor-form-template.component.html" path="adev/src/content/examples/form-validation/src/app/template/actor-form-template.component.html" visibleRegion="cross-validation-error-message"/>

這在範本驅動和反應式表單中都是一樣的。

## 建立非同步驗證函數

非同步驗證器實作 `AsyncValidatorFn` 和 `AsyncValidator` 介面。
這些與其同步對應項目非常相似，有以下差異。

* `validate()` 函數必須傳回 Promise 或可觀察物，
* 傳回的可觀察物必須是有限的，意即它必須在某個時間點完成。
若要將無限可觀察物轉換為有限可觀察物，請透過篩選運算子（例如 `first`、`last`、`take` 或 `takeUntil`）將可觀察物傳遞。

非同步驗證發生在同步驗證之後，並且只有在同步驗證成功時才會執行。
此檢查使表單避免潛在昂貴的非同步驗證程序（例如 HTTP 請求），如果更基本的驗證方法已經找到無效輸入。

非同步驗證開始後，表單控制項會輸入 `pending` 狀態。
檢查控制項的 `pending` 屬性並使用它來提供有關正在進行的驗證操作的視覺回饋。

一個常見的 UI 模式是在執行非同步驗證時顯示一個 spinner。
以下範例顯示如何在範本驅動的表單中達成此目的。

<docs-code language="html">

&lt;input [(ngModel)]="name" #model="ngModel" appSomeAsyncValidator&gt;
&lt;app-spinner *ngIf="model.pending"&gt;&lt;/app-spinner&gt;

</docs-code>

### 實作自訂非同步驗證器

在以下範例中，非同步驗證器可確保演員被選角為尚未被其他演員選演的角色。
新演員不斷地試鏡，舊演員不斷地退休，因此無法預先取得可用的角色清單。
若要驗證潛在的角色條目，驗證器必須啟動非同步作業，以諮詢目前所有已選角演員的中央資料庫。

以下程式碼建立驗證器類別 `UniqueRoleValidator`，它實作了 `AsyncValidator` 介面。

<docs-code path="adev/src/content/examples/form-validation/src/app/shared/role.directive.ts" visibleRegion="async-validator"/>

建構函數注入 `ActorsService`，該服務定義下列介面。

<docs-code language="typescript">
interface ActorsService {
  isRoleTaken: (role: string) => Observable<boolean>;
}
</docs-code>

在真實世界的應用中，`ActorsService` 將負責向演員資料庫發出 HTTP 要求，以檢查角色是否可用。
從驗證者的觀點來看，服務的實際實現並不重要，因此範例可以針對 `ActorsService` 介面編碼。

驗證開始後，`UnambiguousRoleValidator` 會將 `isRoleTaken()` 方法委派給 `ActorsService`，並附上目前的控制值。
此時控制標記為 `pending`，並在從 `validate()` 方法傳回的可觀察鏈完成之前維持此狀態。

`isRoleTaken()` 方法會派送一個 HTTP 請求，用來檢查角色是否可用，並回傳 `Observable<boolean>` 作為結果。
`validate()` 方法會將回應透過 `map` 算子導引，並將其轉換為驗證結果。

方法和任何驗證器一樣，如果表格有效，則回傳 `null`，否則回傳 `ValidationErrors`。
此驗證器會使用 `catchError` 算子處理任何潛在錯誤。
在此情況下，驗證器會將 `isRoleTaken()` 錯誤視為成功的驗證，因為無法提出驗證要求並不一定表示角色無效。
您可以以不同的方式處理錯誤，並回傳 `ValidationError` 物件。

經過一段時間後，可觀察鏈完成並完成非同步驗證。
將 `pending` 標記設為 `false`，並更新表單有效性。

### 在反應式表單中新增非同步驗證器

若要在反應式表單中使用非同步驗證器，首先將驗證器注入元件類別的建構函式。

<docs-code path="adev/src/content/examples/form-validation/src/app/reactive/actor-form-reactive.component.2.ts" visibleRegion="async-validator-inject"/>

然後，將驗證函數直接傳遞給 `FormControl` 以套用它。

在以下範例中，`UnambiguousRoleValidator` 的 `validate` 函數套用至 `roleControl`，方法是將它傳遞至控制項的 `asyncValidators` 選項並將它繫結至已注入至 `ActorFormReactiveComponent` 的 `UnambiguousRoleValidator` 實例。
`asyncValidators` 的值可以是單一非同步驗證函數，或函數陣列。
若要進一步了解 `FormControl` 選項，請參閱 [AbstractControlOptions](api/forms/AbstractControlOptions) API 參考。

<docs-code path="adev/src/content/examples/form-validation/src/app/reactive/actor-form-reactive.component.2.ts" visibleRegion="async-validator-usage"/>

### 在模板驅動表單中加入非同步驗證器

若要在範本驅動表單中使用非同步驗證器，請建立新的指令並在該指令上註冊 `NG_ASYNC_VALIDATORS` 提供者。

在以下範例中，指令注入包含實際驗證邏輯的 `UniqueRoleValidator` 類別，並在驗證應該發生時由 Angular 觸發的 `validate` 函數中呼叫它。

<docs-code path="adev/src/content/examples/form-validation/src/app/shared/role.directive.ts" visibleRegion="async-validator-directive"/>

接著，與同步驗證器一樣，將指令的選擇器新增到輸入元件以啟用它。

<docs-code header="template/actor-form-template.component.html (unique-unambiguous-role-input)" path="adev/src/content/examples/form-validation/src/app/template/actor-form-template.component.html" visibleRegion="role-input"/>

### 最佳化非同步驗證器的效能

預設情況下，所有驗證器會在每次表單值變更之後執行。
使用同步驗證器時，這通常不會對應用程式效能造成明顯的影響。
非同步驗證器通常會執行某種 HTTP 要求來驗證控制項。
在每次按鍵之後發送 HTTP 要求可能會對後端 API 造成負擔，應儘可能避免。

您可以藉由將 `updateOn` 屬性從 `change` (預設) 變更為 `submit` 或 `blur` 來延遲更新表單的有效性。

對於範本驅動的表單，在範本中設定屬性。

<docs-code language="html">
<input [(ngModel)]="name" [ngModelOptions]="{updateOn: 'blur'}">
</docs-code>

對於反應式表單，在 `FormControl` 範例中設定屬性。

<docs-code language="typescript">
new FormControl('', {updateOn: 'blur'});
</docs-code>

## 與原生 HTML 表單驗證的互動

預設情況下，Angular 會在封閉的 `<form>` 上加入 `novalidate` 屬性來停用 [原生 HTML 表單驗證](https://developer.mozilla.org/docs/Web/Guide/HTML/Constraint_validation)，並使用指令將這些屬性與架構中的驗證函數進行比對。
如果您想要在基於 Angular 的驗證中 **結合** 使用原生驗證，您可以使用 `ngNativeValidate` 指令重新啟用它。
有關詳細資訊，請參閱 [API 文件](api/forms/NgForm#native-dom-validation-ui)。
