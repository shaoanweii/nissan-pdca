<template>
  <Teleport to="body">
    <Transition name="topic-drawer">
      <div v-if="open && event" class="acro-topic-drawer-layer" @click.self="emit('close')">
        <aside class="topic-drawer" role="dialog" aria-modal="true" aria-labelledby="topic-title">
          <header class="drawer-header">
            <div class="drawer-heading">
              <h2 id="topic-title">{{ event.title }}</h2>
              <span :class="['priority', `priority-${event.priority.toLowerCase()}`]">{{
                event.priority
              }}</span>
              <span class="status-dot"></span>
              <span class="current-status">{{ currentStatusLabel }}</span>
            </div>
            <button class="icon-button" aria-label="关闭课题事件详情" @click="emit('close')">
              <i class="ri-close-line"></i>
            </button>
          </header>

          <div class="drawer-scroll">
            <section class="event-meta">
              <div class="meta-item meta-id">
                <label>课题编号</label><strong>{{ event.id }}</strong>
              </div>
              <div class="meta-item meta-warning-time">
                <label>预警时间</label><strong>{{ event.warningTime }}</strong>
              </div>
              <div class="meta-item meta-series">
                <label>涉及车系</label><strong>{{ event.series }}</strong>
              </div>
              <div class="meta-item meta-evidence">
                <label>证据条数</label><strong>{{ event.evidenceCount.toLocaleString() }}</strong>
              </div>
              <div class="meta-item meta-owner">
                <label>业务责任人</label><strong>{{ event.owner }}</strong>
              </div>
              <div class="meta-item meta-department">
                <label>主责单位</label><strong>{{ event.department }}</strong>
              </div>
              <div class="meta-item meta-deadline">
                <label>响应截止时间</label><strong class="deadline">{{ event.deadline }}</strong>
              </div>
              <div class="meta-item viewpoint-meta">
                <label>关联观点（{{ event.viewpoints.length }}）</label>
                <div class="viewpoint-list">
                  <span v-for="item in event.viewpoints" :key="item">{{ item }}</span>
                </div>
              </div>
            </section>

            <nav class="drawer-tabs" aria-label="课题事件详情导航">
              <button :class="{ active: tab === 'progress' }" @click="tab = 'progress'">
                事件处理
              </button>
              <button :class="{ active: tab === 'insight' }" @click="tab = 'insight'">
                事件洞察
              </button>
              <button :class="{ active: tab === 'voice' }" @click="tab = 'voice'">
                客户原声 <span>{{ event.voices.length }}</span>
              </button>
            </nav>

            <TopicInsightPanel v-if="tab === 'insight'" :event="event" />

            <section v-else-if="tab === 'voice'" class="tab-panel voice-panel">
              <div class="voice-toolbar">
                <div class="voice-filters">
                  <button :class="{ selected: voiceFilter === 'all' }" @click="voiceFilter = 'all'">
                    全部
                  </button>
                  <button
                    :class="{ selected: voiceFilter === 'negative' }"
                    @click="voiceFilter = 'negative'"
                  >
                    负面
                  </button>
                  <button
                    :class="{ selected: voiceFilter === 'high' }"
                    @click="voiceFilter = 'high'"
                  >
                    高相关
                  </button>
                </div>
                <div class="voice-search">
                  <i class="ri-search-line"></i
                  ><input v-model="voiceKeyword" placeholder="请输入关键词搜索" />
                </div>
              </div>
              <div class="voice-layout">
                <div class="voice-list">
                  <div v-if="!filteredVoices.length" class="voice-empty">暂无匹配原声</div>
                  <button
                    v-for="voice in filteredVoices"
                    :key="voice.id"
                    :class="['voice-card', { active: voice.id === selectedVoiceId }]"
                    @click="selectedVoiceId = voice.id"
                  >
                    <div class="voice-title">
                      <strong>{{ voice.title }}</strong
                      ><span :class="voice.sentiment">{{ voice.sentiment }}</span>
                    </div>
                    <p>{{ voice.content }}</p>
                    <div class="voice-tags">
                      <span v-for="tag in voice.tags" :key="tag">{{ tag }}</span>
                    </div>
                    <small>{{ voice.author }}　{{ voice.platform }}　{{ voice.time }}</small>
                  </button>
                </div>
                <article v-if="selectedVoice" class="voice-detail">
                  <div class="detail-title">
                    <div class="voice-avatar"><i class="ri-user-3-line"></i></div>
                    <div>
                      <strong>{{ selectedVoice.author }}</strong
                      ><small>{{ selectedVoice.platform }}　{{ selectedVoice.time }}</small>
                    </div>
                    <button
                      :class="['evidence-button', { added: evidenceIds.has(selectedVoice.id) }]"
                      @click="toggleEvidence(selectedVoice.id)"
                    >
                      <i
                        :class="evidenceIds.has(selectedVoice.id) ? 'ri-check-line' : 'ri-add-line'"
                      ></i>
                      {{ evidenceIds.has(selectedVoice.id) ? '已加入证据' : '加入课题证据' }}
                    </button>
                  </div>
                  <dl>
                    <div>
                      <dt>内容类型</dt>
                      <dd>用户主帖</dd>
                    </div>
                    <div>
                      <dt>原声 ID</dt>
                      <dd>{{ selectedVoice.id }}</dd>
                    </div>
                    <div>
                      <dt>内容标题</dt>
                      <dd>{{ selectedVoice.title }}</dd>
                    </div>
                    <div>
                      <dt>品牌车系</dt>
                      <dd>{{ event.brand }} · {{ event.series }}</dd>
                    </div>
                    <div>
                      <dt>识别观点</dt>
                      <dd class="voice-tags">
                        <span v-for="tag in selectedVoice.tags" :key="tag">{{ tag }}</span>
                      </dd>
                    </div>
                  </dl>
                  <h4>原声内容</h4>
                  <blockquote>{{ selectedVoice.content }}</blockquote>
                </article>
              </div>
            </section>

            <TopicProgressPanel
              v-else-if="tab === 'progress'"
              :event="event"
              @advance="emit('advance', $event)"
              @reject="emit('reject', $event)"
              @close-event="emit('closeEvent', $event)"
              @request-close="emit('close')"
            />

            <section v-else-if="false" class="tab-panel progress-panel">
              <section class="stage-card" aria-label="课题处理阶段">
                <header class="stage-header">
                  <div>
                    <span>课题处理阶段</span>
                    <strong>{{ progressSteps[activeStep] }}</strong>
                  </div>
                  <span class="stage-count"
                    >第 {{ activeStep + 1 }} / {{ progressSteps.length }} 阶段</span
                  >
                </header>
                <div
                  class="stage-rail"
                  :style="{
                    '--stage-progress': `${(activeStep / (progressSteps.length - 1)) * 100}%`
                  }"
                >
                  <div
                    v-for="(step, index) in progressSteps"
                    :key="step"
                    :class="[
                      'stage-item',
                      { done: index < activeStep, active: index === activeStep }
                    ]"
                  >
                    <span class="stage-node">
                      <i v-if="index < activeStep" class="ri-check-line"></i>
                      <template v-else>{{ index + 1 }}</template>
                    </span>
                    <strong>{{ step }}</strong>
                    <small>{{
                      index < activeStep ? '已完成' : index === activeStep ? '当前阶段' : '待处理'
                    }}</small>
                  </div>
                </div>
              </section>

              <div class="progress-layout">
                <section class="process-card review-card">
                  <header class="process-card-header">
                    <button
                      class="process-card-toggle"
                      type="button"
                      :aria-expanded="processSections.review"
                      aria-controls="review-card-body"
                      @click="toggleProcessSection('review')"
                    >
                      <span class="card-title-mark"></span>
                      <span class="card-title-copy">
                        <strong>{{ formTitle }}</strong>
                        <small>责任人、审核意见与处理决策</small>
                      </span>
                      <i
                        :class="
                          processSections.review ? 'ri-arrow-up-s-line' : 'ri-arrow-down-s-line'
                        "
                      ></i>
                    </button>
                  </header>
                  <div
                    v-show="processSections.review"
                    id="review-card-body"
                    class="process-card-body"
                  >
                    <div class="form-grid">
                      <label class="field">
                        <span>业务责任人 <em>*</em></span>
                        <select v-model="form.owner">
                          <option>付俊杰-60018</option>
                          <option>李秋-60018</option>
                          <option>王芳-60233</option>
                        </select>
                      </label>
                      <label class="field">
                        <span>响应时限 <em>*</em></span>
                        <input v-model="form.deadline" type="datetime-local" />
                      </label>
                      <label class="field field-wide">
                        <span>{{ activeStep <= 2 ? '审核意见' : '处理说明' }} <em>*</em></span>
                        <textarea
                          v-model="form.comment"
                          :placeholder="activeStep <= 2 ? '请输入审核意见' : '请输入处理说明'"
                          maxlength="200"
                        ></textarea>
                        <small>{{ form.comment.length }} / 200</small>
                      </label>
                      <div class="decision-grid field-wide">
                        <label v-for="item in decisions" :key="item.key">
                          <span>{{ item.label }} <em>*</em></span>
                          <div>
                            <button
                              :class="{ active: form[item.key] }"
                              @click="form[item.key] = true"
                            >
                              是</button
                            ><button
                              :class="{ active: !form[item.key] }"
                              @click="form[item.key] = false"
                            >
                              否
                            </button>
                          </div>
                        </label>
                      </div>
                      <div class="field field-wide upload-field">
                        <span>附件</span>
                        <button @click="attachmentAdded = true">
                          <i
                            :class="
                              attachmentAdded ? 'ri-checkbox-circle-fill' : 'ri-upload-cloud-2-line'
                            "
                          ></i>
                          {{ attachmentAdded ? '课题处理说明.pdf 已添加' : '点击添加处理附件' }}
                        </button>
                      </div>
                    </div>
                  </div>
                </section>

                <section class="process-card copy-card">
                  <header class="process-card-header">
                    <button
                      class="process-card-toggle"
                      type="button"
                      :aria-expanded="processSections.copy"
                      aria-controls="copy-card-body"
                      @click="toggleProcessSection('copy')"
                    >
                      <span class="card-title-mark"></span>
                      <span class="card-title-copy">
                        <strong>抄送人员</strong>
                        <small>{{ copyPeople.length }} 人</small>
                      </span>
                      <i
                        :class="
                          processSections.copy ? 'ri-arrow-up-s-line' : 'ri-arrow-down-s-line'
                        "
                      ></i>
                    </button>
                    <button class="add-copy-button" type="button" @click="handleAddCopyPerson">
                      <i class="ri-user-add-line"></i>
                      添加抄送人
                    </button>
                  </header>
                  <div
                    v-show="processSections.copy"
                    id="copy-card-body"
                    class="process-card-body copy-section"
                  >
                    <table>
                      <thead>
                        <tr>
                          <th>二级部门</th>
                          <th>三级部门</th>
                          <th>姓名</th>
                          <th>工号</th>
                          <th></th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="person in copyPeople" :key="person.id">
                          <td>{{ person.parent }}</td>
                          <td>{{ person.team }}</td>
                          <td>{{ person.name }}</td>
                          <td>{{ person.id }}</td>
                          <td>
                            <button aria-label="移除抄送人" @click="removeCopyPerson(person.id)">
                              <i class="ri-delete-bin-line"></i>
                            </button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </section>

                <section class="process-card operation-card">
                  <header class="process-card-header">
                    <button
                      class="process-card-toggle"
                      type="button"
                      :aria-expanded="processSections.operation"
                      aria-controls="operation-card-body"
                      @click="toggleProcessSection('operation')"
                    >
                      <span class="card-title-mark"></span>
                      <span class="card-title-copy">
                        <strong>操作记录</strong>
                        <small>{{ timeline.length }} 条记录</small>
                      </span>
                      <i
                        :class="
                          processSections.operation ? 'ri-arrow-up-s-line' : 'ri-arrow-down-s-line'
                        "
                      ></i>
                    </button>
                  </header>
                  <div
                    v-show="processSections.operation"
                    id="operation-card-body"
                    class="process-card-body operation-section"
                  >
                    <ol class="operation-timeline">
                      <li
                        v-for="(item, index) in timeline"
                        :key="`${item.time}-${index}`"
                        :class="{ current: index === 0 }"
                      >
                        <strong>{{ item.title }}</strong
                        ><time>{{ item.time }}</time>
                        <p>{{ item.detail }}</p>
                      </li>
                    </ol>
                  </div>
                </section>
              </div>
            </section>
          </div>

          <footer v-if="false" class="drawer-actions">
            <button class="secondary" @click="handleReject">驳回课题</button>
            <button class="secondary" @click="handleDraft">保存草稿</button>
            <button class="primary" @click="handleAdvance">{{ advanceLabel }}</button>
          </footer>

          <Transition name="toast">
            <div v-if="toast" class="topic-toast">
              <i class="ri-checkbox-circle-fill"></i>{{ toast }}
            </div>
          </Transition>
        </aside>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import type { TopicEvent } from '../topicEventData'
import TopicInsightPanel from './TopicInsightPanel.vue'
import TopicProgressPanel from './TopicProgressPanel.vue'

const props = defineProps<{
  open: boolean
  event: TopicEvent | null
  initialTab?: 'insight' | 'voice' | 'progress'
}>()

const emit = defineEmits<{
  close: []
  advance: [eventId: string]
  reject: [eventId: string]
  closeEvent: [eventId: string]
}>()

type DecisionKey = 'evidenceComplete' | 'topicValid' | 'responsibilityClear' | 'urgent'
type ProcessSectionKey = 'review' | 'copy' | 'operation'

const tab = ref<'insight' | 'voice' | 'progress'>('progress')
const processSections = reactive<Record<ProcessSectionKey, boolean>>({
  review: true,
  copy: false,
  operation: false
})
const voiceKeyword = ref('')
const voiceFilter = ref<'all' | 'negative' | 'high'>('all')
const selectedVoiceId = ref('')
const evidenceIds = ref(new Set<string>())
const attachmentAdded = ref(false)
const toast = ref('')
const copyPeople = ref([
  { parent: '客服中心', team: '客户创新及数据处', name: '徐嘉敏', id: '60233' },
  { parent: '变革与效率部', team: '数字化推进处', name: '王斌', id: '60233' }
])

const form = reactive<
  Record<DecisionKey, boolean> & { owner: string; deadline: string; comment: string }
>({
  owner: '付俊杰-60018',
  deadline: '2025-10-09T18:00',
  comment: '',
  evidenceComplete: true,
  topicValid: true,
  responsibilityClear: true,
  urgent: true
})

const decisions: Array<{ key: DecisionKey; label: string }> = [
  { key: 'evidenceComplete', label: '证据完整' },
  { key: 'topicValid', label: '课题有效' },
  { key: 'responsibilityClear', label: '责任明确' },
  { key: 'urgent', label: '需要加急' }
]

const progressSteps = ['声音洞察', '事件预警', '预警审核', '业务响应', '闭环处理', '事件关闭']
const timeline = ref([
  { title: '预警审核（当前）', time: '2025-10-07 14:20', detail: '付俊杰-60018 正在处理' },
  { title: '课题预警', time: '2025-10-07 13:55', detail: '系统完成课题预警' },
  { title: '系统生成课题', time: '2025-10-07 13:50', detail: '聚合多渠道声音，生成课题事件' }
])

const activeStep = computed(() => {
  if (!props.event) return 0
  if (props.event.status === '声音洞察') return 0
  if (props.event.status === '预警审核') return 2
  if (props.event.status === '业务响应') return 3
  if (props.event.status === '闭环处理' || props.event.status === '待确认') return 4
  return 5
})

const formTitle = computed(() => {
  if (activeStep.value <= 2) return '审核处理'
  if (activeStep.value === 3) return '业务响应'
  if (activeStep.value === 4) return '闭环处理'
  return '关闭确认'
})

const advanceLabel = computed(() => {
  if (!props.event) return '确认处理'
  if (props.event.status === '预警审核') return '通过审核'
  if (props.event.status === '业务响应') return '确认响应'
  if (props.event.status === '闭环处理') return '提交闭环'
  if (props.event.status === '待确认') return '确认关闭'
  if (props.event.status === '事件关闭') return '已完成'
  return '生成预警'
})

const filteredVoices = computed(() => {
  let voices = props.event?.voices || []
  if (voiceFilter.value === 'negative') {
    voices = voices.filter(voice => voice.sentiment === '负面')
  } else if (voiceFilter.value === 'high') {
    const viewpoints = new Set(props.event?.viewpoints || [])
    voices = voices.filter(voice => voice.selected || voice.tags.some(tag => viewpoints.has(tag)))
  }
  const keyword = voiceKeyword.value.trim()
  if (!keyword) return voices
  return voices.filter(voice =>
    `${voice.title}${voice.content}${voice.tags.join('')}`.includes(keyword)
  )
})

const selectedVoice = computed(() =>
  props.event?.voices.find(voice => voice.id === selectedVoiceId.value)
)
const currentStatusLabel = computed(() => {
  if (props.event?.status === '声音洞察') return '事件生成'
  if (props.event?.status === '预警审核') return '事件审核'
  if (props.event?.status === '待确认') return '闭环处理'
  return props.event?.status || ''
})

watch(
  () => [props.open, props.event?.id, props.initialTab] as const,
  () => {
    if (!props.open || !props.event) return
    tab.value = props.initialTab || 'progress'
    voiceFilter.value = 'all'
    voiceKeyword.value = ''
    selectedVoiceId.value = props.event.voices[0]?.id || ''
    evidenceIds.value = new Set(
      props.event.voices.filter(item => item.selected).map(item => item.id)
    )
    form.comment = ''
    attachmentAdded.value = false
    processSections.review = true
    processSections.copy = false
    processSections.operation = false
  },
  { immediate: true }
)

watch(filteredVoices, voices => {
  if (voices.some(voice => voice.id === selectedVoiceId.value)) return
  selectedVoiceId.value = voices[0]?.id || ''
})

watch(
  () => props.open,
  value => document.body.classList.toggle('topic-drawer-open', value),
  { immediate: true }
)

onBeforeUnmount(() => document.body.classList.remove('topic-drawer-open'))

const showToast = (message: string) => {
  toast.value = message
  window.setTimeout(() => (toast.value = ''), 1800)
}

const toggleEvidence = (id: string) => {
  const next = new Set(evidenceIds.value)
  next.has(id) ? next.delete(id) : next.add(id)
  evidenceIds.value = next
  showToast(next.has(id) ? '已加入课题证据' : '已移出课题证据')
}

const toggleProcessSection = (section: ProcessSectionKey) => {
  processSections[section] = !processSections[section]
}

const addCopyPerson = () => {
  if (copyPeople.value.some(item => item.id === '60318')) return showToast('该人员已在抄送列表')
  copyPeople.value.push({ parent: '质量保证部', team: '品质改善处', name: '赵敏', id: '60318' })
  showToast('已添加抄送人员')
}

const handleAddCopyPerson = () => {
  processSections.copy = true
  addCopyPerson()
}

const removeCopyPerson = (id: string) => {
  copyPeople.value = copyPeople.value.filter(item => item.id !== id)
}

const handleDraft = () => {
  timeline.value.unshift({
    title: `${formTitle.value}草稿`,
    time: '刚刚',
    detail: `${form.owner} 保存处理草稿`
  })
  showToast('草稿已保存')
}

const handleAdvance = () => {
  if (!props.event || props.event.status === '事件关闭') return showToast('该课题已完成闭环')
  if (!form.comment.trim()) return showToast('请先填写处理意见')
  emit('advance', props.event.id)
  timeline.value.unshift({
    title: advanceLabel.value,
    time: '刚刚',
    detail: `${form.owner} 完成提交`
  })
  showToast('课题已推进至下一阶段')
}

const handleReject = () => {
  if (!props.event) return
  emit('reject', props.event.id)
  showToast('课题已驳回至声音洞察')
}
</script>

<style lang="scss">
body.topic-drawer-open {
  overflow: hidden;
}

.acro-topic-drawer-layer {
  position: fixed;
  inset: 0;
  z-index: 1200;
  display: flex;
  justify-content: flex-end;
  background: rgba(16, 24, 40, 0.5);
  font-family: Inter, 'PingFang SC', 'Microsoft YaHei', sans-serif;
  font-size: 13px;
  color: #1d2635;

  * {
    box-sizing: border-box;
  }
  button,
  input,
  select,
  textarea {
    font: inherit;
  }
  button {
    cursor: pointer;
  }

  .topic-drawer {
    --topic-drawer-width: min(920px, 78vw);
    position: relative;
    display: flex;
    flex-direction: column;
    width: var(--topic-drawer-width);
    height: 100%;
    background: #fff;
    box-shadow: -16px 0 42px rgba(15, 31, 58, 0.16);
  }

  .drawer-header {
    min-height: 66px;
    padding: 0 24px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid #e5e9f0;
  }

  .drawer-heading {
    display: flex;
    align-items: center;
    gap: 12px;
    min-width: 0;
  }
  .drawer-heading h2 {
    margin: 0;
    font-size: 18px;
    line-height: 1.35;
    color: #182233;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .priority {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 28px;
    height: 20px;
    padding: 0 6px;
    border-radius: 3px;
    font-size: 12px;
    line-height: 18px;
    font-weight: 600;
  }
  .priority-高 {
    color: #e4002b;
    background: #fff0f2;
    border: 1px solid #ffbdc9;
  }
  .priority-中 {
    color: #e58b00;
    background: #fff7db;
  }
  .priority-低 {
    color: #168e82;
    background: #e7f8f5;
  }
  .status-dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: #e4002b;
  }
  .current-status {
    color: #4c586b;
    font-size: 12px;
  }
  .icon-button {
    border: 0;
    background: transparent;
    color: #64748b;
    font-size: 24px;
    padding: 6px;
  }
  .drawer-scroll {
    overflow-y: auto;
    scrollbar-gutter: stable;
    flex: 1;
    padding: 16px 22px;
    background: #fbfcfe;
  }

  .event-meta {
    display: grid;
    grid-template-columns: repeat(12, minmax(0, 1fr));
    border: 1px solid #e2e7ef;
    border-radius: 6px;
    padding: 0;
    background: #fff;
    gap: 0;
    overflow: hidden;
    box-shadow: 0 6px 18px rgba(23, 42, 72, 0.05);
  }
  .event-meta .meta-item {
    min-height: 68px;
    padding: 13px 16px;
    border-right: 1px solid #e9edf3;
    border-bottom: 1px solid #e9edf3;
    min-width: 0;
  }
  .event-meta .meta-id,
  .event-meta .meta-warning-time {
    grid-column: span 3;
  }
  .event-meta .meta-series {
    grid-column: span 4;
  }
  .event-meta .meta-evidence,
  .event-meta .meta-owner {
    grid-column: span 2;
  }
  .event-meta .meta-department,
  .event-meta .meta-deadline {
    grid-column: span 3;
  }
  .event-meta .viewpoint-meta {
    grid-column: span 4;
  }
  .event-meta .meta-evidence,
  .event-meta .viewpoint-meta {
    border-right: 0;
  }
  .event-meta .meta-owner,
  .event-meta .meta-department,
  .event-meta .meta-deadline,
  .event-meta .viewpoint-meta {
    border-bottom: 0;
  }
  .event-meta label {
    display: block;
    color: #7b8798;
    font-size: 12px;
    margin-bottom: 6px;
  }
  .event-meta strong {
    display: block;
    color: #253044;
    font-size: 13px;
    line-height: 1.5;
  }
  .event-meta .deadline {
    color: #f26022;
  }
  .viewpoint-list {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }
  .viewpoint-list span {
    padding: 2px 7px;
    background: #f4f6f9;
    border: 1px solid #dce2eb;
    border-radius: 4px;
    font-size: 11px;
    line-height: 18px;
    color: #4c586b;
  }

  .drawer-tabs {
    display: flex;
    gap: 30px;
    height: 52px;
    align-items: end;
    border-bottom: 1px solid #e2e7ef;
    padding-left: 10px;
    background: #fff;
  }
  .drawer-tabs button {
    position: relative;
    height: 52px;
    padding: 0 4px;
    border: 0;
    background: transparent;
    color: #4d596d;
    font-size: 14px;
    line-height: 20px;
    font-weight: 500;
  }
  .drawer-tabs button.active {
    color: #1769e0;
    font-weight: 600;
  }
  .drawer-tabs button.active::after {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    bottom: -1px;
    height: 3px;
    background: #1769e0;
  }
  .drawer-tabs button span {
    color: #e4002b;
    margin-left: 4px;
    font-size: 12px;
    font-weight: 600;
  }
  .tab-panel {
    padding-top: 16px;
  }

  .metric-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 12px;
    margin: 0 0 14px;
  }
  .metric {
    min-height: 86px;
    border: 1px solid #dfe5ee;
    border-radius: 6px;
    padding: 12px 14px;
    background: #fff;
  }
  .metric span,
  .metric small {
    display: block;
    color: #7b8798;
    font-size: 12px;
  }
  .metric strong {
    display: block;
    margin: 6px 0 4px;
    font-size: 23px;
  }
  .metric.negative {
    background: #fff8f9;
    border-color: #ffcbd4;
  }
  .metric.positive {
    background: #f4fffd;
    border-color: #bfeee7;
  }
  .metric.negative strong {
    color: #e4002b;
  }
  .metric.positive strong {
    color: #159b8d;
  }
  .panel-card {
    background: #fff;
    border: 1px solid #e0e6ef;
    border-radius: 6px;
    padding: 14px 16px;
  }
  .panel-card h3 {
    margin: 0 0 8px;
    font-size: 14px;
    color: #273247;
  }
  .insight-grid {
    display: grid;
    grid-template-columns: 1.3fr 1fr;
    gap: 14px;
    margin-top: 14px;
  }
  .voice-toolbar {
    display: flex;
    justify-content: space-between;
    gap: 14px;
    margin-bottom: 12px;
  }
  .voice-filters {
    display: flex;
    gap: 6px;
  }
  .voice-filters button {
    height: 34px;
    padding: 0 15px;
    border: 1px solid #d9dfe8;
    border-radius: 4px;
    background: #fff;
    color: #657287;
    font-size: 13px;
  }
  .voice-filters button.selected {
    color: #e4002b;
    border-color: #e4002b;
    background: #fff8f9;
  }
  .voice-search {
    display: flex;
    align-items: center;
    width: 240px;
    height: 34px;
    border: 1px solid #d9dfe8;
    border-radius: 4px;
    background: #fff;
    padding: 0 10px;
    gap: 6px;
  }
  .voice-search input {
    border: 0;
    outline: 0;
    width: 100%;
    font-size: 12px;
  }
  .voice-layout {
    display: grid;
    grid-template-columns: 0.95fr 1.15fr;
    min-height: 540px;
    border: 1px solid #e0e6ef;
    border-radius: 6px;
    overflow: hidden;
    background: #fff;
  }
  .voice-list {
    padding: 10px;
    border-right: 1px solid #e3e8f0;
    background: #fafbfd;
  }
  .voice-card {
    width: 100%;
    display: block;
    text-align: left;
    border: 1px solid #e1e6ee;
    background: #fff;
    border-radius: 5px;
    padding: 13px;
    margin-bottom: 9px;
    color: #283347;
  }
  .voice-card.active {
    border-color: #2d7ff0;
    box-shadow: 0 0 0 2px rgba(45, 127, 240, 0.08);
  }
  .voice-empty {
    min-height: 120px;
    display: grid;
    place-items: center;
    color: #9aa4b3;
    font-size: 12px;
  }
  .voice-title {
    display: flex;
    justify-content: space-between;
    gap: 10px;
  }
  .voice-title strong {
    font-size: 13px;
  }
  .voice-title span {
    font-size: 11px;
  }
  .voice-title .正面 {
    color: #119e90;
  }
  .voice-title .负面 {
    color: #e4002b;
  }
  .voice-title .中性 {
    color: #718099;
  }
  .voice-card p {
    margin: 7px 0;
    font-size: 12px;
    line-height: 1.6;
    color: #68758a;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  .voice-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 5px;
  }
  .voice-tags span {
    padding: 3px 6px;
    border-radius: 3px;
    color: #2378f7;
    background: #edf5ff;
    font-size: 10px;
  }
  .voice-card small {
    display: block;
    margin-top: 8px;
    color: #8a96a7;
    font-size: 10px;
  }
  .voice-detail {
    padding: 18px;
  }
  .detail-title {
    display: flex;
    align-items: center;
    gap: 10px;
    padding-bottom: 15px;
    border-bottom: 1px solid #edf0f4;
  }
  .voice-avatar {
    width: 38px;
    height: 38px;
    border-radius: 50%;
    background: #edf1f6;
    display: grid;
    place-items: center;
    color: #8a97aa;
    font-size: 21px;
  }
  .detail-title > div:nth-child(2) {
    flex: 1;
  }
  .detail-title strong,
  .detail-title small {
    display: block;
  }
  .detail-title strong {
    font-size: 14px;
  }
  .detail-title small {
    margin-top: 3px;
    color: #8793a4;
    font-size: 10px;
  }
  .evidence-button {
    height: 32px;
    border: 1px solid #e4002b;
    background: #fff;
    color: #e4002b;
    border-radius: 4px;
    padding: 0 10px;
    font-size: 12px;
    font-weight: 500;
  }
  .evidence-button.added {
    color: #159b8d;
    border-color: #159b8d;
    background: #f0fbfa;
  }
  .voice-detail dl {
    margin: 16px 0;
  }
  .voice-detail dl > div {
    display: grid;
    grid-template-columns: 78px 1fr;
    gap: 8px;
    padding: 6px 0;
    font-size: 12px;
  }
  .voice-detail dt {
    color: #8894a5;
  }
  .voice-detail dd {
    margin: 0;
    color: #3e4b60;
  }
  .voice-detail h4 {
    margin: 18px 0 9px;
    font-size: 13px;
  }
  .voice-detail blockquote {
    margin: 0;
    padding: 14px;
    border: 0;
    border-radius: 4px;
    background: #f6f9fe;
    color: #4c5a70;
    line-height: 1.8;
    font-size: 13px;
  }

  .stage-card {
    margin-bottom: 12px;
    border: 1px solid #dde4ee;
    border-radius: 6px;
    background: #fff;
    overflow: hidden;
  }
  .stage-header {
    min-height: 52px;
    padding: 10px 14px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid #edf0f4;
    background: #fbfcfe;
  }
  .stage-header > div {
    display: flex;
    align-items: baseline;
    gap: 10px;
  }
  .stage-header span {
    color: #7b8798;
    font-size: 12px;
  }
  .stage-header strong {
    color: #273247;
    font-size: 15px;
  }
  .stage-count {
    padding: 3px 8px;
    border-radius: 3px;
    background: #fff0f2;
    color: #e4002b !important;
    font-weight: 600;
  }
  .stage-rail {
    position: relative;
    display: grid;
    grid-template-columns: repeat(6, minmax(0, 1fr));
    padding: 15px 12px 13px;
  }
  .stage-rail::before {
    content: '';
    position: absolute;
    top: 29px;
    left: 9%;
    right: 9%;
    height: 2px;
    background: linear-gradient(
      to right,
      #159b8d 0%,
      #159b8d var(--stage-progress),
      #dfe5ee var(--stage-progress),
      #dfe5ee 100%
    );
  }
  .stage-item {
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    color: #8793a4;
    text-align: center;
  }
  .stage-node {
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
  .stage-item strong {
    margin-top: 7px;
    color: inherit;
    font-size: 11px;
    font-weight: 600;
  }
  .stage-item small {
    margin-top: 2px;
    color: #9aa5b5;
    font-size: 10px;
  }
  .stage-item.done {
    color: #128b83;
  }
  .stage-item.done .stage-node {
    border-color: #159b8d;
    background: #159b8d;
    color: #fff;
  }
  .stage-item.active {
    color: #e4002b;
  }
  .stage-item.active .stage-node {
    border-color: #e4002b;
    background: #fff0f2;
    color: #e4002b;
    box-shadow: 0 0 0 4px #fff0f2;
  }
  .stage-item.active small {
    color: #e4002b;
    font-weight: 600;
  }
  .progress-layout {
    display: grid;
    gap: 10px;
  }
  .process-card {
    border: 1px solid #e0e6ef;
    border-radius: 6px;
    background: #fff;
    overflow: hidden;
  }
  .process-card-header {
    display: flex;
    align-items: center;
    min-height: 52px;
    background: #fff;
  }
  .process-card-toggle {
    flex: 1;
    min-width: 0;
    min-height: 52px;
    padding: 0 14px;
    display: flex;
    align-items: center;
    gap: 10px;
    border: 0;
    background: transparent;
    color: #273247;
    text-align: left;
  }
  .process-card-toggle:hover {
    background: #fafbfd;
  }
  .card-title-mark {
    flex: none;
    width: 3px;
    height: 18px;
    border-radius: 2px;
    background: #e4002b;
  }
  .card-title-copy {
    flex: 1;
    min-width: 0;
  }
  .card-title-copy strong,
  .card-title-copy small {
    display: block;
  }
  .card-title-copy strong {
    font-size: 14px;
    line-height: 20px;
  }
  .card-title-copy small {
    margin-top: 1px;
    color: #8a96a7;
    font-size: 11px;
    line-height: 16px;
  }
  .process-card-toggle > i {
    flex: none;
    color: #7d899a;
    font-size: 18px;
  }
  .process-card-body {
    padding: 16px;
    border-top: 1px solid #edf0f4;
  }
  .add-copy-button {
    flex: none;
    height: 30px;
    margin-right: 14px;
    padding: 0 10px;
    display: inline-flex;
    align-items: center;
    gap: 5px;
    border: 1px solid #1769e0;
    background: #fff;
    border-radius: 4px;
    color: #1769e0;
    font-size: 12px;
    font-weight: 500;
  }
  .add-copy-button:hover {
    background: #f2f7ff;
  }
  .form-grid {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    gap: 14px;
  }
  .field {
    display: grid;
    grid-template-columns: 86px 1fr;
    gap: 10px;
    align-items: start;
    min-width: 0;
  }
  .field > span {
    padding-top: 9px;
    color: #58667a;
    font-size: 12px;
  }
  .field em,
  .decision-grid em {
    color: #e4002b;
    font-style: normal;
  }
  .field select,
  .field input,
  .field textarea {
    min-width: 0;
    width: 100%;
    border: 1px solid #dbe1ea;
    border-radius: 4px;
    background: #fff;
    color: #354156;
    padding: 0 10px;
    outline: none;
    font-size: 12px;
  }
  .field select,
  .field input {
    height: 36px;
  }
  .field textarea {
    height: 86px;
    padding-top: 10px;
    resize: none;
  }
  .field-wide {
    grid-column: 1 / -1;
    position: relative;
  }
  .field-wide > small {
    position: absolute;
    right: 10px;
    bottom: 7px;
    color: #a0aaba;
    font-size: 10px;
  }
  .decision-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1px;
    background: #e1e6ed;
    border: 1px solid #e1e6ed;
  }
  .decision-grid label {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: #fff;
    padding: 10px 12px;
    font-size: 12px;
    color: #5b687d;
  }
  .decision-grid button {
    border: 0;
    background: transparent;
    color: #8591a4;
    padding: 3px 8px;
    font-size: 12px;
  }
  .decision-grid button.active {
    color: #e4002b;
    font-weight: 600;
  }
  .upload-field button {
    height: 58px;
    border: 1px dashed #cfd7e3;
    background: #fbfcfe;
    border-radius: 4px;
    color: #718096;
    font-size: 13px;
  }
  .upload-field button i {
    margin-right: 5px;
  }
  .copy-section {
    margin: 0;
  }
  .copy-section table {
    width: 100%;
    border-collapse: collapse;
    font-size: 11px;
  }
  .copy-section th {
    text-align: left;
    background: #f4f6f9;
    color: #667388;
    font-weight: 500;
    padding: 9px;
  }
  .copy-section td {
    padding: 10px 9px;
    border-bottom: 1px solid #edf0f4;
    color: #526075;
  }
  .copy-section td button {
    border: 0;
    background: transparent;
    color: #e4002b;
  }
  .operation-section {
    margin: 0;
  }
  .operation-timeline {
    list-style: none;
    padding: 0 0 0 13px;
    margin: 0;
  }
  .operation-timeline li {
    position: relative;
    border-left: 1px solid #d8dee8;
    padding: 0 0 18px 15px;
  }
  .operation-timeline li::before {
    content: '';
    position: absolute;
    left: -5px;
    top: 2px;
    width: 9px;
    height: 9px;
    border-radius: 50%;
    border: 2px solid #fff;
    background: #97a2b2;
    box-shadow: 0 0 0 1px #97a2b2;
  }
  .operation-timeline li.current::before {
    background: #e4002b;
    box-shadow: 0 0 0 1px #e4002b;
  }
  .operation-timeline strong {
    display: block;
    font-size: 12px;
    color: #354156;
  }
  .operation-timeline time {
    display: block;
    color: #9aa4b4;
    font-size: 11px;
    margin: 3px 0;
  }
  .operation-timeline p {
    margin: 0;
    font-size: 12px;
    color: #7c8899;
  }

  .drawer-actions {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    height: 74px;
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 0 22px;
    border-top: 1px solid #e1e6ed;
    background: rgba(255, 255, 255, 0.98);
  }
  .drawer-actions button {
    height: 40px;
    border-radius: 4px;
    font-weight: 600;
    font-size: 14px;
  }
  .drawer-actions .secondary {
    flex: 1;
    border: 1px solid #d7dee8;
    background: #fff;
    color: #4f5c71;
  }
  .drawer-actions .primary {
    flex: 1.35;
    border: 1px solid #e4002b;
    background: #e4002b;
    color: #fff;
  }
  .topic-toast {
    position: absolute;
    left: 50%;
    bottom: 88px;
    transform: translateX(-50%);
    z-index: 5;
    display: flex;
    align-items: center;
    gap: 7px;
    padding: 10px 16px;
    border-radius: 6px;
    background: #273247;
    color: #fff;
    font-size: 13px;
    box-shadow: 0 8px 24px rgba(15, 29, 50, 0.24);
  }
  .topic-toast i {
    color: #42c7b7;
  }
}

.topic-drawer-enter-active,
.topic-drawer-leave-active {
  transition: opacity 0.22s ease;
}
.topic-drawer-enter-active .topic-drawer,
.topic-drawer-leave-active .topic-drawer {
  transition: transform 0.25s ease;
}
.topic-drawer-enter-from,
.topic-drawer-leave-to {
  opacity: 0;
}
.topic-drawer-enter-from .topic-drawer,
.topic-drawer-leave-to .topic-drawer {
  transform: translateX(100%);
}
.toast-enter-active,
.toast-leave-active {
  transition: opacity 0.18s ease, transform 0.18s ease;
}
.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translate(-50%, 8px);
}
</style>
