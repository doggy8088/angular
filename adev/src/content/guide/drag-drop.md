# 拖放

## 概覽

本頁說明拖放指令，它們能讓你快速建立具備下列功能的拖放介面：

- 自由拖曳
- 建立一份可重新排序的可拖曳元素清單
- 在清單之間移轉可拖曳元素
- 拖曳動畫
- 沿著某個軸或元素鎖定可拖曳元素
- 加入自訂拖曳控點
- 在拖曳時加入預覽
- 加入自訂拖曳佔位元素

完整的 API 參考請參閱 [Angular CDK 的拖放 API 參考頁面](api#angular_cdk_drag-drop)。

## 開始之前

### 安裝 CDK

[Component Dev Kit (CDK)](https://material.angular.dev/cdk/categories) 是一組用來建立元件的行為基礎元件。若要使用拖放指令，請先從 npm 安裝 `@angular/cdk`。你可以在終端機中使用 Angular CLI 完成：

<docs-code language="shell">
  ng add @angular/cdk
</docs-code>

### 匯入拖放功能

若要使用拖放功能，請在元件中從這些指令匯入你需要的東西。

```ts
import {Component} from '@angular/core';
import {CdkDrag} from '@angular/cdk/drag-drop';

@Component({
  selector: 'my-custom-component',
  templateUrl: 'my-custom-component.html',
  imports: [CdkDrag],
})
export class DragDropExample {}
```

## 建立可拖曳元素

加入 `cdkDrag` 指令，就能讓任何元素變得可拖曳。依預設，所有可拖曳元素都支援自由拖曳。

<docs-code-multifile preview path="adev/src/content/examples/drag-drop/src/overview/app/app.component.ts">
  <docs-code header="app.component.html" path="adev/src/content/examples/drag-drop/src/overview/app/app.component.html"/>
  <docs-code header="app.component.ts" path="adev/src/content/examples/drag-drop/src/overview/app/app.component.ts"/>
  <docs-code header="app.component.css" path="adev/src/content/examples/drag-drop/src/overview/app/app.component.css"/>
</docs-code-multifile>

## 建立可重新排序的可拖曳元素清單

把 `cdkDropList` 指令加到父元素上，就能把可拖曳元素分組為可重新排序的集合。這定義了可拖曳元素可以放置的位置。當元素移動時，放置清單群組中的可拖曳元素會自動重新排列。

拖放指令不會更新你的資料模型。若要更新資料模型，請監聽 `cdkDropListDropped` 事件（在使用者完成拖曳時），並手動更新資料模型。

<docs-code-multifile preview path="adev/src/content/examples/drag-drop/src/sorting/app/app.component.ts">
  <docs-code header="app.component.html" path="adev/src/content/examples/drag-drop/src/sorting/app/app.component.html"/>
  <docs-code header="app.component.ts" path="adev/src/content/examples/drag-drop/src/sorting/app/app.component.ts"/>
  <docs-code header="app.component.css" path="adev/src/content/examples/drag-drop/src/sorting/app/app.component.css"/>
</docs-code-multifile>

你可以使用 `CDK_DROP_LIST` 注入權杖來參照 `cdkDropList` 的執行個體。如需更多資訊，請參閱[依賴注入指南](https://angular.dev/guide/di)與[放置清單注入權杖 API](api/cdk/drag-drop/CDK_DROP_LIST)。

## 在清單之間移轉可拖曳元素

`cdkDropList` 指令支援在已連接的放置清單之間移轉可拖曳元素。把一個或多個 `cdkDropList` 執行個體連接在一起有兩種方式：

- 把 `cdkDropListConnectedTo` 屬性設為另一個放置清單。
- 把元素包在帶有 `cdkDropListGroup` 屬性的元素中。

`cdkDropListConnectedTo` 指令既可以搭配對另一個 `cdkDropList` 的直接參照，也可以參照另一個放置容器的 id。

<docs-code language="html">
<!-- This is valid -->
<div cdkDropList #listOne="cdkDropList" [cdkDropListConnectedTo]="[listTwo]"></div>
<div cdkDropList #listTwo="cdkDropList" [cdkDropListConnectedTo]="[listOne]"></div>

<!-- This is valid as well -->
<div cdkDropList id="list-one" [cdkDropListConnectedTo]="['list-two']"></div>
<div cdkDropList id="list-two" [cdkDropListConnectedTo]="['list-one']"></div>
</docs-code>

<docs-code-multifile preview path="adev/src/content/examples/drag-drop/src/connected-sorting/app/app.component.ts">
  <docs-code header="app.component.html" path="adev/src/content/examples/drag-drop/src/connected-sorting/app/app.component.html"/>
  <docs-code header="app.component.ts" path="adev/src/content/examples/drag-drop/src/connected-sorting/app/app.component.ts"/>
  <docs-code header="app.component.css" path="adev/src/content/examples/drag-drop/src/connected-sorting/app/app.component.css"/>
</docs-code-multifile>

如果你有數量不定的已連接放置清單，可以使用 `cdkDropListGroup` 指令來自動設定連接。任何加到群組底下的新 `cdkDropList` 都會自動連接到所有其他清單。

<docs-code language="html">
<div cdkDropListGroup>
  <!-- All lists in here will be connected. -->
  @for (list of lists; track list) {
    <div cdkDropList></div>
  }
</div>
</docs-code>

<docs-code-multifile preview path="adev/src/content/examples/drag-drop/src/connected-sorting-group/app/app.component.ts">
  <docs-code header="app.component.html" path="adev/src/content/examples/drag-drop/src/connected-sorting-group/app/app.component.html"/>
  <docs-code header="app.component.ts" path="adev/src/content/examples/drag-drop/src/connected-sorting-group/app/app.component.ts"/>
  <docs-code header="app.component.css" path="adev/src/content/examples/drag-drop/src/connected-sorting-group/app/app.component.css"/>
</docs-code-multifile>

你可以使用 `CDK_DROP_LIST_GROUP` 注入權杖來參照 `cdkDropListGroup` 的執行個體。如需更多資訊，請參閱[依賴注入指南](https://angular.dev/guide/di)與[放置清單群組注入權杖 API](api/cdk/drag-drop/CDK_DROP_LIST_GROUP)。

### 選擇性拖曳

依預設，使用者可以把 `cdkDrag` 元素從一個容器移到另一個已連接的容器。若要更精細地控制哪些元素可以放入容器，請使用 `cdkDropListEnterPredicate`。每當可拖曳元素進入新容器時，Angular 都會呼叫這個述詞。依述詞傳回 true 或 false，該項目可能會、也可能不會被允許進入新容器。

<docs-code-multifile preview path="adev/src/content/examples/drag-drop/src/enter-predicate/app/app.component.ts">
  <docs-code header="app.component.html" path="adev/src/content/examples/drag-drop/src/enter-predicate/app/app.component.html"/>
  <docs-code header="app.component.ts" path="adev/src/content/examples/drag-drop/src/enter-predicate/app/app.component.ts"/>
  <docs-code header="app.component.css" path="adev/src/content/examples/drag-drop/src/enter-predicate/app/app.component.css"/>
</docs-code-multifile>

## 附加資料

分別設定 `cdkDragData` 或 `cdkDropListData`，就能把任意資料關聯到 `cdkDrag` 與 `cdkDropList`。你可以繫結到這兩個指令觸發的事件，這些事件會包含該資料，讓你能輕鬆辨識拖曳或放置互動的來源。

<docs-code language="html">
@for (list of lists; track list) {
  <div cdkDropList [cdkDropListData]="list" (cdkDropListDropped)="drop($event)">
    @for (item of list; track item) {
      <div cdkDrag [cdkDragData]="item"></div>
    }
  </div>
}
</docs-code>

## 拖曳自訂

### 自訂拖曳控點

依預設，使用者可以拖曳整個 `cdkDrag` 元素來移動它。若要限制使用者只能透過控點元素來拖曳，請把 `cdkDragHandle` 指令加到 `cdkDrag` 內部的元素上。你可以有任意數量的 `cdkDragHandle` 元素。

<docs-code-multifile preview path="adev/src/content/examples/drag-drop/src/custom-handle/app/app.component.ts">
  <docs-code header="app.component.html" path="adev/src/content/examples/drag-drop/src/custom-handle/app/app.component.html"/>
  <docs-code header="app.component.ts" path="adev/src/content/examples/drag-drop/src/custom-handle/app/app.component.ts"/>
  <docs-code header="app.component.css" path="adev/src/content/examples/drag-drop/src/custom-handle/app/app.component.css"/>
</docs-code-multifile>

你可以使用 `CDK_DRAG_HANDLE` 注入權杖來參照 `cdkDragHandle` 的執行個體。如需更多資訊，請參閱[依賴注入指南](https://angular.dev/guide/di)與[拖曳控點注入權杖 API](api/cdk/drag-drop/CDK_DRAG_HANDLE)。

### 自訂拖曳預覽

當 `cdkDrag` 元素被拖曳時，預覽元素會變得可見。依預設，預覽是原始元素的複製，位置就在使用者的游標旁邊。

若要自訂預覽，請透過 `*cdkDragPreview` 提供自訂範本。由於不會對元素的內容做任何假設，自訂預覽不會符合原始被拖曳元素的大小。若要讓拖曳預覽符合元素的大小，請把 true 傳給 `matchSize` 輸入。

複製出的元素會移除它的 id 屬性，以免頁面上有多個具有相同 id 的元素。這會導致任何以該 id 為目標的 CSS 都不會被套用。

<docs-code-multifile preview path="adev/src/content/examples/drag-drop/src/custom-preview/app/app.component.ts">
  <docs-code header="app.component.html" path="adev/src/content/examples/drag-drop/src/custom-preview/app/app.component.html"/>
  <docs-code header="app.component.ts" path="adev/src/content/examples/drag-drop/src/custom-preview/app/app.component.ts"/>
  <docs-code header="app.component.css" path="adev/src/content/examples/drag-drop/src/custom-preview/app/app.component.css"/>
</docs-code-multifile>

你可以使用 `CDK_DRAG_PREVIEW` 注入權杖來參照 `cdkDragPreview` 的執行個體。如需更多資訊，請參閱[依賴注入指南](https://angular.dev/guide/di)與[拖曳預覽注入權杖 API](api/cdk/drag-drop/CDK_DRAG_PREVIEW)。

### 自訂拖曳插入點

依預設，Angular 會把 `cdkDrag` 預覽插入頁面的 `<body>`，以避免定位與溢位方面的問題。在某些情況下這可能不是理想的做法，因為預覽不會套用它繼承的樣式。

你可以使用 `cdkDrag` 上的 `cdkDragPreviewContainer` 輸入，改變 Angular 插入預覽的位置。可能的值如下：

| 值                            | 說明                                                                           | 優點                                                                                       | 缺點                                                                                                   |
| :---------------------------- | :----------------------------------------------------------------------------- | :----------------------------------------------------------------------------------------- | :----------------------------------------------------------------------------------------------------- |
| `global`                      | 預設值。Angular 會把預覽插入 <body> 或最近的 shadow root。                     | 預覽不會受到 `z-index` 或 `overflow: hidden` 影響，也不會影響 `:nth-child` 選擇器與 flex 版面配置。 | 不會保留繼承的樣式。                                                                                   |
| `parent`                      | Angular 會把預覽插入正在被拖曳元素的父元素內。                                 | 預覽繼承與被拖曳元素相同的樣式。                                                           | 預覽可能會被 `overflow: hidden` 裁切，或因 `z-index` 而被放到其他元素底下。此外，它可能影響 `:nth-child` 選擇器與某些 flex 版面配置。 |
| `ElementRef` or `HTMLElement` | Angular 會把預覽插入指定的元素。                                               | 預覽繼承指定容器元素的樣式。                                                               | 預覽可能會被 `overflow: hidden` 裁切，或因 `z-index` 而被放到其他元素底下。此外，它可能影響 `:nth-child` 選擇器與某些 flex 版面配置。 |

或者，如果值是 `global` 或 `parent`，你可以修改 `CDK_DRAG_CONFIG` 注入權杖，更新設定中的 `previewContainer`。如需更多資訊，請參閱[依賴注入指南](https://angular.dev/guide/di)、[拖曳設定注入權杖 API](api/cdk/drag-drop/CDK_DRAG_CONFIG)與[拖放設定 API](api/cdk/drag-drop/DragDropConfig)。

### 自訂拖曳佔位元素

當 `cdkDrag` 元素被拖曳時，該指令會建立一個佔位元素，顯示元素放下後將被放置的位置。依預設，佔位元素是被拖曳元素的複製。你可以使用 `*cdkDragPlaceholder` 指令，把佔位元素換成自訂的：

<docs-code-multifile preview path="adev/src/content/examples/drag-drop/src/custom-placeholder/app/app.component.ts">
  <docs-code header="app.component.html" path="adev/src/content/examples/drag-drop/src/custom-placeholder/app/app.component.html"/>
  <docs-code header="app.component.ts" path="adev/src/content/examples/drag-drop/src/custom-placeholder/app/app.component.ts"/>
  <docs-code header="app.component.css" path="adev/src/content/examples/drag-drop/src/custom-placeholder/app/app.component.css"/>
</docs-code-multifile>

你可以使用 `CDK_DRAG_PLACEHOLDER` 注入權杖來參照 `cdkDragPlaceholder` 的執行個體。如需更多資訊，請參閱[依賴注入指南](https://angular.dev/guide/di)與[拖曳佔位元素注入權杖 API](api/cdk/drag-drop/CDK_DRAG_PLACEHOLDER)。

### 自訂拖曳根元素

如果你想讓某個元素變得可拖曳，卻無法直接存取它，請設定 `cdkDragRootElement` 屬性。

該屬性接受一個選擇器，並向上查找 DOM，直到找到符合該選擇器的元素。如果找到元素，它就會變得可拖曳。這在讓對話框變得可拖曳等情況下很有用。

<docs-code-multifile preview path="adev/src/content/examples/drag-drop/src/root-element/app/app.component.ts">
  <docs-code header="app.component.html" path="adev/src/content/examples/drag-drop/src/root-element/app/app.component.html"/>
  <docs-code header="app.component.ts" path="adev/src/content/examples/drag-drop/src/root-element/app/app.component.ts"/>
  <docs-code header="app.component.css" path="adev/src/content/examples/drag-drop/src/root-element/app/app.component.css"/>
</docs-code-multifile>

或者，你可以修改 `CDK_DRAG_CONFIG` 注入權杖，更新設定中的 `rootElementSelector`。如需更多資訊，請參閱[依賴注入指南](https://angular.dev/guide/di)、[拖曳設定注入權杖 API](api/cdk/drag-drop/CDK_DRAG_CONFIG)與[拖放設定 API](api/cdk/drag-drop/DragDropConfig)。

### 設定可拖曳元素的 DOM 位置

依預設，不在 `cdkDropList` 中的 `cdkDrag` 元素，只有在使用者手動移動元素時，才會離開它一般的 DOM 位置。使用 `cdkDragFreeDragPosition` 輸入可以明確設定元素的位置。常見的使用案例是在使用者離開又返回後，恢復可拖曳元素的位置。

<docs-code-multifile preview path="adev/src/content/examples/drag-drop/src/free-drag-position/app/app.component.ts">
  <docs-code header="app.component.html" path="adev/src/content/examples/drag-drop/src/free-drag-position/app/app.component.html"/>
  <docs-code header="app.component.ts" path="adev/src/content/examples/drag-drop/src/free-drag-position/app/app.component.ts"/>
  <docs-code header="app.component.css" path="adev/src/content/examples/drag-drop/src/free-drag-position/app/app.component.css"/>
</docs-code-multifile>

### 限制在元素內移動

若要防止使用者把 `cdkDrag` 元素拖到另一個元素之外，請把 CSS 選擇器傳給 `cdkDragBoundary` 屬性。這個屬性接受一個選擇器，並向上查找 DOM，直到找到符合的元素。如果找到符合項，該元素就成為邊界，可拖曳元素不能被拖到它之外。`cdkDragBoundary` 也可以在 `cdkDrag` 放在 `cdkDropList` 內部時使用。

<docs-code-multifile preview path="adev/src/content/examples/drag-drop/src/boundary/app/app.component.ts">
  <docs-code header="app.component.html" path="adev/src/content/examples/drag-drop/src/boundary/app/app.component.html"/>
  <docs-code header="app.component.ts" path="adev/src/content/examples/drag-drop/src/boundary/app/app.component.ts"/>
  <docs-code header="app.component.css" path="adev/src/content/examples/drag-drop/src/boundary/app/app.component.css"/>
</docs-code-multifile>

或者，你可以修改 `CDK_DRAG_CONFIG` 注入權杖，更新設定中的 boundaryElement。如需更多資訊，請參閱[依賴注入指南](https://angular.dev/guide/di)、[拖曳設定注入權杖 API](api/cdk/drag-drop/CDK_DRAG_CONFIG)與[拖放設定 API](api/cdk/drag-drop/DragDropConfig)。

### 限制沿著某個軸移動

依預設，`cdkDrag` 允許在所有方向自由移動。若要把拖曳限制在特定軸上，請在 `cdkDrag` 上把 `cdkDragLockAxis` 設為 "x" 或 "y"。若要限制 `cdkDropList` 內多個可拖曳元素的拖曳，請改在 `cdkDropList` 上設定 `cdkDropListLockAxis`。

<docs-code-multifile preview path="adev/src/content/examples/drag-drop/src/axis-lock/app/app.component.ts">
  <docs-code header="app.component.html" path="adev/src/content/examples/drag-drop/src/axis-lock/app/app.component.html"/>
  <docs-code header="app.component.ts" path="adev/src/content/examples/drag-drop/src/axis-lock/app/app.component.ts"/>
  <docs-code header="app.component.css" path="adev/src/content/examples/drag-drop/src/axis-lock/app/app.component.css"/>
</docs-code-multifile>

或者，你可以修改 `CDK_DRAG_CONFIG` 注入權杖，更新設定中的 `lockAxis`。如需更多資訊，請參閱[依賴注入指南](https://angular.dev/guide/di)、[拖曳設定注入權杖 API](api/cdk/drag-drop/CDK_DRAG_CONFIG)與[拖放設定 API](api/cdk/drag-drop/DragDropConfig)。

### 延遲拖曳

依預設，當使用者在 `cdkDrag` 上按住指標時，拖曳程序就會開始。在某些情況下這種行為可能不理想，例如觸控裝置上的全螢幕可拖曳元素，使用者在捲動頁面時可能不小心觸發拖曳事件。

你可以使用 `cdkDragStartDelay` 輸入來延遲拖曳程序。這個輸入會等使用者按住指標達到指定的毫秒數後，才開始拖曳元素。

<docs-code-multifile preview path="adev/src/content/examples/drag-drop/src/delay-drag/app/app.component.ts">
  <docs-code header="app.component.html" path="adev/src/content/examples/drag-drop/src/delay-drag/app/app.component.html"/>
  <docs-code header="app.component.ts" path="adev/src/content/examples/drag-drop/src/delay-drag/app/app.component.ts"/>
  <docs-code header="app.component.css" path="adev/src/content/examples/drag-drop/src/delay-drag/app/app.component.css"/>
</docs-code-multifile>

或者，你可以修改 `CDK_DRAG_CONFIG` 注入權杖，更新設定中的 `dragStartDelay`。如需更多資訊，請參閱[依賴注入指南](https://angular.dev/guide/di)、[拖曳設定注入權杖 API](api/cdk/drag-drop/CDK_DRAG_CONFIG)與[拖放設定 API](api/cdk/drag-drop/DragDropConfig)。

### 停用拖曳

如果你想停用特定拖曳項目的拖曳功能，請把 `cdkDrag` 項目上的 `cdkDragDisabled` 輸入設為 true 或 false。你可以使用 `cdkDropList` 上的 `cdkDropListDisabled` 輸入停用整個清單。也可以透過 `cdkDragHandle` 上的 `cdkDragHandleDisabled` 停用特定的控點。

<docs-code-multifile preview path="adev/src/content/examples/drag-drop/src/disable-drag/app/app.component.ts">
  <docs-code header="app.component.html" path="adev/src/content/examples/drag-drop/src/disable-drag/app/app.component.html"/>
  <docs-code header="app.component.ts" path="adev/src/content/examples/drag-drop/src/disable-drag/app/app.component.ts"/>
  <docs-code header="app.component.css" path="adev/src/content/examples/drag-drop/src/disable-drag/app/app.component.css"/>
</docs-code-multifile>

或者，你可以修改 `CDK_DRAG_CONFIG` 注入權杖，更新設定中的 `draggingDisabled`。如需更多資訊，請參閱[依賴注入指南](https://angular.dev/guide/di)、[拖曳設定注入權杖 API](api/cdk/drag-drop/CDK_DRAG_CONFIG)與[拖放設定 API](api/cdk/drag-drop/DragDropConfig)。

## 排序自訂

### 清單方向

依預設，`cdkDropList` 指令假設清單是垂直的。把 `cdkDropListOrientation` 屬性設為 horizontal，就能改變這一點。

<docs-code-multifile preview path="adev/src/content/examples/drag-drop/src/horizontal-sorting/app/app.component.ts">
  <docs-code header="app.component.html" path="adev/src/content/examples/drag-drop/src/horizontal-sorting/app/app.component.html"/>
  <docs-code header="app.component.ts" path="adev/src/content/examples/drag-drop/src/horizontal-sorting/app/app.component.ts"/>
  <docs-code header="app.component.css" path="adev/src/content/examples/drag-drop/src/horizontal-sorting/app/app.component.css"/>
</docs-code-multifile>

或者，你可以修改 `CDK_DRAG_CONFIG` 注入權杖，更新設定中的 `listOrientation`。如需更多資訊，請參閱[依賴注入指南](https://angular.dev/guide/di)、[拖曳設定注入權杖 API](api/cdk/drag-drop/CDK_DRAG_CONFIG)與[拖放設定 API](api/cdk/drag-drop/DragDropConfig)。

### 清單換行

依預設，`cdkDropList` 使用 CSS transform 移動可拖曳元素來進行排序。這讓排序可以動畫呈現，提供更好的使用者體驗。不過，這也有個缺點：放置清單只能在單一方向運作，也就是垂直或水平。

如果你有需要換到新行的可排序清單，可以把 `cdkDropListOrientation` 屬性設為 `mixed`。這會讓清單改用不同的元素排序策略，也就是在 DOM 中移動元素。不過，清單就無法再以動畫呈現排序動作了。

<docs-code-multifile preview path="adev/src/content/examples/drag-drop/src/mixed-sorting/app/app.component.ts">
  <docs-code header="app.component.html" path="adev/src/content/examples/drag-drop/src/mixed-sorting/app/app.component.html"/>
  <docs-code header="app.component.ts" path="adev/src/content/examples/drag-drop/src/mixed-sorting/app/app.component.ts"/>
  <docs-code header="app.component.css" path="adev/src/content/examples/drag-drop/src/mixed-sorting/app/app.component.css"/>
</docs-code-multifile>

### 選擇性排序

依預設，`cdkDrag` 元素可以被排序到 `cdkDropList` 內的任何位置。若要改變這個行為，請設定接受函式的 `cdkDropListSortPredicate` 屬性。每當可拖曳元素即將被移到放置清單內的新索引時，就會呼叫這個述詞函式。如果述詞傳回 true，該項目會被移到新索引；否則會保持目前的位置。

<docs-code-multifile preview path="adev/src/content/examples/drag-drop/src/sort-predicate/app/app.component.ts">
  <docs-code header="app.component.html" path="adev/src/content/examples/drag-drop/src/sort-predicate/app/app.component.html"/>
  <docs-code header="app.component.ts" path="adev/src/content/examples/drag-drop/src/sort-predicate/app/app.component.ts"/>
  <docs-code header="app.component.css" path="adev/src/content/examples/drag-drop/src/sort-predicate/app/app.component.css"/>
</docs-code-multifile>

### 停用排序

有些情況下，可拖曳元素可以從一個 `cdkDropList` 拖到另一個，但使用者不應該能在來源清單內排序它們。對於這些情況，請加入 `cdkDropListSortingDisabled` 屬性，防止 `cdkDropList` 中的可拖曳元素進行排序。如果被拖曳的元素沒有被拖到新的有效位置，這能保留它在來源清單中的初始位置。

<docs-code-multifile preview path="adev/src/content/examples/drag-drop/src/disable-sorting/app/app.component.ts">
  <docs-code header="app.component.html" path="adev/src/content/examples/drag-drop/src/disable-sorting/app/app.component.html"/>
  <docs-code header="app.component.ts" path="adev/src/content/examples/drag-drop/src/disable-sorting/app/app.component.ts"/>
  <docs-code header="app.component.css" path="adev/src/content/examples/drag-drop/src/disable-sorting/app/app.component.css"/>
</docs-code-multifile>

或者，你可以修改 `CDK_DRAG_CONFIG` 注入權杖，更新設定中的 `sortingDisabled`。如需更多資訊，請參閱[依賴注入指南](https://angular.dev/guide/di)、[拖曳設定注入權杖 API](api/cdk/drag-drop/CDK_DRAG_CONFIG)與[拖放設定 API](api/cdk/drag-drop/DragDropConfig)。

### 在清單之間複製項目

依預設，當項目從一個清單拖到另一個清單時，它會從原始清單移出。不過，你可以設定這些指令來複製項目，讓原始項目留在來源清單中。

若要啟用複製，你可以設定 `cdkDropListHasAnchor` 輸入。這會告訴 `cdkDropList` 建立一個「anchor」元素，它會留在原始容器中，不隨項目移動。如果使用者把項目移回原始容器，這個 anchor 會自動被移除。你可以把 `.cdk-drag-anchor` CSS 類別作為目標，來為 anchor 元素設定樣式。

把 `cdkDropListHasAnchor` 與 `cdkDropListSortingDisabled` 組合起來，就能建立一份讓使用者可以複製項目、但無法重新排序來源清單的清單（例如產品清單與購物車）。

<docs-code-multifile preview path="adev/src/content/examples/drag-drop/src/copy-list/app/app.component.ts">
  <docs-code header="app.component.html" path="adev/src/content/examples/drag-drop/src/copy-list/app/app.component.html"/>
  <docs-code header="app.component.ts" path="adev/src/content/examples/drag-drop/src/copy-list/app/app.component.ts"/>
  <docs-code header="app.component.css" path="adev/src/content/examples/drag-drop/src/copy-list/app/app.component.css"/>
</docs-code-multifile>

## 自訂動畫

拖放功能支援以下兩種動畫：

- 在清單內排序可拖曳元素
- 把可拖曳元素從使用者放下的位置移到清單內的最終位置

若要設定你的動畫，請定義一個以 transform 屬性為目標的 CSS transition。下列類別可以用於動畫：

| CSS 類別名稱        | 加入 transition 的效果                                                                                                                                                                                     |
| :------------------ | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| .cdk-drag           | 在可拖曳元素排序時為它們加上動畫。                                                                                                                                                                         |
| .cdk-drag-animating | 把可拖曳元素從放下的位置以動畫移到 `cdkDropList` 內的最終位置。<br><br>這個 CSS 類別只在拖曳動作停止時才套用到 `cdkDrag` 元素。                                                                          |

## 樣式

`cdkDrag` 與 `cdkDropList` 這兩個指令都只套用功能運作所必需的樣式。應用程式可以把這些指定的 CSS 類別作為目標，來自訂樣式。

| CSS 類別名稱             | 說明                                                                                                                                                                                                                                                                                                    |
| :----------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| .cdk-drop-list           | `cdkDropList` 容器元素的選擇器。                                                                                                                                                                                                                                                                        |
| .cdk-drag                | `cdkDrag` 元素的選擇器。                                                                                                                                                                                                                                                                        |
| .cdk-drag-disabled       | 已停用的 `cdkDrag` 元素的選擇器。                                                                                                                                                                                                                                                                       |
| .cdk-drag-handle         | `cdkDragHandle` 宿主元素的選擇器。                                                                                                                                                                                                                                                                      |
| .cdk-drag-preview        | 拖曳預覽元素的選擇器。當使用者在可排序清單中拖曳元素時，這個元素會出現在游標旁邊。<br><br>除非透過 `*cdkDragPreview` 以自訂範本自訂，否則這個元素看起來與被拖曳的元素完全一樣。                                                                                                                             |
| .cdk-drag-placeholder    | 拖曳佔位元素的選擇器。拖曳動作結束後，可拖曳元素將被拖到的位置會顯示這個元素。<br><br>除非以 cdkDragPlaceholder 指令自訂，否則這個元素看起來與被排序的元素完全一樣。                                                                                                                                       |
| .cdk-drop-list-dragging  | 目前有可拖曳元素正在被拖曳的 `cdkDropList` 容器元素的選擇器。                                                                                                                                                                                                                                           |
| .cdk-drop-list-disabled  | 已停用的 `cdkDropList` 容器元素的選擇器。                                                                                                                                                                                                                                        |
| .cdk-drop-list-receiving | 有可接收的可拖曳元素（來自已連接的放置清單、目前正在被拖曳）的 `cdkDropList` 容器元素的選擇器。                                                                                                                                                                                                            |
| .cdk-drag-anchor         | 啟用 `cdkDropListHasAnchor` 時所建立的 anchor 元素的選擇器。這個元素標示被拖曳項目開始的位置。                                                                                                                                                                                                        |

## 在可捲動容器中拖曳

如果你的可拖曳項目位於可捲動容器內（例如帶有 `overflow: auto` 的 `div`），除非該可捲動容器有 `cdkScrollable` 指令，否則自動捲動將無法運作。沒有它，CDK 在拖曳操作期間就無法偵測或控制容器的捲動行為。

## 與其他元件整合

CDK 的拖放功能可以與不同的元件整合。常見的使用案例包括可排序的 `MatTable` 元件與可排序的 `MatTabGroup` 元件。
