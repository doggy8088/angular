# 英雄編輯器

應用程式現在已經有一個基本標題。
接下來，你將建立一個新的元件來顯示英雄資訊，
並把這個元件放入應用程式殼層中。

## 建立 heroes 元件

使用 Angular CLI，產生一個名為 `heroes` 的新元件。

<code-example language="sh" class="code-shell">
  ng generate component heroes
</code-example>

CLI 會建立一個新資料夾 `src/app/heroes/`，並產生
`HeroesComponent` 的四個檔案。

`HeroesComponent` 類別檔案如下：

<code-example 
  path="toh-pt1/src/app/heroes/heroes.component.ts" region="v1" 
  header="app/heroes/heroes.component.ts (initial version)" linenums="false">
</code-example>

你一律要從 Angular 核心程式庫匯入 `Component` 符號，
並以 `@Component` 標註元件類別。

`@Component` 是一個裝飾器函式，用來指定這個元件的 Angular 中繼資料。

CLI 產生了三個中繼資料屬性：

1. `selector`&mdash; 這個元件的 CSS 元素選取器
1. `templateUrl`&mdash; 這個元件的範本檔案位置。
1. `styleUrls`&mdash; 這個元件專用 CSS 樣式的位置。

{@a selector}

[CSS 元素選取器](https://developer.mozilla.org/en-US/docs/Web/CSS/Type_selectors)，
`'app-heroes'`，會對應到 HTML 元素的名稱，這個元素會在父元件的範本中識別這個元件。

`ngOnInit` 是一個[生命週期鉤子](guide/lifecycle-hooks#oninit)。
Angular 會在建立元件後不久呼叫 `ngOnInit`。
這是放置初始化邏輯的好地方。

一律要 `export` 元件類別，這樣你才能在其他地方 `import` 它……例如在 `AppModule` 中。

### 加入 _hero_ 屬性

為名叫 "Windstorm" 的英雄，在 `HeroesComponent` 中加入一個 `hero` 屬性。

<code-example path="toh-pt1/src/app/heroes/heroes.component.ts" region="add-hero" header="heroes.component.ts (hero property)" linenums="false">
</code-example>

### 顯示英雄

開啟 `heroes.component.html` 範本檔案。
刪除 Angular CLI 產生的預設文字，
改為對新的 `hero` 屬性進行資料繫結。

<code-example path="toh-pt1/src/app/heroes/heroes.component.1.html" header="heroes.component.html" region="show-hero-1" linenums="false">
</code-example>

## 顯示 _HeroesComponent_ 檢視

要顯示 `HeroesComponent`，你必須把它加到殼層 `AppComponent` 的範本中。

別忘了 `app-heroes` 是 `HeroesComponent` 的[元素選取器](#selector)。
所以要在 `AppComponent` 範本檔案中，於標題正下方加入一個 `<app-heroes>` 元素。

<code-example path="toh-pt1/src/app/app.component.html" header="src/app/app.component.html" linenums="false">
</code-example>

假設 CLI 的 `ng serve` 指令仍在執行，
瀏覽器應該會重新整理，同時顯示應用程式標題與英雄名稱。

## 建立 Hero 類別

真正的英雄不只有名字。

在 `src/app` 資料夾中建立一個獨立檔案，定義 `Hero` 類別。
為它加上 `id` 與 `name` 屬性。

<code-example path="toh-pt1/src/app/hero.ts"  header="src/app/hero.ts" linenums="false">
</code-example>


回到 `HeroesComponent` 類別，匯入 `Hero` 類別。

把元件的 `hero` 屬性重構為 `Hero` 型別。
以 `id` 為 `1`、名稱為 `Windstorm` 來初始化它。

修改後的 `HeroesComponent` 類別檔案應該會像這樣：

<code-example path="toh-pt1/src/app/heroes/heroes.component.ts" linenums="false"
  header= "src/app/heroes/heroes.component.ts">
</code-example>

頁面現在無法正常顯示，因為你把英雄從字串改成了物件。

## 顯示英雄物件

更新範本中的繫結，來宣告英雄的名稱，
並在詳細資料版面中同時顯示 `id` 與 `name`，如下所示：

<code-example 
  path="toh-pt1/src/app/heroes/heroes.component.1.html"
  region="show-hero-2" 
  header="heroes.component.html (HeroesComponent's template)" linenums="false">
</code-example>

瀏覽器會重新整理並顯示英雄的資訊。

## 使用 _UppercasePipe_ 格式化

像這樣修改 `hero.name` 繫結。
<code-example
  path="toh-pt1/src/app/heroes/heroes.component.html"
  region="pipe">
</code-example>

瀏覽器會重新整理，現在英雄的名稱會以大寫字母顯示。

插值繫結中，
管道運算子（ | ）正後方的 `uppercase` 一詞，
會啟用內建的 `UppercasePipe`。

[管道](guide/pipes)是格式化字串、貨幣金額、日期與其他顯示資料的好方法。
Angular 內建了數個管道，你也可以建立自己的管道。

## 編輯英雄

使用者應該可以在 `<input>` 文字方塊中編輯英雄名稱。

文字方塊應該同時_顯示_英雄的 `name` 屬性，
並在使用者輸入時_更新_該屬性。
這表示資料會從元件類別_流向畫面_，
也會從畫面_流回類別_。

要讓這個資料流自動化，請在 `<input>` 表單元素與 `hero.name` 屬性之間設定雙向資料繫結。

### 雙向繫結

重構 `HeroesComponent` 範本中的詳細資料區域，讓它看起來像這樣：

<code-example path="toh-pt1/src/app/heroes/heroes.component.1.html" region="name-input" header="src/app/heroes/heroes.component.html (HeroesComponent's template)" linenums="false">

</code-example>

**[(ngModel)]** 是 Angular 的雙向資料繫結語法。

在這裡，它把 `hero.name` 屬性繫結到 HTML 文字方塊，讓資料可以_雙向_流動：從 `hero.name` 屬性流向文字方塊，再從文字方塊流回 `hero.name`。

### 缺少的 _FormsModule_

請注意，加入 `[(ngModel)]` 後，應用程式就停止運作了。

要查看錯誤，請開啟瀏覽器的開發人員工具，在主控台中
尋找類似以下的訊息

<code-example language="sh" class="code-shell">
Template parse errors:
Can't bind to 'ngModel' since it isn't a known property of 'input'.
</code-example>

雖然 `ngModel` 是有效的 Angular 指令，但預設並不提供。

它屬於選用的 `FormsModule`，你必須_選擇加入_才能使用它。

## _AppModule_

Angular 需要知道你的應用程式各部分如何組合在一起，
以及應用程式還需要哪些其他檔案與程式庫。
這些資訊稱為_中繼資料_。

部分中繼資料位於你加到元件類別上的 `@Component` 裝飾器中。
其他重要的中繼資料則位於 [`@NgModule`](guide/ngmodules) 裝飾器中。

最重要的 `@NgModule` 裝飾器標註了最上層的 **AppModule** 類別。

Angular CLI 在建立專案時，於 `src/app/app.module.ts` 中產生了一個 `AppModule` 類別。
這就是你_選擇加入_ `FormsModule` 的地方。

### 匯入 _FormsModule_

開啟 `AppModule`（`app.module.ts`），從 `@angular/forms` 程式庫匯入 `FormsModule` 符號。

<code-example path="toh-pt1/src/app/app.module.ts" header="app.module.ts (FormsModule symbol import)"
 region="formsmodule-js-import">
</code-example>

接著把 `FormsModule` 加到 `@NgModule` 中繼資料的 `imports` 陣列中，該陣列包含應用程式所需的外部模組清單。

<code-example path="toh-pt1/src/app/app.module.ts" header="app.module.ts ( @NgModule imports)"
region="ng-imports">
</code-example>

當瀏覽器重新整理時，應用程式應該會再度正常運作。你可以編輯英雄的名稱，並立即在文字方塊上方的 `<h2>` 中看到變更反映出來。

### 宣告 _HeroesComponent_

每個元件都必須在_恰好一個_ [NgModule](guide/ngmodules) 中宣告。

_你_並沒有宣告 `HeroesComponent`。
所以為什麼應用程式還能運作？

它能運作是因為 Angular CLI 在產生該元件時，就在 `AppModule` 中宣告了 `HeroesComponent`。

開啟 `src/app/app.module.ts`，在靠近檔案上方處找到匯入的 `HeroesComponent`。
<code-example path="toh-pt1/src/app/app.module.ts" region="heroes-import" >
</code-example>

`HeroesComponent` 是在 `@NgModule.declarations` 陣列中宣告的。
<code-example path="toh-pt1/src/app/app.module.ts" region="declarations">
</code-example>

請注意，`AppModule` 宣告了這兩個應用程式元件：`AppComponent` 與 `HeroesComponent`。


## 最終程式碼檢閱

你的應用程式應該像這樣 <live-example></live-example>。以下是本頁討論過的程式碼檔案。

<code-tabs>

  <code-pane header="src/app/heroes/heroes.component.ts" path="toh-pt1/src/app/heroes/heroes.component.ts">
  </code-pane>

  <code-pane header="src/app/heroes/heroes.component.html" path="toh-pt1/src/app/heroes/heroes.component.html">
  </code-pane>

  <code-pane header="src/app/app.module.ts" 
  path="toh-pt1/src/app/app.module.ts">
  </code-pane>

  <code-pane header="src/app/app.component.ts" path="toh-pt1/src/app/app.component.ts">
  </code-pane>

  <code-pane header="src/app/app.component.html" path="toh-pt1/src/app/app.component.html">
  </code-pane>

  <code-pane header="src/app/hero.ts" 
  path="toh-pt1/src/app/hero.ts">
  </code-pane>

</code-tabs>

## 摘要

* 你使用 CLI 建立了第二個 `HeroesComponent`。
* 你把 `HeroesComponent` 加到 `AppComponent` 殼層中來顯示它。
* 你套用 `UppercasePipe` 來格式化名稱。
* 你使用 `ngModel` 指令進行雙向資料繫結。
* 你了解了 `AppModule`。
* 你在 `AppModule` 中匯入了 `FormsModule`，讓 Angular 能夠辨識並套用 `ngModel` 指令。
* 你了解了在 `AppModule` 中宣告元件的重要性，
也體會到 CLI 已替你宣告的便利。
