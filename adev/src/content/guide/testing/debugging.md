# 偵錯測試

如果您的測試沒有按照預期運行，您可以在瀏覽器中檢查並除錯它們。

Debug 瀏覽器中的規格就像除錯應用程式一樣。

1. 顯示 Karma 瀏覽器視窗。
    如果您需要此步驟的說明，請參閱[設定測試](guide/testing#set-up-testing)。

1. 按一下 **DEBUG** 按鈕以開啟新的瀏覽器分頁，並重新執行測試。
1. 開啟瀏覽器的 **開發人員工具**。在 Windows 上，請按 `Ctrl-Shift-I`。在 macOS 上，請按 `Command-Option-I`。
1. 選取 **來源** 區段。
1. 按 `Control/Command-P`，然後開始輸入測試檔案名稱以開啟檔案。
1. 在測試中設定中斷點。
1. 重新整理瀏覽器，並注意中斷點如何停止。

<img alt="Karma 偵錯" src="https://angular.dev/assets/images/guide/testing/karma-1st-spec-debug.png">
