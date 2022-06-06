/**
 * @file 表格组件封装
*/

import { defineComponent, computed, ref } from "vue";
import './index.scss';
import TableBody from "./TableBody";
import TableHead from "./TableHead";
import Pagination from "./Pagination";

export default defineComponent({
  name: "FyTable",

  props: {
    dataSource: {
      type: Array,
      default: []
    },
    columns: {
      type: Array,
      default: []
    }
  },

  setup(props, ctx) {
    const curPage = ref(1);
    // TODO 每页显示数据量可选，目前写死每页显示十条
    const pageSize = ref(10);
    const theSortDirection = ref('');
    const sortedDataIndex = ref('');
    const sortedDataSource = ref<{[key: string]: any}>([]);

    // 当前页码的数据
    const curPageData = computed(() => {
      let targetData = sortedDataSource.value.length ? sortedDataSource.value : props.dataSource;
      let startIndex = (curPage.value - 1) * pageSize.value;

      return targetData.slice(startIndex, startIndex + pageSize.value);
    });

    // 页码改变后的处理
    const handlePageChange = (cur: number) => {
      curPage.value = cur;
    };

    const handleSort = (sortedData: {[key: string]: any}, dataIndex: string, sortDirection: string) => {
      sortedDataSource.value = sortedData;
      sortedDataIndex.value = dataIndex;
      theSortDirection.value = sortDirection;
    };

    return () => (
      <div class="fy-table_table-box">
        <table class="fy-table_table global-mg-b-10">
          <TableHead
            columns={props.columns}
            data-source={props.dataSource}
            onSort={handleSort}
          />

          <TableBody
            cur-page-data={curPageData.value}
            columns={props.columns}
            sorted-data-index={sortedDataIndex.value}
            the-sort-direction={theSortDirection.value}
          />
        </table>

        {/* 分页 */}
        <Pagination onChange={handlePageChange} total={props.dataSource.length} page-size={pageSize.value} />
      </div>
    );
  },
});
