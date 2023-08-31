import React from "react";
import MyLifePlugin from "../../main";
import { MyResponsiveCalendarCanvas } from "./NivoRocks";

interface MyLifeElementProps {
  plugin: MyLifePlugin;
}

export class MyLifeElement extends React.Component<MyLifeElementProps> {
  render(): JSX.Element {
    return (
      <>
        <div>
          <MyResponsiveCalendarCanvas />
        </div>
      </>
    );
  }
}