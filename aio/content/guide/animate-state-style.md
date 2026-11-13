# 為狀態與樣式加上動畫

你可以把一組樣式定義在一起，組成用來為元素與轉場加上動畫的特定狀態。這些狀態代表動畫中某些時間點的樣式，你可以在這些狀態之間來回產生動畫。例如，你可以把一個狀態作為動畫的起點，產生動畫到另一個狀態，再到動畫的終點。

## 什麼是狀態？

狀態是動畫的一種條件。Angular 的 state() 函式接受兩個參數：唯一的名稱與一組樣式。另外還有一個選用參數。

## 為什麼要使用狀態？

為一組樣式取一個別名，讓你可以在動畫中參照該別名。這能讓動畫更容易閱讀，或一眼就看懂。你可以為動畫取一個有用且具描述性的狀態名稱，讓你能快速了解該動畫狀態的用途。

使用 Angular 的 [`state()`](api/animations/state) 函式，定義要在每個轉場結束時呼叫的不同狀態。 這個函式接受兩個參數： 一個唯一的名稱（例如 `open` 或 `closed`）與一個 `style()` 函式。

使用 `style()` 函式定義一組要與指定狀態名稱關聯的樣式。 對於含有連字號的樣式屬性，你必須使用[*駝峰式命名*](guide/glossary#case-conventions)，例如 `backgroundColor`，或把它們用引號包起來，例如 `'background-color'`。

我們來看看 Angular 的 [`state()`](api/animations/state) 函式如何與 `style⁣­(⁠)` 函式搭配，設定 CSS 樣式屬性。 在這段程式碼中，同一時間為該狀態設定了多個樣式屬性。 在 `open` 狀態下，按鈕的高度為 200 像素、不透明度為 1，背景色為黃色。

<code-example header="src/app/open-close.component.ts" path="animations/src/app/open-close.component.ts" region="state1"></code-example>

在接下來的 `closed` 狀態中，按鈕的高度為 100 像素、不透明度為 0.8，背景顏色為藍色。

<code-example header="src/app/open-close.component.ts" path="animations/src/app/open-close.component.ts" region="state2"></code-example>

@reviewed 2022-10-28
