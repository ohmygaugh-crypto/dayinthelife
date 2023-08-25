// CustomTooltip.tsx

import React from 'react';
// import { CustomTooltipComponent } from '@nivo/calendar';?

const CustomTooltip: React.FC<any> = (data) => {
    console.log(data);
    return (
        <div>
            <strong>{data.date}</strong>
            <br />
            {data.value} value
        </div>
    );
};

export default CustomTooltip;
