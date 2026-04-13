# 小狼毫（Weasel / Rime）使用指南

这份指南用于在 Windows 电脑上安装小狼毫，并应用当前仓库保存的自定义配置。

适用场景：
- 当前这台电脑重新安装或恢复配置
- 另一台 Windows 电脑快速复用同一套输入法习惯
- 让另一台电脑上的 Codex 直接按仓库配置完成落地

## 当前配置概览

这套配置的目标是尽量接近 mac 的输入习惯，同时保留 Windows 常见快捷键行为：

- `Caps Lock`：切换中英文
- `Shift`：只负责大小写，不再切换中英文
- 候选栏：横向显示
- 每页候选数：`7`
- 候选项间距：略增大
- 字号：比默认略小
- `global_ascii: false`：英文模式不全局联动到所有窗口

仓库中的配置文件：
- `config/rime/default.custom.yaml`
- `config/rime/weasel.custom.yaml`

## 下载地址

官方项目页：
- <https://github.com/rime/weasel>

官方发布页：
- <https://github.com/rime/weasel/releases>

截至 `2026-04-13`，已确认的最新稳定版为 `0.17.4`。如果你想直接下载这一版安装包，可使用：

- <https://github.com/rime/weasel/releases/download/0.17.4/Weasel-0.17.4.0-installer.exe>

如果将来版本更新，优先以官方 `Releases` 页为准。

## 安装步骤

1. 打开上面的发布页，下载安装包。
2. 运行安装包，按默认选项安装即可。
3. 安装完成后，使用 `Win + Space` 切换到小狼毫。
4. 先确认能正常输入拼音，再继续应用自定义配置。

默认用户配置目录：

```text
%AppData%\Rime
```

通常对应类似路径：

```text
C:\Users\<你的用户名>\AppData\Roaming\Rime
```

## 应用本仓库配置

把仓库中的这两个文件复制到小狼毫用户目录：

- `config/rime/default.custom.yaml` -> `%AppData%\Rime\default.custom.yaml`
- `config/rime/weasel.custom.yaml` -> `%AppData%\Rime\weasel.custom.yaml`

复制完成后：

1. 在 Windows 右下角托盘找到小狼毫图标
2. 右键
3. 点击 `重新部署`

## 当前配置文件内容

### `default.custom.yaml`

```yaml
customization:
  distribution_code_name: Weasel
  distribution_version: 0.17.4
  generator: "Rime::SwitcherSettings"
  modified_time: "Mon Apr 13 15:09:10 2026"
  rime_version: 1.13.1
patch:
  schema_list:
    - {schema: luna_pinyin_simp}
  menu/page_size: 7
  ascii_composer/good_old_caps_lock: false
  ascii_composer/switch_key:
    Caps_Lock: commit_code
    Shift_L: noop
    Shift_R: noop
```

### `weasel.custom.yaml`

```yaml
customization:
  distribution_code_name: Weasel
  distribution_version: 0.17.4
  generator: "Weasel::UIStyleSettings"
  modified_time: "Mon Apr 13 12:31:21 2026"
  rime_version: 1.13.1
patch:
  "style/color_scheme": aqua
  "style/horizontal": true
  "style/font_point": 13
  "style/label_font_point": 13
  "style/comment_font_point": 13
  "style/layout/candidate_spacing": 14
  global_ascii: false
```

## 应用后建议测试

重新部署后，测试下面这些行为：

1. 单按 `Caps Lock`，能否切换中英文
2. 按住 `Shift` 输入字母，是否正常输入大写
3. 候选栏是否横向显示
4. 每页是否显示 `7` 个候选
5. `Ctrl+C`、`Ctrl+V`、`Ctrl+Shift+T` 等快捷键是否正常

## 在另一台电脑上让 Codex 直接配置

如果另一台电脑也能访问这个仓库，可以直接让 Codex 执行下面这件事：

1. 安装小狼毫
2. 把仓库中的配置复制到 `%AppData%\Rime`
3. 提醒你在托盘菜单里点击 `重新部署`

给 Codex 的指令可以直接用这段：

```text
请按仓库里的 config/rime/README.md 帮我配置 Windows 上的小狼毫。
把 config/rime/default.custom.yaml 和 config/rime/weasel.custom.yaml 复制到 %AppData%\\Rime。
如果目标目录不存在就创建。
完成后告诉我去右下角托盘里对小狼毫点一次“重新部署”。
不要改这两个配置文件的内容。
```

如果你希望 Codex 在另一台电脑上顺手做备份，也可以用这段：

```text
请读取仓库里的 config/rime/README.md，并把 config/rime 下的小狼毫配置应用到当前 Windows 用户的 %AppData%\\Rime。
如果旧文件已存在，先保留同名 .bak 备份，再覆盖。
完成后告诉我如何重新部署并验证 Caps Lock、Shift、横向候选栏和 7 个候选是否生效。
```

## 后续可调项

如果后面还想继续微调，可以重点改下面几项：

- `menu/page_size`：每页候选数
- `style/font_point`：候选文字大小
- `style/label_font_point`：编号大小
- `style/comment_font_point`：注释大小
- `style/layout/candidate_spacing`：横向候选项间距
- `style/horizontal`：横向或纵向候选栏

## 备注

这套方案是“小狼毫内部按键行为 + UI 样式配置”，不是系统级键盘重映射。

因此：
- 一般不会改坏 Windows 全局快捷键
- 主要影响小狼毫接管输入时对 `Caps Lock` / `Shift` 的处理
- 真正的传统大写锁定行为，不再作为这套方案的主要使用方式
