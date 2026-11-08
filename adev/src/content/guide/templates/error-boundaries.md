# 使用 `@boundary` 的錯誤邊界

IMPORTANT: `@boundary` 目前處於[開發者預覽](reference/releases#developer-preview)階段。

Angular 範本支援錯誤邊界，能妥善處理在算繪與變更偵測期間發生的執行階段錯誤。

錯誤邊界可以避免單一元件的失敗拖垮整個應用程式，並提供向使用者顯示備援 UI 的方式。

## 以 `@boundary` 與 `@error` 捕捉錯誤

`@boundary` 區塊會包住範本中的一個區段。如果這個邊界內的任何元件或指令在初始化或變更偵測期間擲出錯誤，框架會捕捉該錯誤，並改為算繪 `@error` 區塊。

```angular-html
@boundary {
  <app-risky-component />
} @error {
  <p>Something went wrong!</p>
}
```

## 存取錯誤物件

你可以透過隱含的 `$error` 變數存取被捕捉到的錯誤：

```angular-html
@boundary {
  <app-risky-component />
} @error {
  <p>Error occurred: {{ $error.message }}</p>
}
```

## 重設邊界

你可以在 `@error` 區塊中呼叫隱含的 `$reset` 函式，嘗試重新算繪 `@boundary` 的內容。呼叫後，它會重設邊界狀態，並再次嘗試算繪原始內容。

```angular-html
@boundary {
  <app-flaky-component />
} @error {
  <p>Loading failed.</p>
  <button (click)="$reset()">Try again</button>
}
```

## 以 `when` 進行條件式錯誤處理

你可以使用 `when` 子句，依條件處理特定類型的錯誤，為不同的錯誤提供不同的備援 UI。Angular 會在捕捉到錯誤時評估這個條件。

```angular-html
@boundary {
  <app-chart-dashboard />
} @error (let err; reset = $reset; when isRenderError(err)) {
  <p>Network issue. Check your connection.</p>
  <button (click)="reset()">Retry</button>
} @error {
  <p>An unexpected error occurred: {{ $error.message }}</p>
}
```

請將你的 `@error` 區塊從最具體排到最不具體，因為 Angular 會依序評估 `when` 子句，並使用第一個評估為 true 的子句。最後一個沒有 `when` 子句的 `@error` 區塊，會作為全捕捉的備援。

## 與全域錯誤處理常式的整合

當邊界捕捉到錯誤時，Angular 仍可通知全域的 `ErrorHandler`。你可以在自訂的 `ErrorHandler` 中實作選擇性的 `onViewError` 鉤子，將這些被捕捉到的錯誤記錄到你的錯誤追蹤服務。

```ts
@Injectable()
export class MyErrorHandler implements ErrorHandler {
  handleError(error: any): void {
    // Handle uncaught errors
  }

  onViewError(error: Error, details: ErrorDetails): void {
    // Handle errors caught by a @boundary
    console.warn('Caught by boundary:', details.boundary);
    myErrorTrackingService.log(error);
  }
}
```

IMPORTANT: 如果 `@error` 區塊本身擲出錯誤，該錯誤會向上傳播到次一層外圍的 `@boundary`，否則 Angular 會將它視為未處理的應用程式錯誤。

## 內容投影

如果你的元件使用了[內容投影](guide/components/content-projection)，將 `<ng-content>` 包在 `@boundary` 中並不會捕捉來自投影內容的錯誤。那份內容屬於宣告它的檢視，而非接收元件的檢視。

例如，下列範本的包裝元件無法捕捉投影進來的元件所發生的錯誤：

```angular-html {avoid}
@boundary {
  <ng-content />
} @error {
  <p>Something went wrong!</p>
}
```

若要捕捉那些錯誤，請在父範本中將包裝元件及其投影內容一起包進 `@boundary`：

```angular-html {prefer}
@boundary {
  <app-wrapper>
    <app-risky-component />
  </app-wrapper>
} @error {
  <p>Something went wrong!</p>
}
```

## 動態檢視與程式化錯誤處理

錯誤處理不限於範本語法。如果你是動態建立元件或內嵌檢視，可以使用 `onError` 選項來處理錯誤。詳情請參閱程式化算繪指南中的[處理算繪錯誤](guide/components/programmatic-rendering#handling-rendering-errors)一節。
