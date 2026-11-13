# Angular 表單簡介

使用表單處理使用者輸入，是許多常見應用程式的基石。應用程式使用表單讓使用者登入、更新個人檔案、輸入敏感資訊，以及執行許多其他資料輸入任務。

Angular 提供兩種處理表單使用者輸入的做法：反應式與範本驅動。兩者都會從 view 擷取使用者輸入事件、驗證使用者輸入、建立要更新的表單模型與資料模型，並提供追蹤變更的方式。

本指南提供的資訊能幫助你決定哪種類型的表單最適合你的情況。它介紹了兩種做法共用的基礎建構塊，也彙整了兩種做法的關鍵差異，並在設定、資料流與測試的脈絡中示範這些差異。

## 必要條件

本指南假設你對下列主題具備基本認識。

*   [TypeScript](https://www.typescriptlang.org/ "The TypeScript language") 與 HTML5 程式設計
*   [Angular 概念](guide/architecture "Introduction to Angular concepts")所述的 Angular 應用程式設計基礎
*   [Angular 範本語法](guide/architecture-components#範本語法 "Template syntax intro")的基礎

## 選擇做法

反應式表單與範本驅動表單以不同的方式處理與管理表單資料。
每種方法都提供不同的優勢。

| 表單                 | 說明                                                                                                                                                                                                                                                                                                                                                                                                             |
| :-------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 反應式表單        | 直接、明確地存取底層表單的物件模型。與範本驅動表單相比，它們更強健：更具可擴展性、可重用性與可測試性。如果表單是你應用程式的關鍵部分，或者你已經在使用反應式模式來建置應用程式，請使用反應式表單。                                                                                            |
| 範本驅動表單 | 依賴範本中的指令來建立與操作底層物件模型。它們適合用來為應用程式加入一個簡單的表單，例如電子郵件清單註冊表單。它們很容易加入應用程式，但擴展性不如反應式表單。如果你的表單需求非常基本，而且邏輯可以完全在範本中管理，範本驅動表單可能是個不錯的選擇。 |

### 關鍵差異

下表彙整了反應式表單與範本驅動表單之間的關鍵差異。

|                                             | 反應式                             | 範本驅動 |
|:---                                         |:---                                  |:---             |
| [設定表單模型](#setup)               | 明確，在元件類別中建立 | 隱含，由指令建立 |
| [資料模型](#資料模型的可變性) | 結構化且不可變             | 非結構化且可變        |
| [資料流](#表單中的資料流)            | 同步                          | 非同步                    |
| [表單驗證](#validation)              | 函式                            | 指令                      |

### 可擴展性

如果表單是你應用程式的核心部分，可擴展性就非常重要。
能夠在多個元件之間重用表單模型至關重要。

反應式表單比範本驅動表單更具可擴展性。
它們直接存取底層表單 API，並在 view 與資料模型之間使用[同步資料流](#反應式表單中的資料流)，讓建立大規模表單更容易。
反應式表單所需的測試設定較少，而且測試不需要深入了解變更偵測，就能正確測試表單更新與驗證。

範本驅動表單著重於簡單情境，重用性較低。
它們抽象化了底層表單 API，並在 view 與資料模型之間使用[非同步資料流](#範本驅動表單中的資料流)。
範本驅動表單的這種抽象化也影響到測試。
測試深深依賴手動執行變更偵測才能正確運作，而且需要更多設定。

<a id="setup"></a>

## 設定表單模型

反應式表單與範本驅動表單都會追蹤表單輸入元素（使用者與之互動）與元件模型中表單資料之間的值變更。
這兩種方法共用底層建構塊，但在建立與管理共用表單控制項實例的方式上有所不同。

### 共用的表單基礎類別

反應式表單與範本驅動表單都建立在下列基礎類別之上。

| 基礎類別           | 說明                                                                             |
| :--------------------- | :---------------------------------------------------------------------------------- |
| `FormControl`          | 追蹤個別表單控制項的值與驗證狀態。               |
| `FormGroup`            | 追蹤一組表單控制項相同的值與狀態。                |
| `FormArray`            | 追蹤一個表單控制項陣列相同的值與狀態。                    |
| `ControlValueAccessor` | 在 Angular `FormControl` 實例與內建 DOM 元素之間建立橋樑。 |

<a id="setup-the-form-model"></a>

### 在反應式表單中設定

使用反應式表單時，你直接在元件類別中定義表單模型。
`[formControl]` 指令使用內部的控制項值存取器，將明確建立的 `FormControl` 實例連結到 view 中的特定表單元素。

下列元件使用反應式表單，實作了一個只有單一控制項的輸入欄位。
在這個範例中，表單模型就是 `FormControl` 實例。

<code-example path="forms-overview/src/app/reactive/favorite-color/favorite-color.component.ts"></code-example>

圖 1 顯示在反應式表單中，表單模型就是真相來源；它透過輸入元素上的 `[formControl]` 指令，在任何時間點提供表單元素的值與狀態。

<!--todo: make consistent with other topics -->

**圖 1。** *直接存取反應式表單中的表單模型。*

<div class="lightbox">

<img alt="反應式表單的主要差異" src="generated/images/guide/forms-overview/key-diff-reactive-forms.png">

</div>

### 在範本驅動表單中設定

在範本驅動表單中，表單模型是隱含的，而不是明確的。
`NgModel` 指令為指定的表單元素建立並管理一個 `FormControl` 實例。

下列元件使用範本驅動表單，實作了同一個只有單一控制項的輸入欄位。

<code-example path="forms-overview/src/app/template/favorite-color/favorite-color.component.ts"></code-example>

在範本驅動表單中，真相來源是範本。如圖 2 所示，你無法以程式直接存取 `FormControl` 實例。

<!--todo: make consistent with other topics -->

**圖 2。** *間接存取範本驅動表單中的表單模型。*

<div class="lightbox">

<img alt="範本驅動表單的主要差異" src="generated/images/guide/forms-overview/key-diff-td-forms.png">

</div>

<a id="data-flow-in-forms"></a>

## 表單中的資料流

當應用程式包含表單時，Angular 必須讓 view 與元件模型保持同步，也讓元件模型與 view 保持同步。
當使用者透過 view 變更值與做出選擇時，新值必須反映在資料模型中。
同樣地，當程式邏輯變更資料模型中的值時，這些值也必須反映在 view 中。

反應式表單與範本驅動表單在處理來自使用者或程式化變更的資料流時，方式有所不同。
下列圖表使用前面定義的最愛顏色輸入欄位，說明每種類型表單的兩種資料流。

<a id="data-flow-in-reactive-forms"></a>

### 反應式表單中的資料流

在反應式表單中，view 裡的每個表單元素都直接連結到表單模型（一個 `FormControl` 實例）。從 view 到模型、從模型到 view 的更新都是同步的，不受 UI 算繪方式影響。

view 到模型的圖表顯示，當輸入欄位的值從 view 變更時，資料如何透過下列步驟流動。

1.  使用者在輸入元素中輸入一個值，在這個例子中是最愛顏色 *Blue*。
1.  表單輸入元素以最新值發出一個 "input" 事件。
1.  監聽表單輸入元素事件的控制項值存取器，立即把新值傳遞給 `FormControl` 實例。
1.  `FormControl` 實例透過 `valueChanges` observable 發出新值。
1.  `valueChanges` observable 的所有訂閱者都會收到新值。

<div class="lightbox">

<img alt="反應式表單資料流程：檢視到模型" src="generated/images/guide/forms-overview/dataflow-reactive-forms-vtm.png">

</div>

模型到 view 的圖表顯示，程式化的模型變更如何透過下列步驟傳播到 view。

1. 使用者呼叫 `favoriteColorControl.setValue()` 方法，更新 `FormControl` 的值。
1. `FormControl` 實例透過 `valueChanges` observable 發出新值。
1. `valueChanges` observable 的所有訂閱者都會收到新值。
1. 表單輸入元素上的控制項值存取器以新值更新該元素。

<div class="lightbox">

<img alt="反應式表單資料流程：模型到檢視" src="generated/images/guide/forms-overview/dataflow-reactive-forms-mtv.png">

</div>

<a id="data-flow-in-template-driven-forms"></a>

### 範本驅動表單中的資料流

在範本驅動表單中，每個表單元素都連結到一個在內部管理表單模型的指令。

view 到模型的圖表顯示，當輸入欄位的值從 view 變更時，資料如何透過下列步驟流動。

1. 使用者在輸入元素中輸入 *Blue*。
1. 輸入元素以 *Blue* 這個值發出一個 "input" 事件。
1. 附著在輸入上的控制項值存取器觸發 `FormControl` 實例的 `setValue()` 方法。
1. `FormControl` 實例透過 `valueChanges` observable 發出新值。
1. `valueChanges` observable 的所有訂閱者都會收到新值。
1. 控制項值存取器也呼叫 `NgModel.viewToModelUpdate()` 方法，該方法發出一個 `ngModelChange` 事件。
1. 由於元件範本對 `favoriteColor` 屬性使用雙向資料繫結，元件中的 `favoriteColor` 屬性會被更新為 `ngModelChange` 事件所發出的值（*Blue*）。

<div class="lightbox">

<img alt="範本驅動表單資料流程：檢視到模型" width="100%" src="generated/images/guide/forms-overview/dataflow-td-forms-vtm.png">

</div>

模型到 view 的圖表顯示，當 `favoriteColor` 從 *Blue* 變成 *Red* 時，資料如何透過下列步驟從模型流向 view

1. 元件中的 `favoriteColor` 值被更新。
1. 變更偵測開始。
1. 在變更偵測期間，由於 `NgModel` 指令實例的某個輸入值已變更，會呼叫它的 `ngOnChanges` 生命週期 hook。
1. `ngOnChanges()` 方法排入一個非同步工作，為內部的 `FormControl` 實例設定值。
1. 變更偵測完成。
1. 在下一個 tick，該工作執行，為 `FormControl` 實例設定值。
1. `FormControl` 實例透過 `valueChanges` observable 發出最新值。
1. `valueChanges` observable 的所有訂閱者都會收到新值。
1. 控制項值存取器以最新的 `favoriteColor` 值更新 view 中的表單輸入元素。

<div class="lightbox">

<img alt="範本驅動表單資料流程：模型到檢視" width="100%" src="generated/images/guide/forms-overview/dataflow-td-forms-mtv.png">

</div>

<a id="mutability-of-the-data-model"></a>

### 資料模型的可變性

變更追蹤方法在應用程式的效率上扮演重要角色。

| 表單                 | 說明                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| :-------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 反應式表單        | 以不可變的資料結構提供資料模型，讓它保持純粹。每當資料模型被觸發變更時，`FormControl` 實例會回傳一個新的資料模型，而不是更新既有的資料模型。這讓你能透過控制項的 observable 追蹤資料模型的獨特變更。變更偵測更有效率，因為它只需要針對獨特變更進行更新。由於資料更新遵循反應式模式，你可以與 observable 運算子整合來轉換資料。 |
| 範本驅動表單 | 依賴雙向資料繫結的可變性，在範本中做出變更時更新元件中的資料模型。由於使用雙向資料繫結時，資料模型沒有獨特變更可供追蹤，變更偵測在判斷何時需要更新時效率較低。                                                                                                                                                                                                                                 |

上述使用最愛顏色輸入元素的範例示範了這個差異。

* 使用反應式表單時，當控制項的值被更新，**`FormControl` 實例**永遠回傳一個新值
* 使用範本驅動表單時，**最愛顏色屬性**永遠被修改為它的新值

<a id="validation"></a>

## 表單驗證

驗證是管理任何一組表單不可或缺的一部分。
無論你是檢查必填欄位，還是向外部 API 查詢既有的使用者名稱，Angular 都提供了一組內建驗證器，以及建立自訂驗證器的能力。

| 表單                 | 說明                                                                                                      |
| :-------------------- | :----------------------------------------------------------------------------------------------------------- |
| 反應式表單        | 將自訂驗證器定義為接收待驗證控制項的**函式**                                 |
| 範本驅動表單 | 與範本**指令**綁在一起，且必須提供包裝驗證函式的自訂驗證器指令 |

如需更多資訊，請見[表單驗證](guide/form-validation)。

## 測試

測試在複雜的應用程式中扮演重要角色。
在驗證你的表單是否正確運作時，較簡單的測試策略很有用。
反應式表單與範本驅動表單在依賴渲染 UI 來根據表單控制項與表單欄位變更進行斷言的程度上有所不同。
下列範例示範了以反應式表單與範本驅動表單測試表單的流程。

### 測試反應式表單

反應式表單提供了相對直接的測試策略，因為它們對表單與資料模型提供同步存取，而且可以在不渲染 UI 的情況下進行測試。
在這些測試中，狀態與資料會透過控制項來查詢與操作，而不與變更偵測週期互動。

下列測試使用前面範例中的最愛顏色元件，驗證反應式表單的 view 到模型與模型到 view 資料流。

<!--todo: make consistent with other topics -->

**驗證 view 到模型的資料流**

第一個範例執行下列步驟，驗證 view 到模型的資料流。

1. 向 view 查詢表單輸入元素，並為測試建立一個自訂的 "input" 事件。
1. 將輸入的新值設為 *Red*，並在表單輸入元素上分派 "input" 事件。
1. 斷言元件的 `favoriteColorControl` 值與輸入的值相符。

<code-example header="Favorite color test - view to model" path="forms-overview/src/app/reactive/favorite-color/favorite-color.component.spec.ts" region="view-to-model"></code-example>

下一個範例執行下列步驟，驗證模型到 view 的資料流。

1. 使用 `favoriteColorControl`（一個 `FormControl` 實例）設定新值。
1. 向 view 查詢表單輸入元素。
1. 斷言在控制項上設定的新值與輸入中的值相符。

<code-example header="Favorite color test - model to view" path="forms-overview/src/app/reactive/favorite-color/favorite-color.component.spec.ts" region="model-to-view"></code-example>

### 測試範本驅動表單

使用範本驅動表單撰寫測試，需要詳細了解變更偵測流程，並理解指令在每個週期如何執行，以確保元素在正確的時間被查詢、測試或變更。

下列測試使用前面提到的最愛顏色元件，驗證範本驅動表單從 view 到模型與從模型到 view 的資料流。

下列測試驗證從 view 到模型的資料流。

<code-example header="Favorite color test - view to model" path="forms-overview/src/app/template/favorite-color/favorite-color.component.spec.ts" region="view-to-model"></code-example>

以下是 view 到模型測試所執行的步驟。

1. 向 view 查詢表單輸入元素，並為測試建立一個自訂的 "input" 事件。
1. 將輸入的新值設為 *Red*，並在表單輸入元素上分派 "input" 事件。
1. 透過 test fixture 執行變更偵測。
1. 斷言元件 `favoriteColor` 屬性的值與輸入的值相符。

下列測試驗證從模型到 view 的資料流。

<code-example header="Favorite color test - model to view" path="forms-overview/src/app/template/favorite-color/favorite-color.component.spec.ts" region="model-to-view"></code-example>

以下是模型到 view 測試所執行的步驟。

1. 使用元件實例設定 `favoriteColor` 屬性的值。
1. 透過 test fixture 執行變更偵測。
1. 使用 `tick()` 方法，在 `fakeAsync()` 任務中模擬時間的流逝。
1. 向 view 查詢表單輸入元素。
1. 斷言輸入值與元件實例中 `favoriteColor` 屬性的值相符。

## 後續步驟

若要進一步了解反應式表單，請見下列指南：

*   [反應式表單](guide/reactive-forms)
*   [表單驗證](guide/form-validation#reactive-form-validation)
*   [動態表單](guide/dynamic-form)

若要進一步了解範本驅動表單，請見下列指南：

*   [建立範本驅動表單](guide/forms)教學
*   [表單驗證](guide/form-validation#template-driven-validation)
*   `NgForm` 指令 API 參考文件

<!-- links -->

<!-- external links -->

<!-- end links -->

@reviewed 2022-02-28
