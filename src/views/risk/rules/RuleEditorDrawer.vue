<template>
  <Teleport to="body">
    <Transition name="rule-drawer">
      <div v-if="open" class="acro-rule-drawer-layer" @click.self="emit('close')">
        <aside
          class="rule-editor-drawer"
          role="dialog"
          aria-modal="true"
          aria-labelledby="rule-editor-title"
        >
          <header class="drawer-header">
            <div>
              <h2 id="rule-editor-title">{{ drawerTitle }}</h2>
              <span>{{ mode === 'view' ? '只读查看' : '规则编辑' }}</span>
            </div>
            <button aria-label="关闭规则编辑抽屉" @click="emit('close')">
              <i class="ri-close-line"></i>
            </button>
          </header>

          <div class="drawer-scroll">
            <fieldset :disabled="mode === 'view'">
              <section class="rule-section">
                <button
                  class="section-toggle"
                  type="button"
                  :aria-expanded="sections.object"
                  aria-controls="rule-object"
                  @click="toggleSection('object')"
                >
                  <span class="section-number">01</span
                  ><span><strong>基础信息</strong><small>定义规则名称和规则类型</small></span
                  ><i :class="sections.object ? 'ri-arrow-up-s-line' : 'ri-arrow-down-s-line'"></i>
                </button>
                <div v-show="sections.object" id="rule-object" class="section-body">
                  <label class="field field-wide"
                    ><span>规则名称 <em>*</em></span
                    ><input v-model="form.name" placeholder="请输入规则名称" /><small
                      v-if="errors.name"
                      class="field-error"
                      >{{ errors.name }}</small
                    ></label
                  >
                  <label class="field"
                    ><span>规则类型</span
                    ><select v-model="form.objectType">
                      <option v-for="item in availableCategoryOptions" :key="item">
                        {{ item }}
                      </option></select
                    ><small v-if="errors.objectType" class="field-error">{{
                      errors.objectType
                    }}</small></label
                  >
                </div>
              </section>

              <section class="rule-section">
                <button
                  class="section-toggle"
                  type="button"
                  :aria-expanded="sections.dimensions"
                  aria-controls="rule-dimensions"
                  @click="toggleSection('dimensions')"
                >
                  <span class="section-number">02</span
                  ><span
                    ><strong>维度组合</strong
                    ><small>配置数据渠道、车系、标签体系、情感、意图与用户维度</small></span
                  ><i
                    :class="sections.dimensions ? 'ri-arrow-up-s-line' : 'ri-arrow-down-s-line'"
                  ></i>
                </button>
                <div
                  v-show="sections.dimensions"
                  id="rule-dimensions"
                  class="section-body single-column builder-section"
                >
                  <div class="condition-builder dimension-builder">
                    <div
                      v-for="(condition, index) in form.dimensionConditions"
                      :key="condition.id"
                      class="condition-row dimension-condition-row"
                    >
                      <select
                        v-model="condition.dimension"
                        :aria-label="`第${index + 1}条维度类型`"
                        @change="handleDimensionChange(condition)"
                      >
                        <option v-for="item in dimensionTypeOptions" :key="item">{{ item }}</option>
                      </select>
                      <select v-model="condition.relation" :aria-label="`第${index + 1}条维度关系`">
                        <option v-for="item in dimensionRelationOptions" :key="item">
                          {{ item }}
                        </option>
                      </select>
                      <select
                        v-model="condition.valueMode"
                        :aria-label="`第${index + 1}条维度取值方式`"
                      >
                        <option>选项</option>
                      </select>
                      <select
                        v-model="condition.aggregation"
                        :aria-label="`第${index + 1}条维度计算方式`"
                      >
                        <option v-for="item in dimensionAggregationOptions" :key="item">
                          {{ item }}
                        </option>
                      </select>
                      <details class="dimension-value-picker">
                        <summary :aria-label="`第${index + 1}条维度选项`">
                          {{ condition.values.join('、') || '请选择' }}
                        </summary>
                        <div class="dimension-value-options">
                          <label v-for="item in dimensionValues(condition.dimension)" :key="item">
                            <input v-model="condition.values" type="checkbox" :value="item" />{{
                              item
                            }}
                          </label>
                        </div>
                      </details>
                      <button
                        type="button"
                        class="remove-condition"
                        :disabled="form.dimensionConditions.length === 1"
                        :aria-label="`删除第${index + 1}条维度配置`"
                        @click="removeDimensionCondition(index)"
                      >
                        <i class="ri-delete-bin-line"></i>
                      </button>
                    </div>
                    <small v-if="errors.dimensions" class="builder-error">{{
                      errors.dimensions
                    }}</small>
                    <button type="button" class="add-condition" @click="addDimensionCondition">
                      <i class="ri-add-line"></i>添加维度配置
                    </button>
                  </div>
                </div>
              </section>

              <section class="rule-section">
                <button
                  class="section-toggle"
                  type="button"
                  :aria-expanded="sections.metric"
                  aria-controls="rule-metric"
                  @click="toggleSection('metric')"
                >
                  <span class="section-number">03</span
                  ><span><strong>指标计算</strong><small>配置指标、运算符与条件组合</small></span
                  ><i :class="sections.metric ? 'ri-arrow-up-s-line' : 'ri-arrow-down-s-line'"></i>
                </button>
                <div
                  v-show="sections.metric"
                  id="rule-metric"
                  class="section-body single-column builder-section"
                >
                  <div class="condition-builder metric-builder">
                    <div class="metric-combinator" role="radiogroup" aria-label="指标条件组合">
                      <label>
                        <input v-model="form.combinator" type="radio" value="AND" />
                        满足全部条件生效（AND）
                      </label>
                      <label>
                        <input v-model="form.combinator" type="radio" value="OR" />
                        满足任一条件生效（OR）
                      </label>
                    </div>
                    <div
                      v-for="(condition, index) in form.metricConditions"
                      :key="condition.id"
                      class="condition-row metric-condition-row"
                    >
                      <select v-model="condition.metric" :aria-label="`第${index + 1}条指标`">
                        <option v-for="item in metricOptions" :key="item">{{ item }}</option>
                      </select>
                      <select
                        v-model="condition.calculation"
                        :aria-label="`第${index + 1}条指标计算类型`"
                      >
                        <option v-for="item in metricCalculationOptions" :key="item">
                          {{ item }}
                        </option>
                      </select>
                      <select v-model="condition.operator" :aria-label="`第${index + 1}条比较运算`">
                        <option v-for="item in metricOperatorOptions" :key="item">
                          {{ item }}
                        </option>
                      </select>
                      <select
                        v-model="condition.compareTarget"
                        :aria-label="`第${index + 1}条比较值类型`"
                      >
                        <option v-for="item in metricCompareTargetOptions" :key="item">
                          {{ item }}
                        </option>
                      </select>
                      <input
                        v-model.number="condition.threshold"
                        type="number"
                        min="0"
                        :aria-label="`第${index + 1}条触发阈值`"
                        placeholder="请输入"
                      />
                      <button
                        type="button"
                        class="remove-condition"
                        :disabled="form.metricConditions.length === 1"
                        :aria-label="`删除第${index + 1}条指标配置`"
                        @click="removeMetricCondition(index)"
                      >
                        <i class="ri-delete-bin-line"></i>
                      </button>
                    </div>
                    <small v-if="errors.threshold" class="builder-error">{{
                      errors.threshold
                    }}</small>
                    <button type="button" class="add-condition" @click="addMetricCondition">
                      <i class="ri-add-line"></i>添加指标配置
                    </button>
                  </div>
                </div>
              </section>

              <section class="rule-section">
                <button
                  class="section-toggle"
                  type="button"
                  :aria-expanded="sections.responsibility"
                  aria-controls="rule-responsibility"
                  @click="toggleSection('responsibility')"
                >
                  <span class="section-number">04</span
                  ><span
                    ><strong>闭环责任</strong
                    ><small>配置责任角色、状态通知、临期提醒与超期升级</small></span
                  ><i
                    :class="sections.responsibility ? 'ri-arrow-up-s-line' : 'ri-arrow-down-s-line'"
                  ></i>
                </button>
                <div v-show="sections.responsibility" id="rule-responsibility" class="section-body">
                  <div class="responsibility-config base-responsibility-config field-wide">
                    <header class="config-heading">
                      <div>
                        <strong>责任设置</strong>
                        <small>配置主责单位、事件牵头人、审核人员及各阶段通过方式</small>
                      </div>
                    </header>
                    <div class="base-responsibility-grid">
                      <label class="field"
                        ><span>审核人员 <em>*</em></span
                        ><select v-model="form.reviewer">
                          <option value="">请选择</option>
                          <option v-for="item in ownerOptions" :key="item">
                            {{ item }}
                          </option></select
                        ><small v-if="errors.reviewer" class="field-error">{{
                          errors.reviewer
                        }}</small></label
                      >
                      <label class="field"
                        ><span>审核方式</span
                        ><select v-model="form.reviewMode">
                          <option>人工审核</option>
                          <option>自动通过</option>
                        </select></label
                      >
                      <label class="field"
                        ><span>主责单位 <em>*</em></span
                        ><select v-model="form.department">
                          <option value="">请选择</option>
                          <option v-for="item in departmentOptions" :key="item">
                            {{ item }}
                          </option></select
                        ><small v-if="errors.department" class="field-error">{{
                          errors.department
                        }}</small></label
                      >
                      <label class="field"
                        ><span>事件牵头人 <em>*</em></span
                        ><select v-model="form.owner">
                          <option value="">请选择</option>
                          <option v-for="item in ownerOptions" :key="item">
                            {{ item }}
                          </option></select
                        ><small v-if="errors.owner" class="field-error">{{
                          errors.owner
                        }}</small></label
                      >
                      <label class="field"
                        ><span>响应 SLA</span
                        ><select v-model.number="form.slaHours">
                          <option :value="4">4 小时</option>
                          <option :value="12">12 小时</option>
                          <option :value="24">24 小时</option>
                          <option :value="48">48 小时</option>
                        </select></label
                      >
                      <label class="field"
                        ><span>业务响应方式</span
                        ><select v-model="form.responseMode">
                          <option>人工审核</option>
                          <option>自动通过</option>
                        </select></label
                      >
                    </div>
                  </div>

                  <div class="responsibility-config field-wide">
                    <header class="config-heading">
                      <div>
                        <strong>状态通知</strong>
                        <small>从事件审核开始，分别配置每个事件状态的通知对象</small>
                      </div>
                    </header>
                    <div class="stage-notification-list">
                      <div
                        v-for="(item, index) in form.stageNotifications"
                        :key="item.stage"
                        class="stage-notification-row"
                      >
                        <span class="config-index">{{ index + 1 }}</span>
                        <strong>{{ item.stage }}</strong>
                        <div class="channel-options">
                          <label v-for="target in noticeOptions" :key="target">
                            <input v-model="item.targets" type="checkbox" :value="target" />{{
                              target
                            }}
                          </label>
                        </div>
                      </div>
                    </div>
                    <small v-if="errors.notifications" class="config-error">{{
                      errors.notifications
                    }}</small>
                  </div>

                  <div class="responsibility-config field-wide">
                    <header class="config-heading">
                      <div>
                        <strong>临期提醒</strong>
                        <small>可添加多条提醒规则，分别设定提前时间和通知方式</small>
                      </div>
                      <button type="button" class="add-config" @click="addDueReminder">
                        <i class="ri-add-line"></i>添加提醒
                      </button>
                    </header>
                    <div class="reminder-rule-list">
                      <div
                        v-for="(reminder, index) in form.dueReminders"
                        :key="reminder.id"
                        class="reminder-rule-row"
                      >
                        <span class="config-index">{{ index + 1 }}</span>
                        <label class="compact-field">
                          <span>提前</span>
                          <input
                            v-model.number="reminder.advanceValue"
                            type="number"
                            min="1"
                            :aria-label="`第${index + 1}条临期提醒提前时间`"
                          />
                        </label>
                        <select
                          v-model="reminder.advanceUnit"
                          :aria-label="`第${index + 1}条临期提醒时间单位`"
                        >
                          <option>小时</option>
                          <option>天</option>
                        </select>
                        <div class="channel-options" :aria-label="`第${index + 1}条通知方式`">
                          <label v-for="channel in notificationChannels" :key="channel">
                            <input v-model="reminder.channels" type="checkbox" :value="channel" />{{
                              channel
                            }}
                          </label>
                        </div>
                        <button
                          type="button"
                          class="remove-config"
                          :disabled="form.dueReminders.length === 1"
                          :aria-label="`删除第${index + 1}条临期提醒`"
                          @click="removeDueReminder(index)"
                        >
                          <i class="ri-delete-bin-line"></i>
                        </button>
                      </div>
                    </div>
                    <small v-if="errors.reminders" class="config-error">{{
                      errors.reminders
                    }}</small>
                  </div>

                  <div class="responsibility-config field-wide">
                    <header class="config-heading escalation-heading">
                      <div>
                        <strong>超期升级</strong>
                        <small>事件超期后可自动升级至上一级责任单位进行督办</small>
                      </div>
                      <div class="binary-switch" role="radiogroup" aria-label="超期是否升级">
                        <button
                          type="button"
                          :class="{ active: form.overdueEscalation.enabled }"
                          @click="form.overdueEscalation.enabled = true"
                        >
                          升级
                        </button>
                        <button
                          type="button"
                          :class="{ active: !form.overdueEscalation.enabled }"
                          @click="form.overdueEscalation.enabled = false"
                        >
                          不升级
                        </button>
                      </div>
                    </header>
                    <div v-if="form.overdueEscalation.enabled" class="escalation-config-grid">
                      <label class="config-field">
                        <span>升级提醒 <em>*</em></span>
                        <select
                          v-model.number="form.overdueEscalation.delayHours"
                          aria-label="升级提醒"
                        >
                          <option :value="0">事件超期立即升级</option>
                          <option :value="1">事件超期 1 小时后升级</option>
                          <option :value="4">事件超期 4 小时后升级</option>
                          <option :value="24">事件超期 24 小时后升级</option>
                        </select>
                      </label>
                      <div class="config-field">
                        <span>提醒方式 <em>*</em></span>
                        <div class="channel-options">
                          <label v-for="channel in notificationChannels" :key="channel">
                            <input
                              v-model="form.overdueEscalation.channels"
                              type="checkbox"
                              :value="channel"
                            />{{ channel }}
                          </label>
                        </div>
                      </div>
                      <label class="config-field">
                        <span>督办单位 <em>*</em></span>
                        <select v-model="form.overdueEscalation.upperUnit">
                          <option value="">请选择</option>
                          <option v-for="item in availableEscalationUnits" :key="item">
                            {{ item }}
                          </option>
                        </select>
                      </label>
                      <div class="config-field">
                        <span>督办领导 <em>*</em></span>
                        <details class="multi-select-picker">
                          <summary aria-label="选择督办领导">
                            {{ form.overdueEscalation.supervisors.join('、') || '请选择督办领导' }}
                          </summary>
                          <div class="multi-select-options">
                            <label v-for="item in ownerOptions" :key="item">
                              <input
                                v-model="form.overdueEscalation.supervisors"
                                type="checkbox"
                                :value="item"
                              />{{ item }}
                            </label>
                          </div>
                        </details>
                      </div>
                    </div>
                    <small v-if="errors.escalation" class="config-error">{{
                      errors.escalation
                    }}</small>
                  </div>
                </div>
              </section>

              <section class="rule-section">
                <button
                  class="section-toggle"
                  type="button"
                  :aria-expanded="sections.trigger"
                  aria-controls="rule-trigger"
                  @click="toggleSection('trigger')"
                >
                  <span class="section-number">05</span
                  ><span
                    ><strong>事件策略</strong><small>配置事件等级、监测周期和规则状态</small></span
                  ><i :class="sections.trigger ? 'ri-arrow-up-s-line' : 'ri-arrow-down-s-line'"></i>
                </button>
                <div v-show="sections.trigger" id="rule-trigger" class="section-body">
                  <label class="field"
                    ><span>事件等级 <em>*</em></span
                    ><select v-model="form.level">
                      <option>高</option>
                      <option>中</option>
                      <option>低</option></select
                    ><small v-if="errors.level" class="field-error">{{
                      errors.level
                    }}</small></label
                  >
                  <label class="field"
                    ><span>监测周期</span
                    ><select v-model="form.frequency">
                      <option>实时</option>
                      <option>日</option>
                      <option>周</option>
                      <option>月</option>
                    </select></label
                  >
                  <label class="field"
                    ><span>规则状态</span
                    ><select v-model="form.status">
                      <option>启用</option>
                      <option>停用</option>
                    </select></label
                  >
                </div>
              </section>
            </fieldset>
          </div>

          <footer class="drawer-footer">
            <button class="secondary" @click="emit('close')">
              {{ mode === 'view' ? '关闭' : '取消' }}
            </button>
            <button v-if="mode !== 'view'" class="primary" @click="submit">保存规则</button>
          </footer>
        </aside>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import {
  type ClosureRule,
  type DimensionAggregation,
  type DimensionRelation,
  type DueReminderRule,
  type MetricCalculation,
  type MetricCompareTarget,
  type RuleDimensionCondition,
  type RuleMetricCondition,
  type RuleMode,
  type RuleOperator
} from './ruleData'

const props = defineProps<{
  open: boolean
  mode: RuleMode
  rule: ClosureRule | null
  categoryOptions: string[]
}>()
const emit = defineEmits<{ close: []; save: [rule: ClosureRule] }>()
type SectionKey = 'object' | 'dimensions' | 'metric' | 'trigger' | 'responsibility'

const dimensionTypeOptions = ['数据渠道', '车系', '标签体系', '情感', '意图', '用户']
const dimensionRelationOptions: DimensionRelation[] = ['包含', '等于', '不包含', '不等于']
const dimensionAggregationOptions: DimensionAggregation[] = ['加和计算', '独立计算']
const dimensionOptionMap: Record<string, string[]> = {
  数据渠道: ['400客服', '在线客服', 'App', '论坛'],
  车系: ['轩逸', '天籁', '逍客', '奇骏', 'N7'],
  标签体系: ['产品标签', '问题标签', '场景标签', '服务标签'],
  情感: ['正面', '中性', '负面'],
  意图: ['咨询', '投诉', '建议', '求助', '表扬'],
  用户: ['认证车主', '潜客', '新用户', '活跃用户', '沉默用户']
}
const metricOptions = ['提及量', '用户数', '负面率', '体验指数', 'TOP排行']
const metricCalculationOptions: MetricCalculation[] = ['数值', '环比', '同比', '排名']
const metricOperatorOptions: RuleOperator[] = ['>=', '>', '<=', '<', '=']
const metricCompareTargetOptions: MetricCompareTarget[] = ['本期数值', '上期数值', '目标值']
const departmentOptions = ['客服中心', '质量保证部', '产品企划部', '售后服务部']
const ownerOptions = ['杨琳-60114', '付俊杰-60018', '徐嘉敏-60233', '李建秋-60318']
const noticeOptions = ['审核人', '事件牵头人', '抄送人']
const notificationChannels = ['东东', '飞书', '邮件', '短信']

let dimensionConditionSequence = 0
let metricConditionSequence = 0
let reminderSequence = 0
const createDimensionCondition = (dimension = '数据渠道'): RuleDimensionCondition => ({
  id: `DC-DRAFT-${++dimensionConditionSequence}`,
  dimension,
  relation: '包含',
  valueMode: '选项',
  aggregation: dimension === '数据渠道' ? '加和计算' : '独立计算',
  values: [dimensionOptionMap[dimension]?.[0] || '']
})
const createMetricCondition = (metric = '提及量'): RuleMetricCondition => ({
  id: `MC-DRAFT-${++metricConditionSequence}`,
  metric,
  calculation: metric === 'TOP排行' ? '排名' : '数值',
  operator: '>=',
  compareTarget: '本期数值',
  threshold: metric === 'TOP排行' ? 10 : 0,
  combinator: 'AND'
})
const createDueReminder = (advanceValue = 1): DueReminderRule => ({
  id: `DR-DRAFT-${++reminderSequence}`,
  advanceValue,
  advanceUnit: '天',
  channels: ['东东', '飞书']
})
const createStageNotifications = (): ClosureRule['stageNotifications'] => [
  { stage: '事件审核', targets: ['审核人', '事件牵头人'] },
  { stage: '业务响应', targets: ['事件牵头人', '抄送人'] },
  { stage: '闭环处理', targets: ['事件牵头人', '抄送人'] },
  { stage: '事件关闭', targets: ['审核人', '事件牵头人', '抄送人'] }
]

const createEmptyRule = (): ClosureRule => ({
  id: '',
  name: '',
  objectType: props.categoryOptions[0] || '',
  objectScope: [],
  dimensions: [],
  dimensionConditions: [createDimensionCondition()],
  metric: '提及量',
  operator: '>=',
  threshold: 0,
  combinator: 'AND',
  metricConditions: [createMetricCondition()],
  level: '中',
  frequency: '日',
  reviewMode: '人工审核',
  responseMode: '人工审核',
  department: '',
  owner: '',
  reviewer: '',
  noticeTargets: ['审核人', '事件牵头人', '抄送人'],
  stageNotifications: createStageNotifications(),
  slaHours: 24,
  dueReminders: [createDueReminder(7), createDueReminder(3), createDueReminder(1)],
  overdueEscalation: {
    enabled: true,
    delayHours: 1,
    upperUnit: '客服中心',
    supervisors: ['杨琳-60114'],
    channels: ['东东', '飞书', '短信']
  },
  status: '启用',
  hitCount: 0,
  updatedAt: '刚刚'
})
const cloneRule = (rule: ClosureRule): ClosureRule => ({
  ...rule,
  objectScope: [],
  dimensions: [...rule.dimensions],
  dimensionConditions:
    rule.dimensionConditions?.length > 0
      ? rule.dimensionConditions.map(condition => ({
          ...condition,
          values: [...condition.values]
        }))
      : [createDimensionCondition()],
  metricConditions:
    rule.metricConditions?.length > 0
      ? rule.metricConditions.map(condition => ({ ...condition }))
      : [
          {
            ...createMetricCondition(rule.metric),
            operator: rule.operator,
            threshold: rule.threshold,
            combinator: rule.combinator
          }
        ],
  noticeTargets: [...rule.noticeTargets],
  stageNotifications: rule.stageNotifications?.length
    ? rule.stageNotifications.map(item => ({ ...item, targets: [...item.targets] }))
    : createStageNotifications(),
  dueReminders: rule.dueReminders?.length
    ? rule.dueReminders.map(reminder => ({ ...reminder, channels: [...reminder.channels] }))
    : [createDueReminder(7), createDueReminder(3), createDueReminder(1)],
  overdueEscalation: rule.overdueEscalation
    ? {
        ...rule.overdueEscalation,
        supervisors: [...rule.overdueEscalation.supervisors],
        channels: [...rule.overdueEscalation.channels]
      }
    : {
        enabled: true,
        delayHours: 1,
        upperUnit: '客服中心',
        supervisors: ['杨琳-60114'],
        channels: ['东东', '飞书', '短信']
      }
})
const form = reactive<ClosureRule>(createEmptyRule())
const sections = reactive<Record<SectionKey, boolean>>({
  object: true,
  dimensions: false,
  metric: false,
  trigger: true,
  responsibility: false
})
const errors = reactive({
  name: '',
  objectType: '',
  dimensions: '',
  level: '',
  threshold: '',
  department: '',
  owner: '',
  reviewer: '',
  notifications: '',
  reminders: '',
  escalation: ''
})
const availableCategoryOptions = computed(() => {
  const options = [...props.categoryOptions]
  if (form.objectType && !options.includes(form.objectType)) options.unshift(form.objectType)
  return options
})
const availableEscalationUnits = computed(() =>
  departmentOptions.filter(item => item !== form.department)
)
const drawerTitle = computed(() =>
  props.mode === 'create' ? '新建规则' : props.mode === 'edit' ? '编辑规则' : '查看规则'
)

const resetSections = () =>
  Object.assign(
    sections,
    props.mode === 'view'
      ? { object: true, dimensions: true, metric: true, trigger: true, responsibility: true }
      : { object: true, dimensions: false, metric: false, trigger: true, responsibility: false }
  )
const clearErrors = () =>
  Object.assign(errors, {
    name: '',
    objectType: '',
    dimensions: '',
    level: '',
    threshold: '',
    department: '',
    owner: '',
    reviewer: '',
    notifications: '',
    reminders: '',
    escalation: ''
  })
watch(
  () => [props.open, props.mode, props.rule?.id] as const,
  () => {
    if (!props.open) return
    Object.assign(form, props.rule ? cloneRule(props.rule) : createEmptyRule())
    clearErrors()
    resetSections()
  },
  { immediate: true }
)
watch(
  () => props.open,
  value => document.body.classList.toggle('rule-drawer-open', value),
  { immediate: true }
)
onBeforeUnmount(() => document.body.classList.remove('rule-drawer-open'))

const toggleSection = (section: SectionKey) => {
  sections[section] = !sections[section]
}
const dimensionValues = (dimension: string) => dimensionOptionMap[dimension] || []
const handleDimensionChange = (condition: RuleDimensionCondition) => {
  condition.values = [dimensionValues(condition.dimension)[0] || '']
  condition.aggregation = condition.dimension === '车系' ? '独立计算' : '加和计算'
}
const addDimensionCondition = () => {
  const used = new Set(form.dimensionConditions.map(condition => condition.dimension))
  const nextDimension =
    dimensionTypeOptions.find(item => !used.has(item)) || dimensionTypeOptions[0]
  form.dimensionConditions.push(createDimensionCondition(nextDimension))
}
const removeDimensionCondition = (index: number) => {
  if (form.dimensionConditions.length === 1) return
  form.dimensionConditions.splice(index, 1)
}
const addMetricCondition = () => {
  const nextMetric = metricOptions[form.metricConditions.length % metricOptions.length]
  form.metricConditions.push(createMetricCondition(nextMetric))
}
const removeMetricCondition = (index: number) => {
  if (form.metricConditions.length === 1) return
  form.metricConditions.splice(index, 1)
}
const addDueReminder = () => form.dueReminders.push(createDueReminder())
const removeDueReminder = (index: number) => {
  if (form.dueReminders.length === 1) return
  form.dueReminders.splice(index, 1)
}
watch(
  () => form.department,
  () => {
    if (
      form.overdueEscalation.enabled &&
      !availableEscalationUnits.value.includes(form.overdueEscalation.upperUnit)
    ) {
      form.overdueEscalation.upperUnit = availableEscalationUnits.value[0] || ''
    }
  }
)
const validate = () => {
  errors.name = form.name.trim() ? '' : '请输入规则名称'
  errors.objectType = form.objectType ? '' : '请选择规则类型'
  errors.dimensions =
    form.dimensionConditions.length > 0 &&
    form.dimensionConditions.every(condition => condition.values.length > 0)
      ? ''
      : '请至少添加一条完整的维度配置'
  errors.level = form.level ? '' : '请选择事件等级'
  errors.threshold =
    form.metricConditions.length > 0 &&
    form.metricConditions.every(condition => Number.isFinite(Number(condition.threshold)))
      ? ''
      : '请至少添加一条完整的指标配置'
  errors.department = form.department ? '' : '请选择主责单位'
  errors.owner = form.owner ? '' : '请选择事件牵头人'
  errors.reviewer = form.reviewer ? '' : '请选择审核人员'
  errors.notifications = form.stageNotifications.every(item => item.targets.length > 0)
    ? ''
    : '每个事件状态至少选择一个通知对象'
  errors.reminders = form.dueReminders.every(
    reminder => reminder.advanceValue > 0 && reminder.channels.length > 0
  )
    ? ''
    : '每条临期提醒均需设置有效提前时间，并至少选择一种通知方式'
  errors.escalation =
    !form.overdueEscalation.enabled ||
    (form.overdueEscalation.delayHours >= 0 &&
      Boolean(form.overdueEscalation.upperUnit) &&
      form.overdueEscalation.supervisors.length > 0 &&
      form.overdueEscalation.channels.length > 0)
      ? ''
      : '请完整配置升级提醒、提醒方式、督办单位和督办领导'
  if (
    errors.department ||
    errors.owner ||
    errors.reviewer ||
    errors.notifications ||
    errors.reminders ||
    errors.escalation
  ) {
    sections.responsibility = true
  }
  if (errors.threshold) sections.metric = true
  if (errors.dimensions) sections.dimensions = true
  if (errors.name || errors.objectType) sections.object = true
  return !Object.values(errors).some(Boolean)
}
const submit = () => {
  if (!validate()) return
  form.objectScope = []
  form.dimensions = form.dimensionConditions.flatMap(condition => condition.values)
  form.noticeTargets = [...new Set(form.stageNotifications.flatMap(item => item.targets))]
  form.metricConditions.forEach(condition => (condition.combinator = form.combinator))
  const firstCondition = form.metricConditions[0]
  form.metric = firstCondition.metric
  form.operator = firstCondition.operator
  form.threshold = firstCondition.threshold
  emit('save', cloneRule({ ...form, updatedAt: '刚刚' }))
}
</script>

<style lang="scss">
body.rule-drawer-open {
  overflow: hidden;
}
.acro-rule-drawer-layer {
  position: fixed;
  inset: 0;
  z-index: 1250;
  display: flex;
  justify-content: flex-end;
  background: rgba(16, 24, 40, 0.5);
  font-family: Inter, 'PingFang SC', 'Microsoft YaHei', sans-serif;
  color: #1d2635;
  * {
    box-sizing: border-box;
  }
  .rule-editor-drawer {
    display: flex;
    flex-direction: column;
    width: min(920px, 78vw);
    height: 100%;
    background: #f7f9fc;
    box-shadow: -16px 0 42px rgba(15, 31, 58, 0.18);
  }
  .rule-editor-drawer .drawer-header {
    min-height: 66px;
    padding: 0 22px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid #e1e6ed;
    background: #fff;
  }
  .rule-editor-drawer .drawer-header h2 {
    margin: 0;
    font-size: 18px;
  }
  .rule-editor-drawer .drawer-header span {
    display: block;
    margin-top: 3px;
    color: #8a96a7;
    font-size: 11px;
  }
  .rule-editor-drawer .drawer-header button {
    border: 0;
    background: transparent;
    color: #64748b;
    font-size: 22px;
  }
  .rule-editor-drawer .drawer-scroll {
    flex: 1;
    overflow-y: auto;
    scrollbar-gutter: stable;
    padding: 14px 18px 88px;
  }
  .rule-editor-drawer fieldset {
    margin: 0;
    padding: 0;
    border: 0;
  }
  .rule-section {
    margin-bottom: 10px;
    border: 1px solid #dfe5ee;
    border-radius: 6px;
    background: #fff;
    overflow: visible;
  }
  .section-toggle {
    width: 100%;
    min-height: 54px;
    padding: 0 14px;
    display: flex;
    align-items: center;
    gap: 10px;
    border: 0;
    background: #fff;
    color: #273247;
    text-align: left;
  }
  .section-toggle:hover {
    background: #fafbfd;
  }
  .section-number {
    display: grid;
    place-items: center;
    width: 28px;
    height: 28px;
    border-radius: 50%;
    background: #edf4ff;
    color: #1769e0;
    font-size: 11px;
    font-weight: 600;
  }
  .section-toggle > span:nth-child(2) {
    flex: 1;
  }
  .section-toggle strong,
  .section-toggle small {
    display: block;
  }
  .section-toggle strong {
    font-size: 14px;
  }
  .section-toggle small {
    margin-top: 2px;
    color: #8a96a7;
    font-size: 11px;
  }
  .section-toggle > i {
    color: #7d899a;
    font-size: 18px;
  }
  .section-body {
    padding: 15px 16px 17px;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 14px 16px;
    border-top: 1px solid #edf0f4;
  }
  .section-body.single-column {
    grid-template-columns: 1fr;
  }
  .field {
    display: grid;
    grid-template-columns: 86px 1fr;
    gap: 8px;
    align-items: start;
    position: relative;
  }
  .field-wide {
    grid-column: 1 / -1;
  }
  .field > span {
    padding-top: 8px;
    color: #58667a;
    font-size: 12px;
  }
  .field em {
    color: #e4002b;
    font-style: normal;
  }
  .field input,
  .field select {
    width: 100%;
    height: 34px;
    padding: 0 9px;
    border: 1px solid #dbe1ea;
    border-radius: 4px;
    background: #fff;
    color: #354156;
    font-size: 12px;
    outline: none;
  }
  .field-error {
    grid-column: 2;
    margin-top: -4px;
    color: #e4002b;
    font-size: 11px;
  }
  .scope-field {
    grid-column: 1 / -1;
  }
  .check-grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 8px;
    padding-top: 5px;
  }
  .check-grid.wide {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
  .check-grid label {
    display: flex;
    align-items: center;
    gap: 6px;
    color: #526075;
    font-size: 12px;
  }
  .check-grid input {
    width: 14px;
    height: 14px;
  }
  .responsibility-config {
    padding: 13px;
    border: 1px solid #e1e6ed;
    border-radius: 5px;
    background: #f8fafd;
  }
  .base-responsibility-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px 16px;
  }
  .config-heading {
    margin-bottom: 11px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
  }
  .config-heading strong,
  .config-heading small {
    display: block;
  }
  .config-heading strong {
    color: #344158;
    font-size: 13px;
  }
  .config-heading small {
    margin-top: 2px;
    color: #8a96a7;
    font-size: 10px;
  }
  .add-config {
    height: 30px;
    padding: 0 10px;
    display: inline-flex;
    align-items: center;
    gap: 4px;
    border: 1px solid #b9d5ff;
    border-radius: 4px;
    background: #edf5ff;
    color: #1769e0;
    font-size: 11px;
  }
  .reminder-rule-list {
    display: grid;
    gap: 8px;
  }
  .stage-notification-list {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
  }
  .stage-notification-row {
    min-width: 0;
    min-height: 44px;
    padding: 8px 10px;
    display: grid;
    grid-template-columns: 24px 76px 1fr;
    align-items: center;
    gap: 8px;
    border: 1px solid #dfe5ee;
    border-radius: 4px;
    background: #fff;
  }
  .stage-notification-row > strong {
    color: #46546a;
    font-size: 11px;
    font-weight: 500;
  }
  .reminder-rule-row {
    min-width: 0;
    padding: 8px;
    display: grid;
    grid-template-columns: 24px 116px 72px minmax(280px, 1fr) 32px;
    align-items: center;
    gap: 8px;
    border: 1px solid #dfe5ee;
    border-radius: 4px;
    background: #fff;
  }
  .config-index {
    width: 22px;
    height: 22px;
    display: grid;
    place-items: center;
    border-radius: 50%;
    background: #edf4ff;
    color: #1769e0;
    font-size: 10px;
  }
  .compact-field {
    display: grid;
    grid-template-columns: 34px 1fr;
    align-items: center;
    gap: 6px;
    color: #58667a;
    font-size: 11px;
  }
  .reminder-rule-row input[type='number'],
  .reminder-rule-row > select,
  .config-field input,
  .config-field select {
    width: 100%;
    min-width: 0;
    height: 32px;
    padding: 0 8px;
    border: 1px solid #dbe1ea;
    border-radius: 4px;
    background: #fff;
    color: #354156;
    font-size: 11px;
    outline: none;
  }
  .channel-options {
    min-width: 0;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 7px 12px;
  }
  .channel-options label {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    color: #526075;
    font-size: 11px;
    white-space: nowrap;
  }
  .channel-options input {
    width: 14px;
    height: 14px;
  }
  .multi-select-picker {
    position: relative;
    min-width: 0;
  }
  .multi-select-picker summary {
    position: relative;
    height: 32px;
    padding: 0 28px 0 9px;
    display: flex;
    align-items: center;
    overflow: hidden;
    border: 1px solid #dbe1ea;
    border-radius: 4px;
    background: #fff;
    color: #354156;
    font-size: 11px;
    text-overflow: ellipsis;
    white-space: nowrap;
    cursor: pointer;
    list-style: none;
  }
  .multi-select-picker summary::-webkit-details-marker {
    display: none;
  }
  .multi-select-picker summary::after {
    content: '⌄';
    position: absolute;
    right: 9px;
    color: #7d899a;
  }
  .multi-select-options {
    position: absolute;
    z-index: 5;
    top: 36px;
    right: 0;
    left: 0;
    padding: 9px;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
    border: 1px solid #dbe1ea;
    border-radius: 4px;
    background: #fff;
    box-shadow: 0 8px 20px rgba(30, 50, 80, 0.14);
  }
  .multi-select-options label {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    color: #526075;
    font-size: 11px;
    white-space: nowrap;
  }
  .multi-select-options input {
    width: 14px;
    height: 14px;
  }
  .rule-editor-drawer fieldset:disabled .multi-select-picker {
    pointer-events: none;
  }
  .remove-config {
    width: 32px;
    height: 32px;
    border: 1px solid #dbe1ea;
    border-radius: 4px;
    background: #fff;
    color: #8b97a8;
  }
  .remove-config:hover:not(:disabled) {
    border-color: #e4002b;
    color: #e4002b;
  }
  .remove-config:disabled {
    color: #c5cbd4;
    cursor: not-allowed;
  }
  .config-error {
    display: block;
    margin-top: 8px;
    color: #e4002b;
    font-size: 11px;
  }
  .escalation-heading {
    margin-bottom: 13px;
  }
  .binary-switch {
    display: inline-flex;
  }
  .binary-switch button {
    min-width: 60px;
    height: 30px;
    border: 1px solid #dbe1ea;
    background: #fff;
    color: #657287;
    font-size: 11px;
  }
  .binary-switch button:first-child {
    border-radius: 4px 0 0 4px;
  }
  .binary-switch button:last-child {
    margin-left: -1px;
    border-radius: 0 4px 4px 0;
  }
  .binary-switch button.active {
    position: relative;
    border-color: #1769e0;
    background: #edf5ff;
    color: #1769e0;
    font-weight: 600;
  }
  .escalation-config-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 11px 16px;
  }
  .config-field {
    min-width: 0;
    display: grid;
    grid-template-columns: 100px 1fr;
    align-items: center;
    gap: 8px;
  }
  .config-field > span {
    color: #58667a;
    font-size: 11px;
  }
  .config-field em {
    color: #e4002b;
    font-style: normal;
  }
  .builder-section {
    padding: 14px 16px 16px;
  }
  .condition-builder {
    min-width: 0;
    display: grid;
    gap: 10px;
  }
  .condition-row {
    min-width: 0;
    display: grid;
    align-items: center;
    gap: 8px;
    padding: 8px;
    border: 1px solid #e1e6ed;
    border-radius: 5px;
    background: #f8fafd;
  }
  .dimension-condition-row {
    grid-template-columns: minmax(106px, 1fr) 82px 70px 102px minmax(170px, 1.5fr) 32px;
  }
  .metric-condition-row {
    grid-template-columns: minmax(108px, 1fr) 82px 76px 104px minmax(112px, 1fr) 32px;
  }
  .condition-row select,
  .condition-row input[type='number'] {
    width: 100%;
    min-width: 0;
    height: 34px;
    padding: 0 8px;
    border: 1px solid #dbe1ea;
    border-radius: 4px;
    background: #fff;
    color: #354156;
    font-size: 12px;
    outline: none;
  }
  .remove-condition {
    width: 32px;
    height: 32px;
    border: 1px solid #dbe1ea;
    border-radius: 4px;
    background: #fff;
    color: #8b97a8;
  }
  .remove-condition:hover:not(:disabled) {
    border-color: #e4002b;
    color: #e4002b;
  }
  .remove-condition:disabled {
    color: #c5cbd4;
    cursor: not-allowed;
  }
  .add-condition {
    width: fit-content;
    height: 34px;
    padding: 0 12px;
    display: inline-flex;
    align-items: center;
    gap: 4px;
    border: 1px solid #b9d5ff;
    border-radius: 4px;
    background: #edf5ff;
    color: #1769e0;
    font-size: 12px;
  }
  .builder-error {
    color: #e4002b;
    font-size: 11px;
  }
  .dimension-value-picker {
    position: relative;
    min-width: 0;
  }
  .dimension-value-picker summary {
    height: 34px;
    padding: 0 28px 0 9px;
    display: flex;
    align-items: center;
    overflow: hidden;
    border: 1px solid #dbe1ea;
    border-radius: 4px;
    background: #fff;
    color: #354156;
    font-size: 12px;
    text-overflow: ellipsis;
    white-space: nowrap;
    cursor: pointer;
    list-style: none;
  }
  .dimension-value-picker summary::-webkit-details-marker {
    display: none;
  }
  .dimension-value-picker summary::after {
    content: '⌄';
    position: absolute;
    right: 10px;
    color: #7d899a;
  }
  .dimension-value-options {
    position: absolute;
    z-index: 3;
    top: 38px;
    right: 0;
    left: 0;
    min-width: 190px;
    padding: 8px;
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 7px;
    border: 1px solid #dbe1ea;
    border-radius: 4px;
    background: #fff;
    box-shadow: 0 8px 20px rgba(30, 50, 80, 0.12);
  }
  .dimension-value-options label {
    display: flex;
    align-items: center;
    gap: 5px;
    color: #526075;
    font-size: 11px;
  }
  .dimension-value-options input {
    width: 14px;
    height: 14px;
  }
  .metric-combinator {
    padding: 2px 0 4px;
    display: flex;
    align-items: center;
    gap: 28px;
  }
  .metric-combinator label {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    color: #46546a;
    font-size: 12px;
  }
  .metric-combinator input {
    width: 15px;
    height: 15px;
    accent-color: #1769e0;
  }
  .rule-editor-drawer fieldset:disabled .section-toggle {
    cursor: default;
  }
  .rule-editor-drawer fieldset:disabled input,
  .rule-editor-drawer fieldset:disabled select {
    background: #f4f6f9;
    color: #657287;
  }
  .drawer-footer {
    min-height: 70px;
    padding: 0 18px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 10px;
    border-top: 1px solid #e1e6ed;
    background: #fff;
  }
  .drawer-footer button {
    min-width: 126px;
    height: 36px;
    border-radius: 4px;
    font-size: 13px;
  }
  .drawer-footer .secondary {
    border: 1px solid #d7dee8;
    background: #fff;
    color: #526075;
  }
  .drawer-footer .primary {
    border: 1px solid #1769e0;
    background: #1769e0;
    color: #fff;
  }
}
.rule-drawer-enter-active,
.rule-drawer-leave-active {
  transition: opacity 0.2s ease;
}
.rule-drawer-enter-active .rule-editor-drawer,
.rule-drawer-leave-active .rule-editor-drawer {
  transition: transform 0.24s ease;
}
.rule-drawer-enter-from,
.rule-drawer-leave-to {
  opacity: 0;
}
.rule-drawer-enter-from .rule-editor-drawer,
.rule-drawer-leave-to .rule-editor-drawer {
  transform: translateX(100%);
}
</style>
