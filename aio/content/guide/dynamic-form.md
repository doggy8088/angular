# 建立動態表單

許多表單，例如問卷，在格式與意圖上可能彼此非常相似。
為了更快、更容易地產生這類表單的不同版本，你可以依描述業務物件模型的中繼資料，建立一個_動態表單範本_。
然後，依資料模型的變化，使用該範本自動產生新表單。

當你有一種表單，其內容必須頻繁改變以因應快速變化的業務與法規要求時，這種技巧特別有用。
典型的使用案例就是問卷。
你可能需要在不同情境下取得使用者的輸入。
使用者看到的表單格式與樣式應保持一致，而實際需要詢問的問題則依情境而有所不同。

在本教學中，你將建立一個呈現基本問卷的動態表單。
你將建立一個供英雄求職的線上應用程式。
該仲介機構不斷調整應徵流程，但使用動態表單，
你就能即時建立新表單，無需修改應用程式程式碼。

本教學將帶你完成下列步驟。

1. 為專案啟用反應式表單。
1. 建立用來表示表單控制項的資料模型。
1. 把範例資料填入模型。
1. 開發一個動態建立表單控制項的元件。

你建立的表單使用輸入驗證與樣式來改善使用者體驗。
它有一個 Submit 按鈕，只有在所有使用者輸入都有效時才會啟用，並以顏色標示與錯誤訊息標記無效的輸入。

這個基本版本可以逐步演進，支援更豐富多樣的問題、更優雅的算繪，以及更好的使用者體驗。

<div class="alert is-helpful">

請參閱 <live-example name="dynamic-form"></live-example>。

</div>

## 必要條件

開始本教學前，你應對下列主題具備基本認識。

*   [TypeScript](https://www.typescriptlang.org/ "The TypeScript language") 與 HTML5 程式設計
*   [Angular 應用程式設計](guide/architecture "Introduction to Angular app-design concepts")的基本概念
*   具備[反應式表單](guide/reactive-forms "Reactive forms guide")的基本知識

## 為專案啟用反應式表單

動態表單以反應式表單為基礎。
為了讓應用程式能使用反應式表單指令，[根模組](guide/bootstrapping "Learn about bootstrapping an app from the root module.")會從 `@angular/forms` 程式庫匯入 `ReactiveFormsModule`。

下列範例中的程式碼展示了根模組的設定。

<code-tabs>
    <code-pane header="app.module.ts" path="dynamic-form/src/app/app.module.ts"></code-pane>
    <code-pane header="main.ts" path="dynamic-form/src/main.ts"></code-pane>
</code-tabs>

<a id="object-model"></a>

## 建立表單物件模型

動態表單需要一個物件模型，能描述表單功能所需的所有情境。
範例中的英雄應徵表單是一組問題，也就是說，表單中的每個控制項都必須提出一個問題並接受一個答案。

這類表單的資料模型必須能表示一個問題。
範例包含 `DynamicFormQuestionComponent`，它把問題定義為模型中的基本物件。

下列 `QuestionBase` 是一組控制項的基底類別，這些控制項可以在表單中表示問題及其答案。

<code-example header="src/app/question-base.ts" path="dynamic-form/src/app/question-base.ts"></code-example>

### 定義控制項類別

範例從這個基底衍生出兩個新類別 `TextboxQuestion` 與 `DropdownQuestion`，代表不同的控制項類型。
在下一步建立表單範本時，你會具現化這些特定的問題類型，以便動態算繪適當的控制項。

| 控制項類型                    | 詳細說明 |
|:---                             |:---     |
| `TextboxQuestion` 控制項類型  | 提出問題並讓使用者輸入。 <code-example header="src/app/question-textbox.ts" path="dynamic-form/src/app/question-textbox.ts"></code-example> `TextboxQuestion` 控制項類型在表單範本中使用 `<input>` 元素表示。該元素的 `type` 屬性是依 `options` 引數中指定的 `type` 欄位定義（例如 `text`、`email`、`url`）。 |
| `DropdownQuestion` 控制項類型 | 在選取方塊中呈現一組選項。 <code-example header="src/app/question-dropdown.ts" path="dynamic-form/src/app/question-dropdown.ts"></code-example>                                                                                                                                                                                                                                                         |

### 組合表單群組

動態表單使用服務，依表單模型建立分組的輸入控制項集合。
下列 `QuestionControlService` 會收集一組 `FormGroup` 執行個體，這些執行個體會取用問題模型中的中繼資料。
你可以指定預設值與驗證規則。

<code-example header="src/app/question-control.service.ts" path="dynamic-form/src/app/question-control.service.ts"></code-example>

<a id="form-component"></a>

## 組合動態表單內容

動態表單本身由一個容器元件表示，你會在後面的步驟中加入它。
每個問題在表單元件的範本中都以 `<app-question>` 標籤表示，它對應到 `DynamicFormQuestionComponent` 的一個執行個體。

`DynamicFormQuestionComponent` 負責依資料繫結的問題物件中的值，算繪個別問題的詳細內容。
表單仰賴 [`[formGroup]` 指令](api/forms/FormGroupDirective "API reference") 把範本 HTML 連接到底層的控制項物件。
`DynamicFormQuestionComponent` 會建立表單群組，並以問題模型中定義的控制項加以填入，同時指定顯示與驗證規則。

<code-tabs>
    <code-pane header="dynamic-form-question.component.html" path="dynamic-form/src/app/dynamic-form-question.component.html"></code-pane>
    <code-pane header="dynamic-form-question.component.ts" path="dynamic-form/src/app/dynamic-form-question.component.ts"></code-pane>
</code-tabs>

`DynamicFormQuestionComponent` 的目標是呈現你在模型中定義的問題類型。
目前你只有兩種問題類型，但你可以想像還能有更多。
範本中的 `ngSwitch` 陳述式決定要顯示哪一種問題類型。
這個 switch 使用了帶有 [`formControlName`](api/forms/FormControlName "FormControlName directive API reference") 與 [`formGroup`](api/forms/FormGroupDirective "FormGroupDirective API reference") 選擇器的指令。
這兩個指令都定義在 `ReactiveFormsModule` 中。

<a id="questionnaire-data"></a>

### 提供資料

還需要另一個服務，來提供一組特定的問題，藉此建立個別表單。
在本練習中，你建立 `QuestionService`，從硬編碼的範例資料提供這份問題陣列。
在真實世界的應用程式中，該服務可能會從後端系統擷取資料。
不過，關鍵在於：你完全可以透過 `QuestionService` 傳回的物件來控制英雄求職的問題。
當需求改變時，若要維護這份問卷，你只需要在 `questions` 陣列中新增、更新與移除物件。

`QuestionService` 以陣列形式提供一組問題，該陣列繫結到 `@Input()` 問題。

<code-example header="src/app/question.service.ts" path="dynamic-form/src/app/question.service.ts"></code-example>

<a id="dynamic-template"></a>

## 建立動態表單範本

`DynamicFormComponent` 元件是表單的入口點與主要容器，在範本中使用 `<app-dynamic-form>` 表示。

`DynamicFormComponent` 元件把每個問題繫結到對應 `DynamicFormQuestionComponent` 的 `<app-question>` 元素，藉此呈現問題清單。

<code-tabs>
    <code-pane header="dynamic-form.component.html" path="dynamic-form/src/app/dynamic-form.component.html"></code-pane>
    <code-pane header="dynamic-form.component.ts" path="dynamic-form/src/app/dynamic-form.component.ts"></code-pane>
</code-tabs>

### 顯示表單

若要顯示動態表單的執行個體，`AppComponent` 外殼範本會把 `QuestionService` 傳回的 `questions` 陣列傳給表單容器元件 `<app-dynamic-form>`。

<code-example header="app.component.ts" path="dynamic-form/src/app/app.component.ts"></code-example>

這個範例提供了一個英雄求職的模型，但除了 `QuestionService` 傳回的物件之外，並未參照任何特定的英雄問題。
模型與資料的這種分離，讓你能把這些元件挪用於任何類型的問卷，只要它與 *question* 物件模型相容。

### 確保資料有效

表單範本使用中繼資料的動態資料繫結來算繪表單，不對特定問題做任何寫死的假設。
它會動態加入控制項中繼資料與驗證條件。

為了確保輸入有效，_Save_ 按鈕在表單處於有效狀態之前會保持停用。
當表單有效時，點選 _Save_，應用程式就會把目前的表單值以 JSON 形式算繪出來。

下圖顯示最終的表單。

<div class="lightbox">

<img alt="動態表單" src="generated/images/guide/dynamic-form/dynamic-form.png">

</div>

## 後續步驟

| 步驟                                           | 詳細說明 |
|:---                                             |:---     |
| 不同類型的表單與控制項集合 | 本教學示範如何建立問卷，這只是動態表單的一種。這個範例使用 `FormGroup` 收集一組控制項。關於另一種動態表單的範例，請參閱反應式表單指南中的[建立動態表單](guide/reactive-forms#建立動態表單 "Create dynamic forms with arrays")一節。該範例也示範如何使用 `FormArray` 而非 `FormGroup` 來收集一組控制項。 |
| 驗證使用者輸入                           | [驗證表單輸入](guide/reactive-forms#驗證表單輸入 "Basic input validation")一節介紹反應式表單中輸入驗證的運作方式的基本概念。<br />[表單驗證指南](guide/form-validation "Form validation guide")會更深入地探討這個主題。                                                                                                                                                                 |

<!-- links -->

<!-- external links -->

<!-- end links -->

@reviewed 2022-02-28
