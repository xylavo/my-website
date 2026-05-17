// ============================================================
//  App.jsx — EmailJS 문의 폼
//  사전 준비:
//    1. npm install @emailjs/browser
//    2. 프로젝트 루트에 .env 파일 생성 (아래 내용 채우기)
//
//  .env 파일 내용 예시:
//    VITE_EMAILJS_SERVICE_ID=service_xxxxxxx
//    VITE_EMAILJS_TEMPLATE_ID=template_xxxxxxx
//    VITE_EMAILJS_PUBLIC_KEY=xxxxxxxxxxxxxxx
//
//  EmailJS 설정 방법:
//    1. https://www.emailjs.com 에서 무료 가입
//    2. Email Services 탭 → Gmail 연결 → Service ID 복사
//    3. Email Templates 탭 → 템플릿 생성 → Template ID 복사
//       (템플릿 변수: {{from_name}}, {{from_email}}, {{message}})
//    4. Account 탭 → Public Key 복사
// ============================================================

import { useState } from "react";
import emailjs from "@emailjs/browser";

// .env에서 값을 불러옵니다 (VITE_ 접두사 필수)
const SERVICE_ID  = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const PUBLIC_KEY  = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
console.log("PUBLIC_KEY:", PUBLIC_KEY); // 추가

export default function App() {
  // 입력 값 관리
  const [form, setForm] = useState({
    from_name:  "",
    from_email: "",
    message:    "",
  });

  // 전송 상태 관리: "idle" | "sending" | "success" | "error"
  const [status, setStatus] = useState("idle");

  // 입력 필드가 바뀔 때마다 실행
  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  // 제출 버튼 클릭 시 실행
  async function handleSubmit(e) {
    e.preventDefault(); // 페이지 새로고침 방지
    setStatus("sending");

    try {
      await emailjs.send(SERVICE_ID, TEMPLATE_ID, form, PUBLIC_KEY);
      setStatus("success");
      setForm({ from_name: "", from_email: "", message: "" }); // 폼 초기화
    } catch (error) {
      console.error("전송 실패:", error);
      setStatus("error");
    }
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>

        {/* 제목 */}
        <h1 style={styles.title}>문의하기</h1>
        <p style={styles.subtitle}>궁금한 점을 남겨주세요. 빠르게 답변드리겠습니다.</p>

        {/* 문의 폼 */}
        <form onSubmit={handleSubmit} style={styles.form}>

          {/* 이름 */}
          <label style={styles.label}>이름</label>
          <input
            type="text"
            name="from_name"
            value={form.from_name}
            onChange={handleChange}
            placeholder="홍길동"
            required
            style={styles.input}
          />

          {/* 이메일 */}
          <label style={styles.label}>이메일</label>
          <input
            type="email"
            name="from_email"
            value={form.from_email}
            onChange={handleChange}
            placeholder="example@email.com"
            required
            style={styles.input}
          />

          {/* 메시지 */}
          <label style={styles.label}>메시지</label>
          <textarea
            name="message"
            value={form.message}
            onChange={handleChange}
            placeholder="문의 내용을 입력해주세요."
            required
            rows={5}
            style={{ ...styles.input, resize: "vertical" }}
          />

          {/* 제출 버튼 */}
          <button
            type="submit"
            disabled={status === "sending"}
            style={{
              ...styles.button,
              opacity: status === "sending" ? 0.6 : 1,
              cursor:  status === "sending" ? "not-allowed" : "pointer",
            }}
          >
            {status === "sending" ? "전송 중..." : "보내기"}
          </button>
        </form>

        {/* 전송 성공 메시지 */}
        {status === "success" && (
          <p style={{ ...styles.feedback, color: "#16a34a" }}>
            ✅ 메시지가 성공적으로 전송되었습니다!
          </p>
        )}

        {/* 전송 실패 메시지 */}
        {status === "error" && (
          <p style={{ ...styles.feedback, color: "#dc2626" }}>
            ❌ 전송에 실패했습니다. 잠시 후 다시 시도해주세요.
          </p>
        )}

      </div>
    </div>
  );
}

// ─── 스타일 ────────────────────────────────────────────────
const styles = {
  page: {
    minHeight:       "100vh",
    display:         "flex",
    alignItems:      "center",
    justifyContent:  "center",
    backgroundColor: "#f5f5f5",
    fontFamily:      "'Noto Sans KR', sans-serif",
    padding:         "24px",
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius:    "16px",
    boxShadow:       "0 4px 24px rgba(0,0,0,0.08)",
    padding:         "40px",
    width:           "100%",
    maxWidth:        "480px",
  },
  title: {
    fontSize:   "24px",
    fontWeight: "700",
    margin:     "0 0 8px",
    color:      "#111111",
  },
  subtitle: {
    fontSize:    "14px",
    color:       "#666666",
    margin:      "0 0 28px",
    lineHeight:  "1.6",
  },
  form: {
    display:       "flex",
    flexDirection: "column",
    gap:           "4px",
  },
  label: {
    fontSize:   "13px",
    fontWeight: "600",
    color:      "#333333",
    marginTop:  "12px",
  },
  input: {
    padding:      "10px 14px",
    border:       "1.5px solid #e0e0e0",
    borderRadius: "8px",
    fontSize:     "14px",
    color:        "#111111",
    outline:      "none",
    transition:   "border-color 0.2s",
    marginTop:    "4px",
  },
  button: {
    marginTop:       "20px",
    padding:         "12px",
    backgroundColor: "#111111",
    color:           "#ffffff",
    border:          "none",
    borderRadius:    "8px",
    fontSize:        "15px",
    fontWeight:      "600",
    transition:      "background-color 0.2s",
  },
  feedback: {
    marginTop:  "16px",
    fontSize:   "14px",
    fontWeight: "500",
    textAlign:  "center",
  },
};
