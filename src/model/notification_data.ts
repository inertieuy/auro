export interface NotificationData {
  Id: number;
  Title: string;
  Body: string;
  Status: Number;
  IsRead: Number;
  CreatedAt: Date;
}

interface Hub {
  notificationChannel: Record<number, NotificationData[]>;
}
