import * as React from 'react';
import { IEventsSummaryProps } from './IEventsSummaryProps';
import { DisplayMode } from "@microsoft/sp-core-library";
import { FilmstripLayout } from "../../../shared/components/filmstripLayout/index";
import { EventCard } from '../../../shared/components/EventCard';
import { Pagination } from "../../../shared/components/Pagination";
import { ICalendarEvent } from '../../../shared/services/CalendarService';
import * as strings from "EventsSummaryWebPartStrings";
import { FocusZone, FocusZoneDirection, List, Spinner, css } from "office-ui-fabric-react";
export const EventsSummary = (props: IEventsSummaryProps) => {
  const isEditMode: boolean = props.displayMode === DisplayMode.Edit;
  const [events, setEvents] = React.useState(props.events);
  const [currentPage, setCurrentPage] = React.useState(1);
  return (<div>
    <div>
      <div role="application">
        <FilmstripLayout
          ariaLabel={strings.FilmStripAriaLabel}
          clientWidth={props.clientWidth}
          themeVariant={props.themeVariant}
        >
          {events.map((event: ICalendarEvent, index: number) => {
            return (<EventCard
              key={`eventCard${index}`}
              isEditMode={isEditMode}
              event={event}
              isNarrow={false}
              themeVariant={props.themeVariant} />
            );
          })}
        </FilmstripLayout>
      </div>
    </div>
  </div>);
};

const renderNormalList = ({ clientWidth, themeVariant, propsEvents, displayMode }) => {
  const isEditMode: boolean = displayMode === DisplayMode.Edit;
  const [events, setEvents] = React.useState(propsEvents);
  const [currentPage, setCurrentPage] = React.useState(1);
  return (<div>
    <div>
      <div role="application">
        <FilmstripLayout
          ariaLabel={strings.FilmStripAriaLabel}
          clientWidth={clientWidth}
          themeVariant={themeVariant}
        >
          {events.map((event: ICalendarEvent, index: number) => {
            return (<EventCard
              key={`eventCard${index}`}
              isEditMode={isEditMode}
              event={event}
              isNarrow={false}
              themeVariant={themeVariant} />
            );
          })}
        </FilmstripLayout>
      </div>
    </div>
  </div>);
};
const _renderNarrowList = (props: IEventsSummaryProps) => {

  const [events, setEvents] = React.useState(props.events);
  const [currentPage, setCurrentPage] = React.useState(1);
  const { maxEvents } = props;

  const _onPageUpdate = (pageNumber: number): void => {
    setCurrentPage(pageNumber);
  };

  // if we're in edit mode, let's not make the events clickable
  const isEditMode: boolean = props.displayMode === DisplayMode.Edit;

  let pagedEvents: ICalendarEvent[] = props.events;
  let usePaging: boolean = false;

  if (maxEvents > 0 && props.events.length > maxEvents) {
    // calculate the page size
    const pageStartAt: number = maxEvents * (currentPage - 1);
    const pageEndAt: number = (maxEvents * currentPage);

    pagedEvents = props.events.slice(pageStartAt, pageEndAt);
    usePaging = true;
  }

  return (<FocusZone
    direction={FocusZoneDirection.vertical}
    isCircularNavigation={false}
    data-automation-id={"narrow-list"}
    aria-label={isEditMode ? strings.FocusZoneAriaLabelEditMode : strings.FocusZoneAriaLabelReadMode}
  >
    <List
      items={pagedEvents}
      onRenderCell={(item, _index) => (
        <EventCard
          isEditMode={isEditMode}
          event={item}
          isNarrow={true}
          themeVariant={props.themeVariant}
        />
      )} />
    {usePaging &&
      <Pagination
        showPageNum={false}
        currentPage={currentPage}
        itemsCountPerPage={maxEvents}
        totalItems={events.length}
        onPageUpdate={_onPageUpdate} />
    }
  </FocusZone>
  );
};


