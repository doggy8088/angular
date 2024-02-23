# 型別表單

自 Angular 14 開始，預設嚴格類型化響應式表單。

作為本指南的背景知識，您應該已經熟悉 [Angular Reactive Forms](guide/forms/reactive-forms)。

## 輸入表單概述

<docs-video src="https://www.youtube.com/embed/L-odCf4MfJc" alt="Typed Forms in Angular" />

使用 Angular 響應式表單，您可以明確指定 *表單模型*。以下是一個簡單的使用者登入表單範例：

```ts
const login = new FormGroup({
    email: new FormControl(''),
    password: new FormControl(''),
});
```

Angular 提供許多 API 來與此 `FormGroup` 進行互動。例如，您可以呼叫 `login.value`、`login.controls`、`login.patchValue` 等。（如需完整的 API 參考，請參閱 [API 文件](api/forms/FormGroup)）。

在以前的 Angular 版本中，這些 API 大多在類型中包含某個位置的 `any`，而與控制項的結構或值本身進行互動並不是類型安全的。例如：您可以撰寫以下無效程式碼：

```ts
const emailDomain = login.value.email.domain;
```

由於嚴格類型化的反應表單，以上的程式碼無法編譯，因為 `email` 上沒有 `domain` 屬性。

除了增強安全性外，類型還能提供多種其他改進，例如 IDE 中更好的自動完成，以及明確指定表單結構的方法。

這些改進目前僅適用於 *reactive* 表單（而非 [*template-driven* 表單](guide/forms/template-driven-forms)）。

## 未類型化表單

仍支援非類型化表單，且會繼續像以前一樣運作。若要使用它們，您必須從 `@angular/forms` 匯入 `Untyped` 符號：

```ts
const login = new UntypedFormGroup({
    email: new UntypedFormControl(''),
    password: new UntypedFormControl(''),
});
```

每個 `Untyped` 符號的語意與之前的 Angular 版本完全相同。透過移除 `Untyped` 前綴，您可以逐步啟用類型。

## `FormControl`：開始使用

最簡單可能的形式包含單一控制項：

```ts
const email = new FormControl('angularrox@gmail.com');
```

這個控制項將自動推斷為擁有類型 `FormControl<string|null>`。TypeScript 將在整個 [`FormControl` API](api/forms/FormControl) 中自動強制執行此類型，例如 `email.value`、`email.valueChanges`、`email.setValue(...)` 等。

### 可為空值

你可能會想：為什麼這個控制項的類型包含 `null`？這是因為這個控制項在任何時候都可能變成 `null`，方法是呼叫 reset：

```ts
const email = new FormControl('angularrox@gmail.com');
email.reset();
console.log(email.value); // null
```

TypeScript 將強制要求您始終處理控制項已變為 `null` 的可能性。如果您想讓此控制項為非可為空，您可以使用 `nonNullable` 選項。這將導致控制項重設為其初始值，而不是 `null`：

```ts
const email = new FormControl('angularrox@gmail.com', {nonNullable: true});
email.reset();
console.log(email.value); // angularrox@gmail.com
```

重申一下，此選項會影響表單在呼叫 `.reset()` 時的執行時間行為，應謹慎切換。

### 指定明確的類型

可以指定類型，而不是依賴推斷。考慮初始化為 `null` 的控制項。因為初始值是 `null`，所以 TypeScript 會推斷 `FormControl<null>`，這比我們想要的還要窄。

```ts
const email = new FormControl(null);
email.setValue('angularrox@gmail.com'); // Error!
```

為防止此情況，我們明確指定類型為 `string|null`:

```ts
const email = new FormControl<string|null>(null);
email.setValue('angularrox@gmail.com');
```

## `FormArray`：動態、同質集合

`FormArray` 包含一個開放式的控制項列表。類型參數對應到每個內部控制項的類型：

```ts
const names = new FormArray([new FormControl('Alex')]);
names.push(new FormControl('Jess'));
```

這個 `FormArray` 的內部控制類型將是 `FormControl<string|null>`。

如果您想在陣列中擁有多個不同的元素類型，您必須使用 `UntypedFormArray`，因為 TypeScript 無法推斷哪個元素類型會出現在哪個位置。

## `FormGroup` 和 `FormRecord`

Angular 提供 `FormGroup` 類型，適用於具有列舉一組金鑰的表單，以及一個稱為 `FormRecord` 的類型，適用於開放式或動態群組。

### 部分值

再考慮一個登入表單：

```ts
const login = new FormGroup({
    email: new FormControl('', {nonNullable: true}),
    password: new FormControl('', {nonNullable: true}),
});
```

在任何 `FormGroup` 中，[都可以停用控制項](api/forms/FormGroup)。任何已停用的控制項都不會出現在群組的值中。

因此，`login.value` 的類型是 `Partial<{email: string, password: string}>`。此類型中的 `Partial` 表示每個成員可能未定義。

更具體地說，`login.value.email` 的類型是 `string|undefined`，TypeScript 將強制您處理可能 `undefined` 的值（如果您啟用了 `strictNullChecks`）。

如果你想存取包含已停用控制項的值，並因此繞過可能的 `undefined` 欄位，你可以使用 `login.getRawValue()`。

### 選用控制項和動態群組

有些表單包含可能存在或不存在的控制項，這些控制項可以在執行階段新增和移除。你可以使用 *選用欄位* 來表示這些控制項：

```ts
interface LoginForm {
    email: FormControl<string>;
    password?: FormControl<string>;
}

const login = new FormGroup<LoginForm>({
    email: new FormControl('', {nonNullable: true}),
    password: new FormControl('', {nonNullable: true}),
});

login.removeControl('password');
```

在此表單中，我們明確指定類型，這讓我們可以讓 `password` 控制項為選用。TypeScript 將強制執行，只有選用控制項可以新增或移除。

### `FormRecord`

有些 `FormGroup` 用法不符合上述模式，因為金鑰事先不知道。`FormRecord` 類別是為這種情況設計的：

```ts
const addresses = new FormRecord<FormControl<string|null>>({});
addresses.addControl('Andrew', new FormControl('2340 Folsom St'));
```

任何類型為 `string|null` 的控制項都可以加入此 `FormRecord`。

如果您需要一個既動態（開放式）又異質的 `FormGroup`（控制項類型不同），則無法改進類型安全性，您應該使用 `UntypedFormGroup`。

`FormRecord` 也可以使用 `FormBuilder` 建立：

```ts
const addresses = fb.record({'Andrew': '2340 Folsom St'});
```

## `FormBuilder` 和 `NonNullableFormBuilder`

`FormBuilder` 類別也已升級以支援新的類型，方式與以上範例相同。

此外，還提供了一個額外的建構器：`NonNullableFormBuilder`。此類型是指定每個控制項 `{nonNullable: true}` 的簡寫，可以消除大型非空表單中大量的樣板。您可以使用 `FormBuilder` 上的 `nonNullable` 屬性來訪問它：

```ts
const fb = new FormBuilder();
const login = fb.nonNullable.group({
    email: '',
    password: '',
});
```

在以上範例中，內部控制項皆為不可為空 (即會設定 `nonNullable`)。

您也可以使用名稱 `NonNullableFormBuilder` 來注入它。
