# 在測試中使用元件測試工具（component harness）

## 開始之前

TIP: 本指南假設你已閱讀過[元件測試工具總覽指南](guide/testing/component-harnesses-overview)。如果你是第一次使用元件測試工具，請先閱讀該指南。

### 安裝 CDK

[Component Dev Kit (CDK)](https://material.angular.dev/cdk/categories) 是一組用來建構元件的行為基礎元件。若要使用元件測試工具，先從 npm 安裝 `@angular/cdk`。你可以在終端機中使用 Angular CLI 完成安裝：

```shell
ng add @angular/cdk
```

## 測試工具環境與載入器

你可以在不同的測試環境中使用元件測試工具。Angular CDK 支援兩種內建環境：

- 使用 Angular `TestBed` 的單元測試
- 使用 [WebDriver](https://developer.mozilla.org/en-US/docs/Web/WebDriver) 的端到端測試

每個環境都提供一個<strong>測試工具載入器</strong>。載入器負責建立你在測試中使用的測試工具實例。關於受支援測試環境的更具體指引，請見下文。

其他測試環境需要自訂綁定。更多資訊請參閱[為其他測試環境加入測試工具支援指南](guide/testing/component-harnesses-testing-environments)。

### 在單元測試中使用 `TestbedHarnessEnvironment` 的載入器

在單元測試中，你可以從 [TestbedHarnessEnvironment](/api/cdk/testing/testbed/TestbedHarnessEnvironment) 建立測試工具載入器。這個環境使用由 Angular `TestBed` 建立的[元件 fixture](api/core/testing/ComponentFixture)。

若要建立以 fixture 根元素為根的測試工具載入器，請使用 `loader()` 方法：

```ts
const fixture = TestBed.createComponent(MyComponent);

// Create a harness loader from the fixture
const loader = TestbedHarnessEnvironment.loader(fixture);
...

// Use the loader to get harness instances
const myComponentHarness = await loader.getHarness(MyComponent);
```

若要為 fixture 之外的元素建立測試工具載入器，請使用 `documentRootLoader()` 方法。例如，顯示浮動元素或彈出視窗的程式碼，通常會將 DOM 元素直接附加到文件主體上，例如 Angular CDK 中的 `Overlay` 服務。

你也可以直接使用 `harnessForFixture()`，為該 fixture 根元素處的測試工具建立載入器。

### 在端到端測試中使用 `SeleniumWebDriverHarnessEnvironment` 的載入器

在以 WebDriver 為基礎的端到端測試中，你可以使用 `SeleniumWebDriverHarnessEnvironment` 建立測試工具載入器。

使用 `loader()` 方法取得目前 HTML 文件的測試工具載入器實例，其根為文件的根元素。這個環境使用 WebDriver 用戶端。

```ts
let wd: webdriver.WebDriver = getMyWebDriverClient();
const loader = SeleniumWebDriverHarnessEnvironment.loader(wd);
...
const myComponentHarness = await loader.getHarness(MyComponent);
```

## 使用測試工具載入器

測試工具載入器實例對應到特定的 DOM 元素，用來為該元素底下的元素建立元件測試工具實例。

若要取得元素第一個實例的 `ComponentHarness`，請使用 `getHarness()` 方法。若要取得所有 `ComponentHarness` 實例，請使用 `getAllHarnesses()` 方法。

```ts
// Get harness for first instance of the element
const myComponentHarness = await loader.getHarness(MyComponent);

// Get harnesses for all instances of the element
const myComponentHarnesses = await loader.getAllHarnesses(MyComponent);
```

除了 `getHarness` 與 `getAllHarnesses` 之外，`HarnessLoader` 還有幾個其他實用的方法可用來查詢測試工具：

- `getHarnessAtIndex(...)`：取得在特定索引處符合指定條件的元件測試工具。
- `countHarnesses(...)`：計算符合指定條件的元件實例數量。
- `hasHarness(...)`：檢查是否至少有一個元件實例符合指定條件。

舉例來說，想像一個可重複使用的對話方塊按鈕元件，按下後會開啟對話方塊。它包含下列元件，每個元件都有對應的測試工具：

- `MyDialogButton`（組合 `MyButton` 與 `MyDialog`，提供方便的 API）
- `MyButton`（標準的按鈕元件）
- `MyDialog`（由 `MyDialogButton` 在點擊時附加到 `document.body` 的對話方塊）

下列測試會載入這些元件各自的測試工具：

```ts
let fixture: ComponentFixture<MyDialogButton>;
let loader: HarnessLoader;
let rootLoader: HarnessLoader;

beforeEach(() => {
  fixture = TestBed.createComponent(MyDialogButton);
  loader = TestbedHarnessEnvironment.loader(fixture);
  rootLoader = TestbedHarnessEnvironment.documentRootLoader(fixture);
});

it('loads harnesses', async () => {
  // Load a harness for the bootstrapped component with `harnessForFixture`
  dialogButtonHarness = await TestbedHarnessEnvironment.harnessForFixture(
    fixture,
    MyDialogButtonHarness,
  );

  // The button element is inside the fixture's root element, so we use `loader`.
  const buttonHarness = await loader.getHarness(MyButtonHarness);

  // Click the button to open the dialog
  await buttonHarness.click();

  // The dialog is appended to `document.body`, outside of the fixture's root element,
  // so we use `rootLoader` in this case.
  const dialogHarness = await rootLoader.getHarness(MyDialogHarness);

  // ... make some assertions
});
```

### 測試工具在不同環境中的行為

測試工具在所有環境中的行為未必完全相同。真正的使用者互動與單元測試中產生的模擬事件之間，有些差異無可避免。Angular CDK 會盡最大努力，在可能的範圍內讓行為一致。

### 與子元素互動

若要與此測試工具載入器根元素底下的元素互動，請使用子元素的 `HarnessLoader` 實例。對於子元素的第一個實例，請使用 `getChildLoader()` 方法。對於子元素的所有實例，請使用 `getAllChildLoaders()` 方法。

```ts
const myComponentHarness = await loader.getHarness(MyComponent);

// Get loader for first instance of child element with '.child' selector
const childLoader = await loader.getChildLoader('.child');

// Get loaders for all instances of child elements with '.child' selector
const allChildLoaders = await loader.getAllChildLoaders('.child');
```

### 篩選測試工具

當頁面包含某個元件的多個實例時，你可能會想根據元件的某個屬性來篩選，以取得特定的元件實例。你可以使用<strong>測試工具述詞</strong>來做到這一點；它是一個類別，用來將 `ComponentHarness` 類別與可用來篩選元件實例的述詞函式關聯起來。

當你向 `HarnessLoader` 請求一個測試工具時，你實際上提供的是 HarnessQuery。查詢可以是下列兩者之一：

- 測試工具建構函式。這只會取得該測試工具
- `HarnessPredicate`，會取得依一或多個條件篩選後的測試工具

`HarnessPredicate` 支援一些基礎篩選條件（selector、ancestor），適用於任何繼承 `ComponentHarness` 的類別。

```ts
// Example of loading a MyButtonComponentHarness with a harness predicate
const disabledButtonPredicate = new HarnessPredicate(MyButtonComponentHarness, {
  selector: '[disabled]',
});
const disabledButton = await loader.getHarness(disabledButtonPredicate);
```

不過，測試工具通常會實作一個靜態 `with()` 方法，接受元件專屬的篩選選項，並傳回 `HarnessPredicate`。

```ts
// Example of loading a MyButtonComponentHarness with a specific selector
const button = await loader.getHarness(MyButtonComponentHarness.with({selector: 'btn'}));
```

更多細節請參閱各測試工具的文件，因為額外的篩選選項是每個測試工具實作各自專屬的。

## 使用測試工具 API

雖然每個測試工具都定義了對應元件專屬的 API，但它們全都共用一個共同的基礎類別 [ComponentHarness](/api/cdk/testing/ComponentHarness)。這個基礎類別定義了一個靜態屬性 `hostSelector`，用來將測試工具類別與 DOM 中的元件實例對應起來。

除此之外，任何測試工具的 API 都專屬於其對應的元件；請參閱該元件的文件，了解如何使用特定的測試工具。

舉例來說，以下是使用 [Angular Material 滑桿元件測試工具](https://material.angular.dev/components/slider/api#MatSliderHarness) 的元件測試：

```ts
it('should get value of slider thumb', async () => {
  const slider = await loader.getHarness(MatSliderHarness);
  const thumb = await slider.getEndThumb();
  expect(await thumb.getValue()).toBe(50);
});
```

## 與 Angular 變更偵測的互動

預設情況下，測試工具會在讀取 DOM 元素的狀態之前，以及與 DOM 元素互動之後，執行 Angular 的[變更偵測](/best-practices/runtime-performance)。

有些時候，你需要在測試中更細緻地控制變更偵測，例如在非同步操作尚在進行時檢查元件的狀態。在這些情況下，請使用 `manualChangeDetection` 函式，為一段程式碼停用變更偵測的自動處理。

```ts
it('checks state while async action is in progress', async () => {
  const buttonHarness = await loader.getHarness(MyButtonHarness);
  await manualChangeDetection(async () => {
    await buttonHarness.click();
    fixture.detectChanges();
    // Check expectations while async click operation is in progress.
    expect(isProgressSpinnerVisible()).toBe(true);
    await fixture.whenStable();
    // Check expectations after async click operation complete.
    expect(isProgressSpinnerVisible()).toBe(false);
  });
});
```

幾乎所有測試工具方法都是非同步的，並傳回 `Promise`，以支援下列需求：

- 支援單元測試
- 支援端到端測試
- 讓測試不受非同步行為變更的影響

Angular 團隊建議使用 [await](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function) 來提升測試的可讀性。呼叫 `await` 會阻擋測試的執行，直到相關的 `Promise` 完成為止。

偶爾，你可能會想同時執行多個動作，並等到它們全部完成，而不是依序執行每個動作。例如，讀取單一元件的多個屬性。在這些情況下，請使用 `parallel` 函式來平行化這些操作。`parallel` 函式的運作方式與 `Promise.all` 類似，同時也會最佳化變更偵測的檢查。

```ts
it('reads properties in parallel', async () => {
  const checkboxHarness = await loader.getHarness(MyCheckboxHarness);
  // Read the checked and intermediate properties simultaneously.
  const [checked, indeterminate] = await parallel(() => [
    checkboxHarness.isChecked(),
    checkboxHarness.isIndeterminate(),
  ]);
  expect(checked).toBe(false);
  expect(indeterminate).toBe(true);
});
```
