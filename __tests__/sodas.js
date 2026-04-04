const app = require("../source");
const request = require("supertest");

jest.setTimeout(30000);

describe("Check if this route exsits and if we GET All Sodas or One Soda", () => {
  test("responds to /sodas", async () => {
    const res = await request(app).get("/sodas");
    console.log(res);
    expect(res.header["content-type"]).toBe("application/json; charset=utf-8");
  });

  test("responds to /sodas/:id", async () => {
    const res = await request(app).get("/sodas/s1");
    expect(res.header["content-type"]).toBe("application/json; charset=utf-8");
  });
});

describe("Check if this route exsits so we can Post an order", () => {
  test("responds to /orders", async () => {
    const res = await request(app).post("/orders");
    expect(res.header["content-type"]).toBe("application/json; charset=utf-8");
  });

  test("Responds to request to Get all orders", async () => {
    const res = await request(app).get("/orders");
    expect(res.header["content-type"]).toBe("application/json; charset=utf-8");
  });
});

describe("Check if this route exsits so we can Post a review", () => {
  test("responds to /orders", async () => {
    const res = await request(app).post("/reviews");
    expect(res.header["content-type"]).toBe("application/json; charset=utf-8");
  });

  test("Responds to request to Get all Reviews", async () => {
    const res = await request(app).get("/reviews");
    expect(res.header["content-type"]).toBe("application/json; charset=utf-8");
  });
});
