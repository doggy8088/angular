# 反應式表單

_反應式表單_ 是一種以 _反應式_ 風格建立表單的 Angular 技術。
本指南將帶你逐步建置一個「Hero Detail Editor」表單，並在過程中說明反應式表單。


{@a toc}

試試這個 <live-example stackblitz="final" title="Reactive Forms (final) in Stackblitz">Reactive Forms live-example</live-example>。

你也可以執行 <live-example title="Reactive Forms Demo in Stackblitz">Reactive Forms Demo</live-example> 版本，
並從頂部的「demo picker」中選擇中間步驟之一。


{@a intro}


## 反應式表單簡介

Angular 提供兩種表單建置技術：_反應式_ 表單與 _範本驅動_ 表單。
這兩種技術都屬於 `@angular/forms` 程式庫，
並共用一組通用的表單控制項類別。

但它們在理念、程式設計風格與技術上明顯不同。
它們甚至有各自的模組：`ReactiveFormsModule` 與 `FormsModule`。

### 反應式表單
Angular _反應式_ 表單促進一種 _反應式風格_ 的程式設計，
它偏好以明確的方式管理在非 UI 的 _資料模型_（通常從伺服器擷取）與
UI 導向的 _表單模型_ 之間流動的資料，後者保留了畫面上 HTML 控制項的狀態
與值。反應式表單讓你輕鬆運用反應式模式、測試與驗證。

使用 _反應式_ 表單時，你在元件類別中建立一棵 Angular 表單控制項物件樹，
並使用本指南所述的技術，將它們繫結到元件範本中的原生表單控制項元素。

你直接在元件類別中建立與操作表單控制項物件。由於元件類別可以立即存取資料
模型與表單控制項結構，你可以把資料模型的值推入
表單控制項，並把使用者變更的值拉出來。元件可以
觀察表單控制項狀態的變更，並對這些變更做出反應。

直接使用表單控制項物件的一個優點是，值與有效性的更新
[永遠是同步的，且在你的掌控之下](guide/reactive-forms#async-vs-sync "Async vs sync")。
你不會遇到有時困擾範本驅動表單的時機問題，
而且反應式表單更容易進行單元測試。

為了符合反應式範式，元件
保持 _資料模型_ 的不可變性，
把它視為原始值的純粹來源。
元件不會直接更新資料模型，而是
萃取使用者的變更，並轉交給外部元件或服務，
由它對這些變更做一些處理（例如儲存它們），
再把反映更新後模型狀態的新 _資料模型_ 傳回給元件。

使用反應式表單指令不要求你遵循所有反應式原則，
但如果你選擇採用反應式程式設計做法，它能讓這個做法更容易實現。

### 範本驅動表單

_範本驅動_ 表單在 [範本指南](guide/forms) 中介紹，採用完全不同的做法。

你把 HTML 表單控制項（例如 `<input>` 與 `<select>`）放在元件範本中，
並使用像 `ngModel` 這類指令，把它們繫結到元件中的 _資料模型_ 屬性。

你不用建立 Angular 表單控制項物件。Angular 指令
會使用你資料繫結中的資訊，替你建立它們。
你不用推入與拉出資料值。Angular 用 `ngModel` 替你處理。
Angular 會隨著使用者的變更，即時更新可變的 _資料模型_。

因此，`ngModel` 指令不屬於 ReactiveFormsModule。

雖然這表示元件類別中的程式碼較少，
但[範本驅動表單是非同步的](guide/reactive-forms#async-vs-sync "Async vs sync")，
這可能讓進階情境的開發變得複雜。


{@a async-vs-sync}


### 非同步與同步

反應式表單是同步的，而範本驅動表單是非同步的。

在反應式表單中，你在程式碼中建立整棵表單控制項樹。
你可以立即更新某個值，或往父表單的子孫控制項深入鑽探，
因為所有控制項隨時可用。

範本驅動表單把表單控制項的建立委派給指令。
為了避免「_checked 後變更_」錯誤，
這些指令需要超過一個週期來建立整棵控制項樹。
這表示你必須等待一個 tick，才能從元件類別中操作任何控制項。

例如，如果你用 `@ViewChild(NgForm)` 查詢注入表單控制項，並在
[`ngAfterViewInit` 生命週期鉤子](guide/lifecycle-hooks#afterview "Lifecycle hooks guide: AfterView") 中檢視它，
你會發現它沒有子控制項。
你必須使用 `setTimeout` 等待一個 tick，才能
從控制項萃取值、測試其有效性，或把它設為新值。

範本驅動表單的非同步性也讓單元測試變得複雜。
你必須把測試區塊包在 `async()` 或 `fakeAsync()` 中，
以避免在表單中尋找尚未存在的值。
使用反應式表單，一切都在你預期的時間點就緒。

### 選擇反應式或範本驅動表單

反應式與範本驅動表單是
兩種不同的架構範式，
各有其優點與缺點。
選擇最適合你的做法。
你也可以決定在同一個應用程式中同時使用兩者。

本頁其餘部分將探討 _反應式_ 範式，
並專注於反應式表單的技術。
如需 _範本驅動表單_ 的資訊，請參閱 [_Forms_](guide/forms) 指南。

在下一節中，你將為反應式表單範例設定專案。
接著你會了解 [Angular 表單類別](guide/reactive-forms#essentials)，以及如何在反應式表單中使用它們。



{@a setup}


## 設定

建立一個名為 <code>angular-reactive-forms</code> 的新專案：

<code-example language="sh" class="code-shell">

  ng new angular-reactive-forms

</code-example>

{@a data-model}


## 建立資料模型
本指南的重點是一個用來編輯英雄的反應式表單元件。
你需要一個 `hero` 類別與一些英雄資料。

使用 CLI，產生一個名為 `data-model` 的新類別：

<code-example language="sh" class="code-shell">

  ng generate class data-model

</code-example>

並把下列內容複製到 `data-model.ts`：

<code-example path="reactive-forms/src/app/data-model.ts" title="src/app/data-model.ts" linenums="false">

</code-example>

這個檔案匯出兩個類別與兩個常數。`Address`
與 `Hero` 類別定義了應用程式的 _資料模型_。
`heroes` 與 `states` 常數提供測試資料。

{@a create-component}


## 建立 _反應式表單_ 元件

產生一個名為 `HeroDetail` 的新元件：

<code-example language="sh" class="code-shell">

  ng generate component HeroDetail

</code-example>

並匯入：

<code-example path="reactive-forms/src/app/hero-detail/hero-detail-1.component.ts" region="import" title="src/app/hero-detail/hero-detail.component.ts" linenums="false">

</code-example>

接著，為 `HeroDetailComponent` 類別加入一個 `FormControl`。
`FormControl` 是一個指令，讓你可以直接建立與管理
`FormControl` 執行個體。

<code-example path="reactive-forms/src/app/hero-detail/hero-detail-1.component.ts" region="v1" title="src/app/hero-detail/hero-detail.component.ts (excerpt)" linenums="false">

</code-example>

這會建立一個名為 `name` 的 `FormControl`。
它將在範本中繫結到一個用於英雄名稱的 HTML `<input>` 元素。

一個 `FormControl` 建構子接受三個可選引數：
初始資料值、驗證器陣列，以及非同步驗證器陣列。


<div class="l-sub-section">

這個簡單的控制項沒有資料也沒有驗證器。
在真實的應用程式中，大多數表單控制項兩者都有。如需 `Validators` 的深入資訊，
請參閱[表單驗證](guide/form-validation)指南。

</div>

{@a create-template}

## 建立範本

現在用下列標記更新元件的範本。

<code-example path="reactive-forms/src/app/hero-detail/hero-detail-1.component.html" region="simple-control" title="src/app/hero-detail/hero-detail.component.html" linenums="false">

</code-example>

若要讓 Angular 知道這是你想要
與類別中的 `name` `FormControl` 關聯的輸入，
你需要在範本的 `<input>` 上加上 `[formControl]="name"`。

<div class="l-sub-section">

請忽略 `form-control` CSS 類別。它屬於
<a href="http://getbootstrap.com/" title="Bootstrap CSS">Bootstrap CSS 程式庫</a>，
不是 Angular 的，它為表單提供樣式，但完全不影響邏輯。

</div>

{@a import}

## 匯入 `ReactiveFormsModule`

`HeroDetailComponent` 範本使用來自
`ReactiveFormsModule` 的 `formControlName` 指令。

在 `app.module.ts` 中做下列兩件事：

1. 使用 JavaScript `import` 陳述式來存取
`ReactiveFormsModule`。
1. 把 `ReactiveFormsModule` 加入 `AppModule` 的 `imports` 清單。

<code-example path="reactive-forms/src/app/app.module.ts" region="v1" title="src/app/app.module.ts (excerpt)" linenums="false">

</code-example>

{@a update}

## 顯示 `HeroDetailComponent`
修改 `AppComponent` 範本，讓它顯示 `HeroDetailComponent`。

<code-example path="reactive-forms/src/app/app.component.1.html" title="src/app/app.component.html" linenums="false">

</code-example>

{@a essentials}

## 基本表單類別
本指南使用四個基本類別來建置反應式表單：


<table>

  <tr>

    <th>
      類別
    </th>

    <th>
      說明
    </th>

  </tr>

  <tr>

    <td style="vertical-align: top">
      <code>AbstractControl</code>
    </td>

    <td>

      [`AbstractControl`](api/forms/AbstractControl "API Reference: FormControl") 是三個具體表單控制項類別的抽象基底類別：
`FormControl`、`FormGroup` 與 `FormArray`。
它提供它們共用的行為與屬性。

    </td>

  </tr>

  <tr>

    <td style="vertical-align: top">
      <code>FormControl</code>
    </td>

    <td>

      [`FormControl`](api/forms/FormControl "API Reference: FormControl")
追蹤單一表單控制項的值與有效性狀態。
它對應到一個 HTML 表單控制項，例如 `<input>` 或 `<select>`。

    </td>

  </tr>

  <tr>

    <td style="vertical-align: top">
      <code>FormGroup</code>
    </td>

    <td>

      [`FormGroup`](api/forms/FormGroup "API Reference: FormGroup")
追蹤一組 `AbstractControl` 執行個體的值與有效性狀態。
群組的屬性包含它的子控制項。
元件中的頂層表單是一個 `FormGroup`。

    </td>

  </tr>

  <tr>

    <td style="vertical-align: top">
      <code>FormArray</code>
    </td>

    <td>

      [`FormArray`](api/forms/FormArray "API Reference: FormArray")
追蹤一組以數字索引的 `AbstractControl` 執行個體陣列的值與有效性狀態。

    </td>

  </tr>

</table>


## 為應用程式加上樣式

若要使用 `AppComponent` 與 `HeroDetailComponent` 兩者的範本 HTML 中出現的 bootstrap CSS 類別，
把 `bootstrap` CSS 樣式表加入 `styles.css` 的開頭：


<code-example path="reactive-forms/src/styles.1.css" title="styles.css" linenums="false">

</code-example>

現在一切都已接好，用下列指令提供應用程式：

<code-example language="sh" class="code-shell">

  ng serve

</code-example>

瀏覽器應該會顯示類似這樣的畫面：


<figure>
  <img src="generated/images/guide/reactive-forms/just-formcontrol.png" alt="單一 FormControl">
</figure>

{@a formgroup}

## 加入 FormGroup
通常，如果你有多個 `FormControls`，你會把它們註冊在
一個父 `FormGroup` 之中。
若要加入 `FormGroup`，把它加到 `hero-detail.component.ts` 的 imports 區段：

<code-example path="reactive-forms/src/app/hero-detail/hero-detail-2.component.ts" region="imports" title="src/app/hero-detail/hero-detail.component.ts" linenums="false">

</code-example>

在類別中，把 `FormControl` 包進一個名為 `heroForm` 的 `FormGroup`，如下所示：

<code-example path="reactive-forms/src/app/hero-detail/hero-detail-2.component.ts" region="v2" title="src/app/hero-detail/hero-detail.component.ts" linenums="false">

</code-example>

現在你已在類別中做了變更，這些變更需要反映在
範本中。用下列內容取代 `hero-detail.component.html` 來更新它。

<code-example path="reactive-forms/src/app/hero-detail/hero-detail-2.component.html" region="basic-form" title="src/app/hero-detail/hero-detail.component.html" linenums="false">

</code-example>

請注意，現在單一的 `<input>` 位於一個 `<form>` 元素中。

`formGroup` 是一個反應式表單指令，它接受一個既有的
`FormGroup` 執行個體，並把它與一個 HTML 元素關聯。
在這個例子中，它把你儲存為
`heroForm` 的 `FormGroup` 與 `<form>` 元素關聯。

由於類別現在有了一個 `FormGroup`，你必須更新範本
語法，才能把 `<input>` 與元件類別中對應的
`FormControl` 關聯。
沒有父 `FormGroup` 時，
`[formControl]="name"` 先前能運作，是因為該指令
可以獨立運作，也就是說，它不需要在 `FormGroup` 中也能運作。
有了父 `FormGroup`，`name` `<input>` 需要
`formControlName=name` 語法，才能與類別中
正確的 `FormControl` 關聯。這個語法告訴 Angular 先尋找父
`FormGroup`（在這個例子中是 `heroForm`），然後在該群組 _內部_
尋找一個名為 `name` 的 `FormControl`。


{@a json}

## 看看表單模型

當使用者在 `<input>` 中輸入資料時，該值
會進入 **_表單模型_**。
若要查看表單模型，在 `hero-detail.component.html` 中閉合的 `<form>` 標籤之後，
加入下列這一行：


<code-example path="reactive-forms/src/app/hero-detail/hero-detail-2.component.html" region="form-value-json" title="src/app/hero-detail/hero-detail.component.html" linenums="false">

</code-example>


`heroForm.value` 傳回 _表單模型_。
把它透過 `JsonPipe` 管道處理，會把模型以 JSON 形式呈現在瀏覽器中：


<figure>
  <img src="generated/images/guide/reactive-forms/json-output.png" alt="JSON 輸出">
</figure>

`name` 屬性的初始值是空字串。
在名稱 `<input>` 中輸入，並看著按鍵輸入出現在 JSON 中。

在真實的應用程式中，表單很快就會變得龐大。
`FormBuilder` 讓表單的開發與維護更容易。


{@a formbuilder}

## `FormBuilder` 簡介

`FormBuilder` 類別替你處理控制項建立的細節，
有助於減少重複與雜亂。

若要使用 `FormBuilder`，把它匯入 `hero-detail.component.ts`。你可以移除 `FormControl`：

<code-example path="reactive-forms/src/app/hero-detail/hero-detail-3a.component.ts" region="imports" title="src/app/hero-detail/hero-detail.component.ts (excerpt)" linenums="false">

</code-example>

用它來把 `HeroDetailComponent` 重構得更容易閱讀與撰寫，
遵循下列計畫：

* 明確宣告 `heroForm` 屬性的型別為 `FormGroup`；你稍後會初始化它。
* 把 `FormBuilder` 注入建構子。
* 加入一個新方法，使用 `FormBuilder` 來定義 `heroForm`；把它命名為 `createForm()`。
* 在建構子中呼叫 `createForm()`。

修改後的 `HeroDetailComponent` 如下所示：

<code-example path="reactive-forms/src/app/hero-detail/hero-detail-3a.component.ts" region="v3a" title="src/app/hero-detail/hero-detail.component.ts (excerpt)" linenums="false">

</code-example>



`FormBuilder.group` 是一個建立 `FormGroup` 的工廠方法。 &nbsp;
`FormBuilder.group` 接受一個物件，其鍵與值是 `FormControl` 名稱與它們的定義。
在這個範例中，`name` 控制項由其初始資料值（一個空字串）定義。

在單一物件中定義一組控制項，能讓你的程式碼更精簡且更易讀，因為你不必重複撰寫 `new FormControl(...)` 陳述式。

{@a validators}

### `Validators.required`
雖然本指南不會深入探討驗證，這裡有一個範例，
示範在反應式表單中使用 `Validators.required` 的簡便性。

首先，匯入 `Validators` 符號。

<code-example path="reactive-forms/src/app/hero-detail/hero-detail-3.component.ts" region="imports" title="src/app/hero-detail/hero-detail.component.ts (excerpt)" linenums="false">

</code-example>



若要讓 `name` `FormControl` 變成必填，把 `FormGroup` 中的 `name`
屬性換成一個陣列。
第一個項目是 `name` 的初始值；
第二個是必填驗證器 `Validators.required`。


<code-example path="reactive-forms/src/app/hero-detail/hero-detail-3.component.ts" region="required" title="src/app/hero-detail/hero-detail.component.ts (excerpt)" linenums="false">

</code-example>



<div class="l-sub-section">

反應式驗證器是簡單、可組合的函式。
在範本驅動表單中，驗證的設定方式不同，因為你必須把驗證器包在指令中。

</div>

更新範本底部的診斷訊息，讓它顯示表單的有效性狀態。

<code-example path="reactive-forms/src/app/hero-detail/hero-detail-3.component.html" region="form-value-json" title="src/app/hero-detail/hero-detail.component.html (excerpt)" linenums="false">

</code-example>

瀏覽器顯示如下：

<figure>
  <img src="generated/images/guide/reactive-forms/validators-json-output.png" alt="單一 FormControl">
</figure>

`Validators.required` 正在運作。狀態是 `INVALID`，因為 `<input>` 沒有值。
在 `<input>` 中輸入，即可看到狀態從 `INVALID` 變成 `VALID`。

在真實的應用程式中，你會把診斷訊息換成對使用者友善的體驗。

在本指南的其餘部分，使用 `Validators.required` 是可選的。
它會以相同的設定保留在後續的每個範例中。

如需驗證 Angular 表單的更多資訊，請參閱
[表單驗證](guide/form-validation)指南。

### 更多 `FormControl`

本節加入額外的 `FormControl`，用於地址、超能力與跟班。

此外，地址有一個 state 屬性。使用者將用 `<select>` 選擇州別，你會把
`<option>` 元素填入各州。因此，從 `data-model.ts` 匯入 `states`。

<code-example path="reactive-forms/src/app/hero-detail/hero-detail-4.component.ts" region="imports" title="src/app/hero-detail/hero-detail.component.ts (excerpt)" linenums="false">

</code-example>

宣告 `states` 屬性，並把一些地址 `FormControls` 加入 `heroForm`，如下所示。

<code-example path="reactive-forms/src/app/hero-detail/hero-detail-4.component.ts" region="v4" title="src/app/hero-detail/hero-detail.component.ts (excerpt)" linenums="false">

</code-example>

接著在 `hero-detail.component.html` 中加入對應的標記，如下所示。

<code-example path="reactive-forms/src/app/hero-detail/hero-detail-4.component.html" title="src/app/hero-detail/hero-detail.component.html" linenums="false">

</code-example>

<div class="alert is-helpful">

*注意*：請忽略這個標記中多次提及的 `form-group`、
`form-control`、`center-block` 與 `checkbox`。
那些是 Angular 本身會忽略的 _bootstrap_ CSS 類別。
請注意 `[formGroup]` 與 `formControlName` 屬性。
它們是把 HTML 控制項繫結到元件類別中 Angular `FormGroup` 與 `FormControl` 屬性的 Angular 指令。

</div>

修改後的範本包含更多文字 `<input>` 元素、一個用於 `state` 的 `<select>`、用於 `power` 的單選按鈕，
以及一個用於 `sidekick` 的 `<checkbox>`。

你必須用 `[value]="state"` 繫結 `<option>` 的 value 屬性。
如果你不繫結這個值，select 會顯示資料模型中的第一個選項。

元件 _類別_ 定義控制項屬性時，不考慮它們在範本中的呈現方式。
你以定義 `name` 控制項的相同方式，定義 `state`、`power` 與 `sidekick` 控制項。
你用相同的方式把這些控制項繫結到範本 HTML 元素，
即用 `formControlName` 指令指定 `FormControl` 名稱。

如需更多資訊，請參閱 API 參考中的
[單選按鈕](api/forms/RadioControlValueAccessor "API: RadioControlValueAccessor")、
[下拉選單](api/forms/SelectControlValueAccessor "API: SelectControlValueAccessor")與
[核取方塊](api/forms/CheckboxControlValueAccessor "API: CheckboxControlValueAccessor")。



{@a grouping}


### 巢狀 FormGroup

為了更有效地管理表單的大小，你可以把一些相關的 `FormControls`
分組到一個巢狀的 `FormGroup` 中。例如，`street`、`city`、`state` 與 `zip` 是地址 `FormGroup` 的理想屬性。
以這種方式巢狀化群組與控制項，能讓你
對應資料模型的階層結構，
並有助於追蹤相關控制項集合的驗證與狀態。

你使用 `FormBuilder` 在這個元件中建立了一個名為 `heroForm` 的 `FormGroup`。
讓它作為父 `FormGroup`。
再次使用 `FormBuilder` 建立一個封裝 `address` 控制項的子 `FormGroup`；
把結果指派給父 `FormGroup` 的新 `address` 屬性。

<code-example path="reactive-forms/src/app/hero-detail/hero-detail-5.component.ts" region="v5" title="src/app/hero-detail/hero-detail.component.ts (excerpt)" linenums="false">

</code-example>



當你變更元件類別中表單控制項的結構時，
你必須對元件範本做對應的調整。

在 `hero-detail.component.html` 中，把與地址相關的 `FormControls` 包在一個 `<div>` 中。
把 `formGroupName` 指令加到該 `div` 上，並把它繫結到 `"address"`。
那是父 `FormGroup`（名為 `heroForm`）中 `address` 子 `FormGroup` 的屬性。保留包含 `name` `<input>` 的 `<div>`。

為了讓這個變更在視覺上更明顯，在接近頂部的地方加入一個 `<h4>` 標題，文字為 _Secret Lair_。
新的地址 HTML 如下所示：


<code-example path="reactive-forms/src/app/hero-detail/hero-detail-5.component.html" region="add-group" title="src/app/hero-detail/hero-detail.component.html (excerpt)" linenums="false">

</code-example>


這些變更之後，瀏覽器中的 JSON 輸出顯示修改後的表單模型，
其中包含巢狀的地址 `FormGroup`：

<figure>
  <img src="generated/images/guide/reactive-forms/address-group.png" alt="JSON 輸出">
</figure>

這表明範本
與表單模型正在彼此溝通。

{@a properties}

## 檢視 `FormControl` 屬性

你可以用 `get()` 方法萃取單一 `FormControl`，來檢視表單中的它。
你可以在元件類別中這樣做，或是把下列內容加入範本中來在
頁面上顯示它，
緊接在 `{{form.value | json}}` 插值之後，如下所示：

<code-example path="reactive-forms/src/app/hero-detail/hero-detail-5.component.html" region="inspect-value" title="src/app/hero-detail/hero-detail.component.html" linenums="false">

</code-example>

若要取得位於 `FormGroup` 內部的 `FormControl` 的狀態，使用點記法來遍歷到該控制項。

<code-example path="reactive-forms/src/app/hero-detail/hero-detail-5.component.html" region="inspect-child-control" title="src/app/hero-detail/hero-detail.component.html" linenums="false">

</code-example>

<div class="alert is-helpful">

*注意*：如果你跟著一起撰寫程式碼，記得在進行到 `FormArray` 一節時，移除這裡對 `address.street` 的參照。在那一節中，你會變更元件類別中 address 的名稱，如果把它留在範本中，就會擲出錯誤。

</div>

你可以使用這個技巧來顯示 `FormControl` 的任何屬性，
例如下列之一：

<style>
  td, th {vertical-align: top}
</style>



<table width="100%">

  <col width="10%">

  </col>

  <col width="90%">

  </col>

  <tr>

    <th>
      屬性
    </th>

    <th>
      說明
    </th>

  </tr>

  <tr>

    <td>
      <code>myControl.value</code>
    </td>

    <td>


      `FormControl` 的值。

  </tr>

  <tr>

    <td>
      <code>myControl.status</code>
    </td>

    <td>


      `FormControl` 的有效性。可能的值：`VALID`、
       `INVALID`、`PENDING` 或 `DISABLED`。

  </tr>

  <tr>

    <td>
      <code>myControl.pristine</code>
    </td>

    <td>


      如果使用者 _尚未_ 在 UI 中變更值，則為 `true`。
      它的相反是 `myControl.dirty`。

  </tr>

  <tr>

    <td>
      <code>myControl.untouched</code>
    </td>

    <td>


      如果控制項使用者尚未進入該 HTML 控制項
       並觸發其 blur 事件，則為 `true`。它的相反是 `myControl.touched`。

    </td>

  </tr>

</table>



如需其他 `FormControl` 屬性，請參閱
[_AbstractControl_](api/forms/AbstractControl) API 參考。

檢視 `FormControl` 屬性的一個常見原因是
確保使用者輸入了有效的值。
如需驗證 Angular 表單的更多資訊，請參閱
[表單驗證](guide/form-validation)指南。

{@a data-model-form-model}

## 資料模型與表單模型

目前，表單顯示的是空值。
`HeroDetailComponent` 應該顯示一位英雄的值，
可能是一位從遠端伺服器擷取的英雄。

在這個應用程式中，`HeroDetailComponent` 從父 `HeroListComponent` 取得它的英雄。

來自伺服器的 `hero` 是 **_資料模型_**。
`FormControl` 結構是 **_表單模型_**。

元件必須把資料模型中的英雄值複製到表單模型中。
這有兩個重要的含義：

1. 開發人員必須了解資料模型的屬性如何
對應到表單模型的屬性。

2. 使用者的變更從 DOM 元素流向表單模型，而不是流向資料模型。

表單控制項永遠不會更新 _資料模型_。

表單與資料模型的結構不需要完全一致。
你經常在特定畫面上只呈現資料模型的一個子集。
但如果表單模型的形狀接近資料模型的形狀，事情會更容易。

在這個 `HeroDetailComponent` 中，這兩個模型非常接近。

以下是 `data-model.ts` 中 `Hero` 與 `Address` 的定義：

<code-example path="reactive-forms/src/app/data-model.ts" region="model-classes" title="src/app/data-model.ts (classes)" linenums="false">

</code-example>

這裡再次列出元件的 `FormGroup` 定義。

<code-example path="reactive-forms/src/app/hero-detail/hero-detail-6.component.ts" region="hero-form-model" title="src/app/hero-detail/hero-detail.component.ts (excerpt)" linenums="false">

</code-example>



這兩個模型之間有兩個顯著的差異：

1. `Hero` 有一個 `id`。表單模型沒有，因為你通常不會把主鍵顯示給使用者。

1. `Hero` 有一個地址陣列。這個表單模型只呈現一個地址，
這會在下方關於 [`FormArray`](guide/reactive-forms#form-array "Form arrays") 的一節中介紹。

讓兩個模型的形狀保持接近，有助於在下一節中用 `patchValue()` 與 `setValue()` 方法，把資料模型屬性複製到表單模型。


首先，如下重構 `address` `FormGroup` 定義：

<code-example path="reactive-forms/src/app/hero-detail/hero-detail-7.component.ts" region="address-form-group" title="src/app/hero-detail/hero-detail.component.ts" linenums="false">

</code-example>


也要記得更新從 `data-model` 的 `import`，這樣你才能參照 `Hero` 與 `Address` 類別：

<code-example path="reactive-forms/src/app/hero-detail/hero-detail-7.component.ts" region="import-address" title="src/app/hero-detail/hero-detail.component.ts" linenums="false">

</code-example>

{@a set-data}

## 用 `setValue()` 與 `patchValue()` 填入表單模型

<div class="alert is-helpful">

*注意*：如果你跟著一起撰寫程式碼，本節是可選的，因為其餘步驟不依賴它。

</div>

先前，你建立了控制項並同時初始化它的值。
你也可以稍後用
`setValue()` 與 `patchValue()` 方法初始化或重設這些值。

### `setValue()`
使用 `setValue()` 時，你透過傳入一個資料物件，一次指派每個表單控制項的值，該物件的屬性與 `FormGroup` 背後的表單模型完全吻合。

<code-example path="reactive-forms/src/app/hero-detail/hero-detail-7.component.ts" region="set-value" title="src/app/hero-detail/hero-detail.component.ts (excerpt)" linenums="false">

</code-example>

`setValue()` 方法會在指派任何表單控制項值之前，徹底檢查資料物件。

它不會接受與 `FormGroup` 結構不符的資料物件，或
缺少群組中任何控制項值的資料物件。如此一來，如果你有錯字，或你錯誤地巢狀化了控制項，它能傳回有幫助的
錯誤訊息。相反地，`patchValue()` 會無聲地失敗。

請注意，你幾乎可以把整個 `hero` 用作 `setValue()` 的引數，
因為它的形狀與元件的 `FormGroup` 結構相似。

你只能顯示英雄的第一個地址，而且你必須考慮到 `hero` 可能完全沒有地址的可能性，如同在資料物件引數中條件式地設定 `address` 屬性所示：

<code-example path="reactive-forms/src/app/hero-detail/hero-detail-7.component.ts" region="set-value-address" title="src/app/hero-detail/hero-detail.component.ts" linenums="false">

</code-example>



### `patchValue()`
使用 **`patchValue()`**，你可以透過提供一個鍵／值對物件，把值指派給 `FormGroup` 中的特定控制項。

這個範例只設定表單的 `name` 控制項。

<code-example path="reactive-forms/src/app/hero-detail/hero-detail-6.component.ts" region="patch-value" title="src/app/hero-detail/hero-detail.component.ts (excerpt)" linenums="false">

</code-example>



使用 `patchValue()`，你在處理分歧的資料與表單模型時有更大的彈性。
但與 `setValue()` 不同，`patchValue()` 無法檢查缺失的控制項
值，也不會擲出有幫助的錯誤。


{@a hero-list}

## 建立 `HeroListComponent` 與 `HeroService`

為了示範更多反應式表單技術，在範例中加入更多功能會很有幫助，方法是加入一個 `HeroListComponent` 與一個 `HeroService`。

`HeroDetailComponent` 是 _主／從_ 檢視中 `HeroListComponent` 的巢狀子元件。它們合起來如下所示：


<figure>
  <img src="generated/images/guide/reactive-forms/hero-list.png" alt="HeroListComponent">
</figure>


首先，用下列指令加入 `HeroListComponent`：

<code-example language="sh" class="code-shell">

  ng generate component HeroList

</code-example>

賦予 `HeroListComponent` 下列內容：

<code-example path="reactive-forms/src/app/hero-list/hero-list.component.ts" title="hero-list.component.ts" linenums="false">

</code-example>


接著，用下列指令加入 `HeroService`：

<code-example language="sh" class="code-shell">

  ng generate service Hero

</code-example>

然後，賦予它下列內容：

<code-example path="reactive-forms/src/app/hero.service.ts" title="hero.service.ts" linenums="false">

</code-example>

`HeroListComponent` 使用注入的 `HeroService` 從伺服器擷取英雄，
然後把這些英雄以一系列按鈕呈現給使用者。
`HeroService` 模擬一個 HTTP 服務。
它傳回一個英雄的 `Observable`，在短暫延遲後解析，
既是為了模擬網路延遲，也是為了在視覺上
指出應用程式必然的非同步本質。

當使用者按一下某位英雄時，
元件設定它的 `selectedHero` 屬性，該屬性
繫結到 `HeroDetailComponent` 的 `hero` `@Input()` 屬性。
`HeroDetailComponent` 偵測到英雄變更，並用該英雄的資料值重設它的表單。

重新整理按鈕會在重新擷取英雄之前，清除英雄清單與目前選取的英雄。

請注意，`hero-list.component.ts` 匯入 `Observable` 與 `finally`，而 `hero.service.ts` 從 `rxjs` 匯入 `Observable`、`of`
與 `delay`。

其餘的 `HeroListComponent` 與 `HeroService` 實作細節不在本教學的範圍內。
不過，相關技術在文件的其他地方有介紹，包括 _英雄之旅_
[這裡](tutorial/toh-pt3 "ToH: Multiple Components")與[這裡](tutorial/toh-pt4 "ToH: Services")。

若要使用 `HeroService`，把它匯入 `AppModule` 並加入 `providers` 陣列。若要使用 `HeroListComponent`，匯入它、宣告它，並匯出它：

<code-example path="reactive-forms/src/app/app.module.ts" region="hero-service-list" title="app.module.ts (excerpts)" linenums="false">

</code-example>


接著，用下列內容更新 `HeroListComponent` 範本：

<code-example path="reactive-forms/src/app/hero-list/hero-list.component.html" title="hero-list.component.html" linenums="false">

</code-example>

這些變更需要反映在 `AppComponent` 範本中。用更新後的標記取代 `app.component.html` 的內容，改用 `HeroListComponent`，而不是 `HeroDetailComponent`：

<code-example path="reactive-forms/src/app/app.component.html" title="app.component.html" linenums="false">

</code-example>


最後，為 `HeroDetailComponent` 加入一個 `@Input()` 屬性，
讓 `HeroDetailComponent` 能接收來自 `HeroListComponent` 的資料。也記得把 `Input` 符號加入 JavaScript imports 清單中的 `@angular/core` `import` 陳述式。

<code-example path="reactive-forms/src/app/hero-detail/hero-detail-6.component.ts" region="hero" title="hero-detail.component.ts (excerpt)" linenums="false">

</code-example>

現在你應該能按一下某位英雄的按鈕，並呈現一個表單。

## 何時設定表單模型值（`ngOnChanges`）

何時設定表單模型值，取決於元件何時取得資料模型值。

`HeroListComponent` 向使用者顯示英雄名稱。
當使用者按一下某位英雄時，`HeroListComponent` 透過繫結到 `hero` `@Input()` 屬性，把選取的英雄傳入 `HeroDetailComponent`。

<code-example path="reactive-forms/src/app/hero-list/hero-list.component.1.html" title="hero-list.component.html (simplified)" linenums="false">

</code-example>

在這個做法中，`HeroDetailComponent` 中 `hero` 的值，
會在使用者每次選取新英雄時變更。
你可以使用 [ngOnChanges](guide/lifecycle-hooks#onchanges)
生命週期鉤子來呼叫 `setValue()`，Angular 會在 `@Input()` `hero` 屬性變更時呼叫它。

### 重設表單

首先，在 `hero-detail.component.ts` 中匯入 `OnChanges` 符號。

<code-example path="reactive-forms/src/app/hero-detail/hero-detail-6.component.ts" region="import-input" title="src/app/hero-detail/hero-detail.component.ts (core imports)" linenums="false">

</code-example>

接著，讓 Angular 知道 `HeroDetailComponent` 實作了 `OnChanges`：

<code-example path="reactive-forms/src/app/hero-detail/hero-detail.component.ts" region="onchanges-implementation" title="src/app/hero-detail/hero-detail.component.ts (excerpt)" linenums="false">

</code-example>


把 `ngOnChanges` 方法加入類別，如下所示：

<code-example path="reactive-forms/src/app/hero-detail/hero-detail-7.component.ts" region="ngOnChanges" title="src/app/hero-detail/hero-detail.component.ts (ngOnchanges)" linenums="false">

</code-example>

請注意，它呼叫 `rebuildForm()`，那是一個你可以在其中
設定值的方法。你可以把 `rebuildForm()` 命名為任何對你有意義的名稱。它不是 Angular 內建的，而是你建立的一個方法，用來有效運用 `ngOnChanges` 生命週期鉤子。

<code-example path="reactive-forms/src/app/hero-detail/hero-detail-7.component.ts" region="rebuildForm" title="src/app/hero-detail/hero-detail.component.ts" linenums="false">

</code-example>

`rebuildForm()` 方法做兩件事：重設英雄的名稱與地址。

{@a form-array}

## 使用 _FormArray_ 呈現一組 `FormGroups`
`FormGroup` 是一個具名物件，其屬性值是 `FormControls` 與其他 `FormGroups`。

有時你需要呈現任意數量的控制項或群組。
例如，一位英雄可能有零個、一個或任意多個地址。

`Hero.addresses` 屬性是一個 `Address` 執行個體陣列。
一個 `address` `FormGroup` 可以顯示一個 `Address`。
一個 Angular `FormArray` 可以顯示一組 `address` `FormGroups`。

若要存取 `FormArray` 類別，把它匯入 `hero-detail.component.ts`：

<code-example path="reactive-forms/src/app/hero-detail/hero-detail-8.component.ts" region="imports" title="src/app/hero-detail/hero-detail.component.ts (excerpt)" linenums="false">

</code-example>

若要使用 `FormArray`，請做下列事項：

1. 定義陣列中的項目；也就是 `FormControls` 或 `FormGroups`。

1. 用資料模型中的資料建立的項目來初始化陣列。

1. 依使用者的需要加入與移除項目。

為 `Hero.addresses` 定義一個 `FormArray`，並
讓使用者加入或修改地址。

你需要在 `HeroDetailComponent` 的 `createForm()` 方法中重新定義表單模型，
該方法目前只在一個 `address` `FormGroup` 中顯示第一個英雄地址：

<code-example path="reactive-forms/src/app/hero-detail/hero-detail-7.component.ts" region="address-form-group" title="src/app/hero-detail/hero-detail.component.ts" linenums="false">

</code-example>

### 從 `address` 到 `secretLairs`

從使用者的觀點來看，英雄沒有 _地址_。
地址是給凡人的。英雄有 _秘密基地_！
把 address `FormGroup` 定義換成 `secretLairs` `FormArray` 定義：

<code-example path="reactive-forms/src/app/hero-detail/hero-detail-8.component.ts" region="secretLairs-form-array" title="src/app/hero-detail/hero-detail-8.component.ts" linenums="false">

</code-example>

在 `hero-detail.component.html` 中，把 `formArrayName="address"` 改成 `formArrayName="secretLairs"`。

<code-example path="reactive-forms/src/app/hero-detail/hero-detail-8.component.html" region="form-array-name" title="src/app/hero-detail/hero-detail.component.ts" linenums="false">

</code-example>

<div class="alert is-helpful">

把表單控制項名稱從 `address` 改成 `secretLairs`，強調了一個重要的觀點：
_表單模型_ 不必與 _資料模型_ 一致。

顯然，兩者之間必須存在某種關係。
但它可以是應用程式領域中有意義的任何關係。

_呈現_ 需求經常與 _資料_ 需求不同。
反應式表單做法既強調也促進了這個區別。

</div>

### 初始化 `secretLairs` _FormArray_

預設表單顯示一位沒有名稱、沒有地址的英雄。

你需要一個方法，每當
父 `HeroListComponent` 把 `HeroDetailComponent.hero` `@Input()` 屬性設為新的 `Hero` 時，就用實際的英雄地址填入（或重新填入）`secretLairs`。

下列 `setAddresses()` 方法把 `secretLairs` `FormArray` 換成新的 `FormArray`，
並以一組英雄地址 `FormGroups` 陣列初始化。把它加入 `HeroDetailComponent` 類別：

<code-example path="reactive-forms/src/app/hero-detail/hero-detail-8.component.ts" region="set-addresses" title="src/app/hero-detail/hero-detail.component.ts" linenums="false">

</code-example>

請注意，你是用
`FormGroup.setControl()` 方法取代先前的 `FormArray`，而不是用 `setValue()`。
你取代的是一個 _控制項_，而不是控制項的 _值_。

也請注意，`secretLairs` `FormArray` 包含的是 `FormGroups`，不是 `Addresses`。

接著，從 `rebuildForm()` 中呼叫 `setAddresses()`：

<code-example path="reactive-forms/src/app/hero-detail/hero-detail-8.component.ts" region="rebuildform" title="src/app/hero-detail/hero-detail.component.ts" linenums="false">

</code-example>


### 取得 _FormArray_
`HeroDetailComponent` 應該能從 `secretLairs` `FormArray` 顯示、加入與移除項目。

使用 `FormGroup.get()` 方法取得該 `FormArray` 的參照。
為了清楚與重複使用，把運算式包在一個 `secretLairs` 便利屬性中。把下列內容加入 `HeroDetailComponent`。

<code-example path="reactive-forms/src/app/hero-detail/hero-detail-8.component.ts" region="get-secret-lairs" title="src/app/hero-detail/hero-detail.component.ts (secretLairs property)" linenums="false">

</code-example>

### 顯示 _FormArray_

目前的 HTML 範本顯示單一的 `address` `FormGroup`。
修改它，讓它顯示零個、一個或多個英雄的 `address` `FormGroups`。

這主要是把先前地址的範本 HTML 包在一個 `<div>` 中，
並用 `*ngFor` 重複該 `<div>`。

撰寫 `*ngFor` 時有三個要點：

1. 在帶有 `*ngFor` 的 `<div>` 外面再包一個 `<div>`，並
把它的 `formArrayName` 指令設為 `"secretLairs"`。
這個步驟建立 `secretLairs` `FormArray` 作為內部重複 HTML 範本中表單控制項的上下文。

1. 重複項目的來源是 `FormArray.controls`，不是 `FormArray` 本身。
每個控制項都是一個 `address` `FormGroup`，正是先前（現在被重複的）範本 HTML 所預期的。

1. 每個重複的 `FormGroup` 都需要一個唯一的 `formGroupName`，它必須是該 `FormGroup` 在 `FormArray` 中的索引。
你會重複使用該索引，為每個地址組成一個唯一的標籤。

以下是 HTML 範本中秘密基地區段的骨架：

<code-example path="reactive-forms/src/app/hero-detail/hero-detail-8.component.html" region="form-array-skeleton" title="src/app/hero-detail/hero-detail.component.html (*ngFor)" linenums="false">

</code-example>

以下是秘密基地區段的完整範本。把它加入 `HeroDetailComponent` 範本，取代 `forGroupName=address` 的 `<div>`：

<code-example path="reactive-forms/src/app/hero-detail/hero-detail-8.component.html" region="form-array" title="src/app/hero-detail/hero-detail.component.html (excerpt)">

</code-example>



### 把新的基地加入 _FormArray_

加入一個 `addLair()` 方法，它取得 `secretLairs` `FormArray` 並把一個新的 `address` `FormGroup` 附加到它。

<code-example path="reactive-forms/src/app/hero-detail/hero-detail-8.component.ts" region="add-lair" title="src/app/hero-detail/hero-detail.component.ts (addLair method)" linenums="false">

</code-example>

在表單上放一個按鈕，讓使用者能加入新的 _秘密基地_，並把它連接到元件的 `addLair()` 方法。把它放在 `secretLairs` `FormArray` 閉合 `</div>` 的正前方。

<code-example path="reactive-forms/src/app/hero-detail/hero-detail-8.component.html" region="add-lair" title="src/app/hero-detail/hero-detail.component.html (addLair button)" linenums="false">

</code-example>

<div class="alert is-important">

務必加入 `type="button"` 屬性，
因為沒有明確的型別時，按鈕型別預設為「submit」。
當你稍後加入表單提交動作時，每個「submit」按鈕都會觸發提交動作，
該動作可能會做像是儲存目前變更之類的事情。
你不會希望在使用者按一下 _Add a Secret Lair_ 按鈕時儲存變更。

</div>

### 試試看！

回到瀏覽器，選取名為「Magneta」的英雄。
「Magneta」沒有地址，你可以在表單底部的診斷 JSON 中看到。

<figure>
  <img src="generated/images/guide/reactive-forms/addresses-array.png" alt="地址陣列的 JSON 輸出">
</figure>


按一下「_Add a Secret Lair_」按鈕。
一個新的地址區段出現了。做得好！

### 移除基地

這個範例可以 _加入_ 地址，但不能 _移除_ 它們。
作為額外練習，撰寫一個 `removeLair` 方法，並把它連接到重複地址 HTML 上的一個按鈕。

{@a observe-control}

## 觀察控制項變更

當使用者在父 `HeroListComponent` 中挑選英雄時，Angular 呼叫 `ngOnChanges()`。
挑選英雄會變更 `HeroDetailComponent.hero` `@Input()` 屬性。

當使用者修改英雄的 `name` 或 `secretLairs` 時，Angular _不會_ 呼叫 `ngOnChanges()`。
幸運的是，你可以透過訂閱其中一個會引發變更事件的 `FormControl` 屬性，來得知這類變更。

這些是像 `valueChanges` 這樣的屬性，它們傳回 RxJS `Observable`。
你不需要了解太多 RxJS `Observable`，就能監控表單控制項的值。

加入下列方法，記錄 `name` `FormControl` 值的變更。

<code-example path="reactive-forms/src/app/hero-detail/hero-detail.component.ts" region="log-name-change" title="src/app/hero-detail/hero-detail.component.ts (logNameChange)" linenums="false">

</code-example>

在建構子中，在 `createForm()` 之後呼叫它。

<code-example path="reactive-forms/src/app/hero-detail/hero-detail-8.component.ts" region="ctor" title="src/app/hero-detail/hero-detail.component.ts" linenums="false">

</code-example>

`logNameChange()` 方法把名稱變更值推入 `nameChangeLog` 陣列。
用這個 `*ngFor` 繫結，在元件範本底部顯示該陣列：

<code-example path="reactive-forms/src/app/hero-detail/hero-detail.component.html" region="name-change-log" title="src/app/hero-detail/hero-detail.component.html (Name change log)" linenums="false">

</code-example>



回到瀏覽器，選取一位英雄；例如 Magneta，並開始在 `name` `<input>` 中輸入。
你應該會在每次按鍵後，在記錄中看到一個新名稱。

### 何時使用它

插值繫結是顯示名稱變更的較簡單方式。
訂閱可觀察的 `FormControl` 屬性，則適合用來在元件類別中觸發應用程式邏輯。

{@a save}

## 儲存表單資料

`HeroDetailComponent` 擷取使用者輸入，但沒有對它做任何事。
在真實的應用程式中，你可能會儲存這些英雄變更、還原未儲存的變更，並繼續編輯。
在你實作本節的兩個功能後，表單將如下所示：


<figure>
  <img src="generated/images/guide/reactive-forms/save-revert-buttons.png" alt="帶有儲存與還原按鈕的表單">
</figure>



### 儲存
當使用者提交表單時，
`HeroDetailComponent` 會把英雄 _資料模型_ 的一個執行個體，
傳給注入的 `HeroService` 上的儲存方法。把下列內容加入 `HeroDetailComponent`。

<code-example path="reactive-forms/src/app/hero-detail/hero-detail.component.ts" region="on-submit" title="src/app/hero-detail/hero-detail.component.ts (onSubmit)" linenums="false">

</code-example>

<!-- TODO: Need to add `private heroService: HeroService` to constructor and import the HeroService. Remove novalidate-->

這個原始的 `hero` 擁有儲存前的值。使用者的變更仍然在 _表單模型_ 中。
因此，你使用 `prepareSaveHero()` 輔助函式，從原始英雄值（`hero.id`）
與變更後表單模型值的深層副本的組合，建立一個新的 `hero`。


<code-example path="reactive-forms/src/app/hero-detail/hero-detail.component.ts" region="prepare-save-hero" title="src/app/hero-detail/hero-detail.component.ts (prepareSaveHero)" linenums="false">

</code-example>

務必匯入 `HeroService` 並把它加入建構子：

<code-example path="reactive-forms/src/app/hero-detail/hero-detail.component.ts" region="import-service" title="src/app/hero-detail/hero-detail.component.ts (prepareSaveHero)" linenums="false">

</code-example>

<code-example path="reactive-forms/src/app/hero-detail/hero-detail.component.ts" region="ctor" title="src/app/hero-detail/hero-detail.component.ts (prepareSaveHero)" linenums="false">

</code-example>

<div class="l-sub-section">

**Address 深層副本**

如果你把 `formModel.secretLairs` 指派給 `saveHero.addresses`（見註解掉的那一行），
`saveHero.addresses` 陣列中的地址，會與 `formModel.secretLairs` 中的基地是相同物件。
使用者隨後對基地街道的變更，會改變 `saveHero` 中的地址街道。

`prepareSaveHero` 方法會複製表單模型的 `secretLairs` 物件，讓這種情況不會發生。


</div>



### 還原（取消變更）
使用者按下 Revert 按鈕，取消變更並把表單還原到原始狀態。

還原很容易。只要重新執行 `rebuildForm()` 方法，它會從原始、未變更的 `hero` 資料模型建置表單模型。

<code-example path="reactive-forms/src/app/hero-detail/hero-detail.component.ts" region="revert" title="src/app/hero-detail/hero-detail.component.ts (revert)" linenums="false">

</code-example>



### 按鈕
把「Save」與「Revert」按鈕加到元件範本的頂部附近：

<code-example path="reactive-forms/src/app/hero-detail/hero-detail.component.html" region="buttons" title="src/app/hero-detail/hero-detail.component.html (Save and Revert buttons)" linenums="false">

</code-example>



這些按鈕會保持停用，直到使用者變更其任何表單控制項中的值，讓表單變「髒」（`heroForm.dirty`）。

按一下型別為 `"submit"` 的按鈕會觸發 `ngSubmit` 事件，該事件呼叫元件的 `onSubmit` 方法。
按一下還原按鈕會觸發對元件 `revert` 方法的呼叫。
使用者現在可以儲存或還原變更。

試試這個 <live-example stackblitz="final" title="Reactive Forms (final) in Stackblitz"></live-example>。

{@a source-code}


最終版本的主要檔案如下：


<code-tabs>

  <code-pane title="src/app/app.component.html" path="reactive-forms/src/app/app.component.html">

  </code-pane>

  <code-pane title="src/app/app.component.ts" path="reactive-forms/src/app/app.component.ts">

  </code-pane>

  <code-pane title="src/app/app.module.ts" path="reactive-forms/src/app/app.module.ts">

  </code-pane>

  <code-pane title="src/app/hero-detail/hero-detail.component.ts" path="reactive-forms/src/app/hero-detail/hero-detail.component.ts">

  </code-pane>

  <code-pane title="src/app/hero-detail/hero-detail.component.html" path="reactive-forms/src/app/hero-detail/hero-detail.component.html">

  </code-pane>

  <code-pane title="src/app/hero-list/hero-list.component.html" path="reactive-forms/src/app/hero-list/hero-list.component.html">

  </code-pane>

  <code-pane title="src/app/hero-list/hero-list.component.ts" path="reactive-forms/src/app/hero-list/hero-list.component.ts">

  </code-pane>

  <code-pane title="src/app/data-model.ts" path="reactive-forms/src/app/data-model.ts">

  </code-pane>

  <code-pane title="src/app/hero.service.ts" path="reactive-forms/src/app/hero.service.ts">

  </code-pane>

</code-tabs>



你可以從 <live-example title="Reactive Forms Demo in Stackblitz">Reactive Forms Demo</live-example> 即時範例，下載本指南所有步驟的完整原始碼。
