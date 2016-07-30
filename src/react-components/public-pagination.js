import React from 'react';

export default ({
    prevPageLink,
    nextPageLink
}) => (
    <div className="module-pagination">
        <ul className="m-pgn-list">

            {prevPageLink ? (
                <li className="m-pgn-list-item m-pgn-prev">
                    <a className="m-pgn-link" href={prevPageLink}>{`<`} prev</a>
                </li>
            ) : null}

            {nextPageLink ? (
                <li className="m-pgn-list-item m-pgn-next">
                    <a className="m-pgn-link" href={nextPageLink}>next {`>`}</a>
                </li>
            ) : null}
        </ul>
    </div>
)
