import React, { useEffect, useState } from 'react'
import SingleComment from './SingleComment';

function ReplyComment(props) {

    const [ChildCommentNumber, setChildCommentNumber] = useState(0)
    const [OpenReplyComments, setOpenReplyComments] = useState(false)

    useEffect(() => {

        // let commentNumber = 0;
        // props.CommentLists.map((comment) => {
            
        //     if (comment.responseTo === props.parentCommentId) {
        //         commentNumber++
        //     }
        // })
        let commentNumber = props.CommentLists.reduce((count, comment) => {
        return comment.responseTo === props.parentCommentId ? count + 1 : count;
        }, 0);
        setChildCommentNumber(commentNumber)
    }, [props.CommentLists, props.parentCommentId]) // commentNumber 바뀔 때마다 useEffect 부분 다시 실행시켜줘야 함


    // let renderReplyComment = (parentCommentId) =>
    //     props.CommentLists.map((comment, index) => (
    //         <React.Fragment>
    //             {comment.responseTo === parentCommentId &&
    //                 <div style={{ width: '80%', marginLeft: '40px' }}>
    //                     <SingleComment comment={comment} postId={props.postId} refreshFunction={props.refreshFunction} />
    //                     <ReplyComment CommentLists={props.CommentLists} parentCommentId={comment._id} postId={props.postId} refreshFunction={props.refreshFunction} />
    //                 </div>
    //             }
    //         </React.Fragment>
    //     ))

    let renderReplyComment = (parentCommentId) =>
        props.CommentLists
            ?.filter((comment) => comment.responseTo === parentCommentId)
            .map((comment) => (
                <div key={comment._id} style={{  width: '80%', marginLeft: '40px' }}>
                    <SingleComment 
                        comment={comment} 
                        postId={props.postId} 
                        refreshFunction={props.refreshFunction} 
                    />
                    <div style={{  paddingLeft: '40px'  }}>
                    <ReplyComment 
                        CommentLists={props.CommentLists} 
                        parentCommentId={comment._id} 
                        postId={props.postId} 
                        refreshFunction={props.refreshFunction} 
                    />
                </div>
                </div>
            ));
    

    const handleChange = () => {
        setOpenReplyComments(!OpenReplyComments)
    }


    return (
        <div>

            {ChildCommentNumber > 0 &&
                <p style={{ fontSize: '14px', margin:0, color: 'gray' }}
                    onClick={handleChange} >
                    View {ChildCommentNumber} more comment(s)
            </p>
            }

            <div style={{ paddingLeft: '40px' }}>
                {renderReplyComment(props.parentCommentId)}
            </div>

        </div>
    )
}

export default ReplyComment