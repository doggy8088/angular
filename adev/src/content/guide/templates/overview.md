<docs-decorative-header title="範本語法" imgSrc="adev/src/assets/images/templates.svg"> <!-- markdownlint-disable-line -->
在 Angular 中，範本是一段 HTML。
在範本中使用特殊語法，就能運用 Angular 的許多功能。
</docs-decorative-header>

TIP: 在深入這份完整指南之前，先看看 Angular 的[入門要點](essentials/templates)。

每個 Angular 元件都有一個**範本**，用來定義該元件渲染到頁面上的 [DOM](https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model)。透過範本，Angular 能在資料變更時自動讓頁面保持最新狀態。

範本通常位於 `*.component.ts` 檔案的 `template` 屬性中，或是 `*.component.html` 檔案裡。若要了解更多，請參閱[元件深入指南](/guide/components)。

## 範本如何運作？

範本以 [HTML](https://developer.mozilla.org/en-US/docs/Web/HTML) 語法為基礎，並額外提供內建範本函式、資料繫結、事件監聽、變數等功能。

Angular 會把範本編譯成 JavaScript，以便在內部建立對應用程式的理解。這麼做的其中一個好處，就是 Angular 會自動為你的應用程式套用內建的渲染優化。

### 與標準 HTML 的差異

範本與標準 HTML 語法之間的一些差異包括：

- 範本原始碼中的註解不會包含在渲染輸出中
- 元件與指令元素可以自我閉合（例如 `<UserProfile />`）
- 帶有特定字元的屬性（例如 `[]`、`()` 等）對 Angular 有特殊意義。詳情請參閱[繫結文件](guide/templates/binding)與[加入事件監聽器文件](guide/templates/event-listeners)。
- `@` 字元對 Angular 有特殊意義，可用來為範本加入動態行為，例如[控制流程](guide/templates/control-flow)。若要包含字面的 `@` 字元，請將它轉義為 HTML 實體碼（`&commat;` 或 `&#64;`）。
- Angular 會忽略並折疊不必要的空白字元。詳情請參閱[範本中的空白](guide/templates/whitespace)。
- Angular 可能會在頁面中加入註解節點，作為動態內容的預留位置，開發者可以忽略這些節點。

此外，雖然大多數 HTML 語法都是有效的範本語法，但 Angular 不支援在範本中使用 `<script>` 元素。詳情請參閱[安全性](best-practices/security)頁面。

## 接下來呢？

你可能也會對以下主題感興趣：

| 主題                                                                      | 說明                                                                                 |
| :-------------------------------------------------------------------------- | :-------------------------------------------------------------------------------------- |
| [繫結動態文字、屬性與特性](guide/templates/binding) | 將動態資料繫結到文字、屬性與特性。                                   |
| [加入事件監聽器](guide/templates/event-listeners)                   | 回應範本中的事件。                                                    |
| [雙向繫結](guide/templates/two-way-binding)                          | 同時繫結一個值並傳播變更。                                     |
| [控制流程](guide/templates/control-flow)                                | 條件式地顯示、隱藏與重複元素。                                           |
| [管道](guide/templates/pipes)                                              | 以宣告方式轉換資料。                                                           |
| [使用 ng-content 嵌入子內容](guide/templates/ng-content)        | 控制元件如何渲染內容。                                                  |
| [使用 ng-template 建立範本片段](guide/templates/ng-template)   | 宣告一個範本片段。                                                            |
| [使用 ng-container 群組元素](guide/templates/ng-container)         | 將多個元素群組在一起，或標記一個渲染位置。                      |
| [範本中的變數](guide/templates/variables)                         | 了解變數宣告。                                                      |
| [使用 @defer 延遲載入](guide/templates/defer)                       | 使用 `@defer` 建立可延遲的檢視。                                                  |
| [運算式語法](guide/templates/expression-syntax)                      | 了解 Angular 運算式與標準 JavaScript 的異同。 |
| [範本中的空白](guide/templates/whitespace)                       | 了解 Angular 如何處理空白。                                                   |
