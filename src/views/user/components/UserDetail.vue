<template>
  <div v-loading="loading" class="createPost-container">
    <el-form ref="postForm" :model="postForm" class="form-container" label-width="100px" :rules="rules">
      <el-form-item label="用户ID">
        <el-input v-model="postForm.id" :disabled="true" />
      </el-form-item>
      <el-form-item label="用户昵称" prop="nickname">
        <el-input v-model="postForm.nickname" />
      </el-form-item>
      <el-form-item label="账号密码">
        <el-input v-model="postForm.password" show-password placeholder="留空则不修改" />
      </el-form-item>
      <!--<el-form-item label="用户头像">
              <img :src="postForm.avatar" style="width: 60px">
            </el-form-item>-->
      <el-form-item label="手机号码">
        <el-input v-model="postForm.phone" />
      </el-form-item>
      <el-form-item label="积分">
        <el-input v-model="postForm.integral" />
      </el-form-item>
      <el-form-item label="生日">
        <el-date-picker
          v-model="birthday"
          type="date"
          placeholder="选择日期"
        />
      </el-form-item>
      <el-form-item label="性别">
        <el-radio-group v-model="postForm.sex">
          <el-radio-button label="1">男</el-radio-button>
          <el-radio-button label="2">女</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="VIP">
        <el-radio-group v-model="postForm.is_vip">
          <el-radio-button label="1">是</el-radio-button>
          <el-radio-button label="0">否</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="VIP过期时间">
        <el-date-picker
          v-model="vipTime"
          type="datetime"
          placeholder="选择日期时间"
        />
      </el-form-item>
      <el-form-item label="状态">
        <el-radio-group v-model="postForm.status">
          <el-radio-button label="1">正常</el-radio-button>
          <el-radio-button label="2">锁定</el-radio-button>
        </el-radio-group>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { fetchUser, editUser } from '@/api/user'
import { parseTime } from '@/utils/index'

const defaultForm = {
  id: undefined,
  nickname: '',
  password: '',
  phone: '',
  integral: '',
  birthday: 0,
  sex: 0,
  is_vip: 0,
  vip_time: 0,
  status: 0
}

const rules = {
  nickname: [{ required: true, message: '请输入用户昵称', trigger: 'blur' }]
}

export default {
  name: 'UserDetail',
  components: {},
  props: {
    row: {
      type: Object,
      default: function() {
        return {}
      }
    },
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      postForm: Object.assign({}, defaultForm),
      loading: false,
      rules: rules
    }
  },
  computed: {
    vipTime: {
      get: function() {
        return this.postForm.vip_time ? parseTime(this.postForm.vip_time, '{y}-{m}-{d} {h}:{i}:{s}') : ''
      },
      set: function(time) {
        this.postForm.vip_time = (new Date(time)).getTime() / 1000
      }
    },
    birthday: {
      get: function() {
        return this.postForm.birthday ? parseTime(this.postForm.birthday, '{y}-{m}-{d}') : ''
      },
      set: function(time) {
        this.postForm.birthday = (new Date(time)).getTime() / 1000
      }
    }
  },
  watch: {
    row: function() {
      this.loading = false
      this.$refs['postForm'].clearValidate()
      this.postForm = Object.assign({}, this.row)
      this.postForm.password = ''
    }
  },
  created() {
    if (this.isEdit) {
      this.postForm = Object.assign({}, this.row)
      this.postForm.password = ''
    }

    // Why need to make a copy of this.$route here?
    // Because if you enter this page and quickly switch tag, may be in the execution of the setTagsViewTitle function, this.$route is no longer pointing to the current page
    // https://github.com/PanJiaChen/vue-element-admin/issues/1221
    this.tempRoute = Object.assign({}, this.$route)
  },
  methods: {
    fetchData(id) {
      this.loading = true
      fetchUser(id).then(response => {
        this.postForm = response.data
        this.loading = false
      }).catch(err => {
        console.log(err)
      })
    },
    submitForm() {
      const _self = this
      return new Promise(function(resolve, reject) {
        _self.$refs.postForm.validate(valid => {
          if (valid) {
            _self.loading = true
            editUser(_self.postForm).then(response => {
              _self.loading = false
              _self.$notify({
                title: '成功',
                message: '用户资料修改成功',
                type: 'success',
                duration: 2000
              })
              _self.postForm.password = ''
              _self.row = Object.assign(_self.row, _self.postForm)
              resolve()
            }).catch(err => {
              console.log(err)
              reject()
            })
          } else {
            reject()
            return false
          }
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
    @import "~@/styles/mixin.scss";
</style>
