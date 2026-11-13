# 建立功能元件

目前，`HeroesComponent` 同時顯示英雄清單與所選英雄的詳細資料。

隨著應用程式成長，把所有功能都放在一個元件裡將無法維持可維護性。
你會想要把大型元件拆成較小的子元件，每個子元件專注於特定的任務或工作流程。

在本頁中，你將朝這個方向踏出第一步，把英雄詳細資料移到一個獨立、可重複使用的 `HeroDetailComponent`。

`HeroesComponent` 將只呈現英雄清單。
`HeroDetailComponent` 將呈現所選英雄的詳細資料。

<div class="alert is-helpful">

  關於本頁所述的範例應用程式，請參閱 <live-example></live-example>。

</div>

## 建立 `HeroDetailComponent`

使用 Angular CLI 產生一個名為 `hero-detail` 的新元件。

<code-example language="sh">
  ng generate component hero-detail
</code-example>

此命令會建立以下骨架：

* 在 `src/app/hero-detail` 建立一個目錄。

在該目錄內會產生四個檔案：

* 元件樣式的 CSS 檔案。
* 元件範本的 HTML 檔案。
* 一個 TypeScript 檔案，內含名為 `HeroDetailComponent` 的元件類別。
* 一個 `HeroDetailComponent` 類別的測試檔案。

此命令也會在 `src/app/app.module.ts` 檔案的 `@NgModule` 裝飾器中，把 `HeroDetailComponent` 加入宣告。


### 撰寫範本

把英雄詳細資料的 HTML 從 `HeroesComponent` 範本底部剪下，貼到產生的樣板內容上，覆蓋 `HeroDetailComponent` 範本原有內容。

貼上的 HTML 參照了 `selectedHero`。
新的 `HeroDetailComponent` 可以呈現_任何_英雄，而不只是所選的英雄。
所以請在範本中把所有 "selectedHero" 取代為 "hero"。

完成後，`HeroDetailComponent` 範本應如下所示：

<code-example path="toh-pt3/src/app/hero-detail/hero-detail.component.html" header="src/app/hero-detail/hero-detail.component.html"></code-example>

### 加入 `@Input()` hero 屬性

`HeroDetailComponent` 範本會繫結到元件的 `hero` 屬性，
該屬性是 `Hero` 型別。

開啟 `HeroDetailComponent` 類別檔案並匯入 `Hero` 符號。

<code-example path="toh-pt3/src/app/hero-detail/hero-detail.component.ts"
region="import-hero" header="src/app/hero-detail/hero-detail.component.ts (import Hero)">
</code-example>

`hero` 屬性
[必須是 _Input_ 屬性](guide/inputs-outputs "Input and Output properties")，
並以 `@Input()` 裝飾器標註，
因為_外部_的 `HeroesComponent` [將像這樣繫結到它](#heroes-component-template)。

<code-example path="toh-pt3/src/app/heroes/heroes.component.html" region="hero-detail-binding">
</code-example>

修改 `@angular/core` 的匯入陳述式，加入 `Input` 符號。

<code-example path="toh-pt3/src/app/hero-detail/hero-detail.component.ts" region="import-input" header="src/app/hero-detail/hero-detail.component.ts (import Input)"></code-example>

加入 `hero` 屬性，並在前面加上 `@Input()` 裝飾器。

<code-example path="toh-pt3/src/app/hero-detail/hero-detail.component.ts" header="src/app/hero-detail/hero-detail.component.ts" region="input-hero"></code-example>

這是你唯一需要對 `HeroDetailComponent` 類別做的變更。
沒有其他屬性，也沒有呈現邏輯。
這個元件只會透過 `hero` 屬性接收一個英雄物件並顯示它。

## 顯示 `HeroDetailComponent`

在你移除範本中那部分的內容之前，`HeroesComponent` 原本會自行顯示英雄詳細資料。
本節會引導你把邏輯委派給 `HeroDetailComponent`。

這兩個元件具有父子關係。
父元件 `HeroesComponent` 會控制子元件 `HeroDetailComponent`，
在使用者從清單中選取英雄時，隨時傳送新的英雄給它顯示。

你不會變更 `HeroesComponent` _類別_，但會變更它的_範本_。

{@a heroes-component-template}

### 更新 `HeroesComponent` 範本

`HeroDetailComponent` 的選取器是 `'app-hero-detail'`。
請在 `HeroesComponent` 範本底部附近、英雄詳細檢視原本所在的位置，加入一個 `<app-hero-detail>` 元素。

像這樣把 `HeroesComponent.selectedHero` 繫結到該元素的 `hero` 屬性。

<code-example path="toh-pt3/src/app/heroes/heroes.component.html" region="hero-detail-binding" header="heroes.component.html (HeroDetail binding)">

</code-example>

`[hero]="selectedHero"` 是 Angular 的[屬性繫結](guide/property-binding)。

這是從
`HeroesComponent` 的 `selectedHero` 屬性到目標元素的 `hero` 屬性（對應到 `HeroDetailComponent` 的 `hero` 屬性）的_單向_資料繫結。

現在當使用者在清單中點選英雄時，`selectedHero` 就會變更。
當 `selectedHero` 變更時，_屬性繫結_會更新 `hero`，
而 `HeroDetailComponent` 就會顯示新的英雄。

修改後的 `HeroesComponent` 範本應如下所示：

<code-example path="toh-pt3/src/app/heroes/heroes.component.html"
  header="heroes.component.html"></code-example>

瀏覽器會重新整理，應用程式會像之前一樣重新開始運作。

## 變更了什麼？

如同[前面](tutorial/toh-pt2)所述，每當使用者點選英雄名稱，
英雄詳細資料就會出現在英雄清單下方。
現在改由 `HeroDetailComponent` 來呈現這些詳細資料，而不是 `HeroesComponent`。

把原本的 `HeroesComponent` 重構成兩個元件，無論現在或未來都有好處：

1. 你減少了 `HeroesComponent` 的職責。

1. 你可以把 `HeroDetailComponent` 演進為功能豐富的英雄編輯器，
而不需動到父元件 `HeroesComponent`。

1. 你可以演進 `HeroesComponent`，而不需動到英雄詳細檢視。

1. 你可以在未來某個元件的範本中重複使用 `HeroDetailComponent`。

## 最終程式碼檢閱

以下是本頁討論過的程式碼檔案。

<code-tabs>

  <code-pane header="src/app/hero-detail/hero-detail.component.ts" path="toh-pt3/src/app/hero-detail/hero-detail.component.ts">
  </code-pane>

  <code-pane header="src/app/hero-detail/hero-detail.component.html" path="toh-pt3/src/app/hero-detail/hero-detail.component.html">
  </code-pane>

  <code-pane header="src/app/heroes/heroes.component.html" path="toh-pt3/src/app/heroes/heroes.component.html">
  </code-pane>

  <code-pane header="src/app/app.module.ts" path="toh-pt3/src/app/app.module.ts">
  </code-pane>

</code-tabs>

## 摘要

* 你建立了一個獨立、可重複使用的 `HeroDetailComponent`。


* 你使用[屬性繫結](guide/property-binding)，讓父元件 `HeroesComponent` 能控制子元件 `HeroDetailComponent`。


* 你使用 [`@Input` 裝飾器](guide/inputs-outputs)，
讓 `hero` 屬性可供
外部的 `HeroesComponent` 繫結。
