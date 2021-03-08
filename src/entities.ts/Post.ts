export class Post {
    constructor(
        private id: string,
        private subtitle: string,
        private date: string,
        private file: string,
        private collection: string,
        private authorId: string
    ) {}

    public getId(): string {return this.id}
    public getSubtitle(): string {return this.subtitle}
    public getDate(): string {return this.date}
    public getFile(): string {return this.file}
    public getCollection(): string {return this.collection}
    public getAuthorId(): string {return this.authorId}
}

export interface PostInputDTO {
    token: string,
    subtitle: string,
    file: string,
    tag: string[],
    collection: string
}

export interface PostIdInputDTO {
    token: string;
    id: string;
}

export interface Tag {
    id: string,
    authorId: string,
    tags: string[]
}

export class PostComplete {
    constructor(
        private id: string,
        private subtitle: string,
        private date: string,
        private file: string,
        private collection: string,
        private tags: string[],
        private authorId: string,
        private nickname: string,
    ) {}

    public getId(): string {return this.id}
    public getSubtitle(): string {return this.subtitle}
    public getDate(): string {return this.date}
    public getFile(): string {return this.file}
    public getCollection(): string {return this.collection}
    public getTags(): string[] {return this.tags}
    public getauthorId(): string {return this.authorId}
    public getNickname(): string {return this.nickname}
}

export interface PostExample {
    id: string,
    subtitle: string,
    file: string,
    tags: string[],
    authorId: string,
    nickname: string,
}