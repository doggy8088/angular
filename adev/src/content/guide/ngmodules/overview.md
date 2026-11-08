# NgModules

IMPORTANT: Angular 團隊建議所有新程式碼都使用[獨立元件](guide/components)，而不是 `NgModule`。請透過本指南了解以 `@NgModule` 建置的既有程式碼。

NgModule 是以 `@NgModule` 裝飾器標記的類別。這個裝飾器接受的中繼資料（metadata）會告訴 Angular 如何編譯元件範本，以及如何設定依賴注入。

```typescript
import {NgModule} from '@angular/core';

@NgModule({
  // Metadata goes here
})
export class CustomMenuModule {}
```

NgModule 有兩項主要職責：

- 宣告屬於該 NgModule 的元件、指令與管道
- 將提供者加入注入器，供匯入該 NgModule 的元件、指令與管道使用

## Declarations

`@NgModule` 中繼資料的 `declarations` 屬性，宣告屬於該 NgModule 的元件、指令與管道。

```typescript
@NgModule({
  /* ... */
  // CustomMenu and CustomMenuItem are components.
  declarations: [CustomMenu, CustomMenuItem],
})
export class CustomMenuModule {}
```

在上例中，`CustomMenu` 與 `CustomMenuItem` 這兩個元件屬於 `CustomMenuModule`。

`declarations` 屬性也可以接受由元件、指令與管道組成的陣列。這些陣列本身也可以再包含其他陣列。

```typescript
const MENU_COMPONENTS = [CustomMenu, CustomMenuItem];
const WIDGETS = [MENU_COMPONENTS, CustomSlider];

@NgModule({
  /* ... */
  // This NgModule declares all of CustomMenu, CustomMenuItem,
  // CustomSlider, and CustomCheckbox.
  declarations: [WIDGETS, CustomCheckbox],
})
export class CustomMenuModule {}
```

如果 Angular 發現有元件、指令或管道被宣告在一個以上的 NgModule 中，就會回報錯誤。

任何元件、指令或管道都必須明確標記為 `standalone: false`，才能宣告在 NgModule 中。

```typescript
@Component({
  // Mark this component as `standalone: false` so that it can be declared in an NgModule.
  standalone: false,
  /* ... */
})
export class CustomMenu {
  /* ... */
}
```

### imports

宣告在 NgModule 中的元件，可能會依賴其他元件、指令與管道。請將這些相依性加入 `@NgModule` 中繼資料的 `imports` 屬性。

```typescript
@NgModule({
  /* ... */
  // CustomMenu and CustomMenuItem depend on the PopupTrigger and SelectorIndicator components.
  imports: [PopupTrigger, SelectionIndicator],
  declarations: [CustomMenu, CustomMenuItem],
})
export class CustomMenuModule {}
```

`imports` 陣列可以接受其他 NgModule，以及獨立元件、指令與管道。

### exports

NgModule 可以匯出（export）它所宣告的元件、指令與管道，讓其他元件與 NgModule 也能使用它們。

```typescript
@NgModule({
  imports: [PopupTrigger, SelectionIndicator],
  declarations: [CustomMenu, CustomMenuItem],

  // Make CustomMenu and CustomMenuItem available to
  // components and NgModules that import CustomMenuModule.
  exports: [CustomMenu, CustomMenuItem],
})
export class CustomMenuModule {}
```

不過，`exports` 屬性不限於宣告的內容。NgModule 也可以匯出它所匯入的任何其他元件、指令、管道與 NgModule。

```typescript
@NgModule({
  imports: [PopupTrigger, SelectionIndicator],
  declarations: [CustomMenu, CustomMenuItem],

  // Also make PopupTrigger available to any component or NgModule that imports CustomMenuModule.
  exports: [CustomMenu, CustomMenuItem, PopupTrigger],
})
export class CustomMenuModule {}
```

## `NgModule` providers

TIP: 有關依賴注入與提供者的資訊，請參閱[依賴注入指南](guide/di)。

`NgModule` 可以為注入的相依性指定 `providers`。這些提供者可供下列目標使用：

- 任何匯入該 NgModule 的獨立元件、指令或管道，以及
- 任何匯入該 NgModule 的其他 NgModule 的 `declarations` 與 `providers`。

```typescript
@NgModule({
  imports: [PopupTrigger, SelectionIndicator],
  declarations: [CustomMenu, CustomMenuItem],

  // Provide the OverlayManager service
  providers: [OverlayManager],
  /* ... */
})
export class CustomMenuModule {}

@NgModule({
  imports: [CustomMenuModule],
  declarations: [UserProfile],
  providers: [UserDataClient],
})
export class UserProfileModule {}
```

在上例中：

- `CustomMenuModule` 提供了 `OverlayManager`。
- `CustomMenu` 與 `CustomMenuItem` 元件可以注入 `OverlayManager`，因為它們宣告在 `CustomMenuModule` 中。
- `UserProfile` 可以注入 `OverlayManager`，因為它的 NgModule 匯入了 `CustomMenuModule`。
- `UserDataClient` 可以注入 `OverlayManager`，因為它的 NgModule 匯入了 `CustomMenuModule`。

### The `forRoot` and `forChild` pattern

有些 NgModule 會定義靜態的 `forRoot` 方法，接受一些設定並回傳一組提供者。「`forRoot`」這個名稱是一種慣例，表示這些提供者應該在啟動（bootstrap）時，專門加入應用程式的根部（root）。

以這種方式加入的任何提供者都會被積極載入（eagerly loaded），進而增加初始頁面載入時的 JavaScript 套件大小。

```typescript
bootstrapApplication(MyApplicationRoot, {
  providers: [CustomMenuModule.forRoot(/* some config */)],
});
```

同樣地，有些 NgModule 可能會定義靜態的 `forChild`，表示這些提供者應該加入應用程式階層中的元件。

```typescript
@Component({
  /* ... */
  providers: [CustomMenuModule.forChild(/* some config */)],
})
export class UserProfile {
  /* ... */
}
```

## Bootstrapping an application

IMPORTANT: Angular 團隊建議所有新程式碼都使用 [bootstrapApplication](api/platform-browser/bootstrapApplication)，而不是 `bootstrapModule`。請透過本指南了解以 `@NgModule` 啟動的既有應用程式。

`@NgModule` 裝飾器接受一個可選的 `bootstrap` 陣列，其中可以包含一個或多個元件。

你可以使用 [`platformBrowser`](api/platform-browser/platformBrowser) 或 [`platformServer`](api/platform-server/platformServer) 的 [`bootstrapModule`](/api/core/PlatformRef#bootstrapModule) 方法來啟動 Angular 應用程式。執行時，這個函式會在頁面上找出 CSS 選取器與所列元件相符的元素，並在頁面上渲染這些元件。

```typescript
import {platformBrowser} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

@NgModule({
  bootstrap: [MyApplication],
})
export class MyApplicationModule {}

platformBrowser().bootstrapModule(MyApplicationModule);
```

列在 `bootstrap` 中的元件會自動包含在 NgModule 的宣告中。

當你從 NgModule 啟動應用程式時，該模組收集到的 `providers`，以及它所有 `imports` 的 `providers`，都會被積極載入，並可供整個應用程式注入使用。
