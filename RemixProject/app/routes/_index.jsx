import { loginWithSpotifyClick } from "../code/functions"
import { json } from "@remix-run/node"; // or cloudflare/deno
import { MongoClient, ServerApiVersion } from "mongodb"

const client = new MongoClient(process.env.MONGODB_URL, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

export const loader = async () => {
  const users = await client.db("Melody").collection("users").find().toArray();
  return json({ users },
  {  headers: {
    "Access-Control-Allow-Origin": "*",
  },});
};
export async function action({
  request,
}) {
  const data = await request.json();
  // do validation
  const result = await client.db("Melody").collection("users").insertOne(data);

  return json({ ok: true, id: result.insertedId});
}

