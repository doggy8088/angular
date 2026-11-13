# 貢獻者頁面

我們有官方的紀錄，說明誰在 Angular 團隊（請參閱 https://angular.io/about?group=Angular）、誰是「受信任的協作者」（請參閱 https://angular.io/about?group=Collaborators），等等。

應維護 `contributors.json`，讓我們的「組織圖」保持在單一一致的位置。

## GDE 清單

有兩個頁面：

- https://developers.google.com/experts/all/technology/angular
（Googlers：來源為 http://google3/googledata/devsite/content/en/experts/all/technology/angular.html）
由 Dawid Ostrowski 根據試算表
https://docs.google.com/spreadsheets/d/1_Ls2Kle7NxPBIG8f3OEVZ4gJZ8OCTtBxGYwMPb1TUVE/edit#gid=0 維護。
  <!-- gkalpak: That URL doesn't seem to work any more. New URL: https://developers.google.com/programs/experts/directory/ (?) -->

- 我們的：https://angular.io/about?group=GDE，由 `contributors.json` 衍生而來。

## 關於資料

- `contributors.json` 中的鍵應該是 GitHub 使用者名稱。（目前大多數是，但並非全部。）
  這樣我們就能以 GitHub 作為姓名、頭像等資訊的預設來源。
- 鍵以字母順序排序，新增項目時請保持排序順序。
- 圖片存放在 `aio/content/images/bios/<picture-filename>`。

## 處理資料

請安裝 https://stedolan.github.io/jq/，它非常好用。

```sh
for handle in $(jq keys[] --raw-output < aio/content/marketing/contributors.json)
do echo -e "\n$handle\n---------\n"; curl --silent -H "Authorization: token ${TOKEN}" https://api.github.com/users/$handle \
 | jq ".message,.name,.company,.blog,.bio" --raw-output
done
```

相關的指令碼存放在 `aio/scripts/contributors/`。
