# 共享模組

#### 必要條件
對下列主題具備基本認識：
* [功能模組](guide/feature-modules)。
* [JavaScript 模組與 NgModule](guide/ngmodule-vs-jsmodule)。
* [常用的模組](guide/frequent-ngmodules)。
* [路由與導覽](guide/router)。
* [延遲載入模組](guide/lazy-loading-ngmodules)。


<!--* Components (#TBD) We don’t have a page just on the concept of components, but I think one would be helpful for beginners.-->

<hr>

建立共享模組能讓你組織並精簡你的程式碼。你可以把常用的指令、管道與元件放進一個模組，然後在應用程式其他需要它的地方只需匯入這個模組。

以下是一個假想應用程式中的模組：


```typescript
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CustomerComponent } from './customer.component';
import { NewItemDirective } from './new-item.directive';
import { OrdersPipe } from './orders.pipe';

@NgModule({
 imports:      [ CommonModule ],
 declarations: [ CustomerComponent, NewItemDirective, OrdersPipe ],
 exports:      [ CustomerComponent, NewItemDirective, OrdersPipe,
                 CommonModule, FormsModule ]
})
export class SharedModule { }
```

請注意下列事項：

* 它匯入 `CommonModule`，因為該模組的元件需要常用指令。
* 它宣告並匯出公用程式管道、指令與元件類別。
* 它重新匯出 `CommonModule` 與 `FormsModule`。

透過重新匯出 `CommonModule` 與 `FormsModule`，任何匯入這個 `SharedModule` 的其他模組，都能取用 `CommonModule` 中的 `NgIf`、`NgFor` 等指令，並能用 `[(ngModel)]`（`FormsModule` 中的一個指令）繫結到元件屬性。

即使 `SharedModule` 宣告的元件可能不會用 `[(ngModel)]` 繫結，`SharedModule` 也可能不需要匯入 `FormsModule`，`SharedModule` 仍然可以匯出 `FormsModule`，而不必把它列在自己的 `imports` 中。這樣一來，你可以讓其他模組取用 `FormsModule`，而不必直接把它匯入 `@NgModule` 裝飾器。

### 使用來自其他模組的元件與服務。

使用另一個模組的元件，與使用另一個模組的服務，兩者有一個重要的區別。當你想使用指令、管道與元件時，就匯入模組。匯入帶有服務的模組，意味著你會得到該服務的一個新實例，而這通常不是你想要的（通常會想重用既有的服務）。請用模組匯入來控制服務的實例化。

取得共享服務最常見的方式是透過 Angular 的 [相依性注入](guide/dependency-injection)，而不是透過模組系統（匯入模組會產生新的服務實例，這不是典型的用法）。

若要了解如何共享服務，請參閱 [Providers](guide/providers)。


<hr />

## 更多關於 NgModules

你可能也會對以下內容有興趣：
* [Providers](guide/providers)。
* [功能模組的類型](guide/module-types)。
