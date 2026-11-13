# 更新搜尋關鍵字

在文件中，能找到你需要的內容，與內容本身同等重要。在 [angular.io](https://angular.io/)，使用者可以透過幾種方式探索內容，包括：

* 自然搜尋結果，例如透過 [google.com](https://google.com/)
* 左側導覽列，也稱為 sidenav
* 使用標頭中的搜尋框

你可以為特定主題加入搜尋關鍵字，協助改善文件的使用體驗。更新搜尋關鍵字可以幫助使用者更快找到他們需要的內容。

## 開始之前

即使你從未為 Angular 貢獻過，也可以為主題更新搜尋關鍵字。不過，如果這是你第一次在這個儲存庫提交 pull request，手邊備有 [Contributing to Angular](https://github.com/angular/angular/blob/master/CONTRIBUTING.md) 指南會很有幫助。

## 更新搜尋關鍵字

若要更新搜尋關鍵字：

1. 導覽到你想要更新搜尋關鍵字的主題。

1. 決定你想為該主題加入哪些搜尋關鍵字。關鍵字的格式資訊，請參閱[搜尋關鍵字格式](#format)。

1. 透過 [GitHub 使用者介面](guide/updating-content-github-ui)或 Angular 的[標準 pull request 流程](https://github.com/angular/angular/blob/master/CONTRIBUTING.md#submit-pr)，更新 `@searchKeywords` 標籤。

  如果某個主題沒有 `@searchKeywords` 標籤，你可以把它加到主題的結尾。

{@a format}
## 搜尋關鍵字格式

你可以使用 `@searchKeywords` 標籤為主題加入搜尋關鍵字。這個標籤接受一組以空格分隔的單字。標籤與關鍵字必須用大括號（`{...}`）包起來。例如：

<code-example>
  &#123;@searchKeywords route router routing navigation&#125;
</code-example>
