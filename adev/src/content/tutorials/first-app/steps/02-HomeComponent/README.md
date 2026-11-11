# 建立 HomeComponent 元件

本教學課程示範如何為你的 Angular 應用程式建立新的[元件](guide/components)。

<docs-video src="https://www.youtube.com/embed/R0nRX8jD2D0?si=OMVaw71EIa44yIOJ"/>

## 你將學到什麼

你的應用程式有了一個新元件：`HomeComponent`。

## Angular 元件概念預覽

Angular 應用程式圍繞著元件打造，元件是 Angular 的基本組成單位。
元件包含程式碼、HTML 版面配置與 CSS 樣式資訊，提供應用程式中某個元素的功能與外觀。
在 Angular 中，元件可以包含其他元件。應用程式的功能與外觀可以被拆分、劃分到不同的元件中。

在 Angular 中，元件有定義其屬性的中繼資料。
當你建立 `HomeComponent` 時，你會用到下列屬性：

* `selector`：描述 Angular 在範本中如何參照這個元件。
* `standalone`：描述元件是否需要 `NgModule`。
* `imports`：描述元件的相依關係。
* `template`：描述元件的 HTML 標記與版面配置。
* `styleUrls`：以陣列列出元件所使用的 CSS 檔案 URL。

<docs-pill-row>
  <docs-pill href="api/core/Component" title="進一步了解元件"/>
</docs-pill-row>

<docs-workflow>

<docs-step title="建立 `HomeComponent`">
在這個步驟中，你會為應用程式建立一個新元件。

在 IDE 的 **Terminal** 窗格中：

1. 在你的專案目錄中，進入 `first-app` 目錄。
1. 執行下列指令，建立新的 `HomeComponent`

    <docs-code language="shell">
    ng generate component home
    </docs-code>

1. 執行下列指令，建置並提供你的應用程式。

    NOTE: 這個步驟只適用於你的本機環境！

    <docs-code language="shell">
    ng serve
    </docs-code>

1. 開啟瀏覽器，前往 `http://localhost:4200` 找到應用程式。

1. 確認應用程式建置時沒有錯誤。

    HELPFUL: 畫面應該和上一課一樣，因為雖然你加入了新元件，但你尚未把它放進應用程式的任何範本裡。

1. 讓 `ng serve` 繼續執行，同時進行接下來的步驟。
</docs-step>

<docs-step title="將新元件加入應用程式的版面配置">
在這個步驟中，你會將新元件 `HomeComponent` 加入應用程式的根元件 `AppComponent`，讓它顯示在應用程式的版面配置中。

在 IDE 的 **Edit** 窗格中：

1. 在編輯器中開啟 `app.component.ts`。
1. 在 `app.component.ts` 中，將這一行加入檔案層級的 imports，匯入 `HomeComponent`。

    <docs-code header="在 src/app/app.component.ts 中匯入 HomeComponent" path="adev/src/content/tutorials/first-app/steps/03-HousingLocation/src/app/app.component.ts" visibleLines="[2]"/>

1. 在 `app.component.ts` 的 `@Component` 中，更新 `imports` 陣列屬性，加入 `HomeComponent`。

    <docs-code header="取代 src/app/app.component.ts 中的內容" path="adev/src/content/tutorials/first-app/steps/03-HousingLocation/src/app/app.component.ts" visibleLines="[7]"/>

1. 在 `app.component.ts` 的 `@Component` 中，更新 `template` 屬性，加入下列 HTML 程式碼。

    <docs-code header="取代 src/app/app.component.ts 中的內容" path="adev/src/content/tutorials/first-app/steps/03-HousingLocation/src/app/app.component.ts" visibleLines="[8,17]"/>

1. 儲存你對 `app.component.ts` 的變更。
1. 如果 `ng serve` 正在執行，應用程式應該會自動更新。
    如果 `ng serve` 沒有在執行，請重新啟動它。
    應用程式中的 *Hello world* 應該會變成來自 `HomeComponent` 的 *home works!*。
1. 在瀏覽器中檢查執行中的應用程式，確認應用程式已經更新。

    <img alt="顯示「home works!」文字的頁面瀏覽器畫面" src="assets/images/tutorials/first-app/homes-app-lesson-02-step-2.png">

</docs-step>

<docs-step title="為 `HomeComponent` 加入功能">

在這個步驟中，你會為 `HomeComponent` 加入功能。

在上一個步驟中，你把預設的 `HomeComponent` 加入應用程式的範本，讓它的預設 HTML 出現在應用程式中。
在這個步驟中，你會加入一個搜尋篩選器與按鈕，之後的課程會用到它。
目前 `HomeComponent` 就只有這些內容。
請注意，這個步驟只是把搜尋元素加入版面配置，還沒有加入任何功能。

在 IDE 的 **Edit** 窗格中：

1. 在 `first-app` 目錄中，在編輯器裡開啟 `home.component.ts`。
1. 在 `home.component.ts` 的 `@Component` 中，用下列程式碼更新 `template` 屬性。

    <docs-code header="取代 src/app/home/home.component.ts 中的內容" path="adev/src/content/tutorials/first-app/steps/03-HousingLocation/src/app/home/home.component.ts" visibleLines="[8,15]"/>

1. 接著，在編輯器中開啟 `home.component.css`，用這些樣式更新內容。

    NOTE: 在瀏覽器中，這些樣式可以放在 `src/app/home/home.component.ts` 的 `styles` 陣列裡。

    <docs-code header="取代 src/app/home/home.component.css 中的內容" path="adev/src/content/tutorials/first-app/steps/03-HousingLocation/src/app/home/home.component.css"/>

1. 確認應用程式建置時沒有錯誤。
    你應該能在應用程式中找到篩選查詢框與按鈕，而且它們都有套用樣式。
    繼續下一步之前，請先修正任何錯誤。

    <img alt="homes-app 的瀏覽器畫面，顯示標誌、篩選文字輸入框與搜尋按鈕" src="assets/images/tutorials/first-app/homes-app-lesson-02-step-3.png">
    </docs-step>

</docs-workflow>

SUMMARY: 在這一課中，你為應用程式建立了一個新元件，並為它加上篩選編輯控制項與按鈕。

如需本課所涵蓋主題的更多資訊，請造訪：

<docs-pill-row>
  <docs-pill href="cli/generate/component" title="`ng generate component`"/>
  <docs-pill href="api/core/Component" title="`Component` 參考"/>
  <docs-pill href="guide/components" title="Angular 元件總覽"/>
</docs-pill-row>
