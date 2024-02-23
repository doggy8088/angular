# 推播通知

推送通知是一種吸引用戶的有效方法。
透過服務工作者的力量，即使您的應用程式不在焦點上，通知也能傳送到裝置。

Angular 服務工作者能夠顯示推播通知並處理通知點擊事件。

HELPFUL: 當使用 Angular 服務工作者時，推播通知互動會使用 `SwPush` 服務處理。
如需進一步瞭解相關的瀏覽器 API，請參閱 [推播 API](https://developer.mozilla.org/docs/Web/API/Push_API) 和 [使用「通知」API](https://developer.mozilla.org/docs/Web/API/Notifications_API/Using_the_Notifications_API)。

## 通知 payload

使用有效載荷推播訊息來呼叫推播通知。
請參閱 `SwPush` 以取得說明。

HELPFUL：在 Chrome 中，您可以在沒有後端的情況下測試推播通知。
開啟 Devtools -&gt; 應用程式 -&gt; 服務工作者，並使用 `Push` 輸入來發送 JSON 通知有效負載。

## 通知點擊處理

html
<script>
  // This function is called when a notification is clicked
  self.addEventListener('notificationclick', function(event) {
    // Android doesn’t allow notification clicks to
    // open the app, so we’ll log the notification title
    // instead.
    console.log('Notification clicked: ', event.notification.title);
  });
</script>

`notificationclick` 事件的預設行為是關閉通知並通知 `SwPush.notificationClicks`。

您可以透過將 `onActionClick` 屬性新增到 `data` 物件，並提供 `default` 項目，來指定在 `notificationclick` 上執行的其他操作。
這在當沒有開啟的用戶端時通知被點擊時特別有用。

<docs-code language="json">

{
  "notification": {
    "title": "New Notification!",
    "data": {
      "onActionClick": {
        "default": {"operation": "openWindow", "url": "foo"}
      }
    }
  }
}

</docs-code>

### 操作

Angular 服務工作人員支援下列操作：

| 操作                   | 詳細 |
|:---                     |:---     |
| `openWindow`            | 在指定的 URL 開啟新分頁。                                                                                                             |
| `focusLastFocusedOrOpen` | 聚焦最後聚焦的客戶端。如果沒有開啟的客戶端，則在指定的 URL 開啟新分頁。                                      |
| `navigateLastFocusedOrOpen` | 聚焦最後聚焦的客戶端，並將其導航到指定的 URL。如果沒有開啟的客戶端，則在指定的 URL 開啟新分頁。 |
| `sendRequest`           | 將簡單的 GET 要求傳送至指定的 URL。                                                                                                                                                        |

重要提示：網址會相對於服務工作者的註冊範圍解析。<br />如果 `onActionClick` 項目未定義 `url`，則會使用服務工作者的註冊範圍。

### 動作

動作提供一種自訂方式，讓使用者能與通知互動。

使用 `actions` 屬性，您可以定義一組可用的動作。
每個動作都以動作按鈕的形式呈現，使用者可以點擊該按鈕與通知互動。

此外，使用 `data` 物件上的 `onActionClick` 屬性，您可以將每個動作與在對應動作按鈕按一下時要執行的操作連結：

<docs-code language="typescript">

{
  "notification": {
    "title": "New Notification!",
    "actions": [
      {"action": "foo", "title": "Open new tab"},
      {"action": "bar", "title": "Focus last"},
      {"action": "baz", "title": "Navigate last"},
      {"action": "qux", "title": "Send request in the background"}
      {"action": "other", "title": "Just notify existing clients"}
    ],
    "data": {
      "onActionClick": {
        "default": {"operation": "openWindow"},
        "foo": {"operation": "openWindow", "url": "/absolute/path"},
        "bar": {"operation": "focusLastFocusedOrOpen", "url": "relative/path"},
        "baz": {"operation": "navigateLastFocusedOrOpen", "url": "https://other.domain.com/"},
        "qux": {"operation": "sendRequest", "url": "https://yet.another.domain.com/"}
      }
    }
  }
}

</docs-code>

重要：如果動作沒有對應的 `onActionClick` 項目，則通知會關閉，並在現有客戶端上通知 `SwPush.notificationClicks`。

## 更深入了解 Angular 服務工作者

您可能也有興趣：

<docs-pill-row>

<docs-pill href="ecosystem/service-workers/communications" title="與服務工作者溝通"/>
  <docs-pill href="ecosystem/service-workers/devops" title="服務工作者 devops"/>
</docs-pill-row>

