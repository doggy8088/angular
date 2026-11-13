# 為測試除錯

如果測試沒有如預期運作，你可以在瀏覽器中檢查它們並為它們除錯。

<div class="alert is-helpful">

  關於測試指南所描述的範例應用程式，請參閱<live-example name="testing" embedded-style noDownload>範例應用程式</live-example>。

  關於測試指南中的測試功能，請參閱<live-example name="testing" stackblitz="specs" noDownload>測試</live-example>。

</div>

在瀏覽器中為規格除錯的方式，與為應用程式除錯的方式相同。

1. 顯示 Karma 瀏覽器視窗。如果這一步需要協助，請參閱[設定測試](guide/testing#設定測試)。
1. 點選 **DEBUG** 按鈕；它會開啟新的瀏覽器分頁並重新執行測試。
1. 開啟瀏覽器的「Developer Tools」（Windows 上按 `Ctrl-Shift-I`；macOS 上按 `Command-Option-I`）。
1. 選取「sources」區段。
1. 開啟 `1st.spec.ts` 測試檔案（按 Control/Command-P，然後開始輸入檔案名稱）。
1. 在測試中設定中斷點。
1. 重新整理瀏覽器，它會停在中斷點處。

<div class="lightbox">
  <img src='generated/images/guide/testing/karma-1st-spec-debug.png' alt="Karma 除錯">
</div>
