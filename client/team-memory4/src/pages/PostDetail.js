import React, { useEffect, useContext, useState } from "react";
import { useParams } from "react-router-dom";
import { deleteApi, getApi, postApi, putApi } from "../api";
import { AuthContext, RecommentContext } from "../App";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { AllComments, MyComment } from "../components";
import parse from "html-react-parser";
import {
  FaRegBookmark,
  FaBookmark,
  FaThumbsUp,
  FaRegThumbsUp,
  FaRegEye,
} from "react-icons/fa";
import "../styles/PostDetail.css";

const PostDetail = () => {
  const postDumpData = {
    _id: "622ae47d33e4beacf0caaf38",
    userId: 1,
    role: 1,
    writer: "jaej",
    userRole: 1,
    title: "제목4",
    content: "내용4 어쩌구 이거는 테스트용",
    postNumber: 4,
    viewCnt: 9,
    goodCnt: 0,
    good: [],
    date: "2022-03-14 22:20:42",
    auth: true, //true이면 작성자, false이면 작성자 아님
    userScrapStauts: true,
    userGoodStatus: false,
  };
  const authContext = useContext(AuthContext);
  const navigate = useNavigate();

  const [mine, setMine] = useState(false);
  const [postData, setPostData] = useState({
    writer: "",
    userRole: 1,
    title: "",
    content: "",
    date: "",
    viewCnt: 0,
    goodCnt: 0,
    good: [],
    auth: false,
    userScrapStauts: false,
    userGoodStatus: false,
  });

  const [like, setLike] = useState();
  const [scrap, setScrap] = useState();

  // const [goodCnt, setGoodCnt] = useState(0);

  const params = useParams();
  let postId = params.id;
  console.log(postId);

  useEffect(() => {
    const getPosting = async () => {
      await getApi({}, `/board/${postId}`, authContext.state.token)
        .then(({ status, data }) => {
          if (status === 200) {
            console.log(`GET /board/${postId}`, status, data);
            setPostData({
              writer: data.writer,
              role: data.role,
              title: data.title,
              content: data.content,
              date: data.date,
              viewCnt: data.viewCnt,
              goodCnt: data.goodCnt
            });
            setMine(data.auth); // 내 글인지 여부 -> 수정, 삭제
            setLike(data.userGoodStatus);
            setScrap(data.userScrapStauts);
          }
        })
        .catch((e) => {
          console.log(e);
        });
    }
    getPosting();
  }, [])

  const modifyHandler = () => {
    navigate(`/modify/${postId}`);
  };

  const deleteHandler = async () => {
    if (window.confirm("정말 삭제하시겠습니까?")) {
      await deleteApi({}, `/board/${postId}`, authContext.state.token)
        .then(({ status, data }) => {
          console.log(`DEL /board/${postId}`, status, data);
          if (status === 200) {
            alert("삭제되었습니다.");
            navigate("/");
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
  };

  const likeHandler = async () => {
    setLike(!like);
    await putApi({}, `/board/${postId}/good`, authContext.state.token)
      .then(({ status, data }) => {
        console.log(`PUT /board/${postId}/good`, data);
        if (status === 200 || status === 201) {
          console.log(data);
          if (data.message === "좋아요 누름") {
            setLike(true);
          } else {
            setLike(false);
          }
        } else if (status === 500) {
          alert("로그인을 해야 게시글을 추천할 수 있습니다.");
          navigate("/login");
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const scrapHandler = async () => {
    setScrap(!scrap);

    await putApi({}, `/mypage/scrap/${postId}`, authContext.state.token)
      .then(({ status, data }) => {
        console.log(`PUT /mypage/scrap/${postId}`, data);
        if (status === 200 || status === 201) {
          console.log(data);
          if (data.message === "스크랩 완료") setScrap(true);
          else setScrap(false);
        } else if (status === 501) {
          alert("로그인을 해야 게시글을 스크랩할 수 있습니다.");
          navigate("/login");
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const recommentContext = useContext(RecommentContext);

  return (
    <div className="post-detail">
      <div className="detail-header">
        <p className="detail-postnum">[{postId}]</p>
        <h3 className="detail-title">{postData.title}</h3>
        <p className="detail-writer">{postData.writer}</p>
        <p className="detail-role">
          {postData.role === 2 ? <>기업회원</> : <>개인회원</>}
        </p>

        <p className="detail-date">{postData.date}</p>
      </div>
      <div className="detail-hr"></div>
      <div className="detail-container">
        <div className="detail-modify-del">
          {mine === true ? (
            <>
              <p className="detail-modify" onClick={modifyHandler}>
                수정
              </p>
              &nbsp;&nbsp;
              <p className="detail-del" onClick={deleteHandler}>
                삭제
              </p>
            </>
          ) : (
            <></>
          )}
        </div>
        <div className="detail-content">{parse("" + postData.content)}</div>
      </div>

      <div className="detail-hr"></div>

      <div className="detail-lower-section">
        <div className="detail-cnts">
          <div className="detail-cnt">
            <FaRegThumbsUp />
            <p>{postData.goodCnt}</p>
          </div>
          {/* <div className="detail-cnt">
            <FaRegBookmark />
            <p></p>
          </div> */}
          <div className="detail-cnt">
            <FaRegEye />
            <p>{postData.viewCnt}</p>
          </div>
        </div>

        <div className="detail-click-cnt">
          {like === true ? (
            <div className="detail-cnt">
              <div className="click-cnt" onClick={likeHandler}>
                <FaThumbsUp />
                <p>추천하기</p>
              </div>
            </div>
          ) : (
            <div className="detail-cnt">
              <div className="click-cnt" onClick={likeHandler}>
                <FaRegThumbsUp />
                <p>추천하기</p>
              </div>
            </div>
          )}
          {scrap === true ? (
            <div className="detail-cnt">
              <div className="click-cnt" onClick={scrapHandler}>
                <FaBookmark />
                <p>스크랩하기</p>
              </div>
            </div>
          ) : (
            <div className="detail-cnt">
              <div className="click-cnt" onClick={scrapHandler}>
                <FaRegBookmark onClick={scrapHandler} />
                <p>스크랩하기</p>
              </div>
            </div>
          )}
        </div>
      </div>
      <AllComments props={postId} />
      {!recommentContext.stateR.recommentId ? <MyComment /> : <></>}

      <div className="goboard-btn">
        <Link to="/">
          <button className="detail-goboard-btn">목록보기</button>
        </Link>
      </div>
    </div>
  );
};

export default PostDetail;
