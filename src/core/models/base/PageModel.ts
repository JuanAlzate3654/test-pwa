/**
 * page model
 */
export class PageModel<E> {

    /**
     * number page
     */
    pageNum = 0

    /**
     * data
     */
    data: E[] = []

    /**
     * total rows
     */
    totalRows: number = 0

    /**
     * page size
     */
    pageSize: number = 0

    /**
     * offset
     */
    offset: number = 0

}
