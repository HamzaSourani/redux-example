import React from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectAllUsers } from './usersSlice'
const UsersList = () => {
  const users = useSelector(selectAllUsers)
  const renderedUsers = users.map((user) => {
    return (
      <li key={user.id}>
        <Link to={`/users/${user.id}`}>{user.name}</Link>
      </li>
    )
  })
  return (
    <section>
      <h2>Users</h2>
      <ul>{renderedUsers}</ul>
    </section>
  )
}

export default UsersList
