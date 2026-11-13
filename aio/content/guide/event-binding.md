# 事件繫結

事件繫結讓你可以監聽並回應使用者操作，例如按鍵、滑鼠移動、點選和觸控。

<div class="alert is-helpful">

請參閱 <live-example></live-example>，查看包含本指南程式碼片段的實際範例。

</div>

## 繫結到事件

要繫結到事件，你要使用 Angular 事件繫結語法。
這個語法由等號左邊括號內的目標事件名稱，以及右邊引號括起來的範本陳述式組成。
在下列範例中，目標事件名稱是 `click`，範本陳述式是 `onSave()`。

<code-example language="html" header="Event binding syntax">
&lt;button (click)="onSave()"&gt;Save&lt;/button&gt;
</code-example>

事件繫結會監聽按鈕的 click 事件，並在每次發生點選時呼叫元件的 `onSave()` 方法。

<div class="lightbox">
  <img src='generated/images/guide/template-syntax/syntax-diagram.svg' alt="語法圖">
</div>

## 繫結到被動事件

Angular 也支援被動事件監聽器。例如，使用下列步驟讓 scroll 事件變成被動。

1. 在 `src` 目錄下建立一個檔案 `zone-flags.ts`。
2. 在這個檔案中加入下列程式行。

```
(window as any)['__zone_symbol__PASSIVE_EVENTS'] = ['scroll'];
```

3. 在 `src/polyfills.ts` 檔案中，在匯入 zone.js 之前，匯入剛建立的 `zone-flags`。

```
import './zone-flags';
import 'zone.js';  // Included with Angular CLI.
```

完成這些步驟後，如果你為 `scroll` 事件加入事件監聽器，這些監聽器就會是 `passive`。

<a id="custom-events-with-eventemitter"></a>

## 使用 `EventEmitter` 的自訂事件

[指令](guide/built-in-directives)通常會使用 Angular [EventEmitter](api/core/EventEmitter)引發自訂事件，如下所示。

1. 指令會建立一個 `EventEmitter`，並將它公開為屬性。
1. 接著，指令呼叫 `EventEmitter.emit(data)` 來發出事件，並傳入訊息資料，資料可以是任何內容。
1. 父指令透過繫結到這個屬性來監聽事件，並透過 `$event` 物件存取資料。

以呈現項目資訊並回應使用者操作的 `ItemDetailComponent` 為例。
雖然 `ItemDetailComponent` 有一個刪除按鈕，但它並不包含刪除英雄的功能。
它只能引發一個事件，回報使用者的刪除請求。


<code-example path="event-binding/src/app/item-detail/item-detail.component.html" header="src/app/item-detail/item-detail.component.html (template)" region="line-through"></code-example>

這個元件定義了一個會回傳 `EventEmitter` 的 `deleteRequest` 屬性。
當使用者點選 **Delete** 時，元件會呼叫 `delete()` 方法，讓 `EventEmitter` 發出一個 `Item` 物件。

<code-example path="event-binding/src/app/item-detail/item-detail.component.ts" header="src/app/item-detail/item-detail.component.ts (deleteRequest)" region="deleteRequest"></code-example>

承載它的父元件會如下繫結到 `ItemDetailComponent` 的 `deleteRequest` 事件。

<code-example path="event-binding/src/app/app.component.html" header="src/app/app.component.html (event-binding-to-component)" region="event-binding-to-component"></code-example>

當 `deleteRequest` 事件觸發時，Angular 會以該項目呼叫父元件的 `deleteItem()` 方法。

### 決定事件目標

要決定事件目標，Angular 會檢查目標事件的名稱，是否符合已知指令的事件屬性。
在下列範例中，Angular 會檢查 `myClick` 是否為自訂 `ClickDirective` 上的事件。

<code-example path="event-binding/src/app/app.component.html" region="custom-directive" header="src/app/app.component.html"></code-example>

如果目標事件名稱 `myClick` 不符合元素事件或 `ClickDirective` 的輸出屬性，Angular 會回報 "unknown directive" 錯誤。

## 後續步驟

如需進一步了解事件繫結的運作方式，請參閱[事件繫結如何運作](guide/event-binding-concepts)。
