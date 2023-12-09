import { Injectable } from '@angular/core';
import { Map, latLng, tileLayer, Layer, marker, icon } from 'leaflet';

@Injectable({
  providedIn: 'root'
})
export class LeafletService {

  constructor() { }

  makeMap(elementId: string): Map {
    return new Map(elementId);
  }
}
