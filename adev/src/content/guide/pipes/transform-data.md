# 自訂管線以進行新轉換

建立自訂管道以封裝內建管道未提供的轉換。
然後，在範本表達式中使用您的自訂管道，與使用內建管道的方式相同—將輸入值轉換為輸出值以供顯示。

## 將類別標記為管線

若要將類別標記為管道並提供組態元資料，請將 `@Pipe` 套用到該類別。

對應的 `name` 字串，請使用 UpperCamelCase (類別名稱的一般慣例) 作為 pipe 類別名稱，並使用 camelCase。

請勿在 `name` 中使用連字號。

有關詳細資訊和更多範例，請參閱 [Pipe 名稱](/style-guide#pipe-names "Angular 編碼風格指南中的 Pipe 名稱")。

在範本表達式中使用 `name`，就像使用內建管線一樣。

```ts
import { Pipe } from '@angular/core';

@Pipe({
  name: 'greet',
  standalone: true,
})
export class GreetPipe {}
```

## 使用 PipeTransform 介面

在您的自訂管線類別中實作 [`PipeTransform`](/api/core/PipeTransform "PipeTransform 的 API 參考") 介面以執行轉換。

Angular 會以繫結值作為第一個參數，任何參數以列表形式作為第二個參數來呼叫 `transform` 方法，並傳回轉換值。

```ts
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'greet',
  standalone: true,
})
export class GreetPipe implements PipeTransform {
  transform(value: string, param1: boolean, param2: boolean): string {
    return `Hello ${value}`;
  }
}
```

## 範例：將值以指數方式轉換

在遊戲中，您可能想實現一個轉換，將值以指數方式提高，以增加英雄的力量。
例如，如果英雄的分數為 2，則以 10 為指數增強英雄的力量，會產生 1024 的分數（`2**10`）。
使用自定義管道進行此轉換。

以下程式碼範例顯示兩個元件定義：

| 檔案                          | 詳細資料 |
|:---                            |:---     |
| `exponential-strength.pipe.ts` | 定義一個自訂管線命名為 `exponentialStrength`，使用 `transform` 方法來執行轉換。它為 `transform` 方法定義一個參數 \(`exponent`\) 來接收傳遞給管線的參數。 |
| `power-booster.component.ts`   | 示範如何使用管線，指定一個值 \(`2`\) 和指數參數 \(`10`\)。                                                                                                                   |

<docs-code-multifile preview path="adev/src/content/examples/pipes/src/app/power-booster.component.ts">
  <docs-code header="src/app/exponential-strength.pipe.ts" path="adev/src/content/examples/pipes/src/app/exponential-strength.pipe.ts"/>
  <docs-code header="src/app/power-booster.component.ts" path="adev/src/content/examples/pipes/src/app/power-booster.component.ts"/>
</docs-code-multifile>

