# 從 NgClass 遷移到 class 繫結

此原理圖會把應用程式中 NgClass 指令的用法，遷移為 class 繫結。
它只會遷移被認為可安全遷移的用法。

使用以下指令執行此原理圖：

```bash
ng generate @angular/core:ngclass-to-class
```

#### 遷移前

```html
<div [ngClass]="{admin: isAdmin, dense: density === 'high'}"></div>
```

#### 遷移後

```html
<div [class]="{admin: isAdmin, dense: density === 'high'}"></div>
```

## 設定選項

這項遷移支援幾個選項，可依你的具體需求微調遷移方式。

### `--migrate-space-separated-key`

依預設，遷移會避開物件實字鍵中含有以空白分隔的 class 名稱的 `NgClass` 用法。
啟用 --migrate-space-separated-key 旗標後，會為每個個別的鍵建立一個繫結。

```html
<div [ngClass]="{'class1 class2': condition}"></div>
```

改為

```html
<div [class.class1]="condition" [class.class2]="condition"></div>
```
