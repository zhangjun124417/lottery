# smartcounterdatahouse

## 项目说明

* 项目目录结构

```
+-app                         # 前端代码
| +-api-v1                    # 接口列表
| +-components                # 界面组件
| +-services                  # 服务
| +-styles                    # 样式
| +-utils                     # 工具方法
| +-app.vue                   # 总体视图框架
| +-index.html                # 入口 HTML
| +-index.js                  # 入口 JS
| +-route.js                  # 前端路由
|
+-build                       # 打包构建配置
+-config                      # 项目配置
+-config-env                  # 不同环境的不同配置(production/test ...)
+-dist                        # 构建打包目录
+-lib                         # 后端代码
| +-config                    # 模块配置(koa/log4js ...)
| +-api-v1                    # 接口控制器，主要逻辑
| +-models                    # 数据模型
| +-utils                     # 工具集合
| +-route.js                  # 后端路由
| +-schedule.js               # 定时任务
|
+-logs                        # 日志
+-node_modules                # node 模块
+-gulpfile.js                 # gulp 入口
+-package.json                # 后端依赖库描述文件
+-server.js                   # 服务启动入口
```

**`node_modules` 目录下的包要通过 `npm install` 安装**

## 环境依赖

* [Node.js](http://nodejs.org/) - [下载和安装](http://nodejs.org/download)
* 数据库 [MongoDB](http://www.mongodb.org/) - [下载和安装](http://www.mongodb.org/downloads)

## 使用方法

### 设置项目名称:

替换所有文件中的 `smartcounterdatahouse` 改为项目的名称

### 根据 `package.json` 下载相应包:

```
cd 到项目目录
npm install
```

### 运行平台--开发模式

```
npm start
```

### 打发行包

```
npm run build
```

项目目录下的 `dist/smartcounterdatahouse.tar.gz` 为发行包

**请参考下方 部署到 CentOS 说明**

### 部署到 CentOS 说明

CentOS 版本：CentOS 7.2

#### 安装 gcc, g++, openssl, python(要求2.6或2.7版本):

```
yum install gcc gcc-c++ openssl-devel
```

#### 安装 Node.js

```
wget https://npm.taobao.org/mirrors/node/latest/node-v8.4.0-linux-x64.tar.gz
tar -xzvf node-v8.4.0-linux-x64.tar.gz
mv node-v8.4.0-linux-x64 /starnet/node
```

修改 `/etc/profile`， 修改以下内容

```
# Path manipulation
if [ "$EUID" = "0" ]; then
    pathmunge /usr/sbin
    pathmunge /usr/local/sbin
else
    pathmunge /usr/local/sbin after
    pathmunge /usr/sbin after
fi

# 增加下面这行
pathmunge /starnet/node/bin
```

执行

```
source /etc/profile
```

#### 安装 pm2

```
 npm install pm2@latest -g
```

**注意:详细使用可参考 [pm2 官网](https://github.com/Unitech/pm2)**

#### 安装并设置 MongoDB

```
wget https://fastdl.mongodb.org/linux/mongodb-linux-x86_64-3.4.6.tgz
tar zxvf mongodb-linux-x86_64-3.4.6.tgz
mv mongodb-linux-x86_64-3.4.6.tgz /starnet/mongodb
cd /starnet/mongodb
mkdir -p data/db
export MONGO_HOME=/starnet/mongodb
vi mongo.conf
```

内容为

```
dbpath = /starnet/mongodb/data/db
logpath = /starnet/mongodb/mongo.log
directoryperdb = true
logappend = true
storageEngine = wiredTiger
journal = true
```

启动 MongoDB

```
pm2 start $MONGO_HOME/bin/mongod -- -config $MONGO_HOME/mongo.conf
```

重新启动 mongoDB

```
pm2 restart mongod
```

#### 部署平台发行包

复制发行包 `smartcounterdatahouse.tar.gz` 到操作系统

```
tar zxvf smartcounterdatahouse.tar.gz -d smartcounterdatahouse
```

访问路径 <https://localhost:8000>
