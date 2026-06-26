// import { useState } from "react";
// import { signInWithEmailAndPassword } from "firebase/auth";
// import { auth } from "../firebase";
// import "./auth.css";

// function Login() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");

//   const handleLogin = async () => {
//     try {
//       await signInWithEmailAndPassword(auth, email, password);
//       alert("Login successful");
//     } catch (err) {
//       alert(err.message);
//     }
//   };

//   return (
//     <div className="auth-container">
//       <h2>Login</h2>
//       <input placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
//       <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
//       <button onClick={handleLogin}>Login</button>
//     </div>
//   );
// }

// export default Login;

import { useState, useEffect } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [focused, setFocused] = useState("");
  const [mounted, setMounted] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // inject fonts
    if (!document.getElementById("vi-auth-fonts")) {
      const l = document.createElement("link");
      l.id = "vi-auth-fonts";
      l.rel = "stylesheet";
      l.href = "https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap";
      document.head.appendChild(l);
    }
    const t = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(t);
  }, []);

  const handleLogin = async () => {
    if (!email || !password) { setError("Please fill in all fields"); return; }
    setLoading(true); setError("");
    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      const token = await cred.user.getIdToken();
      localStorage.setItem("token", token);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message.replace("Firebase: ", "").replace(/\(auth.*\)\.?/, "").trim());
    }
    setLoading(false);
  };

  const C = {
    bg: "#080a0f", surface: "#0e1118", card: "#141720",
    border: "#1e2330", borderLight: "#252d3d",
    accent: "#00e5ff", accentDim: "rgba(0,229,255,0.10)",
    accentGlow: "rgba(0,229,255,0.3)",
    text: "#dde3f0", textSub: "#7b8aaa", muted: "#3d4559",
    red: "#ff4f6b", redDim: "rgba(255,79,107,0.12)",
    purple: "#b388ff",
  };
  const font = `'JetBrains Mono', monospace`;
  const fontSans = `'Outfit', 'Segoe UI', sans-serif`;

  return (
    <div style={{
      minHeight: "100vh", background: C.bg,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: fontSans, padding: "20px",
      position: "relative", overflow: "hidden",
    }}>
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse-ring {
          0%   { transform: scale(1);   opacity: 0.4; }
          100% { transform: scale(1.5); opacity: 0; }
        }
        @keyframes grid-drift {
          0%   { transform: translateY(0); }
          100% { transform: translateY(40px); }
        }
        .vi-input:focus { outline: none; }
        .vi-btn-main:hover { background: #00c8e0 !important; transform: translateY(-1px); }
        .vi-btn-main:active { transform: translateY(0); }
        .vi-link:hover { color: #00e5ff !important; }
      `}</style>

      {/* Animated grid background */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        backgroundImage: `
          linear-gradient(rgba(0,229,255,0.03) 1px, transparent 1px),
          linear-gradient(90deg, rgba(0,229,255,0.03) 1px, transparent 1px)
        `,
        backgroundSize: "48px 48px",
        animation: "grid-drift 12s linear infinite alternate",
      }} />

      {/* Ambient glow blobs */}
      <div style={{
        position: "absolute", width: 400, height: 400, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(0,229,255,0.06) 0%, transparent 70%)",
        top: "-80px", left: "-80px", pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute", width: 320, height: 320, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(179,136,255,0.07) 0%, transparent 70%)",
        bottom: "-60px", right: "-40px", pointerEvents: "none",
      }} />

      {/* Card */}
      <div style={{
        width: "100%", maxWidth: 420,
        background: C.card,
        border: `1px solid ${C.borderLight}`,
        borderRadius: 20,
        padding: "44px 40px",
        position: "relative",
        boxShadow: `0 0 0 1px ${C.border}, 0 32px 80px rgba(0,0,0,0.6), 0 0 60px rgba(0,229,255,0.04)`,
        opacity: mounted ? 1 : 0,
        transform: mounted ? "translateY(0)" : "translateY(20px)",
        transition: "opacity .5s ease, transform .5s ease",
      }}>
        {/* Top accent line */}
        <div style={{
          position: "absolute", top: 0, left: "20%", right: "20%", height: 2,
          background: `linear-gradient(90deg, transparent, ${C.accent}, transparent)`,
          borderRadius: "0 0 2px 2px",
        }} />

        {/* Logo mark */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            width: 52, height: 52, borderRadius: 14,
            background: C.accentDim,
            border: `1px solid rgba(0,229,255,0.2)`,
            marginBottom: 16, position: "relative",
          }}>
            <div style={{
              position: "absolute", inset: -6, borderRadius: 20,
              border: `1px solid rgba(0,229,255,0.08)`,
              animation: "pulse-ring 2.5s ease-out infinite",
            }} />
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
              <path d="M3 12h18M3 6h18M3 18h12" stroke={C.accent} strokeWidth="2" strokeLinecap="round"/>
              <circle cx="19" cy="18" r="3" fill={C.accent} opacity="0.8"/>
            </svg>
          </div>
          <h1 style={{
            fontFamily: fontSans, fontWeight: 800, fontSize: 22,
            background: `linear-gradient(90deg, ${C.accent}, ${C.purple})`,
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            margin: "0 0 5px",
          }}>VideoIntel</h1>
          <p style={{ fontFamily: fontSans, fontSize: 13, color: C.muted, margin: 0 }}>
            Sign in to your account
          </p>
        </div>

        {/* Error */}
        {error && (
          <div style={{
            background: C.redDim, border: `1px solid rgba(255,79,107,0.3)`,
            borderRadius: 10, padding: "10px 14px", marginBottom: 20,
            color: C.red, fontFamily: font, fontSize: 12,
            display: "flex", alignItems: "center", gap: 8,
          }}>
            <span>⚠</span> {error}
          </div>
        )}

        {/* Fields */}
        {[
          { label: "Email", key: "email", type: "email", val: email, set: setEmail, placeholder: "you@example.com" },
          { label: "Password", key: "password", type: "password", val: password, set: setPassword, placeholder: "••••••••" },
        ].map((f, i) => (
          <div key={f.key} style={{ marginBottom: 18,
            opacity: mounted ? 1 : 0,
            transform: mounted ? "translateY(0)" : "translateY(12px)",
            transition: `opacity .4s ease ${0.15 + i * 0.08}s, transform .4s ease ${0.15 + i * 0.08}s`,
          }}>
            <label style={{
              display: "block", fontFamily: fontSans, fontSize: 11, fontWeight: 600,
              color: focused === f.key ? C.accent : C.textSub,
              textTransform: "uppercase", letterSpacing: "0.12em",
              marginBottom: 8, transition: "color .15s",
            }}>
              {f.label}
            </label>
            <div style={{
              position: "relative",
              border: `1px solid ${focused === f.key ? C.accent : C.border}`,
              borderRadius: 11, overflow: "hidden",
              transition: "border-color .15s",
              boxShadow: focused === f.key ? `0 0 0 3px ${C.accentDim}, 0 0 16px rgba(0,229,255,0.08)` : "none",
            }}>
              <input
                className="vi-input"
                type={f.type}
                placeholder={f.placeholder}
                value={f.val}
                onChange={(e) => f.set(e.target.value)}
                onFocus={() => setFocused(f.key)}
                onBlur={() => setFocused("")}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                style={{
                  width: "100%", background: C.surface,
                  border: "none", padding: "13px 16px",
                  color: C.text, fontFamily: font, fontSize: 13,
                  boxSizing: "border-box",
                }}
              />
            </div>
          </div>
        ))}

        {/* Forgot password */}
        <div style={{ textAlign: "right", marginBottom: 24, marginTop: -10 }}>
          <span style={{
            fontFamily: fontSans, fontSize: 12, color: C.muted,
            cursor: "pointer", transition: "color .15s",
          }}
            className="vi-link"
          >
            Forgot password?
          </span>
        </div>

        {/* Submit */}
        <button
          className="vi-btn-main"
          onClick={handleLogin}
          disabled={loading}
          style={{
            width: "100%", padding: "14px",
            background: loading ? C.muted : C.accent,
            border: "none", borderRadius: 11,
            color: "#000", fontFamily: fontSans,
            fontSize: 14, fontWeight: 700,
            cursor: loading ? "not-allowed" : "pointer",
            transition: "all .18s",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            boxShadow: loading ? "none" : `0 0 24px rgba(0,229,255,0.25)`,
          }}
        >
          {loading ? (
            <>
              <span style={{
                display: "inline-block", width: 14, height: 14,
                border: "2px solid rgba(0,0,0,0.3)", borderTopColor: "#000",
                borderRadius: "50%", animation: "spin .7s linear infinite",
              }} />
              Signing in…
            </>
          ) : "Sign In →"}
        </button>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

        {/* Divider */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "24px 0 20px" }}>
          <div style={{ flex: 1, height: 1, background: C.border }} />
          <span style={{ fontFamily: fontSans, fontSize: 11, color: C.muted }}>NEW HERE?</span>
          <div style={{ flex: 1, height: 1, background: C.border }} />
        </div>

        <button
          onClick={() => navigate("/signup")}
          style={{
            width: "100%", padding: "13px",
            background: "transparent",
            border: `1px solid ${C.borderLight}`,
            borderRadius: 11, color: C.textSub,
            fontFamily: fontSans, fontSize: 14, fontWeight: 600,
            cursor: "pointer", transition: "all .18s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = C.accent + "66";
            e.currentTarget.style.color = C.text;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = C.borderLight;
            e.currentTarget.style.color = C.textSub;
          }}
        >
          Create an Account
        </button>
      </div>
    </div>
  );
}