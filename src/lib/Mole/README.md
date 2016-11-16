##changelogs
###v2.1.2
1. debug模式显示id
2. 增加jsmole 统计
3. 增加moleJsFirstScreen 统计


##说明
### 版本
1. 遵循语义化版本规范；
2. prod分支为最新的稳定的发布版本；
3. tags中的分支对应每一个发布版本,建议使prod_x_x_0版本；
4. 其余分支为开发分支，为不稳定版本；

### 使用

    代码inline到 head

### 配置(可选)
`Mole.init(options)`
1. options.delay(number)，延迟上报时间，默认2s.
2. options.RT(number)，RequestOutTime请求超时时间，超时将报warning，默认5s
3. options.spma，业务spma
4. options.spmb，页面spmb
5. options.version，业面版本号 默认'unknown'

### 接口(必须)

    Mole.performance.firstScreenTime(num); //num: vap(api)请求次数
    Mole.performance.custom('cutstomName',duration);  //自定义性能日志  duration:int 持续时间
    
### 如何获取网络信息
1. 微信下面获取
    需要注册wxapi,建议在分享里面注册api,该api是静默方式,不会影响到交互
     jsApiList: ['getNetworkType']  //增加getNetworkType
     
2. app里面获取(微店暂时不支持)
    页面引入https://assets.geilicdn.com/v-components/cambridge/0.0.3/cambridge.debug.js (可以放在任何位置)
