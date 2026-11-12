# 從 AngularJS 到 Angular 的概念：快速參考

*Angular* 是今日與未來的 Angular 之名。

*AngularJS* 是所有 Angular v1.x 版本之名。

本指南將 AngularJS 語法對應到相應的 Angular 語法，協助你從 AngularJS 轉換到 Angular。

**請參閱此 <live-example name="ajs-quick-reference"></live-example> 中的 Angular 語法。**

## 範本基礎

範本是 Angular 應用程式中面對使用者的部分，以 HTML 撰寫。
下表列出一些主要的 AngularJS 範本功能及其對應的 Angular 範本語法。

### 繫結／插值 &rarr; 繫結／插值

| AngularJS                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             | Angular |
|:---                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |:---     |
| <header>繫結／插值</header> <code-example hideCopy format="html" language="html"> Your favorite hero is: {{vm.favoriteHero}} </code-example> 在 AngularJS 中，大括號內的運算式表示單向繫結。這會將元素的值繫結到與此範本相關聯的控制器中的屬性。 <br /> 使用 `controller as` 語法時，繫結會以控制器別名 `vm` 或 `$ctrl` 作為前置詞，因為你必須明確指出來源。 | <header>繫結／插值</header> <code-example hideCopy path="ajs-quick-reference/src/app/movie-list.component.html" region="interpolation"></code-example> 在 Angular 中，大括號內的範本運算式仍然表示單向繫結。這會將元素的值繫結到元件的屬性。繫結的上下文是隱含的，且永遠是相關聯的元件，因此不需要參照變數。 <br /> 如需更多資訊，請參閱 [插值][AioGuideInterpolation] 指南。 |

### 篩選器 &rarr; 管道

| AngularJS                                                                                                                                                                                                                                                                                                                                                             | Angular |
|:---                                                                                                                                                                                                                                                                                                                                                                   |:---     |
| <header>篩選器</header> <code-example hideCopy format="html" language="html"> &lt;td&gt; &NewLine; &nbsp; {{movie.title &verbar; uppercase}} &NewLine; &lt;/td&gt; </code-example> 若要在 AngularJS 範本中篩選輸出，請使用管道 <code>&verbar;</code> 字元與一或多個篩選器。 <br /> 此範例將 `title` 屬性篩選為大寫。 | <header>管道</header> <code-example hideCopy path="ajs-quick-reference/src/app/app.component.html" region="uppercase"></code-example> 在 Angular 中，你使用類似的語法，以管道 <code>&verbar;</code> 字元來篩選輸出，但現在它們稱為 **管道。** AngularJS 的許多（但非全部）內建篩選器，在 Angular 中都是內建管道。 <br /> 如需更多資訊，請參閱 [篩選器／管道][AioGuideAjsQuickReferenceFiltersPipes]。 |

### 區域變數 &rarr; 輸入變數

| AngularJS                                                                                                                                                                                                                                                                                                                | Angular |
|:---                                                                                                                                                                                                                                                                                                                      |:---     |
| <header>區域變數</header> <code-example hideCopy format="html" language="html"> &lt;tr ng-repeat="movie in vm.movies"&gt; &NewLine;&nbsp; &lt;td&gt; &NewLine;&nbsp;&nbsp;&nbsp; {{movie.title}} &NewLine;&nbsp; &lt;/td&gt; &NewLine;&lt;/tr&gt; </code-example> 在此，`movie` 是使用者定義的區域變數。 | <header>輸入變數</header> <code-example hideCopy path="ajs-quick-reference/src/app/app.component.html" region="local"></code-example> Angular 有真正的範本輸入變數，是使用 `let` 關鍵字明確定義的。 <br /> 如需更多資訊，請參閱 [結構指令][AioGuideStructuralDirectives] 的 [結構指令簡寫][AioGuideStructuralDirectivesStructuralDirectiveShorthand] 一節。 |

## 範本指令

AngularJS 為範本提供了七十多個內建指令。
其中許多在 Angular 中並不需要，因為 Angular 的繫結系統功能更強、表達力更豐富。
以下是一些主要的 AngularJS 內建指令及其在 Angular 中的對等指令。

### `ng-app` &rarr; 啟動

| AngularJS                                                                                                                                                                                                                                                                                                                                                                                                                   | Angular |
|:---                                                                                                                                                                                                                                                                                                                                                                                                                         |:---     |
| <header><code>ng-app</code></header> <code-example hideCopy format="html" language="html"> &lt;body ng-app="movieHunter"&gt; </code-example> 應用程式啟動程序稱為 **啟動。** <br /> 雖然你可以在程式碼中啟動 AngularJS 應用程式，但許多應用程式會以宣告方式使用 `ng-app` 指令進行啟動，並提供應用程式模組（`movieHunter`）的名稱。 | <header>啟動</header> <code-example header="main.ts" format="typescript" hideCopy language="typescript" path="ajs-quick-reference/src/main.ts"></code-example> <code-example hideCopy path="ajs-quick-reference/src/app/app.module.1.ts" header="app.module.ts"></code-example> Angular 沒有啟動指令。若要在程式碼中啟動應用程式，請在 `main.ts` 中明確啟動應用程式的根模組（`AppModule`），並在 `app.module.ts` 中啟動應用程式的根元件（`AppComponent`）。 |

### `ng-class` &rarr; `ngClass`

| AngularJS                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              | Angular |
|:---                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |:---     |
| <header><code>ng-class</code></header> <code-example hideCopy format="html" language="html"> &lt;div ng-class="{active: isActive}"&gt; &NewLine; &lt;div ng-class="{active: isActive, shazam: isImportant}"&gt; </code-example> 在 AngularJS 中，`ng-class` 指令會根據運算式來包含或排除 CSS 類別。該運算式通常是鍵值物件，鍵定義為 CSS 類別名稱，值則是會求值為布林值的範本運算式。 <br /> 在第一個範例中，若 `isActive` 為 true，`active` 類別會套用到該元素。 <br /> 如第二個範例所示，你可以指定多個類別。 | <header><code>ngClass</code></header> <code-example hideCopy path="ajs-quick-reference/src/app/app.component.html" region="ngClass"></code-example> 在 Angular 中，`ngClass` 指令的運作方式類似。它會根據運算式來包含或排除 CSS 類別。 <br /> 在第一個範例中，若 `isActive` 為 true，`active` 類別會套用到該元素。 <br /> 如第二個範例所示，你可以指定多個類別。 <br /> Angular 還有 **類別繫結，**這是加入或移除單一類別的好方法，如第三個範例所示。 <br /> 如需更多資訊，請參閱 [屬性、類別與樣式繫結][AioGuideAttributeBinding] 頁面。 |

### `ng-click` &rarr; 繫結到 `click` 事件

| AngularJS                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                | Angular |
|:---                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |:---     |
| <header><code>ng-click</code></header> <code-example hideCopy format="html" language="html"> &lt;button ng-click="vm.toggleImage()"&gt; &NewLine; &lt;button ng-click="vm.toggleImage(&dollar;event)"&gt; </code-example> 在 AngularJS 中，`ng-click` 指令可讓你指定元素被點選時的自訂行為。 <br /> 在第一個範例中，當使用者點選按鈕時，會執行由 `vm` `controller as` 別名參照的控制器中的 `toggleImage()` 方法。 <br /> 第二個範例示範傳入 `$event` 物件，該物件提供關於事件的詳細資訊給控制器。 | <header>繫結到 <code>click</code> 事件</header> <code-example hideCopy path="ajs-quick-reference/src/app/app.component.html" region="event-binding"></code-example> AngularJS 的事件型指令在 Angular 中並不存在。請改用 **事件繫結，**定義從範本檢視到元件的單向繫結。 <br /> 進行事件繫結時，請在括號內定義目標事件的名稱，並在等號右側以引號指定範本陳述式。Angular 接著會為目標事件設定事件處理常式。當事件引發時，處理常式會執行該範本陳述式。 <br /> 在第一個範例中，當使用者點選按鈕時，會執行相關聯元件中的 `toggleImage()` 方法。 <br /> 第二個範例示範傳入 `$event` 物件，該物件提供關於事件的詳細資訊給元件。 <br /> 如需 DOM 事件清單，請參閱 [事件參考][MdnDocsWebEvents]。 <br /> 如需更多資訊，請參閱 [事件繫結][AioGuideEventBinding] 頁面。 |

### `ng-controller` &rarr; 元件裝飾器

| AngularJS                                                                                                                                                                                                                                                                                                                                                                                        | Angular |
|:---                                                                                                                                                                                                                                                                                                                                                                                              |:---     |
| <header><code>ng-controller</code></header> <code-example hideCopy format="html" language="html"> &lt;div ng-controller="MovieListCtrl as vm"&gt; </code-example> 在 AngularJS 中，`ng-controller` 指令會將控制器附加到檢視。使用 `ng-controller`，或將控制器定義為路由的一部分，會將檢視與和該檢視相關聯的控制器程式碼連結起來。 | <header>元件裝飾器</header> <code-example hideCopy path="ajs-quick-reference/src/app/movie-list.component.ts" region="component"></code-example> 在 Angular 中，範本不再指定其相關聯的控制器。改由元件將其相關聯的範本指定為元件類別裝飾器的一部分。 <br /> 如需更多資訊，請參閱 [架構總覽][AioGuideArchitectureComponents]。 |

### `ng-hide` &rarr; 繫結到 `hidden` 屬性

| AngularJS                                                                                                                                                                                                                        | Angular |
|:---                                                                                                                                                                                                                              |:---     |
| <header><code>ng-hide</code></header> 在 AngularJS 中，`ng-hide` 指令會根據運算式顯示或隱藏相關聯的 HTML 元素。 如需更多資訊，請參閱 [ng-show][AioGuideAjsQuickReferenceTemplateDirectives]。 | <header>繫結到 <code>hidden</code> 屬性</header> 在 Angular 中，你使用屬性繫結。Angular 沒有內建的 *hide* 指令。 如需更多資訊，請參閱 [ng-show][AioGuideAjsQuickReferenceTemplateDirectives]。 |

### `ng-href` &rarr; 繫結到 `href` 屬性

| AngularJS                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                | Angular |
|:---                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |:---     |
| <header><code>ng-href</code></header> <code-example hideCopy format="html" language="html"> &lt;a ng-href="{{ angularDocsUrl }}"&gt; &NewLine; &nbsp; Angular Docs &NewLine; &lt;/a&gt; </code-example> `ng-href` 指令可讓 AngularJS 預先處理 `href` 屬性。`ng-href` 可以在瀏覽器從該 URL 擷取之前，將繫結運算式取代為適當的 URL。 <br /> 在 AngularJS 中，`ng-href` 通常用於在導覽時啟用路由。 <br /> <code-example hideCopy format="html" language="html"> &lt;a ng-href="#{{ moviesHash }}"&gt; &NewLine;&nbsp; Movies &NewLine;&lt;/a&gt; </code-example> Angular 處理路由的方式不同。 | <header>繫結到 <code>href</code> 屬性</header> <code-example hideCopy path="ajs-quick-reference/src/app/app.component.html" region="href"></code-example> Angular 使用屬性繫結。 Angular 沒有內建的 *href* 指令。請將元素的 `href` 屬性放在方括號內，並將其設定為帶引號的範本運算式。 如需更多資訊，請參閱 [屬性繫結][AioGuidePropertyBinding] 頁面。 在 Angular 中，`href` 不再用於路由。路由使用 `routerLink`，如下列範例所示。 <code-example hideCopy path="ajs-quick-reference/src/app/app.component.html" region="router-link"></code-example> 如需更多路由資訊，請參閱 [路由與導覽][AioGuideRouter] 頁面中的 [定義基本路由][AioGuideRouterDefiningABasicRoute]。 |

### `ng-if` &rarr; `*ngIf`

| AngularJS                                                                                                                                                                                                                                                                                                                                                                                                                                             | Angular |
|:---                                                                                                                                                                                                                                                                                                                                                                                                                                                   |:---     |
| <header><code>ng-if</code></header> <code-example hideCopy format="html" language="html"> &lt;table ng-if="movies.length"&gt; </code-example> 在 AngularJS 中，`ng-if` 指令會根據運算式移除或重新建立 DOM 的某個區段。若運算式為 false，該元素會從 DOM 中移除。 <br /> 在此範例中，除非 `movies` 陣列的長度大於零，否則 `<table>` 元素會從 DOM 中移除。 | <header><code>&ast;ngIf</code></header> <code-example hideCopy path="ajs-quick-reference/src/app/movie-list.component.html" region="ngIf"></code-example> Angular 中的 `*ngIf` 指令運作方式與 AngularJS 中的 `ng-if` 指令相同。它會根據運算式移除或重新建立 DOM 的某個區段。 <br /> 在此範例中，除非 `movies` 陣列具有長度，否則 `<table>` 元素會從 DOM 中移除。 <br /> 在此範例中，`ngIf` 之前的 \(`*`\) 是必要的。 如需更多資訊，請參閱 [結構指令][AioGuideStructuralDirectives]。 |

### `ng-model` &rarr; `ngModel`

| AngularJS                                                                                                                                                                                                                                                                                                                                                                                                                                                                     | Angular |
|:---                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |:---     |
| <header><code>ng-model</code></header> <code-example hideCopy format="html" language="html"> &lt;input ng-model="vm.favoriteHero" /&gt; </code-example> 在 AngularJS 中，`ng-model` 指令會將表單控制項繫結到與範本相關聯的控制器中的屬性。這提供 **雙向繫結，**變更會使檢視中的值與模型同步。 | <header><code>ngModel</code></header> <code-example hideCopy path="ajs-quick-reference/src/app/movie-list.component.html" region="ngModel"></code-example> 在 Angular 中**，雙向繫結** 以 `[()]` 表示，形象地稱為「盒子裡的香蕉」。此語法是同時定義以下兩者的捷徑：<ul><li>屬性繫結，從元件到檢視</li><li>事件繫結，從檢視到元件</li></ul>藉此提供雙向繫結。 <br /> 如需更多使用 `ngModel` 進行雙向繫結的資訊，請參閱 [內建指令][AioGuideBuiltInDirectives] 的 [使用 `ngModel` 顯示與更新屬性][AioGuideBuiltInDirectivesDisplayingAndUpdatingPropertiesWithNgmodel] 一節。 |

### `ng-repeat` &rarr; `*ngFor`

| AngularJS                                                                                                                                                                                                                                                                                                                                                                                         | Angular |
|:---                                                                                                                                                                                                                                                                                                                                                                                               |:---     |
| <header><code>ng-repeat</code></header> <code-example hideCopy format="html" language="html"> &lt;tr ng-repeat="movie in vm.movies"&gt; </code-example> 在 AngularJS 中，`ng-repeat` 指令會為指定集合中的每個項目重複相關聯的 DOM 元素。 <br /> 在此範例中，表格列（`<tr>`）元素會為電影集合中的每個電影物件重複出現。 | <header><code>&ast;ngFor</code></header> <code-example hideCopy path="ajs-quick-reference/src/app/movie-list.component.html" region="ngFor"></code-example> Angular 中的 `*ngFor` 指令類似於 AngularJS 中的 `ng-repeat` 指令。它會為指定集合中的每個項目重複相關聯的 DOM 元素。更精確地說，它會將定義的元素（在此範例中為 `<tr>`）及其內容轉換為範本，並使用該範本為清單中的每個項目建立一個檢視。 <br /> 請注意其他語法差異： <ul><li>`ngFor` 之前的 \(`*`\) 是必要的</li><li>`let` 關鍵字將 `movie` 識別為輸入變數</li><li>清單介系詞是 `of`，而非 `in`</li></ul>如需更多資訊，請參閱 [結構指令][AioGuideStructuralDirectives]。 |

### `ng-show` &rarr; 繫結到 `hidden` 屬性

| AngularJS                                                                                                                                                                                                                                                                                                                                                                                                                                  | Angular |
|:---                                                                                                                                                                                                                                                                                                                                                                                                                                        |:---     |
| <header><code>ng-show</code></header> <code-example hideCopy format="html" language="html"> &lt;h3 ng-show="vm.favoriteHero"&gt; &NewLine; &nbsp; Your favorite hero is: {{vm.favoriteHero}} &NewLine; &lt;/h3&gt; </code-example> 在 AngularJS 中，`ng-show` 指令會根據運算式顯示或隱藏相關聯的 DOM 元素。 <br /> 在此範例中，若 `favoriteHero` 變數為真值，`<div>` 元素便會顯示。 | <header>繫結到 <code>hidden</code> 屬性</header> <code-example hideCopy path="ajs-quick-reference/src/app/movie-list.component.html" region="hidden"></code-example> Angular 使用屬性繫結。 Angular 沒有內建的 *show* 指令。若要隱藏與顯示元素，請繫結到 HTML 的 `hidden` 屬性。 <br /> 若要依條件顯示元素，可以使用元素的 `hidden` 屬性。請將 `hidden` 屬性放在方括號內，並將其設定為帶引號的範本運算式，該運算式求值為 *show* 的 *相反* 結果。 <br /> 在此範例中，若 `favoriteHero` 變數不是真值，`<div>` 元素便會隱藏。 <br /> 如需更多屬性繫結的資訊，請參閱 [屬性繫結][AioGuidePropertyBinding] 頁面。 |

### `ng-src` &rarr; 繫結到 `src` 屬性

| AngularJS                                                                                                                                                                                                                                                                                                                                    | Angular |
|:---                                                                                                                                                                                                                                                                                                                                          |:---     |
| <header><code>ng-src</code></header> <code-example hideCopy format="html" language="html"> &lt;img ng-src="{{movie.imageurl}}"&gt; </code-example> `ng-src` 指令可讓 AngularJS 預先處理 `src` 屬性。這會在瀏覽器從該 URL 擷取之前，將繫結運算式取代為適當的 URL。 | <header>繫結到 <code>src</code> 屬性</header> <code-example hideCopy path="ajs-quick-reference/src/app/app.component.html" region="src"></code-example> Angular 使用屬性繫結。 Angular 沒有內建的 *src* 指令。請將 `src` 屬性放在方括號內，並將其設定為帶引號的範本運算式。 <br /> 如需更多屬性繫結的資訊，請參閱 [屬性繫結][AioGuidePropertyBinding] 頁面。 |

### `ng-style` &rarr; `ngStyle`

| AngularJS                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       | Angular |
|:---                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |:---     |
| <header><code>ng-style</code></header> <code-example hideCopy format="html" language="html"> &lt;div ng-style="{color: colorPreference}"&gt; </code-example> 在 AngularJS 中，`ng-style` 指令會根據運算式，在 HTML 元素上設定 CSS 樣式。該運算式通常是鍵值控制物件，包含： <ul><li> 物件的每個鍵定義為 CSS 屬性</li><li>每個值定義為會求值為適合該樣式的值的運算式</li></ul> 在此範例中，`color` 樣式設定為 `colorPreference` 變數的目前值。 | <header><code>ngStyle</code></header> <code-example hideCopy path="ajs-quick-reference/src/app/app.component.html" region="ngStyle"></code-example> 在 Angular 中，`ngStyle` 指令的運作方式類似。它會根據運算式，在 HTML 元素上設定 CSS 樣式。 <br /> 在第一個範例中，`color` 樣式設定為 `colorPreference` 變數的目前值。 <br /> Angular 還有 **樣式繫結，**這是設定單一樣式的好方法，如第二個範例所示。 <br /> 如需更多樣式繫結的資訊，請參閱 [屬性繫結][AioGuideAttributeBinding] 頁面的 [樣式繫結][AioGuideAttributeBindingBindingToTheStyleAttribute] 一節。 <br /> 如需更多 `ngStyle` 指令的資訊，請參閱 [內建指令][AioGuideBuiltInDirectives] 頁面的 [NgStyle][AioGuideBuiltInDirectivesSettingInlineStylesWithNgstyle] 一節。 |

### `ng-switch` &rarr; `ngSwitch`

| AngularJS                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   | Angular |
|:---                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |:---     |
| <header><code>ng-switch</code></header> <code-example hideCopy format="html" language="html"> &lt;div ng-switch="vm.favoriteHero &amp;&amp; vm.checkMovieHero(vm.favoriteHero)"&gt; &NewLine; &nbsp; &lt;div ng-switch-when="true"&gt; &NewLine; &nbsp; &nbsp; Excellent choice. &NewLine; &nbsp; &lt;/div&gt; &NewLine; &nbsp; &lt;div ng-switch-when="false"&gt; &NewLine; &nbsp; &nbsp; No movie, sorry. &NewLine; &nbsp; &lt;/div&gt; &NewLine; &nbsp; &lt;div ng-switch-default&gt; &NewLine; &nbsp; &nbsp; Please enter your favorite hero. &NewLine; &nbsp; &lt;/div&gt; &NewLine; &lt;/div&gt; </code-example> 在 AngularJS 中，`ng-switch` 指令會根據運算式的目前值選擇其中一個範本，藉此置換元素的內容。 <br /> 在此範例中，若未設定 `favoriteHero`，範本會顯示 "Please enter &hellip;"；若已設定 `favoriteHero`，它會呼叫控制器方法來檢查電影英雄。若該方法傳回 `true`，範本會顯示 "Excellent choice!"；若該方法傳回 `false`，範本會顯示 "No movie, sorry!"。 | <header><code>ngSwitch</code></header> <code-example hideCopy path="ajs-quick-reference/src/app/movie-list.component.html" region="ngSwitch"></code-example> 在 Angular 中，`ngSwitch` 指令的運作方式類似。它會顯示其 `*ngSwitchCase` 與目前 `ngSwitch` 運算式值相符的元素。 <br /> 在此範例中，若未設定 `favoriteHero`，`ngSwitch` 的值為 `null`，且 `*ngSwitchDefault` 會顯示 "Please enter your favorite hero."；若已設定 `favoriteHero`，應用程式會呼叫元件方法來檢查電影英雄。若該方法傳回 `true`，應用程式會選取 `*ngSwitchCase="true"` 並顯示 "Excellent choice."；若該方法傳回 `false`，應用程式會選取 `*ngSwitchCase="false"` 並顯示 "No movie, sorry."。 <br /> 在此範例中，`ngSwitchCase` 與 `ngSwitchDefault` 之前的 \(`*`\) 是必要的。 <br /> 如需更多資訊，請參閱 [內建指令][AioGuideBuiltInDirectives] 頁面的 [NgSwitch 指令][AioGuideBuiltInDirectivesSwitchingCasesWithNgswitch] 一節。 |

## 篩選器／管道

Angular 的 **管道** 為範本中的資料提供格式化與轉換功能，如同 AngularJS 的 **篩選器。**
AngularJS 的許多內建篩選器在 Angular 中都有對應的管道。
如需更多管道資訊，請參閱 [管道][AioGuidePipes]。

### `currency` &rarr; `currency`

| AngularJS                                                                                                                                                                                                                      | Angular |
|:---                                                                                                                                                                                                                            |:---     |
| <header><code>currency</code></header> <code-example hideCopy format="html" language="html"> &lt;td&gt; &NewLine; &nbsp; {{movie.price &verbar; currency}} &NewLine; &lt;/td&gt; </code-example> 將數字格式化為貨幣。 | <header><code>currency</code></header> <code-example hideCopy path="ajs-quick-reference/src/app/app.component.html" region="currency"></code-example> Angular 的 `currency` 管道類似，但部分參數已變更。 |

### `date` &rarr; `date`

| AngularJS                                                                                                                                                                                                                                                | Angular |
|:---                                                                                                                                                                                                                                                      |:---     |
| <header><code>date</code></header> <code-example hideCopy format="html" language="html"> &lt;td&gt; &NewLine; &nbsp; {{movie.releaseDate &verbar; date}} &NewLine; &lt;/td&gt; </code-example> 根據要求的格式，將日期格式化為字串。 | <header><code>date</code></header> <code-example hideCopy path="ajs-quick-reference/src/app/app.component.html" region="date"></code-example> Angular 的 `date` 管道類似。 |

### `filter` &rarr; 無

| AngularJS                                                                                                                                                                                                                                                                     | Angular |
|:---                                                                                                                                                                                                                                                                           |:---     |
| <header><code>filter</code></header> <code-example hideCopy format="html" language="html"> &lt;tr ng-repeat="movie in movieList &verbar; filter: {title:listFilter}"&gt; </code-example> 根據篩選條件，從定義的集合中選取項目的子集。 | <header>無</header> 基於效能考量，Angular 中沒有可比較的管道。請在元件中完成所有篩選工作。若你需要在數個範本中使用相同的篩選程式碼，請考慮建立自訂管道。 |

### `json` &rarr; `json`

| AngularJS                                                                                                                                                                                                                                                           | Angular |
|:---                                                                                                                                                                                                                                                                 |:---     |
| <header><code>json</code></header> <code-example hideCopy format="html" language="html"> &lt;pre&gt; &NewLine; &nbsp; {{movie &verbar; json}} &NewLine; &lt;/pre&gt; </code-example> 將 JavaScript 物件轉換為 JSON 字串。這對除錯很有用。 | <header><code>json</code></header> <code-example hideCopy path="ajs-quick-reference/src/app/app.component.html" region="json"></code-example> Angular 的 [`json`][AioApiCommonJsonpipe] 管道也是如此。 |

### `limitTo` &rarr; `slice`

| AngularJS                                                                                                                                                                                                                                                                                                    | Angular |
|:---                                                                                                                                                                                                                                                                                                          |:---     |
| <header><code>limitTo</code></header> <code-example hideCopy format="html" language="html"> &lt;tr ng-repeat="movie in movieList &verbar; limitTo:2:0"&gt; </code-example> 從集合中選取最多第一個參數 `2` 所指定數量的項目，可選擇從起始索引 `0` 開始。 | <header><code>slice</code></header> <code-example hideCopy path="ajs-quick-reference/src/app/app.component.html" region="slice"></code-example> `SlicePipe` 的作用相同，但 *參數的順序相反，*符合 JavaScript `Slice` 方法的規定。第一個參數是起始索引，第二個是上限。如同 AngularJS，在元件內撰寫此操作的程式碼反而可能提升效能。 |

### `lowercase` &rarr; `lowercase`

| AngularJS                                                                                                                                                                                                                            | Angular |
|:---                                                                                                                                                                                                                                  |:---     |
| <header><code>lowercase</code></header> <code-example hideCopy format="html" language="html"> &lt;td&gt; &NewLine; &nbsp; {{movie.title &verbar; lowercase}} &NewLine; &lt;/td&gt; </code-example> 將字串轉換為小寫。 | <header><code>lowercase</code></header> <code-example hideCopy path="ajs-quick-reference/src/app/app.component.html" region="lowercase"></code-example> Angular 的 `lowercase` 管道也是如此。 |

### `number` &rarr; `number`

| AngularJS                                                                                                                                                                                                                   | Angular |
|:---                                                                                                                                                                                                                         |:---     |
| <header><code>number</code></header> <code-example hideCopy format="html" language="html"> &lt;td&gt; &NewLine; &nbsp; {{movie.starRating &verbar; number}} &NewLine; &lt;/td&gt; </code-example> 將數字格式化為文字。 | <header><code>number</code></header> <code-example hideCopy path="ajs-quick-reference/src/app/app.component.html" region="number"></code-example> Angular 的 [`number`][AioApiCommonDecimalpipe] 管道類似。在定義小數位數時，它提供更多功能，如前面的第二個範例所示。 <br /> Angular 還有 `percent` 管道，可將數字格式化為當地百分比，如第三個範例所示。 |

### `orderBy` &rarr; 無

| AngularJS                                                                                                                                                                                                                                                                                                   | Angular |
|:---                                                                                                                                                                                                                                                                                                         |:---     |
| <header><code>orderBy</code></header> <code-example hideCopy format="html" language="html"> &lt;tr ng-repeat="movie in movieList &verbar; orderBy : 'title'"&gt; </code-example> 依照運算式指定的順序顯示集合。在此範例中，電影標題決定了 `movieList` 的順序。 | <header>無</header> 基於效能考量，Angular 中沒有可比較的管道。請改用元件程式碼來排序結果。若你需要在數個範本中使用相同的排序程式碼，請考慮建立自訂管道。 |

## 模組／控制器／元件

在 AngularJS 與 Angular 中，模組都能協助你將應用程式組織為內聚的功能區塊。

在 AngularJS 中，你在 **控制器** 中撰寫為檢視提供模型與方法的程式碼。
在 Angular 中，你建立 **元件。**

由於許多 AngularJS 程式碼是以 JavaScript 撰寫，因此 AngularJS 欄位顯示的是 JavaScript 程式碼。
Angular 程式碼則以 TypeScript 顯示。

### 立即呼叫函式運算式 (IIFE) &rarr; 無

| AngularJS                                                                                                                                                                                                                                                                                                                                      | Angular |
|:---                                                                                                                                                                                                                                                                                                                                            |:---     |
| <header>IIFE</header> <code-example hideCopy format="typescript" language="typescript"> ( &NewLine;&nbsp; function () { &NewLine;&nbsp;&nbsp;&nbsp; &hellip; &NewLine;&nbsp; }() &NewLine;); </code-example> 在 AngularJS 中，控制器程式碼外的 IIFE 可使其保持在全域命名空間之外。 | <header>無</header> 在 Angular 中這不是問題，因為 ES 2015 模組會為你處理命名空間。 <br /> 如需更多模組資訊，請參閱 [架構總覽][AioGuideArchitecture] 的 [模組][AioGuideArchitectureModules] 一節。 |

### Angular 模組 &rarr; `NgModules`

| AngularJS                                                                                                                                                                                                                                                                                                                                                                                                                           | Angular |
|:---                                                                                                                                                                                                                                                                                                                                                                                                                                 |:---     |
| <header>Angular 模組</header> <code-example hideCopy format="typescript" language="typescript"> angular .module( &NewLine;&nbsp; "movieHunter", &NewLine;&nbsp; [ &NewLine;&nbsp;&nbsp;&nbsp; "ngRoute" &NewLine;&nbsp; ] &NewLine;); </code-example> 在 AngularJS 中，Angular 模組會追蹤控制器、服務與其他程式碼。第二個引數定義此模組所依賴的其他模組清單。 | <header><code>NgModules</code></header> <code-example hideCopy path="ajs-quick-reference/src/app/app.module.1.ts"></code-example> 以 `NgModule` 裝飾器定義的 NgModules 具有相同用途： <ul> <li>`imports`：指定此模組所依賴的其他模組清單</li> <li>`declaration`：追蹤你的元件、管道與指令。</li> </ul> 如需更多模組資訊，請參閱 [NgModules][AioGuideNgmodules]。 |

### 控制器註冊 &rarr; 元件裝飾器

| AngularJS                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               | Angular |
|:---                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |:---     |
| <header>控制器註冊</header> <code-example hideCopy format="typescript" language="typescript"> angular .module( &NewLine;&nbsp; "movieHunter" &NewLine;) .controller( &NewLine;&nbsp; "MovieListCtrl", &NewLine;&nbsp; [ &NewLine;&nbsp;&nbsp;&nbsp; "movieService", &NewLine;&nbsp;&nbsp;&nbsp; MovieListCtrl &NewLine;&nbsp; ] &NewLine;); </code-example> AngularJS 在每個控制器中都有程式碼，可尋找適當的 Angular 模組並向該模組註冊控制器。 <br /> 第一個引數是控制器名稱。第二個引數定義注入此控制器的所有相依性的字串名稱，以及對控制器函式的參照。 | <header>元件裝飾器</header> <code-example hideCopy path="ajs-quick-reference/src/app/movie-list.component.ts" region="component"></code-example> Angular 會在元件類別上加入裝飾器，以提供任何必要的中繼資料。`@Component` 裝飾器宣告該類別為元件，並提供關於該元件的中繼資料，例如其選取器（即標籤）與範本。 <br /> 這就是你將範本與邏輯（定義於元件類別中）相關聯的方式。 <br /> 如需更多資訊，請參閱 [架構總覽][AioGuideArchitecture] 頁面的 [元件][AioGuideArchitectureComponents] 一節。 |

### 控制器函式 &rarr; 元件類別

| AngularJS                                                                                                                                                                                                                                                      | Angular |
|:---                                                                                                                                                                                                                                                            |:---     |
| <header>控制器函式</header> <code-example hideCopy format="typescript" language="typescript"> function MovieListCtrl(movieService) { &NewLine; } </code-example> 在 AngularJS 中，你在控制器函式中撰寫模型與方法的程式碼。 | <header>元件類別</header> <code-example hideCopy path="ajs-quick-reference/src/app/movie-list.component.ts" region="class"></code-example> 在 Angular 中，你建立元件類別來容納資料模型與控制方法。使用 TypeScript <code>export</code> 關鍵字匯出該類別，以便將元件匯入 NgModules。 <br /> 如需更多資訊，請參閱 [架構總覽][AioGuideArchitecture] 頁面的 [元件][AioGuideArchitectureComponents] 一節。 |

### 依賴注入 &rarr; 依賴注入

| AngularJS                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 | Angular |
|:---                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |:---     |
| <header>依賴注入</header> <code-example hideCopy format="typescript" language="typescript"> MovieListCtrl.&dollar;inject = [ &NewLine;&nbsp; 'MovieService' &NewLine;]; &NewLine;function MovieListCtrl(movieService) { &NewLine;} </code-example> 在 AngularJS 中，你將任何相依性作為控制器函式引數傳入。此範例注入 `MovieService`。 <br /> 為了防範壓縮造成的問題，請明確告訴 Angular，它應在第一個參數中注入 `MovieService` 的執行個體。 | <header>依賴注入</header> <code-example hideCopy path="ajs-quick-reference/src/app/movie-list.component.ts" region="di"></code-example> 在 Angular 中，你將相依性作為引數傳入元件類別建構函式。此範例注入 `MovieService`。即使經過壓縮，第一個參數的 TypeScript 型別仍會告訴 Angular 要注入什麼。 <br /> 如需更多資訊，請參閱 [架構總覽][AioGuideArchitecture] 的 [依賴注入][AioGuideArchitectureServicesAndDependencyInjection] 一節。 |

## 樣式表

樣式表讓你的應用程式擁有好看的外觀。
在 AngularJS 中，你為整個應用程式指定樣式表。
隨著應用程式逐漸成長，應用程式各部分的樣式會合併，可能導致非預期的結果。
在 Angular 中，你仍然可以為整個應用程式定義樣式表。
現在你還可以將樣式表封裝在特定元件內。

### `Link` 標籤 &rarr; `styles` 設定或 `styleUrls`

| AngularJS                                                                                                                                                                                                                                                                                                                  | Angular |
|:---                                                                                                                                                                                                                                                                                                                        |:---     |
| <header><code>Link</code> 標籤</header> <code-example hideCopy format="html" language="html"> &lt;link href="styles.css" &NewLine;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; rel="stylesheet" /&gt; </code-example> AngularJS 使用 `index.html` 檔案 head 區段中的 `link` 標籤來定義應用程式的樣式。 | <header><code>styles</code> 設定</header> <code-example hideCopy path="ajs-quick-reference/.angular-cli.1.json" region="styles"></code-example> 使用 Angular CLI，你可以在 `angular.json` 檔案中設定全域樣式。你可以將副檔名重新命名為 `.scss` 以使用 sass。 <br /><br /> <header><code>styleUrls</code></header> 在 Angular 中，你可以使用 `@Component` 中繼資料的 `styles` 或 `styleUrls` 屬性，為特定元件定義樣式表。 <br /> <code-example hideCopy path="ajs-quick-reference/src/app/movie-list.component.ts" region="style-url"></code-example> 這可讓你為個別元件設定適當的樣式，而不會洩漏到應用程式的其他部分。 |

<!-- links -->

[AioApiCommonDecimalpipe]: api/common/DecimalPipe "DecimalPipe | @angular/common - API | Angular"
[AioApiCommonJsonpipe]: api/common/JsonPipe "JsonPipe | @angular/common - API | Angular"

[AioGuideAjsQuickReferenceFiltersPipes]: guide/ajs-quick-reference#篩選器--管道 "篩選器／管道 — 從 AngularJS 到 Angular 的概念：快速參考 | Angular"
[AioGuideAjsQuickReferenceTemplateDirectives]: guide/ajs-quick-reference#範本指令 "範本指令 — 從 AngularJS 到 Angular 的概念：快速參考 | Angular"

[AioGuideArchitecture]: guide/architecture "Angular 概念簡介 | Angular"
[AioGuideArchitectureComponents]: guide/architecture#元件 "元件 — Angular 概念簡介 | Angular"
[AioGuideArchitectureModules]: guide/architecture#模組 "模組 — Angular 概念簡介 | Angular"
[AioGuideArchitectureServicesAndDependencyInjection]: guide/architecture#服務與依賴注入 "服務與依賴注入 — Angular 概念簡介 | Angular"

[AioGuideAttributeBinding]: guide/attribute-binding "屬性、類別與樣式繫結 | Angular"
[AioGuideAttributeBindingBindingToTheStyleAttribute]: guide/class-binding "類別與樣式繫結 | Angular"

[AioGuideBuiltInDirectives]: guide/built-in-directives "內建指令 | Angular"
[AioGuideBuiltInDirectivesDisplayingAndUpdatingPropertiesWithNgmodel]: guide/built-in-directives#使用-ngmodel-顯示與更新屬性 "使用 ngModel 顯示與更新屬性 — 內建指令 | Angular"
[AioGuideBuiltInDirectivesSettingInlineStylesWithNgstyle]: guide/built-in-directives#使用-ngstyle-設定行內樣式 "使用 NgStyle 設定行內樣式 — 內建指令 | Angular"
[AioGuideBuiltInDirectivesSwitchingCasesWithNgswitch]: guide/built-in-directives#使用-ngswitch-切換案例 "使用 NgSwitch 切換案例 — 內建指令 | Angular"

[AioGuideEventBinding]: guide/event-binding "事件繫結 | Angular"

[AioGuideInterpolation]: guide/interpolation "文字插值 | Angular"

[AioGuideNgmodules]: guide/ngmodules "NgModules | Angular"

[AioGuidePipes]: guide/pipes "使用管道轉換資料 | Angular"

[AioGuidePropertyBinding]: guide/property-binding "屬性繫結 | Angular"

[AioGuideRouter]: guide/router "常見路由工作 | Angular"
[AioGuideRouterDefiningABasicRoute]: guide/router#定義基本路由 "定義基本路由 — 常見路由工作 | Angular"

[AioGuideStructuralDirectives]: guide/structural-directives "撰寫結構指令 | Angular"
[AioGuideStructuralDirectivesStructuralDirectiveShorthand]: guide/structural-directives#結構指令簡寫 "結構指令簡寫 — 撰寫結構指令 | Angular"

<!-- external links -->

[MdnDocsWebEvents]: https://developer.mozilla.org/docs/Web/Events "事件參考 | MDN"

<!-- end links -->

@reviewed 2022-02-28
