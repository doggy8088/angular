# 優化圖片

圖片是許多應用程式的重要部分，也可能是造成應用程式效能問題的主要原因，包括 [核心網路指標](https://web.dev/explore/learn-core-web-vitals) 分數低。

影像優化可能是一個複雜的主題，但 Angular 可以透過 `NgOptimizedImage` 指令為您處理大部分內容。在此活動中，您將學習如何使用 `NgOptimizedImage` 來確保影像以有效率的方式載入。

<hr>

<docs-workflow>

<docs-step title="匯入 NgOptimizedImage 指令">

為了利用 `NgOptimizedImage` 指令，首先從 `@angular/common` 函式庫匯入它並將它新增到元件 `imports` 陣列。

```ts
import { NgOptimizedImage } from '@angular/common';

@Component({
  standalone: true,
  imports: [NgOptimizedImage],
  ...
})
```

</docs-step>

<docs-step title="將 src 屬性更新為 ngSrc">

若要啟用 `NgOptimizedImage` 指令，請將 `src` 屬性替換為 `ngSrc`。這適用於靜態圖片來源（即 `src`）和動態圖片來源（即 `[src]`）。

<docs-code language="ts" highlight="[[9], [13]]">
import { NgOptimizedImage } from '@angular/common';

@Component({
  standalone: true,
  template: `
    ...
    <li>
      Static Image:
      <img ngSrc="/assets/logo.svg" alt="Angular logo" width="32" height="32" />
    </li>
    <li>
      Dynamic Image:
      <img [ngSrc]="logoUrl" [alt]="logoAlt" width="32" height="32" />
    </li>`,
    ...
  `,
  imports: [NgOptimizedImage],
})
</docs-code>

</docs-step>

<docs-step title="加入寬度和高度屬性">

注意在以上的程式碼範例中，每個圖片都有 `width` 和 `height` 屬性。為了防止 [版面變形](https://web.dev/articles/cls)，`NgOptimizedImage` 指令需要每個圖片都有這兩個尺寸屬性。

在無法或不想為圖像指定靜態 `height` 和 `width` 的情況下，您可以使用 [the `fill` attribute](https://web.dev/articles/cls) 告訴圖像像「背景圖像」一樣，填滿其包含的元素：

```ts
<div class="image-container"> //Container div has 'position: "relative"'
  <img ngSrc="www.example.com/image.png" fill />
</div>
```

注：為使 `fill` 圖像正確呈現，其父元素必須以 `position: "relative"`、`position: "fixed"` 或 `position: "absolute"` 進行樣式設定。

</docs-step>

<docs-step title="優先處理重要圖像">

載入效能最重要的最佳化之一是優先處理任何可能成為 ["LCP 元素"](https://web.dev/articles/optimize-lcp) 的圖像，這是頁面載入時螢幕上最大的圖形元素。若要最佳化您的載入時間，請務必將 `priority` 屬性新增至您的「英雄圖像」或您認為可能是 LCP 元素的任何其他圖像。

```ts
<img ngSrc="www.example.com/image.png" height="600" width="800" priority />
```

</docs-step>

<docs-step title="選用：使用影像載入器">

`NgOptimizedImage` 允許你指定一個 [影像載入器](guide/image-optimization#configuring-an-image-loader-for-ngoptimizedimage)，它會告訴指令如何為你的影像格式化 URL。使用載入器允許你使用簡短的相對 URL 來定義你的影像：

```ts
providers: [
  provideImgixLoader('https://my.base.url/'),
]

// ...
// Final URL will be 'https://my.base.url/image.png'
<img ngSrc="image.png" height="600" width="800" />
```

影像載入器不只是為了方便，它們允許您使用 `NgOptimizedImage` 的全部功能。在此處瞭解更多關於這些優化和內建的流行 CDN 載入器 [here](guide/image-optimization#configuring-an-image-loader-for-ngoptimizedimage)。

</docs-step>

</docs-workflow>

將此指令新增至工作流程後，您的圖片現在會在 Angular 🎉 的協助下使用最佳實務來載入

如果您想了解更多資訊，請查看 [`NgOptimizedImage`](guide/image-optimization) 的文件。繼續努力，讓我們接著來了解路由。
