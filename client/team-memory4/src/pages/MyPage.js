import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from "../App";
import { ReactComponent as HeaderLine } from '../assets/images/header-line.svg';
import { MypagePost, MypageComment, MypageScrap } from '../components';
import "../styles/MyPage.css";


const MyPage = () => {
    const authContext = useContext(AuthContext);
    // 작성글, 작성 댓글, 스크랩 -> 각각 postid를 통해 해당 글로 페이지 이동 
    const [option, setOption] = useState("post"); // post, comment, scrap


    const optionclickHandler = (clickOption) => {
        setOption(clickOption);
    }

    return (
        <div className='mypage'>
            <div className='mypage-info-section'>
                <p>{authContext.state.email}</p>
                <p>닉네임</p>
            </div>
            <div className='mypage-options'>
                <p onClick={() => optionclickHandler("post")}>작성 글</p>
                <p onClick={() => optionclickHandler("comment")}>작성 댓글</p>
                <p onClick={() => optionclickHandler("scrap")}>스크랩한 글</p>
            </div>
            <HeaderLine />
            <div className='mypage-list-section'>
            {
                option === 'scrap' ? (
                    <MypagePost />
                ) : (
                    option === 'comment' ? (
                        <MypageComment />
                    ) : (
                        <MypageScrap />
                    )
                )
            }
            </div>
        </div>
    );
};

export default MyPage;