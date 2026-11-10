# 最佳化圖片

圖片是許多應用程式的重要組成部分，也可能是應用程式效能問題的一大來源，包括 [Core Web Vitals](https://web.dev/explore/learn-core-web-vitals) 分數偏低。

圖片最佳化可能是個複雜的主題，但 Angular 透過 `NgOptimizedImage` 指令為你處理了大部分工作。

NOTE: 在[深入指南](/guide/image-optimization)中進一步了解使用 NgOptimizedImage 的圖片最佳化。

在這個練習中，你將學習如何使用 `NgOptimizedImage`，確保你的圖片有效率地載入。

<hr>

<docs-workflow>

<docs-step title="匯入 NgOptimizedImage 指令">

要運用 `NgOptimizedImage` 指令，先從 `@angular/common` 函式庫匯入它，並把它加到元件的 `imports` 陣列中。

```ts
import { NgOptimizedImage } from '@angular/common';

@Component({
  imports: [NgOptimizedImage],
  ...
})
```

</docs-step>

<docs-step title="把 src 特性更新為 ngSrc">

要啟用 `NgOptimizedImage` 指令，請把 `src` 特性換成 `ngSrc`。無論是靜態圖片來源（即 `src`）還是動態圖片來源（即 `[src]`），都適用這個做法。

```angular-ts {highlight:[[7],[11]]}
import { NgOptimizedImage } from '@angular/common';

@Component({
template: `     ...
    <li>
      Static Image:
      <img ngSrc="/logo.svg" alt="Angular logo" width="32" height="32" />
    </li>
    <li>
      Dynamic Image:
      <img [ngSrc]="logoUrl" [alt]="logoAlt" width="32" height="32" />
    </li>
    ...
  `,
imports: [NgOptimizedImage],
})
```

</docs-step>

<docs-step title="加上 width 和 height 特性">

請注意，在上面的程式碼範例中，每張圖片都有 `width` 和 `height` 特性。為了避免[版面配置位移](https://web.dev/articles/cls)，`NgOptimizedImage` 指令要求每張圖片都具備這兩個尺寸特性。

在你無法或不想為圖片指定靜態 `height` 和 `width` 的情況下，你可以使用 [`fill` 特性](https://web.dev/articles/cls)，讓圖片表現得像「背景圖片」，填滿它的容器元素：

```angular-html
// Container div has 'position: "relative"'
<div class="image-container">
  <img ngSrc="www.example.com/image.png" fill />
</div>
```

NOTE: 要讓 `fill` 圖片正確渲染，它的父元素必須設定 `position: "relative"`、`position: "fixed"` 或 `position: "absolute"` 樣式。

</docs-step>

<docs-step title="優先載入重要的圖片">

載入效能最重要的最佳化之一，是優先載入可能是 [「LCP 元素」](https://web.dev/articles/optimize-lcp) 的圖片，也就是頁面載入時畫面上最大的圖形元素。為了最佳化載入時間，請務必把 `priority` 特性加到你的「主視覺圖片」上，或任何你認為可能是 LCP 元素的其他圖片。

```ts
<img ngSrc="www.example.com/image.png" height="600" width="800" priority />
```

</docs-step>

<docs-step title="選擇性：使用圖片載入器">

`NgOptimizedImage` 讓你可以指定一個[圖片載入器](guide/image-optimization#configuring-an-image-loader-for-ngoptimizedimage)，告訴指令如何為你的圖片格式化 URL。使用載入器讓你可以用簡短的相對 URL 來定義圖片：

```ts
providers: [provideImgixLoader('https://my.base.url/')],
```

最終的 URL 會是 'https://my.base.url/image.png'

```angular-html
<img ngSrc="image.png" height="600" width="800" />
```

圖片載入器不只是為了方便——它們讓你能運用 `NgOptimizedImage` 的完整能力。在[這裡](guide/image-optimization#configuring-an-image-loader-for-ngoptimizedimage)進一步了解這些最佳化，以及熱門 CDN 的內建載入器。

</docs-step>

</docs-workflow>

把這個指令加入你的工作流程後，你的圖片現在會在 Angular 的協助下，以最佳實務的方式載入 🎉

如果你想了解更多，請查看 [`NgOptimizedImage` 的文件](guide/image-optimization)。繼續保持好表現，接著來學習路由。
