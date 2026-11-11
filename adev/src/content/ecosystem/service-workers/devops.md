# Service Worker 運維

本頁是部署與支援使用 Angular Service Worker 的生產應用程式時的參考資料。
它說明 Angular Service Worker 如何融入更大的生產環境、Service Worker 在各種條件下的行為，以及可用的資源與安全機制。

## Service Worker 與應用程式資源的快取

把 Angular Service Worker 想像成一個正向快取，或是安裝在最終使用者 Web 瀏覽器中的內容傳遞網路（CDN）邊緣節點。
Service Worker 會從本機快取回應 Angular 應用程式對資源或資料的請求，不需要等待網路。
和任何快取一樣，它有內容何時到期與如何更新的規則。

### 應用程式版本 {#application-versions}

在 Angular Service Worker 的脈絡中，「版本」是代表 Angular 應用程式某個特定建置的一組資源集合。
每當應用程式的新建置被部署時，Service Worker 就會把該建置視為應用程式的新版本。
即使只更新了單一個檔案也是如此。
在任何時間點，Service Worker 的快取中可能同時有多個版本的應用程式，也可能同時提供它們。
更多資訊，請參閱[應用程式分頁](#application-tabs)一節。

為了維持應用程式的完整性，Angular Service Worker 把所有檔案分組到一個版本中。
分組到一個版本中的檔案通常包括 HTML、JS 與 CSS 檔案。
把這些檔案分組對完整性至關重要，因為 HTML、JS 與 CSS 檔案經常互相參照，並依賴特定的內容。
例如，一個 `index.html` 檔案可能有一個 `<script>` 標籤參照 `bundle.js`，並可能嘗試從該指令碼中呼叫 `startApp()` 函式。
每當這個版本的 `index.html` 被提供時，就必須同時提供對應的 `bundle.js`。
例如，假設 `startApp()` 函式在兩個檔案中都被重新命名為 `runApp()`。
在這個情境中，提供呼叫 `startApp()` 的舊 `index.html`、搭配定義 `runApp()` 的新 bundle，是不成立的。

在延遲載入時，這種檔案完整性尤其重要。
一個 JS bundle 可能參照許多延遲載入的 chunk，而這些延遲 chunk 的檔案名稱是該應用程式建置所獨有的。
如果一個執行中的應用程式在版本 `X` 試圖載入一個延遲 chunk，但伺服器已經更新到版本 `X + 1`，延遲載入操作就會失敗。

應用程式的版本識別碼由所有資源的內容決定，只要其中任何一個變更，識別碼就會變更。
實務上，版本是由 `ngsw.json` 檔案的內容決定的，該檔案包括所有已知內容的雜湊。
如果任何已快取的檔案變更，該檔案在 `ngsw.json` 中的雜湊就會變更。這個變更會導致 Angular Service Worker 把目前作用中的檔案集合視為新版本。

HELPFUL: 建置流程會使用 `ngsw-config.json` 的資訊建立這份 manifest 檔案 `ngsw.json`。

有了 Angular Service Worker 的版本控制行為，應用程式伺服器就能確保 Angular 應用程式永遠擁有一致的檔案集合。

#### 更新檢查

每當使用者開啟或重新整理應用程式時，Angular Service Worker 都會透過尋找 `ngsw.json` manifest 的更新，來檢查應用程式是否有更新。
如果找到更新，它會被自動下載並快取，並在下次載入應用程式時提供。

### 資源完整性

長期快取的一個潛在副作用，是不小心快取了一個無效的資源。
在一般的 HTTP 快取中，強制重新整理或快取到期會限制快取無效檔案的負面影響。
Service Worker 忽略這類限制，實際上把整個應用程式長期快取。
Service Worker 取得正確的內容很重要，因此它會保留資源的雜湊來維護其完整性。

#### 已雜湊的內容

為了確保資源完整性，Angular Service Worker 會驗證它擁有雜湊的所有資源的雜湊。
對於以 [Angular CLI](tools/cli) 建立的應用程式，這是指 `dist` 目錄中被使用者的 `src/ngsw-config.json` 設定涵蓋的一切。

如果某個特定檔案未通過驗證，Angular Service Worker 會嘗試使用一個「cache-busting」URL 參數重新擷取內容，以避免瀏覽器或中間層的快取。
如果該內容也未通過驗證，Service Worker 會認為應用程式的整個版本都無效，並停止提供該應用程式。
如有必要，Service Worker 會進入安全模式，讓請求退回使用網路。當提供損壞、過時或無效內容的風險很高時，Service Worker 不會使用它的快取。

雜湊不一致可能因各種原因而發生：

- 來源伺服器與最終使用者之間的快取層可能提供過時的內容
- 非原子性的部署可能導致 Angular Service Worker 看到部分更新的內容
- 建置流程中的錯誤可能導致資源已更新、但 `ngsw.json` 未更新。
  反過來也可能發生，導致 `ngsw.json` 已更新、但資源未更新。

#### 未雜湊的內容

在 `ngsw.json` manifest 中有雜湊的資源，只有那些在 manifest 建立時存在於 `dist` 目錄中的資源。
其他資源，尤其是從 CDN 載入的資源，其內容在建置時未知，或更新頻率比應用程式的部署更頻繁。

如果 Angular Service Worker 沒有雜湊可驗證資源是否有效，它仍然會快取該資源的內容。同時，它會遵循 HTTP 快取標頭，採用 _stale while revalidate_ 政策。
Angular Service Worker 會在 HTTP 快取標頭指出資源已不再有效之後，仍繼續提供該資源。同時，它會嘗試在背景重新整理已到期的資源。
如此一來，損壞的未雜湊資源不會在快取中停留超過它們設定的存活時間。

### 應用程式分頁 {#application-tabs}

如果一個應用程式接收到的資源版本突然或在沒有警告的情況下變更，可能會造成問題。
這類問題的說明，請參閱[應用程式版本](#application-versions)一節。

Angular Service Worker 提供一項保證：執行中的應用程式會繼續執行同一個版本的應用程式。
如果應用程式的另一個執行個體在新的 Web 瀏覽器分頁中開啟，則會提供應用程式的最新版本。
因此，那個新分頁執行的應用程式版本可能與原始分頁不同。

IMPORTANT: 這項保證比一般 Web 部署模型提供的**更強**。沒有 Service Worker，就無法保證延遲載入的程式碼與應用程式的初始程式碼來自同一個版本。

Angular Service Worker 可能會在以下錯誤條件下變更執行中應用程式的版本：

- 目前版本因雜湊失敗而變得無效。
- 一個不相關的錯誤導致 Service Worker 進入安全模式，並暫時停用它。

當沒有分頁在使用時，Angular Service Worker 會清理應用程式版本。

Angular Service Worker 可能變更執行中應用程式版本的其他原因，屬於正常事件：

- 頁面被重新載入／重新整理。
- 頁面使用 `SwUpdate` 服務請求立即啟用一個更新。

### Service Worker 更新

Angular Service Worker 是一個在 Web 瀏覽器中執行的小型指令碼。
Service Worker 會不時以錯誤修正與功能改進來更新。

Angular Service Worker 會在應用程式第一次開啟時下載，也會在一段時間沒有活動後再次存取應用程式時下載。
如果 Service Worker 有變更，它會在背景更新。

Angular Service Worker 的大多數更新對應用程式來說是透明的。舊的快取仍然有效，內容也照常提供。
偶爾，Angular Service Worker 的錯誤修正或功能可能需要讓舊快取失效。
在這種情況下，Service Worker 會透明地從網路重新整理應用程式。

### 繞過 Service Worker {#bypassing-the-service-worker}

在某些情況下，你可能會想完全繞過 Service Worker，讓瀏覽器處理請求。
例如，當你依賴一個目前在 Service Worker 中不受支援的功能時，例如[回報已上傳檔案的進度](https://github.com/w3c/ServiceWorker/issues/1141)。

若要繞過 Service Worker，請把 `ngsw-bypass` 設為請求標頭，或設為查詢參數。
標頭或查詢參數的值會被忽略，可以是空的或省略。

### 伺服器無法連線時的 Service Worker 請求

Service Worker 會處理所有請求，除非[明確繞過 Service Worker](#bypassing-the-service-worker)。
Service Worker 會依快取的狀態與設定，回傳已快取的回應，或把請求送往伺服器。
Service Worker 只會快取非變更型請求的回應，例如 `GET` 與 `HEAD`。

如果 Service Worker 從伺服器收到錯誤，或沒有收到回應，它會回傳一個錯誤狀態，指出呼叫的結果。
例如，如果 Service Worker 沒有收到回應，它會建立一個 [504 Gateway Timeout](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/504) 狀態來回傳。這個例子中的 `504` 狀態，可能是因為伺服器離線或用戶端已斷線而回傳。

## 對 Angular Service Worker 進行除錯

偶爾，你可能需要檢視執行狀態中的 Angular Service Worker，以調查問題或確認它是否如設計般運作。
瀏覽器提供內建工具來除錯 Service Worker，而 Angular Service Worker 本身也包含實用的除錯功能。

### 尋找與分析除錯資訊

Angular Service Worker 在 `ngsw/` 虛擬目錄下公開除錯資訊。
目前唯一公開的 URL 是 `ngsw/state`。
以下是這個除錯頁面內容的範例：

<docs-code hideCopy language="shell">

NGSW Debug Info:

Driver version: 13.3.7
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

</docs-code>

#### Driver 狀態

第一行指出 driver 的狀態：

<docs-code hideCopy language="shell">

Driver state: NORMAL ((nominal))

</docs-code>

`NORMAL` 表示 Service Worker 運作正常，且不在降級狀態。

有兩種可能的降級狀態：

| 降級狀態                | 詳細說明                                                                                                                                                                                                                                                                                                                                                                                                                       |
| :---------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `EXISTING_CLIENTS_ONLY` | Service Worker 沒有應用程式最新已知版本的乾淨副本。較舊的已快取版本使用起來是安全的，因此既有分頁會繼續從快取執行，但應用程式的新載入會從網路提供。Service Worker 會在偵測並安裝到應用程式新版本時，嘗試從這個狀態復原。這會在有新的 `ngsw.json` 可用時發生。 |
| `SAFE_MODE`             | Service Worker 無法保證使用已快取資料的安全性。可能是發生了非預期的錯誤，或所有已快取版本都無效。所有流量都會從網路提供，並儘可能少執行 Service Worker 程式碼。                                                                                                                                                                                  |

在這兩種情況下，括號中的註解提供導致 Service Worker 進入降級狀態的錯誤。

這兩個狀態都是暫時的；它們只會在 [ServiceWorker 執行個體](https://developer.mozilla.org/docs/Web/API/ServiceWorkerGlobalScope) 的存活期間內保存。
瀏覽器有時會終止閒置的 Service Worker 以節省記憶體與處理器電力，並在回應網路事件時建立一個新的 Service Worker 執行個體。
新執行個體會以 `NORMAL` 模式開始，無論先前執行個體的狀態為何。

#### 最新 manifest 雜湊

<docs-code hideCopy language="shell">

Latest manifest hash: eea7f5f464f90789b621170af5a569d6be077e5c

</docs-code>

這是 Service Worker 所知應用程式最新版本的 SHA1 雜湊。

#### 上次更新檢查

<docs-code hideCopy language="shell">

Last update check: never

</docs-code>

這指出 Service Worker 上次檢查應用程式新版本或更新的時間。
`never` 表示 Service Worker 從未檢查過更新。

在這個除錯檔案範例中，更新檢查目前已排程，下一節會說明。

#### 版本

<docs-code hideCopy language="shell">

=== Version eea7f5f464f90789b621170af5a569d6be077e5c ===

Clients: 7b79a015-69af-4d3d-9ae6-95ba90c79486, 5bc08295-aaf2-42f3-a4cc-9e4ef9100f65

</docs-code>

在這個範例中，Service Worker 已快取一個版本的應用程式，並用它來服務兩個不同的分頁。

HELPFUL: 這個版本雜湊就是上面列出的「最新 manifest 雜湊」。兩個用戶端都在最新版本上。每個用戶端都以其在瀏覽器 `Clients` API 中的 ID 列出。

#### 閒置工作佇列

<docs-code hideCopy language="shell">

=== Idle Task Queue ===
Last update tick: 1s496u
Last update run: never
Task queue:
 * init post-load (update, cleanup)

</docs-code>

閒置工作佇列是 Service Worker 中所有在背景發生的待處理工作的佇列。
如果佇列中有任何工作，它們會連同說明一起列出。
在這個範例中，Service Worker 已排程一個這樣的工作：一個初始化後的操作，包含更新檢查與清理過時快取。

上次更新 tick／run 計數器，提供自閒置佇列相關的特定事件發生以來經過的時間。
「Last update run」計數器顯示上次實際執行閒置工作的時間。
「Last update tick」顯示自上一個佇列可能被處理的事件以來經過的時間。

#### 除錯記錄

<docs-code hideCopy language="shell">

Debug log:

</docs-code>

在 Service Worker 內發生的錯誤會記錄在這裡。

### 開發者工具

Chrome 等瀏覽器提供與 Service Worker 互動的開發者工具。
這類工具在正確使用時功能強大，但有幾件事要記住。

- 使用開發者工具時，Service Worker 會保持在背景執行，永遠不會重新啟動。
  這可能導致開啟 Dev Tools 時的行為，與使用者可能體驗到的行為不同。

- 如果你查看 Cache Storage 檢視器，快取經常是過時的。
  在 Cache Storage 標題上按右鍵，並重新整理快取。

- 在 Service Worker 窗格中停止並啟動 Service Worker，會檢查更新

## Service Worker 安全性

錯誤或損壞的設定可能導致 Angular Service Worker 以非預期的方式運作。
如果發生這種情況，Angular Service Worker 包含多種安全機制，以備管理員需要快速停用 Service Worker 時使用。

### 故障安全機制 {#fail-safe}

若要停用 Service Worker，請重新命名 `ngsw.json` 檔案或將它刪除。
當 Service Worker 對 `ngsw.json` 的請求回傳 `404` 時，Service Worker 就會移除它所有的快取並取消註冊自己，實際上等於自我毀滅。

### Safety worker 安全指令碼 {#safety-worker}

<!-- vale Angular.Google_Acronyms = NO -->

一個小型指令碼 `safety-worker.js`，也包含在 `@angular/service-worker` NPM 套件中。
載入時，它會向瀏覽器取消註冊自己，並移除 Service Worker 快取。
這個指令碼可以作為最後手段，用來移除已安裝在用戶端頁面上、不想要的 Service Worker。

<!-- vale Angular.Google_Acronyms = YES -->

CRITICAL: 你不能直接註冊這個 worker，因為帶有已快取狀態的舊用戶端，可能看不到安裝不同 worker 指令碼的新 `index.html`。

相反地，你必須在你試圖取消註冊的 Service Worker 指令碼的 URL 上，提供 `safety-worker.js` 的內容。你必須持續這麼做，直到你確定所有使用者都已成功取消註冊舊的 worker 為止。
對大多數網站來說，這意味著你應該永遠在舊的 Service Worker URL 上提供 safety worker。
這個指令碼可以用來停用 `@angular/service-worker` 並移除對應的快取。它也會移除你網站過去可能曾提供的任何其他 Service Worker。

### 變更應用程式的位置

IMPORTANT: Service Worker 無法在重新導向之後運作。
你可能已經遇過這個錯誤 `The script resource is behind a redirect, which is disallowed`。

如果你必須變更應用程式的位置，這可能會是個問題。
如果你設定了從舊位置（例如 `example.com`）到新位置（在這個例子中是 `www.example.com`）的重新導向，worker 就會停止運作。
此外，對於完全從 Service Worker 載入網站的使用者，重新導向甚至不會觸發。
在 `example.com` 註冊的舊 worker 會嘗試更新，並向舊位置 `example.com` 發送請求。這個請求會被重新導向到新位置 `www.example.com`，並產生錯誤：`The script resource is behind a redirect, which is disallowed`。

若要修正這個問題，你可能需要使用先前其中一種技巧來停用舊 worker：[故障安全機制](#fail-safe)或 [Safety Worker](#safety-worker)。

## 更多 Angular Service Worker 資訊

你可能也會對以下內容有興趣：

<docs-pill-row>
  <docs-pill href="ecosystem/service-workers/config" title="設定檔"/>
  <docs-pill href="ecosystem/service-workers/communications" title="與 Service Worker 通訊"/>
</docs-pill-row>
