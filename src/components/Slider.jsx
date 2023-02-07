import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import { db } from "../firebase.config";
import { Navigation, Pagination, A11y } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import Spinner from "./Spinner";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/a11y";

function Slider() {
  const [loading, setLoading] = useState(true);
  const [listings, setListings] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchListings = async () => {
      const listingsRef = collection(db, "listings");
      const q = query(listingsRef, orderBy("timestamp", "desc"), limit(5));
      const querySnap = await getDocs(q);

      let listings = [];

      querySnap.forEach((doc) => {
        return listings.push({ id: doc.id, data: doc.data() });
      });

      setListings(listings);
      setLoading(false);
    };

    fetchListings();
  }, []);

  if (loading) {
    return <Spinner />;
  }

  return (
    listings && (
      <>
        <p className="exploreHeading">Recommended</p>

        <Swiper
          modules={[Navigation, Pagination, A11y]}
          slidesPerView={1}
          navigation={true}
          a11y={true}
          pagination={{ clickable: true }}
        >
          {listings.map(({ data, id }) => (
            <SwiperSlide
              key={id}
              onClick={() => navigate(`/category/${data.type}/${id}`)}
            >
              <img
                style={{
                  width: "100%",
                  height: "auto",
                  borderRadius: "1.5rem",
                }}
                src={data.imageUrls}
                alt="{listing.title}"
              />
              <p className="swiperSlideText">{data.name}</p>
              <p className="swiperSlidePrice">
                ${data.discountedPrice ?? data.regularPrice}{" "}
                {data.type === "rent" && "/ month"}
              </p>
            </SwiperSlide>
          ))}
        </Swiper>
      </>
    )
  );
}
export default Slider;
