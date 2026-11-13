# 以根模組啟動你的應用程式

#### 先備知識

對下列內容有基本了解：
* [JavaScript 模組與 NgModule 的差異](guide/ngmodule-vs-jsmodule)。

<hr />

NgModule 描述應用程式各部分如何組裝在一起。
每個應用程式至少有一個 Angular 模組，即*根*模組，
它必須存在，應用程式才能在啟動時進行啟動（bootstrapping）。
依慣例並作為預設，這個 NgModule 名為 `AppModule`。

當你使用 [Angular CLI](cli) 指令 `ng new` 來產生應用程式時，預設的 `AppModule` 如下所示：

```typescript
/* JavaScript imports */
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';

/* the AppModule class with the @NgModule decorator */
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

```

在匯入陳述式之後，是一個帶有
**`@NgModule`** [裝飾器](guide/glossary#decorator '"Decorator" explained')的類別。

`@NgModule` 裝飾器將 `AppModule` 標示為 `NgModule` 類別。
`@NgModule` 接受一組中繼資料物件，告訴 Angular 如何編譯並啟動應用程式。

* **_declarations_**&mdash;這個應用程式唯一的元件。
* **_imports_**&mdash;匯入 `BrowserModule` 以取得瀏覽器專屬服務，例如 DOM 渲染、清理與位置。
* **_providers_**&mdash;服務提供者。
* **_bootstrap_**&mdash;Angular 建立並插入
`index.html` 主機網頁的*根*元件。

Angular CLI 建立的預設應用程式只有一個元件 `AppComponent`，因此它
同時出現在 `declarations` 與 `bootstrap` 陣列中。

{@a declarations}

## `declarations` 陣列

模組的 `declarations` 陣列告訴 Angular 哪些元件屬於該模組。
當你建立更多元件時，將它們加入 `declarations`。

你必須在恰好一個 `NgModule` 類別中宣告每個元件。
如果你使用未宣告的元件，Angular 會傳回
錯誤訊息。

`declarations` 陣列只接受可宣告物（declarables）。可宣告物
是指元件、[指令](guide/attribute-directives)與[管道](guide/pipes)。
模組的所有可宣告物都必須放在 `declarations` 陣列中。
可宣告物必須屬於恰好一個模組。編譯器會在
你嘗試在多個模組中宣告同一個類別時發出錯誤。

這些宣告的類別在模組內可見，但對不同模組中的元件
不可見，除非它們從此模組匯出，
且另一個模組匯入了此模組。

以下是放入 declarations 陣列的內容範例：

```typescript
  declarations: [
    YourComponent,
    YourPipe,
    YourDirective
  ],
```

一個可宣告物只能屬於一個模組，因此只在
一個 `@NgModule` 中宣告它。當你需要在其他地方使用它時，
請匯入包含你所需可宣告物的模組。


### 搭配 `@NgModule` 使用指令

指令使用 `declarations` 陣列。
若要在模組中使用指令、元件或管道，你必須完成幾件事：

1. 從撰寫它的檔案中將其匯出。
2. 將其匯入適當的模組。
3. 在 `@NgModule` 的 `declarations` 陣列中宣告它。


這三個步驟如下所示。在建立指令的檔案中，將其匯出。
以下名為 `ItemDirective` 的範例，是 CLI 在其自有檔案 `item.directive.ts` 中產生的預設指令結構：

<code-example path="bootstrapping/src/app/item.directive.ts" region="directive" header="src/app/item.directive.ts"></code-example>

這裡的重點是，你必須將其匯出，才能在其他地方匯入它。接著，
使用 JavaScript 匯入陳述式將其匯入 `NgModule`，在此例中為 `app.module.ts`：

<code-example path="bootstrapping/src/app/app.module.ts" region="directive-import" header="src/app/app.module.ts"></code-example>

並在同一個檔案中，將它加入 `@NgModule` 的 `declarations` 陣列：

<code-example path="bootstrapping/src/app/app.module.ts" region="declarations" header="src/app/app.module.ts"></code-example>


現在你可以在元件中使用 `ItemDirective` 了。此例使用 `AppModule`，但對於功能模組，做法也相同。關於指令的更多資訊，請見[屬性指令](guide/attribute-directives)與[結構指令](guide/structural-directives)。對於[管道](guide/pipes)與元件，你也可以使用相同的技巧。

請記住，元件、指令與管道只屬於一個模組。你只需要在應用程式中宣告它們一次，因為你可以透過匯入必要的模組來分享它們。這能節省你的時間，並幫助應用程式保持精簡。

{@a imports}

## `imports` 陣列

模組的 `imports` 陣列只出現在 `@NgModule` 中繼資料物件中。
它告訴 Angular，這個特定模組正常運作所需的其他 NgModule。

<code-example
    path="bootstrapping/src/app/app.module.ts"
    region="imports"
    header="src/app/app.module.ts (excerpt)">
</code-example>

這份模組清單中的模組，匯出了此模組中元件範本所參照的元件、指令或管道。
在此例中，元件是
`AppComponent`，它參照了 `BrowserModule`、
`FormsModule` 或  `HttpClientModule` 中的元件、指令或管道。
當被參照的類別宣告在此模組中，
或該類別從另一個模組匯入時，元件範本可以參照另一個元件、指令或管道。



{@a bootstrap-array}

## `providers` 陣列

providers 陣列是你列出應用程式所需服務的地方。當
你在這裡列出服務時，它們在整個應用程式中都可以使用。你可以
在使用功能模組與延遲載入時為它們限定作用域。更多資訊，請見
[提供者](guide/providers)。

## `bootstrap` 陣列

應用程式透過啟動根 `AppModule` 來啟動，該根模組
也稱為 `entryComponent`。
啟動程序除了其他工作之外，還會建立 `bootstrap` 陣列中列出的元件，
並將每一個插入瀏覽器 DOM。

每個已啟動的元件都是其所屬元件樹的基礎。
插入已啟動的元件通常會觸發
一連串元件建立，填滿該樹。

雖然你可以在一個主機網頁上放置多個元件樹，
但大多數應用程式只有一個元件樹，並啟動單一根元件。

這個根元件通常稱為 `AppComponent`，位於
根模組的 `bootstrap` 陣列中。

如果你想根據 API 回應啟動元件，
或想將 `AppComponent` 掛載到與元件選擇器不相符的不同 DOM 節點，
請參閱 `ApplicationRef.bootstrap()`
文件。

## 更多關於 Angular 模組

關於你在應用程式中可能經常看到的 NgModule 的更多資訊，
請見[常用模組](guide/frequent-ngmodules)。
