# 從 AngularJS 到 Angular 的概念：快速參考


{@a top}


_Angular_ 是今日與未來 Angular 的名稱。
_AngularJS_ 是所有 v1.x 版本 Angular 的名稱。

本指南透過將 AngularJS 語法對應到等價的 Angular 語法，協助你從 AngularJS 轉換到 Angular。


**請在本 <live-example name="ajs-quick-reference"></live-example> 中查看 Angular 語法**。

## 範本基礎
範本是 Angular 應用程式面向使用者的部分，以 HTML 撰寫。
下表列出一些關鍵的 AngularJS 範本功能，以及它們等價的 Angular 範本語法。


<table width="100%">

  <col width="50%">

  </col>

  <col width="50%">

  </col>

  <tr>

    <th>
      AngularJS
    </th>

    <th>
      Angular
    </th>

  </tr>

  <tr style=top>

    <td>


      ### 繫結／插值

      <code-example hideCopy>
        Your favorite hero is: {{vm.favoriteHero}}
      </code-example>


      在 AngularJS 中，大括號中的運算式表示單向繫結。
      這會把元素的值繫結到與此範本關聯的控制器中的某個屬性。

      使用 `controller as` 語法時，
      繫結會加上控制器別名（`vm` 或 `$ctrl`）作為前綴，因為你
      必須明確指出繫結的來源。
    </td>

    <td>


      ### 繫結／插值

      <code-example hideCopy path="ajs-quick-reference/src/app/movie-list.component.html" region="interpolation"></code-example>


      在 Angular 中，大括號中的範本運算式仍然表示單向繫結。
      這會把元素的值繫結到元件的某個屬性。
      繫結的上下文是隱含的，且永遠是
      關聯的元件，因此不需要參照變數。

      更多資訊，請參閱[範本語法](guide/template-syntax)頁面中的[插值](guide/template-syntax#interpolation)一節。
    </td>

  </tr>

  <tr style=top>

    <td>


      ### 篩選器

      <code-example hideCopy>
        &lt;td>{{movie.title | uppercase}}&lt;/td>
      </code-example>


      若要在 AngularJS 範本中篩選輸出，請使用管道字元（|）與一個或多個篩選器。

      此範例將 `title` 屬性篩選為大寫。
    </td>

    <td>


      ### 管道

      <code-example hideCopy path="ajs-quick-reference/src/app/app.component.html" region="uppercase"></code-example>


      在 Angular 中，你使用類似的語法搭配管道（|）字元來篩選輸出，但現在它們稱為 **pipes**（管道）。
      AngularJS 的許多（但不是全部）內建篩選器，
      在 Angular 中是內建管道。

      更多資訊，請參閱下方的[篩選器／管道](guide/ajs-quick-reference#filters-pipes)。
    </td>

  </tr>

  <tr style=top>

    <td>


      ### 區域變數

      <code-example hideCopy format="">
        &lt;tr ng-repeat="movie in vm.movies">
          &lt;td>{{movie.title}}&lt;/td>
        &lt;/tr>
      </code-example>


      在這裡，`movie` 是一個使用者定義的區域變數。
    </td>

    <td>


      ### 輸入變數

      <code-example hideCopy path="ajs-quick-reference/src/app/app.component.html" region="local"></code-example>


      Angular 有真正的範本輸入變數，使用 `let` 關鍵字明確定義。

      更多資訊，請參閱[範本語法](guide/template-syntax)頁面中的 [ngFor micro-syntax](guide/template-syntax#microsyntax) 一節。
    </td>

  </tr>

</table>


## 範本指令
AngularJS 為範本提供了七十多個內建指令。
其中許多在 Angular 中不需要，因為 Angular 的繫結系統功能更強、表現力更好。
以下列出一些關鍵的 AngularJS 內建指令，以及它們在 Angular 中的對應物。


<table width="100%">

  <col width="50%">

  </col>

  <col width="50%">

  </col>

  <tr>

    <th>
      AngularJS
    </th>

    <th>
      Angular
    </th>

  </tr>

  <tr style=top>

    <td>


      ### ng-app

      <code-example hideCopy>
        &lt;body ng-app="movieHunter">
      </code-example>


      應用程式的啟動過程稱為**啟動（bootstrapping）**。

      雖然你可以在程式碼中啟動 AngularJS 應用程式，
      許多應用程式以宣告方式使用 `ng-app` 指令來啟動，
      並給它應用程式模組的名稱（`movieHunter`）。
    </td>

    <td>


      ### 啟動

      <code-example hideCopy path="ajs-quick-reference/src/main.ts" header="main.ts"></code-example>
      <br>

      <code-example hideCopy path="ajs-quick-reference/src/app/app.module.1.ts" header="app.module.ts"></code-example>


      Angular 沒有啟動指令。
      若要在程式碼中啟動應用程式，請明確啟動應用程式的根模組（`AppModule`）
      （在 `main.ts` 中）
      以及應用程式的根元件（`AppComponent`）（在 `app.module.ts` 中）。
    </td>

  </tr>

  <tr style=top>

    <td>


      ### ng-class

      <code-example hideCopy format="">
        &lt;div ng-class="{active: isActive}">
        &lt;div ng-class="{active: isActive,
                           shazam: isImportant}">
      </code-example>


      在 AngularJS 中，`ng-class` 指令根據運算式加入／排除 CSS 類別。
      該運算式通常是一個鍵值控制物件，物件的每個
      鍵定義為 CSS 類別名稱，每個值定義為範本運算式，
      其求值為布林值。

      在第一個範例中，若 `isActive` 為 true，`active` 類別會套用到元素上。

      你可以指定多個類別，如第二個範例所示。
    </td>

    <td>


      ### ngClass

      <code-example hideCopy path="ajs-quick-reference/src/app/app.component.html" region="ngClass"></code-example>


      在 Angular 中，`ngClass` 指令的運作方式類似。
      它根據運算式加入／排除 CSS 類別。

      在第一個範例中，若 `isActive` 為 true，`active` 類別會套用到元素上。

      你可以指定多個類別，如第二個範例所示。

      Angular 也有**類別繫結**，是加入或移除單一類別的好方法，
      如第三個範例所示。

      更多資訊請參閱[範本語法](guide/template-syntax)頁面中的[屬性、類別與樣式繫結](guide/template-syntax#other-bindings)一節。

    </td>

  </tr>

  <tr style=top>

    <td>


      ### ng-click

      <code-example hideCopy format="">
        &lt;button ng-click="vm.toggleImage()">
        &lt;button ng-click="vm.toggleImage($event)">
      </code-example>


      在 AngularJS 中，`ng-click` 指令讓你能指定元素被點選時的自訂行為。

      在第一個範例中，當使用者點選按鈕時，會執行由 `vm` 這個 `controller as` 別名所參照的控制器中的 `toggleImage()` 方法。

      第二個範例示範傳入 `$event` 物件，它向控制器提供事件的詳細資訊。
    </td>

    <td>


      ### 繫結到 `click` 事件

      <code-example hideCopy path="ajs-quick-reference/src/app/app.component.html" region="event-binding"></code-example>


      AngularJS 中以事件為基礎的指令在 Angular 中不存在。
      請改用**事件繫結**，定義從範本檢視到元件的單向繫結。

      使用事件繫結時，在括號內定義目標事件的名稱，並
      在等號右側以引號指定範本陳述式。Angular 接著會
      為目標事件設定事件處理常式。當事件被觸發時，處理常式
      會執行該範本陳述式。

      在第一個範例中，當使用者點選按鈕時，會執行關聯元件中的 `toggleImage()` 方法。

      第二個範例示範傳入 `$event` 物件，它向元件提供事件的詳細資訊。

      DOM 事件清單請參閱：https://developer.mozilla.org/en-US/docs/Web/Events。

      更多資訊請參閱[範本語法](guide/template-syntax)頁面中的[事件繫結](guide/template-syntax#event-binding)一節。

    </td>

  </tr>

  <tr style=top>

    <td>


      ### ng-controller

      <code-example hideCopy format="">
        &lt;div ng-controller="MovieListCtrl as vm">
      </code-example>


      在 AngularJS 中，`ng-controller` 指令將控制器附加到檢視上。
      使用 `ng-controller`（或將控制器定義為路由的一部分），會把
      檢視與和該檢視關聯的控制器程式碼綁在一起。
    </td>

    <td>


      ### 元件裝飾器

      <code-example hideCopy path="ajs-quick-reference/src/app/movie-list.component.ts" region="component"></code-example>


      在 Angular 中，範本不再指定其關聯的控制器。
      改由元件在其元件類別裝飾器中指定其關聯的範本。

      更多資訊請參閱[架構總覽](guide/architecture#元件)。

    </td>

  </tr>

  <tr style=top>

    <td>


      ### ng-hide
      在 AngularJS 中，`ng-hide` 指令根據運算式顯示或隱藏關聯的 HTML 元素。更多資訊請參閱 [ng-show](guide/ajs-quick-reference#ng-show)。
    </td>

    <td>


      ### 繫結到 `hidden` 屬性
      在 Angular 中，你使用屬性繫結；沒有內建的 *hide* 指令。更多資訊請參閱 [ng-show](guide/ajs-quick-reference#ng-show)。
    </td>

  </tr>

  <tr style=top>

    <td>


      ### ng-href

      <code-example hideCopy format="">
        &lt;a ng-href="{{ angularDocsUrl }}">Angular Docs&lt;/a>
      </code-example>


      `ng-href` 指令讓 AngularJS 預先處理 `href` 屬性，以便
      在瀏覽器向該 URL 抓取之前，把繫結運算式替換為適當的 URL。

      在 AngularJS 中，`ng-href` 常用於在導覽時啟用某條路由。

      <code-example hideCopy format="">
        &lt;a ng-href="#{{ moviesHash }}">Movies&lt;/a>
      </code-example>


      路由在 Angular 中的處理方式不同。
    </td>

    <td>


      ### 繫結到 `href` 屬性

      <code-example hideCopy path="ajs-quick-reference/src/app/app.component.html" region="href"></code-example>


      Angular 使用屬性繫結；沒有內建的 *href* 指令。
      將元素的 `href` 屬性放在方括號中，並將其設為以引號包住的範本運算式。

      更多資訊請參閱[範本語法](guide/template-syntax)頁面中的[屬性繫結](guide/template-syntax#property-binding)一節。

      在 Angular 中，`href` 不再用於路由。路由使用 `routerLink`，如下列範例所示。

      <code-example hideCopy path="ajs-quick-reference/src/app/app.component.html" region="router-link"></code-example>


      更多關於路由的資訊，請參閱[路由與導覽](guide/router)頁面中的[定義基本路由](guide/router#basic-route)。

    </td>

  </tr>

  <tr style=top>

    <td>


      ### ng-if

      <code-example hideCopy format="">
        &lt;table ng-if="movies.length">
      </code-example>


      在 AngularJS 中，`ng-if` 指令根據運算式移除或重建 DOM 的一部分。若運算式為 false，元素會從 DOM 中移除。

      在此範例中，除非 `movies` 陣列的長度大於零，否則 `<table>` 元素會從 DOM 中移除。
    </td>

    <td>


      ### *ngIf

      <code-example hideCopy path="ajs-quick-reference/src/app/movie-list.component.html" region="ngIf"></code-example>


      Angular 中的 `*ngIf` 指令與 AngularJS 中的 `ng-if` 指令運作方式相同。它根據運算式移除或重建 DOM 的一部分。

      在此範例中，除非 `movies` 陣列有長度，否則 `<table>` 元素會從 DOM 中移除。

      在此範例中，`ngIf` 前面的（*）是必要的。更多資訊請參閱[結構指令](guide/structural-directives)。
    </td>

  </tr>

  <tr style=top>

    <td>


      ### ng-model

      <code-example hideCopy format="">
        &lt;input ng-model="vm.favoriteHero"/>
      </code-example>


      在 AngularJS 中，`ng-model` 指令將表單控制項繫結到與範本關聯的控制器中的屬性。
      這提供**雙向繫結**：檢視中值的任何變更都會與模型同步，模型的任何變更也會與檢視中的值同步。
    </td>

    <td>


      ### ngModel

      <code-example hideCopy path="ajs-quick-reference/src/app/movie-list.component.html" region="ngModel"></code-example>


      在 Angular 中，**雙向繫結**以 `[()]` 表示，形象地稱為「盒子裡的香蕉」。此語法是同時定義屬性繫結（從元件到檢視）與事件繫結（從檢視到元件）的捷徑，從而提供雙向繫結。

      更多關於使用 `ngModel` 進行雙向繫結的資訊，請參閱[範本語法](guide/template-syntax)頁面中的 [NgModel&mdash;使用 `[(ngModel)]` 對表單元素進行雙向繫結](../guide/template-syntax.html#ngModel) 一節。
    </td>

  </tr>

  <tr style=top>

    <td>


      ### ng-repeat

      <code-example hideCopy format="">
        &lt;tr ng-repeat="movie in vm.movies">
      </code-example>


      在 AngularJS 中，`ng-repeat` 指令會為指定集合中的每個項目重複關聯的 DOM 元素。

      在此範例中，表格列（`<tr>`）元素會為電影集合中的每個電影物件重複。
    </td>

    <td>


      ### *ngFor

      <code-example hideCopy path="ajs-quick-reference/src/app/movie-list.component.html" region="ngFor"></code-example>


      Angular 中的 `*ngFor` 指令與 AngularJS 中的 `ng-repeat` 指令類似。它會為指定集合中的每個項目重複關聯的 DOM 元素。
      更準確地說，它把定義的元素（此範例中的 `<tr>`）及其內容變成一個範本，並使用該範本為清單中的每個項目實例化一個檢視。

      請注意其他語法差異：
      `ngFor` 前面的（*）是必要的；
      `let` 關鍵字將 `movie` 標識為輸入變數；
      清單的介系詞是 `of`，不是 `in`。

      更多資訊請參閱[結構指令](guide/structural-directives)。
    </td>

  </tr>

  <tr style=top>

    <td>


      ### ng-show

      <code-example hideCopy format="">
        &lt;h3 ng-show="vm.favoriteHero">
          Your favorite hero is: {{vm.favoriteHero}}
        &lt;/h3>
      </code-example>


      在 AngularJS 中，`ng-show` 指令根據運算式顯示或隱藏關聯的 DOM 元素。

      在此範例中，若 `favoriteHero` 變數為 truthy，`<div>` 元素會顯示。
    </td>

    <td>


      ### 繫結到 `hidden` 屬性

      <code-example hideCopy path="ajs-quick-reference/src/app/movie-list.component.html" region="hidden"></code-example>


      Angular 使用屬性繫結；沒有內建的 *show* 指令。
      若要隱藏與顯示元素，請繫結到 HTML 的 `hidden` 屬性。

      若要有條件地顯示元素，請將元素的 `hidden` 屬性放在方括號中，並將其設為以引號包住、且求值為 *show* 的*相反*結果的範本運算式。

      在此範例中，若 `favoriteHero` 變數不為 truthy，`<div>` 元素會隱藏。

      更多關於屬性繫結的資訊，請參閱[範本語法](guide/template-syntax)頁面中的[屬性繫結](guide/template-syntax#property-binding)一節。
    </td>

  </tr>

  <tr style=top>

    <td>


      ### ng-src

      <code-example hideCopy format="">
        &lt;img ng-src="{{movie.imageurl}}">
      </code-example>


      `ng-src` 指令讓 AngularJS 預先處理 `src` 屬性，以便在瀏覽器向該 URL 抓取之前，把繫結運算式替換為適當的 URL。
    </td>

    <td>


      ### 繫結到 `src` 屬性

      <code-example hideCopy path="ajs-quick-reference/src/app/app.component.html" region="src"></code-example>


      Angular 使用屬性繫結；沒有內建的 *src* 指令。
      將 `src` 屬性放在方括號中，並將其設為以引號包住的範本運算式。

      更多關於屬性繫結的資訊，請參閱[範本語法](guide/template-syntax)頁面中的[屬性繫結](guide/template-syntax#property-binding)一節。
    </td>

  </tr>

  <tr style=top>

    <td>


      ### ng-style

      <code-example hideCopy format="">
        &lt;div ng-style="{color: colorPreference}">
      </code-example>


      在 AngularJS 中，`ng-style` 指令根據運算式在 HTML 元素上設定 CSS 樣式。該運算式通常是一個鍵值控制物件，物件的每個鍵定義為 CSS 屬性，每個值定義為求值為適合該樣式之值的運算式。

      在此範例中，`color` 樣式被設為 `colorPreference` 變數的目前值。
    </td>

    <td>


      ### ngStyle

      <code-example hideCopy path="ajs-quick-reference/src/app/app.component.html" region="ngStyle"></code-example>


      在 Angular 中，`ngStyle` 指令的運作方式類似。它根據運算式在 HTML 元素上設定 CSS 樣式。

      在第一個範例中，`color` 樣式被設為 `colorPreference` 變數的目前值。

      Angular 也有**樣式繫結**，是設定單一樣式的好方法。如第二個範例所示。

      更多關於樣式繫結的資訊，請參閱[範本語法](guide/template-syntax)頁面中的[樣式繫結](guide/template-syntax#樣式繫結)一節。

      更多關於 `ngStyle` 指令的資訊，請參閱[範本語法](guide/template-syntax)頁面中的 [NgStyle](guide/template-syntax#ngStyle) 一節。
    </td>

  </tr>

  <tr style=top>

    <td>


      ### ng-switch

      <code-example hideCopy format="">
        &lt;div ng-switch="vm.favoriteHero &&
                        vm.checkMovieHero(vm.favoriteHero)">
            &lt;div ng-switch-when="true">
              Excellent choice!
            &lt;/div>
            &lt;div ng-switch-when="false">
              No movie, sorry!
            &lt;/div>
            &lt;div ng-switch-default>
              Please enter your favorite hero.
            &lt;/div>
        &lt;/div>
      </code-example>


      在 AngularJS 中，`ng-switch` 指令根據運算式的目前值，從多個範本中選出一個，來置換元素的內容。

      在此範例中，若未設定 `favoriteHero`，範本會顯示 "Please enter ..."。
      若已設定 `favoriteHero`，它會呼叫控制器方法來檢查電影英雄。
      若該方法傳回 `true`，範本會顯示 "Excellent choice!"。
      若該方法傳回 `false`，範本會顯示 "No movie, sorry!"。
    </td>

    <td>


      ### ngSwitch

      <code-example hideCopy path="ajs-quick-reference/src/app/movie-list.component.html" region="ngSwitch"></code-example>


      在 Angular 中，`ngSwitch` 指令的運作方式類似。
      它會顯示其 `*ngSwitchCase` 與目前 `ngSwitch` 運算式值相符的元素。

      在此範例中，若未設定 `favoriteHero`，`ngSwitch` 的值為 `null`，`*ngSwitchDefault` 會顯示 "Please enter ..."。
      若已設定 `favoriteHero`，應用程式會呼叫元件方法來檢查電影英雄。
      若該方法傳回 `true`，應用程式會選取 `*ngSwitchCase="true"` 並顯示："Excellent choice!"
      若該方法傳回 `false`，應用程式會選取 `*ngSwitchCase="false"` 並顯示："No movie, sorry!"

      在此範例中，`ngSwitchCase` 與 `ngSwitchDefault` 前面的（*）是必要的。

      更多資訊請參閱[範本語法](guide/template-syntax)頁面中的 [NgSwitch 指令](guide/template-syntax#ngSwitch) 一節。
    </td>

  </tr>

</table>


{@a filters-pipes}



## 篩選器／管道
Angular **pipes**（管道）為範本中的資料提供格式化與轉換，類似 AngularJS 的 **filters**（篩選器）。
AngularJS 的許多內建篩選器在 Angular 中都有對應的管道。
更多關於管道的資訊，請參閱[管道](guide/pipes)。


<table width="100%">

  <col width="50%">

  </col>

  <col width="50%">

  </col>

  <tr>

    <th>
      AngularJS
    </th>

    <th>
      Angular
    </th>

  </tr>

  <tr style=top>

    <td>


      ### currency

      <code-example hideCopy>
        &lt;td>{{movie.price | currency}}&lt;/td>
      </code-example>


      將數字格式化為貨幣。
    </td>

    <td>


      ### currency

      <code-example hideCopy path="ajs-quick-reference/src/app/app.component.html" region="currency"></code-example>


      Angular 的 `currency` 管道類似，不過有些參數已經改變。
    </td>

  </tr>

  <tr style=top>

    <td>


      ### date

      <code-example hideCopy>
        &lt;td>{{movie.releaseDate | date}}&lt;/td>
      </code-example>


      根據要求的格式，將日期格式化為字串。
    </td>

    <td>


      ### date

      <code-example hideCopy path="ajs-quick-reference/src/app/app.component.html" region="date"></code-example>


      Angular 的 `date` 管道類似。

    </td>

  </tr>

  <tr style=top>

    <td>


      ### filter

      <code-example hideCopy>
        &lt;tr ng-repeat="movie in movieList | filter: {title:listFilter}">
      </code-example>


      根據篩選條件，從定義的集合中選出項目的子集。
    </td>

    <td>


      ### 無
      基於效能考量，Angular 中沒有可比擬的管道。請在元件中完成所有篩選。若你需要在多個範本中使用相同的篩選程式碼，可以考慮建立自訂管道。

    </td>

  </tr>

  <tr style=top>

    <td>


      ### json

      <code-example hideCopy>
        &lt;pre>{{movie | json}}&lt;/pre>
      </code-example>


      將 JavaScript 物件轉換為 JSON 字串。這對除錯很有用。
    </td>

    <td>


      ### json

      <code-example hideCopy path="ajs-quick-reference/src/app/app.component.html" region="json"></code-example>


      Angular 的 `json` 管道做的是同樣的事。
    </td>

  </tr>

  <tr style=top>

    <td>


      ### limitTo

      <code-example hideCopy>
        &lt;tr ng-repeat="movie in movieList | limitTo:2:0">
      </code-example>


      從集合中選取最多第一個參數（2）指定的項目數量，
      （可選擇）從起始索引（0）開始。
    </td>

    <td>


      ### slice

      <code-example hideCopy path="ajs-quick-reference/src/app/app.component.html" region="slice"></code-example>


      `SlicePipe` 做的是同樣的事，不過*參數的順序相反*，與
      JavaScript 的 `Slice` 方法一致。
      第一個參數是起始索引；第二個是上限。
      與 AngularJS 一樣，改在元件中撰寫這個操作可能可以改善效能。
    </td>

  </tr>

  <tr style=top>

    <td>


      ### lowercase

      <code-example hideCopy>
        &lt;td>{{movie.title | lowercase}}&lt;/td>
      </code-example>


      將字串轉換為小寫。
    </td>

    <td>


      ### lowercase

      <code-example hideCopy path="ajs-quick-reference/src/app/app.component.html" region="lowercase"></code-example>


      Angular 的 `lowercase` 管道做的是同樣的事。
    </td>

  </tr>

  <tr style=top>

    <td>


      ### number

      <code-example hideCopy>
        &lt;td>{{movie.starRating | number}}&lt;/td>
      </code-example>


      將數字格式化為文字。
    </td>

    <td>


      ### number

      <code-example hideCopy path="ajs-quick-reference/src/app/app.component.html" region="number"></code-example>


      Angular 的 `number` 管道類似。
      它在定義小數位數時提供更多功能，如上面的第二個範例所示。

      Angular 也有 `percent` 管道，將數字格式化為本地化的百分比，如第三個範例所示。
    </td>

  </tr>

  <tr style=top>

    <td>


      ### orderBy

      <code-example hideCopy>
        &lt;tr ng-repeat="movie in movieList | orderBy : 'title'">
      </code-example>


      以運算式指定的順序顯示集合。
      在此範例中，電影標題決定了 `movieList` 的順序。
    </td>

    <td>


      ### 無
      基於效能考量，Angular 中沒有可比擬的管道。
      請改用元件程式碼來排序結果。若你需要在多個範本中使用相同的排序程式碼，可以考慮建立自訂管道。

    </td>

  </tr>

</table>



{@a controllers-components}



## 模組／控制器／元件
在 AngularJS 與 Angular 中，模組都能協助你把應用程式組織成功能內聚的區塊。

在 AngularJS 中，你把提供檢視的模型與方法的程式碼寫在 **controller**（控制器）中。
在 Angular 中，你建置的是一個 **component**（元件）。

由於許多 AngularJS 程式碼是 JavaScript，AngularJS 欄中顯示的是 JavaScript 程式碼。
Angular 程式碼則使用 TypeScript 顯示。


<table width="100%">

  <col width="50%">

  </col>

  <col width="50%">

  </col>

  <tr>

    <th>
      AngularJS
    </th>

    <th>
      Angular
    </th>

  </tr>

  <tr style=top>

    <td>


      ### IIFE

      <code-example hideCopy>
        (function () {
          ...
        }());
      </code-example>


      在 AngularJS 中，包住控制器程式碼的立即呼叫函式運算式（IIFE）能讓它遠離全域命名空間。

    </td>

    <td>


      ### 無
      這在 Angular 中不是問題，因為 ES 2015 模組會替你處理命名空間。

      更多關於模組的資訊，請參閱[架構總覽](guide/architecture)中的[模組](guide/architecture#模組)一節。
    </td>

  </tr>

  <tr style=top>

    <td>


      ### Angular 模組

      <code-example hideCopy>
        angular.module("movieHunter", ["ngRoute"]);
      </code-example>


      在 AngularJS 中，Angular 模組會追蹤控制器、服務與其他程式碼。
      第二個參數定義此模組依賴的其他模組清單。
    </td>

    <td>


      ### NgModules

      <code-example hideCopy path="ajs-quick-reference/src/app/app.module.1.ts"></code-example>


      以 `NgModule` 裝飾器定義的 NgModules 具有相同的用途：

      * `imports`：指定此模組依賴的其他模組清單
      * `declaration`：追蹤你的元件、管道與指令。

      更多關於模組的資訊，請參閱 [NgModules](guide/ngmodules)。
    </td>

  </tr>

  <tr style=top>

    <td>


      ### 控制器註冊

      <code-example hideCopy>
        angular
          .module("movieHunter")
          .controller("MovieListCtrl",
                      ["movieService",
                       MovieListCtrl]);
      </code-example>


      AngularJS 在每個控制器中都有程式碼，用來查找適當的 Angular 模組，並向該模組註冊控制器。

      第一個參數是控制器名稱。第二個參數定義注入此控制器的所有依賴的字串名稱，以及對控制器函式的參照。
    </td>

    <td>


      ### 元件裝飾器

      <code-example hideCopy path="ajs-quick-reference/src/app/movie-list.component.ts" region="component"></code-example>


      Angular 在元件類別上加入裝飾器，以提供任何所需的詮釋資料。
      `@Component` 裝飾器宣告該類別是一個元件，並提供關於該元件的詮釋資料，例如它的 selector（或標籤）及其範本。

      這樣你就能把範本與邏輯關聯起來，而邏輯定義在元件類別中。

      更多資訊請參閱[架構總覽](guide/architecture)頁面中的 [Components](guide/architecture#元件) 一節。
    </td>

  </tr>

  <tr style=top>

    <td>


      ### 控制器函式

      <code-example hideCopy>
        function MovieListCtrl(movieService) {
        }
      </code-example>


      在 AngularJS 中，你把模型與方法的程式碼寫在控制器函式中。
    </td>

    <td>


      ### 元件類別

      <code-example hideCopy path="ajs-quick-reference/src/app/movie-list.component.ts" region="class"></code-example>


      在 Angular 中，你建立一個元件類別來包含資料模型與控制方法。使用 TypeScript 的 <code>export</code> 關鍵字匯出該類別，讓其功能可以被匯入 NgModules。

      更多資訊請參閱[架構總覽](guide/architecture)頁面中的 [Components](guide/architecture#元件) 一節。
    </td>

  </tr>

  <tr style=top>

    <td>


      ### 依賴注入

      <code-example hideCopy>
        MovieListCtrl.$inject = ['MovieService'];
        function MovieListCtrl(movieService) {
        }
      </code-example>


      在 AngularJS 中，你把任何依賴作為控制器函式的參數傳入。
      此範例注入了一個 `MovieService`。

      為了防範最小化（minification）帶來的問題，請明確告訴 Angular，它應該在第一個參數中注入一個 `MovieService` 的實例。
    </td>

    <td>


      ### 依賴注入

      <code-example hideCopy path="ajs-quick-reference/src/app/movie-list.component.ts" region="di"></code-example>


      在 Angular 中，你把依賴作為參數傳給元件類別的建構函式。
      此範例注入了一個 `MovieService`。
      第一個參數的 TypeScript 型別會告訴 Angular 要注入什麼，即使在最小化之後也是如此。

      更多資訊請參閱[架構總覽](guide/architecture)中的[依賴注入](guide/architecture#dependency-injection)一節。
    </td>

  </tr>

</table>

{@a style-sheets}



## 樣式表
樣式表讓你的應用程式看起來更美觀。
在 AngularJS 中，你為整個應用程式指定樣式表。
隨著應用程式隨時間成長，應用程式眾多部分的樣式會合併在一起，可能造成意想不到的結果。
在 Angular 中，你仍然可以為整個應用程式定義樣式表。但現在你也可以把樣式表封裝在特定元件之內。

<table width="100%">

  <col width="50%">

  </col>

  <col width="50%">

  </col>

  <tr>

    <th>
      AngularJS
    </th>

    <th>
      Angular
    </th>

  </tr>

  <tr style=top>

    <td>


      ### Link 標籤

      <code-example hideCopy>
        &lt;link href="styles.css" rel="stylesheet" />
      </code-example>


      AngularJS 使用 `index.html` 檔案 head 區段中的 `link` 標籤來定義應用程式的樣式。
    </td>

    <td>



      ### styles 設定
      <code-example hideCopy path="ajs-quick-reference/.angular-cli.1.json" region="styles"></code-example>

      使用 Angular CLI，你可以在 `angular.json` 檔案中設定全域樣式。
      你可以把副檔名改名為 `.scss` 來使用 sass。

      ### StyleUrls
      在 Angular 中，你可以使用 `@Component` 詮釋資料的 `styles` 或 `styleUrls` 屬性，為特定元件定義樣式表。

      <code-example hideCopy path="ajs-quick-reference/src/app/movie-list.component.ts" region="style-url"></code-example>


      這讓你可以為個別元件設定適當的樣式，而不會外洩到應用程式的其他部分。
    </td>

  </tr>

</table>
