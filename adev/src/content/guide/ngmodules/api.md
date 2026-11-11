# NgModule API

從高層次來看，NgModule 是組織 Angular 應用程式的一種方式，透過 `@NgModule` 裝飾器中的中繼資料來達成。
中繼資料分為三類：

| 類別                 | 詳細說明 |
|:---                      |:---     |
| 靜態                   | 編譯器設定，告訴編譯器指令的選擇器，以及透過選擇器比對，指令應套用在範本的哪些位置。使用 `declarations` 陣列來設定。 |
| 執行期                  | 注入器設定，使用 `providers` 陣列。                                                                                                                                                             |
| 可組合性／分組 | 使用 `imports` 與 `exports` 陣列，將 NgModule 組合在一起並提供出來使用。                                                                                                                 |

<docs-code language="typescript" highlight="[2,5,8]">

@NgModule({
  // Static, that is compiler configuration
  declarations: [], // Configure the selectors

  // Runtime, or injector configuration
  providers: [], // Runtime injector configuration

  // Composability / Grouping
  imports: [], // composing NgModules together
  exports: [] // making NgModules available to other parts of the app
})

</docs-code>

## `@NgModule` 中繼資料 {#ngmodule-metadata}

下表彙總 `@NgModule` 的中繼資料屬性。

| 屬性       | 詳細說明 |
|:---            |:---     |
| `declarations` | [可宣告](guide/ngmodules/faq#what-is-a-declarable?)類別（*元件*、*指令*與*管道*）的清單，這些類別*屬於此模組*。 <ol> <li> 編譯範本時，你需要決定一組選擇器，用來觸發其對應的指令。 </li> <li> 範本是在某個 NgModule 的脈絡中編譯的——即範本的元件所宣告的那個 NgModule——它會依照下列規則決定選擇器的集合： <ul> <li> `declarations` 中列出的所有指令的選擇器。 </li> <li> 從匯入的 NgModule 匯出的所有指令的選擇器。 </li> </ul> </li> </ol> 元件、指令與管道必須*恰好*屬於一個模組。如果你嘗試在一個以上的模組中宣告同一個類別，編譯器會發出錯誤。請小心不要重複宣告直接或間接從其他模組匯入的類別。                                                                                                                                                                                                                                                 |
| `providers`    | 依賴注入提供者的清單。 <br /> Angular 會將這些提供者註冊到 NgModule 的注入器。如果這是用來啟動的 NgModule，它就是根注入器。 <br /> 這些服務可供注入到此注入器的任何子元件、指令、管道或服務中。 <br /> 延遲載入的模組有自己的注入器，通常是應用程式根注入器的子注入器。 <br /> 延遲載入的服務作用域限定在延遲載入模組的注入器。如果延遲載入的模組也提供了 `UserService`，在該模組脈絡中建立的任何元件（例如透過路由導覽）取得的是服務的本機實例，而不是根應用程式注入器中的實例。 <br /> 外部模組中的元件則繼續接收其注入器所提供的實例。 <br /> 關於注入器階層與作用域的更多資訊，請見 [Providers](guide/ngmodules/providers) 與 [DI 指南](guide/di)。                                                                                                                                                                                  |
| `imports`      | 應併入此模組的模組清單。併入的意思是，彷彿所有匯入的 NgModule 所匯出的屬性都宣告在此。 <br /> 具體來說，就彷彿那些其匯出的元件、指令或管道被元件範本參照的模組清單，宣告在此模組中。 <br /> 當參照宣告在此模組中，或匯入的模組已將其匯出時，元件範本可以[參照](guide/ngmodules/faq#how-does-angular-find-components,-directives,-and-pipes-in-a-template?-what-is-a-template-reference?)另一個元件、指令或管道。例如，元件只有在模組匯入了 Angular 的 `CommonModule`（或許是間接透過匯入 `BrowserModule`）時，才能使用 `NgIf` 與 `NgFor` 指令。 <br /> 你可以從 `CommonModule` 匯入許多標準指令，但有些熟悉的指令屬於其他模組。例如，匯入 Angular 的 `FormsModule` 之後，才能使用 `[(ngModel)]`。                                                                                                                                                                                                                                     |
| `exports`      | 匯入此模組的模組可以使用的宣告（*元件*、*指令*與*管道*類別）清單。 <br /> 匯出的宣告是模組的*公開 API*。如果另一個模組的元件匯入了此模組，且此模組匯出了 `UserComponent`，該元件就能使用*此*模組的 `UserComponent`。 <br /> 宣告預設是私有的。如果此模組*沒有*匯出 `UserComponent`，就只有*此*模組內的元件能使用 `UserComponent`。 <br /> 匯入一個模組*不會*自動重新匯出該模組所匯入的內容。模組「B」不能只因為匯入了匯入 `CommonModule` 的模組「A」，就能使用 `ngIf`。模組「B」必須自己匯入 `CommonModule`。 <br /> 模組可以將另一個模組列入其 `exports`，此時該模組的所有公開元件、指令與管道都會被匯出。 <br /> [重新匯出](guide/ngmodules/faq#what-should-i-export?)讓模組的遞移性明確化。如果模組「A」重新匯出了 `CommonModule`，而模組「B」匯入模組「A」，即使「B」本身沒有匯入 `CommonModule`，模組「B」的元件也能使用 `ngIf`。 |
| `bootstrap`    | 會自動啟動的元件清單。 <br /> 通常這份清單只有一個元件，即應用程式的*根元件*。 <br /> Angular 可以以多個啟動元件啟動，每個元件在宿主網頁中各自有其位置。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |

## 更多關於 NgModules {#more-on-ngmodules}

<docs-pill-row>
  <docs-pill href="guide/ngmodules/feature-modules" title="功能模組"/>
  <docs-pill href="guide/ngmodules/providers" title="提供者"/>
  <docs-pill href="guide/ngmodules/module-types" title="功能模組的類型"/>
</docs-pill-row>
