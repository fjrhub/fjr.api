export default function Home() {
  return (
    <main style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>🤖 Telegram Bot is Running on Vercel</h1>
      <p>Webhook URL: <code>/api/webhook/[secret]</code></p>
      <p>Send /start to your bot on Telegram to test it!</p>
    </main>
  );
}
