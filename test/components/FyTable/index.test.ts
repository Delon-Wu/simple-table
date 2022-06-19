import { expect, test } from "vitest";
import FyTable from "../../../src/components/FyTable";
import { makeTestData } from "./common/utils";
import { TEST_COLUMNS } from './common/const'
import { mount } from '@vue/test-utils';

test('dataLength === 10 时，fy-table组件显示是否正常', () => {
  const dataLength = 10;
  const columnsLength = TEST_COLUMNS.length;
  const wrapper = mount(FyTable, {
    props: {
      dataSource: makeTestData(dataLength),
      columns: TEST_COLUMNS
    },
  });

  expect(wrapper.find('thead').exists()).toBeTruthy();
  expect(wrapper.findAll('thead tr th').length).toBe(columnsLength);

  expect(wrapper.find('tbody').exists()).toBeTruthy();
  expect(wrapper.findAll('tbody tr').length).toBe(dataLength);

  expect(wrapper.find('.pagination-box').exists()).toBeTruthy();
  wrapper.vm.$nextTick(() => {
    expect(wrapper.findAll('.pagination-item').length).toBe(1);
  })
  expect(wrapper.find('.pagination-prev').exists()).toBeTruthy();
  expect(wrapper.find('.pagination-next').exists()).toBeTruthy();
});

test('dataLength === 10 时，测试排序功能，触发可排序的header的点击事件',async () => {
  const dataLength = 10;
  const wrapper = mount(FyTable, {
    props: {
      dataSource: makeTestData(dataLength),
      columns: TEST_COLUMNS
    },
  });

  const headerElements = wrapper.findAll('thead tr th');
  const allRowElements = wrapper.findAll('tbody tr');

  // 第一次点击头部，降序
  await headerElements[0].trigger('click');
  for(let i = 0; i < dataLength; i++) {
    expect(allRowElements[i].findAll('td')[0].classes()).toContain('fy-table_cell-sort');
  }

  // 第二次点击头部，升序
  await headerElements[0].trigger('click');
  for(let i = 0; i < dataLength; i++) {
    expect(allRowElements[i].findAll('td')[0].classes()).toContain('fy-table_cell-sort');
  }

  // 第三次点击头部，取消排序
  await headerElements[0].trigger('click');
  for(let i = 0; i < dataLength; i++) {
    expect(allRowElements[i].findAll('td')[0].classes()).not.toContain('fy-table_cell-sort');
  }

  // 点击第二列头部，降序
  await headerElements[1].trigger('click');
  for(let i = 0; i < dataLength; i++) {
    expect(allRowElements[i].findAll('td')[1].classes()).toContain('fy-table_cell-sort');
  }

  // 点击第三列头部，无效果
  await headerElements[2].trigger('click');
  for(let i = 0; i < dataLength; i++) {
    expect(allRowElements[i].findAll('td')[2].classes()).not.toContain('fy-table_cell-sort');
  }

});

test('当sortDirection配置为object时，点击五排序', async () => {
  const dataLength = 10;
  const columnsLength = TEST_COLUMNS.length;
  let columns = [...TEST_COLUMNS];
  columns[1].sortDirections = {};

  const wrapper = mount(FyTable, {
    props: {
      columns,
      dataSource: makeTestData(dataLength)
    },
  });
  const headerElements = wrapper.findAll('thead tr th');
  const allRowElements = wrapper.findAll('tbody tr');


  // 点击第二列头部，无排序
  await headerElements[1].trigger('click');
  for(let i = 0; i < dataLength; i++) {
    expect(allRowElements[i].findAll('td')[1].classes()).not.toContain('fy-table_cell-sort');
  }
});

test('当页码变动时，更新curPage', () => {
  const dataLength = 10;
  const wrapper = mount(FyTable, {
    props: {
      dataSource: makeTestData(dataLength),
      columns: TEST_COLUMNS
    },
  });
  const pagination = wrapper.findComponent({ name: 'Pagination'});

  expect(pagination.vm.$emit('change', 10)).toBeUndefined();
});