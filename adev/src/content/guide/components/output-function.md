# 以函式為基礎的 outputs

`output()` 函式在指令或元件中宣告一個 output。Outputs 讓你可以將值發送給父元件。

HELPFUL: `output()` 函式目前處於[開發者預覽](/reference/releases#developer-preview)階段。

<docs-code language="ts" highlight="[[5], [8]]">
import {Component, output} from '@angular/core';

@Component({...})
export class MyComp {
  nameChange = output<string>()    // OutputEmitterRef<string>

  setNewName(newName: string) {
    this.nameChange.emit(newName);
  }
}
</docs-code>

只要你將 `output` 函式用作類別成員的初始化器，Angular 就會自動將其辨識為 output。父元件可以在範本中使用事件繫結語法來監聽 outputs。

```angular-html
<my-comp (nameChange)="showNewName($event)" />
```

## 為 output 取別名 {#aliasing-an-output}

Angular 使用類別成員名稱作為 output 的名稱。你可以為 outputs 取別名，將其公開名稱改為不同的名稱。

```typescript
class MyComp {
  nameChange = output({alias: 'ngxNameChange'});
}
```

這樣使用者就能使用 `(ngxNameChange)` 繫結到你的 output，而在元件內部，你可以使用 `this.nameChange` 存取該 output 發送器。

## 以程式方式訂閱 {#subscribing-programmatically}

使用者可能會透過 `ComponentRef` 的參考動態建立你的元件。在這種情況下，父元件可以直接存取型別為 `OutputRef` 的屬性來訂閱 outputs。

```ts
const myComp = viewContainerRef.createComponent(...);

myComp.instance.nameChange.subscribe(newName => {
  console.log(newName);
});
```

當 `myComp` 被銷毀時，Angular 會自動清理該訂閱。另外，它會傳回一個帶有函式的物件，可用來提早明確取消訂閱。

## 使用 RxJS observables 作為來源 {#using-rxjs-observables-as-source}

在某些情況下，你可能想根據 RxJS observables 發送 output 的值。Angular 提供了一種使用 RxJS observables 作為 outputs 來源的方式。

`outputFromObservable` 函式是一個編譯器原語，類似於 `output()` 函式，用來宣告由 RxJS observables 驅動的 outputs。

<docs-code language="ts" highlight="[7]">
import {Directive} from '@angular/core';
import {outputFromObservable} from '@angular/core/rxjs-interop';

@Directive(...)
class MyDir {
  nameChange$ = this.dataService.get(); // Observable<Data>
  nameChange = outputFromObservable(this.nameChange$);
}
</docs-code>

Angular 會將訂閱轉發給該 observable，但當所屬指令被銷毀時，就會停止轉發值。在上面的範例中，如果 `MyDir` 被銷毀，`nameChange` 將不再發送值。

HELPFUL: 大多數情況下，使用 `output()` 就足夠了，你可以以命令式的方式發送值。

## 將 output 轉換為 observable {#converting-an-output-to-an-observable}

你可以呼叫 `OutputRef` 上的 `.subscribe` 方法來訂閱 outputs。在其他情況下，Angular 提供了一個輔助函式，可將 `OutputRef` 轉換為 observable。

<docs-code language="ts" highlight="[11]">
import {outputToObservable} from '@angular/core/rxjs-interop';

@Component(...)
class MyComp {
  nameChange = output<string>();
}

// Instance reference to `MyComp`.
const myComp: MyComp;

outputToObservable(this.myComp.instance.nameChange) // Observable<string>
  .pipe(...)
  .subscribe(...);
</docs-code>

## 為什麼應該使用 `output()` 而非裝飾器式的 `@Output()`？ {#why-you-should-use-output-over-decorator-based-output}

`output()` 函式相較於裝飾器式的 `@Output` 與 `EventEmitter`，提供了許多好處：

1. 更簡單的心智模型與 API：
  <br/>• 沒有錯誤通道、完成通道，或其他來自 RxJS 的 API 等概念。
  <br/>• Outputs 是簡單的發送器。你可以使用 `.emit` 函式發送值。
2. 更精確的型別。
  <br/>• `OutputEmitterRef.emit(value)` 現在有正確的型別，而 `EventEmitter` 的型別有問題，可能造成執行時期錯誤。
