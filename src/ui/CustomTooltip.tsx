import React from 'react';

interface CustomTooltipProps {
    day: string;
    value: number | null;
    backlinks: number;
    tags: number;
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({ day, value, backlinks, tags }) => {
    return (
        <div style={{ padding: '12px', color: 'white', background: 'rgba(0, 0, 0, 0.8)' }}>
            <strong>{day}</strong>
            <br />
            {value ? `Word Count: ${value}` : 'No data'}
            <br />
            {`Backlinks: ${backlinks}`}
            <br />
            {`Tags: ${tags}`}
        </div>
    );
};

export default CustomTooltip;

