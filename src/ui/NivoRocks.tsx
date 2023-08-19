// install (please try to align the version of installed @nivo packages)
// yarn add @nivo/calendar
import { ResponsiveCalendarCanvas } from '@nivo/calendar'

// make sure parent container have a defined height when using
// responsive component, otherwise height will be 0 and
// no chart will be rendered.
// website examples showcase many properties,
// you'll often use just a few of them.
const MyResponsiveCalendarCanvas = ({ data /* see data tab */ }) => (
    <ResponsiveCalendarCanvas
        data={data}
        from="2013-03-01"
        to="2019-07-12"
        emptyColor="#aa7942"
        colors={[ '#61cdbb', '#97e3d5', '#e8c1a0', '#f47560' ]}
        margin={{ top: 40, right: 40, bottom: 50, left: 40 }}
        direction="vertical"
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
        ]}
    />
)

export default MyResponsiveCalendarCanvas