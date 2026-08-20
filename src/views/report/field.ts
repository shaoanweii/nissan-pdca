/**
 * private String id;
    private String reportName;

    private String clientId;

    @Schema(description = "报告类型")
    private String reportType;

    @Schema(description = "品牌名称")
    private String brandName;

    @Schema(description = "品牌code")
    private String brandCode;

    @Schema(description = "车系名称")
    private List<String> carSeriesName;

    @Schema(description = "车系Code")
    private List<String> carSeriesCode;

    @Schema(description = "渠道名称")
    private List<String> channelName;

    @Schema(description = "渠道Code")
    private List<String> channelCode;


    @Schema(description = "专营店名称")
    private List<String> dlrShortName;

    @Schema(description = "专营店Code")
    private List<String> dlrShortCode;

    @Schema(description = "标签类型 产品 服务 质量")
    private String labelTypeName;

    @Schema(description = "标签类型code 产品 服务 质量")
    private String labelTypeCode;


    @Schema(description = "标签名称集合")
    private List<String> labelNameList;

    @Schema(description = "标签Code")
    private List<String> labelCodeList;


    @Schema(description = "客户类型名称")
    private List<String> custTypeList;

    @Schema(description = "客户类型Code")
    private List<String> custCodeList;

    @Schema(description = "客户性别名称")
    private String gender;

    @Schema(description = "客户性别Code")
    private String genderCode;


    @Schema(description = "车主年龄")
    private List<String> age;

    @Schema(description = "车主年龄Code")
    private List<String> ageCode;


    @Schema(description = "车辆年龄")
    private List<String> vocAge;

    @Schema(description = "车辆年龄Code")
    private List<String> vocAgeCode;

    @NotBlank(message = "时间范围-开始时间不能为空")
    LocalDate startDate;
    @NotBlank(message = "时间范围-结束时间不能为空")
    LocalDate endDate;
 */
