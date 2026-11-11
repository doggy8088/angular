# 以建構子為基礎的依賴注入

在先前的練習中，你使用 `inject()` 函式讓資源可供使用，將它們「提供」給你的元件。`inject()` 函式是其中一種模式，而且值得知道的是，還有另一種注入資源的模式，稱為以建構子為基礎的依賴注入。

你把資源指定為元件 `constructor` 函式的參數。Angular 會讓這些資源可供你的元件使用。
<br><br>
在這個練習中，你將學習如何使用以建構子為基礎的依賴注入。

<hr>

要將服務或其他可注入的資源注入你的元件，請使用以下語法：

<docs-code language="ts" highlight="[3]">
@Component({...})
class PetCarDashboardComponent {
    constructor(private petCareService: PetCareService) {
        ...
    }
}
</docs-code>

這裡有幾件事要留意：

- 使用 `private` 關鍵字
- `petCareService` 會成為你可以在類別中使用的屬性
- `PetCareService` 類別是被注入的類別

好了，現在換你來試試看：

<docs-workflow>

<docs-step title="更新程式碼，改用以建構子為基礎的 DI">

在 `app.component.ts` 中，更新建構子程式碼，讓它與以下程式碼相符：

Tip: 記住，如果你卡住了，可以參考這個練習頁面上的範例。

```ts
constructor(private carService: CarService) {
    this.display = this.carService.getCars().join(' ⭐️ ');
}
```

</docs-step>

</docs-workflow>

恭喜你完成這個練習。範例程式碼的運作方式與使用 `inject` 函式時相同。雖然這兩種方法大致上相同，但仍有一些細微的差異，超出本教學的範圍。

<br>

你可以在 [Angular 文件](guide/di) 中找到更多關於依賴注入的資訊。
