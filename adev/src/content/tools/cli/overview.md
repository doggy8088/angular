# Angular CLI

Angular CLI 是一個命令列介面工具，可讓您直接從命令殼層建立腳手架、開發、測試、部署和維護 Angular 應用程式。

Angular CLI 發佈在 npm 上，名稱為「`@angular/cli`」套件，其中包含名為「`ng`」的二進位檔。呼叫「`ng`」的指令使用 Angular CLI。

<docs-callout title="在沒有本地端設定的情況下嘗試 Angular">

如果您是 Angular 新手，您可能想要從 [立即體驗！](tutorials/learn-angular) 開始，它會在您可檢查和修改的現成基本線上商店應用程式的背景下介紹 Angular 的基本知識。
這個獨立教學課程利用互動式 [StackBlitz](https://stackblitz.com) 環境進行線上開發。
您不需要設定您的本地環境，直到您準備好。

</docs-callout>

<docs-card-container>
  <docs-card title="入門" link="開始使用" href="tools/cli/setup-local">
    安裝 Angular CLI 以建立並建置您的第一個應用程式。
  </docs-card>
  <docs-card title="指令參考" link="了解更多" href="cli">
    探索 CLI 指令，讓您使用 Angular 更有效率。
  </docs-card>
  <docs-card title="範本" link="了解更多" href="tools/cli/schematics">
    建立並執行範本來在您的應用程式中自動產生並修改原始檔案。
  </docs-card>
  <docs-card title="建構器" link="了解更多" href="tools/cli/cli-builder">
    建立並執行建構器，以從您的原始程式碼執行複雜的轉換，以產生建置輸出。
  </docs-card>
</docs-card-container>

## CLI 命令語言語法

Angular CLI 大致遵循 Unix/POSIX 約定來設定選項語法。

### 布林選項

布林選項有兩種形式：`--this-option` 將標記設定為 `true`，`--no-this-option` 將其設定為 `false`。
您也可以使用 `--this-option=false` 或 `--this-option=true`。
如果沒有提供任何選項，標記將保持其預設狀態，如參考文件所列。

### 陣列選項

Array 選項可以提供兩種形式：`--選項 值1 值2` 或 `--選項 值1 --選項 值2`。

### 相對路徑

指定檔案的路徑選項可以是絕對路徑，也可以是相對於目前工作目錄的路徑，通常是工作區或專案根目錄。

