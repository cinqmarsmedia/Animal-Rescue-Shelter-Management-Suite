import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
//import { Observable } from 'rxjs/Observable';
//import { ChangeDetectorRef, NgZone } from '@angular/core'; // 

//import { timeData } from '../../app/constants';

import { first } from 'rxjs/operators';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})


export class HomePage {


    items: any;
    itemsRef: AngularFireList<any>;
    datab:any=[];
    database:any=[];
    loading:boolean=true;
    volunteerNames:any=[];
    activeVolunteers:any=[];
    selVolunteer:any="";
    showDropDown:boolean=false;
    currentDate:any=new Date();
    activeVolunteerarray:any=[]
    statsshow:boolean=false;
    statsVolunteer:any='';
    emailedReminder:any=[];
    individualsignins:any=[];
    individualsignouts:any=[];
    allvolunteerNames:any=[];
    unlocked:boolean=false; // debug
    missinginfo:boolean=false;
    unusualVolunteers:any=[];
    missingVolunteers:any=[]
    waiverDate:any=1566896071;
    manualView:boolean=false;
    manVolunteer:any='';
    today:any=new Date();
    breakdown:boolean=false;
    thisyear:any=this.today.getFullYear()
    thismonth:any=this.today.getMonth();
    end:any=this.thisyear+'-'+("0" + (this.thismonth + 1)).slice(-2)+'-'+("0" + this.today.getDate()).slice(-2);
    
    //end:any=new Date();
    monthago:any=new Date(this.today.setMonth(this.today.getMonth() - 1));
    start:any=this.monthago.getFullYear()+'-'+("0" + (this.monthago.getMonth() + 1)).slice(-2)+'-'+("0" + this.monthago.getDate()).slice(-2);
     corrupted:any=[]
    statsearchDone:boolean=false;
    searchQuery:string='All Volunteers'
    hours:any=0;
    sessions:any=0;
    avg:any=0;
    results:any=[]
	manenddate:any=this.end+'T13:00:00Z';
    manstartdate:any=this.end+'T12:00:00Z';
manualupdate:boolean=false;

  constructor(public navCtrl: NavController, db: AngularFireDatabase, public alertCtrl: AlertController) {
    this.itemsRef = db.list('items');
    this.items = this.itemsRef.snapshotChanges();
   // this.Math = Math;
//alert(timeData);
//this.deletebyname('Duffy, Williams')
if (localStorage.getItem("password")=='SECRETPASSWORD'){
  this.unlocked=true;
}

//alert(this.activeVolunteers)
this.FBsync()





// sort active volunteers


}

FBsync(){

   this.items.pipe(first()).subscribe(items => { // async from firebase
//alert('subscribe');
//console.log('firing subscribe');
    items.forEach(item => {
      this.datab.push(item);
      this.database.push(item.payload.val());
      //console.log(item.payload.val())

    });

     function compare(a,b) {
  if (a.name < b.name)
    return -1;
  if (a.name > b.name)
    return 1;
  return 0;
}
this.database.sort(compare);

/**/
this.database.forEach(item=>{
if (!this.allvolunteerNames.includes(item.name)){


  this.allvolunteerNames.push(item.name)
}

if (typeof item.signIns !== 'undefined'){

  var obj={name:item.name,lastSignIn:new Date(item.signIns[item.signIns.length-1])}


if (typeof item.signOuts == 'undefined'){
  item.signOuts=[];
}

//--------------------------------
var lastSignOut=new Date(item.signOuts[item.signOuts.length-1]).getTime()

var now=new Date().getTime();

if (lastSignOut<now-6048000000 && lastSignOut>now-6350400000){

  if (typeof item.warningEmail == 'undefined' || new Date(item.warningEmail).getTime()<lastSignOut){
this.mailermanager(item.name);

  }


}




//--------------------------------


if (item.signIns.length>item.signOuts.length){

if (new Date().getTime()-new Date(item.signIns[item.signIns.length-1]).getTime()<32400000){

// consider them active

let dup=false;
this.activeVolunteers.forEach((a)=>{
  if (item.name==a.name){
    dup=true
  }
})

if (!dup){
  this.activeVolunteers.push(obj); 
}
    if (!this.activeVolunteerarray.includes(item.name)){
  this.activeVolunteerarray.push(item.name)

  }

}else{

// Patch
// signout automatically from the previous day. 
let lastsignin=new Date(item.signIns[item.signIns.length-1]);
let datetime=new Date(lastsignin.getTime()+32400000);
/*
if (lastsignin.getHours()>18){ //6pm
datetime=new Date(lastsignin.getTime()+32400000);
}else{
datetime=new Date(lastsignin.getTime()+(18-lastsignin.getHours())*60*60*1000)
}
*/
this.signOutLogic(item.name,true,datetime)

}

}
}

if (!this.volunteerNames.includes(item.name) && !this.activeVolunteerarray.includes(item.name)){
this.volunteerNames.push(item.name);
}

})

this.activeVolunteers.sort((a, b) => {
  //console.log(a.lastSignIn);
  if (a.lastSignIn.getTime()>b.lastSignIn.getTime()){
    return 1
  }else{
    return -1
  }


})

this.loading=false;
//console.log(this.allvolunteerNames);
console.log('active',this.activeVolunteerarray);
});
}
manual(bool,auth:boolean=false){
//alert(this.manualupdate);
  if (!bool && this.manualupdate){

    this.manualupdate=false;
    window.location.reload(true);
  }

  if (bool && !auth && !this.unlocked){
  this.auth('manual');

  return;
}

this.manualView=bool;


}


startSession(newdate){
/*
let tempdate=new Date(newdate)

tempdate.setHours(tempdate.getHours() + 1);
//alert(tempdate);
let date=tempdate.getFullYear()+'-'+("0" + (tempdate.getMonth() + 1)).slice(-2)+'-'+("0" + tempdate.getDate()).slice(-2);

this.manenddate=date+'T'+tempdate.getHours()+':00:00Z';
*/
this.manenddate=newdate;
	//this.manstartdate
	//this.manenddate
}


followup(){
  this.missinginfo=!this.missinginfo;
}


stats(bool,auth:boolean=false){
//console.log(this.database)


if (bool && !auth && !this.unlocked){
  this.auth('stats');
  return;
}

  if (!bool){
    if (this.statsearchDone){
      this.statsearchDone=false;
      this.breakdown=false;
      this.statsVolunteer=""
      return;
    }else{
        this.statsshow=bool;
        return
    }
  }else{
 this.corrupted=[];
// unusual volunteer activity
this.weirdVolunteer()
this.missinginfocalc();
  }

  this.statsshow=bool;
}

missinginfocalc(){
  this.missingVolunteers=[]


this.database.forEach(a=>{
let obj={name:a.name,missing:[]}
if (a.minor=='' || a.minor.includes('?')){
obj.missing.push('minor status');
}
/*
if (a.oridate==''){
obj.missing.push('orientation date');
}
*/

if (a.phone=='' || a.phone.includes('?')){
obj.missing.push('phone#');
}
if (a.emerphone=='' || a.emerphone.includes('?')){
obj.missing.push('emergency #');
}
if (a.emername=='' || a.emername.includes('?')){
obj.missing.push('emergency name');
}
if (a.email=='' || a.email.includes('?')){
obj.missing.push('email');
}

if (obj.missing.length>0){
this.missingVolunteers.push(obj)
}

})

     function compare(a,b) {
  if (a.missing.length > b.missing.length)
    return -1;
  if (a.missing.length < b.missing.length)
    return 1;
  return 0;
}
this.missingVolunteers.sort(compare);

}



weirdVolunteer(){

  this.unusualVolunteers=[]

this.database.forEach(a=>{

let allTime=0;
let monthTime=0;
let threeMonthTime=0;

if (typeof a.signIns == 'undefined'){
  a.signIns=[]
}
if (typeof a.signOuts == 'undefined'){
  a.signOuts=[]
}



let first=new Date(a.signIns[0]);
let last=new Date(a.signOuts[a.signOuts.length-1]);

var monthago = new Date();
var threemonthago= new Date()
// Set it to one month ago
monthago.setMonth(monthago.getMonth() - 1);
threemonthago.setMonth(threemonthago.getMonth() - 3);


for (var i=0;i<a.signOuts.length;i++){


if (new Date(a.signIns[i])>monthago){

 monthTime=monthTime+new Date(a.signOuts[i]).getTime()-new Date(a.signIns[i]).getTime()

 // tabulate
  }

if (new Date(a.signIns[i])>threemonthago){

 threeMonthTime=threeMonthTime+new Date(a.signOuts[i]).getTime()-new Date(a.signIns[i]).getTime()

 // tabulate 
  }


  allTime=allTime+new Date(a.signOuts[i]).getTime()-new Date(a.signIns[i]).getTime()

  // tabulate




}
/**/

if (monthTime<0 || isNaN(allTime) || a.signIns.length!==a.signOuts.length || new Date(a.signOuts[a.signOuts.length-1])>new Date()){
//console.log(a.name, allTime, threeMonthTime)

// temporary rollback
/*
if (new Date(a.signOuts[a.signOuts.length-1])>new Date() && a.signOuts.length==1){
 let temp
             this.datab.forEach(x=>{
               if (x.payload.val().name==a.name){
                temp=x;

               }
            })

let signInTimes=[]
let signOutTimes=[]

signInTimes[0]=new Date(a.signIns[0]).setFullYear(2018)
signOutTimes[0]=new Date(a.signOuts[0]).setFullYear(2018)

let update={name:temp.payload.val().name,signIns:signInTimes, signOuts:signOutTimes}

this.itemsRef.update(temp.key, update);


}
*/
if (!this.activeVolunteerarray.includes(a.name) && !this.corrupted.includes(a.name)){
this.corrupted.push({name:a.name})
}
}

//console.log(monthTime +'   '+allTime);
let diff
var thismonthavg=monthTime/2592000000
var prevmonthavg=(allTime-monthTime)/(last.getTime()-first.getTime()-2592000000)

if (isNaN(prevmonthavg)){prevmonthavg=0}
if (isNaN(thismonthavg)){thismonthavg=0}

if (prevmonthavg>0){

if (thismonthavg==0){
  diff=-100
}else{
//console.log(a.name+','+thismonthavg +','+ prevmonthavg)
if (prevmonthavg>thismonthavg){
  //negative
  diff=Math.floor((1-thismonthavg/prevmonthavg)*100)
  diff=diff*-1
}else{
diff=Math.floor(thismonthavg/prevmonthavg*100)
}

}

//console.log(allTime);






if (Math.abs(diff)>1 && monthTime>=0 && diff!==100){
  if (threeMonthTime !==0){
if (a.signIns.length>2  && a.signOuts.length>2){

//if (Math.abs(diff)!==100){
let dup=false;
this.unusualVolunteers.forEach(b=>{
	if (b.name==a.name){
		dup=true;
	}
})

if (!dup){
  this.unusualVolunteers.push({name:a.name,diff:diff,month:Math.floor(monthTime/100/60/60)/10, prev:Math.floor(prevmonthavg*10000)/10})
  }
//}

}

  }
}




}



})


     function compare(a,b) {


  if (a.diff > b.diff)
    return -1;
  if (a.diff < b.diff)
    return 1;



  return 0;
}
this.unusualVolunteers.sort(compare);

}

delsignin(i){

let prompt = this.alertCtrl.create({
      title: 'Are you sure?',
      subTitle:'You wish to delete this sign-in for '+this.statsVolunteer+'?',
     
      buttons: [
          {
              text: 'Cancel'
          },
          
          {
              text: 'Yes',
              handler: data => {
             let temp
             this.datab.forEach(a=>{
               if (a.payload.val().name==this.statsVolunteer){
                temp=a;

               }
             })

let signIns=temp.payload.val().signIns
let signOuts

if (typeof temp.payload.val().signOuts!=='undefined'){
signOuts=temp.payload.val().signOuts
}else{signOuts=[]}

if (signIns.length>1){
signIns.splice(i, 1)
}else{
signIns=[]
}

let update={name:temp.payload.val().name,signIns:signIns, signOuts:signOuts}

this.itemsRef.update(temp.key, update);
window.location.reload(true);
this.FBsync()
              }
          }

      ]
  });
prompt.present(); 

}

mailermanager(name){

    let temp
             this.datab.forEach(a=>{
               if (a.payload.val().name==name){
                temp=a;
               }
             })

let object=temp.payload.val();


object.warningEmail=new Date();



  // this is where you post 
var firstname=name.substr(name.indexOf(",") + 1);
firstname=firstname.replace(' ','');



this.emailedReminder.push(object.email);

/**/
  this.itemsRef.update(temp.key, object).then(()=>{
if (!this.emailedReminder.includes(object.email)){

 //console.log('tries');
  fetch('<link to PHP script>', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: ''
}).then((res)=>{
   console.log(res);

}).catch((err)=>{
 

});

}
});


}

delsignout(i){


let prompt = this.alertCtrl.create({
      title: 'Are you sure?',
      subTitle:'You wish to delete this sign-out for '+this.statsVolunteer+'?',
     
      buttons: [
          {
              text: 'Cancel'
          },
          
          {
              text: 'Yes',
              handler: data => {
             let temp
             this.datab.forEach(a=>{
               if (a.payload.val().name==this.statsVolunteer){
                temp=a;

               }
             })

let signIns=temp.payload.val().signIns
let signOuts=temp.payload.val().signOuts


if (typeof signIns == 'undefined'){
  signIns=[];
}


if (signOuts.length>1){
signOuts.splice(i, 1)
}else{
signOuts=[]
}




let update={name:temp.payload.val().name,signIns:signIns, signOuts:signOuts}

this.itemsRef.update(temp.key, update);
window.location.reload(true);
this.FBsync();

              }
          }

      ]
  });
prompt.present(); 


}


moreInfo(name){
let temp
this.database.forEach(item=>{
  if (name==item.name){
temp=item;
  }
})

console.log('Volunteer: '+temp.name,temp);

  if (typeof temp.notes == 'undefined'){temp.notes=''}


let prompt = this.alertCtrl.create({
      title: 'Volunteer Information',
      subTitle:'Name: '+temp.name+'<br>Email: '+temp.email+'<br>Phone: '+temp.phone+'<br>EmergencyContact: '+temp.emername+'<br>EmergencyContact#: '+temp.emerphone+'<br>Over18: '+temp.minor+'<br>Orientation Date: '+temp.oridate+'<br>Notes: '+temp.notes,
     
      buttons: [
      {
              text: 'Breakdown',
              handler: data => {

this.statSearch(temp.name)

              }
          },

          {
              text: 'Edit',
              handler: data => {

this.editInfo(temp);

              }
          }
          /*,
          
          {
              text: 'Ok'
          }*/

      ]
  });
prompt.present(); 






}

breakdownShortcut(){

this.statSearch(undefined,true)
}


editInfo(data){


//console.log(data);
let prompt = this.alertCtrl.create({
      title: 'Edit Info for '+data.name,
      subTitle:'These changes are permanent',
     inputs:[
     {
        name: 'name',
        value: data.name,
                placeholder: 'name'

      },
      {
        name: 'email',
        value: data.email,
                placeholder: 'Contact Email'

      },
      {
        name: 'phone',
        value: data.phone,
           placeholder: 'Phone Number'
      },
      {
        name: 'emername',
        value: data.emername,
         placeholder: 'Emergency Contact'
      },
      {
        name: 'emerphone',
        value: data.emerphone,
        placeholder: 'Emergency Contact #'
      },
      {
        name: 'minor',
        value: data.minor,
        placeholder: 'Over 18?'
      },
      {
        name: 'oridate',
        value: data.oridate,
        placeholder: 'Orientation Date'
      },
      {
        name: 'notes',
        value: data.notes,
        placeholder: 'Notes'
      }

      // authorization? password? phone number? other info? Address?
     ],
      buttons: [
          {
              text: 'Cancel'
          },
          
          {
              text: 'Submit',
              handler: newdata => {
//newdata.name=data.name
let key
let signouts
let signins
this.datab.forEach(a=>{
if (data.name==a.payload.val().name){
  key=a.key;
  //console.log(a.payload.val());

  signouts=a.payload.val().signOuts;
  signins=a.payload.val().signIns;
}
})

if (!key){alert('Problem, no key found'); return}
if (typeof signouts !== 'undefined'){
newdata.signOuts = signouts
}
if (typeof signins !== 'undefined'){
newdata.signIns = signins
}





//console.log(newdata)
this.itemsRef.update(key, newdata);
window.location.reload(true);


              }
          }

      ]
  });
prompt.present(); 


}

deletebyname(name){
  let key=null
  let signouts=0;

this.datab.forEach(a=>{
  let c=a.payload.val()

  if (typeof c.signOuts == 'undefined'){c.signOuts=[]}
if (name==a.payload.val().name && signouts<=c.signOuts.length){
  key=a.key;}
})

if (key){
  this.itemsRef.remove(key);
  return true
}else{
	return false
}

}

deletevolun(){
//var data={name:'d',pass:''};
//console.log(data);
let prompt = this.alertCtrl.create({
      title: 'Delete Volunteer from Database',
      subTitle:'These changes are permanent. Use with Caution',
     inputs:[
     {
        name: 'name',
        //value: data.name,
        placeholder: 'Last, First (space after comma)'

      },
      {
        name: 'password',
        //value: data.pass,
        placeholder: 'Enter Deletion Password'

      }
     ],
      buttons: [
          {
              text: 'Cancel'
          },
          
          {
              text: 'Submit',
              handler: data => {
//alert(JSON.stringify(data));
              	if (data.password=='paws'){
		if (this.deletebyname(data.name)){
			alert('volunteer deleted successfully');
		}else{
			alert('user not found');
		}


              	}else{
alert('password wrong');
              	}

              }
          }]

      })
prompt.present(); 
}

debugtwo(){

this.deletebyname('Duffy, Williams')



console.log(this.database)

// de-duplicate
/*
let namelist:any=[]

this.database.forEach(a=>{
  if (!namelist.includes(a.name)){
    namelist.push(a.name)
  }else{
    this.deletebyname(a.name)
  }


})
*/
// sanitize
}

persontoSignIn(override:boolean=false,waiveroverride:boolean=false){


             let temp
             this.datab.forEach(a=>{
               if (a.payload.val().name==this.selVolunteer){
                temp=a;

               }
             })

             //alert(typeof temp.payload.val().signOuts);

if ((typeof temp.payload.val().waiver == 'undefined' || new Date(temp.payload.val().waiver).getTime()<this.waiverDate)&& !waiveroverride){

	//console.log(temp.payload.val().waiver)
	//console.log(this.waiverDate)
//console.log(temp.payload.val())
let prompt = this.alertCtrl.create({
      title: 'Sign New Waiver',
      subTitle:'There is a new waiver all volunteers need to sign, once submitted, ask for the password from a PCAR staff member',
     inputs:[
     {
        name: 'password',
        placeholder: 'Enter Password',
        type: 'password'
      }],
      buttons: [
          {
              text: 'Cancel'
          },
          
          {
              text: 'Enter',
              handler: data => {
if (data.password=="done"){
let update=temp.payload.val();
update.waiver=new Date();
this.itemsRef.update(temp.key, update);
this.persontoSignIn(false,true);
return true;

}else{
alert('incorrect password');
return false;
}

              }
          }

      ]
  });
prompt.present(); 

return;
}


if (typeof temp.payload.val().signIns !== 'undefined'){


var signInTimes:any=Object.keys(temp.payload.val().signIns).map(function(k) { return temp.payload.val().signIns[k] });



  var minusmnths:any=new Date(signInTimes[signInTimes.length-1]);

minusmnths=minusmnths.setMonth(minusmnths.getMonth()+3);

if ((new Date()>new Date(minusmnths)) && !override){

  //---------------------------------
// if last sign in is more than 3 months from current date, return and prompt if correct password is inputed, call this.persontoSignIn(true);

  //---------------------------------


let prompt = this.alertCtrl.create({
      title: 'Authorization Required',
      subTitle:'The last sign-in for ' +this.selVolunteer+' was more than 3 months ago. Authorization required.',
     inputs:[
     {
        name: 'password',
        placeholder: 'Enter Password',
        type: 'password'
      }],
      buttons: [
          {
              text: 'Cancel'
          },
          
          {
              text: 'Enter',
              handler: data => {
if (data.password=="Iwannaw@lk"){
this.persontoSignIn(true,true)
}else{
  alert('password incorrect');
}

              }
          }

      ]
  });
prompt.present(); 



return;
}





}else{
var signInTimes:any=[]
}

let date=new Date();

if (!signInTimes.includes(date)){
signInTimes.push(date)
}else{return}

if (typeof temp.payload.val().signOuts !== 'undefined'){

  var signOutTimes=Object.keys(temp.payload.val().signOuts).map(function(k) { return temp.payload.val().signOuts[k] });
}else{
    var signOutTimes=[]

}

if (signInTimes.length!==signOutTimes.length+1){
  alert('volunteer has corrupted data. Fix by deleting data in stats')
  return;
}

if (new Date(signInTimes[signInTimes.length-1]).getTime()-new Date(signInTimes[signInTimes.length-2]).getTime()<120000){
alert('operation not allowed 501 (consecutive sign-ins within two minutes of each other)');
  return
}
   
let update={name:temp.payload.val().name,signIns:signInTimes, signOuts:signOutTimes}

this.itemsRef.update(temp.key, update);
window.location.reload(true);

              

}

signin(){


if (!this.selVolunteer){
alert('Please select a Volunteer. If you are not listed, hit register');
  return}

let prompt = this.alertCtrl.create({
      title: 'Sign In?',
      subTitle:'Do you wish to sign in '+this.selVolunteer+'?',
     
      buttons: [
          {
              text: 'Cancel'
          },
          
          {
              text: 'Yes',
              handler: data => {

this.persontoSignIn()

              }
          }

      ]
  });
prompt.present(); 

}



signout(name){

let prompt = this.alertCtrl.create({
      title: 'Sign Out?',
      subTitle:'Sign Out '+name+'?',
     
      buttons: [
          {
              text: 'Cancel'
          },
          
          {
              text: 'YES',
              handler: data => {
this.signOutLogic(name)

              }
          }

      ]
  });
prompt.present(); 





}


signOutLogic(name,bool:boolean=true,giventime:any=new Date()){


                let temp
             this.datab.forEach(a=>{
               if (a.payload.val().name==name){
                temp=a;

               }
             })

             //alert(typeof temp.payload.val().signOuts);
if (typeof temp.payload.val().signIns !== 'undefined'){
var signInTimes:any=Object.keys(temp.payload.val().signIns).map(function(k) { return temp.payload.val().signIns[k] });
}else{
var signInTimes:any=[]
}


if (typeof temp.payload.val().signOuts !== 'undefined'){

  var signOutTimes:any=Object.keys(temp.payload.val().signOuts).map(function(k) { return temp.payload.val().signOuts[k] });
}else{
    var signOutTimes:any=[]

}

//let now=new Date()

// clamp
/*
if (now.getHours()>20 && new Date(signInTimes[signInTimes.length-1]).getHours()<=20){
alert('after hours, clamping to 8pm');
now=new Date(now.setHours(20))
}
*/
let date=giventime;

//console.log('datestamp',date);


if (new Date(signInTimes[signInTimes.length-1])>=date){
console.log('508 equal');
if (new Date(signInTimes[signInTimes.length-1])>date){
  alert('fatal error 508: last sign in more recent than current time. Last SignIn: '+new Date(signInTimes[signInTimes.length-1])+'current: '+date);
}

  return;
}

/**/
if (!signOutTimes.includes(date)){
/*
if (signOutTimes.length>0){
if(Math.abs(signOutTimes[signOutTimes.length-1].getTime()-date.getTime())<40000){
  console.log('return');
  return
}
}
*/

  signOutTimes.push(date)
}

if (signOutTimes.length>0){
if (Math.abs(new Date(signOutTimes[signOutTimes.length-1]).getTime()-new Date(signOutTimes[signOutTimes.length-2]).getTime())<120000){
alert('operation not allowed 503 (consecutive signouts within two minutes of each other)');
  return
}
}

//console.log(signOutTimes);
   
let update={name:temp.payload.val().name,signIns:signInTimes, signOuts:signOutTimes}

this.itemsRef.update(temp.key, update);

if (bool){
window.location.reload(true);
}
  
}

auth(state){


let prompt = this.alertCtrl.create({
      title: 'Authorization Required',
      subTitle:'A PCAR staff member must authorize this action with a password. They can either authorize the action once, or authorize for the entire session.',
     inputs:[
     {
        name: 'password',
        placeholder: 'Enter Password',
        type: 'password'
      }

     ],
      buttons: [
       
          {
              text: 'Once',
              handler: data => {

            if (data.password=="paws"){

if (state=="reg"){
  this.register(true);
}else if (state=="stats"){
  this.stats(true,true);
}else if (state=="manual"){
  this.manual(true,true);
}

  }else{
  	alert("password incorrect");
  }
              }
          },
          
          {
              text: 'Permanent',
              handler: data => {
                    if (data.password=="paws"){

                    this.unlocked=true;

                    if (state=="reg"){
                      this.register(true);
                    }else if (state=="stats"){
                      this.stats(true,true);
                    }else if (state=="manual"){
                      this.manual(true,true);
                    }

         localStorage.setItem("password", "paws");

  }else{
  	alert("password incorrect");
  }
              }
          }

      ]
  });
prompt.present(); 


}



logEveryoneOut(){
//alert('fires');
this.activeVolunteers.forEach(a=>{
//console.log(a);
                let temp
             this.datab.forEach(x=>{
               if (a.name==x.payload.val().name){
                temp=x;

               }
             })

//console.log(temp);
//alert(temp);
             //alert(typeof temp.payload.val().signOuts);
if (typeof temp.payload.val().signIns !== 'undefined'){
var signInTimes=Object.keys(temp.payload.val().signIns).map(function(k) { return temp.payload.val().signIns[k] });
}else{
var signInTimes=[]
}


if (typeof temp.payload.val().signOuts !== 'undefined'){

  var signOutTimes=Object.keys(temp.payload.val().signOuts).map(function(k) { return temp.payload.val().signOuts[k] });
}else{
    var signOutTimes=[]

}


signOutTimes.push(new Date())
   
let update={name:temp.payload.val().name,signIns:signInTimes, signOuts:signOutTimes}

this.itemsRef.update(temp.key, update);         
window.location.reload(true);
})

//window.location.reload(true);
}


register(bool:boolean=false){

if (!bool && !this.unlocked){
  this.auth('reg');
  return;
}

let prompt = this.alertCtrl.create({
      title: 'New Volunteer Form',
      subTitle:'Please Ensure you are not already registered and fill out the following',
     inputs:[
     {
        name: 'first',
        placeholder: 'First Name'
      },
      {
        name: 'last',
        placeholder: 'Last Name'
      },

      {
        name: 'email',
        placeholder: 'Contact Email'
      },
      {
        name: 'phone',
        placeholder: 'Phone Number'
      },
      {
        name: 'emername',
        placeholder: 'Emergency Contact'
      },
      {
        name: 'emerphone',
        placeholder: 'Emergency Contact #'
      },
      {
        name: 'minor',
        placeholder: 'Over 18?'
      },
      {
        name: 'oridate',
        placeholder: 'Orientation Date'
      },
      {
        name: 'notes',
        placeholder: 'Notes'
      }

      // authorization? password? phone number? other info? Address?
     ],
      buttons: [
          {
              text: 'Cancel'
          },
          
          {
              text: 'Submit',
              handler: data => {

if (!data.first || !data.last){
  alert('volunteer needs a name');
  return
}else{




  data.name=data.last+', '+data.first

  data.name=data.name.replace(
        /\w\S*/g,
        function(txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        }
    );


  delete data.first
  delete data.last



  let dup=false;

// check to make sure 
this.database.forEach(a=>{
  if (a.name==data.name){dup=true}
})

if (dup){
  alert('Volunteer Name '+data.name+' already in database');
  return;
}
}
// make sure email is valid, first and last capitizlied etc.... sanitize data. 

data.waiver = new Date().getTime();

this.itemsRef.push(data);
window.location.reload(true);
//console.log("fires");
//if (!this.unlocked){
//window.location.reload(true);
//}
              }
          }

      ]
  });
prompt.present(); 



}

statSearch(name?,bkdwn?){
if (typeof bkdwn !== 'undefined'){
  this.breakdown=true;
}


if (typeof name !== 'undefined'){
  this.statsVolunteer=name;
  var temporarydate=this.start;
  this.start='2016-01-01';
  //alert(typeof this.start);
  this.breakdown=true; 
}

this.results=[]

this.database.forEach(a=>{

let sess=0
let hrs=0;

if (typeof a.signOuts !== 'undefined'){

  if (typeof a.signIns == 'undefined'){
       a.signIns=[]
       }

var searchsignIns = []
var searchsignOuts = []
/**/
for (var i=0;i<a.signOuts.length;i++){

let addDay=new Date(this.end)
let endDay=new Date(addDay.setDate(addDay.getDate()+1))
//date.setDate(date.getDate() + 1)



if (new Date(a.signIns[i])>new Date(this.start) && new Date(a.signIns[i])<endDay){
	searchsignIns.push(a.signIns[i])
	searchsignOuts.push(a.signOuts[i])
sess++

let newdata =new Date(a.signOuts[i]).getTime()-new Date(a.signIns[i]).getTime();

if (newdata>0){

if (newdata>32400000){
  newdata=32400000;
} // clamp to 9 hours if more in that session


  hrs=hrs+newdata
  }



  }

}

if (this.breakdown){
  searchsignIns=a.signIns
  searchsignOuts=a.signOuts
}


}



hrs=Math.floor(hrs/36000)/100
let avg
if (hrs == 0){
avg=0
}else{
avg=Math.floor(hrs/sess*100)/100
}

/*
if (typeof a.signOuts == 'undefined'){
       a.signOuts=[]
}*/

//if (hrs>0){
this.results.push({name:a.name, hours:hrs , sessions:sess , average: avg, signins:searchsignIns, signouts:searchsignOuts})
//}
})

if (this.statsVolunteer==""){

this.hours=0;
this.sessions=0;


this.results.forEach(a=>{
  this.hours=this.hours+a.hours
  this.sessions=this.sessions+a.sessions
})

if (this.hours==0){this.avg=0}else{
  this.avg=Math.floor(this.hours/this.sessions*100)/100
}

this.searchQuery="All Volunteers"

}else{
this.searchQuery=this.statsVolunteer

this.results.forEach(a=>{

  if (a.name==this.statsVolunteer){

       this.hours=a.hours
       this.sessions=a.sessions
       this.avg=a.average
       if (typeof a.signins !== 'undefined'){
       this.individualsignins=a.signins
       }
     if (typeof a.signouts !== 'undefined'){
       this.individualsignouts=a.signouts
       }
  }



})




}
this.hours=Math.floor(this.hours*100)/100;

//console.log(this.results);

this.results.sort((a,b)=>{
if (a.hours > b.hours)
    return -1
if (a.hours < b.hours)
    return 1
return 0

})

// 


this.statsearchDone=true;
//this.start
//this.end

if (typeof name !== 'undefined'){
this.start=temporarydate
}


}


addSession(){

//this.forceReSync();
var today= new Date();

if (this.manVolunteer==''){
alert('select volunteer to add session for');
  return;
}

if (new Date(this.manenddate)>today || new Date(this.manstartdate)>today){
alert('Neither date can be in the future')
  return;
}

let hrs=Math.floor((new Date(this.manenddate).getTime()-new Date(this.manstartdate).getTime())/36000)/100

if (hrs<0){
alert('end cannot be earlier than start');
return;
}else if (hrs==0){
	alert('end cannot be equal to start');
	return;
}

let prompt = this.alertCtrl.create({
      title: 'Are you sure?',
      subTitle:'Add '+hrs+' hours to '+this.manVolunteer+' record?',
     
      buttons: [
          {
              text: 'Cancel'
          },
          
          {
              text: 'Yes',
              handler: data => {


                let temp
             this.datab.forEach(a=>{
               if (a.payload.val().name==this.manVolunteer){
                temp=a;

               }
             })





             //alert(typeof temp.payload.val().signOuts);
if (typeof temp.payload.val().signIns !== 'undefined'){
var signInTimes:any=Object.keys(temp.payload.val().signIns).map(function(k) { return temp.payload.val().signIns[k] });
}else{
var signInTimes:any=[]
}


if (typeof temp.payload.val().signOuts !== 'undefined'){

  var signOutTimes:any=Object.keys(temp.payload.val().signOuts).map(function(k) { return temp.payload.val().signOuts[k] });
}else{
    var signOutTimes:any=[]

}

if (signOutTimes.length!==signInTimes.length){
  alert('must fix corruptions before adding data');
  return;
}

if (signInTimes.includes(new Date(this.manstartdate) || signOutTimes.includes(new Date(this.manenddate)))){
  alert('duplicate info found');
  return;
}


// Test Overlap
let overlap=false;
signOutTimes.forEach((a,i)=>{

if (new Date(a)>new Date(this.manstartdate) && new Date(this.manstartdate)>new Date(signInTimes[i])){
  overlap=true;
}

if (new Date(a)>new Date(this.manenddate) && new Date(this.manstartdate)>new Date(signInTimes[i])){
  overlap=true
}

})

if (overlap){
  alert('This manual entry would overlap with pre-existing data. aborting. ');
  return
}


// hacky timezone bullshit

function dst (date) {

      var jan = new Date(date.getFullYear(), 0, 1);
    var jul = new Date(date.getFullYear(), 6, 1);

    return date.getTimezoneOffset() < Math.max(jan.getTimezoneOffset(), jul.getTimezoneOffset());
}

var offset=18000000

if (dst(new Date(this.manstartdate))){offset=offset-3600000}

signInTimes.push(new Date(new Date(this.manstartdate).getTime()+offset))
signOutTimes.push(new Date(new Date(this.manenddate).getTime()+offset))

// SORT HERE? IS THIS NECESSARY? yes. 

signInTimes.sort((a,b)=> {
  a=new Date(a)
  b=new Date(b)
    return a<b ? -1 : a>b ? 1 : 0;
});

signOutTimes.sort((a,b)=> {
    a=new Date(a)
  b=new Date(b)
    return a<b ? -1 : a>b ? 1 : 0;
});




let update={name:temp.payload.val().name,signIns:signInTimes, signOuts:signOutTimes}

this.itemsRef.update(temp.key, update);
// resync.....
this.FBsync()
this.manualupdate=true;
alert('added session successfully');
//window.location.reload(true);        

}}
]
})

prompt.present()
}

debug(){
//this.itemsRef.remove();
window.location.reload(true);
//this.itemsRef.push({ name: "Jocelyn Kraus"});

}


}

