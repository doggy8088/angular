# Angular 程式碼風格指南

正在尋找有關 Angular 語法、慣例和應用結構的意見指南？
請立即進入。
此風格指南提供了首選慣例，更重要的是，解釋了原因。

## 風格詞彙

每個準則皆說明良好或不良的做法，且皆具有一致性的呈現方式。

每項指引的措辭都說明了建議的強烈程度。

**Do** 是應該永遠遵循的。
*Always* 可能是一個太強烈的詞。
字面上應該永遠遵循的準則極為罕見。
另一方面，你需要一個非常特殊的情況來打破一個 *Do* 準則。

**考慮**指南應普遍遵循。
如果你完全理解指南背後的含義並且有很好的理由偏離，那就這麼做。
目標是一致。

**避免**表示您幾乎永遠不應該做的事情。
要*避免*的程式碼範例具有無法錯認的紅色標頭。

**為什麼**？<br />
提供理由，說明為何要遵循前面的建議。

## 檔案結構慣例

一些程式碼範例顯示一個具有多個類似名稱的伴生檔案的檔案。
例如，`hero.component.ts` 和 `hero.component.html`。

指南使用捷徑 `hero.component.ts|html|css|spec` 來表示這些不同的檔案。
使用這個捷徑讓本指南的檔案結構更容易閱讀且更簡潔。

## 單一職責

將 [*單一職責原則 (SRP)*](https://wikipedia.org/wiki/Single_responsibility_principle) 套用到所有元件、服務和其他符號。
這有助於讓應用程式更乾淨、更容易閱讀和維護，且更具可測試性。

### 一的規則

#### 風格 01-01

**做**每檔案定義一件事，例如服務或元件。

**考慮**將檔案限制在 400 行程式碼。

**為什麼**？ <br />
每個檔案一個元件，讓閱讀、維護和避免與來源控制中的團隊發生衝突變得更輕鬆。

**為什麼**？<br />
每個檔案一個元件可避免在一個檔案中組合元件時經常出現的隱藏錯誤，在該檔案中元件可能會共用變數、建立不需要的閉包或與依賴項建立不需要的關聯。

**為什麼**？<br />
單一元件可以是其檔案的預設匯出，這有利於路由器的延遲載入。

關鍵在於使程式碼更具可重複使用性、更容易閱讀且減少錯誤。

以下 *負面* 範例定義了 `AppComponent`，引導程式，定義 `Hero` 模型物件，並從伺服器載入英雄，所有操作都在同一個檔案中進行。
*不要這樣做*。

<docs-code path="adev/src/content/examples/styleguide/src/01-01/app/heroes/hero.component.avoid.ts" language="typescript" header="app/heroes/hero.component.ts"/>

將元件及其支援類別重新分配到其專用檔案中是一種更好的做法。

<docs-code-multifile>
    <docs-code header="main.ts" path="adev/src/content/examples/styleguide/src/01-01/main.ts"/>
    <docs-code header="app/app.module.ts" path="adev/src/content/examples/styleguide/src/01-01/app/app.module.ts"/>
    <docs-code header="app/app.component.ts" path="adev/src/content/examples/styleguide/src/01-01/app/app.component.ts"/>
    <docs-code header="app/heroes/heroes.component.ts" path="adev/src/content/examples/styleguide/src/01-01/app/heroes/heroes.component.ts"/>
    <docs-code header="app/heroes/shared/hero.service.ts" path="adev/src/content/examples/styleguide/src/01-01/app/heroes/shared/hero.service.ts"/>
    <docs-code header="app/heroes/shared/hero.model.ts" path="adev/src/content/examples/styleguide/src/01-01/app/heroes/shared/hero.model.ts"/>
    <docs-code header="app/heroes/shared/mock-heroes.ts" path="adev/src/content/examples/styleguide/src/01-01/app/heroes/shared/mock-heroes.ts"/>
</docs-code-multifile>

隨著應用程式的發展，此規則變得更加重要。

## 命名

命名慣例對於可維護性和可讀性非常重要。
本指南建議檔案名稱和符號名稱的命名慣例。

### 一般命名準則

#### 風格 02-01

**做**對所有符號使用一致的名稱。

**請**遵循一種描述符號特徵然後是其類型的模式。
建議的模式是 `feature.type.ts`。

**為什麼**？<br />
命名慣例有助於提供一致的方式，以便快速找到內容。
專案內的一致性至關重要。
與團隊的一致性很重要。
整個公司的一致性可提供極高的效率。

**為什麼**？<br />
命名慣例應有助於更快找到所需的程式碼，並讓其更易於理解。

**為什麼**？<br />
資料夾與檔案的名稱應該清楚傳達它們的意圖。
例如，`app/heroes/hero-list.component.ts` 可能包含管理英雄清單的元件。

### 使用點號和連接字元將檔案名稱分開

#### Style 02-02

**請**用破折號分隔描述性名稱中的字詞。

**請**使用點來區分說明性名稱與類型。

**請**為所有元件使用一致的類型名稱，遵循描述元件功能的模式，然後是類型。
建議的模式是 `feature.type.ts`。

**請**使用包含 `.service`、`.component`、`.pipe`、`.module` 和 `.directive` 的慣用類型名稱。
若有必要，可以發明其他類型名稱，但請注意不要建立太多。

**為什麼**？<br />
類型名稱提供一致的方法來快速識別檔案中的內容。

**為什麼**？ <br />
類型名稱使您可以使用編輯器或 IDE 的模糊搜尋技巧輕鬆找到特定檔案類型。

**為什麼**？<br />
未縮寫的類型名稱，例如 `.service`，具有描述性和無歧義性。
縮寫，例如 `.srv`、`.svc` 和 `.serv`，可能會令人混淆。

**為什麼**？<br />
類型名稱提供任何自動化任務的模式比對。

### 符號和檔案名稱

#### 風格 02-03

**做**對所有資產使用一致的名稱，以它們代表的名稱命名。

**Do** 使用大寫駝峰式命名法作為類別名稱。

**請**將符號的名稱與檔案名稱相符。

**請**為該類型的事物附加慣例字尾（例如 `Component`、`Directive`、`Module`、`Pipe` 或 `Service`）至符號名稱。

**請**為該類型檔案提供慣例字尾（例如 `.component.ts`、`.directive.ts`、`.module.ts`、`.pipe.ts` 或 `.service.ts`）。

**為什麼**？ <br />
一致的慣例使快速識別和參照不同類型的資產變得容易。

| 符號名稱                                                                                                                                                                          | 檔案名稱 |
|:---                                                                                                                                                                                  |:---       |
| <docs-code hideCopy language="typescript"> &commat;Component({ &hellip; }) &NewLine;export class AppComponent { } </docs-code>                             | app.component.ts |
| <docs-code hideCopy language="typescript"> &commat;Component({ &hellip; }) &NewLine;export class HeroesComponent { } </docs-code>                          | heroes.component.ts |
| <docs-code hideCopy language="typescript"> &commat;Component({ &hellip; }) &NewLine;export class HeroListComponent { } </docs-code>                        | hero-list.component.ts |
| <docs-code hideCopy language="typescript"> &commat;Component({ &hellip; }) &NewLine;export class HeroDetailComponent { } </docs-code>                      | hero-detail.component.ts |
| <docs-code hideCopy language="typescript"> &commat;Directive({ &hellip; }) &NewLine;export class ValidationDirective { } </docs-code>                      | validation.directive.ts |
| <docs-code hideCopy language="typescript"> &commat;NgModule({ &hellip; }) &NewLine;export class AppModule </docs-code>                                     | app.module.ts |
| <docs-code hideCopy language="typescript"> &commat;Pipe({ name: 'initCaps' }) &NewLine;export class InitCapsPipe implements PipeTransform { } </docs-code> | init-caps.pipe.ts |
| <docs-code hideCopy language="typescript"> &commat;Injectable() &NewLine;export class UserProfileService { } </docs-code>                                  | user-profile.service.ts |

### 服務名稱

#### 風格 02-04

**請**對所有以其功能命名的服務使用一致的名稱。

**請**以 `Service` 為字尾來為服務類別命名。
例如，用於取得資料或英雄的類別應稱為 `DataService` 或 `HeroService`。

以下幾個術語明確是服務。
它們通常以「-er」結尾，表示代理。
您可能比較喜歡將記錄訊息的服務命名為 `Logger`，而不是 `LoggerService`。
決定這個例外是否可以接受。
一如往常，力求一致。

**為什麼**？<br />
提供一致的方法來快速識別和參考服務。

**為什麼**？<br />
像 `Logger` 這樣明確的服務名稱不需要字尾。

**為什麼**？<br />
服務名稱例如 `Credit` 是名詞，需要一個字尾，並且當它是否是一個服務或其他東西不顯而易見時，應該使用字尾來命名。

| 符號名稱                                                                                                                                    | 檔案名稱 |
|:---                                                                                                                                              |:---       |
| <docs-code hideCopy language="typescript"> &commat;Injectable() &NewLine;export class HeroDataService { } </docs-code> | hero-data.service.ts |
| <docs-code hideCopy language="typescript"> &commat;Injectable() &NewLine;export class CreditService { } </docs-code>   | credit.service.ts    |
| <docs-code hideCopy language="typescript"> &commat;Injectable() &NewLine;export class Logger { } </docs-code>          | logger.service.ts    |

### Bootstrapping

#### 風格 02-05

**請**將應用程式的自舉程序和平台邏輯放在名為 `main.ts` 的檔案中。

**請**在引導邏輯中包含錯誤處理。

**避免**在 `main.ts` 中放置應用程式邏輯。
相反，考慮將其放在元件或服務中。

**為什麼**？<br />
遵循應用程式啟動邏輯的一致慣例。

**為什麼**？<br />
遵循其他技術平台的慣常約定。

<docs-code header="main.ts" path="adev/src/content/examples/styleguide/src/02-05/main.ts"/>

### 元件選擇器

#### Style 05-02

**做** 使用 *dashed-case* 或 *kebab-case* 命名元件的元素選擇器。

**為什麼**？<br />
讓元素名稱與 [自訂元素](https://www.w3.org/TR/custom-elements) 規範保持一致。

<docs-code header="app/heroes/shared/hero-button/hero-button.component.ts" path="adev/src/content/examples/styleguide/src/05-02/app/heroes/shared/hero-button/hero-button.component.avoid.ts" visibleRegion="example"/>

<docs-code-multifile>
    <docs-code header="app/heroes/shared/hero-button/hero-button.component.ts" path="adev/src/content/examples/styleguide/src/05-02/app/heroes/shared/hero-button/hero-button.component.ts" visibleRegion="example"/>
    <docs-code header="app/app.component.html" path="adev/src/content/examples/styleguide/src/05-02/app/app.component.html"/>
</docs-code-multifile>

### 元件自訂前綴

#### 風格 02-07

**請**使用連字號、小寫的元素選擇器值；例如，`admin-users`。

**請**使用識別功能區域或應用程式本身的前綴。

**為什麼**？<br />
防止元素名稱與其他應用程式中的元件和原生 HTML 元素發生碰撞。

**為什麼**？<br />
更容易在其他應用程式中推廣和分享該元件。

**為什麼**？<br />
元件在 DOM 中很容易識別。

<docs-code header="app/heroes/hero.component.ts" path="adev/src/content/examples/styleguide/src/02-07/app/heroes/hero.component.avoid.ts" visibleRegion="example"/>

<docs-code header="app/users/users.component.ts" path="adev/src/content/examples/styleguide/src/02-07/app/users/users.component.avoid.ts" visibleRegion="example"/>

<docs-code header="app/heroes/hero.component.ts" path="adev/src/content/examples/styleguide/src/02-07/app/heroes/hero.component.ts" visibleRegion="example"/>

<docs-code header="app/users/users.component.ts" path="adev/src/content/examples/styleguide/src/02-07/app/users/users.component.ts" visibleRegion="example"/>

### 指令選擇器

#### 風格 02-06

**請**為指令的選取器命名時使用小寫駝峰式大小寫。

**為什麼**？ <br />
使繫結到檢視的指令中定義的屬性名稱與屬性名稱一致。

**為什麼**？<br />
Angular HTML 解析器區分大小寫，並識別小寫駝峰式大小寫。

### 指令自訂前綴

#### 風格 02-08

**Do** 以小寫駝峰式大小寫拼寫非元素選擇器，除非選擇器用於比對原生 HTML 屬性。

**不要**在指令名稱前面加上 `ng` 前綴，因為此前綴是為 Angular 保留，使用它可能會造成難以診斷的錯誤。

**為什麼**？ <br />
防止名稱衝突。

**為什麼**？ <br />
指令很容易識別。

<docs-code header="app/shared/validate.directive.ts" path="adev/src/content/examples/styleguide/src/02-08/app/shared/validate.directive.avoid.ts" visibleRegion="example"/>

<docs-code header="app/shared/validate.directive.ts" path="adev/src/content/examples/styleguide/src/02-08/app/shared/validate.directive.ts" visibleRegion="example"/>

### 管道名稱

#### 風格 02-09

**請**為所有管線使用一致的名稱，以其功能命名。
管線類別名稱應使用 `UpperCamelCase`（類別名稱的通用慣例），而對應的 `name` 字串應使用 *lowerCamelCase*。
`name` 字串不能使用連字號（「dash-case」或「kebab-case」）。

**為什麼**？ <br />
提供一致的方式來快速識別和參照管道。

| 符號名稱                                                                                                                                                                          | 檔案名稱 |
|:---                                                                                                                                                                                  |:---       |
| <docs-code hideCopy language="typescript"> &commat;Pipe({ standalone: true, name: 'ellipsis' }) &NewLine;export class EllipsisPipe implements PipeTransform { } </docs-code> | ellipsis.pipe.ts  |
| <docs-code hideCopy language="typescript"> &commat;Pipe({ standalone: true, name: 'initCaps' }) &NewLine;export class InitCapsPipe implements PipeTransform { } </docs-code> | init-caps.pipe.ts |

### 單元測試檔案名稱

#### 風格 02-10

**做** 命名測試規範檔案的名稱與它測試的元件相同。

**做**以`.spec`為字尾來命名測試規範檔案。

**為什麼**？<br />
提供一致的方式來快速識別測試。

**為什麼**？<br />
提供 [karma](https://karma-runner.github.io) 或其他測試執行器的模式比對。

| 測試類型 | 檔案名稱 |
|:---        |:---        |
| 元件      | heroes.component.spec.ts <br /> hero-list.component.spec.ts <br /> hero-detail.component.spec.ts |
| 服務      | logger.service.spec.ts <br /> hero.service.spec.ts <br /> filter-text.service.spec.ts            |
| 管道      | ellipsis.pipe.spec.ts <br /> init-caps.pipe.spec.ts                                              |

## 應用程式結構和 NgModules

實施上要有近期的觀點，也要有長期的願景。
從小處著手，但要記住應用程式的發展方向。

所有應用程式程式碼都放在一個名為 `src` 的資料夾中。
所有功能區域都在各自的資料夾中。

所有內容都是一個檔案中的一個資產。
每個元件、服務和管道都在自己的檔案中。
所有第三方供應商腳本都儲存在另一個資料夾中，不在 `src` 資料夾中。
使用本指南中檔案的命名慣例。

### 整體結構指南

#### 風格 04-06

**做**從小處著手，但要記住應用程式將來的發展方向。

**做**有近期的實施觀點和長期的願景。

**請**將所有應用程式程式碼放入一個名為 `src` 的資料夾中。

當元件有多個隨附檔案（`.ts`、`.html`、`.css` 和 `.spec`）時，**考慮**為元件建立一個資料夾。

**為何**？<br />
在早期階段時，有助於讓應用程式的結構保持精簡且易於維護，同時在應用程式成長時也易於發展。

**為什麼**？<br />
元件通常有四個檔案（例如，`*.html`、`*.css`、`*.ts` 和 `*.spec.ts`），並可能快速混亂資料夾。

以下是符合規定的資料夾和檔案結構：

```markdown
project root
├── src
│ ├── app
│ │ ├── core
│ │ │ └── exception.service.ts&verbar;spec.ts
│ │ │ └── user-profile.service.ts&verbar;spec.ts
│ │ ├── heroes
│ │ │ ├── hero
│ │ │ │ └── hero.component.ts&verbar;html&verbar;css&verbar;spec.ts
│ │ │ ├── hero-list
│ │ │ │ └── hero-list.component.ts&verbar;html&verbar;css&verbar;spec.ts
│ │ │ ├── shared
│ │ │ │ └── hero-button.component.ts&verbar;html&verbar;css&verbar;spec.ts
│ │ │ │ └── hero.model.ts
│ │ │ │ └── hero.service.ts&verbar;spec.ts
│ │ │ └── heroes.component.ts&verbar;html&verbar;css&verbar;spec.ts
│ │ │ └── heroes.routes.ts
│ │ ├── shared
│ │ │ └── init-caps.pipe.ts&verbar;spec.ts
│ │ │ └── filter-text.component.ts&verbar;spec.ts
│ │ │ └── filter-text.service.ts&verbar;spec.ts
│ │ ├── villains
│ │ │ ├── villain
│ │ │ │ └── &hellip;
│ │ │ ├── villain-list
│ │ │ │ └── &hellip;
│ │ │ ├── shared
│ │ │ │ └── &hellip;
│ │ │ └── villains.component.ts&verbar;html&verbar;css&verbar;spec.ts
│ │ │ └── villains.module.ts
│ │ │ └── villains-routing.module.ts
│ │ └── app.component.ts&verbar;html&verbar;css&verbar;spec.ts
│ │ └── app.routes.ts
│ └── main.ts
│ └── index.html
│ └── &hellip;
└── node_modules/&hellip;
└── &hellip;
```

HELPFUL: 儘管將元件放在專用資料夾中是廣泛的首選，但小型應用程式的另一種選擇是讓元件保持扁平（不在專用資料夾中）。
這會在現有資料夾中增加多達四個檔案，但也會減少資料夾的層級。
無論您選擇哪一種，都要保持一致。

### *依據功能* 資料夾結構

#### 風格 04-07

**請**為所代表的功能區建立名為資料夾的文件夾。

**為什麼**？<br />
開發人員可以一眼就找到程式碼並識別每個檔案代表什麼。
結構儘可能扁平，沒有重複或冗餘的名稱。

**為什麼**？<br />
藉由組織內容，幫助減少應用程式變得雜亂。

**為什麼**？<br />
當有大量檔案時，例如 10 個以上，使用一致的資料夾結構可以更輕鬆地找到它們，而在扁平結構中則更難找到。

如需更多資訊，請參閱 [此資料夾與檔案結構範例](#file-tree)。

### App *root module*

重要：以下風格指南建議適用於基於 `NgModule` 的應用程式。新的應用程式應改用獨立元件、指令和管道。

#### 風格 04-08

**請**在應用程式的根目錄中建立一個 `NgModule`，例如，在 `/src/app` 中建立一個基於 `NgModule` 的應用程式。

**為什麼**？<br />
每個基於 `NgModule` 的應用程式至少需要一個根 NgModule。

**考慮**將根模組命名為 `app.module.ts`。

**為什麼**？<br />
讓定位和識別根模組更容易。

<docs-code path="adev/src/content/examples/styleguide/src/04-08/app/app.module.ts" language="typescript" visibleRegion="example" header="app/app.module.ts"/>

### 功能模組

#### 風格 04-09

**請**為應用程式中的所有不同功能建立一個 NgModule；例如，`Heroes` 功能。

**請**將功能模組放在與功能區域同名的資料夾中；例如，在 `app/heroes` 中。

**請**依據功能區域和資料夾名稱來命名功能模組檔案；例如，`app/heroes/heroes.module.ts`。

**請**以功能區域、資料夾和檔案的名稱為功能模組符號命名，例如，`app/heroes/heroes.module.ts` 定義 `HeroesModule`。

**為什麼**？<br />
功能模組可以公開或隱藏其實作以供其他模組使用。

**為什麼**？ <br />
功能模組識別出組成功能區域的不同相關元件組。

**為什麼**？ <br />
功能模組可以輕易地路由到急切和延遲。

**為什麼**？<br />
功能模組在特定功能和其他應用程式功能之間定義明確的界線。

**為什麼**？<br/>
功能模組有助於釐清和使開發責任更容易分配給不同的團隊。

**為什麼**？<br />
功能模組可以輕鬆地隔離以進行測試。

### 共享功能模組

#### 風格 04-10

**請**在 `shared` 資料夾中建立一個名為 `SharedModule` 的功能模組；例如，`app/shared/shared.module.ts` 定義 `SharedModule`。

**請**在那些項目將會被其他功能模組中所宣告的元件所重複使用和參照時，在共享模組中宣告元件、指令和管道。

**考慮**在共享模組的內容在整個應用程式中被參照時使用 SharedModule 名稱。

**考慮** *不* 在共用模組中提供服務。
服務通常是僅提供一次給整個應用程式或特定功能模組的單例。
不過，也有例外。
例如，在下列範例程式碼中，請注意 `SharedModule` 提供了 `FilterTextService`。
這在這裡是可以接受的，因為服務是無狀態的；也就是說，服務的消費者不會受到新執行個體的影響。

**請**匯入 `SharedModule` 中的資產所需的所有模組；例如，`CommonModule` 和 `FormsModule`。

**為什麼**？ <br />
`SharedModule` 將包含可能需要另一個共用模組的功能的元件、指令和管道；例如，`CommonModule` 中的 `ngFor`。

**做**在 `SharedModule` 中宣告所有元件、指令和管道。

**請**從 `SharedModule` 匯出其他功能模組需要使用的所有符號。

**為什麼**？<br />
`SharedModule` 存在的目的是讓常用的元件、指令和管道可供其他多個模組的元件範本使用。

**避免**在 `SharedModule` 中指定應用程式範圍的單例提供者。
有意的單例是可以的。
小心。

**為什麼**？<br />
載入延遲的功能模組匯入共用模組會建立服務的自己的副本，並可能會產生不良結果。

**為什麼**？<br />
您不希望每個模組都有自己的單例服務實體。
然而，如果 `SharedModule` 提供服務，就會有真正發生這種情況的危險。

```markdown
project root
├──src
├──├──app
├──├──├── shared
├──├──├──└── shared.module.ts
├──├──├──└── init-caps.pipe.ts&verbar;spec.ts
├──├──├──└── filter-text.component.ts&verbar;spec.ts
├──├──├──└── filter-text.service.ts&verbar;spec.ts
├──├──└── app.component.ts&verbar;html&verbar;css&verbar;spec.ts
├──├──└── app.module.ts
├──├──└── app-routing.module.ts
├──└── main.ts
├──└── index.html
└── &hellip;
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

#### 風格 04-11

一個獨特的應用程式功能或工作流程可能會在應用程式啟動時而不是 *延遲載入* 或 *依需求載入*。

**務必**將延遲載入功能的內容放在 *延遲載入資料夾* 中。
典型的 *延遲載入資料夾* 包含一個 *路由元件*、其子元件及其相關資源。

**為什麼**？<br />
這個資料夾讓識別及隔離功能內容變得容易。

## 元件

### 元件作為元素

#### 風格 05-03

**考慮**給予元件一個 *element* 選擇器，而不是 *attribute* 或 *class* 選擇器。

**為什麼**？ <br />
元件有包含 HTML 和選用 Angular 模板語法的模板。
它們顯示內容。
開發人員在頁面上放置元件，就像原生 HTML 元素和網路元件一樣。

**為什麼**？ <br />
透過檢視範本的 html，更容易辨識出一個符號是一個元件。

HELPFUL: 有好幾種情況會為元件提供屬性，例如要擴充內建元素時。
例如，[Material Design](https://material.angular.io/components/button/overview) 使用此技術搭配 `<button mat-button>`。
但是，您不會在自訂元素上使用此技術。

<docs-code header="app/heroes/hero-button/hero-button.component.ts" path="adev/src/content/examples/styleguide/src/05-03/app/heroes/shared/hero-button/hero-button.component.avoid.ts" visibleRegion="example"/>

<docs-code header="app/app.component.html" path="adev/src/content/examples/styleguide/src/05-03/app/app.component.avoid.html"/>

<docs-code-multifile>
    <docs-code header="app/heroes/shared/hero-button/hero-button.component.ts" path="adev/src/content/examples/styleguide/src/05-03/app/heroes/shared/hero-button/hero-button.component.ts" visibleRegion="example"/>
    <docs-code header="app/app.component.html" path="adev/src/content/examples/styleguide/src/05-03/app/app.component.html"/>
</docs-code-multifile>

### 將範本與風格萃取到自己的檔案

#### Style 05-04

**做**當超過 3 行時，將範本和風格提取到一個獨立檔案。

**請**將範本檔案命名為 `[component-name].component.html`，其中 [component-name] 是元件名稱。

**請**將風格檔案命名為 `[component-name].component.css`，其中 [component-name] 為元件名稱。

**請**指定以 `./` 為字首的 *元件相對* URL。

**為什麼**？<br />
大型內嵌範本和風格會模糊元件的目的和實作，降低可讀性和可維護性。

**為什麼**？<br />
在多數的編輯器中，當開發內嵌範本和風格時，無法使用語法提示和程式碼片段。
Angular TypeScript 語言服務（即將推出）承諾克服這個缺陷，讓支援它的編輯器可以使用 HTML 範本；它無法幫助 CSS 風格。

**為什麼**？<br />
只要檔案保持在一起，當您移動元件檔案時，*元件相對* URL 不需要任何變更。

**為什麼**？<br />
`./` 前綴是相對網址的標準語法；不要依賴 Angular 目前不需要該前綴的能力。

<docs-code header="app/heroes/heroes.component.ts" path="adev/src/content/examples/styleguide/src/05-04/app/heroes/heroes.component.avoid.ts" visibleRegion="example"/>

<docs-code-multifile>
    <docs-code header="app/heroes/heroes.component.ts" path="adev/src/content/examples/styleguide/src/05-04/app/heroes/heroes.component.ts" visibleRegion="example"/>
    <docs-code header="app/heroes/heroes.component.html" path="adev/src/content/examples/styleguide/src/05-04/app/heroes/heroes.component.html"/>
    <docs-code header="app/heroes/heroes.component.css" path="adev/src/content/examples/styleguide/src/05-04/app/heroes/heroes.component.css"/>
</docs-code-multifile>

### 裝飾 `input` 和 `output` 屬性

#### 款式 05-12

**請**使用 `@Input()` 和 `@Output()` 類別裝飾器，而不是 `@Directive` 和 `@Component` 元數據的 `inputs` 和 `outputs` 屬性：

**考慮**在 `@Input()` 或 `@Output()` 與它修飾的屬性放在同一行。

**為什麼**？<br />
識別類別中的哪些屬性是輸入或輸出更容易且更具可讀性。

**為什麼**？<br />
如果您曾經需要重新命名與 `@Input()` 或 `@Output()` 關聯的屬性或事件名稱，您可以單一位置修改。

**為什麼**？<br />
附加至指令的元數據宣告較短，因此更具可讀性。

**為什麼**？<br />
將裝飾器放在同一行*通常*會使程式碼更短，並且仍然可以輕鬆地將屬性識別為輸入或輸出。
當這樣做明顯更具可讀性時，將其放在上面一行。

<docs-code header="app/heroes/shared/hero-button/hero-button.component.ts" path="adev/src/content/examples/styleguide/src/05-12/app/heroes/shared/hero-button/hero-button.component.avoid.ts" visibleRegion="example"/>

<docs-code header="app/heroes/shared/hero-button/hero-button.component.ts" path="adev/src/content/examples/styleguide/src/05-12/app/heroes/shared/hero-button/hero-button.component.ts" visibleRegion="example"/>

### 避免別名 `inputs` 和 `outputs`

#### 風格 05-13

**避免**使用 `input` 和 `output` 別名，除非它具有重要的目的。

**為什麼**？ <br />
同一個屬性的兩個名稱（一個是私有的，一個是公有的）本質上讓人混淆。

**為什麼**？ <br />
當指令名稱也是 `input` 屬性，而且指令名稱沒有描述該屬性時，您應該使用別名。

<docs-code header="app/heroes/shared/hero-button/hero-button.component.ts" path="adev/src/content/examples/styleguide/src/05-13/app/heroes/shared/hero-button/hero-button.component.avoid.ts" visibleRegion="example"/>

<docs-code header="app/app.component.html" path="adev/src/content/examples/styleguide/src/05-13/app/app.component.avoid.html"/>

<docs-code-multifile>
    <docs-code header="app/heroes/shared/hero-button/hero-button.component.ts" path="adev/src/content/examples/styleguide/src/05-13/app/heroes/shared/hero-button/hero-button.component.ts" visibleRegion="example"/>
    <docs-code header="app/heroes/shared/hero-button/hero-highlight.directive.ts" path="adev/src/content/examples/styleguide/src/05-13/app/heroes/shared/hero-highlight.directive.ts"/>
    <docs-code header="app/app.component.html" path="adev/src/content/examples/styleguide/src/05-13/app/app.component.html"/>
</docs-code-multifile>

### 將複雜的元件邏輯委派給服務

#### 風格 05-15

**Do** 將元件中的邏輯限制為僅限檢視所需。
所有其他邏輯都應委派給服務。

**請**將可重複使用的邏輯移至服務，並讓元件保持簡單，並專注於其預期目的。

**為什麼**？<br />
當放在一個服務中並作為函式公開時，邏輯可以被多個元件重複使用。

**為什麼**？<br />
服務中的邏輯在單元測試中可以更輕鬆地被隔離，而元件中的呼叫邏輯可以輕鬆地被模擬。

**為什麼**？<br />
移除依賴性並隱藏元件的實作細節。

**為什麼**？<br />
讓元件精簡、輕巧且專注。

<docs-code header="app/heroes/hero-list/hero-list.component.ts" path="adev/src/content/examples/styleguide/src/05-15/app/heroes/hero-list/hero-list.component.avoid.ts"/>

<docs-code header="app/heroes/hero-list/hero-list.component.ts" path="adev/src/content/examples/styleguide/src/05-15/app/heroes/hero-list/hero-list.component.ts" visibleRegion="example"/>

### 不要為 `output` 屬性添加前綴

#### 風格 05-16

**做**不帶前綴 `on` 的事件名稱。

**請**將事件處理常式方法命名為前綴 `on` 後接事件名稱。

**為什麼**？<br />
這與內建的事件（例如按鈕點擊）一致。

**為什麼**？<br />
Angular 允許使用 [替代語法](guide/templates/binding) `on-*`。
如果事件本身以 `on` 為字首，這將導致 `on-onEvent` 繫結表達式。

<docs-code header="app/heroes/hero.component.ts" path="adev/src/content/examples/styleguide/src/05-16/app/heroes/hero.component.avoid.ts" visibleRegion="example"/>

<docs-code header="app/app.component.html" path="adev/src/content/examples/styleguide/src/05-16/app/app.component.avoid.html"/>

<docs-code-multifile>
    <docs-code header="app/heroes/hero.component.ts" path="adev/src/content/examples/styleguide/src/05-16/app/heroes/hero.component.ts" visibleRegion="example"/>
    <docs-code header="app/app.component.html" path="adev/src/content/examples/styleguide/src/05-16/app/app.component.html"/>
</docs-code-multifile>

### 將簡報邏輯放入元件類別中

#### 風格 05-17

**請**將簡報邏輯放入元件類別中，而不是範本中。

**為什麼**？<br />
邏輯將包含在一個地方（元件類別），而非分散在兩個地方。

**為什麼**？<br />
將元件的呈現邏輯保留在類別中而不是範本中，可提高可測試性、可維護性和可重複使用性。

<docs-code header="app/heroes/hero-list/hero-list.component.ts" path="adev/src/content/examples/styleguide/src/05-17/app/heroes/hero-list/hero-list.component.avoid.ts" visibleRegion="example"/>

<docs-code header="app/heroes/hero-list/hero-list.component.ts" path="adev/src/content/examples/styleguide/src/05-17/app/heroes/hero-list/hero-list.component.ts" visibleRegion="example"/>

### 初始化輸入

#### 風格 05-18

TypeScript 的 `--strictPropertyInitialization` 編譯器選項確保類別在建構時初始化其屬性。
啟用此選項時，如果類別沒有為任何未明確標記為可選的屬性設定值，TypeScript 編譯器就會回報錯誤。

根據設計，Angular 將所有 `@Input` 屬性視為選用。
若可行的話，您應該透過提供預設值來滿足 `--strictPropertyInitialization`。

<docs-code header="app/heroes/hero/hero.component.ts" path="adev/src/content/examples/styleguide/src/05-18/app/heroes/hero/hero.component.ts" visibleRegion="example"/>

如果屬性難以建構預設值，請使用 `?` 明確標記屬性為選項。

<docs-code header="app/heroes/hero/hero.component.ts" path="adev/src/content/examples/styleguide/src/05-18/app/heroes/hero/hero.component.optional.ts" visibleRegion="example"/>

您可能希望有一個必要的 `@Input` 欄位，表示所有您的元件使用者都必須傳遞該屬性。
在這種情況下，請使用預設值。
僅使用 `!` 來抑制 TypeScript 錯誤是不夠的，而且應該避免，因為它會阻止類型檢查器確保輸入值已提供。

<docs-code header="app/heroes/hero/hero.component.ts" path="adev/src/content/examples/styleguide/src/05-18/app/heroes/hero/hero.component.avoid.ts" visibleRegion="example"/>

## 指令

### 使用指令增強元素

#### 風格 06-01

**執行**當您沒有範本時，請使用屬性指令來呈現邏輯。

**為什麼**？<br />
屬性指令沒有關聯的範本。

**為什麼**？<br />
一個元素可能套用多個屬性指令。

<docs-code header="app/shared/highlight.directive.ts" path="adev/src/content/examples/styleguide/src/06-01/app/shared/highlight.directive.ts" visibleRegion="example"/>

<docs-code header="app/app.component.html" path="adev/src/content/examples/styleguide/src/06-01/app/app.component.html"/>

### `HostListener`/`HostBinding` 裝飾器相較於 `host` 元數據

#### 風格 06-03

**考慮**偏好 `@HostListener` 和 `@HostBinding` 勝於 `@Directive` 和 `@Component` 裝飾器的 `host` 屬性。

**請**在您的選擇中保持一致。

**為什麼**？<br />
與 `@HostBinding` 關聯的屬性或與 `@HostListener` 關聯的方法只能在單一位置修改，即指令的類別中。
如果您使用 `host` 元數據屬性，則必須修改指令類別中的屬性/方法聲明和與指令關聯的裝飾器中的元數據。

<docs-code header="app/shared/validator.directive.ts" path="adev/src/content/examples/styleguide/src/06-03/app/shared/validator.directive.ts"/>

與較不偏好的 `host` 元數據替代方案比較。

**為什麼**？ <br />
`host` 元數據只有一個術語要記住，且不需要額外的 ES 匯入。

<docs-code header="app/shared/validator2.directive.ts" path="adev/src/content/examples/styleguide/src/06-03/app/shared/validator2.directive.ts"/>

## 服務

### 服務是單例

#### 風格 07-01

**請**在同一個注入器內使用服務作為單例。
使用它們來共享資料和功能。

**為什麼**？<br />
服務非常適合在功能區域或應用程式中共享方法。

**為什麼**？<br />
服務是共享有狀態記憶體數據的理想選擇。

<docs-code header="app/heroes/shared/hero.service.ts" path="adev/src/content/examples/styleguide/src/07-01/app/heroes/shared/hero.service.ts" visibleRegion="example"/>

### 提供服務

#### 風格 07-03

**做**在服務的 `@Injectable` 裝飾器中提供一個具有應用程式根注入器的服務。

**為什麼**？ <br />
Angular 注入器是分層的。

**為什麼**？<br />
當您將服務提供給根注入器時，該服務的實例會被共用並在需要該服務的每個類別中提供。
當服務正在共用方法或狀態時，這是理想的。

**為什麼**？<br />
當你在服務的 `@Injectable` 裝飾器中註冊服務時，由 [Angular CLI](cli) 的生產建構所使用的最佳化工具可以執行樹狀搖晃，並移除你的應用程式未使用的服務。

**為什麼**？<br />
當兩個不同的元件需要服務的不同實例時，這不是理想的。
在這種情況下，最好在需要新實例和單獨實例的元件級別提供該服務。

<docs-code header="src/app/treeshaking/service.ts" path="adev/src/content/examples/dependency-injection/src/app/tree-shaking/service.ts"/>

### 使用 &commat;Injectable() 類別裝飾器

#### Style 07-04

**請**在使用類型作為服務依賴項的權杖時，使用 `@Injectable()` 類別裝飾器，而不是 `@Inject` 參數裝飾器。

**為什麼**？<br />
Angular 相依性注入 \(DI\) 機制會根據該服務建構函式參數的宣告類型來解析服務自己的依賴關係。

**為什麼**？<br />
當服務僅接受與類型令牌相關聯的依賴項時，與在每個個別建構函式參數上使用 `@Inject()` 相比，`@Injectable()` 語法簡潔得多。

<docs-code header="app/heroes/shared/hero-arena.service.ts" path="adev/src/content/examples/styleguide/src/07-04/app/heroes/shared/hero-arena.service.avoid.ts" visibleRegion="example"/>

<docs-code header="app/heroes/shared/hero-arena.service.ts" path="adev/src/content/examples/styleguide/src/07-04/app/heroes/shared/hero-arena.service.ts" visibleRegion="example"/>

## 數據服務

### 透過服務與伺服器通訊

#### 風格 08-01

**做**將資料操作和與資料互動的邏輯，重構為一項服務。

**請**讓數據服務負責 XHR 呼叫、本地儲存、記憶體中的暫存，或任何其他數據操作。

**為什麼**？<br />
元件的責任在於呈現和收集檢視的資訊。
它不應該關心如何取得資料，它只知道該向誰索取資料。
將資料服務分開，可以將如何取得資料的邏輯移至資料服務，並讓元件更簡單、更專注於檢視。

**為什麼**？<br />
當測試使用數據服務的元件時，這使得測試數據呼叫（模擬或真實）更容易。

**為什麼**？<br />
資料管理的詳細資訊，例如標頭、HTTP 方法、快取、錯誤處理和重試邏輯，與元件和其他資料使用者無關。

資料服務封裝了這些細節。
在服務內部演進這些細節比較容易，而且不會影響到使用者。
使用模擬服務實作來測試使用者也比較容易。

## 生命周期掛鉤

使用生命週期掛勾來觸發 Angular 暴露的重要事件。

### 實作生命週期掛鉤介面

#### 風格 09-01

**做**實作生命週期掛鉤介面。

**為什麼**？ <br />
生命週期介面規定輸入方法簽名。
使用這些簽名標記拼寫和語法錯誤。

<docs-code header="app/heroes/shared/hero-button/hero-button.component.ts" path="adev/src/content/examples/styleguide/src/09-01/app/heroes/shared/hero-button/hero-button.component.avoid.ts" visibleRegion="example"/>

<docs-code header="app/heroes/shared/hero-button/hero-button.component.ts" path="adev/src/content/examples/styleguide/src/09-01/app/heroes/shared/hero-button/hero-button.component.ts" visibleRegion="example"/>

## 附錄

有用的 Angular 工具和技巧。

### 檔案範本和片段

#### 風格 A-02

**請**使用檔案範本或範例來幫助遵循一致的風格和模式。
以下是一些網路開發編輯器和 IDE 的範本和/或範例。

**考慮**使用 [Visual Studio Code](https://code.visualstudio.com) 的 [片段](https://marketplace.visualstudio.com/items?itemName=johnpapa.Angular2)，這些片段遵循這些風格和指南。

<a href="https://marketplace.visualstudio.com/items?itemName=johnpapa.Angular2">

<img alt="使用擴充功能" src="assets/content/images/guide/styleguide/use-extension.gif">

</a>

**考慮**使用 [snippets](https://github.com/orizens/sublime-angular2-snippets) for [Sublime Text](https://www.sublimetext.com) 遵循這些風格和準則。

**考慮**使用 [snippets](https://github.com/mhartington/vim-angular2-snippets) for [Vim](https://www.vim.org) 這些風格和指南。
