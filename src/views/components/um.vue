<template>
  <div :id="domId"></div>
</template>

<script>
  export default {
    mounted () {
      this.domId = this.getUID(this.domId)
      let config = {}

      // 获取配置项
      Object.assign(config, this.defaultConfig, this.config)
      config.toolbar = this.toolbar.length > 0 ? this.toolbar : this.defaultToolbar

      // 异步初始化，避免 DOM 的 Id 还未渲染，而导致初始化找不到 DOM 报错
      this.$nextTick(() => {
        this.init(this.domId, config)
      })
    },
    props: {
      content: {
        type: String,
        default: ''
      },
      config: {
        type: Object,
        default: () => {
          return {}
        }
      },
      toolbar: {
        type: Array,
        default: () => {
          return []
        }
      }
    },
    data () {
      return {
        um: null,
        domId: 'J_UMeditor',
        defaultToolbar: [ // 默认工具栏，详见umeditor.config.js
          'emotion'
          // 'source', '|', 'undo redo', '|', 'emotion'
        ],
        defaultConfig: { // UMeditor 配置项，详见 umeditor.config.js
          serverUrl: '', // 上传地址
          zIndex: 1050, // 默认为 900，但是 modal-backdrop 的 z-index = 1040，故不可比它小
          initialFrameWidth: '100%', // 初始化宽度
          initialFrameHeight: 200, // 初始化高度 px
          autoClearinitialContent: true // 是否自动清除编辑器初始内容
        }
      }
    },
    methods: {
      getUID (prefix) {
        do {
          prefix += ~~(Math.random() * 1000000)
        }
        while (document.getElementById(prefix))

        return prefix
      },
      init (domId, config) {
        this.um = window.UM.getEditor(domId, config)
        this.bind()
      },
      bind () {
        // 当编辑器初始化完成，设置 content
        this.um.ready(() => {
          this.um.setContent(this.content)
        })

        // 当编辑内容发生改变，emit 一个 change 事件，并传进当前的内容
        this.um.addListener('contentChange', () => {
          this.$emit('change', this.getContent())
        })
      },
      reset () {
        this.um.reset()
        this.um.setContent('')
      },
      destroy () {
        this.um.destroy()
      },
      setContent (content) {
        this.um.setContent(content)
      },
      getContent () {
        return this.um.getContent()
      },
      getPlainTxt () {
        return this.um.getPlainTxt()
      },
      insertHtml (content) {
        return this.um.execCommand('inserthtml', content)
      },
      setEnabled () {
        return this.um.setEnabled()
      },
      setDisabled () {
        return this.um.setDisabled()
        // disableBtn('enable')
      },
      removeElement (content) {
        return this.um.dom.domUtils.remove(content)
      }
    },
    watch: {
      content (val) {
        this.um.setContent(val)
      }
    }
  }
</script>
