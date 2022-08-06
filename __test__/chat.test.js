const app = require('../app')
const request = require("supertest");
const { User, Chat } = require("../models");
const {signToken} = require("../helpers/jwt")

let validToken1;
let validToken2;
let invalidToken;

const userTest1 = {
  username: 'user1',
  password: '123456'
}

const userTest2 = {
  username: 'user2',
  password: '123456'
}
beforeAll((done) => {
  User.create(userTest1)
    .then((res) => {
      validToken1 = signToken({
        id: res.id,
        username: res.username
      })
      invalidToken = validToken1 + "invalid"
      return User.create(userTest2)
    })
    .then((res) => {
      validToken2 = signToken({
        id: res.id,
        username: res.username
      })
      done()
    })
    .catch(err => {
      done(err);
    });
})
afterAll(done => {
  User.destroy({ truncate: true, cascade: true, restartIdentity: true})
    .then(_ => {
      return Chat.destroy({ truncate: true, cascade: true, restartIdentity: true})
    })
    .then(_ => {
      done();
    })
    .catch(err => {
      done(err);
    });
});

describe("Chatting Test", () => {
  describe("POST /chat/send", () => {
    test("201 Success Send Chat User1 -> User2", (done) => {
      request(app)
        .post('/chat/send')
        .set('Authorization', `Bearer ${validToken1}`)
        .send({
          "receiver": 2,
          "message": "hei..."
        })
        .end((err, res) => {
          if (err) {
            return done(err)
          }
          const {body, status} = res
          expect(status).toBe(201)
          expect(body).toHaveProperty("message", "hei...")
          expect(body).toHaveProperty("sender", 1)
          expect(body).toHaveProperty("receiver", 2)
          return done()
        })
    })

    test("401 Failed Send Chat Invalid Token", (done) => {
      request(app)
        .post('/chat/send')
        .set('Authorization', `Bearer ${invalidToken}`)
        .send({
          "receiver": 2,
          "message": "hei..."
        })
        .end((err, res) => {
          if (err) {
            return done(err)
          }
          const {body, status} = res
          expect(status).toBe(401)
          expect(body).toHaveProperty("message", "Invalid Token")
          return done()
        })
    })

    test("400 Failed Send Chat - Empty Messages", (done) => {
      request(app)
        .post('/chat/send')
        .set('Authorization', `Bearer ${validToken1}`)
        .send({
          "receiver": 2,
          "message": ""
        })
        .end((err, res) => {
          if (err) {
            return done(err)
          }
          const {body, status} = res
          expect(status).toBe(400)
          expect(body.messages).toEqual(expect.arrayContaining(["Chat Message Is Required"]))
          return done()
        })
    })

    test("400 Failed Send Chat - Null Messages", (done) => {
      request(app)
        .post('/chat/send')
        .set('Authorization', `Bearer ${validToken1}`)
        .send({
          "receiver": 2
        })
        .end((err, res) => {
          if (err) {
            return done(err)
          }
          const {body, status} = res
          expect(status).toBe(400)
          expect(body.messages).toEqual(expect.arrayContaining(["Chat Message Is Required"]))
          return done()
        })
    })

    test("404 Failed Send Chat - Target Receiver Not Found", (done) => {
      request(app)
        .post('/chat/send')
        .set('Authorization', `Bearer ${validToken1}`)
        .send({
          "receiver": 100,
          "message": "hei..."
        })
        .end((err, res) => {
          if (err) {
            return done(err)
          }
          const {body, status} = res
          expect(status).toBe(404)
          expect(body).toHaveProperty("message", "Target Receiver Not Found")
          return done()
        })
    })

    test("201 Succes Send Reply Chat - User2 -> User1", (done) => {
      request(app)
        .post('/chat/send')
        .set('Authorization', `Bearer ${validToken2}`)
        .send({
          "receiver": 1,
          "message": "hello",
          "reply_to": 1
        })
        .end((err, res) => {
          if (err) {
            return done(err)
          }
          const {body, status} = res
          expect(status).toBe(201)
          expect(body).toHaveProperty("message", "hello")
          expect(body).toHaveProperty("sender", 2)
          expect(body).toHaveProperty("receiver", 1)
          expect(body.reply_to_message).toHaveProperty("reply_to", 1)
          expect(body.reply_to_message).toHaveProperty("message_replied", "hei...")
          return done()
        })
    })
  })

  describe("GET /chat/my-chat/:receiver_id", () => {
    test("200 Success Get Chat User1 -> User2", (done) => {
      request(app)
        .get('/chat/my-chat/2')
        .set('Authorization', `Bearer ${validToken1}`)
        .end((err, res) => {
          if (err) {
            return done(err)
          }
          const {body, status} = res
          expect(status).toBe(200)
          expect(Array.isArray(body)).toBeTruthy();
          return done()
        })
    })

    test("404 Failed Get Chat User1 -> Receiver Not Found", (done) => {
      request(app)
        .get('/chat/my-chat/100')
        .set('Authorization', `Bearer ${validToken1}`)
        .end((err, res) => {
          if (err) {
            return done(err)
          }
          const {body, status} = res
          console.log(body)
          expect(status).toBe(404)
          expect(body).toHaveProperty("message", "Target Receiver Not Found")
          return done()
        })
    })
  })

  describe("GET /chat/last-chat", () => {
    test("200 Success Get All Last Chat User1", (done) => {
      request(app)
        .get('/chat/last-chat')
        .set('Authorization', `Bearer ${validToken1}`)
        .end((err, res) => {
          if (err) {
            return done(err)
          }
          const {body, status} = res
          expect(status).toBe(200)
          expect(Array.isArray(body)).toBeTruthy();
          return done()
        })
    })
  })
})