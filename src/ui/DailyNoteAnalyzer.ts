import { TFile } from 'obsidian';

export function isDailyNoteFormat(filename: string): boolean {
    return /^\d{4}-\d{2}-\d{2}$/.test(filename);
}

export async function analyzeNoteContent(file: TFile): Promise<{ wordCount: number, backlinkCount: number, tagCount: number }> {
    const content = await window.app.vault.read(file);
    
    // Word count
    const wordCount = content.split(/\s+/).length;

    // Backlink count
    const backlinkPattern = /\[\[([^\]]+)\]\]/g;
    const backlinks = content.match(backlinkPattern);
    const backlinkCount = backlinks ? backlinks.length : 0;

    // Tag count
    const tagPattern = /#[\w-]+/g;
    const tags = content.match(tagPattern);
    const tagCount = tags ? tags.length : 0;

    return {
        wordCount,
        backlinkCount,
        tagCount
    };
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
        const { wordCount, backlinkCount, tagCount } = await analyzeNoteContent(note);
        calendarData.push({
            day: note.basename,
            value: wordCount, // or any other metric you want to represent on the calendar
            backlinks: backlinkCount,
            tags: tagCount
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

