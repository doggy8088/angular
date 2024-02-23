# 表單總覽

表單是許多應用程式的重要部分，因為它們使你的應用程式能夠接受使用者輸入。讓我們來瞭解 Angular 如何處理表單。

在 Angular 中，有兩種表單：模板驅動和反應式。您將在接下來的幾個活動中了解這兩種表單。

在這個活動中，您將會學習如何使用範本驅動方式設定表單。

<hr>

<docs-workflow>

<docs-step title="建立輸入欄位">

在 `user.component.ts` 中，透過新增文字輸入，將範本更新，將 `id` 設為 `framework`，類型設為 `text`。

```html
<label for="framework">
  Favorite Framework:
  <input id="framework" type="text" />
</label>
```

</docs-step>

<docs-step title="匯入 `FormsModule`">

要讓這個表單使用啟用資料繫結至表單的 Angular 功能，您必須匯入 `FormsModule`。

從 `@angular/forms` 匯入 `FormsModule` 並將它加入 `UserComponent` 的 `imports` 陣列中。

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

<docs-step title="將繫結新增至輸入值">

`FormsModule` 有個指令叫做 `ngModel`，它會將輸入的值繫結到類別中的屬性。

更新輸入以使用 `ngModel` 指令，特別是具有以下語法的 `[(ngModel)]="favoriteFramework"` 來繫結到 `favoriteFramework` 屬性。

<docs-code language="html" highlight="[3]">
<label for="framework">
  Favorite Framework:
  <input id="framework" type="text" [(ngModel)]="favoriteFramework" />
</label>
</docs-code>

在您進行變更後，請嘗試在輸入欄位中輸入值。注意它如何更新畫面（是的，非常酷）。

備註：語法 `[()]` 稱為「香蕉在盒子中」，但它代表雙向繫結：屬性繫結和事件繫結。在 [Angular 文件中瞭解更多關於雙向資料繫結](guide/templates/two-way-binding)。

</docs-step>

</docs-workflow>

您現在已邁出使用 Angular 建立表單的重要第一步。

好棒喔，繼續保持這個氣勢！

