import { TFile } from 'obsidian';

export function isDailyNoteFormat(filename: string): boolean {
    return /^\d{4}-\d{2}-\d{2}$/.test(filename);
}

export async function analyzeNoteContent(file: TFile): Promise<{ wordCount: number, backlinks: number, tags: number, hyperlinks: number }> {
    const content = await window.app.vault.read(file);
    const wordCount = content.split(/\s+/).length;
    const backlinks = (content.match(/\[\[[^\]]+\]\]/g) || []).length;
    const tags = (content.match(/#[^\s#]+/g) || []).length;
    const hyperlinks = (content.match(/https?:\/\/[^\s]+/g) || []).length;
    return { wordCount, backlinks, tags, hyperlinks };
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
        const { wordCount, backlinks, tags, hyperlinks } = await analyzeNoteContent(note);
        calendarData.push({
            day: note.basename,
            value: wordCount,
            backlinks: backlinks,
            tags: tags,
            hyperlinks: hyperlinks
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
