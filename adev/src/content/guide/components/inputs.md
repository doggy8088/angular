# 以輸入屬性接受資料

Tip: 本指南假設你已讀過[基礎指南](essentials)。如果你是 Angular 新手，請先閱讀該指南。

Tip: 如果你熟悉其他網頁框架，輸入屬性類似 _props_。

建立元件時，你可以在屬性上加上 `@Input` 裝飾器，將特定的類別屬性標記為**可繫結**：

<docs-code language="ts" highlight="[3]">
@Component({...})
export class CustomSlider {
  @Input() value = 0;
}
</docs-code>

這讓你可以在範本中繫結到該屬性：

```html
<custom-slider [value]="50" />
```

Angular 將以 `@Input` 裝飾器標記的屬性稱為 **inputs**。使用元件時，你可以透過設定其輸入來傳遞資料給它。

**Angular 在編譯時期靜態記錄輸入**。輸入無法在執行時期加入或移除。

擴充元件類別時，**輸入會由子類別繼承**。

**輸入名稱區分大小寫**。

## 自訂輸入 {#customizing-inputs}

`@Input` 裝飾器接受設定物件，讓你可以變更輸入的運作方式。

### 必要輸入 {#required-inputs}

你可以指定 `required` 選項，強制規定某個輸入必須一律有值。

<docs-code language="ts" highlight="[3]">
@Component({...})
export class CustomSlider {
  @Input({required: true}) value = 0;
}
</docs-code>

如果你嘗試使用某個元件，卻沒有指明它的所有必要輸入，Angular 會在建置時期回報錯誤。

### 輸入轉換 {#input-transforms}

你可以指定 `transform` 函式，在 Angular 設定輸入時變更其值。

<docs-code language="ts" highlight="[6]">
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
</docs-code>

```html
<custom-slider [label]="systemVolume" />
```

在上面的範例中，只要 `systemVolume` 的值變更，Angular 就會執行 `trimString`，並將 `label` 設為其結果。

輸入轉換最常見的應用情境，是在範本中接受更廣泛的值型別，通常包括 `null` 與 `undefined`。

**輸入轉換函式必須能在建置時期靜態分析**。你無法有條件地設定轉換函式，也無法將它設為運算式求值的結果。

**輸入轉換函式應該一律是[純函式](https://en.wikipedia.org/wiki/Pure_function)**。仰賴轉換函式以外的狀態，可能導致不可預測的行為。

#### 型別檢查

當你指定輸入轉換時，轉換函式的參數型別，決定了範本中可以設定給該輸入的值有哪些型別。

<docs-code language="ts">
@Component({...})
export class CustomSlider {
  @Input({transform: appendPx}) widthPx: string = '';
}

function appendPx(value: number) {
  return `${value}px`;
}
</docs-code>

在上面的範例中，`widthPx` 輸入接受 `number`，而類別上的屬性是 `string`。

#### 內建轉換 {#built-in-transformations}

Angular 為兩個最常見的情境提供內建轉換函式：將值強制轉換為布林值與數字。

<docs-code language="ts">
import {Component, Input, booleanAttribute, numberAttribute} from '@angular/core';

@Component({...})
export class CustomSlider {
  @Input({transform: booleanAttribute}) disabled = false;
  @Input({transform: numberAttribute}) number = 0;
}
</docs-code>

`booleanAttribute` 模仿標準 HTML [布林屬性](https://developer.mozilla.org/en-US/docs/Glossary/Boolean/HTML)的行為，也就是屬性的_存在_即表示「true」值。不過，Angular 的 `booleanAttribute` 會將字面字串 `"false"` 視為布林值 `false`。

`numberAttribute` 會嘗試將給定的值剖析為數字，剖析失敗時產生 `NaN`。

### 輸入別名 {#input-aliases}

你可以指定 `alias` 選項，變更輸入在範本中的名稱。

<docs-code language="ts" highlight="[3]">
@Component({...})
export class CustomSlider {
  @Input({alias: 'sliderValue'}) value = 0;
}
</docs-code>

```html
<custom-slider [sliderValue]="50" />
```

這個別名不影響該屬性在 TypeScript 程式碼中的使用方式。

雖然一般來說應避免為元件輸入取別名，這個功能在重新命名屬性時保留原名稱別名，或避免與原生 DOM 元素屬性名稱衝突時，會很有用。

`@Input` 裝飾器也接受以別名作為第一個參數，來取代設定物件。

## 帶有 getter 與 setter 的輸入

以 getter 與 setter 實作的屬性也可以是輸入：

<docs-code language="ts">
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
</docs-code>

你甚至可以只定義公開的 setter，來建立_唯寫_輸入：

<docs-code language="ts">
export class CustomSlider {
  @Input()
  set value(newValue: number) {
    this.internalValue = newValue;
  }

  private internalValue = 0;
}
</docs-code>

如果可以，請優先使用<span style="text-decoration:underline;">輸入轉換</span>，而非 getter 與 setter。

應避免複雜或成本高昂的 getter 與 setter。Angular 可能多次呼叫輸入的 setter，如果 setter 執行任何成本高昂的行為（例如 DOM 操作），可能對應用程式效能造成負面影響。

## 在 `@Component` 裝飾器中指明輸入

除了 `@Input` 裝飾器之外，你也可以用 `@Component` 裝飾器中的 `inputs` 屬性，來指明元件的輸入。當元件從基底類別繼承某個屬性時，這會很有用：

<docs-code language="ts" highlight="[4]">
// `CustomSlider` inherits the `disabled` property from `BaseSlider`.
@Component({
  ...,
  inputs: ['disabled'],
})
export class CustomSlider extends BaseSlider { }
</docs-code>

你也可以在 `inputs` 清單的字串中，在冒號後面指明輸入別名：

<docs-code language="ts" highlight="[4]">
// `CustomSlider` inherits the `disabled` property from `BaseSlider`.
@Component({
  ...,
  inputs: ['disabled: sliderDisabled'],
})
export class CustomSlider extends BaseSlider { }
</docs-code>

## 選擇輸入名稱 {#choosing-input-names}

應避免選擇會與 HTMLElement 等 DOM 元素屬性衝突的輸入名稱。名稱衝突會讓人混淆被繫結的屬性究竟屬於元件還是 DOM 元素。

應避免像元件選擇器那樣，為元件輸入加上前綴。由於一個給定的元素只能承載一個元件，任何自訂屬性都可以假定屬於該元件。
