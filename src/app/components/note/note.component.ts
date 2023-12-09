import { Component, Input, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonImg, IonicModule, ModalController } from '@ionic/angular';
import { AlertController } from '@ionic/angular/standalone';
import { ModalNoteComponent } from 'src/app/modal/note/note.component';
import { Note } from 'src/app/model/note';
import { NoteService } from 'src/app/services/note.service';

@Component({
  selector: 'app-note',
  templateUrl: './note.component.html',
  styleUrls: ['./note.component.scss'],
  imports: [IonicModule,
    FormsModule,ReactiveFormsModule],
    standalone: true
})
export class NoteComponent  implements OnInit {
  @Input({alias:'value',required: true})
  note!: Note;

  constructor(private _storage: AngularFirestore,private noteS:NoteService,private alertController: AlertController,private modalController: ModalController) { }

  ngOnInit() {}

  editNote(){
    this.alertController.create({
      message: 'Introduce el nuevo título de la nota',
      inputs: [
        {
          name: 'title',
          type: 'text',
          placeholder: 'Título'
        },
        {
          name: 'description',
          type: 'text',
          placeholder: 'Descripción'
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          handler: () => {
            console.log('Cancelar');
          }
        },
        {
          text: 'Guardar',
          handler: (data) => {
            this.note.title = data.title;
            this.note.description = data.description;
            this.noteS.updateNote(this.note);
          }
        }
      ]
  }).then(alert => alert.present());
  }

  async deleteNote(){
    await this.alertController.create({
      message: '¿Estás seguro de que quieres eliminar esta nota?',
      buttons: [
        {
          text: 'No',
          handler: () => {
            console.log('No');
          }
        },
        {
          text: 'Si',
          handler: () => {
            this.noteS.deleteNote(this.note);
          }
        }
      ]
  }).then(alert => alert.present());
  }

  async showModal() {
    const modal = await this.modalController.create({
      component: ModalNoteComponent, // this should be the component that contains your image
      componentProps: {
        image: this.note.photo,
        title: this.note.title,
        description: this.note.description,
        position: this.note.position
      }
    });
    return await modal.present();
  }

}
