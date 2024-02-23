# 自訂事件與輸出

提示：本指南假設您已經閱讀過 [精華指南](essentials)。如果您是 Angular 新手，請先閱讀該指南。

Angular 元件可透過將屬性指定給新的 `EventEmitter` 並加入 `@Output` 裝飾器來定義自訂事件：

<docs-code language="ts" highlight="">
@Component({...})
export class ExpandablePanel {
  @Output() panelClosed = new EventEmitter<void>();
}
</docs-code>

```html
<expandable-panel (panelClosed)="savePanelState()" />
```

你可以通過在 `EventEmitter` 上呼叫 `emit` 方法來發出事件：

<docs-code language="ts" highlight="">
  this.panelClosed.emit();
</docs-code>

Angular 將標記為 `@Output` 裝飾器的屬性稱為 **輸出**。您可以使用輸出將資料傳遞給其他元件，類似於 `click` 等原生瀏覽器事件。

**Angular 客製事件不會在 DOM 中冒泡**

**輸出名稱區分大小寫。**

當擴充一個元件類別時，**輸出會被子類別繼承。**

## 發出事件資料

當呼叫 `emit` 時，您可以傳遞事件資料：

<docs-code language="ts" highlight="">
// You can emit primitive values.
this.valueChanged.emit(7);

// You can emit custom event objects
this.thumbDropped.emit({
  pointerX: 123,
  pointerY: 456,
})
</docs-code>

在範本中定義事件監聽器時，您可以透過 `$event` 變數存取事件資料：

```html
<custom-slider (valueChanged)="logValue($event)" />
```

## 自訂輸出名稱

`@Output` 裝飾器接受一個參數，讓您可以指定範本中事件的不同名稱：

<docs-code language="ts" highlight="">
@Component({...})
export class CustomSlider {
  @Output('valueChanged') changed = new EventEmitter<number>();
}
</docs-code>

```html
<custom-slider (valueChanged)="saveVolume()" />
```

此別名不影響 TypeScript 程式碼中屬性的使用方式。

雖然通常應避免對元件的輸出進行別名處理，但此功能可協助變更屬性的名稱，同時保留原始名稱的別名，或避免與原生 DOM 事件的名稱衝突。

## 在 `@Component` 裝飾器中指定輸出

除了 `@Output` 裝飾器之外，您還可以透過 `@Component` 裝飾器中的 `outputs` 屬性來指定元件的輸出。當元件從基底類別繼承屬性時，這會很有用：

<docs-code language="ts" highlight="">
// `CustomSlider` inherits the `valueChanged` property from `BaseSlider`.
@Component({
  ...,
  outputs: ['valueChanged'],
})
export class CustomSlider extends BaseSlider {}
</docs-code>

您還可以在 `outputs` 清單中指定輸出別名，方法是在字串中冒號後面加上別名：

<docs-code language="ts" highlight="">
// `CustomSlider` inherits the `valueChanged` property from `BaseSlider`.
@Component({
  ...,
  outputs: ['valueChanged: volumeChanged'],
})
export class CustomSlider extends BaseSlider {}
</docs-code>

## 選擇事件名稱

避免選擇與 DOM 元素上的事件衝突的輸出名稱，例如 HTMLElement。名稱衝突會讓人混淆，不知道綁定的屬性是屬於組件還是 DOM 元素。

避免為元件輸出新增前綴，就像您使用元件選擇器一樣。由於給定的元素只能建置一個元件，因此可以假設任何自訂屬性都屬於該元件。

永遠使用 [camelCase](https://en.wikipedia.org/wiki/Camel_case) 輸出名稱。避免在輸出名稱前加上「on」。
