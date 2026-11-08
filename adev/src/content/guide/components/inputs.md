# 以輸入屬性接受資料

TIP: 本指南假設你已讀過[基礎指南](essentials)。如果你是 Angular 新手，請先閱讀該指南。如果你熟悉其他網頁框架，輸入屬性類似 _props_。

當你使用某個元件時，通常會想傳一些資料給它。元件透過宣告**輸入**，來指明它接受的資料：

```ts {highlight:[6]}
import {Component, input} from '@angular/core';

@Component(/* ... */)
export class CustomSlider {
  // Declare an input named 'value' with a default value of zero.
  value = input(0);
}
```

這讓你可以在範本中繫結到該屬性：

```angular-html
<custom-slider [value]="50" />
```

如果輸入有預設值，TypeScript 會從預設值推斷其型別：

```ts
@Component(/* ... */)
export class CustomSlider {
  // TypeScript infers that this input is a number, returning InputSignal<number>.
  value = input(0);
}
```

你可以為 `input` 函式指定泛型參數，明確宣告輸入的型別。

如果沒有預設值的輸入未被設定，其值為 `undefined`：

```ts
@Component(/* ... */)
export class CustomSlider {
  // Produces an InputSignal<number | undefined> because `value` may not be set.
  value = input<number>();
}
```

**Angular 在編譯時期靜態記錄輸入**。輸入無法在執行時期加入或移除。

`input` 函式對 Angular 編譯器有特殊意義。**你只能在元件與指令的屬性初始化器中呼叫 `input`**。

擴充元件類別時，**輸入會由子類別繼承**。

**輸入名稱區分大小寫**。

## 讀取輸入

`input` 函式會回傳一個 `InputSignal`。你可以呼叫這個訊號來讀取其值：

```ts {highlight:[9]}
import {Component, input, computed} from '@angular/core';

@Component(/* ... */)
export class CustomSlider {
  // Declare an input named 'value' with a default value of zero.
  value = input(0);

  // Create a computed expression that reads the value input
  label = computed(() => `The slider's value is ${this.value()}`);
}
```

由 `input` 函式建立的訊號是唯讀的。

## 必要輸入

你可以呼叫 `input.required` 而非 `input`，來宣告某個輸入是 `required`：

```ts {highlight:[4]}
@Component(/* ... */)
export class CustomSlider {
  // Declare a required input named value. Returns an `InputSignal<number>`.
  value = input.required<number>();
}
```

Angular 會強制規定，在範本中使用元件時，必要輸入_必須_被設定。如果你嘗試使用某個元件，卻沒有指明它的所有必要輸入，Angular 會在建置時期回報錯誤。

必要輸入不會自動在回傳的 `InputSignal` 泛型參數中包含 `undefined`。

## 設定輸入

`input` 函式接受設定物件作為第二個參數，讓你可以變更輸入的運作方式。

### 輸入轉換

你可以指定 `transform` 函式，在 Angular 設定輸入時變更其值。

```ts {highlight:[6]}
@Component({
  selector: 'custom-slider',
  /*...*/
})
export class CustomSlider {
  label = input('', {transform: trimString});
}

function trimString(value: string | undefined): string {
  return value?.trim() ?? '';
}
```

```angular-html
<custom-slider [label]="systemVolume" />
```

在上面的範例中，只要 `systemVolume` 的值變更，Angular 就會執行 `trimString`，並將 `label` 設為其結果。

輸入轉換最常見的應用情境，是在範本中接受更廣泛的值型別，通常包括 `null` 與 `undefined`。

**輸入轉換函式必須能在建置時期靜態分析**。你無法有條件地設定轉換函式，也無法將它設為運算式求值的結果。

**輸入轉換函式應該一律是[純函式](https://en.wikipedia.org/wiki/Pure_function)**。仰賴轉換函式以外的狀態，可能導致不可預測的行為。

#### 型別檢查

當你指定輸入轉換時，轉換函式的參數型別，決定了範本中可以設定給該輸入的值有哪些型別。

```ts
@Component(/* ... */)
export class CustomSlider {
  widthPx = input('', {transform: appendPx});
}

function appendPx(value: number): string {
  return `${value}px`;
}
```

在上面的範例中，`widthPx` 輸入接受 `number`，而 `InputSignal` 屬性回傳 `string`。

#### 內建轉換

Angular 為兩個最常見的情境提供內建轉換函式：將值強制轉換為布林值與數字。

```ts
import {Component, input, booleanAttribute, numberAttribute} from '@angular/core';

@Component(/* ... */)
export class CustomSlider {
  disabled = input(false, {transform: booleanAttribute});
  value = input(0, {transform: numberAttribute});
}
```

`booleanAttribute` 模仿標準 HTML [布林屬性](https://developer.mozilla.org/docs/Glossary/Boolean/HTML)的行為，也就是屬性的_存在_即表示「true」值。不過，Angular 的 `booleanAttribute` 會將字面字串 `"false"` 視為布林值 `false`。

`numberAttribute` 會嘗試將給定的值剖析為數字，剖析失敗時產生 `NaN`。

### 輸入別名

你可以指定 `alias` 選項，變更輸入在範本中的名稱。

```ts {highlight:[3]}
@Component(/* ... */)
export class CustomSlider {
  value = input(0, {alias: 'sliderValue'});
}
```

```angular-html
<custom-slider [sliderValue]="50" />
```

這個別名不影響該屬性在 TypeScript 程式碼中的使用方式。

雖然一般來說應避免為元件輸入取別名，這個功能在重新命名屬性時保留原名稱別名，或避免與原生 DOM 元素屬性名稱衝突時，會很有用。

## 模型輸入

**模型輸入**是輸入的一種特殊類型，讓元件能將新值傳播回其父元件。

建立元件時，你可以比照建立標準輸入的方式，定義模型輸入。

兩種類型的輸入都允許他人將值繫結到屬性中。不過，**模型輸入允許元件作者將值寫入屬性**。如果該屬性以雙向繫結方式繫結，新值會傳播到該繫結。

```ts
@Component(/* ... */)
export class CustomSlider {
  // Define a model input named "value".
  value = model(0);

  increment() {
    // Update the model input with a new value, propagating the value to any bindings.
    this.value.update((oldValue) => oldValue + 10);
  }
}

@Component({
  /* ... */
  // Using the two-way binding syntax means that any changes to the slider's
  // value automatically propagate back to the `volume` signal.
  // Note that this binding uses the signal *instance*, not the signal value.
  template: `<custom-slider [(value)]="volume" />`,
})
export class MediaControls {
  // Create a writable signal for the `volume` local state.
  volume = signal(0);
}
```

在上面的範例中，`CustomSlider` 可以將值寫入它的 `value` 模型輸入，這些值接著會傳播回 `MediaControls` 中的 `volume` 訊號。這個繫結讓 `value` 與 `volume` 的值保持同步。請注意，這個繫結傳遞的是 `volume` 訊號執行個體，而不是訊號的_值_。

在其他方面，模型輸入的運作方式與標準輸入類似。你可以呼叫訊號函式來讀取其值，包括在 `computed` 與 `effect` 這類[反應式情境](guide/signals#reactive-contexts)中。

關於範本中雙向繫結的更多細節，請參閱[雙向繫結](guide/templates/two-way-binding)。

### 與純屬性進行雙向繫結

你可以將純 JavaScript 屬性繫結到模型輸入。

```angular-ts
@Component({
  /* ... */
  // `value` is a model input.
  // The parenthesis-inside-square-brackets syntax (aka "banana-in-a-box") creates a two-way binding
  template: '<custom-slider [(value)]="volume" />',
})
export class MediaControls {
  protected volume = 0;
}
```

在上面的範例中，`CustomSlider` 可以將值寫入它的 `value` 模型輸入，這些值接著會傳播回 `MediaControls` 中的 `volume` 屬性。這個繫結讓 `value` 與 `volume` 的值保持同步。

### 隱含的 `change` 事件

當你在元件或指令中宣告模型輸入時，Angular 會自動為該模型建立對應的[輸出](guide/components/outputs)。輸出的名稱是模型輸入的名稱加上「Change」後綴。

```ts
@Directive(/* ... */)
export class CustomCheckbox {
  // This automatically creates an output named "checkedChange".
  // Can be subscribed to using `(checkedChange)="handler()"` in the template.
  checked = model(false);
}
```

每當你透過呼叫模型輸入的 `set` 或 `update` 方法將新值寫入它時，Angular 就會發出這個變更事件。

關於輸出的更多細節，請參閱[以輸出建立自訂事件](guide/components/outputs)。

### 自訂模型輸入

你可以比照標準輸入的方式，將模型輸入標記為[必要](#required-inputs)，或為它提供[別名](#input-aliases)。

模型輸入不支援輸入轉換。

### 何時使用模型輸入

當你希望元件支援雙向繫結時，請使用模型輸入。當元件的存在目的是依據使用者互動修改某個值時，這通常很合適。最常見的情況是，自訂表單控制項，例如日期選擇器或 combobox，應該以模型輸入作為其主要值。

## 選擇輸入名稱

應避免選擇會與 `HTMLElement` 等 DOM 元素屬性衝突的輸入名稱。名稱衝突會讓人混淆被繫結的屬性究竟屬於元件還是 DOM 元素。

應避免像元件選擇器那樣，為元件輸入加上前綴。由於一個給定的元素只能承載一個元件，任何自訂屬性都可以假定屬於該元件。

## 以 `@Input` 裝飾器宣告輸入

TIP: 雖然 Angular 團隊建議新專案使用以訊號為基礎的 `input` 函式，原本以裝飾器為基礎的 `@Input` API 仍受到完整支援。

你也可以將 `@Input` 裝飾器加到屬性上，來宣告元件輸入：

```ts {highlight:[3]}
@Component(/* ... */)
export class CustomSlider {
  @Input() value = 0;
}
```

無論是以訊號為基礎還是以裝飾器為基礎的輸入，繫結到輸入的方式都相同：

```angular-html
<custom-slider [value]="50" />
```

### 自訂以裝飾器為基礎的輸入

`@Input` 裝飾器接受設定物件，讓你可以變更輸入的運作方式。

#### 必要輸入 {#required-inputs-decorator}

你可以指定 `required` 選項，強制規定某個輸入必須一律有值。

```ts {highlight:[3]}
@Component(/* ... */)
export class CustomSlider {
  @Input({required: true}) value = 0;
}
```

如果你嘗試使用某個元件，卻沒有指明它的所有必要輸入，Angular 會在建置時期回報錯誤。

#### 輸入轉換 {#input-transforms-decorator}

你可以指定 `transform` 函式，在 Angular 設定輸入時變更其值。這個轉換函式的運作方式，與上述以訊號為基礎的輸入轉換函式完全相同。

```ts {highlight:[6]}
@Component({
  selector: 'custom-slider',
  ...
})
export class CustomSlider {
  @Input({transform: trimString}) label = '';
}

function trimString(value: string | undefined) {
  return value?.trim() ?? '';
}
```

#### 輸入別名 {#input-aliases-decorator}

你可以指定 `alias` 選項，變更輸入在範本中的名稱。

```ts {highlight:[3]}
@Component(/* ... */)
export class CustomSlider {
  @Input({alias: 'sliderValue'}) value = 0;
}
```

```angular-html
<custom-slider [sliderValue]="50" />
```

`@Input` 裝飾器也接受以別名作為第一個參數，來取代設定物件。

輸入別名的運作方式與上述以訊號為基礎的輸入相同。

### 帶有 getter 與 setter 的輸入

使用以裝飾器為基礎的輸入時，以 getter 與 setter 實作的屬性也可以是輸入：

```ts
export class CustomSlider {
  @Input()
  get value(): number {
    return this.internalValue;
  }

  set value(newValue: number) {
    this.internalValue = newValue;
  }

  private internalValue = 0;
}
```

你甚至可以只定義公開的 setter，來建立_唯寫_輸入：

```ts
export class CustomSlider {
  @Input()
  set value(newValue: number) {
    this.internalValue = newValue;
  }

  private internalValue = 0;
}
```

如果可以，**請優先使用輸入轉換，而非 getter 與 setter**。

應避免複雜或成本高昂的 getter 與 setter。Angular 可能多次呼叫輸入的 setter，如果 setter 執行任何成本高昂的行為（例如 DOM 操作），可能對應用程式效能造成負面影響。

## 在 `@Component` 裝飾器中指明輸入

除了 `@Input` 裝飾器之外，你也可以用 `@Component` 裝飾器中的 `inputs` 屬性，來指明元件的輸入。當元件從基底類別繼承某個屬性時，這會很有用：

```ts {highlight:[4]}
// `CustomSlider` inherits the `disabled` property from `BaseSlider`.
@Component({
  ...,
  inputs: ['disabled'],
})
export class CustomSlider extends BaseSlider { }
```

你也可以在 `inputs` 清單的字串中，在冒號後面指明輸入別名：

```ts {highlight:[4]}
// `CustomSlider` inherits the `disabled` property from `BaseSlider`.
@Component({
  ...,
  inputs: ['disabled: sliderDisabled'],
})
export class CustomSlider extends BaseSlider { }
```
