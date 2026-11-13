# 反應式表單

*反應式表單*提供一種模型驅動的做法，來處理值會隨時間變化的表單輸入。本指南將說明如何建立與更新簡單的表單控制項、進而在群組中使用多個控制項、驗證表單值，以及實作更進階的表單。



{@a toc}

試試這個 <live-example title="Reactive Forms in Stackblitz">Reactive Forms live-example</live-example>。

{@a intro}

## 反應式表單簡介

反應式表單以明確且不可變的方式，管理表單在某個時間點的狀態。表單狀態的每次變更都會傳回一個新狀態，從而在變更之間維持模型的完整性。反應式表單是圍繞 observable 串流建立的，其中表單輸入與值以輸入值串流的形式提供，可同步存取。

反應式表單也提供了一條直接的測試途徑，因為當你請求資料時，可以確定資料是一致且可預測的。串流的任何取用者都可以安全地操作這些資料。

反應式表單與範本驅動表單在幾個方面明顯不同。反應式表單提供對資料模型的同步存取所帶來的更高可預測性、透過 observable 運算子的不可變性，以及透過 observable 串流進行的變更追蹤。如果你偏好直接存取來修改範本中的資料，範本驅動表單比較不明確，因為它們依賴嵌入範本中的指令，以及可變資料來非同步追蹤變更。請參閱[表單簡介](guide/forms-overview)，了解兩種範式的詳細比較。

## 開始使用

本節說明如何加入單一表單控制項。在這個範例中，使用者將姓名輸入到輸入欄位，擷取該輸入值，並顯示表單控制項元素的目前值。

### 步驟 1：註冊反應式表單模組

若要使用反應式表單，請從 `@angular/forms` 套件匯入 `ReactiveFormsModule`，並將它加入 NgModule 的 `imports` 陣列。

<code-example path="reactive-forms/src/app/app.module.ts" region="imports" header="src/app/app.module.ts (excerpt)"></code-example>

### 步驟 2：產生並匯入新的表單控制項

為控制項產生一個元件。

<code-example language="sh" class="code-shell">

  ng generate component NameEditor

</code-example>

`FormControl` 類別是使用反應式表單時的基本建構區塊。若要註冊單一表單控制項，請將 `FormControl` 類別匯入你的元件，並建立一個新的表單控制項執行個體，儲存為類別屬性。

<code-example path="reactive-forms/src/app/name-editor/name-editor.component.ts" region="create-control" header="src/app/name-editor/name-editor.component.ts"></code-example>

使用 `FormControl` 的建構子設定其初始值，在這個例子中是空字串。透過在元件類別中建立這些控制項，你可以立即存取，以監聽、更新與驗證表單輸入的狀態。

### 步驟 3：在範本中註冊控制項

在元件類別中建立控制項之後，你必須將它與範本中的表單控制項元素關聯起來。使用 `FormControlDirective` 提供的 `formControl` 繫結來更新範本中的表單控制項，`FormControlDirective` 包含在 `ReactiveFormsModule` 中。

<code-example path="reactive-forms/src/app/name-editor/name-editor.component.html" region="control-binding" header="src/app/name-editor/name-editor.component.html"></code-example>

<div class="alert is-helpful">

**注意：** 如需 `ReactiveFormsModule` 所提供的類別與指令的更詳細清單，請參閱[反應式表單 API](#reactive-forms-api)一節。

</div>

使用範本繫結語法，表單控制項現在已註冊到範本中的 `name` 輸入元素。表單控制項與 DOM 元素彼此溝通：檢視反映模型的變更，模型也反映檢視的變更。

#### 顯示元件

當元件加入範本時，指派給 `name` 的表單控制項就會顯示出來。

<code-example path="reactive-forms/src/app/app.component.1.html" region="app-name-editor" header="src/app/app.component.html (name editor)"></code-example>

<figure class="lightbox">
  <div class="card">
    <img src="generated/images/guide/reactive-forms/name-editor-1.png" alt="名稱編輯器">
  </div>
</figure>

## 管理控制項值

反應式表單讓你存取表單控制項在某個時間點的狀態與值。你可以透過元件類別或元件範本操作目前的狀態與值。下列範例顯示表單控制項執行個體的值，並變更它。

{@a display-value}

### 顯示表單控制項值

你可以透過下列方式顯示值：

* 透過 `valueChanges` observable，你可以在範本中使用 `AsyncPipe`，或在元件類別中使用 `subscribe()` 方法，監聽表單值的變更。
* 使用 `value` 屬性，它會提供目前值的快照。

下列範例說明如何使用範本中的插值顯示目前值。

<code-example path="reactive-forms/src/app/name-editor/name-editor.component.html" region="display-value" header="src/app/name-editor/name-editor.component.html (control value)"></code-example>

當你更新表單控制項元素時，顯示的值也會跟著改變。

反應式表單透過每個執行個體提供的屬性與方法，讓你存取特定控制項的資訊。底層 [AbstractControl](api/forms/AbstractControl) 類別的這些屬性與方法，用於控制表單狀態，並決定在處理驗證時何時顯示訊息。如需更多資訊，請參閱本指南後面的[簡單表單驗證](#簡單表單驗證)一節。

其他 `FormControl` 屬性與方法，請參閱[反應式表單 API](#reactive-forms-api)一節。

### 取代表單控制項值

反應式表單有以程式方式變更控制項值的方法，讓你能靈活地更新值，而不需要使用者互動。表單控制項執行個體提供 `setValue()` 方法，可更新表單控制項的值，並根據控制項的結構驗證所提供值的結構。例如，當從後端 API 或服務擷取表單資料時，請使用 `setValue()` 方法將控制項更新為新值，完整取代舊值。

下列範例在元件類別中加入一個方法，使用 `setValue()` 方法將控制項的值更新為 *Nancy*。

<code-example path="reactive-forms/src/app/name-editor/name-editor.component.ts" region="update-value" header="src/app/name-editor/name-editor.component.ts (update value)">

</code-example>

更新範本，加入一個按鈕來模擬姓名更新。當你點選 **Update Name** 按鈕時，表單控制項元素中輸入的值會反映為其目前值。

<code-example path="reactive-forms/src/app/name-editor/name-editor.component.html" region="update-value" header="src/app/name-editor/name-editor.component.html (update value)"></code-example>

表單模型是控制項的真相來源，因此當你點選按鈕時，輸入的值會在元件類別內變更，覆寫其目前值。

<figure class="lightbox">
  <div class="card">
    <img src="generated/images/guide/reactive-forms/name-editor-2.png" alt="名稱編輯器更新">
  </div>
</figure>

<div class="alert is-helpful">

**注意：** 在這個範例中，你使用的是單一控制項。當對表單群組或表單陣列執行個體使用 `setValue()` 方法時，值必須符合群組或陣列的結構。

</div>

## 將表單控制項分組

就像表單控制項執行個體讓你控制單一輸入欄位一樣，表單群組執行個體會追蹤一組表單控制項執行個體（例如一個表單）的表單狀態。建立表單群組時，表單群組執行個體中的每個控制項都會依名稱追蹤。下列範例說明如何在單一群組中管理多個表單控制項執行個體。

產生一個 `ProfileEditor` 元件，並從 `@angular/forms` 套件匯入 `FormGroup` 與 `FormControl` 類別。

<code-example language="sh" class="code-shell">

  ng generate component ProfileEditor

</code-example>

<code-example path="reactive-forms/src/app/profile-editor/profile-editor.component.1.ts" region="imports" header="src/app/profile-editor/profile-editor.component.ts (imports)">

</code-example>

### 步驟 1：建立 FormGroup 執行個體

在元件類別中建立一個名為 `profileForm` 的屬性，並將該屬性設為新的表單群組執行個體。若要初始化表單群組，請提供建構子一個物件，其中的具名鍵對應到各自的控制項。

對於個人檔案表單，請加入兩個名稱為 `firstName` 與 `lastName` 的表單控制項執行個體。

<code-example path="reactive-forms/src/app/profile-editor/profile-editor.component.1.ts" region="formgroup" header="src/app/profile-editor/profile-editor.component.ts (form group)">

</code-example>

個別的表單控制項現在已收集在一個群組中。`FormGroup` 執行個體會將其模型值提供為一個物件，該物件是從群組中每個控制項的值歸納而來。表單群組執行個體具有與表單控制項執行個體相同的屬性（例如 `value` 與 `untouched`）與方法（例如 `setValue()`）。

### 步驟 2：關聯 FormGroup 模型與檢視

表單群組會追蹤其每個控制項的狀態與變更，因此如果其中一個控制項變更，父控制項也會發出新的狀態或值變更。群組的模型由其成員維護。定義模型之後，你必須更新範本，讓檢視反映該模型。

<code-example path="reactive-forms/src/app/profile-editor/profile-editor.component.1.html" region="formgroup" header="src/app/profile-editor/profile-editor.component.html (template form group)"></code-example>

請注意，就像表單群組包含一組控制項一樣，*profile form* `FormGroup` 會透過 `FormGroup` 指令繫結到 `form` 元素，在模型與包含輸入的表單之間建立溝通層。`FormControlName` 指令提供的 `formControlName` 輸入，會將每個個別輸入繫結到 `FormGroup` 中定義的表單控制項。表單控制項會與各自的元素溝通，也會將變更傳達給表單群組執行個體，後者提供模型值的真相來源。

### 儲存表單資料

`ProfileEditor` 元件接受使用者的輸入，但在實際情境中，你會想擷取表單值，並提供給元件外部進一步處理。`FormGroup` 指令會監聽 `form` 元素發出的 `submit` 事件，並發出你可以繫結到回呼函式的 `ngSubmit` 事件。

請在 `form` 標籤中加入 `ngSubmit` 事件監聽器，搭配 `onSubmit()` 回呼方法。

<code-example path="reactive-forms/src/app/profile-editor/profile-editor.component.html" region="ng-submit" header="src/app/profile-editor/profile-editor.component.html (submit event)"></code-example>

`ProfileEditor` 元件中的 `onSubmit()` 方法會擷取 `profileForm` 的目前值。使用 `EventEmitter` 保持表單封裝，並將表單值提供給元件外部。下列範例使用 `console.warn` 將訊息記錄到瀏覽器主控台。

<code-example path="reactive-forms/src/app/profile-editor/profile-editor.component.ts" region="on-submit" header="src/app/profile-editor/profile-editor.component.ts (submit method)">

</code-example>

`submit` 事件由 `form` 標籤使用原生 DOM 事件發出。你可以點選 `submit` 類型的按鈕來觸發此事件。這讓使用者可以按下 **Enter** 鍵提交已填寫的表單。

使用 `button` 元素在表單底部加入按鈕，以觸發表單提交。

<code-example path="reactive-forms/src/app/profile-editor/profile-editor.component.html" region="submit-button" header="src/app/profile-editor/profile-editor.component.html (submit button)"></code-example>

<div class="alert is-helpful">

**注意：** 上面程式碼片段中的按鈕也附加了 `disabled` 繫結，可在 `profileForm` 無效時停用按鈕。你尚未執行任何驗證，因此按鈕一律為啟用狀態。簡單表單驗證會在[簡單表單驗證](#簡單表單驗證)一節中說明。

</div>

#### 顯示元件

若要顯示包含表單的 `ProfileEditor` 元件，請將它加入元件範本。

<code-example path="reactive-forms/src/app/app.component.1.html" region="app-profile-editor" header="src/app/app.component.html (profile editor)"></code-example>

`ProfileEditor` 讓你管理表單群組執行個體中 `firstName` 與 `lastName` 控制項的表單控制項執行個體。

<figure class="lightbox">
  <div class="card">
    <img src="generated/images/guide/reactive-forms/profile-editor-1.png" alt="個人檔案編輯器">
  </div>
</figure>

## 建立巢狀表單群組

建立複雜表單時，以較小的區段管理不同的資訊領域會比較容易，而且某些資訊群組自然屬於同一個群組。使用巢狀表單群組執行個體，可以把大型表單群組拆成更小、更容易管理的群組。

### 步驟 1：建立巢狀群組

地址是可以分組在一起的資訊的良好範例。表單群組可以同時接受表單控制項與表單群組執行個體作為子項。這讓組合複雜的表單模型更容易維護，並能以合乎邏輯的方式分組。若要在 `profileForm` 中建立巢狀群組，請在表單群組執行個體中加入巢狀的 `address` 元素。

<code-example path="reactive-forms/src/app/profile-editor/profile-editor.component.1.ts" region="nested-formgroup" header="src/app/profile-editor/profile-editor.component.ts (nested form group)"></code-example>

在這個範例中，`address group` 將現有的 `firstName` 與 `lastName` 控制項，與新的 `street`、`city`、`state` 與 `zip` 控制項結合在一起。即使表單群組中的 `address` 元素是表單群組中整體 `profileForm` 元素的子項，值與狀態變更的規則仍然相同。巢狀表單群組的狀態與值變更會傳播到父表單群組，維持與整體模型的一致性。

### 步驟 2：在範本中將巢狀表單分組

更新元件類別中的模型之後，請更新範本以連結表單群組執行個體及其輸入元素。

將包含 `street`、`city`、`state` 與 `zip` 欄位的 `address` 表單群組加入 `ProfileEditor` 範本。

<code-example path="reactive-forms/src/app/profile-editor/profile-editor.component.1.html" region="formgroupname" header="src/app/profile-editor/profile-editor.component.html (template nested form group)"></code-example>

`ProfileEditor` 表單顯示為一個群組，但模型會進一步細分，以表示邏輯分組的領域。

<figure class="lightbox">
  <div class="card">
    <img src="generated/images/guide/reactive-forms/profile-editor-2.png" alt="個人檔案編輯器更新">
  </div>
</figure>

<div class="alert is-helpful">

**注意：** 使用 `value` 屬性與 `JsonPipe`，在元件範本中顯示表單群組執行個體的值。

</div>

## 模型的部分更新

更新包含多個控制項的表單群組執行個體的值時，你可能只想更新模型的部分內容。本節說明如何更新表單控制項資料模型的特定部分。

### 補綴模型值

更新模型值有兩種方式：

* 使用 `setValue()` 方法為個別控制項設定新值。`setValue()` 方法會嚴格遵循表單群組的結構，並取代該控制項的整個值。

* 使用 `patchValue()` 方法取代物件中已定義、且在表單模型中已變更的任何屬性。

`setValue()` 方法的嚴格檢查有助於在複雜表單中抓出巢狀錯誤，而 `patchValue()` 遇到這類錯誤時則會靜默失敗。

在 `ProfileEditorComponent` 中，請使用 `updateProfile` 方法搭配下列範例，更新使用者的名字與街道地址。

<code-example path="reactive-forms/src/app/profile-editor/profile-editor.component.1.ts" region="patch-value" header="src/app/profile-editor/profile-editor.component.ts (patch value)">

</code-example>

模擬按需更新，請在範本中加入一個按鈕，在需要時更新使用者個人檔案。

<code-example path="reactive-forms/src/app/profile-editor/profile-editor.component.1.html" region="patch-value" header="src/app/profile-editor/profile-editor.component.html (update value)"></code-example>

當使用者點選按鈕時，`profileForm` 模型會以 `firstName` 與 `street` 的新值更新。請注意，`street` 是在 `address` 屬性內的物件中提供的。這是必要的，因為 `patchValue()` 方法會根據模型結構套用更新。`PatchValue()` 只會更新表單模型所定義的屬性。

## 以 FormBuilder 產生表單控制項

處理多個表單時，手動建立表單控制項執行個體可能會變得重複而繁瑣。`FormBuilder` 服務提供了產生控制項的便利方法。

下列一節將重構 `ProfileEditor` 元件，改用表單建構器服務來建立表單控制項與表單群組執行個體。

### 步驟 1：匯入 FormBuilder 類別

從 `@angular/forms` 套件匯入 `FormBuilder` 類別。

<code-example path="reactive-forms/src/app/profile-editor/profile-editor.component.2.ts" region="form-builder-imports" header="src/app/profile-editor/profile-editor.component.ts (import)">

</code-example>

### 步驟 2：注入 FormBuilder 服務

`FormBuilder` 服務是隨反應式表單模組一起提供的可注入提供者。請將這個相依性加入元件建構子來注入它。

<code-example path="reactive-forms/src/app/profile-editor/profile-editor.component.2.ts" region="inject-form-builder" header="src/app/profile-editor/profile-editor.component.ts (constructor)">

</code-example>

### 步驟 3：產生表單控制項

`FormBuilder` 服務有三個方法：`control()`、`group()` 與 `array()`。這些是工廠方法，可在元件類別中產生執行個體，包括表單控制項、表單群組與表單陣列。

使用 `group` 方法建立 `profileForm` 控制項。

<code-example path="reactive-forms/src/app/profile-editor/profile-editor.component.2.ts" region="form-builder" header="src/app/profile-editor/profile-editor.component.ts (form builder)">

</code-example>

在上述範例中，你使用 `group()` 方法搭配相同的物件來定義模型中的屬性。每個控制項名稱的值都是一個陣列，陣列的第一個項目是初始值。

<div class="alert is-helpful">

**注意：** 你可以只用初始值來定義控制項，但如果控制項需要同步或非同步驗證，請把同步與非同步驗證器分別加為陣列的第二與第三個項目。

</div>

請比較使用表單建構器與手動建立執行個體的做法。

<code-tabs>

  <code-pane path="reactive-forms/src/app/profile-editor/profile-editor.component.1.ts" region="formgroup-compare" header="src/app/profile-editor/profile-editor.component.ts (instances)">

  </code-pane>

  <code-pane path="reactive-forms/src/app/profile-editor/profile-editor.component.2.ts" region="formgroup-compare" header="src/app/profile-editor/profile-editor.component.ts (form builder)">

  </code-pane>

</code-tabs>

## 簡單表單驗證

*表單驗證*是用於驗證使用者輸入，以確保其完整且正確。本節說明如何為表單控制項加入單一驗證器，並顯示整體表單狀態。[表單驗證](guide/form-validation)指南中有更廣泛的表單驗證說明。

### 步驟 1：匯入驗證器函式

反應式表單包含一組適用於常見使用案例的驗證器函式。這些函式會接收一個要驗證的控制項，並根據驗證檢查傳回錯誤物件或 null 值。

請從 `@angular/forms` 套件匯入 `Validators` 類別。

<code-example path="reactive-forms/src/app/profile-editor/profile-editor.component.ts" region="validator-imports" header="src/app/profile-editor/profile-editor.component.ts (import)">

</code-example>

### 步驟 2：將欄位設為必填

最常見的驗證是將欄位設為必填。本節說明如何為 `firstName` 控制項加入必填驗證。

在 `ProfileEditor` 元件中，將 `Validators.required` 靜態方法加為 `firstName` 控制項陣列中的第二個項目。

<code-example path="reactive-forms/src/app/profile-editor/profile-editor.component.ts" region="required-validator" header="src/app/profile-editor/profile-editor.component.ts (required validator)">

</code-example>

HTML5 有一組可用於原生驗證的內建屬性，包括 `required`、`minlength` 與 `maxlength`。你可以利用表單輸入元素上的這些選擇性屬性。在 `firstName` 輸入元素上加入 `required` 屬性。

<code-example path="reactive-forms/src/app/profile-editor/profile-editor.component.html" region="required-attribute" header="src/app/profile-editor/profile-editor.component.html (required attribute)"></code-example>

<div class="alert is-important">

**注意：** 請將這些 HTML5 驗證屬性*與* Angular 反應式表單提供的內建驗證器合併使用。合併使用可以防止在範本檢查完畢後運算式變更時發生錯誤。

</div>

### 顯示表單狀態

當你為表單控制項加入必填欄位時，其初始狀態為無效。這個無效狀態會傳播到父表單群組元素，使其狀態也變為無效。透過表單群組執行個體的 `status` 屬性存取其目前狀態。

使用插值顯示 `profileForm` 的目前狀態。

<code-example path="reactive-forms/src/app/profile-editor/profile-editor.component.html" region="display-status" header="src/app/profile-editor/profile-editor.component.html (display status)"></code-example>

<figure class="lightbox">
  <div class="card">
    <img src="generated/images/guide/reactive-forms/profile-editor-3.png" alt="個人檔案編輯器驗證">
  </div>
</figure>

**Submit** 按鈕處於停用狀態，因為 `profileForm` 受到必填的 `firstName` 表單控制項影響而無效。填寫 `firstName` 輸入後，表單就會變為有效，**Submit** 按鈕也會啟用。

如需進一步了解表單驗證，請參閱[表單驗證](guide/form-validation)指南。

## 使用表單陣列的動態控制項

`FormArray` 是 `FormGroup` 的替代方案，用於管理任意數量的未具名控制項。與表單群組執行個體一樣，你可以動態地在表單陣列執行個體中插入與移除控制項，而表單陣列執行個體的值與驗證狀態是根據其子控制項計算而得。不過，你不需要為每個控制項依名稱定義鍵，因此如果你事先不知道子值的數量，這是個很好的選擇。下列範例說明如何在 `ProfileEditor` 中管理 *aliases* 陣列。

### 步驟 1：匯入 FormArray 類別

從 `@angular/forms` 匯入 `FormArray` 類別，以用於型別資訊。`FormBuilder` 服務已準備好建立 `FormArray` 執行個體。

<code-example path="reactive-forms/src/app/profile-editor/profile-editor.component.2.ts" region="form-array-imports" header="src/app/profile-editor/profile-editor.component.ts (import)">

</code-example>

### 步驟 2：定義 FormArray 控制項

你可以透過在陣列中定義控制項，以任意數量的控制項（從零到多個）初始化表單陣列。請在 `profileForm` 的表單群組執行個體中加入 `aliases` 屬性，以定義表單陣列。

使用 `FormBuilder.array()` 方法定義陣列，並使用 `FormBuilder.control()` 方法以初始控制項填入陣列。

<code-example path="reactive-forms/src/app/profile-editor/profile-editor.component.ts" region="aliases" header="src/app/profile-editor/profile-editor.component.ts (aliases form array)">

</code-example>

表單群組執行個體中的 aliases 控制項目前已填入單一控制項，直到動態加入更多控制項為止。

### 步驟 3：存取 FormArray 控制項

與重複使用 `profileForm.get()` 方法取得每個執行個體相比，getter 可以輕鬆存取表單陣列執行個體中的 aliases。表單陣列執行個體表示陣列中數量不確定的控制項。透過 getter 存取控制項很方便，而且這個方法很容易為其他控制項重複使用。

使用 getter 語法建立 `aliases` 類別屬性，從父表單群組擷取 alias 的表單陣列控制項。

<code-example path="reactive-forms/src/app/profile-editor/profile-editor.component.ts" region="aliases-getter" header="src/app/profile-editor/profile-editor.component.ts (aliases getter)">

</code-example>

<div class="alert is-helpful">

**注意：** 由於傳回的控制項屬於 `AbstractControl` 型別，你需要提供明確的型別，才能存取表單陣列執行個體的方法語法。

</div>

定義一個方法，將 alias 控制項動態插入 alias 的表單陣列。`FormArray.push()` 方法會將控制項作為新項目插入陣列。

<code-example path="reactive-forms/src/app/profile-editor/profile-editor.component.ts" region="add-alias" header="src/app/profile-editor/profile-editor.component.ts (add alias)">

</code-example>

在範本中，每個控制項會顯示為個別的輸入欄位。

### 步驟 4：在範本中顯示表單陣列

若要將表單模型中的 aliases 附加到範本，你必須將它加入範本。與 `FormGroupNameDirective` 提供的 `formGroupName` 輸入類似，`formArrayName` 會透過 `FormArrayNameDirective` 將表單陣列執行個體與範本之間的溝通繫結起來。

請在關閉 `formGroupName` 元素的 `<div>` 之後，加入下面的範本 HTML。

<code-example path="reactive-forms/src/app/profile-editor/profile-editor.component.html" region="formarrayname" header="src/app/profile-editor/profile-editor.component.html (aliases form array template)"></code-example>

`*ngFor` 指令會逐一遍歷 aliases 表單陣列執行個體提供的每個表單控制項執行個體。由於表單陣列元素是未具名的，你將索引指派給 `i` 變數，並傳給每個控制項，以將它繫結到 `formControlName` 輸入。

<figure class="lightbox">
  <div class="card">
    <img src="generated/images/guide/reactive-forms/profile-editor-4.png" alt="個人檔案編輯器別名">
  </div>
</figure>

每次加入新的 alias 執行個體時，新的表單陣列執行個體就會根據索引取得其控制項。這讓你在計算根控制項的狀態與值時，可以追蹤每個個別控制項。

#### 加入 alias

最初，表單包含一個 `Alias` 欄位。若要加入另一個欄位，請點選 **Add Alias** 按鈕。你也可以驗證範本底部 `Form Value` 所顯示、由表單模型回報的 aliases 陣列。

<div class="alert is-helpful">

**注意：** 除了為每個 alias 使用表單控制項執行個體之外，你也可以組合另一個帶有其他欄位的表單群組執行個體。為每個項目定義控制項的流程相同。

</div>

{@a appendix}

## 附錄

{@a reactive-forms-api}

### 反應式表單 API

下列列出用於建立與管理表單控制項的基礎類別與服務。

#### 類別

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

      具體表單控制項類別 `FormControl`、`FormGroup` 與 `FormArray` 的抽象基礎類別。它提供這些類別共通的行為與屬性。

    </td>

  </tr>

  <tr>

    <td style="vertical-align: top">
      <code>FormControl</code>
    </td>

    <td>

      管理個別表單控制項的值與有效性狀態。它對應到 HTML 表單控制項，例如 `<input>` 或 `<select>`。

    </td>

  </tr>

  <tr>

    <td style="vertical-align: top">
      <code>FormGroup</code>
    </td>

    <td>

      管理一組 `AbstractControl` 執行個體的值與有效性狀態。群組的屬性包括其子控制項。元件中的頂層表單就是 `FormGroup`。

    </td>

  </tr>

  <tr>

    <td style="vertical-align: top">
      <code>FormArray</code>
    </td>

    <td>

    管理一個以數字索引的 `AbstractControl` 執行個體陣列的值與有效性狀態。

    </td>

  </tr>

  <tr>

    <td style="vertical-align: top">
      <code>FormBuilder</code>
    </td>

    <td>

      可注入的服務，提供建立控制項執行個體的工廠方法。

    </td>

  </tr>

</table>

#### 指令

<table>

  <tr>

    <th>
      指令
    </th>

    <th>
      說明
    </th>

  </tr>

  <tr>

    <td style="vertical-align: top">
      <code>FormControlDirective</code>
    </td>

    <td>

      將獨立的 `FormControl` 執行個體同步到表單控制項元素。

    </td>

  </tr>

  <tr>

    <td style="vertical-align: top">
      <code>FormControlName</code>
    </td>

    <td>

      依名稱將現有 `FormGroup` 執行個體中的 `FormControl` 同步到表單控制項元素。

    </td>

  </tr>

  <tr>

    <td style="vertical-align: top">
      <code>FormGroupDirective</code>
    </td>

    <td>

      將現有的 `FormGroup` 執行個體同步到 DOM 元素。

    </td>

  </tr>

  <tr>

    <td style="vertical-align: top">
      <code>FormGroupName</code>
    </td>

    <td>

      將巢狀的 `FormGroup` 執行個體同步到 DOM 元素。

    </td>

  </tr>

  <tr>

    <td style="vertical-align: top">
      <code>FormArrayName</code>
    </td>

    <td>

      將巢狀的 `FormArray` 執行個體同步到 DOM 元素。

    </td>

  </tr>

</table>
