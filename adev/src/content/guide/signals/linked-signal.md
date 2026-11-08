# 使用 `linkedSignal` 處理相依狀態

你可以使用 `signal` 函式在 Angular 程式碼中保存某些狀態。有時，這個狀態會依賴_其他_狀態。例如，想像一個讓使用者為訂單選擇運送方式的元件：

```typescript
@Component({
  /* ... */
})
export class ShippingMethodPicker {
  shippingOptions: Signal<ShippingMethod[]> = getShippingOptions();

  // Select the first shipping option by default.
  selectedOption = signal(this.shippingOptions()[0]);

  changeShipping(newOptionIndex: number) {
    this.selectedOption.set(this.shippingOptions()[newOptionIndex]);
  }
}
```

在這個範例中，`selectedOption` 預設為第一個選項，但使用者選擇其他選項時就會改變。然而 `shippingOptions` 是個訊號，它的值可能會變！如果 `shippingOptions` 改變，`selectedOption` 可能會包含一個不再有效的選項值。

**`linkedSignal` 函式讓你建立一個訊號，用來保存與其他狀態本質上_相連結_的狀態**。回到上面的範例，`linkedSignal` 可以取代 `signal`：

```ts
@Component({
  /* ... */
})
export class ShippingMethodPicker {
  shippingOptions: Signal<ShippingMethod[]> = getShippingOptions();

  // Initialize selectedOption to the first shipping option.
  selectedOption = linkedSignal(() => this.shippingOptions()[0]);

  changeShipping(index: number) {
    this.selectedOption.set(this.shippingOptions()[index]);
  }
}
```

`linkedSignal` 的運作方式與 `signal` 類似，但有一個關鍵差異——你傳入的不是預設值，而是一個_計算函式_，就像 `computed` 一樣。當計算的值改變時，`linkedSignal` 的值就會變成計算結果。這能確保 `linkedSignal` 隨時都持有有效的值。

以下範例展示 `linkedSignal` 的值如何隨其連結的狀態而改變：

```ts
const shippingOptions = signal(['Ground', 'Air', 'Sea']);
const selectedOption = linkedSignal(() => shippingOptions()[0]);
console.log(selectedOption()); // 'Ground'

selectedOption.set(shippingOptions()[2]);
console.log(selectedOption()); // 'Sea'

shippingOptions.set(['Email', 'Will Call', 'Postal service']);
console.log(selectedOption()); // 'Email'
```

## 將先前狀態納入考量

在某些情況下，`linkedSignal` 的計算需要把 `linkedSignal` 的先前值納入考量。

在上面的範例中，當 `shippingOptions` 改變時，`selectedOption` 總是會回到第一個選項。然而，如果使用者已選的選項仍在清單中，你可能會想保留使用者的選擇。為此，你可以建立一個帶有分開的 _source_ 與 _computation_ 的 `linkedSignal`：

```ts
interface ShippingMethod {
  id: number;
  name: string;
}

@Component({
  /* ... */
})
export class ShippingMethodPicker {
  constructor() {
    this.changeShipping(2);
    this.changeShippingOptions();
    console.log(this.selectedOption()); // {"id":2,"name":"Postal Service"}
  }

  shippingOptions = signal<ShippingMethod[]>([
    {id: 0, name: 'Ground'},
    {id: 1, name: 'Air'},
    {id: 2, name: 'Sea'},
  ]);

  selectedOption = linkedSignal<ShippingMethod[], ShippingMethod>({
    // `selectedOption` is set to the `computation` result whenever this `source` changes.
    source: this.shippingOptions,
    computation: (newOptions, previous) => {
      // If the newOptions contain the previously selected option, preserve that selection.
      // Otherwise, default to the first option.
      return newOptions.find((opt) => opt.id === previous?.value.id) ?? newOptions[0];
    },
  });

  changeShipping(index: number) {
    this.selectedOption.set(this.shippingOptions()[index]);
  }

  changeShippingOptions() {
    this.shippingOptions.set([
      {id: 0, name: 'Email'},
      {id: 1, name: 'Sea'},
      {id: 2, name: 'Postal Service'},
    ]);
  }
}
```

建立 `linkedSignal` 時，你可以傳入一個帶有分開的 `source` 與 `computation` 屬性的物件，而不只是提供一個計算函式。

`source` 可以是任何訊號，例如 `computed` 或元件的 `input`。當 `source` 改變、或 `computation` 中參考的任何訊號改變時，`linkedSignal` 就會以所提供 `computation` 的結果更新自己的值。

`computation` 是一個函式，會收到 `source` 的新值和一個 `previous` 物件。`previous` 物件有兩個屬性——`previous.source` 是 `source` 的先前值，`previous.value` 是 `linkedSignal` 的先前值。你可以用這些先前值來決定計算的新結果。

HELPFUL: 使用 `previous` 參數時，你必須明確提供 `linkedSignal` 的泛型型別引數。第一個泛型型別對應 `source` 的型別，第二個泛型型別決定 `computation` 的輸出型別。

## 自訂相等比較

`linkedSignal` 和其他任何訊號一樣，可以設定自訂的相等比較函式。下游依賴會使用這個函式來判斷 `linkedSignal` 的值（即計算結果）是否已改變：

```typescript
const activeUser = signal({id: 123, name: 'Morgan', isAdmin: true});

const activeUserEditCopy = linkedSignal(() => activeUser(), {
  // Consider the user as the same if it's the same `id`.
  equal: (a, b) => a.id === b.id,
});

// Or, if separating `source` and `computation`
const activeUserEditCopy = linkedSignal({
  source: activeUser,
  computation: (user) => user,
  equal: (a, b) => a.id === b.id,
});
```

## 自訂 set 操作

有時，你會希望 `linkedSignal` 的 `set` 與 `update` 操作能寫回真實來源，而不是直接更新 `linkedSignal` 本身的值。你可以在選項中傳入一個 `set` 函式來自訂這個行為。

自訂的 `set` 函式會收到兩個引數：

1. 要設定的新值。
2. 一個 `rawSet` 函式，你可以呼叫它來直接更新 `linkedSignal` 的內部狀態（與預設行為相同）。

NOTE: 使用 `rawSet` 可以讓你直接更新 `linkedSignal` 的值。當你不想讓計算執行時這很有用，例如該衍生運算成本高昂、而你已經知道結果。

### 寫回來源訊號

想像一個元件，它顯示並允許編輯華氏溫度，但以一個攝氏溫度訊號作為真實來源：

```typescript
const tempC = signal(0);
const tempF = linkedSignal(() => (tempC() * 9) / 5 + 32, {
  set: (valF) => tempC.set(((valF - 32) * 5) / 9),
});

console.log(tempF()); // 32

// Setting Fahrenheit updates Celsius, which reactively updates Fahrenheit
tempF.set(212);
console.log(tempC()); // 100
console.log(tempF()); // 212
```

### 更新父物件內的屬性

另一個常見情境是更新父物件內的特定屬性。父物件保存在一個訊號中，而你連結到其中一個巢狀屬性：

```typescript
interface Order {
  id: number;
  shippingMethod: string;
}

const order = signal<Order>({
  id: 42,
  shippingMethod: 'Ground',
});

const shippingMethod = linkedSignal(() => order().shippingMethod, {
  set: (newMethod) => {
    // Perform an immutable update to write the change back to the order
    order.update((currentOrder) => ({
      ...currentOrder,
      shippingMethod: newMethod,
    }));
  },
});

console.log(shippingMethod()); // 'Ground'

// Updating the shippingMethod updates the parent order object
shippingMethod.set('Air');
console.log(order()); // { id: 42, shippingMethod: 'Air' }
console.log(shippingMethod()); // 'Air'
```
