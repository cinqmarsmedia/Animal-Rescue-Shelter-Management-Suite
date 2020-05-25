import { Component } from '@angular/core';
import { IonicPage, ViewController } from 'ionic-angular';

/**
 * Generated class for the GuidePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-guide',
  templateUrl: 'guide.html',
})
export class GuidePage {

  constructor(public viewCtrl:ViewController) {
  }

  ionViewDidLoad() {
    //console.log('ionViewDidLoad GuidePage');
  }

  close(){
   this.viewCtrl.dismiss();
   }

}
