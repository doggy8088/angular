<docs-decorative-header title="什麼是 Angular？" imgSrc="adev/src/assets/images/what_is_angular.svg"> <!-- markdownlint-disable-line -->
</docs-decorative-header>

<big style="margin-top: 2em">
Angular 是個讓開發人員能建立快速、可靠應用程式的網頁框架。
</big>

由 Google 專屬團隊維護，Angular 提供一套廣泛的工具、API 和函式庫，以簡化和精簡您的開發工作流程。Angular 為您提供一個穩固的平台，可讓您建立快速、可靠的應用程式，而且隨著團隊規模和程式碼庫大小的增加，應用程式也能夠擴充。

**想看一些程式碼嗎？**跳到我們的 [Essentials](essentials) 快速瀏覽一下
在使用 Angular 時的情況，或者在 [Tutorial](tutorials/learn-angular) 中開始，如果您
喜歡按照逐步指示操作。

## 賦予開發動力的功能

<docs-card-container>
  <docs-card title="使用見解元件模型和彈性相依性注入系統來讓您的程式庫保持井然有序" href="guide/components" link="開始使用元件">
  Angular 元件讓您能夠輕鬆地將程式碼分割為封裝良好的部分。

多功能的相依性注入可協助您保持程式碼模組化、鬆散耦合且可測試。
  </docs-card>
  <docs-card title="透過基於訊號的細粒度反應性取得快速的狀態更新" href="guide/signals" link="探索 Angular 訊號">
  我們細粒度的反應性模型結合編譯時期的最佳化，簡化開發，並協助預設建置更快的應用程式。

以細微的方式追蹤應用程式中如何以及在哪裡使用狀態，讓框架能夠透過高度最佳化的指令來快速呈現更新。
  </docs-card>
  <docs-card title="透過 SSR、SSG、水化和新一代延遲載入來滿足效能目標" href="guide/ssr" link="閱讀有關 SSR 的資訊">
    Angular 支援伺服器端渲染 (SSR) 和靜態網站產生 (SSG)，以及完整的 DOM 水化。範本中的 `@defer` 區塊讓您可以輕鬆地將範本以宣告方式區分成可以延遲載入的部分。
  </docs-card>
  <docs-card title="保證所有內容都能與 Angular 的第一方模組搭配運作，這些模組適用於表單、路由等">
  [Angular 的路由器](guide/routing) 提供功能豐富的導覽工具組，包括支援路由防護、資料解析、延遲載入等多項功能。

[Angular 的表單模組](guide/forms) 提供了表單參與和驗證的標準化系統。
  </docs-card>
</docs-card-container>

## 比以往更快地開發應用程式

<docs-card-container>
  <docs-card title="使用 Angular CLI 輕鬆建置、服務、測試、部署" href="tools/cli" link="Angular CLI">
  Angular CLI 使用您需要在已部署的產品應用程式中成長的指令，在不到一分鐘的時間內讓您的專案開始執行。
  </docs-card>
  <docs-card title="使用 Angular DevTools 瀏覽器擴充功能，以視覺化方式除錯、分析和最佳化您的程式碼" href="tools/devtools" link="Angular DevTools">
  Angular DevTools 與您的瀏覽器的開發人員工具並列。它有助於除錯和分析您的應用程式，包括元件樹狀檢視器、相依性注入樹狀檢視，以及自訂效能剖析火焰圖。
  </docs-card>
  <docs-card title="使用 ng update 絕不錯過任何版本" href="cli/update" link="ng update">
  Angular CLI 的 `ng update` 執行自動化程式碼轉換，可自動處理例行中斷性變更，大幅簡化重大版本更新。與最新版本保持同步，讓您的應用程式儘可能快速且安全。
  </docs-card>
  <docs-card title="在您最喜歡的編輯器中使用 IDE 整合，保持生產力" href="tools/language-service" link="語言服務">
  Angular 的 IDE 語言服務可在您最喜歡的編輯器中提供程式碼完成功能、導覽、重構和即時診斷。
  </docs-card>
</docs-card-container>

## 自信發貨

<docs-card-container>
  <docs-card title="根據 Google 的龐大單一存放庫逐一驗證提交" href="https://cacm.acm.org/magazines/2016/7/204032-why-google-stores-billions-of-lines-of-code-in-a-single-repository/fulltext" link="瞭解 Google 的單一存放庫">
  每次 Angular 提交都會比對 Google 內部程式碼
  存放庫中數十萬項測試，代表無數實際情境。

Angular 致力於部分 Google 最大的產品的穩定性，包括 Google Cloud。
此承諾確保變更經過良好測試、向後相容，並且只要有可能就會包含遷移工具。
</docs-card>
<docs-card title="明確的支援政策和可預測的發佈時程" href="reference/releases" link="版本管理和發佈">
Angular 可預測的基於時間的發佈時程讓您的組織確信該框架的穩定性和向後相容性。長期支援 (LTS) 窗口確保您在需要時獲得關鍵的安全修復。第一方更新工具、指南和自動遷移示意圖有助於讓您的應用程式保持最新，並採用該框架和網路平台的最新進展。
</docs-card>
</docs-card-container>

## 任何規模都能運作

<docs-card-container>
  <docs-card title="透過國際化支援，讓您的使用者無遠弗屆" href="guide/i18n" link="國際化">
  Angular 的國際化功能可處理訊息翻譯和格式化，包括支援 unicode 標準 ICU 語法。
  </docs-card>
  <docs-card title="透過預設安全性保護您的使用者" href="guide/security" link="安全性">
  Angular 與 Google 的世界級安全性工程師合作，旨在讓開發預設上更安全。內建安全性功能，包括 HTML 清理和值得信賴的類型支援，可協助保護您的使用者免於遭受常見的漏洞，例如跨網站指令碼和跨網站請求偽造。
  </docs-card>
  <docs-card title="使用 Vite 和 esbuild 讓大型團隊保持生產力" href="tools/cli/esbuild" link="ESBuild 和 Vite">
  Angular CLI 包含使用 Vite 和 ESBuild 的快速、現代化建置管道。開發人員回報，使用不到一分鐘的時間即可建置包含數十萬行程式碼的專案。
  </docs-card>
  <docs-card title="已在 Google 部分規模最大的網路應用程式中獲得驗證">
  Google 的多款大型產品建立在 Angular 的架構上，並協助開發新功能，進一步提升 Angular 的可擴充性，包括 [Google Fonts](https://fonts.google.com/) 到 [Google Cloud](https://console.cloud.google.com)。
  </docs-card>
</docs-card-container>

## 開源優先

<docs-card-container>
  <docs-card title="在 GitHub 上公開製作" href="https://github.com/angular/angular" link="Star our GitHub">
  好奇我們在做什麼嗎？我們在 GitHub 上公開每個 PR 和提交。遇到問題或錯誤嗎？我們定期分類 GitHub 問題，以確保我們對社群做出回應並與其互動，並解決你遇到的真實問題。
  </docs-card>
  <docs-card title="以透明度打造" href="roadmap" link="閱讀我們的公開路線圖">
  我們的團隊會公開我們目前和未來的路線圖，並重視你的意見反應。我們會發布意見徵詢 (RFC) 來收集關於較大功能變更的意見反應，並確保在塑造 Angular 的未來方向時，能聽到社群的聲音。
  </docs-card>
</docs-card-container>

## 一個蓬勃發展的社群

<docs-card-container>
  <docs-card title="課程、部落格和資源" href="https://devlibrary.withgoogle.com/products/angular?sort=added" link="查看 DevLibrary">
  我們的社群由具天賦的開發人員、作家、講師、播客主等組成。Google for Developers 資源庫僅是高品質資源的範例，可供新舊開發人員繼續開發。
  </docs-card>
  <docs-card title="開放原始碼" href="https://github.com/angular/angular/blob/main/CONTRIBUTING.md" link="為 Angular 貢獻心力">
  我們很感謝開放原始碼貢獻者，讓 Angular 成為更好的框架，造福所有人。我們鼓勵任何有興趣的人從修正文件中的錯字到新增主要功能，都可以在我們的 GitHub 上開始動手做。
  </docs-card>
  <docs-card title="社群合作夥伴關係" href="https://developers.google.com/community/experts/directory?specialization=angular" link="認識 Angular GDE">
  我們的團隊與個人、教育工作者和企業合作，以確保我們持續支援開發人員。Angular Google Developer Experts (GDE) 代表世界各地的社群領導者，他們以 Angular 進行教育、組織和開發。企業合作夥伴關係有助於確保 Angular 能很好地擴充到科技產業的領導者。
  </docs-card>
  <docs-card title="與其他 Google 技術合作">
  Angular 與其他 Google 技術和團隊緊密合作，以改善網路。

我們與 Chrome Aurora 持續合作，積極探索改善網路使用者體驗的方法，開發內建效能最佳化功能，例如 NgOptimizedImage，以及改善 Angular 的核心網路指標。

我們也與 [Firebase](https://firebase.google.com/)、[Tensorflow](https://www.tensorflow.org/)、[Flutter](https://flutter.dev/)、[Material Design](https://m3.material.io/) 和 [Google Cloud](https://cloud.google.com/) 合作，以確保我們在整個開發人員工作流程中提供有意義的整合。
  </docs-card>
</docs-card-container>

<docs-callout title="加入動能！">
  <docs-pill-row>
    <docs-pill href="roadmap" title="閱讀 Angular 的路線圖"/>
    <docs-pill href="playground" title="試用我們的遊戲場"/>
    <docs-pill href="tutorials" title="透過教學課程學習"/>
    <docs-pill href="https://youtube.com/playlist?list=PL1w1q3fL4pmj9k1FrJ3Pe91EPub2_h4jF" title="觀看我們的 YouTube 課程"/>
    <docs-pill href="api" title="參考我們的 API"/>
  </docs-pill-row>
</docs-callout>
