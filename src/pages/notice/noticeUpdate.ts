import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Http, Headers, RequestOptions } from '@angular/http';
//import { ModalController } from 'ionic-angular';
//import { NoticeDetailPage } from '../notice/noticeDetail'

@Component({
  selector: 'page-noticeUpdate',
  templateUrl: 'noticeUpdate.html'
})
export class NoticeUpdatePage
{
  notice: { 
    no: string,
    title: string,
    body: string,
    writerId: string,
    writer: string,
    date: string
  } = {
    no: "",
    title: "",
    body: "",
    writerId: "",
    writer: "",
    date: ""
  };


  constructor(public navCtrl: NavController, private navParams: NavParams, private http: Http)
  {
    this.notice.no = navParams.get("noticeNo");

    var addr = "http://1.221.205.250:8088/mobile/board/noticeView";
    let body = "noticeNo=" + this.notice.no;
    //let headers = new Headers({"Content-Type": "application/json"});
    let headers = new Headers({"Content-Type": "application/x-www-form-urlencoded"});
    let options = new RequestOptions({ headers: headers });

    this.http.post(addr, body, options)
      .map(res=>res.json())
      .subscribe((res)=>{
        this.notice.no = res.notice.noticeNo;
        this.notice.title = res.notice.noticeTitle;
        this.notice.body = res.notice.noticeBody;
        this.notice.writerId = res.notice.noticeWriterId;
        this.notice.writer = res.notice.noticeWriter;
        this.notice.date = res.notice.noticeDate;
      });
  }

  btnNoticeUpt()
  {
    var result;
    var addr = "http://1.221.205.250:8088/mobile/board/noticeUpdate";
    let body = "noticeTitle=" + this.notice.title
      + "&noticeBody=" + this.notice.body
      + "&noticeNo=" + this.notice.no
    ;
    //let headers = new Headers({"Content-Type": "application/json"});
    let headers = new Headers({"Content-Type": "application/x-www-form-urlencoded"});
    let options = new RequestOptions({ headers: headers });

    this.http.post(addr, body, options)
      .map(res=>res.json())
      .subscribe((res)=>{
        result = res.result;

        if (result == "S00000")
        {
          alert("수정이 완료되었습니다.");
          this.navCtrl.pop();
        }
        else
        {
          alert("수정이 실패하였습니다.");
          return false;
        }
      });
  }

  btnCancel()
  {
    this.navCtrl.pop();
  }
}
