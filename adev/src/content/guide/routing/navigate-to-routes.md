# 導覽至路由

RouterLink 指令是 Angular 宣告式的導覽做法。它讓你能使用標準的錨點元素（`<a>`），並與 Angular 的路由系統無縫整合。

## 如何使用 RouterLink

與其使用帶有 `href` 屬性的一般錨點元素 `<a>`，不如加入帶有適當路徑的 RouterLink 指令，以善用 Angular 路由。

```angular-ts
import {RouterLink} from '@angular/router';
@Component({
  template: `
    <nav>
      <a routerLink="/user-profile">User profile</a>
      <a routerLink="/settings">Settings</a>
    </nav>
  `
  imports: [RouterLink],
  ...
})
export class App {}
```

### 使用絕對連結或相對連結

Angular 路由中的**相對 URL**，讓你能相對於目前路由的位置來定義導覽路徑。相較之下，**絕對 URL** 包含帶有通訊協定（例如 `http://`）的完整路徑，以及**根網域**（例如 `google.com`）。

```angular-html
<!-- Absolute URL -->
<a href="https://www.angular.dev/essentials">Angular Essentials Guide</a>

<!-- Relative URL -->
<a href="/essentials">Angular Essentials Guide</a>
```

在這個範例中，第一個範例明確定義了 essentials 頁面的完整路徑，包含通訊協定（即 `https://`）與根網域（即 `angular.dev`）。相較之下，第二個範例假設使用者已經位於 `/essentials` 的正確根網域上。

一般而言，相對 URL 較受青睞，因為它們在不同應用程式之間更容易維護，不需要知道自己在路由階層中的絕對位置。

### 相對 URL 如何運作

Angular 路由有兩種定義相對 URL 的語法：字串與陣列。

```angular-html
<!-- Navigates user to /dashboard -->
<a routerLink="dashboard">Dashboard</a>
<a [routerLink]="['dashboard']">Dashboard</a>
```

HELPFUL: 傳入字串是定義相對 URL 最常見的方式。

當你需要在相對 URL 中定義動態參數時，請使用陣列語法：

```angular-html
<a [routerLink]="['user', currentUserId]">Current User</a>
```

此外，Angular 路由允許你根據相對路徑是否以斜線（`/`）開頭，來指定路徑是相對於目前的 URL，還是相對於根網域。

例如，如果使用者位於 `example.com/settings`，以下是針對不同情境定義相對路徑的方式：

```angular-html
<!-- Navigates to /settings/notifications -->
<a routerLink="notifications">Notifications</a>
<a routerLink="/settings/notifications">Notifications</a>

<!-- Navigates to /team/:teamId/user/:userId -->
<a routerLink="/team/123/user/456">User 456</a>
<a [routerLink]="['/team', teamId, 'user', userId]">Current User</a>”
```

## 以程式化方式導覽至路由

雖然 `RouterLink` 負責處理範本中的宣告式導覽，Angular 也提供程式化導覽，適用於需要根據邏輯、使用者動作或應用程式狀態來導覽的情境。透過注入 `Router`，你可以在 TypeScript 程式碼中動態導覽至各個路由、傳遞參數，並控制導覽行為。

### `router.navigate()`

你可以使用 `router.navigate()` 方法，透過指定 URL 路徑陣列，以程式化方式在路由之間導覽。

```angular-ts
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  template: `
    <button (click)="navigateToProfile()">View Profile</button>
  `
})
export class AppDashboard {
  private router = inject(Router);

  navigateToProfile() {
    // Standard navigation
    this.router.navigate(['/profile']);

    // With route parameters
    this.router.navigate(['/users', userId]);

    // With query parameters
    this.router.navigate(['/search'], {
      queryParams: { category: 'books', sort: 'price' }
    });

    // With matrix parameters
    this.router.navigate(['/products', { featured: true, onSale: true }]);
  }
}
```

`router.navigate()` 同時支援簡單與複雜的路由情境，讓你能傳遞路由參數、[查詢參數](/guide/routing/read-route-state#query-parameters)，並控制導覽行為。

你也可以使用 `relativeTo` 選項，相對於你的元件在路由樹中的位置，來建立動態導覽路徑。

```angular-ts
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-user-detail',
  template: `
    <button (click)="navigateToEdit()">Edit User</button>
    <button (click)="navigateToParent()">Back to List</button>
  `
})
export class UserDetailComponent {
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  constructor() {}

  // Navigate to a sibling route
  navigateToEdit() {
    // From: /users/123
    // To:   /users/123/edit
    this.router.navigate(['edit'], { relativeTo: this.route });
  }

  // Navigate to parent
  navigateToParent() {
    // From: /users/123
    // To:   /users
    this.router.navigate(['..'], { relativeTo: this.route });
  }
}
```

### `router.navigateByUrl()`

`router.navigateByUrl()` 方法提供了一種直接的方式，使用 URL 路徑字串（而非陣列區段）以程式化方式導覽。當你擁有完整的 URL 路徑並需要執行絕對導覽時，這個方法非常理想，特別是在處理外部提供的 URL，或深層連結的情境時。

```ts
// Standard route navigation
router.navigateByUrl('/products);

// Navigate to nested route
router.navigateByUrl('/products/featured');

// Complete URL with parameters and fragment
router.navigateByUrl('/products/123?view=details#reviews');

// Navigate with query parameters
router.navigateByUrl('/search?category=books&sortBy=price');

// With matrix parameters
router.navigateByUrl('/sales-awesome;isOffer=true;showModal=false')
```

如果你需要在瀏覽歷史中取代目前的 URL，`navigateByUrl` 也接受一個帶有 `replaceUrl` 選項的設定物件。

```ts
// Replace current URL in history
router.navigateByUrl('/checkout', {
  replaceUrl: true
});
```

## 後續步驟

了解如何[讀取路由狀態](/guide/routing/read-route-state)，以建立反應敏捷且具上下文感知能力的元件。
