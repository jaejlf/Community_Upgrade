import React, { useState } from "react";
import Search from '../assets/images/search.png';
import '../styles/Board.css';


const SearchBar = () => {
    const [option, setOption] = useState("title");  // title, content, writer

    return (
        <div className="searchbar">
            <img src={Search} className="search-img" />
            <input
                className="search-input" 
                placeholder="검색어 입력 후 엔터키를 입력하세요."
                />
            <div className="search-options">
                <button
                    className={
                        option === "title" ? 
                        'search-option-select-o' : 'search-option-select-x'
                    }
                    onClick={() => setOption("title")}
                >글제목</button>
                <button
                    className={
                        option === "content" ? 
                        'search-option-select-o' : 'search-option-select-x'
                    }
                    onClick={() => setOption("content")}
                >글내용</button>
                <button
                    className={
                        option === "writer" ? 
                        'search-option-select-o' : 'search-option-select-x'
                    }
                    onClick={() => setOption("writer")}
                >작성자</button>
            </div>
        </div>
    )
}

export default SearchBar; 