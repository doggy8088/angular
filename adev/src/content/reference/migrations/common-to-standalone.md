# 將 CommonModule 轉換為獨立 imports

這項遷移能協助專案移除元件中對 `CommonModule` 的匯入，改為加入每個範本所需的最小指令與管道匯入集合（例如 `NgIf`、`NgFor`、`AsyncPipe` 等）。

使用以下指令執行此原理圖：

```shell
ng generate @angular/core:common-to-standalone
```

## 選項

| 選項   | 說明                                                                                     |
| :----- | :--------------------------------------------------------------------------------------- |
| `path` | 要遷移的路徑（相對於專案根目錄）。預設為 `./`。可以用它來漸進式地遷移專案的一部分。       |

## 範例

遷移前：

```angular-ts
import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-example',
  imports: [CommonModule],
  template: `
    <div *ngIf="show">
      {{ data | async | json }}
    </div>
  `,
})
export class Example {
  show = true;
  data = Promise.resolve({message: 'Hello'});
}
```

執行遷移後（已加入元件所需的 imports，並移除了 CommonModule）：

```angular-ts
import {Component} from '@angular/core';
import {AsyncPipe, JsonPipe, NgIf} from '@angular/common';

@Component({
  selector: 'app-example',
  imports: [AsyncPipe, JsonPipe, NgIf],
  template: `
    <div *ngIf="show">
      {{ data | async | json }}
    </div>
  `,
})
export class Example {
  show = true;
  data = Promise.resolve({message: 'Hello'});
}
```
