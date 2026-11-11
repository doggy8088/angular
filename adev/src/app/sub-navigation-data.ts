/*!
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */

import {NavigationItem} from '@angular/docs';

import FIRST_APP_TUTORIAL_NAV_DATA from '../../src/assets/tutorials/first-app/routes.json';
import LEARN_ANGULAR_TUTORIAL_NAV_DATA from '../../src/assets/tutorials/learn-angular/routes.json';

import {DefaultPage} from './core/enums/pages';
import {getApiNavigationItems} from './features/references/helpers/manifest.helper';

interface SubNavigationData {
  docs: NavigationItem[];
  reference: NavigationItem[];
  tutorials: NavigationItem[];
  footer: NavigationItem[];
}

const DOCS_SUB_NAVIGATION_DATA: NavigationItem[] = [
  {
    label: '簡介',
    children: [
      {
        label: '什麼是 Angular？',
        path: 'overview',
        contentPath: 'introduction/what-is-angular',
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
            label: '管理動態資料',
            path: 'essentials/managing-dynamic-data',
            contentPath: 'introduction/essentials/managing-dynamic-data',
          },
          {
            label: '算繪動態範本',
            path: 'essentials/rendering-dynamic-templates',
            contentPath: 'introduction/essentials/rendering-dynamic-templates',
          },
          {
            label: '條件與迴圈',
            path: 'essentials/conditionals-and-loops',
            contentPath: 'introduction/essentials/conditionals-and-loops',
          },
          {
            label: '處理使用者互動',
            path: 'essentials/handling-user-interaction',
            contentPath: 'introduction/essentials/handling-user-interaction',
          },
          {
            label: '共享程式碼',
            path: 'essentials/sharing-logic',
            contentPath: 'introduction/essentials/sharing-logic',
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
        label: '元件',
        children: [
          {
            label: '元件的組成結構',
            path: 'guide/components',
            contentPath: 'guide/components/anatomy-of-components',
          },
          {
            label: '匯入與使用元件',
            path: 'guide/components/importing',
            contentPath: 'guide/components/importing',
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
            label: '以函式為基礎的 outputs',
            path: 'guide/components/output-fn',
            contentPath: 'guide/components/output-function',
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
        label: '範本語法',
        children: [
          {
            label: '範本語法',
            path: 'guide/templates',
            contentPath: 'guide/templates/overview',
          },
          {
            label: '以插值顯示值',
            path: 'guide/templates/interpolation',
            contentPath: 'guide/templates/interpolation',
          },
          {
            label: '範本陳述式',
            path: 'guide/templates/template-statements',
            contentPath: 'guide/templates/template-statements',
          },
          {
            label: '繫結動態文字、屬性與 attribute',
            path: 'guide/templates/binding',
            contentPath: 'guide/templates/binding',
          },
          {
            label: '屬性繫結',
            path: 'guide/templates/property-binding',
            contentPath: 'guide/templates/property-binding',
          },
          {
            label: '屬性繫結最佳實務',
            path: 'guide/templates/property-binding-best-practices',
            contentPath: 'guide/templates/property-binding-best-practices',
          },
          {
            label: 'attribute 繫結',
            path: 'guide/templates/attribute-binding',
            contentPath: 'guide/templates/attribute-binding',
          },
          {
            label: '類別與樣式繫結',
            path: 'guide/templates/class-binding',
            contentPath: 'guide/templates/class-binding',
          },
          {
            label: '事件繫結',
            path: 'guide/templates/event-binding',
            contentPath: 'guide/templates/event-binding',
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
            children: [
              {
                label: '了解管道',
                path: 'guide/pipes',
                contentPath: 'guide/pipes/overview',
              },
              {
                label: '在範本中使用管道',
                path: 'guide/pipes/template',
                contentPath: 'guide/pipes/template',
              },
              {
                label: '用自訂管道進行新的轉換',
                path: 'guide/pipes/transform-data',
                contentPath: 'guide/pipes/transform-data',
              },
              {
                label: '範本運算式中管道的優先順序',
                path: 'guide/pipes/precedence',
                contentPath: 'guide/pipes/precedence',
              },
              {
                label: '管道與變更偵測',
                path: 'guide/pipes/change-detection',
                contentPath: 'guide/pipes/change-detection',
              },
              {
                label: '從 observable 解開資料',
                path: 'guide/pipes/unwrapping-data-observables',
                contentPath: 'guide/pipes/unwrapping-data-observables',
              },
            ],
          },
          {
            label: '了解範本變數',
            path: 'guide/templates/reference-variables',
            contentPath: 'guide/templates/reference-variables',
          },
          {
            label: '將 SVG 用作範本',
            path: 'guide/templates/svg-in-templates',
            contentPath: 'guide/templates/svg-in-templates',
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
        ],
      },
      {
        label: '依賴注入',
        children: [
          {
            label: 'Angular 中的依賴注入',
            path: 'guide/di',
            contentPath: 'guide/di/overview',
          },
          {
            label: '了解依賴注入',
            path: 'guide/di/dependency-injection',
            contentPath: 'guide/di/dependency-injection',
          },
          {
            label: '建立可注入的服務',
            path: 'guide/di/creating-injectable-service',
            contentPath: 'guide/di/creating-injectable-service',
          },
          {
            label: '定義依賴提供者',
            path: 'guide/di/dependency-injection-providers',
            contentPath: 'guide/di/dependency-injection-providers',
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
        ],
      },
      {
        label: '訊號',
        children: [
          {
            label: 'Angular 訊號',
            path: 'guide/signals',
            contentPath: 'guide/signals/overview',
          },
          {
            label: 'RxJS 互通',
            path: 'guide/signals/rxjs-interop',
            contentPath: 'guide/signals/rxjs-interop',
          },
          {
            label: '訊號輸入',
            path: 'guide/signals/inputs',
            contentPath: 'guide/signals/inputs',
          },
          {
            label: '模型輸入',
            path: 'guide/signals/model',
            contentPath: 'guide/signals/model',
          },
          {
            label: '訊號查詢',
            path: 'guide/signals/queries',
            contentPath: 'guide/signals/queries',
          },
        ],
      },
      {
        label: '路由',
        children: [
          {
            label: 'Angular 路由',
            path: 'guide/routing',
            contentPath: 'guide/routing/overview',
          },
          {
            label: '其他常見的路由任務',
            path: 'guide/routing/common-router-tasks',
            contentPath: 'guide/routing/common-router-tasks',
          },
          {
            label: '單頁應用程式中的路由',
            path: 'guide/routing/router-tutorial',
            contentPath: 'guide/routing/router-tutorial',
          },
          {
            label: '建立自訂路由比對',
            path: 'guide/routing/routing-with-urlmatcher',
            contentPath: 'guide/routing/routing-with-urlmatcher',
          },
          {
            label: '路由器參考',
            path: 'guide/routing/router-reference',
            contentPath: 'guide/routing/router-reference',
          },
        ],
      },
      {
        label: '表單',
        children: [
          {
            label: 'Angular 中的表單',
            path: 'guide/forms',
            contentPath: 'guide/forms/overview',
          },
          {
            label: '反應式表單',
            path: 'guide/forms/reactive-forms',
            contentPath: 'guide/forms/reactive-forms',
          },
          {
            label: '型別化表單',
            path: 'guide/forms/typed-forms',
            contentPath: 'guide/forms/typed-forms',
          },
          {
            label: '建立範本驅動表單',
            path: 'guide/forms/template-driven-forms',
            contentPath: 'guide/forms/template-driven-forms',
          },
          {
            label: '驗證表單輸入',
            path: 'guide/forms/form-validation',
            contentPath: 'guide/forms/form-validation',
          },
          {
            label: '建立動態表單',
            path: 'guide/forms/dynamic-forms',
            contentPath: 'guide/forms/dynamic-forms',
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
        label: '效能',
        children: [
          {
            label: '可延遲檢視',
            path: 'guide/defer',
            contentPath: 'guide/defer',
          },
          {
            label: '開始使用 NgOptimizedImage',
            path: 'guide/image-optimization',
            contentPath: 'guide/image-optimization',
          },
          {
            label: '伺服器端與混合渲染',
            path: 'guide/ssr',
            contentPath: 'guide/ssr',
          },
          {
            label: '建置時預渲染',
            path: 'guide/prerendering',
            contentPath: 'guide/prerendering',
          },
          {
            label: '水合',
            path: 'guide/hydration',
            contentPath: 'guide/hydration',
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
            label: '程式碼覆蓋率',
            path: 'guide/testing/code-coverage',
            contentPath: 'guide/testing/code-coverage',
          },
          {
            label: '測試服務',
            path: 'guide/testing/services',
            contentPath: 'guide/testing/services',
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
            label: '為測試除錯',
            path: 'guide/testing/debugging',
            contentPath: 'guide/testing/debugging',
          },
          {
            label: '測試工具 API',
            path: 'guide/testing/utility-apis',
            contentPath: 'guide/testing/utility-apis',
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
        children: [
          {
            label: 'Angular 動畫簡介',
            path: 'guide/animations',
            contentPath: 'guide/animations/overview',
          },
          {
            label: '動畫轉場與觸發器',
            path: 'guide/animations/transition-and-triggers',
            contentPath: 'guide/animations/transition-and-triggers',
          },
          {
            label: '複雜動畫序列',
            path: 'guide/animations/complex-sequences',
            contentPath: 'guide/animations/complex-sequences',
          },
          {
            label: '可重複使用的動畫',
            path: 'guide/animations/reusable-animations',
            contentPath: 'guide/animations/reusable-animations',
          },
          {
            label: '路由轉場動畫',
            path: 'guide/animations/route-animations',
            contentPath: 'guide/animations/route-animations',
          },
        ],
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
            label: '開始使用 Angular CLI 的新建置系統',
            path: 'tools/cli/esbuild',
            contentPath: 'tools/cli/esbuild',
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
        label: 'DevTools 總覽',
        path: 'tools/devtools',
        contentPath: 'tools/devtools',
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
        label: '效能',
        children: [
          {
            label: '執行期效能最佳化',
            path: 'best-practices/runtime-performance',
            contentPath: 'best-practices/runtime-performance/overview',
          },
          {
            label: '解決 Zone 污染',
            path: 'best-practices/zone-pollution',
            contentPath: 'best-practices/runtime-performance/zone-pollution',
          },
          {
            label: '緩慢的計算',
            path: 'best-practices/slow-computations',
            contentPath: 'best-practices/runtime-performance/slow-computations',
          },
          {
            label: '略過元件子樹',
            path: 'best-practices/skipping-subtrees',
            contentPath: 'best-practices/runtime-performance/skipping-subtrees',
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
    label: '擴充生態系',
    children: [
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
        path: 'https://material.angular.io/cdk/categories',
      },
      {
        label: 'Angular Material',
        path: 'https://material.angular.io/',
      },
    ],
  },
];

export const TUTORIALS_SUB_NAVIGATION_DATA: NavigationItem[] = [
  FIRST_APP_TUTORIAL_NAV_DATA,
  LEARN_ANGULAR_TUTORIAL_NAV_DATA,
  {
    path: DefaultPage.TUTORIALS,
    contentPath: 'tutorials/home',
    label: '教學',
  },
];

const REFERENCE_SUB_NAVIGATION_DATA: NavigationItem[] = [
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
        path: 'cli/analytics',
      },
      {
        label: 'ng build',
        path: 'cli/build',
      },
      {
        label: 'ng cache',
        path: 'cli/cache',
      },
      {
        label: 'ng completion',
        path: 'cli/completion',
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
        label: 'ng doc',
        path: 'cli/doc',
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
        path: 'cli/generate',
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
      {
        label: 'NG0100: 運算式的值在檢查後發生變更',
        path: 'errors/NG0100',
        contentPath: 'reference/errors/NG0100',
      },
      {
        label: 'NG01101: 非同步驗證器的回傳型別錯誤',
        path: 'errors/NG01101',
        contentPath: 'reference/errors/NG01101',
      },
      {
        label: 'NG01203: 缺少值存取器',
        path: 'errors/NG01203',
        contentPath: 'reference/errors/NG01203',
      },
      {
        label: 'NG0200: 依賴注入中的循環依賴',
        path: 'errors/NG0200',
        contentPath: 'reference/errors/NG0200',
      },
      {
        label: 'NG0201: 找不到 Provider',
        path: 'errors/NG0201',
        contentPath: 'reference/errors/NG0201',
      },
      {
        label: 'NG0203: `inject()` 必須在注入上下文中呼叫',
        path: 'errors/NG0203',
        contentPath: 'reference/errors/NG0203',
      },
      {
        label: 'NG0209: 無效的 multi provider',
        path: 'errors/NG0209',
        contentPath: 'reference/errors/NG0209',
      },
      {
        label: 'NG02200: 缺少 Iterable Differ',
        path: 'errors/NG02200',
        contentPath: 'reference/errors/NG02200',
      },
      {
        label: 'NG02800: HttpClient 設定中的 JSONP 支援',
        path: 'errors/NG02800',
        contentPath: 'reference/errors/NG02800',
      },
      {
        label: 'NG0300: 選擇器衝突',
        path: 'errors/NG0300',
        contentPath: 'reference/errors/NG0300',
      },
      {
        label: 'NG0301: 找不到 Export',
        path: 'errors/NG0301',
        contentPath: 'reference/errors/NG0301',
      },
      {
        label: 'NG0302: 找不到管道',
        path: 'errors/NG0302',
        contentPath: 'reference/errors/NG0302',
      },
      {
        label: 'NG0403: 用於啟動的 NgModule 未指定要初始化的元件',
        path: 'errors/NG0403',
        contentPath: 'reference/errors/NG0403',
      },
      {
        label: 'NG0500: 水合節點不相符',
        path: 'errors/NG0500',
        contentPath: 'reference/errors/NG0500',
      },
      {
        label: 'NG0501: 水合缺少同層節點',
        path: 'errors/NG0501',
        contentPath: 'reference/errors/NG0501',
      },
      {
        label: 'NG0502: 水合缺少節點',
        path: 'errors/NG0502',
        contentPath: 'reference/errors/NG0502',
      },
      {
        label: 'NG0503: 水合不支援 DOM 節點的投影',
        path: 'errors/NG0503',
        contentPath: 'reference/errors/NG0503',
      },
      {
        label: 'NG0504: 跳過水合旗標套用到無效的節點',
        path: 'errors/NG0504',
        contentPath: 'reference/errors/NG0504',
      },
      {
        label: 'NG0505: 伺服器回應中沒有水合資訊',
        path: 'errors/NG0505',
        contentPath: 'reference/errors/NG0505',
      },
      {
        label: 'NG0506: 應用程式持續不穩定',
        path: 'errors/NG0506',
        contentPath: 'reference/errors/NG0506',
      },
      {
        label: 'NG0507: HTML 內容在伺服器端渲染後遭到變更',
        path: 'errors/NG0507',
        contentPath: 'reference/errors/NG0507',
      },
      {
        label: 'NG05104: 找不到根元素',
        path: 'errors/NG05104',
        contentPath: 'reference/errors/NG05104',
      },
      {
        label: 'NG0910: iframe 元素上的不安全繫結',
        path: 'errors/NG0910',
        contentPath: 'reference/errors/NG0910',
      },
      {
        label: 'NG0912: 元件 ID 產生衝突',
        path: 'errors/NG0912',
        contentPath: 'reference/errors/NG0912',
      },
      {
        label: 'NG1001: 引數不是字面值',
        path: 'errors/NG1001',
        contentPath: 'reference/errors/NG1001',
      },
      {
        label: 'NG2003: 缺少權杖',
        path: 'errors/NG2003',
        contentPath: 'reference/errors/NG2003',
      },
      {
        label: 'NG2009: 無效的 Shadow DOM 選擇器',
        path: 'errors/NG2009',
        contentPath: 'reference/errors/NG2009',
      },
      {
        label: 'NG3003: 偵測到匯入循環',
        path: 'errors/NG3003',
        contentPath: 'reference/errors/NG3003',
      },
      {
        label: 'NG05000: 使用不支援的 Zone.js 執行個體進行水合',
        path: 'errors/NG05000',
        contentPath: 'reference/errors/NG05000',
      },
      {
        label: 'NG6100: 把 NgModule.id 設為 module.id 的反模式',
        path: 'errors/NG6100',
        contentPath: 'reference/errors/NG6100',
      },
      {
        label: 'NG8001: 無效的元素',
        path: 'errors/NG8001',
        contentPath: 'reference/errors/NG8001',
      },
      {
        label: 'NG8002: 無效的屬性',
        path: 'errors/NG8002',
        contentPath: 'reference/errors/NG8002',
      },
      {
        label: 'NG8003: 缺少參照目標',
        path: 'errors/NG8003',
        contentPath: 'reference/errors/NG8003',
      },
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
      {
        label: 'NG8101: 不正確的 Banana-in-Box 語法',
        path: 'extended-diagnostics/NG8101',
        contentPath: 'reference/extended-diagnostics/NG8101',
      },
      {
        label: 'NG8102: 對不可為 null 的值使用空值合併運算子',
        path: 'extended-diagnostics/NG8102',
        contentPath: 'reference/extended-diagnostics/NG8102',
      },
      {
        label: 'NG8103: 缺少控制流程指令',
        path: 'extended-diagnostics/NG8103',
        contentPath: 'reference/extended-diagnostics/NG8103',
      },
      {
        label: 'NG8104: 文字屬性未被視為繫結',
        path: 'extended-diagnostics/NG8104',
        contentPath: 'reference/extended-diagnostics/NG8104',
      },
      {
        label: 'NG8105: `*ngFor` 運算式缺少 `let` 關鍵字',
        path: 'extended-diagnostics/NG8105',
        contentPath: 'reference/extended-diagnostics/NG8105',
      },
      {
        label: 'NG8106: 不支援的後綴',
        path: 'extended-diagnostics/NG8106',
        contentPath: 'reference/extended-diagnostics/NG8106',
      },
      {
        label: 'NG8107: 對不可為 null 的值使用可選鏈結',
        path: 'extended-diagnostics/NG8107',
        contentPath: 'reference/extended-diagnostics/NG8107',
      },
      {
        label: 'NG8108: `ngSkipHydration` 應該是靜態屬性',
        path: 'extended-diagnostics/NG8108',
        contentPath: 'reference/extended-diagnostics/NG8108',
      },
      {
        label: 'NG8109: 訊號必須在範本插值中被呼叫',
        path: 'extended-diagnostics/NG8109',
        contentPath: 'reference/extended-diagnostics/NG8109',
      },
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
        label: 'ModuleWithProviders 遷移',
        path: 'reference/migrations/module-with-providers',
        contentPath: 'reference/migrations/module-with-providers',
      },
      {
        label: '型別化表單遷移',
        path: 'reference/migrations/typed-forms',
        contentPath: 'reference/migrations/typed-forms',
      },
      {
        label: '遷移到控制流程語法',
        path: 'reference/migrations/control-flow',
        contentPath: 'reference/migrations/control-flow',
      },
    ],
  },
  {
    label: '概念',
    children: [
      {
        label: '概念',
        path: 'reference/concepts',
        contentPath: 'reference/concepts/overview',
      },
      {
        label: 'NgModule',
        children: [
          {
            label: 'NgModules',
            path: 'guide/ngmodules',
            contentPath: 'guide/ngmodules/overview',
          },
          {
            label: 'JavaScript 模組與 NgModule',
            path: 'guide/ngmodules/vs-jsmodule',
            contentPath: 'guide/ngmodules/vs-jsmodule',
          },
          {
            label: '以根模組啟動你的應用程式',
            path: 'guide/ngmodules/bootstrapping',
            contentPath: 'guide/ngmodules/bootstrapping',
          },
          {
            label: '共享模組',
            path: 'guide/ngmodules/sharing',
            contentPath: 'guide/ngmodules/sharing',
          },
          {
            label: '常用的模組',
            path: 'guide/ngmodules/frequent',
            contentPath: 'guide/ngmodules/frequent',
          },
          {
            label: '功能模組',
            path: 'guide/ngmodules/feature-modules',
            contentPath: 'guide/ngmodules/feature-modules',
          },
          {
            label: '建立 NgModule 的指導原則',
            path: 'guide/ngmodules/module-types',
            contentPath: 'guide/ngmodules/module-types',
          },
          {
            label: '在模組中提供相依性',
            path: 'guide/ngmodules/providers',
            contentPath: 'guide/ngmodules/providers',
          },
          {
            label: '單例服務',
            path: 'guide/ngmodules/singleton-services',
            contentPath: 'guide/ngmodules/singleton-services',
          },
          {
            label: '延遲載入功能模組',
            path: 'guide/ngmodules/lazy-loading',
            contentPath: 'guide/ngmodules/lazy-loading',
          },
          {
            label: 'NgModule API',
            path: 'guide/ngmodules/api',
            contentPath: 'guide/ngmodules/api',
          },
          {
            label: 'NgModule FAQ',
            path: 'guide/ngmodules/faq',
            contentPath: 'guide/ngmodules/faq',
          },
        ],
      },
    ],
  },
];

const FOOTER_NAVIGATION_DATA: NavigationItem[] = [
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

// Docs navigation data structure, it's used to display structure in
// navigation-list component And build the routing table for content pages.
export const SUB_NAVIGATION_DATA: SubNavigationData = {
  docs: DOCS_SUB_NAVIGATION_DATA,
  reference: REFERENCE_SUB_NAVIGATION_DATA,
  tutorials: TUTORIALS_SUB_NAVIGATION_DATA,
  footer: FOOTER_NAVIGATION_DATA,
};
