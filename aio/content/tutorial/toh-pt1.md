# 英雄編輯器

應用程式現在已經有一個基本標題。
接下來，建立一個新的元件來顯示英雄資訊，並把這個元件放入應用程式殼層中。

<div class="alert is-helpful">

本頁說明的範例應用程式，請參閱 <live-example></live-example>。

</div>

## 建立 heroes 元件

使用 `ng generate` 建立一個名為 `heroes` 的新元件。

<code-example format="shell" language="shell">

ng generate component heroes

</code-example>

`ng generate` 會建立一個新目錄 `src/app/heroes/`，並產生 `HeroesComponent` 的三個檔案以及一個測試檔案。

`HeroesComponent` 類別檔案如下：

<code-example header="app/heroes/heroes.component.ts (initial version)" path="toh-pt1/src/app/heroes/heroes.component.ts" region="v1"></code-example>

你一律要從 Angular 核心程式庫匯入 `Component` 符號，並以 `@Component` 標註元件類別。

`@Component` 是一個裝飾器函式，用來指定這個元件的 Angular 中繼資料。

`ng generate` 建立了三個中繼資料屬性：

| 屬性    | 說明 |
|:---           |:---     |
| `selector`    | 這個元件的 CSS 元素選取器。               |
| `templateUrl` | 這個元件的範本檔案位置。      |
| `styleUrls`   | 這個元件專用 CSS 樣式的位置。 |

<a id="selector"></a>

[CSS 元素選取器](https://developer.mozilla.org/docs/Web/CSS/Type_selectors) `'app-heroes'` 會對應到 HTML 元素的名稱，這個元素會在父元件的範本中識別這個元件。

`ngOnInit()` 是一個[生命週期鉤子](guide/lifecycle-hooks#oninit)。
Angular 會在建立元件後不久呼叫 `ngOnInit()`。
這是放置初始化邏輯的好地方。

一律要 `export` 元件類別，這樣你才能在其他地方 `import` 它，例如在 `AppModule` 中。

### 加入 `hero` 屬性

為名叫 `Windstorm` 的英雄，在 `HeroesComponent` 中加入一個 `hero` 屬性。

<code-example header="heroes.component.ts (hero property)" path="toh-pt1/src/app/heroes/heroes.component.ts" region="add-hero"></code-example>

### 顯示英雄

開啟 `heroes.component.html` 範本檔案。
刪除 `ng generate` 建立的預設文字，改為對新的 `hero` 屬性進行資料繫結。

<code-example header="heroes.component.html" path="toh-pt1/src/app/heroes/heroes.component.1.html" region="show-hero-1"></code-example>

## 顯示 `HeroesComponent` 檢視

要顯示 `HeroesComponent`，你必須把它加到殼層 `AppComponent` 的範本中。

別忘了 `app-heroes` 是 `HeroesComponent` 的[元素選取器](#selector)。
在 `AppComponent` 範本檔案中，於標題正下方加入一個 `<app-heroes>` 元素。

<code-example header="src/app/app.component.html" path="toh-pt1/src/app/app.component.html"></code-example>

如果 `ng serve` 還在執行，
瀏覽器應該會重新整理，同時顯示應用程式標題與英雄的名稱。

## 建立 `Hero` 介面

真正的英雄不只有名字。

在 `src/app` 目錄中建立一個獨立檔案，定義 `Hero` 介面。
為它加上 `id` 與 `name` 屬性。

<code-example path="toh-pt1/src/app/hero.ts"  header="src/app/hero.ts"></code-example>

回到 `HeroesComponent` 類別，匯入 `Hero` 介面。

把元件的 `hero` 屬性重構為 `Hero` 型別。
以 `id` 為 `1`、名稱為 `Windstorm` 來初始化它。

修改後的 `HeroesComponent` 類別檔案應該會像這樣：

<code-example header="src/app/heroes/heroes.component.ts" path="toh-pt1/src/app/heroes/heroes.component.ts"></code-example>

頁面現在無法正常顯示，因為你把英雄從字串改成了物件。

## 顯示英雄物件

更新範本中的繫結，來宣告英雄的名稱，並在詳細資料顯示區中同時顯示 `id` 與 `name`，如下所示：

<code-example header="heroes.component.html (HeroesComponent template)" path="toh-pt1/src/app/heroes/heroes.component.1.html" region="show-hero-2"></code-example>

瀏覽器會重新整理並顯示英雄的資訊。

## 使用 `UppercasePipe` 格式化

像這樣編輯 `hero.name` 繫結：

<code-example header="src/app/heroes/heroes.component.html" path="toh-pt1/src/app/heroes/heroes.component.html" region="pipe"></code-example>

瀏覽器會重新整理，現在英雄的名稱會以大寫字母顯示。

插值繫結中，管道 <code>&verbar;</code> 字元之後的 `uppercase` 一詞，會啟用內建的 `UppercasePipe`。

[管道](guide/pipes)是格式化字串、貨幣金額、日期與其他顯示資料的好方法。
Angular 內建了數個管道，你也可以建立自己的管道。

## 編輯英雄

使用者應該可以在 `<input>` 文字方塊中編輯英雄的名稱。

文字方塊應該同時*顯示*英雄的 `name` 屬性，並在使用者輸入時*更新*該屬性。
這表示資料會從元件類別*流向畫面*，也會從畫面*流回類別*。

要讓這個資料流自動化，請在 `<input>` 表單元素與 `hero.name` 屬性之間設定雙向資料繫結。

### 雙向繫結

重構 `HeroesComponent` 範本中的詳細資料區域，讓它看起來像這樣：

<code-example header="src/app/heroes/heroes.component.html (HeroesComponent's template)" path="toh-pt1/src/app/heroes/heroes.component.1.html" region="name-input"></code-example>

`[(ngModel)]` 是 Angular 的雙向資料繫結語法。

在這裡，它把 `hero.name` 屬性繫結到 HTML 文字方塊，讓資料可以*雙向*流動。
資料可以從 `hero.name` 屬性流向文字方塊，也可以從文字方塊流回 `hero.name`。

### 缺少的 `FormsModule`

請注意，加入 `[(ngModel)]` 後，應用程式就停止運作了。

要查看錯誤，請開啟瀏覽器的開發人員工具，在主控台中
尋找類似以下的訊息

<code-example format="output" hideCopy language="shell">

Template parse errors:
Can't bind to 'ngModel' since it isn't a known property of 'input'.

</code-example>

雖然 `ngModel` 是有效的 Angular 指令，但預設並不提供。

它屬於選用的 `FormsModule`，你必須*選擇加入*才能使用它。

## `AppModule`

Angular 需要知道你的應用程式各部分如何組合在一起，以及應用程式還需要哪些其他檔案與程式庫。
這些資訊稱為*中繼資料*。

部分中繼資料位於你加到元件類別上的 `@Component` 裝飾器中。
其他重要的中繼資料則位於 [`@NgModule`](guide/ngmodules) 裝飾器中。

最重要的 `@NgModule` 裝飾器標註了最上層的 **AppModule** 類別。

`ng new` 在建立專案時，於 `src/app/app.module.ts` 中建立了一個 `AppModule` 類別。
這就是你*選擇加入* `FormsModule` 的地方。

### 匯入 `FormsModule`

開啟 `app.module.ts`，從 `@angular/forms` 程式庫匯入 `FormsModule` 符號。

<code-example path="toh-pt1/src/app/app.module.ts" header="app.module.ts (FormsModule symbol import)"
 region="formsmodule-js-import"></code-example>

把 `FormsModule` 加到 `@NgModule` 的 `imports` 陣列中。
`imports` 陣列包含應用程式所需的外部模組清單。

<code-example header="app.module.ts (@NgModule imports)" path="toh-pt1/src/app/app.module.ts" region="ng-imports"></code-example>

當瀏覽器重新整理時，應用程式應該會再度正常運作。
你可以編輯英雄的名稱，並立即在文字方塊上方的 `<h2>` 中看到變更反映出來。

### 宣告 `HeroesComponent`

每個元件都必須在*恰好一個* [NgModule](guide/ngmodules) 中宣告。

*你*並沒有宣告 `HeroesComponent`。
為什麼應用程式還能運作？

它能運作是因為 `ng generate` 在建立該元件時，就在 `AppModule` 中宣告了 `HeroesComponent`。

開啟 `src/app/app.module.ts`，在靠近檔案上方處找到匯入的 `HeroesComponent`。

<code-example path="toh-pt1/src/app/app.module.ts" header="src/app/app.module.ts" region="heroes-import" ></code-example>

`HeroesComponent` 是在 `@NgModule.declarations` 陣列中宣告的。

<code-example header="src/app/app.module.ts" path="toh-pt1/src/app/app.module.ts" region="declarations"></code-example>

<div class="alert is-helpful">

`AppModule` 宣告了這兩個應用程式元件：`AppComponent` 與 `HeroesComponent`。

</div>

## 最終程式碼檢閱

以下是本頁討論過的程式碼檔案。

<code-tabs>
    <code-pane header="src/app/heroes/heroes.component.ts" path="toh-pt1/src/app/heroes/heroes.component.ts"></code-pane>
    <code-pane header="src/app/heroes/heroes.component.html" path="toh-pt1/src/app/heroes/heroes.component.html"></code-pane>
    <code-pane header="src/app/app.module.ts" path="toh-pt1/src/app/app.module.ts"></code-pane>
    <code-pane header="src/app/app.component.ts" path="toh-pt1/src/app/app.component.ts"></code-pane>
    <code-pane header="src/app/app.component.html" path="toh-pt1/src/app/app.component.html"></code-pane>
    <code-pane header="src/app/hero.ts" path="toh-pt1/src/app/hero.ts"></code-pane>
</code-tabs>

## 摘要

*   你使用 `ng generate` 建立了第二個 `HeroesComponent`。
*   你把 `HeroesComponent` 加到 `AppComponent` 殼層中來顯示它。
*   你套用 `UppercasePipe` 來格式化名稱。
*   你使用 `ngModel` 指令進行雙向資料繫結。
*   你了解了 `AppModule`。
*   你在 `AppModule` 中匯入了 `FormsModule`，讓 Angular 能夠辨識並套用 `ngModel` 指令。
*   你了解了在 `AppModule` 中宣告元件的重要性。

@reviewed 2022-02-28
