# 進入點元件

進入點元件是指 Angular 以命令式方式依型別載入的任何元件（意即你沒有在範本中參照它）。你可以透過在 NgModule 中啟動它，或將它納入路由定義，來指定進入點元件。

<div class="alert is-helpful">

為了對比這兩種類型的元件：有些元件包含在範本中，屬於宣告式元件。另外還有你以命令式方式載入的元件，也就是進入點元件。

</div>


進入點元件主要有兩種：

* 被啟動的根元件。
* 你在路由定義中指定的元件。


## 被啟動的進入點元件


以下範例示範如何在基本的 `app.module.ts` 中指定被啟動的元件 `AppComponent`：

```typescript
@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent] // bootstrapped entry component
})
```

被啟動的元件是一種進入點元件，Angular 會在啟動流程（應用程式啟動）期間將它載入 DOM。
其他進入點元件則透過其他方式動態載入，例如透過路由器。

Angular 會動態載入根元件 `AppComponent`，因為它以型別列於 `@NgModule.bootstrap` 中。

<div class="alert is-helpful">

元件也可以在模組的 `ngDoBootstrap()` 方法中以命令式方式啟動。
`@NgModule.bootstrap` 屬性告訴編譯器這是一個進入點元件，編譯器應產生程式碼，用這個元件來啟動應用程式。

</div>


被啟動的元件必然是進入點元件，因為啟動是一個命令式流程，所以它需要有一個進入點元件。

## 路由進入點元件


第二種進入點元件出現在像這樣的路由定義中：

```typescript
const routes: Routes = [
  {
    path: '',
    component: CustomerListComponent
  }
];
```

路由定義透過 `component: CustomerListComponent` 以型別參照一個元件。

所有路由器元件都必須是進入點元件。因為這會要求你在兩個地方加入該元件（路由器和 `entryComponents`），編譯器很聰明，能辨識出這是一個路由定義，並自動將路由器元件加入 `entryComponents`。


## `entryComponents` 陣列

雖然 `@NgModule` 裝飾器有一個 `entryComponents` 陣列，但大多數時候你不需要明確設定任何進入點元件，因為 Angular 會自動把列在 `@NgModule.bootstrap` 中的元件，以及路由定義中的元件，加入進入點元件。雖然這兩個機制涵蓋了大多數的進入點元件，但如果你的應用程式以命令式方式依型別啟動或動態載入某個元件，你就必須明確地將它加入 `entryComponents`。

### `entryComponents` 與編譯器

對於生產環境的應用程式，你會希望載入的程式碼盡可能小。
程式碼應該只包含你實際需要的類別，並排除永遠不會用到的元件。因此，Angular 編譯器只會為能從 `entryComponents` 到達的元件產生程式碼；這表示在 `@NgModule.declarations` 中加入更多參照，並不代表它們一定會包含在最終的程式包中。

事實上，許多程式庫都會宣告並匯出你永遠不會用到的元件。
例如，一個 Material Design 程式庫會匯出所有元件，因為它不知道你會使用哪一些。不過，你不太可能全部都用到。
對於你沒有參照的元件，搖樹優化（tree-shaking）會把它們從最終的程式碼包中丟棄。

如果一個元件不是*進入點元件*，也沒有出現在某個範本中，搖樹優化就會把它丟棄。所以，最好只加入真正是進入點元件的元件，幫助你的應用程式保持盡可能精簡。


<hr />

## 關於 Angular 模組的更多資訊

你可能也會對以下內容感興趣：
* [NgModule 的類型](guide/module-types)
* [使用 Angular 路由器延遲載入模組](guide/lazy-loading-ngmodules)。
* [提供者](guide/providers)。
* [NgModule 常見問題](guide/ngmodule-faq)。
