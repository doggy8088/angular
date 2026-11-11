<docs-decorative-header title="處理使用者互動" imgSrc="adev/src/assets/images/overview.svg"> <!-- markdownlint-disable-line -->
在你的應用程式中處理使用者互動。
</docs-decorative-header>

處理使用者互動並加以運用，是建構動態應用程式的關鍵面向之一。在本指南中，我們會來看看簡單的使用者互動：事件處理。

## 事件處理 {#event-handling}

你可以透過以下方式，為元素加上事件處理常式：

1. 加上一個屬性，其名稱是放在括號內的事件名稱
2. 指定事件觸發時你想要執行的 JavaScript 陳述式

```angular-html
<button (click)="save()">Save</button>
```

例如，如果我們想建立一個按鈕，在 `click` 事件觸發時執行 `transformText` 函式，就會像下面這樣：

```angular-ts
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

其他常見的事件監聽器例子包括：

```angular-html
<input (keyup)="validateInput()" />
<input (keydown)="updateInput()" />
```

### $event {#event}

如果你需要存取 [event](https://developer.mozilla.org/docs/Web/API/Event) 物件，Angular 提供了一個隱含的 `$event` 變數，你可以把它傳給函式：

```angular-html
<button (click)="createUser($event)">Submit</button>
```

## 下一步 {#next-step}

<docs-pill-row>
  <docs-pill title="共享邏輯" href="essentials/sharing-logic" />
</docs-pill-row>
