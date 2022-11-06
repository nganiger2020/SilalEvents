
import { DisplayMode } from "@microsoft/sp-core-library";
import { WebPartContext } from "@microsoft/sp-webpart-base";
import { Moment } from "moment";
import { ICalendarEvent} from "../../../shared/services/CalendarService";
import { IReadonlyTheme } from '@microsoft/sp-component-base';
export interface IEventsSummaryProps {
  displayMode: DisplayMode;
  context: WebPartContext; 
  maxEvents: number;
  themeVariant: IReadonlyTheme;
  events:ICalendarEvent[];
  clientWidth: number;
}
