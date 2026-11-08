# 清理未使用的 imports

自第 19 版起，當元件的 `imports` 陣列含有未在其範本中使用的符號時，Angular 會提出報告。

執行此原理圖會清理專案中所有未使用的 imports。

使用以下指令執行此原理圖：

```shell
ng generate @angular/core:cleanup-unused-imports
```

#### 遷移前

```angular-ts
import {Component} from '@angular/core';
import {UnusedDirective} from './unused';

@Component({
  template: 'Hello',
  imports: [UnusedDirective],
})
export class MyComp {}
```

#### 遷移後

```angular-ts
import {Component} from '@angular/core';

@Component({
  template: 'Hello',
  imports: [],
})
export class MyComp {}
```
