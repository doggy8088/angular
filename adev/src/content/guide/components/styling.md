# 樣式元件

提示：本指南假設您已經閱讀過 [精華指南](essentials)。如果您是 Angular 新手，請先閱讀該指南。

元件可以選擇包含套用至該元件的 DOM 的 CSS 樣式：

<docs-code language="ts" highlight="[4]">
@Component({
  selector: 'profile-photo',
  template: `<img src="profile-photo.jpg" alt="Your profile photo">`,
  styles: ` img { border-radius: 50%; } `,
})
export class ProfilePhoto { }
</docs-code>

您可以選擇在不同的檔案中撰寫您的樣式：

<docs-code language="ts" highlight="[4]">
@Component({
  selector: 'profile-photo',
  templateUrl: 'profile-photo.html',
  styleUrl: 'profile-photo.css',
})
export class ProfilePhoto { }
</docs-code>

當 Angular 編譯您的元件時，這些樣式會與元件的 JavaScript 輸出一起發出。這表示元件樣式參與 JavaScript 模組系統。當您呈現 Angular 元件時，即使是延遲載入元件，框架也會自動包含其關聯的樣式。

Angular 與任何輸出 CSS 的工具均可搭配使用，
包括 [Sass](https://sass-lang.com)、[less](https://lesscss.org)
和 [stylus](https://stylus-lang.com)。

## 風格範圍

每個元件都有 **檢視封裝** 設定，用於決定框架如何設定元件樣式的範圍。檢視封裝模式有三個：`Emulated`、`ShadowDom` 和 `None`。你可以在 `@Component` 裝飾器中指定模式：

<docs-code language="ts" highlight="[3]">
@Component({
  ...,
  encapsulation: ViewEncapsulation.None,
})
export class ProfilePhoto { }
</docs-code>

### ViewEncapsulation.Emulated

預設情況下，Angular 使用模擬封裝，以便元件的樣式僅套用至在該元件範本中定義的元素。在此模式中，框架會為每個元件實例產生一個唯一的 HTML 屬性，將該屬性新增至元件範本中的元素，並將該屬性插入至在您的元件樣式中定義的 CSS 選擇器。

此模式可確保元件的樣式不會外洩並影響其他元件。然而，在元件外部定義的全域樣式仍可能影響具有仿冒封裝的元件內的元素。

在模擬模式中，Angular 支援
[`:host`](https://developer.mozilla.org/en-US/docs/Web/CSS/:host)
和 [`:host-context`](https://developer.mozilla.org/en-US/docs/Web/CSS/:host-context) 偽類別，而不使用 [Shadow DOM](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_shadow_DOM)。
在編譯期間，框架會將這些偽類別轉換為屬性。Angular 的模擬封裝模式不支援任何其他與 Shadow DOM 相關的偽類別，例如 `::shadow` 或 `::part`。

#### `::ng-deep`

Angular 模擬封裝模式支援自訂偽類別 `:ng-deep`。將此偽類別套用到 CSS 規則會停用該規則的封裝，有效地將其轉換為全域樣式。**Angular 團隊強烈不建議新使用 `::ng-deep`**。這些 API 僅供向後相容性使用。

### ViewEncapsulation.ShadowDom

此模式會透過使用 [Web 標準 Shadow DOM API](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_shadow_DOM) 在元件內取用樣式。在啟用此模式時，Angular 會將 shadow root 附加到元件的主機元素，並將元件的範本與樣式呈現到對應的 shadow tree 中。

此模式嚴格保證 _僅_ 該元件的樣式套用至元件範本中的元素。全域樣式無法影響陰影樹中的元素，而陰影樹內的樣式也無法影響該陰影樹外的元素。

啟用 `ShadowDom` 封裝後，影響的範圍不僅止於樣式範圍。在陰影樹中渲染元件會影響事件傳播、與 [`<slot>` API](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_templates_and_slots) 的互動，以及瀏覽器開發人員工具顯示元素的方式。在應用程式中啟用此選項之前，務必先了解使用 Shadow DOM 的全部含義。

### ViewEncapsulation.None

此模式停用元件的所有樣式封裝。與元件相關的任何樣式均會表現為全域樣式。

## 在範本中定義樣式

您可以在元件的範本中使用 `<style>` 元素來定義額外的樣式。
元件的檢視封裝模式適用于以此方式定義的樣式。

Angular 不支援在 style 元素內繫結。

## 參閱外部樣式檔案

元件範本可以使用 [`<link>` 元素](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/link) 來
參照 CSS 檔案。此外，您的 CSS 可以使用 [`@import` at 規則](https://developer.mozilla.org/en-US/docs/Web/CSS/@import) 來參照
CSS 檔案。Angular 將這些參照視為 _外部_ 樣式。外部樣式不受模擬檢視封裝的影響。
