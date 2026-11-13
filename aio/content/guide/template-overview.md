# 了解範本

在 Angular 中，範本是使用者介面（UI）片段的藍圖。範本以 HTML 撰寫，範本內可以使用特殊語法，來運用 Angular 的許多功能。

## 先備知識

在學習範本語法之前，你應該先熟悉以下內容：

* [Angular 概念](guide/architecture)
* JavaScript
* HTML
* CSS

## 強化 HTML

Angular 以額外的功能擴充了你範本中的 HTML 語法。例如，Angular 的資料繫結語法有助於動態設定文件物件模型（DOM）屬性。

幾乎所有的 HTML 語法都是有效的範本語法。不過，由於 Angular 範本只是 UI 的片段，因此不包含 `<html>`、`<body>` 或 `<base>` 這類元素。

<div class="alert is-important">

為了消除指令碼注入攻擊的風險，Angular 不支援在範本中使用 `<script>` 元素。Angular 會忽略 `<script>` 標籤，並在瀏覽器主控台輸出警告。
如需更多資訊，請參閱[安全性](guide/security)頁面。

</div>

## 範本語法更多資訊

你可能也會對以下內容有興趣：

<div class="card-container">
    <a href="guide/interpolation" class="docs-card" title="插值">
        <section>插值</section>
        <p>了解如何在 HTML 中使用插值與運算式。</p>
        <p class="card-footer">插值</p>
    </a>
    <a href="guide/property-binding" class="docs-card" title="屬性繫結">
        <section>屬性繫結</section>
        <p>設定目標元素或指令 @Input() 裝飾器的屬性。</p>
        <p class="card-footer">屬性繫結</p>
    </a>
    <a href="guide/attribute-binding" class="docs-card" title="attribute 繫結">
        <section>attribute 繫結</section>
        <p>設定 attribute 的值。</p>
        <p class="card-footer">attribute 繫結</p>
    </a>
    <a href="guide/class-binding" class="docs-card" title="類別與樣式繫結">
        <section>類別與樣式繫結</section>
        <p>設定類別與樣式的值。</p>
        <p class="card-footer">類別與樣式繫結</p>
    </a>
    <a href="guide/event-binding" class="docs-card" title="事件繫結">
        <section>事件繫結</section>
        <p>監聽 HTML 中的事件。</p>
        <p class="card-footer">事件繫結</p>
    </a>
    <a href="guide/template-reference-variables" class="docs-card" title="範本參考變數">
        <section>範本參考變數</section>
        <p>使用特殊變數，在範本內參照 DOM 元素。</p>
        <p class="card-footer">範本參考變數</p>
    </a>
    <a href="guide/built-in-directives" class="docs-card" title="內建指令">
        <section>內建指令</section>
        <p>監聽並修改 HTML 的行為與版面配置。</p>
        <p class="card-footer">內建指令</p>
    </a>
    <a href="guide/inputs-outputs" class="docs-card" title="輸入與輸出">
        <section>輸入與輸出</section>
        <p>在父層上下文與子指令或元件之間共享資料。</p>
        <p class="card-footer">輸入與輸出</p>
    </a>
</div>

@reviewed 2022-05-11
 
