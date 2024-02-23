# 使用根模組啟動應用程式

NgModule 描述應用程序部分如何結合在一起。
每個應用程序至少有一個 Angular 模塊，即 *根* 模塊，必須存在才能在啟動時引導應用程序。
根據慣例和默認情況，此 NgModule 名稱為 `AppModule`。

當您使用 [Angular CLI](/tools/cli) `ng new` 命令來產生一個應用程式時，預設的 `AppModule` 看起來像以下：

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

`@NgModule` 裝飾器將 `AppModule` 標識為 `NgModule` 類別。
`@NgModule` 採用一個元數據物件，告訴 Angular 如何編譯和啟動應用程式。

| 元數據欄位    | 詳細資料 |
|:---               |:---     |
| `declarations`    | 包括 *根* 應用程式元件。                                                                            |
| `imports`         | 匯入 `BrowserModule` 以啟用特定於瀏覽器的服務（例如 DOM 呈現、清理）                                 |
| `providers`       | 服務提供者。                                                                                              |
| `bootstrap`       | Angular 建立並插入到 `index.html` 主機網頁的 *根* 元件。                                          |

## `declarations` 陣列

該模組的 `declarations` 陣列告訴 Angular 哪些元件屬於該模組。
當您建立更多元件時，將它們新增至 `declarations`。

`declarations` 陣列只接受可宣告項。
可宣告項包括 [元件](/components)、[指令](/directives) 和 [管道](/guide/pipes)。
模組的所有可宣告項都必須在 `declarations` 陣列中。
可宣告項必須只屬於一個模組。
如果在多個模組中宣告同一個類別，編譯器會傳回錯誤。

這些宣告的類別可以在模組中使用，但對其他模組中的元件是私有的，除非它們是由這個模組匯出且其他模組匯入這個模組。

以下是一個宣告陣列內容的範例：

<docs-code language="typescript">

declarations: [
  YourComponent,
  YourPipe,
  YourDirective
],

</docs-code>

### 使用指令和 `@NgModule`

使用 `declarations` 陣列來放指令。
若要在模組中使用指令、元件或管道，您必須執行以下幾件事：

1. 從您編寫它的 TypeScript 檔案中匯出
2. 匯入至包含 `@NgModule` 類別的適當檔案中。
3. 在 `@NgModule` `declarations` 陣列中宣告它。

以下三個步驟看起來像這樣。在建立指令的檔案中，將它匯出。
以下範例顯示一個名為 `ItemDirective` 的空指令。

<docs-code header="src/app/item.directive.ts" highlight="[6]">
import { Directive } from '@angular/core';

@Directive({
  selector: '[appItem]'
})
export class ItemDirective {
  // your code here
}
</docs-code>

這裡的重點是您必須匯出它，以便您可以在其他地方匯入它。
接下來，將它匯入您的 `NgModule` 所在的文件。在此範例中，這是 `app.module.ts` 文件。

<docs-code header="src/app/app.module.ts">
import { ItemDirective } from './item.directive';
</docs-code>

在同一個檔案中，將它加入 `@NgModule` 的 `declarations` 陣列：

<docs-code header="src/app/app.module.ts" highlight="[3]">
  declarations: [
    AppComponent,
    ItemDirective
  ],
</docs-code>

現在您可以在元件中使用 `ItemDirective`。
此範例使用 `AppModule`，但您會對功能模組執行相同的步驟。
有關指令的詳細資訊，請參閱 [屬性指令](/guide/directives/attribute-directives) 和 [結構指令](/guide/directives/structural-directives)。
您也會對 [管道](/guide/pipes) 和 [元件](/components) 使用相同的技巧。

記住，元件、指令和管道僅屬於一個模組。
您只需在應用程式中宣告它們一次，因為您可以透過匯入必要的模組來共享它們。
這可以節省您的時間，並有助於保持應用程式的精簡。

## `imports` 陣列

模組在 `@NgModule` 元資料物件中接受 `imports` 陣列。
它告訴 Angular 此特定模組需要正常運作的其他 NgModules。

<docs-code header="src/app/app.module.ts">
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule
  ],
</docs-code>

這份模組清單是匯出元件、指令或管線的清單，此模組中的元件範本會參考這些清單。
在這個案例中，元件是 `AppComponent`，它參考了 `BrowserModule`、`FormsModule` 或 `HttpClientModule` 中的元件、指令或管線。
當被參照的類別在此模組中宣告，或該類別從其他模組匯入時，元件範本可以參考其他元件、指令或管線。

## `providers` 陣列

`providers` 陣列是您列出應用程式所需服務的地方。
當您在此列出服務時，它們會在整個應用程式中可用。
您可以在使用功能模組和延遲載入時設定它們的範圍。
如需更多資訊，請參閱 [模組中的提供者](/guide/ngmodules/providers)。

## `bootstrap` 陣列

應用程式透過啟動根 `AppModule` 來啟動。
啟動程序會建立在 `bootstrap` 陣列中列出的元件，如果找到與元件的 `selector` 相符的元素，就會將每個元件插入瀏覽器 DOM 中。

每個引導元件都是其元件樹的基礎。
插入引導元件通常會觸發元件建立的連鎖反應，建立該樹。
即使您可以在主機網頁上放置多個元件樹，但大多數應用程式只有一個元件樹，並引導單一根元件。

根元件通常稱為 `AppComponent`，並位於根模組的 `bootstrap` 陣列中。

在您想根據 API 回應引導元件的情況下，或您想在與元件選擇器不符的其他 DOM 節點中掛載 `AppComponent`，請參閱 `ApplicationRef.bootstrap()` 文件。

## 更多關於 Angular 模組

參閱 [常用模組](guide/ngmodules/frequent)以進一步了解您通常會在應用程式中看到的模組。
