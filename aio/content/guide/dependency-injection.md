# 了解依賴注入

依賴注入（DI）是 Angular 的基本概念之一。DI 已內建於 Angular 框架中，讓帶有 Angular 裝飾器的類別（例如元件、指令、管道與可注入物件）能設定它們所需的依賴。

DI 系統中有兩個主要角色：依賴消費者與依賴提供者。

Angular 使用一種稱為 [Injector](guide/glossary#注入器injector) 的抽象，來促進依賴消費者與依賴提供者之間的互動。當某個依賴被請求時，注入器會檢查它的註冊表，看其中是否已有可用的實例。如果沒有，就會建立一個新實例並存入註冊表。Angular 會在應用程式啟動過程中，建立一個應用程式範圍的注入器（也稱為「根」注入器）。在大多數情況下，你不需要手動建立注入器，但你應該知道，有一個層次負責連接提供者與消費者。

本主題涵蓋類別如何作為依賴的基本情境。Angular 也允許你使用函式、物件、原始型別（例如字串或布林值），或任何其他型別作為依賴。更多資訊請參閱[依賴提供者](guide/dependency-injection-providers)。

## 提供依賴

假設有一個名為 `HeroService` 的類別，需要在元件中作為依賴。

第一步是加上 `@Injectable` 裝飾器，表明該類別可以被注入。

<code-example language="typescript">
@Injectable()
class HeroService {}
</code-example>

下一步是透過提供它，讓它在 DI 中可供使用。
依賴可以在多個地方提供：

* 在元件層級，使用 `@Component` 裝飾器的 `providers` 欄位。在此情況下，`HeroService` 會提供給這個元件的所有實例，以及範本中使用的其他元件與指令。例如：

<code-example language="typescript">
@Component({
  selector: 'hero-list',
  template: '...',
  providers: [HeroService]
})
class HeroListComponent {}
</code-example>

當你在元件層級註冊提供者時，該元件的每個新實例都會取得一個新的服務實例。

* 在 NgModule 層級，使用 `@NgModule` 裝飾器的 `providers` 欄位。在此情境中，`HeroService` 會提供給這個 NgModule 或位於同一 ModuleInjector 適用範圍內的其他 NgModule 中宣告的所有元件、指令與管道。當你以特定 NgModule 註冊提供者時，服務的同一個實例會提供給所有適用的元件、指令與管道。若要了解所有邊緣案例，請參閱[階層式注入器](guide/hierarchical-dependency-injection)。例如：


<code-example language="typescript">
@NgModule({
  declarations: [HeroListComponent]
  providers: [HeroService]
})
class HeroListModule {}
</code-example>

* 在應用程式根層級，可將它注入應用程式中的其他類別。做法是在 `@Injectable` 裝飾器中加上 `providedIn: 'root'` 欄位：

<code-example language="typescript">
@Injectable({
  providedIn: 'root'
})
class HeroService {}
</code-example>

當你在根層級提供服務時，Angular 會建立一個 `HeroService` 的單一共用實例，並將它注入任何需要它的類別。在 `@Injectable` 中繼資料中註冊提供者，也能讓 Angular 最佳化應用程式，在服務未被使用時將它從編譯後的應用程式中移除，這個過程稱為 tree-shaking。

## 注入依賴

最常見的注入依賴方式，是在類別建構子中宣告它。當 Angular 建立元件、指令或管道類別的新實例時，它會查看建構子參數的型別，來判斷該類別需要哪些服務或其他依賴。例如，若 `HeroListComponent` 需要 `HeroService`，建構子可以寫成這樣：

<code-example language="typescript">
@Component({ … })
class HeroListComponent {
  constructor(private service: HeroService) {}
}
</code-example>

另一個選項是使用 [inject](api/core/inject) 方法：

<code-example language="typescript">
@Component({ … })
class HeroListComponent {
  private service = inject(HeroService);
}
</code-example>

當 Angular 發現某個元件依賴某個服務時，它會先檢查注入器中是否已有該服務的現有實例。如果請求的服務實例尚不存在，注入器會使用已註冊的提供者建立一個，並將它加入注入器，然後再把服務傳回給 Angular。

當所有請求的服務都已解析並傳回後，Angular 就能以這些服務作為引數，呼叫元件的建構子。

<div class="lightbox">
  <img src="generated/images/guide/architecture/injector-injects.png" alt="服務" class="left">
</div>

## 後續步驟

* [建立與注入服務](guide/creating-injectable-service)
* [實際運用依賴注入](guide/dependency-injection-in-action)

@reviewed 2023-05-16
