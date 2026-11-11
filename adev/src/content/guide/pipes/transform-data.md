# 用自訂管道進行新的轉換

建立自訂管道，封裝內建管道沒有提供的轉換。
接著，在範本運算式中使用你的自訂管道，就像使用內建管道一樣——把輸入值轉換為輸出值以供顯示。

## 將類別標記為管道 {#marking-a-class-as-a-pipe}

若要把類別標記為管道並提供設定中繼資料，請對該類別套用 `@Pipe`。

管道類別名稱使用 UpperCamelCase（類別名稱的一般慣例），對應的 `name` 字串則使用 camelCase。
不要在 `name` 中使用連字號。

詳細資訊與更多範例，請參閱 [Pipe names](/style-guide#pipe-names "Pipe names in the Angular coding style guide")。

在範本運算式中使用 `name`，就像使用內建管道一樣。

```ts
import { Pipe } from '@angular/core';

@Pipe({
  name: 'greet',
  standalone: true,
})
export class GreetPipe {}
```

## 使用 PipeTransform 介面 {#using-the-pipetransform-interface}

在你的自訂管道類別中實作 [`PipeTransform`](/api/core/PipeTransform "API reference for PipeTransform") 介面，以執行轉換。

Angular 會以繫結的值作為第一個引數、以清單形式的所有參數作為第二個引數，呼叫 `transform` 方法，並回傳轉換後的值。

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

## 範例：以指數方式轉換值 {#example-transforming-a-value-exponentially}

在遊戲中，你可能會想實作一個以指數方式提升值的轉換，來增加英雄的力量。
例如，如果英雄的分數是 2，把英雄的力量以指數方式提升 10，會得到 1024 分（`2**10`）。
使用自訂管道來進行這個轉換。

下列程式碼範例展示了兩個元件定義：

| 檔案                          | 詳細說明 |
|:---                            |:---     |
| `exponential-strength.pipe.ts` | 定義一個名為 `exponentialStrength` 的自訂管道，帶有執行轉換的 `transform` 方法。它為傳給管道的參數，定義了 `transform` 方法的一個引數 \(`exponent`\)。 |
| `power-booster.component.ts`   | 示範如何使用該管道，指定一個值 \(`2`\) 與指數參數 \(`10`\)。                                                                                                                   |

<docs-code-multifile>
  <docs-code header="src/app/exponential-strength.pipe.ts" language="ts" path="adev/src/content/examples/pipes/src/app/exponential-strength.pipe.ts"/>
  <docs-code header="src/app/power-booster.component.ts" language="ts" path="adev/src/content/examples/pipes/src/app/power-booster.component.ts"/>
</docs-code-multifile>
