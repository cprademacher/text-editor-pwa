import { openDB } from "idb";

export const initdb = async () => {
  const jateDb = await openDB("jate", 1, {
    upgrade(db) {
      if (db.objectStoreNames.contains("jate")) {
        console.log("jate database already exists");
        return;
      }
      db.createObjectStore("jate", { keyPath: "id", autoIncrement: true });
      console.log("jate database created");
    },
  });
  return jateDb;
};

export const putDb = async (content) => {
  try {
    // Open the database.
    const jateDb = await openDB("jate", 1);

    // Create a transaction for the "jate" object store with read-write access.
    const tx = jateDb.transaction("jate", "readwrite");

    // Access the "jate" object store.
    const store = tx.objectStore("jate");

    // Add the content to the database.
    const request = store.add({ jate: content });

    // Wait for the request to complete.
    await request;

    // Log the success message.
    console.log("Data saved to the database");
  } catch (error) {
    console.error("Error saving data to the database:", error);
  }
};

export const getDb = async () => {
  try {
    // Open the database.
    const jateDb = await openDB("jate", 1);

    // Create a transaction for the "jate" object store with read-only access.
    const tx = jateDb.transaction("jate", "readonly");

    // Access the "jate" object store.
    const store = tx.objectStore("jate");

    // Initialize an array to store the retrieved data.
    const data = [];

    // Open a cursor to iterate through all records in the object store.
    const cursor = await store.openCursor();

    while (cursor) {
      // Add the data from the current cursor position to the array.
      data.push(cursor.value);

      // Move to the next cursor position.
      cursor = await cursor.continue();
    }

    // Log the retrieved data and return it.
    console.log("Data retrieved from the database:", data);
    return data;
  } catch (error) {
    console.error("Error retrieving data from the database:", error);
    return []; // Return an empty array in case of an error.
  }
};

initdb();
