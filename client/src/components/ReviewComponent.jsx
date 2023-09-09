import React, { useContext, useEffect, useState } from "react";
import RatingComponent from "./RatingComponent";


export default function ReviewComponent({ name, comment, rating}) {
   return  <>
    <section className="flex-1 sm:min-w-md divide-y divide-gray-200 border border-gray-300 rounded shadow my-2">
      <div className="flex flex-wrap items-center m-2 p-2">
        <div className="bg-white p-4 rounded-lg shadow-md w-100">
          <div className="font-semibold">{name}</div>
          <p className="text-gray-700">{comment}</p>
        </div>
        <div className=" flex ml-2  mx-auto">
          <RatingComponent rate={rating} cb={null}></RatingComponent>
          <div className="text-gray-700 ml-2">({rating})</div>
        </div>
      </div>
    </section>
	</>
  
}
