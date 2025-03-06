import { Button } from 'antd'
import Axios from 'axios'
import React, { useEffect, useState } from 'react'

function Subscriber(props) {

  const [SubscriberNumber, setSubscriberNumber] = useState(0)
  const [Subscribed, setSubscribed] = useState(false)

  useEffect(()=>{

    let variable = {userTo:props.userTo}

    Axios.post('api/subscribe/subscriberNumber', variable)
    .then(response=>{
        if(response.data.data.success){
          setSubscriberNumber(response.data.SubscriberNumber)
        }else{
          alert("can't get information of subscriber")
        }
    })


    let subscribedVariable = {userTo: props.userTo, userFrom:localStorage.getItem('userId')}

    Axios.post('/api/subscribe/subscribed', subscribedVariable)
    .then(response=>{
      if(response.data.success){
        setSubscribed(response.data.subscribed)
      }else{
        alert("can't get information")
      }
    })

  })


  const onSubscribe = () =>{

    let subscriberBariable = {
      userTo: props.userTo, 
      UserFrom: props.userFrom
    }

    if(Subscribed){
      Axios.post('/api/subscribe/unSubscribe', subscriberBariable)
      .then(response=>{
        if(response.data.success){
            setSubscriberNumber(SubscriberNumber-1)
            setSubscribed(!Subscribed)
        }else{
          alert("failed to unsubscribe")
        }
      })
    }

    else{
      Axios.post('/api/subscribe/subscribe', subscriberBariable)
      .then(response=>{
        if(response.data.success){
          setSubscriberNumber(SubscriberNumber+1)
            setSubscribed(!Subscribed)
        }else{
          alert("failed to subscribe")
        }
      })
    }
  }

  return (
    <div>
      <button
        style={{backgroundColor: `${Subscribed ? '#AAAAAA':"#cc0000"}`, borderRadius:"4px", color:'white', padding:"10px 16px", fontWeight:'500', fontSize:"1rem", textTransform:'uppercase'}}
        onClick={onSubscribe}
      >
        {SubscriberNumber}{Subscribed ? 'Subscribed':'Subscribe'}
      </button>
    </div>
  )
}

export default Subscriber
