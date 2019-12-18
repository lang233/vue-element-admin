<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.id" placeholder="标题" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-select v-model="listQuery.type_id" placeholder="类型" clearable style="width: 90px" class="filter-item">
        <el-option v-for="(label, value) in types" :key="value" :label="label" :value="value" />
      </el-select>
      <el-select v-model="listQuery.status" placeholder="状态" clearable style="width: 90px" class="filter-item">
        <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
      <el-button :loading="listLoading" class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
    </div>
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" label="ID" width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="标题" width="140">
        <template slot-scope="scope">
          <span>{{ scope.row.title }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="描述" width="300">
        <template slot-scope="scope">
          <span>{{ scope.row.desc }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="图片" width="350">
        <template slot-scope="scope">
          <img :src="scope.row.img" style="width: 300px;"><br>
        </template>
      </el-table-column>

      <el-table-column align="center" label="类型" width="100">
        <template slot-scope="scope">
          <span>{{ types[scope.row.type_id] }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="排序" width="50">
        <template slot-scope="scope">
          <span>{{ scope.row.sort }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="状态" width="100">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status == 1 ? 'success' : 'danger'">
            {{ scope.row.status == 1 ? '正常' : '关闭' }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="300">
        <template slot-scope="scope">
          <el-button type="primary" size="small" icon="el-icon-edit" @click="edit(scope.row)">
            编辑
          </el-button>
          <el-button type="danger" size="small" icon="el-icon-delete" @click="delete(scope.row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getList"
    />
  </div>
</template>

<script>
import { fetchList } from '@/api/banner'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

export default {
  name: 'BannerIndex',
  components: { Pagination },
  filters: {

  },
  data() {
    return {
      row: {},
      showDialog: false,
      list: null,
      total: 0,
      listLoading: true,
      btnLoading: false,
      listQuery: {
        page: 1,
        limit: 20
      },
      types: {
        1: '首页'
      },
      statusOptions: [
        { label: '正常', value: 1 },
        { label: '关闭', value: 2 }
      ]
    }
  },
  created() {
    this.getList()
  },
  methods: {
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    getList() {
      this.listLoading = true
      fetchList(this.listQuery).then(response => {
        this.list = response.data.items
        this.total = response.data.total
        this.listLoading = false
      })
    },
    edit(row) {
      this.row = row
      this.showDialog = true
    },
    delete(id) {

    }
  }
}
</script>

<style scoped>
    .edit-input {
        padding-right: 100px;
    }

    .cancel-btn {
        position: absolute;
        right: 15px;
        top: 10px;
    }
</style>
