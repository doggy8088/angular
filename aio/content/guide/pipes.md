# 管道

每個應用程式一開始看起來都只有一個簡單的任務：取得資料、轉換資料，然後呈現給使用者。
取得資料可以簡單到只是建立一個本機變數，也可以複雜到透過 WebSocket 串流資料。

資料抵達後，你可以直接把原始的 `toString` 值推入檢視，但這很少能帶來良好的使用者體驗。
例如，在大多數使用情境中，使用者更希望看到像
<samp>April 15, 1988</samp> 這種簡單格式的日期，而不是原始字串格式
<samp>Fri Apr 15 1988 00:00:00 GMT-0700 (Pacific Daylight Time)</samp>。

顯然，有些值稍加修整會更好。你可能會注意到，在同一個應用程式內、甚至跨多個應用程式，你會一再需要許多相同的轉換。
你幾乎可以把它們想成樣式。
事實上，你可能會想像套用樣式那樣，把它們套用在你的 HTML 範本中。

這就是 Angular 管道：一種撰寫顯示值轉換的方式，你可以在你的 HTML 中宣告它們。

你可以在 Stackblitz 中執行 <live-example></live-example>，並從那裡下載程式碼。


## 使用管道

管道接受資料作為輸入，並把它轉換為所需的輸出。
在本頁中，你將使用管道把元件的生日屬性轉換為人類易讀的日期。


<code-example path="pipes/src/app/hero-birthday1.component.ts" header="src/app/hero-birthday1.component.ts" linenums="false">

</code-example>



請聚焦於元件的範本。


<code-example path="pipes/src/app/app.component.html" region="hero-birthday-template" header="src/app/app.component.html" linenums="false">

</code-example>



在內嵌運算式中，你讓元件的 `birthday` 值流經
[管道運算子](guide/template-syntax#pipe)（ | ）到右側的 [Date 管道](api/common/DatePipe)
函式。所有管道都是這樣運作的。




## 內建管道
Angular 隨附了一組管道，例如
`DatePipe`、`UpperCasePipe`、`LowerCasePipe`、`CurrencyPipe` 與 `PercentPipe`。
它們全都可以在任何範本中使用。


<div class="alert is-helpful">



在 [API 參考](api) 的[管道主題](api?type=pipe)中，可以進一步了解這些以及許多其他內建管道；請篩選包含 "pipe" 一詞的條目。

基於本頁[附錄](guide/pipes#no-filter-pipe)所解釋的理由，Angular 沒有 `FilterPipe` 或 `OrderByPipe`。


</div>




## 為管道加上參數

管道可以接受任意數量的選填參數，以微調其輸出。
若要為管道加上參數，請在管道名稱後面加上冒號（ : ）再接參數值
（例如 `currency:'EUR'`）。如果管道接受多個參數，請以冒號分隔各值（例如 `slice:1:5`）。

修改生日範本，為日期管道提供一個格式參數。
在格式化英雄的 4 月 15 日生日後，它會呈現為 **<samp>04/15/88</samp>**：


<code-example path="pipes/src/app/app.component.html" region="format-birthday" header="src/app/app.component.html" linenums="false">

</code-example>



參數值可以是任何有效的範本運算式，
（請參閱[範本語法](guide/template-syntax)頁面的
[範本運算式](guide/template-syntax#範本運算式)一節）
例如字串字面值或元件屬性。
換句話說，你可以透過繫結控制格式，就像你透過繫結控制生日值一樣。

再撰寫第二個元件，把管道的格式參數*繫結*
到元件的 `format` 屬性。以下是該元件的範本：


<code-example path="pipes/src/app/hero-birthday2.component.ts" region="template" header="src/app/hero-birthday2.component.ts (template)" linenums="false">

</code-example>



你也在範本中加入了一個按鈕，並把它的 click 事件繫結到元件的 `toggleFormat()` 方法。
該方法會把元件的 `format` 屬性在短格式
（`'shortDate'`）與較長的格式（`'fullDate'`）之間切換。


<code-example path="pipes/src/app/hero-birthday2.component.ts" region="class" header="src/app/hero-birthday2.component.ts (class)" linenums="false">

</code-example>



當你點擊按鈕時，顯示的日期會在
"**<samp>04/15/1988</samp>**" 與
"**<samp>Friday, April 15, 1988</samp>**" 之間交替。


<figure>
  <img src='generated/images/guide/pipes/date-format-toggle-anim.gif' alt="日期格式切換">
</figure>



<div class="alert is-helpful">



在 [Date 管道](api/common/DatePipe)
API 參考頁面中，可以進一步了解 `DatePipe` 的格式選項。


</div>



## 串連管道

你可以把管道串連在一起，形成可能很有用的組合。
在下列範例中，若要以大寫顯示生日，生日會先串連到 `DatePipe`，再串連到 `UpperCasePipe`。
生日會顯示為 **<samp>APR 15, 1988</samp>**。


<code-example path="pipes/src/app/app.component.html" region="chained-birthday" header="src/app/app.component.html" linenums="false">

</code-example>



這個範例&mdash;顯示 **<samp>FRIDAY, APRIL 15, 1988</samp>**&mdash;串連了
與上面相同的管道，但也傳入一個參數給 `date`。


<code-example path="pipes/src/app/app.component.html" region="chained-parameter-birthday" header="src/app/app.component.html" linenums="false">

</code-example>




## 自訂管道

你可以撰寫自己的自訂管道。
以下是一個名為 `ExponentialStrengthPipe` 的自訂管道，可以增強英雄的力量：


<code-example path="pipes/src/app/exponential-strength.pipe.ts" header="src/app/exponential-strength.pipe.ts" linenums="false">

</code-example>



這個管道定義揭示了以下重點：

* 管道是一個以管道中繼資料裝飾的類別。
* 管道類別實作了 `PipeTransform` 介面的 `transform` 方法，該方法
接受一個輸入值以及後續的選填參數，並回傳轉換後的值。
* 傳入管道的每個參數，都會成為 `transform` 方法的一個額外引數。
你的管道有一個這樣的參數：`exponent`。
* 若要告訴 Angular 這是一個管道，你需要套用
`@Pipe` 裝飾器，它是從 Angular 核心程式庫匯入的。
* `@Pipe` 裝飾器讓你可以定義將在範本運算式中使用的
   管道名稱。它必須是有效的 JavaScript 識別符。
   你的管道名稱是 `exponentialStrength`。


<div class="alert is-helpful">



## *PipeTransform* 介面

`transform` 方法是管道的關鍵。
`PipeTransform` *介面*定義了該方法，並引導工具與編譯器。
嚴格來說，它是選填的；Angular 無論如何都會尋找並執行 `transform` 方法。

</div>

現在你需要一個元件來示範這個管道。

<code-example path="pipes/src/app/power-booster.component.ts" header="src/app/power-booster.component.ts" linenums="false">
</code-example>

<figure>
  <img src='generated/images/guide/pipes/power-booster.png' alt="力量提升器">
</figure>



請注意以下事項：

* 你使用自訂管道的方式與使用內建管道相同。
* 你必須把你的管道加入 `AppModule` 的 `declarations` 陣列。
* 如果你選擇把管道注入到某個類別中，你必須在你的 `NgModule` 的 `providers` 陣列中提供它。

<div class="callout is-helpful">

<header>
  記住 declarations 陣列
</header>


你必須註冊自訂管道。
如果你不這麼做，Angular 會回報錯誤。
[Angular CLI](cli) 的產生器會自動註冊該管道。


</div>



若要探查 <live-example></live-example> 中的行為，
請更改範本中的值與選填的指數。

## 力量提升計算器

只是為了測試自訂管道而不斷更新範本，並不好玩。
把範例升級為「力量提升計算器」，結合
你的管道與使用 `ngModel` 的雙向資料繫結。


<code-example path="pipes/src/app/power-boost-calculator.component.ts" header="src/app/power-boost-calculator.component.ts">

</code-example>



<figure>
  <img src='generated/images/guide/pipes/power-boost-calculator-anim.gif' alt="力量提升計算器">
</figure>




{@a change-detection}


## 管道與變更偵測

Angular 透過*變更偵測*程序尋找資料繫結值的變更，該程序在每個 DOM 事件之後執行：
每一次按鍵、滑鼠移動、計時器滴答與伺服器回應。這可能很昂貴。
Angular 會在可行且適當時，努力降低成本。

當你使用管道時，Angular 會挑選一個較簡單、較快速的變更偵測演算法。

<h3 class="no-toc">不使用管道</h3>

在下一個範例中，元件使用預設的、積極的變更偵測策略，來監看並更新
它對 `heroes` 陣列中每位英雄的顯示。以下是範本：


<code-example path="pipes/src/app/flying-heroes.component.html" region="template-1" header="src/app/flying-heroes.component.html (v1)" linenums="false">

</code-example>



搭配的元件類別提供英雄、把英雄加入陣列，並可以重設陣列。

<code-example path="pipes/src/app/flying-heroes.component.ts" region="v1" header="src/app/flying-heroes.component.ts (v1)" linenums="false">

</code-example>



你可以加入英雄，Angular 會在你加入時更新顯示。
如果你點擊 `reset` 按鈕，Angular 會以包含原始英雄的新陣列取代 `heroes`，並更新顯示。
如果你加入了移除或更改英雄的能力，Angular 也會偵測到那些變更並隨之更新顯示。

<h3 class="no-toc"><i>FlyingHeroesPipe</i></h3>

把 `FlyingHeroesPipe` 加入 `*ngFor` 重複器，篩選英雄清單，只留下會飛的英雄。

<code-example path="pipes/src/app/flying-heroes.component.html" region="template-flying-heroes" header="src/app/flying-heroes.component.html (flyers)" linenums="false">

</code-example>



以下是 `FlyingHeroesPipe` 的實作，它遵循前面所述的自訂管道模式。

<code-example path="pipes/src/app/flying-heroes.pipe.ts" region="pure" header="src/app/flying-heroes.pipe.ts" linenums="false">

</code-example>



請注意 <live-example></live-example> 中奇怪的行為：
當你加入會飛的英雄時，他們並沒有顯示在 "Heroes who fly" 之下。

雖然你得不到想要的行為，但 Angular 並沒有壞掉。
它只是使用了一種不同的變更偵測演算法，忽略對清單或其任何項目的變更。

請注意英雄是如何被加入的：

<code-example path="pipes/src/app/flying-heroes.component.ts" region="push" header="src/app/flying-heroes.component.ts" linenums="false">

</code-example>



你把英雄加入 `heroes` 陣列。該陣列的參照並未改變。
它還是同一個陣列。這是 Angular 唯一在乎的事。從它的角度來看，*同一個陣列、沒有變更、不更新顯示*。

若要修正，請建立一個尾端加上新英雄的陣列，並把它指定給 `heroes`。
這次 Angular 偵測到陣列參照已改變。
它執行管道並以新陣列更新顯示，其中包含新的飛行英雄。

如果你*變動*陣列，就不會叫用任何管道，顯示也不會更新；
如果你*取代*陣列，管道就會執行，顯示也會更新。
Flying Heroes 應用程式擴充了
程式碼，加入核取方塊開關與額外的顯示，幫助你體驗這些效果。


<figure>
  <img src='generated/images/guide/pipes/flying-heroes-anim.gif' alt="飛行英雄">
</figure>



取代陣列是向 Angular 發出更新顯示訊號的一個有效率的方法。
你何時應該取代陣列？當資料改變時。
在*這個*範例中，這是一條很容易遵循的規則，
因為改變資料的唯一方式就是加入英雄。

更常見的情況是，你不知道資料何時改變了，
尤其是在以多種方式變動資料的應用程式中，
變動甚至可能發生在應用程式中很遠的位置。
在這樣的應用程式中，元件通常無法知道那些變更。
此外，為了遷就管道而扭曲元件設計是不明智的。
請努力讓元件類別獨立於 HTML。
元件不應該知道管道的存在。

若要篩選飛行英雄，請考慮使用*非純粹管道*。



## 純粹與非純粹管道

管道有兩種類別：*純粹*與*非純粹*。
管道預設是純粹的。你到目前為止看到的每個管道都是純粹的。
你可以把管道的 pure 旗標設定為 false，讓它變成非純粹。你可以像這樣把 `FlyingHeroesPipe`
改成非純粹：


<code-example path="pipes/src/app/flying-heroes.pipe.ts" region="pipe-decorator" header="src/app/flying-heroes.pipe.ts" linenums="false">

</code-example>



在這麼做之前，請先了解純粹與非純粹之間的差異，從純粹管道開始。

<h3 class="no-toc">純粹管道</h3>

Angular 只在偵測到輸入值發生*純粹變更*時，才執行*純粹管道*。
純粹變更是指基本型別輸入值的變更（`String`、`Number`、`Boolean`、`Symbol`），
或是物件參照的改變（`Date`、`Array`、`Function`、`Object`）。

Angular 會忽略（複合）物件內部的變更。
如果你更改輸入的月份、往輸入陣列中加入元素，或更新輸入物件的屬性，它不會叫用純粹管道。

這看似有所限制，但也很快。
物件參照檢查很快&mdash;比深度檢查差異要快得多&mdash;因此 Angular 可以迅速判斷
是否可以同時跳過管道執行與檢視更新。

因此，當你能接受這種變更偵測策略時，純粹管道是較好的選擇。
當你不能接受時，你*可以*改用非純粹管道。


<div class="alert is-helpful">



或者你也可能根本不使用管道。
以元件的屬性來達成管道的目的可能更好，
這一點將在本頁稍後討論。


</div>



<h3 class="no-toc">非純粹管道</h3>

Angular 在每個元件變更偵測週期中都會執行一次*非純粹管道*。
非純粹管道被叫用的頻率很高，可能和每一次按鍵或滑鼠移動一樣頻繁。

有了這層顧慮，實作非純粹管道時要格外小心。
一個昂貴、執行時間長的管道可能破壞使用者體驗。


{@a impure-flying-heroes}


<h3 class="no-toc">非純粹的 <i>FlyingHeroesPipe</i></h3>

切換一下開關，就能把 `FlyingHeroesPipe` 變成 `FlyingHeroesImpurePipe`。
完整的實作如下：

<code-tabs>

  <code-pane header="FlyingHeroesImpurePipe" path="pipes/src/app/flying-heroes.pipe.ts" region="impure">

  </code-pane>

  <code-pane header="FlyingHeroesPipe" path="pipes/src/app/flying-heroes.pipe.ts" region="pure">

  </code-pane>

</code-tabs>



你繼承 `FlyingHeroesPipe`，以證明內部沒有任何改變。
唯一的差異是管道中繼資料中的 `pure` 旗標。

這是非純粹管道的一個好候選，因為 `transform` 函式簡單又快速。


<code-example path="pipes/src/app/flying-heroes.pipe.ts" linenums="false" header="src/app/flying-heroes.pipe.ts (filter)" region="filter">

</code-example>



你可以從 `FlyingHeroesComponent` 衍生出 `FlyingHeroesImpureComponent`。


<code-example path="pipes/src/app/flying-heroes-impure.component.html" linenums="false" header="src/app/flying-heroes-impure.component.html (excerpt)" region="template-flying-heroes">

</code-example>



唯一實質的改變是範本中的管道。
你可以在 <live-example></live-example> 中確認，即使你變動 `heroes` 陣列，
_flying heroes_ 顯示也會在你加入英雄時更新。


{@a async-pipe}
<h3 class="no-toc">非純粹的 <i>AsyncPipe</i></h3>


Angular 的 `AsyncPipe` 是非純粹管道的一個有趣例子。
`AsyncPipe` 接受 `Promise` 或 `Observable` 作為輸入，
並自動訂閱該輸入，最終回傳發出的值。

`AsyncPipe` 也是有狀態的。
該管道會維持對輸入 `Observable` 的訂閱，
並在值抵達時持續從該 `Observable` 傳遞值。

下一個範例使用 `async` 管道，把訊息字串的
`Observable`（`message$`）繫結到檢視。


<code-example path="pipes/src/app/hero-async-message.component.ts" header="src/app/hero-async-message.component.ts">

</code-example>



Async 管道為元件程式碼省去了樣板程式碼。
元件不需要訂閱非同步資料來源、
擷取已解析的值並公開它們供繫結，
也不需要在被銷毀時取消訂閱
（這是記憶體外洩的一個強大來源）。

<h3 class="no-toc">非純粹的快取管道</h3>

再寫一個非純粹管道，一個發出 HTTP 請求的管道。

請記住，非純粹管道每幾毫秒就會被叫用一次。
如果你不小心，這個管道會用請求懲罰伺服器。

在下列程式碼中，管道只在所請求的 URL 改變時才呼叫伺服器，並快取伺服器回應。
這段程式碼使用 [Angular http](guide/http) 用戶端來擷取資料：


<code-example path="pipes/src/app/fetch-json.pipe.ts" header="src/app/fetch-json.pipe.ts">

</code-example>



現在用一個展示用元件來示範它，該元件的範本定義了兩個對此管道的繫結，
兩者都請求 `heroes.json` 檔案中的英雄。


<code-example path="pipes/src/app/hero-list.component.ts" header="src/app/hero-list.component.ts">

</code-example>



該元件的渲染結果如下：


<figure>
  <img src='generated/images/guide/pipes/hero-list.png' alt="英雄清單">
</figure>



在該管道的資料請求上設定中斷點，會顯示下列內容：

* 每個繫結都有自己的管道執行個體。
* 每個管道執行個體都快取自己的 URL 與資料。
* 每個管道執行個體只呼叫伺服器一次。

<h3 class="no-toc"><i>JsonPipe</i></h3>

在前面的程式碼範例中，第二個 `fetch` 管道繫結示範了更多的管道串連。
它透過串連到內建的 `JsonPipe`，以 JSON 格式顯示相同的英雄資料。


<div class="callout is-helpful">



<header>
  使用 json 管道除錯
</header>



[JsonPipe](api/common/JsonPipe)
提供了一個簡單的方法，來診斷神秘失敗的資料繫結，或
檢視物件以供未來的繫結。


</div>



{@a pure-pipe-pure-fn}


<h3 class="no-toc">純粹管道與純粹函式</h3>

純粹管道使用純粹函式。
純粹函式處理輸入並回傳值，沒有可察覺的副作用。
給定相同的輸入，它們應該永遠回傳相同的輸出。

本頁稍早討論的管道都是以純粹函式實作的。
內建的 `DatePipe` 是一個以純粹函式實作的純粹管道。
`ExponentialStrengthPipe` 與 `FlyingHeroesPipe` 也是。
幾步之前，你檢視了 `FlyingHeroesImpurePipe`&mdash;一個以純粹函式實作的非純粹管道。

但請永遠以*純粹函式*實作*純粹管道*。
否則，你會看到許多主控台錯誤，關於運算式在被檢查後又改變了。



## 後續步驟

管道是封裝與共享常見顯示值
轉換的好方法。像使用樣式一樣使用它們，把它們
放入範本的運算式中，豐富檢視的吸引力與可用性。

在 [API 參考](api?type=pipe) 中探索 Angular 的內建管道清單。
試著撰寫一個自訂管道，或許還可以把它貢獻給社群。


{@a no-filter-pipe}



## 附錄：沒有 *FilterPipe* 或 *OrderByPipe*

Angular 不提供用於篩選或排序清單的管道。
熟悉 AngularJS 的開發者知道它們就是 `filter` 與 `orderBy`。
在 Angular 中沒有對應的東西。

這不是疏忽。Angular 不提供這類管道，是因為
它們效能不佳，且會妨礙積極的最小化。
`filter` 與 `orderBy` 都需要參照物件屬性的參數。
在本頁前面，你了解到這類管道必須是[非純粹的](guide/pipes#純粹與非純粹管道)，且
Angular 在幾乎每個變更偵測週期中都會呼叫非純粹管道。

篩選、尤其是排序，是昂貴的操作。
當 Angular 每秒多次呼叫這些管道方法時，即使是中等大小的清單，使用者體驗也會嚴重變差。
`filter` 與 `orderBy` 在 AngularJS 應用程式中經常被濫用，導致人們抱怨 Angular 本身很慢。
這個指控在間接意義上是公平的，因為 AngularJS 當初提供 `filter` 與 `orderBy`，
等於一開始就準備了這個效能陷阱。

最小化的風險也很有說服力，雖然不太明顯。想像一個排序管道被套用到英雄清單。
該清單可能會以下列方式，依英雄的 `name` 與出身 `planet` 屬性排序：

<code-example language="html">
  &lt;!-- NOT REAL CODE! -->
  &lt;div *ngFor="let hero of heroes | orderBy:'name,planet'">&lt;/div>
</code-example>



你用文字字串標識排序欄位，期望管道透過索引
（例如 `hero['name']`）參照屬性值。
不幸的是，積極的最小化會竄改 `Hero` 屬性名稱，使 `Hero.name` 與 `Hero.planet`
變成像 `Hero.a` 與 `Hero.b` 這樣的東西。顯然 `hero['name']` 就無法運作了。

雖然有些人可能不在乎如此積極地最小化，
但 Angular 產品不應阻止任何人積極最小化。
因此，Angular 團隊決定，Angular 提供的一切都能安全地最小化。

Angular 團隊與許多經驗豐富的 Angular 開發者強烈建議，把
篩選與排序邏輯移到元件本身。
元件可以公開一個 `filteredHeroes` 或 `sortedHeroes` 屬性，並掌控
何時以及多頻繁地執行支援邏輯。
任何你原本會放進管道並在整個應用程式中共享的能力，都可以
寫成篩選/排序服務，並注入到元件中。

如果這些效能與最小化的考量不適用於你，你永遠可以建立自己的這類管道
（類似 [FlyingHeroesPipe](guide/pipes#impure-flying-heroes)），或在社群中尋找它們。
