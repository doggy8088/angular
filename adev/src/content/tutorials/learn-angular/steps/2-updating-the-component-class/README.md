# 更新元件類別

在 Angular 中，元件的邏輯與行為定義在元件的 TypeScript 類別中。

NOTE: 在[核心概念指南](/essentials/templates#showing-dynamic-text)中進一步了解如何顯示動態文字。

在這個練習中，你將學習如何更新元件類別，以及如何使用[插值](/guide/templates/binding#render-dynamic-text-with-text-interpolation)。

<hr />

<docs-workflow>

<docs-step title="加上名為 `city` 的屬性">
更新元件類別，為 `AppComponent` 類別加上一個名為 `city` 的屬性。

```ts
export class AppComponent {
  city = 'San Francisco';
}
```

`city` 屬性的型別是 `string`，但由於 [TypeScript 的型別推論](https://www.typescriptlang.org/docs/handbook/type-inference.html)，你可以省略型別。`city` 屬性可以在 `AppComponent` 類別中使用，也可以在元件範本中參照。

<br>

要在範本中使用類別屬性，你必須使用 `{{ }}` 語法。
</docs-step>

<docs-step title="更新元件範本">
更新 `template` 屬性，讓它與以下 HTML 相符：

```ts
template: `Hello {{ city }}`,
```

這是插值的一個範例，也是 Angular 範本語法的一部分。它不只讓你把動態文字放進範本中，你還可以使用這個語法來呼叫函式、撰寫運算式等等。
</docs-step>

<docs-step title="多練習一下插值">
試試看——再加上一組 `{{ }}`，內容是 `1 + 1`：

```ts
template: `Hello {{ city }}, {{ 1 + 1 }}`,
```

Angular 會計算 `{{ }}` 中的內容，並把輸出結果渲染到範本中。
</docs-step>

</docs-workflow>

這只是 Angular 範本可能性的開端，繼續學習，你會發現更多。
