const app = getApp()

Page({
  data: {
    formData: {
      title: '',
      description: '',
      priority: 'medium',
      dueDate: ''
    },
    today: '',
    templates: [
      {
        id: 1,
        title: '阅读书籍',
        description: '每天阅读30分钟，提升知识储备'
      },
      {
        id: 2,
        title: '运动健身',
        description: '进行30分钟有氧运动，保持健康'
      },
      {
        id: 3,
        title: '学习新技能',
        description: '学习一门新的技术或技能'
      },
      {
        id: 4,
        title: '整理房间',
        description: '清理和整理个人空间'
      },
      {
        id: 5,
        title: '联系朋友',
        description: '给朋友打电话或发消息'
      },
      {
        id: 6,
        title: '规划明天',
        description: '制定明天的计划和目标'
      }
    ]
  },

  onLoad() {
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

  // 输入框变化处理
  onInputChange(e) {
    const field = e.currentTarget.dataset.field
    const value = e.detail.value
    this.setData({
      [`formData.${field}`]: value
    })
  },

  // 选择优先级
  selectPriority(e) {
    const priority = e.currentTarget.dataset.priority
    this.setData({
      'formData.priority': priority
    })
  },

  // 日期选择处理
  onDateChange(e) {
    this.setData({
      'formData.dueDate': e.detail.value
    })
  },

  // 使用模板
  useTemplate(e) {
    const template = e.currentTarget.dataset.template
    this.setData({
      formData: {
        title: template.title,
        description: template.description,
        priority: 'medium',
        dueDate: ''
      }
    })
    
    wx.showToast({
      title: '模板已应用',
      icon: 'success',
      duration: 1500
    })
  },

  // 重置表单
  resetForm() {
    wx.showModal({
      title: '确认重置',
      content: '确定要清空所有输入内容吗？',
      success: (res) => {
        if (res.confirm) {
          this.setData({
            formData: {
              title: '',
              description: '',
              priority: 'medium',
              dueDate: ''
            }
          })
          
          wx.showToast({
            title: '已重置',
            icon: 'success',
            duration: 1500
          })
        }
      }
    })
  },

  // 提交表单
  submitForm(e) {
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

    // 创建待办事项对象
    const todo = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      priority: this.data.formData.priority,
      dueDate: this.data.formData.dueDate || null
    }

    // 添加到全局数据
    app.addTodo(todo)

    // 重置表单
    this.setData({
      formData: {
        title: '',
        description: '',
        priority: 'medium',
        dueDate: ''
      }
    })

    // 显示成功提示
    wx.showToast({
      title: '添加成功',
      icon: 'success',
      duration: 2000
    })

    // 延迟跳转到首页
    setTimeout(() => {
      wx.switchTab({
        url: '/pages/index/index'
      })
    }, 1500)
  }
})