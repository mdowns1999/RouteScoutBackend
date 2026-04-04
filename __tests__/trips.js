const app = require("../source");
const request = require("supertest");
const mongodb = require("../db/connect");

beforeAll(async () => {
  await mongodb.initDb();
});

afterAll(async () => {
  await mongodb.closeDb();
});

const validTrip = {
  startLocation: "Chicago, IL",
  endLocation: "Nashville, TN",
  startLatLng: { lat: 41.8781, lng: -87.6298 },
  endLatLng: { lat: 36.1627, lng: -86.7816 },
  budget: "50-100",
  rankPreference: "POPULARITY",
  searchRadius: "25",
  selectedInterests: ["food", "nature"],
  selectedStops: [],
  totalDistanceMiles: 476,
  totalDriveTime: "6h 45m",
};

describe("POST /api/trips", () => {
  test("returns 400 when required fields are missing", async () => {
    const res = await request(app).post("/api/trips").send({});
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("error", "Validation failed");
  });

  test("returns 400 when startLocation is missing", async () => {
    const { startLocation, ...body } = validTrip;
    const res = await request(app).post("/api/trips").send(body);
    expect(res.status).toBe(400);
  });

  test("creates a trip and returns tripId", async () => {
    const res = await request(app).post("/api/trips").send(validTrip);
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("tripId");
    expect(typeof res.body.tripId).toBe("string");
  });
});

describe("GET /api/trips/:id", () => {
  test("returns 400 for invalid ObjectId format", async () => {
    const res = await request(app).get("/api/trips/not-a-valid-id");
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("error", "Invalid trip ID format");
  });

  test("returns 404 for valid but nonexistent ObjectId", async () => {
    const res = await request(app).get("/api/trips/000000000000000000000000");
    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty("error", "Trip not found");
  });
});

describe("GET /api/trips/:id/share", () => {
  test("returns 400 for invalid ObjectId format", async () => {
    const res = await request(app).get("/api/trips/not-a-valid-id/share");
    expect(res.status).toBe(400);
  });

  test("returns 404 for valid but nonexistent ObjectId", async () => {
    const res = await request(app).get("/api/trips/000000000000000000000000/share");
    expect(res.status).toBe(404);
  });
});

describe("PUT /api/trips/:id", () => {
  test("returns 400 for invalid ObjectId format", async () => {
    const res = await request(app).put("/api/trips/bad-id").send({ budget: "200+" });
    expect(res.status).toBe(400);
  });

  test("returns 404 for valid but nonexistent ObjectId", async () => {
    const res = await request(app).put("/api/trips/000000000000000000000000").send({ budget: "200+" });
    expect(res.status).toBe(404);
  });
});

describe("DELETE /api/trips/:id", () => {
  test("returns 400 for invalid ObjectId format", async () => {
    const res = await request(app).delete("/api/trips/bad-id");
    expect(res.status).toBe(400);
  });

  test("returns 404 for valid but nonexistent ObjectId", async () => {
    const res = await request(app).delete("/api/trips/000000000000000000000000");
    expect(res.status).toBe(404);
  });
});

describe("Full trip lifecycle", () => {
  test("create → get → put → delete", async () => {
    // Create
    const createRes = await request(app).post("/api/trips").send(validTrip);
    expect(createRes.status).toBe(201);
    const { tripId } = createRes.body;

    // Get
    const getRes = await request(app).get(`/api/trips/${tripId}`);
    expect(getRes.status).toBe(200);
    expect(getRes.body.startLocation).toBe(validTrip.startLocation);
    expect(getRes.body.endLocation).toBe(validTrip.endLocation);

    // Share (same as get)
    const shareRes = await request(app).get(`/api/trips/${tripId}/share`);
    expect(shareRes.status).toBe(200);
    expect(shareRes.body.startLocation).toBe(validTrip.startLocation);

    // Update
    const putRes = await request(app).put(`/api/trips/${tripId}`).send({ budget: "200+" });
    expect(putRes.status).toBe(200);
    expect(putRes.body).toEqual({ success: true });

    // Verify update persisted
    const updatedRes = await request(app).get(`/api/trips/${tripId}`);
    expect(updatedRes.body.budget).toBe("200+");

    // Delete
    const deleteRes = await request(app).delete(`/api/trips/${tripId}`);
    expect(deleteRes.status).toBe(200);
    expect(deleteRes.body).toEqual({ success: true });

    // Verify deleted
    const missingRes = await request(app).get(`/api/trips/${tripId}`);
    expect(missingRes.status).toBe(404);
  });
});
