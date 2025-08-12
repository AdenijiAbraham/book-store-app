import React from 'react'
import banner from '../../assets/banner.png';
const Banner = () => {
  return (
    <div className='flex flex-col md:flex-row-reverse  py-16 justify-between items-center  gap-12'>
      <div className='md:w-1/2 w-full flex items-center md:justify-end'>
             <img src={banner} alt=""/>  
        </div> 

         <div className='md:w-1/2 w-full'>
           <h1 className='md:text-5xl text-2xl font-medium mb-7 items-center'>New Release This week</h1>
           <p className='mb-10' >The wait is over—this week's new release is finally here! Whether you're a fan of innovation, entertainment, 
            or just staying ahead of the curve, this latest drop promises to make waves and spark conversation.</p>
 
 <button className='btn-primary'>Subscribe</button>
        </div> 
    </div>
  )
}

export default Banner;