@title
英雄編輯器

@intro
建立一個簡單的英雄編輯器。

@description


## 設定本機開發環境
依照[設定](guide/setup)說明，建立一個名為 <code>angular-tour-of-heroes</code> 的新專案。

檔案結構應該像這樣：


<div class='filetree'>

  <div class='file'>
    angular-tour-of-heroes
  </div>

  <div class='children'>

    <div class='file'>
      src
    </div>

    <div class='children'>

      <div class='file'>
        app
      </div>

      <div class='children'>

        <div class='file'>
          app.component.ts
        </div>

        <div class='file'>
          app.module.ts
        </div>

      </div>

      <div class='file'>
        main.ts
      </div>

      <div class='file'>
        index.html
      </div>

      <div class='file'>
        styles.css
      </div>

      <div class='file'>
        systemjs.config.js
      </div>

      <div class='file'>
        tsconfig.json
      </div>

    </div>

    <div class='file'>
      node_modules ...
    </div>

    <div class='file'>
      package.json
    </div>

  </div>

</div>



完成本頁後，應用程式看起來應該像這樣 <live-example></live-example>。


{@a keep-transpiling}


## 讓應用程式持續轉譯並執行
在終端機視窗中輸入以下命令：


<code-example language="sh" class="code-shell">
  npm start

</code-example>



這個命令會以「監看模式」執行 TypeScript 編譯器，在程式碼變更時自動重新編譯。
這個命令同時會在瀏覽器中啟動應用程式，並在程式碼變更時重新整理瀏覽器。

你可以持續建置英雄之旅，不必停下來重新編譯或重新整理瀏覽器。



## 顯示英雄
為 `AppComponent` 加入兩個屬性：一個 `title` 屬性表示應用程式名稱，一個 `hero` 屬性
表示名為「Windstorm」的英雄。


<code-example path="toh-pt1/app/app.component.1.ts" region="app-component-1" title="app.component.ts (AppComponent class)" linenums="false">

</code-example>



現在，用新屬性的資料繫結來更新 `@Component` 裝飾器中的範本。


<code-example path="toh-pt1/app/app.component.1.ts" region="show-hero" title="app.component.ts (@Component)" linenums="false">

</code-example>



瀏覽器會重新整理，並顯示標題與英雄名稱。

雙大括號是 Angular 的*插值繫結*語法。
這些插值繫結會把元件的 `title` 與 `hero` 屬性值，
以字串形式呈現在 HTML 標題標籤內。


<div class="l-sub-section">



在[顯示資料](guide/displaying-data)頁面中進一步瞭解插值。


</div>



### Hero 物件

英雄需要更多屬性。
把 `hero` 從字面字串轉換為類別。

建立一個具有 `id` 與 `name` 屬性的 `Hero` 類別。
把這些屬性加在 `app.component.ts` 檔案的頂端，緊接在 import 陳述式下方。


<code-example path="toh-pt1/src/app/app.component.ts" region="hero-class-1" title="src/app/app.component.ts (Hero class)" linenums="false">

</code-example>



在 `AppComponent` 類別中，把元件的 `hero` 屬性重構為 `Hero` 型別，
然後用 `id` 為 `1`、名稱為 `Windstorm` 來初始化它。


<code-example path="toh-pt1/src/app/app.component.ts" region="hero-property-1" title="src/app/app.component.ts (hero property)" linenums="false">

</code-example>



由於你已把英雄從字串改為物件，
請更新範本中的繫結，改為參照英雄的 `name` 屬性。


<code-example path="toh-pt1/app/app.component.1.ts" region="show-hero-2" title="src/app/app.component.ts">

</code-example>



瀏覽器會重新整理，並繼續顯示英雄的名稱。

### 使用多行範本字串加入 HTML

若要顯示英雄的所有屬性，
請為英雄的 `id` 屬性加一個 `<div>`，再為 `name` 加另一個 `<div>`。
為了讓範本易於閱讀，把每個 `<div>` 放在各自的一行。

元件範本周圍的反引號讓你可以把 `<h1>`、`<h2>` 與 `<div>` 元素放在各自的行上，
這要歸功於 ES2015 與 TypeScript 中的<i>範本字面值</i>功能。如需更多資訊，請參閱
<a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals" target="_blank" title="template literal">Template literals</a>。



<code-example path="toh-pt1/app/app.component.1.ts" region="multi-line-strings" title="app.component.ts (AppComponent's template)" linenums="false">

</code-example>




## 編輯英雄名稱

使用者應該能在 `<input>` 文字方塊中編輯英雄名稱。
文字方塊應該同時_顯示_英雄的 `name` 屬性，
並在使用者輸入時_更新_該屬性。

你需要在 `<input>` 表單元素與 `hero.name` 屬性之間建立雙向繫結。

### 雙向繫結

把範本中的英雄名稱重構成像這樣：

<code-example path="toh-pt1/app/app.component.1.ts" region="name-input" title="src/app/app.component.ts" linenums="false">

</code-example>



`[(ngModel)]` 是 Angular 用來把 `hero.name` 屬性繫結
到文字方塊的語法。
資料會_雙向_流動：從屬性流到文字方塊，
也從文字方塊流回屬性。

很不幸，這個變更之後，應用程式立刻就壞了。
如果你查看瀏覽器主控台，會看到 Angular 抱怨說
「`ngModel` ... 不是 `input` 的已知屬性」。

雖然 `NgModel` 是一個有效的 Angular 指令，但它預設無法使用。
它屬於選用的 `FormsModule`。
你必須主動選擇使用該模組。

### 匯入 _FormsModule_

開啟 `app.module.ts` 檔案，從 `@angular/forms` 函式庫匯入 `FormsModule` 符號。
然後把 `FormsModule` 加入 `@NgModule` 中繼資料的 `imports` 陣列，該陣列包含
應用程式所使用的外部模組清單。

更新後的 `AppModule` 像這樣：

<code-example path="toh-pt1/src/app/app.module.ts" title="app.module.ts (FormsModule import)">

</code-example>



<div class="l-sub-section">



在 [Forms](guide/forms) 指南的
[使用 ngModel 進行雙向資料繫結](guide/forms#ngModel)章節，以及
[Template Syntax](guide/template-syntax) 指南的
[使用 NgModel 進行雙向繫結](guide/template-syntax#ngModel)章節中，
進一步瞭解 `FormsModule` 與 `ngModel`。


</div>



當瀏覽器重新整理後，應用程式應該再次正常運作。
你可以編輯英雄的名稱，並看到變更立即反映在文字方塊上方的 `<h2>` 中。



## 總結

盤點一下你建置了什麼。

* 英雄之旅應用程式使用插值的雙大括號（一種單向資料繫結）
來顯示應用程式標題與 `Hero` 物件的屬性。
* 你使用 ES2015 的範本字面值，撰寫了多行範本，讓範本易於閱讀。
* 你使用內建的 `ngModel` 指令，為 `<input>` 元素加入了雙向資料繫結。
這個繫結既會顯示英雄的名稱，也允許使用者變更它。
* `ngModel` 指令會把變更傳播到 `hero.name` 的其他每個繫結。

你的應用程式看起來應該像這樣 <live-example></live-example>。

以下是目前完整的 `app.component.ts`：


<code-example path="toh-pt1/src/app/app.component.ts" title="src/app/app.component.ts">

</code-example>




## 下一步
在[下一篇教學頁面](tutorial/toh-pt2  "Master/Detail")中，你將在英雄之旅應用程式的基礎上，顯示一份英雄清單。
你也將讓使用者選取英雄並顯示他們的詳細資訊。
你將進一步瞭解如何取得清單，並把它們繫結到範本。
