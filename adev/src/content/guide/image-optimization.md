# 開始使用 NgOptimizedImage

`NgOptimizedImage` 指令讓你輕鬆採用載入圖片的效能最佳實務。

該指令透過下列方式，確保 [Largest Contentful Paint (LCP)](https://web.dev/lcp) 圖片的載入被優先處理：

- 自動在 `<img>` 標籤上設定 `fetchpriority` 屬性
- 預設延遲載入其他圖片
- 自動在文件 head 中產生 preconnect 連結標籤
- 自動產生 `srcset` 屬性
- 如果應用程式使用 SSR，會產生 [preload 提示](https://developer.mozilla.org/docs/Web/HTML/Link_types/preload)

除了最佳化 LCP 圖片的載入外，`NgOptimizedImage` 還強制執行多項圖片最佳實務，例如：

- 使用[圖片 CDN URL 來套用圖片最佳化](https://web.dev/image-cdns/#how-image-cdns-use-urls-to-indicate-optimization-options)
- 透過要求 `width` 與 `height` 來防止版面位移
- 在 `width` 或 `height` 設定不正確時提出警告
- 在圖片渲染時會視覺扭曲時提出警告

如果你在 CSS 中使用背景圖片，請[從這裡開始](#how-to-migrate-your-background-image)。

NOTE: 雖然 `NgOptimizedImage` 指令是在 Angular 15 版成為穩定功能的，但它已被回移植（backported），在 13.4.0 版與 14.3.0 版中也作為穩定功能提供。

## 開始使用

<docs-workflow>
<docs-step title="匯入 `NgOptimizedImage` 指令">
從 `@angular/common` 匯入 `NgOptimizedImage` 指令：

```ts
import {NgOptimizedImage} from '@angular/common';
```

並將它加入獨立元件或 NgModule 的 `imports` 陣列：

```ts
imports: [
  NgOptimizedImage,
  // ...
],
```

</docs-step>
<docs-step title="（可選）設定 Loader {#optional-set-up-a-loader}">
使用 NgOptimizedImage 並不**需要**圖片載入器（loader），但搭配圖片 CDN 使用載入器可以啟用強大的效能功能，包括為你的圖片自動產生 `srcset`。

設定載入器的簡要指南，請參閱本頁結尾的[為 NgOptimizedImage 設定圖片載入器](#configuring-an-image-loader-for-ngoptimizedimage)章節。
</docs-step>
<docs-step title="啟用指令">
若要啟用 `NgOptimizedImage` 指令，請將圖片的 `src` 屬性換成 `ngSrc`。

```html
<img ngSrc="cat.jpg" />
```

如果你使用的是[內建的第三方載入器](#built-in-loaders)，請務必從 `src` 中省略基礎 URL 路徑，因為載入器會自動將它加在前面。
</docs-step>
<docs-step title="將圖片標記為 `priority` {#mark-images-as-priority}">
務必將頁面上的 [LCP 圖片](https://web.dev/lcp/#what-elements-are-considered) 標記為 `priority`，讓它優先載入。

```html
<img ngSrc="cat.jpg" width="400" height="200" priority />
```

將圖片標記為 `priority` 會套用下列最佳化：

- 設定 `fetchpriority=high`（有關優先提示的更多資訊請見[這裡](https://web.dev/priority-hints)）
- 設定 `loading=eager`（有關原生延遲載入的更多資訊請見[這裡](https://web.dev/browser-level-image-lazy-loading)）
- 如果[在伺服器上渲染](guide/ssr)，會自動產生 [preload 連結元素](https://developer.mozilla.org/docs/Web/HTML/Link_types/preload)

如果 LCP 元素是一張沒有 `priority` 屬性的圖片，Angular 會在開發期間顯示警告。頁面的 LCP 元素會因多種因素而異，例如使用者螢幕的尺寸，因此一個頁面可能有多張圖片應該標記為 `priority`。更多細節請參閱 [CSS for Web Vitals](https://web.dev/css-web-vitals/#images-and-largest-contentful-paint-lcp)。
</docs-step>
<docs-step title="加入寬度與高度">
為了防止[與圖片相關的版面位移](https://web.dev/css-web-vitals/#images-and-layout-shifts)，NgOptimizedImage 要求你為圖片指定高度與寬度，如下所示：

```html
<img ngSrc="cat.jpg" width="400" height="200" />
```

對於**響應式圖片**（依可視區域放大縮小的圖片），`width` 與 `height` 屬性應該是圖片檔案的原始尺寸。對於響應式圖片，[為 `sizes` 設定值](#responsive-images)也很重要。

對於**固定尺寸圖片**，`width` 與 `height` 屬性應該反映圖片預期的渲染尺寸。這些屬性的長寬比應該永遠與圖片的原始長寬比相符。

NOTE: 如果你不知道圖片的尺寸，可以考慮使用「fill mode」來繼承父容器的尺寸，如下所述。
</docs-step>
</docs-workflow>

## 使用 `fill` 模式 {#using-fill-mode}

當你想讓圖片填滿一個容器元素時，可以使用 `fill` 屬性。這在你想達成「背景圖片」效果時經常很有用。當你不知道圖片確切的寬度與高度，但有一個已知尺寸的父容器、想讓圖片符合該容器時，這也很有幫助（見下方的「object-fit」）。

當你為圖片加入 `fill` 屬性時，你不需要、也不應該加入 `width` 與 `height`，如下例所示：

```html
<img ngSrc="cat.jpg" fill />
```

你可以使用 [object-fit](https://developer.mozilla.org/docs/Web/CSS/object-fit) CSS 屬性，來改變圖片填滿容器的方式。如果你將圖片樣式設為 `object-fit: "contain"`，圖片會保持它的長寬比，並以「letterboxed」方式符合元素。如果你設定 `object-fit: "cover"`，元素會保留它的長寬比、完全填滿元素，且部分內容可能會被「裁切」掉。

上述視覺範例請見 [MDN object-fit 文件](https://developer.mozilla.org/docs/Web/CSS/object-fit)。

你也可以用 [object-position 屬性](https://developer.mozilla.org/docs/Web/CSS/object-position) 為圖片設定樣式，調整它在容器元素中的位置。

IMPORTANT: 若要讓「fill」圖片正確渲染，它的父元素**必須**設定 `position: "relative"`、`position: "fixed"` 或 `position: "absolute"` 樣式。

## 如何遷移你的背景圖片 {#how-to-migrate-your-background-image}

以下是一個將 `background-image` 遷移到 `NgOptimizedImage` 的簡單逐步流程。在這些步驟中，我們將具有圖片背景的元素稱為「容器元素」：

1. 從容器元素移除 `background-image` 樣式。
2. 確保容器元素具有 `position: "relative"`、`position: "fixed"` 或 `position: "absolute"`。
3. 在容器元素底下建立一個新的圖片元素作為子元素，使用 `ngSrc` 來啟用 `NgOptimizedImage` 指令。
4. 為該元素加上 `fill` 屬性。不要加入 `height` 與 `width`。
5. 如果你認為這張圖片可能是你的 [LCP 元素](https://web.dev/lcp/)，請為圖片元素加入 `priority` 屬性。

你可以依照[使用 fill 模式](#using-fill-mode)章節所述，調整背景圖片填滿容器的方式。

## 使用佔位符 {#using-placeholders}

### 自動佔位符

如果你的 CDN 或圖片主機提供自動調整圖片大小的功能，NgOptimizedImage 可以為你的圖片顯示自動產生的低解析度佔位符。為你的圖片加入 `placeholder` 屬性即可利用此功能：

```html
<img ngSrc="cat.jpg" width="400" height="200" placeholder />
```

加入這個屬性後，會使用你指定的圖片載入器，自動請求第二個較小版本的圖片。這張小圖片會在你的圖片載入期間，以帶有 CSS 模糊效果的 `background-image` 樣式套用。如果沒有提供圖片載入器，就無法產生佔位圖片，並會拋出錯誤。

自動產生的佔位符預設大小為寬 30px。你可以在 `IMAGE_CONFIG` 提供者中指定像素值來變更這個大小，如下所示：

```ts
providers: [
  {
    provide: IMAGE_CONFIG,
    useValue: {
      placeholderResolution: 40
    }
  },
],
```

如果你想讓模糊的佔位符周圍有銳利的邊緣，可以將圖片包在一個帶有 `overflow: hidden` 樣式的 `<div>` 容器中。只要 `<div>` 與圖片大小相同（例如使用 `width: fit-content` 樣式），佔位符的「模糊邊緣」就會被隱藏。

### Data URL 佔位符

你也可以在不使用圖片載入器的情況下，使用 base64 [data URL](https://developer.mozilla.org/docs/Web/HTTP/Basics_of_HTTP/Data_URLs) 指定佔位符。data URL 的格式是 `data:image/[imagetype];[data]`，其中 `[imagetype]` 是圖片格式，例如 `png`，而 `[data]` 是圖片的 base64 編碼。該編碼可以使用命令列或在 JavaScript 中完成。具體指令請參閱 [MDN 文件](https://developer.mozilla.org/docs/Web/HTTP/Basics_of_HTTP/Data_URLs#encoding_data_into_base64_format)。帶有截斷資料的 data URL 佔位符範例如下所示：

```html
<img ngSrc="cat.jpg" width="400" height="200" placeholder="data:image/png;base64,iVBORw0K..." />
```

不過，較大的 data URL 會增加 Angular 套件的大小，並拖慢頁面載入。如果你無法使用圖片載入器，Angular 團隊建議將 base64 佔位圖片保持在 4KB 以下，並且只用在關鍵圖片上。除了縮小佔位符的尺寸外，也可以考慮變更儲存圖片時使用的圖片格式或參數。在非常低的解析度下，這些參數對檔案大小會有很大的影響。

### 非模糊佔位符

預設情況下，NgOptimizedImage 會對圖片佔位符套用 CSS 模糊效果。若要渲染不帶模糊的佔位符，請提供一個 `placeholderConfig` 參數，其物件包含 `blur` 屬性並設為 false。例如：

```html
<img ngSrc="cat.jpg" width="400" height="200" placeholder [placeholderConfig]="{blur: false}" />
```

## 調整圖片樣式

視圖片的樣式而定，加入 `width` 與 `height` 屬性可能會讓圖片的渲染方式不同。如果你的圖片樣式讓圖片以扭曲的長寬比渲染，`NgOptimizedImage` 會提出警告。

你通常可以將 `height: auto` 或 `width: auto` 加入圖片樣式來修正這個問題。更多資訊請參閱 [web.dev 有關 `<img>` 標籤的文章](https://web.dev/patterns/web-vitals-patterns/images/img-tag)。

如果圖片上的 `width` 與 `height` 屬性妨礙你用 CSS 以想要的方式調整圖片大小，可以考慮改用 `fill` 模式，並為圖片的父元素設定樣式。

## 效能功能

NgOptimizedImage 包含多項旨在改善應用程式載入效能的功能。本章節將說明這些功能。

### 加入資源提示 {#add-resource-hints}

為你的圖片來源加入 [`preconnect` 資源提示](https://web.dev/preconnect-and-dns-prefetch)，可以確保 LCP 圖片盡快載入。

對於作為[載入器](#optional-set-up-a-loader)參數提供的網域，preconnect 連結會自動產生。如果無法自動識別圖片來源，且未偵測到 LCP 圖片的 preconnect 連結，`NgOptimizedImage` 會在開發期間提出警告。在這種情況下，你應該手動將資源提示加入 `index.html`。在文件的 `<head>` 中，加入一個帶有 `rel="preconnect"` 的 `link` 標籤，如下所示：

```html
<link rel="preconnect" href="https://my.cdn.origin" />
```

若要停用 preconnect 警告，請注入 `PRECONNECT_CHECK_BLOCKLIST` token：

```ts

providers: [
{provide: PRECONNECT_CHECK_BLOCKLIST, useValue: 'https://your-domain.com'}
],

```

有關自動產生 preconnect 的更多資訊，請見[這裡](#why-is-a-preconnect-element-not-being-generated-for-my-image-domain)。

### 以自動產生的 `srcset` 請求正確大小的圖片 {#request-images-at-the-correct-size-with-automatic-srcset}

定義 [`srcset` 屬性](https://developer.mozilla.org/docs/Web/API/HTMLImageElement/srcset)可以確保瀏覽器針對使用者的可視區域請求正確大小的圖片，才不會浪費時間下載過大的圖片。`NgOptimizedImage` 會根據圖片標籤上 [`sizes` 屬性](https://developer.mozilla.org/docs/Web/API/HTMLImageElement/sizes)的有無與其值，為圖片產生適當的 `srcset`。

#### 固定尺寸圖片

如果你的圖片大小應該是「固定的」（也就是在不同裝置上大小相同，但[像素密度](https://web.dev/codelab-density-descriptors/)除外），就不需要設定 `sizes` 屬性。`srcset` 可以從圖片的寬度與高度屬性自動產生，不需要進一步的輸入。

自動產生的 srcset 範例：

```html
<img ... srcset="image-400w.jpg 1x, image-800w.jpg 2x" />
```

#### 響應式圖片 {#responsive-images}

如果你的圖片應該是響應式的（也就是依可視區域大小放大縮小），你就需要定義 [`sizes` 屬性](https://developer.mozilla.org/docs/Web/API/HTMLImageElement/sizes)來產生 `srcset`。

如果你以前沒用過 `sizes`，一個好的起點是根據可視區域寬度來設定它。例如，如果你的 CSS 讓圖片填滿可視區域寬度的 100%，就將 `sizes` 設為 `100vw`，瀏覽器會在 `srcset` 中選擇最接近可視區域寬度的圖片（在考慮像素密度之後）。如果你的圖片可能只佔據螢幕的一半（例如在側邊欄中），就將 `sizes` 設為 `50vw`，確保瀏覽器選擇較小的圖片。依此類推。

如果你發現上述內容無法涵蓋你想要的圖片行為，請參閱[進階 sizes 值](#advanced-sizes-values)的文件。

請注意，對於延遲載入的圖片，`NgOptimizedImage` 會自動在提供的 `sizes` 值前面加上 `"auto"`。這是一項最佳化，能提高支援 `sizes="auto"` 的瀏覽器在 srcset 選擇上的準確度，而不支援的瀏覽器會忽略它。未延遲載入的圖片（例如 `priority` 圖片）會保留所提供的 `sizes` 值。

預設的響應式斷點為：

`[16, 32, 48, 64, 96, 128, 256, 384, 640, 750, 828, 1080, 1200, 1920, 2048, 3840]`

如果你想自訂這些斷點，可以使用 `IMAGE_CONFIG` 提供者來完成：

```ts
providers: [
  {
    provide: IMAGE_CONFIG,
    useValue: {
      breakpoints: [16, 48, 96, 128, 384, 640, 750, 828, 1080, 1200, 1920]
    }
  },
],
```

如果你想手動定義 `srcset` 屬性，可以使用 `ngSrcset` 屬性提供你自己的值：

```html
<img ngSrc="hero.jpg" ngSrcset="100w, 200w, 300w" />
```

如果有 `ngSrcset` 屬性，`NgOptimizedImage` 會根據其中包含的大小產生並設定 `srcset`。不要在 `ngSrcset` 中包含圖片檔案名稱，指令會從 `ngSrc` 推斷這項資訊。該指令同時支援寬度描述符（例如 `100w`）與密度描述符（例如 `1x`）。

```html
<img ngSrc="hero.jpg" ngSrcset="100w, 200w, 300w" sizes="50vw" />
```

### 停用自動產生 srcset

若要停用單一圖片的 srcset 產生，你可以在圖片上加入 `disableOptimizedSrcset` 屬性：

```html
<img ngSrc="about.jpg" disableOptimizedSrcset />
```

### 停用圖片延遲載入

預設情況下，`NgOptimizedImage` 會為所有未標記 `priority` 的圖片設定 `loading=lazy`。你可以透過設定 `loading` 屬性，停用非優先圖片的這項行為。這個屬性接受的值有：`eager`、`auto` 與 `lazy`。[詳情請參閱標準圖片 `loading` 屬性的文件](https://developer.mozilla.org/docs/Web/API/HTMLImageElement/loading#value)。

```html
<img ngSrc="cat.jpg" width="400" height="200" loading="eager" />
```

### 控制圖片解碼

預設情況下，`NgOptimizedImage` 會為所有圖片設定 `decoding="auto"`。這讓瀏覽器可以決定在取得圖片後解碼的最佳時機。當圖片被標記為 `priority` 時，Angular 會自動設定 `decoding="sync"`，確保圖片盡早解碼並繪製，有助於改善 **Largest Contentful Paint (LCP)** 效能。

你可以明確設定 `decoding` 屬性，來覆寫非優先圖片的預設 `auto`。優先圖片永遠使用 `decoding="sync"`。  
[詳情請參閱標準圖片 `decoding` 屬性的文件](https://developer.mozilla.org/docs/Web/HTML/Element/img#decoding)。

```html
<!-- Default: decoding is 'auto' -->
<img ngSrc="gallery/landscape.jpg" width="1200" height="800" />

<!-- Decode the image asynchronously to avoid blocking the main thread.-->
<img ngSrc="gallery/preview.jpg" width="600" height="400" decoding="async" />

<!-- Priority images automatically use decoding="sync" -->
<img ngSrc="awesome.jpg" width="500" height="625" priority />

<!-- Decode immediately (can block) when you need the pixels right away -->
<img ngSrc="hero.jpg" width="1600" height="900" decoding="sync" />
```

**允許的值**

- `auto`（預設）：讓瀏覽器選擇最佳策略。
- `async`：以非同步方式解碼圖片，盡可能避免阻塞主執行緒。
- `sync`：立即解碼圖片；可能會阻塞渲染，但能確保圖片一可用，像素就已就緒。

### 進階的 'sizes' 值 {#advanced-sizes-values}

你可能想讓圖片在不同大小的螢幕上以不同的寬度顯示。這種模式的一個常見範例是網格或欄位式版面：在行動裝置上渲染單欄，在較大的裝置上渲染雙欄。你可以使用「media query」語法，在 `sizes` 屬性中捕捉這種行為，如下所示：

```html
<img ngSrc="cat.jpg" width="400" height="200" sizes="(max-width: 768px) 100vw, 50vw" />
```

上例中的 `sizes` 屬性表示：「我預期這張圖片在寬度小於 768px 的裝置上佔螢幕寬度的 100%。否則，我預期它佔螢幕寬度的 50%。

有關 `sizes` 屬性的更多資訊，請參閱 [web.dev](https://web.dev/learn/design/responsive-images/#sizes) 或 [mdn](https://developer.mozilla.org/docs/Web/API/HTMLImageElement/sizes)。

## 為 `NgOptimizedImage` 設定圖片載入器 {#configuring-an-image-loader-for-ngoptimizedimage}

「loader」（載入器）是一個函式，會為指定的圖片檔案產生[圖片轉換 URL](https://web.dev/image-cdns/#how-image-cdns-use-urls-to-indicate-optimization-options)。在適當的情況下，`NgOptimizedImage` 會為圖片設定大小、格式與圖片品質的轉換。

`NgOptimizedImage` 既提供不套用任何轉換的通用載入器，也提供多種第三方圖片服務的載入器。它也支援撰寫你自己的自訂載入器。

| 載入器類型                            | 行為                                                                                                                                                                                                                       |
| :------------------------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 通用載入器                         | 通用載入器回傳的 URL 永遠與 `src` 的值相符。換句話說，這個載入器不套用任何轉換。使用 Angular 提供圖片的網站，是這個載入器的主要目標使用案例。 |
| 第三方圖片服務的載入器 | 第三方圖片服務載入器回傳的 URL，會遵循該圖片服務所使用的 API 慣例。                                                                                              |
| 自訂載入器                         | 自訂載入器的行為由其開發者定義。如果你的圖片服務不被 `NgOptimizedImage` 預先設定的載入器支援，你應該使用自訂載入器。                                   |

根據 Angular 應用程式常用的圖片服務，`NgOptimizedImage` 提供預先設定好、可與下列圖片服務搭配使用的載入器：

| 圖片服務             | Angular API               | 文件                                                               |
| :------------------------ | :------------------------ | :-------------------------------------------------------------------------- |
| Cloudflare Image Resizing | `provideCloudflareLoader` | [文件](https://developers.cloudflare.com/images/image-resizing/)   |
| Cloudinary                | `provideCloudinaryLoader` | [文件](https://cloudinary.com/documentation/resizing_and_cropping) |
| ImageKit                  | `provideImageKitLoader`   | [文件](https://docs.imagekit.io/)                                  |
| Imgix                     | `provideImgixLoader`      | [文件](https://docs.imgix.com/)                                    |
| Netlify                   | `provideNetlifyLoader`    | [文件](https://docs.netlify.com/image-cdn/overview/)               |

若要使用**通用載入器**，不需要額外的程式碼變更。這是預設行為。

### 內建載入器 {#built-in-loaders}

若要使用現有的**第三方圖片服務**載入器，請將你所選服務的提供者工廠加入 `providers` 陣列。在下面的範例中，使用的是 Imgix 載入器：

```ts
providers: [
  provideImgixLoader('https://my.base.url/'),
],
```

你的圖片資產的基礎 URL 應該作為參數傳給提供者工廠。對大多數網站來說，這個基礎 URL 應該符合下列其中一種模式：

- <https://yoursite.yourcdn.com>
- <https://subdomain.yoursite.com>
- <https://subdomain.yourcdn.com/yoursite>

你可以在對應 CDN 提供者的文件中，進一步了解基礎 URL 的結構。

### 自訂載入器 {#custom-loaders}

若要使用**自訂載入器**，請將你的載入器函式作為 `IMAGE_LOADER` DI token 的值提供。在下面的範例中，自訂載入器函式回傳一個以 `https://example.com` 開頭的 URL，其中包含 `src`、`width` 與 `height` 作為 URL 參數。

```ts
providers: [
  {
    provide: IMAGE_LOADER,
    useValue: (config: ImageLoaderConfig) => {
      return `https://example.com/images?src=${config.src}&width=${config.width}&height=${config.height}`;
    },
  },
],
```

`NgOptimizedImage` 指令的載入器函式，接受一個型別為 `ImageLoaderConfig`（來自 `@angular/common`）的物件作為參數，並回傳圖片資產的絕對 URL。`ImageLoaderConfig` 物件包含 `src` 屬性，以及可選的 `width`、`height` 與 `loaderParams` 屬性。

NOTE: 即使 `width` 屬性並不總是存在，自訂載入器也必須使用它，來支援以各種寬度請求圖片，讓 `ngSrcset` 能正常運作。

### `loaderParams` 屬性 {#the-loaderparams-property}

`NgOptimizedImage` 指令還支援一個額外的屬性，稱為 `loaderParams`，專門設計來支援自訂載入器的使用。`loaderParams` 屬性接受一個具有任意屬性的物件作為值，它本身不會做任何事。`loaderParams` 中的資料會被加入傳給你的自訂載入器的 `ImageLoaderConfig` 物件中，可用來控制載入器的行為。

`loaderParams` 的一個常見用途，是控制進階的圖片 CDN 功能。

### 搭配內建載入器使用 `transform` 屬性

Cloudinary、Cloudflare、ImageKit 與 Imgix 的內建載入器，支援 `loaderParams` 中一個特殊的 `transform` 屬性。這個屬性讓你可以套用 CDN 提供的自訂圖片轉換。

`transform` 屬性接受兩種格式：

#### 字串格式

使用你的 CDN 的轉換語法，將轉換以逗號分隔的字串提供：

```html
<img
  ngSrc="my-image.jpg"
  width="400"
  height="300"
  [loaderParams]="{transform: 'e_grayscale,r_10'}"
/>
```

#### 物件格式

將轉換以具有鍵值對的物件提供。

```html
<img
  ngSrc="my-image.jpg"
  width="400"
  height="300"
  [loaderParams]="{transform: {e: 'grayscale', r: 10}}"
/>
```

NOTE: Netlify 載入器不支援 `transform` 屬性，因為 Netlify 的圖片 CDN 不提供自訂轉換參數。

### 自訂載入器範例

以下顯示一個自訂載入器函式的範例。這個範例函式串接 `src`、`width` 與 `height`，並使用 `loaderParams` 來控制一個圓角的自訂 CDN 功能：

```ts
const myCustomLoader = (config: ImageLoaderConfig) => {
  let url = `https://example.com/images/${config.src}?`;
  let queryParams = [];
  if (config.width) {
    queryParams.push(`w=${config.width}`);
  }
  if (config.height) {
    queryParams.push(`h=${config.height}`);
  }
  if (config.loaderParams?.roundedCorners) {
    queryParams.push('mask=corners&corner-radius=5');
  }
  return url + queryParams.join('&');
};
```

請注意，在上例中，我們虛構了 'roundedCorners' 屬性名稱，來控制自訂載入器的一項功能。接著我們可以在建立圖片時使用這項功能，如下所示：

```html
<img ngSrc="profile.jpg" width="300" height="300" [loaderParams]="{roundedCorners: true}" />
```

## 常見問題

### NgOptimizedImage 支援 `background-image` css 屬性嗎？

NgOptimizedImage 並不直接支援 `background-image` css 屬性，但它的設計能輕鬆應付將圖片作為另一個元素背景的使用案例。

將 `background-image` 遷移到 `NgOptimizedImage` 的逐步流程，請參閱上方的[如何遷移你的背景圖片](#how-to-migrate-your-background-image)章節。

### 為什麼不能將 `src` 與 `NgOptimizedImage` 一起使用？

之所以選擇以 `ngSrc` 屬性作為 NgOptimizedImage 的觸發方式，是基於瀏覽器載入圖片方式的技術考量。NgOptimizedImage 會以程式方式變更 `loading` 屬性——如果瀏覽器在這些變更完成之前就看到 `src` 屬性，它就會開始積極下載圖片檔案，而載入方式的變更將被忽略。

### 為什麼我的圖片網域沒有產生 preconnect 元素？ {#why-is-a-preconnect-element-not-being-generated-for-my-image-domain}

preconnect 的產生是根據對你應用程式的靜態分析來執行的。這表示圖片網域必須直接包含在載入器參數中，如下列範例所示：

```ts
providers: [
  provideImgixLoader('https://my.base.url/'),
],
```

如果你使用變數將網域字串傳給載入器，或你沒有使用載入器，靜態分析將無法識別該網域，也就不會產生 preconnect 連結。在這種情況下，你應該如[上所述](#add-resource-hints)，手動將 preconnect 連結加入文件 head 中。

### 我可以在同一個頁面中使用兩個不同的圖片網域嗎？

[圖片載入器](#configuring-an-image-loader-for-ngoptimizedimage)的提供者模式，設計上力求簡單，以應付元件中只使用單一圖片 CDN 的常見使用案例。不過，使用單一提供者來管理多個圖片 CDN 仍然完全可行。

若要做到這一點，我們建議撰寫一個[自訂圖片載入器](#custom-loaders)，使用 [`loaderParams` 屬性](#the-loaderparams-property)傳遞一個旗標，指定應該使用哪個圖片 CDN，然後根據該旗標呼叫適當的載入器。

### 你們可以為我偏好的 CDN 新增內建載入器嗎？

基於維護上的考量，我們目前不打算在 Angular 儲存庫中支援額外的內建載入器。相反地，我們鼓勵開發者將任何額外的圖片載入器以第三方套件的形式發佈。

### 我可以將它與 `<picture>` 標籤一起使用嗎？

不行，但這已列入我們的藍圖，敬請期待。

如果你正在等待這項功能，請在[這裡](https://github.com/angular/angular/issues/56594)為該 GitHub issue 投下贊成票。

### 如何用 Chrome DevTools 找出我的 LCP 圖片？

1. 使用 Chrome DevTools 的 performance 分頁，點選左上角的「start profiling and reload page」按鈕。它的外觀像一個頁面重新整理圖示。

2. 這會觸發一份你 Angular 應用程式的效能分析快照。

3. 效能分析結果可用後，在 timings 區段中選取「LCP」。

4. 底部面板中應該會出現一個摘要項目。你可以在「related node」那一列找到 LCP 元素。點選它會在 Elements 面板中顯示該元素。

<img alt="Chrome DevTools 中的 LCP" src="assets/images/guide/image-optimization/devtools-lcp.png">

NOTE: 這只會識別你正在測試的頁面可視區域內的 LCP 元素。也建議使用行動裝置模擬，來識別較小螢幕的 LCP 元素。
