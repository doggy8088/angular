# 測試

測試你的 Angular 應用程式能幫助你確認你的應用程式是否如預期運作。

## 設定測試 {#set-up-testing}

Angular CLI 會下載並安裝使用 [Jasmine 測試框架](https://jasmine.github.io) 測試 Angular 應用程式所需的一切。

你用 CLI 建立的專案立即就能進行測試。
只要執行 [`ng test`](cli/test) CLI 指令：

<docs-code language="shell">

ng test

</docs-code>

`ng test` 指令以_監看模式_建置應用程式，
並啟動 [Karma 測試執行器](https://karma-runner.github.io)。

主控台輸出看起來像下面這樣：

<docs-code language="shell">

02 11 2022 09:08:28.605:INFO [karma-server]: Karma v6.4.1 server started at http://localhost:9876/
02 11 2022 09:08:28.607:INFO [launcher]: Launching browsers Chrome with concurrency unlimited
02 11 2022 09:08:28.620:INFO [launcher]: Starting browser Chrome
02 11 2022 09:08:31.312:INFO [Chrome]: Connected on socket -LaEYvD2R7MdcS0-AAAB with id 31534482
Chrome: Executed 3 of 3 SUCCESS (0.193 secs / 0.172 secs)
TOTAL: 3 SUCCESS

</docs-code>

日誌的最後一行顯示，Karma 執行了三個測試，全部通過。

測試輸出會透過 [Karma Jasmine HTML Reporter](https://github.com/dfederm/karma-jasmine-html-reporter) 顯示在瀏覽器中。

<img alt="Jasmine HTML Reporter in the browser" src="assets/images/guide/testing/initial-jasmine-html-reporter.png">

點選某個測試列可以只重新執行該測試，或點選某個描述，以重新執行所選測試群組（「test suite」）中的測試。

同時，`ng test` 指令正在監看變更。

若要實際看看這個效果，對 `app.component.ts` 做一點小變更並儲存。
測試會再次執行，瀏覽器會重新整理，新的測試結果就會出現。

## 設定 {#configuration}

Angular CLI 會為你處理 Jasmine 與 Karma 的設定。它會根據 `angular.json` 檔案中指定的選項，在記憶體中建構完整的設定。

如果你想自訂 Karma，你可以執行下列指令來建立一個 `karma.conf.js`：

<docs-code language="shell">

ng generate config karma

</docs-code>

HELPFUL: 在 [Karma 設定指南](http://karma-runner.github.io/6.4/config/configuration-file.html)中，閱讀更多關於 Karma 設定的資訊。

### 其他測試框架

你也可以使用其他測試函式庫與測試執行器來單元測試 Angular 應用程式。
每個函式庫與執行器都有自己獨特的安裝程序、設定與語法。

### 測試檔案名稱與位置

在 `src/app` 資料夾內，Angular CLI 為 `AppComponent` 產生了一個名為 `app.component.spec.ts` 的測試檔案。

IMPORTANT: 測試檔案的副檔名**必須是 `.spec.ts`** 才行，工具才能將它識別為帶有測試的檔案（也稱為 _spec_ 檔案）。

`app.component.ts` 與 `app.component.spec.ts` 檔案是同一個資料夾中的同層檔案。
兩個檔案的根檔案名稱（`app.component`）相同。

在你自己的專案中，對_每一種_測試檔案都採用這兩個慣例。

#### 將你的 spec 檔案放在它所測試的檔案旁邊

把單元測試 spec 檔案放在與它們所測試的應用程式原始碼檔案相同的資料夾中，是個好主意：

- 這類測試很容易找到
- 你可以一眼看出應用程式的哪個部分缺少測試
- 附近的測試可以揭示某個部分在上下文中如何運作
- 當你移動原始碼（無可避免）時，你會記得要移動測試
- 當你重新命名原始碼檔案（無可避免）時，你會記得要重新命名測試檔案

#### 將你的 spec 檔案放在 test 資料夾中

應用程式整合 spec 可以測試分散在多個資料夾與模組中的多個部分的互動。
它們並不真正屬於任何特定部分，所以在任何單一檔案旁邊都沒有自然的歸屬。

通常，為它們在 `tests` 目錄中建立一個適當的資料夾會更好。

當然，測試那些測試輔助函式的 spec 屬於 `test` 資料夾，
就在它們對應的輔助檔案旁邊。

## 在持續整合中測試

讓你的專案保持無錯誤狀態的最好方法之一，就是透過測試套件，但你可能不會一直記得要執行測試。

持續整合（CI）伺服器讓你可以設定專案儲存庫，讓你的測試在每次提交與提取請求時執行。

若要在持續整合（CI）中測試你的 Angular CLI 應用程式，請執行下列指令：

<docs-code language="shell">
ng test --no-watch --no-progress --browsers=ChromeHeadless
</docs-code>

## 更多測試資訊

在你為你的應用程式設定好測試之後，你可能會覺得下列測試指南很有用。

|                                                                    | 詳細資訊                                                                           |
| :----------------------------------------------------------------- | :-------------------------------------------------------------------------------- |
| [程式碼覆蓋率](guide/testing/code-coverage)                       | 你的測試覆蓋了應用程式的多少部分，以及如何指定要求的數量。 |
| [測試服務](guide/testing/services)                         | 如何測試你的應用程式使用的服務。                                   |
| [測試元件的基礎知識](guide/testing/components-basics)    | 測試 Angular 元件的基礎知識。                                             |
| [元件測試情境](guide/testing/components-scenarios)  | 各種元件測試情境與使用案例。                                               |
| [測試屬性指令](guide/testing/attribute-directives) | 如何測試你的屬性指令。                                            |
| [測試管道](guide/testing/pipes)                               | 如何測試管道。                                                                |
| [為測試除錯](guide/testing/debugging)                         | 常見的測試錯誤。                                                              |
| [測試工具 API](guide/testing/utility-apis)                 | Angular 測試功能。                                                         |
