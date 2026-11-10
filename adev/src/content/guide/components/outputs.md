# 使用 outputs 的自訂事件

TIP: 本指南假設你已讀過[基礎指南](essentials)。如果你是 Angular 新手，請先讀該指南。

Angular 元件可以透過將屬性指派給 `output` 函式來定義自訂事件：

```ts {highlight:[3]}
@Component({
  /*...*/
})
export class ExpandablePanel {
  panelClosed = output<void>();
}
```

```angular-html
<expandable-panel (panelClosed)="savePanelState()" />
```

`output` 函式會傳回一個 `OutputEmitterRef`。你可以呼叫 `OutputEmitterRef` 上的 `emit` 方法來發出事件：

```ts
this.panelClosed.emit();
```

Angular 將以 `output` 函式初始化的屬性稱為 **outputs**。你可以使用 outputs 來引發自訂事件，類似 `click` 等原生瀏覽器事件。

**Angular 自訂事件不會沿 DOM 向上冒泡**。

**Output 名稱區分大小寫**。

擴充元件類別時，**outputs 會由子類別繼承**。

`output` 函式對 Angular 編譯器具有特殊意義。**你只能在元件與指令的屬性初始化器中呼叫 `output`**。

## 發出事件資料

呼叫 `emit` 時，你可以傳遞事件資料：

```ts
// You can emit primitive values.
this.valueChanged.emit(7);

// You can emit custom event objects
this.thumbDropped.emit({
  pointerX: 123,
  pointerY: 456,
});
```

在範本中定義事件監聽器時，你可以從 `$event` 變數存取事件資料：

```angular-html
<custom-slider (valueChanged)="logValue($event)" />
```

在父元件中接收事件資料：

```ts
@Component({
 /*...*/
})
export class App {
  logValue(value: number) {
    ...
  }
}

```

## 自訂 output 名稱 {#customizing-output-names}

`output` 函式接受一個參數，可讓你為範本中的事件指定不同的名稱：

```ts
@Component({
  /*...*/
})
export class CustomSlider {
  changed = output({alias: 'valueChanged'});
}
```

```angular-html
<custom-slider (valueChanged)="saveVolume()" />
```

這個別名不會影響該屬性在 TypeScript 程式碼中的使用方式。

雖然一般來說應避免為元件的 outputs 取別名，但這項功能在重新命名屬性時保留原始名稱的別名，或避免與原生 DOM 事件名稱衝突時非常有用。

## 以程式方式訂閱 outputs {#subscribing-to-outputs-programmatically}

動態建立元件時，你可以從元件實例以程式方式訂閱 output 事件。`OutputRef` 型別包含一個 `subscribe` 方法：

```ts
const someComponentRef: ComponentRef<SomeComponent> = viewContainerRef.createComponent(/*...*/);

someComponentRef.instance.someEventProperty.subscribe((eventData) => {
  console.log(eventData);
});
```

當 Angular 銷毀具有訂閱者的元件時，會自動清理事件訂閱。或者，你也可以手動取消訂閱事件。`subscribe` 函式會傳回一個 `OutputRefSubscription`，其中有一個 `unsubscribe` 方法：

```ts
const eventSubscription = someComponent.someEventProperty.subscribe((eventData) => {
  console.log(eventData);
});

// ...

eventSubscription.unsubscribe();
```

## 選擇事件名稱 {#choosing-event-names}

避免選擇會與 `HTMLElement` 等 DOM 元素上的事件衝突的 output 名稱。名稱衝突會讓人混淆所繫結的屬性究竟屬於元件還是 DOM 元素。

避免像為元件選擇器那樣，為元件 outputs 加上前綴。由於一個元素只能承載一個元件，任何自訂屬性都可以假定屬於該元件。

一律使用 [camelCase](https://en.wikipedia.org/wiki/Camel_case) 作為 output 名稱。避免在 output 名稱前加上「on」前綴。

## 搭配 RxJS 使用 outputs

關於 outputs 與 RxJS 之間互通性的詳情，請參閱 [RxJS 與元件及指令 outputs 的互通](ecosystem/rxjs-interop/output-interop)。

## 使用 `@Output` 裝飾器宣告 outputs {#declaring-outputs-with-the-output-decorator}

TIP: 雖然 Angular 團隊建議新專案使用 `output` 函式，但原始的裝飾器式 `@Output` API 仍受到完整支援。

或者，你也可以透過將屬性指派給新的 `EventEmitter` 並加上 `@Output` 裝飾器，來定義自訂事件：

```ts
@Component({
  /*...*/
})
export class ExpandablePanel {
  @Output() panelClosed = new EventEmitter<void>();
}
```

你可以呼叫 `EventEmitter` 上的 `emit` 方法來發出事件。

### 搭配 `@Output` 裝飾器的別名

`@Output` 裝飾器接受一個參數，可讓你為範本中的事件指定不同的名稱：

```ts
@Component({
  /*...*/
})
export class CustomSlider {
  @Output('valueChanged') changed = new EventEmitter<number>();
}
```

```angular-html
<custom-slider (valueChanged)="saveVolume()" />
```

這個別名不會影響該屬性在 TypeScript 程式碼中的使用方式。

## 在 `@Component` 裝飾器中指定 outputs

除了 `@Output` 裝飾器之外，你也可以使用 `@Component` 裝飾器中的 `outputs` 屬性來指定元件的 outputs。當元件從基底類別繼承屬性時，這非常有用：

```ts
// `CustomSlider` inherits the `valueChanged` property from `BaseSlider`.
@Component({
  /*...*/
  outputs: ['valueChanged'],
})
export class CustomSlider extends BaseSlider {}
```

你也可以在 `outputs` 清單中指定 output 別名，方法是在字串中以冒號分隔，並在冒號後寫上別名：

```ts
// `CustomSlider` inherits the `valueChanged` property from `BaseSlider`.
@Component({
  /*...*/
  outputs: ['valueChanged: volumeChanged'],
})
export class CustomSlider extends BaseSlider {}
```
