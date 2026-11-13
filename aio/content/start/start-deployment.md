# 試試看：部署


若要部署應用程式，你必須先編譯它，然後將 JavaScript、CSS 與 HTML 託管在網頁伺服器上。建置完成的 Angular 應用程式具有很高的可移植性，可以存放在任何環境中，或由任何技術提供服務，例如 Node、Java、.NET、PHP 等等。

<div class="alert is-helpful">

無論你是直接從[第 1 部分](start "Try it: A basic app")來到這裡，或是已透過[應用程式內導覽](start/start-routing "Try it: In-app navigation")、[管理資料](start/start-data "Try it: Manage data")與[使用表單取得使用者輸入](start/start-forms "Try it: Forms for user input")等節完成整個線上商店應用程式，你都有一個可以依照本節說明加以部署的應用程式。

</div>

## 分享你的應用程式

StackBlitz 專案依預設是公開的，讓你可以透過專案 URL 分享你的 Angular 應用程式。請記住，這是分享想法與原型的絕佳方式，但並非為正式環境託管所設計。

1. 在你的 StackBlitz 專案中，請確認你已 fork 或儲存你的專案。
1. 在預覽頁面中，你應該會看到一個類似 `https://<Project ID>.stackblitz.io` 的 URL。
1. 將此 URL 分享給朋友或同事。
1. 造訪你 URL 的使用者會看到開發伺服器啟動，接著你的應用程式便會載入。

## 在本機建置

若要在本機或為正式環境建置你的應用程式，請按一下左側選單中 `Project` 對面的 `Download Project` 圖示，從你的 StackBlitz 專案下載原始碼，下載你的檔案。

下載並解壓縮原始碼後，使用 [Angular Console](https://angularconsole.com "Angular Console web site") 提供應用程式服務，或安裝 `Node.js` 並使用 Angular CLI 提供你的應用程式服務。

在終端機中，使用下列指令全域安裝 Angular CLI：

```sh
npm install -g @angular/cli
```

這會在你的系統上安裝 `ng` 指令，這是你用來建立新的工作區、新的專案，在開發期間提供應用程式服務，或產生要分享或散發的建置的指令。

使用 [`ng new`](cli/new "CLI ng new command reference") 指令建立新的 Angular CLI 工作區：

```sh
ng new my-project-name
```

在你剛以 CLI 產生的應用程式中，將 `/src` 資料夾換成你從 `StackBlitz` 下載的那一份，然後執行建置。

```sh
ng build --prod
```

這將產生你需要部署的檔案。

<div class="alert is-helpful">

如果上述 `ng build` 指令因缺少套件而擲出錯誤，請將缺少的相依性附加到你本機專案的 `package.json` 檔案中，使其與下載的 StackBlitz 專案中的檔案相符。

</div>

#### 託管建置完成的專案

`dist/my-project-name` 資料夾中的檔案是靜態的。這表示你可以將它們託管在任何能夠提供檔案服務的網頁伺服器上（例如 `Node.js`、Java、.NET），或任何後端（例如 Firebase、Google Cloud 或 App Engine）。

### 在 Firebase 上託管 Angular 應用程式

讓你的網站上線最簡單的方法之一，就是使用 Firebase 託管它。

1. 在 [Firebase](https://firebase.google.com/ "Firebase web site") 註冊一個 firebase 帳號。
1. 建立一個新專案，名稱可任取。
1. 使用 `ng add @angular/fire` 加入將負責處理部署的 `@angular/fire` schematics。
1. 使用 `firebase login` 與 `firebase init`，將你的 CLI 連接到 Firebase 帳號，並初始化與專案的連接。
1. 依照提示選取你要為託管建立的 `Firebase` 專案。
    - 在第一個提示中選取 `Hosting` 選項。
    - 選取你先前在 Firebase 上建立的專案。
    - 選取 `dist/my-project-name` 作為公開目錄。
1. 使用 `ng deploy` 部署你的應用程式。
1. 部署完成後，造訪 https://your-firebase-project-name.firebaseapp.com 即可看到它上線！

### 在其他任何地方託管 Angular 應用程式

若要在其他網頁主機上託管 Angular 應用程式，請將檔案上傳或傳送到該主機。
由於你建置的是單頁應用程式，你還需要確保將任何無效的 URL 重新導向到你的 `index.html` 檔案。
如需進一步了解應用程式的開發與散發，請參閱[建置與提供服務](guide/build "Building and Serving Angular Apps")與[部署](guide/deployment "Deployment guide")指南。

## 加入 Angular 社群

你現在是一位 Angular 開發者了！[分享這個時刻](https://twitter.com/intent/tweet?url=https://angular.io/start&text=I%20just%20finished%20the%20Angular%20Getting%20Started%20Tutorial "Angular on Twitter")，告訴我們你對這個入門練習的想法，或提交[對未來版本的建議](https://github.com/angular/angular/issues/new/choose "Angular GitHub repository new issue form")。

Angular 還提供更多的功能，而你現在已打下基礎，能夠建置應用程式並探索那些其他功能：

* Angular 為行動應用程式、動畫、國際化、伺服器端渲染等提供進階功能。
* [Angular Material](https://material.angular.io/ "Angular Material web site") 提供豐富的 Material Design 元件程式庫。
* [Angular Protractor](https://protractor.angular.io/ "Angular Protractor web site") 為 Angular 應用程式提供端到端測試框架。
* Angular 也有各式各樣的[第三方工具與程式庫網路](resources "Angular resources list")。

追蹤 [Angular 部落格](https://blog.angular.io/ "Angular blog")，掌握最新動態。
