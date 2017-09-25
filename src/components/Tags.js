import React from 'react';
import Link from 'gatsby-link';

export default function Tags({ list = [] }) {
  return (
    <ul>
      {list.map(tag =>
        <li key={tag}>
          <Link to={`/tags/${tag}`}>
            {tag}
          </Link>
        </li>
      )}
    </ul>
  );
}
