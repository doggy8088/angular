# 建立 Home 元件

本教學課程示範如何為您的 Angular 應用程式建立新的 [元件](guide/components)。

<docs-video src="https://www.youtube.com/embed/R0nRX8jD2D0?si=OMVaw71EIa44yIOJ"/>

## 你將會學到

您的應用程式有一個新的元件：`HomeComponent`。

## Angular 元件的概念預覽

Angular 應用程式圍繞著元件建構，這些元件是 Angular 的基本元素。
元件包含程式碼、HTML 版面和 CSS 樣式資訊，提供應用程式中元素的功能和外觀。
在 Angular 中，元件可以包含其他元件。應用程式的功能和外觀可以分隔並分割成元件。

在 Angular 中，元件具備定義其屬性的元數據。
當您建立 `HomeComponent` 時，您會使用這些屬性：

* `selector`：說明 Angular 在範本中如何參考元件。
* `standalone`：說明元件是否需要 `NgModule`。
* `imports`：說明元件的相依性。
* `template`：說明元件的 HTML 標記和版面配置。
* `styleUrls`：以陣列形式列出元件使用的 CSS 檔案的 URL。

<docs-pill-row>
  <docs-pill href="api/core/Component" title="深入了解元件"/>
</docs-pill-row>

<docs-workflow>

<docs-step title="建立 `HomeComponent`">
在這個步驟中，您可以為您的應用程式建立一個新的元件。

在您的 IDE 的 **Terminal** 窗格中：

1. 在專案目錄中，導覽至 `first-app` 目錄。
1. 執行此指令以建立新的 `HomeComponent`

    <docs-code language="shell">
    ng generate component home
    </docs-code>

1. 執行此指令以建置並服務您的應用程式。

    注意：此步驟僅適用於您的本地環境！

    <docs-code language="shell">
    ng serve
    </docs-code>

1. 開啟瀏覽器並導覽至 `http://localhost:4200` 以尋找應用程式。

1. 確認應用程式沒有錯誤地建置。

    有幫助的：它應該呈現與前一堂課相同的內容，因為即使您新增一個新的元件，您尚未將它包含在任何應用程式範本中。

1. 在您完成下一個步驟時，讓 `ng serve` 持續執行。
</docs-step>

<docs-step title="將新元件新增至應用程式的配置">
在此步驟中，您將新元件 `HomeComponent` 新增至應用程式的根元件 `AppComponent`，讓它顯示在應用程式的配置中。

在您的 IDE 的 **編輯** 窗格中：

1. 在編輯器中開啟 `app.component.ts`。
1. 在 `app.component.ts` 中，透過將此行新增至檔案層級的匯入，來匯入 `HomeComponent`。

    <docs-code header="在 src/app/app.component.ts 中匯入 HomeComponent" path="adev/src/content/tutorials/first-app/steps/03-HousingLocation/src/app/app.component.ts" visibleLines="[2]"/>

1. 在 `app.component.ts` 中的 `@Component` 中，更新 `imports` 陣列屬性並新增 `HomeComponent`。

    <docs-code header="在 src/app/app.component.ts 中替換" path="adev/src/content/tutorials/first-app/steps/03-HousingLocation/src/app/app.component.ts" visibleLines="[7,9]"/>

1. 在 `app.component.ts` 中的 `@Component` 中，更新 `template` 屬性以包含以下 HTML 程式碼。

    <docs-code header="在 src/app/app.component.ts 中替換" path="adev/src/content/tutorials/first-app/steps/03-HousingLocation/src/app/app.component.ts" visibleLines="[10,19]"/>

1. 將變更內容儲存至 `app.component.ts`。
1. 如果 `ng serve` 正在執行，應用程式應該會更新。
    如果 `ng serve` 沒有執行，請重新啟動。
    應用程式中的 *Hello world* 應該從 `HomeComponent` 變更為 *home works!*。
1. 檢查瀏覽器中的執行中應用程式，並確認應用程式已更新。

    <img alt="顯示文字 'home works!' 的網頁瀏覽器畫面" src="https://angular.dev/assets/images/tutorials/first-app/homes-app-lesson-02-step-2.png">

</docs-step>

<docs-step title="在 `HomeComponent` 中新增功能">
在這個步驟中，您將在 `HomeComponent` 中新增功能。

在上一個步驟中，您已將預設的 `HomeComponent` 新增至您的應用程式範本，因此其預設的 HTML 會顯示在應用程式中。
在這個步驟中，您會新增一個搜尋篩選器和按鈕，稍後課程中會用到。
目前為止，`HomeComponent` 只有這些內容。
請注意，此步驟只是將搜尋元素新增至版面配置，但目前尚未具備任何功能。

在您的 IDE 的 **編輯** 窗格中：

1. 在 `first-app` 目錄中，在編輯器中開啟 `home.component.ts`。
1. 在 `home.component.ts` 中，在 `@Component` 中，使用此程式碼更新 `template` 屬性。

    <docs-code header="取代 src/app/home/home.component.ts 中的內容" path="adev/src/content/tutorials/first-app/steps/03-HousingLocation/src/app/home/home.component.ts" visibleLines="[10,17]"/>

1. 接著，在編輯器中開啟 `home.component.css` 並使用這些樣式更新內容。

    注意：在瀏覽器中，這些可以放入 `src/app/home/home.component.ts` 中的 `styles` 陣列。

    <docs-code header="取代 src/app/home/home.component.css 中的內容" path="adev/src/content/tutorials/first-app/steps/03-HousingLocation/src/app/home/home.component.css"/>

1. 確認應用程式在沒有錯誤的情況下建置。
    您應該可以在應用程式中找到篩選查詢方塊和按鈕，而且它們應該套用樣式。
    在繼續執行下一個步驟之前，請修正任何錯誤。

    <img alt="顯示標誌、篩選文字輸入方塊和搜尋按鈕的 homes-app 瀏覽器畫面" src="https://angular.dev/assets/images/tutorials/first-app/homes-app-lesson-02-step-3.png">
    </docs-step>

</docs-workflow>

Summary: 在這個課程中，您為您的應用程式建立新的元件，並給它一個篩選器編輯控制項和按鈕。

有關本課程中涵蓋的主題的更多資訊，請造訪：

<docs-pill-row>
  <docs-pill href="cli/generate#component-command" title="`ng generate component`"/>
  <docs-pill href="api/core/Component" title="`Component` 參考"/>
  <docs-pill href="guide/components" title="Angular 元件概觀"/>
</docs-pill-row>
