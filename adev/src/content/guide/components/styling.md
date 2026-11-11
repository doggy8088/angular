# 元件樣式

TIP: 本指南假設你已讀過[基礎指南](essentials)。如果你是 Angular 新手，請先讀該指南。

元件可以選擇性地包含套用到該元件 DOM 的 CSS 樣式：

<docs-code language="angular-ts" highlight="[4]">
@Component({
  selector: 'profile-photo',
  template: `<img src="profile-photo.jpg" alt="Your profile photo">`,
  styles: ` img { border-radius: 50%; } `,
})
export class ProfilePhoto { }
</docs-code>

你也可以選擇將樣式寫在獨立的檔案中：

<docs-code language="angular-ts" highlight="[4]">
@Component({
  selector: 'profile-photo',
  templateUrl: 'profile-photo.html',
  styleUrl: 'profile-photo.css',
})
export class ProfilePhoto { }
</docs-code>

當 Angular 編譯你的元件時，這些樣式會隨該元件的 JavaScript 輸出一併產生。這表示元件樣式會參與 JavaScript 模組系統。當你渲染 Angular 元件時，框架會自動包含其關聯的樣式，即使是延遲載入的元件也一樣。

Angular 可搭配任何輸出 CSS 的工具，包括 [Sass](https://sass-lang.com)、[less](https://lesscss.org) 與 [stylus](https://stylus-lang.com)。

## 樣式作用域 {#style-scoping}

每個元件都有一個**檢視封裝**設定，決定框架如何界定元件樣式的作用域。共有三種檢視封裝模式：`Emulated`、`ShadowDom` 與 `None`。你可以在 `@Component` 裝飾器中指定模式：

<docs-code language="angular-ts" highlight="[3]">
@Component({
  ...,
  encapsulation: ViewEncapsulation.None,
})
export class ProfilePhoto { }
</docs-code>

### ViewEncapsulation.Emulated

依預設，Angular 使用模擬封裝，讓元件的樣式只套用到在該元件範本中定義的元素。在此模式下，框架會為每個元件實例產生一個唯一的 HTML 屬性，將該屬性加到元件範本中的元素上，並將該屬性插入你在元件樣式中定義的 CSS 選擇器中。

這種模式可確保元件的樣式不會外洩而影響其他元件。然而，在元件之外定義的全域樣式，仍可能影響採用模擬封裝之元件內的元素。

在模擬模式下，Angular 支援 [`:host`](https://developer.mozilla.org/docs/Web/CSS/:host) 偽類別。雖然 [`:host-context()`](https://developer.mozilla.org/docs/Web/CSS/:host-context) 偽類別在現代瀏覽器中已被棄用，Angular 的編譯器仍完整支援它。這兩個偽類別都可以在不依賴原生 [Shadow DOM](https://developer.mozilla.org/docs/Web/Web_Components/Using_shadow_DOM) 的情況下使用。在編譯期間，框架會將這些偽類別轉換為屬性，因此在執行時期並不遵循這些原生偽類別的規則（例如瀏覽器相容性、特異性）。Angular 的模擬封裝模式不支援任何其他與 Shadow DOM 相關的偽類別，例如 `::shadow` 或 `::part`。

#### `::ng-deep`

Angular 的模擬封裝模式支援一個自訂偽類別 `::ng-deep`。將此偽類別套用到 CSS 規則，會停用該規則的封裝，實際上將它變成全域樣式。**Angular 團隊強烈不建議新程式碼使用 `::ng-deep`**。這些 API 僅為向後相容而保留。

### ViewEncapsulation.ShadowDom

此模式透過使用 [Web 標準的 Shadow DOM API](https://developer.mozilla.org/docs/Web/Web_Components/Using_shadow_DOM)，將樣式的作用域限定在元件內。啟用此模式時，Angular 會將一個 shadow root 附加到元件的 host 元素上，並將元件的範本與樣式渲染至對應的 shadow tree 中。

此模式嚴格保證_只有_該元件的樣式會套用到元件範本中的元素。全域樣式無法影響 shadow tree 中的元素，shadow tree 內的樣式也無法影響該 shadow tree 之外的元素。

然而，啟用 `ShadowDom` 封裝的影響不只是樣式作用域。將元件渲染在 shadow tree 中，會影響事件傳播、與 [`<slot>` API](https://developer.mozilla.org/docs/Web/Web_Components/Using_templates_and_slots) 的互動，以及瀏覽器開發者工具顯示元素的方式。在你的應用程式中啟用此選項之前，請務必充分了解使用 Shadow DOM 的完整影響。

### ViewEncapsulation.None

此模式會停用元件的所有樣式封裝。與元件關聯的任何樣式都會表現得像全域樣式。

NOTE: 在 `Emulated` 與 `ShadowDom` 模式下，Angular 並不 100% 保證你的元件樣式永遠會覆寫來自外部的樣式。在發生衝突時，會假設這些樣式與你的元件樣式具有相同的特異性。

## 在範本中定義樣式 {#defining-styles-in-templates}

你可以在元件的範本中使用 `<style>` 元素來定義額外的樣式。元件的檢視封裝模式會套用到以這種方式定義的樣式。

Angular 不支援在 style 元素內使用繫結。

## 參照外部樣式檔案 {#referencing-external-style-files}

元件範本可以使用 [`<link>` 元素](https://developer.mozilla.org/docs/Web/HTML/Element/link) 來參照 CSS 檔案。此外，你的 CSS 可以使用 [`@import` at-rule](https://developer.mozilla.org/docs/Web/CSS/@import) 來參照 CSS 檔案。Angular 將這些參照視為_外部_樣式。外部樣式不受模擬檢視封裝的影響。
