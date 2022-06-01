export const TEST_COLUMNS = [
  {
    title: '姓名',
    dataIndex: 'name',
    sorter: (a, b) => a.name.length - b.name.length,
    sortDirections: ['descend', 'ascend'],
  },
  {
    title: '年龄',
    dataIndex: 'age',
    defaultSortOrder: 'descend',
    sorter: (a, b) => a.age - b.age,
    sortDirections: 'descend',
  },
  {
    title: '出生地',
    dataIndex: 'address'
  },
];