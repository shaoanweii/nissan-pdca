# 课题事件闭环二级菜单与完整页面 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将课题事件闭环升级为包含课题管理、闭环统计、规则配置三个完整 PC 二级页面的可交互模块。

**Architecture:** 保留 `/risk/warning` 及现有课题管理代码，在 `/risk` 父路由下新增统计和规则子路由。统计页使用独立 Mock 记录计算指标并通过系统 `FEcharts` 渲染四个 Canvas；规则页使用本地响应式规则仓库驱动指标、筛选、列表和编辑抽屉。

**Tech Stack:** Vue 3、TypeScript、Vue Router、Arco Design Vue、SCSS、ECharts 5、系统 `FEcharts` 组件。

**Spec:** `docs/superpowers/specs/2026-08-18-topic-event-closure-subpages-design.md`

## Global Constraints

- 仅实现 PC 端，不读取或实现移动端页面。
- 保留 `/risk/warning` 路由身份及现有课题管理业务。
- 不新增生产依赖，不修改锁文件，不接入真实后端。
- 图表必须复用系统 `src/components/FEcharts/index.vue`，不得使用图片或 CSS 模拟。
- 一级菜单名称固定为“课题事件闭环”；二级菜单固定为“课题管理、闭环统计、规则配置”。
- 高等级红色、中等级橙色、低等级绿色。
- 当前目录不是 Git 仓库，本计划不执行提交、暂存、分支或发布操作。

---

## File Map

**Modify**

- `src/router/index.ts`：定义 `/risk` 下三个子路由和菜单元数据。

**Create**

- `src/views/risk/statistics/index.vue`：统计页布局、筛选、指标、图表和绩效表。
- `src/views/risk/statistics/statisticsData.ts`：统计 Mock 数据、筛选类型与纯计算函数。
- `src/views/risk/rules/index.vue`：规则指标、筛选、列表、启停与抽屉编排。
- `src/views/risk/rules/ruleData.ts`：规则类型、Mock 数据、筛选和指标计算。
- `src/views/risk/rules/RuleEditorDrawer.vue`：新建和编辑规则的五段式 PC 抽屉。

---

### Task 1: 一级菜单、三个二级路由与页面入口

**Files:**

- Modify: `src/router/index.ts:205-226`
- Create: `src/views/risk/statistics/index.vue`
- Create: `src/views/risk/rules/index.vue`

**Interfaces:**

- Produces routes `/risk/warning`, `/risk/statistics`, `/risk/rules`。
- Produces parent menu title `课题事件闭环` and child titles `课题管理`, `闭环统计`, `规则配置`。

- [ ] **Step 1: Record the failing Browser assertion**

在当前页面读取左侧菜单，断言一级菜单是可展开项且三个二级菜单均存在。当前预期失败：页面只有一个“课题事件闭环”菜单项。

```js
const menuText = await tab.playwright.locator('.menu-wrapper').innerText()
if (!menuText.includes('课题管理') || !menuText.includes('闭环统计') || !menuText.includes('规则配置')) {
  throw new Error('risk submenu routes are missing')
}
```

- [ ] **Step 2: Replace the existing risk route block**

将 `src/router/index.ts` 的风险路由改为：

```ts
{
  path: '/risk',
  component: Main,
  redirect: '/risk/warning',
  name: 'risk',
  meta: {
    title: '课题事件闭环',
    icon: 'ri-loop-left-line'
  },
  children: [
    {
      path: '/risk/warning',
      name: 'riskWarning',
      meta: { title: '课题管理', icon: '' },
      component: () => import('@/views/risk/index.vue')
    },
    {
      path: '/risk/statistics',
      name: 'riskStatistics',
      meta: { title: '闭环统计', icon: '' },
      component: () => import('@/views/risk/statistics/index.vue')
    },
    {
      path: '/risk/rules',
      name: 'riskRules',
      meta: { title: '规则配置', icon: '' },
      component: () => import('@/views/risk/rules/index.vue')
    }
  ]
}
```

- [ ] **Step 3: Create non-blank page entry components**

统计和规则入口先使用真实标题容器，后续任务在同一文件替换主体：

```vue
<template>
  <main class="risk-subpage">
    <header><h1>闭环统计</h1><p>追踪课题闭环效率、响应时长与部门绩效。</p></header>
  </main>
</template>
```

规则页面标题改为“规则配置”，说明改为“配置可计算、可路由、可审计的课题触发与闭环责任规则。”

- [ ] **Step 4: Run static checks**

Run:

```bash
npx prettier --write src/router/index.ts src/views/risk/statistics/index.vue src/views/risk/rules/index.vue
npm run type-check
npx eslint src/router/index.ts src/views/risk/statistics/index.vue src/views/risk/rules/index.vue
```

Expected: exit code 0；本次文件无 ESLint error。

- [ ] **Step 5: Verify menu and route navigation in Browser**

依次点击课题管理、闭环统计、规则配置，验证 URL、标题、选中态和非空内容；刷新 `/risk/statistics` 与 `/risk/rules` 后仍能渲染。

---

### Task 2: 闭环统计数据计算与完整统计页面

**Files:**

- Create: `src/views/risk/statistics/statisticsData.ts`
- Modify: `src/views/risk/statistics/index.vue`

**Interfaces:**

- Produces `ClosureStatisticRecord`, `StatisticsFilters`, `StatisticsSummary`, `DepartmentPerformance`。
- Produces `filterStatistics(records, filters)`, `summarizeStatistics(records)`, `groupByDate(records)`, `departmentPerformance(records)`。
- Consumes `FEcharts` with `EChartsOption` options。

- [ ] **Step 1: Record the failing statistics Browser assertion**

访问 `/risk/statistics`，断言五个指标、四个 `.chartDom canvas` 和部门绩效表存在。入口页此时应失败。

```js
const summaryCount = await tab.playwright.locator('.statistics-summary article').count()
const canvasCount = await tab.playwright.locator('.statistics-grid canvas').count()
const departmentRows = await tab.playwright.locator('.department-table tbody tr').count()
if (summaryCount !== 5 || canvasCount !== 4 || departmentRows < 4) {
  throw new Error('statistics page is incomplete')
}
```

- [ ] **Step 2: Implement typed Mock data and pure calculations**

在 `statisticsData.ts` 定义：

```ts
export type EventLevel = '高' | '中' | '低'

export interface ClosureStatisticRecord {
  date: string
  brand: string
  series: string
  category: string
  level: EventLevel
  department: string
  stage: '声音洞察' | '事件预警' | '预警审核' | '业务响应' | '闭环处理' | '事件关闭'
  createdCount: number
  closedCount: number
  responseHours: number
  overdueCount: number
  firstPassCount: number
}

export interface StatisticsFilters {
  startDate: string
  endDate: string
  brand: string
  series: string
  category: string
  level: '' | EventLevel
  department: string
}

export interface StatisticsSummary {
  total: number
  closureRate: number | null
  averageResponseHours: number | null
  overdue: number
  firstPassRate: number | null
}
```

计算规则使用字面公式：`closureRate = closedCount / createdCount * 100`，`averageResponseHours` 按记录数求平均，`firstPassRate = firstPassCount / closedCount * 100`；分母为 0 返回 `null`。

Mock 数据覆盖 12 个月、5 个部门、3 个等级、6 个阶段，使用确定性数组，不使用随机数。

- [ ] **Step 3: Build the statistics page**

在页面中实现：

```ts
const records = ref<ClosureStatisticRecord[]>(statisticsRecords)
const draftFilters = reactive<StatisticsFilters>(emptyStatisticsFilters())
const appliedFilters = reactive<StatisticsFilters>(emptyStatisticsFilters())
const filteredRecords = computed(() => filterStatistics(records.value, appliedFilters))
const summary = computed(() => summarizeStatistics(filteredRecords.value))
```

页面结构固定为标题、筛选区、五指标、四图表、部门表。四个图表选项分别为折线、阶段柱状、部门横向柱状、等级环形图。空数据时指标展示 `--`，图表使用空系列，表格显示“暂无符合条件的数据”。

- [ ] **Step 4: Verify filtering behavior**

在 Browser 选择“事件等级=高”，点击查询，验证等级环形图数据只包含高等级且指标变化；点击重置后恢复全量。读取 `.chartDom[_echarts_instance_]` 确认四个真实 ECharts 实例。

- [ ] **Step 5: Run statistics checks**

Run:

```bash
npx prettier --write src/views/risk/statistics/index.vue src/views/risk/statistics/statisticsData.ts
npm run type-check
npx eslint src/views/risk/statistics/index.vue src/views/risk/statistics/statisticsData.ts
```

Expected: exit code 0。

---

### Task 3: 规则数据、概览、筛选、列表与启停

**Files:**

- Create: `src/views/risk/rules/ruleData.ts`
- Modify: `src/views/risk/rules/index.vue`

**Interfaces:**

- Produces `ClosureRule`, `RuleFilters`, `RuleSummary`。
- Produces `filterRules(rules, filters)` and `summarizeRules(rules)`。
- Provides `rules`, `selectedRule`, `editorMode`, `editorOpen` to Task 4。

- [ ] **Step 1: Record the failing rules list assertion**

访问 `/risk/rules`，断言四个指标、筛选区、规则表和新建规则按钮存在。入口页此时应失败。

- [ ] **Step 2: Implement typed rules and deterministic Mock records**

在 `ruleData.ts` 定义完整接口：

```ts
export interface ClosureRule {
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

提供 12 条规则，覆盖启用和停用、三种等级、四种周期与多个部门。规则编号使用 `RL20251007001` 至 `RL20251007012`。

- [ ] **Step 3: Build rule metrics, filters and table**

规则指标为总数、启用数、停用数、本月命中课题数。筛选字段为规则名称、状态、规则类型、事件等级。表格操作列固定右侧，支持查看、编辑、启用或停用。

启停实现：

```ts
const toggleRuleStatus = (id: string) => {
  const rule = rules.value.find(item => item.id === id)
  if (!rule) return
  rule.status = rule.status === '启用' ? '停用' : '启用'
  rule.updatedAt = '刚刚'
}
```

- [ ] **Step 4: Verify filter and status interactions**

选择“状态=启用”后查询，验证每一行状态均为启用；切换第一条规则状态，验证行状态和顶部启用或停用数量同步变化；重置恢复全量筛选。

- [ ] **Step 5: Run rules list checks**

Run:

```bash
npx prettier --write src/views/risk/rules/index.vue src/views/risk/rules/ruleData.ts
npm run type-check
npx eslint src/views/risk/rules/index.vue src/views/risk/rules/ruleData.ts
```

Expected: exit code 0。

---

### Task 4: 新建与编辑规则抽屉

**Files:**

- Create: `src/views/risk/rules/RuleEditorDrawer.vue`
- Modify: `src/views/risk/rules/index.vue`

**Interfaces:**

- Props: `open: boolean`, `mode: 'create' | 'edit' | 'view'`, `rule: ClosureRule | null`。
- Emits: `close`, `save(rule: ClosureRule)`。
- Consumes `ClosureRule` from `ruleData.ts`。

- [ ] **Step 1: Record the failing editor assertion**

点击“新建规则”，断言右侧抽屉出现五个规则步骤卡片和保存按钮。当前应失败，因为组件尚不存在。

- [ ] **Step 2: Implement form state and reset behavior**

组件内使用独立表单副本：

```ts
const createEmptyRule = (): ClosureRule => ({
  id: '',
  name: '',
  objectType: '车型课题',
  objectScope: [],
  dimensions: [],
  metric: '负面声量占比',
  operator: '>=',
  threshold: 45,
  combinator: 'AND',
  level: '中',
  frequency: '日',
  reviewMode: '人工审核',
  department: '',
  owner: '',
  noticeTargets: [],
  slaHours: 24,
  status: '启用',
  hitCount: 0,
  updatedAt: '刚刚'
})
```

监听 `open、mode、rule?.id`，每次打开时深拷贝编辑目标或创建空规则；关闭不回写原记录。

- [ ] **Step 3: Implement five collapsible sections and validation**

五段顺序固定为业务对象、维度组合、指标计算、触发判断、闭环责任。默认展开业务对象和触发判断，其余收起。使用 `v-show` 保留填写值。

校验函数：

```ts
const validate = () => {
  errors.name = form.name.trim() ? '' : '请输入规则名称'
  errors.level = form.level ? '' : '请选择事件等级'
  errors.threshold = Number.isFinite(form.threshold) ? '' : '请输入有效阈值'
  errors.department = form.department ? '' : '请选择主责部门'
  errors.owner = form.owner ? '' : '请选择负责人'
  return !Object.values(errors).some(Boolean)
}
```

只读模式禁用控件并隐藏保存按钮。保存时为新规则生成下一个 `RL` 编号，编辑模式保留原编号。

- [ ] **Step 4: Wire create and edit persistence**

父页面保存处理：

```ts
const saveRule = (next: ClosureRule) => {
  const index = rules.value.findIndex(item => item.id === next.id)
  if (index >= 0) rules.value.splice(index, 1, next)
  else rules.value.unshift(next)
  editorOpen.value = false
}
```

- [ ] **Step 5: Verify validation, create, edit and reset**

Browser 验证：空表单保存显示五个字段错误；填写必填项后保存，列表增加一行且顶部总数加 1；编辑新行名称后保存，仅目标行变化；关闭抽屉重新新建时不保留上一条输入。

- [ ] **Step 6: Run editor checks**

Run:

```bash
npx prettier --write src/views/risk/rules/index.vue src/views/risk/rules/RuleEditorDrawer.vue
npm run type-check
npx eslint src/views/risk/rules/index.vue src/views/risk/rules/RuleEditorDrawer.vue
```

Expected: exit code 0。

---

### Task 5: PC 集成验收与生产构建

**Files:**

- Verify: `src/router/index.ts`
- Verify: `src/views/risk/index.vue`
- Verify: `src/views/risk/statistics/index.vue`
- Verify: `src/views/risk/statistics/statisticsData.ts`
- Verify: `src/views/risk/rules/index.vue`
- Verify: `src/views/risk/rules/ruleData.ts`
- Verify: `src/views/risk/rules/RuleEditorDrawer.vue`

**Interfaces:**

- Consumes all deliverables from Tasks 1-4。
- Produces browser screenshots and final QA evidence outside the repository。

- [ ] **Step 1: Restart the real VOC service**

精确停止当前 VOC Vite 会话，不终止占用 `127.0.0.1:4173` 的 V8 进程。启动：

```bash
npm run dev -- --host 0.0.0.0 --port 4173
```

验证监听进程工作目录为 `东风日产VOC报表`，访问 `http://192.168.10.102:4173/report/` 返回 200。

- [ ] **Step 2: Verify three routes and menu state**

在 1505 × 1008 PC 视口依次访问三个路由，验证一级菜单展开、二级选中态、页面标题、无空白页和无框架错误覆盖层。

- [ ] **Step 3: Verify statistics interactions**

验证五指标、四个 ECharts 实例、筛选联动、重置、部门绩效表和 Tooltip。记录 Canvas 数量和非零尺寸。

- [ ] **Step 4: Verify rules interactions**

验证筛选、重置、启停、新建必填错误、新建成功、编辑成功、抽屉重置和表格右侧操作列。

- [ ] **Step 5: Check console and capture screenshots**

每个路由读取 `tab.dev.logs({ levels: ['error', 'warn'], limit: 50 })`。截图保存到 `/private/tmp/voc-risk-management.png`、`/private/tmp/voc-risk-statistics.png`、`/private/tmp/voc-risk-rules.png`、`/private/tmp/voc-risk-rule-editor.png`。

- [ ] **Step 6: Run final verification commands**

Run:

```bash
npx prettier --check src/router/index.ts src/views/risk/statistics/index.vue src/views/risk/statistics/statisticsData.ts src/views/risk/rules/index.vue src/views/risk/rules/ruleData.ts src/views/risk/rules/RuleEditorDrawer.vue
npm run type-check
npx eslint src/router/index.ts src/views/risk/statistics/index.vue src/views/risk/statistics/statisticsData.ts src/views/risk/rules/index.vue src/views/risk/rules/ruleData.ts src/views/risk/rules/RuleEditorDrawer.vue
npm run build-only
```

Expected: exit code 0。允许项目原有未使用变量和大 chunk warning，本次文件不得新增 error。
