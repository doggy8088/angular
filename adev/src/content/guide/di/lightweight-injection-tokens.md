# 使用輕量級注入令牌優化客戶端應用程式大小

此頁面提供建議給程式庫開發人員的依賴注入技術概念概述。
使用「輕量級注入代幣」設計您的程式庫有助於最佳化使用您的程式庫的用戶端應用程式的套件大小。

您可以使用 tree-shakable 供應商管理元件和可注入服務之間的依賴結構，以最佳化套件大小。
這通常可確保如果提供的元件或服務從未實際由應用程式使用，則編譯器可以從套件中移除其程式碼。

由於 Angular 儲存注入令牌的方式，即使未使用元件或服務，最終仍可能出現在套件中。
此頁面說明支援適當的樹狀搖動的依賴性注入設計模式，方法是使用輕量級注入令牌。

輕量級注入令牌設計模式對於程式庫開發人員來說尤其重要。
它可確保當應用程式僅使用程式庫部分功能時，未使用的程式碼可從客戶端應用程式套件中移除。

當應用程式使用您的程式庫時，可能會有一些服務是您的程式庫提供的，但用戶端應用程式並未使用。
在這種情況下，應用程式開發人員應期望該服務被樹狀搖晃，而不增加已編譯應用程式的規模。
由於應用程式開發人員無法得知或解決程式庫中的樹狀搖晃問題，因此由程式庫開發人員負責處理。
為了防止保留未使用的元件，您的程式庫應使用輕量級的注入代幣設計模式。

## 當權杖被保留時

為了更好地解釋令牌保留發生的條件，考慮一個提供圖書館卡元件的圖書館。
此元件包含一個主體，並且可以包含一個可選的標頭。

<docs-code language="html">

<lib-card>;
  <lib-header>&hellip;</lib-header>;
</lib-card>;

</docs-code>

在可能的實作中，`<lib-card>` 元件使用 `@ContentChild()` 或 `@ContentChildren()` 來取得 `<lib-header>` 和 `<lib-body>`，如下所示。

<docs-code language="typescript" highlight="[12]">
@Component({
  selector: 'lib-header',
  &hellip;,
})
class LibHeaderComponent {}

@Component({
  selector: 'lib-card',
  &hellip;,
})
class LibCardComponent {
  @ContentChild(LibHeaderComponent) header: LibHeaderComponent|null = null;
}

</docs-code>

因為 `<lib-header>` 是可選的，該元素可以以其最小形式出現在範本中，`<lib-card></lib-card>`。
在這種情況下，未使用 `<lib-header>`，你會希望它被樹狀搖晃，但這不是發生的事情。
這是因為 `LibCardComponent` 實際上包含兩個對 `LibHeaderComponent` 的引用。

<docs-code language="typescript">
@ContentChild(LibHeaderComponent) header: LibHeaderComponent;
</docs-code>

* 其中一個參照位於 *type 位置*，也就是說，它將 `LibHeaderComponent` 指定為類型：`header: LibHeaderComponent;`。
* 另一個參照位於 *value 位置*，也就是說，`LibHeaderComponent` 是 `@ContentChild()` 參數裝飾器的值：`@ContentChild(LibHeaderComponent)`.

編譯器在這些位置不同地處理令牌參考。

* 編譯器在從 TypeScript 轉換後會抹除 *類型的所在位置* 參照，因此它們不會影響 tree-shaking。
* 編譯器必須在執行階段保留 *值的所在位置* 參照，這 **會阻止** 該元件被 tree-shaken。

在範例中，編譯器保留出現在值位置的 `LibHeaderComponent` 令牌。
即使應用程式實際上並未在任何地方使用 `<lib-header>`，這也會防止參照元件被樹狀搖晃。
如果 `LibHeaderComponent` 的程式碼、範本和樣式組合起來變得太大，不必要地包含它可能會顯著增加用戶端應用程式的規模。

## 什麼時候使用輕量級注入代幣模式

當元件作為注入令牌使用時，就會出現樹搖動問題。
有兩種情況可能會發生這種問題。

* 令牌用於 [內容查詢](/guide/components/queries#content-queries) 的值位置。
* 令牌用作建構函數注入的類型規範。

在以下範例中，`OtherComponent` 令牌的兩個用法都會導致保留 `OtherComponent`，防止在未使用的狀況下被樹狀搖晃。

<docs-code language="typescript" highlight="[[2],[4]]">
class MyComponent {
  constructor(@Optional() other: OtherComponent) {}

@ContentChild(OtherComponent) other: OtherComponent|null;
}
</docs-code>

雖然僅用於類型規範符號的權杖在轉換成 JavaScript 時會被移除，但所有用於依賴性注入的權杖在執行階段都是必要的。
這些會有效地將 `constructor(@Optional() other: OtherComponent)` 變更為 `constructor(@Optional() @Inject(OtherComponent) other)`.
權杖現在在值位置，並導致 tree shaker 保留參照。

HELPFUL: 對於所有服務，程式庫應使用 [tree-shakable 提供者](/guide/di/dependency-injection#providing-dependency)，在根層級提供相依性，而非在元件或模組中提供。

## 使用輕量級注入令牌

輕量級注入代幣設計模式包括使用一個小的抽象類別作為注入代幣，並在稍後階段提供實際實現。
抽象類別被保留，不會被樹狀搖晃，但它很小，對應用程式大小沒有重大影響。

以下範例說明這如何對 `LibHeaderComponent` 發揮作用。

<docs-code language="typescript" language="[[1],[6],[17]]">
abstract class LibHeaderToken {}

@Component({
  selector: 'lib-header',
  providers: [
    {provide: LibHeaderToken, useExisting: LibHeaderComponent}
  ]
  &hellip;,
})
class LibHeaderComponent extends LibHeaderToken {}

@Component({
  selector: 'lib-card',
  &hellip;,
})
class LibCardComponent {
  @ContentChild(LibHeaderToken) header: LibHeaderToken|null = null;
}
</docs-code>

在此範例中，`LibCardComponent` 實作不再在類型位置或值位置中參考 `LibHeaderComponent`。
這讓 `LibHeaderComponent` 的完整樹狀搖晃得以進行。
`LibHeaderToken` 仍被保留，但它只是一個類別宣告，沒有具體的實作。
它很小，在編譯後保留時不會實質影響應用程式大小。

相反，`LibHeaderComponent` 本身實作抽象的 `LibHeaderToken` 類別。
您可以安全地將該令牌用作元件定義中的提供者，允許 Angular 正確注入具體類型。

總之，輕量級注入令牌模式包含下列內容。

1. 以抽象類別表示的輕量級注入代號。
1. 實作抽象類別的元件定義。
1. 使用 `@ContentChild()` 或 `@ContentChildren()` 注入輕量級模式。
1. 在輕量級注入代號的實作中提供一個提供者，將輕量級注入代號與實作關聯起來。

### 使用輕量級注入令牌進行 API 定義

一個注入輕量級注入令牌的元件可能需要在注入的類別中呼叫方法。
令牌現在是一個抽象類別。由於可注入元件實作該類別，因此您還必須在抽象輕量級注入令牌類別中宣告一個抽象方法。
方法的實作，連同其所有程式碼開銷，都存在於可樹狀搖動的注入元件中。
這讓父項能夠以類型安全的方式與子項通訊（如果存在的話）。

例如，`LibCardComponent` 現在查詢 `LibHeaderToken` 而不是 `LibHeaderComponent`。
以下範例顯示此模式如何讓 `LibCardComponent` 與 `LibHeaderComponent` 進行通訊，而實際上並未參照 `LibHeaderComponent`。

<docs-code language="typescript" highlight="[[3],[13,16],[27]]">
abstract class LibHeaderToken {
  abstract doSomething(): void;
}

@Component({
  selector: 'lib-header',
  providers: [
    {provide: LibHeaderToken, useExisting: LibHeaderComponent}
  ]
  &hellip;,
})
class LibHeaderComponent extends LibHeaderToken {
  doSomething(): void {
    // Concrete implementation of `doSomething`
  }
}

@Component({
  selector: 'lib-card',
  &hellip;,
})
class LibCardComponent implement AfterContentInit {
  @ContentChild(LibHeaderToken) header: LibHeaderToken|null = null;

ngAfterContentInit(): void {
    if (this.header !== null) {
      this.header?.doSomething();
    }
  }
}
</docs-code>

在此範例中，父項查詢令牌以取得子元件，並在存在時儲存產生的元件參考。
在呼叫子項中的方法之前，父項元件會檢查子項元件是否存在。
如果子項元件已被樹狀搖晃，則不存在對它的執行時間參考，也無法呼叫它的方法。

### 命名您的輕量級注入程式碼

輕量級注入權杖僅適用於元件。
Angular 風格指南建議您使用「Component」後綴來命名元件。
範例「LibHeaderComponent」遵循此慣例。

您應該在元件及其權杖之間保持關聯，同時仍區分它們。
建議的樣式是使用元件基本名稱加上字尾「`Token`」來為您的輕量級注入權杖命名：「`LibHeaderToken`。」
