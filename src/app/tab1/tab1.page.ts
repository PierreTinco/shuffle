import { Component } from '@angular/core';
import Web3 from 'web3';
@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  text = 'initial text';
  web3 = new Web3('HTTP://127.0.0.1:7545')

  balance1 = this.web3.eth.getBalance('0x0bBDE21F24DBFdd67db8718dCFf373f7e6c07DaE')
  ethbalance: any

   createMetaMaskProvider = require('metamask-extension-provider');

  provider = this.createMetaMaskProvider();
  




  changeText()  {
    this.text = 'changed';

  }
  sendTr() {
    this.web3.eth.sendTransaction({
      from: "0xB0F069cc1811E9bfb0516bbCE1dA4f0a669D884e",
      gasPrice: "20000000000",
      gas: "21000",
      to: '0xEB65d6bC2239Ba9FB6563Ca4Fd78056fbcC864b7',
      value: "1000000000000000000",
      data: ""
  },).then(console.log);
  }
  constructor() {

  }
  ngOnInit(): void {
    this.balance1.then((res)=>{
      this.ethbalance =  this.web3.utils.fromWei(res, 'ether')
      console.log(this.ethbalance)
    },err=>console.log(err))  
    this.provider.on('error', (error) => {
      // Failed to connect to MetaMask, fallback logic.
    });
  }
  
  

}
