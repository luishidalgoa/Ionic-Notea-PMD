import { Component,ViewChild,inject } from '@angular/core';
import {IonicModule, LoadingController} from '@ionic/angular'
  import {FormBuilder,FormGroup,FormsModule,
  ReactiveFormsModule,Validators} from '@angular/forms';
import { Note } from '../model/note';
import { NoteService } from '../services/note.service';
import { UIService } from '../services/ui.service';
import { Camera, CameraResultType } from '@capacitor/camera';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: true,
  imports: [IonicModule,
  FormsModule,ReactiveFormsModule],
})
export class Tab2Page {
  public form!:FormGroup;
  private formB = inject(FormBuilder);
  private noteS = inject(NoteService);
  private UIS = inject(UIService);
  public loadingS = inject(LoadingController);
  private myLoading!:HTMLIonLoadingElement;
  constructor() {
    this.form = this.formB.group({
      title:['',[Validators.required,Validators.minLength(4)]],
      description:['']
    });
  }
  image: string | undefined  = undefined;
  latitude: number | undefined = undefined;
  longitude: number | undefined = undefined;

  public async saveNote():Promise<void>{
    if(!this.form.valid) return;
    let note:Note={
      title:this.form.get("title")?.value,
      description:this.form.get("description")?.value,
      date:Date.now().toLocaleString(),
      photo:this.image!==undefined?this.image:"",
      position:this.latitude!==undefined&&this.longitude!==undefined?{      
        latitude:this.latitude,
        longitude:this.longitude
      }:{latitude:-10000,longitude:-10000}
    }
    await this.UIS.showLoading();
    try{
      await this.noteS.addNote(note);
      this.form.reset();
      await this.UIS.showToast("Nota introducida correctamente","success");
    }catch(error){
      await this.UIS.showToast("Error al insertar la nota","danger");
    }finally{
      await this.UIS.hideLoading();
    }
    this.latitude = undefined;
    this.longitude = undefined;
    
  }

  getCoords(){
    navigator.geolocation.getCurrentPosition(async (position)=>{
      this.latitude = position.coords.latitude;
      this.longitude = position.coords.longitude;
    })
  }

  public async takePic(){
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: true,
        resultType: CameraResultType.Base64
      });
      const img=new Image();
      img.src = 'data:image/png;base64,' + image.base64String;
      this.image = img.src;
  }
}
