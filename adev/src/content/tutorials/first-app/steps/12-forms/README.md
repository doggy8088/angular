# 為你的 Angular 應用程式加上表單

這堂教學課程示範如何為 Angular 應用程式加上一個收集使用者資料的表單。
本課從一個可以正常運作的 Angular 應用程式出發，示範如何為它加上表單。

表單收集到的資料只會送到應用程式的服務，由服務寫入瀏覽器的主控台。
本課不會介紹如何使用 REST API 傳送與接收表單資料。

<docs-video src="https://www.youtube.com/embed/kWbk-dOJaNQ?si=FYMXGdUiT-qh321h"/>

IMPORTANT: 本教學的這個步驟，建議你在本機環境操作。

## 你會學到什麼

- 你的應用程式會有一個表單，讓使用者輸入資料並送到應用程式的服務。
- 服務會把表單的資料寫入瀏覽器的主控台日誌。

<docs-workflow>

<docs-step title="加上傳送表單資料的方法">
這個步驟會為應用程式的服務加上一個方法，負責接收表單資料並送往目的地。
在本範例中，這個方法會把表單資料寫入瀏覽器的主控台日誌。

在 IDE 的 **Edit** 窗格中：

1.  在 `src/app/housing.service.ts` 裡，找到 `HousingService` 類別，在類別定義的最下方貼上這個方法。

       <docs-code header="src/app/housing.service.ts 中的提交方法" path="adev/src/content/tutorials/first-app/steps/13-search/src/app/housing.service.ts" visibleLines="[120,124]"/>

1.  確認應用程式能順利建置、沒有錯誤。
    繼續下一個步驟之前，請先修正所有錯誤。
    </docs-step>

<docs-step title="為詳細資訊頁加上表單功能">
這個步驟會為詳細資訊頁加上處理表單互動的程式碼。

在 IDE 的 **Edit** 窗格中，打開 `src/app/details/details.ts`：

1.  在檔案頂端的 `import` 陳述式之後，加上以下程式碼，匯入 Angular 的表單類別。

      <docs-code header="src/app/details/details.ts 中的表單匯入" path="adev/src/content/tutorials/first-app/steps/13-search/src/app/details/details.ts" visibleLines="[5]"/>

1.  在 `Details` 裝飾器的中繼資料中，用以下程式碼更新 `imports` 屬性：

      <docs-code header="src/app/details/details.ts 中的 imports 指令" path="adev/src/content/tutorials/first-app/steps/13-search/src/app/details/details.ts" visibleLines="[9]"/>

1.  在 `Details` 類別中、`constructor()` 方法之前，加上以下程式碼來建立表單物件。

      <docs-code header="src/app/details/details.ts 中的範本指令" path="adev/src/content/tutorials/first-app/steps/13-search/src/app/details/details.ts" visibleLines="[52,56]"/>

    在 Angular 中，`FormGroup` 和 `FormControl` 是讓你建構表單的型別。`FormControl` 型別可以提供預設值，並塑造表單資料的形狀。在本範例中，`firstName` 是 `string`，預設值是空字串。

1.  在 `Details` 類別中、`constructor()` 方法之後，加上以下程式碼來處理 **Apply now** 的點選動作。

      <docs-code header="src/app/details/details.ts 中的範本指令" path="adev/src/content/tutorials/first-app/steps/13-search/src/app/details/details.ts" visibleLines="[62,68]"/>

    這個按鈕目前還不存在，你會在下一個步驟加上它。在上面的程式碼中，`FormControl` 可能會回傳 `null`。這段程式碼使用空值合併運算子，在值為 `null` 時預設改用空字串。

1.  確認應用程式能順利建置、沒有錯誤。
    繼續下一個步驟之前，請先修正所有錯誤。
    </docs-step>

<docs-step title="為詳細資訊頁加上表單的標記">
這個步驟會為詳細資訊頁加上顯示表單的標記。

在 IDE 的 **Edit** 窗格中，打開 `src/app/details/details.ts`：

1. 在 `Details` 裝飾器的中繼資料中，把 `template` 的 HTML 更新為以下程式碼，加上表單的標記。

   <docs-code language="angular-ts" header="src/app/details/details.ts 中的範本指令" path="adev/src/content/tutorials/first-app/steps/13-search/src/app/details/details.ts" visibleLines="[10,45]"/>

   範本現在包含一個事件處理器 `(submit)="submitApplication()"`。Angular 使用在事件名稱外加括號的語法，在範本程式碼中定義事件。等號右邊的程式碼，就是這個事件被觸發時要執行的程式碼。你可以繫結瀏覽器事件，也可以繫結自訂事件。

1. 確認應用程式能順利建置、沒有錯誤。
   繼續下一個步驟之前，請先修正所有錯誤。

   <img alt="詳細資訊頁，含有申請入住該地點的表單" src="assets/images/tutorials/first-app/homes-app-lesson-12-step-3.png">

</docs-step>

<docs-step title="測試應用程式的新表單">
這個步驟會測試新表單，確認表單資料送交給應用程式後，會出現在主控台日誌中。

1. 在 IDE 的 **Terminal** 窗格中執行 `ng serve`（如果還沒在執行的話）。
1. 在瀏覽器中，於 `http://localhost:4200` 開啟你的應用程式。
1. 在瀏覽器中對應用程式按右鍵，從右鍵選單中選擇 **Inspect**。
1. 在開發者工具視窗中，選擇 **Console** 分頁。
   接下來的步驟中，請確保開發者工具視窗保持可見。
1. 在你的應用程式中：
   1. 選擇一個住房地點，點選 **Learn more**，查看這間房屋的詳細資訊。
   1. 在房屋的詳細資訊頁中，捲動到最下方，找到新表單。
   1. 在表單欄位中輸入資料，輸入任何資料都可以。
   1. 選擇 **Apply now** 送出資料。
1. 在開發者工具視窗中，檢查日誌輸出，找出你的表單資料。
   </docs-step>

</docs-workflow>

SUMMARY: 在本課中，你更新了應用程式，使用 Angular 的表單功能加上一個表單，並透過事件處理器，把表單收集到的資料連接到元件。

想進一步了解本課介紹的主題，請造訪：

<docs-pill-row>
  <docs-pill href="guide/forms" title="Angular 表單"/>
  <docs-pill href="guide/templates/event-listeners" title="事件處理"/>
</docs-pill-row>
