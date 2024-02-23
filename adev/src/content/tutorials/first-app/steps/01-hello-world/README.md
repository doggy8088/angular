# 您好，世界

這個第一課是起點，本教學課程中的每一課都從此處開始，新增功能以建構完整的 Angular 應用程式。在這一課中，我們會更新應用程式以顯示著名的文字「Hello World」。

<docs-video src="https://www.youtube.com/embed/UnOwDuliqZA?si=uML-cDRbrxmYdD_9"/>

## 你將會學到

完成此課程後您所更新的應用程式確認您和您的 IDE 已準備好開始建立 Angular 應用程式。

注意：如果您使用的是嵌入式編輯器，請跳至 [步驟三](#create-%60hello-world%60)。
在瀏覽器遊樂場中工作時，您不需要 `ng serve` 來運行應用程式。其他命令，例如 `ng generate` 可以直接在您右邊的主控台視窗中執行。

<docs-workflow>

<docs-step title="下載預設應用程式">
先點選程式碼編輯器右上角的「下載」圖示。這會下載一個包含本教學程式碼的 `.zip` 檔案。在你的本地端終端機和 IDE 中開啟此檔案，然後繼續測試預設應用程式。

在教學課程的任何步驟中，您可以點擊此圖示下載該步驟的原始程式碼，然後從該處開始。
</docs-step>

<docs-step title="測試預設應用程式">
在這個步驟，下載預設起始應用程式後，建立預設 Angular 應用程式。
這確認您的開發環境有繼續本教學所需的內容。

在您的 IDE 的 **Terminal** 窗格中：

1. 在您的專案目錄中，導航至 `first-app` 目錄。
1. 執行此命令，以安裝執行應用程式所需的相依性。

    <docs-code language="shell">
    npm install
    </docs-code>

1. 執行此命令，以建構並提供預設應用程式。

    <docs-code language="shell">
    ng serve
    </docs-code>

    應用程式應會在沒有錯誤的情況下建構。

1. 在您的開發電腦上的網路瀏覽器中，開啟 `http://localhost:4200`。
1. 確認預設網站出現在瀏覽器中。
1. 您可以在完成後續步驟時，讓 `ng serve` 持續執行。
</docs-step>

<docs-step title="檢閱專案中的檔案">
在這個步驟中，您必須了解組成預設 Angular 應用程式的檔案。

在您的 IDE 的 **瀏覽器** 窗格中：

1. 在您的專案目錄中，導覽至 `first-app` 目錄。
1. 開啟 `src` 目錄以查看這些檔案。
    1. 在檔案總管中，找到 Angular 應用程式檔案 (`/src`)。
        1. `index.html` 是應用程式的頂層 HTML 範本。
        1. `style.css` 是應用程式的頂層樣式表。
        1. `main.ts` 是應用程式開始執行的位置。
        1. `favicon.ico` 是應用程式的圖示，就像您在任何網站中找到的一樣。
    1. 在檔案總管中，找到 Angular 應用程式的元件檔案 (`/app`)。
        1. `app.component.ts` 是描述 `app-root` 元件的原始檔。
            這是應用程式中的頂層 Angular 元件。元件是 Angular 應用程式的基本建構區塊。
            元件說明包括元件的程式碼、HTML 範本和樣式，可以在此檔案中或在個別檔案中描述。

            在此應用程式中，樣式在個別檔案中，而元件的程式碼和 HTML 範本在此檔案中。
        1. `app.component.css` 是此元件的樣式表。
        1. 新的元件會新增到此目錄。
    1. 在檔案總管中，找到包含應用程式所使用影像的影像目錄 (`/assets`)。
    1. 在檔案總管中，找到 Angular 應用程式需要建置和執行，但您通常不會與之互動的檔案和目錄。
        1. `.angular` 有建置 Angular 應用程式所需的檔案。
        1. `.e2e` 有用於測試應用程式的檔案。
        1. `.node_modules` 有應用程式使用的 node.js 套件。
        1. `angular.json` 向應用程式建置工具說明 Angular 應用程式。
        1. `package.json` 由 `npm` (node 套件管理員) 用於執行已完成的應用程式。
        1. `tsconfig.*` 是向 TypeScript 編譯器說明應用程式組態的檔案。

當您已檢閱組成 Angular 應用程式專案的檔案後，繼續至下一步。
</docs-step>

<docs-step title="建立 `Hello World`">
在此步驟中，您會更新 Angular 專案檔案，以變更顯示的內容。

在您的 IDE 中：

1. 開啟 `first-app/src/index.html`。
    注意：此步驟和下一個步驟僅適用於您的本地環境！

1. 在 `index.html` 中，以這個程式碼取代 `<title>` 元素，以更新應用程式的標題。

    <docs-code header="在 src/index.html 中取代" path="adev/src/content/tutorials/first-app/steps/01-hello-world/src/index.html" visibleLines="[5]"/>

    然後，儲存您剛才對 `index.html` 所做的變更。

1. 接下來，開啟 `first-app/src/app/app.component.ts`。
1. 在 `app.component.ts` 中，在 `@Component` 定義中，以這個程式碼取代 `template` 列，以變更應用程式元件中的文字。

    <docs-code header="在 src/app/app.component.ts 中取代" path="adev/src/content/tutorials/first-app/steps/01-hello-world/src/app/app.component.ts" visibleLines="[7]"/>

1. 在 `app.component.ts` 中，在 `AppComponent` 類別定義中，以這個程式碼取代 `title` 列，以變更元件標題。

    <docs-code header="在 src/app/app.component.ts 中取代" path="adev/src/content/tutorials/first-app/steps/01-hello-world/src/app/app.component.ts" visibleLines="[11]"/>

    然後，儲存您對 `app.component.ts` 所做的變更。

1. 如果您已在步驟 1 中停止 `ng serve` 指令，請在 IDE 的 **終端機** 視窗中，再次執行 `ng serve`。
1. 開啟您的瀏覽器並導航至 `localhost:4200`，並確認應用程式在沒有錯誤的情況下建置，並在應用程式的標題和內文中顯示 *Hello world*：
    <img alt="顯示文字「Hello World」的頁面瀏覽器畫面" src="https://angular.dev/assets/images/tutorials/first-app/homes-app-lesson-01-browser.png">
</docs-step>

</docs-workflow>

摘要：在本課程中，您更新了預設的 Angular 應用程式，以顯示 *Hello world*。
在此過程中，您瞭解了 `ng serve` 指令，可在本地端為您的應用程式提供測試服務。

有關本課程中涵蓋的主題的更多資訊，請造訪：

<docs-pill-row>
  <docs-pill href="guide/components" title="Angular 元件"/>
  <docs-pill href="tools/cli" title="使用 Angular CLI 建立應用程式"/>
</docs-pill-row>
