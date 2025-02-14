import React, { useState } from 'react'
import { Typography, Button, Form, message, Input, Icon } from 'antd';
import Dropzone from 'react-dropzone'
import { use } from 'react';
//import { response } from 'express';
import axios from 'axios';

const {TextArea}=Input;
const {Title} = Typography;

const PrivateOptions = [
    { value: 0, label: "Private"},
    { value: 1, label: "Public"}
]

const CategoryOptions = [
    {value: 0, label: "Film & Animation"},
    {value: 1, label: "Qutos & Vehicles"},
    {value: 2, label: "Music"},
    {value: 3, label: "Pets & Animals"},
]

function VideoUploadPage(){
    
    const [VideoTitle, setVideoTitle] = useState("")
    const [Description, setDescription] = useState("")
    const [Private, setPrivate] = useState(0)
    const [Category, setCategory] = useState("Film & Animation")

    const onTitleChange = (e) => {
        console.log(e.currentTarget)
        setVideoTitle(e.currentTarget.value)
    }

    const onDescriptionChange = (e) => {
        setDescription(e.currentTarget.value)
    }

    const onPrivateChange = (e) => {
        setPrivate(e.currentTarget.value)
    }

    const onCategoryChange = (e) => {
        setCategory(e.currentTarget.value)
    }

    const onDrop = (files) => {
        let formdata = new FormData();
        const config = {
            header : {'content-type':'multitype/form-data'}
        }
        formdata.append("file", files[0])

        axios.post('/api/video/uploadfiles', formdata, config)
            .then (response => {
                if(response.data.success){
                    console.log(response.data)
                }
                else{
                    alert("failed to upload the video")
                }
            })
    }

    return(
        <div style={{maxWidth:'700px', margin:'2rem auto'}}>

            <div style={{textAlign:'center', marginBottom:'2rem'}}>
                <Title level={2}>Upload video</Title>
            </div>
            
            <Form>
                <div style={{display:'flex', justifyContent:'space-between'}}>
                    
                    <Dropzone 
                    onDrop={onDrop}
                    multiple={false}
                    maxSize={100000000}>
                    {({getRootProps, getInputProps}) => (
                        <div style={{width:'300px', height:"240px", border:'1px solid lightgray', display:'flex', 
                        alignItems:'center', justifyContent:'center'}} {...getRootProps()}>
                            <input{...getInputProps()}/>
                            <Icon type="plus" style={{fontSize:'3rem'}}/>
                        </div>
                    )}
                    </Dropzone>


                    {/*Thumbnail*/}
                    <div>
                        <img src alt />
                    </div>
                </div>
            <br/><br/>

            <label>Title</label>
            <Input
                onChange = {onTitleChange}
                value = {VideoTitle}
            />
            <br/><br/>

            <label>Description</label>
            <TextArea
                onChange = {onDescriptionChange}
                value = {Description}
            />
            <br/><br/>

            <select onChange ={onPrivateChange}>
                {PrivateOptions.map((Item, index) => (
                    <option key={index} value={Item.value}>{Item.label}</option>
                ))}        
            </select>
            <br/><br/>

            <select onChange ={onCategoryChange}>
            {CategoryOptions.map((Item, index) => (
                    <option key={index} value={Item.value}>{Item.label}</option>
                ))}
            </select>
            <br/><br/>

            <Button type='primary' size="large" onClick>
                Submit
            </Button>

            </Form>
        </div>
    )
}

export default VideoUploadPage