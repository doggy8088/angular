# Hello world

第一課是整個教學的起點，本教學的每一課都會在這個基礎上加入新功能，逐步打造出一個完整的 Angular 應用程式。在這一課中，我們會更新應用程式，讓它顯示知名的文字「Hello World」。

<docs-video src="https://www.youtube.com/embed/UnOwDuliqZA?si=uML-cDRbrxmYdD_9"/>

## 你將學到什麼

本課結束後你所得到的更新版應用程式，證明你和你的 IDE 都已準備好開始建立 Angular 應用程式。

NOTE: 如果你使用的是內嵌編輯器，請直接跳到[第三步](#create-%60hello-world%60)。
在瀏覽器遊樂場中工作時，你不需要執行 `ng serve` 來啟動應用程式。其他指令（例如 `ng generate`）可以在你右邊的控制台視窗中執行。

<docs-workflow>

<docs-step title="下載預設應用程式">
先點選程式碼編輯器右上方窗格中的「Download」圖示。這會下載一個 `.zip` 檔案，裡面包含本教學的原始碼。請在本機的 Terminal 與 IDE 中開啟它，然後繼續測試預設應用程式。

在本教學的任何步驟中，你都可以點選這個圖示，下載該步驟的原始碼並從那裡開始。
</docs-step>

<docs-step title="測試預設應用程式">
在這個步驟中，下載預設的起始應用程式之後，你會建置預設的 Angular 應用程式。
這能確認你的開發環境具備繼續進行本教學所需的一切。

在 IDE 的 **Terminal** 窗格中：

1. 在你的專案目錄中，進入 `first-app` 目錄。
1. 執行下列指令，安裝執行應用程式所需的相依套件。

   ```shell
   npm install
   ```

1. 執行下列指令，建置並提供預設應用程式。

   ```shell
   ng serve
   ```

   應用程式應該要能建置完成且沒有錯誤。

1. 在開發電腦的網頁瀏覽器中，開啟 `http://localhost:4200`。
1. 確認預設網站出現在瀏覽器中。
1. 你可以讓 `ng serve` 繼續執行，同時進行接下來的步驟。
   </docs-step>

<docs-step title="檢視專案中的檔案">
在這個步驟中，你會認識組成預設 Angular 應用程式的檔案。

在 IDE 的 **Explorer** 窗格中：

1. 在你的專案目錄中，進入 `first-app` 目錄。
1. 開啟 `src` 目錄，查看下列檔案。
   1. 在檔案總管中找到 Angular 應用程式檔案（`/src`）。
      1. `index.html` 是應用程式的頂層 HTML 範本。
      1. `styles.css` 是應用程式的頂層樣式表。
      1. `main.ts` 是應用程式開始執行的地方。
      1. `favicon.ico` 是應用程式的圖示，就像你在任何網站上看到的一樣。
   1. 在檔案總管中找到 Angular 應用程式的元件檔案（`/app`）。
      1. `app.ts` 是描述 `app-root` 元件的原始碼檔案。
         這是應用程式中的頂層 Angular 元件。元件是 Angular 應用程式的基本組成單位。
         元件的描述包含元件的程式碼、HTML 範本與樣式，可以寫在這個檔案中，也可以用個別檔案描述。

         在這個應用程式中，樣式放在個別檔案裡，而元件的程式碼與 HTML 範本則放在這個檔案中。

      1. `app.css` 是這個元件的樣式表。
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
</docs-step>

<docs-step title="建立 `Hello World` {#create-hello-world}">
在這個步驟中，你會更新 Angular 專案檔案，變更顯示的內容。

在你的 IDE 中：

1. 開啟 `first-app/src/index.html`。
   NOTE: 這個步驟與下一步只適用於你的本機環境！

1. 在 `index.html` 中，用下列程式碼取代 `<title>` 元素，更新應用程式的標題。

   <docs-code header="取代 src/index.html 中的內容" path="adev/src/content/tutorials/first-app/steps/02-Home/src/index.html" visibleLines="[5]"/>

   接著，儲存你剛才對 `index.html` 所做的變更。

1. 接著，開啟 `first-app/src/app/app.ts`。
1. 在 `app.ts` 的 `@Component` 定義中，用下列程式碼取代 `template` 那一行，變更應用程式元件中的文字。

   <docs-code language="angular-ts" header="取代 src/app/app.ts 中的內容" path="adev/src/content/tutorials/first-app/steps/02-Home/src/app/app.ts" visibleLines="[6,8]"/>

1. 在 `app.ts` 的 `App` 類別定義中，用下列程式碼取代 `title` 那一行，變更元件標題。

   <docs-code header="取代 src/app/app.ts 中的內容" path="adev/src/content/tutorials/first-app/steps/02-Home/src/app/app.ts" visibleLines="[11,13]"/>

   接著，儲存你對 `app.ts` 所做的變更。

1. 如果你先前在步驟 1 停止了 `ng serve` 指令，請在 IDE 的 **Terminal** 視窗中再次執行 `ng serve`。
1. 開啟瀏覽器，前往 `localhost:4200`，確認應用程式建置時沒有錯誤，而且標題顯示 _Homes_、應用程式內文顯示 _Hello world_：
   <img alt="顯示「Hello World」文字的頁面瀏覽器畫面" src="assets/images/tutorials/first-app/homes-app-lesson-01-browser.png">
   </docs-step>

</docs-workflow>

SUMMARY: 在這一課中，你更新了一個預設的 Angular 應用程式，讓它顯示 _Hello world_。
在這個過程中，你學會了用 `ng serve` 指令在本機提供應用程式以便測試。

如需本課所涵蓋主題的更多資訊，請造訪：

<docs-pill-row>
  <docs-pill href="guide/components" title="Angular 元件"/>
  <docs-pill href="tools/cli" title="使用 Angular CLI 建立應用程式"/>
</docs-pill-row>
