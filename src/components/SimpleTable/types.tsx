export interface ColumnItemStruct{
  title: string,
  dataIndex: string,
  defaultSortOrder?: string,
  sortDirections?: ['descend' | 'ascend'],
  sorter?: (prevItem: object, curItem: object) => number
};

export type Column = Array<ColumnItemStruct>;