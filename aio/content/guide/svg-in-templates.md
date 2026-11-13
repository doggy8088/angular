# 將 SVG 用作範本

你可以在 Angular 應用程式中將 SVG 檔案用作範本。 當你將 SVG 用作範本時，你可以像使用 HTML 範本一樣使用指令與繫結。 使用這些功能來動態產生互動式圖形。

<div class="alert is-helpful">

請參閱 <live-example name="template-syntax"></live-example>，查看包含本指南程式碼片段的實際範例。

</div>

## SVG 語法範例

以下範例展示將 SVG 用作範本的語法。

<code-example header="src/app/svg.component.ts" path="template-syntax/src/app/svg.component.ts"></code-example>

若要查看屬性與事件繫結的實際運作，將以下程式碼加入你的 `svg.component.svg` 檔案：

<code-example header="src/app/svg.component.svg" path="template-syntax/src/app/svg.component.svg"></code-example>

給出的範例使用了 `click()` 事件繫結與屬性繫結語法 \(`[attr.fill]="fillColor"`\)。

<!-- links -->

<!-- external links -->

<!-- end links -->

@reviewed 2022-02-28
