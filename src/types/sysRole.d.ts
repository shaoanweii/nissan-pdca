declare namespace SysRole {
  interface Entity {
    // 角色Id，在编辑时必须传递
    id?: string
    // 角色名称，不能为空
    roleName: string
    // 菜单Id列表，不能为空
    permissionIdList: string[]
    // 关联车系，以英文逗号分隔
    seriesIds?: string[]
    // 关联渠道ID，以英文逗号分隔
    channelIds?: string[]
    // 关联业务标签，以英文逗号分隔
    businessTagIds?: string[]
    // 关联质量标签，传code以后英文逗号(,)分隔
    qualityTagIds?: string[]
    // 关联区域ID，以英文逗号分隔
    areaIds?: string[]
    // 是否具有导出功能权限
    isExport: boolean
    // 是否具有下载功能权限
    isDownload: boolean
    // 是否有质量标签
    isQuality: boolean
    // 是否拥有所有权限
    allPermission: boolean
    // 品牌code
    brandCode?: string
    // 角色状态
    enabled?: number
  }

  interface QueryReq extends Common.Query {
    searchKeyword?: string
    brandCode?: string
  }
}

// roleModelList: []
// 角色名称、权限配置、备注、状态、放到数组里边
// @Schema(description = "角色Id编辑时必传")
// String id;

// @Schema(description = "客户ID不能为空")
// @NotBlank(message = "客户ID不能为空")
// String clientId;

// @Schema(description = "角色名称")
// @NotBlank(message = "角色名称不能为空")
// String roleName;
// @Schema(description = "菜单IdList")
// @NotEmpty(message = "菜单不能为空")
// List<String> permissionIdList;
// @Schema(description = "关联车系， 传code以后英文逗号(,)分隔")
// private List<String> seriesIds;

// @Schema(description = "关联渠道ID，以后英文逗号(,)分隔")
// private List<String> channelIds;

// @Schema(description = "关联业务标签，传code以后英文逗号(,)分隔")
// private List<String> businessTagIds;

// @Schema(description = "关联质量标签，传code以后英文逗号(,)分隔")
// private List<String> qualityTagIds;

// @Schema(description = "关联业务标签，传code以后英文逗号(,)分隔")
// private List<String> areaIds;

// @Schema(description = "功能权限：是否可以导出 true为是")
// private boolean isExport;

// @Schema(description = "功能权限：是否可以下载 true为是")
// private boolean isDownload;

// @Schema(description = "是否拥有所有权限 true:是")
// private boolean isAllPermission;

// @Schema(description = "品牌code")
// private String brandCode;

// @Schema(description = "角色状态")
// Integer enabled;
