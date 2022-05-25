export interface ColumnItemStruct{
  title: string,
  dataIndex: string,
  defaultSortOrder?: string,
  sortDirections?: Array<'ascend' | 'descend'> | string,
  sorter?: (prevItem: {[key: string]: any}, curItem: {[key: string]: any}) => number
};

// 排序方式枚举
export enum SortWaysEnum {
  Ascend = 'ascend',
  Descend = 'descend',
  Default = 'default'
};

export type Column = Array<ColumnItemStruct>;