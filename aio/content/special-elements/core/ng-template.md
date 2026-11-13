Angular 的 `<ng-template>` 元素定義了一個預設不會渲染的範本。

使用 `<ng-template>`，你可以定義只有在你直接或間接明確指示 Angular 時才會渲染的範本內容，讓你能完全掌控內容顯示的方式與時機。

<div class="alter is-helpful">

  請注意，如果你把內容包在 `<ng-template>` 裡，卻沒有指示 Angular 渲染它，這類內容就不會出現在頁面上。例如，請看以下 HTML 程式碼，Angular 處理時不會渲染片語「Hip! Hip! Hooray!」中間的「Hip!」，因為它被 `<ng-template>` 包住了。

  ```html
    <p>Hip!</p>
    <ng-template>
      <p>Hip!</p>
    </ng-template>
    <p>Hooray!</p>
  ```

</div>


@usageNotes

### 結構指令

`<ng-template>` 的主要用途之一，是容納將由[結構指令](guide/structural-directives)使用的範本內容。這些指令可以根據自身的邏輯，加入或移除範本內容的複本。

使用[結構指令簡寫](guide/structural-directives#結構指令簡寫)時，Angular 會在幕後建立一個 `<ng-template>` 元素。

### TemplateRef

`<ng-template>` 元素會以 `TemplateRef` 類別的實例來表示。

如要將範本的複本加入 DOM，請將這個物件傳給 `ViewContainerRef` 的方法 `createEmbeddedView()`。

### 範本變數

`<ng-template>` 元素可以在範本中使用[標準範本變數](guide/template-reference-variables#angular-如何將值指派給範本變數)來參照。

*這就是 `<ng-template>` 元素用作 `ngIf` else 子句的方式。*

這類範本變數可以搭配 `ngTemplateOutlet` 指令使用，以渲染定義在 `<ng-template>` 標籤內的內容。

### 查詢

[查詢](api/core/Query) \(例如 `ViewChild`\) 可以找到與 `TemplateRef` 元素相關聯的 `<ng-template>`，以便透過程式使用；例如，將它傳給 `ViewContainerRef` 的方法 `createEmbeddedView()`。

### 內容脈絡

在 `<ng-template>` 標籤內，你可以參照周圍外部範本中存在的變數。此外，內容脈絡物件可以與 `<ng-template>` 元素相關聯。這類物件包含的變數，可以透過範本 \(`let` 與 `as`\) 宣告，從範本內容內部存取。
