
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
  calendarMinutes: number;
  shortBreakMinutes: number;
  longBreakMinutes: number;
}
//THE SETTINGS IS WHERE YOU SHOULD INPUT YOUR DOB TO GET THE CORRECT AGE TIMEBLOCK CALUCLATIONS
const DEFAULT_SETTINGS: MyLifePluginSettings = {
  calendarMinutes: 25,
  shortBreakMinutes: 5,
  longBreakMinutes: 15,
};
//settings could also do net worth calculator based on age and income * average return rate across all assets excluding takehome pay(based2 things 1) on how much capital (% ofyou ) 2) of the capital you invested (rate of return %). back to back in this order(like an exponent) to reflect how much time you have left to achieve this financial goals based on what your circumstances are now. for the remaining weeks.
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
      .setName("Calendar duration minutes")
      .setDesc(`${this.plugin.settings.calendarMinutes} minutes`)
      .addSlider((text) =>
        text
          .setValue(this.plugin.settings.calendarMinutes)
          .onChange(async (value) => {
            this.plugin.settings.calendarMinutes = value;
            calendarSettings.setDesc(`${value} minutes`);
            await this.plugin.saveSettings();
          })
      );
    const shortBreakSettings = new Setting(containerEl)
      .setName("Short break minutes")
      .setDesc(`${this.plugin.settings.shortBreakMinutes} minutes`)
      .addSlider((text) =>
        text
          .setValue(this.plugin.settings.shortBreakMinutes)
          .onChange(async (value) => {
            this.plugin.settings.shortBreakMinutes = value;
            shortBreakSettings.setDesc(`${value} minutes`);
            await this.plugin.saveSettings();
          })
      );
    const longBreakSettings = new Setting(containerEl)
      .setName("Long break minutes")
      .setDesc(`${this.plugin.settings.longBreakMinutes} minutes`)
      .addSlider((text) =>
        text
          .setValue(this.plugin.settings.longBreakMinutes)
          .onChange(async (value) => {
            this.plugin.settings.longBreakMinutes = value;
            longBreakSettings.setDesc(`${value} minutes`);
            await this.plugin.saveSettings();
          })
      );
  }
}
