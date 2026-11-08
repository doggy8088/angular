<docs-decorative-header title="指令" imgSrc="adev/src/assets/images/directives.svg"> <!-- markdownlint-disable-line -->
指令能為你的 Angular 應用程式中的元素與元件加上行為。
</docs-decorative-header>

指令可以改變元素的外觀、行為，或它在 DOM 中的位置。Angular 內建了數個指令，你也可以撰寫自己的指令。

## 何時使用指令

當指令封裝了你想套用到既有元素或元件的**可重複使用**行為時，最能發揮效用。

常見的範例包括：

- 將相同的外觀或行為套用到許多元素，例如自動聚焦或工具提示。
- 讀取宿主元素的 DOM、屬性或類別，或寫入其中。
- 在不修改原始碼的情況下，為你不擁有的元件加上行為。

如果你需要算繪自己的標記，或管理一塊擁有自己範本的 UI，請改用[元件](guide/components)：那是一種擁有自己範本的特殊指令。

## 快速範例

假設你想讓使用者將滑鼠游標移到元素上時，元素會醒目顯示，背景顏色變成黃色。與其在每個元素上重複相同的事件處理邏輯，不如把這項行為包裝成指令，在需要的地方套用。

下列 `appHighlight` 指令會在滑鼠進入時設定宿主元素的背景顏色，並在滑鼠離開時清除：

```ts
import {Directive, signal} from '@angular/core';

@Directive({
  selector: '[appHighlight]',
  host: {
    '(mouseenter)': 'isHovered.set(true)',
    '(mouseleave)': 'isHovered.set(false)',
    '[style.background-color]': 'isHovered() ? "yellow" : null',
  },
})
export class HighlightDirective {
  protected isHovered = signal(false);
}
```

`host` 中繼資料會監聽滑鼠事件來更新 `isHovered` 訊號，並把宿主元素的 `background-color` 樣式繫結到該訊號的值。

把指令的選擇器以屬性形式加到元素上，即可套用該指令：

```angular-html
<p appHighlight>Highlight me!</p>
```

每個帶有 `appHighlight` 屬性的元素都會獲得相同的懸停行為，而邏輯只定義在一處。

## 指令的類型

Angular 主要有三種類型的指令：

| 指令類型                                                        | 說明                                       |
| :-------------------------------------------------------------- | :----------------------------------------- |
| [元件](guide/components)                                        | 以自己的範本定義可重複使用的 UI。          |
| [屬性指令](guide/directives/attribute-directives)               | 改變元素、元件或另一個指令的外觀或行為。   |
| [結構指令](guide/directives/structural-directives)              | 透過新增與移除 DOM 元素來改變 DOM 版面配置。 |

## 後續步驟

在下列指南中進一步了解每一種類型的指令。

<docs-pill-row>
  <docs-pill href="guide/directives/attribute-directives" title="屬性指令"/>
  <docs-pill href="guide/directives/structural-directives" title="結構指令"/>
  <docs-pill href="guide/directives/directive-composition-api" title="指令組合 API"/>
</docs-pill-row>
