# Angular 函式庫概述

許多應用程式需要解決相同的一般問題，例如呈現統一的使用者介面、呈現資料，以及允許輸入資料。
開發人員可以為特定網域建立一般解決方案，以便在不同應用程式中改編以重複使用。
此類解決方案可以建置為 Angular *函式庫*，而且這些函式庫可以發布並分享為 *npm 套件*。

Angular 函式庫是一個 Angular 專案，它與應用程式不同之處在於它無法自行執行。
函式庫必須在應用程式中匯入和使用。

Libraries 擴充 Angular 的基本功能。
例如，若要將 [reactive forms](guide/forms/reactive-forms) 加入應用程式，請使用 `ng add @angular/forms` 加入函式庫套件，然後在應用程式程式碼中從 `@angular/forms` 函式庫匯入 `ReactiveFormsModule`。
同樣地，將 [service worker](ecosystem/service-workers) 函式庫加入 Angular 應用程式是將應用程式轉換為 [Progressive Web App](https://developers.google.com/web/progressive-web-apps) \(PWA\) 的步驟之一。
[Angular Material](https://material.angular.io) 是大型、通用函式庫的一個範例，它提供進階、可重複使用且可適應的 UI 元件。

任何應用程式開發人員都可以使用這些和其它已由 Angular 團隊或第三方以 npm 套件形式發佈的函式庫。
請參閱 [使用發佈函式庫](tools/libraries/using-libraries)。

HELPFUL: 程式庫供 Angular 應用程式使用。如要將 Angular 功能新增至非 Angular 網路應用程式，請使用 [Angular 自訂元素](guide/elements)。

## 建立函式庫

如果您已開發出適合重複使用的功能，您可以建立您自己的函式庫。
這些函式庫可以在您的工作區中本地使用，或者您可以將它們發佈為 [npm 套件](reference/configs/npm-packages) 以與其他專案或其他 Angular 開發人員分享。
這些套件可以發佈到 npm 註冊表、私人 npm Enterprise 註冊表，或支援 npm 套件的私人套件管理系統。
請參閱 [建立函式庫](tools/libraries/creating-libraries)。

決定將功能打包為函式庫是一項架構決策。這可以比擬為決定一個功能是元件或服務，或決定元件的範圍。

將包裝功能作為程式庫強制程式庫中的成品與應用程式的商業邏輯分離。
這有助於避免各種不良做法或架構錯誤，這些錯誤可能會導致未來難以分離和重複使用程式碼。

將程式碼放入獨立的程式庫比將所有內容放入一個應用程式要複雜。
它需要更多時間和想法的投入，以管理、維護和更新程式庫。
當程式庫用於多個應用程式時，這種複雜性可以得到回報。

