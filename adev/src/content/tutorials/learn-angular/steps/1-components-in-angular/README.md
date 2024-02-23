# Angular 中的元件

元件是任何 Angular 應用程式的基礎建構模組。每個元件有三個部分：

* TypeScript 類別
* HTML 範本
* CSS 樣式

在此活動中，您將學習如何更新元件的範本和樣式。

<hr />

這是一個開始使用 Angular 的絕佳機會。

<docs-workflow>

<docs-step title="更新元件範本">
將 `template` 屬性更新為 `Hello Universe`

```ts
template: `
  Hello Universe
`,
```

當您變更 HTML 範本時，預覽會更新您的訊息。我們進一步：變更文字的顏色。
</docs-step>

<docs-step title="更新元件樣式">
更新 styles 值，並將 `color` 屬性從 `blue` 變更為 `#a144eb`。

```ts
styles: `
  :host {
    color: #a144eb;
  }
`,
```

當您檢查預覽時，您會發現文字顏色已變更。
</docs-step>

</docs-workflow>

在 Angular 中，您可以使用所有瀏覽器支援的 CSS 和 HTML。如果您想，您可以將範本和樣式儲存在不同的檔案中。

