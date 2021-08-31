import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  cart = new Array();
  private cartCollection: AngularFirestoreCollection;

  constructor(private afs: AngularFirestore) {
    this.cartCollection = this.afs.collection('cart');

    this.getCart().subscribe(data => {
      this.cart = data;
    })
  }

  getCart() {
    return this.cartCollection.snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data }
        })
      })
    );
  }

  updateProductInCart(idCart: string, idProduto: string, quantidade: number) {
    this.cartCollection.doc(idCart).update({
      [idProduto]: quantidade
    });
  }

  addProductToCart(idProduto: string, quantidade: number) {
    return this.cartCollection.add({
      [idProduto]: quantidade
    });
  }

  deleteProductFromCart(idCart: string) {
    return this.cartCollection.doc(idCart).delete();
  }

}
