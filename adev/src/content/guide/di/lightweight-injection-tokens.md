# 以輕量注入 token 最佳化用戶端應用程式大小

本頁從概念上總覽一項建議函式庫開發者採用的依賴注入技巧。
以*輕量注入 token* 來設計你的函式庫，有助於最佳化使用你函式庫的用戶端應用程式的 bundle 大小。

你可以透過可搖樹的提供者，管理元件與可注入服務之間的依賴結構，藉此最佳化 bundle 大小。
這通常能確保：如果提供的元件或服務從未被應用程式實際使用，編譯器就能把它的程式碼從 bundle 中移除。

礙於 Angular 儲存注入 token 的方式，這類未使用的元件或服務還是有可能最終出現在 bundle 中。
本頁說明一種依賴注入設計模式，透過輕量注入 token 來支援正確的搖樹優化。

輕量注入 token 設計模式對函式庫開發者尤其重要。
它能確保當應用程式只使用你函式庫的部分功能時，未使用的程式碼可以從用戶端應用程式的 bundle 中消除。

當應用程式使用你的函式庫時，你的函式庫提供的某些服務，用戶端應用程式可能並不會用到。
在這種情況下，應用程式開發者理應期待該服務被搖樹優化移除，而不是增加編譯後應用程式的大小。
由於應用程式開發者無從得知函式庫中的搖樹優化問題、也無法加以補救，防止未使用元件被保留下來是函式庫開發者的責任。
為此，你的函式庫應該採用輕量注入 token 設計模式。

## token 何時會被保留

為了更清楚地說明 token 被保留的條件，設想一個提供 library-card 元件的函式庫。
這個元件包含一個主體，還可以包含一個可選的標頭：

<docs-code language="html">

<lib-card>;
<lib-header>…</lib-header>;
</lib-card>;

</docs-code>

在一種可能的實作中，`<lib-card>` 元件使用 `@ContentChild()` 或 `@ContentChildren()` 來取得 `<lib-header>` 和 `<lib-body>`，如下所示：

<docs-code language="typescript" highlight="[12]">
@Component({
  selector: 'lib-header',
  …,
})
class LibHeaderComponent {}

@Component({
selector: 'lib-card',
…,
})
class LibCardComponent {
@ContentChild(LibHeaderComponent) header: LibHeaderComponent|null = null;
}

</docs-code>

由於 `<lib-header>` 是可選的，該元素在範本中可以以最精簡的形式出現：`<lib-card></lib-card>`。
在這種情況下，`<lib-header>` 沒有被使用，你會期待它被搖樹優化移除，但實際並非如此。
這是因為 `LibCardComponent` 其實包含兩處對 `LibHeaderComponent` 的參考：

<docs-code language="typescript">
@ContentChild(LibHeaderComponent) header: LibHeaderComponent;
</docs-code>

- 其中一處參考位於*型別位置*，也就是它把 `LibHeaderComponent` 指定為型別：`header: LibHeaderComponent;`。
- 另一處參考位於*值位置*，也就是 `LibHeaderComponent` 是 `@ContentChild()` 參數裝飾器的值：`@ContentChild(LibHeaderComponent)`。

編譯器對這兩個位置的 token 參考處理方式不同：

- 編譯器會在從 TypeScript 轉換後清除*型別位置*的參考，因此它們對搖樹優化沒有影響。
- 編譯器必須在執行階段保留*值位置*的參考，這會**阻止**元件被搖樹優化移除。

在這個範例中，編譯器保留了出現在值位置的 `LibHeaderComponent` token。
這會阻止被參考的元件被搖樹優化移除，即使應用程式實際上沒有在任何地方使用 `<lib-header>`。
如果 `LibHeaderComponent` 的程式碼、範本和樣式合計起來太大，不必要地包含它會顯著增加用戶端應用程式的大小。

## 何時該使用輕量注入 token 模式

當元件被當作注入 token 使用時，就會出現搖樹優化問題。
有兩種情況會發生這種事：

- token 用在[內容查詢](guide/components/queries#content-queries)的值位置。
- token 作為建構子注入的型別指定項使用。

在以下範例中，`OtherComponent` token 的兩種用法都會造成 `OtherComponent` 被保留，在它未被使用時阻止它被搖樹優化移除：

<docs-code language="typescript" highlight="[[2],[4]]">
class MyComponent {
  constructor(@Optional() other: OtherComponent) {}

@ContentChild(OtherComponent) other: OtherComponent|null;
}
</docs-code>

雖然只用作型別指定項的 token 在轉換為 JavaScript 時會被移除，但所有用於依賴注入的 token 在執行階段都是必需的。
這實際上會把 `constructor(@Optional() other: OtherComponent)` 變成 `constructor(@Optional() @Inject(OtherComponent) other)`。
token 此時位於值位置，這會導致搖樹優化器保留該參考。

HELPFUL: 函式庫的所有服務都應該使用[可搖樹的提供者](guide/di/dependency-injection#providing-dependency)，在根層級提供依賴，而不是在元件或模組中提供。

## 使用輕量注入 token

輕量注入 token 設計模式的做法是：使用一個小的抽象類別作為注入 token，並在稍後的階段提供實際實作。
抽象類別會被保留、不會被搖樹優化移除，但它很小，對應用程式大小沒有實質影響。

以下範例示範這如何應用於 `LibHeaderComponent`：

<docs-code language="typescript" language="[[1],[6],[17]]">
abstract class LibHeaderToken {}

@Component({
selector: 'lib-header',
providers: [
{provide: LibHeaderToken, useExisting: LibHeaderComponent}
]
…,
})
class LibHeaderComponent extends LibHeaderToken {}

@Component({
selector: 'lib-card',
…,
})
class LibCardComponent {
@ContentChild(LibHeaderToken) header: LibHeaderToken|null = null;
}
</docs-code>

在這個範例中，`LibCardComponent` 的實作不再於型別位置或值位置參考 `LibHeaderComponent`。
這讓 `LibHeaderComponent` 可以被完整地搖樹優化移除。
`LibHeaderToken` 會被保留，但它只是一個類別宣告，沒有具體實作。
它很小，在編譯後被保留下來時，不會對應用程式大小造成實質影響。

反過來，`LibHeaderComponent` 本身實作了抽象的 `LibHeaderToken` 類別。
你可以放心地把該 token 用作成元件定義中的提供者，讓 Angular 正確地注入具體型別。

總結來說，輕量注入 token 模式包含以下幾項：

1. 一個以抽象類別表示的輕量注入 token。
1. 一個實作該抽象類別的元件定義。
1. 注入輕量模式，使用 `@ContentChild()` 或 `@ContentChildren()`。
1. 輕量注入 token 實作中的一個提供者，它把輕量注入 token 與實作關聯起來。

### 使用輕量注入 token 定義 API

注入輕量注入 token 的元件，可能需要叫用被注入類別中的某個方法。
token 現在是一個抽象類別。由於可注入元件實作了該類別，你還必須在抽象的輕量注入 token 類別中宣告一個抽象方法。
方法的實作連同其所有程式碼開銷，都位於可以被搖樹優化移除的可注入元件中。
這讓父元件能在子元件存在時，以型別安全的方式與它通訊。

例如，`LibCardComponent` 現在查詢的是 `LibHeaderToken`，而不是 `LibHeaderComponent`。
以下範例示範這個模式如何讓 `LibCardComponent` 在不實際參考 `LibHeaderComponent` 的情況下與 `LibHeaderComponent` 通訊：

<docs-code language="typescript" highlight="[[3],[13,16],[27]]">
abstract class LibHeaderToken {
  abstract doSomething(): void;
}

@Component({
selector: 'lib-header',
providers: [
{provide: LibHeaderToken, useExisting: LibHeaderComponent}
]
…,
})
class LibHeaderComponent extends LibHeaderToken {
doSomething(): void {
// Concrete implementation of `doSomething`
}
}

@Component({
selector: 'lib-card',
…,
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

在這個範例中，父元件查詢 token 以取得子元件，並在子元件存在時儲存取得的元件參考。
在叫用子元件的方法之前，父元件會先檢查子元件是否存在。
如果子元件已被搖樹優化移除，執行階段就沒有對它的參考，也就不會叫用它的方法。

### 為你的輕量注入 token 命名

輕量注入 token 只對元件有用。
Angular 風格指南建議為元件命名時使用「Component」後綴。
範例中的「LibHeaderComponent」就遵循了這個慣例。

你應該維持元件與其 token 之間的關係，同時又能區分兩者。
建議的風格是使用元件的基礎名稱加上「`Token`」後綴，來為你的輕量注入 token 命名：「`LibHeaderToken`」。
