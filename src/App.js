import { useEffect, useState } from "react";
import StarRating from "./starRating";

const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);
const KEY='fd346d8e';
export default function App() {
  
  
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const [watched, setWatched] = useState([]);
  const[isLoading , setIsLoading] = useState(false);
  const[error, seterror] = useState('');
  const[selectId,setSelectId] = useState(null)

function handleAddWatched(movie){
  setWatched(watched=>[...watched,movie]);
}

function handleSelectMovie(id){
  setSelectId((selectId)=>(id === selectId ? null : id));
}

function CloseSelectMovie(){
  setSelectId(null);
}

function handleDeleteWatched(id){
    setWatched(watched => watched.filter((movie) =>movie.imdbID !== id))
}
 
  useEffect(function (){
    const controller = new AbortController();
    async function fetchMovies()    
    {
        try {
          setIsLoading(true)
          seterror("")
          const res  =  await fetch(`https://www.omdbapi.com/?apikey=${KEY}&s=${query}`,{signal: controller.signal});
          if(!res.ok) throw new Error("Something went wrong"); 
          
          const data = await res.json();
          
          if(data.Response === "False") throw new Error("Movie not found")
            
            setMovies(data.Search)
            seterror("")
          }
          catch(err){
            if(err.name !== "AbortError"){
          seterror(err.message);
        }
      }
      finally
      {
        setIsLoading(false)
      }

    }
    if(query.length <= 2){
      setMovies([]);
      seterror("");
      return;
    }
    CloseSelectMovie();
    fetchMovies()

    return function(){
      controller.abort();
    }
  },[query])

  return (
    <>
     <Navbar> 
          <Search query={query} setQuery={setQuery}/>  
          <Num_result movies={movies}/>

      </Navbar>
     <Main>
     <Box>
      {isLoading && <Loader/>}
      {!isLoading && !error && <MoviesList onSelectMovie={handleSelectMovie} movies={movies} />}
      {error && <ErrorMessage message = {error}/>}
     </Box>
     <Box>
      {selectId ? <MoviesDetail
      closeDetail={CloseSelectMovie}
      selectId={selectId}
      onAddwatched = {handleAddWatched}
      watched={watched}/>:
      <>
        <WatchedSummary watched={watched}/> 
        <WatchMoviesList onDeleteWatched={handleDeleteWatched}  watched={watched}/>
      </>
      }
      
     </Box>
     </Main>
    </>
  );
}

function Loader(){
  return<p>
    Loading...
  </p>
}

function ErrorMessage({message})
{
  return(<p className="error">
      <span>⛔️</span>{message}
  </p>
  )
}

function Navbar({children}){
  return (
    <nav className="nav-bar">
      <Logo/>
      {children}

</nav>
  )
}
function Search({query, setQuery}){
  return(
    <input
    className="search"
    type="text"
    placeholder="Search movies..."
    value={query}
    onChange={(e) => setQuery(e.target.value)}
    />
  )
}
function Logo(){
  return(
    <div className="logo">
    <span role="img">🍿</span>
    <h1>Mov_ease</h1>
  </div>
  )
}
function Num_result({movies}){
  return(
    <p className="num-results">
    Found <strong>{movies.length}</strong> results
  </p>
  )
}

function Main({children}){
  return(
    <main className="main">
   
   {children}
  
  </main>
  )
}


function Box({children}){
  const [isOpen, setIsOpen] = useState(true);

  return(
    <div className="box">
    <button
      className="btn-toggle"
      onClick={() => setIsOpen((open) => !open)}
    >
      {isOpen ? "–" : "+"}
    </button>
    {isOpen && (children)}
  </div>
  )
}


function MoviesList({movies,onSelectMovie}){
  return(
    <div>
    <ul className="list list-movies">
    {movies?.map((movies) => (
      <Movies movie={movies} onSelectMovie={onSelectMovie} key={movies.imdbID}/>
    ))}
  </ul>
  </div>
  )
}
function Movies({movie,onSelectMovie}){
  return(
    <li onClick={()=>onSelectMovie(movie.imdbID)} key={movie.imdbID}>
        <img src={movie.Poster} alt={`${movie.Title} poster`} />
        <h3>{movie.Title}</h3>
        <div>
          <p>
            <span>🗓</span>
            <span>{movie.Year}</span>
          </p> 
        </div>
      </li>
  )
}


function MoviesDetail({selectId,closeDetail,onAddwatched,watched}){
  const[movie, setMovie] = useState({});
  const[isLoading, setIsLoading] = useState(false)
  const[userRating, setUserRating] = useState('');

  const isWatched = watched.map((movie)=>movie.imdbID).includes(selectId);
  const watchedUserrating = watched.find((movie) => movie.imdbID === selectId)?.userRating;
  const{
    Title:title,
    Year:year,
    imdbRating,
    Genre:genre,
    Actors:actors,
    Poster:poster,
    Released:released,
    Runtime:runtime,
    Plot:plot,
    Director:director,
  } = movie
  
  // const[isTop, setisTop] = useState(imdbRating > 8);
  // useEffect(
    //   function(){
      //     setisTop(imdbRating>8)
  //   },[imdbRating]
  // );
  const isTop = imdbRating > 8;
  console.log(isTop)
  
  const[avgRating, setAvgRating] = useState(0);

  function handleAdd(){
  const newMovie = {
    imdbID : selectId,
    title,
    year,
    poster,
    runtime: Number(runtime.split(" ").at(0)),
    imdbRating: Number(imdbRating),
    userRating,

  }
    onAddwatched(newMovie)
    closeDetail( )
    
    // setAvgRating(Number(imdbRating));
    // setAvgRating((avg)=> (avg + userRating)/2)
}
useEffect(
  function(){
    function callback(e){
      if(e.code ===  "Escape"){
        closeDetail();
        console.log("something");
      }      
    }

    document.addEventListener('keydown', callback);

    return function(){
      document.removeEventListener("key",callback);
    }
},[closeDetail]
)

  useEffect(function(){
    async function getMoviesDetail(){
      setIsLoading(true);
      const res  =  await fetch(`https://www.omdbapi.com/?apikey=${KEY}&i=${selectId}`);
      if (!res.ok) {
        throw new Error("Failed to fetch data");
      }
      const data  = await res.json()
      setMovie(data);
      setIsLoading(false)
    }
    getMoviesDetail();
  },[selectId])
  

  useEffect(function(){
    if(!title) return;
    document.title = `Movie | ${title}`;
    return function (){
      document.title = "Mov_ease";
    };
  },[title ])

  return(
    <div className="details">
      {
      isLoading ? <Loader/>:
      <>
      <header>
      <div className="btn-back" onClick={closeDetail}>&larr;</div>
      <img  src={poster} alt={`Poster of ${title} movie`} />
      <div className="details-overview">
        <h2>{title}</h2>
        <p>{released} &bull; {runtime}</p>
        <p>{genre}</p>
        <p>
          <span>⭐️</span>
          {imdbRating} IMDb rating
        </p>
      </div>
      </header>
   
        
      {/* <p>
        
        {avgRating}
        </p>  */}
      <section>
        <div className="rating">
      {!isWatched ?
        <>
      <StarRating 
      maxrating={10}
      size={24}
      onsetRating={setUserRating}
      />
      
     {userRating > 0 && (
       <button className="btn-add" 
       onClick={handleAdd}>+Add Movie
      </button>)}
      </>
       : 
      <p>You rated with movie {watchedUserrating}<span>⭐️</span> </p>
      }
      </div>
        <p><em>{plot}</em></p>
        <p>Starring : {actors}</p>
        <p>Directed by: {director}</p>
      </section>
      </> 
      }
      </div>
  )

}


function WatchedMovies({movie,onDeleteWatched}){
  return(
    <li>
    <img src={movie.poster} alt={`${movie.title} poster`} />
              <h3>{movie.title}</h3>

              <div>
                <p>
                  <span>⭐️</span>
                  <span>{movie.imdbRating}</span>
                </p>
                <p>
                  <span>🌟</span>
                  <span>{movie.userRating}</span>
                </p>
                <p>
                  <span>⏳</span>
                  <span>{movie.runtime} min</span>
                </p>
                <button className="btn-delete" onClick={()=>onDeleteWatched(movie.imdbID)}>X</button>
              </div>
    </li>
  )
}
function WatchMoviesList({watched,onDeleteWatched}) {
  return (
    <div>
       <ul className="list">
          {watched.map((movie) => (
            <WatchedMovies movie = {movie} key={movie.imdbID} onDeleteWatched={onDeleteWatched}/>
          ))}
        </ul>
    </div>
  )
}

function WatchedSummary({watched}){
  const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
  const avgUserRating = average(watched.map((movie) => movie.userRating));
  const avgRuntime = average(watched.map((movie) => movie.runtime));

  return(
    <div className="summary">
    <h2>Movies you watched</h2>
    <div>
      <p>
        <span>#️⃣</span>
        <span>{watched.length} movies</span>
      </p>
      <p>
        <span>⭐️</span>
        <span>{avgImdbRating.toFixed(2)}</span>
      </p>
      <p>
        <span>🌟</span>
        <span>{avgUserRating.toFixed(2)}</span>
      </p>
      <p>
        <span>⏳</span>
        <span>{avgRuntime} min</span>
      </p>
    </div>
  </div>
  )
}
