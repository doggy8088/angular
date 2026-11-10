# 遷移到 output 函式

Angular 在 v17.3 引入了改進的 outputs API，並自 v19 起視為已可正式使用。這個 API 仿效 `input()` API，但不是以訊號為基礎。
關於自訂事件的 output 函式及其優點，詳情請見[專門的指南](guide/components/outputs)。

為了支援想使用 output 函式的既有專案，Angular 團隊提供了一項自動化遷移，能把 `@Output` 自訂事件轉換為新的 `output()` API。

使用以下指令執行此原理圖：

```bash
ng generate @angular/core:output-migration
```

## 遷移會更動什麼？

1. `@Output()` 類別成員會更新為對應的 `output()` 形式。
2. 元件或指令所在檔案中，TypeScript 模組層級的 imports 也會一併更新。
3. 把像 `event.next()` 這類不建議使用的 API 呼叫遷移為 `event.emit()`，並移除 `event.complete()` 呼叫。

**遷移前**

```typescript
import {Component, Output, EventEmitter} from '@angular/core';

@Component({
  template: `<button (click)="someMethod('test')">emit</button>`,
})
export class MyComponent {
  @Output() someChange = new EventEmitter<string>();

  someMethod(value: string): void {
    this.someChange.emit(value);
  }
}
```

**遷移後**

```typescript
import {Component, output} from '@angular/core';

@Component({
  template: `<button (click)="someMethod('test')">emit</button>`,
})
export class MyComponent {
  readonly someChange = output<string>();

  someMethod(value: string): void {
    this.someChange.emit(value);
  }
}
```

## 設定選項

這項遷移支援幾個選項，可依你的具體需求微調遷移方式。

### `--path`

如果沒有指定，遷移會向你詢問路徑，並更新你整個 Angular CLI 工作區。
你可以使用這個選項，把遷移限制在特定的子目錄。

### `--analysis-dir`

在大型專案中，你可以使用這個選項來減少被分析的檔案數量。
依預設，無論 `--path` 選項為何，遷移都會分析整個工作區，以便更新所有受 `@Output()` 遷移影響的參照。

使用這個選項，可以把分析限制在某個子資料夾。請注意，這表示該目錄之外的任何參照都會被默默略過，可能會破壞你的建置。

如下所示使用這些選項：

```bash
ng generate @angular/core:output-migration --path src/app/sub-folder
```

## 例外情況

在某些情況下，遷移不會更動程式碼。
其中一個例外是：事件搭配 `pipe()` 方法使用的情況。
以下程式碼不會被遷移：

```typescript
export class MyDialogComponent {
  @Output() close = new EventEmitter<void>();
  doSome(): void {
    this.close.complete();
  }
  otherThing(): void {
    this.close.pipe();
  }
}
```

