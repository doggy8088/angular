# 理解相依性注入

相依性注入，或 DI，是 Angular 中的基本概念之一。DI 已連接到 Angular 框架中，並允許具有 Angular 裝飾器的類，例如元件、指令、管道和可注入項目，配置他們所需的依賴項。

DI 系統中有兩個主要角色：相依項消費者和相依項提供者。

Angular 使用稱為 `Injector` 的抽象，來促進依賴項使用者和依賴項提供者之間的互動。當要求依賴項時，Injector 會檢查其登錄，看看是否有已可用的執行個體。如果沒有，則會建立新的執行個體並將其儲存在登錄中。Angular 會在應用程式引導程序期間建立一個應用程式範圍的 Injector（也稱為「根」Injector）。在大部分情況下，您不需要手動建立 Injector，但您應該知道有一個連接提供者和使用者的層級。

本主題涵蓋類別如何充當相依項的基本情境。Angular 也允許您使用函式、物件、原始類型（例如字串或布林值）或任何其他類型作為相依項。如需更多資訊，請參閱 [相依項提供者](/guide/di/dependency-injection-providers)。

## 提供依賴性

考慮到有一個類別稱為 `HeroService`，需要在元件中做為相依性。

第一步是新增 `@Injectable` 裝飾器來顯示該類別可以被注入。

<docs-code language="typescript" highlight="[1]">
@Injectable()
class HeroService {}
</docs-code>

下一步是通過提供它來使其在 DI 中可用。
依賴關係可以在多個地方提供：

* [**首選：在應用程式根級別使用 `providedIn`。**](#preferred-at-the-application-root-level-using-providedin)
* [在元件級別。](#at-the-component-level)
* [在應用程式根級別使用 `ApplicationConfig`。](#at-application-root-level-using-applicationconfig)
* [`NgModule` 基礎的應用程式。](#ngmodule-based-applications)

### **建議**: 在應用程式根目錄層級使用 `providedIn`

在應用程式根層級使用 `providedIn` 提供服務，允許將服務注入到所有其他類別。
使用 `providedIn` 可讓 Angular 和 JavaScript 程式碼最佳化器有效移除未使用的服務（稱為樹狀搖動）。

您可以透過在 `@Injectable` 裝飾器中使用 `providedIn: 'root'` 來提供服務：

<docs-code language="typescript" highlight="[2]">
@Injectable({
  providedIn: 'root'
})
class HeroService {}
</docs-code>

當您在根層級提供服務時，Angular 會建立一個 `HeroService` 的單一共用實例，並將其注入任何要求它的類別。

### 在元件層級

您可以在 `@Component` 層級，透過使用 `@Component` 裝飾器的 `providers` 欄位，來提供服務。
在這種情況下，`HeroService` 會提供給此元件的所有實例，以及範本中使用的其他元件和指令。

例如：

<docs-code language="typescript" highlight="[5]">
@Component({
  standalone: true,
  selector: 'hero-list',
  template: '...',
  providers: [HeroService]
})
class HeroListComponent {}
</docs-code>

當您在元件層級註冊供應商時，您會在每個新元件實例中取得服務的新實例。

註解：宣告像這樣的服務會導致 `HeroService` 一直包含在您的應用程式中，即使該服務未使用。

### 在應用程式根級別使用 `ApplicationConfig`

您可以在 `ApplicationConfig` 的 `providers` 欄位中（傳遞給 `bootstrapApplication` 函式）提供服務或其他在應用程式層級的 `Injectable`。

在以下範例中，`HeroService` 可供所有元件、指令和管道使用。

<docs-code language="typescript" highlight="[3]">
export const appConfig: ApplicationConfig = {
    providers: [
      { provide: HeroService },
    ]
};
</docs-code>

然後，在 `main.ts` 中：

<docs-code language="typescript">
bootstrapApplication(AppComponent, appConfig)
</docs-code>

註解：宣告像這樣的服務會導致 `HeroService` 一直包含在您的應用程式中，即使該服務未使用。

### 基於 `NgModule` 的應用程式

基於 `@NgModule` 的應用程式使用 `@NgModule` 裝飾器的 `providers` 欄位，以提供應用程式層級可用的服務或其他 `Injectable`。

模組中提供的服務可供模組的所有宣告使用，或是供共用相同 `ModuleInjector` 的任何其他模組使用。
若要了解所有邊緣案例，請參閱[階層式注入器](/guide/di/hierarchical-dependency-injection)。

註：使用 `providers` 宣告服務會導致服務包含在您的應用程式中，即使該服務未使用。

## 注入/使用依賴項

注入依賴項最常見的方式是在類別建構函式中宣告它。當 Angular 建立一個元件、指令或管線類別的新執行個體時，它會藉由檢視建構函式參數類型來判斷該類別需要哪些服務或其他依賴項。例如，如果 `HeroListComponent` 需要 `HeroService`，則建構函式可以像這樣：

<docs-code language="typescript" highlight="[3]">
@Component({ … })
class HeroListComponent {
  constructor(private service: HeroService) {}
}
</docs-code>

另一個選項是使用 [inject](api/core/inject) 方法：

<docs-code language="typescript" highlight="[3]">
@Component({ … })
class HeroListComponent {
  private service = inject(HeroService);
}
</docs-code>

當 Angular 發現某個元件依賴於某個服務時，它會先檢查注入器是否有該服務的任何現有實例。如果請求的服務實例尚未存在，則注入器會使用已註冊的提供者建立一個，並在將服務傳回 Angular 之前將其新增到注入器中。

當所有請求的服務都已解析並回傳，Angular 可以使用那些服務作為參數，來呼叫元件的建構函式。

<!-- TODO(josephperrott): enable this mermaid chart -->

```
graph TD;
subgraph Injector
serviceA[Service A]
heroService[HeroService]
serviceC[Service C]
serviceD[Service D]
end
direction TB
componentConstructor["Component\nconstructor(HeroService)"]
heroService-->componentConstructor
style componentConstructor text-align: left
```

## 接下來

<docs-pill-row>
  <docs-pill href="/guide/di/creating-injectable-service" title="建立並注入服務"/>
</docs-pill-row>
