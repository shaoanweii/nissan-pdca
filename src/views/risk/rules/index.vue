<template>
  <div class="acro-rule-page">
    <nav class="page-tabs" role="tablist" aria-label="规则配置分页">
      <button
        id="rule-management-tab"
        role="tab"
        :class="{ active: activeTab === 'rules' }"
        :aria-selected="activeTab === 'rules'"
        aria-controls="rule-management-panel"
        @click="activeTab = 'rules'"
      >
        规则管理
      </button>
      <button
        id="category-management-tab"
        role="tab"
        :class="{ active: activeTab === 'categories' }"
        :aria-selected="activeTab === 'categories'"
        aria-controls="category-management-panel"
        @click="activeTab = 'categories'"
      >
        分类管理
      </button>
    </nav>

    <div
      v-if="activeTab === 'rules'"
      id="rule-management-panel"
      class="management-panel"
      role="tabpanel"
      aria-labelledby="rule-management-tab"
    >
      <section class="rule-summary" aria-label="规则概览">
        <article>
          <span>规则总数</span><strong>{{ summary.total }}</strong
          ><small>全部规则</small>
        </article>
        <article class="enabled">
          <span>启用规则</span><strong>{{ summary.enabled }}</strong
          ><small>持续监测中</small>
        </article>
        <article class="disabled">
          <span>停用规则</span><strong>{{ summary.disabled }}</strong
          ><small>暂不触发</small>
        </article>
        <article class="hits">
          <span>本月命中课题</span><strong>{{ summary.hitCount }}</strong
          ><small>规则累计命中</small>
        </article>
      </section>

      <section class="rule-filter-panel">
        <div class="panel-heading">
          <h2>筛选条件</h2>
          <div>
            <button class="primary" @click="applyFilters">查询</button
            ><button @click="resetFilters">重置</button>
          </div>
        </div>
        <div class="rule-filter-grid">
          <label
            ><span>规则名称</span
            ><input v-model="draftFilters.keyword" placeholder="请输入规则名称或编号"
          /></label>
          <label
            ><span>规则状态</span
            ><select v-model="draftFilters.status">
              <option value="">不限</option>
              <option>启用</option>
              <option>停用</option>
            </select></label
          >
          <label
            ><span>规则类型</span
            ><select v-model="draftFilters.objectType">
              <option value="">不限</option>
              <option v-for="name in categoryNames" :key="name">{{ name }}</option>
            </select></label
          >
          <label
            ><span>事件等级</span
            ><select v-model="draftFilters.level">
              <option value="">不限</option>
              <option>高</option>
              <option>中</option>
              <option>低</option>
            </select></label
          >
        </div>
      </section>

      <section class="rule-list-panel">
        <div class="panel-heading">
          <h2>规则列表</h2>
          <div class="rule-list-actions">
            <button class="create-button" @click="openEditor('create')">
              <i class="ri-add-line"></i>新建规则
            </button>
          </div>
        </div>
        <div class="rule-table-scroll">
          <table class="rule-table">
            <thead>
              <tr>
                <th>规则名称</th>
                <th>规则类型</th>
                <th>事件等级</th>
                <th>车系</th>
                <th>监测周期</th>
                <th>数据范围</th>
                <th>触发条件</th>
                <th>主责单位</th>
                <th>状态</th>
                <th>更新时间</th>
                <th class="operation-column">操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="rule in pagedRules" :key="rule.id">
                <td class="rule-name-cell">
                  <strong :title="rule.name">{{ rule.name }}</strong>
                </td>
                <td>{{ rule.objectType }}</td>
                <td>
                  <span :class="['level-tag', `level-${rule.level}`]">{{ rule.level }}</span>
                </td>
                <td>
                  <span class="ellipsis business-object-cell" :title="carSeriesText(rule)">{{
                    carSeriesText(rule)
                  }}</span>
                </td>
                <td>{{ rule.frequency }}</td>
                <td>
                  <span class="ellipsis data-scope-cell" :title="dataScopeText(rule)">{{
                    dataScopeText(rule)
                  }}</span>
                </td>
                <td>
                  <span class="ellipsis" :title="conditionText(rule)">{{
                    conditionText(rule)
                  }}</span>
                </td>
                <td>{{ rule.department }}</td>
                <td>
                  <span :class="['status-tag', rule.status === '启用' ? 'on' : 'off']"
                    ><i></i>{{ rule.status }}</span
                  >
                </td>
                <td>{{ rule.updatedAt }}</td>
                <td class="operation-column">
                  <button @click="openEditor('view', rule)">查看</button
                  ><button @click="openEditor('edit', rule)">编辑</button
                  ><button @click="toggleRuleStatus(rule.id)">
                    {{ rule.status === '启用' ? '停用' : '启用' }}
                  </button>
                </td>
              </tr>
              <tr v-if="!filteredRules.length">
                <td colspan="11" class="empty-cell">暂无符合条件的规则</td>
              </tr>
            </tbody>
          </table>
        </div>
        <footer class="rule-pagination">
          <span>共 {{ filteredRules.length }} 条</span>
          <button :disabled="currentPage === 1" aria-label="上一页" @click="currentPage--">
            <i class="ri-arrow-left-s-line"></i>
          </button>
          <button
            v-for="page in pageCount"
            :key="page"
            :class="{ active: currentPage === page }"
            @click="currentPage = page"
          >
            {{ page }}
          </button>
          <button :disabled="currentPage === pageCount" aria-label="下一页" @click="currentPage++">
            <i class="ri-arrow-right-s-line"></i>
          </button>
          <select v-model.number="pageSize" aria-label="每页条数" @change="currentPage = 1">
            <option :value="10">10条/页</option>
            <option :value="20">20条/页</option>
          </select>
        </footer>
      </section>
    </div>

    <div
      v-else
      id="category-management-panel"
      class="management-panel category-management-panel"
      role="tabpanel"
      aria-labelledby="category-management-tab"
    >
      <section class="rule-filter-panel category-filter-panel">
        <div class="category-filter-grid">
          <label>
            <span>分类名称</span>
            <input
              v-model="draftCategoryFilters.keyword"
              placeholder="请输入分类名称"
              @keyup.enter="applyCategoryFilters"
            />
          </label>
          <label>
            <span>分类状态</span>
            <select v-model="draftCategoryFilters.status">
              <option value="">不限</option>
              <option>启用</option>
              <option>停用</option>
            </select>
          </label>
          <div class="category-filter-actions">
            <button class="primary" @click="applyCategoryFilters">查询</button>
            <button @click="resetCategoryFilters">重置</button>
          </div>
        </div>
      </section>

      <section class="rule-list-panel category-list-panel">
        <div class="panel-heading">
          <h2>分类列表</h2>
          <div class="rule-list-actions">
            <button class="create-button" @click="openCategoryEditor('create')">
              <i class="ri-add-line"></i>新建分类
            </button>
          </div>
        </div>
        <div class="rule-table-scroll">
          <table class="rule-table category-table">
            <thead>
              <tr>
                <th>分类名称</th>
                <th>分类说明</th>
                <th>关联规则数</th>
                <th>状态</th>
                <th>更新时间</th>
                <th class="operation-column">操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="category in pagedCategories" :key="category.id">
                <td>
                  <strong>{{ category.name }}</strong>
                </td>
                <td>
                  <span class="ellipsis category-description" :title="category.description">{{
                    category.description
                  }}</span>
                </td>
                <td>{{ linkedRuleCount(category.name) }}</td>
                <td>
                  <span :class="['status-tag', category.status === '启用' ? 'on' : 'off']"
                    ><i></i>{{ category.status }}</span
                  >
                </td>
                <td>{{ category.updatedAt }}</td>
                <td class="operation-column">
                  <button @click="openCategoryEditor('edit', category)">编辑</button>
                  <button @click="toggleCategoryStatus(category.id)">
                    {{ category.status === '启用' ? '停用' : '启用' }}
                  </button>
                </td>
              </tr>
              <tr v-if="!filteredCategories.length">
                <td colspan="6" class="empty-cell">暂无符合条件的分类</td>
              </tr>
            </tbody>
          </table>
        </div>
        <footer class="category-list-footer">
          <span class="category-list-note">
            <i class="ri-information-line"></i>
            已关联规则的分类不可删除，仅可停用
          </span>
          <div class="rule-pagination category-pagination">
            <span>共 {{ filteredCategories.length }} 条</span>
            <button
              :disabled="categoryCurrentPage === 1"
              aria-label="分类上一页"
              @click="categoryCurrentPage--"
            >
              <i class="ri-arrow-left-s-line"></i>
            </button>
            <button
              v-for="page in categoryPageCount"
              :key="page"
              :class="{ active: categoryCurrentPage === page }"
              @click="categoryCurrentPage = page"
            >
              {{ page }}
            </button>
            <button
              :disabled="categoryCurrentPage === categoryPageCount"
              aria-label="分类下一页"
              @click="categoryCurrentPage++"
            >
              <i class="ri-arrow-right-s-line"></i>
            </button>
            <select
              v-model.number="categoryPageSize"
              aria-label="分类每页条数"
              @change="categoryCurrentPage = 1"
            >
              <option :value="10">10条/页</option>
              <option :value="20">20条/页</option>
            </select>
          </div>
        </footer>
      </section>
    </div>

    <RuleEditorDrawer
      :open="editorOpen"
      :mode="editorMode"
      :rule="selectedRule"
      :category-options="enabledCategoryNames"
      @close="editorOpen = false"
      @save="saveRule"
    />
    <CategoryEditorDrawer
      :open="categoryEditorOpen"
      :mode="categoryEditorMode"
      :category="selectedCategory"
      :categories="categories"
      @close="categoryEditorOpen = false"
      @save="saveCategory"
    />
  </div>
</template>

<script setup lang="ts">
import CategoryEditorDrawer from './CategoryEditorDrawer.vue'
import RuleEditorDrawer from './RuleEditorDrawer.vue'
import {
  cloneCategories,
  emptyCategoryFilters,
  filterCategories,
  type CategoryFilters,
  type CategoryMode,
  type RuleCategory
} from './categoryData'
import {
  cloneRules,
  emptyRuleFilters,
  filterRules,
  summarizeRules,
  type ClosureRule,
  type RuleFilters,
  type RuleMode
} from './ruleData'

const activeTab = ref<'rules' | 'categories'>('rules')
const rules = ref<ClosureRule[]>(cloneRules())
const categories = ref<RuleCategory[]>(cloneCategories())
const categoryNames = computed(() =>
  [...categories.value]
    .sort((left, right) => left.order - right.order)
    .map(category => category.name)
)
const enabledCategoryNames = computed(() =>
  [...categories.value]
    .filter(category => category.status === '启用')
    .sort((left, right) => left.order - right.order)
    .map(category => category.name)
)
const draftFilters = reactive<RuleFilters>(emptyRuleFilters())
const appliedFilters = reactive<RuleFilters>(emptyRuleFilters())
const filteredRules = computed(() => filterRules(rules.value, appliedFilters))
const currentPage = ref(1)
const pageSize = ref(10)
const pageCount = computed(() =>
  Math.max(1, Math.ceil(filteredRules.value.length / pageSize.value))
)
const pagedRules = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  return filteredRules.value.slice(start, start + pageSize.value)
})
const summary = computed(() => summarizeRules(rules.value))
const editorOpen = ref(false)
const editorMode = ref<RuleMode>('create')
const selectedRule = ref<ClosureRule | null>(null)
const draftCategoryFilters = reactive<CategoryFilters>(emptyCategoryFilters())
const appliedCategoryFilters = reactive<CategoryFilters>(emptyCategoryFilters())
const filteredCategories = computed(() =>
  filterCategories(categories.value, appliedCategoryFilters)
)
const categoryCurrentPage = ref(1)
const categoryPageSize = ref(10)
const categoryPageCount = computed(() =>
  Math.max(1, Math.ceil(filteredCategories.value.length / categoryPageSize.value))
)
const pagedCategories = computed(() => {
  const start = (categoryCurrentPage.value - 1) * categoryPageSize.value
  return filteredCategories.value.slice(start, start + categoryPageSize.value)
})
const categoryEditorOpen = ref(false)
const categoryEditorMode = ref<CategoryMode>('create')
const selectedCategory = ref<RuleCategory | null>(null)

const conditionText = (rule: ClosureRule) =>
  rule.metricConditions
    .map(condition => `${condition.metric} ${condition.operator} ${condition.threshold}`)
    .join(` ${rule.combinator} `)
const carSeriesText = (rule: ClosureRule) =>
  rule.dimensionConditions.find(condition => condition.dimension === '车系')?.values.join('、') ||
  '全部'
const dataScopeText = (rule: ClosureRule) => {
  const values = rule.dimensionConditions
    .filter(condition => condition.dimension !== '车系')
    .flatMap(condition => condition.values)
  return values.join('、') || '全部'
}
const applyFilters = () => {
  Object.assign(appliedFilters, draftFilters)
  currentPage.value = 1
}
const resetFilters = () => {
  Object.assign(draftFilters, emptyRuleFilters())
  Object.assign(appliedFilters, emptyRuleFilters())
  currentPage.value = 1
}
const toggleRuleStatus = (id: string) => {
  const rule = rules.value.find(item => item.id === id)
  if (!rule) return
  rule.status = rule.status === '启用' ? '停用' : '启用'
  rule.updatedAt = '刚刚'
}
const openEditor = (mode: RuleMode, rule: ClosureRule | null = null) => {
  editorMode.value = mode
  selectedRule.value = rule
  editorOpen.value = true
}
const applyCategoryFilters = () => {
  Object.assign(appliedCategoryFilters, draftCategoryFilters)
  categoryCurrentPage.value = 1
}
const resetCategoryFilters = () => {
  Object.assign(draftCategoryFilters, emptyCategoryFilters())
  Object.assign(appliedCategoryFilters, emptyCategoryFilters())
  categoryCurrentPage.value = 1
}
const linkedRuleCount = (categoryName: string) =>
  rules.value.filter(rule => rule.objectType === categoryName).length
const openCategoryEditor = (mode: CategoryMode, category: RuleCategory | null = null) => {
  categoryEditorMode.value = mode
  selectedCategory.value = category
  categoryEditorOpen.value = true
}
const toggleCategoryStatus = (id: string) => {
  const category = categories.value.find(item => item.id === id)
  if (!category) return
  category.status = category.status === '启用' ? '停用' : '启用'
  category.updatedAt = '刚刚'
}
const saveCategory = (next: RuleCategory) => {
  const index = categories.value.findIndex(category => category.id === next.id)
  if (index >= 0) {
    const previousName = categories.value[index].name
    categories.value.splice(index, 1, { ...next })
    if (previousName !== next.name) {
      rules.value.forEach(rule => {
        if (rule.objectType === previousName) rule.objectType = next.name
      })
      if (draftFilters.objectType === previousName) draftFilters.objectType = next.name
      if (appliedFilters.objectType === previousName) appliedFilters.objectType = next.name
    }
  } else {
    categories.value.push({ ...next })
  }
  categoryCurrentPage.value = 1
  categoryEditorOpen.value = false
}
const nextRuleId = () => {
  const next =
    Math.max(...rules.value.map(rule => Number(rule.id.slice(-3))).filter(Number.isFinite), 0) + 1
  return `RL20251007${String(next).padStart(3, '0')}`
}
const saveRule = (next: ClosureRule) => {
  const normalized: ClosureRule = {
    ...next,
    id: next.id || nextRuleId(),
    objectScope: [...next.objectScope],
    dimensions: [...next.dimensions],
    noticeTargets: [...next.noticeTargets],
    stageNotifications: next.stageNotifications.map(item => ({
      ...item,
      targets: [...item.targets]
    })),
    dueReminders: next.dueReminders.map(reminder => ({
      ...reminder,
      channels: [...reminder.channels]
    })),
    overdueEscalation: {
      ...next.overdueEscalation,
      supervisors: [...next.overdueEscalation.supervisors],
      channels: [...next.overdueEscalation.channels]
    }
  }
  const index = rules.value.findIndex(item => item.id === normalized.id)
  if (index >= 0) rules.value.splice(index, 1, normalized)
  else rules.value.unshift(normalized)
  currentPage.value = 1
  editorOpen.value = false
}
watch([() => filteredRules.value.length, pageSize], () => {
  if (currentPage.value > pageCount.value) currentPage.value = pageCount.value
})
watch([() => filteredCategories.value.length, categoryPageSize], () => {
  if (categoryCurrentPage.value > categoryPageCount.value) {
    categoryCurrentPage.value = categoryPageCount.value
  }
})
</script>

<style lang="scss" scoped>
.acro-rule-page {
  height: 100%;
  min-height: 0;
  padding: 22px 24px 30px;
  background: #f4f7fb;
  color: #1d2635;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  .panel-heading {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .page-tabs {
    flex: 0 0 auto;
    min-height: 48px;
    margin: -6px 0 14px;
    display: flex;
    align-items: stretch;
    gap: 8px;
    border-bottom: 1px solid #dfe5ee;
  }
  .page-tabs button {
    position: relative;
    min-width: 104px;
    padding: 0 14px;
    border: 0;
    background: transparent;
    color: #657287;
    font-size: 16px;
    font-weight: 500;
  }
  .page-tabs button::after {
    content: '';
    position: absolute;
    right: 12px;
    bottom: -1px;
    left: 12px;
    height: 3px;
    background: transparent;
  }
  .page-tabs button:hover,
  .page-tabs button:focus-visible {
    color: #1d2635;
  }
  .page-tabs button:focus-visible {
    outline: 2px solid #8ab7f5;
    outline-offset: -2px;
  }
  .page-tabs button.active {
    color: #1d2635;
    font-size: 24px;
    font-weight: 600;
  }
  .page-tabs button.active::after {
    background: #e4002b;
  }
  .management-panel {
    flex: 1;
    min-height: 0;
    display: flex;
    flex-direction: column;
  }
  .create-button {
    height: 34px;
    padding: 0 15px;
    display: inline-flex;
    align-items: center;
    gap: 5px;
    border: 1px solid #1769e0;
    border-radius: 4px;
    background: #1769e0;
    color: #fff;
    font-size: 13px;
  }
  .rule-summary {
    flex: 0 0 auto;
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 12px;
    margin-bottom: 12px;
  }
  .rule-summary article {
    min-height: 88px;
    padding: 12px 15px;
    border: 1px solid #e0e6ef;
    border-radius: 6px;
    background: #fff;
  }
  .rule-summary span,
  .rule-summary small {
    display: block;
    color: #7b8798;
    font-size: 11px;
  }
  .rule-summary strong {
    display: block;
    margin: 7px 0 4px;
    font-size: 24px;
    line-height: 1;
  }
  .rule-summary .enabled strong {
    color: #159b8d;
  }
  .rule-summary .disabled strong {
    color: #7b8798;
  }
  .rule-summary .hits strong {
    color: #1769e0;
  }
  .rule-filter-panel,
  .rule-list-panel {
    border: 1px solid #e0e6ef;
    border-radius: 6px;
    background: #fff;
  }
  .rule-filter-panel {
    flex: 0 0 auto;
    padding: 12px 14px 14px;
    margin-bottom: 12px;
  }
  .rule-list-panel {
    flex: 1;
    min-height: 0;
    padding: 14px 12px 16px;
    display: flex;
    flex-direction: column;
  }
  .panel-heading h2 {
    margin: 0;
    padding-left: 10px;
    border-left: 3px solid #e4002b;
    font-size: 15px;
  }
  .panel-heading > span {
    color: #8a96a7;
    font-size: 11px;
  }
  .panel-heading > div {
    display: flex;
    gap: 8px;
  }
  .panel-heading button {
    height: 30px;
    padding: 0 14px;
    border: 1px solid #d7dee8;
    border-radius: 4px;
    background: #fff;
    color: #526075;
    font-size: 12px;
  }
  .panel-heading button.primary {
    border-color: #1769e0;
    background: #1769e0;
    color: #fff;
  }
  .rule-filter-grid {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 16px;
    margin-top: 12px;
  }
  .rule-filter-grid label {
    display: grid;
    grid-template-columns: 70px 1fr;
    align-items: center;
    gap: 8px;
  }
  .rule-filter-grid span {
    color: #657287;
    font-size: 12px;
  }
  .rule-filter-grid input,
  .rule-filter-grid select {
    width: 100%;
    height: 32px;
    padding: 0 9px;
    border: 1px solid #dbe1ea;
    border-radius: 4px;
    background: #fff;
    color: #3e4b60;
    font-size: 12px;
  }
  .category-filter-panel {
    padding: 18px 14px;
  }
  .category-filter-grid {
    display: grid;
    grid-template-columns: minmax(280px, 1fr) minmax(260px, 1fr) auto;
    align-items: center;
    gap: 26px;
  }
  .category-filter-grid label {
    display: grid;
    grid-template-columns: 78px minmax(180px, 1fr);
    align-items: center;
    gap: 10px;
  }
  .category-filter-grid label > span {
    color: #657287;
    font-size: 12px;
  }
  .category-filter-grid input,
  .category-filter-grid select {
    width: 100%;
    height: 34px;
    padding: 0 10px;
    border: 1px solid #dbe1ea;
    border-radius: 4px;
    background: #fff;
    color: #3e4b60;
    font-size: 12px;
    outline: none;
  }
  .category-filter-grid input:focus,
  .category-filter-grid select:focus {
    border-color: #79aaf0;
    box-shadow: 0 0 0 2px rgba(23, 105, 224, 0.1);
  }
  .category-filter-actions {
    display: flex;
    gap: 8px;
  }
  .category-filter-actions button {
    height: 34px;
    padding: 0 18px;
    border: 1px solid #d7dee8;
    border-radius: 4px;
    background: #fff;
    color: #526075;
    font-size: 12px;
  }
  .category-filter-actions button.primary {
    border-color: #1769e0;
    background: #1769e0;
    color: #fff;
  }
  .rule-table-scroll {
    flex: 1;
    min-height: 0;
    margin-top: 10px;
    overflow: auto;
  }
  .rule-table {
    min-width: 1080px;
    width: 100%;
    border-collapse: separate;
    border-spacing: 0;
    font-size: 11px;
  }
  .rule-table th {
    padding: 11px 10px;
    background: #f4f6f9;
    color: #667388;
    text-align: left;
    font-weight: 500;
    white-space: nowrap;
  }
  .rule-table td {
    padding: 11px 10px;
    border-bottom: 1px solid #edf0f4;
    background: #fff;
    color: #526075;
    white-space: nowrap;
  }
  .rule-table td strong {
    color: #344158;
    font-weight: 500;
  }
  .rule-name-cell strong {
    display: block;
    max-width: 210px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .rule-id {
    color: #5d6b80 !important;
  }
  .ellipsis {
    display: block;
    max-width: 180px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .data-scope-cell {
    max-width: 150px;
  }
  .business-object-cell {
    max-width: 130px;
  }
  .level-tag {
    display: inline-grid;
    place-items: center;
    min-width: 28px;
    height: 20px;
    border-radius: 3px;
    font-weight: 600;
  }
  .level-高 {
    color: #e4002b;
    background: #fff0f2;
  }
  .level-中 {
    color: #d98300;
    background: #fff7dc;
  }
  .level-低 {
    color: #118c80;
    background: #e8f8f5;
  }
  .status-tag {
    display: inline-flex;
    align-items: center;
    gap: 5px;
  }
  .status-tag i {
    width: 6px;
    height: 6px;
    border-radius: 50%;
  }
  .status-tag.on {
    color: #118c80;
  }
  .status-tag.on i {
    background: #159b8d;
  }
  .status-tag.off {
    color: #8793a4;
  }
  .status-tag.off i {
    background: #aab3c0;
  }
  .operation-column {
    position: sticky;
    right: 0;
    z-index: 2;
    box-shadow: -8px 0 12px rgba(23, 42, 72, 0.04);
  }
  .rule-table th.operation-column {
    background: #f4f6f9;
  }
  .operation-column button {
    padding: 0 5px;
    border: 0;
    background: transparent;
    color: #1769e0;
    font-size: 11px;
  }
  .rule-list-actions {
    display: flex;
    align-items: center;
    gap: 10px !important;
  }
  .rule-list-actions .create-button {
    height: 30px;
    border-color: #1769e0;
    background: #1769e0;
    color: #fff;
  }
  .rule-pagination {
    flex: 0 0 auto;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 6px;
    min-height: 44px;
    padding-top: 10px;
    color: #7b8798;
    font-size: 11px;
  }
  .rule-pagination > span {
    margin-right: 6px;
  }
  .rule-pagination button {
    min-width: 28px;
    height: 28px;
    padding: 0 7px;
    border: 1px solid transparent;
    border-radius: 4px;
    background: #fff;
    color: #526075;
    font-size: 11px;
  }
  .rule-pagination button:hover:not(:disabled) {
    border-color: #b9d2f7;
    color: #1769e0;
  }
  .rule-pagination button.active {
    border-color: #eaf3ff;
    background: #eaf3ff;
    color: #1769e0;
    font-weight: 600;
  }
  .rule-pagination button:disabled {
    color: #c3cad4;
    cursor: not-allowed;
  }
  .rule-pagination select {
    height: 30px;
    margin-left: 6px;
    padding: 0 8px;
    border: 1px solid #dbe1ea;
    border-radius: 4px;
    background: #fff;
    color: #526075;
    font-size: 11px;
  }
  .empty-cell {
    padding: 36px !important;
    text-align: center;
    color: #9aa4b4 !important;
  }
  .category-list-panel {
    flex: 1;
    min-height: 0;
    padding-bottom: 0;
  }
  .category-list-panel .rule-table-scroll {
    flex: 1;
    overflow: auto;
  }
  .category-table {
    min-width: 920px;
    font-size: 12px;
  }
  .category-table th,
  .category-table td {
    padding-top: 13px;
    padding-bottom: 13px;
  }
  .category-description {
    max-width: 320px;
  }
  .category-list-footer {
    flex: 0 0 auto;
    min-height: 52px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 18px;
    border-top: 1px solid #edf0f4;
  }
  .category-list-note {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    color: #7b8798;
    font-size: 11px;
  }
  .category-list-note i {
    color: #7f8ca0;
    font-size: 15px;
  }
  .category-pagination {
    min-height: 0;
    padding-top: 0;
  }
}
</style>
