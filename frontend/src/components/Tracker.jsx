import axios from "axios";
import { jwtDecode } from "jwt-decode";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Tracker = () => {
  const [token, setToken] = useState("");
  const [items, setItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const tok = localStorage.getItem("token");
    if (!tok) {
      navigate("/signin");
    }
    setToken(tok);
  }, []);

  useEffect(() => {
    if (token) loadItems();
  }, [token]);

  async function loadItems() {
    const tok = localStorage.getItem("token");
    if (!tok) return;

    try {
      const decoded = jwtDecode(tok);
      const userId = decoded.userId;
      const response = await axios.get("http://localhost:3000/item/list", {
        headers: { Authorization: `Bearer ${tok}` },
        params: { userId },
      });

      const arr = response.data.data;
      const updatedArr = await Promise.all(
        arr.map(async (item) => {
          try {
            const imageResponse = await axios.get(
              "http://localhost:3000/getImage",
              {
                headers: { Authorization: `Bearer ${tok}` },
                params: { url: item.url },
              }
            );
            return { ...item, imageUrl: imageResponse.data.imageUrl };
          } catch (error) {
            console.error(`Error fetching image for ${item.title}:`, error);
            return item;
          }
        })
      );

      setItems(updatedArr);
    } catch (error) {
      console.error("Error fetching items:", error);
    }
  }

  const handleItem = (item) => {
    navigate(`/item/${encodeURIComponent(item._id)}?url=${encodeURIComponent(item.url)}`);
  };
  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 flex flex-col items-center py-8 px-4">
      <h1 className="text-4xl font-bold text-gray-800 mb-6">Tracked Items</h1>
      <div className="w-full overflow-x-auto">
        <div className="flex space-x-6 px-4 py-4">
          {items.map((item) => (
            <div
              key={item._id}
              className="w-80 bg-white shadow-lg rounded-xl overflow-hidden hover:shadow-2xl transition-shadow duration-300"
            >
              <div className="h-60 w-full bg-gray-200">
                <img
                  src={item.imageUrl || "https://via.placeholder.com/300"}
                  alt={item.title}
                  className="w-full h-full object-content"
                />
              </div>
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-800 truncate">
                  {item.title}
                </h2>
                <p className="text-gray-600 text-lg font-medium mb-3">
                  {item.price}
                </p>
                <button
                   onClick={() => handleItem(item)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 text-sm text-white rounded bg-black text-md font-medium hover:bg-slate-700"
                >
                  View Product
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Tracker;
