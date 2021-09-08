import { Component, OnInit } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';

import { WebNotificationService } from './shared/web-notification.service';

interface AppData {
  version: string;
  changelog: string;
}

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

  ngOnInit(): void {
    if (this.swUpdate.isEnabled) {
      this.swUpdate.available.subscribe(e => {
        /* ⚠️ Unterschied zum Buch:
        Das Objekt `e.current.appData` ist als `Object` typisiert und kann hier nicht typsicher verwendet werden.
        Wir haben dafür das Interface `AppData` eingeführt (siehe oben), um die Objekte passend zu typisieren. */
        const currentData = e.current.appData as AppData;
        const availableData = e.available.appData as AppData;

        const confirmationText = `Ein Update ist verfügbar von ${currentData.version} zu ${availableData.version}.
        Änderungen: ${availableData.changelog}
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
