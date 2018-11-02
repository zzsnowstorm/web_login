module.exports = {
    "env": {
        "browser": true,
        "commonjs": true,
        "es6": true
    },
    "extends": "airbnb",
    "globals": {
        "$": true,
        "process": true,
        "__dirname": true
    },
    "parserOptions": {
        "ecmaFeatures": {
            "experimentalObjectRestSpread": true,
            "jsx": true
        },
        "sourceType": "module",
        "ecmaVersion": 7
    },
    "plugins": [
        "react",
        "jsx-a11y",
        "import",
    ],
    "rules": {
        "indent": [2, 4], //js缩进 
        "react/jsx-indent": [2, 4],//jsx缩进 
        "react/jsx-indent-props":  [2, 4], //验证JSX中的props缩进
        "react/jsx-wrap-multilines": 2, //将多行 JSX 标签写在 ()里
        "max-len": [1, 250, 2, {"ignoreComments": true}],//当单行代码长度大于200个字符时，检测会报错。
        "camelcase": 1,//强制使用骆驼拼写法命名约定
        "linebreak-style": 0, //强制使用一致的换行符风格
        "prefer-template": 0,//要求使用模板字面量而非字符串连接
        "no-unused-expressions": 0,//禁止出现未使用过的表达式
        "react/jsx-filename-extension": 0,//不允许在js文件中使用jsx语法
        "no-param-reassign": 0,//禁止对 function 的参数进行重新赋值
        "no-prototype-builtins": 0,//禁止直接调用 Object.prototypes 的内置属性
        "object-curly-newline": 0,//强制在花括号内使用一致的换行符
        "react/sort-comp": [1, {order:['everything-else','lifecycle','render',]}],//强制组件方法顺序
        "class-methods-use-this": 0,//强制类方法使用 this
        "array-callback-return": 0,//强制数组方法的回调函数中有 return 语句
        "no-underscore-dangle": 0,//禁止标识符中有悬空下划线
        "react/no-access-state-in-setstate": 2,//防止在this.setState中使用this.state
        "no-nested-ternary": 0,//禁用嵌套的三元表达式
        "jsx-quotes": [1, "prefer-single"], //强制在JSX属性（jsx-quotes）中一致使用 prefer-single单引号 prefer-double双引号
        "react/jsx-first-prop-new-line": 0, //jsx第一个属性换行
        "dot-notation": 0, //强制尽可能地使用点号"
        "react/jsx-max-props-per-line": [1, {"maximum": 5}], // 限制JSX中单行上的props的最大数量
        "react/jsx-closing-bracket-location": 0, //在JSX中验证右括号位置
        "react/jsx-closing-tag-location": 0,// 强制开始标签闭合标签位置
        "react/no-multi-comp": 0, //防止每个文件有多个组件定义
        "no-console": 0,//禁用 console
        "no-confusing-arrow": 0, //禁止在可能与比较操作符相混淆的地方使用箭头函数
        "import/no-extraneous-dependencies": 0,
        "react/no-unused-state": 0,
        "react/destructuring-assignment": 0,
        "react/no-did-update-set-state": 0,
        "react/prop-types": 0,
        "import/extensions": 0,
        "jsx-a11y/no-static-element-interactions": 0,
        "jsx-a11y/click-events-have-key-events": 0,
        "jsx-a11y/anchor-is-valid": 0,
        "react/jsx-one-expression-per-line": 0,

        "no-alert": 1,//禁用 alert、confirm 和 prompt
    }
}
