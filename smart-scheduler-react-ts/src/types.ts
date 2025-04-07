export type Task = {
    taskName: string;
    duration: number;
    deadline: string;
    priority: 'high' | 'medium' | 'low';
    completed?: boolean;
  };
  