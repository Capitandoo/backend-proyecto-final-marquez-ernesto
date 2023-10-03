import app from "../server.js";
import request from "supertest";
import mongoose from "mongoose";

describe("Test integral", () => {

    beforeEach(async () => {
        mongoose.connection.collections['users']
    })

    test("[POST] /users/login", async () => {
        const credencialMocks = { email: "carrio@mail.com", password: "1234"}
        const response = await request(app).post("/users/login").send(credencialMocks);
        console.log('response', response.body)
    })
})