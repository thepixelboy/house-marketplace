import { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";

function Profile() {
  const [user, setUser] = useState(null);

  const auth = getAuth();
  useEffect(() => {
    setUser(auth.currentUser);
  }, []);

  return user ? (
    <div>
      <h1>{user.displayName}</h1>
    </div>
  ) : (
    <div>
      <h1>Not logged in</h1>
    </div>
  );
}
export default Profile;
