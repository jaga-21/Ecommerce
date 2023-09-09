import React, { useState } from 'react'
import Rating from "react-rating"
import { Star } from 'react-feather'
export default function RatingComponent({rate,cb}) {
    const[ rating,setRating]=useState(rate||0)
    const handleRating=(value)=>{
        setRating(value)
        if(cb){
            cb(value)
        }
    }
  return (
    <Rating
      start={0}
      stop={5}
      step={1}
      initialRating={rating}
      emptySymbol={<Star color='grey' fill='grey'/>}
      fullSymbol={<Star color='yellow' fill='yellow' />}
      onChange={cb}
      readonly={cb===null?true:false}
      onClick={(e)=>handleRating(e)} 
    />
  )
}
