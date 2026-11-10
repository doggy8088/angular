<docs-decorative-header title="Angular 中的依賴注入" imgSrc="adev/src/assets/images/dependency_injection.svg"> <!-- markdownlint-disable-line -->

依賴注入（DI）是一種設計模式，讓你把依賴提供給類別，而不是讓類別自己建立這些依賴，藉此組織並共用整個應用程式的程式碼。
</docs-decorative-header>

TIP: 在深入這份完整指南之前，先看看 Angular 的[精華篇](essentials/dependency-injection)。

隨著應用程式成長，開發者經常需要在程式碼庫的不同部分重複使用並共用功能。[依賴注入（DI）](https://en.wikipedia.org/wiki/Dependency_injection)能幫助你達成這一點：你把依賴提供給類別，而不是在類別內部直接建立它們。這讓應用程式的不同部分更容易重複使用，也更容易管理。

依賴注入之所以廣受歡迎，是因為它能讓開發者處理一些常見挑戰，例如：

- **提升程式碼可維護性**：依賴注入促進清晰的關注點分離，讓程式碼更容易重構，也減少重複。
- **可擴充性**：你可以在應用程式的不同部分重複使用模組化功能，讓擴充更容易。
- **更好的測試**：DI 讓單元測試在需要時能用[測試替身](https://en.wikipedia.org/wiki/Test_double)取代真正的實作。

## 依賴注入在 Angular 中如何運作？

依賴是類別運作所需、但不會自己建立的任何物件、值、函式或服務。相反地，你從外部提供它，在應用程式的不同部分之間建立清晰的關係。

你主要透過兩種方式與依賴注入系統互動：

- 你可以*提供*，也就是讓值可供取用。
- 你可以*注入*，也就是索取那些值作為依賴。

在這個脈絡中，「值」可以指任何 JavaScript 值，包括物件、函式或類別實例。常見的注入依賴類型包括：

- **設定值**：與環境相關的常數、API URL、功能旗標等。
- **工廠**：依執行階段條件建立物件或值的函式
- **服務**：提供共用功能、業務邏輯或狀態的類別

Angular 元件和指令會自動參與 DI，意思是你可以把依賴注入它們，也可以讓它們可供注入。

## 什麼是服務？

Angular _服務_是以 `@Injectable` 裝飾的 TypeScript 類別，讓你可以把該類別的實例作為依賴注入。服務是跨應用程式共用資料與功能最常見的方式。

常見的服務類型包括：

- **資料用戶端**：抽象化向伺服器發出資料取得與異動請求的細節
- **狀態管理**：定義跨多個元件或頁面共用的狀態
- **驗證與授權**：管理使用者驗證、token 儲存與存取控制
- **記錄與錯誤處理**：為記錄或向使用者傳達錯誤狀態建立共用 API
- **事件處理與派送**：處理不屬於特定元件的事件或通知，或把事件和通知派送給元件，遵循[觀察者模式](https://en.wikipedia.org/wiki/Observer_pattern)
- **工具函式**：提供可重複使用的工具函式，例如資料格式化、驗證或計算

以下範例宣告了一個名為 `AnalyticsLogger` 的服務：

```ts
import {Injectable} from '@angular/core';

@Injectable({providedIn: 'root'})
export class AnalyticsLogger {
  trackEvent(category: string, value: string) {
    console.log('Analytics event logged:', {
      category,
      value,
      timestamp: new Date().toISOString(),
    });
  }
}
```

NOTE: `providedIn: 'root'` 選項讓這個服務在整個應用程式中以單例的形式可供使用。這是大多數服務的建議做法。

## 使用 `inject()` 注入依賴 {#injecting-dependencies-with-inject}

你可以使用 Angular 的 `inject()` 函式來注入依賴。

以下是一個導覽列的範例，它注入了 `AnalyticsLogger` 和 Angular 的 `Router` 服務，讓使用者在導覽到其他頁面的同時也能追蹤事件。

```angular-ts
import {Component, inject} from '@angular/core';
import {Router} from '@angular/router';
import {AnalyticsLogger} from './analytics-logger';

@Component({
  selector: 'app-navbar',
  template: `<a href="#" (click)="navigateToDetail($event)">Detail Page</a>`,
})
export class Navbar {
  private router = inject(Router);
  private analytics = inject(AnalyticsLogger);

  navigateToDetail(event: Event) {
    event.preventDefault();
    this.analytics.trackEvent('navigation', '/details');
    this.router.navigate(['/details']);
  }
}
```

### `inject()` 可以用在哪裡？ {#where-can-inject-be-used}

你可以在元件、指令或服務的建構期間注入依賴。對 [`inject`](/api/core/inject) 的呼叫可以出現在 `constructor` 中，也可以出現在欄位初始化器中。以下是一些常見範例：

```ts
@Component({
  /*...*/
})
export class MyComponent {
  // ✅ In class field initializer
  private service = inject(MyService);

  // ✅ In constructor body
  private anotherService: MyService;

  constructor() {
    this.anotherService = inject(MyService);
  }
}
```

```ts
@Directive({...})
export class MyDirective {
  // ✅ In class field initializer
  private element = inject(ElementRef);
}
```

```ts
import {Injectable, inject} from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable({providedIn: 'root'})
export class MyService {
  // ✅ In a service
  private http = inject(HttpClient);
}
```

```ts
export const authGuard = () => {
  // ✅ In a route guard
  const auth = inject(AuthService);
  return auth.isAuthenticated();
};
```

Angular 用「注入上下文」一詞來描述程式碼中任何可以呼叫 [`inject`](/api/core/inject) 的位置。元件、指令與服務的建構是最常見的情形，詳情請參閱[注入上下文](/guide/di/dependency-injection-context)。

更多資訊請參閱 [inject API 文件](api/core/inject#usage-notes)。

## 後續步驟

現在你已了解 Angular 依賴注入的基本原理，可以開始學習如何建立自己的服務了。

下一篇指南[建立與使用服務](guide/di/creating-and-using-services)將示範：

- 如何用 Angular CLI 或手動建立服務
- `providedIn: 'root'` 模式如何運作
- 如何把服務注入元件和其他服務

這涵蓋了 Angular 應用程式中最常見的服務使用情境。
