# 為你的應用程式加上搜尋功能

這堂教學課程示範如何為你的 Angular 應用程式加上搜尋功能。

應用程式會讓使用者搜尋應用程式提供的資料，並且只顯示與輸入字詞相符的結果。

<docs-video src="https://www.youtube.com/embed/5K10oYJ5Y-E?si=TiuNKx_teR9baO7k&amp;start=457"/>

IMPORTANT: 本教學的這個步驟，建議你在本機環境操作。

## 你會學到什麼

* 你的應用程式會使用表單的資料，搜尋相符的住房地點
* 你的應用程式只會顯示相符的住房地點

<docs-workflow>

<docs-step title="更新首頁元件的屬性">
在這個步驟中，你會更新 `HomeComponent` 類別，把資料存放在一個新的陣列屬性中，用來進行篩選。

1. 在 `src/app/home/home.component.ts` 中，為類別加上一個名為 `filteredLocationList` 的新屬性。

    <docs-code header="加入篩選結果屬性" path="adev/src/content/tutorials/first-app/steps/14-http/src/app/home/home.component.ts" visibleLines="[30,33]"/>

    `filteredLocationList` 存放與使用者輸入的搜尋條件相符的值。

1. 頁面載入時，`filteredLocationList` 預設應該包含全部的住房地點值。請更新 `HomeComponent` 的 `constructor` 來設定這個值。

    <docs-code header="設定 filteredLocationList 的值" path="adev/src/content/tutorials/first-app/steps/14-http/src/app/home/home.component.ts" visibleLines="[35,39]"/>

</docs-step>

<docs-step title="更新首頁元件的範本">
`HomeComponent` 已經有一個輸入欄位，你會用它來取得使用者的輸入。那串文字會用來篩選結果。

1. 更新 `HomeComponent` 範本，在 `input` 元素中加入一個名為 `#filter` 的範本變數。

    <docs-code header="在 HomeComponent 的範本中加入範本變數" language="html">
        <input type="text" placeholder="Filter by city" #filter>
    </docs-code>

    本範例使用[範本參考變數](/guide/templates)來取得 `input` 元素，把它當作值來存取。

1. 接著，更新元件範本，為 "Search" 按鈕加上事件處理器。

    <docs-code header="繫結 click 事件" language="html">
        <button class="primary" type="button" (click)="filterResults(filter.value)">Search</button>
    </docs-code>

    透過繫結 `button` 元素上的 `click` 事件，你就可以呼叫 `filterResults` 函式。傳給這個函式的引數，是 `filter` 範本變數的 `value` 屬性，具體來說就是 `input` HTML 元素的 `.value` 屬性。

1. 範本的最後一項更新是 `ngFor` 指令。請更新 `ngFor` 的值，讓它逐一處理 `filteredLocationList` 陣列中的值。

    <docs-code header="更新 ngFor 指令的值" language="html">
        <app-housing-location *ngFor="let housingLocation of filteredLocationList" [housingLocation]="housingLocation"></app-housing-location>
    </docs-code>

</docs-step>

<docs-step title="實作事件處理器函式">
範本已經更新，把 `filterResults` 函式繫結到 `click` 事件。接下來，你的任務是在 `HomeComponent` 類別中實作 `filterResults` 函式。

1. 更新 `HomeComponent` 類別，加入 `filterResults` 函式的實作。

    <docs-code header="加入 filterResults 函式的實作" path="adev/src/content/tutorials/first-app/steps/14-http/src/app/home/home.component.ts" visibleLines="[41,45]"/>

    這個函式使用 `String` 的 `filter` 函式，把 `text` 參數的值與 `housingLocation.city` 屬性互相比較。你可以更新這個函式，讓它比對任何屬性、甚至多個屬性，作為一個有趣的練習。

1. 儲存你的程式碼。

1. 重新整理瀏覽器，輸入文字並點選 "Search" 按鈕後，確認你可以依城市搜尋住房地點資料。

<img alt="依使用者輸入篩選後的搜尋結果" src="assets/images/tutorials/first-app/homes-app-lesson-13-step-3.png">
</docs-step>

</docs-workflow>

Summary: 在本課中，你更新了應用程式，使用範本變數與範本值互動，並運用事件繫結與陣列函式加上搜尋功能。

想進一步了解本課介紹的主題，請造訪：

<docs-pill-row>
  <docs-pill href="guide/templates" title="範本變數"/>
  <docs-pill href="guide/templates/event-binding" title="事件處理"/>
</docs-pill-row>
