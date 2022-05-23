/**
 * @file 表格的头部
*/
import { defineComponent, ref } from "vue";
import { ColumnItemStruct } from './types';

// 排序方式,ascend: 升序;descend: 降序; '': 无排序;
export const SORT_WAYS: Array<string> = ['ascend', 'descend', '' ];

// 排序方式枚举
enum SortWaysEnum {
  Ascend = 'ascend',
  Descend = 'descend',
  Default = ''
};

const SORT_STATUS_DESC = {
  [SortWaysEnum.Ascend]: '当前为升序, 点击降序',
  [SortWaysEnum.Descend]: '当前为降序, 点击取消排序',
  [SortWaysEnum.Default]: '当前无排序,点击升序',
};

export default defineComponent({
    name: "TableHead",

    props: {
      columns: {
        type: Array,
        defaul: () => []
      },

      dataSource: {
        type: Array,
        defaul: () => []
      }
    },

    emits: ['sort'],

    setup(props, ctx) {
      const theSortDirections = ref<'ascend' | 'descend' | ''>('');
      let sortedDataIndex = '';

      const handleSort = (theColumn: ColumnItemStruct) => {
        if(!theColumn.sorter) {// columns配置中未定义sorter
          return;
        }

        let tempData = [...props.dataSource];
        // 轮询排序的数组
        let theSortWays = [...SORT_WAYS, SORT_WAYS[0]];
        let curSortWay = theSortWays.findIndex((item) => item === theSortDirections.value);

        // 如果点击其他表头则重置排序方式
        if (theColumn.dataIndex !== sortedDataIndex) {
          curSortWay = -1;
          sortedDataIndex = theColumn.dataIndex;
        }

        theSortDirections.value = theSortWays[curSortWay + 1];

        if(theSortDirections.value !== SortWaysEnum.Default) {
          console.log('排序方式：', theSortDirections.value);
          tempData.sort((a: unknown, b: unknown): any => {
            if(theSortDirections.value === SortWaysEnum.Descend) {
              return theColumn.sorter(a, b);
            } else if(theSortDirections.value === SortWaysEnum.Ascend) {
              return theColumn.sorter(b, a);
            }
          });
        }
        ctx.emit('sort', tempData, sortedDataIndex, theSortDirections.value);
      }

      return () => (
        <thead>
          <tr>
            {
              props.columns!.map((item: {} | any) => (
                <th title={item.sorter ? SORT_STATUS_DESC[theSortDirections.value] : ''}
                    onClick={() => handleSort(item as ColumnItemStruct)}>
                  {item.title}
                  {/* TODO 待添加筛选UI,筛选功能已有 */}
                </th>
              ))
            }
          </tr>
        </thead>
      );
    },
 });