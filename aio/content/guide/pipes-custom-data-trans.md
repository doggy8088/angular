# 建立用於自訂資料轉換的管道

建立自訂管道，封裝內建管道沒有提供的轉換。 接著，在範本運算式中使用你的自訂管道，就像使用內建管道一樣——把輸入值轉換為輸出值以供顯示。

## 將類別標記為管道

若要把類別標記為管道並提供設定中繼資料，請將 [`@Pipe`](/api/core/Pipe "API reference for Pipe") [裝飾器](/guide/glossary#裝飾器decoratordecoration "Definition for decorator")套用到該類別。

管道類別名稱請使用 [UpperCamelCase](guide/glossary#大小寫慣例case-types "Definition of case types")（類別名稱的一般慣例），對應的 `name` 字串則使用 [camelCase](guide/glossary#大小寫慣例case-types "Definition of case types")。`name` 中不要使用連字號。

詳細資訊與更多範例，請參閱 [Pipe names](guide/styleguide#管道名稱 "Pipe names in the Angular coding style guide")。

在範本運算式中使用 `name`，就像使用內建管道一樣。

<div class="alert is-important">

*   將你的管道加入 `NgModule` 中繼資料的 `declarations` 欄位，使其可供範本使用。請參閱範例應用程式中的 `app.module.ts` 檔案（<live-example></live-example>）。詳情請參閱 [NgModules](guide/ngmodules "NgModules introduction")。
*   註冊你的自訂管道。[Angular CLI](cli "CLI Overview and Command Reference") 的 [`ng generate pipe`](cli/generate#pipe "ng generate pipe in the CLI Command Reference") 指令會自動註冊管道。

</div>

## 使用 PipeTransform 介面

在你的自訂管道類別中實作 [`PipeTransform`](/api/core/PipeTransform "API reference for PipeTransform") 介面，以執行轉換。

Angular 會以繫結的值作為第一個引數、以清單形式的所有參數作為第二個引數，呼叫 `transform` 方法，並回傳轉換後的值。

## 範例：以指數方式轉換值

在遊戲中，你可能會想實作一個以指數方式提升值的轉換，來增加英雄的力量。 例如，如果英雄的分數是 2，把英雄的力量以指數方式提升 10，會得到 1024 分（`2**10`）。 使用自訂管道來進行這個轉換。

下列程式碼範例展示了兩個元件定義：

*   | `exponential-strength.pipe.ts` | 定義一個名為 `exponentialStrength` 的自訂管道，帶有執行轉換的 `transform` 方法。它為傳給管道的參數，定義了 `transform` 方法的一個引數 \(`exponent`\)。 |
*   `power-booster.component.ts` 元件示範如何使用該管道，指定一個值（`2`）與指數參數（`10`）。

<code-tabs>
    <code-pane header="src/app/exponential-strength.pipe.ts" path="pipes/src/app/exponential-strength.pipe.ts"></code-pane>
    <code-pane header="src/app/power-booster.component.ts" path="pipes/src/app/power-booster.component.ts"></code-pane>
</code-tabs>

瀏覽器會顯示下列內容：

<code-example language="none">

Power Booster

Superpower boost: 1024

</code-example>

<div class="alert is-helpful">

若要檢視 <live-example></live-example> 中 `exponentialStrength` 管道的行為，請在範本中變更數值與選用的指數。

</div>

@reviewed 2022-04-01
