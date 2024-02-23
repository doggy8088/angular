# 匯入和使用元件

提示：本指南假設您已經閱讀過 [精華指南](essentials)。如果您是 Angular 新手，請先閱讀該指南。

Angular 支援兩種方式讓其他元件使用元件：當作獨立元件或在 `NgModule` 中。

## 獨立元件

A **獨立元件** 是在元件的元資料中設定 `standalone: true` 的元件。
獨立元件直接匯入其範本中使用的其他元件、指令和管道：

<docs-code language="ts" highlight="[2, [8, 9]]">
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

獨立元件可以直接匯入到其他獨立元件。

Angular 團隊建議將獨立元件用於所有新開發。

## NgModules

在獨立元件之前編寫的 Angular 程式碼會使用 `NgModule` 作為匯入和使用其他元件的機制。請參閱完整的 [`NgModule` 指南](guide/ngmodules) 以了解詳情。
