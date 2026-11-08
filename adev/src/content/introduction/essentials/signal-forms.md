<docs-decorative-header title="使用訊號的表單" imgSrc="adev/src/assets/images/signals.svg"> </docs-decorative-header>

Signal Forms 使用 Angular 訊號來管理表單狀態，讓你的資料模型與 UI 之間透過 Angular Signals 自動保持同步。

本指南會帶你了解使用 Signal Forms 建立表單的核心概念，運作方式如下：

## 建立你的第一個表單

### 1. 使用 `signal()` 建立表單模型

每個表單的第一步，都是建立一個保存表單資料模型的訊號：

```ts
interface LoginData {
  email: string;
  password: string;
}

const loginModel = signal<LoginData>({
  email: '',
  password: '',
});
```

### 2. 把表單模型傳入 `form()`，建立 `FieldTree`

接著，把你的表單模型傳入 `form()` 函式，建立一個**欄位樹**。它是一個鏡像對應你模型形狀的物件結構，讓你可以用點號表示法存取各個欄位。

根表單物件和它巢狀的屬性，全都是 `FieldTree` 節點：

```ts
const loginForm = form(loginModel);

loginForm; // is a FieldTree
loginForm.email; // is also a FieldTree
```

### 3. 使用 `[formField]` 指令繫結 HTML 輸入元素

接下來，使用 `[formField]` 指令把你的 HTML 輸入元素繫結到表單，在兩者之間建立雙向繫結：

```html
<input type="email" [formField]="loginForm.email" />
<input type="password" [formField]="loginForm.password" />
```

如此一來，使用者的變更（例如在欄位中輸入文字）會自動更新表單。

NOTE: `[formField]` 指令也會在適當時機，同步 `required`、`disabled` 與 `readonly` 等屬性的欄位狀態。

### 4. 使用 `FieldTree` 訊號讀取狀態

你可以把任一部分的 `FieldTree` 節點當作函式呼叫，來存取它的狀態。這會傳回一個狀態物件，裡面包含值、驗證狀態與互動狀態的反應式訊號：

```ts
loginForm(); // Returns state for the whole form
loginForm.email(); // Returns state for the email field
```

要讀取目前的值，可以存取 `value()` 訊號：

```html
<!-- Render values that update automatically as user types -->
<p>Form value: {{ loginForm().value() | json }}</p>
<p>Email: {{ loginForm.email().value() }}</p>
```

```ts
// Get the current value
const currentEmail = loginForm.email().value();
```

### 5. 使用 `set()` 更新值

你可以使用任一節點上的 `value.set()` 方法，以程式方式更新值。這會同時更新 `FieldTree` 與底層的模型訊號：

```ts
// Update the value programmatically
loginForm.email().value.set('alice@wonderland.com');
```

如此一來，欄位值和模型訊號都會自動更新：

```ts
// The model signal is also updated
console.log(loginModel().email); // 'alice@wonderland.com'
```

### 完整範例

<docs-code-multifile preview path="adev/src/content/examples/signal-forms/src/login-simple/app/app.ts">
  <docs-code header="app.ts" path="adev/src/content/examples/signal-forms/src/login-simple/app/app.ts"/>
  <docs-code header="app.html" path="adev/src/content/examples/signal-forms/src/login-simple/app/app.html"/>
  <docs-code header="app.css" path="adev/src/content/examples/signal-forms/src/login-simple/app/app.css"/>
</docs-code-multifile>

## 基本用法

`[formField]` 指令可以搭配所有標準的 HTML 輸入類型使用。以下是最常見的模式：

### 文字輸入

文字輸入可以搭配各種 `type` 屬性與文字區域使用：

```html
<!-- Text and email -->
<input type="text" [formField]="form.name" />
<input type="email" [formField]="form.email" />
```

#### 數字

數字輸入會在字串與數字之間自動轉換：

```html
<!-- Number - automatically converts to number type -->
<input type="number" [formField]="form.age" />
```

#### 日期與時間

日期輸入會把值儲存為 `YYYY-MM-DD` 字串，時間輸入則使用 `HH:mm` 格式：

```html
<!-- Date and time - stores as ISO format strings -->
<input type="date" [formField]="form.eventDate" />
<input type="time" [formField]="form.eventTime" />
```

如果你需要把日期字串轉換成 Date 物件，可以把欄位值傳入 `Date()`：

```ts
const dateObject = new Date(form.eventDate().value());
```

#### 多行文字

文字區域的運作方式與文字輸入相同：

```html
<!-- Textarea -->
<textarea [formField]="form.message" rows="4"></textarea>
```

### 核取方塊

核取方塊會繫結到布林值：

```html
<!-- Single checkbox -->
<label>
  <input type="checkbox" [formField]="form.agreeToTerms" />
  I agree to the terms
</label>
```

#### 多個核取方塊

若有多個選項，請為每個選項建立各自獨立的布林值 `formField`：

```html
<label>
  <input type="checkbox" [formField]="form.emailNotifications" />
  Email notifications
</label>
<label>
  <input type="checkbox" [formField]="form.smsNotifications" />
  SMS notifications
</label>
```

### 單選按鈕

單選按鈕的運作方式與核取方塊類似。只要單選按鈕使用同一個 `[formField]` 值，Signal Forms 就會自動把相同的 `name` 屬性繫結到它們全部：

```html
<label>
  <input type="radio" value="free" [formField]="form.plan" />
  Free
</label>
<label>
  <input type="radio" value="premium" [formField]="form.plan" />
  Premium
</label>
```

當使用者選取一個單選按鈕時，表單的 `formField` 會儲存該單選按鈕 `value` 屬性的值。舉例來說，選取「Premium」會把 `form.plan().value()` 設為 `"premium"`。

### 下拉式選單

選單元素可以搭配靜態與動態選項使用：

```angular-html
<!-- Static options -->
<select [formField]="form.country">
  <option value="">Select a country</option>
  <option value="us">United States</option>
  <option value="ca">Canada</option>
</select>

<!-- Dynamic options with @for -->
<select [formField]="form.productId">
  <option value="">Select a product</option>
  @for (product of products; track product.id) {
    <option [value]="product.id">{{ product.name }}</option>
  }
</select>
```

NOTE: `[formField]` 指令目前不支援多選選單（`<select multiple>`）。

## 驗證與狀態

Signal Forms 提供內建的驗證器，可以套用到你的表單欄位上。要加上驗證，請把一個結構函式作為第二個引數傳給 `form()`：

```ts
const loginForm = form(loginModel, (schemaPath) => {
  debounce(schemaPath.email, 500);
  required(schemaPath.email);
  email(schemaPath.email);
});
```

結構函式會接收一個**結構路徑**參數，提供通往你各個欄位的路徑，用來設定驗證規則。

常見的驗證器包括：

- **`required()`**：確保欄位有值
- **`email()`**：驗證電子郵件格式
- **`min()`** / **`max()`**：驗證數字範圍
- **`minLength()`** / **`maxLength()`**：驗證字串或集合的長度
- **`pattern()`**：以正規表示式模式進行驗證

你也可以把一個選項物件作為第二個引數傳給驗證器，來自訂錯誤訊息：

```ts
required(schemaPath.email, {message: 'Email is required'});
email(schemaPath.email, {message: 'Please enter a valid email address'});
```

`FieldTree` 中的每個節點，都會透過反應式訊號公開它的驗證與互動狀態。

### FieldTree 狀態訊號

樹中的每個節點（包括根表單物件）都提供相同的訊號來追蹤自身狀態。由於每個節點都是 `FieldTree`，監控有效性與互動狀態的 API 在每一層都完全相同。

| 狀態         | 說明                                                                    |
| ------------ | ----------------------------------------------------------------------- |
| `valid()`    | 若節點通過所有驗證規則，傳回 `true`                                     |
| `invalid()`  | 若有驗證錯誤，傳回 `true`                                               |
| `pending()`  | 若非同步驗證正在進行中，傳回 `true`                                     |
| `touched()`  | 若使用者曾聚焦又離開此欄位或任一子欄位，傳回 `true`                     |
| `dirty()`    | 若值曾被使用者變更，傳回 `true`                                         |
| `disabled()` | 若節點已停用，傳回 `true`                                               |
| `readonly()` | 若節點為唯讀，傳回 `true`                                               |
| `errors()`   | 傳回驗證錯誤的陣列，包含 `kind` 與 `message` 屬性                       |

### 完整範例 {#complete-example-validation}

<docs-code-multifile preview path="adev/src/content/examples/signal-forms/src/login-validation/app/app.ts">
  <docs-code header="app.ts" path="adev/src/content/examples/signal-forms/src/login-validation/app/app.ts"/>
  <docs-code header="app.html" path="adev/src/content/examples/signal-forms/src/login-validation/app/app.html"/>
  <docs-code header="app.css" path="adev/src/content/examples/signal-forms/src/login-validation/app/app.css"/>
</docs-code-multifile>

## 下一步

想更深入了解 Signal Forms 及其運作方式，請查看這些深入指南：

- [總覽](guide/forms/signals/overview)：Signal Forms 的介紹，以及何時該使用它
- [表單模型](guide/forms/signals/models)：使用訊號建立與管理表單資料
- [欄位狀態管理](guide/forms/signals/field-state-management)：處理驗證狀態、互動追蹤與欄位可見性
- [驗證](guide/forms/signals/validation)：內建驗證器、自訂驗證規則與非同步驗證

<docs-pill-row>
  <docs-pill title="以依賴注入實現模組化設計" href="essentials/dependency-injection" />
</docs-pill-row>
