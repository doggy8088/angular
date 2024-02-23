<docs-decorative-header title="共用程式碼" imgSrc="adev/src/assets/images/dependency_injection.svg"> <!-- markdownlint-disable-line -->
相依性注入允許您共用程式碼。
</docs-decorative-header>

當您需要在元件間共用邏輯時，Angular 採用 [依賴注入](/guide/di) 的設計模式，讓您可以建立一個「服務」，允許您將程式碼注入元件，同時從單一真實來源管理它。

## 服務是什麼？

服務是可以注入的重複使用程式碼片段

類似定義元件，服務由以下部分組成：

- 一個 **TypeScript 裝飾器**，它通過 `@Injectable` 將類別宣告為 Angular 服務，並允許您定義應用程式的哪個部分可以通過 `providedIn` 屬性（通常為 `'root'`）存取服務，以允許在應用程式中的任何地方存取服務。
- 一個 **TypeScript 類別**，它定義注入服務時可存取的所需程式碼

以下是 `Calculator` 服務的範例。

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

## 如何使用服務

<ul>
<li>Go to the service's website.</li>
<li>Click on the "Sign Up" button.</li>
<li>Enter your email address and create a password.</li>
<li>Click on the "Create Account" button.</li>
<li>You will be sent a confirmation email.</li>
<li>Click on the link in the email to activate your account.</li>
<li>Once your account is activated, you can log in to the service.</li>
<li>Click on the "My Account" button.</li>
<li>You will see a list of your subscriptions.</li>
<li>Click on the "Cancel Subscription" button to cancel a subscription.</li>
</ul>

當您想在元件中使用服務時，您需要：

1. 匯入服務
2. 宣告一個服務被注入的類別欄位。將類別欄位指定給內建函數 `inject` 的呼叫結果，該函數會建立服務

以下是在 `Receipt` 元件中可能看到的內容：

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

在此範例中，`CalculatorService` 透過呼叫 Angular 函數 `inject` 並將服務傳入，來進行使用。

## 下一步

<docs-pill-row>
  <docs-pill title="Essentials 後續步驟" href="essentials/next-steps" />
</docs-pill-row>
