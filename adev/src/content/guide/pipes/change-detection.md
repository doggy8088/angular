# 管道與變更偵測

管道常與會依使用者動作而改變的資料繫結值一起使用。
如果資料是原始型別的輸入值，例如 `String` 或 `Number`，或作為輸入的物件參照，例如 `Date` 或 `Array`，Angular 只要偵測到該值的變更，就會執行管道。

<docs-code-multifile path="adev/src/content/examples/pipes/src/app/power-booster.component.ts">
  <docs-code header="src/app/exponential-strength.pipe.ts" path="adev/src/content/examples/pipes/src/app/exponential-strength.pipe.ts"
             highlight="[16]" visibleRegion="pipe-class" />
  <docs-code header="src/app/power-booster.component.ts" path="adev/src/content/examples/pipes/src/app/power-booster.component.ts"/>
</docs-code-multifile>

每當使用者改變值或指數時，`exponentialStrength` 管道就會執行。請參閱上方標示的那一行。

Angular 會偵測每一次變更並立即執行管道。
這對原始型別的輸入值來說沒有問題。
然而，如果你改變的是複合物件*內部*的某些東西（例如日期的月份、陣列的元素或物件屬性），你就需要了解變更偵測如何運作，以及如何使用非純粹（`impure`）管道。

## 變更偵測的運作方式 {#how-change-detection-works}

Angular 會在每次 DOM 事件（每次按鍵、滑鼠移動、計時器滴答與伺服器回應）之後執行變更偵測程序，檢查資料繫結值的變更。
下列範例沒有使用管道，示範 Angular 如何使用預設的變更偵測策略，監視並更新 `heroes` 陣列中每位英雄的顯示。
範例的分頁顯示如下：

| 檔案                               | 詳細說明 |
|:---                                 |:---     |
| `flying-heroes.component.html (v1)` | `*ngFor` 重複器顯示英雄名稱。                     |
| `flying-heroes.component.ts (v1)`   | 提供英雄、把英雄加入陣列，並重設陣列。 |

<docs-code-multifile>
    <docs-code header="src/app/flying-heroes.component.html (v1)" path="adev/src/content/examples/pipes/src/app/flying-heroes.component.html" visibleRegion="template-1"/>
    <docs-code header="src/app/flying-heroes.component.ts (v1)" path="adev/src/content/examples/pipes/src/app/flying-heroes.component.ts" visibleRegion="v1"/>
</docs-code-multifile>

每當使用者加入一位英雄，Angular 就會更新顯示。
如果使用者點選 **Reset** 按鈕，Angular 會把 `heroes` 換成包含原始英雄的新陣列並更新顯示。
如果你再加入移除或變更英雄的功能，Angular 也會偵測到那些變更並更新顯示。

然而，每次變更都執行管道來更新顯示，會拖慢應用程式的效能。
因此 Angular 在執行管道時使用較快的變更偵測演算法，如下一節所述。

## 偵測原始型別與物件參照的純粹變更 {#detecting-pure-changes-to-primitives-and-object-references}

依預設，管道被定義為*純粹*（pure），讓 Angular 只在偵測到輸入值或參數發生*純粹變更*時才執行管道。
純粹變更指的是原始型別輸入值的變更（例如 `String`、`Number`、`Boolean` 或 `Symbol`），或是物件參照的變更（例如 `Date`、`Array`、`Function` 或 `Object`）。

純粹管道必須使用純粹函式，也就是處理輸入並回傳值、且沒有副作用的函式。
換句話說，給定相同的輸入，純粹函式應該一律回傳相同的輸出。

使用純粹管道時，Angular 會忽略物件與陣列內部的變更，因為檢查原始型別值或物件參照，比深入檢查物件內部的差異要快得多。
Angular 可以迅速判斷是否能跳過執行管道與更新檢視。

然而，以陣列作為輸入的純粹管道，表現可能不如你所預期。
為了示範這個問題，我們把前面的範例改成只篩選會飛的英雄。

為此，我們在 `*ngFor` 重複器中使用 `FlyingHeroesPipe`，如下列程式碼所示。
範例的分頁顯示如下：

| 檔案                          | 詳細說明 |
|:---                            |:---     |
| flying-heroes.component.html   | 使用新管道的範本。 |
| flying-heroes.pipe.ts          | 包含篩選飛行英雄的自訂管道的檔案。 |

<docs-code-multifile>
    <docs-code header="src/app/flying-heroes.component.html" path="adev/src/content/examples/pipes/src/app/flying-heroes.component.html" visibleRegion="template-flying-heroes"/>
    <docs-code header="src/app/flying-heroes.pipe.ts" path="adev/src/content/examples/pipes/src/app/flying-heroes.pipe.ts" visibleRegion="pure"/>
</docs-code-multifile>

應用程式現在出現了非預期的行為：當使用者加入飛行英雄時，沒有任何一位出現在 "Heroes who fly" 之下。
這是因為加入英雄的程式碼，是把英雄推入作為 `flyingHeroes` 管道輸入的 `heroes` 陣列。

<docs-code header="src/app/flying-heroes.component.ts" path="adev/src/content/examples/pipes/src/app/flying-heroes.component.ts" visibleRegion="push"/>

變更偵測器會忽略陣列元素內部的變更，所以管道不會執行。
Angular 忽略變更後的陣列元素，是因為陣列的*參照*並沒有改變。
由於陣列是同一個，Angular 不會更新顯示。

要得到你想要的行為，其中一種方法是改變物件參照本身。
把陣列換成包含新變更元素的新陣列，再把新陣列輸入管道。
在前面的範例中，建立一個附加了新英雄的陣列，並把它指派給 `heroes`。
Angular 會偵測到陣列參照的變更並執行管道。

總結來說，如果你直接修改輸入陣列，純粹管道不會執行。
如果你*取代*輸入陣列，管道就會執行，顯示也會更新。
另一種做法是使用*非純粹*管道，來偵測陣列等複合物件內部的變更，如下一節所述。

## 偵測複合物件內部的非純粹變更 {#detecting-impure-changes-within-composite-objects}

若要在複合物件*內部*發生變更（例如陣列元素的變更）之後執行自訂管道，你需要把管道定義為 `impure`，以偵測非純粹變更。
Angular 只要偵測到變更（例如每次按鍵或滑鼠事件），就會執行非純粹管道。

IMPORTANT: 非純粹管道雖然有用，但使用時請小心。
執行時間很長的非純粹管道，可能會大幅拖慢你的應用程式。

把管道的 `pure` 旗標設為 `false`，即可讓它成為非純粹管道：

<docs-code header="src/app/flying-heroes.pipe.ts" path="adev/src/content/examples/pipes/src/app/flying-heroes.pipe.ts"
           visibleRegion="pipe-decorator" highlight="[19]"/>

下列程式碼展示了 `FlyingHeroesImpurePipe` 的完整實作，它擴充 `FlyingHeroesPipe` 以繼承其特性。
這個範例顯示你不需要改變其他任何東西——唯一的差別是在管道中繼資料中把 `pure` 旗標設為 `false`。

<docs-code-multifile>
    <docs-code header="src/app/flying-heroes.pipe.ts (FlyingHeroesImpurePipe)" path="adev/src/content/examples/pipes/src/app/flying-heroes.pipe.ts" visibleRegion="impure"/>
    <docs-code header="src/app/flying-heroes.pipe.ts (FlyingHeroesPipe)" path="adev/src/content/examples/pipes/src/app/flying-heroes.pipe.ts" visibleRegion="pure"/>
</docs-code-multifile>

`FlyingHeroesImpurePipe` 是非純粹管道的合適候選，因為它的 `transform` 函式簡單又快速：

<docs-code header="src/app/flying-heroes.pipe.ts (filter)" path="adev/src/content/examples/pipes/src/app/flying-heroes.pipe.ts" visibleRegion="filter"/>

你可以從 `FlyingHeroesComponent` 衍生出 `FlyingHeroesImpureComponent`。
如下列程式碼所示，只有範本中的管道改變。

<docs-code header="src/app/flying-heroes-impure.component.html (excerpt)" path="adev/src/content/examples/pipes/src/app/flying-heroes-impure.component.html" visibleRegion="template-flying-heroes"/>
