# 雙向繫結

**雙向繫結**是一種簡寫語法，可以同時將值繫結到元素，同時也讓該元素能透過這個繫結把變更傳播回來。

## 語法

雙向繫結的語法是方括號與括號的組合：`[()]`。它結合了屬性繫結的語法 `[]` 與事件繫結的語法 `()`。Angular 社群非正式地將這種語法稱為「banana-in-a-box」。

## 與表單控制項的雙向繫結

開發者經常使用雙向繫結，讓元件資料在使用者與表單控制項互動時保持同步。例如，當使用者填寫文字輸入框時，應該要更新元件中的狀態。

以下範例會動態更新頁面上的 `firstName` 屬性：

```angular-ts
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  imports: [FormsModule],
  template: `
    <main>
      <h2>Hello {{ firstName }}!</h2>
      <input type="text" [(ngModel)]="firstName" />
    </main>
  `
})
export class AppComponent {
  firstName = 'Ada';
}
```

若要對原生表單控制項使用雙向繫結，你需要：

1. 從 `@angular/forms` 匯入 `FormsModule`
1. 使用雙向繫結語法搭配 `ngModel` 指令（例如 `[(ngModel)]`）
1. 將你希望它更新的狀態指派給它（例如 `firstName`）

設定好之後，Angular 會確保文字輸入框中的任何更新，都能正確反映到元件狀態中！

若要了解更多，請參閱官方文件中的 [`NgModel`](guide/directives#displaying-and-updating-properties-with-ngmodel)。

## 元件之間的雙向繫結 {#two-way-binding-between-components}

相較於表單元素，在父元件與子元件之間運用雙向繫結需要更多設定。

以下範例中，`AppComponent` 負責設定計數器的初始狀態，但更新與渲染計數器 UI 的邏輯主要位於它的子元件 `CounterComponent` 內。

```angular-ts
// ./app.component.ts
import { Component } from '@angular/core';
import { CounterComponent } from './counter/counter.component';

@Component({
  selector: 'app-root',
  imports: [CounterComponent],
  template: `
    <main>
      <h1>Counter: {{ initialCount }}</h1>
      <app-counter [(count)]="initialCount"></app-counter>
    </main>
  `,
})
export class AppComponent {
  initialCount = 18;
}
```

```angular-ts
// './counter/counter.component.ts';
import { Component, model } from '@angular/core';

@Component({
  selector: 'app-counter',
  template: `
    <button (click)="updateCount(-1)">-</button>
    <span>{{ count() }}</span>
    <button (click)="updateCount(+1)">+</button>
  `,
})
export class CounterComponent {
  count = model<number>(0);

  updateCount(amount: number): void {
    this.count.update(currentCount => currentCount + amount);
  }
}
```

### 啟用元件之間的雙向繫結

如果把上面的範例拆解到核心，每個元件雙向繫結都需要以下條件：

子元件必須包含一個 `model` 屬性。

以下是一個簡化範例：

```angular-ts
// './counter/counter.component.ts';
import { Component, model } from '@angular/core';

@Component({ /* Omitted for brevity */ })
export class CounterComponent {
  count = model<number>(0);

  updateCount(amount: number): void {
    this.count.update(currentCount => currentCount + amount);
  }
}
```

父元件必須：

1. 以雙向繫結語法包裝 `model` 屬性名稱。
1. 將屬性或訊號指派給 `model` 屬性。

以下是一個簡化範例：

```angular-ts
// ./app.component.ts
import { Component } from '@angular/core';
import { CounterComponent } from './counter/counter.component';

@Component({
  selector: 'app-root',
  imports: [CounterComponent],
  template: `
    <main>
      <app-counter [(count)]="initialCount"></app-counter>
    </main>
  `,
})
export class AppComponent {
  initialCount = 18;
}
```
