# Angular 程式碼樣式指南

想找一份對 Angular 語法、慣例與應用程式結構有明確主張的指南嗎？
歡迎進來看看。
本樣式指南提出偏好的慣例，而且同等重要的是，會說明背後的原因。

## 樣式詞彙

每條準則描述的不是好的做法就是壞的做法，而且全都有一致的呈現方式。

每條準則的措辭，表明了該建議的強度。

**Do** 是應該永遠遵循的準則。
*Always*（永遠）這個詞可能稍微太強烈了些。
真正應該永遠遵循的準則極為罕見。
反過來說，你需要非常特殊的理由，才有正當性打破 **Do** 準則。

**Consider** 準則通常應該遵循。
如果你完全理解準則背後的意義，而且有充分的理由偏離，那就偏離吧。
目標是保持一致。

**Avoid** 表示某件事幾乎永遠不該做。
應該 *avoid*（避免）的程式碼範例，有著醒目的紅色標頭。

**Why**? <br />
說明遵循前面建議的理由。

## 檔案結構慣例

有些程式碼範例會顯示一個檔案，它同時有一或多個名稱相似的伴隨檔案。
例如 `hero.component.ts` 與 `hero.component.html`。

準則使用 `hero.component.ts|html|css|spec` 這個簡寫來代表這些不同的檔案。
使用這個簡寫，能讓本指南的檔案結構更容易閱讀、也更簡潔。

## 單一職責

對所有元件、服務和其他符號，套用[*單一職責原則（SRP）*](https://wikipedia.org/wiki/Single_responsibility_principle)。
這有助於讓應用程式更簡潔、更容易閱讀與維護，也更容易測試。

### 單一規則

#### Style 01-01

**Do** 每個檔案定義一件事情，例如一個服務或一個元件。

**Consider** 把檔案限制在 400 行程式碼以內。

**Why**? <br />
每個檔案一個元件，能讓閱讀、維護變得容易得多，也能避免在原始碼控制中與團隊成員發生衝突。

**Why**? <br />
每個檔案一個元件，能避免把多個元件合併在同一個檔案中時經常出現的隱藏錯誤，因為它們可能共用變數、產生非預期的閉包，或與依賴產生非預期的耦合。

**Why**? <br />
單一元件可以作為其檔案的預設匯出，有利於搭配路由器進行延遲載入。

關鍵是讓程式碼更容易重複使用、更容易閱讀，也更不容易出錯。

下面的*反面*範例在同一個檔案中定義了 `AppComponent`、啟動應用程式、
定義 `Hero` 模型物件，並從伺服器載入英雄。
*不要這麼做*。

<docs-code path="adev/src/content/examples/styleguide/src/01-01/app/heroes/hero.component.avoid.ts" language="typescript" header="app/heroes/hero.component.ts"/>

更好的做法是把元件和它的
支援類別重新分配到各自專屬的檔案中。

<docs-code-multifile>
    <docs-code header="main.ts" path="adev/src/content/examples/styleguide/src/01-01/main.ts"/>
    <docs-code header="app/app.module.ts" path="adev/src/content/examples/styleguide/src/01-01/app/app.module.ts"/>
    <docs-code header="app/app.component.ts" path="adev/src/content/examples/styleguide/src/01-01/app/app.component.ts"/>
    <docs-code header="app/heroes/heroes.component.ts" path="adev/src/content/examples/styleguide/src/01-01/app/heroes/heroes.component.ts"/>
    <docs-code header="app/heroes/shared/hero.service.ts" path="adev/src/content/examples/styleguide/src/01-01/app/heroes/shared/hero.service.ts"/>
    <docs-code header="app/heroes/shared/hero.model.ts" path="adev/src/content/examples/styleguide/src/01-01/app/heroes/shared/hero.model.ts"/>
    <docs-code header="app/heroes/shared/mock-heroes.ts" path="adev/src/content/examples/styleguide/src/01-01/app/heroes/shared/mock-heroes.ts"/>
</docs-code-multifile>

隨著應用程式成長，這條規則會變得更加重要。

## 命名

命名慣例對可維護性與可讀性極為重要。
本指南為檔案名稱與符號名稱提出命名慣例建議。

### 一般命名準則

#### Style 02-01

**Do** 為所有符號使用一致的名稱。

**Do** 遵循先描述符號的功能、再描述其類型的模式。
建議的模式是 `feature.type.ts`。

**Why**? <br />
命名慣例提供了一眼就能找到內容的一致方式。
專案內部的一致性至關重要。
與團隊保持一致很重要。
全公司的一致性能帶來巨大的效率。

**Why**? <br />
命名慣例應該要能幫助你更快找到想要的程式碼，並讓程式碼更容易理解。

**Why**? <br />
資料夾與檔案的名稱，應該清楚傳達它們的意圖。
例如，`app/heroes/hero-list.component.ts` 可能包含一個管理英雄清單的元件。

### 以點與連字號分隔檔案名稱

#### Style 02-02

**Do** 使用連字號分隔描述性名稱中的單字。

**Do** 使用點分隔描述性名稱與類型。

**Do** 為所有元件使用一致的類型名稱，遵循先描述元件功能、再描述其類型的模式。
建議的模式是 `feature.type.ts`。

**Do** 使用慣用的類型名稱，包括 `.service`、`.component`、`.pipe`、`.module` 與 `.directive`。
必要時可以創造額外的類型名稱，但要注意不要創造太多。

**Why**? <br />
類型名稱提供了一眼識別檔案內容的一致方式。

**Why**? <br />
類型名稱讓人能用編輯器或 IDE 的模糊搜尋技巧，輕鬆找到特定類型的檔案。

**Why**? <br />
不縮寫的類型名稱（例如 `.service`）描述性強且不含糊。
`.srv`、`.svc`、`.serv` 之類的縮寫可能造成混淆。

**Why**? <br />
類型名稱能為任何自動化工作提供模式比對。

### 符號與檔案名稱

#### Style 02-03

**Do** 為所有代表其內容的資產使用一致的名稱。

**Do** 類別名稱使用大駝峰式命名（upper camel case）。

**Do** 讓符號名稱與檔案名稱相符。

**Do** 為該類型的事物在符號名稱後面加上慣用後綴（例如 `Component`、`Directive`、`Module`、`Pipe` 或 `Service`）。

**Do** 為該類型的檔案在檔案名稱後面加上慣用後綴（例如 `.component.ts`、`.directive.ts`、`.module.ts`、`.pipe.ts` 或 `.service.ts`）。

**Why**? <br />
一致的慣例讓人能快速識別並參考不同類型的資產。

| 符號名稱 | 檔案名稱 |
|:---                                                                                                                                                                                  |:---       |
| <docs-code hideCopy language="typescript"> @Component({ … }) <br>export class AppComponent { } </docs-code>                             | app.component.ts |
| <docs-code hideCopy language="typescript"> @Component({ … }) <br>export class HeroesComponent { } </docs-code>                          | heroes.component.ts |
| <docs-code hideCopy language="typescript"> @Component({ … }) <br>export class HeroListComponent { } </docs-code>                        | hero-list.component.ts |
| <docs-code hideCopy language="typescript"> @Component({ … }) <br>export class HeroDetailComponent { } </docs-code>                      | hero-detail.component.ts |
| <docs-code hideCopy language="typescript"> @Directive({ … }) <br>export class ValidationDirective { } </docs-code>                      | validation.directive.ts |
| <docs-code hideCopy language="typescript"> @NgModule({ … }) <br>export class AppModule </docs-code>                                     | app.module.ts |
| <docs-code hideCopy language="typescript"> @Pipe({ name: 'initCaps' }) <br>export class InitCapsPipe implements PipeTransform { } </docs-code> | init-caps.pipe.ts |
| <docs-code hideCopy language="typescript"> @Injectable() <br>export class UserProfileService { } </docs-code>                                  | user-profile.service.ts |

### 服務名稱

#### Style 02-04

**Do** 為所有服務使用一致的名稱，依其功能命名。

**Do** 在服務類別名稱後面加上 `Service` 後綴。
例如，取得資料或英雄的服務，應該叫做 `DataService` 或 `HeroService`。

有少數詞彙明確就是服務。
它們通常以「-er」結尾，表示執行者的角色。
對於記錄訊息的服務，你可能偏好命名為 `Logger`，而不是 `LoggerService`。
請自行決定這個例外在你的專案中是否合適。
一如既往，努力保持一致。

**Why**? <br />
提供一眼識別並參考服務的一致方式。

**Why**? <br />
`Logger` 之類清楚的服務名稱不需要後綴。

**Why**? <br />
`Credit` 之類的服務名稱是名詞，需要後綴；當無法一眼看出它是服務還是其他東西時，應該加上後綴命名。

| 符號名稱 | 檔案名稱 |
|:---                                                                                                                                              |:---       |
| <docs-code hideCopy language="typescript"> @Injectable() <br>export class HeroDataService { } </docs-code> | hero-data.service.ts |
| <docs-code hideCopy language="typescript"> @Injectable() <br>export class CreditService { } </docs-code>   | credit.service.ts    |
| <docs-code hideCopy language="typescript"> @Injectable() <br>export class Logger { } </docs-code>          | logger.service.ts    |

### 啟動

#### Style 02-05

**Do** 把應用程式的啟動與平台邏輯放在名為 `main.ts` 的檔案中。

**Do** 在啟動邏輯中加入錯誤處理。

**Avoid** 把應用程式邏輯放在 `main.ts` 中。
相反地，考慮把它放在元件或服務中。

**Why**? <br />
遵循應用程式啟動邏輯的一致慣例。

**Why**? <br />
遵循其他技術平台的熟悉慣例。

<docs-code header="main.ts" path="adev/src/content/examples/styleguide/src/02-05/main.ts"/>

### 元件選擇器 {#component-selectors}

#### Style 05-02

**Do** 為元件的元素選擇器使用 *dashed-case*（串連式命名）或 *kebab-case*（烤肉串式命名）。

**Why**? <br />
讓元素名稱與 [Custom Elements](https://www.w3.org/TR/custom-elements) 規格保持一致。

<docs-code header="app/heroes/shared/hero-button/hero-button.component.ts" path="adev/src/content/examples/styleguide/src/05-02/app/heroes/shared/hero-button/hero-button.component.avoid.ts" visibleRegion="example"/>

<docs-code-multifile>
    <docs-code header="app/heroes/shared/hero-button/hero-button.component.ts" path="adev/src/content/examples/styleguide/src/05-02/app/heroes/shared/hero-button/hero-button.component.ts" visibleRegion="example"/>
    <docs-code header="app/app.component.html" path="adev/src/content/examples/styleguide/src/05-02/app/app.component.html"/>
</docs-code-multifile>

### 元件自訂前綴

#### Style 02-07

**Do** 使用以連字號分隔的小寫元素選擇器值，例如 `admin-users`。

**Do** 使用能識別功能領域或應用程式本身的前綴。

**Why**? <br />
避免元素名稱與其他應用程式中的元件、以及原生 HTML 元素發生衝突。

**Why**? <br />
讓元件更容易推廣並分享到其他應用程式。

**Why**? <br />
元件在 DOM 中很容易識別。

<docs-code header="app/heroes/hero.component.ts" path="adev/src/content/examples/styleguide/src/02-07/app/heroes/hero.component.avoid.ts" visibleRegion="example"/>

<docs-code header="app/users/users.component.ts" path="adev/src/content/examples/styleguide/src/02-07/app/users/users.component.avoid.ts" visibleRegion="example"/>

<docs-code header="app/heroes/hero.component.ts" path="adev/src/content/examples/styleguide/src/02-07/app/heroes/hero.component.ts" visibleRegion="example"/>

<docs-code header="app/users/users.component.ts" path="adev/src/content/examples/styleguide/src/02-07/app/users/users.component.ts" visibleRegion="example"/>

### 指令選擇器

#### Style 02-06

**Do** 為指令的選擇器使用小駝峰式命名（lower camel case）。

**Why**? <br />
讓指令中定義、並繫結到檢視的屬性名稱，與屬性名稱保持一致。

**Why**? <br />
Angular 的 HTML 解析器區分大小寫，並能辨識小駝峰式命名。

### 指令自訂前綴

#### Style 02-08

**Do** 把非元素選擇器拼成小駝峰式命名，除非該選擇器意在比對原生 HTML 屬性。

**Don't** 為指令名稱加上 `ng` 前綴，因為該前綴是 Angular 保留的，使用它可能造成難以診斷的錯誤。

**Why**? <br />
避免名稱衝突。

**Why**? <br />
指令很容易識別。

<docs-code header="app/shared/validate.directive.ts" path="adev/src/content/examples/styleguide/src/02-08/app/shared/validate.directive.avoid.ts" visibleRegion="example"/>

<docs-code header="app/shared/validate.directive.ts" path="adev/src/content/examples/styleguide/src/02-08/app/shared/validate.directive.ts" visibleRegion="example"/>

### 管道名稱

#### Style 02-09

**Do** 為所有管道使用一致的名稱，依其功能命名。
管道類別名稱應該使用 `UpperCamelCase`（類別名稱的一般慣例），對應的 `name` 字串應該使用 *lowerCamelCase*。
`name` 字串不能使用連字號（「dash-case」或「kebab-case」）。

**Why**? <br />
提供一眼識別並參考管道的一致方式。

| 符號名稱 | 檔案名稱 |
|:---                                                                                                                                                                                  |:---       |
| <docs-code hideCopy language="typescript"> @Pipe({ name: 'ellipsis' }) <br>export class EllipsisPipe implements PipeTransform { } </docs-code> | ellipsis.pipe.ts  |
| <docs-code hideCopy language="typescript"> @Pipe({ name: 'initCaps' }) <br>export class InitCapsPipe implements PipeTransform { } </docs-code> | init-caps.pipe.ts |

### 單元測試檔案名稱

#### Style 02-10

**Do** 讓測試規格檔案與它所測試的元件同名。

**Do** 為測試規格檔案加上 `.spec` 後綴。

**Why**? <br />
提供一眼識別測試的一致方式。

**Why**? <br />
為 [karma](https://karma-runner.github.io) 或其他測試執行器提供模式比對。

| 測試類型  | 檔案名稱 |
|:---        |:---        |
| 元件 | heroes.component.spec.ts <br /> hero-list.component.spec.ts <br /> hero-detail.component.spec.ts |
| 服務   | logger.service.spec.ts <br /> hero.service.spec.ts <br /> filter-text.service.spec.ts            |
| 管道      | ellipsis.pipe.spec.ts <br /> init-caps.pipe.spec.ts                                              |

## 應用程式結構與 NgModule

對實作要有近期的看法，也要有長遠的願景。
從小處著手，但要記住應用程式的發展方向。

應用程式的所有程式碼都放在名為 `src` 的資料夾中。
所有功能領域都有各自的資料夾。

所有內容都是一個檔案一個資產。
每個元件、服務與管道都有自己的檔案。
所有第三方供應商指令碼都存放在另一個資料夾，而不是 `src` 資料夾中。
檔案請使用本指南中的命名慣例。

### 整體結構準則 {#overall-structural-guidelines}

#### Style 04-06

**Do** 從小處著手，但要記住應用程式未來的發展方向。

**Do** 對實作要有近期的看法，也要有長遠的願景。

**Do** 把應用程式的所有程式碼放在名為 `src` 的資料夾中。

**Consider** 當元件有多個伴隨檔案（`.ts`、`.html`、`.css` 與 `.spec`）時，為它建立一個資料夾。

**Why**? <br />
有助於在早期階段讓應用程式結構保持小巧且易於維護，同時在應用程式成長時也容易演進。

**Why**? <br />
元件通常有四個檔案（例如 `*.html`、`*.css`、`*.ts` 與 `*.spec.ts`），很容易讓資料夾變得雜亂。

以下是一個符合規定的資料夾與檔案結構：

```markdown
project root
├── src
│ ├── app
│ │ ├── core
│ │ │ └── exception.service.ts|spec.ts
│ │ │ └── user-profile.service.ts|spec.ts
│ │ ├── heroes
│ │ │ ├── hero
│ │ │ │ └── hero.component.ts|html|css|spec.ts
│ │ │ ├── hero-list
│ │ │ │ └── hero-list.component.ts|html|css|spec.ts
│ │ │ ├── shared
│ │ │ │ └── hero-button.component.ts|html|css|spec.ts
│ │ │ │ └── hero.model.ts
│ │ │ │ └── hero.service.ts|spec.ts
│ │ │ └── heroes.component.ts|html|css|spec.ts
│ │ │ └── heroes.routes.ts
│ │ ├── shared
│ │ │ └── init-caps.pipe.ts|spec.ts
│ │ │ └── filter-text.component.ts|spec.ts
│ │ │ └── filter-text.service.ts|spec.ts
│ │ ├── villains
│ │ │ ├── villain
│ │ │ │ └── …
│ │ │ ├── villain-list
│ │ │ │ └── …
│ │ │ ├── shared
│ │ │ │ └── …
│ │ │ └── villains.component.ts|html|css|spec.ts
│ │ │ └── villains.module.ts
│ │ │ └── villains-routing.module.ts
│ │ └── app.component.ts|html|css|spec.ts
│ │ └── app.routes.ts
│ └── main.ts
│ └── index.html
│ └── …
└── node_modules/…
└── …
```

HELPFUL: 雖然把元件放在專屬資料夾是廣受偏好的做法，但小型應用程式的另一個選擇是讓元件保持扁平（不放在專屬資料夾中）。
這樣會在既有資料夾中多出最多四個檔案，但也減少了資料夾巢狀的層次。
無論你選擇哪一種，都要保持一致。

### *依功能分資料夾*的結構

#### Style 04-07

**Do** 為資料夾以其所代表的功能領域命名。

**Why**? <br />
開發者能一眼定位程式碼，並識別每個檔案代表什麼。
結構儘可能扁平，而且沒有重複或多餘的名稱。

**Why**? <br />
透過組織內容，幫助應用程式避免變得雜亂。

**Why**? <br />
當檔案很多（例如 10 個以上）時，採用一致的資料夾結構比較容易找到它們，扁平結構則比較困難。

更多資訊，請參閱[這個資料夾與檔案結構範例](#overall-structural-guidelines)。

### 應用程式*根模組*

IMPORTANT: 以下樣式指南建議，適用於以 `NgModule` 為基礎的應用程式。新應用程式應改用獨立元件、指令與管道。

#### Style 04-08

**Do** 在應用程式的根資料夾中建立一個 NgModule；例如，建立以 `NgModule` 為基礎的應用程式時，放在 `/src/app` 中。

**Why**? <br />
每個以 `NgModule` 為基礎的應用程式，都至少需要一個根 NgModule。

**Consider** 把根模組命名為 `app.module.ts`。

**Why**? <br />
讓根模組更容易定位與識別。

<docs-code path="adev/src/content/examples/styleguide/src/04-08/app/app.module.ts" language="typescript" visibleRegion="example" header="app/app.module.ts"/>

### 功能模組

#### Style 04-09

**Do** 為應用程式中所有不同的功能建立一個 NgModule，例如 `Heroes` 功能。

**Do** 把功能模組放在與功能領域同名的資料夾中，例如 `app/heroes`。

**Do** 讓功能模組檔案的名稱反映功能領域與資料夾的名稱，例如 `app/heroes/heroes.module.ts`。

**Do** 讓功能模組符號的名稱反映功能領域、資料夾與檔案的名稱，例如 `app/heroes/heroes.module.ts` 定義了 `HeroesModule`。

**Why**? <br />
功能模組可以對其他模組公開或隱藏它的實作。

**Why**? <br />
功能模組標示出構成該功能領域的不同組別的相關元件。

**Why**? <br />
功能模組可以輕鬆地以即時（eager）與延遲（lazy）兩種方式被路由到。

**Why**? <br />
功能模組在特定功能與其他應用程式功能之間定義了清楚的邊界。

**Why**? <br />
功能模組有助於釐清，並讓把開發責任分配給不同團隊變得更容易。

**Why**? <br />
功能模組可以輕鬆地被隔離出來進行測試。

### 共用功能模組

#### Style 04-10

**Do** 在 `shared` 資料夾中建立一個名為 `SharedModule` 的功能模組，例如 `app/shared/shared.module.ts` 定義了 `SharedModule`。

**Do** 當元件、指令與管道會被其他功能模組中宣告的元件重複使用並參考時，在共用模組中宣告它們。

**Consider** 當共用模組的內容被整個應用程式參考時，使用 SharedModule 這個名稱。

**Consider** *不要*在共用模組中提供服務。
服務通常是單例，只會為整個應用程式提供一次，或在某個特定功能模組中提供。
不過也有例外。
例如，在下面的範例程式碼中，請注意 `SharedModule` 提供了 `FilterTextService`。
這在這裡是可以接受的，因為該服務是無狀態的；也就是說，服務的使用者不會受到新實例的影響。

**Do** 匯入 `SharedModule` 中的資產所需要的所有模組，例如 `CommonModule` 與 `FormsModule`。

**Why**? <br />
`SharedModule` 會包含可能需要另一個共用模組功能的元件、指令與管道，例如 `CommonModule` 中的 `ngFor`。

**Do** 在 `SharedModule` 中宣告所有的元件、指令與管道。

**Do** 從 `SharedModule` 匯出其他功能模組需要使用的所有符號。

**Why**? <br />
`SharedModule` 的存在，是為了讓常用的元件、指令與管道，能在許多其他模組的元件範本中使用。

**Avoid** 在 `SharedModule` 中指定應用程式全域的單例提供者。
有意的單例是可以的。
請小心。

**Why**? <br />
延遲載入的功能模組若匯入了那個共用模組，就會建立它自己的服務副本，很可能產生不想要的結果。

**Why**? <br />
你不會希望每個模組都有各自獨立的單例服務實例。
但如果 `SharedModule` 提供了服務，這種事確實有發生的危險。

```markdown
project root
├──src
├──├──app
├──├──├── shared
├──├──├──└── shared.module.ts
├──├──├──└── init-caps.pipe.ts|spec.ts
├──├──├──└── filter-text.component.ts|spec.ts
├──├──├──└── filter-text.service.ts|spec.ts
├──├──└── app.component.ts|html|css|spec.ts
├──├──└── app.module.ts
├──├──└── app-routing.module.ts
├──└── main.ts
├──└── index.html
└── …
```

<docs-code-multifile>
    <docs-code header="app/shared/shared.module.ts" path="adev/src/content/examples/styleguide/src/04-10/app/shared/shared.module.ts"/>
    <docs-code header="app/shared/init-caps.pipe.ts" path="adev/src/content/examples/styleguide/src/04-10/app/shared/init-caps.pipe.ts"/>
    <docs-code header="app/shared/filter-text/filter-text.component.ts" path="adev/src/content/examples/styleguide/src/04-10/app/shared/filter-text/filter-text.component.ts"/>
    <docs-code header="app/shared/filter-text/filter-text.service.ts" path="adev/src/content/examples/styleguide/src/04-10/app/shared/filter-text/filter-text.service.ts"/>
    <docs-code header="app/heroes/heroes.component.ts" path="adev/src/content/examples/styleguide/src/04-10/app/heroes/heroes.component.ts"/>
    <docs-code header="app/heroes/heroes.component.html" path="adev/src/content/examples/styleguide/src/04-10/app/heroes/heroes.component.html"/>
</docs-code-multifile>

### 延遲載入資料夾

#### Style 04-11

一個獨特的應用程式功能或工作流程，可能會被*延遲載入*，或*依需求載入*，而不是在應用程式啟動時載入。

**Do** 把延遲載入功能的內容放在*延遲載入資料夾*中。
典型的*延遲載入資料夾*包含一個*路由元件*、它的子元件，以及它們的相關資產。

**Why**? <br />
資料夾讓功能內容更容易識別與隔離。

## 元件

### 把元件當作元素

#### Style 05-03

**Consider** 給元件*元素*選擇器，而不是*屬性*或*類別*選擇器。

**Why**? <br />
元件有包含 HTML 與選用 Angular 範本語法的範本。
它們會顯示內容。
開發者把元件像原生 HTML 元素與 Web 元件一樣，放在頁面上。

**Why**? <br />
看範本的 html，就更容易辨認出某個符號是元件。

HELPFUL: 有少數情況下你會給元件屬性選擇器，例如當你想擴充內建元素時。
例如，[Material Design](https://material.angular.io/components/button/overview) 就在 `<button mat-button>` 上使用了這個技巧。
不過，你不會把這個技巧用在自訂元素上。

<docs-code header="app/heroes/hero-button/hero-button.component.ts" path="adev/src/content/examples/styleguide/src/05-03/app/heroes/shared/hero-button/hero-button.component.avoid.ts" visibleRegion="example"/>

<docs-code header="app/app.component.html" path="adev/src/content/examples/styleguide/src/05-03/app/app.component.avoid.html"/>

<docs-code-multifile>
    <docs-code header="app/heroes/shared/hero-button/hero-button.component.ts" path="adev/src/content/examples/styleguide/src/05-03/app/heroes/shared/hero-button/hero-button.component.ts" visibleRegion="example"/>
    <docs-code header="app/app.component.html" path="adev/src/content/examples/styleguide/src/05-03/app/app.component.html"/>
</docs-code-multifile>

### 把範本與樣式抽出到各自的檔案

#### Style 05-04

**Do** 當範本與樣式超過 3 行時，把它們抽出到獨立的檔案。

**Do** 把範本檔案命名為 `[component-name].component.html`，其中 [component-name] 是元件名稱。

**Do** 把樣式檔案命名為 `[component-name].component.css`，其中 [component-name] 是元件名稱。

**Do** 指定*以元件為相對基準*的 URL，並以 `./` 作為前綴。

**Why**? <br />
龐大的行內範本與樣式會遮蔽元件的目的與實作，降低可讀性與可維護性。

**Why**? <br />
在大多數編輯器中，開發行內範本與樣式時，沒有語法提示與程式碼片段可用。
Angular TypeScript 語言服務（即將推出）承諾能為支援它的編輯器克服 HTML 範本的這個缺點，但對 CSS 樣式沒有幫助。

**Why**? <br />
*以元件為相對基準*的 URL，在你移動元件檔案時不需要變更，只要這些檔案保持在一起。

**Why**? <br />
`./` 前綴是相對 URL 的標準語法；不要依賴 Angular 目前可以省略該前綴的能力。

<docs-code header="app/heroes/heroes.component.ts" path="adev/src/content/examples/styleguide/src/05-04/app/heroes/heroes.component.avoid.ts" visibleRegion="example"/>

<docs-code-multifile>
    <docs-code header="app/heroes/heroes.component.ts" path="adev/src/content/examples/styleguide/src/05-04/app/heroes/heroes.component.ts" visibleRegion="example"/>
    <docs-code header="app/heroes/heroes.component.html" path="adev/src/content/examples/styleguide/src/05-04/app/heroes/heroes.component.html"/>
    <docs-code header="app/heroes/heroes.component.css" path="adev/src/content/examples/styleguide/src/05-04/app/heroes/heroes.component.css"/>
</docs-code-multifile>

### 以裝飾器標記 `input` 與 `output` 屬性

#### Style 05-12

**Do** 使用 `@Input()` 與 `@Output()` 類別裝飾器，而不是 `@Directive` 與 `@Component` 中繼資料的 `inputs` 與 `outputs` 屬性：

**Consider** 把 `@Input()` 或 `@Output()` 放在與它所修飾的屬性同一行。

**Why**? <br />
更容易且更清楚地辨識類別中哪些屬性是輸入或輸出。

**Why**? <br />
如果你需要重新命名與 `@Input()` 或 `@Output()` 相關聯的屬性或事件名稱，你可以在單一位置修改它。

**Why**? <br />
附加在指令上的中繼資料宣告更短，因此更容易閱讀。

**Why**? <br />
把裝飾器放在同一行，*通常*能讓程式碼更短，而且仍然很容易識別該屬性是輸入還是輸出。
當放在前一行明顯更容易閱讀時，就放在前一行。

<docs-code header="app/heroes/shared/hero-button/hero-button.component.ts" path="adev/src/content/examples/styleguide/src/05-12/app/heroes/shared/hero-button/hero-button.component.avoid.ts" visibleRegion="example"/>

<docs-code header="app/heroes/shared/hero-button/hero-button.component.ts" path="adev/src/content/examples/styleguide/src/05-12/app/heroes/shared/hero-button/hero-button.component.ts" visibleRegion="example"/>

### 避免為 `inputs` 與 `outputs` 取別名

#### Style 05-13

**Avoid** 使用 `input` 與 `output` 別名，除非它有重要的目的。

**Why**? <br />
同一個屬性有兩個名字（一個私用、一個公用）本質上就令人混淆。

**Why**? <br />
當指令名稱同時也是一個 `input` 屬性，而且指令名稱無法描述該屬性時，你應該使用別名。

<docs-code header="app/heroes/shared/hero-button/hero-button.component.ts" path="adev/src/content/examples/styleguide/src/05-13/app/heroes/shared/hero-button/hero-button.component.avoid.ts" visibleRegion="example"/>

<docs-code header="app/app.component.html" path="adev/src/content/examples/styleguide/src/05-13/app/app.component.avoid.html"/>

<docs-code-multifile>
    <docs-code header="app/heroes/shared/hero-button/hero-button.component.ts" path="adev/src/content/examples/styleguide/src/05-13/app/heroes/shared/hero-button/hero-button.component.ts" visibleRegion="example"/>
    <docs-code header="app/heroes/shared/hero-button/hero-highlight.directive.ts" path="adev/src/content/examples/styleguide/src/05-13/app/heroes/shared/hero-highlight.directive.ts"/>
    <docs-code header="app/app.component.html" path="adev/src/content/examples/styleguide/src/05-13/app/app.component.html"/>
</docs-code-multifile>

### 把複雜的元件邏輯委派給服務

#### Style 05-15

**Do** 把元件中的邏輯限制在檢視所需的範圍內。
所有其他邏輯都應該委派給服務。

**Do** 把可重複使用的邏輯移到服務中，讓元件保持簡單並專注於其預定目的。

**Why**? <br />
邏輯放在服務中並以函式公開時，可以被多個元件重複使用。

**Why**? <br />
服務中的邏輯可以更容易地在單元測試中隔離，而元件中的呼叫邏輯則可以輕鬆被模擬（mock）。

**Why**? <br />
移除依賴，並對元件隱藏實作細節。

**Why**? <br />
讓元件保持精簡、俐落且專注。

<docs-code header="app/heroes/hero-list/hero-list.component.ts" path="adev/src/content/examples/styleguide/src/05-15/app/heroes/hero-list/hero-list.component.avoid.ts"/>

<docs-code header="app/heroes/hero-list/hero-list.component.ts" path="adev/src/content/examples/styleguide/src/05-15/app/heroes/hero-list/hero-list.component.ts" visibleRegion="example"/>

### 不要為 `output` 屬性加前綴

#### Style 05-16

**Do** 為事件命名時不要加上 `on` 前綴。

**Do** 為事件處理常式方法命名時，加上 `on` 前綴，後面接著事件名稱。

**Why**? <br />
這與按鈕點擊之類的內建事件一致。

**Why**? <br />
Angular 允許使用[替代語法](guide/templates/binding) `on-*`。
如果事件本身加上了 `on` 前綴，這會產生 `on-onEvent` 的繫結運算式。

<docs-code header="app/heroes/hero.component.ts" path="adev/src/content/examples/styleguide/src/05-16/app/heroes/hero.component.avoid.ts" visibleRegion="example"/>

<docs-code header="app/app.component.html" path="adev/src/content/examples/styleguide/src/05-16/app/app.component.avoid.html"/>

<docs-code-multifile>
    <docs-code header="app/heroes/hero.component.ts" path="adev/src/content/examples/styleguide/src/05-16/app/heroes/hero.component.ts" visibleRegion="example"/>
    <docs-code header="app/app.component.html" path="adev/src/content/examples/styleguide/src/05-16/app/app.component.html"/>
</docs-code-multifile>

### 把呈現邏輯放在元件類別中

#### Style 05-17

**Do** 把呈現邏輯放在元件類別中，而不是範本中。

**Why**? <br />
邏輯會集中在一個地方（元件類別），而不是分散在兩個地方。

**Why**? <br />
把元件的呈現邏輯放在類別而不是範本中，能改善可測試性、可維護性與可重複使用性。

<docs-code header="app/heroes/hero-list/hero-list.component.ts" path="adev/src/content/examples/styleguide/src/05-17/app/heroes/hero-list/hero-list.component.avoid.ts" visibleRegion="example"/>

<docs-code header="app/heroes/hero-list/hero-list.component.ts" path="adev/src/content/examples/styleguide/src/05-17/app/heroes/hero-list/hero-list.component.ts" visibleRegion="example"/>
### 初始化輸入

#### Style 05-18

TypeScript 的 `--strictPropertyInitialization` 編譯器選項，確保類別在建構期間初始化它的屬性。
啟用時，如果類別沒有為任何未明確標記為選用的屬性設定值，這個選項會讓 TypeScript 編譯器回報錯誤。

依設計，Angular 把所有 `@Input` 屬性都視為選用。
只要做得到，你應該提供預設值，來滿足 `--strictPropertyInitialization`。

<docs-code header="app/heroes/hero/hero.component.ts" path="adev/src/content/examples/styleguide/src/05-18/app/heroes/hero/hero.component.ts" visibleRegion="example"/>

如果某個屬性很難建構預設值，使用 `?` 明確把該屬性標記為選用。

<docs-code header="app/heroes/hero/hero.component.ts" path="adev/src/content/examples/styleguide/src/05-18/app/heroes/hero/hero.component.optional.ts" visibleRegion="example"/>

你可能想要有一個必填的 `@Input` 欄位，意思是元件的所有使用者都必須傳入該屬性。
在這種情況下，使用預設值。
只用 `!` 壓制 TypeScript 錯誤是不夠的，應該避免，因為那會讓型別檢查器無法確保輸入值有被提供。

<docs-code header="app/heroes/hero/hero.component.ts" path="adev/src/content/examples/styleguide/src/05-18/app/heroes/hero/hero.component.avoid.ts" visibleRegion="example"/>

## 指令

### 使用指令強化元素

#### Style 06-01

**Do** 當你有沒有範本的呈現邏輯時，使用屬性指令。

**Why**? <br />
屬性指令沒有相關聯的範本。

**Why**? <br />
一個元素可以套用多個屬性指令。

<docs-code header="app/shared/highlight.directive.ts" path="adev/src/content/examples/styleguide/src/06-01/app/shared/highlight.directive.ts" visibleRegion="example"/>

<docs-code header="app/app.component.html" path="adev/src/content/examples/styleguide/src/06-01/app/app.component.html"/>

### `HostListener`/`HostBinding` 裝飾器與 `host` 中繼資料

#### Style 06-03

**Consider** 偏好使用 `@HostListener` 與 `@HostBinding`，而不是 `@Directive` 與 `@Component` 裝飾器的 `host` 屬性。

**Do** 在你的選擇上保持一致。

**Why**? <br />
與 `@HostBinding` 相關聯的屬性，或與 `@HostListener` 相關聯的方法，只能在單一位置修改——也就是指令的類別中。
如果你使用 `host` 中繼資料屬性，你必須同時修改指令類別中的屬性／方法宣告，以及與指令相關聯的裝飾器中的中繼資料。

<docs-code header="app/shared/validator.directive.ts" path="adev/src/content/examples/styleguide/src/06-03/app/shared/validator.directive.ts"/>

與較不偏好的 `host` 中繼資料替代方案比較。

**Why**? <br />
`host` 中繼資料只需要記住一個詞彙，而且不需要額外的 ES 匯入。

<docs-code header="app/shared/validator2.directive.ts" path="adev/src/content/examples/styleguide/src/06-03/app/shared/validator2.directive.ts"/>
## 服務

### 服務是單例

#### Style 07-01

**Do** 在同一個注入器內，把服務當作單例使用。
使用它們來共享資料與功能。

**Why**? <br />
服務非常適合在功能領域或應用程式之間共享方法。

**Why**? <br />
服務非常適合共享有狀態的記憶體內資料。

<docs-code header="app/heroes/shared/hero.service.ts" path="adev/src/content/examples/styleguide/src/07-01/app/heroes/shared/hero.service.ts" visibleRegion="example"/>

### 提供服務

#### Style 07-03

**Do** 在服務的 `@Injectable` 裝飾器中，以應用程式根注入器提供服務。

**Why**? <br />
Angular 注入器是階層式的。

**Why**? <br />
當你把服務提供給根注入器時，該服務的實例會被共享，並可在每個需要該服務的類別中使用。
當服務在共享方法或狀態時，這是最理想的做法。

**Why**? <br />
當你在服務的 `@Injectable` 裝飾器中註冊服務時，[Angular CLI](cli) 生產建置所使用的最佳化工具，可以執行 tree shaking，移除應用程式未使用的服務。

**Why**? <br />
當兩個不同元件需要不同的服務實例時，這就不是理想的做法。
在這種情境下，比較好的做法是在需要新的獨立實例的元件層級提供服務。

<docs-code header="src/app/treeshaking/service.ts" path="adev/src/content/examples/dependency-injection/src/app/tree-shaking/service.ts"/>

### 使用 @Injectable() 類別裝飾器

#### Style 07-04

**Do** 當使用型別作為服務依賴的權杖（token）時，使用 `@Injectable()` 類別裝飾器，而不是 `@Inject` 參數裝飾器。

**Why**? <br />
Angular 依賴注入（DI）機制，會根據服務的建構函式參數所宣告的型別，解析服務自身的
依賴。

**Why**? <br />
當服務只接受與型別權杖相關聯的依賴時，`@Injectable()` 語法比在每個建構函式參數上使用 `@Inject()` 簡潔得多。

<docs-code header="app/heroes/shared/hero-arena.service.ts" path="adev/src/content/examples/styleguide/src/07-04/app/heroes/shared/hero-arena.service.avoid.ts" visibleRegion="example"/>

<docs-code header="app/heroes/shared/hero-arena.service.ts" path="adev/src/content/examples/styleguide/src/07-04/app/heroes/shared/hero-arena.service.ts" visibleRegion="example"/>
## 資料服務

### 透過服務與伺服器溝通

#### Style 08-01

**Do** 把進行資料操作與和資料互動的邏輯重構到服務中。

**Do** 讓資料服務負責 XHR 呼叫、本機儲存、暫存在記憶體中，或任何其他資料操作。

**Why**? <br />
元件的職責是為檢視呈現與收集資訊。
它不應該在意資料如何取得，只需要知道要向誰索取。
把資料服務分離出來，能把「如何取得資料」的邏輯移到資料服務中，讓元件更簡單、更專注於檢視。

**Why**? <br />
這讓你在測試使用資料服務的元件時，更容易測試（模擬或真實）資料呼叫。

**Why**? <br />
資料管理的細節，例如標頭、HTTP 方法、快取、錯誤處理與重試邏輯，與元件和其他資料消費者無關。

資料服務封裝了這些細節。
在服務內部演進這些細節比較容易，不會影響它的消費者。
而且用模擬的服務實作來測試消費者也更容易。

## 生命週期鉤子

使用生命週期鉤子，銜接 Angular 公開的重要事件。

### 實作生命週期鉤子介面

#### Style 09-01

**Do** 實作生命週期鉤子介面。

**Why**? <br />
生命週期介面規定了有型別的方法簽章。
使用這些簽章來標記出拼字與語法錯誤。

<docs-code header="app/heroes/shared/hero-button/hero-button.component.ts" path="adev/src/content/examples/styleguide/src/09-01/app/heroes/shared/hero-button/hero-button.component.avoid.ts" visibleRegion="example"/>

<docs-code header="app/heroes/shared/hero-button/hero-button.component.ts" path="adev/src/content/examples/styleguide/src/09-01/app/heroes/shared/hero-button/hero-button.component.ts" visibleRegion="example"/>
## 附錄

Angular 的實用工具與提示。

### 檔案範本與程式碼片段

#### Style A-02

**Do** 使用檔案範本或程式碼片段，協助遵循一致的樣式與模式。
以下是一些 Web 開發編輯器與 IDE 的範本與／或程式碼片段。

**Consider** 為 [Visual Studio Code](https://code.visualstudio.com) 使用遵循這些樣式與準則的[程式碼片段](https://marketplace.visualstudio.com/items?itemName=johnpapa.Angular2)。

<a href="https://marketplace.visualstudio.com/items?itemName=johnpapa.Angular2">

<img alt="Use Extension" src="assets/images/guide/styleguide/use-extension.gif">

</a>

**Consider** 為 [Sublime Text](https://www.sublimetext.com) 使用遵循這些樣式與準則的[程式碼片段](https://github.com/orizens/sublime-angular2-snippets)。

**Consider** 為 [Vim](https://www.vim.org) 使用遵循這些樣式與準則的[程式碼片段](https://github.com/mhartington/vim-angular2-snippets)。
