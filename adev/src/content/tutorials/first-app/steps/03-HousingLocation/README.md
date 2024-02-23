# 建立應用程式的 HousingLocation 元件

本教學課程示範如何將 `HousingLocation` 元件新增至你的 Angular 應用程式。

<docs-video src="https://www.youtube.com/embed/R0nRX8jD2D0?si=U4ONEbPvtptdUHTt&amp;start=440"/>

## 你將會學到

* 您的應用程式有一個新的元件：`HousingLocationComponent`，它顯示一條訊息，確認已將該元件新增至您的應用程式。

<docs-workflow>

<docs-step title="建立 `HousingLocationComponent`">
在這個步驟，您為應用程式建立新的元件。

在您的 IDE 的 **Terminal** 窗格中：

1. 在專案目錄中，導覽至 `first-app` 目錄。

1. 執行此指令以建立新的 `HousingLocationComponent`

    <docs-code language="shell">
    ng generate component housingLocation
    </docs-code>

1. 執行此指令以建構並提供您的應用程式服務。

    <docs-code language="shell">
    ng serve
    </docs-code>

    注意：此步驟僅適用於您的本機環境！

1. 開啟瀏覽器並導覽至 `http://localhost:4200` 以尋找應用程式。
1. 確認應用程式在建構時沒有錯誤。

    有用的提示：它應該會呈現與前一課相同的結果，因為即使您新增了一個新的元件，但您尚未將它包含在任何應用程式的範本中。

1. 在您完成下一個步驟時，讓 `ng serve` 繼續執行。
</docs-step>

<docs-step title="將新元件加入您應用程式版面">
在此步驟，您將新元件 `HousingLocationComponent` 加入您應用程式 `HomeComponent`，以便在應用程式版面中顯示。

在您的 IDE 的 **編輯** 窗格中：

1. 在編輯器中開啟 `home.component.ts`。
1. 在 `home.component.ts` 中，匯入 `HousingLocationComponent`，方法是將此行加入檔案層級的匯入。

    <docs-code header="在 src/app/home/home.component.ts 中匯入 HousingLocationComponent" path="adev/src/content/tutorials/first-app/steps/04-interfaces/src/app/home/home.component.ts" visibleLines="[3]"/>

1. 接下來，更新 `@Component` 元資料的 `imports` 屬性，方法是將 `HousingLocationComponent` 加入陣列中。

    <docs-code header="將 HousingLocationComponent 加入 src/app/home/home.component.ts 中的 imports 陣列" path="adev/src/content/tutorials/first-app/steps/04-interfaces/src/app/home/home.component.ts" visibleLines="[7,10]"/>

1. 現在，此元件已準備好可以在 `HomeComponent` 的範本中使用。更新 `@Component` 元資料的 `template` 屬性，以包含對 `<app-housing-location>` 標籤的參考。

    <docs-code header="將住房位置加入 src/app/home/home.component.ts 中的元件範本" path="adev/src/content/tutorials/first-app/steps/04-interfaces/src/app/home/home.component.ts" visibleLines="[11,21]"/>

</docs-step>

<docs-step title="新增元件的樣式">
在這個步驟中，您會將預先寫好的 `HousingLocationComponent` 樣式複製到您的應用程式，以便應用程式正確呈現。

1. 開啟 `src/app/housing-location/housing-location.component.css`，並將以下樣式貼到檔案中：

    注意：在瀏覽器中，這些可以放在 `src/app/housing-location/housing-location.component.ts` 的 `styles` 陣列中。

    <docs-code header="將 CSS 樣式新增至 `src/app/housing-location/housing-location.component.css` 中的住房位置元件" path="adev/src/content/tutorials/first-app/steps/04-interfaces/src/app/housing-location/housing-location.component.css"/>

1. 儲存程式碼，回到瀏覽器並確認應用程式在沒有錯誤的情況下建置。您應該會在螢幕上找到訊息「housing-location works!」。在繼續進行下一步之前，請更正任何錯誤。

    <img alt="顯示標誌、篩選文字輸入方塊和搜尋按鈕，以及訊息「housing-location works!」的 homes-app 瀏覽器框架" src="assets/content/images/tutorials/first-app/homes-app-lesson-03-step-2.png">

</docs-step>

</docs-workflow>

摘要：在本課程中，您為您的應用程式建立新的元件，並將它新增到應用程式的配置。

