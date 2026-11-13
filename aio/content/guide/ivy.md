# 選擇啟用 Angular Ivy

Ivy 是 Angular [次世代編譯與渲染管線](https://blog.angular.io/a-plan-for-version-8-0-and-ivy-b3318dfc19f7)的代號。從 Angular 第 8 版開始，你可以選擇啟用並開始使用 Ivy 的預覽版本，協助其持續的開發與調校。

<div class="alert is-helpful">

   若要預覽 Ivy，請使用 `@angular/core@next` 版的 Angular（8.1.x），而不是 `@angular/core@latest`（8.0.x），因為它包含了所有最新的錯誤修正與改進。

</div>

## 在新專案中使用 Ivy

若要以啟用 Ivy 的狀態開始新專案，請在 [`ng new`](cli/new) 命令中使用 `--enable-ivy` 旗標：

```sh
ng new shiny-ivy-app --enable-ivy
```

新專案會自動針對 Ivy 做好設定。具體來說，專案 `tsconfig.app.json` 檔案中的 enableIvy 選項會被設為 `true`。

## 在現有專案中使用 Ivy

若要更新現有專案以使用 Ivy，請在專案 `tsconfig.app.json` 的 `angularCompilerOptions` 中設定 `enableIvy` 選項。

```json
{
  "compilerOptions": { ... },
  "angularCompilerOptions": {
    "enableIvy": true
  }
}
```

使用 Ivy 的 AOT 編譯速度更快，應預設使用。
在 `angular.json` 工作區設定檔中，把專案的預設建置選項設為永遠使用 AOT 編譯。

```json
{
  "projects": {
    "my-existing-project": {
      "architect": {
        "build": {
          "options": {
            ...
            "aot": true,
          }
        }
      }
    }
  }
}
```

若要停止使用 Ivy 編譯器，請在 `tsconfig.app.json` 中將 `enableIvy` 設為 `false`，或將其完全移除。如果你原本的預設建置選項中沒有 `"aot": true`，也請將它移除。