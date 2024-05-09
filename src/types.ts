export type Id = string | number;

export type CategoriaProps = {
    id: Id;
    title: string
    color?: string
    movies?: any
}

export interface MovieProps {
    title: string;
    poster_path: string;
    id: number;
    categoriaId: Id
}