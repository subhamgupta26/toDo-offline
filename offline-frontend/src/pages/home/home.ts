import { Component } from '@angular/core';
import { ModalController, NavController, Events } from 'ionic-angular';
import { AddItemPage } from '../add-item/add-item'
import { ItemDetailPage } from '../item-detail/item-detail';
import { Data } from "../../providers/data/data";
// import { Data } from '../../providers/data';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
 
  public items = [];
 
  constructor(public events: Events,public navCtrl: NavController, public modalCtrl: ModalController, public dataService: Data) {
 
  events.subscribe('data:added', () => {
   // alert("event caught");
    console.log("data added");
    this.getData();
  });
 this.getData();


 
  }
 
  ionViewDidLoad(){
 
  }

 getData(){
      this.dataService.getData().subscribe((todos) => {
      //alert("todos"+todos+JSON.stringify(todos));
     // alert("get data called");
      if(todos){
        this.items=[];
        console.log(todos);
        for(let todo of todos){
        this.items.push (todo); 
        }
     // alert("length of items"+this.items.length);
        console.log(this.items.length);
      }
 
    });
 }
  addItem(){
 
    let addModal = this.modalCtrl.create(AddItemPage);
 
    addModal.onDidDismiss((item) => {
 
          if(item){
            this.saveItem(item);
          }
 
    });
 
    addModal.present();
 
  }
 
  saveItem(item){
    //this.items.push(item);
    this.dataService.save(item);
//             setTimeout(()=>{
//     this.getData();
//     console.log();
// }, 2000);

  }
 
  viewItem(item){
    console.log("view item called"+item );
    this.navCtrl.push(ItemDetailPage, {
      item: item
    });
  }
  syncData(){
    this.getData();
  }
 
}