import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
//import detectEthereumProvider from '@metamask/detect-provider';
import Web3 from 'web3';
declare let window: any;

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit{
  details: any
  events : any
  provider: any
  clicked = false
  connected = false;  
  curentAccount: any
  searchText = ""
  web3 = new Web3('https://ropsten.infura.io/v3/2d0c4c5065844f828e66b7b2f543a119')
  balance1: any
  free = false; 
  constructor(private api : ApiService) {

  }

  async ngOnInit(){
    //const provider = await detectEthereumProvider()
    //console.log(window.ethereum.selectedAdress);
    //console.log(window.ethereum.networkVersion);
    
    
    // if (provider) {
 
    //   console.log('Ethereum successfully detected!')
     
    //   // From now on, this should always be true:
    //   // provider === window.ethereum 

    //   // Access the decentralized web!
    //   //this.connectWallet();
    //   // Legacy providers may only have ethereum.sendAsync
    //   // const chainId = await provider.request({
    //   //   method: 'eth_chainId'
    //   // })
    // } else {
     
    //   // if the provider is not detected, detectEthereumProvider resolves to null
    //   console.error('Please install MetaMask!', Error)
    // }
    this.events = await this.api.getAllEvents().toPromise()
    
    // if(window.ethereum.selectedAdress == window.ethereum)
    // {
    //   console.log('test');
      
    //   this.connected = true;
    // }
  }

  async print() {
    console.log(window.ethereum.selectedAdress);
    console.log(this.connected);
    console.log(this.curentAccount);
    this.balance1 = await this.web3.eth.getBalance('0x0bBDE21F24DBFdd67db8718dCFf373f7e6c07DaE')
    console.log(this.balance1);
    
  }

  participateFree()
  {
    
  }

  participate(walletAdress: any) {
    this.sendTr(walletAdress)
}



  connectWallet (){
    if (window.ethereum)
    {
      window.ethereum.request({method: 'eth_requestAccounts', params: []})
      .then((res)=>this.curentAccount=res)
      .catch((err) => {
        if (err.code === 4001) {
          // EIP-1193 userRejectedRequest error
          // If this happens, the user rejected the connection request.
          console.log('Please connect to MetaMask.');
          this.connected = false
          return
        } else {
          console.error(err);
          this.connected = false;
          return
        }
      });
      this.connected = true;
    }
  }
 
 
  return(){
   this.clicked=false
 }


  sendTr(hostAccount: any) {
    console.log(this.curentAccount);
    console.log(hostAccount);
    
    if(window.ethereum){    
    window.ethereum.request({
      method: 'eth_sendTransaction',
      params: [
        {
          from: this.curentAccount[0],
          to: hostAccount,
          value: '1000000000000000',
        },
      ],
    })
    .then((txHash) => console.log(txHash))
    .catch((_error: any) => console.error);}

  }
  viewMore(id :any){
    console.log(id,"id de levent que lon veut ouvrir")
    this.clicked=!this.clicked
    this.details = this.events.filter((event)=>event.id==id)
    console.log(this.details,"this.details")
    if (this.details[0].free == 1)
      this.free = true
    else
      this.free = false

  }

    
    
  


  filterEvent(str : any){
    console.log(str.target.value)
    this.events = this.events.filter((event)=>event.nom.includes(str.target.value))
  }
}
