# 在範本中使用管線

若要套用管線，請在範本表達式中使用管線運算子 (`|`)，如下列程式碼範例所示。

<docs-code header="app.component.html">
<p>The hero's birthday is {{ birthday | date }}</p>
</docs-code>

元件的 `birthday` 值經由管線運算子 (`|`) 傳送至 [`DatePipe`](api/common/DatePipe)，其管線名稱為 `date`。
該管線以預設格式呈現日期，例如 **2023 年 4 月 7 日**。

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

## 管道額外參數

管道可以採用額外參數來設定轉換。參數可以是選用或必填。

例如，`date` 管道採用控制日期顯示格式的選用參數。
若要指定參數，請在管道名稱後加上冒號 (`:`) 和參數值 (格式)。

<docs-code header="app.component.html">
<p>The hero's birthday is in {{ birthday | date:'yyyy' }}</p>
</docs-code>

管道也可以接受多個參數。您可以透過冒號 (`:` ) 將這些參數分隔開來傳遞多個參數。
例如， `date` 管道接受第二個可選參數來控制時區。

<docs-code header="app.component.html">
<p>The current time is: {{ currentTime | date:'hh:mm':'UTC' }}</p>
</docs-code>

這將顯示目前時間（如 `10:53`）在 `UTC` 時區。

## 連接管道

你可以連接多個管道，以便一個管道的輸出成為下一個管道的輸入。

以下範例將日期傳遞給 `DatePipe`，然後將結果轉發到 [`UpperCasePipe`](api/common/UpperCasePipe 'API 參考') 管道。

<docs-code header="app.component.html">
<p>The hero's birthday is {{ birthday | date }}</p>
<p>The hero's birthday is in {{ birthday | date:'yyyy' | uppercase }}</p>
</docs-code>
