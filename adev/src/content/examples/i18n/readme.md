# Angular i18n 國際化範例

這個範例來自 Angular 文件的「[Angular 國際化範例應用程式](https://angular.dev/guide/i18n/example)」頁面。

## 安裝並執行下載內容

1. 用 `npm install` 安裝 node_module 套件
2. 用 `npm start` 以英文執行並查看
3. 用 `npm run start:fr` 以法文翻譯執行並查看。

> 請參閱 `package.json` 中的指令碼，以了解這些指令的說明。

## 在 StackBlitz 中執行

StackBlitz 預設會編譯並執行英文版本。

若要查看範例如何透過 Angular i18n 翻譯為法文：

1. 開啟 `project.json` 檔案，將下列內容加入底部：

```json
  "stackblitz": {
    "startCommand": "npm run start:fr"
  }
```

1. 點選 StackBlitz 標頭中的「Fork」按鈕。這會為你建立一份帶有此變更的新副本，並以法文重新執行範例。
