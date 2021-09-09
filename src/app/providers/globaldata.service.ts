import { Injectable } from '@angular/core';
import { Observable,BehaviorSubject  } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class GlobaldataService {
  
  constructor() { }
  public static userName:BehaviorSubject<any> = new BehaviorSubject<any>('');
  public static chattername:BehaviorSubject<any> = new BehaviorSubject<any>('');
  public static chatterImg:BehaviorSubject<any> = new BehaviorSubject<any>('');
  public static allMsgs = [];
  public static allmsgesObserv: BehaviorSubject<any> = new BehaviorSubject<any>(GlobaldataService.allMsgs);
  public static pallMsgs = [];
  public static pallmsgesObserv: BehaviorSubject<any> = new BehaviorSubject<any>(GlobaldataService.allMsgs);
  public static currentUserMail:BehaviorSubject<any> = new BehaviorSubject<any>('');
}
