
import {
    App,
    Plugin,
    PluginSettingTab,
    Setting,
    WorkspaceLeaf,
  } from "obsidian";
  import { VIEW_TYPE_CALENDAR } from "./src/Constants";
  import { MyLifeView } from "./src/LifeCalendarView";
  
  import moment from "moment";
  import momentDurationFormatSetup from "moment-duration-format";
  
  momentDurationFormatSetup(moment);
  
  interface MyLifePluginSettings {
    calendarYears: number;
    gender: 'Male' | 'Female';
    netWorth: number;
}

const DEFAULT_SETTINGS: MyLifePluginSettings = {
    calendarYears: 60,
    gender: 'Male',
    netWorth: 0,
};

export default class MyLifePlugin extends Plugin {
    settings: MyLifePluginSettings;

    async onload(): Promise<void> {
        console.log("loading MyLifePlugin");

        await this.loadSettings();

        this.addSettingTab(new CalendarSettingTab(this.app, this));

        this.registerView(VIEW_TYPE_CALENDAR, (leaf: WorkspaceLeaf) => {
            return new MyLifeView(leaf, this);
        });

        this.addCommand({
            id: 'calendar-show-calendar-timer',
            name: "Show calendar timer",
            mobileOnly: false,
            callback: this.onShow.bind(this)
        });

        this.app.workspace.onLayoutReady(this.initLeaf.bind(this));
    }

    onShow(): void {
        this.initLeaf();
    }

    onunload(): void {
        console.log("unloading MyLifePlugin");
    }

    initLeaf(): void {
        if (this.app.workspace.getLeavesOfType(VIEW_TYPE_CALENDAR).length) {
            return;
        }
        this.app.workspace.getRightLeaf(false).setViewState({
            type: VIEW_TYPE_CALENDAR,
        });
    }

    async loadSettings(): Promise<void> {
        this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
    }

    async saveSettings(): Promise<void> {
        await this.saveData(this.settings);
    }
}

class CalendarSettingTab extends PluginSettingTab {
    plugin: MyLifePlugin;

    constructor(app: App, plugin: MyLifePlugin) {
        super(app, plugin);
        this.plugin = plugin;
    }

    display(): void {
        const { containerEl } = this;

        containerEl.empty();

        const calendarSettings = new Setting(containerEl)
            .setName("Calendar years")
            .setDesc(`${this.plugin.settings.calendarYears} years`)
            .addSlider((text) =>
                text
                    .setValue(this.plugin.settings.calendarYears)
                    .onChange(async (value) => {
                        this.plugin.settings.calendarYears = value;
                        calendarSettings.setDesc(`${value} years`);
                        await this.plugin.saveSettings();
                    })
            );

        const genderSettings = new Setting(containerEl)
            .setName("Gender")
            .setDesc(this.plugin.settings.gender)
            .addDropdown((dropdown) => 
                dropdown
                    .addOption('Male', 'Male')
                    .addOption('Female', 'Female')
                    .setValue(this.plugin.settings.gender)
                    .onChange(async (value) => {
                        this.plugin.settings.gender = value as 'Male' | 'Female';
                        genderSettings.setDesc(value);
                        await this.plugin.saveSettings();
                    })
            );

        const netWorthSettings = new Setting(containerEl)
            .setName("Net Worth")
            .setDesc(`$${this.plugin.settings.netWorth}`)
            .addText((text) => 
                text
                    .setValue(this.plugin.settings.netWorth.toString())
                    .onChange(async (value) => {
                        this.plugin.settings.netWorth = parseInt(value);
                        netWorthSettings.setDesc(`$${value}`);
                        await this.plugin.saveSettings();
                    })
            );
    }
}
