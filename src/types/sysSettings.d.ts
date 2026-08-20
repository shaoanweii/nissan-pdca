declare namespace SysSettings {
  interface Entity {
    id: string // 系统配置id
    clientId: string // 客户id
    systemWatermarking: boolean // 是否显示系统水印 布尔类型
    documentWatermarking: boolean // 是否显示文档水印 布尔类型
    defaultPeriod: 'd' | 'm' | 'w' | 'q' | 'y' // 默认时间周期 日:d 月:m 周：w 季:q 年:y
  }
}
