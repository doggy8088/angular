# Service Worker 運維

本頁是部署與支援使用 Angular service worker 的正式環境應用程式時的參考資料。它說明 Angular service worker 如何融入更大的正式環境、service worker 在各種條件下的行為，以及可用的資源與故障安全機制。

#### 必要條件

對下列內容有基本的了解：
* [與 Service Worker 通訊](guide/service-worker-communications)。

<hr />

## Service worker 與應用程式資源的快取

從概念上來說，把 Angular service worker 想像成一個正向快取，或是安裝在最終使用者 Web 瀏覽器中的 CDN 邊緣節點。Service worker 的工作，是從本機快取滿足 Angular 應用程式對資源或資料的請求，不需要等待網路。和任何快取一樣，它有內容何時到期與如何更新的規則。

{@a versions}

### 應用程式版本

在 Angular service worker 的脈絡中，「版本」是代表 Angular 應用程式某個特定建置的一組資源集合。每當應用程式的新建置被部署時，service worker 就會把該建置視為應用程式的新版本。即使只更新了單一個檔案也是如此。在任何時間點，service worker 的快取中可能同時有多個版本的應用程式，也可能同時提供它們。更多資訊，請參閱下方的[應用程式分頁](guide/service-worker-devops#tabs)一節。

為了維持應用程式的完整性，Angular service worker 把所有檔案分組到一個版本中。分組到一個版本中的檔案通常包括 HTML、JS 與 CSS 檔案。把這些檔案分組對完整性至關重要，因為 HTML、JS 與 CSS 檔案經常互相參照，並依賴特定的內容。例如，一個 `index.html` 檔案可能有一個 `<script>` 標籤參照 `bundle.js`，並可能嘗試從該指令碼中呼叫 `startApp()` 函式。每當這個版本的 `index.html` 被提供時，就必須同時提供對應的 `bundle.js`。例如，假設 `startApp()` 函式在兩個檔案中都被重新命名為 `runApp()`。在這個情境中，提供呼叫 `startApp()` 的舊 `index.html`、搭配定義 `runApp()` 的新 bundle，是不成立的。

在延遲載入模組時，這種檔案完整性尤其重要。
一個 JS bundle 可能參照許多延遲載入的 chunk，而這些延遲 chunk 的
檔案名稱是該應用程式建置所獨有的。如果一個執行中的
應用程式在版本 `X` 試圖載入一個延遲 chunk，但伺服器已經
更新到版本 `X + 1`，延遲載入操作就會失敗。

應用程式的版本識別碼由所有資源的內容決定，
只要其中任何一個變更，識別碼就會變更。實務上，版本
是由 `ngsw.json` 檔案的內容決定的，該檔案包括
所有已知內容的雜湊。如果任何已快取的檔案變更，該檔案的
雜湊就會在 `ngsw.json` 中變更，因而導致 Angular service worker 把
目前作用中的檔案集合視為新版本。

有了 Angular service worker 的版本控制行為，應用程式
伺服器就能確保 Angular 應用程式永遠擁有一致的檔案集合。

#### 更新檢查

每當使用者開啟或重新整理應用程式時，Angular service worker
都會透過尋找 `ngsw.json` manifest 的更新，來檢查應用程式是否有更新。如果
找到更新，它會被自動下載並快取，並在下次
載入應用程式時提供。

### 資源完整性

長期快取的一個潛在副作用，是不小心
快取了一個無效的資源。在一般的 HTTP 快取中，強制重新整理
或快取到期會限制快取無效檔案的負面
影響。Service worker 忽略這類限制，實際上把整個應用程式長期
快取。因此，service worker 取得正確的內容至關重要。

為了確保資源完整性，Angular service worker 會驗證
它擁有雜湊的所有資源的雜湊。通常，對於
在 CLI 應用程式中，這是指 `dist` 目錄中被
使用者的 `src/ngsw-config.json` 設定涵蓋的一切。

如果某個特定檔案未通過驗證，Angular service worker
會嘗試使用一個「cache-busting」URL
參數重新擷取內容，以消除瀏覽器或中間層
快取的影響。如果該內容也未通過驗證，service worker
會認為應用程式的整個版本無效，並停止
提供該應用程式。如有必要，service worker 會進入安全模式，
讓請求退回使用網路；當提供無效、損壞或過時內容的風險很高時，它會選擇不使用它的快取。

雜湊不一致可能因各種原因而發生：

* 來源伺服器與最終使用者之間的快取層可能提供過時的內容。
* 非原子性的部署可能導致 Angular service worker 看到部分更新的內容。
* 建置流程中的錯誤可能導致資源已更新、但 `ngsw.json` 未更新。反過來也可能發生，導致 `ngsw.json` 已更新、但資源未更新。

#### 未雜湊的內容

在 `ngsw.json`
manifest 中有雜湊的資源，只有那些在 manifest
建立時存在於 `dist`
目錄中的資源。其他
資源，尤其是從 CDN 載入的資源，其
內容在建置時未知，或更新
頻率比應用程式的部署更頻繁。

如果 Angular service worker 沒有雜湊可驗證
某個資源，它仍然會快取該資源的內容，但會遵循
HTTP 快取標頭，採用「stale while
revalidate」政策。也就是說，當已快取
資源的 HTTP 快取標頭指出該資源已到期時，Angular
service worker 會繼續提供該內容，並嘗試
在背景重新整理該資源。如此一來，損壞的
未雜湊資源不會在快取中停留超過它們
設定的存活時間。

{@a tabs}

### 應用程式分頁

如果一個應用程式接收到的資源版本
突然或在沒有警告的情況下變更，可能會造成問題。請參閱
上方的[版本](guide/service-worker-devops#versions)一節，
了解這類問題的說明。

Angular service worker 提供一項保證：執行中的應用程式
會繼續執行同一個版本的應用程式。如果另一個
應用程式執行個體在新的 Web 瀏覽器分頁中開啟，則
會提供應用程式的最新版本。因此，
那個新分頁執行的應用程式版本可能
與原始分頁不同。

值得注意的是，這項保證比一般 Web 部署模型提供的**更強**。
沒有 service worker，就無法保證
在執行中的應用程式裡稍後延遲載入的程式碼，與
應用程式的初始程式碼來自同一個版本。

Angular service worker 可能變更執行中
應用程式版本的原因只有少數幾個。其中一些是
錯誤條件：

* 目前版本因雜湊失敗而變得無效。
* 一個不相關的錯誤導致 service worker 進入安全模式；也就是暫時停用。

Angular service worker 隨時都知道哪些版本
正在使用中，並在
沒有分頁使用某個版本時將它清理掉。

Angular service worker 可能變更執行中應用程式版本的其他
原因，屬於正常事件：

* 頁面被重新載入／重新整理。
* 頁面使用 `SwUpdate` 服務請求立即啟用一個更新。

### Service worker 更新

Angular service worker 是一個在 Web 瀏覽器中執行的小型指令碼。
Service worker 會不時以錯誤
修正與功能改進來更新。

Angular service worker 會在應用程式第一次開啟時下載，
也會在一段時間沒有活動後再次存取應用程式時下載。如果
service worker 有變更，它會在背景更新。

Angular service worker 的大多數更新對應用程式來說是透明的
——舊的快取仍然有效，內容也照常
提供。不過，偶爾 Angular
service worker 的錯誤修正或功能會需要讓舊快取失效。在這種情況下，
應用程式會被透明地從網路重新整理。

## 對 Angular service worker 進行除錯

偶爾，你可能需要檢視執行狀態中的 Angular service
worker，以調查問題或確認它是否如設計般
運作。瀏覽器提供內建工具來
除錯 service worker，而 Angular service worker 本身
也包含實用的除錯功能。

### 尋找與分析除錯資訊

Angular service worker 在
`ngsw/` 虛擬目錄下公開除錯資訊。目前唯一公開的 URL
是 `ngsw/state`。以下是這個除錯頁面內容的範例：

```
NGSW Debug Info:

Driver state: NORMAL ((nominal))
Latest manifest hash: eea7f5f464f90789b621170af5a569d6be077e5c
Last update check: never

=== Version eea7f5f464f90789b621170af5a569d6be077e5c ===

Clients: 7b79a015-69af-4d3d-9ae6-95ba90c79486, 5bc08295-aaf2-42f3-a4cc-9e4ef9100f65

=== Idle Task Queue ===
Last update tick: 1s496u
Last update run: never
Task queue:
 * init post-load (update, cleanup)

Debug log:
```

#### Driver 狀態

第一行指出 driver 的狀態：

```
Driver state: NORMAL ((nominal))
```

`NORMAL` 表示 service worker 運作正常，且不在降級狀態。

有兩種可能的降級狀態：

* `EXISTING_CLIENTS_ONLY`：service worker 沒有
應用程式最新已知版本的乾淨副本。較舊的已快取
版本使用起來是安全的，因此既有分頁會繼續從
快取執行，但應用程式的新載入會從網路提供。

* `SAFE_MODE`：service worker 無法保證
使用已快取資料的安全性。可能是發生了非預期的錯誤，或所有
已快取版本都無效。所有流量都會從
網路提供，並儘可能少執行 service worker 程式碼。

在這兩種情況下，括號中的註解提供
導致 service worker 進入降級狀態的錯誤。

#### 最新 manifest 雜湊

```
Latest manifest hash: eea7f5f464f90789b621170af5a569d6be077e5c
```

這是 service worker 所知應用程式最新版本的 SHA1 雜湊。


#### 上次更新檢查

```
Last update check: never
```

這指出 service worker 上次檢查應用程式新版本或更新的時間。`never` 表示 service worker 從未檢查過更新。

在這個除錯檔案範例中，更新檢查目前已排程，下一節會說明。

#### 版本

```
=== Version eea7f5f464f90789b621170af5a569d6be077e5c ===

Clients: 7b79a015-69af-4d3d-9ae6-95ba90c79486, 5bc08295-aaf2-42f3-a4cc-9e4ef9100f65
```

在這個範例中，service worker 已快取一個版本的應用程式，並
用它來服務兩個不同的分頁。請注意，這個版本雜湊
就是上面列出的「最新 manifest 雜湊」。兩個用戶端都在
最新版本上。每個用戶端都以其在瀏覽器 `Clients`
API 中的 ID 列出。


#### 閒置工作佇列

```
=== Idle Task Queue ===
Last update tick: 1s496u
Last update run: never
Task queue:
 * init post-load (update, cleanup)
```

閒置工作佇列是所有在
背景於 service worker 中發生的待處理工作的佇列。如果佇列中有任何工作，
它們會連同說明一起列出。在這個範例中，
service worker 已排程一個這樣的工作：一個初始化後的操作，
包含更新檢查與清理過時快取。

上次更新 tick／run 計數器，提供自特定
與閒置佇列相關的事件發生以來經過的時間。「Last update run」
計數器顯示上次實際執行閒置工作的時間。
「Last update tick」顯示自上一個
佇列可能被處理的事件以來經過的時間。


#### 除錯記錄

```
Debug log:
```

在 service worker 內發生的錯誤會記錄在這裡。


### 開發者工具

Chrome 等瀏覽器提供與 service worker 互動的
開發者工具。這類工具在正確使用時功能強大，
但有幾件事要記住。

* 使用開發者工具時，service worker 會保持在
背景執行，永遠不會重新啟動。這可能導致開啟 Dev
Tools 時的行為，與使用者可能體驗到的行為不同。

* 如果你查看 Cache Storage 檢視器，快取經常是
過時的。在 Cache Storage 標題上按右鍵，並重新整理快取。

在 Service Worker 窗格中停止並啟動 service worker，會觸發更新檢查。

## Service Worker 安全性

和任何複雜系統一樣，錯誤或損壞的設定可能導致
Angular service worker 以無法預見的方式運作。雖然它的
設計試圖把這類問題的影響降到最低，
Angular service worker 仍包含多種故障安全機制，以備
管理員需要快速停用 service worker 時使用。

### 故障安全機制

若要停用 service worker，請移除或重新命名
`ngsw-config.json` 檔案。當 service worker 對
`ngsw.json` 的請求回傳 `404` 時，service worker
就會移除它所有的快取並取消註冊自己，
實際上等於自我毀滅。

### Safety worker 安全指令碼

`@angular/service-worker` NPM 套件中也包含一個小型
指令碼 `safety-worker.js`，載入時，它會向瀏覽器取消註冊自己。
這個指令碼可以
作為最後手段，用來移除已安裝在
用戶端頁面上、不想要的 service worker。

值得注意的是，你不能直接註冊這個 worker，
因為帶有已快取狀態的舊用戶端，可能看不到安裝不同 worker 指令碼的新 `index.html`。
相反地，你必須在你試圖取消註冊的 Service Worker 指令碼的 URL 上，提供
`safety-worker.js` 的內容，並必須持續這麼做，直到你確定
所有使用者都已成功取消註冊舊的 worker 為止。對
大多數網站來說，這意味著你應該永遠在
舊的 Service Worker URL 上提供 safety worker。

這個指令碼既可以用來停用 `@angular/service-worker`，
也可以移除
你網站過去可能曾提供的任何其他 Service Worker。

## 更多 Angular Service Worker 資訊

你可能也會對以下內容有興趣：
* [Service Worker 設定](guide/service-worker-config)。
