import { Component, OnInit } from '@angular/core';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { Socket } from 'ngx-socket-io';
import { GlobaldataService } from '../../providers/globaldata.service';
import { Observable } from 'rxjs';
@Component({
  selector: 'app-public-room',
  templateUrl: './public-room.page.html',
  styleUrls: ['./public-room.page.scss'],
})
export class PublicRoomPage implements OnInit {
  messages = [
    // {
    //   user:'yasir',
    //   createdAt:1234234,
    //   msg:'Hi there its chatter box'
    // },
    // {
    //   user:'anonymouse',
    //   createdAt:1234234,
    //   msg:'Seems cool!'
    // },
    // {
    //   user:'yasir',
    //   createdAt:1234234,
    //   msg:'yah!'
    // }
  ];
  newMessage:any = '';
  currentUser;

  ionViewWillEnter(){
   
    this.currentUser = GlobaldataService.userName['_value'];
  }

  constructor(
    private socket: Socket,
    private nativeStorage:NativeStorage
  ) { 
    GlobaldataService.pallmsgesObserv.subscribe((res:any)=>{
      this.messages = res;
      console.log(this.messages)
    });
    this.getPMessages().subscribe((message:any) => {
      this.messages.push(message);
      GlobaldataService.pallMsgs = this.messages;
      const dataArrWithSet = new Set(GlobaldataService.pallMsgs);
      GlobaldataService.pallMsgs = [...dataArrWithSet];
      this.messages = GlobaldataService.pallMsgs;
      GlobaldataService.allmsgesObserv.next(this.messages);
    });
  }

  ngOnInit() {
  }

  getPMessages() {
    let observable = new Observable(observer => {
      this.socket.on('publicmessage', (data) => {
        observer.next(data);
      });
    })
    return observable;
  }

  sendMessage(msgs: string){
    
    this.socket.emit("publicmessage", { msg: msgs, user: this.currentUser });
    this.newMessage = null
  }

}
