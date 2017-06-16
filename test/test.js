const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();

chai.use(chaiHttp);

describe('first test', () => {
	it('should expect true to be true', () => {
		const trueValue = true;
		trueValue.should.equal(true);
	})
})