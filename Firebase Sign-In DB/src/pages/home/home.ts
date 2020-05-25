import { Component} from '@angular/core';
import { ModalController,NavController, AlertController } from 'ionic-angular';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';


import { first } from 'rxjs/operators';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})



export class HomePage {

    version:any="0.9.10"
    items: any;
    itemsRef: AngularFireList<any>;
    staff:boolean=false;
    data:any={email:'',newsletter:true}
    donate:boolean=false;
    hidesignout:boolean=false;
    firstname:boolean=false;
    lastname:boolean=false;
    dropitdown:boolean=false;
    staffdropitdown:boolean=false;
    validemail:boolean=false;
    key:any=null;
    printcsv:any;
    stratify:any="All";

    today:any=new Date();
    thisyear:any=this.today.getFullYear()
    thismonth:any=this.today.getMonth();
    monthago:any=new Date(this.today.setMonth(this.today.getMonth() - 1));
   start:any=this.monthago.getFullYear()+'-'+("0" + (this.monthago.getMonth() + 1)).slice(-2)+'-'+("0" + this.monthago.getDate()).slice(-2);
end:any=this.thisyear+'-'+("0" + (this.thismonth + 1)).slice(-2)+'-'+("0" + this.today.getDate()).slice(-2);


   // datab:any=[];
    database:any=[];
    activeGuests:any=[];
    loading:boolean=true;
 

  constructor(public modalCtrl:ModalController,public navCtrl: NavController, db: AngularFireDatabase, public alertCtrl: AlertController) {

if (String(window.location).includes('?staff')){

setTimeout(()=>{

location.reload();

}, 300000);

}


    this.itemsRef = db.list('items');
    this.items = this.itemsRef.snapshotChanges();


if (localStorage.getItem("session")){
  this.key=localStorage.getItem("session");
  this.donate=true;

}

if(String(window.location).includes('staff')){
  this.FBsync()
  this.staff=true;
}


// sort active volunteers


}

async dogModal() {
    const modal = await this.modalCtrl.create('CalcPage');
    return await modal.present();
    
  }

  async catModal() {
    const modaltwo = await this.modalCtrl.create('GuidePage');
    return await modaltwo.present();
    
  }

applicationButton(){

let prompt = this.alertCtrl.create({
      title: 'Adoption Application',
      enableBackdropDismiss: false,
     
      buttons: [          
           {
              text: 'Dog',
              handler: data => {
       this.dogModal();
     },
              },
          {
              text: 'Cat',
              handler: data => {
       this.catModal();
              }
          },
       
     
            {
              text: 'Cancel',
              handler: data => {
              }
          }

      ]
  });




prompt.present(); 


}


stratifyRez(){

  this.activeGuests=[];

  this.database.forEach(item=>{

if (typeof item.signOutTime == 'undefined'){

  if (this.stratify=="All"){
  this.activeGuests.push(item);
}else{

if (typeof item.help !== 'undefined'){
if (item.help==this.stratify){
   this.activeGuests.push(item);
}
}else if (this.stratify=="Other"){
  this.activeGuests.push(item);
}

}

}

})

this.activeGuests.sort((a, b) => {
  //console.log(a.signInTime);
  if (new Date(a.signInTime)>new Date(b.signInTime)){
    return 1
  }else{
    return -1
  }


})


}



checkEmail(){
  if (this.data.email.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)){
this.validemail=true;
  }else{
this.validemail=false;
  }

    //this.data.email
}


signOut(){

this.data.signOutTime=new Date();

this.hidesignout=true;

  let prompttwo = this.alertCtrl.create({
      title: 'Thank you for Visiting!',
      subTitle:'Anything we should know about your visit?',
      enableBackdropDismiss: false,
      inputs: [
      /*
      {type:"text",
      name:"metwith",
      placeholder:"Which pets did you meet with today?"},*/
      {type:"text",
      name:"feedback",
      placeholder:"Any feedback for us?"}

      ],
     
      buttons: [          
          {
              text: 'Done',
              handler: data => {
                /*
if (typeof data.feedback == 'undefined' || this.data.metwith == 'undefined'){
                  return false;
                }
                */
this.data.feedback=data.feedback.replace(',','');
//this.data.metwith=data.metwith;
if (!this.data.donation){
                  this.data.donation='';
                }

if (String(this.data.email).length<4){
  var backup
  if (localStorage.getItem("email")){
  backup=localStorage.getItem("email");
}else{
  backup="lost"
}


this.data.email=backup+" memleak line 177";
}


 this.itemsRef.update(this.key, this.data);
localStorage.clear();
this.hidesignout=true;

              }
          }

      ]
  });



let prompt = this.alertCtrl.create({
      title: 'What was the result of your visit?',
      subTitle:'Please pick from the following options:',
      enableBackdropDismiss: false,
      inputs: [
        {
          type: "radio",
          label: "Did application at Rescue",
          value: "applied"
        },
        {
          type: "radio",
          label: "Will do application at home",
          value: "willapply"
        },
        {
          type: "radio",
          label: "Took business card",
          value: "businesscard"
        },
        {
          type: "radio",
          label: "Did walk-through/tour",
          value: "checkingout"
        },
        {
          type: "radio",
          label: "Adopted a pet!",
          value: "adopted"
        },
        {
          type: "radio",
          label: "Met pet(s)!",
          value: "met"
        }
      ],
     
      buttons: [          
          {
              text: 'Sign Out',
              handler: data => {
                if (typeof data == 'undefined'){
                  return false;
                }
                this.data.result=data;

                if (!this.data.staffSignOut){
                  this.data.staffSignOut='';
                }

if (String(this.data.email).length<4){
  var backup
  if (localStorage.getItem("email")){
  backup=localStorage.getItem("email");
}else{
  backup="lost"
}


this.data.email=backup+" memleak line 245";
}
                this.itemsRef.update(this.key, this.data);
                prompttwo.present()
              }
          }

      ]
  });

if (String(this.data.email).length<4){
  var backup
  if (localStorage.getItem("email")){
  backup=localStorage.getItem("email");
}else{
  backup="lost"
}


this.data.email=backup+" memleak line 256";
}

this.itemsRef.update(this.key, this.data);

prompt.present(); 


}

donation(){
this.data.donation=true;

if (String(this.data.email).length<4){
  var backup
  if (localStorage.getItem("email")){
  backup=localStorage.getItem("email");
}else{
  backup="lost"
}


this.data.email=backup+" memleak line 270";
}

 this.itemsRef.update(this.key, this.data);
//alert('open new window in paypal? Or what?');

window.open('https://www.paypal.com/us/fundraiser/charity/1899708','_blank')
}

dropdown(){
this.dropitdown=true;
}

staffdropdown(){
this.staffdropitdown=true;
}

namechange(first){
  if (first){
if (this.data.firstName.length>1){
  this.firstname=true;
}else{
   this.firstname=false;
}

  }else{
if (this.data.lastName.length>1){
   this.lastname=true;
}else{
   this.lastname=false;
}

  }


}


submitForm(){
 // alert(JSON.stringify(this.data));


if (typeof this.data.firstName == 'undefined' || typeof this.data.lastName == 'undefined'){
  
  return;
}
if (typeof this.data.source== 'undefined'){
  alert("Select how you heard about us");
  return;
}

if (typeof this.data.help== 'undefined'){
  alert("Choose who is helping you today, if unsure, ask receptionist");
  return;
}

if (!this.validemail){
  alert('please enter a valid email address');
  return;
}

this.data.firstName=this.data.firstName.trim();
this.data.lastName=this.data.lastName.trim();

//this.data.name=this.data.firstName+' '+this.data.lastName
this.data.signInTime=String(new Date());
//console.log(this.data);
this.itemsRef.push(this.data).then((rez)=>{
 this.key=rez.key;
 localStorage.setItem("session", this.key);
});

this.data.staffSignOut=false;
this.data.donation=false;

this.donate=true;
/*
  if (true){ //auth things
this.donate=true;
  }
*/
  // save the data

  // redirect or show donation stuff

  localStorage.setItem("email", this.data.email);
}




signout(obj){
this.data=obj;
  let prompt = this.alertCtrl.create({
      title: 'What was the result of'+obj.firstName+'\'s visit?',
      //subTitle:'Please pick from the following options:',
      enableBackdropDismiss: true,
      inputs: [
               {
          type: "radio",
          label: "Did Application at Rescue",
          value: "applied"
        },
        {
          type: "radio",
          label: "Will Do Application at Home",
          value: "willapply"
        },
        {
          type: "radio",
          label: "Took Business Card",
          value: "businesscard"
        },
        {
          type: "radio",
          label: "Did Walk-Through/Tour",
          value: "checkingout"
        },
        {
          type: "radio",
          label: "Adopted a pet!",
          value: "adopted"
        },
        {
          type: "radio",
          label: "Met pet(s)!",
          value: "met"
        }
      ],
     
      buttons: [ 
      
          {
              text: 'Lost Track',
              handler: data => {

                  this.data.result='lost track';
                  this.data.staffSignOut=true;
                  //this.data.donation='';
                  this.data.signOutTime=new Date();

  this.data.metwith='';
  this.data.feedback='';

if (String(this.data.email).length<4){
  var backup
  if (localStorage.getItem("email")){
  backup=localStorage.getItem("email");
}else{
  backup="lost"
}


this.data.email=backup+" memleak line 401";
}

 this.itemsRef.update(this.data.key, this.data);
location.reload();


              }
          },         
          {
              text: 'Sign Out',
              handler: data => {

if (typeof data == 'undefined'){
                  return false;}

                  this.data.result=data;
                  this.data.staffSignOut=true;
                  //this.data.donation=false;
                  this.data.signOutTime=new Date();

  let prompttwo = this.alertCtrl.create({
      title: 'Comments',
      enableBackdropDismiss: false,
      inputs: [
      {type:"text",
      name:"feedback",
      placeholder:"Any notes?"},

      ],
     
      buttons: [          
          {
              text: 'Sign Out',
              handler: data => {

this.data.feedback=data.feedback.replace(',','');
if (typeof data.metwith !== 'undefined'){
  this.data.metwith=data.metwith;
}else{
  this.data.metwith='';
}


if (String(this.data.email).length<4){
  var backup
  if (localStorage.getItem("email")){
  backup=localStorage.getItem("email");
}else{
  backup="lost"
}


this.data.email=backup+" memleak line 446";
}

 this.itemsRef.update(this.data.key, this.data);
location.reload();
              }
          }

      ]
  });

prompttwo.present();

              }
          }

      ]
  });


prompt.present(); 





}




FBsync(){

   this.items.pipe(first()).subscribe(items => { // async from firebase
//alert('subscribe');
//console.log('firing subscribe');
    items.forEach(item => {
      //this.datab.push(item);
      this.database.push({...item.payload.val(), ...{key:item.key}});

    });


/**/
this.database.forEach(item=>{

if (typeof item.signOutTime == 'undefined'){
  this.activeGuests.push(item);
}
   //if(item.firstName=="Conor"){   }
    // console.log(item);

})

this.activeGuests.sort((a, b) => {
  //console.log(a.signInTime);
  if (new Date(a.signInTime)>new Date(b.signInTime)){
    return 1
  }else{
    return -1
  }


})

this.loading=false;
//console.log(this.allvolunteerNames);
});
}

downloadData(){

this.genCSV(this.start,this.end)
}

genCSV(start:any=null,end:any=null){
 // console.log(this.database);
//console.log(this.convertArrayOfObjectsToCSV(this.database))


var csv=[];

// crappy seive
this.database.forEach(clone=>{
var addCSV=true;

var item=JSON.parse(JSON.stringify(clone))
if (typeof item.newsletter!=='undefined'){
  if (typeof item.name !== 'undefined'){
    delete item.name;
  }
  if (typeof item.key !== 'undefined'){
    delete item.key;
  }

  if (start){
    if (new Date(item.signInTime).getTime()<new Date(start).getTime()){
//console.log(new Date(item.signInTime).getTime());
//console.log(new Date(start).getTime());

      addCSV=false;
    }
  }
/*
 if (end){
    if (new Date(item.signInTime).getTime()>new Date(end).getTime()){
      addCSV=false;
    }
  }
*/
if (addCSV){
  item.signInTime=new Date(item.signInTime).getTime()/1000;
  item.signInTime='"='+String(item.signInTime)+'/(60*60*24)+""1/1/1970"""';

  if (typeof item.signOutTime !== 'undefined'){
item.signOutTime=new Date(item.signOutTime).getTime()/1000;
  item.signOutTime='"='+String(item.signOutTime)+'/(60*60*24)+""1/1/1970"""';
}
csv.push(item);
}
}

})
this.printcsv=csv;
//console.log(this.printcsv);
this.downloadCSV();

}

convertArrayOfObjectsToCSV(args) {  
        var result, ctr, keys, columnDelimiter, lineDelimiter, data;

        data = args || null;
        if (data == null || !data.length) {
            return null;
        }

        columnDelimiter = args.columnDelimiter || ',';
        lineDelimiter = args.lineDelimiter || '\n';

        keys = Object.keys(data[0]);

        result = '';
        result += keys.join(columnDelimiter);
        result += lineDelimiter;

        data.forEach(function(item) {
            ctr = 0;
            keys.forEach(function(key) {
                if (ctr > 0) result += columnDelimiter;
                //console.log(item[key]);
                if (typeof item[key] == 'undefined'){
                  result+='';
                }else{
                result += item[key];
                }
                ctr++;
            });

            result += lineDelimiter;
        });

        return result;
    }

/*    */
downloadCSV() {  
        var data, filename, link;
        var csv = this.convertArrayOfObjectsToCSV(this.printcsv);
        if (csv == null) return;

        filename = 'VistorDatabase.csv';

        if (!csv.match(/^data:text\/csv/i)) {
            csv = 'data:text/csv;charset=utf-8,' + csv;
        }
        data = encodeURI(csv);

        link = document.createElement('a');
        link.setAttribute('href', data);
        link.setAttribute('download', filename);
        link.click();
    }



}


