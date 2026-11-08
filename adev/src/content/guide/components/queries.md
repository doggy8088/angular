# 使用查詢參照元件子元素

TIP: 本指南假設你已讀過[基礎指南](essentials)。如果你是 Angular 新手，請先讀該指南。

元件可以定義**查詢**，用來尋找子元素並從其 injector 中讀取值。

開發者最常用查詢來取得子元件、指令、DOM 元素等的參照。

所有查詢函式都會傳回訊號，反映最新的結果。你可以透過呼叫訊號函式來讀取結果，包括在 `computed` 與 `effect` 等[反應式情境](guide/signals#reactive-contexts)中。

查詢分為兩類：**檢視查詢**與**內容查詢**。

## 檢視查詢

檢視查詢會從元件_檢視_中的元素取得結果，也就是在元件自身範本中定義的元素。你可以使用 `viewChild` 函式查詢單一結果。

```angular-ts {highlight: [14, 15]}
@Component({
  selector: 'custom-card-header',
  /*...*/
})
export class CustomCardHeader {
  text: string;
}

@Component({
  selector: 'custom-card',
  template: '<custom-card-header>Visit sunny California!</custom-card-header>',
})
export class CustomCard {
  header = viewChild(CustomCardHeader);
  headerText = computed(() => this.header()?.text);
}
```

在這個範例中，`CustomCard` 元件查詢子元件 `CustomCardHeader`，並在 `computed` 中使用其結果。

如果查詢找不到結果，它的值會是 `undefined`。當目標元素被 `@if` 隱藏時，就可能發生這種情況。Angular 會隨著應用程式狀態的變更，讓 `viewChild` 的結果保持最新。

你也可以使用 `viewChildren` 函式查詢多個結果。

```angular-ts {highlight: [17]}
@Component({
  selector: 'custom-card-action',
  /*...*/
})
export class CustomCardAction {
  text: string;
}

@Component({
  selector: 'custom-card',
  template: `
    <custom-card-action>Save</custom-card-action>
    <custom-card-action>Cancel</custom-card-action>
  `,
})
export class CustomCard {
  actions = viewChildren(CustomCardAction);
  actionsTexts = computed(() => this.actions().map((action) => action.text));
}
```

`viewChildren` 會建立一個訊號，其中包含查詢結果的 `Array`。

**查詢永遠不會穿透元件邊界**。檢視查詢只能從元件的範本中取得結果。

## 內容查詢

內容查詢會從元件_內容_中的元素取得結果，也就是在該元件被使用的範本中、巢狀置於元件內的元素。你可以使用 `contentChild` 函式查詢單一結果。

```angular-ts {highlight: [14, 15]}
@Component({
  selector: 'custom-toggle',
  /*...*/
})
export class CustomToggle {
  text: string;
}

@Component({
  selector: 'custom-expando',
  /* ... */
})
export class CustomExpando {
  toggle = contentChild(CustomToggle);
  toggleText = computed(() => this.toggle()?.text);
}

@Component({
  /* ... */
  // CustomToggle is used inside CustomExpando as content.
  template: `
    <custom-expando>
      <custom-toggle>Show</custom-toggle>
    </custom-expando>
  `,
})
export class UserProfile {}
```

如果查詢找不到結果，它的值會是 `undefined`。當目標元素不存在或被 `@if` 隱藏時，就可能發生這種情況。Angular 會隨著應用程式狀態的變更，讓 `contentChild` 的結果保持最新。

依預設，`contentChild` 查詢會遍歷至後代元素，而 `contentChildren` 查詢只會尋找_直接_子元素。請參閱[內容後代](#content-descendants)。

你也可以使用 `contentChildren` 函式查詢多個結果。

```angular-ts {highlight: [14, 15]}
@Component({
  selector: 'custom-menu-item',
  /*...*/
})
export class CustomMenuItem {
  text: string;
}

@Component({
  selector: 'custom-menu',
  /*...*/
})
export class CustomMenu {
  items = contentChildren(CustomMenuItem);
  itemTexts = computed(() => this.items().map((item) => item.text));
}

@Component({
  selector: 'user-profile',
  template: `
    <custom-menu>
      <custom-menu-item>Cheese</custom-menu-item>
      <custom-menu-item>Tomato</custom-menu-item>
    </custom-menu>
  `,
})
export class UserProfile {}
```

`contentChildren` 會建立一個訊號，其中包含查詢結果的 `Array`。

**查詢永遠不會穿透元件邊界**。內容查詢只能從與元件本身相同的範本中取得結果。

## 必要查詢

如果子查詢（`viewChild` 或 `contentChild`）找不到結果，它的值會是 `undefined`。當目標元素被 `@if` 或 `@for` 等控制流程陳述式隱藏時，就可能發生這種情況。因此，子查詢傳回的訊號，其值型別會包含 `undefined`。

在某些情況下，特別是使用 `viewChild` 時，你可以確定某個特定的子元素永遠可用。在其他情況下，你可能想嚴格要求某個特定的子元素必須存在。對於這些情況，你可以使用_必要查詢_。

```ts
@Component(/* ... */)
export class CustomCard {
  header = viewChild.required(CustomCardHeader);
  body = contentChild.required(CustomCardBody);
}
```

如果必要查詢找不到相符的結果，Angular 會回報錯誤。由於這保證了結果一定可用，必要查詢的訊號值型別不會自動包含 `undefined`。

## 查詢定位器

每個查詢函式的第一個參數是它的**定位器**。

大多數時候，你會想使用元件或指令作為你的定位器。

或者，你也可以指定一個字串定位器，對應到[範本參照變數](guide/templates/variables#template-reference-variables)。

```angular-ts
@Component({
  /*...*/
  template: `
    <button #save>Save</button>
    <button #cancel>Cancel</button>
  `,
})
export class ActionBar {
  saveButton = viewChild<ElementRef<HTMLButtonElement>>('save');
}
```

如果有多個元素定義了相同的範本參照變數，查詢會取得第一個相符的元素。

Angular 不支援使用 CSS 選擇器作為查詢定位器。

### 查詢與 injector 樹

TIP: 關於提供者與 Angular 注入樹的背景資訊，請參閱[依賴注入](guide/di)。

對於更進階的情況，你可以使用任何 `ProviderToken` 作為定位器。這可讓你依據元件與指令的提供者來定位元素。

```angular-ts
const SUB_ITEM = new InjectionToken<string>('sub-item');

@Component({
  /*...*/
  providers: [{provide: SUB_ITEM, useValue: 'special-item'}],
})
export class SpecialItem {}

@Component(/* ... */)
export class CustomList {
  subItemType = contentChild(SUB_ITEM);
}
```

上面的範例使用 `InjectionToken` 作為定位器，但你可以使用任何 `ProviderToken` 來定位特定元素。

## 查詢選項

所有查詢函式都接受選項物件作為第二個參數。這些選項控制查詢尋找結果的方式。

### 從元素的 injector 讀取特定的值

依預設，查詢定位器同時指出你所搜尋的元素以及要取得的值。或者，你也可以指定 `read` 選項，從定位器所比對的元素取得不同的值。

```ts
@Component(/* ... */)
export class CustomExpando {
  toggle = contentChild(ExpandoContent, {read: TemplateRef});
}
```

上面的範例會定位具有 `ExpandoContent` 指令的元素，並取得與該元素關聯的 `TemplateRef`。

開發者最常用 `read` 來取得 `ElementRef` 與 `TemplateRef`。

你也可以將 `Injector` 傳給 `read`。

```angular-ts
@Component({
  selector: 'custom-table',
  template: `
    <third-party-table #inner>
      <ng-template>
        <ng-container [ngTemplateOutlet]="columns()" [ngTemplateOutletInjector]="innerInjector()" />
      </ng-template>
    </third-party-table>
  `,
})
export class CustomTable {
  columns = contentChild(TemplateRef);
  innerInjector = viewChild('inner', {read: Injector});
}
```

上面的範例會取得 `third-party-table` 元素的節點 injector，也就是從該元素在樹中位置所看到的 injector。透過 `ngTemplateOutletInjector` 將它傳給 `NgTemplateOutlet`，可讓投射範本中的指令注入第三方元件所提供的值。

### 內容後代

依預設，`contentChildren` 查詢只會尋找元件的_直接_子元素，不會遍歷至後代元素。`contentChild` 查詢依預設則會遍歷至後代元素。

```angular-ts {highlight: [13, 14, 15, 16, 17]}
@Component({
  selector: 'custom-expando',
  /*...*/
})
export class CustomExpando {
  toggle = contentChildren(CustomToggle); // none found
  // toggle = contentChild(CustomToggle); // found
}

@Component({
  selector: 'user-profile',
  template: `
    <custom-expando>
      <some-other-component>
        <custom-toggle>Show</custom-toggle>
      </some-other-component>
    </custom-expando>
  `,
})
export class UserProfile {}
```

在上面的範例中，`CustomExpando` 無法以 `contentChildren` 找到 `<custom-toggle>`，因為它不是 `<custom-expando>` 的直接子元素。透過設定 `descendants: true`，你可以將查詢設定為遍歷同一範本中的所有後代元素。然而，查詢_永遠不會_穿透元件，去遍歷其他範本中的元素。

檢視查詢沒有這個選項，因為它們_永遠_會遍歷至後代元素。

## 裝飾器式查詢

TIP: 雖然 Angular 團隊建議新專案使用以訊號為基礎的查詢函式，但原始的裝飾器式查詢 API 仍受到完整支援。

或者，你也可以透過為屬性加上對應的裝飾器來宣告查詢。裝飾器式查詢的行為與以訊號為基礎的查詢相同，但以下說明的部分除外。

### 檢視查詢 {#decorator-view-queries}

你可以使用 `@ViewChild` 裝飾器查詢單一結果。

```angular-ts {highlight: [14, 16, 17, 18]}
@Component({
  selector: 'custom-card-header',
  /*...*/
})
export class CustomCardHeader {
  text: string;
}

@Component({
  selector: 'custom-card',
  template: '<custom-card-header>Visit sunny California!</custom-card-header>',
})
export class CustomCard implements AfterViewInit {
  @ViewChild(CustomCardHeader) header: CustomCardHeader;

  ngAfterViewInit() {
    console.log(this.header.text);
  }
}
```

在這個範例中，`CustomCard` 元件查詢子元件 `CustomCardHeader`，並在 `ngAfterViewInit` 中存取其結果。

Angular 會隨著應用程式狀態的變更，讓 `@ViewChild` 的結果保持最新。

**檢視查詢的結果會在 `ngAfterViewInit` 生命週期方法中變得可用**。在此之前，它的值為 `undefined`。關於元件生命週期的詳情，請參閱[生命週期](guide/components/lifecycle)章節。

你也可以使用 `@ViewChildren` 裝飾器查詢多個結果。

```angular-ts {highlight: [17, 19, 20, 21, 22, 23]}
@Component({
  selector: 'custom-card-action',
  /*...*/
})
export class CustomCardAction {
  text: string;
}

@Component({
  selector: 'custom-card',
  template: `
    <custom-card-action>Save</custom-card-action>
    <custom-card-action>Cancel</custom-card-action>
  `,
})
export class CustomCard implements AfterViewInit {
  @ViewChildren(CustomCardAction) actions: QueryList<CustomCardAction>;

  ngAfterViewInit() {
    this.actions.forEach((action) => {
      console.log(action.text);
    });
  }
}
```

`@ViewChildren` 會建立一個 `QueryList` 物件，其中包含查詢結果。你可以透過 `changes` 屬性，訂閱查詢結果隨時間的變更。

### 內容查詢 {#decorator-content-queries}

你可以使用 `@ContentChild` 裝飾器查詢單一結果。

```angular-ts {highlight: [14, 16, 17, 18]}
@Component({
  selector: 'custom-toggle',
  /*...*/
})
export class CustomToggle {
  text: string;
}

@Component({
  selector: 'custom-expando',
  /*...*/
})
export class CustomExpando implements AfterContentInit {
  @ContentChild(CustomToggle) toggle: CustomToggle;

  ngAfterContentInit() {
    console.log(this.toggle.text);
  }
}

@Component({
  selector: 'user-profile',
  template: `
    <custom-expando>
      <custom-toggle>Show</custom-toggle>
    </custom-expando>
  `,
})
export class UserProfile {}
```

在這個範例中，`CustomExpando` 元件查詢子元件 `CustomToggle`，並在 `ngAfterContentInit` 中存取其結果。

Angular 會隨著應用程式狀態的變更，讓 `@ContentChild` 的結果保持最新。

**內容查詢的結果會在 `ngAfterContentInit` 生命週期方法中變得可用**。在此之前，它的值為 `undefined`。關於元件生命週期的詳情，請參閱[生命週期](guide/components/lifecycle)章節。

你也可以使用 `@ContentChildren` 裝飾器查詢多個結果。

```angular-ts {highlight: [14, 16, 17, 18, 19, 20]}
@Component({
  selector: 'custom-menu-item',
  /*...*/
})
export class CustomMenuItem {
  text: string;
}

@Component({
  selector: 'custom-menu',
  /*...*/
})
export class CustomMenu implements AfterContentInit {
  @ContentChildren(CustomMenuItem) items: QueryList<CustomMenuItem>;

  ngAfterContentInit() {
    this.items.forEach((item) => {
      console.log(item.text);
    });
  }
}

@Component({
  selector: 'user-profile',
  template: `
    <custom-menu>
      <custom-menu-item>Cheese</custom-menu-item>
      <custom-menu-item>Tomato</custom-menu-item>
    </custom-menu>
  `,
})
export class UserProfile {}
```

`@ContentChildren` 會建立一個 `QueryList` 物件，其中包含查詢結果。你可以透過 `changes` 屬性訂閱查詢結果隨時間的變更。

### 裝飾器式查詢選項

所有查詢裝飾器都接受選項物件作為第二個參數。這些選項的運作方式與以訊號為基礎的查詢相同，但以下說明的部分除外。

### 靜態查詢

`@ViewChild` 與 `@ContentChild` 裝飾器接受 `static` 選項。

```angular-ts
@Component({
  selector: 'custom-card',
  template: '<custom-card-header>Visit sunny California!</custom-card-header>',
})
export class CustomCard implements OnInit {
  @ViewChild(CustomCardHeader, {static: true}) header: CustomCardHeader;

  ngOnInit() {
    console.log(this.header.text);
  }
}
```

透過設定 `static: true`，你向 Angular 保證這個查詢的目標_永遠_存在，且不會被條件式渲染。這讓結果能更早變得可用，也就是在 `ngOnInit` 生命週期方法中。

靜態查詢的結果在初始化之後不會再更新。

`static` 選項不適用於 `@ViewChildren` 與 `@ContentChildren` 查詢。

### 使用 QueryList

`@ViewChildren` 與 `@ContentChildren` 都提供了一個 `QueryList` 物件，其中包含結果清單。

`QueryList` 提供許多方便的 API，讓你以類似陣列的方式處理結果，例如 `map`、`reduce` 與 `forEach`。你可以呼叫 `toArray` 取得目前結果的陣列。

你可以訂閱 `changes` 屬性，在結果變更時執行某些動作。

## 常見的查詢陷阱

使用查詢時，常見的陷阱可能會讓你的程式碼更難理解與維護。

對於在多個元件之間共享的狀態，一律維護單一的事實來源。這可避免不同元件中重複的狀態失去同步的情況。

避免直接將狀態寫入子元件。這種模式可能導致脆弱、難以理解的程式碼，且容易出現 [ExpressionChangedAfterItHasBeenChecked](errors/NG0100) 錯誤。

切勿直接將狀態寫入父元件或祖先元件。這種模式可能導致脆弱、難以理解的程式碼，且容易出現 [ExpressionChangedAfterItHasBeenChecked](errors/NG0100) 錯誤。
