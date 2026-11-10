# 從 NgStyle 遷移到 style 繫結

此原理圖會把應用程式中 NgStyle 指令的用法，遷移為 style 繫結。
它只會遷移被認為可安全遷移的用法。

使用以下指令執行此原理圖：

```bash
ng generate @angular/core:ngstyle-to-style
```

#### 遷移前

```html
<div [ngStyle]="{'background-color': 'red'}"></div>
```

#### 遷移後

```html
<div [style]="{'background-color': 'red'}"></div>
```

## 設定選項

這項遷移支援幾個選項，可依你的具體需求微調遷移方式。

### `--best-effort-mode`

依預設，遷移會避開以物件參照形式使用 `NgStyle` 的用法。
啟用 `--best-effort-mode` 旗標後，繫結到物件參照的 `ngStyle` 實例也會被遷移。
這樣遷移可能不安全，例如被繫結的物件遭到修改時。

```html
<div [ngStyle]="styleObject"></div>
```

改為

```html
<div [style]="styleObject"></div>
```
