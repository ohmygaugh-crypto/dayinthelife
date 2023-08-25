import { TFile } from 'obsidian';

export function isDailyNoteFormat(filename: string): boolean {
    return /^\d{4}-\d{2}-\d{2}$/.test(filename);
}

export async function analyzeNoteContent(file: TFile): Promise<number> {
    const content = await window.app.vault.read(file);
    // For simplicity, let's just return the word count for now
    // You can expand this to analyze other aspects of the content
    return content.split(/\s+/).length;
}

export async function generateCalendarData(): Promise<any[]> {
    const dailyNotes: TFile[] = [];
    const allFiles = window.app.vault.getFiles();

    for (const file of allFiles) {
        if (isDailyNoteFormat(file.basename)) {
            dailyNotes.push(file);
        }
    }

    const calendarData = [];
    for (const note of dailyNotes) {
        const value = await analyzeNoteContent(note);
        calendarData.push({
            day: note.basename,
            value: value
        });
    }

    return calendarData;
}

export function openObsidianDailyNote(filename: string) {
    const app = window.app;
    const file = app.vault.getAbstractFileByPath(filename);

    if (file instanceof TFile) {
        app.workspace.activeLeaf.openFile(file);
    } else {
        app.vault.create(filename, "").then((newFile) => {
            app.workspace.activeLeaf.openFile(newFile);
        });
    }
}
