import { useState, useEffect, useRef } from 'react'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

;(function injectFonts() {
  if (document.getElementById('ft-fonts')) return
  const link = document.createElement('link')
  link.id = 'ft-fonts'
  link.rel = 'stylesheet'
  link.href = 'https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@400;500;600;700&display=swap'
  document.head.appendChild(link)
})()

const CSS = `
*{box-sizing:border-box;margin:0;padding:0}
body{background:#0a0a0f;color:#e8e8f0;font-family:'DM Sans',sans-serif;min-height:100vh;overflow-x:hidden}
.ft-app{max-width:430px;margin:0 auto;min-height:100vh;position:relative;padding-bottom:80px}
.ft-nav{position:fixed;bottom:0;left:50%;transform:translateX(-50%);width:100%;max-width:430px;background:#13131e;border-top:1px solid #1e1e2e;display:flex;z-index:100;padding:6px 0 10px}
.ft-nav-btn{flex:1;display:flex;flex-direction:column;align-items:center;gap:3px;background:none;border:none;color:#555;cursor:pointer;font-size:9px;font-family:'DM Sans',sans-serif;padding:4px 2px;transition:color .2s}
.ft-nav-btn.active{color:#c8f135}
.ft-nav-btn svg{width:20px;height:20px}
.ft-screen{padding:20px 16px}
.ft-screen.embedded{padding:0}
.ft-h1{font-family:'Bebas Neue',sans-serif;font-size:32px;letter-spacing:1px;color:#c8f135;margin-bottom:4px}
.ft-h2{font-family:'Bebas Neue',sans-serif;font-size:22px;letter-spacing:.5px;margin-bottom:12px}
.ft-h3{font-size:13px;font-weight:600;margin-bottom:8px;color:#aaa;text-transform:uppercase;letter-spacing:.5px}
.ft-card{background:#13131e;border:1px solid #1e1e2e;border-radius:12px;padding:14px;margin-bottom:10px}
.ft-btn{display:inline-flex;align-items:center;justify-content:center;gap:6px;padding:10px 18px;border-radius:10px;border:none;cursor:pointer;font-family:'DM Sans',sans-serif;font-weight:600;font-size:14px;transition:all .2s}
.ft-btn-primary{background:#c8f135;color:#0a0a0f}
.ft-btn-primary:hover{background:#d4f74d}
.ft-btn-secondary{background:#1e1e2e;color:#e8e8f0;border:1px solid #2e2e3e}
.ft-btn-secondary:hover{background:#2e2e3e}
.ft-btn-ghost{background:none;border:1px solid #2e2e3e;color:#aaa}
.ft-btn-danger{background:#ff6b6b22;color:#ff6b6b;border:1px solid #ff6b6b44}
.ft-btn-full{width:100%}
.ft-btn-sm{padding:6px 12px;font-size:12px}
.ft-input{width:100%;background:#0a0a0f;border:1px solid #2e2e3e;border-radius:8px;padding:10px 12px;color:#e8e8f0;font-family:'DM Sans',sans-serif;font-size:14px;outline:none}
.ft-input:focus{border-color:#c8f135}
.ft-select{width:100%;background:#0a0a0f;border:1px solid #2e2e3e;border-radius:8px;padding:10px 12px;color:#e8e8f0;font-family:'DM Sans',sans-serif;font-size:14px;outline:none;cursor:pointer}
.ft-label{font-size:12px;color:#888;margin-bottom:4px;display:block}
.ft-row{display:flex;gap:8px;align-items:center}
.ft-col{display:flex;flex-direction:column;gap:6px}
.ft-badge{display:inline-block;padding:2px 8px;border-radius:20px;font-size:11px;font-weight:600}
.ft-badge-lime{background:#c8f13522;color:#c8f135}
.ft-badge-purple{background:#6c63ff22;color:#6c63ff}
.ft-badge-orange{background:#f5a62322;color:#f5a623}
.ft-badge-red{background:#ff6b6b22;color:#ff6b6b}
.ft-badge-teal{background:#4ecdc422;color:#4ecdc4}
.ft-badge-green{background:#38b87c22;color:#38b87c}
.ft-badge-blue{background:#63b3ed22;color:#63b3ed}
.ft-chip{padding:6px 14px;border-radius:20px;border:1px solid #2e2e3e;background:none;color:#888;font-size:13px;cursor:pointer;font-family:'DM Sans',sans-serif;transition:all .15s;white-space:nowrap}
.ft-chip.active{background:#c8f13522;border-color:#c8f135;color:#c8f135}
.ft-chips{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:12px}
.ft-divider{border:none;border-top:1px solid #1e1e2e;margin:12px 0}
.ft-tab-bar{display:flex;background:#0a0a0f;border-radius:10px;padding:3px;margin-bottom:16px;border:1px solid #1e1e2e}
.ft-tab-btn{flex:1;padding:7px;border:none;background:none;color:#666;font-family:'DM Sans',sans-serif;font-size:13px;font-weight:600;border-radius:8px;cursor:pointer;transition:all .2s}
.ft-tab-btn.active{background:#1e1e2e;color:#c8f135}
.ft-empty{text-align:center;padding:40px 20px;color:#555}
.ft-empty svg{opacity:.3;margin-bottom:12px}
.ft-tag{font-size:11px;padding:2px 6px;border-radius:4px;background:#1e1e2e;color:#888}
.ft-overlay{position:fixed;inset:0;background:#000a;z-index:200;display:flex;align-items:flex-end}
.ft-sheet{background:#13131e;border-radius:20px 20px 0 0;border-top:1px solid #2e2e3e;padding:20px;width:100%;max-height:90vh;overflow-y:auto}
.ft-modal{position:fixed;inset:0;background:#000b;z-index:300;display:flex;align-items:center;justify-content:center;padding:16px}
.ft-modal-box{background:#13131e;border:1px solid #2e2e3e;border-radius:16px;padding:20px;width:100%;max-width:400px;max-height:85vh;overflow-y:auto}
.ft-progress-bar{height:6px;background:#1e1e2e;border-radius:3px;overflow:hidden;margin-top:6px}
.ft-progress-fill{height:100%;background:#c8f135;border-radius:3px;transition:width .3s}
.ft-fab{position:fixed;bottom:90px;right:50%;transform:translateX(calc(50% + 180px));width:52px;height:52px;border-radius:50%;background:#c8f135;border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 20px #c8f13544;z-index:99}
.ft-ss-label{font-size:10px;padding:1px 5px;border-radius:3px;font-weight:700;color:#0a0a0f;display:inline-block;margin-right:4px}
.ft-icon-btn{background:none;border:none;cursor:pointer;color:#888;display:flex;align-items:center;justify-content:center;padding:4px;border-radius:6px;transition:color .2s}
.ft-icon-btn:hover{color:#e8e8f0;background:#1e1e2e}
.ft-stat-box{background:#13131e;border:1px solid #1e1e2e;border-radius:10px;padding:12px;text-align:center}
.ft-stat-num{font-family:'Bebas Neue',sans-serif;font-size:28px;color:#c8f135}
.ft-stat-lbl{font-size:11px;color:#666;margin-top:2px}
.ft-grid-2{display:grid;grid-template-columns:1fr 1fr;gap:8px}
.ft-grid-3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px}
.ft-scrollx{display:flex;gap:8px;overflow-x:auto;padding-bottom:4px;scrollbar-width:none}
.ft-scrollx::-webkit-scrollbar{display:none}
.ft-timer-ring{position:relative;display:flex;align-items:center;justify-content:center}
.ft-chat-bubble{padding:10px 14px;border-radius:12px;max-width:85%;font-size:14px;line-height:1.5}
.ft-chat-user{background:#c8f13522;border:1px solid #c8f13533;align-self:flex-end;border-radius:12px 12px 2px 12px}
.ft-chat-ai{background:#1e1e2e;border:1px solid #2e2e3e;align-self:flex-start;border-radius:12px 12px 12px 2px}
.ft-chat-msgs{display:flex;flex-direction:column;gap:10px;padding:16px;flex:1;overflow-y:auto}
.ft-dot-pulse{display:flex;gap:4px;padding:8px 12px}
.ft-dot-pulse span{width:6px;height:6px;border-radius:50%;background:#888;animation:pulse 1.2s ease-in-out infinite}
.ft-dot-pulse span:nth-child(2){animation-delay:.2s}
.ft-dot-pulse span:nth-child(3){animation-delay:.4s}
@keyframes pulse{0%,80%,100%{opacity:.3;transform:scale(.8)}40%{opacity:1;transform:scale(1)}}
.ft-exercise-row{display:grid;grid-template-columns:1fr 60px 60px 70px 36px;gap:4px;align-items:center;margin-bottom:6px}
.ft-exercise-row input{background:#0a0a0f;border:1px solid #1e1e2e;border-radius:6px;padding:6px 8px;color:#e8e8f0;font-size:13px;text-align:center;outline:none;width:100%}
.ft-exercise-row input:focus{border-color:#c8f135}
@media(max-width:380px){.ft-exercise-row{grid-template-columns:1fr 50px 50px 60px 32px}}
`

function useStorage(key, init) {
  const [val, setVal] = useState(() => {
    try { const s = localStorage.getItem(key); return s ? JSON.parse(s) : init } catch { return init }
  })
  const save = v => { setVal(v); try { localStorage.setItem(key, JSON.stringify(v)) } catch {} }
  return [val, save]
}

function fmt(n) { return n === '' || n === undefined || n === null ? '' : String(n) }
function today() { return new Date().toISOString().slice(0, 10) }
function dateLabel(d) {
  const diff = Math.round((new Date(today()) - new Date(d)) / 86400000)
  if (diff === 0) return 'Today'; if (diff === 1) return 'Yesterday'
  return new Date(d + 'T12:00:00').toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
}
function kg(w) { return w ? `${w}kg` : 'BW' }

const SS_COLOURS = ['#c8f135','#6c63ff','#f5a623','#4ecdc4','#ff6b6b','#63b3ed','#38b87c','#f5a623']

const TUTORIALS = [
  { name:'Barbell Back Squat', muscles:'Quads, glutes, hamstrings', how:'Bar on upper traps, feet shoulder-width, descend until thighs parallel, drive through heels', tip:'Keep chest tall and knees tracking over toes' },
  { name:'Romanian Deadlift', muscles:'Hamstrings, glutes, lower back', how:'Hip-hinge with soft knees, lower bar along legs until mild hamstring stretch, drive hips forward', tip:'Feel the stretch before reversing — not a full deadlift' },
  { name:'Bench Press', muscles:'Pecs, front delts, triceps', how:'Retract scapula, bar to mid-chest, drive feet into floor, press in slight arc', tip:'Maintain arch and leg drive throughout' },
  { name:'Barbell Row', muscles:'Lats, rhomboids, biceps', how:'Hinge to ~45°, pull bar to lower chest, squeeze shoulder blades, lower under control', tip:'Lead with elbows, not hands' },
  { name:'Overhead Press', muscles:'Delts, triceps, upper traps', how:'Bar at collarbone, press overhead, push head through at lockout', tip:'Squeeze glutes to protect lower back' },
  { name:'Deadlift', muscles:'Full posterior chain', how:'Bar over mid-foot, hinge down, neutral spine, drive floor away, lock hips at top', tip:'Think "push floor away" not "pull bar up"' },
  { name:'Pull-Up', muscles:'Lats, biceps, rear delts', how:'Dead hang, depress scapula first, pull chest to bar', tip:'Initiate with shoulder blades before arms' },
  { name:'Dumbbell Lunges', muscles:'Quads, glutes, hamstrings', how:'Step forward, lower back knee toward floor, push through front heel to stand', tip:'Keep torso upright, front shin vertical' },
  { name:'Goblet Squat', muscles:'Quads, glutes, core', how:'Hold dumbbell at chest, feet wide, squat deep keeping elbows inside knees', tip:'Great for mobility and learning squat pattern' },
  { name:'Hip Thrust', muscles:'Glutes, hamstrings', how:'Shoulders on bench, bar on hips, drive hips to full extension, squeeze at top', tip:'Tuck chin to chest to avoid hyperextending spine' },
  { name:'Dumbbell Row', muscles:'Lats, rhomboids, rear delt', how:'Knee and hand on bench, pull dumbbell to hip, elbow close to body', tip:'Full stretch at bottom, squeeze at top' },
  { name:'Incline Press', muscles:'Upper pecs, front delts', how:'30-45° bench, press from upper chest, control descent', tip:'Lower angle targets more upper chest than standard incline' },
  { name:'Lateral Raise', muscles:'Medial deltoid', how:'Slight bend in elbow, raise to shoulder height leading with pinky, controlled descent', tip:'Pour water at top — thumb slightly down increases medial delt activation' },
  { name:'Face Pull', muscles:'Rear delts, external rotators', how:'Cable at face height, pull to forehead with elbows high and wide', tip:'Supinate wrists at end for full external rotation' },
  { name:'Tricep Pushdown', muscles:'Triceps', how:'Cable overhead, push to full extension, squeeze, slow return', tip:'Keep elbows glued to sides' },
  { name:'Bicep Curl', muscles:'Biceps brachii', how:'Elbows at sides, curl through full range, supinate at top, lower slowly', tip:'Avoid swinging — control the eccentric' },
  { name:'Cable Fly', muscles:'Pecs', how:'Arms wide, slight elbow bend, bring hands together in hugging arc', tip:'Stretch chest fully at start of each rep' },
  { name:'Leg Press', muscles:'Quads, glutes, hamstrings', how:'Feet shoulder-width, press until legs near straight, lower slowly', tip:'Do not lock knees at top' },
  { name:'Leg Curl', muscles:'Hamstrings', how:'Lie face down, curl heels toward glutes, squeeze, lower slowly', tip:'Plantarflex at top for extra hamstring contraction' },
  { name:'Leg Extension', muscles:'Quadriceps', how:'Seated, extend to full lockout, lower under control', tip:'Pause at lockout to maximise quad activation' },
  { name:'Calf Raise', muscles:'Gastrocnemius, soleus', how:'Full range — deep stretch at bottom, full extension at top, pause each end', tip:'Slow tempo beats heavy weight here' },
  { name:'Plank', muscles:'Core, shoulders', how:'Forearms down, body in straight line, brace abs as if bracing for a punch', tip:'Squeeze glutes and quads too — full body tension' },
  { name:'Hanging Knee Raise', muscles:'Lower abs, hip flexors', how:'Dead hang, pull knees to chest with control, lower without swinging', tip:'Posterior pelvic tilt at top to hit lower abs' },
  { name:'Cable Crunch', muscles:'Abs', how:'Kneel, rope at forehead, crunch down rounding spine, return slowly', tip:'The movement is spinal flexion, not hip flexion' },
  { name:'Russian Twist', muscles:'Obliques, abs', how:'Feet off floor, lean back, rotate side to side with weight', tip:'Exhale on each twist to increase core tension' },
  { name:'Good Morning', muscles:'Hamstrings, lower back, glutes', how:'Bar on back, hinge forward keeping back flat, feel hamstring stretch, drive back up', tip:'Start very light — excellent for posterior chain' },
  { name:'Nordic Curl', muscles:'Hamstrings (eccentric)', how:'Ankles anchored, lower torso forward as slowly as possible, push off floor to return', tip:'One of the best hamstring injury prevention exercises' },
  { name:'Glute Bridge', muscles:'Glutes, hamstrings', how:'Feet flat, drive hips up, squeeze hard at top for 1–2s', tip:'Easier than hip thrust — good for home training' },
  { name:'Landmine Press', muscles:'Shoulders, upper pecs, core', how:'Hold end of barbell with both hands at chest, press upward and forward', tip:'Great shoulder-friendly pressing movement' },
  { name:'Landmine Row', muscles:'Lats, rhomboids', how:'Stagger stance, row bar end to hip, elbow tight to body', tip:'Angled rowing is easy on lower back' },
  { name:'Trap Bar Deadlift', muscles:'Quads, glutes, hamstrings, back', how:'Stand in centre, handles at sides, sit down to bar, drive through floor', tip:'More quad-dominant than conventional — easier to learn' },
  { name:'Arnold Press', muscles:'All three delt heads', how:'Palms facing you at chin, rotate and press overhead, reverse on descent', tip:'The rotation hits front and medial delt more evenly' },
  { name:'Hammer Curl', muscles:'Brachialis, brachioradialis', how:'Neutral grip (thumbs up), curl through full range', tip:'Builds arm thickness more than standard curl' },
  { name:'Skull Crusher', muscles:'Triceps long head', how:'Lie on bench, lower bar to forehead keeping upper arms vertical, extend', tip:'Keep elbows in — flaring defeats the purpose' },
  { name:'Chest-Supported Row', muscles:'Lats, rhomboids, rear delts', how:'Lie face-down on incline bench, row dumbbells to hips', tip:'Eliminates lower back involvement — pure upper back work' },
  { name:'Bulgarian Split Squat', muscles:'Quads, glutes', how:'Rear foot elevated, front foot forward, lower back knee down, drive through front heel', tip:'Most humbling exercise in the gym — start light' },
  { name:'Step-Up', muscles:'Quads, glutes', how:'Drive through heel on box, stand tall, lower with control', tip:'Higher box = more glute; lower box = more quad' },
  { name:'Farmers Carry', muscles:'Grip, traps, core', how:'Pick up heavy dumbbells, walk tall with packed shoulders', tip:'Phenomenal for grip and trap development' },
  { name:'Pallof Press', muscles:'Core anti-rotation', how:'Cable at hip height, hold handle at chest, press out and resist rotation, return', tip:'The resistance is sideways — do not rotate' },
  { name:'Band Pull-Apart', muscles:'Rear delts, rhomboids', how:'Hold band at chest width, pull apart to full extension, return slowly', tip:'Great warm-up for pressing sessions' },
  { name:'Seated Cable Row', muscles:'Lats, mid-back, biceps', how:'Feet on platform, slight forward lean, row handle to stomach, squeeze back', tip:'Chest stays tall — do not round forward' },
  { name:'Machine Chest Fly', muscles:'Pecs', how:'Slight elbow bend, press handles forward in arc, squeeze pecs, return with control', tip:'Constant tension makes this great for hypertrophy' },
  { name:'Rear Delt Fly', muscles:'Rear deltoids, rhomboids', how:'Hinge forward or use reverse fly machine, raise arms wide to shoulder height', tip:'Keep a slight elbow bend and lead with elbows' },
  { name:'T-Bar Row', muscles:'Lats, mid-back', how:'Straddle bar, hinge to ~45°, pull plates to chest', tip:'Close grip hits lats; wide grip hits mid-back' },
  { name:'Incline Dumbbell Curl', muscles:'Biceps long head', how:'Lie on 45° bench, arms hang back, curl from full stretch', tip:'Long head stretch at bottom makes this a peak-builder' },
  { name:'Concentration Curl', muscles:'Biceps (peak)', how:'Seated, elbow on inner thigh, slow curl with full supination', tip:'Mind-muscle connection is the point here' },
  { name:'EZ-Bar Curl', muscles:'Biceps, brachialis', how:'Shoulder-width grip, curl through full range, lower slowly', tip:'Wrist-friendly option vs straight bar' },
  { name:'Overhead Tricep Extension', muscles:'Triceps long head', how:'Hold one dumbbell overhead, lower behind head, extend', tip:'Long head is stretched overhead — good mass builder' },
  { name:'Close-Grip Bench', muscles:'Triceps, inner pecs', how:'Grip at shoulder width, touch mid-chest, focus on elbows tight to body', tip:'More tricep-dominant than standard bench' },
  { name:'Dips', muscles:'Triceps, lower pecs, front delts', how:'Upright torso hits triceps; lean forward hits chest', tip:'Control the descent — shoulder health first' },
  { name:'Push-Up', muscles:'Pecs, triceps, front delts', how:'Hands shoulder-width, lower chest to floor, fully extend arms', tip:'Elevate feet or add weight to progress' },
  { name:'Shrug', muscles:'Upper traps', how:'Heavy weight, shrug straight up, hold 1s, lower', tip:'No rolling — just vertical movement' },
  { name:'Upright Row', muscles:'Traps, medial delts', how:'Grip close, pull bar to chin leading with elbows', tip:'Some shoulder impingement risk — use wide grip or cable' },
  { name:'Reverse Fly', muscles:'Rear delts, mid-back', how:'Hinge or prone, raise dumbbells to shoulder height with arms wide', tip:'Light weight, full range, squeeze at top' },
]

const HOME_ALTS = {
  'Barbell Back Squat': { ex:'Goblet Squat', eq:'Dumbbell or Kettlebell' },
  'Romanian Deadlift': { ex:'Single-Leg Dumbbell RDL', eq:'Dumbbell' },
  'Bench Press': { ex:'Push-Up or DB Floor Press', eq:'Dumbbells or Bodyweight' },
  'Barbell Row': { ex:'Dumbbell Row', eq:'Dumbbell' },
  'Overhead Press': { ex:'Dumbbell Shoulder Press', eq:'Dumbbells' },
  'Deadlift': { ex:'KB Sumo Deadlift', eq:'Kettlebell' },
  'Pull-Up': { ex:'Resistance Band Pull-Down', eq:'Resistance Band' },
  'Hip Thrust': { ex:'Glute Bridge', eq:'Dumbbell (hip-loaded)' },
  'Incline Press': { ex:'Incline DB Press', eq:'Dumbbells + Bench' },
  'Lateral Raise': { ex:'Dumbbell Lateral Raise', eq:'Dumbbells' },
  'Face Pull': { ex:'Band Pull-Apart', eq:'Resistance Band' },
  'Tricep Pushdown': { ex:'Overhead DB Tricep Extension', eq:'Dumbbell' },
  'Bulgarian Split Squat': { ex:'Rear-Foot Elevated Split Squat', eq:'Dumbbells + Chair' },
  'Leg Press': { ex:'Dumbbell Squat', eq:'Dumbbells' },
  'Calf Raise': { ex:'Single-Leg Calf Raise', eq:'Step + Dumbbell' },
  'Cable Crunch': { ex:'Dead Bug', eq:'Bodyweight' },
  'Cable Fly': { ex:'Band Chest Fly', eq:'Resistance Band' },
  'Farmers Carry': { ex:'Dumbbell Carry', eq:'Heavy Dumbbells' },
  'Pallof Press': { ex:'Band Pallof Press', eq:'Resistance Band' },
  'T-Bar Row': { ex:'Landmine Row', eq:'Barbell + Landmine' },
  'Dips': { ex:'Diamond Push-Up', eq:'Bodyweight' },
  'Shrug': { ex:'KB Shrug', eq:'Kettlebell' },
}

const MUSCLE_GROUPS = ['Chest','Back','Shoulders','Arms','Legs','Core','Full Body','Glutes','Cardio']

const ROUTINES_ALL = {
  'Push A': { group:'Chest', exercises:[
    { name:'Bench Press', sets:4, reps:'6-8', weight:'' },
    { name:'Incline Press', sets:3, reps:'8-12', weight:'' },
    { name:'Cable Fly', sets:3, reps:'12-15', weight:'' },
    { name:'Overhead Press', sets:3, reps:'8-10', weight:'' },
    { name:'Lateral Raise', sets:3, reps:'15-20', weight:'' },
    { name:'Tricep Pushdown', sets:3, reps:'12-15', weight:'' },
  ]},
  'Pull A': { group:'Back', exercises:[
    { name:'Barbell Row', sets:4, reps:'6-8', weight:'' },
    { name:'Pull-Up', sets:3, reps:'6-10', weight:'' },
    { name:'Seated Cable Row', sets:3, reps:'10-12', weight:'' },
    { name:'Face Pull', sets:3, reps:'15-20', weight:'' },
    { name:'Bicep Curl', sets:3, reps:'10-12', weight:'' },
    { name:'Hammer Curl', sets:2, reps:'12-15', weight:'' },
  ]},
  'Legs A': { group:'Legs', exercises:[
    { name:'Barbell Back Squat', sets:4, reps:'6-8', weight:'' },
    { name:'Romanian Deadlift', sets:3, reps:'8-10', weight:'' },
    { name:'Leg Press', sets:3, reps:'10-15', weight:'' },
    { name:'Leg Curl', sets:3, reps:'10-12', weight:'' },
    { name:'Leg Extension', sets:3, reps:'12-15', weight:'' },
    { name:'Calf Raise', sets:4, reps:'15-20', weight:'' },
  ]},
  'Push B': { group:'Chest', exercises:[
    { name:'Incline Press', sets:4, reps:'8-10', weight:'' },
    { name:'Machine Chest Fly', sets:3, reps:'12-15', weight:'' },
    { name:'Arnold Press', sets:3, reps:'10-12', weight:'' },
    { name:'Lateral Raise', sets:4, reps:'15-20', weight:'' },
    { name:'Overhead Tricep Extension', sets:3, reps:'12-15', weight:'' },
    { name:'Close-Grip Bench', sets:3, reps:'8-10', weight:'' },
  ]},
  'Pull B': { group:'Back', exercises:[
    { name:'Deadlift', sets:3, reps:'4-6', weight:'' },
    { name:'Chest-Supported Row', sets:3, reps:'10-12', weight:'' },
    { name:'Rear Delt Fly', sets:3, reps:'15-20', weight:'' },
    { name:'Incline Dumbbell Curl', sets:3, reps:'10-12', weight:'' },
    { name:'EZ-Bar Curl', sets:3, reps:'10-12', weight:'' },
  ]},
  'Legs B': { group:'Legs', exercises:[
    { name:'Bulgarian Split Squat', sets:3, reps:'8-10', weight:'' },
    { name:'Hip Thrust', sets:4, reps:'10-12', weight:'' },
    { name:'Nordic Curl', sets:3, reps:'5-8', weight:'' },
    { name:'Step-Up', sets:3, reps:'10-12', weight:'' },
    { name:'Calf Raise', sets:4, reps:'15-20', weight:'' },
  ]},
  'Upper Body': { group:'Full Body', exercises:[
    { name:'Bench Press', sets:3, reps:'8-10', weight:'' },
    { name:'Barbell Row', sets:3, reps:'8-10', weight:'' },
    { name:'Overhead Press', sets:3, reps:'8-10', weight:'' },
    { name:'Pull-Up', sets:3, reps:'6-8', weight:'' },
    { name:'Lateral Raise', sets:3, reps:'15-20', weight:'' },
    { name:'Face Pull', sets:2, reps:'15-20', weight:'' },
  ]},
  'Lower Body': { group:'Legs', exercises:[
    { name:'Barbell Back Squat', sets:4, reps:'6-8', weight:'' },
    { name:'Romanian Deadlift', sets:3, reps:'8-10', weight:'' },
    { name:'Hip Thrust', sets:3, reps:'10-12', weight:'' },
    { name:'Leg Curl', sets:3, reps:'10-12', weight:'' },
    { name:'Calf Raise', sets:4, reps:'15-20', weight:'' },
  ]},
  'Full Body A': { group:'Full Body', exercises:[
    { name:'Barbell Back Squat', sets:3, reps:'6-8', weight:'' },
    { name:'Bench Press', sets:3, reps:'8-10', weight:'' },
    { name:'Barbell Row', sets:3, reps:'8-10', weight:'' },
    { name:'Overhead Press', sets:2, reps:'8-10', weight:'' },
    { name:'Romanian Deadlift', sets:2, reps:'8-10', weight:'' },
    { name:'Plank', sets:3, reps:'45s', weight:'' },
  ]},
  'Home Upper': { group:'Full Body', exercises:[
    { name:'Push-Up', sets:4, reps:'10-20', weight:'' },
    { name:'Dumbbell Row', sets:3, reps:'10-12', weight:'' },
    { name:'Dumbbell Shoulder Press', sets:3, reps:'10-12', weight:'' },
    { name:'Band Pull-Apart', sets:3, reps:'20', weight:'' },
    { name:'Hammer Curl', sets:3, reps:'12-15', weight:'' },
    { name:'Diamond Push-Up', sets:3, reps:'10-15', weight:'' },
  ]},
  'Home Lower': { group:'Legs', exercises:[
    { name:'Goblet Squat', sets:4, reps:'12-15', weight:'' },
    { name:'Single-Leg Dumbbell RDL', sets:3, reps:'10-12', weight:'' },
    { name:'Glute Bridge', sets:4, reps:'15-20', weight:'' },
    { name:'Dumbbell Lunges', sets:3, reps:'10-12', weight:'' },
    { name:'Single-Leg Calf Raise', sets:3, reps:'15-20', weight:'' },
  ]},
  'Core & Glutes': { group:'Core', exercises:[
    { name:'Plank', sets:3, reps:'45-60s', weight:'' },
    { name:'Glute Bridge', sets:3, reps:'20', weight:'' },
    { name:'Dead Bug', sets:3, reps:'10 each', weight:'' },
    { name:'Russian Twist', sets:3, reps:'20 total', weight:'' },
    { name:'Hip Thrust', sets:3, reps:'15', weight:'' },
    { name:'Pallof Press', sets:3, reps:'12 each', weight:'' },
  ]},
}

const PECTUS_PROGRAM = [
  { week:1, workouts:[
    { id:'p1w1a', name:'Foundation A', exercises:[
      { name:'Prone Cobra', sets:3, reps:'10s hold' },
      { name:'Band Pull-Apart', sets:3, reps:'15' },
      { name:'Push-Up (modified)', sets:3, reps:'8-10' },
      { name:'Deep Breathing', sets:5, reps:'10 breaths' },
    ]},
    { id:'p1w1b', name:'Foundation B', exercises:[
      { name:'Chest Expansion Stretch', sets:3, reps:'30s hold' },
      { name:'Cat-Cow', sets:3, reps:'10' },
      { name:'Plank', sets:3, reps:'20s' },
      { name:'Pallof Press (light)', sets:2, reps:'12' },
    ]},
  ]},
  { week:2, workouts:[
    { id:'p1w2a', name:'Mobility A', exercises:[
      { name:'Thoracic Extension over Roller', sets:3, reps:'60s' },
      { name:'Band Pull-Apart', sets:3, reps:'20' },
      { name:'Push-Up', sets:3, reps:'10-12' },
      { name:'Diaphragmatic Breathing', sets:5, reps:'8 breaths' },
    ]},
    { id:'p1w2b', name:'Mobility B', exercises:[
      { name:'Wall Angel', sets:3, reps:'10' },
      { name:'Plank', sets:3, reps:'30s' },
      { name:'Prone Cobra', sets:3, reps:'15s hold' },
      { name:'Bird Dog', sets:3, reps:'10 each' },
    ]},
  ]},
  { week:3, workouts:[
    { id:'p1w3a', name:'Strength A', exercises:[
      { name:'Incline Push-Up', sets:3, reps:'12-15' },
      { name:'Dumbbell Row', sets:3, reps:'10 each' },
      { name:'Band Chest Fly', sets:3, reps:'15' },
      { name:'Plank', sets:3, reps:'35s' },
    ]},
    { id:'p1w3b', name:'Strength B', exercises:[
      { name:'Dumbbell Floor Press', sets:3, reps:'10-12' },
      { name:'Face Pull', sets:3, reps:'15' },
      { name:'Thoracic Rotation', sets:3, reps:'10 each' },
      { name:'Dead Bug', sets:3, reps:'8 each' },
    ]},
  ]},
  { week:4, workouts:[
    { id:'p1w4a', name:'Integration A', exercises:[
      { name:'Push-Up', sets:4, reps:'12-15' },
      { name:'Chest-Supported Row', sets:3, reps:'12' },
      { name:'Overhead Press (light)', sets:3, reps:'10' },
      { name:'Plank', sets:3, reps:'45s' },
    ]},
    { id:'p1w4b', name:'Integration B', exercises:[
      { name:'Band Pull-Apart', sets:4, reps:'20' },
      { name:'Dumbbell Lateral Raise', sets:3, reps:'12' },
      { name:'Pallof Press', sets:3, reps:'12 each' },
      { name:'Deep Breathing w/ Expansion', sets:5, reps:'10 breaths' },
    ]},
  ]},
  { week:5, workouts:[
    { id:'p1w5a', name:'Loading A', exercises:[
      { name:'Dumbbell Bench Press', sets:3, reps:'10' },
      { name:'Incline Dumbbell Row', sets:3, reps:'12' },
      { name:'Arnold Press', sets:3, reps:'10' },
      { name:'Plank to Down Dog', sets:3, reps:'8' },
    ]},
    { id:'p1w5b', name:'Loading B', exercises:[
      { name:'Chest Fly', sets:3, reps:'15' },
      { name:'Rear Delt Fly', sets:3, reps:'15' },
      { name:'Lateral Raise', sets:3, reps:'15' },
      { name:'Plank', sets:3, reps:'50s' },
    ]},
  ]},
  { week:6, workouts:[
    { id:'p1w6a', name:'Volume A', exercises:[
      { name:'Push-Up', sets:4, reps:'15-20' },
      { name:'Dumbbell Row', sets:4, reps:'12 each' },
      { name:'Face Pull', sets:4, reps:'15' },
      { name:'Dead Bug', sets:3, reps:'10 each' },
    ]},
    { id:'p1w6b', name:'Volume B', exercises:[
      { name:'Incline Dumbbell Press', sets:4, reps:'12' },
      { name:'Band Pull-Apart', sets:4, reps:'20' },
      { name:'Pallof Press', sets:3, reps:'15 each' },
      { name:'Thoracic Extension', sets:3, reps:'60s' },
    ]},
  ]},
  { week:7, workouts:[
    { id:'p1w7a', name:'Intensity A', exercises:[
      { name:'Weighted Push-Up', sets:4, reps:'10-12' },
      { name:'Chest-Supported Row', sets:4, reps:'10' },
      { name:'Overhead Press', sets:3, reps:'10' },
      { name:'Plank', sets:4, reps:'50s' },
    ]},
    { id:'p1w7b', name:'Intensity B', exercises:[
      { name:'Cable Fly', sets:3, reps:'15' },
      { name:'Cable Row', sets:3, reps:'12' },
      { name:'Lateral Raise', sets:3, reps:'15' },
      { name:'Bird Dog', sets:3, reps:'12 each' },
    ]},
  ]},
  { week:8, workouts:[
    { id:'p1w8a', name:'Deload A', exercises:[
      { name:'Push-Up', sets:3, reps:'10' },
      { name:'Dumbbell Row', sets:3, reps:'10' },
      { name:'Band Pull-Apart', sets:3, reps:'15' },
      { name:'Deep Breathing', sets:5, reps:'10' },
    ]},
    { id:'p1w8b', name:'Deload B', exercises:[
      { name:'Chest Expansion Stretch', sets:3, reps:'30s' },
      { name:'Thoracic Rotation', sets:3, reps:'10 each' },
      { name:'Prone Cobra', sets:3, reps:'15s' },
      { name:'Cat-Cow', sets:3, reps:'10' },
    ]},
  ]},
  { week:9, workouts:[
    { id:'p1w9a', name:'Peak A', exercises:[
      { name:'Dumbbell Bench Press', sets:4, reps:'10' },
      { name:'Incline Row', sets:4, reps:'10' },
      { name:'Overhead Press', sets:3, reps:'10' },
      { name:'Plank', sets:3, reps:'60s' },
    ]},
    { id:'p1w9b', name:'Peak B', exercises:[
      { name:'Incline Press', sets:4, reps:'10' },
      { name:'Face Pull', sets:4, reps:'15' },
      { name:'Arnold Press', sets:3, reps:'10' },
      { name:'Pallof Press', sets:3, reps:'15 each' },
    ]},
  ]},
  { week:10, workouts:[
    { id:'p1w10a', name:'Strength A', exercises:[
      { name:'Weighted Push-Up', sets:5, reps:'8-10' },
      { name:'Dumbbell Row', sets:5, reps:'8 each' },
      { name:'Overhead Press', sets:4, reps:'8' },
      { name:'Plank', sets:3, reps:'60s' },
    ]},
    { id:'p1w10b', name:'Strength B', exercises:[
      { name:'Dumbbell Bench Press', sets:4, reps:'8' },
      { name:'Cable Row', sets:4, reps:'10' },
      { name:'Lateral Raise', sets:4, reps:'15' },
      { name:'Dead Bug', sets:3, reps:'10 each' },
    ]},
  ]},
  { week:11, workouts:[
    { id:'p1w11a', name:'Final Push A', exercises:[
      { name:'Incline Dumbbell Press', sets:4, reps:'10' },
      { name:'Chest-Supported Row', sets:4, reps:'10' },
      { name:'Face Pull', sets:3, reps:'20' },
      { name:'Plank', sets:4, reps:'60s' },
    ]},
    { id:'p1w11b', name:'Final Push B', exercises:[
      { name:'Cable Fly', sets:4, reps:'15' },
      { name:'Band Pull-Apart', sets:4, reps:'25' },
      { name:'Deep Breathing', sets:5, reps:'10' },
      { name:'Thoracic Mobility', sets:3, reps:'60s' },
    ]},
  ]},
  { week:12, workouts:[
    { id:'p1w12a', name:'Completion A', exercises:[
      { name:'Push-Up', sets:4, reps:'Max' },
      { name:'Dumbbell Row', sets:4, reps:'12 each' },
      { name:'Overhead Press', sets:3, reps:'10' },
      { name:'Plank', sets:3, reps:'60s' },
    ]},
    { id:'p1w12b', name:'Completion B', exercises:[
      { name:'Chest Expansion Stretch', sets:3, reps:'60s' },
      { name:'Thoracic Extension', sets:3, reps:'60s' },
      { name:'Deep Breathing', sets:5, reps:'10' },
      { name:'Prone Cobra', sets:3, reps:'20s' },
    ]},
  ]},
]

const GOLF_PROGRAMS = [
  { id:'g1', name:'Power & Distance', weeks:6, desc:'Build rotational power for more yards off the tee', exercises:[
    { name:'Hip Hinge with Rotation', sets:3, reps:'10 each side', cue:'Drive hips through impact' },
    { name:'Med Ball Rotational Throw', sets:3, reps:'8 each side', cue:'Explosive hip rotation' },
    { name:'Cable Chop (High to Low)', sets:3, reps:'12 each side', cue:'Transfer force through core' },
    { name:'Landmine Rotation', sets:3, reps:'10 each side', cue:'X-factor stretch at top' },
    { name:'Glute Bridge', sets:3, reps:'15', cue:'Activate glutes for hip drive' },
    { name:'Pallof Press', sets:3, reps:'12 each side', cue:'Resist rotation to build anti-rotation' },
  ]},
  { id:'g2', name:'Stability & Control', weeks:6, desc:'Improve balance and shot consistency', exercises:[
    { name:'Single-Leg Deadlift', sets:3, reps:'10 each', cue:'Level hips through movement' },
    { name:'Bird Dog', sets:3, reps:'12 each side', cue:'Extend and hold 2s at top' },
    { name:'Side Plank', sets:3, reps:'30-45s each', cue:'Stack feet, maintain alignment' },
    { name:'Step-Up with Hold', sets:3, reps:'10 each', cue:'Pause at top for balance' },
    { name:'Anti-Rotation Pallof', sets:3, reps:'15 each', cue:'Isometric hold with extended arms' },
    { name:'Single-Leg Calf Raise', sets:3, reps:'15 each', cue:'Feel ankle stability' },
  ]},
  { id:'g3', name:'Hip Mobility', weeks:4, desc:'Free up hip rotation for a full swing', exercises:[
    { name:'Hip 90/90 Stretch', sets:3, reps:'60s each side', cue:'Sit tall, breathe into the stretch' },
    { name:'Hip Flexor Stretch (kneeling)', sets:3, reps:'45s each', cue:'Posterior pelvic tilt to feel hip flexor' },
    { name:'Lateral Band Walk', sets:3, reps:'20 steps each way', cue:'Maintain tension throughout' },
    { name:'Hip Circle', sets:3, reps:'10 each direction', cue:'Slow controlled circles' },
    { name:'Pigeon Pose', sets:3, reps:'60s each', cue:'Breathe and relax into stretch' },
    { name:'Glute Activation Bridge', sets:3, reps:'20', cue:'Squeeze hard at top' },
  ]},
  { id:'g4', name:'Shoulder & Thoracic', weeks:4, desc:'Improve shoulder turn and backswing range', exercises:[
    { name:'Thoracic Extension over Roller', sets:3, reps:'60s', cue:'Arms overhead if able' },
    { name:'Wall Angel', sets:3, reps:'10', cue:'Keep lower back against wall' },
    { name:'Band Pull-Apart', sets:3, reps:'20', cue:'Squeeze shoulder blades' },
    { name:'Sleeper Stretch', sets:3, reps:'45s each', cue:'Gentle pressure, no pain' },
    { name:'Thoracic Rotation', sets:3, reps:'12 each side', cue:'Exhale into rotation' },
    { name:'Face Pull', sets:3, reps:'15', cue:'Finish with external rotation' },
  ]},
  { id:'g5', name:'Injury Prevention', weeks:6, desc:'Protect the lower back, hips, and wrists', exercises:[
    { name:'McGill Big 3: Bird Dog', sets:3, reps:'10 each', cue:'Neutral spine always' },
    { name:'McGill Big 3: Side Plank', sets:3, reps:'30s each', cue:'Maintain straight line' },
    { name:'McGill Big 3: Modified Curl-Up', sets:3, reps:'10', cue:'Neck in neutral' },
    { name:'Hip Hinge Drill', sets:3, reps:'10', cue:'Dowel on spine — 3 contact points' },
    { name:'Wrist Mobility Circle', sets:2, reps:'10 each direction', cue:'Full pain-free range' },
    { name:'Nordic Curl (eccentric)', sets:2, reps:'5', cue:'Lower as slowly as possible' },
  ]},
  { id:'g6', name:'In-Season Maintenance', weeks:12, desc:'Keep performance high throughout the season', exercises:[
    { name:'Hip Flexor Stretch', sets:2, reps:'45s each', cue:'Post-round priority' },
    { name:'Thoracic Rotation', sets:2, reps:'10 each', cue:'Keep hips square' },
    { name:'Band Pull-Apart', sets:2, reps:'15', cue:'Warm-up and cool-down' },
    { name:'Single-Leg Balance', sets:2, reps:'30s each', cue:'Eyes closed for challenge' },
    { name:'Glute Bridge', sets:2, reps:'15', cue:'Activate before round' },
    { name:'Calf Raise', sets:2, reps:'15', cue:'Maintain ankle stability' },
  ]},
]

const STRETCH_LIBRARY = [
  { name:'Hip Flexor Stretch', muscles:'Hip flexors, quads', hold:45, cue:'Tuck pelvis and breathe in', sides:true },
  { name:'Pigeon Pose', muscles:'Piriformis, glutes', hold:60, cue:'Let hips relax into the floor', sides:true },
  { name:'Figure-Four Stretch', muscles:'Piriformis, outer hip', hold:45, cue:'Flex foot of crossing ankle', sides:true },
  { name:'Seated Hamstring Stretch', muscles:'Hamstrings', hold:45, cue:'Hinge at hip, not waist', sides:false },
  { name:'Standing Quad Stretch', muscles:'Quadriceps', hold:30, cue:'Keep knees together', sides:true },
  { name:'Calf Stretch', muscles:'Gastrocnemius', hold:30, cue:'Heel pressed into floor', sides:true },
  { name:'Soleus Stretch', muscles:'Soleus', hold:30, cue:'Bend knee of back leg', sides:true },
  { name:'Child\'s Pose', muscles:'Lower back, lats, hips', hold:60, cue:'Breathe into your back', sides:false },
  { name:'Cat-Cow', muscles:'Thoracic spine', hold:0, cue:'Exhale on cat, inhale on cow', sides:false },
  { name:'Thoracic Extension over Roller', muscles:'Thoracic spine', hold:60, cue:'Support head, go slowly', sides:false },
  { name:'Thoracic Rotation', muscles:'Thoracic spine, obliques', hold:30, cue:'Exhale into rotation', sides:true },
  { name:'Doorway Chest Stretch', muscles:'Pecs, front delts', hold:30, cue:'Lean forward to feel stretch', sides:false },
  { name:'Cross-Body Shoulder Stretch', muscles:'Rear delt, rotator cuff', hold:30, cue:'Pull elbow across with opposite hand', sides:true },
  { name:'Sleeper Stretch', muscles:'Posterior rotator cuff', hold:45, cue:'Gentle pressure only', sides:true },
  { name:'Overhead Tricep Stretch', muscles:'Triceps long head', hold:30, cue:'Keep elbow pointing up', sides:true },
  { name:'Neck Side Tilt', muscles:'Scalenes, upper traps', hold:30, cue:'Let ear fall to shoulder', sides:true },
  { name:'Neck Rotation', muscles:'Sternocleidomastoid', hold:20, cue:'Slow and controlled', sides:true },
  { name:'Lats Stretch (wall)', muscles:'Latissimus dorsi', hold:45, cue:'Push hips back as arms reach forward', sides:false },
  { name:'90/90 Hip Stretch', muscles:'Hip internal/external rotators', hold:60, cue:'Sit tall through both hips', sides:true },
  { name:'Butterfly Stretch', muscles:'Adductors, groin', hold:45, cue:'Use elbows to press knees gently down', sides:false },
  { name:'IT Band Stretch', muscles:'IT band, TFL', hold:30, cue:'Cross leg, lean sideways', sides:true },
  { name:'Lower Back Rotation', muscles:'QL, lower back', hold:30, cue:'Keep both shoulders on floor', sides:true },
  { name:'Prone Press-Up', muscles:'Lumbar extensors', hold:10, cue:'Hips stay on floor', sides:false },
  { name:'Knee-to-Chest', muscles:'Lower back, glutes', hold:45, cue:'Relax legs and back', sides:true },
  { name:'Spinal Twist (seated)', muscles:'Spine, obliques', hold:30, cue:'Sit tall before rotating', sides:true },
]

const STRETCH_PROGRAMS = [
  { id:'sp1', name:'Morning Wake-Up', duration:10, stretches:['Cat-Cow','Child\'s Pose','Thoracic Extension over Roller','Hip Flexor Stretch','Seated Hamstring Stretch','Neck Side Tilt'] },
  { id:'sp2', name:'Post-Workout Recovery', duration:15, stretches:['Quad Stretch','Calf Stretch','Pigeon Pose','Doorway Chest Stretch','Lats Stretch (wall)','Cross-Body Shoulder Stretch','Lower Back Rotation'] },
  { id:'sp3', name:'Lower Back Relief', duration:12, stretches:['Knee-to-Chest','Child\'s Pose','Cat-Cow','Lower Back Rotation','Figure-Four Stretch','Prone Press-Up'] },
  { id:'sp4', name:'Hip Mobility Flow', duration:15, stretches:['90/90 Hip Stretch','Pigeon Pose','Hip Flexor Stretch','Butterfly Stretch','Figure-Four Stretch','IT Band Stretch'] },
  { id:'sp5', name:'Upper Body Unwind', duration:10, stretches:['Doorway Chest Stretch','Cross-Body Shoulder Stretch','Sleeper Stretch','Overhead Tricep Stretch','Neck Side Tilt','Thoracic Rotation'] },
  { id:'sp6', name:'Full Body Flexibility', duration:20, stretches:['Cat-Cow','Hip Flexor Stretch','Pigeon Pose','Seated Hamstring Stretch','Doorway Chest Stretch','Thoracic Rotation','Spinal Twist (seated)','Butterfly Stretch'] },
  { id:'sp7', name:'Golf Pre-Round', duration:8, stretches:['Thoracic Rotation','Hip Flexor Stretch','90/90 Hip Stretch','Thoracic Extension over Roller','Cross-Body Shoulder Stretch','Calf Stretch'] },
  { id:'sp8', name:'Desk Worker Reset', duration:10, stretches:['Neck Side Tilt','Neck Rotation','Doorway Chest Stretch','Thoracic Extension over Roller','Hip Flexor Stretch','Lower Back Rotation'] },
  { id:'sp9', name:'Hamstring Focus', duration:10, stretches:['Seated Hamstring Stretch','Standing Quad Stretch','Calf Stretch','Soleus Stretch','IT Band Stretch','Knee-to-Chest'] },
  { id:'sp10', name:'Evening Wind-Down', duration:15, stretches:['Child\'s Pose','Lower Back Rotation','Figure-Four Stretch','Butterfly Stretch','Spinal Twist (seated)','Prone Press-Up','Knee-to-Chest'] },
  { id:'sp11', name:'Shoulder Health', duration:10, stretches:['Cross-Body Shoulder Stretch','Sleeper Stretch','Doorway Chest Stretch','Overhead Tricep Stretch','Neck Rotation','Thoracic Rotation'] },
  { id:'sp12', name:'Core & Back', duration:12, stretches:['Cat-Cow','Child\'s Pose','Prone Press-Up','Lower Back Rotation','Spinal Twist (seated)','Thoracic Extension over Roller','Lats Stretch (wall)'] },
]

const CARDIO_TYPES = [
  { name:'Running', icon:'🏃', met:9.8 },
  { name:'Cycling', icon:'🚴', met:7.5 },
  { name:'Swimming', icon:'🏊', met:7.0 },
  { name:'Rowing', icon:'🚣', met:7.0 },
  { name:'Walking', icon:'🚶', met:3.5 },
  { name:'HIIT', icon:'⚡', met:10.0 },
  { name:'Jump Rope', icon:'🪢', met:11.0 },
  { name:'Elliptical', icon:'🔄', met:5.0 },
  { name:'Stair Climber', icon:'🪜', met:9.0 },
  { name:'Sauna', icon:'🧖', met:1.5 },
  { name:'Pool Laps', icon:'🏊', met:6.5 },
  { name:'Yoga', icon:'🧘', met:3.0 },
]

const CABLE_TUTORIALS = [
  { name:'Cable Fly', muscles:'Pecs', how:'Arms wide, slight elbow bend, bring hands together in hugging arc at chest height', tip:'Maintain stretch at start for full pec activation' },
  { name:'Cable Row', muscles:'Lats, rhomboids, biceps', how:'Feet on platform, pull handle to abdomen, squeeze shoulder blades', tip:'Lead with elbows, not hands' },
  { name:'Tricep Pushdown', muscles:'Triceps', how:'Cable overhead, push to full extension, elbows glued to sides', tip:'Squeeze hard at lockout' },
  { name:'Face Pull', muscles:'Rear delts, external rotators', how:'Rope at face height, pull to forehead elbows high', tip:'Supinate wrists at end for full external rotation' },
  { name:'Lat Pulldown', muscles:'Lats, biceps', how:'Wide overhand grip, pull to upper chest leaning slightly back', tip:'Drive elbows down and back' },
  { name:'Cable Curl', muscles:'Biceps', how:'Low pulley, curl through full range, supinate at top', tip:'Constant tension vs free weights' },
  { name:'Cable Crunch', muscles:'Abs', how:'Kneel, rope at forehead, crunch down rounding spine', tip:'Spinal flexion, not hip flexion' },
  { name:'Pallof Press', muscles:'Core anti-rotation', how:'Cable at hip height, press out resisting rotation, return', tip:'The resistance is sideways — do not rotate' },
  { name:'Cable Kickback', muscles:'Triceps', how:'Hinge forward, upper arm parallel to floor, extend elbow to lockout', tip:'Squeeze tricep at full extension' },
  { name:'Reverse Fly (cable)', muscles:'Rear delts', how:'Cross cables, pull apart to shoulder height with arms wide', tip:'Slight elbow bend, lead with elbows' },
  { name:'Upright Row (cable)', muscles:'Traps, medial delts', how:'Close grip, pull to chin with elbows leading', tip:'Wide grip reduces impingement risk' },
  { name:'Overhead Tricep Extension', muscles:'Triceps long head', how:'High pulley, hinge forward, extend elbows overhead', tip:'Long head gets fully stretched here' },
  { name:'Standing Chest Press', muscles:'Pecs, front delts, triceps', how:'Cables at chest height, step forward, press forward', tip:'Lean into it slightly for stability' },
  { name:'Woodchop (high to low)', muscles:'Obliques, core, glutes', how:'Cable high, rotate and chop down across body', tip:'Power from hips, not arms' },
  { name:'Reverse Woodchop', muscles:'Obliques, core, shoulders', how:'Cable low, rotate and chop up across body', tip:'Full rotation — initiate with hips' },
  { name:'Cable Hip Abduction', muscles:'Glutes, TFL', how:'Ankle attachment, sweep leg out to side', tip:'Keep upper body stable' },
  { name:'Cable Hip Extension', muscles:'Glutes, hamstrings', how:'Ankle attachment, extend leg straight back, squeeze glute', tip:'Don\'t arch lower back' },
  { name:'Single-Arm Cable Row', muscles:'Lats, rhomboids', how:'One hand, rotate and row to hip, allow slight trunk rotation', tip:'Good for fixing imbalances' },
  { name:'Single-Arm Cable Press', muscles:'Pecs, front delt, core', how:'One hand at chest height, press forward with slight rotation', tip:'Core has to resist rotation' },
  { name:'Low Cable Fly', muscles:'Upper pecs', how:'Cables at hip height, raise in arc to face level', tip:'Targets upper pec fibres' },
  { name:'High Cable Curl', muscles:'Biceps, rear delts', how:'Cables at shoulder height, curl both hands to ears', tip:'Full bicep stretch at start' },
  { name:'Straight-Arm Pulldown', muscles:'Lats, serratus', how:'High cable, straight arms, push down to hips', tip:'Feel the lats working, not biceps' },
  { name:'Cable Lateral Raise', muscles:'Medial delt', how:'Low cable to side, raise to shoulder height', tip:'Constant tension advantage over dumbbells' },
  { name:'Cable Front Raise', muscles:'Front delt', how:'Low cable, raise straight arm to shoulder height', tip:'Pause at top, lower slowly' },
  { name:'Kneeling Pulldown', muscles:'Lats, core', how:'Kneel, pull bar down to chest, upright torso', tip:'Core has to stabilise without seat support' },
  { name:'Rope Hammer Curl', muscles:'Brachialis, brachioradialis', how:'Rope at low pulley, neutral grip curl', tip:'Split rope at top' },
  { name:'Cable Shrug', muscles:'Upper traps', how:'Cables at sides or front, shrug straight up', tip:'No rolling — pure vertical movement' },
  { name:'Reverse Grip Pulldown', muscles:'Lats, lower biceps', how:'Underhand close grip, pull to upper chest', tip:'Hits lower lats more than wide grip' },
  { name:'Cable Pull-Through', muscles:'Glutes, hamstrings', how:'Cable low behind you, hinge forward, drive hips to extend', tip:'Hip hinge movement — not a squat' },
  { name:'Ab Rotation (cable)', muscles:'Obliques', how:'Cable at chest, rotate away, resist on return', tip:'Exhale into rotation' },
  { name:'Cable Good Morning', muscles:'Hamstrings, glutes, lower back', how:'Cable at neck, hinge forward, drive hips back', tip:'Feel hamstring stretch at bottom' },
  { name:'Half-Kneeling Chop', muscles:'Core, obliques, shoulders', how:'Kneel on one knee, chop from high to low across body', tip:'Keep front knee tracking over toes' },
  { name:'Single-Leg Cable Deadlift', muscles:'Glutes, hamstrings, core', how:'Ankle attachment, hinge on one leg, extend standing leg back', tip:'Level hips through movement' },
  { name:'Chest-Supported Row (cable)', muscles:'Lats, mid-back', how:'Lean on incline bench, row cables to hips', tip:'Fully stretches lats at bottom' },
  { name:'Low Row (narrow grip)', muscles:'Lower lats', how:'Sit close to stack, grip narrow, row to lower abs', tip:'Think about pulling elbows back and down' },
]

const CABLE_ROUTINES = [
  { name:'Cable Upper Body A', exercises:[
    { name:'Lat Pulldown', sets:4, reps:'8-10', weight:'' },
    { name:'Cable Row', sets:4, reps:'10-12', weight:'' },
    { name:'Cable Fly', sets:3, reps:'12-15', weight:'' },
    { name:'Face Pull', sets:3, reps:'15-20', weight:'' },
    { name:'Tricep Pushdown', sets:3, reps:'12-15', weight:'' },
    { name:'Cable Curl', sets:3, reps:'12', weight:'' },
  ]},
  { name:'Cable Lower Body', exercises:[
    { name:'Cable Pull-Through', sets:4, reps:'15', weight:'' },
    { name:'Cable Hip Extension', sets:3, reps:'15 each', weight:'' },
    { name:'Cable Hip Abduction', sets:3, reps:'15 each', weight:'' },
    { name:'Single-Leg Cable Deadlift', sets:3, reps:'10 each', weight:'' },
    { name:'Straight-Arm Pulldown', sets:3, reps:'12', weight:'' },
  ]},
  { name:'Cable Core', exercises:[
    { name:'Pallof Press', sets:3, reps:'12 each', weight:'' },
    { name:'Woodchop (high to low)', sets:3, reps:'12 each', weight:'' },
    { name:'Reverse Woodchop', sets:3, reps:'12 each', weight:'' },
    { name:'Cable Crunch', sets:3, reps:'15', weight:'' },
    { name:'Ab Rotation (cable)', sets:3, reps:'12 each', weight:'' },
    { name:'Half-Kneeling Chop', sets:3, reps:'10 each', weight:'' },
  ]},
  { name:'Cable Chest Focus', exercises:[
    { name:'Standing Chest Press', sets:4, reps:'10-12', weight:'' },
    { name:'Cable Fly', sets:4, reps:'12-15', weight:'' },
    { name:'Low Cable Fly', sets:3, reps:'12-15', weight:'' },
    { name:'Tricep Pushdown', sets:3, reps:'12-15', weight:'' },
    { name:'Overhead Tricep Extension', sets:3, reps:'12-15', weight:'' },
  ]},
  { name:'Cable Back & Biceps', exercises:[
    { name:'Lat Pulldown', sets:4, reps:'8-10', weight:'' },
    { name:'Cable Row', sets:4, reps:'10-12', weight:'' },
    { name:'Single-Arm Cable Row', sets:3, reps:'10 each', weight:'' },
    { name:'Straight-Arm Pulldown', sets:3, reps:'12', weight:'' },
    { name:'Cable Curl', sets:3, reps:'12', weight:'' },
    { name:'High Cable Curl', sets:3, reps:'12', weight:'' },
  ]},
  { name:'Cable Shoulder Session', exercises:[
    { name:'Face Pull', sets:4, reps:'15-20', weight:'' },
    { name:'Cable Lateral Raise', sets:4, reps:'15 each', weight:'' },
    { name:'Cable Front Raise', sets:3, reps:'12', weight:'' },
    { name:'Upright Row (cable)', sets:3, reps:'12', weight:'' },
    { name:'Reverse Fly (cable)', sets:3, reps:'15', weight:'' },
    { name:'Cable Shrug', sets:3, reps:'15', weight:'' },
  ]},
  { name:'Cable Glute & Posterior', exercises:[
    { name:'Cable Pull-Through', sets:4, reps:'15', weight:'' },
    { name:'Cable Hip Extension', sets:4, reps:'15 each', weight:'' },
    { name:'Cable Hip Abduction', sets:3, reps:'15 each', weight:'' },
    { name:'Cable Good Morning', sets:3, reps:'12', weight:'' },
    { name:'Single-Leg Cable Deadlift', sets:3, reps:'10 each', weight:'' },
  ]},
  { name:'Cable Full Body', exercises:[
    { name:'Cable Pull-Through', sets:3, reps:'15', weight:'' },
    { name:'Lat Pulldown', sets:3, reps:'10', weight:'' },
    { name:'Standing Chest Press', sets:3, reps:'12', weight:'' },
    { name:'Woodchop (high to low)', sets:3, reps:'12 each', weight:'' },
    { name:'Face Pull', sets:3, reps:'15', weight:'' },
    { name:'Pallof Press', sets:2, reps:'15 each', weight:'' },
  ]},
  { name:'Cable Rehab & Mobility', exercises:[
    { name:'Face Pull', sets:3, reps:'20', weight:'' },
    { name:'Pallof Press', sets:3, reps:'15 each', weight:'' },
    { name:'Cable Hip Abduction', sets:3, reps:'20 each', weight:'' },
    { name:'Half-Kneeling Chop', sets:3, reps:'10 each', weight:'' },
    { name:'Straight-Arm Pulldown', sets:3, reps:'15', weight:'' },
    { name:'Reverse Fly (cable)', sets:3, reps:'20', weight:'' },
  ]},
]

const RECOVERY_PROTOCOLS = [
  { id:'r1', name:'Lower Back Relief', duration:20, desc:'Decompress and mobilise the lumbar spine', steps:[
    { name:'Supine Knee Hug', duration:60, cue:'Pull both knees to chest, breathe deeply' },
    { name:'Lower Back Rotation', duration:45, cue:'Keep shoulders on floor, twist from hips' },
    { name:'Cat-Cow', duration:60, cue:'Exhale on cat, inhale on cow — slow and deliberate' },
    { name:'Child\'s Pose', duration:90, cue:'Breathe into your back, feel the decompression' },
    { name:'Prone Press-Up', duration:30, cue:'Hips stay on floor, gentle lumbar extension' },
    { name:'Piriformis Stretch', duration:45, cue:'Figure-four — flex the top ankle for depth' },
    { name:'Hip Flexor Kneeling Stretch', duration:45, cue:'Tuck pelvis to feel hip flexor stretch' },
    { name:'Thoracic Rotation', duration:45, cue:'Rotate from mid-back, not lower back' },
    { name:'Savasana / Breathwork', duration:120, cue:'Focus on diaphragmatic breathing, relax completely' },
  ]},
  { id:'r2', name:'Post-Leg Day', duration:15, desc:'Flush the legs after heavy lower body work', steps:[
    { name:'Leg Elevation', duration:120, cue:'Legs up wall — flush metabolites' },
    { name:'Quad Stretch', duration:30, cue:'Stand tall, knee back and up' },
    { name:'Calf Raise & Stretch', duration:60, cue:'Full range — 10 slow raises then hold' },
    { name:'Pigeon Pose', duration:60, cue:'Sink into it — tight glutes need this' },
    { name:'Hamstring Stretch', duration:45, cue:'Hinge at hip, lengthen spine' },
    { name:'IT Band Foam Roll', duration:60, cue:'Slow roll, pause on tender spots' },
    { name:'Cold Shower Legs', duration:60, cue:'Cold water reduces inflammation and soreness' },
  ]},
  { id:'r3', name:'Active Recovery', duration:20, desc:'Light movement to promote blood flow without loading', steps:[
    { name:'Easy Walk', duration:300, cue:'Brisk pace, arms swinging naturally' },
    { name:'Hip Circles', duration:30, cue:'10 each direction, slow and controlled' },
    { name:'Shoulder Rolls', duration:30, cue:'10 forward, 10 backward' },
    { name:'Band Pull-Apart', duration:45, cue:'Light band, focus on scapular retraction' },
    { name:'Bodyweight Squat (slow)', duration:45, cue:'3 seconds down, 3 seconds up' },
    { name:'Thoracic Rotation', duration:45, cue:'Gentle, not pushing range' },
    { name:'Foam Roll Upper Back', duration:60, cue:'Pause at tight spots' },
    { name:'Deep Breathing', duration:120, cue:'Nasal inhale 4s, hold 4s, exhale 6s' },
  ]},
  { id:'r4', name:'Sleep Prep Protocol', duration:15, desc:'Calm the nervous system before bed', steps:[
    { name:'Legs Up the Wall', duration:180, cue:'Close eyes, breathe naturally' },
    { name:'Lower Back Rotation', duration:45, cue:'Slow and gentle, hold each side' },
    { name:'Child\'s Pose', duration:90, cue:'Eyes closed, body letting go' },
    { name:'4-7-8 Breathing', duration:120, cue:'Inhale 4s, hold 7s, exhale 8s — repeat 4x' },
    { name:'Progressive Muscle Relaxation', duration:180, cue:'Tense and release each muscle group from feet up' },
  ]},
  { id:'r5', name:'Shoulder Recovery', duration:12, desc:'Restore shoulder mobility and reduce tightness', steps:[
    { name:'Pendulum Swings', duration:60, cue:'Arm hanging, let gravity traction the joint' },
    { name:'Doorway Chest Stretch', duration:45, cue:'Multiple elbow heights for full pec coverage' },
    { name:'Cross-Body Stretch', duration:45, cue:'Gentle pull, not a yank' },
    { name:'Sleeper Stretch', duration:45, cue:'Only comfortable range — no forcing' },
    { name:'Wall Angel', duration:45, cue:'Maintain 3 contact points on wall' },
    { name:'Band External Rotation', duration:60, cue:'Light resistance, full range' },
    { name:'Neck Side Tilt', duration:30, cue:'Breathe into the stretch' },
  ]},
  { id:'r6', name:'Pool Recovery', duration:20, desc:'Use the pool for active recovery and mobility', steps:[
    { name:'Easy Freestyle', duration:300, cue:'60-70% effort, focus on long strokes' },
    { name:'Water Treading', duration:120, cue:'Keep shoulders relaxed, smooth leg kick' },
    { name:'Pool Stretches', duration:180, cue:'Use wall for hamstring and hip flexor stretches' },
    { name:'Cold Water Immersion', duration:120, cue:'15-18°C if available — powerful for recovery' },
    { name:'Sauna', duration:300, cue:'12-15 min at moderate heat to flush with blood' },
  ]},
  { id:'r7', name:'Foam Roll Full Body', duration:15, desc:'Systematic myofascial release for the whole body', steps:[
    { name:'Calves', duration:60, cue:'Cross one leg over, 10 slow rolls each calf' },
    { name:'IT Band / Quads', duration:60, cue:'Slow roll outer thigh, pause on tight spots' },
    { name:'Glutes / Piriformis', duration:60, cue:'Sit on roller, cross ankle — figure four' },
    { name:'Upper Back (thoracic)', duration:60, cue:'Arms crossed, roll between shoulder blades' },
    { name:'Lats', duration:45, cue:'Side lying, roll from armpit to mid-back' },
    { name:'Hip Flexors', duration:45, cue:'Prone, roller under front of hip' },
    { name:'Chest (lacrosse ball)', duration:45, cue:'Against wall, roll pec minor' },
  ]},
]

const GEN_OPTIONS = {
  groups: ['Chest','Back','Shoulders','Arms','Legs','Core','Full Body','Glutes','Push','Pull'],
  locations: ['Gym','Home Gym','Bodyweight'],
  durations: ['30 min','45 min','60 min','75 min'],
  goals: ['Hypertrophy','Strength','Fat Loss','Endurance','Rehab'],
  levels: ['Beginner','Intermediate','Advanced'],
}

const Icon = {
  home: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  train: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 4v16M18 4v16M2 9h4M18 9h4M2 15h4M18 15h4"/></svg>,
  cardio: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>,
  golf: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="7" r="4"/><path d="M12 11v11M8 22h8"/></svg>,
  recover: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>,
  build: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
  stats: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
  ai: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2a10 10 0 100 20 10 10 0 000-20z"/><path d="M12 8v4l3 3"/></svg>,
  plus: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  minus: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  trash: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/></svg>,
  close: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  check: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>,
  timer: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="13" r="8"/><path d="M12 5V3M8 3h8"/><path d="M12 9v4l2 2"/></svg>,
  play: <svg viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>,
  pause: <svg viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>,
  skip: <svg viewBox="0 0 24 24" fill="currentColor"><polygon points="5 4 15 12 5 20 5 4"/><line x1="19" y1="4" x2="19" y2="20" stroke="currentColor" strokeWidth="2"/></svg>,
  refresh: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 102.13-9.36L1 10"/></svg>,
  back: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>,
  share: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>,
  info: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>,
  bolt: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
  flame: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M8.5 14.5A2.5 2.5 0 0011 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 01-7 7 7 7 0 01-3.5-13z"/></svg>,
  star: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
  send: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>,
  settings: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93l-1.41 1.41M4.93 4.93l1.41 1.41M19.07 19.07l-1.41-1.41M4.93 19.07l1.41-1.41M12 2v2M12 20v2M2 12h2M20 12h2"/></svg>,
  calendar: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  stretch: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="4" r="2"/><path d="M12 6v6l4 4M12 12l-4 4M8 6l-2 4M16 6l2 4"/></svg>,
  cable: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12h18M3 12a2 2 0 100-4 2 2 0 000 4zM21 12a2 2 0 100-4 2 2 0 000 4z"/><path d="M7 8V6a2 2 0 012-2h6a2 2 0 012 2v2"/><path d="M7 16v2a2 2 0 002 2h6a2 2 0 002-2v-2"/></svg>,
}

// ─── COMPONENTS ────────────────────────────────────────────────────────────

function ChipGroup({ options, value, onChange, multi }) {
  const toggle = o => {
    if (!multi) { onChange(o); return }
    const arr = Array.isArray(value) ? value : []
    onChange(arr.includes(o) ? arr.filter(x => x !== o) : [...arr, o])
  }
  const isActive = o => multi ? (Array.isArray(value) && value.includes(o)) : value === o
  return (
    <div className="ft-chips">
      {options.map(o => (
        <button key={o} className={`ft-chip${isActive(o) ? ' active' : ''}`} onClick={() => toggle(o)}>{o}</button>
      ))}
    </div>
  )
}

function HubToggle({ tabs, value, onChange }) {
  return (
    <div className="ft-tab-bar">
      {tabs.map(t => (
        <button key={t} className={`ft-tab-btn${value === t ? ' active' : ''}`} onClick={() => onChange(t)}>{t}</button>
      ))}
    </div>
  )
}

function RestTimer({ onClose }) {
  const [seconds, setSeconds] = useState(90)
  const [running, setRunning] = useState(true)
  const [preset, setPreset] = useState(90)
  const ref = useRef(null)
  useEffect(() => {
    if (running && seconds > 0) { ref.current = setTimeout(() => setSeconds(s => s - 1), 1000) }
    return () => clearTimeout(ref.current)
  }, [running, seconds])
  const presets = [60, 90, 120, 180]
  const pct = Math.max(0, seconds / preset)
  const r = 54; const c = 2 * Math.PI * r
  return (
    <div className="ft-overlay" onClick={onClose}>
      <div className="ft-sheet" onClick={e => e.stopPropagation()}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 }}>
          <span className="ft-h2" style={{ marginBottom:0 }}>Rest Timer</span>
          <button className="ft-icon-btn" onClick={onClose}>{Icon.close}</button>
        </div>
        <div style={{ display:'flex', justifyContent:'center', marginBottom:20 }}>
          <svg width="140" height="140" viewBox="0 0 120 120">
            <circle cx="60" cy="60" r={r} fill="none" stroke="#1e1e2e" strokeWidth="8"/>
            <circle cx="60" cy="60" r={r} fill="none" stroke="#c8f135" strokeWidth="8"
              strokeDasharray={c} strokeDashoffset={c * (1 - pct)}
              strokeLinecap="round" transform="rotate(-90 60 60)" style={{ transition:'stroke-dashoffset .5s' }}/>
            <text x="60" y="55" textAnchor="middle" fill="#e8e8f0" fontSize="26" fontFamily="Bebas Neue,sans-serif">
              {String(Math.floor(seconds/60)).padStart(2,'0')}:{String(seconds%60).padStart(2,'0')}
            </text>
            <text x="60" y="74" textAnchor="middle" fill="#888" fontSize="10" fontFamily="DM Sans,sans-serif">
              {running ? 'resting' : seconds === 0 ? 'done!' : 'paused'}
            </text>
          </svg>
        </div>
        <div className="ft-chips" style={{ justifyContent:'center' }}>
          {presets.map(p => (
            <button key={p} className={`ft-chip${preset===p?' active':''}`} onClick={() => { setPreset(p); setSeconds(p); setRunning(true) }}>
              {p}s
            </button>
          ))}
        </div>
        <div className="ft-row" style={{ marginTop:12, justifyContent:'center', gap:12 }}>
          <button className="ft-btn ft-btn-secondary" onClick={() => setRunning(r => !r)}>
            {running ? Icon.pause : Icon.play}
          </button>
          <button className="ft-btn ft-btn-secondary" onClick={() => { setSeconds(preset); setRunning(true) }}>
            {Icon.refresh}
          </button>
        </div>
      </div>
    </div>
  )
}

function WorkoutCard({ workout, onClose }) {
  return (
    <div className="ft-modal">
      <div className="ft-modal-box">
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 }}>
          <div>
            <div className="ft-h2" style={{ marginBottom:0 }}>{workout.name}</div>
            <div style={{ color:'#888', fontSize:13 }}>{dateLabel(workout.date)} · {workout.group}</div>
          </div>
          <button className="ft-icon-btn" onClick={onClose}>{Icon.close}</button>
        </div>
        {workout.exercises.map((e, i) => (
          <div key={i} style={{ display:'flex', justifyContent:'space-between', padding:'8px 0', borderBottom:'1px solid #1e1e2e' }}>
            <span style={{ fontSize:14 }}>{e.name}</span>
            <span style={{ fontSize:13, color:'#888' }}>{e.sets}×{e.reps} {e.weight ? `@ ${e.weight}kg` : ''}</span>
          </div>
        ))}
        <button className="ft-btn ft-btn-primary ft-btn-full" style={{ marginTop:16 }} onClick={() => {
          if (navigator.share) navigator.share({ title: workout.name, text: workout.exercises.map(e => `${e.name}: ${e.sets}×${e.reps}${e.weight ? ` @ ${e.weight}kg` : ''}`).join('\n') })
        }}>Share</button>
      </div>
    </div>
  )
}

function HomeScreen({ setTab }) {
  const [workouts] = useStorage('fittrack_workouts', [])
  const [cardio] = useStorage('fittrack_cardio', [])
  const thisWeek = workouts.filter(w => {
    const d = new Date(w.date); const now = new Date(); const weekStart = new Date(now); weekStart.setDate(now.getDate() - now.getDay())
    return d >= weekStart
  })
  const streak = (() => {
    const days = [...new Set(workouts.map(w => w.date))].sort().reverse()
    let s = 0; let d = new Date(today())
    for (const day of days) {
      if (day === d.toISOString().slice(0,10)) { s++; d.setDate(d.getDate()-1) } else break
    }
    return s
  })()
  const todayWorkouts = workouts.filter(w => w.date === today())
  const recentWorkouts = workouts.slice(-5).reverse()
  return (
    <div className="ft-screen">
      <style>{CSS}</style>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:20 }}>
        <div>
          <div className="ft-h1">FitTrack</div>
          <div style={{ color:'#888', fontSize:14 }}>
            {new Date().toLocaleDateString('en-GB', { weekday:'long', day:'numeric', month:'long' })}
          </div>
        </div>
        <button className="ft-icon-btn" onClick={() => setTab('settings')}>{Icon.settings}</button>
      </div>
      <div className="ft-grid-3" style={{ marginBottom:16 }}>
        <div className="ft-stat-box">
          <div className="ft-stat-num">{thisWeek.length}</div>
          <div className="ft-stat-lbl">This Week</div>
        </div>
        <div className="ft-stat-box">
          <div className="ft-stat-num" style={{ color:'#f5a623' }}>{streak}</div>
          <div className="ft-stat-lbl">Day Streak</div>
        </div>
        <div className="ft-stat-box">
          <div className="ft-stat-num" style={{ color:'#6c63ff' }}>{workouts.length}</div>
          <div className="ft-stat-lbl">Total</div>
        </div>
      </div>
      {todayWorkouts.length > 0 && (
        <div className="ft-card" style={{ borderColor:'#c8f13533', background:'#c8f13508', marginBottom:16 }}>
          <div style={{ fontSize:12, color:'#c8f135', fontWeight:700, marginBottom:6 }}>TODAY</div>
          {todayWorkouts.map(w => (
            <div key={w.id} style={{ fontSize:15, fontWeight:600 }}>{w.name} · {w.exercises.length} exercises</div>
          ))}
        </div>
      )}
      <div className="ft-h3">Quick Start</div>
      <div className="ft-scrollx" style={{ marginBottom:16 }}>
        {['Log Workout','Stretches','Cardio','Recovery'].map((label, i) => {
          const tabs = ['train','recover','cardio','recover']
          return (
            <button key={label} className="ft-btn ft-btn-secondary" style={{ whiteSpace:'nowrap', minWidth:'auto' }}
              onClick={() => setTab(tabs[i])}>
              {label}
            </button>
          )
        })}
      </div>
      {recentWorkouts.length > 0 && (
        <>
          <div className="ft-h3">Recent</div>
          {recentWorkouts.map(w => (
            <div key={w.id} className="ft-card">
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                <div>
                  <div style={{ fontWeight:600, fontSize:15 }}>{w.name}</div>
                  <div style={{ fontSize:12, color:'#888', marginTop:2 }}>{dateLabel(w.date)} · {w.exercises.length} exercises</div>
                </div>
                <span className="ft-badge ft-badge-lime">{w.group}</span>
              </div>
            </div>
          ))}
        </>
      )}
      {workouts.length === 0 && (
        <div className="ft-empty">
          <div style={{ fontSize:40, marginBottom:8 }}>💪</div>
          <div style={{ fontWeight:600, marginBottom:4 }}>Ready to train?</div>
          <div style={{ fontSize:14 }}>Log your first workout to get started</div>
        </div>
      )}
    </div>
  )
}

function LogScreen({ embedded, routinePrefill, onClear }) {
  const [workouts, saveWorkouts] = useStorage('fittrack_workouts', [])
  const [name, setName] = useState(routinePrefill?.name || '')
  const [group, setGroup] = useState(routinePrefill?.group || 'Chest')
  const [exercises, setExercises] = useState(routinePrefill?.exercises?.map(e => ({ ...e, ssGroup: null })) || [{ name:'', sets:3, reps:'10', weight:'', ssGroup:null }])
  const [showTimer, setShowTimer] = useState(false)
  const [showTutorial, setShowTutorial] = useState(null)
  const [saved, setSaved] = useState(false)

  const addExercise = () => setExercises(e => [...e, { name:'', sets:3, reps:'10', weight:'', ssGroup:null }])
  const removeExercise = i => setExercises(e => e.filter((_, idx) => idx !== i))
  const updateExercise = (i, field, val) => setExercises(e => e.map((ex, idx) => idx === i ? { ...ex, [field]: val } : ex))
  const toggleSS = i => setExercises(e => {
    const ex = [...e]; const cur = ex[i].ssGroup
    if (cur !== null) { ex[i] = { ...ex[i], ssGroup: null }; return ex }
    const used = new Set(ex.map(x => x.ssGroup).filter(x => x !== null))
    const next = [0,1,2,3,4,5,6,7].find(n => !used.has(n)) ?? 0
    ex[i] = { ...ex[i], ssGroup: next }; return ex
  })
  const save = () => {
    if (!name || exercises.every(e => !e.name)) return
    const workout = { id: Date.now(), name, group, date: today(), exercises: exercises.filter(e => e.name) }
    saveWorkouts([...workouts, workout])
    setSaved(true); setTimeout(() => setSaved(false), 2000)
    setName(''); setExercises([{ name:'', sets:3, reps:'10', weight:'', ssGroup:null }])
    if (onClear) onClear()
  }

  const tutEx = showTutorial ? TUTORIALS.find(t => t.name.toLowerCase() === showTutorial.toLowerCase()) : null
  const homeAlt = showTutorial ? HOME_ALTS[showTutorial] : null

  return (
    <div className={`ft-screen${embedded ? ' embedded' : ''}`}>
      {showTimer && <RestTimer onClose={() => setShowTimer(false)} />}
      {showTutorial && (
        <div className="ft-modal">
          <div className="ft-modal-box">
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:12 }}>
              <div className="ft-h2" style={{ marginBottom:0 }}>{showTutorial}</div>
              <button className="ft-icon-btn" onClick={() => setShowTutorial(null)}>{Icon.close}</button>
            </div>
            {tutEx ? (
              <>
                <div style={{ fontSize:12, color:'#888', marginBottom:8 }}>Muscles: <span style={{ color:'#e8e8f0' }}>{tutEx.muscles}</span></div>
                <div style={{ fontSize:13, marginBottom:8 }}><strong>How:</strong> {tutEx.how}</div>
                <div style={{ fontSize:13, color:'#c8f135' }}>💡 {tutEx.tip}</div>
                {homeAlt && (
                  <div className="ft-card" style={{ marginTop:12 }}>
                    <div style={{ fontSize:12, color:'#888', marginBottom:4 }}>Home Alt</div>
                    <div style={{ fontWeight:600 }}>{homeAlt.ex}</div>
                    <div style={{ fontSize:12, color:'#888' }}>{homeAlt.eq}</div>
                  </div>
                )}
              </>
            ) : <div style={{ color:'#888' }}>No tutorial found</div>}
          </div>
        </div>
      )}
      {!embedded && <div className="ft-h1">Log Workout</div>}
      <div className="ft-col" style={{ marginBottom:12 }}>
        <input className="ft-input" placeholder="Workout name" value={name} onChange={e => setName(e.target.value)} />
        <select className="ft-select" value={group} onChange={e => setGroup(e.target.value)}>
          {MUSCLE_GROUPS.map(g => <option key={g}>{g}</option>)}
        </select>
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 60px 60px 70px 36px', gap:4, marginBottom:4 }}>
        {['Exercise','Sets','Reps','Weight',''].map((h, i) => (
          <div key={i} style={{ fontSize:10, color:'#666', textTransform:'uppercase', textAlign:'center' }}>{h}</div>
        ))}
      </div>
      {exercises.map((ex, i) => (
        <div key={i} style={{ marginBottom:6 }}>
          {ex.ssGroup !== null && (
            <div className="ft-ss-label" style={{ background: SS_COLOURS[ex.ssGroup] }}>SS{ex.ssGroup + 1}</div>
          )}
          <div className="ft-exercise-row">
            <div style={{ position:'relative' }}>
              <input value={ex.name} onChange={e => updateExercise(i, 'name', e.target.value)}
                placeholder="Exercise" style={{ background:'#0a0a0f', border:'1px solid #1e1e2e', borderRadius:6, padding:'6px 8px', color:'#e8e8f0', fontSize:13, width:'100%', outline:'none' }}/>
              {ex.name && TUTORIALS.some(t => t.name.toLowerCase() === ex.name.toLowerCase()) && (
                <button className="ft-icon-btn" style={{ position:'absolute', right:2, top:'50%', transform:'translateY(-50%)', padding:2 }}
                  onClick={() => setShowTutorial(ex.name)}>{Icon.info}</button>
              )}
            </div>
            <input value={fmt(ex.sets)} onChange={e => updateExercise(i, 'sets', e.target.value)} style={{ background:'#0a0a0f', border:'1px solid #1e1e2e', borderRadius:6, padding:'6px 8px', color:'#e8e8f0', fontSize:13, textAlign:'center', outline:'none', width:'100%' }}/>
            <input value={fmt(ex.reps)} onChange={e => updateExercise(i, 'reps', e.target.value)} style={{ background:'#0a0a0f', border:'1px solid #1e1e2e', borderRadius:6, padding:'6px 8px', color:'#e8e8f0', fontSize:13, textAlign:'center', outline:'none', width:'100%' }}/>
            <input value={fmt(ex.weight)} onChange={e => updateExercise(i, 'weight', e.target.value)} placeholder="kg" style={{ background:'#0a0a0f', border:'1px solid #1e1e2e', borderRadius:6, padding:'6px 8px', color:'#e8e8f0', fontSize:13, textAlign:'center', outline:'none', width:'100%' }}/>
            <div style={{ display:'flex', flexDirection:'column', gap:2 }}>
              <button className="ft-icon-btn" style={{ fontSize:10, padding:2 }} title="Superset" onClick={() => toggleSS(i)}>
                <span style={{ fontWeight:700, fontSize:11 }}>SS</span>
              </button>
              <button className="ft-icon-btn" onClick={() => removeExercise(i)}>{Icon.minus}</button>
            </div>
          </div>
        </div>
      ))}
      <div className="ft-row" style={{ marginTop:8, gap:8 }}>
        <button className="ft-btn ft-btn-ghost ft-btn-sm" onClick={addExercise}>{Icon.plus} Add</button>
        <button className="ft-btn ft-btn-ghost ft-btn-sm" onClick={() => setShowTimer(true)}>{Icon.timer} Rest</button>
      </div>
      <button className="ft-btn ft-btn-primary ft-btn-full" style={{ marginTop:16 }} onClick={save}>
        {saved ? '✓ Saved!' : 'Save Workout'}
      </button>
    </div>
  )
}

function RoutinesScreen({ embedded, onSelect }) {
  const [view, setView] = useState('routines')
  const [search, setSearch] = useState('')
  const groups = [...new Set(Object.values(ROUTINES_ALL).map(r => r.group))]
  const [groupFilter, setGroupFilter] = useState('All')
  const filtered = Object.entries(ROUTINES_ALL).filter(([name, r]) => {
    const matchGroup = groupFilter === 'All' || r.group === groupFilter
    const matchSearch = name.toLowerCase().includes(search.toLowerCase())
    return matchGroup && matchSearch
  })
  return (
    <div className={`ft-screen${embedded ? ' embedded' : ''}`}>
      {!embedded && <div className="ft-h1">Routines</div>}
      <input className="ft-input" placeholder="Search routines…" value={search} onChange={e => setSearch(e.target.value)} style={{ marginBottom:10 }}/>
      <div className="ft-chips">
        {['All', ...groups].map(g => (
          <button key={g} className={`ft-chip${groupFilter===g?' active':''}`} onClick={() => setGroupFilter(g)}>{g}</button>
        ))}
      </div>
      {filtered.map(([name, r]) => (
        <div key={name} className="ft-card" style={{ cursor:'pointer' }} onClick={() => onSelect && onSelect({ name, ...r })}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <div>
              <div style={{ fontWeight:600 }}>{name}</div>
              <div style={{ fontSize:12, color:'#888', marginTop:2 }}>{r.exercises.length} exercises</div>
            </div>
            <span className="ft-badge ft-badge-lime">{r.group}</span>
          </div>
        </div>
      ))}
    </div>
  )
}

function VolumeTracker({ embedded }) {
  const [workouts] = useStorage('fittrack_workouts', [])
  const data = (() => {
    const weeks = {}
    workouts.forEach(w => {
      const d = new Date(w.date); const week = `${d.getFullYear()}-W${String(Math.ceil((d.getDate() + new Date(d.getFullYear(), d.getMonth(), 1).getDay()) / 7)).padStart(2,'0')}`
      if (!weeks[week]) weeks[week] = { week, sets:0, volume:0 }
      w.exercises.forEach(e => {
        weeks[week].sets += Number(e.sets) || 0
        weeks[week].volume += (Number(e.sets) || 0) * (Number(e.reps) || 0) * (Number(e.weight) || 1)
      })
    })
    return Object.values(weeks).slice(-8)
  })()
  return (
    <div className={`ft-screen${embedded ? ' embedded' : ''}`}>
      {!embedded && <div className="ft-h1">Volume</div>}
      <div className="ft-h3">Weekly Sets</div>
      <div className="ft-card">
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={data}><CartesianGrid strokeDasharray="3 3" stroke="#1e1e2e"/>
            <XAxis dataKey="week" tick={{ fill:'#666', fontSize:10 }}/>
            <YAxis tick={{ fill:'#666', fontSize:10 }}/>
            <Tooltip contentStyle={{ background:'#13131e', border:'1px solid #2e2e3e', borderRadius:8, color:'#e8e8f0' }}/>
            <Bar dataKey="sets" fill="#c8f135" radius={[4,4,0,0]}/></BarChart>
        </ResponsiveContainer>
      </div>
      <div className="ft-h3" style={{ marginTop:8 }}>Weekly Volume (kg)</div>
      <div className="ft-card">
        <ResponsiveContainer width="100%" height={180}>
          <LineChart data={data}><CartesianGrid strokeDasharray="3 3" stroke="#1e1e2e"/>
            <XAxis dataKey="week" tick={{ fill:'#666', fontSize:10 }}/>
            <YAxis tick={{ fill:'#666', fontSize:10 }}/>
            <Tooltip contentStyle={{ background:'#13131e', border:'1px solid #2e2e3e', borderRadius:8, color:'#e8e8f0' }}/>
            <Line type="monotone" dataKey="volume" stroke="#6c63ff" strokeWidth={2} dot={false}/></LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

function OneRMCalculator({ embedded }) {
  const [weight, setWeight] = useState('')
  const [reps, setReps] = useState('')
  const epley = weight && reps ? (Number(weight) * (1 + Number(reps) / 30)).toFixed(1) : null
  const brzycki = weight && reps ? (Number(weight) / (1.0278 - 0.0278 * Number(reps))).toFixed(1) : null
  const pcts = [100, 95, 90, 85, 80, 75, 70, 65, 60]
  return (
    <div className={`ft-screen${embedded ? ' embedded' : ''}`}>
      {!embedded && <div className="ft-h1">1RM Calculator</div>}
      <div className="ft-card">
        <div className="ft-row" style={{ gap:12 }}>
          <div style={{ flex:1 }}>
            <label className="ft-label">Weight (kg)</label>
            <input className="ft-input" type="number" value={weight} onChange={e => setWeight(e.target.value)} placeholder="100"/>
          </div>
          <div style={{ flex:1 }}>
            <label className="ft-label">Reps</label>
            <input className="ft-input" type="number" value={reps} onChange={e => setReps(e.target.value)} placeholder="5"/>
          </div>
        </div>
      </div>
      {epley && (
        <>
          <div className="ft-grid-2" style={{ marginBottom:12 }}>
            <div className="ft-stat-box">
              <div className="ft-stat-num">{epley}</div>
              <div className="ft-stat-lbl">Epley 1RM</div>
            </div>
            <div className="ft-stat-box">
              <div className="ft-stat-num" style={{ color:'#6c63ff' }}>{brzycki}</div>
              <div className="ft-stat-lbl">Brzycki 1RM</div>
            </div>
          </div>
          <div className="ft-h3">% Chart (Epley)</div>
          {pcts.map(p => (
            <div key={p} className="ft-card" style={{ padding:'8px 12px', display:'flex', justifyContent:'space-between' }}>
              <span style={{ color:'#888' }}>{p}%</span>
              <span style={{ fontWeight:600 }}>{(epley * p / 100).toFixed(1)} kg</span>
            </div>
          ))}
        </>
      )}
    </div>
  )
}

function LiftTracker({ embedded }) {
  const [workouts] = useStorage('fittrack_workouts', [])
  const [selected, setSelected] = useState('')
  const lifts = [...new Set(workouts.flatMap(w => w.exercises.map(e => e.name)))].sort()
  const data = workouts.filter(w => w.exercises.some(e => e.name === selected)).map(w => {
    const e = w.exercises.find(ex => ex.name === selected)
    return { date: w.date.slice(5), weight: Number(e.weight) || 0, volume: (Number(e.sets)||0)*(Number(e.reps)||0)*(Number(e.weight)||0) }
  })
  const pb = data.reduce((max, d) => d.weight > max ? d.weight : max, 0)
  return (
    <div className={`ft-screen${embedded ? ' embedded' : ''}`}>
      {!embedded && <div className="ft-h1">Lift Tracker</div>}
      <select className="ft-select" value={selected} onChange={e => setSelected(e.target.value)} style={{ marginBottom:12 }}>
        <option value="">Select exercise…</option>
        {lifts.map(l => <option key={l}>{l}</option>)}
      </select>
      {selected && data.length > 0 && (
        <>
          <div className="ft-stat-box" style={{ marginBottom:12, textAlign:'center' }}>
            <div className="ft-stat-num">{pb}kg</div>
            <div className="ft-stat-lbl">Personal Best</div>
          </div>
          <div className="ft-card">
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={data}><CartesianGrid strokeDasharray="3 3" stroke="#1e1e2e"/>
                <XAxis dataKey="date" tick={{ fill:'#666', fontSize:10 }}/>
                <YAxis tick={{ fill:'#666', fontSize:10 }}/>
                <Tooltip contentStyle={{ background:'#13131e', border:'1px solid #2e2e3e', borderRadius:8, color:'#e8e8f0' }}/>
                <Line type="monotone" dataKey="weight" stroke="#c8f135" strokeWidth={2} dot={{ fill:'#c8f135', r:3 }}/></LineChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
      {(!selected || data.length === 0) && (
        <div className="ft-empty"><div>Select an exercise to see your progress</div></div>
      )}
    </div>
  )
}

function ProgressScreen({ embedded }) {
  const [workouts] = useStorage('fittrack_workouts', [])
  const [cardio] = useStorage('fittrack_cardio', [])
  const monthData = (() => {
    const months = {}
    workouts.forEach(w => {
      const m = w.date.slice(0,7)
      if (!months[m]) months[m] = { month: m.slice(5), workouts:0, cardio:0 }
      months[m].workouts++
    })
    cardio.forEach(c => {
      const m = c.date.slice(0,7)
      if (!months[m]) months[m] = { month: m.slice(5), workouts:0, cardio:0 }
      months[m].cardio++
    })
    return Object.values(months).slice(-6)
  })()
  const totalVolume = workouts.reduce((sum, w) => sum + w.exercises.reduce((s, e) => s + (Number(e.sets)||0)*(Number(e.reps)||0)*(Number(e.weight)||0), 0), 0)
  return (
    <div className={`ft-screen${embedded ? ' embedded' : ''}`}>
      {!embedded && <div className="ft-h1">Progress</div>}
      <div className="ft-grid-3" style={{ marginBottom:16 }}>
        <div className="ft-stat-box">
          <div className="ft-stat-num">{workouts.length}</div>
          <div className="ft-stat-lbl">Workouts</div>
        </div>
        <div className="ft-stat-box">
          <div className="ft-stat-num" style={{ color:'#4ecdc4' }}>{cardio.length}</div>
          <div className="ft-stat-lbl">Cardio</div>
        </div>
        <div className="ft-stat-box">
          <div className="ft-stat-num" style={{ color:'#f5a623', fontSize:20 }}>{(totalVolume/1000).toFixed(0)}k</div>
          <div className="ft-stat-lbl">Vol (kg)</div>
        </div>
      </div>
      <div className="ft-card">
        <div className="ft-h3">Monthly Activity</div>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={monthData}><CartesianGrid strokeDasharray="3 3" stroke="#1e1e2e"/>
            <XAxis dataKey="month" tick={{ fill:'#666', fontSize:10 }}/>
            <YAxis tick={{ fill:'#666', fontSize:10 }}/>
            <Tooltip contentStyle={{ background:'#13131e', border:'1px solid #2e2e3e', borderRadius:8, color:'#e8e8f0' }}/>
            <Bar dataKey="workouts" fill="#c8f135" radius={[4,4,0,0]}/>
            <Bar dataKey="cardio" fill="#4ecdc4" radius={[4,4,0,0]}/></BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

function CardioScreen() {
  const [entries, saveEntries] = useStorage('fittrack_cardio', [])
  const [type, setType] = useState('Running')
  const [duration, setDuration] = useState('')
  const [distance, setDistance] = useState('')
  const [notes, setNotes] = useState('')
  const [saved, setSaved] = useState(false)
  const weight = 80
  const save = () => {
    if (!duration) return
    const ct = CARDIO_TYPES.find(c => c.name === type)
    const cal = ct ? Math.round(ct.met * weight * (Number(duration) / 60)) : 0
    saveEntries([...entries, { id: Date.now(), type, duration: Number(duration), distance: Number(distance) || 0, notes, cal, date: today() }])
    setSaved(true); setTimeout(() => setSaved(false), 2000)
    setDuration(''); setDistance(''); setNotes('')
  }
  const recent = entries.slice(-10).reverse()
  return (
    <div className="ft-screen">
      <div className="ft-h1">Cardio</div>
      <div className="ft-card" style={{ marginBottom:16 }}>
        <div className="ft-chips">
          {CARDIO_TYPES.map(c => (
            <button key={c.name} className={`ft-chip${type===c.name?' active':''}`} onClick={() => setType(c.name)}>
              {c.icon} {c.name}
            </button>
          ))}
        </div>
        <div className="ft-row" style={{ marginTop:10 }}>
          <div style={{ flex:1 }}>
            <label className="ft-label">Duration (min)</label>
            <input className="ft-input" type="number" value={duration} onChange={e => setDuration(e.target.value)} placeholder="30"/>
          </div>
          <div style={{ flex:1 }}>
            <label className="ft-label">Distance (km)</label>
            <input className="ft-input" type="number" value={distance} onChange={e => setDistance(e.target.value)} placeholder="5"/>
          </div>
        </div>
        <div style={{ marginTop:8 }}>
          <label className="ft-label">Notes</label>
          <input className="ft-input" value={notes} onChange={e => setNotes(e.target.value)} placeholder="How did it feel?"/>
        </div>
        <button className="ft-btn ft-btn-primary ft-btn-full" style={{ marginTop:12 }} onClick={save}>
          {saved ? '✓ Logged!' : 'Log Cardio'}
        </button>
      </div>
      {recent.length > 0 && (
        <>
          <div className="ft-h3">Recent</div>
          {recent.map(e => (
            <div key={e.id} className="ft-card">
              <div style={{ display:'flex', justifyContent:'space-between' }}>
                <div>
                  <div style={{ fontWeight:600 }}>{e.type}</div>
                  <div style={{ fontSize:12, color:'#888', marginTop:2 }}>
                    {e.duration}min{e.distance ? ` · ${e.distance}km` : ''} · {dateLabel(e.date)}
                  </div>
                </div>
                {e.cal > 0 && <span className="ft-badge ft-badge-orange">{e.cal} kcal</span>}
              </div>
              {e.notes && <div style={{ fontSize:13, color:'#888', marginTop:6 }}>{e.notes}</div>}
            </div>
          ))}
        </>
      )}
    </div>
  )
}

function BendSession({ program, onClose }) {
  const [idx, setIdx] = useState(0)
  const [timeLeft, setTimeLeft] = useState(program.stretches[0] ? (STRETCH_LIBRARY.find(s => s.name === program.stretches[0])?.hold || 30) : 30)
  const [running, setRunning] = useState(false)
  const [phase, setPhase] = useState('ready')
  const ref = useRef(null)
  const stretch = STRETCH_LIBRARY.find(s => s.name === program.stretches[idx])
  const total = program.stretches.length

  useEffect(() => {
    if (running && timeLeft > 0) { ref.current = setTimeout(() => setTimeLeft(t => t - 1), 1000) }
    else if (running && timeLeft === 0) {
      if (idx + 1 < total) { setIdx(i => i + 1); const next = STRETCH_LIBRARY.find(s => s.name === program.stretches[idx+1]); setTimeLeft(next?.hold || 30) }
      else { setPhase('done'); setRunning(false) }
    }
    return () => clearTimeout(ref.current)
  }, [running, timeLeft])

  const hold = stretch?.hold || 30
  const pct = timeLeft / hold
  const r = 54; const c = 2 * Math.PI * r

  if (phase === 'done') return (
    <div className="ft-screen" style={{ textAlign:'center', paddingTop:60 }}>
      <div style={{ fontSize:60, marginBottom:16 }}>🌿</div>
      <div className="ft-h1">Complete!</div>
      <div style={{ color:'#888', marginBottom:24 }}>{program.name} · {total} stretches</div>
      <button className="ft-btn ft-btn-primary" onClick={onClose}>Done</button>
    </div>
  )

  return (
    <div className="ft-screen">
      <div style={{ display:'flex', justifyContent:'space-between', marginBottom:20 }}>
        <button className="ft-icon-btn" onClick={onClose}>{Icon.back}</button>
        <span style={{ color:'#888', fontSize:13 }}>{idx + 1} / {total}</span>
      </div>
      <div className="ft-h1" style={{ marginBottom:4 }}>{stretch?.name || program.stretches[idx]}</div>
      <div style={{ color:'#888', fontSize:14, marginBottom:24 }}>{stretch?.muscles}</div>
      <div style={{ display:'flex', justifyContent:'center', marginBottom:24 }}>
        <svg width="160" height="160" viewBox="0 0 120 120">
          <circle cx="60" cy="60" r={r} fill="none" stroke="#1e1e2e" strokeWidth="8"/>
          <circle cx="60" cy="60" r={r} fill="none" stroke="#4ecdc4" strokeWidth="8"
            strokeDasharray={c} strokeDashoffset={c * (1 - pct)}
            strokeLinecap="round" transform="rotate(-90 60 60)" style={{ transition:'stroke-dashoffset .8s' }}/>
          <text x="60" y="58" textAnchor="middle" fill="#e8e8f0" fontSize="28" fontFamily="Bebas Neue,sans-serif">{timeLeft}</text>
          <text x="60" y="74" textAnchor="middle" fill="#888" fontSize="10" fontFamily="DM Sans,sans-serif">seconds</text>
        </svg>
      </div>
      {stretch?.cue && <div className="ft-card" style={{ textAlign:'center', color:'#4ecdc4', marginBottom:20 }}>💭 {stretch.cue}</div>}
      <button className="ft-btn ft-btn-primary ft-btn-full" onClick={() => setRunning(r => !r)}>
        {running ? 'Pause' : (timeLeft === hold ? 'Start' : 'Resume')}
      </button>
      {idx + 1 < total && (
        <div style={{ marginTop:12, color:'#555', fontSize:12, textAlign:'center' }}>
          Next: {program.stretches[idx + 1]}
        </div>
      )}
    </div>
  )
}

function StretchesScreen({ embedded }) {
  const [streak, saveStreak] = useStorage('fittrack_stretch_streak', { count:0, lastDate:'' })
  const [todayDone, saveTodayDone] = useStorage('fittrack_stretch_today', [])
  const [activeProgram, setActiveProgram] = useState(null)
  const [view, setView] = useState('programs')
  const [search, setSearch] = useState('')

  useEffect(() => {
    if (streak.lastDate === today()) return
    if (streak.lastDate === new Date(Date.now()-86400000).toISOString().slice(0,10)) {
      saveStreak({ count: streak.count + 1, lastDate: today() })
    }
  }, [])

  const markDone = id => {
    if (todayDone.includes(id)) return
    const newDone = [...todayDone, id]
    saveTodayDone(newDone)
    if (!streak.lastDate || streak.lastDate !== today()) saveStreak({ count: streak.count + 1, lastDate: today() })
  }

  if (activeProgram) return <BendSession program={activeProgram} onClose={() => { setActiveProgram(null); markDone(activeProgram.id) }} />

  return (
    <div className={`ft-screen${embedded ? ' embedded' : ''}`}>
      {!embedded && <div className="ft-h1">Stretches</div>}
      <div className="ft-row" style={{ marginBottom:16, gap:12 }}>
        <div className="ft-stat-box" style={{ flex:1 }}>
          <div className="ft-stat-num" style={{ color:'#4ecdc4' }}>{streak.count}</div>
          <div className="ft-stat-lbl">Day Streak</div>
        </div>
        <div className="ft-stat-box" style={{ flex:1 }}>
          <div className="ft-stat-num">{todayDone.length}</div>
          <div className="ft-stat-lbl">Done Today</div>
        </div>
      </div>
      <HubToggle tabs={['programs','library']} value={view} onChange={setView} />
      {view === 'programs' && STRETCH_PROGRAMS.map(p => (
        <div key={p.id} className="ft-card">
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <div>
              <div style={{ fontWeight:600 }}>{p.name}</div>
              <div style={{ fontSize:12, color:'#888', marginTop:2 }}>{p.stretches.length} stretches · ~{p.duration}min</div>
            </div>
            <div style={{ display:'flex', gap:8, alignItems:'center' }}>
              {todayDone.includes(p.id) && <span style={{ color:'#38b87c' }}>{Icon.check}</span>}
              <button className="ft-btn ft-btn-primary ft-btn-sm" onClick={() => setActiveProgram(p)}>Start</button>
            </div>
          </div>
        </div>
      ))}
      {view === 'library' && (
        <>
          <input className="ft-input" placeholder="Search stretches…" value={search} onChange={e => setSearch(e.target.value)} style={{ marginBottom:10 }}/>
          {STRETCH_LIBRARY.filter(s => s.name.toLowerCase().includes(search.toLowerCase())).map(s => (
            <div key={s.name} className="ft-card">
              <div style={{ fontWeight:600 }}>{s.name}</div>
              <div style={{ fontSize:12, color:'#888', marginTop:2 }}>{s.muscles} · {s.hold}s{s.sides ? ' each side' : ''}</div>
              <div style={{ fontSize:13, color:'#4ecdc4', marginTop:6 }}>💭 {s.cue}</div>
            </div>
          ))}
        </>
      )}
    </div>
  )
}

function RecoverySession({ protocol, onClose }) {
  const [idx, setIdx] = useState(0)
  const [timeLeft, setTimeLeft] = useState(protocol.steps[0]?.duration || 60)
  const [running, setRunning] = useState(false)
  const [done, setDone] = useState(false)
  const ref = useRef(null)
  const step = protocol.steps[idx]

  useEffect(() => {
    if (running && timeLeft > 0) { ref.current = setTimeout(() => setTimeLeft(t => t - 1), 1000) }
    else if (running && timeLeft === 0) {
      if (idx + 1 < protocol.steps.length) { const next = protocol.steps[idx+1]; setIdx(i=>i+1); setTimeLeft(next.duration) }
      else { setDone(true); setRunning(false) }
    }
    return () => clearTimeout(ref.current)
  }, [running, timeLeft])

  const pct = timeLeft / (step?.duration || 60)
  const r = 54; const c = 2 * Math.PI * r
  const mm = String(Math.floor(timeLeft/60)).padStart(2,'0')
  const ss = String(timeLeft%60).padStart(2,'0')

  if (done) return (
    <div className="ft-screen" style={{ textAlign:'center', paddingTop:60 }}>
      <div style={{ fontSize:60, marginBottom:16 }}>✅</div>
      <div className="ft-h1">{protocol.name}</div>
      <div style={{ color:'#888', marginBottom:24 }}>Complete!</div>
      <button className="ft-btn ft-btn-primary" onClick={onClose}>Done</button>
    </div>
  )

  return (
    <div className="ft-screen">
      <div style={{ display:'flex', justifyContent:'space-between', marginBottom:16 }}>
        <button className="ft-icon-btn" onClick={onClose}>{Icon.back}</button>
        <span style={{ color:'#888', fontSize:13 }}>{idx+1} / {protocol.steps.length}</span>
      </div>
      <div className="ft-h1" style={{ marginBottom:4 }}>{step?.name}</div>
      <div style={{ color:'#888', marginBottom:24, fontSize:14 }}>{protocol.name}</div>
      <div style={{ display:'flex', justifyContent:'center', marginBottom:24 }}>
        <svg width="160" height="160" viewBox="0 0 120 120">
          <circle cx="60" cy="60" r={r} fill="none" stroke="#1e1e2e" strokeWidth="8"/>
          <circle cx="60" cy="60" r={r} fill="none" stroke="#38b87c" strokeWidth="8"
            strokeDasharray={c} strokeDashoffset={c*(1-pct)} strokeLinecap="round" transform="rotate(-90 60 60)" style={{transition:'stroke-dashoffset .8s'}}/>
          <text x="60" y="58" textAnchor="middle" fill="#e8e8f0" fontSize="26" fontFamily="Bebas Neue,sans-serif">{mm}:{ss}</text>
          <text x="60" y="74" textAnchor="middle" fill="#888" fontSize="10" fontFamily="DM Sans,sans-serif">{running?'active':'paused'}</text>
        </svg>
      </div>
      {step?.cue && <div className="ft-card" style={{ textAlign:'center', color:'#38b87c', marginBottom:20 }}>💭 {step.cue}</div>}
      <button className="ft-btn ft-btn-primary ft-btn-full" onClick={() => setRunning(r=>!r)}>
        {running ? 'Pause' : (timeLeft === (step?.duration||60) ? 'Start' : 'Resume')}
      </button>
      {idx+1 < protocol.steps.length && (
        <div style={{ marginTop:12, color:'#555', fontSize:12, textAlign:'center' }}>Next: {protocol.steps[idx+1].name}</div>
      )}
    </div>
  )
}

function RecoveryScreen({ embedded }) {
  const [todayDone, saveTodayDone] = useStorage('fittrack_recovery_today', [])
  const [active, setActive] = useState(null)
  const [view, setView] = useState('protocols')
  if (active) return <RecoverySession protocol={active} onClose={() => { saveTodayDone([...todayDone, active.id]); setActive(null) }} />
  return (
    <div className={`ft-screen${embedded ? ' embedded' : ''}`}>
      {!embedded && <div className="ft-h1">Recovery</div>}
      <HubToggle tabs={['protocols','foam roll']} value={view} onChange={setView} />
      {view === 'protocols' && RECOVERY_PROTOCOLS.map(p => (
        <div key={p.id} className="ft-card">
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <div>
              <div style={{ fontWeight:600 }}>{p.name}</div>
              <div style={{ fontSize:12, color:'#888', marginTop:2 }}>{p.steps.length} steps · ~{p.duration}min</div>
              <div style={{ fontSize:12, color:'#666', marginTop:2 }}>{p.desc}</div>
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:6, alignItems:'flex-end' }}>
              {todayDone.includes(p.id) && <span className="ft-badge ft-badge-green">Done</span>}
              <button className="ft-btn ft-btn-primary ft-btn-sm" onClick={() => setActive(p)}>Start</button>
            </div>
          </div>
        </div>
      ))}
      {view === 'foam roll' && (
        <div className="ft-card">
          {RECOVERY_PROTOCOLS.find(p => p.id === 'r7')?.steps.map((s, i) => (
            <div key={i} style={{ padding:'10px 0', borderBottom: i < 6 ? '1px solid #1e1e2e' : 'none' }}>
              <div style={{ fontWeight:600, fontSize:14 }}>{s.name}</div>
              <div style={{ fontSize:12, color:'#888', marginTop:2 }}>{s.duration}s · {s.cue}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function ProgramsScreen({ embedded }) {
  const [progress, saveProgress] = useStorage('fittrack_prog_pectus', {})
  const [week, saveWeek] = useStorage('fittrack_prog_week', 1)
  const [expanded, setExpanded] = useState(null)
  const weekData = PECTUS_PROGRAM.find(w => w.week === week)
  const totalDone = Object.values(progress).reduce((sum, w) => sum + Object.values(w).filter(Boolean).length, 0)
  const totalWorkouts = PECTUS_PROGRAM.reduce((sum, w) => sum + w.workouts.length, 0)

  const toggle = (workoutId) => {
    const cur = progress[week] || {}
    saveProgress({ ...progress, [week]: { ...cur, [workoutId]: !cur[workoutId] } })
  }

  return (
    <div className={`ft-screen${embedded ? ' embedded' : ''}`}>
      {!embedded && <div className="ft-h1">Pectus Programme</div>}
      <div className="ft-card" style={{ marginBottom:16, borderColor:'#6c63ff44' }}>
        <div style={{ display:'flex', justifyContent:'space-between', marginBottom:8 }}>
          <span style={{ fontWeight:600 }}>12-Week Progress</span>
          <span style={{ color:'#6c63ff' }}>{totalDone}/{totalWorkouts}</span>
        </div>
        <div className="ft-progress-bar"><div className="ft-progress-fill" style={{ width:`${(totalDone/totalWorkouts)*100}%`, background:'#6c63ff' }}/></div>
      </div>
      <div className="ft-h3">Week</div>
      <div className="ft-chips">
        {PECTUS_PROGRAM.map(w => (
          <button key={w.week} className={`ft-chip${week===w.week?' active':''}`} onClick={() => saveWeek(w.week)}>{w.week}</button>
        ))}
      </div>
      {weekData?.workouts.map(wo => {
        const done = (progress[week] || {})[wo.id]
        return (
          <div key={wo.id} className="ft-card" style={{ borderColor: done ? '#38b87c44' : '#1e1e2e' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', cursor:'pointer' }} onClick={() => setExpanded(expanded === wo.id ? null : wo.id)}>
              <div>
                <div style={{ fontWeight:600 }}>{wo.name}</div>
                <div style={{ fontSize:12, color:'#888', marginTop:2 }}>{wo.exercises.length} exercises</div>
              </div>
              <div style={{ display:'flex', gap:8, alignItems:'center' }}>
                <button className={`ft-btn ft-btn-sm ${done ? 'ft-btn-secondary' : 'ft-btn-primary'}`} onClick={e => { e.stopPropagation(); toggle(wo.id) }}>
                  {done ? '✓ Done' : 'Mark Done'}
                </button>
              </div>
            </div>
            {expanded === wo.id && wo.exercises.map((e, i) => (
              <div key={i} style={{ marginTop:6, padding:'6px 0', borderTop:'1px solid #1e1e2e', display:'flex', justifyContent:'space-between' }}>
                <span style={{ fontSize:13 }}>{e.name}</span>
                <span style={{ fontSize:12, color:'#888' }}>{e.sets}×{e.reps}</span>
              </div>
            ))}
          </div>
        )
      })}
    </div>
  )
}

function GolfSessionRunner({ program, onClose }) {
  const [idx, setIdx] = useState(0)
  const [sets, setSets] = useState(0)
  const ex = program.exercises[idx]
  return (
    <div className="ft-screen">
      <div style={{ display:'flex', justifyContent:'space-between', marginBottom:16 }}>
        <button className="ft-icon-btn" onClick={onClose}>{Icon.back}</button>
        <span style={{ color:'#888', fontSize:13 }}>{idx+1} / {program.exercises.length}</span>
      </div>
      <div className="ft-h1" style={{ marginBottom:4 }}>{ex.name}</div>
      <div style={{ color:'#888', marginBottom:20, fontSize:14 }}>{program.name}</div>
      <div className="ft-card" style={{ textAlign:'center', marginBottom:20 }}>
        <div className="ft-stat-num">{sets} / {ex.sets}</div>
        <div className="ft-stat-lbl">Sets</div>
        <div style={{ color:'#888', fontSize:13, marginTop:4 }}>Reps: {ex.reps}</div>
      </div>
      {ex.cue && <div className="ft-card" style={{ color:'#c8f135', marginBottom:20 }}>⛳ {ex.cue}</div>}
      <div className="ft-row" style={{ gap:12 }}>
        <button className="ft-btn ft-btn-secondary" style={{ flex:1 }} onClick={() => setSets(s => Math.max(0, s-1))}>-</button>
        <button className="ft-btn ft-btn-primary" style={{ flex:2 }} onClick={() => {
          if (sets + 1 >= ex.sets) { if (idx + 1 < program.exercises.length) { setIdx(i=>i+1); setSets(0) } else onClose() }
          else setSets(s => s+1)
        }}>
          {sets + 1 >= ex.sets && idx + 1 >= program.exercises.length ? 'Finish' : 'Next Set'}
        </button>
      </div>
    </div>
  )
}

function GolfProgramsScreen({ embedded }) {
  const [active, setActive] = useState(null)
  if (active) return <GolfSessionRunner program={active} onClose={() => setActive(null)} />
  return (
    <div className={`ft-screen${embedded ? ' embedded' : ''}`}>
      {!embedded && <div className="ft-h1">Golf Programs</div>}
      {GOLF_PROGRAMS.map(p => (
        <div key={p.id} className="ft-card">
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <div>
              <div style={{ fontWeight:600 }}>{p.name}</div>
              <div style={{ fontSize:12, color:'#888', marginTop:2 }}>{p.weeks} weeks · {p.exercises.length} exercises</div>
              <div style={{ fontSize:12, color:'#666', marginTop:2 }}>{p.desc}</div>
            </div>
            <button className="ft-btn ft-btn-primary ft-btn-sm" onClick={() => setActive(p)}>Start</button>
          </div>
        </div>
      ))}
    </div>
  )
}

function CableSessionRunner({ routine, onClose }) {
  const [idx, setIdx] = useState(0)
  const [sets, setSets] = useState(0)
  const [weight, setWeight] = useState('')
  const [showTimer, setShowTimer] = useState(false)
  const ex = routine.exercises[idx]
  const tut = CABLE_TUTORIALS.find(t => t.name === ex?.name)
  return (
    <div className="ft-screen">
      {showTimer && <RestTimer onClose={() => setShowTimer(false)} />}
      <div style={{ display:'flex', justifyContent:'space-between', marginBottom:16 }}>
        <button className="ft-icon-btn" onClick={onClose}>{Icon.back}</button>
        <button className="ft-icon-btn" onClick={() => setShowTimer(true)}>{Icon.timer}</button>
        <span style={{ color:'#888', fontSize:13 }}>{idx+1} / {routine.exercises.length}</span>
      </div>
      <div className="ft-h1" style={{ marginBottom:4 }}>{ex?.name}</div>
      {tut && <div style={{ color:'#888', fontSize:13, marginBottom:8 }}>{tut.muscles}</div>}
      <div className="ft-card" style={{ textAlign:'center', marginBottom:16 }}>
        <div className="ft-stat-num">{sets} / {ex?.sets}</div>
        <div className="ft-stat-lbl">Sets · {ex?.reps} reps</div>
        <div style={{ marginTop:10 }}>
          <label className="ft-label">Weight (kg)</label>
          <input className="ft-input" type="number" value={weight} onChange={e => setWeight(e.target.value)} placeholder="kg" style={{ textAlign:'center' }}/>
        </div>
      </div>
      {tut?.tip && <div className="ft-card" style={{ color:'#c8f135', marginBottom:16, fontSize:13 }}>💡 {tut.tip}</div>}
      <div className="ft-row" style={{ gap:12 }}>
        <button className="ft-btn ft-btn-secondary" style={{ flex:1 }} onClick={() => setSets(s => Math.max(0,s-1))}>-</button>
        <button className="ft-btn ft-btn-primary" style={{ flex:2 }} onClick={() => {
          if (sets + 1 >= ex.sets) { if (idx+1 < routine.exercises.length) { setIdx(i=>i+1); setSets(0); setWeight('') } else onClose() }
          else setSets(s=>s+1)
        }}>
          {sets+1 >= ex?.sets && idx+1 >= routine.exercises.length ? 'Finish' : 'Next Set'}
        </button>
      </div>
    </div>
  )
}

function CableScreen({ embedded }) {
  const [view, setView] = useState('routines')
  const [active, setActive] = useState(null)
  if (active) return <CableSessionRunner routine={active} onClose={() => setActive(null)} />
  return (
    <div className={`ft-screen${embedded ? ' embedded' : ''}`}>
      {!embedded && <div className="ft-h1">Cable Machine</div>}
      <HubToggle tabs={['routines','exercises']} value={view} onChange={setView} />
      {view === 'routines' && CABLE_ROUTINES.map(r => (
        <div key={r.name} className="ft-card">
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <div>
              <div style={{ fontWeight:600 }}>{r.name}</div>
              <div style={{ fontSize:12, color:'#888', marginTop:2 }}>{r.exercises.length} exercises</div>
            </div>
            <button className="ft-btn ft-btn-primary ft-btn-sm" onClick={() => setActive(r)}>Start</button>
          </div>
        </div>
      ))}
      {view === 'exercises' && CABLE_TUTORIALS.map(t => (
        <div key={t.name} className="ft-card">
          <div style={{ fontWeight:600 }}>{t.name}</div>
          <div style={{ fontSize:12, color:'#888', marginTop:2 }}>{t.muscles}</div>
          <div style={{ fontSize:13, marginTop:6 }}>{t.how}</div>
          <div style={{ fontSize:13, color:'#c8f135', marginTop:4 }}>💡 {t.tip}</div>
        </div>
      ))}
    </div>
  )
}

function SchedulerScreen() {
  const [schedule, saveSchedule] = useStorage('fittrack_schedule', {})
  const [selectedDate, setSelectedDate] = useState(today())
  const [label, setLabel] = useState('')
  const [type, setType] = useState('Gym')
  const addItem = () => {
    if (!label) return
    const cur = schedule[selectedDate] || []
    saveSchedule({ ...schedule, [selectedDate]: [...cur, { label, type, id: Date.now() }] })
    setLabel('')
  }
  const remove = (date, id) => {
    saveSchedule({ ...schedule, [date]: schedule[date].filter(i => i.id !== id) })
  }
  const next7 = Array.from({ length:7 }, (_, i) => { const d = new Date(); d.setDate(d.getDate()+i); return d.toISOString().slice(0,10) })
  return (
    <div className="ft-screen">
      <div className="ft-h1">Scheduler</div>
      <div className="ft-scrollx" style={{ marginBottom:16 }}>
        {next7.map(d => (
          <button key={d} className={`ft-chip${selectedDate===d?' active':''}`} onClick={() => setSelectedDate(d)} style={{ minWidth:60, textAlign:'center' }}>
            <div style={{ fontSize:10 }}>{new Date(d+'T12:00:00').toLocaleDateString('en-GB',{weekday:'short'})}</div>
            <div style={{ fontWeight:700 }}>{d.slice(8)}</div>
          </button>
        ))}
      </div>
      <div className="ft-card" style={{ marginBottom:16 }}>
        <div className="ft-h3">Add to {dateLabel(selectedDate)}</div>
        <input className="ft-input" value={label} onChange={e => setLabel(e.target.value)} placeholder="e.g. Push A, 5k run…" style={{ marginBottom:8 }}/>
        <ChipGroup options={['Gym','Home','Cardio','Golf','Rest']} value={type} onChange={setType} />
        <button className="ft-btn ft-btn-primary ft-btn-sm" onClick={addItem}>{Icon.plus} Add</button>
      </div>
      {next7.map(d => {
        const items = schedule[d] || []
        if (!items.length) return null
        return (
          <div key={d} className="ft-card">
            <div style={{ fontSize:12, fontWeight:700, color:'#888', marginBottom:8 }}>{dateLabel(d)}</div>
            {items.map(item => (
              <div key={item.id} style={{ display:'flex', justifyContent:'space-between', padding:'4px 0' }}>
                <span>{item.label}</span>
                <div style={{ display:'flex', gap:8 }}>
                  <span className="ft-tag">{item.type}</span>
                  <button className="ft-icon-btn" onClick={() => remove(d, item.id)} style={{ width:20 }}>{Icon.trash}</button>
                </div>
              </div>
            ))}
          </div>
        )
      })}
    </div>
  )
}

function GeneratorScreen({ embedded, onGenerate }) {
  const [apiKey] = useStorage('fittrack_api_key', '')
  const [group, setGroup] = useState('Full Body')
  const [location, setLocation] = useState('Gym')
  const [duration, setDuration] = useState('45 min')
  const [goal, setGoal] = useState('Hypertrophy')
  const [level, setLevel] = useState('Intermediate')
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  const generate = async () => {
    if (!apiKey) { setError('Add your Anthropic API key in Settings'); return }
    setLoading(true); setError(''); setResult(null)
    const prompt = `Generate a ${duration} ${group} workout for a ${level} lifter at ${location}. Goal: ${goal}.${notes ? ' Notes: ' + notes : ''} Equipment note: home gym has dumbbells, kettlebells, bench, barbell, squat rack, resistance bands, landmine.

Return ONLY valid JSON in this exact format (no markdown, no explanation):
{"name":"Workout Name","group":"${group}","exercises":[{"name":"Exercise Name","sets":3,"reps":"10-12","weight":""}]}`

    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method:'POST',
        headers:{ 'Content-Type':'application/json', 'x-api-key': apiKey, 'anthropic-version':'2023-06-01', 'anthropic-dangerous-direct-browser-access':'true' },
        body: JSON.stringify({ model:'claude-sonnet-4-20250514', max_tokens:1024, messages:[{ role:'user', content: prompt }] })
      })
      const data = await res.json()
      const raw = data.content?.[0]?.text || ''
      const clean = raw.replace(/```json|```/g,'').trim()
      const workout = JSON.parse(clean)
      setResult(workout)
    } catch(e) {
      setError('Generation failed. Check API key and try again.')
    }
    setLoading(false)
  }

  return (
    <div className={`ft-screen${embedded ? ' embedded' : ''}`}>
      {!embedded && <div className="ft-h1">AI Generator</div>}
      <div className="ft-h3">Muscle Group</div>
      <ChipGroup options={GEN_OPTIONS.groups} value={group} onChange={setGroup} />
      <div className="ft-h3">Location</div>
      <ChipGroup options={GEN_OPTIONS.locations} value={location} onChange={setLocation} />
      <div className="ft-h3">Duration</div>
      <ChipGroup options={GEN_OPTIONS.durations} value={duration} onChange={setDuration} />
      <div className="ft-h3">Goal</div>
      <ChipGroup options={GEN_OPTIONS.goals} value={goal} onChange={setGoal} />
      <div className="ft-h3">Level</div>
      <ChipGroup options={GEN_OPTIONS.levels} value={level} onChange={setLevel} />
      <div style={{ marginBottom:12 }}>
        <label className="ft-label">Extra Notes (optional)</label>
        <input className="ft-input" value={notes} onChange={e => setNotes(e.target.value)} placeholder="e.g. avoid squats, focus on posterior chain…"/>
      </div>
      {error && <div style={{ color:'#ff6b6b', fontSize:13, marginBottom:12 }}>{error}</div>}
      <button className="ft-btn ft-btn-primary ft-btn-full" onClick={generate} disabled={loading}>
        {loading ? 'Generating…' : `${Icon.bolt} Generate Workout`}
      </button>
      {result && (
        <div className="ft-card" style={{ marginTop:16, borderColor:'#c8f13533' }}>
          <div style={{ fontWeight:700, fontSize:16, marginBottom:8 }}>{result.name}</div>
          {result.exercises?.map((e, i) => (
            <div key={i} style={{ display:'flex', justifyContent:'space-between', padding:'6px 0', borderBottom:'1px solid #1e1e2e' }}>
              <span style={{ fontSize:14 }}>{e.name}</span>
              <span style={{ fontSize:13, color:'#888' }}>{e.sets}×{e.reps}</span>
            </div>
          ))}
          {onGenerate && (
            <button className="ft-btn ft-btn-primary ft-btn-full" style={{ marginTop:12 }} onClick={() => onGenerate(result)}>
              Load into Log
            </button>
          )}
        </div>
      )}
    </div>
  )
}

function CoachScreen() {
  const [apiKey] = useStorage('fittrack_api_key', '')
  const [workouts] = useStorage('fittrack_workouts', [])
  const [messages, setMessages] = useState([
    { role:'assistant', content:'Hey! I\'m your AI coach. Ask me anything about training, form, programming, or nutrition.' }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const endRef = useRef(null)
  useEffect(() => { endRef.current?.scrollIntoView({ behavior:'smooth' }) }, [messages, loading])

  const send = async () => {
    if (!input.trim() || !apiKey) return
    const userMsg = { role:'user', content: input }
    setMessages(m => [...m, userMsg]); setInput(''); setLoading(true)
    const recentWorkoutsSummary = workouts.slice(-5).map(w => `${w.date}: ${w.name} (${w.exercises.map(e => e.name).join(', ')})`).join('\n')
    const system = `You are a knowledgeable, supportive personal trainer and coach. User context: manages lower back issues, focuses on glute/core work, plays golf, has a pectus carinatum rehab programme. Recent workouts:\n${recentWorkoutsSummary || 'None yet'}. Keep responses concise and practical.`
    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method:'POST',
        headers:{ 'Content-Type':'application/json', 'x-api-key': apiKey, 'anthropic-version':'2023-06-01', 'anthropic-dangerous-direct-browser-access':'true' },
        body: JSON.stringify({ model:'claude-sonnet-4-20250514', max_tokens:512, system, messages: [...messages, userMsg].filter(m=>m.role!=='assistant'||messages.indexOf(m)>0).map(m=>({ role:m.role, content:m.content })) })
      })
      const data = await res.json()
      setMessages(m => [...m, { role:'assistant', content: data.content?.[0]?.text || 'Sorry, I couldn\'t respond.' }])
    } catch { setMessages(m => [...m, { role:'assistant', content:'Network error. Check your API key in Settings.' }]) }
    setLoading(false)
  }

  return (
    <div style={{ height:'calc(100vh - 80px)', display:'flex', flexDirection:'column' }}>
      <style>{CSS}</style>
      <div style={{ padding:'16px 16px 8px', borderBottom:'1px solid #1e1e2e' }}>
        <div className="ft-h1">AI Coach</div>
        {!apiKey && <div style={{ fontSize:12, color:'#ff6b6b' }}>Add API key in Settings to enable</div>}
      </div>
      <div className="ft-chat-msgs">
        {messages.map((m, i) => (
          <div key={i} className={`ft-chat-bubble ${m.role==='user' ? 'ft-chat-user' : 'ft-chat-ai'}`}
            style={{ alignSelf: m.role==='user' ? 'flex-end' : 'flex-start' }}>
            {m.content}
          </div>
        ))}
        {loading && <div className="ft-chat-bubble ft-chat-ai" style={{ alignSelf:'flex-start' }}><div className="ft-dot-pulse"><span/><span/><span/></div></div>}
        <div ref={endRef}/>
      </div>
      <div style={{ padding:'8px 16px 16px', borderTop:'1px solid #1e1e2e', display:'flex', gap:8 }}>
        <input className="ft-input" value={input} onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key==='Enter' && send()} placeholder="Ask your coach…" style={{ flex:1 }}/>
        <button className="ft-btn ft-btn-primary" onClick={send} disabled={loading || !input.trim()}>{Icon.send}</button>
      </div>
    </div>
  )
}

function SettingsScreen() {
  const [apiKey, saveApiKey] = useStorage('fittrack_api_key', '')
  const [workouts, saveWorkouts] = useStorage('fittrack_workouts', [])
  const [cardio, saveCardio] = useStorage('fittrack_cardio', [])
  const [key, setKey] = useState(apiKey)
  const [saved, setSaved] = useState(false)
  const [confirmClear, setConfirmClear] = useState(false)
  const saveKey = () => { saveApiKey(key); setSaved(true); setTimeout(() => setSaved(false), 2000) }
  return (
    <div className="ft-screen">
      <div className="ft-h1">Settings</div>
      <div className="ft-card">
        <div className="ft-h3">Anthropic API Key</div>
        <div style={{ fontSize:12, color:'#888', marginBottom:8 }}>Required for AI Coach and Workout Generator</div>
        <input className="ft-input" type="password" value={key} onChange={e => setKey(e.target.value)} placeholder="sk-ant-…" style={{ marginBottom:8 }}/>
        <button className="ft-btn ft-btn-primary ft-btn-sm" onClick={saveKey}>{saved ? '✓ Saved' : 'Save Key'}</button>
      </div>
      <div className="ft-card">
        <div className="ft-h3">Data</div>
        <div style={{ display:'flex', gap:8, marginBottom:8 }}>
          <div style={{ flex:1 }}>
            <div style={{ fontWeight:600 }}>{workouts.length}</div>
            <div style={{ fontSize:12, color:'#888' }}>Workouts</div>
          </div>
          <div style={{ flex:1 }}>
            <div style={{ fontWeight:600 }}>{cardio.length}</div>
            <div style={{ fontSize:12, color:'#888' }}>Cardio</div>
          </div>
        </div>
        <button className="ft-btn ft-btn-danger ft-btn-sm" onClick={() => setConfirmClear(true)}>Clear All Data</button>
      </div>
      {confirmClear && (
        <div className="ft-modal">
          <div className="ft-modal-box">
            <div className="ft-h2">Delete all data?</div>
            <div style={{ color:'#888', marginBottom:16 }}>This cannot be undone.</div>
            <div className="ft-row" style={{ gap:8 }}>
              <button className="ft-btn ft-btn-secondary" style={{ flex:1 }} onClick={() => setConfirmClear(false)}>Cancel</button>
              <button className="ft-btn ft-btn-danger" style={{ flex:1 }} onClick={() => {
                saveWorkouts([]); saveCardio([]); localStorage.clear(); setConfirmClear(false)
              }}>Delete</button>
            </div>
          </div>
        </div>
      )}
      <div className="ft-card">
        <div className="ft-h3">About</div>
        <div style={{ fontSize:13, color:'#888' }}>FitTrack v1.0 · Built with React + Recharts · All data stored locally</div>
      </div>
    </div>
  )
}

function TrainHub() {
  const [sub, setSub] = useState('log')
  const [routinePrefill, setRoutinePrefill] = useState(null)
  const tabs = ['log','routines','programs']
  return (
    <div style={{ paddingTop:16, paddingLeft:16, paddingRight:16 }}>
      <div className="ft-h1" style={{ marginBottom:12 }}>Train</div>
      <HubToggle tabs={tabs} value={sub} onChange={s => { setSub(s); setRoutinePrefill(null) }} />
      {sub === 'log' && <LogScreen embedded routinePrefill={routinePrefill} onClear={() => setRoutinePrefill(null)} />}
      {sub === 'routines' && <RoutinesScreen embedded onSelect={r => { setRoutinePrefill(r); setSub('log') }} />}
      {sub === 'programs' && <ProgramsScreen embedded />}
    </div>
  )
}

function RecoverHub() {
  const [sub, setSub] = useState('stretches')
  return (
    <div style={{ paddingTop:16, paddingLeft:16, paddingRight:16 }}>
      <div className="ft-h1" style={{ marginBottom:12 }}>Recover</div>
      <HubToggle tabs={['stretches','recovery','cable']} value={sub} onChange={setSub} />
      {sub === 'stretches' && <StretchesScreen embedded />}
      {sub === 'recovery' && <RecoveryScreen embedded />}
      {sub === 'cable' && <CableScreen embedded />}
    </div>
  )
}

function StatsHub() {
  const [sub, setSub] = useState('progress')
  return (
    <div style={{ paddingTop:16, paddingLeft:16, paddingRight:16 }}>
      <div className="ft-h1" style={{ marginBottom:12 }}>Stats</div>
      <HubToggle tabs={['progress','volume','lifts','1rm']} value={sub} onChange={setSub} />
      {sub === 'progress' && <ProgressScreen embedded />}
      {sub === 'volume' && <VolumeTracker embedded />}
      {sub === 'lifts' && <LiftTracker embedded />}
      {sub === '1rm' && <OneRMCalculator embedded />}
    </div>
  )
}

function AIHub() {
  const [sub, setSub] = useState('coach')
  return (
    <div style={{ paddingTop:16, paddingLeft:16, paddingRight:16 }}>
      <div className="ft-h1" style={{ marginBottom:12 }}>AI</div>
      <HubToggle tabs={['coach','generator']} value={sub} onChange={setSub} />
      {sub === 'coach' && <CoachScreen />}
      {sub === 'generator' && <GeneratorScreen embedded />}
    </div>
  )
}

export default function FitTrack() {
  const [tab, setTab] = useState('home')

  const navItems = [
    { id:'home', label:'Home', icon: Icon.home },
    { id:'train', label:'Train', icon: Icon.train },
    { id:'cardio', label:'Cardio', icon: Icon.cardio },
    { id:'golf', label:'Golf', icon: Icon.golf },
    { id:'recover', label:'Recover', icon: Icon.recover },
    { id:'stats', label:'Stats', icon: Icon.stats },
    { id:'ai', label:'AI', icon: Icon.ai },
    { id:'schedule', label:'Plan', icon: Icon.calendar },
  ]

  return (
    <div className="ft-app">
      <style>{CSS}</style>
      {tab === 'home' && <HomeScreen setTab={setTab} />}
      {tab === 'train' && <TrainHub />}
      {tab === 'cardio' && <CardioScreen />}
      {tab === 'golf' && <GolfProgramsScreen />}
      {tab === 'recover' && <RecoverHub />}
      {tab === 'stats' && <StatsHub />}
      {tab === 'ai' && <AIHub />}
      {tab === 'schedule' && <SchedulerScreen />}
      {tab === 'settings' && <SettingsScreen />}
      <nav className="ft-nav">
        {navItems.map(n => (
          <button key={n.id} className={`ft-nav-btn${tab===n.id?' active':''}`} onClick={() => setTab(n.id)}>
            {n.icon}
            {n.label}
          </button>
        ))}
      </nav>
    </div>
  )
}
