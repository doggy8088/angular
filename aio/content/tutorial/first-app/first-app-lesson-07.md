# 第 7 課：為元件的範本加入插值

本教學課程示範如何為 Angular 範本加入插值（interpolation），在範本中顯示動態資料。

**預估時間**：約 10 分鐘

**起始程式碼**： <live-example name="first-app-lesson-06"></live-example>

**完成程式碼**： <live-example name="first-app-lesson-07"></live-example>

## 你將學到什麼

*  你的應用程式會在 `HousingLocationComponent` 範本中顯示插值後的值。
*  你的應用程式會將房屋地點資料渲染到瀏覽器。

## 插值概念預覽
在這個步驟中，你會使用插值，在範本中顯示值（屬性與 `Input` 值）。

在 Angular 範本中使用 `{{ expression }}`，你就能渲染來自屬性、`Inputs` 與有效 JavaScript 運算式的值。

如需更深入的說明，請參閱[以插值顯示值](guide/interpolation)指南。

## 步驟 1：更新 `HousingLocationComponent` 範本，加入插值
這個步驟會在 `HousingLocationComponent` 範本中加入新的 HTML 結構與插值。

在程式碼編輯器中：
1.  前往 `src/app/housing-location/housing-location.component.ts`
1.  在 `@Component` 裝飾器的 template 屬性中，把現有的 HTML 標記替換成以下程式碼：

    <code-example header="Update HousingLocationComponent template" path="first-app-lesson-07/src/app/housing-location/housing-location.component.ts" region="add-listing-details"></code-example>

在這段更新後的範本程式碼中，你使用屬性繫結將 `housingLocation.photo` 繫結到 `src` 屬性。`alt` 屬性則使用插值，為圖片的替代文字提供更多上下文。

你使用插值來帶入 `name` 屬性的 `city`、`state` 與 `housingLocation` 值。

## 步驟 2：確認變更會在瀏覽器中渲染
1.  儲存所有變更。
1.  開啟瀏覽器，確認應用程式會渲染照片、城市與州的範例資料。
    <section class="lightbox">
    <img alt="homes-app 的瀏覽器畫面，顯示標誌、篩選文字輸入框、搜尋按鈕與相同的房屋位置 UI 卡片" src="generated/images/guide/faa/homes-app-lesson-07-step-2.png">
    </section>

## 課程回顧
在這一課中，你加入了新的 HTML 結構，並使用 Angular 範本語法在 `HousingLocation` 範本中渲染值。現在，你擁有了兩項重要的技能：
* 將資料傳給元件
* 將值以插值方式帶入範本

有了這些技能，你的應用程式現在就能分享資料，並在瀏覽器中顯示動態值。到目前為止做得很好。

如果你在這一課遇到任何困難，可以在 <live-example></live-example> 中查看這一課的完成程式碼。

## 後續步驟

* [第 8 課：使用 *ngFor 在元件中列出物件](tutorial/first-app/first-app-lesson-08)

## 如需本課所涵蓋主題的更多資訊，請造訪：
* [使用插值顯示值](/guide/interpolation)
* [範本語法](guide/template-syntax)

@reviewed 2023-07-11
