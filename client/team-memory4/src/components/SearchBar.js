import React, { useState, useContext, useEffect } from "react";
import Search from '../assets/images/search.png';


const SearchBar = () => {
    return (
        <div>
            <img src={Search} />
            <input 
                className="searchbar"/>
            <div className="search-options">
                <button>글제목</button>
                <button>글내용</button>
                <button>작성자</button>
            </div>
        </div>
    )
}

export default SearchBar; 