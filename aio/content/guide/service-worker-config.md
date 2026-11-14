# Service Worker 設定檔

#### 必要條件

對下列內容有基本的了解：
* [Service Worker 運維](guide/service-worker-devops)。

<hr />

`src/ngsw-config.json` 設定檔會指定 Angular service worker 應該快取哪些檔案與資料 URL，以及它應該如何更新已快取的檔案與資料。CLI 會在 `ng build --prod` 期間處理設定檔。手動處理時，你可以使用 `ngsw-config` 工具：

```sh
ngsw-config dist src/ngsw-config.json /base/href
```

設定檔使用 JSON 格式。所有檔案路徑都必須以 `/` 開頭，該路徑就是部署目錄&mdash;在 CLI 專案中通常是 `dist`。

{@a glob-patterns}
除非另有註明，否則模式使用一種有限的 glob 格式：

* `**` 符合 0 個或多個路徑區段。
* `*` 符合 0 個或多個字元（不含 `/`）。
* `?` 恰好符合一個字元（不含 `/`）。
* `!` 前綴把模式標示為否定，意思是只包含不符合該模式的檔案。

模式範例：

* `/**/*.html` 指定所有 HTML 檔案。
* `/*.html` 只指定根目錄中的 HTML 檔案。
* `!/**/*.map` 排除所有 sourcemap。

設定檔的每一節說明如下。

## `appData`

這一節讓你可以傳入任何想傳的資料，用來描述應用程式的這個特定版本。`SwUpdate` 服務會把該資料包含在更新通知中。許多應用程式使用這一節提供額外資訊，用來顯示 UI 彈出視窗，通知使用者有可用更新。

{@a index-file}
## `index`

指定作為索引頁面來滿足導覽請求的檔案。通常是 `/index.html`。

## `assetGroups`

*資產*是應用程式版本的一部分、會隨應用程式一起更新的資源。它們可以包括從頁面來源載入的資源，以及從 CDN 與其他外部 URL 載入的第三方資源。由於並非所有這類外部 URL 在建置時都已知，因此可以使用 URL 模式來進行符合比對。

這個欄位包含一個資產群組陣列，每個群組都定義一組資產資源，以及快取它們所依據的政策。

```json
{
  "assetGroups": [{
    ...
  }, {
    ...
  }]
}
```

每個資產群組都同時指定一組資源，以及管理這些資源的政策。這個政策決定資源何時被擷取，以及偵測到變更時會發生什麼事。

資產群組遵循這裡所示的 Typescript 介面：

```typescript
interface AssetGroup {
  name: string;
  installMode?: 'prefetch' | 'lazy';
  updateMode?: 'prefetch' | 'lazy';
  resources: {
    files?: string[];
    /** @deprecated As of v6 `versionedFiles` and `files` options have the same behavior. Use `files` instead. */
    versionedFiles?: string[];
    urls?: string[];
  };
}
```

### `name`

`name` 是必填的。它在設定的各版本之間識別這個特定的資產群組。

### `installMode`

`installMode` 決定這些資源最初如何被快取。`installMode` 可以是兩個值之一：

* `prefetch` 告訴 Angular service worker，在它快取應用程式目前版本的同時，擷取每一個列出的資源。這會大量消耗頻寬，但能確保資源在被請求時隨時可用，即使瀏覽器目前離線也一樣。

* `lazy` 不預先快取任何資源。Angular service worker 只會快取它收到請求的資源。這是一種隨選快取模式。從未被請求的資源不會被快取。這適用於不同解析度的圖片這類情境，讓 service worker 只快取符合特定螢幕與方向的正確資產。

### `updateMode`

對於已經在快取中的資源，`updateMode` 決定在發現應用程式新版本時的快取行為。群組中自前一版本以來已變更的任何資源，都會依 `updateMode` 來更新。

* `prefetch` 告訴 service worker 立即下載並快取已變更的資源。

* `lazy` 告訴 service worker 不要快取這些資源。它會把它們視為未被請求，並等到它們再次被請求時才更新。`updateMode` 為 `lazy` 只有在 `installMode` 也是 `lazy` 時才有效。

### `resources`

這一節說明要快取的資源，細分為三個群組：

* `files` 列出符合發行目錄中檔案的模式。這些可以是單一檔案，或是符合多個檔案的類 glob 模式。

* `versionedFiles` 已棄用。自 v6 起，`versionedFiles` 與 `files` 選項的行為相同。請改用 `files`。

* `urls` 包括在執行階段進行比對的 URL 與 URL 模式。這些資源不會被直接擷取，也沒有內容雜湊，而是依其 HTTP 標頭來快取。這對 Google Fonts 服務這類 CDN 最有用。<br>
  _（不支援否定 glob 模式，且 `?` 會逐字比對；也就是說，它不會符合 `?` 以外的任何字元。）_

## `dataGroups`

與資產資源不同，資料請求不會隨應用程式一起版控。它們會依手動設定的政策來快取，這類政策對 API 請求與其他資料相依性等情境更有用。

資料群組遵循這個 Typescript 介面：

```typescript
export interface DataGroup {
  name: string;
  urls: string[];
  version?: number;
  cacheConfig: {
    maxSize: number;
    maxAge: string;
    timeout?: string;
    strategy?: 'freshness' | 'performance';
  };
}
```

### `name`
與 `assetGroups` 類似，每個資料群組都有一個 `name`，用來唯一識別它。

### `urls`
URL 模式的清單。符合這些模式的 URL 將依這個資料群組的政策來快取。<br>
  _（不支援否定 glob 模式，`?` 將逐字比對；也就是說，它將不會符合 `?` 以外的任何字元。）_

### `version`
API 有時會以不向後相容的方式變更格式。應用程式的新版本可能與舊的 API 格式不相容，因此也可能與來自該 API 的既有快取資源不相容。

`version` 提供一種機制，指出正在快取的資源已以不向後相容的方式更新，而舊的快取項目&mdash;也就是來自先前版本的項目&mdash;應該被捨棄。

`version` 是一個整數欄位，預設值為 `0`。

### `cacheConfig`
本節定義符合的請求被快取所依據的政策。

#### `maxSize`
（必填）快取中項目的最大數量，也就是回應的數量。開放式快取可能會以無限制的方式增長，最終超出儲存配額，需要加以清除。

#### `maxAge`
（必填）`maxAge` 參數指出回應在被視為無效並清除之前，可以在快取中保留多久。`maxAge` 是一個持續時間字串，使用以下單位後綴：

* `d`：天
* `h`：小時
* `m`：分鐘
* `s`：秒
* `u`：毫秒

例如，字串 `3d12h` 表示把內容快取最多三天半。

#### `timeout`
這個持續時間字串指定網路逾時。網路逾時是指在設定如此做的情況下，Angular service worker 在改用已快取回應之前，等待網路回應的時間。

#### `strategy`

Angular service worker 對資料資源可以使用兩種快取策略之一。

* `performance` 是預設策略，針對儘可能快的回應進行最佳化。如果資源存在於快取中，就使用已快取的版本。這會以更好的效能換取一定程度的過時（視 `maxAge` 而定）。這適用於不常變更的資源；例如，使用者頭像圖片。

* `freshness` 針對資料的即時性進行最佳化，優先從網路擷取所請求的資料。只有在網路逾時（依 `timeout` 而定）時，請求才會退回使用快取。這適用於經常變更的資源；例如，帳戶餘額。

## `navigationUrls`

這個可選的區段讓你可以指定一份自訂的 URL 清單，這些 URL 會重新導向到索引檔案。

### 處理導覽請求

ServiceWorker 會把不符合任何 `asset` 或 `data` 群組的導覽請求，重新導向到指定的[索引檔案](#index-file)。符合以下條件的請求會被視為導覽請求：

1. 它的[模式](https://developer.mozilla.org/en-US/docs/Web/API/Request/mode)是 `navigation`。
2. 它接受 `text/html` 回應（依 `Accept` 標頭的值判斷）。
3. 它的 URL 符合某些條件（見下）。

依預設，這些條件是：

1. URL 的最後一個路徑區段不能包含副檔名（也就是 `.`）。
2. URL 不能包含 `__`。

### 比對導覽請求 URL

雖然這些預設條件在大多數情況下都適用，但有時你會想設定不同的規則。例如，你可能會想忽略特定的路由（不屬於 Angular 應用程式的那些路由），並把它們傳給伺服器。

這個欄位包含一個 URL 陣列，以及在執行階段比對的[類 glob](#glob-patterns) URL 模式。它可以同時包含否定模式（也就是以 `!` 開頭的模式）與非否定模式和 URL。

只有 URL 符合_任何_非否定 URL／模式、且_不_符合任何否定模式的請求，才會被視為導覽請求。比對時會忽略 URL 查詢。

如果省略這個欄位，它的預設值為：

```ts
[
  '/**',           // Include all URLs.
  '!/**/*.*',      // Exclude URLs to files.
  '!/**/*__*',     // Exclude URLs containing `__` in the last segment.
  '!/**/*__*/**',  // Exclude URLs containing `__` in any other segment.
]
```
