import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { Http, Headers, RequestOptions } from '@angular/http';

@Component({
  selector: 'page-address',
  templateUrl: 'address.html'
})
export class AddressPage {

    keyword;
    addrList: any[];

  constructor(public navCtrl: NavController, private navParams: NavParams, private viewCtrl: ViewController, private http: Http) {
    this.keyword = navParams.get("keyword");
    //console.log("keyword : " + this.keyword);

    var totCount;
    //var addrList: any[];
    var addr = "http://1.221.205.250:8088/mobile/getAddress";
    let body1 = "keyword=" + this.keyword;
    //let headers = new Headers({"Content-Type": "application/json"});
    let headers = new Headers({"Content-Type": "application/x-www-form-urlencoded"});
    let options = new RequestOptions({ headers: headers });

    this.http.post(addr, body1, options)
      .map(res=>res.json())
      .subscribe((res)=>{
        totCount = res.totalCount;
        this.addrList = res.addrList;

        //console.log("totCount2 : " + totCount);
        //console.log("addrList2 : " + this.addrList[0].userAddrFull);
      });
  }

  onclick(userAddrFull, userAddrFullRoad, userAddrSido, userAddrSigungu, userAddrEMD, userAddrJibun, userAddrRoad, userAddrBuld, userZipcode)
  {
    //this.navCtrl.pop();
    this.viewCtrl.dismiss({
      userAddrFull : userAddrFull,
      userAddrFullRoad : userAddrFullRoad,
      userAddrSido : userAddrSido,
      userAddrSigungu : userAddrSigungu,
      userAddrEMD : userAddrEMD,
      userAddrJibun : userAddrJibun,
      userAddrRoad : userAddrRoad,
      userAddrBuld : userAddrBuld,
      userZipcode : userZipcode
    });
  }
}
