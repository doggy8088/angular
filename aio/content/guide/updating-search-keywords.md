# 更新搜尋關鍵字

你可以透過為主題加入關鍵字，協助讀者找到 Angular 文件中的主題。關鍵字能透過將替代詞彙與相關概念關聯到主題，協助讀者找到主題。

在 [angular.io](https://angular.io) 中，讀者會透過以下方式搜尋內容：

*   外部搜尋，例如使用 [google.com](https://google.com)
*   每個頁面頂端的搜尋框

為主題加入相關的關鍵字，可以讓上述每種方法都更有效。

## 更新主題中的搜尋關鍵字

請在瀏覽器中執行以下步驟。

1.  前往你要加入或更新搜尋關鍵字的主題。
1.  決定你要加入主題的搜尋關鍵字。<br />關鍵字應該是與主題相關，而且不會出現在主題標題中的詞彙。
1.  開啟主題的 **Edit file** 頁面，以[進行小幅變更](guide/contributors-guide-overview#對文件主題進行小幅變更)。
1.  在主題結尾加入或更新 `@searchKeywords` 標籤，填入你的關鍵字。`@searchKeywords` 標籤接受一組以空格分隔的單字關鍵字。標籤與關鍵字必須用大括號包起來。這裡顯示一個範例標籤，可為頁面加入以下關鍵字：*route*、*router*、*routing* 與 *navigation*。

    <code-example>

    &lcub;&commat;searchKeywords route router routing navigation&rcub;

    </code-example>

1.  [更新或加入 `@reviewed` 項目](guide/reviewing-content#更新上次檢閱日期)，放在主題原始碼的結尾。
1.  如[進行小幅變更](guide/contributors-guide-overview#對文件主題進行小幅變更)所述，提出你的變更。

<!-- links -->

<!-- external links -->

<!-- end links -->

@reviewed 2022-10-12
