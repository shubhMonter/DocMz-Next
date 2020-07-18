import React, { useState, useEffect } from "react";
import {
  Form,
  Icon,
  Button,
  Row,
  Col,
  Steps,
  Divider,
  Tabs
} from "antd";
const TabPane = Tabs.TabPane;
import { connect } from 'react-redux'

import AliceCarousel from 'react-alice-carousel'

import FormStep1 from "./FormStep1";
import FormStep2 from "./FormStep2";
import { patientCardList } from "../../services/api/patient";
import { getOrder,addPayment } from "../../services/api";
import PaymentCard from "../../components/payment/PaymentCard";
import AppointmentPayReview from "./AppointmentPayReview";
import AppointmentDoctor from "./AppointmentDoctor";
import Questionaire from "./Questionaire"; 
import './newappointmentap.scss'
import AppointmentShowCard from "./AppointmentShowCard";
const stepStyle = {
  marginBottom: 37,
  boxShadow: "0px -1px 0 0 #e8e8e8 inset"
};
const getCardData = async (customerProfile) => {
  // const userDetails = JSON.parse(localStorage.getItem("patient"));
  const res = await patientCardList(customerProfile)
  const cards = await res.data?.data

  return cards
  // .then(res => {
  //   console.log('patient', res)
  //   const { data } = res.data.data;
  //   cards = data;
  // })
  // .catch(err => {
  //   console.log({ err });
  // });
};

function onRadioChange(e) {
  console.log(`radio checked:${e.target.value}`);
}

// class AppointmentForm extends React.Component{ 
//   render () {
function AppointmentForm({ userDetails, ...formProps }) {
  const FormOne = Form.create({ name: "appointment_form_one" })(FormStep1);
  const FormTwo = Form.create({ name: "appointment_form_two" })(FormStep2);
  const FormThree = Form.create({ name: "appointment_form_three" })(Questionaire);
  const FormFour = Form.create({ name: "appointment_form_four" })(
    AppointmentPayReview
  );
  let formOne = React.createRef();
  let formTwo = React.createRef();
  let carousel = React.createRef();
  let questionaire = React.createRef();

  const [cards, setCards] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [value, setValue] = useState("");
  const [selectedCard, setSelectedCard] = useState(null);
  const [firstStapForm, setFirstStapForm] = useState("");
  const [secondStapForm, setSecondStapForm] = useState("");
  const [cardDetails, setCardDetails] = useState("");
  const [addCard, addCardToggle] = useState(false);
  const [method, setMethods] = useState("");
  const [upi, setUpi] = useState("");
  const [card,setCard] = useState({});
  

  useEffect(() => {
    getCardData(userDetails.customerProfile).then(({ data }) => {
      setCards(data)
    })
  }, cards)
  const next = () => {
    carousel.next();
  }
  const previous = () => {
    carousel.prev();
  }
  const props = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1
  };
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1
  };
  const { Step } = Steps;
  const handleSubmit = () => {
    formOne.current.validateFields((err, values) => {
      console.log("ccc", { values });
      if (!err) {
        setFirstStapForm(values);
        console.log("Received values of form: ", values);
        localStorage.setItem('duration', values.duration)
        localStorage.setItem('notes', values.notes)
        localStorage.setItem('reason', values.reason)
        setCurrentStep(1);
      }
    });
  };
  const cardDetailsWithNextStep = data => {
    setCardDetails(data);
    setCurrentStep(2);
  };
  const onCardSelect = card => {
    setSelectedCard(card)
    setCurrentStep(3)
  }
  const onStepChange = e => {
    if (e < currentStep) {
      setCurrentStep(e);
    }
  };
  const toggleCard = () => {
    addCardToggle(!addCard);
  };
  const setSavedCardData = data => {
    // setCardDetails(data);
    // setCurrentStep(3);
    console.log('currentstep', data)
    localStorage.setItem('patientcardid', data.id)
    localStorage.setItem('last4', data.last4)

  };
  const handleOnDragStart = (e) => {
    e.preventDefault()
    setCurrentStep(3);
  }
  const phonesubmit = e => {
    // setCardDetails(data);
    setCurrentStep(2);
  };
  const paymentslidersubmit = e => {
    // setCardDetails(data);
    setCurrentStep(3);
  };
  const [cardSelect, setCardSelect] = useState(null)
  const [slideIndex, setSlideIndex] = useState(2)
  const responsive = {
    0: {
      items: 2
    },
    1024: {
      items: 2
    }
  };
  const radioStyle = {
    display: 'block',
    height: '30px',
    lineHeight: '30px',
  };


  const slideTo = (i) => setSlideIndex(i)

  const onSlideChanged = (e) => setSlideIndex(e.item)

  const slideNext = () => setSlideIndex(slideIndex + 1)

  const slidePrev = () => setSlideIndex(slideIndex - 1)

  // const prefixSelector = getFieldDecorator('prefix', {
  //   initialValue: '86',
  // })(
  //   <Select style={{ width: 70 }}>
  //     <Option value="86">+86</Option>
  //     <Option value="87">+87</Option>
  //   </Select>,
  // );
  // const { Option } = Select
  // const { getFieldDecorator } = this.props.form;
  const loadScript = (src) => {
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

  const onSubmit = (e) => {
    e.preventDefault();
    displayRazorpay();
  }
  const displayRazorpay = async () => {

    try {
      const res = await loadScript("https://checkout.razorpay.com/v1/razorpay.js");
      if (!res) {
        alert("failed to load script")
        return
      }

      const data = await getOrder();
      const { currency, amount, order_id } = data.data;

      let razpay = new Razorpay({ key: "rzp_test_fFhVXzu4VxWtSr" });
      
      let option;

      if(method==="card"){
        option={
          order_id,
          amount,
          customer_id: 'cust_F4OYeJCkkRCfSz',
          email: 'sv.dixit10@gmail.com',
          contact: '8668515796',
          save: 1,
          method:method,
          card
        }
      }else if(method==="upi"){
        option={
          order_id,
          amount,
          customer_id: 'cust_F4OYeJCkkRCfSz',
          email: 'sv.dixit10@gmail.com',
          contact: '8668515796',
          save: 1,
          method:method,
          upi:{
            vpa:upi,
            flow:"collect"
          }
        }
      }

      razpay.createPayment(option);

      razpay.on('payment.success', async function (resp) {
       
         let pay=  await addPayment({
            doctor:formProps.doctor._id,
            patient:userDetails._id,
            transactionId:resp.razorpay_payment_id,
            amount
          });
          console.log(pay);
          
          
          setCurrentStep(3);
         // alert(resp.razorpay_order_id),
         // alert(resp.razorpay_signature)
      }); // will pass payment ID, order ID, and Razorpay signature to success handler.

      razpay.on('payment.error', function (resp) { alert(resp.error.description) }); // will pass error object to error handler
    } catch (err) {
      console.log("dispayRazorfunc err", err);

    }

  }
  return (
    <div className="c-appointment-form">
      <div className="c-appointment-form__header ap-appointment-form-custom">
        <Steps
          type="navigation"
          size="small"
          current={currentStep}
          onChange={onStepChange}
          style={stepStyle}
        >
          <Step
            // status={currentStep < 1 ? "finish" : "process"}
            title="Details"
          />
          <Step
            // status={currentStep < 2 ? "finish" : "process"}
            title="Visit Type"
          />
          <Step
            // status={currentStep < 3 ? "finish" : "process"}
            title="Payment"
          />
          <Step
            // status={currentStep < 4 ? "finish" : "process"}
          title="Questionaire"
          />
          <Step
            // status={currentStep < 5 ? "finish" : "process"}
            title="Review and Pay"
          />

        </Steps>
      </div>

      {/* <div className="below-para-steps-custom-ap">
        <p>We just need a few details to make your appointment smooth</p>
        <Divider />
      </div> */}
      {currentStep === 0 && (
        <div className="d-flex flex-column align-items-start flex-grow-1" >
          <Row className="w-100" >
            <Col span={24}>
              <p className="below-para-steps-custom-ap">We just need a few details to make your appointment smooth</p>
              <Divider />
            </Col>
          </Row>
          <Row type="flex" className="flex-grow-1 w-100" >

            <Col span={12}>
              <div className="c-appointment-form__steps d-flex flex-column h-100 align-items-start">
                <div className="c-appointment-form__step custom-ap-details-form-label w-100">
                  <FormOne ref={formOne} />
                </div>
                <button
                  type="primary"
                  className="ap-appointment-details-btn  btn btn-primary mt-auto"
                  onClick={() => {
                    if (typeof formOne.current.submit === "function") {
                      formOne.current.submit(handleSubmit);
                    }
                  }}
                >
                  Next
              </button>
              </div>
            </Col>
            <Col span={12}>
              <div className="c-appointment-form__doctor-wrapper">
                <AppointmentDoctor doctor={formProps.doctor} time="1040 - 1240" />
              </div>
            </Col>
          </Row>
        </div>
      )}
      {currentStep === 1 && (
        <div className="d-flex flex-column align-items-start flex-grow-1" >
          <FormStep2 />

          <button
            type="primary"
            className="ap-appointment-details-btn  btn btn-primary mt-auto"
            onClick={(e) => phonesubmit(e)}

          >
            Next
   </button>
        </div>
      )}
      {currentStep === 2 && (
        <div>
          <Row>
            <Col span={24}>
              <p className="below-para-steps-custom-ap">We will not share your payment details</p>
              <Divider />
            </Col>
          </Row>
          <Row type="flex">
            <Col span={24}>
              <div className="c-appointment-form__steps">
                <div className="c-appointment-form__step">
                  <Tabs defaultActiveKey="1" tabPosition="left">
                    <TabPane tab="Stripe Payment" key="1">
                      <Tabs defaultActiveKey="1">
                        <TabPane tab="Card" key="1">
                          <div className="">
                            {addCard ? (
                              <PaymentCard
                                cvvOnCard={""}
                                expDateOnCard={""}
                                numberOnCard={""}
                                nameOnCard={""}
                                cardResponse={response => {
                                  console.log("response", { response });
                                }}
                                transactionData={e => {
                                  cardDetailsWithNextStep(e);
                                }}
                                saveOptional={true}
                                backButton={() => {
                                  toggleCard();
                                }}
                              />
                            ) : (
                                <div className="custom-card-list-ap image_grid">

                                  {/*                
                                    <Radio.Group   
                                      name="type"
                                      style={{
                                        width: '100%'
                                      }}
                                      // onChange={(e) => {value = e.target.value }}
                                      // defaultValue={i}
                                      > */}
                                  <AliceCarousel mouseTrackingEnabled
                                    infinite={false}
                                    responsive={{
                                      0: {
                                        items: 1,
                                      },
                                      1024: {
                                        items: 2
                                      }
                                    }}
                                    // slideToIndex={slideIndex}
                                    // onSlideChanged={onSlideChanged}
                                    buttonsDisabled={true}
                                    dotsDisabled={true}
                                    keysControlDisabled={true}
                                  >

                                    {/* a{cards.length}a */}
                                    {
                                      cards.map((el, i) => (

                                        // <Radio key={i} value={i} 
                                        // // onChange={() => 
                                        // // setSavedCardData(el)
                                        // // }
                                        // >
                                        <div
                                          className="c-appointment-form__card-selector"
                                          key={i}
                                          // onClick={() => setSavedCardData(el)}
                                          onDragStart={handleOnDragStart}
                                        // className="image_grid"
                                        >
                                          <AppointmentShowCard
                                            key={i}
                                            cvvOnCard={''}
                                            flip={false}
                                            onClick={() => console.log('appointmentformcard')}

                                            expDateOnCard={el.exp_month + '/' + el.exp_year}
                                            numberOnCard={"xxxx xxxx xxxx " + el.last4}
                                            nameOnCard={"shubham"}
                                            transactionData=''

                                          />
                                          <br />
                                          <Button onClick={() => {
                                            onCardSelect(el)
                                          }} >Use This</Button>
                                          <br />
                                          <br />
                                        </div>
                                        // </Radio>
                                      ))
                                    }
                                  </AliceCarousel>
                                  {/* </Radio.Group> */}
                                  <Button
                                    className="c-appointment-form__card-tgl-btn"
                                    onClick={() => {
                                      toggleCard();
                                    }}
                                  >
                                    Add New <Icon type="plus" />
                                  </Button>
                                  {/* <Button
                                    style={{ float: 'right' }}
                                    type="primary"
                                    className="ap-appointment-details-btn"
                                    onClick={(e) => paymentslidersubmit(e)}
                                  >
                                    Next
                                  </Button> */}
                                </div>
                              )}
                          </div>
                        </TabPane>

                      </Tabs>
                    </TabPane>
                    <TabPane tab="RazorPay Payment" key="2">
                      <Tabs defaultActiveKey="1">
                        <TabPane tab="Card" key="1">
                          <PaymentCard
                            cvvOnCard={""}
                            expDateOnCard={""}
                            numberOnCard={""}
                            nameOnCard={""}
                            cardResponse={response => {
                              setMethods("card");
                              setCard({
                                cvv:response.cardCV,
                                name:response.cardName,
                                number:response.cardNumber,
                                expiry_month:response.cardDate.split("/")[0],
                                expiry_year:response.cardDate.split("/")[1]
                              })
                              displayRazorpay();
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
                        <TabPane tab="UPI" key="2">
                          <form className="payment-card-wrapper custom-payment-uppercard-ap-wrapper" style={{ display: "block" }}>

                            <div className="form-container-payment custom-ap-card-payment">
                              <div className="field-container">
                                <label for="upi">UPI ID</label>
                                <input
                                  id="upiId"
                                  maxlength="20"
                                  type="text"
                                  value={upi}
                                  name="upi"
                                  onChange={(e) => 
                                              { 
                                              setMethods("upi");
                                              setUpi(e.target.value);
                                              }
                                            }

                                />
                              </div>
                            </div>
                            <div className="field-container btn-container custom-ap-btn-containers-payment">
                              <Button className="submit-btn custom-ap-back-btn"
                                onClick={onSubmit}>click to payment</Button>
                            </div>
                          </form>

                        </TabPane>
                      </Tabs>
                    </TabPane>
                  </Tabs>


                </div>

              </div>
            </Col>
          </Row>
        </div>
      )
      }
      {currentStep === 3 &&(
        <div className="d-flex flex-column align-items-start flex-grow-1">
          <Questionaire />
        </div>
      )

      }
      {
        currentStep === 4 && (
          <div className="d-flex flex-grow-1">

            <Row type="flex" className="w-100">
              <Col span={24}>
                <FormThree
                  doctorId={formProps.doctorId}
                  firstFormData={firstStapForm}
                  cardDetails={cardDetails}
                  selectedCard={selectedCard}
                />
              </Col>
            </Row>
          </div>
        )
      }
    </div >
  );
}

const mapStateToProps = state => ({
  userDetails: state.loggedInPatient,
  appointmentTime: state.appointment.time,
})

export default connect(mapStateToProps)(AppointmentForm)
// }

// export default Form.create()(AppointmentForm)

