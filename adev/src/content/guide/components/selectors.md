# 元件選擇器

Tip: 本指南假設你已讀過[基礎指南](essentials)。如果你是 Angular 新手，請先讀該指南。

每個元件都會定義一個 [CSS 選擇器](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_selectors)，決定該元件的使用方式：

<docs-code language="ts" highlight="[2]">
@Component({
  selector: 'profile-photo',
  ...
})
export class ProfilePhoto { }
</docs-code>

你透過在_其他_元件的範本中建立相符的 HTML 元素來使用元件：

<docs-code language="ts" highlight="[3]">
@Component({
  template: `
    <profile-photo />
    <button>Upload a new profile photo</button>`,
  ...,
})
export class UserProfile { }
</docs-code>

**Angular 會在編譯時期靜態比對選擇器**。在執行時期更動 DOM，無論是透過 Angular 繫結還是 DOM API，都不會影響所渲染的元件。

**一個元素恰好只能比對一個元件選擇器**。如果有多個元件選擇器比對到同一個元素，Angular 會回報錯誤。

**元件選擇器區分大小寫**。

## 選擇器的類型

Angular 在元件選擇器中，支援[基本 CSS 選擇器類型](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Selectors)的一個有限子集：

| **選擇器類型**     | **說明**                                                                                                 | **範例**                      |
| ------------------ | --------------------------------------------------------------------------------------------------------------- | ----------------------------- |
| 類型選擇器         | 依據元素的 HTML 標籤名稱或節點名稱來比對元素。                                                    | `profile-photo`               |
| 屬性選擇器         | 依據元素是否具有某個 HTML 屬性，並可選擇性地比對該屬性的精確值來比對元素。 | `[dropzone]` `[type="reset"]` |
| 類別選擇器         | 依據元素是否具有某個 CSS 類別來比對元素。                                                          | `.menu-item`                  |

對於屬性值，Angular 支援使用等號（`=`）運算子比對精確的屬性值。Angular 不支援其他屬性值運算子。

Angular 元件選擇器不支援組合子，包括[後代組合子](https://developer.mozilla.org/en-US/docs/Web/CSS/Descendant_combinator)或[子組合子](https://developer.mozilla.org/en-US/docs/Web/CSS/Child_combinator)。

Angular 元件選擇器不支援指定[命名空間](https://developer.mozilla.org/en-US/docs/Web/SVG/Namespaces_Crash_Course)。

### `:not` 偽類別

Angular 支援 [`:not` 偽類別](https://developer.mozilla.org/en-US/docs/Web/CSS/:not)。你可以將這個偽類別附加到任何其他選擇器之後，以縮小元件選擇器的比對範圍。例如，你可以定義一個 `[dropzone]` 屬性選擇器，並防止它比對到 `textarea` 元素：

<docs-code language="ts" highlight="[2]">
@Component({
  selector: '[dropzone]:not(textarea)',
  ...
})
export class DropZone { }
</docs-code>

Angular 不支援在元件選擇器中使用任何其他偽類別或偽元素。

### 組合選擇器

你可以透過串連多個選擇器來組合它們。例如，你可以比對指定了 `type="reset"` 的 `<button>` 元素：

<docs-code language="ts" highlight="[2]">
@Component({
  selector: 'button[type="reset"]',
  ...
})
export class ResetButton { }
</docs-code>

你也可以使用逗號分隔的清單來定義多個選擇器：

<docs-code language="ts" highlight="[2]">
@Component({
  selector: 'drop-zone, [dropzone]',
  ...
})
export class DropZone { }
</docs-code>

Angular 會為比對到清單中_任何_選擇器的每個元素建立一個元件。

## 如何選擇選擇器 {#choosing-a-selector}

絕大多數元件應使用自訂元素名稱作為其選擇器。所有自訂元素名稱都應包含連字號，如 [HTML 規格](https://html.spec.whatwg.org/multipage/custom-elements.html#valid-custom-element-name)所述。依預設，當 Angular 遇到不符合任何可用元件的自訂標籤名稱時，會回報錯誤，以防止因元件名稱打錯而產生的錯誤。

關於在 Angular 範本中使用[原生自訂元素](https://developer.mozilla.org/en-US/docs/Web/Web_Components)的詳情，請參閱[進階元件設定](guide/components/advanced-configuration)。

### 選擇器前綴 {#selector-prefixes}

Angular 團隊建議為專案內定義的所有自訂元件，使用簡短且一致的前綴。例如，如果你要用 Angular 打造 YouTube，你可能會為元件加上 `yt-` 前綴，像是 `yt-menu`、`yt-player` 等元件。像這樣為選擇器加上命名空間，能讓人一眼就看出特定元件的來源。依預設，Angular CLI 使用 `app-`。

Angular 將 `ng` 選擇器前綴保留給它自己的框架 API。切勿將 `ng` 作為你自己自訂元件的選擇器前綴。

### 何時使用屬性選擇器

當你想在標準原生元素上建立元件時，應考慮使用屬性選擇器。例如，如果你想建立一個自訂按鈕元件，你可以利用標準的 `<button>` 元素，使用屬性選擇器：

<docs-code language="ts" highlight="[2]">
@Component({
  selector: 'button[yt-upload]',
   ...
})
export class YouTubeUploadButton { }
</docs-code>

這種做法可讓元件的使用者直接使用該元素的所有標準 API，無需額外工作。這對 `aria-label` 等 ARIA 屬性特別有價值。

當 Angular 遇到不符合任何可用元件的自訂屬性時，不會回報錯誤。使用具有屬性選擇器的元件時，使用者可能忘記匯入該元件或其 NgModule，導致元件無法渲染。更多資訊請參閱[匯入與使用元件](guide/components/importing)。

定義屬性選擇器的元件，應使用小寫、以連字號分隔（dash-case）的屬性。你可以遵循上面說明的相同前綴建議。
