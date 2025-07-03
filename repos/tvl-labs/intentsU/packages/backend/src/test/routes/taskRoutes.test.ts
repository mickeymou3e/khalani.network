import request from "supertest";
import app from "../../app";
import { MongoClient } from "mongodb";
import { serverApi, uri } from "../../config/db.setup";

let db;
let client: MongoClient;

beforeAll(async () => {
  client = await MongoClient.connect(uri, serverApi);
  db = client.db("intentsu");
  app.locals.db = db;
});

afterAll(async () => {
  await client.close();
});

describe("Task Routes", () => {
  test("GET /tasks should fetch all tasks", async () => {
    const response = await request(app).get("/api/tasks");
    console.log(response.body);
    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  // Additional tests for POST, PUT, DELETE can be added here...
});
