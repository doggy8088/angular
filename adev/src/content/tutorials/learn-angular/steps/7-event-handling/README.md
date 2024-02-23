# 事件處理

事件處理可讓網頁應用程式啟用互動式功能。它賦予您身為開發人員的能力，以回應使用者動作，例如按鈕按下、表單提交等。

在這個活動中，你將會學到如何新增事件處理器。

<hr />

在 Angular 中你用括號語法 `()` 來綁定事件。在給定的元素上，用括號括起你想要綁定的事件並設定事件處理常式。考慮這個 `button` 範例：

```ts
@Component({
    ...
    template: `<button (click)="greet()">`
})
class AppComponent {
    greet() {
        console.log('Hello, there 👋');
    }
}
```

在此範例中，每次按一下按鈕，`greet()` 函數就會執行。請注意，`greet()` 語法包含尾隨的括號。

好的，輪到你來試試看：

<docs-workflow>

<docs-step title="新增事件處理函式">
在 `AppComponent` 類別中新增 `onMouseOver` 事件處理函式功能。使用以下程式碼作為實作：

```ts
onMouseOver() {
    this.message = 'Way to go 🚀';
}
```

</docs-step>

<docs-step title="與範本事件繫結">
在 `app.component.ts` 中更新範本程式碼以繫結 `section` 元素的 `mouseover` 事件。

```ts
<section (mouseover)="onMouseOver()">
```

</docs-step>

</docs-workflow>

在程式碼中執行幾個步驟，你便已在 Angular 中建立了第一個事件處理常式。看來你做得相當不錯，繼續努力。

