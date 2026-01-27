import React from 'react'
import StatsGrid from '../components/stats'
import Admin from '@/components/admin-table'


function Dashboard() {
    
  return (
     <div className="space-y-6">
      {/* Top section: Stats Grid and Charts side by side */}
      <div >
        {/* The Stats crypto currency grid on Left side */}
        <StatsGrid />
      </div>
      <div >
        {/* The Stats crypto currency grid on Left side */}
        <Admin />
      </div>
       </div>
  )
}

export default Dashboard
