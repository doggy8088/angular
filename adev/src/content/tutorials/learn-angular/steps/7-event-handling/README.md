# 事件處理

事件處理讓網路應用程式具備互動功能。它讓你身為開發者，能夠回應使用者的操作，例如按下按鈕、送出表單等等。

Note: 在[核心概念指南](/essentials/templates#handling-user-interaction)中進一步了解如何處理使用者互動。

在這個練習中，你將學習如何加上事件處理器。

<hr />

在 Angular 中，你使用括號語法 `()` 來繫結事件。在某個元素上，把你想繫結的事件用括號括起來，並設定一個事件處理器。看看這個 `button` 範例：

```angular-ts
@Component({
  ...
  template: `<button (click)="greet()">`
})
export class App {
  greet() {
    console.log('Hello, there 👋');
  }
}
```

在本範例中，每次按鈕被點選時，`greet()` 函式都會執行。請注意，`greet()` 語法包含結尾的括號。

好了，換你來試試看：

<docs-workflow>

<docs-step title="加上事件處理器">
在 `App` 類別中加上 `showSecretMessage()` 事件處理器函式。實作使用以下程式碼：

```ts
showSecretMessage() {
  this.message = 'Way to go 🚀';
}
```

</docs-step>

<docs-step title="繫結到範本事件">
更新 `app.ts` 中的範本程式碼，繫結到 `section` 元素的 `mouseover` 事件。

```angular-html
<section (mouseover)="showSecretMessage()">
```

</docs-step>

</docs-workflow>

只要在程式碼中完成幾個步驟，你就建立了在 Angular 中的第一個事件處理器。看來你愈來愈上手了，繼續保持。
