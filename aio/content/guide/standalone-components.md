# 開始使用獨立元件

**獨立元件**提供更簡化的方式來建置 Angular 應用程式。獨立元件、指令與管道旨在減少對 `NgModule` 的需求，簡化撰寫體驗。現有的應用程式可以選擇性地逐步採用新的獨立風格，不會造成任何破壞性變更。

## 建立獨立元件

<iframe width="560" height="315" src="https://www.youtube.com/embed/x5PZwb4XurU" title="YouTube video player" frameborder="0" allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

### `standalone` 旗標與元件 `imports`

元件、指令與管道現在可以標記為 `standalone: true`。標記為獨立的 Angular 類別不需要在 `NgModule` 中宣告（如果你嘗試這麼做，Angular 編譯器會回報錯誤）。

獨立元件會直接指定自己的依賴，而不是透過 `NgModule` 取得。例如，如果 `PhotoGalleryComponent` 是獨立元件，它可以直接匯入另一個獨立元件 `ImageGridComponent`：

```ts
@Component({
  standalone: true,
  selector: 'photo-gallery',
  imports: [ImageGridComponent],
  template: `
    ... <image-grid [images]="imageList"></image-grid>
  `,
})
export class PhotoGalleryComponent {
  // component logic
}
```

`imports` 也可以用來參照獨立的指令與管道。如此一來，撰寫獨立元件時就不需要建立 `NgModule` 來管理範本依賴。

### 在獨立元件中使用現有的 NgModule

撰寫獨立元件時，你可能會想在元件範本中使用其他元件、指令或管道。其中某些依賴可能沒有標記為獨立，而是由現有的 `NgModule` 宣告並匯出。在這種情況下，你可以直接把該 `NgModule` 匯入獨立元件：

```ts
@Component({
  standalone: true,
  selector: 'photo-gallery',
  // an existing module is imported directly into a standalone component
  imports: [MatButtonModule],
  template: `
    ...
    <button mat-button>Next Page</button>
  `,
})
export class PhotoGalleryComponent {
  // logic
}
```

你可以在範本中搭配現有的 `NgModule` 式程式庫或依賴使用獨立元件。獨立元件可以充分利用現有的 Angular 程式庫生態系。

## 在以 NgModule 為基礎的應用程式中使用獨立元件

獨立元件也可以匯入現有的 NgModule 式環境。這讓現有的應用程式（目前正在使用 NgModule）可以逐步採用新的獨立風格元件。

你可以像匯入 `NgModule` 一樣匯入獨立元件（或指令、管道），也就是使用 `NgModule.imports`：

```ts
@NgModule({
  declarations: [AlbumComponent],
  exports: [AlbumComponent], 
  imports: [PhotoGalleryComponent],
})
export class AlbumModule {}
```

## 使用獨立元件啟動應用程式

使用獨立元件作為應用程式的根元件，就可以在沒有任何 `NgModule` 的情況下啟動 Angular 應用程式。這是透過 `bootstrapApplication` API 完成的：

```ts
// in the main.ts file
import {bootstrapApplication} from '@angular/platform-browser';
import {PhotoAppComponent} from './app/photo.app.component';

bootstrapApplication(PhotoAppComponent);
```

### 設定依賴注入

啟動應用程式時，你通常會想設定 Angular 的依賴注入，並提供設定值或服務，供整個應用程式使用。你可以把這些作為 providers 傳給 `bootstrapApplication`：

```ts
bootstrapApplication(PhotoAppComponent, {
  providers: [
    {provide: BACKEND_URL, useValue: 'https://photoapp.looknongmodules.com/api'},
    // ...
  ]
});
```

獨立啟動操作是基於為依賴注入明確設定一份 `Provider` 清單。在 Angular 中，可以使用 `provide` 前綴的函式來設定不同的系統，而不需要匯入 NgModule。例如，`provideRouter` 可取代 `RouterModule.forRoot` 來設定路由器：

```ts
bootstrapApplication(PhotoAppComponent, {
  providers: [
    {provide: BACKEND_URL, useValue: 'https://photoapp.looknongmodules.com/api'},
    provideRouter([/* app routes */]),
    // ...
  ]
});
```

許多第三方程式庫也已更新，支援這種 `provide` 函式設定模式。如果某個程式庫只提供 NgModule API 來設定 DI，你仍可使用 `importProvidersFrom` 工具程式，搭配 `bootstrapApplication` 與其他獨立環境使用它：

```ts
import {LibraryModule} from 'ngmodule-based-library';

bootstrapApplication(PhotoAppComponent, {
  providers: [
    {provide: BACKEND_URL, useValue: 'https://photoapp.looknongmodules.com/api'},
    importProvidersFrom(
      LibraryModule.forRoot()
    ),
  ]
});
```

## 路由與延遲載入

路由器 API 已更新並簡化，以善用獨立元件：在許多常見的延遲載入情境中，不再需要 `NgModule`。

### 延遲載入獨立元件

任何路由都可以使用 `loadComponent`，延遲載入其對應的獨立元件：

```ts
export const ROUTES: Route[] = [
  {path: 'admin', loadComponent: () => import('./admin/panel.component').then(mod => mod.AdminPanelComponent)},
  // ...
];
```

只要載入的元件是獨立元件，這種做法就能運作。

### 一次延遲載入多個路由

`loadChildren` 操作現在支援載入一組新的子 `Route`，而不需要撰寫一個匯入 `RouterModule.forChild` 來宣告路由的延遲載入 `NgModule`。當以這種方式載入的每個路由都使用獨立元件時，這種做法就能運作。

```ts
// In the main application:
export const ROUTES: Route[] = [
  {path: 'admin', loadChildren: () => import('./admin/routes').then(mod => mod.ADMIN_ROUTES)},
  // ...
];

// In admin/routes.ts:
export const ADMIN_ROUTES: Route[] = [
  {path: 'home', component: AdminHomeComponent},
  {path: 'users', component: AdminUsersComponent},
  // ...
];
```

### 延遲載入與預設匯出

使用 `loadChildren` 與 `loadComponent` 時，路由器能夠理解並自動解開帶有 `default` 匯出的動態 `import()` 呼叫。你可以利用這一點，在這類延遲載入操作中省略 `.then()`。

```ts
// In the main application:
export const ROUTES: Route[] = [
  {path: 'admin', loadChildren: () => import('./admin/routes')},
  // ...
];

// In admin/routes.ts:
export default [
  {path: 'home', component: AdminHomeComponent},
  {path: 'users', component: AdminUsersComponent},
  // ...
] as Route[];
```

### 為部分路由提供服務

`NgModule` 的延遲載入 API（`loadChildren`）在載入某個路由的延遲載入子路由時，會建立一個新的「模組」注入器。這項功能常常用來只為應用程式中的部分路由提供服務。例如，如果 `/admin` 下的所有路由都以 `loadChildren` 邊界劃分範圍，那麼僅限管理員使用的服務就只會提供給那些路由。即使相關路由根本不需要延遲載入，也必須使用 `loadChildren` API 才能做到這一點。

路由器現在支援在 `Route` 上明確指定額外的 `providers`，這樣一來，不需要延遲載入或 `NgModule` 也能做到同樣的範圍劃分。例如，在 `/admin` 路由結構中設定範圍限定的服務，看起來會像這樣：

```ts
export const ROUTES: Route[] = [
  {
    path: 'admin',
    providers: [
      AdminService,
      {provide: ADMIN_API_KEY, useValue: '12345'},
    ],
    children: [
      {path: 'users', component: AdminUsersComponent},
      {path: 'teams', component: AdminTeamsComponent},
    ],
  },
  // ... other application routes that don't
  //     have access to ADMIN_API_KEY or AdminService.
];
```

也可以把 `providers` 與額外路由設定的 `loadChildren` 結合使用，達到與延遲載入一個帶有額外路由與路由層級 providers 的 `NgModule` 相同的效果。以下範例設定的 providers／子路由與上面相同，但放在延遲載入邊界之後：

```ts
// Main application:
export const ROUTES: Route[] = {
  // Lazy-load the admin routes.
  {path: 'admin', loadChildren: () => import('./admin/routes').then(mod => mod.ADMIN_ROUTES)},
  // ... rest of the routes
}

// In admin/routes.ts:
export const ADMIN_ROUTES: Route[] = [{
  path: '',
  pathMatch: 'prefix',
  providers: [
    AdminService,
    {provide: ADMIN_API_KEY, useValue: 12345},
  ],
  children: [
    {path: 'users', component: AdminUsersCmp},
    {path: 'teams', component: AdminTeamsCmp},
  ],
}];
```

請注意，這裡使用了一個空路徑路由，來承載所有子路由共用的 `providers`。

`importProvidersFrom` 也可用來把現有的 NgModule 式 DI 設定匯入路由的 `providers`。

## 進階主題

本節會深入探討僅與較進階用法相關的細節。第一次學習獨立元件、指令與管道時，可以放心跳過本節。

### 供程式庫作者使用的獨立元件

獨立元件、指令與管道可以從匯入它們的 `NgModule` 中匯出：

```ts
@NgModule({
  imports: [ImageCarouselComponent, ImageSlideComponent],
  exports: [ImageCarouselComponent, ImageSlideComponent],
})
export class CarouselModule {}
```

這個模式適用於發布一組協作指令的 Angular 程式庫。在上述範例中，`ImageCarouselComponent` 與 `ImageSlideComponent` 都必須出現在範本中，才能組成一個邏輯上的「carousel widget」。

除了發布 `NgModule` 之外，程式庫作者也可以選擇匯出一個協作指令的陣列：

```ts
export const CAROUSEL_DIRECTIVES = [ImageCarouselComponent, ImageSlideComponent] as const;
```

使用 `NgModule` 的應用程式可以匯入這樣的陣列，並加入 `@NgModule.imports`。請注意 TypeScript 的 `as const` 寫法：它能提供 Angular 編譯器正確編譯所需的額外資訊，也是一項建議的做法（因為從 TypeScript 的角度來看，它讓匯出的陣列成為不可變的）。

### 依賴注入與注入器階層

Angular 應用程式可以透過指定一組可用的 providers 來設定依賴注入。在典型的應用程式中，有兩種不同的注入器類型：

*   **模組注入器**，其 providers 設定於 `@NgModule.providers` 或 `@Injectable({providedIn: "..."})`。這些應用程式層級的 providers 對所有元件都可見，也對模組注入器中設定的其他服務可見。
*   **節點注入器**，設定於 `@Directive.providers`／`@Component.providers` 或 `@Component.viewProviders`。這些 providers 僅對指定的元件及其所有子元件可見。

<a id="environment-injectors"></a>
#### 環境注入器

讓 `NgModule` 成為可選的，將需要新的方式來設定帶有應用程式層級 providers 的「模組」注入器（例如 [HttpClient](https://angular.io/api/common/http/HttpClient)）。在獨立應用程式（也就是以 `bootstrapApplication` 建立的應用程式）中，「模組」providers 可以在啟動過程中，於 `providers` 選項中設定：

```ts
bootstrapApplication(PhotoAppComponent, {
  providers: [
    {provide: BACKEND_URL, useValue: 'https://photoapp.looknongmodules.com/api'},
    {provide: PhotosService, useClass: PhotosService},
    // ...
  ]
});
```

新的啟動 API 讓我們重新獲得了不使用 `NgModule` 也能設定「模組注入器」的方法。從這個意義上說，名稱中的「模組」部分已不再貼切，因此我們決定引入一個新術語：「環境注入器」。

環境注入器可以透過下列其中一種方式設定：

*   `@NgModule.providers`（在透過 `NgModule` 啟動的應用程式中）；
*   `@Injectable({provideIn: "..."})`（在 NgModule 式與「獨立」應用程式中皆可）；
*   `bootstrapApplication` 呼叫中的 `providers` 選項（在完全「獨立」的應用程式中）；
*   `Route` 設定中的 `providers` 欄位。

Angular v14 引入了新的 TypeScript 型別 `EnvironmentInjector` 來代表這個新名稱。隨附的 `createEnvironmentInjector` API 讓我們能以程式化方式建立環境注入器：

```ts
import {createEnvironmentInjector} from '@angular/core';

const parentInjector = … // existing environment injector
const childInjector = createEnvironmentInjector([{provide: PhotosService, useClass: CustomPhotosService}], parentInjector);
```

環境注入器還有一項額外能力：它們可以在環境注入器建立時執行初始化邏輯（類似於模組注入器建立時會執行的 `NgModule` 建構函式）：

```ts
import {createEnvironmentInjector, ENVIRONMENT_INITIALIZER} from '@angular/core';

createEnvironmentInjector([
{provide: PhotosService, useClass: CustomPhotosService},
{provide: ENVIRONMENT_INITIALIZER, useValue: () => {
        console.log("This function runs when this EnvironmentInjector gets created");
}}
]);
```

#### 獨立注入器

實際上，在使用獨立元件的應用程式中，依賴注入器的階層會稍微複雜一些。讓我們來看以下範例：

```ts
// an existing "datepicker" component with an NgModule
@Component({
        selector: 'datepicker',
        template: '...',
})
class DatePickerComponent {
  constructor(private calendar: CalendarService) {}
}

@NgModule({
        declarations: [DatePickerComponent],
        exports: [DatePickerComponent]
        providers: [CalendarService],
})
class DatePickerModule {
}

@Component({
        selector: 'date-modal',
        template: '<datepicker></datepicker>',
        standalone: true,
        imports: [DatePickerModule]
})
class DateModalComponent {
}
```

在上述範例中，元件 `DateModalComponent` 是獨立的——它可以直接使用，不需要匯入任何 NgModule 才能使用。然而，`DateModalComponent` 有一個依賴，也就是 `DatePickerComponent,` 它是透過其 NgModule（`DatePickerModule`）匯入的。這個 NgModule 可能會宣告 `DatePickerComponent` 正常運作所需的 providers（在這個案例中是 `CalendarService`）。

當 Angular 建立獨立元件時，它需要知道目前的注入器擁有該獨立元件的依賴所需的全部服務，包括那些以 NgModule 為基礎的依賴。為了確保這一點，在某些情況下，Angular 會建立一個新的「獨立注入器」，作為目前環境注入器的子注入器。目前，所有透過啟動建立的獨立元件都會發生這種情況：它會是根環境注入器的子注入器。同樣的規則也適用於動態建立的獨立元件（例如由路由器或 `ViewContainerRef` API 建立的元件）。

建立一個獨立的獨立注入器，是為了確保獨立元件匯入的 providers 與應用程式其餘部分「隔離」。這讓我們可以把獨立元件視為真正自成一體的單元，不會把其實作細節「洩漏」給應用程式的其他部分。

