# 以 inject 為基礎的依賴注入

建立可注入的服務，是 Angular 依賴注入（DI）系統的第一部分。要如何把服務注入到元件中呢？Angular 有一個方便的函式，稱為 `inject()`，可以在適當的情境中使用。

Note: 注入情境不在本教學的範圍內，但如果你想進一步了解，可以在 [Angular 文件](guide/di/dependency-injection-context)中找到更多資訊。

在這個練習中，你將學習如何注入服務並在元件中使用它。

<hr>

用 DI 系統提供的值來初始化類別屬性，通常很有幫助。範例如下：

<docs-code language="ts" highlight="[3]">
@Component({...})
class PetCareDashboardComponent {
    petRosterService = inject(PetRosterService);
}
</docs-code>

<docs-workflow>

<docs-step title="注入 `CarService`">

在 `app.component.ts` 中，使用 `inject()` 函式注入 `CarService`，並把它指派給一個名為 `carService` 的屬性

Note: 注意屬性 `carService` 與類別 `CarService` 之間的差異。

</docs-step>

<docs-step title="使用 `carService` 實例">

呼叫 `inject(CarService)` 會給你一個 `CarService` 的實例，你可以在應用程式中使用它，它存放在 `carService` 屬性中。

在 `AppComponent` 的 `constructor` 函式中，加入以下實作：

```ts
constructor() {
    this.display = this.carService.getCars().join(' ⭐️ ');
}
```

</docs-step>

<docs-step title="更新 `AppComponent` 範本">

用以下程式碼更新 `app.component.ts` 中的元件範本：

```ts
template: `<p>Car Listing: {{ display }}</p>`,
```

</docs-step>

</docs-workflow>

你剛剛把第一個服務注入到元件中了——表現太出色了。在完成這個 DI 章節之前，你將學習另一種把資源注入元件的語法。
