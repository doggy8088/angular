# NgModule API

從高層次來看，NgModule 是組織 Angular 應用程式的一種方式，透過 `@NgModule` 裝飾器中的中繼資料來達成。
中繼資料分為三類：

* **靜態：** 編譯器設定，告訴編譯器指令的選擇器，以及透過選擇器比對，指令應套用在範本的哪些位置。這是使用 `declarations` 陣列來設定的。
* **執行期：** 使用 `providers` 陣列的注入器設定。
* **可組合性/分組：** 使用 `imports` 與 `exports` 陣列，將 NgModule 組合在一起並提供出來使用。

```typescript
@NgModule({
  // Static, that is compiler configuration
  declarations: [], // Configure the selectors
  entryComponents: [], // Generate the host factory

  // Runtime, or injector configuration
  providers: [], // Runtime injector configuration

  // Composability / Grouping
  imports: [], // composing NgModules together
  exports: [] // making NgModules available to other parts of the app
})
```

## `@NgModule` 中繼資料

下表彙總 `@NgModule` 的中繼資料屬性。

<table>

  <tr>

    <th>
      屬性
    </th>

    <th>
      說明
    </th>

  </tr>

  <tr>

    <td style="vertical-align: top">
      <code>declarations</code>
    </td>

    <td>

      [可宣告](guide/ngmodule-faq#q-declarable)類別（*元件*、*指令*與*管道*）的清單，這些類別_屬於此模組_。

      <ol>
        <li>編譯範本時，你需要決定一組選擇器，用來觸發其對應的指令。</li>
        <li>
          範本是在某個 NgModule 的脈絡中編譯的&mdash;即範本的元件所宣告的那個 NgModule&mdash;它會依照下列規則決定選擇器的集合：
          <ul>
            <li>`declarations` 中列出的所有指令的選擇器。</li>
            <li>從匯入的 NgModule 匯出的所有指令的選擇器。</li>
          </ul>
        </li>
      </ol>

      元件、指令與管道必須_恰好_屬於一個模組。
      如果你嘗試在一個以上的模組中宣告同一個類別，編譯器會發出錯誤。請小心不要重複宣告直接或間接從其他模組匯入的類別。

    </td>

  </tr>

  <tr>

    <td style="vertical-align: top">
      <code>providers</code>
    </td>

    <td>

      依賴注入提供者的清單。

      Angular 會將這些提供者註冊到 NgModule 的注入器。
      如果這是用來啟動的 NgModule，它就是根注入器。

      這些服務可供注入到此注入器的任何子元件、指令、管道或服務中。

      延遲載入的模組有自己的注入器，通常是應用程式根注入器的子注入器。

      延遲載入的服務作用域限定在延遲載入模組的注入器。
      如果延遲載入的模組也提供了 `UserService`，在該模組脈絡中建立的任何元件（例如透過路由導覽）取得的是服務的本機實例，而不是根應用程式注入器中的實例。

      外部模組中的元件則繼續接收其注入器所提供的實例。

      關於注入器階層與作用域的更多資訊，請見 [Providers](guide/providers) 與 [DI 指南](guide/dependency-injection)。

    </td>

  </tr>

  <tr>

    <td style="vertical-align: top">
      <code>imports</code>
    </td>

    <td>

      應併入此模組的模組清單。併入的意思是，彷彿所有匯入的 NgModule 所匯出的屬性都宣告在此。

      具體來說，就彷彿那些其匯出的元件、指令或管道被元件範本參照的模組清單，宣告在此模組中。

      當參照宣告在此模組中，或匯入的模組已將其匯出時，元件範本可以[參照](guide/ngmodule-faq#q-template-reference)另一個元件、指令或管道。
      例如，元件只有在模組匯入了 Angular 的 `CommonModule`（或許是間接透過匯入 `BrowserModule`）時，才能使用 `NgIf` 與 `NgFor` 指令。

      你可以從 `CommonModule` 匯入許多標準指令，但有些熟悉的指令屬於其他模組。
      例如，匯入 Angular 的 `FormsModule` 之後，才能使用 `[(ngModel)]`。

    </td>

  </tr>

  <tr>

    <td style="vertical-align: top">
      <code>exports</code>
    </td>

    <td>

      匯入此模組的模組可以使用的宣告&mdash;*元件*、*指令*與*管道*類別&mdash;清單。

      匯出的宣告是模組的_公開 API_。
      如果另一個模組的元件匯入了此模組，且此模組匯出了 `UserComponent`，該元件就能[使用](guide/ngmodule-faq#q-template-reference)_此_模組的 `UserComponent`。

      宣告預設是私有的。
      如果此模組_沒有_匯出 `UserComponent`，就只有_此_模組內的元件能使用 `UserComponent`。

      匯入一個模組_不會_自動重新匯出該模組所匯入的內容。
      模組 'B' 不能只因為匯入了匯入 `CommonModule` 的模組 'A'，就能使用 `ngIf`。
      模組 'B' 必須自己匯入 `CommonModule`。

      模組可以將另一個模組列入其 `exports`，此時該模組的所有公開元件、指令與管道都會被匯出。

      [重新匯出](guide/ngmodule-faq#q-reexport)讓模組的遞移性明確化。
      如果模組 'A' 重新匯出了 `CommonModule`，而模組 'B' 匯入模組 'A'，即使 'B' 本身沒有匯入 `CommonModule`，模組 'B' 的元件也能使用 `ngIf`。

    </td>

  </tr>

  <tr>

    <td style="vertical-align: top">
      <code>bootstrap</code>
    </td>

    <td>

      會自動啟動的元件清單。

      通常這份清單只有一個元件，即應用程式的_根元件_。

      Angular 可以以多個啟動元件啟動，每個元件在宿主網頁中各自有其位置。

      啟動元件會自動加入 `entryComponents`。

    </td>

  </tr>

  <tr>

    <td style="vertical-align: top">
      <code>entryComponents</code>
    </td>

    <td>

      可以動態載入到檢視中的元件清單。

      依預設，Angular 應用程式一律至少有一個進入元件，也就是根元件 `AppComponent`。它的用途是作為進入應用程式的入口點，也就是說，你啟動它來啟動應用程式。

      路由元件也是_進入元件_，因為它們需要動態載入。
      路由器會建立它們，並將它們放入 `<router-outlet>` 附近的 DOM 中。

      雖然啟動元件與路由元件都是_進入元件_，你不需要把它們加入模組的 `entryComponents` 清單，因為它們會被隱含地加入。

      Angular 會自動把模組 `bootstrap` 與路由定義中的元件加入 `entryComponents` 清單。

      這使得只有透過命令式技巧啟動的元件（例如 [`ViewComponentRef.createComponent()`](api/core/ViewContainerRef#createComponent)）無法被發現。

      除了路由器之外，動態載入元件在大多數應用程式中並不常見。如果你需要動態載入元件，必須自己把這些元件加入 `entryComponents` 清單。

      更多資訊，請參閱[進入元件](guide/entry-components)。

    </td>

  </tr>

</table>

## 更多關於 NgModules

你可能也會對以下內容有興趣：
* [功能模組](guide/feature-modules)。
* [進入元件](guide/entry-components)。
* [提供者](guide/providers)。
* [功能模組的類型](guide/module-types)。
