/**
 * @file 表格体
*/
import { defineComponent } from "vue";
import { SortWaysEnum } from '../types';

export default defineComponent({
    name: "TableBody",

    props: {
      curPageData: {
        type: Array,
        default: []
      },

      columns: {
        type: Array,
        default: []
      },

      sortedDataIndex: {
        type: String,
        default: ''
      },

      theSortDirection: {
        type: String,
        default: ''
      }
    },

    setup(props, ctx) {
      const isSorted = (dataIndex: string): boolean => {
        return (dataIndex === props.sortedDataIndex) && (props.theSortDirection !== SortWaysEnum.Default)
      };

      return () => (
        <tbody>
          {
            props.curPageData.map((row: {} | any) => (
              <tr>
                {
                  props.columns.map((_item: {} | any) => (
                    <td class={isSorted(_item.dataIndex) ? 'fy-table_cell-sort' : ''}>
                      <slot row={row}>{row[_item.dataIndex]}</slot>
                    </td>
                  ))
                }
              </tr>
            ))
          }
        </tbody>
      );
    },
 });