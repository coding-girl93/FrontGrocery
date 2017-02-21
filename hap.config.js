/**
# 与项目相关的配置
## `environment`变量说明
    0 : 开发
    1 : 测试
    2 : 预发
    3 : 线上
## `args`对象包含的数据
    group:仓库组
    name: 项目名称
    version: 版本号
    static: 静态资源目录
    environment: 当前环境变量
    dev: 是否是开发环境
    hash: hash串，如果为文件hash，则为空串
 */
var path = require('path');
var config = {
    group: 'm',

    //项目名称
    name: 'FrontGrocery',

    //server端口
    port: 3003,


};
module.exports = config;
