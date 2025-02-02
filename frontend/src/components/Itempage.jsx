import { useLocation, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

export default function ItemPage() {
  const { id } = useParams();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const itemUrl = queryParams.get("url");
  const url="http://localhost:3000";

  const navigate = useNavigate();
  const [token, setToken] = useState("");
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const tok = localStorage.getItem("token");
    if (!tok) {
      navigate("/signin");
    }
    setToken(tok);
  }, []);

  useEffect(() => {
    const fetchItemDetails = async () => {
      const tok = localStorage.getItem("token");
      if (!tok) return;

      try {
        const decoded = jwtDecode(tok);
        const userId = decoded.userId;
        const response = await axios.get("http://localhost:3000/item/list", {
          params: { url: itemUrl, userId },
          headers: { Authorization: `Bearer ${tok}` },
        });

        console.log("Item data:", response.data);
        const foundItem = response.data.data.find((item) => item._id === id);

        const updateItems = async()=>{
          try {
            const imageResponse = await axios.get(
              `${url}/getImage?url=${itemUrl}`
            );
            console.log("Image:",imageResponse);
            foundItem.image = imageResponse.data.imageUrl || null; // Add image URL to item
          } catch (error) {
            console.error(`Error fetching image for ${item.title}:`, error);
            foundItem.image = null; // Handle missing image
          }
          return foundItem;
        }
        

        if (foundItem) {
         await updateItems();
          setItem(foundItem);
        } else {
          setItem(null);
        }
      } catch (error) {
        console.error("Error fetching item details:", error);
      } finally {
        setLoading(false);
      }
    };

    if (itemUrl) {
      fetchItemDetails();
    }
  }, [itemUrl, id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-700 text-lg">
        Loading...
      </div>
    );
  }

  if (!item) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-700 text-lg">
        Product not found.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 flex justify-center px-6 py-12">
      {/* Amazon-like Layout */}
      <div className="max-w-6xl w-full flex space-x-10">
        {/* Left: Product Images */}
        <div className="w-1/3">
          <img
            src={item.image || "https://via.placeholder.com/500"}
            
            className="w-full h-96 object-content rounded-lg shadow-md"
          />
          <div className="flex space-x-2 mt-3">
            {/* Thumbnails */}
            {item.thumbnailUrls?.map((thumb, index) => (
              <img key={index} src={thumb} alt={`Thumbnail ${index}`} className="w-16 h-16 object-cover rounded-lg border" />
            ))}
          </div>
        </div>

        {/* Middle: Product Details */}
        <div className="w-1/3 space-y-4">
          <h1 className="text-2xl font-bold">{item.title}</h1>
          <p className="text-lg font-semibold text-red-600">₹{item.price}</p>
          <p className="text-gray-700">{item.description || "No description available."}</p>

          <div className="flex items-center space-x-2">
            ⭐⭐⭐⭐☆ <span className="text-gray-600">(291 reviews)</span>
          </div>
        </div>

        {/* Right: Buy Section */}
        <div className="w-1/3 bg-white p-6 shadow-lg rounded-lg">
          <p className="text-lg font-semibold text-green-600">In Stock</p>
          <p className="text-gray-600">Sold by: <span className="font-medium">Amazon</span></p>

          <div className="mt-6 space-y-3">
            <button className="w-full px-6 py-3 bg-yellow-500 text-black font-semibold rounded-lg hover:bg-yellow-600 transition">
              Compare prices
            </button>
            <button className="w-full px-6 py-3 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 transition">
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
