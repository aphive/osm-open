import {AfterViewInit, Component} from '@angular/core';
import {Map, View} from "ol";
import {Attribution} from "ol/control";
import TileLayer from "ol/layer/Tile";
import {OSM} from "ol/source";

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements AfterViewInit {
  map: Map;

  ngAfterViewInit(): void {
    this.map = new Map({
      target: 'map',
      controls: [
        new Attribution()
      ],
      layers: [
        new TileLayer({
          source: new OSM()
        }),
      ],
      view: new View({
        center: [1110161, 7085688],
        projection: 'EPSG:3857',
        zoom: 14,
        minZoom: 0,
        maxZoom: 19
      })
    });
  }
}