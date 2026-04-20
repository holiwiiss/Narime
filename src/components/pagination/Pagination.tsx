import "./pagination.scss"

type PaginationProps = {
  actualPage: number;
  lastPage: number;
  onNextPage: () => void;
  onPreviousPage: () => void;
};

const Pagination = ({ actualPage, lastPage, onNextPage, onPreviousPage}: PaginationProps) => {
  return (
    <div className="pagination__container">
      <button
        className={actualPage === 1 ? "pagination__container-btn btn-secondary" : "pagination__container-btn btn-primary"}
        onClick={onPreviousPage}
      >
        atras
      </button>

      <p className="pagination__container-pages">Página {actualPage} de {lastPage}</p>

      <button
        className={actualPage === lastPage ? "pagination__container-btn btn-secondary" : "pagination__container-btn btn-primary"}
        onClick={onNextPage}
      >
        siguiente
      </button>
    </div>
  );
};

export default Pagination;