/*
多语言配置
key:[zh-CN,en-US,...]
*/
const intlMap = {
    dashboardCenter: ['资产概览', 'Dashboard'],
    monitorCenter: ['监控中心', 'Monitor'],
    alarmCenter: ['告警中心', 'Alarm Center'],
    configCenter: ['配置管理', 'Configuration'],

    // 名词
    id: ['ID', 'ID'],
    key: ['标识', 'Key'],
    link: ['链接', 'Link'],
    name: ['名称', 'Name'],
    type: ['类型', 'Type'],
    types: ['类型', 'Types'],
    index: ['索引', 'Index'],

    path: ['路径', 'Path'],
    icon: ['图标', 'Icon'],
    page: ['页面', 'Page'],
    component: ['组件', 'Component'],
    menu: ['菜单', 'Menu'],
    order: ['顺序', 'Order'],
    user: ['用户', 'User'],
    users: ['用户', 'Users'],
    admin: ['管理员', 'Admin'],
    container: ['容器', 'Container'],
    template: ['模型', 'Model'],
    templates: ['模型', 'Models'],
    device: ['设备', 'Device'],
    devices: ['个设备', 'Devices'],
    description: ['描述', 'Description'],
    site: ['场站', 'Site'],
    location: ['地理位置', 'Location'],
    status: ['状态', 'Status'],
    connection: ['通讯', 'Connection'],
    highLevel: ['上级', 'HighLevel'],
    userName: ['用户名', 'Username'],
    alias: ['别名', 'Alias'],
    email: ['邮箱', 'Email'],
    password: ['密码', 'password'],
    realtime: ['实时', 'Realtime'],
    history: ['历史', 'History'],
    data: ['数据', 'Data'],
    list: ['列表', 'List'],
    company: ['公司', 'Company'],
    phone: ['手机号', 'Phone Number'],
    contact: ['联系人', 'Contact'],
    point: ['测点', 'Point'],
    points: ['个测点', 'Points'],
    time: ['时间', 'Time'],
    relation: ['关系', 'relationship'],
    length: ['长度', 'Length'],
    info: ['信息', 'Information'],
    value: ['值', 'value'],
    customer: ['客户', 'customer'],
    custom: ['自定义', 'custom'],
    properties: ['属性', 'properties'],
    account: ['账号', 'Account'],
    result: ['结果', 'result'],
    mode: ['模式', 'mode'],
    curve: ['曲线', 'Curve'],
    table: ['表格', 'Table'],
    privilege: ['权限', 'privilege'],
    people: ['人', 'People'],
    level: ['等级', 'level'],
    tree: ['树', 'Tree'],
    creater: ['创建人', 'creater'],
    app: ['应用', 'Application'],
    media: ['多媒体', 'Media'],
    protocol: ['协议', 'Protocol'],
    distribution: ['分布', 'Distribution'],
    unit: ['单位', 'Unit'],
    center: ['中心', 'Center'],
    setting: ['设置', 'Setting'],
    overall: ['全局', 'Overall'],
    switch: ['开关', 'Switch'],
    range: ['范围', 'Range'],
    interval: ['间隔', 'Interval'],
    format: ['格式', 'Format'],
    decimal: ['小数位', 'Decimal'],
    mapping: ['映射', 'mapping'],
    style: ['样式', 'style'],
    chart: ['图形', 'Chart'],
    text: ['文本', 'Text'],
    instant: ['时刻', 'Instant'],
    rangeTime: ['时间段', 'time range'],
    frequency: ['频率', 'Frequency'],
    refresh: ['刷新', 'Refresh'],
    medias: ['多媒体', 'Medias'],

    configuration: ['配置信息', 'Configuration'],

    // 动词
    new: ['新建', 'New'],
    add: ['添加', 'Add'],
    show: ['展示', 'Show'],
    revise: ['修改', 'Edit'],
    start: ['开始', 'Start'],
    end: ['结束', 'End'],
    edit: ['编辑', 'Edit'],
    update: ['更新', 'Update'],
    reset: ['重置', 'Reset'],
    delete: ['删除', 'Delete'],
    select: ['选择', 'Select'],
    find: ['查询', 'Find'],
    set: ['设置', 'Set'],
    save: ['保存', 'Save'],
    cancel: ['取消', 'Cancel'],
    config: ['配置', 'Config'],
    fill: ['填写', 'Fill'],
    login: ['登录', 'Login'],
    apply: ['申请', 'Apply'],
    enter: ['进入', 'Enter'],
    control: ['控制', 'Control'],
    have: ['拥有', 'Have'],
    remember: ['记住', 'Remember'],
    aggregate: ['聚合', 'aggregate'],
    happen: ['发生', 'Happeed'],
    create: ['生成', 'Created'],
    access: ['接入', 'Access'],
    confirm: ['确认', 'Confirm'],
    alarm: ['告警', 'Alarm'],
    action: ['操作', 'Action'],
    send: ['发送', 'Send'],
    upload: ['上传', 'Upload'],
    download: ['下载', 'Download'],
    predict: ['预测', 'Predict'],
    remove: ['移除', 'Remove'],
    target: ['目标', 'Target'],
    run: ['运行', 'Running'],
    export: ['导出', 'Export'],
    import: ['导入', 'Import'],
    bind: ['关联', 'Binded'],
    monitor: ['监控', 'Monitor'],
    continue: ['持续', 'Continued'],
    open: ['开', 'Open'],
    close: ['关', 'Close'],
    swap: ['切换', 'Swap'],
    click: ['点击', 'Click'],
    submit: ['提交', 'Submit'],

    // 形容词/副词
    success: ['成功', 'Successful'],
    normal: ['正常', 'Normal'],
    fail: ['失败', 'Failed'],
    fault: ['故障', 'Fault'],
    all: ['全部', 'All'],
    error: ['错误', 'error'],
    some: ['部分', 'Some'],
    match: ['匹配', 'matched'],
    original: ['原始', 'Original'],
    most: ['最多', 'Most'],
    largeThan: ['大于', 'large than'],
    lessThan: ['小于', 'less than'],
    dynamic: ['动态', 'Dynamic'],
    common: ['普通', 'Common'],
    physical: ['物理', 'Physical'],
    visual: ['虚拟', 'Visual'],
    base: ['基本', 'Base'],
    more: ['更多', 'More'],
    personal: ['个人', 'Personal'],
    visible: ['可见', 'Visible'],
    hidden: ['隐藏', 'Hidden'],
    single: ['单', 'Single'],
    multiple: ['多', 'Multiple'],
    unknow: ['未知', 'Unknow'],
    important: ['重要', 'Important'],

    direct: ['直接', 'Direct'],

    // 代词
    this: ['该', 'this'],
    me: ['我', 'Me'],

    // 量词
    a: ['个', ''],
    class: ['种', ''],
    piece: ['件', 'Piece'],
    counts: ['次数', 'counts'],
    count: ['个数', 'count'],

    // 介词
    already: ['已', 'already'],
    please: ['请', 'Please'],
    yes: ['是', 'Yes'],
    noN: ['否', 'No'],
    no: ['未', 'Not'],
    non: ['无', 'No'],
    not: ['非', 'Not'],
    bu: ['不', 'Not'],
    empty: ['空', 'Empty'],
    cannot: ['不能', 'can not'],
    or: ['或', 'Or'],

    // 时间词
    minute: ['分钟', 'minute'],
    minutes: ['分钟', 'minutes'],
    hour: ['小时', 'hour'],
    hours: ['小时', 'hours'],
    day: ['天', 'day'],
    days: ['天', 'days'],
    now: ['当前', 'now'],
    today: ['今日', 'Today'],
    lastDay: ['昨日', 'LastDay'],
    thisMonth: ['当月', 'This month'],
    month: ['月', 'Month'],
    date: ['日期', 'Date'],

    // 专用词
    noConnection: ['无连接', 'Nonconnection'],
    alarmLight: ['光字牌', 'AlarmLight'],
    trendChart: ['趋势图', 'Trend Chart'],
    svg: ['组态画面', 'Configuration Pic'],
    sample: ['采样值', 'Sample'],
    max: ['最大值', 'Max'],
    min: ['最小值', 'Min'],
    mean: ['平均值', 'Mean'],
    sum: ['累加值', 'Sum'],
    spread: ['差值', 'Spread'],
    integral: ['积分值', 'Integral'],
    production: ['产量', 'Production'],
    oee: ['设备综合效率', 'OEE'],
    eff: ['能源效率', 'Efficiency'],
    evaluation: ['指标评估', 'Evaluation index'],
    unhealthy: ['亚健康', 'Unhealthy'],
    emergents: ['个紧急告警', 'Emergency Alarms'],
    emergent: ['紧急告警', 'Emergency Alarm'],
    alarmPoints: ['告警点', 'Alarm points'],
    longitude: ['经度', 'Longitude'],
    latitude: ['纬度', 'Latitude'],
    logout: ['登出', 'Logout'],
    string: ['字符串', 'String'],
    integer: ['整型', 'Int'],
    float: ['浮点型', 'Float'],
    user_group: ['用户组', 'User Group'],
    control_point: ['控制点', 'Control Point'],
    user_group_name: ['用户组名', 'Group Name'],
    user_group_alias: ['用户组别名', 'Group Alias'],
    site_node_count: ['场站节点数', 'Site Count'],
    page_node_count: ['菜单节点数', 'Menu Count'],
    chart_bar: ['柱状图', 'Bar'],
    chart_line: ['曲线图', 'Line'],
    chart_area: ['面积图', 'Area'],
    chart_pie: ['饼状图', 'Pie'],
    chart_radial: ['径向图', 'Radial Bar'],
    full_screen: ['全屏展示', 'Full Screen'],
    lonlat: ['经纬度', 'Lon & Lat'],

    device_manager_page: ['设备配置', 'Device Manager'],
    device_template_page: ['模型配置', 'Model Manager'],
    device_topology_page: ['设备拓扑', 'Device Topology'],
    user_manager_page: ['用户配置', 'User Manager'],
    alarm_config_page: ['告警配置', 'Alarm Manager'],
    alarm_history_page: ['历史告警', 'Alarm History'],
    trend_page: ['趋势分析', 'Trend Analysis'],
    machinelearning_page: ['智能分析', 'AI Analysis'],
    dashboard_page: ['资产概览', 'Dashboard'],
    siteMap_page: ['集控地图', 'Site Map'],
    sitemap_page: ['集控地图', 'Site Map'],
    navigation_page: ['导航页面', 'Navigation'],
    monitor_page: ['实时监控', 'Realtime Monitor'],
    analyse_page: ['报表分析', 'BI Reports'],
    config_site_auth: ['配置场站权限', 'Config Site Auth'],
    config_page_auth: ['配置页面权限', 'Config Page Auth'],
    auth_tag: ['权限标签', 'Auth Tag'],
    config_page: ['组态画面', 'Simulation'],

    cannot_delete_device: ['不能删除拥有子节点的设备', 'can not delete device which has child node'],
    cannot_delete_container: ['不能删除拥有子节点的菜单', 'can not delete menu which has child node'],
    customer_insert_device_only_one: ['该客户只能分配一个节点', 'The customer can only assign one node'],
    release_binding: ['正在解绑...', 'release binding..'],
    create_binding: ['正在绑定...', 'release binding..'],
    delete_success: ['删除成功', 'delete success'],
    insert_success: ['新增成功', 'insert success'],
    update_success: ['修改成功', 'update success'],
    register_success: ['注册成功', 'register success'],
    not_allow_value_repeat: ['不允许值重复', 'Not allow repeat value'],
    not_allow_empty_value: ['不允许有空值', 'Not allow empty value'],
    not_config: ['未配置', 'Not Config'],

    search_group_node: ['搜索用户组名称、别名、ID', 'Search group by name,alias,ID'],
    search_user_node: ['搜索用户名称、别名、ID', 'Search user by name,alias,ID'],
    search_customer_node: ['搜索客户名称、别名、ID', 'Search customer by name,alias,ID'],

    count_per_hour: ['件/小时', 'p/H'],
    counts_per_hour: ['个/小时', 'counts/H'],
    count_time: ['次', 'time'],
    this_hour: ['当前小时', 'This Hour'],
    near_hour: ['近一小时', 'Nearly Hour'],
    this_day: ['当天', 'Today'],
    near_day: ['近一天', 'Nearly Day'],
    this_month: ['当月', 'This Month'],
    near_month: ['近一月', 'Nearly Month'],

    parent_node: ['父节点', 'Parend Node'],
    root_node: ['根节点', 'Root'],
    is_top: ['是否根节点', 'Is Top'],

    page_layout_save_success: ['页面布局保存成功', 'page layout save success'],
    page_update_success: ['页面修改成功,正在刷新...', 'page update success! Refreshing..'],
    into_edit_scene: ['进入编辑模式...', 'into edit scene...'],
    quit_edit_scene: ['退出编辑模式...', 'quit edit scene...'],
    new_page: ['新建页面', 'New Page'],
    edit_page: ['修改页面', 'Edit Page'],
    updating: ['正在更新...', 'Updating...'],
    creating: ['正在新建...', 'Creating...'],

    scan_code_download: ['扫码直接下载', 'Download'],
};

const localeMap = {
    'zh-CN': 0,
    'en-US': 1,
};

export default function getString(param, locale) {
    let index = 0;
    if (locale == null) {
        locale = (window.store && window.store.locale) || window.localStorage.getItem('jowo_locale') || 'zh-CN';
    }
    if (localeMap.hasOwnProperty(locale)) {
        index = localeMap[locale];
    }
    const text = param.split('+').map(key => {
        let value = key;
        if (intlMap.hasOwnProperty(key) && intlMap[key].length >= index) {
            value = intlMap[key][index];
        }
        return value;
    }).join(index === 0 ? '' : ' ');
    return text;
}
