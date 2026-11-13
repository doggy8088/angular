<div class="alert is-important">
注意：Angular 13.4.0 包含了回溯移植的 NgOptimizedImage 指令，該指令存在於較新版本的 Angular 中。這是由 Chrome Aurora 團隊實作的特殊專案，目的是讓更多以 Angular 建置的應用程式能受惠於效能強化。這不代表 Angular 的發布程序有所改變，也不表示會有其他功能回溯移植到更早的 Angular 版本。
</div>

# 開始使用 NgOptimizedImage

`NgOptimizedImage` 指令讓你輕鬆採用載入圖片的效能最佳實務。

該指令透過下列方式，確保 [Largest Contentful Paint (LCP)](http://web.dev/lcp) 圖片的載入被優先處理：

*   自動設定 `<img>` 標籤上的 `fetchpriority` 屬性
*   依預設延遲載入其他圖片
*   斷言文件 head 中有對應的 preconnect 連結標籤
*   自動產生 `srcset` 屬性
*   如果應用程式使用 SSR，產生[預載提示](https://developer.mozilla.org/en-US/docs/Web/HTML/Link_types/preload)

除了最佳化 LCP 圖片的載入外，`NgOptimizedImage` 還強制執行多項圖片最佳實務，例如：

*   使用[圖片 CDN URL 來套用圖片最佳化](https://web.dev/image-cdns/#how-image-cdns-use-urls-to-indicate-optimization-options)
*   要求提供 `width` 與 `height` 來防止版面位移
*   如果 `width` 或 `height` 設定錯誤，發出警告
*   如果圖片渲染時會在視覺上失真，發出警告

## 開始使用

#### 步驟 1：匯入 NgOptimizedImageModule

<code-example format="typescript" language="typescript">

import { NgOptimizedImageModule } from '@angular/common'

</code-example>

#### 步驟 2：（選用）設定載入器

使用 NgOptimizedImage 並不**需要**圖片載入器，但將載入器搭配圖片 CDN 使用，可以啟用強大的效能功能，包括為你的圖片自動產生 `srcset`。

設定載入器的簡要指南，請見本頁末尾的[為 NgOptimizedImage 設定圖片載入器](#為-ngoptimizedimage-設定圖片載入器)一節。

#### 步驟 3：啟用指令

若要啟用 `NgOptimizedImage` 指令，請將圖片的 `src` 屬性換成 `ngSrc`。

<code-example format="typescript" language="typescript">

&lt;img ngSrc="cat.jpg"&gt;

</code-example>

如果你使用[內建的第三方載入器](#內建載入器)，請務必從 `src` 省略基礎 URL 路徑，因為載入器會自動在前面加上它。

#### 步驟 4：將圖片標記為 `priority`

請務必將頁面上的 [LCP 圖片](https://web.dev/lcp/#what-elements-are-considered)標記為 `priority`，以優先載入它。

<code-example format="typescript" language="typescript">

&lt;img ngSrc="cat.jpg" width="400" height="200" priority&gt;

</code-example>

將圖片標記為 `priority` 會套用下列最佳化：

*   設定 `fetchpriority=high`（關於優先順序提示的更多資訊，請見[這裡](https://web.dev/priority-hints)）
*   設定 `loading=eager`（關於原生延遲載入的更多資訊，請見[這裡](https://web.dev/browser-level-image-lazy-loading)）
*   如果[在伺服器上渲染](/guide/universal)，會自動產生一個[預載連結元素](https://developer.mozilla.org/en-US/docs/Web/HTML/Link_types/preload)。

如果 LCP 元素是一張沒有 `priority` 屬性的圖片，Angular 會在開發期間顯示警告。頁面的 LCP 元素會因多種因素而異，例如使用者螢幕的尺寸，因此一個頁面可能有多張圖片應該標記為 `priority`。詳情請見 [CSS for Web Vitals](https://web.dev/css-web-vitals/#images-and-largest-contentful-paint-lcp)。

#### 步驟 5：加入高度與寬度

為了防止[與圖片相關的版面位移](https://web.dev/css-web-vitals/#images-and-layout-shifts)，NgOptimizedImage 要求你為圖片指定高度與寬度，如下所示：

<code-example format="typescript" language="typescript">

&lt;img ngSrc="cat.jpg" width="400" height="200"&gt;

</code-example>

對於**響應式圖片**（依可視區域放大縮小的圖片），`width` 與 `height` 屬性應該是圖片檔案的原始尺寸。

對於**固定尺寸圖片**，`width` 與 `height` 屬性應該反映圖片預期的渲染尺寸。這些屬性的長寬比應該永遠與圖片的原始長寬比相符。

Note: 如果你不知道圖片的尺寸，可以考慮使用「fill 模式」來繼承父容器的尺寸，如下所述：

### 使用 `fill` 模式
當你想讓圖片填滿一個容器元素時，可以使用 `fill` 屬性。這在你想達成「背景圖片」效果時經常很有用。當你不知道圖片確切的寬度與高度，但有一個已知尺寸的父容器、想讓圖片符合該容器時，這也很有幫助（見下方的「object-fit」）。

當你為圖片加入 `fill` 屬性時，你不需要、也不應該加入 `width` 與 `height`，如下例所示：

<code-example format="typescript" language="typescript">

&lt;img ngSrc="cat.jpg" fill&gt;

</code-example>

你可以使用 [object-fit](https://developer.mozilla.org/en-US/docs/Web/CSS/object-fit) CSS 屬性，來改變圖片填滿容器的方式。如果你將圖片樣式設為 `object-fit: "contain"`，圖片會保持它的長寬比，並以「letterboxed」方式符合元素。如果你設定 `object-fit: "cover"`，元素會保留它的長寬比、完全填滿元素，且部分內容可能會被「裁切」掉。

上述視覺範例請見 [MDN object-fit 文件](https://developer.mozilla.org/en-US/docs/Web/CSS/object-fit)。

你也可以用 [object-position 屬性](https://developer.mozilla.org/en-US/docs/Web/CSS/object-position) 為圖片設定樣式，調整它在容器元素中的位置。

IMPORTANT: 若要讓「fill」圖片正確渲染，它的父元素**必須**設定 `position: "relative"`、`position: "fixed"` 或 `position: "absolute"` 樣式。

### 調整圖片樣式
視圖片的樣式而定，加入 `width` 與 `height` 屬性可能會讓圖片的渲染方式不同。如果你的圖片樣式讓圖片以扭曲的長寬比渲染，`NgOptimizedImage` 會提出警告。

你通常可以將 `height: auto` 或 `width: auto` 加入圖片樣式來修正這個問題。更多資訊請參閱 [web.dev 有關 `<img>` 標籤的文章](https://web.dev/patterns/web-vitals-patterns/images/img-tag)。

如果圖片上的 `width` 與 `height` 屬性妨礙你用 CSS 以想要的方式調整圖片大小，可以考慮改用 `fill` 模式，並為圖片的父元素設定樣式。

## 效能功能

NgOptimizedImage 包含多項旨在改善應用程式載入效能的功能。本章節將說明這些功能。

### 加入資源提示

你可以為圖片來源加入 [`preconnect` 資源提示](https://web.dev/preconnect-and-dns-prefetch)，確保 LCP 圖片盡快載入。資源提示永遠要放在文件的 `<head>` 中。

<code-example format="html" language="html">

&lt;link rel="preconnect" href="https://my.cdn.origin" /&gt;

</code-example>

預設情況下，若你使用第三方圖片服務的載入器，當 `NgOptimizedImage` 指令偵測到提供 LCP 圖片的來源沒有 `preconnect` 資源提示時，會在開發期間提出警告。

若要停用這些警告，請注入 `PRECONNECT_CHECK_BLOCKLIST` token：

<code-example format="typescript" language="typescript">

providers: [
  {provide: PRECONNECT_CHECK_BLOCKLIST, useValue: 'https://your-domain.com'}
],

</code-example>

### 以自動產生的 `srcset` 請求正確大小的圖片

定義 [`srcset` 屬性](https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement/srcset)可以確保瀏覽器針對使用者的可視區域請求正確大小的圖片，才不會浪費時間下載過大的圖片。`NgOptimizedImage` 會根據圖片標籤上 [`sizes` 屬性](https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement/sizes)的有無與其值，為圖片產生適當的 `srcset`。

#### 固定尺寸圖片

如果你的圖片大小應該是「固定的」（也就是在不同裝置上大小相同，但[像素密度](https://web.dev/codelab-density-descriptors/)除外），就不需要設定 `sizes` 屬性。`srcset` 可以從圖片的寬度與高度屬性自動產生，不需要進一步的輸入。

自動產生的 srcset 範例：`<img ... srcset="image-400w.jpg 1x, image-800w.jpg 2x">`

#### 響應式圖片

如果你的圖片應該是響應式的（也就是依可視區域大小放大縮小），你就需要定義 [`sizes` 屬性](https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement/sizes)來產生 `srcset`。

如果你以前沒用過 `sizes`，一個好的起點是根據可視區域寬度來設定它。例如，如果你的 CSS 讓圖片填滿可視區域寬度的 100%，就將 `sizes` 設為 `100vw`，瀏覽器會在 `srcset` 中選擇最接近可視區域寬度的圖片（在考慮像素密度之後）。如果你的圖片可能只佔據螢幕的一半（例如在側邊欄中），就將 `sizes` 設為 `50vw`，確保瀏覽器選擇較小的圖片。依此類推。

如果你發現上述內容無法涵蓋你想要的圖片行為，請參閱[進階 sizes 值](#進階的-sizes-值)的文件。

預設的響應式斷點為：

`[16, 32, 48, 64, 96, 128, 256, 384, 640, 750, 828, 1080, 1200, 1920, 2048, 3840]`

如果你想自訂這些斷點，可以使用 `IMAGE_CONFIG` 提供者來完成：

<code-example format="typescript" language="typescript">
providers: [
  {
    provide: IMAGE_CONFIG,
    useValue: {
      breakpoints: [16, 48, 96, 128, 384, 640, 750, 828, 1080, 1200, 1920]
    }
  },
],
</code-example>

如果你想手動定義 `srcset` 屬性，可以使用 `ngSrcset` 屬性提供你自己的值：

<code-example format="html" language="html">

&lt;img ngSrc="hero.jpg" ngSrcset="100w, 200w, 300w"&gt;

</code-example>

如果有 `ngSrcset` 屬性，`NgOptimizedImage` 會根據其中包含的大小產生並設定 `srcset`。不要在 `ngSrcset` 中包含圖片檔案名稱，指令會從 `ngSrc` 推斷這項資訊。該指令同時支援寬度描述符（例如 `100w`）與密度描述符（例如 `1x`）。

<code-example format="html" language="html">

&lt;img ngSrc="hero.jpg" ngSrcset="100w, 200w, 300w" sizes="50vw"&gt;

</code-example>

### 停用自動產生 srcset

若要停用單一圖片的 srcset 產生，你可以在圖片上加入 `disableOptimizedSrcset` 屬性：

<code-example format="html" language="html">

&lt;img ngSrc="about.jpg" disableOptimizedSrcset&gt;

</code-example>

### 停用圖片延遲載入

預設情況下，`NgOptimizedImage` 會為所有未標記 `priority` 的圖片設定 `loading=lazy`。你可以透過設定 `loading` 屬性，停用非優先圖片的這項行為。這個屬性接受的值有：`eager`、`auto` 與 `lazy`。[詳情請參閱標準圖片 `loading` 屬性的文件](https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement/loading#value)。

<code-example format="html" language="html">

&lt;img ngSrc="cat.jpg" width="400" height="200" loading="eager"&gt;

</code-example>

### 進階的 'sizes' 值

你可能想讓圖片在不同大小的螢幕上以不同的寬度顯示。這種模式的一個常見範例是網格或欄位式版面：在行動裝置上渲染單欄，在較大的裝置上渲染雙欄。你可以使用「media query」語法，在 `sizes` 屬性中捕捉這種行為，如下所示：

<code-example format="html" language="html">

&lt;img ngSrc="cat.jpg" width="400" height="200" sizes="(max-width: 768px) 100vw, 50vw"&gt;

</code-example>

上例中的 `sizes` 屬性表示：「我預期這張圖片在寬度小於 768px 的裝置上佔螢幕寬度的 100%。否則，我預期它佔螢幕寬度的 50%。

有關 `sizes` 屬性的更多資訊，請參閱 [web.dev](https://web.dev/learn/design/responsive-images/#sizes) 或 [mdn](https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement/sizes)。

## 為 `NgOptimizedImage` 設定圖片載入器

「loader」（載入器）是一個函式，會為指定的圖片檔案產生[圖片轉換 URL](https://web.dev/image-cdns/#how-image-cdns-use-urls-to-indicate-optimization-options)。在適當的情況下，`NgOptimizedImage` 會為圖片設定大小、格式與圖片品質的轉換。

`NgOptimizedImage` 既提供不套用任何轉換的通用載入器，也提供多種第三方圖片服務的載入器。它也支援撰寫你自己的自訂載入器。

| 載入器類型 | 行為 |
|:--- |:--- |
| 通用載入器 | 通用載入器回傳的 URL 永遠與 `src` 的值相符。換句話說，這個載入器不套用任何轉換。使用 Angular 提供圖片的網站，是這個載入器的主要目標使用案例。 |
| 第三方圖片服務的載入器 | 第三方圖片服務載入器回傳的 URL，會遵循該圖片服務所使用的 API 慣例。 |
| 自訂載入器 | 自訂載入器的行為由其開發者定義。如果你的圖片服務不被 `NgOptimizedImage` 預先設定的載入器支援，你應該使用自訂載入器。 |

根據 Angular 應用程式常用的圖片服務，`NgOptimizedImage` 提供預先設定好、可與下列圖片服務搭配使用的載入器：

| 圖片服務 | Angular API | 文件 |
|:--- |:--- |:--- |
| Cloudflare Image Resizing | `provideCloudflareLoader` | [文件](https://developers.cloudflare.com/images/image-resizing/) |
| Cloudinary | `provideCloudinaryLoader` | [文件](https://cloudinary.com/documentation/resizing_and_cropping) |
| ImageKit | `provideImageKitLoader` | [文件](https://docs.imagekit.io/) |
| Imgix | `provideImgixLoader` | [文件](https://docs.imgix.com/) |

若要使用**通用載入器**，不需要額外的程式碼變更。這是預設行為。

### 內建載入器

若要使用現有的**第三方圖片服務**載入器，請將你所選服務的提供者工廠加入 `providers` 陣列。在下面的範例中，使用的是 Imgix 載入器：

<code-example format="typescript" language="typescript">
providers: [
  provideImgixLoader('https://my.base.url/'),
],
</code-example>

你的圖片資產的基礎 URL 應該作為參數傳給提供者工廠。對大多數網站來說，這個基礎 URL 應該符合下列其中一種模式：

*   https://yoursite.yourcdn.com
*   https://subdomain.yoursite.com
*   https://subdomain.yourcdn.com/yoursite

你可以在對應 CDN 提供者的文件中，進一步了解基礎 URL 的結構。

### 自訂載入器

若要使用**自訂載入器**，請將你的載入器函式作為 `IMAGE_LOADER` DI token 的值提供。在下面的範例中，自訂載入器函式回傳一個以 `https://example.com` 開頭的 URL，其中包含 `src` 與 `width` 作為 URL 參數。

<code-example format="typescript" language="typescript">
providers: [
  {
    provide: IMAGE_LOADER,
    useValue: (config: ImageLoaderConfig) => {
      return `https://example.com/images?src=${config.src}&width=${config.width}`;
    },
  },
],
</code-example>

`NgOptimizedImage` 指令的載入器函式，接受一個型別為 `ImageLoaderConfig`（來自 `@angular/common`）的物件作為參數，並回傳圖片資產的絕對 URL。`ImageLoaderConfig` 物件包含 `src` 屬性，以及可選的 `width` 與 `loaderParams` 屬性。

Note: 即使 `width` 屬性並不總是存在，自訂載入器也必須使用它，來支援以各種寬度請求圖片，讓 `ngSrcset` 能正常運作。

### `loaderParams` 屬性

`NgOptimizedImage` 指令還支援一個額外的屬性，稱為 `loaderParams`，專門設計來支援自訂載入器的使用。`loaderParams` 屬性接受一個具有任意屬性的物件作為值，它本身不會做任何事。`loaderParams` 中的資料會被加入傳給你的自訂載入器的 `ImageLoaderConfig` 物件中，可用來控制載入器的行為。

`loaderParams` 的一個常見用途，是控制進階的圖片 CDN 功能。

### 自訂載入器範例

以下顯示一個自訂載入器函式的範例。這個範例函式串接 `src` 與 `width`，並使用 `loaderParams` 來控制一個圓角的自訂 CDN 功能：

<code-example format="typescript" language="typescript">
const myCustomLoader = (config: ImageLoaderConfig) => {
  let url = `https://example.com/images/${config.src}?`;
  let queryParams = [];
  if (config.width) {
    queryParams.push(`w=${config.width}`);
  }
  if (config.loaderParams?.roundedCorners) {
    queryParams.push('mask=corners&corner-radius=5');
  }
  return url + queryParams.join('&');
};
</code-example>

請注意，在上例中，我們虛構了 'roundedCorners' 屬性名稱，來控制自訂載入器的一項功能。接著我們可以在建立圖片時使用這項功能，如下所示：

<code-example format="html" language="html">

&lt;img ngSrc="profile.jpg" width="300" height="300" [loaderParams]="{roundedCorners: true}"&gt;

</code-example>

@reviewed 2022-11-07
