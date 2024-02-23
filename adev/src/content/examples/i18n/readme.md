# Angular i18n 國際化範例

以下範例來自 Angular 文件中的「[範例 Angular 國際化應用程式](https://angular.dev/guide/i18n/example)」頁面。

## 安裝並執行下載

html
<p>
  <a href="download/download.zip">Download</a>
</p>

1. `npm install` node_module 套件
2. `npm start` 以英文觀看執行結果
3. `npm run start:fr` 以法文翻譯觀看執行結果。

>請參閱 `package.json` 中的指令碼以了解這些指令的說明。

## 在 Stackblitz 中執行

Stackblitz 預設編譯並執行英文版本。

要使用 Angular i18n 檢視轉譯成法文的範例：

1. 開啟 `project.json` 檔案，並在底部新增以下內容：

```json
  "stackblitz": {
    "startCommand": "npm run start:fr"
  }
```

1. 點擊 stackblitz 標題中的「Fork」按鈕。這會為您建立一個新的副本，並以法文重新執行範例。

