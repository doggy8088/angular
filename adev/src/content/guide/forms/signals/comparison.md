# 與其他表單方法的比較

Angular 提供三種建置表單的方法：Signal Forms、Reactive Forms 與 Template-driven Forms。三者在管理狀態、驗證與資料流的方式上各有不同的模式。本指南協助你了解彼此的差異，為你的專案選出合適的方法。

NOTE: 截至 Angular v21，Signal Forms 仍屬[實驗性](reference/releases#experimental)功能。API 在穩定之前可能有所變更。

## 快速比較

| 功能         | Signal Forms               | Reactive Forms              | Template-driven Forms |
| ------------ | -------------------------- | --------------------------- | --------------------- |
| 真實來源     | 使用者自訂的可寫入訊號模型 | `FormControl`/`FormGroup`   | 元件中的使用者模型    |
| 型別安全     | 從模型推斷                 | 透過型別化表單明確指定      | 極少                  |
| 驗證         | 以路徑驗證器組成的結構定義 | 傳入控制項的驗證器清單      | 以指令為基礎          |
| 狀態管理     | 以訊號為基礎               | 以 Observable 為基礎        | 由 Angular 管理       |
| 建置方式     | 訊號 + 結構定義函式        | FormControl 樹              | 範本中的 NgModel      |
| 最適合       | 以訊號為基礎的應用程式     | 複雜表單                    | 簡單表單              |
| 學習曲線     | 中等                       | 中高                        | 低                    |
| 狀態         | 實驗性（v21+）             | 穩定版                      | 穩定版                |

## 範例：登入表單

了解差異最好的方式，是看同一個表單以三種方法各實作一次。

<docs-code-multifile>
  <docs-code language="angular-ts" header="Signal forms" path="adev/src/content/examples/signal-forms/src/comparison/app/signal-forms.ts"/>
  <docs-code header="Reactive forms" path="adev/src/content/examples/signal-forms/src/comparison/app/reactive-forms.ts"/>
  <docs-code header="Template-driven forms" path="adev/src/content/examples/signal-forms/src/comparison/app/template-driven-forms.ts"/>
</docs-code-multifile>

## 了解差異

三種方法在設計上做了不同的取捨，影響你撰寫與維護表單的方式。這些差異源自於每種方法儲存表單狀態的位置，以及管理驗證的方式。

### 表單資料存放的位置

最根本的差異，在於每種方法把表單值的「真實來源」放在哪裡。

Signal Forms 把資料存在可寫入的訊號中。需要目前的表單值時，呼叫該訊號即可：

```ts
const credentials = this.loginModel(); // { email: '...', password: '...' }
```

這樣表單資料就放在單一的反應式容器中，值改變時會自動通知 Angular。表單結構與你的資料模型完全對應。

Reactive Forms 把資料存在 `FormControl` 與 `FormGroup` 實例中。你透過表單階層存取值：

```ts
const credentials = this.loginForm.value; // { email: '...', password: '...' }
```

這讓表單狀態管理與元件的資料模型分離。表單結構是明確的，但需要較多的建置程式碼。

Template-driven Forms 把資料存在元件屬性中。你直接存取值：

```ts
const credentials = {email: this.email, password: this.password};
```

這是最直接的方法，但需要值的時候得手動組裝。Angular 透過範本中的指令管理表單狀態。

### 驗證的運作方式

每種方法定義驗證規則的方式不同，影響驗證邏輯存放的位置與維護方式。

Signal Forms 使用結構定義函式，把驗證器綁定到欄位路徑：

```ts
loginForm = form(this.loginModel, (fieldPath) => {
  required(fieldPath.email, {message: 'Email is required'});
  email(fieldPath.email, {message: 'Enter a valid email address'});
});
```

所有驗證規則都集中在同一處。結構定義函式在建立表單時執行一次，欄位值改變時驗證器會自動執行。錯誤訊息屬於驗證定義的一部分。

Reactive Forms 在建立控制項時附加驗證器：

```ts
loginForm = new FormGroup({
  email: new FormControl('', [Validators.required, Validators.email]),
});
```

驗證器與表單結構中的個別控制項綁在一起，驗證因此分散在整個表單定義中。錯誤訊息通常放在範本裡。

Template-driven Forms 在範本中使用指令屬性：

```html
<input [(ngModel)]="email" required email />
```

驗證規則與 HTML 並存在範本中。這讓驗證貼近 UI，但邏輯會分散在範本與元件之間。

### 型別安全與自動完成

三種方法與 TypeScript 的整合差異明顯，影響編譯器能幫你避免多少錯誤。

Signal Forms 從你的模型結構推斷型別：

```ts
const loginModel = signal({email: '', password: ''});
const loginForm = form(loginModel);
// TypeScript knows: loginForm.email exists and returns FieldState<string>
```

你只需在訊號中定義一次資料形狀，TypeScript 就會自動知道有哪些欄位以及它們的型別。存取不存在的 `loginForm.username` 會產生型別錯誤。

Reactive Forms 需要以型別化表單明確標註型別：

```ts
const loginForm = new FormGroup({
  email: new FormControl<string>(''),
  password: new FormControl<string>(''),
});
// TypeScript knows: loginForm.controls.email is FormControl<string>
```

你為每個控制項個別指定型別。TypeScript 會驗證表單結構，但型別資訊需要你另外維護，與資料模型分開。

Template-driven Forms 提供的型別安全極少：

```ts
email = '';
password = '';
// TypeScript only knows these are strings, no form-level typing
```

TypeScript 只了解元件屬性，對表單結構或驗證一無所知，表單操作也失去了編譯時期檢查。

## 選擇適合你的方法

### 以下情況選用 Signal Forms：

- 你在建置以訊號為基礎的新應用程式（Angular v21+）
- 你希望型別安全由模型結構自動推斷
- 你樂於使用實驗性功能
- 以結構定義為基礎的驗證方式合你的胃口
- 你的團隊已熟悉訊號

### 以下情況選用 Reactive Forms：

- 你需要可上線的穩定性
- 你在建置複雜、動態的表單
- 你偏好以 Observable 為基礎的模式
- 你需要對表單狀態做細緻控制
- 你在既有的 Reactive Forms 程式碼庫上工作

### 以下情況選用 Template-driven Forms：

- 你在建置簡單表單（登入、聯絡、搜尋）
- 你在快速製作原型
- 你的表單邏輯很單純
- 你偏好把表單邏輯放在範本中
- 你在既有的 Template-driven Forms 程式碼庫上工作

## 下一步

想進一步了解每種方法：

- **Signal Forms**：先看[總覽指南](guide/forms/signals/overview)入門，或深入[表單模型](guide/forms/signals/models)、[驗證](guide/forms/signals/validation)與[欄位狀態管理](guide/forms/signals/field-state-management)
- **Reactive Forms**：看 Angular 文件中的 [Reactive Forms 指南](guide/forms/reactive-forms)
- **Template-driven Forms**：看 Angular 文件中的 [Template-driven Forms 指南](guide/forms/template-driven-forms)
