export interface Task {
  id: number;
  title: string;
  parent: { id: number; title: string };
  subtasks?: Task[];
}
