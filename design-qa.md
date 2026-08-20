# 规则配置与分类管理 Design QA

- source visual truth path: `/Users/Qiu./.codex/generated_images/01a01811-87dd-77a3-9b6e-1da82fe70256/exec-5a3fbfbb-2475-4d74-a01d-716856636541.png`
- implementation screenshot path: `/tmp/voc-category-integrated-final-v2-1350x970.png`
- comparison image path: `/tmp/voc-category-design-qa-integrated-final-v2.png`
- viewport: `1350 x 970` CSS px
- source pixels: `1479 x 1063`, normalized to `1350 x 970`
- implementation pixels: `1350 x 970`
- density normalization: implementation screenshot pixels equal CSS viewport pixels; source scaled once to the same comparison size
- state: 分类管理选中、分类第 1 页、关注场景分析展开、规则配置菜单选中、日产品牌选中、用户菜单收起

## Full-view comparison evidence

The source and implementation were joined side by side in `/tmp/voc-category-design-qa-integrated-final.png` after viewport normalization. The implementation preserves the desktop shell, page spacing, restrained white/gray surface system, red selection accent, blue primary controls, compact table density, and right-aligned actions.

Later browser annotations intentionally supersede parts of the generated source:

- selected page tab uses the existing 24px page-title size;
- the category table contains 20 realistic rows with 10 rows per page;
- the sidebar groups four existing pages under `关注场景分析`;
- the three closure submenu dots are replaced by semantic Remix icons;
- brand labels are localized to `日产 / 启辰`;
- the header displays only the current-user trigger; logout is contained in its click dropdown.

## Focused region evidence

Separate crops were not required because the normalized comparison is 2700 x 970 and the header, sidebar, tabs, filters, table columns, rows, status marks, operations, note, and pagination remain readable. DOM checks additionally confirmed:

- selected tab computed size: `24px`; inactive tab: `16px`;
- sidebar icon classes: `ri-list-check-3`, `ri-bar-chart-grouped-line`, `ri-equalizer-3-line`;
- category pagination: 20 rows, 10 rows on page 1, 10 rows on page 2;
- header labels: `日产`, `启辰`, `日产VOC演示用户`, `退出登录`.
- topic management page heading: `课题管理` while the first-level menu remains `课题事件闭环`.

## Findings

No actionable P0, P1, or P2 fidelity issues remain.

- Fonts and typography: existing Inter/PingFang/Microsoft YaHei stack retained; selected page tab matches the 24px page-title hierarchy requested by annotation.
- Spacing and layout rhythm: tab, filter, table, note, and pagination align with the existing PC shell; 10 visible rows remove the earlier large blank area.
- Colors and visual tokens: existing Nissan red, action blue, neutral gray, and semantic status colors are preserved.
- Image quality and asset fidelity: no new raster assets were needed; existing product imagery remains untouched and all new UI symbols use the installed Remix Icon library.
- Copy and content: requested Chinese labels and 20 category records are present; linked-rule counts are computed from current rule data rather than copied from the mock design.
- Accessibility: tabs retain tablist/tab semantics, selected state, keyboard focus, labeled pagination controls, labeled form fields, and visible status text.

## Comparison history

1. Earlier comparison found a P2 large blank region in the four-row category panel. Fix: expand to 20 categories, show 10 rows per page, add two-page pagination, and keep the usage note in the footer. Post-fix evidence: `/tmp/voc-category-integrated-final-1350x970.png`.
2. Browser annotation required selected tabs to match other page-title sizing. Fix: selected tab set to `24px`; both selected states were measured in-browser.
3. Browser annotations required sidebar and header corrections. Fix: added semantic submenu icons, grouped four scene pages, localized brands, and added current-user UI. Post-fix DOM and screenshot checks passed.
4. Browser annotations required logout to move behind the avatar and the page heading to be `课题管理`. Fix: converted the user area to a click dropdown, kept `退出登录` as its only option, and corrected the page heading. The option opens and closes without console errors; logout itself was not executed.
5. Browser annotations required the rule list to expose `规则类型`, add `业务对象` after `事件等级`, and distinguish `数据范围`. Fix: removed the displayed rule number, reordered the business columns, mapped business objects to `objectScope`, and mapped data scope to configured `dimensions`. Post-fix evidence: `/tmp/voc-rule-list-final-fields.png`.
6. Browser annotation standardized `主责部门` to `主责单位` in the rule configuration module. Fix: updated the list header, responsibility field, section copy, notification option, validation copy, and initial mock values. Post-fix evidence: `/tmp/voc-rule-responsibility-unit.png`.

## Primary interactions tested

- 规则管理 ↔ 分类管理 tab switching.
- Category keyword filtering and reset, including automatic return to page 1.
- Category page 1 ↔ page 2 with 10 data rows on each page.
- Create category, edit category, disable category, and propagation to the rule editor category dropdown.
- Disabled categories remain visible historically and are excluded from new-rule options.
- All four `关注场景分析` child routes open successfully.
- User avatar/name click opens `退出登录`; clicking outside closes the dropdown.
- `/risk/warning` renders the page heading `课题管理`.
- Rule list headers and first-row values were checked in-browser; `业务对象=轩逸` and `数据范围=在线客服、App` are sourced independently.
- Console error/warning check returned no entries for the final integrated page.

The logout control was intentionally not clicked during browser QA to avoid clearing the active user session.

## Follow-up polish

- P3: production API persistence remains outside this frontend mock-data implementation.

final result: passed

## 课题事件处理流程补充验收

- 处理阶段统一为 `事件生成 → 事件审核 → 业务响应 → 闭环处理 → 事件关闭`，其中事件生成展示创建时间。
- 事件审核、驳回后二次审核、业务响应确认与调整、处理人及协同单位设置、任务创建与状态更新、7/3/1 日提醒、超期升级督办、关闭后全过程记录均已覆盖在对应阶段界面中。
- 详情字段与控件字号按主列表实际字号重新校准；浏览器实测主列表单元格约 `11px`，详情字段与控件约 `11.85px`，阶段标题维持更高层级。
- 抽屉内容滚动后，操作栏仍为 `position: fixed`；实测与抽屉左边、右边、底边及宽度差均为 `0px`，且正文预留底部空间，不遮挡过程记录。
- 全新页面加载后重新打开事件审核抽屉，控制台 error/warn 为 0。
