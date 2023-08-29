import { Calendar } from '@nivo/calendar'
import React from 'react';
import * as obsidian from 'obsidian';
//import CustomTooltip from './CustomTooltip';
import { generateCalendarData, openObsidianDailyNote } from './DailyNoteAnalyzer';

// Assuming you have Obsidian's types available, you might need to adjust types based on your setup.
declare const window: any;
// This is a placeholder function. You'll need to implement the actual logic to open a note in Obsidian.
const openObsidianDailyNote = (filename: string) => {
    // Get the current app instance
    const app = window.app;

    // Check if the note already exists in the vault
    const file = app.vault.getAbstractFileByPath(filename);

    // Create a new leaf (tab)
    const newLeaf = app.workspace.splitActiveLeaf();

    if (file instanceof obsidian.TFile) {
        // If the note exists, open it in the new leaf
        newLeaf.openFile(file);
    } else {
        // If the note doesn't exist, create it and then open it in the new leaf
        app.vault.create(filename, "").then((newFile) => {
            newLeaf.openFile(newFile);
        });
    }
};


export const MyResponsiveCalendarCanvas: React.FC = () => { 

 const handleDayClick = (day: any) => {
    console.log("Clicked on:", day.date); // Debug log
    // Format the date to YYYY-MM-DD
    const formattedDate = day.date.toISOString().split('T')[0];
    const dailyNoteFilename = `${formattedDate}.md`;
    // Navigate to the daily note in Obsidian
    openObsidianDailyNote(dailyNoteFilename);
    };

    const [calendarData, setCalendarData] = React.useState([]);

    React.useEffect(() => {
        async function fetchData() {
            const data = await generateCalendarData();
            setCalendarData(data);
        }
        fetchData();
    }, []);

    const settings = window.app.plugins.plugins["obsidian-life-in-weeks3"].settings;
    
    const currentYear = new Date().getFullYear();
    const birthYear = new Date(settings.DOB).getFullYear();
    let lifespan;
    const settingsGender = settings.gender; // Corrected this line

    switch(settingsGender) {
        case 'Male':
            lifespan = 76;
            break;
        case 'Female':
            lifespan = 81;
            break;
        case 'Other':
            lifespan = 78.5; // This is an example. Adjust based on your preferred average.
            break;
    }


    const from = `${birthYear}-01-01`;
    const to = `${birthYear + lifespan}-12-31`;

 // Adjust the Theme Based on System Theme
 const isDarkMode = window.app.workspace.appearance === "dark";
 const textColor = isDarkMode ? "#ffffff" : "#000000";

 const customTheme = {
     background: isDarkMode ? "#333333" : "#ffffff", // Example: Dark gray for dark mode, White for light mode
     text: {
         fontSize: 12,
         fill: textColor,
         outlineWidth: 3,
         outlineColor: isDarkMode ? "#333333" : "#000000", // Adjust as needed
     },
     // ... (continue adjusting other properties as needed)
 };

return (
    <Calendar
        data={calendarData}
        onClick={handleDayClick}
       // tooltip={CustomTooltip}
        from={from}
        to={to}
        emptyColor="#gggggg"
        colors={['#61cdbb', '#97e3d5', '#e8c1a0', '#f47560']}
        margin={{ top: 40, right: 40, bottom: 50, left: 40 }}
        direction="horizontal"
        yearSpacing={10}
        monthBorderColor="#ffffff"
        monthLegendOffset={0.1}
        dayBorderWidth={0.2}
        dayBorderColor="#ffffff"
        theme={customTheme}
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
    )
};










// export default MyResponsiveCalendarCanvas;
//I need to make the calendarData interactive. I want the data to track daily note taking/topical backlinks. Functionality here that is activated any time I click a timebox within the calendarcanvas it navigates into either the daily note or a new view within this canvas via a cool calendar related shrinking or expanding animation.

// https://nivo.rocks/storybook/iframe.html?viewMode=docs&id=timerange--docs&args=

//Also in the settings have a toggle for tragectory mock data. Portfolio return rate. Desired retirement age. Inflation calculator vs rate of return. What are you taking notes on to accomplish your dreams?

//Next steps are editing the data through the settings tab. DOB/Biology inserted should showcase how much time has elapsed as well as modify the range to reflect the average lifespan left