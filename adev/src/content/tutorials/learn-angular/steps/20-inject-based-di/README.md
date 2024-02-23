# 基於注入的依賴性注入

建立可注入服務是 Angular 中相依性注入 (DI) 系統的第一部分。如何將服務注入元件？Angular 有個方便的功能稱為 `inject()`，可以在適當的語境中使用。

註解：注入內容不在本教學的範圍內，但如果您想了解更多，可以在 [Angular 文件](guide/di/dependency-injection-context) 中找到更多資訊。

在這個活動中，您將學習如何注入服務並在元件中使用它。

<hr>

初始化類別屬性，使用 DI 系統提供的數值，通常很有幫助。以下是一個範例：

<docs-code language="ts" highlight="[3]">
@Component({...})
class PetCareDashboardComponent {
    petRosterService = inject(PetRosterService);
}
</docs-code>

<docs-workflow>

<docs-step title="注入 `CarService`">

在 `app.component.ts` 中，使用 `inject()` 函式注入 `CarService` 並將其指定給名為 `carService` 的屬性

注意：注意屬性 `carService` 和類別 `CarService` 之間的差異。

</docs-step>

<docs-step title="使用 `carService` 實例">

呼叫 `inject(CarService)` 為您提供了 `CarService` 的實例，您可以在應用程式中使用它，並儲存在 `carService` 屬性中。

在 `AppComponent` 的 `constructor` 函式中，加入以下實作：

```ts
constructor() {
    this.display = this.carService.getCars().join(' ⭐️ ');
}
```

</docs-step>

<docs-step title="更新 `AppComponent` 範本">

在 `app.component.ts` 中更新元件範本，使用以下程式碼：

```ts
template: `<p>Car Listing: {{ display }}</p>`,
```

</docs-step>

</docs-workflow>

你剛在元件中注入第一個服務 - 真是太棒了。在你完成 DI 這部分之前，你會學到一種注入資源到元件中的替代語法。
