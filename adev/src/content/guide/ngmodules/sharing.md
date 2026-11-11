# 共享模組

建立共享模組能讓你組織並精簡你的程式碼。
你可以把常用的指令、管道與元件放進一個模組，然後在應用程式其他需要它的地方只需匯入這個模組。

以下是一個假想應用程式中的模組：

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

請注意下列事項：

* 它匯入 `CommonModule`，因為該模組的元件需要常用指令
* 它宣告並匯出公用程式管道、指令與元件類別
* 它重新匯出 `CommonModule` 與 `FormsModule`

透過重新匯出 `CommonModule` 與 `FormsModule`，任何匯入這個 `SharedModule` 的其他模組，都能取用 `CommonModule` 中的 `NgIf`、`NgFor` 等指令，並能用 `[(ngModel)]`（`FormsModule` 中的一個指令）繫結到元件屬性。

即使 `SharedModule` 宣告的元件可能不會用 `[(ngModel)]` 繫結，`SharedModule` 也可能不需要匯入 `FormsModule`，`SharedModule` 仍然可以匯出 `FormsModule`，而不必把它列在自己的 `imports` 中。
這樣一來，你可以讓其他模組取用 `FormsModule`，而不需要讓它本身也能使用。

## 深入了解 NgModules {#more-on-ngmodules}

<docs-pill-row>
  <docs-pill href="/guide/ngmodules/providers" title="提供者"/>
  <docs-pill href="/guide/ngmodules/module-types" title="功能模組的類型"/>
</docs-pill-row>
