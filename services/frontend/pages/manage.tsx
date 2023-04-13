import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import Navbar from '../components/Navbar';
import styled from 'styled-components';

const Button = styled.button`
  color: white;
  font-size: 1em;
  border: 1px solid;
  border-radius: 3px;
`;

const GreenButton = styled(Button)`
  color: green;
  border-color: green;
`;

const RedButton = styled(Button)`
  color: red;
  border-color: red;
`;

function Table() {
    const [movie, setMovie] = useState<SilverVillage.Movie[]>([]);

    useEffect(() => {
        async function fetchMovies() {
            const resp = await fetch('http://localhost:8000/movies'); //must call orchestrator
            const data = await resp.json()
            console.log(data)
            setMovie(data.data.movies)
        }
        fetchMovies()
    }, []);
    return (
        <Layout>
            <Navbar />
            <div className="App">
                <table>
                    <tr>
                        <th>Edit</th>
                        <th>ID</th>
                        <th>Title</th>
                        <th>Director</th>
                        <th>Cast</th>
                        <th>Synopsis</th>
                        <th>Genre</th>
                        <th>Duration_min</th>
                        <th>Poster</th>
                        <th>Release_date</th>
                        <th>Rating</th>
                        <th>Language</th>
                        <th>Delete</th>
                    </tr>
                    {movie.map((val, key) => {
                        return (
                            <tr key={key}>
                                <td><GreenButton>Edit</GreenButton></td>
                                <td>{val.movie_id}</td>
                                <td>{val.title}</td>
                                <td>{val.director}</td>
                                <td>{val.cast}</td>
                                <td>{val.synopsis.substring(0, 50)}...</td>
                                <td>{val.genre}</td>
                                <td>{val.duration_min}</td>
                                <td>{val.poster}</td>
                                <td>{val.release_date}</td>
                                <td>{val.rating}</td>
                                <td>{val.language}</td>
                                <td><RedButton>Delete</RedButton></td>
                            </tr>
                        )
                    })}
                </table>
            </div>
        </Layout>
    );
};

export default Table;

