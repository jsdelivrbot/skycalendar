import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Http, Headers, RequestOptions } from '@angular/http';
import { NoticeUpdatePage } from '../notice/noticeUpdate';

@Component({
  selector: 'page-noticeDetail',
  templateUrl: 'noticeDetail.html'
})
export class NoticeDetailPage
{
    notice: any;
    noticeNo;
    rownum;
    noticeTitle;
    noticeBody;
    noticeWriterId;
    noticeWriter;
    noticeDate;
    
  constructor(public navCtrl: NavController, private navParams: NavParams, private http: Http)
  {
    var noticeNo = navParams.get("noticeNo");
    this.rownum = navParams.get("rownum");
    this.noticeNo = noticeNo;
    
    var addr = "http://1.221.205.250:8088/mobile/board/noticeView";
    let body = "noticeNo=" + noticeNo;
    //let headers = new Headers({"Content-Type": "application/json"});
    let headers = new Headers({"Content-Type": "application/x-www-form-urlencoded"});
    let options = new RequestOptions({ headers: headers });

    this.http.post(addr, body, options)
      .map(res=>res.json())
      .subscribe((res)=>{
        this.notice = res.notice;
        this.noticeNo = this.notice.noticeNo;
        this.noticeTitle = this.notice.noticeTitle;
        this.noticeBody = this.notice.noticeBody;
        this.noticeWriterId = this.notice.noticeWriterId;
        this.noticeWriter = this.notice.noticeWriter;
        this.noticeDate = this.notice.noticeDate;
      });
  }

  btnNoticeList()
  {
    this.navCtrl.pop();
    //this.navCtrl.
    //window.location.reload();
  }

  btnNoticeUpt()
  {
    var userId = localStorage.getItem("userId");

    if (userId == this.noticeWriterId)
    {
      this.navCtrl.push(NoticeUpdatePage, {noticeNo : this.noticeNo});
    }
    else
    {
      alert("작성자만 수정이 가능합니다.");
      return false;
    }
  }
  
  btnNoticeDel()
  {
    var userId = localStorage.getItem("userId");

    if (userId == this.noticeWriterId)
    {
      if (confirm("삭제 하시겠습니까?"))
      {
        var addr = "http://1.221.205.250:8088/mobile/board/noticeDel";
        let body = "noticeNo=" + this.noticeNo;
        //let headers = new Headers({"Content-Type": "application/json"});
        let headers = new Headers({"Content-Type": "application/x-www-form-urlencoded"});
        let options = new RequestOptions({ headers: headers });
        let result;

        this.http.post(addr, body, options)
          .map(res=>res.json())
          .subscribe((res)=>{
            result = res.result;

            if (result == "S00000")
            {
              alert("삭제가 완료되었습니다.");
              this.navCtrl.pop();
            }
            else
            {
              alert("삭제가 실패하였습니다.");
              return false;
            }
          });
      }
    }
    else
    {
      alert("작성자만 삭제가 가능합니다.");
      return false;
    }
  }
}
