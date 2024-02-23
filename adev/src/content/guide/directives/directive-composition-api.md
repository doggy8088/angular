# 指令組合 API

Angular 指令提供了一個封裝可重複使用的行為的絕佳方法 - 指令可以將
屬性、CSS 類別和事件偵聽器應用到元素。

*指令組合 API* 讓您從 *內部* 元件 TypeScript 類別將指令套用至元件的宿主元素。

## 在元件中新增指令

您可以透過將 `hostDirectives` 屬性新增至元件的裝飾器來將指令套用至元件。我們稱此類指令為 *主機指令*。

在此範例中，我們將指令 `MenuBehavior` 套用至 `AdminMenu` 的主機元素。這類似於在範本中將 `MenuBehavior` 套用至 `<admin-menu>` 元素。

```typescript
@Component({
  standalone: true,
  selector: 'admin-menu',
  template: 'admin-menu.html',
  hostDirectives: [MenuBehavior],
})
export class AdminMenu { }
```

當框架呈現元件時，Angular 也會為每個主機指令建立一個實例。
指令的主機繫結套用至元件的主機元素。
預設情況下，主機指令輸入和輸出不會公開為元件的公開 API 的一部分。
請參閱以下 [包括輸入和輸出](#including-inputs-and-outputs) 以獲取更多資訊。

**Angular 在編譯時以靜態方式套用主機指令。**您無法在執行階段動態新增指令。

**在 `hostDirectives` 中使用的指令必須為 `standalone: true`。**

**Angular 會忽略應用在 `hostDirectives` 屬性中的指令的 `selector`。**

## 包括輸入和輸出

當你將 `hostDirectives` 套用至元件時，預設情況下，主機指令的輸入和輸出不會包含在元件的 API 中。你可以透過擴充 `hostDirectives` 中的項目，將輸入和輸出明確包含在元件的 API 中：

```typescript
@Component({
  standalone: true,
  selector: 'admin-menu',
  template: 'admin-menu.html',
  hostDirectives: [{
    directive: MenuBehavior,
    inputs: ['menuId'],
    outputs: ['menuClosed'],
  }],
})
export class AdminMenu { }
```

通過明確指定輸入和輸出，使用者可使用 `hostDirective` 將元件綁定在範本中：

```html

<admin-menu menuId="top-menu" (menuClosed)="logMenuClosed()">
```

此外，您可以從 `hostDirective` 別名輸入和輸出以自訂您的元件 API：

```typescript
@Component({
  standalone: true,
  selector: 'admin-menu',
  template: 'admin-menu.html',
  hostDirectives: [{
    directive: MenuBehavior,
    inputs: ['menuId: id'],
    outputs: ['menuClosed: closed'],
  }],
})
export class AdminMenu { }
```

```html

<admin-menu id="top-menu" (closed)="logMenuClosed()">
```

## 在另一指令添加指令

你也可以將 `hostDirectives` 新增至其他指令，除了元件之外。這啟用了多個行為的遞移聚合。

在以下範例中，我們定義兩個指令，`Menu` 和 `Tooltip`。然後我們在 `MenuWithTooltip` 中組合這兩個指令的行為。最後，我們將 `MenuWithTooltip` 套用至 `SpecializedMenuWithTooltip`。

當在範本中使用 `SpecializedMenuWithTooltip` 時，它會建立所有 `Menu`、`Tooltip` 和 `MenuWithTooltip` 的執行個體。這些指令的每個主機繫結套用到 `SpecializedMenuWithTooltip` 的主機元素。

```typescript
@Directive({...})
export class Menu { }

@Directive({...})
export class Tooltip { }

// MenuWithTooltip can compose behaviors from multiple other directives
@Directive({
  standalone: true,
  hostDirectives: [Tooltip, Menu],
})
export class MenuWithTooltip { }

// CustomWidget can apply the already-composed behaviors from MenuWithTooltip
@Directive({
  standalone: true,
  hostDirectives: [MenuWithTooltip],
})
export class SpecializedMenuWithTooltip { }
```

## 主機指令語義

### 指令執行順序

主機指令的運作週期與直接在範本中使用的元件及指令相同。然而，主機指令總是會先執行他們的建構函數、生命週期掛鉤和繫結，然後才會執行他們所套用的元件或指令。

以下範例顯示主機指令的最低限度使用：

```typescript
@Component({
  standalone: true,
  selector: 'admin-menu',
  template: 'admin-menu.html',
  hostDirectives: [MenuBehavior],
})
export class AdminMenu { }
```

這裡的執行順序是：

1. `MenuBehavior` 實例化
2. `AdminMenu` 實例化
3. `MenuBehavior` 接收輸入 (`ngOnInit`)
4. `AdminMenu` 接收輸入 (`ngOnInit`)
5. `MenuBehavior` 套用主機繫結
6. `AdminMenu` 套用主機繫結

這個運算順序表示具有 `hostDirectives` 的元件可以覆寫由主機指令指定的任何主機繫結。

這項運算順序延伸到主機指令的巢狀鏈，如下例所示。

```typescript
@Directive({...})
export class Tooltip { }

@Directive({
  standalone: true,
  hostDirectives: [Tooltip],
})
export class CustomTooltip { }

@Directive({
  standalone: true,
  hostDirectives: [CustomTooltip],
})
export class EvenMoreCustomTooltip { }
```

在上面的範例中，執行的順序是：

1. `Tooltip` 實例化
2. `CustomTooltip` 實例化
3. `EvenMoreCustomTooltip` 實例化
4. `Tooltip` 接收輸入 (`ngOnInit`)
5. `CustomTooltip` 接收輸入 (`ngOnInit`)
6. `EvenMoreCustomTooltip` 接收輸入 (`ngOnInit`)
7. `Tooltip` 套用主機繫結
8. `CustomTooltip` 套用主機繫結
9. `EvenMoreCustomTooltip` 套用主機繫結

### 相依性注入

指定 `hostDirectives` 的元件或指令可以注入這些主機指令的執行個體，反之亦然。

在將主機指令套用至元件時，元件和主機指令都能定義提供者。

如果一個元件或指令具備 `hostDirectives`，且這些主機指令都提供相同的注入權杖，由具備 `hostDirectives` 的類別定義的提供者優先於由主機指令定義的提供者。

### 效能

雖然指令組合 API 提供了重用常見行為的強大工具，但過度使用主機指令可能會影響應用程式的記憶體使用。如果您建立了使用 *大量* 主機指令的元件或指令，您可能會無意中增加應用程式使用的記憶體。

以下範例顯示套用多個主機指令的元件。

```typescript
@Component({
  standalone: true,
  hostDirectives: [
    DisabledState,
    RequiredState,
    ValidationState,
    ColorState,
    RippleBehavior,
  ],
})
export class CustomCheckbox { }
```

以下範例宣告一個自訂核取方塊元件，其中包含五個主機指令。這表示 Angular 會在每次 `CustomCheckbox` 呈現時建立六個物件，其中一個是元件，其餘則分別對應每個主機指令。如果頁面上只有幾個核取方塊，這不會造成任何重大問題。不過，如果您的頁面會呈現數百個核取方塊，例如在表格中，那麼您可能會開始看到額外物件配置所造成的影響。務必剖析您的應用程式，以確定最適合您使用案例的組合模式。
