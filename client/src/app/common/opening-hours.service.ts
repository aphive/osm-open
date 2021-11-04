import {Injectable} from '@angular/core';
import {Geometry} from "ol/geom";
import {Feature} from "ol";
import opening_hours, {nominatim_object, optional_conf_param} from "opening_hours";

@Injectable({
  providedIn: 'root'
})
export class OpeningHoursService {
  isOpen(feature: Feature<Geometry>, date?: Date): boolean {
    return this.getOpeningHours(feature)?.getState(date) ?? false;
  }

  getOpeningHours(feature: Feature<Geometry>): (opening_hours | undefined) {
    // TODO use locale of country the POI is in
    try {
      return new opening_hours(this.getOpeningHoursString(feature), {} as nominatim_object, {locale: navigator.language} as optional_conf_param);
    } catch (e) {
      console.error(`Error on feature ${feature.get("@id")} with name '${feature.get("name")}' and opening_hours '${this.getOpeningHoursString(feature)}'`)
      console.error(e);
      return undefined;
    }
  }

  getOpeningHoursString(feature: Feature<Geometry>): string {
    return feature.get("opening_hours");
  }
}
