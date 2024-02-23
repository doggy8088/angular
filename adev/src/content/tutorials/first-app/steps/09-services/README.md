# Angular 服務

以下教學課程說明如何建立 Angular 服務，並使用相依性注入將其納入您的應用程式。

<docs-video src="https://www.youtube.com/embed/-jRxG84AzCI?si=rieGfJawp9xJ00Sz"/>

## 你將會學到

您的應用程式有一個服務，用來向您的應用程式提供資料。
在本課程的最後，服務會從本機靜態資料讀取資料。
在後續課程中，您會更新服務以從網路服務取得資料。

## 服務的概念性預覽

本教學介紹 Angular 服務和相依性注入。

### Angular 服務

*Angular 服務*提供一種方法，讓您可以區分 Angular 應用程式資料和函式，以便應用程式中的多個元件可以使用。
若要讓多個元件使用，服務必須設為 *可注入*。
可注入且元件使用的服務會成為該元件的相依性。
元件依賴於這些服務，沒有這些服務就無法運作。

### 相依性注入

*相依性注入*是管理應用程式元件的依賴關係以及其他元件可以使用服務的機制。

<docs-workflow>

<docs-step title="為您的應用程式建立一個新的服務">
這個步驟為您的應用程式建立一個可注入的服務。

在您的 IDE 的 **Terminal** 窗格中：

1. 在您的專案目錄中，導覽至 `first-app` 目錄。
1. 在 `first-app` 目錄中，執行此指令以建立新的服務。

    <docs-code language="shell">
    ng generate service housing --skip-tests
    </docs-code>

1. 執行 `ng serve` 以建置應用程式並將其提供給 `http://localhost:4200`。
1. 確認應用程式建置沒有錯誤。
    在您繼續進行下一個步驟之前，請更正所有錯誤。
</docs-step>

<docs-step title="將靜態資料新增至新服務">
這步驟會將一些範例資料新增至您的新服務。
在後續課程中，您會將靜態資料替換成網頁介面，以取得資料，就像您在真實應用程式中所做的一樣。
目前，您的應用程式的新服務使用到目前在 `HomeComponent` 中建立的資料。

在您的 IDE 的 **編輯** 窗格中：

1. 在 `src/app/home/home.component.ts` 中，從 `HomeComponent`，複製 `housingLocationList` 變數及其陣列值。
1. 在 `src/app/housing.service.ts` 中：
    1. 在 `HousingService` 類別中，貼上您在先前步驟中從 `HomeComponent` 複製的變數。
    1. 在 `HousingService` 類別中，在您剛複製的資料後貼上這些函式。
        這些函式允許相依性存取服務的資料。

        <docs-code header="src/app/housing.service.ts 中的服務函式" path="adev/src/content/tutorials/first-app/steps/10-routing/src/app/housing.service.ts" visibleLines="[112,118]"/>

        您將在未來的課程中需要這些函式。目前，只要了解這些函式會依據 ID 或整個清單傳回特定的 `HousingLocation`。

    1. 新增檔案層級匯入 `HousingLocation`。

        <docs-code header="在 src/app/housing.service.ts 中匯入 HousingLocation 類型" path="adev/src/content/tutorials/first-app/steps/10-routing/src/app/housing.service.ts" visibleLines="[2]"/>

1. 確認應用程式建置無錯誤。
    在繼續執行下一個步驟之前，請更正任何錯誤。
</docs-step>

<docs-step title="將新服務注入 `HomeComponent`">
此步驟將新服務注入應用程式的 `HomeComponent`，以便它可以從服務讀取應用程式的資料。
在後續課程中，您將以即時資料來源取代靜態資料，以便像在實際應用程式中一樣取得資料。

在 IDE 的 **編輯** 窗格中，在 `src/app/home/home.component.ts` 中：

1. 在 `src/app/home/home.component.ts` 的頂端，將 `inject` 加入從 `@angular/core` 匯入的項目。這會將 `inject` 函式匯入至 `HomeComponent` 類別。

    <docs-code header="更新至 src/app/home/home.component.ts" path="adev/src/content/tutorials/first-app/steps/10-routing/src/app/home/home.component.ts" visibleLines="[1]"/>

1. 新增一個檔案層級的匯入，用於 `HousingService`：

    <docs-code header="將匯入加入 src/app/home/home.component.ts" path="adev/src/content/tutorials/first-app/steps/10-routing/src/app/home/home.component.ts" visibleLines="[5]"/>

1. 從 `HomeComponent` 中，刪除 `housingLocationList` 陣列項目，並將 `housingLocationList` 指定為空陣列 (`[]`) 的值。在幾個步驟中，您會更新程式碼以從 `HousingService` 中提取資料。

1. 在 `HomeComponent` 中，新增以下程式碼以注入新的服務並初始化應用程式的資料。`constructor` 是在建立此元件時執行的第一個函式。`constructor` 中的程式碼會將 `housingLocationList` 指定為從呼叫 `getAllHousingLocations` 回傳的值。

    <docs-code header="在 src/app/home/home.component.ts 中從服務初始化資料" path="adev/src/content/tutorials/first-app/steps/10-routing/src/app/home/home.component.ts" visibleLines="[31,36]"/>

1. 儲存對 `src/app/home/home.component.ts` 的變更，並確認您的應用程式在沒有錯誤的情況下建置。
    在繼續執行下一個步驟之前，請修正任何錯誤。
</docs-step>

</docs-workflow>

摘要：在本課程中，您將新增一個 Angular 服務至您的應用程式，並將其注入 `HomeComponent` 類別。
這將區隔您的應用程式取得資料的方式。
目前，新的服務會從靜態資料陣列取得資料。
在後續的課程中，您將重構服務，讓它從 API 端點取得資料。

有關本課程中涵蓋的主題的更多資訊，請造訪：

<docs-pill-row>
  <docs-pill href="guide/di/creating-injectable-service" title="建立可注入服務"/>
  <docs-pill href="guide/di" title="Angular 中的相依性注入"/>
  <docs-pill href="cli/generate#service" title="ng generate service"/>
  <docs-pill href="cli/generate" title="ng generate"/>
</docs-pill-row>
