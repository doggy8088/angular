# 型別化表單遷移

自 Angular 14 起，反應式表單預設為嚴格型別化。

## 型別化表單概觀

<docs-video src="https://www.youtube.com/embed/L-odCf4MfJc" title="Angular 型別化表單"/>

使用 Angular 反應式表單時，你會明確指定一個*表單模型*。簡單舉例來說，請看這個基本的使用者登入表單：

```ts
const login = new FormGroup({
    email: new FormControl(''),
    password: new FormControl(''),
});
```

Angular 提供許多 API 來與這個 `FormGroup` 互動。例如，你可以呼叫 `login.value`、`login.controls`、`login.patchValue` 等。（完整的 API 參考請參閱 [API 文件](api/forms/FormGroup)。）

在先前的 Angular 版本中，大多數這些 API 的型別中都包含 `any`，與控制項的結構或值本身的互動並不具備型別安全性。例如：你可以寫出下列無效的程式碼：

```ts
const emailDomain = login.value.email.domain;
```

有了嚴格型別化的反應式表單，上面的程式碼無法編譯，因為 `email` 上沒有 `domain` 屬性。

除了增加安全性之外，這些型別也帶來了各種其他改進，例如 IDE 中更好的自動完成，以及明確指定表單結構的方式。

這些改進目前僅適用於*反應式*表單（不適用於[*範本驅動*表單](guide/forms/template-driven-forms)）。

## 自動化的無型別表單遷移

升級到 Angular 14 時，隨附的遷移會自動將你程式碼中的所有表單類別，替換為對應的無型別版本。例如，上面的程式碼片段會變成：

```ts
const login = new UntypedFormGroup({
    email: new UntypedFormControl(''),
    password: new UntypedFormControl(''),
});
```

每個 `Untyped` 符號的語意與先前 Angular 版本完全相同，因此你的應用程式應能和以前一樣繼續編譯。移除 `Untyped` 前綴，即可逐步啟用這些型別。
