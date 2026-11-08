# 表單模型

表單模型是 Signal Forms 的基礎，是表單資料的單一事實來源。本指南將探討如何建立表單模型、更新模型，以及如何以易於維護的方式設計模型。

NOTE: 表單模型不同於 Angular 用於元件雙向繫結的 `model()` 訊號。表單模型是儲存表單資料的可寫入訊號，而 `model()` 則是為父子元件溝通建立輸入與輸出。

## 表單模型解決了什麼問題

表單需要管理會隨時間變化的資料。若沒有清楚的結構，這些資料可能散落在元件的各個屬性中，讓變更難以追蹤、輸入難以驗證，資料也難以送出到伺服器。

表單模型透過把表單資料集中在單一可寫入訊號中，解決了這個問題。模型更新時，表單會自動反映這些變化；使用者與表單互動時，模型也會隨之更新。

## 建立模型

表單模型是用 Angular 的 `signal()` 函式建立的可寫入訊號。這個訊號保存著一個物件，代表你的表單資料結構。

```angular-ts
import {Component, signal} from '@angular/core';
import {form, FormField} from '@angular/forms/signals';

@Component({
  selector: 'app-login',
  imports: [FormField],
  template: `
    <input type="email" [formField]="loginForm.email" />
    <input type="password" [formField]="loginForm.password" />
  `,
})
export class LoginComponent {
  loginModel = signal({
    email: '',
    password: '',
  });

  loginForm = form(this.loginModel);
}
```

[`form()`](api/forms/signals/form) 函式接受模型訊號，並建立一棵**欄位樹**——一種特殊的物件結構，映照著你模型的形狀。欄位樹既可以走訪（用點記法存取子欄位，例如 `loginForm.email`），也可以呼叫（把欄位當作函式呼叫，以存取其狀態）。

`[formField]` 指令把每個輸入元素繫結到欄位樹中對應的欄位，讓 UI 與模型之間能自動雙向同步。

### 支援的模型結構

Signal Forms 會走訪你的模型來建立欄位樹。它所走訪的物件與陣列（**結構層**）必須是純 JavaScript 物件與陣列。位於**葉節點**（沒有巢狀欄位的位置）的值，通常是基本型別（字串、數字、布林值）或 `null`。原生的 `date`、`month`、`time` 與 `week` 輸入元素也接受 `Date`，自訂控制項則可以接受任何它能理解的值型別。

```ts {prefer, header: 'Plain structure'}
interface UserFormModel {
  name: string;
  birthday: Date | null;
  preferences: {
    theme: string;
    notifications: boolean;
  };
  tags: string[];
}

const userModel = signal<UserFormModel>({
  name: '',
  birthday: null,
  preferences: {
    theme: 'dark',
    notifications: true,
  },
  tags: [],
});
```

IMPORTANT: 類別實例、`Map` 與 `Set` 在結構層中不受支援，即使 TypeScript 會接受它們。Signal Forms 不會在執行時期驗證模型形狀，因此框架會接受這些值而不擲出錯誤，接著依形狀不同，以不同方式產生不正確的行為：

- **類別實例**在第一次寫入時就會失去原型，因為 Signal Forms 在更新時會對父物件做淺拷貝。之後，方法、getter 與 `instanceof` 檢查都不復存在。
- **陣列中不可擴充或已凍結的物件**在 Signal Forms 指派追蹤符號以保留重排時的項目身分時，會擲出錯誤。
- **`Map` 與 `Set`** 會產生空的欄位樹，因為 Signal Forms 是用 `Object.keys` 列舉子項的。

若你的應用程式使用類別來做領域建模，請在表單邊界將其轉換為純物件。請參閱[在表單模型與領域模型之間轉換](guide/forms/signals/model-design#translating-between-form-model-and-domain-model)。

### 使用 TypeScript 型別 {#using-typescript-types}

雖然 TypeScript 會從物件常值推斷型別，但定義明確的型別能提升程式碼品質，並提供更好的 IntelliSense 支援。

```ts
interface LoginData {
  email: string;
  password: string;
}

export class LoginComponent {
  loginModel = signal<LoginData>({
    email: '',
    password: '',
  });

  loginForm = form(this.loginModel);
}
```

有了明確的型別，欄位樹就能提供完整的型別安全。存取 `loginForm.email` 的型別是 `FieldTree<string>`，而嘗試存取不存在的屬性，則會造成編譯時期錯誤。

```ts
// TypeScript knows this is FieldTree<string>
const emailField = loginForm.email;

// TypeScript error: Property 'username' does not exist
const usernameField = loginForm.username;
```

### 初始化所有欄位

表單模型應該為你想納入欄位樹的所有欄位提供初始值。

```ts {prefer}
// Good: All fields initialized
const userModel = signal({
  name: '',
  email: '',
  age: 0,
});
```

```ts {avoid}
// Avoid: Missing initial value
const userModel = signal({
  name: '',
  email: '',
  // age field is not defined - cannot access userForm.age
});
```

對於可選欄位，請明確將其設為空值或 `null`：

```ts
interface UserData {
  name: string;
  email: string;
  phoneNumber: string | null;
}

const userModel = signal<UserData>({
  name: '',
  email: '',
  phoneNumber: null,
});
```

HELPFUL: 原生文字控制項如 `<input type=text>` 與 `<textarea>` 不支援 `null`，請用 `''` 表示空值。

設為 `undefined` 的欄位會被排除在欄位樹之外。模型為 `{value: undefined}` 時，其行為與 `{}` 完全相同——存取該欄位會回傳 `undefined`，而不是 `FieldTree`。

## 讀取模型的值

你可以用兩種方式存取表單的值：直接從模型訊號讀取，或透過個別欄位讀取。每種方式適用於不同目的。

### 從模型讀取

當你需要完整的表單資料時（例如送出表單時），請存取模型訊號：

```ts
async onSubmit() {
  const formData = this.loginModel();
  console.log(formData.email, formData.password);

  // Send to server
  await this.authService.login(formData);
}
```

模型訊號會回傳整個資料物件，很適合處理完整表單狀態的操作。

### 從欄位狀態讀取

欄位樹中的每個欄位都是一個函式。呼叫欄位會回傳一個 `FieldState` 物件，其中包含該欄位值、驗證狀態與互動狀態的反應式訊號。

當你在範本或反應式計算中處理個別欄位時，請存取欄位狀態：

```angular-ts
@Component({
  template: `
    <p>Current email: {{ loginForm.email().value() }}</p>
    <p>Password length: {{ passwordLength() }}</p>
  `,
})
export class LoginComponent {
  loginModel = signal({email: '', password: ''});
  loginForm = form(this.loginModel);

  passwordLength = computed(() => {
    return this.loginForm.password().value().length;
  });
}
```

欄位狀態為每個欄位的值提供反應式訊號，適合用來顯示欄位專屬資訊，或建立衍生狀態。

TIP: 欄位狀態除了 `value()` 之外，還包含更多訊號，例如驗證狀態（如 valid、invalid、errors）、互動追蹤（如 touched、dirty），以及可見性（如 hidden、disabled）。

完整說明請參閱[欄位狀態管理指南](guide/forms/signals/field-state-management)。

## 以程式化方式更新表單模型

### 用 `set()` 取代表單模型

使用表單模型上的 `set()`，可以取代整個值：

```ts
loadUserData() {
  this.userModel.set({
    name: 'Alice',
    email: 'alice@example.com',
    age: 30,
  });
}

resetForm() {
  this.userModel.set({
    name: '',
    email: '',
    age: 0,
  });
}
```

這種方式很適合從 API 載入資料，或重設整個表單。

### 用 `set()` 或 `update()` 直接更新單一欄位

使用個別欄位值上的 `set()`，可以直接更新欄位狀態：

```ts
clearEmail() {
  this.userForm.email().value.set('');
}

incrementAge() {
  this.userForm.age().value.update(currentAge => currentAge + 1);
}
```

這類更新也稱為「欄位層級更新」。它們會自動傳播到模型訊號，讓兩者保持同步。

### 範例：從 API 載入資料

一個常見的模式是取得資料並填入模型：

```ts
export class UserProfileComponent {
  userModel = signal({
    name: '',
    email: '',
    bio: '',
  });

  userForm = form(this.userModel);
  private userService = inject(UserService);

  ngOnInit() {
    this.loadUserProfile();
  }

  async loadUserProfile() {
    const userData = await this.userService.getUserProfile();
    this.userModel.set(userData);
  }
}
```

模型變更時，表單欄位會自動更新，顯示取回的資料，不需要額外的程式碼。

### 範例：同步到服務

在某些使用情境中，服務可能會保存一份表單模型：

```ts
@Service()
export class FormService {
  private readonly formModel = signal<UserFormModel>({ name: '', birthday: null });
  public readonly model = this.formModel.asReadonly();

  public syncFormModel(value: UserFormModel) {
    this.formModel.set(value);
  }

  // Model set synchronously or asynchronously elsewhere in service
}

@Component(...)
export class UserForm {
  private readonly formService = inject(FormService);

  private readonly formModel = linkedSignal(() => this.formService.model(), {
    set: (value) => this.formService.syncFormModel(value),
  });

  protected readonly form = form(this.formModel);
}
```

`linkedSignal` 的計算函式會讀取服務的表單模型，而選項中的 `set` 函式能把元件的表單模型同步到服務的表單模型。當服務的模型變更時，表單欄位會自動更新；當表單欄位更新元件的表單模型時，也會自動更新服務的表單模型。

## 雙向資料繫結

`[formField]` 指令會在模型、表單狀態與 UI 之間建立自動雙向同步。

### 資料如何流動

變化會雙向流動：

**使用者輸入 → 模型**：

1. 使用者在輸入元素中打字
2. `[formField]` 指令偵測到變化
3. 欄位狀態更新
4. 模型訊號更新

**程式化更新 → UI**：

1. 程式碼用 `set()` 或 `update()` 更新模型
2. 模型訊號通知訂閱者
3. 欄位狀態更新
4. `[formField]` 指令更新輸入元素

這種同步會自動發生。你不需要撰寫訂閱或事件處理常式，就能讓模型與 UI 保持同步。

### 範例：雙向流動

```angular-ts
@Component({
  template: `
    <input type="text" [formField]="userForm.name" />
    <button (click)="setName('Bob')">Set Name to Bob</button>
    <p>Current name: {{ userModel().name }}</p>
  `,
})
export class UserComponent {
  userModel = signal({name: ''});
  userForm = form(this.userModel);

  setName(name: string) {
    this.userForm.name().value.set(name);
    // Input automatically displays 'Bob'
  }
}
```

當使用者在輸入框中打字時，`userModel().name` 會更新；當按鈕被點選時，輸入值會變成「Bob」。不需要任何手動同步的程式碼。

## 模型結構模式

表單模型可以是扁平物件，也可以包含巢狀物件與陣列。你選擇的結構，會影響你存取欄位與組織驗證的方式。

### 扁平與巢狀模型

扁平的表單模型把所有欄位都放在最上層：

```ts
// Flat structure
const userModel = signal({
  name: '',
  email: '',
  street: '',
  city: '',
  state: '',
  zip: '',
});
```

巢狀模型則把相關欄位分組：

```ts
// Nested structure
const userModel = signal({
  name: '',
  email: '',
  address: {
    street: '',
    city: '',
    state: '',
    zip: '',
  },
});
```

**在下列情況使用扁平結構**：

- 欄位沒有清楚的概念分組
- 你想讓欄位存取更簡單（`userForm.city` 而非 `userForm.address.city`）
- 驗證規則橫跨多個可能的分組

**在下列情況使用巢狀結構**：

- 欄位構成清楚的概念群組（如地址）
- 分組後的資料與你的 API 結構相符
- 你想把整個群組當作一個單位來驗證

### 處理巢狀物件

你可以沿著物件路徑存取巢狀欄位：

```ts
const userModel = signal({
  profile: {
    firstName: '',
    lastName: '',
  },
  settings: {
    theme: 'light',
    notifications: true,
  },
});

const userForm = form(userModel);

// Access nested fields
userForm.profile.firstName; // FieldTree<string>
userForm.settings.theme; // FieldTree<string>
```

在範本中，巢狀欄位的繫結方式與最上層欄位相同：

```angular-ts
@Component({
  template: `
    <input [formField]="userForm.profile.firstName" />
    <input [formField]="userForm.profile.lastName" />

    <select [formField]="userForm.settings.theme">
      <option value="light">Light</option>
      <option value="dark">Dark</option>
    </select>
  `,
})
```

### 處理陣列

模型可以包含陣列，用來保存項目集合：

```ts
const orderModel = signal({
  customerName: '',
  items: [{product: '', quantity: 0, price: 0}],
});

const orderForm = form(orderModel);

// Access array items by index
orderForm.items[0].product; // FieldTree<string>
orderForm.items[0].quantity; // FieldTree<number>
```

包含物件的陣列項目會自動獲得追蹤身分，即使項目在陣列中改變位置，也能協助維持欄位狀態。這能確保陣列重排時，驗證狀態與使用者互動仍正確保留。

<!-- TBD: For dynamic arrays and complex array operations, see the [Working with arrays guide](guide/forms/signals/arrays). -->

## 後續步驟

本指南說明了如何建立模型與更新值。相關指南將探討 Signal Forms 的其他面向：

<docs-pill-row>
  <docs-pill href="guide/forms/signals/field-state-management" title="欄位狀態管理" />
  <docs-pill href="guide/forms/signals/validation" title="驗證" />
  <docs-pill href="guide/forms/signals/custom-controls" title="自訂控制項" />
  <!-- <docs-pill href="guide/forms/signals/arrays" title="Working with Arrays" /> -->
</docs-pill-row>
