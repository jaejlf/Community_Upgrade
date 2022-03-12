import React, { useState } from 'react';
import { Editor } from '../components';


const PostModify = () => {
    const [desc, setDesc] = useState('수정.. 잘 되나?');  // 들어갈 내용
    function onEditorChange(value) {
        setDesc(value)
    }

    return (
        <div>
            <Editor value={desc} onChange={onEditorChange} />
        </div>
    );
};

export default PostModify;