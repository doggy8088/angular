
# 持續性磁碟快取

Angular CLI 預設會將一些可快取的操作儲存到磁碟上。

當你重新執行相同的建置時，建置系統會還原上一次建置的狀態並重用先前執行過的操作，從而減少建置和測試你的應用程式與函式庫所需的時間。

若要修改預設的快取設定，請將 `cli.cache` 物件加入你的[工作區設定](guide/workspace-config)。
該物件位於檔案最上層的 `cli.cache`，在 `projects` 區段之外。

<code-example format="json" language="json">

{
  "$schema": "./node_modules/&commat;angular/cli/lib/config/schema.json",
  "version": 1,
  "cli": {
    "cache": {
      ...
    }
  },
  "projects": {}
}

</code-example>

更多資訊請參閱[快取選項](guide/workspace-config#cache-options)。

### 啟用和停用快取

快取預設為啟用。
若要停用快取，請執行以下命令：

<code-example format="shell" language="shell">

ng config cli.cache.enabled false

</code-example>

若要重新啟用快取，請將 `cli.cache.enabled` 設為 `true`。

### 快取環境

預設情況下，磁碟快取僅在本地環境中啟用。

若要在所有環境中啟用快取，請執行以下命令：

<code-example format="shell" language="shell">

ng config cli.cache.environment all

</code-example>

更多資訊請參閱[快取選項](guide/workspace-config#cache-options)中的 `environment`。

<div class="alert is-helpful">

Angular CLI 會檢查 `CI` 環境變數是否存在及其值，以判斷它正在哪個環境中執行。

</div>

### 快取路徑

預設使用 `.angular/cache` 作為儲存快取結果的基礎目錄。
若要更改此路徑，請執行以下命令：

<code-example format="shell" language="shell">

ng config cli.cache.path ".cache/ng"

</code-example>

### 清除快取

若要清除快取，請執行下列命令之一。

若要在 Unix 類作業系統上清除快取：

<code-example format="shell" language="shell">

rm -rf .angular/cache

</code-example>

若要在 Windows 上清除快取：

<code-example format="shell" language="shell">

rmdir /s /q .angular\cache

</code-example>

更多資訊請參閱 [rm 命令](https://man7.org/linux/man-pages/man1/rm.1.html) 和 [rmdir 命令](https://docs.microsoft.com/windows-server/administration/windows-commands/rmdir)。
