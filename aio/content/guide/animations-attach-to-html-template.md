# 定義動畫並附加到 HTML 範本

動畫是在控制要產生動畫的 HTML 元素之元件的詮釋資料中定義的。

## 定義動畫。

把定義動畫的程式碼放在 `@Component()` 裝飾器內的 `animations:` 屬性之下。

<code-example header="src/app/open-close.component.ts" path="animations/src/app/open-close.component.ts" region="component"></code-example>

當元件的動畫觸發器定義完成後，把它附加到範本中的某個元素上。將觸發器名稱用方括號包起來，並在前面加上 `@` 符號。使用標準的 Angular 屬性繫結語法，把觸發器繫結到範本運算式。`triggerName` 是觸發器的名稱，而 `expression` 會求值為已定義的動畫狀態。

<code-example format="typescript" language="typescript">

&lt;div [&commat;triggerName]="expression"&gt;&hellip;&lt;/div&gt;;

</code-example>

當運算式的值變成新狀態時，動畫就會執行或被觸發。

以下程式碼片段把觸發器繫結到 `isOpen` 屬性的值。

<code-example header="src/app/open-close.component.html" path="animations/src/app/open-close.component.1.html" region="trigger"></code-example>

在這個範例中，當 `isOpen` 運算式求值為已定義的 `open` 或 `closed` 狀態時，它會通知觸發器 `openClose` 有狀態變化。 接著就由 `openClose` 的程式碼處理狀態變化，並啟動狀態變化動畫。

對於進入或離開頁面的元素（插入 DOM 或從 DOM 移除），你可以讓動畫有條件地執行。 例如，在 HTML 範本中搭配動畫觸發器使用 `*ngIf`。

<div class="alert is-helpful">

注意：<br />
在元件檔案中，把定義動畫的觸發器設為 `@Component()` 裝飾器中 `animations:` 屬性的值。

## 把動畫附加到 HTML 範本

在 HTML 範本檔案中，使用觸發器名稱把已定義的動畫附加到要加入動畫的 HTML 元素上。

</div>

@reviewed 2022-10-28
