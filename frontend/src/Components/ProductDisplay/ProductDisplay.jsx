import React, { useContext, useState } from "react";
import star_icon from "../Assets/star_icon.png";
import star_dull_icon from "../Assets/star_dull_icon.png";
import { ShopContext } from "../../Context/ShopContext";

const ProductDisplay = (props) => {
  const { product } = props;
  const { addToCart } = useContext(ShopContext);

  // State for managing the quantity within the `- 1 +` buttons
  const [quantity, setQuantity] = useState(1);

  // Function to format prices with commas
  const formatPrice = (price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  // Handlers for incrementing and decrementing the quantity
  const incrementQuantity = () => setQuantity((prev) => prev + 1);
  const decrementQuantity = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  return (
    <div className="flex flex-col lg:flex-row gap-8 p-6 shadow-lg rounded-lg">
      {/* Left Section: Image Gallery */}
      <div className="flex flex-col lg:flex-row items-center gap-16 w-full lg:w-2/3">
        {/* Thumbnail Images */}
        <div className="flex flex-col gap-4">
          <img
            src={product.image}
            alt="Product Thumbnail 1"
            className="w-full h-20 object-cover border border-gray-300 rounded-md hover:ring-2 hover:ring-gray-900 hover:scale-105 hover:shadow-xl"
          />
          <img
            src={product.image}
            alt="Product Thumbnail 2"
            className="w-full h-20 object-cover border border-gray-300 rounded-md hover:ring-2 hover:ring-gray-900 hover:scale-105 hover:shadow-xl"
          />
          <img
            src={product.image}
            alt="Product Thumbnail 3"
            className="w-full h-20 object-cover border border-gray-300 rounded-md hover:ring-2 hover:ring-gray-900 hover:scale-105 hover:shadow-xl"
          />
          <img
            src={product.image}
            alt="Product Thumbnail 4"
            className="w-full h-20 object-cover border border-gray-300 rounded-md hover:ring-2 hover:ring-gray-900 hover:scale-105 hover:shadow-xl"
          />
        </div>
        {/* Main Image */}
        <div className="flex justify-center">
          <img
            src={product.image}
            alt="Product Main"
            className="w-[500px] object-cover border border-gray-300 rounded-md"
          />
        </div>
      </div>

      {/* Right Section: Product Details */}
      <div className="flex flex-col gap-4 w-full lg:w-2/3">
        {/* Product Name */}
        <h1 className="text-4xl font-semibold">{product.name}</h1>
        {/* Star Rating */}
        <div className="flex items-center gap-1 mt-2">
          <img src={star_icon} alt="Star 1" className="w-6 h-6" />
          <img src={star_icon} alt="Star 2" className="w-6 h-6" />
          <img src={star_icon} alt="Star 3" className="w-6 h-6" />
          <img src={star_icon} alt="Star 4" className="w-6 h-6" />
          <img src={star_dull_icon} alt="Dull Star" className="w-6 h-6" />
          <p className="text-sm text-gray-600">(122)</p>
        </div>
        {/* Price */}
        <div className="flex gap-2 items-center mt-4">
          <span className="text-xl line-through text-gray-500">
            ₹{formatPrice(product.old_price)}
          </span>
          <span className="text-3xl font-bold text-black">
            ₹{formatPrice(product.new_price)}
          </span>
        </div>

        {/* Off percentage in Prices */}
        <p className="text-xl text-white mt-4 py-2 bg-green-500 rounded-lg pl-4">
          Super Saver Deal
          <span className="font-bold text-2xl pl-4">{product.off_percentage}% OFF</span>
          <span className="pl-80">Hurry Up</span>
        </p>

        {/* Description */}
        {product.category === "tws" ? (
          <p className="text-gray-700 mt-2">
            Enjoy extended playtime with superior battery life, cutting-edge ANC, and Voice Quick Connect Technology for seamless pairing and rich sound on the go.
          </p>
        ) : product.category === "headphones" ? (
          <p className="text-gray-700 mt-2">
            Dive into your favorite tracks with powerful drivers, advanced ANC, and Voice Quick Connect Technology, ensuring immersive audio and clear calls with ENC.
          </p>
        ) : (
          <p className="text-gray-700 mt-2">
            Experience vibrant visuals on a crystal-clear AMOLED display, BT Calling, while staying connected with Voice Quick Connect Technology for seamless notifications and health tracking on your wrist.
          </p>
        )}

        {/* Quantity Selector */}
        <div className="flex items-center gap-4 mt-6">
          <button 
            className="bg-gray-300 text-gray-600 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-400 pb-1"
            onClick={decrementQuantity}
          >
            -
          </button>
          <span className="text-xl">{quantity}</span>
          <button 
            className="bg-gray-300 text-gray-600 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-400 pb-1"
            onClick={incrementQuantity}
          >
            +
          </button>
        </div>

        {/* Add to Cart Button */}
        <button 
          className="bg-black text-white p-2 rounded-lg mt-6 hover:bg-gray-800 transition-colors w-80"
          onClick={() => {
            addToCart(product.id, quantity);
            setQuantity(1); // Reset quantity to 1 after adding to cart
          }}
        >
          ADD TO CART
        </button>

        {/* Category and Tags */}
        <p className="text-gray-700 mt-4">
          <span className="font-semibold">Category:</span>{" "}
          {product.category_view}
          <span className="ml-4 font-semibold">Tags:</span> Featured, Stylist
        </p>
      </div>
    </div>
  );
};

export default ProductDisplay;
