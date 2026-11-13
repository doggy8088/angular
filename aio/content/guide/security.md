# 安全性

本頁說明 Angular 內建的防護措施，如何抵禦常見的 Web 應用程式弱點與攻擊，例如跨站指令碼攻擊。本頁不涵蓋應用程式層級的安全性，例如驗證（_Who is this user?_）與授權（_What can this user do?_）。

關於下述攻擊與緩解措施的更多資訊，請參閱 [OWASP Guide Project](https://www.owasp.org/index.php/Category:OWASP_Guide_Project)。

你可以在 Stackblitz 中執行 <live-example></live-example>，並從那裡下載程式碼。



<h2 id='report-issues'>
  回報弱點
</h2>



若要回報 Angular 本身的弱點，請寄信至 [security@angular.io](mailto:security@angular.io)。

關於 Google 如何處理安全性問題的更多資訊，請參閱 [Google's security philosophy](https://www.google.com/about/appsecurity/)。



<h2 id='best-practices'>
  最佳實務
</h2>



* **隨時更新到最新的 Angular 函式庫版本。**
Angular 函式庫會定期更新，這些更新可能會修正先前版本中發現的安全性缺陷。請查看 Angular 的[變更日誌](https://github.com/angular/angular/blob/master/CHANGELOG.md)，了解與安全性相關的更新。

* **不要修改你手中的 Angular。**
私人客製化的 Angular 版本往往會落後於目前版本，也可能不包含重要的安全性修正與改進。請改為與社群分享你的 Angular 改進，並提出 pull request。

* **避免使用文件中標示為「_Security Risk_」的 Angular API。**
如需更多資訊，請參閱本頁的[信任安全值](guide/security#bypass-security-apis)一節。



<h2 id='xss'>
  防止跨站指令碼攻擊 (XSS)
</h2>



[跨站指令碼攻擊 (XSS)](https://en.wikipedia.org/wiki/Cross-site_scripting) 讓攻擊者能把惡意程式碼注入網頁。這類程式碼接著可能竊取使用者資料（尤其是登入資料），或採取冒充使用者的操作。這是網路上最常見的攻擊之一。

要阻擋 XSS 攻擊，你必須防止惡意程式碼進入 DOM (文件物件模型)。例如，攻擊者若能誘使你把 `<script>` 標籤插入 DOM，就能在你的網站上執行任意程式碼。攻擊不限於 `<script>` 標籤&mdash;DOM 中許多元素與屬性都允許執行程式碼，例如 `<img onerror="...">` 與 `<a href="javascript:...">`。只要攻擊者控制的資料進入 DOM，就要預期會出現安全性弱點。

### Angular 的跨站指令碼安全性模型

為了有系統地阻擋 XSS 漏洞，Angular 預設把所有值都視為不受信任。當一個值從範本透過屬性繫結、特性繫結、樣式繫結、類別繫結或插值插入 DOM 時，Angular 會清理並跳脫不受信任的值。

_Angular 範本等同於可執行程式碼_：範本中的 HTML、特性與繫結表達式（但不包括被繫結的值）都被信任為安全。這意味著應用程式必須防止攻擊者能控制的值進入範本的原始碼。絕不要把使用者輸入與範本串接起來產生範本原始碼。為了防止這類弱點，請使用[離線範本編譯器](guide/security#offline-template-compiler)，也就是所謂的 _template injection_。

### 清理與安全性上下文

_清理_ 是檢查不受信任的值，把它轉換為可以安全插入 DOM 的值。在許多情況下，清理根本不會改變值。清理取決於上下文：在 CSS 中無害的值，在 URL 中可能具有危險性。

Angular 定義了下列安全性上下文：

* **HTML** 把值解讀為 HTML 時使用，例如繫結到 `innerHtml` 時。
* **Style** 把 CSS 繫結到 `style` 屬性時使用。
* **URL** 用於 URL 屬性，例如 `<a href>`。
* **Resource URL** 會被載入並當作程式碼執行的 URL，例如 `<script src>` 中的 URL。

Angular 會清理 HTML、樣式與 URL 中不受信任的值；資源 URL 無法清理，因為它們含有任意程式碼。在開發模式下，當 Angular 必須在清理過程中改變某個值時，會在主控台印出警告。

### 清理範例

下列範本繫結了 `htmlSnippet` 的值：一次是把它插值到元素的內容中，另一次是把它繫結到元素的 `innerHTML` 屬性：


<code-example path="security/src/app/inner-html-binding.component.html" header="src/app/inner-html-binding.component.html"></code-example>



插值的內容一律會被跳脫&mdash;HTML 不會被解讀，瀏覽器會在元素的文字內容中顯示角括號。

若要讓 HTML 被解讀，請把它繫結到 `innerHTML` 這類 HTML 屬性。不過，把攻擊者可能控制的值繫結到 `innerHTML`，通常會造成 XSS 弱點。例如，`<script>` 標籤中包含的程式碼會被執行：


<code-example path="security/src/app/inner-html-binding.component.ts" header="src/app/inner-html-binding.component.ts (class)" region="class"></code-example>



Angular 會把該值辨識為不安全並自動清理，移除 `<script>` 標籤，但保留 `<b>` 元素這類安全內容。


<div class="lightbox">
  <img src='generated/images/guide/security/binding-inner-html.png' alt='顯示內插與繫結 HTML 值的螢幕截圖'>
</div>


### 直接使用 DOM API 與明確的清理呼叫

瀏覽器內建的 DOM API 不會自動保護你免於安全性弱點。例如，`document`、透過 `ElementRef` 取得的節點，以及許多第三方 API，都含有不安全的方法。同樣地，若你與其他操作 DOM 的程式庫互動，很可能無法享有與 Angular 插值相同的自動清理。請盡量避免直接與 DOM 互動，改用 Angular 範本。

若無法避開這種情況，請使用 Angular 內建的清理函式。以 [DomSanitizer.sanitize](api/platform-browser/DomSanitizer#sanitize) 方法與適當的 `SecurityContext`，清理不受信任的值。該函式也接受使用 `bypassSecurityTrust`... 函式標示為受信任的值，並且不會清理它們，如[下文所述](#bypass-security-apis)。

### 內容安全性原則

內容安全性原則 (CSP) 是一種防止 XSS 的深度防禦技術。若要啟用 CSP，請設定你的 Web 伺服器傳回適當的 `Content-Security-Policy` HTTP 標頭。關於內容安全性原則的更多資訊，請參閱 HTML5Rocks 網站上的 [An Introduction to Content Security Policy](http://www.html5rocks.com/en/tutorials/security/content-security-policy/)。


{@a offline-template-compiler}


### 使用離線範本編譯器

離線範本編譯器能防止一整類稱為範本注入的弱點，並大幅提升應用程式效能。請在正式部署中使用離線範本編譯器；不要動態產生範本。Angular 信任範本程式碼，因此產生範本（尤其是含有使用者資料的範本）會繞過 Angular 內建的防護。關於如何安全地動態建構表單，請參閱[動態表單](guide/dynamic-form)指南頁面。

### 伺服器端 XSS 防護

在伺服器上建構的 HTML 容易受到注入攻擊。把範本程式碼注入 Angular 應用程式，等同於把可執行程式碼注入應用程式：攻擊者將取得應用程式的完全控制權。為了防止這件事，請使用會自動跳脫值的範本語言，以防止伺服器端的 XSS 弱點。不要在伺服器端使用範本語言產生 Angular 範本；這麼做很有可能引入範本注入弱點。



<h2 id='bypass-security-apis'>
  信任安全值
</h2>



有時應用程式確實需要包含可執行程式碼、顯示來自某個 URL 的 `<iframe>`，或建構可能危險的 URL。在任何這類情況下若要防止自動清理，請告知 Angular：你已檢查該值、確認它的產生方式，並確定它永遠安全無虞。但請務必 *小心謹慎*。若你信任了一個可能惡意的值，就是在應用程式中引入安全性弱點。如有疑問，請找專業的安全性審查人員。

若要把值標示為受信任，請注入 `DomSanitizer`，並呼叫下列其中一個方法：

* `bypassSecurityTrustHtml`
* `bypassSecurityTrustScript`
* `bypassSecurityTrustStyle`
* `bypassSecurityTrustUrl`
* `bypassSecurityTrustResourceUrl`

請記住，值是否安全取決於上下文，所以請依值的預期用途選擇正確的上下文。假設下列範本需要把 URL 繫結到一個 `javascript:alert(...)` 呼叫：


<code-example path="security/src/app/bypass-security.component.html" header="src/app/bypass-security.component.html (URL)" region="URL"></code-example>



通常，Angular 會自動清理 URL、停用危險的程式碼，並在開發模式下把這個動作記錄到主控台。若要防止這件事，請使用 `bypassSecurityTrustUrl` 呼叫，把 URL 值標示為受信任的 URL：


<code-example path="security/src/app/bypass-security.component.ts" header="src/app/bypass-security.component.ts (trust-url)" region="trust-url"></code-example>



<div class="lightbox">
  <img src='generated/images/guide/security/bypass-security-component.png' alt='顯示由信任 URL 建立的警示方塊的螢幕截圖'>
</div>



若需要把使用者輸入轉換為受信任的值，請使用控制器方法。下列範本讓使用者輸入 YouTube 影片 ID，並在 `<iframe>` 中載入對應的影片。`<iframe src>` 屬性屬於資源 URL 安全性上下文，因為不受信任的來源可能夾帶檔案下載，讓不知情的使用者執行。因此，請呼叫控制器上的方法來建構受信任的影片 URL，讓 Angular 允許繫結到 `<iframe src>`：


<code-example path="security/src/app/bypass-security.component.html" header="src/app/bypass-security.component.html (iframe)" region="iframe"></code-example>



<code-example path="security/src/app/bypass-security.component.ts" header="src/app/bypass-security.component.ts (trust-video-url)" region="trust-video-url"></code-example>




<h2 id='http'>
  HTTP 層級的弱點
</h2>



Angular 內建支援，協助防止兩種常見的 HTTP 弱點：跨站請求偽造 (CSRF 或 XSRF) 與跨站指令碼包含 (XSSI)。這兩者都必須主要在伺服器端緩解，但 Angular 提供了輔助工具，讓用戶端的整合更容易。


<h3 id='xsrf'>
  跨站請求偽造
</h3>



在跨站請求偽造 (CSRF 或 XSRF) 攻擊中，攻擊者誘使使用者造訪另一個帶有惡意程式碼的網頁（例如 `evil.com`），該程式碼會秘密地向應用程式的 Web 伺服器（例如 `example-bank.com`）傳送惡意請求。

假設使用者已登入 `example-bank.com` 的應用程式。使用者開啟一封電子郵件，點選連往 `evil.com` 的連結，連結在新分頁中開啟。

`evil.com` 頁面立即向 `example-bank.com` 傳送惡意請求。這個請求可能是把使用者的帳戶資金轉到攻擊者的帳戶。瀏覽器會自動把 `example-bank.com` 的 cookie（包括驗證 cookie）隨這個請求一起傳送。

若 `example-bank.com` 伺服器缺乏 XSRF 防護，就無法分辨來自應用程式的合法請求與來自 `evil.com` 的偽造請求。

為了防止這件事，應用程式必須確保使用者請求源自真正的應用程式，而不是其他網站。伺服器與用戶端必須合作，才能阻擋這類攻擊。

在一種常見的反 XSRF 技術中，應用程式伺服器會在 cookie 中傳送隨機產生的驗證權杖。用戶端程式碼讀取該 cookie，並在之後的所有請求中加入帶有該權杖的自訂請求標頭。伺服器會把收到的 cookie 值與請求標頭值進行比較，若值缺失或不相符，就拒絕該請求。

這項技術之所以有效，是因為所有瀏覽器都實作了 _同源政策_。只有設定 cookie 的網站的程式碼，才能讀取該網站的 cookie，並對發往該網站的請求設定自訂標頭。這表示只有你的應用程式能讀取這個 cookie 權杖並設定自訂標頭。`evil.com` 上的惡意程式碼做不到。

Angular 的 `HttpClient` 內建支援這種技術的用戶端部分。如需了解更多資訊，請參閱 [HttpClient 指南](/guide/http#安全性xsrf-防護)。

關於 Open Web Application Security Project (OWASP) 的 CSRF 資訊，請參閱
<a href="https://www.owasp.org/index.php/Cross-Site_Request_Forgery_%28CSRF%29">Cross-Site Request Forgery (CSRF)</a> 與
<a href="https://www.owasp.org/index.php/CSRF_Prevention_Cheat_Sheet">Cross-Site Request Forgery (CSRF) Prevention Cheat Sheet</a>。
史丹佛大學的論文
<a href="https://seclab.stanford.edu/websec/csrf/csrf.pdf">Robust Defenses for Cross-Site Request Forgery</a> 提供了豐富的細節。

另請參閱 Dave Smith 在 AngularConnect 2016 淺顯易懂的
<a href="https://www.youtube.com/watch?v=9inczw6qtpY" title="Cross Site Request Funkery Securing Your Angular Apps From Evil Doers">XSRF 演講</a>。


<h3 id='xssi'>
  跨站指令碼包含 (XSSI)
</h3>



跨站指令碼包含，也稱為 JSON 弱點，可讓攻擊者的網站讀取 JSON API 的資料。這種攻擊在較舊的瀏覽器上，透過覆寫原生的 JavaScript 物件建構函式，再使用 `<script>` 標籤包含 API URL 來達成。

只有當傳回的 JSON 可作為 JavaScript 執行時，這種攻擊才會成功。伺服器可以為所有 JSON 回應加上前綴，使其無法執行，藉此防止攻擊；慣例上使用眾所周知的字串 `")]}',\n"`。

Angular 的 `HttpClient` 程式庫認得這項慣例，會在進一步剖析之前，自動從所有回應中移除字串 `")]}',\n"`。

更多資訊請參閱這篇 [Google Web 安全性部落格文章](https://security.googleblog.com/2011/05/website-security-for-webmasters.html) 的 XSSI 一節。



<h2 id='code-review'>
  稽核 Angular 應用程式
</h2>



Angular 應用程式必須遵循與一般 Web 應用程式相同的安全性原則，並依此接受稽核。在安全性審查中應稽核的 Angular 專屬 API（例如 [_bypassSecurityTrust_](guide/security#bypass-security-apis) 方法），在文件中會被標示為安全性敏感。
