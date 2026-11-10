# 以 ng-container 將元素分組

`<ng-container>` 是 Angular 中的一個特殊元素，它將多個元素分組在一起，或在範本中標記一個位置，而不會在 DOM 中算繪出真正的元素。

```angular-html
<!-- Component template -->
<section>
  <ng-container>
    <h3>User bio</h3>
    <p>Here's some info about the user</p>
  </ng-container>
</section>
```

```angular-html
<!-- Rendered DOM -->
<section>
  <h3>User bio</h3>
  <p>Here's some info about the user</p>
</section>
```

你可以將指令套用到 `<ng-container>`，為範本的某個部分加入行為或設定。

Angular 會忽略所有套用到 `<ng-container>` 的 attribute 繫結與事件監聽器，包括透過指令套用的那些。

## 使用 `<ng-container>` 顯示動態內容

`<ng-container>` 可以作為算繪動態內容的預留位置。

### 算繪元件

你可以使用 Angular 內建的 `NgComponentOutlet` 指令，將元件動態算繪到 `<ng-container>` 所在的位置。

```angular-ts
@Component({
  template: `
    <h2>Your profile</h2>
    <ng-container [ngComponentOutlet]="profileComponent()" />
  `,
})
export class UserProfile {
  isAdmin = input(false);
  profileComponent = computed(() => (this.isAdmin() ? AdminProfile : BasicUserProfile));
}
```

在上述範例中，`NgComponentOutlet` 指令會將 `AdminProfile` 或 `BasicUserProfile` 動態算繪到 `<ng-container>` 元素所在的位置。

### 算繪範本片段

你可以使用 Angular 內建的 `NgTemplateOutlet` 指令，將範本片段動態算繪到 `<ng-container>` 所在的位置。

```angular-ts
@Component({
  template: `
    <h2>Your profile</h2>
    <ng-container [ngTemplateOutlet]="profileTemplate()" />

    <ng-template #admin>This is the admin profile</ng-template>
    <ng-template #basic>This is the basic profile</ng-template>
  `,
})
export class UserProfile {
  isAdmin = input(false);
  adminTemplate = viewChild('admin', {read: TemplateRef});
  basicTemplate = viewChild('basic', {read: TemplateRef});
  profileTemplate = computed(() => (this.isAdmin() ? this.adminTemplate() : this.basicTemplate()));
}
```

在上述範例中，`ngTemplateOutlet` 指令會將兩個範本片段的其中之一，動態算繪到 `<ng-container>` 元素所在的位置。

如需更多關於 `NgTemplateOutlet` 的資訊，請參閱 [NgTemplateOutlet API 文件頁面](/api/common/NgTemplateOutlet)。

## 將 `<ng-container>` 與結構指令搭配使用

你也可以將結構指令套用到 `<ng-container>` 元素。常見的例子包括 `ngIf` 與 `ngFor`。

```angular-html
<ng-container *ngIf="permissions == 'admin'">
  <h1>Admin Dashboard</h1>
  <admin-infographic />
</ng-container>

<ng-container *ngFor="let item of items; index as i; trackBy: trackByFn">
  <h2>{{ item.title }}</h2>
  <p>{{ item.description }}</p>
</ng-container>
```

## 將 `<ng-container>` 用於注入

如需更多關於 Angular 依賴注入系統的資訊，請參閱[依賴注入指南](/guide/di)。

當你將指令套用到 `<ng-container>` 時，其後代元素可以注入該指令，或該指令提供的任何東西。當你想以宣告方式為範本的特定部分提供某個值時，可以使用這種方式。

```angular-ts
@Directive({
  selector: '[theme]',
})
export class Theme {
  // Create an input that accepts 'light' or 'dark`, defaulting to 'light'.
  mode = input<'light' | 'dark'>('light');
}
```

```angular-html
<ng-container theme="dark">
  <profile-pic />
  <user-bio />
</ng-container>
```

在上述範例中，`ProfilePic` 與 `UserBio` 元件可以注入 `Theme` 指令，並依其 `mode` 套用樣式。
