# 輸入表單遷移

自 Angular 14 開始，預設嚴格類型化響應式表單。

## 輸入表單概述

<docs-video src="https://www.youtube.com/embed/L-odCf4MfJc" title="Angular Typed Forms"/>

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

## 自動化非類型化表單遷移

在升級至 Angular 14 時，所包含的遷移會自動將程式碼中所有的表單類別替換為對應的非類型化版本。例如，上面的程式片段會變成：

```ts
const login = new UntypedFormGroup({
    email: new UntypedFormControl(''),
    password: new UntypedFormControl(''),
});
```

每個 `Untyped` 符號的語意與先前 Angular 版本中的語意完全相同，因此您的應用程式應該會繼續如常編譯。移除 `Untyped` 前綴後，您可以逐步啟用類型。
