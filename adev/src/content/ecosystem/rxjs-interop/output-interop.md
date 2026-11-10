# RxJS 與元件及指令輸出的互通

TIP: 本指南假設你已熟悉[元件與指令的輸出](guide/components/outputs)。

`@angular/rxjs-interop` 套件提供兩個與元件及指令輸出相關的 API。

## 根據 RxJS Observable 建立輸出

`outputFromObservable` 讓你建立一個元件或指令輸出，其發送行為依 RxJS observable 而定：

```ts {highlight:[11]}
import {Directive} from '@angular/core';
import {outputFromObservable} from '@angular/core/rxjs-interop';

@Directive({
  /*...*/
})
class Draggable {
  pointerMoves$: Observable<PointerMovements> = listenToPointerMoves();

  // Whenever `pointerMoves$` emits, the `pointerMove` event fires.
  pointerMove = outputFromObservable(this.pointerMoves$);
}
```

`outputFromObservable` 函式對 Angular 編譯器具有特殊意義。**你只能在元件與指令的屬性初始化運算式中呼叫 `outputFromObservable`**。

當你 `subscribe` 這個輸出時，Angular 會自動把訂閱轉發給底層的 observable。當元件或指令被銷毀時，Angular 就會停止轉發值。

HELPFUL: 如果你能以命令式的方式發送值，可以考慮直接使用 `output()`。

## 從元件或指令輸出建立 RxJS Observable

`outputToObservable` 函式讓你從元件輸出建立 RxJS observable。

```ts {highlight:[11]}
import {outputToObservable} from '@angular/core/rxjs-interop';

@Component(/*...*/)
class CustomSlider {
    valueChange = output<number>();
}

// Instance reference to `CustomSlider`.
const slider: CustomSlider = createSlider();

outputToObservable(slider.valueChange) // Observable<number>
    .pipe(...)
    .subscribe(...);
```

HELPFUL: 如果 `OutputRef` 上的 `subscribe` 方法已能滿足你的需求，可以考慮直接使用它。
