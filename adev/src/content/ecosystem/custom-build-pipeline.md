# 自訂建置管線

建置 Angular 應用程式時，我們強烈建議使用 Angular CLI，藉此善用它依結構而定的更新功能與建置系統抽象層。如此一來，專案就能受惠於最新的安全性、效能與 API 改進，以及透明的建置改善。

本頁探討少數需要自訂建置管線、而不使用 Angular CLI 的**罕見情境**。以下列出的工具都是由 Angular 社群成員維護的開源建置外掛。想了解它們的支援模式與維護狀態，請參閱各自的文件與 GitHub 儲存庫網址。

## 什麼時候該使用自訂建置管線？

在某些小眾情境下，你可能會想維護自訂建置管線。例如：

- 你有一個使用不同工具鏈的既有應用程式，想把 Angular 加入其中
- 你與 [module federation](https://module-federation.io/) 緊密耦合，無法改用與打包工具無關的 [native federation](https://www.npmjs.com/package/@angular-architects/native-federation)
- 你想用自己喜歡的建置工具做一個短期的實驗

## 有哪些選擇？

目前有兩個獲得良好支援的社群工具，能讓你建立自訂建置管線：[Vite 外掛](https://www.npmjs.com/package/@analogjs/vite-plugin-angular)與 [Rspack 外掛](https://www.npmjs.com/package/@nx/angular-rspack)。兩者都使用驅動 Angular CLI 的底層抽象，能讓你建立彈性的建置管線，但需要手動維護，也沒有自動更新體驗。

### Rspack

Rspack 是以 Rust 為基礎的打包工具，目標是與 webpack 外掛生態系相容。

如果你的專案與 webpack 生態系緊密耦合、高度依賴自訂的 webpack 設定，就可以利用 Rspack 改善建置時間。

想進一步了解 Angular Rspack，請參閱該專案的[文件網站](https://nx.dev/recipes/angular/rspack/introduction)。

### Vite

Vite 是前端建置工具，目標是為現代 Web 專案提供更快、更精簡的開發體驗。Vite 也能透過其外掛系統擴充，讓各生態系建立與 Vite 的整合，例如用 Vitest 做單元與瀏覽器測試、用 Storybook 隔離撰寫元件，還有更多。Angular CLI 也使用 Vite 作為其開發伺服器。

[AnalogJS 的 Angular Vite 外掛](https://www.npmjs.com/package/@analogjs/vite-plugin-angular)能讓使用 Vite、或建構在 Vite 之上的專案或框架採用 Angular。這包括直接以 Vite 開發與建置 Angular 專案，或是把 Angular 加入既有專案或管線。一個例子是使用 [Astro 與 Starlight](https://analogjs.org/docs/packages/astro-angular/overview)，把 Angular UI 元件整合進文件網站。

想進一步了解 AnalogJS 以及如何使用該外掛，請參閱其[文件頁面](https://analogjs.org/docs/packages/vite-plugin-angular/overview)。
