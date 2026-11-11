# Angular 中的屬性繫結

Angular 中的屬性繫結讓你可以設定 HTML 元素、Angular 元件等各種目標的屬性值。

使用屬性繫結，你可以動態設定屬性和特性值。你可以做很多事，例如切換按鈕功能、以程式方式設定圖片路徑，以及在元件之間共享值。

Note: 在[核心概念指南](/essentials/templates#setting-dynamic-properties-and-attributes)中進一步了解如何設定動態屬性和特性。

在這個練習中，你將學習如何在範本中使用屬性繫結。

<hr />

要繫結到元素的特性，請把特性名稱用方括號括起來。範例如下：

```angular-html
<img alt="photo" [src]="imageURL">
```

在本範例中，`src` 特性的值會繫結到類別屬性 `imageURL`。`imageURL` 的值是什麼，`img` 標籤的 `src` 特性就會被設為什麼。

<docs-workflow>

<docs-step title="加上名為 `isEditable` 的屬性" header="app.ts" language="ts">
更新 `app.ts` 中的程式碼，為 `App` 類別加上一個名為 `isEditable` 的屬性，初始值設為 `true`。

<docs-code highlight="[2]">
export class App {
  isEditable = true;
}
</docs-code>
</docs-step>

<docs-step title="繫結到 `contentEditable`" header="app.ts" language="ts">
接著，使用 <code aria-label="square brackets">[]</code> 語法，把 `div` 的 `contentEditable` 特性繫結到 `isEditable` 屬性。

<docs-code highlight="[3]" language="angular-ts">
@Component({
  ...
  template: `<div [contentEditable]="isEditable"></div>`,
})
</docs-code>
</docs-step>

</docs-workflow>

這個 div 現在可以編輯了。做得好 👍

屬性繫結是 Angular 眾多強大功能之一。如果你想了解更多，請查看 [Angular 文件](guide/templates/property-binding)。
