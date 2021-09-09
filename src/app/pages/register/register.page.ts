import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { GeneralService } from 'src/app/providers/general.service';
import { HttpService } from 'src/app/providers/http.service';
import { Camera, CameraOptions } from '@ionic-native/Camera/ngx';
import { ActionSheetController } from '@ionic/angular';
import { File } from '@ionic-native/file/ngx';
@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  public testForm: FormGroup;
  isSubmitted = false;
  croppedImagePath = "";
  isLoading = false;

  imagePickerOptions = {
    maximumImagesCount: 1,
    quality: 50
  };

  constructor(
    private formBuilder:FormBuilder,
    public general: GeneralService,
    private http:HttpService,
    private router:Router,
    private camera: Camera,
    public actionSheetController: ActionSheetController,
    private file: File

  ) { 
    this.testForm = this.formBuilder.group({
      name:['', [Validators.required, Validators.minLength(3)]],
      status:['', [Validators.required, Validators.minLength(3)]],
      image:['', [Validators.required]],
      email: ['', [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')]],
      password:['', [Validators.required]]
    })
  }

  ngOnInit() {
  }

  get f() {return this.testForm.controls;}

  submitForm() {
    this.isSubmitted = true;
    // this.testForm.patchValue({
    //   image:this.croppedImagePath
    // })
    if (!this.testForm.valid) {
      this.general.presentToast('Form Invalid!')
      return false;
    } else {
      this.http.postApi('api/creatUser',this.testForm.value,true).then((res:any) => {
        this.testForm.reset()
        this.router.navigate(['./home'])
      })
      
    }
  }



  pickImage(sourceType) {
    const options: CameraOptions = {
      quality: 100,
      sourceType: sourceType,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    }
    this.camera.getPicture(options).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      this.croppedImagePath = 'data:image/jpeg;base64,' + imageData;
      this.http.postApi('api/storeImg',{image:this.croppedImagePath},false).then((res:any)=>{})
    }, (err) => {
      // Handle error
    });
  }

  async selectImage() {
    const actionSheet = await this.actionSheetController.create({
      header: "Select Image source",
      buttons: [{
        text: 'Load from Library',
        handler: () => {
          this.pickImage(this.camera.PictureSourceType.PHOTOLIBRARY);
        }
      },
      {
        text: 'Use Camera',
        handler: () => {
          this.pickImage(this.camera.PictureSourceType.CAMERA);
        }
      },
      {
        text: 'Cancel',
        role: 'cancel'
      }
      ]
    });
    await actionSheet.present();
  }

}
