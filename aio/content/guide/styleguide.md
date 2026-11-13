# Angular 程式碼樣式指南

想找一份對 Angular 語法、慣例與應用程式結構有明確主張的指南嗎？ 歡迎進來看看。 本樣式指南提出偏好的慣例，而且同等重要的是，會說明背後的原因。

<a id="toc"></a>

## 樣式詞彙

每條準則描述的不是好的做法就是壞的做法，而且全都有一致的呈現方式。

每條準則的措辭，表明了該建議的強度。

<div class="s-rule do">

**Do** 是應該永遠遵循的準則。 *Always*（永遠）這個詞可能稍微太強烈了些。 真正應該永遠遵循的準則極為罕見。 反過來說，你需要非常特殊的理由，才有正當性打破 **Do** 準則。

</div>

<div class="s-rule consider">

**Consider** 準則通常應該遵循。 如果你完全理解準則背後的意義，而且有充分的理由偏離，那就偏離吧。 目標是保持一致。

</div>

<div class="s-rule avoid">

**Avoid** 表示某件事幾乎永遠不該做。 應該 *avoid*（避免）的程式碼範例，有著醒目的紅色標頭。

</div>

<div class="s-why">

**Why**? <br /> 說明遵循前面建議的理由。

</div>

## 檔案結構慣例

有些程式碼範例會顯示一個檔案，它同時有一或多個名稱相似的伴隨檔案。 例如 `hero.component.ts` 與 `hero.component.html`。

準則使用 `hero.component.ts|html|css|spec` 這個簡寫來代表這些不同的檔案。 使用這個簡寫，能讓本指南的檔案結構更容易閱讀、也更簡潔。

<a id="single-responsibility"></a>

## 單一職責

對所有元件、服務和其他符號，套用[*單一職責原則（SRP）*](https://wikipedia.org/wiki/Single_responsibility_principle)。 這有助於讓應用程式更簡潔、更容易閱讀與維護，也更容易測試。

<a id="01-01"></a>

### 單一規則

#### Style 01-01

<div class="s-rule do">

**Do** 每個檔案定義一件事情，例如一個服務或一個元件。

</div>

<div class="s-rule consider">

**Consider** 把檔案限制在 400 行程式碼以內。

</div>

<div class="s-why">

**Why**? <br /> 每個檔案一個元件，能讓閱讀、維護變得容易得多，也能避免在原始碼控制中與團隊成員發生衝突。

</div>

<div class="s-why">

**Why**? <br /> 每個檔案一個元件，能避免把多個元件合併在同一個檔案中時經常出現的隱藏錯誤，因為它們可能共用變數、產生非預期的閉包，或與依賴產生非預期的耦合。

</div>

<div class="s-why-last">

**Why**? <br /> 單一元件可以作為其檔案的預設匯出，有利於搭配路由器進行延遲載入。

</div>

關鍵是讓程式碼更容易重複使用、更容易閱讀，也更不容易出錯。

下面的*反面*範例在同一個檔案中定義了 `AppComponent`、啟動應用程式、 定義 `Hero` 模型物件，並從伺服器載入英雄。 *不要這麼做*。

<code-example format="typescript" path="styleguide/src/01-01/app/heroes/hero.component.avoid.ts" language="typescript" header="app/heroes/hero.component.ts"></code-example>

更好的做法是把元件和它的 支援類別重新分配到各自專屬的檔案中。

<code-tabs>
    <code-pane header="main.ts" path="styleguide/src/01-01/main.ts"></code-pane>
    <code-pane header="app/app.module.ts" path="styleguide/src/01-01/app/app.module.ts"></code-pane>
    <code-pane header="app/app.component.ts" path="styleguide/src/01-01/app/app.component.ts"></code-pane>
    <code-pane header="app/heroes/heroes.component.ts" path="styleguide/src/01-01/app/heroes/heroes.component.ts"></code-pane>
    <code-pane header="app/heroes/shared/hero.service.ts" path="styleguide/src/01-01/app/heroes/shared/hero.service.ts"></code-pane>
    <code-pane header="app/heroes/shared/hero.model.ts" path="styleguide/src/01-01/app/heroes/shared/hero.model.ts"></code-pane>
    <code-pane header="app/heroes/shared/mock-heroes.ts" path="styleguide/src/01-01/app/heroes/shared/mock-heroes.ts"></code-pane>
</code-tabs>

隨著應用程式成長，這條規則會變得更加重要。

[回到頁首](#toc)

<a id="01-02"></a>

### 小型函式

#### Style 01-02

<div class="s-rule do">

**Do** 定義小型函式

</div>

<div class="s-rule consider">

**Consider** 限制在不超過 75 行以內。

</div>

<div class="s-why">

**Why**? <br />
小型函式更容易測試，尤其當它們只做一件事、只服務一個目的時。

</div>

<div class="s-why">

**Why**? <br />
小型函式有助於重複使用。

</div>

<div class="s-why">

**Why**? <br />
小型函式更容易閱讀。

</div>

<div class="s-why">

**Why**? <br />
小型函式更容易維護。

</div>

<div class="s-why-last">

**Why**? <br />
小型函式有助於避免大型函式帶來的隱藏錯誤，大型函式會與外部作用域共用變數、產生非預期的閉包，或與相依性產生非預期的耦合。

</div>

[回到頁首](#toc)

## 命名

命名慣例對可維護性與可讀性極為重要。 本指南為檔案名稱與符號名稱提出命名慣例建議。

<a id="02-01"></a>

### 一般命名準則

#### Style 02-01

<div class="s-rule do">

**Do** 為所有符號使用一致的名稱。

</div>

<div class="s-rule do">

**Do** 遵循先描述符號的功能、再描述其類型的模式。 建議的模式是 `feature.type.ts`。

</div>

<div class="s-why">

**Why**? <br /> 命名慣例提供了一眼就能找到內容的一致方式。 專案內部的一致性至關重要。 與團隊保持一致很重要。 全公司的一致性能帶來巨大的效率。

</div>

<div class="s-why">

**Why**? <br /> 命名慣例應該要能幫助你更快找到想要的程式碼，並讓程式碼更容易理解。

</div>

<div class="s-why-last">

**Why**? <br /> 資料夾與檔案的名稱，應該清楚傳達它們的意圖。 例如，`app/heroes/hero-list.component.ts` 可能包含一個管理英雄清單的元件。

</div>

[回到頁首](#toc)

<a id="02-02"></a>

### 以點與連字號分隔檔案名稱

#### Style 02-02

<div class="s-rule do">

**Do** 使用連字號分隔描述性名稱中的單字。

</div>

<div class="s-rule do">

**Do** 使用點分隔描述性名稱與類型。

</div>

<div class="s-rule do">

**Do** 為所有元件使用一致的類型名稱，遵循先描述元件功能、再描述其類型的模式。 建議的模式是 `feature.type.ts`。

</div>

<div class="s-rule do">

**Do** 使用慣用的類型名稱，包括 `.service`、`.component`、`.pipe`、`.module` 與 `.directive`。 必要時可以創造額外的類型名稱，但要注意不要創造太多。

</div>

<div class="s-why">

**Why**? <br /> 類型名稱提供了一眼識別檔案內容的一致方式。

</div>

<div class="s-why">

**Why**? <br /> 類型名稱讓人能用編輯器或 IDE 的模糊搜尋技巧，輕鬆找到特定類型的檔案。

</div>

<div class="s-why">

**Why**? <br /> 不縮寫的類型名稱（例如 `.service`）描述性強且不含糊。 `.srv`、`.svc`、`.serv` 之類的縮寫可能造成混淆。

</div>

<div class="s-why-last">

**Why**? <br /> 類型名稱能為任何自動化工作提供模式比對。

</div>

[回到頁首](#toc)

<a id="02-03"></a>

### 符號與檔案名稱

#### Style 02-03

<div class="s-rule do">

**Do** 為所有代表其內容的資產使用一致的名稱。

</div>

<div class="s-rule do">

**Do** 類別名稱使用大駝峰式命名（upper camel case）。

</div>

<div class="s-rule do">

**Do** 讓符號名稱與檔案名稱相符。

</div>

<div class="s-rule do">

**Do** 為該類型的事物在符號名稱後面加上慣用後綴（例如 `Component`、`Directive`、`Module`、`Pipe` 或 `Service`）。

</div>

<div class="s-rule do">

**Do** 為該類型的檔案在檔案名稱後面加上慣用後綴（例如 `.component.ts`、`.directive.ts`、`.module.ts`、`.pipe.ts` 或 `.service.ts`）。

</div>

<div class="s-why">

**Why**? <br /> 一致的慣例讓人能快速識別並參考不同類型的資產。

</div>

| 符號名稱 | 檔案名稱 |
|:---                                                                                                                                                                                  |:---       |
| <code-example format="typescript" hideCopy language="typescript"> &commat;Component({ &hellip; }) &NewLine;export class AppComponent { } </code-example> | app.component.ts |
| <code-example format="typescript" hideCopy language="typescript"> &commat;Component({ &hellip; }) &NewLine;export class HeroesComponent { } </code-example> | heroes.component.ts |
| <code-example format="typescript" hideCopy language="typescript"> &commat;Component({ &hellip; }) &NewLine;export class HeroListComponent { } </code-example> | hero-list.component.ts |
| <code-example format="typescript" hideCopy language="typescript"> &commat;Component({ &hellip; }) &NewLine;export class HeroDetailComponent { } </code-example> | hero-detail.component.ts |
| <code-example format="typescript" hideCopy language="typescript"> &commat;Directive({ &hellip; }) &NewLine;export class ValidationDirective { } </code-example> | validation.directive.ts |
| <code-example format="typescript" hideCopy language="typescript"> &commat;NgModule({ &hellip; }) &NewLine;export class AppModule </code-example> | app.module.ts |
| <code-example format="typescript" hideCopy language="typescript"> &commat;Pipe({ name: 'initCaps' }) &NewLine;export class InitCapsPipe implements PipeTransform { } </code-example> | init-caps.pipe.ts |
| <code-example format="typescript" hideCopy language="typescript"> &commat;Injectable() &NewLine;export class UserProfileService { } </code-example> | user-profile.service.ts |

[回到頁首](#toc)

<a id="02-04"></a>

### 服務名稱

#### Style 02-04

<div class="s-rule do">

**Do** 為所有服務使用一致的名稱，依其功能命名。

</div>

<div class="s-rule do">

**Do** 在服務類別名稱後面加上 `Service` 後綴。 例如，取得資料或英雄的服務，應該叫做 `DataService` 或 `HeroService`。

有少數詞彙明確就是服務。 它們通常以「-er」結尾，表示執行者的角色。 對於記錄訊息的服務，你可能偏好命名為 `Logger`，而不是 `LoggerService`。 請自行決定這個例外在你的專案中是否合適。 一如既往，努力保持一致。

</div>

<div class="s-why">

**Why**? <br /> 提供一眼識別並參考服務的一致方式。

</div>

<div class="s-why">

**Why**? <br /> `Logger` 之類清楚的服務名稱不需要後綴。

</div>

<div class="s-why-last">

**Why**? <br /> `Credit` 之類的服務名稱是名詞，需要後綴；當無法一眼看出它是服務還是其他東西時，應該加上後綴命名。

</div>

| 符號名稱 | 檔案名稱 |
|:---                                                                                                                                              |:---       |
| <code-example format="typescript" hideCopy language="typescript"> &commat;Injectable() &NewLine;export class HeroDataService { } </code-example> | hero-data.service.ts |
| <code-example format="typescript" hideCopy language="typescript"> &commat;Injectable() &NewLine;export class CreditService { } </code-example> | credit.service.ts |
| <code-example format="typescript" hideCopy language="typescript"> &commat;Injectable() &NewLine;export class Logger { } </code-example> | logger.service.ts |

[回到頁首](#toc)

<a id="02-05"></a>

### 啟動

#### Style 02-05

<div class="s-rule do">

**Do** 把應用程式的啟動與平台邏輯放在名為 `main.ts` 的檔案中。

</div>

<div class="s-rule do">

**Do** 在啟動邏輯中加入錯誤處理。

</div>

<div class="s-rule avoid">

**Avoid** 把應用程式邏輯放在 `main.ts` 中。 相反地，考慮把它放在元件或服務中。

</div>

<div class="s-why">

**Why**? <br /> 遵循應用程式啟動邏輯的一致慣例。

</div>

<div class="s-why-last">

**Why**? <br /> 遵循其他技術平台的熟悉慣例。

</div>

<code-example header="main.ts" path="styleguide/src/02-05/main.ts"></code-example>

[回到頁首](#toc)

<a id="05-02"></a>

### 元件選擇器

#### Style 05-02

<div class="s-rule do">

**Do** 為元件的元素選擇器使用 *dashed-case*（串連式命名）或 *kebab-case*（烤肉串式命名）。

</div>

<div class="s-why-last">

**Why**? <br /> 讓元素名稱與 [Custom Elements](https://www.w3.org/TR/custom-elements) 規格保持一致。

</div>

<code-example header="app/heroes/shared/hero-button/hero-button.component.ts" path="styleguide/src/05-02/app/heroes/shared/hero-button/hero-button.component.avoid.ts" region="example"></code-example>

<code-tabs>
    <code-pane header="app/heroes/shared/hero-button/hero-button.component.ts" path="styleguide/src/05-02/app/heroes/shared/hero-button/hero-button.component.ts" region="example"></code-pane>
    <code-pane header="app/app.component.html" path="styleguide/src/05-02/app/app.component.html"></code-pane>
</code-tabs>

[回到頁首](#toc)

<a id="02-07"></a>

### 元件自訂前綴

#### Style 02-07

<div class="s-rule do">

**Do** 使用以連字號分隔的小寫元素選擇器值，例如 `admin-users`。

</div>

<div class="s-rule do">

**Do** 為元件選取器使用自訂前綴。
例如，前綴 `toh` 代表 **T**our **o**f **H**eroes，前綴 `admin` 代表管理功能區域。

</div>

<div class="s-rule do">

**Do** 使用能識別功能領域或應用程式本身的前綴。

</div>

<div class="s-why">

**Why**? <br /> 避免元素名稱與其他應用程式中的元件、以及原生 HTML 元素發生衝突。

</div>

<div class="s-why">

**Why**? <br /> 讓元件更容易推廣並分享到其他應用程式。

</div>

<div class="s-why-last">

**Why**? <br /> 元件在 DOM 中很容易識別。

</div>

<code-example header="app/heroes/hero.component.ts" path="styleguide/src/02-07/app/heroes/hero.component.avoid.ts" region="example"></code-example>

<code-example header="app/users/users.component.ts" path="styleguide/src/02-07/app/users/users.component.avoid.ts" region="example"></code-example>

<code-example header="app/heroes/hero.component.ts" path="styleguide/src/02-07/app/heroes/hero.component.ts" region="example"></code-example>

<code-example header="app/users/users.component.ts" path="styleguide/src/02-07/app/users/users.component.ts" region="example"></code-example>

[回到頁首](#toc)

<a id="02-06"></a>

### 指令選擇器

#### Style 02-06

<div class="s-rule do">

**Do** 為指令的選擇器使用小駝峰式命名（lower camel case）。

</div>

<div class="s-why">

**Why**? <br /> 讓指令中定義、並繫結到檢視的屬性名稱，與屬性名稱保持一致。

</div>

<div class="s-why-last">

**Why**? <br /> Angular 的 HTML 解析器區分大小寫，並能辨識小駝峰式命名。

</div>

[回到頁首](#toc)

<a id="02-08"></a>

### 指令自訂前綴

#### Style 02-08

<div class="s-rule do">

**Do** 為指令的選取器使用自訂前綴（例如，前綴 `toh` 來自 **T**our **o**f **H**eroes）。

</div>

<div class="s-rule do">

**Do** 把非元素選擇器拼成小駝峰式命名，除非該選擇器意在比對原生 HTML 屬性。

</div>

<div class="s-rule avoid">

**Don't** 為指令名稱加上 `ng` 前綴，因為該前綴是 Angular 保留的，使用它可能造成難以診斷的錯誤。

</div>

<div class="s-why">

**Why**? <br /> 避免名稱衝突。

</div>

<div class="s-why-last">

**Why**? <br /> 指令很容易識別。

</div>

<code-example header="app/shared/validate.directive.ts" path="styleguide/src/02-08/app/shared/validate.directive.avoid.ts" region="example"></code-example>

<code-example header="app/shared/validate.directive.ts" path="styleguide/src/02-08/app/shared/validate.directive.ts" region="example"></code-example>

[回到頁首](#toc)

<a id="02-09"></a>

### 管道名稱

#### Style 02-09

<div class="s-rule do">

**Do** 為所有管道使用一致的名稱，以其功能命名。
管道類別名稱應使用 [UpperCamelCase](guide/glossary#大小寫慣例case-types)（類別名稱的一般慣例），對應的 `name` 字串則應使用 *lowerCamelCase*。
`name` 字串不能使用連字號（「dash-case」或「kebab-case」）。

</div>

<div class="s-why-last">

**Why**? <br /> 提供一眼識別並參考管道的一致方式。

</div>

| 符號名稱 | 檔案名稱 |
|:---                                                                                                                                                                                  |:---       |
| <code-example format="typescript" hideCopy language="typescript"> &commat;Pipe({ name: 'ellipsis' }) &NewLine;export class EllipsisPipe implements PipeTransform { } </code-example> | ellipsis.pipe.ts |
| <code-example format="typescript" hideCopy language="typescript"> &commat;Pipe({ name: 'initCaps' }) &NewLine;export class InitCapsPipe implements PipeTransform { } </code-example> | init-caps.pipe.ts |

[回到頁首](#toc)

<a id="02-10"></a>

### 單元測試檔案名稱

#### Style 02-10

<div class="s-rule do">

**Do** 讓測試規格檔案與它所測試的元件同名。

</div>

<div class="s-rule do">

**Do** 為測試規格檔案加上 `.spec` 後綴。

</div>

<div class="s-why">

**Why**? <br /> 提供一眼識別測試的一致方式。

</div>

<div class="s-why-last">

**Why**? <br /> 為 [karma](https://karma-runner.github.io) 或其他測試執行器提供模式比對。

</div>

| 測試類型 | 檔案名稱 |
|:---        |:---        |
| 元件 | heroes.component.spec.ts <br /> hero-list.component.spec.ts <br /> hero-detail.component.spec.ts |
| 服務 | logger.service.spec.ts <br /> hero.service.spec.ts <br /> filter-text.service.spec.ts |
| 管道 | ellipsis.pipe.spec.ts <br /> init-caps.pipe.spec.ts |

[回到頁首](#toc)

<a id="02-11"></a>

### *端對端*（E2E）測試檔案名稱

#### Style 02-11

<div class="s-rule do">

**Do** 以受測功能命名端對端測試規格檔案，並加上 `.e2e-spec` 後綴。

</div>

<div class="s-why">

**Why**? <br />
提供一致的方式，快速辨識端對端測試。

</div>

<div class="s-why-last">

**Why**? <br />
提供測試執行器與建置自動化可用的模式比對。

</div>

| 測試類型 | 檔案名稱 |
|:---              |:---        |
| 端對端測試 | app.e2e-spec.ts <br /> heroes.e2e-spec.ts |

[回到頁首](#toc)

<a id="02-12"></a>

### Angular `NgModule` 名稱

#### Style 02-12

<div class="s-rule do">

**Do** 在符號名稱後面加上 `Module` 後綴。

</div>

<div class="s-rule do">

**Do** 為檔案名稱加上 `.module.ts` 副檔名。

</div>

<div class="s-rule do">

**Do** 以功能與其所在資料夾為模組命名。

</div>

<div class="s-why">

**Why**? <br />
提供一致的方式，快速辨識與參照模組。

</div>

<div class="s-why">

**Why**? <br />
大寫駝峰式命名法是辨識可用建構子具現化之物件的慣例。

</div>

<div class="s-why-last">

**Why**? <br />
可輕鬆辨識該模組為同名功能的根模組。

</div>

<div class="s-rule do">

**Do** 為 `RoutingModule` 類別名稱加上 `RoutingModule` 後綴。

</div>

<div class="s-rule do">

**Do** 以 `-routing.module.ts` 結尾作為 `RoutingModule` 的檔案名稱。

</div>

<div class="s-why-last">

**Why**? <br />
`RoutingModule` 是專門用來設定 Angular 路由器的模組。
一致的類別與檔案名稱慣例讓這些模組容易辨認與驗證。

</div>

| 符號名稱 | 檔案名稱 |
|:---                                                                                                                                                            |:---       |
| <code-example format="typescript" hideCopy language="typescript"> &commat;NgModule({ &hellip; }) &NewLine;export class AppModule { } </code-example> | app.module.ts |
| <code-example format="typescript" hideCopy language="typescript"> &commat;NgModule({ &hellip; }) &NewLine;export class HeroesModule { } </code-example> | heroes.module.ts |
| <code-example format="typescript" hideCopy language="typescript"> &commat;NgModule({ &hellip; }) &NewLine;export class VillainsModule { } </code-example> | villains.module.ts |
| <code-example format="typescript" hideCopy language="typescript"> &commat;NgModule({ &hellip; }) &NewLine;export class AppRoutingModule { } </code-example> | app-routing.module.ts |
| <code-example format="typescript" hideCopy language="typescript"> &commat;NgModule({ &hellip; }) &NewLine;export class HeroesRoutingModule { } </code-example> | heroes-routing.module.ts |

[回到頁首](#toc)

## 應用程式結構與 NgModule

對實作要有近期的看法，也要有長遠的願景。 從小處著手，但要記住應用程式的發展方向。

應用程式的所有程式碼都放在名為 `src` 的資料夾中。所有功能領域都有各自的資料夾，並有各自的 NgModule。

所有內容都是一個檔案一個資產。每個元件、服務與管道都有自己的檔案。所有第三方供應商指令碼都存放在另一個資料夾，而不是 `src` 資料夾中。這些指令碼不是你寫的，你也不希望它們塞滿 `src`。檔案請使用本指南中的命名慣例。

[回到頁首](#toc)

<a id="04-01"></a>

### `LIFT`

#### Style 04-01

<div class="s-rule do">

**Do** 以能夠**快速定位**程式碼、**一眼辨識**程式碼、保持**最扁平**的結構、**力求 DRY** 的方式來組織應用程式。

</div>

<div class="s-rule do">

**Do** 定義結構時遵循以下四項基本準則，依重要性順序列出。

</div>

<div class="s-why-last">

**Why**? <br />
LIFT 提供一致的結構，擴充性佳、模組化程度高，並讓開發者能快速找到程式碼，提高開發效率。
若要確認自己對特定結構的直覺是否正確，可以問：
*我能快速開啟並開始處理這個功能的所有相關檔案嗎*？

</div>

[回到頁首](#toc)

<a id="04-02"></a>

### 定位

#### Style 04-02

<div class="s-rule do">

**Do** 讓定位程式碼直覺又快速。

</div>

<div class="s-why-last">

**Why**? <br />
要有效率地工作，必須能快速找到檔案，尤其當你不知道（或不記得）檔案*名稱*時。
把相關檔案放在直覺的位置、彼此靠近，可以節省時間。
描述性的資料夾結構對你和後來接手的人來說大有不同。

</div>

[回到頁首](#toc)

<a id="04-03"></a>

### 識別

#### Style 04-03

<div class="s-rule do">

**Do** 為檔案命名時，讓人一眼就知道其中包含什麼、代表什麼。

</div>

<div class="s-rule do">

**Do** 以描述性的方式為檔案命名，並讓每個檔案只包含一個元件。

</div>

<div class="s-rule avoid">

**Avoid** 包含多個元件、多個服務，或兩者混合的檔案。

</div>

<div class="s-why-last">

**Why**? <br />
少花時間翻找程式碼，提高效率。
較長的檔案名稱遠比*短卻晦澀*的縮寫名稱好。

</div>

<div class="alert is-helpful">

當你有一組小型且密切相關的功能，放在同一個檔案中比拆成多個檔案更容易發現與理解時，偏離*一個檔案一件事*的規則可能是有利的。
請提防這個漏洞。

</div>

[回到頁首](#toc)

<a id="04-04"></a>

### 扁平

#### Style 04-04

<div class="s-rule do">

**Do** 盡可能保持扁平的資料夾結構。

</div>

<div class="s-rule consider">

**Consider** 當資料夾達到七個或更多檔案時，建立子資料夾。

</div>

<div class="s-rule consider">

**Consider** 設定 IDE，隱藏令人分心的無關檔案，例如產生的 `.js` 與 `.js.map` 檔案。

</div>

<div class="s-why-last">

**Why**? <br />
沒有人想在七層深的資料夾中搜尋檔案。
扁平的結構容易瀏覽。

另一方面，[心理學家認為](https://en.wikipedia.org/wiki/The_Magical_Number_Seven,_Plus_or_Minus_Two)當相鄰的有趣事物數量超過九個時，人類便開始感到吃力。
因此，當資料夾有十個或更多檔案時，可能是建立子資料夾的時候了。

根據自己的舒適程度來做決定。
在有明顯價值建立新資料夾之前，先使用較扁平的結構。

</div>

[回到頁首](#toc)

<a id="04-05"></a>

### *T-DRY* \(盡量做到 *DRY*\)

#### Style 04-05

<div class="s-rule do">

**Do** 保持 DRY（不要重複自己）。

</div>

<div class="s-rule avoid">

**Avoid** 過度追求 DRY，以致犧牲可讀性。

</div>

<div class="s-why-last">

**Why**? <br />
保持 DRY 很重要，但如果犧牲了 LIFT 的其他要素，就沒那麼關鍵。
這就是為什麼它被稱為 *T-DRY*。
例如，把範本命名為 `hero-view.component.html` 是多餘的，因為有了 `.html` 副檔名，顯然它就是一個檢視。
但如果某件事不明顯，或偏離了慣例，那就寫清楚。

</div>

[回到頁首](#toc)

<a id="04-06"></a>

### 整體結構準則

#### Style 04-06

<div class="s-rule do">

**Do** 從小處著手，但要記住應用程式未來的發展方向。

</div>

<div class="s-rule do">

**Do** 對實作要有近期的看法，也要有長遠的願景。

</div>

<div class="s-rule do">

**Do** 把應用程式的所有程式碼放在名為 `src` 的資料夾中。

</div>

<div class="s-rule consider">

**Consider** 當元件有多個伴隨檔案（`.ts`、`.html`、`.css` 與 `.spec`）時，為它建立一個資料夾。

</div>

<div class="s-why">

**Why**? <br /> 有助於在早期階段讓應用程式結構保持小巧且易於維護，同時在應用程式成長時也容易演進。

</div>

<div class="s-why-last">

**Why**? <br /> 元件通常有四個檔案（例如 `*.html`、`*.css`、`*.ts` 與 `*.spec.ts`），很容易讓資料夾變得雜亂。

</div>

<a id="file-tree"></a>

以下是一個符合規定的資料夾與檔案結構：

<div class="filetree">
  <div class="file">
    &lt;project root&gt;
  </div>
  <div class="children">
    <div class="file">
      src
    </div>
    <div class="children">
      <div class="file">
        app
      </div>
      <div class="children">
        <div class="file">
          core
        </div>
        <div class="children">
          <div class="file">
            exception.service.ts&verbar;spec.ts
          </div>
          <div class="file">
            user-profile.service.ts&verbar;spec.ts
          </div>
        </div>
        <div class="file">
          heroes
        </div>
        <div class="children">
          <div class="file">
            hero
          </div>
          <div class="children">
            <div class="file">
              hero.component.ts&verbar;html&verbar;css&verbar;spec.ts
            </div>
          </div>
          <div class="file">
            hero-list
          </div>
          <div class="children">
            <div class="file">
              hero-list.component.ts&verbar;html&verbar;css&verbar;spec.ts
            </div>
          </div>
          <div class="file">
            shared
          </div>
          <div class="children">
            <div class="file">
              hero-button.component.ts&verbar;html&verbar;css&verbar;spec.ts
            </div>
            <div class="file">
              hero.model.ts
            </div>
            <div class="file">
              hero.service.ts&verbar;spec.ts
            </div>
          </div>
          <div class="file">
            heroes.component.ts&verbar;html&verbar;css&verbar;spec.ts
          </div>
          <div class="file">
            heroes.module.ts
          </div>
          <div class="file">
            heroes-routing.module.ts
          </div>
        </div>
        <div class="file">
          shared
        </div>
        <div class="children">
          <div class="file">
            shared.module.ts
          </div>
          <div class="file">
            init-caps.pipe.ts&verbar;spec.ts
          </div>
          <div class="file">
            filter-text.component.ts&verbar;spec.ts
          </div>
          <div class="file">
            filter-text.service.ts&verbar;spec.ts
          </div>
        </div>
        <div class="file">
          villains
        </div>
        <div class="children">
          <div class="file">
            villain
          </div>
          <div class="children">
            <div class="file">
              &hellip;
            </div>
          </div>
          <div class="file">
            villain-list
          </div>
          <div class="children">
            <div class="file">
              &hellip;
            </div>
          </div>
          <div class="file">
            shared
          </div>
          <div class="children">
            <div class="file">
              &hellip;
            </div>
          </div>
          <div class="file">
            villains.component.ts&verbar;html&verbar;css&verbar;spec.ts
          </div>
          <div class="file">
            villains.module.ts
          </div>
          <div class="file">
            villains-routing.module.ts
          </div>
        </div>
        <div class="file">
          app.component.ts&verbar;html&verbar;css&verbar;spec.ts
        </div>
        <div class="file">
          app.module.ts
        </div>
        <div class="file">
          app-routing.module.ts
        </div>
      </div>
      <div class="file">
        main.ts
      </div>
      <div class="file">
        index.html
      </div>
      <div class="file">
        &hellip;
      </div>
    </div>
    <div class="file">
      node_modules/&hellip;
    </div>
    <div class="file">
      &hellip;
    </div>
  </div>
</div>

<div class="alert is-helpful">

雖然大家普遍偏好把元件放在專屬資料夾中，但小型應用程式的另一種選擇是讓元件保持扁平\（不放在專屬資料夾中）。
這麼做會在現有資料夾中多出最多四個檔案，但同時也減少了資料夾巢狀層級。
無論你選擇哪一種，請保持一致。

</div>

[回到頁首](#toc)

<a id="04-07"></a>

### *依功能分資料夾*的結構

#### Style 04-07

<div class="s-rule do">

**Do** 為資料夾以其所代表的功能領域命名。

</div>

<div class="s-why">

**Why**? <br /> 開發者能一眼定位程式碼，並識別每個檔案代表什麼。 結構儘可能扁平，而且沒有重複或多餘的名稱。

</div>

<div class="s-why">

**Why**? <br />
LIFT 準則都已涵蓋。

</div>

<div class="s-why">

**Why**? <br />
有助於透過組織內容並使其與 LIFT 準則保持一致，減少應用程式變得雜亂。

</div>

<div class="s-why">

**Why**? <br /> 當檔案很多（例如 10 個以上）時，採用一致的資料夾結構比較容易找到它們，扁平結構則比較困難。

</div>

<div class="s-rule do">

**Do** 為每個功能區域建立一個 NgModule。

</div>

<div class="s-why">

**Why**? <br />
NgModule 讓延遲載入可路由的功能變得容易。

</div>

<div class="s-why-last">

**Why**? <br />
NgModule 讓隔離、測試與重複使用功能變得更容易。

</div>

<div>

如需更多資訊，請參閱[此資料夾與檔案結構範例](#file-tree)。

</div>

[回到頁首](#toc)

<a id="04-08"></a>

### 應用程式*根模組*

#### Style 04-08

<div class="s-rule do">

**Do** 在應用程式的根資料夾中建立一個 NgModule，例如 `/src/app`。

</div>

<div class="s-why">

**Why**? <br />
每個應用程式至少需要一個根 NgModule。

</div>

<div class="s-rule consider">

**Consider** 把根模組命名為 `app.module.ts`。

</div>

<div class="s-why-last">

**Why**? <br /> 讓根模組更容易定位與識別。

</div>

<code-example format="typescript" path="styleguide/src/04-08/app/app.module.ts" language="typescript" region="example" header="app/app.module.ts"></code-example>

[回到頁首](#toc)

<a id="04-09"></a>

### 功能模組

#### Style 04-09

<div class="s-rule do">

**Do** 為應用程式中所有不同的功能建立一個 NgModule，例如 `Heroes` 功能。

</div>

<div class="s-rule do">

**Do** 把功能模組放在與功能領域同名的資料夾中，例如 `app/heroes`。

</div>

<div class="s-rule do">

**Do** 讓功能模組檔案的名稱反映功能領域與資料夾的名稱，例如 `app/heroes/heroes.module.ts`。

</div>

<div class="s-rule do">

**Do** 讓功能模組符號的名稱反映功能領域、資料夾與檔案的名稱，例如 `app/heroes/heroes.module.ts` 定義了 `HeroesModule`。

</div>

<div class="s-why">

**Why**? <br /> 功能模組可以對其他模組公開或隱藏它的實作。

</div>

<div class="s-why">

**Why**? <br /> 功能模組標示出構成該功能領域的不同組別的相關元件。

</div>

<div class="s-why">

**Why**? <br /> 功能模組可以輕鬆地以即時（eager）與延遲（lazy）兩種方式被路由到。

</div>

<div class="s-why">

**Why**? <br /> 功能模組在特定功能與其他應用程式功能之間定義了清楚的邊界。

</div>

<div class="s-why">

**Why**? <br /> 功能模組有助於釐清，並讓把開發責任分配給不同團隊變得更容易。

</div>

<div class="s-why-last">

**Why**? <br /> 功能模組可以輕鬆地被隔離出來進行測試。

</div>

[回到頁首](#toc)

<a id="04-10"></a>

### 共用功能模組

#### Style 04-10

<div class="s-rule do">

**Do** 在 `shared` 資料夾中建立一個名為 `SharedModule` 的功能模組，例如 `app/shared/shared.module.ts` 定義了 `SharedModule`。

</div>

<div class="s-rule do">

**Do** 當元件、指令與管道會被其他功能模組中宣告的元件重複使用並參考時，在共用模組中宣告它們。

</div>

<div class="s-rule consider">

**Consider** 當共用模組的內容被整個應用程式參考時，使用 SharedModule 這個名稱。

</div>

<div class="s-rule avoid">

**Consider** *不要*在共用模組中提供服務。 服務通常是單例，只會為整個應用程式提供一次，或在某個特定功能模組中提供。 不過也有例外。 例如，在下面的範例程式碼中，請注意 `SharedModule` 提供了 `FilterTextService`。 這在這裡是可以接受的，因為該服務是無狀態的；也就是說，服務的使用者不會受到新實例的影響。

</div>

<div class="s-rule do">

**Do** 匯入 `SharedModule` 中的資產所需要的所有模組，例如 `CommonModule` 與 `FormsModule`。

</div>

<div class="s-why">

**Why**? <br /> `SharedModule` 會包含可能需要另一個共用模組功能的元件、指令與管道，例如 `CommonModule` 中的 `ngFor`。

</div>

<div class="s-rule do">

**Do** 在 `SharedModule` 中宣告所有的元件、指令與管道。

</div>

<div class="s-rule do">

**Do** 從 `SharedModule` 匯出其他功能模組需要使用的所有符號。

</div>

<div class="s-why">

**Why**? <br /> `SharedModule` 的存在，是為了讓常用的元件、指令與管道，能在許多其他模組的元件範本中使用。

</div>

<div class="s-rule avoid">

**Avoid** 在 `SharedModule` 中指定應用程式全域的單例提供者。 有意的單例是可以的。 請小心。

</div>

<div class="s-why">

**Why**? <br /> 延遲載入的功能模組若匯入了那個共用模組，就會建立它自己的服務副本，很可能產生不想要的結果。

</div>

<div class="s-why-last">

**Why**? <br /> 你不會希望每個模組都有各自獨立的單例服務實例。 但如果 `SharedModule` 提供了服務，這種事確實有發生的危險。

</div>

<div class="filetree">
  <div class="file">
    src
  </div>
  <div class="children">
    <div class="file">
      app
    </div>
    <div class="children">
      <div class="file">
        shared
      </div>
      <div class="children">
        <div class="file">
          shared.module.ts
        </div>
        <div class="file">
          init-caps.pipe.ts&verbar;spec.ts
        </div>
        <div class="file">
          filter-text.component.ts&verbar;spec.ts
        </div>
        <div class="file">
          filter-text.service.ts&verbar;spec.ts
        </div>
      </div>
      <div class="file">
        app.component.ts&verbar;html&verbar;css&verbar;spec.ts
      </div>
      <div class="file">
        app.module.ts
      </div>
      <div class="file">
        app-routing.module.ts
      </div>
    </div>
    <div class="file">
      main.ts
    </div>
    <div class="file">
      index.html
    </div>
  </div>
  <div class="file">
    &hellip;
  </div>
</div>

<code-tabs>
    <code-pane header="app/shared/shared.module.ts" path="styleguide/src/04-10/app/shared/shared.module.ts"></code-pane>
    <code-pane header="app/shared/init-caps.pipe.ts" path="styleguide/src/04-10/app/shared/init-caps.pipe.ts"></code-pane>
    <code-pane header="app/shared/filter-text/filter-text.component.ts" path="styleguide/src/04-10/app/shared/filter-text/filter-text.component.ts"></code-pane>
    <code-pane header="app/shared/filter-text/filter-text.service.ts" path="styleguide/src/04-10/app/shared/filter-text/filter-text.service.ts"></code-pane>
    <code-pane header="app/heroes/heroes.component.ts" path="styleguide/src/04-10/app/heroes/heroes.component.ts"></code-pane>
    <code-pane header="app/heroes/heroes.component.html" path="styleguide/src/04-10/app/heroes/heroes.component.html"></code-pane>
</code-tabs>

[回到頁首](#toc)

<a id="04-11"></a>

### 延遲載入資料夾

#### Style 04-11

一個獨特的應用程式功能或工作流程，可能會被*延遲載入*，或*依需求載入*，而不是在應用程式啟動時載入。

<div class="s-rule do">

**Do** 將延遲載入功能的內容放在*延遲載入資料夾*中。
典型的*延遲載入資料夾*包含一個*路由元件*、其子元件，以及相關的資產與模組。

</div>

<div class="s-why-last">

**Why**? <br /> 資料夾讓功能內容更容易識別與隔離。

</div>

[回到頁首](#toc)

<a id="04-12"></a>

### 絕對不要直接匯入延遲載入的資料夾

#### Style 04-12

<div class="s-rule avoid">

**Avoid** 讓同層或父層資料夾中的模組直接匯入*延遲載入功能*中的模組。

</div>

<div class="s-why-last">

**Why**? <br />
直接匯入並使用模組會讓它立即載入，而原本的意圖是按需載入。

</div>

[回到頁首](#toc)

### 不要在管道中加入篩選與排序邏輯

#### Style 04-13

<div class="s-rule avoid">

**Avoid** 在自訂管道中加入篩選或排序邏輯。

</div>

<div class="s-rule do">

**Do** 在範本中繫結模型之前，先在元件或服務中預先計算篩選與排序邏輯。

</div>

<div class="s-why-last">

**Why**? <br />
篩選，尤其是排序，是昂貴的操作。
由於 Angular 每秒可能多次呼叫管道方法，排序與篩選操作即使對中等大小的清單，也可能嚴重降低使用者體驗。

</div>

[回到頁首](#toc)

## 元件

<a id="05-03"></a>

### 把元件當作元素

#### Style 05-03

<div class="s-rule do">

**Consider** 給元件*元素*選擇器，而不是*屬性*或*類別*選擇器。

</div>

<div class="s-why">

**Why**? <br /> 元件有包含 HTML 與選用 Angular 範本語法的範本。 它們會顯示內容。 開發者把元件像原生 HTML 元素與 Web 元件一樣，放在頁面上。

</div>

<div class="s-why-last">

**Why**? <br /> 看範本的 html，就更容易辨認出某個符號是元件。

</div>

<div class="alert is-helpful">

在少數情況下，你會為元件加上屬性，例如想擴充內建元素時。
舉例來說，[Material Design](https://material.angular.io/components/button/overview) 就是用這種技巧來寫 `<button mat-button>`。
不過，你不會對自訂元素使用這種技巧。

</div>

<code-example header="app/heroes/hero-button/hero-button.component.ts" path="styleguide/src/05-03/app/heroes/shared/hero-button/hero-button.component.avoid.ts" region="example"></code-example>

<code-example header="app/app.component.html" path="styleguide/src/05-03/app/app.component.avoid.html"></code-example>

<code-tabs>
    <code-pane header="app/heroes/shared/hero-button/hero-button.component.ts" path="styleguide/src/05-03/app/heroes/shared/hero-button/hero-button.component.ts" region="example"></code-pane>
    <code-pane header="app/app.component.html" path="styleguide/src/05-03/app/app.component.html"></code-pane>
</code-tabs>

[回到頁首](#toc)

<a id="05-04"></a>

### 把範本與樣式抽出到各自的檔案

#### Style 05-04

<div class="s-rule do">

**Do** 當範本與樣式超過 3 行時，把它們抽出到獨立的檔案。

</div>

<div class="s-rule do">

**Do** 把範本檔案命名為 `[component-name].component.html`，其中 [component-name] 是元件名稱。

</div>

<div class="s-rule do">

**Do** 把樣式檔案命名為 `[component-name].component.css`，其中 [component-name] 是元件名稱。

</div>

<div class="s-rule do">

**Do** 指定*以元件為相對基準*的 URL，並以 `./` 作為前綴。

</div>

<div class="s-why">

**Why**? <br /> 龐大的行內範本與樣式會遮蔽元件的目的與實作，降低可讀性與可維護性。

</div>

<div class="s-why">

**Why**? <br /> 在大多數編輯器中，開發行內範本與樣式時，沒有語法提示與程式碼片段可用。 Angular TypeScript 語言服務（即將推出）承諾能為支援它的編輯器克服 HTML 範本的這個缺點，但對 CSS 樣式沒有幫助。

</div>

<div class="s-why">

**Why**? <br /> *以元件為相對基準*的 URL，在你移動元件檔案時不需要變更，只要這些檔案保持在一起。

</div>

<div class="s-why-last">

**Why**? <br /> `./` 前綴是相對 URL 的標準語法；不要依賴 Angular 目前可以省略該前綴的能力。

</div>

<code-example header="app/heroes/heroes.component.ts" path="styleguide/src/05-04/app/heroes/heroes.component.avoid.ts" region="example"></code-example>

<code-tabs>
    <code-pane header="app/heroes/heroes.component.ts" path="styleguide/src/05-04/app/heroes/heroes.component.ts" region="example"></code-pane>
    <code-pane header="app/heroes/heroes.component.html" path="styleguide/src/05-04/app/heroes/heroes.component.html"></code-pane>
    <code-pane header="app/heroes/heroes.component.css" path="styleguide/src/05-04/app/heroes/heroes.component.css"></code-pane>
</code-tabs>

[回到頁首](#toc)

<a id="05-12"></a>

### 以裝飾器標記 `input` 與 `output` 屬性

#### Style 05-12

<div class="s-rule do">

**Do** 使用 `@Input()` 與 `@Output()` 類別裝飾器，而不是 `@Directive` 與 `@Component` 中繼資料的 `inputs` 與 `outputs` 屬性：

</div>

<div class="s-rule consider">

**Consider** 把 `@Input()` 或 `@Output()` 放在與它所修飾的屬性同一行。

</div>

<div class="s-why">

**Why**? <br /> 更容易且更清楚地辨識類別中哪些屬性是輸入或輸出。

</div>

<div class="s-why">

**Why**? <br /> 如果你需要重新命名與 `@Input()` 或 `@Output()` 相關聯的屬性或事件名稱，你可以在單一位置修改它。

</div>

<div class="s-why">

**Why**? <br /> 附加在指令上的中繼資料宣告更短，因此更容易閱讀。

</div>

<div class="s-why-last">

**Why**? <br /> 把裝飾器放在同一行，*通常*能讓程式碼更短，而且仍然很容易識別該屬性是輸入還是輸出。 當放在前一行明顯更容易閱讀時，就放在前一行。

</div>

<code-example header="app/heroes/shared/hero-button/hero-button.component.ts" path="styleguide/src/05-12/app/heroes/shared/hero-button/hero-button.component.avoid.ts" region="example"></code-example>

<code-example header="app/heroes/shared/hero-button/hero-button.component.ts" path="styleguide/src/05-12/app/heroes/shared/hero-button/hero-button.component.ts" region="example"></code-example>

[回到頁首](#toc)

<a id="05-13"></a>

### 避免為 `inputs` 與 `outputs` 取別名

#### Style 05-13

<div class="s-rule avoid">

**Avoid** 使用 `input` 與 `output` 別名，除非它有重要的目的。

</div>

<div class="s-why">

**Why**? <br /> 同一個屬性有兩個名字（一個私用、一個公用）本質上就令人混淆。

</div>

<div class="s-why-last">

**Why**? <br /> 當指令名稱同時也是一個 `input` 屬性，而且指令名稱無法描述該屬性時，你應該使用別名。

</div>

<code-example header="app/heroes/shared/hero-button/hero-button.component.ts" path="styleguide/src/05-13/app/heroes/shared/hero-button/hero-button.component.avoid.ts" region="example"></code-example>

<code-example header="app/app.component.html" path="styleguide/src/05-13/app/app.component.avoid.html"></code-example>

<code-tabs>
    <code-pane header="app/heroes/shared/hero-button/hero-button.component.ts" path="styleguide/src/05-13/app/heroes/shared/hero-button/hero-button.component.ts" region="example"></code-pane>
    <code-pane header="app/heroes/shared/hero-button/hero-highlight.directive.ts" path="styleguide/src/05-13/app/heroes/shared/hero-highlight.directive.ts"></code-pane>
    <code-pane header="app/app.component.html" path="styleguide/src/05-13/app/app.component.html"></code-pane>
</code-tabs>

[回到頁首](#toc)

<a id="05-14"></a>

### 成員順序

#### Style 05-14

<div class="s-rule do">

**Do** 把屬性放在上方，方法放在下方。

</div>

<div class="s-rule do">

**Do** 把私有成員放在公開成員之後，並按字母順序排列。

</div>

<div class="s-why-last">

**Why**? <br />
以一致的順序放置成員，讓程式碼容易閱讀，
並有助於立即辨識元件的哪些成員服務於哪個目的。

</div>

<code-example header="app/shared/toast/toast.component.ts" path="styleguide/src/05-14/app/shared/toast/toast.component.avoid.ts" region="example"></code-example>

<code-example header="app/shared/toast/toast.component.ts" path="styleguide/src/05-14/app/shared/toast/toast.component.ts" region="example"></code-example>

[回到頁首](#toc)

<a id="05-15"></a>

### 把複雜的元件邏輯委派給服務

#### Style 05-15

<div class="s-rule do">

**Do** 把元件中的邏輯限制在檢視所需的範圍內。 所有其他邏輯都應該委派給服務。

</div>

<div class="s-rule do">

**Do** 把可重複使用的邏輯移到服務中，讓元件保持簡單並專注於其預定目的。

</div>

<div class="s-why">

**Why**? <br /> 邏輯放在服務中並以函式公開時，可以被多個元件重複使用。

</div>

<div class="s-why">

**Why**? <br /> 服務中的邏輯可以更容易地在單元測試中隔離，而元件中的呼叫邏輯則可以輕鬆被模擬（mock）。

</div>

<div class="s-why">

**Why**? <br /> 移除依賴，並對元件隱藏實作細節。

</div>

<div class="s-why-last">

**Why**? <br /> 讓元件保持精簡、俐落且專注。

</div>

<code-example header="app/heroes/hero-list/hero-list.component.ts" path="styleguide/src/05-15/app/heroes/hero-list/hero-list.component.avoid.ts"></code-example>

<code-example header="app/heroes/hero-list/hero-list.component.ts" path="styleguide/src/05-15/app/heroes/hero-list/hero-list.component.ts" region="example"></code-example>

[回到頁首](#toc)

<a id="05-16"></a>

### 不要為 `output` 屬性加前綴

#### Style 05-16

<div class="s-rule do">

**Do** 為事件命名時不要加上 `on` 前綴。

</div>

<div class="s-rule do">

**Do** 為事件處理常式方法命名時，加上 `on` 前綴，後面接著事件名稱。

</div>

<div class="s-why">

**Why**? <br /> 這與按鈕點擊之類的內建事件一致。

</div>

<div class="s-why-last">

**Why**? <br />
Angular 允許使用[替代語法](guide/binding-syntax) `on-*`。
如果事件本身以 `on` 為前綴，就會產生 `on-onEvent` 繫結運算式。

</div>

<code-example header="app/heroes/hero.component.ts" path="styleguide/src/05-16/app/heroes/hero.component.avoid.ts" region="example"></code-example>

<code-example header="app/app.component.html" path="styleguide/src/05-16/app/app.component.avoid.html"></code-example>

<code-tabs>
    <code-pane header="app/heroes/hero.component.ts" path="styleguide/src/05-16/app/heroes/hero.component.ts" region="example"></code-pane>
    <code-pane header="app/app.component.html" path="styleguide/src/05-16/app/app.component.html"></code-pane>
</code-tabs>

[回到頁首](#toc)

<a id="05-17"></a>

### 把呈現邏輯放在元件類別中

#### Style 05-17

<div class="s-rule do">

**Do** 把呈現邏輯放在元件類別中，而不是範本中。

</div>

<div class="s-why">

**Why**? <br /> 邏輯會集中在一個地方（元件類別），而不是分散在兩個地方。

</div>

<div class="s-why-last">

**Why**? <br /> 把元件的呈現邏輯放在類別而不是範本中，能改善可測試性、可維護性與可重複使用性。

</div>

<code-example header="app/heroes/hero-list/hero-list.component.ts" path="styleguide/src/05-17/app/heroes/hero-list/hero-list.component.avoid.ts" region="example"></code-example>

<code-example header="app/heroes/hero-list/hero-list.component.ts" path="styleguide/src/05-17/app/heroes/hero-list/hero-list.component.ts" region="example"></code-example>

[回到頁首](#toc)

### 初始化輸入

#### Style 05-18

TypeScript 的 `--strictPropertyInitialization` 編譯器選項，確保類別在建構期間初始化它的屬性。 啟用時，如果類別沒有為任何未明確標記為選用的屬性設定值，這個選項會讓 TypeScript 編譯器回報錯誤。

依設計，Angular 把所有 `@Input` 屬性都視為選用。 只要做得到，你應該提供預設值，來滿足 `--strictPropertyInitialization`。

<code-example header="app/heroes/hero/hero.component.ts" path="styleguide/src/05-18/app/heroes/hero/hero.component.ts" region="example"></code-example>

如果某個屬性很難建構預設值，使用 `?` 明確把該屬性標記為選用。

<code-example header="app/heroes/hero/hero.component.ts" path="styleguide/src/05-18/app/heroes/hero/hero.component.optional.ts" region="example"></code-example>

你可能想要有一個必填的 `@Input` 欄位，意思是元件的所有使用者都必須傳入該屬性。 在這種情況下，使用預設值。 只用 `!` 壓制 TypeScript 錯誤是不夠的，應該避免，因為那會讓型別檢查器無法確保輸入值有被提供。

<code-example header="app/heroes/hero/hero.component.ts" path="styleguide/src/05-18/app/heroes/hero/hero.component.avoid.ts" region="example"></code-example>

## 指令

<a id="06-01"></a>

### 使用指令強化元素

#### Style 06-01

<div class="s-rule do">

**Do** 當你有沒有範本的呈現邏輯時，使用屬性指令。

</div>

<div class="s-why">

**Why**? <br /> 屬性指令沒有相關聯的範本。

</div>

<div class="s-why-last">

**Why**? <br /> 一個元素可以套用多個屬性指令。

</div>

<code-example header="app/shared/highlight.directive.ts" path="styleguide/src/06-01/app/shared/highlight.directive.ts" region="example"></code-example>

<code-example header="app/app.component.html" path="styleguide/src/06-01/app/app.component.html"></code-example>

[回到頁首](#toc)

<a id="06-03"></a>

### `HostListener`/`HostBinding` 裝飾器與 `host` 中繼資料

#### Style 06-03

<div class="s-rule consider">

**Consider** 偏好使用 `@HostListener` 與 `@HostBinding`，而不是 `@Directive` 與 `@Component` 裝飾器的 `host` 屬性。

</div>

<div class="s-rule do">

**Do** 在你的選擇上保持一致。

</div>

<div class="s-why-last">

**Why**? <br />
與 `@HostBinding` 相關的屬性，或與 `@HostListener` 相關的方法，只能在單一位置修改——也就是指令類別內。
如果使用 `host` 中繼資料屬性，就必須同時修改指令類別中的屬性／方法宣告，以及與指令相關的裝飾器中的中繼資料。

</div>

<code-example header="app/shared/validator.directive.ts" path="styleguide/src/06-03/app/shared/validator.directive.ts"></code-example>

與較不偏好的 `host` 中繼資料替代方案比較。

<div class="s-why-last">

**Why**? <br /> `host` 中繼資料只需要記住一個詞彙，而且不需要額外的 ES 匯入。

</div>

<code-example header="app/shared/validator2.directive.ts" path="styleguide/src/06-03/app/shared/validator2.directive.ts"></code-example>

[回到頁首](#toc)

## 服務

<a id="07-01"></a>

### 服務是單例

#### Style 07-01

<div class="s-rule do">

**Do** 在同一個注入器內，把服務當作單例使用。 使用它們來共享資料與功能。

</div>

<div class="s-why">

**Why**? <br /> 服務非常適合在功能領域或應用程式之間共享方法。

</div>

<div class="s-why-last">

**Why**? <br /> 服務非常適合共享有狀態的記憶體內資料。

</div>

<code-example header="app/heroes/shared/hero.service.ts" path="styleguide/src/07-01/app/heroes/shared/hero.service.ts" region="example"></code-example>

[回到頁首](#toc)

<a id="07-02"></a>

### 單一職責

#### Style 07-02

<div class="s-rule do">

**Do** 建立具有單一職責的服務，並以其情境加以封裝。

</div>

<div class="s-rule do">

**Do** 一旦服務開始超出該單一目的，就建立新的服務。

</div>

<div class="s-why">

**Why**? <br />
當服務有多重職責時，就變得難以測試。

</div>

<div class="s-why-last">

**Why**? <br />
當服務有多重職責時，每個注入它的元件或服務，現在都承擔了所有職責的重量。

</div>

[回到頁首](#toc)

<a id="07-03"></a>

### 提供服務

#### Style 07-03

<div class="s-rule do">

**Do** 在服務的 `@Injectable` 裝飾器中，以應用程式根注入器提供服務。

</div>

<div class="s-why">

**Why**? <br /> Angular 注入器是階層式的。

</div>

<div class="s-why">

**Why**? <br /> 當你把服務提供給根注入器時，該服務的實例會被共享，並可在每個需要該服務的類別中使用。 當服務在共享方法或狀態時，這是最理想的做法。

</div>

<div class="s-why">

**Why**? <br /> 當你在服務的 `@Injectable` 裝飾器中註冊服務時，[Angular CLI](cli) 生產建置所使用的最佳化工具，可以執行 tree shaking，移除應用程式未使用的服務。

</div>

<div class="s-why-last">

**Why**? <br /> 當兩個不同元件需要不同的服務實例時，這就不是理想的做法。 在這種情境下，比較好的做法是在需要新的獨立實例的元件層級提供服務。

</div>

<code-example header="src/app/treeshaking/service.ts" path="dependency-injection/src/app/tree-shaking/service.ts"></code-example>

[回到頁首](#toc)

<a id="07-04"></a>

### 使用 &commat;Injectable() 類別裝飾器

#### Style 07-04

<div class="s-rule do">

**Do** 當使用型別作為服務依賴的權杖（token）時，使用 `@Injectable()` 類別裝飾器，而不是 `@Inject` 參數裝飾器。

</div>

<div class="s-why">

**Why**? <br /> Angular 依賴注入（DI）機制，會根據服務的建構函式參數所宣告的型別，解析服務自身的 依賴。

</div>

<div class="s-why-last">

**Why**? <br /> 當服務只接受與型別權杖相關聯的依賴時，`@Injectable()` 語法比在每個建構函式參數上使用 `@Inject()` 簡潔得多。

</div>

<code-example header="app/heroes/shared/hero-arena.service.ts" path="styleguide/src/07-04/app/heroes/shared/hero-arena.service.avoid.ts" region="example"></code-example>

<code-example header="app/heroes/shared/hero-arena.service.ts" path="styleguide/src/07-04/app/heroes/shared/hero-arena.service.ts" region="example"></code-example>

[回到頁首](#toc)

## 資料服務

<a id="08-01"></a>

### 透過服務與伺服器溝通

#### Style 08-01

<div class="s-rule do">

**Do** 把進行資料操作與和資料互動的邏輯重構到服務中。

</div>

<div class="s-rule do">

**Do** 讓資料服務負責 XHR 呼叫、本機儲存、暫存在記憶體中，或任何其他資料操作。

</div>

<div class="s-why">

**Why**? <br /> 元件的職責是為檢視呈現與收集資訊。 它不應該在意資料如何取得，只需要知道要向誰索取。 把資料服務分離出來，能把「如何取得資料」的邏輯移到資料服務中，讓元件更簡單、更專注於檢視。

</div>

<div class="s-why">

**Why**? <br /> 這讓你在測試使用資料服務的元件時，更容易測試（模擬或真實）資料呼叫。

</div>

<div class="s-why-last">

**Why**? <br /> 資料管理的細節，例如標頭、HTTP 方法、快取、錯誤處理與重試邏輯，與元件和其他資料消費者無關。

資料服務封裝了這些細節。 在服務內部演進這些細節比較容易，不會影響它的消費者。 而且用模擬的服務實作來測試消費者也更容易。

</div>

[回到頁首](#toc)

## 生命週期鉤子

使用生命週期鉤子，銜接 Angular 公開的重要事件。

[回到頁首](#toc)

<a id="09-01"></a>

### 實作生命週期鉤子介面

#### Style 09-01

<div class="s-rule do">

**Do** 實作生命週期鉤子介面。

</div>

<div class="s-why-last">

**Why**? <br /> 生命週期介面規定了有型別的方法簽章。 使用這些簽章來標記出拼字與語法錯誤。

</div>

<code-example header="app/heroes/shared/hero-button/hero-button.component.ts" path="styleguide/src/09-01/app/heroes/shared/hero-button/hero-button.component.avoid.ts" region="example"></code-example>

<code-example header="app/heroes/shared/hero-button/hero-button.component.ts" path="styleguide/src/09-01/app/heroes/shared/hero-button/hero-button.component.ts" region="example"></code-example>

[回到頁首](#toc)

## 附錄

Angular 的實用工具與提示。

[回到頁首](#toc)

<a id="A-02"></a>

### 檔案範本與程式碼片段

#### Style A-02

<div class="s-rule do">

**Do** 使用檔案範本或程式碼片段，協助遵循一致的樣式與模式。 以下是一些 Web 開發編輯器與 IDE 的範本與／或程式碼片段。

</div>

<div class="s-rule consider">

**Consider** 為 [Visual Studio Code](https://code.visualstudio.com) 使用遵循這些樣式與準則的[程式碼片段](https://marketplace.visualstudio.com/items?itemName=johnpapa.Angular2)。

<a href="https://marketplace.visualstudio.com/items?itemName=johnpapa.Angular2">

<img alt="使用擴充功能" src="generated/images/guide/styleguide/use-extension.gif">

</a>

**Consider** 使用 [程式碼片段](https://atom.io/packages/angular-2-typescript-snippets) 來搭配 [Atom](https://atom.io)，這些程式碼片段遵循這些風格與準則。

**Consider** 為 [Sublime Text](https://www.sublimetext.com) 使用遵循這些樣式與準則的[程式碼片段](https://github.com/orizens/sublime-angular2-snippets)。

**Consider** 為 [Vim](https://www.vim.org) 使用遵循這些樣式與準則的[程式碼片段](https://github.com/mhartington/vim-angular2-snippets)。

</div>

[回到頁首](#toc)

<!-- links -->

<!-- external links -->

<!-- end links -->

@reviewed 2022-02-28
