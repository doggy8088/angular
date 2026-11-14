@title
服務

@intro
建立一個可重用的服務來管理英雄資料呼叫。

@description


隨著 Tour of Heroes 應用程式的發展，你將加入更多需要存取英雄資料的元件。

與其一次又一次複製貼上相同的程式碼，
你將建立一個單一可重用的資料服務，
並把它注入需要它的元件中。
使用獨立的服務能讓元件保持精簡、專注於支援檢視，
也讓以模擬服務對元件進行單元測試變得容易。

因為資料服務無一例外都是非同步的，
你將在本頁最後完成一個以 *Promise* 為基礎的資料服務版本。

完成本頁後，應用程式應該像這樣 <live-example></live-example>。



## 上次的進度
在繼續 Tour of Heroes 之前，請確認你已具備下列結構。
若尚未具備，請回到前面的頁面。


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



## 讓應用程式持續轉譯並執行
在終端機視窗中輸入下列命令：


<code-example language="sh" class="code-shell">
  npm start

</code-example>



此命令會以「watch mode」執行 TypeScript 編譯器，在程式碼變更時自動重新編譯。
此命令同時會在瀏覽器中啟動應用程式，並在程式碼變更時重新整理瀏覽器。

你可以持續建置 Tour of Heroes，無需暫停來重新編譯或重新整理瀏覽器。

## 建立英雄服務
利害關係人希望在不同頁面上以各種方式呈現英雄。
使用者已經可以從清單中選取英雄。
很快地，你將加入一個顯示表現最佳英雄的儀表板，並建立一個獨立檢視來編輯英雄詳細資料。
這三個檢視都需要英雄資料。

目前，`AppComponent` 定義了用於顯示的模擬英雄。
然而，定義英雄並不是該元件的工作，
而且你也不容易把英雄清單分享給其他元件與檢視。
在本頁中，你將把取得英雄資料的工作移至單一服務，由它提供資料，
並把該服務分享給所有需要資料的元件。

### 建立 HeroService
在 `app` 資料夾中建立一個名為 `hero.service.ts` 的檔案。

<div class="l-sub-section">



服務檔案的命名慣例是將服務名稱改為小寫，後面接上 `.service`。
如果是多字的服務名稱，請使用小寫的 [dash-case](guide/glossary#dash-case)。
例如，`SpecialSuperHeroService` 的檔案名稱是 `special-super-hero.service.ts`。

</div>



將類別命名為 `HeroService`，並匯出它供其他人匯入。


<code-example path="toh-pt4/src/app/hero.service.1.ts" region="empty-class" title="src/app/hero.service.ts (starting point)" linenums="false">

</code-example>



### 可注入的服務
請注意，你匯入了 Angular 的 `Injectable` 函式，並將該函式套用為 `@Injectable()` 裝飾器。

<div class="callout is-helpful">



不要忘了括號。省略括號會導致難以診斷的錯誤。

</div>



`@Injectable()` 裝飾器會告訴 TypeScript 發出關於此服務的中繼資料。
該中繼資料指明 Angular 可能需要把其他依賴注入此服務。

雖然 `HeroService` 目前沒有任何依賴，
但從一開始就套用 `@Injectable()` 裝飾器，
能確保一致性並為未來做好準備。


### 取得英雄資料
加入一個 `getHeroes()` 方法存根。


<code-example path="toh-pt4/src/app/hero.service.1.ts" region="getHeroes-stub" title="src/app/hero.service.ts (getHeroes stub)" linenums="false">

</code-example>



`HeroService` 可以從任何地方取得 `Hero` 資料&mdash;Web 服務、本地儲存空間或模擬資料來源。
把資料存取從元件中移除，意味著
你可以隨時改變實作方式，
而不需動到需要英雄資料的元件。

### 搬移模擬英雄資料
從 `app.component.ts` 剪下 `HEROES` 陣列，並貼到 `app` 資料夾中名為 `mock-heroes.ts` 的新檔案。
另外，請複製 `import {Hero} ...` 陳述式，因為英雄陣列使用了 `Hero` 類別。


<code-example path="toh-pt4/src/app/mock-heroes.ts" title="src/app/mock-heroes.ts">

</code-example>



`HEROES` 常數已被匯出，因此可以在其他地方匯入，例如 `HeroService`。

在 `app.component.ts` 中你剪下 `HEROES` 陣列的位置，
加入一個未初始化的 `heroes` 屬性：

<code-example path="toh-pt4/src/app/app.component.1.ts" region="heroes-prop" title="src/app/app.component.ts (heroes property)" linenums="false">

</code-example>



### 回傳模擬的英雄資料
回到 `HeroService`，匯入模擬的 `HEROES`，並從 `getHeroes()` 方法回傳它。
`HeroService` 如下所示：

<code-example path="toh-pt4/src/app/hero.service.1.ts" region="full" title="src/app/hero.service.ts" linenums="false">

</code-example>



### 匯入英雄服務
你已準備好在其他元件中使用 `HeroService`，先從 `AppComponent` 開始。

匯入 `HeroService`，以便在程式碼中參照它。

<code-example path="toh-pt4/src/app/app.component.ts" linenums="false" title="src/app/app.component.ts (hero-service-import)" region="hero-service-import">

</code-example>



### 不要對 *HeroService* 使用 *new*
`AppComponent` 應該如何取得執行階段的具體 `HeroService` 執行個體？

你可以像這樣用 `new` 建立 `HeroService` 的新執行個體：

<code-example path="toh-pt4/src/app/app.component.1.ts" region="new-service" title="src/app/app.component.ts" linenums="false">

</code-example>



然而，這個做法並不理想，原因如下：

* 元件必須知道如何建立 `HeroService`。
如果你變更了 `HeroService` 的建構子，
就必須找出並更新每一個建立該服務的地方。
在多處修補程式碼容易出錯，也會增加測試負擔。
* 你每次使用 `new` 都會建立一個服務。
如果服務快取了英雄並把該快取分享給其他人呢？
你就無法做到這一點。
* 當 `AppComponent` 被鎖定在 `HeroService` 的特定實作上時，
要在不同情境下切換實作，例如離線運作或
使用不同的模擬版本進行測試，就會變得困難。


### 注入 *HeroService*

不要使用 *new* 那一行，你將加入兩行。

 * 加入一個同時定義私有屬性的建構子。
 * 加入元件的 `providers` 中繼資料。

加入建構子：

<code-example path="toh-pt4/src/app/app.component.1.ts" region="ctor" title="src/app/app.component.ts (constructor)">

</code-example>



建構子本身不做任何事。該參數同時
定義了一個私有的 `heroService` 屬性，並將其標示為 `HeroService` 的注入位置。

現在 Angular 知道在建立 `AppComponent` 時，要提供 `HeroService` 的執行個體。


<div class="l-sub-section">



若想進一步了解依賴注入，請參閱[依賴注入](guide/dependency-injection)頁面。

</div>



*注入器*還不知道如何建立 `HeroService`。
如果你現在執行程式碼，Angular 會失敗並出現這個錯誤：

<code-example format="nocode">
  EXCEPTION: No provider for HeroService! (AppComponent -> HeroService)
</code-example>



若要教注入器如何建立 `HeroService`，
請在 `@Component` 呼叫中，把下列 `providers` 陣列屬性加入元件中繼資料的底部。



<code-example path="toh-pt4/src/app/app.component.1.ts" linenums="false" title="src/app/app.component.ts (providers)" region="providers">

</code-example>



`providers` 陣列會告訴 Angular，在建立 `AppComponent` 時建立一個新的 `HeroService` 執行個體。
`AppComponent` 以及其子元件都可以使用該服務來取得英雄資料。

{@a child-component}


### *AppComponent* 中的 *getHeroes()*
該服務位於 `heroService` 私有變數中。

你可以呼叫該服務，並在一行內取得資料。

<code-example path="toh-pt4/src/app/app.component.1.ts" region="get-heroes" title="src/app/app.component.ts" linenums="false">

</code-example>



你其實不需要專門用一個方法來包裝一行程式碼。還是把它寫出來吧：


<code-example path="toh-pt4/src/app/app.component.1.ts" linenums="false" title="src/app/app.component.ts (getHeroes)" region="getHeroes">

</code-example>

{@a oninit}

### *ngOnInit* 生命週期鉤子
`AppComponent` 應該能順利擷取並顯示英雄資料。

 你可能會想在建構子中呼叫 `getHeroes()` 方法，但
建構子不應包含複雜邏輯，
尤其是會呼叫伺服器的建構子，例如資料存取方法。
建構子是用於簡單的初始化，例如把建構子參數繫結到屬性。

若要讓 Angular 呼叫 `getHeroes()`，你可以實作 Angular 的 *ngOnInit 生命週期鉤子*。
Angular 提供了介面，讓你能在元件生命週期的關鍵時刻介入：
建立時、每次變更後，以及最終銷毀時。

每個介面都有單一方法。當元件實作該方法時，Angular 會在適當的時機呼叫它。

<div class="l-sub-section">



若想進一步了解生命週期鉤子，請參閱[生命週期鉤子](guide/lifecycle-hooks)頁面。

</div>



以下是 `OnInit` 介面的基本大綱（不要把它複製到你的程式碼中）：

<code-example path="toh-pt4/src/app/app.component.1.ts" region="on-init" title="src/app/app.component.ts" linenums="false">

</code-example>



把 `OnInit` 介面的實作加入你的匯出陳述式：

<code-example format="nocode">
  export class AppComponent implements OnInit {}
</code-example>



撰寫一個 `ngOnInit` 方法，並把初始化邏輯放在裡面。Angular 會在
正確的時機呼叫它。在這個情況下，透過呼叫 `getHeroes()` 來進行初始化。

<code-example path="toh-pt4/src/app/app.component.1.ts" linenums="false" title="src/app/app.component.ts (ng-on-init)" region="ng-on-init">

</code-example>



應用程式應如預期般執行，當你點選英雄名稱時，
會顯示英雄清單與英雄詳細檢視。
{@a async}

## 非同步服務與 Promise
`HeroService` 會立即回傳一份模擬英雄清單；
它的 `getHeroes()` 簽名是同步的。

<code-example path="toh-pt4/src/app/app.component.1.ts" region="get-heroes" title="src/app/app.component.ts" linenums="false">

</code-example>



最終，英雄資料將來自遠端伺服器。
使用遠端伺服器時，使用者不必等待伺服器回應；
此外，你也無法在等待期間阻擋 UI。


若要讓檢視與回應協調一致，
你可以使用 *Promise*，這是一種非同步
技術，會改變 `getHeroes()` 方法的簽名。

### 英雄服務建立 Promise

*Promise* 本質上是承諾在結果準備好時回呼。
你請非同步服務做一些工作，並給它一個回呼函式。
該服務完成該工作後，最終會以結果或錯誤呼叫該函式。

<div class="l-sub-section">



這是簡化的說明。若想進一步了解 ES2015 Promise，請參閱
[Exploring ES6](http://exploringjs.com/es6.html) 的
[非同步程式設計的 Promise](http://exploringjs.com/es6/ch_promises.html) 頁面。


</div>



以這個回傳 Promise 的 `getHeroes()` 方法更新 `HeroService`：

<code-example path="toh-pt4/src/app/hero.service.ts" region="get-heroes" title="src/app/hero.service.ts (excerpt)" linenums="false">

</code-example>



你仍然在模擬資料。你透過回傳一個以模擬英雄為結果的*立即解析的 Promise*，
來模擬超快速、零延遲伺服器的行為。

### 處理 Promise

由於 `HeroService` 的變更，`this.heroes` 現在被設為 `Promise`，而不是英雄陣列。

<code-example path="toh-pt4/src/app/app.component.1.ts" region="getHeroes" title="src/app/app.component.ts (getHeroes - old)" linenums="false">

</code-example>



你必須變更實作，以便在 `Promise` 解析時*對它採取行動*。
當 `Promise` 成功解析時，你就會有英雄可以顯示。

把回呼函式作為引數傳給 Promise 的 `then()` 方法：

<code-example path="toh-pt4/src/app/app.component.ts" region="get-heroes" title="src/app/app.component.ts (getHeroes - revised)" linenums="false">

</code-example>



<div class="l-sub-section">



如 [Arrow functions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions) 所述，
回呼中的 ES2015 箭頭函式
比等效的函式運算式更簡潔，也能優雅地處理 `this`。

</div>



回呼會把元件的 `heroes` 屬性設為服務回傳的英雄陣列。

應用程式仍在執行，顯示英雄清單，並
在選取名稱時以詳細檢視回應。

<div class="l-sub-section">



在本頁結尾，[附錄：放慢速度](tutorial/toh-pt4#slow) 說明了在連線不佳時應用程式可能會是什麼樣子。

</div>



## 檢閱應用程式結構
請確認在完成所有重構後，你具備下列結構：


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

        <div class='file'>
          hero.service.ts
        </div>

        <div class='file'>
          mock-heroes.ts
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

  <code-pane title="src/app/hero.service.ts" path="toh-pt4/src/app/hero.service.ts">

  </code-pane>

  <code-pane title="src/app/app.component.ts" path="toh-pt4/src/app/app.component.ts">

  </code-pane>

  <code-pane title="src/app/mock-heroes.ts" path="toh-pt4/src/app/mock-heroes.ts">

  </code-pane>

</code-tabs>



## 摘要
以下是你在本頁中完成的內容：

* 你建立了一個可供許多元件共享的服務類別。
* 你使用 `ngOnInit` 生命週期鉤子，在 `AppComponent` 啟用時取得英雄資料。
* 你把 `HeroService` 定義為 `AppComponent` 的提供者。
* 你建立了模擬英雄資料，並把它們匯入服務。
* 你把服務設計成回傳 Promise，並讓元件從 Promise 取得資料。

你的應用程式應該像這樣 <live-example></live-example>。

## 下一步
Tour of Heroes 透過使用共享元件與服務，變得更可重用。
下一個目標是建立儀表板、加入在檢視之間路由的選單連結，並在範本中格式化資料。
隨著應用程式的發展，你將探索如何設計它，使其更容易成長與維護。

若想了解 Angular 元件路由器以及檢視之間的導覽，請參閱[下一個教學](tutorial/toh-pt5 "Routing and Navigation")頁面。

{@a slow}

## 附錄：放慢速度
若要模擬緩慢的連線，
請匯入 `Hero` 符號，並把下列 `getHeroesSlowly()` 方法加入 `HeroService`。

<code-example path="toh-pt4/src/app/hero.service.ts" region="get-heroes-slowly" title="app/hero.service.ts (getHeroesSlowly)" linenums="false">

</code-example>



與 `getHeroes()` 一樣，它也會回傳 `Promise`。
但這個 Promise 會等待兩秒，才以模擬英雄解析該 Promise。

回到 `AppComponent`，把 `getHeroes()` 換成 `getHeroesSlowly()`，
並看看應用程式的行為如何。
