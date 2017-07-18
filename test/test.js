const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();

chai.use(chaiHttp);

const {Event} = require('../models/event');
const {User} = require('../models/user');

const {closeServer, runServer, app} = require('../server');

describe('API Resource', function() {
	before(function() {
		return runServer();
	});
	after(function() {
		return closeServer();
	});

// GET TEST
	it('should return all events', function () {
		let res;
		return chai.request(app)
			.get('/')
			.then(function(_res) {
				res = _res;
				res.should.have.status(200);
			});
	});

// POST TEST - EVENT

	function generateEvent() {
		return {
    		date: 'June 25, 2017',
            time: '5:00 pm',
            type: 'aura',
            triggers: 'xyz',
            location: 'home',
            medication: 'abc',
            notes: 'def'
			// test userid from token
		};
	};

	const newEvent = generateEvent();

	it(' should create a new event', function() {
		return chai.request(app)
			.post('/')
			.send(newEvent)
			.then(function(res){
				res.should.have.status(201);
				res.body.should.be.a('object');
				res.body.should.include.keys('date', 'time', 'type', 'triggers', 'location', 'medication', 'notes');
				res.body.date.should.equal(newEvent.date);
				res.body._id.should.not.be.null;
				res.body.time.should.equal(newEvent.time);
				res.body.type.should.equal(newEvent.type);
				return Event.findById(res.body._id);
			})
			.then(function(event) {
				event.date.should.equal(newEvent.date);
				event.time.should.equal(newEvent.time);
				event.type.should.equal(newEvent.type);
			});
	})


// POST TEST - USER SIGNUP
	function generateUser() {
		return {
			username: `testusername-${Date.now()}`, // why date now?
			password: 'testpassword',
		}
	}

	const newUser = generateUser();
	let newUserId = null;

	it('should create a new user', function() {
		return chai.request(app)
			.post('/signup')
			.send(newUser)
			.then(function(res){
				res.should.have.status(201);
				res.should.be.json;
				res.body.should.be.a('object');
				res.body.should.include.keys('username', 'firstName', 'lastName');
				res.body.username.should.equal(newUser.username);
				res.body._id.should.not.be.null;
				res.body.firstName.should.equal(newUser.firstName);
				res.body.lastName.should.equal(newUser.lastName);
				newUserId = res.body._id;	
				console.log(newUserId);
				return User.findById(res.body._id);
			})
			.then(function(user) {
				user.username.should.equal(newUser.username);
				user.firstName.should.equal(newUser.firstName);
				user.lastName.should.equal(newUser.lastName);
			});
	})


});

describe('authMiddleware', function() { 
	it('should deny access if unauthorized', function() {
		return chai.request(app)

	})

});
