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
            const res = await this.loadScript("https://checkout.razorpay.com/v1/razorpay.js"); 
        if(!res){
            alert("failed to load script")
            return
        }
        const data = await getOrder();
        const {currency,amount,order_id} = data.data;
        const card ={
        name: 'Gaurav Kumar',
        number: '4111111111111111',
        cvv: '566',
        expiry_month: '10',
        expiry_year: '20'
        };
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
        },       
    };
    console.log(options);
    
    var razpay = new Razorpay(options);
    razpay.createPayment({ amount: 5000,
        email: 'gaurav.kumar@example.com',
        contact: '9123456780',
        order_id,
        method: 'netbanking',
        bank: 'SBIN'});
    razpay.on('payment.success', function(resp) {
        alert(resp.razorpay_payment_id),
        alert(resp.razorpay_order_id),
        alert(resp.razorpay_signature)}); // will pass payment ID, order ID, and Razorpay signature to success handler.
    
      razpay.on('payment.error', function(resp){alert(resp.error.description)});
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