import {
  collection,
  getCountFromServer,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";

import ListingItem from "../components/ListingItem";
import Spinner from "../components/Spinner";
import { db } from "../firebase.config";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";

function Offers() {
  const [listings, setListings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastFetchedListing, setLastFetchedListing] = useState(null);
  const [count, setCount] = useState(null);

  const params = useParams();

  useEffect(() => {
    const fetchListings = async () => {
      try {
        // Get reference to the collection
        const listingsRef = collection(db, "listings");

        // Get the count of listings
        const countQuery = query(listingsRef, where("offer", "==", true));
        const countDocs = await getCountFromServer(countQuery);
        setCount(countDocs.data().count);

        // Create a query against the collection
        const q = query(
          listingsRef,
          where("offer", "==", true),
          orderBy("timestamp", "desc"),
          limit(3)
        );
        // Execute the query
        const querySnap = await getDocs(q);

        // Get the last visible listing
        const lastVisible = querySnap.docs[querySnap.docs.length - 1];
        setLastFetchedListing(lastVisible);

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

  // Pagination / Load more
  const onfetchMoreListings = async () => {
    try {
      // Get reference to the collection
      const listingsRef = collection(db, "listings");

      // Create a query against the collection
      const q = query(
        listingsRef,
        where("offer", "==", true),
        orderBy("timestamp", "desc"),
        startAfter(lastFetchedListing),
        limit(3)
      );
      // Execute the query
      const querySnap = await getDocs(q);

      // Get the last visible listing
      const lastVisible = querySnap.docs[querySnap.docs.length - 1];
      setLastFetchedListing(lastVisible);

      let listings = [];

      querySnap.forEach((doc) => {
        return listings.push({ id: doc.id, data: doc.data() });
      });

      setListings((prevState) => [...prevState, ...listings]);
      setLoading(false);
    } catch (error) {
      toast.error("Could not fetch listings");
    }
  };

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

          <br />
          <br />
          {lastFetchedListing && listings?.length < count && (
            <p className="loadMore" onClick={onfetchMoreListings}>
              Load More
            </p>
          )}
        </>
      ) : (
        <p>No offers available at this moment</p>
      )}
    </div>
  );
}
export default Offers;
