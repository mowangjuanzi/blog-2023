---
date: 2022-07-03
---
# APP webview 加载优化

## 背景

加载以及渲染的逻辑是之前的传统方式：

1. APP 开启 webapp 容器
2. 加载 URL 以及相关静态资源
3. 执行 JS 流程以及懒加载等

因为 webview 在渲染的时候，每次都是重新加载，导致详情页面加载时间过长，导致用户体验很差。

## 分析原因

当时明确的原因就是因为页面静态资源的重复加载导致的该问题。所以入手的方案则是，将其作为版本进行下发。

首先是 APP 在启动时会进行版本检测，如果当前 APP 的模板版本跟服务端的版本号不同，则立即下载服务器的版本，并进行解压。

## 解决方案

其实解决方案类似微信小程序的解决方案。

1. 将静态资源进行打包，并标注上版本号，同时将其发布到 OSS。
2. 每次 APP 启动都会检测版本是否一致，如果不一致则会下载服务器端的指定版本进行下载。
3. 下载后，将文件解压到指定目录。在查看页面详情时进行渲染。

## 出现的其它问题

1. 在加载时获取页面的宽度错误

背景：我们需要获取页面的宽度，然后通过一定的计算，才能获得字体大小，但是获取的时候，总是偶发性的获取到错误的宽度值。

解决方案：使用两种方式同时获取，然后对比两个的值，获取正确的那一个。

```javascript
function initWidth() {
    var innerWidth = window.innerWidth;
    var scrollWidth = document.body.scrollWidth;

    return (innerWidth < scrollWidth ? window.innerWidth : document.body.scrollWidth);
}
```

2. JS 与 APP 的交互

背景：之前使用原生方案进行调用，但是总会因为特殊字符或者引号问题导致调用失败。

解决方案：使用 DSBridge 方案。

3. 懒加载问题

背景：我们懒加载使用的是 jquery_lazyload。但是总是偶尔会出现懒加载失败的情况。

解决方案：延迟执行懒加载逻辑即可。

```javascript
setTimeout(function () {
    $('.img_loadederror').lazyload({
        threshold: 200,
        data_attribute: 'src',
        load: function () {
            $(this).removeClass("img_loadederror")
        }
    });
}, 100);
```

## 总结

其实我做这一套解决方案的时候，总是会出现各种各样莫名其妙的问题。对于这种情况，还是得学会具体情况具体分析。另外还要学会使用远程调试。这样才能更好的排查其中的问题。