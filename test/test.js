const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();

chai.use(chaiHttp);

const Event = require('../models/event');
const User = require('../models/user');

const {closeServer, runServer, app} = require('../server');

function generateUser() {
	return {
		username: `testusername-${Date.now()}`,
		password: 'testpassword',
	}
}

describe('API Resource', function() {
	let token
	let generatedUser

	before(function() {
		return runServer();
	});

	before(function() {
		const newUser = generateUser();
		return chai.request(app)
			.post('/users/signup')
			.send(newUser)
			.then(function(res) {
				token = res.body.token;
				generatedUser = res.body.user;
			});
	});

	after(function() {
		return User.remove({ _id: generatedUser._id }).then((err, res) => {
			// if (err) {
			// 	console.error('User not removed')
			// }
		});
	});

	after(function() {
		return closeServer();
	});

// GET TEST
// 1. make call to login user
// 2. get token
// 3. put token into headers in following request

	it('should return all events', function () {
		return chai.request(app)
			.get('/events')
			.set('X-Access-Token', token)	
			.then(function(_res) {
				_res.should.have.status(200);
			});
	});

// POST TEST - EVENT

	function generateEvent() {
		return {
    		date: new Date(),
            time: '5:00 pm',
            type: 'aura',
            triggers: 'xyz',
            location: 'home',
            medication: 'abc',
            notes: 'def'
			// test userid from token
		};
	};

	it(' should create a new event', function() {
		const newEvent = generateEvent();

		return chai.request(app)
			.post('/events')
			.send(newEvent)
			.set('X-Access-Token', token)	
			.then(function(res){
				res.should.have.status(200);
				res.body.should.be.a('object');
				res.body.should.include.keys('date', 'time', 'type', 'triggers', 'location', 'medication', 'notes');
				res.body.date.should.equal(newEvent.date.toISOString());
				res.body._id.should.not.be.null;
				res.body.time.should.equal(newEvent.time);
				res.body.type.should.equal(newEvent.type);
				return Event.findById(res.body._id);
			})
			.then(function(event) {
				event.date.toISOString().should.equal(newEvent.date.toISOString());
				event.time.should.equal(newEvent.time);
				event.type.should.equal(newEvent.type);
			});
	})


// POST TEST - USER SIGNUP
	it('should create a new user', function() {
		const newUser = generateUser();
		let newUserId = null;

		return chai.request(app)
			.post('/users/signup')
			.send(newUser)
			.then(function(res){
				res.should.have.status(200);
				res.should.be.json;
				res.body.should.be.a('object');
				res.body.should.include.keys('token', 'user');
				res.body.user.username.should.equal(newUser.username);
				res.body.user._id.should.not.be.null;
				newUserId = res.body._id;	
				return User.findById(res.body.user._id);
			})
			.then(function(user) {
				user.username.should.equal(newUser.username);
			});
	})


});

describe('authMiddleware', function() { 
	it('should deny access if unauthorized', function() {
		return chai.request(app)

	})

});
