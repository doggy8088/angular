# 將表單加入您的 Angular 應用程式

本教學課程示範如何新增一個收集使用者資料的表單至 Angular 應用程式。
本課程從一個可用的 Angular 應用程式開始，並示範如何新增表單至該應用程式。

表單收集的資料只會傳送到應用程式的服務，它會將資料寫入瀏覽器的控制台。
本課程不包含使用 REST API 傳送和接收表單資料的內容。

<docs-video src="https://www.youtube.com/embed/kWbk-dOJaNQ?si=FYMXGdUiT-qh321h"/>

重要提示：我們建議您將此步驟的教學課程用於您的本地環境。

## 你將會學到

* 您的應用程式有一個表單，使用者可以輸入其中，傳送到您應用程式的服務中。
* 服務將表單中的資料寫入瀏覽器的控制台記錄。

<docs-workflow>

<docs-step title="新增方法來傳送表單資料">
這個步驟會為您的應用程式服務新增一個方法，用來接收要傳送至資料目的地的表單資料。
在此範例中，該方法會將表單的資料寫入瀏覽器的控制台日誌。

在您的 IDE 的 **編輯** 窗格中：

1. 在 `src/app/housing.service.ts` 中，在 `HousingService` 類別內，將此方法貼到類別定義的底部。

    <docs-code header="src/app/housing.service.ts 中的 Submit 方法" path="adev/src/content/tutorials/first-app/steps/13-search/src/app/housing.service.ts" visibleLines="[120,122]"/>

1. 確認應用程式沒有錯誤地建置。
    在繼續到下一個步驟之前，請更正任何錯誤。
</docs-step>

<docs-step title="在詳細資料頁面中新增表單功能">
此步驟會在詳細資料頁面中新增用於處理表單互動的程式碼。

在 IDE 的 **編輯** 窗格中，在 `src/app/details/details.component.ts` 中：

1. 在檔案頂端 `import` 陳述句之後，加入以下程式碼來匯入 Angular 表單類別。

    <docs-code header="src/app/details/details.component.ts 中的 Forms 匯入" path="adev/src/content/tutorials/first-app/steps/13-search/src/app/details/details.component.ts" visibleLines="[6]"/>

1. 在 `DetailsComponent` 裝飾器中，使用以下程式碼更新 `imports` 屬性：

    <docs-code header="src/app/details/details.component.ts 中的 imports 指令" path="adev/src/content/tutorials/first-app/steps/13-search/src/app/details/details.component.ts" visibleLines="[10,13]"/>

1. 在 `DetailsComponent` 類別中，在 `constructor()` 方法之前，加入以下程式碼來建立表單物件。

    <docs-code header="src/app/details/details.component.ts 中的 template 指令" path="adev/src/content/tutorials/first-app/steps/13-search/src/app/details/details.component.ts" visibleLines="[53,57]"/>

    在 Angular 中，`FormGroup` 和 `FormControl` 是可讓您建立表單的類型。`FormControl` 類型可以提供預設值並塑造表單資料。在此範例中，`firstName` 是 `string`，而預設值為空字串。

1. 在 `DetailsComponent` 類別中，在 `constructor()` 方法之後，加入以下程式碼來處理 **立即申請** 的點擊。

    <docs-code header="src/app/details/details.component.ts 中的 template 指令" path="adev/src/content/tutorials/first-app/steps/13-search/src/app/details/details.component.ts" visibleLines="[64,69]"/>

    此按鈕尚未存在 - 您會在下一步中加入。在以上的程式碼中，`FormControl` 可能會傳回 `null`。此程式碼使用 null 合併運算子，如果值為 `null`，則預設為空字串。

1. 確認應用程式在沒有錯誤的情況下建置完成。
    在繼續進行下一步之前，請更正任何錯誤。
</docs-step>

<docs-step title="將表單標記新增至詳細資料頁面">
此步驟將標記新增至顯示表單的詳細資料頁面。

在 IDE 的 **編輯** 窗格中，在 `src/app/details/details.component.ts` 中：

1. 在 `DetailsComponent` 裝飾器元數據中，更新 `template` HTML 以符合下列程式碼，以新增表單標記。

    <docs-code header="src/app/details/details.component.ts 中的 template 指令" path="adev/src/content/tutorials/first-app/steps/13-search/src/app/details/details.component.ts" visibleLines="[15,45]"/>

    該範本現在包含一個事件處理常式 `(submit)="submitApplication()"`。Angular 使用事件名稱周圍的括號語法來定義範本程式碼中的事件。等號右邊的程式碼是在觸發此事件時應該執行的程式碼。您可以連結到瀏覽器事件和自訂事件。

1. 確認應用程式建置時不會產生錯誤。
    在繼續進行下一個步驟之前，請更正任何錯誤。

    <img alt="詳細資料頁面，其中有一個表單可申請住在這個地方" src="assets/content/images/tutorials/first-app/homes-app-lesson-12-step-3.png">

</docs-step>

<docs-step title="測試應用程式的新表單">
此步驟測試新的表單，以查看當表單資料提交至應用程式時，表單資料是否會出現在主控台記錄中。

1. 在 IDE 的 **終端機** 窗格中，執行 `ng serve`（如果尚未執行）。
1. 在瀏覽器中，以 `http://localhost:4200` 開啟您的應用程式。
1. 在瀏覽器中右鍵按一下應用程式，然後從內容功能表中選擇 **檢查**。
1. 在開發人員工具視窗中，選擇 **主控台** 標籤。
    請確保開發人員工具視窗在後續步驟中為可見狀態
1. 在您的應用程式中：
    1. 選擇一個房屋地點，然後按一下 **了解更多**，以查看房屋的詳細資料。
    1. 在房屋的詳細資料頁面中，捲動到最下方以找到新表單。
    1. 在表單欄位中輸入資料，任何資料皆可。
    1. 選擇 **立即申請** 以提交資料。
1. 在開發人員工具視窗中，檢閱記錄輸出以找到您的表單資料。
</docs-step>

</docs-workflow>

摘要：在這個課程中，您已使用 Angular 的表單功能更新您的應用程式以新增表單，並使用事件處理常式將表單中擷取的資料連接到元件。

有關本課程中涵蓋的主題的更多資訊，請造訪：

<docs-pill-row>
  <docs-pill href="guide/forms" title="Angular Forms"/>
  <docs-pill href="guide/templates/event-binding" title="事件處理"/>
</docs-pill-row>

