/**
 * @file 表格体
*/
import { defineComponent } from "vue";

export default defineComponent({
    name: "TableBody",

    props: {
      curPageData: {
        type: Array,
        default: () => []
      },

      columns: {
        type: Array,
        default: () => []
      },

      sortedDataIndex: {
        type: String,
        default: () => ''
      },

      theSortDirections: {
        type: String,
        default: () => ''
      }
    },

    setup(props, ctx) {
      return () => (
        <tbody>
          {
            props.curPageData.map((row: {} | any) => (
              <tr>
                {
                  props.columns.map((_item: {} | any) => (
                    <td class={_item.dataIndex === props.sortedDataIndex && props.theSortDirections ? 'simple-table_cell-sort' : ''}>
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