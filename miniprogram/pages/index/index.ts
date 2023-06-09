// index.ts
// 获取应用实例
const app = getApp<IAppOption>()
const defaultAvatarUrl = 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0'

Page({
    data: {
        countdownInterval:0,
        countdown:30,
        userInfo: {},
        hasUserInfo: false,
        avatarUrl: wx.getStorageSync("avatarUrl") || defaultAvatarUrl,
        nickname: wx.getStorageSync('nickname') || "",
        canIUse: wx.canIUse('button.open-type.getUserInfo'),
        canIUseGetUserProfile: false,
        canIUseOpenData: false // open-data被禁用后只能交互式获取
    },
    confirmUserInfo() {
        if (this.data.nickname) {
            wx.setStorageSync("nickname", this.data.nickname)
        }
        if (this.data.avatarUrl != defaultAvatarUrl) {
            wx.setStorageSync("avatarUrl", this.data.avatarUrl)
        }
        if (!this.hasUserInfo()) {
            wx.showToast({
                title: "用户信息不完整",
                icon: "error",
                duration: 2000,
            })
            return
        }
        this.setData({
            hasUserInfo: this.hasUserInfo(),
        })
        this.showGhost()
    },
    // 事件处理函数
    bindViewTap() {
        wx.navigateTo({
            url: '../logs/logs',
        })
    },
    // 竟然不能在wx:if中调用此方法
    hasUserInfo() {
        console.log('xxxxx', this.data)
        return Boolean(wx.getStorageSync('avatarUrl') && wx.getStorageSync('nickname'))
    },
    showGhost(){
        this.setData({
            countdown:30,
        })
        setTimeout(() => {
            wx.showModal({
                title: "哈哈哈",
                content: "愚人节快乐！希望没有吓到你",
                confirmText: "垃圾玩意",
                cancelText: "吓死我了",
                success: ({ confirm, cancel }) => {
                    if (confirm) {
                        wx.showToast({
                            icon: "success",
                            duration: 5 * 1000,
                            title: "试试你胆小儿砸",
                        })
                    } 
                    if(cancel) {
                        wx.showToast({
                            icon: "error",
                            duration: 5 * 1000,
                            title: "转发即转移害怕"
                        })
                    }
                    return true
                }
            })
        }, 23 * 1000)
      
    },
    onChooseAvatar(e) {
        console.info("chooseAvatar", e)
        const { avatarUrl } = e.detail
        this.setData({
            avatarUrl: avatarUrl,
        })
    },
    onLoad() {
        console.log("1", wx.canIUse('open-data.type.userAvatarUrl'), wx.canIUse('open-data.type.userNickName'))
        console.log(2, wx.getUserProfile)
        console.log(3, this.hasUserInfo(), this.data)
        // @ts-ignore
        if (wx.getUserProfile) {
            this.setData({
                canIUseGetUserProfile: true
            })
        }
        this.setData({
            hasUserInfo: this.hasUserInfo()
        })
        this.data.countdownInterval=setInterval(()=>{
            let x=this.data.countdown-1
            this.setData({
                countdown:x>=0?x:30,
            })
        },1*1000)
    },
    onUnload(){
        console.log("unload",this.data.countdownInterval)
        if(this.data.countdownInterval){
            clearInterval(this.data.countdownInterval)
        }
    },
    getUserProfile() {
        // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认，开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
        wx.getUserProfile({
            desc: '展示用户信息', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
            success: (res) => {
                console.log('getUserProfile:', res)
                this.setData({
                    userInfo: res.userInfo,
                    hasUserInfo: true
                })
            }
        })
    },
    getUserInfo(e: any) {
        // 不推荐使用getUserInfo获取用户信息，预计自2021年4月13日起，getUserInfo将不再弹出弹窗，并直接返回匿名的用户个人信息
        console.log("getUserInfo", e)
        this.setData({
            userInfo: e.detail.userInfo,
            hasUserInfo: true
        })
    }
})
