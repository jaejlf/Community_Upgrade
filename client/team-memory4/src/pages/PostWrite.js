import React, { useState } from 'react';
import { Editor } from '../components';
import "../styles/Write.css"


const PostWrite = () => {
    const [desc, setDesc] = useState('');  // 들어갈 내용
    let wm = 'write';
    function onEditorChange(value) {
        setDesc(value)
    }

    return (
        <div>
            <Editor value={desc, wm} onChange={onEditorChange} />
        </div>
    );
};

export default PostWrite;