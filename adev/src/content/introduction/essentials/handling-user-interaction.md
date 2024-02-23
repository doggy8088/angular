<docs-decorative-header title="處理使用者互動" imgSrc="adev/src/assets/images/overview.svg"> <!-- markdownlint-disable-line -->
在您的應用程式中處理使用者互動。
</docs-decorative-header>

在製作動態應用程式時，其中一個關鍵的重點在於處理使用者互動的能力。在本指南中，我們將探討使用者互動的兩個主要類別：事件處理和表單。

## 事件處理

您可以透過以下方式將事件處理函數新增至元素：

1. 在括號內新增一個帶有事件名稱的屬性
2. 指定當事件觸發時要執行的 JavaScript 語句

```html
<button (click)="save()">Save</button>
```

例如，如果我們想建立一個按鈕，當 `click` 事件觸發時會執行 `transformText` 函數，它會看起來像以下內容：

```ts
// text-transformer.component.ts
@Component({
  standalone: true,
  selector: 'text-transformer',
  template: `
    <p>{{ announcement }}</p>
    <button (click)="transformText()">Abracadabra!</button>
  `,
})
export class TextTransformer {
  announcement = 'Hello again Angular!';

  transformText() {
    this.announcement = this.announcement.toUpperCase();
  }
}
```

其他事件偵聽器的常見範例包括：

- `<input (keyup)="validateInput()" />`
- `<input (keydown)="updateInput()" />`

### $event

如果你需要存取 [event](https://developer.mozilla.org/en-US/docs/Web/API/Event) 物件，Angular 提供一個隱含的 `$event` 變數，你可以將它傳遞給函數：

```html
<button (click)="createUser($event)">Submit</button>
```

## 下一步

<docs-pill-row>
  <docs-pill title="分享邏輯" href="essentials/sharing-logic" />
</docs-pill-row>

