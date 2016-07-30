import React from 'react';

export default ({
    categories,
    root
    }) =>
{
    return Object.keys(categories).length > 0 ? (
        <div className="module-name-and-number-list">
            <h3 className="m-nan-title">Categories</h3>
                <ul className="m-nan-list">
                    {categories.map(category => (
                        <li key={category._id} className="m-nan-list-item">
                            <a className="m-nan-link" href={`${root}category/${category.slug}`}>{category.name} ({category.size})</a>
                        </li>
                    ))}
                </ul>
        </div>
    ) : null;
}
