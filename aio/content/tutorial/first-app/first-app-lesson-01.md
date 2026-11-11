# 第 1 課：Hello world
第一課是整個教學的起點，本教學的每一課都會在這個基礎上加入新功能，逐步打造出一個完整的 Angular 應用程式。在這一課中，我們會更新應用程式，讓它顯示知名的文字「Hello World」。

**預估時間**：~10 分鐘

**起始程式碼**：<live-example name="first-app-lesson-00"></live-example>

**已完成程式碼**：<live-example name="first-app-lesson-01"></live-example>

## 你將學到什麼

本課結束後你所得到的更新版應用程式，證明你和你的 IDE 都已準備好開始建立 Angular 應用程式。

## 步驟 1 - 測試預設應用程式

在這個步驟中，下載預設的起始應用程式之後，你會建置預設的 Angular 應用程式。
這能確認你的開發環境具備繼續進行本教學所需的一切。

在 IDE 的 **Terminal** 窗格中：

1. 在你的專案目錄中，進入 `first-app` 目錄。
1. 執行下列指令，安裝執行應用程式所需的相依套件。
    
    <code-example format="shell" language="shell">

    npm install

    </code-example>

1. 執行下列指令，建置並提供預設應用程式。

    <code-example format="shell" language="shell">

    ng serve

    </code-example>

    應用程式應該要能建置完成且沒有錯誤。

1. 在開發電腦的網頁瀏覽器中，開啟 `http://localhost:4200`。
1. 確認預設網站出現在瀏覽器中。
1. 你可以讓 `ng serve` 繼續執行，同時進行接下來的步驟。

## 步驟 2 - 檢視專案中的檔案

在這個步驟中，你會認識組成預設 Angular 應用程式的檔案。

在 IDE 的 **Explorer** 窗格中：

1. 在你的專案目錄中，進入 `first-app` 目錄。
1. 開啟 `src` 目錄，查看下列檔案。
    1. 在檔案總管中找到 Angular 應用程式檔案（`/src`）。
        1. `index.html` 是應用程式的頂層 HTML 範本。
        1. `style.css` 是應用程式的頂層樣式表。
        1. `main.ts` 是應用程式開始執行的地方。
        1. `favicon.ico` 是應用程式的圖示，就像你在任何網站上看到的一樣。
    1. 在檔案總管中找到 Angular 應用程式的元件檔案（`/app`）。
        1. `app.component.ts` 是描述 `app-root` 元件的原始碼檔案。
            這是應用程式中的頂層 Angular 元件。元件是 Angular 應用程式的基本組成單位。
            元件的描述包含元件的程式碼、HTML 範本與樣式，可以寫在這個檔案中，也可以用個別檔案描述。

            在這個應用程式中，樣式放在個別檔案裡，而元件的程式碼與 HTML 範本則放在這個檔案中。
        1. `app.component.css` 是這個元件的樣式表。
        1. 新的元件會加入這個目錄。
    1. 在檔案總管中找到圖片目錄（`/assets`），裡面包含應用程式使用的圖片。
    1. 在檔案總管中找到 Angular 應用程式建置與執行所需的檔案，但這些通常不是你會直接互動的檔案。
        1. `.angular` 包含建置 Angular 應用程式所需的檔案。
        1. `.e2e` 包含用來測試應用程式的檔案。
        1. `.node_modules` 包含應用程式使用的 node.js 套件。
        1. `angular.json` 向應用程式建置工具描述這個 Angular 應用程式。
        1. `package.json` 由 `npm`（node 套件管理器）用來執行完成後的應用程式。
        1. `tsconfig.*` 是向 TypeScript 編譯器描述應用程式設定的檔案。

檢視完組成 Angular 應用程式專案的檔案後，繼續進行下一步。

## 步驟 3 - 建立 `Hello World`

在這個步驟中，你會更新 Angular 專案檔案，變更顯示的內容。

在你的 IDE 中：

1. 開啟 `first-app/src/index.html`。
1. 在 `index.html` 中，用下列程式碼取代 `<title>` 元素，更新應用程式的標題。

    <code-example header="Replace in src/index.html" path="first-app-lesson-01/src/index.html" region="app-title"></code-example>

    接著，儲存你剛才對 `index.html` 所做的變更。

1. 接著，開啟 `first-app/src/app/app.component.ts`。
1. 在 `app.component.ts` 的 `@Component` 定義中，用下列程式碼取代 `template` 那一行，變更應用程式元件中的文字。

    <code-example header="Replace in src/app/app.component.ts" path="first-app-lesson-01/src/app/app.component.ts" region="app-comp-template"></code-example>

1. 在 `app.component.ts` 的 `AppComponent` 類別定義中，用下列程式碼取代 `title` 那一行，變更元件標題。

    <code-example header="Replace in src/app/app.component.ts" path="first-app-lesson-01/src/app/app.component.ts" region="app-comp-title"></code-example>

    接著，儲存你對 `app.component.ts` 所做的變更。

1. 如果你先前在步驟 1 停止了 `ng serve` 指令，請在 IDE 的 **Terminal** 視窗中再次執行 `ng serve`。
1. 開啟瀏覽器，前往 `localhost:4200`，確認應用程式建置時沒有錯誤，而且標題與內文都顯示 *Hello world*：
<section class="lightbox">
<img alt="瀏覽器畫面，顯示文字「Hello World」" src="generated/images/guide/faa/homes-app-lesson-01-browser.png">
</section>
## 課程回顧

在這一課中，你更新了一個預設的 Angular 應用程式，讓它顯示 *Hello world*。
在這個過程中，你學會了用 `ng serve` 指令在本機提供應用程式以便測試。

如果你在這一課遇到任何困難，請在 <live-example></live-example> 中檢視它的完整程式碼。

## 後續步驟

[第一個 Angular 應用程式第 2 課 - 建立元件](tutorial/first-app/first-app-lesson-02)

## 更多資訊

如需本課所涵蓋主題的更多資訊，請造訪：

* [Angular 元件](/guide/component-overview)
* [使用 Angular CLI 建立應用程式](/cli)

  @reviewed 2023-07-10
