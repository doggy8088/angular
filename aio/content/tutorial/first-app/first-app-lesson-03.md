# 建立應用程式的 HousingLocation 元件

本教學課程示範如何將 `HousingLocation` 元件加入你的 Angular 應用程式。

**預計時間**：約 10 分鐘

**起始程式碼：** <live-example name="first-app-lesson-02"></live-example>

**完成程式碼：** <live-example name="first-app-lesson-03"></live-example>

## 你將學到什麼
* 你的應用程式有了一個新元件：`HousingLocationComponent`，它會顯示一則訊息，確認該元件已加入你的應用程式。

## 步驟 1 - 建立 `HousingLocationComponent`

在這個步驟中，你會為應用程式建立一個新元件。

在 IDE 的 **Terminal** 窗格中：

1. 在你的專案目錄中，進入 `first-app` 目錄。

1. 執行下列指令，建立新的 `HousingLocationComponent`

    <code-example format="shell" language="shell">
    ng generate component housingLocation --standalone --inline-template --skip-tests
    </code-example>

1. 執行下列指令，建置並提供你的應用程式。

    <code-example format="shell" language="shell">

    ng serve

    </code-example>

1. 開啟瀏覽器，前往 `http://localhost:4200` 找到應用程式。
1. 確認應用程式建置時沒有錯誤。
    <div class="callout is-helpful">
      它應該會渲染得與上一課相同，因為即使你加入了一個新元件，你還沒有把它包含在應用程式的任何範本中。
    </div>
1. 在你完成接下來的步驟時，讓 `ng serve` 保持執行。

## 步驟 2 - 將新元件加入應用程式的版面配置

在這個步驟中，你要將新元件 `HousingLocationComponent` 加入應用程式的 `HomeComponent`，讓它顯示在應用程式的版面配置中。

在 IDE 的 **Edit** 窗格中：

1. 在編輯器中開啟 `home.component.ts`。
1. 在 `home.component.ts` 中，將這一行加入檔案層級的 imports，匯入 `HousingLocationComponent`。

    <code-example header="Import HousingLocationComponent in src/app/home/home.component.ts" path="first-app-lesson-03/src/app/home/home.component.ts" region="import-housingLocation"></code-example>

1. 接著，更新 `@Component` 中繼資料的 `imports` 屬性，將 `HousingLocationComponent` 加入陣列。

    <code-example header="Add HousingLocationComponent to imports array in src/app/home/home.component.ts" path="first-app-lesson-03/src/app/home/home.component.ts" region="add-housingLocation-to-array"></code-example>

1. 現在，這個元件已經可以在 `HomeComponent` 的範本中使用了。更新 `@Component` 中繼資料的 `template` 屬性，加入對 `<app-housing-location>` 標籤的參照。

    <code-example header="Add housing location to the component template in src/app/home/home.component.ts" path="first-app-lesson-03/src/app/home/home.component.ts" region="add-housingLocation-to-template"></code-example>

## 步驟 3 - 為元件加入樣式

在這個步驟中，你要把預先寫好的 `HousingLocationComponent` 樣式複製到應用程式中，讓應用程式正確渲染。

1. 開啟 `src/app/housing-location/housing-location.css`，將下列樣式貼到檔案中：
        
    <code-example header="Add CSS styles to housing location to the component in src/app/housing-location/housing-location.component.css" path="first-app-lesson-03/src/app/housing-location/housing-location.component.css"></code-example>

1. 儲存你的程式碼，回到瀏覽器，確認應用程式建置時沒有錯誤。你應該會看到「housing-location works!」訊息渲染在畫面上。繼續下一步之前，請先修正任何錯誤。

    <section class="lightbox">
    <img alt="homes-app 的瀏覽器畫面，顯示標誌、篩選文字輸入框、搜尋按鈕與訊息「housing-location works!」" src="generated/images/guide/faa/homes-app-lesson-03-step-2.png">
    </section>


## 課程回顧

在這一課中，你為應用程式建立了一個新元件，並將它加入應用程式的版面配置。

如果你在這一課遇到任何困難，可以在 <live-example></live-example> 中查看它的完成程式碼。

## 後續步驟

* [第一個 Angular 應用程式第 4 課 - 為應用程式加入房屋地點介面](tutorial/first-app/first-app-lesson-04)

@reviewed 2023-07-11
