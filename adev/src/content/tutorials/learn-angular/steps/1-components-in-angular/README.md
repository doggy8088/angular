# Angular 中的元件

元件是任何 Angular 應用程式的基礎組成要素。每個元件都由三個部分組成：

- TypeScript 類別
- HTML 範本
- CSS 樣式

NOTE: 在[核心概念指南](/essentials/components)中進一步了解元件。

在這個練習中，你將學習如何更新元件的範本與樣式。

<hr />

這是開始使用 Angular 的絕佳機會。

<docs-workflow>

<docs-step title="更新元件範本">
更新 `template` 屬性，讓它顯示 `Hello Universe`

```ts
template: `
  Hello Universe
`,
```

當你變更 HTML 範本時，預覽會隨之更新，顯示你的訊息。我們再更進一步：改變文字的顏色。
</docs-step>

<docs-step title="更新元件樣式">
更新 styles 的值，把 `color` 屬性從 `blue` 改為 `#a144eb`。

```ts
styles: `
  :host {
    color: #a144eb;
  }
`,
```

查看預覽時，你會發現文字顏色已經改變了。
</docs-step>

</docs-workflow>

在 Angular 中，你可以使用瀏覽器支援的所有 CSS 和 HTML。如果你想的話，也可以把範本與樣式存放在個別的檔案中。
