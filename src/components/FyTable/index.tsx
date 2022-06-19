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
    },
    pageSize: {
      type: Array,
      default: [10, 20, 50, 100],
      validator (value) {
        return Array.isArray(value) && value.length;
      }
    }
  },

  setup (props, ctx) {
    const curPage = ref(1);

    let curPageSize = ref(props.pageSize[0] as number);
    const theSortDirection = ref('');
    const sortedDataIndex = ref('');
    const sortedDataSource = ref<{[key: string]: any}>([]);

    // 当前页码的数据
    const curPageData = computed(() => {
      let targetData = sortedDataSource.value.length ? sortedDataSource.value : props.dataSource;
      let startIndex = (curPage.value - 1) * curPageSize.value;

      return targetData.slice(startIndex, startIndex + curPageSize.value);
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

    const handlePageSizeChange = (v: number) => {
      curPageSize.value = v;
    }

    return {
      curPageData,
      handleSort,
      sortedDataIndex,
      theSortDirection,
      handlePageChange,
      handlePageSizeChange
    }
  },

  render () {
    return (
      <div class="fy-table_table-box">
        <table class="fy-table_table global-mg-b-10">
          <TableHead
            columns={this.columns}
            data-source={this.dataSource}
            onSort={this.handleSort}
          />

          <TableBody
            cur-page-data={this.curPageData}
            columns={this.columns}
            sorted-data-index={this.sortedDataIndex}
            the-sort-direction={this.theSortDirection}
          />
        </table>

        {/* 分页 */}
        <Pagination
          onChange={this.handlePageChange}
          total={this.dataSource.length}
          page-size={this.pageSize}
          onPageSizeChange={this.handlePageSizeChange} />
      </div>
    )
  }
});
