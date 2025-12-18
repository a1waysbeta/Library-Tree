# Library Tree

作者：[WilB](https://github.com/Wil-B/Library-Tree)，汉化：[always beta](https://github.com/a1waysbeta/Library-Tree)

功能丰富的 foobar2000 的媒体库查看与浏览脚本。

## 功能特性
- 树状视图查看器
- 专辑封面浏览器
- 分面查看器
- 播放统计信息
- 流动封面模式
- 媒体库、播放列表及面板三数据源
- 单面板与多面板显示模式
- 模式预设
     - 浏览模式：继续播放播放列表
     - 播放模式：播放并管理，无需播放列表
     - 默认模式：自定义按键配置

### 要求:
- foobar2000
- [Spider Monkey Panel 1.5.2+](https://www.foobar2000.org/components)
- IE8 或更高版本
- [FontAwesome](https://github.com/FortAwesome/Font-Awesome/blob/fa-4/fonts/fontawesome-webfont.ttf?raw=true)

### 安装
按以下方式以 **脚本包（Package）** 形式安装。

全新安装 / 更新安装：
1. 如尚未添加，请在 foobar2000 中添加一个 Spider Monkey Panel 面板
2. 关闭所有正在访问 foobar2000 安装目录或其子目录的 **Windows 资源管理器窗口**
3. 按住 Windows + Shift 键，右键点击 Spider Monkey Panel 面板
4. 选择 “配置面板...”
5. 在 “脚本” 选项卡中，选择 “包” 来源，打开 “脚本包管理器”
6. 点击 “导入”，导入脚本包

#### 注意事项：
- 若 **安装路径包含中文字符**，导入脚本包时可能会失败。
- 可作为替代方案，将包内容手动解压至以下目录，以避免路径编码问题：
```
  [foobar2000 配置目录]\foo_spider_monkey_panel\packages\{E85C9EF0-778B-46DD-AF20-F4BE831360DD}
```

## 界面截图

#### 双面板模式（显示艺术家图片与专辑封面）
<kbd> <img src="https://user-images.githubusercontent.com/35600752/155884212-9bea1326-3430-46a4-a86e-3bc4b09e4dd4.png"> </kbd>
此截图使用了深色主题以及隐藏了分隔条的 Columns UI 界面。左侧面板：快速设置 > 艺术家照片（标签位于右侧）；右侧面板：快速设置 > 专辑封面（标签位于底部）。

#### 封面流模式（上）与树状视图模式（下）
<kbd> <img src="https://user-images.githubusercontent.com/35600752/155903327-9631a328-2f67-4f25-9cbd-316e5f5210b5.png"> </kbd>
树状视图模式展示了多种节点样式，从左至右分别为：用户界面主题、深色主题、混合主题、专辑封面背景。

#### 带字母索引与封面的双面板模式
<kbd> <img src="https://user-images.githubusercontent.com/35600752/156163852-5d8295f4-3ff2-4ef4-849f-0bd5ce24ba8e.png"> </kbd>
要配置以上布局，请将两个 Spider Monkey Panel 并排放置，并分别添加 Library Tree 脚本。此截图使用了深色主题（在 “显示” 选项卡中设置）以及隐藏了分隔条的 Columns UI。
- 右侧面板：将来源设为 “面板”，并按照弹出提示操作。
- 左侧面板：在 “显示” 选项卡中，勾选 “列表视图（树状）”。可使用类似下方的查看方式模板：
```
$cut(%artist%,1)|%artist%|$if2(%album%,εXtra)|[[%discnumber%.]%tracknumber%. ][%track artist% - ]%title%
```

#### 深色模式配色（左、右）与专辑封面背景（中）
<kbd> <img src="https://user-images.githubusercontent.com/35600752/188288519-e8056889-9dd0-409d-bbfc-feb6026d0eac.png"> </kbd>
- 左侧：快速设置 > 封面 [右侧标签]。
- 中间：带跳转搜索功能且以封面为背景的树状视图。设置：显示选项卡 > 主题 > 封面，并根据喜好调整封面不透明度。
- 右侧：带曲目时长、项目计数和排序菜单的树状视图。快速设置：超现代。
- 可为任何树状视图或专辑封面视图启用时长显示。

### 致谢
- Original Jscript library search (2013): thanhdat1710
- Original JS smooth browser design (2015): Br3tt (aka falstaff)
- [TT-ReBORN](https://github.com/TT-ReBORN) for clean preset inspiration 

### 汉化学习过程中，感谢他们的帮助
Asion，Elia_Is_Me，ttsping，dreamawake，木魚(ifish)，.阿太，wntjdqls，...

### 汉化声明

* 本项目为 Library-Tree 脚本包的简体中文汉化，版权归原作者所有
* 汉化仅用于学习与个人使用，免费提供
* 欢迎转载与反馈，翻译问题可随时指正