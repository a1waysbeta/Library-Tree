功能丰富的 foobar2000 的媒体库查看器。

 ### 功能
- 树型视图
- 以专辑封面浏览
- 新的分面模式
- 播放统计信息
- 流动封面模式
- 选择媒体库和播放列表作为来源
- 单面板和多面板模式
- 模式预设
     - 浏览：继续播放列表
     - 播放：在没有播放列表的情况下播放
     - 默认：选择所有操作

### 要求:
- foobar2000
- [Spider Monkey Panel 1.5.2+](https://www.foobar2000.org/components)
- IE8 或更高版本
- [FontAwesome](https://github.com/FortAwesome/Font-Awesome/blob/fa-4/fonts/fontawesome-webfont.ttf?raw=true)

### 安装
按如下方式作为包安装。

全新安装或更新：
1) 在 foobar2000 中添加一个 Spider Monkey 面板
2) 关闭任何使用 foobar2000 文件夹或子文件夹的 Windows 资源管理器
3) 右键点击 Spider Monkey 面板，必要时按 Windows + Shift 键
4) 选择 "Configure panel..."
5) 在 "Script" 选项卡中选择 "Package"
6) 如果 "Script package manager" 没有自动打开，则打开它
7) 点击 "Import" 按钮导入包

#### 注意事项：
- 安装路径包含中文，导入包会报错。
- 或可自行解压至 foobar2000 配置文件目录\profile\foo_spider_monkey_panel\packages\{E85C9EF0-778B-46DD-AF20-F4BE831360DD}，解决路径包含中文的问题。

## 截图

#### 带有艺术家图像和封面的双面板模式
<kbd> <img src="https://user-images.githubusercontent.com/35600752/155884212-9bea1326-3430-46a4-a86e-3bc4b09e4dd4.png"> </kbd>
屏幕截图使用 CUI + 深色主题 + 隐藏分隔符。

#### 流动封面模式（上图）和树型模式（下图）
<kbd> <img src="https://user-images.githubusercontent.com/35600752/155903327-9631a328-2f67-4f25-9cbd-316e5f5210b5.png"> </kbd>
树型模式显示各种节点样式，从左到右：用户界面主题；深色主题；混合主题；专辑封面背景

#### 带索引和封面的双面板模式
<kbd> <img src="https://user-images.githubusercontent.com/35600752/156163852-5d8295f4-3ff2-4ef4-849f-0bd5ce24ba8e.png"> </kbd>
要设置上述内容，请并排放置两个 Spider Monkey 面板。将 Library Tree 添加到每个面板。屏幕截图使用深色主题（面板设置>显示>主题） + CUI + 隐藏分隔符。
- 右侧面板：将来源设置为面板并按照弹出窗口中的说明进行操作
- 左侧面板：在显示选项卡上，勾选“列表视图（树型）”。使用类似如下的查看方式模版：
```
$cut(%artist%,1)|%artist%|$if2(%album%,εXtra)|[[%discnumber%.]%tracknumber%. ][%track artist% - ]%title%
```
#### 树型模式，带有专辑封面背景 + 跳转搜索
<kbd> <img src="https://user-images.githubusercontent.com/35600752/118255885-b5a41e00-b4a4-11eb-8f19-7a24e5215463.png"> </kbd>

### 致谢
- Original Jscript library search (2013): thanhdat1710
- Original JS smooth browser design (2015): Br3tt (aka falstaff)
- [TT-ReBORN](https://github.com/TT-ReBORN) for clean preset inspiration 

### 汉化学习过程中，感谢他们的帮助
Asion，Elia_Is_Me，ttsping，dreamawake，木魚(ifish)，.阿太，wntjdqls，...
