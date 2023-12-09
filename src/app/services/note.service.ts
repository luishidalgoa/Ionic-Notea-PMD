import { Injectable, inject } from '@angular/core';
import { DocumentReference, AngularFirestoreCollection, AngularFirestore } from '@angular/fire/compat/firestore'
import { collectionData,collection,Firestore } from '@angular/fire/firestore'
import { environment } from 'src/environments/environment';
import { Note } from '../model/note';
import { Observable } from 'rxjs';
//import * as firebase from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class NoteService {
  myCollection: AngularFirestoreCollection<any>;
  myCollection_new:any;
  private fireStore: AngularFirestore = inject(AngularFirestore); //old
  private fire: Firestore = inject(Firestore);  //new
  public notes$!:Observable<Note[]>;

  constructor() {
    this.myCollection = this.fireStore.collection<any>(environment.firebaseConfig.collectionName);//old
    this.myCollection_new= collection(this.fire,environment.firebaseConfig.collectionName);//new
    //new
    this.notes$ = collectionData(this.myCollection_new,{idField:'key'}) as Observable<Note[]>;
    
  }
  addNote(note: Note): Promise<DocumentReference> {
    return this.myCollection.add(note);
  }
  //todo: paginated read
  readAll(): Observable<any> {
    return this.myCollection.get();
  }
  readNote(key: string):  Observable<any> {
    return this.myCollection.doc(key).get();
  }
  updateNote(note: Note): Promise<void> {
    return new Promise(async (resolve, reject) => {
      if (!note.key) reject("Key not defined");
      const { key, ...data } = note;
      try {
        resolve(await this.myCollection.doc(note.key).set(data));
      } catch (err) {
        reject(err);
      }
    })
  }
  deleteNote(note:Note):Promise<void>{
    return new Promise(async (resolve,reject)=>{
      if (!note.key) reject("Key not defined");
      try{
        resolve(await this.myCollection.doc(note.key).delete());
      }catch(err){
        reject(err);
      }
    });
  }
}
