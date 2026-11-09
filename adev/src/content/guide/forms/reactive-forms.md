# 反應式表單

反應式表單提供一種模型驅動的方法，來處理值會隨時間變化的表單輸入。
本指南說明如何建立與更新一個基本的表單控制項、在群組中使用多個控制項、驗證表單值，以及建立可以在執行階段新增或移除控制項的動態表單。

## 反應式表單概觀

反應式表單使用明確且不可變的方法，來管理表單在某個時間點的狀態。
表單狀態的每次變更都會回傳一個新狀態，讓模型在變更之間維持完整性。
反應式表單建立在 observable 串流之上，其中表單輸入與值被提供為可同步存取的串流。

反應式表單也提供了直接的測試路徑，因為你能確信在被要求時，你的資料是一致且可預測的。
這些串流的任何消費者都可以安全地操作資料。

反應式表單與[範本驅動表單](guide/forms/template-driven-forms)在明顯的方面有所不同。
反應式表單提供對資料模型的同步存取、以 observable 運算子實現的不可變性，以及透過 observable 串流進行的變更追蹤。

範本驅動表單允許直接存取以修改範本中的資料，但不如反應式表單明確，因為它們依賴嵌在範本中的指令，以及可變資料來非同步追蹤變更。
兩種範式之間的詳細比較請見[表單概觀](guide/forms)。

## 加入一個基本的表單控制項 {#adding-a-basic-form-control}

使用表單控制項有三個步驟。

1. 產生一個新元件，並註冊反應式表單模組。這個模組宣告了使用反應式表單所需的反應式表單指令。
1. 實例化一個新的 `FormControl`。
1. 在範本中註冊該 `FormControl`。

接著，你可以把元件加入範本，來顯示表單。

下列範例示範如何加入單一表單控制項。
在範例中，使用者把姓名輸入到一個輸入欄位，擷取該輸入值，並顯示表單控制項元素的目前值。

<docs-workflow>

<docs-step title="產生新元件並匯入 ReactiveFormsModule">
使用 CLI 指令 `ng generate component` 在你的專案中產生一個元件，並從 `@angular/forms` 套件匯入 `ReactiveFormsModule`，把它加入元件的 `imports` 陣列。

<docs-code header="name-editor.component.ts (excerpt)" path="adev/src/content/examples/reactive-forms/src/app/name-editor/name-editor.component.ts" region="imports" />
</docs-step>

<docs-step title="宣告一個 FormControl 實例">
使用 `FormControl` 的建構子設定它的初始值，在這個案例中是一個空字串。透過在元件類別中建立這些控制項，你可以立即存取它們，監聽、更新並驗證表單輸入的狀態。

<docs-code header="name-editor.component.ts" path="adev/src/content/examples/reactive-forms/src/app/name-editor/name-editor.component.ts" region="create-control"/>
</docs-step>

<docs-step title="在範本中註冊控制項">
在元件類別中建立控制項之後，你必須把它與範本中的表單控制項元素建立關聯。使用 `FormControlDirective` 提供的 `formControl` 繫結來更新範本，該指令同樣包含在 `ReactiveFormsModule` 中。

<docs-code header="name-editor.component.html" path="adev/src/content/examples/reactive-forms/src/app/name-editor/name-editor.component.html" region="control-binding" />

使用範本繫結語法後，表單控制項現在已註冊到範本中的 `name` 輸入元素。表單控制項與 DOM 元素彼此溝通：view 反映模型中的變更，模型也反映 view 中的變更。
</docs-step>

<docs-step title="顯示元件">
當 `<app-name-editor>` 元件被加入範本時，指派給 `name` 屬性的 `FormControl` 就會被顯示。

<docs-code header="app.component.html (name editor)" path="adev/src/content/examples/reactive-forms/src/app/app.component.1.html" region="app-name-editor"/>
</docs-step>
</docs-workflow>

### 顯示表單控制項的值

你可以用下列方式顯示值：

- 透過 `valueChanges` observable，你可以使用 `AsyncPipe` 在範本中監聽表單值的變更，或在元件類別中使用 `subscribe()` 方法監聽
- 使用 `value` 屬性，它提供目前值的快照

下列範例示範如何使用範本中的插值顯示目前值。

<docs-code header="name-editor.component.html (control value)" path="adev/src/content/examples/reactive-forms/src/app/name-editor/name-editor.component.html" region="display-value"/>

當你更新表單控制項元素時，顯示的值也會隨之變更。

反應式表單透過每個實例所提供的屬性與方法，提供對指定控制項資訊的存取。
底層 [AbstractControl](api/forms/AbstractControl 'API 參考文件') 類別的這些屬性與方法，被用來控制表單狀態，並決定在處理[輸入驗證](#validating-form-input '進一步了解如何驗證表單輸入')時何時顯示訊息。

其他 `FormControl` 屬性與方法請見 [API 參考文件](api/forms/FormControl '詳細語法參考')。

### 取代表單控制項的值

反應式表單有以程式化方式變更控制項值的方法，讓你能靈活地在沒有使用者互動的情況下更新值。
表單控制項實例提供了一個 `setValue()` 方法，它會更新表單控制項的值，並依據控制項的結構驗證所提供值的結構。
例如，當從後端 API 或服務擷取表單資料時，使用 `setValue()` 方法把控制項更新為它的新值，完全取代舊值。

下列範例為元件類別加入一個方法，使用 `setValue()` 方法把控制項的值更新為 _Nancy_。

<docs-code header="name-editor.component.ts (update value)" path="adev/src/content/examples/reactive-forms/src/app/name-editor/name-editor.component.ts" region="update-value"/>

在範本中加入一個按鈕，模擬姓名更新。
當你點選 **Update Name** 按鈕時，表單控制項元素中輸入的值會反映為它的目前值。

<docs-code header="name-editor.component.html (update value)" path="adev/src/content/examples/reactive-forms/src/app/name-editor/name-editor.component.html" region="update-value"/>

表單模型是控制項的真相來源，因此當你點選按鈕時，輸入的值會在元件類別中被變更，覆寫它的目前值。

HELPFUL: 在這個範例中，你使用的是單一控制項。
當對[表單群組](#grouping-form-controls)或[表單陣列](#creating-dynamic-forms)實例使用 `setValue()` 方法時，值需要符合群組或陣列的結構。

## 將表單控制項分組 {#grouping-form-controls}

表單通常包含數個相關的控制項。
反應式表單提供兩種方法，將多個相關控制項分組為單一輸入表單。

| 表單群組 | 說明                                                                                                                                                                                                                                                |
| :---------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 表單群組  | 定義一個帶有固定一組控制項的表單，你可以把它們一起管理。表單群組的基礎在本節討論。你也可以[巢狀表單群組](#creating-nested-form-groups '進一步了解巢狀群組')來建立更複雜的表單。 |
| 表單陣列  | 定義一個動態表單，你可以在執行階段新增與移除控制項。你也可以巢狀表單陣列來建立更複雜的表單。這個選項的詳情請見[建立動態表單](#creating-dynamic-forms)。                              |

正如表單控制項實例讓你能控制單一輸入欄位，表單群組實例會追蹤一組表單控制項實例的表單狀態（例如一個表單）。
在建立表單群組時，群組實例中的每個控制項都以名稱追蹤。
下列範例示範如何在單一群組中管理多個表單控制項實例。

產生一個 `ProfileEditor` 元件，並從 `@angular/forms` 套件匯入 `FormGroup` 與 `FormControl` 類別。

```shell
ng generate component ProfileEditor
```

<docs-code header="profile-editor.component.ts (imports)" path="adev/src/content/examples/reactive-forms/src/app/profile-editor/profile-editor.component.1.ts" region="imports"/>

若要為這個元件加入表單群組，請採取下列步驟。

1. 建立一個 `FormGroup` 實例。
1. 將 `FormGroup` 模型與 view 建立關聯。
1. 儲存表單資料。

<docs-workflow>

<docs-step title="建立一個 FormGroup 實例">
在元件類別中建立一個名為 `profileForm` 的屬性，並把該屬性設為一個新的表單群組實例。若要初始化表單群組，請為建構子提供一個物件，其具名鍵對應到各自的控制項。

對於個人資料表單，加入兩個名為 `firstName` 與 `lastName` 的表單控制項實例

<docs-code header="profile-editor.component.ts (form group)" path="adev/src/content/examples/reactive-forms/src/app/profile-editor/profile-editor.component.1.ts" region="formgroup"/>

個別的表單控制項現在被收集在一個群組之中。`FormGroup` 實例以一個物件的形式提供它的模型值，該物件是從群組中每個控制項的值歸納而來。表單群組實例與表單控制項實例具有相同的屬性（例如 `value` 與 `untouched`）與方法（例如 `setValue()`）。
</docs-step>

<docs-step title="將 FormGroup 模型與 view 建立關聯">
表單群組會追蹤其每個控制項的狀態與變更，因此如果其中一個控制項變更，父控制項也會發出新的狀態或值變更。群組的模型由它的成員維持。在你定義模型之後，必須更新範本，讓模型反映在 view 中。

<docs-code header="profile-editor.component.html (template form group)" path="adev/src/content/examples/reactive-forms/src/app/profile-editor/profile-editor.component.1.html" region="formgroup"/>

正如表單群組包含一組控制項，_profileForm_ `FormGroup` 透過 `FormGroup` 指令繫結到 `form` 元素，在模型與包含輸入的表單之間建立一個溝通層。`FormControlName` 指令提供的 `formControlName` 輸入，將每個個別輸入繫結到 `FormGroup` 中定義的表單控制項。表單控制項與它們各自的元素溝通。它們也會把變更傳達給表單群組實例，該實例提供模型值的真相來源。
</docs-step>

<docs-step title="儲存表單資料">
`ProfileEditor` 元件接受使用者的輸入，但在真實情境中，你會想擷取表單值，讓它能在元件之外進一步處理。`FormGroup` 指令監聽 `form` 元素發出的 `submit` 事件，並發出一個 `ngSubmit` 事件，你可以把它繫結到一個回呼函式。在 `form` 標籤上加入一個 `ngSubmit` 事件監聽器，搭配 `onSubmit()` 回呼方法。

<docs-code header="profile-editor.component.html (submit event)" path="adev/src/content/examples/reactive-forms/src/app/profile-editor/profile-editor.component.html" region="ng-submit"/>

`ProfileEditor` 元件中的 `onSubmit()` 方法擷取 `profileForm` 的目前值。使用 `output()` 讓表單保持封裝，並在元件之外提供表單值。下列範例使用 `console.warn` 把訊息記錄到瀏覽器主控台。

<docs-code header="profile-editor.component.ts (submit method)" path="adev/src/content/examples/reactive-forms/src/app/profile-editor/profile-editor.component.ts" region="on-submit"/>

`submit` 事件由 `form` 標籤使用內建的 DOM 事件發出。你透過點選一個 `submit` 類型的按鈕來觸發這個事件。這讓使用者能按下 **Enter** 鍵，送出已完成的表單。

使用一個 `button` 元素，在表單底部加入一個按鈕來觸發表單送出。

<docs-code header="profile-editor.component.html (submit button)" path="adev/src/content/examples/reactive-forms/src/app/profile-editor/profile-editor.component.html" region="submit-button"/>

前面片段中的按鈕還附帶了一個 `disabled` 繫結，在 `profileForm` 無效時停用該按鈕。你目前尚未執行任何驗證，因此按鈕永遠處於啟用狀態。基本的表單驗證在[驗證表單輸入](#validating-form-input)一節中介紹。
</docs-step>

<docs-step title="顯示元件 {#display-the-component-form-group}">
若要顯示包含該表單的 `ProfileEditor` 元件，請把它加入一個元件範本。

<docs-code header="app.component.html (profile editor)" path="adev/src/content/examples/reactive-forms/src/app/app.component.1.html" region="app-profile-editor"/>

`ProfileEditor` 讓你能在表單群組實例中，管理 `firstName` 與 `lastName` 控制項的表單控制項實例。
</docs-step>
</docs-workflow>

### 建立巢狀表單群組 {#creating-nested-form-groups}

表單群組可以接受個別表單控制項實例與其他表單群組實例作為子項。
這讓組合複雜的表單模型更容易維護，也更容易在邏輯上分組。

在建置複雜表單時，把不同區域的資訊拆成較小的區段會更容易管理。
使用巢狀表單群組實例，讓你能把大型表單群組拆成更小、更易管理的群組。

若要建立更複雜的表單，請採取下列步驟。

1. 建立一個巢狀群組。
1. 在範本中將巢狀表單分組。

某些類型的資訊自然會落入同一組。
姓名與地址就是這類巢狀群組的典型範例，並在下列範例中使用。

<docs-workflow>
<docs-step title="建立一個巢狀群組">
若要在 `profileForm` 中建立巢狀群組，請為表單群組實例加入一個巢狀的 `address` 元素。

<docs-code header="profile-editor.component.ts (nested form group)" path="adev/src/content/examples/reactive-forms/src/app/profile-editor/profile-editor.component.1.ts" region="nested-formgroup"/>

在這個範例中，`address group` 把目前的 `firstName` 與 `lastName` 控制項，與新的 `street`、`city`、`state` 與 `zip` 控制項結合起來。即使表單群組中的 `address` 元素是整體 `profileForm` 元素的一個子項，值與狀態變更的規則同樣適用。巢狀表單群組的狀態與值變更會傳播到父表單群組，讓整體模型保持一致。
</docs-step>

<docs-step title="在範本中將巢狀表單分組">
在元件類別中更新模型之後，更新範本，把表單群組實例與它的輸入元素連接起來。把包含 `street`、`city`、`state` 與 `zip` 欄位的 `address` 表單群組，加入 `ProfileEditor` 範本。

<docs-code header="profile-editor.component.html (template nested form group)" path="adev/src/content/examples/reactive-forms/src/app/profile-editor/profile-editor.component.1.html" region="formgroupname"/>

`ProfileEditor` 表單顯示為一個群組，但模型被進一步拆解，以呈現邏輯分組區域。

使用 `value` 屬性與 `JsonPipe`，在元件範本中顯示表單群組實例的值。
</docs-step>
</docs-workflow>

### 更新資料模型的部分內容

當更新一個包含多個控制項的表單群組實例的值時，你可能只想更新模型的一部分。
本節介紹如何更新表單控制項資料模型的特定部分。

有兩種方法可以更新模型值：

| 方法        | 說明                                                                                                                                                               |
| :------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `setValue()`   | 為個別控制項設定新值。`setValue()` 方法嚴格遵守表單群組的結構，並取代控制項的整個值。 |
| `patchValue()` | 取代物件中已在表單模型裡變更的任何已定義屬性。                                                                                     |

`setValue()` 方法的嚴格檢查有助於在複雜表單中抓出巢狀錯誤，而 `patchValue()` 則會在這些錯誤上無聲地失敗。

在 `ProfileEditorComponent` 中，使用 `updateProfile` 方法搭配下列範例，更新使用者的名字與街道地址。

<docs-code header="profile-editor.component.ts (patch value)" path="adev/src/content/examples/reactive-forms/src/app/profile-editor/profile-editor.component.1.ts" region="patch-value"/>

加入一個按鈕到範本中，模擬依需求更新使用者個人資料。

<docs-code header="profile-editor.component.html (update value)" path="adev/src/content/examples/reactive-forms/src/app/profile-editor/profile-editor.component.1.html" region="patch-value"/>

當使用者點選按鈕時，`profileForm` 模型會以 `firstName` 與 `street` 的新值更新。請注意，`street` 是在 `address` 屬性內的一個物件中提供的。
這是必要的，因為 `patchValue()` 方法會依據模型結構套用更新。
`patchValue()` 只更新表單模型所定義的屬性。

## 使用 FormBuilder 服務產生控制項

在處理多個表單時，手動建立表單控制項實例可能會變得繁瑣重複。
`FormBuilder` 服務提供產生控制項的便利方法。

採取下列步驟來利用這個服務。

1. 匯入 `FormBuilder` 類別。
1. 注入 `FormBuilder` 服務。
1. 產生表單內容。

下列範例示範如何重構 `ProfileEditor` 元件，使用表單建置器服務來建立表單控制項與表單群組實例。

<docs-workflow>
<docs-step title="匯入 FormBuilder 類別">
從 `@angular/forms` 套件匯入 `FormBuilder` 類別。

<docs-code header="profile-editor.component.ts (import)" path="adev/src/content/examples/reactive-forms/src/app/profile-editor/profile-editor.component.2.ts" region="form-builder-imports"/>

</docs-step>

<docs-step title="注入 FormBuilder 服務">
`FormBuilder` 服務是來自反應式表單模組的可注入 provider。使用 `inject()` 函式在你的元件中注入這個相依性。

<docs-code header="profile-editor.component.ts (property init)" path="adev/src/content/examples/reactive-forms/src/app/profile-editor/profile-editor.component.2.ts" region="inject-form-builder"/>

</docs-step>
<docs-step title="產生表單控制項">
`FormBuilder` 服務有三個方法：`control()`、`group()` 與 `array()`。這些是在元件類別中產生實例的工廠方法，包括表單控制項、表單群組與表單陣列。使用 `group` 方法建立 `profileForm` 控制項。

<docs-code header="profile-editor.component.ts (form builder)" path="adev/src/content/examples/reactive-forms/src/app/profile-editor/profile-editor.component.2.ts" region="form-builder"/>

在前面的範例中，你使用 `group()` 方法搭配同一個物件來定義模型中的屬性。每個控制項名稱的值，都是一個陣列，其第一個項目是初始值。

TIP: 你可以只用初始值定義控制項，但如果你的控制項需要同步或非同步驗證，請把同步與非同步驗證器分別作為陣列的第二與第三個項目加入。將使用表單建置器與手動建立實例兩者做比較。

  <docs-code-multifile>
    <docs-code header="profile-editor.component.ts (instances)" path="adev/src/content/examples/reactive-forms/src/app/profile-editor/profile-editor.component.1.ts" region="formgroup-compare"/>
    <docs-code header="profile-editor.component.ts (form builder)" path="adev/src/content/examples/reactive-forms/src/app/profile-editor/profile-editor.component.2.ts" region="formgroup-compare"/>
  </docs-code-multifile>
</docs-step>

</docs-workflow>

## 驗證表單輸入 {#validating-form-input}

_表單驗證_用來確保使用者輸入完整且正確。
本節介紹如何為表單控制項加入單一驗證器，並顯示整體表單狀態。
表單驗證在[表單驗證](guide/forms/form-validation)指南中有更完整的介紹。

採取下列步驟來加入表單驗證。

1. 在你的表單元件中匯入一個驗證器函式。
1. 把驗證器加入表單中的欄位。
1. 加入處理驗證狀態的邏輯。

最常見的驗證是把欄位設為必填。
下列範例示範如何為 `firstName` 控制項加入必填驗證，並顯示驗證結果。

<docs-workflow>
<docs-step title="匯入驗證器函式">
反應式表單包含一組適用於常見使用情境的驗證器函式。這些函式接收一個待驗證的控制項，並依據驗證檢查回傳一個錯誤物件或 null 值。

從 `@angular/forms` 套件匯入 `Validators` 類別。

<docs-code header="profile-editor.component.ts (import)" path="adev/src/content/examples/reactive-forms/src/app/profile-editor/profile-editor.component.ts" region="validator-imports"/>
</docs-step>

<docs-step title="把欄位設為必填">
在 `ProfileEditor` 元件中，把 `Validators.required` 靜態方法作為陣列的第二個項目，加入 `firstName` 控制項。

<docs-code header="profile-editor.component.ts (required validator)" path="adev/src/content/examples/reactive-forms/src/app/profile-editor/profile-editor.component.ts" region="required-validator"/>
</docs-step>

<docs-step title="顯示表單狀態">
當你把必填欄位加入表單控制項時，它的初始狀態是無效的。這個無效狀態會傳播到父表單群組元素，使其狀態也變成無效。透過表單群組實例的 `status` 屬性，存取它的目前狀態。

使用插值顯示 `profileForm` 的目前狀態。

<docs-code header="profile-editor.component.html (display status)" path="adev/src/content/examples/reactive-forms/src/app/profile-editor/profile-editor.component.html" region="display-status"/>

**Submit** 按鈕被停用，因為 `profileForm` 由於必填的 `firstName` 表單控制項而無效。在你填寫 `firstName` 輸入後，表單變成有效，**Submit** 按鈕隨即啟用。

若要進一步了解表單驗證，請造訪[表單驗證](guide/forms/form-validation)指南。
</docs-step>
</docs-workflow>

## 建立動態表單 {#creating-dynamic-forms}

`FormArray` 是 `FormGroup` 的替代方案，用來管理任意數量的未命名控制項。
如同表單群組實例，你可以動態地在表單陣列實例中插入與移除控制項，而且表單陣列實例的值與驗證狀態是從它的子控制項計算而來。
不過，你不需要為每個控制項以名稱定義鍵，因此如果你事先不知道子值的數量，這是個很好的選項。

若要定義動態表單，請採取下列步驟。

1. 匯入 `FormArray` 類別。
1. 定義一個 `FormArray` 控制項。
1. 以 getter 方法存取 `FormArray` 控制項。
1. 在範本中顯示表單陣列。

下列範例示範如何在 `ProfileEditor` 中管理一個 _aliases_ 陣列。

<docs-workflow>
<docs-step title="匯入 `FormArray` 類別">
從 `@angular/forms` 匯入 `FormArray` 類別，用於型別資訊。`FormBuilder` 服務已準備好建立 `FormArray` 實例。

<docs-code header="profile-editor.component.ts (import)" path="adev/src/content/examples/reactive-forms/src/app/profile-editor/profile-editor.component.2.ts" region="form-array-imports"/>
</docs-step>

<docs-step title="定義一個 `FormArray` 控制項">
你可以把任意數量的控制項（從零到多個）定義在一個陣列中，來初始化表單陣列。為 `profileForm` 的表單群組實例加入一個 `aliases` 屬性，來定義表單陣列。

使用 `FormBuilder.array()` 方法定義陣列，並使用 `FormBuilder.control()` 方法，以一個初始控制項填入陣列。

<docs-code header="profile-editor.component.ts (aliases form array)" path="adev/src/content/examples/reactive-forms/src/app/profile-editor/profile-editor.component.ts" region="aliases"/>

表單群組實例中的 aliases 控制項現在被填入單一控制項，直到有更多控制項被動態加入為止。
</docs-step>

<docs-step title="存取 `FormArray` 控制項">
與重複使用 `profileForm.get()` 方法取得每個實例相比，getter 提供了對表單陣列實例中 aliases 的存取。表單陣列實例代表陣列中未定數量的控制項。透過 getter 存取控制項很方便，而且這個做法很容易對其他控制項重複套用。 <br />

使用 getter 語法建立一個 `aliases` 類別屬性，從父表單群組擷取 alias 的表單陣列控制項。

<docs-code header="profile-editor.component.ts (aliases getter)" path="adev/src/content/examples/reactive-forms/src/app/profile-editor/profile-editor.component.ts" region="aliases-getter"/>

由於回傳的控制項型別是 `AbstractControl`，你需要提供明確的型別，才能存取表單陣列實例的方法語法。定義一個方法，將 alias 控制項動態插入 alias 的表單陣列。`FormArray.push()` 方法把控制項作為新項目插入陣列，你也可以把一組控制項陣列傳給 FormArray.push()，一次註冊多個控制項。

<docs-code header="profile-editor.component.ts (add alias)" path="adev/src/content/examples/reactive-forms/src/app/profile-editor/profile-editor.component.ts" region="add-alias"/>

在範本中，每個控制項都顯示為個別的輸入欄位。

</docs-step>

<docs-step title="在範本中顯示表單陣列">

若要把 aliases 從你的表單模型附著上來，你必須把它加入範本。與 `FormGroupName` 提供的 `formGroupName` 輸入相似，`formArrayName` 透過 `FormArrayName`，將表單陣列實例的溝通繫結到範本。

在關閉 `formGroupName` 元素的 `<div>` 之後，加入下列範本 HTML。

<docs-code header="profile-editor.component.html (aliases form array template)" path="adev/src/content/examples/reactive-forms/src/app/profile-editor/profile-editor.component.html" region="formarrayname"/>

`@for` 區塊會迭代 aliases 表單陣列實例所提供的每個表單控制項實例。由於表單陣列元素未命名，你把索引指派給 `i` 變數，並把它傳給每個控制項，將它繫結到 `formControlName` 輸入。

每當加入新的 alias 實例時，新的表單陣列實例就會依索引取得它的控制項。這讓你能在計算根控制項的狀態與值時，追蹤每個個別控制項。

NOTE: 在 zoneless 應用程式中，變更反應式表單模型（例如呼叫 `FormArray.push()`）不會自動排程元件的變更偵測。如果你的範本依賴 `aliases.controls` 這類結構性的模型變更，請確保元件通知 Angular 執行變更偵測，例如把 forms observable 橋接到 `ChangeDetectorRef.markForCheck()`：

```ts
import {ChangeDetectorRef, Component, inject} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';

@Component({/* ... */})
export class ProfileEditor {
  private readonly cdr = inject(ChangeDetectorRef);

  constructor() {
    this.profileForm.valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.cdr.markForCheck());
  }
}
```

</docs-step>

### 對頂層表單陣列使用 `FormArrayDirective`

你可以使用 `FormArrayDirective`，把 `FormArray` 直接繫結到 `<form>` 元素。
這在表單不使用頂層 `FormGroup`、而陣列本身就代表完整表單模型時很有用。

```angular-ts
import {Component} from '@angular/core';
import {FormArray, FormControl, ReactiveFormsModule} from '@angular/forms';

@Component({
  selector: 'form-array-example',
  imports: [ReactiveFormsModule],
  template: `
    <form [formArray]="form">
      @for (control of form.controls; track $index) {
        <input [formControlName]="$index" />
      }
    </form>
  `,
})
export class FormArrayExampleComponent {
  controls = [new FormControl('fish'), new FormControl('cat'), new FormControl('dog')];

  form = new FormArray(this.controls);
}
```

<docs-step title="加入一個 alias">

一開始，表單包含一個 `Alias` 欄位。若要加入另一個欄位，點選 **Add Alias** 按鈕。你也可以驗證範本底部 `Form Value` 所顯示的表單模型回報的 aliases 陣列。你不必為每個 alias 使用一個表單控制項實例，而是可以組合另一個帶有額外欄位的表單群組實例。為每個項目定義控制項的流程是相同的。
</docs-step>

</docs-workflow>

## 統一的控制項狀態變更事件 {#unified-control-state-change-events}

所有表單控制項都透過 `AbstractControl` 上的 `events` observable（`FormControl`、`FormGroup`、`FormArray` 與 `FormRecord`），公開單一統一的**控制項狀態變更事件**串流。
這個統一串流讓你能對**值**、**狀態**、**pristine**、**touched** 與 **reset** 狀態變更做出反應，也能對 **submit** 等**表單層級動作**做出反應，讓你用單一訂閱處理所有更新，而不必串接多個 observable。

### 事件類型

`events` 發出的每個項目都是特定事件類別的實例：

- **`ValueChangeEvent`** — 當控制項的**值**變更時。
- **`StatusChangeEvent`** — 當控制項的**驗證狀態**更新為 `FormControlStatus` 值之一時（`VALID`、`INVALID`、`PENDING` 或 `DISABLED`）。
- **`PristineChangeEvent`** — 當控制項的 **pristine/dirty** 狀態變更時。
- **`TouchedChangeEvent`** — 當控制項的 **touched/untouched** 狀態變更時。
- **`FormResetEvent`** — 當控制項或表單被重設時，無論是透過 `reset()` API 或原生動作。
- **`FormSubmittedEvent`** — 當表單被送出時。

所有事件類別都繼承 `ControlEvent`，並包含一個 `source` 參考，指向引發變更的 `AbstractControl`，這在大表單中很有用。

```ts
import {Component} from '@angular/core';
import {
  FormControl,
  ValueChangeEvent,
  StatusChangeEvent,
  PristineChangeEvent,
  TouchedChangeEvent,
  FormResetEvent,
  FormSubmittedEvent,
  ReactiveFormsModule,
  FormGroup,
} from '@angular/forms';

@Component(/* ... */)
export class UnifiedEventsBasicComponent {
  form = new FormGroup({
    username: new FormControl(''),
  });

  constructor() {
    this.form.events.subscribe((e) => {
      if (e instanceof ValueChangeEvent) {
        console.log('Value changed to: ', e.value);
      }

      if (e instanceof StatusChangeEvent) {
        console.log('Status changed to: ', e.status);
      }

      if (e instanceof PristineChangeEvent) {
        console.log('Pristine status changed to: ', e.pristine);
      }

      if (e instanceof TouchedChangeEvent) {
        console.log('Touched status changed to: ', e.touched);
      }

      if (e instanceof FormResetEvent) {
        console.log('Form was reset');
      }

      if (e instanceof FormSubmittedEvent) {
        console.log('Form was submitted');
      }
    });
  }
}
```

### 篩選特定事件

當你只需要事件類型的子集時，優先使用 RxJS 運算子。

```ts
import {filter} from 'rxjs/operators';
import {StatusChangeEvent} from '@angular/forms';

control.events
  .pipe(filter((e) => e instanceof StatusChangeEvent))
  .subscribe((e) => console.log('Status:', e.status));
```

### 從多個訂閱統一

**之前**

```ts
import {combineLatest} from 'rxjs';

combineLatest([control.valueChanges, control.statusChanges]).subscribe(([value, status]) => {
  /* ... */
});
```

**之後**

```ts
control.events.subscribe((e) => {
  // Handle ValueChangeEvent, StatusChangeEvent, etc.
});
```

NOTE: 在值變更時，發出（emit）發生在此控制項的值被更新之後。父控制項的值（例如此 FormControl 是 FormGroup 的一部分時）會稍後才更新，因此從此事件的回呼中存取父控制項的值（使用 `value` 屬性），可能會取得尚未更新的值。改為訂閱父控制項的 `events`。

## 管理表單控制項狀態 {#managing-form-control-state}

反應式表單透過 **touched/untouched** 與 **pristine/dirty** 追蹤控制項狀態。Angular 在 DOM 互動期間自動更新這些狀態，但你也可以用程式化方式管理它們。

**[`markAsTouched`](api/forms/FormControl#markAsTouched)** — 將控制項或表單標記為 touched，適用於 focus 與 blur 這類不改變值的事件。預設會傳播到父控制項。

```ts
// Show validation errors after user leaves a field
onEmailBlur() {
  const email = this.form.get('email');
  email.markAsTouched();
}
```

**[`markAsUntouched`](api/forms/FormControl#markAsUntouched)** — 將控制項或表單標記為 untouched。會連帶影響所有子控制項，並重新計算所有父控制項的 touched 狀態。

```ts
// Reset form state after successful submission
onSubmitSuccess() {
  this.form.markAsUntouched();
  this.form.markAsPristine();
}
```

**[`markAsDirty`](api/forms/FormControl#markAsDirty)** — 將控制項或表單標記為 dirty，意思是值已被變更。預設會傳播到父控制項。

```ts
// Mark programmatically changed values as modified
autofillAddress() {
  const previousAddress = getAddress();
  this.form.patchValue(previousAddress, { emitEvent: false });
  this.form.markAsDirty();
}
```

**[`markAsPristine`](api/forms/FormControl#markAsPristine)** — 將控制項或表單標記為 pristine。會把所有子控制項標記為 pristine，並重新計算所有父控制項的 pristine 狀態。

```ts
// Reset pristine state after saving to track new changes
saveForm() {
  this.api.save(this.form.value).subscribe(() => {
    this.form.markAsPristine();
  });
}
```

**[`markAllAsDirty`](api/forms/FormControl#markAllAsDirty)** — 將控制項或表單以及它所有的後代控制項標記為 dirty。

```ts
// Mark imported data as dirty
loadData(data: FormData) {
  this.form.patchValue(data);
  this.form.markAllAsDirty();
}
```

**[`markAllAsTouched`](api/forms/FormControl#markAllAsTouched)** — 將控制項或表單以及它所有的後代控制項標記為 touched。適合用來在整個表單顯示驗證錯誤。

```ts
// Show all validation errors before submission
onSubmit() {
  if (this.form.invalid) {
    this.form.markAllAsTouched();
    return;
  }
  this.saveForm();
}
```

## 控制事件發送與傳播

當以程式化方式更新表單控制項時，你可以精確控制變更如何在表單階層中傳播，以及是否發出事件。

### 了解事件發送 {#understanding-event-emission}

預設 `emitEvent: true` 時，控制項的任何變更都會透過 `valueChanges` 與 `statusChanges` observable 發出事件。設定 `emitEvent: false` 會抑制這些發出，這在以程式方式設定值而不想觸發像自動儲存這樣的反應式行為、避免控制項之間的循環更新，或執行批次更新（事件應該只在最後發出一次）時很有用。

```ts
@Component({/* ... */})
export class BlogPostEditor {
  postForm = new FormGroup({
    title: new FormControl(''),
    content: new FormControl(''),
  });

  constructor() {
    // Auto-save draft every time user types
    this.postForm.valueChanges.subscribe((formValue) => {
      this.autosaveDraft(formValue);
    });
  }

  loadExistingDraft(savedDraft: {title: string; content: string}) {
    // Restore draft without triggering auto-save
    this.postForm.setValue(savedDraft, {emitEvent: false});
  }
}
```

### 了解傳播控制

預設 `onlySelf: false` 時，更新會連帶影響父控制項，重新計算它們的值與驗證狀態。設定 `onlySelf: true` 會把更新隔離在目前控制項，不通知父控制項。這在批次操作時很有用，你可以手動只觸發一次父項更新。

```ts
updatePostalCodeValidator(country: string) {
  const postal = this.addressForm.get('postalCode');

  const validators = country === 'US'
    ? [Validators.maxLength(5)]
    : [Validators.maxLength(7)];

  postal.setValidators(validators);
  postal.updateValueAndValidity({ onlySelf: true, emitEvent: false });
}
```

HELPFUL: 若要在執行階段動態管理驗證器，請見表單驗證指南中的[在反應式表單中動態管理驗證器](guide/forms/form-validation#managing-validators-dynamically-in-reactive-forms)一節。

## 用來縮小表單控制項型別的工具函式 {#utility-functions-for-narrowing-form-control-types}

Angular 提供四個工具函式，幫助判斷 `AbstractControl` 的具體型別。這些函式扮演**型別守衛**的角色，當它們回傳 `true` 時會縮小控制項型別，讓你能在同一個區塊中安全地存取子型別專屬的屬性。

| 工具函式 | 說明                                             |
| :--------------- | :-------------------------------------------------- |
| `isFormControl`  | 當控制項是 `FormControl` 時回傳 `true`。 |
| `isFormGroup`    | 當控制項是 `FormGroup` 時回傳 `true`    |
| `isFormRecord`   | 當控制項是 `FormRecord` 時回傳 `true`   |
| `isFormArray`    | 當控制項是 `FormArray` 時回傳 `true`    |

這些輔助函式在**自訂驗證器**中特別有用，因為函式簽名接收的是一個 `AbstractControl`，但邏輯是針對特定種類的控制項。

```ts
import {AbstractControl, isFormArray} from '@angular/forms';

export function positiveValues(control: AbstractControl) {
  if (!isFormArray(control)) {
    return null; // Not a FormArray: validator is not applicable.
  }

  // Safe to access FormArray-specific API after narrowing.
  const hasNegative = control.controls.some((c) => c.value < 0);
  return hasNegative ? {positiveValues: true} : null;
}
```

## 反應式表單 API 總覽

下表列出用來建立與管理反應式表單控制項的基礎類別與服務。
完整的語法詳情請見 [Forms 套件](api#angular_forms 'API 參考文件') 的 API 參考文件。

### 類別

| 類別             | 說明                                                                                                                                                                                 |
| :---------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `AbstractControl` | 具體表單控制項類別 `FormControl`、`FormGroup` 與 `FormArray` 的抽象基礎類別。它提供它們共有的行為與屬性。                           |
| `FormControl`     | 管理個別表單控制項的值與有效性狀態。它對應到一個 HTML 表單控制項，例如 `<input>` 或 `<select>`。                                            |
| `FormGroup`       | 管理一組 `AbstractControl` 實例的值與有效性狀態。群組的屬性包括它的子控制項。你的元件中的頂層表單就是 `FormGroup`。 |
| `FormArray`       | 管理一個以數字索引的 `AbstractControl` 實例陣列的值與有效性狀態。                                                                                     |
| `FormBuilder`     | 一個可注入的服務，提供建立控制項實例的工廠方法。                                                                                                     |
| `FormRecord`      | 追蹤一組 `FormControl` 實例的值與有效性狀態，其中每個實例都有相同的值型別。                                                                  |

### 指令

| 指令              | 說明                                                                                    |
| :--------------------- | :----------------------------------------------------------------------------------------- |
| `FormControlDirective` | 將一個獨立的 `FormControl` 實例同步到一個表單控制項元素。                       |
| `FormControlName`      | 依名稱將既有 `FormGroup` 實例中的 `FormControl` 同步到一個表單控制項元素。 |
| `FormGroupDirective`   | 將一個既有的 `FormGroup` 實例同步到一個 DOM 元素。                                   |
| `FormGroupName`        | 將一個巢狀的 `FormGroup` 實例同步到一個 DOM 元素。                                      |
| `FormArrayName`        | 將一個巢狀的 `FormArray` 實例同步到一個 DOM 元素。                                      |
| `FormArrayDirective`   | 將一個獨立的 `FormArray` 實例同步到一個 DOM 元素。                                  |
