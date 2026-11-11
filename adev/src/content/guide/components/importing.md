# 匯入與使用元件

Tip: 本指南假設你已讀過[基礎指南](essentials)。如果你是 Angular 新手，請先閱讀該指南。

Angular 支援兩種讓元件可供其他元件使用的方式：作為獨立元件，或放在 `NgModule` 中。

## 獨立元件 {#standalone-components}

**獨立元件**是在其元件中繼資料中設定 `standalone: true` 的元件。獨立元件會直接匯入其範本中使用的其他元件、指令與管道：

<docs-code language="angular-ts" highlight="[2, [8, 9]]">
@Component({
  standalone: true,
  selector: 'profile-photo',
})
export class ProfilePhoto { }

@Component({
  standalone: true,
  imports: [ProfilePhoto],
  template: `<profile-photo />`
})
export class UserProfile { }
</docs-code>

獨立元件可以直接匯入到其他獨立元件中。

Angular 團隊建議所有新開發都使用獨立元件。

## NgModules {#ngmodules}

早於獨立元件出現的 Angular 程式碼，使用 `NgModule` 作為匯入與使用其他元件的機制。詳情請參閱完整的 [`NgModule` 指南](guide/ngmodules)。
