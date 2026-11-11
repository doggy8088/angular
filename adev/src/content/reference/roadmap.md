<docs-decorative-header title="Angular 藍圖" imgSrc="adev/src/assets/images/roadmap.svg"> <!-- markdownlint-disable-line -->
了解 Angular 團隊如何為 Web 蓄積動能。
</docs-decorative-header>

身為一個開源專案，Angular 每日的提交、PR 與動能都可以在 GitHub 上追蹤。為了讓這份日常工作如何與框架的未來相連更加透明，我們的藍圖彙整了團隊目前與未來規劃的願景。

下列專案並未與特定的 Angular 版本綁定。我們會在完成時發布它們，並依我們的版本發布時程、遵循語意化版本管理，將它們納入特定版本。例如，我們會在功能完成後的下一個次要版本中發布它，如果包含破壞性變更，則會在下一個主要版本中發布。

目前，Angular 對框架有兩個目標：

1. 改善 [Angular 開發者體驗](#improving-the-angular-developer-experience)，以及
2. 改善[框架的效能](#fast-by-default)。

繼續閱讀，了解我們打算如何透過具體的專案工作來實現這些目標。

## 探索現代 Angular

開始使用我們藍圖中最新的 Angular 功能進行開發。這份清單代表我們藍圖中新功能的目前狀態：

### 可供實驗

* [探索 Angular Signals](guide/signals)
* [SSR 事件重播](https://angular.dev/api/platform-browser/withEventReplay)
* [無 Zone 變更偵測](https://angular.dev/guide/experimental/zoneless)
* [i18n 區塊的水合支援](https://angular.dev/api/platform-browser/withI18nSupport)

### 已可投入生產環境

* [水合](guide/hydration)
* [可延遲檢視](https://angular.dev/guide/defer)
* [內建控制流程](https://angular.dev/guide/templates/control-flow)
* [將你的 Angular Material 遷移到 MDC](https://material.angular.io/guide/mdc-migration)
* [Angular Material 3](https://material.angular.io/guide/theming)
* [遷移到獨立 API](reference/migrations/standalone)
* [以 NgOptimizedImage 改善圖片效能](guide/image-optimization)
* [試用 Inject](/tutorials/learn-angular/20-inject-based-di)
* [新的 CDK 指令](https://material.angular.io/cdk/categories)

## 改善 Angular 開發者體驗 {#improving-the-angular-developer-experience}

### 開發速度

<docs-card-container>
  <docs-card title="交付 Angular Signals" href="https://github.com/angular/angular/discussions/49685">
  這個專案透過引入 Signals 作為反應性原語，重新思考 Angular 的反應性模型。初步規劃產生了數百場討論、與開發者的對話、回饋會議、使用者體驗研究，以及一系列收到超過 1,000 則留言的 RFC。

  在 v17 發布中，我們將 Angular Signals 函式庫從開發者預覽提升為正式功能。在 v18 中，你現在可以在開發者預覽中使用基於訊號的查詢、輸入與模型輸入。接下來，我們會在將這些 API 提升為穩定版之前，持續回應社群回饋，並將訊號更深入地整合到 Angular 的變更偵測機制中。
  </docs-card>
  <docs-card title="Zoneless Angular" href="">
  在 v18 中，我們在 Angular 中推出了實驗性的無 Zone 支援。它讓開發者在使用框架時，不必在套件中包含 zone.js，這改善了效能、除錯體驗與互通性。作為初步發布的一部分，我們也為 Angular CDK 與 Angular Material 引入了無 Zone 支援。

  下一步，我們會持續迭代這個 API，以改善開發者體驗。
  </docs-card>
  <docs-card title="區域範本變數" href="https://github.com/angular/angular/issues/15280">
  區域範本變數是 Angular 議題追蹤器中最受投票支持的功能之一。在 2024 年第 2 季，我們開始了初步設計與原型開發。敬請期待 2024 年稍晚的更新。
  </docs-card>
</docs-card-container>

### 改善 Angular Material 與 CDK

<docs-card-container>
  <docs-card title="新的 CDK 原語" href="">
  我們正在開發新的 CDK 原語，以方便依據 WAI-ARIA 設計模式建立自訂元件，例如 [Combobox](https://www.w3.org/TR/wai-aria-practices-1.1/#combobox)。Angular v14 作為這個專案的一部分，推出了穩定的 [menu 與 dialog 原語](https://material.angular.io/cdk/categories)，並在 v15 推出了 Listbox。
  </docs-card>
  <docs-card title="Angular 元件無障礙" href="">
  我們正在以 WCAG 等無障礙標準評估 Angular Material 中的元件，並努力修正這個過程中出現的任何問題。
  </docs-card>
</docs-card-container>

### 改善工具

<docs-card-container>
  <docs-card title="以 `ng test` 將單元測試工具現代化" href="">
  在 v12 中，我們重新檢視了 Angular 的端對端測試體驗，以 Cypress、Nightwatch 與 Webdriver.io 等現代替代方案取代 Protractor。接下來，我們想著手處理 `ng test`，將 Angular 的單元測試體驗現代化。在 2023 年第 2 季，我們引入了實驗性的 [Jest](https://jestjs.io/) 支援，並[宣布](https://blog.angular.dev/moving-angular-cli-to-jest-and-web-test-runner-ef85ef69ceca)從 Karma 轉換到 [Web Test Runner](https://modern-web.dev/docs/test-runner/overview/)。

  今年稍晚，我們會持續推進，引入 Web Test Runner 作為 Karma 的替代方案。
  </docs-card>
  <docs-card title="以 Language Service 簡化獨立模式的匯入" href="">
  作為這項倡議的一部分，語言服務會在獨立模式與基於 NgModule 的應用程式中，自動匯入元件與管道。此外，為了讓應用程式套件更小，我們會著手讓語言服務能提議自動移除未使用的匯入。
  </docs-card>
</docs-card-container>

## 預設即快速 {#fast-by-default}

<docs-card-container>
  <docs-card title="部分水合的探索" href="">
  在 v17 中，我們將水合從開發者預覽提升為正式功能，並且持續觀察到 LCP 有 40 到 50% 的改善。自此之後，我們開始原型開發部分水合，並在 ng-conf 的舞台上分享了展示。敬請期待 2024 年的實驗性支援。
  </docs-card>
  <docs-card title="SSR 與預先渲染的事件重播" href="https://angular.dev/api/platform-browser/withEventReplay">
  在 v18 中，我們在使用伺服器端渲染或預先渲染時引入了事件重播功能。為了這項功能，我們依賴在 Google.com 上執行的事件分派原語（先前稱為 jsaction）。

  在接下來的幾個月裡，我們會收集社群對這項功能的回饋，並努力將它提升為穩定版。
  </docs-card>
  <docs-card title="伺服器路由設定" href="">
  我們正在努力讓伺服器上的路由設定更符合人體工學。我們希望讓宣告哪些路由應該伺服器端渲染、預先渲染或用戶端渲染變得輕而易舉。

  目前，我們還處於早期設計與原型開發階段。敬請期待 2024 年稍晚的更新。
  </docs-card>
</docs-card-container>

## 未來工作、探索與原型開發

本節呈現對潛在未來專案的探索與原型開發。一個合理的結果，是決定我們目前的解決方案就是最佳選項。其他專案可能會產生 RFC、提升為進行中的專案，或隨著 Web 與我們的框架持續創新而被降低優先順序。

<docs-card-container>
  <docs-card title="在 Angular DevTools 中除錯 Signal" href="">
  隨著 Signals 在 Angular 中的演進，我們也會著手為除錯它們打造更好的工具。優先名單的前列是一個用來檢視與除錯基於 Signal 的元件的 UI。
  </docs-card>
  <docs-card title="改善 HMR (Hot Module Reload)" href="https://github.com/angular/angular/issues/39367#issuecomment-1439537306">
  Angular CLI 目前透過 `ng serve --hmr` 支援 HMR。在其內部，它大多是從頭重新算繪 Angular 應用程式，這比整頁重新載入好，但肯定還有改善空間。最重要的是，我們在這裡的策略應該是：針對任何特定變更，依其發生頻率來最佳化周轉時間。未來，我們的團隊將探索許多改善 HMR 的機會，包括：

- 快速處理僅 CSS 的變更，並將它們套用到頁面上任何既有的元件。
- 快速處理僅 Angular 範本的變更，並將它們套用到頁面上任何既有的元件。
  </docs-card>
  <docs-card title="串流伺服器端渲染的探索" href="">
  在過去幾個版本中，我們一直致力於讓 Angular 的伺服器端渲染故事更加完備。在我們的優先名單上，是探索為無 Zone 應用程式提供串流伺服器端渲染。
  </docs-card>
  <docs-card title="撰寫格式改善的調查" href="">
  根據我們的開發者調查結果，我們看到改善元件撰寫格式人體工學的機會。這個過程的第一步，將是收集需求，並在提出 RFC 之前先了解問題空間。我們會在有進展時分享最新消息。未來工作中的高優先事項，將是向後相容性與互通性。
  </docs-card>
  <docs-card title="支援二維拖放" href="https://github.com/angular/components/issues/13372">
  作為這個專案的一部分，我們想為 Angular CDK 的拖放功能實作混合方向支援。這是該儲存庫最受請求的功能之一。
  </docs-card>
  <docs-card title="評估 Angular CLI 對 Nitro 的支援" href="https://nitro.unjs.io/">
  我們對 Nitro 提供的一系列功能感到興奮，例如可攜性、極簡設計，以及以檔案為基礎的路由。今年稍晚，我們將評估它如何融入 Angular 的伺服器端渲染模型。

  我們會在這項調查有進展時分享最新消息。
  </docs-card>
</docs-card-container>

## 已完成的專案

<docs-card-container>
  <docs-card title="擴充 Angular Material 的可自訂性" link="2024 年第 2 季完成" href="https://material.angular.io/guide/theming">
  為了提供我們 Angular Material 元件更好的自訂能力並啟用 Material 3 的能力，我們將與 Google 的 Material Design 團隊合作，定義以權杖（token）為基礎的主題 API。

  在 v17.2 中，我們分享了 Angular Material 3 的實驗性支援，並在 v18 中將它提升為穩定版。
  </docs-card>
  <docs-card title="引入延遲載入" link="2024 年第 2 季完成" href="https://next.angular.dev/guide/defer">
  在 v17 中，我們推出了開發者預覽版的可延遲檢視，它提供符合人體工學的 API 來延遲載入程式碼。在 v18 中，我們為函式庫開發者啟用了可延遲檢視，並將該 API 提升為穩定版。
  </docs-card>
  <docs-card title="Angular DevTools 的 iframe 支援" link="2024 年第 2 季完成" href="">
  我們已啟用對嵌入在頁面中 iframe 內的 Angular 應用程式進行除錯與效能分析。
  </docs-card>
  <docs-card title="將現有混合渲染專案轉移到 esbuild 與 vite 的自動化" link="2024 年第 2 季完成" href="tools/cli/build-system-migration">
  在 v17 中，我們推出了以 vite 與 esbuild 為基礎的應用程式建置器，並為新專案預設啟用它。它將使用混合渲染的專案建置時間改善了高達 87%。作為 v18 的一部分，我們推出了原理圖與指南，將使用混合渲染的現有專案遷移到新的建置管線。
  </docs-card>
  <docs-card title="讓 Angular.dev 成為 Angular 開發者的官方首頁" link="2024 年第 2 季完成" href="https://goo.gle/angular-dot-dev">
  Angular.dev 是 Angular 開發的新網站、網域與首頁。新網站包含更新過的文件、教學與指引，將協助開發者使用 Angular 的最新功能進行建置。
  </docs-card>
  <docs-card title="引入內建控制流程" link="2024 年第 2 季完成" href="https://next.angular.dev/essentials/conditionals-and-loops">
  在 v17 中，我們推出了新控制流程的開發者預覽版。它為範本撰寫帶來顯著的效能改善與更好的人體工學。我們也提供了既有 `*ngIf`、`*ngFor` 與 `*ngSwitch` 的遷移，你可以執行它，將專案移轉到新的實作。截至 v18，內建控制流程現在已是穩定版。
  </docs-card>
  <docs-card title="讓入門教學現代化" link="2023 年第 4 季完成" href="">
  在過去兩季中，我們基於獨立元件，開發了新的[影片](https://www.youtube.com/watch?v=xAT0lHYhHMY&list=PL1w1q3fL4pmj9k1FrJ3Pe91EPub2_h4jF)與[文字版](https://angular.dev/tutorials/learn-angular)教學。
  </docs-card>
  <docs-card title="研究現代打包工具" link="2023 年第 4 季完成" href="guide/hydration">
  在 Angular v16 中，我們發布了以 esbuild 為基礎之建置器的開發者預覽，支援 `ng build` 與 `ng serve`。`ng serve` 開發伺服器使用 Vite，以及 esbuild 與 Angular 編譯器的多檔案編譯。在 v17 中，我們將建置工具從開發者預覽提升為正式功能，並為新專案預設啟用它。
  </docs-card>
  <docs-card title="引入依賴注入除錯 API" link="2023 年第 4 季完成" href="tools/devtools">
  為了改善除錯公用程式與 Angular DevTools，我們將著手開發能存取依賴注入執行期的 API。作為這個專案的一部分，我們將公開除錯方法，讓我們能探索注入器階層以及跨其相關提供者的相依性。截至 v17，我們推出了能讓我們接入依賴注入生命週期的功能。我們也推出了注入器樹的視覺化呈現，以及對每個個別節點內宣告的提供者進行檢查，
  </docs-card>
  <docs-card title="改善獨立元件的文件與原理圖" link="2023 年第 4 季完成" href="components">
  我們發布了 `ng new --standalone` 原理圖集合的開發者預覽，讓你可以建立沒有 NgModules 的應用程式。在 v17 中，我們將新的應用程式撰寫格式切換為獨立 API，並變更文件以反映這項建議。此外，我們推出了支援將現有應用程式更新為獨立元件、指令與管道的原理圖。儘管 NgModules 在可預見的未來仍會存在，我們仍建議你探索新 API 的好處，以改善開發者體驗，並受益於我們為它們建置的新功能。
  </docs-card>
  <docs-card title="探索水合與伺服器端渲染的改進" link="2023 年第 4 季完成">
  在 v16 中，我們發布了非破壞性完整水合的開發者預覽，詳情請參閱[水合指南](guide/hydration)與[部落格文章](https://blog.angular.dev/whats-next-for-server-side-rendering-in-angular-2a6f27662b67)。我們已經看到 Core Web Vitals 有顯著改善，包括 [LCP](https://web.dev/lcp) 與 [CLS](https://web.dev/cls)。在實驗室測試中，我們持續觀察到一個真實世界應用程式的 LCP 改善了 45%。

  在 v17 中，我們將水合推出開發者預覽之外，並在伺服器端渲染方面進行了一系列改進，包括：SSG 的執行期路由探索、混合渲染應用程式高達 87% 更快的建置時間、為新專案啟用混合渲染的提示。
  </docs-card>
  <docs-card title="非破壞性完整應用程式水合" link="2023 年第 1 季完成" href="guide/hydration">
  在 v16 中，我們發布了非破壞性完整水合的開發者預覽，它讓 Angular 能重用伺服器端渲染頁面上的既有 DOM 節點，而不是從頭重新建立應用程式。更多資訊請參閱水合指南。
  </docs-card>
  <docs-card title="圖片指令的改進" link="2023 年第 1 季完成" href="guide/image-optimization">
  我們在 v15 中將 Angular 圖片指令發布為穩定版。我們引入了新的填滿模式功能，讓圖片能填入其父容器，而不是使用明確的尺寸。在過去兩個月中，Chrome Aurora 團隊將該指令回移植（backport）到 v12 與更新的版本。
  </docs-card>
  <docs-card title="文件重構" link="2023 年第 1 季完成" href="https://angular.io">
  確保所有既有文件都納入一套一致的內容類型。將過度使用的教學式文件更新為獨立的主題。我們希望確保主要教學之外的內容能自給自足，而不與一系列指南緊密耦合。在 2022 年第 2 季，我們重構了範本內容與依賴注入。在 2023 年第 1 季，我們改善了 HTTP 指南，並就此將文件重構專案暫時擱置。
  </docs-card>
  <docs-card title="改善圖片效能" link="2022 年第 4 季完成" href="guide/image-optimization">
  Aurora 與 Angular 團隊正在著手實作一個圖片指令，目標是改善 Core Web Vitals。我們在 v15 中推出了該圖片指令的穩定版本。
  </docs-card>
  <docs-card title="Modern CSS" link="2022 年第 4 季完成" href="https://blog.angular.dev/modern-css-in-angular-layouts-4a259dca9127">
  Web 生態系不斷演進，我們希望在 Angular 中反映最新的現代標準。在這個專案中，我們的目標是提供在 Angular 中使用現代 CSS 功能的指引，確保開發者在版面配置、樣式等方面遵循最佳實務。我們分享了版面配置的官方指引，並作為這項倡議的一部分，停止發布 flex layout。
  </docs-card>
  <docs-card title="支援將指令加入宿主元素" link="2022 年第 4 季完成" href="guide/directives/directive-composition-api">
  一個長期的功能請求是加入將指令加入宿主元素的能力。這項功能讓開發者不用繼承，就能為自己的元件增添額外的行為。在 v15 中，我們推出了指令組合 API，它能以指令強化宿主元素。
  </docs-card>
  <docs-card title="更好的堆疊追蹤" link="2022 年第 4 季完成" href="https://developer.chrome.com/blog/devtools-better-angular-debugging/">
  Angular 與 Chrome DevTools 團隊正共同合作，讓錯誤訊息的堆疊追蹤更易讀。在 v15 中，我們發布了改善過的相關與連結堆疊追蹤。作為優先度較低的倡議，我們將探索如何透過為範本提供更準確的呼叫框架名稱，讓堆疊追蹤更友善。
  </docs-card>
  <docs-card title="整合 MDC Web 強化 Angular Material 元件" link="2022 年第 4 季完成" href="https://material.angular.io/guide/mdc-migration">
  MDC Web 是 Google Material Design 團隊建立的函式庫，提供用於建置 Material Design 元件的可重用原語。Angular 團隊正將這些原語納入 Angular Material。使用 MDC Web 讓 Angular Material 更貼近 Material Design 規格，擴充了無障礙能力，改善了元件品質，並提升了我們團隊的速度。
  </docs-card>
  <docs-card title="實作讓 NgModules 成為選用的 API" link="2022 年第 4 季完成" href="https://blog.angular.dev/angular-v15-is-now-available-df7be7f2f4c8">
  在讓 Angular 更簡單的過程中，我們正在著手引入 API，讓開發者不使用 NgModules 就能初始化應用程式、具現化元件，並使用路由。Angular v14 引入了獨立元件、指令與管道 API 的開發者預覽。在接下來的幾季中，我們將收集開發者的回饋，並完成這個專案，讓這些 API 成為穩定版。下一步，我們將著手改善 TestBed、Angular elements 等使用情境。
  </docs-card>
  <docs-card title="允許在範本中綁定受保護的欄位" link="2022 年第 2 季完成" href="guide/templates/binding">
  為了改善 Angular 元件的封裝，我們啟用了對元件實例受保護成員的綁定。這樣你就不必再為了在範本中使用某個欄位或方法，而將它公開為 public。
  </docs-card>
  <docs-card title="發布進階概念指南" link="2022 年第 2 季完成" href="https://angular.io/guide/change-detection">
  開發並發布一份關於變更偵測的深入指南。開發 Angular 應用程式效能分析的內容。涵蓋變更偵測如何與 Zone.js 互動，並說明它在何時觸發、如何分析其持續時間，以及效能優化的常見做法。
  </docs-card>
  <docs-card title="為 @angular/forms 推出嚴格型別" link="2022 年第 2 季完成" href="guide/forms/typed-forms">
  在 2021 年第 4 季，我們設計了一個為表單引入嚴格型別的解決方案，並在 2022 年第 1 季完成了對應的意見徵求。目前，我們正在實作一個推出策略，其中包含自動化遷移步驟，讓既有專案能啟用這些改進。我們先在 Google 內部超過 2,500 個專案上測試這個解決方案，以確保外部社群能順利遷移。
  </docs-card>
  <docs-card title="移除舊版 View Engine" link="2022 年第 1 季完成" href="https://blog.angular.dev/angular-v15-is-now-available-df7be7f2f4c8">
  在我們所有內部工具都轉換到 Ivy 之後，我們將移除舊版 View Engine，以減少 Angular 的概念負擔、縮小套件大小、降低維護成本，並降低程式碼庫的複雜度。
  </docs-card>
  <docs-card title="以選用的 NgModules 簡化 Angular 心智模型" link="2022 年第 1 季完成" href="https://blog.angular.dev/angular-v15-is-now-available-df7be7f2f4c8">
  為了簡化 Angular 的心智模型與學習歷程，我們將著手讓 NgModules 成為選用。這項工作讓開發者能開發獨立元件，並實作一個替代 API 來宣告元件的編譯範圍。我們以高層次的設計討論展開這個專案，並將其記錄在一份 RFC 中。
  </docs-card>
  <docs-card title="為 @angular/forms 設計嚴格型別" link="2022 年第 1 季完成" href="guide/forms/typed-forms">
  我們將著手找出一種方式，以最少的向後不相容影響，為反應式表單實作更嚴格的型別檢查。這樣，我們就能讓開發者在開發期間捕捉到更多問題，啟用更好的文字編輯器與 IDE 支援，並改善反應式表單的型別檢查。
  </docs-card>
  <docs-card title="改善 Angular DevTools 與框架的整合" link="2022 年第 1 季完成" href="tools/devtools">
  為了改善 Angular DevTools 與框架的整合，我們正著手將程式碼庫移到 angular/angular 單一儲存庫（monorepository）。這包括將 Angular DevTools 轉換到 Bazel，並將其整合到既有的流程與 CI 管線中。
  </docs-card>
  <docs-card title="推出進階編譯器診斷" link="2022 年第 1 季完成" href="reference/extended-diagnostics">
  將 Angular 編譯器的診斷擴充到型別檢查之外。引入其他的正確性與一致性檢查，進一步保證正確性與最佳實務。
  </docs-card>
  <docs-card title="更新我們的 e2e 測試策略" link="2021 年第 3 季完成" href="guide/testing">
  為了確保我們提供經得起未來考驗的 e2e 測試策略，我們希望評估 Protractor 的狀況、社群創新、e2e 最佳實務，並探索新的機會。作為這項努力的第一步，我們分享了一份 RFC，並與合作夥伴合作，確保 Angular CLI 與最先進的 e2e 測試工具之間能順利整合。下一步，我們需要完成這些建議，並整理一份轉換資源清單。
  </docs-card>
  <docs-card title="Angular 函式庫使用 Ivy" link="2021 年第 3 季完成" href="tools/libraries">
  在 2020 年稍早，我們分享了一份 Ivy 函式庫散發的 RFC。在收到社群寶貴的回饋後，我們開發了這個專案的設計。我們現在正投入開發 Ivy 函式庫散發，包括更新函式庫套件格式以使用 Ivy 編譯、解除 View Engine 函式庫格式淘汰的阻礙，以及 ngcc。
  </docs-card>
  <docs-card title="以自動測試環境拆卸改善測試時間與除錯" link="2021 年第 3 季完成" href="guide/testing">
  為了改善測試時間並在測試之間建立更好的隔離，我們希望變更 TestBed，讓它在每次測試執行後自動清理並拆卸測試環境。
  </docs-card>
  <docs-card title="淘汰並移除 IE11 支援" link="2021 年第 3 季完成" href="https://github.com/angular/angular/issues/41840">
  Internet Explorer 11（IE11）一直妨礙 Angular 利用 Web 平台的一些現代功能。作為這個專案的一部分，我們將淘汰並移除 IE11 支援，為常青瀏覽器提供的現代功能開啟道路。我們舉辦了一次 RFC 來收集社群回饋，並決定向前邁進的下一步。
  </docs-card>
  <docs-card title="採用 ES2017+ 作為預設輸出語言" link="2021 年第 3 季完成" href="https://www.typescriptlang.org/docs/handbook/tsconfig-json.html">
  支援現代瀏覽器讓我們能利用 JavaScript 更精簡、更具表達力且效能更好的新語法。作為這個專案的一部分，我們將研究推動這項努力的阻礙，並採取步驟來啟用它。
  </docs-card>
  <docs-card title="以 Angular DevTools 加速除錯與效能分析" link="2021 年第 2 季完成" href="tools/devtools">
  我們正在開發 Angular 的開發工具，提供用於除錯與效能分析的公用程式。這個專案的目標是協助開發者理解 Angular 應用程式的元件結構與變更偵測。
  </docs-card>
  <docs-card title="以整合的 Angular 版本管理與分支簡化版本發布" link="2021 年第 2 季完成" href="reference/releases">
  我們希望整合 Angular 多個 GitHub 儲存庫（angular/angular、angular/angular-cli 與 angular/components）之間的版本發布管理工具。這項努力讓我們能重用基礎設施、統一並簡化流程，並改善版本發布流程的可靠性。
  </docs-card>
  <docs-card title="以提交訊息標準化提升開發者一致性" link="2021 年第 2 季完成" href="https://github.com/angular/angular">
  我們希望統一 Angular 儲存庫（angular/angular、angular/components 與 angular/angular-cli）之間的提交訊息要求與一致性規範，為我們的開發流程帶來一致性，並重用基礎設施工具。
  </docs-card>
  <docs-card title="將 Angular 語言服務轉移到 Ivy" link="2021 年第 2 季完成" href="tools/language-service">
  這個專案的目標是透過將語言服務轉移到 Ivy，改善體驗並移除舊版相依性。目前，語言服務即使對 Ivy 應用程式，仍使用 View Engine 編譯器與型別檢查。我們希望為 Angular 語言服務使用 Ivy 範本剖析器與改善過的型別檢查，以符合應用程式的行為。這項遷移也是解除 View Engine 移除阻礙的一步，這將簡化 Angular、減少 npm 套件大小，並改善框架的可維護性。
  </docs-card>
  <docs-card title="以 Angular 原生 Trusted Types 提升安全性" link="2021 年第 2 季完成" href="best-practices/security">
  我們與 Google 安全性團隊合作，加入對新的 Trusted Types API 的支援。這個 Web 平台 API 協助開發者建置更安全的 Web 應用程式。
  </docs-card>
  <docs-card title="以 Angular CLI webpack 5 優化建置速度與套件大小" link="2021 年第 2 季完成" href="tools/cli/build">
  作為 v11 版本發布的一部分，我們在 Angular CLI 中引入了 webpack 5 的選擇性預覽。為了確保穩定性，我們將持續迭代實作，以啟用建置速度與套件大小的改善。
  </docs-card>
  <docs-card title="在 Universal 應用程式中內嵌關鍵樣式，讓應用程式更快" link="2021 年第 1 季完成" href="guide/ssr">
  載入外部樣式表是一個阻斷性的操作，這代表瀏覽器在載入所有參照的 CSS 之前，無法開始渲染你的應用程式。在頁面的標頭中有阻斷渲染的資源，會顯著影響它的載入效能，例如它的首次內容繪製（first contentful paint）。為了讓應用程式更快，我們一直在與 Google Chrome 團隊合作，內嵌關鍵 CSS 並以非同步方式載入其餘樣式。
  </docs-card>
  <docs-card title="以更好的 Angular 錯誤訊息改善除錯" link="2021 年第 1 季完成" href="reference/errors">
  錯誤訊息經常只帶來有限的可行動資訊，協助開發者解決它們。我們一直致力於透過加入相關代碼、開發指南與其他材料，讓錯誤訊息更容易被發現，確保除錯體驗更順暢。
  </docs-card>
  <docs-card title="以翻新的入門文件改善開發者上手體驗" link="2021 年第 1 季完成" href="tutorials">
  我們將重新定義使用者的學習歷程，並翻新入門文件。我們將清楚說明 Angular 的好處、如何探索其能力，並提供指引，讓開發者能在盡可能短的時間內熟練使用這個框架。
  </docs-card>
  <docs-card title="擴充元件測試工具最佳實務" link="2021 年第 1 季完成" href="https://material.angular.io/guide/using-component-harnesses">
  Angular CDK 在版本 9 中為 Angular 引入了元件測試工具（component test harness）的概念。元件測試工具讓元件作者能建立受支援的 API，用於測試元件互動。我們正在持續改善這套元件測試工具基礎設施，並釐清使用元件測試工具的最佳實務。我們也正努力推動 Google 內部更廣泛地採用元件測試工具。
  </docs-card>
  <docs-card title="撰寫內容投影指南" link="2021 年第 2 季完成" href="https://angular.io/docs">
  內容投影是 Angular 的核心概念，但在文件中沒有得到它應得的份量。作為這個專案的一部分，我們希望找出內容投影的核心使用情境與概念，並將它們記錄下來。
  </docs-card>
  <docs-card title="遷移到 ESLint" link="2020 年第 4 季完成" href="tools/cli">
  隨著 TSLint 被淘汰，我們將轉移到 ESLint。作為流程的一部分，我們將著手確保與我們目前建議的 TSLint 設定向後相容、為既有的 Angular 應用程式實作遷移策略，並在 Angular CLI 工具鏈中引入新的工具。
  </docs-card>
  <docs-card title="Operation Bye Bye Backlog (also known as Operation Byelog)" link="2020 年第 4 季完成" href="https://github.com/angular/angular/issues">
  我們正積極投入高達 50% 的工程能量來分流處理議題與 PR，直到我們清楚理解社群更廣泛的需求為止。在那之後，我們將承諾投入高達 20% 的工程能量，及時跟上新的提交。
  </docs-card>
</docs-card-container>
