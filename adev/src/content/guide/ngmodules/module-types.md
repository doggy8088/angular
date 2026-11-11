# 建立 NgModule 的指導原則

本主題從概念上總覽你可以建立的各種 NgModule 類別，以便用模組化結構組織你的程式碼。
這些類別並非一成不變——它們只是建議。
你可能會為了其他目的建立 NgModule，或結合其中幾種類別的特點。

NgModule 是組織應用程式的好方法，能把與特定功能相關的程式碼與其他程式碼分開。
使用 NgModule 可以把元件、指令與管道整合成功能內聚的區塊。
讓每個區塊專注於一項功能或業務領域、一個工作流程或導覽流程、一組常用的公用程式，或一至多個服務提供者。

## NgModule 類別摘要 {#summary-of-ngmodule-categories}

所有以模組為基礎的應用程式，都從[啟動一個根 NgModule](guide/ngmodules/bootstrapping "Launching an app with a root NgModule") 開始。
你可以依自己的需求任意組織其他的 NgModule。

本主題針對下列 NgModule 的一般類別提供一些指導原則：

| 類別            | 詳細說明 |
|:---                 |:---     |
| [Domain](#domain-ngmodules)   | 圍繞一項功能、業務領域或使用者體驗來組織。                                                                         |
| [Routing](#routing-ngmodules) | 為另一個 NgModule 提供路由設定。                                                                                    |
| [Service](#service-ngmodules) | 提供資料存取、訊息傳遞等公用服務。                                                                                |
| [Widget](#widget-ngmodules)   | 讓一個元件、指令或管道可供其他 NgModule 使用。                                                                         |
| [Shared](#shared-ngmodules)   | 讓一組元件、指令與管道可供其他 NgModule 使用。                                                              |

下表摘要列出每個類別的主要特點。

| NgModule | 宣告 | 提供者      | 匯出       | 由何者匯入 |
|:---      |:---          |:---            |:---           |:---         |
| Domain   | 是          | 很少           | 頂層元件 | 其他領域模組、`AppModule`    |
| Routed   | 是          | 很少           | 否            | 無                           |
| Routing  | 否           | 是 \(Guards\) | RouterModule  | 其他領域模組 \(供路由用\) |
| Service  | 否           | 是            | 否            | `AppModule`                    |
| Widget   | 是          | 很少           | 是           | 其他領域模組                 |
| Shared   | 是          | 否             | 是           | 其他領域模組                 |

## 領域 NgModule {#domain-ngmodules}

使用領域 NgModule 來提供專屬於某項功能或應用程式領域的使用者體驗，例如編輯客戶或下訂單。

領域 NgModule 組織與某項功能相關的程式碼，包含構成該功能的所有元件、路由與範本。
領域 NgModule 中的頂層元件扮演該功能或領域的根，只匯出這個元件即可。
私有的支援子元件都從它向下衍生。

領域 NgModule 只能匯入另一個 NgModule 一次，例如匯入另一個領域 NgModule，或匯入只包含少數 NgModule 的應用程式的根 NgModule（`AppModule`）。

領域 NgModule 主要由宣告組成。
你很少會加入提供者。
即使加入，所提供服務的生命週期也應該與 NgModule 的生命週期相同。

## 路由 NgModule {#routing-ngmodules}

使用路由 NgModule 為領域 NgModule 提供路由設定，藉此把路由相關事項與其搭配的領域 NgModule 分開。

HELPFUL: 如需路由的總覽與詳細資訊，請參閱[應用程式內導覽：路由至檢視](guide/routing "In-app navigation: routing to views")。

使用路由 NgModule 來完成下列工作：

* 定義路由
* 透過 `imports` 把路由器設定加入 NgModule
* 把守衛與解析器服務提供者加入 NgModule 的 providers

路由 NgModule 的名稱應該與其搭配的 NgModule 名稱並行，並使用 `Routing` 作為後綴。
例如，`contact.module.ts` 中的 `ContactModule`，其路由 NgModule 名為 `contact-routing.module.ts` 中的 `ContactRoutingModule`。

路由 NgModule 只能匯入它所搭配的 NgModule。
如果搭配的 NgModule 是根 `AppModule`，`AppRoutingModule` 會用 `RouterModule.forRoot(routes)` 把路由器設定加入它的 imports。
所有其他路由 NgModule 都是子模組，使用 `RouterModule.forChild(routes)` 匯入。

在路由 NgModule 中，順便重新匯出 `RouterModule`，讓搭配的 NgModule 的元件能取用 `RouterLink`、`RouterOutlet` 等路由器指令。

不要在路由 NgModule 中使用宣告。
元件、指令與管道是搭配的領域 NgModule 的責任，而不是路由 NgModule 的責任。

## 服務 NgModule {#service-ngmodules}

使用服務 NgModule 來提供公用服務，例如資料存取或訊息傳遞。
理想的服務 NgModule 完全由提供者組成，沒有任何宣告。
Angular 的 `HttpClientModule` 就是服務 NgModule 的好例子。

服務 NgModule 只能由根 `AppModule` 匯入。

## 小工具 NgModule {#widget-ngmodules}

使用小工具 NgModule，讓一個元件、指令或管道可供外部 NgModule 使用。
把小工具 NgModule 匯入任何需要在範本中使用這些小工具的 NgModule。
許多第三方 UI 元件函式庫都是以小工具 NgModule 的形式提供。

小工具 NgModule 應該完全由宣告組成，且大多數宣告都應匯出。
它很少會有提供者。

## 共享 NgModule {#shared-ngmodules}

把常用的指令、管道與元件放進一個 NgModule，通常命名為 `SharedModule`，然後在應用程式其他需要它的地方只需匯入這個 NgModule。
你可以在領域 NgModule 中匯入共享 NgModule，包括[延遲載入的 NgModule](guide/ngmodules/lazy-loading "Lazy-loading an NgModule")。

NOTE: 共享 NgModule 不應包含提供者，它匯入或重新匯出的任何 NgModule 也都不應包含提供者。

如需了解如何使用共享模組來組織與精簡你的程式碼，請參閱[在應用程式中共享 NgModule](guide/ngmodules/sharing "Sharing NgModules in an app")。

## 後續步驟 {#next-steps}

如果你想管理 NgModule 的載入，以及相依性與服務的使用方式，請參閱下列內容：

* 如需了解在應用程式啟動時積極載入 NgModule，或由路由器非同步延遲載入 NgModule，請參閱[延遲載入功能模組](guide/ngmodules/lazy-loading)
* 如需了解如何為你的應用程式提供服務或其他相依性，請參閱[為 NgModule 提供相依性](guide/ngmodules/providers "Providing Dependencies for an NgModule")
* 如需了解如何建立供 NgModule 使用的單例服務，請參閱[讓服務成為單例](guide/ngmodules/singleton-services "Making a service a singleton")
