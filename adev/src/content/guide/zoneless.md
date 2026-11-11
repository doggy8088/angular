# 不使用 ZoneJS 的 Angular（Zoneless）

## 為什麼要使用 Zoneless？

移除 ZoneJS 作為相依性的主要優點如下：

- **效能更佳**：ZoneJS 以 DOM 事件與非同步工作作為應用程式狀態_可能_已更新的訊號，隨後觸發應用程式同步，對應用程式的檢視執行變更偵測。ZoneJS 無從得知應用程式狀態是否真的改變，因此這種同步被觸發的頻率比實際需要的更高。
- **Core Web Vitals 更佳**：ZoneJS 帶來相當可觀的負擔，包括酬載大小與啟動時間。
- **除錯體驗更佳**：ZoneJS 讓程式碼更難除錯。有 ZoneJS 時，堆疊追蹤更難理解。當程式碼因為位在 Angular Zone 之外而出錯時，也很難理解原因。
- **生態系相容性更佳**：ZoneJS 的運作方式是修補瀏覽器 API，但它不會自動為每個新的瀏覽器 API 提供修補。有些 API，例如 `async`/`await`，無法被有效修補，必須降級才能配合 ZoneJS 使用。有時生態系中的函式庫也與 ZoneJS 修補原生 API 的方式不相容。移除 ZoneJS 作為相依性，可以消除一項複雜度、猴子修補與持續維護的來源，確保更長期的相容性。

## 在應用程式中啟用 Zoneless

啟用 Zoneless 的 API 目前仍為實驗性質。其形式與底層行為都不穩定，可能在修訂版本中變更。目前已知存在一些功能缺口，包括缺少一個易於使用的 API，以防止應用程式在使用伺服器端渲染（Server Side Rendering）時過早序列化。

```typescript
// standalone bootstrap
bootstrapApplication(MyApp, {providers: [
  provideExperimentalZonelessChangeDetection(),
]});

// NgModule bootstrap
platformBrowser().bootstrapModule(AppModule);
@NgModule({
  providers: [provideExperimentalZonelessChangeDetection()]
})
export class AppModule {}
```

## 移除 ZoneJS

Zoneless 應用程式應將 ZoneJS 完全從建置中移除，以縮小套件大小。ZoneJS 通常透過 `angular.json` 中的 `polyfills` 選項載入，包含 `build` 與 `test` 兩個目標。將 `zone.js` 與 `zone.js/testing` 從兩者中移除，就能將它從建置中移除。使用明確 `polyfills.ts` 檔案的專案，應從檔案中移除 `import 'zone.js';` 與 `import 'zone.js/testing';`。

將 ZoneJS 從建置中移除後，也不再需要 `zone.js` 相依性，可以將該套件完全移除：

```shell
npm uninstall zone.js
```

## Zoneless 相容性的要求 {#requirements-for-zoneless-compatibility}

Angular 仰賴核心 API 的通知，來判斷何時執行變更偵測，以及對哪些檢視執行。
這些通知包括：

- `ChangeDetectorRef.markForCheck`（由 `AsyncPipe` 自動呼叫）
- `ComponentRef.setInput`
- 更新在範本中讀取的訊號
- 繫結的宿主或範本監聽器回呼
- 附加一個被上述任一機制標記為已變更的檢視

### 與 `OnPush` 相容的元件

確保元件使用上述正確通知機制的其中一種方法，就是使用 [ChangeDetectionStrategy.OnPush](/best-practices/skipping-subtrees#using-onpush)。

`OnPush` 變更偵測策略不是必要的，但對於應用程式元件來說，是邁向 zoneless 相容性的建議步驟。函式庫元件並非總是能使用 `ChangeDetectionStrategy.OnPush`。
當函式庫元件是使用者元件的宿主，而該使用者元件可能使用 `ChangeDetectionStrategy.Default` 時，它不能使用 `OnPush`，因為那會讓子元件在不具備 `OnPush` 相容性、且仰賴 ZoneJS 觸發變更偵測時，無法被重新整理。元件可以使用 `Default` 策略，前提是它們在需要執行變更偵測時通知 Angular（呼叫 `markForCheck`、使用訊號、`AsyncPipe` 等）。
作為使用者元件的宿主，指的是使用像 `ViewContainerRef.createComponent` 這樣的 API，而不是僅僅承載使用者元件範本的一部分（也就是內容投影，或使用範本參照輸入）。

### 移除 `NgZone.onMicrotaskEmpty`、`NgZone.onUnstable`、`NgZone.isStable` 或 `NgZone.onStable`

應用程式與函式庫需要移除對 `NgZone.onMicrotaskEmpty`、`NgZone.onUnstable` 與 `NgZone.onStable` 的使用。
當應用程式啟用 zoneless 變更偵測時，這些 observable 永遠不會發出值。
同樣地，`NgZone.isStable` 永遠會是 `true`，不應作為程式碼執行的條件。

`NgZone.onMicrotaskEmpty` 與 `NgZone.onStable` observable 最常用來等待 Angular 在執行某項工作前完成變更偵測。取而代之的做法是：如果需要等待單次變更偵測，可以換成 `afterNextRender`；如果某個條件可能橫跨數輪變更偵測，可以換成 `afterRender`。在其他情況下，這些 observable 被使用，只是因為它們剛好熟悉、且時機與所需相近。此時可以改用更直接的 DOM API，例如當程式碼需要等待特定的 DOM 狀態時（而不是透過 Angular 的渲染鉤子間接等待），可以使用 `MutationObserver`。

<docs-callout title="NgZone.run 與 NgZone.runOutsideAngular 與 Zoneless 相容">
為了讓程式碼與 Zoneless 應用程式相容，`NgZone.run` 與 `NgZone.runOutsideAngular` 不需要移除。事實上，移除這些呼叫可能會讓那些用在仍仰賴 ZoneJS 的應用程式中的函式庫，出現效能退化的情形。
</docs-callout>

### 用於伺服器端渲染（SSR）的 `PendingTasks` {#pendingtasks-for-server-side-rendering-ssr}

如果你在 Angular 中使用 SSR，你可能知道它仰賴 ZoneJS 來協助判斷應用程式何時「穩定」、可以被序列化。如果有非同步工作應該阻止序列化，不使用 ZoneJS 的應用程式必須透過 [PendingTasks](/api/core/PendingTasks) 服務讓 Angular 知道這些工作。序列化會等待所有待處理工作都被移除的第一個時刻。


待處理工作最直接的兩種使用方式是 `run` 方法：

```typescript
const taskService = inject(PendingTasks);
taskService.run(async () => {
  const someResult = await doSomeWorkThatNeedsToBeRendered();
  this.someState.set(someResult);
});
```

對於更複雜的使用情境，你可以手動加入與移除待處理工作：

```typescript
const taskService = inject(PendingTasks);
const taskCleanup = taskService.add();
try {
  await doSomeWorkThatNeedsToBeRendered();
} catch {
  // handle error
} finally {
  taskCleanup();
}
```

此外，`rxjs-interop` 中的 [pendingUntilEvent](/api/core/rxjs-interop/pendingUntilEvent#) 輔助函式，能確保應用程式在 observable 發出值、完成、發生錯誤或被取消訂閱之前，一直保持不穩定。

```typescript
readonly myObservableState = someObservable.pipe(pendingUntilEvent());
```

框架內部也使用這個服務，來防止序列化在非同步工作完成之前進行。這些工作包括但不限於：正在進行的 Router 導航，以及尚未完成的 `HttpClient` 請求。

## 測試與除錯

### 在 `TestBed` 中使用 Zoneless {#using-zoneless-in-testbed}

zoneless 的 provider 函式也可以用於 `TestBed`，協助確保受測元件與 Zoneless 的 Angular 應用程式相容。

```typescript
TestBed.configureTestingModule({
  providers: [provideExperimentalZonelessChangeDetection()]
});

const fixture = TestBed.createComponent(MyComponent);
await fixture.whenStable();
```

為了確保測試的行為與正式環境程式碼盡可能相似，請盡可能避免使用 `fixture.detectChanges()`。這會強制執行變更偵測，而在當時 Angular 可能原本並沒有排程變更偵測。測試應該確保這些通知有在發生，並讓 Angular 處理何時同步狀態，而不是在測試中手動強制它發生。

對於既有的測試套件來說，使用 `fixture.detectChanges()` 是常見的模式，可能不值得花力氣把這些改成 `await fixture.whenStable()`。`TestBed` 仍會強制要求 fixture 的元件與 `OnPush` 相容，且若它發現範本值在沒有變更通知的情況下被更新（也就是 `fixture.componentInstance.someValue = 'newValue';`），會擲出 `ExpressionChangedAfterItHasBeenCheckedError`。
如果該元件用在正式環境中，應該透過將元件改為使用訊號管理狀態，或呼叫 `ChangeDetectorRef.markForCheck()` 來解決這個問題。
如果該元件僅作為測試包裝器使用、從不用在應用程式中，那麼使用 `fixture.changeDetectorRef.markForCheck()` 是可以接受的。

### 以除錯模式檢查確保更新被偵測到

Angular 還提供了一個額外工具，協助驗證應用程式是否以符合 zoneless 相容性的方式更新狀態。`provideExperimentalCheckNoChangesForDebug` 可以用來定期檢查，確保沒有繫結在未通知的情況下被更新。如果有已更新但不會被 zoneless 變更偵測重新整理的繫結，Angular 會擲出 `ExpressionChangedAfterItHasBeenCheckedError`。
