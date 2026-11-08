# RouterTestingModule 遷移

此原理圖會把測試中 `RouterTestingModule` 的用法，遷移為 `RouterModule`。

當測試從 `@angular/common/testing` 匯入 `SpyLocation` 並使用 `urlChanges` 屬性時，此原理圖還會加入 `provideLocationMocks()`，以保留原來的行為。

使用以下指令執行此原理圖：

```shell
ng generate @angular/core:router-testing-module-migration
```

## 選項

| 選項   | 說明                                                                                     |
| :----- | :--------------------------------------------------------------------------------------- |
| `path` | 要遷移的路徑（相對於專案根目錄）。預設為 `./`。可以用它來漸進式地遷移專案的一部分。       |

## 範例

### 保留路由選項

遷移前：

```ts
import {RouterTestingModule} from '@angular/router/testing';
import {TestBed} from '@angular/core/testing';
import {SpyLocation} from '@angular/common/testing';

describe('test', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes(routes, {initialNavigation: 'enabledBlocking'})],
    });
  });
});
```

遷移後：

```ts
import {RouterModule} from '@angular/router';
import {TestBed} from '@angular/core/testing';
import {SpyLocation} from '@angular/common/testing';

describe('test', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterModule.forRoot(routes, {initialNavigation: 'enabledBlocking'})],
    });
  });
});
```

### 匯入 `SpyLocation` 且使用 `urlChanges` 時，加入 provideLocationMocks

遷移前：

```ts
import {RouterTestingModule} from '@angular/router/testing';
import {TestBed} from '@angular/core/testing';
import {SpyLocation} from '@angular/common/testing';

describe('test', () => {
  let spy: SpyLocation;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
    });
    spy = TestBed.inject(SpyLocation);
  });

  it('Awesome test', () => {
    expect(spy.urlChanges).toBeDefined();
  });
});
```

遷移後：

```ts
import {RouterModule} from '@angular/router';
import {TestBed} from '@angular/core/testing';
import {SpyLocation, provideLocationMocks} from '@angular/common/testing';

describe('test', () => {
  let spy: SpyLocation;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterModule],
      providers: [provideLocationMocks()],
    });
    spy = TestBed.inject(SpyLocation);
  });

  it('Awesome test', () => {
    expect(spy.urlChanges).toBeDefined();
  });
});
```
