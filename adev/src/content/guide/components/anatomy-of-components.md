<docs-decorative-header title="元件解剖" imgSrc="adev/src/assets/images/components.svg"> <!-- markdownlint-disable-line -->
</docs-decorative-header>

提示：本指南假設您已經閱讀過 [精華指南](essentials)。如果您是 Angular 新手，請先閱讀該指南。

每個元件必須有：

* 一個具有 _行為_ 的 TypeScript 類別，例如處理使用者輸入和從伺服器擷取資料
* 一個控制內容如何呈現在 DOM 中的 HTML 範本
* 一個定義元件如何在 HTML 中使用的 [CSS 選擇器](https://developer.mozilla.org/zh-TW/docs/Learn/CSS/Building_blocks/Selectors)

您可以藉由在 TypeScript 類別的頂端新增 `@Component` [裝飾器](https://www.typescriptlang.org/docs/handbook/decorators.html) 來提供元件的 Angular 特定資訊：

<docs-code language="ts" highlight="[1, 2, 3, 4]">
@Component({
  selector: 'profile-photo',
  template: `<img src="profile-photo.jpg" alt="Your profile photo">`,
})
export class ProfilePhoto { }
</docs-code>

有關撰寫 Angular 範本的完整詳細資料，請參閱 [範本指南](guide/templates)。

傳遞給 `@Component` 裝飾器的物件稱為元件的 **元資料**。這包括 `selector`、`template` 和本指南中描述的其他屬性。

元件可以選擇性地包含套用到該元件 DOM 的 CSS 樣式清單：

<docs-code language="ts" highlight="[4]">
@Component({
  selector: 'profile-photo',
  template: `<img src="profile-photo.jpg" alt="Your profile photo">`,
  styles: `img { border-radius: 50%; }`,
})
export class ProfilePhoto { }
</docs-code>

預設情況下，元件的樣式只會影響在該元件範本中定義的元素。有關 Angular 的樣式處理方式的詳細資訊，請參閱 [樣式元件](guide/components/styling)。

您可以選擇將您的範本和樣式分別寫在不同的檔案中：

<docs-code language="ts" highlight="[3, 4]">
@Component({
  selector: 'profile-photo',
  templateUrl: 'profile-photo.html',
  styleUrl: 'profile-photo.css',
})
export class ProfilePhoto { }
</docs-code>

這可以幫助將專案中的 _呈現_ 與 _行為_ 的問題分開。您可以為整個專案選擇一種方式，或決定為每個元件使用哪一種。

`templateUrl` 與 `styleUrl` 都是相對於元件所在的目錄。

## 使用元件

每個元件都定義一個 [CSS 選擇器](https://developer.mozilla.org/zh-TW/docs/Learn/CSS/Building_blocks/Selectors)：

<docs-code language="ts" highlight="[2]">
@Component({
  selector: 'profile-photo',
  ...
})
export class ProfilePhoto { }
</docs-code>

有關 Angular 支援的選擇器類型和選擇選擇器的指南，請參閱 [元件選擇器](guide/components/selectors)。

您可透過在 _其他_ 元件範本中建立相符的 HTML 元素來使用元件：

<docs-code language="ts" highlight="[4]">
@Component({
  selector: 'user-profile',
  template: `
    <profile-photo />
    <button>Upload a new profile photo</button>`,
  ...,
})
export class UserProfile { }
</docs-code>

有關如何在範本中參照和使用其他元件的詳細資訊，請參閱 [匯入和使用元件](guide/components/importing)。

Angular 會為它遇到的每個匹配的 HTML 元素建立一個元件實例。與元件選擇器匹配的 DOM 元素稱為該元件的 **主機元素**。元件範本的內容會在其主機元素內呈現。

由元件呈現的 DOM，對應到該元件的範本，稱為該元件的 **檢視**。

以這種方式組合元件，**您可以將您的 Angular 應用程式想成一個元件樹**。

<!-- TODO(josephperrott): enable this mermaid chart -->

```
flowchart TD
    A[AccountSettings]-->B
    A-->C
    B[UserProfile]-->D
    B-->E
    C[PaymentInfo]
    D[ProfilePic]
    E[UserBio]
```

此樹狀結構對於了解其他幾個 Angular 概念很重要，包括 [相依性注入](guide/di) 和 [子查詢](guide/components/queries)。
