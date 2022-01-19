import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import detectEthereumProvider from '@metamask/detect-provider'
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
  
  constructor(private api : ApiService) {

  }

  async ngOnInit(){
    const provider = await detectEthereumProvider()

    
    if (provider) {
 
      console.log('Ethereum successfully detected!')
     
      // From now on, this should always be true:
      // provider === window.ethereum
     
      // Access the decentralized web!
      //this.connectWallet();
      // Legacy providers may only have ethereum.sendAsync
      // const chainId = await provider.request({
      //   method: 'eth_chainId'
      // })
    } else {
     
      // if the provider is not detected, detectEthereumProvider resolves to null
      console.error('Please install MetaMask!', Error)
    }
    this.events = await this.api.getAllEvents().toPromise()
    
    if(this.curentAccount == window.ethereum)
    {
      console.log('test');
      
      this.connected = true;
    }
  }

  print() {
    console.log(this.connected);
    console.log(this.curentAccount);
    console.log(this.details);
    
  }

  participate() {
    console.log(this.details.payant)
    if (this.details.payant == 0)
    {
      //event gratuit 
      console.log(this.details.payant)
      console.log("gratuit");
      return false
    }
    else{
      console.log("payant");

      return true 
    }

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
          this.connected = false;
        } else {
          console.error(err);
          this.connected = false;
        }
      });
      this.connected = true;
    }
  }
 return(){
   this.clicked=false
 }
  sendTr(hostAccount: any) {
    if(window.ethereum){    
    window.ethereum.request({
      method: 'eth_sendTransaction',
      params: [
        {
          from: this.curentAccount,
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
  }


  filterEvent(str : any){
    console.log(str.target.value)
    this.events = this.events.filter((event)=>event.nom.includes(str.target.value))
  }
}
