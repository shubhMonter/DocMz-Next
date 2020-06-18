import parse from 'html-react-parser';
import { useState, useRef } from 'react'
import Link from 'next/link'
import { Carousel} from 'antd'
import { HeartFilled, HeartOutlined, StarFilled } from '@ant-design/icons'
import AppointmentCard from "../AppointmentCard/AppointmentCard"
import { getName, getAddress, getTaxonomy } from '../../services/extra/DoctorHelpers';

const SearchCard = ({doctor, dates, onlyDates, showControl, onDateChange}) => {
   
    const [isFav, setIsFav] = useState(false)
    const slider = useRef()
    const next = () => {
        if(slider && slider.current)
            slider.current.next()
    }
    const prev = () => {
        if(slider && slider.current)
            slider.current.prev()
    }
    return (
        <div className="c-search-card">
            <div className="c-search-card__inner">
                <div className="c-search-card__image-wrapper">
                    {!onlyDates && <>
                        <div className="c-search-card__fav-icon" onClick={()=>setIsFav(!isFav) }>
                            {
                                isFav ? <HeartFilled /> : 
                                <HeartOutlined />
                            }
                        </div>
                        <div onClick={prev} className="c-search-card__slide-icon c-search-card__slide-icon--prev"></div>
                        <div onClick={next} className="c-search-card__slide-icon c-search-card__slide-icon--next"></div>
                        <Carousel ref={slider}>
                            <img src="//via.placeholder.com/350x200" className="c-search-card__img" />
                            <img src="//via.placeholder.com/350x200" className="c-search-card__img" />
                            <img src="//via.placeholder.com/350x200" className="c-search-card__img" />
                        </Carousel>
                    </>}
                </div>
                <div className="c-search-card__intro-wrapper">
                    {!onlyDates && <>
                        <p className="c-search-card__designation">
                            <span className="c-search-card__designation-holder">
                                {getTaxonomy(doctor)}
                            </span>
                            <span className="c-search-card__rating-holder"><StarFilled />4.5 <span>(200)</span></span>
                        </p>
                        <Link href={`/doctors/${doctor._id}`}>
                            <a className="c-search-card__name h5">{parse(getName(doctor))}</a>
                        </Link>
                        <address className="c-search-card__address">{getAddress(doctor)}</address>
                        <div className="c-search-card__rate-wrapper mt-auto text-right">
                            <b>$200</b>/ visit
                        </div>
                    </>}
                </div>
                <div className="c-search-card__appointment-wrapper">
                    <AppointmentCard dates={dates} onDateChange={onDateChange} showControl={showControl} onlyDates={onlyDates} doctor={doctor} />
                </div>
            </div>
        </div>
    )
}

export default SearchCard