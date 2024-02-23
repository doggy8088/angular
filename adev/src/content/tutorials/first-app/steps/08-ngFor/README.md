# 使用 *ngFor 在元件中列出物件

以下教學課程示範如何在 Angular 範本中使用 `ngFor` 指令，以便在範本中顯示動態重複的資料。

<docs-video src="https://www.youtube.com/embed/eM3zi_n7lNs?si=MIl5NcRxvcLjYt5f&amp;start=477"/>

## 你將會學到

* 您會已將資料集加入 app
* 您的 app 將使用 `ngFor` 顯示來自新資料集的元素清單

## ngFor 的概念預覽

在 Angular 中，`ngFor` 是一種特定類型的 [指令](guide/directives)，用於動態重複範本中的資料。在純 JavaScript 中，您會使用 for 迴圈 - ngFor 為 Angular 範本提供類似的功能。

你可以使用 `ngFor` 來叠代陣列，甚至非同步值。在本課程中，你將新增一個要叠代的資料陣列。

如需更深入的說明，請參閱 [內建指令](guide/directives#ngFor) 指南。

<docs-workflow>

<docs-step title="將住房資料新增至 `HomeComponent`">

在 `HomeComponent` 中只有一個單一住房位置。在這個步驟中，您將新增一個 `HousingLocation` 條目的陣列。

1. 在 `src/app/home/home.component.ts` 中，從 `HomeComponent` 類別移除 `housingLocation` 屬性。
1. 更新 `HomeComponent` 類別，使其具有一個名為 `housingLocationList` 的屬性。更新您的程式碼以符合以下程式碼：
    <docs-code header="新增 housingLocationList 屬性" path="adev/src/content/tutorials/first-app/steps/09-services/src/app/home/home.component.ts" visibleLines="31-136"/>

    重要事項：請勿移除 `@Component` 裝飾器，您將在即將到來的步驟中更新該程式碼。

</docs-step>

<docs-step title="更新 `HomeComponent` 範本以使用 `ngFor`">
現在該應用程式有一個資料集，您可以使用 `ngFor` 指令在瀏覽器中顯示項目。

1. 將範本程式碼中的 `<app-housing-location>` 標籤更新為：
    <docs-code header="將 ngFor 新增到 HomeComponent 範本" path="adev/src/content/tutorials/first-app/steps/09-services/src/app/home/home.component.ts" visibleLines="[21,24]"/>

    請注意，在程式碼 `[housingLocation] = "housingLocation"` 中，`housingLocation` 值現在是指 `ngFor` 指令中使用的變數。在此變更之前，它是指 `HomeComponent` 類別中的屬性。

1. 儲存所有變更。

1. 重新整理瀏覽器，並確認應用程式現在會顯示住房位置網格。

    <section class="lightbox">
    <img alt="顯示標誌、篩選文字輸入方塊、搜尋按鈕和住房位置卡片網格的 homes-app 瀏覽器框架" src="https://angular.dev/assets/images/tutorials/first-app/homes-app-lesson-08-step-2.png">
    </section>

</docs-step>

</docs-workflow>

摘要：在本課程中，您使用 `ngFor` 指令在 Angular 範本中動態重複資料。您還新增了一個要使用在 Angular 應用程式中的資料陣列。該應用程式現在會在瀏覽器中動態呈現房屋位置清單。

應用程式正在成形，幹得好。

有關本課程中涵蓋的主題的更多資訊，請造訪：

<docs-pill-row>
  <docs-pill href="guide/directives/structural-directives" title="結構型指令"/>
  <docs-pill href="guide/directives#ngFor" title="ngFor 指南"/>
  <docs-pill href="api/common/NgFor" title="ngFor"/>
</docs-pill-row>
