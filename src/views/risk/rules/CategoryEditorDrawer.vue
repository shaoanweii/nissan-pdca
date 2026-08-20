<template>
  <Teleport to="body">
    <Transition name="rule-drawer">
      <div v-if="open" class="acro-category-drawer-layer" @click.self="emit('close')">
        <aside
          class="category-editor-drawer"
          role="dialog"
          aria-modal="true"
          aria-labelledby="category-editor-title"
        >
          <header class="drawer-header">
            <div>
              <h2 id="category-editor-title">{{ mode === 'create' ? '新建分类' : '编辑分类' }}</h2>
              <span>分类配置</span>
            </div>
            <button aria-label="关闭分类编辑抽屉" @click="emit('close')">
              <i class="ri-close-line"></i>
            </button>
          </header>

          <div class="drawer-scroll">
            <section class="category-form-section">
              <h3>分类信息</h3>
              <label class="category-field">
                <span>分类名称 <em>*</em></span>
                <input v-model.trim="form.name" maxlength="30" placeholder="请输入分类名称" />
                <small v-if="errors.name" class="field-error">{{ errors.name }}</small>
              </label>
              <label class="category-field textarea-field">
                <span>分类说明</span>
                <span class="textarea-wrap">
                  <textarea
                    v-model.trim="form.description"
                    maxlength="200"
                    placeholder="请输入分类说明"
                  ></textarea>
                  <small>{{ form.description.length }}/200</small>
                </span>
              </label>
              <div class="category-field">
                <span>分类状态</span>
                <div class="status-options">
                  <label><input v-model="form.status" type="radio" value="启用" />启用</label>
                  <label><input v-model="form.status" type="radio" value="停用" />停用</label>
                </div>
              </div>
              <p class="category-helper">
                <i class="ri-information-line"></i>
                分类停用后，历史规则仍保留显示，新建规则不可选择。
              </p>
            </section>
          </div>

          <footer class="drawer-footer">
            <button class="secondary" @click="emit('close')">取消</button>
            <button class="primary" @click="submit">保存分类</button>
          </footer>
        </aside>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { type CategoryMode, type RuleCategory } from './categoryData'

const props = defineProps<{
  open: boolean
  mode: CategoryMode
  category: RuleCategory | null
  categories: RuleCategory[]
}>()
const emit = defineEmits<{ close: []; save: [category: RuleCategory] }>()

const createEmptyCategory = (): RuleCategory => ({
  id: `RT${String(
    Math.max(
      ...props.categories
        .map(category => Number(category.id.replace(/\D/g, '')))
        .filter(Number.isFinite),
      0
    ) + 1
  ).padStart(3, '0')}`,
  name: '',
  description: '',
  order: Math.max(...props.categories.map(category => category.order), 0) + 1,
  status: '启用',
  updatedAt: '刚刚'
})
const form = reactive<RuleCategory>(createEmptyCategory())
const errors = reactive({ name: '' })

watch(
  () => [props.open, props.mode, props.category?.id, props.categories.length] as const,
  () => {
    if (!props.open) return
    Object.assign(form, props.category ? { ...props.category } : createEmptyCategory())
    Object.assign(errors, { name: '' })
  },
  { immediate: true }
)
watch(
  () => props.open,
  value => document.body.classList.toggle('rule-drawer-open', value),
  { immediate: true }
)
onBeforeUnmount(() => document.body.classList.remove('rule-drawer-open'))

const validate = () => {
  const normalizedName = form.name.trim()
  const duplicateName = props.categories.some(
    category => category.name === normalizedName && category.id !== props.category?.id
  )
  errors.name = !normalizedName ? '请输入分类名称' : duplicateName ? '分类名称已存在' : ''
  return !Object.values(errors).some(Boolean)
}
const submit = () => {
  if (!validate()) return
  emit('save', {
    ...form,
    name: form.name.trim(),
    description: form.description.trim(),
    updatedAt: '刚刚'
  })
}
</script>

<style lang="scss">
.acro-category-drawer-layer {
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
  .category-editor-drawer {
    display: flex;
    flex-direction: column;
    width: min(920px, 78vw);
    height: 100%;
    background: #f7f9fc;
    box-shadow: -16px 0 42px rgba(15, 31, 58, 0.18);
  }
  .drawer-header {
    min-height: 66px;
    padding: 0 22px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid #e1e6ed;
    background: #fff;
  }
  .drawer-header h2 {
    margin: 0;
    font-size: 18px;
  }
  .drawer-header span {
    display: block;
    margin-top: 3px;
    color: #8a96a7;
    font-size: 11px;
  }
  .drawer-header button {
    border: 0;
    background: transparent;
    color: #64748b;
    font-size: 22px;
  }
  .drawer-scroll {
    flex: 1;
    overflow-y: auto;
    padding: 14px 18px 88px;
  }
  .category-form-section {
    padding: 18px 20px 22px;
    border: 1px solid #dfe5ee;
    border-radius: 6px;
    background: #fff;
  }
  .category-form-section h3 {
    margin: 0 0 20px;
    padding-left: 10px;
    border-left: 3px solid #e4002b;
    font-size: 15px;
  }
  .category-field {
    display: grid;
    grid-template-columns: 88px 1fr;
    gap: 10px;
    align-items: start;
    margin-bottom: 18px;
  }
  .category-field > span:first-child {
    padding-top: 8px;
    color: #58667a;
    font-size: 12px;
  }
  .category-field em {
    color: #e4002b;
    font-style: normal;
  }
  .category-field input:not([type='radio']),
  .category-field textarea {
    width: 100%;
    border: 1px solid #dbe1ea;
    border-radius: 4px;
    background: #fff;
    color: #354156;
    font-size: 12px;
    outline: none;
  }
  .category-field input:not([type='radio']) {
    height: 36px;
    padding: 0 10px;
  }
  .category-field input:disabled {
    background: #f5f7fa;
    color: #8b96a6;
  }
  .textarea-wrap {
    position: relative;
  }
  .textarea-wrap textarea {
    min-height: 110px;
    padding: 10px 10px 26px;
    resize: vertical;
  }
  .textarea-wrap small {
    position: absolute;
    right: 10px;
    bottom: 9px;
    color: #9aa4b4;
    font-size: 11px;
  }
  .field-error {
    grid-column: 2;
    margin-top: -6px;
    color: #e4002b;
    font-size: 11px;
  }
  .status-options {
    min-height: 36px;
    display: flex;
    align-items: center;
    gap: 28px;
  }
  .status-options label {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    color: #526075;
    font-size: 12px;
  }
  .category-helper {
    margin: 2px 0 0 98px;
    display: flex;
    align-items: center;
    gap: 6px;
    color: #7b8798;
    font-size: 11px;
  }
  .category-helper i {
    color: #1769e0;
    font-size: 15px;
  }
  .drawer-footer {
    min-height: 66px;
    padding: 0 18px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 10px;
    border-top: 1px solid #e1e6ed;
    background: #fff;
  }
  .drawer-footer button {
    min-width: 108px;
    height: 36px;
    border-radius: 4px;
    font-size: 12px;
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
</style>
