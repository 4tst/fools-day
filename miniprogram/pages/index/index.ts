// index.ts
// 获取应用实例
const app = getApp<IAppOption>()
const defaultAvatarUrl = 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0'

Page({
  data: {
    userInfo: {},
    hasUserInfo:false,
    avatarUrl:wx.getStorageSync("avatarUrl")||defaultAvatarUrl,
    nickname:wx.getStorageSync('nickname')||"",
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    canIUseGetUserProfile: false,
    canIUseOpenData: false // open-data被禁用后只能交互式获取
  },
  // 事件处理函数
  bindViewTap() {
    wx.navigateTo({
      url: '../logs/logs',
    })
  },
  // 竟然不能在wx:if中调用此方法
  hasUserInfo(){
    console.log('xxxxx',this.data)
    return (this.data.avatarUrl && this.data.nickname)!=""
  },
  onChooseAvatar(e){
    console.info("chooseAvatar",e)
    const {avatarUrl}=e.detail
    this.setData({
        avatarUrl:avatarUrl,
    })
    wx.setStorageSync("avatarUrl",avatarUrl)
  },
  onInputNickname(e){
    this.setData({
      nickname:e.detail.value,
    })
    wx.setStorageSync("nickname",e.detail.value)
  },
  onLoad() {
    console.log("1",wx.canIUse('open-data.type.userAvatarUrl') ,wx.canIUse('open-data.type.userNickName'))
    console.log(2,wx.getUserProfile)
    console.log(3,this.hasUserInfo(),this.data)
    // @ts-ignore
    if (wx.getUserProfile) {
      this.setData({
        canIUseGetUserProfile: true
      })
    }

    this.setData({
        hasUserInfo:this.hasUserInfo()
    })
  },
  getUserProfile() {
    // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认，开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
    wx.getUserProfile({
      desc: '展示用户信息', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        console.log('getUserProfile:',res)
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    })
  },
  getUserInfo(e: any) {
    // 不推荐使用getUserInfo获取用户信息，预计自2021年4月13日起，getUserInfo将不再弹出弹窗，并直接返回匿名的用户个人信息
    console.log("getUserInfo",e)
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})
