# 以 `@Output` 進行元件通訊`

在使用元件時，可能需要通知其他元件某件事已發生。可能是按鈕已點擊、項目已加入/從清單中移除，或是已發生其他重要更新。在這種情況下，元件需要與父元件通訊。

Angular 使用 `@Output` 裝飾器啟用此類行為。

在這個活動中，你將學習如何使用 `@Output` 裝飾器和 `EventEmitter` 與元件進行通訊。

<hr />

若要建立子元件至父元件的通訊路徑，請在類別屬性上使用 `@Output` 裝飾器並將其值指定為 `EventEmitter` 類型：

<docs-code header="child.component.ts" language="ts">
@Component({...})
class ChildComponent {
    @Output() incrementCountEvent = new EventEmitter<number>();
}
</docs-code>

現在，此元件可以產生事件，且父元件可以監聽這些事件。透過呼叫 `emit` 方法來觸發事件：

<docs-code header="child.component.ts" language="ts">
class ChildComponent {
    ...

    onClick() {
        this.count++;
        this.incrementCountEvent.emit(count);
    }


}
</docs-code>

`emit` 函式會產生與 `EventEmitter` 實例相同類型的事件。

好的，輪到您來試試看了。請按照下列任務完成程式碼：

<docs-workflow>

<docs-step title="加入 `@Output` 屬性">
透過新增輸出屬性 `addItemEvent` 來更新 `child.component.ts`，務必將 EventEmitter 類型設定為 `string`。
</docs-step>

<docs-step title="完成 `addItem` 方法">
在 `child.component.ts` 更新 `addItem` 方法；使用以下程式碼作為邏輯：

<docs-code header="child.component.ts" highlight="[2]" language="ts">
addItem() {
  this.addItemEvent.emit('🐢');
}
</docs-code>

</docs-step>

<docs-step title="更新 `AppComponent` 範本">
在 `app.component.ts` 中，藉由新增以下程式碼，更新範本來傾聽已發出的事件：

```html
<app-child (addItemEvent)="addItem($event)" />
```

現在，「新增項目」按鈕每次被點擊時，都會新增一個項目到清單中。

</docs-step>

</docs-workflow>

哇，到此你已經完成元件基本知識 - 令 人印象深刻 👏

繼續學習以解鎖更多 Angular 的優異功能。
