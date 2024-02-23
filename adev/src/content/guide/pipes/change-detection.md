# 使用 pipe 進行變更偵測

管道經常與可能會根據使用者動作而改變的資料繫結值一起使用。
如果資料是原始輸入值，例如 `字串` 或 `數字`，或是物件參考作為輸入，例如 `日期` 或 `陣列`，Angular 會在偵測到該值的變更時執行管道。

<docs-code-multifile path="adev/src/content/examples/pipes/src/app/power-booster.component.ts">
  <docs-code header="src/app/exponential-strength.pipe.ts" path="adev/src/content/examples/pipes/src/app/exponential-strength.pipe.ts"
             highlight="[16]" visibleRegion="pipe-class" />
  <docs-code header="src/app/power-booster.component.ts" path="adev/src/content/examples/pipes/src/app/power-booster.component.ts"/>
</docs-code-multifile>

`exponentialStrength` 管道在用戶更改值或指數時每次執行。請參閱上面突出的行。

Angular 會偵測每個變更，並立即執行管道。
對於基本輸入值來說，這是沒問題的。
然而，如果你變更複合物件 *內部* 的內容（例如日期的月份、陣列的元素或物件屬性），你需要了解變更偵測的運作方式，以及如何使用「不純」管道。

## 變更偵測如何運作

Angular 在每次 DOM 事件後運行的變更偵測程序中尋找資料繫結值的變更：每個鍵擊、滑鼠移動、計時器滴答聲和伺服器回應。
以下範例未採用管道，示範 Angular 如何使用其預設的變更偵測策略來監控並更新 `heroes` 陣列中每個英雄的顯示方式。
範例索引標籤顯示下列內容：

| 檔案                               | 詳細 |
|:---                                 |:---     |
| `flying-heroes.component.html (v1)` | `*ngFor` 重複器顯示英雄名稱。                     |
| `flying-heroes.component.ts (v1)`   | 提供英雄、將英雄新增到陣列中，並重設陣列。 |

<docs-code-multifile>
    <docs-code header="src/app/flying-heroes.component.html (v1)" path="adev/src/content/examples/pipes/src/app/flying-heroes.component.html" visibleRegion="template-1"/>
    <docs-code header="src/app/flying-heroes.component.ts (v1)" path="adev/src/content/examples/pipes/src/app/flying-heroes.component.ts" visibleRegion="v1"/>
</docs-code-multifile>

Angular 會在使用者新增英雄時更新顯示。
如果使用者點擊 **重置** 按鈕，Angular 會將 `heroes` 替換為一個包含原始英雄的新陣列，並更新顯示。
如果您新增移除或變更英雄的功能，Angular 也會偵測這些變更並更新顯示。

然而，執行一個管線來更新顯示，每次變更都會減慢應用程式的效能。
因此，Angular 使用更快的變更偵測演算法來執行管線，如下一節所述。

## 偵測原始資料和物件參考的純粹變更

預設情況下，管道定義為「純粹」，以便 Angular 僅在偵測到輸入值或參數的「純粹變更」時才執行管道。
純粹變更不是變更基本輸入值（例如 `String`、`Number`、`Boolean` 或 `Symbol`），就是變更物件參考（例如 `Date`、`Array`、`Function` 或 `Object`）。

純函式必須使用純函式，它是一個處理輸入並傳回值而沒有副作用的函式。
換句話說，給定相同的輸入，純函式應該總是傳回相同的輸出。

使用純粹的管線時，Angular 會忽略物件和陣列內的變更，因為檢查基本值或物件參考的速度比對物件內部的差異執行深入檢查快很多。
Angular 可以快速地判斷是否可以略過執行管線和更新檢視。

然而，具有陣列作為輸入的純粹管線可能無法以您想要的方式運作。
為了說明此問題，請將先前的範例變更為僅過濾可以飛行的英雄清單。

為此，考慮我們在 `*ngFor` 重複器中使用 `FlyingHeroesPipe`，如下面的程式碼所示。
範例的標籤顯示下列內容：

| 檔案                          | 詳細資料 |
|:---                            |:---     |
| flying-heroes.component.html   | 使用新管道的範本。 |
| flying-heroes.pipe.ts          | 具有自訂管道的檔案，可過濾飛行英雄。 |

<docs-code-multifile path="adev/src/content/examples/pipes/src/app/flying-heroes.component.ts_FlyingHeroesComponent" preview>
    <docs-code header="src/app/flying-heroes.component.html" path="adev/src/content/examples/pipes/src/app/flying-heroes.component.html" visibleRegion="template-flying-heroes"/>
    <docs-code header="src/app/flying-heroes.pipe.ts" path="adev/src/content/examples/pipes/src/app/flying-heroes.pipe.ts" visibleRegion="pure"/>
</docs-code-multifile>

應用程式現在顯示出意外的行為：當使用者新增會飛的英雄時，沒有任何英雄會出現在「會飛的英雄」底下。
這發生是因為新增英雄的程式碼會將其推入用作 `flyingHeroes` 管道輸入的 `heroes` 陣列。

<docs-code header="src/app/flying-heroes.component.ts" path="adev/src/content/examples/pipes/src/app/flying-heroes.component.ts" visibleRegion="push"/>

變更偵測器忽略陣列元素內的變更，因此管線不會執行。
Angular 忽略已變更的陣列元素的原因是陣列的 *參考* 沒有變更。
由於陣列相同，Angular 沒有更新顯示。

要取得您想要的效果，其中一種方法是變更物件參考本身。
將陣列替換為包含新變更元素的新陣列，然後將新陣列輸入至管線。
在前述範例中，建立一個陣列，並將新的英雄附加在陣列尾端，然後將該陣列指定給 `heroes`。
Angular 會偵測陣列參考的變更，然後執行管線。

總之，如果您變異輸入陣列，純粹的管道不執行。
如果您*取代*輸入陣列，管道執行且顯示已更新。
或者，使用*不純*管道來偵測複合物件（例如陣列）內的變更，如下一節所述。

## 偵測複合物件內部不純的變更

若要執行複合物件 *內部* 變更之後的客製化管道（例如陣列元素的變更），您需要將管道定義為 `impure` 以偵測不純變更。
Angular 在每次偵測到變更時（例如每次擊鍵或滑鼠事件）執行不純管道。

重要：雖然不純的管線可能很有用，但使用時請小心。
長期運行的非純管線可能會顯著降低應用程式的速度。

設定 `pure` 旗標為 `false` 使管線不純：

<docs-code header="src/app/flying-heroes.pipe.ts" path="adev/src/content/examples/pipes/src/app/flying-heroes.pipe.ts"
           visibleRegion="pipe-decorator" highlight="[19]"/>

以下程式碼顯示 `FlyingHeroesImpurePipe` 的完整實作，它擴充 `FlyingHeroesPipe` 以繼承其特性。
範例顯示您不必變更其他任何項目，唯一的差異是將管道中的 `pure` 標記設定為 `false`。

<docs-code-multifile>
    <docs-code header="src/app/flying-heroes.pipe.ts (FlyingHeroesImpurePipe)" path="adev/src/content/examples/pipes/src/app/flying-heroes.pipe.ts" visibleRegion="impure"/>
    <docs-code header="src/app/flying-heroes.pipe.ts (FlyingHeroesPipe)" path="adev/src/content/examples/pipes/src/app/flying-heroes.pipe.ts" visibleRegion="pure"/>
</docs-code-multifile>

`FlyingHeroesImpurePipe` 是個不純管道的合理候選，因為 `transform` 函式簡單且快速：

<docs-code header="src/app/flying-heroes.pipe.ts (filter)" path="adev/src/content/examples/pipes/src/app/flying-heroes.pipe.ts" visibleRegion="filter"/>

您可以從 `FlyingHeroesComponent` 衍生一個 `FlyingHeroesImpureComponent`。
如以下程式碼所示，只有範本中的管線會改變。

<docs-code header="src/app/flying-heroes-impure.component.html (excerpt)" path="adev/src/content/examples/pipes/src/app/flying-heroes-impure.component.html" visibleRegion="template-flying-heroes"/>
