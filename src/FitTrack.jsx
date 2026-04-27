import { useState, useMemo } from 'react'
import { useStorage, today } from './utils'
import Nav from './components/Nav'

import Today from './screens/Today'
import ActiveWorkout from './screens/ActiveWorkout'
import Programmes from './screens/Programmes'
import AICoach from './screens/AICoach'
import Settings from './screens/Settings'
import StretchRoutine from './screens/StretchRoutine'
import Onboarding from './screens/Onboarding'
import CheckIn from './screens/CheckIn'
import AdaptiveToday from './screens/AdaptiveToday'
import AdaptiveSetup from './screens/AdaptiveSetup'
import FlareDetail from './screens/FlareDetail'

import Cardio from './screens/Cardio'
import Golf from './screens/Golf'
import Recovery from './screens/Recovery'
import Stats from './screens/Stats'
import Scheduler from './screens/Scheduler'

function computeFlares(checkins) {
  if (!checkins.length) return { episodes: [] }
  const sorted = [...checkins].sort((a, b) => a.date.localeCompare(b.date))
  const episodes = []
  let current = null

  sorted.forEach((c, i) => {
    const maxSev = Math.max(0, ...(c.joints || []).map(j => j.severity))
    const prevDate = i > 0 ? sorted[i - 1].date : null
    const dayGap = prevDate
      ? Math.round((new Date(c.date) - new Date(prevDate)) / 86400000)
      : 0

    if (maxSev >= 1) {
      if (!current || dayGap > 2) {
        if (current) episodes.push({ ...current, resolved: true })
        current = { startDate: c.date, joints: c.joints.filter(j => j.severity >= 1).map(j => j.id), duration: 1 }
      } else {
        current.duration++
      }
    } else if (maxSev === 0 && current) {
      episodes.push({ ...current, resolved: true })
      current = null
    }
  })

  if (current) {
    const lastCheckin = sorted[sorted.length - 1]
    const daysSinceLast = Math.round((new Date(today()) - new Date(lastCheckin.date)) / 86400000)
    episodes.push({ ...current, resolved: daysSinceLast >= 2 })
  }

  return { episodes }
}

export default function FitTrack() {
  const [tab, setTab] = useState('today')
  const [onboarding, saveOnboarding] = useStorage('ft-onboarding', { complete: false })
  const [checkins] = useStorage('ft-checkins', [])

  const flares = useMemo(() => computeFlares(checkins), [checkins])

  const todayCheckin = checkins.find(c => c.date === today())
  const todayMaxSeverity = todayCheckin
    ? Math.max(0, ...(todayCheckin.joints || []).map(j => j.severity))
    : 0

  const todayScreen = () => {
    if (!onboarding.complete) return <Onboarding onComplete={data => saveOnboarding({ ...data, complete: true })} />
    if (todayMaxSeverity >= 1) return <AdaptiveToday setTab={setTab} flares={flares} />
    return <Today setTab={setTab} />
  }

  const hideNav = !onboarding.complete || tab === 'active-workout' || tab === 'checkin'

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      {tab === 'today'          && todayScreen()}
      {tab === 'active-workout' && <ActiveWorkout onClose={() => setTab('today')} />}
      {tab === 'train'          && <Programmes setTab={setTab} />}
      {tab === 'ai'             && <AICoach />}
      {tab === 'stats'          && <Stats />}
      {tab === 'cardio'         && <Cardio />}
      {tab === 'golf'           && <Golf />}
      {tab === 'recover'        && <Recovery />}
      {tab === 'schedule'       && <Scheduler />}
      {tab === 'settings'       && <Settings setTab={setTab} />}
      {tab === 'adaptive-setup' && <AdaptiveSetup />}
      {tab === 'flare-detail'   && <FlareDetail flares={flares} />}
      {tab === 'checkin'        && <CheckIn onComplete={() => setTab('today')} />}
      {tab === 'stretch'        && <StretchRoutine />}

      {!hideNav && <Nav tab={tab} setTab={setTab} />}
    </div>
  )
}
