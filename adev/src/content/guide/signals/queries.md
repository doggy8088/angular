# 訊號查詢

元件或指令可以定義查詢，用來尋找子元素並從其注入器中讀取值。

開發者最常用查詢來取得元件、指令、DOM 元素等的參照。

查詢分為兩類：檢視查詢與內容查詢。

訊號查詢以反應式訊號原語的形式提供查詢結果。你可以在 `computed` 與 `effect` 中使用查詢結果，將這些結果與其他訊號組合。

IMPORTANT: 訊號查詢目前處於[開發者預覽](reference/releases#developer-preview)階段。API 可能會根據回饋而變更，不經 Angular 的棄用週期。

如果你已經熟悉 Angular 查詢，可以直接跳到[比較以訊號為基礎的查詢與以裝飾器為基礎的查詢](#comparing-signal-based-queries-to-decorator-based-queries)。

## 檢視查詢 {#view-queries}

檢視查詢會從元件自身範本（檢視）中的元素取得結果。

### `viewChild`

你可以使用 `viewChild` 函式宣告針對單一結果的查詢。

```ts
@Component({
    template: `
        <div #el></div>
        <my-component />
    `
})
export class TestComponent {
    // query for a single result by a string predicate  
    divEl = viewChild<ElementRef>('el');       // Signal<ElementRef|undefined>
    // query for a single result by a type predicate
    cmp = viewChild(MyComponent);              // Signal<MyComponent|undefined>
}
```

### `viewChildren`

你也可以使用 `viewChildren` 函式查詢多個結果。

```ts
 @Component({
    template: `
        <div #el></div>
        @if (show) {
            <div #el></div>
        }
    `
})
export class TestComponent {
    show = true;

    // query for multiple results
    divEls = viewChildren<ElementRef>('el');        // Signal<ReadonlyArray<ElementRef>>
}
```

### 檢視查詢選項 {#view-query-options}

`viewChild` 與 `viewChildren` 查詢宣告函式具有相似的簽名，接受兩個參數：

* 一個**定位器**，用來指定查詢目標，可以是 `string` 或任何可注入的權杖
* 一組**選項**，用來調整指定查詢的行為。

以訊號為基礎的檢視查詢只接受一個選項：`read`。`read` 選項指出要從相符節點注入並在最終結果中回傳的結果型別。

```ts
@Component({
    template: `<my-component/>`
})
export class TestComponent {
    // query for a single result with options
    cmp = viewChild(MyComponent, {read: ElementRef});   // Signal<ElementRef|undefined>
}
```

## 內容查詢 {#content-queries}

內容查詢會從元件內容中的元素取得結果，也就是在該元件被使用的範本中、巢狀置於元件標籤內的元素。

### `contentChild`

你可以使用 `contentChild` 函式查詢單一結果。

```ts
@Component({...})
    export class TestComponent {
    // query by a string predicate  
    headerEl = contentChild<ElementRef>('h');   // Signal<ElementRef|undefined>

    // query by a type predicate
    header = contentChild(MyHeader);            // Signal<MyHeader|undefined>
}
```

### `contentChildren`

你也可以使用 `contentChildren` 函式查詢多個結果。

```ts
    @Component({...})
    export class TestComponent {
    // query for multiple results
    divEls = contentChildren<ElementRef>('h');  // Signal<ReadonlyArray<ElementRef>>
    }
```

### 內容查詢選項 {#content-query-options}

`contentChild` 與 `contentChildren` 查詢宣告函式具有相似的簽名，接受兩個參數：

* 一個**定位器**，用來指定查詢目標，可以是 `string` 或任何可注入的權杖
* 一組**選項**，用來調整指定查詢的行為。

內容查詢接受下列選項：

* `descendants`：依預設，內容查詢只會尋找元件的直接子元素，不會遍歷至後代元素。若將此選項改為 `true`，查詢結果將包含該元素的所有後代元素。然而，即使設為 `true`，查詢也_永遠不會_進入元件內部。
* `read`：指出要從相符節點取得並在最終結果中回傳的結果型別。

### 必要的子查詢 {#required-child-queries}

如果子查詢（`viewChild` 或 `contentChild`）找不到結果，它的值會是 `undefined`。當目標元素被 `@if` 或 `@for` 等控制流程陳述式隱藏時，就可能發生這種情況。

因此，子查詢傳回的訊號，其值可能包含 `undefined`。大多數時候，特別是對於檢視子查詢，開發者會這樣撰寫程式碼，使得：
* 至少有一個相符的結果；
* 在範本已處理完成、查詢結果可用時，才存取結果。

對於這些情況，你可以將子查詢標記為 `required`，以強制要求至少有一個相符結果存在。這會從結果型別簽名中消除 `undefined`。如果 `required` 查詢找不到任何結果，Angular 會拋出錯誤。

```ts
@Component({
  selector: 'app-root',
  standalone: true,
  template: `
    <div #requiredEl></div>
  `,
})
export class App {
  existingEl = viewChild.required('requiredEl');     // required and existing result
  missingEl = viewChild.required('notInATemplate'); // required but NOT existing result
  
  ngAfterViewInit() {
    console.log(this.existingEl()); // OK :-)
    console.log(this.missingEl());  // Runtime error: result marked as required by not available! 
  }
}
```

## 結果可用時機 {#results-availability-timing}

訊號查詢的宣告函式會在指令執行個體的建構過程中執行。這發生在我們能建立查詢執行個體、並執行範本的建立模式來收集任何相符結果之前。因此，會有一段時間，訊號執行個體已經建立（且可以讀取），但還收集不到任何查詢結果。依預設，在結果可用之前，Angular 會回傳 `undefined`（對於子查詢）或空陣列（對於多結果查詢）。必要查詢若在此時被存取，則會拋出錯誤。

Angular 會以延遲方式、按需計算以訊號為基礎的查詢結果。也就是說，除非有程式碼路徑讀取該訊號，否則不會收集查詢結果。

查詢結果可能隨時間因檢視操作而改變，可能透過 Angular 的控制流程（`@if`、`@for` 等），也可能透過直接呼叫 `ViewContainerRef` API。當你從查詢結果訊號讀取值時，隨時間可能會收到不同的值。

Note：為了避免在範本算繪期間回傳不完整的查詢結果，Angular 會延遲查詢解析，直到完成指定範本的算繪。

## 查詢宣告函式及其相關規則 {#query-declaration-functions-and-the-associated-rules}

`viewChild`、`contentChild`、`viewChildren` 與 `contentChildren` 函式是 Angular 編譯器識別的特殊函式。你可以透過初始化元件或指令的屬性，使用這些函式來宣告查詢。你絕不能在元件與指令的屬性初始化器之外呼叫這些函式。

```ts
@Component({
  selector: 'app-root',
  standalone: true,
  template: `
    <div #el></div>
  `,
})
export class App {
  el = viewChild('el'); // all good!

  constructor() {
    const myConst = viewChild('el'); // NOT SUPPORTED
  }
}
```

## 比較以訊號為基礎的查詢與以裝飾器為基礎的查詢 {#comparing-signal-based-queries-to-decorator-based-queries}

訊號查詢是使用 `@ContentChild`、`@ContentChildren`、`@ViewChild` 或 `@ViewChildren` 裝飾器宣告查詢的替代方法。新方法將查詢結果公開為訊號，這表示查詢結果可以與其他訊號組合（使用 `computed` 或 `effect`），並驅動變更偵測。此外，以訊號為基礎的查詢系統還有其他優點：

* **更可預測的時機。** 你可以在查詢結果一可用時就存取它們。
* **更簡單的 API 介面。** 所有查詢都回傳訊號，具有多個結果的查詢則讓你能以標準陣列處理。
* **更好的型別安全。** 在可能的查詢結果中包含 `undefined` 的使用情境更少了。
* **更準確的型別推斷。** 當你使用型別謂詞，或指定明確的 `read` 選項時，TypeScript 能推斷出更準確的型別。
* **更延遲的更新。** Angular 會以延遲方式更新以訊號為基礎的查詢結果；除非你的程式碼明確讀取查詢結果，否則框架不會做任何工作。

底層的查詢機制變化不大，概念上 Angular 仍會建立單數的「child」或複數的「children」查詢，目標是範本（檢視）或內容中的元素。差異在於結果的型別，以及結果可用的確切時機。宣告以訊號為基礎查詢的撰寫格式也有所改變：作為類別成員初始化器的 `viewChild`、`viewChildren`、`contentChild` 與 `contentChildren` 函式，會被 Angular 自動識別。
