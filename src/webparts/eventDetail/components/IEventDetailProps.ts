import { ICalendarEvent } from "../../../shared/services/CalendarService";

export interface IEventDetailProps {  
  events:ICalendarEvent[]; 
  level1Text:string;
  level2Text:string;
  level3Text:string;
  level1Link:string;
  level2Link:string;
  level3Link:string;
  defaultImageUrl:string;
  width:string;
  height:string;
}
