# SVG 作為範本

您可以在 Angular 應用程式中使用 SVG 檔案作為範本。
當您使用 SVG 作為範本時，您可以像使用 HTML 範本一樣使用指令和繫結。
使用這些功能可動態產生互動式圖形。

## SVG 語法範例

以下範例顯示使用 SVG 作為範本的語法。

<docs-code header="src/app/svg.component.ts" path="adev/src/content/examples/template-syntax/src/app/svg.component.ts"/>

若要查看屬性與事件繫結的實際運作狀況，請將下列程式碼加入 `svg.component.svg` 檔案：

<docs-code header="src/app/svg.component.svg" path="adev/src/content/examples/template-syntax/src/app/svg.component.svg"/>

提供的範例使用了 `click()` 事件繫結和屬性繫結語法 \(`[attr.fill]="fillColor"`\)。

