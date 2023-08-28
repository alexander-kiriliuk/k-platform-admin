export interface NavNodeData {
  id: number;
  url?: string;
  name?: string;
  attrs?: string;
  selected?: boolean;
  children?: NavNodeData[];
}

