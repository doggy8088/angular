# 遷移到訊號輸入

Angular 引入了改進的輸入 API，並自 v19 起視為已可正式使用。
關於訊號輸入及其優點，詳情請見[專門的指南](guide/signals/inputs)。

為了支援想使用訊號輸入的既有團隊，Angular 團隊提供了一項自動化遷移，能把 `@Input` 欄位轉換為新的 `input()` API。

使用以下指令執行此原理圖：

```bash
ng generate @angular/core:signal-input-migration
```

或者，這項遷移也可以在 VSCode 中以[程式碼重構動作](https://code.visualstudio.com/docs/typescript/typescript-refactoring#_refactoring)的形式使用。
安裝最新版的 VSCode 擴充功能，然後點選某個 `@Input` 欄位。
更多細節請見[下方](#vscode-extension)章節。

## 遷移會更動什麼？

1. `@Input()` 類別成員會更新為對應的訊號 `input()` 形式。
2. 對已遷移輸入的參照會更新為呼叫該訊號。
   - 包括範本、host 繫結或 TypeScript 程式碼中的參照。

**遷移前**

```typescript
import {Component, Input} from '@angular/core';

@Component({
  template: `Name: {{name ?? ''}}`
})
export class MyComponent {
  @Input() name: string|undefined = undefined;

  someMethod(): number {
    if (this.name) {
      return this.name.length;
    }
    return -1;
  }
}
```

**遷移後**

<docs-code language="angular-ts" highlight="[[4],[7], [10,12]]">
import {Component, input} from '@angular/core';

@Component({
  template: `Name: {{name() ?? ''}}`
})
export class MyComponent {
  readonly name = input<string>();

  someMethod(): number {
    const name = this.name();
    if (name) {
      return name.length;
    }
    return -1;
  }
}
</docs-code>

## 設定選項

這項遷移支援幾個選項，可依你的具體需求微調遷移方式。

### `--path`

依預設，遷移會更新你整個 Angular CLI 工作區。
你可以使用這個選項，把遷移限制在特定的子目錄。

### `--best-effort-mode`

依預設，遷移會略過無法安全遷移的輸入。
遷移會盡可能以最安全的方式重構程式碼。

啟用 `--best-effort-mode` 旗標後，遷移會積極嘗試盡可能多遷移一些，即使這可能破壞你的建置。

### `--insert-todos`

啟用後，遷移會為無法遷移的輸入加上 TODO。
這些 TODO 會包含輸入被略過的原因。例如：

```ts
// TODO: Skipped for migration because:
//  Your application code writes to the input. This prevents migration.
@Input() myInput = false;
```

### `--analysis-dir`

在大型專案中，你可以使用這個選項來減少被分析的檔案數量。
依預設，無論 `--path` 選項為何，遷移都會分析整個工作區，以便更新所有受 `@Input()` 遷移影響的參照。

使用這個選項，可以把分析限制在某個子資料夾。請注意，這表示該目錄之外的任何參照都會被默默略過，可能會破壞你的建置。

## VSCode extension {#vscode-extension}

![在 VSCode 擴充功能中點選 `@Input` 欄位的截圖](assets/images/migrations/signal-inputs-vscode.png "在 VSCode 擴充功能中點選 `@Input` 欄位的截圖。")

這項遷移可以在 VSCode 中以[程式碼重構動作](https://code.visualstudio.com/docs/typescript/typescript-refactoring#_refactoring)的形式使用。

若要透過 VSCode 使用這項遷移，請安裝最新版的 VSCode 擴充功能，然後點選：

- 某個 `@Input` 欄位。
- 或某個指令/元件

接著，等待 VSCode 重構按鈕的黃色燈泡出現。
透過這個按鈕，你就可以選取訊號輸入遷移。
