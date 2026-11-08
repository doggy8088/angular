# Angular 中未處理的錯誤

Angular 應用程式執行時，你的部分程式碼可能會拋出錯誤。若放任不管，這些錯誤可能導致預期外的行為與沒有反應的 UI。本指南說明 Angular 如何處理應用程式程式碼沒有明確攔截的錯誤。至於如何在應用程式中撰寫自己的錯誤處理邏輯，請參考 JavaScript 與 Angular 的錯誤處理最佳實務。

Angular 錯誤處理策略有一項基本原則：只要做得到，錯誤就應該在呼叫端呈現給開發人員。這種做法能確保發起操作的程式碼握有理解錯誤所需的上下文，能妥善處理錯誤，並決定應用程式應該處於什麼狀態。讓錯誤在源頭就看得見，開發人員便能針對失敗的操作實作專屬的錯誤處理，並取得復原或向最終使用者提供有用回饋所需的相關資訊。這也有助於避免「過度籠統的錯誤」這種壞味道，也就是錯誤回報時沒有足夠上下文，讓人無從理解成因。

舉例來說，假設有一個元件向 API 取得使用者資料。負責呼叫 API 的程式碼就應該包含錯誤處理（例如使用 `try...catch` 區塊，或 RxJS 的 `catchError` 運算子），來應付潛在的網路問題或 API 回傳的錯誤。這樣元件就能顯示對使用者友善的錯誤訊息，或重試請求，而不是讓錯誤在未處理的情況下向外傳播。

## 未處理的錯誤會回報給 `ErrorHandler`

Angular 會把未處理的錯誤回報給應用程式根層級的 `ErrorHandler`。提供自訂 `ErrorHandler` 時，請在呼叫 `bootstrapApplication` 的同時，把它放進你的 `ApplicationConfig`。

建置 Angular 應用程式時，你寫的程式碼常常是_由_框架自動呼叫的。例如，當元件出現在範本中時，Angular 負責呼叫元件的建構函式與生命週期方法。當框架執行你的程式碼時，你沒有合理的位置能加上 `try` 區塊來優雅地處理錯誤。遇到這種情況，Angular 會攔截錯誤並送給 `ErrorHandler`。

對於你的程式碼直接呼叫的 API 內部所發生的錯誤，Angular _不會_攔截。例如，若某個服務的方法會拋出錯誤，而你在元件中呼叫該方法，Angular 不會自動攔截那個錯誤。你必須自行用 `try...catch` 之類的機制處理。

Angular 只在下列情況下，才會攔截來自使用者 promise 或 observable 的_非同步_錯誤：

- 有明確的契約，要求 Angular 等待非同步操作的結果並加以使用，而且
- 錯誤沒有呈現在回傳值或狀態中。

例如，`AsyncPipe` 與 `PendingTasks.run` 會把錯誤轉送給 `ErrorHandler`，而 `resource` 則是把錯誤呈現在 `status` 與 `error` 屬性中。

Angular 回報給 `ErrorHandler` 的錯誤，是_預期外_的錯誤。這些錯誤可能無法復原，或表示應用程式的狀態已經損壞。只要做得到，應用程式就應該在錯誤發生的地方用 `try` 區塊或適當的錯誤處理運算子（例如 RxJS 的 `catchError`）提供錯誤處理，而不是仰賴 `ErrorHandler`；`ErrorHandler` 最常見也最恰當的用途，只是把可能致命的錯誤回報給錯誤追蹤與記錄基礎設施的一種機制。

```ts
export class GlobalErrorHandler implements ErrorHandler {
  private readonly analyticsService = inject(AnalyticsService);
  private readonly router = inject(Router);

  handleError(error: any) {
    const url = this.router.url;
    const errorMessage = error?.message ?? 'unknown';

    this.analyticsService.trackEvent({
      eventName: 'exception',
      description: `Screen: ${url} | ${errorMessage}`,
    });

    console.error(GlobalErrorHandler.name, {error});
  }
}
```

### `TestBed` 預設會重新拋出錯誤

在許多情況下，`ErrorHandler` 可能只記錄錯誤，然後讓應用程式繼續執行。但在測試中，你幾乎總是希望這些錯誤被呈現出來。Angular 的 `TestBed` 會重新拋出預期外的錯誤，確保框架攔截到的錯誤不會被不小心漏掉或忽略。在少數情況下，測試可能特別想要確認錯誤不會造成應用程式沒有反應或當機。遇到這種情況，你可以[把 `TestBed` 設定為_不要_重新拋出應用程式錯誤](api/core/testing/TestModuleMetadata#rethrowApplicationErrors)，寫法是 `TestBed.configureTestingModule({rethrowApplicationErrors: false})`。

### 應用程式還在啟動時拋出的錯誤

有一個短暫的時刻，Angular 還無法把錯誤送給你的 `ErrorHandler`：也就是它還在建立應用程式根模組或根元件的時候。Angular 需要先有那個根實例存在，才能查到你提供的 `ErrorHandler`，所以在此之前拋出的錯誤就無處可去。它會表現得像一般的未攔截錯誤，而不是透過 `ErrorHandler` 回報。

你最可能在 [Angular elements](guide/elements) 遇到這種情況。若你在定義自訂元素時，它的標籤已經出現在頁面上，瀏覽器會立刻升級它，並在這段早期啟動工作中執行元件的建構函式與 `ngOnInit`。在那裡拋出的任何錯誤都可能遺失。

若你遇到這種情況，請把會拋出錯誤的程式碼移到應用程式啟動完成之後再執行，例如：

- 把它包進 `setTimeout(() => /* your code */)`，讓它在自己的回合執行，而不是在啟動期間執行。
- 把它提供為 `APP_BOOTSTRAP_LISTENER`，而不是從建構函式執行。
- 在 `ngDoBootstrap` 中定義你的自訂元素，而不是在根模組的建構函式中定義。

開啟 `provideBrowserGlobalErrorListeners()`（見下方）也能協助攔截這些錯誤，因為它們仍會以未攔截錯誤的形式抵達瀏覽器。

## 全域錯誤監聽器

既沒有被應用程式程式碼攔截、也沒有被框架應用程式實例攔截的錯誤，可能會抵達全域範疇。若沒有加以處理，抵達全域範疇的錯誤可能帶來非預期的後果。在非瀏覽器環境中，它們可能造成行程當機。在瀏覽器中，這些錯誤可能沒有被回報，而網站訪客會在瀏覽器主控台看到這些錯誤。Angular 為這兩種環境都提供了全域監聽器，來因應這些問題。

### 用戶端渲染

把 [`provideBrowserGlobalErrorListeners()`](/api/core/provideBrowserGlobalErrorListeners) 加入 [ApplicationConfig](guide/di/defining-dependency-providers#application-bootstrap)，就會為瀏覽器視窗加上 `'error'` 與 `'unhandledrejection'` 監聽器，並把這些錯誤轉送給 `ErrorHandler`。Angular CLI 產生新應用程式時，預設就包含這個提供者。Angular 團隊建議大多數應用程式都處理這些全域錯誤，無論是用框架內建的監聽器，還是用你自己的自訂監聽器。若你提供自訂監聽器，就可以移除 `provideBrowserGlobalErrorListeners`。

### 伺服器端與混合式渲染

使用 [Angular with SSR](guide/ssr) 時，Angular 會自動為伺服器行程加上 `'unhandledRejection'` 與 `'uncaughtException'` 監聽器。這些處理常式能防止伺服器當機，改把攔截到的錯誤記錄到主控台。

IMPORTANT: 若應用程式使用 Zone.js，只會加入 `'unhandledRejection'` 處理常式。當 Zone.js 存在時，應用程式 Zone 內的錯誤已經會轉送給應用程式的 `ErrorHandler`，不會抵達伺服器行程。
