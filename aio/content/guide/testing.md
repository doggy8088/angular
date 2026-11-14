# 測試

本指南提供測試 Angular 應用程式的提示與技巧。
雖然本頁包含一些一般性的測試原則與技巧，
但重點放在測試以 Angular 撰寫的應用程式。

{@a top}

<a id="%E7%B7%9A%E4%B8%8A%E7%AF%84%E4%BE%8B"></a>
## 線上範例

本指南呈現一個範例應用程式的測試，它很像 [_Tour of Heroes_ 教學](tutorial)。
範例應用程式與本指南的所有測試，都以線上範例的形式提供，可供檢視、實驗與下載：

* <live-example plnkr="1st-specs" embedded-style>驗證測試環境的 spec</live-example>.
* <live-example plnkr="banner-inline-specs" embedded-style>第一個使用行內範本的元件 spec</live-example>.
* <live-example plnkr="banner-specs" embedded-style>使用外部範本的元件 spec</live-example>.
* <live-example name="setup" plnkr="quickstart-specs" embedded-style>QuickStart 種子的 AppComponent spec</live-example>.
* <live-example embedded-style>要測試的範例應用程式</live-example>.
* <live-example plnkr="app-specs" embedded-style>測試範例應用程式的所有 spec</live-example>.
* <live-example plnkr="bag-specs" embedded-style>額外 spec 的大雜燴</live-example>.

<hr/>

{@a testing-intro}

## Angular 測試簡介

本頁引導你撰寫測試，以探索
並確認應用程式的行為。測試有以下作用：

1. 防止變更破壞既有程式碼（「迴歸」）。

1. 釐清程式碼在按預期使用時、以及面對異常狀況時的行為。

1. 揭露設計與實作上的錯誤。
測試以嚴厲的目光從許多角度檢視程式碼。
當應用程式的某個部分似乎難以測試時，根本原因往往是設計缺陷，
應該現在就修復，而不是等到日後修復成本高昂時才處理。

<!-- TODO
:marked
### Learn more
Learn more about basic Jasmine testing here
[Resources TBD](guide/)
-->

{@a tools-and-tech}

### 工具與技術

你可以使用各種工具與技術來撰寫並執行 Angular 測試。
本指南描述已知效果良好的特定選擇。

<table width="100%">

  <col width="20%">

  </col>

  <col width="80%">

  </col>

  <tr>

    <th>
      技術
    </th>

    <th>
      用途
    </th>

  </tr>

  <tr style=top>

    <td style="vertical-align: top">
      Jasmine
    </td>

<td>

      [Jasmine 測試框架](http://jasmine.github.io/2.4/introduction.html)
      提供撰寫基本測試所需的一切。
      它附有一個 HTML 測試執行器，在瀏覽器中執行測試。
    </td>

  </tr>

  <tr style=top>

    <td style="vertical-align: top">
      Angular 測試公用程式
    </td>

<td>

      Angular 測試公用程式為受測的 Angular 應用程式程式碼建立一個測試環境。
      使用它們來調整與控制應用程式的各個部分，因為它們
      是在 Angular 環境_內_互動的。
    </td>

  </tr>

  <tr style=top>

    <td style="vertical-align: top">
      Karma
    </td>

<td>

      [Karma 測試執行器](https://karma-runner.github.io/1.0/index.html)
      非常適合在開發應用程式時撰寫並執行單元測試。
      它可以是專案開發與持續整合流程中不可或缺的一環。
      本指南描述如何以 Karma 設定並執行測試。
    </td>

  </tr>

  <tr style=top>

    <td style="vertical-align: top">
      Protractor
    </td>

<td>

      使用 Protractor 撰寫並執行_端到端_（e2e）測試。
      端到端測試以_使用者體驗的方式_探索應用程式。
      在 e2e 測試中，一個程序執行真正的應用程式，
      另一個程序執行 Protractor 測試，模擬使用者行為，
      並斷言應用程式在瀏覽器中的回應符合預期。

    </td>

  </tr>

</table>

{@a setup}

### 設定

開始進行單元測試有兩條快速途徑。

1. 依照 [Setup](guide/setup "Setup") 中的說明，開始一個新專案。

1. 使用
<a href="https://github.com/angular/angular-cli/blob/master/README.md" title="Angular CLI">Angular CLI</a> 開始一個新專案。

兩種方法都會安裝 npm 套件、檔案與指令碼，
它們依各自的模式為建置的應用程式預先設定。
它們的產物與程序略有不同，但本質相同，
而且測試程式碼沒有差異。

在本指南中，應用程式及其測試是以[設定說明](guide/setup "Setup")為基礎。
關於單元測試設定檔的討論，[見下文](guide/testing#setup-files)。

{@a isolated-v-testing-utilities}

### 隔離式單元測試與 Angular 測試公用程式

[隔離式單元測試](guide/testing#isolated-unit-tests "Unit testing without the Angular testing utilities")
獨立檢視一個類別的實例，不依賴 Angular 或任何注入的值。
測試者以 `new` 建立該類別的測試實例，視需要為建構子參數提供測試替身，然後
探查測試實例的 API 表面。

*你應該為管道與服務撰寫隔離式單元測試。*

你也可以隔離測試元件。
然而，隔離式單元測試無法揭露元件如何與 Angular 互動。
特別是，它們無法揭露元件類別如何與自己的範本或其他元件互動。

這類測試需要 **Angular 測試公用程式**。
Angular 測試公用程式包括 `TestBed` 類別，以及來自 `@angular/core/testing` 的數個輔助函式。
它們是本指南的主要焦點，你將在
撰寫你的[第一個元件測試](guide/testing#simple-component-test)時瞭解它們。
Angular 測試公用程式的全面回顧出現在[本指南後面](guide/testing#atu-apis)。

但首先，你應該撰寫一個虛擬測試，來驗證你的測試環境設定正確，
並鎖定一些基本的測試技能。

<hr/>

{@a 1st-karma-test}

## 第一個 Karma 測試

從一個簡單的測試開始，確保設定運作正常。

在應用程式根資料夾 `src/app/` 中，建立一個名為 `1st.spec.ts` 的新檔案

<div class="alert is-important">

以 Jasmine 撰寫的測試稱為 _specs_。
**副檔名必須是 `.spec.ts`**，
這是 `karma.conf.js` 與其他工具遵循的慣例。

</div>

**把 spec 檔案放在 `src/app/` 資料夾內的某處。**
`karma.conf.js` 告訴 Karma 去那裡尋找 spec 檔案，
原因在[下文](guide/testing#q-spec-file-location)說明。

把下列程式碼加入 `src/app/1st.spec.ts`。

<code-example path="testing/src/app/1st.spec.ts" title="src/app/1st.spec.ts" linenums="false">

</code-example>

{@a run-karma}

### 以 Karma 執行
使用下列命令，從命令列編譯並在 Karma 中執行它：

<code-example format="." language="bash">
  npm test
</code-example>

該命令會編譯應用程式與測試程式碼，並啟動 Karma。
兩個程序都會監看相關檔案、把訊息寫入主控台，並在偵測到變更時重新執行。

<div class="l-sub-section">

文件設定在 npm 的 `package.json` 的 `scripts` 區段中定義了 `test` 命令。
Angular CLI 有不同的命令來做同樣的事。請相應調整。

</div>

片刻之後，Karma 會開啟一個瀏覽器，並開始把輸出寫入主控台。

<figure>
  <img src='generated/images/guide/testing/karma-browser.png' alt="Karma 瀏覽器">
</figure>

把瀏覽器隱藏起來（不要關閉！），專注於主控台輸出，
它看起來應該像這樣：

<code-example format="." language="bash">
  > npm test
  ...
  [0] 1:37:03 PM - Compilation complete. Watching for file changes.
  ...
  [1] Chrome 51.0.2704: Executed 0 of 0 SUCCESS
      Chrome 51.0.2704: Executed 1 of 1 SUCCESS
  SUCCESS (0.005 secs / 0.005 secs)

</code-example>

編譯器與 Karma 都繼續執行。編譯器輸出以 `[0]` 為前綴；
Karma 輸出以 `[1]` 為前綴。

把期望值從 `true` 改為 `false`。

_編譯器_監看器會偵測到變更並重新編譯。

<code-example format="." language="bash">
  [0] 1:49:21 PM - File change detected. Starting incremental compilation...
  [0] 1:49:25 PM - Compilation complete. Watching for file changes.

</code-example>

_Karma_ 監看器會偵測到編譯輸出的變更，並重新執行測試。

<code-example format="." language="bash">
  [1] Chrome 51.0.2704 1st tests true is true FAILED
  [1] Expected false to equal true.
  [1] Chrome 51.0.2704: Executed 1 of 1 (1 FAILED) (0.005 secs / 0.005 secs)

</code-example>

當然，它會失敗。

把期望值從 `false` 恢復為 `true`。
兩個程序都偵測到了變更、重新執行，而 Karma 報告完全成功。

<div class="alert is-helpful">

主控台日誌可能相當長。盯著最後一行。
當一切順利時，它會顯示 `SUCCESS`。

</div>

{@a test-debugging}

### 測試除錯

在瀏覽器中為規格除錯的方式，與為應用程式除錯的方式相同。

  1. 顯示 Karma 瀏覽器視窗（先前隱藏的那個）。
  1. 點選 **DEBUG** 按鈕；它會開啟新的瀏覽器分頁並重新執行測試。
  1. 開啟瀏覽器的「Developer Tools」（Windows 上按 `Ctrl-Shift-I`；OSX 上按 `Command-Option-I`）。
  1. 選取「sources」區段。
  1. 開啟 `1st.spec.ts` 測試檔案（按 Control/Command-P，然後開始輸入檔案名稱）。
  1. 在測試中設定中斷點。
  1. 重新整理瀏覽器，它會停在中斷點處。

<figure>
  <img src='generated/images/guide/testing/karma-1st-spec-debug.png' alt="Karma 除錯">
</figure>

{@a live-karma-example}

### 試用線上範例

你也可以在 plunker 中以 <live-example plnkr="1st-specs" title="First spec" embedded-style></live-example> 試用這個測試。
本指南的所有測試都可作為[線上範例](guide/testing#線上範例 "Live examples of these tests")取得。

<hr/>

{@a simple-component-test}

## 測試元件

Angular 元件是大多數開發者最先想測試的東西。
`src/app/banner-inline.component.ts` 中的 `BannerComponent` 是這個應用程式中最簡單的元件，
也是個好的開始。
它在螢幕頂端的 `<h1>` 標籤內呈現應用程式標題。

<code-example path="testing/src/app/banner-inline.component.ts" title="src/app/banner-inline.component.ts" linenums="false">

</code-example>

這個版本的 `BannerComponent` 具有行內範本與插值繫結。
這個元件在現實生活中可能簡單到不值得測試，但
它是初次接觸 Angular 測試公用程式的完美範例。

對應的 `src/app/banner-inline.component.spec.ts` 與元件位於同一個資料夾，
原因在 [FAQ](guide/testing#faq) 對
[「為什麼把 specs 放在它們所測試的東西旁邊？」](guide/testing#q-spec-file-location) 的回答中說明。

從 ES6 import 陳述式開始，以取得 spec 中參照的符號。

<code-example path="testing/src/app/banner-inline.component.spec.ts" region="imports" title="src/app/banner-inline.component.spec.ts (imports)" linenums="false">

</code-example>

{@a configure-testing-module}

以下是 `describe` 以及在測試之前的 `beforeEach`：

<code-example path="testing/src/app/banner-inline.component.spec.ts" region="setup" title="src/app/banner-inline.component.spec.ts (beforeEach)" linenums="false">

</code-example>

{@a testbed}

### _TestBed_

`TestBed` 是 Angular 測試公用程式中第一個也是最重要的一個。
它建立一個 Angular 測試模組&mdash;一個 `@NgModule` 類別&mdash;，
你用 `configureTestingModule` 方法來設定它，以產生你要測試的類別所需的模組環境。
實際上，你把受測元件從它自己的應用程式模組中抽離，
再把它附加到一個動態建構的 Angular 測試模組，
專門為這一組測試量身打造。

`configureTestingModule` 方法接受一個類似 `@NgModule` 的中繼資料物件。
中繼資料物件可以具有一般 [NgModule](guide/ngmodule) 的大多數屬性。

_這個中繼資料物件_僅僅宣告了要測試的元件 `BannerComponent`。
中繼資料缺少 `imports`，因為 (a) 預設的測試模組設定已經具備 `BannerComponent` 所需的一切，
而且 (b) `BannerComponent` 不與任何其他元件互動。

在 `beforeEach` 內呼叫 `configureTestingModule`，這樣
`TestBed` 可以在每個測試執行前，把自己重置為基礎狀態。

基礎狀態包括一個預設的測試模組設定，由
可宣告物件（元件、指令與管道）與提供者（其中一些被 mock）組成，
幾乎每個人都需要它們。

<div class="l-sub-section">

[稍後](guide/testing#testbed-methods)提到的測試 shim，會把測試模組設定初始化為
類似來自 `@angular/platform-browser` 的 `BrowserModule`。

</div>

這個預設設定僅僅是測試應用程式的一個_基礎_。
稍後你會以更多中繼資料呼叫 `TestBed.configureTestingModule`，定義額外的
imports、declarations、providers 與 schemas，以符合你的應用程式測試。
選用的 `override` 方法可以微調設定的某些方面。

{@a create-component}

### _createComponent_

設定好 `TestBed` 之後，你告訴它建立_受測元件_的一個實例。
在本範例中，`TestBed.createComponent` 建立 `BannerComponent` 的一個實例，並
回傳一個[_元件測試 fixture_](guide/testing#component-fixture)。

<div class="alert is-important">

在呼叫 `createComponent` 之後，請勿重新設定 `TestBed`。

</div>

`createComponent` 方法會關閉目前的 `TestBed` 實例，使其無法再進一步設定。
你不能再呼叫任何 `TestBed` 設定方法，不能呼叫 `configureTestingModule`，
也不能呼叫任何 `override...` 方法。如果你嘗試這樣做，`TestBed` 會擲出錯誤。

{@a component-fixture}

### _ComponentFixture_、_DebugElement_ 與 _query(By.css)_

`createComponent` 方法回傳一個 **`ComponentFixture`**，它是用來操作所建立元件周圍測試環境的把手。
fixture 提供對元件實例本身的存取，以及
對 **`DebugElement`** 的存取，後者是用來操作元件 DOM 元素的把手。

`title` 屬性值被插值到 DOM 中 `<h1>` 標籤內。
使用 fixture 的 `DebugElement`，以 CSS 選擇器 `query` 尋找 `<h1>` 元素。

**`query`** 方法接受一個述詞函式，搜尋 fixture 的整個 DOM 樹，尋找
滿足該述詞的_第一個_元素。
結果是一個_不同的_ `DebugElement`，與符合的 DOM 元素相關聯。

<div class="l-sub-section">

`queryAll` 方法回傳滿足該述詞的_所有_ `DebugElements` 的陣列。

_述詞_是一個回傳布林值的函式。
查詢述詞接收一個 `DebugElement`，如果該元素符合選取條件，就回傳 `true`。

</div>

**`By`** 類別是一個 Angular 測試公用程式，能產生有用的述詞。
它的 `By.css` 靜態方法會產生一個
<a href="https://developer.mozilla.org/en-US/docs/Web/Guide/CSS/Getting_started/Selectors">標準 CSS 選擇器</a>
述詞，其篩選方式與 jQuery 選擇器相同。

最後，設定把來自 `DebugElement` **`nativeElement`** 屬性的 DOM 元素指派給 `el`。
測試斷言 `el` 包含預期的標題文字。

{@a the-tests}

### 測試

Jasmine 在這些測試中的每一個之前，都會執行 `beforeEach` 函式

<code-example path="testing/src/app/banner-inline.component.spec.ts" region="tests" title="src/app/banner-inline.component.spec.ts (tests)" linenums="false">

</code-example>

這些測試向 `DebugElement` 索取原生 HTML 元素，以滿足它們的期望。

{@a detect-changes}

### _detectChanges_：測試中的 Angular 變更偵測

每個測試都透過呼叫 `fixture.detectChanges()`，告訴 Angular 何時執行變更偵測。
第一個測試立刻這樣做，觸發資料繫結，並把 `title` 屬性傳播
到 DOM 元素。

第二個測試先變更元件的 `title` 屬性，_然後才_呼叫 `fixture.detectChanges()`；
新值出現在 DOM 元素中。

在正式環境中，當 Angular 建立一個元件、使用者輸入按鍵，或非同步活動（例如 AJAX）完成時，變更偵測會自動啟動。

`TestBed.createComponent` _不會_觸發變更偵測。
fixture 不會自動把元件的 `title` 屬性值推入資料繫結的元素，
下列測試證實了這個事實：

<code-example path="testing/src/app/banner-inline.component.spec.ts" region="test-w-o-detect-changes" title="src/app/banner-inline.component.spec.ts (no detectChanges)" linenums="false">

</code-example>

這種行為（或者缺乏這種行為）是故意的。
它給測試者一個機會，在 Angular 啟動資料繫結或呼叫生命週期鉤子_之前_，檢視或變更元件的狀態。

{@a try-example}

### 試用線上範例
花點時間，以 <live-example plnkr="banner-inline-specs" title="Spec for component with inline template" embedded-style></live-example> 探索這個元件 spec，
並鎖定這些元件單元測試的基本功。

{@a auto-detect-changes}

<a id="%E8%87%AA%E5%8B%95%E8%AE%8A%E6%9B%B4%E5%81%B5%E6%B8%AC"></a>
### 自動變更偵測

`BannerComponent` 測試經常呼叫 `detectChanges`。
有些測試人員偏好 Angular 測試環境自動執行變更偵測。

這可以透過使用 `ComponentFixtureAutoDetect` 提供者來設定 `TestBed` 達成。
先從測試工具程式庫匯入它：

<code-example path="testing/src/app/banner.component.detect-changes.spec.ts" region="import-ComponentFixtureAutoDetect" title="src/app/banner.component.detect-changes.spec.ts (import)" linenums="false">

</code-example>

然後將它加入測試模組設定的 `providers` 陣列：

<code-example path="testing/src/app/banner.component.detect-changes.spec.ts" region="auto-detect" title="src/app/banner.component.detect-changes.spec.ts (AutoDetect)" linenums="false">

</code-example>

以下是三個示範自動變更偵測如何運作的測試。

<code-example path="testing/src/app/banner.component.detect-changes.spec.ts" region="auto-detect-tests" title="src/app/banner.component.detect-changes.spec.ts (AutoDetect Tests)" linenums="false">

</code-example>

第一個測試展示了自動變更偵測的好處。

第二個與第三個測試揭示了一個重要的限制。
Angular 測試環境*不知道*測試變更了元件的 `title`。
`ComponentFixtureAutoDetect` 服務會回應*非同步活動*，例如 promise 解析、計時器與 DOM 事件。
但對元件屬性的直接、同步更新是看不見的。
測試必須手動呼叫 `fixture.detectChanges()`，觸發另一輪變更偵測。

<div class="alert is-helpful">

與其猜測測試 fixture 何時會、何時不會執行變更偵測，本指南的範例*一律*明確地呼叫 `detectChanges()`。
比嚴格需要的次數更常呼叫 `detectChanges()`，也沒有壞處。

</div>

<hr/>

{@a component-with-external-template}

## 測試具有外部範本的元件
應用程式實際的 `BannerComponent` 行為與上面的版本相同，但實作方式不同。
它具有_外部_範本與 css 檔案，在 `templateUrl` 與 `styleUrls` 屬性中指定。

<code-example path="testing/src/app/banner.component.ts" title="src/app/banner.component.ts" linenums="false">

</code-example>

這對測試來說是個問題。
`TestBed.createComponent` 方法是同步的。
但 Angular 範本編譯器必須先從檔案系統讀取外部檔案，才能建立元件實例。
那是一個非同步的活動。
先前測試行內元件的設定，對具有外部範本的元件行不通。

<div id='async-in-before-each'>

</div>

### 第一個非同步的 _beforeEach_

`BannerComponent` 的測試設定必須給 Angular 範本編譯器時間來讀取檔案。
先前 spec 中 `beforeEach` 的邏輯被拆成兩個 `beforeEach` 呼叫。
第一個 `beforeEach` 處理非同步編譯。

<code-example path="testing/src/app/banner.component.spec.ts" region="async-before-each" title="src/app/banner.component.spec.ts (first beforeEach)" linenums="false">

</code-example>

注意作為 `beforeEach` 引數呼叫的 `async` 函式。
`async` 函式是 Angular 測試公用程式之一，
而且必須匯入。

<code-example path="testing/src/app/banner.component.detect-changes.spec.ts" region="import-async" title="src/app/banner.component.detect-changes.spec.ts" linenums="false">

</code-example>

它接受一個無參數的函式，_並傳回一個函式_，
該函式成為 `beforeEach` 真正的引數。

`async` 引數的主體看起來很像同步 `beforeEach` 的主體。
其中沒有任何明顯的非同步之處。
例如，它不傳回 promise，
也沒有像標準 Jasmine 非同步測試那樣要呼叫的 `done` 函式。
在內部，`async` 會安排 `beforeEach` 的主體在一個特殊的_非同步測試區_中執行，
隱藏非同步執行的機制。

這一切都是為了呼叫非同步的 `TestBed.compileComponents` 方法所必需的。

{@a compile-components}

### _compileComponents_
`TestBed.configureTestingModule` 方法會傳回 `TestBed` 類別，因此你可以鏈式呼叫
其他 `TestBed` 靜態方法，例如 `compileComponents`。

`TestBed.compileComponents` 方法會以非同步方式編譯測試模組中設定的所有元件。
在本範例中，`BannerComponent` 是唯一要編譯的元件。
當 `compileComponents` 完成時，外部範本與 css 檔案已被「行內化」，
而 `TestBed.createComponent` 可以同步建立 `BannerComponent` 的新實例。

<div class="l-sub-section">

Webpack 開發者不需要呼叫 `compileComponents`，因為它會在執行測試前的自動化建置過程中，把範本與 css 行內化。

</div>

在本範例中，`TestBed.compileComponents` 只編譯 `BannerComponent`。
本指南後面的測試宣告了多個元件，
而且一些 spec 匯入了整個應用程式模組，其中還有更多元件。
這些元件中的任何一個都可能具有外部範本與 css 檔案。
`TestBed.compileComponents` 會一次以非同步方式編譯所有已宣告的元件。

<div class="alert is-important">

不要在呼叫 `compileComponents` 之後再設定 `TestBed`。
讓 `compileComponents` 成為呼叫 `TestBed.createComponent` 來建立_受測元件_之前的最後一步。

</div>

呼叫 `compileComponents` 會關閉目前的 `TestBed` 實例，使其無法再進一步設定。
你不能再呼叫任何 `TestBed` 設定方法，不能呼叫 `configureTestingModule`，
也不能呼叫任何 `override...` 方法。如果你嘗試這樣做，`TestBed` 會擲出錯誤。

{@a second-before-each}

### 第二個同步的 _beforeEach_
一個包含其餘設定步驟的_同步_ `beforeEach`，接在非同步 `beforeEach` 之後。

<code-example path="testing/src/app/banner.component.spec.ts" region="sync-before-each" title="src/app/banner.component.spec.ts (second beforeEach)" linenums="false">

</code-example>

這些步驟與原始 `beforeEach` 中的相同。
它們包括建立 `BannerComponent` 的一個實例，以及查詢要檢視的元素。

你可以放心，測試執行器會等第一個非同步 `beforeEach` 完成後，才呼叫第二個。

{@a waiting-compile-components}

### 等待 _compileComponents_

`compileComponents` 方法傳回一個 promise，因此你可以在它完成_之後立刻_執行額外的任務。
例如，你可以把第二個 `beforeEach` 中的同步程式碼
移入 `compileComponents().then(...)` 回呼中，只撰寫一個 `beforeEach`。

大多數開發者覺得那很難閱讀。
兩個 `beforeEach` 呼叫被廣泛偏好。

{@a live-external-template-example}

### 試用線上範例

花點時間，以 <live-example plnkr="banner-specs" title="Spec for component with external template" embedded-style></live-example> 探索這個元件 spec。

<div class="l-sub-section">

[Quickstart 種子](guide/setup)提供了其 `AppComponent` 的類似測試，
如你在_這個_ <live-example name="setup" plnkr="quickstart-specs" title="QuickStart seed spec" embedded-style></live-example> 中所見。
它也呼叫了 `compileComponents`，雖然它不必這麼做，因為 `AppComponent` 的範本是行內的。

這樣做沒有壞處，而且你不妨還是呼叫 `compileComponents`，
以防你日後決定把範本重構成獨立的檔案。
本指南中的測試只在必要時才呼叫 `compileComponents`。

</div>

<hr/>

{@a component-with-dependency}

## 測試具有相依性的元件
元件經常有服務相依性。

`WelcomeComponent` 會向已登入的使用者顯示歡迎訊息。
它依據注入的 `UserService` 的某個屬性，知道使用者是誰：

<code-example path="testing/src/app/welcome.component.ts" title="src/app/welcome.component.ts" linenums="false">

</code-example>

`WelcomeComponent` 具有與服務互動的決策邏輯，這些邏輯讓這個元件值得測試。
以下是 spec 檔案 `src/app/welcome.component.spec.ts` 的測試模組設定：

<code-example path="testing/src/app/welcome.component.spec.ts" region="config-test-module" title="src/app/welcome.component.spec.ts" linenums="false">

</code-example>

這次，除了宣告*受測元件*之外，
這個設定還把一個 `UserService` 提供者加入 `providers` 清單。
但不是真實的 `UserService`。

{@a service-test-doubles}

### 提供服務測試替身

*受測元件*不一定要注入真實的服務。
事實上，如果它們是測試替身，例如 stub、fake、spy 或 mock，通常更好。
這個 spec 的目的是測試元件，而不是服務，而真實的服務可能帶來麻煩。

注入真實的 `UserService` 可能是一場噩夢。
真實的服務可能會要求使用者提供登入憑證，並嘗試連線到驗證伺服器。
這些行為可能很難攔截。
建立並註冊一個測試替身來代替真實的 `UserService`，要容易也安全得多。

這個特定的測試套件提供了一個滿足 `WelcomeComponent` 及其測試需求的最小 `UserService` stub：

<code-example path="testing/src/app/welcome.component.spec.ts" region="user-service-stub" title="src/app/welcome.component.spec.ts" linenums="false">

</code-example>

{@a get-injected-service}

### 取得注入的服務
測試需要存取注入到 `WelcomeComponent` 中的（stub）`UserService`。

Angular 有一套階層式注入系統。
從 `TestBed` 建立的根注入器，一路往下到元件樹，注入器可以存在於多個層級。

取得注入服務最安全、**永遠有效**的方法，
是**從受測元件的注入器取得它**。
元件注入器是 fixture 的 `DebugElement` 的一個屬性。

<code-example path="testing/src/app/welcome.component.spec.ts" region="injected-service" title="WelcomeComponent's injector" linenums="false">

</code-example>

{@a testbed-get}

### _TestBed.get_

你_也許_還能透過 `TestBed.get` 從根注入器取得服務。
這更容易記住，也更簡潔。
但它只有在 Angular 以測試根注入器中的服務實例注入元件時才有效。
幸運的是，在這個測試套件中，`UserService` 的_唯一_提供者是根測試模組，
因此可以安全地像這樣呼叫 `TestBed.get`：

<code-example path="testing/src/app/welcome.component.spec.ts" region="inject-from-testbed" title="TestBed injector" linenums="false">

</code-example>

<div class="l-sub-section">

[`inject`](guide/testing#inject) 公用程式函式，是從測試根注入器取得一個或多個服務的另一種方式。

關於 `inject` 與 `TestBed.get` 都行不通的使用情境，
請參閱[_覆寫元件的提供者_](guide/testing#component-override)一節，該節
解釋了為什麼你必須改從元件的注入器取得服務。

</div>

{@a service-from-injector}

### 一律從注入器取得服務
不要_在你的測試主體中參照提供給測試模組的 `userServiceStub` 物件。
**這樣行不通！**
注入到元件中的 `userService` 實例是一個完全_不同_的物件，
是所提供的 `userServiceStub` 的複製品。

<code-example path="testing/src/app/welcome.component.spec.ts" region="stub-not-injected" title="src/app/welcome.component.spec.ts" linenums="false">

</code-example>

{@a welcome-spec-setup}

### 最終設定與測試
以下是使用 `TestBed.get` 的完整 `beforeEach`：

<code-example path="testing/src/app/welcome.component.spec.ts" region="setup" title="src/app/welcome.component.spec.ts" linenums="false">

</code-example>

以下是一些測試：

<code-example path="testing/src/app/welcome.component.spec.ts" region="tests" title="src/app/welcome.component.spec.ts" linenums="false">

</code-example>

第一個是健全性測試；它確認被 stub 的 `UserService` 有被呼叫且正常運作。

<div class="l-sub-section">

Jasmine 比對器的第二個參數（例如 `'expected name'`）是一個選擇性的附加說明。
如果期望失敗，Jasmine 會在期望失敗訊息之後顯示這個附加說明。
在具有多個期望的 spec 中，它能幫助釐清出了什麼問題，以及是哪個期望失敗。

</div>

其餘的測試則確認服務傳回不同值時元件的邏輯。
第二個測試驗證變更使用者名稱的效果。
第三個測試檢查在沒有已登入使用者時，元件是否顯示適當的訊息。

<hr/>

{@a component-with-async-service}

## 測試具有非同步服務的元件
許多服務會以非同步方式傳回值。
大多數資料服務會向遠端伺服器發出 HTTP 請求，而回應必然是非同步的。

這個範例中的「About」檢視顯示了 Mark Twain 的名言。
`TwainComponent` 負責顯示，把伺服器請求委派給 `TwainService`。

兩者都位於 `src/app/shared` 資料夾中，因為作者打算有朝一日在其他頁面上顯示 Twain 名言。
以下是 `TwainComponent`。

<code-example path="testing/src/app/shared/twain.component.ts" region="component" title="src/app/shared/twain.component.ts" linenums="false">

</code-example>

`TwainService` 的實作對這個特定的測試來說無關緊要。
只需要在 `ngOnInit` 中看到 `twainService.getQuote` 傳回一個 promise，就足以知道它是非同步的。

一般而言，測試不應該呼叫遠端伺服器。
它們應該模擬這類呼叫。這個 `src/app/shared/twain.component.spec.ts` 中的設定展示了其中一種做法：

<code-example path="testing/src/app/shared/twain.component.spec.ts" region="setup" title="src/app/shared/twain.component.spec.ts (setup)" linenums="false">

</code-example>

{@a service-spy}

### 監視真正的服務

這個設定類似於 [`welcome.component.spec` 設定](guide/testing#welcome-spec-setup)。
但它不是建立一個 stub 服務物件，而是注入_真正的_服務（見測試模組的 `providers`），並
以 Jasmine spy 取代關鍵的 `getQuote` 方法。

<code-example path="testing/src/app/shared/twain.component.spec.ts" region="spy" title="src/app/shared/twain.component.spec.ts" linenums="false">

</code-example>

這個 spy 的設計是：任何對 `getQuote` 的呼叫，都會收到一個以測試名言立即解析的 promise。
spy 繞過了真正的 `getQuote` 方法，因此不會連絡伺服器。

<div class="l-sub-section">

偽造服務實例與監視真正的服務_都是_很好的選擇。
挑選對目前測試套件來說似乎最容易的那一個。
不要害怕改變主意。

監視真正的服務不總是容易的，尤其是當真正的服務具有注入的相依性時。
你可以同時_stub 與 spy_，如[下面的範例](guide/testing#spy-stub)所示。

</div>

以下是這些測試，隨後附有評論：

<code-example path="testing/src/app/shared/twain.component.spec.ts" region="tests" title="src/app/shared/twain.component.spec.ts (tests)">

</code-example>

{@a sync-tests}

### 同步測試
前兩個測試是同步的。
多虧了 spy，它們驗證了 `getQuote` 是在 Angular 呼叫 `ngOnInit` 的第一個變更偵測週期_之後_被呼叫的。

這兩個測試都無法證明來自服務的值有被顯示。
名言本身還沒到達，儘管 spy 傳回了一個已解析的 promise。

這個測試必須至少等候 JavaScript 引擎的一整個回合，
值才會變得可用。這個測試必須變成_非同步_的。

{@a async}

### _it_ 中的 _async_ 函式

注意第三個測試中的 `async`。

<code-example path="testing/src/app/shared/twain.component.spec.ts" region="async-test" title="src/app/shared/twain.component.spec.ts (async test)" linenums="false">

</code-example>

`async` 函式是 Angular 測試公用程式之一。
它透過安排測試者的程式碼在一個特殊的_非同步測試區_中執行，簡化了非同步測試的撰寫，
如[先前討論的](guide/testing#async-in-before-each)，當時它是在 `beforeEach` 中被呼叫的。

雖然 `async` 在隱藏非同步樣板方面做得很好，
但在測試中呼叫的一些函式（例如 `fixture.whenStable`）仍會揭露它們的非同步行為。

<div class="l-sub-section">

下面介紹的 `fakeAsync` 替代方案，[見下文](guide/testing#fake-async)，移除了這個痕跡，並提供更線性的撰寫體驗。

</div>

{@a when-stable}

### _whenStable_
測試必須等候 `getQuote` promise 在 JavaScript 引擎的下一回合中解析。

這個測試無法直接存取呼叫 `twainService.getQuote` 所傳回的 promise，
因為它埋藏在 `TwainComponent.ngOnInit` 內部，因此對於只探查元件 API 表面的測試來說無法存取。

幸運的是，`getQuote` promise 可供_非同步測試區_存取，
該測試區會攔截在 _async_ 方法呼叫內發出的所有 promise，_無論它們出現在何處_。

`ComponentFixture.whenStable` 方法傳回它自己的 promise，
該 promise 會在 `getQuote` promise 完成時解析。
事實上，_whenStable_ promise 會在_這個測試內所有擱置中的非同步活動_都完成時解析&mdash;這就是「穩定」的定義。

然後測試恢復，並啟動另一回合的變更偵測（`fixture.detectChanges`），
告訴 Angular 以名言更新 DOM。
`getQuote` 輔助方法萃取顯示元素的文字，而期望確認該文字與測試名言相符。

{@a fakeAsync}

{@a fake-async}

### _fakeAsync_ 函式

第四個測試以不同的方式驗證相同的元件行為。

<code-example path="testing/src/app/shared/twain.component.spec.ts" region="fake-async-test" title="src/app/shared/twain.component.spec.ts (fakeAsync test)" linenums="false">

</code-example>

注意 `fakeAsync` 取代了 `async`，成為 `it` 的引數。
`fakeAsync` 函式是 Angular 測試公用程式中的另一個。

與 [async](guide/testing#async) 一樣，它_接受_一個無參數的函式，並_傳回_一個函式，
該函式成為 Jasmine `it` 呼叫的引數。

`fakeAsync` 函式透過在一個特殊的 _fakeAsync 測試區_中執行測試主體，啟用線性的程式撰寫風格。

`fakeAsync` 相較於 `async` 的主要優勢是，測試看起來是同步的。
沒有 `then(...)` 來打斷可見的控制流程。
會傳回 promise 的 `fixture.whenStable` 不見了，取而代之的是 `tick()`。

<div class="l-sub-section">

確實_有_限制。例如，你不能從 `fakeAsync` 內部發出 XHR 呼叫。

</div>

{@a tick}

### _tick_ 函式
`tick` 函式是 Angular 測試公用程式之一，也是 `fakeAsync` 的夥伴。
你只能在 `fakeAsync` 主體內呼叫它。

呼叫 `tick()` 會模擬時間的流逝，直到所有擱置中的非同步活動完成，
包括在這個測試案例中 `getQuote` promise 的解析。

它不傳回任何東西。沒有 promise 需要等待。
以出現在 `whenStable.then()` 回呼中的相同測試程式碼繼續進行。

即使是這個簡單的範例，也比第三個測試更容易閱讀。
若要更充分地體會這種改進，想像一連串的非同步操作，
串連在一長串的 promise 回呼中。

{@a jasmine-done}

### _jasmine.done_
雖然 `async` 與 `fakeAsync` 函式大大
簡化了 Angular 非同步測試，
你仍然可以退回到傳統的 Jasmine 非同步測試技巧。

你仍然可以傳給 `it` 一個接受 [`done` 回呼](http://jasmine.github.io/2.0/introduction.html#section-Asynchronous_Support) 的函式。
現在你要負責串連 promise、處理錯誤，並在適當的時機呼叫 `done`。

以下是前兩個測試的 `done` 版本：

<code-example path="testing/src/app/shared/twain.component.spec.ts" region="done-test" title="src/app/shared/twain.component.spec.ts (done test)" linenums="false">

</code-example>

雖然無法直接存取 `TwainComponent` 內部的 `getQuote` promise，
但 spy 可以直接存取，這使得等候 `getQuote` 完成成為可能。

以 `done` 撰寫測試函式，雖然比 `async`
與 `fakeAsync` 更繁瑣，但它是一種可行且偶爾必要的技巧。
例如，在測試涉及 `intervalTimer` 的程式碼時，你不能呼叫 `async` 或 `fakeAsync`，
這在測試非同步 `Observable` 方法時很常見。

<hr/>

{@a component-with-input-output}

## 測試具有 inputs 與 outputs 的元件
具有 inputs 與 outputs 的元件通常出現在宿主元件的檢視範本內部。
宿主使用屬性繫結來設定輸入屬性，並使用事件繫結來
監聽由輸出屬性引發的事件。

測試的目標是驗證這類繫結是否如預期運作。
測試應該設定輸入值，並監聽輸出事件。

`DashboardHeroComponent` 是扮演這個角色的一個小範例元件。
它顯示由 `DashboardComponent` 提供的一位英雄。
點選該英雄會告訴 `DashboardComponent`，使用者已選取該英雄。

`DashboardHeroComponent` 像這樣內嵌在 `DashboardComponent` 範本中：

<code-example path="testing/src/app/dashboard/dashboard.component.html" region="dashboard-hero" title="src/app/dashboard/dashboard.component.html (excerpt)" linenums="false">

</code-example>

`DashboardHeroComponent` 出現在一個 `*ngFor` 重複器中，該重複器將每個元件的 `hero` 輸入屬性設為迴圈的值，並監聽元件的 `selected` 事件。

以下是該元件的定義：

<code-example path="testing/src/app/dashboard/dashboard-hero.component.ts" region="component" title="src/app/dashboard/dashboard-hero.component.ts (component)" linenums="false">

</code-example>

雖然測試這麼簡單的元件本身沒有多少價值，但知道怎麼做還是有用的。
請使用下列方法之一：

* 以 `DashboardComponent` 使用它的方式來測試它。
* 以獨立元件的方式來測試它。
* 以 `DashboardComponent` 替代品使用它的方式來測試它。

快速看一眼 `DashboardComponent` 的建構函式，就會讓人打消第一個方法的念頭：

<code-example path="testing/src/app/dashboard/dashboard.component.ts" region="ctor" title="src/app/dashboard/dashboard.component.ts (constructor)" linenums="false">

</code-example>

`DashboardComponent` 相依於 Angular 路由器與 `HeroService`。
你可能必須把兩者都換成測試替身，那是很多工作。
路由器看起來特別具有挑戰性。

<div class="l-sub-section">

[下面的討論](guide/testing#routed-component)涵蓋了需要路由器的元件之測試。

</div>

眼前的目標是測試 `DashboardHeroComponent`，而不是 `DashboardComponent`，所以請試試第二與第三個選項。

{@a dashboard-standalone}

### 獨立測試 _DashboardHeroComponent_

以下是 spec 檔案設定。

<code-example path="testing/src/app/dashboard/dashboard-hero.component.spec.ts" region="setup" title="src/app/dashboard/dashboard-hero.component.spec.ts (setup)" linenums="false">

</code-example>

非同步 `beforeEach` 已在[上文](guide/testing#component-with-external-template)討論過。
以 `compileComponents` 非同步編譯元件之後，其餘設定
在_第二個_ `beforeEach` 中_同步_進行，使用[稍早](guide/testing#simple-component-test)描述的基本技巧。

請注意，設定程式碼如何將測試英雄（`expectedHero`）指派給元件的 `hero` 屬性，
模擬 `DashboardComponent` 在其 repeater 中使用屬性繫結來設定它的方法。

第一個測試如下：

<code-example path="testing/src/app/dashboard/dashboard-hero.component.spec.ts" region="name-test" title="src/app/dashboard/dashboard-hero.component.spec.ts (name test)" linenums="false">

</code-example>

它驗證了英雄名稱透過繫結傳播到範本。
因為範本讓英雄名稱通過 Angular `UpperCasePipe`，
測試必須以轉成大寫的名稱來比對元素的值：

<code-example path="testing/src/app/dashboard/dashboard-hero.component.html" title="src/app/dashboard/dashboard-hero.component.html" linenums="false">

</code-example>

<div class="alert is-helpful">

這個小型測試示範了 Angular 測試如何驗證元件的視覺
呈現&mdash;這是[隔離式單元測試](guide/testing#isolated-component-tests)無法做到的&mdash;以
低成本進行，而且不需要訴諸慢得多也複雜得多的端對端測試。

</div>

第二個測試驗證點選行為。點選英雄應該引發一個 `selected` 事件，讓
宿主元件（推測是 `DashboardComponent`）能聽到：

<code-example path="testing/src/app/dashboard/dashboard-hero.component.spec.ts" region="click-test" title="src/app/dashboard/dashboard-hero.component.spec.ts (click test)" linenums="false">

</code-example>

元件公開了一個 `EventEmitter` 屬性。測試訂閱它，就像宿主元件會做的那樣。

`heroEl` 是一個代表英雄 `<div>` 的 `DebugElement`。
測試以「click」事件名稱呼叫 `triggerEventHandler`。
「click」事件繫結會以呼叫 `DashboardHeroComponent.click()` 來回應。

如果元件如預期運作，`click()` 會告訴元件的 `selected` 屬性發出 `hero` 物件，
測試透過它對 `selected` 的訂閱偵測到該值，而測試應該通過。

{@a trigger-event-handler}

### _triggerEventHandler_

Angular 的 `DebugElement.triggerEventHandler` 可以依_事件名稱_引發_任何資料繫結事件_。
第二個參數是傳給處理常式的事件物件。

在本範例中，測試以 null 事件物件觸發了一個「click」事件。

<code-example path="testing/src/app/dashboard/dashboard-hero.component.spec.ts" region="trigger-event-handler" title="src/app/dashboard/dashboard-hero.component.spec.ts" linenums="false">

</code-example>

測試假設（在這個案例中是正確的）執行階段的
事件處理常式&mdash;也就是元件的 `click()` 方法&mdash;不在意事件物件。

其他處理常式就沒這麼寬容了。例如，`RouterLink`
指令預期一個具有 `button` 屬性的物件，
用來識別按下了哪個滑鼠按鈕。
如果事件物件沒有正確做到這一點，這個指令會擲出錯誤。

{@a click-helper}

點選按鈕、錨點或任意 HTML 元素，是常見的測試工作。

把_觸發點選_的過程封裝在像下面的 `click` 函式這樣的輔助函式中，讓這件事變得簡單：

<code-example 
  path="testing/src/testing/index.ts" 
  region="click-event" 
  title="testing/index.ts (click helper)" linenums="false">
</code-example>

第一個參數是_要點選的元素_。如果你想的話，可以傳入
自訂事件物件作為第二個參數。預設值是一個（部分的）
<a href="https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/button">左鍵滑鼠事件物件</a>，
許多處理常式（包括 `RouterLink` 指令）都接受它。

<div class="callout is-critical">

<header>
  click() 不是 Angular 測試公用程式
</header>

`click()` 輔助函式**不是** Angular 測試公用程式之一。
它是定義在_本指南範例程式碼_中的函式。
所有的範例測試都使用它。
如果你喜歡它，就將它加入你自己的輔助函式收藏中。

</div>

以下是上一個測試，以這個 click 輔助函式改寫後的版本。

<code-example path="testing/src/app/dashboard/dashboard-hero.component.spec.ts" region="click-test-2" title="src/app/dashboard/dashboard-hero.component.spec.ts (click test revised)" linenums="false">

</code-example>

<hr/>

{@a component-inside-test-host}

## 在測試宿主元件內測試元件

在前面的方法中，測試本身扮演了宿主 `DashboardComponent` 的角色。
但當 `DashboardHeroComponent` 被正確資料繫結到一個宿主元件時，它能正常運作嗎？

以真正的 `DashboardComponent` 宿主進行測試是可行的，但似乎麻煩大於價值。
以像這樣的_測試宿主_來模擬 `DashboardComponent` 宿主更容易：

<code-example path="testing/src/app/dashboard/dashboard-hero.component.spec.ts" region="test-host" title="src/app/dashboard/dashboard-hero.component.spec.ts (test host)" linenums="false">

</code-example>

測試宿主以 `DashboardComponent` 會用的方式繫結到 `DashboardHeroComponent`，但沒有
`Router`、`HeroService`，甚至 `*ngFor` 重複器的干擾。

測試宿主以它的測試英雄設定元件的 `hero` 輸入屬性。
它以自己的 `onSelected` 處理常式繫結元件的 `selected` 事件，
該處理常式把發出的英雄記錄
在它的 `selectedHero` 屬性中。稍後，測試會檢查該屬性，以驗證
`DashboardHeroComponent.selected` 事件發出了正確的英雄。

測試宿主測試的設定與獨立測試的設定相似：

<code-example path="testing/src/app/dashboard/dashboard-hero.component.spec.ts" region="test-host-setup" title="src/app/dashboard/dashboard-hero.component.spec.ts (test host setup)" linenums="false">

</code-example>

這個測試模組設定展示了兩個重要的差異：

1. 它_宣告_了 `DashboardHeroComponent` 與 `TestHostComponent` 兩者。
1. 它_建立_了 `TestHostComponent`，而不是 `DashboardHeroComponent`。

`createComponent` 傳回的 `fixture` 持有的是 `TestHostComponent` 的實例，而不是 `DashboardHeroComponent` 的實例。

建立 `TestHostComponent` 的副作用是建立了一個 `DashboardHeroComponent`，因為後者出現在前者的範本中。
對英雄元素的查詢（`heroEl`）仍然能在測試 DOM 中找到它，儘管它在元素樹中的深度比之前更大。

這些測試本身與獨立版本幾乎完全相同：

<code-example path="testing/src/app/dashboard/dashboard-hero.component.spec.ts" region="test-host-tests" title="src/app/dashboard/dashboard-hero.component.spec.ts (test-host)" linenums="false">

</code-example>

只有 selected 事件測試不同。
它確認所選的 `DashboardHeroComponent` 英雄確實透過事件繫結一路傳遞到宿主元件。

<hr/>

{@a routed-component}

## 測試路由元件

測試真正的 `DashboardComponent` 之所以看起來令人卻步，是因為它注入了 `Router`。

<code-example path="testing/src/app/dashboard/dashboard.component.ts" region="ctor" title="src/app/dashboard/dashboard.component.ts (constructor)" linenums="false">

</code-example>

它也注入了 `HeroService`，但偽造那個是一個[熟悉的故事](guide/testing#component-with-async-service)。
`Router` 有一個複雜的 API，而且與其他服務和應用程式先決條件糾纏在一起。

幸運的是，`DashboardComponent` 並沒有用 `Router` 做太多事

<code-example path="testing/src/app/dashboard/dashboard.component.ts" region="goto-detail" title="src/app/dashboard/dashboard.component.ts (goToDetail)" linenums="false">

</code-example>

這種情況很常見。
原則上，你測試的是元件，而不是路由器，
你只在乎元件是否在給定條件下以正確的地址導航。
以測試實作來 stub 路由器是一個簡單的選項。這應該可以解決問題：

<code-example path="testing/src/app/dashboard/dashboard.component.spec.ts" region="router-stub" title="src/app/dashboard/dashboard.component.spec.ts (Router Stub)" linenums="false">

</code-example>

現在，以 `Router` 與 `HeroService` 的測試 stub 設定測試模組，並
建立 `DashboardComponent` 的一個測試實例，供後續測試使用。

<code-example path="testing/src/app/dashboard/dashboard.component.spec.ts" region="compile-and-create-body" title="src/app/dashboard/dashboard.component.spec.ts (compile and create)" linenums="false">

</code-example>

下列測試點選顯示的英雄，並確認（在 spy 的幫助下）`Router.navigateByUrl` 以預期的 url 被呼叫。

<code-example path="testing/src/app/dashboard/dashboard.component.spec.ts" region="navigate-test" title="src/app/dashboard/dashboard.component.spec.ts (navigate test)" linenums="false">

</code-example>

{@a inject}

### _inject_ 函式

注意第二個 `it` 引數中的 `inject` 函式。

<code-example path="testing/src/app/dashboard/dashboard.component.spec.ts" region="inject" title="src/app/dashboard/dashboard.component.spec.ts" linenums="false">

</code-example>

`inject` 函式是 Angular 測試公用程式之一。
它把服務注入到測試函式中，你可以在那裡變更、監視並操作它們。

`inject` 函式有兩個參數：

1. 一個 Angular 相依性注入權杖的陣列。
1. 一個測試函式，其參數與注入權杖陣列中的每個項目精確對應。

<div class="callout is-important">

<header>
  inject 使用 TestBed 注入器
</header>

`inject` 函式使用目前的 `TestBed` 注入器，只能傳回在該層級提供的服務。
它不會傳回來自元件提供者的服務。

</div>

這個範例從目前的 `TestBed` 注入器注入 `Router`。
這對這個測試來說沒問題，因為 `Router` 是、而且必須是，由應用程式根注入器提供的。

如果你需要由元件_自己的_注入器提供的服務，改呼叫 `fixture.debugElement.injector.get`：

<code-example path="testing/src/app/welcome.component.spec.ts" region="injected-service" title="Component's injector" linenums="false">

</code-example>

<div class="alert is-important">

使用元件自己的注入器，來取得真正注入到元件中的服務。

</div>

`inject` 函式會關閉目前的 `TestBed` 實例，使其無法再進一步設定。
你不能再呼叫任何 `TestBed` 設定方法，不能呼叫 `configureTestingModule`，
也不能呼叫任何 `override...` 方法。如果你嘗試這樣做，`TestBed` 會擲出錯誤。

<div class="alert is-important">

不要在呼叫 `inject` 之後再設定 `TestBed`。

</div>

{@a routed-component-w-param}

### 測試具有參數的路由元件

點選一個 _Dashboard_ 英雄會觸發導航到 `heroes/:id`，其中 `:id`
是一個路由參數，其值是要編輯之英雄的 `id`。
該 URL 符合一條通往 `HeroDetailComponent` 的路由。

路由器把 `:id` 權杖值推入 `ActivatedRoute.params` _Observable_ 屬性，
Angular 把 `ActivatedRoute` 注入到 `HeroDetailComponent`，
而元件萃取 `id`，以便透過 `HeroDetailService` 取得對應的英雄。
以下是 `HeroDetailComponent` 建構子：

<code-example path="testing/src/app/hero/hero-detail.component.ts" region="ctor" title="src/app/hero/hero-detail.component.ts (constructor)" linenums="false">

</code-example>

`HeroDetailComponent` 在其 `ngOnInit` 方法中訂閱 `ActivatedRoute.params` 的變更。

<code-example path="testing/src/app/hero/hero-detail.component.ts" region="ng-on-init" title="src/app/hero/hero-detail.component.ts (ngOnInit)" linenums="false">

</code-example>

<div class="l-sub-section">

`route.params` 後面的運算式串連了一個 _Observable_ 運算子，從 `params` 中_萃取（pluck）_ `id`，
然後串連一個 `forEach` 運算子，來訂閱 `id` 變更事件。
每當使用者導航到不同英雄時，`id` 就會改變。

`forEach` 把新的 `id` 值傳給元件的 `getHero` 方法（未顯示），
該方法取得一位英雄，並設定元件的 `hero` 屬性。
如果 `id` 參數缺失，`pluck` 運算子會失敗，而 `catch` 把失敗視為編輯新英雄的請求。

[Router](guide/router#route-parameters) 指南更詳細地涵蓋了 `ActivatedRoute.params`。

</div>

測試可以探索 `HeroDetailComponent` 如何回應不同的 `id` 參數值，
方法是操縱注入到元件建構子中的 `ActivatedRoute`。

到目前為止，你已經知道如何 stub `Router` 與資料服務。
Stub `ActivatedRoute` 遵循相同的模式，除了有一個複雜之處：
`ActivatedRoute.params` 是一個 _Observable_。

{@a stub-observable}

### 建立一個 _Observable_ 測試替身

`hero-detail.component.spec.ts` 依賴一個 `ActivatedRouteStub`，為每個測試設定 `ActivatedRoute.params` 值。
這是一個跨應用程式、可重複使用的_測試輔助類別_。
考慮將這類輔助程式放在與 `app` 資料夾同層的 `testing` 資料夾中。
本範例把 `ActivatedRouteStub` 放在 `testing/router-stubs.ts`：

<code-example path="testing/src/testing/router-stubs.ts" region="activated-route-stub" title="testing/router-stubs.ts (ActivatedRouteStub)" linenums="false">

</code-example>

這個 stub 的顯著特點是：

* 這個 stub 只實作了 `ActivatedRoute` 的兩項能力：`params` 與 `snapshot.params`。

* <a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/subjects/behaviorsubject.md">_BehaviorSubject_</a>
驅動 stub 的 `params` _Observable_，並把相同的值傳回給每個 `params` 訂閱者，直到它被賦予新值為止。

* `HeroDetailComponent` 把它的運算式串連到這個 stub 的 `params` _Observable_，而該 Observable 現在由測試者控制。

* 設定 `testParams` 屬性會使 `subject` 把指派的值推入 `params`。
 那會以與導航相同的方式，觸發上述的 `HeroDetailComponent` _params_ 訂閱。

* 設定 `testParams` 屬性也會更新 stub 內部要為 `snapshot` 屬性傳回的值。

<div class="l-sub-section">

[_snapshot_](guide/router#snapshot "Router guide: snapshot") 是元件使用路由參數的另一種熱門方式。

</div>

<div class="callout is-helpful">

本指南中的路由器 stub 旨在啟發你。建立你自己的 stub，以符合你的測試需求。

</div>

{@a tests-w-observable-double}

### 使用 _Observable_ 測試替身進行測試
以下是一個測試，示範當觀察到的 `id` 指向一位現有的英雄時，元件的行為：

<code-example path="testing/src/app/hero/hero-detail.component.spec.ts" region="route-good-id" title="src/app/hero/hero-detail.component.spec.ts (existing id)" linenums="false">

</code-example>

<div class="l-sub-section">

`createComponent` 方法與 `page` 物件在[下一節](guide/testing#page-object)中討論。
先憑直覺理解即可。

</div>

當找不到 `id` 時，元件應該重新路由到 `HeroListComponent`。
測試套件設定提供了[上文描述的](guide/testing#routed-component)相同 `RouterStub`，它監視路由器，但不真正導航。
這個測試提供了一個「壞的」id，並期望元件嘗試導航。

<code-example path="testing/src/app/hero/hero-detail.component.spec.ts" region="route-bad-id" title="src/app/hero/hero-detail.component.spec.ts (bad id)" linenums="false">

</code-example>

雖然這個應用程式沒有一條省略 `id` 參數、通往 `HeroDetailComponent` 的路由，但將來某天可能會加入這樣一條路由。
當沒有 `id` 時，元件應該做一些合理的事。

在這個實作中，元件應該建立並顯示一位新英雄。
新英雄的 `id=0`，且 `name` 為空白。
這個測試確認元件如預期運作：

<code-example path="testing/src/app/hero/hero-detail.component.spec.ts" region="route-no-id" title="src/app/hero/hero-detail.component.spec.ts (no id)" linenums="false">

</code-example>

<div class="callout is-helpful">

以這個 <live-example plnkr="app-specs" embedded-style>線上範例</live-example>，檢視並下載本指南的_所有_應用程式測試程式碼。

</div>

<hr/>

{@a page-object}

## 使用 _page_ 物件簡化設定

`HeroDetailComponent` 是一個簡單的檢視，包含一個標題、兩個英雄欄位與兩個按鈕。

<figure>
  <img src='generated/images/guide/testing/hero-detail.component.png' alt="HeroDetailComponent 運作畫面">
</figure>

但範本的複雜度已經夠多了。

<code-example path="testing/src/app/hero/hero-detail.component.html" title="src/app/hero/hero-detail.component.html" linenums="false">

</code-example>

若要充分考驗元件，測試需要很多設定：

* 它必須等到英雄到達，`*ngIf` 才允許任何元素出現在 DOM 中。
* 它需要標題 `<span>` 與名稱 `<input>` 的參照，以便檢視它們的值。
* 它需要兩個按鈕的參照，以便點選它們。
* 它需要一些元件與路由器方法的 spy。

即使是這麼小的一個表單，也可能產生一團混亂的條件式設定與 CSS 元素選取，令人備受折磨。

用一個 `Page` 類別來駕馭這份瘋狂：它簡化對元件屬性的存取，並封裝設定這些屬性的邏輯。
以下是 `hero-detail.component.spec.ts` 的 `Page` 類別

<code-example path="testing/src/app/hero/hero-detail.component.spec.ts" region="page" title="src/app/hero/hero-detail.component.spec.ts (Page)" linenums="false">

</code-example>

現在，用於操控與檢查元件的重要掛鉤都整齊地組織起來，可以從 `Page` 的實例存取。

`createComponent` 方法會建立一個 `page` 物件，並在 `hero` 到達後填補其中的空白。

<code-example path="testing/src/app/hero/hero-detail.component.spec.ts" region="create-component" title="src/app/hero/hero-detail.component.spec.ts (createComponent)" linenums="false">

</code-example>

上一節中的 [observable 測試](guide/testing#tests-w-observable-double) 示範了 `createComponent` 與 `page`
如何讓測試保持簡短且_切中主題_。
沒有干擾：不需要等候 promise 解析，也不需要在 DOM 中搜尋要比較的元素值。

以下再多看幾個 `HeroDetailComponent` 測試，來強化這個重點。

<code-example path="testing/src/app/hero/hero-detail.component.spec.ts" region="selected-tests" title="src/app/hero/hero-detail.component.spec.ts (selected tests)" linenums="false">

</code-example>

<hr/>

{@a import-module}

## 以模組匯入進行設定
先前的元件測試是像這樣以一些 `declarations` 來設定測試模組的：

<code-example path="testing/src/app/dashboard/dashboard-hero.component.spec.ts" region="compile-components" title="src/app/dashboard/dashboard-hero.component.spec.ts (config)" linenums="false">

</code-example>

`DashboardComponent` 很簡單。
它不需要任何協助。
但更複雜的元件通常相依於其他元件、指令、管道與提供者，而這些也必須加入測試模組。

幸好，`TestBed.configureTestingModule` 的參數與傳給 `@NgModule` 裝飾器的中繼資料相對應，也就是說，你同樣可以指定 `providers` 與 `imports`。

`HeroDetailComponent` 儘管體積小、結構簡單，卻需要很多協助。
除了預設測試模組 `CommonModule` 提供的支援之外，它還需要：

* `FormsModule` 中的 `NgModel` 及其同伴，以啟用雙向資料繫結。
* 來自 `shared` 資料夾的 `TitleCasePipe`。
* 路由器服務（這些測試正在為它們製作替身）。
* 英雄資料存取服務（也已製作替身）。

一種做法是像這個範例一樣，用個別的零件來設定測試模組：

<code-example path="testing/src/app/hero/hero-detail.component.spec.ts" region="setup-forms-module" title="src/app/hero/hero-detail.component.spec.ts (FormsModule setup)" linenums="false">

</code-example>

由於許多應用程式元件都需要 `FormsModule` 與 `TitleCasePipe`，開發者建立了
一個 `SharedModule`，把這些以及其他經常需要的零件組合在一起。
測試設定也可以使用 `SharedModule`，如這個替代設定所示：

<code-example path="testing/src/app/hero/hero-detail.component.spec.ts" region="setup-shared-module" title="src/app/hero/hero-detail.component.spec.ts (SharedModule setup)" linenums="false">

</code-example>

它稍微更緊湊、更小，import 陳述式也更少（未顯示）。

{@a feature-module-import}

### 匯入功能模組

`HeroDetailComponent` 是 `HeroModule` [功能模組](guide/ngmodule#feature-modules)的一部分，該模組匯集了更多彼此相依的零件，
包括 `SharedModule`。
試試像這樣匯入 `HeroModule` 的測試設定：

<code-example path="testing/src/app/hero/hero-detail.component.spec.ts" region="setup-hero-module" title="src/app/hero/hero-detail.component.spec.ts (HeroModule setup)" linenums="false">

</code-example>

真是_簡潔俐落_。
只剩下 `providers` 中的_測試替身_。
連 `HeroDetailComponent` 的宣告都不見了。

<div class="l-sub-section">

事實上，如果你試圖宣告它，Angular 會擲出錯誤，因為
`HeroDetailComponent` 同時被宣告在 `HeroModule` 與 `DynamicTestModule`（測試模組）中。

</div>

<div class="alert is-helpful">

匯入元件的功能模組通常是設定測試最容易的方式，
尤其是當功能模組很小且大多自我完備時，功能模組本來就應該如此。

</div>

<hr/>

{@a component-override}

## 覆寫元件的提供者

`HeroDetailComponent` 提供了它自己的 `HeroDetailService`。

<code-example path="testing/src/app/hero/hero-detail.component.ts" region="prototype" title="src/app/hero/hero-detail.component.ts (prototype)" linenums="false">

</code-example>

你無法在 `TestBed.configureTestingModule` 的 `providers` 中為元件的 `HeroDetailService` 建立替身。
那些是_測試模組_的提供者，不是元件的。
它們把相依性注入器準備在 _fixture 層級_。

Angular 以它_自己的_注入器建立元件，該注入器是 fixture 注入器的_子_注入器。
它把元件的提供者（在本例中是 `HeroDetailService`）註冊到子注入器。
測試無法從 fixture 注入器取得子注入器的服務。
而 `TestBed.configureTestingModule` 也無法設定它們。

Angular 一直以來建立的都是真實 `HeroDetailService` 的新實例！

<div class="l-sub-section">

如果 `HeroDetailService` 自己向遠端伺服器發出 XHR 呼叫，這些測試可能會失敗或逾時。
也可能根本沒有遠端伺服器可以呼叫。

幸好，`HeroDetailService` 將遠端資料存取的責任委派給注入的 `HeroService`。

<code-example path="testing/src/app/hero/hero-detail.service.ts" region="prototype" title="src/app/hero/hero-detail.service.ts (prototype)" linenums="false">

</code-example>

[先前的測試設定](guide/testing#feature-module-import)把真正的 `HeroService` 換成 `FakeHeroService`，
由它攔截伺服器請求並偽造它們的回應。

</div>

如果你沒那麼幸運呢？
如果偽造 `HeroService` 很困難呢？
如果 `HeroDetailService` 自己發出伺服器請求呢？

`TestBed.overrideComponent` 方法可以把元件的 `providers` 換成容易管理的_測試替身_，如下列設定變化所示：

<code-example path="testing/src/app/hero/hero-detail.component.spec.ts" region="setup-override" title="src/app/hero/hero-detail.component.spec.ts (Override setup)" linenums="false">

</code-example>

注意 `TestBed.configureTestingModule` 不再提供（假的）`HeroService`，因為它[不需要了](guide/testing#spy-stub)。

{@a override-component-method}

### _overrideComponent_ 方法

聚焦於 `overrideComponent` 方法。

<code-example path="testing/src/app/hero/hero-detail.component.spec.ts" region="override-component-method" title="src/app/hero/hero-detail.component.spec.ts (overrideComponent)" linenums="false">

</code-example>

它接受兩個引數：要覆寫的元件型別（`HeroDetailComponent`），以及一個覆寫中繼資料物件。
[覆寫中繼資料物件](guide/testing#metadata-override-object)是一個泛型，定義如下：

<code-example format="." language="javascript">
  type MetadataOverride<T> = {
    add?: T;
    remove?: T;
    set?: T;
  };
</code-example>

中繼資料覆寫物件可以在中繼資料屬性中加入與移除元素，或完全重設那些屬性。
這個範例重設了元件的 `providers` 中繼資料。

型別參數 `T` 是你會傳給 `@Component` 裝飾器的中繼資料種類：

<code-example format="." language="javascript">
  selector?: string;
  template?: string;
  templateUrl?: string;
  providers?: any[];
  ...
</code-example>

{@a spy-stub}

### 提供 _spy stub_（_HeroDetailServiceSpy_）

這個範例將元件的 `providers` 陣列完全換成一個新陣列，其中包含一個 `HeroDetailServiceSpy`。

`HeroDetailServiceSpy` 是真實 `HeroDetailService` 的替身版本，它偽造了該服務所有必要的功能。
它既不注入也不委派給較低層級的 `HeroService`，因此不需要為後者提供測試替身。

相關的 `HeroDetailComponent` 測試會透過監控服務方法，來斷言 `HeroDetailService` 的方法有被呼叫。
因此，這個替身將它的方法實作為 spy：

<code-example path="testing/src/app/hero/hero-detail.component.spec.ts" region="hds-spy" title="src/app/hero/hero-detail.component.spec.ts (HeroDetailServiceSpy)" linenums="false">

</code-example>

{@a override-tests}

### 覆寫測試

現在，測試可以直接操控替身的 `testHero` 來控制元件的英雄，並確認服務方法有被呼叫。

<code-example path="testing/src/app/hero/hero-detail.component.spec.ts" region="override-tests" title="src/app/hero/hero-detail.component.spec.ts (override tests)" linenums="false">

</code-example>

{@a more-overrides}

### 更多覆寫
`TestBed.overrideComponent` 方法可以對相同或不同的元件呼叫多次。
`TestBed` 提供類似的 `overrideDirective`、`overrideModule` 與 `overridePipe` 方法，
用來深入並取代這些其他類別的零件。

請自行探索這些選項與組合。

<hr/>

{@a router-outlet-component}

## 測試 _RouterOutlet_ 元件

`AppComponent` 在 `<router-outlet>` 中顯示路由元件。
它也顯示一個導覽列，其中有錨點與它們的 `RouterLink` 指令。

{@a app-component-html}

<code-example path="testing/src/app/app.component.html" title="src/app/app.component.html" linenums="false">

</code-example>

元件類別什麼都不做。

<code-example path="testing/src/app/app.component.ts" title="src/app/app.component.ts" linenums="false">

</code-example>

單元測試可以在不動用路由器的情況下，確認錨點已正確接線。
在[下文](guide/testing#why-stubbed-routerlink-tests)看看為什麼這值得做。

{@a stub-component}

### 為不需要的元件建立替身

測試設定應該看起來很熟悉。

<code-example path="testing/src/app/app.component.spec.ts" region="setup-stubs" title="src/app/app.component.spec.ts (Stub Setup)" linenums="false">

</code-example>

`AppComponent` 是宣告的受測主體。

設定以一個真正的元件（`BannerComponent`）與數個 stub 擴充預設的測試模組。

* `BannerComponent` 簡單且無害，可以直接使用。

* 真正的 `WelcomeComponent` 有一個注入的服務。`WelcomeStubComponent` 是一個佔位符，沒有服務需要擔心。

* 真正的 `RouterOutlet` 複雜且容易出錯。
`RouterOutletStubComponent`（位於 `testing/router-stubs.ts`）安全地不起作用。

元件 stub 是不可或缺的。
沒有它們，Angular 編譯器無法辨識 `<app-welcome>` 與 `<router-outlet>` 標籤，
並會擲出錯誤。

{@a router-link-stub}

### 為 _RouterLink_ 建立替身

`RouterLinkStubDirective` 對測試有實質的貢獻：

<code-example path="testing/src/testing/router-stubs.ts" region="router-link" title="testing/router-stubs.ts (RouterLinkStubDirective)" linenums="false">

</code-example>

`host` 中繼資料屬性把宿主元素（`<a>`）的 click 事件接線到指令的 `onClick` 方法。
繫結到 `[routerLink]` 屬性的 URL 流向指令的 `linkParams` 屬性。
點選錨點應該觸發 `onClick` 方法，該方法設定了具揭示性的 `navigatedTo` 屬性。
測試可以檢視該屬性，確認預期的_點選到導航_行為。

{@a by-directive}

{@a inject-directive}

### _By.directive_ 與注入的指令

再多一點設定，就能觸發初始資料繫結，並取得導覽連結的參照：

<code-example path="testing/src/app/app.component.spec.ts" region="test-setup" title="src/app/app.component.spec.ts (test setup)" linenums="false">

</code-example>

兩個特別值得注意的點：

1. 你可以_依指令_定位元素，使用 `By.directive`，而不只是用 css 選擇器。

1. 你可以使用元件的相依性注入器來取得一個附加的指令，因為
Angular 總是把附加的指令加入元件的注入器。

{@a app-component-tests}

以下是一些利用這個設定的測試：

<code-example path="testing/src/app/app.component.spec.ts" region="tests" title="src/app/app.component.spec.ts (selected tests)" linenums="false">

</code-example>

<div class="l-sub-section">

_這個範例_中的「click」測試一文不值。
它努力裝出有用的樣子，但事實上它
測試的是 `RouterLinkStubDirective`，而不是_元件_。
這是指令 stub 常見的缺點。

它在本指南中有正當的用途。
它示範如何在不動用完整的路由器機制下，找到一個 `RouterLink` 元素、點選它，並檢查一個結果。
這是一項你可能需要的技能，用來測試更精密的元件：當使用者點選連結時，那種元件會變更顯示、重新計算參數，或重新安排導航選項。

</div>

{@a why-stubbed-routerlink-tests}

### 這些測試有什麼用？

使用替身的 `RouterLink` 測試可以確認：一個帶有連結與出口的元件已正確設定、該元件擁有它應該有的連結，而且它們全都指向預期的方向。
這些測試並不關心，當使用者點選連結時，應用程式是否能成功導航到目標元件。

對於這類有限的測試目標，將 RouterLink 與 RouterOutlet 換成替身是最好的選擇。
仰賴真實的路由器會讓它們變得脆弱。
它們可能因為與元件無關的原因而失敗。
例如，一個導航守衛可能會阻止未經授權的使用者造訪 `HeroListComponent`。
那不是 `AppComponent` 的錯，而且對該元件做任何變更都無法修好那個失敗的測試。

_另一組_測試則可以探索：在使用者是否已完成身分驗證與取得授權等會影響守衛的條件存在時，應用程式是否如預期導航。

<div class="alert is-helpful">

未來的一次指南更新會說明如何使用 `RouterTestingModule` 撰寫這類測試。

</div>

<hr/>

{@a shallow-component-test}

## 使用 *NO\_ERRORS\_SCHEMA* 的「淺層元件測試」

[先前的設定](guide/testing#stub-component)宣告了 `BannerComponent`，並為其他兩個元件建立替身，
_理由僅僅是為了避免編譯器錯誤_。

沒有它們，Angular 編譯器無法辨識 [_app.component.html_](guide/testing#app-component-html) 範本中的 `<app-banner>`、`<app-welcome>` 與 `<router-outlet>` 標籤，並會擲出錯誤。

把 `NO_ERRORS_SCHEMA` 加入測試模組的 `schemas` 中繼資料，
告訴編譯器忽略無法辨識的元素與屬性。
你不再需要宣告不相關的元件與指令。

這些測試是***淺層的***，因為它們只「深入」你想測試的元件。

以下是一個帶有 `import` 陳述式的設定，展示了_淺層_測試相對於替身設定的改進簡潔性。

<code-tabs>

  <code-pane title="src/app/app.component.spec.ts (NO_ERRORS_SCHEMA)" path="testing/src/app/app.component.spec.ts" region="setup-schemas">

  </code-pane>

  <code-pane title="src/app/app.component.spec.ts (Stubs)" path="testing/src/app/app.component.spec.ts" region="setup-stubs-w-imports">

  </code-pane>

</code-tabs>

_唯一_的宣告是_受測元件_（`AppComponent`）與主動為測試做出貢獻的 `RouterLinkStubDirective`。
[本範例中的測試](guide/testing#app-component-tests)沒有改變。

<div class="alert is-important">

使用 `NO_ERRORS_SCHEMA` 的_淺層元件測試_大大簡化了複雜範本的單元測試。
然而，編譯器不再提醒你錯誤，
例如拼錯或誤用的元件與指令。

</div>

<hr/>

{@a attribute-directive}

## 測試屬性指令

_屬性指令_會修改元素、元件或其他指令的行為。
它的名稱反映了指令的套用方式：作為宿主元素上的一個屬性。

範例應用程式的 `HighlightDirective` 會根據資料繫結的顏色或預設顏色（lightgray），設定元素的背景顏色。
它也會將元素的自訂屬性（`customProperty`）設定為 `true`，理由僅僅是為了展示它可以這麼做。

<code-example path="testing/src/app/shared/highlight.directive.ts" title="src/app/shared/highlight.directive.ts" linenums="false">

</code-example>

它在整個應用程式中都有使用，或許最簡單的用法是在 `AboutComponent` 中：

<code-example path="testing/src/app/about.component.ts" title="src/app/about.component.ts" linenums="false">

</code-example>

測試 `HighlightDirective` 在 `AboutComponent` 中的特定用法，只需要
上文探討過的技巧（特別是[「淺層測試」](guide/testing#shallow-component-test)方法）。

<code-example path="testing/src/app/about.component.spec.ts" region="tests" title="src/app/about.component.spec.ts" linenums="false">

</code-example>

不過，只測試單一使用案例，不太可能探索到指令能力的完整範圍。
找出並測試所有使用該指令的元件既繁瑣又脆弱，而且同樣不太可能提供完整覆蓋率。

[隔離式單元測試](guide/testing#isolated-unit-tests)可能有幫助，
但像這樣的屬性指令往往會操作 DOM。
隔離式單元測試不會觸及 DOM，因此，
無法讓人對指令的有效性產生信心。

更好的解決方案是建立一個人造的測試元件，展示套用該指令的所有方式。

<code-example path="testing/src/app/shared/highlight.directive.spec.ts" region="test-component" title="src/app/shared/highlight.directive.spec.ts (TestComponent)" linenums="false">

</code-example>

<figure>
  <img src='generated/images/guide/testing/highlight-directive-spec.png' alt="Highlight 指令規格運作畫面">
</figure>

<div class="l-sub-section">

`<input>` 案例將 `HighlightDirective` 繫結到輸入框中顏色值的名稱。
初始值是 "cyan" 這個字，應該會成為輸入框的背景顏色。

</div>

以下是這個元件的一些測試：

<code-example path="testing/src/app/shared/highlight.directive.spec.ts" region="selected-tests" title="src/app/shared/highlight.directive.spec.ts (selected tests)">

</code-example>

有幾個技巧值得注意：

* 當元素型別未知時，`By.directive` 謂詞是取得帶有此指令之元素的絕佳方式。

* <a href="https://developer.mozilla.org/en-US/docs/Web/CSS/:not">`:not` 虛擬類別</a>
在 `By.css('h2:not([highlight])')` 中有助於找出_沒有_該指令的 `<h2>` 元素。
`By.css('*:not([highlight])')` 會找出_任何_沒有該指令的元素。

* 即使沒有真正的瀏覽器，`DebugElement.styles` 也能透過 `DebugElement` 抽象層存取元素樣式。
但當 `nativeElement` 看起來比抽象層更容易或更清楚時，也請自由利用它。

* Angular 會將指令加入它所套用元素的注入器中。
預設顏色的測試使用第二個 `<h2>` 的注入器，取得它的 `HighlightDirective` 執行個體
與其 `defaultColor`。

* `DebugElement.properties` 可以存取由指令設定的人造自訂屬性。

<hr/>

{@a isolated-unit-tests}

## 隔離式單元測試

在 Angular 測試公用程式的幫助下測試應用程式，是本指南的主要焦點。

然而，以不依賴 Angular 的_隔離式_單元測試來探索應用程式類別的內部邏輯，
往往更有生產力。
這類測試通常更小，也更容易閱讀、撰寫與維護。

它們不帶額外的包袱：

* 從 Angular 測試函式庫匯入。
* 設定模組。
* 準備相依性注入 `providers`。
* 呼叫 `inject` 或 `async` 或 `fakeAsync`。

它們遵循各地測試開發者都熟悉的模式：

* 展現標準的、與 Angular 無關的測試技巧。
* 直接以 `new` 建立實例。
* 以測試替身（stub、spy 與 mock）取代真正的相依性。

<div class="callout is-important">

<header>
  兩種測試都要寫
</header>

好的開發者會為同一個應用程式部分撰寫兩種測試，通常在同一個 spec 檔案中。
撰寫簡單的_隔離式_單元測試，以隔離方式驗證該部分。
撰寫 _Angular_ 測試，以驗證該部分如何與 Angular 互動、
更新 DOM，並與應用程式的其餘部分協作。

</div>

{@a isolated-service-tests}

### 服務
服務是隔離式單元測試的良好候選者。
以下是在沒有 Angular 測試公用程式協助下撰寫的 `FancyService`
的一些同步與非同步單元測試。

<code-example path="testing/src/app/bag/bag.no-testbed.spec.ts" region="FancyService" title="src/app/bag/bag.no-testbed.spec.ts">

</code-example>

粗略的行數統計表明，這些隔離式單元測試比等效的 Angular 測試小了約 25%。
這很有啟發性，但不是決定性的。
好處來自於減少的設定與程式碼複雜度。

比較這些 `FancyService.getTimeoutValue` 的等效測試。

<code-tabs>

  <code-pane title="src/app/bag/bag.no-testbed.spec.ts (Isolated)" path="testing/src/app/bag/bag.no-testbed.spec.ts" region="getTimeoutValue">

  </code-pane>

  <code-pane title="src/app/bag/bag.spec.ts (with Angular testing utilities)" path="testing/src/app/bag/bag.spec.ts" region="getTimeoutValue">

  </code-pane>

</code-tabs>

它們的行數大致相同，但依賴 Angular 的版本
有更多活動零件，包括一對公用程式函式（`async` 與 `inject`）。
兩種方法都行得通，如果你因為其他原因就在附近使用
Angular 測試公用程式，這也不是什麼大問題。
另一方面，何必以增加的複雜度來負擔簡單的服務測試呢？

挑選適合你的方法。

{@a services-with-dependencies}

### 具有相依性的服務

服務通常依賴 Angular 注入到建構子中的其他服務。
你可以在_不使用_ `TestBed` 的情況下測試這些服務。
在許多情況下，親手建立並_注入_相依性更容易。

`DependentService` 是一個簡單的範例：

<code-example path="testing/src/app/bag/bag.ts" region="DependentService" title="src/app/bag/bag.ts" linenums="false">

</code-example>

它把唯一的方法 `getValue` 委派給注入的 `FancyService`。

以下是幾種測試它的方法。

<code-example path="testing/src/app/bag/bag.no-testbed.spec.ts" region="DependentService" title="src/app/bag/bag.no-testbed.spec.ts">

</code-example>

第一個測試以 `new` 建立一個 `FancyService`，並把它傳給 `DependentService` 建構子。

然而，事情很少這麼簡單。注入的服務可能難以建立或控制。
你可以 mock 該相依性、使用虛擬值，或以容易控制的
替代方法 stub 相關的服務方法。

這些_隔離式_單元測試技巧非常適合探索服務的內部邏輯，或它
與元件類別的簡單整合。
當撰寫驗證服務如何與元件在 _Angular 執行時期環境內_ 互動的測試時，使用 Angular 測試公用程式。

{@a isolated-pipe-tests}

### 管道
管道很容易在不使用 Angular 測試公用程式的情況下進行測試。

管道類別有一個方法 `transform`，負責將輸入值處理成轉換後的輸出值。
`transform` 的實作很少與 DOM 互動。
大多數管道除了 `@Pipe` 中繼資料與一個介面之外，不相依於 Angular 的其他部分。

以一個將每個單字第一個字母大寫的 `TitleCasePipe` 為例。
以下是一個以正規表示式寫成的簡易實作。

<code-example path="testing/src/app/shared/title-case.pipe.ts" title="src/app/shared/title-case.pipe.ts" linenums="false">

</code-example>

任何使用正規表示式的程式碼都值得徹底測試。
使用簡單的 Jasmine 來探索預期情境與邊界情境。

<code-example path="testing/src/app/shared/title-case.pipe.spec.ts" region="excerpt" title="src/app/shared/title-case.pipe.spec.ts">

</code-example>

{@a write-tests}

### 也要撰寫 Angular 測試
這些是_隔離_測試管道的測試。
它們無法判斷 `TitleCasePipe` 套用在應用程式元件中時是否正常運作。

可以考慮加入像這樣的元件測試：

<code-example path="testing/src/app/hero/hero-detail.component.spec.ts" region="title-case-pipe" title="src/app/hero/hero-detail.component.spec.ts (pipe test)">

</code-example>

{@a isolated-component-tests}

### 元件

元件測試通常檢視元件類別如何與自己的範本，或與協作的元件互動。
Angular 測試公用程式正是為促進這類測試而設計的。

考慮這個 `ButtonComp` 元件。

<code-example path="testing/src/app/bag/bag.ts" region="ButtonComp" title="src/app/bag/bag.ts (ButtonComp)" linenums="false">

</code-example>

下列 Angular 測試示範了：點選範本中的按鈕，會導致螢幕上的訊息更新。

<code-example path="testing/src/app/bag/bag.spec.ts" region="ButtonComp" title="src/app/bag/bag.spec.ts (ButtonComp)" linenums="false">

</code-example>

這些斷言驗證了資料值從一個 HTML 控制項（`<button>`）流向元件，
並從元件流回一個_不同_的 HTML 控制項（`<span>`）。
通過的測試意味著元件及其範本已正確接線。

隔離式單元測試能更快速地在元件的 API 邊界探查它，
以更少的精力探索更多狀況。

以下是一組單元測試，驗證元件在各種元件輸入面前的輸出。

<code-example path="testing/src/app/bag/bag.no-testbed.spec.ts" region="ButtonComp" title="src/app/bag/bag.no-testbed.spec.ts (ButtonComp)" linenums="false">

</code-example>

隔離式元件測試以更少的程式碼與幾乎不需要設定，提供大量的測試覆蓋率。
對於複雜的元件，這更是一個優勢，因為
它們可能需要以 Angular 測試公用程式進行細緻的準備。

另一方面，隔離式單元測試無法確認 `ButtonComp` 是否
正確繫結到它的範本，甚至無法確認它是否進行了資料繫結。
為此使用 Angular 測試。

<hr/>

{@a atu-apis}

## Angular 測試公用程式 API

本節盤點最實用的 Angular 測試功能，並摘要說明它們各自的用途。

Angular 測試公用程式包括 `TestBed`、`ComponentFixture`，以及一些控制測試環境的函式。
[_TestBed_](guide/testing#testbed-api-summary) 與 [_ComponentFixture_](guide/testing#component-fixture-api-summary) 類別另有專節涵蓋。

以下是獨立函式的摘要，依可能的實用程度排序：

<table>

  <tr>

    <th>
      函式
    </th>

    <th>
      說明
    </th>

  </tr>

  <tr>

    <td style="vertical-align: top">
      <code>async</code>
    </td>

<td>

      在一個特殊的 _async 測試區_內，執行測試（`it`）或設定（`beforeEach`）函式的主體。
      請參閱[上方的討論](guide/testing#async)。
    </td>

  </tr>

  <tr>

    <td style="vertical-align: top">
      <code>fakeAsync</code>
    </td>

<td>

      在一個特殊的 _fakeAsync 測試區_內，執行測試（`it`）函式的主體，啟用
      線性的控制流程撰寫風格。請參閱[上方的討論](guide/testing#fake-async)。
    </td>

  </tr>

  <tr>

    <td style="vertical-align: top">
      <code>tick</code>
    </td>

<td>

模擬時間的流逝與待處理非同步活動的完成，方式是在 _fakeAsync 測試區_ 內排清 _timer_ 與 _micro-task_ 佇列。

<div class="l-sub-section">

熱心投入的讀者或許會喜歡這篇長篇部落格文章：["_Tasks, microtasks, queues and schedules_"](https://jakearchibald.com/2015/tasks-microtasks-queues-and-schedules/)。

</div>

      接受一個選擇性的引數，把虛擬時鐘向前推進
      指定的毫秒數，
      清除在該時間範圍內排程的非同步活動。
      請參閱[上方的討論](guide/testing#tick)。

    </td>

  </tr>

  <tr>

    <td style="vertical-align: top">
       <code>inject</code>
    </td>

<td>

      把目前 `TestBed` 注入器中的一個或多個服務注入到測試函式中。
      請參閱[上文](guide/testing#inject)。

    </td>

  </tr>

  <tr>

    <td style="vertical-align: top">
      <code>discardPeriodicTasks</code>
    </td>

<td>

      當 `fakeAsync` 測試在結束時仍有待處理的計時器事件 _tasks_（排入佇列的 `setTimeOut` 與 `setInterval` 回呼），測試會以清楚的錯誤訊息失敗。

一般來說，測試結束時不應有任何排入佇列的工作。
      當預期會有待處理的計時器工作時，呼叫 `discardPeriodicTasks` 排清 _task_ 佇列，以避免這個錯誤。

    </td>

  </tr>

  <tr>

    <td style="vertical-align: top">
      <code>flushMicrotasks</code>
    </td>

<td>

      當 `fakeAsync` 測試在結束時仍有待處理的 _micro-tasks_（例如尚未解決的 promise），測試會以清楚的錯誤訊息失敗。

一般來說，測試應等待 micro-task 完成。
      當預期會有待處理的 microtask 時，呼叫 `flushMicrotasks` 排清 _micro-task_ 佇列，以避免這個錯誤。

    </td>

  </tr>

  <tr>

    <td style="vertical-align: top">
      <code>ComponentFixtureAutoDetect</code>
    </td>

<td>

      一個提供者權杖，對應一個開啟[自動變更偵測](guide/testing#自動變更偵測)的服務。

    </td>

  </tr>

  <tr>

    <td style="vertical-align: top">
      <code>getTestBed</code>
    </td>

<td>

取得 `TestBed` 的目前實例。
      通常不需要使用，因為 `TestBed` 類別的靜態類別方法一般就已足夠。
      `TestBed` 實例公開了一些較少使用、且沒有靜態方法版本的成員。

    </td>

  </tr>

</table>

<hr/>

{@a testbed-class-summary}

### _TestBed_ 類別摘要
`TestBed` 類別是主要的 Angular 測試公用程式之一。
它的 API 相當龐大，在你一次探索一點之前，可能會覺得難以招架。請先閱讀本指南前面的部分
掌握基礎，再試著理解完整的 API。

傳入 `configureTestingModule` 的模組定義，是 `@NgModule` 中繼資料屬性的子集。

<code-example format="." language="javascript">
  type TestModuleMetadata = {
    providers?: any[];
    declarations?: any[];
    imports?: any[];
    schemas?: Array&lt;SchemaMetadata | any[]&gt;;
  };
</code-example>

{@a metadata-override-object}

每個覆寫方法都接受一個 `MetadataOverride<T>`，其中 `T` 是適合該方法的中繼資料種類，也就是 `@NgModule`、`@Component`、`@Directive` 或 `@Pipe` 的參數。

<code-example format="." language="javascript">
  type MetadataOverride<T> = {
    add?: T;
    remove?: T;
    set?: T;
  };
</code-example>

{@a testbed-methods}
{@a testbed-api-summary}

`TestBed` API 由靜態類別方法組成，這些方法不是更新、就是引用 `TestBed` 的 _全域_ 實例。

在內部，所有靜態方法都是目前執行期 `TestBed` 實例的方法的包裝，而該實例也會由 `getTestBed()` 函式傳回。

請在 `beforeEach()` _內_ 呼叫 `TestBed` 方法，確保每個個別測試開始前都是全新狀態。

以下是最重要的靜態方法，依可能的實用程度排序。

<table>

  <tr>

    <th>
      方法
    </th>

    <th>
      說明
    </th>

  </tr>

  <tr>

    <td style="vertical-align: top">
      <code>configureTestingModule</code>
    </td>

<td>

測試墊片（`karma-test-shim`、`browser-test-shim`）會建立[初始測試環境](guide/testing)與預設的測試模組。
      預設測試模組設定了基本的宣告式成員，以及每位測試者都需要的一些 Angular 服務替代實作。

      呼叫 `configureTestingModule`，可以加入與移除匯入、宣告（元件、指令與管道）及提供者，為特定的測試組調整測試模組設定。
    </td>

  </tr>

  <tr>

    <td style="vertical-align: top">
      <code>compileComponents</code>
    </td>

<td>

      在你完成測試模組的設定後，以非同步方式編譯該模組。
      如果測試模組的_任何_元件具有 `templateUrl`
      或 `styleUrls`，你**必須**呼叫這個方法，因為取得元件範本與樣式檔案必然是非同步的。
      請參閱[上方內容](guide/testing#compile-components)。

呼叫 `compileComponents` 之後，`TestBed` 設定會在目前規格執行的期間內凍結。

    </td>

  </tr>

  <tr>

    <td style="vertical-align: top">
      <code>createComponent<T></code>
    </td>

<td>

      根據目前 `TestBed` 設定，建立型別為 `T` 的元件實例。
      呼叫 `compileComponent` 之後，`TestBed` 設定會在目前 spec 執行的期間凍結。
    </td>

  </tr>

  <tr>

    <td style="vertical-align: top">
      <code>overrideModule</code>
    </td>

<td>

      取代指定 `NgModule` 的中繼資料。回想一下，模組可以匯入其他模組。
      `overrideModule` 方法可以深入目前的測試模組，
      修改其中一個內層模組。
    </td>

  </tr>

  <tr>

    <td style="vertical-align: top">
      <code>overrideComponent</code>
    </td>

<td>

      取代指定元件類別的中繼資料，該元件類別可能深藏於
      一個內層模組之中。
    </td>

  </tr>

  <tr>

    <td style="vertical-align: top">
      <code>overrideDirective</code>
    </td>

<td>

      取代指定指令類別的中繼資料，該指令類別可能深藏於
      一個內層模組之中。
    </td>

  </tr>

  <tr>

    <td style="vertical-align: top">
      <code>overridePipe</code>
    </td>

<td>

      取代指定管道類別的中繼資料，該管道類別可能深藏於
      一個內層模組之中。
    </td>

  </tr>

  <tr>

    <td style="vertical-align: top">
      {@a testbed-get}
      <code>get</code>
    </td>

<td>

從目前的 `TestBed` 注入器取得服務。

`inject` 函式通常就足以勝任此用途。
      但若 `inject` 無法提供該服務，就會擲出錯誤。

如果該服務是選用的，該怎麼辦？

      `TestBed.get` 方法接受一個選用的第二個參數，
      也就是 Angular 找不到提供者時要傳回的物件
      （此例為 `null`）：
      <code-example path="testing/src/app/bag/bag.spec.ts" region="testbed-get" title="src/app/bag/bag.spec.ts" linenums="false">

      </code-example>

呼叫 `get` 之後，`TestBed` 設定會在目前規格執行的期間內凍結。

    </td>

  </tr>

  <tr>

    <td style="vertical-align: top">
      {@a testbed-initTestEnvironment}
      <code>initTestEnvironment</code>
    </td>

<td>

為整個測試執行初始化測試環境。

測試墊片（`karma-test-shim`、`browser-test-shim`）會為你呼叫它，所以你幾乎不需要自己呼叫。

這個方法只能呼叫 _恰好一次_。若要在測試執行中途變更這個預設值，請先呼叫 `resetTestEnvironment`。

      指定 Angular 編譯器工廠、一個 `PlatformRef`，以及一個預設的 Angular 測試模組。
      非瀏覽器平台的替代方案，可以在通用形式
      `@angular/platform-<platform_name>/testing/<platform_name>` 中取得。
    </td>

  </tr>

  <tr>

    <td style="vertical-align: top">
      <code>resetTestEnvironment</code>
    </td>

<td>

重設初始測試環境，包括預設的測試模組。

    </td>

  </tr>

</table>

少數 `TestBed` 實例方法沒有對應的靜態 `TestBed` _類別_ 方法。
這些方法很少需要使用。

{@a component-fixture-api-summary}

### _ComponentFixture_

`TestBed.createComponent<T>` 會建立元件 `T` 的實例，並為該元件傳回強型別的 `ComponentFixture`。

`ComponentFixture` 的屬性與方法提供對元件、其 DOM 表示方式，以及其 Angular 環境各方面的存取。

{@a component-fixture-properties}

### _ComponentFixture_ 屬性

以下是對測試者最重要的屬性，依可能的實用程度排序。

<table>

  <tr>

    <th>
      屬性
    </th>

    <th>
      說明
    </th>

  </tr>

  <tr>

    <td style="vertical-align: top">
      <code>componentInstance</code>
    </td>

<td>

      由 `TestBed.createComponent` 建立的元件類別實例。
    </td>

  </tr>

  <tr>

    <td style="vertical-align: top">
      <code>debugElement</code>
    </td>

<td>

與元件根元素相關聯的 `DebugElement`。

      `debugElement` 讓你在測試與除錯期間，深入了解元件及其 DOM 元素。
      這是測試人員的一個關鍵屬性。最有趣的成員在[下文](guide/testing#debug-element-details)涵蓋。
    </td>

  </tr>

  <tr>

    <td style="vertical-align: top">
      <code>nativeElement</code>
    </td>

<td>

      元件根部的原生 DOM 元素。
    </td>

  </tr>

  <tr>

    <td style="vertical-align: top">
      <code>changeDetectorRef</code>
    </td>

<td>

元件的 `ChangeDetectorRef`。

當所測試的元件具有 `ChangeDetectionStrategy.OnPush`，或元件的變更偵測由你的程式控制時，`ChangeDetectorRef` 最有價值。

    </td>

  </tr>

</table>

{@a component-fixture-methods}

### _ComponentFixture_ 方法

_fixture_ 方法會讓 Angular 對元件樹執行某些工作。
呼叫這些方法，可以觸發 Angular 行為以回應模擬的使用者動作。

以下是最實用的方法。

<table>

  <tr>

    <th>
      方法
    </th>

    <th>
      說明
    </th>

  </tr>

  <tr>

    <td style="vertical-align: top">
      <code>detectChanges</code>
    </td>

<td>

為元件觸發一個變更偵測週期。

呼叫它來初始化元件（它會呼叫 `ngOnInit`），以及在測試程式碼變更元件的資料繫結屬性值之後呼叫。
      Angular 無法得知你已變更 `personComponent.name`，在你呼叫 `detectChanges` 之前，不會更新 `name` 繫結。

      之後執行 `checkNoChanges`，確認沒有循環更新，除非
      以 `detectChanges(false)` 的方式呼叫；
    </td>

  </tr>

  <tr>

    <td style="vertical-align: top">
      <code>autoDetectChanges</code>
    </td>

<td>

當你希望 fixture 自動偵測變更時，將它設為 `true`。

當自動偵測為 `true` 時，測試 fixture 會在建立元件後立即呼叫 `detectChanges`。
      接著它會監聽相關的 zone 事件，並相應地呼叫 `detectChanges`。
      當你的測試程式碼直接修改元件屬性值時，你可能仍然必須呼叫 `fixture.detectChanges` 來觸發資料繫結更新。

預設值為 `false`。偏好精細控制測試行為的測試者，通常會將它保持為 `false`。

    </td>

  </tr>

  <tr>

    <td style="vertical-align: top">
      <code>checkNoChanges</code>
    </td>

<td>

      執行一次變更偵測，確保沒有待處理的變更。
      若有變更則擲出例外。
    </td>

  </tr>

  <tr>

    <td style="vertical-align: top">
      <code>isStable</code>
    </td>

<td>

      若 fixture 目前_穩定_，傳回 `true`。
      若有尚未完成的非同步工作，傳回 `false`。
    </td>

  </tr>

  <tr>

    <td style="vertical-align: top">
      <code>whenStable</code>
    </td>

<td>

傳回一個在 fixture 穩定時完成的 promise。

      若要在非同步活動或
      非同步變更偵測完成後恢復測試，請掛接該 promise。
      請參閱[上方內容](guide/testing#when-stable)。
    </td>

  </tr>

  <tr>

    <td style="vertical-align: top">
      <code>destroy</code>
    </td>

<td>

觸發元件銷毀。

    </td>

  </tr>

</table>

{@a debug-element-details}

### _DebugElement_

`DebugElement` 提供對元件 DOM 表示方式的關鍵洞察。

從測試根元件由 `fixture.debugElement` 傳回的 `DebugElement`，你可以走訪（並查詢）fixture 的整個元素與元件子樹。

以下是對測試者最實用的 `DebugElement` 成員，依大約的實用程度排序：

<table>

  <tr>

    <th>
      成員
    </th>

    <th>
      說明
    </th>

  </tr>

  <tr>

    <td style="vertical-align: top">
      <code>nativeElement</code>
    </td>

<td>

      瀏覽器中對應的 DOM 元素（WebWorker 中為 null）。
    </td>

  </tr>

  <tr>

    <td style="vertical-align: top">
      <code>query</code>
    </td>

<td>

      呼叫 `query(predicate: Predicate<DebugElement>)` 會傳回子樹中任意深度處第一個符合[述詞](guide/testing#query-predicate)的 `DebugElement`。
    </td>

  </tr>

  <tr>

    <td style="vertical-align: top">
      <code>queryAll</code>
    </td>

<td>

      呼叫 `queryAll(predicate: Predicate<DebugElement>)` 會傳回子樹中任意深度處所有符合[述詞](guide/testing#query-predicate)的 `DebugElements`。
    </td>

  </tr>

  <tr>

    <td style="vertical-align: top">
      <code>injector</code>
    </td>

<td>

      宿主相依性注入器。
      例如，根元素的元件實例注入器。
    </td>

  </tr>

  <tr>

    <td style="vertical-align: top">
      <code>componentInstance</code>
    </td>

<td>

      元素自己的元件實例（如果有的話）。
    </td>

  </tr>

  <tr>

    <td style="vertical-align: top">
      <code>context</code>
    </td>

<td>

提供此元素父層上下文的物件。
      通常是掌管此元素的祖先元件實例。

      當一個元素在 `*ngFor` 內重複時，context 是一個 `NgForRow`，其 `$implicit`
      屬性是該列實例的值。
      例如，`*ngFor="let hero of heroes"` 中的 `hero`。
    </td>

  </tr>

  <tr>

    <td style="vertical-align: top">
      <code>children</code>
    </td>

<td>

直接的 `DebugElement` 子元素。透過 `children` 逐層往下走訪整棵樹。

<div class="l-sub-section">

`DebugElement` 也有 `childNodes`，是 `DebugNode` 物件的清單。
      `DebugElement` 源自 `DebugNode` 物件，而且節點的數量往往比元素多。測試者通常可以忽略純節點。

</div>

    </td>

  </tr>

  <tr>

    <td style="vertical-align: top">
      <code>parent</code>
    </td>

<td>

`DebugElement` 的父元素。若這是根元素，則為 Null。

    </td>

  </tr>

  <tr>

    <td style="vertical-align: top">
      <code>name</code>
    </td>

<td>

元素的標籤名稱（如果它是元素的話）。

    </td>

  </tr>

  <tr>

    <td style="vertical-align: top">
      <code>triggerEventHandler</code>
    </td>

<td>

      若元素的 `listeners` 集合中有對應的接聽器，就依名稱觸發該事件。
      第二個參數是處理常式預期的_事件物件_。
      請參閱[上方內容](guide/testing#trigger-event-handler)。

若事件缺少監聽器，或有其他問題，請考慮呼叫 `nativeElement.dispatchEvent(eventObject)`。

    </td>

  </tr>

  <tr>

    <td style="vertical-align: top">
      <code>listeners</code>
    </td>

<td>

附加在元件 `@Output` 屬性及／或元素事件屬性上的回呼。

    </td>

  </tr>

  <tr>

    <td style="vertical-align: top">
      <code>providerTokens</code>
    </td>

<td>

      此元件的注入器查詢權杖。
      包括元件本身，以及元件在其 `providers` 中繼資料中列出的權杖。
    </td>

  </tr>

  <tr>

    <td style="vertical-align: top">
      <code>source</code>
    </td>

<td>

在來源元件範本中找到這個元素的位置。

    </td>

  </tr>

  <tr>

    <td style="vertical-align: top">
      <code>references</code>
    </td>

<td>

與範本區域變數相關聯的物件字典（例如 `#foo`），以區域變數名稱為鍵。

    </td>

  </tr>

</table>

{@a query-predicate}

`DebugElement.query(predicate)` 與 `DebugElement.queryAll(predicate)` 方法接受一個述詞，用來篩選來源元素的子樹，找出符合的 `DebugElement`。

述詞可以是任何接受 `DebugElement` 並傳回 _真值_ 的方法。
下列範例找出所有具有名為 "content" 的範本區域變數參照的 `DebugElements`：

<code-example path="testing/src/app/bag/bag.spec.ts" region="custom-predicate" title="src/app/bag/bag.spec.ts" linenums="false">

</code-example>

Angular 的 `By` 類別有三個靜態方法，用於常見的述詞：

* `By.all` - 傳回所有元素。
* `By.css(selector)` - 傳回符合 CSS 選擇器的元素。
* `By.directive(directive)` - 傳回 Angular 對應到該指令類別實例的元素。

<code-example path="testing/src/app/hero/hero-list.component.spec.ts" region="by" title="src/app/hero/hero-list.component.spec.ts" linenums="false">

</code-example>

<div class='l' class='hr'>

</div>

{@a setup-files}

## 測試環境設定檔案

單元測試需要一些設定與啟動程序，這些都收錄在_設定檔案_中。
當你按照[設定](guide/setup)指示操作時，本指南的設定檔案會提供給你。
CLI 提供具有相同用途的類似檔案。

以下是本指南設定檔案的簡要說明：

<div class="l-sub-section">

這些檔案的深入細節，以及如何依你的需求重新設定它們，
是超出本指南範圍的主題。

</div>

<table width="100%">

  <col width="20%">

  </col>

  <col width="80%">

  </col>

  <tr>

    <th>
      檔案
    </th>

    <th>
      說明
    </th>

  </tr>

  <tr>

    <td style="vertical-align: top">
      <code>karma.conf.js</code>
    </td>

<td>

      Karma 設定檔案，指定要使用哪些外掛程式、
      要載入哪些應用程式與測試檔案、要使用哪個（或哪些）瀏覽器，
      以及如何回報測試結果。

      它會載入其他三個設定檔案：
      * `systemjs.config.js`
      * `systemjs.config.extras.js`
      * `karma-test-shim.js`
    </td>

  </tr>

  <tr>

    <td style="vertical-align: top">
      <code>karma-test-shim.js</code>
    </td>

<td>

      這個 shim 專門為 Angular 測試環境準備 Karma，
      並啟動 Karma 本身。
      它會在該過程中載入 `systemjs.config.js` 檔案。
    </td>

  </tr>

  <tr>

    <td style="vertical-align: top">
      <code>systemjs.config.js</code>
    </td>

<td>

      [SystemJS](https://github.com/systemjs/systemjs/blob/master/README.md)
      負責載入應用程式與測試檔案。
      這個指令碼告訴 SystemJS 在哪裡找到那些檔案，以及如何載入它們。
      它與你在[設定](guide/testing#setup)期間安裝的 `systemjs.config.js` 是同一個版本。
    </td>

  </tr>

  <tr>

    <td style="vertical-align: top">
      <code>systemjs.config.extras.js</code>
    </td>

<td>

      一個選擇性的檔案，以應用程式本身特定需求的
      設定，補充 `systemjs.config.js` 中的 SystemJS 設定。

      標準的 `systemjs.config.js` 無法預見那些需求。
      你在這裡填補缺口。

      本指南的範例版本把 **model barrel**
      加入 SystemJs `packages` 設定。
    </td>

  </tr>

  <tr>

    <td colspan="2">

      <code-example path="testing/src/systemjs.config.extras.js" title="systemjs.config.extras.js" linenums="false">

      </code-example>

    </td>

  </tr>

</table>

### npm 套件

範例測試撰寫為在 Jasmine 與 Karma 中執行。
兩個「快速路徑」設定把適當的 Jasmine 與 Karma npm 套件加入
`package.json` 的 `devDependencies` 區段。
當你執行 `npm install` 時，它們就會被安裝。

<div class='l' class='hr'>

  <div id='faq'>

</div>

  ## FAQ：常見問題
</div>

<div id='q-spec-file-location'>

</div>

### 為什麼要把 spec 放在它們所測試的東西旁邊？

把單元測試 spec 檔案放在與它們所測試的應用程式原始碼檔案相同的資料夾中，是個好主意：

* 這類測試很容易找到。
* 你一眼就能看出應用程式的哪個部分缺乏測試。
* 鄰近的測試可以揭示某個部分在脈絡中的運作方式。
* 當你移動原始碼時（無可避免），你會記得移動測試。
* 當你重新命名原始碼檔案時（無可避免），你會記得重新命名測試檔案。

<hr/>

<div id='q-specs-in-test-folder'>

</div>

### 什麼時候我會把 spec 放在 test 資料夾？

應用程式整合 spec 可以測試分散在多個資料夾與模組中的多個部分的互動。
它們並不真正屬於任何特定部分，所以在任何單一檔案旁邊都沒有自然的歸屬。

通常，為它們在 `tests` 目錄中建立一個適當的資料夾會更好。

當然，測試那些測試輔助函式的 spec 屬於 `test` 資料夾，就在它們對應的輔助檔案旁邊。
