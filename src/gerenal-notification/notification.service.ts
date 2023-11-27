import { Injectable } from '@nestjs/common';
import admin, { messaging } from 'firebase-admin';

@Injectable()
export class NotificationService {
  private readonly messaging: messaging.Messaging;

  constructor() {
    this.messaging = admin.messaging();
  }

  async sendNotification(deviceToken: string, payload): Promise<void> {
   
    await this.messaging.send({
        notification: payload,
        android: {
          priority: 'high'
        }, //{ title: "withdraw", body: "Withdraw requested" },
        token:deviceToken //"d1asJgYt-MecbukBo_UOeJ:APA91bGFJAc6BgGcWWubjUa4WdrV6t1J0gDIDvrCos-nA0FzajoSbiQcM_tdAHD3MHJ-NReWzlnZ0bmr45s9a3jhps_rJmO9a0TnVZeWJ88zmllt7GI4Ouk18NAzq672-xR4E6KnrNX5", // Use the registration token of the web browser
      });
  }
}