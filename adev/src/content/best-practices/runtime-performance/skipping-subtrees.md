# 略過元件子樹

JavaScript 預設使用可從多個不同元件參照的可變資料結構。Angular 會在整個元件樹上執行變更偵測，以確保資料結構的最新狀態反映在 DOM 中。

變更偵測對於大多數應用程式來說已經夠快了。然而，當應用程式有特別大的元件樹時，在整個應用程式中執行變更偵測可能會造成效能問題。您可以透過將變更偵測設定為只在元件樹的子集上執行來解決此問題。

如果您確信應用程式的一部分不會受到狀態變更的影響，您可以使用 [OnPush](/api/core/ChangeDetectionStrategy) 來略過整個元件子樹的變更偵測。

## 使用 `OnPush`

html
<div>
  <button (click)="toggle()">Toggle</button>
  <p>{{message}}</p>
</div>


typescript
import { Component } from '@angular/core';

@Component({
  selector: 'my-app',
  template: `
    <div>
      <button (click)="toggle()">Toggle</button>
      <p>{{message}}</p>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  message = 'Hello, world!';

  toggle() { this.message = this.message === 'Hello, world!' ? 'Goodbye, world!' : 'Hello, world!'; }
}


這個範例展示如何使用 `OnPush` 變更偵測策略來改善效能。`OnPush` 策略會阻止元件在沒有明確的資料變更時進行變更偵測，這可以減少不必要的變更偵測週期，並提高效能。

要使用 `OnPush` 策略，您需要在元件的 `@Component` 裝飾器中將 `changeDetection` 屬性設為 `ChangeDetectionStrategy.OnPush`。這會告訴 Angular 僅在元件的輸入屬性或`@Input()` 裝飾的屬性發生變更時才進行變更偵測。

在這個範例中，`AppComponent` 元件有一個 `message` 屬性，並有一個按鈕來切換訊息。當您點擊按鈕時，`toggle()` 方法會將 `message` 屬性的值切換為「Hello, world!」和「Goodbye, world!」之間。

由於 `AppComponent` 元件使用 `OnPush` 變更偵測策略，因此只有在 `message` 屬性發生變更時才會進行變更偵測。這意味著當您點擊按鈕時，只有 `message` 屬性所在的 `<p>` 元素會更新，而其他元素不會。

`OnPush` 變更偵測策略可以顯著提高效能，特別是對於具有大量子元件的元件。但是，如果您需要在元件中使用非同步資料，則需要小心使用 `OnPush` 策略。這是因為非同步資料可能會在變更偵測週期之外發生變更，這可能會導致元件中的資料不正確。

如果您需要在元件中使用非同步資料，則可以改用 `Default` 變更偵測策略。`Default` 策略會在每次變更偵測週期中都進行變更偵測，這可以確保元件中的資料始終是最新的。但是，`Default` 策略可能會導致效能下降，特別是對於具有大量子元件的元件。

OnPush 變更偵測指示 Angular **僅** 在以下情況下為元件子樹執行變更偵測：

* 子樹的根元件會收到新輸入，作為範本繫結的結果。Angular 使用 `==` 比較輸入的當前值與過去值。
* Angular 在子樹的根元件或其任何子項中處理事件 _(例如，使用事件繫結、輸出繫結或 `@HostListener` )_，無論它們是否使用 OnPush 變更偵測。

你可以使用 `@Component` 裝飾器將元件的變更偵測策略設定為 `OnPush`：

```ts
import { ChangeDetectionStrategy, Component } from '@angular/core';
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyComponent {}
```

## 常見變更偵測情境

本節探討數個常見的變更偵測情境，以說明 Angular 的行為。

### 事件由具有預設變更偵測的元件處理

如果 Angular 處理一個元件中的事件，而沒有 `OnPush` 策略，該框架會在整個元件樹上執行變更偵測。Angular 會跳過使用 `OnPush` 的後代元件子樹，而這些子樹沒有收到新的輸入。

舉例來說，如果我們將 `MainComponent` 的變更偵測策略設定為 `OnPush`，而使用者與根節點為 `MainComponent` 的子樹以外的元件互動，Angular 會檢查下圖中所有綠色的元件（`AppComponent`、`HeaderComponent`、`SearchComponent`、`ButtonComponent`），除非 `MainComponent` 收到新的輸入：

<!-- TODO(josephperrott): enable this mermaid chart -->

```
graph TD;
    app[AppComponent] --- header[HeaderComponent];
    app --- main["MainComponent (OnPush)"];
    header --- search[SearchComponent];
    header --- button[ButtonComponent];
    main --- login["LoginComponent (OnPush)"];
    main --- details[DetailsComponent];
    event>Event] --- search

style main fill:#E4BE74,color:#000
style login fill:#E4BE74,color:#000
style details fill:#E4BE74,color:#000

style app fill:#C1D5B0,color:#000
style header fill:#C1D5B0,color:#000
style button fill:#C1D5B0,color:#000
style search fill:#C1D5B0,color:#000
```

## OnPush 元件處理事件

如果 Angular 在採用 OnPush 策略的元件中處理事件，這個框架會在整個元件樹中執行變更偵測。Angular 會忽略未收到新輸入且位於處理事件的元件之外、其根節點採用 OnPush 的元件子樹。

舉個例子，如果 Angular 在 `MainComponent` 中處理事件，框架將在整個元件樹中執行變更偵測。Angular 會忽略根為 `LoginComponent` 的子樹，因為它有 `OnPush`，而且事件發生在其範圍之外。

<img alt="從 OnPush 元件傳播變更偵測" src="https://angular.dev/assets/images/best-practices/runtime-performance/on-push-trigger.svg">

<!-- TODO(josephperrott): enable this mermaid chart -->

```
graph TD;
    app[AppComponent] --- header[HeaderComponent];
    app --- main["MainComponent (OnPush)"];
    header --- search[SearchComponent];
    header --- button[ButtonComponent];
    main --- login["LoginComponent (OnPush)"];
    main --- details[DetailsComponent];
    event>Event] --- main

style login fill:#E4BE74,color:#000

style app fill:#C1D5B0,color:#000
style header fill:#C1D5B0,color:#000
style button fill:#C1D5B0,color:#000
style search fill:#C1D5B0,color:#000
style main fill:#C1D5B0,color:#000
style details fill:#C1D5B0,color:#000
```

## 事件由具有 OnPush 的元件後代處理

如果 Angular 在具有 OnPush 的元件中處理事件，框架將會在整個元件樹中執行變更偵測，包括元件的祖先。

舉例來說，在下面的圖表中，Angular 處理 `LoginComponent` 中的事件，它使用了 OnPush。Angular 會在整個元件子樹中呼叫變更偵測，包括 `MainComponent`（`LoginComponent` 的父元件），即使 `MainComponent` 也有 `OnPush`。Angular 也會檢查 `MainComponent`，因為 `LoginComponent` 是其檢視的一部分。

<!-- TODO(josephperrott): enable this mermaid chart -->

```
graph TD;
    app[AppComponent] --- header[HeaderComponent];
    app --- main["MainComponent (OnPush)"];
    header --- search[SearchComponent];
    header --- button[ButtonComponent];
    main --- login["LoginComponent (OnPush)"];
    main --- details[DetailsComponent];
    event>Event] --- login

style app fill:#C1D5B0,color:#000
style header fill:#C1D5B0,color:#000
style button fill:#C1D5B0,color:#000
style search fill:#C1D5B0,color:#000
style login fill:#C1D5B0,color:#000
style main fill:#C1D5B0,color:#000
style details fill:#C1D5B0,color:#000
```

## 具有 OnPush 的元件的新輸入

當透過範本繫結設定輸入屬性時，Angular 會在具有 `OnPush` 的子元件中執行變更偵測。

例如，在下圖中，`AppComponent` 將一個新的輸入傳遞給具有 `OnPush` 的 `MainComponent`。Angular 將在 `MainComponent` 中執行變更偵測，但不會在也具有 `OnPush` 的 `LoginComponent` 中執行變更偵測，除非它也接收到新的輸入。

<!-- TODO(josephperrott): enable this mermaid chart -->

```
graph TD;
    app[AppComponent] --- header[HeaderComponent];
    app --- main["MainComponent (OnPush)"];
    header --- search[SearchComponent];
    header --- button[ButtonComponent];
    main --- login["LoginComponent (OnPush)"];
    main --- details[DetailsComponent];
    event>Parent passes new input to MainComponent]

style login fill:#E4BE74,color:#000

linkStyle 1 stroke:green
style app fill:#C1D5B0,color:#000
style header fill:#C1D5B0,color:#000
style button fill:#C1D5B0,color:#000
style search fill:#C1D5B0,color:#000
style main fill:#C1D5B0,color:#000
style details fill:#C1D5B0,color:#000
```

## 邊緣情況

* **在 TypeScript 程式碼中修改輸入屬性。**當您使用 `@ViewChild` 或 `@ContentChild` 等 API 來取得 TypeScript 中元件的參考，並手動修改 `@Input` 屬性時，Angular 將不會自動為 OnPush 元件執行變更偵測。如果您需要 Angular 執行變更偵測，則可以在元件中注入 `ChangeDetectorRef` 並呼叫 `changeDetectorRef.markForCheck()`，以指示 Angular 排程變更偵測。
* **修改物件參考。**如果輸入將可變動物件接收為值，而您修改物件但保留參考，Angular 將不會呼叫變更偵測。這是預期行為，因為輸入的先前值和目前值指向相同的參考。
