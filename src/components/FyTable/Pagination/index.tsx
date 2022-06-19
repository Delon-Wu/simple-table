/**
 * @file 表格的分页器
*/
import { defineComponent } from "vue";
import './index.scss'

// TODO 每页显示数量可选

const SLIDE_WINDOW_WIDTH_5 = 5;
const SLIDE_WINDOW_WIDTH_5_MIDDLE = Math.ceil(SLIDE_WINDOW_WIDTH_5 / 2);

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
      type: Array,
      default: []
    }
  },

  emits: ['change', 'pageSizeChange'],

  data() {
    return {
      curPage: 1,
      slideWindow: {
        leftMostPage: 1,
        rightMostPage: SLIDE_WINDOW_WIDTH_5,
        isAlive: true
      },
      curPageSize: this.pageSize[0],
      thePageJumpTo: 0,
    };
  },

  computed: {
    totalPage() {
      return Math.ceil(this.total / (this.curPageSize as number));
    }
  },

  watch: {
    curPage (curPage) {
      this.$emit('change', curPage);
    },

    curPageSize (pageSize) {
      this.slideWindow.isAlive = this.totalPage > SLIDE_WINDOW_WIDTH_5 + 2;

      this.$emit('pageSizeChange', pageSize);
    }
  },

  mounted() {
    this.slideWindow.isAlive = this.totalPage > SLIDE_WINDOW_WIDTH_5 + 2;
  },

  methods: {
    // 点击页码事件处理
    handleJumpTo(pageNum: number) {
      const { curPage, totalPage } = this;

      // 更新slideWindow
      if (this.slideWindow.isAlive) {
        this.moveSlideWindowTo(pageNum)
      }

      this.curPage = pageNum;
    },

    // 往前一页处理
    handleJumpPrev() {
      this.curPage = this.curPage > 1 ? this.curPage - 1 : 1;
      this.moveSlideWindowTo(this.curPage);
    },

    // 往后一页处理
    handleJumpNext() {
      this.curPage = this.curPage < this.totalPage ? this.curPage + 1 : this.totalPage;
      this.moveSlideWindowTo(this.curPage);
    },

    // 快速往前跳转处理
    handleJumpPrevQuickly () {
      let moveTo = this.curPage - SLIDE_WINDOW_WIDTH_5;

      this.curPage = moveTo < 1 ? 1 : moveTo;
      this.moveSlideWindowTo(moveTo);
    },

    // 快速往后跳转处理
    handleJumpNextQuickly () {
      let moveTo = this.curPage + SLIDE_WINDOW_WIDTH_5;

      this.curPage = moveTo > this.totalPage ? this.totalPage : moveTo;
      this.moveSlideWindowTo(moveTo);
    },

    /**
     * 移动slideWindow到目标页码，如果slidWindow已经到达两端，则停止滑动。
     * @param {Number} moveTo - 移动到的目标页。
     */
    moveSlideWindowTo (moveTo:number) {
      let leftMostPage = 0,
          rightMostPage = 0;

      if (moveTo <= SLIDE_WINDOW_WIDTH_5_MIDDLE) {
        leftMostPage = 1;
        rightMostPage = SLIDE_WINDOW_WIDTH_5;
      } else if (moveTo > this.totalPage - SLIDE_WINDOW_WIDTH_5_MIDDLE) {
        leftMostPage = this.totalPage - SLIDE_WINDOW_WIDTH_5 + 1;
        rightMostPage = this.totalPage;
      } else {
        leftMostPage = moveTo - SLIDE_WINDOW_WIDTH_5_MIDDLE + 1;
        rightMostPage = moveTo + SLIDE_WINDOW_WIDTH_5_MIDDLE - 1;
      }

      this.slideWindow.leftMostPage = leftMostPage;
      this.slideWindow.rightMostPage = rightMostPage;
    },

    handlePageSizeChange (e) {
      this.handleJumpTo(1);

      this.curPageSize = +e.target.value;
    },

    handlePageInput (e) {
      let jumpTo = e.target.value;
      let isDecimal = jumpTo.indexOf(".") !== -1;
      jumpTo = +jumpTo;

      if (0 < jumpTo && jumpTo <= this.totalPage && !isDecimal) {
        this.thePageJumpTo = jumpTo;

        this.handleJumpTo(jumpTo);
      } else {
        this.thePageJumpTo = 0;
      }
    }
  },

  render() {
    return this.total > 0 ? (
      <div class="t-right">
        <ul class="pagination-box">
          <li class="pagination-prev">
            <button disabled={this.curPage <= 1} onClick={this.handleJumpPrev}>&lt;</button>
          </li>
          {
            this.slideWindow.isAlive ?
              <>
                { this.slideWindow.leftMostPage !== 1 ?
                  <>
                    <li class="pagination-item" onClick={() => this.handleJumpTo(1)}>1</li>
                    { this.curPage === SLIDE_WINDOW_WIDTH_5_MIDDLE + 1 ? null : <li onClick={this.handleJumpPrevQuickly} class="pagination-jump-prev" title="往前5页">...</li> }
                  </> : null
                }
                {
                  new Array(SLIDE_WINDOW_WIDTH_5).fill(this.slideWindow.leftMostPage).map((left, i) => (
                    <li
                      class={this.curPage === left + i ? 'pagination-item pagination-item-active' : 'pagination-item'}
                      onClick={() => this.handleJumpTo(left + i)}
                    >
                      {left + i}
                    </li>
                  ))
                }
                { this.slideWindow.rightMostPage !== this.totalPage ?
                  <>
                    { this.curPage === this.totalPage - SLIDE_WINDOW_WIDTH_5_MIDDLE ? null : <li onClick={this.handleJumpNextQuickly} class="pagination-jump-next" title="往后5页">...</li> }
                    <li class="pagination-item" onClick={() => this.handleJumpTo(this.totalPage)}>{this.totalPage}</li>
                  </> : null
                }
              </> :
              <>
                {
                  new Array(this.totalPage).fill('').map((item, i) => (
                    <li
                      class={this.curPage === i + 1 ? 'pagination-item pagination-item-active' : 'pagination-item'}
                      onClick={() => this.handleJumpTo(i + 1)}
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

        <select class="page-size-select global-mg-l-8" onChange={this.handlePageSizeChange}>
          {this.pageSize.map((size) => <option value={size}>{size}</option>)}
        </select>

        <span class="global-mg-l-8 global-mg-r-8">跳至</span>

        <input
          class="page-input global-pd-5"
          type="number"
          min="1"
          max={this.totalPage}
          value={this.thePageJumpTo || null}
          onBlur={this.handlePageInput}
        />
      </div>
    )
      : null;
  }
});
