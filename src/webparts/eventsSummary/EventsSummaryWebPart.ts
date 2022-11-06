import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import * as strings from "EventsSummaryWebPartStrings";
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { DisplayMode } from "@microsoft/sp-core-library";
import { EventsSummary } from './components/EventsSummary';
import { IEventsSummaryProps } from './components/IEventsSummaryProps';
import { PropertyFieldNumber } from "@pnp/spfx-property-controls/lib/PropertyFieldNumber";
// Support for theme variants
import { ThemeProvider, ThemeChangedEventArgs, IReadonlyTheme, ISemanticColors } from '@microsoft/sp-component-base';
import { ICalendarEvent } from '../../shared/services/CalendarService';
import { SharePointCalendarService } from '../../shared/services/CalendarService/SharePointCalendarService';
import { sp } from '@pnp/sp';


export interface IEventsSummaryWebPartProps {
  eventPageUrl: string;
  maxEvents: number;
  eventList: string;
}

export default class EventsSummaryWebPart extends BaseClientSideWebPart<IEventsSummaryWebPartProps> {
  private _themeProvider: ThemeProvider;
  private _themeVariant: IReadonlyTheme | undefined;
  private services;
 

  protected onInit(): Promise<void> {

    sp.setup({
      spfxContext: this.context
    });
    // Consume the new ThemeProvider service
    this._themeProvider = this.context.serviceScope.consume(ThemeProvider.serviceKey);

    // If it exists, get the theme variant
    this._themeVariant = this._themeProvider.tryGetTheme();

    // Register a handler to be notified if the theme variant changes
    this._themeProvider.themeChangedEvent.add(this, this._handleThemeChangedEvent);
    return super.onInit();
  }

  public render(): void {
    const eventList = this.properties.eventList ? this.properties.eventList : "Event";
    this.services = new SharePointCalendarService(this.context, eventList,this.properties.eventPageUrl);
    const { clientWidth } = this.domElement;
    this.services.getEvents().then((events: ICalendarEvent[]) => {
      console.log(JSON.stringify(events));
      const element: React.ReactElement<IEventsSummaryProps> = React.createElement(
        EventsSummary,
        {
          displayMode: this.displayMode,
          context: this.context,
          maxEvents: this.properties.maxEvents,
          themeVariant: this._themeVariant,
          events: events,
          clientWidth: clientWidth
        }
      );

      ReactDom.render(element, this.domElement);
    });
  }
  private _handleThemeChangedEvent(args: ThemeChangedEventArgs): void {
    this._themeVariant = args.theme;
    this.render();
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {

          groups: [
            {
              groupFields: [
                PropertyPaneTextField('eventPageUrl', {
                  label: "Event Page Url"
                }),
                PropertyPaneTextField('eventList', {
                  label: "Event List"
                }),
                PropertyFieldNumber("maxEvents", {
                  key: "maxEventsFieldId",
                  label: strings.MaxEventsFieldLabel,
                  description: strings.MaxEventsFieldDescription,
                  value: 100,
                  minValue: 0,
                  disabled: false
                })
               
              ]
            }
          ]
        }
      ]
    };
  }
}


