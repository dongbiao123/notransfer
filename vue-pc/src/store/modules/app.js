import { Tools } from 'hanzi-vue-package'

const app = {
  state: {
    name: Tools.cache.get('nickname') || '',
    headimg: Tools.cache.get('headimg') || ''
  },
  mutations: {
    GET_INFO: state => {
      state.name = Tools.cache.get('nickname') // 用户名
      state.headimg = Tools.cache.get('headimg') // 用户头像
    }
  },
  actions: {
    updateInfo({ commit }) {
      commit('GET_INFO')
    }
  }
}

export default app
