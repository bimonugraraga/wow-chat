const app = require('../app')
const request = require("supertest");
const { User } = require("../models");

const user1 = {
  username: "user1",
  password: "usertest",
};

afterAll(done => {
  User.destroy({ truncate: true, cascade: true, restartIdentity: true})
    .then(_ => {
      done();
    })
    .catch(err => {
      done(err);
    });
});

describe("User Auth Test", () => {
  describe("POST /user/register", () => {
    test("201 Success Register", (done) => {
      request(app)
        .post('/user/register')
        .send(user1)
        .end((err, res) => {
          if (err) {
            return done(err)
          }
          const {body, status} = res
          expect(status).toBe(201)
          expect(body).toHaveProperty("message", "Success Registered User")
          return done()
        })
    })

    test("400 Failed Register - Username Has Been Taken", (done) => {
      request(app)
        .post('/user/register')
        .send(user1)
        .end((err, res) => {
          if (err) {
            return done(err)
          }
          const {body, status} = res
          expect(status).toBe(400)
          expect(body).toHaveProperty("message", "Username Has Been Taken")
          return done()
        })
    })

    test("400 Failed Register - Username is Required (null)", (done) => {
      request(app)
        .post('/user/register')
        .send({
          password: "testme"
        })
        .end((err, res) => {
          if (err) {
            return done(err)
          }
          const {body, status} = res
          expect(status).toBe(400)
          expect(body.messages).toEqual(expect.arrayContaining(["Username is Required"]))
          return done()
        })
    })

    test("400 Failed Register - Username is Required (empty)", (done) => {
      request(app)
        .post('/user/register')
        .send({
          username: "",
          password: "testme"
        })
        .end((err, res) => {
          if (err) {
            return done(err)
          }
          const {body, status} = res
          expect(status).toBe(400)
          expect(body.messages).toEqual(expect.arrayContaining(["Username is Required"]))
          return done()
        })
    })

    test("400 Failed Register - Password is Required (null)", (done) => {
      request(app)
        .post('/user/register')
        .send({
          username: "testme"
        })
        .end((err, res) => {
          if (err) {
            return done(err)
          }
          const {body, status} = res
          expect(status).toBe(400)
          expect(body.messages).toEqual(expect.arrayContaining(["Password is Required"]))
          return done()
        })
    })

    test("400 Failed Register - Password is Required (empty)", (done) => {
      request(app)
        .post('/user/register')
        .send({
          username: "testme",
          password: ""
        })
        .end((err, res) => {
          if (err) {
            return done(err)
          }
          const {body, status} = res
          expect(status).toBe(400)
          expect(body.messages).toEqual(expect.arrayContaining(["Password is Required"]))
          return done()
        })
    })

    test("400 Failed Register - Null All", (done) => {
      request(app)
        .post('/user/register')
        .send()
        .end((err, res) => {
          if (err) {
            return done(err)
          }
          const {body, status} = res
          expect(status).toBe(400)
          expect(body.messages).toEqual(expect.arrayContaining(["Username is Required","Password is Required"]))
          return done()
        })
    })

    test("400 Failed Register - Empty All", (done) => {
      request(app)
        .post('/user/register')
        .send({
          username: "",
          password: ""
        })
        .end((err, res) => {
          if (err) {
            return done(err)
          }
          const {body, status} = res
          expect(status).toBe(400)
          expect(body.messages).toEqual(expect.arrayContaining(["Username is Required","Password is Required"]))
          return done()
        })
    })
  })

  describe("POST /user/login", () => {
    test("200 Success Login", (done) => {
      request(app)
        .post('/user/login')
        .send(user1)
        .end((err, res) => {
          if (err) {
            return done(err)
          }
          const {body, status} = res
          expect(status).toBe(200)
          expect(body).toHaveProperty("username", "user1")
          expect(body).toHaveProperty("access_token", expect.any(String))
          return done()
        })
    })

    test("400 Failed Login - Wrong Username", (done) => {
      request(app)
        .post('/user/login')
        .send({
          username: "wronguser",
          password: "usertest",
        })
        .end((err, res) => {
          if (err) {
            return done(err)
          }
          const {body, status} = res
          expect(status).toBe(400)
          expect(body.message).toEqual("Username or Password is Wrong")
          return done()
        })
    })
    test("400 Failed Login - Wrong Username", (done) => {
      request(app)
        .post('/user/login')
        .send({
          username: "user1",
          password: "wrongpassword",
        })
        .end((err, res) => {
          if (err) {
            return done(err)
          }
          const {body, status} = res
          expect(status).toBe(400)
          expect(body.message).toEqual("Username or Password is Wrong")
          return done()
        })
    })
  })

})
