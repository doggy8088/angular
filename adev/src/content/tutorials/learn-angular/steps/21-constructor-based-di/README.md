# 基於建構函數的相依性注入

在先前的活動中，您使用 `inject()` 函數來提供資源，並將它們「提供」給您的元件。 `inject()` 函數是一種模式，知道還存在另一種模式可注入資源，稱為建構函數為基礎的相依性注入，這一點非常有用。

您可以將資源指定為元件的 `constructor` 函數的參數。Angular 會讓您的元件可以使用這些資源。
<br><br>
在本活動中，您將學習如何使用基於建構函式的依賴性注入。

<hr>

若要將服務或其他可注入資源注入元件，請使用下列語法：

<docs-code language="ts" highlight="[3]">
@Component({...})
class PetCarDashboardComponent {
    constructor(private petCareService: PetCareService) {
        ...
    }
}
</docs-code>

這裡有幾件事需要注意：

- 使用 `private` 關鍵字
- `petCareService` 變成一個可以在類別中使用的屬性
- `PetCareService` 類別是注入的類別

好的，現在你試著這樣做：

<docs-workflow>

<docs-step title="更新程式碼以使用基於建構函數的 DI">

在 `app.component.ts` 中，更新建構函式程式碼以符合以下程式碼：

提示：請記住，如果您遇到困難，請參閱此活動頁面上的範例。

```ts
constructor(private carService: CarService) {
    this.display = this.carService.getCars().join(' ⭐️ ');
}
```

</docs-step>

</docs-workflow>

恭喜您完成此活動。範例程式碼與使用 `inject` 函數相同。雖然這兩種方法大致相同，但存在一些超出本教學範圍的細微差異。

<br>

您可以在 [Angular 文件](guide/di) 中找到有關相依性注入的更多資訊。
