/**
 * @file 表格的分页器
*/
import { defineComponent, ref, reactive } from "vue";
import './index.scss'

// TODO 每页显示数量可选

const  SLIDE_WINDOW_WIDTH_5 = 5;
const  SLIDE_WINDOW_WIDTH_5_MIDDLE = Math.ceil(SLIDE_WINDOW_WIDTH_5 / 2);

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

  emits: ['change'],

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

  watch: {
    curPage(curPage) {
      this.$emit('change', curPage);
    }
  },

  mounted() {
    if (this.totalPage > SLIDE_WINDOW_WIDTH_5 + 2) {
      this.slideWindow.isAlive = true;
      this.slideWindow.leftMostPage = 1;
      this.slideWindow.rightMostPage = SLIDE_WINDOW_WIDTH_5;
    }
  },

  methods: {
    // 点击页码事件处理
    handleClickItem(pageNum: number) {
      // 更新slideWindow
      if (this.slideWindow.isAlive) {
        if (pageNum <= SLIDE_WINDOW_WIDTH_5_MIDDLE) {
          this.slideWindow.leftMostPage = 1;
          this.slideWindow.rightMostPage = SLIDE_WINDOW_WIDTH_5;
        } else if (pageNum >= this.totalPage - SLIDE_WINDOW_WIDTH_5_MIDDLE) {
          this.slideWindow.rightMostPage = this.totalPage;
          this.slideWindow.leftMostPage = this.totalPage - SLIDE_WINDOW_WIDTH_5 + 1;
        } else {
          this.moveSlideWindow(pageNum - this.curPage);
        }
      }
      // 注意最后赋值
      this.curPage = pageNum;
    },

    // 往前一页处理
    handleJumpPrev() {
      this.curPage = this.curPage > 1 ? this.curPage - 1 : 1;
      if (this.curPage <= this.totalPage - SLIDE_WINDOW_WIDTH_5_MIDDLE) {
        this.moveSlideWindow(-1);
      }
    },

    // 往后一页处理
    handleJumpNext() {
      this.curPage = this.curPage < this.totalPage ? this.curPage + 1 : this.totalPage;
      if (this.curPage > SLIDE_WINDOW_WIDTH_5_MIDDLE) {
        this.moveSlideWindow(1);
      }
    },

    // TODO 最左最右计算需要加入curPage驱动
    // 往前跳转 5 页处理
    handleJumpPrev5Page() {
      if (this.slideWindow.leftMostPage <= SLIDE_WINDOW_WIDTH_5) {
        this.slideWindow.leftMostPage = 1;
        this.slideWindow.rightMostPage = SLIDE_WINDOW_WIDTH_5;
        this.curPage = 1;
      } else {
        this.slideWindow.leftMostPage = this.curPage - 7;
        this.slideWindow.rightMostPage = this.curPage - 3;
        this.curPage -= SLIDE_WINDOW_WIDTH_5;
      }
      console.log(`当前的slideWindow范围是：[${this.slideWindow.leftMostPage}, ${this.slideWindow.rightMostPage}]`);
    },

    // TODO 最左最右计算需要加入curPage驱动
    // 往后跳转 5 页处理
    handleJumpNext5Page() {
      if (this.slideWindow.rightMostPage > (this.totalPage - SLIDE_WINDOW_WIDTH_5)) {
        this.slideWindow.leftMostPage = this.totalPage - SLIDE_WINDOW_WIDTH_5 + 1;
        this.slideWindow.rightMostPage = this.totalPage;
        this.curPage = this.totalPage
      } else {
        this.slideWindow.leftMostPage = this.curPage + 3;
        this.slideWindow.rightMostPage = this.curPage + 7;
        this.curPage += SLIDE_WINDOW_WIDTH_5;
      }
      console.log(`当前的slideWindow范围是：[${this.slideWindow.leftMostPage}, ${this.slideWindow.rightMostPage}]`);
    },

    /**
     * @param steps - 任意整数，大于零时往后移动steps，反之则往前移动steps。
     */
    moveSlideWindow (steps: number = SLIDE_WINDOW_WIDTH_5) {
      let leftMostPage = this.slideWindow.leftMostPage + steps,
          rightMostPage = this.slideWindow.rightMostPage + steps;

      if (leftMostPage < 1 || rightMostPage > this.total) {
        return;
      }

      this.slideWindow.leftMostPage = leftMostPage;
      this.slideWindow.rightMostPage = rightMostPage;
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
                  { this.curPage === SLIDE_WINDOW_WIDTH_5_MIDDLE + 1 ? null : <li onClick={this.handleJumpPrev5Page} class="pagination-jump-prev" title="往前5页">...</li> }
                </> : null
              }
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
                  { this.curPage === this.totalPage - SLIDE_WINDOW_WIDTH_5_MIDDLE ? null : <li onClick={this.handleJumpNext5Page} class="pagination-jump-next" title="往后5页">...</li> }
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
        <li class="pagination-next">
          <button disabled={this.curPage === this.totalPage} onClick={this.handleJumpNext}>&gt;</button>
        </li>
      </ul>
    )
      : null;
  }
});
