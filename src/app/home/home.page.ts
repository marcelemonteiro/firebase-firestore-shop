import { Component } from '@angular/core';
import { LoadingController, NavController, ToastController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Product } from '../interfaces/product';
import { CartService } from '../services/cart.service';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  private loading: any;
  public products = new Array<Product>();
  private cart = [];
  private productsSubscription: Subscription;
  private cartSubscription: Subscription;

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    private navCtrl: NavController

  ) {
    this.productsSubscription = this.productService.getProducts().subscribe(data => {
      this.products = data;
      console.log('p: ', this.products)
    });

    this.cartSubscription = this.cartService.getCart().subscribe(data => {
      this.cart = data;
      console.log('c: ', this.cart)
    });
  }

  ngOnInit() { }

  ngOnDestroy() {
    this.productsSubscription.unsubscribe();
  }

  async deleteProduct(id: string) {
    try {
      await this.productService.deleteProduct(id);
    } catch (error) {
      this.presentToast('Erro ao tentar deletar');
    }
  }

  async addToCart(idProduto: string, quantidade = 1) {

    const isDuplicateId = this.cart.some(item => item[idProduto]);

    try {
      if (!isDuplicateId) {
        await this.cartService.addProductToCart(idProduto, quantidade);
      }

      // await this.loading.dismiss();

    } catch (error) {
      this.presentToast('Erro ao tentar salvar');
      // this.loading.dismiss();
    }
  }

  async presentLoading() {
    this.loading = await this.loadingCtrl.create({ message: 'Aguarde...' });

    return this.loading.present();
  }

  async presentToast(message: string) {
    const toast = await this.toastCtrl.create({ message, duration: 2000, position: 'top' });
    toast.present();
  }

}
