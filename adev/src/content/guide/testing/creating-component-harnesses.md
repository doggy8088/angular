# 為你的元件建立元件測試工具

## 開始之前

TIP: 本指南假設你已經閱讀過[元件測試工具總覽指南](guide/testing/component-harnesses-overview)。如果你還不熟悉元件測試工具的用法，請先閱讀該指南。

### 什麼時候適合建立元件測試工具？

Angular 團隊建議，為在許多地方使用且具備一定使用者互動性的共用元件建立元件測試工具。這最常見於小工具程式庫與類似的可重用元件。元件測試工具對這類情境很有價值，因為它們為這些共用元件的使用者提供了一套受到完善支援的 API 來與元件互動。使用元件測試工具的測試可以避免依賴這些共用元件不可靠的實作細節，例如 DOM 結構與特定的事件監聽器。

對於只出現在單一位置的元件，例如應用程式中的某個頁面，元件測試工具帶來的效益就沒那麼大。在這類情境中，元件的測試可以合理地依賴該元件的實作細節，因為測試與元件會在同一時間更新。不過，如果你會在單元測試與端到端測試中都使用同一個元件測試工具，它仍然能提供一些價值。

### CDK 安裝

[Component Dev Kit (CDK)](https://material.angular.dev/cdk/categories) 是一組建構元件用的行為基礎元件。若要使用元件測試工具，請先從 npm 安裝 `@angular/cdk`。你可以在終端機中使用 Angular CLI 完成安裝：

<docs-code language="shell">
  ng add @angular/cdk
</docs-code>

## 擴充 `ComponentHarness`

抽象類別 `ComponentHarness` 是所有元件測試工具的基底類別。若要建立自訂的元件測試工具，請擴充 `ComponentHarness` 並實作靜態屬性 `hostSelector`。

`hostSelector` 屬性用來識別 DOM 中符合這個元件測試工具子類別的元素。在大多數情況下，`hostSelector` 應該與對應的 `Component` 或 `Directive` 的選擇器相同。舉例來說，考慮一個簡單的彈出式元件：

<docs-code language="typescript">
@Component({
  selector: 'my-popup',
  template: `
    <button (click)="toggle()">{{triggerText()}}</button>
    @if (isOpen()) {
      <div class="my-popup-content"><ng-content></ng-content></div>
    }
  `
})
class MyPopup {
  triggerText = input('');

isOpen = signal(false);

toggle() {
this.isOpen.update((value) => !value);
}
}
</docs-code>

在這個例子中，這個元件最精簡的元件測試工具如下所示：

<docs-code language="typescript">
class MyPopupHarness extends ComponentHarness {
  static hostSelector = 'my-popup';
}
</docs-code>

雖然 `ComponentHarness` 子類別只需要 `hostSelector` 屬性，但大多數元件測試工具也應該實作靜態的 `with` 方法來產生 `HarnessPredicate` 實例。[篩選元件測試工具一節](guide/testing/using-component-harnesses#filtering-harnesses)會更詳細地說明這一點。

## 在元件的 DOM 中尋找元素

`ComponentHarness` 子類別的每個實例都代表對應元件的一個特定實例。你可以透過 `ComponentHarness` 基底類別的 `host()` 方法取得元件的宿主元素。

`ComponentHarness` 也提供了數個在元件 DOM 中定位元素的方法。這些方法是 `locatorFor()`、`locatorForOptional()` 與 `locatorForAll()`。這些方法建立的是用來尋找元素的函式，它們並不直接尋找元素。這種做法可以避免快取到過時元素的參照。舉例來說，當一個 `@if` 區塊先隱藏再顯示某個元素時，產生的會是一個新的 DOM 元素；使用函式能確保測試永遠參照到 DOM 目前的狀態。

完整的 `locatorFor` 方法清單與詳細說明，請參閱 [ComponentHarness API 參考頁面](/api/cdk/testing/ComponentHarness)。

舉例來說，前面討論的 `MyPopupHarness` 範例可以提供取得觸發元素與內容元素的方法，如下所示：

<docs-code language="typescript">
class MyPopupHarness extends ComponentHarness {
  static hostSelector = 'my-popup';

// Gets the trigger element
getTriggerElement = this.locatorFor('button');

// Gets the content element.
getContentElement = this.locatorForOptional('.my-popup-content');
}
</docs-code>

## 使用 `TestElement` 實例

`TestElement` 是一種抽象化設計，能在不同的測試環境（單元測試、WebDriver 等）中運作。使用元件測試工具時，你應該透過這個介面進行所有的 DOM 互動。其他存取 DOM 元素的方式，例如 `document.querySelector()`，並不適用於所有測試環境。

`TestElement` 有許多與底層 DOM 互動的方法，例如 `blur()`、`click()`、`getAttribute()` 等。完整的方法清單請參閱 [TestElement API 參考頁面](/api/cdk/testing/TestElement)。

不要將 `TestElement` 實例暴露給元件測試工具的使用者，除非那是元件使用者直接定義的元素，例如元件的宿主元素。為內部元素暴露 `TestElement` 實例，會讓使用者依賴元件內部的 DOM 結構。

你應該改為針對終端使用者可能採取的特定動作，或他們可能觀察的特定狀態，提供範圍更聚焦的方法。舉例來說，前面幾節的 `MyPopupHarness` 可以提供像 `toggle` 與 `isOpen` 這樣的方法：

<docs-code language="typescript">
class MyPopupHarness extends ComponentHarness {
  static hostSelector = 'my-popup';

protected getTriggerElement = this.locatorFor('button');
protected getContentElement = this.locatorForOptional('.my-popup-content');

/\*_ Toggles the open state of the popup. _/
async toggle() {
const trigger = await this.getTriggerElement();
return trigger.click();
}

/\*_ Checks if the popup us open. _/
async isOpen() {
const content = await this.getContentElement();
return !!content;
}
}
</docs-code>

## 為子元件載入元件測試工具

較大的元件通常由子元件組成。你也可以在元件的元件測試工具中反映這種結構。`ComponentHarness` 上的每個 `locatorFor` 方法都有另一種簽章，可以用來定位子元件測試工具而非元素。

不同的 locatorFor 方法完整清單，請參閱 [ComponentHarness API 參考頁面](/api/cdk/testing/ComponentHarness)。

舉例來說，考慮一個使用上述彈出式元件建構的選單：

<docs-code language="typescript">
@Directive({
  selector: 'my-menu-item'
})
class MyMenuItem {}

@Component({
selector: 'my-menu',
template: `     <my-popup>
      <ng-content></ng-content>
    </my-popup>
  `
})
class MyMenu {
triggerText = input('');

@ContentChildren(MyMenuItem) items: QueryList<MyMenuItem>;
}
</docs-code>

`MyMenu` 的元件測試工具接著就可以利用 `MyPopup` 與 `MyMenuItem` 的其他元件測試工具：

<docs-code language="typescript">
class MyMenuHarness extends ComponentHarness {
  static hostSelector = 'my-menu';

protected getPopupHarness = this.locatorFor(MyPopupHarness);

/\*_ Gets the currently shown menu items (empty list if menu is closed). _/
getItems = this.locatorForAll(MyMenuItemHarness);

/\*_ Toggles open state of the menu. _/
async toggle() {
const popupHarness = await this.getPopupHarness();
return popupHarness.toggle();
}
}

class MyMenuItemHarness extends ComponentHarness {
static hostSelector = 'my-menu-item';
}
</docs-code>

## 以 `HarnessPredicate` 篩選元件測試工具實例

當一個頁面包含某個特定元件的多個實例時，你可能會想依據元件的某個屬性來篩選，以取得特定的元件實例。舉例來說，你可能會想要一個帶有特定文字的按鈕，或一個帶有特定 ID 的選單。`HarnessPredicate` 類別可以為 `ComponentHarness` 子類別捕捉這類條件。雖然測試作者可以手動建構 `HarnessPredicate` 實例，但如果 `ComponentHarness` 子類別提供一個輔助方法來為常見的篩選條件建構述詞，會容易得多。

你應該在每個 `ComponentHarness` 子類別上建立一個靜態的 `with()` 方法，傳回該類別的 `HarnessPredicate`。如此一來，測試作者就能寫出容易理解的程式碼，例如 `loader.getHarness(MyMenuHarness.with({selector: '#menu1'}))`。除了標準的 selector 與 ancestor 選項之外，`with` 方法還應該加入對該特定子類別而言有意義的其他選項。

需要加入額外選項的元件測試工具，應該擴充 `BaseHarnessFilters` 介面，並視需要加入額外的選擇性屬性。`HarnessPredicate` 提供了數個加入選項的便利方法：`stringMatches()`、`addOption()` 與 `add()`。完整說明請參閱 [HarnessPredicate API 頁面](/api/cdk/testing/HarnessPredicate)。

舉例來說，處理選單時，依據觸發文字來篩選，以及依據選單項目的文字來篩選，都很實用：

<docs-code language="typescript">
interface MyMenuHarnessFilters extends BaseHarnessFilters {
  /** Filters based on the trigger text for the menu. */
  triggerText?: string | RegExp;
}

interface MyMenuItemHarnessFilters extends BaseHarnessFilters {
/\*_ Filters based on the text of the menu item. _/
text?: string | RegExp;
}

class MyMenuHarness extends ComponentHarness {
static hostSelector = 'my-menu';

/\*_ Creates a `HarnessPredicate` used to locate a particular `MyMenuHarness`. _/
static with(options: MyMenuHarnessFilters): HarnessPredicate<MyMenuHarness> {
return new HarnessPredicate(MyMenuHarness, options)
.addOption('trigger text', options.triggerText,
(harness, text) => HarnessPredicate.stringMatches(harness.getTriggerText(), text));
}

protected getPopupHarness = this.locatorFor(MyPopupHarness);

/\*_ Gets the text of the menu trigger. _/
async getTriggerText(): Promise<string> {
const popupHarness = await this.getPopupHarness();
return popupHarness.getTriggerText();
}
...
}

class MyMenuItemHarness extends ComponentHarness {
static hostSelector = 'my-menu-item';

/\*_ Creates a `HarnessPredicate` used to locate a particular `MyMenuItemHarness`. _/
static with(options: MyMenuItemHarnessFilters): HarnessPredicate<MyMenuItemHarness> {
return new HarnessPredicate(MyMenuItemHarness, options)
.addOption('text', options.text,
(harness, text) => HarnessPredicate.stringMatches(harness.getText(), text));
}

/\*_ Gets the text of the menu item. _/
async getText(): Promise<string> {
const host = await this.host();
return host.text();
}
}
</docs-code>

你可以將 `HarnessPredicate` 而非 `ComponentHarness` 類別，傳給 `HarnessLoader`、`LocatorFactory` 或 `ComponentHarness` 上的任何 API。這讓測試作者在建立元件測試工具實例時，能輕易鎖定特定的元件實例。它也讓元件測試工具作者能利用同一個 `HarnessPredicate`，在自己的元件測試工具類別上啟用更強大的 API。舉例來說，考慮上面展示的 `MyMenuHarness` 上的 `getItems` 方法。加入篩選 API 後，元件測試工具的使用者就能搜尋特定的選單項目：

<docs-code language="typescript">
class MyMenuHarness extends ComponentHarness {
  static hostSelector = 'my-menu';

/\*_ Gets a list of items in the menu, optionally filtered based on the given criteria. _/
async getItems(filters: MyMenuItemHarnessFilters = {}): Promise<MyMenuItemHarness[]> {
const getFilteredItems = this.locatorForAll(MyMenuItemHarness.with(filters));
return getFilteredItems();
}
...
}
</docs-code>

## 為使用內容投影的元素建立 `HarnessLoader`

有些元件會將額外內容投影到元件的範本中。更多資訊請參閱[內容投影指南](guide/components/content-projection)。

當你為使用內容投影的元件建立元件測試工具時，請加入一個作用域限定在包含 `<ng-content>` 之元素的 `HarnessLoader` 實例。這讓元件測試工具的使用者能為任何作為內容傳入的元件載入額外的元件測試工具。針對這類情境，`ComponentHarness` 提供了數個可以建立 HarnessLoader 實例的方法：`harnessLoaderFor()`、`harnessLoaderForOptional()`、`harnessLoaderForAll()`。更多細節請參閱 [HarnessLoader 介面 API 參考頁面](/api/cdk/testing/HarnessLoader)。

舉例來說，上面的 `MyPopupHarness` 範例可以擴充 `ContentContainerComponentHarness`，加入在元件的 `<ng-content>` 內載入元件測試工具的支援。

<docs-code language="typescript">
class MyPopupHarness extends ContentContainerComponentHarness<string> {
  static hostSelector = 'my-popup';
}
</docs-code>

## 存取元件宿主元素之外的元素

有些時候，元件測試工具可能需要存取其對應元件宿主元素之外的元素。舉例來說，顯示浮動元素或彈出式內容的程式碼，經常會將 DOM 元素直接附加到文件主體上，例如 Angular CDK 中的 `Overlay` 服務。

在這個情況下，`ComponentHarness` 提供了一個方法，可以取得文件根元素的 `LocatorFactory`。`LocatorFactory` 支援與 `ComponentHarness` 基底類別相同的大多數 API，接著就能用來相對於文件的根元素進行查詢。

考慮看看：如果上面的 `MyPopup` 元件使用 CDK overlay 來呈現彈出內容，而不是使用自己範本中的元素，會怎麼樣。在這個情況下，`MyPopupHarness` 就必須透過 `documentRootLocatorFactory()` 方法存取內容元素，該方法會取得一個以文件根為根的 locator factory。

<docs-code language="typescript">
class MyPopupHarness extends ComponentHarness {
  static hostSelector = 'my-popup';

/\*_ Gets a `HarnessLoader` whose root element is the popup's content element. _/
async getHarnessLoaderForContent(): Promise<HarnessLoader> {
const rootLocator = this.documentRootLocatorFactory();
return rootLocator.harnessLoaderFor('my-popup-content');
}
}
</docs-code>

## 等待非同步工作

`TestElement` 上的方法會自動觸發 Angular 的變更偵測，並等待 `NgZone` 內的工作。在大多數情況下，元件測試工具作者不需要為了等待非同步工作而做特別的處理。不過，在某些邊緣情境下，這可能還不夠。

在某些情況下，Angular 動畫可能需要第二輪變更偵測以及後續的 `NgZone` 穩定，才能完全排清動畫事件。在需要這麼做的情況下，`ComponentHarness` 提供了 `forceStabilize()` 方法，可以呼叫它來進行第二輪處理。

你可以使用 `NgZone.runOutsideAngular()` 在 NgZone 之外排程工作。如果你需要明確等待 `NgZone` 之外的工作，請呼叫對應元件測試工具上的 `waitForTasksOutsideAngular()` 方法，因為這件事不會自動發生。
