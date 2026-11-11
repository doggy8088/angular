# 從 Angular Animations 套件遷移

`@angular/animations` 套件自 v20.2 起已棄用，該版本同時引入了新的 `animate.enter` 與 `animate.leave` 功能，讓你為應用程式加入動畫。運用這些新功能，你可以把所有以 `@angular/animations` 為基礎的動畫，改為純 CSS 或 JS 動畫函式庫。從應用程式移除 `@angular/animations`，能顯著縮小 JavaScript 套件包的大小。原生 CSS 動畫通常能提供更優異的效能，因為它們可以受益於硬體加速。本指南將帶你走過把程式碼從 `@angular/animations` 重構為原生 CSS 動畫的過程。

## 如何用原生 CSS 撰寫動畫

若你從未寫過任何原生 CSS 動畫，有許多優秀的指南可以帶你入門。以下列出幾篇：  
[MDN 的 CSS Animations 指南](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_animations/Using_CSS_animations)  
[W3Schools CSS3 Animations 指南](https://www.w3schools.com/css/css3_animations.asp)  
[The Complete CSS Animations Tutorial](https://www.lambdatest.com/blog/css-animations-tutorial/)  
[CSS Animation for Beginners](https://thoughtbot.com/blog/css-animation-for-beginners)

以及幾部影片：  
[Learn CSS Animation in 9 Minutes](https://www.youtube.com/watch?v=z2LQYsZhsFw)  
[Net Ninja CSS Animation Tutorial Playlist](https://www.youtube.com/watch?v=jgw82b5Y2MU&list=PL4cUxeGkcC9iGYgmEd2dm3zAKzyCGDtM5)

先看看其中一些指南與教學，再回來繼續閱讀本指南。

## 建立可重複使用的動畫

就和 animations 套件一樣，你可以建立可在整個應用程式共用的可重複使用動畫。animations 套件的版本是讓你在共用的 TypeScript 檔案中使用 `animation()` 函式。原生 CSS 的版本與此類似，但放在共用的 CSS 檔案中。

#### 使用 Animations 套件

<docs-code header="animations.ts" path="adev/src/content/examples/animations/src/app/animations.1.ts" visibleRegion="animation-example"/>

#### 使用原生 CSS

<docs-code header="animations.css" path="adev/src/content/examples/animations/src/app/animations.css" visibleRegion="animation-shared"/>

把 `animated-class` 類別加到元素上，就會觸發該元素的動畫。

## 為轉場加入動畫

### 為狀態與樣式加入動畫

animations 套件讓你能在元件內使用 [`state()`](api/animations/state) 函式定義各種狀態。範例可能是 `open` 或 `closed` 狀態，定義中包含各自狀態的樣式。例如：

#### 使用 Animations 套件

<docs-code header="open-close.component.ts" path="adev/src/content/examples/animations/src/app/open-close.component.ts" visibleRegion="state1"/>

同樣的行為也可以用原生方式達成：使用 CSS 類別，搭配關鍵影格動畫或轉場樣式。

#### 使用原生 CSS

<docs-code header="animations.css" path="adev/src/content/examples/animations/src/app/animations.css" visibleRegion="animation-states"/>

觸發 `open` 或 `closed` 狀態的方法，是在元件中切換元素上的類別。你可以在我們的[範本指南](guide/templates/binding#css-class-and-style-property-bindings)中找到做法範例。

範本指南中也有[直接為樣式加入動畫](guide/templates/binding#css-style-properties)的類似範例。

### 轉場、時間與緩動

animations 套件的 `animate()` 函式允許提供時間資訊，例如持續時間、延遲與緩動。這可以用 CSS 原生達成，使用多個 CSS 屬性或簡寫屬性即可。

在 CSS 中為關鍵影格動畫指定 `animation-duration`、`animation-delay` 與 `animation-timing-function`，或改用 `animation` 簡寫屬性。

<docs-code header="animations.css" path="adev/src/content/examples/animations/src/app/animations.css" visibleRegion="animation-timing"/>

同樣地，對於不使用 `@keyframes` 的動畫，你可以使用 `transition-duration`、`transition-delay`、`transition-timing-function` 以及 `transition` 簡寫屬性。

<docs-code header="animations.css" path="adev/src/content/examples/animations/src/app/animations.css" visibleRegion="transition-timing"/>

### 觸發動畫

animations 套件要求使用 `trigger()` 函式指定觸發器，並把所有狀態都巢狀放在其中。使用原生 CSS 時，這就不必要了。只要切換 CSS 樣式或類別，就能觸發動畫。當類別出現在元素上時，動畫就會發生。移除類別後，元素會還原為該元素所定義的 CSS。這讓完成相同動畫所需的程式碼顯著減少。以下是一個範例：

#### 使用 Animations 套件

<docs-code-multifile>
    <docs-code header="open-close.component.ts" path="adev/src/content/examples/animations/src/app/animations-package/open-close.component.ts" />
    <docs-code header="open-close.component.html" path="adev/src/content/examples/animations/src/app/animations-package/open-close.component.html" />
    <docs-code header="open-close.component.css" path="adev/src/content/examples/animations/src/app/animations-package/open-close.component.css"/>
</docs-code-multifile>

#### 使用原生 CSS

<docs-code-multifile preview path="adev/src/content/examples/animations/src/app/native-css/open-close.component.ts">
    <docs-code header="open-close.component.ts" path="adev/src/content/examples/animations/src/app/native-css/open-close.component.ts" />
    <docs-code header="open-close.component.html" path="adev/src/content/examples/animations/src/app/native-css/open-close.component.html" />
    <docs-code header="open-close.component.css" path="adev/src/content/examples/animations/src/app/native-css/open-close.component.css"/>
</docs-code-multifile>

## 轉場與觸發器

### 預先定義的狀態與萬用字元比對

animations 套件提供透過字串把你定義的狀態與轉場比對的能力。例如，從開啟到關閉的動畫會是 `open => closed`。你可以使用萬用字元把任何狀態與目標狀態比對，例如 `* => closed`，而 `void` 關鍵字可用於進入與退出狀態。例如：元素離開檢視時用 `* => void`，元素進入檢視時用 `void => *`。

用 CSS 直接製作動畫時，完全不需要這些狀態比對模式。你可以根據你在元素上設定的類別和／或樣式，管理要套用哪些轉場與 `@keyframes` 動畫。你也可以加入 `@starting-style`，控制元素剛進入 DOM 時的外觀。

### 使用萬用字元自動計算屬性

animations 套件提供為歷來難以加入動畫的項目加入動畫的能力，例如把固定高度動畫化為 `height: auto`。現在用純 CSS 也能做到這一點。

#### 使用 Animations 套件

<docs-code-multifile>
    <docs-code header="auto-height.component.ts" path="adev/src/content/examples/animations/src/app/animations-package/auto-height.component.ts" />
    <docs-code header="auto-height.component.html" path="adev/src/content/examples/animations/src/app/animations-package/auto-height.component.html" />
    <docs-code header="auto-height.component.css" path="adev/src/content/examples/animations/src/app/animations-package/auto-height.component.css" />
</docs-code-multifile>

你可以使用 CSS Grid 為自動高度加入動畫。

#### 使用原生 CSS

<docs-code-multifile preview path="adev/src/content/examples/animations/src/app/native-css/auto-height.component.ts">
    <docs-code header="auto-height.component.ts" path="adev/src/content/examples/animations/src/app/native-css/auto-height.component.ts" />
    <docs-code header="auto-height.component.html" path="adev/src/content/examples/animations/src/app/native-css/auto-height.component.html" />
    <docs-code header="auto-height.component.css" path="adev/src/content/examples/animations/src/app/native-css/auto-height.component.css"  />
</docs-code-multifile>

若你不需要顧慮支援所有瀏覽器，也可以看看 `calc-size()`，那是為自動高度加入動畫的真正解法。更多資訊請見 [MDN 的文件](https://developer.mozilla.org/en-US/docs/Web/CSS/calc-size)與[這篇教學](https://frontendmasters.com/blog/one-of-the-boss-battles-of-css-is-almost-won-transitioning-to-auto/)。

### 為進入與離開檢視加入動畫

animations 套件除了提供前面提到的進入與離開模式比對，還包含 `:enter` 與 `:leave` 的簡寫別名。

#### 使用 Animations 套件

<docs-code-multifile>
    <docs-code header="insert-remove.component.ts" path="adev/src/content/examples/animations/src/app/animations-package/insert-remove.component.ts" />
    <docs-code header="insert-remove.component.html" path="adev/src/content/examples/animations/src/app/animations-package/insert-remove.component.html" />
    <docs-code header="insert-remove.component.css" path="adev/src/content/examples/animations/src/app/animations-package/insert-remove.component.css" />
</docs-code-multifile>

以下示範如何不使用 animations 套件、改用 `animate.enter` 達成同樣的效果。

#### 使用原生 CSS

<docs-code-multifile preview path="adev/src/content/examples/animations/src/app/native-css/insert.component.ts">
    <docs-code header="insert.component.ts" path="adev/src/content/examples/animations/src/app/native-css/insert.component.ts" />
    <docs-code header="insert.component.html" path="adev/src/content/examples/animations/src/app/native-css/insert.component.html" />
    <docs-code header="insert.component.css" path="adev/src/content/examples/animations/src/app/native-css/insert.component.css"  />
</docs-code-multifile>

使用 `animate.leave`，為離開檢視的元素加入動畫；它會在元素離開檢視時，將指定的 CSS 類別套用到該元素上。

#### 使用原生 CSS

<docs-code-multifile preview path="adev/src/content/examples/animations/src/app/native-css/remove.component.ts">
    <docs-code header="remove.component.ts" path="adev/src/content/examples/animations/src/app/native-css/remove.component.ts" />
    <docs-code header="remove.component.html" path="adev/src/content/examples/animations/src/app/native-css/remove.component.html" />
    <docs-code header="remove.component.css" path="adev/src/content/examples/animations/src/app/native-css/remove.component.css"  />
</docs-code-multifile>

更多關於 `animate.enter` 與 `animate.leave` 的資訊，請見[進入與離開動畫指南](guide/animations)。

### 為遞增與遞減加入動畫

除了前面提到的 `:enter` 與 `:leave`，還有 `:increment` 與 `:decrement`。你也可以透過加入與移除類別為它們加入動畫。與 animations 套件的內建別名不同，當值上升或下降時，不會自動套用類別。你可以以程式方式套用適當的類別。以下是一個範例：

#### 使用 Animations 套件

<docs-code-multifile>
    <docs-code header="increment-decrement.component.ts" path="adev/src/content/examples/animations/src/app/animations-package/increment-decrement.component.ts" />
    <docs-code header="increment-decrement.component.html" path="adev/src/content/examples/animations/src/app/animations-package/increment-decrement.component.html" />
    <docs-code header="increment-decrement.component.css" path="adev/src/content/examples/animations/src/app/animations-package/increment-decrement.component.css" />
</docs-code-multifile>

#### 使用原生 CSS

<docs-code-multifile preview path="adev/src/content/examples/animations/src/app/native-css/increment-decrement.component.ts">
    <docs-code header="increment-decrement.component.ts" path="adev/src/content/examples/animations/src/app/native-css/increment-decrement.component.ts" />
    <docs-code header="increment-decrement.component.html" path="adev/src/content/examples/animations/src/app/native-css/increment-decrement.component.html" />
    <docs-code header="increment-decrement.component.css" path="adev/src/content/examples/animations/src/app/native-css/increment-decrement.component.css" />
</docs-code-multifile>

### 父／子動畫

與 animations 套件不同，當在指定元件內指定多個動畫時，沒有任何動畫會優先於其他動畫，也沒有任何東西會阻止動畫觸發。任何動畫的順序安排，都必須由你的 CSS 動畫定義來處理，使用 animation／transition 的延遲，和／或使用 `animationend` 或 `transitionend` 來處理加入下一個要動畫化的 CSS。

### 停用單一動畫或所有動畫

使用原生 CSS 動畫時，若你想停用已指定的動畫，有多種做法。

1. 建立一個自訂類別，強制把 animation 與 transition 設為 `none`。

```css
.no-animation {
  animation: none !important;
  transition: none !important;
}
```

把這個類別套用到元素上，就能避免該元素觸發任何動畫。你也可以把作用範圍設定為整個 DOM 或 DOM 的某個區段，來強制這種行為。不過，這會讓動畫事件無法觸發。若你正在等待動畫事件來移除元素，這個做法就行不通。替代方案是把持續時間設為 1 毫秒。

2. 使用 [`prefers-reduced-motion`](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion) media query，確保偏好減少動畫的使用者不會看到動畫播放。

3. 避免以程式方式加入動畫類別

### 動畫回呼

animations 套件提供了回呼，讓你在動畫結束時想做某些事時使用。原生 CSS 動畫也有這些回呼。

[`OnAnimationStart`](https://developer.mozilla.org/en-US/docs/Web/API/Element/animationstart_event)  
[`OnAnimationEnd`](https://developer.mozilla.org/en-US/docs/Web/API/Element/animationend_event)  
[`OnAnimationIteration`](https://developer.mozilla.org/en-US/docs/Web/API/Element/animationitration_event)  
[`OnAnimationCancel`](https://developer.mozilla.org/en-US/docs/Web/API/Element/animationcancel_event)

[`OnTransitionStart`](https://developer.mozilla.org/en-US/docs/Web/API/Element/transitionstart_event)  
[`OnTransitionRun`](https://developer.mozilla.org/en-US/docs/Web/API/Element/transitionrun_event)  
[`OnTransitionEnd`](https://developer.mozilla.org/en-US/docs/Web/API/Element/transitionend_event)  
[`OnTransitionCancel`](https://developer.mozilla.org/en-US/docs/Web/API/Element/transitioncancel_event)

Web Animations API 還提供許多額外功能。[請參閱文件](https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API)，了解所有可用的動畫 API。

NOTE: 使用這些回呼時請注意事件冒泡問題。若你同時為子元素與父元素加入動畫，事件會從子元素向上冒泡到父元素。請考慮停止事件傳播，或查看事件中的更多細節，確認你回應的是想要的事件目標、而不是從子節點冒泡上來的事件。你可以檢查 `animationname` 屬性或正在轉場的屬性，確認處理的是正確的節點。

## 複雜序列

animations 套件內建了建立複雜序列的功能。這些序列在不用 animations 套件的情況下，也完全做得到。

### 鎖定特定元素

在 animations 套件中，你可以使用 `query()` 函式依 CSS 類別名稱尋找特定元素，類似 [`document.querySelector()`](https://developer.mozilla.org/en-US/docs/Web/API/Element/querySelector)。在原生 CSS 動畫的世界裡，這就不必要了。取而代之的是，你可以使用 CSS 選擇器鎖定子類別，並套用任何想要的 `transform` 或 `animation`。

若要在範本內切換子節點的類別，你可以使用 class 與 style 繫結，在正確的時間點加入動畫。

### Stagger()

`stagger()` 函式讓你能把清單中每個項目的動畫延遲一段指定時間，創造瀑布般的效果。你可以在原生 CSS 中利用 `animation-delay` 或 `transition-delay` 複製這種行為。以下範例示範這類 CSS 可能的寫法。

#### 使用 Animations 套件

<docs-code-multifile>
    <docs-code header="stagger.component.ts" path="adev/src/content/examples/animations/src/app/animations-package/stagger.component.ts" />
    <docs-code header="stagger.component.html" path="adev/src/content/examples/animations/src/app/animations-package/stagger.component.html" />
    <docs-code header="stagger.component.css" path="adev/src/content/examples/animations/src/app/animations-package/stagger.component.css" />
</docs-code-multifile>

#### 使用原生 CSS

<docs-code-multifile preview path="adev/src/content/examples/animations/src/app/native-css/stagger.component.ts">
    <docs-code header="stagger.component.ts" path="adev/src/content/examples/animations/src/app/native-css/stagger.component.ts" />
    <docs-code header="stagger.component.html" path="adev/src/content/examples/animations/src/app/native-css/stagger.component.html" />
    <docs-code header="stagger.component.css" path="adev/src/content/examples/animations/src/app/native-css/stagger.component.css" />
</docs-code-multifile>

### 平行動畫

animations 套件有一個 `group()` 函式，可以同時播放多個動畫。在 CSS 中，你可以完全控制動畫時間。若你定義了多個動畫，可以一次全部套用。

```css
.target-element {
  animation: rotate 3s, fade-in 2s;
}
```

在這個範例中，`rotate` 與 `fade-in` 動畫會同時觸發。

### 為重新排序清單的項目加入動畫

清單中的項目重新排序，運用前面說明的技巧即可開箱運作，不需要額外的特殊處理。`@for` 迴圈中的項目會被正確地移除再重新加入，進入動畫會透過 `@starting-styles` 觸發。或者，你也可以用 `animate.enter` 達成相同行為。使用 `animate.leave` 讓元素在被移除時播放動畫，如上例所示。

#### 使用 Animations 套件

<docs-code-multifile>
    <docs-code header="reorder.component.ts" path="adev/src/content/examples/animations/src/app/animations-package/reorder.component.ts" />
    <docs-code header="reorder.component.html" path="adev/src/content/examples/animations/src/app/animations-package/reorder.component.html" />
    <docs-code header="reorder.component.css" path="adev/src/content/examples/animations/src/app/animations-package/reorder.component.css" />
</docs-code-multifile>

#### 使用原生 CSS

<docs-code-multifile preview path="adev/src/content/examples/animations/src/app/native-css/reorder.component.ts">
    <docs-code header="reorder.component.ts" path="adev/src/content/examples/animations/src/app/native-css/reorder.component.ts" />
    <docs-code header="reorder.component.html" path="adev/src/content/examples/animations/src/app/native-css/reorder.component.html" />
    <docs-code header="reorder.component.css" path="adev/src/content/examples/animations/src/app/native-css/reorder.component.css" />
</docs-code-multifile>

## 遷移 AnimationPlayer 的用法

`AnimationPlayer` 類別讓你存取動畫，透過程式碼做更進階的事，例如暫停、播放、重新開始與結束動畫。這些事全都可以原生處理。

你可以使用 [`Element.getAnimations()`](https://developer.mozilla.org/en-US/docs/Web/API/Element/getAnimations) 直接從元素取得動畫。它會回傳該元素上每一個 [`Animation`](https://developer.mozilla.org/en-US/docs/Web/API/Animation) 組成的陣列。你可以用 `Animation` API 做到比 animations 套件的 `AnimationPlayer` 更多的事。由此你可以 `cancel()`、`play()`、`pause()`、`reverse()` 等等。這個原生 API 應該能提供你控制動畫所需的一切。

## 路由轉場

你可以使用檢視轉場為路由之間加入動畫。開始使用請見[路由轉場動畫指南](guide/routing/route-transition-animations)。
