# 第一個 Angular 應用程式第 4 課：建立介面

本教學課程示範如何建立介面，並將它用在應用程式的元件中。

**預估時間**：約 10 分鐘

**起始程式碼**： <live-example name="first-app-lesson-03"></live-example>

**完成程式碼**： <live-example name="first-app-lesson-04"></live-example>

## 你將學到什麼

*  你的應用程式有了一個新介面，可以用來作為資料型別。
*  你的應用程式有了新介面的一個實例，並帶有範例資料。

## 介面概念預覽

[介面](https://www.typescriptlang.org/docs/handbook/interfaces.html)是你的應用程式自訂的資料型別。

Angular 使用 TypeScript，藉此善用強型別程式設計環境。 強型別檢查能降低應用程式中某個元素把格式不正確的資料傳給另一個元素的可能性。 這類型別不符的錯誤會被 TypeScript 編譯器抓出來，其中許多錯誤也能在你的 IDE 中被發現。

在這一課中，你會建立一個介面，定義代表單一房屋地點資料的屬性。

## 步驟 1：建立新的 Angular 介面

這個步驟會在你的應用程式中建立一個新的介面。

在 IDE 的 **Terminal** 窗格中：

1.  1. 在你的專案目錄中，進入 `first-app` 目錄。
1.  在 `first-app` 目錄中，執行這個命令來建立新的介面。

    <code-example format="shell" language="shell">

    ng generate interface housinglocation

    </code-example>

1.  執行 `ng serve` 來建置應用程式，並在 `http://localhost:4200` 上提供服務。
1.  在瀏覽器中開啟 `http://localhost:4200` 來查看你的應用程式。
1.  1. 確認應用程式能順利建置、沒有錯誤。 繼續下一個步驟之前，請先修正所有錯誤。

## 步驟 2：為新介面加入屬性

這個步驟會為介面加入屬性，讓你的應用程式能夠表示一個房屋地點。

1.  在 IDE 的 **終端機** 窗格中，啟動 `ng serve` 命令（如果尚未執行），來建置應用程式並在 `http://localhost:4200` 上提供服務。
1.  在 IDE 的 **編輯** 窗格中，開啟 `src/app/housinglocation.ts` 檔案。
1.  在 `housinglocation.ts` 中，把預設內容替換成以下程式碼，讓你的新介面符合這個範例。

    <code-example header="Update src/app/housinglocation.ts to match this code" path="first-app-lesson-04/src/app/housinglocation.ts"></code-example>

1.  1. 儲存你的變更，確認應用程式沒有顯示任何錯誤。繼續下一步之前，請先修正任何錯誤。

到目前為止，你已經定義了一個代表房屋地點資料的介面，包含 id、name 與地點資訊。

## 步驟 3：為你的應用程式建立一間測試房屋

你已經有了一個介面，但還沒有使用它。

在這個步驟中，你會建立介面的一個實例，並為它指派一些範例資料。 目前你還不會在應用程式中看到這些範例資料出現。 還要再完成幾課，才會看到它。

1.  在 IDE 的 **終端機** 窗格中，執行 `ng serve` 命令（如果尚未執行），來建置應用程式並在 `http://localhost:4200` 上提供服務。
1.  在 IDE 的 **Edit** 窗格中，在 `src/app/home/home.component.ts` 裡：
1.  在 `src/app/home/home.component.ts` 中，在現有的 `import` 陳述式之後加入這行 import 陳述式，讓 `HomeComponent` 能夠使用新的介面。

    <code-example header="Import HomeComponent in src/app/home/home.component.ts" path="first-app-lesson-04/src/app/home/home.component.ts" region="housing-location-import"></code-example>

1.  1. 在 `src/app/home/home.component.ts` 中，用下列程式碼取代空白的 `export class HomeComponent {}` 定義，在元件中建立新介面的一個實例。

    <code-example header="Add sample data to src/app/home/home.component.ts" path="first-app-lesson-04/src/app/home/home.component.ts" region="only-house"></code-example>

1.  1. 確認你的 `home.component.ts` 檔案與這個範例一致。

    <code-example header="src/app/home/home.component.ts" path="first-app-lesson-04/src/app/home/home.component.ts"></code-example>

透過為 `housingLocation` 類別加入型別為 `HousingLocation` 的 `HomeComponent` 屬性，我們就能確認資料符合介面的描述。如果資料不符合介面的描述，IDE 有足夠的資訊能給我們有幫助的錯誤提示。

1.  1. 儲存你的變更，確認應用程式沒有任何錯誤。開啟瀏覽器，確認你的應用程式仍然顯示「housing-location works!」訊息。

    <section class="lightbox">
    <img alt="homes-app 的瀏覽器畫面，顯示標誌、篩選文字輸入框、搜尋按鈕與訊息「housing-location works!」" src="generated/images/guide/faa/homes-app-lesson-03-step-2.png">
    </section>

1.  繼續下一步之前，請先修正任何錯誤。

## 課程回顧

Summary: 在這一課中，你建立了一個介面，為你的應用程式建立了新的資料型別。 有了這個新資料型別，你就能指定哪些地方需要 `HousingLocation` 資料。 這個新資料型別也能讓你的 IDE 與 TypeScript 編譯器確保 `HousingLocation` 資料被用在需要它的地方。

如果你在這一課遇到任何困難，可以在 <live-example></live-example> 中查看這一課的完成程式碼。

## 後續步驟

* [第 5 課：為元件加入 input 參數](tutorial/first-app/first-app-lesson-05)


## 更多資訊

如需本課所涵蓋主題的更多資訊，請造訪：

<!-- vale Angular.Google_WordListSuggestions = NO -->

*  [ng generate interface](cli/generate#interface-command)
*  [ng generate](cli/generate)
