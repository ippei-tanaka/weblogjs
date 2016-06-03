import React from 'react';
import Moment from 'moment';
import { Link } from 'react-router';

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
                        <Link className="m-pgn-link" to={linkBuilder(prevPage)}>{`<`} prev</Link>
                    </li>
                ) : null}
                {nextPage ? (
                    <li className="m-pgn-list-item m-pgn-next">
                        <Link className="m-pgn-link" to={linkBuilder(nextPage)}>next {`>`}</Link>
                    </li>
                ) : null}
            </ul>
        </div>
    )
}
