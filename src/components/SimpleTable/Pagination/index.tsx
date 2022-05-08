/**
 * @file 表格的分页器
*/
import { defineComponent, ref, reactive } from "vue";
import './index.scss'

// 默认每页显示10条数据
// TODO 每页显示数量可选

export default defineComponent({
    name: "Pagination",
  
    props: {
      total: {
        type: Number,
        required: true
      },
      change: {
        type: Function,
        default: () => {}
      },
      pageSize: {
        type: Number,
        default: 10
      }
    },

    data() {
      return {
        curPage: 1
      };
    },

    computed: {
      startPage () {
        return !!this.total ? 1 : 0;
      },

      endPage () {
        return this.total;
      },

      totalPage () {
        return Math.ceil(this.total/this.pageSize);
      }
    },

    methods: {
      handleClickItem ( pageNum: number) {
        this.curPage = pageNum;
        this.change(pageNum);
      },

      handleJumpPrev () {
        this.curPage = this.curPage > 1 ? this.curPage - 1 : 1;
        this.change(this.curPage);
      },

      handleJumpNext () {
        this.curPage = this.curPage < this.totalPage ? this.curPage + 1 : this.totalPage;
        this.change(this.curPage);
      }
    },

    render() {
      return this.total !== 0 ? (
        <ul class="pagination-box">
          <li class="pagination-prev">
            <button disabled={this.curPage <= 1} onClick={this.handleJumpPrev}>&lt;</button>
          </li>
          {/* 动态生成pagination-item */}
          {
            new Array(this.totalPage).fill('').map((item, i) => {
              return <li
                      class={this.curPage === i + 1 ? 'pagination-item pagination-item-active' : 'pagination-item'}
                      onClick={() => this.handleClickItem(i + 1)}
                      >
                      {i + 1}
                    </li>
            })
          }
          <li class="pagination-next">
            <button disabled={this.curPage === this.totalPage} onClick={this.handleJumpNext}>&gt;</button>
          </li>
        </ul>
      )
      : null;
    }
 });
 