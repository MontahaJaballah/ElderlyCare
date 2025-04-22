const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const express = require('express');
const userRoutes = require('../user/userRoutes');
const User = require('../user/userModel');

let mongoServer;
const app = express();
app.use(express.json());
app.use('/api/users', userRoutes);

// Setup in-memory MongoDB for testing
beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
});

// Clean up after tests
afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

// Clear database between tests
beforeEach(async () => {
  await User.deleteMany({});
});

// Test user data
const testUser = {
  name: 'Test User',
  email: 'test@example.com',
  password: 'password123',
  age: 30
};

describe('User Authentication', () => {
  describe('POST /api/users/signup', () => {
    it('should create a new user', async () => {
      const res = await request(app)
        .post('/api/users/signup')
        .send(testUser);
      
      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('_id');
      expect(res.body.name).toBe(testUser.name);
      expect(res.body.email).toBe(testUser.email);
      expect(res.body).not.toHaveProperty('password');
    });

    it('should not allow duplicate emails', async () => {
      // First create a user
      await request(app)
        .post('/api/users/signup')
        .send(testUser);
      
      // Try to create another user with the same email
      const res = await request(app)
        .post('/api/users/signup')
        .send(testUser);
      
      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('error');
    });
  });

  describe('POST /api/users/login', () => {
    beforeEach(async () => {
      // Create a test user for login tests
      await request(app)
        .post('/api/users/signup')
        .send(testUser);
    });

    it('should login successfully with correct credentials', async () => {
      const res = await request(app)
        .post('/api/users/login')
        .send({
          email: testUser.email,
          password: testUser.password
        });
      
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('message', 'Login successful');
      expect(res.body).toHaveProperty('user');
      expect(res.body.user.email).toBe(testUser.email);
    });

    it('should reject login with incorrect password', async () => {
      const res = await request(app)
        .post('/api/users/login')
        .send({
          email: testUser.email,
          password: 'wrongpassword'
        });
      
      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('error');
    });

    it('should reject login with non-existent email', async () => {
      const res = await request(app)
        .post('/api/users/login')
        .send({
          email: 'nonexistent@example.com',
          password: testUser.password
        });
      
      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('error');
    });
  });

  describe('POST /api/users/logout', () => {
    it('should logout successfully', async () => {
      const res = await request(app)
        .post('/api/users/logout');
      
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('message', 'Logged out successfully');
    });
  });
});

describe('User CRUD Operations', () => {
  let userId;

  // Create a test user before CRUD tests
  beforeEach(async () => {
    const res = await request(app)
      .post('/api/users/signup')
      .send(testUser);
    
    userId = res.body._id;
  });

  describe('GET /api/users/all', () => {
    it('should get all users', async () => {
      const res = await request(app).get('/api/users/all');
      
      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBeTruthy();
      expect(res.body.length).toBe(1);
      expect(res.body[0].email).toBe(testUser.email);
    });
  });

  describe('GET /api/users/find/:id', () => {
    it('should get a user by ID', async () => {
      const res = await request(app).get(`/api/users/find/${userId}`);
      
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('_id', userId);
      expect(res.body.email).toBe(testUser.email);
    });

    it('should return 404 for non-existent user ID', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const res = await request(app).get(`/api/users/find/${fakeId}`);
      
      expect(res.statusCode).toBe(404);
      expect(res.body).toHaveProperty('error');
    });
  });

  describe('PUT /api/users/update/:id', () => {
    it('should update a user', async () => {
      const updatedData = {
        name: 'Updated Name',
        email: 'updated@example.com',
        age: 35
      };

      const res = await request(app)
        .put(`/api/users/update/${userId}`)
        .send(updatedData);
      
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('_id', userId);
      expect(res.body.name).toBe(updatedData.name);
      expect(res.body.email).toBe(updatedData.email);
      expect(res.body.age).toBe(updatedData.age);
    });

    it('should return 404 for updating non-existent user', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const res = await request(app)
        .put(`/api/users/update/${fakeId}`)
        .send({ name: 'New Name' });
      
      expect(res.statusCode).toBe(404);
      expect(res.body).toHaveProperty('error');
    });
  });

  describe('DELETE /api/users/delete/:id', () => {
    it('should delete a user', async () => {
      const res = await request(app).delete(`/api/users/delete/${userId}`);
      
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('message', 'User deleted successfully');
      
      // Verify user is deleted
      const checkUser = await request(app).get(`/api/users/find/${userId}`);
      expect(checkUser.statusCode).toBe(404);
    });

    it('should return 404 for deleting non-existent user', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const res = await request(app).delete(`/api/users/delete/${fakeId}`);
      
      expect(res.statusCode).toBe(404);
      expect(res.body).toHaveProperty('error');
    });
  });
});
