import { db } from "@/utils/firebase";
import { doc, getDoc } from "firebase/firestore";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { email } = req.query;
  if (!email || typeof email !== "string" || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return res.status(400).json({ error: "Valid email is required" });
  }

  const normalizedEmail = email.toLowerCase();

  try {
    const userRef = doc(db, "users", normalizedEmail);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      return res.status(200).json({ approved: true });
    } else {
      return res.status(200).json({ approved: false });
    }
  } catch (error) {
    console.error("Error checking approval:", error);
    return res.status(500).json({ error: "Error checking approval." });
  }
}
