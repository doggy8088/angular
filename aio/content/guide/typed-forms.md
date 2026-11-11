# 型別化表單

自 Angular 14 起，反應式表單預設為嚴格型別化。

<a id="prerequisites"></a>

## 先備知識

作為本指南的背景，你應該已經熟悉 [Angular 反應式表單](guide/reactive-forms "Reactive Forms")。

<a id="intro"></a>

## 型別化表單概覽

<div class="video-container">

<iframe src="https://www.youtube.com/embed/L-odCf4MfJc" title="Angular Typed Forms" frameborder="0" allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

</div>

使用 Angular 反應式表單時，你會明確指定一個*表單模型*。舉一個簡單的例子，想想這個基本的使用者登入表單：

```ts
const login = new FormGroup({
    email: new FormControl(''),
    password: new FormControl(''),
});
```

Angular 提供許多與這個 `FormGroup` 互動的 API。例如，你可以呼叫 `login.value`、`login.controls`、`login.patchValue` 等。（如需完整的 API 參考，請參閱 [API 文件](api/forms/FormGroup)。）

在先前的 Angular 版本中，這些 API 大多在型別的某處包含 `any`，與控制項結構或值本身互動時並非型別安全的。例如：你可以撰寫以下無效的程式碼：

```ts
const emailDomain = login.value.email.domain;
```

使用嚴格型別化的反應式表單時，上述程式碼無法編譯，因為 `domain` 上沒有 `email` 屬性。

除了增加安全性之外，型別還帶來了其他各種改進，例如 IDE 中更好的自動完成，以及明確指定表單結構的方式。

這些改進目前只適用於*反應式*表單（不適用於[*範本驅動*表單](guide/forms "Forms Guide"))。

<a id="automated-migration"></a>

## 自動化的無型別表單遷移

升級到 Angular 14 時，隨附的遷移會自動將你程式碼中的所有表單類別，替換為對應的無型別版本。例如，上面的程式碼片段會變成：

```ts
const login = new UntypedFormGroup({
    email: new UntypedFormControl(''),
    password: new UntypedFormControl(''),
});
```

每個 `Untyped` 符號的語意與先前 Angular 版本完全相同，因此你的應用程式應能和以前一樣繼續編譯。移除 `Untyped` 前綴，即可逐步啟用這些型別。

<a id="form-control-inference"></a>

## `FormControl`：快速入門

最簡單的表單由單一控制項組成：

```ts
const email = new FormControl('angularrox@gmail.com');
```

這個控制項會自動被推斷為型別 `FormControl<string|null>`。TypeScript 會在 [`FormControl` API](api/forms/FormControl) 中全面強制這個型別，例如 `email.value`、`email.valueChanges`、`email.setValue(...)` 等等。

### 可為 null 的特性

你可能會想：為什麼這個控制項的型別包含 `null`？這是因為控制項隨時可能透過呼叫 reset 而變成 `null`：

```ts
const email = new FormControl('angularrox@gmail.com');
email.reset();
console.log(email.value); // null
```

TypeScript 會強制你隨時處理控制項已變成 `null` 的可能性。如果你想讓這個控制項不可為 null，可以使用 `nonNullable` 選項。這會使控制項重設為其初始值，而不是 `null`：

```ts
const email = new FormControl('angularrox@gmail.com', {nonNullable: true});
email.reset();
console.log(email.value); // angularrox@gmail.com
```

再次強調，這個選項會影響呼叫 `.reset()` 時表單的執行階段行為，變更時應謹慎。

### 指定明確型別

你可以指定型別，而不是依賴推斷。想想一個初始化為 `null` 的控制項。由於初始值是 `null`，TypeScript 會推斷出 `FormControl<null>`，這比我們想要的範圍更窄。

```ts
const email = new FormControl(null);
email.setValue('angularrox@gmail.com'); // Error!
```

若要避免這種情況，我們明確地將型別指定為 `string|null`：

```ts
const email = new FormControl<string|null>(null);
email.setValue('angularrox@gmail.com');
```

<a id="form-array"></a>

## `FormArray`：動態、同質的集合

`FormArray` 包含一份開放式的控制項清單。型別參數對應到每個內部控制項的型別：

```ts
const names = new FormArray([new FormControl('Alex')]);
names.push(new FormControl('Jess'));
```

這個 `FormArray` 的內部控制項型別會是 `FormControl<string|null>`。

如果你想在陣列中放入多種不同的元素型別，你必須使用 `UntypedFormArray`，因為 TypeScript 無法推斷哪個位置會出現哪種元素型別。

<a id="form-group-record"></a>

## `FormGroup` 與 `FormRecord`

Angular 為具有列舉鍵集合的表單提供 `FormGroup` 型別，並為開放式或動態群組提供稱為 `FormRecord` 的型別。

### 部分值

再想想一個登入表單：

```ts
const login = new FormGroup({
    email: new FormControl('', {nonNullable: true}),
    password: new FormControl('', {nonNullable: true}),
});
```

在任何 `FormGroup` 上，都可以[停用控制項](api/forms/FormGroup)。任何停用的控制項都不會出現在群組的值中。

因此，`login.value` 的型別是 `Partial<{email: string, password: string}>`。這個型別中的 `Partial` 表示每個成員都可能是 undefined。

更具體地說，`login.value.email` 的型別是 `string|undefined`，TypeScript 會強制你處理可能為 `undefined` 的值（如果你啟用了 `strictNullChecks`）。

如果你想存取*包含*停用控制項的值，進而繞過可能為 `undefined` 的欄位，你可以使用 `login.getRawValue()`。

### 選擇性控制項與動態群組

有些表單的控制項可能存在、也可能不存在，可以在執行階段加入與移除。你可以使用*選擇性欄位*來表示這些控制項：

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

在這個表單中，我們明確指定型別，這使我們能讓 `password` 控制項成為選擇性的。TypeScript 會強制規定只有選擇性控制項可以被加入或移除。

### `FormRecord`

有些 `FormGroup` 的用法不符合上述模式，因為鍵無法事先知道。`FormRecord` 類別正是為這種情況設計的：

```ts
const addresses = new FormRecord<FormControl<string|null>>({});
addresses.addControl('Andrew', new FormControl('2340 Folsom St'));
```

任何型別為 `string|null` 的控制項都可以加入這個 `FormRecord`。

如果你需要一個既是動態（開放式）、又是異質（控制項為不同型別）的 `FormGroup`，就無法獲得更好的型別安全性，你應該使用 `UntypedFormGroup`。

`FormRecord` 也可以使用 `FormBuilder` 來建立：

```ts
const addresses = fb.record({'Andrew': '2340 Folsom St'});
```

## `FormBuilder` 與 `NonNullableFormBuilder`

`FormBuilder` 類別也已升級，支援新的型別，方式與上述範例相同。

此外，還有一個額外的建置器可供使用：`NonNullableFormBuilder`。這個型別是對每個控制項指定 `{nonNullable: true}` 的簡寫，可以從大型不可為 null 的表單中消除大量重複的樣板程式碼。你可以使用 `nonNullable` 上的 `FormBuilder` 屬性來存取它：

```ts
const fb = new FormBuilder();
const login = fb.nonNullable.group({
    email: '',
    password: '',
});
```

在上述範例中，兩個內部控制項都會是不可為 null 的（也就是會設定 `nonNullable`）。

你也可以使用名稱 `NonNullableFormBuilder` 來注入它。

<!-- links -->

<!-- external links -->

[NinjaSquadTypedFormsBlog]: https://blog.ninja-squad.com/2022/04/21/strictly-typed-forms-angular/ "NinjaSquad | Angular 中的嚴格型別表單"

<!-- end links -->

@reviewed 2022-05-10
