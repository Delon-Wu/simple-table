import { mount } from "@vue/test-utils";
import { expect, test } from "vitest";
import Pagination from "../../../src/components/FyTable/Pagination";

test('dataLength === 10 时，测试分页器，只有一页，默认位于首页，不可左跳，不可右跳', () => {
  const dataLength = 10;
  const pageSize = 10;
  const wrapper = mount(Pagination, {
    props: {
      pageSize,
      total: dataLength,
    }
  });

  expect(wrapper.find('.pagination-item-active').text()).toBe('1');

  expect(wrapper.find('.pagination-box .pagination-prev button').attributes('disabled')).not.toBe('undefined');
  expect(wrapper.find('.pagination-box .pagination-next button').attributes('disabled')).not.toBe('undefined');
});

test('dataLength === 200 时，测试分页器，快进快退5页', async () => {
  const dataLength = 200;
  const pageSize = 10;
  const wrapper = mount(Pagination, {
    props: {
      pageSize,
      total: dataLength
    }
  });

  let curPage = 1;
  let getCurPage = () => {
    return +wrapper.find('.pagination-item-active').text();
  };
  let prevBtn = wrapper.find('.pagination-prev button');
  let nextBtn = wrapper.find('.pagination-next button');
  let jumpPrevBtn = wrapper.find('.pagination-jump-prev');
  let jumpNextBtn = wrapper.find('.pagination-jump-next');
  const paginationBoxEle = wrapper.find('.pagination-box');

  expect(paginationBoxEle.findAll('.pagination-item').length).toBe(6);

  // curPage = 1 时，无法左移
  await prevBtn.trigger('click');
  expect(getCurPage()).toBe(curPage);

  // 右移一页
  await nextBtn.trigger('click');
  curPage++;
  expect(getCurPage()).toBe(curPage);

  // 左移一页
  await prevBtn.trigger('click');
  curPage--;
  expect(getCurPage()).toBe(curPage);

  // 初始化不显示快速前进按钮
  expect(jumpPrevBtn.exists()).toBeFalsy();

  await jumpNextBtn.trigger('click');
  curPage += 5;
  expect(getCurPage()).toBe(curPage);

  jumpPrevBtn = wrapper.find('.pagination-jump-prev');
  await jumpPrevBtn.trigger('click');
  curPage = 1;
  expect(getCurPage()).toBe(curPage);
});

test.todo('dataLength = 0 时，');