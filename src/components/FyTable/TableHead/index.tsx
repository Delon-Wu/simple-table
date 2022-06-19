/**
 * @file 表格的头部
*/
import { defineComponent, ref } from "vue";
import { ColumnItemStruct, SortWaysEnum } from '../types';

// 默认的排序方式顺序,ascend: 升序;descend: 降序; '': 无排序;
const DEFAULT_SORT_DIRECTIONS: Array<string> = ['ascend', 'descend', 'default' ];

const SORT_STATUS_DESC = {
  [SortWaysEnum.Ascend]: '当前为升序',
  [SortWaysEnum.Descend]: '当前为降序',
  [SortWaysEnum.Default]: '当前无排序',
};

export default defineComponent({
    name: "TableHead",

    props: {
      columns: {
        type: Array,
        defaul: []
      },

      dataSource: {
        type: Array,
        defaul: []
      }
    },

    emits: ['sort'],

    setup(props, ctx) {
      const theSortDirection = ref<SortWaysEnum>(SortWaysEnum.Default);
      const sortedDataIndex = ref('');

      const handleSort = (theColumn: ColumnItemStruct) => {
        if(!theColumn.sorter) {// columns配置中未定义sorter
          return;
        }

        let theSortWays,
            tempData = [...props.dataSource];
        // 初始化轮询排序方式的数组
        if (theColumn.sortDirections) {
          if (typeof theColumn.sortDirections === 'string') {
            theSortWays = [theColumn.sortDirections, SortWaysEnum.Default, theColumn.sortDirections];
          } else if (Array.isArray(theColumn.sortDirections)) {
            theSortWays = theColumn.sortDirections.length ? [...theColumn.sortDirections, SortWaysEnum.Default, theColumn.sortDirections[0]] : [];
          } else {
            console.warn('The param "sortDirections" only accepted type of string and array!');
            return;
          }
        } else {
          // 未配置sortDirections时
          theSortWays = [...DEFAULT_SORT_DIRECTIONS, DEFAULT_SORT_DIRECTIONS[0]]
        }
        let curSortWay = theSortWays.findIndex((item) => item === theSortDirection.value);

        // 如果点击其他表头则重置排序方式
        if (theColumn.dataIndex !== sortedDataIndex.value) {
          curSortWay = -1;
          sortedDataIndex.value = theColumn.dataIndex;
        }

        theSortDirection.value = theSortWays[curSortWay + 1] as SortWaysEnum;

        if(theSortDirection.value !== SortWaysEnum.Default) {
          tempData.sort((a: unknown, b: unknown): any => {
            if(theSortDirection.value === SortWaysEnum.Descend) {
              return theColumn.sorter(a, b);
            } else if(theSortDirection.value === SortWaysEnum.Ascend) {
              return theColumn.sorter(b, a);
            }
          });
        } else {
          sortedDataIndex.value = '';
        }
        ctx.emit('sort', tempData, sortedDataIndex.value, theSortDirection.value);
      }

      return {
        theSortDirection,
        sortedDataIndex,
        handleSort,
      }
    },

    render () {
      return (
        <thead>
          <tr>
            {
              this.columns!.map((item: {} | any) => (
                <th title={this.sortedDataIndex === item.dataIndex ? SORT_STATUS_DESC[this.theSortDirection] : ''}
                    onClick={() => this.handleSort(item as ColumnItemStruct)}>
                  {item.title}
                </th>
              ))
            }
          </tr>
        </thead>
      )
    }
 });