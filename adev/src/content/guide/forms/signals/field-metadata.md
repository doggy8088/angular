# 欄位中繼資料

欄位中繼資料是你可以附加到個別欄位的反應式資料。Angular 內建的限制驗證器（例如 `required()` 與 `min()`）在內部就使用這套系統。換句話說，每次你呼叫驗證器時，都是在為該欄位的中繼資料鍵做出一份貢獻。

本指南將深入說明這套中繼資料系統：歸約器（reducer）如何合併多條結構描述規則的貢獻、如何撰寫自訂歸約器、讀取如何與 `hasMetadata()` 組合，以及受管理的中繼資料如何把具備生命週期感知能力的物件繫結到個別欄位。

## 你其實早就在使用中繼資料了

當你在結構描述中呼叫 `required()`，並在範本中讀取結果欄位上的 `.required()` 時，你用的就是中繼資料系統。`state.required` 並不是特例屬性，它是一個便利的 getter，回傳內建 `REQUIRED` 中繼資料鍵的目前值。

```angular-ts
import {Component, signal} from '@angular/core';
import {form, required, FormField} from '@angular/forms/signals';

@Component({
  selector: 'app-registration',
  imports: [FormField],
  template: `
    <form>
      <label>
        Username
        @if (registrationForm.username().required()) {
          <span class="required-marker" aria-hidden="true">*</span>
        }
        <input [formField]="registrationForm.username" />
      </label>
    </form>
  `,
})
export class Registration {
  registrationModel = signal({username: ''});

  registrationForm = form(this.registrationModel, (path) => {
    required(path.username);
  });
}
```

呼叫 `required(path.username)` 會為該欄位上的 `REQUIRED` 中繼資料鍵貢獻一個值。讀取 `registrationForm.username().required()` 會回傳累積後的值。中繼資料鍵就是連接這兩端的橋梁。

有幾個內建的限制驗證器都遵循這個模式：

| 驗證器        | 中繼資料鍵                 | 型別                  | `FieldState` getter |
| ------------- | -------------------------- | --------------------- | ------------------- |
| `required()`  | `REQUIRED`                 | `boolean`             | `required`          |
| `min()`       | `MIN` 選取 `MIN_NUMBER`    | `number \| undefined` | `min`               |
| `max()`       | `MAX` 選取 `MAX_NUMBER`    | `number \| undefined` | `max`               |
| `minDate()`   | `MIN` 選取 `MIN_DATE`      | `Date \| undefined`   | `min`               |
| `maxDate()`   | `MAX` 選取 `MAX_DATE`      | `Date \| undefined`   | `max`               |
| `minLength()` | `MIN_LENGTH`               | `number \| undefined` | `minLength`         |
| `maxLength()` | `MAX_LENGTH`               | `number \| undefined` | `maxLength`         |
| `pattern()`   | `PATTERN`                  | `RegExp[]`            | `pattern`           |

像 `email()` 與 `validate()` 這類非限制驗證器，不會對中繼資料做出貢獻。它們會執行檢查並呈現驗證錯誤，但不會發布可供範本讀取的反應式值。

## 何時使用自訂中繼資料

當你需要把反應式資料附加到特定欄位，而內建的狀態訊號（如 `valid()`、`disabled()` 與 `touched()`）又涵蓋不到時，請使用**自訂中繼資料**。

舉例來說，可能包括：

- **附加在可重用欄位結構描述上的設定**。例如價格欄位上的貨幣符號，讓任何呈現該欄位的範本或自訂控制項都能顯示它；或是日期欄位上的 `MIN_DATE` 與 `MAX_DATE`，供可重用的範圍選擇器讀取。
- **在同一欄位的多條規則之間共享的解析後值**。例如把電話號碼解析一次成 E.164 格式，讓格式驗證器與唯一性檢查都讀取同一份正規形式，不必重複解析。
- **由欄位狀態組裝而成的顯示提示**。例如嚴重程度等級（`'info' | 'warning' | 'error'`），UI 會將其對應到徽章與圖示；或是會依使用者已輸入的內容與其他欄位的填寫情況而變化的情境感知說明訊息。

若你發現自己在表單旁邊另外維護一份平行的 `Map<fieldKey, value>`，逐欄位追蹤某些東西，那就是該用中繼資料的訊號。中繼資料與結構描述放在一起、保持反應式，並參與欄位的生命週期。

## 建立中繼資料鍵

想建立自訂鍵時，請呼叫 `createMetadataKey<TWrite>()`。型別參數描述的是你的結構描述規則將貢獻的值。

```ts
import {createMetadataKey} from '@angular/forms/signals';

export const USERNAME_HELP = createMetadataKey<string>();
```

每次呼叫 `createMetadataKey()` 都會建立一個全新的唯一鍵。即使兩次呼叫的型別參數相同，仍是兩個不同的鍵，因此每個鍵只在模組範圍定義一次，並在需要的地方匯入。

NOTE: 沒有歸約器的鍵，預設使用「覆寫」語意：若多條規則都設定了該鍵，最後一份貢獻勝出。

## 從結構描述設定值

當你需要為特定欄位上的鍵註冊一個值時，請在結構描述函式內使用 `metadata(path, key, logic)`。

```angular-ts
import {Component, computed, signal} from '@angular/core';
import {form, metadata, FormField} from '@angular/forms/signals';
import {USERNAME_HELP} from './metadata-keys';

@Component({
  selector: 'app-registration',
  imports: [FormField],
  template: `
    <form>
      <label>
        Username
        <input [formField]="registrationForm.username" />
      </label>
      <p class="help">{{ usernameHelp() }}</p>
    </form>
  `,
})
export class Registration {
  registrationModel = signal({username: ''});

  registrationForm = form(this.registrationModel, (path) => {
    metadata(path.username, USERNAME_HELP, ({value}) => {
      const username = value();
      if (username.length === 0) {
        return 'Choose a unique username between 3 and 20 characters.';
      }
      if (username.length < 3) {
        return 'Keep typing, usernames are at least 3 characters.';
      }
      if (username.length > 20) {
        return 'Usernames are at most 20 characters.';
      }
      return 'Looks good.';
    });
  });

  usernameHelp = computed(() => this.registrationForm.username().metadata(USERNAME_HELP)?.() ?? '');
}
```

邏輯函式會收到欄位的上下文，其中以訊號形式公開欄位目前值的 `value`、欄位的 `FieldState` 型別的 `state`，以及讀取同一表單中其他欄位的方法，如 `valueOf(path)` 與 `stateOf(path)`。函式讀取的任何訊號都會成為反應式相依：當 `value()` 變更時，中繼資料會重新計算，任何讀取該鍵的範本也會隨之更新。

## 從欄位讀取中繼資料

若有任何結構描述規則在這個欄位上註冊了該鍵，`hasMetadata(key)` 會回傳 `true`。`state.metadata(key)` 在沒有規則註冊該鍵時回傳 `undefined`，否則回傳目前歸約後值的訊號。

```ts
registrationForm.username().hasMetadata(USERNAME_HELP); // true if any metadata() rule registered this key
```

內層值的形狀（它本身是否可以是 `undefined`、保存的是什麼型別）取決於該鍵的歸約器。歸約器將在下一節說明。

當該鍵可能未被註冊時，請用 `hasMetadata()` 把守讀取：

```angular-html
@if (registrationForm.username().hasMetadata(USERNAME_HELP)) {
  <p class="help">{{ registrationForm.username().metadata(USERNAME_HELP)!() }}</p>
}
```

當你確定某條規則一定會註冊該鍵時（因為同一檔案中的結構描述就是這麼做的），可以略過 `hasMetadata()` 檢查，改用可選鏈結作為精簡的替代寫法：

```ts
const message = registrationForm.username().metadata(USERNAME_HELP)?.();
// message: string | undefined
```

或者，當規則保證已註冊時，拿掉可選鏈結並直接斷言：

```ts
const message = registrationForm.username().metadata(USERNAME_HELP)!();
// message: string | undefined (still, because the inner value may be undefined)
```

前面的元件範例在 `computed()` 內使用可選鏈結，讓範本繫結到純粹的 `string`，並為初始畫面準備了空字串作為後備值。

以上就是單一貢獻者的完整 API。下一節將說明：當多條結構描述規則對同一個鍵做出貢獻時會發生什麼事，以及如何用歸約器合併這些貢獻。

## 用歸約器合併貢獻

覆寫語意在只有一條規則對欄位上的鍵做出貢獻時行得通。一旦有兩條規則貢獻，第一個值就會被靜靜捨棄：

```ts
const HELP = createMetadataKey<string>();

form(model, (path) => {
  metadata(path.username, HELP, () => 'Choose something unique across the system.');
  metadata(path.username, HELP, () => 'Usernames are 3 to 20 characters.');
});
```

兩條規則都執行完後，`state.metadata(HELP)!()` 只會回傳第二則訊息。這幾乎絕不是你想要的結果。貢獻往往來自不同來源：兩份用 `apply()` 組合的結構描述各自附加了說明文字，或是多條驗證規則各自貢獻一則提示。

若要合併貢獻，請把歸約器傳給 `createMetadataKey()`。歸約器描述如何把個別的值摺疊成累積結果：

```ts
import {createMetadataKey, MetadataReducer, form, metadata} from '@angular/forms/signals';
import {model} from '@angular/core';

const HELP = createMetadataKey<string, string[]>(MetadataReducer.list());

form(model, (path) => {
  metadata(path.username, HELP, () => 'Choose something unique across the system.');
  metadata(path.username, HELP, () => 'Usernames are 3 to 20 characters.');
});

// state.metadata(HELP)!() === [
//   'Choose something unique across the system.',
//   'Usernames are 3 to 20 characters.',
// ]
```

注意 `createMetadataKey<TWrite, TAcc>` 上的兩個型別參數：第一個是每條規則貢獻的型別，第二個是歸約器產生的型別。使用 `list()` 時，規則貢獻的是 `string`，欄位讀回的是 `string[]`。

### 內建歸約器

Angular 在 [`MetadataReducer`](api/forms/signals/MetadataReducer) 命名空間上提供了六個內建歸約器。`override()` 有兩種形式，語意略有不同，在表中分開列出：

| 歸約器         | 累加器型別            | 作用                                                           | 初始值        |
| -------------- | --------------------- | -------------------------------------------------------------- | ------------- |
| `list<T>()`    | `T[]`                 | 接受 `T \| undefined` 貢獻；附加非 `undefined` 的值            | `[]`          |
| `or()`         | `boolean`             | 只要任一貢獻為 `true` 即為 `true`                              | `false`       |
| `and()`        | `boolean`             | 只有每個貢獻都為 `true` 時才為 `true`                          | `true`        |
| `min()`        | `number \| undefined` | 保留貢獻數字中最小的一個                                       | `undefined`   |
| `max()`        | `number \| undefined` | 保留貢獻數字中最大的一個                                       | `undefined`   |
| `override()`   | `T \| undefined`      | 最後一份貢獻取代先前的（預設行為）                             | `undefined`   |
| `override(fn)` | `T`                   | 同上，但提供初始值                                             | `fn()`        |

`list()` 是唯一一個項目型別比累加器元素型別更寬的內建歸約器。規則可以貢獻 `undefined`，歸約器會靜靜地將其捨棄。內建的 `PATTERN` 鍵就是這樣處理動態 `pattern()` 規則的：當其邏輯函式回傳 `undefined` 時，這份 `undefined` 貢獻會被略過，而不是被納入最終的正規表示式清單。

### 內建驗證器鍵如何使用歸約器

雖然 `MetadataReducer.min()` 與 `MetadataReducer.max()` 是歸約器，但你可能會驚訝地發現，它們並不是驗證器。`MetadataReducer.min()` 挑選對鍵的最小貢獻，而 `min()` 驗證器則是對欄位值強制下限。兩者名稱相同，解決的卻是不同的問題。

內建限制鍵會依該限制下「最嚴格」的含義來挑選歸約器，而這往往與鍵名暗示的方向相反：

| 鍵           | 歸約器           | 理由                                                                                                                                   |
| ------------ | ---------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| `REQUIRED`   | `or()`           | 若任一 `required()` 規則求值為 `true`，該欄位即為必填。                                                                                |
| `MIN_NUMBER` | `max()`          | 數字下限在值最大時最嚴格。若一條規則要求 `>= 5`、另一條要求 `>= 10`，有效的最小值就是 `10`。                                           |
| `MIN_DATE`   | `max()`          | 與 `MIN_NUMBER` 相同的邏輯：最晚的必填日期勝出。                                                                                       |
| `MAX_NUMBER` | `min()`          | 數字上限在值最小時最嚴格。若一條規則上限為 `100`、另一條為 `50`，有效的最大值就是 `50`。                                               |
| `MAX_DATE`   | `min()`          | 與 `MAX_NUMBER` 相同的邏輯：最早允許的日期勝出。                                                                                       |
| `MIN_LENGTH` | `max()`          | 與 `MIN_NUMBER` 相同的邏輯：最長的必填長度勝出。                                                                                       |
| `MAX_LENGTH` | `min()`          | 與 `MAX_NUMBER` 相同的邏輯：最短允許的長度勝出。                                                                                       |
| `PATTERN`    | `list<RegExp>()` | 每次 `pattern()` 呼叫都貢獻一條正規表示式；值必須全部符合。                                                                            |

`MIN` 與 `MAX` 是選取鍵。它們指向與欄位值型別相符的具體鍵，例如 `min()` 對應 `MIN_NUMBER`、`minDate()` 對應 `MIN_DATE`。這就是為什麼 `field().min()` 與 `field().max()` 對數字與日期欄位都能運作。

這種「最嚴格者勝出」的配對，正是在兩份組合的結構描述中呼叫 `min(path.age, 18)` 與 `min(path.age, 21)` 能正確運作的原因。每次呼叫都會註冊自己的驗證器，強制其特定的界限（因此低於任一界限的值都會驗證失敗）。同時，每次呼叫都會對 `MIN_NUMBER` 鍵做出貢獻，而 `state.min!()` 會回報彙總結果（`21`），讓 UI 與自訂控制項能讀取有效的最小值。

### 撰寫自訂歸約器

想撰寫自己的歸約器時，請實作一個符合 `MetadataReducer<TAcc, TItem>` 介面的物件：

```ts
interface MetadataReducer<TAcc, TItem> {
  reduce: (acc: TAcc, item: TItem) => TAcc;
  getInitial: () => TAcc;
}
```

當沒有任何內建歸約器符合你需要的語意時，你可以定義自訂歸約器。例如，一個 `SEVERITY` 鍵，保留任一規則所貢獻的最嚴重等級：

```ts
import {createMetadataKey, type MetadataReducer} from '@angular/forms/signals';

type Severity = 'info' | 'warning' | 'error';

const SEVERITY_RANK: Record<Severity, number> = {info: 0, warning: 1, error: 2};

const maxSeverity: MetadataReducer<Severity | undefined, Severity> = {
  reduce(acc, item) {
    if (acc === undefined) return item;
    return SEVERITY_RANK[item] > SEVERITY_RANK[acc] ? item : acc;
  },
  getInitial: () => undefined,
};

export const SEVERITY = createMetadataKey<Severity, Severity | undefined>(maxSeverity);
```

現在，無論多少條規則都能貢獻嚴重程度，欄位會回報其中最高者：

```ts
form(model, (path) => {
  metadata(path.password, SEVERITY, () => 'info');
  metadata(path.password, SEVERITY, ({value}) => (value().length < 12 ? 'warning' : 'info'));
  metadata(path.password, SEVERITY, ({value}) =>
    /password|1234/i.test(value()) ? 'error' : 'info',
  );
});
```

只要任一貢獻的訊號變更，歸約器就會執行，因此 `state.metadata(SEVERITY)!()` 會與所有規則中目前最嚴重的情況保持同步。

TIP: 讓你的歸約器保持純粹：`reduce()` 應該只依賴它的兩個引數，`getInitial()` 每次被呼叫時都應該回傳相同的值。歸約器是在反應式計算中執行的，只要任一貢獻的訊號變更就會重新執行，因此不純粹的歸約器會產生不一致的中繼資料。

## 用受管理的中繼資料附加具生命週期感知能力的物件

受管理的中繼資料（managed metadata）是在欄位上儲存一個具生命週期感知能力的物件，而不是反應式值。適合用在逐欄位的物件上，例如取得外部資料的 `resource()`、同步到外部系統的 `effect()`，或是作用範圍侷限在單一欄位的服務控制代碼（handle）。

### 建立受管理的鍵

想定義受管理的鍵時，請呼叫 `createManagedMetadataKey<TRead, TWrite>(create)`。你傳入的 `create` 函式會產生該鍵所保存的值。

```ts
import {Signal} from '@angular/core';
import {httpResource} from '@angular/common/http';
import {createManagedMetadataKey} from '@angular/forms/signals';

export interface UrlPreview {
  title: string;
  description?: string;
  image?: string;
}

export const URL_PREVIEW = createManagedMetadataKey((_state, url: Signal<string | undefined>) => {
  return httpResource<UrlPreview>(() => {
    const currentUrl = url();
    return currentUrl ? {url: '/api/url-preview', params: {url: currentUrl}} : undefined;
  });
});
```

`create` 函式會收到欄位的 `FieldState`，以及一個 `Signal<TAcc>`，其中是 `metadata()` 規則為這個鍵貢獻的資料；它回傳應該存在欄位上的物件。回傳值會原封不動地儲存：與非受管理的鍵不同，框架不會把它包進 `computed()` 裡。

`create` 會在欄位建構時執行一次，位置在該欄位的注入上下文中。這讓你可以在 `create` 內呼叫 `inject()`、`resource()` 與 `effect()`，並把清理工作繫結到欄位的生命週期：當欄位被銷毀時，Angular 會銷毀該注入上下文，你在其中註冊的任何 `resource()`、`effect()` 或 `DestroyRef` 回呼都會自動清理。

由於 `create` 本身不具反應性，任何需要回應訊號變化的行為，都必須放在那次初始呼叫中所建立的 `effect()`、`resource()` 或 `httpResource()` 裡面。`URL_PREVIEW` 正示範了這個模式：`httpResource()` 在它的請求函式內讀取 URL 訊號，因此每當訊號變更時，請求就會重新執行。結構描述規則（`metadata(path.url, URL_PREVIEW, ({value}) => value())`）決定要餵入什麼資料；受管理的鍵決定要拿這些資料做什麼。

### 在表單中使用受管理的鍵

當你需要在表單中使用受管理的鍵時，請為該鍵註冊一條 `metadata()` 規則，然後從欄位狀態讀取回傳的物件。

```angular-ts
import {Component, computed, signal} from '@angular/core';
import {applyEach, form, metadata, FormField} from '@angular/forms/signals';
import {URL_PREVIEW} from './url-preview';

@Component({
  selector: 'app-link-editor',
  imports: [FormField],
  template: `
    <form>
      @for (link of linksForm.links; track link) {
        <fieldset>
          <label>
            URL
            <input [formField]="link.url" />
          </label>
          <!-- Read the URL_PREVIEW key for this link's url field; the result is the resource its create function produced -->
          @let preview = link.url().metadata(URL_PREVIEW);
          @if (preview?.isLoading()) {
            <p>Loading preview...</p>
          } @else if (preview?.hasValue() && preview.value(); as data) {
            <article class="preview">
              <h3>{{ data.title }}</h3>
              @if (data.description) {
                <p>{{ data.description }}</p>
              }
            </article>
          } @else if (preview?.error()) {
            <p class="error">Could not load preview.</p>
          }
        </fieldset>
      }
      <button type="button" (click)="addLink()">Add link</button>
    </form>
  `,
})
export class LinkEditor {
  URL_PREVIEW = URL_PREVIEW;

  linksModel = signal({links: [{url: ''}]});

  linksForm = form(this.linksModel, (path) => {
    // Register the URL_PREVIEW key on each link's url field.
    // applyEach runs the schema per item, so create() runs once per link
    // and each link gets its own resource.
    applyEach(path.links, (itemPath) => {
      metadata(itemPath.url, URL_PREVIEW, ({value}) => value());
    });
  });

  addLink() {
    this.linksForm.links().value.update((links) => [...links, {url: ''}]);
  }
}
```

每個陣列項目都會獲得自己的 `URL_PREVIEW` 資源，因為 `applyEach` 會針對每個項目獨立註冊結構描述規則。當使用者新增連結時，`create` 會為新項目的欄位執行。當連結被移除時（此處未示範，但這是常見的模式），框架會連同資源一起拆解該欄位的注入器。

## 後續步驟

請記住，中繼資料存在的目的，是讓反應式資料能隨著欄位一起，經過結構描述的組合、跨規則累積，並隨著欄位的生命週期一起拆解。它運用了與 Angular 內建驗證器相同的系統，也能依你的使用情境量身調整。

詳細 API 文件請參閱：

- [`createMetadataKey()`](api/forms/signals/createMetadataKey) - 定義可帶有歸約器的中繼資料鍵
- [`createManagedMetadataKey()`](api/forms/signals/createManagedMetadataKey) - 定義具生命週期感知能力的中繼資料鍵
- [`metadata()`](api/forms/signals/metadata) - 在結構描述中為中繼資料鍵貢獻一個值
- [`MetadataReducer`](api/forms/signals/MetadataReducer) - 用於合併貢獻的內建歸約器

想了解 Signal Forms 的其他相關指南，請參閱：

<docs-pill-row>
  <docs-pill href="guide/forms/signals/form-logic" title="加入表單邏輯" />
  <docs-pill href="guide/forms/signals/validation" title="驗證" />
  <docs-pill href="guide/forms/signals/field-state-management" title="欄位狀態管理" />
  <docs-pill href="guide/forms/signals/async-operations" title="非同步操作" />
</docs-pill-row>
