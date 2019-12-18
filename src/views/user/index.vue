<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.id" placeholder="用户ID" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.phone" placeholder="手机号" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
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

      <el-table-column align="center" label="昵称" width="140">
        <template slot-scope="scope">
          <img :src="scope.row.avatar" style="width: 40px;height: 40px"><br>
          <span>{{ scope.row.nickname }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="手机号" width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.phone }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="注册设备" width="300">
        <template slot-scope="scope">
          <span>{{ scope.row.register_platform == 1 ? '苹果' : '安卓' }}</span>
          <hr>
          <span>{{ scope.row.register_mac }}</span>
          <hr>
          <span>{{ scope.row.ip_area }}</span>
          <hr>
        </template>
      </el-table-column>

      <el-table-column align="center" label="积分" width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.integral }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="VIP" width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.is_vip ? '是' : '否' }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="VIP过期时间" width="200">
        <template slot-scope="scope">
          <span>{{ scope.row.vip_time | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="性别" width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.sex | sexFilter }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="生日" width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.birthday | parseTime('{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="创建时间/在线时间" width="200">
        <template slot-scope="scope">
          <span>{{ scope.row.create_time | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
          <hr>
          <span>{{ scope.row.last_login | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="状态" width="100">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status == 1 ? 'success' : 'danger'">
            {{ scope.row.status == 1 ? '正常' : '锁定' }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="120">
        <template slot-scope="scope">
          <el-button type="primary" size="small" icon="el-icon-edit" @click="editForm(scope.row)">
            编辑
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :visible.sync="showDialog">
      <user-detail ref="editChild" :row.sync="row" :is-edit="true" />
      <span slot="footer" class="dialog-footer">
        <el-button @click="showDialog = false">取 消</el-button>
        <el-button :loading="btnLoading" type="primary" @click="submitForm">确 定</el-button>
      </span>
    </el-dialog>

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
import { fetchList } from '@/api/user'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import UserDetail from './components/UserDetail'

export default {
  name: 'UserIndex',
  components: { UserDetail, Pagination },
  filters: {
    sexFilter(sex) {
      const sexMap = {
        0: '未知',
        1: '男',
        2: '女'
      }
      return sexMap[sex]
    }
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
      statusOptions: [
        { label: '正常', value: 1 },
        { label: '锁定', value: 2 }
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
    editForm(row) {
      this.row = row
      this.showDialog = true
    },
    submitForm() {
      this.btnLoading = true
      this.$refs.editChild.submitForm().then(() => {
        this.showDialog = false
        this.btnLoading = false
      }).catch(() => {
        this.btnLoading = false
      })
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
