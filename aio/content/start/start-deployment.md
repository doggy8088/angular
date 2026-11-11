# 部署應用程式

部署應用程式是指編譯或建置你的程式碼，並將 JavaScript、CSS 與 HTML 託管在網頁伺服器上的過程。

本節建立在[入門](start "Try it: A basic application")教學先前步驟的基礎上，並說明如何部署你的應用程式。

## 先備條件

最佳做法是在部署專案之前先在本機執行它。若要在本機執行專案，你的電腦上需要安裝下列項目：

*   [Node.js](https://nodejs.org/en)。
*   [Angular CLI](https://cli.angular.io)。在終端機中，使用下列指令全域安裝 Angular CLI：

    <code-example format="shell" language="shell">

    npm install -g &commat;angular/cli

    </code-example>

有了 Angular CLI，你可以使用 `ng` 指令來建立新的工作區、新的專案，在開發期間提供應用程式服務，或產生要分享或散發的建置。

## 在本機執行應用程式

1.  按一下左側選單中 `Download Project` 對面的 `Project` 圖示，從你的 StackBlitz 專案下載原始碼，將專案下載為 zip 壓縮檔。

    <div class="lightbox">

    <img alt="下載 StackBlitz 專案" src="generated/images/guide/start/download-project.png">

    </div>

1.  解壓縮該壓縮檔，並切換目錄到新建立的專案。例如：

    <code-example format="shell" language="shell">

    cd angular-ynqttp

    </code-example>

1.  若要下載並安裝 npm 套件，請使用下列 npm CLI 指令：

    <code-example format="shell" language="shell">

    npm install

    </code-example>

1.  使用下列 CLI 指令在本機執行你的應用程式：

    <code-example format="shell" language="shell">

    ng serve

    </code-example>

1.  若要在瀏覽器中查看你的應用程式，請前往 http://localhost:4200/。如果預設連接埠 4200 無法使用，你可以使用 port 旗標指定另一個連接埠，如下列範例所示：

     <code-example format="shell" language="shell">

    ng serve --port 4201

    </code-example>

在提供應用程式服務時，你可以編輯程式碼，並在瀏覽器中看到變更自動更新。若要停止 `ng serve` 指令，請按下 `Ctrl`+`c`。

<a id="building"></a>

## 建置與託管應用程式

1.  若要為正式環境建置應用程式，請使用 `build` 指令。根據預設，此指令會使用 `production` 建置設定。

    <code-example format="shell" language="shell">

    ng build

    </code-example>

此指令會在應用程式根目錄中建立一個 `dist` 資料夾，其中包含託管服務提供應用程式服務所需的所有檔案。

    <div class="alert is-helpful">

    如果上述 `ng build` 指令因缺少套件而擲出錯誤，請將缺少的相依性附加到你本機專案的 `package.json` 檔案中，使其與下載的 StackBlitz 專案中的檔案相符。

    </div>

1.  將 `dist/my-project-name` 資料夾的內容複製到你的網頁伺服器。由於這些檔案是靜態的，你可以將它們託管在任何能夠提供檔案服務的網頁伺服器上，例如 `Node.js`、Java、.NET，或任何後端，例如 [Firebase](https://firebase.google.com/docs/hosting)、[Google Cloud](https://cloud.google.com/solutions/web-hosting) 或 [App Engine](https://cloud.google.com/appengine/docs/standard/python/getting-started/hosting-a-static-website)。如需進一步了解，請參閱[建置與提供服務](guide/build "Building and Serving Angular Apps")與[部署](guide/deployment "Deployment guide")。

## 後續步驟

在本教學中，你已經打下基礎，可以在行動開發、UX/UI 開發與伺服器端渲染等領域探索 Angular 的世界。你可以透過學習 Angular 的更多功能、參與充滿活力的社群，以及探索強大的生態系，進一步深入了解。

### 進一步學習 Angular

如需更深入的教學，帶你逐步在本機建立應用程式並探索 Angular 許多最受歡迎的功能，請參閱[英雄之旅](tutorial)。

若要探索 Angular 的基礎概念，請參閱「Understanding Angular」一節中的指南，例如 [Angular 元件總覽](guide/component-overview) 或[範本語法](guide/template-syntax)。

### 加入社群

[發文告訴大家你已完成本教學](https://twitter.com/intent/tweet?url=https://angular.io/start&text=I%20just%20finished%20the%20Angular%20Getting%20Started%20Tutorial "Angular on Twitter")，告訴我們你的想法，或提交[對未來版本的建議](https://github.com/angular/angular/issues/new/choose "Angular GitHub repository new issue form")。

追蹤 [Angular 部落格](https://blog.angular.io/ "Angular blog")，掌握最新動態。

### 探索 Angular 生態系

若要支援你的 UX/UI 開發，請參閱 [Angular Material](https://material.angular.io/ "Angular Material web site")。

Angular 社群也有廣泛的[第三方工具與程式庫網絡](resources "Angular resources list")。

@reviewed 2021-09-15
