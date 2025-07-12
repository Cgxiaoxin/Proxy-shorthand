App({
  globalData: {
    todos: [],
    userInfo: null
  },

  onLaunch() {
    // 从本地存储加载待办事项
    const todos = wx.getStorageSync('todos') || []
    this.globalData.todos = todos
    
    // 检查更新
    if (wx.canIUse('getUpdateManager')) {
      const updateManager = wx.getUpdateManager()
      updateManager.onCheckForUpdate((res) => {
        if (res.hasUpdate) {
          updateManager.onUpdateReady(() => {
            wx.showModal({
              title: '更新提示',
              content: '新版本已经准备好，是否重启应用？',
              success: (res) => {
                if (res.confirm) {
                  updateManager.applyUpdate()
                }
              }
            })
          })
        }
      })
    }
  },

  // 添加待办事项
  addTodo(todo) {
    const todos = this.globalData.todos
    todo.id = Date.now().toString()
    todo.createTime = new Date().toISOString()
    todo.completed = false
    todos.unshift(todo)
    this.globalData.todos = todos
    this.saveTodos()
  },

  // 删除待办事项
  deleteTodo(id) {
    const todos = this.globalData.todos.filter(todo => todo.id !== id)
    this.globalData.todos = todos
    this.saveTodos()
  },

  // 更新待办事项
  updateTodo(id, updates) {
    const todos = this.globalData.todos.map(todo => {
      if (todo.id === id) {
        return { ...todo, ...updates }
      }
      return todo
    })
    this.globalData.todos = todos
    this.saveTodos()
  },

  // 切换完成状态
  toggleTodo(id) {
    const todos = this.globalData.todos.map(todo => {
      if (todo.id === id) {
        return { ...todo, completed: !todo.completed }
      }
      return todo
    })
    this.globalData.todos = todos
    this.saveTodos()
  },

  // 保存到本地存储
  saveTodos() {
    wx.setStorageSync('todos', this.globalData.todos)
  }
})