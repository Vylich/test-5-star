import chaiHttp from "chai-http";
import { expect, use } from "chai";
import app from "../../app.js"; // Импортируйте серверный файл как модуль

// Инициализируем chai для использования chaiHttp
const chai = use(chaiHttp);

describe("User API", () => {
  it("should register a new user", async () => {
    const res = await chai.request
      .execute(app)
      .post("/users/register")
      .send({ username: "testuser1", password: "testpassword1" });
    expect(res).to.have.status(201);
    expect(res.body).to.have.property("_id");
  });

  it("should login user and receive a token", async () => {
    await chai.request
      .execute(app)
      .post("/users/register")
      .send({ username: "testuser2", password: "testpassword" });
    const res = await chai.request
      .execute(app)
      .post("/users/login")
      .send({ username: "testuser2", password: "testpassword" });
    expect(res).to.have.status(200);
    expect(res.body).to.have.property("token");
  });
});

describe("Task API", () => {
  let token;

  before(async () => {
    const res = await chai.request
      .execute(app)
      .post("/users/login")
      .send({ username: "testuser2", password: "testpassword" });
    token = res.body.token;
  });

  it("should create a new task", async () => {
    const res = await chai.request
      .execute(app)
      .post("/tasks")
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "Test Task" });
    expect(res).to.have.status(201);
    expect(res.body).to.have.property("_id");
  });

  it("should get tasks for a user", async () => {
    await chai.request
      .execute(app)
      .post("/tasks")
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "Another Task" });
    const res = await chai.request
      .execute(app)
      .get("/tasks")
      .set("Authorization", `Bearer ${token}`);
    expect(res).to.have.status(200);
    expect(res.body).to.be.an("array");
  });
});
