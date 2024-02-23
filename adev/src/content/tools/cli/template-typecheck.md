# 範本類型檢查

## 範本類型檢查概述

就像 TypeScript 能在您的程式碼中偵測類型錯誤，Angular 會檢查應用程式範本中的表達式和繫結，並報告它找到的任何類型錯誤。
Angular 目前有三個執行此作業的模式，視 [Angular 編譯器選項](reference/configs/angular-compiler-options) 中 `fullTemplateTypeCheck` 和 `strictTemplates` 旗標的值而定。

### 基本模式

在最基本的類型檢查模式中，將 `fullTemplateTypeCheck` 標記設定為 `false` 時，Angular 僅驗證範本中的頂層運算式。

如果您撰寫 `<map [city]="user.address.city">`, 編譯器會驗證下列事項：

* `user` 是元件類別上的屬性
* `user` 是具有 address 屬性的物件
* `user.address` 是具有 city 屬性的物件

編譯器不會驗證 `user.address.city` 的值是否可指派給 `<map>` 元件的城市輸入。

編譯器在這個模式中也有一些重要的限制：

* 重要的是，它不檢查嵌入式檢視，例如 `*ngIf`、`*ngFor`、其他 `<ng-template>` 嵌入式檢視。
* 它不會找出 `#refs` 的類型、管道結果或事件繫結中 `$event` 的類型。

在許多情況下，這些東西最終會成為類型 `any`，這可能會導致表達式的後續部分未經檢查。

### 全螢幕模式

如果將 `fullTemplateTypeCheck` 標記設定為 `true`，Angular 會在範本中更積極地進行型別檢查。
特別是：

* 嵌入式檢視（例如在 `*ngIf` 或 `*ngFor` 內）已檢查
* 管道具有正確的回傳類型
* 對指令和管道的區域參考具有正確的類型（任何泛型參數除外，這些參數將為 `any`）

以下仍然具有類型 `any`。

* 本地 DOM 元素參考
* `$event` 物件
* 安全導航表達式

重要：Angular 13 中已棄用 `fullTemplateTypeCheck` 旗標。
應改用編譯器選項的 `strictTemplates` 系列。

### 嚴格模式

Angular 維持 `fullTemplateTypeCheck` 旗標的行為，並引入第三個「嚴格模式」。
嚴格模式是完整模式的超集，並可透過將 `strictTemplates` 旗標設定為 true 來存取。
此旗標取代 `fullTemplateTypeCheck` 旗標。

除了完整的模式行為，Angular 執行下列動作：

* 驗證元件/指令繫結是否可指定給其 `@Input()`
* 在驗證前述模式時遵守 TypeScript 的 `strictNullChecks` 旗標
* 推斷元件/指令的正確類型，包括泛型
* 推斷已設定的範本內容類型 \(例如，允許正確類型檢查 `NgFor`\)
* 推斷元件/指令、DOM 和動畫事件繫結中 `$event` 的正確類型
* 基於標記名稱推斷 DOM 元素的正確本地參照類型 \(例如，`document.createElement` 為該標記返回的類型\)

## 檢查 `*ngFor`

三種型別檢查模式以不同的方式處理內嵌檢視。
考慮以下範例。

<docs-code language="typescript" header="User interface">

interface User {
  name: string;
  address: {
    city: string;
    state: string;
  }
}

</docs-code>

<docs-code language="html">

&lt;div *ngFor="let user of users"&gt;
  &lt;h2&gt;{{config.title}}&lt;/h2&gt;
  &lt;span&gt;City: {{user.address.city}}&lt;/span&gt;
&lt;/div&gt;

</docs-code>

`<h2>` 和 `<span>` 位於 `*ngFor` 嵌入式檢視中。
在基本模式下，Angular 都不會檢查它們。
然而，在完整模式下，Angular 會檢查 `config` 和 `user` 是否存在，並且假設類型為 `any`。
在嚴格模式下，Angular 知道 `<span>` 中的 `user` 類型為 `User`，而 `address` 是具有類型為 `string` 的 `city` 屬性的物件。

## 疑難排解範本錯誤

使用嚴格模式時，您可能會遇到之前任何模式中都未出現的範本錯誤。
這些錯誤通常表示範本中真正的類型不匹配，而之前的工具沒有捕捉到。
如果是這樣，錯誤訊息應該明確指出範本中問題發生在哪裡。

當 Angular 函式庫的類型化不完整或不正確時，或者當類型化與預期不符時，也可能出現誤判，例如以下情況。

* 當函式庫的型別錯誤或不完整時（例如，函式庫並非考慮 `strictNullChecks` 而缺少 `null | undefined`）
* 當函式庫的輸入型別太過狹窄，而函式庫尚未添加適當的元數據供 Angular 瞭解時。
    這通常會發生在用作屬性的已停用或其他常見布林輸入，例如，`<input disabled>`。

* 當對 DOM 事件使用 `$event.target` 時（由於事件冒泡的可能性，DOM 型別中的 `$event.target` 不具有您可能預期的型別）

在出現像這些的誤判時，有幾個選項：

* 在某些情況下使用 `$any()` 類型轉換函式，以選擇不對表達式的一部分進行類型檢查
* 在應用的 TypeScript 組態檔案 `tsconfig.json` 中設定 `strictTemplates: false`，以完全停用嚴格檢查
* 設定 *嚴格性標誌* 為 `false`，以個別停用某些類型檢查操作，同時在其他方面保持嚴格性
* 如果你想要同時使用 `strictTemplates` 和 `strictNullChecks`，請使用 `strictNullInputTypes` 特別針對輸入繫結選擇不進行嚴格的 null 類型檢查

除非另有註解，每個後續選項都會設定為 `strictTemplates` 的值（當 `strictTemplates` 為 `true` 時為 `true`，反之亦然）。

| 嚴格性標記               | 效果 |
|:---                          |:---    |
| `strictInputTypes`           | 檢查約束表達式是否可指定給 `@Input()` 欄位。也會影響指令泛型類型的推斷。                                                                                                                                                                                                                                                                                                |
| `strictInputAccessModifiers` | 在將約束表達式指定給 `@Input()` 時，是否遵守存取修飾詞，例如 `private`/`protected`/`readonly`。如果停用，則會忽略 `@Input` 的存取修飾詞；只會檢查類型。即使將 `strictTemplates` 設為 `true`，此選項預設為 `false`。                                                                                                                                  |
| `strictNullInputTypes`       | 檢查 `@Input()` 繫結（依據 `strictInputTypes`）時，是否遵守 `strictNullChecks`。如果停用，在使用未考量 `strictNullChecks` 而建置的函式庫時會很有用。                                                                                                                                                                                                                                 |
| `strictAttributeTypes`       | 檢查使用文字屬性建立的 `@Input()` 繫結。例如，<docs-code hideCopy language="html"> &lt;input matInput disabled="true"&gt; </docs-code>（將 `disabled` 屬性設為字串 `'true'`）相對於 <docs-code hideCopy language="html"> &lt;input matInput [disabled]="true"&gt; </docs-code>（將 `disabled` 屬性設為布林值 `true`）。 |
| `strictSafeNavigationTypes`  | 安全導覽作業的傳回類型（例如，`user?.name`）是否會根據 `user` 的類型正確推斷。如果停用，`user?.name` 的類型會是 `any`。                                                                                                                                                                                                                                                |
| `strictDomLocalRefTypes`     | DOM 元素的區域參考是否具有正確的類型。如果停用，`<input #ref>` 的 `ref` 類型會是 `any`。                                                                                                                                                                                                                                                                                                            |
| `strictOutputEventTypes`     | `$event` 是否具有正確的類型，以供事件繫結到元件/指令 `@Output()` 或動畫事件。如果停用，它會是 `any`。                                                                                                                                                                                                                                                                                |
| `strictDomEventTypes`        | `$event` 是否具有正確的類型，以供事件繫結到 DOM 事件。如果停用，它會是 `any`。                                                                                                                                                                                                                                                                                                                                |
| `strictContextGenerics`      | 泛型元件的類型參數是否會正確推斷（包括任何泛型邊界）。如果停用，任何類型參數都會是 `any`。                                                                                                                                                                                                                                                                              |
| `strictLiteralTypes`         | 範本中宣告的物件和陣列文字是否會推斷其類型。如果停用，此類文字的類型會是 `any`。當 *`fullTemplateTypeCheck`* 或 *`strictTemplates`* 設為 `true` 時，此標記為 `true`。

如果您在使用這些標記進行疑難排解後仍然遇到問題，請停用 `strictTemplates` 以回復為完整模式。

如果這不起作用，最後的手段選項是使用 `fullTemplateTypeCheck: false` 完全關閉完整模式。

任何建議的方法都無法解決的類型檢查錯誤，可能是範本類型檢查器本身的錯誤。
如果您遇到需要退回到基本模式的錯誤，很可能是此類錯誤。
如果發生這種情況，請 [提出問題](https://github.com/angular/angular/issues)，以便團隊可以解決它。

## 輸入和類型檢查

範本類型檢查器會檢查繫結表達式的類型是否與對應指令輸入的類型相容。
舉例來說，請考慮以下元件：

<docs-code language="typescript">

export interface User {
  name: string;
}

&commat;Component({
  selector: 'user-detail',
  template: '{{ user.name }}',
})
export class UserDetailComponent {
  &commat;Input() user: User;
}

</docs-code>

`AppComponent` 範本以以下方式使用此元件：

<docs-code language="typescript">

&commat;Component({
  selector: 'app-root',
  template: '&lt;user-detail [user]="selectedUser"&gt;&lt;/user-detail&gt;',
})
export class AppComponent {
  selectedUser: User &verbar; null = null;
}

</docs-code>

在此，在對 `AppComponent` 的範本進行類型檢查時，`[user]="selectedUser"` 繫結與 `UserDetailComponent.user` 輸入相應。
因此，Angular 將 `selectedUser` 屬性指定給 `UserDetailComponent.user`，如果它們的類型不相容，則會導致錯誤。
TypeScript 根據其類型系統檢查指定，遵守在應用程式中配置的旗標，例如 `strictNullChecks`。

透過提供更詳細的範本類型檢查器範本類型需求，避免執行時期類型錯誤。
透過在指令定義中提供範本防護函式，讓您自己的指令的輸入類型需求盡可能具體。
請參閱本指南中的 [改進自訂指令的範本類型檢查](guide/directives/structural-directives#directive-type-checks)。

### 嚴格的 null 檢查

當您啟用 `strictTemplates` 和 TypeScript 標記 `strictNullChecks` 時，可能會發生某些情況的類型檢查錯誤，這些情況可能無法輕易避免。
例如：

* 可為空值，並繫結至未啟用 `strictNullChecks` 的函式庫中的指令。

    對於未編譯 `strictNullChecks` 的函式庫，其宣告檔案不會指出欄位是否可以為 `null`。
    在函式庫正確處理 `null` 的情況下，這是個問題，因為編譯器會針對可為空的欄位檢查省略 `null` 類型的宣告檔案。
    因此，編譯器會產生類型檢查錯誤，因為它遵守 `strictNullChecks`。

* 使用 `async` 管道搭配您知道會同步發出的可觀察序列。

    `async` 管道目前假設它訂閱的可觀察序列可能是非同步的，這表示可能尚無可用值。
    在這種情況下，它仍必須傳回某些內容，即 `null`。
    換句話說，`async` 管道的傳回類型包含 `null`，在知道可觀察序列會同步發出非可為空值的情況下，這可能會導致錯誤。

處理前面問題的兩個潛在解決方法：

* 在範本中，在可為空表達式的結尾包含非空斷言運算子 `!`，例如

    <docs-code hideCopy language="html">

    &lt;user-detail [user]="user!"&gt;&lt;/user-detail&gt;

    </docs-code>

    在此範例中，編譯器忽略空值的類型不相容性，就像在 TypeScript 程式碼中一樣。
    在 `async` 管道的案例中，請注意表達式需要用括號括起來，就像在

    <docs-code hideCopy language="html">

    &lt;user-detail [user]="(user$ &verbar; async)!"&gt;&lt;/user-detail&gt;

    </docs-code>

* 完全停用 Angular 範本中的嚴格空值檢查。

    啟用 `strictTemplates` 時，仍然可以停用類型檢查的某些方面。
    將選項 `strictNullInputTypes` 設為 `false` 會停用 Angular 範本中的嚴格空值檢查。
    此標記套用於屬於應用程式的所有元件。

### 圖書館作者建議

作為函式庫作者，您可以採取多項措施來為您的使用者提供最佳體驗。
首先，啟用 `strictNullChecks` 並在輸入的類型中包含 `null`（視情況而定），這會傳達給您的使用者，他們是否可以提供可為空值。
此外，可以提供特定於範本類型檢查器的類型提示。
請參閱 [改進自訂指令範本類型檢查](guide/directives/structural-directives#directive-type-checks) 和 [輸入設定值強制轉換](#input-setter-coercion)。

## 輸入 setter 強制轉換

有時，指令或元件的 `@Input()` 需要變更繫結到它的值，通常會使用輸入的 getter/setter 配對。
以下是一個自訂按鈕元件的範例：

考慮以下指令：

<docs-code language="typescript">

&commat;Component({
  selector: 'submit-button',
  template: &grave;
    &lt;div class="wrapper"&gt;
      &lt;button [disabled]="disabled"&gt;Submit&lt;/button&gt;
    &lt;/div&gt;
  &grave;,
})
class SubmitButton {
  private _disabled: boolean;

&commat;Input()
  get disabled(): boolean {
    return this._disabled;
  }

set disabled(value: boolean) {
    this._disabled = value;
  }
}

</docs-code>

在此，元件的 `disabled` 輸入正在傳遞給範本中的 `<button>`。
只要輸入繫結的是 `boolean` 值，以上所有內容都會如預期般運作。
但是，假設消費者在範本中使用此輸入作為屬性：

<docs-code language="html">

&lt;submit-button disabled&gt;&lt;/submit-button&gt;

</docs-code>

這與 binding 的效果相同：

<docs-code language="html">

&lt;submit-button [disabled]="''"&gt;&lt;/submit-button&gt;

</docs-code>

在執行期間，輸入將被設定為空字串，這不是 `boolean` 值。
處理這個問題的 Angular 元件函式庫經常在 setter 中「強制」將值轉換為正確的類型：

<docs-code language="typescript">

set disabled(value: boolean) {
  this._disabled = (value === '') &verbar;&verbar; value;
}

</docs-code>

理想情況下，這裡的 `value` 類型應從 `boolean` 變更為 `boolean|''`，以符合實際上為 setter 接受的值集。
TypeScript 4.3 之前的版本要求 getter 和 setter 具有相同的類型，因此，如果 getter 應傳回 `boolean`，則 setter 就會卡在較窄的類型中。

如果消費者啟用了 Angular 對範本的最嚴格類型檢查，這會產生一個問題：空字串 \(`''`\) 實際上無法指定給 `disabled` 欄位，這會在使用屬性表單時產生類型錯誤。

為了解決此問題，Angular 支援檢查比輸入欄位本身宣告更廣泛、更寬鬆的類型給 `@Input()`。
透過將一個具有 `ngAcceptInputType_` 前綴的靜態屬性加入元件類別，即可啟用這個功能：

<docs-code language="typescript">

class SubmitButton {
  private _disabled: boolean;

&commat;Input()
  get disabled(): boolean {
    return this._disabled;
  }

set disabled(value: boolean) {
    this._disabled = (value === '') &verbar;&verbar; value;
  }

static ngAcceptInputType_disabled: boolean&verbar;'';
}

</docs-code>

自 TypeScript 4.3 開始，setter 可以宣告為接受 `boolean|''` 作為類型，使輸入 setter 強制轉換欄位過時。
因此，輸入 setter 強制轉換欄位已棄用。

此欄位不一定要有值。
它的存在會傳達給 Angular 型別檢查器，`disabled` 輸入應被視為接受符合 `boolean|''` 型別的繫結。
字尾應為 `@Input` *欄位* 名稱。

如果某個輸入具有 `ngAcceptInputType_` 覆寫，則應小心處理，因為設定器應該能夠處理覆寫類型的任何值。

## 使用 `$any()` 關閉類型檢查`

透過將繫結表達式包圍在對 `$any()` 偽函式的呼叫中，以停用繫結表達式的檢查。
編譯器將其視為對 `any` 類型的轉換，就像在 TypeScript 中使用 `<any>` 或 `as any` 轉換時一樣。

在以下範例中，將 `person` 導向 `any` 類型可以抑制錯誤 `Property address does not exist`。

<docs-code language="typescript">

&commat;Component({
  selector: 'my-component',
  template: '{{&dollar;any(person).address.street}}'
})
class MyComponent {
  person?: Person;
}

</docs-code>
