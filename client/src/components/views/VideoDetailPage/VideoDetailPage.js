import React, { useEffect, useState } from 'react'
import { List, Avatar, Row, Col } from 'antd';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import SideVideo from './Sections/SideVideo';
import Subscriber from './Sections/Subscriber';
import Comments from './Sections/Comments';
import LikeDislikes from './Sections/LikeDislikes';

function VideoDetailPage(props) {


    //const videoId = props.match.params.videoId
    const { videoId } = useParams();  // React Router v6 방식
    const [VideoDetail, setVideoDetail] = useState([])
    const [CommentLists, setCommentLists] = useState([])

    const videoVariable = {
        videoId: videoId
    }
    
    useEffect(() => {
        console.log("전송할 videoId:", videoId);  //  videoId 확인
    console.log("전송할 videoVariable:", { videoId });  //  요청 데이터 확인

    axios.post('/api/video/getVideoDetail', { videoId })
        .then(response => {
            console.log("API 응답 데이터:", response.data);  //  API 응답 확인
            if (response.data.success) {
                setVideoDetail(response.data.video);
            } else {
                alert('Failed to get video Info');
            }
        })
        .catch(error => console.error("API 요청 오류:", error));

        axios.post('/api/comment/getComments', videoVariable)
            .then(response => {
                if (response.data.success) {
                    console.log('response.data.comments', response.data.comments)
                    setCommentLists(response.data.comments)
                } else {
                    alert('Failed to get video Info-comments')
                }
            })


    }, [])

    const refreshFunction = (newComment) =>{
        setCommentLists(CommentLists.concat(newComment))
    }

    if (VideoDetail.writer) {

        const subscribeButton = VideoDetail.writer._id !== localStorage.getItem('userId') && <Subscriber userTo={VideoDetail.writer._id} userFrom={localStorage.getItem('userId')}/>


        return (
            <Row>
                <Col lg={18} xs={24}>
                    <div className="postPage" style={{ width: '100%', padding: '3rem 4em' }}>
                        <video style={{ width: '100%' }} src={`http://localhost:5000/${VideoDetail.filePath}`} controls></video>

                        <List.Item
                            actions={[<LikeDislikes video userId={localStorage.getItem('userId')} videoId={videoId}/>, subscribeButton]}
                        >
                            <List.Item.Meta
                            
                                avatar={<Avatar src={VideoDetail.writer && VideoDetail.writer.image} />}
                                title={<a href="https://ant.design">{VideoDetail.title}</a>}
                                description={VideoDetail.description}
                            />
                            <div></div>
                        </List.Item>
                        <Comments CommentLists={CommentLists} postId={VideoDetail._id} refreshFunction={refreshFunction} />                        

                    </div>
                </Col>
                <Col lg={6} xs={24}>

                    <SideVideo />

                </Col>
            </Row>
        )

    } else {
        return (
            <div>Loading...</div>
        )
    }


}

export default VideoDetailPage
