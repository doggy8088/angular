# 為測試除錯

如果測試沒有如預期運作，你可以在預設的 Node.js 環境與真實瀏覽器中為它們除錯。

## 在 Node.js 中除錯

在預設的 Node.js 環境中除錯，通常是診斷與瀏覽器專屬 API 或渲染無關之問題最快的方法。

1.  以 `--debug` 旗標執行 `ng test` 指令：
    ```shell
    ng test --debug
    ```
2.  測試執行器會以除錯模式啟動，並等待除錯器連接。
3.  現在你可以連接慣用的除錯器。例如，你可以使用 VS Code 內建的 Node.js 除錯器，或用於 Node.js 的 Chrome DevTools。

## 在瀏覽器中除錯

如同在 Node 中啟動除錯工作階段，你也可以搭配 Vitest 與[瀏覽器模式](/guide/testing/migrating-to-vitest#5-configure-browser-mode-optional)使用帶有 `--debug` 旗標的 `ng test`。

測試執行器會以除錯模式啟動，並等待你開啟瀏覽器開發者工具來為測試除錯。
