import React, { useState, useContext, useEffect } from "react";
import { postApi } from '../api';
import { AuthContext } from '../App';
import { RecommentContext } from "../pages/PostDetail";
import '../styles/Comments.css';



const MyComment = ({ props }) => {
    const authContext = useContext(AuthContext);
    const recommentContext = useContext(RecommentContext);
    const [recomment, setRecomment] = useState("");
    const [myComment, setMyComment] = useState("");
    let postId = props * 1;

    useEffect(() => {
        if (recommentContext.state.recommentId !== null) {
            setRecomment(`[${recommentContext.state.recomment2Whom}에게 답글]`)
        } else {
            setRecomment('');
        }
    }, [recommentContext.state.recommentId]);

    const commentWriteHandler = async () => {
        console.log(myComment);
        if (recommentContext.state.recommentId === null) {  // 댓글 작성 (대댓글 X)
            await postApi(
                {
                    content: myComment,
                },
                `/comment/${postId}`,
                authContext.state.token
            )
            .then(({ status, data }) => {
                if (status === 200 || status === 201) {
                    console.log('댓글 작성 post api', status);
                    window.location.replace(`/post/${postId}`);  // 새로고침하여 댓글 다시 불러오기
                } else if (status === 500) {
                    alert("댓글 등록 시 오류가 발생했습니다.");
                } else if (status === 400) {
                    alert("내용을 입력해주세요.");
                } else if (status === 501) {
                    alert("로그인을 해야 댓글을 작성할 수 있습니다.");
                }
            })
            .catch((e) => {
                console.log(e);
            });
        } else { // 대댓글 작성
            await postApi(
                {
                    content: myComment,
                },
                `/comment/${recommentContext.state.recommentId}/parent`,
                authContext.state.token
            )
            .then(({ status, data }) => {
                if (status === 200 || status === 201) {
                    console.log('대댓글 post api', status);
                    window.location.replace(`/post/${postId}`);  // 새로고침하여 댓글 다시 불러오기
                } else if (status === 500) {
                    alert("댓글 등록 시 오류가 발생했습니다.");
                } else if (status === 400) {
                    alert("내용을 입력해주세요.");
                } else if (status === 501) {
                    alert("로그인을 해야 댓글을 작성할 수 있습니다.");
                }
            })
            .catch((e) => {
                console.log(e);
            });
        }
    }

    return (
        <div className='my-comments-section'>
            {/* <p>{authContext.state.name}</p> */}
            <div className='my-comment-upper'>
                <p>작성자 : 닉네임</p>
                <button onClick={commentWriteHandler}>등록</button>
            </div>
            <p className="recomment-to-whom">{recomment}</p>
            <textarea
                className='input-comment'
                wrap='soft'
                name='myComment'
                onChange={
                    (e) => setMyComment(e.target.value)
                }
                value={myComment}
                placeholder="댓글을 입력하세요"
            ></textarea>
        </div>
    )
}

export default MyComment; 