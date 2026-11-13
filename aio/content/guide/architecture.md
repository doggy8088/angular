# Angular 概念簡介

Angular 是一個使用 HTML 與 TypeScript 建立單頁用戶端應用程式的平台與框架。
Angular 是以 TypeScript 撰寫的。
它將核心功能與選用功能實作為一組 TypeScript 函式庫，供你匯入應用程式中使用。

Angular 應用程式的架構建立在一些基本概念之上。Angular 框架的基本建構區塊，是組織成 *NgModules* 的 Angular 元件。NgModules 將相關程式碼收集成功能集合；一個 Angular 應用程式由一組 NgModules 定義。應用程式一定至少有一個*根模組*來啟用啟動程序，而且通常還有許多*功能模組*。

* 元件定義*檢視*，檢視是一組畫面元素，Angular 可以根據你的程式邏輯與資料，在其中選擇並修改。

* 元件使用*服務*，服務提供與檢視沒有直接關係的特定功能。服務提供者可以作為*依賴*被*注入*元件，讓你的程式碼模組化、可重用且有效率。

模組、元件與服務都是使用*裝飾器*的類別。這些裝飾器標示它們的型別，並提供中繼資料，告訴 Angular 如何使用它們。

* 元件類別的中繼資料將其與定義檢視的*範本*關聯起來。範本結合了一般 HTML 與 Angular *指令*和*繫結標記*，讓 Angular 能在渲染 HTML 以供顯示之前先修改它。

* 服務類別的中繼資料提供 Angular 所需的資訊，讓它能透過*依賴注入 (DI)* 將服務提供給元件使用。

應用程式的元件通常定義許多檢視，並以階層方式排列。Angular 提供 `Router` 服務，協助你定義檢視之間的導覽路徑。路由器提供精密的瀏覽器內導覽功能。

<div class="alert is-helpful">

  關於重要 Angular 術語與用法的基本定義，請見 [Angular 詞彙表](guide/glossary)。

</div>

<div class="alert is-helpful">

  關於本頁描述的範例應用程式，請見 <live-example></live-example>。
</div>

## 模組

Angular *NgModules* 與 JavaScript (ES2015) 模組不同，但兩者相輔相成。NgModule 為一組元件宣告編譯情境，該組元件專屬於某個應用程式領域、工作流程或一組密切相關的功能。NgModule 可以將其元件與相關程式碼（例如服務）關聯起來，形成功能單元。

每個 Angular 應用程式都有一個*根模組*，依慣例命名為 `AppModule`，它提供啟動應用程式的啟動機制。應用程式通常包含許多功能模組。

與 JavaScript 模組一樣，NgModules 可以從其他 NgModules 匯入功能，也可以讓自己的功能被匯出並供其他 NgModules 使用。例如，若要在應用程式中使用路由器服務，你可以匯入 `Router` NgModule。

將程式碼組織成不同的功能模組，有助於管理複雜應用程式的開發，以及設計可重用性。此外，這種技巧讓你能利用*延遲載入*&mdash;也就是按需載入模組&mdash;來盡量減少啟動時需要載入的程式碼量。

<div class="alert is-helpful">

  更詳細的討論，請見[模組簡介](guide/architecture-modules)。

</div>

## 元件

每個 Angular 應用程式至少有一個元件，即*根元件*，它將元件階層與頁面的文件物件模型 (DOM) 連接起來。每個元件定義一個包含應用程式資料與邏輯的類別，並與定義要在目標環境中顯示之檢視的 HTML *範本*相關聯。

`@Component()` 裝飾器將緊接在其下方的類別標示為元件，並提供範本與相關的元件專屬中繼資料。

<div class="alert is-helpful">

   裝飾器是修改 JavaScript 類別的函式。Angular 定義了許多裝飾器，將特定種類的中繼資料附加到類別上，讓系統知道這些類別的意義以及它們應如何運作。

   <a href="https://medium.com/google-developers/exploring-es7-decorators-76ecb65fb841#.x5c2ndtx0">在網路上進一步了解裝飾器。</a>

</div>

### 範本、指令與資料繫結

範本結合 HTML 與 Angular 標記，可以在 HTML 元素顯示之前先修改它們。
範本*指令*提供程式邏輯，而*繫結標記*連接你的應用程式資料與 DOM。
資料繫結有兩種類型：

* *事件繫結*讓應用程式透過更新應用程式資料，來回應目標環境中的使用者輸入。
* *屬性繫結*讓你將根據應用程式資料計算出的值，內插到 HTML 中。

在顯示檢視之前，Angular 會評估指令並解析範本中的繫結語法，根據你的程式資料與邏輯來修改 HTML 元素與 DOM。Angular 支援*雙向資料繫結*，意思是 DOM 中的變更（例如使用者的選擇）也會反映在你的程式資料中。

你的範本可以使用*管道*，透過轉換要顯示的值來改善使用者體驗。
例如，使用管道來顯示適合使用者地區設定的日期與貨幣值。
Angular 為常見的轉換提供預先定義的管道，你也可以定義自己的管道。

<div class="alert is-helpful">

  關於這些概念的更詳細討論，請見[元件簡介](guide/architecture-components)。

</div>

{@a dependency-injection}


## 服務與依賴注入

對於與特定檢視無關、且你想在元件之間共用的資料或邏輯，你可以建立一個*服務*類別。服務類別定義的前面緊接著 `@Injectable()` 裝飾器。該裝飾器提供的中繼資料，讓其他提供者能以依賴的形式被**注入**你的類別。

 *依賴注入* (DI) 讓你保持元件類別精簡且有效率。它們不會從伺服器擷取資料、驗證使用者輸入，或直接記錄到主控台；它們會將這類任務委派給服務。

<div class="alert is-helpful">

  更詳細的討論，請見[服務與 DI 簡介](guide/architecture-services)。

</div>

### 路由

Angular `Router` NgModule 提供一項服務，讓你定義應用程式中不同應用程式狀態與檢視階層之間的導覽路徑。它的模型來自熟悉的瀏覽器導覽慣例：

* 在網址列中輸入 URL，瀏覽器就會導覽到對應的頁面。

* 點選頁面上的連結，瀏覽器就會導覽到新頁面。

* 點選瀏覽器的上一頁與下一頁按鈕，瀏覽器就會在你看過的頁面歷史記錄中前後導覽。

路由器將類似 URL 的路徑對應到檢視，而非頁面。當使用者執行動作（例如點選連結），原本會在瀏覽器中載入新頁面時，路由器會攔截瀏覽器的行為，並顯示或隱藏檢視階層。

如果路由器判斷目前的應用程式狀態需要特定功能，而定義該功能的模組尚未載入，路由器可以按需*延遲載入*該模組。

路由器會根據應用程式的檢視導覽規則與資料狀態來解譯連結 URL。當使用者點選按鈕或從下拉式方塊中選取，或回應來自任何來源的其他刺激時，你可以導覽到新的檢視。路由器會在瀏覽器歷史記錄中記錄活動，因此上一頁與下一頁按鈕也能正常運作。

若要定義導覽規則，你可以將*導覽路徑*與元件關聯起來。路徑使用類似 URL 的語法，將你的程式資料整合進來，就像範本語法將你的檢視與程式資料整合一樣。然後你可以套用程式邏輯，根據使用者輸入與你自己的存取規則，選擇要顯示或隱藏哪些檢視。

<div class="alert is-helpful">

  更詳細的討論，請見[路由與導覽](guide/router)。

</div>


## 後續步驟

你已經了解 Angular 應用程式主要建構區塊的基礎知識。下圖顯示這些基本部分之間的關係。

<div class="lightbox">
  <img src="generated/images/guide/architecture/overview2.png" alt="總覽">
</div>

* 元件與範本共同定義一個 Angular 檢視。
  * 元件類別上的裝飾器會加入中繼資料，包括指向相關範本的指標。
  * 元件範本中的指令與繫結標記會根據程式資料與邏輯來修改檢視。
* 依賴注入器向元件提供服務，例如讓你定義檢視之間導覽的路由器服務。

以下頁面將更詳細地介紹這些主題。

* [模組簡介](guide/architecture-modules)

* [元件簡介](guide/architecture-components)

  * [範本與檢視](guide/architecture-components#範本與檢視)

  * [元件中繼資料](guide/architecture-components#元件中繼資料)

  * [資料繫結](guide/architecture-components#資料繫結)

  * [指令](guide/architecture-components#指令)

  * [管道](guide/architecture-components#管道)

* [服務與依賴注入簡介](guide/architecture-services)

當你熟悉這些基本建構區塊後，可以在文件中進一步探索它們。若要了解更多可協助你建置與部署 Angular 應用程式的工具與技巧，請見[後續步驟：工具與技巧](guide/architecture-next-steps)。
</div>
