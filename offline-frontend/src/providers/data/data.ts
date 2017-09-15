import { Storage } from '@ionic/storage';
import { Injectable} from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import { Network } from '@ionic-native/network';
import { Hotspot, HotspotNetwork } from '@ionic-native/hotspot';
import 'rxjs/add/operator/map';
import { Events } from "ionic-angular";

declare let WifiWizard: any;
@Injectable()
export class Data {

  isApp: boolean;
  constructor(public events: Events,public storage: Storage, private sqlite: SQLite, private http: Http, private network: Network) {
    this.isApp = !document.URL.startsWith('http');

  }
  gdb;
  items = [];
  testItem = {};
  getData() {
     let headers = new Headers();
    headers.append('Content-Type','application/json');
    let url = "http://10.222.41.33:8200/users/getall";
    return this.http.get(url,{headers:headers})
      .map(res => res.json());
    // return this.http.get(`http://10.222.41.33:8200/users/getall`).map((response: Response) =>{
    //   console.log("response"+response);
    //    //console.log("response in json"+JSON.stringify(response.json()));
    //   response.json()});
  }

  save(data) {
    console.log("inside save");

    if (!this.isApp) {
      this.http.post(`http://10.222.41.33:8200/users/save`, data).subscribe(data => {
        console.log(data);
        alert("Data Saved Succesfully in db");
                  
            //alert("event 2");
    this.events.publish('data:added');

      });
    }
    else {

      let newData = JSON.stringify(data);
      console.log(data.title);
      this.sqlite.create({
        name: 'data.db',
        location: 'default'
      })
        .then((db: SQLiteObject) => {

          this.gdb=db;
          db.executeSql('CREATE TABLE IF NOT EXISTS usernameList(id INTEGER PRIMARY KEY AUTOINCREMENT,title,description)', {})
            .then(() => {
               //alert('Executed SQL 1')
            }
            )
            .catch(e => console.log(e));

          //data insert section
          alert("You entered title as " + data.title);
          db.executeSql('INSERT INTO usernameList(title,description) VALUES(?,?)', [data.title,data.description])
            .then(() => {
            //alert('Executed SQL 2')
            }
            )
            .catch(e => console.log(e));


          db.executeSql('select * from usernameList', {}).then((data) => {

            // alert("runn after select" + JSON.stringify(data));

            //alert(data.rows.length);
            //alert(data.rows.item(5).name);
            this.items = [];
            if (data.rows.length > 0) {
              for (var i = 0; i < data.rows.length; i++) {
                //alert(data.rows.item(i).name);�
                this.items.push({ title: data.rows.item(i).title,
                description: data.rows.item(i).description });
                this.testItem = {
                  title: data.rows.item(i).title,
                  description:data.rows.item(i).description

                }

              }
           
              this.getCurrentSSID();
                       


            }

          }, (err) => {
            alert('Unable to execute sql: ' + JSON.stringify(err));
          });
        })
        .catch(e => alert(JSON.stringify(e)));


    }

  }


  // ssidHandler(s) {

  //   alert("Current SSID" + s);

  //   if (s == "\"PersistentWL\"") {
  //     alert("connected to pswl");
  //     this.http.post(`http://10.222.41.33:8200/users/save`, this.testItem).subscribe(data => {
  //       console.log(data);
  //       alert("Data Saved Succesfully in db");

  //     });

  //   }
  //    else {
  //     alert(s);
  //   }
  //   alert("exiting SSID Handler");
  // }

  fail(e) {
    alert("Cannot save to server right now, Offline Mode Enabled " + e);
  }

  getCurrentSSID() {

    if (typeof WifiWizard !== 'undefined') {

      var ref = this;
      // WifiWizard.getCurrentSSID(this.ssidHandler, this.fail);
      WifiWizard.getCurrentSSID((s) => {
        alert("Current SSID" + s);
        //alert("ref test" + ref.testItem);
        if (s == "\"PersistentWL\"") {
          alert("PersistentWL Authenticated");
         // alert(ref.items.length);
          ref.http.post(`http://10.222.41.33:8200/users/saveoffline`, ref.items).subscribe(data => {
            console.log(data);
            alert("Data Saved Succesfully in db");
            ref.gdb.executeSql('delete from usernameList',{}).then(()=>{
                  alert("Data synchronized from local to server");
                          
              ref.events.publish('data:added');
              //alert("event send");
                })
            //alert("after delete");

          });
        }

        else {
          alert(s + "This network is not authenticated");
         
        }
        // alert("exiting SSID Handler");

      }
        , this.fail);

    }
    else alert('WifiWizard not loaded');

  }
  connectSubscription = this.network.onConnect().subscribe(() => {
    console.log('network connected!');
    // We just got a connection but we need to wait briefly
    // before we determine the connection type. Might need to wait.
    // prior to doing any api requests as well.
    setTimeout(() => {
      if (this.network.type === 'wifi') {
        console.log('we got a wifi connection, woohoo!');
        alert("Connected to network,Synchronizing data");
        this.getCurrentSSID();
        //alert("after http");

      }
    }, 3000);
   
  });

  // stop connect watch
  // connectSubscription.unsubscribe();


}