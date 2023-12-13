import { Component, Input, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import * as L from 'leaflet';

@Component({
  selector: 'app-note',
  templateUrl: './note.component.html',
  styleUrls: ['./note.component.scss'],
  imports: [IonicModule],
  standalone: true
})
export class ModalNoteComponent  implements OnInit {
  @Input({required: true})
  image!:string
  @Input({required: true})
  title!:string
  @Input({required: true})
  description!:string
  @Input({required: true})
  position!:{latitude:number,longitude:number}
  constructor() { 
  }

  ngOnInit() {
  }
  ngAfterViewInit() {
    const map = L.map('map').setView([this.position.latitude, this.position.longitude], 13);
    setTimeout(() => {
      map.invalidateSize(true);
    },100)
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

    L.marker([this.position.latitude,this.position.longitude]).addTo(map)
    .openPopup();

  }

}
