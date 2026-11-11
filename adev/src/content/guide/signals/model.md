# 模型輸入

**模型輸入**是輸入的一種特殊類型，讓元件能將新值傳播回另一個元件。

HELPFUL: 模型輸入目前處於[開發者預覽](/reference/releases#developer-preview)階段。

建立元件時，你可以比照建立標準輸入的方式，定義模型輸入。

```angular-ts
import {Component, model, input} from '@angular/core';

@Component({...})
export class CustomCheckbox {
  // This is a model input.
  checked = model(false);

  // This is a standard input.
  disabled = input(false);
}
```

兩種類型的輸入都允許他人將值繫結到屬性中。不過，**模型輸入允許元件作者將值寫入屬性**。

在其他方面，模型輸入的運作方式與標準輸入類似。你可以呼叫訊號函式來讀取其值，包括在 `computed` 與 `effect` 這類反應式情境中。

```angular-ts
import {Component, model, input} from '@angular/core';

@Component({
  selector: 'custom-checkbox',
  template: '<div (click)="toggle()"> ... </div>',
})
export class CustomCheckbox {
  checked = model(false);
  disabled = input(false);

  toggle() {
    // While standard inputs are read-only, you can write directly to model inputs.
    this.checked.set(!this.checked());
  }
}
```

當元件將新值寫入模型輸入時，Angular 能將新值傳播回正在將值繫結到該輸入的元件。這稱為**雙向繫結**，因為值可以在兩個方向流動。

## 以訊號進行雙向繫結 {#two-way-binding-with-signals}

你可以將可寫訊號繫結到模型輸入。

```angular-ts
@Component({
  ...,
  // `checked` is a model input.
  // The parenthesis-inside-square-brackets syntax (aka "banana-in-a-box") creates a two-way binding
  template: '<custom-checkbox [(checked)]="isAdmin" />',
})
export class UserProfile {
  protected isAdmin = signal(false);
}
```

在上面的範例中，`CustomCheckbox` 可以將值寫入它的 `checked` 模型輸入，這些值接著會傳播回 `UserProfile` 中的 `isAdmin` 訊號。這個繫結讓 `checked` 與 `isAdmin` 的值保持同步。請注意，這個繫結傳遞的是 `isAdmin` 訊號本身，而不是訊號的_值_。

## 與純屬性進行雙向繫結 {#two-way-binding-with-plain-properties}

你可以將純 JavaScript 屬性繫結到模型輸入。

```angular-ts
@Component({
  ...,
  // `checked` is a model input.
  // The parenthesis-inside-square-brackets syntax (aka "banana-in-a-box") creates a two-way binding
  template: '<custom-checkbox [(checked)]="isAdmin" />',
})
export class UserProfile {
  protected isAdmin = false;
}
```

在上面的範例中，`CustomCheckbox` 可以將值寫入它的 `checked` 模型輸入，這些值接著會傳播回 `UserProfile` 中的 `isAdmin` 屬性。這個繫結讓 `checked` 與 `isAdmin` 的值保持同步。

## 隱含的 `change` 事件 {#implicit-change-events}

當你在元件或指令中宣告模型輸入時，Angular 會自動為該模型建立對應的[輸出](guide/components/outputs)。輸出的名稱是模型輸入的名稱加上「Change」後綴。

```angular-ts
@Directive({...})
export class CustomCheckbox {
  // This automatically creates an output named "checkedChange".
  // Can be subscribed to using `(checkedChange)="handler()"` in the template.
  checked = model(false);
}
```

每當你透過呼叫模型輸入的 `set` 或 `update` 方法將新值寫入它時，Angular 就會發出這個變更事件。

## 自訂模型輸入 {#customizing-model-inputs}

你可以比照[標準輸入](guide/signals/inputs)的方式，將模型輸入標記為必要，或為它提供別名。

模型輸入不支援輸入轉換。

## `model()` 與 `input()` 的差異 {#differences-between-model-and-input}

`input()` 與 `model()` 函式都是在 Angular 中定義以訊號為基礎的輸入的方式，但兩者有幾點差異：
1. `model()` 同時定義**輸入與輸出**。輸出的名稱永遠是輸入名稱加上 `Change` 後綴，以支援雙向繫結。要只使用輸入、只使用輸出，或兩者都用，由你的指令使用者自行決定。
2. `ModelSignal` 是 `WritableSignal`，意思是它的值可以用 `set` 與 `update` 方法從任何地方變更。當新值被指派時，`ModelSignal` 會向其輸出發送。這與 `InputSignal` 不同，`InputSignal` 是唯讀的，只能透過範本變更。
3. 模型輸入不支援輸入轉換，訊號輸入則支援。

## 何時使用模型輸入 {#when-to-use-model-inputs}

當你希望元件支援雙向繫結時，請使用模型輸入。當元件的存在目的是依據使用者互動修改某個值時，這通常很合適。最常見的情況是，自訂表單控制項，例如日期選擇器或 combobox，應該以模型輸入作為其主要值。
