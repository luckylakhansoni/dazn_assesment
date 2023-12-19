// test/app.test.ts
import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../src/index';
import { Message, statusCode } from '../src/constant';
import { Movie } from '../src/models/movie.models';


let MoviesObject = {
    "title": "some title",
    "genre": "some genre",
    "rating": 3,
    "streamLink": "skds",
    "isAdmin": true
}

const expect = chai.expect;

chai.use(chaiHttp);
chai.should()


describe('/POST Movies', () => {
    it('It should create a new movies', (done) => {
        let movie = {
            title: "The Lord of the Rings",
            genre: "J.R.R. Tolkien",
            rating: 3,
            streamLink: "google.com",
            isAdmin: true
        }
        chai.request(app)
            .post('/movies')
            .send(movie)
            .end((err, res) => {
                expect(res).to.have.status(statusCode.Created);
                expect(res.body).to.be.an('object');
                expect(res.body).to.deep.equal({ data: Message.videoCreate });
                done();
            });
    });

});


describe('/GetAll Movies', () => {
    it('it should GET Movies', (done) => {
        chai.request(app)
            .get('/movies')
            .end((err, res) => {
                expect(res).to.have.status(statusCode.success);
                expect(res.body).to.be.an('object');
                expect(res.body).to.have.property('data').that.is.an('array');
                expect(res.body.data).to.have.lengthOf.at.least(1);
                expect(res.body.data[0]).to.be.an('object');
                done();
            });
    });

});

describe('/GET single Movies', () => {
    it('It should existing  movies', (done) => {
        let moveiData = new Movie(MoviesObject);
        moveiData.save((err, data)=>{
            let id = data._id
            chai.request(app)
            .get(`/movie/${id}`)
            .end((err, res) => {
                expect(res).to.have.status(statusCode.success);
                expect(res.body).to.have.property('data').that.is.an('object');
                expect(res.body).to.be.an('object');
                done();
            });
        })
        
    });

});

describe('/PUT Update single Movies', () => {
    it('It should existing  movies',(done) => {
        let moveiData = new Movie(MoviesObject);
        moveiData.save((err, data) => {
            let id = data._id
        chai.request(app)
            .put(`/movies/${id}`)
            .send(MoviesObject)
            .end((err, res) => {
                expect(res).to.have.status(statusCode.success);
                expect(res.body).to.be.an('object');
                expect(res.body).to.deep.equal({ data: Message.dataUpdated });
                done();
            });
        })
        
    });

});

describe('/GET search movies based on fiels title and genre', () => {
    it('It should existing  movies', (done) => {
        chai.request(app)
            .get(`/search?title=${MoviesObject.title}&genre=${MoviesObject.genre}`)
            .end((err, res) => {
                expect(res).to.have.status(statusCode.success);
                expect(res.body).to.be.an('object');
                expect(res.body).to.have.property('data').that.is.an('array');
                expect(res.body.data).to.have.lengthOf.at.least(1);
                expect(res.body.data[0]).to.be.an('object');
                done();
            });
    });

});

describe('/Delete  a movies on admin access', () => {
    it('It should existing  movies', (done) => {
        Movie.find((err, data)=>{
            chai.request(app)
            .delete(`/movies/${data[0]._id}?isAdmin=true`)
            .end((err, res) => {
                expect(res).to.have.status(statusCode.success);
                expect(res.body).to.be.an('object');
                expect(res.body).to.deep.equal({ data: Message.dataDeleted });
                done()
            });
        }).lean()
        
    });

});

