export type Id = string | number;

export type CategoriaProps = {
    id: Id;
    title: string
}

export interface MovieProps {
    title: string;
    poster_path: string;
    id: number;
    categoriaId: Id
}