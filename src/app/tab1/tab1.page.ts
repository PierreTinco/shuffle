import { Component } from '@angular/core';
import Web3 from 'web3';
//import detectEthereumProvider from '@metamask/detect-provider';

declare let window: any;
@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  text = 'initial text';
  account: any
  // web3 = new Web3('HTTP://127.0.0.1:7545')

  // balance1 = this.web3.eth.getBalance('0x0bBDE21F24DBFdd67db8718dCFf373f7e6c07DaE')
  // ethbalance: any

  //  createMetaMaskProvider = require('metamask-extension-provider');

  // provider = this.createMetaMaskProvider();
  
  connectWallet (){
    if (window.ethereum)
    {
      window.ethereum.request({method: 'eth_requestAccounts', params: []})
      .then((res)=>this.account=res)
    }
  }



  changeText()  {
    this.text = 'changed';
    console.log(this.account);
    
  }
   sendTr() {
    if(window.ethereum){    
    window.ethereum.request({
      method: 'eth_sendTransaction',
      params: [
        {
          from: 0x0bBDE21F24DBFdd67db8718dCFf373f7e6c07DaE,
          to: '0x4967A396e284a074Cf779c758A9F8F77Bb2cC01B',
          value: '0x00',
          gasPrice: '0x09184e72a000',
          gas: '0x2710',
        },
      ],
    })
    .then((txHash) => console.log(txHash))
    .catch((_error: any) => console.error);}

}
  constructor() {

  }
  // ngOnInit(): void {
  //   this.balance1.then((res)=>{
  //     this.ethbalance =  this.web3.utils.fromWei(res, 'ether')
  //     console.log(this.ethbalance)
  //   },err=>console.log(err))  
  //   this.provider.on('error', (error) => {
  //     // Failed to connect to MetaMask, fallback logic.
  //   });
  // }
  
  

}
