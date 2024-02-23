<docs-decorative-header title="Angular 路線圖" imgSrc="adev/src/assets/images/roadmap.svg"> <!-- markdownlint-disable-line -->
瞭解 Angular 團隊如何為網路建立動能。
</docs-decorative-header>

作為一個開放原始碼專案，Angular 的每日提交、公關和動態都可以在 GitHub 上追蹤。為了提高透明度，了解這些日常工作如何連接到架構的未來，我們的路線圖匯集了團隊目前和未來計劃的願景。

以下專案與特定 Angular 版本無關。我們會在完成後發布它們，它們會根據我們的發布時間表，依照語意版本控管，成為特定版本的一部分。例如，我們會在完成後於下一個次要版本中發布功能，或是在包含重大變更時於下一個主要版本中發布。

目前，Angular 對此框架有兩個目標：

1. 改善 [Angular 開發人員體驗](#improving-the-angular-developer-experience) 和
2. 改善 [框架效能](#fast-by-default)。

繼續閱讀以了解我們計劃如何通過具體的項目工作來實現這些目標。

## 探索現代 Angular

開始使用我們路線圖上的最新 Angular 功能進行開發。此清單代表路線圖上新功能的當前狀態：

| 準備好使用以下內容進行實驗                                                  | 已準備好投入生產                                                                      |
| :---------------------------------------------------------------------------- | :-------------------------------------------------------------------------------------- |
| [探索 Angular Signals](guide/signals)                                      | [將你的 Angular Material 遷移至 MDC](https://material.angular.io/guide/mdc-migration) |
| [了解 Hydration](guide/hydration)                                      | [遷移至獨立 API](reference/migrations/standalone)                           |
| [可延遲的檢視](https://github.com/angular/angular/discussions/50716)      | [使用 NgOptimizedImage 改善圖片效能](guide/image-optimization)             |
| [內建控制流程](https://github.com/angular/angular/discussions/50719) | [試用 Inject](tutorials/learn-angular/inject-based-di)                               |
|                                                                               | [新的 CDK 指令](https://material.angular.io/cdk/categories)                        |

## 改善 Angular 開發人員體驗

html
<p>
  Angular CLI 1.7.0 now includes a new command, `ng update`, that will help you keep your Angular applications up to date with the latest Angular releases.
</p>
<p>
  To use the `ng update` command, simply run the following command in your Angular project directory:
</p>
<pre>
  ng update
</pre>
<p>
  The `ng update` command will then check for any available updates to your Angular applications and prompt you to install them.
</p>
<p>
  In addition to the `ng update` command, Angular CLI 1.7.0 also includes a number of other improvements to the Angular developer experience, including:
</p>
<ul>
<li>Improved support for TypeScript 2.6</li>
<li>Improved performance of the Angular compiler</li>
<li>Improved error messages</li>
<li>Better support for internationalization</li>
</ul>
<p>
  For more information on the Angular CLI 1.7.0 release, please see the <a href="https://github.com/angular/angular-cli/releases/tag/v1.7.0">release notes</a>.
</p>

### 改善執行時期效能並讓 Zone.js 成為可選

<docs-card-container>
  <docs-card title="提供 Angular 信號" href="https://github.com/angular/angular/discussions/49685">
  此專案透過將信號作為反應式基元來重新構思 Angular 反應式模型。此專案完全實施後，Zone.js 將成為選用元件。最初的規劃產生了數百次的討論、與開發人員的對話、回饋意見、使用者體驗研究，以及一系列收到超過 1,000 則評論的 RFC。

作為 v17 發行的一部分，我們已將 Angular Signals 函式庫從開發人員預覽版畢業。接下來，我們將繼續實施 RFC 的提案。第一步是引入基於信號的輸入和查詢。
  </docs-card>
</docs-card-container>

### 讓 Angular 更容易學習

<docs-card-container>
  <docs-card title="讓 Angular.dev 成為 Angular 開發人員的官方首頁" href="https://goo.gle/angular-dot-dev">
  Angular.dev 將成為 Angular 開發的新網站、網域和首頁。新網站包含更新的說明文件、教學課程和指南，可協助開發人員使用 Angular 的最新功能進行建置。v17 的推出包含 Angular 核心功能、教學課程和參考文件的新增和修訂說明文件。在未來幾個月，我們將繼續收集意見回饋並改善網站，並計畫進行大量增強功能。

在 v18 中，我們在收集意見回饋並持續穩定 Angular.dev 之後，計劃將 Angular.dev 設為所有 Angular 開發的官方首頁。
  </docs-card>
  <docs-card title="推出內建控制流程" href="https://github.com/angular/angular/discussions/50719">
  在 v17 中，我們發布了新控制流程的開發人員預覽版本。它為範本撰寫帶來顯著的效能改進和更好的工學。我們還提供了現有 `*ngIf`、`*ngFor` 和 `*ngSwitch` 的遷移，你可以執行這些遷移將你的專案移至新的實作。作為後續步驟，我們將著手處理社群意見回饋，然後才能正式完成此專案，使其從開發人員預覽畢業。
  </docs-card>
</docs-card-container>

### 改進 Angular Material 和 CDK

<docs-card-container>
  <docs-card title="擴展 Angular Material 的自訂性" href="">
  為了提供更佳的 Angular Material 元件自訂性，並啟用 Material 3 功能，我們將與 Google 的 Material Design 團隊合作，定義基於程式碼的佈景主題 API。

截至 2023 年第 4 季，我們正在重新調整元件以使用新的 API，完成全面的代幣集，並根據新的代幣更新 Sass API。
  </docs-card>
  <docs-card title="新的 CDK 原生元件" href="">
  我們正在開發新的 CDK 原生元件，以促進根據 [Combobox](https://www.w3.org/TR/wai-aria-practices-1.1/#combobox) 的 WAI-ARIA 設計樣式建立自訂元件。Angular v14 引入了穩定的 [選單和對話方塊原生元件](https://material.angular.io/cdk/categories) 作為此專案的一部分，而在 v15 中引入了 Listbox。
  </docs-card>
  <docs-card title="Angular 元件無障礙性" href="">
  我們正在評估 Angular Material 中的元件是否符合 WCAG 等無障礙性標準，並致力於修正此程序中產生的任何問題。
  </docs-card>
</docs-card-container>

### 改善工具

<docs-card-container>
  <docs-card title="使用 ng test 現代化單元測試工具" href="">
  在 v12 中，我們重新檢視了 Angular 端到端測試體驗，以 Cypress、Nightwatch 和 Webdriver.io 等現代替代方案取代 Protractor。接下來，我們想處理 `ng test` 以現代化 Angular 的單元測試體驗。在第二季，我們引入了實驗性的 [Jest](https://jestjs.io/) 支援並 [宣布](https://blog.angular.io/moving-angular-cli-to-jest-and-web-test-runner-ef85ef69ceca) 從 Karma 轉移到 [Web Test Runner](https://modern-web.dev/docs/test-runner/overview/)。
  </docs-card>
  <docs-card title="Angular DevTools 中的 iframe 支援" href="">
  我們正在努力讓在頁面上嵌入 iframe 的 Angular 應用程式能夠除錯和分析。此功能將允許您選擇 iframe 並直接在 Angular DevTools 中檢查它。
  </docs-card>
  <docs-card title="將現有的混合式呈現專案轉換為 esbuild 和 vite 的自動化" href="tools/cli/esbuild">
  在 v17 中，我們發布了基於 vite 和 esbuild 的應用程式建構器，並在預設情況下啟用它以供新專案使用。它將使用混合式呈現的專案的建置時間縮短多達 87%。接下來，我們將致力於開發將使用混合式呈現的現有專案遷移到新的建置管線的指令碼。
  </docs-card>
  <docs-card title="使用語言服務簡化獨立式匯入" href="">
  作為此計畫的一部分，語言服務會自動匯入獨立式和基於 NgModule 的應用程式中的元件和管道。此外，為了讓應用程式套件更小，我們將致力於讓語言服務能夠提出自動移除未使用的匯入的建議。
  </docs-card>
</docs-card-container>

## 預設快速

<docs-card-container>
  <docs-card title="預設啟用混合式渲染 (SSR 和 SSG)" href="">
  我們正在開發更多開發人員體驗改進，這將允許我們預設為新專案啟用混合式 (伺服器端渲染和靜態網站產生) 渲染。特別是，我們專注於路由等級渲染策略設定和改進 i18n 支援的開發人員體驗。
  </docs-card>
  <docs-card title="引入延遲載入" href="https://github.com/angular/angular/discussions/50716">
  在 v17 中，我們在開發人員預覽中發布了可延遲檢視，它提供一個用於延遲程式碼載入的人體工程學 API。在正式使此功能穩定之前，我們將在接下來的步驟中反覆運算社群回饋。
  </docs-card>
</docs-card-container>

## 未來工作、探索和原型製作

此區段代表未來潛在專案的探索和原型製作。合理的結果是決定我們目前的解決方案是最佳選項。其他專案可能會產生 RFC，晉升至正在進行的專案，或隨著我們的架構持續創新而降低優先順序。

<docs-card-container>
  <docs-card title="Angular DevTools 中的 Signal 除錯" href="">
  隨著 Angular 中 Signals 的演進，我們也會開發更好的工具來除錯它們。優先事項清單的首要事項是，建立一個 UI 來檢查和除錯基於 Signal 的元件。
  </docs-card>
  <docs-card title="改善 HMR（熱模組重新載入）" href="https://github.com/angular/angular/issues/39367#issuecomment-1439537306">
  Angular CLI 目前透過 `ng serve --hmr` 支援 HMR。基本上，這是在幕後從頭重新渲染 Angular 應用程式，這比重新載入整頁好，但絕對可以改進。最重要的是，我們的策略應該是要針對任何特定變更的處理時間進行最佳化，並根據該類變更的頻率進行調整。未來，我們的團隊將探索多種改善 HMR 的機會，包括：

- 快速追蹤僅限 CSS 的變更，並將其套用至頁面上的任何現有元件。
- 快速追蹤僅限 Angular 範本的變更，並將其套用至頁面上的任何現有元件。
  </docs-card>
  <docs-card title="探索串流伺服器端渲染" href="">
  在過去的幾個版本中，我們一直致力於讓 Angular 的伺服器端渲染故事更強大。在我們的優先事項清單中，是探索無區域應用程式的串流伺服器端渲染。
  </docs-card>
  <docs-card title="探索部分水合" href="">
  在 v17 中，我們將水合從開發人員預覽中畢業，並且我們一直持續觀察到 LCP 有 40-50% 的改進。作為下一步，我們將探索如何使用可延遲檢視來部分水合應用程式。

  作為此努力的一部分，我們還將評估更精細的水合和可恢復性的權衡。我們將在進展時分享更新。未來工作的優先事項將是向後相容性和互操作性。
  </docs-card>
  <docs-card title="調查創作格式改進" href="">
  根據我們的開發人員調查結果，我們發現有機會改善元件創作格式的人體工學。此流程的第一步將是收集需求並了解 RFC 的進階問題空間。我們將在取得進展時分享更新。未來工作的優先事項將是向後相容性和互操作性。
  </docs-card>
  <docs-card title="支援二維拖放" href="https://github.com/angular/components/issues/13372">
  作為此專案的一部分，我們想為 Angular CDK 拖放實作混合方向支援。這是儲存庫中最受要求的功能之一。
  </docs-card>
</docs-card-container>

## 已完成項目

<docs-card-container>
  <docs-card title="現代化入門教學" link="2023 年第 4 季完成" href="">
  在過去的兩個季度中，我們開發了一個新的 [影片](https://www.youtube.com/watch?v=xAT0lHYhHMY&list=PL1w1q3fL4pmj9k1FrJ3Pe91EPub2_h4jF) 和 [文字](https://angular.dev/tutorials/learn-angular) 教學，以獨立元件為基礎。
  </docs-card>
  <docs-card title="研究現代化打包器" link="2023 年第 4 季完成" href="guide/hydration">
  在 Angular v16 中，我們發布了一個基於 esbuild 的建構工具開發者預覽版，支援 `ng build` 和 `ng serve`。`ng serve` 開發伺服器使用 Vite 和由 esbuild 和 Angular 編譯器進行的多檔案編譯。在 v17 中，我們將建構工具從開發者預覽版升級，並在新的專案中預設啟用。
  </docs-card>
  <docs-card title="引入相依性注入除錯 API" link="2023 年第 4 季完成" href="tools/devtools">
  為了改善 Angular 和 Angular DevTools 的除錯工具，我們將開發提供存取相依性注入執行階段的 API。在專案中，我們將公開除錯方法，讓我們可以探索注入器階層和跨其關聯提供者的相依性。在 v17 中，我們發布了一項功能，讓我們可以插入相依性注入生命週期。我們還推出了注入器樹的可視化，以及檢查每個個別節點中宣告的提供者，
  </docs-card>
  <docs-card title="改善獨立元件的文件和指令碼" link="2023 年第 4 季完成" href="components">
  我們發布了 `ng new --standalone` 指令碼集合的開發者預覽版，讓您可以建立不含 NgModules 的 app。在 v17 中，我們將新的應用程式創作格式切換為獨立 API，並變更文件以反映建議。此外，我們發布了支援將現有應用程式更新為獨立元件、指令和管道的指令碼。即使在可預見的未來 NgModules 仍會存在，我們建議您探索新的 API 的優點，以改善開發人員體驗並受益於我們為其建構的新功能。
  </docs-card>
  <docs-card title="探索水化和伺服器端渲染的改善" link="2023 年第 4 季完成">
  在 v16 中，我們發布了非破壞性完整水化的開發者預覽版，請參閱 [水化指南](guide/hydration) 和 [部落格文章](https://blog.angular.io/whats-next-for-server-side-rendering-in-angular-2a6f27662b67) 以取得更多資訊。我們已經看到 Core Web Vitals 的顯著改善，包括 [LCP](https://web.dev/lcp) 和 [CLS](https://web.dev/cls)。在實驗室測試中，我們持續觀察到真實世界 app 的 LCP 改善了 45%。

In v17 we launched hydration outside developer preview and did a series of improvements in the server-side rendering story, including: route discovery at runtime for SSG, up to 87% faster build times for hybrid rendered applications, prompt that enables hybrid rendering for new projects.
  </docs-card>
  <docs-card title="Non-destructive full app hydration" link="Completed Q1 2023" href="guide/hydration">
  In v16, we released a developer preview of non-destructive full hydration, which allows Angular to reuse existing DOM nodes on a server-side rendered page, instead of re-creating an app from scratch. See additional information in the hydration guide.
  </docs-card>
  <docs-card title="Improvements in the image directive" link="Completed Q1 2023" href="guide/image-optimization">
  We released the Angular image directive as stable in v15. We introduced a new fill mode feature that enables images to fit within their parent container rather than having explicit dimensions. Over the past two months, the Chrome Aurora team backported the directive to v12 and newer.
  </docs-card>
  <docs-card title="Documentation refactoring" link="Completed Q1 2023" href="https://angular.io">
  Ensure all existing documentation fits into a consistent set of content types. Update excessive use of tutorial-style documentation into independent topics. We want to ensure the content outside the main tutorials is self-sufficient without being tightly coupled to a series of guides. In Q2 2022, we refactored the template content and dependency injection. In Q1 2023, we improved the HTTP guides, and with this, we're putting the documentation refactoring project on hold.
  </docs-card>
  <docs-card title="Improve image performance" link="Completed Q4 2022" href="guide/image-optimization">
  The Aurora and the Angular teams are working on the implementation of an image directive that aims to improve Core Web Vitals. We shipped a stable version of the image directive in v15.
  </docs-card>
  <docs-card title="Modern CSS" link="Completed Q4 2022" href="https://blog.angular.io/modern-css-in-angular-layouts-4a259dca9127">
  The Web ecosystem evolves constantly and we want to reflect the latest modern standards in Angular. In this project we aim to provide guidelines on using modern CSS features in Angular to ensure developers follow best practices for layout, styling, etc. We shared official guidelines for layout and as part of the initiative stopped publishing flex layout.
  </docs-card>
  <docs-card title="Support adding directives to host elements" link="Completed Q4 2022" href="guide/directives/directive-composition-api">
  A long-standing feature request is to add the ability to add directives to host elements. The feature lets developers augment their own components with additional behaviors without using inheritance. In v15 we shipped our directive composition API, which enables enhancing host elements with directives.
  </docs-card>
  <docs-card title="Better stack traces" link="Completed Q4 2022" href="https://developer.chrome.com/blog/devtools-better-angular-debugging/">
  The Angular and the Chrome DevTools are working together to enable more readable stack traces for error messages. In v15 we released improved relevant and linked stack traces. As a lower priority initiative, we'll be exploring how to make the stack traces friendlier by providing more accurate call frame names for templates.
  </docs-card>
  <docs-card title="Enhanced Angular Material components by integrating MDC Web" link="Completed Q4 2022" href="https://material.angular.io/guide/mdc-migration">
  MDC Web is a library created by the Google Material Design team that provides reusable primitives for building Material Design components. The Angular team is incorporating these primitives into Angular Material. Using MDC Web aligns Angular Material more closely with the Material Design specification, expands accessibility, improves component quality, and improves the velocity of our team.
  </docs-card>
  <docs-card title="Implement APIs for optional NgModules" link="Completed Q4 2022" href="https://blog.angular.io/angular-v15-is-now-available-df7be7f2f4c8">
  In the process of making Angular simpler, we are working on introducing APIs that allow developers to initialize apps, instantiate components, and use the router without NgModules. Angular v14 introduces developer preview of the APIs for standalone components, directives, and pipes. In the next few quarters we'll collect feedback from developers and finalize the project making the APIs stable. As the next step we will work on improving use cases such as TestBed, Angular elements, etc.
  </docs-card>
  <docs-card title="Allow binding to protected fields in templates" link="Completed Q2 2022" href="guide/templates/binding">
  To improve the encapsulation of Angular components we enabled binding to protected members of the component instance. This way you'll no longer have to expose a field or a method as public to use it inside your templates.
  </docs-card>
  <docs-card title="Publish guides on advanced concepts" link="Completed Q2 2022" href="https://angular.io/guide/change-detection">
  Develop and publish an in-depth guide on change detection. Develop content for performance profiling of Angular apps. Cover how change detection interacts with Zone.js and explain when it gets triggered, how to profile its duration, as well as common practices for performance optimization.
  </docs-card>
  <docs-card title="Rollout strict typings for @angular/forms" link="Completed Q2 2022" href="guide/forms/typed-forms">
  In Q4 2021 we designed a solution for introducing strict typings for forms and in Q1 2022 we concluded the corresponding request for comments. Currently, we are implementing a rollout strategy with an automated migration step that will enable the improvements for existing projects. We are first testing the solution with more than 2,500 projects at Google to ensure a smooth migration path for the external community.
  </docs-card>
  <docs-card title="Remove legacy View Engine" link="Completed Q1 2022" href="https://blog.angular.io/angular-v15-is-now-available-df7be7f2f4c8">
  After the transition of all our internal tooling to Ivy is completed, we will remove the legacy View Engine for reduced Angular conceptual overhead, smaller package size, lower maintenance cost, and lower codebase complexity.
  </docs-card>
  <docs-card title="Simplified Angular mental model with optional NgModules" link="Completed Q1 2022" href="https://blog.angular.io/angular-v15-is-now-available-df7be7f2f4c8">
  To simplify the Angular mental model and learning journey, we will be working on making NgModules optional. This work lets developers develop standalone components and implement an alternative API for declaring the compilation scope of the component. We kicked this project off with high-level design discussions that we captured in an RFC.
  </docs-card>
  <docs-card title="Design strict typing for @angular/forms" link="Completed Q1 2022" href="guide/forms/typed-forms">
  We will work on finding a way to implement stricter type checking for reactive forms with minimal backward incompatible implications. This way, we let developers catch more issues during development time, enable better text editor and IDE support, and improve the type checking for reactive forms.
  </docs-card>
  <docs-card title="Improve integration of Angular DevTools with framework" link="Completed Q1 2022" href="tools/devtools">
  To improve the integration of Angular DevTools with the framework, we are working on moving the codebase to the angular/angular monorepository. This includes transitioning Angular DevTools to Bazel and integrating it into the existing processes and CI pipeline.
  </docs-card>
  <docs-card title="Launch advanced compiler diagnostics" link="Completed Q1 2022" href="reference/extended-diagnostics">
  Extend the diagnostics of the Angular compiler outside type checking. Introduce other correctness and conformance checks to further guarantee correctness and best practices.
  </docs-card>
  <docs-card title="Update our e2e testing strategy" link="Completed Q3 2021" href="guide/testing">
  To ensure we provide a future-proof e2e testing strategy, we want to evaluate the state of Protractor, community innovations, e2e best practices, and explore novel opportunities. As first steps of the effort, we shared an RFC and worked with partners to ensure smooth integration between the Angular CLI and state-of-the-art tooling for e2e testing. As the next step, we need to finalize the recommendations and compile a list of resources for the transition.
  </docs-card>
  <docs-card title="Angular libraries use Ivy" link="Completed Q3 2021" href="tools/libraries">
  Earlier in 2020, we shared an RFC for Ivy library distribution. After invaluable feedback from the community, we developed a design of the project. We are now investing in the development of Ivy library distribution, including an update of the library package format to use Ivy compilation, unblock the deprecation of the View Engine library format, and ngcc.
  </docs-card>
  <docs-card title="Improve test times and debugging with automatic test environment tear down" link="Completed Q3 2021" href="guide/testing">
  To improve test time and create better isolation across tests, we want to change TestBed to automatically clean up and tear down the test environment after each test run.
  </docs-card>
  <docs-card title="Deprecate and remove IE11 support" link="Completed Q3 2021" href="https://github.com/angular/angular/issues/41840">
  Internet Explorer 11 (IE11) has been preventing Angular from taking advantage of some of the modern features of the Web platform. As part of this project we are going to deprecate and remove IE11 support to open the path for modern features that evergreen browsers provide. We ran an RFC to collect feedback from the community and decide on next steps to move forward.
  </docs-card>
  <docs-card title="Leverage ES2017+ as the default output language" link="Completed Q3 2021" href="https://www.typescriptlang.org/docs/handbook/tsconfig-json.html">
  Supporting modern browsers lets us take advantage of the more compact, expressive, and performant new syntax of JavaScript. As part of this project we will investigate what the blockers are to moving forward with this effort, and take the steps to enable it.
  </docs-card>
  <docs-card title="Accelerated debugging and performance profiling with Angular DevTools" link="Completed Q2 2021" href="tools/devtools">
  We are working on development tooling for Angular that provides utilities for debugging and performance profiling. This project aims to help developers understand the component structure and the change detection in an Angular app.
  </docs-card>
  <docs-card title="Streamline releases with consolidated Angular versioning & branching" link="Completed Q2 2021" href="reference/releases">
  We want to consolidate release management tooling between the multiple GitHub repositories for Angular (angular/angular, angular/angular-cli, and angular/components). This effort lets us reuse infrastructure, unify and simplify processes, and improve the reliability of our release process.
  </docs-card>
  <docs-card title="Higher developer consistency with commit message standardization" link="Completed Q2 2021" href="https://github.com/angular/angular">
  We want to unify commit message requirements and conformance across Angular repositories (angular/angular, angular/components, and angular/angular-cli) to bring consistency to our development process and reuse infrastructure tooling.
  </docs-card>
  <docs-card title="Transition the Angular language service to Ivy" link="Completed Q2 2021" href="tools/language-service">
  The goal of this project is to improve the experience and remove legacy dependency by transitioning the language service to Ivy. Today the language service still uses the View Engine compiler and type checking, even for Ivy apps. We want to use the Ivy template parser and improved type checking for the Angular Language service to match app behavior. This migration is also a step towards unblocking the removal of View Engine, which will simplify Angular, reduce the npm package size, and improve the maintainability of the framework.
  </docs-card>
  <docs-card title="Increased security with native Trusted Types in Angular" link="Completed Q2 2021" href="guide/security">
  In collaboration with the Google security team, we are adding support for the new Trusted Types API. This web platform API helps developers build more secure web apps.
  </docs-card>
  <docs-card title="Optimized build speed and bundle sizes with Angular CLI webpack 5" link="Completed Q2 2021" href="tools/cli/build">
  As part of the v11 release, we introduced an opt-in preview of webpack 5 in the Angular CLI. To ensure stability, we will continue iterating on the implementation to enable build speed and bundle size improvements.
  </docs-card>
  <docs-card title="Faster apps by inlining critical styles in Universal apps" link="Completed Q1 2021" href="guide/ssr">
  Loading external stylesheets is a blocking operation, which means that the browser cannot start rendering your app until it loads all the referenced CSS. Having render-blocking resources in the header of a page can significantly impact its load performance, for example, its first contentful paint. To make apps faster, we have been collaborating with the Google Chrome team on inlining critical CSS and loading the rest of the styles asynchronously.
  </docs-card>
  <docs-card title="Improve debugging with better Angular error messages" link="Completed Q1 2021" href="reference/errors">
  Error messages often bring limited actionable information to help developers resolve them. We have been working on making error messages more discoverable by adding associated codes, developing guides, and other materials to ensure a smoother debugging experience.
  </docs-card>
  <docs-card title="Improved developer onboarding with refreshed introductory documentation" link="Completed Q1 2021" href="tutorials">
  We will redefine the user learning journeys and refresh the introductory documentation. We will clearly state the benefits of Angular, how to explore its capabilities and provide guidance so developers can become proficient with the framework in as little time as possible.
  </docs-card>
  <docs-card title="Expand component harnesses best practices" link="Completed Q1 2021" href="https://material.angular.io/guide/using-component-harnesses">
  Angular CDK introduced the concept of component test harnesses to Angular in version 9. Test harnesses let component authors create supported APIs for testing component interactions. We are continuing to improve this harness infrastructure and clarifying the best practices around using harnesses. We are also working to drive more harness adoption inside of Google.
  </docs-card>
  <docs-card title="Author a guide for content projection" link="Completed Q2 2021" href="https://angular.io/docs">
  Content projection is a core Angular concept that does not have the presence it deserves in the documentation. As part of this project we want to identify the core use cases and concepts for content projection and document them.
  </docs-card>
  <docs-card title="Migrate to ESLint" link="Completed Q4 2020" href="tools/cli">
  With the deprecation of TSLint we will be moving to ESLint. As part of the process, we will work on ensuring backward compatibility with our current recommended TSLint configuration, implement a migration strategy for existing Angular apps and introduce new tooling to the Angular CLI toolchain.
  </docs-card>
  <docs-card title="Operation Bye Bye Backlog (also known as Operation Byelog)" link="Completed Q4 2020" href="https://github.com/angular/angular/issues">
  We are actively investing up to 50% of our engineering capacity on triaging issues and PRs until we have a clear understanding of broader community needs. After that, we will commit up to 20% of our engineering capacity to keep up with new submissions promptly.
  </docs-card>
</docs-card-container>

