# 非同步操作

有些驗證需要來自外部來源的資料，例如後端 API 或第三方服務。Signal Forms 提供兩個函式用於非同步驗證：`validateHttp()` 用於以 HTTP 為基礎的驗證，`validateAsync()` 用於以自訂 resource 為基礎的驗證。

## 何時使用非同步驗證

當你的驗證邏輯需要外部資料時，使用非同步驗證。一些常見範例包括：

- **唯一性檢查**：確認使用者名稱或電子郵件是否已經存在
- **資料庫查詢**：對照伺服器端資料檢查值
- **外部 API 驗證**：透過第三方服務驗證地址、稅籍編號或其他資料
- **伺服器端商業規則**：套用只有伺服器能驗證的驗證規則

不要把可以在用戶端同步完成的檢查拿來做非同步驗證。對於格式驗證與靜態規則，請使用 `pattern()`、`email()` 或 `validate()` 等同步驗證規則。

## 非同步驗證的運作方式

非同步驗證只有在所有同步驗證都通過後才會執行。驗證執行期間，欄位的 `pending()` 訊號會回傳 `true`。驗證可以把錯誤指向特定欄位，而且當欄位值變更時，進行中的請求會自動取消。

以下是一個檢查使用者名稱可用性的範例：

```angular-ts
import {Component, signal} from '@angular/core';
import {form, validateHttp, FormField} from '@angular/forms/signals';

@Component({
  selector: 'app-registration',
  imports: [FormField],
  template: `
    <form>
      <label>
        Username:
        <input [formField]="registrationForm.username" />
      </label>

      @if (registrationForm.username().pending()) {
        <span class="checking">Checking availability...</span>
      }
      @if (registrationForm.username().invalid()) {
        @for (error of registrationForm.username().errors(); track $index) {
          <span class="error">{{ error.message }}</span>
        }
      }
    </form>
  `,
})
export class Registration {
  registrationModel = signal({username: ''});

  registrationForm = form(this.registrationModel, (schemaPath) => {
    validateHttp(schemaPath.username, {
      request: ({value}) => {
        const username = value();
        return username ? `/api/users/check?username=${username}` : undefined;
      },
      onSuccess: (response: {available: boolean}) => {
        return response.available
          ? null
          : {
              kind: 'usernameTaken',
              message: 'Username is already taken',
            };
      },
      onError: (error) => {
        console.error('Validation request failed:', error);
        return {
          kind: 'serverError',
          message: 'Could not verify username availability',
        };
      },
    });
  });
}
```

驗證流程的運作方式如下：

1. 使用者輸入一個值
2. 同步驗證規則先執行
3. 如果同步驗證失敗，非同步驗證不會執行
4. 如果同步驗證通過，非同步驗證開始，且 `pending()` 變成 `true`
5. 請求完成，且 `pending()` 變成 `false`
6. 錯誤依據回應更新

## 使用 validateHttp() 進行 HTTP 驗證 {#http-validation-with-validatehttp}

`validateHttp()` 函式提供最常見形式的非同步驗證。當你需要對照 REST API 或任何 HTTP 端點進行驗證時，使用它。

### request 函式

`request` 函式回傳一個 URL 字串或一個 `HttpResourceRequest` 物件。回傳 `undefined` 可以略過驗證：

```ts
import {Component, signal} from '@angular/core';
import {form, validateHttp, FormField} from '@angular/forms/signals';

@Component({
  selector: 'app-registration',
  imports: [FormField],
  template: `...`,
})
export class Registration {
  registrationModel = signal({username: ''});

  // Cache usernames that passed validation
  private validatedUsernames = new Set<string>();

  registrationForm = form(this.registrationModel, (schemaPath) => {
    validateHttp(schemaPath.username, {
      request: ({value}) => {
        const username = value();
        // Skip HTTP request if already validated
        if (this.validatedUsernames.has(username)) return undefined;

        return `/api/users/check?username=${username}`;
      },
      onSuccess: (response: {available: boolean}, {value}) => {
        if (response.available) {
          // Cache successful validations
          this.validatedUsernames.add(value());
          return null;
        }
        return {
          kind: 'usernameTaken',
          message: 'Username is already taken',
        };
      },
      onError: () => ({
        kind: 'serverError',
        message: 'Could not verify username',
      }),
    });
  });
}
```

對於 POST 請求或自訂標頭，回傳一個 `HttpResourceRequest` 物件：

```ts
request: ({value}) => ({
  url: '/api/validate',
  method: 'POST',
  body: {username: value()},
}) // prettier-ignore
```

### 成功與錯誤處理器

`onSuccess` 函式接收 HTTP 回應，並回傳驗證錯誤，或針對有效值回傳 `undefined`：

```ts
onSuccess: (response: { valid: boolean; message?: string }) => {
  if (response.valid) return undefined;

  return {
    kind: 'invalid',
    message: response.message || 'Validation failed',
  };
} // prettier-ignore
```

有需要時可以回傳多個錯誤：

```ts
onSuccess: (response: { usernameTaken: boolean; profanity: boolean }) => {
  const errors = [];
  if (response.usernameTaken) {
    errors.push({
      kind: 'usernameTaken',
      message: 'Username taken',
    });
  }
  if (response.profanity) {
    errors.push({
      kind: 'profanity',
      message: 'Username contains inappropriate content',
    });
  }
  return errors.length > 0 ? errors : undefined;
} // prettier-ignore
```

`onSuccess` 的型別可以直接在參數中指定，或透過 `validateHttp` 的 `options` 的 `parse` 屬性指定

```ts
onSuccess: (response: { usernameTaken: boolean; profanity: boolean }) => {
  // ...
} // prettier-ignore

// or

options: {
  parse: (response) => response as {usernameTaken: boolean; profanity: boolean};
}
onSuccess: (response) => {
  // ...
} // prettier-ignore
```

`onError` 函式處理請求失敗，例如網路錯誤或 HTTP 錯誤：

```ts
onError: (error) => {
  console.error('Validation request failed:', error);
  return {
    kind: 'serverError',
    message: 'Could not verify. Please try again later.',
  };
} // prettier-ignore
```

### HTTP 選項

從 `request` 函式回傳一個 `HttpResourceRequest` 物件，來自訂 HTTP 請求：

```ts
import {HttpHeaders} from '@angular/common/http';
import {validateHttp} from '@angular/forms/signals';

validateHttp(schemaPath.field, {
  request: ({value}) => ({
    url: `/api/validate?value=${value()}`,
    headers: new HttpHeaders({
      Authorization: 'Bearer token',
    }),
    timeout: 5000,
  }),
  onSuccess: (response: {valid: boolean}) =>
    response.valid
      ? null
      : {
          kind: 'invalid',
          message: 'Invalid value',
        },
  onError: () => ({
    kind: 'requestFailed',
    message: 'Unable to reach server to validate.',
  }),
});
```

TIP: 所有可用選項請見 [httpResource API 文件](api/common/http/httpResource)。

## 使用 validateAsync() 進行自訂非同步驗證 {#custom-async-validation-with-validateasync}

大多數應用程式應該使用 `validateHttp()` 進行非同步驗證。它以最少的設定處理 HTTP 請求，並涵蓋大多數使用情境。

`validateAsync()` 是一個較低階的 API，它直接公開 Angular 的 resource 原語。它提供完整的控制，但需要更多程式碼，也需要熟悉 Angular 的 resource API。

只有在 `validateHttp()` 無法滿足你的需求時，才考慮 `validateAsync()`。一些範例包括：

- **非 HTTP 驗證**：WebSocket 連線、IndexedDB 查詢，或 Web Worker 運算
- **自訂快取策略**：超出簡單 memoization 的應用程式專屬快取
- **複雜的重試邏輯**：自訂 backoff 策略或條件式重試
- **直接存取 resource**：當你需要完整的 resource 生命週期時

### 建立自訂驗證規則

`validateAsync()` 函式需要四個屬性：`params`、`factory`、`onSuccess` 與 `onError`。`params` 函式回傳你的 resource 的參數，而 `factory` 建立該 resource：

```ts
import {Component, inject, signal, resource, Signal} from '@angular/core';
import {form, validateAsync, FormField} from '@angular/forms/signals';
import {UsernameValidator} from './username-validator';

@Component({
  selector: 'app-registration',
  imports: [FormField],
  template: `...`,
})
export class Registration {
  registrationModel = signal({username: ''});

  private usernameValidator = inject(UsernameValidator);
  private cache = new Map<string, {available: boolean}>();

  // Custom resource factory with caching
  createUsernameResource = (usernameSignal: Signal<string | undefined>) => {
    return resource({
      params: () => usernameSignal(),
      loader: async ({params: username}) => {
        if (!username) return undefined;

        // Check cache first
        const cached = this.cache.get(username);
        if (cached !== undefined) return cached;

        // Use injected service for validation
        const result = await this.usernameValidator.checkAvailability(username);

        // Cache result
        this.cache.set(username, result);
        return result;
      },
    });
  };

  registrationForm = form(this.registrationModel, (schemaPath) => {
    validateAsync(schemaPath.username, {
      params: ({value}) => {
        const username = value();
        return username.length >= 3 ? username : undefined!;
      },
      factory: this.createUsernameResource,
      onSuccess: (result) => {
        return result?.available
          ? null
          : {
              kind: 'usernameTaken',
              message: 'Username taken',
            };
      },
      onError: (error) => {
        console.error('Validation failed:', error);
        return {
          kind: 'serverError',
          message: 'Could not verify username',
        };
      },
    });
  });
}
```

`params` 函式在每次值變更時都會執行。回傳 `undefined` 可以略過驗證。`factory` 函式在設定期間只執行一次，並接收以訊號形式提供的 params。當 params 變更時，resource 會自動更新。

### 使用以 Observable 為基礎的服務

如果你的應用程式已有回傳 Observable 的服務，請使用來自 `@angular/core/rxjs-interop` 的 `rxResource`：

```ts
import {Component, inject, signal, Signal} from '@angular/core';
import {rxResource} from '@angular/core/rxjs-interop';
import {form, validateAsync, FormField} from '@angular/forms/signals';
import {UsernameService} from './username-service';

@Component({
  selector: 'app-registration',
  imports: [FormField],
  template: `...`,
})
export class Registration {
  registrationModel = signal({username: ''});

  private usernameService = inject(UsernameService);

  private createUsernameResource = (usernameSignal: Signal<string | undefined>) => {
    return rxResource({
      params: () => usernameSignal(),
      stream: ({params: username}) => this.usernameService.checkUsername(username),
    });
  };

  registrationForm = form(this.registrationModel, (schemaPath) => {
    validateAsync(schemaPath.username, {
      params: ({value}) => value(),
      factory: this.createUsernameResource,
      onSuccess: (result) =>
        result?.available ? null : {kind: 'usernameTaken', message: 'Username taken'},
      onError: () => ({
        kind: 'serverError',
        message: 'Could not verify username',
      }),
    });
  });
}
```

`rxResource` 函式直接與 Observable 配合運作，並在欄位值變更時自動處理訂閱清理。

## 去抖動

`debounce` 規則會延遲使用者輸入被提交到表單模型的時機。你可以把它想成：這條規則會扣住值，直到使用者暫停輸入為止。這在下游行為不應該對每次按鍵都做出反應時很有用，例如成本高昂的衍生運算、會在單字打到一半時閃爍錯誤的驗證，或在每個字元輸入時都重新套用的搜尋篩選。

在 schema 中加入 `debounce` 規則，延遲表單欄位的 UI 變更抵達表單模型的時機。在最簡單的形式下，`debounce(path, ms)` 會把每次 UI 變更扣住指定的毫秒數，再寫入模型。在這個時間窗內出現的新變更會重設計時器。

下列範例把 `debounce` 與 `validateHttp` 套用到使用者名稱欄位，延遲註冊表單中的使用者名稱可用性檢查，直到使用者暫停輸入為止：

```angular-ts
import {Component, signal} from '@angular/core';
import {form, debounce, validateHttp, FormField} from '@angular/forms/signals';

@Component({
  selector: 'app-registration',
  imports: [FormField],
  template: `
    <label>
      Username:
      <input [formField]="registrationForm.username" />
    </label>

    @if (registrationForm.username().pending()) {
      <span class="checking">Checking availability...</span>
    }
  `,
})
export class Registration {
  registrationModel = signal({username: ''});

  registrationForm = form(this.registrationModel, (schemaPath) => {
    // Hold UI updates for 300 ms before writing to the model
    debounce(schemaPath.username, 300);

    // Runs against the debounced model value, not every keystroke
    validateHttp(schemaPath.username, {
      request: ({value}) => {
        const username = value();
        // Skip the request for blank values
        return username ? `/api/users/check?username=${username}` : undefined;
      },
      onSuccess: (response: {available: boolean}) =>
        response.available ? null : {kind: 'usernameTaken', message: 'Username is already taken'},
      onError: () => ({
        kind: 'serverError',
        message: 'Could not verify username availability',
      }),
    });
  });
}
```

在 300 毫秒的去抖動下，模型只有在使用者暫停輸入超過所設定的時間後，才會更新並進行驗證。例如，快速連續輸入「signal forms」只會觸發一次驗證請求，而不是十二次。

### 觸碰時立即寫入模型

不論去抖動的時間長短，當欄位變成 touched 時，框架會立即把欄位的 `controlValue()` 寫入模型。原生輸入會在失焦時變成 touched，因此打完字並以 Tab 切走的使用者，不必等去抖動計時器到期。自訂控制項可以因應它們選擇的任何事件，把欄位標記為 touched。

在典型情況下，這對表單送出很重要。當使用者點選送出按鈕時，聚焦中的輸入會失焦，這會觸碰該欄位，並在送出處理器執行前，清掉它待處理的去抖動。

### 只在失焦時提交

有些欄位根本不應該在輸入途中更新，而應該只在使用者完成值輸入後才更新。例如，如果你有一個在每次變更時都重新套用的搜尋篩選，或一個會觸發成本高昂衍生狀態的表單，模型等到使用者打完字再更新，往往是更好的做法。

在這些情境中，傳入 `'blur'` 而不是時間長度，把所有更新延後到欄位變成 touched 為止：

```ts
form(this.registrationModel, (schemaPath) => {
  debounce(schemaPath.username, 'blur');
});
```

使用 `'blur'` 時，模型在使用者輸入期間會保留它的前一個值。同步與非同步驗證、衍生訊號，以及任何讀取該欄位的反應式規則，在欄位變成 touched 之前，看到的都是前一個值。這種情況通常發生在使用者讓原生輸入失焦時，或自訂控制項自行發出觸碰訊號時。

### 自訂時機邏輯

對於時間長度或 `'blur'` 無法表達的時機邏輯，傳入一個 `Debouncer` 函式。這個函式接收欄位脈絡與一個 [`AbortSignal`](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal)，並回傳一個 `Promise<void>`，它在模型應該更新時 resolve：

```ts
import {debounce, type Debouncer, form} from '@angular/forms/signals';

const shorterWhenLonger: Debouncer<string> = ({value}, abortSignal) => {
  // Shorter queries get a longer delay since the user is likely still typing.
  const ms = value().length < 3 ? 500 : 200;
  return new Promise((resolve) => {
    const timeoutId = setTimeout(resolve, ms);
    // Abort fires when this field is touched or its value changes, so the pending timer is cleared
    abortSignal.addEventListener(
      'abort',
      () => {
        clearTimeout(timeoutId);
        resolve();
      },
      {once: true},
    );
  });
};

const registrationForm = form(registrationModel, (schemaPath) => {
  debounce(schemaPath.username, shorterWhenLonger);
});
```

當欄位被觸碰，或它的值在去抖動 resolve 之前變更時，`abortSignal` 就會觸發。在 abort 時 resolve 這個 promise，讓你的 debouncer 釋放任何待處理的計時器。框架在觸碰時把待處理的值寫入模型，並在新值抵達時丟棄它。完整的 `Debouncer` 簽名請見 [`debounce` API 參考文件](api/forms/signals/debounce)。

### 只對單一非同步驗證器套用去抖動

`debounce` 規則會扣住欄位的所有反應，從同步驗證、衍生訊號到非同步驗證。然而，有時你想要的剛好相反：像 `required` 或 `email` 這類便宜的同步驗證器立即執行以提供即時回饋，而只有成本高昂的非同步呼叫等使用者停下來。`validateHttp()` 與 `validateAsync()` 都接受它們自己的 [`debounce` 選項](api/forms/signals/validateAsync)，只節流那個驗證器：

```ts
form(this.registrationModel, (schemaPath) => {
  validateHttp(schemaPath.username, {
    // Throttles only this HTTP call
    debounce: 300,
    request: ({value}) => {
      const username = value();
      // Skip the request for blank values
      return username ? `/api/users/check?username=${username}` : undefined;
    },
    onSuccess: (response: {available: boolean}) =>
      response.available ? null : {kind: 'usernameTaken', message: 'Username is already taken'},
    onError: () => ({
      kind: 'serverError',
      message: 'Could not verify username availability',
    }),
  });
});
```

模型仍然在每次按鍵時更新，附著在欄位上的任何其他規則也仍然立即做出反應。只有 HTTP 請求被去抖動：每次變更都會等待 300 毫秒的安靜期才發出，因此請求只在使用者暫停輸入後才會送出。

依據範圍在兩個層級之間做選擇：

| 選項                                                        | 使用時機                                                                                                                         |
| ------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| `debounce()` 規則                                             | 同步驗證、衍生狀態與送出都應該等到欄位提交後。整個欄位不應該在輸入途中做出反應。 |
| `validateHttp({ debounce })` 或 `validateAsync({ debounce })` | 便宜的同步驗證器應該提供即時回饋，但成本高昂的非同步呼叫應該等使用者暫停。                  |

兩個選項都接受以毫秒為單位的時間長度。它們的自訂時機回呼不同：表單層級的規則使用 `Debouncer`，驗證器層級的選項使用來自 `@angular/core` 的 `DebounceTimer`。這兩個簽名不可互換。

## 以 factory 在非同步驗證中組合資源

內建的 [`debounce` 選項](api/forms/signals/validateAsync)涵蓋了節流，但 `validateAsync()` 公開了一個更深的組合點：`factory` 函式。這個 factory 以訊號形式接收 params，並回傳一個 resource。在這兩個點之間，你可以自由組合任何你需要的東西。

在最簡單的形式下，一個 factory 包裝單一 resource。使用者名稱可用性檢查可以作為元件類別上的一個方法存在，然後以參考方式接入 `validateAsync`：

```ts
export class Registration {
  registrationModel = signal({username: ''});
  private usernameValidator = inject(UsernameValidator);

  // Factory function
  checkUsernameAvailable = (username: Signal<string | undefined>) =>
    resource({
      params: () => username(),
      loader: async ({params: name}) => this.usernameValidator.checkAvailability(name),
    });

  registrationForm = form(this.registrationModel, (schemaPath) => {
    validateAsync(schemaPath.username, {
      params: ({value}) => {
        const username = value();
        // Skip validation for short usernames
        return username.length >= 3 ? username : undefined!;
      },
      debounce: 300,
      // Reference to the factory defined above
      factory: this.checkUsernameAvailable,
      onSuccess: (result) =>
        result?.available ? null : {kind: 'usernameTaken', message: 'Username taken'},
      onError: () => ({kind: 'serverError', message: 'Could not verify'}),
    });
  });
}
```

`params` 回呼針對短的使用者名稱回傳 `undefined`，表示應該略過驗證。在套用 `debounce: 300` 的情況下，resource 會等到使用者暫停輸入 300 毫秒後，才對每次變更採取行動。接著，它會針對有效的使用者名稱執行 loader，並在去抖動後的值穩定為 `undefined` 後保持閒置。

### 結合去抖動與額外邏輯

當你需要超出單純時間長度去抖動的邏輯時，使用自訂 factory 把去抖動與該邏輯結合。一個常見案例是快取已驗證的回應。例如，一旦伺服器已確認某個使用者名稱，後續按鍵再次回到相同值時，你不需要再問一次。

```ts
export class Registration {
  registrationModel = signal({username: ''});
  private usernameValidator = inject(UsernameValidator);

  registrationForm = form(this.registrationModel, (schemaPath) => {
    validateAsync(schemaPath.username, {
      params: ({value}) => {
        const username = value();
        return username.length >= 3 ? username : undefined;
      },
      factory: (username) => {
        // Core primitive: settles 300 ms after the source stops changing
        const debouncedUsername = debounced(username, 300);
        // Cache lives in the factory's closure and persists for the field's lifetime
        const cache = new Map<string, {available: boolean}>();
        return resource({
          // Read from the debounced signal, not the raw one
          params: () => debouncedUsername.value(),
          loader: async ({params: name}) => {
            const cached = cache.get(name);
            if (cached) return cached;

            const result = await this.usernameValidator.checkAvailability(name);
            cache.set(name, result);
            return result;
          },
        });
      },
      onSuccess: (result) =>
        result?.available ? null : {kind: 'usernameTaken', message: 'Username taken'},
      onError: () => ({
        kind: 'serverError',
        message: 'Could not verify username',
      }),
    });
  });
}
```

`cache` 存在於 factory 的 closure 之中，因此它在欄位的整個生命週期中持續存在。一旦使用者輸入了伺服器已經檢查過的使用者名稱，loader 就會從快取讀取，而不是發出新的網路請求。

## 了解 pending 狀態

當非同步驗證執行時，欄位的 `pending()` 訊號回傳 `true`。在此期間：

- `valid()` 回傳 `false`
- `invalid()` 回傳 `false`
- `errors()` 回傳一個空陣列
- `submit()` 不會等待它；預設情況下 `action` 無論如何都會執行（見 [`ignoreValidators`](guide/forms/signals/form-submission#controlling-validation-gating-with-ignorevalidators)）

在你的範本中顯示 pending 狀態以提供回饋：

```angular-html
<input [formField]="loginForm.username" />

@if (loginForm.username().pending()) {
  <span class="loading">Checking availability...</span>
}

@if (loginForm.username().touched() && loginForm.username().invalid()) {
  @for (error of loginForm.username().errors(); track $index) {
    <span class="error">{{ error.message }}</span>
  }
}
```

在驗證 pending 期間停用表單送出：

```angular-html
<button type="submit" [disabled]="loginForm().pending()">
  @if (loginForm().pending()) {
    Validating...
  } @else {
    Submit
  }
</button>
```

TIP: 更多使用 `pending()`、`valid()` 與 `invalid()` 訊號的模式，請見[欄位狀態管理指南](guide/forms/signals/field-state-management)。

### 驗證執行順序

非同步驗證只有在同步驗證通過後才會執行。這能避免針對無效輸入發出不必要的伺服器請求：

```ts
import {form, required, minLength, validateHttp} from '@angular/forms/signals';
import {model} from '@angular/core';

form(model, (schemaPath) => {
  // 1. These synchronous validation rules run first
  required(schemaPath.username);
  minLength(schemaPath.username, 3);

  // 2. This async validation rule only runs if synchronous validation passes
  validateHttp(schemaPath.username, {
    request: ({value}) => `/api/check?username=${value()}`,
    onSuccess: (result: {valid: boolean}) =>
      result.valid
        ? null
        : {
            kind: 'usernameTaken',
            message: 'Username taken',
          },
    onError: () => ({
      kind: 'serverError',
      message: 'Validation failed',
    }),
  });
});
```

這樣的執行順序能減少伺服器負載並即時抓出格式錯誤，進而提升效能。

### 請求取消

當欄位值變更時，Signal Forms 會自動取消該欄位任何進行中的非同步驗證請求。這能避免競態條件，並確保驗證永遠反映目前的值。你不需要自己實作取消邏輯。

## 最佳實務

### 與同步驗證結合

在發出非同步請求之前，永遠先驗證格式。這能即時抓出錯誤，並避免不必要的伺服器請求：

```ts
import {form, required, email, validateHttp} from '@angular/forms/signals';
import {model} from '@angular/core';

form(model, (schemaPath) => {
  // Validate format first
  required(schemaPath.email);
  email(schemaPath.email);

  // Then check availability
  validateHttp(schemaPath.email, {
    request: ({value}) => `/api/emails/check?email=${value()}`,
    onSuccess: (result: {available: boolean}) =>
      result.available
        ? null
        : {
            kind: 'emailInUse',
            message: 'Email already in use',
          },
    onError: () => ({
      kind: 'serverError',
      message: 'Could not verify email',
    }),
  });
});
```

### 在適當時機略過驗證

從 `request` 函式回傳 `undefined` 來略過驗證。用這個方式避免驗證空欄位，或未達最低要求的值：

```ts
import {validateHttp} from '@angular/forms/signals';

validateHttp(schemaPath.username, {
  request: ({value}) => {
    const username = value();
    // Skip validation for empty or short usernames
    if (!username || username.length < 3) return undefined;

    return `/api/users/check?username=${username}`;
  },
  onSuccess: (result: {valid: boolean}) =>
    result.valid
      ? null
      : {
          kind: 'usernameTaken',
          message: 'Username taken',
        },
  onError: () => ({
    kind: 'serverError',
    message: 'Validation failed',
  }),
});
```

### 優雅地處理錯誤

提供清楚、對使用者友善的錯誤訊息。把技術細節記錄下來供除錯使用，但向使用者顯示簡單的訊息：

```ts
import {validateHttp} from '@angular/forms/signals';

validateHttp(schemaPath.field, {
  request: ({value}) => `/api/validate?field=${value()}`,
  onSuccess: (result: {valid: boolean; message?: string}) => {
    if (result.valid) return null;
    // Use server message when available
    return {
      kind: 'serverError',
      message: result.message || 'Validation failed',
    };
  },
  onError: (error) => {
    // Log for debugging
    console.error('Validation request failed:', error);

    // Show user-friendly message
    return {
      kind: 'serverError',
      message: 'Unable to validate. Please try again later.',
    };
  },
});
```

### 顯示清楚的回饋

使用 `pending()` 訊號來顯示驗證何時正在進行。這能幫助使用者理解延遲，並提供更好的感知效能：

```angular-html
@if (field().pending()) {
  <span class="checking">
    <span class="spinner"></span>
    Checking...
  </span>
}
@if (field().valid() && !field().pending()) {
  <span class="success">Available</span>
}
@if (field().invalid()) {
  <span class="error">{{ field().errors()[0]?.message }}</span>
}
```

## 後續步驟

本指南介紹了使用 `validateHttp()` 與 `validateAsync()` 的非同步驗證。相關指南探討了 Signal Forms 的其他面向：

<docs-pill-row>
  <docs-pill href="guide/forms/signals/validation" title="驗證"/>
  <docs-pill href="guide/forms/signals/field-state-management" title="欄位狀態管理"/>
</docs-pill-row>

詳細的 API 文件請見：

- [`validateHttp()`](api/forms/signals/validateHttp)：以 HTTP 為基礎的非同步驗證
- [`validateAsync()`](api/forms/signals/validateAsync)：以自訂 resource 為基礎的非同步驗證
- [`httpResource()`](api/common/http/httpResource)：Angular 的 HTTP resource API
- [`resource()`](api/core/resource)：Angular 的 resource 原語
