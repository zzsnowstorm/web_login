import React from 'react';

export default ({ iconPath, iconColor, iconSize = [25, 25], wrapperStyle = {}, onClick }) => {
    const width = wrapperStyle.width || iconSize[0];
    const height = wrapperStyle.height || iconSize[1];
    const iconWidth = iconSize instanceof Array ? iconSize[0] : iconSize;
    const lineHeight = wrapperStyle.lineHeight || ((height % 2 > 0) ? (height + 1) : height) + 'px';
    const icon = () => <i style={{ fontSize: iconWidth, color: iconColor, lineHeight }} className={'iconfont ' + iconPath} />;

    return (
        <div onClick={() => onClick && onClick()} style={{
            ...wrapperStyle,
            width, 
            height, 
            lineHeight,
            overflow: 'hidden',
            margin: wrapperStyle.margin || 'auto',
        }}>
            {icon()}
        </div>
    );
};