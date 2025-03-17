import React from 'react'
import styles from './Profile.module.scss'
import { useParams } from 'react-router-dom'

export const Profile = () => {
    const { id } = useParams()
    console.log(id)
  return (
    <div>
        <h1>Profile</h1>
        <p>Profile ID: {id}</p>
    </div>
  )
}
