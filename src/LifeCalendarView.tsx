import { ItemView, WorkspaceLeaf } from "obsidian";
import MyLifePlugin from "../main";
import { VIEW_TYPE_CALENDAR } from "./Constants";
import React from "react";
import ReactDOM from "react-dom";
import { MyLifeElement } from "./ui/MyLifeElement";

export class MyLifeView extends ItemView {
  private readonly plugin: MyLifePlugin;

  constructor(leaf: WorkspaceLeaf, plugin: MyLifePlugin) {
    super(leaf);
    this.plugin = plugin;
  }

  getDisplayText(): string {
    return "Your Life In Weeks";
  }

  getViewType(): string {
    return VIEW_TYPE_CALENDAR;
  }

  getIcon(): string {
    return "skull";
  }

  async onOpen(): Promise<void> {
    const dom = this.contentEl;

    ReactDOM.render(<MyLifeElement plugin={this.plugin} />, dom);
  }
}
