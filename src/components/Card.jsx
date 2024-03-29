import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaHeart, FaShoppingCart } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Rating from "@mui/material/Rating";

export default function Card({ children, details }) {
  const userId = sessionStorage.getItem("id");
  const nav = useNavigate();
  const [isHovered, setIsHovered] = useState(false);

  const openPopup = (details) => {
    nav(`/shop/${details._id}`);
  };

  const add2Cart = async (productId, userId) => {
    if (!userId) {
      console.error("User ID is not available.");
      nav("/login");
      return;
    }

    try {
      const userResponse = await fetch(
        `${import.meta.env.VITE_API}users/${userId}`
      );
      const userResult = await userResponse.json();

      if (userResult.cart.some((item) => item.product === productId)) {
        console.log("Item is already in the cart");
        toast.success("Item already in Cart");
      } else {
        const cartResponse = await fetch(
          `${import.meta.env.VITE_API}users/cart`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              userId,
              product: productId,
            }),
          }
        );

        if (cartResponse.ok) {
          const cartResult = await cartResponse.json();
          console.log(cartResult.message);
          nav(`/cart`);
        } else {
          const errorResult = await cartResponse.json();
          console.error(
            "Error adding item to cart:",
            errorResult.error || "Unknown error"
          );
        }
      }
    } catch (error) {
      console.error("Error adding item to cart:", error);
    }
  };
  const add2Wishlist = async (productId, userId) => {
    if (!userId) {
      console.error("User ID is not available.");
      nav("/login");
      return;
    }

    try {
      const userResponse = await fetch(
        `${import.meta.env.VITE_API}users/${userId}`
      );
      const userResult = await userResponse.json();

      if (userResponse.ok) {
        if (userResult.wishlist.some((item) => item.product === productId)) {
          console.log("Item is already in the wishlist");
          toast.success("Item already in wishlist");
        } else {
          const wishlistResponse = await fetch(
            `${import.meta.env.VITE_API}users/wishlist`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                userId,
                product: productId,
              }),
            }
          );

          if (wishlistResponse.ok) {
            const wishlistResult = await wishlistResponse.json();
            console.log(wishlistResult.message);
            nav(`/wishlist`);
          } else {
            const errorResult = await wishlistResponse.json();
            console.error(
              "Error adding item to wishlist:",
              errorResult.error || "Unknown error"
            );
          }
        }
      } else {
        console.error(
          "Error fetching user data:",
          userResult.error || "Unknown error"
        );
      }
    } catch (error) {
      console.error("Error adding item to wishlist:", error);
    }
  };

  return (
    <div className="card-container overflow-x-auto flex flex-row flex-wrap justify-center">
      <ToastContainer />
      <div
        className="relative w-full max-w-[290px] border-2 max-h-[400px] hover:shadow-2xl flex flex-col justify-between m-2 lg:my-5"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative max-h-[250px] w-100% h-100%">
          {children}
          <img
            src={`${import.meta.env.VITE_API}uploads/${details.photo}`}
            alt="plant"
            className="w-full h-full object-cover hover:cursor-pointer"
            onClick={() => openPopup(details)}
          />
          <div
            className={`absolute top-4 right-4 flex flex-col gap-2 transition-all ${
              isHovered ? "opacity-100" : "opacity-0"
            }`}
          >
            <div
              className="rounded-full bg-white p-3 shadow"
              onClick={() => add2Wishlist(details._id, userId)}
            >
              <FaHeart className="text-[#303030] hover:scale-150 xs:size-3 sm:size-3 md:size-3 lg:size-4 xl:size-4 2xl:size-5" />
            </div>
            <div
              className="rounded-full bg-white p-3 shadow"
              onClick={() => add2Cart(details._id, userId)}
            >
              <FaShoppingCart className="text-[#303030] hover:scale-150 xs:size-3 sm:size-3 md:size-3 lg:size-4 xl:size-4 2xl:size-5" />
            </div>
          </div>
        </div>
        <div className="p-4 cursor-default">
          <h2 className="xs:text-xs sm:text-xs md:text-sm lg:text-md xl:text-md 2xl:text-lg font-bold mb-2">
            {details.name}
          </h2>
          <div className="flex flex-row -ml-0.5">
            <Rating
              name="size-small"
              readOnly
              defaultValue={details.rating}
              precision={0.5}
              size="small"
            />
            &nbsp;
            <p className="text-gray-600 -mt-1 ">({details.numOfRating})</p>
          </div>
          <p className="text-green-600 font-bold xs:text-xs sm:text-xs md:text-sm lg:text-md xl:text-md 2xl:text-lg">
            Rs: {details.price}
          </p>
        </div>
      </div>
    </div>
  );
}
