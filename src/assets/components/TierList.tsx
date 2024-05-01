import { PackagePlus } from "lucide-react";
import { useEffect, useState } from "react";
import { CategoriaProps, Id, MovieProps } from "../../types";
import TierListContainer from "./TierListContainer";
import Filmes from "./Filmes";
import { newtonsCradle } from "ldrs";

newtonsCradle.register();

function TierList() {
  const [categorias, setCategorias] = useState<CategoriaProps[]>([]);

  const [listaFilmes, setListaFilmes] = useState<MovieProps[]>([]);

  const [searchText, setSearchText] = useState("");

  const [isLoading, setIsLoading] = useState(true);

  const getMovie = async () => {
    const response = await fetch(
      `https://api.themoviedb.org/3/search/movie?api_key=b51f23eec1d78e4e419c1252dad17f4c&query=${searchText}`
    );
    const jsonData = await response.json();

    if (jsonData.results.length > 0) {
      setListaFilmes(jsonData.results);
      setIsLoading(false);
    }
  };

  const handleSearchTextChange = (event: any) => {
    setSearchText(event.target.value);
    if (!event.target.value) {
      setIsLoading(true);
    }
  };

  useEffect(() => {
    if (searchText) {
      const timeoutId = setTimeout(() => {
        getMovie();
      }, 5000);
      return () => clearTimeout(timeoutId);
    }
  }, [searchText]);

  return (
    <div className="">
      <div className="p-10 w-full h-auto bg-slate-400 items-center justify-center flex flex-col space-y-2">
        <h1 className="mb-5 background-animate bg-gradient-to-r from-blue-200 via-blue-500 to-blue-600 bg-clip-text flex justify-center items-center content-center w-full text-transparent text-5xl select-none">Zeda awards</h1>
        <input
          type="text"
          value={searchText}
          onChange={handleSearchTextChange}
          className="w-96 p-5 rounded-xl text-center"
          placeholder="Busque algum filme"
        />
      </div>
      <div className="m-3">
        {isLoading ? (
          <div className="w-full flex justify-center">
            <l-newtons-cradle
              size="78"
              speed="1.4"
              color="green"
            ></l-newtons-cradle>
          </div>
        ) : (
          <div className="w-full h-auto flex flex-wrap bg-slate-500 border-slate-800 border-8 p-5 rounded-xl animate-fade">
            {listaFilmes.map((movie) => (
              <Filmes key={movie.id} filme={movie} />
            ))}
          </div>
        )}
      </div>

      <div className="bg-slate-600 p-3 rounded-3xl m-1">
        <div className="w-full bg-slate-600 flex justify-center p-3">
          <PackagePlus
            onClick={criarCategoria}
            className="text-gray-100 size-8 rounded-3xl cursor-pointer hover:scale-125 hover:text-green-500 "
          />
        </div>

        {categorias.map((cat) => (
          <TierListContainer
            key={cat.id}
            categoria={cat}
            deletarCategoria={deletarCategoria}
            updadeCategoria={updadeCategoria}
            movies={listaFilmes}
          />
        ))}
      </div>
    </div>
  );

  function criarCategoria() {
    const categoriaToAdd: CategoriaProps = {
      id: generateId(),
      title: "",
    };
    setCategorias([...categorias, categoriaToAdd]);
  }

  function deletarCategoria(id: Id) {
    const categoriasFiltradas = categorias.filter((cat) => cat.id !== id);
    setCategorias(categoriasFiltradas);
  }

  function updadeCategoria(id: Id, title: string) {
    const novasCategorias = categorias.map((cat) => {
      if (cat.id !== id) return cat;
      return { ...cat, title };
    });

    setCategorias(novasCategorias);
  }

  function generateId() {
    return Math.floor(Math.random() * 1001);
  }
}

export default TierList;
