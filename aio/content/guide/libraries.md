# Angular 程式庫總覽

許多應用程式都需要解決相同的一般性問題，例如呈現一致的使用者介面、呈現資料，以及讓使用者輸入資料。
開發者可以針對特定領域建立一般性的解決方案，調整後在不同的應用程式中重複使用。
這樣的解決方案可以建置成 Angular *程式庫*，這些程式庫也能發行並以 *npm 套件*的形式分享。

Angular 程式庫是一種 Angular [專案](guide/glossary#專案project)，它與應用程式的差別在於無法自行執行。
程式庫必須被匯入應用程式中才能使用。

程式庫能擴充 Angular 的基礎功能。例如，若要為應用程式加入[反應式表單](guide/reactive-forms)，可以使用 `ng add @angular/forms` 加入程式庫套件，再在應用程式程式碼中從 `@angular/forms` 程式庫匯入 `ReactiveFormsModule`。
同樣地，為 Angular 應用程式加入 [service worker](guide/service-worker-intro) 程式庫，是將應用程式轉變成[漸進式 Web 應用程式](https://developers.google.com/web/progressive-web-apps/)（PWA）的步驟之一。
[Angular Material](https://material.angular.io/) 就是一個大型通用程式庫的例子，它提供精緻、可重複使用且能靈活調整的 UI 元件。

任何應用程式開發者都能使用這些程式庫，以及由 Angular 團隊或第三方發行成 npm 套件的其他程式庫。請參閱[使用已發行的程式庫](guide/using-libraries)。

## 建立程式庫

如果你開發的功能適合重複使用，你可以建立自己的程式庫。
這些程式庫可以在你的工作區中本機使用，你也可以將它們發行成 [npm 套件](guide/npm-packages)，與其他專案或其他 Angular 開發者分享。
這些套件可以發行到 npm 註冊表、私有的 npm Enterprise 註冊表，或支援 npm 套件的私有套件管理系統。
請參閱[建立程式庫](guide/creating-libraries)。

是否將功能包裝成程式庫，是一個架構層面的決定，類似於決定某項功能該做成元件還是服務，或決定元件的範圍。

將功能包裝成程式庫，會迫使程式庫中的產物與應用程式的業務邏輯解耦。
這有助於避免各種不良做法或架構錯誤，以免日後難以解耦並重複使用程式碼。

把程式碼放進獨立的程式庫，比把所有東西都放進單一應用程式更複雜。
它需要在管理、維護與更新程式庫上投入更多時間與心力。
不過，當程式庫被多個應用程式使用時，這份複雜度就能帶來回報。

<div class="alert is-helpful">

請注意，程式庫是供 Angular 應用程式使用的。
若要為非 Angular 的網頁應用程式加入 Angular 功能，請使用 [Angular 自訂元素](guide/elements)。

</div>
