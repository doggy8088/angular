# 設計你的表單模型

Signal Forms 採用模型驅動的方法，直接從你提供的模型推導出表單的狀態與結構。模型是整個表單的基礎，因此一開始就設計好表單模型非常重要。本指南探討設計表單模型的最佳實務。

## 表單模型與領域模型

表單用來收集使用者輸入。你的應用程式很可能有一個領域模型，用來以最適合業務邏輯或儲存的方式表示這些輸入。然而，這往往「不同於」我們想在表單中塑模資料的方式。

表單模型表示 UI 中呈現的原始使用者輸入。舉例來說，在表單中，你可能讓使用者分別在不同輸入欄位挑選預約的日期與時段，即使你的領域模型把它表示為單一個 JavaScript `Date` 物件。

```ts
interface AppointmentFormModel {
  name: string; // Appointment owner's name
  date: Date; // Appointment date (carries only date information, time component is unused)
  time: string; // Selected time as a string
}

interface AppointmentDomainModel {
  name: string; // Appointment owner's name
  time: Date; // Appointment time (carries both date and time information)
}
```

表單應該使用為輸入體驗量身打造的表單模型，而不是直接拿領域模型來充數。

## 表單模型最佳實務

### 使用明確的型別

務必為你的模型定義介面或型別，如[使用 TypeScript 型別](/guide/forms/signals/models#using-typescript-types)所示。明確的型別能提供更好的 IntelliSense，在編譯時期攔截錯誤，也能作為文件，說明表單包含哪些資料。

### 初始化所有欄位

為模型中的每個欄位提供初始值：

```ts {prefer, header: 'All fields initialized'}
const taskModel = signal({
  title: '',
  description: '',
  priority: 'medium',
  completed: false,
});
```

```ts {avoid, header: 'Partial initialization'}
const taskModel = signal({
  title: '',
  // Missing description, priority, completed
});
```

缺少初始值，表示那些欄位不會存在於欄位樹中，表單互動時也就無法存取它們。

### 讓模型保持聚焦

每個模型應代表單一表單，或一組具內聚性的相關資料：

```ts {prefer, header: 'Focused on a single purpose'}
const loginModel = signal({
  email: '',
  password: '',
});
```

```ts {avoid, header: 'Mixing unrelated concerns'}
const appModel = signal({
  // Login data
  email: '',
  password: '',
  // User preferences
  theme: 'light',
  language: 'en',
  // Shopping cart
  cartItems: [],
});
```

不同關注點用不同模型分開，表單會更容易理解與重複使用。管理的是不同組資料時，就建立多個表單。

### 把驗證需求納入考量

設計模型時要把驗證放在心上。把會一起驗證的欄位分組：

```ts {prefer, header: 'Related fields grouped for comparison'}
// Password fields grouped for comparison
interface PasswordChangeData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}
```

這樣的結構讓跨欄位驗證（例如檢查 `newPassword` 是否與 `confirmPassword` 相符）更自然。

### 讓資料型別與 UI 控制項相符

表單模型上的屬性，應與 UI 控制項預期的資料型別相符。

例如，想像一個飲料訂購表單，有一個 `size` 欄位（6 入、12 入或 24 入包裝）與一個 `quantity` 欄位。UI 用下拉選單（`<select>`）選尺寸，用數字輸入（`<input type="number">`）填數量。

雖然尺寸選項看起來是數字，但 `<select>` 元素處理的是字串值，所以 `size` 應塑模為字串。另一方面，`<input type="number">` 處理的是數字，所以 `quantity` 可以塑模為數字。

```ts {prefer, header: 'Appropriate data types for the bound UI controls'}
interface BeverageOrderFormModel {
  size: string; // Bound to: <select> (option values: "6", "12", "24")
  quantity: number; // Bound to: <input type="number">
}
```

### 避免 `undefined` {#avoid-undefined}

表單模型不可以包含 `undefined` 的值或屬性。在 Signal Forms 中，表單的結構是從模型的結構推導出來的，而 `undefined` 表示的是「欄位不存在」，而不是值為空的欄位。這也表示你必須避免可選欄位（例如 `{property?: string}`），因為它們隱含允許 `undefined`。

要在表單模型中表示空的屬性值，請使用 UI 控制項能理解為「空」的值（例如文字輸入 `<input type="text">` 用的 `""`）。若你在設計自訂 UI 控制項，`null` 往往是表示「空」的好選擇。

```ts {prefer, header: 'Appropriate empty values'}
interface UserFormModel {
  name: string; // Bound to <input type="text">
  birthday: Date | null; // Bound to <input type="date">
}

// Initialize our form with empty values.
form(signal({name: '', birthday: null}));
```

### 避免動態結構的模型

若模型的形狀會依其值而改變（物件上的屬性會變動），它就具有動態結構。當模型型別允許形狀不同的值時，就會發生這種情況，例如由屬性不同的物件型別組成的聯集型別，或物件與原始型別的聯集。以下各節檢視幾個看似適合用動態結構模型、但最終證明問題重重的常見情境。

#### 複雜物件的空值

我們常用表單要求使用者輸入全新的資料，而不是編輯系統中既有的資料。開立帳號表單就是很好的例子。我們可能會用以下表單模型來塑模它。

```ts
interface CreateAccountFormModel {
  name: {
    first: string;
    last: string;
  };
  username: string;
}
```

建立表單時我們會遇到一個難題：模型中的初始值該放什麼？由於還沒有任何使用者輸入，可能會想建立一個 `form<CreateAccountFormModel | null>()`。

```ts {avoid, header: 'Using null as empty value for complex object'}
createAccountForm = form<CreateAccountFormModel | null>(signal(/* what goes here, null? */));
```

然而，務必記住 Signal Forms 是「模型驅動」的。模型若是 `null`，而 `null` 沒有 `name` 或 `username` 屬性，表示我們的表單也不會有那些子欄位。我們真正想要的，是一個所有葉欄位都設為空值的 `CreateAccountFormModel` 實例。

```ts {prefer, header: 'Same shape value with empty values for properties'}
createAccountForm = form<CreateAccountFormModel>(
  signal({
    name: {
      first: '',
      last: '',
    },
    username: '',
  }),
);
```

用這個表示方式，我們需要的所有子欄位都存在，也能在範本中用 `[formField]` 指令綁定它們。

```html
First: <input [formField]="createAccountForm.name.first" /> Last:
<input [formField]="createAccountForm.name.last" /> Username:
<input [formField]="createAccountForm.username" />
```

#### 條件式隱藏或不可用的欄位

表單並不總是線性的。你常需要根據先前的使用者輸入建立條件式路徑。其中一個例子是讓使用者選擇不同付款方式的表單。先想像這類表單的 UI 可能長什麼樣子。

```html
Name: <input type="text" />

<section>
  <h2>Payment Info</h2>
  <input type="radio" /> Credit Card @if (/* credit card selected */) {
  <section>
    Card Number <input type="text" /> Security Code <input type="text" /> Expiration
    <input type="text" />
  </section>
  }
  <input type="radio" /> Bank Account @if (/* bank account selected */) {
  <section>Account Number <input type="text" /> Routing Number <input type="text" /></section>
  }
</section>
```

處理這個問題最好的方式，是使用靜態結構的表單模型，把「所有」潛在付款方式的欄位都包含進去。在結構定義中，我們可以隱藏或停用目前不可用的欄位。

```ts {prefer, header: 'Static structure model'}
interface BillPayFormModel {
  name: string;
  method: {
    type: string;
    card: {
      cardNumber: string;
      securityCode: string;
      expiration: string;
    };
    bank: {
      accountNumber: string;
      routingNumber: string;
    };
  };
}

const billPaySchema = schema<BillPayFormModel>((billPay) => {
  // Hide credit card details when user has selected a method other than credit card.
  hidden(billPay.method.card, ({valueOf}) => valueOf(billPay.method.type) !== 'card');
  // Hide bank account details when user has selected a method other than bank account.
  hidden(billPay.method.bank, ({valueOf}) => valueOf(billPay.method.type) !== 'bank');
});
```

用這個模型，`card` 與 `bank` 兩個物件都會一直存在於表單狀態中。使用者切換付款方式時，我們只需更新 `type` 屬性。他們在信用卡欄位輸入的資料會安全地保存在 `card` 物件中，切換回來時隨時可以重新顯示。

相較之下，動態表單模型乍看可能很適合這個使用情境。畢竟，使用者若選了「Credit Card」，我們就不需要帳號與銀行代碼的欄位。我們可能會想把它塑模成可辨識聯集：

```ts {avoid, header: 'Dynamic structure model'}
interface BillPayFormModel {
  name: string;
  method:
    | {
        type: 'card';
        cardNumber: string;
        securityCode: string;
        expiration: string;
      }
    | {
        type: 'bank';
        accountNumber: string;
        routingNumber: string;
      };
}
```

不過，想想以下情境會發生什麼事：

1. 使用者填好姓名與信用卡資訊
2. 正要送出時，最後一刻注意到那筆便利手續費
3. 他們改選銀行帳戶，想說不如省下這筆費用
4. 正要輸入銀行帳戶資訊時，又改變心意，擔心資料萬一外洩怎麼辦
5. 他們切換回信用卡選項，卻發現剛才輸入的所有資訊都不見了！

這說明了動態結構表單模型的另一個問題：它可能造成資料遺失。這種模型假設欄位一旦被隱藏，其中的資訊就永遠不會再被需要。它把信用卡資訊換成銀行資訊，而且再也找不回信用卡資訊。

#### 例外

靜態結構一般是比較好的選擇，但有特定情境下動態結構是必要的，而且受到支援。

##### 陣列

陣列是最常見的例外。表單常需要收集數量不定的項目，例如電話號碼清單、參加者名單，或訂單中的品項。

```ts
interface SendEmailFormModel {
  subject: string;
  recipientEmails: string[];
}
```

在這個例子中，`recipientEmails` 陣列會隨著使用者與表單互動而增長或縮減。陣列的長度是動態的，但個別項目的結構應該保持一致（每個項目都應有相同的形狀）。

##### 由 UI 控制項以原子方式處理的欄位

另一個可接受動態結構的情況，是複雜物件被 UI 控制項視為單一、原子的值。也就是說，控制項不會嘗試個別綁定或存取它的任何子欄位。在這種情境下，控制項是把整個物件一次換掉來更新值，而不是修改其內部屬性。由於表單結構在這個情境下無關緊要，該結構是動態的也可以接受。

例如，想像一個使用者個人檔案表單，其中有一個 `location` 欄位。地點是透過一個複雜的「地點選擇器」小工具（可能是地圖或邊打字邊搜尋的下拉選單）選取的，它會回傳一個座標物件。在地點尚未選取、或使用者選擇不分享地點的情況下，選擇器以 `null` 表示地點。

```ts {prefer, header: 'Dynamic structure is ok when field is treated as atomic'}
interface Location {
  lat: number;
  lng: number;
}

interface UserProfileFormModel {
  username: string;
  // This property has dynamic structure,
  // but that's ok because the location picker treats this field as atomic.
  location: Location | null;
}
```

在範本中，我們把 `location` 欄位直接綁定到自訂控制項：

```html
Username: <input [formField]="userForm.username" /> Location:
<location-picker [formField]="userForm.location"></location-picker>
```

這裡的 `<location-picker>` 會取用並產生整個 `Location` 物件（或 `null`），不會存取 `userForm.location.lat` 或 `userForm.location.lng`。因此，`location` 可以安全地擁有動態形狀，不違反模型驅動表單的原則。

## 在表單模型與領域模型之間轉換 {#translating-between-form-model-and-domain-model}

既然表單模型與領域模型以不同方式表示同一個概念，我們就需要有方法在這兩種表示法之間轉換。想把系統中既有的資料呈現給使用者填表時，我們需要把它從領域模型的表示法轉換為表單模型的表示法。反過來，想儲存使用者的修改時，則需要把資料從表單模型的表示法轉換回領域模型的表示法。

想像我們有一個領域模型與一個表單模型，並已寫好在兩者之間轉換的函式。

```ts
interface MyDomainModel { ... }

interface MyFormModel { ... }

// Instance of `MyFormModel` populated with empty input (e.g. `''` for string inputs, etc.)
const EMPTY_MY_FORM_MODEL: MyFormModel = { ... };

function domainModelToFormModel(domainModel: MyDomainModel): MyFormModel { ... }

function formModelToDomainModel(formModel: MyFormModel): MyDomainModel { ... }
```

### 領域模型轉表單模型

當我們建立表單來編輯系統中既有的領域模型時，通常會以 `input()` 把該領域模型傳入表單元件，或從後端取得（例如透過資源）。無論哪種情況，`linkedSignal` 都提供了套用轉換的絕佳方式。

在以 `input()` 接收領域模型的情況下，我們可以用 `linkedSignal` 從輸入訊號建立一個可寫入的表單模型。

```ts {prefer, header: 'Use linkedSignal to convert domain model to form model'}
@Component(...)
class MyForm {
  // The domain model to initialize the form with, if not given we start with an empty form.
  readonly domainModel = input<MyDomainModel>();

  private readonly formModel = linkedSignal({
    // Linked signal based on the domain model
    source: this.domainModel,
    // If domain model is defined convert it to a form model, otherwise use an empty form model.
    computation: (domainModel) => domainModel
      ? domainModelToFormModel(domainModel)
      : EMPTY_MY_FORM_MODEL
  });

  protected readonly myForm = form(this.formModel);
}
```

同樣地，當我們透過資源從後端接收領域模型時，可以根據它的值建立 `linkedSignal` 來產生 `formModel`。在這個情境下，領域模型可能需要一些時間才能取得，在資料載入完成前，我們應該停用表單。

```ts {prefer, header: 'Disable or hide the form when data is unavailable'}
@Component(...)
class MyForm {
  // Fetch the domain model from the backend.
  readonly domainModelResource: ResourceRef<MyDomainModel | undefined> = httpResource(...);

  private readonly formModel = linkedSignal({
    // Linked signal based on the domain model resource
    source: this.domainModelResource.value,
    // Convert the domain model once it loads, use an empty form model while loading.
    computation: (domainModel) => domainModel
      ? domainModelToFormModel(domainModel)
      : EMPTY_MY_FORM_MODEL
  });

  protected readonly myForm = form(this.formModel, (root) => {
    // Disable the entire form when the resource is loading.
    disabled(root, () => this.domainModelResource.isLoading());
  });
}
```

上面的範例展示的是表單模型的純粹推導，直接來自領域模型。不過，在某些情況下，你可能想在新的領域模型值與先前的領域模型、表單模型值之間做更進階的 diff 運算。這可以依據 `linkedSignal` 的[先前狀態](/guide/signals/linked-signal#accounting-for-previous-state)來實作。

### 表單模型轉領域模型

當我們準備把使用者的輸入存回系統時，需要把它轉換為領域模型的表示法。這通常發生在使用者送出表單時；若是自動儲存的表單，則在使用者編輯時持續進行。

要在送出時儲存，我們可以在 `submit` 函式中處理轉換。

```ts {prefer, header: 'Convert form model to domain model on submit'}
@Component(...)
class MyForm {
  private readonly myDataService = inject(MyDataService);

  protected readonly myForm = form<MyFormModel>(...);

  handleSubmit() {
    submit(this.myForm, async () => {
      await this.myDataService.update(formModelToDomainModel(this.myForm.value()));
    });
  };
}
```

或者，你也可以把表單模型直接送到伺服器，在伺服器上做表單模型到領域模型的轉換。

若要持續儲存，則在 `effect` 中更新領域模型。

```ts {prefer, header: 'Convert form model to domain model in an effect for auto-saving'}
@Component(...)
class MyForm {
  readonly domainModel = model.required<MyDomainModel>()

  protected readonly myForm = form(...);

  constructor() {
    effect(() => {
      // When the form model changes to a valid value, update the domain model.
      if (this.myForm().valid()) {
        this.domainModel.set(formModelToDomainModel(this.myForm.value()));
      }
    });
  };
}
```

上面的範例展示的是從表單模型到領域模型的純粹轉換。不過，除了表單模型的值之外，把完整的表單狀態也納入考量也是完全可以接受的。例如，為了省下位元組，我們可能只想根據使用者改了什麼，把部分更新送到伺服器。在這種情況下，轉換函式可以設計成接收整個表單狀態，並根據表單的值與 dirty 狀態回傳一個稀疏的領域模型。

```ts
type Sparse<T> = T extends object ? {
    [P in keyof T]?: Sparse<T[P]>;
} : T;

function formStateToPartialDomainModel(
  formState: FieldState<MyFormModel>
): Sparse<MyDomainModel> { ... }
```
