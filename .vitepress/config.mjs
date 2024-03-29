import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  lang: "zh-Hans",
  title: "魔王卷子",
  description: "魔王卷子，包含技术博客和相关笔记等",
  lastUpdated: true,
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    footer: {
      message: '<a href="https://beian.miit.gov.cn/">鲁ICP备13027795号-1</a>',
      copyright: 'Copyright © 2015-2023 魔王卷子'
    },

    lastUpdated: {
      text: '最后更新',
      formatOptions: {
        dateStyle: 'medium',
      }
    },

    outline: {
      label: "目录",
      level: [2, 3],
    },

    editLink: {
      pattern: 'https://github.com/mowangjuanzi/blog-2023/edit/main/docs/:path',
      text: '在 GitHub 上编辑页面'
    },

    search: {
      provider: 'local'
    },

    sidebar: {
      "/blog/": [
        {
          text: "博客",
          link: "/",
          base: "/blog/",
          items: [{
              text: "2023",
              items: [{
                text: "PHP 之 Xdebug", link: "/php-xdebug-tutorial",
              },{
                text: "APP webview 加载优化", link: "/app-webview-optimization",
              }]
            }, {
              text: "2022",
              items: [{
                text: "PHP 密码函数", link: "/php-password"
              }, {
                text: "Linux 下安装 Node.js", link: "/linux-install-nodejs"
              }]
            }, {
              text: "2019",
              items: [{
                text: "PHP 之内置 Web 服务器", link: "/php-built-in-web-server"
              }]
            }]
        }
      ]
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/mowangjuanzi/blog-2023' }
    ]
  }
})
