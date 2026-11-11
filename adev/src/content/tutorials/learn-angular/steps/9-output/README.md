# 元件的輸出屬性

使用元件時，有時需要通知其他元件某件事發生了。可能是按鈕被點選、項目被加入清單或從清單中移除，或是其他重要的更新發生了。在這種情況下，元件需要與父元件溝通。

Angular 使用 `output()` 函式來實現這類行為。

Note: 在[輸出指南](/guide/components/outputs)中進一步了解自訂事件。

在這個練習中，你將學習如何使用 `output()` 函式與元件溝通。

<hr />

要建立從子元件到父元件的溝通路徑，請使用 `output` 函式來初始化一個類別屬性。

<docs-code header="child.ts" language="ts">
@Component({...})
class Child {
  incrementCountEvent = output<number>();
}
</docs-code>

現在，這個元件可以產生事件，供父元件監聽。呼叫 `emit` 方法即可觸發事件：

<docs-code header="child.ts" language="ts">
class Child {
  ...

onClick() {
this.count++;
this.incrementCountEvent.emit(this.count);
}
}
</docs-code>

emit 函式會產生一個事件，其型別與 `output` 定義的型別相同。

好了，換你來試試看。依照以下任務完成程式碼：

<docs-workflow>

<docs-step title="加上 `output()` 屬性">
更新 `child.ts`，加上一個名為 `addItemEvent` 的輸出屬性，別忘了把輸出型別設為 `string`。
</docs-step>

<docs-step title="完成 `addItem` 方法">
在 `child.ts` 中更新 `addItem` 方法，使用以下程式碼作為邏輯：

<docs-code header="child.ts" highlight="[2]" language="ts">
addItem() {
  this.addItemEvent.emit('🐢');
}
</docs-code>

</docs-step>

<docs-step title="更新 `App` 範本">
在 `app.ts` 中更新範本，加上以下程式碼，監聽所發出的事件：

```angular-html
<app-child (addItemEvent)="addItem($event)" />
```

現在，每次點選 "Add Item" 按鈕，都會把一個新項目加到清單中。

</docs-step>

</docs-workflow>

哇，你到這裡已經完成了元件基礎——太厲害了 👏

繼續學習，解鎖 Angular 更多出色的功能。
