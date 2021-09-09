import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { GeneralService } from './general.service';

@Injectable({
  providedIn: 'root'
})
export class HttpService {
headers:any;
  constructor(
  	private http: HttpClient,
  	public general: GeneralService
  	) {

  	}

globalUrl:string = 'http://localhost/apiApp/';

api = {
	signup: '/signup',
  userupdate: '/updateuser',
}

  	postApi(link:string, data:any, loader:boolean){
	    if(loader == true){
	    	this.general.presentLoading();
	    }
	  	this.headers = {'Content-Type':'application/json'};
	  	return new Promise(resolve => {
	  		this.http.post(this.globalUrl+link, JSON.stringify(data), {headers: this.headers})
	  		.subscribe(data => {
	  			if(loader == true){
	              this.general.stopLoading();
	            }
	            resolve(data);

	        },
	    	(err) => {
		        console.log("Error" + err)
		        if(loader == true){
					this.general.stopLoading();
				  }
	       	})
	    });
	}


	getApi(link:string, loader:boolean){
	    if(loader == true){
	    	this.general.presentLoading();
	    }
	  	this.headers = {'Content-Type':'application/json'};
	  	return new Promise(resolve => {
	  		this.http.get(this.globalUrl+link, {headers: this.headers})
	  		.subscribe(data => {
	  			if(loader == true){
	              this.general.stopLoading();
	            }
	            resolve(data);

	        },
	    	(err) => {
		        console.log("Error" + err)
		        if(loader == true){
					this.general.stopLoading();
				  }
	       	})
	    });
	}
}