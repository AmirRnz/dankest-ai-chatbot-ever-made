import ChatWidget from "@/components/chat-widget";
export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">Maple Air Conditioning</h1>
      <p className="mt-4 text-xl">Your comfort is our priority</p>

      {/* Chat widget will appear in the bottom right corner */}
      <ChatWidget />
    </main>
  );
}
