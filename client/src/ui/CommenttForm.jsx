import React, { useContext, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { MessageSquare } from "react-feather";
import Input from "@/components/Input";
import Button from "@/components/Button";
import Alert from "@/components/Alert";
import { UserContext } from "../App";
import { useNavigate } from "react-router-dom";
import RatingComponent from "../components/RatingComponent";
import api from '@/api'

export default function CommenttForm({ id }) {
  const user = useContext(UserContext);
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(0);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  async function handleSubmit(e) {
    e.preventDefault();
    // if (user) {
     
    //   };
      const resultObj = {
        productId: 31,
        comment: comment,
        rating: rating,
        user: {
          id: 2,
          name: user.name,
        },
    }
      setLoading(true)
      const response = await api
        .postComment(id, resultObj)
        .then(setLoading(false))
        .catch(e=>console.log("error at comment form "+e))
      if (response.status === 200) {
        alert("comment posted");
      }
    // } else {
    //   navigate("/login");
    // }
  }
  return (
    <div>
      <form
        className="flex items-center flex-col space-y-2"
        onSubmit={handleSubmit}
      >
        <Input
        className="w-1/2"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          icon={<MessageSquare width={20} height={20} />}
          type="text"
          placeholder="Please leave a review here "
          required
        />
        <RatingComponent rate={rating} cb={setRating} />
        <Button
          className=" !mt-6 !text-base !rounded-full"
          type="submit"
          disabled={loading}
        >
          {loading ? <Loader /> : "submit"}
        </Button>
      </form>
    </div>
  );
}
