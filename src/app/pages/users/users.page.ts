import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Socket } from 'ngx-socket-io';
import { GlobaldataService } from '../../providers/globaldata.service';
import { Observable } from 'rxjs';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { GeneralService } from 'src/app/providers/general.service';
import { AlertController } from '@ionic/angular';
import { HttpService } from 'src/app/providers/http.service';
@Component({
  selector: 'app-users',
  templateUrl: './users.page.html',
  styleUrls: ['./users.page.scss'],
})
export class UsersPage implements OnInit {
  users = [
    // {
    //   name:'Finn',
    //   status:"I'm a big deal",
    //   image:'finn',
    //   id:1,
    //   msgsCount:0,
    //   active_status:'disconnect'
    // },
    // {
    //   name:'Han Solo',
    //   status:"Look, kid...",
    //   image:'han',
    //   id:2,
    //   msgsCount:0,
    //   active_status:'disconnect'
    // },
    // {
    //   name:'Rey',
    //   status:"I can handle myself",
    //   image:'rey',
    //   id:3,
    //   msgsCount:0,
    //   active_status:'disconnect'
    // },
    // {
    //   name:'Luke',
    //   status:"Your thoughts betray you",
    //   image:'luke',
    //   id:4,
    //   msgsCount:0,
    //   active_status:'disconnect'
    // }
  ];
  allMsgs;
  cUser;
  messages = [];
  CEmail ;
  ionViewWillLeave(){
    // this.socket.emit('disconn', {name:GlobaldataService.userName['_value'],event: 'disconnect'});
    // this.http.postApi('api/edituser',{email:GlobaldataService.currentUserMail['_value'],active_status:'disconnect'},false).then((res:any)=>{
    // })
  }
  ionViewWillEnter(){
    
  }
  constructor(
    private router: Router,
    private socket: Socket,
    private cd: ChangeDetectorRef,
    private nativeStorage: NativeStorage,
    public general: GeneralService,
    public alertController: AlertController,
    private http:HttpService
  ) {
    console.log('ji')
    this.cUser = GlobaldataService.userName['_value']
    GlobaldataService.allmsgesObserv.subscribe( (value:any) => {
      this.allMsgs = value
      this.users.map((val0)=>{
        val0.msgsCount = 0
        this.allMsgs.map((val1)=>{
          if(val0.name == val1.user && val1.receiver_id == this.cUser && val1.readStatus == 'false'){
            val0.msgsCount = val0.msgsCount+1
          }
        })
      })
    });
    this.getMessages().subscribe((message:any) => {
      this.messages.push(message);
      GlobaldataService.allMsgs = this.messages;
      const dataArrWithSet = new Set(GlobaldataService.allMsgs);
      GlobaldataService.allMsgs = [...dataArrWithSet];
      this.messages = GlobaldataService.allMsgs;
      GlobaldataService.allmsgesObserv.next(this.messages);
    });

    this.leaveChatt().subscribe((res:any)=>{
      this.users.map((val)=>{
        if(val.name == res.name){
          val.active_status = 'disconnect'
          this.cd.detectChanges();
        }
      })
    });

    this.joinChat().subscribe((res:any)=>{
      this.users.map((val)=>{
        if(val.name == res.name){
          val.active_status = 'connect'
          this.cd.detectChanges();
        }
      })
    });

    this.http.getApi('api/allusers',false).then((res:any)=>{
      this.users = res
    })


    this.nativeStorage.getItem('currentUser')
    .then(
      data => (this.socket.emit('conn', {name:data.user[0].name,event: 'connect'}),
      this.http.postApi('api/edituser',{email:data.user[0].email,active_status:'connect'},false).then((res:any)=>{})
      ),
      error => (console.log(error),this.router.navigate(['./home']) )
    );

    
  }

  ngOnInit() {
    this.http.getApi('api/allusers',false).then((res:any)=>{})
    this.users.map((val)=>{
      if(val.name == GlobaldataService.userName['_value']){
        val.active_status = 'connect'
        this.cd.detectChanges();
      }
    })
  }

  chat(name,img){
    GlobaldataService.chattername.next(name);
    GlobaldataService.chatterImg.next(img);
    this.router.navigate(['./chat-room'])
  }

  getMessages() {
    let observable = new Observable(observer => {
      this.socket.on('message', (data) => {
        observer.next(data);
      });
    })
    return observable;
  }



  leaveChatt() {
    let observable = new Observable(observer => {
      this.socket.on('disconn', (data) => {
        observer.next(data);
      });
    })
    return observable;
  }

  joinChat() {
    let observable = new Observable(observer => {
      this.socket.on('conn', (data) => {
        observer.next(data);
      });
    })
    return observable;
  }

  async remove() {
    this.CEmail = GlobaldataService.currentUserMail['_value']
    const alert = await this.alertController.create({
      header: 'Logout',
      message: 'Are you sure you wanna logout?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
        }, {
          text: 'Okay',
          handler: () => {
            this.http.postApi('api/edituser',{email:this.CEmail,active_status:'disconnect'},false).then((res:any)=>{
              
            },err =>  this.general.presentToast(err))
            if(this.CEmail != ''){
              this.nativeStorage.remove('currentUser');
              this.socket.emit('disconn', {name:GlobaldataService.userName['_value'],event: 'disconnect'});
              this.router.navigate(['./home']);
            }
          }
        }
      ]
    });
    await alert.present();
  }

  publicChatt(){
    this.router.navigate(['./public-room']);
  }
}
