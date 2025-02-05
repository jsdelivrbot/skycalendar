import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, AlertController, Platform} from 'ionic-angular';
import { Http, Headers, RequestOptions } from '@angular/http';
import * as moment from 'moment';
import 'rxjs/add/operator/map';
import { Push, PushToken } from '@ionic/cloud-angular';

@IonicPage()
@Component({
  selector: 'page-calendar-write-modal',
  templateUrl: 'calendar-write-modal.html',
})
export class CalendarWriteModalPage {
  event = { startTime: new Date().toISOString(), endTime: new Date().toISOString() }
  minDate = new Date().toISOString();
  cate1 = [];
  cate2 = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, private viewCtrl: ViewController, private alertCtrl: AlertController, private http: Http, public platform: Platform, public push: Push) {
    let preselectedDate = moment(this.navParams.get('selectedDay')).format();
    let cate1 = this.navParams.get('temp1');
    let cate2 = this.navParams.get('temp2');

    this.cate1 = cate1;
    this.cate2 = cate2;

    this.event.startTime = preselectedDate;
    this.event.endTime = preselectedDate;

  }

  // 취소버튼, 뒤로가기버튼 클릭시 모달창 닫기
  cancel() {
    this.viewCtrl.dismiss();
  }
  
  // 일정 저장 및 무결성검사
  save(event) {
    if (event.cate1 == "" || event.cate1 == null) {
      let alert = this.alertCtrl.create({
        title: '카테고리를 선택하세요',
        buttons: ['확인']
      });
      alert.present();

    } else if (event.cate2 == "" || event.cate2 == null) {
      let alert = this.alertCtrl.create({
        title: '세부카테고리를 선택하세요',
        buttons: ['확인']
      });
      alert.present();

    } else if (event.title == "" || event.title == null) {
      let alert = this.alertCtrl.create({
        title: '일정제목을 입력하세요',
        buttons: ['확인']
      });
      alert.present();

    } else if (event.content == "" || event.content == null) {
      let alert = this.alertCtrl.create({
        title: '일정내용을 입력하세요',
        buttons: ['확인']
      });
      alert.present();

    } else if (event.startTime > event.endTime) {
      let alert = this.alertCtrl.create({
        title: '날짜를 다시 선택해주세요',
        subTitle: '일정마감날짜가 일정시작날짜 이전입니다.',
        buttons: ['확인']
      });
      alert.present();

    } else if (event.completion == "" || event.completion == null) {
      let alert = this.alertCtrl.create({
        title: '진행률을 입력하세요',
        buttons: ['확인']
      });
      alert.present();

    } else if (isNaN(event.completion)) {
      let alert = this.alertCtrl.create({
        title: '숫자만 입력하세요',
        buttons: ['확인']
      });
      alert.present();

    } else if (event.completion > 100) {
      let alert = this.alertCtrl.create({
        title: '100이하의 숫자만 입력하세요',
        buttons: ['확인']
      });
      alert.present();


    } else {
      var addr = "http://1.221.205.250:8088/mobile/scheduleWrite";
      let headers = new Headers({ "Content-Type": "application/x-www-form-urlencoded" });
      let options = new RequestOptions({ headers: headers });

      if (event.memo == undefined) {
        event.memo = "";
      } 
      if (event.company == undefined){
        event.company = "";
      } 
      if (event.companyPerson == undefined){
        event.companyPerson = "";
      }
      let data = 'cate1=' + event.cate1
        + '&cate2=' + event.cate2
        + '&title=' + event.title
        + '&content=' + event.content
        + '&memo=' + event.memo
        + '&startTime=' + event.startTime
        + '&endTime=' + event.endTime
        + '&completion=' + event.completion
        + '&allDay=' + event.allDay
        + '&writerId=' + localStorage.getItem("userId")
        + '&company=' + event.company
        + '&companyPerson=' + event.companyPerson  
        + '&userNm=' + localStorage.getItem("userNm");

      this.http.post(addr, data, options)
        .map(res => res.json())
        .subscribe((res) => {
          let alert = this.alertCtrl.create({
            title: '일정이 등록되었습니다.',
            buttons: ['확인']
          });
          alert.present();

          event.calendarNo = res.schNo;
          
          console.log(data);
          console.log("======================================================");
          console.log(this.event);
          this.viewCtrl.dismiss(this.event);
          
        }, (err) => {
          console.log(err);
          let alert = this.alertCtrl.create({
            title: '일정이 등록되지 않습니다. 관리자에게 문의하세요',
            buttons: ['확인']
          });
          alert.present();

        });
     
        if (this.platform.is('android')) {
          // 푸시 Register
          this.push.register().then((t: PushToken) => {
              return this.push.saveToken(t);
          }).then((t: PushToken) => {
              console.log('Token saved:', t.token);
          });
  
          // 푸시 메세지 수신
          this.push.rx.notification()
              .subscribe((msg) => {
                  //alert(msg.title + ': ' + msg.text);
                  alert('일정추가');
          });   
      } else {
          console.log('not android');
      }    
    }
  }
}
