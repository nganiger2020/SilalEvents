/**
 * ExtensionService
 */
import { HttpClientResponse } from "@microsoft/sp-http";

import { ICalendarEvent } from "../ICalendarEvent";
import { sp, Web } from "@pnp/sp";
import { combine } from "@pnp/common";
import { WebPartContext } from "@microsoft/sp-webpart-base";

export class SharePointCalendarService {
  private context: WebPartContext;
  private listName: string;
  private eventPageUrl: string;
  constructor(context: WebPartContext, listName: string, eventPageUrl?: string) {
    this.context = context;
    this.listName = listName;
    this.eventPageUrl = eventPageUrl;
  }


  public getEvents = async (): Promise<ICalendarEvent[]> => {


    const Start = new Date();
    Start.setDate(-1);

    // Build a filter so that we don't retrieve every single thing unless necesssary
    // //.filter(dateFilter)
    // let dateFilter: string = "EventDate ge datetime'" + Start.toISOString() + "' and EndDate lt datetime'" + End.toISOString() + "'";
    let dateFilter: string = "EventDate ge datetime'" + Start.toISOString() + "'";

    try {
      const items = await sp.web.lists.getByTitle(this.listName)
        .items.select("Id,Title,Description,EventDate,EndDate,fAllDayEvent,Category,Location,ContactInformation,KeyContacts/Name,KeyContacts/Title,KeyContacts/EMail,ImgUrl")
        .filter(dateFilter)
        .expand('KeyContacts')
        .orderBy('EventDate', true)
        .get();
      // Once we get the list, convert to calendar events
      let events: ICalendarEvent[] = items.map((item: any) => {
        let eventUrl: string = combine(this.eventPageUrl ? this.eventPageUrl : "/sites/Playground/SitePages/Event.aspx", "?EVENTID=" + item.Id);
        const eventItem: ICalendarEvent = {
          title: item.Title,
          start: item.EventDate,
          end: item.EndDate,
          url: eventUrl,
          allDay: item.fAllDayEvent,
          category: item.Category,
          description: item.Description,
          location: item.Location,
          ImgUrl: item.ImgUrl,
          ContactInformation: item.ContactInformation,
          KeyContacts: item.KeyContacts

        };
        return eventItem;
      });
      // Return the calendar items
      return events;
    }
    catch (error) {
      console.log("Exception caught by catch in SharePoint provider", error);
      throw error;
    }
  }

  public getEventById = async (itemId): Promise<ICalendarEvent[]> => {


    let dateFilter: string = "ID eq '" + itemId + "'";

    try {
      const items = await sp.web.lists.getByTitle(this.listName)
        .items
        .select("Id,Title,Description,EventDate,EndDate,fAllDayEvent,Category,Location,ContactInformation,KeyContacts/Name,KeyContacts/Title,KeyContacts/EMail,ImgUrl")
        .filter(dateFilter)
        .expand('KeyContacts')
        .orderBy('EventDate', true)
        .get();
      // Once we get the list, convert to calendar events
      let events: ICalendarEvent[] = items.map((item: any) => {
        //let eventUrl: string = combine(, "DispForm.aspx?ID=" + item.Id);
        const eventItem: ICalendarEvent = {
          title: item.Title,
          start: item.EventDate,
          end: item.EndDate,
          url: "",
          allDay: item.fAllDayEvent,
          category: item.Category,
          description: item.Description,
          location: item.Location,
          ImgUrl: item.ImgUrl,
          ContactInformation: item.ContactInformation,
          KeyContacts: item.KeyContacts
        };
        return eventItem;
      });
      // Return the calendar items
      return events;
    }
    catch (error) {
      console.log("Exception caught by catch in SharePoint provider", error);
      throw error;
    }
  }
}
