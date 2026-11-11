# 使用 @for 在元件中列出物件

本教學課程示範如何在 Angular 範本中使用 `@for` 區塊，在範本中顯示動態重複的資料。

<docs-video src="https://www.youtube.com/embed/eM3zi_n7lNs?si=MIl5NcRxvcLjYt5f&amp;start=477"/>

NOTE: 這部影片反映的是較舊的語法，但主要概念仍然適用。

## 你將學到什麼

- 你將為應用程式加入一組資料
- 你的應用程式會使用 `@for` 顯示新資料集中的元素清單

## `@for` 概念預覽

在 Angular 中，`@for` 是一種特定類型的[控制流程區塊](/guide/templates/control-flow)，用來在範本中動態重複資料。在純 JavaScript 中你會使用 for 迴圈，而 `@for` 為 Angular 範本提供了類似的功能。

你可以利用 `@for` 迭代陣列，甚至是非同步值。在這一課中，你會加入一組新的資料陣列來迭代。

如需更深入的說明，請參閱[控制流程](guide/templates/control-flow#repeat-content-with-the-for-block)指南。

<docs-workflow>

<docs-step title="將房屋資料加入 `Home`">

`Home` 中目前只有單一房屋地點。在這個步驟中，你會加入一個 `HousingLocation` 項目陣列。

1. 在 `src/app/home/home.ts` 中，從 `Home` 類別移除 `housingLocation` 屬性。
1. 更新 `Home` 類別，讓它有一個名為 `housingLocationList` 的屬性。將你的程式碼更新成與下列程式碼一致：
   <docs-code language="angular-ts"  header="在 home.ts 中加入 housingLocationList 屬性" path="adev/src/content/tutorials/first-app/steps/09-services/src/app/home/home.ts" visibleLines="26-131"/>

   IMPORTANT: 不要移除 `@Component` 裝飾器，你會在接下來的步驟中更新那段程式碼。

</docs-step>

<docs-step title="更新 `Home` 範本，改用 `@for`">
現在應用程式有一組資料集，你可以使用 `@for` 區塊在瀏覽器中顯示其中的項目。

1. 將範本程式碼中的 `<app-housing-location>` 標籤更新成這樣：
   <docs-code language="angular-ts"  header="在 home.ts 的 Home 範本中加入 @for" path="adev/src/content/tutorials/first-app/steps/09-services/src/app/home/home.ts" visibleLines="[15,19]"/>

   請注意，在程式碼 `[housingLocation] = "housingLocation"` 中，`housingLocation` 值現在指的是 `@for` 區塊中使用的變數。在這次變更之前，它指的是 `Home` 類別上的屬性。

1. 儲存所有變更。

1. 重新整理瀏覽器，確認應用程式現在會渲染出房屋地點的格狀清單。

<section class="lightbox">
<img alt="homes-app 的瀏覽器畫面，顯示標誌、篩選文字輸入框、搜尋按鈕與房屋地點卡片格狀清單" src="assets/images/tutorials/first-app/homes-app-lesson-08-step-2.png">
</section>

</docs-step>

</docs-workflow>

SUMMARY: 在這一課中，你使用 `@for` 區塊在 Angular 範本中動態重複資料。你也為 Angular 應用程式加入了一組新的資料陣列。應用程式現在會在瀏覽器中動態渲染房屋地點清單。

應用程式逐漸成形，做得很好。

如需本課所涵蓋主題的更多資訊，請造訪：

<docs-pill-row>
  <docs-pill href="guide/templates/control-flow" title="控制流程區塊"/>
  <docs-pill href="guide/templates/control-flow#repeat-content-with-the-for-block" title="@for 指南"/>
  <docs-pill href="/api/core/@for" title="@for"/>
</docs-pill-row>
