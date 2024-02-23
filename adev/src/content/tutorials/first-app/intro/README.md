# 建立你的第一個 Angular 應用程式

本教學課程包含介紹 Angular 概念的課程，您需要了解這些概念才能開始以 Angular 編寫程式碼。

您可以選擇做任意多或任意少，而且可以按照任何順序。

HELPFUL: 喜歡影片嗎？我們還為本教學提供完整的 [YouTube 課程](https://youtube.com/playlist?list=PL1w1q3fL4pmj9k1FrJ3Pe91EPub2_h4jF&si=1q9889ulHp8VZ0e7)！

<docs-video src="https://www.youtube.com/embed/xAT0lHYhHMY?si=cKUW_MGn3MesFT7o"/>

## 開始之前

為了獲得本教學的最佳體驗，請檢閱這些需求以確保您擁有成功所需的一切。

### 您的體驗

本教學課程中的課程假設您具有以下方面的經驗：

1. 直接編輯HTML，建立HTML網頁。
1. 以JavaScript程式設計網站內容。
1. 閱讀層疊樣式表(CSS)內容，並了解選擇器的用法。
1. 使用命令列指令，在您的電腦上執行任務。

### 您的設備

這些課程可以使用 Angular 工具的本地安裝或我們的嵌入式編輯器完成。本機 Angular 開發可以在 Windows、MacOS 或基於 Linux 的系統上完成。

注意：尋找像這類的提醒，它們呼叫出可能僅適用於您當地編輯器的步驟。

## 您第一個 Angular 應用程式的概念性預覽

本教學課程中的課程建立一個 Angular 應用程式，可列出出租房屋並顯示個別房屋的詳細資料。
此應用程式使用許多 Angular 應用程式共通的功能。

<img alt="英雄儀表板的輸出" src="https://angular.dev/assets/images/tutorials/first-app/homes-app-landing-page.png">

## 在地開發環境

備註：此步驟僅適用於您的本地環境！

在您要使用此教學課程的電腦上，在命令列工具中執行下列步驟。

<docs-workflow>

<docs-step title="確認 Angular 需要的 `node.js` 版本">
Angular 需要一個 active LTS 或 maintenance LTS 版本的 Node。讓我們確認你的 `node.js` 版本。有關特定版本需求的資訊，請參閱 [package.json 檔案](https://unpkg.com/browse/@angular/core@15.1.5/package.json) 中的 engines 屬性。

從 **Terminal** 視窗：

1. 執行以下指令： `node --version`
1. 確認顯示的版本號碼符合需求。
</docs-step>

<docs-step title="安裝適用於 Angular 的正確版本 `node.js`">
如果您尚未安裝 `node.js` 版本，請遵循 [nodejs.org 上的安裝說明](https://nodejs.org/en/download/)
</docs-step>

<docs-step title="安裝最新版本的 Angular">
安裝 `node.js` 和 `npm` 後，下一步是安裝 [Angular CLI](tools/cli)，它提供了有效的 Angular 開發工具。

從 **終端機** 視窗執行以下指令：`npm install -g @angular/cli`。
</docs-step>

<docs-step title="安裝整合式開發環境 (IDE)">
您可以自由使用任何您偏好的工具來建置使用 Angular 的應用程式。我們推薦以下：

1. [Visual Studio Code](https://code.visualstudio.com/)
2. 作為一個可選但推薦的步驟，您可以透過安裝 [Angular 語言服務](https://marketplace.visualstudio.com/items?itemName=Angular.ng-template) 進一步改善您的開發人員體驗
</docs-step>

</docs-workflow>

有關本課程中涵蓋的主題的更多資訊，請造訪：

<docs-pill-row>
  <docs-pill href="/overview" title="Angular 是什麼"/>
  <docs-pill href="/tools/cli/setup-local" title="設定本機環境和工作區"/>
  <docs-pill href="/cli" title="Angular CLI 參考"/>
</docs-pill-row>
