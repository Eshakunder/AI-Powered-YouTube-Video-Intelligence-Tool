import { signOut } from "firebase/auth";
import { auth } from "../firebase";

function Dashboard() {
  const handleLogout = async () => {
    await signOut(auth);
  };

  return (
    <div>
      <h1>Dashboard</h1>
      <p>You are logged in 🎉</p>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default Dashboard;