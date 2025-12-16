/**
 * pagination model
 */
export class PaginationModel {

    /**
     * query
     */
    query: string | null = null

    /**
     * page
     */
    page: number = 0

    /**
     * size
     */
    size: number = 0

    /**
     * sort
     */
    sort: 'ASC' | 'DESC' | '' = 'ASC'

    /**
     * sort column
     */
    sortColumn: string = 'id'

    /**
     * others? - optional variable that is responsible for adding parameters to the query
     */
    private others?: Array<{ key: string, value: string | string[] }> = []

    constructor(size?: number, sortColumn?: string) {
        if (size)
            this.size = size
        if (sortColumn)
            this.sortColumn = sortColumn
    }

    /**
     * funcion addOther
     * @description Se encarga de adicionar un parametro a la consulta
     * @param key  Llave
     * @param value Valor
     * @returns Retorna la página requerida
     */
    public addOther(key: string, value: string | string[]): PaginationModel {
        const index = this.others?.findIndex(({key: k}) => k === key);

        if (index !== -1) {
            this.others[index] = {key, value};
        } else {
            this.others?.push({key, value});
        }

        return this;
    }

    /**
     * funcion defaultRequest
     * @description Se encarga de obtener el parametro de la consulta por la llave
     * @param key  Llave
     * @returns Retorna la consulta adicional
     */
    public getOther(key: string): any {
        let other = this.others?.find(value => value.key === key);
        if (!other) {
            other = {key, value: []};
        }

        return other;
    }

    public getOthers(): Array<{ key: string, value: string | string[] }> {
        return [...this.others];
    }

    /**
     * funcion defaultRequest
     * @description Convierte una página a una paginación requerida
     * @param query  valor a consultar
     * @param page  Página
     * @param size  Tamaño
     * @param sort  Tipo de orden ascendente o descendente
     * @param sortColumn  Columna por la cual se ordena
     * @returns Retorna una paginación requerida
     */
    public toRequest(): any {
        const request = {
            query: this.query,
            page: String(this.page),
            size: String(this.size),
            sort: this.sort,
            sortColumn: this.sortColumn
        };

        this.others?.forEach(({key, value}) => request[key] = value);

        return request;
    }

}
