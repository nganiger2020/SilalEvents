import * as React from 'react';
import styles from '../../../css/Silal.module.scss';
import { IEventDetailProps } from './IEventDetailProps';
import "bootstrap/dist/css/bootstrap.min.css";


export const EventDetail = (props: IEventDetailProps) => {
  const event = props.events[0];
  const ImageUrl = event.ImgUrl ? event.ImgUrl : props.defaultImageUrl;
  return (
    <div className="container-fluid" style={{ padding: "0 3.5% 0% 3.5%" }} >
      <div className="row">
        <div className="col-sm-8">
          <p className={styles["navigation-path"]}><a className={styles.blink} href={props.level1Link}>{props.level1Text}</a> {' > '} <a className={styles.blink} href={props.level2Link}>{props.level2Text}</a> {' > '} <a className={styles.blink} href={props.level3Link}>{props.level3Text}</a> {' > '} {event.title}</p>
          <div className={styles.header1}>{event.title}</div>
          <img style={{ width: "" + props.width + "", height: "" + props.height + "" }} src={ImageUrl} />         
            <div className={"itemResponse"} dangerouslySetInnerHTML={{ __html: event.description }}></div>       
        </div>
        <div className="col-sm-4" style={{ background: "#F2F5F6", padding: "6% 2% 0% 3%", height: "900px" }}>
          <h5 className={styles["h5-tag"]}>Important Information</h5>
          <div className={styles["depart-eme"]} style={{ borderRadius: "8px 8px 0px 0px" }}>
            <p className={styles["top-element"]} >Location</p>
            <p className={styles["bottom-element"]} style={{ paddingTop: "8px" }}>{event.location}</p>
          </div>
          <div className={styles["depart-eme"]} style={{ borderRadius: "8px 8px 0px 0px" }}>
            <p className={styles["top-element"]} >Start Date</p>
            <p className={styles["bottom-element"]} style={{ paddingTop: "8px" }}>{event.start ? new Date(event.start.toString()).toLocaleDateString() : ""}</p>
          </div>
          {
            (event.ContactInformation) && (<div className={styles["depart-eme"]} style={{ borderRadius: "8px 8px 0px 0px" }}>
              <p className={styles["top-element"]} >Contact Information</p>
              <p className={styles["bottom-element"]} style={{ paddingTop: "8px" }}>{event.ContactInformation}</p>
            </div>)
          }
          {
            (event.ContactInformation && event.KeyContacts && event.KeyContacts[0].Title) && (<div className={styles["depart-eme"]} style={{ borderRadius: "8px 8px 0px 0px" }}>
              <p className={styles["top-element"]} >Key Contacts</p>
              <p className={styles["bottom-element"]} style={{ paddingTop: "8px" }}>{event.KeyContacts && event.KeyContacts[0].Title ? event.KeyContacts[0].Title : ""}</p>
            </div>)
          }
        </div>
      </div>
    </div>
  );
};

