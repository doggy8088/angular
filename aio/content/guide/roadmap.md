# Angular 路線圖

<p class="roadmap-last-updated">上次更新：2023-05-03</p>

Angular 收到了許多功能需求，來自 Google 內部與更廣大的開放原始碼社群。
同時，我們的專案清單中也有大量的維護工作、程式碼重構與潛在的效能改善。
我們召集了開發者關係、產品管理與工程代表，共同為這份清單排定優先順序。
當新的專案進入佇列時，我們會定期依其相對於其他專案的優先順序來定位。
隨著工作完成，專案會在佇列中往前移動。

下列專案並未與特定的 Angular 版本綁定。我們會在完成時發布它們，並依我們的版本發布時程、遵循語意化版本管理，將它們納入特定版本。例如，我們會在功能完成後的下一個次要版本中發布它，如果包含破壞性變更，則會在下一個主要版本中發布。

## 進行中

### 探索水合與伺服器端渲染的改進

在 v16 中，我們發布了非破壞性完整水合的開發者預覽，更多資訊請參閱[水合指南](guide/hydration)與[部落格文章](https://blog.angular.io/whats-next-for-server-side-rendering-in-angular-2a6f27662b67)。我們已經看到 Core Web Vitals 顯著改善，包括 [LCP](https://web.dev/lcp) 與 [CLS](https://web.dev/cls)。在實驗室測試中，我們持續觀察到真實世界應用程式的 LCP 改善了 45%。

下一步，我們將持續打磨完整水合，並進一步探索部分水合與可恢復性這個動態發展的領域。這些更進階的模式各有取捨；我們會在進展過程中分享最新消息。

### 以新的反應式模型改善執行階段效能與開發者體驗

在 v16 中，我們分享了 Angular Signals 的開發者預覽，它完整實作了讓 Zone.js 成為可選項。這項功能源自數百次討論、與開發者的對話、回饋會議、使用者體驗研究，以及一系列 [RFC](https://github.com/angular/angular/discussions/49685)，共收到超過 1,000 則留言。在發布的同時，我們提供了 signals 函式庫與 RxJS 互通套件。接下來，在處理完開發者的回饋後，我們將繼續實作 RFC 中的提案。

### 探索符合人體工學的元件層級程式碼拆分 API

Web 應用程式常見的問題是初始載入速度緩慢。
改善的方法之一，是在元件層級套用更細粒度的程式碼拆分。
我們將致力於提供更符合人體工學的程式碼拆分 API，以鼓勵這種做法。

### 改善獨立元件的文件與原理圖

我們發布了 `ng new --standalone` 原理圖集合的開發者預覽，讓你可以建立不含 NgModule 的應用程式。接下來，我們將持續改進原理圖以補足功能缺口，並發布一份以獨立元件為基礎的新教學。

### 引入依賴注入除錯 API

為了改善 Angular 與 Angular DevTools 的除錯工具，我們將開發能存取依賴注入執行階段的 API。在這個專案中，我們將公開除錯方法，讓我們能探索注入器階層，以及各個關聯 provider 之間的相依性。截至 v16，我們已設計出能接入依賴注入生命週期的功能。下一步，我們將實作這項功能，並提供與 Angular DevTools 的整合。

### 以 Language Service 簡化獨立匯入

在這個計畫中，語言服務會在獨立式與 NgModule 式應用程式中自動匯入元件與管道。此外，為了讓應用程式的套件更小，我們將致力於讓語言服務能建議自動移除未使用的匯入。

### 研究現代化套件組合

在 Angular v16 中，我們發布了以 esbuild 為基礎的建置器的開發者預覽，支援 `ng build` 與 `ng serve`。`ng serve` 開發伺服器使用 Vite，以及 esbuild 與 Angular 編譯器的多檔案編譯。在將這項功能從開發者預覽畢業之前，下一步我們將致力於啟用國際化支援並修正穩定性問題。

### 新的 CDK 基礎元件

我們正在開發新的 CDK 基礎元件，以利根據 [Combobox](https://www.w3.org/TR/wai-aria-practices-1.1/#combobox) 的 WAI-ARIA 設計模式建立自訂元件。Angular v14 已將穩定的[選單與對話框基礎元件](https://material.angular.io/cdk/categories)納入這個專案，v15 則是 [Listbox](https://www.w3.org/TR/wai-aria-practices-1.1/#Listbox)。

### Angular 元件無障礙

我們正在根據 WCAG 等無障礙標準評估 Angular Material 中的元件，並致力於修正這個過程中發現的任何問題。

### 研究微前端架構以實現可擴充的開發流程

在過去幾個季度，我們已經理解並定義了問題的範圍。我們將跟進發表一篇關於大規模開發應用程式最佳實務的部落格文章。這個專案因為其他計畫的優先順序而延後了。

### 更新入門教學

在過去兩個季度，我們開發了一份以獨立元件為基礎的新影片與文字教學。它們正處於最終審查階段，我們預計在第二季結束前發布。

### 以權杖為基礎的主題 API

為了提供更好的 Angular Material 元件自訂能力，並啟用 Material 3 功能，我們將與 Google 的 Material Design 團隊合作，定義以權杖為基礎的主題 API。截至 2023 年第二季，我們正在重構元件以使用新的 API，敲定完整的權杖集合，並依據新的權杖更新 Sass API。

### 讓 Angular 的單元測試工具現代化

在 v12 中，我們以 Cypress、Nightwatch 與 Webdriver.io 等現代替代方案取代 Protractor，重新檢視了 Angular 的端對端測試體驗。接下來，我們想著手處理 `ng test`，讓 Angular 的單元測試體驗現代化。在第二季，我們引入了實驗性的 [Jest](https://jestjs.io/) 支援，並[宣布](https://blog.angular.io/moving-angular-cli-to-jest-and-web-test-runner-ef85ef69ceca)從 Karma 轉換到 [Web Test Runner](https://modern-web.dev/docs/test-runner/overview/)。

## 未來

### 研究撰寫格式的改進

根據開發者調查的結果，我們看到改善元件撰寫格式人體工學的機會。這個流程的第一步，是在提出 RFC 之前收集需求並理解問題範圍。我們會在取得進展時分享最新消息。未來工作的高度優先事項是向下相容性與互通性。

### 確保未來 RxJS 變更（第 8 版及以後）能順利採用

我們希望確保 Angular 開發者能善用 RxJS 的最新功能，並順利過渡到框架後續的主要版本。
為此，我們將探索並記錄 v7 及之後 RxJS 變更的範圍，並規劃更新策略。

### 支援二維拖放

在這個專案中，我們想為 Angular CDK 拖放功能實作混合方向支援。這是儲存庫中呼聲最高的[功能需求](https://github.com/angular/components/issues/13372)之一。

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

### 非破壞性完整應用程式水合

在 v16 中，我們發布了非破壞性完整水合的開發者預覽，它讓 Angular 能重用伺服器端渲染頁面上既有的 DOM 節點，而不是從頭重新建立應用程式。更多資訊請參閱[水合指南](guide/hydration)。

*已於 2023 年第二季完成*

### 圖片指令的改進

*已於 2023 年第一季完成*

我們在 v15 中將 Angular [圖片指令](https://developer.chrome.com/blog/angular-image-directive/)發布為穩定版。我們引入了新的 fill 模式功能，讓圖片能配合父層容器的大小，而不是使用明確的尺寸。在過去兩個月，Chrome Aurora 團隊已將該指令回溯移植到 v12 及更新版本。

### 文件重構

*已於 2023 年第一季完成*

確保所有現有文件都符合一致的內容類型集合。將過度使用教學風格的文件更新為獨立主題。我們希望確保主要教學之外的內容能夠自給自足，而不必緊密耦合於一系列指南。在 2022 年第二季，我們重構了[範本內容](https://github.com/angular/angular/pull/45897)與依賴注入。在 2023 年第一季，我們改善了 HTTP 指南，至此，我們將暫緩文件重構專案。

### 改善圖片效能

*已於 2022 年第四季完成*

[Aurora](https://web.dev/introducing-aurora/) 與 Angular 團隊正在實作一個旨在改善 [Core Web Vitals](https://web.dev/vitals) 的圖片指令。我們在 v15 中發布了穩定版的圖片指令。

### 現代 CSS

*已於 2022 年第四季完成*

Web 生態系不斷演進，我們希望在 Angular 中反映最新的現代標準。在這個專案中，我們的目標是提供在 Angular 中使用現代 CSS 功能的指南，確保開發者遵循版面配置、樣式等方面的最佳實務。我們分享了版面配置的官方指南，並在這個計畫中停止發布 flex 版面配置。請參閱我們的[部落格文章](https://blog.angular.io/modern-css-in-angular-layouts-4a259dca9127)瞭解更多。

### 支援在宿主元素上加入指令

*已於 2022 年第四季完成*

一個[由來已久的功能需求](https://github.com/angular/angular/issues/8785)是加入在宿主元素上加入指令的能力。這項功能讓開發者不用繼承就能以額外的行為擴充自己的元件。在 v15 中，我們發布了指令組合 API，能以指令增強宿主元素。

### 更好的堆疊追蹤

*已於 2022 年第四季完成*

Angular 與 Chrome DevTools 團隊正在合作，讓錯誤訊息的堆疊追蹤更易讀。在 v15 中，我們[發布了改進後](https://twitter.com/angular/status/1578807563017392128)的相關且具連結的堆疊追蹤。作為較低優先順序的計畫，我們將探索如何透過為範本提供更準確的呼叫框架名稱，讓堆疊追蹤更友善。

### 整合 MDC Web 強化 Angular Material 元件

*已於 2022 年第四季完成*

[MDC Web](https://material.io/develop/web) 是 Google Material Design 團隊建立的函式庫，提供可重用的基礎元件，用於建立 Material Design 元件。
Angular 團隊正在將這些基礎元件納入 Angular Material。
使用 MDC Web 能讓 Angular Material 更貼近 Material Design 規範、擴充無障礙、改善元件品質，並提升我們團隊的速度。

### 為可選的 NgModule 實作 API

*已於 2022 年第四季完成*

在讓 Angular 更簡單的過程中，我們正在開發[引入 API](/guide/standalone-components)，讓開發者不用 NgModule 也能初始化應用程式、建立元件實例並使用路由器。Angular v14 引入了獨立元件、指令與管道 API 的開發者預覽。在接下來的幾個季度，我們將收集開發者的回饋並敲定這個專案，讓 API 穩定下來。下一步，我們將致力於改善 `TestBed`、Angular elements 等使用情境。

### 允許在範本中繫結到受保護的欄位

*已於 2022 年第二季完成*

為了改善 Angular 元件的封裝，我們啟用了繫結到元件實例受保護成員的功能。這樣一來，你就不必再把欄位或方法公開，才能在範本中使用它們。

### 發布進階概念指南

*已於 2022 年第二季完成*

開發並發布關於變更偵測的深入指南。
開發 Angular 應用程式效能分析的內容。
說明變更偵測如何與 Zone.js 互動、說明它何時被觸發、如何分析其持續時間，以及效能優化的常見實務。

### 為 `@angular/forms` 推出嚴格型別

*已於 2022 年第二季完成*

在 2021 年第四季，我們設計了為表單引入嚴格型別的解決方案，並在 2022 年第一季完成了相應的[徵求意見](https://github.com/angular/angular/discussions/44513)。
目前，我們正在實作推廣策略，以自動化遷移步驟，讓現有專案也能獲得這些改進。
我們先在 Google 內部超過 2,500 個專案中測試這個解決方案，以確保外部社群能順利遷移。

### 移除舊版 [View Engine](guide/glossary#ve)

*已於 2022 年第一季完成*

在我們所有的內部工具都轉換到 Ivy 之後，我們將移除舊版 View Engine，以降低 Angular 的概念負擔、縮小套件大小、降低維護成本與程式碼庫複雜度。

### 以可選的 NgModule 簡化 Angular 心智模型

*已於 2022 年第一季完成*

為了簡化 Angular 的心智模型與學習歷程，我們將致力於讓 NgModule 成為可選項。
這項工作讓開發者能開發獨立元件，並實作另一種 API 來宣告元件的編譯範圍。
我們以高階設計討論啟動了這個專案，並將其記錄在 [RFC](https://github.com/angular/angular/discussions/43784) 中。

### 為 `@angular/forms` 設計嚴格型別

*已於 2022 年第一季完成*

我們將致力於找到一種方法，以最小的向下不相容影響，為反應式表單實作更嚴格的型別檢查。
這樣一來，我們讓開發者在開發期間能發現更多問題、獲得更好的文字編輯器與 IDE 支援，並改善反應式表單的型別檢查。

### 改善 Angular DevTools 與框架的整合

*已於 2022 年第一季完成*

為了改善 Angular DevTools 與框架的整合，我們正在將程式碼庫移至 [angular/angular](https://github.com/angular/angular) 單一儲存庫。
這包括將 Angular DevTools 轉換到 Bazel，並整合到現有的流程與 CI 管線中。

### 推出進階編譯器診斷

*已於 2022 年第一季完成*

將 Angular 編譯器的診斷擴充到型別檢查之外。
引入其他正確性與一致性檢查，以進一步保證正確性與最佳實務。

### 更新我們的 e2e 測試策略

*已於 2021 年第三季完成*

為了確保我們提供面向未來的 e2e 測試策略，我們想評估 Protractor 的現況、社群創新、e2e 最佳實務，並探索新的機會。
作為這項工作的第一步，我們分享了一份 [RFC](https://github.com/angular/protractor/issues/5502)，並與合作夥伴合作，確保 Angular CLI 與最先進的 e2e 測試工具順利整合。
下一步，我們需要敲定建議事項，並彙編一份轉換資源清單。

### Angular 函式庫使用 Ivy

*已於 2021 年第三季完成*

在 2020 年初，我們分享了一份關於 Ivy 函式庫發行的 [RFC](https://github.com/angular/angular/issues/38366)。
在獲得社群寶貴的回饋後，我們開發了這個專案的設計。
我們現在正投入開發 Ivy 函式庫發行，包括將函式庫套件格式更新為使用 Ivy 編譯、解除 View Engine 函式庫格式的淘汰阻礙，以及 ngcc。

### 以自動測試環境拆卸改善測試時間與除錯

*已於 2021 年第三季完成*

為了改善測試時間並在測試之間建立更好的隔離，我們想將 [`TestBed`](api/core/testing/TestBed) 改為在每次測試執行後自動清理並拆卸測試環境。

### 淘汰並移除 IE11 支援

*已於 2021 年第三季完成*

Internet Explorer 11 \(IE11\) 一直阻礙 Angular 善用 Web 平台的一些現代功能。
在這個專案中，我們將淘汰並移除 IE11 支援，為長青瀏覽器提供的現代功能開闢道路。
我們執行了一份 [RFC](https://github.com/angular/angular/issues/41840) 來收集社群回饋，並決定下一步的行動。

### 以 ES2017+ 作為預設輸出語言

*已於 2021 年第三季完成*

支援現代瀏覽器讓我們能善用 JavaScript 更精簡、更具表現力且效能更好的新語法。
在這個專案中，我們將調查阻礙我們推進這項工作的因素，並採取步驟來啟用它。

### 以 Angular DevTools 加速除錯與效能分析

*已於 2021 年第二季完成*

我們正在開發 Angular 的開發工具，提供除錯與效能分析的公用程式。
這個專案旨在幫助開發者理解 Angular 應用程式中的元件結構與變更偵測。

### 以整合的 Angular 版本管理與分支簡化版本發布

*已於 2021 年第二季完成*

我們希望整合多個 Angular GitHub 儲存庫（[angular/angular](https://github.com/angular/angular)、[angular/angular-cli](https://github.com/angular/angular-cli) 與 [angular/components](https://github.com/angular/components)）之間的版本發布管理工具。
這項工作讓我們能重用基礎設施、統一並簡化流程，並改善版本發布流程的可靠性。

### 以提交訊息標準化提高開發者一致性

*已於 2021 年第二季完成*

我們希望統一 Angular 各儲存庫（[angular/angular](https://github.com/angular/angular)、[angular/components](https://github.com/angular/components) 與 [angular/angular-cli](https://github.com/angular/angular-cli)）的提交訊息需求與一致性，讓開發流程保持一致並重用基礎設施工具。

### 將 Angular 語言服務轉換到 Ivy

*已於 2021 年第二季完成*

這個專案的目標是改善體驗並移除舊版相依性，方法是將語言服務轉換到 Ivy。
如今，即使是 Ivy 應用程式，語言服務仍使用 View Engine 編譯器與型別檢查。
我們希望使用 Ivy 範本解析器與改進的型別檢查，讓 Angular 語言服務符合應用程式的行為。
這次遷移也是解除移除 View Engine 阻礙的一步，這將簡化 Angular、縮小 npm 套件大小，並改善框架的可維護性。

### 以原生 Trusted Types 提高 Angular 的安全性

*已於 2021 年第二季完成*

我們與 Google 安全團隊合作，正在加入對新的 [Trusted Types](https://web.dev/trusted-types) API 的支援。
這個 Web 平台 API 能幫助開發者建立更安全的 Web 應用程式。

### 以 Angular CLI webpack 5 優化建置速度與套件大小

*已於 2021 年第二季完成*

在 v11 版本中，我們在 Angular CLI 中引入了 webpack 5 的選擇性預覽。
為了確保穩定性，我們將繼續反覆改進實作，以提升建置速度與縮小套件大小。

### 在 Universal 應用程式中內嵌關鍵樣式以加快應用程式速度

*已於 2021 年第一季完成*

載入外部樣式表是一項阻擋操作，這表示瀏覽器必須載入所有參照的 CSS 後才能開始渲染你的應用程式。
在頁面標頭中有會阻擋渲染的資源，會大幅影響其載入效能，例如其[首次內容繪製](https://web.dev/first-contentful-paint)。
為了讓應用程式更快，我們一直在與 Google Chrome 團隊合作，內嵌關鍵 CSS 並以非同步方式載入其餘樣式。

### 以更好的 Angular 錯誤訊息改善除錯

*已於 2021 年第一季完成*

錯誤訊息往往只能提供有限的可行動資訊，幫助開發者解決問題。
我們一直致力於讓錯誤訊息更容易被發現，方法是加入相關代碼、開發指南與其他資料，以確保除錯體驗更順暢。

### 以更新的入門文件改善開發者上手體驗

*已於 2021 年第一季完成*

我們將重新定義使用者的學習歷程，並更新入門文件。
我們將清楚說明 Angular 的優點、如何探索其功能，並提供指導，讓開發者能在最短時間內熟練使用框架。

### 擴充元件測試工具最佳實務

*已於 2021 年第一季完成*

Angular CDK 在第 9 版中向 Angular 引入了[元件測試工具](https://material.angular.io/cdk/test-harnesses)的概念。
測試工具讓元件作者能為測試元件互動建立受支援的 API。
我們正在持續改善這個測試工具基礎設施，並釐清使用測試工具的最佳實務。
我們也在努力推動 Google 內部更廣泛地採用測試工具。

### 撰寫內容投影指南

*已於 2021 年第二季完成*

內容投影是 Angular 的核心概念，但在文件中卻沒有應有的篇幅。
在這個專案中，我們想找出內容投影的核心使用情境與概念，並將其記錄下來。

### 遷移到 ESLint

*已於 2020 年第四季完成*

隨著 TSLint 被淘汰，我們將遷移到 ESLint。
在這個過程中，我們將確保與目前建議的 TSLint 設定向下相容、為現有 Angular 應用程式實作遷移策略，並向 Angular CLI 工具鏈引入新的工具。

### Operation Bye Bye Backlog（又稱 Operation Byelog）

*已於 2020 年第四季完成*

我們正積極投入高達 50% 的工程產能來分類問題與 PR，直到我們清楚理解更廣泛的社群需求。
之後，我們將投入高達 20% 的工程產能，及時處理新的提交。

 </div>
</details>

<!-- links -->

<!-- external links -->

<!-- end links -->

@reviewed 2023-05-03
