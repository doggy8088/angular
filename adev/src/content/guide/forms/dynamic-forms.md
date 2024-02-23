# 建立動態表單

許多表單，例如問卷，在格式和意圖上可能非常相似。
若要更快、更容易地產生此類表單的不同版本，您可以根據描述商業物件模型的元資料建立一個 _動態表單範本_。
然後，根據資料模型的變化，使用範本來自動產生新的表單。

當你有一種表單的類型時，此技術特別有用，其內容必須經常變更以符合快速變化的商業和法規要求。
典型的用例是問卷。
你可能需要從使用者在不同背景下取得輸入。
使用者看到的表單格式和樣式應保持不變，而你實際需要詢問的問題會因背景而異。

在本教學課程中，您將建立一個動態表單來呈現基本問卷。
您為尋求職位的英雄建立一個線上申請表。
該機構不斷調整申請程序，但藉由使用動態表單，您可以即時建立新表單，而無需變更應用程式程式碼。

本教學課程將帶您逐步完成以下步驟。

1. 為專案啟用響應式表單。
1. 建立資料模型來代表表單控制項。
1. 使用範例資料填入模型。
1. 開發一個元件來動態建立表單控制項。

您建立的表單使用輸入驗證和樣式來改善使用者體驗。
它有一個只有在所有使用者輸入有效時才會啟用的「提交」按鈕，並以色彩編碼和錯誤訊息標示無效輸入。

基本版本可以演變以支援更多種類的問題、更優雅的呈現和優越的使用者體驗。

## 為你的專案啟用響應式表單

動態表單是基於響應式表單。

若要讓應用程式存取響應式表單指令，請從 `@angular/forms` 函式庫將 `ReactiveFormsModule` 匯入必要的元件。

以下來自範例的程式碼顯示根模組的設定。

<docs-code-multifile>
    <docs-code header="dynamic-form.component.ts" path="adev/src/content/examples/dynamic-form/src/app/dynamic-form.component.ts"/>
    <docs-code header="dynamic-form-question.component.ts" path="adev/src/content/examples/dynamic-form/src/app/dynamic-form-question.component.ts"/>
</docs-code-multifile>

## 建立表單物件模型

動態表單需要一個物件模型，該物件模型可以描述表單功能所需的各種情境。
範例 hero-application 表單是一組問題 &mdash; 也即是，表單中的每個控制項都必須提出問題並接受解答。

這種類型表單的資料模型必須代表一個問題。
範例包含 `DynamicFormQuestionComponent`，它將問題定義為模型中的基本物件。

以下 `QuestionBase` 是控制項集的基礎類別，可以表示表單中的問題和其答案。

<docs-code header="src/app/question-base.ts" path="adev/src/content/examples/dynamic-form/src/app/question-base.ts"/>

### 定義控制類別

從這個基礎中，範例衍生出兩個新的類別，`TextboxQuestion` 和 `DropdownQuestion`，表示不同的控制類型。
當您在下一步建立表單範本時，您會實例化這些特定的問題類型以便動態呈現適當的控制項。

`TextboxQuestion` 控制項類型在表單範本中使用 `<input>` 元素表示。它會呈現一個問題，並讓使用者輸入內容。元素的 `type` 屬性是根據在 `options` 引數中指定的 `type` 欄位定義的（例如 `text`、`email`、`url`）。

<docs-code header="question-textbox.ts" path="adev/src/content/examples/dynamic-form/src/app/question-textbox.ts"/>

`DropdownQuestion` 控制項類型在選擇方塊中顯示選項列表。

<docs-code header="question-dropdown.ts" path="adev/src/content/examples/dynamic-form/src/app/question-dropdown.ts"/>

### 組合表單群組

動態表單使用服務建立輸入控制項的群組集，這些集是基於表單模型。
以下的 `QuestionControlService` 收集一組 `FormGroup` 實例，這些實例使用問題模型的元數據。
您可以指定預設值和驗證規則。

<docs-code header="src/app/question-control.service.ts" path="adev/src/content/examples/dynamic-form/src/app/question-control.service.ts"/>

## 編寫動態表單內容

動態表單本身由容器元件表示，您會在稍後的步驟中加入該元件。
每個問題在表單元件的範本中以 `<app-question>` 標記表示，該標記與 `DynamicFormQuestionComponent` 的執行個體相符。

`DynamicFormQuestionComponent` 負責根據資料繫結問題物件中的值呈現個別問題的詳細資料。
此表單仰賴 [`[formGroup]` 指令](api/forms/FormGroupDirective "API 參考") 將範本 HTML 與基礎控制物件連接。
`DynamicFormQuestionComponent` 建立表單群組，並使用問題模型中定義的控制項為其填入資料，同時指定顯示和驗證規則。

<docs-code-multifile>
  <docs-code header="dynamic-form-question.component.html" path="adev/src/content/examples/dynamic-form/src/app/dynamic-form-question.component.html"/>
  <docs-code header="dynamic-form-question.component.ts" path="adev/src/content/examples/dynamic-form/src/app/dynamic-form-question.component.ts"/>
</docs-code-multifile>

`DynamicFormQuestionComponent` 的目標是呈現模型中定義的問題類型。
目前只有兩種問題類型，但你可以想像還有更多。
範本中的 `ngSwitch` 陳述式決定要顯示哪種類型問題。
切換使用帶有 [`formControlName`](api/forms/FormControlName "FormControlName 指令 API 參考") 和 [`formGroup`](api/forms/FormGroupDirective "FormGroupDirective API 參考") 選擇器的指令。
兩個指令都定義在 `ReactiveFormsModule` 中。

### 供應資料

需要另一項服務來提供一組特定問題，以便建立個人表格。
在此練習中，您會建立 `QuestionService` 來提供此陣列的硬編碼範例資料問題。
在實際應用中，服務可能會從後端系統擷取資料。
然而，重點在於您可以透過 `QuestionService` 傳回的物件完全控制英雄職位申請問題。
若要維持問卷隨著需求變更，您只需新增、更新和移除 `questions` 陣列中的物件。

`QuestionService` 提供一組問題，以繫結至 `@Input()` 問題的陣列形式。

<docs-code header="src/app/question.service.ts" path="adev/src/content/examples/dynamic-form/src/app/question.service.ts"/>

## 建立動態表單範本

`DynamicFormComponent` 元件是表單的入口點和主要容器，該表單使用範本中的 `<app-dynamic-form>` 表示。

`DynamicFormComponent` 元件呈現一列問題，藉由將每個問題繫結到與 `DynamicFormQuestionComponent` 相符的 `<app-question>` 元素。

<docs-code-multifile>
    <docs-code header="dynamic-form.component.html" path="adev/src/content/examples/dynamic-form/src/app/dynamic-form.component.html"/>
    <docs-code header="dynamic-form.component.ts" path="adev/src/content/examples/dynamic-form/src/app/dynamic-form.component.ts"/>
</docs-code-multifile>

### 顯示表單

為了顯示動態表單的執行個體，`AppComponent` shell 範本將 `QuestionService` 傳回的 `questions` 陣列傳遞給表單容器元件 `<app-dynamic-form>`.

<docs-code header="app.component.ts" path="adev/src/content/examples/dynamic-form/src/app/app.component.ts"/>

這種模型和數據的分離，讓您可以將元件重新用於任何類型的調查，只要它與 _question_ 物件模型相容即可。

### 確保資料有效

表單範本使用動態資料繫結的元數據來呈現表單，而不會對特定問題做出任何硬編碼的假設。
它會動態新增控制元數據和驗證標準。

為了確保輸入有效，在表格處於有效狀態之前，_儲存_ 按鈕會被停用。
當表格有效時，按一下 _儲存_，應用程式會將目前的表格值呈現為 JSON。

下圖為最終呈現形式。

<img alt="Dynamic-Form" src="assets/content/images/guide/dynamic-form/dynamic-form.png">

## 後續步驟

<docs-pill-row>
  <docs-pill title="驗證表單輸入" href="guide/forms/reactive-forms#validating-form-input" />
  <docs-pill title="表單驗證指南" href="guide/forms/form-validation" />
</docs-pill-row>
