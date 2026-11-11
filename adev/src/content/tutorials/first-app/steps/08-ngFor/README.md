# 使用 *ngFor 在元件中列出物件

本教學課程示範如何在 Angular 範本中使用 `ngFor` 指令，在範本中顯示動態重複的資料。

<docs-video src="https://www.youtube.com/embed/eM3zi_n7lNs?si=MIl5NcRxvcLjYt5f&amp;start=477"/>

## 你將學到什麼

* 你將為應用程式加入一組資料
* 你的應用程式會使用 `ngFor` 顯示新資料集中的元素清單

## ngFor 概念預覽

在 Angular 中，`ngFor` 是一種特定類型的[指令](guide/directives)，用來在範本中動態重複資料。在純 JavaScript 中你會使用 for 迴圈，而 ngFor 為 Angular 範本提供了類似的功能。

你可以利用 `ngFor` 迭代陣列，甚至是非同步值。在這一課中，你會加入一組新的資料陣列來迭代。

如需更深入的說明，請參閱[內建指令](guide/directives#ngFor)指南。

<docs-workflow>

<docs-step title="將房屋資料加入 `HomeComponent`">

`HomeComponent` 中目前只有單一房屋地點。在這個步驟中，你會加入一個 `HousingLocation` 項目陣列。

1. 在 `src/app/home/home.component.ts` 中，從 `HomeComponent` 類別移除 `housingLocation` 屬性。
1. 更新 `HomeComponent` 類別，讓它有一個名為 `housingLocationList` 的屬性。將你的程式碼更新成與下列程式碼一致：
    <docs-code header="加入 housingLocationList 屬性" path="adev/src/content/tutorials/first-app/steps/09-services/src/app/home/home.component.ts" visibleLines="31-136"/>

    IMPORTANT: 不要移除 `@Component` 裝飾器，你會在接下來的步驟中更新那段程式碼。

</docs-step>

<docs-step title="更新 `HomeComponent` 範本，改用 `ngFor`">
現在應用程式有一組資料集，你可以使用 `ngFor` 指令在瀏覽器中顯示其中的項目。

1. 將範本程式碼中的 `<app-housing-location>` 標籤更新成這樣：
    <docs-code header="在 HomeComponent 範本中加入 ngFor" path="adev/src/content/tutorials/first-app/steps/09-services/src/app/home/home.component.ts" visibleLines="[21,24]"/>

    請注意，在程式碼 `[housingLocation] = "housingLocation"` 中，`housingLocation` 值現在指的是 `ngFor` 指令中使用的變數。在這次變更之前，它指的是 `HomeComponent` 類別上的屬性。

1. 儲存所有變更。

1. 重新整理瀏覽器，確認應用程式現在會渲染出房屋地點的格狀清單。

    <section class="lightbox">
    <img alt="homes-app 的瀏覽器畫面，顯示標誌、篩選文字輸入框、搜尋按鈕與房屋地點卡片格狀清單" src="assets/images/tutorials/first-app/homes-app-lesson-08-step-2.png">
    </section>

</docs-step>

</docs-workflow>

Summary: 在這一課中，你使用 `ngFor` 指令在 Angular 範本中動態重複資料。你也為 Angular 應用程式加入了一組新的資料陣列。應用程式現在會在瀏覽器中動態渲染房屋地點清單。

應用程式逐漸成形，做得很好。

如需本課所涵蓋主題的更多資訊，請造訪：

<docs-pill-row>
  <docs-pill href="guide/directives/structural-directives" title="結構指令"/>
  <docs-pill href="guide/directives#ngFor" title="ngFor 指南"/>
  <docs-pill href="api/common/NgFor" title="ngFor"/>
</docs-pill-row>
