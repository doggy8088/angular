# Angular 中的屬性繫結

在 Angular 中的屬性繫結可讓您設定 HTML 元素、Angular 元件等的屬性值。

使用屬性繫結動態設定屬性和屬性的值。您可以執行諸如切換按鈕功能、以程式設定影像路徑，以及在元件之間共用值等操作。

在這個活動中，您將學會在範本中使用屬性繫結。

<hr />

要繫結到元素的屬性，請將屬性名稱用方括號括起來。 voici une 例子：

```ts
<img alt="photo" [src]="imageURL">
```

在此範例中，`src` 屬性的值會繫結至類別屬性 `imageURL`。`imageURL` 所具有的任何值都將設定為 `img` 標籤的 `src` 屬性。

<docs-workflow>

<docs-step title="新增一個名為 `isEditable` 的屬性" header="app.component.ts" language="ts">
藉由新增一個名為 `isEditable` 的屬性至 `AppComponent` 類別，並將初始值設定為 `true`，來更新 `app.component.ts` 中的程式碼。

<docs-code highlight="[2]">
export class AppComponent {
    isEditable = true;
}
</docs-code>
</docs-step>

<docs-step title="Bind to `contentEditable`" header="app.component.ts" language="ts">
Next, bind the `contentEditable` attribute of the `div` to the `isEditable` property by using the <code aria-label="square brackets">[]</code> syntax.

<docs-code highlight="[3]">
@Component({
    ...
    template: `<div [contentEditable]="isEditable"></div>`,
})
</docs-code>
</docs-step>

</docs-workflow>

The div is now editable. Nice work 👍

Property binding is one of Angular's many powerful features. If you'd like to learn more checkout [the Angular documentation](/guide/templates/property-binding).

