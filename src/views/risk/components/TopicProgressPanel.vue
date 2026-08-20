<template>
  <section class="workflow-panel" aria-label="课题事件处理进度">
    <section class="workflow-stage-card">
      <header class="workflow-stage-header">
        <div>
          <span>课题事件处理阶段</span>
          <strong>{{ workflowStages[activeStageIndex].label }}</strong>
        </div>
        <span class="workflow-stage-count">
          第 {{ activeStageIndex + 1 }} / {{ workflowStages.length }} 阶段
        </span>
      </header>
      <div
        class="workflow-stage-rail"
        :style="{
          '--stage-progress': `${(activeStageIndex / (workflowStages.length - 1)) * 100}%`
        }"
      >
        <div
          v-for="(step, index) in workflowStages"
          :key="step.key"
          :class="[
            'workflow-stage-item',
            { done: index < activeStageIndex, active: index === activeStageIndex }
          ]"
        >
          <span class="workflow-stage-node">
            <i v-if="index < activeStageIndex" class="ri-check-line"></i>
            <template v-else>{{ index + 1 }}</template>
          </span>
          <strong>{{ step.label }}</strong>
          <small>{{ step.role }}</small>
        </div>
      </div>
    </section>

    <section v-if="activeStage === 'generation'" class="workflow-card">
      <header class="workflow-card-header">
        <span class="workflow-card-mark"></span>
        <div>
          <strong>事件生成记录</strong>
          <small>记录事件创建时间、触发来源、聚合证据及规则预填信息</small>
        </div>
      </header>
      <div class="workflow-card-body">
        <div class="role-banner">
          <i class="ri-magic-line"></i>
          <span><strong>当前处理角色：规则引擎</strong>系统自动生成，等待进入事件审核</span>
        </div>
        <dl class="review-setting-summary generation-summary">
          <div>
            <dt>事件创建时间</dt>
            <dd>{{ event.warningTime }}</dd>
          </div>
          <div>
            <dt>生成方式</dt>
            <dd>规则自动触发</dd>
          </div>
          <div>
            <dt>触发频率</dt>
            <dd>{{ event.frequency }}</dd>
          </div>
          <div>
            <dt>证据数量</dt>
            <dd>{{ event.evidenceCount.toLocaleString() }} 条</dd>
          </div>
        </dl>
        <div class="generation-evidence">
          <div>
            <span>事件分类</span><strong>{{ event.category }}</strong>
          </div>
          <div>
            <span>数据来源</span><strong>{{ event.source }}</strong>
          </div>
          <div>
            <span>规则预填主责单位</span><strong>{{ event.department }}</strong>
          </div>
          <div>
            <span>规则预填业务责任人</span><strong>{{ event.owner }}</strong>
          </div>
          <div class="wide">
            <span>生成依据</span><strong>{{ event.summary }}</strong>
          </div>
        </div>
        <p class="workflow-hint generation-hint">
          <i class="ri-time-line"></i>
          事件创建时间已写入全过程记录；提交后进入事件审核，由审核人员判断有效性并确认责任信息。
        </p>
      </div>
    </section>

    <section v-else-if="activeStage === 'review'" class="workflow-card">
      <header class="workflow-card-header">
        <span class="workflow-card-mark"></span>
        <div>
          <strong>课题有效性审核与下发确认</strong>
          <small>审核人员判断课题是否有效，并确认规则预填的责任信息</small>
        </div>
      </header>
      <div class="workflow-card-body">
        <div class="role-banner">
          <i class="ri-shield-user-line"></i>
          <span><strong>当前处理角色：审核人员</strong>付俊杰-60018 · 客服中心</span>
        </div>
        <div class="workflow-form-grid">
          <div class="workflow-field field-wide">
            <span>课题有效性 <em>*</em></span>
            <div class="segmented-control">
              <button
                :class="{ active: reviewForm.validity === 'valid' }"
                @click="reviewForm.validity = 'valid'"
              >
                <i class="ri-checkbox-circle-line"></i>有效课题
              </button>
              <button
                :class="{ active: reviewForm.validity === 'invalid' }"
                @click="reviewForm.validity = 'invalid'"
              >
                <i class="ri-close-circle-line"></i>无效课题
              </button>
            </div>
          </div>
          <label class="workflow-field">
            <span>主责单位 <em>*</em></span>
            <select v-model="reviewForm.primaryUnit">
              <option v-for="unit in unitOptions" :key="unit">{{ unit }}</option>
            </select>
          </label>
          <label class="workflow-field">
            <span>业务责任人 <em>*</em></span>
            <select v-model="reviewForm.businessOwner">
              <option v-for="person in businessOwnerOptions" :key="person">{{ person }}</option>
            </select>
          </label>
          <label class="workflow-field">
            <span>响应时限 <em>*</em></span>
            <input v-model="reviewForm.responseDeadline" type="datetime-local" />
          </label>
          <label class="workflow-field">
            <span>审核人员</span>
            <input value="付俊杰-60018" disabled />
          </label>
          <label class="workflow-field field-wide textarea-field">
            <span>审核意见 <em>*</em></span>
            <textarea
              v-model="reviewForm.comment"
              maxlength="300"
              placeholder="说明有效性判断依据及责任信息确认结论"
            ></textarea>
            <small>{{ reviewForm.comment.length }} / 300</small>
          </label>
        </div>
        <p class="workflow-hint">
          <i class="ri-information-line"></i>
          确认后事件将下发至业务责任人；判断为无效时可直接关闭事件并保留审核记录。
        </p>
      </div>
    </section>

    <section v-else-if="activeStage === 'response'" class="workflow-card">
      <header class="workflow-card-header">
        <span class="workflow-card-mark"></span>
        <div>
          <strong>业务响应确认</strong>
          <small>业务责任人确认审核设定；需要调整时驳回至审核人员二次确认</small>
        </div>
      </header>
      <div class="workflow-card-body">
        <div class="role-banner">
          <i class="ri-user-settings-line"></i>
          <span><strong>当前处理角色：业务责任人</strong>{{ responseForm.businessOwner }}</span>
        </div>
        <dl class="review-setting-summary">
          <div>
            <dt>审核结论</dt>
            <dd>有效课题</dd>
          </div>
          <div>
            <dt>主责单位</dt>
            <dd>{{ responseForm.primaryUnit }}</dd>
          </div>
          <div>
            <dt>响应时限</dt>
            <dd>{{ formatDateTime(responseForm.responseDeadline) }}</dd>
          </div>
          <div>
            <dt>业务责任人</dt>
            <dd>{{ responseForm.businessOwner }}</dd>
          </div>
        </dl>
        <div class="workflow-form-grid response-form">
          <div class="workflow-field field-wide">
            <span>确认结果 <em>*</em></span>
            <div class="segmented-control">
              <button
                :class="{ active: responseForm.decision === 'confirm' }"
                @click="responseForm.decision = 'confirm'"
              >
                <i class="ri-check-double-line"></i>无需调整
              </button>
              <button
                :class="{ active: responseForm.decision === 'adjust' }"
                @click="responseForm.decision = 'adjust'"
              >
                <i class="ri-arrow-go-back-line"></i>需要调整
              </button>
            </div>
          </div>

          <template v-if="responseForm.decision === 'adjust'">
            <label class="workflow-field">
              <span>调整主责单位 <em>*</em></span>
              <select v-model="responseForm.primaryUnit">
                <option v-for="unit in unitOptions" :key="unit">{{ unit }}</option>
              </select>
            </label>
            <label class="workflow-field">
              <span>调整责任人 <em>*</em></span>
              <select v-model="responseForm.businessOwner">
                <option v-for="person in businessOwnerOptions" :key="person">{{ person }}</option>
              </select>
            </label>
            <label class="workflow-field">
              <span>调整响应时限 <em>*</em></span>
              <input v-model="responseForm.responseDeadline" type="datetime-local" />
            </label>
            <label class="workflow-field field-wide textarea-field">
              <span>驳回及调整说明 <em>*</em></span>
              <textarea
                v-model="responseForm.adjustmentReason"
                maxlength="300"
                placeholder="说明需调整的原因及建议内容，提交后由审核人员二次确认"
              ></textarea>
              <small>{{ responseForm.adjustmentReason.length }} / 300</small>
            </label>
          </template>

          <template v-else>
            <label class="workflow-field">
              <span>课题处理人员 <em>*</em></span>
              <select v-model="responseForm.processor">
                <option v-for="person in processorOptions" :key="person">{{ person }}</option>
              </select>
            </label>
            <label class="workflow-field">
              <span>计划完成时间 <em>*</em></span>
              <input v-model="responseForm.plannedCompletionAt" type="datetime-local" />
            </label>
            <div class="workflow-field field-wide collaboration-field">
              <span>
                协同单位
                <small>选填；可添加多个单位，并分别指定处理人员</small>
              </span>
              <div class="collaboration-editor">
                <div
                  v-for="(assignment, index) in responseForm.collaborations"
                  :key="assignment.id"
                  class="collaboration-row"
                >
                  <select v-model="assignment.unit" :aria-label="`第${index + 1}个协同单位`">
                    <option
                      v-for="unit in availableUnitsForAssignment(assignment.unit)"
                      :key="unit"
                    >
                      {{ unit }}
                    </option>
                  </select>
                  <select
                    v-model="assignment.processor"
                    :aria-label="`${assignment.unit}协同处理人员`"
                  >
                    <option v-for="person in collaborationProcessorOptions" :key="person">
                      {{ person }}
                    </option>
                  </select>
                  <button
                    type="button"
                    class="remove-collaboration"
                    :aria-label="`移除${assignment.unit}`"
                    @click="removeCollaboration(index)"
                  >
                    <i class="ri-delete-bin-line"></i>
                  </button>
                </div>
                <div v-if="!responseForm.collaborations.length" class="collaboration-empty">
                  暂无协同单位，主责单位可独立处理
                </div>
                <button type="button" class="add-collaboration" @click="addCollaboration">
                  <i class="ri-add-line"></i>添加协同单位
                </button>
              </div>
            </div>
            <label class="workflow-field field-wide textarea-field">
              <span>响应说明</span>
              <textarea
                v-model="responseForm.comment"
                maxlength="300"
                placeholder="补充人员安排、协同要求或其他响应说明"
              ></textarea>
              <small>{{ responseForm.comment.length }} / 300</small>
            </label>
          </template>
        </div>
      </div>
    </section>

    <template v-else-if="activeStage === 'handling'">
      <section class="workflow-card">
        <header class="workflow-card-header split-header">
          <span class="workflow-card-mark"></span>
          <div>
            <strong>课题任务执行</strong>
            <small>主责单位与协同单位处理人员创建任务、设定时限并更新状态</small>
          </div>
          <button class="outline-action" @click="openCreateTask">
            <i class="ri-add-line"></i>创建课题任务
          </button>
        </header>
        <div class="workflow-card-body">
          <dl class="handling-assignment-summary">
            <div>
              <dt>主责单位</dt>
              <dd>{{ responseForm.primaryUnit }}</dd>
            </div>
            <div>
              <dt>业务责任人</dt>
              <dd>{{ responseForm.businessOwner }}</dd>
            </div>
            <div>
              <dt>处理人员</dt>
              <dd>{{ responseForm.processor }}</dd>
            </div>
            <div>
              <dt>协同单位</dt>
              <dd v-if="responseForm.collaborations.length">
                <span
                  v-for="assignment in responseForm.collaborations"
                  :key="assignment.id"
                  class="collaboration-summary-item"
                >
                  {{ assignment.unit }} · {{ assignment.processor }}
                </span>
              </dd>
              <dd v-else>无</dd>
            </div>
          </dl>

          <div v-if="taskFormOpen" class="task-create-form">
            <strong class="task-form-title">{{ taskEditingId ? '编辑任务' : '创建任务' }}</strong>
            <label
              ><span>任务名称 <em>*</em></span
              ><input v-model="taskDraft.name" placeholder="请输入课题任务"
            /></label>
            <label
              ><span>执行单位 <em>*</em></span
              ><select v-model="taskDraft.unit">
                <option v-for="unit in unitOptions" :key="unit">{{ unit }}</option>
              </select></label
            >
            <label
              ><span>处理人员 <em>*</em></span
              ><select v-model="taskDraft.owner">
                <option v-for="person in processorOptions" :key="person">{{ person }}</option>
              </select></label
            >
            <label
              ><span>计划完成时间 <em>*</em></span
              ><input v-model="taskDraft.deadline" type="datetime-local"
            /></label>
            <div class="task-create-actions">
              <button @click="closeTaskForm">取消</button
              ><button class="primary-mini" @click="saveTask">
                {{ taskEditingId ? '保存修改' : '保存任务' }}
              </button>
            </div>
          </div>

          <div class="task-table-wrap">
            <table class="task-table">
              <thead>
                <tr>
                  <th>任务</th>
                  <th>执行单位</th>
                  <th>处理人员</th>
                  <th>计划完成时间</th>
                  <th>实际完成时间</th>
                  <th>任务状态</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="task in tasks" :key="task.id">
                  <td>
                    <strong>{{ task.name }}</strong
                    ><small>{{ task.id }}</small>
                  </td>
                  <td>{{ task.unit }}</td>
                  <td>{{ task.owner }}</td>
                  <td>{{ task.deadline }}</td>
                  <td>{{ task.completedAt || '—' }}</td>
                  <td>
                    <span :class="['task-status-tag', `task-status-${task.status}`]">
                      {{ task.status }}
                    </span>
                  </td>
                  <td class="task-actions-cell">
                    <button type="button" @click="startEditTask(task)">编辑任务</button>
                    <button type="button" @click="toggleProgressEditor(task.id)">更新进度</button>
                    <button type="button" class="danger" @click="deleteTask(task)">删除</button>
                    <select
                      v-if="progressEditingId === task.id"
                      :value="task.status"
                      aria-label="更新任务进度"
                      @change="updateTaskStatus(task, $event)"
                    >
                      <option>待处理</option>
                      <option>处理中</option>
                      <option>已完成</option>
                    </select>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section class="workflow-card reminder-card">
        <header class="workflow-card-header">
          <span class="workflow-card-mark"></span>
          <div>
            <strong>临期提醒与超期升级</strong
            ><small>系统按任务时限自动提醒；超期后升级至上一级责任单位主导</small>
          </div>
        </header>
        <div class="workflow-card-body">
          <div class="reminder-grid">
            <article v-for="reminder in reminders" :key="reminder.days">
              <i class="ri-notification-3-line"></i>
              <div>
                <strong>临期 {{ reminder.days }} 日提醒</strong
                ><small>{{ reminder.channel }}</small>
              </div>
              <span>{{ reminder.status }}</span>
            </article>
          </div>
          <div :class="['escalation-panel', { triggered: escalationTriggered }]">
            <header>
              <i class="ri-arrow-up-circle-line"></i>
              <div>
                <strong>超期升级机制</strong
                ><small>超期自动升至上一级责任单位，并由上级设定督办目标</small>
              </div>
              <span>{{ escalationTriggered ? '已触发升级' : '未触发' }}</span>
            </header>
            <div class="escalation-grid">
              <label
                ><span>上一级责任单位</span
                ><select v-model="escalationForm.upperUnit">
                  <option>客服中心</option>
                  <option>质量管理委员会</option>
                </select></label
              >
              <label
                ><span>督办负责人</span
                ><select v-model="escalationForm.supervisor">
                  <option>王斌-60233</option>
                  <option>徐嘉敏-60233</option>
                </select></label
              >
              <label class="wide"
                ><span>督办目标</span><input v-model="escalationForm.target"
              /></label>
              <label
                ><span>下级重设任务时限</span
                ><input v-model="escalationForm.resetDeadline" type="datetime-local"
              /></label>
            </div>
          </div>
        </div>
      </section>
    </template>

    <section v-else class="workflow-card closure-card">
      <header class="workflow-card-header">
        <span class="workflow-card-mark"></span>
        <div>
          <strong>事件全过程</strong
          ><small>事件关闭后只读展示从生成、审核、响应到任务执行和关闭的完整记录</small>
        </div>
        <span class="closed-badge"><i class="ri-checkbox-circle-fill"></i>已关闭</span>
      </header>
      <div class="workflow-card-body">
        <dl class="closure-summary">
          <div>
            <dt>关闭结论</dt>
            <dd>处置任务全部完成，验证结果符合关闭要求</dd>
          </div>
          <div>
            <dt>关闭时间</dt>
            <dd>2025-10-12 16:40</dd>
          </div>
          <div>
            <dt>关闭人员</dt>
            <dd>李建秋-60318</dd>
          </div>
          <div>
            <dt>任务完成率</dt>
            <dd>100%（3/3）</dd>
          </div>
        </dl>
        <ol class="lifecycle-timeline full-lifecycle">
          <li v-for="record in lifecycleRecords" :key="record.stage" class="completed">
            <span class="lifecycle-node"><i :class="record.icon"></i></span>
            <div class="lifecycle-copy">
              <header>
                <strong>{{ record.stage }}</strong
                ><time>{{ record.time }}</time>
              </header>
              <p>{{ record.detail }}</p>
              <small>{{ record.actor }}</small>
            </div>
          </li>
        </ol>
      </div>
    </section>

    <section v-if="activeStage !== 'closed'" class="workflow-card record-card">
      <header class="workflow-card-header">
        <span class="workflow-card-mark"></span>
        <div>
          <strong>过程记录</strong><small>保留每次确认、驳回、修改、提醒、升级与任务状态变更</small>
        </div>
      </header>
      <div class="workflow-card-body">
        <ol class="lifecycle-timeline">
          <li
            v-for="(record, index) in visibleLifecycleRecords"
            :key="record.stage"
            :class="{ current: index === 0 }"
          >
            <span class="lifecycle-node"><i :class="record.icon"></i></span>
            <div class="lifecycle-copy">
              <header>
                <strong>{{ record.stage }}</strong
                ><time>{{ record.time }}</time>
              </header>
              <p>{{ record.detail }}</p>
              <small>{{ record.actor }}</small>
            </div>
          </li>
        </ol>
      </div>
    </section>

    <footer class="workflow-actions">
      <template v-if="activeStage === 'generation'">
        <button class="secondary" @click="saveDraft">保存生成记录</button>
        <button class="primary" @click="submitGeneration">提交事件审核</button>
      </template>
      <template v-else-if="activeStage === 'review'">
        <button class="secondary danger" @click="closeEvent">关闭事件</button>
        <button class="secondary" @click="saveDraft">保存草稿</button>
        <button class="primary" @click="submitReview">确认并下发</button>
      </template>
      <template v-else-if="activeStage === 'response'">
        <button
          v-if="responseForm.decision === 'adjust'"
          class="secondary danger"
          @click="submitAdjustment"
        >
          驳回并提交调整
        </button>
        <button class="secondary" @click="saveDraft">保存草稿</button>
        <button v-if="responseForm.decision === 'confirm'" class="primary" @click="submitResponse">
          确认响应并下发
        </button>
      </template>
      <template v-else-if="activeStage === 'handling'">
        <button class="secondary" @click="saveDraft">保存处理进度</button>
        <button class="primary" @click="submitHandling">
          {{ event.status === '待确认' ? '确认关闭' : '提交闭环' }}
        </button>
      </template>
      <button v-else class="primary" @click="emit('requestClose')">关闭详情</button>
    </footer>

    <Transition name="workflow-toast">
      <div v-if="toast" class="workflow-toast">
        <i class="ri-checkbox-circle-fill"></i>{{ toast }}
      </div>
    </Transition>
  </section>
</template>

<script setup lang="ts">
import type { TopicEvent } from '../topicEventData'

const props = defineProps<{ event: TopicEvent }>()
const emit = defineEmits<{
  advance: [eventId: string]
  reject: [eventId: string]
  closeEvent: [eventId: string]
  requestClose: []
}>()

type WorkflowStage = 'generation' | 'review' | 'response' | 'handling' | 'closed'
type ResponseDecision = 'confirm' | 'adjust'
type TaskStatus = '待处理' | '处理中' | '已完成'
type CollaborationAssignment = {
  id: number
  unit: string
  processor: string
}
type TopicTask = {
  id: string
  name: string
  unit: string
  owner: string
  deadline: string
  completedAt: string
  status: TaskStatus
}

const workflowStages: Array<{ key: WorkflowStage; label: string; role: string }> = [
  { key: 'generation', label: '事件生成', role: '系统生成' },
  { key: 'review', label: '事件审核', role: '审核人员' },
  { key: 'response', label: '业务响应', role: '业务责任人' },
  { key: 'handling', label: '闭环处理', role: '处理人员' },
  { key: 'closed', label: '事件关闭', role: '全过程' }
]
const unitOptions = ['客服中心', '质量保证部', '产品企划部', '售后服务部']
const businessOwnerOptions = [
  '杨琳-60114',
  '张伟-60018',
  '付俊杰-60018',
  '李秋-60018',
  '王芳-60233',
  '赵敏-60318',
  '周明-60520'
]
const processorOptions = ['赵敏-60318', '周明-60520', '王斌-60233']
const collaborationProcessorOptions = ['王斌-60233', '李秋-60018', '周明-60520']
const ownerCodeMap: Record<string, string> = {
  杨琳: '杨琳-60114',
  张伟: '张伟-60018',
  王芳: '王芳-60233',
  付俊杰: '付俊杰-60018',
  赵敏: '赵敏-60318',
  周明: '周明-60520'
}

const reviewForm = reactive({
  validity: 'valid' as 'valid' | 'invalid',
  primaryUnit: props.event.department,
  businessOwner: ownerCodeMap[props.event.owner] || props.event.owner,
  responseDeadline: toDateTimeLocal(props.event.deadline),
  comment: '课题证据充分，规则预填责任信息与当前业务边界一致，建议确认下发。'
})
const responseForm = reactive({
  decision: 'confirm' as ResponseDecision,
  primaryUnit: props.event.department,
  businessOwner: ownerCodeMap[props.event.owner] || props.event.owner,
  responseDeadline: toDateTimeLocal(props.event.deadline),
  plannedCompletionAt: '2025-10-15T18:00',
  processor: '赵敏-60318',
  collaborations: [] as CollaborationAssignment[],
  adjustmentReason: '',
  comment: '审核设定无异议，由主责单位牵头完成处置。'
})
let collaborationSequence = 0
const taskFormOpen = ref(false)
const taskEditingId = ref('')
const progressEditingId = ref('')
const taskDraft = reactive({
  name: '',
  unit: props.event.department,
  owner: '赵敏-60318',
  deadline: '2025-10-15T18:00'
})
const tasks = ref<TopicTask[]>([
  {
    id: 'TASK-001',
    name: '复现问题并锁定影响范围',
    unit: '质量保证部',
    owner: '赵敏-60318',
    deadline: '2025-10-10 18:00',
    completedAt: '2025-10-10 16:42',
    status: '已完成'
  },
  {
    id: 'TASK-002',
    name: '制定临时处置方案与用户沟通口径',
    unit: props.event.department,
    owner: '周明-60520',
    deadline: '2025-10-12 18:00',
    completedAt: '',
    status: '处理中'
  },
  {
    id: 'TASK-003',
    name: '验证修复效果并回收闭环证据',
    unit: '产品企划部',
    owner: '王斌-60233',
    deadline: '2025-10-15 18:00',
    completedAt: '',
    status: '待处理'
  }
])
const reminders = [
  { days: 7, channel: '站内信、飞书', status: '已配置' },
  { days: 3, channel: '站内信、飞书、短信', status: '已配置' },
  { days: 1, channel: '站内信、飞书、短信、电话', status: '已配置' }
]
const escalationForm = reactive({
  upperUnit: '客服中心',
  supervisor: '王斌-60233',
  target: '48 小时内完成根因确认，72 小时内形成可验证处置方案',
  resetDeadline: '2025-10-18T18:00'
})
const toast = ref('')

const lifecycleRecords = computed(() => [
  {
    stage: '事件生成',
    time: props.event.warningTime,
    actor: '规则引擎',
    detail: '聚合多渠道证据并按规则生成课题事件。',
    icon: 'ri-magic-line'
  },
  {
    stage: '审核确认并下发',
    time: '2025-10-07 14:20',
    actor: '审核人员 付俊杰-60018',
    detail: `确认课题有效，主责单位为${reviewForm.primaryUnit}，响应时限为${formatDateTime(
      reviewForm.responseDeadline
    )}。`,
    icon: 'ri-shield-check-line'
  },
  {
    stage: '业务响应确认',
    time: '2025-10-08 09:30',
    actor: `业务责任人 ${responseForm.businessOwner}`,
    detail: responseForm.collaborations.length
      ? `确认审核设定，指定${responseForm.processor}处理，计划完成时间为${formatDateTime(
          responseForm.plannedCompletionAt
        )}，协同单位为${responseForm.collaborations
          .map(assignment => assignment.unit)
          .join('、')}。`
      : `确认审核设定，指定${responseForm.processor}处理，计划完成时间为${formatDateTime(
          responseForm.plannedCompletionAt
        )}，无需协同单位。`,
    icon: 'ri-user-settings-line'
  },
  {
    stage: '闭环任务执行',
    time: '2025-10-09 10:15',
    actor: '主责单位与协同单位处理人员',
    detail: '创建 3 项课题任务，持续更新任务状态并执行临期提醒。',
    icon: 'ri-task-line'
  },
  {
    stage: '事件关闭',
    time: '2025-10-12 16:40',
    actor: '审核人员 李建秋-60318',
    detail: '任务全部完成，验证结果符合关闭要求，事件全过程归档。',
    icon: 'ri-checkbox-circle-line'
  }
])

const activeStageIndex = computed(() => {
  if (props.event.status === '声音洞察') return 0
  if (props.event.status === '预警审核') return 1
  if (props.event.status === '业务响应') return 2
  if (props.event.status === '闭环处理' || props.event.status === '待确认') return 3
  return 4
})
const activeStage = computed<WorkflowStage>(() => workflowStages[activeStageIndex.value].key)
const escalationTriggered = computed(() => props.event.status === '待确认')
const allTasksCompleted = computed(() => tasks.value.every(task => task.status === '已完成'))
const visibleLifecycleRecords = computed(() =>
  lifecycleRecords.value
    .slice(0, Math.min(activeStageIndex.value + 2, lifecycleRecords.value.length))
    .reverse()
)

watch(
  () => props.event.id,
  () => {
    reviewForm.primaryUnit = props.event.department
    reviewForm.businessOwner = ownerCodeMap[props.event.owner] || props.event.owner
    reviewForm.responseDeadline = toDateTimeLocal(props.event.deadline)
    responseForm.primaryUnit = props.event.department
    responseForm.businessOwner = ownerCodeMap[props.event.owner] || props.event.owner
    responseForm.responseDeadline = toDateTimeLocal(props.event.deadline)
    responseForm.plannedCompletionAt = '2025-10-15T18:00'
    responseForm.decision = 'confirm'
    responseForm.collaborations = []
    responseForm.comment = '审核设定无异议，由主责单位牵头完成处置。'
    taskFormOpen.value = false
    taskEditingId.value = ''
    progressEditingId.value = ''
  }
)

function toDateTimeLocal(value: string) {
  return value.replace(' ', 'T').slice(0, 16)
}
function formatDateTime(value: string) {
  return value.replace('T', ' ')
}
const showToast = (message: string) => {
  toast.value = message
  window.setTimeout(() => (toast.value = ''), 1800)
}
const saveDraft = () => showToast('当前阶段草稿已保存')
const submitGeneration = () => {
  emit('advance', props.event.id)
  showToast('事件已提交审核人员')
}
const submitReview = () => {
  if (!reviewForm.comment.trim()) return showToast('请填写审核意见')
  if (reviewForm.validity === 'invalid') return closeEvent()
  emit('advance', props.event.id)
  showToast('事件已确认并下发至业务责任人')
}
const closeEvent = () => {
  emit('closeEvent', props.event.id)
  showToast('事件已关闭并保留审核记录')
}
const submitAdjustment = () => {
  if (!responseForm.adjustmentReason.trim()) return showToast('请填写驳回及调整说明')
  reviewForm.primaryUnit = responseForm.primaryUnit
  reviewForm.businessOwner = responseForm.businessOwner
  reviewForm.responseDeadline = responseForm.responseDeadline
  reviewForm.comment = `业务责任人驳回调整建议：${responseForm.adjustmentReason}`
  emit('reject', props.event.id)
  showToast('课题已驳回审核人员二次确认')
}
const submitResponse = () => {
  if (!responseForm.processor) return showToast('请选择课题处理人员')
  if (!responseForm.plannedCompletionAt) return showToast('请设置课题计划完成时间')
  emit('advance', props.event.id)
  showToast('业务响应已确认并下发处理')
}
const availableUnitsForAssignment = (currentUnit: string) => {
  const selectedUnits = new Set(responseForm.collaborations.map(item => item.unit))
  return unitOptions.filter(
    unit => unit !== responseForm.primaryUnit && (unit === currentUnit || !selectedUnits.has(unit))
  )
}
const addCollaboration = () => {
  const selectedUnits = new Set(responseForm.collaborations.map(item => item.unit))
  const unit = unitOptions.find(
    option => option !== responseForm.primaryUnit && !selectedUnits.has(option)
  )
  if (!unit) return showToast('没有可继续添加的协同单位')
  responseForm.collaborations.push({
    id: ++collaborationSequence,
    unit,
    processor: collaborationProcessorOptions[0] || ''
  })
}
const removeCollaboration = (index: number) => {
  responseForm.collaborations.splice(index, 1)
}
const closeTaskForm = () => {
  taskFormOpen.value = false
  taskEditingId.value = ''
  taskDraft.name = ''
}
const openCreateTask = () => {
  if (taskFormOpen.value && !taskEditingId.value) return closeTaskForm()
  taskEditingId.value = ''
  taskDraft.name = ''
  taskDraft.unit = responseForm.primaryUnit
  taskDraft.owner = responseForm.processor
  taskDraft.deadline = responseForm.plannedCompletionAt
  taskFormOpen.value = true
}
const saveTask = () => {
  if (!taskDraft.name.trim()) return showToast('请输入任务名称')
  if (!taskDraft.deadline) return showToast('请设置任务计划完成时间')
  if (taskEditingId.value) {
    const task = tasks.value.find(item => item.id === taskEditingId.value)
    if (!task) return
    task.name = taskDraft.name.trim()
    task.unit = taskDraft.unit
    task.owner = taskDraft.owner
    task.deadline = formatDateTime(taskDraft.deadline)
    closeTaskForm()
    return showToast('任务已更新')
  }
  tasks.value.push({
    id: `TASK-${String(tasks.value.length + 1).padStart(3, '0')}`,
    name: taskDraft.name.trim(),
    unit: taskDraft.unit,
    owner: taskDraft.owner,
    deadline: formatDateTime(taskDraft.deadline),
    completedAt: '',
    status: '待处理'
  })
  closeTaskForm()
  showToast('课题任务已创建')
}
const startEditTask = (task: TopicTask) => {
  taskEditingId.value = task.id
  taskDraft.name = task.name
  taskDraft.unit = task.unit
  taskDraft.owner = task.owner
  taskDraft.deadline = toDateTimeLocal(task.deadline)
  taskFormOpen.value = true
}
const toggleProgressEditor = (taskId: string) => {
  progressEditingId.value = progressEditingId.value === taskId ? '' : taskId
}
const updateTaskStatus = (task: TopicTask, event: Event) => {
  const status = (event.target as HTMLSelectElement).value as TaskStatus
  task.status = status
  task.completedAt = status === '已完成' ? formatCurrentDateTime() : ''
  progressEditingId.value = ''
  showToast(status === '已完成' ? '任务已完成，实际完成时间已自动回填' : '任务进度已更新')
}
const deleteTask = (task: TopicTask) => {
  if (!window.confirm(`确认删除任务“${task.name}”吗？`)) return
  tasks.value = tasks.value.filter(item => item.id !== task.id)
  showToast('任务已删除')
}
const formatCurrentDateTime = () => {
  const now = new Date()
  const pad = (value: number) => String(value).padStart(2, '0')
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(
    now.getHours()
  )}:${pad(now.getMinutes())}`
}
const submitHandling = () => {
  if (props.event.status !== '待确认' && !allTasksCompleted.value) {
    return showToast('请先完成全部课题任务')
  }
  emit('advance', props.event.id)
  showToast(props.event.status === '待确认' ? '事件已确认关闭' : '闭环处理已提交')
}
</script>

<style lang="scss" scoped>
.workflow-panel {
  position: relative;
  display: grid;
  gap: 12px;
  padding-bottom: 72px;
  color: #253044;
}
.workflow-stage-card,
.workflow-card {
  border: 1px solid #dde4ee;
  border-radius: 6px;
  background: #fff;
  overflow: hidden;
}
.workflow-stage-header {
  min-height: 54px;
  padding: 10px 14px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #edf0f4;
  background: #fbfcfe;
}
.workflow-stage-header > div {
  display: flex;
  align-items: baseline;
  gap: 10px;
}
.workflow-stage-header span {
  color: #7b8798;
  font-size: 12px;
}
.workflow-stage-header strong {
  color: #273247;
  font-size: 15px;
}
.workflow-stage-count {
  padding: 3px 8px;
  border-radius: 3px;
  background: #fff0f2;
  color: #e4002b !important;
  font-weight: 600;
}
.workflow-stage-rail {
  position: relative;
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  padding: 16px 28px 14px;
}
.workflow-stage-rail::before {
  content: '';
  position: absolute;
  top: 30px;
  left: 10%;
  right: 10%;
  height: 2px;
  background: linear-gradient(
    to right,
    #159b8d 0%,
    #159b8d var(--stage-progress),
    #dfe5ee var(--stage-progress),
    #dfe5ee 100%
  );
}
.workflow-stage-item {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #8793a4;
  text-align: center;
}
.workflow-stage-node {
  display: grid;
  place-items: center;
  width: 28px;
  height: 28px;
  border: 2px solid #d5dce6;
  border-radius: 50%;
  background: #fff;
  color: #7d899a;
  font-size: 11px;
  font-weight: 600;
}
.workflow-stage-item > strong {
  margin-top: 7px;
  color: inherit;
  font-size: 12px;
}
.workflow-stage-item > small {
  margin-top: 2px;
  color: #9aa5b5;
  font-size: 10px;
}
.workflow-stage-item.done {
  color: #128b83;
}
.workflow-stage-item.done .workflow-stage-node {
  border-color: #159b8d;
  background: #159b8d;
  color: #fff;
}
.workflow-stage-item.active {
  color: #e4002b;
}
.workflow-stage-item.active .workflow-stage-node {
  border-color: #e4002b;
  background: #fff0f2;
  color: #e4002b;
  box-shadow: 0 0 0 4px #fff0f2;
}
.workflow-card-header {
  min-height: 56px;
  padding: 0 14px;
  display: flex;
  align-items: center;
  gap: 10px;
  border-bottom: 1px solid #edf0f4;
}
.workflow-card-mark {
  flex: none;
  width: 3px;
  height: 20px;
  border-radius: 2px;
  background: #e4002b;
}
.workflow-card-header > div {
  flex: 1;
  min-width: 0;
}
.workflow-card-header strong,
.workflow-card-header small {
  display: block;
}
.workflow-card-header strong {
  font-size: 14px;
  line-height: 20px;
}
.workflow-card-header small {
  color: #8a96a7;
  font-size: 11px;
  line-height: 16px;
}
.workflow-card-body {
  padding: 16px;
}
.split-header .outline-action {
  flex: none;
}
.role-banner {
  display: flex;
  align-items: center;
  gap: 9px;
  margin-bottom: 14px;
  padding: 10px 12px;
  border: 1px solid #d8e8ff;
  border-radius: 5px;
  background: #f4f8ff;
  color: #516079;
}
.role-banner > i {
  color: #1769e0;
  font-size: 20px;
}
.role-banner span {
  display: flex;
  gap: 10px;
  font-size: 12px;
}
.role-banner strong {
  color: #273247;
}
.workflow-form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px 16px;
}
.workflow-field {
  display: grid;
  grid-template-columns: 104px 1fr;
  gap: 10px;
  align-items: start;
  min-width: 0;
}
.workflow-field > span {
  padding-top: 9px;
  color: #58667a;
  font-size: 12px;
}
.workflow-field em,
.task-create-form em {
  color: #e4002b;
  font-style: normal;
}
.workflow-field select,
.workflow-field input,
.workflow-field textarea,
.task-create-form input,
.task-create-form select,
.escalation-grid input,
.escalation-grid select {
  width: 100%;
  min-width: 0;
  border: 1px solid #dbe1ea;
  border-radius: 4px;
  background: #fff;
  color: #354156;
  padding: 0 10px;
  outline: none;
  font-size: 12px;
}
.workflow-field select,
.workflow-field input,
.task-create-form input,
.task-create-form select,
.escalation-grid input,
.escalation-grid select {
  height: 36px;
}
.workflow-field input:disabled {
  background: #f5f7fa;
  color: #7b8798;
}
.workflow-field textarea {
  height: 88px;
  padding-top: 9px;
  resize: vertical;
}
.field-wide {
  grid-column: 1 / -1;
}
.textarea-field {
  position: relative;
}
.textarea-field > small {
  position: absolute;
  right: 10px;
  bottom: 7px;
  color: #a0aaba;
  font-size: 10px;
}
.segmented-control,
.binary-control {
  display: flex;
  min-height: 36px;
}
.segmented-control button,
.binary-control button {
  min-width: 96px;
  height: 36px;
  border: 1px solid #dbe1ea;
  background: #fff;
  color: #657287;
  font-size: 12px;
}
.segmented-control button:first-child,
.binary-control button:first-child {
  border-radius: 4px 0 0 4px;
}
.segmented-control button:last-child,
.binary-control button:last-child {
  border-radius: 0 4px 4px 0;
  margin-left: -1px;
}
.segmented-control button.active,
.binary-control button.active {
  position: relative;
  border-color: #1769e0;
  background: #edf5ff;
  color: #1769e0;
  font-weight: 600;
}
.segmented-control button i {
  margin-right: 5px;
}
.collaboration-field > span small {
  display: block;
  margin-top: 4px;
  color: #98a3b3;
  font-size: 10px;
  line-height: 1.4;
}
.collaboration-editor {
  display: grid;
  gap: 8px;
}
.collaboration-row {
  min-width: 0;
  min-height: 44px;
  padding: 6px 8px;
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr) 32px;
  align-items: center;
  gap: 8px;
  border: 1px solid #d8e8ff;
  border-radius: 4px;
  background: #f4f8ff;
}
.collaboration-row select {
  height: 32px;
  padding: 0 7px;
  background: #fff;
}
.remove-collaboration {
  width: 32px;
  height: 32px;
  border: 1px solid #dbe1ea;
  border-radius: 4px;
  background: #fff;
  color: #8b97a8;
}
.remove-collaboration:hover {
  border-color: #e4002b;
  color: #e4002b;
}
.collaboration-empty {
  min-height: 42px;
  padding: 0 12px;
  display: flex;
  align-items: center;
  border: 1px dashed #dbe1ea;
  border-radius: 4px;
  background: #fbfcfe;
  color: #a0aaba;
  font-size: 11px;
}
.add-collaboration {
  width: fit-content;
  height: 32px;
  padding: 0 12px;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  border: 1px solid #1769e0;
  border-radius: 4px;
  background: #fff;
  color: #1769e0;
  font-size: 11px;
}
.workflow-hint {
  margin: 14px 0 0 114px;
  display: flex;
  gap: 6px;
  color: #7b8798;
  font-size: 11px;
}
.workflow-hint i {
  color: #1769e0;
  font-size: 15px;
}
.review-setting-summary,
.handling-assignment-summary,
.closure-summary {
  margin: 0 0 16px;
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  border: 1px solid #e1e6ed;
  border-radius: 5px;
  overflow: hidden;
}
.review-setting-summary > div,
.handling-assignment-summary > div,
.closure-summary > div {
  padding: 10px 12px;
  border-right: 1px solid #edf0f4;
  background: #fbfcfe;
}
.review-setting-summary > div:last-child,
.handling-assignment-summary > div:last-child,
.closure-summary > div:last-child {
  border-right: 0;
}
.review-setting-summary dt,
.handling-assignment-summary dt,
.closure-summary dt {
  color: #8a96a7;
  font-size: 10px;
}
.review-setting-summary dd,
.handling-assignment-summary dd,
.closure-summary dd {
  margin: 4px 0 0;
  color: #344158;
  font-size: 12px;
  font-weight: 500;
}
.collaboration-summary-item {
  display: block;
}
.collaboration-summary-item + .collaboration-summary-item {
  margin-top: 3px;
}
.outline-action {
  height: 32px;
  padding: 0 11px;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  border: 1px solid #1769e0;
  border-radius: 4px;
  background: #fff;
  color: #1769e0;
  font-size: 12px;
}
.task-create-form {
  margin-bottom: 14px;
  padding: 12px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px 14px;
  border: 1px solid #d8e8ff;
  border-radius: 5px;
  background: #f7faff;
}
.task-form-title {
  grid-column: 1 / -1;
  color: #273247;
  font-size: 13px;
}
.task-create-form label {
  display: grid;
  grid-template-columns: 78px 1fr;
  align-items: center;
  gap: 8px;
}
.task-create-form label > span {
  color: #58667a;
  font-size: 11px;
}
.task-create-actions {
  grid-column: 1 / -1;
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}
.task-create-actions button {
  height: 30px;
  padding: 0 13px;
  border: 1px solid #d7dee8;
  border-radius: 4px;
  background: #fff;
  color: #526075;
  font-size: 11px;
}
.task-create-actions .primary-mini {
  border-color: #1769e0;
  background: #1769e0;
  color: #fff;
}
.task-table-wrap {
  overflow-x: auto;
}
.task-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 11px;
}
.task-table th {
  padding: 9px;
  background: #f4f6f9;
  color: #667388;
  text-align: left;
  font-weight: 500;
}
.task-table td {
  padding: 10px 9px;
  border-bottom: 1px solid #edf0f4;
  color: #526075;
  white-space: nowrap;
}
.task-table td:first-child {
  min-width: 220px;
  white-space: normal;
}
.task-table td strong,
.task-table td small {
  display: block;
}
.task-table td strong {
  color: #344158;
  font-weight: 500;
}
.task-table td small {
  margin-top: 2px;
  color: #9aa4b4;
  font-size: 9px;
}
.task-actions-cell select {
  height: 30px;
  border: 1px solid #dbe1ea;
  border-radius: 4px;
  background: #fff;
  color: #526075;
  font-size: 11px;
}
.reminder-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}
.reminder-grid article {
  min-height: 58px;
  padding: 9px 10px;
  display: flex;
  align-items: center;
  gap: 8px;
  border: 1px solid #e1e6ed;
  border-radius: 5px;
}
.reminder-grid article > i {
  color: #f26022;
  font-size: 20px;
}
.reminder-grid article > div {
  flex: 1;
}
.reminder-grid strong,
.reminder-grid small {
  display: block;
}
.reminder-grid strong {
  font-size: 11px;
}
.reminder-grid small {
  margin-top: 2px;
  color: #8a96a7;
  font-size: 9px;
}
.reminder-grid article > span {
  color: #159b8d;
  font-size: 10px;
}
.escalation-panel {
  margin-top: 12px;
  border: 1px solid #e1e6ed;
  border-radius: 5px;
  overflow: hidden;
}
.escalation-panel > header {
  min-height: 52px;
  padding: 9px 12px;
  display: flex;
  align-items: center;
  gap: 9px;
  background: #fbfcfe;
}
.escalation-panel > header > i {
  color: #8793a4;
  font-size: 21px;
}
.escalation-panel > header > div {
  flex: 1;
}
.escalation-panel > header strong,
.escalation-panel > header small {
  display: block;
}
.escalation-panel > header strong {
  font-size: 12px;
}
.escalation-panel > header small {
  margin-top: 2px;
  color: #8a96a7;
  font-size: 10px;
}
.escalation-panel > header > span {
  padding: 3px 7px;
  border-radius: 3px;
  background: #f0f2f5;
  color: #7b8798;
  font-size: 10px;
}
.escalation-panel.triggered {
  border-color: #ffc679;
}
.escalation-panel.triggered > header {
  background: #fff8eb;
}
.escalation-panel.triggered > header > i,
.escalation-panel.triggered > header > span {
  color: #d98300;
}
.escalation-grid {
  padding: 12px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px 14px;
  border-top: 1px solid #edf0f4;
}
.escalation-grid label {
  display: grid;
  grid-template-columns: 112px 1fr;
  align-items: center;
  gap: 8px;
}
.escalation-grid label > span {
  color: #58667a;
  font-size: 11px;
}
.escalation-grid .wide {
  grid-column: 1 / -1;
}
.closed-badge {
  margin-left: auto;
  padding: 4px 8px;
  border-radius: 4px;
  background: #e8f8f5;
  color: #118c80;
  font-size: 11px;
}
.closed-badge i {
  margin-right: 4px;
}
.closure-summary {
  grid-template-columns: 1.5fr 1fr 1fr 1fr;
}
.lifecycle-timeline {
  list-style: none;
  margin: 0;
  padding: 0;
}
.lifecycle-timeline li {
  display: grid;
  grid-template-columns: 30px 1fr;
  gap: 10px;
  position: relative;
  padding-bottom: 16px;
}
.lifecycle-timeline li::before {
  content: '';
  position: absolute;
  left: 14px;
  top: 28px;
  bottom: 0;
  width: 1px;
  background: #dfe5ee;
}
.lifecycle-timeline li:last-child {
  padding-bottom: 0;
}
.lifecycle-timeline li:last-child::before {
  display: none;
}
.lifecycle-node {
  position: relative;
  z-index: 1;
  display: grid;
  place-items: center;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: #edf4ff;
  color: #1769e0;
}
.lifecycle-timeline li.current .lifecycle-node {
  background: #fff0f2;
  color: #e4002b;
}
.lifecycle-timeline li.completed .lifecycle-node {
  background: #e8f8f5;
  color: #118c80;
}
.lifecycle-copy header {
  display: flex;
  justify-content: space-between;
  gap: 10px;
}
.lifecycle-copy strong {
  font-size: 12px;
}
.lifecycle-copy time {
  color: #8a96a7;
  font-size: 10px;
}
.lifecycle-copy p {
  margin: 3px 0;
  color: #526075;
  font-size: 11px;
  line-height: 1.6;
}
.lifecycle-copy small {
  color: #8a96a7;
  font-size: 10px;
}
.workflow-actions {
  position: fixed;
  right: 0;
  bottom: 0;
  z-index: 4;
  width: var(--topic-drawer-width);
  min-height: 66px;
  margin: 0;
  padding: 14px 18px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 9px;
  border-top: 1px solid #e1e6ed;
  background: rgba(255, 255, 255, 0.98);
}
.workflow-actions button {
  min-width: 112px;
  height: 36px;
  border-radius: 4px;
  font-size: 12px;
}
.workflow-actions .secondary {
  border: 1px solid #d7dee8;
  background: #fff;
  color: #526075;
}
.task-status-tag {
  display: inline-flex;
  min-width: 54px;
  height: 26px;
  padding: 0 8px;
  align-items: center;
  justify-content: center;
  border-radius: 3px;
  background: #f2f4f7;
  color: #667388;
}
.task-status-处理中 {
  background: #edf5ff;
  color: #1769e0;
}
.task-status-已完成 {
  background: #edf9f6;
  color: #11998a;
}
.task-actions-cell {
  min-width: 218px;
  white-space: normal !important;
}
.task-actions-cell button {
  margin-right: 9px;
  padding: 0;
  border: 0;
  background: transparent;
  color: #1769e0;
  font-size: 11px;
}
.task-actions-cell button.danger {
  color: #e4002b;
}
.task-actions-cell select {
  display: block;
  width: 104px;
  margin-top: 7px;
}
.workflow-actions .secondary.danger {
  border-color: #f1a0af;
  color: #c3002f;
}
.workflow-actions .primary {
  border: 1px solid #1769e0;
  background: #1769e0;
  color: #fff;
}
.workflow-toast {
  position: fixed;
  right: 34px;
  bottom: 82px;
  z-index: 1300;
  padding: 10px 14px;
  border-radius: 5px;
  background: #263246;
  color: #fff;
  font-size: 12px;
  box-shadow: 0 12px 30px rgba(15, 31, 58, 0.22);
}
.workflow-toast i {
  margin-right: 6px;
  color: #5bd4c7;
}
.workflow-toast-enter-active,
.workflow-toast-leave-active {
  transition: 0.2s ease;
}
.workflow-toast-enter-from,
.workflow-toast-leave-to {
  opacity: 0;
  transform: translateY(6px);
}
.generation-evidence {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1px;
  border: 1px solid #e1e6ed;
  border-radius: 5px;
  overflow: hidden;
  background: #e1e6ed;
}
.generation-evidence > div {
  padding: 12px;
  background: #fff;
}
.generation-evidence > div.wide {
  grid-column: 1 / -1;
}
.generation-evidence span,
.generation-evidence strong {
  display: block;
}
.generation-evidence span {
  color: #7b8798;
  font-size: 13px;
}
.generation-evidence strong {
  margin-top: 4px;
  color: #344158;
  font-size: 14px;
  line-height: 1.6;
  font-weight: 500;
}
.generation-hint {
  margin-left: 0;
}

/* 与课题详情抽屉统一的字号层级 */
.workflow-panel {
  font-size: 14px;
}
.workflow-stage-header span {
  font-size: 14px;
}
.workflow-stage-header strong {
  font-size: 18px;
}
.workflow-stage-node {
  font-size: 14px;
}
.workflow-stage-item > strong {
  font-size: 14px;
}
.workflow-stage-item > small {
  font-size: 13px;
}
.workflow-card-header strong {
  font-size: 17px;
}
.workflow-card-header small {
  font-size: 14px;
  line-height: 19px;
}
.role-banner span,
.workflow-field > span,
.workflow-field select,
.workflow-field input,
.workflow-field textarea,
.segmented-control button,
.binary-control button {
  font-size: 14px;
}
.workflow-hint,
.review-setting-summary dt,
.handling-assignment-summary dt,
.closure-summary dt,
.task-create-form label > span,
.escalation-grid label > span {
  font-size: 13px;
}
.review-setting-summary dd,
.handling-assignment-summary dd,
.closure-summary dd,
.task-create-form input,
.task-create-form select,
.escalation-grid input,
.escalation-grid select {
  font-size: 14px;
}
.outline-action,
.task-create-actions button,
.task-table,
.task-table th,
.task-table select,
.reminder-grid strong,
.reminder-grid article > span,
.escalation-panel > header strong,
.escalation-panel > header > span,
.closed-badge,
.lifecycle-copy strong,
.lifecycle-copy p,
.workflow-actions button,
.workflow-toast {
  font-size: 13px;
}
.task-table td small,
.reminder-grid small,
.escalation-panel > header small,
.lifecycle-copy time,
.lifecycle-copy small {
  font-size: 13px;
}
.workflow-actions button {
  font-size: 14px;
}
@media (max-width: 1100px) {
  .workflow-form-grid,
  .task-create-form,
  .escalation-grid {
    grid-template-columns: 1fr;
  }
  .field-wide,
  .task-create-actions,
  .escalation-grid .wide {
    grid-column: auto;
  }
  .review-setting-summary,
  .handling-assignment-summary,
  .closure-summary {
    grid-template-columns: 1fr 1fr;
  }
  .generation-evidence {
    grid-template-columns: 1fr;
  }
  .generation-evidence > div.wide {
    grid-column: auto;
  }
}
</style>
