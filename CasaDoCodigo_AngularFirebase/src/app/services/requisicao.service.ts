import { Requisicao } from './../models/requisicao.model';
import { Injectable } from '@angular/core';
import { ServiceFirebase } from '../core/iservicefirebase.service';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class RequisicaoService extends ServiceFirebase<Requisicao>{

  constructor(firestore: AngularFirestore) {
    super(Requisicao, firestore, 'requisicoes');
  }
}
