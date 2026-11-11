# 遷移到延遲載入路由

此原理圖能協助開發者把急切載入的元件路由，轉換為延遲載入路由。這能讓建置流程把正式環境的 bundle 拆成更小的區塊，避免產生一個包含所有路由的龐大 JS bundle，對應用程式的頁面初次載入造成負面影響。

使用以下指令執行此原理圖：

<docs-code language="shell">

ng generate @angular/core:route-lazy-loading

</docs-code>

### `path` 設定選項

依預設，遷移會遍歷整個應用程式。如果你想把這項遷移套用到一部分檔案，可以如下所示傳入 path 引數：

<docs-code language="shell">

ng generate @angular/core:route-lazy-loading --path src/app/sub-component

</docs-code>

path 參數的值是專案內的相對路徑。

### 運作方式

此原理圖會嘗試找出應用程式路由定義的所有位置：

- `RouterModule.forRoot` 與 `RouterModule.forChild`
- `Router.resetConfig`
- `provideRouter`
- `provideRoutes`
- 型別為 `Routes` 或 `Route[]` 的變數（例如 `const routes: Routes = [{...}]`）

遷移會檢查路由中的所有元件，確認它們是否為獨立元件且被急切載入；如果是，就會把它們轉換為延遲載入路由。

#### 遷移前

```typescript
// app.module.ts
import {HomeComponent} from './home/home.component';

@NgModule({
  imports: [
    RouterModule.forRoot([
      {
        path: 'home',
        // HomeComponent is standalone and eagerly loaded
        component: HomeComponent,
      },
    ]),
  ],
})
export class AppModule {}
```

#### 遷移後

```typescript
// app.module.ts
@NgModule({
  imports: [
    RouterModule.forRoot([
      {
        path: 'home',
        // ↓ HomeComponent is now lazy loaded
        loadComponent: () => import('./home/home.component').then(m => m.HomeComponent),
      },
    ]),
  ],
})
export class AppModule {}
```

這項遷移還會收集在 NgModules 中宣告的所有元件的資訊，並輸出使用它們的路由清單（包括檔案的對應位置）。你可以考慮把這些元件改為獨立元件，然後再執行一次這項遷移。你可以使用既有的遷移（[請見](reference/migrations/standalone)）把這些元件轉換為獨立元件。
