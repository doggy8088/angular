# Angular 表單簡介

使用表單處理使用者輸入，是許多常見應用程式的基石。應用程式使用表單讓使用者登入、更新個人檔案、輸入敏感資訊，以及執行許多其他資料輸入任務。

Angular 提供兩種處理表單使用者輸入的做法：反應式與範本驅動。兩者都會從 view 擷取使用者輸入事件、驗證使用者輸入、建立要更新的表單模型與資料模型，並提供追蹤變更的方式。

反應式表單與範本驅動表單以不同的方式處理與管理表單資料。每種做法都提供不同的優勢。

**一般而言：**

* **反應式表單**更強健：更具可擴展性、可重用性與可測試性。如果表單是你應用程式的關鍵部分，或者你已經在使用反應式模式來建置應用程式，請使用反應式表單。
* **範本驅動表單**適合用來為應用程式加入一個簡單的表單，例如電子郵件清單註冊表單。它們很容易加入應用程式，但擴展性不如反應式表單。如果你的表單需求非常基本，而且邏輯可以完全在範本中管理，請使用範本驅動表單。

本指南提供的資訊能幫助你決定哪種類型的表單最適合你的情況。它介紹了兩種做法共用的基礎建構塊，也彙整了兩種做法的關鍵差異，並在設定、資料流與測試的脈絡中示範這些差異。

<div class="alert is-helpful">

**注意：** 如需每種表單的完整資訊，請見[反應式表單](guide/reactive-forms)與[範本驅動表單](guide/forms)。

</div>

## 關鍵差異

下表彙整了反應式表單與範本驅動表單之間的關鍵差異。

<style>

  table {width: 100%};
  td, th {vertical-align: top};
</style>

||反應式|範本驅動|
|--- |--- |--- |
|設定（表單模型）|更明確，在元件類別中建立|較不明確，由指令建立|
|資料模型|結構化|非結構化|
|可預測性|同步|非同步|
|表單驗證|函式|指令|
|可變性|不可變|可變|
|可擴展性|低層級 API 存取|在 API 之上的抽象|

## 共用基礎

反應式表單與範本驅動表單共用底層建構塊。

* `FormControl` 追蹤個別表單控制項的值與驗證狀態。

* `FormGroup` 追蹤一組表單控制項相同的值與狀態。

* `FormArray` 追蹤一個表單控制項陣列相同的值與狀態。

* `ControlValueAccessor` 在 Angular `FormControl` 實例與原生 DOM 元素之間建立橋樑。

請參閱下方的[表單模型設定](#setup-the-form-model)一節，了解如何以反應式表單與範本驅動表單建立與管理這些控制項實例。本指南的[資料流一節](#data-flow-in-forms)提供進一步的細節。

{@a setup-the-form-model}

## 表單模型設定

反應式表單與範本驅動表單都使用表單模型，來追蹤 Angular 表單與表單輸入元素之間的值變更。下列範例展示表單模型如何定義與建立。

### 在反應式表單中設定

這是一個使用反應式表單實作、包含單一控制項輸入欄位的元件。

<code-example path="forms-overview/src/app/reactive/favorite-color/favorite-color.component.ts">
</code-example>

真相來源在給定的時間點提供表單元素的值與狀態。在反應式表單中，表單模型就是真相來源。在上方的範例中，表單模型是 `FormControl` 實例。

<figure class="lightbox">

  <div class="card">

    <img src="generated/images/guide/forms-overview/key-diff-reactive-forms.png" alt="反應式表單的關鍵差異">

  </div>

</figure>

使用反應式表單時，表單模型會在元件類別中明確定義。反應式表單指令（在此例中為 `FormControlDirective`）接著使用值存取器（`ControlValueAccessor` 實例），將既有的 `FormControl` 實例連結到 view 中的特定表單元素。

### 在範本驅動表單中設定

這是同一個元件，改用範本驅動表單實作單一控制項的輸入欄位。

<code-example path="forms-overview/src/app/template/favorite-color/favorite-color.component.ts">
</code-example>

在範本驅動表單中，真相來源是範本。

<figure class="lightbox">

  <div class="card">

    <img src="generated/images/guide/forms-overview/key-diff-td-forms.png" alt="範本驅動表單的關鍵差異">

  </div>

</figure>

表單模型的抽象化以簡單性優先於結構性。範本驅動表單指令 `NgModel` 負責為指定的表單元素建立與管理 `FormControl` 實例。它較不明確，但你不再能直接控制表單模型。

{@a data-flow-in-forms}

## 表單中的資料流

在 Angular 中建置表單時，了解框架如何處理來自使用者或程式化變更的資料流非常重要。反應式表單與範本驅動表單在處理表單輸入時遵循兩種不同的策略。下列資料流範例從上方最愛顏色的輸入欄位範例開始，展示最愛顏色的變更在反應式表單與範本驅動表單中如何處理。

### 反應式表單中的資料流

如上所述，在反應式表單中，view 裡的每個表單元素都直接連結到表單模型（`FormControl` 實例）。從 view 到模型、從模型到 view 的更新都是同步的，不依賴 UI 的算繪。下列圖表使用同一個最愛顏色範例，示範當輸入欄位的值先從 view 變更、再從模型變更時，資料如何流動。

<figure class="lightbox">

  <div class="card">

    <img src="generated/images/guide/forms-overview/dataflow-reactive-forms-vtm.png" alt="反應式表單資料流：view 到模型" width="100%">

  </div>

</figure>

下列步驟概述從 view 到模型的資料流。

1. 使用者在輸入元素中輸入一個值，在這個例子中是最愛顏色 *Blue*。
1. 表單輸入元素以最新值發出一個 "input" 事件。
1. 監聽表單輸入元素事件的控制項值存取器，立即把新值傳遞給 `FormControl` 實例。
1. `FormControl` 實例透過 `valueChanges` observable 發出新值。
1. `valueChanges` observable 的所有訂閱者都會收到新值。

<figure class="lightbox">

  <div class="card">

    <img src="generated/images/guide/forms-overview/dataflow-reactive-forms-mtv.png" alt="反應式表單資料流：模型到 view" width="100%">

  </div>

</figure>

下列步驟概述從模型到 view 的資料流。

1. 使用者呼叫 `favoriteColorControl.setValue()` 方法，更新 `FormControl` 的值。
1. `FormControl` 實例透過 `valueChanges` observable 發出新值。
1. `valueChanges` observable 的所有訂閱者都會收到新值。
1. 表單輸入元素上的控制項值存取器以新值更新該元素。

### 範本驅動表單中的資料流

在範本驅動表單中，每個表單元素都連結到一個在內部管理表單模型的指令。下列圖表使用同一個最愛顏色範例，示範當輸入欄位的值先從 view 變更、再從模型變更時，資料如何流動。

<figure class="lightbox">

  <div class="card">

    <img src="generated/images/guide/forms-overview/dataflow-td-forms-vtm.png" alt="範本驅動表單資料流：view 到模型" width="100%">

  </div>

</figure>

下列步驟概述當輸入值從 *Red* 變成 *Blue* 時，從 view 到模型的資料流。

1. 使用者在輸入元素中輸入 *Blue*。
1. 輸入元素以 *Blue* 這個值發出一個 "input" 事件。
1. 附著在輸入上的控制項值存取器觸發 `FormControl` 實例的 `setValue()` 方法。
1. `FormControl` 實例透過 `valueChanges` observable 發出新值。
1. `valueChanges` observable 的所有訂閱者都會收到新值。
1. 控制項值存取器也呼叫 `NgModel.viewToModelUpdate()` 方法，該方法發出一個 `ngModelChange` 事件。
1. 由於元件範本對 `favoriteColor` 屬性使用雙向資料繫結，元件中的 `favoriteColor` 屬性會被更新為 `ngModelChange` 事件所發出的值（*Blue*）。

<figure class="lightbox">

  <div class="card">

    <img src="generated/images/guide/forms-overview/dataflow-td-forms-mtv.png" alt="範本驅動表單資料流：模型到 view" width="100%">

  </div>

</figure>

下列步驟概述當 `favoriteColor` 從 *Blue* 變成 *Red* 時，從模型到 view 的資料流。

1. 元件中的 `favoriteColor` 值被更新。
1. 變更偵測開始。
1. 在變更偵測期間，由於 `NgModel` 指令實例的某個輸入值已變更，會呼叫它的 `ngOnChanges` 生命週期鉤子。
1. `ngOnChanges()` 方法排入一個非同步工作，為內部的 `FormControl` 實例設定值。
1. 變更偵測完成。
1. 在下一個 tick，該工作執行，為 `FormControl` 實例設定值。
1. `FormControl` 實例透過 `valueChanges` observable 發出最新值。
1. `valueChanges` observable 的所有訂閱者都會收到新值。
1. 控制項值存取器以最新的 `favoriteColor` 值更新 view 中的表單輸入元素。

## 表單驗證

驗證是管理任何一組表單不可或缺的一部分。無論你是檢查必填欄位，還是向外部 API 查詢既有的使用者名稱，Angular 都提供了一組內建驗證器，以及建立自訂驗證器的能力。

* **反應式表單**將自訂驗證器定義為**函式**，接收待驗證的控制項。
* **範本驅動表單**與範本**指令**綁在一起，且必須提供包裝驗證函式的自訂驗證器指令。

如需更多資訊，請見[表單驗證](guide/form-validation)。

## 測試

測試在複雜的應用程式中扮演重要角色。在驗證你的表單是否正確運作時，較簡單的測試策略很有用。反應式表單與範本驅動表單在依賴渲染 UI 來根據表單控制項與表單欄位變更進行斷言的程度上有所不同。下列範例示範了以反應式表單與範本驅動表單測試表單的流程。

### 測試反應式表單

反應式表單提供了相對簡單的測試策略，因為它們對表單與資料模型提供同步存取，而且可以在不渲染 UI 的情況下進行測試。在這些測試中，狀態與資料會透過控制項來查詢與操作，而不與變更偵測週期互動。

下列測試使用前面範例中的最愛顏色元件，驗證反應式表單的 view 到模型與模型到 view 資料流。

下列測試驗證從 view 到模型的資料流。

<code-example path="forms-overview/src/app/reactive/favorite-color/favorite-color.component.spec.ts" region="view-to-model" header="Favorite color test - view to model">
</code-example>

以下是 view 到模型測試所執行的步驟。

1. 向 view 查詢表單輸入元素，並為測試建立一個自訂的 "input" 事件。
1. 將輸入的新值設為 *Red*，並在表單輸入元素上分派 "input" 事件。
1. 斷言元件的 `favoriteColorControl` 值與輸入的值相符。

下列測試驗證從模型到 view 的資料流。

<code-example path="forms-overview/src/app/reactive/favorite-color/favorite-color.component.spec.ts" region="model-to-view" header="Favorite color test - model to view">
</code-example>

以下是模型到 view 測試所執行的步驟。

1. 使用 `favoriteColorControl`（一個 `FormControl` 實例）設定新值。
1. 向 view 查詢表單輸入元素。
1. 斷言在控制項上設定的新值與輸入中的值相符。

### 測試範本驅動表單

使用範本驅動表單撰寫測試，需要詳細了解變更偵測流程，並理解指令在每個週期如何執行，以確保元素在正確的時間被查詢、測試或變更。

下列測試使用前面提到的最愛顏色元件，驗證範本驅動表單從 view 到模型與從模型到 view 的資料流。

下列測試驗證從 view 到模型的資料流。

<code-example path="forms-overview/src/app/template/favorite-color/favorite-color.component.spec.ts" region="view-to-model" header="Favorite color test - view to model">
</code-example>

以下是 view 到模型測試所執行的步驟。

1. 向 view 查詢表單輸入元素，並為測試建立一個自訂的 "input" 事件。
1. 將輸入的新值設為 *Red*，並在表單輸入元素上分派 "input" 事件。
1. 透過 test fixture 執行變更偵測。
1. 斷言元件 `favoriteColor` 屬性的值與輸入的值相符。

下列測試驗證從模型到 view 的資料流。

<code-example path="forms-overview/src/app/template/favorite-color/favorite-color.component.spec.ts" region="model-to-view" header="Favorite color test - model to view">
</code-example>

以下是模型到 view 測試所執行的步驟。

1. 使用元件實例設定 `favoriteColor` 屬性的值。
1. 透過 test fixture 執行變更偵測。
1. 使用 `tick()` 方法，在 `fakeAsync()` 任務中模擬時間的流逝。
1. 向 view 查詢表單輸入元素。
1. 斷言輸入值與元件實例中 `favoriteColor` 屬性的值相符。

## 可變性

變更追蹤方法在應用程式的效率上扮演重要角色。

* **反應式表單**以不可變的資料結構提供資料模型，讓它保持純粹。每當資料模型被觸發變更時，`FormControl` 實例會回傳一個新的資料模型，而不是更新既有的資料模型。這讓你能透過控制項的 observable 追蹤資料模型的獨特變更。這提供了一種讓變更偵測更有效率的方式，因為它只需要針對獨特變更進行更新。它也遵循反應式模式，能與 observable 運算子整合來轉換資料。

* **範本驅動表單**依賴雙向資料繫結的可變性，在範本中做出變更時更新元件中的資料模型。由於使用雙向資料繫結時，資料模型沒有獨特變更可供追蹤，變更偵測在判斷何時需要更新時效率較低。

上述範例使用**最愛顏色**輸入元素示範了這個差異。

* 使用反應式表單時，當控制項的值被更新，**`FormControl` 實例**永遠回傳一個新值。

* 使用範本驅動表單時，**最愛顏色屬性**永遠被修改為它的新值。

## 可擴展性

如果表單是你應用程式的核心部分，可擴展性就非常重要。能夠在多個元件之間重用表單模型至關重要。

* **反應式表單**提供低層級 API 的存取，以及對表單模型的同步存取，讓建立大規模表單更容易。

* **範本驅動**表單著重於簡單情境，重用性較低，抽象化了低層級 API，並提供對表單模型的非同步存取。範本驅動表單的抽象化也反映在測試上：測試反應式表單所需的設定較少，且在測試期間更新與驗證表單與資料模型時，不依賴變更偵測週期。

## 結語

選擇策略始於了解所呈現選項的優點與缺點。低層級 API 與表單模型存取、可預測性、可變性、直接的驗證與測試策略，以及可擴展性，都是選擇用來在 Angular 中建置表單的基礎設施時的重要考量。範本驅動表單與 AngularJS 中的模式相似，但考量到許多現代、大規模 Angular 應用程式的標準，它們有所限制。反應式表單將這些限制降到最低。反應式表單與 Angular 架構其他領域中已存在的反應式模式整合，並能很好地配合這些需求。

## 後續步驟

若要進一步了解反應式表單，請見下列指南：

* [反應式表單](guide/reactive-forms)
* [表單驗證](guide/form-validation#反應式表單驗證)
* [動態表單](guide/dynamic-form)

若要進一步了解範本驅動表單，請見下列指南：

* [範本驅動表單](guide/forms#範本驅動表單)
* [表單驗證](guide/form-validation#範本驅動驗證)
