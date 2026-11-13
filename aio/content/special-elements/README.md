# 特殊元素

本目錄下的每個子目錄都包含說明「特殊元素」的文件。
這些元素是可以出現在範本中的元素，在 Angular 框架中具有特殊的意義與行為。

每個元素都應該有一個 Markdown 檔案，其檔案名稱與該元素的標籤名稱相同，例如 `ng-container.md`。
檔案應存放在名稱為該元素在文件中所屬 Angular 套件的目錄中 (通常是 `core`)。

## 簡短說明

檔案應包含該元素的「簡短說明」。這是檔案中的第一個段落。

## 詳細說明

簡短說明之後的所有段落，都會被收集為額外的詳細說明。

## 元素屬性

如果特殊元素接受一或多個對 Angular 具有特殊意義的屬性，就應該使用 `@elementAttribute` 標籤來記錄這些屬性。
這些標籤應放在說明之後。

這個標籤的格式如下：

```
@elementAttribute attr="value"

Description of the attribute and value.
```
