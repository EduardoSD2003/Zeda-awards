import { Paintbrush2, Trash2 } from "lucide-react";
import { CategoriaProps, Id, MovieProps } from "../../types";
import React, { useState } from "react";
import TextareaAutosize from "react-textarea-autosize";

interface Props {
  categoria: CategoriaProps;
  deletarCategoria: (id: Id) => void;
  updadeCategoria: (id: Id, title: string, color: string) => void;
  movies: MovieProps[];
}

function TierListContainer(props: Props) {
  const { categoria, deletarCategoria, updadeCategoria, movies } = props;
  const [indexInicial, setIndexInicial] = useState(0);
  const [filmesAdd, setFilmesAdd] = useState<MovieProps[]>(
    categoria.movies || []
  );
  const [indexFinal, setIndexFinal] = useState(0);
  const [selectedColor, setSelectedColor] = useState(categoria.color);



  const handleColorChange = (event: any) => {
    const color = event.target.value;
    const title = categoria.title
    setSelectedColor(color);
    updadeCategoria(categoria.id, title, color);  
  };


  const handleOnDrop = (e: React.DragEvent<HTMLDivElement>) => {
    const filmeId = Number(e.dataTransfer.getData("filmeId"));
    const filmeToAdd = movies.find((filme: any) => filme.id === filmeId);
    if (filmeToAdd && !filmesAdd.some((filme) => filme.id === filmeId)) {
      setFilmesAdd((prevFilmesAdd) => [...prevFilmesAdd, filmeToAdd]);

      const storedCategorias = JSON.parse(
        localStorage.getItem("categoria") || "[]"
      );
      const updatedCategorias = storedCategorias.map((cat: CategoriaProps) =>
        cat.id === categoria.id
          ? { ...cat, movies: [...(cat.movies || []), filmeToAdd] }
          : cat
      );
      localStorage.setItem("categoria", JSON.stringify(updatedCategorias));
    }
  };

  const handleOnDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleOnDragStart = (
    e: React.DragEvent,
    filmeId: number,
    index: number
  ) => {
    e.dataTransfer.setData("filmeId", filmeId.toString());
    setIndexInicial(index);
  };

  const handleOnDragOverList = (index: number) => {
    setIndexFinal(index);
  };

  const handleOnDragEndList = () => {
    const items = reorder(filmesAdd, indexInicial, indexFinal);
    setFilmesAdd(items);
  };

  const updateCategoriaInLocalStorage = (updatedCategoria: CategoriaProps) => {
    const storedCategorias = JSON.parse(localStorage.getItem("categoria") || "[]");
    const updatedCategorias = storedCategorias.map((cat: CategoriaProps) =>
      cat.id === categoria.id ? updatedCategoria : cat
    );
    localStorage.setItem("categoria", JSON.stringify(updatedCategorias));
  };

  

  const deleteFilm = (id: number) => {
    setFilmesAdd((prevFilmesAdd) =>
      prevFilmesAdd.filter((filme) => filme.id !== id)
    );
    const updatedCategoria = {
      ...categoria,
      movies: categoria.movies.filter((filme: MovieProps) => filme.id !== id),
    };
    updateCategoriaInLocalStorage(updatedCategoria);
  };

  const reorder = (
    list: MovieProps[],
    startIndex: number,
    endIndex: number
  ) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
  };


  return (
    <div className="w-full h-auto p-3 overflow-y-auto space-y-5 rounded-3xl animate-jump-in animate-delay-200 animate-once ">
      <div className="border border-slate-500 h-auto w-full flex relative rounded-md">
        <div
          className="h-auto w-32 flex flex-wrap p-1 overflow-hidden"
          style={{ backgroundColor: selectedColor }}
        >
          <div className=" h-auto rounded-xl absolute">
            <input
              type="color"
              className="w-4 h-4 rounded-xl cursor-crosshair bg-transparent  -top-3 -left-1 absolute"
              onChange={handleColorChange}
            />
            <Paintbrush2
              className="absolute -top-3 -left-2 size-6 text-white"
              style={{ pointerEvents: "none" }}
            />
          </div>

          <div className="w-full h-full text-black/80 overflow-y-auto flex items-center min-h-24 p-2">
            <TextareaAutosize
              value={categoria.title}
              onChange={(e) => updadeCategoria(categoria.id, e.target.value, selectedColor)}
              autoFocus
              spellCheck={false}
              placeholder="Adicione uma categoria"
              className="bg-transparent w-full h-full flex flex-wrap items-center justify-between text-center border-none placeholder:text-sm resize-none text-decoration:none font-bold"
              style={{ overflow: "auto", scrollbarWidth: "none" }}
            />
          </div>
        </div>

        <div
          className="border-2 border-slate-400 h-auto w-11/12 pb-2 items-baseline space-y-2 flex flex-wrap"
          onDragOver={handleOnDragOver}
          onDrop={handleOnDrop}
        >
          {filmesAdd.map((filme: MovieProps, index) => (
            <div key={filme.id} data-index={index} className="ml-2">
              <img
                src={`https://image.tmdb.org/t/p/w500/${filme.poster_path}`}
                className="size-28 cursor-grab border border-white"
                draggable
                onDoubleClick={() => deleteFilm(filme.id)}
                onDragStart={(e) => handleOnDragStart(e, filme.id, index)}
                onDragOver={() => handleOnDragOverList(index)}
                onDragEnd={() => handleOnDragEndList()}
                alt={filme.title}
              />
            </div>
          ))}
        </div>
        <div className="border-4 border-slate-700 h-auto w-32 flex flex-col items-center justify-evenly rounded-md hover:bg-red-500">
          <Trash2
            onClick={() => {
              deletarCategoria(categoria.id);
            }}
            className="cursor-pointer hover:text-red-900 text-red-600"
          />
        </div>
      </div>
    </div>
  );
}

export default TierListContainer;
