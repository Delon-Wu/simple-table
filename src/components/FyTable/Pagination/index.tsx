/**
 * @file 表格的分页器
*/
import { defineComponent, ref, reactive } from "vue";
import './index.scss'

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
      default: () => { }
    },
    pageSize: {
      type: Number,
      default: 10
    }
  },

  data() {
    return {
      curPage: 1,
      slideWindow: {
        leftMostPage: 0,
        rightMostPage: 0,
        isAlive: false
      }
    };
  },

  computed: {
    startPage() {
      return !!this.total ? 1 : 0;
    },

    endPage() {
      return this.total;
    },

    totalPage() {
      return Math.ceil(this.total / this.pageSize);
    }
  },

  mounted() {
    if (this.total > 7) {
      this.slideWindow.isAlive = true;
      this.slideWindow.leftMostPage = 1;
      this.slideWindow.rightMostPage = 5;
    }
  },

  methods: {
    handleClickItem(pageNum: number) {
      this.curPage = pageNum;
      this.change(pageNum);
    },

    handleJumpPrev() {
      this.curPage = this.curPage > 1 ? this.curPage - 1 : 1;
      this.change(this.curPage);
    },

    handleJumpNext() {
      this.curPage = this.curPage < this.totalPage ? this.curPage + 1 : this.totalPage;
      this.change(this.curPage);
    },

    // TODO 最左最右计算需要加入curPage驱动
    handleJumpPrev5Page() {
      if (this.slideWindow.leftMostPage <= 5) {
        this.slideWindow.leftMostPage = 1;
        this.slideWindow.rightMostPage = 5;
        this.curPage = 3;
      } else {
        this.slideWindow.leftMostPage = this.curPage - 7;
        this.slideWindow.rightMostPage = this.curPage - 3;
        this.curPage -= 5;
      }
      console.log(`当前的slideWindow范围是：[${this.slideWindow.leftMostPage}, ${this.slideWindow.rightMostPage}]`);
    },

    // TODO 最左最右计算需要加入curPage驱动
    handleJumpNext5Page() {
      if (this.slideWindow.rightMostPage > (this.totalPage - 4)) {
        this.slideWindow.leftMostPage = this.totalPage - 4;
        this.slideWindow.rightMostPage = this.totalPage;
      } else {
        this.slideWindow.leftMostPage = this.slideWindow.leftMostPage + 5;
        this.slideWindow.rightMostPage = this.slideWindow.leftMostPage + 5;
      }
      this.curPage = this.slideWindow.leftMostPage + 2;
      console.log(`当前的slideWindow范围是：[${this.slideWindow.leftMostPage}, ${this.slideWindow.rightMostPage}]`);
    }
  },

  render() {
    return this.total !== 0 ? (
      <ul class="pagination-box">
        <li class="pagination-prev">
          <button disabled={this.curPage <= 1} onClick={this.handleJumpPrev}>&lt;</button>
        </li>
        {
          this.slideWindow.isAlive ?
            <>
              { this.slideWindow.leftMostPage !== 1 ?
                <>
                  <li class="pagination-item" onClick={() => this.handleClickItem(1)}>1</li>
                  <li class="pagination-jump-prev" onClick={this.handleJumpPrev5Page}>...</li>
                </> : null }
              {
                new Array(5).fill(this.slideWindow.leftMostPage).map((left, i) => (
                  <li
                    class={this.curPage === left + i ? 'pagination-item pagination-item-active' : 'pagination-item'}
                    onClick={() => this.handleClickItem(left + i)}
                  >
                    {left + i}
                  </li>
                ))
              }
              { this.slideWindow.rightMostPage !== this.totalPage ?
                <>
                  <li class="pagination-jump-next" onClick={this.handleJumpNext5Page}>...</li>
                  <li class="pagination-item" onClick={() => this.handleClickItem(this.totalPage)}>{this.totalPage}</li>
                </> : null
              }
            </> :
            <>
              {
                new Array(this.totalPage).fill('').map((item, i) => (
                  <li
                    class={this.curPage === i + 1 ? 'pagination-item pagination-item-active' : 'pagination-item'}
                    onClick={() => this.handleClickItem(i + 1)}
                  >
                    {i + 1}
                  </li>
                ))
              }
            </>
        }
        {/* <li class="pagination-jump-prev" onClick={this.handleJumpPrev5Page}>
            ...
          </li> */}
        {/* 动态生成pagination-item */}
        {/* {
            new Array(this.totalPage).fill('').map((item, i) => (
              <li
                class={this.curPage === i + 1 ? 'pagination-item pagination-item-active' : 'pagination-item'}
                onClick={() => this.handleClickItem(i + 1)}
              >
                {i + 1}
              </li>
            ))
          }
          <li class="pagination-jump-next" onClick={this.handleJumpNext5Page}>
            ...
          </li> */}
        <li class="pagination-next">
          <button disabled={this.curPage === this.totalPage} onClick={this.handleJumpNext}>&gt;</button>
        </li>
      </ul>
    )
      : null;
  }
});
