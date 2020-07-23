import withBasicLayout from '../components/layouts/basic-layout/withBasicLayout'
import React, { Component } from 'react'
import { Steps, Button, message } from 'antd';
import Link from 'next/link';
import RegisterInfo from '../components/Register/RegisterInfo';
import RegisterVerify from '../components/Register/RegisterVerify';
import RegisterUpload from '../components/Register/RegisterUpload';
import onlyGuest from '../components/onlyGuest/onlyGuest';

const { Step } = Steps;

class register extends Component {
    constructor(){
        super();
        this.state = {
            current: 0,
            infoForm: {
                userType: "doctor"
            },
            verifyForm: {
                _id: "5e510d5fb69de11c2c3d63c1"
            },
            uploadForm: {}
        }
    }
    next = () => this.setState(prevState => ({current: prevState.current + 1}));    
    prev = () => this.setState(prevState => ({current: prevState - 1}));

    onInfoSubmit = infoForm => this.setState({infoForm}, this.next)
    onVerifySubmit = verifyForm => {
        const {
            infoForm
        } = this.state
        if(infoForm.userType === "doctor"){
            this.setState({verifyForm}, this.next)
        }else{
            this.setState({
                verifyForm,
                current: 3
            })
        }
    }
    onUploadSubmit = uploadForm => this.setState({uploadForm}, this.next)
    
    render() {
        const { current, infoForm } = this.state;
        console.log(current);
        const steps = [
            {
                title: "Join For a Good Start",
                subTitle: "Consectetur adipisicing elit sed dotem eiusmod tempor incune utnaem labore etdolore maigna aliqua enim poskina",
                content: <RegisterInfo onSubmit={this.onInfoSubmit} />
            },
            {
                title: "Join For a Good Start",
                subTitle: "Consectetur adipisicing elit sed dotem eiusmod tempor incune utnaem labore etdolore maigna aliqua enim poskina",
                content: <RegisterVerify 
                    infoFormDetails={infoForm}
                    isDoctor={infoForm.userType === "doctor" } 
                    onSubmit={this.onVerifySubmit} 
                />
            },
            {
                title: infoForm.userType === "doctor" ? "Upload Your Documents " : "You're Almost There",
                subTitle: "Consectetur adipisicing elit sed dotem eiusmod tempor incune utnaem labore etdolore maigna aliqua enim poskina",
                content: infoForm.userType === "doctor" ? <RegisterUpload onSubmit={this.onUploadSubmit} /> : ""
            },
            {
                title: "Thanks for Joining us",
                subTitle: "Consectetur aipisicing elit sed dotem eiusmod tempor incune utnaem labore etdolore maigna aliqua enim poskina",
                content: infoForm.userType === "doctor" ? <div className="p-5 text-center">
                    <Link href="/doctor/dashboard">
                        <a className="btn btn-primary">
                            Go to your Dashboard
                        </a>
                    </Link>
                </div> : ""
            },
        ]
        return (
            <div className="p-register maincontent-wrapper">
                <div className="container">
                    <div className="row justify-content-center pb-5 p-register__full-row">
                        <div className="p-register__wrapper bg-light p-5 col-xs-12 col-sm-12 col-md-12 col-lg-8  col-xl-6 ">
                            <div className="p-register__inner">
                                <div className="p-register__intro text-center pb-3">
                                    <h3>{steps[current].title}</h3>
                                    <p>{steps[current].subTitle}</p>
                                </div>
                                <div className="p-register__step-wrapper">
                                    {
                                        (current !== steps.length -1 )&&
                                        <Steps current={current}>
                                            {steps.map((item, key) => (
                                                <Step key={key} />
                                            ))}
                                        </Steps>
                                    }
                                    {
                                      steps[current].content  
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default onlyGuest()(withBasicLayout(register))
