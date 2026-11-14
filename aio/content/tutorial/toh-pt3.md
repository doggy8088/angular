@title
多個元件

@intro
將主／從檢視重構為獨立的元件。

@description


目前 `AppComponent` 正在做_所有_事情。
起初，它顯示單一英雄的詳細資料。
接著它變成主／從表單，同時有英雄清單與英雄詳細資料。
很快就會有新的需求與功能。
你不能在一個元件裡不斷堆疊功能再堆疊功能，那樣無法維護。

你需要把它拆成子元件，每個子元件專注於特定的任務或工作流程。
最終，`AppComponent` 可以成為一個簡單的殼層，用來承載這些子元件。

在本頁中，你將朝這個方向踏出第一步，把英雄詳細資料切分出來，成為一個獨立、可重複使用的元件。
完成後，應用程式應該像這樣 <live-example></live-example>。



## 上次停下的地方
開始本頁之前，請確認你已具備先前 Tour of Heroes 的以下結構。
若沒有，請回到先前的頁面。


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



在終端機視窗中輸入 `npm start` 命令，
[如同先前所做](tutorial/toh-pt1#keep-transpiling "Keep the app running")，
讓應用程式在你建置 Tour of Heroes 的同時持續轉譯並執行。

## 建立英雄詳細元件
在 `app/` 資料夾中新增一個名為 `hero-detail.component.ts` 的檔案。
這個檔案將存放新的 `HeroDetailComponent`。

檔案與元件名稱遵循 Angular
[風格指南](guide/styleguide#命名)中所述的標準。

* 元件_類別_名稱應以_大寫駝峰式_撰寫，並以 "Component" 一詞結尾。
英雄詳細元件類別是 `HeroDetailComponent`。

* 元件_檔案_名稱應以[_小寫短橫線式_](guide/glossary#dash-case)拼寫，
每個單字以短橫線分隔，並以 `.component.ts` 結尾。
`HeroDetailComponent` 類別放在 `hero-detail.component.ts` 檔案中。

開始如下撰寫 `HeroDetailComponent`：


<code-example path="toh-pt3/app/hero-detail.component.1.ts" region="v1" title="app/hero-detail.component.ts (initial version)" linenums="false">

</code-example>



{@a selector}


要定義元件，你一律要匯入 `Component` 符號。

`@Component` 裝飾器提供該元件的 Angular 中繼資料。
CSS 選取器名稱 `hero-detail` 會對應到元素標籤，
該標籤會在父元件的範本中識別這個元件。
[在本教學頁面接近結尾處](tutorial/toh-pt3#add-hero-detail "Add the HeroDetailComponent to the AppComponent")，
你將把一個 `<hero-detail>` 元素加入 `AppComponent` 範本。

一律要 `export` 元件類別，因為你一律會在其他地方 `import` 它。

### 英雄詳細範本
要把英雄詳細檢視移到 `HeroDetailComponent`，
請從 `AppComponent` 範本底部剪下英雄詳細_內容_，
並把它貼到 `@Component` 中繼資料中新的 `template` 屬性裡。

`HeroDetailComponent` 擁有的是_英雄_，而不是_所選英雄_。
請在範本中把所有 "selectedHero" 一詞取代為 "hero" 一詞。
完成後，新的範本應該像這樣：


<code-example path="toh-pt3/src/app/hero-detail.component.ts" region="template" title="src/app/hero-detail.component.ts (template)" linenums="false">

</code-example>



### 加入 *hero* 屬性

`HeroDetailComponent` 範本會繫結到元件的 `hero` 屬性。
像這樣把該屬性加入 `HeroDetailComponent` 類別：

<code-example path="toh-pt3/app/hero-detail.component.1.ts" region="hero" title="src/app/hero-detail.component.ts (hero property)">

</code-example>



`hero` 屬性的型別是 `Hero` 的實例。
`Hero` 類別仍在 `app.component.ts` 檔案中。
現在有兩個元件需要參照 `Hero` 類別。
Angular [風格指南](guide/styleguide#單一規則 "Style guide: rule of one")本來就建議每個檔案只放一個類別。

把 `Hero` 類別從 `app.component.ts` 移到它自己的 `hero.ts` 檔案。


<code-example path="toh-pt3/src/app/hero.ts" title="src/app/hero.ts" linenums="false">

</code-example>



現在 `Hero` 類別已在它自己的檔案中，`AppComponent` 與 `HeroDetailComponent` 都必須匯入它。
在 `app.component.ts` 與 `hero-detail.component.ts` 這_兩個_檔案的靠近上方處，加入以下 `import` 陳述式。

<code-example path="toh-pt3/app/hero-detail.component.1.ts" region="hero-import" title="src/app/hero-detail.component.ts">

</code-example>



### *hero* 屬性是 *input* 屬性

[在本頁後面](tutorial/toh-pt3#add-hero-detail "Add the HeroDetailComponent to the AppComponent")，
父元件 `AppComponent` 將告訴子元件 `HeroDetailComponent` 要顯示哪位英雄，
做法是把它的 `selectedHero` 繫結到 `HeroDetailComponent` 的 `hero` 屬性。
繫結會像這樣：

<code-example path="toh-pt3/app/app.component.1.html" region="hero-detail-binding" title="src/app/app.component.html" linenums="false">

</code-example>



在 `hero` 屬性周圍加上方括號，放在等號（=）左邊，
會讓它成為屬性繫結運算式的*目標*。
你必須宣告*目標*繫結屬性為 *input* 屬性。
否則，Angular 會拒絕該繫結並拋出錯誤。

首先，修改 `@angular/core` 匯入陳述式，加入 `Input` 符號。

<code-example path="toh-pt3/src/app/hero-detail.component.ts" region="import-input" title="src/app/hero-detail.component.ts (excerpt)" linenums="false">

</code-example>



接著宣告 `hero` 是 *input* 屬性，
做法是在它前面加上你先前匯入的 `@Input` 裝飾器。

<code-example path="toh-pt3/src/app/hero-detail.component.ts" region="hero" title="src/app/hero-detail.component.ts (excerpt)" linenums="false">

</code-example>



<div class="l-sub-section">



在
[屬性指令](guide/attribute-directives#why-input)頁面中進一步了解 _input_ 屬性。


</div>



就是這樣。`hero` 屬性是 `HeroDetailComponent` 類別中唯一的東西。

<code-example path="toh-pt3/src/app/hero-detail.component.ts" region="class" title="src/src/app/hero-detail.component.ts" linenums="false">

</code-example>



它所做的只是透過 `hero` input 屬性接收一個英雄物件，然後以範本繫結到該屬性。

以下是完整的 `HeroDetailComponent`。

<code-example path="toh-pt3/src/app/hero-detail.component.ts" title="src/app/hero-detail.component.ts">

</code-example>




## 在 _AppModule_ 中宣告 _HeroDetailComponent_
每個元件都必須在一個&mdash;且只能在一個&mdash;NgModule 中宣告。

在編輯器中開啟 `app.module.ts`，匯入 `HeroDetailComponent`，以便你能參照它。

<code-example path="toh-pt3/src/app/app.module.ts" region="hero-detail-import" title="src/app/app.module.ts">

</code-example>



把 `HeroDetailComponent` 加入模組的 `declarations` 陣列。


<code-example path="toh-pt3/src/app/app.module.ts" region="declarations" title="src/app/app.module.ts" linenums="false">

</code-example>



一般來說，`declarations` 陣列包含屬於該模組的應用程式元件、管道與指令清單。
元件必須先在模組中宣告，其他元件才能參照它。
這個模組只宣告了兩個應用程式元件，`AppComponent` 與 `HeroDetailComponent`。

<div class="l-sub-section">



在 [NgModules](guide/ngmodule "NgModules") 指南中進一步了解 NgModule。


</div>



{@a add-hero-detail}



## 把 _HeroDetailComponent_ 加入 _AppComponent_

`AppComponent` 仍然是主／從檢視。
在你切出範本的那部分之前，它原本會自行顯示英雄詳細資料。
現在它會委派給 `HeroDetailComponent`。


回想一下，`hero-detail` 是 `HeroDetailComponent` 中繼資料中的
CSS [`selector`](tutorial/toh-pt3#selector "HeroDetailComponent selector")。
那是代表 `HeroDetailComponent` 的元素標籤名稱。

在 `AppComponent` 範本底部附近、英雄詳細檢視原本所在的位置，加入一個 `<hero-detail>` 元素。

把 `AppComponent` 的 `selectedHero` 屬性
繫結到 `HeroDetailComponent` 的 `hero` 屬性，
以此協調主元件 `AppComponent` 與 `HeroDetailComponent`。

<code-example path="toh-pt3/app/app.component.1.html" region="hero-detail-binding" title="app.component.ts (excerpt)" linenums="false">

</code-example>



現在每當 `selectedHero` 變更時，`HeroDetailComponent` 就會收到一位新的英雄來顯示。

修改後的 `AppComponent` 範本應該像這樣：


<code-example path="toh-pt3/src/app/app.component.ts" region="hero-detail-template" title="app.component.ts (excerpt)" linenums="false">

</code-example>




## 變更了什麼？
如同[先前](tutorial/toh-pt2)所述，每當使用者點選英雄名稱時，
英雄詳細資料就會出現在英雄清單下方。
但現在是由 `HeroDetailView` 呈現那些詳細資料。

把原本的 `AppComponent` 重構成兩個元件，無論現在或未來都有好處：

1. 你透過減少 `AppComponent` 的職責，讓它變得更簡單。

1. 你可以把 `HeroDetailComponent` 演進為功能豐富的英雄編輯器，
而不需動到父元件 `AppComponent`。

1. 你可以演進 `AppComponent`，而不需動到英雄詳細檢視。

1. 你可以在未來某個父元件的範本中重複使用 `HeroDetailComponent`。

### 檢閱應用程式結構
請確認你已具備以下結構：


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

        <div class='file'>
          hero.ts
        </div>

        <div class='file'>
          hero-detail.component.ts
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



以下是本頁討論過的程式碼檔案。


<code-tabs>

  <code-pane title="src/app/hero-detail.component.ts" path="toh-pt3/src/app/hero-detail.component.ts">

  </code-pane>

  <code-pane title="src/app/app.component.ts" path="toh-pt3/src/app/app.component.ts">

  </code-pane>

  <code-pane title="src/app/hero.ts" path="toh-pt3/src/app/hero.ts">

  </code-pane>

  <code-pane title="src/app/app.module.ts" path="toh-pt3/src/app/app.module.ts">

  </code-pane>

</code-tabs>




## 摘要

以下是你在本頁中達成的成果：

* 你建立了一個可重複使用的元件。
* 你學會了如何讓元件接受 input。
* 你學會了在 NgModule 中宣告所需的應用程式指令。你
在 `@NgModule` 裝飾器的 `declarations` 陣列中列出了這些指令。
* 你學會了把父元件繫結到子元件。

你的應用程式應該像這樣 <live-example></live-example>。



## 下一步
Tour of Heroes 應用程式有了共用元件後變得更可重複使用，
但它的（模擬）資料仍硬式編碼在 `AppComponent` 內。
那樣無法持續下去。
資料存取應重構為獨立的服務，
並在需要資料的元件之間共用。

你將在[下一個教學](tutorial/toh-pt4 "Services")頁面中學習建立服務。
