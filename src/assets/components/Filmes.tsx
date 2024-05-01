

function Filmes({ filme }: any) {

  function handleOnDragStart (e:React.DragEvent, filmeId: string) {
    e.dataTransfer.setData("filmeId", filmeId)
  }

  return (
    <div className="flex flex-col size-36 h-auto ml-10 items-center space-y-5">
      <img
        key={filme.id}
        src={`https://image.tmdb.org/t/p/w500/${filme.poster_path}`}
        className="size-24 cursor-grab"
        onDragStart={(e) => handleOnDragStart(e, filme.id)}
        draggable
      />
      <p className="text-center text-lg">{filme.title}</p>
    </div>
  );
}

export default Filmes;
