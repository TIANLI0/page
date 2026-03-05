export type LinkIconKey = "github" | "blog" | "coolapk";

export const SITE_CONFIG = {
  profile: {
    name: "Tianli",
    title:
      "Product intern and Optoelectronic Information Science and Engineering student.",
    email: "wutianli@tianli0.top",
    avatarUrl: "https://q1.qlogo.cn/g?b=qq&nk=507249007&s=640",
  },
  links: [
    {
      title: "Github",
      subtitle: "@Tianli",
      href: "https://github.com/tianli0",
      icon: "github" as LinkIconKey,
    },
    {
      title: "Blog",
      subtitle: "blog.tianli0.top",
      href: "https://blog.tianli0.top/",
      icon: "blog" as LinkIconKey,
    },
    {
      title: "CoolAPK",
      subtitle: "@Tianli",
      href: "http://www.coolapk.com/u/1382033",
      icon: "coolapk" as LinkIconKey,
    },
  ],
  projects: [
    {
      title: "BS2PRO Controller",
      desc: "Desktop HID controller built with Wails and Next.js.",
      href: "https://github.com/TIANLI0/BS2PRO-Controller",
      img: "/img/bs2.png",
    },
    {
      title: "Hongmo AI",
      desc: "All-in-one agent platform for small and medium websites.",
      href: "https://ai.zhheo.com/",
      img: "/img/hmai.png",
    },
    {
      title: "Zhikuu",
      desc: "AI writing editor focused on Chinese content workflows.",
      href: "https://zhikuu.com/",
      img: "/img/zhikuu.png",
    },
    {
      title: "CDNAuthentication",
      desc: "Tencent Cloud CDN auth service for signing and access control.",
      href: "https://github.com/TIANLI0/TencentCDNAuthentication",
      img: "/img/auth.png",
    },
    {
      title: "NPUolo",
      desc: "Python library for Intel NPU-accelerated YOLO inference.",
      href: "https://github.com/TIANLI0/NPUolo",
      img: "/img/intel.png",
    },
    {
      title: "chromem-go",
      desc: "Embeddable Go vector database with a Chroma-like API.",
      href: "https://github.com/TIANLI0/chromem-go",
      img: "/img/vdb.png",
    },
  ],
  now: [
    { label: "Current Focus", value: "Building AI-enhanced tools" },
    { label: "Availability", value: "Open to collaboration" },
    { label: "Timezone", valuePrefix: "Asia/Shanghai" },
  ],
  beian: "蜀ICP备2021004404号-1",
} as const;
