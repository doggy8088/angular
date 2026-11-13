# 收集使用指標
你可以允許 Angular 團隊將命令列命令的使用統計資料傳送給 Google，協助 Angular
團隊排定功能與改進的優先順序。除非你在安裝或升級 Angular CLI 時明確選擇加入，否則 Angular 團隊不會收集
使用統計資料。

## 收集哪些內容？
使用分析包括每次執行所用的命令與選定的旗標。使用分析可能
包括下列資訊：

- 你的作業系統（Mac、Linux 發行版、Windows）及其版本。
- CPU 數量、RAM 總量。
- Node 與 Angular CLI 版本（僅本機版本）。
- 每個命令初始化與執行所花的時間。
- 所執行的命令名稱。
- 對於 Schematics 命令（add、generate、new 與 update），包括選定的旗標清單。
- 對於建置命令（build、serve），包括 bundle 的數量與大小（初始與延遲載入）、
  編譯單元、建置與重新建置所花的時間，以及基本的 Angular 專屬
  API 使用情況。
- 例外狀況的錯誤碼與當機資料。不會收集堆疊追蹤。

只有 Angular 擁有與開發的 schematics 與建置器會回報。第三方 schematics 與
建置器不會將資料傳送給 Angular 團隊。

## 選擇加入
安裝 Angular CLI 或升級現有版本時，系統會提示你是否允許全域
收集使用統計資料。如果你說不或略過提示，就不會收集任何資料。

從第 8 版開始，我們在 CLI 中加入了 `analytics` 命令。你可以隨時使用這個命令變更你的選擇加入
決定。

### 停用使用分析
若要停用分析收集，請執行下列命令：

```bash
# Disable all usage analytics.
ng analytics off
```

### 啟用使用分析
若要啟用使用分析，請執行下列命令：

```bash
# Enable all usage analytics.
ng analytics on
```

### 再次提示
若要再次向使用者提示使用分析，請執行下列命令：

```bash
# Prompt for all usage analytics.
ng analytics prompt
```
