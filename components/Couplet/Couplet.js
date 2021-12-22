// components/Couplet/Couplet.js
Component({
	/**
	 * 组件的属性列表
	 */
	properties: {
		coupletList:{
			type: Array,
			value: []
		}
	},

	/**
	 * 组件的初始数据
	 */
	data: {

	},

	/**
	 * 组件的方法列表
	 */
	methods: {

	},

	// 使用全局样式，否则icon图标不能在自定义组件中使用
	options: {
		addGlobalClass: true
	}
})
