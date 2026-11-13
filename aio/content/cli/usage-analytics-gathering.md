# 收集與檢視使用分析

使用者可以選擇加入，透過 [`ng analytics` CLI 命令](analytics) 與 [Google Analytics](https://support.google.com/analytics/answer/1008015?hl=en) 分享他們的 Angular CLI 使用資料。
這些資料也會與 Angular 團隊分享，用於改進 CLI。

CLI 分析資料的收集預設為停用，必須由個別使用者在專案層級啟用。
它無法在專案層級為所有使用者啟用。

以這種方式收集的資料可以在 Google Analytics 網站上檢視，但不會自動顯示在你自己組織的 Analytics 網站上。
作為 Angular 開發群組的管理員，你可以設定你的 Angular CLI 執行個體，讓你能檢視自己團隊使用 Angular CLI 的分析資料。
這個設定選項與你的使用者可能正在與 Google 分享的其他使用分析各自獨立、互不影響。

## 啟用 CLI 使用資料的存取

若要設定對你自己的使用者 CLI 使用資料的存取，請使用 `ng config` 命令，在全域 [`angular.json` 工作區設定檔](guide/workspace-config)中新增一個鍵。
這個鍵位於檔案最上層的 `cli.analyticsSharing` 之下，`projects` 區段之外。
鍵的值是你組織的追蹤 ID，由 Google Analytics 指派。
這個 ID 是一個看起來像 `UA-123456-12` 的字串。

你可以使用描述性字串作為鍵值，也可以在執行 CLI 命令時被指派一個隨機鍵。
例如，下列命令會新增一個名為 "tracking" 的設定鍵。

<code-example language="sh">
ng config --global cli.analyticsSharing.tracking UA-123456-12
</code-example>

若要關閉此功能，請執行下列命令：

<code-example language="sh">
ng config --global --remove cli.analyticsSharing
</code-example>

## 逐使用者追蹤

你可以在全域設定中新增自訂使用者 ID，以便識別命令與旗標的個別使用情況。
如果該使用者為自己的專案啟用了 CLI 分析，你的分析顯示就會追蹤並標記他們的個別使用情況。

<code-example language="sh">
ng config --global cli.analyticsSharing.user SOME_USER_NAME
</code-example>

若要產生新的隨機使用者 ID，請執行下列命令：

<code-example language="sh">
ng config --global cli.analyticsSharing.user ""
</code-example>
