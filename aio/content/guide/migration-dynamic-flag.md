
# 動態查詢旗標遷移

## 這個遷移做什麼？

在 Angular 第 8 版中，有一個原理圖為所有 `@ViewChild()` 和 `@ContentChild()` 查詢加上了 `static` 旗標。
這是改變預設行為的第一步。
到了第 9 版，預設值改為 `static: false`，旗標也變成可選。

這個原理圖會掃描編譯中的類別，逐一檢查其成員是否有帶 `static` 旗標且值為 `false` 的 `@ViewChild()` 或 `@ContentChild()` 查詢。
若有，原理圖會移除該旗標，因為它現在與預設值相同。

**之前：**
```ts
@ViewChild('foo', {static: false}) foo: ElementRef;

@ViewChild('bar', {static: true}) bar: ElementRef;
```


**之後：**
```ts
@ViewChild('foo') foo: ElementRef;

// this query doesn't change because the static value is true
@ViewChild('bar', {static: true}) bar: ElementRef;
```

請注意，`@ViewChildren()` 和 `@ContentChildren()` 查詢不支援此旗標，因此原理圖不會檢查這些屬性。


## 為什麼需要這個遷移？

這個原理圖會清理程式碼，移除與預設值相同的 `static` 旗標，因為它們已不再必要。
就功能而言，這項程式碼變更應該是無操作（noop）。

在第 9 版之前，Angular 會根據範本的寫法，自動判斷查詢是靜態還是動態。
然而，這種檢視範本的方式會造成有缺陷且出人意料的行為（更多資訊請見[靜態查詢遷移指南](guide/static-query-migration#這個旗標是什麼意思為什麼需要它)）。
到了第 9 版，Angular 預設使用動態查詢（`static: false`），讓查詢更簡單。
必要時，開發者仍可明確將查詢設為 `static: true`。



<div class=" alert is-helpful">

### 靜態查詢與動態查詢有什麼區別？

`@ViewChild()` 和 `@ContentChild()` 查詢的 `static` 選項決定了查詢結果何時可用。

對於靜態查詢（`static: true`），查詢會在檢視建立後、但在變更偵測執行前解析。
不過，結果永遠不會更新以反映檢視的變更，例如 `ngIf` 和 `ngFor` 區塊的變更。

對於動態查詢（`static: false`），查詢會在 `@ViewChild()` 的 `ngAfterViewInit()` 或 `@ContentChild()` 的 `ngAfterContentInit()` 之後解析。
結果會隨著檢視的變更而更新，例如 `ngIf` 和 `ngFor` 區塊的變更。

更多資訊請見[靜態查詢遷移指南](guide/static-query-migration)的下列條目：

* [我該如何選擇 `static` 旗標的值：`true` 或 `false`？](guide/static-query-migration#我該如何選擇-static-旗標的值true-或-false)

* [有沒有什麼情況下我應該使用 `{static: true}`？](guide/static-query-migration#有沒有什麼情況下我應該使用-static-true)

</div>


## 這對函式庫意味著什麼？

為了支援仍在第 8 版執行的應用程式，函式庫最安全的選項是保留 `static` 旗標，讓解析時機保持一致。

- *第 9 版的函式庫搭配第 8 版執行的應用程式：*

  原理圖不會對函式庫執行。
  只要函式庫保留第 8 版的 `static` 旗標，就應該能在第 8 版的應用程式上運作。

- *第 8 版的函式庫搭配第 9 版執行的應用程式：*

  函式庫會有明確定義的旗標。
  帶明確旗標的行為並沒有改變。


### 使用未遷移函式庫的應用程式呢？

因為這是無操作的程式碼清理，未遷移的函式庫無論如何都會以相同方式運作。
