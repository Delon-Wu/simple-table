import { mount } from "@vue/test-utils";
import { expect, test } from "vitest";
import { mock } from "mockjs";
import FyTable from "../../../src/components/FyTable";
import Pagination from "../../../src/components/FyTable/Pagination";

const columns = [
  {
    title: '姓名',
    dataIndex: 'name',
    sorter: (a, b) => a.name.length - b.name.length,
    sortDirections: ['descend', 'ascend'],
  },
  {
    title: '年龄',
    dataIndex: 'age',
    defaultSortOrder: 'descend',
    sorter: (a, b) => a.age - b.age,
    sortDirections: 'descend',
  },
  {
    title: '出生地',
    dataIndex: 'address'
  },
];

test('dataLength === 10 时，fy-table组件显示是否正常', () => {
  const dataLength = 10;
  const columnsLength = columns.length;

  const dataSource = mock({
    ['data|' + dataLength]: [{
      'name': '@cname',
      'age|1-110': 100,
      'address|': '@county(true)'
    }]
  }).data;

  const wrapper = mount(FyTable, {
    props: {
      dataSource,
      columns
    }
  });

  expect(wrapper.find('thead').exists()).toBeTruthy();
  expect(wrapper.findAll('thead tr th').length).toBe(columnsLength);

  expect(wrapper.find('tbody').exists()).toBeTruthy();
  expect(wrapper.findAll('tbody tr').length).toBe(dataLength);

  expect(wrapper.find('.pagination-box').exists()).toBeTruthy();
  expect(wrapper.findAll('.pagination-item').length).toBe(1);
  expect(wrapper.find('.pagination-prev').exists()).toBeTruthy();
  expect(wrapper.find('.pagination-next').exists()).toBeTruthy();
});

test.skip('dataLength === 10 时，测试排序功能，触发可排序的header的点击事件',async () => {
  const dataLength = 10;
  const dataSource = mock({
    ['data|' + dataLength]: [{
      'name': '@cname',
      'age|1-110': 100,
      'address|': '@county(true)'
    }]
  }).data;

  const wrapper = mount(FyTable, {
    props: {
      dataSource,
      columns
    }
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
});

test.skip('dataLength === 10 时，测试分页器，只有一页，默认位于首页，不可左跳，不可右跳', () => {
  const dataLength = 10;
  const dataSource = mock({
    ['data|' + dataLength]: [{
      'name': '@cname',
      'age|1-110': 100,
      'address|': '@county(true)'
    }]
  }).data;

  const wrapper = mount(FyTable, {
    props: {
      dataSource,
      columns
    }
  });

  expect(wrapper.find('.pagination-box .pagination-prev button').attributes('disabled')).toBe(true);
  expect(wrapper.find('.pagination-box .pagination-next button').attributes('disabled')).toBe(true);
});

// -------------------------dataLength === 200-------------------------------

test.skip('dataLength === 200 时，测试分页器，快进快退5页', () => {
  const dataLength = 200;
  const dataSource = mock({
    ['data|' + dataLength]: [{
      'name': '@cname',
      'age|1-110': 100,
      'address|': '@county(true)'
    }]
  }).data;

  const wrapper = mount(FyTable, {
    props: {
      dataSource,
      columns
    },
    components: {}
  });

  expect(wrapper).toMatchSnapshot();

  const paginationBoxElement = wrapper.find('.pagination-box') ;

  expect(paginationBoxElement.findAll('.pagination-item').length).toBe(6);
});

test.todo('dataLength = 0 时，');