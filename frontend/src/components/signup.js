// import { useState } from "react";
// import { createUserWithEmailAndPassword } from "firebase/auth";
// import { auth } from "../firebase";
// import "./auth.css";

// function Signup() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");

//   const handleSignup = async () => {
//     try {
//       await createUserWithEmailAndPassword(auth, email, password);
//       alert("Signup successful");
//     } catch (err) {
//       alert(err.message);
//     }
//   };

//   return (
//     <div className="auth-container">
//       <h2>Signup</h2>
//       <input placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
//       <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
//       <button onClick={handleSignup}>Signup</button>
//     </div>
//   );
// }

// export default Signup;
// import { useState } from "react";
// import { createUserWithEmailAndPassword } from "firebase/auth";
// import { auth } from "../firebase";
// import { useNavigate } from "react-router-dom";
// import "./auth.css";

// function Signup() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const navigate = useNavigate();

//   const handleSignup = async () => {
//     try {
//       const userCredential = await createUserWithEmailAndPassword(
//         auth,
//         email,
//         password
//       );

//       // 🔥 Auto login → get token
//       const token = await userCredential.user.getIdToken();
//       localStorage.setItem("token", token);

//       alert("Signup successful");

//       // 🚀 Directly go to dashboard
//       navigate("/dashboard");

//     } catch (err) {
//       alert(err.message);
//     }
//   };

//   return (
//     <div className="auth-container">
//       <h2>Signup</h2>

//       <input
//         placeholder="Email"
//         onChange={(e) => setEmail(e.target.value)}
//       />

//       <input
//         type="password"
//         placeholder="Password"
//         onChange={(e) => setPassword(e.target.value)}
//       />

//       <button onClick={handleSignup}>Signup</button>

//       <p>
//         Already have an account?{" "}
//         <span
//           style={{ color: "blue", cursor: "pointer" }}
//           onClick={() => navigate("/login")}
//         >
//           Login
//         </span>
//       </p>
//     </div>
//   );
// }

// export default Signup;

import { useState, useEffect } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [focused, setFocused] = useState("");
  const [mounted, setMounted] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
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

  // Password strength
  const strength = (() => {
    if (!password) return 0;
    let s = 0;
    if (password.length >= 8) s++;
    if (/[A-Z]/.test(password)) s++;
    if (/[0-9]/.test(password)) s++;
    if (/[^A-Za-z0-9]/.test(password)) s++;
    return s;
  })();
  const strengthLabel = ["", "Weak", "Fair", "Good", "Strong"][strength];
  const strengthColor = ["", "#ff4f6b", "#ffc947", "#00e676", "#00e5ff"][strength];

  const handleSignup = async () => {
    if (!email || !password || !confirm) { setError("Please fill in all fields"); return; }
    if (password !== confirm) { setError("Passwords don't match"); return; }
    if (password.length < 6) { setError("Password must be at least 6 characters"); return; }
    setLoading(true); setError("");
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
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

  const fields = [
    { label: "Email", key: "email", type: "email", val: email, set: setEmail, placeholder: "you@example.com" },
    { label: "Password", key: "password", type: "password", val: password, set: setPassword, placeholder: "Min. 8 characters" },
    { label: "Confirm Password", key: "confirm", type: "password", val: confirm, set: setConfirm, placeholder: "Repeat password" },
  ];

  return (
    <div style={{
      minHeight: "100vh", background: C.bg,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: fontSans, padding: "20px",
      position: "relative", overflow: "hidden",
    }}>
      <style>{`
        @keyframes fadeUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse-ring { 0% { transform:scale(1); opacity:0.4; } 100% { transform:scale(1.6); opacity:0; } }
        @keyframes grid-drift { 0% { transform:translateY(0); } 100% { transform:translateY(40px); } }
        .vi-input:focus { outline: none; }
        .vi-create:hover { transform: translateY(-1px); box-shadow: 0 0 28px rgba(0,229,255,0.28) !important; background: #00c8e0 !important; }
        .vi-create:active { transform: translateY(0); }
      `}</style>

      {/* Grid bg */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        backgroundImage: `
          linear-gradient(rgba(0,229,255,0.025) 1px, transparent 1px),
          linear-gradient(90deg, rgba(179,136,255,0.025) 1px, transparent 1px)
        `,
        backgroundSize: "48px 48px",
        animation: "grid-drift 14s linear infinite alternate",
      }} />

      {/* Blobs */}
      <div style={{
        position: "absolute", width: 380, height: 380, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(179,136,255,0.06) 0%, transparent 70%)",
        top: "-60px", right: "-60px", pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute", width: 300, height: 300, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(0,229,255,0.05) 0%, transparent 70%)",
        bottom: "-50px", left: "-30px", pointerEvents: "none",
      }} />

      {/* Card */}
      <div style={{
        width: "100%", maxWidth: 440,
        background: C.card,
        border: `1px solid ${C.borderLight}`,
        borderRadius: 20, padding: "44px 40px",
        position: "relative",
        boxShadow: `0 0 0 1px ${C.border}, 0 32px 80px rgba(0,0,0,0.6), 0 0 60px rgba(179,136,255,0.04)`,
        opacity: mounted ? 1 : 0,
        transform: mounted ? "translateY(0)" : "translateY(20px)",
        transition: "opacity .5s ease, transform .5s ease",
      }}>
        {/* Top purple accent line */}
        <div style={{
          position: "absolute", top: 0, left: "20%", right: "20%", height: 2,
          background: `linear-gradient(90deg, transparent, ${C.purple}, transparent)`,
          borderRadius: "0 0 2px 2px",
        }} />

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            width: 52, height: 52, borderRadius: 14,
            background: "rgba(179,136,255,0.1)",
            border: `1px solid rgba(179,136,255,0.2)`,
            marginBottom: 16, position: "relative",
          }}>
            <div style={{
              position: "absolute", inset: -6, borderRadius: 20,
              border: `1px solid rgba(179,136,255,0.08)`,
              animation: "pulse-ring 2.5s ease-out infinite",
            }} />
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="8" r="4" stroke={C.purple} strokeWidth="2"/>
              <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke={C.purple} strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <h1 style={{
            fontFamily: fontSans, fontWeight: 800, fontSize: 22,
            background: `linear-gradient(90deg, ${C.purple}, ${C.accent})`,
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            margin: "0 0 5px",
          }}>Create Account</h1>
          <p style={{ fontFamily: fontSans, fontSize: 13, color: C.muted, margin: 0 }}>
            Join VideoIntel today
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
        {fields.map((f, i) => (
          <div key={f.key} style={{
            marginBottom: 16,
            opacity: mounted ? 1 : 0,
            transform: mounted ? "translateY(0)" : "translateY(12px)",
            transition: `opacity .4s ease ${0.1 + i * 0.07}s, transform .4s ease ${0.1 + i * 0.07}s`,
          }}>
            <label style={{
              display: "block", fontFamily: fontSans, fontSize: 11, fontWeight: 600,
              color: focused === f.key ? C.purple : C.textSub,
              textTransform: "uppercase", letterSpacing: "0.12em",
              marginBottom: 7, transition: "color .15s",
            }}>
              {f.label}
            </label>
            <div style={{
              border: `1px solid ${focused === f.key ? C.purple : C.border}`,
              borderRadius: 11, overflow: "hidden", transition: "border-color .15s",
              boxShadow: focused === f.key ? `0 0 0 3px rgba(179,136,255,0.1), 0 0 16px rgba(179,136,255,0.06)` : "none",
            }}>
              <input
                className="vi-input"
                type={f.type}
                placeholder={f.placeholder}
                value={f.val}
                onChange={(e) => f.set(e.target.value)}
                onFocus={() => setFocused(f.key)}
                onBlur={() => setFocused("")}
                onKeyDown={(e) => e.key === "Enter" && handleSignup()}
                style={{
                  width: "100%", background: C.surface,
                  border: "none", padding: "13px 16px",
                  color: C.text, fontFamily: font, fontSize: 13,
                  boxSizing: "border-box",
                }}
              />
            </div>

            {/* Password strength meter */}
            {f.key === "password" && password.length > 0 && (
              <div style={{ marginTop: 8 }}>
                <div style={{ display: "flex", gap: 4 }}>
                  {[1, 2, 3, 4].map((n) => (
                    <div key={n} style={{
                      flex: 1, height: 3, borderRadius: 2,
                      background: n <= strength ? strengthColor : C.border,
                      transition: "background .3s ease",
                    }} />
                  ))}
                </div>
                {strengthLabel && (
                  <p style={{ fontFamily: fontSans, fontSize: 11, color: strengthColor, margin: "4px 0 0", transition: "color .3s" }}>
                    {strengthLabel} password
                  </p>
                )}
              </div>
            )}

            {/* Confirm match indicator */}
            {f.key === "confirm" && confirm.length > 0 && (
              <p style={{
                fontFamily: fontSans, fontSize: 11,
                color: confirm === password ? "#00e676" : C.red,
                margin: "4px 0 0",
              }}>
                {confirm === password ? "✓ Passwords match" : "✗ Passwords don't match"}
              </p>
            )}
          </div>
        ))}

        {/* Submit */}
        <button
          className="vi-create"
          onClick={handleSignup}
          disabled={loading}
          style={{
            width: "100%", padding: "14px", marginTop: 8,
            background: loading ? C.muted : C.accent,
            border: "none", borderRadius: 11,
            color: "#000", fontFamily: fontSans,
            fontSize: 14, fontWeight: 700,
            cursor: loading ? "not-allowed" : "pointer",
            transition: "all .18s",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            boxShadow: loading ? "none" : `0 0 24px rgba(0,229,255,0.2)`,
          }}
        >
          {loading ? (
            <>
              <span style={{
                display: "inline-block", width: 14, height: 14,
                border: "2px solid rgba(0,0,0,0.3)", borderTopColor: "#000",
                borderRadius: "50%", animation: "spin .7s linear infinite",
              }} />
              Creating account…
            </>
          ) : "Create Account →"}
        </button>

        {/* Divider */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "24px 0 20px" }}>
          <div style={{ flex: 1, height: 1, background: C.border }} />
          <span style={{ fontFamily: fontSans, fontSize: 11, color: C.muted }}>HAVE AN ACCOUNT?</span>
          <div style={{ flex: 1, height: 1, background: C.border }} />
        </div>

        <button
          onClick={() => navigate("/login")}
          style={{
            width: "100%", padding: "13px",
            background: "transparent",
            border: `1px solid ${C.borderLight}`,
            borderRadius: 11, color: C.textSub,
            fontFamily: fontSans, fontSize: 14, fontWeight: 600,
            cursor: "pointer", transition: "all .18s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = C.purple + "66";
            e.currentTarget.style.color = C.text;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = C.borderLight;
            e.currentTarget.style.color = C.textSub;
          }}
        >
          Sign In Instead
        </button>
      </div>
    </div>
  );
}