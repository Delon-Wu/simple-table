# 表格组件封装——丰羽计划

## 写在前面

### 技术栈 
- vite
- scss
- vue3
- tsx

### 启动前准备 
`npm install` 或 `yarn`

### 启动项目 
`npm run dev`

### 项目打包
`npm run build`

### 表格截图：
![image](./src/assets/demo.jpg)

## Code Demo

```html
<template>
  <fy-table
    :columns="columns"
    :data-source="dataSource"
    :loading="loading"
    :pagination="pagination"
    :page-change="handlePageChange"
    :load-data="fetchData"
  >
    
  </fy-table>
</template>
<script lang="ts">
  import { defineComponent } from 'vue';

  const data = [
  {
    name: 'John Brown',
    age: 32,
    address: 'New York No. 1 Lake Park',
  },
  {
    name: 'Jim Green',
    age: 42,
    address: 'London No. 1 Lake Park',
  },
  {
    name: 'Joe Black',
    age: 32,
    address: 'Sidney No. 1 Lake Park',
  },
  {
    name: 'Jim Red',
    age: 32,
    address: 'London No. 2 Lake Park',
  },
  {
    name: 'John Brown',
    age: 32,
    address: 'New York No. 1 Lake Park',
  },
  {
    name: 'Jim Green',
    age: 42,
    address: 'London No. 1 Lake Park',
  },
  {
    name: 'Joe Black',
    age: 32,
    address: 'Sidney No. 1 Lake Park',
  },
  {
    name: 'Jim Red',
    age: 32,
    address: 'London No. 2 Lake Park',
  },
  {
    name: 'John Brown',
    age: 32,
    address: 'New York No. 1 Lake Park',
  },
  {
    name: 'Jim Green',
    age: 42,
    address: 'London No. 1 Lake Park',
  },
  {
    name: 'Joe Black',
    age: 32,
    address: 'Sidney No. 1 Lake Park',
  },
  {
    name: 'Jim Red',
    age: 32,
    address: 'London No. 2 Lake Park',
  },
],
columns = [
  {
    title: 'Name',
    dataIndex: 'name',
    sorter: (a, b) => a.name.length - b.name.length,
    sortDirections: ['descend'],
  },
  {
    title: 'Age',
    dataIndex: 'age',
    defaultSortOrder: 'descend',
    sorter: (a, b) => a.age - b.age,
  },
  {
    title: 'Address',
    dataIndex: 'address'
  },
],
pagination = {
  current: 1,
  total: 9,
  pageSize: 10
}
params = {
  name: 'Jim Red'
};

let loading = false;

const handlePageChange = (cur, next) => {
  console.log('Current page: ' + cur);
  console.log('Next page: ' + next);
}

const fetchData = (Object.assign(pagination, params)) => {
  return new Promise((res, rej) => {
    loading = true;
    setTimeout(() => {
      loading = fasle;
      res(dataSource);
    }, 3000)
  });
}

  export default defineComponent({
    setup() {
      return {
        columns,
        pagination,
        loading,
        dataSource: data,
        handlePageChange,
        fetchData
      }

    }
  })
</script>
```


## API

> props 

Name | Description | Type | Required | Default
 -- | -- | -- | -- | --
 datasource | 表格的源数据 | Array | false | \- 
 loadData | 请求表格数据的api | Promise | true | \-
 loading | 表格的loading遮罩，真值时加上表格遮罩 | Boolean | false | \-
 columns | 表格的配置，详情查看下表columns | Array | true | \-
 pagination | 表格的分页配置，详情见下方描述 | Object | false | \-

> columns

Name | Description | Type | Required | Default
 -- | -- | -- | -- | --
 header 列标题 | 

> pagination
 表格的分页器配置，若不配置，则没有分页，若配置请参照下配置：
```typescript
interface PaginationConfig {
  total: number,
  pageSize: number,
  current: number
}
```