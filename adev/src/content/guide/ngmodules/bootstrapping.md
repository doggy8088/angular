# 以根模組啟動你的應用程式

NgModule 描述應用程式各部分如何組裝在一起。
每個應用程式至少有一個 Angular 模組，即*根*模組，它必須存在，應用程式才能在啟動時進行啟動（bootstrapping）。
依慣例並作為預設，這個 NgModule 名為 `AppModule`。

當你使用 [Angular CLI](/tools/cli) 的 `ng new` 指令加上 `no-standalone` 選項來產生應用程式時，預設的 `AppModule` 如下所示：

<docs-code language="typescript">
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

</docs-code>

`@NgModule` 裝飾器將 `AppModule` 標示為 `NgModule` 類別。
`@NgModule` 接受一組中繼資料物件，告訴 Angular 如何編譯並啟動應用程式。

| 中繼資料欄位    | 詳細說明 |
|:---               |:---     |
| `declarations`    | 包含*根*應用程式元件。                                                                        |
| `imports`         | 匯入 `BrowserModule`，以啟用瀏覽器專屬服務（例如 DOM 渲染、清理）                 |
| `providers`       | 服務提供者。                                                                                            |
| `bootstrap`       | Angular 建立並插入 `index.html` 宿主網頁的*根*元件。                        |

## `declarations` 陣列 {#the-declarations-array}

模組的 `declarations` 陣列告訴 Angular 哪些元件屬於該模組。
當你建立更多元件時，將它們加入 `declarations`。

`declarations` 陣列只接受可宣告類別。
可宣告類別是[元件](guide/components)、[指令](guide/directives)與[管道](guide/templates/pipes)。
模組的所有可宣告類別都必須在 `declarations` 陣列中。
可宣告類別必須恰好屬於一個模組。
如果你在多個模組中宣告同一個類別，編譯器會回傳錯誤。

這些宣告的類別可以在模組內使用，但對不同模組中的元件是私有的，除非它們從此模組匯出，且另一個模組匯入了此模組。

以下是放入 declarations 陣列的內容範例：

<docs-code language="typescript">

declarations: [
  YourComponent,
  YourPipe,
  YourDirective
],

</docs-code>

### 搭配 `@NgModule` 使用指令 {#using-directives-with-ngmodule}

指令使用 `declarations` 陣列。
若要在模組中使用指令、元件或管道，你必須完成幾件事：

1. 從你撰寫它的 TypeScript 檔案中將它匯出
2. 將它匯入包含 `@NgModule` 類別的相應檔案。
3. 在 `@NgModule` 的 `declarations` 陣列中宣告它。

這三個步驟如下所示。在你建立指令的檔案中，將它匯出。
下列範例顯示一個名為 `ItemDirective` 的空白指令。

<docs-code header="src/app/item.directive.ts" highlight="[6]">
import { Directive } from '@angular/core';

@Directive({
  selector: '[appItem]'
})
export class ItemDirective {
  // your code here
}
</docs-code>

這裡的關鍵是，你必須將它匯出，這樣才能在其他地方匯入它。
接著，將它匯入你的 `NgModule` 所在的檔案。在此範例中，這個檔案是 `app.module.ts`。

<docs-code header="src/app/app.module.ts">
import { ItemDirective } from './item.directive';
</docs-code>

並在同一個檔案中，將它加入 `@NgModule` 的 `declarations` 陣列：

<docs-code header="src/app/app.module.ts" highlight="[3]">
  declarations: [
    AppComponent,
    ItemDirective
  ],
</docs-code>

現在你可以在元件中使用 `ItemDirective` 了。
此範例使用 `AppModule`，但功能模組的步驟相同。
關於指令的更多資訊，請見[屬性指令](guide/directives/attribute-directives)與[結構指令](guide/directives/structural-directives)。
[管道](guide/templates/pipes)與[元件](guide/components)也使用相同的技巧。

請記住，元件、指令與管道只屬於一個模組。
你只需要在應用程式中宣告它們一次，因為你可以透過匯入必要的模組來分享它們。
這能節省你的時間，並幫助應用程式保持精簡。

## `imports` 陣列 {#the-imports-array}

模組在 `@NgModule` 中繼資料物件中接受 `imports` 陣列。
它告訴 Angular 這個特定模組需要哪些其他 NgModule 才能正常運作。

<docs-code header="src/app/app.module.ts">
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule
  ],
</docs-code>

這份模組清單中的模組，匯出了此模組中元件範本所參照的元件、指令或管道。
在此例中，元件是 `AppComponent`，它參照了 `BrowserModule`、`FormsModule` 或 `HttpClientModule` 中的元件、指令或管道。
當被參照的類別宣告在此模組中，或該類別從另一個模組匯入時，元件範本可以參照另一個元件、指令或管道。

## `providers` 陣列 {#the-providers-array}

providers 陣列是你列出應用程式所需服務的地方。
當你在這裡列出服務時，它們在整個應用程式中都可以使用。
使用功能模組與延遲載入時，你可以為它們限定作用域。
更多資訊，請見[模組中的提供者](guide/ngmodules/providers)。

## `bootstrap` 陣列 {#the-bootstrap-array}

應用程式透過啟動根 `AppModule` 來啟動。
啟動程序會建立 `bootstrap` 陣列中列出的元件，並在找到與元件 `selector` 相符的元素時，將每個元件插入瀏覽器 DOM。

每個被啟動的元件都是它自己那棵元件樹的基底。
插入被啟動的元件，通常會觸發一連串的元件建立，從而建構出那棵樹。
雖然你可以在宿主網頁上放置多棵元件樹，但大多數應用程式只有一棵元件樹，並啟動單一根元件。

根元件通常稱為 `AppComponent`，位於根模組的 `bootstrap` 陣列中。

如果你想根據 API 回應啟動元件，
或想將 `AppComponent` 掛載到與元件選擇器不相符的不同 DOM 節點，請參閱 `ApplicationRef.bootstrap()` 文件。

## 更多關於 Angular 模組 {#more-about-angular-modules}

請見[常用模組](guide/ngmodules/frequent)，了解更多關於應用程式中常見模組的資訊。
