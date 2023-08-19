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

const DEFAULT_SETTINGS: MyLifePluginSettings = {
  calendarMinutes: 25,
  shortBreakMinutes: 5,
  longBreakMinutes: 15,
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
