---
date: 2023-09-15
---

# PHP 之 Xdebug

## 简介

Xdebug 是 PHP 的一个扩展，提供了许多功能来提升 PHP 的开发体验。

提供的功能有：

- 开发助手
- 函数追踪
- 代码覆盖率分析
- 垃圾回收分析
- 运行分析器
- 单步调试

当然不仅仅是我列出的这些。为此我会挑出几个比较我个人觉得比较重要的功能来进行记录。

## 安装

> 当前我使用的版本是 3.2.2。

安装的话，其实这里不想重复说明。可以参考 PHP 扩展安装一节。

## 配置

这里主要就介绍一个配置。就是 `xdebug.mode`。该参数接受以下值：

- `off`：表示禁用此扩展。Xdebug 的任何功能都不会启用。
- `develop`：启用开发助手，包含重写的 var_dump()。
- `coverage`：启用代码覆盖分析以生成代码覆盖率报告，主要跟 PHPUnit 一起使用。
- `debug`：启用单步调试。可用于运行时单步执行代码并分析变量值。
- `gcstats`：启用垃圾回收统计，以收集有关 PHP 垃圾回收机制的相关统计信息。
- `profile`：启用运行分析，可以使用 KCacheGrind 等分析性能瓶颈。 
- `trace`：启用函数追踪功能，允许记录每个函数调用，包括请求文件期间的参数，赋值变量和返回值。

这里不仅仅接受单个值，也可以接受多个值，使用 `,` 分割即可。比如说：`xdebug.mode=develop,trace`，就代表同时开启开发助手和函数追踪。

安装后 `xdebug.mode` 默认值为 `develop`。

## 开发助手

它提供了一些小功能，来提升我们的开发体验。

### 改进的 var_dump 函数

在不安装 xdebug 的时候，在浏览器中查看 var_dump 打印的值是这样的：

``` html
array(1) { ["a"]=> array(1) { ["b"]=> string(1) "c" } }
```

查看源码则展示的是：

``` html
array(1) {
  ["a"]=>
  array(1) {
    ["b"]=>
    string(1) "c"
  }
}

```

但是在启用了开发助手，打印的值在浏览器中的展示效果：

``` html
/Users/mowangjuanzi/code/php/laravel-skeleton/routes/web.php:21:
array (size=1)
  'a' => 
    array (size=1)
      'b' => string 'c' (length=1)
```

查看源码则展示的是：

``` html
<pre class='xdebug-var-dump' dir='ltr'>
<small>/Users/mowangjuanzi/code/php/laravel-skeleton/routes/web.php:21:</small>
<b>array</b> <i>(size=1)</i>
  'a' <font color='#888a85'>=&gt;</font> 
    <b>array</b> <i>(size=1)</i>
      'b' <font color='#888a85'>=&gt;</font> <small>string</small> <font color='#cc0000'>'c'</font> <i>(length=1)</i>
</pre>
```

可以看到 xdebug 自动添加了 `<pre>` 标签，还展示了调用 var_dump 函数的位置等。其实还有其它区别，在这里我就不详细解释了。哈哈，毕竟我也不是要完整的翻译文档。

关于开发助手的更多信息，可以查看官网：https://xdebug.org/docs/develop 。

## 单步调试

单步调试是一个非常有用的功能，它可以交互式的调试控制流并检查数据结构。

因为是交互式的，所以还需要如何与 Xdebug 通信的 IDE。比如 VSCode 或者 PhpStorm，这里我选择的是 PhpStorm。

这里需要明确的是，是 IDE 对服务器端的 Xdebug 进行发起请求。

### 服务器端配置

这里主要是配置有三个配置：

- `xdebug.client_host` 
    
    指的是接受的客户端 IP。如果是本地，需要设置为 `localhost`。

- `xdebug.client_port`
    
    指的是接受的客户端端口。默认是 9003。

- `start_with_request` 

    设置请求来的时候的激活方式。默认是 `default`，在单步调试中，表示是 `trigger`，意思是当请求开始时存在特定触发才会进行单步调试。下面的所有记录都是以设置为 `trigger` 进行记录的。

以上也是默认配置。

### 客户端配置

调试使用默认配置即可。这里我需要介绍下需要改动的地方。

- 设置 - PHP：

    ![An image](/phpstorm-cli.png)

    设置当前使用的 `CLI 解释器`。这里需要注意的是`调试器`。如果没有安装 `Xdebug`，会显示`未安装`，如果已经安装了会显示`对应的版本号`。

- 设置 - PHP - 调试

    点击`预配置`中的`验证`按钮。通过里面的某一种方式验证 Xdebug 是否安装成功。



### 运行调试

这里分为两种情况：CLI 模式和 FPM 模式。

- CLI 模式
    
    该模式比较简单。只要在运行 PHP 前执行如下命令即可进行单步调试：

    ``` bash
    export XDEBUG_SESSION=1
    ```

    如果是 Windows，则执行如下命令：

    ``` powershell
    set XDEBUG_SESSION=1
    ```

- FPM 模式
    
    对于单个请求，可以将 `XDEBUG_SESSION=session_name` 作为 GET/POST 参数传递。

    还有一种 cookie 的方式，用于调试多个请求。使用方式如下：

    - `XDEBUG_SESSION_START=session_name` 作为 GET/POST 参数传递用于启动调试。
    - Xdebug 就会设置 `XDEBUG_SESSION` cookie。只要存在此 cookie，就会启动调试。
    - `XDEBUG_SESSION_STOP` 作为 GET/POST 参数传递用于移除此 cookie。

    > `session_name` 在 `xdebug.trigger_value` 的值为空的情况下，随意一个值就可以。

## 总结

Xdebug 可以很好的增强我们的开发以及调试的体验，是一款必学的扩展。