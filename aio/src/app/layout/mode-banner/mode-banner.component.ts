import { Component, Input } from '@angular/core';
import { VersionInfo } from 'app/navigation/navigation.service';

@Component({
  selector: 'aio-mode-banner',
  template: `
    <div *ngIf="mode === 'archive'" class="mode-banner alert archive-warning">
      <p>
        這是 <strong>Angular v{{ version?.major }} 的封存文件。</strong>請前往
        <a href="https://dev.angular.tw/">dev.angular.tw</a> 查看最新版本的文件。
      </p>
    </div>
  `,
})
export class ModeBannerComponent {
  @Input() mode: string;
  @Input() version: VersionInfo;
}
