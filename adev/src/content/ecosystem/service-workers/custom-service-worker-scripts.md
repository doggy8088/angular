# 自訂 Service Worker 指令碼

雖然 Angular Service Worker 提供了出色的功能，你可能還是需要加入自訂功能，例如處理推播通知、背景同步，或其他 Service Worker 事件。你可以建立一個自訂 Service Worker 指令碼，匯入並擴充 Angular Service Worker。

## 建立自訂 Service Worker

若要建立一個擴充 Angular 功能的自訂 Service Worker：

1. 在你的 `src` 目錄中建立一個自訂 Service Worker 檔案（例如 `custom-sw.js`）：

```js
// Import the Angular service worker
importScripts('./ngsw-worker.js');

(function () {
  'use strict';

  // Add custom notification click handler
  self.addEventListener('notificationclick', (event) => {
    console.log('Custom notification click handler');
    console.log('Notification details:', event.notification);

    // Handle notification click - open URL if provided
    if (clients.openWindow && event.notification.data.url) {
      event.waitUntil(clients.openWindow(event.notification.data.url));
      console.log('Opening URL:', event.notification.data.url);
    }
  });

  // Add custom background sync handler
  self.addEventListener('sync', (event) => {
    console.log('Custom background sync handler');

    if (event.tag === 'background-sync') {
      event.waitUntil(doBackgroundSync());
    }
  });

  function doBackgroundSync() {
    // Implement your background sync logic here
    return fetch('https://example.com/api/sync')
      .then((response) => response.json())
      .then((data) => console.log('Background sync completed:', data))
      .catch((error) => console.error('Background sync failed:', error));
  }
})();
```

2. 更新你的 `angular.json` 檔案，改用自訂 Service Worker：

```json
{
  "projects": {
    "your-app": {
      "architect": {
        "build": {
          "options": {
            "assets": [
              {
                "glob": "**/*",
                "input": "public"
              },
              "app/src/custom-sw.js"
            ]
          }
        }
      }
    }
  }
}
```

3. 設定 Service Worker 註冊，改用你的自訂指令碼：

```ts
import {ApplicationConfig, isDevMode} from '@angular/core';
import {provideServiceWorker} from '@angular/service-worker';

export const appConfig: ApplicationConfig = {
  providers: [
    provideServiceWorker('custom-sw.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000',
    }),
  ],
};
```

### 自訂 Service Worker 的最佳實務

擴充 Angular Service Worker 時：

- **永遠先匯入 Angular Service Worker**：使用 `importScripts('./ngsw-worker.js')`，確保你能取得所有快取與更新功能
- **把自訂程式碼包在 IIFE 中**（立即呼叫函式運算式），避免污染全域範圍
- **使用 `event.waitUntil()`** 處理非同步操作，確保這些操作在 Service Worker 被終止前完成
- **徹底測試**：同時在開發與生產環境中測試
- **妥善處理錯誤**，避免你的自訂程式碼破壞 Angular Service Worker 的功能

### 常見使用情境

自訂 Service Worker 常見的用途包括：

- **推播通知**：處理傳入的推播訊息並顯示通知
- **背景同步**：在網路連線恢復時同步資料
- **自訂導覽**：處理特殊的路由或離線頁面情境
