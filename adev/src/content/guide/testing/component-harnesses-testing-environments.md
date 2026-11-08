# 為額外的測試環境加入測試工具支援

## 開始之前

TIP: 本指南假設你已經閱讀過[元件測試工具總覽指南](guide/testing/component-harnesses-overview)。如果你是第一次使用元件測試工具，請先閱讀該指南。

### 什麼時候為測試環境加入支援是合理的？

若要在以下環境中使用元件測試工具，你可以使用 Angular CDK 內建的兩個環境：

- 單元測試
- WebDriver 端到端測試

若要使用受支援的測試環境，請閱讀[為你的元件建立測試工具指南](guide/testing/creating-component-harnesses)。

否則，若要為其他環境加入支援，你需要定義如何與 DOM 元素互動，以及 DOM 互動在你的環境中如何運作。請繼續閱讀以了解更多。

### 安裝 CDK

[Component Dev Kit (CDK)](https://material.angular.dev/cdk/categories) 是一組用於建置元件的行為原語。若要使用元件測試工具，請先從 npm 安裝 `@angular/cdk`。你可以在終端機中使用 Angular CLI 完成這件事：

```shell
ng add @angular/cdk
```

## 建立 `TestElement` 實作

每個測試環境都必須定義一個 `TestElement` 實作。`TestElement` 介面是 DOM 元素的環境無關表示法。它讓測試工具能與 DOM 元素互動，無論底層環境為何。由於某些環境不支援同步與 DOM 元素互動（例如 WebDriver），所有 `TestElement` 方法都是非同步的，會回傳一個帶有操作結果的 `Promise`。

`TestElement` 提供了許多與底層 DOM 互動的方法，例如 `blur()`、`click()`、`getAttribute()` 等。若要查看完整的方法清單，請參閱 [TestElement API 參考頁面](/api/cdk/testing/TestElement)。

`TestElement` 介面主要由與 `HTMLElement` 上的方法相似的方法組成。類似的方法在大多數測試環境中都存在，這讓實作這些方法相當直接。不過，實作 `sendKeys` 方法時有一個重要差異要注意：`TestKey` 列舉中的鍵碼，可能與測試環境使用的鍵碼不同。環境作者應該維護一份從 `TestKey` 鍵碼到特定測試環境所用鍵碼的對應。

Angular CDK 中的 [UnitTestElement](/api/cdk/testing/testbed/UnitTestElement) 與 [SeleniumWebDriverElement](/api/cdk/testing/selenium-webdriver/SeleniumWebDriverElement) 實作，是這個介面的良好實作範例。

## 建立 `HarnessEnvironment` 實作

測試作者使用 `HarnessEnvironment` 來建立元件測試工具執行個體，供測試使用。`HarnessEnvironment` 是一個抽象類別，必須被擴充，才能為新環境建立具體的子類別。支援新的測試環境時，請建立一個 `HarnessEnvironment` 子類別，為所有抽象成員加入具體實作。

`HarnessEnvironment` 有一個泛型型別參數：`HarnessEnvironment<E>`。這個參數 `E` 代表環境的原始元素型別。例如，在單元測試環境中，這個參數是 Element。

以下是必須實作的抽象方法：

| 方法                                                       | 說明                                                                                                                                                          |
| :----------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `abstract getDocumentRoot(): E`                              | 取得環境的根元素（例如 `document.body`）。                                                                                                    |
| `abstract createTestElement(element: E): TestElement`        | 為給定的原始元素建立 `TestElement`。                                                                                                                   |
| `abstract createEnvironment(element: E): HarnessEnvironment` | 建立以給定原始元素為根的 `HarnessEnvironment`。                                                                                                      |
| `abstract getAllRawElements(selector: string): Promise<E[]>` | 取得環境根元素之下所有符合給定選擇器的原始元素。                                                                  |
| `abstract forceStabilize(): Promise<void>`                   | 取得一個在 `NgZone` 穩定時解析的 `Promise`。此外，若適用，也會告訴 `NgZone` 進行穩定（例如在 `fakeAsync` 測試中呼叫 `flush()`）。 |
| `abstract waitForTasksOutsideAngular(): Promise<void>`       | 取得一個在 `NgZone` 的父區域穩定時解析的 `Promise`。                                                                                           |

除了實作缺少的方法之外，這個類別還應該提供一種方式，讓測試作者取得 `ComponentHarness` 執行個體。你應該定義一個受保護的建構函式，並提供一個名為 `loader` 的靜態方法，回傳 `HarnessLoader` 執行個體。這讓測試作者能撰寫像這樣的程式碼：`SomeHarnessEnvironment.loader().getHarness(...)`。視特定環境的需求而定，該類別可能提供幾個不同的靜態方法，或要求傳入引數。（例如，`TestbedHarnessEnvironment` 上的 `loader` 方法接受一個 `ComponentFixture`，而該類別還提供名為 `documentRootLoader` 與 `harnessForFixture` 的額外靜態方法）。

Angular CDK 中的 [`TestbedHarnessEnvironment`](/api/cdk/testing/testbed/TestbedHarnessEnvironment) 與 [SeleniumWebDriverHarnessEnvironment](/api/cdk/testing/selenium-webdriver/SeleniumWebDriverHarnessEnvironment) 實作，是這個介面的良好實作範例。

## 處理自動變更偵測

為了支援 `manualChangeDetection` 與平行 API，你的環境應該為自動變更偵測狀態安裝一個處理常式。

當你的環境想要開始處理自動變更偵測狀態時，可以呼叫 `handleAutoChangeDetectionStatus(handler)`。處理常式函式會收到一個 `AutoChangeDetectionStatus`，它有兩個屬性：`isDisabled` 與 `onDetectChangesNow()`。詳情請參閱 [AutoChangeDetectionStatus API 參考頁面](/api/cdk/testing/AutoChangeDetectionStatus)。
如果你的環境想要停止處理自動變更偵測狀態，可以呼叫 `stopHandlingAutoChangeDetectionStatus()`。
