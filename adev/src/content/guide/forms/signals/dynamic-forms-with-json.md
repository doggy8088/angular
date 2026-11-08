# 使用 JSON 的動態表單

有些表單無法在編譯時期就定義好結構。由伺服器驅動的表單、管理後台、多租戶應用程式，以及由 CMS 管理的內容，都需要在執行時期依傳入的設定來呈現欄位，這類設定通常是以 JSON 形式從後端、管理工具或各租戶的設定中取得。

本指南將說明如何建立這類表單：其模型、結構定義、驗證與呈現，全都源自同一份執行時期設定。

## 何時適合用 JSON 驅動的表單

在下列情況下，這種模式是很好的選擇：

- 後端依使用者角色、功能旗標或商業規則，決定要顯示哪些欄位
- 非開發人員透過管理後台或 CMS 設定表單結構
- 多租戶應用程式中，每個租戶都有自己以設定形式儲存的表單結構
- 表單需要演進，卻不想重新部署前端

若表單結構在建置時期就已確定，請使用靜態表單（直接在元件中定義欄位）。靜態表單能對每個欄位進行完整的 TypeScript 檢查，測試與工具支援也更直接。

## 定義具型別的欄位設定

當你想依執行時期設定來呈現欄位時，先從一個 TypeScript 型別著手，用它捕捉每個欄位的形狀。以 `kind` 作為判別欄位的聯集型別，能讓每個變體宣告各自的驗證選項：

```ts
type FieldConfig =
  | {kind: 'text'; name: string; label: string; required?: boolean}
  | {kind: 'number'; name: string; label: string; required?: boolean; min?: number; max?: number};
```

每個變體都有名稱、標籤，以及可選的 `required` 旗標。數字欄位還額外接受 `min` 與 `max` 界限。要新增變體，只要加入新的 `kind` 分支即可。

一份具體的設定可能長這樣：

```ts
const profileConfig: FieldConfig[] = [
  {kind: 'text', name: 'fullName', label: 'Full Name', required: true},
  {kind: 'number', name: 'age', label: 'Age', required: true, min: 18, max: 120},
];
```

實務上，這份 `FieldConfig[]` 通常來自你的後端、管理後台或 CMS。為了簡潔，以下範例使用元件內的常值。

## 從設定建立模型

表單模型需要為每個欄位準備一個項目，其預設值要與欄位的種類相符。一個小小的輔助函式就能處理這件事：

```ts
function buildModel(configs: FieldConfig[]): Record<string, string | number | null> {
  const initial: Record<string, string | number | null> = {};
  for (const config of configs) {
    initial[config.name] = config.kind === 'number' ? null : '';
  }
  return initial;
}
```

模型使用 `Record<string, string | number | null>`，因為鍵名無法事先得知。

此外，數字欄位初始化為 `null` 而非 `0`，這樣空白欄位讀起來就是空白。若用 `0`，[`required()`](api/forms/signals/required) 會把該欄位視為已填寫，而且任何大於零的 [`min()`](api/forms/signals/min) 限制，都會在使用者輸入任何內容之前就把該欄位標為無效。

## 從設定建立結構定義

結構定義同樣源自設定。你可以逐一走訪每個項目，並套用與其種類相符的驗證器：

```ts
import {required, min, max, SchemaFn, SchemaPath} from '@angular/forms/signals';

function buildSchema(configs: FieldConfig[]): SchemaFn<Record<string, string | number | null>> {
  return (path) => {
    for (const config of configs) {
      const fieldPath = path[config.name];

      if (config.required) {
        required(fieldPath);
      }

      if (config.kind === 'number') {
        const numberPath = fieldPath as unknown as SchemaPath<number | null>;
        if (config.min !== undefined) min(numberPath, config.min);
        if (config.max !== undefined) max(numberPath, config.max);
      }
    }
  };
}
```

判別聯集會在每個分支內縮小 `config` 的型別，因此當 `config.kind === 'number'` 時，`config.min` 與 `config.max` 的型別都是正確的。

## 在設定中表達條件規則

有些驗證規則只在特定條件下才有意義。例如，美國州別代碼只有在國家為美國時才需要驗證。要在設定中表達這類相依關係，可以加入一個 `when` 判別欄位，指出另一個欄位的名稱，以及它必須等於的值：

```ts
type WhenCondition = {field: string; equals: string | number};

type FieldConfig =
  | {kind: 'text'; name: string; label: string; required?: boolean; when?: WhenCondition}
  | {
      kind: 'number';
      name: string;
      label: string;
      required?: boolean;
      min?: number;
      max?: number;
      when?: WhenCondition;
    };
```

接著更新 `buildSchema()`，把 `when` 轉換成 [`applyWhen()`](api/forms/signals/applyWhen) 呼叫。把共用的規則套用邏輯移到一個小閉包中，讓有條件與無條件的分支都呼叫同一個函式：

```ts
import {applyWhen, required, min, max, SchemaFn, SchemaPath} from '@angular/forms/signals';

function buildSchema(configs: FieldConfig[]): SchemaFn<Record<string, string | number | null>> {
  return (rootPath) => {
    for (const config of configs) {
      const applyRules = (path: typeof rootPath) => {
        const fieldPath = path[config.name];
        if (config.required) required(fieldPath);
        if (config.kind === 'number') {
          const numberPath = fieldPath as unknown as SchemaPath<number | null>;
          if (config.min !== undefined) min(numberPath, config.min);
          if (config.max !== undefined) max(numberPath, config.max);
        }
      };

      if (config.when) {
        const {field, equals} = config.when;
        applyWhen(rootPath, ({valueOf}) => valueOf(rootPath[field]) === equals, applyRules);
      } else {
        applyRules(rootPath);
      }
    }
  };
}
```

當 `applyWhen()` 的條件為真時，裡面的規則就會啟用；當條件變為假時，規則停用，該欄位的驗證狀態也會清除。由於條件函式是透過 `valueOf(rootPath[field])` 讀值，每當被參照的欄位變更時，表單就會重新評估這道關卡。

一份使用 `when` 的設定長這樣：

```ts
const addressConfig: FieldConfig[] = [
  {kind: 'text', name: 'country', label: 'Country', required: true},
  {
    kind: 'text',
    name: 'stateCode',
    label: 'State',
    required: true,
    when: {field: 'country', equals: 'US'},
  },
];
```

只有當 `country` 為 `'US'` 時，`stateCode` 欄位才需要填值。輸入其他任何國家的使用者，都可以把 `stateCode` 留白，不會因此無法送出表單。

若條件更複雜（多個欄位、範圍，或非相等比較），可以為 `WhenCondition` 加入更多判別欄位（例如 `in: string[]` 或 `notEquals: string | number`），並在 `buildSchema()` 中逐一轉換每個變體。原則相同：設定攜帶資料，`buildSchema()` 把它轉換成 `applyWhen()` 呼叫。

若要控制的是顯示與否而非驗證，可以比照相同模式，在欄位路徑上使用 [`hidden()`](api/forms/signals/hidden)。詳情請參閱[在欄位上設定 `hidden()` 狀態](guide/forms/signals/form-logic#configuring-hidden-state-on-fields)。

## 在設定中表達重複欄位

有些設定需要能在執行時期增減的欄位，例如一串電話號碼、標籤，或發票品項。可以為設定加入 `array` 種類，並將其轉換成 [`applyEach()`](api/forms/signals/applyEach)，讓每個項目的規則在項目增減時都能一致套用。

先為 `FieldConfig` 擴充一個 `array` 變體。以下範例使用字串陣列；把項目形狀換成記錄，同樣的做法也能擴展到物件陣列：

```ts
type FieldConfig =
  | {kind: 'text'; name: string; label: string; required?: boolean; when?: WhenCondition}
  | {
      kind: 'number';
      name: string;
      label: string;
      required?: boolean;
      min?: number;
      max?: number;
      when?: WhenCondition;
    }
  | {kind: 'array'; name: string; label: string; itemRequired?: boolean; when?: WhenCondition};
```

更新 `buildModel()`，讓陣列欄位初始化為空陣列。模型型別隨之放寬，納入 `string[]`：

```ts
function buildModel(configs: FieldConfig[]): Record<string, string | number | null | string[]> {
  const initial: Record<string, string | number | null | string[]> = {};
  for (const config of configs) {
    if (config.kind === 'number') initial[config.name] = null;
    else if (config.kind === 'array') initial[config.name] = [];
    else initial[config.name] = '';
  }
  return initial;
}
```

更新 `buildSchema()`，用 `applyEach()` 套用每個項目的規則。來自 `Record<string, string | number | null | string[]>` 模型的路徑，對 `applyEach()`（以及 `min()`／`max()`）來說太寬，無法直接通過型別檢查，因此要在每個 `kind` 分支內，把 `fieldPath` 轉型為適當的形狀：

```ts
import {
  applyEach,
  applyWhen,
  required,
  min,
  max,
  SchemaFn,
  SchemaPath,
} from '@angular/forms/signals';

function buildSchema(
  configs: FieldConfig[],
): SchemaFn<Record<string, string | number | null | string[]>> {
  return (rootPath) => {
    for (const config of configs) {
      const applyRules = (path: typeof rootPath) => {
        const fieldPath = path[config.name];

        if (config.kind === 'array') {
          const arrayPath = fieldPath as unknown as SchemaPath<string[]>;
          if (config.itemRequired) {
            applyEach(arrayPath, (item) => required(item));
          }
          return;
        }

        if (config.required) required(fieldPath);

        if (config.kind === 'number') {
          const numberPath = fieldPath as unknown as SchemaPath<number | null>;
          if (config.min !== undefined) min(numberPath, config.min);
          if (config.max !== undefined) max(numberPath, config.max);
        }
      };

      if (config.when) {
        const {field, equals} = config.when;
        applyWhen(rootPath, ({valueOf}) => valueOf(rootPath[field]) === equals, applyRules);
      } else {
        applyRules(rootPath);
      }
    }
  };
}
```

每個分支內的轉型都是刻意留下的逃生口：你等於放棄編譯器的結構保證，換取由外層 `kind` 檢查所強制維持的執行時期不變量。每個轉型的作用範圍都侷限在單一 `kind` 區塊內，因此這項假設保持在局部，審查起來也很直接。

一份使用 `array` 種類的設定長這樣：

```ts
const contactConfig: FieldConfig[] = [
  {kind: 'text', name: 'fullName', label: 'Full name', required: true},
  {kind: 'array', name: 'phoneNumbers', label: 'Phone numbers', itemRequired: true},
];
```

要呈現陣列欄位，可以用 `@for` 走訪它，並讓使用者透過更新模型訊號來新增或移除項目。加入一個具型別的存取器，回傳 [`FieldTree`](api/forms/signals/FieldTree)，讓走訪能看見陣列結構；同時定義增減模型的方法：

```ts
import {FieldTree} from '@angular/forms/signals';

// inside the component class
asArrayField(name: string): FieldTree<string[]> {
  return this.dynamicForm[name] as unknown as FieldTree<string[]>;
}

addItem(name: string) {
  this.model.update(current => ({
    ...current,
    [name]: [...(current[name] as string[]), ''],
  }));
}

removeItem(name: string, index: number) {
  this.model.update(current => ({
    ...current,
    [name]: (current[name] as string[]).filter((_, i) => i !== index),
  }));
}
```

`FieldTree<string[]>` 可以走訪，因此 `@for` 能逐項處理；每個項目都是一個 `FieldTree<string>`，能直接滿足 `[formField]`。葉欄位則可以改用 `Field<T>` 存取器，因為 `Field<T>` 是可呼叫簽章，不具走訪能力。

在範本中，陣列的情況可以這樣呈現：

```angular-html
@case ('array') {
  <fieldset>
    <legend>{{ config.label }}</legend>
    @for (item of asArrayField(config.name); track item) {
      <input type="text" [formField]="item" />
      <button type="button" (click)="removeItem(config.name, $index)">Remove</button>
    }
    <button type="button" (click)="addItem(config.name)">Add</button>
  </fieldset>
}
```

`addItem()` 方法會擴充模型，表單會自動重新推導陣列的欄位。新項目從全新的驗證狀態開始。`removeItem()` 方法會篩選模型。由於基本型別陣列是[依位置追蹤](#tracking-item-identity)的，欄位狀態與索引綁定，而非與值綁定：當某個項目被移除時，後面的值會移入較前面的位置，並繼承該位置原有的欄位狀態，最末尾的欄位則會被捨棄。

### 追蹤項目身分 {#tracking-item-identity}

Signal Forms 會依身分追蹤物件陣列中的每個項目。當你保存了指向特定位置欄位的參照時，該參照跟隨的是底層資料，而不是位置。透過保存的參照讀取狀態，即使資料已經移動，仍會回傳該資料：

```ts
const contactModel = signal([
  {name: 'Alice', phone: '555-0001'},
  {name: 'Bob', phone: '555-0002'},
]);

const contactForm = form(contactModel);

// Hold a reference to the field that's currently at index 0 (Alice).
const aliceField = contactForm[0];

// Swap the array items so Bob is at index 0, Alice at index 1.
contactModel.update(([alice, bob]) => [bob, alice]);

// The held reference still points to Alice's field, even after the swap.
console.log(aliceField().value().phone); // '555-0001' (Alice's number)
console.log(contactForm[0]().value().phone); // '555-0002' (Bob, now at index 0)
```

這種身分追蹤能避免排序、重排或篩選時出現錯誤，前提是被參照的項目還留在陣列中。即使陣列順序改變，保存下來的欄位參照依然有效；若移除的正是被參照的項目本身，該參照就會變成孤兒。

對於基本型別陣列（前述 `phoneNumbers` 範例），Signal Forms 改以位置追蹤項目：索引 0 永遠指向目前位於位置 0 的值。

這裡的身分指的是 JavaScript 物件參照，而不是資料庫鍵之類的邏輯 id。若你把陣列換成剛反序列化出的新物件（例如伺服器重新載入之後），即使每個項目的 `id` 都沒變，欄位狀態也不會跟隨邏輯項目。這項保證涵蓋的是排序、重排與篩選等記憶體內操作，不涵蓋資料刷新。

## 驗證設定

來自外部來源的設定，必須在建立表單之前先驗證。未受信任的 JSON 中可能藏著幾種失敗模式：

- 重複的 `name` 值會覆寫先前的模型項目，並破壞範本中的 `track config.name` 運算式。
- 參照不存在欄位的 `when` 子句，會在條件第一次求值時於執行時期失敗。
- 對 `array` 欄位進行比較的 `when` 子句，沒有定義好的相等語意。
- `when.equals` 的值若型別與被參照欄位的種類不符，就會靜靜地永遠比不到，讓條件行為像是規則從未啟用一樣被藏起來。

在邊界就攔下這四種情況：

```ts
function validateConfigs(configs: FieldConfig[]): FieldConfig[] {
  const knownNames = new Set<string>();

  for (const config of configs) {
    if (knownNames.has(config.name)) {
      throw new Error(`Duplicate field name in config: "${config.name}"`);
    }
    knownNames.add(config.name);
  }

  for (const config of configs) {
    if (!config.when) continue;
    if (!knownNames.has(config.when.field)) {
      throw new Error(
        `Field "${config.name}" references unknown field "${config.when.field}" in its 'when' condition.`,
      );
    }
    const referenced = configs.find((c) => c.name === config.when!.field)!;
    if (referenced.kind === 'array') {
      throw new Error(
        `Field "${config.name}" cannot use 'when' to compare against array field "${config.when.field}".`,
      );
    }
    const expected = referenced.kind === 'text' ? 'string' : 'number';
    if (typeof config.when.equals !== expected) {
      throw new Error(
        `Field "${config.name}" compares ${referenced.kind} field "${config.when.field}" against a ${typeof config.when.equals} value; expected a ${expected}.`,
      );
    }
  }

  return configs;
}
```

第一輪走訪強制名稱唯一；第二輪走訪每個 `when` 子句，確認被參照的欄位存在、不是陣列，而且比較的值型別正確。驗證成功時，函式會原封不動地回傳設定，因此能順暢地與元件中保存設定的欄位初始化銜接。失敗會在你的應用程式與上游來源之間的邊界浮現，而不是日後以難以理解的表單異常行為出現。

## 動態呈現表單

在元件中，使用 `@for` 走訪設定，並依 `kind` 用 `@switch` 挑選正確的輸入控制項：

```angular-ts
import {Component, signal} from '@angular/core';
import {Field, FieldTree, form, FormField, FormRoot} from '@angular/forms/signals';

@Component({
  selector: 'app-dynamic-form',
  imports: [FormField, FormRoot],
  template: `
    <form [formRoot]="dynamicForm">
      @for (config of configs; track config.name) {
        @switch (config.kind) {
          @case ('text') {
            <label>
              {{ config.label }}
              <input type="text" [formField]="asTextField(config.name)" />
            </label>
          }
          @case ('number') {
            <label>
              {{ config.label }}
              <input type="number" [formField]="asNumberField(config.name)" />
            </label>
          }
          @case ('array') {
            <fieldset>
              <legend>{{ config.label }}</legend>
              @for (item of asArrayField(config.name); track item; let i = $index) {
                <input type="text" [formField]="item" />
                <button type="button" (click)="removeItem(config.name, i)">Remove</button>
              }
              <button type="button" (click)="addItem(config.name)">Add</button>
            </fieldset>
          }
        }
      }
    </form>
  `,
})
export class DynamicForm {
  configs: FieldConfig[] = validateConfigs([
    {kind: 'text', name: 'fullName', label: 'Full Name', required: true},
    {kind: 'number', name: 'age', label: 'Age', required: true, min: 18, max: 120},
    {kind: 'array', name: 'phoneNumbers', label: 'Phone numbers', itemRequired: true},
  ]);

  model = signal(buildModel(this.configs));

  dynamicForm = form(this.model, buildSchema(this.configs));

  asTextField(name: string): Field<string> {
    // <input type="text"> requires Field<string>.
    return this.dynamicForm[name] as unknown as Field<string>;
  }

  asNumberField(name: string): Field<number | null> {
    // <input type="number"> requires Field<number | null>.
    return this.dynamicForm[name] as unknown as Field<number | null>;
  }

  asArrayField(name: string): FieldTree<string[]> {
    // FieldTree (not Field) so @for can iterate the array.
    return this.dynamicForm[name] as unknown as FieldTree<string[]>;
  }

  addItem(name: string) {
    this.model.update((current) => ({
      ...current,
      [name]: [...(current[name] as string[]), ''],
    }));
  }

  removeItem(name: string, index: number) {
    this.model.update((current) => ({
      ...current,
      [name]: (current[name] as string[]).filter((_, i) => i !== index),
    }));
  }
}
```

範本的型別檢查會把 `dynamicForm[name]` 視為獨立運算式，因此 `@switch` 對 `config.kind` 的型別縮小不會傳遞到索引存取。這些存取器在繫結位置以轉型重述了縮小結果，而相符的 `kind` 分支保證縮小後的型別在執行時期正確。

由於模型與結構定義都是在元件建構時，從同一份 `FieldConfig[]` 推導出來的，對同一份設定而言，兩者不可能漸行漸遠。以上範例假設設定在元件建立時就能同步取得。

## 後續步驟

JSON 驅動的表單讓模型與結構定義都源自同一份 `FieldConfig[]`，藉此讓兩者保持一致。本指南中的每項擴充（條件規則、重複欄位）都會放寬型別，並在 `buildSchema()` 中多加一個轉換步驟，同時保留這份一致性。無論設定來自何處、如何成長，模型與結構定義始終緊密相連。

想了解 Signal Forms 其他面向的相關指南，請參閱：

<docs-pill-row>
  <docs-pill href="guide/forms/signals/schemas" title="結構定義與結構定義可組合性" />
  <docs-pill href="guide/forms/signals/validation" title="驗證" />
  <docs-pill href="guide/forms/signals/form-logic" title="加入表單邏輯" />
  <docs-pill href="guide/forms/signals/field-state-management" title="欄位狀態管理" />
</docs-pill-row>

詳細 API 文件請參閱：

- [`form()`](api/forms/signals/form) - 從模型訊號建立表單
- [`applyWhen()`](api/forms/signals/applyWhen) - 依反應式狀態，有條件地套用結構定義
- [`applyEach()`](api/forms/signals/applyEach) - 對陣列欄位的每個項目套用結構定義
- [`FieldTree`](api/forms/signals/FieldTree) - `form()` 所公開、可走訪的欄位樹
- [`SchemaFn`](api/forms/signals/SchemaFn) - 結構定義函式的型別簽章
