# 測試

測試您的 Angular 應用程式可幫助您檢查應用程式是否如您預期般運作。

## 測試設定

Angular CLI 下載並安裝您使用 [Jasmine 測試架構](https://jasmine.github.io) 測試 Angular 應用程式所需的一切。

使用 CLI 建立的專案可立即測試。
只要執行 [`ng test`](cli/test) CLI 命令：

<docs-code language="shell">

ng test

</docs-code>

`ng test` 指令會在 *監控模式* 下建置應用程式，
並啟動 [Karma 測試執行器](https://karma-runner.github.io)。

控制台輸出如下：

<docs-code language="shell">

02 11 2022 09:08:28.605:INFO [karma-server]: Karma v6.4.1 server started at http://localhost:9876/
02 11 2022 09:08:28.607:INFO [launcher]: Launching browsers Chrome with concurrency unlimited
02 11 2022 09:08:28.620:INFO [launcher]: Starting browser Chrome
02 11 2022 09:08:31.312:INFO [Chrome]: Connected on socket -LaEYvD2R7MdcS0-AAAB with id 31534482
Chrome: Executed 3 of 3 SUCCESS (0.193 secs / 0.172 secs)
TOTAL: 3 SUCCESS

</docs-code>

日誌的最後一行顯示 Karma 跑了三個測試且全部通過。

測試輸出使用 [Karma Jasmine HTML Reporter](https://github.com/dfederm/karma-jasmine-html-reporter) 顯示在瀏覽器中。

<img alt="Jasmine HTML Reporter 在瀏覽器中" src="assets/content/images/guide/testing/initial-jasmine-html-reporter.png">

點擊測試列可重新執行該測試，或點擊說明可重新執行選取測試群組（「測試套件」）中的測試。

同時，`ng test` 命令正在監看變更。

若要查看此操作，請對 `app.component.ts` 進行小小的變更，然後儲存。
測試會再次執行，瀏覽器會重新整理，然後顯示新的測試結果。

## 配置

Angular CLI 為您處理 Jasmine 和 Karma 配置。它根據 `angular.json` 檔案中指定的選項在記憶體中建構完整配置。

如果你想要自訂 Karma，你可以透過執行下列指令來建立一個 `karma.conf.js`：

<docs-code language="shell">

ng generate config karma

</docs-code>

HELPFUL：在 [Karma 組態指南](http://karma-runner.github.io/6.4/config/configuration-file.html) 中閱讀有關 Karma 組態的更多資訊)。

### 其他測試框架

您也可以使用其他測試庫和測試運行器對 Angular 應用程式進行單元測試。
每個庫和運行器都有其獨特的安裝程序、配置和語法。

### 測試檔案名稱和位置

在 `src/app` 資料夾中，Angular CLI 為 `AppComponent` 產生了一個名為 `app.component.spec.ts` 的測試檔案。

重要：測試檔案副檔名**必須是`.spec.ts`**，這樣工具才能識別它是包含測試的檔案（也稱為*規範*檔案）。

`app.component.ts` 和 `app.component.spec.ts` 檔案位於同一個資料夾中，是兄弟檔案。
根檔案名稱 \(`app.component`\) 對這兩個檔案而言都是相同的。

在您自己的專案中，對*各類*測試檔案採用這兩種慣例。

#### 將您的規範檔案放在它要測試的檔案旁邊

將單元測試規格檔案放在與他們測試的應用程式原始碼檔案相同的資料夾中，是一個好主意：

* 這些測試很容易找到
* 您可以一目了然地看出您的應用程式是否有部分缺乏測試
* 附近的測試可以揭示部分如何在上下文中運作
* 當您移動來源 \(不可避免的\)，您記得移動測試
* 當您重新命名來源檔案 \(不可避免的\)，您記得重新命名測試檔案

#### 將您的規範檔案放在測試資料夾中

應用程式整合規範可以測試多個部分的互動
分佈在多個資料夾和模組中。
它們不真的屬於任何特定部分，所以它們在任何一個檔案旁邊都沒有自然的家。

通常最好在 `tests` 目錄中為它們建立一個合適的資料夾。

當然，測試測試輔助工具的規範應屬於 `test` 資料夾，位於它們對應的輔助工具檔案旁邊。

## 持續整合中的測試

保持專案沒有錯誤的最佳方法之一是透過測試套件，但你可能常常忘記執行測試。

持續整合 \(CI\) 伺服器讓你可以設定專案存放庫，讓你的測試在每次提交和拉取請求時執行。

要測試您的 Angular CLI 應用程式在持續整合 \(CI\) 中，請執行以下指令：

<docs-code language="shell">
ng test --no-watch --no-progress --browsers=ChromeHeadless
</docs-code>

## 更多測試資訊

設定好你的應用程式進行測試後，你可能會發現下列測試指南很有用。

|                                                                    | 詳細資料 |
|:---                                                                |:---     |
| [程式碼覆蓋率](guide/testing/code-coverage)                       | 您的測試覆蓋多少應用程式，以及如何指定必要的數量。 |
| [測試服務](guide/testing/services)                         | 如何測試您的應用程式使用的服務。                                   |
| [測試元件基礎知識](guide/testing/components-basics)    | 測試 Angular 元件的基礎知識。                                             |
| [元件測試情境](guide/testing/components-scenarios)  | 各種元件測試情境和用例。                       |
| [測試屬性指令](guide/testing/attribute-directives) | 如何測試您的屬性指令。                                            |
| [測試管道](guide/testing/pipes)                               | 如何測試管道。                                                                |
| [偵錯測試](guide/testing/debugging)                            | 常見的測試錯誤。                                                              |
| [測試實用程式 API](guide/testing/utility-apis)                 | Angular 測試功能。                                                         |

