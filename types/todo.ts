export type Todo = {
  id: string;
  title: string;
  description: string;
  date: string;
  completed?: boolean;
  notificationIds?: string[]; // Store all scheduled notification IDs here
};