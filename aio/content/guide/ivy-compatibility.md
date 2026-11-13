# Ivy 相容性指南

Angular 團隊已努力確保 Ivy 盡可能與先前的渲染引擎（「View Engine」）向後相容。
然而，在極少數情況下，必須做一些小幅變更，以確保 Angular 的行為可預測且一致，並修正 View Engine 實作中的問題。
為了讓轉換更順暢，我們已在可行之處提供[自動化遷移](guide/updating-to-version-9#migrations)，讓你的應用程式與程式庫程式碼由 CLI 自動遷移。
話雖如此，有些應用程式可能仍需要套用一些手動更新。

{@a debugging}
## 如何針對 Ivy 的錯誤進行除錯

在版本 9 中，[一些已棄用的 API 已被移除](guide/updating-to-version-9#removals)，且有一些與 Ivy 無關的[重大變更](guide/updating-to-version-9#breaking-changes)。
如果你在更新至版本 9 後看到錯誤，你會想先排除那些變更的影響。

為此，請在 `tsconfig.json` 中暫時[關閉 Ivy](guide/ivy#opting-out-of-angular-ivy)，並重新啟動你的應用程式。

如果你仍然看到錯誤，那些錯誤就不是 Ivy 特有的。在這種情況下，你可能想查閱[一般版本 9 指南](guide/updating-to-version-9)。如果你已選擇加入任何隨 v9 新增的更嚴格的型別檢查設定，你可能也想看看[範本型別檢查指南](guide/template-typecheck)。

如果錯誤消失了，請移除對 `tsconfig.json` 的變更，切換回 Ivy，並檢視下方預期變更的清單。

{@a payload-size-debugging}
### 負載大小除錯

如果你注意到應用程式主要 bundle 的大小隨著 Ivy 增加，你可能想檢查下列事項：

1. 確認你想延遲載入的元件與 `NgModules` 只在延遲模組中被匯入。
任何在延遲模組之外匯入的東西，都可能進入主要 bundle。
更多細節請參閱原始 issue [這裡](https://github.com/angular/angular-cli/issues/16146#issuecomment-557559287)。

1. 檢查匯入的程式庫是否已標記為無副作用。
如果你的應用程式從預期無副作用的共享程式庫匯入，請在它們的 `package.json` 中加入 "sideEffects": false。
這將確保這些程式庫在被匯入但未被直接參照時，能被正確地 tree-shaking。
更多細節請參閱原始 issue [這裡](https://github.com/angular/angular-cli/issues/16799#issuecomment-580912090)。

1. 不使用 Angular CLI 的專案將會看到顯著的大小回退，除非它們更新 minifier 設定，並把編譯時期常數 `ngDevMode`、`ngI18nClosureMode` 與 `ngJitMode` 設為 `false`（對於 Terser，使用 [`global_defs` 設定選項](https://terser.org/docs/api-reference.html#conditional-compilation)把它們設為 `false`）。
請注意，這些常數並非供第三方程式庫或應用程式程式碼使用，因為它們不屬於我們的公開 API 介面，未來可能變更。

{@a common-changes}
### 你可能會看到的變更

* 預設情況下，`@ContentChildren` 查詢只會搜尋 DOM 階層中的直接子節點（先前，只要上方沒有符合其他指令，它們會搜尋 DOM 中的任何嵌套層級）。更多[細節](guide/ivy-compatibility-examples#content-children-descendants)。

* 所有使用 Angular DI 的類別都必須有 Angular 裝飾器，如 `@Directive()` 或 `@Injectable`（先前，未裝飾的類別僅在 AOT 模式下允許，或在使用注入旗標時允許）。更多[細節](guide/ivy-compatibility-examples#undecorated-classes)。

* 指令的未繫結輸入（例如 `<my-comp name="">` 中的 name）現在會在建立檢視時、變更偵測執行之前設定（先前，所有輸入都在變更偵測期間設定）。

* 直接在範本 HTML 中設定的靜態屬性，會覆寫指令或元件所設定的任何衝突宿主屬性（先前，如果發生衝突，指令／元件設定的靜態宿主屬性會覆寫範本的靜態屬性）。

{@a less-common-changes}
### 較不常見的變更

* `@Component` 與 `@Directive` 裝飾器內的屬性（如 `host`）可以被繼承（先前，只有帶有 `@HostBinding` 等顯式欄位裝飾器的屬性才會被繼承）。

* HammerJS 支援改為透過匯入 `HammerModule` 選擇加入（先前，無論應用程式是否使用 HammerJS，它永遠包含在生產 bundle 中）。

* `@ContentChild` 與 `@ContentChildren` 查詢將無法再比對到指令自己的宿主節點（先前，這些查詢除了內容子節點外，也會比對宿主節點）。

* 如果某個權杖以 `@Host` 或 `@Self` 旗標注入，模組注入器不會被搜尋該權杖（先前，帶有這些旗標的權杖仍會在模組層級搜尋）。

* 在範本繫結中以相同名稱存取多個本機參照時，會比對到第一個（先前，會比對到最後一個執行個體）。

* 在匯出模組中使用（但本身未匯出）的指令會被公開匯出（先前，編譯器會自動撰寫一個私有的、別名化的匯出，讓它能使用其全域知識在下游解析）。

* 裝飾器中繼資料中的外來函式或外來常數無法以靜態方式解析（先前，你可以從另一個編譯單元（如程式庫）匯入常數或函式，並在你的 `@NgModule` 定義中使用該常數／函式）。

* 透過本機參照存取的、對指令輸入的前向參照，預設不再支援。

* 如果同時存在未繫結的 class 屬性與 `[class]` 繫結，未繫結屬性中的類別也會被加入（先前，類別繫結會覆寫未繫結屬性中的類別）。

* 現在，把值指派給僅供範本使用的變數（如 `ngFor="let item of items"` 中的 `item`）會是錯誤（先前，編譯器會忽略這些指派）。

* 不再能為了測試，在指令執行個體上以 mock 覆寫生命週期鉤子（請改為修改指令型別本身的生命週期鉤子）。

* 特殊注入權杖（如 `TemplateRef` 或 `ViewContainerRef`）在每次被請求時都會回傳新執行個體（先前，如果在同一節點上請求，特殊權杖的執行個體會被共享）。這主要影響對這些物件做同一性比較的測試。

* ICU 解析在執行時期發生，因此 ICU 案例內只允許文字、HTML 標籤與文字繫結（先前，ICU 內也允許指令）。

* 在 i18n 翻譯中加入原始範本本身不存在的文字繫結，將會拋出執行時期錯誤（先前，在翻譯中包含額外繫結是允許的）。

* i18n 翻譯中若有原始範本本身不存在的額外 HTML 標籤，將會被渲染為純文字（先前，這些標籤會渲染為 HTML）。

* 格式化為 `{provide: X}` 而沒有 `useValue`、`useFactory`、`useExisting` 或 `useClass` 屬性的提供者，會被視為 `{provide: X, useClass: X}`（先前，它預設為 `{provide: X, useValue: undefined}`）。

* `DebugElement.attributes` 對於被加入後又移除的屬性，會回傳 `undefined`（先前，被加入後又移除的屬性值為 `null`）。

* `DebugElement.classes` 對於被加入後又移除的類別，會回傳 `undefined`（先前，被加入後又移除的類別值為 `false`）。

* 如果要在以 `*ngFor` 建立 `<option>` 的 `<select>` 中選取原生 `<option>` 元素，請使用 `<option>` 的 `[selected]` 屬性，而不是繫結到 `<select>` 元素的 `[value]` 屬性（先前，兩者都可以繫結）。[細節](guide/ivy-compatibility-examples#select-value-binding)

* 嵌入檢視（如由 `*ngFor` 建立者）現在會被插入到錨點 DOM 註解節點（例如 `<!--ng-for-of-->`）之前，而不是像先前那樣在它之後。
在大多數情況下，這對渲染出的 DOM 沒有任何影響。
在某些情況下（例如動畫延遲了嵌入檢視的移除），任何新的嵌入檢視都會被插入到正被動畫移除的那個嵌入檢視之後。
這種差異只在動畫作用期間持續，可能改變動畫的視覺呈現。
動畫完成後，產生的渲染 DOM 與以 View Engine 渲染的結果相同。
