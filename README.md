### wxDownLoad 小程序中文件下载

**注：页面请求文件为 node-download/upload 目录下的文件 ，可自行修改**

![https://github.com/fancaixia/wxDownLoad/blob/master/pic/001.png](https://github.com/fancaixia/wxDownLoad/blob/master/pic/001.png)

##### 基本思路
1. wx.onload中读取服务器文件列表 和缓存到本地的文件列表

2. 文件下载：

    创建本地目录 /download   （创建之前判断此目录是否存在，存在的话则直接保存文件到此目录）

    将下载的文件路径缓存到 /download目录中

    读取目录/download ，获取当前小程序下载到本地的文件列表

    将获取到的文件列表保存至downloadFile数组更新到页面（同时给每个view记录路径data-path）

    点击已下载的文件可根据路径data-path打开查看

### 示例代码
```
<scroll-view scroll-y class="container">

 <view class='defaultfile'>
        <view wx:for="{{defaultfiles}}" wx:key="index" wx:for-item="item">
          <view class="fileText" data-name="{{item}}" bindtap='savefiles'>{{item}}       </view>
        </view>
 </view>  

  <view class='downloadbox'>
      <view wx:if="{{downloadFile.length>0}}">下载到本地的文件列表: </view>
      <view wx:for="{{downloadFile}}" wx:key="index" wx:for-item="item">
          <view bindtap='openfile' class='download' data-path="{{item.path}}">{{item.file}}              </view>
      </view>
  </view>

</scroll-view>
```
```
Page({
 data: {
    defaultfiles:[],       //此数组为后台获取的文件列表 
    downloadFile:[]        //此数组为下载到本地的文件列表
  },
```

##### 读取本地缓存文件
```
  getLocalFiles(manager, $this) {
    manager.readdir({
      dirPath: `${wx.env.USER_DATA_PATH}/download`,
      success: (res) => {
        // console.log('本地文件列表: ', res)
        let downloadFile = [];
        res.files.forEach((item, index) => {
          downloadFile.push({
            file: item,
            path: `${wx.env.USER_DATA_PATH}/download/` + item
          })
        })

        $this.setData({
          downloadFile,
        })

      },

    })
  },
```
##### 下载文件
```
wx.downloadFile({
      url: serverAddress.url + '/' + fileName,   
      success:(res)=> {
        // console.log(res, " 下载文件成功");
        var filePath = res.tempFilePath;
        let manager = wx.getFileSystemManager();  //获取全局唯一的文件管理器

        //判断目录是否存在
        manager.access({
          path: `${wx.env.USER_DATA_PATH}/download`,
          success: (res) => {
            console.log('已存在path对应目录',res)
            //保存文件之前查看是否存在此文件  
            manager.access({
              path: `${wx.env.USER_DATA_PATH}/download/${fileName}`, 
              success(res){
                // console.log('已存在此文件', res);
                return false;
              },
              fail(err){
                  console.log('不存在此文件')
                  manager.saveFile({
                    tempFilePath: filePath,     //filePath为保存到本地的临时路径
                    filePath: `${wx.env.USER_DATA_PATH}/download/${fileName}`,
                    success: (res) => {
                      $this.getLocalFiles(manager, $this)
                    }
                  })
              }
            })

            },
            fail: (err) => {
              console.log(err, '不存在path对应目录')
              //创建保存文件的目录
              manager.mkdir({
                dirPath: `${wx.env.USER_DATA_PATH}/download`,
                recursive: false,
                success: (res) => {
                  //将临时文件保存到目录  /download
                   manager.saveFile({
                    tempFilePath: filePath,
                    filePath: `${wx.env.USER_DATA_PATH}/download/${fileName}`,
                    success: (res) => {
                      // console.log(res)
                      $this.getLocalFiles(manager, $this)
                    }
                  })
                },
              })

            }
        })

      }
    })
```
##### 下载后打开文件
```
openfile(e){
      // console.log(e, " e:frkrkookr")
      let path = e.currentTarget.dataset.path;
      wx.openDocument({
        filePath: path,
        success:(res)=>{
            console.log('读取成功',res)
        },
        fail:(err)=>{
          console.log('读取失败',err)
        }
      })
  }

})
```
### 项目启动
1. static-download为小程序项目，
2. node-download为服务端项目，node-download目录下upload目录为下载的资源文件
3. 启动node服务  
  - cd/node-download 
  - 修改config.js  中的 请求地址为本机IP
  - cnpm install （安装依赖） 
  - node app.js （启动node服务）



