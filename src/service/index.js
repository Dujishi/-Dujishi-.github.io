import tinyFetch from '../libs/fetch'

/**
 * 千牛登录
 */
export const qnLogin = (params) => tinyFetch('/user/loginQN', params, {method: 'POST'})

/**
 * 御城河登录
 */
export const ychLogin = (params) => tinyFetch('/user/loginYCH', params, {method: 'POST'})

/**
 * 登录
 */
export const login = (params) => tinyFetch('/user/login', params, {method: 'POST'})

/**
 * 退出登录
 */
export const logout = (params) => tinyFetch('/user/logout', params, {method: 'POST'})

/**
 * 重置密码
 */
export const resetPassword = (params) => tinyFetch('/user/resetpw', params, {method: 'POST'})

/**
 * 修改密码
 */
export const changePassword = (params) => tinyFetch('/user/changepw', params, {method: 'POST'})

/**
 * 绑定手机
 */
export const bindMobile = (params) => tinyFetch('/user/bindMobile', params, {method: 'POST'})

/**
 * 知识库
 * 获取问题分类
 */
export const questionSlideMenu = (params) => tinyFetch('/api/confinfo/items', params, {method: 'POST'})

/**
 * 知识库列表
 * 知识库类型 type（0：官方，1：自定义，2：关键词）
 */
export const knowledgeList = (params) => tinyFetch('/api/knowledge/list', params, {method: 'POST'})

/**
 * 知识库
 * 新增答案初始化
 */
export const initEditAnswer = (params) => tinyFetch('/api/knowledge/initAnswer/', params, {method: 'GET'})

/**
 * 知识库
 * 编辑答案
 */
export const editAnswer = (params) => tinyFetch('/api/knowledge/edit/a/', params, {method: 'GET'})

/**
 * 知识库
 * 编辑器条件隐藏
 */
export const hiddenConfig = (params) => tinyFetch('/api/knowledge/answer/hiddenConfig', params, {method: 'GET'})

/**
 * 知识库
 * label列表
 */
export const labelList = (params) => tinyFetch('/api/knowledge/answer/aiLabel/', params, {method: 'GET'})

/**
 * 知识库
 * 问法正则列表
 */
export const getRegular = (params) => tinyFetch('/api/question/regular/', params, {method: 'GET'})

/**
 * 知识库
 * 获取错误代码
 */
export const getErrorCode = (params) => tinyFetch('/api/knowledge/answer/errorCode', params, {method: 'POST'})

/**
 * 知识库
 * 指定商品列表
 */
export const relatedProductList = (params) => tinyFetch('/api/product/relatedProduct', params, {method: 'POST'})

/**
 * 知识库
 * 保存答案
 */
export const saveEditAnswer = (params) => tinyFetch('/api/knowledge/addAnswer', params, {method: 'POST'})

/**
 * 知识库
 * 删除答案
 */
export const delAnswer = (params) => tinyFetch('/api/knowledge/delete/a/', params, {method: 'DELETE'})

/**
 * 知识库
 * 恢复默认答案
 */
export const defaultAnswer = (params) => tinyFetch('/api/knowledge/reset/k/', params, {method: 'GET'})

/**
 * 知识库
 * 启用/禁用 0.禁用 1.启用）
 */
export const officalEnable = (params) => tinyFetch('/api/knowledge/officalEnable', params, {method: 'POST'})

/**
 * 知识库
 * 转人工/售后 1.转人工 2.转售后
 */
export const needhuman = (params) => tinyFetch('/api/knowledge/needhuman', params, {method: 'POST'})

/**
 * 自定义知识库
 * 新增知识库
 */
export const addKnowledge = (params) => tinyFetch('/api/knowledge/addKnowledge', params, {method: 'POST'})

/**
 * 自定义知识库
 * 删除知识库
 */
export const deleteKnowledge = (params) => tinyFetch('/api/knowledge/delete/k/', params, {method: 'DELETE'})

/**
 * 自定义知识库
 * 新增问法
 */
export const addQuestion = (params) => tinyFetch('/api/knowledge/addQuestion', params, {method: 'POST'})

/**
 * 自定义知识库
 * 编辑问法
 */
export const editQuestion = (params) => tinyFetch('/api/knowledge/edit/q/', params, {method: 'GET'})

/**
 * 自定义知识库
 * 删除问法
 */
export const deleteQuestion = (params) => tinyFetch('/api/knowledge/delete/q/', params, {method: 'DELETE'})

/**
 * 关键词知识库
 * 关键词详情
 */
export const keywordsInfo = (params) => tinyFetch('/api/knowledge/edit/k/', params, {method: 'GET'})

/**
 * 待改进知识库
 * 上传原始语料
 */
export const uploadPrimitiveData = (params) => tinyFetch('/api/undefinedOrigin/uploadFile', params, {method: 'POST'})

/**
 * 官方待改进知识库
 * 列表
 */
export const officialImproveList = (params) => tinyFetch('/api/improveKnowledge/list', params, {method: 'POST'})

/**
 * 官方待改进知识库
 * label详情
 */
export const officialImproveInfo = (params) => tinyFetch('/api/improveKnowledge/k/', params, {method: 'GET'})

/**
 * 官方待改进知识库
 * label详情
 */
export const operateOfficialImprove = (params) => tinyFetch('/api/improveKnowledge/opt', params, {method: 'POST'})

/**
 * 未识别知识库
 * 列表
 */
export const unkonwledgeList = (params) => tinyFetch('/api/unknowledge/list', params, {method: 'POST'})

/**
 * 未识别知识库
 * 详情
 */
export const unkonwledgeInfo = (params) => tinyFetch('/api/unknowledge/detail', params, {method: 'POST'})

/**
 * 未识别知识库
 * 编辑保存
 */
export const unkonwledgeEdit = (params) => tinyFetch('/api/unknowledge/edit', params, {method: 'POST'})

/**
 * AI回复语料标记
 * 语料列表
 */
export const chatLogList = (params) => tinyFetch('/api/chatLog/list', params, {method: 'POST'})

/**
 * AI回复语料标记
 * 语料标记
 */
export const chatLogTag = (params) => tinyFetch('/api/chatReport/tag', params, {method: 'POST'})

/**
 * 答案时效
 * 答案时效列表
 */
export const answerManList = (params) => tinyFetch('/api/periodTime/listPage', params, {method: 'POST'})

/**
 * 答案时效
 * 答案时效详情
 */
export const answerInfo = (params, type) => tinyFetch('/api/periodTime/p/', params, {method: type})

/**
 * 答案时效
 * 答案时效保存
 */
export const answerSave = (params) => tinyFetch('/api/periodTime/edit', params, {method: 'POST'})

/**
 * 商品设置
 * 列表
 */
export const productList = (params) => tinyFetch('/api/product/productList', params, {method: 'POST'})

/**
 * 商品设置
 * 详情
 */
export const productInfo = (params) => tinyFetch('/api/product/productDetail/', params, {method: 'POST'})

/**
 * 商品设置
 * 编辑
 */
export const productEdit = (params) => tinyFetch('/api/product/productEdit', params, {method: 'POST'})

/**
 * 商品设置
 * 其他列表属性
 */
export const productAttrs = (params) => tinyFetch('/api/product/attrs', params, {method: 'GET'})

/**
 * 商品设置
 * 其他列表属性
 */
export const productSyn = (params) => tinyFetch('/api/product/productSyn/', params, {method: 'GET'})

/**
 * 尺码设置
 * 列表
 */
export const sizeChartList = (params) => tinyFetch('/api/product/sizeTable/listPage', params, {method: 'POST'})

/**
 * 尺码设置
 * 详情
 */
export const sizeChartInfo = (params, type) => tinyFetch('/api/product/sizeTable/s/', params, {method: type})

/**
 * 尺码设置
 * 保存尺码表
 */
export const sizeChartEdit = (params) => tinyFetch('/api/product/sizeTable/edit', params, {method: 'POST'})

/**
 * 尺码设置
 * 保存尺码表
 */
export const sizeChartCopy = (params) => tinyFetch('/api/product/sizeTable/copy', params, {method: 'POST'})

/**
 * 设置
 * 店铺配置信息
 */
export const settingConf = (params) => tinyFetch('/api/shop/conf/', params, {method: 'GET'})

/**
 * 设置
 * 编辑店铺配置
 */
export const saveSetting = (params) => tinyFetch('/api/shop/editConf', params, {method: 'POST'})

/**
 * 用户画像
 * 列表
 */
export const userPortraitList = (params) => tinyFetch('/api/buyerportrait/list', params, {method: 'POST'})

/**
 * 用户画像
 * 详情
 */
export const userPortraitInfo = (params) => tinyFetch('/api/buyerportrait/detail', params, {method: 'POST'})

/**
 * 活动管理
 * 列表
 */
export const activeList = (params) => tinyFetch('/api/activity/list', params, {method: 'POST'})

/**
 * 活动管理
 * 详情
 */
export const activeInfo = (params) => tinyFetch('/api/activity/detail/', params, {method: 'GET'})

/**
 * 活动管理
 * 保存
 */
export const activeSave = (params) => tinyFetch('/api/activity/save', params, {method: 'POST'})

/**
 * 活动管理
 * 删除
 */
export const activeDel = (params) => tinyFetch('/api/activity/delete/', params, {method: 'DELETE'})

/**
 * 催单设置
 * 详情
 */
export const reminderInfo = (params) => tinyFetch('/api/reminder/', params, {method: 'GET'})

/**
 * 催单设置
 * 保存
 */
export const reminderSave = (params) => tinyFetch('/api/reminder/edit', params, {method: 'POST'})

/**
 * 知识库
 * 获取错误代码
 */
export const getCommConfValue = (params) => tinyFetch('/api/knowledge/answer/commonConfigItems', params, {method: 'POST'})

/**
 * 通用配置
 * 详情
 */
export const commonConfList = (params) => tinyFetch('/api/commonconfig/edit/', params, {method: 'GET'})

/**
 * 批量保存通用配置
 */
export const saveCommonConf = (params) => tinyFetch('/api/commonconfig/batchUpdate', params, {method: 'POST'})

/**
 * 客服转化率接口
 */
export const dataInfoOld = (params) => tinyFetch('/api/transRate/list', params, {method: 'POST'})

/**
 * 数据统计
 * 图表数据
 */
export const dataInfo = (params) => tinyFetch('/api/stat/list', params, {method: 'POST'})

/**
 * 数据统计
 * 店铺子账号
 */
export const childAccountList = (params) => tinyFetch('/api/shop/account/', params, {method: 'GET'})

/**
 * 数据统计
 * 问题种类数据表格
 */
export const dataTableList = (params) => tinyFetch('/api/question/stat', params, {method: 'POST'})

/**
 * 数据统计
 * 标签分类统计
 */
export const dataTableInfo = (params) => tinyFetch('/api/label/stat', params, {method: 'POST'})

/**
 * 客服状态（假期）
 * 详情
 */
export const serviceHolidayInfo = (params) => tinyFetch('/api/shopHoliday/info', params, {method: 'POST'})

/**
 * 客服状态（假期）
 * 保存
 */
export const serviceHolidaySave = (params) => tinyFetch('/api/shopHoliday/save', params, {method: 'POST'})

/**
 * 聊天机器人
 * 接口
 */
export const initChatbot = (params) => tinyFetch('/api/chatbot/initChatbot', params, {method: 'POST'})

/**
 * 引导话术
 * 列表
 */
export const guideList = (params) => tinyFetch('/api/shopGuidedWords/shopGuidedWordsList', params, {method: 'POST'})

/**
 * 引导话术
 * 详情
 */
export const guideInfo = (params) => tinyFetch('/api/shopGuidedWords/editShopGuidedWordsDetail', params, {method: 'POST'})

/**
 * 引导话术
 * 编辑-保存
 */
export const guideUpdate = (params) => tinyFetch('/api/shopGuidedWords/update', params, {method: 'POST'})

/**
 * 引导话术
 * 会话主题列表
 */
export const guideThemesList = (params) => tinyFetch('/api/shopGuidedWords/findWordsThemeByShopId', params, {method: 'POST'})

/**
 * 引导话术
 * 新增
 */
export const guideAdd = (params) => tinyFetch('/api/shopGuidedWords/add', params, {method: 'POST'})

/**
 * 引导话术
 * 新增
 */
export const guideDelete = (params) => tinyFetch('/api/shopGuidedWords/delete', params, {method: 'POST'})

/**
 * 客户端版本管理
 * 版本列表
 */
export const getClientVersions = (params) => tinyFetch('/api/clientVersion/getClientVersions', params, {method: 'GET'})
