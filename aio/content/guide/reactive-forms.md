# 反應式表單

_反應式表單_ 是一種以 _反應式_ 風格建立表單的 Angular 技術。
本指南將帶你逐步建置一個「Hero Detail Editor」表單，並在過程中說明反應式表單。


{@a toc}

試試這個 <live-example plnkr="final" title="Reactive Forms (final) in Plunker">Reactive Forms live-example</live-example>。

你也可以執行 <live-example title="Reactive Forms Demo in Plunker">Reactive Forms Demo</live-example> 版本，
並從頂部的「demo picker」中選擇中間步驟之一。


{@a intro}


## 反應式表單簡介

Angular 提供兩種表單建置技術：_反應式_ 表單與 _範本驅動_ 表單。
這兩種技術都屬於 `@angular/forms` 程式庫，
並共用一組通用的表單控制項類別。

但它們在理念、程式設計風格與技術上明顯不同。
它們甚至有各自的模組：`ReactiveFormsModule` 與 `FormsModule`。

### _反應式_ 表單
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

### _範本驅動_ 表單

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

反應式表單是同步的。範本驅動表單是非同步的。這個差異很重要。

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

### 哪一種比較好，反應式還是範本驅動？

沒有哪一種「比較好」。
它們是兩種不同的架構範式，
各有其優點與缺點。
選擇最適合你的做法。
你也可以決定在同一個應用程式中同時使用兩者。

本 _反應式表單_ 指南的其餘部分將探討 _反應式_ 範式，
並專注於反應式表單的技術。
如需 _範本驅動表單_ 的資訊，請參閱 [_Forms_](guide/forms) 指南。

在下一節中，你將為反應式表單範例設定專案。
接著你會了解 [Angular 表單類別](guide/reactive-forms#essentials)，以及如何在反應式表單中使用它們。



{@a setup}


## 設定

依照 [_Setup_ 指南](guide/setup "Setup guide") 中的步驟，
建立一個新的專案資料夾（或許名為 `reactive-forms`），
以 _QuickStart seed_ 為基礎。



{@a data-model}


## 建立資料模型
本指南的重點是一個用來編輯英雄的反應式表單元件。
你需要一個 `hero` 類別與一些英雄資料。
在 `app` 目錄中建立一個新的 `data-model.ts` 檔案，並把下面的內容複製進去。


<code-example path="reactive-forms/src/app/data-model.ts" title="src/app/data-model.ts" linenums="false">

</code-example>



這個檔案匯出兩個類別與兩個常數。`Address`
與 `Hero` 類別定義了應用程式的 _資料模型_。
`heroes` 與 `states` 常數提供測試資料。



{@a create-component}


## 建立 _反應式表單_ 元件
在 `app` 目錄中建立一個新檔案
`hero-detail.component.ts`，並匯入這些符號：


<code-example path="reactive-forms/src/app/hero-detail-1.component.ts" region="imports" title="src/app/hero-detail.component.ts" linenums="false">

</code-example>



現在輸入 `@Component` 裝飾器，來指定 `HeroDetailComponent` 的中繼資料：


<code-example path="reactive-forms/src/app/hero-detail.component.ts" region="metadata" title="src/app/hero-detail.component.ts (excerpt)" linenums="false">

</code-example>



接著，建立一個匯出的 `HeroDetailComponent` 類別，並加入一個 `FormControl`。
`FormControl` 是一個指令，讓你可以直接建立與管理
`FormControl` 執行個體。



<code-example path="reactive-forms/src/app/hero-detail-1.component.ts" region="v1" title="src/app/hero-detail.component.ts (excerpt)" linenums="false">

</code-example>



你在這裡建立一個名為 `name` 的 `FormControl`。
它將在範本中繫結到英雄名稱的 HTML `input` 輸入框。

一個 `FormControl` 建構子接受三個可選引數：
初始資料值、驗證器陣列，以及非同步驗證器陣列。

這個簡單的控制項沒有資料也沒有驗證器。
在真實的應用程式中，大多數表單控制項兩者都有。


<div class="l-sub-section">



本指南只簡要提及 `Validators`。如需深入了解它們，
請參閱[表單驗證](guide/form-validation)指南。


</div>




{@a create-template}


## 建立範本

現在建立元件的範本 `src/app/hero-detail.component.html`，其中包含下列標記。


<code-example path="reactive-forms/src/app/hero-detail-1.component.html" region="simple-control" title="src/app/hero-detail.component.html" linenums="false">

</code-example>



若要讓 Angular 知道這是你想要
與類別中的 `name` `FormControl` 關聯的輸入，
你需要在範本的 `<input>` 上加上 `[formControl]="name"`。



<div class="l-sub-section">



請忽略 `form-control` _CSS_ 類別。它屬於
<a href="http://getbootstrap.com/" title="Bootstrap CSS">Bootstrap CSS 程式庫</a>，
不是 Angular 的。
它為表單提供樣式，但完全不影響表單的邏輯。


</div>



{@a import}


## 匯入 _ReactiveFormsModule_

`HeroDetailComponent` 範本使用來自
`ReactiveFormsModule` 的 `formControlName` 指令。

在這個範例中，你在 `AppModule` 中宣告 `HeroDetailComponent`。
因此，在 `app.module.ts` 中做下列三件事：

1. 使用 JavaScript `import` 陳述式來存取
`ReactiveFormsModule` 與 `HeroDetailComponent`。
1. 把 `ReactiveFormsModule` 加入 `AppModule` 的 `imports` 清單。
1. 把 `HeroDetailComponent` 加入宣告陣列。


<code-example path="reactive-forms/src/app/app.module.ts" region="v1" title="src/app/app.module.ts (excerpt)" linenums="false">

</code-example>



{@a update}



## 顯示 _HeroDetailComponent_
修改 `AppComponent` 範本，讓它顯示 `HeroDetailComponent`。

<code-example path="reactive-forms/src/app/app.component.1.ts" title="src/app/app.component.ts" linenums="false">

</code-example>



{@a essentials}


### 基本表單類別
先讀一下核心表單類別的簡要說明，可能會有所幫助。

* [_AbstractControl_](api/forms/AbstractControl "API Reference: AbstractControl")
是三個具體表單控制項類別的抽象基底類別：
`FormControl`、`FormGroup` 與 `FormArray`。
它提供它們共用的行為與屬性，其中有些是 _可觀察的_。

* [_FormControl_](api/forms/FormControl "API Reference: FormControl")
追蹤 _單一_ 表單控制項的值與有效性狀態。
它對應到一個 HTML 表單控制項，例如輸入框或選擇器。

* [_FormGroup_](api/forms/FormGroup "API Reference: FormGroup")
追蹤一 _組_ `AbstractControl` 執行個體的值與有效性狀態。
群組的屬性包含它的子控制項。
元件中最上層的表單是一個 `FormGroup`。

* [_FormArray_](api/forms/FormArray "API Reference: FormArray")
追蹤一個以數字索引的 `AbstractControl` 執行個體 _陣列_ 的值與有效性狀態。

在逐步完成本指南的過程中，你會更了解這些類別。



### 為應用程式加上樣式
你在 `AppComponent` 與 `HeroDetailComponent` 兩者的範本 HTML 中使用了 bootstrap CSS 類別。
把 `bootstrap` _CSS 樣式表_ 加入 `index.html` 的 head 中：


<code-example path="reactive-forms/src/index.html" region="bootstrap" title="index.html" linenums="false">

</code-example>



現在一切都已接好，瀏覽器應該會顯示類似這樣的畫面：


<figure>
  <img src="generated/images/guide/reactive-forms/just-formcontrol.png" alt="單一 FormControl">
</figure>



{@a formgroup}


## 加入 FormGroup
通常，如果你有多個 *FormControls*，你會想把它們註冊在
一個父 `FormGroup` 之中。
這很簡單。若要加入 `FormGroup`，把它加到 `hero-detail.component.ts` 的 imports 區段：


<code-example path="reactive-forms/src/app/hero-detail-2.component.ts" region="imports" title="src/app/hero-detail.component.ts" linenums="false">

</code-example>



在類別中，把 `FormControl` 包進一個名為 `heroForm` 的 `FormGroup`，如下所示：


<code-example path="reactive-forms/src/app/hero-detail-2.component.ts" region="v2" title="src/app/hero-detail.component.ts" linenums="false">

</code-example>



現在你已在類別中做了變更，這些變更需要反映在
範本中。用下列內容取代 `hero-detail.component.html` 來更新它。


<code-example path="reactive-forms/src/app/hero-detail-2.component.html" region="basic-form" title="src/app/hero-detail.component.html" linenums="false">

</code-example>



請注意，現在單一的輸入框位於一個 `form` 元素中。`<form>` 元素中的 `novalidate`
屬性可以防止瀏覽器
嘗試進行原生的 HTML 驗證。

`formGroup` 是一個反應式表單指令，它接受一個既有的
`FormGroup` 執行個體，並把它與一個 HTML 元素關聯。
在這個例子中，它把你儲存為
`heroForm` 的 `FormGroup` 與表單元素關聯。

由於類別現在有了一個 `FormGroup`，你必須更新範本
語法，才能把輸入框與元件類別中對應的
`FormControl` 關聯。
沒有父 `FormGroup` 時，
`[formControl]="name"` 先前能運作，是因為該指令
可以獨立運作，也就是說，它不需要在 `FormGroup` 中也能運作。
有了父 `FormGroup`，`name` 輸入框需要
`formControlName=name` 語法，才能與類別中
正確的 `FormControl` 關聯。這個語法告訴 Angular 先尋找父
`FormGroup`（在這個例子中是 `heroForm`），然後在該群組 _內部_
尋找一個名為 `name` 的 `FormControl`。


<div class="l-sub-section">



請忽略 `form-group` _CSS_ 類別。它屬於
<a href="http://getbootstrap.com/" title="Bootstrap CSS">Bootstrap CSS 程式庫</a>，
不是 Angular 的。
像 `form-control` 類別一樣，它為表單提供樣式
但完全不影響它的邏輯。



</div>



表單看起來很棒。但它能運作嗎？
當使用者輸入名稱時，這個值會流向哪裡？


{@a json}


## 看看表單模型

這個值會進入支撐該群組 `FormControls` 的 **_表單模型_** 之中。
若要查看表單模型，在 `hero-detail.component.html` 中閉合的 `form` 標籤之後，
加入下列這一行：


<code-example path="reactive-forms/src/app/hero-detail-3.component.html" region="form-value-json" title="src/app/hero-detail.component.html" linenums="false">

</code-example>



`heroForm.value` 傳回 _表單模型_。
把它透過 `JsonPipe` 管道處理，會把模型以 JSON 形式呈現在瀏覽器中：


<figure>
  <img src="generated/images/guide/reactive-forms/json-output.png" alt="JSON 輸出">
</figure>



`name` 屬性的初始值是空字串。
在 _name_ 輸入框中輸入，並看著按鍵輸入出現在 JSON 中。




太好了！你已經掌握了表單的基礎。

在真實的應用程式中，表單很快就會變得龐大。
`FormBuilder` 讓表單的開發與維護更容易。




{@a formbuilder}


## _FormBuilder_ 簡介

`FormBuilder` 類別替你處理控制項建立的細節，
有助於減少重複與雜亂。

若要使用 `FormBuilder`，你需要把它匯入 `hero-detail.component.ts`：

<code-example path="reactive-forms/src/app/hero-detail-3a.component.ts" region="imports" title="src/app/hero-detail.component.ts (excerpt)" linenums="false">

</code-example>



現在就用它來把 `HeroDetailComponent` 重構成稍微更容易閱讀與撰寫的樣子，
遵循下列計畫：

* 明確宣告 `heroForm` 屬性的型別為 `FormGroup`；你稍後會初始化它。
* 把 `FormBuilder` 注入建構子。
* 加入一個新方法，使用 `FormBuilder` 來定義 `heroForm`；把它命名為 `createForm`。
* 在建構子中呼叫 `createForm`。

修改後的 `HeroDetailComponent` 如下所示：

<code-example path="reactive-forms/src/app/hero-detail-3a.component.ts" region="v3a" title="src/app/hero-detail.component.ts (excerpt)" linenums="false">

</code-example>



`FormBuilder.group` 是一個建立 `FormGroup` 的工廠方法。 &nbsp;
`FormBuilder.group` 接受一個物件，其鍵與值是 `FormControl` 名稱與它們的定義。
在這個範例中，`name` 控制項由其初始資料值（一個空字串）定義。

在單一物件中定義一組控制項，能形成精簡、易讀的風格。
它勝過撰寫一連串等價的 `new FormControl(...)` 陳述式。


{@a validators}


### Validators.required
雖然本指南不會深入探討驗證，這裡有一個範例，
示範在反應式表單中使用 `Validators.required` 的簡便性。

首先，匯入 `Validators` 符號。

<code-example path="reactive-forms/src/app/hero-detail-3.component.ts" region="imports" title="src/app/hero-detail.component.ts (excerpt)" linenums="false">

</code-example>



若要讓 `name` `FormControl` 變成必填，把 `FormGroup` 中的 `name`
屬性換成一個陣列。
第一個項目是 `name` 的初始值；
第二個是必填驗證器 `Validators.required`。


<code-example path="reactive-forms/src/app/hero-detail-3.component.ts" region="required" title="src/app/hero-detail.component.ts (excerpt)" linenums="false">

</code-example>



<div class="l-sub-section">



反應式驗證器是簡單、可組合的函式。
在範本驅動表單中，驗證的設定比較困難，因為你必須把驗證器包在指令中。

</div>



更新範本底部的診斷訊息，讓它顯示表單的有效性狀態。


<code-example path="reactive-forms/src/app/hero-detail-3.component.html" region="form-value-json" title="src/app/hero-detail.component.html (excerpt)" linenums="false">

</code-example>



瀏覽器顯示如下：


<figure>
  <img src="generated/images/guide/reactive-forms/validators-json-output.png" alt="單一 FormControl">
</figure>



`Validators.required` 正在運作。狀態是 `INVALID`，因為輸入框沒有值。
在輸入框中輸入，即可看到狀態從 `INVALID` 變成 `VALID`。

在真實的應用程式中，你會把診斷訊息換成對使用者友善的體驗。


在本指南的其餘部分，使用 `Validators.required` 是可選的。
它會以相同的設定保留在後續的每個範例中。

如需驗證 Angular 表單的更多資訊，請參閱
[表單驗證](guide/form-validation)指南。


### 更多 FormControls
英雄不只有名字。
英雄還有地址、超能力，有時還有跟班。

地址有一個 state 屬性。使用者會用 `<select>` 框選擇州別，你會把各州填入
`<option>` 元素。因此，從 `data-model.ts` 匯入 `states`。

<code-example path="reactive-forms/src/app/hero-detail-4.component.ts" region="imports" title="src/app/hero-detail.component.ts (excerpt)" linenums="false">

</code-example>



宣告 `states` 屬性，並把一些地址 `FormControls` 加入 `heroForm`，如下所示。


<code-example path="reactive-forms/src/app/hero-detail-4.component.ts" region="v4" title="src/app/hero-detail.component.ts (excerpt)" linenums="false">

</code-example>



接著在 `hero-detail.component.html` 的
`form` 元素內加入對應的標記。


<code-example path="reactive-forms/src/app/hero-detail-4.component.html" title="src/app/hero-detail.component.html" linenums="false">

</code-example>



<div class="alert is-helpful">



*提醒*：請忽略這個標記中多次提及的 `form-group`、
`form-control`、`center-block` 與 `checkbox`。
那些是 Angular 本身會忽略的 _bootstrap_ CSS 類別。
請注意 `formGroupName` 與 `formControlName` 屬性。
它們是把 HTML 控制項繫結到元件類別中 Angular `FormGroup` 與 `FormControl` 屬性的 Angular 指令。


</div>



修改後的範本包含更多文字輸入框、一個用於 `state` 的選取框、用於 `power` 的單選按鈕，
以及一個用於 `sidekick` 的核取方塊。

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

這個表單變得又大又笨重。你可以把一些相關的 `FormControls`
分組到一個巢狀的 `FormGroup` 中。`street`、`city`、`state` 與 `zip` 這些屬性
會構成一個很好的 _address_ `FormGroup`。
以這種方式巢狀化群組與控制項，能讓你
對應資料模型的階層結構，
並有助於追蹤相關控制項集合的驗證與狀態。

你使用 `FormBuilder` 在這個元件中建立了一個名為 `heroForm` 的 `FormGroup`。
讓它作為父 `FormGroup`。
再次使用 `FormBuilder` 建立一個封裝地址控制項的子 `FormGroup`；
把結果指派給父 `FormGroup` 的新 `address` 屬性。

<code-example path="reactive-forms/src/app/hero-detail-5.component.ts" region="v5" title="src/app/hero-detail.component.ts (excerpt)" linenums="false">

</code-example>



你已經變更了元件類別中表單控制項的結構；
你必須對元件範本做對應的調整。

在 `hero-detail.component.html` 中，把與地址相關的 `FormControls` 包在一個 `div` 中。
把 `formGroupName` 指令加到該 `div` 上，並把它繫結到 `"address"`。
那是父 `FormGroup`（名為 `heroForm`）中 _address_ 子 `FormGroup` 的屬性。

為了讓這個變更在視覺上更明顯，在接近頂部的地方插入一個 `<h4>` 標題，文字為 _Secret Lair_。
新的 _address_ HTML 如下所示：


<code-example path="reactive-forms/src/app/hero-detail-5.component.html" region="add-group" title="src/app/hero-detail.component.html (excerpt)" linenums="false">

</code-example>



這些變更之後，瀏覽器中的 JSON 輸出顯示修改後的 _表單模型_，
其中包含巢狀的地址 `FormGroup`：


<figure>
  <img src="generated/images/guide/reactive-forms/address-group.png" alt="JSON 輸出">
</figure>



太好了！你已經建立了一個群組，而且可以看到範本
與表單模型正在彼此溝通。



{@a properties}


## 檢視 _FormControl_ 屬性
目前，你把整個表單模型傾印到頁面上。
有時你只對某一個特定 `FormControl` 的狀態有興趣。

你可以用 `.get()` 方法萃取表單中的單一 `FormControl`，來檢視它。
你可以在元件類別 _內部_ 這樣做，或是把下列內容加入範本中來在
頁面上顯示它，
緊接在 `{{form.value | json}}` 插值之後，如下所示：


<code-example path="reactive-forms/src/app/hero-detail-5.component.html" region="inspect-value" title="src/app/hero-detail.component.html" linenums="false">

</code-example>



若要取得位於 `FormGroup` 內部的 `FormControl` 的狀態，使用點記法沿著路徑定位到該控制項。


<code-example path="reactive-forms/src/app/hero-detail-5.component.html" region="inspect-child-control" title="src/app/hero-detail.component.html" linenums="false">

</code-example>



你可以使用這個技巧來顯示 `FormControl` 的 _任何_ 屬性，
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



其他 `FormControl` 屬性的說明，見
[_AbstractControl_](api/forms/AbstractControl) API 參考。

檢視 `FormControl` 屬性的一個常見原因是
確保使用者輸入了有效的值。
如需驗證 Angular 表單的更多資訊，請參閱
[表單驗證](guide/form-validation)指南。



{@a data-model-form-model}


## _資料模型_ 與 _表單模型_

目前，表單顯示的是空值。
`HeroDetailComponent` 應該顯示一位英雄的值，
可能是一位從遠端伺服器擷取的英雄。

在這個應用程式中，`HeroDetailComponent` 從父 `HeroListComponent` 取得它的英雄。

來自伺服器的 `hero` 是 **_資料模型_**。
`FormControl` 結構是 **_表單模型_**。

元件必須把 _資料模型_ 中的英雄值複製到 _表單模型_ 中。
這有兩個重要的含義：

1. 開發人員必須了解 _資料模型_ 的屬性如何
對應到 _表單模型_ 的屬性。

2. 使用者的變更從 DOM 元素流向 _表單模型_，而不是流向 _資料模型_。
表單控制項永遠不會更新 _資料模型_。

_表單_ 與 _資料_ 模型的結構不需要完全一致。
你經常在特定畫面上只呈現 _資料模型_ 的一個子集。
但如果 _表單模型_ 的形狀接近 _資料模型_ 的形狀，事情會更容易。

在這個 `HeroDetailComponent` 中，這兩個模型非常接近。

回想一下 `data-model.ts` 中 `Hero` 的定義：

<code-example path="reactive-forms/src/app/data-model.ts" region="model-classes" title="src/app/data-model.ts (classes)" linenums="false">

</code-example>



這裡再次列出元件的 `FormGroup` 定義。


<code-example path="reactive-forms/src/app/hero-detail-6.component.ts" region="hero-form-model" title="src/app/hero-detail.component.ts (excerpt)" linenums="false">

</code-example>



這兩個模型之間有兩個顯著的差異：

1. `Hero` 有一個 `id`。表單模型沒有，因為你通常不會把主鍵顯示給使用者。

1. `Hero` 有一個地址陣列。這個表單模型只呈現一個地址，
這個選擇會在[下方再次討論](guide/reactive-forms#form-array "Form arrays")。

儘管如此，兩個模型的形狀還是相當接近，你馬上就會看到，
這種對齊如何有助於用 `patchValue` 與 `setValue` 方法，把 _資料模型_ 屬性複製到 _表單模型_。


花點時間如下重構 _address_ `FormGroup` 定義，使其更簡潔、更清楚：

<code-example path="reactive-forms/src/app/hero-detail-7.component.ts" region="address-form-group" title="src/app/hero-detail-7.component.ts" linenums="false">

</code-example>



也要記得更新從 `data-model` 的匯入，這樣你才能參照 `Hero` 與 `Address` 類別：

<code-example path="reactive-forms/src/app/hero-detail-7.component.ts" region="import-address" title="src/app/hero-detail-7.component.ts" linenums="false">

</code-example>




{@a set-data}


## 用 _setValue_ 與 _patchValue_ 填入表單模型
先前，你建立了控制項並同時初始化它的值。
你也可以稍後用
`setValue` 與 `patchValue` 方法初始化或重設這些值。

### _setValue_
使用 **`setValue`** 時，你透過傳入一個資料物件，一次指派 _每個_ 表單控制項的值，該物件的屬性與 `FormGroup` 背後的 _表單模型_ 完全吻合。


<code-example path="reactive-forms/src/app/hero-detail-7.component.ts" region="set-value" title="src/app/hero-detail.component.ts (excerpt)" linenums="false">

</code-example>



`setValue` 方法會在指派任何表單控制項值之前，徹底檢查資料物件。

它不會接受與 FormGroup 結構不符的資料物件，或
缺少群組中任何控制項值的資料物件。如此一來，如果你有錯字，或你錯誤地巢狀化了控制項，它能傳回有幫助的
錯誤訊息。`patchValue` 會無聲地失敗。

另一方面，`setValue` 會捕捉
錯誤，並清楚地報告它。

請注意，你幾乎可以把整個 `hero` 用作 `setValue` 的引數，
因為它的形狀與元件的 `FormGroup` 結構相似。

你只能顯示英雄的第一個地址，而且你必須考慮到 `hero` 可能完全沒有地址的可能性。
這說明了資料物件引數中 `address` 屬性的條件式設定：

<code-example path="reactive-forms/src/app/hero-detail-7.component.ts" region="set-value-address" title="src/app/hero-detail-7.component.ts" linenums="false">

</code-example>



### _patchValue_
使用 **`patchValue`** 時，你可以透過提供一個鍵／值對物件，只為有興趣的控制項，把值指派給 `FormGroup` 中的特定控制項。

這個範例只設定表單的 `name` 控制項。

<code-example path="reactive-forms/src/app/hero-detail-6.component.ts" region="patch-value" title="src/app/hero-detail.component.ts (excerpt)" linenums="false">

</code-example>



使用 **`patchValue`** 時，你在處理差異極大的資料與表單模型時有更大的彈性。
但與 `setValue` 不同，`patchValue` 無法檢查缺失的控制項
值，也不會擲出有幫助的錯誤。

### 何時設定表單模型值（_ngOnChanges_）

現在你知道 _如何_ 設定 _表單模型_ 值了。但你應該 _何時_ 設定它們？
答案取決於元件取得 _資料模型_ 值的時機。

本反應式表單範例中的 `HeroDetailComponent`，巢狀在一個 _master/detail_ `HeroListComponent` 之內（[下方有討論](guide/reactive-forms#hero-list)）。
`HeroListComponent` 會向使用者顯示英雄名稱。
當使用者點選一位英雄時，清單元件會把所選英雄傳入 `HeroDetailComponent`，
方法是繫結到它的 `hero` 輸入屬性。


<code-example path="reactive-forms/src/app/hero-list.component.1.html" title="hero-list.component.html (simplified)" linenums="false">

</code-example>



在這種做法中，`HeroDetailComponent` 中 `hero` 的值，
會在使用者每次選取新英雄時變更。
你應該在 [ngOnChanges](guide/lifecycle-hooks#onchanges)
鉤子中呼叫 _setValue_，每當輸入的 `hero` 屬性變更時，Angular 就會呼叫它，
如下列步驟所示。

首先，在 `hero-detail.component.ts` 中匯入 `OnChanges` 與 `Input` 符號。


<code-example path="reactive-forms/src/app/hero-detail-6.component.ts" region="import-input" title="src/app/hero-detail.component.ts (core imports)" linenums="false">

</code-example>



加入 `hero` 輸入屬性。

<code-example path="reactive-forms/src/app/hero-detail-6.component.ts" region="hero" title="src/app/hero-detail-6.component.ts" linenums="false">

</code-example>



如下把 `ngOnChanges` 方法加入類別：


<code-example path="reactive-forms/src/app/hero-detail-7.component.ts" region="ngOnChanges-1" title="src/app/hero-detail.component.ts (ngOnchanges)" linenums="false">

</code-example>



### _重設_ 表單旗標

當英雄變更時，你應該重設表單，讓
前一位英雄的控制項值被清除，
且狀態旗標還原到 _pristine_ 狀態。
你可以在 `ngOnChanges` 的開頭像這樣呼叫 `reset`。

<code-example path="reactive-forms/src/app/hero-detail-7.component.ts" region="reset" title="src/app/hero-detail-7.component.ts" linenums="false">

</code-example>



`reset` 方法有一個可選的 `state` 值，所以你可以同時重設旗標 _與_ 控制項值。
在內部，`reset` 會把引數傳給 `setValue`。
稍微重構一下，`ngOnChanges` 就變成這樣：

<code-example path="reactive-forms/src/app/hero-detail-7.component.ts" region="ngOnChanges" title="src/app/hero-detail.component.ts (ngOnchanges - revised)" linenums="false">

</code-example>



{@a hero-list}


### 建立 _HeroListComponent_ 與 _HeroService_

`HeroDetailComponent` 是 _主／從_ 檢視中 `HeroListComponent` 的巢狀子元件。
它們合起來大致像這樣：


<figure>
  <img src="generated/images/guide/reactive-forms/hero-list.png" alt="HeroListComponent">
</figure>



`HeroListComponent` 使用注入的 `HeroService` 從伺服器擷取英雄，
然後把這些英雄以一系列按鈕呈現給使用者。
`HeroService` 模擬一個 HTTP 服務。
它傳回一個英雄的 `Observable`，在短暫延遲後解析，
既是為了模擬網路延遲，也是為了在視覺上
指出應用程式必然的非同步本質。

當使用者按一下某位英雄時，
元件設定它的 `selectedHero` 屬性，該屬性
繫結到 `HeroDetailComponent` 的 `hero` 輸入屬性。
`HeroDetailComponent` 偵測到英雄變更，並用該英雄的資料值重新設定它的表單。

「Refresh」按鈕會在重新擷取英雄之前，清除英雄清單與目前選取的英雄。

其餘的 `HeroListComponent` 與 `HeroService` 實作細節，與了解反應式表單無關。
相關技術在文件的其他地方有介紹，包括 _英雄之旅_
[這裡](tutorial/toh-pt3 "ToH: Multiple Components")與[這裡](tutorial/toh-pt4 "ToH: Services")。

如果你跟著這個反應式表單教學的步驟一起撰寫程式碼，
請根據[下方顯示的原始碼](guide/reactive-forms#source-code "Reactive Forms source code")建立相關檔案。
請注意，`hero-list.component.ts` 匯入 `Observable` 與 `finally`，而 `hero.service.ts` 從 `rxjs` 匯入 `Observable`、`of`，
與 `delay`。
然後回到這裡，學習 _form array_ 屬性。



{@a form-array}


## 使用 _FormArray_ 呈現一組 _FormGroups_
到目前為止，你已經看過 `FormControls` 與 `FormGroups`。
`FormGroup` 是一個具名物件，其屬性值是 `FormControls` 與其他 `FormGroups`。

有時你需要呈現任意數量的控制項或群組。
例如，一位英雄可能有零個、一個或任意多個地址。

`Hero.addresses` 屬性是一個 `Address` 執行個體陣列。
一個 _address_ `FormGroup` 可以顯示一個 `Address`。
一個 Angular `FormArray` 可以顯示一組 _address_ `FormGroups`。

若要存取 `FormArray` 類別，把它匯入 `hero-detail.component.ts`：

<code-example path="reactive-forms/src/app/hero-detail-8.component.ts" region="imports" title="src/app/hero-detail.component.ts (excerpt)" linenums="false">

</code-example>



若要使用 `FormArray`，請做下列事項：

1. 定義陣列中的項目（`FormControls` 或 `FormGroups`）。

1. 用 _資料模型_ 中的資料建立的項目來初始化陣列。

1. 依使用者的需要加入與移除項目。

在本指南中，你為 `Hero.addresses` 定義一個 `FormArray`，並
讓使用者加入或修改地址（移除地址是你的回家作業）。

你需要在 `HeroDetailComponent` 建構子中重新定義表單模型，
它目前只在一個 _address_ `FormGroup` 中顯示第一個英雄地址。

<code-example path="reactive-forms/src/app/hero-detail-7.component.ts" region="address-form-group" title="src/app/hero-detail-7.component.ts" linenums="false">

</code-example>



### 從 _address_ 到 _秘密基地_

從使用者的觀點來看，英雄沒有 _地址_。
_地址_ 是給凡人的。英雄有 _秘密基地_！
把 _address_ `FormGroup` 定義換成 _secretLairs_ `FormArray` 定義：

<code-example path="reactive-forms/src/app/hero-detail-8.component.ts" region="secretLairs-form-array" title="src/app/hero-detail-8.component.ts" linenums="false">

</code-example>



<div class="alert is-helpful">



把表單控制項名稱從 `address` 改成 `secretLairs`，凸顯了一個重要的觀點：
_表單模型_ 不必與 _資料模型_ 一致。

顯然，兩者之間必須存在某種關係。
但它可以是應用程式領域中有意義的任何關係。

_呈現_ 需求經常與 _資料_ 需求不同。
反應式表單做法既強調也促進了這個區別。


</div>



### 初始化「secretLairs」_FormArray_

預設表單顯示一位沒有名稱、沒有地址的英雄。

你需要一個方法，每當
父 `HeroListComponent` 把 `HeroDetailComponent.hero` 輸入屬性設為新的 `Hero` 時，就用實際的英雄地址填入（或重新填入）_secretLairs_。

下列 `setAddresses` 方法把 _secretLairs_ `FormArray` 換成新的 `FormArray`，
並以一組英雄地址 `FormGroups` 陣列初始化。

<code-example path="reactive-forms/src/app/hero-detail-8.component.ts" region="set-addresses" title="src/app/hero-detail-8.component.ts" linenums="false">

</code-example>



請注意，你是用 **`FormGroup.setControl` 方法**取代先前的 `FormArray`，而不是用 `setValue`。
你取代的是一個 _控制項_，而不是控制項的 _值_。

也請注意，_secretLairs_ `FormArray` 裡裝的是 **`FormGroups`** 而不是 `Addresses`。

### 取得 _FormArray_
`HeroDetailComponent` 應該能從 _secretLairs_ `FormArray` 中顯示、加入與移除項目。

使用 `FormGroup.get` 方法取得該 `FormArray` 的參照。
為了清楚與重複使用，把運算式包在一個 `secretLairs` 便利屬性中。

<code-example path="reactive-forms/src/app/hero-detail-8.component.ts" region="get-secret-lairs" title="src/app/hero-detail.component.ts (secretLayers property)" linenums="false">

</code-example>



### 顯示 _FormArray_

目前的 HTML 範本顯示單一的 _address_ `FormGroup`。
修改它，讓它顯示零個、一個或多個英雄的 _address_ `FormGroups`。

這主要是把先前地址的範本 HTML 包在一個 `<div>` 中，
並用 `*ngFor` 重複該 `<div>`。

訣竅在於知道如何撰寫 `*ngFor`。有三個要點：

1. 在帶有 `*ngFor` 的 `<div>` 外面再包一個 `<div>`，並
把它的 `formArrayName` 指令設為 `"secretLairs"`。
這個步驟把 _secretLairs_ `FormArray` 建立為內部重複 HTML 範本中表單控制項的上下文。

1. 重複項目的來源是 `FormArray.controls`，不是 `FormArray` 本身。
每個控制項都是一個 _address_ `FormGroup`，正是先前（現在被重複的）範本 HTML 所預期的。

1. 每個重複的 `FormGroup` 都需要一個唯一的 `formGroupName`，它必須是該 `FormGroup` 在 `FormArray` 中的索引。
你會重複使用該索引，為每個地址組成一個唯一的標籤。

以下是 HTML 範本中 _秘密基地_ 區段的骨架：

<code-example path="reactive-forms/src/app/hero-detail-8.component.html" region="form-array-skeleton" title="src/app/hero-detail.component.html (*ngFor)" linenums="false">

</code-example>



以下是 _秘密基地_ 區段的完整範本：

<code-example path="reactive-forms/src/app/hero-detail-8.component.html" region="form-array" title="src/app/hero-detail.component.html (excerpt)">

</code-example>



### 把新的基地加入 _FormArray_

加入一個 `addLair` 方法，它取得 _secretLairs_ `FormArray` 並把一個新的 _address_ `FormGroup` 附加到它。

<code-example path="reactive-forms/src/app/hero-detail-8.component.ts" region="add-lair" title="src/app/hero-detail.component.ts (addLair method)" linenums="false">

</code-example>



在表單上放一個按鈕，讓使用者能加入新的 _秘密基地_，並把它連接到元件的 `addLair` 方法。


<code-example path="reactive-forms/src/app/hero-detail-8.component.html" region="add-lair" title="src/app/hero-detail.component.html (addLair button)" linenums="false">

</code-example>



<div class="alert is-important">



務必**加入 `type="button"` 屬性。**
事實上，你應該永遠指定按鈕的 `type`。
沒有明確的型別時，按鈕型別預設為「submit」。
當你稍後加入 _表單提交_ 動作時，每個「submit」按鈕都會觸發提交動作，
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

當使用者在父 `HeroListComponent` 中挑選英雄時，Angular 呼叫 `ngOnChanges`。
挑選英雄會變更 `HeroDetailComponent.hero` 輸入屬性。

當使用者修改英雄的 _name_ 或 _秘密基地_ 時，Angular _不會_ 呼叫 `ngOnChanges`。
幸運的是，你可以透過訂閱其中一個會引發變更事件的表單控制項屬性，來得知這類變更。

這些是像 `valueChanges` 這樣的屬性，它們傳回 RxJS `Observable`。
你不需要了解太多 RxJS `Observable`，就能監控表單控制項的值。

加入下列方法，記錄 _name_ `FormControl` 值的變更。

<code-example path="reactive-forms/src/app/hero-detail.component.ts" region="log-name-change" title="src/app/hero-detail.component.ts (logNameChange)" linenums="false">

</code-example>



在建構子中，在建立表單之後呼叫它。

<code-example path="reactive-forms/src/app/hero-detail-8.component.ts" region="ctor" title="src/app/hero-detail-8.component.ts" linenums="false">

</code-example>



`logNameChange` 方法把名稱變更值推入 `nameChangeLog` 陣列。
用這個 `*ngFor` 繫結，在元件範本底部顯示該陣列：

<code-example path="reactive-forms/src/app/hero-detail.component.html" region="name-change-log" title="src/app/hero-detail.component.html (Name change log)" linenums="false">

</code-example>



回到瀏覽器，選取一位英雄（例如「Magneta」），並開始在 _name_ 輸入框中輸入。
你應該會在每次按鍵後，在記錄中看到一個新名稱。

### 何時使用它

插值繫結是 _顯示_ 名稱變更的較簡單方式。
訂閱可觀察的表單控制項屬性，則適合用來在元件類別 _內部_ 觸發應用程式邏輯。



{@a save}


## 儲存表單資料

`HeroDetailComponent` 擷取使用者輸入，但沒有對它做任何事。
在真實的應用程式中，你可能會儲存這些英雄變更。
在真實的應用程式中，你也能還原未儲存的變更，並繼續編輯。
在你實作本節的兩個功能後，表單將如下所示：


<figure>
  <img src="generated/images/guide/reactive-forms/save-revert-buttons.png" alt="帶有儲存與還原按鈕的表單">
</figure>



### 儲存
在這個範例應用程式中，當使用者提交表單時，
`HeroDetailComponent` 會把英雄 _資料模型_ 的一個執行個體，傳給注入的 `HeroService` 上的儲存方法。

<code-example path="reactive-forms/src/app/hero-detail.component.ts" region="on-submit" title="src/app/hero-detail.component.ts (onSubmit)" linenums="false">

</code-example>



這個原始的 `hero` 擁有儲存前的值。使用者的變更仍然在 _表單模型_ 中。
因此，你使用 `prepareSaveHero` 輔助函式，從原始英雄值（`hero.id`）
與變更後表單模型值的深層副本的組合，建立一個新的 `hero`。


<code-example path="reactive-forms/src/app/hero-detail.component.ts" region="prepare-save-hero" title="src/app/hero-detail.component.ts (prepareSaveHero)" linenums="false">

</code-example>



<div class="l-sub-section">



**Address 深層副本**

如果你把 `formModel.secretLairs` 指派給 `saveHero.addresses`（見註解掉的那一行），
`saveHero.addresses` 陣列中的地址，會與 `formModel.secretLairs` 中的基地是相同物件。
使用者隨後對基地街道的變更，會改變 `saveHero` 中的地址街道。

`prepareSaveHero` 方法會複製表單模型的 `secretLairs` 物件，讓這種情況不會發生。


</div>



### 還原（取消變更）
使用者按下 _Revert_ 按鈕，取消變更並把表單還原到原始狀態。

還原很容易。只要重新執行 `ngOnChanges` 方法，它會從原始、未變更的 `hero` _資料模型_ 建置 _表單模型_。

<code-example path="reactive-forms/src/app/hero-detail.component.ts" region="revert" title="src/app/hero-detail.component.ts (revert)" linenums="false">

</code-example>



### 按鈕
把「Save」與「Revert」按鈕加到元件範本的頂部附近：

<code-example path="reactive-forms/src/app/hero-detail.component.html" region="buttons" title="src/app/hero-detail.component.html (Save and Revert buttons)" linenums="false">

</code-example>



這些按鈕會保持停用，直到使用者變更其任何表單控制項中的值，讓表單變「髒」（`heroForm.dirty`）。

按一下型別為 `"submit"` 的按鈕會觸發 `ngSubmit` 事件，該事件呼叫元件的 `onSubmit` 方法。
按一下還原按鈕會觸發對元件 `revert` 方法的呼叫。
使用者現在可以儲存或還原變更。

這是示範的最後一步。
試試這個 <live-example plnkr="final" title="Reactive Forms (final) in Plunker"></live-example>。




## 結論

本頁涵蓋了：

* 如何建立反應式表單元件及其對應的範本。
* 如何使用 `FormBuilder` 簡化反應式表單的撰寫。
* 將 `FormControls` 分組。
* 檢視 `FormControl` 屬性。
* 用 `patchValue` 與 `setValue` 設定資料。
* 用 `FormArray` 動態加入群組。
* 觀察 `FormControl` 值的變更。
* 儲存表單變更。


{@a source-code}


最終版本的主要檔案如下：


<code-tabs>

  <code-pane title="src/app/app.component.ts" path="reactive-forms/src/app/app.component.ts">

  </code-pane>

  <code-pane title="src/app/app.module.ts" path="reactive-forms/src/app/app.module.ts">

  </code-pane>

  <code-pane title="src/app/hero-detail.component.ts" path="reactive-forms/src/app/hero-detail.component.ts">

  </code-pane>

  <code-pane title="src/app/hero-detail.component.html" path="reactive-forms/src/app/hero-detail.component.html">

  </code-pane>

  <code-pane title="src/app/hero-list.component.html" path="reactive-forms/src/app/hero-list.component.html">

  </code-pane>

  <code-pane title="src/app/hero-list.component.ts" path="reactive-forms/src/app/hero-list.component.ts">

  </code-pane>

  <code-pane title="src/app/data-model.ts" path="reactive-forms/src/app/data-model.ts">

  </code-pane>

  <code-pane title="src/app/hero.service.ts" path="reactive-forms/src/app/hero.service.ts">

  </code-pane>

</code-tabs>



你可以從 <live-example title="Reactive Forms Demo in Plunker">Reactive Forms Demo</live-example> 即時範例，下載本指南所有步驟的完整原始碼。
