import React, { useState } from 'react';
import { Editor } from '../components';
import "../styles/Write.css"

const PostModify = () => {
    const [desc, setDesc] = useState('');  // 들어갈 내용
    let wm = 'modify';
    function onEditorChange(value) {
        setDesc(value)
    }

    return (
        <div>
            <Editor value={desc, wm} onChange={onEditorChange} />
        </div>
    );
};

export default PostModify;