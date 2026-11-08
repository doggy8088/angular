# 遷移到 `inject` 函式

與建構函式注入相比，Angular 的 [`inject`](/api/core/inject) 函式能提供更精確的型別，也與標準裝飾器有更好的相容性。

此原理圖會把你類別中的建構函式注入，轉換為改用 [`inject`](/api/core/inject) 函式。

使用以下指令執行此原理圖：

```shell
ng generate @angular/core:inject
```

#### 遷移前

```typescript
import {Component, Inject, Optional} from '@angular/core';
import {MyService} from './service';
import {DI_TOKEN} from './token';

@Component({template: ''})
export class MyComp {
  constructor(
    private service: MyService,
    @Inject(DI_TOKEN) @Optional() readonly token: string,
  ) {}
}
```

#### 遷移後

```typescript
import {Component, inject} from '@angular/core';
import {MyService} from './service';
import {DI_TOKEN} from './token';

@Component({template: ''})
export class MyComp {
  private service = inject(MyService);
  readonly token = inject(DI_TOKEN, {optional: true});
}
```

## 遷移選項

這項遷移包含幾個選項，可自訂其輸出。

### `path`

決定要遷移專案中的哪個子路徑。傳入 `.` 或留空，即可遷移整個目錄。

### `migrateAbstractClasses`

Angular 不會驗證抽象類別的參數是否可注入。也就是說，遷移無法可靠地把它們遷移到 [`inject`](/api/core/inject)，而不冒著造成破壞的風險，因此預設停用。如果你想遷移抽象類別，可以啟用這個選項，但請注意，你可能必須**手動修正一些破壞**。

### `backwardsCompatibleConstructors`

依預設，遷移會盡可能地清理程式碼，包括刪除建構函式的參數；如果建構函式裡沒有任何程式碼，甚至會刪除整個建構函式。
在某些情況下，當帶有 Angular 裝飾器的類別繼承自其他同樣帶有 Angular 裝飾器的類別時，這可能會導致編譯錯誤。如果你啟用這個選項，遷移會產生一個額外的建構函式簽章來保持向後相容，代價是程式碼會變多。

#### 遷移前 {#backwards-compatible-constructors-before}

```typescript
import {Component} from '@angular/core';
import {MyService} from './service';

@Component({template: ''})
export class MyComp {
  constructor(private service: MyService) {}
}
```

#### 遷移後 {#backwards-compatible-constructors-after}

```typescript
import {Component, inject} from '@angular/core';
import {MyService} from './service';

@Component({template: ''})
export class MyComp {
  private service = inject(MyService);

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor() {}
}
```

### `nonNullableOptional`

如果帶有 `@Optional` 裝飾器的參數注入失敗，Angular 會回傳 `null`，也就是說，任何 `@Optional` 參數的實際型別都會是 `| null`。然而，由於裝飾器無法影響自身的型別，現有程式碼中有很多型別並不正確。這個型別在 `inject()` 中會被修正，這可能會讓新的編譯錯誤浮現。如果你啟用這個選項，遷移會在 `inject()` 呼叫後加上非空斷言，以符合舊有的型別，代價是可能隱藏型別錯誤。

NOTE: 對於型別已經可為 null 的參數，不會加上非空斷言，因為依賴這些參數的程式碼很可能已經考慮到它們可為 null 的特性。

#### 遷移前 {#non-nullable-optional-before}

```typescript
import {Component, Inject, Optional} from '@angular/core';
import {TOKEN_ONE, TOKEN_TWO} from './token';

@Component({template: ''})
export class MyComp {
  constructor(
    @Inject(TOKEN_ONE) @Optional() private tokenOne: number,
    @Inject(TOKEN_TWO) @Optional() private tokenTwo: string | null,
  ) {}
}
```

#### 遷移後 {#non-nullable-optional-after}

```typescript
import {Component, inject} from '@angular/core';
import {TOKEN_ONE, TOKEN_TWO} from './token';

@Component({template: ''})
export class MyComp {
  // Note the `!` at the end.
  private tokenOne = inject(TOKEN_ONE, {optional: true})!;

  // Does not have `!` at the end, because the type was already nullable.
  private tokenTwo = inject(TOKEN_TWO, {optional: true});
}
```
