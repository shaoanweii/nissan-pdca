declare namespace Report {
  interface Entity extends Common.ComQueryReq {
    id?: string
    reportName?: string
    startDate?: string
    endDate?: string
    channel?: string
    brand?: string
    carSeries?: string
    region?: string
    businessTag?: string
    qualityTag?: string
    sentiment?: string
    intention?: string
    // clientId: string
    status?: string
  }
  interface Vo {
    id: string
    reportName: string
    timeScope: string
    channel: string
    brand: string
    carSeries: string
    region: string
    tag: string
    sentiment: string
    intention: string
    createTime: string
    status: string
    reportUrl: string
  }
}
