# 建立與使用服務

服務是可重用的程式碼片段，可以在整個 Angular 應用程式中共用。它們通常負責處理資料擷取、業務邏輯，或其他多個元件需要存取的功能。

## 建立服務

你可以用 [Angular CLI](tools/cli)，以下列指令建立服務：

```bash
ng generate service CUSTOM_NAME
```

這會在你的 `src` 目錄中，建立一個專屬的 `CUSTOM_NAME.ts` 檔案。

你也可以透過為 TypeScript 類別加上 `@Injectable()` 裝飾器，來手動建立服務。這告訴 Angular，該服務可以作為依賴注入。

以下是一個服務範例，讓使用者新增與請求資料：

```ts
// 📄 src/app/basic-data-store.ts
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class BasicDataStore {
  private data: string[] = []

  addData(item: string): void {
   this.data.push(item)
  }

  getData(): string[] {
    return [...this.data]
  }
}
```

## 服務如何變得可用

當你在服務中使用 `@Injectable({ providedIn: 'root' })` 時，Angular 會：

- **建立單一實例**（單例），供你的整個應用程式使用
- **讓它隨處可用**，無需任何額外設定
- **啟用搖樹優化**（tree-shaking），讓該服務只有在實際被使用時，才包含在你的 JavaScript bundle 中

這是大多數服務的建議做法。

## 注入服務

一旦你以 `providedIn: 'root'` 建立了服務，你就可以使用 `@angular/core` 的 `inject()` 函式，在應用程式中的任何地方注入它。

### 注入到元件中

```angular-ts
import { Component, inject } from '@angular/core';
import { BasicDataStore } from './basic-data-store';

@Component({
  selector: 'app-example',
  template: `
    <div>
      <p>{{ dataStore.getData() }}</p>
      <button (click)="dataStore.addData('More data')">
        Add more data
      </button>
    </div>
  `
})
export class ExampleComponent {
  dataStore = inject(BasicDataStore);
}
```

### 注入到另一個服務中

```ts
import { inject, Injectable } from '@angular/core';
import { AdvancedDataStore } from './advanced-data-store';

@Injectable({
  providedIn: 'root',
})
export class BasicDataStore {
  private advancedDataStore = inject(AdvancedDataStore);
  private data: string[] = [];

  addData(item: string): void {
    this.data.push(item);
  }

  getData(): string[] {
    return [...this.data, ...this.advancedDataStore.getData()];
  }
}
```

## 後續步驟

雖然 `providedIn: 'root'` 涵蓋了大多數使用情境，Angular 也提供其他方式，讓你為特殊情境提供服務：

- **元件專屬實例**：當元件需要各自獨立的服務實例時
- **手動設定**：適用於需要執行階段設定的服務
- **工廠提供者**：依據執行階段條件動態建立服務
- **值提供者**：提供設定物件或常數

你可以在下一篇指南中進一步了解這些進階模式：[定義依賴提供者](/guide/di/defining-dependency-providers)。
