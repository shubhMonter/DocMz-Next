import {useRef} from 'react'
import Flickity from 'react-flickity-component';
const FlicktySlider = ({children}) => {
    const sliderLine = useRef(null)
    let left = 0
    const flickityInit = () => {
        setTimeout(() => {
            if(flkty){
                flkty.on("scroll", progress => {
                    if(!isNaN(progress)){
                        let pos = `${progress * .90}%`;
                        sliderLine.current.style.left = pos
                    }
                });
            }
        }, 200);
    }
    let flkty = undefined
    return (
        <div className="c-flickty">
            <Flickity
                options={{
                    initialIndex: 0,
                    pageDots: false,
                    cellAlign: 'left',
                    contain: true,
                    on: {
                        ready: () => {
                          flickityInit();
                        }
                    }
                }}
                flickityRef={c => (flkty = c)}
                disableImagesLoaded={false}
                reloadOnUpdate={true}
                className="c-flickty__slider cards"
                
            >
                {children}
            </Flickity>
            <div>
                <div ref={sliderLine} left={left} />
            </div>

        </div>
    )
}

export default FlicktySlider