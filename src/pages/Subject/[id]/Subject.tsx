import React from 'react'
import styles from './Subject.module.scss'
import { useParams } from 'react-router-dom'

export const Subject = () => {
  const { id } = useParams()
  return (
    <div>
      <h1>Предмет {id}</h1>
    </div>
  )
}
