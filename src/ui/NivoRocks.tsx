//YOU ACTUALLY DONT NEED THIS FILE RIGHT NOW, BUT I WANTED TO KEEP IT FOR FUTURE REFERENCE
// install (please try to align the version of installed @nivo packages)
// yarn add @nivo/calendar
import { Calendar } from '@nivo/calendar'
import { calendarData } from './exampledata'
import React from 'react';

// make sure parent container have a defined height when using
// responsive component, otherwise height will be 0 and
// no chart will be rendered.
// website examples showcase many properties,
// you'll often use just a few of them.
//I want to make this a interactive component. I want to add a daily note taking/topical backlink timestamp tracking functionality here that is activated any time I click a timebox within the calendarcanvas.
//make the from - to dates dynamic and interactive with the calendarData based on the current date and date of birth. have this entered in the settings.
export const MyResponsiveCalendarCanvas = () => ( // Corrected the function definition
    <Calendar
        data={calendarData}
        from="1996-01-01"
        to="2050-12-31"
        emptyColor="#gggggg"
        colors={['#61cdbb', '#97e3d5', '#e8c1a0', '#f47560']}
        margin={{ top: 40, right: 40, bottom: 50, left: 40 }}
        direction="horizontal"
        yearSpacing={10}
        monthBorderColor="#ffffff"
        dayBorderWidth={0}
        dayBorderColor="#ffffff"
        legends={[
            {
                anchor: 'bottom-right',
                direction: 'row',
                translateY: 36,
                itemCount: 4,
                itemWidth: 42,
                itemHeight: 36,
                itemsSpacing: 14,
                itemDirection: 'right-to-left'
            }
        ]} height={6400} width={800}    />
);

// export default MyResponsiveCalendarCanvas;
//I need to make the calendarData interactive. I want the data to track daily note taking/topical backlinks. Functionality here that is activated any time I click a timebox within the calendarcanvas it navigates into either the daily note or a new view within this canvas via a cool calendar related shrinking or expanding animation.

// https://nivo.rocks/storybook/iframe.html?viewMode=docs&id=timerange--docs&args=

//Also in the settings have a toggle for tragectory mock data. Portfolio return rate. Desired retirement age. Inflation calculator vs rate of return. What are you taking notes on to accomplish your dreams?

//Next steps are editing the data through the settings tab. DOB/Biology inserted should showcase how much time has elapsed as well as modify the range to reflect the average lifespan left