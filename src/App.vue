<script setup lang="ts">
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup
import FyTable from "./components/FyTable";
import { Column } from "./components/FyTable/types";
import { mock } from 'mockjs';

const { data } = mock({
  'data|0-200': [{
    'name': '@cname',
    'age|1-110': 100,
    'address|': '@county(true)'
  }]
});
const columns: Column = [
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
</script>

<template>
  <FyTable :data-source="data" :columns="columns" />
</template>

<style>
* {
  margin: 0;
  padding: 0;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin: 60px;
}
</style>
