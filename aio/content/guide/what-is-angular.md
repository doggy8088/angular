# 什麼是 Angular？

本主題可以協助你了解 Angular：Angular 是什麼、它提供哪些優勢，以及當你開始建置應用程式時可以期待什麼。

Angular 是一個建置於 [TypeScript](https://www.typescriptlang.org) 之上的開發平台。作為一個平台，Angular 包含：

* 一個以元件為基礎的框架，用於建置可擴充的 Web 應用程式
* 一組整合良好的函式庫，涵蓋各式各樣的功能，包括路由、表單管理、用戶端與伺服器通訊等
* 一套開發人員工具，可協助你開發、建置、測試與更新程式碼

使用 Angular，你將善用一個可從單人開發專案擴充到企業級應用程式的平台。Angular 的設計讓更新盡可能簡單，因此你可以用最少的努力掌握最新發展。最棒的是，Angular 生態系由超過 170 萬名開發人員、函式庫作者與內容創作者組成的多元群體所構成。

<div class="alert is-helpful">

請參閱 <live-example name="what-is-angular"></live-example>，查看包含本指南程式碼片段的運作範例。

</div>

{@a essentials}
## Angular 應用程式：基礎要素

本節說明 Angular 背後的核心概念。了解這些概念可以協助你更有效地設計與建置應用程式。

{@a components}
### 元件

元件是組成應用程式的建構元件。一個元件包含一個帶有 `@Component()` 裝飾器的 TypeScript 類別、一個 HTML 範本與樣式。`@Component()` 裝飾器會指定下列 Angular 專屬資訊：

* 一個 CSS 選擇器，定義元件在範本中的使用方式。範本中符合此選擇器的 HTML 元素會成為該元件的執行個體。
* 一個 HTML 範本，指示 Angular 如何算繪元件。
* 一組選用的 CSS 樣式，定義範本 HTML 元素的外觀。

下列是一個最小的 Angular 元件。

<code-example
  path="what-is-angular/src/app/hello-world/hello-world.component.ts"></code-example>

若要使用此元件，請在範本中撰寫下列內容：

<code-example path="what-is-angular/src/app/app.component.html" region="hello-world-selector"></code-example>

當 Angular 算繪此元件時，產生的 DOM 如下所示：

<code-example path="what-is-angular/src/app/hello-world-example.html" language="html"></code-example>

Angular 的元件模型提供強大的封裝能力與直覺的應用程式結構。元件也讓你的應用程式易於進行單元測試，並能提升程式碼的整體可讀性。

如需進一步了解你可以用元件做什麼，請參閱[元件](guide/component-overview)一節。

{@a templates}
### 範本

每個元件都有一個 HTML 範本，宣告該元件的算繪方式。你可以行內定義此範本，也可以透過檔案路徑定義。

Angular 以額外的語法擴充 HTML，讓你可以從元件插入動態值。當元件的狀態變更時，Angular 會自動更新算繪後的 DOM。此功能的一種應用是插入動態文字，如下列範例所示。

<code-example path="what-is-angular/src/app/hello-world-interpolation/hello-world-interpolation.component.html" region="say-hello"></code-example>

`message` 的值來自元件類別：

<code-example path="what-is-angular/src/app/hello-world-interpolation/hello-world-interpolation.component.ts"></code-example>

當應用程式載入元件及其範本時，使用者會看到下列內容：

<code-example language="html">
&lt;p&gt;Hello, World!&lt;/p&gt;
</code-example>

請注意雙大括號的使用——它們指示 Angular 對其中的內容進行內插。

Angular 也支援屬性繫結，可協助你設定 HTML 元素的屬性與特性的值，並將值傳遞給應用程式的呈現邏輯。

<code-example path="what-is-angular/src/app/hello-world-bindings/hello-world-bindings.component.html" region="bindings"></code-example>

請注意方括號的使用——該語法表示你正在把屬性或特性繫結到元件類別中的值。

你也可以宣告事件監聽器，來監聽並回應使用者操作，例如按鍵、滑鼠移動、點選與觸控。你可以透過在括號中指定事件名稱來宣告事件監聽器：

<code-example path="what-is-angular/src/app/hello-world-bindings/hello-world-bindings.component.html" region="event-binding"></code-example>

上述範例呼叫了一個方法，該方法定義於元件類別中：

<code-example path="what-is-angular/src/app/hello-world-bindings/hello-world-bindings.component.ts" region="method"></code-example>

下列是 Angular 範本中內插與繫結的範例：

<code-tabs linenums="true">
  <code-pane
    header="hello-world-bindings.component.ts"
    path="what-is-angular/src/app/hello-world-bindings/hello-world-bindings.component.ts">
  </code-pane>
  <code-pane
    header="hello-world-bindings.component.html"
    path="what-is-angular/src/app/hello-world-bindings/hello-world-bindings.component.html"
    linenums="false">
  </code-pane>
</code-tabs>

你可以透過使用[指令](guide/built-in-directives)，為你的範本加入額外功能。Angular 中最受歡迎的指令是 `*ngIf` 與 `*ngFor`。你可以使用指令執行各種任務，例如動態修改 DOM 結構。你也可以建立自己的自訂指令，創造出色的使用者體驗。

下列程式碼是 `*ngIf` 指令的範例。

<code-tabs linenums="true">
  <code-pane
    header="hello-world-ngif.component.ts"
    path="what-is-angular/src/app/hello-world-ngif/hello-world-ngif.component.ts">
  </code-pane>
  <code-pane
    header="hello-world-ngif.component.html"
    path="what-is-angular/src/app/hello-world-ngif/hello-world-ngif.component.html"
    linenums="false">
  </code-pane>
</code-tabs>

Angular 的宣告式範本讓你可以清楚地將應用程式的邏輯與呈現分開。範本以標準 HTML 為基礎，便於建置、維護與更新。

如需進一步了解你可以用範本做什麼，請參閱[範本](guide/template-syntax)一節。

{@a di}
### 依賴注入

依賴注入讓你可以宣告 TypeScript 類別的依賴，而無需處理它們的執行個體化。Angular 會代你處理執行個體化。此設計模式讓你能撰寫更易測試、更具彈性的程式碼。即使了解依賴注入對於開始使用 Angular 並非關鍵，我們仍強烈建議將其作為最佳實務，而且 Angular 的許多層面都在某種程度上運用了它。

為了說明依賴注入如何運作，請考慮下列範例。第一個檔案 `logger.service.ts` 定義了一個 `Logger` 類別。此類別包含一個 `writeCount` 函式，可將數字記錄到主控台。

<code-example path="what-is-angular/src/app/logger.service.ts"></code-example>

接著，`hello-world-di.component.ts` 檔案定義了一個 Angular 元件。此元件包含一個按鈕，使用 Logger 類別的 `writeCount` 函式。若要存取該函式，請在建構函式中加入 `private logger: Logger`，將 `Logger` 服務注入 `HelloWorldDI` 類別。

<code-example path="what-is-angular/src/app/hello-world-di/hello-world-di.component.ts"></code-example>

如需進一步了解依賴注入與 Angular，請參閱[Angular 中的依賴注入](guide/dependency-injection)一節。

{@a cli}

## Angular CLI

Angular CLI 是開發 Angular 應用程式最快速、最簡單且最受推薦的方式。Angular CLI 讓許多任務變得簡單。以下是一些範例：

<table>
<tr>
<td><a href="cli/build">ng build</a></td>
<td>將 Angular 應用程式編譯到輸出目錄。</td>
</tr>
<tr>
<td><a href="cli/serve">ng serve</a></td>
<td>建置並提供你的應用程式，並在檔案變更時重新建置。</td>
</tr>
<tr>
<td><a href="cli/generate">ng generate</a></td>
<td>根據原理圖產生或修改檔案。</td>
</tr>
<tr>
<td><a href="cli/test">ng test</a></td>
<td>對指定專案執行單元測試。</td>
</tr>
<tr>
<td><a href="cli/e2e">ng e2e</a></td>
<td>建置並提供 Angular 應用程式，然後執行端對端測試。</td>
</tr>
</table>

你會發現 Angular CLI 是建置應用程式的寶貴工具。

如需進一步了解 Angular CLI，請參閱 [CLI 參考](/cli)一節。

{@a 1p-libraries}
## 第一方函式庫

[Angular 應用程式：基礎要素](#essentials)一節，簡要概述了你在建置 Angular 應用程式時會用到的幾個關鍵架構元素。但是，當你的應用程式成長，並且想要加入網站導覽或使用者輸入等額外功能時，Angular 的諸多優點才真正顯現出來。這時你就可以利用 Angular 平台，納入 Angular 提供的眾多第一方函式庫之一。

你可以使用的部分函式庫包括：
<table>
<tr>
<td><a href="guide/router">Angular Router</a></td>
<td>以 Angular 元件為基礎的進階用戶端導覽與路由。支援延遲載入、巢狀路由、自訂路徑比對等功能。</td>
</tr>
<tr>
<td><a href="guide/forms-overview">Angular Forms</td>
<td>用於表單參與與驗證的統一系統。</td>
<tr>
<td><a href="guide/http">Angular HttpClient</a></td>
<td>穩健的 HTTP 用戶端，可支援更進階的用戶端與伺服器通訊。</td>
</tr>
<tr>
<td><a href="guide/animations">Angular Animations</a></td>
<td>根據應用程式狀態驅動動畫的豐富系統。</td>
</tr>
<tr>
<td><a href="guide/service-worker-intro">Angular PWA</a>
<td>用於建置漸進式 Web 應用程式 (PWAs) 的工具，包括 service worker 與 Web 應用程式資訊清單。</td>
</tr>
<tr>
<td><a href="guide/schematics">Angular Schematics</td>
<td>自動化鷹架、重構與更新工具，可簡化大規模開發。</td>
</tr>
</table>

這些函式庫擴充了應用程式的功能，同時讓你更專注於讓應用程式獨一無二的功能。請放心加入這些函式庫，它們的設計可與 Angular 框架無縫整合，並與框架同步更新。

只有在這些函式庫能協助你為應用程式加入功能或解決特定問題時，才需要使用它們。

## 後續步驟

本主題旨在簡要概述 Angular 是什麼、它提供哪些優勢，以及當你開始建置應用程式時可以期待什麼。

若要查看 Angular 的實際運作，請參閱我們的[入門](https://angular.io/start)教學。本教學使用 [stackblitz.com](https://stackblitz.com)，因此你無需安裝任何東西即可探索 Angular 的運作範例。

若要進一步探索 Angular 的功能，我們建議你通讀「了解 Angular」與「開發者指南」這兩節。

@reviewed 2021-03-08
