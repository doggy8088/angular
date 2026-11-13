# 靜態查詢遷移指南
​
**給函式庫作者的重要事項：這次遷移對函式庫作者尤其重要，可協助他們的使用者在第 9 版推出（約 2019 年 10 月）後順利升級。**

在第 9 版中，`@ViewChild` 與 `@ContentChild` 查詢的預設設定將會改變，以修正查詢中錯誤且令人意外的行為（可參閱[此處](#what-does-this-flag-mean)了解詳情）。

為了準備這項變更，在第 8 版中，我們會把所有應用程式與函式庫都遷移為明確指定 `@ViewChild` 與 `@ContentChild` 查詢的解析策略。

具體來說，這次遷移會加入明確的「static」旗標，用來決定何時指派該查詢的結果。
加入這個旗標可確保你的程式碼在升級到第 9 版時，行為維持不變。

變更前：

```
// query results sometimes available in `ngOnInit`, sometimes in `ngAfterViewInit` (based on template)
@ViewChild('foo') foo: ElementRef;
```

變更後：

```
// query results available in ngOnInit
@ViewChild('foo', {static: true}) foo: ElementRef;

OR

// query results available in ngAfterViewInit
@ViewChild('foo', {static: false}) foo: ElementRef;
```

從第 9 版開始，`static` 旗標的預設值將為 false。
屆時，任何 `{static: false}` 旗標都可以安全移除，我們也會提供原理圖來為你更新程式碼。

注意：此旗標僅適用於 `@ViewChild` 與 `@ContentChild` 查詢，因為 `@ViewChildren` 與 `@ContentChildren` 查詢沒有靜態與動態的概念（它們一律視為「動態」來解析）。

## 常見問題

{@a what-to-do-with-todo}
### 如果我看到原理圖印出 `/* TODO: add static flag */` 註解，我該怎麼辦？

如果你看到這個註解，表示原理圖無法以靜態方式判斷出正確的旗標。在這種情況下，你必須根據應用程式的行為，自行加入正確的旗標。
如需了解如何選擇，請參閱[下一個問題](#how-do-i-choose)。

{@a how-do-i-choose}
### 我該如何選擇 `static` 旗標的值：`true` 或 `false`？

在官方 API 文件中，我們一直建議在檢視查詢的 [`ngAfterViewInit`](https://angular.io/api/core/ViewChild#description)，以及內容查詢的 [`ngAfterContentInit`](https://angular.io/api/core/ContentChild#description) 中取得查詢結果。
這是因為當這些生命週期鉤子執行時，相關節點的變更偵測已經完成，我們可以保證已經收集到所有可能的查詢結果。

基於相同的原因，大多數應用程式都會想使用 `{static: false}`。這個設定可確保相依於繫結解析的查詢相符項目（例如位於 `*ngIf` 或 `*ngFor` 內的結果）能被查詢找到。

在較為罕見的情況下，可能需要 `{static: true}` 旗標（請參閱[此處的解答](#should-i-use-static-true)）。

{@a should-i-use-static-true}
### 有沒有什麼情況下我應該使用 `{static: true}`？

這個選項是為了支援即時建立內嵌檢視而引入的。
如果你需要在查詢中存取 `TemplateRef` 來動態建立檢視，你將無法在 `ngAfterViewInit` 中這麼做。
該檢視的變更偵測已經執行過，因此用該範本建立新檢視會導致擲出 `ExpressionHasChangedAfterChecked` 錯誤。
在這種情況下，你會想把 `static` 旗標設為 `true`，並在 `ngOnInit` 中建立檢視。
在大多數其他情況下，最佳做法是使用 `{static: false}`。

不過，為了便於遷移到第 8 版，如果你的元件程式碼已經依賴查詢結果在 `ngAfterViewInit`（檢視查詢）或 `ngAfterContentInit`（內容查詢）之前的某個時間點就可用，你可能也會想把 `static` 旗標設為 `true`。
例如，如果你的元件依賴查詢結果在 `ngOnInit` 鉤子或 `@Input` 設值器中就已填入，你就需要把旗標設為 `true`，或是調整元件以適應較晚的時機。

注意：選擇靜態選項表示，巢狀於 `*ngIf` 或 `*ngFor` 中的查詢結果將不會被查詢找到。
這些結果只有在變更偵測執行後才能取得。

{@a what-does-this-flag-mean}
### 這個旗標是什麼意思？為什麼需要它？

查詢的預設行為在歷史上一直沒有文件記載，也令人困惑，而且經常導致難以除錯的問題。
在第 9 版中，我們希望讓查詢行為更一致、更容易理解。

要解釋原因，首先必須了解查詢到目前為止是如何運作的。

如果沒有 `static` 旗標，編譯器會逐案決定每個查詢的解析時機。
所有 `@ViewChild`/`@ContentChild` 查詢在編譯時期都會被歸入兩個類別之一：「靜態」或「動態」。
這個分類決定了查詢結果何時可供使用者使用。

- **靜態查詢**是指結果可以靜態決定的查詢，因為結果不相依於繫結這類執行階段值。
被歸類為靜態的查詢，其結果在該檢視的變更偵測執行之前就已可用（可在 `ngOnInit` 中存取）。

- **動態查詢**是指結果無法靜態決定的查詢，因為結果相依於執行階段值（即繫結）。
被歸類為動態的查詢，其結果要等到該檢視的變更偵測執行後才可用（內容查詢可在 `ngAfterContentInit` 中存取，檢視查詢則在 `ngAfterViewInit` 中存取）。

例如，假設我們有一個元件 `Comp`，其中有這個查詢：

```
@ViewChild(Foo) foo: Foo;
```

以及這個範本：

```
<div foo></div>
```

這個 `Foo` 查詢會被歸類為靜態，因為在編譯時期就已知 `<div>` 上的 `Foo` 執行個體就是該查詢的正確結果。
由於查詢結果不相依於執行階段值，我們不必等到範本的變更偵測執行後才解析查詢。
因此，結果可以在 `ngOnInit` 中取得。

假設查詢相同，但元件範本如下所示：

```
<div foo *ngIf="showing"></div>
```

使用該範本時，查詢會被歸類為動態查詢。
我們必須先知道 `showing` 的執行階段值，才能決定該查詢的正確結果。
因此，變更偵測必須先執行，結果只能在 `ngAfterViewInit` 或查詢屬性的設值器中取得。

這種實作方式的影響是，在查詢相符項目上方任何位置加入 `*ngIf` 或 `*ngFor`，都可能改變該查詢結果可用的時機。

請注意，這些分類僅適用於 `@ViewChild` 與 `@ContentChild` 查詢。
`@ViewChildren` 與 `@ContentChildren` 查詢沒有靜態與動態的概念，因此一律視為「動態」來解析。

這種依據潛在查詢相符項目的位置，在不同時間解析查詢的策略，造成了許多困惑。具體來說：

* 有時查詢結果在 `ngOnInit` 中可用，有時卻不行，而且原因不明（請參閱 [21800](https://github.com/angular/angular/issues/21800) 或 [19872](https://github.com/angular/angular/issues/19872)）。

* `@ViewChild` 查詢與 `@ViewChildren` 查詢的解析時機不同，`@ContentChild` 查詢與 `@ContentChildren` 查詢的解析時機也不同。
如果使用者把 `@ViewChild` 查詢改成 `@ViewChildren` 查詢，程式碼可能會因為時機改變而突然出錯。

* 相依於查詢結果的程式碼，可能在範本中一加入 `*ngIf` 或 `*ngFor` 就突然停止運作。

* 同一個元件的 `@ContentChild` 查詢，在該元件每次使用時，會在生命週期的不同時間解析。
這會導致錯誤行為：搭配 `*ngIf` 使用元件時，會以元件作者不易察覺的細微方式出錯。

在第 9 版中，我們計畫簡化行為，讓所有查詢預設都在變更偵測執行後解析。
範本中查詢相符項目的位置無法再影響查詢結果可用的時機，也不會突然破壞你的程式碼，而且預設行為永遠相同。
這讓邏輯對使用者來說更一致、更容易預測。

話雖如此，如果應用程式確實需要較早取得查詢結果（例如需要查詢結果來建立內嵌檢視），可以加入 `{static: true}` 旗標，明確要求靜態解析。
使用這個旗標，使用者可以表示他們只關心靜態可用的結果，查詢結果會在 `ngOnInit` 之前填入。

{@a view-children-and-content-children}
### 這項變更會影響 `@ViewChildren` 或 `@ContentChildren` 查詢嗎？

不會，這項變更只影響 `@ViewChild` 與 `@ContentChild` 查詢。
`@ViewChildren` 與 `@ContentChildren` 查詢預設就已經是「動態」，且不支援靜態解析。

{@a why-specify-static-false}
### 為什麼我必須指定 `{static: false}`？這不是預設值嗎？

這次遷移的目標，是把尚未升級到第 9 版的應用程式，轉換為與第 9 版相容的查詢模式。
然而，大多數應用程式都會使用函式庫，而且其中有些函式庫可能尚未升級到第 8 版（因此可能沒有正確的旗標）。
由於編譯時會使用應用程式的 Angular 版本，如果我們改變預設值，函式庫元件中查詢的行為就會變成第 8 版的預設值，並可能出錯。
這樣一來，在過渡期間，應用程式的相依項目會維持與先前版本相同的行為。

在 Angular 第 9 版及之後的版本中，移除任何 `{static: false}` 旗標都是安全的，我們會在原理圖中為你執行這項清理。

{@a libraries}
### 我可以繼續使用尚未更新到第 8 版的 Angular 函式庫嗎？

當然可以！
因為我們沒有改變第 8 版的預設查詢行為（也就是，若未設定旗標，編譯器仍會自行選擇時機），當你的應用程式搭配尚未更新到第 8 版的函式庫執行時，該函式庫的運作方式會與第 7 版時相同。
這可以保證你的應用程式在第 8 版中仍能正常運作，即使函式庫需要更長時間才能更新程式碼。

{@a update-library-to-use-static-flag}
### 我可以把函式庫更新到第 8 版（在檢視查詢中加入 `static` 旗標），同時仍與 Angular 第 7 版的應用程式相容嗎？

可以，Angular 團隊建議函式庫更新到第 8 版並加入 `static` 旗標。Angular 第 7 版的應用程式仍可繼續搭配含有這個旗標的函式庫使用。

不過，如果你把函式庫更新到 Angular 第 8 版，並想利用第 8 版的新 API，或想使用較新的相依項目（例如 Typescript 或 RxJS），你的函式庫將不再與 Angular 第 7 版的應用程式相容。如果你的目標是讓函式庫同時相容於 Angular 第 7 版與第 8 版，你完全不應該更新函式庫——除了 `peerDependencies` 中的 `package.json`。

一般來說，最有效率的計畫是讓函式庫採用 6 個月的主要版本週期，並在每次 Angular 更新後遞增主要版本。如此一來，函式庫就能與 Angular 保持相同的發佈節奏。
