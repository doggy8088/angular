<docs-decorative-header title="Angular 中的表單" imgSrc="adev/src/assets/images/overview.svg"> <!-- markdownlint-disable-line -->
使用表單處理使用者輸入是許多常見應用程式的基礎。
</docs-decorative-header>

應用程式使用表單讓使用者能夠登入、更新個人檔案、輸入敏感資訊，以及執行許多其他資料輸入任務。

Angular 提供兩種不同的方式來處理透過表單輸入的使用者輸入：反應式和範本驅動。
兩者都從檢視擷取使用者輸入事件，驗證使用者輸入，建立表單模型和資料模型以更新，並提供追蹤變更的方法。

本指南提供資訊，協助您決定哪種類型的表單最適合您的情況。
它介紹了兩種方法都使用的常見構件。
它還總結了這兩種方法之間的關鍵差異，並在設定、數據流和測試的背景下展示了這些差異。

## 選擇方法

Reactive forms 和 template-driven forms 以不同的方式處理和管理表單資料。
每種方法都有不同的優點。

| 表單                 | 詳細資料 |
|:---                   |:---     |
| 反應式表單        | 直接提供明確存取底層表單的物件模型。與範本驅動表單相比，它們更健全：它們更具可擴充性、可重複使用性和可測試性。如果表單是您的應用程式的主要部分，或者您已經使用反應式模式來建構您的應用程式，請使用反應式表單。                                                                                             |
| 範本驅動表單 | 仰賴範本中的指令來建立和操作底層物件模型。它們對於將簡單表單新增到應用程式很有用，例如電子郵件列表註冊表單。它們很容易新增到應用程式，但它們的可擴充性不如反應式表單。如果您有非常基本的表單需求，而且邏輯只能在範本中管理，那麼範本驅動表單可能會很適合。 |

### 主要差異

下表總結了反應式和模板驅動表單之間的主要差異。

|                                                    | 反應式                             | 模板驅動                 |
|:---                                                |:---                                  |:---                             |
| [表單模型的設定](#setting-up-the-form-model)  | 明確，在元件類別中建立 | 隱含，由指令建立 |
| [資料模型](#mutability-of-the-data-model)        | 結構化且不可變更             | 非結構化且可變更        |
| [資料流程](#data-flow-in-forms)                     | 同步                          | 非同步                    |
| [表單驗證](#form-validation)                | 函式                            | 指令                      |

### 可擴充性

如果表單是應用程式的核心部分，可擴充性非常重要。
能夠在元件之間重複使用表單模型至關重要。

Reactive 表單比範本驅動的表單更具可擴充性。
它們提供直接存取底層表單 API 的權限，並在檢視和資料模型之間使用 [同步資料流](#data-flow-in-reactive-forms)，這使得建立大規模表單變得更容易。
Reactive 表單需要較少的測試設定，測試不需要深入了解變更偵測才能正確測試表單更新和驗證。

模板驅動表單專注於簡單的場景，且無法重複使用。
它們抽象化底層表單 API，並使用介面和資料模型之間的 [非同步資料流程](#data-flow-in-template-driven-forms)。
模板驅動表單的抽象化也會影響測試。
測試高度依賴手動變更偵測執行才能正確執行，且需要更多設定。

## 設定表單模型

反應式和範本驅動的表單都會追蹤使用者互動的表單輸入元素與您元件模型中的表單資料之間的變更。
這兩種方法共用基礎的建構模組，但建立和管理一般表單控制實例的方式有所不同。

### 常見的表單基礎類別

無論是反應式還是模板驅動的表單，都是建構在以下的基本類別上。

| 基本類別           | 詳細 |
|:---                    |:---     |
| `FormControl`          | 追蹤個別表單控制項的值和驗證狀態。               |
| `FormGroup`            | 追蹤一系列表單控制項的相同值和狀態。                |
| `FormArray`            | 追蹤一系列表單控制項的相同值和狀態。                    |
| `ControlValueAccessor` | 在 Angular `FormControl` 執行個體和內建 DOM 元素之間建立橋梁。 |

### 在反應式表單中設定

使用反應式表單，您可以在元件類別中直接定義表單模型。
`[formControl]` 指令使用內部值存取器，將明確建立的 `FormControl` 執行個體連結至檢視中的特定表單元素。

以下元件使用反應式表單，為單一控制元件實作輸入欄位。
在此範例中，表單模型是 `FormControl` 實例。

<docs-code path="adev/src/content/examples/forms-overview/src/app/reactive/favorite-color/favorite-color.component.ts"/>

重要：在反應式表單中，表單模型是真實來源；它透過 `<input>` 元素上的 `[formControl]` 指令，在任何時間點提供表單元素的值和狀態。

### 在範本驅動表單中設定

在範本驅動的表單中，表單模型是隱含的，而不是明確的。
指令 `NgModel` 為給定的表單元素建立並管理 `FormControl` 實例。

以下元件使用範本驅動的表單，為單一控制項實作相同的輸入欄位。

<docs-code path="adev/src/content/examples/forms-overview/src/app/template/favorite-color/favorite-color.component.ts"/>

重要：在範本驅動的表單中，真實數據來源是範本。`NgModel` 指令會自動為您管理 `FormControl` 實例。

## 表單中的資料流

當應用程式包含表單時，Angular 必須讓檢視與元件模型同步，以及讓元件模型與檢視同步。
隨著使用者透過檢視變更值並做出選擇，新值必須反映在資料模型中。
類似地，當程式邏輯變更資料模型中的值時，那些值必須反映在檢視中。

反應式和範本驅動的表單在處理來自用戶或程式化變更的資料流動方式上有所不同。
以下的圖表說明了兩種資料流動方式，分別適用於每種類型的表單，使用上面定義的喜愛顏色輸入欄位。

### 在反應式表單中的數據流動

在反應式表單中，檢視中的每個表單元素都直接連結至表單模型（一個 `FormControl` 實例）。
從檢視到模型以及從模型到檢視的更新是同步的，而且不依賴 UI 的呈現方式。

檢視至模型圖表顯示資料如何在輸入欄位的數值從檢視透過以下步驟變更時流動。

1. 使用者在輸入元素中輸入值，在本例中為偏好的顏色 *藍色*。
1. 表單輸入元素發出包含最新值的「輸入」事件。
1. `ControlValueAccessor` 偵聽表單輸入元素上的事件，並立即將新值傳遞給 `FormControl` 實例。
1. `FormControl` 實例通過 `valueChanges` observable 發出新值。
1. `valueChanges` observable 的任何訂閱者都會收到新值。

<!-- TODO(josephperrott): enable this mermaid chart -->

```
flowchart TB
    U{User}
    I("&lt;input&gt;")
    CVA(ControlValueAccessor)
    FC(FormControl)
    O(Observers)
    U-->|Types in the input box|I
    I-->|Fires the 'input' event|CVA
    CVA-->|"Calls setValue() on the FormControl"|FC
    FC-.->|Fires a 'valueChanges' event to observers|O
```

模型至檢視圖表顯示如何將對模型的程式變更透過以下步驟傳播至檢視：

1. 使用者呼叫 `favoriteColorControl.setValue()` 方法，更新 `FormControl` 值。
1. `FormControl` 執行個體透過 `valueChanges` 可觀察物件發出新值。
1. `valueChanges` 可觀察物件的任何訂閱者都會收到新值。
1. 表單輸入元素上的控制值存取器會以新值更新元素。

<!-- TODO(josephperrott): enable this mermaid chart -->

```
flowchart TB
    U{User}
    I(&lt;input&gt;)
    CVA(ControlValueAccessor)
    FC(FormControl)
    O(Observers)
    U-->|"Calls setValue() on the FormControl"|FC
    FC-->|Notifies the ControlValueAccessor|CVA
    FC-.->|Fires a 'valueChanges' event to observers|O
    CVA-->|"Updates the value of the &lt;input&gt;"|I
```

### 在模板驅動表單中的資料流

在模板驅動的表單中，每個表單元素都連結至一個指令，該指令在內部管理表單模型。

檢視至模型圖表顯示資料如何在輸入欄位的數值從檢視透過以下步驟變更時流動。

1. 使用者在輸入元素中輸入 *藍色*。
1. 輸入元素會發出一個值為 *藍色* 的「輸入」事件。
1. 附加到輸入的控制值訪問器會觸發 `FormControl` 執行個體上的 `setValue()` 方法。
1. `FormControl` 執行個體會透過 `valueChanges` 可觀察物件發出新值。
1. `valueChanges` 可觀察物件的任何訂閱者都會收到新值。
1. 控制值訪問器也會呼叫 `NgModel.viewToModelUpdate()` 方法，此方法會發出 `ngModelChange` 事件。
1. 由於元件範本對 `favoriteColor` 屬性使用雙向資料繫結，元件中的 `favoriteColor` 屬性會更新為 `ngModelChange` 事件所發出的值（*藍色*）。

<!-- TODO(josephperrott): enable this mermaid chart -->

```
flowchart TB
    U{User}
    I(&lt;input&gt;)
    CVA(ControlValueAccessor)
    FC(FormControl)
    M(NgModel)
    O(Observers)
    C(Component)
    P(Two-way binding)
    U-->|Types in the input box|I
    I-->|Fires the 'input' event|CVA
    CVA-->|"Calls setValue() on the FormControl"|FC
    FC-.->|Fires a 'valueChanges' event to observers|O
    CVA-->|"Calls viewToModelUpdate()"|M
    M-->|Emits an ngModelChange event|C
    C-->|Updates the value of the two-way bound property|P
```

模型對檢視圖表顯示當 `favoriteColor` 從 *藍色* 變更為 *紅色* 時，資料如何從模型流向檢視圖，步驟如下：

1. 元件中更新 `favoriteColor` 值。
1. 變更偵測開始。
1. 在變更偵測期間，`ngOnChanges` 生命周期鉤子會在 `NgModel` 指令實例上呼叫，這是因為其中一個輸入的值已變更。
1. `ngOnChanges()` 方法會排隊一個非同步工作，以設定內部 `FormControl` 實例的值。
1. 變更偵測完成。
1. 在下一個勾選中，執行設定 `FormControl` 實例值的工作。
1. `FormControl` 實例透過 `valueChanges` 可觀察項發出最新值。
1. `valueChanges` 可觀察項的所有訂閱者都會收到新值。
1. 控制值存取器會使用最新的 `favoriteColor` 值更新檢視中的表單輸入元素。

<!-- TODO(josephperrott): enable this mermaid chart -->

```
flowchart TB
    C(Component)
    P(Property bound to NgModel)
    C-->|Updates the property value|P
    P-->|Triggers CD|CD1


    subgraph CD1 [First Change Detection]
        direction TB
        M(NgModel)
        FC(FormControl)

        M-->|Asynchronously sets FormControl value|FC
    end
    CD1-->|Async actions trigger a second round of Change Detection|CD2

    subgraph CD2 [Second Change Detection]
        direction TB
        FC2(FormControl)
        O(Observers)
        CVA(ControlValueAccessor)
        I("&lt;input&gt;")
        FC2-.->|Fires a 'valueChanges' event to observers|O
        O-->|ControlValueAccessor receives valueChanges event|CVA
        CVA-->|Sets the value in the control|I
    end
```

備註：`NgModel` 觸發第二次變更偵測以避免 `ExpressionChangedAfterItHasBeenChecked` 錯誤，因為值變更源於輸入繫結。

### 資料模型的可變性

變更追蹤方法在應用程式的效率中扮演一個角色。

| 表單                 | 詳細資料 |
|:---                   |:---     |
| 反應式表單        | 透過提供不變資料結構來保持資料模型的純淨。每次在資料模型上觸發變更時，`FormControl` 實例會傳回新的資料模型，而非更新現有的資料模型。這讓您可以透過控制項的可觀察物件追蹤資料模型的獨特變更。變更偵測更有效率，因為它只需要針對獨特的變更進行更新。由於資料更新遵循反應式模式，因此您可以與可觀察物件運算子整合來轉換資料。 |
| 範本驅動的表單 | 依賴具有雙向資料繫結的可變性，在範本中進行變更時更新元件中的資料模型。由於在使用雙向資料繫結時，資料模型上沒有獨特的變更可以追蹤，因此變更偵測在判斷何時需要更新時效率較低。                                                                                                                                                                                                                                 |

差異在之前的範例中顯示，使用最喜愛的顏色輸入元素。

* 使用反應式表單時，每當控制項的值更新，**`FormControl` 實例** 總是會傳回新值
* 使用範本驅動表單時，**偏好顏色屬性** 總是會修改為其新值

## 表單驗證

驗證是管理任何一組表單中不可或缺的一部分。
無論您是檢查必填欄位或查詢外部 API 以尋找現有使用者名稱，Angular 都提供一組內建驗證器，以及建立自訂驗證器的功能。

| 表單                 | 詳細資料 |
|:---                   |:---     |
| 反應型表單        | 定義自訂驗證器為接收控制項以驗證的 **函式**                                 |
| 範本驅動表單 | 與範本 **指令** 相關聯，必須提供包裝驗證函式的自訂驗證器指令 |

有關更多資訊，請參閱 [表單驗證](guide/forms/form-validation#validating-input-in-reactive-forms)。

## 測試

測試在複雜應用程式中發揮著重要作用。
驗證表單功能正常時，簡單的測試策略很有用。
反應式表單和模板驅動表單對渲染 UI 以基於表單控制和表單字段變更執行斷言具有不同的依賴性。
以下範例示範了使用反應式和模板驅動表單測試表單的過程。

### 測試反應式表單

Reactive forms 提供相對簡單的測試策略，因為它們提供同步存取權限給表單和資料模型，而且可以在不呈現 UI 的情況下進行測試。
在這些測試中，會透過控制項查詢和操作狀態與資料，而不會與變更偵測週期進行互動。

以下測試使用先前範例中的最愛顏色元件來驗證反應式表單的檢視到模型和模型到檢視資料流程。

<!--todo: 使其與其他主題一致 -->

#### 驗證檢視到模型的資料流動

以下範例執行下列步驟來驗證檢視至模型資料流程。

1. 查詢檢視表單輸入元素，並為測試建立自訂「輸入」事件。
1. 將輸入的新值設定為「紅色」，並在表單輸入元素上發送「輸入」事件。
1. 宣告元件的 `favoriteColorControl` 值與輸入值相符。

<docs-code header="Favorite color test - view to model" path="adev/src/content/examples/forms-overview/src/app/reactive/favorite-color/favorite-color.component.spec.ts" visibleRegion="view-to-model"/>

以下範例執行以下步驟以驗證模型至檢視資料流。

1. 使用 `favoriteColorControl`，一個 `FormControl` 實例，來設定新值。
1. 查詢檢視中的表單輸入元素。
1. 斷言控制元件上設定的新值與輸入中的值相符。

<docs-code header="Favorite color test - model to view" path="adev/src/content/examples/forms-overview/src/app/reactive/favorite-color/favorite-color.component.spec.ts" visibleRegion="model-to-view"/>

### 測試範本驅動表單

使用模板驅動表單撰寫測試需要深入了解變更偵測流程，並理解指令在每個週期中如何執行，以確保在正確的時間查詢、測試或變更元素。

以下測試使用先前提到的最愛顏色元件，驗證資料流從檢視到模型，以及模型到檢視以進行範本驅動的表單。

以下測試驗證資料流從檢視到模型。

<docs-code header="Favorite color test - view to model" path="adev/src/content/examples/forms-overview/src/app/template/favorite-color/favorite-color.component.spec.ts" visibleRegion="view-to-model"/>

以下是檢視中執行模型測試的步驟。

1. 向表單輸入元素查詢檢視，並為測試建立自訂「輸入」事件。
1. 將輸入的新值設定為 *紅色*，並在表單輸入元素上派送「輸入」事件。
1. 透過測試固定裝置執行變更偵測。
1. 聲明元件 `favoriteColor` 屬性值與輸入值相符。

以下測試驗證資料從模型流向檢視。

<docs-code header="Favorite color test - model to view" path="adev/src/content/examples/forms-overview/src/app/template/favorite-color/favorite-color.component.spec.ts" visibleRegion="model-to-view"/>

以下是模型執行的步驟以檢視測試。

1. 使用元件實例設定 `favoriteColor` 屬性的值。
1. 透過測試裝置執行變更偵測。
1. 使用 `tick()` 方法在 `fakeAsync()` 任務中模擬時間流逝。
1. 查詢檢視的表單輸入元素。
1. 斷言輸入值與元件實例中 `favoriteColor` 屬性的值相符。

## 後續步驟

若要進一步瞭解反應式表單，請參閱下列指南：

<docs-pill-row>
  <docs-pill href="guide/forms/reactive-forms" title="反應式表單"/>
  <docs-pill href="guide/forms/form-validation#validating-input-in-reactive-forms" title="表單驗證"/>
  <docs-pill href="guide/forms/dynamic-forms" title="動態表單"/>
</docs-pill-row>

若要深入瞭解樣板驅動表單，請參閱下列指南：

<docs-pill-row>
  <docs-pill href="guide/forms/template-driven-forms" title="範本驅動表單教學" />
  <docs-pill href="guide/forms/form-validation#validating-input-in-template-driven-forms" title="表單驗證" />
  <docs-pill href="api/forms/NgForm" title="NgForm 指令 API 參考" />
</docs-pill-row>
