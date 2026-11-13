# 使用管道轉換資料

使用[管道](guide/glossary#管道（pipe） "Definition of a pipe")來轉換字串、貨幣金額、日期與其他資料，以供顯示。
管道是在[範本運算式](/guide/glossary#範本運算式（template-expression） "Definition of template expression")中使用的簡單函式，接受一個輸入值並回傳轉換後的值。管道很有用，因為你可以在整個應用程式中使用它們，同時每個管道只需要宣告一次。
例如，你可以使用管道把日期顯示為 **April 15, 1988** 這種格式，而不是原始字串格式。

<div class="alert is-helpful">

如需查看本主題所用的範例應用程式，請參閱 <live-example></live-example>。

</div>

Angular 提供用於典型資料轉換的內建管道，包括使用地區設定資訊來格式化資料的國際化（i18n）轉換。
以下是常用的資料格式化內建管道：

*   [`DatePipe`](api/common/DatePipe)：依據地區設定規則格式化日期值。
*   [`UpperCasePipe`](api/common/UpperCasePipe)：把文字轉換為全部大寫。
*   [`LowerCasePipe`](api/common/LowerCasePipe)：把文字轉換為全部小寫。
*   [`CurrencyPipe`](api/common/CurrencyPipe)：把數字轉換為貨幣字串，依據地區設定規則格式化。
*   [`DecimalPipe`](/api/common/DecimalPipe)：把數字轉換為帶有小數點的字串，依據地區設定規則格式化。
*   [`PercentPipe`](api/common/PercentPipe)：把數字轉換為百分比字串，依據地區設定規則格式化。

<div class="alert is-helpful">

*   如需內建管道的完整清單，請參閱[管道 API 文件](/api/common#pipes "Pipes API reference summary")。
*   如需進一步了解如何在國際化（i18n）工作中使用管道，請參閱[依據地區設定格式化資料](/guide/i18n#i18n-pipes "依據地區設定格式化資料")。

</div>

建立管道來封裝自訂轉換，並在範本運算式中使用你的自訂管道。

## 先備知識

要使用管道，你應該對下列各項有基本的了解：

*   [TypeScript](guide/glossary#typescript "Definition of Typescript") 與 HTML5 程式設計
*   [範本](guide/glossary#範本（template） "Definition of a template")（HTML 加上 CSS 樣式）
*   [元件](guide/glossary#元件（component） "Definition of a component")

## 在範本中使用管道

要在範本中使用管道，請在範本運算式中使用管道運算子（`|`），如下列程式碼範例所示，並加上管道的*名稱*；內建 [`DatePipe`](api/common/DatePipe) 的名稱是 `date`。
範例中的頁籤顯示下列內容：

*   `app.component.html` 在另一個範本中使用 `date` 來顯示生日。
*   `hero-birthday1.component.ts` 在元件的內嵌範本中使用同一個管道，該元件也會設定生日值。

<code-tabs>
  <code-pane
    header="src/app/app.component.html"
    region="hero-birthday-template"
    path="pipes/src/app/app.component.html">
  </code-pane>
  <code-pane
    header="src/app/hero-birthday1.component.ts"
    path="pipes/src/app/hero-birthday1.component.ts">
  </code-pane>
</code-tabs>

元件的 `birthday` 值會透過管道運算子 `|` 流向 [`date`](api/common/DatePipe) 函式。

{@a parameterizing-a-pipe}

## 使用參數與串連管道轉換資料

使用選用參數來微調管道的輸出。
例如，使用 [`CurrencyPipe`](api/common/CurrencyPipe "API reference") 並以國家代碼（例如 EUR）作為參數。
範本運算式 `{{ amount | currency:'EUR' }}` 會把 `amount` 轉換為歐元貨幣。
在管道名稱（`currency`）後面加上冒號（`:`）與參數值（`'EUR'`）。

如果管道接受多個參數，請以冒號分隔各個值。
例如，`{{ amount | currency:'EUR':'Euros '}}` 會把第二個參數——字串字面值 `'Euros '`——加到輸出字串中。使用任何有效的範本運算式作為參數，例如字串字面值或元件屬性。

有些管道至少需要一個參數，並允許更多選用參數，例如 [`SlicePipe`](/api/common/SlicePipe "API reference for SlicePipe")。例如，`{{ slice:1:5 }}` 會建立一個新的陣列或字串，包含從元素 `1` 開始、到元素 `5` 結束的子集。

### 範例：格式化日期

下列範例中的頁籤展示了在兩種不同格式（`'shortDate'` 與 `'fullDate'`）之間切換：

*   `app.component.html` 範本使用格式參數，為 [`DatePipe`](api/common/DatePipe)（名稱為 `date`）把日期顯示為 **04/15/88** 的形式。
*   `hero-birthday2.component.ts` 元件把管道的格式參數繫結到元件的 `format` 屬性（位於 `template` 區段），並加入一個按鈕，處理繫結到元件 `toggleFormat()` 方法的點選事件。
*   `hero-birthday2.component.ts` 元件的 `toggleFormat()` 方法會把元件的 `format` 屬性在短格式（`'shortDate'`）與較長的格式（`'fullDate'`）之間切換。

<code-tabs>
  <code-pane
    header="src/app/app.component.html"
    region="format-birthday"
    path="pipes/src/app/app.component.html">
  </code-pane>
  <code-pane
    header="src/app/hero-birthday2.component.ts (template)"
    region="template"
    path="pipes/src/app/hero-birthday2.component.ts">
  </code-pane>
  <code-pane
    header="src/app/hero-birthday2.component.ts (class)"
    region="class"
    path="pipes/src/app/hero-birthday2.component.ts">
  </code-pane>
</code-tabs>

點選 **Toggle Format** 按鈕會在 **04/15/1988** 與 **Friday, April 15, 1988** 之間切換日期格式，如圖 1 所示。

<div class="lightbox">
  <img src='generated/images/guide/pipes/date-format-toggle-anim.gif' alt="Date Format Toggle">
</div>

**圖 1。** 點選按鈕可切換日期格式

<div class="alert is-helpful">

如需 `date` 管道的格式選項，請參閱 [DatePipe](api/common/DatePipe "DatePipe API Reference page")。

</div>

### 範例：以串連管道套用兩種格式

串連管道，讓一個管道的輸出成為下一個管道的輸入。

在下列範例中，串連的管道會先把格式套用到日期值，再把格式化後的日期轉換為大寫字元。
第一個頁籤為 `src/app/app.component.html` 範本串連 `DatePipe` 與 `UpperCasePipe`，把生日顯示為 **APR 15, 1988** 的形式。
第二個頁籤為 `src/app/app.component.html` 範本在串連到 `uppercase` 之前，把 `fullDate` 參數傳給 `date`，產生 **FRIDAY, APRIL 15, 1988** 的形式。

<code-tabs>
  <code-pane
    header="src/app/app.component.html (1)"
    region="chained-birthday"
    path="pipes/src/app/app.component.html">
  </code-pane>
  <code-pane
    header="src/app/app.component.html (2)"
    region="chained-parameter-birthday"
    path="pipes/src/app/app.component.html">
  </code-pane>
</code-tabs>

{@a Custom-pipes}

## 建立管道以進行自訂資料轉換

建立自訂管道，封裝內建管道沒有提供的轉換。
接著，在範本運算式中使用你的自訂管道，就像使用內建管道一樣——把輸入值轉換為輸出值以供顯示。

### 將類別標記為管道

要把一個類別標記為管道並提供設定中繼資料，請對該類別套用 [`@Pipe`](/api/core/Pipe "API reference for Pipe") [裝飾器](/guide/glossary#裝飾器（decorator、decoration） "Definition for decorator")。
使用 [UpperCamelCase](guide/glossary#大小寫慣例（case-types） "Definition of case types")（類別名稱的一般慣例）作為管道類別名稱，對應的 `name` 字串則使用 [camelCase](guide/glossary#大小寫慣例（case-types） "Definition of case types")。
不要在 `name` 中使用連字號。
如需詳細資訊與更多範例，請參閱[管道名稱](guide/styleguide#管道名稱 "Pipe names in the Angular coding style guide")。

在範本運算式中使用 `name`，就像使用內建管道一樣。

<div class="alert is-important">

*   請把你的管道加入 `NgModule` 中繼資料的 `declarations` 欄位，讓範本可以使用它。請參閱範例應用程式中的 `app.module.ts` 檔案（<live-example></live-example>）。如需詳細資訊，請參閱 [NgModules](guide/ngmodules "NgModules introduction")。
*   註冊你的自訂管道。[Angular CLI](cli "CLI Overview and Command Reference") 的 [`ng generate pipe`](cli/generate#pipe "ng generate pipe in the CLI Command Reference") 命令會自動註冊管道。

</div>

### 使用 PipeTransform 介面

在你的自訂管道類別中實作 [`PipeTransform`](/api/core/PipeTransform "API reference for PipeTransform") 介面，以執行轉換。

Angular 會以繫結的值作為第一個引數、以清單形式的所有參數作為第二個引數，呼叫 `transform` 方法，並回傳轉換後的值。

### 範例：以指數方式轉換值

在遊戲中，你可能會想實作一個以指數方式提升值的轉換，來增加英雄的力量。
例如，如果英雄的分數是 2，把英雄的力量以指數方式提升 10，會得到 1024 分。
使用自訂管道來進行這個轉換。

下列程式碼範例展示了兩個元件定義：

* `exponential-strength.pipe.ts` 元件定義了名為 `exponentialStrength` 的自訂管道，透過 `transform` 方法執行轉換。
它為傳入管道的參數，在 `transform` 方法中定義了一個引數（`exponent`）。

* `power-booster.component.ts` 元件示範如何使用該管道，指定了值（`2`）與指數參數（`10`）。
圖 2 顯示其輸出。

<code-tabs>
  <code-pane
    header="src/app/exponential-strength.pipe.ts"
    path="pipes/src/app/exponential-strength.pipe.ts">
  </code-pane>
  <code-pane
    header="src/app/power-booster.component.ts"
    path="pipes/src/app/power-booster.component.ts">
  </code-pane>
</code-tabs>

<div class="lightbox">
  <img src='generated/images/guide/pipes/power-booster.png' alt="Power Booster">
</div>

**圖 2。** `exponentialStrength` 管道的輸出

<div class="alert is-helpful">

如要在 <live-example></live-example> 中查看 `exponentialStrength` 管道的行為，請變更範本中的值與選用指數。

</div>

{@a change-detection}

## 透過資料繫結偵測管道中的變更

你可以把[資料繫結](/guide/glossary#資料繫結（data-binding） "Definition of data binding")與管道搭配使用，來顯示值並回應使用者操作。
如果資料是原始型別輸入值（例如 `String` 或 `Number`）或物件參照輸入（例如 `Date` 或 `Array`），每當 Angular 偵測到輸入值或參照的變更，就會執行管道。

例如，你可以把前面的自訂管道範例改為使用 `ngModel` 的雙向資料繫結，來輸入金額與增強係數，如下列程式碼範例所示。

<code-example path="pipes/src/app/power-boost-calculator.component.ts" header="src/app/power-boost-calculator.component.ts">

</code-example>

每當使用者變更「normal power」值或「boost factor」時，`exponentialStrength` 管道就會執行，如圖 3 所示。

<div class="lightbox">
  <img src='generated/images/guide/pipes/power-boost-calculator-anim.gif' alt="Power Boost Calculator">
</div>

**圖 3。** 變更 `exponentialStrength` 管道的數量與增強係數

Angular 會偵測每一次變更並立即執行管道。
這對原始型別的輸入值來說沒有問題。
然而，如果你改變的是複合物件*內部*的某些東西（例如日期的月份、陣列的元素或物件屬性），你就需要了解變更偵測如何運作，以及如何使用非純粹（`impure`）管道。

### 變更偵測的運作方式

Angular 會在每次 DOM 事件之後執行的[變更偵測](guide/glossary#變更偵測（change-detection） "Definition of change detection")程序中，尋找資料繫結值的變更：每一次按鍵、滑鼠移動、計時器滴答與伺服器回應。
下列不使用管道的範例，展示了 Angular 如何使用預設的變更偵測策略，來監看並更新 `heroes` 陣列中每一位英雄的顯示。
範例頁籤顯示下列內容：

*   在 `flying-heroes.component.html (v1)` 範本中，`*ngFor` 重複器會顯示英雄名稱。
*   其同伴元件類別 `flying-heroes.component.ts (v1)` 提供英雄、把英雄加入陣列，並重設陣列。

<code-tabs>
  <code-pane
    header="src/app/flying-heroes.component.html (v1)"
    region="template-1"
    path="pipes/src/app/flying-heroes.component.html">
  </code-pane>
  <code-pane
    header="src/app/flying-heroes.component.ts (v1)"
    region="v1"
    path="pipes/src/app/flying-heroes.component.ts">
  </code-pane>
</code-tabs>

每當使用者加入一位英雄，Angular 就會更新顯示。
如果使用者點選 **Reset** 按鈕，Angular 會把 `heroes` 換成包含原始英雄的新陣列並更新顯示。
如果你再加入移除或變更英雄的功能，Angular 也會偵測到那些變更並更新顯示。

然而，每次變更都執行管道來更新顯示，會拖慢應用程式的效能。
因此 Angular 在執行管道時使用較快的變更偵測演算法，如下一節所述。

{@a pure-and-impure-pipes}

### 偵測原始型別與物件參照的純粹變更

依預設，管道是*純粹*的，因此 Angular 只在偵測到輸入值發生*純粹變更*時才執行管道。
純粹變更指的是原始型別輸入值的變更（例如 `String`、`Number`、`Boolean` 或 `Symbol`），或是物件參照的變更（例如 `Date`、`Array`、`Function` 或 `Object`）。

{@a pure-pipe-pure-fn}

純粹管道必須使用純粹函式，也就是處理輸入並回傳值、且沒有副作用的函式。
換句話說，給定相同的輸入，純粹函式應該一律回傳相同的輸出。

使用純粹管道時，Angular 會忽略複合物件內部的變更，例如既有陣列中新加入的元素，因為檢查原始型別值或物件參照，比對物件內部進行深度差異檢查要快得多。
Angular 可以快速判斷是否能跳過管道執行與檢視更新。

然而，以陣列作為輸入的純粹管道，運作方式可能不如你所預期。
為了展示這個問題，請修改前面的範例，篩選英雄清單，只留下會飛的英雄。
如下列程式碼所示，在 `*ngFor` 重複器中使用 `FlyingHeroesPipe`。
範例頁籤顯示下列內容：

*   範本（`flying-heroes.component.html (flyers)`）與新的管道
*   `FlyingHeroesPipe` 自訂管道實作（`flying-heroes.pipe.ts`）

<code-tabs>
  <code-pane
    header="src/app/flying-heroes.component.html (flyers)"
    region="template-flying-heroes"
    path="pipes/src/app/flying-heroes.component.html">
  </code-pane>
  <code-pane
    header="src/app/flying-heroes.pipe.ts"
    region="pure"
    path="pipes/src/app/flying-heroes.pipe.ts">
  </code-pane>
</code-tabs>

應用程式現在出現了非預期的行為：當使用者加入會飛的英雄時，他們都沒有出現在「Heroes who fly」之下。
發生這種情況的原因是，加入英雄的程式碼是把英雄推入 `heroes` 陣列：

<code-example path="pipes/src/app/flying-heroes.component.ts" region="push" header="src/app/flying-heroes.component.ts"></code-example>

變更偵測器會忽略陣列元素的變更，因此管道不會執行。

Angular 忽略變更後陣列元素的原因是，陣列的*參照*並未改變。
由於陣列相同，Angular 不會更新顯示。

要得到想要的行為，一種方法是改變物件參照本身。
你可以把陣列換成包含新變更元素的新陣列，再把新陣列輸入管道。
在上例中，你可以建立一個附加了新英雄的陣列，並將它指派給 `heroes`。Angular 會偵測到陣列參照的變化並執行管道。

總而言之，如果你直接修改輸入陣列，純粹管道不會執行。
如果你*換掉*輸入陣列，管道就會執行並更新顯示，如圖 4 所示。

<div class="lightbox">
  <img src='generated/images/guide/pipes/flying-heroes-anim.gif' alt="Flying Heroes">
</div>

**圖 4。** `flyingHeroes` 管道把顯示篩選為會飛的英雄

上例示範了為了配合管道而變更元件的程式碼。

若要讓元件更簡單、且不依賴使用管道的 HTML 範本，另一種做法是使用非純粹（`impure`）管道，來偵測陣列等複合物件內部的變更，如下一節所述。

{@a impure-flying-heroes}

### 偵測複合物件內部的非純粹變更

要在複合物件*內部*發生變更（例如陣列元素變更）後執行自訂管道，你需要把管道定義為 `impure`，以偵測非純粹變更。
Angular 會在每次偵測到變更時執行非純粹管道，也就是每一次按鍵或滑鼠移動。

<div class="alert is-important">

非純粹管道雖然有用，但使用時請小心。執行時間很長的非純粹管道，可能會大幅拖慢你的應用程式。

</div>

把管道的 `pure` 旗標設為 `false`，即可讓它成為非純粹管道：

<code-example path="pipes/src/app/flying-heroes.pipe.ts" region="pipe-decorator" header="src/app/flying-heroes.pipe.ts"></code-example>

下列程式碼展示了 `FlyingHeroesImpurePipe` 的完整實作，它擴充 `FlyingHeroesPipe` 以繼承其特性。
這個範例顯示你不需要改變其他任何東西——唯一的差別是在管道中繼資料中把 `pure` 旗標設為 `false`。

<code-tabs>
  <code-pane
    header="src/app/flying-heroes.pipe.ts (FlyingHeroesImpurePipe)"
    region="impure"
    path="pipes/src/app/flying-heroes.pipe.ts">
  </code-pane>
  <code-pane
    header="src/app/flying-heroes.pipe.ts (FlyingHeroesPipe)"
    region="pure"
    path="pipes/src/app/flying-heroes.pipe.ts">
  </code-pane>
</code-tabs>

`FlyingHeroesImpurePipe` 是非純粹管道的合適候選，因為它的 `transform` 函式簡單又快速：

<code-example path="pipes/src/app/flying-heroes.pipe.ts" header="src/app/flying-heroes.pipe.ts (filter)" region="filter"></code-example>

你可以從 `FlyingHeroesComponent` 衍生出 `FlyingHeroesImpureComponent`。
如下列程式碼所示，只有範本中的管道改變。

<code-example path="pipes/src/app/flying-heroes-impure.component.html" header="src/app/flying-heroes-impure.component.html (excerpt)" region="template-flying-heroes"></code-example>

<div class="alert is-helpful">

如要確認使用者加入英雄時顯示會更新，請參閱 <live-example></live-example>。

</div>

{@a async-pipe}

## 從 observable 解開資料

[Observables](/guide/glossary#可觀察物件（observable） "Definition of observable") 可以讓你在應用程式的各個部分之間傳遞訊息。
建議使用 Observable 來處理事件、進行非同步程式設計，以及處理多個值。
Observable 可以同步（像函式把值傳遞給呼叫者一樣）或依排程非同步地傳遞任何型別的單一或多個值。

<div class="alert is-helpful">

如需 Observable 的詳細資訊與範例，請參閱 [Observable 總覽](/guide/observables#使用-observable-傳遞值 "Using observables to pass values")。

</div>

使用內建的 [`AsyncPipe`](/api/common/AsyncPipe "API description of AsyncPipe") 接受 observable 作為輸入，並自動訂閱該輸入。
若不使用這個管道，你的元件程式碼就必須自行訂閱 observable 以取用它的值、擷取解析後的值、將這些值公開給繫結使用，並在 observable 被銷毀時取消訂閱，以防止記憶體洩漏。`AsyncPipe` 是一個非純粹管道，能省去你在元件中維護訂閱、並在值到達時持續傳遞這些值的樣板程式碼。

下列程式碼範例使用 `async` 管道，將一個訊息字串的 observable（`message$`）繫結到檢視。

<code-example path="pipes/src/app/hero-async-message.component.ts" header="src/app/hero-async-message.component.ts">

</code-example>

{@a no-filter-pipe}

## 快取 HTTP 請求

如要[使用 HTTP 與後端服務通訊](/guide/http "Communicating with backend services using HTTP")，`HttpClient` 服務會使用 Observable，並提供 `HttpClient.get()` 方法，從伺服器擷取資料。
這個非同步方法會傳送 HTTP 請求，並回傳一個會為回應發出所請求資料的 Observable。

如前一節所示，使用非純粹的 `AsyncPipe` 接受 observable 作為輸入，並自動訂閱該輸入。
你也可以建立一個非純粹管道來發出並快取 HTTP 請求。

每當元件執行變更偵測時，就會呼叫非純粹管道，對於 `CheckAlways` 而言，頻繁程度可能高達每幾毫秒一次。
為避免效能問題，請只在請求的 URL 變更時才呼叫伺服器，如下列範例所示，並使用管道來快取伺服器回應。
頁籤顯示下列內容：

*   `fetch` 管道（`fetch-json.pipe.ts`）。
*   示範請求的測試元件（`hero-list.component.ts`），使用一個範本，定義了兩個對管道的繫結，從 `heroes.json` 檔案請求英雄資料。第二個繫結把 `fetch` 管道與內建的 `JsonPipe` 串連，以 JSON 格式顯示相同的英雄資料。

<code-tabs>
  <code-pane
    header="src/app/fetch-json.pipe.ts"
    path="pipes/src/app/fetch-json.pipe.ts">
  </code-pane>
  <code-pane
    header="src/app/hero-list.component.ts"
    path="pipes/src/app/hero-list.component.ts">
  </code-pane>
</code-tabs>

在前面的範例中，在管道的資料請求上設定中斷點，會顯示下列內容：

*   每個繫結都有自己的管道執行個體。
*   每個管道執行個體都會快取自己的 URL 與資料，且只呼叫伺服器一次。

`fetch` 與 `fetch-json` 管道顯示英雄的方式如圖 5 所示。

<div class="lightbox">
  <img src='generated/images/guide/pipes/hero-list.png' alt="Hero List">
</div>

**圖 5。** `fetch` 與 `fetch-json` 管道顯示英雄

<div class="alert is-helpful">

內建的 [JsonPipe](api/common/JsonPipe "API description for JsonPipe") 提供一種方式，可以診斷莫名失敗的資料繫結，或檢查物件以供日後繫結。

</div>

## 管道與優先順序

管道運算子的優先順序高於三元運算子（`?:`），也就是說 `a ? b : c | x` 會被解析為 `a ? b : (c | x)`。
管道運算子不能在 `?:` 的第一與第二個運算元中不加括號使用。

由於優先順序的關係，如果你想讓管道套用到三元運算的結果，請把整個運算式用括號包起來；例如 `(a ? b : c) | x`。

<code-example path="pipes/src/app/precedence.component.html" region="precedence" header="src/app/precedence.component.html">
</code-example>
