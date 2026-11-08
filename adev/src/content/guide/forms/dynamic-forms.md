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

本教學將帶你完成下列步驟：

1. 為專案啟用反應式表單。
1. 建立用來表示表單控制項的資料模型。
1. 把範例資料填入模型。
1. 開發一個動態建立表單控制項的元件。

你建立的表單使用輸入驗證與樣式來改善使用者體驗。
它有一個 Submit 按鈕，只有在所有使用者輸入都有效時才會啟用，並以顏色標示與錯誤訊息標記無效的輸入。

這個基本版本可以逐步演進，支援更豐富多樣的問題、更優雅的算繪，以及更好的使用者體驗。

## 為專案啟用反應式表單

動態表單是以反應式表單為基礎。

若要讓應用程式能存取反應式表單指令，請把 `@angular/forms` 套件的 `ReactiveFormsModule` 匯入需要的元件。

<docs-code-multifile>
    <docs-code header="dynamic-form.component.ts" path="adev/src/content/examples/dynamic-form/src/app/dynamic-form.component.ts"/>
    <docs-code header="dynamic-form-question.component.ts" path="adev/src/content/examples/dynamic-form/src/app/dynamic-form-question.component.ts"/>
</docs-code-multifile>

## 建立表單物件模型

動態表單需要一個物件模型，能描述表單功能所需的所有情境。
範例中的英雄應徵表單是一組問題，也就是說，表單中的每個控制項都必須提出一個問題並接受一個答案。

這類表單的資料模型必須能表示一個問題。
範例包含 `DynamicFormQuestionComponent`，它把問題定義為模型中的基本物件。

下列 `QuestionBase` 是一組控制項的基底類別，這些控制項可以在表單中表示問題及其答案。

<docs-code header="question-base.ts" path="adev/src/content/examples/dynamic-form/src/app/question-base.ts"/>

### 定義控制項類別

範例從這個基底衍生出兩個新類別 `TextboxQuestion` 與 `DropdownQuestion`，代表不同的控制項類型。
在下一步建立表單範本時，你會具現化這些特定的問題類型，以便動態算繪適當的控制項。

`TextboxQuestion` 控制項類型在表單範本中使用 `<input>` 元素表示。它呈現一個問題，讓使用者輸入內容。該元素的 `type` 屬性依 `options` 參數中指定的 `type` 欄位來定義（例如 `text`、`email`、`url`）。

<docs-code header="question-textbox.ts" path="adev/src/content/examples/dynamic-form/src/app/question-textbox.ts"/>

`DropdownQuestion` 控制項類型會在選取框中呈現一份選項清單。

 <docs-code header="question-dropdown.ts" path="adev/src/content/examples/dynamic-form/src/app/question-dropdown.ts"/>

### 組合表單群組

動態表單使用服務，依表單模型建立分組的輸入控制項集合。
下列 `QuestionControlService` 收集一組 `FormGroup` 執行個體，它們會取用問題模型中的中繼資料。
你可以指定預設值與驗證規則。

<docs-code header="question-control.service.ts" path="adev/src/content/examples/dynamic-form/src/app/question-control.service.ts"/>

## 組合動態表單內容

動態表單本身由一個容器元件表示，你會在後面的步驟中加入它。
每個問題在表單元件的範本中都以 `<app-question>` 標籤表示，它對應到 `DynamicFormQuestionComponent` 的一個執行個體。

`DynamicFormQuestionComponent` 負責依資料繫結的問題物件中的值，算繪個別問題的詳細內容。
表單仰賴 [`[formGroup]` 指令](api/forms/FormGroupDirective 'API reference') 把範本 HTML 連接到底層的控制項物件。
`DynamicFormQuestionComponent` 會建立表單群組，並以問題模型中定義的控制項填入，同時指定顯示與驗證規則。

<docs-code-multifile>
  <docs-code header="dynamic-form-question.component.html" path="adev/src/content/examples/dynamic-form/src/app/dynamic-form-question.component.html"/>
  <docs-code header="dynamic-form-question.component.ts" path="adev/src/content/examples/dynamic-form/src/app/dynamic-form-question.component.ts"/>
</docs-code-multifile>

`DynamicFormQuestionComponent` 的目標是呈現你在模型中定義的問題類型。
目前你只有兩種問題類型，但你可以想像還能有更多。
範本中的 `@switch` 區塊決定要顯示哪一種問題類型。
這個 switch 使用了帶有 [`formControlName`](api/forms/FormControlName 'FormControlName directive API reference') 與 [`formGroup`](api/forms/FormGroupDirective 'FormGroupDirective API reference') 選擇器的指令。
這兩個指令都定義在 `ReactiveFormsModule` 中。

### 提供資料

還需要另一個服務，來提供一組特定的問題，藉此建立個別表單。
在本練習中，你建立 `QuestionService`，從硬編碼的範例資料提供這份問題陣列。
在真實世界的應用程式中，該服務可能會從後端系統擷取資料。
不過，關鍵在於：你完全可以透過 `QuestionService` 傳回的物件來控制英雄求職的問題。
當需求改變時，若要維護這份問卷，你只需要在 `questions` 陣列中新增、更新與移除物件。

`QuestionService` 以陣列形式提供一組問題，該陣列繫結到 `input()` 問題。

<docs-code header="question.service.ts" path="adev/src/content/examples/dynamic-form/src/app/question.service.ts"/>

## 建立動態表單範本

`DynamicFormComponent` 元件是表單的入口點與主要容器，在範本中使用 `<app-dynamic-form>` 表示。

`DynamicFormComponent` 元件把每個問題繫結到對應 `DynamicFormQuestionComponent` 的 `<app-question>` 元素，藉此呈現問題清單。

<docs-code-multifile>
    <docs-code header="dynamic-form.component.html" path="adev/src/content/examples/dynamic-form/src/app/dynamic-form.component.html"/>
    <docs-code header="dynamic-form.component.ts" path="adev/src/content/examples/dynamic-form/src/app/dynamic-form.component.ts"/>
</docs-code-multifile>

### 顯示表單

若要顯示動態表單的執行個體，`AppComponent` 外殼範本會把 `QuestionService` 傳回的 `questions` 陣列傳給表單容器元件 `<app-dynamic-form>`。

<docs-code header="app.component.ts" path="adev/src/content/examples/dynamic-form/src/app/app.component.ts"/>

模型與資料如此分離，讓你可以把這些元件重新用於任何類型的問卷調查，只要它與_問題_物件模型相容即可。

### 確保資料有效

表單範本使用中繼資料的動態資料繫結來算繪表單，不對特定問題做任何寫死的假設。
它會動態加入控制項中繼資料與驗證條件。

為了確保輸入有效，_Save_ 按鈕在表單處於有效狀態之前會保持停用。
當表單有效時，點選 _Save_，應用程式就會把目前的表單值以 JSON 形式算繪出來。

下圖顯示最終的表單。

<img alt="動態表單" src="assets/images/guide/dynamic-form/dynamic-form.png">

## 後續步驟

<docs-pill-row>
  <docs-pill title="驗證表單輸入" href="guide/forms/reactive-forms#validating-form-input" />
  <docs-pill title="表單驗證指南" href="guide/forms/form-validation" />
</docs-pill-row>
