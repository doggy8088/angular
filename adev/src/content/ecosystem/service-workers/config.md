# Service Worker 組態檔案

此主題說明服務工作者設定檔的屬性。

## 修改設定

`ngsw-config.json` JSON 組態檔案指定 Angular 服務工作者應快取哪些檔案和資料 URL，以及它應如何更新快取的檔案和資料。
[Angular CLI](tools/cli) 會在 `ng build` 期間處理此組態檔案。

所有檔案路徑必須以 `/` 開頭，它對應到部署目錄 &mdash; 在 CLI 專案中通常是 `dist/<project-name>`。

除非另有註解，否則樣式使用**限制性的***glob格式，它在內部將轉換為正規表示法：

| 全域比對格式 | 詳細資料 |
|:---          |:---     |
| `**`         | 符合 0 或更多路徑區段                                                                          |
| `*`          | 符合 0 或更多字元（不包括 `/`）                                                                |
| `?`          | 符合 1 個字元（不包括 `/`）                                                                 |
| `!` 前置詞   | 將樣式標記為反向，意即僅包含與樣式不符的檔案 |

<docs-callout important title="特殊字元需要跳脫">
請注意，某些字元在正規表示式中具有特殊含義，在內部 glob 轉換為正規表示式時未跳脫，且該模式未包含在 `^`/`$` 中。

`$` 在正規表示式中是一個特殊字元，用來匹配字串的結尾，在將 glob 模式轉換為正規表示式時，不會自動跳脫。

如果您想匹配 `$` 字元，您必須自行跳脫它 (使用 `\\$`)。例如，glob 模式 `/foo/bar/$value` 會導致無法匹配的表達式，因為不可能有字串在結束後還有任何字元。

將模式轉換為正規表示式時，它不會自動以 `^` 和 `$` 包裹。因此，這些模式會部分匹配要求的 URL。

如果要讓樣式符合網址的開頭和/或結尾，您可以自行新增 `^`/`$`。例如，glob 樣式 `/foo/bar/*.js` 會符合 `.js` 和 `.json` 檔案。如果您只想符合 `.js` 檔案，請使用 `/foo/bar/*.js$`。
</docs-callout>

範例模式：

| 模式     | 細節 |
|:---          |:---     |
| `/**/*.html` | 指定所有 HTML 檔案              |
| `/*.html`    | 僅指定根目錄中的 HTML 檔案 |
| `!/**/*.map` | 排除所有來源地圖                |

## 服務工作者組態屬性

以下各節說明組態檔案的各個屬性。

### `appData``

本部分讓您傳遞任何您想要的資料，以描述這個特定版本的應用程式。
`SwUpdate` 服務會在更新通知中包含該資料。
許多應用程式使用本部分提供額外的資訊，以顯示 UI 快顯視窗，通知使用者有可用的更新。

### `index`

指定用於滿足導覽請求的檔案作為索引頁面。
通常是 `/index.html`。

### `assetGroups`

*資產* 是應用程式版本的一部分的資源，會與應用程式一起更新。
它們可能包括從頁面來源載入的資源，以及從 CDN 和其他外部 URL 載入的第三方資源。
由於在建置時可能不知道所有此類外部 URL，因此可以比對 URL 模式。

HELPFUL: 讓服務工作者處理從不同來源載入的資源，請確保在每個來源的伺服器上正確設定 [CORS](https://developer.mozilla.org/zh-TW/docs/Web/HTTP/CORS)。

此欄位包含資產群組陣列，每個資產群組定義一組資產資源和快取其資源的政策。

<docs-code language="json">

{
  "assetGroups": [
    {
      &hellip;
    },
    {
      &hellip;
    }
  ]
}

</docs-code>

HELPFUL：當 ServiceWorker 處理請求時，它會按照它們在 `ngsw-config.json` 中出現的順序來檢查資產群組。
第一個與請求的資源相符的資產群組將會處理請求。

建議您將較具體的資產群組放在清單中較高的位置。
例如，與 `/foo.js` 相符的資產群組應出現在與 `*.js` 相符的資產群組之前。

每個資產群組都指定資源群組和管理該群組的政策。
此政策決定何時擷取資源以及在偵測到變更時會發生什麼情況。

資產群組遵循這裡顯示的 Typescript 介面：

<docs-code language="typescript">

interface AssetGroup {
  name: string;
  installMode?: 'prefetch' | 'lazy';
  updateMode?: 'prefetch' | 'lazy';
  resources: {
    files?: string[];
    urls?: string[];
  };
  cacheQueryOptions?: {
    ignoreSearch?: boolean;
  };
}

</docs-code>

每個 `AssetGroup` 由以下資產群組屬性定義。

#### `name`

`name` 是強制性的。
它識別配置版本之間的這特定資產群組。

#### `installMode`

`installMode` 決定這些資源如何最初快取。
`installMode` 可以是兩個值之一：

| 值     | 詳細資訊 |
|:---        |:---     |
| `prefetch` | 告訴 Angular 服務工作者在快取目前的應用程式版本時擷取每個已列出的資源。這會消耗大量頻寬，但可確保在需要時資源會隨時可用，即使瀏覽器目前處於離線狀態。                                                                                                                      |
| `lazy`     | 沒有預先快取任何資源。相反地，Angular 服務工作者僅快取它收到請求的資源。這是一種依需求快取模式。從未請求的資源不會快取。這對於不同解析度的圖片很有用，因此服務工作者僅快取特定螢幕和方向的正確資產。 |

預設為 `prefetch`。

#### `updateMode`

對於快取中既有的資源，當發現應用程式的最新版本時，`updateMode` 會決定快取行為。
群組中自上一個版本變更的所有資源會根據 `updateMode` 更新。

| 值     | 詳細資料 |
|:---        |:---     |
| `prefetch` | 告訴服務工作者立即下載並快取變更的資源。                                                                                                                                                        |
| `lazy`     | 告訴服務工作者不要快取那些資源。相反地，它將它們視為未請求的資源，並等到再次請求它們時才更新它們。只有在 `installMode` 也為 `lazy` 時，`lazy` 的 `updateMode` 才有效。 |

預設值為 `installMode` 設定的值。

#### `resources`

此部分說明要快取的資源，分為以下群組：

| 資源群組 | 詳細資料 |
|:---             |:---     |
| `files`         | 列出與 distribution 目錄中的檔案相符的模式。這些可以是單一檔案或與多個檔案相符的 glob 類似模式。                                                                                                                                                                                                                                                                   |
| `urls`          | 包含在執行階段配對的 URL 和 URL 模式。這些資源不會直接擷取，也沒有內容雜湊，但會根據其 HTTP 標頭進行快取。這最適合 CDN，例如 Google Fonts 服務。<br />  *(不支援負面 glob 模式，而 `?` 會以字面意思配對；亦即，它不會與 `?` 以外的任何字元配對。)* |

#### `cacheQueryOptions`

這些選項用於修改要求的配對行為。
它們傳遞給瀏覽器的 `Cache#match` 函數。
有關詳細資訊，請參閱 [MDN](https://developer.mozilla.org/docs/Web/API/Cache/match)。
目前，僅支援以下選項：

| 選項        | 詳細 |
|:---            |:---     |
| `ignoreSearch` | 忽略查詢參數。預設為 `false`。 |

### `dataGroups`

與資產資源不同，資料請求不會與應用程式一起建立版本。
它們會根據手動配置的政策進行快取，這些政策對於 API 請求和其他資料相依關係等情況更有用。

此欄位包含資料群組陣列，每個陣列定義一組資料資源及其快取政策。

<docs-code language="json">

{
  "dataGroups": [
    {
      &hellip;
    },
    {
      &hellip;
    }
  ]
}

</docs-code>

HELPFUL: 當 ServiceWorker 處理請求時，它會按照其在 `ngsw-config.json` 中出現的順序檢查資料群組。
第一個與所請求資源相符的資料群組會處理該請求。

建議您將較具體的資料群組放在清單中較高的位置。
例如，符合 `/api/foo.json` 的資料群組應該出現在符合 `/api/*.json` 的資料群組之前。

Data 群組遵循此 Typescript 介面：

<docs-code language="typescript">

export interface DataGroup {
  name: string;
  urls: string[];
  version?: number;
  cacheConfig: {
    maxSize: number;
    maxAge: string;
    timeout?: string;
    strategy?: 'freshness' &verbar; 'performance';
  };
  cacheQueryOptions?: {
    ignoreSearch?: boolean;
  };
}

</docs-code>

每個 `DataGroup` 由下列資料群組屬性定義。

#### `name`

與 `assetGroups` 相似，每個數據群組都有唯一識別它的 `name`。

#### `urls`

URL 模式清單。
與這些模式相符的 URL 依照此資料群組的政策進行快取。
僅快取非變更請求 (GET 和 HEAD)。

* 否定 glob 模式不受支援
* `?` 會以字面意義進行比對；亦即，它只能比對字元 `?`

#### `version`

偶爾 API 會以非向後兼容的方式變更格式。
新版本的應用程式可能與舊的 API 格式不兼容，因此可能與該 API 的現有快取資源不兼容。

`version` 提供一個機制，用來指示快取中的資源已以向後不相容的方式更新，並且舊的快取項目（來自先前版本的項目）應予以捨棄。

`version` 是整數欄位，預設為 `1`。

#### `cacheConfig`

以下屬性定義快取符合要求的政策。

##### `maxSize`

快取中條目的最大數目或回應。

CRITICAL：開放式快取可能會以不受限的方式增長，最終超過儲存配額，導致驅逐。

##### `maxAge`

`maxAge` 參數表示允許回應在快取中保留多久，然後才視為無效並予以移除。`maxAge` 是持續時間字串，使用下列單位字尾：

| 字尾 | 詳細 |
|:---      |:---     |
| `d`      | 天         |
| `h`      | 小時        |
| `m`      | 分鐘      |
| `s`      | 秒      |
| `u`      | 毫秒 |

例如，字串 `3d12h` 將內容快取最長三天半。

##### `timeout`

此持續時間字串指定網路逾時。
網路逾時是指 Angular 服務工作者在使用快取回應之前等待網路回應的時間，如果已將其設定為執行此操作。
`timeout` 是持續時間字串，使用下列單位字尾：

| 字尾 | 詳細 |
|:---      |:---     |
| `d`      | 天         |
| `h`      | 小時        |
| `m`      | 分鐘      |
| `s`      | 秒      |
| `u`      | 毫秒 |

例如，字串 `5s30u` 轉換為五秒和 30 毫秒的網路逾時。

##### `strategy`

Angular 服務工作者可以使用兩種快取策略之一來處理資料資源。

| 快取策略 | 詳細資料 |
|:---                |:---     |
| `performance`      | 預設值，針對以最快的速度提供回應進行最佳化。如果快取中存在資源，則使用快取版本，且不會提出網路要求。這會造成一些陳舊資料，視 `maxAge` 而定，以換取更好的效能。這適合不常變更的資源，例如使用者頭像圖片。 |
| `freshness`        | 針對資料貨幣進行最佳化，優先從網路擷取要求的資料。僅當網路逾時（根據 `timeout`）時，要求才會退回至快取。這對於經常變更的資源很有用，例如帳戶餘額。                                                                               |

HELPFUL: 您也可以模擬第三種策略 [staleWhileRevalidate](https://developers.google.com/web/fundamentals/instant-and-offline/offline-cookbook/#stale-while-revalidate)，如果快取資料可用，則會傳回快取資料，但也會在背景中從網路擷取最新資料以供下次使用。
要使用此策略，請將 `strategy` 設為 `freshness`，並將 `timeout` 設為 `cacheConfig` 中的 `0u`。

這基本上會執行以下操作：

1. 首先嘗試從網路取回。
2. 如果網路要求沒有立即完成，即在 0 毫秒的逾時後，忽視快取年齡並回到快取值。
3. 網路要求完成後，更新快取以供將來要求使用。
4. 如果資源不在快取中，無論如何都要等待網路要求。

##### `cacheOpaqueResponses`

Angular 服務工作者是否應快取不透明的回應。

如果未指定，預設值取決於資料群組的已配置策略：

| 策略                                   | 詳細資料 |
|:---                                    |:---     |
| 具有 `freshness` 策略的群組            | 預設值為 `true`，服務工作者快取不透明回應。這些群組將每次請求資料，並且僅在離線或網路速度慢時回退到快取回應。因此，服務工作者快取錯誤回應並不重要。 |
| 具有 `performance` 策略的群組          | 預設值為 `false`，服務工作者不快取不透明回應。這些群組會繼續傳回快取回應，直到 `maxAge` 過期，即使錯誤是因暫時網路或伺服器問題所致。因此，服務工作者快取錯誤回應會造成問題。 |

<docs-callout title="評論不透明回應">

如果您不熟悉，[不透明回應][https://fetch.spec.whatwg.org#concept-filtered-response-opaque] 是在要求位於不同來源且不回傳 CORS 標頭的資源時回傳的特殊回應類型。
不透明回應的其中一個特徵是服務工作者不被允許讀取其狀態，這意味著它無法檢查要求是否成功。
有關更多詳細資訊，請參閱[fetch 介紹][https://developers.google.com/web/updates/2015/03/introduction-to-fetch#response_types]。

如果無法實施 CORS &mdash; 例如，如果您無法控制來源 &mdash; 最好對導致不透明回應的資源使用 `freshness` 策略。

</docs-callout>

#### `cacheQueryOptions`

有關詳細資訊，請參閱 [assetGroups](#assetgroups)。

### `navigationUrls`

此選用區段讓您可以指定將重新導向至索引檔案的網址清單。

#### 處理導航請求

ServiceWorker 將與任何 `asset` 或 `data` 群組不匹配的導覽請求重新導向到指定的 [index file](#index)。
如果請求符合下列條件，則視為導覽請求：

* 它的 [方法](https://developer.mozilla.org/docs/Web/API/Request/method) 是 `GET`
* 它的 [模式](https://developer.mozilla.org/docs/Web/API/Request/mode) 是 `navigation`
* 它接受 `text/html` 回應，由 `Accept` 標頭的值決定
* 它的 URL 符合下列條件：
  * URL 最後路徑區段不可包含檔案副檔名（即 `.`）
  * URL 不可包含 `__`

HELPFUL: 若要設定是否透過網路傳送導覽要求，請參閱 [navigationRequestStrategy](#navigationrequeststrategy) 區段。

#### 匹配導航請求網址

儘管這些預設準則在大部分情況下都很好用，但有時還是希望設定不同的規則。
例如，您可能想忽略特定路由，例如那些不屬於 Angular 應用程式的一部分，並將它們傳遞到伺服器。

此欄位包含在執行期間比對的網址和 [glob-like](#modifying-the-configuration) 網址模式陣列。
它可以包含否定模式（即以 `!` 開頭的模式）和非否定模式和網址。

只有 URL 與 *任何* 非負面 URL/模式相符，且 *沒有任何* 負面 URL/模式相符的要求，才會被視為導航要求。
在進行比對時，會忽略 URL 查詢。

如果省略欄位，它預設為：

<docs-code language="typescript">

[
  '/**',           // Include all URLs.
  '!/**/*.*',      // Exclude URLs to files.
  '!/**/****',     // Exclude URLs containing `**` in the last segment.
  '!/**/****/**',  // Exclude URLs containing `**` in any other segment.
]

</docs-code>

### `navigationRequestStrategy

此選擇性屬性讓您可以設定服務工作者如何處理導覽要求：

<docs-code language="json">

{
  "navigationRequestStrategy": "freshness"
}

</docs-code>

| 可能值 | 詳細資訊 |
|:---             |:---     |
| `'performance'` | 預設設定。提供指定的 [索引檔案](#索引檔案)，通常會快取。 |
| `'freshness'`   | 將要求傳遞到網路，並在離線時改回 `performance` 行為。當伺服器使用 `3xx` HTTP 重新導向狀態碼將導覽要求重新導向到其他地方時，此值很有用。使用此值的原因包括：<ul> <li>在應用程式不處理驗證時重新導向到驗證網站 </li> <li>重新導向特定 URL，以避免在網站重新設計後中斷現有連結/書籤 </li> <li>在頁面暫時停用時重新導向到其他網站，例如伺服器狀態頁面 </li> </ul> |

重要：`freshness` 策略通常會導致向伺服器發出更多請求，這可能會增加回應延遲。建議您盡可能使用預設效能策略。

