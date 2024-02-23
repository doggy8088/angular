# 元件選擇器

提示：本指南假設您已經閱讀過 [精華指南](essentials)。如果您是 Angular 新手，請先閱讀該指南。

每個元件都定義
一個 [CSS 選擇器](https://developer.mozilla.org/zh-TW/docs/Web/CSS/CSS_selectors) 來決定
該元件如何使用：

<docs-code language="ts" highlight="[2]">
@Component({
  selector: 'profile-photo',
  ...
})
export class ProfilePhoto { }
</docs-code>

您使用元件，方法是在 _其他_ 元件的範本中建立一個匹配的 HTML 元素：

<docs-code language="ts" highlight="[3]">
@Component({
  template: `
    <profile-photo />
    <button>Upload a new profile photo</button>`,
  ...,
})
export class UserProfile { }
</docs-code>

**Angular 在編譯時靜態匹配選擇器。**在執行時變更 DOM，無論是透過 Angular 綁定或 DOM API，都不會影響所呈現的元件。

**一個元素只能匹配一個元件選擇器。**如果多個元件選擇器匹配單個元素，Angular 會報告錯誤。

**元件選取器是區分大小寫的。**

## 選擇器的種類

Angular 支援基本 CSS 選擇器類型](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Selectors) 中的有限子集，用於元件選擇器：

| **選擇器類型**  | **說明**                                                                                                             | **範例**                   |
| ------------------ | ------------------------------------------------------------------------------------------------------------------ | ---------------------------- |
| 類型選擇器      | 根據元素的 HTML 標記名稱或節點名稱來匹配元素。                                                                | `profile-photo`             |
| 屬性選擇器 | 根據 HTML 屬性的存在，以及選擇性地為該屬性提供一個確切的值來匹配元素。                                          | `[dropzone]` `[type="reset"]` |
| 類別選擇器     | 根據 CSS 類別的存在來匹配元素。                                                                                  | `.menu-item`                 |

對於屬性值，Angular 支援使用等號 (`=`) 運算子來匹配精確的屬性值。Angular 不支援其他屬性值運算子。

Angular 元件選擇器不支援組合器，包括
[後代組合器](https://developer.mozilla.org/en-US/docs/Web/CSS/Descendant_combinator)
或 [子元素組合器](https://developer.mozilla.org/en-US/docs/Web/CSS/Child_combinator)。

Angular 元件選擇器不支援指定 [namespaces](https://developer.mozilla.org/en-US/docs/Web/SVG/Namespaces_Crash_Course)。

### 偽類別 `:not`

Angular 支援 [`:not` 偽類別](https://developer.mozilla.org/en-US/docs/Web/CSS/:not)。
您可以將此偽類別附加至任何其他選擇器，以縮小元件選擇器比對的元素範圍。例如，您可以定義一個 `[dropzone]` 屬性選擇器，並防止比對 `textarea` 元素：

<docs-code language="ts" highlight="[2]">
@Component({
  selector: '[dropzone]:not(textarea)',
  ...
})
export class DropZone { }
</docs-code>

Angular 不支援元件選擇器中的任何其他偽類別或偽元素。

### 組合選擇器

您可以透過串連多個選擇器來組合它們。例如，您可以比對指定 `type="reset"` 的 `<button>` 元素：

<docs-code language="ts" highlight="[2]">
@Component({
  selector: 'button[type="reset"]',
  ...
})
export class ResetButton { }
</docs-code>

您可以使用逗號分隔的清單來定義多個選擇器：

<docs-code language="ts" highlight="[2]">
@Component({
  selector: 'drop-zone, [dropzone]',
  ...
})
export class DropZone { }
</docs-code>

Angular 為清單中 _任何_ 與選擇器配對的元素，建立一個元件。

## 選擇一個選擇器

絕大多數元件應使用自訂元素名稱作為其選取器。所有自訂元素名稱應包含連字號，如 [HTML 規範](https://html.spec.whatwg.org/multipage/custom-elements.html#valid-custom-element-name) 所述。
預設情況下，如果 Angular 遇到與任何可用元件不匹配的自訂標籤名稱，它會報告錯誤，防止因元件名稱輸入錯誤而產生的錯誤。

請參閱 [進階元件配置](guide/components/advanced-configuration)，以瞭解如何在 Angular 樣板中使用 [原生自訂元素](https://developer.mozilla.org/en-US/docs/Web/Web_Components)。

### 選擇器前綴

Angular 團隊建議對專案內定義的所有自訂元件使用簡短一致的前置詞。例如，如果您要使用 Angular 建置 YouTube，則您可以使用 `yt-` 作為元件前置詞，並使用 `yt-menu`、`yt-player` 等元件。像這樣對選取器進行命名空間，可以立即清楚地了解特定元件的來源。預設情況下，Angular CLI 使用 `app-`。

Angular 使用 `ng` 選擇器字首作為其專屬的框架 API。千萬不要將 `ng` 用作您自訂元件的選擇器字首。

### 何時使用屬性選擇器

當您想在標準原生元素上建立一個元件時，您應該考慮使用屬性選擇器。例如，如果您想建立一個自訂按鈕元件，您可以藉由使用屬性選擇器來利用標準的 `<button>` 元素：

<docs-code language="ts" highlight="[2]">
@Component({
  selector: 'button[yt-upload]',
   ...
})
export class YouTubeUploadButton { }
</docs-code>

這種方法允許元件的使用者直接使用所有元素的標準 API，而無需額外的作業。這對於 ARIA 屬性（例如 `aria-label`）特別有價值。

當遇到與可用元件不匹配的客製化屬性時，Angular 並不會回報錯誤。在使用具有屬性選擇器的元件時，使用者可能會忘記匯入元件或其 NgModule，導致元件無法渲染。
請參閱 [匯入和使用元件](guide/components/importing)以了解更多資訊。

定義屬性選擇器的元件應使用小寫、破折號的屬性。您可以遵循上述相同的字首建議。
