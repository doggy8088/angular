# 在範本中使用管道

若要套用管道，請在範本運算式中使用管道運算子（`|`），如下列程式碼範例所示，並搭配管道的*名稱*，內建的 [`DatePipe`](api/common/DatePipe) 其名稱為 `date`。

範例中的頁籤顯示以下內容：

*   `app.component.html` 在獨立的範本中使用 `date` 來顯示生日。
*   `hero-birthday1.component.ts` 在元件的行內範本中使用相同的管道，該元件同時設定生日的值。

<code-tabs>
    <code-pane header="src/app/app.component.html" region="hero-birthday-template" path="pipes/src/app/app.component.html"></code-pane>
    <code-pane header="src/app/hero-birthday1.component.ts" path="pipes/src/app/hero-birthday1.component.ts"></code-pane>
</code-tabs>

元件的 `birthday` 值會流經管道運算子 `|`，傳給 [`date`](api/common/DatePipe) 函式。

@reviewed 2022-04-07
