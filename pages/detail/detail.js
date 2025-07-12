const app = getApp()

Page({
  data: {
    todo: {},
    isEditing: false,
    editData: {},
    today: '',
    priorityLabels: {
      low: '低',
      medium: '中',
      high: '高'
    }
  },

  onLoad(options) {
    const id = options.id
    this.loadTodo(id)
    this.setToday()
  },

  // 设置今天的日期
  setToday() {
    const today = new Date()
    const year = today.getFullYear()
    const month = String(today.getMonth() + 1).padStart(2, '0')
    const day = String(today.getDate()).padStart(2, '0')
    this.setData({
      today: `${year}-${month}-${day}`
    })
  },

  // 加载待办事项详情
  loadTodo(id) {
    const todos = app.globalData.todos
    const todo = todos.find(t => t.id === id)
    
    if (todo) {
      this.setData({ todo })
    } else {
      wx.showToast({
        title: '待办事项不存在',
        icon: 'error',
        duration: 2000
      })
      setTimeout(() => {
        wx.navigateBack()
      }, 2000)
    }
  },

  // 格式化时间
  formatTime(timeStr) {
    if (!timeStr) return ''
    const date = new Date(timeStr)
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const hour = String(date.getHours()).padStart(2, '0')
    const minute = String(date.getMinutes()).padStart(2, '0')
    return `${year}-${month}-${day} ${hour}:${minute}`
  },

  // 检查是否逾期
  isOverdue(dueDate) {
    if (!dueDate) return false
    const today = new Date()
    const due = new Date(dueDate)
    return due < today
  },

  // 切换完成状态
  toggleStatus() {
    const { todo } = this.data
    app.toggleTodo(todo.id)
    
    // 重新加载数据
    this.loadTodo(todo.id)
    
    wx.showToast({
      title: todo.completed ? '已标记为待完成' : '已标记为已完成',
      icon: 'success',
      duration: 1500
    })
  },

  // 开始编辑
  editTodo() {
    const { todo } = this.data
    this.setData({
      isEditing: true,
      editData: {
        title: todo.title,
        description: todo.description || '',
        priority: todo.priority || 'medium',
        dueDate: todo.dueDate || ''
      }
    })
  },

  // 编辑输入处理
  onEditInput(e) {
    const field = e.currentTarget.dataset.field
    const value = e.detail.value
    this.setData({
      [`editData.${field}`]: value
    })
  },

  // 选择编辑优先级
  selectEditPriority(e) {
    const priority = e.currentTarget.dataset.priority
    this.setData({
      'editData.priority': priority
    })
  },

  // 编辑日期选择
  onEditDateChange(e) {
    this.setData({
      'editData.dueDate': e.detail.value
    })
  },

  // 取消编辑
  cancelEdit() {
    this.setData({
      isEditing: false,
      editData: {}
    })
  },

  // 保存编辑
  saveEdit(e) {
    const formData = e.detail.value
    
    // 验证必填字段
    if (!formData.title.trim()) {
      wx.showToast({
        title: '请输入标题',
        icon: 'error',
        duration: 2000
      })
      return
    }

    const { todo, editData } = this.data
    
    // 更新待办事项
    app.updateTodo(todo.id, {
      title: formData.title.trim(),
      description: formData.description.trim(),
      priority: editData.priority,
      dueDate: editData.dueDate || null
    })

    // 重新加载数据
    this.loadTodo(todo.id)
    
    // 退出编辑模式
    this.setData({
      isEditing: false,
      editData: {}
    })

    wx.showToast({
      title: '保存成功',
      icon: 'success',
      duration: 1500
    })
  },

  // 删除待办事项
  deleteTodo() {
    const { todo } = this.data
    
    wx.showModal({
      title: '确认删除',
      content: `确定要删除"${todo.title}"吗？此操作不可恢复。`,
      confirmText: '删除',
      confirmColor: '#FF4757',
      success: (res) => {
        if (res.confirm) {
          app.deleteTodo(todo.id)
          
          wx.showToast({
            title: '删除成功',
            icon: 'success',
            duration: 1500
          })
          
          setTimeout(() => {
            wx.navigateBack()
          }, 1500)
        }
      }
    })
  }
})