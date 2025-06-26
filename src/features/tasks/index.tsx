import { useEffect, useState } from 'react'
import axios from 'axios'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { columns } from './components/columns'
import { DataTable } from './components/data-table'
import { TasksDialogs } from './components/tasks-dialogs'
import { TasksPrimaryButtons } from './components/tasks-primary-buttons'
import TasksProvider from './context/tasks-context'
import { tasks } from './data/tasks'

export default function Tasks() {
  const [data, setData] = useState([])

  const token =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX3R5cGUiOiJzeXN0ZW1fYWRtaW5pc3RyYXRvciIsInVzZXJfaWQiOiI2ODVhMzYwZWM0YWQ3NjM4MTU1MjYyMWEifQ.4cpbsxsXdezF0Hzlb2zaPGCv1cVXkSkPkID4xPwF7AU'

  const fetchData = async () => {
    try {
      const res = await axios.get(
        'https://807d-2405-204-102c-3709-511b-97ea-35a0-69dc.ngrok-free.app/vendors',
        {
          headers: {
            Authorization: `Bearer ${token}`, // or just token, depending on your backend setup
          },
        }
      )
      console.log(res)
      if (res) {
        setData(res.data.data)
      }
    } catch (error) {
      console.error('Error in Fetching all vendors data: ', error)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  return (
    <TasksProvider>
      <Header fixed>
        <Search />
        <div className='ml-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>

      <Main>
        <div className='mb-2 flex flex-wrap items-center justify-between space-y-2 gap-x-4'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>Vendors</h2>
            <p className='text-muted-foreground'>
              Here&apos;s a list of your Vendors for this month!
            </p>
          </div>
          <TasksPrimaryButtons />
        </div>
        <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-y-0 lg:space-x-12'>
          <DataTable data={tasks} columns={columns} />
        </div>
      </Main>

      <TasksDialogs />
    </TasksProvider>
  )
}
