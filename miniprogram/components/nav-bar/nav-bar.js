Component({
  properties: {
    activeTab: { type: String, value: '' },
    items: { type: Array, value: [] }
  },
  methods: {
    onTap(e) {
      const url = e.currentTarget.dataset.url
      if (url) wx.redirectTo({ url })
    }
  }
})
