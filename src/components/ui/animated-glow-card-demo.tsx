import { Card, CardCanvas } from "@/components/ui/animated-glow-card";
import { XCard } from "@/components/ui/x-gradient-card";

const xCardDummyData = {
  authorName: "EaseMise",
  authorHandle: "easemize",
  authorImage:
    "https://pbs.twimg.com/profile_images/1854916060807675904/KtBJsyWr_400x400.jpg",
  content: [
    "The outer container with borders and dots is the actual Card.",
    "Wrap it around any content to get a glow card treatment.",
  ],
  isVerified: true,
  timestamp: "Today",
  reply: {
    authorName: "GoodGuy",
    authorHandle: "gdguy",
    authorImage:
      "https://pbs.twimg.com/profile_images/1593304942210478080/TUYae5z7_400x400.jpg",
    content: "It's easy to use and great to customize.",
    isVerified: true,
    timestamp: "10 minutes ago",
  },
};

export function AnimatedGlowCardDemo() {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-black">
      <CardCanvas>
        <Card className="w-auto p-6">
          <div className="dark">
            <XCard {...xCardDummyData} />
          </div>
        </Card>
      </CardCanvas>
    </div>
  );
}
