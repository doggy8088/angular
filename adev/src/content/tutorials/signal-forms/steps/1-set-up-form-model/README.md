# 建立表單模型

每個訊號表單都從一個表單資料模型開始：它是一個訊號，定義了資料的結構，並儲存你的表單資料。

在這一課中，你將學到如何：

- 為表單資料定義 TypeScript 介面
- 建立一個用來存放表單值的訊號
- 使用 `form()` 函式建立訊號表單

一起為登入表單打好基礎吧！

<hr />

<docs-workflow>

<docs-step title="定義 LoginData 介面">
建立一個 TypeScript 介面，定義登入表單資料的結構。這個表單將包含：

- 一個 `email` 欄位（字串）
- 一個 `password` 欄位（字串）
- 一個 `rememberMe` 欄位（布林值）

```ts
interface LoginData {
  email: string;
  password: string;
  rememberMe: boolean;
}
```

將這個介面加在 `@Component` 裝飾器上方。
</docs-step>

<docs-step title="匯入 signal 與 form">
從 `@angular/core` 匯入 `signal` 函式，並從 `@angular/forms/signals` 匯入 `form` 函式：

```ts
import {Component, signal} from '@angular/core';
import {form} from '@angular/forms/signals';
```

</docs-step>

<docs-step title="建立表單模型訊號">
在你的元件類別中，建立一個帶有初始值的 `loginModel` 訊號，並使用 `LoginData` 介面作為型別參數：

```ts
loginModel = signal<LoginData>({
  email: '',
  password: '',
  rememberMe: false,
});
```

初始值方面，文字欄位是空字串，核取方塊則是 `false`。
</docs-step>

<docs-step title="建立表單">
現在，將你的模型訊號傳入 `form()` 函式來建立表單：

```ts
loginForm = form(this.loginModel);
```

`form()` 函式會根據你的模型建立表單，讓你能存取欄位狀態與驗證功能。
</docs-step>

</docs-workflow>

太棒了！你已經建立好表單模型。`loginModel` 訊號存放著你的表單資料，而 `loginForm` 則讓你能以型別安全的方式存取每個欄位。

接下來，你將學習[如何將表單連接到範本](/tutorials/signal-forms/2-connect-form-template)！
