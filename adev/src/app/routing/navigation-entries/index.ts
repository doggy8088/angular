/*!
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */

import {isDevMode} from '@angular/core';
import type {NavigationItem} from '@angular/docs';
// These imports are expected to be red because they are generated a build time
// @ts-ignore
import ERRORS_NAV_DATA from '../../../content/reference/errors/routes.json' with {type: 'json'};
// @ts-ignore
import EXT_DIAGNOSTICS_NAV_DATA from '../../../content/reference/extended-diagnostics/routes.json' with {type: 'json'};
// @ts-ignore
import FIRST_APP_TUTORIAL_NAV_DATA from '../../../content/tutorials/first-app/first-app/routes.json' with {type: 'json'};
// @ts-ignore
import LEARN_ANGULAR_TUTORIAL_NAV_DATA from '../../../content/tutorials/learn-angular/learn-angular/routes.json' with {type: 'json'};
// @ts-ignore
import DEFERRABLE_VIEWS_TUTORIAL_NAV_DATA from '../../../content/tutorials/deferrable-views/deferrable-views/routes.json' with {type: 'json'};
// @ts-ignore
import SIGNALS_TUTORIAL_NAV_DATA from '../../../content/tutorials/signals/signals/routes.json' with {type: 'json'};
// @ts-ignore
import SIGNAL_FORMS_TUTORIAL_NAV_DATA from '../../../content/tutorials/signal-forms/signal-forms/routes.json' with {type: 'json'};
// @ts-ignore
import API_MANIFEST_JSON from '../../../assets/manifest.json' with {type: 'json'};

interface SubNavigationData {
  docs: NavigationItem[];
  reference: NavigationItem[];
  tutorials: NavigationItem[];
  footer: NavigationItem[];
}

export const DOCS_SUB_NAVIGATION_DATA: NavigationItem[] = [
  {
    label: '簡介',
    children: [
      {
        label: '什麼是 Angular？',
        path: 'overview',
        contentPath: 'introduction/what-is-angular',
      },
      {
        label: '安裝',
        path: 'installation',
        contentPath: 'introduction/installation',
      },
      {
        label: '精華指南',
        children: [
          {
            label: '精華指南',
            path: 'essentials',
            contentPath: 'introduction/essentials/overview',
          },
          {
            label: '元件',
            path: 'essentials/components',
            contentPath: 'introduction/essentials/components',
          },
          {
            label: '訊號',
            path: 'essentials/signals',
            contentPath: 'introduction/essentials/signals',
          },
          {
            label: '範本',
            path: 'essentials/templates',
            contentPath: 'introduction/essentials/templates',
          },
          {
            label: '使用訊號的表單',
            path: 'essentials/signal-forms',
            contentPath: 'introduction/essentials/signal-forms',
            status: 'new',
          },
          {
            label: '依賴注入',
            path: 'essentials/dependency-injection',
            contentPath: 'introduction/essentials/dependency-injection',
          },
          {
            label: '下一步',
            path: 'essentials/next-steps',
            contentPath: 'introduction/essentials/next-steps',
          },
        ],
      },
      {
        label: 'Start coding! 🚀',
        path: 'tutorials/learn-angular',
      },
    ],
  },
  {
    label: '深入指南',
    children: [
      {
        label: '訊號',
        status: 'updated',
        children: [
          {
            label: 'Angular 訊號',
            path: 'guide/signals',
            contentPath: 'guide/signals/overview',
          },
          {
            label: '使用 linkedSignal 處理相依狀態',
            path: 'guide/signals/linked-signal',
            contentPath: 'guide/signals/linked-signal',
          },
          {
            label: '使用資源處理非同步反應式',
            path: 'guide/signals/resource',
            contentPath: 'guide/signals/resource',
          },
          {
            label: '副作用（effect）',
            path: 'guide/signals/effect',
            contentPath: 'guide/signals/effect',
            status: 'new',
          },
        ],
      },
      {
        label: '元件',
        children: [
          {
            label: '元件的組成結構',
            path: 'guide/components',
            contentPath: 'guide/components/anatomy-of-components',
          },
          {
            label: '元件選擇器',
            path: 'guide/components/selectors',
            contentPath: 'guide/components/selectors',
          },
          {
            label: '元件樣式',
            path: 'guide/components/styling',
            contentPath: 'guide/components/styling',
          },
          {
            label: '以輸入屬性接受資料',
            path: 'guide/components/inputs',
            contentPath: 'guide/components/inputs',
          },
          {
            label: '使用 outputs 的自訂事件',
            path: 'guide/components/outputs',
            contentPath: 'guide/components/outputs',
          },
          {
            label: '使用 ng-content 進行內容投影',
            path: 'guide/components/content-projection',
            contentPath: 'guide/components/content-projection',
          },
          {
            label: '元件宿主元素',
            path: 'guide/components/host-elements',
            contentPath: 'guide/components/host-elements',
          },
          {
            label: '元件生命週期',
            path: 'guide/components/lifecycle',
            contentPath: 'guide/components/lifecycle',
          },
          {
            label: '使用查詢參照元件子元素',
            path: 'guide/components/queries',
            contentPath: 'guide/components/queries',
          },
          {
            label: '使用 DOM API',
            path: 'guide/components/dom-apis',
            contentPath: 'guide/components/dom-apis',
          },
          {
            label: '繼承',
            path: 'guide/components/inheritance',
            contentPath: 'guide/components/inheritance',
          },
          {
            label: '以程式方式渲染元件',
            path: 'guide/components/programmatic-rendering',
            contentPath: 'guide/components/programmatic-rendering',
          },
          {
            label: '元件進階設定',
            path: 'guide/components/advanced-configuration',
            contentPath: 'guide/components/advanced-configuration',
          },
          {
            label: 'Angular 元素概覽',
            path: 'guide/elements',
            contentPath: 'guide/elements',
          },
        ],
      },
      {
        label: '範本',
        children: [
          {
            label: '範本語法',
            path: 'guide/templates',
            contentPath: 'guide/templates/overview',
          },
          {
            label: '繫結動態文字、屬性與 attribute',
            path: 'guide/templates/binding',
            contentPath: 'guide/templates/binding',
          },
          {
            label: '新增事件監聽器',
            path: 'guide/templates/event-listeners',
            contentPath: 'guide/templates/event-listeners',
          },
          {
            label: '雙向繫結',
            path: 'guide/templates/two-way-binding',
            contentPath: 'guide/templates/two-way-binding',
          },
          {
            label: '控制流程',
            path: 'guide/templates/control-flow',
            contentPath: 'guide/templates/control-flow',
          },
          {
            label: '管道',
            path: 'guide/templates/pipes',
            contentPath: 'guide/templates/pipes',
          },
          {
            label: '以 ng-content 從父元件算繪範本',
            path: 'guide/templates/ng-content',
            contentPath: 'guide/templates/ng-content',
          },
          {
            label: '以 ng-template 建立範本片段',
            path: 'guide/templates/ng-template',
            contentPath: 'guide/templates/ng-template',
          },
          {
            label: '以 ng-container 將元素分組',
            path: 'guide/templates/ng-container',
            contentPath: 'guide/templates/ng-container',
          },
          {
            label: '範本中的變數',
            path: 'guide/templates/variables',
            contentPath: 'guide/templates/variables',
          },
          {
            label: '以 @defer 延遲載入',
            path: 'guide/templates/defer',
            contentPath: 'guide/templates/defer',
          },
          {
            label: '運算式語法',
            path: 'guide/templates/expression-syntax',
            contentPath: 'guide/templates/expression-syntax',
          },
          {
            label: '範本中的空白',
            path: 'guide/templates/whitespace',
            contentPath: 'guide/templates/whitespace',
          },
        ],
      },
      {
        label: '指令',
        children: [
          {
            label: '指令',
            path: 'guide/directives',
            contentPath: 'guide/directives/overview',
          },
          {
            label: '屬性指令',
            path: 'guide/directives/attribute-directives',
            contentPath: 'guide/directives/attribute-directives',
          },
          {
            label: '結構指令',
            path: 'guide/directives/structural-directives',
            contentPath: 'guide/directives/structural-directives',
          },
          {
            label: '指令組合 API',
            path: 'guide/directives/directive-composition-api',
            contentPath: 'guide/directives/directive-composition-api',
          },
          {
            label: '開始使用 NgOptimizedImage',
            path: 'guide/image-optimization',
            contentPath: 'guide/image-optimization',
          },
        ],
      },
      {
        label: '依賴注入',
        status: 'updated',
        children: [
          {
            label: 'Angular 中的依賴注入',
            path: 'guide/di',
            contentPath: 'guide/di/overview',
            status: 'updated',
          },
          {
            label: '建立與使用服務',
            path: 'guide/di/creating-and-using-services',
            contentPath: 'guide/di/creating-and-using-services',
            status: 'updated',
          },
          {
            label: '定義依賴提供者',
            path: 'guide/di/defining-dependency-providers',
            contentPath: 'guide/di/defining-dependency-providers',
            status: 'updated',
          },
          {
            label: '注入上下文',
            path: 'guide/di/dependency-injection-context',
            contentPath: 'guide/di/dependency-injection-context',
          },
          {
            label: '階層式注入器',
            path: 'guide/di/hierarchical-dependency-injection',
            contentPath: 'guide/di/hierarchical-dependency-injection',
          },
          {
            label: '以輕量注入 token 最佳化用戶端應用程式大小',
            path: 'guide/di/lightweight-injection-tokens',
            contentPath: 'guide/di/lightweight-injection-tokens',
          },
          {
            label: 'DI 實務應用',
            path: 'guide/di/di-in-action',
            contentPath: 'guide/di/di-in-action',
          },
          {
            label: '依賴注入的除錯與疑難排解',
            path: 'guide/di/debugging-and-troubleshooting-di',
            contentPath: 'guide/di/debugging-and-troubleshooting-di',
            status: 'new',
          },
        ],
      },
      {
        label: '路由',
        status: 'updated',
        children: [
          {
            label: 'Angular 路由',
            path: 'guide/routing',
            contentPath: 'guide/routing/overview',
          },
          {
            label: '定義路由',
            path: 'guide/routing/define-routes',
            contentPath: 'guide/routing/define-routes',
          },
          {
            label: '路由載入策略',
            path: 'guide/routing/loading-strategies',
            contentPath: 'guide/routing/loading-strategies',
          },
          {
            label: '使用 outlet 顯示路由',
            path: 'guide/routing/show-routes-with-outlets',
            contentPath: 'guide/routing/show-routes-with-outlets',
          },
          {
            label: '導覽至路由',
            path: 'guide/routing/navigate-to-routes',
            contentPath: 'guide/routing/navigate-to-routes',
          },
          {
            label: '讀取路由狀態',
            path: 'guide/routing/read-route-state',
            contentPath: 'guide/routing/read-route-state',
          },
          {
            label: '重新導向路由',
            path: 'guide/routing/redirecting-routes',
            contentPath: 'guide/routing/redirecting-routes',
          },
          {
            label: '使用守衛控制路由存取',
            path: 'guide/routing/route-guards',
            contentPath: 'guide/routing/route-guards',
          },
          {
            label: '資料解析器',
            path: 'guide/routing/data-resolvers',
            contentPath: 'guide/routing/data-resolvers',
          },
          {
            label: 'Router 生命週期與事件',
            path: 'guide/routing/lifecycle-and-events',
            contentPath: 'guide/routing/lifecycle-and-events',
          },
          {
            label: '測試路由與導覽',
            path: 'guide/routing/testing',
            contentPath: 'guide/routing/testing',
            status: 'new',
          },
          {
            label: '其他常見的路由任務',
            path: 'guide/routing/common-router-tasks',
            contentPath: 'guide/routing/common-router-tasks',
          },
          {
            label: '建立自訂路由比對',
            path: 'guide/routing/routing-with-urlmatcher',
            contentPath: 'guide/routing/routing-with-urlmatcher',
          },
          {
            label: 'Angular 的渲染策略',
            path: 'guide/routing/rendering-strategies',
            contentPath: 'guide/routing/rendering-strategies',
            status: 'new',
          },
          {
            label: '自訂路由行為',
            path: 'guide/routing/customizing-route-behavior',
            contentPath: 'guide/routing/customizing-route-behavior',
            status: 'new',
          },
          {
            label: '路由器參考',
            path: 'guide/routing/router-reference',
            contentPath: 'guide/routing/router-reference',
          },
          {
            label: '路由轉場動畫',
            path: 'guide/routing/route-transition-animations',
            contentPath: 'guide/routing/route-transition-animations',
          },
        ],
      },
      {
        label: '表單',
        status: 'updated',
        preserveOtherCategoryOrder: true,
        children: [
          {
            label: 'Angular 中的表單',
            path: 'guide/forms',
            contentPath: 'guide/forms/overview',
          },

          {
            label: '使用 Angular 訊號的表單',
            path: 'guide/forms/signals/overview',
            contentPath: 'guide/forms/signals/overview',
            category: 'Signal Forms',
            status: 'new',
          },
          {
            label: '表單模型',
            path: 'guide/forms/signals/models',
            contentPath: 'guide/forms/signals/models',
            category: 'Signal Forms',
            status: 'new',
          },
          {
            label: '設計你的表單模型',
            path: 'guide/forms/signals/model-design',
            contentPath: 'guide/forms/signals/designing-your-form-model',
            category: 'Signal Forms',
            status: 'new',
          },
          {
            label: '欄位狀態管理',
            path: 'guide/forms/signals/field-state-management',
            contentPath: 'guide/forms/signals/field-state-management',
            category: 'Signal Forms',
            status: 'new',
          },
          {
            label: '驗證',
            path: 'guide/forms/signals/validation',
            contentPath: 'guide/forms/signals/validation',
            category: 'Signal Forms',
            status: 'new',
          },
          {
            label: '加入表單邏輯',
            path: 'guide/forms/signals/form-logic',
            contentPath: 'guide/forms/signals/form-logic',
            category: 'Signal Forms',
            status: 'new',
          },
          {
            label: '跨欄位邏輯',
            path: 'guide/forms/signals/cross-field-logic',
            contentPath: 'guide/forms/signals/cross-field-logic',
            category: 'Signal Forms',
            status: 'new',
          },
          {
            label: '表單送出',
            path: 'guide/forms/signals/form-submission',
            contentPath: 'guide/forms/signals/form-submission',
            category: 'Signal Forms',
            status: 'new',
          },
          {
            label: '結構定義與結構定義的可組合性',
            path: 'guide/forms/signals/schemas',
            contentPath: 'guide/forms/signals/schemas',
            category: 'Signal Forms',
            status: 'new',
          },
          {
            label: '欄位中繼資料',
            path: 'guide/forms/signals/field-metadata',
            contentPath: 'guide/forms/signals/field-metadata',
            category: 'Signal Forms',
            status: 'new',
          },
          {
            label: '非同步操作',
            path: 'guide/forms/signals/async-operations',
            contentPath: 'guide/forms/signals/async-operations',
            category: 'Signal Forms',
            status: 'new',
          },
          {
            label: '自訂控制項',
            path: 'guide/forms/signals/custom-controls',
            contentPath: 'guide/forms/signals/custom-controls',
            category: 'Signal Forms',
            status: 'new',
          },
          {
            label: '與其他表單方法的比較',
            path: 'guide/forms/signals/comparison',
            contentPath: 'guide/forms/signals/comparison',
            category: 'Signal Forms',
            status: 'new',
          },
          {
            label: '把既有表單遷移到 Signal Forms',
            path: 'guide/forms/signals/migration',
            contentPath: 'guide/forms/signals/migration',
            category: 'Signal Forms',
            status: 'new',
          },
          {
            label: '反應式表單',
            path: 'guide/forms/reactive-forms',
            contentPath: 'guide/forms/reactive-forms',
            category: 'Reactive Forms',
          },
          {
            label: '型別化表單',
            path: 'guide/forms/typed-forms',
            contentPath: 'guide/forms/typed-forms',
            category: 'Reactive Forms',
          },
          {
            label: '建立範本驅動表單',
            path: 'guide/forms/template-driven-forms',
            contentPath: 'guide/forms/template-driven-forms',
            category: 'Template driven Forms',
          },
          {
            label: '驗證表單輸入',
            path: 'guide/forms/form-validation',
            contentPath: 'guide/forms/form-validation',
            category: 'Reactive Forms',
          },
          {
            label: '驗證表單輸入',
            path: 'guide/forms/form-validation',
            contentPath: 'guide/forms/form-validation',
            category: 'Template driven Forms',
          },
          {
            label: '建立動態表單',
            path: 'guide/forms/dynamic-forms',
            contentPath: 'guide/forms/dynamic-forms',
            category: 'Reactive Forms',
          },
        ],
      },
      {
        label: 'HTTP 用戶端',
        children: [
          {
            label: '了解如何透過 HTTP 與後端服務通訊',
            path: 'guide/http',
            contentPath: 'guide/http/overview',
          },
          {
            label: '設定 HttpClient',
            path: 'guide/http/setup',
            contentPath: 'guide/http/setup',
          },
          {
            label: '發出 HTTP 請求',
            path: 'guide/http/making-requests',
            contentPath: 'guide/http/making-requests',
          },
          {
            label: '使用 httpResource 進行反應式資料擷取',
            path: 'guide/http/http-resource',
            contentPath: 'guide/http/http-resource',
          },
          {
            label: '攔截器',
            path: 'guide/http/interceptors',
            contentPath: 'guide/http/interceptors',
          },
          {
            label: '測試請求',
            path: 'guide/http/testing',
            contentPath: 'guide/http/testing',
          },
        ],
      },
      {
        label: '伺服器端與混合渲染',
        children: [
          {
            label: '伺服器端與混合渲染',
            path: 'guide/performance',
            contentPath: 'guide/performance/overview',
          },
          {
            label: '伺服器端與混合渲染',
            path: 'guide/ssr',
            contentPath: 'guide/ssr',
          },
          {
            label: '水合',
            path: 'guide/hydration',
            contentPath: 'guide/hydration',
          },
          {
            label: '漸進式水合',
            path: 'guide/incremental-hydration',
            contentPath: 'guide/incremental-hydration',
          },
        ],
      },
      {
        label: '測試',
        children: [
          {
            label: '單元測試',
            path: 'guide/testing',
            contentPath: 'guide/testing/overview',
          },
          {
            label: '測試元件的基礎知識',
            path: 'guide/testing/components-basics',
            contentPath: 'guide/testing/components-basics',
          },
          {
            label: '元件測試情境',
            path: 'guide/testing/components-scenarios',
            contentPath: 'guide/testing/components-scenarios',
          },
          {
            label: '測試服務',
            path: 'guide/testing/services',
            contentPath: 'guide/testing/services',
          },
          {
            label: '測試屬性指令',
            path: 'guide/testing/attribute-directives',
            contentPath: 'guide/testing/attribute-directives',
          },
          {
            label: '測試管道',
            path: 'guide/testing/pipes',
            contentPath: 'guide/testing/pipes',
          },
          {
            label: '測試路由與導覽',
            path: 'guide/routing/testing',
            contentPath: 'guide/routing/testing',
            status: 'new',
            isCrossReferenced: true,
          },
          {
            label: '為測試除錯',
            path: 'guide/testing/debugging',
            contentPath: 'guide/testing/debugging',
          },
          {
            label: '程式碼覆蓋率',
            path: 'guide/testing/code-coverage',
            contentPath: 'guide/testing/code-coverage',
          },
          {
            label: '測試工具 API',
            path: 'guide/testing/utility-apis',
            contentPath: 'guide/testing/utility-apis',
          },
          {
            label: '元件測試工具總覽',
            path: 'guide/testing/component-harnesses-overview',
            contentPath: 'guide/testing/component-harnesses-overview',
          },
          {
            label: '在測試中使用元件測試工具（component harness）',
            path: 'guide/testing/using-component-harnesses',
            contentPath: 'guide/testing/using-component-harnesses',
          },
          {
            label: '為你的元件建立元件測試工具',
            path: 'guide/testing/creating-component-harnesses',
            contentPath: 'guide/testing/creating-component-harnesses',
          },
          {
            label: '為額外的測試環境加入測試工具支援',
            path: 'guide/testing/component-harnesses-testing-environments',
            contentPath: 'guide/testing/component-harnesses-testing-environments',
          },
          {
            label: '從 Karma 遷移至 Vitest',
            path: 'guide/testing/migrating-to-vitest',
            contentPath: 'guide/testing/migrating-to-vitest',
          },
          {
            label: '使用 Karma 與 Jasmine 進行測試',
            path: 'guide/testing/karma',
            contentPath: 'guide/testing/karma',
          },
          {
            label: 'Zone.js 測試工具',
            path: 'guide/testing/zone-js-testing-utilities',
            contentPath: 'guide/testing/zone-js-testing-utilities',
          },
        ],
      },
      {
        label: 'Angular Aria',
        status: 'new',
        children: [
          {
            label: 'Angular Aria',
            path: 'guide/aria/overview',
            contentPath: 'guide/aria/overview',
          },
          {
            label: 'Accordion',
            path: 'guide/aria/accordion',
            contentPath: 'guide/aria/accordion',
          },
          {
            label: 'Autocomplete',
            path: 'guide/aria/autocomplete',
            contentPath: 'guide/aria/autocomplete',
          },
          {
            label: 'Combobox',
            path: 'guide/aria/combobox',
            contentPath: 'guide/aria/combobox',
          },
          {
            label: 'Grid',
            path: 'guide/aria/grid',
            contentPath: 'guide/aria/grid',
          },
          {
            label: 'Listbox',
            path: 'guide/aria/listbox',
            contentPath: 'guide/aria/listbox',
          },
          {
            label: 'Menu',
            path: 'guide/aria/menu',
            contentPath: 'guide/aria/menu',
          },
          {
            label: 'Menubar',
            path: 'guide/aria/menubar',
            contentPath: 'guide/aria/menubar',
          },
          {
            label: 'Multiselect',
            path: 'guide/aria/multiselect',
            contentPath: 'guide/aria/multiselect',
          },
          {
            label: 'Select',
            path: 'guide/aria/select',
            contentPath: 'guide/aria/select',
          },
          {
            label: 'Tabs',
            path: 'guide/aria/tabs',
            contentPath: 'guide/aria/tabs',
          },
          {
            label: '工具列',
            path: 'guide/aria/toolbar',
            contentPath: 'guide/aria/toolbar',
          },
          {
            label: '樹狀結構',
            path: 'guide/aria/tree',
            contentPath: 'guide/aria/tree',
          },
        ],
      },
      {
        label: '國際化',
        children: [
          {
            label: 'Angular 國際化 (i18n)',
            path: 'guide/i18n',
            contentPath: 'guide/i18n/overview',
          },
          {
            label: '新增 localize 套件',
            path: 'guide/i18n/add-package',
            contentPath: 'guide/i18n/add-package',
          },
          {
            label: '以 ID 參照地區設定',
            path: 'guide/i18n/locale-id',
            contentPath: 'guide/i18n/locale-id',
          },
          {
            label: '依地區設定格式化資料',
            path: 'guide/i18n/format-data-locale',
            contentPath: 'guide/i18n/format-data-locale',
          },
          {
            label: '準備元件以供翻譯',
            path: 'guide/i18n/prepare',
            contentPath: 'guide/i18n/prepare',
          },
          {
            label: '使用翻譯檔案',
            path: 'guide/i18n/translation-files',
            contentPath: 'guide/i18n/translation-files',
          },
          {
            label: '將翻譯合併至應用程式',
            path: 'guide/i18n/merge',
            contentPath: 'guide/i18n/merge',
          },
          {
            label: '部署多個地區設定',
            path: 'guide/i18n/deploy',
            contentPath: 'guide/i18n/deploy',
          },
          {
            label: '匯入地區設定資料的全域變體',
            path: 'guide/i18n/import-global-variants',
            contentPath: 'guide/i18n/import-global-variants',
          },
          {
            label: '以自訂 ID 管理標記的文字',
            path: 'guide/i18n/manage-marked-text',
            contentPath: 'guide/i18n/manage-marked-text',
          },
          {
            label: 'Angular 國際化範例應用程式',
            path: 'guide/i18n/example',
            contentPath: 'guide/i18n/example',
          },
        ],
      },
      {
        label: '動畫',
        status: 'updated',
        children: [
          {
            label: '使用 animate.enter 與 animate.leave 為應用程式加入動畫',
            path: 'guide/animations',
            contentPath: 'guide/animations/enter-and-leave',
            status: 'new',
          },
          {
            label: '使用 CSS 為應用程式加入動畫',
            path: 'guide/animations/css',
            contentPath: 'guide/animations/css',
          },
          {
            label: '路由轉場動畫',
            path: 'guide/routing/route-transition-animations',
            contentPath: 'guide/routing/route-transition-animations',
            isCrossReferenced: true,
          },
        ],
      },
      {
        label: '拖放',
        path: 'guide/drag-drop',
        contentPath: 'guide/drag-drop',
      },
    ],
  },
  {
    label: '用 AI 建置',
    children: [
      {
        label: '用 AI 建置',
        path: 'ai',
        contentPath: 'ai/overview',
      },
      {
        label: 'LLM 提示詞與 AI IDE 設定',
        path: 'ai/develop-with-ai',
        contentPath: 'ai/develop-with-ai',
      },
      {
        label: 'Agent Skills',
        path: 'ai/agent-skills',
        contentPath: 'ai/agent-skills',
        status: 'new',
      },
      {
        label: 'Angular CLI MCP Server',
        path: 'ai/mcp',
        contentPath: 'ai/mcp-server-setup',
      },
      {
        label: 'Angular AI 教學導師',
        path: 'ai/ai-tutor',
        contentPath: 'ai/ai-tutor',
      },
      {
        label: 'AI SDK 與訊號 API 的設計模式',
        path: 'ai/design-patterns',
        contentPath: 'ai/design-patterns',
      },
    ],
  },
  {
    label: '開發者工具',
    children: [
      {
        label: 'Angular CLI',
        children: [
          {
            label: 'Angular CLI',
            path: 'tools/cli',
            contentPath: 'tools/cli/overview',
          },
          {
            label: '設定本機環境與工作區',
            path: 'tools/cli/setup-local',
            contentPath: 'tools/cli/setup-local',
          },
          {
            label: '建置 Angular 應用程式',
            path: 'tools/cli/build',
            contentPath: 'tools/cli/build',
          },
          {
            label: '在開發階段提供 Angular 應用程式',
            path: 'tools/cli/serve',
            contentPath: 'tools/cli/serve',
          },
          {
            label: '部署',
            path: 'tools/cli/deployment',
            contentPath: 'tools/cli/deployment',
          },
          {
            label: '端到端測試',
            path: 'tools/cli/end-to-end',
            contentPath: 'tools/cli/end-to-end',
          },
          {
            label: 'Angular 應用程式建置系統',
            path: 'tools/cli/build-system-migration',
            contentPath: 'tools/cli/build-system-migration',
          },
          {
            label: '設定應用程式環境',
            path: 'tools/cli/environments',
            contentPath: 'tools/cli/environments',
          },
          {
            label: 'Angular CLI 建置器',
            path: 'tools/cli/cli-builder',
            contentPath: 'tools/cli/cli-builder',
          },
          {
            label: '使用原理圖產生程式碼',
            path: 'tools/cli/schematics',
            contentPath: 'tools/cli/schematics',
          },
          {
            label: '撰寫原理圖',
            path: 'tools/cli/schematics-authoring',
            contentPath: 'tools/cli/schematics-authoring',
          },
          {
            label: '程式庫的原理圖',
            path: 'tools/cli/schematics-for-libraries',
            contentPath: 'tools/cli/schematics-for-libraries',
          },
          {
            label: '範本型別檢查',
            path: 'tools/cli/template-typecheck',
            contentPath: 'tools/cli/template-typecheck',
          },
          {
            label: '預先編譯（AOT）',
            path: 'tools/cli/aot-compiler',
            contentPath: 'tools/cli/aot-compiler',
          },
          {
            label: 'AOT 中繼資料錯誤',
            path: 'tools/cli/aot-metadata-errors',
            contentPath: 'tools/cli/aot-metadata-errors',
          },
        ],
      },
      {
        label: '程式庫',
        children: [
          {
            label: 'Angular 程式庫總覽',
            path: 'tools/libraries',
            contentPath: 'tools/libraries/overview',
          },
          {
            label: '建立程式庫',
            path: 'tools/libraries/creating-libraries',
            contentPath: 'tools/libraries/creating-libraries',
          },
          {
            label: '使用發行到 npm 的 Angular 程式庫',
            path: 'tools/libraries/using-libraries',
            contentPath: 'tools/libraries/using-libraries',
          },
          {
            label: 'Angular 套件格式',
            path: 'tools/libraries/angular-package-format',
            contentPath: 'tools/libraries/angular-package-format',
          },
        ],
      },
      {
        label: 'DevTools',
        children: [
          {
            label: 'DevTools 總覽',
            path: 'tools/devtools',
            contentPath: 'tools/devtools/overview',
          },
          {
            label: '檢視元件樹',
            path: 'tools/devtools/component',
            contentPath: 'tools/devtools/component',
          },
          {
            label: '為你的應用程式進行效能分析',
            path: 'tools/devtools/profiler',
            contentPath: 'tools/devtools/profiler',
          },
          {
            label: '檢視你的注入器',
            path: 'tools/devtools/injectors',
            contentPath: 'tools/devtools/injectors',
          },
          // TODO: create those guides
          // The signal debugging docs should also be added to the signal section
          //   label: 'Signals',
          //   path: 'tools/devtools/signals',
          //   contentPath: 'tools/devtools/signals',
          // },
          {
            label: '檢視路由樹',
            path: 'tools/devtools/router',
            contentPath: 'tools/devtools/router',
          },
        ],
      },
      {
        label: 'Angular Language Service',
        path: 'tools/language-service',
        contentPath: 'tools/language-service',
      },
    ],
  },
  {
    label: '最佳實務',
    children: [
      {
        label: 'Angular 程式碼樣式指南',
        path: 'style-guide',
        contentPath: 'best-practices/style-guide',
        status: 'updated',
      },
      {
        label: '安全性',
        path: 'best-practices/security',
        contentPath: 'guide/security', // Have not refactored due to build issues
      },
      {
        label: 'Angular 的無障礙設計',
        path: 'best-practices/a11y',
        contentPath: 'best-practices/a11y',
      },
      {
        label: 'Angular 中未處理的錯誤',
        path: 'best-practices/error-handling',
        contentPath: 'best-practices/error-handling',
      },
      {
        label: '效能',
        preserveOtherCategoryOrder: true,
        children: [
          {
            label: '效能',
            path: 'best-practices/performance',
            contentPath: 'best-practices/performance/overview',
          },

          // Loading Performance
          {
            label: '路由載入策略',
            path: 'best-practices/performance/lazy-loaded-routes',
            contentPath: 'guide/routing/loading-strategies',
            category: 'Loading Performance',
          },
          {
            label: '以 @defer 延遲載入',
            path: 'best-practices/performance/defer',
            contentPath: 'guide/templates/defer',
            category: 'Loading Performance',
          },
          {
            label: '開始使用 NgOptimizedImage',
            path: 'best-practices/performance/image-optimization',
            contentPath: 'guide/image-optimization',
            category: 'Loading Performance',
          },
          {
            label: '伺服器端與混合渲染',
            path: 'best-practices/performance/ssr',
            contentPath: 'guide/ssr',
            category: 'Loading Performance',
          },

          // Runtime Performance
          {
            label: '執行期效能最佳化',
            path: 'best-practices/runtime-performance',
            contentPath: 'best-practices/runtime-performance/overview',
            category: 'Runtime Performance',
          },
          {
            label: '不使用 ZoneJS 的 Angular（Zoneless）',
            path: 'guide/zoneless',
            contentPath: 'guide/zoneless',
            category: 'Runtime Performance',
          },
          {
            label: '緩慢的計算',
            path: 'best-practices/slow-computations',
            contentPath: 'best-practices/runtime-performance/slow-computations',
            category: 'Runtime Performance',
          },
          {
            label: '略過元件子樹',
            path: 'best-practices/skipping-subtrees',
            contentPath: 'best-practices/runtime-performance/skipping-subtrees',
            category: 'Runtime Performance',
          },
          {
            label: '解決 Zone 污染',
            path: 'best-practices/zone-pollution',
            contentPath: 'best-practices/runtime-performance/zone-pollution',
            category: 'Runtime Performance',
          },

          {
            label: '用 Chrome DevTools 做效能分析',
            path: 'best-practices/profiling-with-chrome-devtools',
            contentPath: 'best-practices/runtime-performance/profiling-with-chrome-devtools',
            category: 'Runtime Performance',
          },
        ],
      },
      {
        label: '讓你的 Angular 專案保持最新',
        path: 'update',
        contentPath: 'best-practices/update',
      },
    ],
  },
  {
    label: '開發者活動',
    children: [
      {
        label: 'Angular v21：冒險啟程',
        path: 'events/v21',
        contentPath: 'events/v21',
        status: 'new',
      },
    ],
  },
  {
    label: '擴充生態系',
    children: [
      {
        label: 'NgModules',
        path: 'guide/ngmodules/overview',
        contentPath: 'guide/ngmodules/overview',
      },
      {
        label: '舊版動畫',
        children: [
          {
            label: 'Angular 動畫簡介',
            path: 'guide/legacy-animations',
            contentPath: 'guide/animations/overview',
          },
          {
            label: '動畫轉場與觸發器',
            path: 'guide/legacy-animations/transition-and-triggers',
            contentPath: 'guide/animations/transition-and-triggers',
          },
          {
            label: '複雜動畫序列',
            path: 'guide/legacy-animations/complex-sequences',
            contentPath: 'guide/animations/complex-sequences',
          },
          {
            label: '可重複使用的動畫',
            path: 'guide/legacy-animations/reusable-animations',
            contentPath: 'guide/animations/reusable-animations',
          },
          {
            label: '從 Angular Animations 套件遷移',
            path: 'guide/animations/migration',
            contentPath: 'guide/animations/migration',
          },
        ],
      },
      {
        label: '搭配 Angular 使用 RxJS',
        children: [
          {
            label: 'RxJS 與 Angular 訊號的互通',
            path: 'ecosystem/rxjs-interop',
            contentPath: 'ecosystem/rxjs-interop/signals-interop',
          },
          {
            label: 'RxJS 與元件及指令輸出的互通',
            path: 'ecosystem/rxjs-interop/output-interop',
            contentPath: 'ecosystem/rxjs-interop/output-interop',
          },
          {
            label: '使用 takeUntilDestroyed 取消訂閱',
            path: 'ecosystem/rxjs-interop/take-until-destroyed',
            contentPath: 'ecosystem/rxjs-interop/take-until-destroyed',
          },
        ],
      },
      {
        label: 'Service Worker 與 PWA',
        children: [
          {
            label: 'Angular service worker 總覽',
            path: 'ecosystem/service-workers',
            contentPath: 'ecosystem/service-workers/overview',
          },
          {
            label: '開始使用 service worker',
            path: 'ecosystem/service-workers/getting-started',
            contentPath: 'ecosystem/service-workers/getting-started',
          },
          {
            label: '自訂 Service Worker 指令碼',
            path: 'ecosystem/service-workers/custom-service-worker-scripts',
            contentPath: 'ecosystem/service-workers/custom-service-worker-scripts',
          },
          {
            label: 'Service Worker 設定檔',
            path: 'ecosystem/service-workers/config',
            contentPath: 'ecosystem/service-workers/config',
          },
          {
            label: '與 Service Worker 通訊',
            path: 'ecosystem/service-workers/communications',
            contentPath: 'ecosystem/service-workers/communications',
          },
          {
            label: '推播通知',
            path: 'ecosystem/service-workers/push-notifications',
            contentPath: 'ecosystem/service-workers/push-notifications',
          },
          {
            label: 'Service Worker 運維',
            path: 'ecosystem/service-workers/devops',
            contentPath: 'ecosystem/service-workers/devops',
          },
          {
            label: 'App shell 模式',
            path: 'ecosystem/service-workers/app-shell',
            contentPath: 'ecosystem/service-workers/app-shell',
          },
        ],
      },
      {
        label: '使用 web worker 進行背景處理',
        path: 'ecosystem/web-workers',
        contentPath: 'ecosystem/web-workers',
      },
      {
        label: '自訂建置管線',
        path: 'ecosystem/custom-build-pipeline',
        contentPath: 'ecosystem/custom-build-pipeline',
      },
      {
        label: '在 Angular 中使用 Tailwind CSS',
        path: 'guide/tailwind',
        contentPath: 'guide/tailwind',
        status: 'new',
      },
      {
        label: 'Angular Fire',
        path: 'https://github.com/angular/angularfire#readme',
      },
      {
        label: 'Google Maps',
        path: 'https://github.com/angular/components/tree/main/src/google-maps#readme',
      },
      {
        label: 'Google Pay',
        path: 'https://github.com/google-pay/google-pay-button#angular',
      },
      {
        label: 'YouTube player',
        path: 'https://github.com/angular/components/blob/main/src/youtube-player/README.md',
      },
      {
        label: 'Angular CDK',
        path: 'https://material.angular.dev/cdk/categories',
      },
      {
        label: 'Angular Material',
        path: 'https://material.angular.dev/',
      },
    ],
  },
  ...(isDevMode()
    ? [
        {
          label: 'Adev Dev Guide',
          children: [
            {
              label: '元件總覽',
              path: 'kitchen-sink',
              contentPath: 'kitchen-sink',
            },
          ],
        },
      ]
    : []),
];

export const TUTORIALS_SUB_NAVIGATION_DATA: NavigationItem[] = [
  FIRST_APP_TUTORIAL_NAV_DATA,
  LEARN_ANGULAR_TUTORIAL_NAV_DATA,
  DEFERRABLE_VIEWS_TUTORIAL_NAV_DATA,
  SIGNALS_TUTORIAL_NAV_DATA,
  SIGNAL_FORMS_TUTORIAL_NAV_DATA,
  {
    path: 'tutorials',
    contentPath: 'tutorials/home',
    label: '教學',
  },
];

export const REFERENCE_SUB_NAVIGATION_DATA: NavigationItem[] = [
  {
    label: 'Angular 藍圖',
    path: 'roadmap',
    contentPath: 'reference/roadmap',
  },
  {
    label: 'Get involved',
    path: 'https://github.com/angular/angular/blob/main/CONTRIBUTING.md',
  },
  {
    label: 'API 參考',
    preserveOtherCategoryOrder: true,
    children: [
      {
        label: 'Overview',
        path: 'api',
      },
      ...getApiNavigationItems(),
    ],
  },
  {
    label: 'CLI 參考',
    children: [
      {
        label: 'CLI 參考文件',
        path: 'cli',
        contentPath: 'reference/cli',
      },
      {
        label: 'ng add',
        path: 'cli/add',
      },
      {
        label: 'ng analytics',
        children: [
          {
            label: 'Overview',
            path: 'cli/analytics',
          },
          {
            label: 'disable',
            path: 'cli/analytics/disable',
          },
          {
            label: 'enable',
            path: 'cli/analytics/enable',
          },
          {
            label: 'info',
            path: 'cli/analytics/info',
          },
          {
            label: 'prompt',
            path: 'cli/analytics/prompt',
          },
        ],
      },
      {
        label: 'ng build',
        path: 'cli/build',
      },
      {
        label: 'ng cache',
        children: [
          {
            label: 'Overview',
            path: 'cli/cache',
          },
          {
            label: 'clean',
            path: 'cli/cache/clean',
          },
          {
            label: 'disable',
            path: 'cli/cache/disable',
          },
          {
            label: 'enable',
            path: 'cli/cache/enable',
          },
          {
            label: 'info',
            path: 'cli/cache/info',
          },
        ],
      },
      {
        label: 'ng completion',
        children: [
          {
            label: 'Overview',
            path: 'cli/completion',
          },
          {
            label: 'script',
            path: 'cli/completion/script',
          },
        ],
      },
      {
        label: 'ng config',
        path: 'cli/config',
      },
      {
        label: 'ng deploy',
        path: 'cli/deploy',
      },
      {
        label: 'ng e2e',
        path: 'cli/e2e',
      },
      {
        label: 'ng extract-i18n',
        path: 'cli/extract-i18n',
      },
      {
        label: 'ng generate',
        children: [
          {
            label: 'Overview',
            path: 'cli/generate',
          },
          {
            label: 'ai-config',
            path: 'cli/generate/ai-config',
          },
          {
            label: 'app-shell',
            path: 'cli/generate/app-shell',
          },
          {
            label: 'application',
            path: 'cli/generate/application',
          },
          {
            label: 'class',
            path: 'cli/generate/class',
          },
          {
            label: 'component',
            path: 'cli/generate/component',
          },
          {
            label: 'config',
            path: 'cli/generate/config',
          },
          {
            label: 'directive',
            path: 'cli/generate/directive',
          },
          {
            label: 'enum',
            path: 'cli/generate/enum',
          },
          {
            label: 'environments',
            path: 'cli/generate/environments',
          },
          {
            label: 'guard',
            path: 'cli/generate/guard',
          },
          {
            label: 'interceptor',
            path: 'cli/generate/interceptor',
          },
          {
            label: 'interface',
            path: 'cli/generate/interface',
          },
          {
            label: 'library',
            path: 'cli/generate/library',
          },
          {
            label: 'module',
            path: 'cli/generate/module',
          },
          {
            label: 'pipe',
            path: 'cli/generate/pipe',
          },
          {
            label: 'resolver',
            path: 'cli/generate/resolver',
          },
          {
            label: 'service-worker',
            path: 'cli/generate/service-worker',
          },
          {
            label: 'service',
            path: 'cli/generate/service',
          },
          {
            label: 'web-worker',
            path: 'cli/generate/web-worker',
          },
        ],
      },
      {
        label: 'ng lint',
        path: 'cli/lint',
      },
      {
        label: 'ng new',
        path: 'cli/new',
      },
      {
        label: 'ng run',
        path: 'cli/run',
      },
      {
        label: 'ng serve',
        path: 'cli/serve',
      },
      {
        label: 'ng test',
        path: 'cli/test',
      },
      {
        label: 'ng update',
        path: 'cli/update',
      },
      {
        label: 'ng version',
        path: 'cli/version',
      },
    ],
  },
  {
    label: '錯誤百科',
    children: [
      {
        label: '錯誤百科',
        path: 'errors',
        contentPath: 'reference/errors/overview',
      },
      ...ERRORS_NAV_DATA,
    ],
  },
  {
    label: '擴充診斷',
    children: [
      {
        label: '擴充診斷',
        path: 'extended-diagnostics',
        contentPath: 'reference/extended-diagnostics/overview',
      },
      ...EXT_DIAGNOSTICS_NAV_DATA,
    ],
  },
  {
    label: 'Angular 版本管理與版本發布',
    path: 'reference/releases',
    contentPath: 'reference/releases',
  },
  {
    label: '版本相容性',
    path: 'reference/versions',
    contentPath: 'reference/versions',
  },
  {
    label: 'Update guide',
    path: 'update-guide',
  },
  {
    label: '設定',
    children: [
      {
        label: '工作區與專案檔案結構',
        path: 'reference/configs/file-structure',
        contentPath: 'reference/configs/file-structure',
      },
      {
        label: 'Angular 工作區設定',
        path: 'reference/configs/workspace-config',
        contentPath: 'reference/configs/workspace-config',
      },
      {
        label: 'Angular 編譯器選項',
        path: 'reference/configs/angular-compiler-options',
        contentPath: 'reference/configs/angular-compiler-options',
      },
      {
        label: '工作區的 npm 相依性',
        path: 'reference/configs/npm-packages',
        contentPath: 'reference/configs/npm-packages',
      },
    ],
  },
  {
    label: '遷移',
    children: [
      {
        label: '遷移',
        path: 'reference/migrations',
        contentPath: 'reference/migrations/overview',
      },
      {
        label: '將現有的 Angular 專案遷移到獨立模式',
        path: 'reference/migrations/standalone',
        contentPath: 'reference/migrations/standalone',
      },
      {
        label: '遷移到控制流程語法',
        path: 'reference/migrations/control-flow',
        contentPath: 'reference/migrations/control-flow',
      },
      {
        label: '遷移到 inject 函式',
        path: 'reference/migrations/inject-function',
        contentPath: 'reference/migrations/inject-function',
      },
      {
        label: '遷移到延遲載入路由',
        path: 'reference/migrations/route-lazy-loading',
        contentPath: 'reference/migrations/route-lazy-loading',
      },
      {
        label: '遷移到訊號輸入',
        path: 'reference/migrations/signal-inputs',
        contentPath: 'reference/migrations/signal-inputs',
      },
      {
        label: '遷移到 output 函式',
        path: 'reference/migrations/outputs',
        contentPath: 'reference/migrations/outputs',
      },
      {
        label: '遷移到訊號查詢',
        path: 'reference/migrations/signal-queries',
        contentPath: 'reference/migrations/signal-queries',
      },
      {
        label: '清理未使用的 imports',
        path: 'reference/migrations/cleanup-unused-imports',
        contentPath: 'reference/migrations/cleanup-unused-imports',
      },
      {
        label: '遷移到自閉合標籤',
        path: 'reference/migrations/self-closing-tags',
        contentPath: 'reference/migrations/self-closing-tags',
      },
      {
        label: '從 NgClass 遷移到 class 繫結',
        path: 'reference/migrations/ngclass-to-class',
        contentPath: 'reference/migrations/ngclass-to-class',
        status: 'new',
      },
      {
        label: '從 NgStyle 遷移到 style 繫結',
        path: 'reference/migrations/ngstyle-to-style',
        contentPath: 'reference/migrations/ngstyle-to-style',
        status: 'new',
      },
      {
        label: 'RouterTestingModule 遷移',
        path: 'reference/migrations/router-testing-module-migration',
        contentPath: 'reference/migrations/router-testing-module-migration',
        status: 'new',
      },
      {
        label: '將 CommonModule 轉換為獨立 imports',
        path: 'reference/migrations/common-to-standalone',
        contentPath: 'reference/migrations/common-to-standalone',
        status: 'new',
      },
    ],
  },
];

export const FOOTER_NAVIGATION_DATA: NavigationItem[] = [
  {
    label: 'Angular 媒體資料包',
    path: 'press-kit',
    contentPath: 'reference/press-kit',
  },
  {
    label: 'License',
    path: 'license',
    contentPath: 'reference/license',
  },
];

export const ALL_ITEMS = [
  ...DOCS_SUB_NAVIGATION_DATA,
  ...REFERENCE_SUB_NAVIGATION_DATA,
  ...FOOTER_NAVIGATION_DATA,
  ...TUTORIALS_SUB_NAVIGATION_DATA,
];

function getApiNavigationItems(): NavigationItem[] {
  const manifest = API_MANIFEST_JSON as any; // TODO(mri): Use proper type when the refactoring of #66252 gets in.

  const apiNavigationItems: NavigationItem[] = [];

  for (const packageEntry of manifest) {
    const packageNavigationItem: NavigationItem = {
      label: packageEntry.moduleLabel,
      children: packageEntry.entries.map((api: any) => ({
        path: getApiUrl(packageEntry, api.name),
        label: api.name,
        category: api.category,
      })),
    };

    apiNavigationItems.push(packageNavigationItem);
  }

  return apiNavigationItems;
}

function getApiUrl(packageEntry: any, apiName: string): string {
  const packageName = packageEntry.normalizedModuleName
    // packages like `angular_core` should be `core`
    // packages like `angular_animation_browser` should be `animation/browser`
    .replace('angular_', '')
    .replaceAll('_', '/');
  return `api/${packageName}/${apiName}`;
}
