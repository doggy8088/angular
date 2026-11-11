# 管道

## 總覽

管道是 Angular 範本運算式中的特殊運算子，讓你能在範本中以宣告方式轉換資料。管道讓你宣告一次轉換函式，就能在多個範本中重複使用該轉換。Angular 管道使用直線字元（`|`），靈感來自 [Unix pipe](<https://en.wikipedia.org/wiki/Pipeline_(Unix)>)。

NOTE: Angular 的管道語法與標準 JavaScript 不同，JavaScript 使用直線字元作為[位元 OR 運算子](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Bitwise_OR)。Angular 範本運算式不支援位元運算子。

以下範例使用了 Angular 提供的一些內建管道：

```angular-ts
import { Component } from '@angular/core';
import { CurrencyPipe, DatePipe, TitleCasePipe } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CurrencyPipe, DatePipe, TitleCasePipe],
  template: `
    <main>
       <!-- Transform the company name to title-case and
       transform the purchasedOn date to a locale-formatted string -->
<h1>Purchases from {{ company | titlecase }} on {{ purchasedOn | date }}</h1>

	    <!-- Transform the amount to a currency-formatted string -->
      <p>Total: {{ amount | currency }}</p>
    </main>
  `,
})
export class ShoppingCartComponent {
  amount = 123.45;
  company = 'acme corporation';
  purchasedOn = '2024-07-08';
}
```

當 Angular 渲染這個元件時，會確保所使用的日期格式與貨幣是依據使用者的地區設定。如果使用者位於美國，渲染結果會是：

```angular-html
<main>
  <h1>Purchases from Acme Corporation on Jul 8, 2024</h1>
  <p>Total: $123.45</p>
</main>
```

若要了解 Angular 如何在地化數值，請參閱 [i18n 深入指南](/guide/i18n)。

### 內建管道 {#built-in-pipes}

Angular 在 `@angular/common` 套件中包含一組內建管道：

| 名稱                                          | 說明                                                                                   |
| --------------------------------------------- | --------------------------------------------------------------------------------------------- |
| [`AsyncPipe`](api/common/AsyncPipe)           | 從 `Promise` 或 RxJS `Observable` 讀取值。                                      |
| [`CurrencyPipe`](api/common/CurrencyPipe)     | 將數字轉換為貨幣字串，依地區設定規則格式化。                |
| [`DatePipe`](api/common/DatePipe)             | 依地區設定規則格式化 `Date` 值。                                             |
| [`DecimalPipe`](api/common/DecimalPipe)       | 將數字轉換為帶小數點的字串，依地區設定規則格式化。  |
| [`I18nPluralPipe`](api/common/I18nPluralPipe) | 將值對應到依地區設定規則處理複數形式的字串。                 |
| [`I18nSelectPipe`](api/common/I18nSelectPipe) | 將鍵對應到回傳所需值的自訂選擇器。                                 |
| [`JsonPipe`](api/common/JsonPipe)             | 透過 `JSON.stringify` 將物件轉換為字串表示法，用於除錯。 |
| [`KeyValuePipe`](api/common/KeyValuePipe)     | 將 Object 或 Map 轉換為鍵值對陣列。                                    |
| [`LowerCasePipe`](api/common/LowerCasePipe)   | 將文字轉換為全部小寫。                                                            |
| [`PercentPipe`](api/common/PercentPipe)       | 將數字轉換為百分比字串，依地區設定規則格式化。              |
| [`SlicePipe`](api/common/SlicePipe)           | 建立包含元素子集（切片）的新 Array 或 String。                    |
| [`TitleCasePipe`](api/common/TitleCasePipe)   | 將文字轉換為標題大小寫。                                                                |
| [`UpperCasePipe`](api/common/UpperCasePipe)   | 將文字轉換為全部大寫。                                                            |

## 使用管道

Angular 的管道運算子在範本運算式中使用直線字元（`|`）。管道運算子是二元運算子，左側運算元是傳入轉換函式的值，右側運算元是管道名稱以及任何額外參數（如下所述）。

```angular-html
<p>Total: {{ amount | currency }}</p>
```

在這個範例中，`amount` 的值會傳入 `CurrencyPipe`，其中管道名稱是 `currency`。接著它會渲染使用者地區設定的預設貨幣。

### 在同一個運算式中結合多個管道

你可以使用多個管道運算子，對一個值套用多個轉換。Angular 會由左至右執行這些管道。

以下範例示範如何結合多個管道，顯示全部大寫的在地化日期：

```angular-html
<p>The event will occur on {{ scheduledOn | date | uppercase }}.</p>
```

### 將參數傳給管道

有些管道接受參數來設定轉換方式。若要指定參數，請在管道名稱後面加上冒號（`:`），再接著參數值。

例如，`DatePipe` 可以接受參數，以特定方式格式化日期。

```angular-html
<p>The event will occur at {{ scheduledOn | date:'hh:mm' }}.</p>
```

有些管道可以接受多個參數。你可以用冒號字元（`:`）分隔，指定額外的參數值。

例如，我們也可以傳入第二個選擇性參數來控制時區。

```angular-html
<p>The event will occur at {{ scheduledOn | date:'hh:mm':'UTC' }}.</p>
```

## 管道如何運作

從概念上來說，管道是接受輸入值並回傳轉換後值的函式。

```angular-ts
import { Component } from '@angular/core';
import { CurrencyPipe} from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CurrencyPipe],
  template: `
    <main>
      <p>Total: {{ amount | currency }}</p>
    </main>
  `,
})
export class AppComponent {
  amount = 123.45;
}
```

在這個範例中：

1. 從 `@angular/common` 匯入 `CurrencyPipe`
1. 將 `CurrencyPipe` 加入 `imports` 陣列
1. 將 `amount` 資料傳給 `currency` 管道

### 管道運算子的優先順序

管道運算子的優先順序低於其他二元運算子，包括 `+`、`-`、`*`、`/`、`%`、`&&`、`||` 與 `??`。

```angular-html
<!-- firstName and lastName are concatenated before the result is passed to the uppercase pipe -->
{{ firstName + lastName | uppercase }}
```

管道運算子的優先順序高於條件（三元）運算子。

```angular-html
{{ (isAdmin ? 'Access granted' : 'Access denied') | uppercase }}
```

如果同一個運算式沒有加括號：

```angular-html
{{ isAdmin ? 'Access granted' : 'Access denied' | uppercase }}
```

它反而會被解析為：

```angular-html
{{ isAdmin ? 'Access granted' : ('Access denied' | uppercase) }}
```

當運算子優先順序可能不明確時，請務必在運算式中使用括號。

### 管道與變更偵測

依預設，所有管道都被視為 `pure`（純粹），意思是它們只有在原始型別輸入值（例如 `String`、`Number`、`Boolean` 或 `Symbol`）或物件參照（例如 `Array`、`Object`、`Function` 或 `Date`）變更時才會執行。純粹管道具有效能優勢，因為如果傳入的值沒有變更，Angular 可以避免呼叫轉換函式。

因此，這也表示物件屬性或陣列項目的異動不會被偵測到，除非整個物件或陣列參照被換成不同的執行個體。如果你需要這個層級的變更偵測，請參閱[偵測陣列或物件內部的變更](#detecting-change-within-arrays-or-objects)。

## 建立自訂管道 {#creating-custom-pipes}

你可以實作一個帶有 `@Pipe` 裝飾器的 TypeScript 類別，來定義自訂管道。一個管道必須具備兩樣東西：

- 一個名稱，在管道裝飾器中指定
- 一個名為 `transform` 的方法，負責執行值轉換。

此外，這個 TypeScript 類別還應該實作 `PipeTransform` 介面，以確保它符合管道的型別簽章。

以下是一個自訂管道的範例，可將字串轉換為 kebab case：

```angular-ts
// kebab-case.pipe.ts
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'kebabCase',
  standalone: true,
})
export class KebabCasePipe implements PipeTransform {
  transform(value: string): string {
    return value.toLowerCase().replace(/ /g, '-');
  }
}
```

### 使用 `@Pipe` 裝飾器

建立自訂管道時，從 `@angular/core` 套件匯入 `Pipe`，並將它用作 TypeScript 類別的裝飾器。

```angular-ts
import { Pipe } from '@angular/core';

@Pipe({
  name: 'myCustomTransformation',
  standalone: true
})
export class MyCustomTransformationPipe {}
```

`@Pipe` 裝飾器需要兩個設定選項：

- `name`：將在範本中使用的管道名稱
- `standalone: true`：確保管道能在獨立應用程式中使用

### 自訂管道的命名慣例

自訂管道的命名慣例由兩個慣例組成：

- `name`：建議使用 camelCase。不要使用連字號。
- `class name`：`name` 的 PascalCase 版本，並在結尾加上 `Pipe`

### 實作 `PipeTransform` 介面

除了 `@Pipe` 裝飾器之外，自訂管道還應該一律實作來自 `@angular/core` 的 `PipeTransform` 介面。

```angular-ts
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'myCustomTransformation',
  standalone: true
})
export class MyCustomTransformationPipe implements PipeTransform {}
```

實作這個介面可以確保你的管道類別具有正確的結構。

### 轉換管道的值

每次轉換都會呼叫 `transform` 方法，第一個參數是傳入的值，回傳值則是轉換後的值。

```angular-ts
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'myCustomTransformation',
  standalone: true
})
export class MyCustomTransformationPipe implements PipeTransform {
  transform(value: string): string {
    return `My custom transformation of ${value}.`
  }
}
```

### 為自訂管道加入參數

你可以為 `transform` 方法加入額外參數，為你的轉換加入參數：

```angular-ts
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'myCustomTransformation',
  standalone: true
})
export class MyCustomTransformationPipe implements PipeTransform {
  transform(value: string, format: string): string {
    let msg = `My custom transformation of ${value}.`

    if (format === 'uppercase') {
      return msg.toUpperCase()
    else {
      return msg
    }
  }
}
```

### 偵測陣列或物件內部的變更 {#detecting-change-within-arrays-or-objects}

當你希望管道能偵測陣列或物件內部的變更時，必須將 `pure` 旗標傳入 `false`，把它標記為非純粹函式。

除非絕對必要，請避免建立非純粹管道，因為若使用不慎，它們可能帶來顯著的效能損失。

```angular-ts
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'featuredItemsImpure',
  pure: false,
  standalone: true
})
export class FeaturedItemsImpurePipe implements PipeTransform {
  transform(value: string, format: string): string {
    let msg = `My custom transformation of ${value}.`

    if (format === 'uppercase') {
      return msg.toUpperCase()
    else {
      return msg
    }
  }
}
```

Angular 開發者經常採用一個慣例：在管道的 `name` 與類別名稱中包含 `Impure`，向其他開發者提示潛在的效能陷阱。
