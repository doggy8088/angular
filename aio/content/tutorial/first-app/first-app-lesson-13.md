# 第 13 課：為你的應用程式加入搜尋功能

這堂教學課程示範如何為你的 Angular 應用程式加上搜尋功能。

應用程式會讓使用者搜尋應用程式提供的資料，並且只顯示與輸入字詞相符的結果。

**預估時間**：約 15 分鐘

**起始程式碼**： <live-example name="first-app-lesson-12"></live-example>

**完成程式碼**： <live-example name="first-app-lesson-13"></live-example>

## 你將學到什麼

*  你的應用程式會使用表單的資料，搜尋相符的住房地點
*  你的應用程式只會顯示相符的住房地點

## 步驟 1：更新首頁元件的屬性
在這個步驟中，你會更新 `HomeComponent` 類別，把資料存放在一個新的陣列屬性中，用來進行篩選。

1.  1. 在 `src/app/home/home.component.ts` 中，為類別加上一個名為 `filteredLocationList` 的新屬性。

    <code-example header="Add the filtered results property" path="first-app-lesson-13/src/app/home/home.component.ts" region="add-filtered-location-list"></code-example>

`filteredLocationList` 存放與使用者輸入的搜尋條件相符的值。

1.  1. 頁面載入時，`filteredLocationList` 預設應該包含全部的住房地點值。請更新 `constructor` 的 `HomeComponent` 來設定這個值。

    <code-example header="Set the value of filteredLocationList" path="first-app-lesson-13/src/app/home/home.component.ts" region="update-constructor"></code-example>

## 步驟 2：更新首頁元件的範本
`HomeComponent` 已經有一個輸入欄位，你會用它來取得使用者的輸入。那串文字會用來篩選結果。

1.  1. 更新 `HomeComponent` 範本，在 `input` 元素中加入一個名為 `#filter` 的範本變數。

    <code-example header="Add a template variable to HomeComponent's template"  format="html" language="html">
        &lt;input type="text" placeholder="Filter by city" #filter&gt;
    </code-example>

本範例使用[範本參考變數](/guide/template-reference-variables)來取得 `input` 元素，把它當作值來存取。

1.  1. 接著，更新元件範本，為 "Search" 按鈕加上事件處理器。

    <code-example header="Bind the click event" format="html" language="html">
        &lt;button class="primary" type="button" (click)="filterResults(filter.value)"&gt;Search&lt;/button&gt;
    </code-example>

透過繫結 `click` 元素上的 `button` 事件，你就可以呼叫 `filterResults` 函式。傳給這個函式的引數，是 `value` 範本變數的 `filter` 屬性，具體來說就是 `.value` HTML 元素的 `input` 屬性。

1.  1. 範本的最後一項更新是 `ngFor` 指令。請更新 `ngFor` 的值，讓它逐一處理 `filteredLocationList` 陣列中的值。

    <code-example header="Update the ngFor directive value" format="html" language="html">
        &lt;app-housing-location *ngFor="let housingLocation of filteredLocationList" [housingLocation]="housingLocation"&gt;&lt;/app-housing-location&gt;
    </code-example>

## 步驟 3：實作事件處理器函式

範本已經更新，把 `filterResults` 函式繫結到 `click` 事件。接下來，你的任務是在 `filterResults` 類別中實作 `HomeComponent` 函式。

1.  1. 更新 `HomeComponent` 類別，加入 `filterResults` 函式的實作。
    
    <code-example header="Add the filterResults function implementation" path="first-app-lesson-13/src/app/home/home.component.ts" region="add-filter-results-fn"></code-example>

這個函式使用 `String` 的 `filter` 函式，把 `text` 參數的值與 `housingLocation.city` 屬性互相比較。你可以更新這個函式，讓它比對任何屬性、甚至多個屬性，作為一個有趣的練習。

1. 儲存你的程式碼。

1. 重新整理瀏覽器，輸入文字並點選 "Search" 按鈕後，確認你可以依城市搜尋住房地點資料。

<section class="lightbox">
<img alt="依使用者輸入篩選的搜尋結果" src="generated/images/guide/faa/homes-app-lesson-13-step-3.png">
</section>

## 課程回顧

在這一課中，你更新了應用程式，加入了以下內容：
*  使用範本變數與範本值互動
*  使用事件繫結與陣列函式加入搜尋功能

如果你在這一課遇到任何困難，可以在 <live-example></live-example> 中查看這一課的完成程式碼。

## 後續步驟

*  [第 14 課：為你的應用程式加入 HTTP 通訊](tutorial/first-app/first-app-lesson-14)

## 更多資訊

如需本課所涵蓋主題的更多資訊，請造訪：

*  [範本變數](/guide/template-reference-variables)
*  [事件處理](/guide/event-binding)

@reviewed 2023-07-11
