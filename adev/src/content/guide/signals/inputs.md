# 訊號輸入

訊號輸入允許從父元件繫結值。
這些值以 `Signal` 的形式公開，且能在你元件的生命週期中變更。

HELPFUL: 訊號輸入目前處於[開發者預覽](/guide/releases#developer-preview)階段。

Angular 支援兩種形式的輸入：

**選用輸入**
除非你使用 `input.required`，否則輸入預設為選用。
你可以指定明確的初始值，否則 Angular 會隱含地使用 `undefined`。

**必要輸入**
必要輸入永遠具有指定輸入型別的值。
它們以 `input.required` 函式宣告。

```typescript
import {Component, input} from '@angular/core';

@Component({...})
export class MyComp {
  // optional
  firstName = input<string>();         // InputSignal<string|undefined>
  age = input(0);                      // InputSignal<number>

  // required
  lastName = input.required<string>(); // InputSignal<string>
}
```

只要你將 `input` 或 `input.required` 函式用作類別成員的初始化器，Angular 就會自動將它識別為輸入。

## 為輸入取別名 {#aliasing-an-input}

Angular 使用類別成員名稱作為輸入的名稱。
你可以為輸入取別名，讓它的公開名稱有所不同。

```typescript
class StudentDirective {
  age = input(0, {alias: 'studentAge'});
}
```

這樣使用者就能以 `[studentAge]` 繫結到你的輸入，而在元件內部，你可以用 `this.age` 存取輸入值。

## 在範本中使用 {#using-in-templates}

訊號輸入是唯讀的訊號。
如同以 `signal()` 宣告的訊號，你可以呼叫輸入訊號來存取輸入的目前值。

```html
<p>First name: {{firstName()}}</p>
<p>Last name: {{lastName()}}</p>
```

這種對值的存取會在反應式情境中被捕捉，並能在輸入值變更時，通知作用中的消費者，例如 Angular 本身。

實務上，輸入訊號是你在[訊號指南](/guide/signals)中認識的訊號的一個簡單延伸。

```typescript
export class InputSignal<T> extends Signal<T> { ... }`.
```

## 推導值 {#deriving-values}

如同訊號，你可以使用 `computed` 從輸入推導出值。

```typescript
import {Component, input, computed} from '@angular/core';

@Component({...})
export class MyComp {
  age = input(0);

  // age multiplied by two.
  ageMultiplied = computed(() => this.age() * 2);
}
```

computed 訊號會將值記憶化。
詳情請參閱 [computed 的專門章節](/guide/signals#computed-signals)。

## 監控變更 {#monitoring-changes}

有了訊號輸入，使用者可以運用 `effect` 函式。
每當輸入變更時，該函式就會執行。

請看下列範例。
每當 `firstName` 輸入變更時，新值就會印到主控台。

```typescript
import {input, effect} from '@angular/core';

class MyComp {
  firstName = input.required<string>();

  constructor() {
    effect(() => {
      console.log(this.firstName());
    });
  }
}
```

每當 `firstName` 輸入變更時，`console.log` 函式就會被呼叫。
這會在 `firstName` 一可用時發生，在 `MyComp` 的生命週期內後續的變更時也會發生。

## 值轉換 {#value-transforms}

你可能會想在不改變輸入意義的情況下，強制轉換或剖析輸入值。
轉換會將父範本傳來的原始值轉換為預期的輸入型別。
轉換應該是[純函式](https://en.wikipedia.org/wiki/Pure_function)。

```typescript
class MyComp {
  disabled = input(false, {
    transform: (value: boolean|string) => typeof value === 'string' ? value === '' : value,
  });
}
```

在上面的範例中，你宣告了一個名為 `disabled` 的輸入，接受 `boolean` 與 `string` 型別的值。
這由 `transform` 選項中 `value` 的明確參數型別所捕捉。
這些值隨後會透過轉換剖析為 `boolean`，結果得到布林值。

這樣一來，當你呼叫 `this.disabled()` 時，在元件內只需要處理 `boolean`，而你的元件使用者可以傳入空字串作為簡寫，將你的元件標記為停用。

```html
<my-custom-comp disabled>
```


IMPORTANT:如果轉換會改變輸入的意義，或轉換是[不純的](https://en.wikipedia.org/wiki/Pure_function#Impure_functions)，請勿使用轉換。
對於意義不同的轉換，請改用 `computed`；對於應在輸入變更時執行的不純程式碼，請改用 `effect`。

## 為什麼應該使用訊號輸入而非 `@Input()`？ {#why-should-we-use-signal-inputs-and-not-input}

訊號輸入是以裝飾器為基礎的 `@Input()` 的反應式替代方案。

與以裝飾器為基礎的 `@Input` 相比，訊號輸入有許多優點：

1. 訊號輸入更**型別安全**：
  <br/>• 必要輸入不需要初始值，也不需要用技巧告訴 TypeScript 某個輸入_永遠_有值。
  <br/>• 轉換會被自動檢查，以符合可接受的輸入值。
2. 在範本中使用訊號輸入時，會**自動**將 `OnPush` 元件標記為 dirty。
3. 每當輸入變更時，都能使用 `computed` 輕鬆**推導**出值。
4. 使用 `effect` 而非 `ngOnChanges` 或 setter，能更輕鬆、更局部地監控輸入。
