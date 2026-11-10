# 使用 `animate.enter` 與 `animate.leave` 為應用程式加入動畫

設計良好的動畫能讓應用程式更直覺、更吸引人，但它不只是裝飾。
動畫能從多方面改善應用程式與使用者體驗：

- 沒有動畫時，網頁轉場容易顯得突兀生硬
- 動態效果能大幅提升使用者體驗，讓使用者察覺應用程式對其操作的回應
- 良好的動畫能在整個工作流程中順暢地引導使用者的注意力

Angular 提供 `animate.enter` 與 `animate.leave` 來為應用程式的元素加入動畫。這兩個功能會在適當的時機套用進入與離開的 CSS 類別，或呼叫函式以套用第三方函式庫的動畫。`animate.enter` 與 `animate.leave` 不是指令，而是由 Angular 編譯器直接支援的特殊 API。它們可以直接用在元素上，也可以作為宿主繫結使用。

## `animate.enter`

你可以用 `animate.enter` 讓元素在*進入* DOM 時播放動畫。你可以用 CSS 類別搭配轉場或關鍵影格動畫來定義進入動畫。

<docs-code-multifile preview path="adev/src/content/examples/animations/src/app/enter-and-leave/enter.ts">
    <docs-code header="enter.ts" path="adev/src/content/examples/animations/src/app/enter-and-leave/enter.ts" />
    <docs-code header="enter.html" path="adev/src/content/examples/animations/src/app/enter-and-leave/enter.html" />
    <docs-code header="enter.css" path="adev/src/content/examples/animations/src/app/enter-and-leave/enter.css"/>
</docs-code-multifile>

動畫完成後，Angular 會從 DOM 移除你在 `animate.enter` 中指定的類別。動畫類別只會在動畫進行期間存在。

NOTE: 在同一個元素上使用多個關鍵影格動畫或轉場屬性時，Angular 會等到最長的那個動畫完成後，才移除所有類別。

你可以將 `animate.enter` 與任何其他 Angular 功能搭配使用，例如控制流程或動態運算式。`animate.enter` 接受單一類別字串（多個類別以空格分隔），或類別字串陣列。

順帶說明 CSS 轉場的用法：若你選擇使用轉場而非關鍵影格動畫，透過 `animate.enter` 加入元素的類別，代表的是轉場要動畫到的目標狀態。當沒有動畫執行時，元素基礎 CSS 的外觀，通常會與 CSS 轉場的結束狀態相似。因此，你仍需要搭配 `@starting-style`，讓轉場有適當的起始狀態才能正常運作。

<docs-code-multifile preview path="adev/src/content/examples/animations/src/app/enter-and-leave/enter-binding.ts">
    <docs-code header="enter-binding.ts" path="adev/src/content/examples/animations/src/app/enter-and-leave/enter-binding.ts" />
    <docs-code header="enter-binding.html" path="adev/src/content/examples/animations/src/app/enter-and-leave/enter-binding.html" />
    <docs-code header="enter-binding.css" path="adev/src/content/examples/animations/src/app/enter-and-leave/enter-binding.css"/>
</docs-code-multifile>

## `animate.leave`

你可以用 `animate.leave` 讓元素在*離開* DOM 時播放動畫。你可以用 CSS 類別搭配 transform 或關鍵影格動畫來定義離開動畫。

<docs-code-multifile preview path="adev/src/content/examples/animations/src/app/enter-and-leave/leave.ts">
    <docs-code header="leave.ts" path="adev/src/content/examples/animations/src/app/enter-and-leave/leave.ts" />
    <docs-code header="leave.html" path="adev/src/content/examples/animations/src/app/enter-and-leave/leave.html" />
    <docs-code header="leave.css" path="adev/src/content/examples/animations/src/app/enter-and-leave/leave.css"/>
</docs-code-multifile>

動畫完成後，Angular 會自動把該元素從 DOM 移除。

NOTE: 在同一個元素上使用多個關鍵影格動畫或轉場屬性時，Angular 會等到其中最長的那個動畫完成後，才移除元素。

`animate.leave` 也可以搭配訊號與其他繫結使用。你可以為 `animate.leave` 指定單一類別或多個類別，用以空格分隔的簡單字串或字串陣列指定皆可。

<docs-code-multifile preview path="adev/src/content/examples/animations/src/app/enter-and-leave/leave-binding.ts">
    <docs-code header="leave-binding.ts" path="adev/src/content/examples/animations/src/app/enter-and-leave/leave-binding.ts" />
    <docs-code header="leave-binding.html" path="adev/src/content/examples/animations/src/app/enter-and-leave/leave-binding.html" />
    <docs-code header="leave-binding.css" path="adev/src/content/examples/animations/src/app/enter-and-leave/leave-binding.css"/>
</docs-code-multifile>

### 元素移除順序 {#element-removal-order}

`animate.leave` 動畫如何執行、何時發生，其中有些細微差別。當 `animate.leave` 放在正被移除的元素上時，它會生效；而若 `animate.leave` 放在被移除元素的*後代*元素上，這些子元素動畫會在父節點從 DOM 移除*之前*先執行。這能確保你可以放心地讓子元素以動畫離場，父節點不會提早消失。

<docs-code-multifile preview path="adev/src/content/examples/animations/src/app/enter-and-leave/leave-parent.ts">
    <docs-code header="leave.ts" path="adev/src/content/examples/animations/src/app/enter-and-leave/leave-parent.ts" />
    <docs-code header="leave.html" path="adev/src/content/examples/animations/src/app/enter-and-leave/leave-parent.html" />
    <docs-code header="leave.css" path="adev/src/content/examples/animations/src/app/enter-and-leave/leave-parent.css"/>
</docs-code-multifile>

## 事件繫結、函式與第三方函式庫

`animate.enter` 與 `animate.leave` 都支援事件繫結語法，可以用來呼叫函式。你可以利用這個語法呼叫元件程式碼中的函式，或使用第三方動畫函式庫，例如 [GSAP](https://gsap.com/)、[anime.js](https://animejs.com/)，或任何其他 JavaScript 動畫函式庫。

<docs-code-multifile preview path="adev/src/content/examples/animations/src/app/enter-and-leave/leave-event.ts">
    <docs-code header="leave-event.ts" path="adev/src/content/examples/animations/src/app/enter-and-leave/leave-event.ts" />
    <docs-code header="leave-event.html" path="adev/src/content/examples/animations/src/app/enter-and-leave/leave-event.html" />
    <docs-code header="leave-event.css" path="adev/src/content/examples/animations/src/app/enter-and-leave/leave-event.css"/>
</docs-code-multifile>

`$event` 物件的型別為 `AnimationCallbackEvent`。它包含作為 `target` 的元素，並提供 `animationComplete()` 函式，用來在動畫結束時通知框架。

IMPORTANT: 使用 `animate.leave` 時，你**必須**呼叫 `animationComplete()` 函式，Angular 才會移除元素。

若你在使用 `animate.leave` 時沒有呼叫 `animationComplete()`，Angular 會在延遲四秒後自動呼叫該函式。你可以以毫秒為單位提供 `MAX_ANIMATION_TIMEOUT` token，來設定這段延遲的長度。

```typescript
  { provide: MAX_ANIMATION_TIMEOUT, useValue: 6000 }
```

## 與舊版 Angular 動畫的相容性

你不能在同一個元件內同時使用舊版動畫與 `animate.enter`、`animate.leave`。這樣做會導致進入類別殘留在元素上，或離開的節點無法被移除。但在同一個*應用程式*內同時使用舊版動畫與新的 `animate.enter`、`animate.leave` 動畫則沒有問題。唯一的例外是內容投影：若你把帶有舊版動畫的元件內容投影到帶有 `animate.enter` 或 `animate.leave` 的元件中（或反過來），其行為會與在同一個元件內一起使用相同，這是不支援的。

## 測試

TestBed 內建支援在測試環境中啟用或停用動畫。CSS 動畫需要瀏覽器才能執行，許多相關 API 在測試環境中無法使用。TestBed 預設會在你的測試環境中停用動畫。

若你想測試動畫是否真的在瀏覽器測試（例如端到端測試）中播放，可以在測試設定中指定 `animationsEnabled: true`，將 TestBed 設定為啟用動畫。

```typescript
TestBed.configureTestingModule({animationsEnabled: true});
```

這樣就會讓測試環境中的動畫正常運作。

NOTE: 有些測試環境不會發出 `animationstart`、`animationend` 這類動畫事件，以及它們對應的轉場事件。

## 深入了解 Angular 動畫

你可能也會對以下內容有興趣：

<docs-pill-row>
  <docs-pill href="guide/animations/css" title="使用 CSS 的複雜動畫"/>
  <docs-pill href="guide/routing/route-transition-animations" title="路由轉場動畫"/>
</docs-pill-row>
