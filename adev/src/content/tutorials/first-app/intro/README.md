# 打造你的第一個 Angular 應用程式

本教學由一系列課程組成，帶你認識開始用 Angular 寫程式所需要知道的 Angular 概念。

你可以依照自己的步調，全部做完或只做其中幾課，順序也可以自由安排。

HELPFUL: 比較喜歡看影片嗎？我們也為本教學準備了完整的 [YouTube 課程](https://youtube.com/playlist?list=PL1w1q3fL4pmj9k1FrJ3Pe91EPub2_h4jF&si=1q9889ulHp8VZ0e7)！

<docs-video src="https://www.youtube.com/embed/xAT0lHYhHMY?si=cKUW_MGn3MesFT7o"/>

## 開始之前

為了讓本教學有最好的學習體驗，請先確認下列需求，確保你具備順利完成課程所需的一切。

### 你的經驗

本教學的課程假設你已經具備下列經驗：

1. 曾經直接編輯 HTML 來建立 HTML 網頁。
1. 曾經用 JavaScript 為網站內容撰寫程式。
1. 讀過層疊樣式表（CSS）內容，並了解選擇器的使用方式。
1. 曾經使用命令列指令在電腦上執行工作。

### 你的設備

這些課程可以使用本機安裝的 Angular 工具來完成，也可以在我們的內嵌編輯器中完成。本機 Angular 開發可以在 Windows、MacOS 或 Linux 系統上進行。

NOTE: 留意像這樣的提示，它會指出可能只適用於本機編輯器的步驟。

## 你的第一個 Angular 應用程式概念預覽

本教學的課程會建立一個 Angular 應用程式，列出待租房屋並顯示個別房屋的詳細資訊。
這個應用程式使用了許多 Angular 應用程式常見的功能。

<img alt="房屋首頁的輸出畫面" src="assets/images/tutorials/first-app/homes-app-landing-page.png">

## 本機開發環境

NOTE: 這個步驟只適用於你的本機環境！

請在你打算用來進行本教學的電腦上，透過命令列工具執行下列步驟。

<docs-workflow>

<docs-step title="確認 Angular 需要的 `node.js` 版本">
Angular 需要使用中的 LTS 或維護中 LTS 版本的 Node。我們先來確認你的 `node.js` 版本。如需特定版本需求的資訊，請參閱 [package.json 檔案](https://unpkg.com/browse/@angular/core@15.1.5/package.json)中的 engines 屬性。

在 **Terminal** 視窗中：

1. 執行下列指令：`node --version`
1. 確認顯示的版本號碼符合需求。
   </docs-step>

<docs-step title="安裝 Angular 所需正確版本的 `node.js`">
如果你尚未安裝任何版本的 `node.js`，請依照 [nodejs.org 上的安裝說明](https://nodejs.org/en/download/)進行安裝。
</docs-step>

<docs-step title="安裝最新版本的 Angular">
安裝好 `node.js` 與 `npm` 之後，下一步是安裝 [Angular CLI](tools/cli)，它為高效率的 Angular 開發提供工具支援。

在 **Terminal** 視窗中執行下列指令：`npm install -g @angular/cli`。
</docs-step>

<docs-step title="安裝整合開發環境（IDE）">
你可以自由使用任何喜歡的工具來用 Angular 建立應用程式。我們推薦下列工具：

1. [Visual Studio Code](https://code.visualstudio.com/)
2. 選用但推薦的步驟：安裝 [Angular Language Service](https://marketplace.visualstudio.com/items?itemName=Angular.ng-template)，進一步提升你的開發體驗
3. [WebStorm](https://www.jetbrains.com/webstorm/)
   </docs-step>

<docs-step title="選用：設定你的 AI 驅動 IDE">

如果你是在自己偏好的 AI 驅動 IDE 中進行本教學，請[參閱 Angular 提示詞規則與最佳實務](/ai/develop-with-ai)。

</docs-step>

</docs-workflow>

如需本課所涵蓋主題的更多資訊，請造訪：

<docs-pill-row>
  <docs-pill href="/overview" title="什麼是 Angular"/>
  <docs-pill href="/tools/cli/setup-local" title="設定本機環境與工作區"/>
  <docs-pill href="/cli" title="Angular CLI 參考"/>
</docs-pill-row>
