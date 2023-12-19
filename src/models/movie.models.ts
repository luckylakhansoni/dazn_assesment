import mongoose, { Schema, Model, Document } from 'mongoose';

type MovieDocument = Document & {
  title: string;
  genre: string;
  rating: string;
  streamLink: string;
};

type MovieInput = {
  title: MovieDocument['title'];
  genre: MovieDocument['genre'];
  rating: MovieDocument['rating'];
  streamLink: MovieDocument['streamLink'];
}


const movieSchema = new Schema(
  {
    title: {
      type: Schema.Types.String,
    },
    genre: {
      type: Schema.Types.String,
    },
    rating: {
      type: Schema.Types.Number,
    },
    StreamLink: {
      type: Schema.Types.String,
    },
  },
  {
    collection: 'movies',
    timestamps: true,
  },
);


const Movie: Model<MovieDocument> = mongoose.model<MovieDocument>('Movie', movieSchema);

export { Movie, MovieInput, MovieDocument };
