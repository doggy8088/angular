# 更新元件類別

在 Angular 中，元件的邏輯和行為在元件的 TypeScript 類別中定義。

在這個活動中，你會學習如何更新元件類別，以及如何使用 [內插法](/guide/templates/interpolation)。

<hr />

<docs-workflow>

<docs-step title="新增一個名為 `city` 的屬性">
透過新增 `AppComponent` 類別中的 `city` 屬性來更新該元件類別。

```ts
export class AppComponent {
  city = 'San Francisco';
}
```

`city` 屬性是 `string` 類型，但您可以省略類型，因為有 [TypeScript 中的類型推斷](https://www.typescriptlang.org/docs/handbook/type-inference.html)。`city` 屬性可以在 `AppComponent` 類別中使用，也可以在元件範本中參考。

<br>

要使用範本中的類別屬性，您必須使用 `{{ }}` 語法。
</docs-step>

<docs-step title="更新元件範本">
將 `template` 屬性更新為符合下列 HTML：

```ts
template: `Hello {{ city }}`,
```

這是一個插補範例，也是 Angular 範本語法的一部份。它讓您能做的事情遠超過在範本中放入動態文字。您也可以使用這個語法來呼叫函式、撰寫運算式等。
</docs-step>

<docs-step title="更多插補練習">
請試著這麼做 - 再加入一組 `{{ }}`，內容是 `1 + 1`：

```ts
template: `Hello {{ city }}, {{ 1 + 1 }}`,
```

Angular 會評估 `{{ }}` 的內容並在範本中呈現輸出。
</docs-step>

</docs-workflow>

這只是 Angular 範本的可能性開始，繼續學習以了解更多。

