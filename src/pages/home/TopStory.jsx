


import React from 'react'
import { Avatar } from '@material-tailwind/react'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import Slider from 'react-slick';



const scrollItems = [
  {
    name: "Aatif",
    url: "https://docs.material-tailwind.com/img/face-2.jpg"
  },
  {
    name: "Aatif",
    url: "https://docs.material-tailwind.com/img/face-2.jpg"
  },
  {
    name: "Aatif",
    url: "https://docs.material-tailwind.com/img/face-2.jpg"
  },
  {
    name: "Aatif",
    url: "https://docs.material-tailwind.com/img/face-2.jpg"
  },
  {
    name: "Aatif",
    url: "https://docs.material-tailwind.com/img/face-2.jpg"
  },
  {
    name: "Aatif",
    url: "https://docs.material-tailwind.com/img/face-2.jpg"
  },
  {
    name: "Aatif",
    url: "https://docs.material-tailwind.com/img/face-2.jpg"
  },
  {
    name: "Aatif",
    url: "https://docs.material-tailwind.com/img/face-2.jpg"
  }, {
    name: "Aatif",
    url: "https://docs.material-tailwind.com/img/face-2.jpg"
  }, {
    name: "Aatif",
    url: "https://docs.material-tailwind.com/img/face-2.jpg"
  }, {
    name: "Aatif",
    url: "https://docs.material-tailwind.com/img/face-2.jpg"
  },
]


const CustomArrow = ({ className, style, onClick, direction }) => (
  <div
    className={className}
    style={{
      ...style,
      display: "block",
      background: "black", // Arrow color
      borderRadius: "50%"
    }}
    onClick={onClick}
  />
);



const TopStory = () => {


  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 7,
    slidesToScroll: 1,
    arrows: true,
    nextArrow: <CustomArrow direction="right" />, // Right arrow
    prevArrow: <CustomArrow direction="left" />,   // Left arrow
  };



  return (

    <div className='h-1/6  flex justify-center   mx-auto py-2  bg-slate-500'>

      <div className='w-[90%] h-[100%]  '>

        <div className=" h-[100%]   ">

          <Slider {...settings}>

            {
              scrollItems && scrollItems.map((items, index) => {
                return (


                  <div key={index} className=''>
                    <div key={index} className={`   flex flex-col items-center justify-center `}>
                      <Avatar style={{
                        background: "radial-gradient(circle, rgba(63,94,251,1) 0%, rgba(252,70,107,1) 100%)",
                        // padding: "2px"
                        marginBottom: "4px"
                      }} src="https://docs.material-tailwind.com/img/face-2.jpg" alt="avatar" size="lg" />

                      <span className=' '>Aatif</span>
                    </div>

                  </div>

                )
              })
            }

          </Slider>
        </div>

      </div>



    </div>

  )
}

export default TopStory