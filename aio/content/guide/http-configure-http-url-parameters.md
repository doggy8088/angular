# HTTP - 設定 URL 參數

使用 `HttpParams` 類別搭配 `params` 請求選項，在 `HttpRequest` 中加入 URL 查詢字串。

## 使用搜尋方法建立 URL 參數

以下範例中，`searchHeroes()` 方法會查詢名稱包含搜尋字詞的英雄。

首先匯入 `HttpParams` 類別。

<code-example hideCopy language="typescript">

import {HttpParams} from "&commat;angular/common/http";

</code-example>

<code-example linenums="false" path="http/src/app/heroes/heroes.service.ts" region="searchHeroes"></code-example>

如果有搜尋字詞，程式碼會建構一個選項物件，其中包含經過 HTML URL 編碼的搜尋參數。例如，若字詞是 "cat"，GET 請求的 URL 就會是 `api/heroes?name=cat`。

`HttpParams` 物件是不可變的。如果你需要更新選項，請儲存 `.set()` 方法的回傳值。

## 從查詢建立 URL 參數

你也可以使用 `fromString` 變數，直接從查詢字串建立 HTTP 參數：

<code-example hideCopy language="typescript">

const params = new HttpParams({fromString: 'name=foo'});

</code-example>

<a id="intercepting-requests-and-responses"></a>

@reviewed 2022-11-08
