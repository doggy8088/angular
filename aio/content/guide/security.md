# 安全性

本主題說明 Angular 內建的防護措施，如何抵禦常見的 Web 應用程式弱點與攻擊，例如跨站指令碼攻擊。 本主題不涵蓋應用程式層級的安全性，例如驗證與授權。

關於下述攻擊與緩解措施的更多資訊，請參閱 [Open Web Application Security Project (OWASP) Guide](https://www.owasp.org/index.php/Category:OWASP_Guide_Project)。

你可以在 Stackblitz 中執行 <live-example></live-example>，並從那裡下載程式碼。

<a id="report-issues"></a>

<div class="callout is-important">

<header>回報弱點</header>

Angular 是 Google [Open Source Software Vulnerability Reward Program](https://bughunters.google.com/about/rules/6521337925468160/google-open-source-software-vulnerability-reward-program-rules) 的一部分。[若發現 Angular 的弱點，請至 https://bughunters.google.com 提交報告](https://bughunters.google.com/report)。

關於 Google 如何處理安全性問題的更多資訊，請參閱 [Google's security philosophy](https://www.google.com/about/appsecurity)。

</div>

<a id="best-practices"></a>

<div class="callout is-helpful">

<header>最佳實務</header>

| 做法 | 詳細說明 |
|:--- |:--- |
| 隨時更新到最新的 Angular 函式庫版本 | Angular 函式庫會定期更新，這些更新可能會修正先前版本中發現的安全性缺陷。請查看 Angular 的[變更日誌](https://github.com/angular/angular/blob/main/CHANGELOG.md)，了解與安全性相關的更新。 |
| 不要修改你手中的 Angular | 私人客製化的 Angular 版本往往會落後於目前版本，也可能不包含重要的安全性修正與改進。請改為與社群分享你的 Angular 改進，並提出 pull request。 |
| 避免使用文件中標示為「*安全性風險*」的 Angular API | 如需更多資訊，請參閱本頁的[信任安全值](guide/security#bypass-security-apis)一節。 |

</div>

## 防止跨站指令碼攻擊 (XSS)

[跨站指令碼攻擊 (XSS)](https://en.wikipedia.org/wiki/Cross-site_scripting) 讓攻擊者能把惡意程式碼注入網頁。 這類程式碼接著可能竊取使用者與登入資料，或冒充使用者執行操作。 這是網路上最常見的攻擊之一。

要阻擋 XSS 攻擊，你必須防止惡意程式碼進入文件物件模型 (DOM)。 例如，攻擊者若能誘使你把 `<script>` 標籤插入 DOM，就能在你的網站上執行任意程式碼。 攻擊不限於 `<script>` 標籤，DOM 中許多元素與屬性都允許執行程式碼，例如 `<img alt="" onerror="...">` 與 `<a href="javascript:...">`。 只要攻擊者控制的資料進入 DOM，就要預期會出現安全性弱點。

### Angular 的跨站指令碼安全性模型

為了有系統地阻擋 XSS 漏洞，Angular 預設把所有值都視為不受信任。 當一個值透過範本繫結或插值插入 DOM 時，Angular 會清理並跳脫不受信任的值。 若某個值已在 Angular 之外清理完成且被視為安全，請把該 [值標示為受信任](#bypass-security-apis)，以告知 Angular。

與用於渲染的值不同，Angular 範本預設被視為受信任，應當作可執行程式碼看待。 絕不要把使用者輸入與範本語法串接起來建立範本。 這麼做會讓攻擊者能把 [任意程式碼注入](https://en.wikipedia.org/wiki/Code_injection) 你的應用程式。 為了防止這類弱點，在正式部署時請務必使用預設的 [Ahead-Of-Time (AOT) 範本編譯器](guide/security#offline-template-compiler)。

使用內容安全性原則與 Trusted Types，可以提供額外一層防護。 這些 Web 平台功能在 DOM 層級運作，而這正是防止 XSS 問題最有效的位置。在這一層，它們無法被其他較低層級的 API 繞過。 因此，強烈建議善用這些功能。作法是：為應用程式設定 [內容安全性原則](#內容安全性原則)，並啟用 [Trusted Types 強制執行](#trusted-types)。

### 清理與安全性上下文

*清理* 是檢查不受信任的值，把它轉換為可以安全插入 DOM 的值。 在許多情況下，清理根本不會改變值。 清理取決於上下文： 在 CSS 中無害的值，在 URL 中可能具有危險性。

Angular 定義了下列安全性上下文：

| 安全性上下文 | 說明 |
|:---               |:---     |
| HTML | 把值解讀為 HTML 時使用，例如繫結到 `innerHtml` 時。 |
| Style | 把 CSS 繫結到 `style` 屬性時使用。 |
| URL | 用於 URL 屬性，例如 `<a href>`。 |
| Resource URL | 會被載入並當作程式碼執行的 URL，例如 `<script src>` 中的 URL。 |

Angular 會清理 HTML 與 URL 中不受信任的值。資源 URL 無法清理，因為它們含有任意程式碼。 在開發模式下，當 Angular 必須在清理過程中改變某個值時，會在主控台印出警告。

### 清理範例

下列範本繫結了 `htmlSnippet` 的值：一次是把它插值到元素的內容中，另一次是把它繫結到元素的 `innerHTML` 屬性：

<code-example header="src/app/inner-html-binding.component.html" path="security/src/app/inner-html-binding.component.html"></code-example>

插值的內容一律會被跳脫，HTML 不會被解讀，瀏覽器會在元素的文字內容中顯示角括號。

若要讓 HTML 被解讀，請把它繫結到 `innerHTML` 這類 HTML 屬性。 請注意，把攻擊者可能控制的值繫結到 `innerHTML`，通常會造成 XSS 弱點。 例如，可以用下列方式執行 JavaScript：

<code-example header="src/app/inner-html-binding.component.ts (class)" path="security/src/app/inner-html-binding.component.ts" region="class"></code-example>

Angular 會把該值辨識為不安全並自動清理，移除 `script` 元素，但保留 `<b>` 元素這類安全內容。

<div class="lightbox">

<img alt="顯示內插與繫結 HTML 值的螢幕截圖" src="generated/images/guide/security/binding-inner-html.png">

</div>

### 直接使用 DOM API 與明確的清理呼叫

除非你強制執行 Trusted Types，否則瀏覽器內建的 DOM API 不會自動保護你免於安全性弱點。 例如，`document`、透過 `ElementRef` 取得的節點，以及許多第三方 API，都含有不安全的方法。 同樣地，若你與其他操作 DOM 的程式庫互動，很可能無法享有與 Angular 插值相同的自動清理。 請盡量避免直接與 DOM 互動，改用 Angular 範本。

若無法避開這種情況，請使用 Angular 內建的清理函式。 以 [DomSanitizer.sanitize](api/platform-browser/DomSanitizer#sanitize) 方法與適當的 `SecurityContext`，清理不受信任的值。 該函式也接受使用 `bypassSecurityTrust` … 函式標示為受信任的值，並且不會清理它們，如 [下文所述](#bypass-security-apis)。

<a id="bypass-security-apis"></a>

### 信任安全值

有時應用程式確實需要包含可執行程式碼、顯示來自某個 URL 的 `<iframe>`，或建構可能危險的 URL。 在這些情況下若要防止自動清理，請告知 Angular：你已檢查該值、確認它的建立方式，並確定它安全無虞。 請務必 _小心謹慎_。 若你信任了一個可能惡意的值，就是在應用程式中引入安全性弱點。 如有疑問，請找專業的安全性審查人員。

若要把值標示為受信任，請注入 `DomSanitizer`，並呼叫下列其中一個方法：

*   `bypassSecurityTrustHtml`
*   `bypassSecurityTrustScript`
*   `bypassSecurityTrustStyle`
*   `bypassSecurityTrustUrl`
*   `bypassSecurityTrustResourceUrl`

請記住，值是否安全取決於上下文，所以請依值的預期用途選擇正確的上下文。 假設下列範本需要把 URL 繫結到一個 `javascript:alert(...)` 呼叫：

<code-example header="src/app/bypass-security.component.html (URL)" path="security/src/app/bypass-security.component.html" region="URL"></code-example>

通常，Angular 會自動清理 URL、停用危險的程式碼，並在開發模式下把這個動作記錄到主控台。 若要防止這件事，請使用 `bypassSecurityTrustUrl` 呼叫，把 URL 值標示為受信任的 URL：

<code-example header="src/app/bypass-security.component.ts (trust-url)" path="security/src/app/bypass-security.component.ts" region="trust-url"></code-example>

<div class="lightbox">

<img alt="顯示由信任 URL 建立的警示方塊的螢幕截圖" src="generated/images/guide/security/bypass-security-component.png">

</div>

若需要把使用者輸入轉換為受信任的值，請使用元件方法。 下列範本讓使用者輸入 YouTube 影片 ID，並在 `<iframe>` 中載入對應的影片。 `<iframe src>` 屬性屬於資源 URL 安全性上下文，因為不受信任的來源可能夾帶檔案下載，讓不知情的使用者執行。 為了防止這件事，請呼叫元件上的方法來建構受信任的影片 URL，讓 Angular 允許繫結到 `<iframe src>`：

<code-example header="src/app/bypass-security.component.html (iframe)" path="security/src/app/bypass-security.component.html" region="iframe"></code-example>

<code-example header="src/app/bypass-security.component.ts (trust-video-url)" path="security/src/app/bypass-security.component.ts" region="trust-video-url"></code-example>

<a id="content-security-policy"></a>

### 內容安全性原則

內容安全性原則 \(CSP\) 是一種防止 XSS 的深度防禦技術。 若要啟用 CSP，請設定你的 Web 伺服器傳回適當的 `Content-Security-Policy` HTTP 標頭。 關於內容安全性原則的更多資訊，請參閱 Google Developers 網站上的 [Web Fundamentals guide](https://developers.google.com/web/fundamentals/security/csp)。

全新 Angular 應用程式所需的最小原則如下：

<code-example format="none" language="none">

default-src 'self'; style-src 'self' 'nonce-randomNonceGoesHere'; script-src 'self' 'nonce-randomNonceGoesHere';

</code-example>

提供 Angular 應用程式服務時，伺服器應在每個請求的 HTTP 標頭中包含隨機產生的 nonce。 你必須把這個 nonce 提供給 Angular，框架才能算繪 `<style>` 元素。 你可以透過以下兩種方式之一，為 Angular 設定 nonce：

1. 在根應用程式元素上設定 `ngCspNonce` 屬性，例如 `<app ngCspNonce="randomNonceGoesHere"></app>`。如果你可以使用伺服器端範本，在建構回應時同時把 nonce 加入標頭與 `index.html`，請使用這個方法。
2. 使用 `CSP_NONCE` 注入權杖提供 nonce。如果你可以在執行階段取得 nonce，而且希望能夠快取 `index.html`，請使用這個方法。

<code-example format="typescript" language="typescript">

import {bootstrapApplication, CSP_NONCE} from '&commat;angular/core';
import {AppComponent} from './app/app.component';

bootstrapApplication(AppComponent, {
  providers: [{
    provide: CSP_NONCE,
    useValue: globalThis.myRandomNonceValue
  }]
});

</code-example>

<div class="callout is-helpful">

請務必確保你提供的 nonce <strong>每個請求都唯一</strong>，且不可預測或猜測。 若攻擊者能預測未來的 nonce，就能繞過 CSP 提供的防護。

</div>

若你的專案無法產生 nonce，你可以把 `'unsafe-inline'` 加入 CSP 標頭的 `style-src` 區段，允許內嵌樣式。

| 區段 | 說明 |
|:---                     |:---     |
| `default-src 'self';` | 允許頁面從相同來源載入所有需要的資源。 |
| `style-src 'self' 'nonce-randomNonceGoesHere';` | 允許頁面從相同來源 \(`'self'`\) 載入全域樣式，以及 Angular 以 `nonce-randomNonceGoesHere` 插入的樣式。 |
| `script-src 'self' 'nonce-randomNonceGoesHere';` | 允許頁面從相同來源 \(`'self'`\) 載入 JavaScript，以及 Angular CLI 以 `nonce-randomNonceGoesHere` 插入的指令碼。只有在使用關鍵 CSS 內嵌時才需要。 |

Angular 本身只需要這些設定就能正確運作。 隨著專案成長，你可能需要擴充 CSP 設定，以因應應用程式特有的額外功能。

<a id="trusted-types"></a>

<!-- vale Angular.Google_Headings = NO -->

### 強制執行 Trusted Types

<!-- vale Angular.Google_Headings = YES -->

建議你使用 [Trusted Types](https://w3c.github.io/trusted-types/dist/spec/)，協助保護應用程式免於跨站指令碼攻擊。 Trusted Types 是一項 [Web 平台](https://en.wikipedia.org/wiki/Web_platform) 功能，透過強制更安全的撰碼實務，協助你防止跨站指令碼攻擊。 Trusted Types 也能協助簡化應用程式程式碼的稽核。

<div class="callout is-helpful">

Trusted Types 可能尚未在你的應用程式目標的所有瀏覽器中提供。 若啟用 Trusted Types 的應用程式在不支援 Trusted Types 的瀏覽器中執行，應用程式的功能仍會保留。你的應用程式會透過 Angular 的 DomSanitizer 防範 XSS。 目前的瀏覽器支援情況請參閱 [caniuse.com/trusted-types](https://caniuse.com/trusted-types)。

</div>

若要為應用程式強制執行 Trusted Types，你必須設定應用程式的 Web 伺服器，發出帶有下列其中一個 Angular 原則的 HTTP 標頭：

| 原則 | 說明 |
|:---                     |:---    |
| `angular` | 此原則用於 Angular 內部經過安全性審查的程式碼，在強制執行 Trusted Types 時，Angular 需要它才能運作。任何內嵌範本值或經 Angular 清理的內容，都會被此原則視為安全。 |
| `angular#unsafe-bypass` | 使用 Angular [DomSanitizer](api/platform-browser/DomSanitizer) 中任何繞過安全性的方法（例如 `bypassSecurityTrustHtml`）的應用程式，會使用此原則。任何使用這些方法的應用程式都必須啟用此原則。 |
| `angular#unsafe-jit` | 此原則由 [Just-In-Time (JIT) 編譯器](api/core/Compiler) 使用。若你的應用程式直接與 JIT 編譯器互動，或使用 [platform browser dynamic](api/platform-browser-dynamic/platformBrowserDynamic) 在 JIT 模式下執行，就必須啟用此原則。 |
| `angular#bundler` | Angular CLI 建置器在建立延遲載入區塊檔案時使用此原則。 |

你應在下列位置設定 Trusted Types 的 HTTP 標頭：

*   正式環境服務基礎架構
*   Angular CLI（`ng serve`），使用 `headers` 檔案中的 `angular.json` 屬性，供本機開發與端對端測試使用
*   Karma（`ng test`），使用 `customHeaders` 檔案中的 `karma.config.js` 屬性，供單元測試使用

以下是專為 Trusted Types 與 Angular 設定的標頭範例：

<code-example format="html" language="html">

Content-Security-Policy: trusted-types angular; require-trusted-types-for 'script';

</code-example>

以下是專為 Trusted Types，以及使用 Angular [DomSanitizer](api/platform-browser/DomSanitizer) 中任何繞過安全性方法的 Angular 應用程式所設定的標頭範例：

<code-example format="html" language="html">

Content-Security-Policy: trusted-types angular angular#unsafe-bypass; require-trusted-types-for 'script';

</code-example>

以下是專為 Trusted Types 與使用 JIT 的 Angular 應用程式所設定的標頭範例：

<code-example format="html" language="html">

Content-Security-Policy: trusted-types angular angular#unsafe-jit; require-trusted-types-for 'script';

</code-example>

以下是專為 Trusted Types 與使用模組延遲載入的 Angular 應用程式所設定的標頭範例：

<code-example language="html">

Content-Security-Policy: trusted-types angular angular#bundler; require-trusted-types-for 'script';

</code-example>

<div class="callout is-helpful">

<header>社群貢獻</header>

若要深入了解如何疑難排解 Trusted Types 設定，下列資源可能有幫助：

[使用 Trusted Types 預防以 DOM 為基礎的跨站指令碼弱點](https://web.dev/trusted-types/#how-to-use-trusted-types)

</div>

<a id="offline-template-compiler"></a>

### 使用 AOT 範本編譯器

AOT 範本編譯器能防止一整類稱為範本注入的弱點，並大幅提升應用程式效能。 AOT 範本編譯器是 Angular CLI 應用程式使用的預設編譯器，你應在所有正式部署中使用它。

AOT 編譯器的替代方案是 JIT 編譯器，它在執行時於瀏覽器內把範本編譯為可執行的範本程式碼。Angular 信任範本程式碼，因此動態產生範本並加以編譯（尤其是含有使用者資料的範本），會繞過 Angular 內建的防護。這是一種安全性反模式。 關於如何安全地動態建構表單，請參閱 [動態表單](guide/dynamic-form) 指南。

<a id="server-side-xss"></a>

### 伺服器端 XSS 防護

在伺服器上建構的 HTML 容易受到注入攻擊。 把範本程式碼注入 Angular 應用程式，等同於把可執行程式碼注入應用程式：攻擊者將取得應用程式的完全控制權。 為了防止這件事，請使用會自動跳脫值的範本語言，以防止伺服器端的 XSS 弱點。 不要在伺服器端使用範本語言建立 Angular 範本。這麼做很有可能引入範本注入弱點。

<a id="http"></a>

<!-- vale Angular.Google_Acronyms = NO -->

## HTTP 層級的弱點

Angular 內建支援，協助防止兩種常見的 HTTP 弱點：跨站請求偽造 \(CSRF 或 XSRF\) 與跨站指令碼包含 \(XSSI\)。 這兩者都必須主要在伺服器端緩解，但 Angular 提供了輔助工具，讓用戶端的整合更容易。

<a id="xsrf"></a>

### 跨站請求偽造

在跨站請求偽造 \(CSRF 或 XSRF\) 攻擊中，攻擊者誘使使用者造訪另一個帶有惡意程式碼的網頁 \(例如 `evil.com`\)。這個網頁會秘密地向應用程式的 Web 伺服器 \(例如 `example-bank.com`\) 傳送惡意請求。

假設使用者已登入 `example-bank.com` 的應用程式。 使用者開啟一封電子郵件，點選連往 `evil.com` 的連結，連結在新分頁中開啟。

`evil.com` 頁面立即向 `example-bank.com` 傳送惡意請求。 這個請求可能是把使用者的帳戶資金轉到攻擊者的帳戶。 瀏覽器會自動把 `example-bank.com` 的 cookie（包括驗證 cookie）隨這個請求一起傳送。

若 `example-bank.com` 伺服器缺乏 XSRF 防護，就無法分辨來自應用程式的合法請求與來自 `evil.com` 的偽造請求。

為了防止這件事，應用程式必須確保使用者請求源自真正的應用程式，而不是其他網站。 伺服器與用戶端必須合作，才能阻擋這類攻擊。

在一種常見的反 XSRF 技術中，應用程式伺服器會在 cookie 中傳送隨機建立的驗證權杖。 用戶端程式碼讀取該 cookie，並在後續所有請求中加入帶有該權杖的自訂請求標頭。 伺服器會把收到的 cookie 值與請求標頭值進行比較，若值缺失或不相符，就拒絕該請求。

這項技術之所以有效，是因為所有瀏覽器都實作了 _同源政策_。 只有設定 cookie 的網站的程式碼，才能讀取該網站的 cookie，並對發往該網站的請求設定自訂標頭。 這表示只有你的應用程式能讀取這個 cookie 權杖並設定自訂標頭。 `evil.com` 上的惡意程式碼做不到。

Angular 的 `HttpClient` 內建支援這種技術的用戶端部分。如需了解更多資訊，請參閱 [HttpClient 指南](guide/http-security-xsrf-protection)。

關於 Open Web Application Security Project \(OWASP\) 的 CSRF 資訊，請參閱 [Cross-Site Request Forgery (CSRF)](https://owasp.org/www-community/attacks/csrf) 與 [Cross-Site Request Forgery (CSRF) Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html)。 史丹佛大學的論文 [Robust Defenses for Cross-Site Request Forgery](https://seclab.stanford.edu/websec/csrf/csrf.pdf) 提供了豐富的細節。

另請參閱 Dave Smith 在 AngularConnect 2016 的 [XSRF 演講](https://www.youtube.com/watch?v=9inczw6qtpY "Cross Site Request Funkery Securing Your Angular Apps From Evil Doers")。

<!-- vale Angular.Google_Acronyms = YES -->

<a id="xssi"></a>

### 跨站指令碼包含（XSSI）

跨站指令碼包含，也稱為 JSON 弱點，可讓攻擊者的網站讀取 JSON API 的資料。 這種攻擊在較舊的瀏覽器上，透過覆寫內建的 JavaScript 物件建構函式，再使用 `<script>` 標籤包含 API URL 來達成。

只有當傳回的 JSON 可作為 JavaScript 執行時，這種攻擊才會成功。 伺服器可以為所有 JSON 回應加上前綴，使其無法執行，藉此防止攻擊；慣例上使用眾所周知的字串 `")]}',\n"`。

Angular 的 `HttpClient` 程式庫認得這項慣例，會在進一步剖析之前，自動從所有回應中移除字串 `")]}',\n"`。

更多資訊請參閱這篇 [Google Web 安全性部落格文章](https://security.googleblog.com/2011/05/website-security-for-webmasters.html) 的 XSSI 一節。

<a id="code-review"></a>

## 稽核 Angular 應用程式

Angular 應用程式必須遵循與一般 Web 應用程式相同的安全性原則，並依此接受稽核。在安全性審查中應稽核的 Angular 專屬 API（例如 [*bypassSecurityTrust*](guide/security#bypass-security-apis) 方法），在文件中會被標示為安全性敏感。

<!-- links -->

<!-- external links -->

<!-- end links -->

@reviewed 2023-05-16
