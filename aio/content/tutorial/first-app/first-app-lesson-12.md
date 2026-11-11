# 第 12 課：為你的 Angular 應用程式加入表單

這堂教學課程示範如何為 Angular 應用程式加上一個收集使用者資料的表單。 本課從一個可以正常運作的 Angular 應用程式出發，示範如何為它加上表單。

表單收集到的資料只會送到應用程式的服務，由服務寫入瀏覽器的主控台。 本課不會介紹如何使用 REST API 傳送與接收表單資料。

**預估時間**：約 15 分鐘

**起始程式碼**： <live-example name="first-app-lesson-11"></live-example>

**完成程式碼**： <live-example name="first-app-lesson-12"></live-example>

## 你將學到什麼

*  你的應用程式會有一個表單，讓使用者輸入資料並送到應用程式的服務。
*  服務會把表單的資料寫入瀏覽器的主控台日誌。

## 步驟 1：加入傳送表單資料的方法

這個步驟會為應用程式的服務加上一個方法，負責接收表單資料並送往目的地。在本範例中，這個方法會把表單資料寫入瀏覽器的主控台日誌。

在 IDE 的 **Edit** 窗格中：

1.  1. 在 `src/app/housing.service.ts` 裡，找到 `HousingService` 類別，在類別定義的最下方貼上這個方法。

    <code-example header="Submit method in src/app/housing.service.ts" path="first-app-lesson-12/src/app/housing.service.ts" region="submit-method"></code-example>

1.  1. 確認應用程式能順利建置、沒有錯誤。 繼續下一個步驟之前，請先修正所有錯誤。

## 步驟 2：為詳細資訊頁面加入表單函式

這個步驟會為詳細資訊頁面加入處理表單互動的程式碼。

在 IDE 的 **Edit** 窗格中，打開 `src/app/details/details.component.ts`：

1.  1. 在檔案頂端的 `import` 陳述式之後，加上以下程式碼，匯入 Angular 的表單類別。

    <code-example header="Forms imports in src/app/details/details.component.ts" path="first-app-lesson-12/src/app/details/details.component.ts" region="form-imports"></code-example>

1.  1. 在 `DetailsComponent` 裝飾器的中繼資料中，用以下程式碼更新 `imports` 屬性：

    <code-example header="imports directive in src/app/details/details.component.ts" path="first-app-lesson-12/src/app/details/details.component.ts" region="component-imports"></code-example>

1. 在 `DetailsComponent` 類別中、`constructor()` 方法之前，加上以下程式碼來建立表單物件。

    <code-example header="template directive in src/app/details/details.component.ts" path="first-app-lesson-12/src/app/details/details.component.ts" region="form-code"></code-example>

在 Angular 中，`FormGroup` 和 `FormControl` 是讓你建構表單的型別。`FormControl` 型別可以提供預設值，並塑造表單資料的形狀。在本範例中，`firstName` 是 `string`，預設值是空字串。

1. 在 `DetailsComponent` 類別中、`constructor()` 方法之後，加上以下程式碼來處理 **Apply now** 的點選動作。

    <code-example header="template directive in src/app/details/details.component.ts" path="first-app-lesson-12/src/app/details/details.component.ts" region="form-submit"></code-example>

這個按鈕目前還不存在，你會在下一個步驟加上它。在上面的程式碼中，`FormControl` 可能會回傳 `null`。這段程式碼使用空值合併運算子，在值為 `null` 時預設改用空字串。

1.  1. 確認應用程式能順利建置、沒有錯誤。 繼續下一個步驟之前，請先修正所有錯誤。

## 步驟 3：為詳細資訊頁面加入表單的標記

這個步驟會為詳細資訊頁面加入顯示表單的標記。

在 IDE 的 **Edit** 窗格中，打開 `src/app/details/details.component.ts`：

1. 在 `DetailsComponent` 裝飾器的中繼資料中，把 `template` 的 HTML 更新為以下程式碼，加上表單的標記。

    <code-example header="template directive in src/app/details/details.component.ts" path="first-app-lesson-12/src/app/details/details.component.ts" region="component-template"></code-example>

範本現在包含一個事件處理器 `(submit)="submitApplication()"`。Angular 使用在事件名稱外加括號的語法，在範本程式碼中定義事件。等號右邊的程式碼，就是這個事件被觸發時要執行的程式碼。你可以繫結瀏覽器事件，也可以繫結自訂事件。

1.  1. 確認應用程式能順利建置、沒有錯誤。 繼續下一個步驟之前，請先修正所有錯誤。


    <section class="lightbox">
    <img alt="含申請入住此地點表單的詳細資料頁面" src="generated/images/guide/faa/homes-app-lesson-12-step-3.png">
    </section>

## 步驟 4：測試應用程式的新表單

這個步驟會測試新表單，確認表單資料送交給應用程式後，會出現在主控台日誌中。

1.  在 IDE 的 **終端機** 窗格中，執行 `ng serve`（如果尚未執行）。
1.  在瀏覽器中，於 `http://localhost:4200` 開啟你的應用程式。
1.  在瀏覽器中的應用程式上按一下右鍵，然後從快顯功能表中選擇 **檢查**。
1.  在開發人員工具視窗中，選擇 **主控台** 索引標籤。請確認開發人員工具視窗在接下來的步驟中保持可見
1.  在你的應用程式中：
    1.  選擇一個房屋地點，然後點選 **Learn more**，查看該房屋的詳細資訊。
    1.  在該房屋的詳細資訊頁面中，捲動到底部，找到新的表單。
    1.  在表單的欄位中輸入資料，任何資料都可以。
    1.  選擇 **Apply now** 來送出資料。
1.  在開發人員工具視窗中，查看日誌輸出，找到你的表單資料。

## 課程回顧

在這一課中，你更新了應用程式，加入了以下內容：
*  使用 Angular 的表單功能加入表單
*  使用事件處理器，把表單中擷取的資料連接到元件

如果你在這一課遇到任何困難，可以在 <live-example></live-example> 中查看這一課的完成程式碼。

## 後續步驟

*  [第 13 課：為你的應用程式加入搜尋功能](tutorial/first-app/first-app-lesson-13)

## 更多資訊

如需本課所涵蓋主題的更多資訊，請造訪：

*  [Angular 表單](/guide/forms)
*  [事件處理](/guide/event-binding)

@reviewed 2023-07-12
