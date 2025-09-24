import React from 'react'
import '../component/CSS/Home.css'
import homePageImage from "../media/homePageImage.jpg"
import { Link } from 'react-router-dom'

const Home = () => {
  return (
    <div className='home'>
      <div className='homeTop'>
        <div className='homeTopLeft'>
          <h5>The Official Marketplace for UNILAG Students.</h5>
          <h3>Your trusted community to find deals, sell textbooks, and connect with campus mates. 100% verified students.</h3>
          
          <div className='homeTopBtns'>
            <div><Link to='' className='homeTopBtns1'>Find Deals</Link></div>
            <div><Link to='' className='homeTopBtns2'>Join Now</Link></div>
          </div>

        </div>

        <div className='homeTopRight'>
          <img src={homePageImage} alt="A Lady showing something on her phone to her friend" />
        </div>

      </div>

      <div></div>  
    </div>
  )
}

export default Home
