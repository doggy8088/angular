# 為測試除錯

如果測試沒有如預期運作，你可以在瀏覽器中檢查它們並為它們除錯。

在瀏覽器中為規格除錯的方式，與為應用程式除錯的方式相同。

1. 顯示 Karma 瀏覽器視窗。
    如果這一步需要協助，請參閱[設定測試](guide/testing#set-up-testing)。

1. 點選 **DEBUG** 按鈕，開啟新的瀏覽器分頁並重新執行測試。
1. 開啟瀏覽器的**開發者工具**後，在 Windows 上按 `Ctrl-Shift-I`，在 macOS 上按 `Command-Option-I`。
1. 選取 **Sources** 區段。
1. 按下 `Control/Command-P`，然後開始輸入你的測試檔案名稱將它開啟。
1. 在測試中設定中斷點。
1. 重新整理瀏覽器，注意它會停在中斷點處。

<img alt="Karma debugging" src="assets/images/guide/testing/karma-1st-spec-debug.png">
