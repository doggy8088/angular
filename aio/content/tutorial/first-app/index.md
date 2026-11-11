# 打造你的第一個 Angular 應用程式

本教學由一系列課程組成，帶你認識開始用 Angular 寫程式所需要知道的 Angular 概念。

你可以依照自己的步調，全部做完或只做其中幾課，順序也可以自由安排。

## 開始之前

為了讓本教學有最好的學習體驗，請先確認下列需求，確保你具備順利完成課程所需的一切。

<!-- markdownLint-disable MD001 -->

### 你的經驗

本教學的課程假設你已經具備下列經驗：

1.  曾經直接編輯 HTML 來建立 HTML 網頁。
1.  曾經用 JavaScript 為網站內容撰寫程式。
1.  讀過層疊樣式表（CSS）內容，並了解選擇器的使用方式。
1.  曾經使用命令列指令在電腦上執行工作。

### 你的設備

這些課程可以使用本機安裝的 Angular 工具來完成，也可以在網頁瀏覽器中使用 StackBlitz 來完成。本機 Angular 開發可以在 Windows、MacOS 或 Linux 系統上進行。

## 你的第一個 Angular 應用程式概念預覽

本教學的課程會建立一個 Angular 應用程式，列出待租房屋並顯示個別房屋的詳細資訊。 這個應用程式使用了許多 Angular 應用程式常見的功能。
<section class="lightbox">
  <img alt="英雄儀表板的輸出" src="generated/images/guide/faa/homes-app-landing-page.png">
</section>

## ## 本機開發環境

請在你打算用來進行本教學的電腦上，透過命令列工具執行下列步驟。

## 步驟 1 - 確認 Angular 需要的 `node.js` 版本

Angular 需要使用中的 LTS 或維護中 LTS 版本的 Node。我們先來確認你的 `node.js` 版本。如需特定版本需求的資訊，請參閱 [package.json 檔案](https://unpkg.com/browse/@angular/core@15.1.5/package.json)中的 engines 屬性。

在 **Terminal** 視窗中：
1. 執行下列指令：`node --version`
1. 確認顯示的版本號碼符合需求。

## 步驟 2 - 為 Angular 安裝正確版本的 `node.js`

如果你尚未安裝任何版本的 `node.js`，請依照 [nodejs.org 上的安裝說明](https://nodejs.org/en/download/)進行


## 步驟 3 - 安裝最新版本的 Angular

安裝好 `node.js` 與 `npm` 之後，下一步是安裝 [Angular CLI](/cli)，它為高效率的 Angular 開發提供工具支援。

在 **Terminal** 視窗中執行下列指令：`npm install -g @angular/cli`。

## 步驟 4 - 安裝整合式開發環境（IDE）

你可以使用任何你偏好的工具來使用 Angular 建立應用程式。我們推薦下列工具：

1. [Visual Studio Code](https://code.visualstudio.com/)
2. 選用但推薦的步驟：安裝 [Angular Language Service](https://marketplace.visualstudio.com/items?itemName=Angular.ng-template)，進一步提升你的開發體驗

## 課程回顧

在本課程中，你了解了將在本教學中建立的應用程式，並準備好你的本機電腦來開發 Angular 應用程式。

## 後續步驟

*  [第一個 Angular 應用程式第 1 課 - Hello world](tutorial/first-app/first-app-lesson-01)

## 更多資訊

如需本課所涵蓋主題的更多資訊，請造訪：

* [什麼是 Angular](/guide/what-is-angular)
* [Angular CLI 參考](/cli)

@reviewed 2023-07-12
