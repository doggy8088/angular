# 遷移到控制流程語法


[控制流程語法](guide/templates/control-flow)自 Angular 17 起提供，是使用 *ngFor、*ngIf 與 *ngSwitch 等控制流程指令的簡化方式。 

新語法直接內建於範本中，因此你不再需要匯入 `CommonModule`。但還不只如此，還有一個遷移原理圖，可將你所有的舊程式碼遷移成使用新的控制流程語法，隨 Angular 17 一併提供。使用以下指令執行此原理圖：

<docs-code language="shell">

ng generate @angular/core:control-flow

</docs-code>