import React from "react";
import MyLifePlugin from "../../main";
import moment from "moment";
import { MyResponsiveCalendarCanvas }from "./NivoRocks";

enum Mode {
  ModeCalendar,
  ModeShortBreak,
  ModeLongBreak,
}

interface MyLifeElementProps {
  plugin: MyLifePlugin;
}

interface MyLifeElementState {
  mode: Mode;
  time: string;

  startedAt: Date;
  remainMilliSeconds: number;
}

export class MyLifeElement extends React.Component<
  MyLifeElementProps,
  MyLifeElementState
> {
  private intervalId: number;
  constructor(props: MyLifeElementProps) {
    super(props);
    this.state = {
      mode: Mode.ModeCalendar,
      time: MyLifeElement.getTimeString(
        this.props.plugin.settings.calendarMinutes * 60 * 1000
      ),
      startedAt: null,
      remainMilliSeconds:
        this.props.plugin.settings.calendarMinutes * 60 * 1000,
    };
  }

  componentWillUnmount(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  componentDidUpdate(
    prevProps: Readonly<MyLifeElementProps>,
    prevState: Readonly<MyLifeElementState>
  ): void {
    if (
      prevState.startedAt !== this.state.startedAt ||
      prevState.remainMilliSeconds !== this.state.remainMilliSeconds ||
      prevState.mode !== this.state.mode
    ) {
      this.updateTime();
    }
  }

  private onReset() {
    this.clearInterval();

    this.setState({
      startedAt: null,
      remainMilliSeconds: this.getRemainMilliSecondsByMode(this.state.mode),
    });
  }

  private onStartStop(): void {
    if (this.state.startedAt !== null) {
      const elapsed = Date.now() - this.state.startedAt.getTime();
      this.setState({
        startedAt: null,
        remainMilliSeconds: this.state.remainMilliSeconds - elapsed,
      });
      this.clearInterval();
    } else {
      this.setState({
        startedAt: new Date(),
      });
      this.createInterval();
    }
  }

//I WANT TO ADD DAILY NOTE TAKING/TOPICAL BACKLINK TIMESTAMP TRACKING FUNCTIONALITY HERE
  render(): JSX.Element {
    //I need to turn the below into a seperate file and import it back here neatly
    return (
        <>
        <div>
            <MyResponsiveCalendarCanvas />
        </div>
            <div className={"calendar-timer"}>
            <div className={"mode-switchers-container"}>
            <div
                className={
                "calendar " +
                (this.state.mode == Mode.ModeCalendar ? "enabled" : "")
                }
                onClick={this.switchToCalendar.bind(this)}
            >
                CalendarBINGBONG found in MyLifeElements.jsx
            </div>
            <div
                className={
                "short-break " +
                (this.state.mode == Mode.ModeShortBreak ? "enabled" : "")
                }
                onClick={this.switchToShortBreak.bind(this)}
            >
                Short BreakBINGBONG ound in MyLifeElements.jsx
            </div>
            <div
                className={
                "long-break " +
                (this.state.mode == Mode.ModeLongBreak ? "enabled" : "")
                }
                onClick={this.switchToLongBreak.bind(this)}
            >
                Long BreakBINGBONG ound in MyLifeElements.jsx
            </div>
            </div>
            <div
            className={
                "time " + (this.getElapsedMilliSeconds() < 0 ? "over" : "")
            }
            >
            {this.state.time}
            </div>
            <button onClick={this.onStartStop.bind(this)}>
            {this.state.startedAt !== null ? "Stop" : "Start"}
            </button>
            <button onClick={this.onReset.bind(this)}>▶|</button>
        </div>
        </>
        
      
    );
  }

  private updateTime(): void {
    const ms = this.getElapsedMilliSeconds();
    const str = MyLifeElement.getTimeString(ms);
    this.setState({
      time: str,
    });
  }

  private static getTimeString(elapsed: number): string {
    return moment.duration(elapsed).format("mm:ss", {
      trim: false,
    });
  }

  private getElapsedMilliSeconds(): number {
    const remains = this.state.remainMilliSeconds;
    if (this.state.startedAt != null) {
      const elapsed = Date.now() - this.state.startedAt.getTime();
      return remains - elapsed;
    } else {
      return remains;
    }
  }

  switchToCalendar(): void {
    this.switchMode(Mode.ModeCalendar);
  }

  switchToShortBreak(): void {
    this.switchMode(Mode.ModeShortBreak);
  }

  switchToLongBreak(): void {
    this.switchMode(Mode.ModeLongBreak);
  }

  private switchMode(mode: Mode) {
    if (this.state.mode !== mode) {
      this.setState({
        mode: mode,
        startedAt: null,
        remainMilliSeconds: this.getRemainMilliSecondsByMode(mode),
      });
    }
  }

  private createInterval(): void {
    if (this.intervalId != null) {
      window.clearInterval(this.intervalId);
    }

    this.intervalId = window.setInterval(() => {
      this.updateTime();
    }, 1000);
  }

  private clearInterval() {
    if (this.intervalId) {
      window.clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  private getRemainMilliSecondsByMode(mode: Mode): number {
    const plugin = this.props.plugin;
    switch (mode) {
      case Mode.ModeCalendar:
        return plugin.settings.calendarMinutes * 60 * 1000;
      case Mode.ModeShortBreak:
        return plugin.settings.shortBreakMinutes * 60 * 1000;
      case Mode.ModeLongBreak:
        return plugin.settings.longBreakMinutes * 60 * 1000;
    }
    throw Error(`Unknown mode: ${mode}`);
  }
}
