export class Genre {
    constructor(
        private id: string,
        private author_id: string,
        private genre: string
    ) {}

    public getId(): string {return this.id}
    public getAuthor_id(): string {return this.author_id}
    public getGenre(): string {return this.genre}
}

export interface GenreInputDTO {
    author_id: string
    genre: string
}