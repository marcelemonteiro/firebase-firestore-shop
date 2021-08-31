import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { LoadingController, ToastController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { Product } from '../interfaces/product';
import { CartService } from '../services/cart.service';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.page.html',
  styleUrls: ['./cart.page.scss'],
})
export class CartPage implements OnInit {
  products = [];
  loading;
  private cart = new Array();
  private productsSubscription: Subscription;
  private cartSubscription: Subscription;
  @ViewChild('inputQuantidade', { read: ElementRef }) inputQuantidade: ElementRef;


  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController
  ) {
    this.cart = [];
    this.products = [];
    this.cartSubscription = this.cartService.getCart().subscribe(data => {
      this.cart = data;
      console.log('cart: ', this.cart)

      let productsRef = [];
      this.productsSubscription = this.productService.getProducts().pipe(take(1)).subscribe(allProducts => {
        for (let item of this.cart) {
          const filtered = allProducts.filter(p => item[p.id]).map(p => {
            return { ...p, quantidade: item[p.id], cartItemId: item.id };
          })

          productsRef.push(...filtered);
        }

        this.products = productsRef;
        console.log('products: ', this.products);
      });
    });
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    if (this.cartSubscription) {
      this.cartSubscription.unsubscribe();
    }
    if (this.productsSubscription) {
      this.productsSubscription.unsubscribe();
    }
  }

  async deleteProduct(idCart: string) {
    try {
      console.log('oi')
      await this.cartService.deleteProductFromCart(idCart);
    } catch (error) {
      this.presentToast('Erro ao tentar deletar');
    }
  }

  async presentToast(message: string) {
    const toast = await this.toastCtrl.create({ message, duration: 2000 });
    toast.present();
  }

  async presentLoading() {
    this.loading = await this.loadingCtrl.create({ message: 'Aguarde...' });

    this.loading.present();

    setTimeout(() => {
      this.loading.dismiss();
    }, 2000);
  }

  addQuantidade(idCart: string, idProduto: string) {
    let quantidade = this.getQuantidade(idProduto);
    quantidade += 1;
    this.cartService.updateProductInCart(idCart, idProduto, quantidade);
  }

  removeQuantidade(idCart, idProduto) {
    let quantidade = this.getQuantidade(idProduto);
    quantidade -= 1;
    this.cartService.updateProductInCart(idCart, idProduto, quantidade);
  }

  getQuantidade(idProduto) {
    const [product] = this.cart.filter(c => c[idProduto]);
    const quantidade = product;
    return quantidade[idProduto];
  }

}
