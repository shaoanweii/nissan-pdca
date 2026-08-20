# 课题事件闭环二级菜单与完整页面设计

日期：2026-08-18

## 1. 目标与范围

将现有单页“课题事件闭环”升级为一级菜单，并在其下提供三个可独立访问的 PC 端二级页面：课题管理、闭环统计、规则配置。

本轮范围包括菜单、路由、两个新页面、真实 ECharts 图表、规则新建与编辑交互、页面内 Mock 数据联动和浏览器验收。保留现有 `/risk/warning` 路由身份及课题管理页面，不实现移动端，不新增后端接口，不新增生产依赖。

## 2. 信息架构与路由

一级菜单：`课题事件闭环`

| 二级菜单 | 路由 | 页面组件 | 说明 |
| --- | --- | --- | --- |
| 课题管理 | `/risk/warning` | `src/views/risk/index.vue` | 保留现有课题列表与详情闭环 |
| 闭环统计 | `/risk/statistics` | `src/views/risk/statistics/index.vue` | 闭环效率、趋势与部门绩效 |
| 规则配置 | `/risk/rules` | `src/views/risk/rules/index.vue` | 规则列表、筛选、新建、编辑与启停 |

`/risk` 默认重定向到 `/risk/warning`。父路由移除 `alwaysShow`，由当前菜单组件按 `children` 渲染为可展开一级菜单。父菜单使用现有闭环图标，二级菜单不增加重复图标。

## 3. 闭环统计页面

### 3.1 页面结构

1. 页面标题与更新时间。
2. 筛选区：时间范围、品牌、车系、课题分类、事件等级、主责部门，提供查询与重置。
3. 五个核心指标：课题总量、闭环率、平均响应时长、超期课题、一次通过率。
4. 四个 ECharts 图表：
   - 闭环趋势折线图：新增课题、闭环课题、闭环率。
   - 阶段分布柱状图：声音洞察、事件预警、预警审核、业务响应、闭环处理、事件关闭。
   - 主责部门闭环率横向柱状图。
   - 事件等级分布环形图：高、中、低。
5. 部门绩效表：主责部门、课题数、闭环数、闭环率、平均响应时长、超期数。

### 3.2 数据与交互

统计页使用带字段形状的本地 Mock 数据。筛选提交后，同时更新指标、图表和部门绩效表；重置恢复全量数据。图表统一复用系统 `FEcharts` 组件，使用 Canvas 渲染，支持 Tooltip，窗口变化时保持尺寸正确。

核心数据类型：

```ts
interface ClosureStatisticRecord {
  date: string
  brand: string
  series: string
  category: string
  level: '高' | '中' | '低'
  department: string
  stage: string
  createdCount: number
  closedCount: number
  responseHours: number
  overdueCount: number
  firstPassCount: number
}
```

指标计算：

- 闭环率 = 闭环课题数 / 课题总量。
- 平均响应时长 = 有效记录响应时长总和 / 有效记录数。
- 一次通过率 = 一次通过数 / 已审核记录数。
- 分母为 0 时展示 `--`，不伪造百分比。

## 4. 规则配置页面

### 4.1 页面结构

1. 页面标题与新建规则按钮。
2. 四个规则指标：规则总数、启用数、停用数、本月命中课题数。
3. 筛选区：规则名称、状态、规则类型、事件等级，提供查询与重置。
4. 规则列表字段：规则编号、规则名称、业务对象、触发条件、事件等级、监测周期、主责部门、状态、更新时间、操作。
5. 操作：查看、编辑、启用或停用。

### 4.2 规则数据模型

```ts
interface ClosureRule {
  id: string
  name: string
  objectType: string
  objectScope: string[]
  dimensions: string[]
  metric: string
  operator: '>=' | '>' | '<=' | '<' | '='
  threshold: number
  combinator: 'AND' | 'OR'
  level: '高' | '中' | '低'
  frequency: '实时' | '日' | '周' | '月'
  reviewMode: '人工审核' | '自动审核'
  department: string
  owner: string
  noticeTargets: string[]
  slaHours: number
  status: '启用' | '停用'
  hitCount: number
  updatedAt: string
}
```

### 4.3 新建与编辑抽屉

使用 PC 右侧抽屉，宽度与现有事件详情体系一致。抽屉由五个可独立收起的步骤卡片构成：

1. 业务对象：品牌、车系、课题分类、监测范围。
2. 维度组合：数据来源、语义范围、用户范围、地域人群。
3. 指标计算：指标、聚合方式、比较基准、AND 或 OR。
4. 触发判断：运算符、阈值、监测周期、事件等级。
5. 闭环责任：审核方式、主责部门、负责人、通知对象、SLA。

规则名称、事件等级、触发阈值、主责部门、负责人为必填。提交前进行本地校验；校验失败在字段下方显示错误信息，不仅使用 Toast。保存后新建规则进入列表顶部，编辑规则原位更新。启停操作直接更新当前 Mock 状态并同步顶部指标。

## 5. 视觉与交互规范

- 仅实现 PC 端，沿用现有 Arco、日产红、查询蓝、语义绿与灰蓝背景。
- 页面标题、筛选区、卡片、表格密度与课题管理保持一致。
- 图表必须为系统 ECharts 组件，不使用图片或 CSS 模拟。
- 高等级红色、中等级橙色、低等级绿色。
- 表格操作列固定在右侧；长文本单行省略并提供 Tooltip。
- 抽屉内卡片使用 `aria-expanded`，折叠不销毁已填写数据。
- 所有交互按钮保持单行，正文和辅助字号遵循现有详情抽屉规范。

## 6. 文件与组件边界

预计新增：

- `src/views/risk/statistics/index.vue`
- `src/views/risk/statistics/statisticsData.ts`
- `src/views/risk/rules/index.vue`
- `src/views/risk/rules/ruleData.ts`
- `src/views/risk/rules/RuleEditorDrawer.vue`

预计修改：

- `src/router/index.ts`
- `src/layouts/Menu.vue`，仅在现有菜单无法正确展开或选中时做最小修复。

统计图表优先复用 `src/components/FEcharts/index.vue`；仅在配置重复明显时提取风险模块内部图表组件，不新增全局抽象。

## 7. 验收标准

### 7.1 菜单与路由

- 一级菜单显示“课题事件闭环”，默认展开。
- 三个二级菜单均可点击，选中态与当前路由一致。
- `/risk` 和父菜单入口进入 `/risk/warning`。
- 三个路由刷新后均可直接访问且不出现 404 或空白页。

### 7.2 闭环统计

- 五个指标、四个 ECharts Canvas 和部门绩效表完整渲染。
- 查询后指标、图表和表格同步变化；重置恢复全量数据。
- Tooltip 可用，图表尺寸在页面加载和窗口变化后正确。

### 7.3 规则配置

- 规则筛选、重置、查看、编辑、启停可操作。
- 新建规则必填校验有效，保存后列表与顶部指标同步更新。
- 编辑保存后目标行更新，其他规则不受影响。
- 抽屉关闭和重新打开时遵循明确的草稿重置规则，不串用上一条规则数据。

### 7.4 质量门禁

- PC 视口完成主页面和关键交互浏览器验收。
- 三个页面控制台无相关 error 或 warning。
- Prettier、相关 ESLint、TypeScript 检查通过。
- `npm run build-only` 退出码为 0。

## 8. 非目标与后续边界

- 不实现移动端页面或响应式移动布局。
- 不接入真实后端、不修改鉴权协议、不新增数据库。
- 不发布、不提交 Git、不修改锁文件。
- Mock 数据的业务值用于交互验收，不作为真实生产指标结论。
