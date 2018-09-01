const APIV1 = '/api'
const APIV2 = '/api/v2'

module.exports = {
  mock: {
    menus: [
      {
        key: 'dashboard',
        name: "资产概览",
        menu: true,
        containers: []
      }, {
        key: 'monitor',
        name: "监控中心",
        menu: true,
        containers: []
      },
      {
        key: 'alarm',
        name: "告警中心",
        menu: true,
        containers: []
      },
      {
        key: 'config',
        name: "配置管理",
        menu: true,
        containers: []
      },
    ]
  }
}
