# 動態表單

{@a top}

手工打造表單可能成本高昂且耗時，
尤其是當你需要大量表單、它們彼此相似，而且為了因應快速變化的業務與法規要求而頻繁改變時。

依描述業務物件模型的中繼資料來動態建立表單，可能更經濟。

這本食譜展示如何使用 `formGroup` 動態
算繪一個具有不同控制項類型與驗證的簡單表單。
這只是一個初步的開始。
它可能演進為支援更豐富多樣的問題、更優雅的算繪，以及更好的使用者體驗。
一切偉大的事物，都有卑微的開始。

本食譜中的範例是一個動態表單，為求職的英雄
建立線上應徵體驗。
該仲介機構不斷調整應徵流程。
你可以即時建立表單，*無需更改應用程式程式碼*。
{@a toc}

請參閱 <live-example name="dynamic-form"></live-example>。

{@a bootstrap}

## 啟動

先建立一個名為 `AppModule` 的 `NgModule`。

本食譜使用[反應式表單](guide/reactive-forms)。

反應式表單屬於另一個名為 `ReactiveFormsModule` 的 `NgModule`，
因此若要存取任何反應式表單指令，你必須從 `@angular/forms` 程式庫匯入
`ReactiveFormsModule`。

在 `main.ts` 中啟動 `AppModule`。

<code-tabs>

  <code-pane header="app.module.ts" path="dynamic-form/src/app/app.module.ts">

  </code-pane>

  <code-pane header="main.ts" path="dynamic-form/src/main.ts">

  </code-pane>

</code-tabs>

{@a object-model}

## 問題模型

下一步是定義一個物件模型，能描述表單功能所需的所有情境。
英雄應徵流程涉及一個有許多問題的表單。
_問題_ 是模型中最基本的物件。

下列 `QuestionBase` 是一個基本的問題類別。

<code-example path="dynamic-form/src/app/question-base.ts" header="src/app/question-base.ts">

</code-example>

你可以從這個基底衍生出兩個新類別 `TextboxQuestion` 與 `DropdownQuestion`，
分別代表文字方塊問題與下拉式問題。
其想法是：表單將繫結到特定的問題類型，並動態算繪適當的控制項。

`TextboxQuestion` 透過 `type` 屬性支援多種 HTML5 類型，例如 text、email 與 url。

<code-example path="dynamic-form/src/app/question-textbox.ts" header="src/app/question-textbox.ts" linenums="false">

</code-example>

`DropdownQuestion` 在選取方塊中呈現一組選項。

<code-example path="dynamic-form/src/app/question-dropdown.ts" header="src/app/question-dropdown.ts" linenums="false">

</code-example>

接下來是 `QuestionControlService`，一個把問題轉換成 `FormGroup` 的簡單服務。
簡單來說，表單群組會取用問題模型中的中繼資料，
讓你能指定預設值與驗證規則。

<code-example path="dynamic-form/src/app/question-control.service.ts" header="src/app/question-control.service.ts" linenums="false">

</code-example>

{@a form-component}

## 問題表單元件
現在你已定義完整的模型，可以開始
建立代表動態表單的元件了。

`DynamicFormComponent` 是表單的進入點與主要容器。

<code-tabs>

  <code-pane header="dynamic-form.component.html" path="dynamic-form/src/app/dynamic-form.component.html">

  </code-pane>

  <code-pane header="dynamic-form.component.ts" path="dynamic-form/src/app/dynamic-form.component.ts">

  </code-pane>

</code-tabs>

它呈現一份問題清單，每個問題都繫結到一個 `<app-question>` 元件元素。
`<app-question>` 標籤對應到 `DynamicFormQuestionComponent`，
該元件負責依資料繫結的問題物件中的值，算繪每個_個別_問題的詳細內容。

<code-tabs>

  <code-pane header="dynamic-form-question.component.html" path="dynamic-form/src/app/dynamic-form-question.component.html">

  </code-pane>

  <code-pane header="dynamic-form-question.component.ts" path="dynamic-form/src/app/dynamic-form-question.component.ts">

  </code-pane>

</code-tabs>

注意，這個元件可以呈現你模型中的任何問題類型。
目前你只有兩種問題類型，但你可以想像還能有更多。
`ngSwitch` 決定要顯示哪一種問題類型。

在這兩個元件中，你都仰賴 Angular 的 **formGroup** 把範本 HTML 連接到
底層的控制項物件，這些物件是從問題模型填入的，並帶有顯示與驗證規則。

`formControlName` 與 `formGroup` 是定義在
`ReactiveFormsModule` 中的指令。由於你已從 `AppModule` 匯入 `ReactiveFormsModule`，範本可以直接存取這些指令。
{@a questionnaire-data}

## 問卷資料

`DynamicFormComponent` 期望問題清單以繫結到 `@Input() questions` 的陣列形式提供。

 你為求職應徵定義的那組問題，是從 `QuestionService` 傳回的。
 在真正的應用程式中，你會從儲存空間擷取這些問題。

 關鍵在於：你完全可以透過 `QuestionService` 傳回的物件，來控制英雄求職應徵的問題。
 維護問卷很簡單，只需要在 `questions` 陣列中新增、更新與移除物件即可。

<code-example path="dynamic-form/src/app/question.service.ts" header="src/app/question.service.ts">

</code-example>

最後，在 `AppComponent` 殼層中顯示表單的一個執行個體。

<code-example path="dynamic-form/src/app/app.component.ts" header="app.component.ts">

</code-example>

{@a dynamic-template}

## 動態範本
雖然在本範例中，你建立的是英雄求職應徵的模型，
但除了 `QuestionService` 傳回的物件之外，並未參照任何特定的英雄問題。

這一點非常重要，因為它讓你能把這些元件挪用於任何類型的問卷，
只要它與 *question* 物件模型相容。
關鍵在於用來算繪表單的中繼資料之動態資料繫結，
不對特定問題做任何寫死的假設。
除了控制項中繼資料之外，你也會動態加入驗證。

在表單處於有效狀態之前，*Save* 按鈕會保持停用。
當表單有效時，你可以點選 *Save*，應用程式就會把目前的表單值以 JSON 形式算繪出來。
這證明了任何使用者輸入都會繫結回資料模型。
儲存與擷取資料，留待另一回再練習。

最終的表單如下所示：

<figure>
  <img src="generated/images/guide/dynamic-form/dynamic-form.png" alt="動態表單">
</figure>

[回到頂部](guide/dynamic-form#top)
