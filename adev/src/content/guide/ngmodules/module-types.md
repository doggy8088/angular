# NgModules 建立指南

本主題提供 NgModules 不同類別的概念概述，以便您可以將程式碼整理成模組化結構。
這些類別並非一成不變&mdash;它們是建議。
您可能想為其他目的建立 NgModules，或結合某些這些類別的特徵。

NgModules 是整理應用程式和讓與特定功能或特性相關的程式碼與其他程式碼分開的絕佳方式。
使用 NgModules 將元件、指令和管道整併成具凝聚力的功能區塊。
將每個區塊聚焦於功能或業務領域、工作流程或導覽流程、公用的工具集合，或一個或多個服務提供者。

## NgModule 類別摘要

所有應用程式會先透過 [引導根 NgModule](/guide/ngmodules/bootstrapping "以根 NgModule 啟動應用程式") 開始。
您可以依自己的喜好來組織其他 NgModule。

此主題提供下列 NgModules 一般類別的一些準則：

| 類別            | 詳細資訊 |
|:---                 |:---     |
| [網域](#domain-ngmodules)   | 圍繞著功能、業務領域或使用者體驗而組織。                                                                         |
| [路由](#routing-ngmodules) | 提供另一個 NgModule 的路由設定。                                                                                    |
| [服務](#service-ngmodules) | 提供數據訪問和訊息傳遞等實用程式服務。                                                                                |
| [小工具](#widget-ngmodules)   | 使元件、指令或管線可供其他 NgModules 使用。                                                                         |
| [共用](#shared-ngmodules)   | 使一組元件、指令和管線可供其他 NgModules 使用。                                                              |

以下表格總結了每個類別的主要特徵。

| NgModule | Declarations | Providers      | Exports       | Imported by |
|:---      |:---          |:---            |:---           |:---         |
| Domain   | 是          | 罕見           | 頂層元件     | 其他網域、`AppModule`    |
| Routed   | 是          | 罕見           | 否            | 無                           |
| Routing  | 否           | 是 \(Guards\) | RouterModule  | 其他網域 \(用於路由\) |
| Service  | 否           | 是            | 否            | `AppModule`                    |
| Widget   | 是          | 罕見           | 是           | 其他網域                 |
| Shared   | 是          | 否             | 是           | 其他網域                 |

## Domain NgModules

使用網域 NgModule 提供專門針對特定功能或應用程式網域的使用者體驗，例如編輯客戶或下訂單。

網域 NgModule 組織與某項功能相關的程式碼，包含組成該功能的所有元件、路由和範本。
網域 NgModule 中的頂層元件充當功能或網域的根，而且是唯一會匯出的元件。
私人的支援子元件會從它衍生。

將某個網域 NgModule 準確地匯入另一個 NgModule 一次，例如網域 NgModule，或僅包含少數 NgModules 的應用程式的根 NgModule (`AppModule`)。

Domain NgModules 大多包含宣告。
您很少包含提供者。
如果您有，所提供服務的生命週期應與 NgModule 的生命週期相同。

## Routing NgModules

使用路由 NgModule 來提供網域 NgModule 的路由配置，從而將路由問題與其伴隨的網域 NgModule 分離。

HELPFUL: 有關路由概述和詳細資訊，請參閱 [應用程式內導覽：導覽至檢視](/guide/routing "應用程式內導覽：導覽至檢視")。

使用路由 NgModule 來執行下列任務：

* 定義路由
* 透過 `imports` 將路由器設定新增到 NgModule
* 將防護和解析器服務提供者新增到 NgModule 的提供者

路由 NgModule 的名稱應與其伴生 NgModule 的名稱相符，並使用後綴 `Routing`。
例如，假設 `contact.module.ts` 中的 `ContactModule` 有一個名為 `ContactRoutingModule` 的路由 NgModule，位於 `contact-routing.module.ts` 中。

僅將路由 NgModule 匯入其伴隨的 NgModule。
如果伴隨的 NgModule 是根 `AppModule`，則 `AppRoutingModule` 會以 `RouterModule.forRoot(routes)` 將路由器設定新增到其匯入中。
所有其他路由 NgModules 都是使用 `RouterModule.forChild(routes)` 匯入的子項。

在您的路由 NgModule 中，重新匯出 `RouterModule` 作為一種便利，以便伴隨的 NgModule 的元件可以存取路由指令，例如 `RouterLink` 和 `RouterOutlet`。

不要在路由 NgModule 中使用聲明。
元件、指令和管道是 companion 領域 NgModule 的責任，而不是路由 NgModule 的責任。

## 服務 NgModules

使用服務 NgModule 提供數據訪問或訊息傳遞等實用服務。
理想的服務 NgModule 完全由提供者組成，並且沒有聲明。
Angular 的 `HttpClientModule` 是服務 NgModule 的一個好例子。

僅使用根 `AppModule` 來匯入服務 NgModules。

## Widget NgModules

使用 widget NgModule 使元件、指令或導管可供外部 NgModules 使用。
將 widget NgModules 匯入任何需要在其範本中使用 widget 的 NgModules。
許多第三方 UI 元件庫都以 widget NgModules 的形式提供。

小工具 NgModule 應完全由宣告組成，其中大部分都已匯出。它很少會有提供者。

## 共用 NgModules

將常用的指令、管道和元件放入一個 NgModule，通常命名為 `SharedModule`，然後在應用程式的其他部分需要時匯入該 NgModule。
可以在網域 NgModule 中匯入共用 NgModule，包括 [延遲載入的 NgModule](/guide/ngmodules/lazy-loading "延遲載入 NgModule")。

注意：共用的 NgModules 不應包含提供者，其導入或重新導出的任何 NgModules 也不應包含提供者。

如要了解如何使用共用模組來組織和簡化您的程式碼，請參閱 [應用程式中的共用 NgModules](/guide/ngmodules/sharing "應用程式中的共用 NgModules")。

## 後續步驟

如果您想管理 NgModule 載入以及依賴項和服務的使用，請參閱以下內容：

* 如要瞭解如何在應用程式啟動時急切載入 NgModules，或路由器非同步延遲載入 NgModules，請參閱 [延遲載入功能模組](/guide/ngmodules/lazy-loading)
* 如要瞭解如何為您的應用程式提供服務或其他相依性，請參閱 [為 NgModule 提供相依性](/guide/ngmodules/providers "為 NgModule 提供相依性")
* 如要瞭解如何在 NgModules 中使用建立單例服務，請參閱 [建立單例服務](/guide/ngmodules/singleton-services "建立單例服務")
