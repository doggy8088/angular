# HTTP：傳送資料到伺服器

除了從伺服器擷取資料之外，`HttpClient` 也支援 PUT、POST、DELETE 等其他 HTTP 方法，可用來修改遠端資料。

本指南的範例應用程式包含「Tour of Heroes」範例的精簡版，它會擷取英雄資料，並讓使用者新增、刪除與更新英雄。
以下各節示範範例應用程式 `HeroesService` 中的資料更新方法。

## 發出 POST 請求

應用程式在提交表單時，常以 POST 請求傳送資料到伺服器。
在下列範例中，`HeroesService` 在將英雄加入資料庫時會發出 HTTP POST 請求。

<code-example header="app/heroes/heroes.service.ts (addHero)" path="http/src/app/heroes/heroes.service.ts" region="addHero"></code-example>

`HttpClient.post()` 方法與 `get()` 類似，都有一個型別參數，可用來指定你預期伺服器回傳的資料型別。
這個方法接受一個資源 URL 與兩個額外參數：

| 參數    | 詳情 |
|:---     |:--- |
| body    | 要以 POST 傳送的請求主體資料。                 |
| options | 包含方法選項的物件，在此例中會指定必要的標頭。 |

這個範例會捕捉錯誤，如[上文所述](guide/http-handle-request-errors#error-details)。

`HeroesComponent` 會訂閱這個服務方法回傳的 `Observable`，藉此發起實際的 POST 操作。

<code-example header="app/heroes/heroes.component.ts (addHero)" path="http/src/app/heroes/heroes.component.ts" region="add-hero-subscribe"></code-example>

當伺服器成功回應新加入的英雄時，元件會將該英雄加入顯示中的 `heroes` 清單。

## 發出 DELETE 請求

這個應用程式使用 `HttpClient.delete` 方法，在請求 URL 中傳入英雄的 ID 來刪除英雄。

<code-example header="app/heroes/heroes.service.ts (deleteHero)" path="http/src/app/heroes/heroes.service.ts" region="deleteHero"></code-example>

`HeroesComponent` 會訂閱這個服務方法回傳的 `Observable`，藉此發起實際的 DELETE 操作。

<code-example header="app/heroes/heroes.component.ts (deleteHero)" path="http/src/app/heroes/heroes.component.ts" region="delete-hero-subscribe"></code-example>

元件不預期刪除操作會回傳結果，因此訂閱時不帶回呼函式。
即使你不會用到結果，仍然必須訂閱。
呼叫 `subscribe()` 方法會 *執行* observable，也就是發起 DELETE 請求的動作。

<div class="alert is-important">

你必須呼叫 `subscribe()`，否則什麼事都不會發生。
光是呼叫 `HeroesService.deleteHero()` 並不會發起 DELETE 請求。

</div>

<code-example path="http/src/app/heroes/heroes.component.ts" region="delete-hero-no-subscribe"></code-example>


## 發出 PUT 請求

應用程式可以使用 HTTP 用戶端服務傳送 PUT 請求。
下列 `HeroesService` 範例與 POST 範例類似，會以更新後的資料取代資源。

<code-example header="app/heroes/heroes.service.ts (updateHero)" path="http/src/app/heroes/heroes.service.ts" region="updateHero"></code-example>

如同任何會回傳 observable 的 HTTP 方法，呼叫者 `HeroesComponent.update()` [必須 `subscribe()`](guide/http-request-data-from-server#always-subscribe "Why you must always subscribe.")，才能訂閱 `HttpClient.put()` 回傳的 observable 並發起請求。

## 新增與更新標頭

許多伺服器在儲存操作時需要額外的標頭。
例如，伺服器可能需要授權權杖，或 "Content-Type" 標頭，以明確宣告請求主體的 MIME 型別。

### 新增標頭

`HeroesService` 在 `httpOptions` 物件中定義這類標頭，並將其傳給每個 `HttpClient` 儲存方法。

<code-example header="app/heroes/heroes.service.ts (httpOptions)" path="http/src/app/heroes/heroes.service.ts" region="http-options"></code-example>

### 更新標頭

你無法直接修改前述選項物件中現有的標頭，因為 `HttpHeaders` 類別的實例是不可變的。
請改用 `set()` 方法，回傳套用新變更後的目前實例複本。

下列範例示範當舊權杖過期時，如何在發出下一個請求之前更新授權標頭。

<code-example linenums="false" path="http/src/app/heroes/heroes.service.ts" region="update-headers"></code-example>

<a id="url-params"></a>

@reviewed 2023-03-16
