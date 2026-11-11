# 用 Chrome DevTools 做效能分析

Angular 與 [Chrome DevTools 擴充性 API](https://developer.chrome.com/docs/devtools/performance/extension) 整合，直接在 [Chrome DevTools 效能面板](https://developer.chrome.com/docs/devtools/performance/overview) 中呈現框架專屬的資料與深入解析。

啟用這項整合後，你可以[記錄一份效能分析檔案](https://developer.chrome.com/docs/devtools/performance#record)，其中包含兩組資料：

- 標準效能項目，來自 Chrome 對你的程式碼在瀏覽器中執行情況的理解，以及
- Angular 專屬項目，由框架的執行期提供。

這兩組資料會一起呈現在同一個分頁上，但位於不同的軌道：

<img alt="Chrome DevTools 分析工具中的 Angular 自訂軌道" src="assets/images/best-practices/runtime-performance/angular-perf-in-chrome.png">

Angular 專屬資料會以框架概念（元件、變更偵測、生命週期鉤子等）來表達，同時並列瀏覽器擷取到的較低層級函式與方法呼叫。這兩組資料彼此相關聯，你可以在不同檢視與詳細程度之間切換。

你可以用 Angular 軌道更了解你的程式碼在瀏覽器中的執行情況，包括：

- 判斷某段程式碼區塊是否屬於 Angular 應用程式的一部分，還是屬於在同一頁面上執行的其他指令碼。
- 找出效能瓶頸，並把它歸因到特定的元件或服務。
- 透過每個變更偵測週期的視覺化拆解，更深入了解 Angular 的內部運作。

## 記錄效能分析檔案

### 啟用整合

你可以用兩種方式之一啟用 Angular 效能分析：

1. 在 Chrome 的主控台面板中執行 `ng.enableProfiling()`，或
1. 在你的應用程式啟動程式碼中加入對 `enableProfiling()` 的呼叫（從 `@angular/core` 匯入）。

NOTE:
Angular 效能分析只在開發模式下運作。

下面是範例，示範如何在應用程式啟動時啟用這項整合，以擷取所有可能的事件：

```ts
import { enableProfiling } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { MyApp } from './my-app';

// Turn on profiling *before* bootstrapping your application
// in order to capture all of the code run on start-up.
enableProfiling();
bootstrapApplication(MyApp);
```

### 記錄效能分析檔案 {#record-a-profile}

使用 Chrome DevTools 效能面板中的 **Record** 按鈕：

<img alt="正在記錄效能分析檔案" src="assets/images/best-practices/runtime-performance/recording-profile-in-chrome.png">

關於記錄效能分析檔案的更多細節，請參閱 [Chrome DevTools 文件](https://developer.chrome.com/docs/devtools/performance#record)。

## 解讀記錄好的效能分析檔案

你可以用「Angular」自訂軌道，快速找出並診斷效能問題。以下章節說明幾個常見的分析情境。

### 區分你的 Angular 應用程式與同一頁面上的其他工作

由於 Angular 與 Chrome 的資料呈現在不同但彼此相關聯的軌道上，你可以看出 Angular 應用程式程式碼是在何時執行，而不是其他瀏覽器處理（通常是版面配置與繪製），或在同一頁面上執行的其他指令碼（這種情況下，自訂的 Angular 軌道不會有任何資料）：

<img alt="效能分析資料：Angular 與第三方指令碼的執行情形" src="assets/images/best-practices/runtime-performance/profile-angular-vs-3rd-party.png">

這能讓你判斷後續調查應該聚焦在 Angular 應用程式程式碼，還是程式碼庫的其他部分或相依套件。

### 色彩標示

Angular 在火焰圖中使用顏色來區分工作類型：

- 🟦 藍色代表應用程式開發人員撰寫的 TypeScript 程式碼（例如服務、元件建構函式與生命週期鉤子等）。
- 🟪 紫色代表應用程式開發人員撰寫、並經 Angular 編譯器轉換過的範本程式碼。
- 🟩 綠色代表應用程式程式碼的進入點，並標示執行程式碼的_原因_。

以下範例說明上述色彩標示在各種真實記錄中的呈現方式。

#### 範例：應用程式啟動

應用程式的啟動過程通常包括：

- 以藍色標示的觸發點，例如對 `bootstrapApplication` 的呼叫、根元件的實例化，以及初始變更偵測
- 啟動期間實例化的各種 DI 服務，以綠色標示。

<img alt="效能分析資料：應用程式啟動" src="assets/images/best-practices/runtime-performance/profile-bootstrap-application.png">

#### 範例：元件執行

單一元件的處理通常表現為一個進入點（藍色），後面接著它的範本執行（紫色）。範本反過來又可能觸發指令的實例化與生命週期鉤子的執行（綠色）：

<img alt="效能分析資料：元件處理" src="assets/images/best-practices/runtime-performance/profile-component-processing.png">

#### 範例：變更偵測

一個變更偵測週期通常由一或多次資料同步傳遞（藍色）組成，每次傳遞都會走訪一部分元件。

<img alt="效能分析資料：變更偵測" src="assets/images/best-practices/runtime-performance/profile-change-detection.png">

有了這份資料視覺化，你就能立刻找出哪些元件有參與變更偵測、哪些被略過（通常是沒有被標記為 dirty 的 `OnPush` 元件）。

此外，你也可以檢視一次變更偵測的同步傳遞次數。有不止一次同步傳遞，代表狀態在變更偵測期間被更新。你應該避免這種情況，因為它會拖慢頁面更新，在最糟的情況下甚至可能導致無限迴圈。
