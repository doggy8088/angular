# Angular 編碼風格指南

尋找關於 Angular 語法、慣例和應用程式結構的意見指南？
直接進入。
本風格指南呈現首選慣例，並更重要的是，解釋原因。

## 風格詞彙

每個準則都描述一個好的或壞的實踐，並且都具有具有一致性的呈現方式。

每項指南的文字說明建議的強烈程度。

**Do** 是應該永遠遵守的。
*Always* 可能是一個有點太強烈的詞。
真正應該永遠遵守的準則極為罕見。
另一方面，你需要一個非常特殊的情況才能打破 *Do* 準則。

**考慮**指南通常應遵循。
如果您完全理解指南背後的含義並有充分的理由偏離，那就這樣做。
目標是保持一致。

**避免** 表示幾乎永遠不該做的事。
*避免* 的範例程式碼具有明顯的紅色標題。

**為什麼**？<br />
給予遵循先前建議的原因。

## 檔案結構慣例

一些程式碼範例顯示一個包含一個或多個類似名稱的附屬檔案。
例如，`hero.component.ts` 和 `hero.component.html`。

該指南使用捷徑 `hero.component.ts|html|css|spec` 來表示那些不同的檔案。
使用這個捷徑讓此指南的檔案結構更容易閱讀且更簡潔。

## 單一職責

將 [*單一職責原則 (SRP)*](https://wikipedia.org/wiki/Single_responsibility_principle) 套用到所有元件、服務和其他符號。
這有助於讓應用程式更乾淨、更易於閱讀和維護，並更具可測試性。

### 一個規則

#### 風格 01-01

**請**針對每一個檔案定義一件事，例如服務或元件。

**考慮**將檔案限制在 400 行程式碼。

**為什麼**? <br />
每個檔案一個元件，使閱讀、維護和避免與源碼控管中的團隊發生衝突變得更容易。

**為什麼**？<br />
每檔案一個元件可避免將元件組合在一個檔案中時經常出現的隱藏錯誤，在這種情況下，元件可能會共享變數、建立不需要的封閉或與依賴項建立不需要的關聯。

**為什麼**？<br />
單一元件可以是其檔案的預設匯出，這有助於使用路由器進行惰性載入。

關鍵在於使程式碼更容易重複使用、更易讀，並且減少錯誤。

以下 *負面* 範例定義了 `AppComponent`、引導應用程式、定義 `Hero` 模型物件，並從伺服器載入英雄，全部都在同一個檔案中。
*不要這樣做*。

<docs-code path="adev/src/content/examples/styleguide/src/01-01/app/heroes/hero.component.avoid.ts" language="typescript" header="app/heroes/hero.component.ts"/>

將組件及其支援類別重新分佈到它們自己的專用檔案中是一種更好的做法。

<docs-code-multifile>
    <docs-code header="main.ts" path="adev/src/content/examples/styleguide/src/01-01/main.ts"/>
    <docs-code header="app/app.module.ts" path="adev/src/content/examples/styleguide/src/01-01/app/app.module.ts"/>
    <docs-code header="app/app.component.ts" path="adev/src/content/examples/styleguide/src/01-01/app/app.component.ts"/>
    <docs-code header="app/heroes/heroes.component.ts" path="adev/src/content/examples/styleguide/src/01-01/app/heroes/heroes.component.ts"/>
    <docs-code header="app/heroes/shared/hero.service.ts" path="adev/src/content/examples/styleguide/src/01-01/app/heroes/shared/hero.service.ts"/>
    <docs-code header="app/heroes/shared/hero.model.ts" path="adev/src/content/examples/styleguide/src/01-01/app/heroes/shared/hero.model.ts"/>
    <docs-code header="app/heroes/shared/mock-heroes.ts" path="adev/src/content/examples/styleguide/src/01-01/app/heroes/shared/mock-heroes.ts"/>
</docs-code-multifile>

隨著應用程式成長，這個規則變得更為重要。

## 命名

命名慣例對於可維護性和可讀性非常重要。
本指南建議檔案名稱和符號名稱的命名慣例。

### 一般命名準則

#### 風格 02-01

**做**對所有符號使用一致的名稱。

**請**遵循描述符號特徵然後是類型的模式。
建議的模式為 `feature.type.ts`。

**為什麼**？<br />
命名慣例有助於提供一致的方式，以便快速找到內容。
專案內的一致性至關重要。
與團隊的一致性很重要。
整個公司的統一性提供了巨大的效率。

**為什麼**？<br />
命名慣例應該有助於更快找到所需的程式碼並使之更易於理解。

**為什麼**？<br />
資料夾和檔案的名稱應該清楚地傳達它們的意圖。
例如，`app/heroes/hero-list.component.ts` 可能包含一個管理英雄清單的元件。

### 用點和破折號分隔不同的檔案名稱

#### 風格 02-02

**請**使用破折號來區分描述性名稱中的字詞。

**請**使用句點來區分描述性名稱和類型。

**做**使用一致的類型名稱，所有元件都依照描述元件功能和類型的模式。
推薦的模式是 `feature.type.ts`。

**應**使用包含 `.service`、`.component`、`.pipe`、`.module` 和 `.directive` 的慣例類型名稱。
若必須發明其他類型名稱，請小心不要創造太多。

**為什麼**？<br />
類型名稱提供一致的方法來快速識別檔案中的內容。

**為什麼**？ <br />
類型名稱讓您可以使用編輯器或 IDE 的模糊搜尋技巧，輕鬆找到特定類型的檔案。

**為什麼**？ <br />
未縮寫的類型名稱，例如「.service」，具有描述性且明確。
縮寫，例如「.srv」、「.svc」和「.serv」可能會令人困惑。

**為什麼**？<br />
類型名稱提供任何自動化任務的模式比對。

### 符號和檔案名稱

#### 樣式 02-03

**請**對所有資產使用一致性名稱，這些名稱應以資產所代表的內容命名。

**做**使用大寫駝峰式大小寫為類別名稱。

**請**將符號的名稱與檔案名稱配對。

**請**為該類型的項目附加慣例字尾（例如 `Component`、`Directive`、`Module`、`Pipe` 或 `Service`）作為符號名稱。

**請**給予檔案名稱慣用的字尾（例如 `.component.ts`、`.directive.ts`、`.module.ts`、`.pipe.ts` 或 `.service.ts`）給該類型的檔案。

**為什麼**？<br />
一致的慣例使快速識別和參考不同類型的資產變得容易。

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

#### 樣式 02-04

**請**對所有以其功能命名的服務使用一致的命名。

**請**在服務類別名稱後面加上 `Service`。
例如，取得資料或英雄的東西應稱為 `DataService` 或 `HeroService`。

以下幾個術語明確是服務。
它們通常以「-er」結尾來表示代理。
您可能更喜歡將記錄訊息的服務命名為 `Logger` 而不是 `LoggerService`。
決定此例外是否符合您的專案。
一如往常，致力於一致性。

**為什麼**？<br />
提供一種一致的方式來快速識別和參考服務。

**為什麼**？<br />
清楚的服務名稱，例如 `Logger` 不需要後綴。

**為什麼**？ <br />
服務名稱例如 `Credit` 是名詞，需要一個後綴，並且在不確定它是否為服務或其他東西時，應該使用後綴來命名它。

| 符號名稱                                                                                                                                      | 檔案名稱 |
|:---                                                                                                                                              |:---       |
| <docs-code hideCopy language="typescript"> &commat;Injectable() &NewLine;export class HeroDataService { } </docs-code> | hero-data.service.ts |
| <docs-code hideCopy language="typescript"> &commat;Injectable() &NewLine;export class CreditService { } </docs-code>   | credit.service.ts    |
| <docs-code hideCopy language="typescript"> &commat;Injectable() &NewLine;export class Logger { } </docs-code>          | logger.service.ts    |

### Bootstrapping

#### 風格 02-05

**做**將應用程式的 bootstrapping 和平台邏輯放在一個名為 `main.ts` 的檔案中。

**Do** 在引導邏輯中包含錯誤處理。

**避免**在 `main.ts` 中放置應用程序邏輯。
相反，考慮將其放入組件或服務中。

**為什麼**？ <br/>
遵循應用程序啟動邏輯的一致慣例。

**為什麼**？ <br />
遵循其他技術平台的慣例。

<docs-code header="main.ts" path="adev/src/content/examples/styleguide/src/02-05/main.ts"/>

### 元件選擇器

#### 風格 05-02

**請**使用 *dashed-case* 或 *kebab-case* 來命名元件的元素選擇器。

**為什麼**？<br />
讓元素名稱與 [Custom Elements](https://www.w3.org/TR/custom-elements) 規範保持一致。

<docs-code header="app/heroes/shared/hero-button/hero-button.component.ts" path="adev/src/content/examples/styleguide/src/05-02/app/heroes/shared/hero-button/hero-button.component.avoid.ts" visibleRegion="example"/>

<docs-code-multifile>
    <docs-code header="app/heroes/shared/hero-button/hero-button.component.ts" path="adev/src/content/examples/styleguide/src/05-02/app/heroes/shared/hero-button/hero-button.component.ts" visibleRegion="example"/>
    <docs-code header="app/app.component.html" path="adev/src/content/examples/styleguide/src/05-02/app/app.component.html"/>
</docs-code-multifile>

### 元件自訂前綴

#### 風格 02-07

**請**使用連字號的小寫元素選擇器值；例如，`admin-users`。

**請**使用可識別功能區域或應用程式本身的前綴。

**為什麼**？<br />
防止元素名稱與其他應用程式中的元件及原生 HTML 元素發生衝突。

**為什麼**？<br />
讓在其他應用程式中宣傳和分享元件變得更容易。

**為什麼**？<br />
元件在 DOM 中很容易識別。

<docs-code header="app/heroes/hero.component.ts" path="adev/src/content/examples/styleguide/src/02-07/app/heroes/hero.component.avoid.ts" visibleRegion="example"/>

<docs-code header="app/users/users.component.ts" path="adev/src/content/examples/styleguide/src/02-07/app/users/users.component.avoid.ts" visibleRegion="example"/>

<docs-code header="app/heroes/hero.component.ts" path="adev/src/content/examples/styleguide/src/02-07/app/heroes/hero.component.ts" visibleRegion="example"/>

<docs-code header="app/users/users.component.ts" path="adev/src/content/examples/styleguide/src/02-07/app/users/users.component.ts" visibleRegion="example"/>

### 指令選擇器

#### 風格 02-06

**做** 為指令選擇器命名時，請使用小寫的駝峰式命名法。

**為什麼**？<br />
使繫結至檢視的指令中定義的屬性名稱與屬性名稱保持一致。

**為什麼**？ <br />
Angular HTML 解析器區分大小寫，並識別小寫的駝峰式大小寫。

### 指令自訂前綴

#### 風格 02-08

**請**以小寫的駝峰式來拼寫非元素選擇器，除非該選擇器是要符合原生 HTML 屬性。

**不要**使用 `ng` 為指令名稱加上前綴，因為此前綴是 Angular 專用，使用它可能會導致難以診斷的錯誤。

**為什麼**？ <br />
防止名稱衝突。

**為什麼**？<br />
指令很容易辨識。

<docs-code header="app/shared/validate.directive.ts" path="adev/src/content/examples/styleguide/src/02-08/app/shared/validate.directive.avoid.ts" visibleRegion="example"/>

<docs-code header="app/shared/validate.directive.ts" path="adev/src/content/examples/styleguide/src/02-08/app/shared/validate.directive.ts" visibleRegion="example"/>

### 管道名稱

#### 風格 02-09

**請**為所有管道使用一致的命名，以其功能命名。
管道類別名稱應使用 `UpperCamelCase` （類別名稱的一般慣例），相對應的 `name` 字串應使用 *lowerCamelCase*。
`name` 字串不能使用連字號（「dash-case」或「kebab-case」）。

**為什麼**？<br />提供一致的方法來快速識別和參照管道。

| 符號名稱                                                                                                                                                                       | 檔案名稱 |
|:---                                                                                                                                                                         |:---       |
| <docs-code hideCopy language="typescript"> &commat;Pipe({ standalone: true, name: 'ellipsis' }) &NewLine;export class EllipsisPipe implements PipeTransform { } </docs-code> | ellipsis.pipe.ts  |
| <docs-code hideCopy language="typescript"> &commat;Pipe({ standalone: true, name: 'initCaps' }) &NewLine;export class InitCapsPipe implements PipeTransform { } </docs-code> | init-caps.pipe.ts |

### 單元測試檔案名稱

#### 樣式 02-10

**做** 將測試規範檔案命名與其測試的組件相同。

**做**以 `.spec` 為字尾來命名測試規範檔案。

**為什麼**？<br />
提供一致的方式來快速識別測試。

**為何**？<br />
提供 [karma](https://karma-runner.github.io) 或其他測試執行器的樣式比對。

| 測試類型  | 檔案名稱 |
|:---        |:---        |
| 組件       | heroes.component.spec.ts <br /> hero-list.component.spec.ts <br /> hero-detail.component.spec.ts |
| 服務       | logger.service.spec.ts <br /> hero.service.spec.ts <br /> filter-text.service.spec.ts            |
| 管道       | ellipsis.pipe.spec.ts <br /> init-caps.pipe.spec.ts                                              |

## 應用程式結構和 NgModules

具備近期的執行觀點和長遠的願景。
先從小處著手，但要記住應用程式的發展方向。

所有應用程式的程式碼都放在名為 `src` 的資料夾中。
所有功能區域都在其各自的資料夾中。

所有內容都是一個檔案一個資源。
每個元件、服務和管道都在它自己的檔案中。
所有第三方供應商腳本都儲存在另一個資料夾中，而不是在 `src` 資料夾中。
使用本指南中的檔案命名慣例。

### 整體結構指引

#### Style 04-06

**做**小一點，但記住應用程序未來的發展方向。

**做**有近期實施的觀點和長期的願景。

**請**將所有應用程式的程式碼放在一個名為 `src` 的資料夾中。

當元件有多個附屬檔案（`.ts`、`.html`、`.css` 和 `.spec`）時，**考慮**為元件建立一個資料夾。

**為什麼**？ <br />
在早期階段有助於保持應用程序結構精簡且易於維護，同時隨著應用程序的增長，也很容易演進。

**為什麼**？<br />
元件通常有四個檔案（例如，`*.html`、`*.css`、`*.ts` 和 `*.spec.ts`）並能快速弄亂一個資料夾。

以下是合規的資料夾和檔案結構：

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

HELPFUL：儘管專用資料夾中的元件廣受歡迎，但小型應用程式的另一個選項是保持元件扁平（不在專用資料夾中）。
這會將多達四個檔案新增到現有資料夾中，但也會減少資料夾層級。
不論您選擇哪一種，都要保持一致。

### *依照功能* 資料夾結構

#### 風格 04-07

**請**建立以其代表的功能區域命名的資料夾。

**為什麼**？<br />
開發人員可以一眼找到程式碼並識別每個檔案代表的意思。
結構盡可能扁平，而且沒有重複或多餘的名稱。

**為什麼**？<br />
有助於透過組織內容減少應用程序的雜亂。

**為什麼**？<br />
當有很多檔案時，例如 10 個以上，使用一致的資料夾結構可以更容易找到檔案，而扁平結構則更難找到檔案。

有關更多資訊，請參閱 [此資料夾和檔案結構範例](#file-tree)。

### App *根模組*

重要：以下樣式指南建議適用於基於 `NgModule` 的應用程式。新應用程式應改用獨立元件、指令和管道。

#### 風格 04-08

**請**在應用程式根目錄中建立一個 `NgModule`，例如，在 `/src/app` 中，如果建立一個基於 `NgModule` 的應用程式。

**為什麼**？<br />
每個基於 `NgModule` 的應用程式至少需要一個根 NgModule。

**考慮**將根模組命名為 `app.module.ts`。

**為什麼**？<br />
更容易找到和識別根模組。

<docs-code path="adev/src/content/examples/styleguide/src/04-08/app/app.module.ts" language="typescript" visibleRegion="example" header="app/app.module.ts"/>

### 功能模塊

#### 樣式 04-09

**請**為應用程式中的所有不同功能建立一個 NgModule；例如，一個「英雄」功能。

**請**將功能模組放在與功能區域同名的資料夾中；例如，在 `app/heroes` 中。

**請**讓功能模組檔案反映功能區域和資料夾的名稱；例如，`app/heroes/heroes.module.ts`。

**請**將功能模組符號命名反映功能區域、資料夾與檔案的名稱；例如，`app/heroes/heroes.module.ts` 定義 `HeroesModule`。

**為什麼**？<br />
特徵模組可以顯示或隱藏其實作以供其他模組使用。

**為什麼**？<br />
功能模組識別出組成功能區域的不同相關元件集合。

**為什麼**？<br />
功能模組可以輕易地被路由到熱切和延遲。

**為什麼**？<br />
功能模組定義特定功能和其他應用程式功能之間的明確界限。

**為什麼**？<br />
功能模組有助於釐清並讓不同團隊更容易分配開發責任。

**為什麼**？ <br />
功能模組可以輕鬆地被隔離以便進行測試。

### 共享功能模組

#### 風格 04-10

**請**在 `shared` 資料夾中建立一個名為 `SharedModule` 的功能模組；例如，`app/shared/shared.module.ts` 定義 `SharedModule`。

**請**在共享模組中宣告元件、指令和管道，當這些項目將由其他功能模組中宣告的元件重複使用和參照時。

**考慮**在共享模組的內容在整個應用程式中參照時使用名稱 SharedModule。

**考慮** *不* 在共享模組中提供服務。
服務通常是單例，僅為整個應用程式或特定功能模組提供一次。
不過，仍有例外。
例如，在以下範例程式碼中，請注意 `SharedModule` 提供 `FilterTextService`。
這是可以接受的，因為服務是無狀態的；也就是說，服務的使用者不會受到新執行個體的影響。

**請**匯入 `SharedModule` 中資產所需的模組，例如 `CommonModule` 和 `FormsModule`。

**為什麼**？<br />
`SharedModule` 將包含可能需要另一個常見模組的功能的元件、指令和管道；例如，`CommonModule` 中的 `ngFor`。

**請**在 `SharedModule` 中宣告所有元件、指令和管道。

**做**從 `SharedModule` 匯出其他功能模組需要使用的所有符號。

**為什麼**？<br />
`SharedModule` 存在的原因是為了讓常用的元件、指令和管道可以在許多其他模組的元件範本中使用。

**避免**在 `SharedModule` 中指定應用程式範圍的單例提供者。
有意的單例是可以的。
小心。

**為什麼**？<br />
一個載入延遲功能模組，導入共享模組，會建立服務的副本，並且可能產生不理想的結果。

**為什麼**？<br />
您不想讓每個模組都有自己的單例服務實例。
但是，如果 `SharedModule` 提供服務，那麼確實可能會發生這種情況。

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

### 延遲載入的資料夾

#### 風格 04-11

一個明確的應用程式功能或工作流程可以是「*延遲載入*」或「*依需求載入*」，而不是在應用程式啟動時載入。

**請**將延遲載入功能的內容放入 *延遲載入資料夾*。
典型的 *延遲載入資料夾* 包含一個 *路由元件*、其子元件及其相關資產。

**為什麼**？<br />
資料夾讓識別和分離功能內容變得容易。

## 組件

### 組件作為元素

#### Style 05-03

**考慮**給予元件一個 *元素* 選擇器，而不是 *屬性* 或 *類別* 選擇器。

**為什麼**？<br />
元件含有包含 HTML 和選擇性 Angular 範本語法的範本。
它們顯示內容。
開發人員會將元件放置在頁面上，就像他們會放置原生 HTML 元素和網路元件一樣。

**為什麼**？ <br />
透過查看範本的 html，更容易辨識一個符號是組件。

有用的提示：在某些情況下，您可以給元件一個屬性，例如當您想擴充內建元素時。
例如，[Material Design](https://material.angular.io/components/button/overview) 使用此技術與 `<button mat-button>`。
但是，您不會在自訂元素上使用此技術。

<docs-code header="app/heroes/hero-button/hero-button.component.ts" path="adev/src/content/examples/styleguide/src/05-03/app/heroes/shared/hero-button/hero-button.component.avoid.ts" visibleRegion="example"/>

<docs-code header="app/app.component.html" path="adev/src/content/examples/styleguide/src/05-03/app/app.component.avoid.html"/>

<docs-code-multifile>
    <docs-code header="app/heroes/shared/hero-button/hero-button.component.ts" path="adev/src/content/examples/styleguide/src/05-03/app/heroes/shared/hero-button/hero-button.component.ts" visibleRegion="example"/>
    <docs-code header="app/app.component.html" path="adev/src/content/examples/styleguide/src/05-03/app/app.component.html"/>
</docs-code-multifile>

### 將範本和樣式萃取到它們自己的檔案

#### 風格 05-04

**做**如果超過 3 行，將範本和樣式萃取到一個獨立檔案。

**請**將範本檔案命名為 `[component-name].component.html`，其中 [component-name] 是元件名稱。

**請**將樣式檔案命名為 `[component-name].component.css`，其中 [component-name] 是 component 名稱。

**請**指定以 `./` 為前綴的 *組件相對* URL。

**為什麼**？<br />
大型內聯範本和樣式會掩蓋組件的目的和實作，降低可讀性和可維護性。

**為什麼**？<br />
在多數編輯器中，在開發內嵌範本和樣式時，無法使用語法提示和程式碼片段。
Angular TypeScript Language Service（即將推出）承諾克服此缺陷，供支援它的編輯器使用 HTML 範本；但它無法協助處理 CSS 樣式。

**為什麼**？<br />
只要檔案保持在一起，當您移動元件檔案時，*元件相對*的 URL 不需要變更。

**為什麼**？<br />
`./` 前綴是相對 URL 的標準語法；請勿依賴 Angular 目前不需要該前綴的能力。

<docs-code header="app/heroes/heroes.component.ts" path="adev/src/content/examples/styleguide/src/05-04/app/heroes/heroes.component.avoid.ts" visibleRegion="example"/>

<docs-code-multifile>
    <docs-code header="app/heroes/heroes.component.ts" path="adev/src/content/examples/styleguide/src/05-04/app/heroes/heroes.component.ts" visibleRegion="example"/>
    <docs-code header="app/heroes/heroes.component.html" path="adev/src/content/examples/styleguide/src/05-04/app/heroes/heroes.component.html"/>
    <docs-code header="app/heroes/heroes.component.css" path="adev/src/content/examples/styleguide/src/05-04/app/heroes/heroes.component.css"/>
</docs-code-multifile>

### Decorate `input` 和 `output` 屬性

#### 風格 05-12

**做**使用 `@Input()` 和 `@Output()` 類別裝飾器，而不是 `@Directive` 和 `@Component` 元資料的 `inputs` 和 `outputs` 屬性：

**考慮**將 `@Input()` 或 `@Output()` 放在與其修飾的屬性同一行。

**為什麼**？<br />
識別類別中的哪些屬性是輸入或輸出更簡單且更具可讀性。

**為什麼**？<br />
如果您需要變更與 `@Input()` 或 `@Output()` 關聯的屬性或事件名稱，您可以在單一地方修改它。

**為什麼**？<br />
附加到指令的元數據聲明更簡短，因此更易於閱讀。

**為什麼**？<br />
將裝飾器放在同一行通常會使程式碼更短，並且仍然可以輕鬆地將屬性識別為輸入或輸出。
當這樣做時，顯然更具可讀性，請將其放在上一行。

<docs-code header="app/heroes/shared/hero-button/hero-button.component.ts" path="adev/src/content/examples/styleguide/src/05-12/app/heroes/shared/hero-button/hero-button.component.avoid.ts" visibleRegion="example"/>

<docs-code header="app/heroes/shared/hero-button/hero-button.component.ts" path="adev/src/content/examples/styleguide/src/05-12/app/heroes/shared/hero-button/hero-button.component.ts" visibleRegion="example"/>

### 避免別名 `inputs` 和 `outputs`

#### Style 05-13

**避免**使用別名 `input` 和 `output`，除非它用於重要目的。

**為什麼**？<br />
同一個屬性的兩個名稱（一個私有，一個公有）本質上令人混淆。

**為什麼**？<br />
當指令名稱同時也是 `input` 屬性時，且指令名稱沒有描述該屬性，則應使用別名。

<docs-code header="app/heroes/shared/hero-button/hero-button.component.ts" path="adev/src/content/examples/styleguide/src/05-13/app/heroes/shared/hero-button/hero-button.component.avoid.ts" visibleRegion="example"/>

<docs-code header="app/app.component.html" path="adev/src/content/examples/styleguide/src/05-13/app/app.component.avoid.html"/>

<docs-code-multifile>
    <docs-code header="app/heroes/shared/hero-button/hero-button.component.ts" path="adev/src/content/examples/styleguide/src/05-13/app/heroes/shared/hero-button/hero-button.component.ts" visibleRegion="example"/>
    <docs-code header="app/heroes/shared/hero-button/hero-highlight.directive.ts" path="adev/src/content/examples/styleguide/src/05-13/app/heroes/shared/hero-highlight.directive.ts"/>
    <docs-code header="app/app.component.html" path="adev/src/content/examples/styleguide/src/05-13/app/app.component.html"/>
</docs-code-multifile>

### 將複雜的組件邏輯委派給服務

#### 風格 05-15

**盡可能**只將元件中的邏輯限制在檢視所需的內容。
所有其他邏輯都應該委派給服務。

**務必** 將可重複使用的邏輯移至服務，並讓組件保持簡單，並專注於其預期目的。

**為什麼**？<br />
當邏輯放入服務中並公開為一個函數時，可以被多個元件重複使用。

**為什麼**？ <br />
服務中的邏輯更容易在單元測試中被隔離，而元件中的呼叫邏輯很容易被模擬。

**為什麼**？<br />
移除依賴並隱藏元件的實作細節。

**為什麼**？<br />
保持元件纖細、精簡且專注。

<docs-code header="app/heroes/hero-list/hero-list.component.ts" path="adev/src/content/examples/styleguide/src/05-15/app/heroes/hero-list/hero-list.component.avoid.ts"/>

<docs-code header="app/heroes/hero-list/hero-list.component.ts" path="adev/src/content/examples/styleguide/src/05-15/app/heroes/hero-list/hero-list.component.ts" visibleRegion="example"/>

### 不要為 `output` 屬性加上前綴

#### 樣式 05-16

**不要** 使用前綴 `on` 命名事件。

**做**以 `on` 為前綴加上事件名稱來命名事件處理器方法。

**為什麼**？<br />
這與內建事件一致，例如按鈕點擊。

**為什麼**？<br />
Angular 允許使用 [替代語法](guide/templates/binding) `on-*`。
如果事件本身加上前綴 `on`，這將導致 `on-onEvent` 繫結表達式。

<docs-code header="app/heroes/hero.component.ts" path="adev/src/content/examples/styleguide/src/05-16/app/heroes/hero.component.avoid.ts" visibleRegion="example"/>

<docs-code header="app/app.component.html" path="adev/src/content/examples/styleguide/src/05-16/app/app.component.avoid.html"/>

<docs-code-multifile>
    <docs-code header="app/heroes/hero.component.ts" path="adev/src/content/examples/styleguide/src/05-16/app/heroes/hero.component.ts" visibleRegion="example"/>
    <docs-code header="app/app.component.html" path="adev/src/content/examples/styleguide/src/05-16/app/app.component.html"/>
</docs-code-multifile>

### 將簡報邏輯放入元件類別

#### 風格 05-17

**請**將簡報邏輯放在組件類別中，而不是範本中。

**為什麼**？<br />
邏輯將包含在一個地方（元件類別）中，而不是分散在兩個地方。

**為什麼**？<br />
將元件的呈現邏輯保存在類別中，而非範本，可改善可測試性、可維護性和可重複使用性。

<docs-code header="app/heroes/hero-list/hero-list.component.ts" path="adev/src/content/examples/styleguide/src/05-17/app/heroes/hero-list/hero-list.component.avoid.ts" visibleRegion="example"/>

<docs-code header="app/heroes/hero-list/hero-list.component.ts" path="adev/src/content/examples/styleguide/src/05-17/app/heroes/hero-list/hero-list.component.ts" visibleRegion="example"/>
### Initialize inputs

#### Style 05-18

TypeScript's `--strictPropertyInitialization` compiler option ensures that a class initializes its properties during construction.
When enabled, this option causes the TypeScript compiler to report an error if the class does not set a value to any property that is not explicitly marked as optional.

By design, Angular treats all `@Input` properties as optional.
When possible, you should satisfy `--strictPropertyInitialization` by providing a default value.

<docs-code header="app/heroes/hero/hero.component.ts" path="adev/src/content/examples/styleguide/src/05-18/app/heroes/hero/hero.component.ts" visibleRegion="example"/>

If the property is hard to construct a default value for, use `?` to explicitly mark the property as optional.

<docs-code header="app/heroes/hero/hero.component.ts" path="adev/src/content/examples/styleguide/src/05-18/app/heroes/hero/hero.component.optional.ts" visibleRegion="example"/>

You may want to have a required `@Input` field, meaning all your component users are required to pass that attribute.
In such cases, use a default value.
Just suppressing the TypeScript error with `!` is insufficient and should be avoided because it will prevent the type checker ensure the input value is provided.

<docs-code header="app/heroes/hero/hero.component.ts" path="adev/src/content/examples/styleguide/src/05-18/app/heroes/hero/hero.component.avoid.ts" visibleRegion="example"/>

## Directives

### Use directives to enhance an element

#### Style 06-01

**Do** use attribute directives when you have presentation logic without a template.

**Why**? <br />
Attribute directives don't have an associated template.

**Why**? <br />
An element may have more than one attribute directive applied.

<docs-code header="app/shared/highlight.directive.ts" path="adev/src/content/examples/styleguide/src/06-01/app/shared/highlight.directive.ts" visibleRegion="example"/>

<docs-code header="app/app.component.html" path="adev/src/content/examples/styleguide/src/06-01/app/app.component.html"/>

### `HostListener`/`HostBinding` decorators versus `host` metadata

#### Style 06-03

**Consider** preferring the `@HostListener` and `@HostBinding` to the `host` property of the `@Directive` and `@Component` decorators.

**Do** be consistent in your choice.

**Why**? <br />
The property associated with `@HostBinding` or the method associated with `@HostListener` can be modified only in a single place &mdash;in the directive's class.
If you use the `host` metadata property, you must modify both the property/method declaration in the directive's class and the metadata in the decorator associated with the directive.

<docs-code header="app/shared/validator.directive.ts" path="adev/src/content/examples/styleguide/src/06-03/app/shared/validator.directive.ts"/>

Compare with the less preferred `host` metadata alternative.

**Why**? <br />
The `host` metadata is only one term to remember and doesn't require extra ES imports.

<docs-code header="app/shared/validator2.directive.ts" path="adev/src/content/examples/styleguide/src/06-03/app/shared/validator2.directive.ts"/>
## Services

### Services are singletons

#### Style 07-01

**Do** use services as singletons within the same injector.
Use them for sharing data and functionality.

**Why**? <br />
Services are ideal for sharing methods across a feature area or an app.

**Why**? <br />
Services are ideal for sharing stateful in-memory data.

<docs-code header="app/heroes/shared/hero.service.ts" path="adev/src/content/examples/styleguide/src/07-01/app/heroes/shared/hero.service.ts" visibleRegion="example"/>

### Providing a service

#### Style 07-03

**Do** provide a service with the application root injector in the `@Injectable` decorator of the service.

**Why**? <br />
The Angular injector is hierarchical.

**Why**? <br />
When you provide the service to a root injector, that instance of the service is shared and available in every class that needs the service.
This is ideal when a service is sharing methods or state.

**Why**? <br />
When you register a service in the `@Injectable` decorator of the service, optimization tools such as those used by the [Angular CLI's](cli) production builds can perform tree shaking and remove services that aren't used by your app.

**Why**? <br />
This is not ideal when two different components need different instances of a service.
In this scenario it would be better to provide the service at the component level that needs the new and separate instance.

<docs-code header="src/app/treeshaking/service.ts" path="adev/src/content/examples/dependency-injection/src/app/tree-shaking/service.ts"/>

### Use the &commat;Injectable() class decorator

#### Style 07-04

**Do** use the `@Injectable()` class decorator instead of the `@Inject` parameter decorator when using types as tokens for the dependencies of a service.

**Why**? <br />
The Angular Dependency Injection \(DI\) mechanism resolves a service's own
dependencies based on the declared types of that service's constructor parameters.

**Why**? <br />
When a service accepts only dependencies associated with type tokens, the `@Injectable()` syntax is much less verbose compared to using `@Inject()` on each individual constructor parameter.

<docs-code header="app/heroes/shared/hero-arena.service.ts" path="adev/src/content/examples/styleguide/src/07-04/app/heroes/shared/hero-arena.service.avoid.ts" visibleRegion="example"/>

<docs-code header="app/heroes/shared/hero-arena.service.ts" path="adev/src/content/examples/styleguide/src/07-04/app/heroes/shared/hero-arena.service.ts" visibleRegion="example"/>
## Data Services

### Talk to the server through a service

#### Style 08-01

**Do** refactor logic for making data operations and interacting with data to a service.

**Do** make data services responsible for XHR calls, local storage, stashing in memory, or any other data operations.

**Why**? <br />
The component's responsibility is for the presentation and gathering of information for the view.
It should not care how it gets the data, just that it knows who to ask for it.
Separating the data services moves the logic on how to get it to the data service, and lets the component be simpler and more focused on the view.

**Why**? <br />
This makes it easier to test \(mock or real\) the data calls when testing a component that uses a data service.

**Why**? <br />
The details of data management, such as headers, HTTP methods, caching, error handling, and retry logic, are irrelevant to components and other data consumers.

A data service encapsulates these details.
It's easier to evolve these details inside the service without affecting its consumers.
And it's easier to test the consumers with mock service implementations.

## Lifecycle hooks

Use Lifecycle hooks to tap into important events exposed by Angular.

### Implement lifecycle hook interfaces

#### Style 09-01

**Do** implement the lifecycle hook interfaces.

**Why**? <br />
Lifecycle interfaces prescribe typed method signatures.
Use those signatures to flag spelling and syntax mistakes.

<docs-code header="app/heroes/shared/hero-button/hero-button.component.ts" path="adev/src/content/examples/styleguide/src/09-01/app/heroes/shared/hero-button/hero-button.component.avoid.ts" visibleRegion="example"/>

<docs-code header="app/heroes/shared/hero-button/hero-button.component.ts" path="adev/src/content/examples/styleguide/src/09-01/app/heroes/shared/hero-button/hero-button.component.ts" visibleRegion="example"/>
## Appendix

Useful tools and tips for Angular.

### File templates and snippets

#### Style A-02

**Do** use file templates or snippets to help follow consistent styles and patterns.
Here are templates and/or snippets for some of the web development editors and IDEs.

**Consider** using [snippets](https://marketplace.visualstudio.com/items?itemName=johnpapa.Angular2) for [Visual Studio Code](https://code.visualstudio.com) that follow these styles and guidelines.

<a href="https://marketplace.visualstudio.com/items?itemName=johnpapa.Angular2">

<img alt="Use Extension" src="assets/content/images/guide/styleguide/use-extension.gif">

</a>

**Consider** using [snippets](https://github.com/orizens/sublime-angular2-snippets) for [Sublime Text](https://www.sublimetext.com) that follow these styles and guidelines.

**Consider** using [snippets](https://github.com/mhartington/vim-angular2-snippets) for [Vim](https://www.vim.org) that follow these styles and guidelines.

