# 建立 NgModule 的指導原則

本主題從概念上概述你可以建立的不同類別 [NgModule](guide/glossary#ngmodule "Definition of NgModule")，以便用模組化結構組織程式碼。
這些類別並非一成不變&mdash;它們只是建議。
你可能想為其他目的建立 NgModule，或結合其中某些類別的特性。

NgModule 是組織應用程式的絕佳方式，可以讓與特定功能或特性相關的程式碼與其他程式碼分開。
使用 NgModule 將[元件](guide/glossary#元件（component） "Definition of component")、[指令](guide/glossary#指令（directive） "Definition of directive")與[管道](guide/glossary#管道（pipe） "Definition of pipe")整合成具有凝聚力的功能區塊。
每個區塊專注於一項功能或業務領域、工作流程或導覽流程、一組常用工具程式，或一或多個[服務](guide/glossary#服務（service） "Definition of service")的[提供者](guide/glossary#提供者（provider） "Definition of provider")。

更多關於 NgModule 的資訊，請參閱[使用 NgModule 組織你的應用程式](guide/ngmodules "Organizing your app with NgModules")。

<div class="alert is-helpful">

如需 NgModules 相關主題使用的範例應用程式，請參閱 <live-example name="ngmodules"></live-example>。

</div>

## NgModule 類別摘要

所有應用程式都從[啟動一個根 NgModule](guide/bootstrapping "Launching an app with a root NgModule")開始。
你可以依自己的需求任意組織其他的 NgModule。

本主題針對下列 NgModule 的一般類別提供一些指導原則：

* [Domain](#domain)：領域 NgModule 圍繞一項功能、業務領域或使用者體驗來組織。
* [Routed](#routed)：NgModule 的頂層元件作為[路由器](guide/glossary#路由器（router） "Definition of router")導覽路由的目的地。
* [Routing](#routing)：路由 NgModule 為另一個 NgModule 提供路由設定。
* [Service](#service)：服務 NgModule 提供資料存取與訊息傳遞等公用服務。
* [Widget](#widget)：小工具 NgModule 讓元件、指令或管道可供其他 NgModule 使用。
* [Shared](#shared)：共享 NgModule 讓一組元件、指令與管道可供其他 NgModule 使用。

下表摘要列出每個類別的主要特點。

<table>
 <tr>
   <th style="vertical-align: top">
     NgModule
   </th>

   <th style="vertical-align: top">
     宣告
   </th>

   <th style="vertical-align: top">
     提供者
   </th>

   <th style="vertical-align: top">
     匯出
   </th>

   <th style="vertical-align: top">
     由何者匯入
   </th>
 </tr>

 <tr>
   <td>Domain</td>
   <td>是</td>
   <td>很少</td>
   <td>頂層元件</td>
   <td>其他領域模組、AppModule</td>
 </tr>

 <tr>
   <td>Routed</td>
   <td>是</td>
   <td>很少</td>
   <td>否</td>
   <td>無</td>
 </tr>

 <tr>
   <td>Routing</td>
   <td>否</td>
   <td>是 (Guards)</td>
   <td>RouterModule</td>
   <td>其他領域模組 (供路由用)</td>
 </tr>

 <tr>
   <td>Service</td>
   <td>否</td>
   <td>是</td>
   <td>否</td>
   <td>AppModule</td>
 </tr>

 <tr>
   <td>Widget</td>
   <td>是</td>
   <td>很少</td>
   <td>是</td>
   <td>其他領域模組</td>
 </tr>

 <tr>
   <td>Shared</td>
   <td>是</td>
   <td>否</td>
   <td>是</td>
   <td>其他領域模組</td>
 </tr>
</table>

{@a domain}

## 領域 NgModule

使用領域 NgModule 來提供專注於特定功能或應用程式領域的使用者體驗，例如編輯客戶或下訂單。
其中一個例子是 <live-example name="ngmodules"></live-example> 中的 `ContactModule`。

領域 NgModule 組織與某項功能相關的程式碼，包含構成該功能的所有元件、路由與範本。
領域 NgModule 中的頂層元件扮演該功能或領域的根，只匯出這個元件即可。
私有的支援子元件都從它向下衍生。

領域 NgModule 只能匯入另一個 NgModule 一次，例如匯入另一個領域 NgModule，或匯入只包含少數 NgModule 的應用程式的根 NgModule（`AppModule`）。

領域 NgModule 主要由宣告組成。
你很少會加入提供者。
即使加入，所提供服務的生命週期也應該與 NgModule 的生命週期相同。

<div class="alert is-helpful">

更多關於生命週期的資訊，請參閱[連結至元件生命週期](guide/lifecycle-hooks "Hooking into the component lifecycle")。

</div>

{@a routed}

## 路由 NgModule

對所有[延遲載入的 NgModule](guide/lazy-loading-ngmodules "Lazy-loading an NgModule")使用路由 NgModule。
使用 NgModule 的頂層元件作為路由器導覽路由的目的地。
路由 NgModule 不匯出任何東西，因為它們的元件絕不會出現在外部元件的範本中。

不要將延遲載入的路由 NgModule 匯入另一個 NgModule，因為這會觸發積極載入，失去延遲載入的意義。

路由 NgModule 很少有提供者，因為你只有在需要時（例如為了路由）才載入路由 NgModule。
列在 NgModule `provider` 陣列中的服務將無法使用，因為根注入器不知道延遲載入的 NgModule。
如果你加入了提供者，所提供服務的生命週期應與 NgModule 的生命週期相同。
不要在路由 NgModule 或路由 NgModule 匯入的 NgModule 中提供全應用程式的[單例服務](guide/singleton-services)。

<div class="alert is-helpful">

更多關於提供者與延遲載入的路由 NgModule 的資訊，請參閱[限制提供者範圍](guide/providers#以延遲載入模組限制提供者範圍 "Providing dependencies: Limiting provider scope")。

</div>

{@a routing}

## 路由 NgModule

使用路由 NgModule 為領域 NgModule 提供路由設定，從而將路由相關事項與其對應的領域 NgModule 分開。
其中一個例子是 <live-example name="ngmodules"></live-example> 中的 `ContactRoutingModule`，它為其對應的領域 NgModule `ContactModule` 提供路由。

<div class="alert is-helpful">

關於路由的總覽與詳細資訊，請參閱[應用程式內導覽：路由至檢視](guide/router "In-app navigation: routing to views")。

</div>

使用路由 NgModule 來完成下列工作：

* 定義路由。
* 將路由器設定加入 NgModule 的匯入。
* 把守衛與解析器服務提供者加入 NgModule 的 providers。

路由 NgModule 的名稱應該與其搭配的 NgModule 名稱並行，並使用 `Routing` 作為後綴。
例如，<code>contact.module.ts</code> 中的 <code>ContactModule</code>，其路由 NgModule 名為 <code>contact-routing.module.ts</code> 中的 <code>ContactRoutingModule</code>。

路由 NgModule 只能匯入它所搭配的 NgModule。
如果搭配的 NgModule 是根 <code>AppModule</code>，<code>AppRoutingModule</code> 會用 <code>RouterModule.forRoot(routes)</code> 把路由設定加入它的 imports。
所有其他路由 NgModule 都是子模組，匯入 <code>RouterModule.forChild(routes)</code>。

在路由 NgModule 中，將 <code>RouterModule</code> 重新匯出以方便使用，讓搭配的 NgModule 的元件能取用 <code>RouterLink</code> 與 <code>RouterOutlet</code> 等路由器指令。

不要在路由 NgModule 中使用宣告。
元件、指令與管道是搭配的領域 NgModule 的責任，而不是路由 NgModule 的責任。

{@a service}

## 服務 NgModule

使用服務 NgModule 來提供公用服務，例如資料存取或訊息傳遞。
理想的服務 NgModule 完全由提供者組成，沒有任何宣告。
Angular 的 `HttpClientModule` 就是服務 NgModule 的好例子。

服務 NgModule 只能由根 `AppModule` 匯入。

{@a widget}

## 小工具 NgModule

使用小工具 NgModule，讓一個元件、指令或管道可供外部 NgModule 使用。
把小工具 NgModule 匯入任何需要在範本中使用這些小工具的 NgModule。
許多第三方 UI 元件函式庫都是以小工具 NgModule 的形式提供。

小工具 NgModule 應該完全由宣告組成，且大多數宣告都應匯出。
它很少會有提供者。

{@a shared}

## 共享 NgModule

將常用的指令、管道與元件放入一個 NgModule（通常命名為 `SharedModule`），然後在應用程式其他需要的地方只匯入該 NgModule 即可。
你可以在領域 NgModule 中匯入共享 NgModule，包括[延遲載入的 NgModule](guide/lazy-loading-ngmodules "Lazy-loading an NgModule")。
其中一個例子是 <live-example name="ngmodules"></live-example> 中的 `SharedModule`，它提供了自訂管道 `AwesomePipe` 與 `HighlightDirective` 指令。

共享 NgModule 不應包含提供者，它匯入或重新匯出的任何 NgModule 也都不應包含提供者。

如需了解如何使用共享模組來組織與精簡你的程式碼，請參閱[在應用程式中共享 NgModule](guide/sharing-ngmodules "Sharing NgModules in an app")。

## 後續步驟

你可能也會對以下內容有興趣：

* 更多關於 NgModule 的資訊，請參閱[使用 NgModule 組織你的應用程式](guide/ngmodules "Organizing your app with NgModules")。
* 如需深入了解根 NgModule，請參閱[以根 NgModule 啟動應用程式](guide/bootstrapping "Launching an app with a root NgModule")。
* 如需了解常用的 Angular NgModule 以及如何把它們匯入你的應用程式，請參閱[常用模組](guide/frequent-ngmodules "Frequently-used modules")。
* NgModule 中繼資料屬性的完整說明，請參閱[使用 NgModule 中繼資料](guide/ngmodule-api "Using the NgModule metadata")。

如果你想管理 NgModule 的載入，以及相依性與服務的使用方式，請參閱下列內容：

* 如需了解在應用程式啟動時積極載入 NgModule，或由路由器非同步延遲載入 NgModule，請參閱[延遲載入功能模組](guide/lazy-loading-ngmodules)。
* 如需了解如何為你的應用程式提供服務或其他相依性，請參閱[為 NgModule 提供相依性](guide/providers "Providing Dependencies for an NgModule")。
* 如需了解如何建立供 NgModule 使用的單例服務，請參閱[讓服務成為單例](guide/singleton-services "Making a service a singleton")。
