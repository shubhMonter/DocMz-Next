import { Form, Icon, Input, Radio,Button } from "antd";
import Link from "next/link";
import Router from "next/router";
import React, { Component } from "react";
import { connect } from "react-redux";
import onlyGuest from "../components/onlyGuest/onlyGuest";
import withBasicLayout from "../components/layouts/basic-layout/withBasicLayout";
import { getOrder } from "../services/api";

class PaymentTest extends Component {
  constructor() {
    super();
    this.state={
        isload:false
    }
  }
   loadScript = (src)=>{
       return new Promise((resolve)=>{
        const script = document.createElement('script');
        script.src=src
        script.onload = ()=>{
            resolve(true)
        }
        script.onerror = () =>{
            resolve(false)
        } 
        document.body.appendChild(script);
       })
   
   }
    displayRazorpay = async() =>{

        try {
            const res = await this.loadScript("https://checkout.razorpay.com/v1/checkout.js"); 
        if(!res){
            alert("failed to load script")
            return
        }
        const data = await getOrder();
        const {currency,amount,order_id} = data.data;
    var options = {
        key: "rzp_test_fFhVXzu4VxWtSr", //use dev and production key 
        currency,
			amount,
			order_id,
        name: "Acme Corp",
        description: "Test Transaction",
        image: "https://example.com/your_logo",

        prefill: {
            name: "Gaurav Kumar",
            email: "gaurav.kumar@example.com",
            contact: "9999999999"
        }
    };
    var razpay = new Razorpay(options);
    razpay.open();
        } catch (err) {
            console.log("dispayRazorfunc err",err);
            
        }
        
   }
    
  
 
  render() {
    
    return (
        <div className=" maincontent-wrapper">
        <div className="container">
          <Button onClick={this.displayRazorpay.bind(this) } >
              click to payment
          </Button>
        </div>
        </div>
        )
  
  }
}




export default onlyGuest()(withBasicLayout(PaymentTest));