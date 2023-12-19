import { Router } from 'express';
import { createMovie, deleteMovie, getAllMovie, getMovie, updateMovie, searchMovies} from '../controllers/movie.controller';

const movieRoute = () => {
  const router = Router();
 
  router.post('/movies', createMovie);

  router.get('/movies', getAllMovie);

  router.get('/movie/:id', getMovie);

  router.put('/movies/:id', updateMovie);

  router.delete('/movies/:id', deleteMovie);
  router.get('/search', searchMovies);


  return router;
};

export { movieRoute };
