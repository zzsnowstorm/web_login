import React, {Component} from 'react';

export default ({ iconPath, iconColor, iconSize = [25, 25], wrapperStyle = {}, type, onClick })=> {
    const width = wrapperStyle.width || iconSize[0]
    const height = wrapperStyle.height || iconSize[1]
    const lineHeight = wrapperStyle.lineHeight || ((height % 2 > 0) ? (height + 1) : height) + 'px'
    let icon = () => {
        return <img src={iconPath} style={{
            width: iconSize[0],
            height: iconSize[1],
            // 奇淫巧技 利用drop-shadow 给icon上色
            // 经测试，Safari chrome均无问题，个别安卓设备无法支持过大纵轴偏移
            // 取巧的做法是外层div 设置 overflow:hidden 同时距离icon中心距离在 100px 以内
            transform: 'translateX(-' + width + 'px)',
            filter: 'drop-shadow(' + iconColor + ' ' + width + 'px 0)',
            WebkitFilter: 'drop-shadow(' + iconColor + ' ' + width + 'px 0)'
        }} />
    }

    return (
        <div onClick={() => onClick && onClick()} style={{
            ...wrapperStyle,
            width, height, lineHeight,
            overflow: 'hidden',
            margin: wrapperStyle.margin || 'auto',
        }}>
            {icon()}
        </div >
    )
}