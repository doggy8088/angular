# 建立應用程式的 HousingLocation 元件

本教學課程示範如何將 `HousingLocation` 元件加入你的 Angular 應用程式。

<docs-video src="https://www.youtube.com/embed/R0nRX8jD2D0?si=U4ONEbPvtptdUHTt&amp;start=440"/>

## 你將學到什麼

- 你的應用程式有了一個新元件：`HousingLocation`，它會顯示一則訊息，確認該元件已加入你的應用程式。

<docs-workflow>

<docs-step title="建立 `HousingLocation`">
在這個步驟中，你會為應用程式建立一個新元件。

在 IDE 的 **Terminal** 窗格中：

1. 在你的專案目錄中，進入 `first-app` 目錄。

1. 執行下列指令，建立新的 `HousingLocation`

   ```shell
   ng generate component housingLocation
   ```

1. 執行下列指令，建置並提供你的應用程式。

   ```shell
   ng serve
   ```

   NOTE: 這個步驟只適用於你的本機環境！

1. 開啟瀏覽器，前往 `http://localhost:4200` 找到應用程式。
1. 確認應用程式建置時沒有錯誤。

   HELPFUL: 畫面應該和上一課一樣，因為雖然你加入了新元件，但你還沒有把它放進應用程式的任何範本裡。

1. 讓 `ng serve` 繼續執行，同時進行接下來的步驟。
   </docs-step>

<docs-step title="將新元件加入應用程式的版面配置">
在這個步驟中，你會將新元件 `HousingLocation` 加入應用程式的 `Home`，讓它顯示在應用程式的版面配置中。

在 IDE 的 **Edit** 窗格中：

1.  在編輯器中開啟 `home.ts`。
1.  在 `home.ts` 中，將這一行加入檔案層級的 imports，匯入 `HousingLocation`。

      <docs-code header="在 src/app/home/home.ts 中匯入 HousingLocation" path="adev/src/content/tutorials/first-app/steps/04-interfaces/src/app/home/home.ts" visibleLines="[2]"/>

1.  接著，更新 `@Component` 中繼資料的 `imports` 屬性，將 `HousingLocation` 加入陣列。

      <docs-code  header="將 HousingLocation 加入 src/app/home/home.ts 的 imports 陣列" path="adev/src/content/tutorials/first-app/steps/04-interfaces/src/app/home/home.ts" visibleLines="[6]"/>

1.  現在，這個元件已經可以在 `Home` 的範本中使用了。更新 `@Component` 中繼資料的 `template` 屬性，加入對 `<app-housing-location>` 標籤的參照。

      <docs-code language="angular-ts" header="將房屋地點加入 src/app/home/home.ts 的元件範本" path="adev/src/content/tutorials/first-app/steps/04-interfaces/src/app/home/home.ts" visibleLines="[7,17]"/>

</docs-step>

<docs-step title="為元件加入樣式">
在這個步驟中，你會將預先寫好的 `HousingLocation` 樣式複製到你的應用程式，讓應用程式能正確渲染。

1. 開啟 `src/app/housing-location/housing-location.css`，將下列樣式貼到檔案中：

   NOTE: 在瀏覽器中，這些樣式可以放在 `src/app/housing-location/housing-location.ts` 的 `styles` 陣列裡。

   <docs-code header="為 src/app/housing-location/housing-location.css 中的元件加入 CSS 樣式" path="adev/src/content/tutorials/first-app/steps/04-interfaces/src/app/housing-location/housing-location.css"/>

1. 儲存你的程式碼，回到瀏覽器，確認應用程式建置時沒有錯誤。你應該會看到「housing-location works!」訊息渲染在畫面上。繼續下一步之前，請先修正任何錯誤。

   <img alt="homes-app 的瀏覽器畫面，顯示標誌、篩選文字輸入框、搜尋按鈕與「housing-location works!」訊息" src="assets/images/tutorials/first-app/homes-app-lesson-03-step-2.png">

</docs-step>

</docs-workflow>

SUMMARY: 在這一課中，你為應用程式建立了一個新元件，並將它加入應用程式的版面配置。
