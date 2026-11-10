# 使用 CSS 為應用程式加入動畫

CSS 提供了一套強大的工具，讓你在應用程式中建立美觀且吸引人的動畫。

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

你可以使用 `@keyframes` 建立可在整個應用程式共用的可重複使用動畫。把關鍵影格動畫定義在共用的 CSS 檔案中，你就能在應用程式的任何地方重複使用這些關鍵影格動畫。

<docs-code header="animations.css" path="adev/src/content/examples/animations/src/app/animations.css" region="animation-shared"/>

把 `animated-class` 類別加到元素上，就會觸發該元素的動畫。

## 為轉場加入動畫

### 為狀態與樣式加入動畫

你可能想在兩種不同狀態之間加入動畫，例如元素開啟或關閉時。你可以用 CSS 類別搭配關鍵影格動畫或轉場樣式來達成。

<docs-code header="animations.css" path="adev/src/content/examples/animations/src/app/animations.css" region="animation-states"/>

觸發 `open` 或 `closed` 狀態的方法，是在元件中切換元素上的類別。你可以在我們的[範本指南](guide/templates/binding#css-class-and-style-property-bindings)中找到做法範例。

範本指南中也有[直接為樣式加入動畫](guide/templates/binding#css-style-properties)的類似範例。

### 轉場、時間與緩動

加入動畫時，常需要調整時間、延遲與緩動行為。這可以透過多個 CSS 屬性或簡寫屬性完成。

在 CSS 中為關鍵影格動畫指定 `animation-duration`、`animation-delay` 與 `animation-timing-function`，或改用 `animation` 簡寫屬性。

<docs-code header="animations.css" path="adev/src/content/examples/animations/src/app/animations.css" region="animation-timing"/>

同樣地，對於不使用 `@keyframes` 的動畫，你可以使用 `transition-duration`、`transition-delay`、`transition-timing-function` 以及 `transition` 簡寫屬性。

<docs-code header="animations.css" path="adev/src/content/examples/animations/src/app/animations.css" region="transition-timing"/>

### 觸發動畫

只要切換 CSS 樣式或類別，就能觸發動畫。當類別出現在元素上時，動畫就會發生。移除類別後，元素會還原為該元素所定義的 CSS。以下是一個範例：

<docs-code-multifile preview path="adev/src/content/examples/animations/src/app/native-css/open-close.ts">
    <docs-code header="open-close.ts" path="adev/src/content/examples/animations/src/app/native-css/open-close.ts" />
    <docs-code header="open-close.html" path="adev/src/content/examples/animations/src/app/native-css/open-close.html" />
    <docs-code header="open-close.css" path="adev/src/content/examples/animations/src/app/native-css/open-close.css"/>
</docs-code-multifile>

## 轉場與觸發器

### 為自動高度加入動畫

你可以使用 CSS Grid 為自動高度加入動畫。

<docs-code-multifile preview path="adev/src/content/examples/animations/src/app/native-css/auto-height.ts">
    <docs-code header="auto-height.ts" path="adev/src/content/examples/animations/src/app/native-css/auto-height.ts" />
    <docs-code header="auto-height.html" path="adev/src/content/examples/animations/src/app/native-css/auto-height.html" />
    <docs-code header="auto-height.css" path="adev/src/content/examples/animations/src/app/native-css/auto-height.css"  />
</docs-code-multifile>

若你不需要顧慮支援所有瀏覽器，也可以看看 `calc-size()`，那是為自動高度加入動畫的真正解法。更多資訊請見 [MDN 的文件](https://developer.mozilla.org/en-US/docs/Web/CSS/calc-size)與[這篇教學](https://frontendmasters.com/blog/one-of-the-boss-battles-of-css-is-almost-won-transitioning-to-auto/)。

### 為進入與離開檢視加入動畫

你可以為項目進入檢視或離開檢視時建立動畫。先看看如何為進入檢視的元素加入動畫。我們會用 `animate.enter` 來做，它會在元素進入檢視時套用動畫類別。

<docs-code-multifile preview path="adev/src/content/examples/animations/src/app/native-css/insert.ts">
    <docs-code header="insert.ts" path="adev/src/content/examples/animations/src/app/native-css/insert.ts" />
    <docs-code header="insert.html" path="adev/src/content/examples/animations/src/app/native-css/insert.html" />
    <docs-code header="insert.css" path="adev/src/content/examples/animations/src/app/native-css/insert.css"  />
</docs-code-multifile>

為離開檢視的元素加入動畫，與為進入檢視的元素加入動畫相似。使用 `animate.leave` 指定元素離開檢視時要套用的 CSS 類別。

<docs-code-multifile preview path="adev/src/content/examples/animations/src/app/native-css/remove.ts">
    <docs-code header="remove.ts" path="adev/src/content/examples/animations/src/app/native-css/remove.ts" />
    <docs-code header="remove.html" path="adev/src/content/examples/animations/src/app/native-css/remove.html" />
    <docs-code header="remove.css" path="adev/src/content/examples/animations/src/app/native-css/remove.css"  />
</docs-code-multifile>

更多關於 `animate.enter` 與 `animate.leave` 的資訊，請見[進入與離開動畫指南](guide/animations)。

### 為遞增與遞減加入動畫

為遞增與遞減加入動畫，是應用程式中常見的模式。以下範例示範如何達成這種行為。

<docs-code-multifile preview path="adev/src/content/examples/animations/src/app/native-css/increment-decrement.ts">
    <docs-code header="increment-decrement.ts" path="adev/src/content/examples/animations/src/app/native-css/increment-decrement.ts" />
    <docs-code header="increment-decrement.html" path="adev/src/content/examples/animations/src/app/native-css/increment-decrement.html" />
    <docs-code header="increment-decrement.css" path="adev/src/content/examples/animations/src/app/native-css/increment-decrement.css" />
</docs-code-multifile>

### 停用單一動畫或所有動畫

若你想停用已指定的動畫，有多種做法。

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

若你有想在動畫的特定時間點執行的動作，有多個可監聽的事件可用。以下列出其中幾個。

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

動畫通常不只是簡單的淡入或淡出。你可能有許多想執行的複雜動畫序列。以下來看看其中一些可能的情境。

### 讓清單中的動畫錯開播放

一個常見的效果，是讓清單中每個項目的動畫錯開播放，形成瀑布般的效果。這可以利用 `animation-delay` 或 `transition-delay` 達成。以下範例示範這類 CSS 可能的寫法。

<docs-code-multifile preview path="adev/src/content/examples/animations/src/app/native-css/stagger.ts">
    <docs-code header="stagger.ts" path="adev/src/content/examples/animations/src/app/native-css/stagger.ts" />
    <docs-code header="stagger.html" path="adev/src/content/examples/animations/src/app/native-css/stagger.html" />
    <docs-code header="stagger.css" path="adev/src/content/examples/animations/src/app/native-css/stagger.css" />
</docs-code-multifile>

### 平行動畫

你可以使用 `animation` 簡寫屬性，同時把多個動畫套用到一個元素上。每個動畫都可以有各自的持續時間與延遲。這讓你能把動畫組合在一起，創造出複雜的效果。

```css
.target-element {
  animation:
    rotate 3s,
    fade-in 2s;
}
```

在這個範例中，`rotate` 與 `fade-in` 動畫會同時觸發，但持續時間不同。

### 為重新排序清單的項目加入動畫

`@for` 迴圈中的項目會被移除再重新加入，進入動畫會透過 `@starting-styles` 觸發。或者，你也可以用 `animate.enter` 達成相同行為。使用 `animate.leave` 讓元素在被移除時播放動畫，如下例所示。

<docs-code-multifile preview path="adev/src/content/examples/animations/src/app/native-css/reorder.ts">
    <docs-code header="reorder.ts" path="adev/src/content/examples/animations/src/app/native-css/reorder.ts" />
    <docs-code header="reorder.html" path="adev/src/content/examples/animations/src/app/native-css/reorder.html" />
    <docs-code header="reorder.css" path="adev/src/content/examples/animations/src/app/native-css/reorder.css" />
</docs-code-multifile>

## 以程式方式控制動畫

你可以使用 [`Element.getAnimations()`](https://developer.mozilla.org/en-US/docs/Web/API/Element/getAnimations) 直接從元素取得動畫。它會回傳該元素上每一個 [`Animation`](https://developer.mozilla.org/en-US/docs/Web/API/Animation) 組成的陣列。你可以用 `Animation` API 做到比 animations 套件的 `AnimationPlayer` 更多的事。由此你可以 `cancel()`、`play()`、`pause()`、`reverse()` 等等。這個原生 API 應該能提供你控制動畫所需的一切。

## 深入了解 Angular 動畫

你可能也會對以下內容有興趣：

<docs-pill-row>
  <docs-pill href="guide/animations" title="進入與離開動畫"/>
  <docs-pill href="guide/routing/route-transition-animations" title="路由轉場動畫"/>
</docs-pill-row>
