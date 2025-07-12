const app = getApp()

Page({
  data: {
    todos: [],
    filteredTodos: [],
    filter: 'all',
    totalCount: 0,
    completedCount: 0,
    pendingCount: 0,
    priorityLabels: {
      low: '低',
      medium: '中',
      high: '高'
    }
  },

  onLoad() {
    this.loadTodos()
  },

  onShow() {
    this.loadTodos()
  },

  onPullDownRefresh() {
    this.loadTodos()
    wx.stopPullDownRefresh()
  },

  // 加载待办事项
  loadTodos() {
    const todos = app.globalData.todos
    this.setData({
      todos: todos,
      totalCount: todos.length,
      completedCount: todos.filter(todo => todo.completed).length,
      pendingCount: todos.filter(todo => !todo.completed).length
    })
    this.filterTodos()
  },

  // 筛选待办事项
  filterTodos() {
    let filteredTodos = []
    const { todos, filter } = this.data

    switch (filter) {
      case 'pending':
        filteredTodos = todos.filter(todo => !todo.completed)
        break
      case 'completed':
        filteredTodos = todos.filter(todo => todo.completed)
        break
      default:
        filteredTodos = todos
    }

    // 按创建时间排序
    filteredTodos.sort((a, b) => new Date(b.createTime) - new Date(a.createTime))

    this.setData({
      filteredTodos: filteredTodos
    })
  },

  // 设置筛选条件
  setFilter(e) {
    const filter = e.currentTarget.dataset.filter
    this.setData({ filter })
    this.filterTodos()
  },

  // 切换待办事项状态
  toggleTodo(e) {
    const id = e.currentTarget.dataset.id
    app.toggleTodo(id)
    this.loadTodos()
    
    wx.showToast({
      title: '状态已更新',
      icon: 'success',
      duration: 1500
    })
  },

  // 编辑待办事项
  editTodo(e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/detail/detail?id=${id}`
    })
  },

  // 删除待办事项
  deleteTodo(e) {
    const id = e.currentTarget.dataset.id
    const todo = this.data.todos.find(t => t.id === id)
    
    wx.showModal({
      title: '确认删除',
      content: `确定要删除"${todo.title}"吗？`,
      confirmText: '删除',
      confirmColor: '#FF4757',
      success: (res) => {
        if (res.confirm) {
          app.deleteTodo(id)
          this.loadTodos()
          
          wx.showToast({
            title: '删除成功',
            icon: 'success',
            duration: 1500
          })
        }
      }
    })
  },

  // 跳转到添加页面
  navigateToAdd() {
    wx.switchTab({
      url: '/pages/add/add'
    })
  }
})