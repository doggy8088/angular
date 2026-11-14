# 依賴注入模式

**依賴注入**是一種重要的應用程式設計模式。
它被使用得如此廣泛，幾乎人人都直接稱它為 _DI_。

Angular 有自己的依賴注入框架，而且
你真的不可能不用它就建置出 Angular 應用程式。

本頁說明什麼是 DI，以及它為什麼有用。

當你學會了這個通用模式後，就可以接著看
[Angular 依賴注入](guide/dependency-injection) 指南，了解它在 Angular 應用程式中如何運作。

{@a why-di }

## 為什麼要使用依賴注入？

要了解依賴注入為什麼如此重要，先看一個不使用它的範例。
想像你寫了以下程式碼：

<code-example path="dependency-injection/src/app/car/car-no-di.ts" region="car" title="src/app/car/car.ts (without DI)">
</code-example>

`Car` 類別在它的建構子裡建立了它需要的一切。
有什麼問題？
問題在於 `Car` 類別脆弱、缺乏彈性，而且難以測試。

這輛 `Car` 需要引擎和輪胎。`Car` 建構子不是向外界索取它們，
而是從非常具體的 `Engine` 與 `Tires` 類別
自行實例化出它自己的副本。

要是 `Engine` 類別演進了，而它的建構子需要一個參數，會怎麼樣？
那會使 `Car` 類別壞掉，而且它會一直壞著，直到你把它改寫成像
`this.engine = new Engine(theNewParameter)` 這樣。
當你第一次寫 `Car` 時，`Engine` 建構子的參數根本不在你的考量之內。
你現在可能也預料不到。
但你將*不得不*開始在意，因為
當 `Engine` 的定義改變時，`Car` 類別也必須改變。
這使得 `Car` 很脆弱。

要是你想給你的 `Car` 裝上不同品牌的輪胎呢？很遺憾，不行。
你被鎖死在 `Tires` 類別所建立的那個品牌上了。這使得
`Car` 類別缺乏彈性。

目前每輛新車都有它自己的 `engine`。它無法與其他車共用 `engine`。
雖然這對汽車引擎來說合情合理，
但你肯定想得到其他應該共用的依賴，例如車上
與製造商服務中心的無線連線。這輛 `Car` 缺乏
共用先前已為其他消費者建立好的服務的彈性。

當你為 `Car` 寫測試時，你只能任由它隱藏的依賴擺佈。
在測試環境中真的有辦法建立新的 `Engine` 嗎？
`Engine` 依賴什麼？那個依賴又依賴什麼？
新的 `Engine` 實例會對伺服器發出非同步呼叫嗎？
你當然不希望測試期間發生這種事。

要是 `Car` 應該在胎壓過低時閃爍警告訊號呢？
如果你在測試期間無法換上低胎壓的輪胎，
你要如何確認它真的會閃爍警告？

你對這輛車隱藏的依賴毫無控制。
當你無法控制依賴時，類別就會變得難以測試。

你要如何讓 `Car` 更健壯、更有彈性、更容易測試？

{@a ctor-injection}
這超級簡單。把 `Car` 建構子改成有 DI 的版本：

<code-tabs>

  <code-pane title="src/app/car/car.ts (excerpt with DI)" path="dependency-injection/src/app/car/car.ts" region="car-ctor">
  </code-pane>

  <code-pane title="src/app/car/car.ts (excerpt without DI)" path="dependency-injection/src/app/car/car-no-di.ts" region="car-ctor">
  </code-pane>

</code-tabs>

看到發生了什麼事嗎？依賴的定義
現在就在建構子裡。
`Car` 類別不再建立 `engine` 或 `tires`。
它只是使用它們。

<div class="l-sub-section">

這個範例利用了 TypeScript 的建構子語法，
同時宣告參數與屬性。

</div>

現在你只要將引擎與輪胎傳給建構子，就能建立一輛車。

<code-example path="dependency-injection/src/app/car/car-creations.ts" region="car-ctor-instantiation" linenums="false">
</code-example>

是不是很酷？
`engine` 與 `tire` 依賴的定義
已與 `Car` 類別解耦。
你可以傳入任何你喜歡的 `engine` 或 `tires`，只要它們
符合 `engine` 或 `tires` 的一般 API 要求即可。

現在，如果有人擴充了 `Engine` 類別，那也不是 `Car` 的問題。

<div class="l-sub-section">

`Car` 的_消費者_才有這個問題。消費者必須把建立汽車的程式碼更新成
像這樣：

<code-example path="dependency-injection/src/app/car/car-creations.ts" region="car-ctor-instantiation-with-param" linenums="false">

</code-example>

關鍵在於：`Car` 類別完全不需要改變。
你很快就會處理消費者的問題。

</div>

現在 `Car` 類別容易測試多了，因為你可以完全控制
它的依賴。
你可以把 mock 傳給建構子，讓它們在每個測試中確切地做你想讓它們做的事：

<code-example path="dependency-injection/src/app/car/car-creations.ts" region="car-ctor-instantiation-with-mocks" linenums="false">
</code-example>

**你剛學會了什麼是依賴注入**。

它是一種編碼模式，類別從外部
來源接收它的依賴，而不是自行建立它們。

很酷！但是那個可憐的消費者怎麼辦？
任何想要一輛 `Car` 的人現在
都必須建立全部三個部分：`Car`、`Engine` 與 `Tires`。
`Car` 類別把自己的問題甩給消費者承擔了。
你需要有個東西負責組裝這些部分。

你_可以_寫一個巨大的類別來做這件事：

<code-example path="dependency-injection/src/app/car/car-factory.ts" title="src/app/car/car-factory.ts">
</code-example>

現在只有三個建立方法，還不算太糟。
但隨著應用程式成長，維護它會變得非常棘手。
這個工廠將變成一張
由工廠方法互相依賴而成的巨大蜘蛛網！

如果你能簡單列出你想建置的東西，
而不必定義哪個依賴要注入到哪裡面，那不是很好嗎？

這就是依賴注入框架派上用場的地方。
想像框架有個叫做_注入器_的東西。
你向這個注入器註冊一些類別，它就會想出如何建立它們。

當你需要一輛 `Car` 時，你只要請注入器幫你取得它，就可以了。

<code-example path="dependency-injection/src/app/car/car-injector.ts" region="injector-call" title="src/app/car/car-injector.ts" linenums="false">
</code-example>

大家都贏。`Car` 對建立 `Engine` 或 `Tires` 一無所知。
消費者對建立 `Car` 一無所知。
你不必維護一個巨大的工廠類別。
`Car` 與消費者只要提出它們需要的東西，注入器就會交付。

這就是**依賴注入框架**的全部精髓。

現在你已知道什麼是依賴注入，也體會到它的好處，
接著請看 [Angular 依賴注入](guide/dependency-injection) 指南，了解它在 Angular 中如何實作。
