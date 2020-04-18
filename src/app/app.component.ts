import { Component, OnInit } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';

import { WebNotificationService } from './shared/web-notification.service';

@Component({
  selector: 'bm-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  permission: NotificationPermission | null = null;

  constructor(
    private swUpdate: SwUpdate,
    private notificationService: WebNotificationService
  ) {}

  ngOnInit() {
    if (this.swUpdate.isEnabled) {
      this.swUpdate.available.subscribe(e => {
        const currentVersion = e.current.appData['version'];
        const newVersion = e.available.appData['version'];
        const changelog = e.current.appData['changelog'];
        const confirmationText = `Ein Update ist verfügbar von ${currentVersion} zu ${newVersion}.
        Änderungen: ${changelog}
        Update installieren?`;

        if (window.confirm(confirmationText)) {
          window.location.reload();
        }
      });
    }
    this.permission = this.notificationService.isEnabled
      ? Notification.permission
      : null;
  }

  subscribeToNotifications() {
    this.notificationService.subscribeToNotifications()
      .then(() => this.permission = Notification.permission);
  }
}
