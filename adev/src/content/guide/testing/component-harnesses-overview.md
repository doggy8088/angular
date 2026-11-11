# 元件測試工具總覽

<strong>元件測試工具</strong>（component harness）是一個類別，讓測試能透過受支援的 API，以終端使用者與元件互動的方式與元件互動。你可以為任何元件建立測試工具，從小型可重複使用的小工具到完整頁面都行。

測試工具有幾個好處：

- 它們讓測試不那麼脆弱，因為它們隔絕了元件的實作細節，例如其 DOM 結構
- 它們讓測試更易讀、更容易維護
- 它們可以在多個測試環境中使用

<docs-code language="typescript">
// Example of test with a harness for a component called MyButtonComponent
it('should load button with exact text', async () => {
  const button = await loader.getHarness(MyButtonComponentHarness);
  expect(await button.getText()).toBe('Confirm');
});
</docs-code>

元件測試工具對共用的 UI 小工具特別有用。開發者經常撰寫仰賴小工具私有實作細節的測試，例如 DOM 結構與 CSS 類別。這些依賴讓測試變得脆弱且難以維護。測試工具提供了一個替代方案——一個受支援的 API，以與終端使用者相同的方式與小工具互動。如此一來，小工具的實作變更就不太可能弄壞使用者的測試。例如，[Angular Material](https://material.angular.dev/components/categories) 為函式庫中的每個元件都提供了測試工具。

元件測試工具支援多個測試環境。你可以在單元測試與端到端測試中使用相同的測試工具實作。測試作者只需要學習一套 API，元件作者也不必維護分開的單元測試與端到端測試實作。

許多開發者可以歸類為以下其中一種開發者類型：測試作者、元件測試工具作者與測試工具環境作者。請使用下表，根據這些類別找到本指南中最相關的章節：

| 開發者類型              | 說明                                                                                                                                                                                                                                                                                            | 相關章節                                                                                             |
| :-------------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :----------------------------------------------------------------------------------------------------------- |
| 測試作者                | 使用他人撰寫的元件測試工具來測試自己應用程式的開發者。例如，這可以是一位使用第三方選單元件的應用程式開發者，需要在單元測試中與該選單互動。                                                                       | [在測試中使用元件測試工具](guide/testing/using-component-harnesses)                                |
| 元件測試工具作者   | 維護一些可重複使用的 Angular 元件，並希望為其使用者建立測試工具供他們在測試中使用的開發者。例如，第三方 Angular 元件函式庫的作者，或是為大型 Angular 應用程式維護一組共用元件的開發者。             | [為你的元件建立元件測試工具](guide/testing/creating-component-harnesses)               |
| 測試工具環境作者 | 希望為額外的測試環境加入元件測試工具支援的開發者。若要了解開箱即支援的測試環境，請參閱[測試工具環境與載入器](guide/testing/using-component-harnesses#test-harness-environments-and-loaders)。 | [為額外的測試環境加入支援](guide/testing/component-harnesses-testing-environments) |

若要查看完整的 API 參考，請參閱 [Angular CDK 的元件測試工具 API 參考頁面](/api#angular_cdk_testing)。
