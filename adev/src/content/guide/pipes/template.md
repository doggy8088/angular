# 在範本中使用管道

若要套用管道，請在範本運算式中使用管道運算子（`|`），如下列程式碼範例所示。

<docs-code language="angular-html" header="app.component.html">
<p>The hero's birthday is {{ birthday | date }}</p>
</docs-code>

元件的 `birthday` 值會流經管道運算子（`|`），傳給管道名稱為 `date` 的 [`DatePipe`](api/common/DatePipe)。
管道會以預設格式渲染日期，例如 **Apr 07, 2023**。

<docs-code header="app.component.ts" preview>
import { Component } from '@angular/core';
import { DatePipe } from '@angular/common';

@Component({
  standalone: true,
  templateUrl: './app.component.html',
  imports: [DatePipe],
})
export class AppComponent {
  birthday = new Date();
}
</docs-code>

## 管道的額外參數 {#additional-parameters-for-pipes}

管道可以接受用來設定轉換方式的額外參數。參數可以是選擇性的，也可以是必填的。

例如，`date` 管道接受控制日期顯示格式的選擇性參數。
若要指定參數，請在管道名稱後面加上冒號（`:`），再接著參數值（即格式）。

<docs-code language="angular-html" header="app.component.html">
<p>The hero's birthday is in {{ birthday | date:'yyyy' }}</p>
</docs-code>

管道也可以接受多個參數。你可以用冒號（`:`）分隔，傳入多個參數。
例如，`date` 管道接受第二個選擇性參數，用來控制時區。

<docs-code header="app.component.html">
<p>The current time is: {{ currentTime | date:'hh:mm':'UTC' }}</p>
</docs-code>

這會以 `UTC` 時區顯示目前時間（例如 `10:53`）。

## 串連管道 {#chaining-pipes}

你可以串連多個管道，讓一個管道的輸出成為下一個管道的輸入。

下列範例把日期傳給 `DatePipe`，再把結果轉交給 [`UpperCasePipe`](api/common/UpperCasePipe 'API reference') 管道。

<docs-code language="angular-html" header="app.component.html">
<p>The hero's birthday is {{ birthday | date }}</p>
<p>The hero's birthday is in {{ birthday | date:'yyyy' | uppercase }}</p>
</docs-code>
