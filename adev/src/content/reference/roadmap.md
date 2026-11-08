<docs-decorative-header title="Angular 藍圖" imgSrc="adev/src/assets/images/roadmap.svg"> <!-- markdownlint-disable-line -->
了解 Angular 團隊如何為 Web 蓄積動能。
</docs-decorative-header>

身為一個開源專案，Angular 每日的提交、PR 與動能都可以在 GitHub 上追蹤。為了讓這份日常工作如何與框架的未來相連更加透明，我們的藍圖彙整了團隊目前與未來規劃的願景。

下列專案並未與特定的 Angular 版本綁定。我們會在完成時發布它們，並依我們的版本發布時程、遵循語意化版本管理，將它們納入特定版本。例如，我們會在功能完成後的下一個次要版本中發布它，如果包含破壞性變更，則會在下一個主要版本中發布。

目前，Angular 對框架有三個目標：

1. 改善[開發者的 AI 體驗](/ai)
1. 改善 [Angular 開發者體驗](#improving-the-angular-developer-experience)
1. 改善框架的效能

繼續閱讀，了解我們打算如何透過具體的專案工作來實現這些目標。

## 探索現代 Angular

開始使用我們藍圖中最新的 Angular 功能進行開發。這份清單代表我們藍圖中新功能的目前狀態：

### 可供實驗

- [Web MCP](/ai/webmcp)

### 已可投入生產環境

- [Signal Forms](/guide/forms/signals/overview)
- [Resource API](/guide/signals/resource)
- [httpResource](/api/common/http/httpResource)
- [無 Zone 變更偵測](/guide/zoneless)
- [Linked Signal API](/guide/signals/linked-signal)
- [漸進式水合](/guide/incremental-hydration)
- [Effect API](/api/core/effect)
- [SSR 事件重播](/api/platform-browser/withEventReplay)
- [路由層級渲染模式](/guide/ssr)

## 改善 Angular 開發者的 AI 體驗

### 將最好的 AI 帶給 Angular

<docs-card-container>
  <docs-card title="AI 驅動的 Angular">
  AI 持續形塑開發的樣貌。它改變了我們開發應用程式的方式，以及可能實現的使用者體驗類型。我們計畫在 AI 輔助程式撰寫與將 AI 整合進應用程式這兩方面，為開發者社群提供最好的支援。
  </docs-card>
  <docs-card title="AI 開發">
  團隊將持續與 Google AI Studio、Gemini CLI 等工具，以及 Antigravity 這類代理型 IDE 等其他代理工具，開發有意義的整合。我們計畫推出與快速演進的產業保持一致的解決方案。範例包括代理技能、新的 MCP 功能與 AI SDK。
  </docs-card>
  <docs-card title="程式碼生成">
  [根據我們的研究](https://blog.angular.dev/beyond-the-horizon-how-angular-is-embracing-ai-for-next-gen-apps-7a7ed706e1a3)，以現代 LLM 為 Angular 生成程式碼已經有很高的品質。我們將持續投入，改善 Angular 的程式碼生成品質。這代表我們會定期以目前的模型評估程式碼生成品質，並透過系統指令、文件與戰術性的框架變更來改善它。
  </docs-card>
  <docs-card title="AI 驅動的體驗">
  Angular 開發者有一個新的領域可以探索，例如動態 UI 生成等新概念。我們從建置 Angular 對 A2UI 的支援開始，並積極尋找更多支援現代應用程式體驗的機會。
  </docs-card>
</docs-card-container>

## 改善 Angular 開發者體驗

### 開發速度

<docs-card-container>
  <docs-card title="編譯器">
    Microsoft 在過去一年將 TypeScript 編譯器移植到 Go，承諾讓典型的 TypeScript 編譯速度提升 5 到 10 倍。Angular 與 TypeScript 編譯器的整合可能是最深的之一，這將需要較大的架構變更，才能在編譯器與語言服務中支援以 tsgo 為基礎的新工作流程。

我們正在原型開發並探索這種支援的樣貌，並將交付一個與 tsgo 相容的 Angular 編譯器，把 Microsoft 原生移植的效能優勢帶給 Angular 生態系。
</docs-card>

  <docs-card title="強化生態系相容性">
    開發者正在混合使用 AI 生成的程式碼與手寫的程式碼，並希望使用熱門的函式庫、快速整合新的體驗。Angular 希望良好地融入這個生態系，開發者應該能使用他們喜愛的工具，並依需求混合搭配不同的框架。

作為這個專案的一部分，我們將探索跨框架互通的需求空間與我們的建置工具，以改善我們的相容性。

  </docs-card>

  <docs-card title="元件">
  在 Angular v21 中，我們推出了開發者預覽版的 Angular Aria，提供八種無障礙的無頭元件模式。在 Angular v22 中，我們將 Angular Aria 提升為穩定版，並計畫在需要時引入新的模式。我們希望為開發者提供堅實的基礎，讓他們使用 Angular Aria 開發自己的元件：我們提供互動，風格則由你帶來，與你的設計系統相符。開發者可以選擇以 Angular Aria 開發自訂元件、使用 CDK 的互動模式，或使用已備好樣式的 Material 元件。

在無障礙方面，我們持續以 WCAG 等無障礙標準評估元件與模式，並努力修正這個過程中發現的任何問題。
</docs-card>
</docs-card-container>

### 改善工具

<docs-card-container>
  <docs-card title="以 ng test 將單元測試工具現代化">
  隨著 Vitest 在 Angular v21 中穩定發布，它現在是我們主要的測試執行器。我們現在專注於將實驗性的 Karma 到 Vitest 遷移工具提升為穩定版，並研究新功能，以進一步完善並改善開發者的測試工作流程。
</docs-card>
</docs-card-container>

## 已完成的專案

<docs-card-container>

  <docs-card title="Signal Forms" href="/guide/forms/signals/overview" link="2026 年完成">
  Signal Forms 現在已是穩定版。這種新方法讓開發者使用訊號管理表單狀態，提供符合人體工學的表單建立體驗。我們將 Signal Forms 提升為穩定版，並強化了與反應式表單的互通性，讓團隊能依自己的步調逐步遷移大型表單。
  </docs-card>

  <docs-card title="反應性" href="/guide/signals" link="2026 年完成">
  我們引入了新的訊號 API，`resource()` 與 `httpResource()`，用於靈活的非同步資料處理。我們已將這些 API 提升為開發者穩定版。
  </docs-card>

  <docs-card title="變更偵測" href="/api/core/ChangeDetectionStrategy" link="2026 年完成">
  隨著無 Zone 模式成為穩定版且為預設，我們將預設的變更偵測策略設為 `OnPush`，以遵循目前的最佳實務。我們也將 `ChangeDetectionStrategy.Default` 重新命名為 `ChangeDetectionStrategy.Eager`。

[詳情請參閱 RFC 討論](https://github.com/angular/angular/discussions/66779)。
</docs-card>

  <docs-card title="在 Angular DevTools 中除錯 Signal" link="2026 年完成">
  我們已加入更好的工具，讓你使用 Angular DevTools 除錯 Signal。這項變更包含一個用於檢查與除錯訊號的新 UI。
  </docs-card>

  <docs-card title="改善 HMR (Hot Module Reload)" href="https://github.com/angular/angular/issues/39367#issuecomment-1439537306" link="2025 年完成">
  我們正在透過啟用熱模組替換，邁向更快的編輯／重新整理週期。在 Angular v19 中，我們推出了 CSS 與範本 HMR 的初步支援，並在 v20 中將範本 HMR 提升為穩定版。我們將持續收集回饋，確保在將這個專案標示為完成之前，我們有回應到開發者的需求。
</docs-card>

<docs-card title="Zoneless Angular"  link="2025 年第 4 季完成">
在 v18 中，我們在 Angular 中推出了實驗性的無 Zone 支援。它讓開發者在使用框架時，不必在套件中包含 zone.js，這改善了效能、除錯體驗與互通性。作為初步發布的一部分，我們也為 Angular CDK 與 Angular Material 引入了無 Zone 支援。

在 v19 中，我們為伺服器端渲染引入了無 Zone 支援，處理了一些邊界情況，並建立了一支用來鷹架式建立無 Zone 專案的原理圖。我們已將 <a href="https://fonts.google.com/" target="_blank">Google Fonts</a> 轉換為無 Zone 模式，這改善了效能與開發者體驗，也讓我們找出在將這項功能推進到開發者預覽之前，還需要處理的缺口。

截至 Angular v20.2，Zoneless Angular 現在已是穩定版，並包含錯誤處理與伺服器端渲染方面的改進。
</docs-card>

<docs-card title="伺服器路由設定" link="2025 年第 2 季完成"  >
我們正在努力讓伺服器上的路由設定更符合人體工學。我們希望讓宣告哪些路由應該伺服器端渲染、預先渲染或用戶端渲染變得輕而易舉。

在 Angular v19 中，我們推出了路由層級渲染模式的開發者預覽，讓你可以細緻地設定你想讓 Angular 預先渲染、伺服器端渲染或用戶端渲染的路由。在 Angular v20 中，我們將它提升為穩定版。
</docs-card>
<docs-card title="啟用漸進式水合" link="2025 年第 2 季完成">
在 v17 中，我們將水合從開發者預覽提升為正式功能，並且持續觀察到 LCP 有 40 到 50% 的改善。自此之後，我們開始原型開發漸進式水合，並在 ng-conf 的舞台上分享了展示。

在 v19 中，我們以 `@defer` 區塊為動力，推出了開發者預覽模式的漸進式水合。在 Angular v20 中，我們將它提升為穩定版！
</docs-card>
<docs-card title="交付 Angular Signals" link="2025 年第 2 季完成" href="https://github.com/angular/angular/discussions/49685">
這個專案透過引入 Signals 作為反應性原語，重新思考 Angular 的反應性模型。初步規劃產生了數百場討論、與開發者的對話、回饋會議、使用者體驗研究，以及一系列收到超過 1,000 則留言的 RFC。

在 Angular v20 中，我們將所有基本的反應性原語提升為穩定版，包括 signal、effect、linkedSignal、基於訊號的查詢與輸入。
</docs-card>
<docs-card title="支援二維拖放" link="2024 年第 2 季完成" href="https://github.com/angular/components/issues/13372">
作為這個專案的一部分，我們為 Angular CDK 的拖放功能實作了混合方向支援。這是該儲存庫最受請求的功能之一。
</docs-card>
<docs-card title="SSR 與預先渲染的事件重播" link="2024 年第 4 季完成" href="api/platform-browser/withEventReplay">
在 v18 中，我們在使用伺服器端渲染或預先渲染時引入了事件重播功能。為了這項功能，我們依賴在 Google.com 上執行的事件分派原語（先前稱為 jsaction）。

在 Angular v19 中，我們將事件重播提升為穩定版，並為所有新專案預設啟用它。
</docs-card>
<docs-card title="整合 Angular Language Service 與 Schematics" link="2024 年第 4 季完成">
為了讓開發者更容易使用現代 Angular API，我們啟用了 Angular 語言服務與 schematics 之間的整合，讓你可以一鍵重構你的應用程式。
</docs-card>
<docs-card title="以 Language Service 簡化獨立模式的匯入" link="2024 年第 4 季完成">
作為這項倡議的一部分，語言服務會在獨立模式與基於 NgModule 的應用程式中，自動匯入元件與管道。此外，我們加入了一個範本診斷，用來標示獨立元件中未使用的匯入，這應有助於讓應用程式套件更小。
</docs-card>
<docs-card title="區域範本變數" link="2024 年第 3 季完成">
我們已發布 Angular 對區域範本變數的支援，詳情請參閱 [`@let`](/api/core/@let)。
</docs-card>
<docs-card title="擴充 Angular Material 的可自訂性" link="2024 年第 2 季完成" href="https://material.angular.dev/guide/theming">
為了提供我們 Angular Material 元件更好的自訂能力並啟用 Material 3 的能力，我們將與 Google 的 Material Design 團隊合作，定義以權杖（token）為基礎的主題 API。

在 v17.2 中，我們分享了 Angular Material 3 的實驗性支援，並在 v18 中將它提升為穩定版。
</docs-card>
<docs-card title="引入延遲載入" link="2024 年第 2 季完成" href="guide/templates/defer">
在 v17 中，我們推出了開發者預覽版的可延遲檢視，它提供符合人體工學的 API 來延遲載入程式碼。在 v18 中，我們為函式庫開發者啟用了可延遲檢視，並將該 API 提升為穩定版。
</docs-card>
<docs-card title="Angular DevTools 的 iframe 支援" link="2024 年第 2 季完成">
我們已啟用對嵌入在頁面中 iframe 內的 Angular 應用程式進行除錯與效能分析。
</docs-card>
<docs-card title="將現有混合渲染專案轉移到 esbuild 與 vite 的自動化" link="2024 年第 2 季完成" href="tools/cli/build-system-migration">
在 v17 中，我們推出了以 vite 與 esbuild 為基礎的應用程式建置器，並為新專案預設啟用它。它將使用混合渲染的專案建置時間改善了高達 87%。作為 v18 的一部分，我們推出了原理圖與指南，將使用混合渲染的現有專案遷移到新的建置管線。
</docs-card>
<docs-card title="讓 Angular.dev 成為 Angular 開發者的官方首頁" link="2024 年第 2 季完成" href="https://goo.gle/angular-dot-dev">
Angular.dev 是 Angular 開發的新網站、網域與首頁。新網站包含更新過的文件、教學與指引，將協助開發者使用 Angular 的最新功能進行建置。
</docs-card>
<docs-card title="引入內建控制流程" link="2024 年第 2 季完成" href="guide/templates/control-flow">
在 v17 中，我們推出了新控制流程的開發者預覽版。它為範本撰寫帶來顯著的效能改善與更好的人體工學。我們也提供了既有 `*ngIf`、`*ngFor` 與 `*ngSwitch` 的遷移，你可以執行它，將專案移轉到新的實作。截至 v18，內建控制流程現在已是穩定版。
</docs-card>
<docs-card title="讓入門教學現代化" link="2023 年第 4 季完成">
在過去兩季中，我們基於獨立元件，開發了新的[影片](https://www.youtube.com/watch?v=xAT0lHYhHMY&list=PL1w1q3fL4pmj9k1FrJ3Pe91EPub2_h4jF)與[文字版](/tutorials/learn-angular)教學。
</docs-card>
<docs-card title="研究現代打包工具" link="2023 年第 4 季完成" href="guide/hydration">
在 Angular v16 中，我們發布了以 esbuild 為基礎之建置器的開發者預覽，支援 `ng build` 與 `ng serve`。`ng serve` 開發伺服器使用 Vite，以及 esbuild 與 Angular 編譯器的多檔案編譯。在 v17 中，我們將建置工具從開發者預覽提升為正式功能，並為新專案預設啟用它。
</docs-card>
<docs-card title="引入依賴注入除錯 API" link="2023 年第 4 季完成" href="tools/devtools">
為了改善除錯公用程式與 Angular DevTools，我們將著手開發能存取依賴注入執行期的 API。作為這個專案的一部分，我們將公開除錯方法，讓我們能探索注入器階層以及跨其相關提供者的相依性。截至 v17，我們推出了能讓我們接入依賴注入生命週期的功能。我們也推出了注入器樹的視覺化呈現，以及對每個個別節點內宣告的提供者進行檢查，
</docs-card>
<docs-card title="改善獨立元件的文件與原理圖" link="2023 年第 4 季完成" href="essentials/components">
我們發布了 `ng new --standalone` 原理圖集合的開發者預覽，讓你可以建立沒有 NgModules 的應用程式。在 v17 中，我們將新的應用程式撰寫格式切換為獨立 API，並變更文件以反映這項建議。此外，我們推出了支援將現有應用程式更新為獨立元件、指令與管道的原理圖。儘管 NgModules 在可預見的未來仍會存在，我們仍建議你探索新 API 的好處，以改善開發者體驗，並受益於我們為它們建置的新功能。
</docs-card>
<docs-card title="探索水合與伺服器端渲染的改進" link="2023 年第 4 季完成">
在 v16 中，我們發布了非破壞性完整水合的開發者預覽，詳情請參閱[水合指南](guide/hydration)與[部落格文章](https://blog.angular.dev/whats-next-for-server-side-rendering-in-angular-2a6f27662b67)。我們已經看到 Core Web Vitals 有顯著改善，包括 [LCP](https://web.dev/lcp) 與 [CLS](https://web.dev/cls)。在實驗室測試中，我們持續觀察到一個真實世界應用程式的 LCP 改善了 45%。

在 v17 中，我們將水合推出開發者預覽之外，並在伺服器端渲染方面進行了一系列改進，包括：SSG 的執行期路由探索、混合渲染應用程式高達 87% 更快的建置時間、為新專案啟用混合渲染的提示。
</docs-card>
