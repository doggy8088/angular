# 元件互動

{@a top}

這本食譜包含常見元件通訊情境的作法，
情境中有兩個以上的元件會共享資訊。
{@a toc}

<!--

# Contents

* [Pass data from parent to child with input binding](guide/component-interaction#parent-to-child)
* [Intercept input property changes with a setter](guide/component-interaction#parent-to-child-setter)
* [Intercept input property changes with `ngOnChanges()`](guide/component-interaction#parent-to-child-on-changes)
* [Parent calls an `@ViewChild()`](guide/component-interaction#parent-to-view-child)
* [Parent and children communicate via a service](guide/component-interaction#bidirectional-service)

-->

**請參閱 <live-example name="component-interaction"></live-example>**。

{@a parent-to-child}

## 用輸入繫結把資料從父元件傳到子元件

`HeroChildComponent` 有兩個 ***輸入屬性***，
通常會加上 [@Input 裝飾](guide/template-syntax#inputs-outputs)修飾。

<code-example path="component-interaction/src/app/hero-child.component.ts" header="component-interaction/src/app/hero-child.component.ts">

</code-example>

第二個 `@Input` 會把子元件屬性名稱 `masterName` 取別名為 `'master'`。

`HeroParentComponent` 把子元件 `HeroChildComponent` 嵌在 `*ngFor` 重複器裡面，
把它的 `master` 字串屬性繫結到子元件的 `master` 別名，
並把每次迭代的 `hero` 實例繫結到子元件的 `hero` 屬性。

<code-example path="component-interaction/src/app/hero-parent.component.ts" header="component-interaction/src/app/hero-parent.component.ts">

</code-example>

執行中的應用程式會顯示三位英雄：

<figure class="lightbox">
  <div class="card">
    <img src="generated/images/guide/component-interaction/parent-to-child.png" alt="父元件到子元件">
  </div>
</figure>

<h3 class="no-toc">測試</h3>

E2E 測試所有子元件是否如預期實例化並顯示：

<code-example path="component-interaction/e2e/src/app.e2e-spec.ts" region="parent-to-child" header="component-interaction/e2e/src/app.e2e-spec.ts">

</code-example>

[回到頂端](guide/component-interaction#top)

{@a parent-to-child-setter}

## 用 setter 攔截輸入屬性變更

使用輸入屬性 setter 來攔截並處理來自父元件的值。

子元件 `NameChildComponent` 中 `name` 輸入屬性的 setter
會修剪名稱前後的空白，並把空值換成預設文字。

<code-example path="component-interaction/src/app/name-child.component.ts" header="component-interaction/src/app/name-child.component.ts">

</code-example>

以下是展示名稱變化（包括全是空白的名稱）的 `NameParentComponent`：

<code-example path="component-interaction/src/app/name-parent.component.ts" header="component-interaction/src/app/name-parent.component.ts">

</code-example>

<figure class="lightbox">
  <div class="card">
    <img src="generated/images/guide/component-interaction/setter.png" alt="父元件到子元件（setter）">
  </div>
</figure>

<h3 class="no-toc">測試</h3>

使用空名稱與非空名稱測試輸入屬性 setter 的 E2E 測試：

<code-example path="component-interaction/e2e/src/app.e2e-spec.ts" region="parent-to-child-setter" header="component-interaction/e2e/src/app.e2e-spec.ts">

</code-example>

[回到頂端](guide/component-interaction#top)

{@a parent-to-child-on-changes}

## 用 *ngOnChanges()* 攔截輸入屬性變更

使用 `OnChanges` 生命週期鉤子介面的 `ngOnChanges()` 方法，偵測輸入屬性值的變更並採取行動。

<div class="alert is-helpful">

當你要監看多個互相影響的輸入屬性時，你可能會偏好這種做法，而不是使用屬性 setter。

請參閱 [Lifecycle Hooks](guide/lifecycle-hooks) 章節，了解 `ngOnChanges()`。

</div>

這個 `VersionChildComponent` 會偵測 `major` 與 `minor` 輸入屬性的變更，並組成回報這些變更的日誌訊息：

<code-example path="component-interaction/src/app/version-child.component.ts" header="component-interaction/src/app/version-child.component.ts">

</code-example>

`VersionParentComponent` 會提供 `minor` 與 `major` 值，並把按鈕繫結到會變更它們的方法。

<code-example path="component-interaction/src/app/version-parent.component.ts" header="component-interaction/src/app/version-parent.component.ts">

</code-example>

以下是一連串按鈕操作的輸出：

<figure class="lightbox">
  <div class="card">
    <img src="generated/images/guide/component-interaction/parent-to-child-on-changes.gif" alt="父元件到子元件（onChanges）">
  </div>
</figure>

<h3 class="no-toc">測試</h3>

測試***兩個***輸入屬性一開始都有設定，且按鈕點擊會觸發
預期的 `ngOnChanges` 呼叫與值：

<code-example path="component-interaction/e2e/src/app.e2e-spec.ts" region="parent-to-child-onchanges" header="component-interaction/e2e/src/app.e2e-spec.ts">

</code-example>

[回到頂端](guide/component-interaction#top)

{@a child-to-parent}

## 父元件監聽子元件事件

子元件會公開一個 `EventEmitter` 屬性，當發生某些事情時，它會用這個屬性 `emits`（發出）事件。
父元件會繫結到該事件屬性，並對這些事件做出反應。

子元件的 `EventEmitter` 屬性是一個***輸出屬性***，
  通常會加上 [@Output 裝飾](guide/template-syntax#inputs-outputs)修飾，
  如這個 `VoterComponent` 所示：

<code-example path="component-interaction/src/app/voter.component.ts" header="component-interaction/src/app/voter.component.ts">

</code-example>

點擊按鈕會觸發發出 `true` 或 `false`，也就是布林 *payload*（酬載）。

父元件 `VoteTakerComponent` 會繫結一個名為 `onVoted()` 的事件處理常式，來回應子元件事件
酬載 `$event` 並更新計數器。

<code-example path="component-interaction/src/app/votetaker.component.ts" header="component-interaction/src/app/votetaker.component.ts">

</code-example>

框架會把事件引數&mdash;以 `$event` 表示&mdash;傳給處理方法，
再由該方法處理：

<figure class="lightbox">
  <div class="card">
    <img src="generated/images/guide/component-interaction/child-to-parent.gif" alt="子元件到父元件">
  </div>
</figure>

<h3 class="no-toc">測試</h3>

測試點擊 *Agree* 與 *Disagree* 按鈕是否會更新對應的計數器：

<code-example path="component-interaction/e2e/src/app.e2e-spec.ts" region="child-to-parent" header="component-interaction/e2e/src/app.e2e-spec.ts">

</code-example>

[回到頂端](guide/component-interaction#top)

## 父元件使用*區域變數*與子元件互動

父元件無法使用資料繫結來讀取子元件屬性
或呼叫子元件方法。請為子元素建立一個範本參照變數，
再*在父範本內*參照該變數，即可同時做到這兩件事，
如下列範例所示。

{@a countdown-timer-example}
以下是一個子元件 `CountdownTimerComponent`，它會重複倒數到零並發射火箭。
`start` 與 `stop` 方法控制時鐘，
倒數狀態訊息會顯示在它自己的範本中。

<code-example path="component-interaction/src/app/countdown-timer.component.ts" header="component-interaction/src/app/countdown-timer.component.ts">

</code-example>

裝載計時器元件的 `CountdownLocalVarParentComponent` 如下：

<code-example path="component-interaction/src/app/countdown-parent.component.ts" region="lv" header="component-interaction/src/app/countdown-parent.component.ts">

</code-example>

父元件無法對子元件的
`start` 與 `stop` 方法或 `seconds` 屬性進行資料繫結。

在代表子元件的 `<countdown-timer>` 標籤上放置一個區域變數 `#timer`。
這樣你就能取得子元件的參照，並
從父範本內存取它的*任何屬性或方法*。

這個範例會把父元件按鈕接到子元件的 `start` 與 `stop`，
並使用插值來顯示子元件的 `seconds` 屬性。

在這裡，可以看到父元件與子元件共同運作。

<figure class="lightbox">
  <div class="card">
    <img src="generated/images/guide/component-interaction/countdown-timer-anim.gif" alt="倒數計時器">
  </div>
</figure>

{@a countdown-tests}

<h3 class="no-toc">測試</h3>

測試父範本中顯示的秒數，
是否與子元件狀態訊息中顯示的秒數相符。
同時測試點擊 *Stop* 按鈕是否會暫停倒數計時器：

<code-example path="component-interaction/e2e/src/app.e2e-spec.ts" region="countdown-timer-tests" header="component-interaction/e2e/src/app.e2e-spec.ts">

</code-example>

[回到頂端](guide/component-interaction#top)

{@a parent-to-view-child}

## 父元件呼叫 _@ViewChild()_

*區域變數*做法簡單又容易。但它有限制，因為
父子元件之間的接線必須完全在父範本內完成。
父元件*本身*無法存取子元件。

如果父元件*類別*的實例必須讀取或寫入子元件的值，或必須呼叫子元件的方法，你就無法使用*區域變數*技巧。

當父元件*類別*需要這種存取方式時，
請把子元件***注入***父元件，作為一個 *ViewChild*。

下列範例用相同的
[倒數計時器](guide/component-interaction#countdown-timer-example)範例來說明這個技巧。
它的外觀與行為都不會改變。
子元件 [CountdownTimerComponent](guide/component-interaction#countdown-timer-example) 也相同。

<div class="alert is-helpful">

從 *local variable* 切換到 *ViewChild* 技巧，
純粹是為了示範。

</div>

以下是父元件 `CountdownViewChildParentComponent`：

<code-example path="component-interaction/src/app/countdown-parent.component.ts" region="vc" header="component-interaction/src/app/countdown-parent.component.ts">

</code-example>

要把子檢視放進父元件*類別*中，需要多花一點功夫。

首先，你必須匯入 `ViewChild` 裝飾器與 `AfterViewInit` 生命週期鉤子的參照。

接著，使用 `@ViewChild` 屬性裝飾，把子元件 `CountdownTimerComponent` 注入私有的 `timerComponent` 屬性。

元件詮釋資料中不再有 `#timer` 區域變數。
取而代之的是，把按鈕繫結到父元件自己的 `start` 與 `stop` 方法，並
在父元件 `seconds` 方法周圍用插值呈現不斷跳動的秒數。

這些方法會直接存取注入的計時器元件。

`ngAfterViewInit()` 生命週期鉤子是一個重要的細節。
計時器元件要等到 Angular 顯示父檢視*之後*才可用。
所以一開始會顯示 `0` 秒。

接著 Angular 會呼叫 `ngAfterViewInit` 生命週期鉤子，這時要更新父檢視中倒數秒數的顯示已經*太遲*了。
Angular 的單向資料流規則會阻止在同一個週期內更新父檢視。
應用程式必須先*等一輪*，才能顯示秒數。

使用 `setTimeout()` 等待一個 tick，再修改 `seconds()` 方法，
讓它從計時器元件取得未來的數值。

<h3 class="no-toc">測試</h3>

使用與之前相同的[倒數計時器測試](guide/component-interaction#countdown-tests)。

[回到頂端](guide/component-interaction#top)

{@a bidirectional-service}

## 父元件與子元件使用服務溝通

父元件與其子元件會共享一個服務，該服務的介面支援在*家族內*進行雙向溝通。

服務實例的作用範圍是父元件與其子元件。
這個元件子樹之外的元件無法存取該服務或它們之間的通訊。

這個 `MissionService` 會把 `MissionControlComponent` 連接到多個 `AstronautComponent` 子元件。

<code-example path="component-interaction/src/app/mission.service.ts" header="component-interaction/src/app/mission.service.ts">

</code-example>

`MissionControlComponent` 既提供它與子元件共享的服務實例
（透過 `providers` 詮釋資料陣列），也透過自己的建構子注入該實例：

<code-example path="component-interaction/src/app/missioncontrol.component.ts" header="component-interaction/src/app/missioncontrol.component.ts">

</code-example>

`AstronautComponent` 也會在建構子中注入該服務。
每個 `AstronautComponent` 都是 `MissionControlComponent` 的子元件，因此會收到父元件的服務實例：

<code-example path="component-interaction/src/app/astronaut.component.ts" header="component-interaction/src/app/astronaut.component.ts">

</code-example>

<div class="alert is-helpful">

請注意，這個範例會在 `AstronautComponent` 被銷毀時擷取 `subscription` 並呼叫 `unsubscribe()`。
這是一個防止記憶體洩漏的防護步驟。在這個應用程式中其實沒有風險，因為
`AstronautComponent` 的生命週期與應用程式本身的生命週期相同。
但在更複雜的應用程式中，情況*不一定*如此。

你不需要在 `MissionControlComponent` 上加入這個防護，因為身為父元件，
它控制著 `MissionService` 的生命週期。

</div>

*History* 日誌展示了訊息如何在
父元件 `MissionControlComponent` 與 `AstronautComponent` 子元件之間雙向傳遞，
並由該服務促成：

<figure class="lightbox">
  <div class="card">
    <img src="generated/images/guide/component-interaction/bidirectional-service.gif" alt="雙向服務">
  </div>
</figure>

<h3 class="no-toc">測試</h3>

測試會點擊父元件 `MissionControlComponent` 與 `AstronautComponent` 子元件的按鈕，
並驗證歷史紀錄符合預期：

<code-example path="component-interaction/e2e/src/app.e2e-spec.ts" region="bidirectional-service" header="component-interaction/e2e/src/app.e2e-spec.ts">

</code-example>

[回到頂端](guide/component-interaction#top)
