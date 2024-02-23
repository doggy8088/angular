# 透過 `@Input` 進行元件溝通`

有時應用程式開發需要您將資料傳送至元件。此資料可讓元件自訂或將資訊從父元件傳送至子元件。

Angular 使用一個名為 `Input` 的概念。這類似於其他框架中的 `props`。要建立 `Input` 屬性，請使用 `@Input` 裝飾器。

在這個活動中，您將會學習如何使用 `@Input` 裝飾器將資訊傳送至元件。

<hr>

如要建立一個 `Input` 屬性，請將 `@Input` 裝飾器新增至元件類別的屬性：

<docs-code header="user.component.ts" language="ts">
class UserComponent {
  @Input() occupation = '';
}
</docs-code>

當您準備好透過 `Input` 傳遞值時，可以使用屬性語法在範本中設定值。以下是一個範例：

<docs-code header="app.component.ts" language="ts" highlight="[3]">
@Component({
  ...
  template: `<app-user occupation="Angular Developer"><app-user/>`
})
class AppComponent {}
</docs-code>

<docs-workflow>

<docs-step title="定義 `@Input` 屬性">
更新 `user.component.ts` 中的程式碼，為 `UserComponent` 定義一個名為 `name` 的 `Input` 屬性。目前請將初始值設定為 `empty string`。務必更新範本，以便在句尾插入 `name` 屬性。
</docs-step>

<docs-step title="將值傳遞給 `@Input` 屬性">
更新 `app.component.ts` 中的程式碼，以傳送 `name` 屬性，其值為 `"Simran"`。
<br>

當程式碼成功更新後，應用程式將會顯示 `使用者的名稱是 Simran`。
</docs-step>

</docs-workflow>

雖然這很好，但這只是元件通訊的一個方向。如果您想要從子元件傳送資訊和資料給父元件，該怎麼辦？檢視下一課以瞭解。

P.S. 你做得很好 - 繼續加油 🎉

