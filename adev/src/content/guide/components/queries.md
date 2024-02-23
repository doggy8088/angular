# 使用查詢參照元件子項

提示：本指南假設您已經閱讀過 [精華指南](essentials)。如果您是 Angular 新手，請先閱讀該指南。

組件可以定義**查詢**，以查找子元素並從其注入器中讀取值。

開發人員最常使用查詢來擷取子元件、指令、DOM 元素等之參考。

查詢分為兩類：**檢視查詢**和**內容查詢。**

## 檢視查詢

檢視查詢會從組件的 _檢視_ 中的元素擷取結果，也就是在組件本身的範本中定義的元素。您可以使用 `@ViewChild` 裝飾器查詢單一結果。

<docs-code language="ts" highlight="[14, 16, 17, 18]">
@Component({
  selector: 'custom-card-header',
  ...
})
export class CustomCardHeader {
  text: string;
}

@Component({
  selector: 'custom-card',
  template: '<custom-card-header>Visit sunny California!</custom-card-header>',
})
export class CustomCard {
  @ViewChild(CustomCardHeader) header: CustomCardHeader;

ngAfterViewInit() {
   console.log(this.header.text);
  }
}
</docs-code>

在此範例中，`CustomCard` 元件查詢子 `CustomCardHeader` 並在 `ngAfterViewInit` 中存取結果。

如果查詢沒有找到結果，其值為 `undefined`。如果目標元素被 `NgIf` 隱藏，可能會發生這種情況。Angular 會在應用程式狀態變更時保持 `@ViewChild` 的結果為最新狀態。

**在 `ngAfterViewInit` 生命周期方法中，檢視查詢結果可供使用。**在此之前，值為 `undefined`。有關組件生命週期的詳細資訊，請參閱 [生命週期](guide/components/lifecycle) 部分。

你可以使用 `@ViewChildren` 裝飾器查詢多個結果。

<docs-code language="ts" highlight="[17, 19, 20, 21, 22, 23]">
@Component({
  selector: 'custom-card-action',
  ...,
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
  @ViewChildren(CustomCardAction) actions: QueryList<CustomCardAction>;

ngAfterViewInit() {
    this.actions.forEach(action => {
      console.log(action.text);
    });
  }
}
</docs-code>

`@ViewChildren` 建立一個包含查詢結果的 `QueryList` 物件。您可以透過 `changes` 屬性訂閱查詢結果的變更。

**查詢絕不會穿透組件邊界。**檢視查詢只能從組件範本中擷取結果。

## 內容查詢

html
<p>
  <b>Content queries</b> allow you to select elements based on their
  content. This can be useful for selecting elements that contain a
  certain word or phrase, or elements that match a certain regular
  expression.
</p>
<p>
  To use a content query, you simply add a colon (:) to the beginning of
  the selector, followed by the content you want to match. For example,
  the following selector will select all elements that contain the word
  "foo":
</p>

內容查詢會從元件的 _content_ 中擷取結果，也就是在模板中使用元件時，元件內部巢狀的元素。你可以使用 `@ContentChild` 裝飾器來查詢單一結果。

<docs-code language="ts" highlight="[14, 16, 17, 18, 25]">
@Component({
  selector: 'custom-toggle',
  ...
})
export class CustomToggle {
  text: string;
}

@Component({
  selector: 'custom-expando',
  ...
})
export class CustomExpando {
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
  `
})
</docs-code>

在此範例中，`CustomExpando` 元件查詢子 `CustomToggle`，並在 `ngAfterContentInit` 中存取結果。

如果查詢沒有找到結果，其值是 `undefined`。如果目標元素不存在或被 `NgIf` 隱藏，可能會發生這種情況。隨著應用程式狀態的改變，Angular 會保持 `@ContentChild` 的結果為最新。

預設情況下，內容查詢只會尋找元件的_直接_子項，而不會深入後代。

**內容查詢結果在 `ngAfterContentInit` 生命週期方法中可供使用**。在此之前，該值為 `undefined`。有關組件生命週期的詳細資訊，請參閱 [生命週期](guide/components/lifecycle) 部分。

你也可以使用 `@ContentChildren` 裝飾器查詢多個結果。

<docs-code language="ts" highlight="[14, 16, 17, 18, 19, 20]">
@Component({
  selector: 'custom-menu-item',
  ...
})
export class CustomMenuItem {
  text: string;
}

@Component({
  selector: 'custom-menu',
  ...,
})
export class CustomMenu {
  @ContentChildren(CustomMenuItem) items: QueryList<CustomMenuItem>;

ngAfterContentInit() {
    this.items.forEach(item => {
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
  `
})
</docs-code>

`@ContentChildren` 建立一個包含查詢結果的 `QueryList` 物件。您可以透過 `changes` 屬性訂閱查詢結果的變更。

**查詢絕不會透過組件邊界。**內容查詢只能從與組件相同的範本中擷取結果。

## 查詢定位器

每個查詢裝飾器的第一個參數是其 **定位器**。

大多數時間，您會想使用組件或指令作為您的定位器。

您也可以指定一個字串定位器，對應至
[範本參考變數](guide/templates/reference-variables)。

```ts
@Component({
  ...,
  template: `
    <button #save>Save</button>
    <button #cancel>Cancel</button>
  `
})
export class ActionBar {
  @ViewChild('save') saveButton: ElementRef<HTMLButtonElement>;
}
```

如果有多個元素定義相同的範本參考變數，查詢會擷取第一個符合的元素。

Angular 不支援 CSS 選擇器作為查詢定位器。

### 查詢和注入器樹

提示：請參閱 [依存項注入](guide/di) 以了解提供者和 Angular 的注入樹的背景。

對於進階情況，您可以使用任何 `ProviderToken` 作為定位器。這讓您可以根據組件和指令提供者來定位元素。

```ts
const SUB_ITEM = new InjectionToken<string>('sub-item');

@Component({
  ...,
  providers: [{provide: SUB_ITEM, useValue: 'special-item'}],
})
export class SpecialItem { }

@Component({...})
export class CustomList {
  @ContentChild(SUB_ITEM) subItemType: string;
}
```

上面的範例使用 `InjectionToken` 作為定位器，但您可以使用任何 `ProviderToken` 來定位特定元素。

## 查詢選項

所有查詢裝飾器接受一個選項物件作為第二個參數。這些選項控制著查詢如何找到它的結果。

### 靜態查詢

`@ViewChild` 和 `@ContentChild` 查詢接受 `static` 選項。

```ts
@Component({
  selector: 'custom-card',
  template: '<custom-card-header>Visit sunny California!</custom-card-header>',
})
export class CustomCard {
  @ViewChild(CustomCardHeader, {static: true}) header: CustomCardHeader;

  ngOnInit() {
    console.log(this.header.text);
  }
}
```

透過設定 `static: true`，您可以向 Angular 保證此查詢的目標 _始終_ 存在，且不會有條件地呈現。這會讓結果更早出現在 `ngOnInit` 生命週期方法中。

靜態查詢結果初始化後不會更新。

`static` 選項不適用於 `@ViewChildren` 和 `@ContentChildren` 查詢。

### 內容後代

預設情況下，內容查詢只會尋找元件的_直接_子項，而不會深入後代。

<docs-code language="ts" highlight="[13, 14, 15, 16]">
@Component({
  selector: 'custom-expando',
  ...
})
export class CustomExpando {
  @ContentChild(CustomToggle) toggle: CustomToggle;
}

@Component({
  selector: 'user-profile',
  template: `
    <custom-expando>
      <some-other-component>
        <!-- custom-toggle will not be found! -->
        <custom-toggle>Show</custom-toggle>
      </some-other-component>
    </custom-expando>
  `
})
</docs-code>

在上面的範例中，`CustomExpando` 找不到 `<custom-toggle>`，因為它不是 `<custom-expando>` 的直接子項目。藉由設定 `descendants: true`，您可以將查詢設定為橫跨同一個樣板中的所有後代。然而，查詢_永遠_不會穿透元件以橫跨其他樣板中的元素。

檢視查詢沒有這個選項，因為它們_總是_會穿越到子孫。

### 從元素的注入器讀取特定值

預設情況下，查詢定位器會指示您搜尋的元素和檢索到的值。或者，您可以指定 `read` 選項，以從與定位器匹配的元素檢索不同的值。

```ts
@Component({...})
export class CustomExpando {
  @ContentChild(ExpandoContent, {read: TemplateRef}) toggle: TemplateRef;
}
```

上述範例，會找到一個具有指令 `ExpandoContent` 的元素並擷取與該元素關聯的 `TemplateRef`。

開發人員最常使用 `read` 來擷取 `ElementRef` 和 `TemplateRef`。

## 使用 QueryList

`@ViewChildren` 和 `@ContentChildren` 都提供一個 `QueryList` 物件，其中包含結果清單。

`QueryList` 提供一些便利的 API，可讓你以類似陣列的方式處理結果，例如 `map`、`reduce` 和 `forEach`。你可以透過呼叫 `toArray` 來取得當前結果的陣列。

您可以訂閱 `changes` 屬性，以便在結果變更時執行某些操作。

## 常見查詢陷阱

使用查詢時，常見的陷阱會讓你的程式碼更難理解和維護。

始終維持多個元件之間共用狀態的單一真實來源。這可避免不同元件中的重複狀態不同步的場景。

避免直接將狀態寫入子組件。此模式可能導致難以理解且容易發生 [ExpressionChangedAfterItHasBeenChecked](errors/NG0100) 錯誤的脆弱程式碼。

切勿直接將狀態寫入父級或祖先組件。這種模式可能導致難以理解且容易產生 [ExpressionChangedAfterItHasBeenChecked](errors/NG0100) 錯誤的脆弱程式碼。

