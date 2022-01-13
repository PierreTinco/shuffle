import { Component } from '@angular/core';
import Web3 from 'web3';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  web3 = new Web3('https://mainnet.infura.io/v3/2d0c4c5065844f828e66b7b2f543a119')
  balance1 = this.web3.eth.getBalance('0x627757dc404261006A77cfbDeDDe401B280b41FA')
  ethbalance: any
  
  constructor() {
    // console.log('ok');
  }
  ngOnInit(): void {
    this.balance1.then((res)=>{
      this.ethbalance =  this.web3.utils.fromWei(res, 'ether')
      console.log(this.ethbalance)
    },err=>console.log(err))
  }
}
