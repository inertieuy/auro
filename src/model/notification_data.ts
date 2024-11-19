export interface INotificationData {
  id: number;
  title: string;
  body: string;
  status: Number;
  isRead: Number;
  createdAt: Date;
}

export interface IHub {
  notificationChannel: Record<number, INotificationData[]>;
}
