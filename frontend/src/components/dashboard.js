// import { signOut } from "firebase/auth";
// import { auth } from "../firebase";

// function Dashboard() {
//   const handleLogout = async () => {
//     await signOut(auth);
//   };

//   return (
//     <div>
//       <h1>Dashboard</h1>
//       <p>You are logged in 🎉</p>
//       <button onClick={handleLogout}>Logout</button>
//     </div>
//   );
// }

// export default Dashboard;

//working code but not good output. 
// import { useEffect, useState } from "react";
// import { signOut } from "firebase/auth";
// import { auth } from "../firebase";

// function Dashboard() {
//   const [history, setHistory] = useState([]);
//   const [videoId, setVideoId] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [analysis, setAnalysis] = useState(null);

//   const API_URL = "http://127.0.0.1:8000";

//   // 🔥 Fetch history
//   const fetchHistory = async () => {
//     try {
//       const token = localStorage.getItem("token");

//       const res = await fetch(`${API_URL}/history`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       const data = await res.json();
//       if (!res.ok) throw new Error(data.detail);

//       setHistory(data);
//     } catch (err) {
//       setError(err.message);
//     }
//   };

//   // 🔥 Analyze new video
//   const analyzeVideo = async () => {
//     if (!videoId.trim()) return alert("Enter video ID");

//     setLoading(true);
//     setError("");
//     setAnalysis(null);

//     try {
//       const token = localStorage.getItem("token");

//       const res = await fetch(`${API_URL}/analyze`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({ video_id: videoId }),
//       });

//       const data = await res.json();
//       if (!res.ok) throw new Error(data.detail);

//       setAnalysis(data);
//       fetchHistory();
//       setVideoId("");
//     } catch (err) {
//       setError(err.message);
//     }

//     setLoading(false);
//   };

//   // 🔥 Load analysis from history (uses backend cache)
//   const loadAnalysis = async (video_id) => {
//     setLoading(true);
//     setError("");

//     try {
//       const token = localStorage.getItem("token");

//       const res = await fetch(`${API_URL}/analyze`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({ video_id }),
//       });

//       const data = await res.json();
//       if (!res.ok) throw new Error(data.detail);

//       setAnalysis(data);
//     } catch (err) {
//       setError(err.message);
//     }

//     setLoading(false);
//   };

//   // 🔐 Logout
//   const handleLogout = async () => {
//     await signOut(auth);
//     localStorage.removeItem("token");
//     window.location.reload();
//   };

//   useEffect(() => {
//     fetchHistory();
//   }, []);

//   return (
//     <div style={{ padding: "20px", maxWidth: "900px", margin: "auto" }}>
//       <h1>📊 Dashboard</h1>

//       {/* ❌ ERROR */}
//       {error && <p style={{ color: "red" }}>⚠️ {error}</p>}

//       {/* INPUT */}
//       <div style={{ marginBottom: "10px" }}>
//         <input
//           placeholder="Enter YouTube Video ID"
//           value={videoId}
//           onChange={(e) => setVideoId(e.target.value)}
//         />
//         <button onClick={analyzeVideo} disabled={loading}>
//           {loading ? "Analyzing..." : "Analyze"}
//         </button>
//         <button onClick={handleLogout}>Logout</button>
//       </div>

//       <hr />

//       {/* 📜 HISTORY */}
//       <h2>📜 Your Videos</h2>
//       {history.length === 0 ? (
//         <p>No videos yet</p>
//       ) : (
//         <ul>
//           {history.map((item, idx) => (
//             <li key={idx} style={{ cursor: "pointer", marginBottom: "5px" }}>
//               <span onClick={() => loadAnalysis(item.video_id)}>
//                 <b>{item.title || item.video_id}</b>
//               </span>
//             </li>
//           ))}
//         </ul>
//       )}

//       <hr />

//       {/* 🔥 ANALYSIS */}
//       {analysis && (
//         <div>
//           <h2>📊 Analysis Result</h2>

//           {/* METRICS */}
//           <h3>📈 Metrics</h3>
//           <p>Video Sentiment: {analysis.metrics?.video_sentiment}</p>
//           <p>Comments Sentiment: {analysis.metrics?.comments_sentiment}</p>

//           {/* DISTRIBUTION */}
//           <h3>📊 Distribution</h3>
//           <p>Positive: {analysis.distribution?.positive}</p>
//           <p>Neutral: {analysis.distribution?.neutral}</p>
//           <p>Negative: {analysis.distribution?.negative}</p>

//           {/* TOP SEGMENTS */}
//           <h3>🔥 Top Viral Segments</h3>
//           <ul>
//             {analysis.top_segments?.map((seg, i) => (
//               <li key={i}>
//                 <b>Score:</b> {seg.virality_score} <br />
//                 <small>{seg.text?.slice(0, 100)}...</small>
//               </li>
//             ))}
//           </ul>

//           {/* ✅ FIXED INSIGHT */}
//           <h3>🧠 AI Insight</h3>
//           <p><b>Summary:</b> {analysis.insight?.video_summary}</p>
//           <p><b>Audience Reaction:</b> {analysis.insight?.audience_reaction}</p>
//           <p><b>Agreement:</b> {analysis.insight?.agreement}</p>
//           <p><b>Reason:</b> {analysis.insight?.reason}</p>
//           <p><b>Sentiment Strength:</b> {analysis.insight?.sentiment_strength}</p>

//           {/* COMMENTS */}
//           <h3>💬 Sample Comments</h3>
//           <ul>
//             {analysis.comments_sample?.map((c, i) => (
//               <li key={i}>
//                 {c.text} <br />
//                 <small>Sentiment: {c.sentiment_score}</small>
//               </li>
//             ))}
//           </ul>

//           {/* 🔥 TIMELINE */}
//           <h3>📈 Sentiment Timeline</h3>
//           <div style={{ maxHeight: "300px", overflowY: "scroll" }}>
//             {analysis.timeline_data?.map((point, i) => (
//               <div
//                 key={i}
//                 style={{
//                   borderBottom: "1px solid #ccc",
//                   padding: "5px"
//                 }}
//               >
//                 <b>Time:</b> {point.start || i}s <br />
//                 <b>Sentiment:</b> {point.sentiment_score} <br />
//                 <small>{point.text?.slice(0, 80)}...</small>
//               </div>
//             ))}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default Dashboard;



// import { useEffect, useState } from "react";
// import { signOut } from "firebase/auth";
// import { auth } from "../firebase";

// function Dashboard() {
//   const [history, setHistory] = useState([]);
//   const [videoId, setVideoId] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [analysis, setAnalysis] = useState(null);

//   const API_URL = "http://127.0.0.1:8000";

//   const fetchHistory = async () => {
//     try {
//       const token = localStorage.getItem("token");

//       const res = await fetch(`${API_URL}/history`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       const data = await res.json();
//       if (!res.ok) throw new Error(data.detail);

//       setHistory(data);
//     } catch (err) {
//       setError(err.message);
//     }
//   };

//   const analyzeVideo = async () => {
//     if (!videoId.trim()) return alert("Enter video ID");

//     setLoading(true);
//     setError("");
//     setAnalysis(null);

//     try {
//       const token = localStorage.getItem("token");

//       const res = await fetch(`${API_URL}/analyze`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({ video_id: videoId }),
//       });

//       const data = await res.json();
//       if (!res.ok) throw new Error(data.detail);

//       setAnalysis(data);
//       fetchHistory();
//       setVideoId("");
//     } catch (err) {
//       setError(err.message);
//     }

//     setLoading(false);
//   };

//   const loadAnalysis = async (video_id) => {
//     setLoading(true);
//     setError("");

//     try {
//       const token = localStorage.getItem("token");

//       const res = await fetch(`${API_URL}/analyze`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({ video_id }),
//       });

//       const data = await res.json();
//       if (!res.ok) throw new Error(data.detail);

//       setAnalysis(data);
//     } catch (err) {
//       setError(err.message);
//     }

//     setLoading(false);
//   };

//   const handleLogout = async () => {
//     await signOut(auth);
//     localStorage.removeItem("token");
//     window.location.reload();
//   };

//   useEffect(() => {
//     fetchHistory();
//   }, []);

//   return (
//     <div style={{ padding: "20px", maxWidth: "900px", margin: "auto" }}>
//       <h1>📊 Dashboard</h1>

//       {error && <p style={{ color: "red" }}>⚠️ {error}</p>}

//       <div style={{ marginBottom: "10px" }}>
//         <input
//           placeholder="Enter YouTube Video ID"
//           value={videoId}
//           onChange={(e) => setVideoId(e.target.value)}
//         />
//         <button onClick={analyzeVideo} disabled={loading}>
//           {loading ? "Analyzing..." : "Analyze"}
//         </button>
//         <button onClick={handleLogout}>Logout</button>
//       </div>

//       <hr />

//       {/* HISTORY */}
//       <h2> Your Videos</h2>
//       {history.length === 0 ? (
//         <p>No videos yet</p>
//       ) : (
//         <ul>
//           {history.map((item, idx) => (
//             <li key={idx} style={{ cursor: "pointer" }}>
//               <span onClick={() => loadAnalysis(item.video_id)}>
//                 <b>{item.title || item.video_id}</b>
//               </span>
//             </li>
//           ))}
//         </ul>
//       )}

//       <hr />

//       {/* 🔥 ANALYSIS */}
//       {analysis && (
//         <div>
//           <h2> Analysis Result</h2>

//           {/* METRICS */}
//           <h3> Metrics</h3>
//           <p>Video Sentiment: {analysis.metrics?.video_sentiment?.toFixed(2)}</p>
//           <p>Comments Sentiment: {analysis.metrics?.comments_sentiment?.toFixed(2)}</p>

//           {/* DISTRIBUTION */}
//           <h3> Distribution</h3>
//           <p>Positive: {analysis.distribution?.positive?.toFixed(2)}</p>
//           <p>Neutral: {analysis.distribution?.neutral?.toFixed(2)}</p>
//           <p>Negative: {analysis.distribution?.negative?.toFixed(2)}</p>

//           {/* 🔥 TOP MOMENTS (FIXED) */}
//           <h3> Top Viral Moments</h3>
//           <ul>
//             {analysis.top_moments?.map((m, i) => (
//               <li key={i}>
//                  <b>{m.start.toFixed(1)}s → {m.end.toFixed(1)}s</b> <br />
//                  Score: {m.score}
//               </li>
//             ))}
//           </ul>

//           {/* INSIGHT */}
//           <h3>🧠 AI Insight</h3>
//           <p><b>Summary:</b> {analysis.insight?.video_summary}</p>
//           <p><b>Audience Reaction:</b> {analysis.insight?.audience_reaction}</p>
//           <p><b>Agreement:</b> {analysis.insight?.agreement}</p>
//           <p><b>Reason:</b> {analysis.insight?.reason}</p>
//           <p><b>Sentiment Strength:</b> {analysis.insight?.sentiment_strength}</p>

//           {/* COMMENTS */}
//           <h3> Sample Comments</h3>
//           <ul>
//             {analysis.comments_sample?.map((c, i) => (
//               <li key={i}>
//                 {c.text} <br />
//                 <small>Sentiment: {c.sentiment_score}</small>
//               </li>
//             ))}
//           </ul>

//           {/* 🔥 TIMELINE (CLEAN) */}
//           <h3>Sentiment Timeline</h3>
//           <div style={{ maxHeight: "300px", overflowY: "scroll" }}>
//             {analysis.timeline_data?.map((point, i) => (
//               <div key={i} style={{ borderBottom: "1px solid #ccc", padding: "5px" }}>
//                  {point.start.toFixed(1)}s | 
//                  Sentiment: {point.sentiment_score.toFixed(2)} | 
//                 Virality: {point.virality_score.toFixed(2)}
//               </div>
//             ))}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default Dashboard;



// import { useEffect, useState, useRef, useCallback } from "react";
// import { signOut } from "firebase/auth";
// import { auth } from "../firebase";

// const API_URL = "http://127.0.0.1:8000";

// const C = {
//   bg: "#080a0f",
//   surface: "#0e1118",
//   card: "#141720",
//   cardHover: "#1a1f2e",
//   border: "#1e2330",
//   borderLight: "#252d3d",
//   accent: "#00e5ff",
//   accentDim: "rgba(0,229,255,0.10)",
//   accentGlow: "rgba(0,229,255,0.25)",
//   green: "#00e676",
//   greenDim: "rgba(0,230,118,0.12)",
//   red: "#ff4f6b",
//   redDim: "rgba(255,79,107,0.12)",
//   yellow: "#ffc947",
//   yellowDim: "rgba(255,201,71,0.12)",
//   purple: "#b388ff",
//   muted: "#3d4559",
//   text: "#dde3f0",
//   textSub: "#7b8aaa",
// };

// const font = `'JetBrains Mono', 'Fira Mono', monospace`;
// const fontSans = `'Outfit', 'Segoe UI', sans-serif`;

// const injectFonts = () => {
//   if (document.getElementById("vi-fonts")) return;
//   const l = document.createElement("link");
//   l.id = "vi-fonts";
//   l.rel = "stylesheet";
//   l.href = "https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap";
//   document.head.appendChild(l);
// };

// const fmt = (n, d = 2) => (typeof n === "number" ? n.toFixed(d) : "—");
// const sentColor = (v) => (v > 0.1 ? C.green : v < -0.1 ? C.red : C.yellow);
// const sentBg = (v) => (v > 0.1 ? C.greenDim : v < -0.1 ? C.redDim : C.yellowDim);
// const pct = (v) => `${(v * 100).toFixed(0)}%`;
// const fmtTs = (iso) => {
//   if (!iso) return "—";
//   const d = new Date(iso);
//   return isNaN(d) ? iso : d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
// };

// // ─── shared primitives ────────────────────────────────────────────────────────
// function Card({ children, style = {}, hover = false }) {
//   const [hov, setHov] = useState(false);
//   return (
//     <div
//       onMouseEnter={() => hover && setHov(true)}
//       onMouseLeave={() => hover && setHov(false)}
//       style={{
//         background: hov ? C.cardHover : C.card,
//         border: `1px solid ${hov ? C.borderLight : C.border}`,
//         borderRadius: 14, padding: "20px 24px",
//         transition: "background .2s, border-color .2s",
//         ...style,
//       }}
//     >
//       {children}
//     </div>
//   );
// }

// function Label({ children }) {
//   return (
//     <p style={{
//       fontFamily: fontSans, fontSize: 10, fontWeight: 700,
//       letterSpacing: "0.16em", textTransform: "uppercase",
//       color: C.accent, margin: "0 0 14px",
//     }}>{children}</p>
//   );
// }

// function Btn({ children, onClick, variant = "primary", disabled, style = {} }) {
//   const [hov, setHov] = useState(false);
//   const base = {
//     fontFamily: fontSans, fontSize: 13, fontWeight: 600,
//     border: "none", borderRadius: 10, cursor: disabled ? "not-allowed" : "pointer",
//     padding: "9px 20px", transition: "all .15s", opacity: disabled ? 0.45 : 1,
//     display: "inline-flex", alignItems: "center", gap: 6,
//     ...style,
//   };
//   const vs = {
//     primary: { background: hov ? "#00c8e0" : C.accent, color: "#000" },
//     ghost: { background: hov ? C.border : "transparent", color: C.textSub, border: `1px solid ${C.border}` },
//     danger: { background: hov ? "rgba(255,79,107,.25)" : C.redDim, color: C.red, border: `1px solid rgba(255,79,107,.35)` },
//     outline: { background: hov ? "rgba(0,229,255,.18)" : C.accentDim, color: C.accent, border: `1px solid rgba(0,229,255,.28)` },
//   };
//   return (
//     <button onClick={onClick} disabled={disabled}
//       onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
//       style={{ ...base, ...vs[variant] }}>
//       {children}
//     </button>
//   );
// }

// function MiniBar({ label, value, color, bgColor }) {
//   const w = Math.min(100, Math.abs(value) * 100);
//   return (
//     <div style={{ marginBottom: 12 }}>
//       <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
//         <span style={{ fontFamily: fontSans, fontSize: 12, color: C.textSub }}>{label}</span>
//         <span style={{ fontFamily: font, fontSize: 12, color }}>{pct(value)}</span>
//       </div>
//       <div style={{ height: 7, background: C.border, borderRadius: 4, overflow: "hidden" }}>
//         <div style={{
//           width: `${w}%`, height: "100%", background: color,
//           borderRadius: 4, transition: "width .7s cubic-bezier(.16,1,.3,1)",
//           boxShadow: `0 0 8px ${color}88`,
//         }} />
//       </div>
//     </div>
//   );
// }

// // ─── INTERACTIVE CHART ────────────────────────────────────────────────────────
// // Matches the reference: solid axis lines, full numeric grid, key-moment dots,
// // clean legend box, and a crisp hover crosshair + tooltip.
// function InteractiveChart({
//   data,
//   series,
//   title,
//   xKey = "start",
//   xLabel = "Time (seconds)",
//   yLabel = null,
//   height = 320,
//   keyMoments = [],
// }) {
//   // ── ALL hooks first — before any conditional return ───────────────────────
//   const [tooltip, setTooltip] = useState(null);
//   const svgRef = useRef(null);

//   // ── layout constants (stable, not dependent on data) ─────────────────────
//   const PAD = { top: 36, right: 32, bottom: 58, left: 66 };
//   const W = 860;
//   const CW = W - PAD.left - PAD.right;

//   // ── mouse handler — defined unconditionally ───────────────────────────────
//   const handleMouseMove = useCallback((e) => {
//     if (!svgRef.current || !data || data.length < 2) return;
//     const rect = svgRef.current.getBoundingClientRect();
//     const mx = ((e.clientX - rect.left) / rect.width) * W;
//     const xVals = data.map((d) => d[xKey] ?? 0);
//     const xMin = Math.min(...xVals);
//     const xMax = Math.max(...xVals) || 1;
//     const xPos = (v) => PAD.left + ((v - xMin) / (xMax - xMin)) * CW;
//     let best = 0, bestDist = Infinity;
//     data.forEach((d, i) => {
//       const dist = Math.abs(xPos(d[xKey] ?? 0) - mx);
//       if (dist < bestDist) { bestDist = dist; best = i; }
//     });
//     const threshold = (CW / Math.max(data.length - 1, 1)) * 1.8;
//     setTooltip(bestDist < threshold ? { idx: best } : null);
//   }, [data, xKey, CW, W]);

//   // ── early return AFTER all hooks ──────────────────────────────────────────
//   if (!data || data.length < 2) {
//     return (
//       <div style={{ height, display: "flex", alignItems: "center", justifyContent: "center", color: C.muted, fontFamily: fontSans, fontSize: 13 }}>
//         Not enough data to render chart
//       </div>
//     );
//   }

//   // ── derived values (safe — we're past the early return) ───────────────────
//   const H = height;
//   const CH = H - PAD.top - PAD.bottom;

//   const xVals = data.map((d) => d[xKey] ?? 0);
//   const xMin = Math.min(...xVals);
//   const xMax = Math.max(...xVals) || 1;

//   const allY = series.flatMap((s) => data.map((d) => d[s.key] ?? 0));
//   const yRaw = { min: Math.min(...allY), max: Math.max(...allY) };
//   const yPad = (yRaw.max - yRaw.min) * 0.15 || 0.1;
//   const yMin = yRaw.min - yPad;
//   const yMax = yRaw.max + yPad;

//   const xPos = (v) => PAD.left + ((v - xMin) / (xMax - xMin)) * CW;
//   const yPos = (v) => PAD.top + CH - ((v - yMin) / (yMax - yMin)) * CH;

//   // ── nice tick generator ───────────────────────────────────────────────────
//   const niceStep = (range, steps) => {
//     if (range === 0) return 1;
//     const rough = range / steps;
//     const mag = Math.pow(10, Math.floor(Math.log10(Math.abs(rough))));
//     return ([1, 2, 2.5, 5, 10].find((m) => m * mag >= rough) ?? 10) * mag;
//   };

//   const makeTicks = (lo, hi, steps) => {
//     const step = niceStep(hi - lo, steps);
//     const start = Math.ceil((lo - 1e-9) / step) * step;
//     const ticks = [];
//     for (let t = start; t <= hi + 1e-9; t = +(t + step).toFixed(12))
//       ticks.push(+t.toFixed(8));
//     return ticks;
//   };

//   const yTicks = makeTicks(yMin, yMax, 6);
//   const xTicks = makeTicks(xMin, xMax, 8);

//   // ── path builders ─────────────────────────────────────────────────────────
//   const buildLine = (key) =>
//     data.map((d, i) => {
//       const x = xPos(d[xKey] ?? 0), y = yPos(d[key] ?? 0);
//       return i === 0 ? `M${x},${y}` : `L${x},${y}`;
//     }).join(" ");

//   const buildArea = (key) => {
//     const line = buildLine(key);
//     const base = yPos(Math.max(yMin, Math.min(0, yMax)));
//     return `${line} L${xPos(xVals[xVals.length - 1])},${base} L${xPos(xVals[0])},${base} Z`;
//   };

//   const tp = tooltip !== null ? data[tooltip.idx] : null;

//   // ── tick label formatter ──────────────────────────────────────────────────
//   const fmtTick = (v, isY) => {
//     if (Math.abs(v) >= 1000) return (v / 1000).toFixed(1) + "k";
//     if (isY && Math.abs(v) < 1 && v !== 0) return v.toFixed(2);
//     return v % 1 === 0 ? v.toString() : v.toFixed(1);
//   };

//   // ── first-series key moments (mapped to x midpoint of each moment) ────────
//   const kmPoints = keyMoments
//     .filter((m) => m.start != null)
//     .map((m) => {
//       const mid = ((m.start ?? 0) + (m.end ?? m.start ?? 0)) / 2;
//       if (mid < xMin || mid > xMax) return null;
//       // Find closest data point to map to real y value
//       let closest = data[0];
//       let minD = Infinity;
//       data.forEach((d) => {
//         const d2 = Math.abs((d[xKey] ?? 0) - mid);
//         if (d2 < minD) { minD = d2; closest = d; }
//       });
//       return { x: xPos(mid), y: yPos(closest[series[0].key] ?? 0) };
//     })
//     .filter(Boolean);

//   return (
//     <div style={{ position: "relative", userSelect: "none" }}>
//       {title && (
//         <p style={{
//           fontFamily: fontSans, fontSize: 13, fontWeight: 600,
//           color: C.text, margin: "0 0 14px",
//           textAlign: "center", letterSpacing: "0.02em",
//         }}>
//           {title}
//         </p>
//       )}

//       <svg
//         ref={svgRef}
//         viewBox={`0 0 ${W} ${H}`}
//         style={{ width: "100%", height, display: "block", cursor: "crosshair" }}
//         onMouseMove={handleMouseMove}
//         onMouseLeave={() => setTooltip(null)}
//       >
//         <defs>
//           {series.map((s) => (
//             <linearGradient key={s.key} id={`ic-grad-${s.key}`} x1="0" y1="0" x2="0" y2="1">
//               <stop offset="0%" stopColor={s.color} stopOpacity="0.18" />
//               <stop offset="100%" stopColor={s.color} stopOpacity="0" />
//             </linearGradient>
//           ))}
//           <clipPath id="ic-clip">
//             <rect x={PAD.left} y={PAD.top} width={CW} height={CH} />
//           </clipPath>
//         </defs>

//         {/* ── chart background ── */}
//         <rect x={PAD.left} y={PAD.top} width={CW} height={CH}
//           fill="#0a0d14" rx="2" />

//         {/* ── Y grid + ticks + labels ── */}
//         {yTicks.map((t) => {
//           const y = yPos(t);
//           if (y < PAD.top - 1 || y > PAD.top + CH + 1) return null;
//           return (
//             <g key={`y-${t}`}>
//               {/* grid line */}
//               <line x1={PAD.left} y1={y} x2={PAD.left + CW} y2={y}
//                 stroke="#1e2638" strokeWidth="1" />
//               {/* tick mark */}
//               <line x1={PAD.left - 5} y1={y} x2={PAD.left} y2={y}
//                 stroke="#4a5568" strokeWidth="1.5" />
//               {/* label */}
//               <text x={PAD.left - 10} y={y + 4}
//                 textAnchor="end" fill="#8896b3"
//                 fontSize="12" fontFamily={font}>
//                 {fmtTick(t, true)}
//               </text>
//             </g>
//           );
//         })}

//         {/* ── X grid + ticks + labels ── */}
//         {xTicks.map((t) => {
//           const x = xPos(t);
//           if (x < PAD.left - 1 || x > PAD.left + CW + 1) return null;
//           return (
//             <g key={`x-${t}`}>
//               <line x1={x} y1={PAD.top} x2={x} y2={PAD.top + CH}
//                 stroke="#1e2638" strokeWidth="1" />
//               <line x1={x} y1={PAD.top + CH} x2={x} y2={PAD.top + CH + 5}
//                 stroke="#4a5568" strokeWidth="1.5" />
//               <text x={x} y={PAD.top + CH + 20}
//                 textAnchor="middle" fill="#8896b3"
//                 fontSize="12" fontFamily={font}>
//                 {fmtTick(t, false)}
//               </text>
//             </g>
//           );
//         })}

//         {/* ── Axis spine lines (solid, prominent) ── */}
//         {/* Y axis */}
//         <line x1={PAD.left} y1={PAD.top} x2={PAD.left} y2={PAD.top + CH}
//           stroke="#5a6880" strokeWidth="2" />
//         {/* X axis */}
//         <line x1={PAD.left} y1={PAD.top + CH} x2={PAD.left + CW} y2={PAD.top + CH}
//           stroke="#5a6880" strokeWidth="2" />
//         {/* Top border */}
//         <line x1={PAD.left} y1={PAD.top} x2={PAD.left + CW} y2={PAD.top}
//           stroke="#1e2638" strokeWidth="1" />
//         {/* Right border */}
//         <line x1={PAD.left + CW} y1={PAD.top} x2={PAD.left + CW} y2={PAD.top + CH}
//           stroke="#1e2638" strokeWidth="1" />

//         {/* ── Zero line (when range spans 0) ── */}
//         {yMin < 0 && yMax > 0 && (
//           <line x1={PAD.left} y1={yPos(0)} x2={PAD.left + CW} y2={yPos(0)}
//             stroke="#3a4558" strokeWidth="1.5" strokeDasharray="6,4" />
//         )}

//         {/* ── Axis titles ── */}
//         <text x={PAD.left + CW / 2} y={H - 6}
//           textAnchor="middle" fill="#8896b3"
//           fontSize="13" fontFamily={fontSans} fontWeight="600">
//           {xLabel}
//         </text>
//         <text
//           transform={`translate(14, ${PAD.top + CH / 2}) rotate(-90)`}
//           textAnchor="middle" fill="#8896b3"
//           fontSize="13" fontFamily={fontSans} fontWeight="600">
//           {yLabel ?? (series.length === 1 ? series[0].label : "Score")}
//         </text>

//         {/* ── Data: area fill + line ── */}
//         <g clipPath="url(#ic-clip)">
//           {series.map((s) => (
//             <path key={`a-${s.key}`} d={buildArea(s.key)}
//               fill={`url(#ic-grad-${s.key})`} />
//           ))}
//           {series.map((s) => (
//             <path key={`l-${s.key}`} d={buildLine(s.key)}
//               fill="none" stroke={s.color} strokeWidth="2.5"
//               strokeLinejoin="round" strokeLinecap="round" />
//           ))}

//           {/* ── Key moment dots (like the red circles in reference) ── */}
//           {kmPoints.map((pt, i) => (
//             <g key={`km-${i}`}>
//               <circle cx={pt.x} cy={pt.y} r="8"
//                 fill="#ff4f6b" stroke="#ff4f6b" strokeWidth="0" opacity="0.15" />
//               <circle cx={pt.x} cy={pt.y} r="5.5"
//                 fill="#ff4f6b" stroke="#fff" strokeWidth="1.5" />
//             </g>
//           ))}
//         </g>

//         {/* ── Hover crosshair ── */}
//         {tp && (
//           <>
//             <line x1={xPos(tp[xKey] ?? 0)} y1={PAD.top}
//               x2={xPos(tp[xKey] ?? 0)} y2={PAD.top + CH}
//               stroke="#5a6880" strokeWidth="1" strokeDasharray="4,3" />
//             <line x1={PAD.left} y1={yPos(series[0] ? (tp[series[0].key] ?? 0) : 0)}
//               x2={PAD.left + CW} y2={yPos(series[0] ? (tp[series[0].key] ?? 0) : 0)}
//               stroke="#5a6880" strokeWidth="1" strokeDasharray="4,3" />
//           </>
//         )}

//         {/* ── Hover data dots ── */}
//         {tp && series.map((s) => (
//           <circle key={`hd-${s.key}`}
//             cx={xPos(tp[xKey] ?? 0)} cy={yPos(tp[s.key] ?? 0)}
//             r="6" fill={s.color} stroke={C.bg} strokeWidth="2.5" />
//         ))}

//         {/* ── Legend box (top-left inside chart area, like the reference) ── */}
//         {series.length >= 1 && (() => {
//           const items = [
//             ...series.map((s) => ({ color: s.color, label: s.label, dot: false })),
//             ...(kmPoints.length > 0 ? [{ color: "#ff4f6b", label: "Key Moments", dot: true }] : []),
//           ];
//           const bx = PAD.left + 12, by = PAD.top + 10;
//           const bw = 150, bh = items.length * 20 + 14;
//           return (
//             <g>
//               <rect x={bx} y={by} width={bw} height={bh}
//                 fill="#0e1320" stroke="#1e2638" strokeWidth="1" rx="6" />
//               {items.map((it, i) => (
//                 <g key={i} transform={`translate(${bx + 12}, ${by + 10 + i * 20})`}>
//                   {it.dot
//                     ? <circle cx="7" cy="4" r="5" fill={it.color} stroke="#fff" strokeWidth="1" />
//                     : <>
//                         <line x1="0" y1="4" x2="14" y2="4" stroke={it.color} strokeWidth="2.5" strokeLinecap="round" />
//                         <circle cx="7" cy="4" r="2.5" fill={it.color} />
//                       </>
//                   }
//                   <text x="20" y="8.5" fill="#a0aec0" fontSize="11" fontFamily={fontSans}>{it.label}</text>
//                 </g>
//               ))}
//             </g>
//           );
//         })()}
//       </svg>

//       {/* ── Tooltip popup ── */}
//       {tp && (() => {
//         const pctX = (xPos(tp[xKey] ?? 0) / W) * 100;
//         return (
//           <div style={{
//             position: "absolute",
//             top: PAD.top + 4,
//             left: `clamp(4px, calc(${pctX}% + 10px), calc(100% - 170px))`,
//             background: "#0e1320",
//             border: `1px solid #252d3d`,
//             borderRadius: 10,
//             padding: "10px 14px",
//             pointerEvents: "none",
//             zIndex: 20,
//             minWidth: 155,
//             boxShadow: "0 8px 32px rgba(0,0,0,.7)",
//           }}>
//             <p style={{ fontFamily: font, fontSize: 11, color: "#8896b3", margin: "0 0 8px", borderBottom: "1px solid #1e2638", paddingBottom: 6 }}>
//               {xLabel.toLowerCase().includes("index") ? `#${Math.round(tp[xKey])}` : `t = ${fmt(tp[xKey], 1)} s`}
//             </p>
//             {series.map((s) => (
//               <div key={s.key} style={{ display: "flex", justifyContent: "space-between", gap: 18, marginBottom: 3 }}>
//                 <span style={{ fontFamily: fontSans, fontSize: 11, color: "#8896b3" }}>{s.label}</span>
//                 <span style={{ fontFamily: font, fontSize: 12, color: s.color, fontWeight: 600 }}>
//                   {fmt(tp[s.key])}
//                 </span>
//               </div>
//             ))}
//           </div>
//         );
//       })()}
//     </div>
//   );
// }

// // ─── TIMELINE PAGE ────────────────────────────────────────────────────────────
// function TimelinePage({ analysis, onBack }) {
//   const data = analysis?.timeline_data ?? [];

//   return (
//     <div style={{ minHeight: "100vh", background: C.bg, paddingBottom: 60 }}>
//       <div style={{ maxWidth: 980, margin: "0 auto", padding: "28px 24px" }}>
//         <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 32 }}>
//           <Btn variant="ghost" onClick={onBack}>← Back</Btn>
//           <div>
//             <h2 style={{ fontFamily: fontSans, fontSize: 24, fontWeight: 700, color: C.text, margin: 0 }}>
//               Sentiment Timeline
//             </h2>
//             <p style={{ fontFamily: fontSans, fontSize: 13, color: C.textSub, margin: "4px 0 0" }}>
//               {data.length} segments · hover to inspect values
//             </p>
//           </div>
//         </div>

//         <Card style={{ marginBottom: 20 }}>
//           <InteractiveChart
//             data={data}
//             series={[{ key: "sentiment_score", label: "Sentiment", color: C.accent }]}
//             title="Sentiment Score over Time"
//             xKey="start"
//             xLabel="Segment Start (seconds)"
//             yLabel="Sentiment"
//             keyMoments={analysis?.top_moments ?? []}
//             height={320}
//           />
//         </Card>

//         <Card style={{ marginBottom: 20 }}>
//           <InteractiveChart
//             data={data}
//             series={[{ key: "virality_score", label: "Virality", color: C.yellow }]}
//             title="Virality Score over Time"
//             xKey="start"
//             xLabel="Segment Start (seconds)"
//             yLabel="Virality"
//             keyMoments={analysis?.top_moments ?? []}
//             height={320}
//           />
//         </Card>

//         <Card style={{ marginBottom: 20 }}>
//           <InteractiveChart
//             data={data}
//             series={[
//               { key: "sentiment_score", label: "Sentiment", color: C.accent },
//               { key: "virality_score", label: "Virality", color: C.yellow },
//             ]}
//             title="Sentiment vs Virality — Overlay"
//             xKey="start"
//             xLabel="Segment Start (seconds)"
//             height={280}
//           />
//         </Card>

//         <Card>
//           <Label>Full Data Table</Label>
//           <div style={{ overflowX: "auto" }}>
//             <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: font, fontSize: 12 }}>
//               <thead>
//                 <tr>
//                   {["#", "Start (s)", "End (s)", "Sentiment", "Virality"].map((h) => (
//                     <th key={h} style={{
//                       padding: "8px 14px", textAlign: "left",
//                       color: C.accent, fontWeight: 600, fontSize: 10,
//                       letterSpacing: "0.12em", textTransform: "uppercase",
//                       borderBottom: `1px solid ${C.border}`,
//                     }}>{h}</th>
//                   ))}
//                 </tr>
//               </thead>
//               <tbody>
//                 {data.map((pt, i) => (
//                   <tr key={i} style={{ borderBottom: `1px solid ${C.border}44` }}>
//                     <td style={{ padding: "7px 14px", color: C.muted }}>{i + 1}</td>
//                     <td style={{ padding: "7px 14px", color: C.text }}>{fmt(pt.start, 1)}</td>
//                     <td style={{ padding: "7px 14px", color: C.text }}>{fmt(pt.end, 1)}</td>
//                     <td style={{ padding: "7px 14px" }}>
//                       <span style={{
//                         color: sentColor(pt.sentiment_score),
//                         background: sentBg(pt.sentiment_score),
//                         padding: "2px 8px", borderRadius: 6, fontSize: 11,
//                       }}>
//                         {fmt(pt.sentiment_score)}
//                       </span>
//                     </td>
//                     <td style={{ padding: "7px 14px", color: C.yellow }}>{fmt(pt.virality_score)}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </Card>
//       </div>
//     </div>
//   );
// }

// // ─── COMMENTS SENTIMENT PAGE ──────────────────────────────────────────────────
// function CommentsPage({ analysis, onBack }) {
//   const dist = analysis?.distribution ?? {};
//   const comments = analysis?.comments_sample ?? [];

//   // Build bar chart data for sentiment distribution
//   const barData = [
//     { label: "Positive", sentiment_score: dist.positive ?? 0, start: 0 },
//     { label: "Neutral", sentiment_score: dist.neutral ?? 0, start: 1 },
//     { label: "Negative", sentiment_score: -(dist.negative ?? 0), start: 2 },
//   ];

//   // Build per-comment chart data (index vs sentiment)
//   const commentChartData = comments.map((c, i) => ({
//     start: i,
//     sentiment_score: typeof c.sentiment_score === "number" ? c.sentiment_score : 0,
//   }));

//   return (
//     <div style={{ minHeight: "100vh", background: C.bg, paddingBottom: 60 }}>
//       <div style={{ maxWidth: 980, margin: "0 auto", padding: "28px 24px" }}>
//         <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 32 }}>
//           <Btn variant="ghost" onClick={onBack}>← Back</Btn>
//           <div>
//             <h2 style={{ fontFamily: fontSans, fontSize: 24, fontWeight: 700, color: C.text, margin: 0 }}>
//               Comments Sentiment
//             </h2>
//             <p style={{ fontFamily: fontSans, fontSize: 13, color: C.textSub, margin: "4px 0 0" }}>
//               {comments.length} sample comments
//             </p>
//           </div>
//         </div>

//         {/* Distribution bars */}
//         <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
//           <Card>
//             <Label>Audience Distribution</Label>
//             <MiniBar label="Positive" value={dist.positive ?? 0} color={C.green} bgColor={C.greenDim} />
//             <MiniBar label="Neutral" value={dist.neutral ?? 0} color={C.yellow} bgColor={C.yellowDim} />
//             <MiniBar label="Negative" value={dist.negative ?? 0} color={C.red} bgColor={C.redDim} />
//           </Card>
//           <Card>
//             <Label>Aggregate Scores</Label>
//             {[
//               { label: "Video Sentiment", val: analysis?.metrics?.video_sentiment },
//               { label: "Comments Sentiment", val: analysis?.metrics?.comments_sentiment },
//             ].map((m) => (
//               <div key={m.label} style={{
//                 display: "flex", justifyContent: "space-between", alignItems: "center",
//                 padding: "10px 14px", background: C.surface, borderRadius: 8, marginBottom: 8,
//               }}>
//                 <span style={{ fontFamily: fontSans, fontSize: 13, color: C.textSub }}>{m.label}</span>
//                 <span style={{
//                   fontFamily: font, fontSize: 16, fontWeight: 600,
//                   color: sentColor(m.val ?? 0),
//                   background: sentBg(m.val ?? 0),
//                   padding: "3px 12px", borderRadius: 8,
//                 }}>
//                   {fmt(m.val)}
//                 </span>
//               </div>
//             ))}
//           </Card>
//         </div>

//         {/* Interactive chart of per-comment sentiment */}
//         {commentChartData.length >= 2 && (
//           <Card style={{ marginBottom: 20 }}>
//             <InteractiveChart
//               data={commentChartData}
//               series={[{ key: "sentiment_score", label: "Comment Sentiment", color: C.green }]}
//               title="Per-Comment Sentiment Score"
//               xKey="start"
//               xLabel="Comment Index"
//               height={280}
//             />
//           </Card>
//         )}

//         {/* Comments list */}
//         <Card>
//           <Label>Sample Comments</Label>
//           <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
//             {comments.length === 0 && (
//               <p style={{ color: C.muted, fontSize: 13, fontFamily: fontSans }}>No comments available</p>
//             )}
//             {comments.map((c, i) => (
//               <div key={i} style={{
//                 background: C.surface,
//                 borderRadius: 10,
//                 padding: "12px 16px",
//                 borderLeft: `3px solid ${sentColor(c.sentiment_score)}`,
//                 display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12,
//               }}>
//                 <p style={{ fontFamily: fontSans, fontSize: 13, color: C.text, margin: 0, lineHeight: 1.5, flex: 1 }}>
//                   {c.text}
//                 </p>
//                 <span style={{
//                   fontFamily: font, fontSize: 12, fontWeight: 600,
//                   color: sentColor(c.sentiment_score),
//                   background: sentBg(c.sentiment_score),
//                   padding: "3px 10px", borderRadius: 6, whiteSpace: "nowrap",
//                 }}>
//                   {fmt(c.sentiment_score)}
//                 </span>
//               </div>
//             ))}
//           </div>
//         </Card>
//       </div>
//     </div>
//   );
// }

// // ─── PROFILE PAGE ─────────────────────────────────────────────────────────────
// function ProfilePage({ user, history, onBack, onLogout }) {
//   const sentScores = history.map((h) => h.metrics?.video_sentiment).filter((v) => typeof v === "number");
//   const avgSent = sentScores.length ? sentScores.reduce((a, b) => a + b, 0) / sentScores.length : null;

//   return (
//     <div style={{ minHeight: "100vh", background: C.bg, paddingBottom: 60 }}>
//       <div style={{ maxWidth: 720, margin: "0 auto", padding: "28px 24px" }}>
//         <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 32 }}>
//           <Btn variant="ghost" onClick={onBack}>← Back</Btn>
//           <h2 style={{ fontFamily: fontSans, fontSize: 24, fontWeight: 700, color: C.text, margin: 0 }}>Profile</h2>
//         </div>

//         <Card style={{ display: "flex", alignItems: "center", gap: 22, marginBottom: 18 }}>
//           <div style={{
//             width: 68, height: 68, borderRadius: "50%", flexShrink: 0,
//             background: `linear-gradient(135deg, ${C.accent} 0%, #7c3aed 100%)`,
//             display: "flex", alignItems: "center", justifyContent: "center",
//             fontSize: 28, fontWeight: 800, color: "#000", fontFamily: fontSans,
//             boxShadow: `0 0 24px ${C.accentGlow}`,
//           }}>
//             {user?.email?.[0]?.toUpperCase() ?? "U"}
//           </div>
//           <div>
//             <p style={{ fontFamily: fontSans, fontSize: 19, fontWeight: 700, color: C.text, margin: "0 0 4px" }}>
//               {user?.displayName ?? "User"}
//             </p>
//             <p style={{ fontFamily: font, fontSize: 12, color: C.textSub, margin: 0 }}>{user?.email}</p>
//             {user?.metadata?.creationTime && (
//               <p style={{ fontFamily: font, fontSize: 11, color: C.muted, margin: "5px 0 0" }}>
//                 Joined {fmtTs(user.metadata.creationTime)}
//               </p>
//             )}
//           </div>
//         </Card>

//         <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 18 }}>
//           {[
//             { label: "Videos Analyzed", val: history.length, color: C.accent },
//             { label: "Avg Sentiment", val: avgSent !== null ? fmt(avgSent) : "—", color: sentColor(avgSent ?? 0) },
//             { label: "Provider", val: user?.providerData?.[0]?.providerId ?? "email", color: C.purple },
//           ].map((s) => (
//             <Card key={s.label} style={{ textAlign: "center", padding: "18px 12px" }}>
//               <p style={{ fontFamily: font, fontSize: 24, fontWeight: 700, color: s.color, margin: "0 0 5px" }}>{s.val}</p>
//               <p style={{ fontFamily: fontSans, fontSize: 10, color: C.muted, margin: 0, textTransform: "uppercase", letterSpacing: "0.1em" }}>
//                 {s.label}
//               </p>
//             </Card>
//           ))}
//         </div>

//         <Card style={{ marginBottom: 18 }}>
//           <Label>Analysis History</Label>
//           {history.length === 0 && <p style={{ color: C.muted, fontSize: 13, fontFamily: fontSans }}>No analyses yet</p>}
//           <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
//             {history.map((item, i) => (
//               <div key={i} style={{
//                 background: C.surface, borderRadius: 9, padding: "10px 16px",
//                 display: "flex", justifyContent: "space-between", alignItems: "center",
//               }}>
//                 <div>
//                   <p style={{ fontFamily: fontSans, fontSize: 13, fontWeight: 600, color: C.text, margin: "0 0 2px" }}>
//                     {item.title || item.video_id}
//                   </p>
//                   <p style={{ fontFamily: font, fontSize: 11, color: C.muted, margin: 0 }}>
//                     {fmtTs(item.created_at || item.timestamp)}
//                   </p>
//                 </div>
//                 {typeof item.metrics?.video_sentiment === "number" && (
//                   <span style={{
//                     fontFamily: font, fontSize: 12, fontWeight: 600,
//                     color: sentColor(item.metrics.video_sentiment),
//                     background: sentBg(item.metrics.video_sentiment),
//                     padding: "3px 11px", borderRadius: 7,
//                   }}>
//                     {fmt(item.metrics.video_sentiment)}
//                   </span>
//                 )}
//               </div>
//             ))}
//           </div>
//         </Card>
//         <Btn variant="danger" onClick={onLogout}>Sign Out</Btn>
//       </div>
//     </div>
//   );
// }

// // ─── VIRALITY PANEL — top 3 timestamps ranked by virality_score ───────────────
// function ViralityPanel({ analysis }) {
//   const raw = analysis?.top_moments ?? [];

//   // Sort descending by virality_score, take top 3
//   const moments = [...raw]
//     .sort((a, b) => (b.virality_score ?? 0) - (a.virality_score ?? 0))
//     .slice(0, 3);

//   const RANK_COLORS = [C.yellow, C.accent, C.purple];
//   const RANK_LABELS = ["#1 Highest", "#2 Second", "#3 Third"];
//   const RANK_ICONS = ["🥇", "🥈", "🥉"];

//   // Score bar max = first item's score
//   const maxScore = moments[0]?.virality_score ?? 1;

//   return (
//     <Card>
//       <Label>Top 3 Viral Moments — by Virality Score</Label>
//       {moments.length === 0 && (
//         <p style={{ color: C.muted, fontSize: 13, fontFamily: fontSans }}>No viral moments data available</p>
//       )}
//       <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
//         {moments.map((m, i) => {
//           const scoreW = maxScore > 0 ? ((m.virality_score ?? 0) / maxScore) * 100 : 0;
//           return (
//             <div key={i} style={{
//               background: C.surface,
//               border: `1px solid ${i === 0 ? C.yellow + "55" : C.border}`,
//               borderRadius: 12,
//               padding: "16px 18px",
//               position: "relative",
//               overflow: "hidden",
//             }}>
//               {/* Glow strip on left */}
//               <div style={{
//                 position: "absolute", left: 0, top: 0, bottom: 0, width: 3,
//                 background: RANK_COLORS[i],
//                 borderRadius: "12px 0 0 12px",
//               }} />

//               <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
//                 <div>
//                   <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 5 }}>
//                     <span style={{ fontSize: 18 }}>{RANK_ICONS[i]}</span>
//                     <span style={{
//                       fontFamily: fontSans, fontSize: 10, fontWeight: 700,
//                       color: RANK_COLORS[i], textTransform: "uppercase", letterSpacing: "0.12em",
//                     }}>
//                       {RANK_LABELS[i]}
//                     </span>
//                   </div>
//                   <p style={{ fontFamily: font, fontSize: 15, fontWeight: 600, color: C.text, margin: 0 }}>
//                     {fmt(m.start, 1)}s → {fmt(m.end, 1)}s
//                   </p>
//                   <p style={{ fontFamily: fontSans, fontSize: 11, color: C.muted, margin: "3px 0 0" }}>
//                     Duration: {fmt((m.end ?? 0) - (m.start ?? 0), 1)}s
//                   </p>
//                 </div>
//                 <div style={{ textAlign: "right" }}>
//                   <p style={{
//                     fontFamily: font, fontSize: 22, fontWeight: 700,
//                     color: RANK_COLORS[i], margin: 0,
//                     textShadow: `0 0 16px ${RANK_COLORS[i]}88`,
//                   }}>
//                     {fmt(m.virality_score)}
//                   </p>
//                   <p style={{ fontFamily: fontSans, fontSize: 10, color: C.muted, margin: "2px 0 0", textTransform: "uppercase", letterSpacing: "0.1em" }}>
//                     virality score
//                   </p>
//                 </div>
//               </div>

//               {/* Score bar */}
//               <div style={{ height: 4, background: C.border, borderRadius: 2 }}>
//                 <div style={{
//                   width: `${scoreW}%`, height: "100%",
//                   background: RANK_COLORS[i],
//                   borderRadius: 2,
//                   boxShadow: `0 0 8px ${RANK_COLORS[i]}88`,
//                   transition: "width .8s cubic-bezier(.16,1,.3,1)",
//                 }} />
//               </div>
//             </div>
//           );
//         })}
//       </div>
//     </Card>
//   );
// }

// // ─── OTHER PANELS ─────────────────────────────────────────────────────────────
// function MetricsPanel({ analysis }) {
//   return (
//     <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
//       {[
//         { label: "Video Sentiment", value: analysis?.metrics?.video_sentiment },
//         { label: "Comments Sentiment", value: analysis?.metrics?.comments_sentiment },
//       ].map((m) => (
//         <Card key={m.label} style={{ textAlign: "center", padding: "22px 16px" }}>
//           <p style={{
//             fontFamily: font, fontSize: 34, fontWeight: 700,
//             color: sentColor(m.value ?? 0), margin: "0 0 6px",
//             textShadow: `0 0 20px ${sentColor(m.value ?? 0)}66`,
//           }}>
//             {fmt(m.value)}
//           </p>
//           <p style={{ fontFamily: fontSans, fontSize: 11, color: C.muted, margin: 0, textTransform: "uppercase", letterSpacing: "0.12em" }}>
//             {m.label}
//           </p>
//         </Card>
//       ))}
//     </div>
//   );
// }

// function SentimentPanel({ analysis }) {
//   const dist = analysis?.distribution ?? {};
//   return (
//     <Card>
//       <Label>Sentiment Distribution</Label>
//       <MiniBar label="Positive" value={dist.positive ?? 0} color={C.green} />
//       <MiniBar label="Neutral" value={dist.neutral ?? 0} color={C.yellow} />
//       <MiniBar label="Negative" value={dist.negative ?? 0} color={C.red} />
//     </Card>
//   );
// }

// function InsightPanel({ analysis }) {
//   const ins = analysis?.insight ?? {};
//   const fields = [
//     { key: "video_summary", label: "Summary" },
//     { key: "audience_reaction", label: "Audience Reaction" },
//     { key: "agreement", label: "Agreement" },
//     { key: "reason", label: "Reason" },
//     { key: "sentiment_strength", label: "Strength" },
//   ];
//   return (
//     <Card>
//       <Label>AI Insight</Label>
//       <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
//         {fields.map((f) =>
//           ins[f.key] ? (
//             <div key={f.key} style={{ borderBottom: `1px solid ${C.border}`, paddingBottom: 12 }}>
//               <p style={{ fontFamily: fontSans, fontSize: 10, fontWeight: 700, color: C.accent, textTransform: "uppercase", letterSpacing: "0.12em", margin: "0 0 4px" }}>
//                 {f.label}
//               </p>
//               <p style={{ fontFamily: fontSans, fontSize: 13, color: C.text, margin: 0, lineHeight: 1.6 }}>{ins[f.key]}</p>
//             </div>
//           ) : null
//         )}
//       </div>
//     </Card>
//   );
// }

// // ─── MAIN DASHBOARD ───────────────────────────────────────────────────────────
// export default function Dashboard() {
//   const [page, setPage] = useState("dashboard");
//   const [history, setHistory] = useState([]);
//   const [videoId, setVideoId] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [analysis, setAnalysis] = useState(null);
//   const [activeTab, setActiveTab] = useState("metrics");
//   const [user, setUser] = useState(null);

//   useEffect(() => { injectFonts(); }, []);

//   useEffect(() => {
//     const unsub = auth.onAuthStateChanged((u) => setUser(u));
//     return unsub;
//   }, []);

//   useEffect(() => { fetchHistory(); }, []);

//   const token = () => localStorage.getItem("token");

//   const fetchHistory = async () => {
//     try {
//       const res = await fetch(`${API_URL}/history`, { headers: { Authorization: `Bearer ${token()}` } });
//       const data = await res.json();
//       if (!res.ok) throw new Error(data.detail);
//       setHistory(data);
//     } catch (err) { setError(err.message); }
//   };

//   const runAnalysis = async (vid) => {
//     setLoading(true); setError(""); setAnalysis(null);
//     try {
//       const res = await fetch(`${API_URL}/analyze`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json", Authorization: `Bearer ${token()}` },
//         body: JSON.stringify({ video_id: vid }),
//       });
//       const data = await res.json();
//       if (!res.ok) throw new Error(data.detail);
//       setAnalysis(data); fetchHistory(); setVideoId("");
//     } catch (err) { setError(err.message); }
//     setLoading(false);
//   };

//   const handleLogout = async () => {
//     await signOut(auth);
//     localStorage.removeItem("token");
//     window.location.reload();
//   };

//   if (page === "timeline") return <TimelinePage analysis={analysis} onBack={() => setPage("dashboard")} />;
//   if (page === "comments") return <CommentsPage analysis={analysis} onBack={() => setPage("dashboard")} />;
//   if (page === "profile") return <ProfilePage user={user} history={history} onBack={() => setPage("dashboard")} onLogout={handleLogout} />;

//   const tabs = ["metrics", "virality", "sentiment", "insight"];

//   return (
//     <div style={{ minHeight: "100vh", background: C.bg, color: C.text, fontFamily: fontSans, paddingBottom: 60 }}>
//       <style>{`
//         @keyframes spin { to { transform: rotate(360deg); } }
//         * { box-sizing: border-box; }
//         ::-webkit-scrollbar { width: 6px; height: 6px; }
//         ::-webkit-scrollbar-track { background: ${C.surface}; }
//         ::-webkit-scrollbar-thumb { background: ${C.border}; border-radius: 3px; }
//       `}</style>

//       {/* NAV */}
//       <nav style={{
//         position: "sticky", top: 0, zIndex: 50,
//         background: C.surface + "f0", backdropFilter: "blur(16px)",
//         borderBottom: `1px solid ${C.border}`,
//         display: "flex", alignItems: "center", justifyContent: "space-between",
//         padding: "0 28px", height: 56,
//       }}>
//         <span style={{
//           fontFamily: fontSans, fontWeight: 800, fontSize: 16,
//           background: `linear-gradient(90deg, ${C.accent}, ${C.purple})`,
//           WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
//         }}>
//           VideoIntel
//         </span>
//         <button onClick={() => setPage("profile")} style={{
//           background: C.accentDim, border: `1px solid rgba(0,229,255,.2)`,
//           borderRadius: "50%", width: 34, height: 34,
//           display: "flex", alignItems: "center", justifyContent: "center",
//           cursor: "pointer", color: C.accent, fontFamily: fontSans, fontWeight: 700, fontSize: 13,
//         }}>
//           {user?.email?.[0]?.toUpperCase() ?? "U"}
//         </button>
//       </nav>

//       <div style={{ maxWidth: 960, margin: "0 auto", padding: "28px 20px" }}>
//         {/* INPUT */}
//         <div style={{
//           display: "flex", gap: 10, marginBottom: 28,
//           background: C.card, border: `1px solid ${C.border}`,
//           borderRadius: 14, padding: "14px 18px",
//         }}>
//           <input
//             value={videoId}
//             onChange={(e) => setVideoId(e.target.value)}
//             onKeyDown={(e) => e.key === "Enter" && runAnalysis(videoId)}
//             placeholder="Paste YouTube Video ID…"
//             style={{ flex: 1, background: "transparent", border: "none", outline: "none", color: C.text, fontFamily: font, fontSize: 14 }}
//           />
//           <Btn onClick={() => runAnalysis(videoId)} disabled={loading || !videoId.trim()}>
//             {loading ? "Analyzing…" : "Analyze"}
//           </Btn>
//         </div>

//         {error && (
//           <div style={{
//             background: C.redDim, border: `1px solid rgba(255,79,107,.3)`,
//             borderRadius: 10, padding: "10px 16px", marginBottom: 20,
//             color: C.red, fontFamily: font, fontSize: 13,
//           }}>⚠ {error}</div>
//         )}

//         <div style={{ display: "grid", gridTemplateColumns: "250px 1fr", gap: 20 }}>
//           {/* SIDEBAR */}
//           <Card style={{ padding: "16px 16px", alignSelf: "start" }}>
//             <Label>History</Label>
//             {history.length === 0 && <p style={{ color: C.muted, fontSize: 12, margin: 0 }}>No videos yet</p>}
//             <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
//               {history.map((item, i) => (
//                 <button key={i} onClick={() => runAnalysis(item.video_id)} style={{
//                   background: analysis?.video_id === item.video_id ? C.accentDim : "transparent",
//                   border: `1px solid ${analysis?.video_id === item.video_id ? C.accent + "44" : "transparent"}`,
//                   borderRadius: 9, padding: "9px 11px", cursor: "pointer", textAlign: "left", width: "100%",
//                   transition: "all .15s",
//                 }}>
//                   <p style={{ fontFamily: fontSans, fontSize: 12, fontWeight: 600, color: C.text, margin: "0 0 2px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
//                     {item.title || item.video_id}
//                   </p>
//                   <p style={{ fontFamily: font, fontSize: 10, color: C.muted, margin: 0 }}>
//                     {fmtTs(item.created_at || item.timestamp)}
//                   </p>
//                 </button>
//               ))}
//             </div>
//           </Card>

//           {/* MAIN */}
//           <div>
//             {!analysis && !loading && (
//               <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: 320, color: C.muted }}>
//                 <span style={{ fontSize: 52, marginBottom: 14 }}>🎬</span>
//                 <p style={{ fontFamily: fontSans, fontSize: 15 }}>Enter a YouTube Video ID to begin analysis</p>
//               </div>
//             )}

//             {loading && (
//               <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: 320 }}>
//                 <div style={{ width: 42, height: 42, border: `3px solid ${C.border}`, borderTopColor: C.accent, borderRadius: "50%", animation: "spin .8s linear infinite", marginBottom: 16 }} />
//                 <p style={{ fontFamily: fontSans, color: C.textSub, fontSize: 14 }}>Running pipeline…</p>
//               </div>
//             )}

//             {analysis && !loading && (
//               <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
//                 {/* TABS */}
//                 <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
//                   {tabs.map((t) => (
//                     <button key={t} onClick={() => setActiveTab(t)} style={{
//                       fontFamily: fontSans, fontSize: 12, fontWeight: 600,
//                       textTransform: "capitalize", letterSpacing: "0.05em",
//                       padding: "7px 18px", borderRadius: 9, border: "none", cursor: "pointer",
//                       background: activeTab === t ? C.accent : C.card,
//                       color: activeTab === t ? "#000" : C.textSub,
//                       transition: "all .15s",
//                     }}>{t}</button>
//                   ))}
//                 </div>

//                 {activeTab === "metrics" && <MetricsPanel analysis={analysis} />}
//                 {activeTab === "virality" && <ViralityPanel analysis={analysis} />}
//                 {activeTab === "sentiment" && <SentimentPanel analysis={analysis} />}
//                 {activeTab === "insight" && <InsightPanel analysis={analysis} />}

//                 {/* GRAPH BUTTONS */}
//                 <div style={{ display: "flex", gap: 10, flexWrap: "wrap", paddingTop: 4 }}>
//                   <Btn variant="outline" onClick={() => setPage("timeline")}>
//                     📈 Sentiment Timeline Graph
//                   </Btn>
//                   <Btn variant="outline" onClick={() => setPage("comments")}>
//                     💬 Comments Sentiment Graph
//                   </Btn>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }





import { useEffect, useState, useRef, useCallback } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";

const API_URL = "http://127.0.0.1:8000";

const C = {
  bg: "#080a0f",
  surface: "#0e1118",
  card: "#141720",
  cardHover: "#1a1f2e",
  border: "#1e2330",
  borderLight: "#252d3d",
  accent: "#00e5ff",
  accentDim: "rgba(0,229,255,0.10)",
  accentGlow: "rgba(0,229,255,0.25)",
  green: "#00e676",
  greenDim: "rgba(0,230,118,0.12)",
  red: "#ff4f6b",
  redDim: "rgba(255,79,107,0.12)",
  yellow: "#ffc947",
  yellowDim: "rgba(255,201,71,0.12)",
  purple: "#b388ff",
  muted: "#3d4559",
  text: "#dde3f0",
  textSub: "#7b8aaa",
};

const font = `'JetBrains Mono', 'Fira Mono', monospace`;
const fontSans = `'Outfit', 'Segoe UI', sans-serif`;

const injectFonts = () => {
  if (document.getElementById("vi-fonts")) return;
  const l = document.createElement("link");
  l.id = "vi-fonts";
  l.rel = "stylesheet";
  l.href = "https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap";
  document.head.appendChild(l);
};

const fmt = (n, d = 2) => (typeof n === "number" ? n.toFixed(d) : "—");
const sentColor = (v) => (v > 0.1 ? C.green : v < -0.1 ? C.red : C.yellow);
const sentBg = (v) => (v > 0.1 ? C.greenDim : v < -0.1 ? C.redDim : C.yellowDim);
const pct = (v) => `${(v * 100).toFixed(0)}%`;
const fmtTs = (iso) => {
  if (!iso) return "—";
  const d = new Date(iso);
  return isNaN(d) ? iso : d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
};

// ─── shared primitives ────────────────────────────────────────────────────────
function Card({ children, style = {}, hover = false }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => hover && setHov(true)}
      onMouseLeave={() => hover && setHov(false)}
      style={{
        background: hov ? C.cardHover : C.card,
        border: `1px solid ${hov ? C.borderLight : C.border}`,
        borderRadius: 14, padding: "20px 24px",
        transition: "background .2s, border-color .2s",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function Label({ children }) {
  return (
    <p style={{
      fontFamily: fontSans, fontSize: 10, fontWeight: 700,
      letterSpacing: "0.16em", textTransform: "uppercase",
      color: C.accent, margin: "0 0 14px",
    }}>{children}</p>
  );
}

function Btn({ children, onClick, variant = "primary", disabled, style = {} }) {
  const [hov, setHov] = useState(false);
  const base = {
    fontFamily: fontSans, fontSize: 13, fontWeight: 600,
    border: "none", borderRadius: 10, cursor: disabled ? "not-allowed" : "pointer",
    padding: "9px 20px", transition: "all .15s", opacity: disabled ? 0.45 : 1,
    display: "inline-flex", alignItems: "center", gap: 6,
    ...style,
  };
  const vs = {
    primary: { background: hov ? "#00c8e0" : C.accent, color: "#000" },
    ghost: { background: hov ? C.border : "transparent", color: C.textSub, border: `1px solid ${C.border}` },
    danger: { background: hov ? "rgba(255,79,107,.25)" : C.redDim, color: C.red, border: `1px solid rgba(255,79,107,.35)` },
    outline: { background: hov ? "rgba(0,229,255,.18)" : C.accentDim, color: C.accent, border: `1px solid rgba(0,229,255,.28)` },
  };
  return (
    <button onClick={onClick} disabled={disabled}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ ...base, ...vs[variant] }}>
      {children}
    </button>
  );
}

function MiniBar({ label, value, color, bgColor }) {
  const w = Math.min(100, Math.abs(value) * 100);
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
        <span style={{ fontFamily: fontSans, fontSize: 12, color: C.textSub }}>{label}</span>
        <span style={{ fontFamily: font, fontSize: 12, color }}>{pct(value)}</span>
      </div>
      <div style={{ height: 7, background: C.border, borderRadius: 4, overflow: "hidden" }}>
        <div style={{
          width: `${w}%`, height: "100%", background: color,
          borderRadius: 4, transition: "width .7s cubic-bezier(.16,1,.3,1)",
          boxShadow: `0 0 8px ${color}88`,
        }} />
      </div>
    </div>
  );
}

// ─── INTERACTIVE CHART ────────────────────────────────────────────────────────
// Matches the reference: solid axis lines, full numeric grid, key-moment dots,
// clean legend box, and a crisp hover crosshair + tooltip.
function InteractiveChart({
  data,
  series,
  title,
  xKey = "start",
  xLabel = "Time (seconds)",
  yLabel = null,
  height = 320,
  keyMoments = [],
}) {
  // ── ALL hooks first — before any conditional return ───────────────────────
  const [tooltip, setTooltip] = useState(null);
  const svgRef = useRef(null);

  // ── layout constants (stable, not dependent on data) ─────────────────────
  const PAD = { top: 36, right: 32, bottom: 58, left: 66 };
  const W = 860;
  const CW = W - PAD.left - PAD.right;

  // ── mouse handler — defined unconditionally ───────────────────────────────
  const handleMouseMove = useCallback((e) => {
    if (!svgRef.current || !data || data.length < 2) return;
    const rect = svgRef.current.getBoundingClientRect();
    const mx = ((e.clientX - rect.left) / rect.width) * W;
    const xVals = data.map((d) => d[xKey] ?? 0);
    const xMin = Math.min(...xVals);
    const xMax = Math.max(...xVals) || 1;
    const xPos = (v) => PAD.left + ((v - xMin) / (xMax - xMin)) * CW;
    let best = 0, bestDist = Infinity;
    data.forEach((d, i) => {
      const dist = Math.abs(xPos(d[xKey] ?? 0) - mx);
      if (dist < bestDist) { bestDist = dist; best = i; }
    });
    const threshold = (CW / Math.max(data.length - 1, 1)) * 1.8;
    setTooltip(bestDist < threshold ? { idx: best } : null);
  }, [data, xKey, CW, W]);

  // ── early return AFTER all hooks ──────────────────────────────────────────
  if (!data || data.length < 2) {
    return (
      <div style={{ height, display: "flex", alignItems: "center", justifyContent: "center", color: C.muted, fontFamily: fontSans, fontSize: 13 }}>
        Not enough data to render chart
      </div>
    );
  }

  // ── derived values (safe — we're past the early return) ───────────────────
  const H = height;
  const CH = H - PAD.top - PAD.bottom;

  const xVals = data.map((d) => d[xKey] ?? 0);
  const xMin = Math.min(...xVals);
  const xMax = Math.max(...xVals) || 1;

  const allY = series.flatMap((s) => data.map((d) => d[s.key] ?? 0));
  const yRaw = { min: Math.min(...allY), max: Math.max(...allY) };
  const yPad = (yRaw.max - yRaw.min) * 0.15 || 0.1;
  const yMin = yRaw.min - yPad;
  const yMax = yRaw.max + yPad;

  const xPos = (v) => PAD.left + ((v - xMin) / (xMax - xMin)) * CW;
  const yPos = (v) => PAD.top + CH - ((v - yMin) / (yMax - yMin)) * CH;

  // ── nice tick generator ───────────────────────────────────────────────────
  const niceStep = (range, steps) => {
    if (range === 0) return 1;
    const rough = range / steps;
    const mag = Math.pow(10, Math.floor(Math.log10(Math.abs(rough))));
    return ([1, 2, 2.5, 5, 10].find((m) => m * mag >= rough) ?? 10) * mag;
  };

  const makeTicks = (lo, hi, steps) => {
    const step = niceStep(hi - lo, steps);
    const start = Math.ceil((lo - 1e-9) / step) * step;
    const ticks = [];
    for (let t = start; t <= hi + 1e-9; t = +(t + step).toFixed(12))
      ticks.push(+t.toFixed(8));
    return ticks;
  };

  const yTicks = makeTicks(yMin, yMax, 6);
  const xTicks = makeTicks(xMin, xMax, 8);

  // ── path builders ─────────────────────────────────────────────────────────
  const buildLine = (key) =>
    data.map((d, i) => {
      const x = xPos(d[xKey] ?? 0), y = yPos(d[key] ?? 0);
      return i === 0 ? `M${x},${y}` : `L${x},${y}`;
    }).join(" ");

  const buildArea = (key) => {
    const line = buildLine(key);
    const base = yPos(Math.max(yMin, Math.min(0, yMax)));
    return `${line} L${xPos(xVals[xVals.length - 1])},${base} L${xPos(xVals[0])},${base} Z`;
  };

  const tp = tooltip !== null ? data[tooltip.idx] : null;

  // ── tick label formatter ──────────────────────────────────────────────────
  const fmtTick = (v, isY) => {
    if (Math.abs(v) >= 1000) return (v / 1000).toFixed(1) + "k";
    if (isY && Math.abs(v) < 1 && v !== 0) return v.toFixed(2);
    return v % 1 === 0 ? v.toString() : v.toFixed(1);
  };

  // ── first-series key moments (mapped to x midpoint of each moment) ────────
  const kmPoints = keyMoments
    .filter((m) => m.start != null)
    .map((m) => {
      const mid = ((m.start ?? 0) + (m.end ?? m.start ?? 0)) / 2;
      if (mid < xMin || mid > xMax) return null;
      // Find closest data point to map to real y value
      let closest = data[0];
      let minD = Infinity;
      data.forEach((d) => {
        const d2 = Math.abs((d[xKey] ?? 0) - mid);
        if (d2 < minD) { minD = d2; closest = d; }
      });
      return { x: xPos(mid), y: yPos(closest[series[0].key] ?? 0) };
    })
    .filter(Boolean);

  return (
    <div style={{ position: "relative", userSelect: "none" }}>
      {title && (
        <p style={{
          fontFamily: fontSans, fontSize: 13, fontWeight: 600,
          color: C.text, margin: "0 0 14px",
          textAlign: "center", letterSpacing: "0.02em",
        }}>
          {title}
        </p>
      )}

      <svg
        ref={svgRef}
        viewBox={`0 0 ${W} ${H}`}
        style={{ width: "100%", height, display: "block", cursor: "crosshair" }}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setTooltip(null)}
      >
        <defs>
          {series.map((s) => (
            <linearGradient key={s.key} id={`ic-grad-${s.key}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={s.color} stopOpacity="0.18" />
              <stop offset="100%" stopColor={s.color} stopOpacity="0" />
            </linearGradient>
          ))}
          <clipPath id="ic-clip">
            <rect x={PAD.left} y={PAD.top} width={CW} height={CH} />
          </clipPath>
        </defs>

        {/* ── chart background ── */}
        <rect x={PAD.left} y={PAD.top} width={CW} height={CH}
          fill="#0a0d14" rx="2" />

        {/* ── Y grid + ticks + labels ── */}
        {yTicks.map((t) => {
          const y = yPos(t);
          if (y < PAD.top - 1 || y > PAD.top + CH + 1) return null;
          return (
            <g key={`y-${t}`}>
              {/* grid line */}
              <line x1={PAD.left} y1={y} x2={PAD.left + CW} y2={y}
                stroke="#1e2638" strokeWidth="1" />
              {/* tick mark */}
              <line x1={PAD.left - 5} y1={y} x2={PAD.left} y2={y}
                stroke="#4a5568" strokeWidth="1.5" />
              {/* label */}
              <text x={PAD.left - 10} y={y + 4}
                textAnchor="end" fill="#8896b3"
                fontSize="12" fontFamily={font}>
                {fmtTick(t, true)}
              </text>
            </g>
          );
        })}

        {/* ── X grid + ticks + labels ── */}
        {xTicks.map((t) => {
          const x = xPos(t);
          if (x < PAD.left - 1 || x > PAD.left + CW + 1) return null;
          return (
            <g key={`x-${t}`}>
              <line x1={x} y1={PAD.top} x2={x} y2={PAD.top + CH}
                stroke="#1e2638" strokeWidth="1" />
              <line x1={x} y1={PAD.top + CH} x2={x} y2={PAD.top + CH + 5}
                stroke="#4a5568" strokeWidth="1.5" />
              <text x={x} y={PAD.top + CH + 20}
                textAnchor="middle" fill="#8896b3"
                fontSize="12" fontFamily={font}>
                {fmtTick(t, false)}
              </text>
            </g>
          );
        })}

        {/* ── Axis spine lines (solid, prominent) ── */}
        {/* Y axis */}
        <line x1={PAD.left} y1={PAD.top} x2={PAD.left} y2={PAD.top + CH}
          stroke="#5a6880" strokeWidth="2" />
        {/* X axis */}
        <line x1={PAD.left} y1={PAD.top + CH} x2={PAD.left + CW} y2={PAD.top + CH}
          stroke="#5a6880" strokeWidth="2" />
        {/* Top border */}
        <line x1={PAD.left} y1={PAD.top} x2={PAD.left + CW} y2={PAD.top}
          stroke="#1e2638" strokeWidth="1" />
        {/* Right border */}
        <line x1={PAD.left + CW} y1={PAD.top} x2={PAD.left + CW} y2={PAD.top + CH}
          stroke="#1e2638" strokeWidth="1" />

        {/* ── Zero line (when range spans 0) ── */}
        {yMin < 0 && yMax > 0 && (
          <line x1={PAD.left} y1={yPos(0)} x2={PAD.left + CW} y2={yPos(0)}
            stroke="#3a4558" strokeWidth="1.5" strokeDasharray="6,4" />
        )}

        {/* ── Axis titles ── */}
        <text x={PAD.left + CW / 2} y={H - 6}
          textAnchor="middle" fill="#8896b3"
          fontSize="13" fontFamily={fontSans} fontWeight="600">
          {xLabel}
        </text>
        <text
          transform={`translate(14, ${PAD.top + CH / 2}) rotate(-90)`}
          textAnchor="middle" fill="#8896b3"
          fontSize="13" fontFamily={fontSans} fontWeight="600">
          {yLabel ?? (series.length === 1 ? series[0].label : "Score")}
        </text>

        {/* ── Data: area fill + line ── */}
        <g clipPath="url(#ic-clip)">
          {series.map((s) => (
            <path key={`a-${s.key}`} d={buildArea(s.key)}
              fill={`url(#ic-grad-${s.key})`} />
          ))}
          {series.map((s) => (
            <path key={`l-${s.key}`} d={buildLine(s.key)}
              fill="none" stroke={s.color} strokeWidth="2.5"
              strokeLinejoin="round" strokeLinecap="round" />
          ))}

          {/* ── Key moment dots (like the red circles in reference) ── */}
          {kmPoints.map((pt, i) => (
            <g key={`km-${i}`}>
              <circle cx={pt.x} cy={pt.y} r="8"
                fill="#ff4f6b" stroke="#ff4f6b" strokeWidth="0" opacity="0.15" />
              <circle cx={pt.x} cy={pt.y} r="5.5"
                fill="#ff4f6b" stroke="#fff" strokeWidth="1.5" />
            </g>
          ))}
        </g>

        {/* ── Hover crosshair ── */}
        {tp && (
          <>
            <line x1={xPos(tp[xKey] ?? 0)} y1={PAD.top}
              x2={xPos(tp[xKey] ?? 0)} y2={PAD.top + CH}
              stroke="#5a6880" strokeWidth="1" strokeDasharray="4,3" />
            <line x1={PAD.left} y1={yPos(series[0] ? (tp[series[0].key] ?? 0) : 0)}
              x2={PAD.left + CW} y2={yPos(series[0] ? (tp[series[0].key] ?? 0) : 0)}
              stroke="#5a6880" strokeWidth="1" strokeDasharray="4,3" />
          </>
        )}

        {/* ── Hover data dots ── */}
        {tp && series.map((s) => (
          <circle key={`hd-${s.key}`}
            cx={xPos(tp[xKey] ?? 0)} cy={yPos(tp[s.key] ?? 0)}
            r="6" fill={s.color} stroke={C.bg} strokeWidth="2.5" />
        ))}

        {/* ── Legend box (top-left inside chart area, like the reference) ── */}
        {series.length >= 1 && (() => {
          const items = [
            ...series.map((s) => ({ color: s.color, label: s.label, dot: false })),
            ...(kmPoints.length > 0 ? [{ color: "#ff4f6b", label: "Key Moments", dot: true }] : []),
          ];
          const bx = PAD.left + 12, by = PAD.top + 10;
          const bw = 150, bh = items.length * 20 + 14;
          return (
            <g>
              <rect x={bx} y={by} width={bw} height={bh}
                fill="#0e1320" stroke="#1e2638" strokeWidth="1" rx="6" />
              {items.map((it, i) => (
                <g key={i} transform={`translate(${bx + 12}, ${by + 10 + i * 20})`}>
                  {it.dot
                    ? <circle cx="7" cy="4" r="5" fill={it.color} stroke="#fff" strokeWidth="1" />
                    : <>
                        <line x1="0" y1="4" x2="14" y2="4" stroke={it.color} strokeWidth="2.5" strokeLinecap="round" />
                        <circle cx="7" cy="4" r="2.5" fill={it.color} />
                      </>
                  }
                  <text x="20" y="8.5" fill="#a0aec0" fontSize="11" fontFamily={fontSans}>{it.label}</text>
                </g>
              ))}
            </g>
          );
        })()}
      </svg>

      {/* ── Tooltip popup ── */}
      {tp && (() => {
        const pctX = (xPos(tp[xKey] ?? 0) / W) * 100;
        return (
          <div style={{
            position: "absolute",
            top: PAD.top + 4,
            left: `clamp(4px, calc(${pctX}% + 10px), calc(100% - 170px))`,
            background: "#0e1320",
            border: `1px solid #252d3d`,
            borderRadius: 10,
            padding: "10px 14px",
            pointerEvents: "none",
            zIndex: 20,
            minWidth: 155,
            boxShadow: "0 8px 32px rgba(0,0,0,.7)",
          }}>
            <p style={{ fontFamily: font, fontSize: 11, color: "#8896b3", margin: "0 0 8px", borderBottom: "1px solid #1e2638", paddingBottom: 6 }}>
              {xLabel.toLowerCase().includes("index") ? `#${Math.round(tp[xKey])}` : `t = ${fmt(tp[xKey], 1)} s`}
            </p>
            {series.map((s) => (
              <div key={s.key} style={{ display: "flex", justifyContent: "space-between", gap: 18, marginBottom: 3 }}>
                <span style={{ fontFamily: fontSans, fontSize: 11, color: "#8896b3" }}>{s.label}</span>
                <span style={{ fontFamily: font, fontSize: 12, color: s.color, fontWeight: 600 }}>
                  {fmt(tp[s.key])}
                </span>
              </div>
            ))}
          </div>
        );
      })()}
    </div>
  );
}

// ─── TIMELINE PAGE ────────────────────────────────────────────────────────────
function TimelinePage({ analysis, onBack }) {
  const data = analysis?.timeline_data ?? [];

  return (
    <div style={{ minHeight: "100vh", background: C.bg, paddingBottom: 60 }}>
      <div style={{ maxWidth: 980, margin: "0 auto", padding: "28px 24px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 32 }}>
          <Btn variant="ghost" onClick={onBack}>← Back</Btn>
          <div>
            <h2 style={{ fontFamily: fontSans, fontSize: 24, fontWeight: 700, color: C.text, margin: 0 }}>
              Sentiment Timeline
            </h2>
            <p style={{ fontFamily: fontSans, fontSize: 13, color: C.textSub, margin: "4px 0 0" }}>
              {data.length} segments · hover to inspect values
            </p>
          </div>
        </div>

        <Card style={{ marginBottom: 20 }}>
          <InteractiveChart
            data={data}
            series={[{ key: "sentiment_score", label: "Sentiment", color: C.accent }]}
            title="Sentiment Score over Time"
            xKey="start"
            xLabel="Segment Start (seconds)"
            yLabel="Sentiment"
            keyMoments={analysis?.top_moments ?? []}
            height={320}
          />
        </Card>

        <Card style={{ marginBottom: 20 }}>
          <InteractiveChart
            data={data}
            series={[{ key: "virality_score", label: "Virality", color: C.yellow }]}
            title="Virality Score over Time"
            xKey="start"
            xLabel="Segment Start (seconds)"
            yLabel="Virality"
            keyMoments={analysis?.top_moments ?? []}
            height={320}
          />
        </Card>

        <Card style={{ marginBottom: 20 }}>
          <InteractiveChart
            data={data}
            series={[
              { key: "sentiment_score", label: "Sentiment", color: C.accent },
              { key: "virality_score", label: "Virality", color: C.yellow },
            ]}
            title="Sentiment vs Virality — Overlay"
            xKey="start"
            xLabel="Segment Start (seconds)"
            height={280}
          />
        </Card>

        <Card>
          <Label>Full Data Table</Label>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: font, fontSize: 12 }}>
              <thead>
                <tr>
                  {["#", "Start (s)", "End (s)", "Sentiment", "Virality"].map((h) => (
                    <th key={h} style={{
                      padding: "8px 14px", textAlign: "left",
                      color: C.accent, fontWeight: 600, fontSize: 10,
                      letterSpacing: "0.12em", textTransform: "uppercase",
                      borderBottom: `1px solid ${C.border}`,
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.map((pt, i) => (
                  <tr key={i} style={{ borderBottom: `1px solid ${C.border}44` }}>
                    <td style={{ padding: "7px 14px", color: C.muted }}>{i + 1}</td>
                    <td style={{ padding: "7px 14px", color: C.text }}>{fmt(pt.start, 1)}</td>
                    <td style={{ padding: "7px 14px", color: C.text }}>{fmt(pt.end, 1)}</td>
                    <td style={{ padding: "7px 14px" }}>
                      <span style={{
                        color: sentColor(pt.sentiment_score),
                        background: sentBg(pt.sentiment_score),
                        padding: "2px 8px", borderRadius: 6, fontSize: 11,
                      }}>
                        {fmt(pt.sentiment_score)}
                      </span>
                    </td>
                    <td style={{ padding: "7px 14px", color: C.yellow }}>{fmt(pt.virality_score)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}

// ─── COMMENTS SENTIMENT PAGE ──────────────────────────────────────────────────
function CommentsPage({ analysis, onBack }) {
  const dist = analysis?.distribution ?? {};
  const comments = analysis?.comments_sample ?? [];

  // Build bar chart data for sentiment distribution
  const barData = [
    { label: "Positive", sentiment_score: dist.positive ?? 0, start: 0 },
    { label: "Neutral", sentiment_score: dist.neutral ?? 0, start: 1 },
    { label: "Negative", sentiment_score: -(dist.negative ?? 0), start: 2 },
  ];

  // Build per-comment chart data (index vs sentiment)
  const commentChartData = comments.map((c, i) => ({
    start: i,
    sentiment_score: typeof c.sentiment_score === "number" ? c.sentiment_score : 0,
  }));

  return (
    <div style={{ minHeight: "100vh", background: C.bg, paddingBottom: 60 }}>
      <div style={{ maxWidth: 980, margin: "0 auto", padding: "28px 24px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 32 }}>
          <Btn variant="ghost" onClick={onBack}>← Back</Btn>
          <div>
            <h2 style={{ fontFamily: fontSans, fontSize: 24, fontWeight: 700, color: C.text, margin: 0 }}>
              Comments Sentiment
            </h2>
            <p style={{ fontFamily: fontSans, fontSize: 13, color: C.textSub, margin: "4px 0 0" }}>
              {comments.length} sample comments
            </p>
          </div>
        </div>

        {/* Distribution bars */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
          <Card>
            <Label>Audience Distribution</Label>
            <MiniBar label="Positive" value={dist.positive ?? 0} color={C.green} bgColor={C.greenDim} />
            <MiniBar label="Neutral" value={dist.neutral ?? 0} color={C.yellow} bgColor={C.yellowDim} />
            <MiniBar label="Negative" value={dist.negative ?? 0} color={C.red} bgColor={C.redDim} />
          </Card>
          <Card>
            <Label>Aggregate Scores</Label>
            {[
              { label: "Video Sentiment", val: analysis?.metrics?.video_sentiment },
              { label: "Comments Sentiment", val: analysis?.metrics?.comments_sentiment },
            ].map((m) => (
              <div key={m.label} style={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                padding: "10px 14px", background: C.surface, borderRadius: 8, marginBottom: 8,
              }}>
                <span style={{ fontFamily: fontSans, fontSize: 13, color: C.textSub }}>{m.label}</span>
                <span style={{
                  fontFamily: font, fontSize: 16, fontWeight: 600,
                  color: sentColor(m.val ?? 0),
                  background: sentBg(m.val ?? 0),
                  padding: "3px 12px", borderRadius: 8,
                }}>
                  {fmt(m.val)}
                </span>
              </div>
            ))}
          </Card>
        </div>

        {/* Interactive chart of per-comment sentiment */}
        {commentChartData.length >= 2 && (
          <Card style={{ marginBottom: 20 }}>
            <InteractiveChart
              data={commentChartData}
              series={[{ key: "sentiment_score", label: "Comment Sentiment", color: C.green }]}
              title="Per-Comment Sentiment Score"
              xKey="start"
              xLabel="Comment Index"
              height={280}
            />
          </Card>
        )}

        {/* Comments list */}
        <Card>
          <Label>Sample Comments</Label>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {comments.length === 0 && (
              <p style={{ color: C.muted, fontSize: 13, fontFamily: fontSans }}>No comments available</p>
            )}
            {comments.map((c, i) => (
              <div key={i} style={{
                background: C.surface,
                borderRadius: 10,
                padding: "12px 16px",
                borderLeft: `3px solid ${sentColor(c.sentiment_score)}`,
                display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12,
              }}>
                <p style={{ fontFamily: fontSans, fontSize: 13, color: C.text, margin: 0, lineHeight: 1.5, flex: 1 }}>
                  {c.text}
                </p>
                <span style={{
                  fontFamily: font, fontSize: 12, fontWeight: 600,
                  color: sentColor(c.sentiment_score),
                  background: sentBg(c.sentiment_score),
                  padding: "3px 10px", borderRadius: 6, whiteSpace: "nowrap",
                }}>
                  {fmt(c.sentiment_score)}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

// ─── PROFILE PAGE ─────────────────────────────────────────────────────────────
function ProfilePage({ user, history, onBack, onLogout }) {
  const sentScores = history.map((h) => h.metrics?.video_sentiment).filter((v) => typeof v === "number");
  const avgSent = sentScores.length ? sentScores.reduce((a, b) => a + b, 0) / sentScores.length : null;

  return (
    <div style={{ minHeight: "100vh", background: C.bg, paddingBottom: 60 }}>
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "28px 24px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 32 }}>
          <Btn variant="ghost" onClick={onBack}>← Back</Btn>
          <h2 style={{ fontFamily: fontSans, fontSize: 24, fontWeight: 700, color: C.text, margin: 0 }}>Profile</h2>
        </div>

        <Card style={{ display: "flex", alignItems: "center", gap: 22, marginBottom: 18 }}>
          <div style={{
            width: 68, height: 68, borderRadius: "50%", flexShrink: 0,
            background: `linear-gradient(135deg, ${C.accent} 0%, #7c3aed 100%)`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 28, fontWeight: 800, color: "#000", fontFamily: fontSans,
            boxShadow: `0 0 24px ${C.accentGlow}`,
          }}>
            {user?.email?.[0]?.toUpperCase() ?? "U"}
          </div>
          <div>
            <p style={{ fontFamily: fontSans, fontSize: 19, fontWeight: 700, color: C.text, margin: "0 0 4px" }}>
              {user?.displayName ?? "User"}
            </p>
            <p style={{ fontFamily: font, fontSize: 12, color: C.textSub, margin: 0 }}>{user?.email}</p>
            {user?.metadata?.creationTime && (
              <p style={{ fontFamily: font, fontSize: 11, color: C.muted, margin: "5px 0 0" }}>
                Joined {fmtTs(user.metadata.creationTime)}
              </p>
            )}
          </div>
        </Card>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 18 }}>
          {[
            { label: "Videos Analyzed", val: history.length, color: C.accent },
            { label: "Avg Sentiment", val: avgSent !== null ? fmt(avgSent) : "—", color: sentColor(avgSent ?? 0) },
            { label: "Provider", val: user?.providerData?.[0]?.providerId ?? "email", color: C.purple },
          ].map((s) => (
            <Card key={s.label} style={{ textAlign: "center", padding: "18px 12px" }}>
              <p style={{ fontFamily: font, fontSize: 24, fontWeight: 700, color: s.color, margin: "0 0 5px" }}>{s.val}</p>
              <p style={{ fontFamily: fontSans, fontSize: 10, color: C.muted, margin: 0, textTransform: "uppercase", letterSpacing: "0.1em" }}>
                {s.label}
              </p>
            </Card>
          ))}
        </div>

        <Card style={{ marginBottom: 18 }}>
          <Label>Analysis History</Label>
          {history.length === 0 && <p style={{ color: C.muted, fontSize: 13, fontFamily: fontSans }}>No analyses yet</p>}
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {history.map((item, i) => (
              <div key={i} style={{
                background: C.surface, borderRadius: 9, padding: "10px 16px",
                display: "flex", justifyContent: "space-between", alignItems: "center",
              }}>
                <div>
                  <p style={{ fontFamily: fontSans, fontSize: 13, fontWeight: 600, color: C.text, margin: "0 0 2px" }}>
                    {item.title || item.video_id}
                  </p>
                  <p style={{ fontFamily: font, fontSize: 11, color: C.muted, margin: 0 }}>
                    {fmtTs(item.created_at || item.timestamp)}
                  </p>
                </div>
                {typeof item.metrics?.video_sentiment === "number" && (
                  <span style={{
                    fontFamily: font, fontSize: 12, fontWeight: 600,
                    color: sentColor(item.metrics.video_sentiment),
                    background: sentBg(item.metrics.video_sentiment),
                    padding: "3px 11px", borderRadius: 7,
                  }}>
                    {fmt(item.metrics.video_sentiment)}
                  </span>
                )}
              </div>
            ))}
          </div>
        </Card>
        <Btn variant="danger" onClick={onLogout}>Sign Out</Btn>
      </div>
    </div>
  );
}

// ─── VIRALITY PANEL — top 3 timestamps ranked by virality_score ───────────────
function ViralityPanel({ analysis }) {
  // Support legacy key "top_segments" (old cached docs) and new "top_moments"
  const raw = analysis?.top_moments
    ?? analysis?.top_segments
    ?? [];

  // Normalise: old pipeline stored { start, end, score } — new stores { start, end, virality_score }
  const normalised = raw.map((m) => ({
    start: m.start ?? 0,
    end: m.end ?? 0,
    virality_score: m.virality_score ?? m.score ?? 0,
  }));

  // Sort descending by virality_score, take top 3
  const moments = [...normalised]
    .sort((a, b) => (b.virality_score ?? 0) - (a.virality_score ?? 0))
    .slice(0, 3);

  const RANK_COLORS = [C.yellow, C.accent, C.purple];
  const RANK_LABELS = ["#1 Highest", "#2 Second", "#3 Third"];
  const RANK_ICONS = ["🥇", "🥈", "🥉"];

  // Score bar max = first item's score
  const maxScore = moments[0]?.virality_score ?? 1;

  return (
    <Card>
      <Label>Top 3 Viral Moments — by Virality Score</Label>
      {moments.length === 0 && (
        <p style={{ color: C.muted, fontSize: 13, fontFamily: fontSans }}>No viral moments data available</p>
      )}
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {moments.map((m, i) => {
          const scoreW = maxScore > 0 ? ((m.virality_score ?? 0) / maxScore) * 100 : 0;
          return (
            <div key={i} style={{
              background: C.surface,
              border: `1px solid ${i === 0 ? C.yellow + "55" : C.border}`,
              borderRadius: 12,
              padding: "16px 18px",
              position: "relative",
              overflow: "hidden",
            }}>
              {/* Glow strip on left */}
              <div style={{
                position: "absolute", left: 0, top: 0, bottom: 0, width: 3,
                background: RANK_COLORS[i],
                borderRadius: "12px 0 0 12px",
              }} />

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 5 }}>
                    <span style={{ fontSize: 18 }}>{RANK_ICONS[i]}</span>
                    <span style={{
                      fontFamily: fontSans, fontSize: 10, fontWeight: 700,
                      color: RANK_COLORS[i], textTransform: "uppercase", letterSpacing: "0.12em",
                    }}>
                      {RANK_LABELS[i]}
                    </span>
                  </div>
                  <p style={{ fontFamily: font, fontSize: 15, fontWeight: 600, color: C.text, margin: 0 }}>
                    {fmt(m.start, 1)}s → {fmt(m.end, 1)}s
                  </p>
                  <p style={{ fontFamily: fontSans, fontSize: 11, color: C.muted, margin: "3px 0 0" }}>
                    Duration: {fmt((m.end ?? 0) - (m.start ?? 0), 1)}s
                  </p>
                </div>
                <div style={{ textAlign: "right" }}>
                  <p style={{
                    fontFamily: font, fontSize: 22, fontWeight: 700,
                    color: RANK_COLORS[i], margin: 0,
                    textShadow: `0 0 16px ${RANK_COLORS[i]}88`,
                  }}>
                    {fmt(m.virality_score)}
                  </p>
                  <p style={{ fontFamily: fontSans, fontSize: 10, color: C.muted, margin: "2px 0 0", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                    virality score
                  </p>
                </div>
              </div>

              {/* Score bar */}
              <div style={{ height: 4, background: C.border, borderRadius: 2 }}>
                <div style={{
                  width: `${scoreW}%`, height: "100%",
                  background: RANK_COLORS[i],
                  borderRadius: 2,
                  boxShadow: `0 0 8px ${RANK_COLORS[i]}88`,
                  transition: "width .8s cubic-bezier(.16,1,.3,1)",
                }} />
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

// ─── OTHER PANELS ─────────────────────────────────────────────────────────────
function MetricsPanel({ analysis }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
      {[
        { label: "Video Sentiment", value: analysis?.metrics?.video_sentiment },
        { label: "Comments Sentiment", value: analysis?.metrics?.comments_sentiment },
      ].map((m) => (
        <Card key={m.label} style={{ textAlign: "center", padding: "22px 16px" }}>
          <p style={{
            fontFamily: font, fontSize: 34, fontWeight: 700,
            color: sentColor(m.value ?? 0), margin: "0 0 6px",
            textShadow: `0 0 20px ${sentColor(m.value ?? 0)}66`,
          }}>
            {fmt(m.value)}
          </p>
          <p style={{ fontFamily: fontSans, fontSize: 11, color: C.muted, margin: 0, textTransform: "uppercase", letterSpacing: "0.12em" }}>
            {m.label}
          </p>
        </Card>
      ))}
    </div>
  );
}

function SentimentPanel({ analysis }) {
  const dist = analysis?.distribution ?? {};
  return (
    <Card>
      <Label>Sentiment Distribution</Label>
      <MiniBar label="Positive" value={dist.positive ?? 0} color={C.green} />
      <MiniBar label="Neutral" value={dist.neutral ?? 0} color={C.yellow} />
      <MiniBar label="Negative" value={dist.negative ?? 0} color={C.red} />
    </Card>
  );
}

function InsightPanel({ analysis }) {
  const ins = analysis?.insight ?? {};
  const fields = [
    { key: "video_summary", label: "Summary" },
    { key: "audience_reaction", label: "Audience Reaction" },
    { key: "agreement", label: "Agreement" },
    { key: "reason", label: "Reason" },
    { key: "sentiment_strength", label: "Strength" },
  ];
  return (
    <Card>
      <Label>AI Insight</Label>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {fields.map((f) =>
          ins[f.key] ? (
            <div key={f.key} style={{ borderBottom: `1px solid ${C.border}`, paddingBottom: 12 }}>
              <p style={{ fontFamily: fontSans, fontSize: 10, fontWeight: 700, color: C.accent, textTransform: "uppercase", letterSpacing: "0.12em", margin: "0 0 4px" }}>
                {f.label}
              </p>
              <p style={{ fontFamily: fontSans, fontSize: 13, color: C.text, margin: 0, lineHeight: 1.6 }}>{ins[f.key]}</p>
            </div>
          ) : null
        )}
      </div>
    </Card>
  );
}

// ─── MAIN DASHBOARD ───────────────────────────────────────────────────────────
export default function Dashboard() {
  const [page, setPage] = useState("dashboard");
  const [history, setHistory] = useState([]);
  const [videoId, setVideoId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [analysis, setAnalysis] = useState(null);
  const [activeTab, setActiveTab] = useState("metrics");
  const [user, setUser] = useState(null);

  useEffect(() => { injectFonts(); }, []);

  useEffect(() => {
    const unsub = auth.onAuthStateChanged((u) => setUser(u));
    return unsub;
  }, []);

  useEffect(() => { fetchHistory(); }, []);

  const token = () => localStorage.getItem("token");

  const fetchHistory = async () => {
    try {
      const res = await fetch(`${API_URL}/history`, { headers: { Authorization: `Bearer ${token()}` } });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail);
      setHistory(data);
    } catch (err) { setError(err.message); }
  };

  const runAnalysis = async (vid) => {
    setLoading(true); setError(""); setAnalysis(null);
    try {
      const res = await fetch(`${API_URL}/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token()}` },
        body: JSON.stringify({ video_id: vid }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail);
      setAnalysis(data); fetchHistory(); setVideoId("");
    } catch (err) { setError(err.message); }
    setLoading(false);
  };

  const handleLogout = async () => {
    await signOut(auth);
    localStorage.removeItem("token");
    window.location.reload();
  };

  if (page === "timeline") return <TimelinePage analysis={analysis} onBack={() => setPage("dashboard")} />;
  if (page === "comments") return <CommentsPage analysis={analysis} onBack={() => setPage("dashboard")} />;
  if (page === "profile") return <ProfilePage user={user} history={history} onBack={() => setPage("dashboard")} onLogout={handleLogout} />;

  const tabs = ["metrics", "virality", "sentiment", "insight"];

  return (
    <div style={{ minHeight: "100vh", background: C.bg, color: C.text, fontFamily: fontSans, paddingBottom: 60 }}>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: ${C.surface}; }
        ::-webkit-scrollbar-thumb { background: ${C.border}; border-radius: 3px; }
      `}</style>

      {/* NAV */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 50,
        background: C.surface + "f0", backdropFilter: "blur(16px)",
        borderBottom: `1px solid ${C.border}`,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 28px", height: 56,
      }}>
        <span style={{
          fontFamily: fontSans, fontWeight: 800, fontSize: 16,
          background: `linear-gradient(90deg, ${C.accent}, ${C.purple})`,
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
        }}>
          VideoIntel
        </span>
        <button onClick={() => setPage("profile")} style={{
          background: C.accentDim, border: `1px solid rgba(0,229,255,.2)`,
          borderRadius: "50%", width: 34, height: 34,
          display: "flex", alignItems: "center", justifyContent: "center",
          cursor: "pointer", color: C.accent, fontFamily: fontSans, fontWeight: 700, fontSize: 13,
        }}>
          {user?.email?.[0]?.toUpperCase() ?? "U"}
        </button>
      </nav>

      <div style={{ maxWidth: 960, margin: "0 auto", padding: "28px 20px" }}>
        {/* INPUT */}
        <div style={{
          display: "flex", gap: 10, marginBottom: 28,
          background: C.card, border: `1px solid ${C.border}`,
          borderRadius: 14, padding: "14px 18px",
        }}>
          <input
            value={videoId}
            onChange={(e) => setVideoId(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && runAnalysis(videoId)}
            placeholder="Paste YouTube Video ID…"
            style={{ flex: 1, background: "transparent", border: "none", outline: "none", color: C.text, fontFamily: font, fontSize: 14 }}
          />
          <Btn onClick={() => runAnalysis(videoId)} disabled={loading || !videoId.trim()}>
            {loading ? "Analyzing…" : "Analyze"}
          </Btn>
        </div>

        {error && (
          <div style={{
            background: C.redDim, border: `1px solid rgba(255,79,107,.3)`,
            borderRadius: 10, padding: "10px 16px", marginBottom: 20,
            color: C.red, fontFamily: font, fontSize: 13,
          }}>⚠ {error}</div>
        )}

        <div style={{ display: "grid", gridTemplateColumns: "250px 1fr", gap: 20 }}>
          {/* SIDEBAR */}
          <Card style={{ padding: "16px 16px", alignSelf: "start" }}>
            <Label>History</Label>
            {history.length === 0 && <p style={{ color: C.muted, fontSize: 12, margin: 0 }}>No videos yet</p>}
            <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
              {history.map((item, i) => (
                <button key={i} onClick={() => runAnalysis(item.video_id)} style={{
                  background: analysis?.video_id === item.video_id ? C.accentDim : "transparent",
                  border: `1px solid ${analysis?.video_id === item.video_id ? C.accent + "44" : "transparent"}`,
                  borderRadius: 9, padding: "9px 11px", cursor: "pointer", textAlign: "left", width: "100%",
                  transition: "all .15s",
                }}>
                  <p style={{ fontFamily: fontSans, fontSize: 12, fontWeight: 600, color: C.text, margin: "0 0 2px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {item.title || item.video_id}
                  </p>
                  <p style={{ fontFamily: font, fontSize: 10, color: C.muted, margin: 0 }}>
                    {fmtTs(item.created_at || item.timestamp)}
                  </p>
                </button>
              ))}
            </div>
          </Card>

          {/* MAIN */}
          <div>
            {!analysis && !loading && (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: 320, color: C.muted }}>
                <span style={{ fontSize: 52, marginBottom: 14 }}>🎬</span>
                <p style={{ fontFamily: fontSans, fontSize: 15 }}>Enter a YouTube Video ID to begin analysis</p>
              </div>
            )}

            {loading && (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: 320 }}>
                <div style={{ width: 42, height: 42, border: `3px solid ${C.border}`, borderTopColor: C.accent, borderRadius: "50%", animation: "spin .8s linear infinite", marginBottom: 16 }} />
                <p style={{ fontFamily: fontSans, color: C.textSub, fontSize: 14 }}>Running pipeline…</p>
              </div>
            )}

            {analysis && !loading && (
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {/* TABS */}
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {tabs.map((t) => (
                    <button key={t} onClick={() => setActiveTab(t)} style={{
                      fontFamily: fontSans, fontSize: 12, fontWeight: 600,
                      textTransform: "capitalize", letterSpacing: "0.05em",
                      padding: "7px 18px", borderRadius: 9, border: "none", cursor: "pointer",
                      background: activeTab === t ? C.accent : C.card,
                      color: activeTab === t ? "#000" : C.textSub,
                      transition: "all .15s",
                    }}>{t}</button>
                  ))}
                </div>

                {activeTab === "metrics" && <MetricsPanel analysis={analysis} />}
                {activeTab === "virality" && <ViralityPanel analysis={analysis} />}
                {activeTab === "sentiment" && <SentimentPanel analysis={analysis} />}
                {activeTab === "insight" && <InsightPanel analysis={analysis} />}

                {/* GRAPH BUTTONS */}
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap", paddingTop: 4 }}>
                  <Btn variant="outline" onClick={() => setPage("timeline")}>
                    📈 Sentiment Timeline Graph
                  </Btn>
                  <Btn variant="outline" onClick={() => setPage("comments")}>
                    💬 Comments Sentiment Graph
                  </Btn>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}