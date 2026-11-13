# Angular 路線圖

<p class="roadmap-last-updated">上次更新：2021-05-19</p>

Angular 收到了大量的功能需求，來自 Google 內部與更廣大的開放原始碼社群。同時，我們的專案清單中也有大量的維護工作、程式碼重構與潛在的效能改善。我們召集了開發者關係、產品管理與工程的代表，共同為這份清單排定優先順序。當新的專案進入佇列時，我們會定期依其相對於其他專案的優先順序來定位。隨著工作完成，專案會在佇列中往前移動。

下列專案並未與特定的 Angular 版本綁定。我們會在完成時發布它們，並依我們的版本發布時程、遵循語意化版本管理，將它們納入特定版本。例如，功能會在完成後的下一個次要版本中發布，如果包含破壞性變更，則會在下一個主要版本中發布。

## 進行中

### 以自動測試環境拆卸改善測試時間與除錯

為了改善測試時間並在測試之間建立更好的隔離，我們想將 <code>[TestBed](api/core/testing/TestBed)</code> 改為在每次測試執行後自動清理並拆卸測試環境。

### 淘汰並移除 IE11 支援

Internet Explorer 11 \(IE11\) 一直阻礙 Angular 善用 Web 平台的一些現代功能。在這個專案中，我們將淘汰並移除 IE11 支援，為長青瀏覽器提供的現代功能開闢道路。我們執行了一份 [RFC](https://github.com/angular/angular/issues/41840) 來收集社群回饋，並決定下一步的行動。

### 以 ES2017+ 作為預設輸出語言

支援現代瀏覽器讓我們能善用 JavaScript 更精簡、更具表現力且效能更好的新語法。在這個專案中，我們將調查阻礙我們推進這項工作的因素，並採取步驟來啟用它。

### 改造效能儀表板以偵測迴歸問題

我們有一組基準測試，會針對每次程式碼變更執行，以確保 Angular 符合我們的效能標準。為了確保框架的執行階段在程式碼變更後不致退步，我們需要改進儀表板所依賴的部分現有基礎設施。

### 整合 [MDC Web](https://material.io/develop/web/) 強化 Angular Material 元件

MDC Web 是 Google Material Design 團隊建立的函式庫，提供可重用的基礎元件，用於建立 Material Design 元件。Angular 團隊正在將這些基礎元件納入 Angular Material。使用 MDC Web 能讓 Angular Material 更貼近 Material Design 規範、擴充無障礙、改善元件品質，並提升我們團隊的速度。

### Angular 元件無障礙

我們正在根據 WCAG 等無障礙標準評估 Angular Material 中的元件，並致力於修正這個過程中發現的任何問題。

### 移除舊版 [View Engine](guide/ivy)

在我們所有的內部工具都轉換到 Ivy 之後，我們將移除舊版 View Engine，以降低 Angular 的概念負擔、縮小套件大小、降低維護成本與程式碼庫複雜度。

### 發布進階概念指南

開發並發布關於變更偵測的深入指南。開發 Angular 應用程式效能分析的內容。說明變更偵測如何與 Zone.js 互動、說明它何時被觸發、如何分析其持續時間，以及效能優化的常見實務。

### 更新我們的 e2e 測試策略

為了確保我們提供面向未來的 e2e 測試策略，我們想評估 Protractor 的現況、社群創新、e2e 最佳實務，並探索新的機會。作為這項工作的第一步，我們分享了一份 [RFC](https://github.com/angular/protractor/issues/5502)，並與合作夥伴合作，確保 Angular CLI 與最先進的 e2e 測試工具順利整合。下一步，我們需要敲定建議事項，並彙編一份轉換資源清單。

### Angular 函式庫使用 Ivy

在 2020 年初，我們分享了一份關於 Ivy 函式庫發行的 [RFC](https://github.com/angular/angular/issues/38366)。在獲得社群寶貴的回饋後，我們開發了這個專案的設計。我們現在正投入開發 Ivy 函式庫發行，包括將函式庫套件格式更新為使用 Ivy 編譯、解除 View Engine 函式庫格式的淘汰阻礙，以及 [ngcc](guide/glossary#ngcc)。

### 確保未來 RxJS 變更（第 7 版及以後）能順利採用

我們希望確保 Angular 開發者能善用 RxJS 的最新功能，並順利過渡到框架後續的主要版本。為此，我們將探索並記錄 v7 及之後 RxJS 變更的範圍，並規劃更新策略。

### 以可選的 NgModule 簡化 Angular 心智模型

為了簡化 Angular 的心智模型與學習歷程，我們將致力於讓 NgModule 成為可選項。這項工作讓開發者能開發獨立元件，並實作另一種 API 來宣告元件的編譯範圍。

## 未來

### 研究微前端架構以實現可擴充的開發流程

研究大規模應用程式的獨立可部署性與開發方式，以改善效率與生產力。Angular 社群已有一套成熟的微前端支援方案。作為這項工作的一部分，我們將研究應該提供哪些正確的抽象，以提供更好的支援。

### 透過 `@angular/forms` 的嚴格型別改善開發者人體工學

我們將致力於為反應式表單實作更嚴格的型別檢查。這樣一來，我們讓開發者在開發期間能發現更多問題、獲得更好的文字編輯器與 IDE 支援，並改善反應式表單的型別檢查。

### 透過 Zone.js 退出機制善用完整的框架功能

我們將設計並實作一份計劃，讓 Zone.js 在 Angular 應用程式中成為可選項。如此一來，我們能簡化框架、改善除錯，並縮小應用程式套件大小。此外，這也讓我們能善用內建的 async/await 語法，這是目前 Zone.js 不支援的。

### 透過將 ngc 作為 tsc 外掛程式發行來改善建置效能

將 Angular 編譯器作為 TypeScript 編譯器的外掛程式發行，將大幅改善開發者的建置效能，並降低維護成本。

### 支援在宿主元素上加入指令

一個由來已久的功能需求是加入在宿主元素上加入指令的能力。這項功能讓開發者不用繼承就能以額外的行為擴充自己的元件。這個專案在 API 定義、語意與實作方面都需要大量的工作。

### 符合人體工學的元件層級程式碼拆分 API

Web 應用程式常見的問題是初始載入速度緩慢。改善的方法之一，是在元件層級套用更細粒度的程式碼拆分。我們將致力於提供更符合人體工學的程式碼拆分 API，以鼓勵這種做法。

<details class="completed-details" open="true">
<summary>
  <h2>已完成</h2>
  <span class="actions">
    <span class="action-expand">全部展開</span>
    <span class="action-collapse">全部收合</span>
    <i class="material-icons expand">expand_more</i>
  </span>
</summary>
<div class="details-content">

### 以 Angular DevTools 加速除錯與效能分析

_已於 2021 年第二季完成_

我們正在開發 Angular 的開發工具，提供除錯與效能分析的公用程式。這個專案旨在幫助開發者理解 Angular 應用程式中的元件結構與變更偵測。

### 以整合的 Angular 版本管理與分支簡化版本發布

_已於 2021 年第二季完成_

我們希望整合多個 Angular GitHub 儲存庫（[angular/angular](https://github.com/angular/angular)、[angular/angular-cli](https://github.com/angular/angular-cli) 與 [angular/components](https://github.com/angular/components)）之間的版本發布管理工具。這項工作讓我們能重用基礎設施、統一並簡化流程，並改善版本發布流程的可靠性。

### 以提交訊息標準化提高開發者一致性

_已於 2021 年第二季完成_

我們希望統一 Angular 各儲存庫（[angular/angular](https://github.com/angular/angular)、[angular/components](https://github.com/angular/components) 與 [angular/angular-cli](https://github.com/angular/angular-cli)）的提交訊息需求與一致性，讓開發流程保持一致並重用基礎設施工具。

### 將 Angular 語言服務轉換到 Ivy

_已於 2021 年第二季完成_

這個專案的目標是改善體驗並移除舊版相依性，方法是將語言服務轉換到 Ivy。如今，即使是 Ivy 應用程式，語言服務仍使用 View Engine 編譯器與型別檢查。我們希望使用 Ivy 範本解析器與改進的型別檢查，讓 Angular 語言服務符合應用程式的行為。這次遷移也是解除移除 View Engine 阻礙的一步，這將簡化 Angular、縮小 npm 套件大小，並改善框架的可維護性。

### 以原生 [Trusted Types](https://web.dev/trusted-types/) 提高 Angular 的安全性

_已於 2021 年第二季完成_

我們與 Google 安全團隊合作，正在加入對新的 Trusted Types API 的支援。這個 Web 平台 API 能幫助開發者建立更安全的 Web 應用程式。

### 以 Angular CLI webpack 5 優化建置速度與套件大小

_已於 2021 年第二季完成_

在 v11 版本中，我們在 Angular CLI 中引入了 webpack 5 的選擇性預覽。為了確保穩定性，我們將繼續反覆改進實作，以提升建置速度與縮小套件大小。

### 在 Universal 應用程式中內嵌關鍵樣式以加快應用程式速度

_已於 2021 年第一季完成_

載入外部樣式表是一項阻擋操作，這表示瀏覽器必須載入所有參照的 CSS 後才能開始渲染你的應用程式。在頁面標頭中有會阻擋渲染的資源，會大幅影響其載入效能，例如其[首次內容繪製](https://web.dev/first-contentful-paint/)。為了讓應用程式更快，我們一直在與 Google Chrome 團隊合作，內嵌關鍵 CSS 並以非同步方式載入其餘樣式。

### 以更好的 Angular 錯誤訊息改善除錯

_已於 2021 年第一季完成_

錯誤訊息往往只能提供有限的可行動資訊，幫助開發者解決問題。我們一直致力於讓錯誤訊息更容易被發現，方法是加入相關代碼、開發指南與其他資料，以確保除錯體驗更順暢。

### 以更新的入門文件改善開發者上手體驗

_已於 2021 年第一季完成_

我們將重新定義使用者的學習歷程，並更新入門文件。我們將清楚說明 Angular 的優點、如何探索其功能，並提供指導，讓開發者能在最短時間內熟練使用框架。

### 擴充元件測試工具最佳實務

_已於 2021 年第一季完成_

Angular CDK 在第 9 版中向 Angular 引入了[元件測試工具](https://material.angular.io/cdk/test-harnesses)的概念。測試工具讓元件作者能為測試元件互動建立受支援的 API。我們正在持續改善這個測試工具基礎設施，並釐清使用測試工具的最佳實務。我們也在努力推動 Google 內部更廣泛地採用測試工具。

### 撰寫內容投影指南

_已於 2021 年第二季完成_

內容投影是 Angular 的核心概念，但在文件中卻沒有應有的篇幅。在這個專案中，我們想找出內容投影的核心使用情境與概念，並將其記錄下來。

### 遷移到 ESLint

_已於 2020 年第四季完成_

隨著 TSLint 被淘汰，我們將遷移到 ESLint。在這個過程中，我們將確保與目前建議的 TSLint 設定向下相容、為現有 Angular 應用程式實作遷移策略，並向 Angular CLI 工具鏈引入新的工具。

### Operation Bye Bye Backlog（又稱 Operation Byelog）

_已於 2020 年第四季完成_

我們正積極投入高達 50% 的工程產能來分類問題與 PR，直到我們清楚理解更廣泛的社群需求。之後，我們將投入高達 20% 的工程產能，及時處理新的提交。

</div>
</details>
