import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Point } from 'ol/geom';
import { Feature } from 'ol';
import { HttpClient } from '@angular/common/http';
import { Extent } from 'ol/extent';
import { fromLonLat, toLonLat } from 'ol/proj';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class PoiService {
  private dataChangedSubject: Subject<Feature<Point>[]> = new Subject<Feature<Point>[]>();
  private poiSelectedSubject: Subject<Feature<Point> | undefined> = new Subject<Feature<Point> | undefined>();

  constructor(private httpClient: HttpClient) {}

  get dataChanged(): Observable<Feature<Point>[]> {
    return this.dataChangedSubject.asObservable();
  }

  get poiSelected(): Observable<Feature<Point> | undefined> {
    return this.poiSelectedSubject.asObservable();
  }

  loadData(extent: Extent): Observable<void> {
    const bottomLeft = toLonLat([extent[0], extent[1]]);
    const topRight = toLonLat([extent[2], extent[3]]);
    const bbox = '(' + bottomLeft[1] + ',' + bottomLeft[0] + ',' + topRight[1] + ',' + topRight[0] + ')';

    const url = `https://overpass-api.de/api/interpreter?data=
[out:json][timeout:30];
(
node["opening_hours"]${bbox};
way["opening_hours"]${bbox};
);
out center;`;

    return this.httpClient.get<any>(url).pipe(
      map((data: any) => {
        const features = data.elements.map((element: any) => {
          const feature = new Feature<Point>();
          feature.setProperties(element.tags);
          feature.set('@id', element.id);
          feature.set('@type', element.type);

          if (feature.get('contact:website')) {
            feature.set('website', feature.get('contact:website'));
            feature.unset('contact:website');
          }

          if (feature.get('website') && !('' + feature.get('website')).startsWith('http')) {
            feature.set('website', 'https://' + feature.get('website'));
          }

          let lon: number;
          let lat: number;

          if (element.center) {
            lon = element.center.lon;
            lat = element.center.lat;
          } else {
            lon = element.lon;
            lat = element.lat;
          }

          feature.setGeometry(new Point(fromLonLat([lon, lat])));
          return feature;
        });
        this.dataChangedSubject.next(features);
      })
    );
  }

  selectPoi(feature: Feature<Point> | undefined): void {
    this.poiSelectedSubject.next(feature);
  }
}
