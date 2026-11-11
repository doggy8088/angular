# 將詳細資訊頁面整合進應用程式

本教學課程示範如何將詳細資訊頁面連接到你的應用程式。

<docs-video src="https://www.youtube.com/embed/-jRxG84AzCI?si=CbqIpmRpwp5ZZDnu&amp;start=345"/>

IMPORTANT: 我們建議使用你的本機環境來學習路由。

## 你將學到什麼

在這一課結束時，你的應用程式將支援路由到詳細資訊頁面。

## 帶有路由參數的路由概念預覽

每個房屋地點都有特定的詳細資訊，應該在使用者導覽到該項目的詳細資訊頁面時顯示。要達成這個目標，你需要使用路由參數。

路由參數讓你能將動態資訊包含在路由 URL 的一部分中。要辨識使用者點選了哪個房屋地點，你會使用 `HousingLocation` 型別的 `id` 屬性。

<docs-workflow>

<docs-step title="使用 `routerLink` 進行動態導覽">
在第 10 課中，你為 `src/app/routes.ts` 加入了第二條路由，其中包含一個辨識路由參數 `id` 的特殊區段：

<docs-code language="javascript">
'details/:id'
</docs-code>

在這個例子中，`:id` 是動態的，會依程式碼請求該路由的方式而改變。

1. 在 `src/app/housing-location/housing-location.component.ts` 中，為 `section` 元素加入一個錨點標籤，並包含 `routerLink` 指令：

    <docs-code header="為 housing-location.component.ts 加入帶有 routerLink 指令的錨點" path="adev/src/content/tutorials/first-app/steps/12-forms/src/app/housing-location/housing-location.component.ts" visibleLines="[20]"/>

    `routerLink` 指令讓 Angular 的路由器能在應用程式中建立動態連結。指派給 `routerLink` 的值是一個包含兩個項目的陣列：路徑的靜態部分與動態資料。

    為了讓 `routerLink` 能在範本中運作，請從 '@angular/router' 加入 `RouterLink` 與 `RouterOutlet` 的檔案層級匯入，然後更新元件的 `imports` 陣列，將 `RouterLink` 與 `RouterOutlet` 都包含進去。
1. 到了這個階段，你可以確認路由在你的應用程式中是否正常運作。在瀏覽器中，重新整理首頁，點選某個房屋地點的「Learn More」按鈕。

    <img alt="顯示「details works!」文字的詳細資訊頁面" src="assets/images/tutorials/first-app/homes-app-lesson-11-step-1.png">

</docs-step>

<docs-step title="取得路由參數">
在這個步驟中，你會在 `DetailsComponent` 中取得路由參數。目前，應用程式顯示的是 `details works!`。接著你會更新程式碼，顯示使用路由參數傳入的 `id` 值。

1. 在 `src/app/details/details.component.ts` 中，更新範本，匯入你在 `DetailsComponent` 中會需要用到的函式、類別與服務：

    <docs-code header="更新檔案層級的匯入" path="adev/src/content/tutorials/first-app/steps/12-forms/src/app/details/details.component.ts" visibleLines="[1,5]"/>

1. 更新 `@Component` 裝飾器的 `template` 屬性，顯示 `housingLocationId` 值：

    <docs-code language="javascript">
      template: `<p>details works! {{ housingLocationId }}</p>`,
    </docs-code>

1. 用下列程式碼更新 `DetailsComponent` 類別的內容：

    <docs-code language="javascript">
        export class DetailsComponent {
            route: ActivatedRoute = inject(ActivatedRoute);
            housingLocationId = -1;
            constructor() {
                this.housingLocationId = Number(this.route.snapshot.params['id']);
            }
        }
    </docs-code>

    這段程式碼讓 `DetailsComponent` 能存取 `ActivatedRoute` 路由功能，讓你能存取目前路由的相關資料。在 `constructor` 中，程式碼將從路由取得的 `id` 參數從字串轉換為數字。

1. 儲存所有變更。

1. 在瀏覽器中，點選某個房屋地點的「Learn More」連結，確認頁面上顯示的數字值與該地點在資料中的 `id` 屬性相符。
</docs-step>

<docs-step title="自訂 `DetailComponent`">
現在路由在應用程式中已能正常運作，正是更新 `DetailsComponent` 範本的好時機，讓它顯示路由參數所代表的房屋地點的特定資料。

要存取資料，你會加入對 `HousingService` 的呼叫。

1. 將範本程式碼更新成與下列程式碼一致：

    <docs-code header="更新 src/app/details/details.component.ts 中的 DetailsComponent 範本" path="adev/src/content/tutorials/first-app/steps/12-forms/src/app/details/details.component.ts" visibleLines="[11,32]"/>

    請注意，這裡以可選鏈結運算子 `?` 來存取 `housingLocation` 屬性。這能確保當 `housingLocation` 值為 null 或 undefined 時，應用程式不會當掉。

1. 將 `DetailsComponent` 類別的內容更新成與下列程式碼一致：

    <docs-code header="更新 src/app/details/details.component.ts 中的 DetailsComponent 類別" path="adev/src/content/tutorials/first-app/steps/12-forms/src/app/details/details.component.ts" visibleLines="[35,44]"/>

    現在元件有了能依所選房屋地點顯示正確資訊的程式碼。`constructor` 現在包含對 `HousingService` 的呼叫，將路由參數作為引數傳給 `getHousingLocationById` 服務函式。

1. 將下列樣式複製到 `src/app/details/details.component.css` 檔案中：

    <docs-code header="為 DetailsComponent 加入樣式" path="adev/src/content/tutorials/first-app/steps/12-forms/src/app/details/details.component.css" visibleLines="[1,71]"/>

1. 儲存你的變更。

1. 在瀏覽器中重新整理頁面，確認當你點選特定房屋地點的「Learn More」連結時，詳細資訊頁面會依所選項目的資料顯示正確資訊。

    <img alt="列出房屋資訊的詳細資訊頁面" src="assets/images/tutorials/first-app/homes-app-lesson-11-step-3.png">

</docs-step>

<docs-step title="為 `HomeComponent` 加入導覽">
在先前的課程中，你更新了 `AppComponent` 範本，加入 `routerLink`。加入那段程式碼後，你的應用程式就能在點選標誌時導覽回 `HomeComponent`。

1. 確認你的程式碼與下列內容一致：

    <docs-code header="為 AppComponent 加入 routerLink" path="adev/src/content/tutorials/first-app/steps/12-forms/src/app/app.component.ts" visibleLines="[8,20]"/>

    你的程式碼可能已經是最新的了，但還是確認一下比較保險。
</docs-step>

</docs-workflow>

SUMMARY: 在這一課中，你加入了路由來顯示詳細資訊頁面。

你現在知道如何：

* 使用路由參數將資料傳給路由
* 使用 `routerLink` 指令，以動態資料建立路由
* 使用路由參數從 `HousingService` 取得資料，顯示特定房屋地點的資訊。

到目前為止真的做得很好。

如需本課所涵蓋主題的更多資訊，請造訪：

<docs-pill-row>
  <docs-pill href="guide/routing/common-router-tasks#accessing-query-parameters-and-fragments" title="路由參數"/>
  <docs-pill href="guide/routing" title="Angular 路由總覽"/>
  <docs-pill href="guide/routing/common-router-tasks" title="常見路由工作"/>
  <docs-pill href="https://developer.mozilla.org/docs/Web/JavaScript/Reference/Operators/Optional_chaining" title="可選鏈結運算子"/>
</docs-pill-row>
