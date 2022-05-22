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
        alive: false
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
      this.slideWindow.alive = true;
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

    handleJumpPrev5Page() {
      if (this.slideWindow.leftMostPage <= 5) {
        this.slideWindow.leftMostPage = 1;
        this.slideWindow.rightMostPage = 5;
        this.curPage = 3;
      } else {
        this.slideWindow.leftMostPage -= 5;
        this.slideWindow.rightMostPage -= 5;
        this.curPage = this.slideWindow.leftMostPage + 2;
      }
      console.log(`当前的slideWindow范围是：[${this.slideWindow.leftMostPage}, ${this.slideWindow.rightMostPage}]`);
    },

    handleJumpNext5Page() {
      if (this.slideWindow.rightMostPage > (this.total - 4)) {
        this.slideWindow.leftMostPage = this.total - 4;
        this.slideWindow.rightMostPage = this.total;
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
          this.slideWindow.alive ?
            <>
              {this.slideWindow.leftMostPage !== 1 ? <li class="pagination-item" onClick={() => this.handleClickItem(1)}>1</li> : null}
              <li class="pagination-jump-prev" onClick={this.handleJumpPrev5Page}>
                ...
              </li>
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
              <li class="pagination-jump-next" onClick={this.handleJumpNext5Page}>
                ...
              </li>
              {this.slideWindow.leftMostPage !== this.totalPage ? <li class="pagination-item" onClick={() => this.handleClickItem(this.totalPage)}>{this.totalPage}</li> : null}
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
