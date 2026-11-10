# 測試服務

服務通常包含應用程式的業務邏輯，而元件仰賴這些邏輯。測試服務可以驗證這些邏輯在獨立狀態下是否正確運作，不受任何元件或範本影響。

本指南使用 [Vitest](https://vitest.dev/)，Angular CLI 專案預設即包含它。關於測試設定的更多資訊，請參閱[測試總覽指南](guide/testing#set-up-for-testing)。

## 測試服務

以一個執行基本算術運算的 `Calculator` 服務為例：

```ts { header: 'calculator.ts' }
import {Injectable} from '@angular/core';

@Injectable({providedIn: 'root'})
export class Calculator {
  add(a: number, b: number): number {
    return a + b;
  }

  subtract(a: number, b: number): number {
    return a - b;
  }
}
```

若要測試這個服務，需要設定 `TestBed`；它是 Angular 的測試工具，能為每個測試建立獨立的測試環境。它會設定依賴注入，讓你取得服務的實例，模擬 Angular 在真正的應用程式中串連各部分的作法。

```ts { header: 'calculator.spec.ts' }
import {TestBed} from '@angular/core/testing';
import {beforeEach, describe, expect, it} from 'vitest';
import {Calculator} from './calculator';

describe('Calculator', () => {
  let service: Calculator;

  beforeEach(() => {
    // Injects the Calculator service which is available to Angular
    // because the service uses `providedIn: 'root'`
    service = TestBed.inject(Calculator);
  });

  it('adds two numbers', () => {
    expect(service.add(1, 2)).toBe(3);
  });

  it('subtracts two numbers', () => {
    expect(service.subtract(5, 3)).toBe(2);
  });
});
```

在上例中，`beforeEach` 區塊會在每個測試之前注入服務的新實例。這能確保每個測試都在獨立狀態下執行，不會殘留先前測試的狀態。

## 測試具有相依性的服務

大多數服務需要相依於其他服務才能正常運作。`TestBed` 預設提供這些相依性的真正實作，也就是說，你的測試會執行應用程式實際使用的程式碼路徑。不過，有些相依性可能很複雜、緩慢，或結果不可預測。在這些情況下，你可以將它換成受控的替代實作。

以一個仰賴 `TaxCalculator` 計算訂單最終價格的 `OrderTotal` 服務為例：

```ts { header: 'tax-calculator.ts' }
import {Injectable} from '@angular/core';

@Injectable({providedIn: 'root'})
export class TaxCalculator {
  calculate(subtotal: number): number {
    return subtotal * 0.05;
  }
}
```

```ts { header: 'order-total.ts' }
import {inject, Injectable} from '@angular/core';
import {TaxCalculator} from './tax-calculator';

@Injectable({providedIn: 'root'})
export class OrderTotal {
  private taxCalculator = inject(TaxCalculator);

  total(subtotal: number): number {
    return subtotal + this.taxCalculator.calculate(subtotal);
  }
}
```

在這個範例中，`OrderTotal` 使用 `inject()` 向 Angular 的依賴注入系統請求 `TaxCalculator`。`TestBed` 預設提供真正的 `TaxCalculator`，對於像這樣簡單的計算非常合適。不過，如果 `TaxCalculator` 涉及複雜邏輯、網路請求或不可預測的結果，你可能會想將它換成受控的替代實作。

### 以 stub 取代相依性

stub 是一種取代相依性或方法的方式，讓它傳回可預測的值，使測試結果更容易驗證。

若要在不仰賴真正 `TaxCalculator` 的情況下測試 `OrderTotal`，你可以在 `TestBed` 設定中提供一個 stub。

```ts { header: 'order-total.spec.ts' }
import {TestBed} from '@angular/core/testing';
import {beforeEach, describe, expect, it, vi, type Mocked} from 'vitest';
import {OrderTotal} from './order-total';
import {TaxCalculator} from './tax-calculator';

// Vitest's `Mocked` utility type ensures the stub is type-safe,
// while `vi.fn()` creates a mock function for each method
const taxCalculatorStub: Mocked<TaxCalculator> = {
  calculate: vi.fn(),
};

describe('OrderTotal', () => {
  let service: OrderTotal;

  beforeEach(() => {
    // `mockReturnValue` sets a controlled return value for the stub
    taxCalculatorStub.calculate.mockReturnValue(5);

    TestBed.configureTestingModule({
      // The `providers` array accepts a provider object where `provide`
      // specifies the dependency to replace and `useValue` defines the stub
      providers: [{provide: TaxCalculator, useValue: taxCalculatorStub}],
    });
    service = TestBed.inject(OrderTotal);
  });

  it('adds tax to the subtotal', () => {
    expect(service.total(100)).toBe(105);
  });
});
```

有了這個 stub，每當 `OrderTotal` 請求 `TaxCalculator` 時，`TestBed` 就知道要改用 `taxCalculatorStub`。由於 stub 永遠傳回 5，這個測試驗證了 `OrderTotal` 能正確地將稅額加到小計上，無論 `TaxCalculator` 中的稅率如何變化。

### 使用 spy 驗證互動

stub 能控制相依性傳回什麼，但有時你還需要驗證服務是否以正確的引數呼叫了它的相依性。這可以透過 spy 達成，spy 會追蹤函式被呼叫的方式。在 Vitest 中，這項功能內建於 `vi.fn()`，讓你能對服務之間的互動進行斷言。

```ts { header: 'order-total.spec.ts' }
import {TestBed} from '@angular/core/testing';
import {beforeEach, describe, expect, it, vi, type Mocked} from 'vitest';
import {OrderTotal} from './order-total';
import {TaxCalculator} from './tax-calculator';

const taxCalculatorStub: Mocked<TaxCalculator> = {
  calculate: vi.fn(),
};

describe('OrderTotal', () => {
  let service: OrderTotal;

  beforeEach(() => {
    taxCalculatorStub.calculate.mockReturnValue(5);

    TestBed.configureTestingModule({
      providers: [{provide: TaxCalculator, useValue: taxCalculatorStub}],
    });
    service = TestBed.inject(OrderTotal);
  });

  it('adds tax to the subtotal', () => {
    expect(service.total(100)).toBe(105);
  });

  // Verify the interaction with a spy
  it('calls the tax calculator', () => {
    service.total(100);
    expect(taxCalculatorStub.calculate).toHaveBeenCalledExactlyOnce();
  });
});
```

新增的測試驗證了 `OrderTotal` 在計算總額時有呼叫 `TaxCalculator.calculate`。這在驗證服務之間的互動是否正確發生時很有用。

## 測試 HTTP 服務

許多服務使用 Angular 的 `HttpClient` 從伺服器取得資料。Angular 為 `HttpClient` 提供了專門的測試工具，讓你能控制 HTTP 回應，不必發出真正的網路請求。

關於測試使用 `HttpClient` 的服務，詳情請參閱 [HTTP 測試指南](guide/http/testing)。
