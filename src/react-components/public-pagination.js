import React from 'react';

export default ({
    totalPages,
    currentPage,
    linkBuilder
    }) => {

    totalPages = Number.parseInt(totalPages);
    currentPage = Number.parseInt(currentPage);

    const prevPage = 1 <= currentPage - 1 ? currentPage - 1 : null;
    const nextPage = currentPage + 1 <= totalPages ? currentPage + 1 : null;

    return (
        <div className="module-pagination">
            <ul className="m-pgn-list">
                {prevPage ? (
                    <li className="m-pgn-list-item m-pgn-prev">
                        <a className="m-pgn-link" href={linkBuilder(prevPage)}>{`<`} prev</a>
                    </li>
                ) : null}
                {nextPage ? (
                    <li className="m-pgn-list-item m-pgn-next">
                        <a className="m-pgn-link" href={linkBuilder(nextPage)}>next {`>`}</a>
                    </li>
                ) : null}
            </ul>
        </div>
    )
}
