# 第 11 課：將詳細資訊頁面整合進應用程式

本教學課程示範如何將詳細資訊頁面連接到你的應用程式。

**預估時間**：約 15 分鐘

**起始程式碼**： <live-example name="first-app-lesson-10"></live-example>

**完成程式碼**： <live-example name="first-app-lesson-11"></live-example>

## 你將學到什麼
在這一課結束時，你的應用程式將支援路由到詳細資訊頁面。

## 帶有路由參數的路由概念預覽
每個房屋地點都有特定的詳細資訊，應該在使用者導覽到該項目的詳細資訊頁面時顯示。要達成這個目標，你需要使用路由參數。

路由參數讓你能將動態資訊包含在路由 URL 的一部分中。要辨識使用者點選了哪個房屋地點，你會使用 `id` 型別的 `HousingLocation` 屬性。

## 步驟 1：為你的應用程式建立新的服務
在第 10 課中，你為 `src/app/routes.ts` 加入了第二條路由，其中包含一個辨識路由參數 `id` 的特殊區段：

    <code-example format="javascript" language="javascript">
    'details/:id'
    </code-example>

在這個例子中，`:id` 是動態的，會依程式碼請求該路由的方式而改變。

1.  1. 在 `src/app/housing-location/housing-location.component.ts` 中，為 `section` 元素加入一個錨點標籤，並包含 `routerLink` 指令：

    <code-example header="Add anchor with a routerLink directive to housing-location.component.ts" path="first-app-lesson-11/src/app/housing-location/housing-location.component.ts" region="add-router-link"></code-example>

`routerLink` 指令讓 Angular 的路由器能在應用程式中建立動態連結。指派給 `routerLink` 的值是一個包含兩個項目的陣列：路徑的靜態部分與動態資料。

若要讓 `routerLink` 在範本中運作，請從 '@angular/router' 加入檔案層級的 `RouterLink` 與 `RouterOutlet` import，然後更新元件的 `imports` 陣列，加入 `RouterLink` 與 `RouterOutlet`。
1. 此時，你可以確認路由已在你的應用程式中運作。在瀏覽器中，重新整理首頁，然後點選某個房屋地點的「Learn More」按鈕。

    <section class="lightbox">
    <img alt="詳細資料頁面，顯示文字「details works!」" src="generated/images/guide/faa/homes-app-lesson-11-step-1.png">
    </section>

## 步驟 2：取得路由參數
在這個步驟中，你會在 `DetailsComponent` 中取得路由參數。目前，應用程式顯示的是 `details works!`。接著你會更新程式碼，顯示使用路由參數傳入的 `id` 值。

1.  1. 在 `src/app/details/details.component.ts` 中，更新範本，匯入你在 `DetailsComponent` 中會需要用到的函式、類別與服務：

    <code-example header="Update file level imports" path="first-app-lesson-11/src/app/details/details.component.ts" region="import-resources-for-details"></code-example>

1. 更新 `template` 裝飾器的 `@Component` 屬性，顯示 `housingLocationId` 值：

    <code-example format="javascript" language="javascript">
      template: `&lt;p&gt;details works! {{ housingLocationId }}&lt;/p&gt;`,
    </code-example>

1.  1. 用下列程式碼更新 `DetailsComponent` 的內容：

    <code-example format="javascript" language="javascript">
        export class DetailsComponent {
            route: ActivatedRoute = inject(ActivatedRoute);
            housingLocationId = -1;
            constructor() {
                this.housingLocationId = Number(this.route.snapshot.params['id']);
            }
        }
    </code-example>

這段程式碼讓 `DetailsComponent` 能存取 `ActivatedRoute` 路由功能，讓你能存取目前路由的相關資料。在 `constructor` 中，程式碼將從路由取得的 `id` 參數從字串轉換為數字。

1.  儲存所有變更。

1.  1. 在瀏覽器中，點選某個房屋地點的「Learn More」連結，確認頁面上顯示的數字值與該地點在資料中的 `id` 屬性相符。 </docs-step>

## 步驟 3：自訂 `DetailComponent`
現在路由在應用程式中已能正常運作，正是更新 `DetailsComponent` 範本的好時機，讓它顯示路由參數所代表的房屋地點的特定資料。

要存取資料，你會加入對 `HousingService` 的呼叫。

1.  1. 將範本程式碼更新成與下列程式碼一致：

    <code-example header="Update the DetailsComponent template in src/app/details/details.component.ts" path="first-app-lesson-11/src/app/details/details.component.ts" region="update-details-template"></code-example>

請注意，這裡以可選鏈結運算子 `housingLocation` 來存取 `?` 屬性。這能確保當 `housingLocation` 值為 null 或 undefined 時，應用程式不會當掉。

1.  1. 將 `DetailsComponent` 類別的內容更新成與下列程式碼一致：

    <code-example header="Update the DetailsComponent class in src/app/details/details.component.ts" path="first-app-lesson-11/src/app/details/details.component.ts" region="get-housing-details"></code-example>

現在元件有了能依所選房屋地點顯示正確資訊的程式碼。`constructor` 現在包含對 `HousingService` 的呼叫，將路由參數作為引數傳給 `getHousingLocationById` 服務函式。

1.  1. 將下列樣式複製到 `src/app/details/details.component.css` 檔案中：

    <code-example header="Add styles for the DetailsComponent" path="first-app-lesson-11/src/app/details/details.component.css" region="add-details-styles"></code-example>

1.  儲存你的變更。

1.  1. 在瀏覽器中重新整理頁面，確認當你點選特定房屋地點的「Learn More」連結時，詳細資訊頁面會依所選項目的資料顯示正確資訊。

    <section class="lightbox">
    <img alt="列出房屋資訊的詳細資料頁面" src="generated/images/guide/faa/homes-app-lesson-11-step-3.png">
    </section>

## 步驟 4：為 `HomeComponent` 加入導覽
在先前的課程中，你更新了 `AppComponent` 範本，加入 `routerLink`。加入那段程式碼後，你的應用程式就能在點選標誌時導覽回 `HomeComponent`。

1.  1. 確認你的程式碼與下列內容一致：

    <code-example header="Add routerLink to AppComponent" path="first-app-lesson-11/src/app/app.component.ts" region="add-router-link-to-header"></code-example>

你的程式碼可能已經是最新的了，但還是確認一下比較保險。

## 課程回顧
在這一課中，你更新了應用程式，加入了以下內容：
* 使用路由參數將資料傳給路由
* 使用 `routerLink` 指令，以動態資料建立路由
* 使用路由參數從 `HousingService` 取得資料，顯示特定房屋地點的資訊。

到目前為止真的做得很好。

如果你在這一課遇到任何困難，可以在 <live-example></live-example> 中查看這一課的完成程式碼。

## 後續步驟
*  [第 12 課：為你的 Angular 應用程式加入表單](tutorial/first-app/first-app-lesson-12)

## 更多資訊

如需本課所涵蓋主題的更多資訊，請造訪：

<!-- vale Angular.Google_WordListSuggestions = NO -->
*  [路由參數](guide/router#存取查詢參數與-fragment)
*  [Angular 路由總覽](guide/routing-overview)
*  [常見路由任務](guide/router)
*  [可選鏈結運算子](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Optional_chaining)

@reviewed 2023-07-15
