<docs-decorative-header title="什麼是 Angular？" imgSrc="adev/src/assets/images/what_is_angular.svg"> <!-- markdownlint-disable-line -->
</docs-decorative-header>

<big style="margin-top: 2em">
Angular 是一個 Web 框架，讓開發者能建置快速、可靠的應用程式。
</big>

Angular 由 Google 一支專責團隊維護，提供一整套豐富的工具、API 與函式庫，簡化並加速你的開發流程。Angular 為你提供穩固的平台，讓你建置快速、可靠的應用程式，無論團隊人數或程式碼庫規模如何成長，都能從容因應。

**想看看程式碼嗎？** 前往我們的[精華指南](essentials)，快速總覽使用 Angular 的實際樣貌；或者，如果你偏好一步步跟著操作，可以從[教學](tutorials/learn-angular)開始。

## 驅動你開發工作的功能 {#features-that-power-your-development}

<docs-card-container>
  <docs-card title="以有主見的元件模型與彈性的依賴注入系統，讓你的程式碼庫井然有序" href="guide/components" link="開始使用元件">
  Angular 元件讓你輕鬆把程式碼拆分成封裝良好的小部分。

多功能的依賴注入，協助你讓程式碼保持模組化、鬆耦合，而且可測試。
</docs-card>
<docs-card title="以奠基於 Signals 的細粒度反應式機制，獲得快速的狀態更新" href="guide/signals" link="探索 Angular Signals">
我們細粒度的反應式模型，結合編譯時期的最佳化，簡化了開發工作，並預設就能建置出更快的應用程式。

以細粒度追蹤狀態在整個應用程式中如何被使用、在何處被使用，讓框架能透過高度最佳化的指令，快速地渲染更新。
</docs-card>
<docs-card title="以 SSR、SSG、水合與新一代的延遲載入，達成你的效能目標" href="guide/ssr" link="了解 SSR">
Angular 同時支援伺服器端渲染（SSR）與靜態網站產生（SSG），並提供完整的 DOM 水合（hydration）。範本中的 `@defer` 區塊，讓你能以宣告式的方式，輕鬆把範本拆分成可延遲載入的部分。
</docs-card>
<docs-card title="以 Angular 的第一方模組（表單、路由等），確保一切協同運作">
[Angular 路由](guide/routing) 提供功能豐富的導覽工具組，包括路由守衛、資料解析、延遲載入等眾多功能的支援。

[Angular 的表單模組](guide/forms) 提供一套標準化的系統，處理表單參與與驗證。
</docs-card>
</docs-card-container>

## 以前所未有的速度開發應用程式 {#develop-applications-faster-than-ever}

<docs-card-container>
  <docs-card title="以 Angular CLI 輕鬆建置、伺服、測試與部署" href="tools/cli" link="Angular CLI">
  Angular CLI 讓你的專案在一分鐘內就能跑起來，並提供你所需的指令，一路成長為部署上線的正式應用程式。
  </docs-card>
  <docs-card title="以 Angular DevTools 瀏覽器擴充功能，視覺化地除錯、分析與最佳化你的程式碼" href="tools/devtools" link="Angular DevTools">
  Angular DevTools 與你瀏覽器的開發者工具並列運作，協助你除錯與分析應用程式，包括元件樹檢視器、依賴注入樹狀檢視，以及自訂的效能分析火焰圖。
  </docs-card>
  <docs-card title="以 ng update 不錯過任何版本" href="cli/update" link="ng update">
  Angular CLI 的 `ng update` 會執行自動化的程式碼轉換，自動處理例行的破壞性變更，大幅簡化主要版本升級。保持在最新版本，能讓你的應用程式盡可能快速又安全。
  </docs-card>
  <docs-card title="在你喜愛的編輯器中，透過 IDE 整合保持高生產力" href="tools/language-service" link="Language service">
  Angular 的 IDE 語言服務，為你喜愛的編輯器提供程式碼自動完成、導覽、重構與即時診斷功能。
  </docs-card>
</docs-card-container>

## 安心交付 {#ship-with-confidence}

<docs-card-container>
  <docs-card title="每一筆提交都對照 Google 龐大的單一程式碼庫驗證" href="https://cacm.acm.org/magazines/2016/7/204032-why-google-stores-billions-of-lines-of-code-in-a-single-repository/fulltext" link="了解 Google 的單一程式碼庫">
  Angular 的每一筆提交，都會對照 Google 內部程式碼庫中數十萬個測試進行檢查，涵蓋無數真實世界的使用情境。

Angular 致力於為 Google 一些最大的產品（包括 Google Cloud）提供穩定性。這份承諾確保每項變更都經過充分測試、保持向後相容，並在可能的情況下附帶遷移工具。
</docs-card>
<docs-card title="明確的支援政策與可預期的發佈時程" href="reference/releases" link="版本管理與發佈">
Angular 以時間為基準、可預期的發佈時程，讓你的組織對框架的穩定性與向後相容性充滿信心。長期支援（LTS）期間確保你在需要時能取得關鍵的安全性修正。第一方的更新工具、指南與自動化遷移原理圖，協助你的應用程式跟上框架與 Web 平台的最新進展。
</docs-card>
</docs-card-container>

## 適用於任何規模 {#works-at-any-scale}

<docs-card-container>
  <docs-card title="以國際化支援觸及世界各地的使用者" href="guide/i18n" link="國際化">
  Angular 的國際化功能處理訊息翻譯與格式化，包括對 Unicode 標準 ICU 語法的支援。
  </docs-card>
  <docs-card title="預設安全，保護你的使用者" href="best-practices/security" link="安全性">
  Angular 與 Google 世界級的安全工程師合作，致力於讓開發預設就安全。內建的安全功能，包括 HTML 清理與 trusted type 支援，協助保護你的使用者免於跨網站指令碼與跨網站請求偽造等常見弱點的威脅。
  </docs-card>
  <docs-card title="以 Vite 與 esbuild 讓大型團隊保持高生產力" href="tools/cli/build-system-migration" link="ESBuild and Vite">
  Angular CLI 內含使用 Vite 與 ESBuild 的快速現代化建置管線。據開發者回報，擁有數十萬行程式碼的專案，也能在一分鐘內完成建置。
  </docs-card>
  <docs-card title="已在 Google 一些最大的 Web 應用程式中實證">
  Google 的大型產品建立在 Angular 的架構之上，並協助開發新功能，進一步提升 Angular 的可擴展性，從 [Google Fonts](https://fonts.google.com/) 到 [Google Cloud](https://console.cloud.google.com) 都是如此。
  </docs-card>
</docs-card-container>

## 開源優先 {#open-source-first}

<docs-card-container>
  <docs-card title="在 GitHub 上公開開發" href="https://github.com/angular/angular" link="在 GitHub 上為我們加星">
  好奇我們正在做什麼嗎？每一個 PR 與每一筆提交都可以在我們的 GitHub 上看到。遇到問題或錯誤嗎？我們會定期分流處理 GitHub 上的 issue，確保我們積極回應社群，解決你面臨的真實問題。
  </docs-card>
  <docs-card title="以透明方式建置" href="roadmap" link="查看我們的公開路線圖">
  我們的團隊會發佈公開的路線圖，說明目前與未來的工作，並且重視你的回饋。我們會發佈意見徵求稿（RFC），針對較大的功能變更收集回饋，確保在塑造 Angular 未來方向時，社群的聲音能被聽見。
  </docs-card>
</docs-card-container>

## 蓬勃發展的社群 {#a-thriving-community}

<docs-card-container>
  <docs-card title="課程、部落格與資源" href="https://devlibrary.withgoogle.com/products/angular?sort=added" link="查看 DevLibrary">
  我們的社群由才華洋溢的開發者、作家、講師、Podcaster 等人組成。Google for Developers 函式庫只是其中一小部分，展現了新手與資深開發者可以善用的高品質資源，持續精進自己。
  </docs-card>
  <docs-card title="Open Source" href="https://github.com/angular/angular/blob/main/CONTRIBUTING.md" link="為 Angular 貢獻心力">
  我們感謝每一位開源貢獻者，是你們讓 Angular 成為對所有人都更好的框架。從修正文件中的一個錯字，到加入重大功能，我們鼓勵任何有興趣的人從我們的 GitHub 開始參與。
  </docs-card>
  <docs-card title="社群夥伴關係" href="https://developers.google.com/community/experts/directory?specialization=angular" link="認識 Angular GDE">
  我們的團隊與個人、教育工作者及企業合作，確保我們始終在支持開發者。Angular Google Developer Experts（GDE）是世界各地的社群領袖，他們教育、組織社群，並以 Angular 進行開發。企業夥伴關係則協助確保 Angular 能為科技產業的領導者良好擴展。
  </docs-card>
  <docs-card title="與其他 Google 技術攜手合作">
  Angular 與其他 Google 技術及團隊密切合作，共同改善 Web。

我們與 Chrome 的 Aurora 團隊持續合作，積極探索改善全 Web 使用者體驗的方法，開發像 NgOptimizedImage 這樣的內建效能最佳化，以及 Angular Core Web Vitals 的改進。

我們也與 [Firebase](https://firebase.google.com/)、[Tensorflow](https://www.tensorflow.org/)、[Flutter](https://flutter.dev/)、[Material Design](https://m3.material.io/) 以及 [Google Cloud](https://cloud.google.com/) 合作，確保我們在整個開發流程中提供有意義的整合。
</docs-card>
</docs-card-container>

<docs-callout title="加入這股動能！">
  <docs-pill-row>
    <docs-pill href="roadmap" title="查看 Angular 的路線圖"/>
    <docs-pill href="playground" title="試用我們的 Playground"/>
    <docs-pill href="tutorials" title="透過教學學習"/>
    <docs-pill href="https://youtube.com/playlist?list=PL1w1q3fL4pmj9k1FrJ3Pe91EPub2_h4jF" title="觀看我們的 YouTube 課程"/>
    <docs-pill href="api" title="查閱我們的 API"/>
  </docs-pill-row>
</docs-callout>
