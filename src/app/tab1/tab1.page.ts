import { Component,inject } from '@angular/core';
import { IonicModule, Platform } from '@ionic/angular';
import { NoteService } from '../services/note.service';
import { Note } from '../model/note';
import { CommonModule } from '@angular/common';
import { NoteComponent } from '../components/note/note.component';
import { BehaviorSubject, Observable, from, map, mergeMap, tap, toArray } from 'rxjs';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: true,
  imports: [IonicModule,CommonModule,NoteComponent]
})
export class Tab1Page {
  //public misnotas:Note[]=[];
  public noteS = inject(NoteService);  //noteS.notes$
  constructor(public platform:Platform) {}
  
  handleRefresh(event: any) {
    setTimeout(() => {
      // Any calls to load data go here
      event.target.complete();
    }, 2000);
  }







  private lastNote:Note|undefined=undefined; // referencia a la ultima nota cargada
  public isInfiniteScrollAvailable:boolean = true; // indica si se puede seguir cargando notas. Es usado por el infinite scroll del html
  private notesPerPage:number = 5; // numero de notas a cargar por pagina. Su valor se modifica en el metodo ionViewDidEnter en funcion del tamaño de la pantalla
  public _notes$:BehaviorSubject<Note[]> = new BehaviorSubject<Note[]>([]); // array de notas de la vista. Es usado por el infinite scroll del html



  /**
   * este metodo se ejecuta cuando la vista ya esta cargada
   * y se puede acceder a los elementos del DOM de la vista
   */
  ionViewDidEnter(){
    this.platform.ready().then(() => {
      console.log(this.platform.height());
      this.notesPerPage=Math.round(this.platform.height()/50);
      this.loadNotes(true);
    });
   
  }

  /**
   * Carga las notas en el array de notas de la vista
   * @param fromFirst indica si se cargan las notas desde la primera nota o desde la ultima nota cargada
   * @param event 
   * @returns 
   */
  loadNotes(fromFirst:boolean, event?:any){
    // Si es la primera carga, no renderizamos el infinite scroll
    if(fromFirst==false && this.lastNote==undefined){
      this.isInfiniteScrollAvailable=false;
      event.target.complete(); // detiene el infinite scroll
      return;
    } 
    // Si no es la primera carga y no hay mas notas, nos suscribimos al evento de scroll infinito.
    this.convertPromiseToObservableFromFirebase(this.noteS.readNext(this.lastNote,this.notesPerPage)).subscribe(d=>{
      event?.target.complete();
      if(fromFirst){
        // si es la primera carga, reemplazamos el array de notas
        this._notes$.next(d);
      }else{
        // si no es la primera carga, añadimos las notas al array de notas
        this._notes$.next([...this._notes$.getValue(),...d]);
      }
    })
    
  }


  /**
   * Convierte una promesa de firebase a un observable . De modo que se pueda usar en un pipe
   * @param promise  promesa que devuelve un objeto de firebase con el resultado de la consulta
   * @returns devuelve un observable con el resultado de la consulta
   */
  private convertPromiseToObservableFromFirebase(promise: Promise<any>): Observable<Note[]> {
    return from(promise).pipe(
      tap(d=>{
        if(d.docs && d.docs.length>=this.notesPerPage){
          this.lastNote=d.docs[d.docs.length-1];
        }else{
          this.lastNote=undefined;
        }
      }),
      mergeMap(d =>  d.docs),
      map(d => {
        return {key:(d as any).id,...(d as any).data()};
      }),
      toArray()
    );
  }


  /**
   * Llama al metodo loadNotes para cargar mas notas
   * @param event 
   */
  loadMore(event: any) {
    this.loadNotes(false,event);
  }
}