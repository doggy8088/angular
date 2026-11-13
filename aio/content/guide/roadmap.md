# Angular 路線圖

Angular 收到大量的功能請求，來自 Google 內部，也來自更廣大的開源社群。同時，我們的專案清單中也有許多維護工作、程式碼重構、潛在的效能改進等事項。我們召集開發者關係、產品管理與工程團隊的代表，一起為這份清單排定優先順序。當新專案進入佇列時，我們會定期依據它們與其他專案的相對優先級來安排位置。隨著工作完成，專案會在佇列中往前移動。

下列專案不與特定的 Angular 版本綁定。我們會在它們完成時發布，並依據我們的發布時程、遵循語意化版本，納入特定的版本中。例如，功能會在完成後隨下一個次版本發布；若包含破壞性變更，則隨下一個主版本發布。

## 進行中

### Operation Bye Bye Backlog（又稱 Operation Byelog）

我們正積極投入高達 50% 的工程人力，來分類處理 issue 與 PR，直到我們清楚了解更廣大社群的需求。在那之後，我們會承諾投入高達 20% 的工程人力，以即時跟上新的提交。

### 支援 TypeScript 4.0

我們正在努力，在 TypeScript 4.0 穩定版發布之前就加入對它的支援。我們一直希望 Angular 能跟上 TypeScript 的最新版本，讓開發者能享受到這個語言所提供的最佳功能。

### 更新我們的 e2e 測試策略

為了確保我們提供的端對端測試策略能因應未來，我們想要評估 Protractor 的現況、社群的創新、端對端最佳實務，並探索新的機會。

### Angular 函式庫使用 Ivy

我們正投入 Ivy 程式庫發布計畫的設計與開發，其中包括更新程式庫套件格式以使用 Ivy 編譯、解除 View Engine 程式庫格式淘汰的阻礙，以及 [ngcc](guide/glossary#ngcc)。

### 評估未來的 RxJS 變更（v7 及以後）

我們希望確保 Angular 開發者能充分運用 RxJS 的最新能力，並順利過渡到框架接下來的主版本。為此，我們將探索並記錄 RxJS v7 及之後版本的變更範圍，並規劃更新策略。

### Angular 語言服務使用 Ivy

目前語言服務即使對 Ivy 應用程式，仍使用 View Engine 編譯器與型別檢查。我們希望為 Angular 語言服務使用 Ivy 範本剖析器與改進的型別檢查，以符合應用程式的行為。這次遷移也將是解除移除 View Engine 阻礙的一步，進而簡化 Angular、減少 npm 套件大小，並改善框架的可維護性。

### 擴展元件測試工具的最佳實務

Angular CDK 在第 9 版中，將[元件測試工具](https://material.angular.io/cdk/test-harnesses)的概念引入 Angular。測試工具讓元件作者能建立受支援的 API，來測試元件互動。我們會持續改善這個測試工具基礎設施，並釐清使用測試工具的最佳實務。我們也致力於在 Google 內部推動更多測試工具的採用。

### 在 Angular 中支援原生 [Trusted Types](https://web.dev/trusted-types/)

我們正與 Google 的安全團隊合作，加入對新的 Trusted Types API 的支援。這個 Web 平台 API 將協助開發者建構更安全的 Web 應用程式。

### 將 [MDC Web](https://material.io/develop/web/) 整合進 Angular Material

MDC Web 是由 Google 的 Material Design 團隊建立的程式庫，提供可重複使用的基本元件，用於建構 Material Design 元件。Angular 團隊正將這些基本元件整合進 Angular Material。使用 MDC Web 將讓 Angular Material 更貼近 Material Design 規範、擴大無障礙支援、整體提升元件品質，並提高我們團隊的開發速度。

### 為 Google 工程師提供 Angular 與 Google 內部伺服器堆疊的更好整合

這是一個內部專案，為 Google 內部整合伺服器堆疊加入對 Angular 前端的支援。

### Angular 版本管理與分支

我們希望統一 Angular 多個 GitHub 儲存庫（[angular/angular](https://github.com/angular/angular)、[angular/angular-cli](https://github.com/angular/angular-cli) 與 [angular/components](https://github.com/angular/components)）之間的版本發布管理工具。這項工作將讓我們重複使用基礎設施、統一並簡化流程，並提升版本發布流程的可靠性。

## 未來

### 翻新入門文件

我們將重新定義使用者的學習歷程，並翻新入門文件。我們會清楚說明 Angular 的優勢、如何探索它的能力，並提供指引，讓開發者能在最短的時間內熟練使用這個框架。

### `@angular/forms` 的嚴格型別

我們將致力於為反應式表單實作更嚴格的型別檢查。如此一來，開發者能在開發階段發現更多問題、獲得更好的文字編輯器與 IDE 支援，並改善反應式表單的型別檢查。

### Angular CLI 中的 webpack 5

webpack 5 帶來了許多建置速度與套件大小方面的改進。為了讓 Angular 開發者能享用這些改進，我們將投入心力，將 Angular CLI 從已淘汰與已移除的 webpack API 中遷移出來。

### 提交訊息標準化

我們希望統一各 Angular 儲存庫（[angular/angular](https://github.com/angular/angular)、[angular/components](https://github.com/angular/components)、[angular/angular-cli](https://github.com/angular/angular-cli)）的提交訊息要求與遵循規範，為我們的開發流程帶來一致性，並重複使用基礎設施工具。

### 可選的 Zone.js

我們將設計並實施一個計畫，讓 Angular 應用程式可以選擇不使用 Zone.js。如此一來，我們能簡化框架、改善除錯，並減少應用程式套件大小。此外，這將讓我們能運用原生的 async/await 語法，而這正是目前 Zone.js 不支援的。

### 移除舊有的 [View Engine](guide/ivy)

在我們所有內部工具都轉移到 Ivy 之後，我們希望移除舊有的 View Engine，讓 Angular 的概念負擔更小、套件更小、維護成本更低，程式碼庫的複雜度也更低。

### Angular DevTools

我們正在開發 Angular 的開發工具，將提供除錯與效能分析的公用程式。這個專案旨在協助開發者理解 Angular 應用程式中的元件結構與變更偵測。

### 可選的 NgModules

為了簡化 Angular 的心智模型與學習歷程，我們將致力於讓 NgModule 變成可選的。這項工作將讓開發者能開發獨立元件，並實作另一套用於宣告元件編譯範圍的 API。

### 符合人體工學的元件層級程式碼拆分 API

Web 應用程式的一個常見問題是初始載入時間緩慢。改善的方法之一，是在元件層級套用更細粒度的程式碼分割。為了鼓勵這種做法，我們將致力於開發更符合人體工學的程式碼分割 API。

### 遷移至 ESLint

隨著 TSLint 被淘汰，我們將轉移到 ESLint。在這個過程中，我們將致力於確保與目前建議的 TSLint 設定向後相容、為現有的 Angular 應用程式實作遷移策略，並在 Angular CLI 工具鏈中引入新的工具。
