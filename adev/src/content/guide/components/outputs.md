# 使用 outputs 的自訂事件

Tip: 本指南假設你已讀過[基礎指南](essentials)。如果你是 Angular 新手，請先讀該指南。

Angular 元件可以透過將屬性指派給新的 `EventEmitter` 並加上 `@Output` 裝飾器，來定義自訂事件：

<docs-code language="ts" highlight="">
@Component({...})
export class ExpandablePanel {
  @Output() panelClosed = new EventEmitter<void>();
}
</docs-code>

```html
<expandable-panel (panelClosed)="savePanelState()" />
```

你可以呼叫 `EventEmitter` 上的 `emit` 方法來發出事件：

<docs-code language="ts" highlight="">
  this.panelClosed.emit();
</docs-code>

Angular 將以 `@Output` 裝飾器標記的屬性稱為 **outputs**。你可以使用 outputs 將資料傳遞給其他元件，類似 `click` 等原生瀏覽器事件。

**Angular 自訂事件不會沿 DOM 向上冒泡**。

**Output 名稱區分大小寫**。

擴充元件類別時，**outputs 會由子類別繼承**。

## 發出事件資料

呼叫 `emit` 時，你可以傳遞事件資料：

<docs-code language="ts" highlight="">
// You can emit primitive values.
this.valueChanged.emit(7);

// You can emit custom event objects
this.thumbDropped.emit({
  pointerX: 123,
  pointerY: 456,
})
</docs-code>

在範本中定義事件監聽器時，你可以從 `$event` 變數存取事件資料：

```html
<custom-slider (valueChanged)="logValue($event)" />
```

## 自訂 output 名稱 {#customizing-output-names}

`@Output` 裝飾器接受一個參數，可讓你為範本中的事件指定不同的名稱：

<docs-code language="ts" highlight="">
@Component({...})
export class CustomSlider {
  @Output('valueChanged') changed = new EventEmitter<number>();
}
</docs-code>

```html
<custom-slider (valueChanged)="saveVolume()" />
```

這個別名不會影響該屬性在 TypeScript 程式碼中的使用方式。

雖然一般來說應避免為元件的 outputs 取別名，但這項功能在重新命名屬性時保留原始名稱的別名，或避免與原生 DOM 事件名稱衝突時非常有用。

## 在 `@Component` 裝飾器中指定 outputs

除了 `@Output` 裝飾器之外，你也可以使用 `@Component` 裝飾器中的 `outputs` 屬性來指定元件的 outputs。當元件從基底類別繼承屬性時，這非常有用：

<docs-code language="ts" highlight="">
// `CustomSlider` inherits the `valueChanged` property from `BaseSlider`.
@Component({
  ...,
  outputs: ['valueChanged'],
})
export class CustomSlider extends BaseSlider {}
</docs-code>

你也可以在 `outputs` 清單中指定 output 別名，方法是在字串中以冒號分隔，並在冒號後寫上別名：

<docs-code language="ts" highlight="">
// `CustomSlider` inherits the `valueChanged` property from `BaseSlider`.
@Component({
  ...,
  outputs: ['valueChanged: volumeChanged'],
})
export class CustomSlider extends BaseSlider {}
</docs-code>

## 選擇事件名稱 {#choosing-event-names}

避免選擇會與 HTMLElement 等 DOM 元素上的事件衝突的 output 名稱。名稱衝突會讓人混淆所繫結的屬性究竟屬於元件還是 DOM 元素。

避免像為元件選擇器那樣，為元件 outputs 加上前綴。由於一個元素只能承載一個元件，任何自訂屬性都可以假定屬於該元件。

一律使用 [camelCase](https://en.wikipedia.org/wiki/Camel_case) 作為 output 名稱。避免在 output 名稱前加上「on」前綴。
