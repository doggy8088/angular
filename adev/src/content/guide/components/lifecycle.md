# 元件生命週期

提示：本指南假設您已經閱讀過 [精華指南](essentials)。如果您是 Angular 新手，請先閱讀該指南。

元件的 **生命週期** 是發生在元件建立與銷毀之間的一系列步驟。每個步驟都代表了 Angular 渲染元件和隨時間檢查它們以進行更新的不同部分的過程。

在您的元件中，您可以實作 **生命週期掛勾** 來在這些步驟中執行程式碼。
與特定元件實例相關的生命週期掛勾實作為您的元件類別上的方法。與整個 Angular 應用程式相關的生命週期掛勾實作為接受回呼的函式。

元件的生命週期與 Angular 如何隨著時間檢查元件變化緊密相關。為了理解這個生命週期，您只需要知道 Angular 從上到下巡覽您的應用程式樹狀結構，檢查範本繫結的變化。當 Angular 執行此巡覽時，下列所述的生命週期掛勾會執行。此巡覽會精確地拜訪每個元件一次，因此您應始終避免在處理過程中對狀態做進一步的變更。

## 摘要

<div class="docs-table docs-scroll-track-transparent">
  <table>
    <tr>
      <td><strong>階段</strong></td>
      <td><strong>方法</strong></td>
      <td><strong>摘要</strong></td>
    </tr>
    <tr>
      <td>建立</td>
      <td>constructor</td>
      <td>
        <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/constructor" target="_blank">
          標準 JavaScript 類別建構函式
        </a>。在 Angular 實例化元件時執行。
      </td>
    </tr>
    <tr>
      <td rowspan="7">變更<p>偵測</td>
      <td>ngOnInit
      </td>
      <td>在 Angular 初始化元件的所有輸入後執行一次。</td>
    </tr>
    <tr>
      <td>ngOnChanges</td>
      <td>在元件的輸入每次變更時執行。</td>
    </tr>
    <tr>
      <td>ngDoCheck</td>
      <td>每次檢查此元件是否有變更時執行。</td>
    </tr>
    <tr>
      <td>ngAfterViewInit</td>
      <td>在元件的<em>檢視</em>初始化後執行一次。</td>
    </tr>
    <tr>
      <td>ngAfterContentInit</td>
      <td>在元件的<em>內容</em>初始化後執行一次。</td>
    </tr>
    <tr>
      <td>ngAfterViewChecked</td>
      <td>每次檢查元件的檢視是否有變更時執行。</td>
    </tr>
    <tr>
      <td>ngAfterContentChecked</td>
      <td>每次檢查此元件內容是否有變更時執行。</td>
    </tr>
    <tr>
      <td rowspan="2">呈現</td>
      <td>afterNextRender</td>
      <td>在下次<strong>所有</strong>元件都已呈現到 DOM 時執行一次。</td>
    </tr>
    <tr>
      <td>afterRender</td>
      <td>每次<strong>所有</strong>元件都已呈現到 DOM 時執行。</td>
    </tr>
    <tr>
      <td>銷毀</td>
      <td>ngOnDestroy</td>
      <td>在銷毀元件前執行一次。</td>
    </tr>
  </table>
</div>

### ngOnInit

`ngOnInit` 方法在 Angular 以其初始值初始化所有元件輸入之後執行。元件的 `ngOnInit` 僅執行一次。

此步驟發生在元件自己的範本初始化 _之前_。這表示您可以根據元件的初始輸入值來更新元件的狀態。

### ngOnChanges

`ngOnChanges` 方法在任何元件輸入變更後執行。

此步驟發生在元件自己的範本被檢查_之前_。這表示你可以根據元件的初始輸入值來更新元件的狀態。

在初始化期間，第一個 `ngOnChanges` 會在 `ngOnInit` 之前執行。

#### 檢查變更

`ngOnChanges` 方法接受一個 `SimpleChanges` 參數。這個物件是
[`Record`](https://www.typescriptlang.org/docs/handbook/utility-types.html#recordkeys-type)
將每個元件輸入名稱對應到 `SimpleChange` 物件。每個 `SimpleChange` 包含輸入的先前值、目前值，以及輸入是否為第一次變更的旗標。

```ts
@Component({
  /* ... */
})
export class UserProfile {
  @Input() name: string = '';

  ngOnChanges(changes: SimpleChanges) {
    for (const inputName in changes) {
      const inputValues = changes[inputName];
      console.log(`Previous ${inputName} == ${inputValues.previousValue}`);
      console.log(`Current ${inputName} == ${inputValues.currentValue}`);
      console.log(`Is first ${inputName} change == ${inputValues.firstChange}`);
    }
  }
}
```

如果您為任何輸入屬性提供 `alias`，`SimpleChanges` Record 仍然會使用 TypeScript 屬性名稱作為鍵，而不是別名。

### ngOnDestroy

`ngOnDestroy` 方法在元件被銷毀之前僅執行一次。Angular 會在頁面上不再顯示元件時銷毀它，例如被 `NgIf` 隱藏或導航到另一個頁面時。

#### DestroyRef

作為 `ngOnDestroy` 方法的替代方案，您可以注入 `DestroyRef` 的實例。您可以透過呼叫 `DestroyRef` 的 `onDestroy` 方法來註冊一個在元件毀損時呼叫的回呼。

```ts
@Component({
  /* ... */
})
export class UserProfile {
  constructor(private destroyRef: DestroyRef) {
    destroyRef.onDestroy(() => {
      console.log('UserProfile destruction');
    });
  }
}
```

您可以將 `DestroyRef` 實例傳遞給元件外部的函式或類別。如果您有其他程式碼應該在元件被銷毀時執行一些清理行為時，請使用此模式。

您也可以使用 `DestroyRef` 將設定程式碼放在靠近清理程式碼的位置，而非將所有清理程式碼放入 `ngOnDestroy` 方法。

### ngDoCheck

`ngDoCheck` 方法在 Angular 每一次檢查元件範本是否有變更之前執行。

您可以使用這個生命週期掛鉤手動檢查 Angular 正常變更偵測之外的狀態變更，手動更新元件的狀態。

此方法執行非常頻繁，可能會大幅影響您的頁面效能。請盡可能避免定義此掛鉤，僅在沒有其他替代方案時才使用它。

在初始化期間，第一個 `ngDoCheck` 在 `ngOnInit` 之後執行。

### ngAfterViewInit

`ngAfterViewInit` 方法在元件範本 (其 _檢視_) 中的所有子項初始化之後執行一次。

您可使用此生命週期掛鉤來讀取 [檢視查詢](guide/components/queries#view-queries) 的結果。雖然您可以存取這些查詢的初始化狀態，但嘗試在此方法中變更任何狀態會導致 [ExpressionChangedAfterItHasBeenCheckedError](errors/NG0100)

### ngAfterContentInit

`ngAfterContentInit` 方法在元件內嵌套的所有子代 (其 _內容_) 初始化後執行一次。

您可以在此生命週期掛勾中讀取
[內容查詢](guide/components/queries#content-queries) 的結果。雖然您可以存取這些查詢的初始化狀態，但嘗試在此方法中變更任何狀態會導致
[ExpressionChangedAfterItHasBeenCheckedError](errors/NG0100)

### ngAfterViewChecked

`ngAfterViewChecked` 方法會在元件範本中的子項 (其 _檢視_) 已檢查變更時每次執行。

此方法執行非常頻繁，可能會大幅影響您的頁面效能。請盡可能避免定義此掛鉤，僅在沒有其他替代方案時才使用它。

雖然您可以訪問 [檢視查詢](guide/components/queries#view-queries) 的更新狀態，
但在這個方法中嘗試更改任何狀態都會導致
[ExpressionChangedAfterItHasBeenCheckedError](errors/NG0100)。

### ngAfterContentChecked

`ngAfterContentChecked` 方法會在嵌套在元件內的所有子項 (其
_內容_) 都已檢查是否有變更時每次執行。

此方法執行非常頻繁，可能會大幅影響您的頁面效能。請盡可能避免定義此掛鉤，僅在沒有其他替代方案時才使用它。

雖然您可以在此處存取 [內容查詢](guide/components/queries#content-queries) 的更新狀態，但嘗試在此方法中變更任何狀態會導致 [ExpressionChangedAfterItHasBeenCheckedError](errors/NG0100)。

### afterRender 和 afterNextRender

`afterRender` 和 `afterNextRender` 函式讓您註冊 **渲染回呼**，以便在 Angular 將 _所有元件_ 渲染到 DOM 中之後執行。

這些函式與本指南中描述的其他生命週期掛勾不同。它們不是類別方法，而是接受回呼的獨立函式。render 回呼的執行未繫結到任何特定元件實體，而是一個應用程式範圍的掛勾。

`afterRender` 和 `afterNextRender` 必須在 [注入內容](guide/di/dependency-injection-context) 中呼叫，通常是元件的建構函式。

您可以使用渲染回呼來執行手動 DOM 操作。
請參閱 [使用 DOM API](guide/components/dom-apis) 以獲得有關在 Angular 中使用 DOM 的指導。

Render 回呼不會在伺服器端渲染或建置期間預先渲染時執行。

#### afterRender 階段

在使用 `afterRender` 或 `afterNextRender` 時，你可以選擇性地指定一個 `phase`。這個 `phase` 能讓你控制 DOM 操作的順序，讓你可以在 _讀取_ 操作之前先執行 _寫入_ 操作以減少
[版面重排](https://web.dev/avoid-large-complex-layouts-and-layout-thrashing)。

```ts
import {Component, ElementRef, afterNextRender, AfterRenderPhase} from '@angular/core';

@Component({...})
export class UserProfile {
  private elementHeight = 0;

  constructor(elementRef: ElementRef) {
    const nativeElement = elementRef.nativeElement;

    // Use the `Write` phase to write to a geometric property.
    afterNextRender(() => {
      nativeElement.style.padding = computePadding();
    }, {phase: AfterRenderPhase.Write});

    // Use the `Read` phase to read geometric properties after all writes have occurred.
    afterNextRender(() => {
      this.elementHeight = nativeElement.getBoundingClientRect().height;
    }, {phase: AfterRenderPhase.Read});
  }
}
```

有四個階段，按以下順序運行：

| 階段            | 說明                                                                                                                                                                                           |
| ---------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `EarlyRead`      | 使用此階段來讀取任何佈局影響的 DOM 屬性和樣式，這些屬性和樣式對於後續計算是絕對必要的。如果可能，請避免此階段，優先使用 `Write` 和 `Read` 階段。 |
| `MixedReadWrite` | 預設階段。用於任何需要同時讀取和寫入佈局影響屬性和樣式的操作。如果可能，請避免此階段，優先使用明確的 `Write` 和 `Read` 階段。            |
| `Write`          | 使用此階段來寫入佈局影響的 DOM 屬性和樣式。                                                                                                                                   |
| `Read`           | 使用此階段來讀取任何佈局影響的 DOM 屬性。                                                                                                                                           |

## Lifecycle interfaces

Angular 為每個生命週期方法提供 TypeScript 介面。您可以選擇性地匯入並實作這些介面，以確保您的實作沒有任何錯字或拼寫錯誤。

每個介面都有與對應方法相同的名稱，但沒有 `ng` 前綴。例如，`ngOnInit` 的介面是 `OnInit`。

```ts
@Component({
  /* ... */
})
export class UserProfile implements OnInit {
  ngOnInit() {
    /* ... */
  }
}
```

## 執行順序

以下圖表顯示 Angular 生命周期掛鉤的執行順序。

### 初始化期間

<!-- TODO(josephperrott): enable this mermaid chart -->

```
graph TD;
id[constructor]-->CHANGE;
subgraph CHANGE [Change detection]
direction TB
ngOnChanges-->ngOnInit;
ngOnInit-->ngDoCheck;
ngDoCheck-->ngAfterContentInit;
ngDoCheck-->ngAfterViewInit
ngAfterContentInit-->ngAfterContentChecked
ngAfterViewInit-->ngAfterViewChecked
end
CHANGE--Rendering-->afterRender
```

### 後續更新

<!-- TODO(josephperrott): enable this mermaid chart -->

```
graph TD;
subgraph CHANGE [Change detection]
direction TB
ngOnChanges-->ngDoCheck
ngDoCheck-->ngAfterContentChecked;
ngDoCheck-->ngAfterViewChecked
end
CHANGE--Rendering-->afterRender
```

### 使用指令訂購

當你在同一個元素上放置一個或多個指令，無論是在範本中還是使用 `hostDirectives` 屬性，框架不保證在單個元素上元件和指令之間給定生命週期掛鉤的任何順序。永遠不要依賴觀察到的順序，因為這可能會在 Angular 的後續版本中發生變化。
