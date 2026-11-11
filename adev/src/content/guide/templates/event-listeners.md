# 新增事件監聽器

Angular 支援在範本中為元素定義事件監聽器：將事件名稱寫在括號內，並附上一段在每次事件發生時執行的陳述式。

## 監聽原生事件

當你想為 HTML 元素新增事件監聽器時，將事件名稱以括號 `()` 包起來，這樣你就能指定監聽器陳述式。

```angular-ts
@Component({
  template: `
    <input type="text" (keyup)="updateField()" />
  `,
  ...
})
export class AppComponent{
  updateField(): void {
    console.log('Field is updated!');
  }
}
```

在這個範例中，每當 `<input>` 元素發出 `keyup` 事件，Angular 就會呼叫 `updateField`。

你可以為任何原生事件新增監聽器，例如：`click`、`keydown`、`mouseover` 等。如需了解更多，請參閱 [MDN 上元素的所有可用事件](https://developer.mozilla.org/en-US/docs/Web/API/Element#events)。

## 存取事件引數

在每個範本事件監聽器中，Angular 都會提供一個名為 `$event` 的變數，其中包含事件物件的參照。

```angular-ts
@Component({
  template: `
    <input type="text" (keyup)="updateField($event)" />
  `,
  ...
})
export class AppComponent {
  updateField(event: KeyboardEvent): void {
    console.log(`The user pressed: ${event.key}`);
  }
}
```

## 使用按鍵修飾符 {#using-key-modifiers}

當你想為特定按鍵捕捉特定的鍵盤事件時，你可能會寫出如下的程式碼：

```angular-ts
@Component({
  template: `
    <input type="text" (keyup)="updateField($event)" />
  `,
  ...
})
export class AppComponent {
  updateField(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      console.log('The user pressed enter in the text field.');
    }
  }
}
```

然而，由於這是常見的情境，Angular 讓你可以使用句點（`.`）字元指定特定按鍵來篩選事件。如此一來，程式碼可以簡化為：

```angular-ts
@Component({
  template: `
    <input type="text" (keyup.enter)="updateField($event)" />
  `,
  ...
})
export class AppComponent{
  updateField(event: KeyboardEvent): void {
    console.log('The user pressed enter in the text field.');
  }
}
```

你也可以加入額外的按鍵修飾符：

```angular-html
<!-- Matches shift and enter -->
<input type="text" (keyup.shift.enter)="updateField($event)" />
```

Angular 支援 `alt`、`control`、`meta` 與 `shift` 等修飾符。

你可以指定要繫結到鍵盤事件的按鍵或代碼。按鍵與代碼欄位是瀏覽器鍵盤事件物件的原生部分。依預設，事件繫結假設你想使用[鍵盤事件的 Key 值](https://developer.mozilla.org/docs/Web/API/UI_Events/Keyboard_event_key_values)。

Angular 也允許你提供內建的 `code` 後綴，來指定[鍵盤事件的 Code 值](https://developer.mozilla.org/docs/Web/API/UI_Events/Keyboard_event_code_values)。

```angular-html
<!-- Matches alt and left shift -->
<input type="text" (keydown.code.alt.shiftleft)="updateField($event)" />
```

這在跨不同作業系統一致地處理鍵盤事件時很有用。例如，在 MacOS 裝置上使用 Alt 鍵時，`key` 屬性會回報已經過 Alt 鍵修飾的字元所對應的按鍵。這意味著像 Alt + S 這樣的組合會回報 `'ß'` 的 `key` 值。然而，`code` 屬性對應的是被按下的實體或虛擬按鈕，而不是產生的字元。

## 防止事件的預設行為

如果你的事件處理常式應取代瀏覽器的原生行為，你可以使用事件物件的 [`preventDefault` 方法](https://developer.mozilla.org/en-US/docs/Web/API/Event/preventDefault)：

```angular-ts
@Component({
  template: `
    <a href="#overlay" (click)="showOverlay($event)">
  `,
  ...
})
export class AppComponent{
  showOverlay(event: PointerEvent): void {
    event.preventDefault();
    console.log('Show overlay without updating the URL!');
  }
}
```

如果事件處理常式陳述式的評估結果為 `false`，Angular 會自動呼叫 `preventDefault()`，類似於[原生事件處理常式 attribute](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes#event_handler_attributes)。請一律優先明確呼叫 `preventDefault`，因為這種做法能讓程式碼的意圖一目了然。

## 擴充事件處理 {#extend-event-handling}

Angular 的事件系統可以透過以 `EVENT_MANAGER_PLUGINS` 注入權杖註冊的自訂事件外掛來擴充。

### 實作事件外掛

若要建立自訂事件外掛，請繼承 `EventManagerPlugin` 類別並實作所需的方法。

```ts
import { Injectable } from '@angular/core';
import { EventManagerPlugin } from '@angular/platform-browser';

@Injectable()
export class DebounceEventPlugin extends EventManagerPlugin {
  constructor() {
    super(document);
  }

  // Define which events this plugin supports
  override supports(eventName: string) {
    return /debounce/.test(eventName);
  }

  // Handle the event registration
  override addEventListener(
    element: HTMLElement,
    eventName: string,
    handler: Function
  ) {
    // Parse the event: e.g., "click.debounce.500"
    // event: "click", delay: 500
    const [event, method , delay = 300 ] = eventName.split('.');

    let timeoutId: number;

    const listener = (event: Event) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
          handler(event);
      }, delay);
    };

    element.addEventListener(event, listener);

    // Return cleanup function
    return () => {
      clearTimeout(timeoutId);
      element.removeEventListener(event, listener);
    };
  }
}
```

使用 `EVENT_MANAGER_PLUGINS` 權杖，在你的應用程式 providers 中註冊你的自訂外掛：

```ts
import { bootstrapApplication } from '@angular/platform-browser';
import { EVENT_MANAGER_PLUGINS } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { DebounceEventPlugin } from './debounce-event-plugin';

bootstrapApplication(AppComponent, {
  providers: [
    {
      provide: EVENT_MANAGER_PLUGINS,
      useClass: DebounceEventPlugin,
      multi: true
    }
  ]
});
```

註冊後，你可以在範本中使用你的自訂事件語法，也可以搭配 `host` 屬性使用：

```angular-ts
@Component({
  template: `
    <input
      type="text"
      (input.debounce.500)="onSearch($event.target.value)"
      placeholder="Search..."
    />
  `,
  ...
})
export class Search {
 onSearch(query: string): void {
    console.log('Searching for:', query);
  }
}
```

```ts
@Component({
  ...,
  host: {
    '(click.debounce.500)': 'handleDebouncedClick()',
  },
})
export class AwesomeCard {
  handleDebouncedClick(): void {
   console.log('Debounced click!');
  }
}
```
