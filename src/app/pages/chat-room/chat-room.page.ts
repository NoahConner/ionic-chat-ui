import { Component, OnInit } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { GlobaldataService } from '../../providers/globaldata.service';
import { Observable } from 'rxjs';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
@Component({
  selector: 'app-chat-room',
  templateUrl: './chat-room.page.html',
  styleUrls: ['./chat-room.page.scss'],
})
export class ChatRoomPage implements OnInit {
  currentUser;
  crname;
  newMessage:any = '';
  chattUser ;
  chatterImg;
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
  newMsg:any;
  ionViewWillEnter(){
   
    this.currentUser = GlobaldataService.userName['_value'];
    this.chattUser = GlobaldataService.chattername['_value'];
    this.chatterImg = GlobaldataService.chatterImg['_value'];
    console.log(this.currentUser,this.chattUser)
  }
  ionViewWillLeave(){
    this.messages.map((val)=>{
      if(val.user == this.chattUser && val.readStatus == 'false'){
        val.readStatus = 'true'
      }
    })
    GlobaldataService.allmsgesObserv.next(this.messages);
  }
  constructor(
    private socket: Socket,
    private nativeStorage:NativeStorage
  ) { 
     GlobaldataService.allmsgesObserv.subscribe((res:any)=>{
      this.messages = res
     })
  }

  ngOnInit() {
    GlobaldataService.chattername.subscribe((res:any)=>{
      this.crname = res
    })
    this.messages = GlobaldataService.allMsgs;
     this.nativeStorage.getItem('currentUser')
    .then(
      data => (console.log(data.user[0].name)),
      error => (console.log(error))
    );
  }
  

  sendMessage(msgs: string){
    this.socket.emit("message", { msg: msgs, user: this.currentUser, receiver_id:this.chattUser, readStatus:'false' });
    this.newMessage = null
    console.log(this.currentUser,this.chattUser,this.messages)
  }
}
