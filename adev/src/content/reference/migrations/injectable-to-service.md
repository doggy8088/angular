# 從 `@Injectable` 遷移到 `@Service`

此原理圖會把符合資格的 `@Injectable` 類別轉換為 [`@Service`](/api/core/Service) 裝飾器，它是 `@Injectable({providedIn: 'root'})` 的便利簡寫。
它自 v22.1 起提供，而且只遷移被認為可安全遷移的類別。

使用以下指令執行此原理圖：

```bash
ng generate @angular/core:service
```

宣告了 `providedIn: 'root'` 的類別，會變成不帶任何選項的 `@Service`。

#### 遷移前

```ts
import {Injectable} from '@angular/core';

@Injectable({providedIn: 'root'})
export class MyService {}
```

#### 遷移後

```ts
import {Service} from '@angular/core';

@Service()
export class MyService {}
```

沒有宣告任何選項的類別不會被自動提供，因此遷移會以 `autoProvided: false` 保留這個行為。
你仍然需要負責把它加入 `providers` 陣列，一如以往。

#### 遷移前 {#no-options-before}

```ts
import {Injectable} from '@angular/core';

@Injectable()
export class MyService {}
```

#### 遷移後 {#no-options-after}

```ts
import {Service} from '@angular/core';

@Service({autoProvided: false})
export class MyService {}
```

更多細節請見[選擇不自動提供](guide/di/creating-and-using-services#opting-out-of-automatic-provisioning)。

## 設定選項

### `--path`

依預設，遷移會更新你整個 Angular CLI 工作區，包括測試檔案。
你可以使用這個選項，把遷移限制在特定的子目錄。

```bash
ng generate @angular/core:service --path src/app/sub-component
```

## 限制

為了避免為你的應用程式引入破壞，當發生以下情況時，此原理圖會跳過該類別：

- 該類別，或你自己的原始碼中最近一個定義了建構函式的祖先類別，透過其建構函式注入依賴。
- `@Injectable` 裝飾器收到了 `providedIn` 以外的任何選項。
- `providedIn` 選項被設為 `'root'` 以外的值。

當檔案中每一個 `@Injectable` 都完成遷移時，遷移會移除 `Injectable` 的匯入。
如果檔案中同時有已遷移與被跳過的類別，則兩個匯入都會保留。

如果遷移報告說它找不到任何要遷移的檔案，那就表示它沒有更動任何檔案。
可能是它找不到可以轉換的 `@Injectable` 類別，也可能程式碼已經遷移完成。
建構函式注入是被跳過最常見的原因，你可以先執行[遷移到 `inject` 函式](reference/migrations/inject-function)，然後再執行一次這項遷移。
