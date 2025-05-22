import { signIn, signOut, useSession } from "next-auth/react";

// Login button
<button onClick={() => signIn()}>Sign In</button>

// Logout button  
<button onClick={() => signOut()}>Sign Out</button>

// Get session data
const { data: session } = useSession(); 