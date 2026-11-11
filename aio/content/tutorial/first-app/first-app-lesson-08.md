# 使用 *ngFor 列出元件中的物件
本教學課程示範如何在 Angular 範本中使用 `ngFor` 指令，動態重複顯示範本中的資料。

**預計時間**：約 10 分鐘

**起始程式碼：** <live-example name="first-app-lesson-07"></live-example>

**完成程式碼：** <live-example name="first-app-lesson-08"></live-example>

## 你將學到什麼
* 你將為應用程式加入一組資料
* 你的應用程式會使用 `ngFor` 顯示新資料集中的元素清單

## ngFor 概念預覽
在 Angular 中，`ngFor` 是一種特定類型的[指令](guide/built-in-directives)，用來在範本中動態重複資料。在純 JavaScript 中你會使用 for 迴圈，而 ngFor 為 Angular 範本提供了類似的功能。

你可以利用 `ngFor` 迭代陣列，甚至是非同步值。在這一課中，你會加入一組新的資料陣列來迭代。

如需更深入的說明，請參閱[內建指令](guide/built-in-directives#ngFor)指南。

## 步驟 1 - 將房屋資料加入 `HomeComponent`

`HomeComponent` 中目前只有單一房屋地點。在這個步驟中，你會加入一個 `HousingLocation` 項目陣列。

1. 在 `src/app/home/home.component.ts` 中，從 `HomeComponent` 類別移除 `housingLocation` 屬性。
1. 更新 `HomeComponent` 類別，讓它有一個名為 `housingLocationList` 的屬性。將你的程式碼更新成與下列程式碼一致：
    <code-example header="Add housingLocationList property" path="first-app-lesson-08/src/app/home/home.component.ts" region="housing-list-entries"></code-example>

    <div class="callout is-important">
      請勿移除 `@Component` 裝飾器，你會在接下來的步驟中更新那段程式碼。
    </div>

## 步驟 2 - 更新 `HomeComponent` 範本，改用 `ngFor`
現在應用程式有一組資料集，你可以使用 `ngFor` 指令在瀏覽器中顯示其中的項目。

1. 將範本程式碼中的 `<app-housing-location>` 標籤更新成這樣：
    <code-example header="Add ngFor to HomeComponent template" path="first-app-lesson-08/src/app/home/home.component.ts" region="add-ngFor"></code-example>

    請注意，在程式碼 `[housingLocation] = "housingLocation"` 中，`housingLocation` 值現在指的是 `ngFor` 指令中使用的變數。在這次變更之前，它指的是 `HomeComponent` 類別上的屬性。

1. 儲存所有變更。

1. 重新整理瀏覽器，確認應用程式現在會渲染出房屋地點的格狀清單。

    <section class="lightbox">
    <img alt="homes-app 的瀏覽器畫面，顯示標誌、篩選文字輸入框、搜尋按鈕與房屋位置卡片網格" src="generated/images/guide/faa/homes-app-lesson-08-step-2.png">
    </section>

## 課程回顧
在這一課中，你使用 `ngFor` 指令在 Angular 範本中動態重複資料。你也加入了一組新的資料陣列，供 Angular 應用程式使用。應用程式現在會在瀏覽器中動態渲染房屋地點清單。

應用程式逐漸成形，做得很好。

如果你在這一課遇到任何困難，可以在 <live-example></live-example> 中查看它的完成程式碼。

## 後續步驟

* [第 9 課 - 為應用程式加入服務](tutorial/first-app/first-app-lesson-09)

## 關於本課所涵蓋主題的更多資訊，請造訪：
* [結構型指令](/guide/structural-directives)
* [ngFor 指南](/guide/built-in-directives#ngFor)
* [ngFor](/api/common/NgFor)

@reviewed 2023-07-11
