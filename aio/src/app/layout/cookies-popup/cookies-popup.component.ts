import { Component, Inject } from '@angular/core';
import { LocalStorage } from 'app/shared/storage.service';

export const storageKey = 'aio-accepts-cookies';

@Component({
  selector: 'aio-cookies-popup',
  template: `
    <div class="cookies-popup no-print" *ngIf="!hasAcceptedCookies">
      <h2 class="visually-hidden">Cookie 同意通知</h2>

      這個網站使用 Google 的 Cookie 來提供服務並分析流量。

      <div class="actions">
        <a mat-button href="https://policies.google.com/technologies/cookies" target="_blank" rel="noopener">
          瞭解詳情
        </a>
        <button mat-button (click)="acceptCookies()">
          好，我知道了
        </button>
      </div>
    </div>
  `,
})
export class CookiesPopupComponent {
  /** Whether the user has already accepted the cookies disclaimer. */
  hasAcceptedCookies: boolean;

  constructor(@Inject(LocalStorage) private storage: Storage) {
    this.hasAcceptedCookies = this.storage.getItem(storageKey) === 'true';
  }

  acceptCookies() {
    this.storage.setItem(storageKey, 'true');
    this.hasAcceptedCookies = true;
  }
}
