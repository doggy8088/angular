# 範本型別檢查

## 範本型別檢查總覽

如同 TypeScript 會捕捉程式碼中的型別錯誤，Angular 也會檢查應用程式範本中的運算式與繫結，並回報它發現的任何型別錯誤。
Angular 目前有三種模式，取決於 [TypeScript 設定檔](guide/typescript-configuration)中 `fullTemplateTypeCheck` 與 `strictTemplates` 旗標的值。

### 基本模式

在最基本的型別檢查模式中（`fullTemplateTypeCheck` 旗標設為 `false`），Angular 只驗證範本中的最上層運算式。

如果你寫了 `<map [city]="user.address.city">`，編譯器會驗證下列事項：

* `user` 是元件類別上的一個屬性。
* `user` 是一個帶有 address 屬性的物件。
* `user.address` 是一個帶有 city 屬性的物件。

編譯器不會驗證 `user.address.city` 的值是否可指派給 `<map>` 元件的 city 輸入。

編譯器在這個模式下也有一些主要限制：

* 重要的是，它不會檢查內嵌檢視，例如 `*ngIf`、`*ngFor` 或其他 `<ng-template>` 內嵌檢視。
* 它不會推斷 `#refs` 的型別、管道的結果，或事件繫結中 `$event` 的型別。

在許多情況下，這些東西最終會是 `any` 型別，導致運算式後續的部分未經檢查。



### 完整模式

如果 `fullTemplateTypeCheck` 旗標設為 `true`，Angular 在範本中的型別檢查會更加積極。
具體來說：

* 檢查內嵌檢視（例如 `*ngIf` 或 `*ngFor` 內的檢視）。
* 管道具有正確的傳回型別。
* 指向指令與管道的本機參考具有正確的型別（任何泛型參數除外，那些會是 `any`）。

下列項目的型別仍然是 `any`。

* 指向 DOM 元素的本機參考。
* `$event` 物件。
* 安全導覽運算式。


{@a strict-mode}

### 嚴格模式

Angular 維持 `fullTemplateTypeCheck` 旗標的行為，並引入第三種「嚴格模式」。
嚴格模式是完整模式的超集，透過將 `strictTemplates` 旗標設為 true 來啟用。這個旗標取代了 `fullTemplateTypeCheck` 旗標。
在嚴格模式下，Angular 會使用超出第 8 版型別檢查器的檢查。
請注意，嚴格模式僅在使用 Ivy 時可用。

除了完整模式的行為之外，Angular 還會執行下列事項：

* 驗證元件／指令的繫結可指派給它們的 `@Input()`。
* 在驗證前述模式時遵循 TypeScript 的 `strictNullChecks` 旗標。
* 推斷元件／指令的正確型別，包括泛型。
* 在有設定的地方推斷範本脈絡型別（舉例來說，讓 `NgFor` 能被正確地型別檢查）。
* 推斷元件／指令、DOM 與動畫事件繫結中 `$event` 的正確型別。
* 根據標籤名稱，推斷指向 DOM 元素之本機參考的正確型別（舉例來說，就是 `document.createElement` 對該標籤會傳回的型別）。


## `*ngFor` 的檢查

三種型別檢查模式對內嵌檢視的處理方式不同。請看下列範例。


<code-example language="ts" header="User interface">

interface User {
  name: string;
  address: {
    city: string;
    state: string;
  }
}

</code-example>


```html
  <div *ngFor="let user of users">
    <h2>{{config.title}}</h2>
    <span>City: {{user.address.city}}</span>
  </div>
```

`<h2>` 與 `<span>` 位於 `*ngFor` 內嵌檢視中。
在基本模式下，Angular 兩者都不檢查。
在完整模式下，Angular 會檢查 `config` 與 `user` 是否存在，並假設其型別為 `any`。
在嚴格模式下，Angular 知道 `<span>` 中的 `user` 型別是 `User`，且 `address` 是一個帶有 `string` 型別 `city` 屬性的物件。

{@a troubleshooting-template-errors}

## 範本錯誤疑難排解

使用嚴格模式時，你可能會遇到前兩種模式下都不會出現的範本錯誤。
這些錯誤往往代表範本中真正的型別不符，先前的工具並沒有抓出來。
如果是這種情況，錯誤訊息應該能清楚指出範本中問題發生的位置。

當 Angular 程式庫的型別定義不完整或不正確，或是型別定義與預期不完全一致時，也可能出現誤報，如下列情況。

* 當程式庫的型別定義錯誤或不完整時（舉例來說，如果程式庫撰寫時沒有考慮 `strictNullChecks`，就可能缺少 `null | undefined`）。
* 當程式庫的輸入型別太窄，且程式庫沒有加入適當的中繼資料讓 Angular 推斷出來時。這通常發生在 disabled 或其他常見的、被用作屬性的布林輸入上，舉例來說，`<input disabled>`。
* 在 DOM 事件中使用 `$event.target` 時（因為事件冒泡的可能性，DOM 型別定義中的 `$event.target` 並沒有你可能預期的型別）。

遇到這類誤報時，有幾個選擇：

* 在特定脈絡下使用 [`$any()` 型別轉換函式](guide/template-expression-operators#any-type-cast-function)，讓運算式的一部分退出型別檢查。
* 在應用程式的 TypeScript 設定檔 `tsconfig.json` 中設定 `strictTemplates: false`，完全停用嚴格檢查。
* 把某個*嚴格旗標*設為 `false`，單獨停用特定的型別檢查操作，同時在其他方面保持嚴格。
* 如果你想同時使用 `strictTemplates` 與 `strictNullChecks`，可以使用 `strictNullInputTypes`，特別針對輸入繫結退出嚴格的 null 型別檢查。

除非另有註明，下列每個選項的值都跟隨 `strictTemplates`（`strictTemplates` 為 `true` 時就是 `true`，反之亦然）。
<table>
  <thead>
    <tr>
      <th>嚴格旗標</th>
      <th>效果</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>strictInputTypes</code></td>
      <td>是否檢查繫結運算式對 <code>@Input()</code> 欄位的可指派性。同時也會影響指令泛型型別的推斷。</td>
    </tr>
    <tr>
      <td><code>strictInputAccessModifiers</code></td>
      <td>將繫結運算式指派給 <code>@Input()</code> 時，是否遵守 <code>private</code>／<code>protected</code>／<code>readonly</code> 等存取修飾子。如果停用，會忽略 <code>@Input</code> 的存取修飾子，只檢查型別。即使將 <code>strictTemplates</code> 設為 <code>true</code>，這個選項預設仍為 <code>false</code>。</td>
    </tr>
    <tr>
      <td><code>strictNullInputTypes</code></td>
      <td>檢查 <code>@Input()</code> 繫結時是否遵守 <code>strictNullChecks</code>（依 <code>strictInputTypes</code> 而定）。使用未以 <code>strictNullChecks</code> 為考量建置的程式庫時，關閉這個選項可能很有用。</td>
    </tr>
    <tr>
      <td><code>strictAttributeTypes</code></td>
      <td>是否檢查以文字屬性建立的 <code>@Input()</code> 繫結。例如，<code>&lt;input matInput disabled="true"&gt;</code>（將 <code>disabled</code> 屬性設為字串 <code>'true'</code>）與 <code>&lt;input matInput [disabled]="true"&gt;</code>（將 <code>disabled</code> 屬性設為布林值 <code>true</code>）的差別。</td>
    </tr>
    <tr>
      <td><code>strictSafeNavigationTypes</code></td>
      <td>安全導覽運算的傳回型別是否會根據 <code>user</code> 的型別被正確推斷（例如，<code>user?.name</code>）。如果停用，<code>user?.name</code> 的型別會是 <code>any</code>。</td>
    </tr>
    <tr>
      <td><code>strictDomLocalRefTypes</code></td>
      <td>指向 DOM 元素的本機參照是否會有正確的型別。如果停用，<code>&lt;input #ref&gt;</code> 中的 <code>ref</code> 型別會是 <code>any</code>。</td>
    </tr>
    <tr>
      <td><code>strictOutputEventTypes</code></td>
      <td>元件／指令 <code>@Output()</code> 的事件繫結或動畫事件中，<code>$event</code> 是否會有正確的型別。如果停用，它的型別會是 <code>any</code>。</td>
    </tr>
    <tr>
      <td><code>strictDomEventTypes</code></td>
      <td>DOM 事件的事件繫結中，<code>$event</code> 是否會有正確的型別。如果停用，它的型別會是 <code>any</code>。</td>
    </tr>
    <tr>
      <td><code>strictContextGenerics</code></td>
      <td>泛型元件的型別參數是否會被正確推斷（包括任何泛型邊界）。如果停用，任何型別參數都會是 <code>any</code>。</td>
    </tr>
    <tr>
      <td><code>strictLiteralTypes</code></td>
      <td>範本中宣告的物件與陣列字面值是否會推斷出型別。如果停用，這類字面值的型別會是 <code>any</code>。當 <code>fullTemplateTypeCheck</code> 或 <code>strictTemplates</code> 其中之一設為 <code>true</code> 時，此旗標即為 <code>true</code>。</td>
    </tr>
  </tbody>
</table>

如果用這些旗標疑難排解後仍然有問題，可以停用 `strictTemplates`，退回完整模式。

如果這樣還不行，最後的手段是以 `fullTemplateTypeCheck: false` 完全關閉完整模式。

任何建議方法都無法解決的型別檢查錯誤，可能是範本型別檢查器本身的錯誤所致。
如果你遇到的錯誤需要退回基本模式，那很可能就是這類錯誤。
如果發生這種情況，請[提出 issue](https://github.com/angular/angular/issues)，讓團隊處理。

## 輸入與型別檢查

範本型別檢查器會檢查繫結運算式的型別，是否與對應指令輸入的型別相容。
舉例來說，請看下列元件：

```typescript
export interface User {
  name: string;
}

@Component({
  selector: 'user-detail',
  template: '{{ user.name }}',
})
export class UserDetailComponent {
  @Input() user: User;
}
```

`AppComponent` 範本使用這個元件的方式如下：

```ts
@Component({
  selector: 'app-root',
  template: '<user-detail [user]="selectedUser"></user-detail>',
})
export class AppComponent {
  selectedUser: User | null = null;
}
```

在這裡，對 `AppComponent` 範本進行型別檢查時，`[user]="selectedUser"` 繫結對應到 `UserDetailComponent.user` 輸入。
因此，Angular 會把 `selectedUser` 屬性指派給 `UserDetailComponent.user`，如果兩者的型別不相容，就會產生錯誤。
TypeScript 依其型別系統檢查這次指派，並遵循應用程式中設定的 `strictNullChecks` 等旗標。

為範本型別檢查器提供更具體的範本內型別要求，以避免執行階段的型別錯誤。讓你自己的指令的輸入型別要求盡可能具體，方法是在指令定義中提供範本守衛函式。請參閱[改善自訂指令的範本型別檢查](guide/structural-directives#directive-type-checks)，以及本指南的[輸入 setter 強制轉型](#input-setter-coercion)。


### 嚴格的 null 檢查

當你啟用 `strictTemplates` 與 TypeScript 旗標 `strictNullChecks` 時，某些不容易避開的情況可能會出現型別檢查錯誤。例如：

  * 一個可為 null 的值，被繫結到來自某個未啟用 `strictNullChecks` 的程式庫的指令。

  對於未以 `strictNullChecks` 編譯的程式庫，它的宣告檔案不會指出欄位是否可以是 `null`。
  對於程式庫能正確處理 `null` 的情況，這會造成問題，因為編譯器會拿可為 null 的值去對照省略了 `null` 型別的宣告檔案。
  因此，編譯器因為遵循 `strictNullChecks` 而產生型別檢查錯誤。

  * 把 `async` 管道用在你明知會同步發出值的 Observable 上。

  `async` 管道目前假設它訂閱的 Observable 可能是非同步的，也就是說，可能還沒有可用的值。
  在這種情況下，它仍然必須傳回某個東西，也就是 `null`。
  換句話說，`async` 管道的傳回型別包含 `null`，在已知 Observable 會同步發出不可為 null 的值的情況下，這可能會導致錯誤。

針對上述問題，有兩個可能的因應方法：

  1. 在範本中，在可為 null 的運算式結尾加上非 null 斷言運算子 `!`，例如 `<user-detail [user]="user!"></user-detail>`。

  在這個範例中，編譯器會忽略可空性方面的型別不相容，就像在 TypeScript 程式碼中一樣。
  如果是 `async` 管道的情況，請注意運算式需要用括號包起來，例如 `<user-detail [user]="(user$ | async)!"></user-detail>`。

  1. 完全停用 Angular 範本中的嚴格 null 檢查。

  啟用 `strictTemplates` 時，仍然可以停用型別檢查的某些方面。
  把選項 `strictNullInputTypes` 設為 `false`，就能停用 Angular 範本中的嚴格 null 檢查。
  這個旗標適用於應用程式中的所有元件。

### 給程式庫作者的建議

身為程式庫作者，你可以採取幾項措施，為使用者提供最佳體驗。
首先，啟用 `strictNullChecks`，並在適當時把 `null` 包含在輸入的型別中，能告訴你的使用者他們是否可以提供可為 null 的值。
此外，你也可以提供範本型別檢查器專屬的型別提示。請參閱[改善自訂指令的範本型別檢查](guide/structural-directives#directive-type-checks)，以及[輸入 setter 強制轉型](#input-setter-coercion)。


{@a input-setter-coercion}

## 輸入 setter 強制轉型

有時候，我們會希望指令或元件的 `@Input()` 改變繫結到它的值，通常是使用輸入的 getter/setter 配對。
舉例來說，請看這個自訂按鈕元件：

請看下列指令：

```typescript
@Component({
  selector: 'submit-button',
  template: `
    <div class="wrapper">
      <button [disabled]="disabled">Submit</button>
    </div>
  `,
})
class SubmitButton {
  private _disabled: boolean;

  @Input()
  get disabled(): boolean {
    return this._disabled;
  }

  set disabled(value: boolean) {
    this._disabled = value;
  }
}
```

在這裡，元件的 `disabled` 輸入被傳遞給範本中的 `<button>`。只要有 `boolean` 值繫結到該輸入，這一切都會如預期般運作。但假設使用者在範本中把這個輸入用作屬性：

```html
<submit-button disabled></submit-button>
```

這與下列繫結有相同的效果：

```html
<submit-button [disabled]="''"></submit-button>
```

在執行階段，該輸入會被設為空字串，而空字串不是 `boolean` 值。處理這個問題的 Angular 元件程式庫，通常會在 setter 中把值「強制轉型」為正確的型別：

```typescript
set disabled(value: boolean) {
  this._disabled = (value === '') || value;
}
```

理想情況下，應該把這裡 `value` 的型別從 `boolean` 改為 `boolean|''`，以符合 setter 實際接受的值的集合。
TypeScript 要求 getter 與 setter 具有相同的型別，因此如果 getter 應該傳回 `boolean`，setter 就只能使用較窄的型別。

如果使用者啟用了 Angular 最嚴格的範本型別檢查，這會造成問題：空字串（`''`）實際上不可指派給 `disabled` 欄位，使用屬性形式時就會產生型別錯誤。

作為這個問題的因應方法，Angular 支援為 `@Input()` 檢查比輸入欄位本身所宣告更寬、更寬容的型別。在元件類別中加入一個帶有 `ngAcceptInputType_` 前綴的靜態屬性，即可啟用這項功能：

```typescript
class SubmitButton {
  private _disabled: boolean;

  @Input()
  get disabled(): boolean {
    return this._disabled;
  }

  set disabled(value: boolean) {
    this._disabled = (value === '') || value;
  }

  static ngAcceptInputType_disabled: boolean|'';
}
```

這個欄位不需要有值。它的存在告訴 Angular 型別檢查器，`disabled` 輸入應被視為接受符合 `boolean|''` 型別的繫結。後綴應該是 `@Input` _欄位_的名稱。

要注意的是，如果某個輸入有 `ngAcceptInputType_` 覆寫，那麼 setter 應該能夠處理該覆寫型別的任何值。

## 使用 `$any()` 停用型別檢查

把運算式包在 [`$any()` 轉換偽函式](guide/template-expression-operators)的呼叫中，即可停用對該繫結運算式的檢查。
編譯器會把它視為轉換為 `any` 型別，就像在 TypeScript 中使用 `<any>` 或 `as any` 轉換一樣。

在下列範例中，把 `person` 轉換為 `any` 型別，抑制了 `Property address does not exist` 錯誤。

```typescript
  @Component({
    selector: 'my-component',
    template: '{{$any(person).addresss.street}}'
  })
  class MyComponent {
    person?: Person;
  }
```
