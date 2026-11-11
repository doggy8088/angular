# 遷移到自閉合標籤

Angular 範本自 [v16](https://blog.angular.dev/angular-v16-is-here-4d7a28ec680d#7065) 起支援自閉合標籤。

此原理圖會把應用程式中的範本，遷移為使用自閉合標籤。

使用以下指令執行此原理圖：

<docs-code language="shell">

ng generate @angular/core:self-closing-tag

</docs-code>


#### 遷移前

<docs-code language="angular-html">

<!-- Before -->
<hello-world></hello-world>

<!-- After -->
<hello-world />

</docs-code>
