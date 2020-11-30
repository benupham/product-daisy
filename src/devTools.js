import { format } from "d3";
import {clickPoint} from './click';

export function clickTracker(clickPoint) {
  let clickTracker = document.getElementById("clickTracker");
  clickTracker.innerHTML = "clicked: " + clickPoint[0] + ", " + clickPoint[1];
}

export function onMouseOver(coordinates) {
  // let coordinates = d3.mouse(zoomable.node());
  
  let mouseTracker = document.getElementById("mouseTracker");
  mouseTracker.innerHTML = "mouse position: " + coordinates[0] + ", " + coordinates[1];
}

export function zoomMeter(k) {
  let zoomMeter = document.getElementById("zoomMeter");
  zoomMeter.innerHTML = "zoom: " + k;

}