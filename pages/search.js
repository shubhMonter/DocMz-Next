import withBasicLayout from '../components/layouts/basic-layout/withBasicLayout'
import SearchBar from '../components/search/search-bar/SearchBar'
import SearchCard from '../components/search-card/SearchCard'
import Loader from "../components/loader/Loader";
import { getDoctorsList, searchDoctors,searchDoctorsLite } from '../services/api'
import Moment from 'moment';
import classNames from 'classnames';
import { Affix } from 'antd';
import Router from "next/router";

class search extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            doctors: [],
            dates: [
                Moment(),
                Moment().add("days", 1),
                Moment().add("days", 2),
                Moment().add("days", 3),
                Moment().add("days", 4),
            ],
            isFixed: false,
            isLoading: true
        }
        this.onSearch = this.onSearch.bind(this);
    }
    componentDidMount() {
        if (Router.router.query.hasOwnProperty("specialty")) {

            const search = {
                specialty: Router.router.query.specialty,
                city: "New York",
                pageNo: 1,
                size: 10
            };
            searchDoctors(search).then(res => {
                console.log(res.data);

                this.setState({
                    doctors: [...res.data].filter(doctor => doctor.appointments && doctor.appointments.length > 0)
                });
            }).catch(err => console.log(err));


        } else if(Router.router.query.hasOwnProperty("name")){

            const search = {
                match:"{}",
                name:Router.router.query.name
            };
            searchDoctorsLite(search).then(res => {
                console.log(res.data);

                this.setState({
                    doctors: [...res.data.data]
                });
            }).catch(err => console.log(err));

        } else {
            getDoctorsList()
                .then(res => {
                    this.setState({
                        doctors: [...res.data].filter(doctor => doctor.appointments && doctor.appointments.length > 0)
                    });
                    if (this.state.doctors) {
                        this.setState({ isLoading: false });
                    }
                });
        }
    }
    onSearch = (docs) => {

        this.setState({ doctors: docs });
    }
    onDateChange = dates => this.setState({ dates })
    render() {
        const { doctors, isFixed, isLoading } = this.state

        return (<div className="c-search maincontent-wrapper" >
            <SearchBar getSearch={this.onSearch}
                specialities={this.props.specialities} />
            <div className={
                classNames({
                    "container": true,
                    // "container-fluid": isFixed,
                })
            } >
                <div className="p-5" > </div>
                <Affix offsetTop={0}
                    onChange={isFixed => this.setState({ isFixed })} >
                    <SearchCard showControl={true}
                        dates={this.state.dates}
                        onDateChange={this.onDateChange}
                        onlyDates={true}
                        doctor={
                            {}} />
                </Affix>
            </div>
            <Loader isLoading={isLoading} />
            <div className="container" > {
                doctors.map((doctor, i) => < SearchCard key={i}
                    dates={this.state.dates}
                    doctor={doctor}
                />)
            }
                <div className="p-5" > </div>
            </div>
        </div>
        )
    }
}

export default withBasicLayout(search)