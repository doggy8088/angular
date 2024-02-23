# NgModule API

在高層面上，NgModules 是一種組織 Angular 應用程式的方法，它們透過 `@NgModule` 裝飾器中的元數據來完成此操作。
元數據分為三類：

| 類別                   | 詳細資料 |
|:---                      |:---     |
| 靜態                   | 編譯器設定，用以告知編譯器有關指令選擇器以及在範本中的哪些位置應透過選擇器比對來套用指令。此設定是使用 `declarations` 陣列來設定。 |
| 執行時期                  | 使用 `providers` 陣列的注入器設定。                                                                                                                                                             |
| 組合性/群組化 | 將 NgModules 集中在一起，並使用 `imports` 和 `exports` 陣列讓它們可用。                                                                                                                 |

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

## `@NgModule` 元數據

下表總結了 `@NgModule` 元數據屬性。

| 屬性       | 詳細資料 |
|:---            |:---     |
| `declarations` | 一個可宣告類別的清單（元件、指令和管線），屬於此模組。 <ol> <li> 編譯範本時，您需要決定一組選取器，用於觸發其對應的指令。 </li> <li> 範本在 NgModule 的內容內編譯，即宣告範本元件的 NgModule，用來決定選取器組，使用下列規則： <ul> <li> `declarations` 中列出的所有指令的選取器。 </li> <li> 從匯入的 NgModule 匯出的所有指令的選取器。 </li> </ul> </li> </ol> 元件、指令和管線必須屬於 *一個* 模組。如果您嘗試在多個模組中宣告同一個類別，編譯器會傳出錯誤。小心不要重新宣告從其他模組直接或間接匯入的類別。                                                                                                                                                                                                                                                 |
| `providers`    | 一個依賴注入提供者的清單。 <br /> Angular 會將這些提供者註冊到 NgModule 的注入器。如果是用於引導的 NgModule，則它就是根注入器。 <br /> 這些服務可供注入到任何元件、指令、管線或服務，這些元件、指令、管線或服務是此注入器的子項。 <br /> 延遲載入的模組有自己的注入器，通常是應用程式根注入器的子項。 <br /> 延遲載入的服務的範圍限定於延遲載入模組的注入器。如果延遲載入的模組也提供 `UserService`，在該模組內容內建立的任何元件（例如透過路由導覽），都會取得服務的本機執行個體，而不是根應用程式注入器中的執行個體。 <br /> 外部模組中的元件仍會收到其注入器提供的執行個體。 <br /> 如需有關注入器階層和範圍的更多資訊，請參閱 [提供者](/guide/ngmodules/providers) 和 [DI 指南](/guide/di)。                                                                                                                                                                                  |
| `imports`      | 應該摺疊到此模組的模組清單。摺疊是指所有匯入的 NgModule 的匯出屬性都宣告在這裡。 <br /> 具體來說，它就好像宣告匯出元件、指令或管線被元件範本參照的模組清單在此模組中一樣。 <br /> 元件範本可以在此模組中宣告參照時，或匯入的模組已匯出參照時，參照另一個元件、指令或管線。例如，元件只能在模組匯入 Angular `CommonModule`（可能透過匯入 `BrowserModule` 間接匯入）之後，才能使用 `NgIf` 和 `NgFor` 指令。 <br /> 您可從 `CommonModule` 匯入許多標準指令，但有些熟悉的指令屬於其他模組。例如，您只能在匯入 Angular `FormsModule` 之後，才能使用 `[(ngModel)]`。                                                                                                                                                                                                                                     |
| `exports`      | 匯入模組可使用的宣告清單，包括元件、指令和管線類別。 <br /> 匯出的宣告是模組的 *公開 API*。如果另一個模組匯入此模組，且此模組匯出 `UserComponent`，則該模組中的元件即可使用 *此* 模組的 `UserComponent`。 <br /> 宣告預設為私人。如果此模組 *沒有* 匯出 `UserComponent`，則只有 *此* 模組中的元件才能使用 `UserComponent`。 <br /> 匯入模組 *不會* 自動重新匯出匯入模組的匯入項目。模組 'B' 無法使用 `ngIf`，只因為它匯入了匯入 `CommonModule` 的模組 'A'。模組 'B' 必須自行匯入 `CommonModule`。 <br /> 模組可在其 `exports` 中列出另一個模組，這種情況下，該模組的所有公開元件、指令和管線都會被匯出。 <br /> [重新匯出](/guide/ngmodules/faq#what-should-i-export?) 會讓模組傳遞性更明確。如果模組 'A' 重新匯出 `CommonModule`，而模組 'B' 匯入模組 'A'，則即使 'B' 本身沒有匯入 `CommonModule`，模組 'B' 的元件仍可使用 `ngIf`。 |
| `bootstrap`    | 一個會自動引導的元件清單。 <br /> 此清單中通常只有一個元件，即應用程式的 *根元件*。 <br /> Angular 可啟動多個引導元件，每個元件在主機網頁中都有自己的位置。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |

## 更多有關 NgModules

<docs-pill-row>
  <docs-pill href="guide/ngmodules/feature-modules" title="功能模組"/>
  <docs-pill href="guide/providers" title="提供者"/>
  <docs-pill href="guide/module-types" title="功能模組類型"/>
</docs-pill-row>

