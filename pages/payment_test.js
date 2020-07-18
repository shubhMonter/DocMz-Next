
import Link from "next/link";
import Router from "next/router";
import React, { Component } from "react";
import { connect } from "react-redux";
import onlyGuest from "../components/onlyGuest/onlyGuest";
import withBasicLayout from "../components/layouts/basic-layout/withBasicLayout";
import PaymentCard from "../components/payment/PaymentCard";
import Sidebar from "../components/payment-sidebar/Sidebar"
import { Modal, Layout, Button, Divider,Tabs } from "antd"
import { getOrder } from "../services/api";
const TabPane = Tabs.TabPane;
const { Content, Footer } = Layout
class PaymentTest extends Component {
    constructor() {
        super();
        this.state = {
            isload: false,
            methods:{},
            upi:''
        }
        this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

   async componentDidMount(){
       try {
        const res = await this.loadScript("https://checkout.razorpay.com/v1/razorpay.js");
        if (!res) {
            alert("failed to load script")
            return
        }
          
       } catch (err) {
           console.log(err);
           
       }
      
         
    }
  
    loadScript = (src) => {
        return new Promise((resolve) => {
            const script = document.createElement('script');
            script.src = src
            script.onload = () => {
                resolve(true)
            }
            script.onerror = () => {
                resolve(false)
            }
            document.body.appendChild(script);
        })

    }
    onChange(e) {
        this.setState({ [e.target.name]: e.target.value });
      }
    onSubmit(e){
        
        this.setState({methods:{
            method:'upi',
            upi:{
                vpa:this.state.upi,
                flow:"collect"
            }
        }});
        this.displayRazorpay();

    }
    displayRazorpay = async () => {

        try {
            
            const data = await getOrder();
            const { currency, amount, order_id } = data.data;

            let razpay = new Razorpay({ key: "rzp_test_fFhVXzu4VxWtSr" });
            console.log(razpay);
            
            razpay.createPayment({
                order_id,
                amount,
                customer_id:'cust_F4OYeJCkkRCfSz',
               // email:'sv.dixit10@gmail.com',
                //contact:'8668515796',
                save: 1,
                ...this.state.methods    
            });
            
            razpay.on('payment.success', function (resp) {
                alert(resp.razorpay_payment_id),
                    alert(resp.razorpay_order_id),
                    alert(resp.razorpay_signature)
            }); // will pass payment ID, order ID, and Razorpay signature to success handler.

               razpay.on('payment.error', function(resp){alert(resp.error.description)}); // will pass error object to error handler
        } catch (err) {
            console.log("dispayRazorfunc err", err);

        }

    }



    render() {
        const {methods,upi} = this.state ;
       console.log("new",methods);

       
       
        return (
            <div className=" maincontent-wrapper">
                <div className="container">

						<div
							style={{ background: "transparent", padding: 24, minHeight: 380 }}
							className="doctor-header"
						>
							{/* <Uppermsg /> */}
							<header className="App-header">{/* <Search /> */}</header>
                            <Tabs defaultActiveKey="1">
                                    <TabPane tab="Card" key="1">
                                        <PaymentCard
                                                        cvvOnCard={""}
                                                        expDateOnCard={""}
                                                        numberOnCard={""}
                                                        nameOnCard={""}
                                                        cardResponse={response => {
                                                        console.log("response", { response });
                                                        this.setState({methods:{method:'card',card:{
                                                            cvv:response.cardCV,
                                                            name:response.cardName,
                                                            number:response.cardNumber,
                                                            expiry_month:response.cardDate.split("/")[0],
                                                            expiry_year:response.cardDate.split("/")[1]
                                                        }}});
                                                        this.displayRazorpay();
                                                        }}
                                                        transactionData={e => {
                                                        cardDetailsWithNextStep(e);
                                                        }}
                                                        saveOptional={true}
                                                        backButton={() => {
                                                        toggleCard();
                                                        }}
                                                    />
                                             
                                               
                                    
                                                </TabPane>
                                    <TabPane tab="UPI"  key="2">
                                    <form className="payment-card-wrapper custom-payment-uppercard-ap-wrapper" >
                                     
                                        <div className="form-container-payment custom-ap-card-payment">
                                        <div className="field-container">
                                        <label for="upi">UPI ID</label>
                                        <input
                                        id="upiId"
                                        maxlength="20"
                                        type="text"
                                        value={upi}
                                        name="upi"
                                        onChange={e => this.onChange(e)}
                                        />
                                    </div>
                                    </div>
                                    <div className="field-container btn-container custom-ap-btn-containers-payment">
                                    <Button className="submit-btn custom-ap-back-btn"
                                    type="primary"  onClick={this.onSubmit}>click to payment</Button>
                                    </div>
                                    </form>

                                    </TabPane>
                                    <TabPane tab="Tab 3" key="3">Tab 3</TabPane>
                                </Tabs>
                                               
                                                    
											
						</div>					
                    
                </div>
            </div>
        )

    }
}




export default withBasicLayout(PaymentTest);