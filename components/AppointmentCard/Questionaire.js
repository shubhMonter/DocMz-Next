import { Form, Icon, Input, Radio, Checkbox } from "antd";
import React, { Component} from "react";
import { getQuesById } from '../../services/api'
import { connect } from "react-redux";

const { Item: FormItem } = Form;


class Questionaire extends Component {
  constructor() {
    super();
    this.state = {
      allquestions: {},
      root: 0,
      rootC: {
        status: false,
        value: 0
      },
      liveQ: {},
      nextQ: {},
      backQ: []
    };

  }
  componentDidMount() {
    getQuesById({ id: "5ed1feec6f8c2128c431d05f" }).then(res => {
      this.setState({ allquestions: res.data.question, liveQ: { questions: res.data.question } });
    }).catch(err => console.log(err));

    //this.setState({ allquestions: quest.question, liveQ: { questions: quest.question } });
  }

  handleSubmit = e => {
    e.preventDefault();
    const {
      form: { validateFields } } = this.props;
    validateFields((err, values) => {
      console.log(values);
    })
    this.NextQ();

  };
  NextQ = () => {
    if (this.state.rootC.status) {
      this.setState({ backQ: [...this.state.backQ, { questions: [...this.state.liveQ.questions], id: this.state.root }] })
      this.setState({ liveQ: this.state.nextQ })
      this.setState({ root: this.state.rootC.value });
      this.setState({ rootC: { status: false } })

    } else {
      this.setState({ backQ: [...this.state.backQ, this.state.liveQ] })
      this.setState({ liveQ: this.state.nextQ })
    }


  }
  BackQ = () => {

    let top = this.state.backQ.length - 1;
    if (top !== -1) {
      this.setState({ liveQ: this.state.backQ[top] });
      this.state.backQ.splice(top, 1);
      this.setState({ backQ: this.state.backQ });
    }
  }
  getQuestion = (questions, id) => {
    if (id === undefined || null) {
      id = this.state.root;
    }
    let fields, rad, ch
    let text = [], radio = [], checkbox = [];
    if (questions) {
      let q = questions[id];

      let Q = (<h2>{q.title}</h2>)

      if (q.option.length > 0) {
        q.option.map(op => {

          if (op.optionType === 'radio') {
            radio.push(<Radio key={op._id} value={op.text} onChange={(e) => {
              if (op.linkedQuestion.length > 0) {

                if (op.optionType === "text") {

                  this.setState({ nextQ: { questions: options, id: this.state.liveQ.id + 1 } })

                } else if (op.optionType === "checkbox") {
                  this.setState({ nextQ: { questions: options }, rootC: { status: true, value: this.state.root + 1 } })
                }
                else {

                  this.setState({ nextQ: { questions: op.linkedQuestion, id: 0 } })
                }
              } else {

                this.setState({ nextQ: { questions: this.state.allquestions }, rootC: { status: true, value: this.state.root + 1 } })

              }
            }
            } >{op.text}
            </Radio>)
          }
          if (op.optionType === 'checkbox') {
            checkbox.push(<Checkbox value={op.text} onChange={(e) => {
              console.log(e);
              this.setState({ nextQ: { questions: this.state.allquestions }, rootC: { status: true, value: this.state.root + 1 } })
            }}>{op.text}</Checkbox>)
          }
          if (op.optionType === 'text') {
            text.push(this.input(q.category + '-text'));
          }
        });

        if (radio.length > 0) {
          rad = this.radio(radio, q.category + '-radio');
        }
        if (checkbox.length > 0) {
          ch = this.checkbox(checkbox, q.category + '-checkbox');
        }
        fields = (<>{text}{rad}{ch}</>)

      }
      return (<>{Q}{fields}</>)
    } else {
      fields = (<p>questions list not found</p>)
      return (fields)
    }

  };
  checkbox = (options, name) => {
    const { getFieldDecorator } = this.props.form;
    return (
      <div className="pb-3">
        <FormItem>
          {getFieldDecorator(name, { rules: [] })
            (<Checkbox.Group >{options}</Checkbox.Group>)}
        </FormItem>

      </div>
    )
  }

  input = name => {
    const { getFieldDecorator } = this.props.form;
    return (<div className="">
      <FormItem>
        {getFieldDecorator(name, {
          rules: []
        })(
          <Input />
        )}
      </FormItem>
    </div>)
  };

  radio = (options, name) => {
    const { getFieldDecorator } = this.props.form;


    return (
      <div className="pb-3">
        <FormItem>
          {getFieldDecorator(name, { rules: [] })
            (<Radio.Group>
              {options}
            </Radio.Group>)}
        </FormItem>

      </div>)
  }

  render() {
    const { isPersist } = this.props;
    const {
      getFieldDecorator,
      getFieldsError,
      getFieldError,
      getFieldValue
    } = this.props.form;
    const { isLoading, errMsg } = this.state;



    if (!isPersist) {
      return <div />;
    }


    let fields;


    if (this.state.allquestions.length > 0) {
      if (this.state.allquestions.length === this.state.root) {
        fields = (<h3>form submited!!</h3>)
      } else {
        fields = this.getQuestion(this.state.liveQ.questions, this.state.liveQ.id);
      }

    }

    return (

      <div >
        <Form onSubmit={this.handleSubmit}>
          {fields}
          <div className="text-center d-block">
            <button
              onClick={this.BackQ}
              className="btn btn-primary btn-block"
              type="button"
            >
              back
                    </button>
            <button
              disabled={isLoading}
              className="btn btn-primary btn-block"
              type="submit"
            >
              submit
                    </button>
          </div>
        </Form>
      </div>

    );
  }
}
const mapStateToProps = state => ({
  ...state
});


export default Form.create()(connect(mapStateToProps)(Questionaire));
