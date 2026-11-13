# Angular 路線圖

Angular 收到大量的功能請求，來自 Google 內部，也來自更廣大的開源社群。同時，我們的專案清單中也有許多維護工作、程式碼重構、潛在的效能改進等事項。我們召集開發者關係、產品管理與工程團隊的代表，一起為這份清單排定優先順序。當新專案進入佇列時，我們會定期依據它們與其他專案的相對優先級來安排位置。隨著工作完成，專案會在佇列中往前移動。

下列專案不與特定的 Angular 版本綁定。我們會在它們完成時發布，並依據我們的發布時程、遵循語意化版本，納入特定的版本中。例如，功能會在完成後隨下一個次版本發布；若包含破壞性變更，則隨下一個主版本發布。

## 進行中

### 在 Universal 應用程式中內嵌關鍵樣式，讓應用程式更快

載入外部樣式表是一項阻塞操作，也就是說，瀏覽器在載入所有被參照的 CSS 之前，無法開始渲染你的應用程式。頁面頭部中有會阻礙渲染的資源，會顯著影響它的載入效能，例如它的[首次內容繪製](https://web.dev/first-contentful-paint/)。為了讓應用程式更快，我們一直與 Google Chrome 團隊合作，將關鍵 CSS 內嵌，並以非同步方式載入其餘樣式。

### 以更好的 Angular 錯誤訊息改善除錯

錯誤訊息通常只提供有限的可操作資訊，難以協助開發者解決問題。我們一直致力於讓錯誤訊息更容易被找到，例如加入相關代碼、編寫指南與其他材料，以確保更順暢的除錯體驗。

### 改造效能儀表板以偵測迴歸問題

我們有一組基準測試，會針對每次程式碼變更執行，以確保 Angular 符合我們的效能標準。為了確保框架的執行階段在程式碼變更後不致退步，我們需要改進儀表板所依賴的部分現有基礎設施。

### 更新我們的 e2e 測試策略

為了確保我們提供的端對端測試策略能因應未來，我們想要評估 Protractor 的現況、社群的創新、端對端最佳實務，並探索新的機會。

### Angular 函式庫使用 Ivy

2020 年稍早，我們分享了 Ivy 程式庫發布的 [RFC](https://github.com/angular/angular/issues/38366)。在收到社群寶貴的回饋後，我們發展出了這個專案的設計。我們現在正投入 Ivy 程式庫發布的開發，包括更新程式庫套件格式以使用 Ivy 編譯、解除 View Engine 程式庫格式淘汰的阻礙，以及 [ngcc](https://angular.io/guide/glossary#ngcc)。

### 確保未來 RxJS 變更（第 7 版及以後）能順利採用

我們希望確保 Angular 開發者能充分運用 RxJS 的最新能力，並順利過渡到框架接下來的主版本。為此，我們將探索並記錄 RxJS v7 及之後版本的變更範圍，並規劃更新策略。

### 將 Angular 語言服務轉移到 Ivy

這個專案的目標是透過將語言服務轉移到 Ivy，改善使用體驗並移除舊有的相依性。目前語言服務即使對 Ivy 應用程式，仍使用 View Engine 編譯器與型別檢查。我們希望為 Angular 語言服務使用 Ivy 範本剖析器與改進的型別檢查，以符合應用程式的行為。這次遷移也將是解除移除 View Engine 阻礙的一步，進而簡化 Angular、減少 npm 套件大小，並改善框架的可維護性。

### 在 Angular 中原生支援 [Trusted Types](https://web.dev/trusted-types/)，提升安全性

我們正與 Google 的安全團隊合作，加入對新的 Trusted Types API 的支援。這個 Web 平台 API 將協助開發者建構更安全的 Web 應用程式。

### 整合 [MDC Web](https://material.io/develop/web/) 強化 Angular Material 元件

MDC Web 是由 Google 的 Material Design 團隊建立的程式庫，提供可重複使用的基本元件，用於建構 Material Design 元件。Angular 團隊正將這些基本元件整合進 Angular Material。使用 MDC Web 將讓 Angular Material 更貼近 Material Design 規範、擴大無障礙支援、提升元件品質，並提高我們團隊的開發速度。

### 為 Google 工程師提供 Angular 與 Google 內部伺服器堆疊的更好整合

這是一個內部專案，為 Google 內部整合伺服器堆疊加入對 Angular 前端的支援。

### 以統一的 Angular 版本管理與分支策略，簡化版本發布

我們希望統一 Angular 多個 GitHub 儲存庫（[angular/angular](https://github.com/angular/angular)、[angular/angular-cli](https://github.com/angular/angular-cli) 與 [angular/components](https://github.com/angular/components)）之間的版本發布管理工具。這項工作將讓我們重複使用基礎設施、統一並簡化流程，並提升版本發布流程的可靠性。

### 以 Angular CLI webpack 5 最佳化建置速度與套件大小

在 v11 版本中，我們在 Angular CLI 中引入了可選擇啟用的 webpack 5 預覽。為了確保穩定性，我們會持續迭代這個實作，以實現建置速度與套件大小的改進。

### 以提交訊息標準化，提高開發者之間的一致性

我們希望統一各 Angular 儲存庫（[angular/angular](https://github.com/angular/angular)、[angular/components](https://github.com/angular/components)、[angular/angular-cli](https://github.com/angular/angular-cli)）的提交訊息要求與遵循規範，為我們的開發流程帶來一致性，並重複使用基礎設施工具。

### 以 Angular DevTools 加速除錯與效能分析

我們正在開發 Angular 的開發工具，將提供除錯與效能分析的公用程式。這個專案旨在協助開發者理解 Angular 應用程式中的元件結構與變更偵測。

### 以翻新的入門文件，改善開發者的上手體驗

我們將重新定義使用者的學習歷程，並翻新入門文件。我們會清楚說明 Angular 的優勢、如何探索它的能力，並提供指引，讓開發者能在最短的時間內熟練使用這個框架。

## 未來

### 透過 `@angular/forms` 的嚴格型別改善開發者人體工學

我們將致力於為反應式表單實作更嚴格的型別檢查。如此一來，開發者能在開發階段發現更多問題、獲得更好的文字編輯器與 IDE 支援，並改善反應式表單的型別檢查。

### 透過 Zone.js 退出機制善用完整的框架功能

我們將設計並實施一個計畫，讓 Angular 應用程式可以選擇不使用 Zone.js。如此一來，我們能簡化框架、改善除錯，並減少應用程式套件大小。此外，這將讓我們能運用原生的 async/await 語法，而這正是目前 Zone.js 不支援的。

### 移除舊有的 [View Engine](https://angular.io/guide/ivy)，減少框架的額外負擔

在我們所有內部工具都轉移到 Ivy 之後，我們希望移除舊有的 View Engine，讓 Angular 的概念負擔更小、套件更小、維護成本更低，程式碼庫的複雜度也更低。

### 以自動拆解測試環境，改善測試時間與除錯

為了改善測試時間，並在各測試之間建立更好的隔離，我們希望變更 `TestBed`，讓它在每次測試執行後自動清理並拆解測試環境。

### 透過將 ngc 作為 tsc 外掛程式發行來改善建置效能

將 Angular 編譯器作為 TypeScript 編譯器的外掛程式發行，將大幅改善開發者的建置效能，並降低維護成本。

### 支援在宿主元素上加入指令

一個存在已久的功能請求，是加入將指令加到宿主元素的能力。這個功能將讓開發者不用繼承，也能為自己的元件增添額外的行為。這個專案在 API 定義、語意與實作方面，都需要相當大的投入。

### 以可選的 NgModule 簡化 Angular 心智模型

為了簡化 Angular 的心智模型與學習歷程，我們將致力於讓 NgModule 變成可選的。這項工作將讓開發者能開發獨立元件，並實作另一套用於宣告元件編譯範圍的 API。

### 符合人體工學的元件層級程式碼拆分 API

Web 應用程式的一個常見問題是初始載入時間緩慢。改善的方法之一，是在元件層級套用更細粒度的程式碼分割。為了鼓勵這種做法，我們將致力於開發更符合人體工學的程式碼分割 API。
