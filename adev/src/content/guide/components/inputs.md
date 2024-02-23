# 使用輸入屬性接受資料

提示：本指南假設您已經閱讀過 [精華指南](essentials)。如果您是 Angular 新手，請先閱讀該指南。

提示：如果你熟悉其他網路框架，輸入屬性類似於 _props_。

當建立一個元件時，你可以透過在屬性上加上 `@Input` 裝飾器，將特定的類別屬性標記為 **可繫結**：

<docs-code language="ts" highlight="[3]">
@Component({...})
export class CustomSlider {
  @Input() value = 0;
}
</docs-code>

這讓您可以繫結到範本中的屬性：

```html
<custom-slider [value]="50" />
```

Angular 將標記有 `@Input` 裝飾器的屬性稱為 **輸入**。在使用元件時，您可以透過設定其輸入來將資料傳遞給它。

**Angular 在編譯時靜態記錄輸入值**. 輸入值無法在執行時新增或移除。

當擴充一個元件類別時，**輸入項目會被子類別繼承。**

**輸入名稱區分大小寫。**

## 自訂輸入

`@Input` 裝飾器接受一個設定物件，讓您可以變更輸入運作的方式。

### 必填輸入

您可以指定 `required` 選項以強制執行給定輸入必須始終具備值。

<docs-code language="ts" highlight="[3]">
@Component({...})
export class CustomSlider {
  @Input({required: true}) value = 0;
}
</docs-code>

如果你嘗試使用某個元件，但未指定所有必要的輸入，Angular 會在建置時報告錯誤。

### 輸入轉換

您可以指定一個 `transform` 函數，在 Angular 設定輸入值時變更該值。

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

在上面的範例中，每當 `systemVolume` 的值變更時，Angular 會執行 `trimString` 並將 `label` 設為結果。

輸入轉換最常見的用例是接受範本中更廣泛的值類型，通常包括 `null` 和 `undefined`。

**輸入轉換函數在建置時必須可以靜態分析。**您無法有條件地或作為表達式評估的結果來設定轉換函數。

**輸入轉換函數應始終為 [純函數](https://en.wikipedia.org/wiki/Pure_function)。**依賴於轉換函數之外的狀態可能會導致行為無法預測。

#### 類型檢查

當您指定輸入轉換時，轉換函數參數的類型決定了可以在範本中設定為輸入的值的類型。

<docs-code language="ts">
@Component({...})
export class CustomSlider {
  @Input({transform: appendPx}) widthPx: string = '';
}

function appendPx(value: number) {
  return `${value}px`;
}
</docs-code>

在上面的範例中，`widthPx` 輸入接受 `number`，而類別上的屬性是一個 `string`。

#### 內建轉換

Angular 包含兩種內建的轉換函數，適用於兩個最常見的場景：將值強制轉換為布林值和數字。

<docs-code language="ts">
import {Component, Input, booleanAttribute, numberAttribute} from '@angular/core';

@Component({...})
export class CustomSlider {
  @Input({transform: booleanAttribute}) disabled = false;
  @Input({transform: numberAttribute}) number = 0;
}
</docs-code>

`booleanAttribute` 模仿標準 HTML [布林屬性](https://developer.mozilla.org/en-US/docs/Glossary/Boolean/HTML) 的行為，其中屬性的 _存在_ 表示「true」值。但是，Angular 的 `booleanAttribute` 將字串 `"false"` 當作布林 `false`。

`numberAttribute` 嘗試解析給定的值成數字，如果解析失敗則產生 `NaN`。

### 輸入別名

您可以指定 `alias` 選項來變更範本中輸入的名稱。

<docs-code language="ts" highlight="[3]">
@Component({...})
export class CustomSlider {
  @Input({alias: 'sliderValue'}) value = 0;
}
</docs-code>

```html
<custom-slider [sliderValue]="50" />
```

此別名不影響 TypeScript 程式碼中屬性的使用方式。

雖然您通常應該避免別名輸入組件，但此功能可協助您重新命名屬性，同時保留原始名稱的別名，或避免與原生 DOM 元素屬性名稱發生衝突。

`@Input` 裝飾器也可以接受別名作為第一個參數，而不是配置物件。

## 具有 getter 和 setter 的輸入

一個使用 getter 和 setter 實作的屬性可以是輸入：

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

您可以僅定義一個公共設置器來建立一個 _寫入專用_ 輸入：

<docs-code language="ts">
export class CustomSlider {
  @Input()
  set value(newValue: number) {
    this.internalValue = newValue;
  }

private internalValue = 0;
}
</docs-code>

如果可能的話，儘量使用<span style="text-decoration:underline;">輸入轉換</span>，而不是 getter 和 setter。

避免使用複雜或昂貴的 getter 和 setter。Angular 可能會多次呼叫輸入的 setter，如果 setter 執行任何昂貴的行為，例如 DOM 操作，可能會對應用程式的效能產生負面影響。

## 在 `@Component` 裝飾器中指定輸入

除了 `@Input` 裝飾器，您也可以在 `@Component` 裝飾器中使用 `inputs` 屬性來指定元件的輸入。這在元件從基類繼承屬性時很有用：

<docs-code language="ts" highlight="[4]">
// `CustomSlider` inherits the `disabled` property from `BaseSlider`.
@Component({
  ...,
  inputs: ['disabled'],
})
export class CustomSlider extends BaseSlider { }
</docs-code>

您也可以在 `inputs` 清單中指定輸入別名，方法是在字串中於冒號之後輸入別名：

<docs-code language="ts" highlight="[4]">
// `CustomSlider` inherits the `disabled` property from `BaseSlider`.
@Component({
  ...,
  inputs: ['disabled: sliderDisabled'],
})
export class CustomSlider extends BaseSlider { }
</docs-code>

## 選擇輸入名稱

避免選擇與 DOM 元素上的屬性相衝突的輸入名稱，例如 HTMLElement。名稱衝突會造成混淆，讓人難以判斷綁定的屬性是屬於元件還是 DOM 元素。

避免為元件輸入新增前綴，就像您使用元件選擇器時一樣。由於給定的元素只能 hosting 一個元件，因此可以假設任何自訂屬性都屬於該元件。
