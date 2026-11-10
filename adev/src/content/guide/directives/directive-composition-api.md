# 指令組合 API

Angular 指令是封裝可重複使用行為的好方法。指令可以為元素套用屬性、CSS 類別與事件監聽器。

_指令組合 API_ 讓你能從元件的 TypeScript 類別內部，將指令套用到元件的宿主元素。

## 為元件加上指令

在元件的裝飾器中加入 `hostDirectives` 屬性，即可為元件套用指令。這類指令稱為_宿主指令_。

在此範例中，`MenuBehavior` 指令被套用到 `AdminMenu` 的宿主元素。其運作方式類似於在範本中把 `MenuBehavior` 套用到 `<admin-menu>` 元素。

```typescript
@Component({
  selector: 'admin-menu',
  template: 'admin-menu.html',
  hostDirectives: [MenuBehavior],
})
export class AdminMenu {}
```

當框架算繪元件時，Angular 也會建立每個宿主指令的執行個體。這些指令的宿主繫結會套用到元件的宿主元素。依預設，宿主指令的輸入與輸出不會公開為元件公開 API 的一部分。詳情請參閱下方的[包含輸入與輸出](#including-inputs-and-outputs)。

**Angular 會在編譯時期靜態套用宿主指令**。你無法在執行時期動態加入指令。

**在 `hostDirectives` 中使用的指令不得指定 `standalone: false`**。

**Angular 會忽略在 `hostDirectives` 屬性中套用的指令的 `selector`**。

## 包含輸入與輸出 {#including-inputs-and-outputs}

當你為元件套用 `hostDirectives` 時，宿主指令的輸入與輸出依預設不會納入元件的 API。你可以展開 `hostDirectives` 中的項目，明確地把輸入與輸出納入元件的 API：

```typescript
@Component({
  selector: 'admin-menu',
  template: 'admin-menu.html',
  hostDirectives: [
    {
      directive: MenuBehavior,
      inputs: ['menuId'],
      outputs: ['menuClosed'],
    },
  ],
})
export class AdminMenu {}
```

明確指定輸入與輸出後，使用帶有 `hostDirectives` 的元件時，就能在範本中繫結這些輸入與輸出：

```angular-html
<admin-menu menuId="top-menu" (menuClosed)="logMenuClosed()"></admin-menu>
```

此外，你可以為宿主指令的輸入與輸出設定別名，藉此自訂元件的 API：

```typescript
@Component({
  selector: 'admin-menu',
  template: 'admin-menu.html',
  hostDirectives: [
    {
      directive: MenuBehavior,
      inputs: ['menuId: id'],
      outputs: ['menuClosed: closed'],
    },
  ],
})
export class AdminMenu {}
```

```angular-html
<admin-menu id="top-menu" (closed)="logMenuClosed()"></admin-menu>
```

## 為另一個指令加上指令

除了元件，你也可以為其他指令加上 `hostDirectives`。這能讓多種行為以遞移方式聚合在一起。

下列範例定義了兩個指令 `Menu` 與 `Tooltip`，再把兩者的行為組合在 `MenuWithTooltip` 中。最後，把 `MenuWithTooltip` 套用到 `SpecializedMenuWithTooltip`。

當 `SpecializedMenuWithTooltip` 在範本中使用時，它會建立 `Menu`、`Tooltip` 與 `MenuWithTooltip` 全部的執行個體。這些指令各自的宿主繫結都會套用到 `SpecializedMenuWithTooltip` 的宿主元素。

```typescript
@Directive({...})
export class Menu { }

@Directive({...})
export class Tooltip { }

// MenuWithTooltip can compose behaviors from multiple other directives
@Directive({
  hostDirectives: [Tooltip, Menu],
})
export class MenuWithTooltip { }

// CustomWidget can apply the already-composed behaviors from MenuWithTooltip
@Directive({
  hostDirectives: [MenuWithTooltip],
})
export class SpecializedMenuWithTooltip { }
```

## 宿主指令的語義 {#host-directive-semantics}

### 指令執行順序

宿主指令的生命週期與直接在範本中使用的元件及指令相同。不過，宿主指令的建構函式、生命週期鉤子與繫結一定會_先於_它所套用的元件或指令執行。

下列範例展示宿主指令的最小用法：

```typescript
@Component({
  selector: 'admin-menu',
  template: 'admin-menu.html',
  hostDirectives: [MenuBehavior],
})
export class AdminMenu {}
```

這裡的執行順序為：

1. 建立 `MenuBehavior` 執行個體
2. 建立 `AdminMenu` 執行個體
3. `MenuBehavior` 接收輸入（`ngOnInit`）
4. `AdminMenu` 接收輸入（`ngOnInit`）
5. `MenuBehavior` 套用宿主繫結
6. `AdminMenu` 套用宿主繫結

這樣的執行順序意味著，帶有 `hostDirectives` 的元件可以覆寫宿主指令所指定的任何宿主繫結。

這種執行順序也適用於巢狀的宿主指令鏈，如下列範例所示。

```typescript
@Directive({...})
export class Tooltip { }

@Directive({
  hostDirectives: [Tooltip],
})
export class CustomTooltip { }

@Directive({
  hostDirectives: [CustomTooltip],
})
export class EvenMoreCustomTooltip { }
```

在上例中，執行順序為：

1. 建立 `Tooltip` 執行個體
2. 建立 `CustomTooltip` 執行個體
3. 建立 `EvenMoreCustomTooltip` 執行個體
4. `Tooltip` 接收輸入（`ngOnInit`）
5. `CustomTooltip` 接收輸入（`ngOnInit`）
6. `EvenMoreCustomTooltip` 接收輸入（`ngOnInit`）
7. `Tooltip` 套用宿主繫結
8. `CustomTooltip` 套用宿主繫結
9. `EvenMoreCustomTooltip` 套用宿主繫結

### 依賴注入

指定了 `hostDirectives` 的元件或指令可以注入這些宿主指令的執行個體，反之亦然。

把宿主指令套用到元件時，元件與宿主指令雙方都可以定義提供者。

如果帶有 `hostDirectives` 的元件或指令與其宿主指令提供了相同的注入權杖，則由帶有 `hostDirectives` 的類別所定義的提供者，優先於宿主指令所定義的提供者。
