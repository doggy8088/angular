# 將詳細資訊頁面整合到應用程式中

這個教學課程示範如何將詳細資訊頁面連接到你的應用程式。

<docs-video src="https://www.youtube.com/embed/-jRxG84AzCI?si=CbqIpmRpwp5ZZDnu&amp;start=345"/>

重要：我們建議使用您的本地環境來學習路由。

## 你將會學到

在本課程結束時，您的應用程式將支援路由至詳細資料頁面。

## 使用路由參數的路由概念性預覽

每個住房地點都有特定詳細資訊，當使用者導航至該項目的詳細資訊頁面時應顯示這些詳細資訊。為達成此目標，您需要使用路由參數。

路徑參數讓您能將動態資訊包含在您的路徑 URL 中。若要識別使用者點擊的房屋位置，您將使用 `HousingLocation` 類型的 `id` 屬性。

<docs-workflow>

<docs-step title="為你的應用程式建立一個新服務">
在課程 10 中，你將第二個路由新增至 `src/app/routes.ts`，其中包含一個特殊區段，用於識別路由參數 `id`：

<docs-code language="javascript">
'details/:id'
</docs-code>

在這種情況下，`:id` 是動態的，且會根據程式碼如何要求路由而改變。

1. 在 `src/app/housing-location/housing-location.component.ts` 中，將錨點標籤新增至 `section` 元素並包含 `routerLink` 指令：

    <docs-code header="將錨點加上 routerLink 指令新增至 housing-location.component.ts" path="adev/src/content/tutorials/first-app/steps/12-forms/src/app/housing-location/housing-location.component.ts" visibleLines="[13,20]"/>

    `routerLink` 指令可啟用 Angular 的路由器，以在應用程式中建立動態連結。指定給 `routerLink` 的值是包含兩個條目的陣列：路徑的靜態部分和動態資料。

    若要在範本中使用 `routerLink`，請新增 `RouterLink` 和 `RouterOutlet` 的檔案層級匯入，路徑為 '@angular/router'，然後更新元件 `imports` 陣列以包含 `RouterLink` 和 `RouterOutlet`。
1. 在此階段，您可以確認路由是否在您的應用程式中運作。在瀏覽器中，重新整理首頁，然後按一下房屋地點的「了解更多」按鈕。

    <img alt="顯示文字「details works!」的詳細資料頁面" src="assets/content/images/tutorials/first-app/homes-app-lesson-11-step-1.png">

</docs-step>

<docs-step title="取得路由參數">
在這個步驟中，你將在 `DetailsComponent` 中取得路由參數。目前，應用程式顯示 `詳情有效！`。接下來，你將更新程式碼以顯示使用路由參數傳遞的 `id` 值。

1. 在 `src/app/details/details.component.ts` 中更新範本以匯入您需要在 `DetailsComponent` 中使用的函式、類別和服務：

    <docs-code header="更新檔案層級匯入" path="adev/src/content/tutorials/first-app/steps/12-forms/src/app/details/details.component.ts" visibleLines="[1,5]"/>

1. 更新 `@Component` 裝飾器的 `template` 屬性以顯示 `housingLocationId` 值：

    <docs-code language="javascript">
      template: `&lt;p&gt;details works! {{ housingLocationId }}&lt;/p&gt;`,
    </docs-code>

1. 使用以下程式碼更新 `DetailsComponent` 的主體：

    <docs-code language="javascript">
        export class DetailsComponent {
            route: ActivatedRoute = inject(ActivatedRoute);
            housingLocationId = -1;
            constructor() {
                this.housingLocationId = Number(this.route.snapshot.params['id']);
            }
        }
    </docs-code>

    此程式碼授予 `DetailsComponent` 存取 `ActivatedRoute` 路由功能，讓您可以存取有關目前路徑的資料。在 `constructor` 中，程式碼將從路徑取得的 `id` 參數從字串轉換為數字。

1. 儲存所有變更。

1. 在瀏覽器中，按一下其中一個住宅地點的「瞭解更多」連結，並確認頁面上顯示的數值值與資料中該地點的 `id` 屬性相符。
</docs-step>

<docs-step title="自訂 `DetailComponent`">
現在路由在應用程式中正常運作，這時是更新 `DetailsComponent` 範本的絕佳時機，以顯示路由參數的住宅位置所代表的特定資料。

要存取資料，您會新增呼叫到 `HousingService`。

1. 將範本程式碼更新為符合下列程式碼：

    <docs-code header="更新 src/app/details/details.component.ts 中的 DetailsComponent 範本" path="adev/src/content/tutorials/first-app/steps/12-forms/src/app/details/details.component.ts" visibleLines="[11,28]"/>

    請注意，`housingLocation` 屬性是使用選擇性鏈結運算子 `?` 存取的。這可確保如果 `housingLocation` 值為 null 或未定義，應用程式就不會崩潰。

1. 將 `DetailsComponent` 類別的主體更新為符合下列程式碼：

    <docs-code header="更新 src/app/details/details.component.ts 中的 DetailsComponent 類別" path="adev/src/content/tutorials/first-app/steps/12-forms/src/app/details/details.component.ts" visibleLines="[31,42]"/>

    現在，此元件有程式碼可根據所選的住房位置顯示正確的資訊。`constructor` 函式現在包括呼叫 `HousingService` 以將路由參數作為引數傳遞給 `getHousingLocationById` 服務函式。

1. 將下列樣式複製到 `src/app/details/details.component.css` 檔案：

    <docs-code header="新增 DetailsComponent 的樣式" path="adev/src/content/tutorials/first-app/steps/12-forms/src/app/details/details.component.css" visibleLines="[1,71]"/>

1. 儲存變更。

1. 在瀏覽器中重新整理頁面，並確認當您按一下特定住房位置的「了解更多」連結時，詳細資料頁面會根據所選項目資料顯示正確的資訊。

    <img alt="列出房屋資訊的詳細資料頁面" src="assets/content/images/tutorials/first-app/homes-app-lesson-11-step-3.png">

</docs-step>

<docs-step title="在 `HomeComponent` 中新增導覽">
在前面的課程中，您更新了 `AppComponent` 範本，以包含 `routerLink`。新增該程式碼可更新您的應用程式，以便在每次點擊標誌時，都可以導覽回 `HomeComponent`。

1. 確認您的程式碼符合以下內容：

    <docs-code header="將 routerLink 加入 AppComponent" path="adev/src/content/tutorials/first-app/steps/12-forms/src/app/app.component.ts" visibleLines="[13,24]"/>

    您的程式碼可能已經是最新的了，但請確認以確保無誤。
</docs-step>

</docs-workflow>

摘要：在本課程中，您新增路由以顯示詳細資料頁面。

現在您知道如何：

* 使用路由參數將資料傳遞至路由
* 使用 `routerLink` 指令使用動態資料來建立路由
* 使用路由參數從 `HousingService` 中擷取資料來顯示特定住房位置資訊。

目前為止真的很棒。

有關本課程中涵蓋的主題的更多資訊，請造訪：

<docs-pill-row>
  <docs-pill href="guide/routing/common-router-tasks#accessing-query-parameters-and-fragments" title="路由參數"/>
  <docs-pill href="guide/routing" title="Angular 概觀中的路由"/>
  <docs-pill href="guide/routing/common-router-tasks" title="常見路由任務"/>
  <docs-pill href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Optional_chaining" title="選擇性鏈結運算子"/>
</docs-pill-row>

