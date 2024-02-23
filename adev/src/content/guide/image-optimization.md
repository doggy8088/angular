# 開始使用 NgOptimizedImage

`NgOptimizedImage` 指令讓採用最佳效能做法來載入圖片變得容易。

該指令可確保以下項目優先載入 [最大內容繪製 (LCP)](http://web.dev/lcp) 影像：

* 自動在 `<img>` 標籤上設定 `fetchpriority` 屬性
* 預設延遲載入其他圖像
* 斷言文件開頭有一個對應的 preconnect 連結標籤
* 自動產生 `srcset` 屬性
* 如果應用程式使用 SSR，則產生 [預載提示](https://developer.mozilla.org/en-US/docs/Web/HTML/Link_types/preload)

除了最佳化 LCP 影像的載入外，`NgOptimizedImage` 亦強制執行多項影像最佳實務，例如：

* 使用 [圖像 CDN URL 套用圖像最佳化](https://web.dev/image-cdns/#how-image-cdns-use-urls-to-indicate-optimization-options)
* 要求 `width` 和 `height` 以防止佈局位移
* 如果 `width` 或 `height` 設定不正確，則發出警告
* 如果渲染時圖像在視覺上會失真，則發出警告

**注意：雖然 `NgOptimizedImage` 指令在 Angular 版本 15 中成為穩定功能，但它已反向移植，並在版本 13.4.0 和 14.3.0 中作為穩定功能提供。**

## 開始使用

<docs-workflow>
<docs-step title="導入 `NgOptimizedImage` 指令">
從 `@angular/common` 導入 `NgOptimizedImage` 指令：

<docs-code language="typescript">

import { NgOptimizedImage } from '@angular/common'

</docs-code>

並將其包含在獨立元件或 NgModule 的 `imports` 陣列中：

<docs-code language="typescript">

imports: [
  NgOptimizedImage,
  // ...
],

</docs-code>
</docs-step>
<docs-step title="(Optional) Set up a Loader">
An image loader is not **required** in order to use NgOptimizedImage, but using one with an image CDN enables powerful performance features, including automatic `srcset`s for your images.

A brief guide for setting up a loader can be found in the [Configuring an Image Loader](#configuring-an-image-loader-for-ngoptimizedimage) section at the end of this page.
</docs-step>
<docs-step title="Enable the directive">
To activate the `NgOptimizedImage` directive, replace your image's `src` attribute with `ngSrc`.

<docs-code language="typescript">

&lt;img ngSrc="cat.jpg"&gt;

</docs-code>

若您使用的是 [內建第三方載入器](#built-in-loaders)，請務必從 `src` 中省略基本網址路徑，因為載入器會自動在前面加上此路徑。
</docs-step>
<docs-step title="將圖片標記為 `priority`">
務必將頁面上的 [LCP 圖片](https://web.dev/lcp/#what-elements-are-considered) 標記為 `priority`，以優先載入該圖片。

<docs-code language="typescript">

&lt;img ngSrc="cat.jpg" width="400" height="200" priority&gt;

</docs-code>

將影像標記為 `priority` 會套用下列最佳化：

* 設定 `fetchpriority=high`（[在此處](https://web.dev/priority-hints)進一步瞭解優先提示）
* 設定 `loading=eager`（[在此處](https://web.dev/browser-level-image-lazy-loading)進一步瞭解原生延遲載入）
* 如果 [在伺服器上進行呈現](/guide/ssr)，會自動產生 [預載連結元素](https://developer.mozilla.org/en-US/docs/Web/HTML/Link_types/preload)。

在開發期間，如果 LCP 元素是沒有 `priority` 屬性的影像，Angular 會顯示警告。頁面的 LCP 元素會根據多項因素而有所不同，例如使用者的螢幕尺寸，因此頁面可能有多個影像應該標記為 `priority`。請參閱 [CSS for Web Vitals](https://web.dev/css-web-vitals/#images-and-largest-contentful-paint-lcp) 以進一步了解詳細資訊。
</docs-step>
<docs-step title="包含寬度和高度">
為了防止 [與影像相關的配置轉移](https://web.dev/css-web-vitals/#images-and-layout-shifts)，NgOptimizedImage 要求您為影像指定高度和寬度，如下所示：

<docs-code language="typescript">

&lt;img ngSrc="cat.jpg" width="400" height="200"&gt;

</docs-code>

對於**回應式圖像**（您已設定其樣式，可以相對於視窗大小放大或縮小），`width` 和 `height` 屬性應為圖像檔案的內在大小。對於回應式圖像，設定 `sizes` 的值也很重要。(#responsive-images)

對於**固定大小的圖片**，`width` 和 `height` 屬性應反映圖片的所需呈現大小。這些屬性的長寬比應始終與圖片的固有長寬比相符。

備註：如果您不知道圖片大小，請考慮使用「填滿模式」來繼承父容器的大小，如以下所述。
</docs-step>
</docs-workflow>

## 使用 `fill` 模式

html
<p>
  fill 模式會在容器內填滿內容，如果內容的寬度或高度比容器大，則內容會被裁切。
</p>

在您想讓圖片填滿容器元素的情況下，您可以使用 `fill` 屬性。當您希望達成「背景圖片」行為時，這通常很有用。當您不知道圖片的精確寬度和高度，但您有一個已知大小的父容器，您希望將圖片放入其中時，這也可能很有用（請參閱下方的「object-fit」）。

當您將 `fill` 屬性新增到您的圖片時，您不需要也不應該包含 `width` 和 `height`，如下例所示：

<docs-code language="typescript">

&lt;img ngSrc="cat.jpg" fill&gt;

</docs-code>

您可以使用 [object-fit](https://developer.mozilla.org/zh-TW/docs/Web/CSS/object-fit) CSS 屬性來變更影像將如何填滿其容器。如果您使用 `object-fit: "contain"` 來設定影像樣式，則該影像將維持其縱橫比，並以「信箱模式」來符合元素。如果您設定 `object-fit: "cover"`，則該元素將保留其縱橫比、完全填滿元素，且部分內容可能會被「裁切」掉。

有關上述內容的視覺範例，請參閱 [MDN object-fit 文件。](https://developer.mozilla.org/zh-TW/docs/Web/CSS/object-fit)

你也可以使用 [object-position property](https://developer.mozilla.org/en-US/docs/Web/CSS/object-position) 調整圖片在它所包含的元素中的位置，來為你的圖片添加樣式。

重要：要正確地呈現「填滿」圖片，其父元素**必須**套用樣式 `position: "relative"`, `position: "fixed"`, 或 `position: "absolute"`。

## 使用 placeholder

<input type="text" placeholder="請輸入您的姓名">

### 自動預留位置

如果使用提供自動圖片調整大小的 CDN 或圖片主機，`NgOptimizedImage` 可以為您的圖片顯示自動的低解析度預留位置。透過將 `placeholder` 屬性新增到圖片，來利用此功能：

<code-example format="typescript" language="typescript">

&lt;img ngSrc="cat.jpg" width="400" height="200" placeholder&gt;

</code-example>

加入這個屬性會自動使用您指定的圖片載入器請求第二個較小的圖片版本。這張小圖片會以 CSS 模糊的形式套用為 `background-image` 風格，同時載入您的圖片。如果沒有提供圖片載入器，就無法產生佔位圖片，並且會擲回錯誤。

預設產生的預留位置大小為寬 30 像素。您可以透過在 `IMAGE_CONFIG` 提供者中指定像素值來變更此大小，如下所示：

<code-example format="typescript" language="typescript">
providers: [
  {
    provide: IMAGE_CONFIG,
    useValue: {
      placeholderResolution: 40
    }
  },
],
</code-example>

如果你想讓模糊預留位置邊緣銳利，你可以將圖片包覆在一個包含的 `<div>` 中，並套用 `overflow: hidden` 樣式。只要 `<div>` 與圖片大小相同（例如使用 `width: fit-content` 樣式），預留位置的「模糊邊緣」就會被隱藏。

### 數據 URL 預留位置

您也可以使用 base64 [資料 URL](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/Data_URLs)指定一個預留位置，而不需要影像載入器。資料網址格式為 `data:image/[imagetype];[data]`，其中 `[imagetype]` 是影像格式，例如 `png`，而 `[data]` 是影像的 base64 編碼。該編碼可以使用命令列或 JavaScript 執行。有關特定命令，請參閱 [MDN 文件](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/Data_URLs#encoding_data_into_base64_format)。以下顯示一個資料 URL 預留位置的範例，其中包含截斷的資料：

<code-example format="typescript" language="typescript">

&lt;img ngSrc="cat.jpg" width="400" height="200" placeholder="data:image/png;base64,iVBORw0K..."&gt;

</code-example>

然而，大型資料 URL 會增加 Angular 捆綁程式的大小並降低頁面載入速度。如果您無法使用影像載入器，Angular 團隊建議將 base64 預留位置影像保持在 4KB 以下，並僅將它們用於重要影像。除了減少預留位置尺寸，請考慮在儲存影像時變更影像格式或參數。在非常低的解析度下，這些參數可能會對檔案大小產生很大的影響。

### 非模糊的預留位置

預設情況下，NgOptimizedImage 會對圖片預留位置套用 CSS 模糊效果。若要呈現沒有模糊效果的預留位置，請提供一個包含 `blur` 屬性的物件作為 `placeholderConfig` 參數，並將其設定為 false。例如：

<code-example format="typescript" language="typescript">

&lt;img ngSrc="cat.jpg" width="400" height="200" placeholder [placeholderConfig]="{blur: false}"&gt;

</code-example>

## 調整圖片樣式

根據圖片的樣式，添加 `width` 和 `height` 屬性可能導致圖片呈現方式不同。如果您的圖片樣式以失真的長寬比呈現圖片，`NgOptimizedImage` 會警告您。

您通常可以透過將 `height: auto` 或 `width: auto` 新增至您的圖片樣式來修復此問題。如需更多資訊，請參閱 [web.dev 文章](https://web.dev/patterns/web-vitals-patterns/images/img-tag)中關於 `<img>` 標籤的內容。

如果圖像上的 `width` 和 `height` 屬性妨礙您使用 CSS 調整圖像大小，請考慮改用 `fill` 模式，並調整圖像父元素的樣式。

## 效能特點

NgOptimizedImage 包含許多旨在改善應用程式載入效能的功能。本節將說明這些功能。

### 加入資源提示

您可以為圖片來源新增 [`preconnect` 資源提示](https://web.dev/preconnect-and-dns-prefetch)，以確保 LCP 圖片能盡快載入。資源提示務必放在文件 `<head>` 中。

<docs-code language="html">

&lt;link rel="preconnect" href="https://my.cdn.origin" /&gt;

</docs-code>

預設情況下，如果您使用協力廠商圖像服務的載入器，則當 `NgOptimizedImage` 指令偵測到服務 LCP 影像的來源沒有 `preconnect` 資源提示時，會在開發期間發出警告。

若要停用這些警告，注入 `PRECONNECT_CHECK_BLOCKLIST` 令牌：

<docs-code language="typescript">

providers: [
  {provide: PRECONNECT_CHECK_BLOCKLIST, useValue: 'https://your-domain.com'}
],

</docs-code>

### 使用自動 `srcset` 以正確尺寸要求影像

定義 [`srcset` 屬性](https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement/srcset) 可確保瀏覽器會根據使用者的視窗要求正確尺寸的圖片，因此不會浪費時間下載尺寸過大的圖片。`NgOptimizedImage` 會根據圖片標籤上 [`sizes` 屬性](https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement/sizes) 的存在與值，為圖片產生適當的 `srcset`。

#### 固定大小的圖片

如果您的圖像大小應為「固定」(亦即在不同裝置上具有相同大小，像素密度除外 (https://web.dev/codelab-density-descriptors/))，則不需要設定 `sizes` 屬性。可以從圖像的寬度和高度屬性自動產生 `srcset`，無需進一步輸入。

範例 srcset 產生：`<img ... srcset="image-400w.jpg 1x, image-800w.jpg 2x">`

#### 響應式圖片

如果您的圖像應具有響應性（即根據視窗大小縮放），那麼您將需要定義[`sizes` 屬性](https://developer.mozilla.org/zh-TW/docs/Web/API/HTMLImageElement/sizes)來產生 `srcset`。

如果您之前沒有使用過 `sizes`，一個好的開始做法是根據視窗寬度設定。例如，如果您的 CSS 導致圖像填滿視窗寬度的 100%，請將 `sizes` 設定為 `100vw`，瀏覽器會在 `srcset` 中選擇最接近視窗寬度的圖像（在考量像素密度之後）。如果您的圖像可能只佔螢幕的一半（例如：在側邊欄中），請將 `sizes` 設定為 `50vw`，以確保瀏覽器選擇較小的圖像。以此類推。

如果您發現以上內容未涵蓋您想要的圖片行為，請參閱 [進階大小值](#進階大小值) 文件。

預設情況下，響應式中斷點為：

`[16, 32, 48, 64, 96, 128, 256, 384, 640, 750, 828, 1080, 1200, 1920, 2048, 3840]`

如果您想自訂這些斷點，您可以使用 `IMAGE_CONFIG` 提供者來執行此操作：

<docs-code language="typescript">
providers: [
  {
    provide: IMAGE_CONFIG,
    useValue: {
      breakpoints: [16, 48, 96, 128, 384, 640, 750, 828, 1080, 1200, 1920]
    }
  },
],
</docs-code>

如果您想手動定義一個 `srcset` 屬性，您可以使用 `ngSrcset` 屬性提供您自己的屬性：

<docs-code language="html">

&lt;img ngSrc="hero.jpg" ngSrcset="100w, 200w, 300w"&gt;

</docs-code>

如果存在 `ngSrcset` 屬性，`NgOptimizedImage` 會根據所包含的尺寸來產生並設定 `srcset`。請勿在 `ngSrcset` 中包含影像檔案名稱 - 指令會從 `ngSrc` 推斷此資訊。此指令同時支援寬度描述符 (例如 `100w`) 和密度描述符 (例如 `1x`)。

<docs-code language="html">

&lt;img ngSrc="hero.jpg" ngSrcset="100w, 200w, 300w" sizes="50vw"&gt;

</docs-code>

### 停用自動 srcset 自動建立

若要停用單一圖片的 srcset 產生，您可以在圖片上新增 `disableOptimizedSrcset` 屬性：

<docs-code language="html">

&lt;img ngSrc="about.jpg" disableOptimizedSrcset&gt;

</docs-code>

### 停用圖片延遲載入

預設情況下，`NgOptimizedImage` 會為所有未標記為 `priority` 的圖片設定 `loading=lazy`。您可以透過設定 `loading` 屬性來停用非優先圖片的此行為。此屬性接受的值為：`eager`、`auto` 和 `lazy`。[請參閱標準圖片 `loading` 屬性的文件，以取得詳細資訊](https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement/loading#value)。

<docs-code language="html">

&lt;img ngSrc="cat.jpg" width="400" height="200" loading="eager"&gt;

</docs-code>

### 進階的 'sizes' 值

你可能希望在不同大小的螢幕上以不同寬度顯示圖像。這種模式的常見範例是基於網格或欄位的版面配置，在行動裝置上呈現單欄，在較大的裝置上則呈現兩欄。你可以使用「媒體查詢」語法在 `sizes` 屬性中擷取此行為，如下所示：

<docs-code language="html">

&lt;img ngSrc="cat.jpg" width="400" height="200" sizes="(max-width: 768px) 100vw, 50vw"&gt;

</docs-code>

在上面的範例中，`sizes` 屬性表示「我希望這張圖片在螢幕寬度小於 768px 的裝置上為螢幕寬度的 100%。否則，我希望它為螢幕寬度的 50%。

有關 `sizes` 屬性的更多資訊，請參閱 [web.dev](https://web.dev/learn/design/responsive-images/#sizes) 或 [mdn](https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement/sizes)。

## 為 `NgOptimizedImage` 配置影像載入器

html
<script type="module">
  import {NgOptimizedImage} from '@angular/common';
  import {defineCustomElements} from '@angular/elements';

  defineCustomElements(window, [
    NgOptimizedImage,
  ]);
</script>

「載入器」是一個函式，可為特定影像檔案產生 [影像轉換網址](https://web.dev/image-cdns/#how-image-cdns-use-urls-to-indicate-optimization-options)。當適當時，`NgOptimizedImage` 會設定影像的尺寸、格式和影像品質轉換。

`NgOptimizedImage` 提供了一個套用沒有轉換的通用載入器，以及各種第三方圖像服務的載入器。它還支援撰寫您自己的客製化載入器。

| 載入器類型 | 行為 |
|:--- |:--- |
| 通用載入器 | 通用載入器傳回的 URL 將永遠與 `src` 的值相符。換句話說，此載入器不套用任何轉換。將 Angular 用於提供圖片的網站是此載入器的主要預期用例。|
| 第三方圖片服務的載入器 | 第三方圖片服務的載入器傳回的 URL 將遵循該特定圖片服務使用的 API 慣例。 |
| 自訂載入器 | 自訂載入器的行為由其開發人員定義。如果你的圖片服務不受 `NgOptimizedImage` 預先配置的載入器支援，你應該使用自訂載入器。|

`NgOptimizedImage` 基於與 Angular 應用程式常用的圖片服務，提供預先配置的載入器，以便搭配下列圖片服務使用：

| 影像服務 | Angular API | 文件 |
|:--- |:--- |:--- |
| Cloudflare 影像調整大小 | `provideCloudflareLoader` | [文件](https://developers.cloudflare.com/images/image-resizing/) |
| Cloudinary | `provideCloudinaryLoader` | [文件](https://cloudinary.com/documentation/resizing_and_cropping) |
| ImageKit | `provideImageKitLoader` | [文件](https://docs.imagekit.io/) |
| Imgix | `provideImgixLoader` | [文件](https://docs.imgix.com/) |
| Netlify | `provideNetlifyLoader` | [文件](https://docs.netlify.com/image-cdn/overview/) |

要使用 **通用載入器** 無需額外的程式碼更改。這是預設行為。

### 內建載入器

要為**第三方圖像服務**使用現有載入器，請將您選擇的服務的提供者工廠新增至 `providers` 陣列。在以下範例中，使用 Imgix 載入器：

<docs-code language="typescript">
providers: [
  provideImgixLoader('https://my.base.url/'),
],
</docs-code>

應該將圖像資產的基本 URL 作為參數傳遞給提供者工廠。對於大多數網站，此基本 URL 應符合下列模式之一：

* <https://yoursite.yourcdn.com>
* <https://subdomain.yoursite.com>
* <https://subdomain.yourcdn.com/yoursite>

您可以在對應的 CDN 提供商的文件中瞭解更多關於基本 URL 結構的資訊。

### 自訂載入器

若要使用**自訂載入器**，請將載入器函數提供為 `IMAGE_LOADER` DI 程式碼的數值。在以下範例中，自訂載入器函數傳回以 `https://example.com` 開頭的 URL，其中包含 `src` 和 `width` 作為 URL 參數。

<docs-code language="typescript">
providers: [
  {
    provide: IMAGE_LOADER,
    useValue: (config: ImageLoaderConfig) => {
      return `https://example.com/images?src=${config.src}&width=${config.width}`;
    },
  },
],
</docs-code>

`NgOptimizedImage` 指令的載入器函數需要一個物件，其型別為 `ImageLoaderConfig`（來自 `@angular/common`），作為其引數，並傳回影像資源的絕對 URL。`ImageLoaderConfig` 物件包含 `src` 屬性，以及選用的 `width` 和 `loaderParams` 屬性。

注意：即使可能並不總是存在 `width` 屬性，自訂載入器必須使用它來支援以各種寬度要求影像，才能讓 `ngSrcset` 正常運作。

### `loaderParams` 屬性

`NgOptimizedImage` 指令支援一個額外的屬性，稱為 `loaderParams`，專門設計來支援使用自訂載入器。`loaderParams` 屬性取得一個物件，其任何屬性皆為值，且本身不執行任何動作。`loaderParams` 中的資料會新增到傳遞給自訂載入器的 `ImageLoaderConfig` 物件，且可拿來控制載入器的行為。

`loaderParams` 的常見用途是控制進階的圖片 CDN 功能。

### 範例自訂載入器

以下顯示自訂載入器函數的範例。此範例函數會連結 `src` 和 `width`，並使用 `loaderParams` 來控制圓角的客製 CDN 功能：

<docs-code language="typescript">
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
</docs-code>

請注意，在上面的範例中，我們發明了「roundedCorners」屬性名稱，以控制我們的自訂載入器的功能。然後，我們可以在建立影像時使用此功能，如下所示：

<docs-code language="html">

&lt;img ngSrc="profile.jpg" width="300" height="300" [loaderParams]="{roundedCorners: true}"&gt;

</docs-code>

## 常見問題

### NgOptimizedImage 是否支援 `background-image` css 屬性？

NgOptimizedImage 不直接支援 `background-image` css 屬性，但它被設計成可以輕鬆支援將圖片作為另一個元素背景的用例。

以下是一份從 `background-image` 遷移到 `NgOptimizedImage` 的簡單分步流程。在這些步驟中，我們將把具有圖像背景的元素稱為「包含元素」：

1) 從包含元素中移除 `background-image` 樣式。
2) 確保包含元素具有 `position: "relative"`, `position: "fixed"`, 或 `position: "absolute"`。
3) 建立一個新的影像元素作為包含元素的子元素，使用 `ngSrc` 以啟用 `NgOptimizedImage` 指令。
4) 給予該元素 `fill` 屬性。請勿包含 `height` 和 `width`。
5) 如果您認為此影像可能是您的 [LCP 元素](https://web.dev/lcp/)，請將 `priority` 屬性新增至影像元素。

您可以調整背景圖片填滿容器的方式，如 [使用填滿模式](#using-fill-mode) 區段所述。

### 為什麼我無法在 `NgOptimizedImage` 中使用 `src`？

由於關於瀏覽器如何載入影像的技術考量，選擇 `ngSrc` 屬性作為 NgOptimizedImage 的觸發器。NgOptimizedImage 對 `loading` 屬性進行程式化變更 -- 如果瀏覽器在這些變更完成之前看到 `src` 屬性，它將開始急切下載影像檔案，而載入變更將被忽略。

### 我可以在同一頁面中使用兩個不同的圖片網域嗎？

[影像載入器](#configuring-an-image-loader-for-ngoptimizedimage) 提供者模式的設計儘可能簡單，適用於在元件中僅使用單一影像 CDN 的常見用例。但是，使用單一提供者來管理多個影像 CDN 仍然非常可行。

為此，我們建議撰寫一個 [自訂圖像載入器](#custom-loaders)，該載入器使用 [`loaderParams` 屬性](#the-loaderparams-property) 來傳遞指定應使用哪個圖像 CDN 的旗標，然後根據該旗標呼叫適當的載入器。

### 是否可以為我喜好的 CDN 新增內建載入器？

出於維護原因，我們目前不打算在 Angular 儲存庫中支援額外內建的載入器。相反的，我們鼓勵開發人員將任何額外的影像載入器發佈為第三方套件。
