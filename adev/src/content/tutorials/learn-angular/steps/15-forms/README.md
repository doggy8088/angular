# 表單概覽

表單是許多應用程式的重要組成部分，因為它們讓你的應用程式能接受使用者輸入。我們來了解一下 Angular 如何處理表單。

在 Angular 中，表單有兩種類型：範本驅動與反應式。在接下來的幾個練習中，你會逐一了解這兩種表單。

在這個練習中，你將學習如何使用範本驅動的方式建立表單。

<hr>

<docs-workflow>

<docs-step title="建立輸入欄位">

在 `user.component.ts` 中，更新範本，加上一個文字輸入框，`id` 設為 `framework`，type 設為 `text`。

```html
<label for="framework">
  Favorite Framework:
  <input id="framework" type="text" />
</label>
```

</docs-step>

<docs-step title="匯入 `FormsModule`">

要讓這個表單使用 Angular 提供的表單資料繫結功能，你需要匯入 `FormsModule`。

從 `@angular/forms` 匯入 `FormsModule`，並把它加到 `UserComponent` 的 `imports` 陣列中。

<docs-code language="ts" highlight="[2, 7]">
import {Component} from '@angular/core';
import {FormsModule} from '@angular/forms';

@Component({
  ...
  standalone: true,
  imports: [FormsModule],
})
export class UserComponent {}
</docs-code>

</docs-step>

<docs-step title="把繫結加到輸入框的值上">

`FormsModule` 有一個名為 `ngModel` 的指令，能把輸入框的值繫結到你類別中的一個屬性。

更新輸入框，使用 `ngModel` 指令，具體來說就是使用 `[(ngModel)]="favoriteFramework"` 這個語法，繫結到 `favoriteFramework` 屬性。

<docs-code language="html" highlight="[3]">
<label for="framework">
  Favorite Framework:
  <input id="framework" type="text" [(ngModel)]="favoriteFramework" />
</label>
</docs-code>

完成變更後，試著在輸入欄位中輸入一個值。注意它如何即時更新在畫面上（沒錯，非常酷）。

Note: 語法 `[()]` 被暱稱為 "banana in a box"，但它代表的是雙向繫結：屬性繫結與事件繫結。在 [Angular 雙向資料繫結文件](guide/templates/two-way-binding)中進一步了解。

</docs-step>

</docs-workflow>

你現在已經踏出了用 Angular 建置表單的重要第一步。

做得好。讓我們保持這股氣勢，繼續前進！
