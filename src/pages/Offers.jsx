import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  limit,
} from "firebase/firestore";
import { db } from "../firebase.config";
import { toast } from "react-toastify";
import Spinner from "../components/Spinner";
import ListingItem from "../components/ListingItem";

function Offers() {
  const [listings, setListings] = useState(null);
  const [loading, setLoading] = useState(true);

  const params = useParams();

  useEffect(() => {
    const fetchListings = async () => {
      try {
        // Get reference to the collection
        const listingsRef = collection(db, "listings");

        // Create a query against the collection
        const q = query(
          listingsRef,
          where("offer", "==", true),
          orderBy("timestamp", "desc"),
          limit(10)
        );
        // Execute the query
        const querySnap = await getDocs(q);

        let listings = [];

        querySnap.forEach((doc) => {
          return listings.push({ id: doc.id, data: doc.data() });
        });

        setListings(listings);
        setLoading(false);
      } catch (error) {
        toast.error("Could not fetch listings");
      }
    };

    fetchListings();
  }, []);

  return (
    <div className="category">
      <header>
        <p className="pageHeader">Offers</p>
      </header>

      {loading ? (
        <Spinner />
      ) : listings && listings.length > 0 ? (
        <>
          <main>
            <ul className="categoryListings">
              {listings.map((listing) => (
                <ListingItem
                  key={listing.id}
                  listing={listing.data}
                  id={listing.id}
                />
              ))}
            </ul>
          </main>
        </>
      ) : (
        <p>No offers available at this moment</p>
      )}
    </div>
  );
}
export default Offers;
