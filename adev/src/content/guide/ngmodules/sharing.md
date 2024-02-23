# 共享模組

建立共用模組，可讓您整理並簡化程式碼。
您可以將常用指令、管道和元件放入一個模組，然後在應用程式的其他部分需要時，僅匯入該模組。

考慮以下一個假想應用程式的模組：

<docs-code language="typescript" highlight="[9,19,20]">
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CustomerComponent } from './customer.component';
import { NewItemDirective } from './new-item.directive';
import { OrdersPipe } from './orders.pipe';

@NgModule({
  imports: [CommonModule],
  declarations: [
    CustomerComponent,
    NewItemDirective,
    OrdersPipe
  ],
  exports: [
    CustomerComponent,
    NewItemDirective,
    OrdersPipe,
    CommonModule,
    FormsModule
  ],
})
export class SharedModule { }

</docs-code>

請注意以下事項：

* 它匯入 `CommonModule` 因為模組的元件需要常見的指令
* 它宣告並匯出工具管道、指令和元件類別
* 它重新匯出 `CommonModule` 和 `FormsModule`

藉由重新導出 `CommonModule` 和 `FormsModule`，任何匯入此 `SharedModule` 的其他模組，都能存取 `CommonModule` 的指令，例如 `NgIf` 和 `NgFor`，並能以 `FormsModule` 中的指令 `[(ngModel)]` 繫結至元件屬性。

即使由 `SharedModule` 宣告的元件可能不會與 `[(ngModel)]` 繫結，而且 `SharedModule` 可能不需要匯入 `FormsModule`，`SharedModule` 仍然可以匯出 `FormsModule`，而不用將它列在 `imports` 之中。
這樣您可以讓其他模組存取 `FormsModule`，而不用讓它自己可用。

## 更多有關 NgModules

<docs-pill-row>
  <docs-pill href="/guide/ngmodules/providers" title="提供者"/>
  <docs-pill href="/guide/ngmodules/module-types" title="功能模組類型"/>
</docs-pill-row>
