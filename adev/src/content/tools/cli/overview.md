# Angular CLI

Angular CLI 是一套命令列介面工具，可讓你直接在命令列中為 Angular 應用程式建立骨架、進行開發、測試、部署與維護。

Angular CLI 以 `@angular/cli` 套件的形式發佈在 npm 上，並包含名為 `ng` 的執行檔。凡是呼叫 `ng` 的指令，都是在使用 Angular CLI。

<docs-callout title="免本機設定，立即試用 Angular">

如果你是 Angular 新手，建議從[立即試用！](tutorials/learn-angular)開始；它會透過一個現成的簡易線上商店應用程式，引導你認識 Angular 的核心概念，讓你動手檢視與修改。
這個獨立教學運用互動式的 [StackBlitz](https://stackblitz.com) 線上開發環境。
在你準備好之前，不需要先設定本機環境。

</docs-callout>

<docs-card-container>
  <docs-card title="快速入門" link="開始使用" href="tools/cli/setup-local">
    安裝 Angular CLI，建立並建置你的第一個應用程式。
  </docs-card>
  <docs-card title="指令參考" link="深入瞭解" href="cli">
    探索 CLI 指令，讓你使用 Angular 開發時更有效率。
  </docs-card>
  <docs-card title="原理圖" link="深入瞭解" href="tools/cli/schematics">
    建立並執行原理圖，自動產生與修改應用程式中的原始碼檔案。
  </docs-card>
  <docs-card title="建置器" link="深入瞭解" href="tools/cli/cli-builder">
    建立並執行建置器，對原始碼進行複雜轉換，產生建置輸出。
  </docs-card>
</docs-card-container>

## CLI 指令語法

Angular CLI 的選項語法大致遵循 Unix/POSIX 慣例。

### 布林選項

布林選項有兩種形式：`--this-option` 將旗標設為 `true`，`--no-this-option` 則設為 `false`。
你也可以使用 `--this-option=false` 或 `--this-option=true`。
若兩者都未提供，旗標會維持參考文件所列的預設狀態。

### 陣列選項

陣列選項有兩種提供方式：`--option value1 value2` 或 `--option value1 --option value2`。

### 相對路徑

用來指定檔案的選項可以給絕對路徑，或給相對於目前工作目錄的路徑；目前工作目錄通常是工作區或專案的根目錄。
