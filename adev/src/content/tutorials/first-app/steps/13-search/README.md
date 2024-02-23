# 在 app 中加入搜尋功能

本教學課程示範如何將搜尋功能新增至您的 Angular 應用程式。

該應用程式將使用戶能夠搜索應用程式提供之數據，並僅顯示與輸入的詞彙相符的結果。

<docs-video src="https://www.youtube.com/embed/5K10oYJ5Y-E?si=TiuNKx_teR9baO7k&amp;start=457"/>

重要提示：我們建議您將此步驟的教學課程用於您的本地環境。

## 你將會學到

* 您的應用程式將使用表單中的資料搜尋匹配的房屋位置
* 您的應用程式將只顯示匹配的房屋位置

<docs-workflow>

<docs-step title="更新首頁元件屬性">
在這個步驟中，您將更新 `HomeComponent` 類別，以將資料儲存在新的陣列屬性中，您將使用此屬性進行篩選。

1. 在 `src/app/home/home.component.ts` 中，新增一個名為 `filteredLocationList` 的類別新屬性。

    <docs-code header="新增篩選結果屬性" path="adev/src/content/tutorials/first-app/steps/14-http/src/app/home/home.component.ts" visibleLines="[30,33]"/>

    `filteredLocationList` 包含使用者輸入的搜尋條件所符合的值。

1. 預設情況下，當頁面載入時，`filteredLocationList` 應包含所有住房地點值。更新 `HomeComponent` 的 `constructor` 以設定值。

    <docs-code header="設定 filteredLocationList 的值" path="adev/src/content/tutorials/first-app/steps/14-http/src/app/home/home.component.ts" visibleLines="[35,39]"/>

</docs-step>

<docs-step title="更新首頁元件範本">
`HomeComponent` 已經包含一個輸入欄位，您將使用它來擷取使用者的輸入。該字串文字將用於篩選結果。

1. 更新 `HomeComponent` 範本，以便在 `input` 元素中包含名為 `#filter` 的範本變數。

    <docs-code header="將範本變數新增至 HomeComponent 的範本" language="html">
        &lt;input type="text" placeholder="依城市篩選" #filter&gt;
    </docs-code>

    此範例使用 [範本參考變數](/guide/templates) 來取得 `input` 元素及其值。

1. 接下來，更新元件範本，以便將事件處理常式附加至「搜尋」按鈕。

    <docs-code header="繫結 click 事件" language="html">
        &lt;button class="primary" type="button" (click)="filterResults(filter.value)"&gt;搜尋&lt;/button&gt;
    </docs-code>

    透過繫結至 `button` 元素上的 `click` 事件，您可以呼叫 `filterResults` 函式。函數的引數是 `filter` 範本變數的 `value` 屬性。特別是 `input` HTML 元素的 `.value` 屬性。

1. 最後一個範本更新是針對 `ngFor` 指令。更新 `ngFor` 值以遍歷 `filteredLocationList` 陣列中的值。

    <docs-code header="更新 ngFor 指令值" language="html">
        &lt;app-housing-location *ngFor="let housingLocation of filteredLocationList" [housingLocation]="housingLocation"&gt;&lt;/app-housing-location&gt;
    </docs-code>

</docs-step>

<docs-step title="實作事件處理函數">
範本已更新，以將 `filterResults` 函數繫結至 `click` 事件。接下來，您的任務是實作 `HomeComponent` 類別中的 `filterResults` 函數。

1. 更新 `HomeComponent` 類別以包含 `filterResults` 函數的實作。

    <docs-code header="新增 filterResults 函數實作" path="adev/src/content/tutorials/first-app/steps/14-http/src/app/home/home.component.ts" visibleLines="[41,45]"/>

    此函數使用 `String` `filter` 函數來比較 `text` 參數的值與 `housingLocation.city` 屬性。您可以更新此函數以比對任何屬性或多個屬性以進行有趣的練習。

1. 儲存您的程式碼。

1. 重新整理瀏覽器並確認當您在輸入文字後按一下「搜尋」按鈕時，您可以依城市搜尋房屋位置資料。

<img alt="根據使用者輸入過濾的搜尋結果" src="assets/content/images/tutorials/first-app/homes-app-lesson-13-step-3.png">
</docs-step>

</docs-workflow>

摘要：在本課程中，您已更新應用程式以使用範本變數與範本值互動，並使用事件繫結和陣列函式新增搜尋功能。

有關本課程中涵蓋的主題的更多資訊，請造訪：

<docs-pill-row>
  <docs-pill href="guide/templates" title="模板變數"/>
  <docs-pill href="guide/templates/event-binding" title="事件處理"/>
</docs-pill-row>

