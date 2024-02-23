# 服務工作人員 DevOps

此頁面是使用 Angular 服務工作程序來部署和支援生產應用程式的參考。
它解釋了 Angular 服務工作程序如何融入較大的生產環境、服務工作程序在各種情況下的行為，以及可用資源和故障保護。

## Service worker 和應用程式資源的快取

將 Angular 服務工作者想像成安裝在最終使用者網路瀏覽器中的前進快取或內容傳遞網路 (CDN) 邊緣。
服務工作者會回應 Angular 應用程式針對資源或數據提出的要求，從本機快取中回應，無需等待網路。
與任何快取一樣，它有內容到期和更新的規則。

### 應用程式版本

在 Angular 服務工作者的內容中，「版本」是指代表 Angular 應用程式特定建置的資源集合。
每當新的應用程式建置部署時，服務工作者會將該建置視為應用程式的版本。
即使只更新一個檔案，也是如此。
服務工作者在任何時間點都可能在其快取中有應用程式的多個版本，且可能同時提供服務。
如需更多資訊，請參閱 [應用程式分頁](#application-tabs) 部分。

為了維護應用程式的完整性，Angular service worker 將所有檔案分組至一個版本中。
分組至一個版本的檔案通常包括 HTML、JS 和 CSS 檔案。
這些檔案的分組對於完整性來說是必要的，因為 HTML、JS 和 CSS 檔案經常相互參照並取決於特定內容。
例如，`index.html` 檔案可能有一個參照 `bundle.js` 的 `<script>` 標籤，並且可能嘗試從該指令碼內呼叫函式 `startApp()`。
每次提供此版本的 `index.html` 時，都必須提供對應的 `bundle.js`。
例如，假設 `startApp()` 函式在兩個檔案中都重新命名為 `runApp()`。
在這種情況下，提供舊的 `index.html`（呼叫 `startApp()`）以及定義 `runApp()` 的新組合並不有效。

此檔案完整性在延遲載入時尤其重要。
JS 程式集可能參考許多延遲區塊，而延遲區塊的檔名是應用程式的特定建置所獨有的。
如果在 `X` 版本的執行中應用程式嘗試載入延遲區塊，但伺服器已更新到 `X + 1` 版本，則延遲載入操作會失敗。

應用程式的版本識別碼由所有資源的內容決定，若其中任何資源變更，版本識別碼也會變更。
實際上，版本由 `ngsw.json` 檔案的內容決定，其中包含所有已知內容的雜湊值。
若任何快取檔案變更，檔案的雜湊值也會在 `ngsw.json` 中變更。這個變更會導致 Angular 服務工作者將目前的檔案組視為新版本。

HELPFUL: 建置程序建立資訊清單檔案 `ngsw.json`，使用來自 `ngsw-config.json` 的資訊。

使用 Angular 服務工作者的版本控管行為，應用程式伺服器可以確保 Angular 應用程式始終具有一組一致的文件。

#### 更新檢查

每次使用者開啟或重新整理應用程式時，Angular service worker 會透過尋找 `ngsw.json` 清單的更新來檢查應用程式的更新。
如果找到更新，則會自動下載並快取，並在下次載入應用程式時提供。

### 資源完整性

長期快取潛在的副作用之一是不小心快取無效的資源。
在正常的 HTTP 快取中，強制重新整理或快取過期會限制快取無效檔案的負面影響。
服務工作者會忽略此類約束，並有效地長期快取整個應用程式。
服務工作者獲取正確內容非常重要，因此它會保留資源的雜湊值以維護其完整性。

#### 哈希內容

為了確保資源完整性，Angular 服務工作者會驗證它具有雜湊的所有資源的雜湊。
對於使用 [Angular CLI](tools/cli) 建立的應用程式，這是使用者 `src/ngsw-config.json` 設定中涵蓋的 `dist` 目錄中的所有內容。

如果某個檔案驗證失敗，Angular service worker 會嘗試使用「快取破解」URL 參數重新擷取內容，以防止瀏覽器或中間快取。
如果該內容也驗證失敗，service worker 會認為整個版本的應用程式無效，並停止提供該應用程式。
必要時，service worker 會進入安全模式，其中請求會回退到網路。如果提供損壞、過時或無效內容的風險很高，service worker 就不會使用其快取。

雜湊不匹配可能出於多種原因：

* 原始伺服器和最終用戶之間的快取層可能提供過時的內容
* 非原子性部署可能導致 Angular 服務工作者具有部分更新內容的可見性
* 建構過程中的錯誤可能導致更新的資源沒有更新 `ngsw.json`。
    反之亦然，導致更新的 `ngsw.json` 沒有更新的資源。

#### 未雜湊內容

`ngsw.json` 清單中唯一具有雜湊的資源是在建置清單時存在於 `dist` 目錄中的資源。
其他資源，尤其是從 CDN 載入的資源，其內容在建置時未知，或比應用程式部署更頻繁地更新。

如果 Angular service worker 沒有雜湊來驗證資源是否有效，它仍然會快取其內容。同時，它會透過使用「重新驗證期間過期」的政策來遵守 HTTP 快取標頭。
Angular service worker 會繼續提供資源，即使其 HTTP 快取標頭指示它不再有效。同時，它會嘗試在背景中重新整理過期的資源。
這樣一來，損壞的未雜湊資源不會在快取中保留超過其配置的生命週期。

### 應用程式標籤

如果應用程式接收的資源版本突然或沒有警告就變更，可能會有問題。
請參閱 [應用程式版本](#application-versions) 部分，以取得此類問題的說明。

Angular service worker 提供一個保證：正在執行的應用程式會繼續執行該應用程式的相同版本。
如果在新的網路瀏覽器分頁中開啟另一個應用程式實例，則會提供該應用程式最新版本。
因此，新分頁執行的是不同版本應用程式，而非原始分頁的版本。

重要：此保證比一般網路部署模式所提供的保證**更強**。在沒有服務工作者的情況下，無法保證延遲載入的程式碼與應用程式初始程式碼屬於同一個版本。

Angular 服務工作者可能會在錯誤狀況下變更執行中應用程式的版本，例如：

* 目前版本因雜湊失敗而變得無效。
* 無關的錯誤導致服務工作者進入安全模式並暫時停用它。

當沒有任何分頁使用時，Angular 服務工作程序會清除應用版本。

Angular 服務工作者可能會變更正在執行的應用程式版本的其他原因是正常事件：

* 頁面重新載入/刷新。
* 頁面要求使用 `SwUpdate` 服務立即啟用更新。

### 服務工作者更新

Angular 服務工作者是一個在網路瀏覽器中執行的小腳本。
服務工作者會不時更新錯誤修正和功能改進。

當應用程式首次開啟以及在一段時間沒有活動後再次存取應用程式時，Angular 服務工作者會下載。
如果服務工作者發生變更，它會在背景中更新。

大多數對 Angular 服務工作者的更新對應用程式來說都是透明的。舊快取仍然有效，內容仍正常提供。
偶爾，Angular 服務工作者中的錯誤修正或功能可能需要使舊快取失效。
在這種情況下，服務工作者會從網路透明地重新整理應用程式。

### 繞過服務工作者

在某些情況下，您可能想完全繞過服務工作者，並讓瀏覽器處理請求。
一個範例是您依賴目前服務工作者不支援的功能，例如 [報告已上傳檔案的進度](https://github.com/w3c/ServiceWorker/issues/1141)。

若要繞過服務工作者，請將 `ngsw-bypass` 設為請求標頭或查詢參數。
標頭或查詢參數的值會被忽略，可以是空值或省略。

### 服務工作者要求伺服器無法存取時

服務工作者會處理所有要求，除非[明確地繞過服務工作者](#bypassing-the-service-worker)。
服務工作者會傳回快取的回應或將要求傳送至伺服器，取決於快取的狀態和組態。
服務工作者只會快取非變動要求的回應，例如 `GET` 和 `HEAD`。

如果服務工作者從伺服器收到錯誤或沒有收到回應，它會回傳一個錯誤狀態，以指示呼叫的結果。
例如，如果服務工作者沒有收到回應，它會建立一個 [504 Gateway Timeout](https://developer.mozilla.org/zh-TW/docs/Web/HTTP/Status/504) 狀態以回傳。此範例中的 `504` 狀態可能是因為伺服器離線或用戶端斷線而回傳。

## 偵錯 Angular 服務工作者

<p>
  The following steps can help you debug the Angular service worker:
</p>

<ol>
<li>
  Enable debugging in the browser.
</li>
<li>
  Open the browser's developer tools.
</li>
<li>
  Navigate to the <b>Application</b> tab.
</li>
<li>
  Click on the <b>Service Workers</b> tab.
</li>
<li>
  Find the service worker for your Angular application.
</li>
<li>
  Click on the <b>Inspect</b> button.
</li>
<li>
  The browser will open the service worker's source code in the developer tools.
</li>
<li>
  Set breakpoints in the service worker's code.
</li>
<li>
  Reload the page.
</li>
<li>
  The browser will stop at the breakpoints you set.
</li>
<li>
  You can then debug the service worker's code.
</li>
</ol>

<p>
  Here are some additional tips for debugging the Angular service worker:
</p>

<ul>
<li>
  Use the console.log() function to log messages from the service worker.
</li>
<li>
  Use the debugger keyword to stop the service worker at a specific point in the code.
</li>
<li>
  Use the browser's developer tools to inspect the service worker's cache.
</li>
<li>
  Use the ngsw-toolbox library to help you debug the service worker.
</li>
</ul>

偶爾，可能需要在執行狀態中檢查 Angular 服務工作者來調查問題或是否按照設計運行。
瀏覽器提供內建工具來除錯服務工作者，而 Angular 服務工作者本身包含有用的除錯功能。

### 定位和分析除錯資訊

Angular 服務工作者在 `ngsw/` 虛擬目錄下公開除錯資訊。
目前，唯一的公開 URL 是 `ngsw/state`。
以下是此除錯頁面內容的範例：

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
 &ast; init post-load (update, cleanup)

Debug log:

</docs-code>

#### 駕駛狀態

第一行指示驅動程序狀態：

<docs-code hideCopy language="shell">

Driver state: NORMAL ((nominal))

</docs-code>

`NORMAL` 表示服務工作者正在正常運作，且未處於降級狀態。

可能有兩種降級狀態：

| 降低狀態         | 詳細資訊 |
|:---                     |:---     |
| `EXISTING_CLIENTS_ONLY` | 服務工作者沒有最新已知版本的應用程式的乾淨副本。較舊的快取版本安全可用，因此現有分頁繼續從快取執行，但應用程式的載入將從網路提供。當檢測並安裝新版本的應用程式時，服務工作者會嘗試從此狀態復原。當新的 `ngsw.json` 可用時，就會發生這種情況。 |
| `SAFE_MODE`             | 服務工作者無法保證使用快取資料的安全性。發生意外錯誤或所有快取版本都無效。所有流量都將從網路提供，運行儘可能少的服務工作者程式碼。 |

在兩種情況下，括號註解會提供導致服務工作者進入降級狀態的錯誤。

這兩種狀態都是暫時的；它們僅在 [ServiceWorker 執行個體](https://developer.mozilla.org/docs/Web/API/ServiceWorkerGlobalScope) 的生命週期內儲存。
瀏覽器有時會終止閒置的服務工作者以節省記憶體和處理器能力，並在網路事件中建立新的服務工作者執行個體。
無論前一個執行個體的狀態為何，新執行個體都從 `NORMAL` 模式開始。

#### 最新清單雜湊值

<docs-code hideCopy language="shell">

Latest manifest hash: eea7f5f464f90789b621170af5a569d6be077e5c

</docs-code>

這是服務工作人員知道的應用程式最新版本的 SHA1 雜湊。

#### 最後更新檢查

<docs-code hideCopy language="shell">

Last update check: never

</docs-code>

這表示服務工作者最後一次檢查新版本或應用程式更新的時間。
`never` 表示服務工作者從未檢查過更新。

在此範例偵錯檔案中，更新檢查目前已排程，如下一節所述。

#### 版本

<docs-code hideCopy language="shell">

=== Version eea7f5f464f90789b621170af5a569d6be077e5c ===

Clients: 7b79a015-69af-4d3d-9ae6-95ba90c79486, 5bc08295-aaf2-42f3-a4cc-9e4ef9100f65

</docs-code>

在此範例中，服務工作者有一個快取版本的應用程式，並用於提供兩個不同的分頁。

HELPFUL：這個版本雜湊是上面所列的「最新清單雜湊」。兩個客戶端都在最新版本上。每個客戶端都由其 ID 從瀏覽器中的「客戶端」API 中列出。

#### Idle 任務佇列

<docs-code hideCopy language="shell">

=== Idle Task Queue ===
Last update tick: 1s496u
Last update run: never
Task queue:
 &ast; init post-load (update, cleanup)

</docs-code>

Idle Task Queue 是服務工作者中所有待處理背景作業的佇列。
如果佇列中有任何作業，會列出其說明。
在此範例中，服務工作者已排定一項此類作業，即涉及更新檢查和清除過期快取的初始化後運作。

最後更新時間計數器提供與閒置佇列相關的特定事件發生以來的時間。
「最後更新執行」計數器顯示閒置工作實際執行的最後時間。
「最後更新時間」顯示佇列可能被處理的最後事件以來的時間。

#### 除錯日誌

<docs-code hideCopy language="shell">

Debug log:

</docs-code>

服務工作程序內發生的錯誤會記錄在此。

### 開發人員工具

例如 Chrome 等瀏覽器提供開發人員工具，用於與服務工作者進行互動。
這些工具在妥善使用時很強大，但有幾件事要記住。

* 使用開發人員工具時，服務工作者會持續在背景執行，且從不重新啟動。
    這可能導致啟用開發人員工具時的行為與使用者可能遭遇的行為不同。

* 如果你查看快取儲存區檢視器，快取經常會過期。
    右鍵點擊快取儲存區標題並重新整理快取。

* 在服務工作者窗格中停止並開始服務工作者會檢查更新

## 服務工作程序安全性

錯誤或故障的設定可能會導致 Angular 服務工作者以意外的方式運作。
如果發生這種情況，Angular 服務工作者包含多個故障安全機制，以防管理員需要快速停用服務工作者。

### 防呆

若要停用服務工作者，請重新命名 `ngsw.json` 檔案或將其刪除。
當服務工作者對 `ngsw.json` 的請求傳回 `404` 時，服務工作者就會移除其所有快取，並解除自身的註冊，本質上是自我毀滅。

### 安全工作者

<!-- vale Angular.Google_Acronyms = NO -->

一個小型腳本 `safety-worker.js` 也包含在 `@angular/service-worker` NPM 套件中。
載入時，它會從瀏覽器中取消註冊並移除服務工作者快取。
此腳本可用作最後的手段，以擺脫已安裝在用戶端頁面上的不需要的服務工作者。

<!-- vale Angular.Google_Acronyms = YES -->

CRITICAL: 您無法直接註冊此工作人員，因為具有快取狀態的舊用戶端可能看不到安裝不同工作人員腳本的新「index.html」。

相反，您必須在您嘗試取消註冊的 Service Worker 腳本的 URL 上提供 `safety-worker.js` 的內容。您必須持續這麼做，直到您確定所有使用者都已成功取消註冊舊的工作人員。
對大多數網站而言，這表示您應該永久在舊的 Service Worker URL 上提供安全工作人員。
此腳本可用於停用 `@angular/service-worker` 並移除相應的快取。它還會移除過去可能在您的網站上提供的任何其他 Service Workers。

### 變更您的應用程式位置

IMPORTANT: Service workers 不會在重新導向後運作。
您可能已經遇到錯誤 `腳本資源位於重新導向之後，這是不允許的`。

如果您必須變更應用程式的位址，這可能會是個問題。
如果您從舊位址 (例如 `example.com`) 設定重新導向至新位址 (在此範例中為 `www.example.com`)，工作人員就會停止運作。
另外，重新導向甚至不會對從 Service Worker 完全載入網站的使用者觸發。
在 `example.com` 中註冊的舊工作人員會嘗試更新並將要求傳送至舊位址 `example.com`。此要求重新導向至新位址 `www.example.com` 並產生錯誤：`指令碼資源位於重新導向之後，這是不被允許的`。

若要補救這個問題，您可能需要使用下列其中一種技巧來停用舊工作執行緒：[故障安全](#故障安全) 或 [安全工作人員](#安全工作人員)。

## 更深入了解 Angular 服務工作者

您可能也有興趣：

<docs-pill-row>
  <docs-pill href="ecosystem/service-workers/config" title="設定檔案"/>
  <docs-pill href="ecosystem/service-workers/communications" title="與 Service Worker 溝通"/>
</docs-pill-row>
