import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { IReadonlyTheme } from '@microsoft/sp-component-base';

import * as strings from 'EventDetailWebPartStrings';
import { EventDetail } from './components/EventDetail';
import { IEventDetailProps } from './components/IEventDetailProps';
import { sp } from '@pnp/sp';
import { SharePointCalendarService } from '../../shared/services/CalendarService/SharePointCalendarService';
import { ICalendarEvent } from '../../shared/services/CalendarService';



export interface IEventDetailWebPartProps {
  eventList: string;
  itemId: number;
  level1Text: string;
  level2Text: string;
  level3Text: string;
  level1Link: string;
  level2Link: string;
  level3Link: string;
  defaultImageUrl: string;
  width: string;
  height: string;
}

export default class EventDetailWebPart extends BaseClientSideWebPart<IEventDetailWebPartProps> {
  private services;
  protected onInit(): Promise<void> {
    sp.setup({
      spfxContext: this.context
    });
    return super.onInit();
  }

  public render(): void {
    const urlParams = new URLSearchParams(window.location.search);
    console.log(urlParams);
    console.log(urlParams.get("EVENTID"));
    let itemid = this.properties.itemId ? this.properties.itemId : 2;
    if (urlParams.get("EVENTID")) {
      itemid = Number(urlParams.get("EVENTID"));
    }
    const eventList = this.properties.eventList ? this.properties.eventList : "Event";
    this.services = new SharePointCalendarService(this.context, eventList);
    this.services.getEventById(itemid).then((events: ICalendarEvent[]) => {
      console.log("Event: -> " + JSON.stringify(events));
      //let obj = JSON.parse(news.Image);
      const element: React.ReactElement<IEventDetailProps> = React.createElement(
        EventDetail,
        {
          level1Text: this.properties.level1Text ? this.properties.level1Text : "Home",
          level2Text: this.properties.level2Text ? this.properties.level2Text : "Corporate Information",
          level3Text: this.properties.level1Text ? this.properties.level1Text : "Events Calendar",
          level1Link: this.properties.level1Link,
          level2Link: this.properties.level2Link,
          level3Link: this.properties.level3Link,
          defaultImageUrl: this.properties.defaultImageUrl,
          width: this.properties.width,
          height: this.properties.height,
          events: events
        }
      );

      ReactDom.render(element, this.domElement);
    });
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
              groupName: "Event Info",
              groupFields: [
                PropertyPaneTextField('eventList', {
                  label: "Event List"
                }),
                PropertyPaneTextField('itemId', {
                  label: "ID"
                })
              ]
            },
            {
              groupName: "Bread Crumb",
              groupFields: [
                PropertyPaneTextField('level1Text', {
                  label: "Level 1 Text"
                }),
                PropertyPaneTextField('level1Link', {
                  label: "Level 1 Link"
                }),
                PropertyPaneTextField('level2Text', {
                  label: "Level 2 Text"
                }),
                PropertyPaneTextField('level2Link', {
                  label: "Level 2 Link"
                }),
                PropertyPaneTextField('level3Text', {
                  label: "Level 3 Text"
                }),
                PropertyPaneTextField('level3Link', {
                  label: "Level 3 Link"
                }),
              ]
            },
            {
              groupName: "Banner Iamge",
              groupFields: [
                PropertyPaneTextField('defaultImageUrl', {
                  label: "Default Image Url"
                }),
                PropertyPaneTextField('width', {
                  label: "Width"
                }),
                PropertyPaneTextField('height', {
                  label: "Height"
                })
              ]
            }
          ]


        }
      ]
    };
  }
}
