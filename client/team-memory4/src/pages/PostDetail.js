import React, { useEffect, useContext, useState, useReducer, createContext } from 'react';
import { useParams } from "react-router-dom";
import { deleteApi, getApi } from '../api';
import { AuthContext } from "../App";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { AllComments, MyComment } from "../components";
import "../styles/PostDetail.css";


export const RecommentContext = createContext();
const reducer = (state, action) => {
    switch (action.type) {
        case "recommentClick":
            return { 
                recommentId: action.recommentId,
                recomment2Whom: action.recomment2Whom,
            };
        case "recommentNonClick":
            return {
                recommentId: null,
                recomment2Whom: null,
            };
        default:
            return state;
    }
};

const PostDetail = () => {
    const postDumpData = {
        _id: "622ae47d33e4beacf0caaf38",
        userId: 1,
        role: 1,
        writer: "jaej",
        title: "제목4",
        content: "내용4",
        postNumber: 4,
        viewCnt: 9,
        date: "2022-03-14 22:20:42",
        auth: true //true이면 작성자, false이면 작성자 아님
    };
    const authContext = useContext(AuthContext);
    const [state, dispatch] = useReducer(reducer, {
        recommentId: null,
        recomment2Who: null,
    });
    const navigate = useNavigate();

    const [mine, setMine] = useState(false);
    const [postData, setPostData] = useState({
        writer: "",
        title: "",
        content: "",
        date: "",
        viewCnt: 0,
    });

    const params = useParams();
    let postId = params.id;

    useEffect(() => {
        const getPosting = async () => {
            // API Test Code //
            setPostData(postDumpData);
            console.log(postData);
            setMine(postData.auth);
            /////////////////////
            await getApi(
                {},
                `/board/${postId}`,
                authContext.state.token
            )
                .then(({ status, data }) => {
                    if (status === 200) {
                        console.log(data);
                        setPostData({
                            writer: data.writer,
                            role: data.role,
                            title: data.title,
                            content: data.content,
                            date: data.date,
                            viewCnt: data.viewCnt,
                        });
                        setMine(data.auth);  // 내 글인지 여부 -> 수정, 삭제
                    }
                })
                .catch((e) => {
                    console.log(e);
                });
        }
        getPosting();
    }, []);


    const modifyHandler = async () => {

    }

    const deleteHandler = async () => {
        if (window.confirm("정말 삭제하시겠습니까?")) {
            await deleteApi(
                {},
                `/board/${postId}`,
                authContext.state.token
            )
                .then(({ status, data }) => {
                    if (status === 200) {
                        alert("삭제되었습니다.");
                        navigate("/board");
                    } else if (status === 501) {
                        alert("작성자만 게시글을 삭제할 수 있습니다.");
                    } else {
                        alert("삭제에 실패했습니다.");
                    }
                })
                .catch((e) => {
                    console.log(e.response);
                });
        } else {
            alert("취소합니다.");
        }
    }

    

    return (
        <div className='post-detail'>
            <div className='detail-header'>
                <h3 className='detail-title'>{postData.title}</h3>
                <p className='detail-writer'>{postData.writer}</p>
                <p className='detail-role'>{postData.role === 1 ? (
                    <>개인회원</>
                ) : (
                    <>기업회원</>
                )}</p>
                <p className='detail-date'>{postData.date}</p>
            </div>
            <div className='detail-hr'></div>
            <div className='detail-container'>
                <div className='detail-modify-del'>
                    {mine == true ?
                        (<>
                            <p className='detail-modify' onClick={modifyHandler}>수정</p>
                            &nbsp;&nbsp;
                            <p className='detail-del' onClick={deleteHandler}>삭제</p>
                        </>)
                        :
                        (
                            <></>
                        )}
                </div>
                <div className='detail-content'>{postData.content}</div>
            </div>
            <div className='detail-hr'></div>
            <div className='goboard-btn'>
                <Link to='/'>
                <button className='detail-goboard-btn'>목록보기</button>
                </Link>
            </div>
            <RecommentContext.Provider value={{ state, dispatch }}>
                <AllComments props={postId}/>
                <MyComment props={postId}/>
            </RecommentContext.Provider>
            
        </div>
    );
};

export default PostDetail;