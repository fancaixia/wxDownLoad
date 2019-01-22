
//获取应用实例
Page({

  data: {
    items:[
     
    ]
  },

  onLoad: function (query) {


  },
  savefiles(){

    wx.downloadFile({

      //示例服务器地址  'http://10.4.163.74:8080/ee.doc'
      // ee.doc对应node-download/upload下文件
      //10.4.163.74 为本机 IP地址
      //端口号8080 对应node-download/api.js中 server.listen(8080)

      url: 'http://10.4.163.74:8080/ee.doc',   
      success:(res)=> {
        console.log(res, " 下载文件成功");
        var filePath = res.tempFilePath;
   
        let manager = wx.getFileSystemManager();

        manager.rmdir({
          dirPath: `${wx.env.USER_DATA_PATH}/bluejoy`,
          recursive:true,
          success:(res)=>{
              console.log('删除目录成功')
          }
        })

        //判断目录是否存在
        manager.access({
          path: `${wx.env.USER_DATA_PATH}/bluejoy`,   //目录地址
          success: (res) => {
            console.log('已存在path对应目录',res)
            manager.saveFile({
              tempFilePath: filePath,     //filePath为保存到本地的临时路径
              filePath: `${wx.env.USER_DATA_PATH}/bluejoy/ee.doc`,
              success: (res) => {
                console.log(res," 保存成功")

                //读取目录下存放的文件列表  /bluejoy
                manager.readdir({
                  dirPath: `${wx.env.USER_DATA_PATH}/bluejoy`,
                  success: (res) => {

                    console.log("读取本地目录更新页面", res)
                    //把从目录  /bluejoy读取到的文件放进数组   setData更新页面
                    let items = [];
                    items.push({
                      file: res.files,
                      path: `${wx.env.USER_DATA_PATH}/bluejoy/` + res.files
                    })
                    console.log(items, " 读取到的items")
                    this.setData({
                      items,
                    })
                  },
                  fail: (err) => {
                    console.log(err)
                  }
                })
                
              },
              fail: (err) => {
                console.log(err)
              }
            })

            },
            fail: (err) => {
              console.log(err, '不存在path对应目录')
              //创建保存文件的目录
              manager.mkdir({
                dirPath: `${wx.env.USER_DATA_PATH}/bluejoy`,
                recursive: false,
                success: (res) => {
                  console.log('创建path对应目录成功')

                  //将临时文件保存到刚刚创建的目录  /bluejoy
                  manager.saveFile({
                    tempFilePath: filePath,
                    filePath: `${wx.env.USER_DATA_PATH}/bluejoy/ee.doc`,
                    success: (res) => {
                      console.log(res)
                      //读取目录 /bluejoy  把保存到本地的临时文件目录 
                      manager.readdir({
                        dirPath: `${wx.env.USER_DATA_PATH}/bluejoy`,
                        success: (res) => {

                          console.log("res", res)
                        //把从目录/bluejoy读取到的文件放进数组   setData更新页面
                          let items = [];
                          items.push({
                            file: res.files,
                            path: `${wx.env.USER_DATA_PATH}/bluejoy/` + res.files
                          })
                          this.setData({
                            items,
                          })
                        },
                        fail: (err) => {
                          console.log(err)
                        }
                      })

                    },
                    fail: (err) => {
                      console.log(err)
                    }
                  })

                },
                fail: (err) => {
                  console.log(err,)
                },
                complete: () => {
                  console.log("完成",)
                }
              })

            }
        })



      },
      fail:(err)=>{
          console.log(err, "下载失败")
      },
      complete:()=>{
        console.log('完成')
      }
    
    })
  },
  openfile(e){
      console.log(e, " e:frkrkookr")
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

  },

});
