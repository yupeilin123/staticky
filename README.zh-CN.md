# staticky

staticky 是一个更好的、更简单的静态文件服务器。你能使用它然后可以在电脑或手机上查看静态文件。并且当文件变动时能自动刷新浏览器显示最新的文件内容。

## 怎么使用

首先执行 `npm install staticky -g` 命令，

然后打开你的项目目录，使用命令 `staticky`， 

它能自然帮你打开浏览器显示`index.html`，

如果 `index.html` 文件不存在，则它将你的项目目录下的所有文件展示出来。

<!-- more -->

## 用法

在项目的目录中使用 `staticky` 命令。或者，您可以添加作为命令行参数的路径。

命令行参数：

* `-p` or `--port` 端口使用，默认8091
* `-n` or `--no-browser` 是否自动打开浏览器
* `-t` or `--target` 选择打开哪个文件，默认 `index.html`
* `-d` or `--dir` 选择工作目录，默认 `process.cwd`
* `-g` or `--gzip` 是否开启gize压缩
* `-r` or `--reload` 观察文件或目录的变化，自动刷新。默认选择 `target file`，只有两个选项 `target` 或者 `dir`
* `-h` or `--help` 打印用法

**注意**：文件监听只支持html或markdown的格式

## 示例

```
staticky -p 8000 // start static file server in port 8000
staticky -n // don't open browser automatically
staticky -t index.js // the index.js file will be opened
staticky -d src //  the src directory under the current directory will be working directory
staticky -g // open gizp encoding
staticky -r dir // all files in the current directory will be monitored.
```

## 参与贡献

非常欢迎你的贡献，你可以通过以下方式和我们一起共建：

- 通过 Issue bug 或进行咨询。
- 提交 Pull Request 改进代码。
