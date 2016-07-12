import React from 'react';
import { Link } from 'react-router';

export default ({
    categories,
    rootDir
    }) =>
{

    rootDir = rootDir === "" ? "" : "/" + rootDir;

    return Object.keys(categories).length > 0 ? (
        <div className="module-name-and-number-list">
            <h3 className="m-nan-title">Categories</h3>
                <ul className="m-nan-list">
                    {categories.map(category => (
                        <li key={category._id} className="m-nan-list-item">
                            <Link className="m-nan-link" to={`${rootDir}/${category.slug}`}>{category.name}
                                ({category.size})</Link>
                        </li>
                    ))}
                </ul>
        </div>
    ) : null;
}
