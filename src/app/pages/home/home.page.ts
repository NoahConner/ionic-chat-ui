import { Component, OnInit } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { GlobaldataService } from '../../providers/globaldata.service';
import { GeneralService } from '../../providers/general.service';
import { Router } from '@angular/router';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { HttpService } from 'src/app/providers/http.service';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  message = '';
  messages = [];
  currentUser = ''
  currentUserMail = ''
  constructor(
    private socket:Socket,
    public general:GeneralService,
    private router:Router,
    private nativeStorage: NativeStorage,
    private http : HttpService
  ) {}

ngOnInit(){
}

joinChat(pass,email){
  this.http.postApi('api/login',{email:email,password:pass},true).then((res:any)=>{
    console.log(res);
    if(res.status == 200){
      GlobaldataService.userName.next(res.user.name);
      GlobaldataService.currentUserMail.next(res.user.email);
      this.nativeStorage.setItem('currentUser', {user: [{name:res.user.name,email:res.user.email}]}).then(
        () => this.general.presentToast(`Welcome ${res.user.name}`),
        error => this.general.presentToast(error)
      );
        this.http.postApi('api/edituser',{email:res.user.email,active_status:'connect'},false).then((res:any)=>{
          this.router.navigate(['./users'])
        },err =>  this.general.presentToast(err))
    }
    else{
      this.general.presentToast('Unauthorized')
    }
  },err => console.log(err))
}



}
