# 使用 DI 瀏覽元件樹

<div class="callout is-critical">

<header>已標記為封存</header>

為了確保你獲得最佳體驗，本主題已標記為待歸檔，直到我們確定它能清楚傳達最正確的資訊為止。

同時，下列主題可能對你有幫助：[階層式注入器](guide/hierarchical-dependency-injection)。

如果你認為這個內容不應該被歸檔，請提出一個 [GitHub issue](https://github.com/angular/angular/issues/new?template=3-docs-bug.md)。

</div>

應用程式元件經常需要分享資訊。你通常可以使用鬆散耦合的技巧來分享資訊，例如資料繫結與服務分享，但有時候讓一個元件直接參考另一個元件是合理的。舉例來說，你需要直接參考，才能存取值或呼叫該元件的方法。

在 Angular 中，取得元件參考有點棘手。Angular 元件本身並沒有一棵可以透過程式檢查或瀏覽的樹。父子關係是間接的，透過元件的[檢視物件](guide/glossary#檢視view)建立。

每個元件都有一個*宿主檢視*，也可以有額外的*內嵌檢視*。元件 A 中的內嵌檢視，就是元件 B 的宿主檢視，而元件 B 又可以有自己的內嵌檢視。這表示每個元件都有一個[檢視階層](guide/glossary#檢視階層view-hierarchy)，而該元件的宿主檢視就是這個階層的根。

有一個 API 可以用來*向下*瀏覽檢視階層。請參閱 [API 參考](api)中的 `Query`、`QueryList`、`ViewChildren` 與 `ContentChildren`。

沒有公開 API 可以取得父元件參考。不過，由於每個元件實例都會被加入注入器的容器中，你可以使用 Angular 依賴注入來觸及父元件。

本節說明一些達成此目的的技巧。

<a id="find-parent"></a>
<a id="known-parent"></a>

### 尋找已知型別的父元件

你可以使用標準的類別注入，來取得型別已知的父元件。

在下列範例中，父元件 `AlexComponent` 有數個子元件，其中包括 `CathyComponent`：

<a id="alex"></a>

<code-example header="parent-finder.component.ts (AlexComponent v.1)" path="dependency-injection-in-action/src/app/parent-finder.component.ts" region="alex-1"></code-example>

在把 `AlexComponent` 注入她的建構子之後，*Cathy* 會回報她是否能夠存取 *Alex*：

<code-example header="parent-finder.component.ts (CathyComponent)" path="dependency-injection-in-action/src/app/parent-finder.component.ts" region="cathy"></code-example>

請注意，雖然有 [@Optional](guide/dependency-injection-in-action#optional) 限定詞作為安全措施，但<live-example name="dependency-injection-in-action"></live-example>證實了 `alex` 參數已有設定。

<a id="base-parent"></a>

### 無法透過基礎類別找到父元件

如果你*不知道*具體的父元件類別，該怎麼辦？

一個可重複使用的元件可能是多個元件的子元件。想像一個用來算繪某金融工具突發新聞的元件。基於業務上的理由，這個新聞元件會在其父元件的金融工具資料隨市場資料串流變化時，頻繁地直接呼叫它。

應用程式可能定義了十幾個以上的金融工具元件。如果你夠幸運，它們全都實作了同一個基礎類別，而你的 `NewsComponent` 能理解該基礎類別的 API。

<div class="alert is-helpful">

尋找實作某個介面的元件會更好。
但這是不可能的，因為 TypeScript 介面在轉譯後的 JavaScript 中會消失，而 JavaScript 不支援介面。
沒有任何產物可以尋找。

</div>

這不一定是好的設計。這個範例要探討的是*元件是否可以透過父元件的基礎類別來注入其父元件*。

範例中的 `CraigComponent` 探討了這個問題。[回頭看](#alex)，你會發現 `Alex` 元件 *extends* \(*繼承*\) 自一個名為 `Base` 的類別。

<code-example header="parent-finder.component.ts (Alex class signature)" path="dependency-injection-in-action/src/app/parent-finder.component.ts" region="alex-class-signature"></code-example>

`CraigComponent` 嘗試把 `Base` 注入其 `alex` 建構子參數，並回報是否成功。

<code-example header="parent-finder.component.ts (CraigComponent)" path="dependency-injection-in-action/src/app/parent-finder.component.ts" region="craig"></code-example>

很可惜，這行不通。<live-example name="dependency-injection-in-action"></live-example>證實了 `alex` 參數是 null。*你無法透過基礎類別注入父元件。*

<a id="class-interface-parent"></a>

### 透過類別介面尋找父元件

你可以使用[類別介面](guide/dependency-injection-in-action#類別介面)找到父元件。

父元件必須配合，以類別介面 token 的名義提供一個指向自身的*別名*。

回想一下，Angular 總是把元件實例加入其自身的注入器；這就是你先前可以把 *Alex* 注入 *Cathy* 的原因[（見前文）](#known-parent)。

撰寫一個[*別名提供者*](guide/dependency-injection-in-action#useexisting) &mdash;也就是一個帶有 `useExisting` 定義的 `provide` 物件字面值&mdash;它會建立一個*替代*方式來注入相同的元件實例，並把該提供者加入 `AlexComponent` 的 `@Component()` 中繼資料 `providers` 陣列中。

<a id="alex-providers"></a>

<code-example header="parent-finder.component.ts (AlexComponent providers)" path="dependency-injection-in-action/src/app/parent-finder.component.ts" region="alex-providers"></code-example>

[Parent](#parent-token) 是該提供者的類別介面 token。[*forwardRef*](guide/dependency-injection-in-action#forwardref) 會打破你剛才因為讓 `AlexComponent` 參考自己而建立的循環參考。

*Carol* 是 *Alex* 的第三個子元件，她會用與之前相同的方式，把父元件注入其 `parent` 參數中。

<code-example header="parent-finder.component.ts (CarolComponent class)" path="dependency-injection-in-action/src/app/parent-finder.component.ts" region="carol-class"></code-example>

以下是實際運作中的 *Alex* 一家人。

<div class="lightbox">

<img alt="Alex 實際運作" src="generated/images/guide/dependency-injection-in-action/alex.png">

</div>

<a id="parent-tree"></a>

### 使用 `@SkipSelf()` 在樹中尋找父元件

想像元件階層中的一個分支：*Alice* -&gt; *Barry* -&gt; *Carol*。*Alice* 與 *Barry* 都實作了 `Parent` 類別介面。

*Barry* 是問題所在。他需要觸及他的父元件 *Alice*，同時也要成為 *Carol* 的父元件。這表示他必須同時*注入* `Parent` 類別介面以取得 *Alice*，並*提供*一個 `Parent` 來滿足 *Carol*。

以下是 *Barry*。

<code-example header="parent-finder.component.ts (BarryComponent)" path="dependency-injection-in-action/src/app/parent-finder.component.ts" region="barry"></code-example>

*Barry* 的 `providers` 陣列看起來就跟 [*Alex* 的](#alex-providers)一模一樣。如果你要繼續像這樣撰寫[*別名提供者*](guide/dependency-injection-in-action#useexisting)，你應該建立一個輔助函式。

現在，請先注意 *Barry* 的建構子。

<code-tabs>
    <code-pane header="Barry's constructor" path="dependency-injection-in-action/src/app/parent-finder.component.ts" region="barry-ctor"></code-pane>
    <code-pane header="Carol's constructor" path="dependency-injection-in-action/src/app/parent-finder.component.ts" region="carol-ctor"></code-pane>
</code-tabs>

除了多了一個 `@SkipSelf` 裝飾器之外，它與 *Carol* 的建構子完全相同。

`@SkipSelf` 之所以必要，有兩個原因：

1.  它告訴注入器，從位於自身*上方*的元件開始搜尋 `Parent` 依賴，而這*正是*父元件的意思。
1.  如果你省略 `@SkipSelf` 裝飾器，Angular 會擲出循環依賴錯誤。

    <code-example format="output" hideCopy language="shell">

    NG0200: Circular dependency in DI detected for BethComponent. Dependency path: BethComponent -&gt; Parent -&gt; BethComponent

    </code-example>

以下是實際運作中的 *Alice*、*Barry* 一家人。

<div class="lightbox">

<img alt="Alice 實際運作" src="generated/images/guide/dependency-injection-in-action/alice.png">

</div>

<a id="parent-token"></a>

### 父元件類別介面

你[先前學過](guide/dependency-injection-in-action#類別介面)，類別介面是當作介面而非基礎類別使用的抽象類別。

這個範例定義了一個 `Parent` 類別介面。

<code-example header="parent-finder.component.ts (Parent class-interface)" path="dependency-injection-in-action/src/app/parent-finder.component.ts" region="parent"></code-example>

`Parent` 類別介面定義了一個 `name` 屬性，有型別宣告但*沒有實作*。`name` 屬性是子元件可以呼叫的父元件唯一成員。這種範圍狹窄的介面有助於讓子元件類別與其父元件解耦。

能夠擔任父元件的元件*應該*像 `AliceComponent` 那樣實作類別介面。

<code-example header="parent-finder.component.ts (AliceComponent class signature)" path="dependency-injection-in-action/src/app/parent-finder.component.ts" region="alice-class-signature"></code-example>

這麼做可以讓程式碼更清楚。但從技術上來說並非必要。雖然 `AlexComponent` 有一個 `name` 屬性（如其 `Base` 類別所要求），但它的類別簽名並沒有提到 `Parent`。

<code-example header="parent-finder.component.ts (AlexComponent class signature)" path="dependency-injection-in-action/src/app/parent-finder.component.ts" region="alex-class-signature"></code-example>

<div class="alert is-helpful">

就正確的風格而言，`AlexComponent` *應該*實作 `Parent`。
在這個範例中它沒有這麼做，*只是*為了示範沒有介面時程式碼仍然可以編譯與執行。

</div>

<!-- links -->

<!-- external links -->

<!-- end links -->

@reviewed 2022-02-28
