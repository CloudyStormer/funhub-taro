export default defineAppConfig({
  pages: [
    'pages/home/index',
    'pages/english/index',
    'pages/painting/index',
    'pages/fitness/index',
    'pages/tianjin/index',
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fdfaf5',
    navigationBarTitleText: '花果山有点东西',
    navigationBarTextStyle: 'black'
  },
  permission: {
    'scope.record': {
      desc: '需要使用麦克风进行语音练习'
    }
  }
})
