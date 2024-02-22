import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaSearch } from "react-icons/fa";

export default function Search() {
  const nav = useNavigate();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API}products`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const productsData = await response.json();
        setProducts(productsData);
      } catch (error) {
        console.error("Fetch error:", error);
      }
    };

    fetchData();
  }, []);

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
    setSearchQuery(""); // Reset search query when closing search
    setFilteredProducts(products); // Reset filtered products when closing search
  };

  const handleSearchInputChange = (event) => {
    const query = event.target.value;
    setSearchQuery(query);
    filterProducts(query);
    setIsSearchOpen(true); // Always open dropdown when typing
  };

  const filterProducts = (query) => {
    const filtered = products.filter((product) =>
      product.name.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredProducts(filtered);
  };

  const clicked = (ID) => {
    setSearchQuery("");
    nav(`/shop/${ID}`);
  };

  return (
    <>
      <div className="relative flex items-center">
        {isSearchOpen && (
          <input
            type="text"
            placeholder="Search products"
            className="bg-white border border-gray-300 rounded-md shadow-md pl-8 pr-3 py-1 xs:h-[30px] sm:h-[32px] md:h-[34px] lg:h-[36px] xl:h-[36px]  2xl:hs-[38px] xs:w-[170px] sm:w-[200px] md:w-[250px] lg:w-[300px] xl:w-[300px]  2xl:w-[350px]"
            value={searchQuery}
            onChange={handleSearchInputChange}
            onClick={() => setIsSearchOpen(true)}
          />
        )}
        <FaSearch
          className={`${
            isSearchOpen ? "text-black" : "text-white"
          } cursor-pointer absolute right-0 top-1/2 transform -translate-y-1/2 mr-2 xs:size-[21px] sm:size-[23px] md:size-[25px] lg:size-[27px] xl:size-[27px]  2xl:size-[29px]`}
          onClick={toggleSearch}
        />
      </div>
      {isSearchOpen && searchQuery && (
        <div className="absolute z-30 mt-24 bg-white border border-gray-300 rounded-md shadow-md w-60">
          {filteredProducts.length === 0 ? (
            <p className="py-2 px-4">No items found</p>
          ) : (
            <ul className="py-1">
              {filteredProducts.map((product) => (
                <li
                  key={product.id}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => clicked(product._id)}
                >
                  {product.name}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </>
  );
}
