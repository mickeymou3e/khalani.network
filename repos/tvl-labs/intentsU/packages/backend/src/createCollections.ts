import { connect } from "./db";

async function createCollections() {
  try {
    const db = await connect();
    if (!db) throw new Error("Database not found");
    console.log("Connected to MongoDB");

    // Create Users Collection
    await db.createCollection("users", {
      validator: {
        $jsonSchema: {
          bsonType: "object",
          required: ["username", "email", "passwordHash", "credits"],
          properties: {
            username: {
              bsonType: "string",
              description: "must be a string and is required",
            },
            email: {
              bsonType: "string",
              description: "must be a string and is required",
            },
            passwordHash: {
              bsonType: "string",
              description: "must be a string and is required",
            },
            credits: {
              bsonType: "int",
              description: "must be an integer and is required",
            },
          },
        },
      },
    });
    console.log("Users collection created");

    await db.collection("users").insertMany([
      {
        username: "user1",
        email: "user1@example.com",
        passwordHash: "hash1",
        credits: 100,
      },
      {
        username: "user2",
        email: "user2@example.com",
        passwordHash: "hash2",
        credits: 150,
      },
    ]);

    // Create Tasks Collection
    await db.createCollection("tasks", {
      validator: {
        $jsonSchema: {
          bsonType: "object",
          required: ["title", "link", "expirationDate", "credits"],
          properties: {
            title: {
              bsonType: "string",
              description: "must be a string and is required",
            },
            link: {
              bsonType: "string",
              description: "must be a string and is required",
            },
            expirationDate: {
              bsonType: "date",
              description: "must be a date and is required",
            },
            credits: {
              bsonType: "int",
              description: "must be an integer and is required",
            },
          },
        },
      },
    });
    console.log("Tasks collection created");

    await db.collection("tasks").insertMany([
      {
        title: "Task 1",
        link: "http://example.com/task1",
        expirationDate: new Date(),
        credits: 10,
      },
      {
        title: "Task 2",
        link: "http://example.com/task2",
        expirationDate: new Date(),
        credits: 20,
      },
    ]);

    await db.createCollection("spotlight", {
      validator: {
        $jsonSchema: {
          bsonType: "object",
          required: ["title", "text", "link"],
          properties: {
            title: {
              bsonType: "string",
              description: "must be a string and is required",
            },
            text: {
              bsonType: "string",
              description: "must be a string and is required",
            },
            link: {
              bsonType: "string",
              description: "must be a string and is required",
            },
            imageUrl: {
              bsonType: "string",
              description: "optional URL to an image",
            },
          },
        },
      },
    });

    console.log("Spotlight collection created");

    await db.collection("spotlight").insertMany([
      {
        title: "Spotlight 1",
        text: "Spotlight content 1",
        link: "http://example.com/spot1",
        imageUrl: "http://example.com/img1.jpg",
      },
      {
        title: "Spotlight 2",
        text: "Spotlight content 2",
        link: "http://example.com/spot2",
        imageUrl: "http://example.com/img2.jpg",
      },
    ]);
  } catch (e) {
    console.error("Error during collection creation:", e);
  }
}

createCollections().catch(console.error);
