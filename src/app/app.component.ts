import { Component, OnInit } from '@angular/core';
//import detectEthereumProvider from '@metamask/detect-provider';
import Web3 from 'web3';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit{
  //web3 = new Web3('https://ropsten.infura.io/v3/2d0c4c5065844f828e66b7b2f543a119')
  
  //balance1 = this.web3.eth.getBalance('0x0bBDE21F24DBFdd67db8718dCFf373f7e6c07DaE')
  ethbalance: any
  web3: any
  
  // async Connect(){
  //   await window.web3.currentProvider.enable();
  //   this.web3 = new Web3(window.web3.currentProvider)
  // }


  constructor() {
    // console.log('ok');

  }
  async ngOnInit() {
   // this.Connect()
      //this.web3.eth.requestAccounts({method : "eth_requestAccounts"}).then(console.log)
      // if (typeof window.ethereum !== 'undefined') {
      //   console.log('MetaMask is installed!');
      // }
      // if (window.ethereum)
      // {
      //   window.ethereum.request({method: 'eth_requestAccounts', params: []})
      //   // .then((res)=>console.log(res))
        
        
      // }
   
  }



}
