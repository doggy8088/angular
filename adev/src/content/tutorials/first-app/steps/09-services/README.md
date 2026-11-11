# Angular 服務

本教學課程示範如何建立 Angular 服務，並使用依賴注入將它納入你的應用程式。

<docs-video src="https://www.youtube.com/embed/-jRxG84AzCI?si=rieGfJawp9xJ00Sz"/>

## 你將學到什麼

你的應用程式有一個服務，負責將資料提供給應用程式。
在這一課結束時，服務會從本機的靜態資料讀取資料。
在之後的課程中，你會更新這個服務，讓它從網路服務取得資料。

## 服務概念預覽

本教學介紹 Angular 服務與依賴注入。

### Angular 服務

_Angular 服務_提供了一種方式，讓你將應用程式的資料與功能分離出來，供應用程式中的多個元件使用。
一個服務要能被多個元件使用，必須先做成可注入的（injectable）。
可注入且被元件使用的服務，會成為該元件的相依性。
元件依賴這些服務，沒有它們就無法運作。

### 依賴注入

_依賴注入_是管理應用程式元件相依性，以及其他元件可使用之服務的機制。

<docs-workflow>

<docs-step title="為你的應用程式建立新服務">
這個步驟會為你的應用程式建立一個可注入的服務。

在 IDE 的 **Terminal** 窗格中：

1. 在你的專案目錄中，進入 `first-app` 目錄。
1. 在 `first-app` 目錄中，執行下列指令，建立新服務。

<docs-code language="shell">
ng generate service housing --skip-tests
</docs-code>

1. 執行 `ng serve`，建置應用程式並將它提供到 `http://localhost:4200`。
1. 確認應用程式建置時沒有錯誤。
   繼續下一步之前，請先修正任何錯誤。
   </docs-step>

<docs-step title="將靜態資料加入新服務">
這個步驟會為你的新服務加入一些範例資料。
在之後的課程中，你會將靜態資料換成網路介面，像在真正的應用程式中一樣取得資料。
目前，你的應用程式的新服務使用的是到目前為止在本機 `Home` 中建立的資料。

在 IDE 的 **Edit** 窗格中：

1. 在 `src/app/home/home.ts` 中，從 `Home` 複製 `housingLocationList` 變數及其陣列值。
1. 在 `src/app/housing.service.ts` 中：
   1. 在 `HousingService` 類別內，貼上你在上一個步驟中從 `Home` 複製的變數。
   1. 在 `HousingService` 類別內，將這些函式貼在你剛複製的資料之後。
      這些函式讓相依者能存取服務的資料。

      <docs-code header="src/app/housing.service.ts 中的服務函式" path="adev/src/content/tutorials/first-app/steps/10-routing/src/app/housing.service.ts" visibleLines="[112,118]"/>

      之後的課程會用到這些函式。目前只要理解這些函式會依 id 回傳特定的 `HousingLocation`，或回傳整份清單即可。

   1. 為 `HousingLocation` 加入檔案層級的匯入。

   <docs-code header="在 src/app/housing.service.ts 中匯入 HousingLocation 型別" path="adev/src/content/tutorials/first-app/steps/10-routing/src/app/housing.service.ts" visibleLines="[2]"/>

1. 確認應用程式建置時沒有錯誤。
   繼續下一步之前，請先修正任何錯誤。
   </docs-step>

<docs-step title="將新服務注入 `Home`">
這個步驟會將新服務注入應用程式的 `Home`，讓它能從服務讀取應用程式的資料。
在之後的課程中，你會將靜態資料換成即時資料來源，像在真正的應用程式中一樣取得資料。

在 IDE 的 **Edit** 窗格中，在 `src/app/home/home.ts` 裡：

1. 在 `src/app/home/home.ts` 頂部，將 `inject` 加入從 `@angular/core` 匯入的項目中。這會將 `inject` 函式匯入 `Home` 類別。

<docs-code language="angular-ts" header="更新 src/app/home/home.ts" path="adev/src/content/tutorials/first-app/steps/10-routing/src/app/home/home.ts" visibleLines="[1]"/>

1. 為 `HousingService` 加入新的檔案層級匯入：

<docs-code language="angular-ts" header="在 src/app/home/home.ts 中加入匯入" path="adev/src/content/tutorials/first-app/steps/10-routing/src/app/home/home.ts" visibleLines="[4]"/>

1. 從 `Home` 中刪除 `housingLocationList` 陣列的項目，並將 `housingLocationList` 指派為空陣列（`[]`）。再過幾個步驟，你會更新程式碼，讓它從 `HousingService` 拉取資料。

1. 在 `Home` 中，加入下列程式碼，注入新服務並為應用程式初始化資料。`constructor` 是這個元件建立時第一個執行的函式。`constructor` 中的程式碼會將 `housingLocationList` 指派為呼叫 `getAllHousingLocations` 所回傳的值。

<docs-code language="angular-ts" header="在 src/app/home/home.ts 中從服務初始化資料" path="adev/src/content/tutorials/first-app/steps/10-routing/src/app/home/home.ts" visibleLines="[23,30]"/>

1. 儲存對 `src/app/home/home.ts` 的變更，確認你的應用程式建置時沒有錯誤。
   繼續下一步之前，請先修正任何錯誤。
   </docs-step>

</docs-workflow>

SUMMARY: 在這一課中，你為應用程式加入了一個 Angular 服務，並將它注入 `Home` 類別。
這讓應用程式取得資料的方式有了清楚的區隔。
目前，新服務是從靜態資料陣列取得資料。
在之後的課程中，你會重構這個服務，讓它從 API 端點取得資料。

如需本課所涵蓋主題的更多資訊，請造訪：

<docs-pill-row>
  <docs-pill href="guide/di/creating-injectable-service" title="建立可注入的服務"/>
  <docs-pill href="guide/di" title="Angular 中的依賴注入"/>
  <docs-pill href="cli/generate/service" title="ng generate service"/>
  <docs-pill href="cli/generate" title="ng generate"/>
</docs-pill-row>
