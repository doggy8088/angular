# Angular 動畫簡介

IMPORTANT: `@angular/animations` 套件現已棄用。Angular 團隊建議所有新程式碼都使用原生 CSS 搭配 `animate.enter` 與 `animate.leave` 來製作動畫。詳情請見新的進入與離開[動畫指南](guide/animations)。另請參閱[從 Angular Animations 套件遷移](guide/animations/migration)，了解如何開始把應用程式遷移到純 CSS 動畫。

動畫能營造出運動的幻覺：HTML 元素的樣式會隨時間改變。
設計良好的動畫能讓應用程式更直覺、更吸引人，但它不只是裝飾。
動畫能從多方面改善應用程式與使用者體驗：

- 沒有動畫時，網頁轉場容易顯得突兀生硬
- 動態效果能大幅提升使用者體驗，讓使用者有機會察覺應用程式對其操作的回應
- 良好的動畫能直覺地把使用者的注意力引導到需要的地方

通常，動畫涉及隨時間進行的多個樣式*轉換*。
一個 HTML 元素可以移動、改變顏色、放大或縮小、淡入淡出，或滑出頁面。
這些變化可以同時或依序發生。你可以控制每個轉換的時間。

Angular 的動畫系統建構在 CSS 功能之上，也就是說，凡是瀏覽器視為可動畫化的屬性，你都能為它加入動畫。
這包括位置、大小、transform、顏色、邊框等等。
W3C 在其 [CSS Transitions](https://www.w3.org/TR/css-transitions-1) 頁面上維護了一份可動畫化屬性的清單。

## 關於本指南 {#about-this-guide}

本指南涵蓋 Angular 動畫的基本功能，帶你開始把 Angular 動畫加到專案中。

## 開始使用

動畫相關的主要 Angular 模組是 `@angular/animations` 與 `@angular/platform-browser`。

要開始把 Angular 動畫加到專案中，請連同標準 Angular 功能一起匯入動畫專用模組。

<docs-workflow>
<docs-step title="啟用動畫模組">
從 `@angular/platform-browser/animations/async` 匯入 `provideAnimationsAsync`，並把它加入 `bootstrapApplication` 函式呼叫的 providers 清單中。

```ts {header: "Enabling Animations", linenums}
bootstrapApplication(AppComponent, {
  providers: [provideAnimationsAsync()],
});
```

<docs-callout important title="若你的應用程式需要立即播放的動畫">
  若你需要在應用程式載入時立即發生動畫，
  你會想改用急切載入的動畫模組。改從 `@angular/platform-browser/animations` 匯入 `provideAnimations`，
  並在 `bootstrapApplication` 函式呼叫中用 `provideAnimations` **取代**
  `provideAnimationsAsync`。
</docs-callout>

對於以 `NgModule` 為基礎的應用程式，請匯入 `BrowserAnimationsModule`，它會把動畫功能引入你的 Angular 根應用程式模組。

<docs-code header="app.module.ts" path="adev/src/content/examples/animations/src/app/app.module.1.ts"/>
</docs-step>
<docs-step title="把動畫函式匯入元件檔案">
若你打算在元件檔案中使用特定的動畫函式，請從 `@angular/animations` 匯入那些函式。

<docs-code header="app.ts" path="adev/src/content/examples/animations/src/app/app.ts" region="imports"/>

本指南末尾列出了所有[可用的動畫函式](guide/legacy-animations#animations-api-summary)。

</docs-step>
<docs-step title="加入動畫中繼資料屬性">
在元件檔案中，於 `@Component()` 裝飾器內加入一個名為 `animations:` 的中繼資料屬性。
定義動畫的觸發器就放在 `animations` 中繼資料屬性中。

<docs-code header="app.ts" path="adev/src/content/examples/animations/src/app/app.ts" region="decorator"/>
</docs-step>
</docs-workflow>

## 為轉場加入動畫

我們來為一個轉場加入動畫，讓單一 HTML 元素從一種狀態變成另一種狀態。
例如，你可以指定按鈕根據使用者的上一個動作，顯示 **Open** 或 **Closed**。
當按鈕處於 `open` 狀態時，它是可見的黃色。
當它處於 `closed` 狀態時，它是半透明的藍色。

在 HTML 中，這些屬性是用一般的 CSS 樣式設定的，例如顏色與不透明度。
在 Angular 中，使用 `style()` 函式指定一組要搭配動畫使用的 CSS 樣式。
把一組樣式收集到一個動畫狀態中，並為該狀態取個名字，例如 `open` 或 `closed`。

HELPFUL: 我們來建立一個新的 `open-close` 元件，用簡單的轉場為它加入動畫。

在終端機執行以下指令來產生元件：

```shell
ng g component open-close
```

這會在 `src/app/open-close.ts` 建立該元件。

### 動畫狀態與樣式

使用 Angular 的 [`state()`](api/animations/state) 函式，定義要在每個轉場結束時呼叫的不同狀態。
這個函式接受兩個參數：
一個唯一的名稱（例如 `open` 或 `closed`）與一個 `style()` 函式。

使用 `style()` 函式定義一組要與指定狀態名稱關聯的樣式。
對於含有連字號的樣式屬性，你必須使用*駝峰式命名*，例如 `backgroundColor`，或把它們用引號包起來，例如 `'background-color'`。

我們來看看 Angular 的 [`state()`](api/animations/state) 函式如何與 `style⁣­(⁠)` 函式搭配，設定 CSS 樣式屬性。
在這段程式碼中，同一時間為該狀態設定了多個樣式屬性。
在 `open` 狀態下，按鈕的高度為 200 像素、不透明度為 1，背景色為黃色。

<docs-code header="open-close.ts" path="adev/src/content/examples/animations/src/app/open-close.ts" region="state1"/>

在接下來的 `closed` 狀態中，按鈕的高度為 100 像素、不透明度為 0.8，背景色為藍色。

<docs-code header="open-close.ts" path="adev/src/content/examples/animations/src/app/open-close.ts" region="state2"/>

### 轉場與時間

在 Angular 中，你可以設定多個樣式而不加任何動畫。
不過，若不再進一步細修，按鈕會瞬間變形，沒有淡入淡出、沒有縮小，也沒有任何顯示變化正在發生的可見跡象。

為了讓變化不那麼突兀，你需要定義一個動畫*轉場*，指定在一段時間內、從一種狀態到另一種狀態之間發生的變化。
`transition()` 函式接受兩個參數：
第一個參數接受一個運算式，定義兩個轉場狀態之間的方向；第二個參數接受一個或一系列 `animate()` 步驟。

使用 `animate()` 函式定義轉場的長度、延遲與緩動，並指定在轉場進行期間用來定義樣式的 style 函式。
使用 `animate()` 函式為多步驟動畫定義 `keyframes()` 函式。
這些定義放在 `animate()` 函式的第二個參數中。

#### 動畫中繼資料：持續時間、延遲與緩動

`animate()` 函式（轉場函式的第二個參數）接受 `timings` 與 `styles` 輸入參數。

`timings` 參數接受數字，或由三個部分組成的字串。

```ts
animate(duration);
```

或

```ts
animate('duration delay easing');
```

第一個部分 `duration` 是必填的。
持續時間可以用不加引號的數字以毫秒表示，或用加引號並帶時間單位的字串以秒表示。
例如，十分之一秒的持續時間可以這樣表示：

- 用純數字，以毫秒計：
  `100`

- 用字串，以毫秒計：
  `'100ms'`

- 用字串，以秒計：
  `'0.1s'`

第二個參數 `delay` 的語法與 `duration` 相同。
例如：

- 等待 100ms，然後執行 200ms：`'0.2s 100ms'`

第三個參數 `easing` 控制動畫在執行期間如何[加速與減速](https://easings.net)。
例如，`ease-in` 會讓動畫一開始緩慢，隨著進行逐漸加快。

- 等待 100ms，執行 200ms。
  使用減速曲線，快速起步再緩緩減速到靜止點：
  `'0.2s 100ms ease-out'`

- 執行 200ms，無延遲。
  使用標準曲線，緩慢起步、中段加速、結尾再緩緩減速：
  `'0.2s ease-in-out'`

- 立即開始，執行 200ms。
  使用加速曲線，緩慢起步並以全速結束：
  `'0.2s ease-in'`

HELPFUL: 關於緩動曲線的一般資訊，請見 Material Design 網站的[自然緩動曲線](https://material.io/design/motion/speed.html#easing)主題。

這個範例提供了一個從 `open` 到 `closed` 的狀態轉場，兩個狀態之間的轉場時間為 1 秒。

<docs-code header="open-close.ts" path="adev/src/content/examples/animations/src/app/open-close.ts" region="transition1"/>

在前面的程式碼片段中，`=>` 運算子表示單向轉場，`<=>` 則是雙向轉場。
在轉場中，`animate()` 指定轉場需要多久。
在這個例子裡，從 `open` 到 `closed` 的狀態變化需要 1 秒，這裡寫成 `1s`。

這個範例再加入一個從 `closed` 狀態到 `open` 狀態的狀態轉場，轉場動畫弧線為 0.5 秒。

<docs-code header="open-close.ts" path="adev/src/content/examples/animations/src/app/open-close.ts" region="transition2"/>

HELPFUL: 關於在 [`state`](api/animations/state) 與 `transition` 函式中使用樣式的一些補充說明。

- 使用 [`state()`](api/animations/state) 定義在每個轉場結束時套用的樣式，它們在動畫完成後仍會保留
- 使用 `transition()` 定義中間樣式，在動畫期間營造出運動的幻覺
- 當動畫被停用時，`transition()` 樣式可以被跳過，但 [`state()`](api/animations/state) 樣式不行
- 在同一個 `transition()` 參數中包含多組狀態配對：

  ```ts
  transition('on => off, off => void');
  ```

### 觸發動畫

動畫需要一個*觸發器*，它才知道何時開始。
`trigger()` 函式收集各個狀態與轉場，並為動畫取一個名字，讓你可以把它附加到 HTML 範本中的觸發元素上。

`trigger()` 函式描述要監看變化的屬性名稱。
當變化發生時，觸發器會啟動其定義中包含的動作。
這些動作可以是轉場或其他函式，後面會再看到。

在這個範例中，我們將觸發器命名為 `openClose`，並把它附加到 `button` 元素上。
觸發器描述了開啟與關閉狀態，以及兩個轉場的時間。

HELPFUL: 在每次 `trigger()` 函式呼叫中，一個元素在任一時間點只能處於一種狀態。
不過，多個觸發器可以同時處於作用中。

### 定義動畫並附加到 HTML 範本

動畫定義在控制要加入動畫的 HTML 元素的元件中繼資料中。
把定義動畫的程式碼放在 `@Component()` 裝飾器內的 `animations:` 屬性下。

<docs-code header="open-close.ts" path="adev/src/content/examples/animations/src/app/open-close.ts" region="component"/>

當你為元件定義好動畫觸發器後，用方括號包住觸發器名稱並在前面加上 `@` 符號，把它附加到該元件範本中的元素上。
接著，你可以用標準的 Angular 屬性繫結語法把觸發器繫結到範本運算式，如下所示，其中 `triggerName` 是觸發器的名稱，`expression` 會求值為一個已定義的動畫狀態。

```angular-html
<div [@triggerName]="expression">…</div>
```

當運算式的值變成新狀態時，動畫就會執行或被觸發。

以下程式碼片段把觸發器繫結到 `isOpen` 屬性的值。

<docs-code header="open-close.html" path="adev/src/content/examples/animations/src/app/open-close.1.html" region="trigger"/>

在這個範例中，當 `isOpen` 運算式求值為已定義的 `open` 或 `closed` 狀態時，它會通知觸發器 `openClose` 有狀態變化。
接著就由 `openClose` 的程式碼處理狀態變化，並啟動狀態變化動畫。

對於進入或離開頁面的元素（插入 DOM 或從 DOM 移除），你可以讓動畫有條件地執行。
例如，在 HTML 範本中搭配動畫觸發器使用 `*ngIf`。

HELPFUL: 在元件檔案中，把定義動畫的觸發器設為 `@Component()` 裝飾器中 `animations:` 屬性的值。

在 HTML 範本檔案中，使用觸發器名稱把已定義的動畫附加到要加入動畫的 HTML 元素上。

### 程式碼回顧

以下是轉場範例中討論過的程式碼檔案。

<docs-code-multifile>
    <docs-code header="open-close.ts" path="adev/src/content/examples/animations/src/app/open-close.ts" region="component"/>
    <docs-code header="open-close.html" path="adev/src/content/examples/animations/src/app/open-close.1.html" region="trigger"/>
    <docs-code header="open-close.css" path="adev/src/content/examples/animations/src/app/open-close.css"/>
</docs-code-multifile>

### 小結

你學會了如何使用 `style()` 與 [`state()`](api/animations/state)，再搭配負責時間的 `animate()`，為兩個狀態之間的轉場加入動畫。

關於 Angular 動畫的進階功能，請見「動畫」章節，從[轉場與觸發器](guide/legacy-animations/transition-and-triggers)的進階技巧開始。

## 動畫 API 總覽 {#animations-api-summary}

`@angular/animations` 模組提供的函式式 API，提供了一套領域專用語言（DSL），用來在 Angular 應用程式中建立與控制動畫。
核心函式與相關資料結構的完整清單與語法細節，請見 [API 參考文件](api#animations)。

| 函式名稱                          | 功能                                                                                                                                                                                                |
| :-------------------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `trigger()`                       | 啟動動畫，並作為所有其他動畫函式呼叫的容器。HTML 範本會繫結到 `triggerName`。用第一個參數宣告一個唯一的觸發器名稱。使用陣列語法。 |
| `style()`                         | 定義一個或多個要在動畫中使用的 CSS 樣式。在動畫期間控制 HTML 元素的外觀。使用物件語法。                                                                 |
| [`state()`](api/animations/state) | 建立一組具名的 CSS 樣式，在成功轉場到指定狀態時套用。之後可以在其他動畫函式中以名稱參照該狀態。                              |
| `animate()`                       | 指定轉場的時間資訊。可選的值有 `delay` 與 `easing`。內部可以包含 `style()` 呼叫。                                                                            |
| `transition()`                    | 定義兩個具名狀態之間的動畫序列。使用陣列語法。                                                                                                                                 |
| `keyframes()`                     | 允許在指定時間區間內依序在樣式之間變化。用在 `animate()` 內部。每個 `keyframe()` 內部可以包含多個 `style()` 呼叫。使用陣列語法。                       |
| [`group()`](api/animations/group) | 指定一組要平行執行的動畫步驟（*內部動畫*）。所有內部動畫步驟都完成後，動畫才會繼續。用在 `sequence()` 或 `transition()` 內部。     |
| `query()`                         | 在目前元素內尋找一個或多個內部 HTML 元素。                                                                                                                                           |
| `sequence()`                      | 指定一份要依序一個接一個執行的動畫步驟清單。                                                                                                                                  |
| `stagger()`                       | 讓多個元素的動畫起始時間錯開。                                                                                                                                            |
| `animation()`                     | 產生一個可從其他地方呼叫的可重複使用動畫。與 `useAnimation()` 搭配使用。                                                                                                      |
| `useAnimation()`                  | 啟用一個可重複使用的動畫。與 `animation()` 搭配使用。                                                                                                                                                    |
| `animateChild()`                  | 讓子元件的動畫能在與父元件相同的時間範圍內執行。                                                                                                                    |

</table>

## 深入了解 Angular 動畫

HELPFUL: 可以看看這場在 2017 年 11 月 AngularConnect 大會發表的[演講](https://www.youtube.com/watch?v=rnTK9meY5us)，以及其隨附的[原始碼](https://github.com/matsko/animationsftw.in)。

你可能也會對以下內容有興趣：

<docs-pill-row>
  <docs-pill href="guide/legacy-animations/transition-and-triggers" title="轉場與觸發器"/>
  <docs-pill href="guide/legacy-animations/complex-sequences" title="複雜動畫序列"/>
  <docs-pill href="guide/legacy-animations/reusable-animations" title="可重複使用的動畫"/>
  <docs-pill href="guide/routing/route-transition-animations" title="路由轉場動畫"/>
  <docs-pill href="guide/animations/migration" title="遷移到原生 CSS 動畫"/>
</docs-pill-row>
