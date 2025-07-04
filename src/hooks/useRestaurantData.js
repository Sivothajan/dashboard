import { useState, useEffect } from "react";

export const useRestaurantData = () => {
  const [data, setData] = useState({
    restaurantData: [],
    reviewData: [],
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    let mounted = true;

    const loadData = async () => {
      try {
        // Load restaurant data
        const [restaurantResponse, reviewResponse] = await Promise.all([
          fetch("/restaurant_data.csv"),
          fetch("/review_data.csv"),
        ]);

        if (!restaurantResponse.ok)
          throw new Error("Failed to load restaurant data");
        if (!reviewResponse.ok) throw new Error("Failed to load review data");

        const [restaurantText, reviewText] = await Promise.all([
          restaurantResponse.text(),
          reviewResponse.text(),
        ]);

        const parseCSV = (text) => {
          const rows = text.split("\n");
          const headers = rows[0].split(",");
          return rows
            .slice(1)
            .filter((row) => row.trim())
            .map((row) => {
              const values = row.split(",");
              return headers.reduce((obj, header, index) => {
                obj[header.trim()] = values[index]?.trim() || "";
                return obj;
              }, {});
            });
        };

        const restaurantArray = parseCSV(restaurantText);
        const reviewArray = parseCSV(reviewText);

        if (mounted) {
          setData({
            restaurantData: restaurantArray,
            reviewData: reviewArray,
            isLoading: false,
            error: null,
          });
        }
      } catch (err) {
        if (mounted) {
          setData((prev) => ({
            ...prev,
            isLoading: false,
            error: err.message,
          }));
        }
      }
    };

    loadData();

    return () => {
      mounted = false;
    };
  }, []);

  return data;
};
