<docs-decorative-header title="共享程式碼" imgSrc="adev/src/assets/images/dependency_injection.svg"> <!-- markdownlint-disable-line -->
依賴注入讓你可以共享程式碼。
</docs-decorative-header>

當你需要在元件之間共享邏輯時，Angular 採用了[依賴注入](/guide/di)這個設計模式，讓你可以建立一個「服務」，把程式碼注入元件中，同時從單一的真實來源統一管理。

## 什麼是服務？ {#what-are-services}

服務是可以被注入、能重複使用的程式碼片段。

和定義元件類似，服務由下列部分組成：

- 一個 **TypeScript 裝飾器**，透過 `@Injectable` 把類別宣告為 Angular 服務，並讓你透過 `providedIn` 屬性（通常為 `'root'`）定義應用程式的哪個部分可以存取該服務，進而讓服務能在應用程式內的任何地方被存取。
- 一個 **TypeScript 類別**，定義服務被注入時可以取用的目標程式碼

以下是一個 `Calculator` 服務的範例。

```ts
import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CalculatorService {
  add(x: number, y: number) {
    return x + y;
  }
}
```

## 如何使用服務 {#how-to-use-a-service}

當你想在元件中使用服務時，你需要：

1. 匯入該服務
2. 宣告一個要注入服務的類別欄位。把這個類別欄位指派為呼叫內建函式 `inject` 的結果，由它來建立服務

在 `Receipt` 元件中，大致會像這樣：

```ts
import { Component } from '@angular/core';
import { CalculatorService } from './calculator.service';

@Component({
  selector: 'app-receipt',
  template: `<h1>The total is {{ totalCost }}</h1>`,
})

export class Receipt {
  private calculatorService = inject(CalculatorService);
  totalCost = this.calculatorService.add(50, 25);
}
```

在這個範例中，`CalculatorService` 是透過呼叫 Angular 的 `inject` 函式，並把服務傳入來使用的。

## 下一步 {#next-step}

<docs-pill-row>
  <docs-pill title="精華篇之後的下一步" href="essentials/next-steps" />
</docs-pill-row>
